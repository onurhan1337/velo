import { createContext, useContext, ReactNode, use } from "react";
import { useAuth } from "@/hooks/useAuth";

type AuthContextType = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthContextType | null>(null);

async function loadInitialAuth(fetchUser: () => Promise<unknown>) {
  try {
    await fetchUser();
    return true;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  use(Promise.resolve(loadInitialAuth(auth.fetchUser)));

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
