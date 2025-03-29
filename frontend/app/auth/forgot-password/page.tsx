"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth";
import { forgotPasswordAction } from "../actions";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    setServerError("");

    try {
      const result = await forgotPasswordAction(data);

      if (!result.success) {
        setServerError(result.error || "Failed to send reset link");
        return;
      }

      setSuccess(true);
      toast.success("Password reset email sent");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Password Reset
        </CardTitle>
        <CardDescription className="text-center">
          Enter your email to receive a password reset link
        </CardDescription>
      </CardHeader>
      <CardContent>
        {serverError && (
          <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
            {serverError}
          </div>
        )}
        {success ? (
          <div className="bg-green-100 text-green-700 p-3 rounded-md">
            <p>Check your email for a link to reset your password.</p>
            <p className="mt-2">
              If you don&apos;t receive an email within a few minutes, check
              your spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                disabled={isLoading}
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending reset link..." : "Send reset link"}
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t p-4">
        <div className="text-sm text-center">
          <Link
            href="/auth/login"
            className="text-primary underline-offset-4 hover:underline"
          >
            Return to login
          </Link>
        </div>
      </CardFooter>
    </>
  );
}
