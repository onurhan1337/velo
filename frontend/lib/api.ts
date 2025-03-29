import { cookies } from "next/headers";
import {
  User,
  AuthResponse,
  MessageResponse,
  ApiOptions,
} from "@/interfaces/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    cache = "no-store",
    credentials = "include",
  } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get("auth_token");

    if (authCookie?.value) {
      requestHeaders["Authorization"] = `Bearer ${authCookie.value}`;
    }
  } catch (error) {
    console.error("Cookie access error:", error);
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    cache,
    credentials,
  };

  if (body && (method === "POST" || method === "PUT")) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || response.statusText || "An error occurred"
    );
  }

  return response.json() as Promise<T>;
}

export const authApi = {
  register: (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) =>
    apiRequest<AuthResponse>("/auth/register", { method: "POST", body: data }),

  login: (data: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body: data }),

  getProfile: () => apiRequest<User>("/profile", { method: "GET" }),

  forgotPassword: (data: { email: string }) =>
    apiRequest<MessageResponse>("/auth/forgot-password", {
      method: "POST",
      body: data,
    }),

  resetPassword: (data: { token: string; new_password: string }) =>
    apiRequest<MessageResponse>("/auth/reset-password", {
      method: "POST",
      body: data,
    }),

  logout: () => apiRequest<MessageResponse>("/auth/logout", { method: "POST" }),
};
