"use server";

import { cookies } from "next/headers";
import { loginSchema, type LoginInput } from "@/schemas/auth";

export async function loginAction(formData: LoginInput) {
  const validationResult = loginSchema.safeParse(formData);

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
      }/auth/login`,
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
        error: responseData.error || "Invalid email or password",
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
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during login",
    };
  }
}
