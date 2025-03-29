"use server";

import { cookies } from "next/headers";

export async function logoutAction() {
  try {
    const cookieStore = await cookies();

    cookieStore.set({
      name: "auth_token",
      value: "",
      expires: new Date(0),
      path: "/",
    });

    return {
      success: true,
      message: "Logged out successfully",
    };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during logout",
    };
  }
}
