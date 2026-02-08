"use client";

import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CIRCLE_LINKS = [
  { label: "Login", href: "/login" },
  { label: "Get Started", href: "/signup" },
  { label: "Why SmartPass", href: "#why" },
  { label: "How it works", href: "#how" },
  { label: "All transport", href: "#transport" },
  { label: "Get your pass", href: "#cta" },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const circleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-card/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-primary sm:text-xl"
          >
            SmartPass
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4" aria-label="Main">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/25 transition-all hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/30 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary-light/30 to-transparent" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative mx-auto max-w-5xl px-4 py-16 sm:py-20 md:py-24 lg:py-28">
            <div className="text-center">
              <span className="inline-block rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
                Digital transport
              </span>
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl lg:leading-[1.1]">
                One Smart Pass
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                  for All Transport
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                Unified access to buses, metro, and shared vehicles. One digital
                pass for your entire journey.
              </p>
            </div>

            {/* Circular nav - desktop */}
            <div className="relative mx-auto mt-14 flex min-h-[280px] items-center justify-center md:mt-20">
              <div
                className="absolute inset-0 flex items-center justify-center"
                aria-hidden
              >
                <div className="size-72 rounded-full border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent md:size-80" />
              </div>
              <div
                ref={circleRef}
                className={cn(
                  "relative flex size-48 items-center justify-center rounded-full border-2 border-primary/30 bg-card shadow-xl shadow-primary/10 ring-4 ring-primary/5 transition-all duration-300 sm:size-56 md:size-64",
                  mounted && "animate-in fade-in zoom-in-95 duration-500"
                )}
                aria-hidden
              >
                <span className="text-center text-xl font-bold text-primary sm:text-2xl">
                  SmartPass
                </span>
              </div>
              {CIRCLE_LINKS.map((item, i) => {
                const angle =
                  (i / CIRCLE_LINKS.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 140;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isCta = item.href === "/signup";
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={cn(
                      "absolute hidden rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring md:block",
                      isCta
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:scale-110 hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/40"
                        : "border border-border bg-card text-foreground shadow-md hover:scale-105 hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg"
                    )}
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 md:mt-0 md:hidden">
              <Link
                href="/login"
                className="rounded-full border-2 border-primary bg-transparent px-6 py-3.5 text-base font-semibold text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-6 py-3.5 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-xl active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Why SmartPass */}
        <section
          id="why"
          className="scroll-mt-16 border-b border-border bg-gradient-to-b from-surface to-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Why SmartPass
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                A simpler way to travel across the city.
              </p>
            </div>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-8">
              {[
                {
                  title: "Unified Digital Pass",
                  body: "One pass for bus, metro, and shared vehicles. No more multiple cards or apps.",
                },
                {
                  title: "Easy Online Renewal",
                  body: "Renew or upgrade your pass in minutes from your dashboard.",
                },
                {
                  title: "QR-Based Validation",
                  body: "Quick scan at gates and validators. Contactless and secure.",
                },
              ].map((item, i) => (
                <div
                  key={item.title}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 sm:p-8"
                >
                  <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-primary to-primary/50 opacity-0 transition-opacity group-hover:opacity-100" />
                  <span className="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-base font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-foreground sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how"
          className="scroll-mt-16 border-b border-border bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                How It Works
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                Get your digital pass in three simple steps.
              </p>
            </div>
            <div className="relative mt-12 grid gap-10 sm:grid-cols-3 lg:mt-16">
              <div className="absolute left-1/2 top-12 hidden h-0.5 w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent sm:block" />
              {[
                {
                  step: "1",
                  title: "Create an account",
                  body: "Sign up with your email and get instant access.",
                },
                {
                  step: "2",
                  title: "Choose your pass",
                  body: "Select transport type and duration—daily, weekly, or monthly.",
                },
                {
                  step: "3",
                  title: "Travel anywhere",
                  body: "Use your pass at buses, metro, and shared vehicles.",
                },
              ].map((item) => (
                <div key={item.step} className="relative text-center">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border-2 border-primary bg-gradient-to-br from-primary-light to-white text-xl font-bold text-primary shadow-md shadow-primary/10 sm:size-20">
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All transport */}
        <section
          id="transport"
          className="scroll-mt-16 border-b border-border bg-gradient-to-b from-surface to-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                All Transport, One Pass
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
                SmartPass works across the entire public and shared transport
                network.
              </p>
            </div>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-4 lg:mt-16">
              {["Bus", "Metro", "Shared Vehicle", "All-in-One"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border-2 border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:border-primary/50 hover:bg-primary/10 hover:shadow-md"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="rounded-2xl border border-border bg-card px-6 py-12 shadow-sm sm:px-12 sm:py-16">
              <div className="grid gap-10 sm:grid-cols-3 sm:gap-8">
                <div className="text-center">
                  <p className="text-4xl font-extrabold text-primary sm:text-5xl">
                    1
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Pass for everything
                  </p>
                </div>
                <div className="border-t border-border pt-10 text-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
                  <p className="text-4xl font-extrabold text-primary sm:text-5xl">
                    24/7
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Access and renewal
                  </p>
                </div>
                <div className="border-t border-border pt-10 text-center sm:border-t-0 sm:border-l sm:pt-0 sm:pl-10">
                  <p className="text-4xl font-extrabold text-primary sm:text-5xl">
                    100%
                  </p>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Digital and contactless
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className="scroll-mt-16 border-b border-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8"
        >
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-primary-light/50 to-primary/5 p-8 shadow-xl shadow-primary/10 sm:p-12">
            <div className="relative text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                Ready to simplify your commute?
              </h2>
              <p className="mt-4 text-muted-foreground">
                Join SmartPass today and get one digital pass for all your
                journeys.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/signup"
                  className="rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary-hover hover:shadow-xl hover:shadow-primary/40 active:scale-[0.98]"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="rounded-full border-2 border-foreground/20 bg-card px-8 py-4 text-base font-semibold text-foreground transition-all hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]"
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-card px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-base font-semibold text-foreground">
                SmartPass
              </p>
              <div className="flex gap-8 text-sm">
                <Link
                  href="/login"
                  className="font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  Sign up
                </Link>
              </div>
            </div>
            <p className="mt-6 text-center text-sm text-muted-foreground sm:text-left">
              © {new Date().getFullYear()} SmartPass. Digital transport passes.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
