// apps/admin/src/app/api/auth/[...action]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api/v1";

// Login
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const actionName = action[0];
  const cookieStore = await cookies();

  try {
    if (actionName === "login") {
      const body = await request.json();

      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      // Verify user has admin/staff role
      if (!["admin", "staff"].includes(data.data.user.role)) {
        return NextResponse.json(
          {
            success: false,
            message: "Access denied. Admin or staff role required.",
          },
          { status: 403 }
        );
      }

      // Set HTTP-only cookie
      cookieStore.set("admin_token", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
      });

      // Store refresh token
      cookieStore.set("admin_refresh_token", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      // Return user data without tokens
      return NextResponse.json({
        success: true,
        message: data.message,
        data: { user: data.data.user },
      });
    }

    if (actionName === "logout") {
      cookieStore.delete("admin_token");
      cookieStore.delete("admin_refresh_token");

      return NextResponse.json({
        success: true,
        message: "Logged out successfully",
      });
    }

    if (actionName === "refresh") {
      const refreshToken = cookieStore.get("admin_refresh_token")?.value;

      if (!refreshToken) {
        return NextResponse.json(
          { success: false, message: "No refresh token" },
          { status: 401 }
        );
      }

      const response = await fetch(`${API_URL}/auth/refresh-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        cookieStore.delete("admin_token");
        cookieStore.delete("admin_refresh_token");
        return NextResponse.json(data, { status: response.status });
      }

      // Update tokens
      cookieStore.set("admin_token", data.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      cookieStore.set("admin_refresh_token", data.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      return NextResponse.json({
        success: true,
        message: "Token refreshed",
      });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// Get current user
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ action: string[] }> }
) {
  const { action } = await params;
  const actionName = action[0];
  const cookieStore = await cookies();

  if (actionName === "me") {
    try {
      const token = cookieStore.get("admin_token")?.value;

      if (!token) {
        return NextResponse.json(
          { success: false, message: "Not authenticated" },
          { status: 401 }
        );
      }

      const response = await fetch(`${API_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        // Try to refresh token
        const refreshToken = cookieStore.get("admin_refresh_token")?.value;

        if (refreshToken) {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();

            // Update token
            cookieStore.set("admin_token", refreshData.data.accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              sameSite: "lax",
              maxAge: 60 * 60 * 24 * 7,
              path: "/",
            });

            // Retry with new token
            const retryResponse = await fetch(`${API_URL}/auth/me`, {
              headers: {
                Authorization: `Bearer ${refreshData.data.accessToken}`,
              },
            });
            return NextResponse.json(await retryResponse.json());
          }
        }

        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data);
    } catch (error: any) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { success: false, message: "Invalid action" },
    { status: 400 }
  );
}
