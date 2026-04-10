"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Bus,
  QrCode,
  Shield,
  LayoutDashboard,
  ScanLine,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "unified",
    label: "One pass",
    icon: Bus,
    headline: "Every mode, one wallet.",
    detail:
      "Bus, metro, shared rides, or an all-in-one bundle—issue and renew from the same dashboard.",
  },
  {
    id: "qr",
    label: "Safe QR",
    icon: QrCode,
    headline: "Token-only barcodes.",
    detail:
      "The QR holds a secure token. Holder name, validity, and type load when scanned—nothing sensitive in the pixels.",
  },
  {
    id: "verify",
    label: "Verify",
    icon: ScanLine,
    headline: "Staff-ready checks.",
    detail:
      "Public and in-dashboard verifiers paste a scan or token and get instant, server-backed pass details.",
  },
  {
    id: "auth",
    label: "Secure auth",
    icon: Shield,
    headline: "Built on Supabase.",
    detail:
      "Email and password with row-level security—your passes stay tied to the right account.",
  },
  {
    id: "dash",
    label: "Dashboard",
    icon: LayoutDashboard,
    headline: "Create in seconds.",
    detail:
      "Pick transport and duration, preview the pass card, and manage everything from a clean, responsive UI.",
  },
] as const;

const steps = [
  { title: "Sign up", body: "One screen, email and password." },
  { title: "Create pass", body: "Choose type and length." },
  { title: "Go", body: "Scan or verify anywhere." },
];

export default function LandingPage() {
  const [activeId, setActiveId] = useState<string>(features[0].id);
  const [reduceMotion, setReduceMotion] = useState(false);
  const orbRef = useRef<HTMLDivElement>(null);

  const active = features.find((f) => f.id === activeId) ?? features[0];
  const ActiveIcon = active.icon;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    queueMicrotask(() => setReduceMotion(mq.matches));
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const onMove = (e: MouseEvent) => {
      const el = orbRef.current;
      if (!el) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 24;
      const y = (e.clientY / window.innerHeight - 0.5) * 24;
      el.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [reduceMotion]);

  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div
        ref={orbRef}
        className="pointer-events-none fixed -left-32 top-1/4 size-[420px] rounded-full bg-primary/10 blur-3xl transition-transform duration-500 ease-out will-change-transform"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed -right-24 bottom-1/4 size-80 rounded-full bg-primary/5 blur-3xl"
        aria-hidden
      />

      <header className="relative z-10 border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16 sm:px-6">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            SmartPass
          </Link>
          <nav className="flex items-center gap-6 text-sm" aria-label="Main">
            <Link
              href="/verify"
              className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Verify
            </Link>
            <Link
              href="/auth?mode=login"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/auth?mode=signup"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Start
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <p className="text-center text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Digital transport
          </p>
          <h1 className="mx-auto mt-6 max-w-2xl text-center text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl sm:leading-[1.08]">
            One pass.
            <br />
            <span className="text-muted-foreground">All your rides.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-center text-base leading-relaxed text-muted-foreground">
            Minimal tools for travellers and operators: issue passes, scan QR codes, verify
            validity—without clutter.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
            <Link
              href="/auth?mode=signup"
              className="inline-flex items-center gap-2 text-sm font-medium text-foreground underline-offset-4 hover:underline"
            >
              Create account
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/verify"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Try verify
            </Link>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-5xl border-t border-border px-4 py-16 sm:px-6 sm:py-20"
          aria-labelledby="features-heading"
        >
          <div>
            <h2 id="features-heading" className="text-lg font-semibold tracking-tight">
              What you get
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Choose a topic—the detail updates below.
            </p>
          </div>

          <div
            className="mt-8 flex flex-wrap gap-x-1 gap-y-2 text-sm"
            role="tablist"
            aria-label="Features"
          >
            {features.map((f, i) => {
              const isOn = activeId === f.id;
              return (
                <span key={f.id} className="inline-flex items-center">
                  {i > 0 ? (
                    <span className="mx-2 text-muted-foreground/40" aria-hidden>
                      ·
                    </span>
                  ) : null}
                  <button
                    type="button"
                    role="tab"
                    aria-selected={isOn}
                    onMouseEnter={() => setActiveId(f.id)}
                    onFocus={() => setActiveId(f.id)}
                    onClick={() => setActiveId(f.id)}
                    className={cn(
                      "transition-colors",
                      isOn
                        ? "font-medium text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {f.label}
                  </button>
                </span>
              );
            })}
          </div>

          <div className="mt-10 border-t border-border pt-10">
            <div className="flex items-start gap-4">
              <div className="text-primary">
                <ActiveIcon className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-xl font-semibold tracking-tight">{active.headline}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {active.detail}
                </p>
                <Link
                  href="/auth?mode=signup"
                  className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  Get started
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl border-t border-border px-4 py-16 sm:px-6 sm:py-20">
          <h2 className="text-lg font-semibold tracking-tight">How it works</h2>
          <ol className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="text-xs font-mono text-muted-foreground">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-2 font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mx-auto max-w-5xl border-t border-border px-4 py-16 sm:px-6 sm:py-24">
          <div className="border-t border-border pt-12 text-center sm:pt-16">
            <p className="text-lg font-semibold tracking-tight">Ready when you are.</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              No noise—just sign in and create your first pass.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8">
              <Link
                href="/auth"
                className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
              >
                Open auth
              </Link>
              <Link
                href="/dashboard"
                className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                I already have an account →
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-border py-10">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:flex-row sm:px-6">
            <span>© {new Date().getFullYear()} SmartPass</span>
            <div className="flex gap-6">
              <Link href="/auth?mode=login" className="hover:text-foreground">
                Sign in
              </Link>
              <Link href="/verify" className="hover:text-foreground">
                Verify
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
