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
import { createClient } from "@/lib/supabase/client";

type UserContextValue = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  refetch: () => Promise<User | null>;
};

const UserContext = createContext<UserContextValue | null>(null);

async function loadUserFromSession(): Promise<User | null> {
  const supabase = createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser?.email) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", authUser.id)
    .maybeSingle();

  const name =
    profile?.display_name?.trim() ||
    authUser.user_metadata?.full_name ||
    authUser.user_metadata?.name ||
    authUser.email.split("@")[0] ||
    "";

  return {
    id: authUser.id,
    name,
    email: authUser.email,
  };
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
    const supabase = createClient();
    if (!initialUser) {
      void loadUserFromSession().then((u) => {
        setUser(u);
        setLoading(false);
      });
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadUserFromSession().then(setUser);
    });

    return () => subscription.unsubscribe();
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
