import Link from "next/link";
import { redirect } from "next/navigation";
import DashboardShell from "@/components/DashboardShell";
import { loadSessionUser } from "@/lib/auth/load-session-user";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await loadSessionUser();

  if (result.status === "unauthenticated") {
    redirect("/auth?mode=login");
  }

  if (result.status === "error") {
    return (
      <div className="flex min-h-screen min-h-[100dvh] flex-col items-center justify-center gap-4 bg-neutral-50 px-6 text-center text-neutral-900">
        <p className="max-w-md text-sm text-neutral-600">{result.message}</p>
        {result.debug && (
          <p className="max-w-md font-mono text-xs text-neutral-500">{result.debug}</p>
        )}
        <p className="max-w-md text-xs text-neutral-500">
          Confirm DATABASE_URL, AUTH_SECRET (32+ characters), and that the database is reachable.
        </p>
        <Link
          href="/"
          className="text-sm font-semibold text-[#6B46FE] underline-offset-4 hover:underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return <DashboardShell initialUser={result.user}>{children}</DashboardShell>;
}
