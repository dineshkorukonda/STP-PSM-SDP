"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import MobileBottomNav from "./MobileBottomNav";
import { UserProvider } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";
import { dashboardSectionFromPath } from "@/lib/dashboard-nav";

function DashboardShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const section = dashboardSectionFromPath(pathname);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-neutral-50 text-neutral-900 md:h-screen md:max-h-screen md:flex-row md:overflow-hidden">
      <div className="hidden md:flex md:h-full md:shrink-0">
        <Sidebar activeSection={section} mobile={false} />
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col md:overflow-hidden">
        <header className="sticky top-0 z-30 flex min-h-14 shrink-0 items-center justify-between gap-3 border-b border-neutral-800 bg-neutral-900 px-4 py-2 text-white backdrop-blur-md supports-[padding:max(0px)]:pt-[max(0.5rem,env(safe-area-inset-top))] md:hidden">
          <Link href="/dashboard" className="truncate text-lg font-bold text-white">
            SmartPass
          </Link>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="size-11 shrink-0 rounded-xl text-white/80 hover:bg-white/10 hover:text-white"
            onClick={() => void logout()}
            aria-label="Log out"
          >
            <LogOut className="size-5" />
          </Button>
        </header>

        <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden pb-[calc(5.25rem+env(safe-area-inset-bottom))] md:pb-0">
          <div className="w-full max-w-none p-4 sm:p-6 lg:p-8 xl:px-10 2xl:px-12">
            {children}
          </div>
        </main>
      </div>

      <MobileBottomNav />
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
      <div className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-center gap-3 bg-neutral-50 px-4 text-neutral-900">
        <div className="size-9 animate-spin rounded-full border-2 border-[#6B46FE] border-t-transparent" />
        <p className="text-center text-sm text-neutral-500">Loading your dashboard…</p>
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
