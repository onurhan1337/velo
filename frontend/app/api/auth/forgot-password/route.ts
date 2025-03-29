import { NextRequest, NextResponse } from "next/server";
import { authApi } from "@/lib/api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate input
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Request password reset
    const response = await authApi.forgotPassword({ email });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Forgot password error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
