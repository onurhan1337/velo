"use server";

import { profileUpdateSchema, type ProfileUpdateInput } from "@/schemas/auth";
import { apiServer } from "@/lib/api-server";
import { logoutAction } from "@/app/auth/actions";

export type ProfileResult = {
  success: boolean;
  user?: Record<string, unknown>;
  error?: string;
};

export async function updateProfileAction(
  formData: ProfileUpdateInput
): Promise<ProfileResult> {
  const result = await apiServer<Record<string, unknown>>({
    endpoint: "/profile",
    method: "PUT",
    data: formData,
    schema: profileUpdateSchema,
    requireAuth: true,
  });

  if (result.success) {
    return {
      success: true,
      user: result.data,
    };
  }

  return {
    success: false,
    error: result.error || "Failed to update profile",
  };
}

export { logoutAction };
