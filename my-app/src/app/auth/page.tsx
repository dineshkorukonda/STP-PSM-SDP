"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const ACCENT = "bg-[#6B46FE] hover:bg-[#5b3ad4]";

type Mode = "login" | "signup";

function authErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Something went wrong. Try again.";
}

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = (searchParams.get("mode") === "signup" ? "signup" : "login") as Mode;

  const [mode, setMode] = useState<Mode>(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const m = searchParams.get("mode") === "signup" ? "signup" : "login";
    setMode(m);
  }, [searchParams]);

  useEffect(() => {
    setError("");
  }, [mode]);

  const setLogin = () => {
    setMode("login");
    router.replace("/auth?mode=login", { scroll: false });
  };

  const setSignup = () => {
    setMode("signup");
    router.replace("/auth?mode=signup", { scroll: false });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

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
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        });
        const data = (await res.json()) as { error?: string };
        if (!res.ok) {
          setError(data.error ?? "Sign in failed.");
          return;
        }
        router.push("/dashboard");
        router.refresh();
        return;
      }

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
          name: name.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Could not create an account.");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (e) {
      setError(authErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = cn(
    "min-h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900",
    "placeholder:text-neutral-400",
    "outline-none transition-[color,box-shadow,border-color]",
    "focus-visible:border-[#6B46FE] focus-visible:ring-2 focus-visible:ring-[#6B46FE]/25"
  );

  return (
    <div className="min-h-screen min-h-[100dvh] bg-white text-neutral-900 supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <header className="sticky top-0 z-10 border-b border-neutral-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link
            href="/"
            className="text-sm font-semibold text-neutral-900 transition-colors hover:text-[#6B46FE]"
          >
            ← SmartPass
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-neutral-500 hover:text-neutral-900"
          >
            Home
          </Link>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-6xl flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-16">
        <div className="w-full max-w-[400px]">
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
            {mode === "login" ? "Sign in to your account" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {mode === "login"
              ? "Enter your email and password"
              : "Enter your details to get started"}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={setLogin}
              className={cn(
                "min-h-11 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors",
                mode === "login"
                  ? "border-neutral-900 bg-neutral-900 text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
              )}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={setSignup}
              className={cn(
                "min-h-11 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors",
                mode === "signup"
                  ? "border-[#6B46FE] bg-[#6B46FE] text-white"
                  : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
              )}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            {error ? (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {mode === "signup" ? (
              <div>
                <label htmlFor="auth-name" className="sr-only">
                  Name
                </label>
                <input
                  id="auth-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>
            ) : null}

            <div>
              <label htmlFor="auth-email" className="sr-only">
                Email
              </label>
              <input
                id="auth-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label htmlFor="auth-password" className="sr-only">
                Password
              </label>
              <input
                id="auth-password"
                name="password"
                type="password"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                placeholder="Password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "mt-2 flex min-h-12 w-full items-center justify-center rounded-lg text-sm font-semibold text-white transition-colors",
                ACCENT,
                "disabled:cursor-not-allowed disabled:opacity-50"
              )}
            >
              {loading
                ? mode === "login"
                  ? "Signing in…"
                  : "Creating account…"
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-white text-sm text-neutral-500">
          Loading…
        </div>
      }
    >
      <AuthContent />
    </Suspense>
  );
}
