"use server";

import { cookies } from "next/headers";
import { registerSchema, type RegisterInput } from "@/schemas/auth";

export async function registerAction(formData: RegisterInput) {
  const validationResult = registerSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message || "Invalid form data",
    };
  }

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      }/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validationResult.data),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Failed to register",
      };
    }

    const cookieStore = await cookies();
    cookieStore.set({
      name: "auth_token",
      value: responseData.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24,
      path: "/",
      sameSite: "strict",
    });

    return {
      success: true,
      user: responseData.user,
      token: responseData.token,
    };
  } catch (error) {
    console.error("Register error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during registration",
    };
  }
}
