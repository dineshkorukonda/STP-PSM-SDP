"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import { getStoredUser } from "@/lib/storage";

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

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeSection={getSection(pathname)} />
      <div className="flex-1 overflow-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
