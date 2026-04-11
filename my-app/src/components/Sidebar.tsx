"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { dashboardNavItems, type DashboardSection } from "@/lib/dashboard-nav";

interface SidebarProps {
  activeSection: DashboardSection;
  onNavigate?: () => void;
  mobile?: boolean;
}

export default function Sidebar({
  activeSection,
  onNavigate,
  mobile = false,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
    router.refresh();
  };

  const navContent = (
    <>
      <div className="flex h-16 items-center border-b border-white/10 px-5">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-white"
          onClick={onNavigate}
        >
          SmartPass
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {dashboardNavItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeSection === item.id ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-12 items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#6B46FE] text-white shadow-md"
                  : "text-neutral-300 hover:bg-white/10 hover:text-white"
              )}
            >
              <Icon className="size-5 shrink-0 opacity-90" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          className="mt-auto min-h-12 justify-start gap-3 rounded-xl px-3 text-neutral-400 hover:bg-red-500/10 hover:text-red-300"
          onClick={handleLogout}
        >
          <LogOut className="size-5" aria-hidden />
          Log out
        </Button>
      </nav>
    </>
  );

  const asideClass = mobile
    ? "flex h-full min-h-0 w-72 shrink-0 flex-col bg-neutral-900"
    : "flex h-full min-h-0 w-60 shrink-0 flex-col border-r border-white/10 bg-neutral-900";

  return <aside className={asideClass}>{navContent}</aside>;
}
