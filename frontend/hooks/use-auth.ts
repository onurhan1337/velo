"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { loginAction } from "@/app/auth/login/actions";
import { registerAction } from "@/app/auth/register/actions";
import { logoutAction } from "@/app/auth/logout/actions";
import type { LoginInput, RegisterInput } from "@/schemas/auth";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    setLoading,
    setError,
    clearError,
  } = useAuthStore();

  const login = async (data: LoginInput) => {
    try {
      setLoading(true);
      clearError();

      const result = await loginAction(data);

      if (result.success && result.user && result.token) {
        storeLogin(result.user, result.token);
        router.push("/dashboard");
        return true;
      } else {
        setError(result.error || "Login failed");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterInput) => {
    try {
      setLoading(true);
      clearError();

      const result = await registerAction(data);

      if (result.success && result.user && result.token) {
        storeLogin(result.user, result.token);
        router.push("/dashboard");
        return true;
      } else {
        setError(result.error || "Registration failed");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      clearError();

      const result = await logoutAction();

      if (result.success) {
        storeLogout();
        router.push("/auth/login");
        return true;
      } else {
        setError(result.error || "Logout failed");
        return false;
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}
