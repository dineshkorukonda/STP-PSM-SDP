"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  useMemo,
} from "react";
import type { User } from "@/types";

type UserContextValue = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  refetch: () => Promise<User | null>;
};

const UserContext = createContext<UserContextValue | null>(null);

async function loadUserFromSession(): Promise<User | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { user: User | null };
  return data.user;
}

export function UserProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  const refetch = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    try {
      const u = await loadUserFromSession();
      setUser(u);
      return u;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialUser) {
      void loadUserFromSession().then((u) => {
        setUser(u);
        setLoading(false);
      });
    }

    const onFocus = () => {
      void loadUserFromSession().then(setUser);
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [initialUser]);

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
