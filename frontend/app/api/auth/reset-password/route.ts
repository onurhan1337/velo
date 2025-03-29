import { NextRequest, NextResponse } from "next/server";
import { authApi } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, new_password } = body;

    // Validate input
    if (!token || !new_password) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    // Reset password
    const response = await authApi.resetPassword({ token, new_password });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Reset password error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}
