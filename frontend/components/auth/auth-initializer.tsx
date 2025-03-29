"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import type { User } from "@/interfaces/auth";

interface AuthInitializerProps {
  user: User | null;
  token: string | null;
}

export function AuthInitializer({ user, token }: AuthInitializerProps) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    if (user && token) {
      login(user, token);
    } else {
      logout();
    }
  }, [user, token, login, logout]);

  return null;
}
