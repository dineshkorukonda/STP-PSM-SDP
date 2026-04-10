"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
      setInfo("Check your email to confirm, then sign in.");
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border-0 border-b border-border bg-transparent px-0 py-3 text-sm outline-none ring-0 placeholder:text-muted-foreground/50 focus:border-foreground";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-[320px]">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
          ← SmartPass
        </Link>

        <h1 className="mt-10 text-2xl font-medium tracking-tight">
          {mode === "login" ? "Sign in" : "Sign up"}
        </h1>

        <p className="mt-6 text-sm text-muted-foreground">
          <button
            type="button"
            onClick={setLogin}
            className={
              mode === "login"
                ? "text-foreground"
                : "hover:text-foreground text-muted-foreground"
            }
          >
            Sign in
          </button>
          <span className="mx-2 text-border">·</span>
          <button
            type="button"
            onClick={setSignup}
            className={
              mode === "signup"
                ? "text-foreground"
                : "hover:text-foreground text-muted-foreground"
            }
          >
            Sign up
          </button>
        </p>

        <form onSubmit={onSubmit} className="mt-10 space-y-6">
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          {info ? <p className="text-sm text-muted-foreground">{info}</p> : null}

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
                placeholder="Name"
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
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="Email"
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

          {mode === "signup" ? (
            <div>
              <label htmlFor="auth-confirm" className="sr-only">
                Confirm password
              </label>
              <input
                id="auth-confirm"
                name="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={inputClass}
                placeholder="Confirm password"
              />
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="mt-4 text-sm font-medium text-foreground underline-offset-4 hover:underline disabled:opacity-50"
          >
            {loading
              ? mode === "login"
                ? "Signing in…"
                : "Creating…"
              : mode === "login"
                ? "Continue"
                : "Create account"}
          </button>
        </form>

        <p className="mt-16 text-xs text-muted-foreground">
          <Link href="/verify" className="hover:text-foreground">
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
