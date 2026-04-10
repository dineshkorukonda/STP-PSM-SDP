"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") === "signup" ? "signup" : "login") as Mode;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const m = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(m);
  }, [searchParams]);

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("That sign-in link expired or is invalid. Try again.");
    }
  }, [searchParams]);

  useEffect(() => {
    setError("");
    setInfo("");
  }, [mode]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password) {
      setError("Password is required.");
      return;
    }

    if (mode === "signup") {
      if (!name.trim()) {
        setError("Name is required.");
        return;
      }
      if (password.length < 6) {
        setError("Use at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) {
          setError(err.message);
          return;
        }
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const { data, error: err } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { full_name: name.trim(), name: name.trim() },
        },
      });
      if (err) {
        setError(err.message);
        return;
      }
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setInfo("Check your email to confirm, then sign in here.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.35] dark:opacity-20"
        aria-hidden
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-muted-foreground) 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-background via-background/95 to-muted/30" />

      <div className="relative w-full max-w-[400px]">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-70"
          >
            SmartPass
          </Link>
          <h1 className="mt-8 text-2xl font-semibold tracking-tight text-foreground sm:text-[1.75rem]">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="mt-2 max-w-[280px] text-sm leading-relaxed text-muted-foreground">
            {mode === "login"
              ? "Welcome back. Use your email and password."
              : "Start issuing digital passes in a few seconds."}
          </p>
        </div>

        <div
          className="mb-8 flex rounded-full border border-border bg-muted/40 p-1 dark:bg-muted/20"
          role="tablist"
          aria-label="Account mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "login"}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-200",
              mode === "login"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => {
              setMode("login");
              router.replace("/auth?mode=login", { scroll: false });
            }}
          >
            Sign in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            className={cn(
              "flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-200",
              mode === "signup"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => {
              setMode("signup");
              router.replace("/auth?mode=signup", { scroll: false });
            }}
          >
            Sign up
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg border border-primary/25 bg-primary/5 px-3 py-2 text-center text-sm text-primary">
              {info}
            </p>
          )}

          {mode === "signup" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-name" className="text-xs font-medium text-muted-foreground">
                Name
              </label>
              <input
                id="auth-name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="focus-visible:ring-ring w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2"
                placeholder="Alex Morgan"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="auth-email" className="text-xs font-medium text-muted-foreground">
              Email
            </label>
            <input
              id="auth-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-visible:ring-ring w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2"
              placeholder="you@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <label htmlFor="auth-password" className="text-xs font-medium text-muted-foreground">
                Password
              </label>
            </div>
            <div className="relative">
              <input
                id="auth-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="focus-visible:ring-ring w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2"
                placeholder="••••••••"
              />
              <button
                type="button"
                tabIndex={-1}
                className="text-muted-foreground hover:text-foreground absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {mode === "signup" && (
            <div className="space-y-1.5">
              <label htmlFor="auth-confirm" className="text-xs font-medium text-muted-foreground">
                Confirm password
              </label>
              <input
                id="auth-confirm"
                name="confirm"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="focus-visible:ring-ring w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground/60 focus-visible:ring-2"
                placeholder="••••••••"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-foreground py-3.5 text-sm font-medium text-background transition-transform active:scale-[0.98] disabled:opacity-60 dark:bg-primary dark:text-primary-foreground"
          >
            {loading
              ? mode === "login"
                ? "Signing in…"
                : "Creating account…"
              : mode === "login"
                ? "Continue"
                : "Create account"}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          <Link href="/" className="underline-offset-4 hover:text-foreground hover:underline">
            ← Back to home
          </Link>
          <span className="mx-2 text-border">·</span>
          <Link href="/verify" className="underline-offset-4 hover:text-foreground hover:underline">
            Verify a pass
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
          Loading…
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
