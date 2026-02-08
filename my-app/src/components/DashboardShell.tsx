"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import DashboardIllustration from "./DashboardIllustration";
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
      <div className="flex flex-1 flex-col overflow-auto lg:flex-row">
        <div className="hidden w-full border-b border-border bg-muted/20 lg:block lg:max-w-[320px] lg:border-b-0 lg:border-r">
          <DashboardIllustration />
        </div>
        <div className="flex-1 p-6 sm:p-8">{children}</div>
      </div>
    </div>
  );
}
