// apps/admin/src/app/api/auth/token/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  return NextResponse.json({ token: token || null });
}
