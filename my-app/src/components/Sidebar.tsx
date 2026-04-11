"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, PlusCircle, Ticket, QrCode, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "create" | "passes" | "verify";

const navItems: {
  id: Section;
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { id: "create", label: "Create pass", href: "/dashboard/create", icon: PlusCircle },
  { id: "passes", label: "My passes", href: "/dashboard/passes", icon: Ticket },
  { id: "verify", label: "Verify QR", href: "/dashboard/verify", icon: QrCode },
];

interface SidebarProps {
  activeSection: Section;
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
      <div className="flex h-16 items-center border-b border-sidebar-border px-5">
        <Link
          href="/dashboard"
          className="text-lg font-bold tracking-tight text-sidebar-primary"
          onClick={onNavigate}
        >
          SmartPass
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
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
                "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0 opacity-90" aria-hidden />
              {item.label}
            </Link>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          className="mt-auto min-h-11 justify-start gap-3 px-3 text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          <LogOut className="size-4" aria-hidden />
          Log out
        </Button>
      </nav>
    </>
  );

  const asideClass = mobile
    ? "flex w-72 flex-shrink-0 flex-col bg-sidebar"
    : "flex w-60 flex-shrink-0 flex-col border-r border-sidebar-border bg-sidebar";

  return <aside className={asideClass}>{navContent}</aside>;
}
