import type { Metadata } from "next";
import Link from "next/link";
import { ScanLine } from "lucide-react";
import VerifyPassPanel from "@/components/VerifyPassPanel";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Verify a pass · SmartPass",
  description:
    "Check a SmartPass without signing in. Scan the pass QR with your camera or paste a link.",
};

export default function PublicVerifyPage() {
  return (
    <div
      className={cn(
        "min-h-screen min-h-[100dvh] bg-white text-neutral-900",
        "supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]"
      )}
    >
      <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-neutral-900 transition-colors hover:text-[#6B46FE]"
          >
            ← SmartPass
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <span className="mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-[#6B46FE]/10 text-[#6B46FE]">
            <ScanLine className="size-7" aria-hidden />
          </span>
          <h1 className="text-pretty text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Verify a pass
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-neutral-600">
            No account needed. Scan the QR on the traveller&apos;s pass with your camera, or paste a
            link or token if you prefer.
          </p>
        </div>

        <div className="mt-10 w-full">
          <VerifyPassPanel
            title="Check validity"
            description="Use your camera to scan the pass QR, or switch to Paste for a link or token. Anonymous lookup—only non-sensitive fields are returned."
          />
        </div>

        <p className="mt-10 text-center text-sm text-neutral-500 sm:text-left">
          Need to issue passes?{" "}
          <Link
            href="/auth?mode=login"
            className="font-medium text-[#6B46FE] underline-offset-4 hover:underline"
          >
            Sign in to the dashboard
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
