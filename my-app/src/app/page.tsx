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
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
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
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary-hover focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
            >
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero with circular nav */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-primary-light/40 to-background px-4 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
                One Smart Pass for All Transport
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
                Unified access to buses, metro, and shared vehicles. One digital
                pass for your entire journey.
              </p>
            </div>

            {/* Circular nav - visible on md+ */}
            <div className="relative mx-auto mt-12 flex min-h-[280px] items-center justify-center md:mt-16">
              <div
                ref={circleRef}
                className={cn(
                  "relative size-48 rounded-full border-2 border-primary/20 bg-card shadow-lg transition-all duration-300 sm:size-56 md:size-64",
                  mounted && "animate-in fade-in zoom-in-95 duration-500"
                )}
                aria-hidden
              >
                <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-primary sm:text-2xl">
                  SmartPass
                </span>
              </div>
              {CIRCLE_LINKS.map((item, i) => {
                const angle = (i / CIRCLE_LINKS.length) * 2 * Math.PI - Math.PI / 2;
                const radius = 130;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isCta = item.href === "/signup";
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    className={cn(
                      "absolute hidden rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring md:block",
                      isCta
                        ? "bg-primary text-primary-foreground shadow-md hover:bg-primary-hover hover:scale-110"
                        : "bg-card text-foreground shadow border border-border hover:border-primary hover:bg-primary-light hover:scale-105"
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

            {/* Mobile: linear CTA */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:mt-0 md:hidden">
              <Link
                href="/login"
                className="rounded-full border-2 border-primary bg-transparent px-6 py-3 text-base font-medium text-primary transition-colors hover:bg-primary-light active:scale-[0.98]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Why SmartPass - no icons */}
        <section id="why" className="scroll-mt-16 border-b border-border bg-surface px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Why SmartPass
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              A simpler way to travel across the city.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
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
                  className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                >
                  <span className="inline-flex size-9 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-16 border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              Get your digital pass in three simple steps.
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3 lg:mt-12">
              {[
                { step: "1", title: "Create an account", body: "Sign up with your email and get instant access." },
                { step: "2", title: "Choose your pass", body: "Select transport type and duration—daily, weekly, or monthly." },
                { step: "3", title: "Travel anywhere", body: "Use your pass at buses, metro, and shared vehicles." },
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="mx-auto flex size-14 items-center justify-center rounded-full border-2 border-primary bg-primary-light text-lg font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All transport - text only, no emojis */}
        <section id="transport" className="scroll-mt-16 border-b border-border bg-surface px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              All Transport, One Pass
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              SmartPass works across the entire public and shared transport network.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4 lg:mt-12">
              {["Bus", "Metro", "Shared Vehicle", "All-in-One"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-border bg-card px-6 py-3 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/40 hover:bg-primary-light"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-border bg-background px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">1</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Pass for everything</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">24/7</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Access and renewal</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary sm:text-4xl">100%</p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">Digital and contactless</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="cta" className="scroll-mt-16 border-b border-border bg-surface px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 text-center shadow-md sm:p-12">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to simplify your commute?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join SmartPass today and get one digital pass for all your journeys.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-full bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-md transition-all hover:bg-primary-hover active:scale-[0.98]"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-full border-2 border-border bg-transparent px-6 py-3 text-base font-medium text-foreground transition-colors hover:bg-primary-light active:scale-[0.98]"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-card px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm font-medium text-foreground">SmartPass</p>
              <div className="flex gap-6 text-sm text-muted-foreground">
                <Link href="/login" className="hover:text-primary">Login</Link>
                <Link href="/signup" className="hover:text-primary">Sign up</Link>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-muted-foreground sm:text-left">
              © {new Date().getFullYear()} SmartPass. Digital transport passes.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
