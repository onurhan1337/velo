import { NextRequest, NextResponse } from "next/server";
import { authApi } from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await authApi.getProfile();

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile error:", error);

    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to get profile" },
      { status: 500 }
    );
  }
}
