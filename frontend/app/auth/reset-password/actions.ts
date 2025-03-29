"use server";

import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";

export async function resetPasswordAction(data: ResetPasswordInput) {
  const validationResult = resetPasswordSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      success: false,
      error: validationResult.error.errors[0].message || "Invalid form data",
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm_password, ...apiData } = validationResult.data;

  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      }/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: responseData.error || "Failed to reset password",
      };
    }

    return {
      success: true,
      message: responseData.message || "Password reset successfully",
    };
  } catch (error) {
    console.error("Reset password error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
