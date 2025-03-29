"use server";

import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  type LoginInput,
  type RegisterInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
} from "@/schemas/auth";
import { apiServer, setAuthCookie, clearAuthCookie } from "@/lib/api-server";

export type AuthResult = {
  success: boolean;
  user?: Record<string, unknown>;
  error?: string;
  message?: string;
};

type AuthResponse = {
  token: string;
  user: Record<string, unknown>;
  message?: string;
};

export async function loginAction(formData: LoginInput): Promise<AuthResult> {
  const result = await apiServer<AuthResponse>({
    endpoint: "/auth/login",
    method: "POST",
    data: formData,
    schema: loginSchema,
  });

  if (result.success && result.data?.token) {
    setAuthCookie(result.data.token);
    return {
      success: true,
      user: result.data.user,
    };
  }

  return {
    success: false,
    error: result.error || "Login failed",
  };
}

export async function registerAction(
  formData: RegisterInput
): Promise<AuthResult> {
  const result = await apiServer<AuthResponse>({
    endpoint: "/auth/register",
    method: "POST",
    data: formData,
    schema: registerSchema,
  });

  if (result.success && result.data?.token) {
    setAuthCookie(result.data.token);
    return {
      success: true,
      user: result.data.user,
    };
  }

  return {
    success: false,
    error: result.error || "Registration failed",
  };
}

type MessageResponse = {
  message: string;
};

export async function forgotPasswordAction(
  formData: ForgotPasswordInput
): Promise<AuthResult> {
  const result = await apiServer<MessageResponse>({
    endpoint: "/auth/forgot-password",
    method: "POST",
    data: formData,
    schema: forgotPasswordSchema,
  });

  return {
    success: result.success,
    error: result.error,
    message: result.data?.message || "Password reset email sent",
  };
}

export async function resetPasswordAction(
  data: ResetPasswordInput
): Promise<AuthResult> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { confirm_password, ...apiData } = data;

  const result = await apiServer<MessageResponse>({
    endpoint: "/auth/reset-password",
    method: "POST",
    data: apiData,
  });

  return {
    success: result.success,
    error: result.error,
    message: result.data?.message || "Password reset successfully",
  };
}

export async function logoutAction(): Promise<AuthResult> {
  try {
    await apiServer({
      endpoint: "/auth/logout",
      method: "POST",
      requireAuth: true,
    });

    clearAuthCookie();

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to logout",
    };
  }
}
