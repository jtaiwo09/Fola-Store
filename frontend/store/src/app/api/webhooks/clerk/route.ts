import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new NextResponse("Error occurred -- no svix headers", {
      status: 400,
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new NextResponse("Error occurred", {
      status: 400,
    });
  }

  const eventType = evt.type;

  console.log(`🔔 Webhook: ${eventType}`);

  if (eventType === "user.created" || eventType === "user.updated") {
    const {
      id,
      email_addresses,
      first_name,
      last_name,
      phone_numbers,
      image_url,
      unsafe_metadata,
    } = evt.data;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/sync-clerk`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": process.env.WEBHOOK_SECRET || "",
          },
          body: JSON.stringify({
            clerkId: id,
            email: email_addresses?.[0]?.email_address ?? "",
            firstName: first_name || "",
            lastName: last_name || "",
            phone:
              phone_numbers?.[0]?.phone_number ||
              (unsafe_metadata as any)?.phone,
            avatar: image_url,
          }),
        }
      );

      if (response.ok) {
        console.log(
          `✅ User synced: ${email_addresses?.[0]?.email_address ?? ""}`
        );
      } else {
        const error = await response.json();
        console.error("❌ Sync failed:", error);
      }
    } catch (error) {
      console.error("❌ Sync error:", error);
    }
  }

  return new NextResponse("", { status: 200 });
}
