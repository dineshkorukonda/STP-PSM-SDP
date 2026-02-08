"use client";

import { createContext, useContext, useCallback, useState, useMemo } from "react";
import type { User } from "@/types";

type UserContextValue = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  refetch: () => Promise<User | null>;
};

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  const refetch = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    try {
      const res = await fetch("/api/me", { credentials: "include" });
      if (!res.ok) {
        setUser(null);
        return null;
      }
      const data = await res.json();
      const u = { id: data.id, name: data.name ?? "", email: data.email };
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, setUser, refetch }),
    [user, loading, refetch]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
