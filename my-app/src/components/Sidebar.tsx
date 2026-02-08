"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { clearStoredUser } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Section = "dashboard" | "create" | "passes";

const navItems: { id: Section; label: string; href: string }[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  { id: "create", label: "Create Pass", href: "/dashboard/create" },
  { id: "passes", label: "My Passes", href: "/dashboard/passes" },
];

export default function Sidebar({ activeSection }: { activeSection: Section }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearStoredUser();
    router.push("/");
  };

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <Link href="/dashboard" className="text-lg font-bold text-primary">
          SmartPass
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-4">
        {navItems.map((item) => {
          const isActive =
            activeSection === item.id ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Button
          type="button"
          variant="ghost"
          className="mt-auto justify-start text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </nav>
    </aside>
  );
}
