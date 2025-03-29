import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  created_at: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/profile", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          return null;
        }
        throw new Error("Failed to fetch user");
      }

      const userData = await response.json();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch user");
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password");
      }

      setUser(data.user);
      return data.user;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      setUser(null);
      router.push("/auth/login");
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logout failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, [router]);

  const register = useCallback(
    async (userData: {
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Registration failed");
        }

        setUser(data.user);
        return data.user;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Registration failed");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    user,
    loading,
    error,
    fetchUser,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };
}
