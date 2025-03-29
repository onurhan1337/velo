import { z } from "zod";

export const emailSchema = z.string().email({
  message: "Please enter a valid email address",
});

export const passwordSchema = z.string().min(8, {
  message: "Password must be at least 8 characters",
});

export const nameSchema = z.string().min(2, {
  message: "Name must be at least 2 characters",
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required" }),
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  first_name: nameSchema,
  last_name: nameSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, { message: "Token is required" }),
    new_password: passwordSchema,
    confirm_password: passwordSchema,
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

export const profileUpdateSchema = z.object({
  first_name: nameSchema,
  last_name: nameSchema,
  email: emailSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
