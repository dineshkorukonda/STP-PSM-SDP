import {
  LayoutDashboard,
  PlusCircle,
  Ticket,
  QrCode,
  type LucideIcon,
} from "lucide-react";

export type DashboardSection = "dashboard" | "create" | "passes" | "verify";

export const dashboardNavItems: {
  id: DashboardSection;
  label: string;
  shortLabel: string;
  href: string;
  icon: LucideIcon;
}[] = [
  {
    id: "dashboard",
    label: "Overview",
    shortLabel: "Home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "create",
    label: "Create pass",
    shortLabel: "Create",
    href: "/dashboard/create",
    icon: PlusCircle,
  },
  {
    id: "passes",
    label: "My passes",
    shortLabel: "Passes",
    href: "/dashboard/passes",
    icon: Ticket,
  },
  {
    id: "verify",
    label: "Verify QR",
    shortLabel: "Verify",
    href: "/dashboard/verify",
    icon: QrCode,
  },
];

export function dashboardSectionFromPath(pathname: string): DashboardSection {
  if (pathname.startsWith("/dashboard/create")) return "create";
  if (pathname.startsWith("/dashboard/passes")) return "passes";
  if (pathname.startsWith("/dashboard/verify")) return "verify";
  return "dashboard";
}
