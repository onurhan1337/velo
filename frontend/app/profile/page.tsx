"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/schemas/auth";
import { updateProfileAction } from "./actions";
import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading: authLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: ProfileUpdateInput) => {
    setIsSaving(true);
    setServerError("");
    setSuccess("");

    try {
      const result = await updateProfileAction(data);

      if (!result.success) {
        setServerError(result.error || "Failed to update profile");
        return;
      }

      setSuccess("Profile updated successfully");
      toast.success("Profile updated successfully");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      setServerError("Failed to logout");
      toast.error("Failed to logout");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    router.push("/auth/login");
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details</CardDescription>
          </CardHeader>
          <CardContent>
            {serverError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md mb-4">
                {serverError}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
                {success}
              </div>
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    disabled={isSaving}
                    aria-invalid={!!errors.first_name}
                    {...register("first_name")}
                  />
                  {errors.first_name && (
                    <p className="text-sm text-destructive">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    disabled={isSaving}
                    aria-invalid={!!errors.last_name}
                    {...register("last_name")}
                  />
                  {errors.last_name && (
                    <p className="text-sm text-destructive">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  disabled={isSaving}
                  aria-invalid={!!errors.email}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving changes..." : "Save changes"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <div className="text-sm text-muted-foreground">
              Account created on{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString()
                : "N/A"}
            </div>
            <Button variant="destructive" onClick={handleLogoutClick}>
              Sign out
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
