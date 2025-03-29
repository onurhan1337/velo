import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json({ error: "Failed to logout" }, { status: 500 });
  }
}
