"use client";

import Link from "next/link";
import {
  Bus,
  ShieldCheck,
  Smartphone,
  QrCode,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Bus,
    title: "One pass, every mode",
    body: "Bus, metro, shared mobility, or an all-in-one bundle—managed from a single dashboard.",
  },
  {
    icon: QrCode,
    title: "QR that stays safe",
    body: "Codes carry only a token. Validity, holder name, and dates load via a server check—ideal for gates and staff.",
  },
  {
    icon: ShieldCheck,
    title: "Supabase Auth",
    body: "Email and password sign-in with row-level security on your data, backed by Postgres.",
  },
  {
    icon: Smartphone,
    title: "Built for the platform",
    body: "Responsive layouts for travellers on the go and operators verifying passes on any device.",
  },
];

const steps = [
  { n: "01", title: "Create an account", body: "Sign up in seconds; your profile syncs automatically." },
  { n: "02", title: "Issue a pass", body: "Pick transport type and duration. Your QR is ready instantly." },
  { n: "03", title: "Travel & verify", body: "Show your QR or use the public verifier to confirm details." },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight text-primary">
            SmartPass
          </Link>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main">
            <Link
              href="/verify"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline"
            >
              Verify pass
            </Link>
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild size="sm" className="shadow-md">
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden border-b border-border/80">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,var(--color-primary)/0.2,transparent)]" />
          <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:px-8 lg:pt-24">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="size-3.5" />
                Digital transport
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl md:leading-[1.08]">
                One smart pass for{" "}
                <span className="bg-gradient-to-r from-primary via-blue-500 to-primary bg-clip-text text-transparent">
                  all your journeys
                </span>
              </h1>
              <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
                Issue passes, store them in Supabase, and scan QR codes that resolve to
                verified details—without leaking sensitive data in the barcode.
              </p>
              <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="h-12 gap-2 px-8 text-base shadow-lg shadow-primary/20">
                  <Link href="/signup">
                    Create free account
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-background/50">
                  <Link href="/verify">Try verify tool</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Already registered?{" "}
                <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </section>

        <section id="why" className="scroll-mt-20 border-b border-border/80 bg-muted/30 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Why SmartPass</h2>
              <p className="mt-3 text-lg text-muted-foreground">
                A focused stack: Next.js, Supabase Auth, and Postgres with policies that match
                how travellers and operators actually work.
              </p>
            </div>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <Card
                    key={f.title}
                    className="border-border/80 bg-card/80 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
                  >
                    <CardContent className="p-6">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-foreground">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how" className="scroll-mt-20 py-20 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
            <p className="mt-3 max-w-xl text-lg text-muted-foreground">
              Three steps from account to a scannable pass with server-backed verification.
            </p>
            <ol className="mt-14 grid gap-8 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.n} className="relative">
                  {i < steps.length - 1 && (
                    <div
                      className="absolute left-8 top-14 hidden h-px w-[calc(100%+2rem)] bg-gradient-to-r from-border via-primary/30 to-transparent md:block"
                      aria-hidden
                    />
                  )}
                  <div className="flex flex-col items-start">
                    <span className="font-mono text-sm font-bold text-primary">{s.n}</span>
                    <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          id="cta"
          className="scroll-mt-20 border-t border-border/80 bg-gradient-to-br from-primary/10 via-background to-background py-20 sm:py-24"
        >
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to simplify your commute?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Join SmartPass or open the verifier to see how QR resolution works end-to-end.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-8">
                <Link href="/signup">Get started</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="h-12 px-8">
                <Link href="/verify">Verify a pass</Link>
              </Button>
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-card py-10">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
            <p className="text-sm font-semibold text-foreground">SmartPass</p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="/login" className="hover:text-primary">
                Log in
              </Link>
              <Link href="/signup" className="hover:text-primary">
                Sign up
              </Link>
              <Link href="/verify" className="hover:text-primary">
                Verify
              </Link>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} SmartPass
          </p>
        </footer>
      </main>
    </div>
  );
}
