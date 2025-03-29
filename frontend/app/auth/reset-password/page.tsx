"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { resetPasswordSchema, type ResetPasswordInput } from "@/schemas/auth";
import { resetPasswordAction } from "../actions";
import { useAuth } from "@/hooks/useAuth";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);

  const tokenParam = searchParams?.get("token") || "";
  const hasValidToken = !!tokenParam;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: tokenParam,
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsLoading(true);
    setServerError("");

    try {
      const result = await resetPasswordAction(data);

      if (!result.success) {
        setServerError(result.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      toast.success("Password reset successfully");

      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!hasValidToken && !serverError) {
    setServerError("Invalid or missing reset token");
  }

  if (authLoading) {
    return (
      <>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-pulse">
              Loading authentication status...
            </div>
          </div>
        </CardContent>
      </>
    );
  }

  return (
    <>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reset Password
        </CardTitle>
        <CardDescription className="text-center">
          Enter your new password
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
            <p>Your password has been reset successfully.</p>
            <p className="mt-2">
              You will be redirected to the login page shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new_password">New Password</Label>
              <Input
                id="new_password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading || !hasValidToken}
                aria-invalid={!!errors.new_password}
                {...register("new_password")}
              />
              {errors.new_password && (
                <p className="text-sm text-destructive">
                  {errors.new_password.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="password"
                placeholder="••••••••"
                disabled={isLoading || !hasValidToken}
                aria-invalid={!!errors.confirm_password}
                {...register("confirm_password")}
              />
              {errors.confirm_password && (
                <p className="text-sm text-destructive">
                  {errors.confirm_password.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !hasValidToken}
            >
              {isLoading ? "Resetting password..." : "Reset password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center">
              Loading...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-8">
              <div className="animate-pulse">
                Loading password reset form...
              </div>
            </div>
          </CardContent>
        </>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
