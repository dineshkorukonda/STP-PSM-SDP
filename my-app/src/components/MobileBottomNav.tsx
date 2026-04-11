"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { dashboardNavItems, dashboardSectionFromPath } from "@/lib/dashboard-nav";
import { cn } from "@/lib/utils";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const section = dashboardSectionFromPath(pathname);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-neutral-200 bg-white pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-0.5 shadow-[0_-4px_24px_-4px_rgb(0_0_0/0.06)] md:hidden"
      aria-label="Primary"
    >
      {dashboardNavItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          section === item.id ||
          (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-1 transition-colors active:bg-neutral-100",
              isActive ? "text-[#6B46FE]" : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            <Icon className="size-6 shrink-0" strokeWidth={isActive ? 2.25 : 1.75} aria-hidden />
            <span className="max-w-full truncate text-center text-[10px] font-semibold leading-tight">
              {item.shortLabel}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
