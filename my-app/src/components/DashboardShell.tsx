"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { UserProvider } from "@/contexts/UserContext";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

type Section = "dashboard" | "create" | "passes" | "verify";

function getSection(pathname: string): Section {
  if (pathname.startsWith("/dashboard/create")) return "create";
  if (pathname.startsWith("/dashboard/passes")) return "passes";
  if (pathname.startsWith("/dashboard/verify")) return "verify";
  return "dashboard";
}

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const section = getSection(pathname);

  useEffect(() => {
    queueMicrotask(() => setMobileMenuOpen(false));
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <div className="hidden md:block">
        <Sidebar activeSection={section} mobile={false} />
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-border bg-sidebar shadow-xl transition-transform duration-200 ease-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          activeSection={section}
          mobile
          onNavigate={() => setMobileMenuOpen(false)}
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur-md md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            className="flex size-10 shrink-0 items-center justify-center rounded-lg text-foreground hover:bg-accent"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-5 rounded-full bg-current" />
              <span className="block h-0.5 w-4 rounded-full bg-current" />
            </span>
          </button>
          <span className="truncate text-lg font-bold text-primary">SmartPass</span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

async function fetchDashboardUser(): Promise<User | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { user: User | null };
  return data.user;
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardUser()
      .then((u) => {
        if (!u) router.replace("/auth?mode=login");
        else setUser(u);
      })
      .catch(() => router.replace("/auth?mode=login"))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading your dashboard…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <UserProvider initialUser={user}>
      <DashboardShellInner>{children}</DashboardShellInner>
    </UserProvider>
  );
}
