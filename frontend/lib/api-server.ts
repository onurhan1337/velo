import { cookies } from "next/headers";
import { z } from "zod";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function apiServer<T, S = unknown>(options: {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  data?: S;
  schema?: z.Schema<S>;
  requireAuth?: boolean;
}): Promise<ApiResponse<T>> {
  const {
    endpoint,
    method = "GET",
    data,
    schema,
    requireAuth = false,
  } = options;

  try {
    if (schema && data) {
      const validationResult = schema.safeParse(data);
      if (!validationResult.success) {
        return {
          success: false,
          error: validationResult.error.errors[0]?.message || "Invalid data",
        };
      }
    }

    let authToken: string | undefined;
    if (requireAuth) {
      const cookieList = await cookies();
      authToken = cookieList.get("auth_token")?.value;

      if (!authToken) {
        return {
          success: false,
          error: "Authentication required",
        };
      }
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
      }${endpoint}`,
      {
        method,
        headers,
        ...(data && method !== "GET" ? { body: JSON.stringify(data) } : {}),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData.error || `Failed to ${method.toLowerCase()} ${endpoint}`,
      };
    }

    return {
      success: true,
      data: responseData,
    };
  } catch (error) {
    console.error(`API error (${endpoint}):`, error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}

export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
    sameSite: "strict",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set({
    name: "auth_token",
    value: "",
    expires: new Date(0),
    path: "/",
  });
}
