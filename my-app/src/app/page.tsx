import Link from "next/link";
import { Bus, QrCode, ScanLine } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = "bg-[#6B46FE] hover:bg-[#5b3ad4]";

function Mark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-neutral-900",
        className
      )}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <rect x="4" y="5" width="16" height="5" rx="2.5" fill="currentColor" />
        <rect x="4" y="14" width="16" height="5" rx="2.5" fill="currentColor" />
      </svg>
    </span>
  );
}

function NavPill() {
  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-2 rounded-full bg-neutral-900 px-3 py-2 text-white shadow-md sm:px-4">
        <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight sm:text-base">
          SmartPass
        </Link>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/auth?mode=signup"
            className={cn(
              "inline-flex rounded-full px-3 py-1.5 text-xs font-semibold text-white transition-colors sm:px-4 sm:py-2 sm:text-sm",
              ACCENT
            )}
          >
            Get started
          </Link>
          <Link
            href="/auth?mode=login"
            className="whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium text-white/90 transition-colors hover:text-white sm:px-4 sm:py-2 sm:text-sm"
          >
            Sign in
          </Link>
        </div>
      </div>
    </header>
  );
}

function NotificationMock({
  iconClass,
  children,
}: {
  iconClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-neutral-900 px-4 py-3 text-sm text-white shadow-md">
      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", iconClass)} />
      <span className="font-medium leading-snug">{children}</span>
    </div>
  );
}

function FeatureVisualPasses() {
  return (
    <div className="relative flex min-h-[280px] items-center justify-center rounded-[2rem] bg-sky-200/90 p-8 sm:min-h-[320px]">
      <div className="flex w-full max-w-[280px] flex-col gap-3">
        <NotificationMock iconClass="bg-amber-500">
          Pass issued — Metro 7-day, active now
        </NotificationMock>
        <NotificationMock iconClass="bg-[#6B46FE]">
          QR renewed — valid through next Sunday
        </NotificationMock>
      </div>
    </div>
  );
}

function FeatureVisualQr() {
  return (
    <div className="relative flex min-h-[280px] items-center justify-center rounded-[2rem] bg-sky-200/90 p-8 sm:min-h-[320px]">
      <div className="rounded-2xl bg-white p-6 shadow-lg">
        <div className="mx-auto grid size-36 place-items-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50">
          <QrCode className="size-20 text-neutral-900" strokeWidth={1.25} aria-hidden />
        </div>
        <p className="mt-4 text-center text-xs font-medium text-neutral-500">Token-only payload</p>
      </div>
    </div>
  );
}

function FeatureVisualVerify() {
  return (
    <div className="relative flex min-h-[280px] items-center justify-center rounded-[2rem] bg-sky-200/90 p-8 sm:min-h-[320px]">
      <div className="flex w-full max-w-[280px] flex-col gap-3">
        <NotificationMock iconClass="bg-emerald-500">Pass verified — OK to board</NotificationMock>
        <NotificationMock iconClass="bg-neutral-600">Staff scan — server-backed result</NotificationMock>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <NavPill />

      <main>
        <section className="mx-auto max-w-5xl px-6 pb-20 pt-32 text-center sm:pb-28 sm:pt-40">
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl sm:leading-[1.05]">
            One pass for
            <br />
            every ride
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-neutral-500 sm:text-lg">
            SmartPass is simpler, faster, and built for travellers and operators who want passes,
            QR codes, and verification without the clutter.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-5">
            <Link
              href="/auth?mode=signup"
              className={cn(
                "inline-flex w-full items-center justify-center rounded-full px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors sm:w-auto",
                ACCENT
              )}
            >
              Get started free
            </Link>
            <a
              href="#features"
              className="inline-flex w-full items-center justify-center rounded-full border border-neutral-200 bg-white px-8 py-3.5 text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 sm:w-auto"
            >
              See features
            </a>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl scroll-mt-28 px-6 py-20 sm:scroll-mt-32 sm:py-28"
          aria-labelledby="features-heading"
        >
          <div className="text-center">
            <h2
              id="features-heading"
              className="text-4xl font-bold tracking-tight sm:text-5xl"
            >
              Features
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-500">
              Everything you need to issue passes, share QR codes, and verify riders in one place.
            </p>
          </div>

          <div className="mt-20 grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
            <FeatureVisualPasses />
            <div>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-neutral-100">
                <Bus className="size-6 text-neutral-900" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Every mode, one wallet
              </h3>
              <p className="mt-4 text-neutral-500">
                Bus, metro, bundles, or custom products—create and renew from the same dashboard so
                riders always know what&apos;s active.
              </p>
              <Link
                href="/auth?mode=signup"
                className={cn(
                  "mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors",
                  ACCENT
                )}
              >
                Get started free
              </Link>
            </div>
          </div>

          <div className="mt-24 grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:mt-32 lg:gap-24">
            <div className="order-2 md:order-1">
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-neutral-100">
                <QrCode className="size-6 text-neutral-900" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Token-only barcodes
              </h3>
              <p className="mt-4 text-neutral-500">
                QR codes carry a secure token—sensitive details load on scan so nothing unnecessary
                sits in the pixels.
              </p>
              <Link
                href="/auth?mode=signup"
                className={cn(
                  "mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors",
                  ACCENT
                )}
              >
                Get started free
              </Link>
            </div>
            <div className="order-1 md:order-2">
              <FeatureVisualQr />
            </div>
          </div>

          <div className="mt-24 grid items-center gap-12 md:grid-cols-2 md:gap-16 lg:mt-32 lg:gap-24">
            <FeatureVisualVerify />
            <div>
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-2xl bg-neutral-100">
                <ScanLine className="size-6 text-neutral-900" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Staff-ready verification
              </h3>
              <p className="mt-4 text-neutral-500">
                Paste a token or scan from the dashboard—get instant, server-backed pass details for
                gate checks and support.
              </p>
              <Link
                href="/auth?mode=signup"
                className={cn(
                  "mt-8 inline-flex rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors",
                  ACCENT
                )}
              >
                Get started free
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-28">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to ship passes?</h2>
          <p className="mt-4 text-neutral-500">
            Create an account and issue your first pass in minutes.
          </p>
          <Link
            href="/auth?mode=signup"
            className={cn(
              "mt-10 inline-flex rounded-full px-8 py-3.5 text-sm font-semibold text-white transition-colors",
              ACCENT
            )}
          >
            Get started free
          </Link>
        </section>

        <footer className="border-t border-neutral-100 py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-sm text-neutral-500 sm:flex-row">
            <div className="flex items-center gap-2 font-semibold text-neutral-900">
              <Mark className="bg-neutral-900 text-white" />
              SmartPass
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a href="#features" className="hover:text-neutral-900">
                Features
              </a>
              <Link href="/auth?mode=login" className="hover:text-neutral-900">
                Sign in
              </Link>
            </div>
            <span className="text-xs">© {new Date().getFullYear()} SmartPass</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
