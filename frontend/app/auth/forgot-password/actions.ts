"use server";

import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";

export async function forgotPasswordAction(formData: ForgotPasswordInput) {
  // Validate form data
  const validationResult = forgotPasswordSchema.safeParse(formData);

  if (!validationResult.success) {
    return {
      success: false,
      error:
        validationResult.error.errors[0].message || "Invalid email address",
    };
  }

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      }/auth/forgot-password`,
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
        error: responseData.error || "Something went wrong",
      };
    }

    return {
      success: true,
      message: responseData.message || "Reset link sent to your email",
    };
  } catch (error) {
    console.error("Forgot password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
