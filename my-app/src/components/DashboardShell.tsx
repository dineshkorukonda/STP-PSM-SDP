"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getStoredUser } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "create" | "passes";

function getSection(pathname: string): Section {
  if (pathname.startsWith("/dashboard/create")) return "create";
  if (pathname.startsWith("/dashboard/passes")) return "passes";
  return "dashboard";
}

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const user = getStoredUser();
    if (!user) {
      router.replace("/login");
    }
  }, [mounted, router]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const user = getStoredUser();
  if (!user) {
    return null;
  }

  const section = getSection(pathname);

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar activeSection={section} mobile={false} />
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-card shadow-xl transition-transform duration-200 ease-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar
          activeSection={section}
          mobile
          onNavigate={() => setMobileMenuOpen(false)}
        />
      </div>

      {/* Main content + mobile header */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card px-4 md:hidden">
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
          <span className="truncate text-lg font-bold text-primary">
            SmartPass
          </span>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
