"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function AuthStatus() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500">Not logged in</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-4">
      <div className="text-sm">
        <span className="font-medium">
          {user?.first_name} {user?.last_name}
        </span>
        <span className="text-xs text-gray-500 block">{user?.email}</span>
      </div>
      <Button variant="outline" size="sm" onClick={() => logout()}>
        Logout
      </Button>
    </div>
  );
}
