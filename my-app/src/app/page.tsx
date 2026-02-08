import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              One Smart Pass for All Transport
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--muted)]">
              Unified access to buses, metro, and shared vehicles. One digital
              pass for your entire journey.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="rounded-xl bg-[var(--primary)] px-6 py-3 text-base font-medium text-white shadow-[var(--shadow)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="rounded-xl border-2 border-[var(--primary)] bg-transparent px-6 py-3 text-base font-medium text-[var(--primary)] transition-colors hover:bg-[var(--surface)]"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b border-[var(--card-border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              Why SmartPass?
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted)]">
              A simpler way to travel across the city.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-lg)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--primary)]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Unified Digital Pass</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  One pass for bus, metro, and shared vehicles. No more multiple cards or apps.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-lg)]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--secondary)]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Easy Online Renewal</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Renew or upgrade your pass in minutes from your dashboard.
                </p>
              </div>
              <div className="rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-6 shadow-[var(--shadow)] transition-shadow hover:shadow-[var(--shadow-lg)] sm:col-span-2 lg:col-span-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--surface)] text-[var(--accent)]">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h12a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">QR-Based Validation</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Quick scan at gates and validators. Contactless and secure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              How It Works
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted)]">
              Get your digital pass in three simple steps.
            </p>
            <div className="mt-12 grid gap-8 sm:grid-cols-3">
              <div className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--card-bg)] text-lg font-bold text-[var(--primary)]">1</div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Create an account</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">Sign up with your email and get instant access to the platform.</p>
                <div className="absolute left-1/2 top-7 hidden h-0.5 w-full max-w-[80px] -translate-x-[calc(50%+2rem)] bg-[var(--card-border)] sm:block" aria-hidden />
              </div>
              <div className="relative text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--card-bg)] text-lg font-bold text-[var(--primary)]">2</div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Choose your pass</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">Select transport type and duration—daily, weekly, or monthly.</p>
                <div className="absolute left-1/2 top-7 hidden h-0.5 w-full max-w-[80px] -translate-x-[calc(50%+2rem)] bg-[var(--card-border)] sm:block" aria-hidden />
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-[var(--primary)] bg-[var(--card-bg)] text-lg font-bold text-[var(--primary)]">3</div>
                <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">Travel anywhere</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">Use your pass at buses, metro, and shared vehicles with one tap.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Transport modes */}
        <section className="border-b border-[var(--card-border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              All Transport, One Pass
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-[var(--muted)]">
              SmartPass works across the entire public and shared transport network.
            </p>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 shadow-[var(--shadow)]">
                <span className="text-2xl" aria-hidden>🚌</span>
                <span className="font-medium text-[var(--foreground)]">Bus</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 shadow-[var(--shadow)]">
                <span className="text-2xl" aria-hidden>🚇</span>
                <span className="font-medium text-[var(--foreground)]">Metro</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 shadow-[var(--shadow)]">
                <span className="text-2xl" aria-hidden>🚗</span>
                <span className="font-medium text-[var(--foreground)]">Shared Vehicle</span>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-6 py-4 shadow-[var(--shadow)]">
                <span className="text-2xl" aria-hidden>🎫</span>
                <span className="font-medium text-[var(--foreground)]">All-in-One</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="border-b border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--primary)] sm:text-4xl">1</p>
                <p className="mt-1 text-sm font-medium text-[var(--muted)]">Pass for everything</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--primary)] sm:text-4xl">24/7</p>
                <p className="mt-1 text-sm font-medium text-[var(--muted)]">Access & renewal</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-[var(--primary)] sm:text-4xl">100%</p>
                <p className="mt-1 text-sm font-medium text-[var(--muted)]">Digital & contactless</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-b border-[var(--card-border)] bg-[var(--surface)] px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] p-8 text-center shadow-[var(--shadow)] sm:p-12">
            <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              Ready to simplify your commute?
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Join SmartPass today and get one digital pass for all your journeys.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-xl bg-[var(--primary)] px-6 py-3 text-base font-medium text-white shadow-[var(--shadow)] transition-colors hover:bg-[var(--primary-hover)]"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="rounded-xl border-2 border-[var(--card-border)] bg-transparent px-6 py-3 text-base font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--surface)]"
              >
                Log in
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-auto border-t border-[var(--card-border)] bg-[var(--card-bg)] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm font-medium text-[var(--foreground)]">SmartPass</p>
              <div className="flex gap-6 text-sm text-[var(--muted)]">
                <Link href="/login" className="hover:text-[var(--foreground)]">Login</Link>
                <Link href="/signup" className="hover:text-[var(--foreground)]">Sign up</Link>
              </div>
            </div>
            <p className="mt-4 text-center text-sm text-[var(--muted)] sm:text-left">
              © {new Date().getFullYear()} SmartPass. Digital transport passes.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}
