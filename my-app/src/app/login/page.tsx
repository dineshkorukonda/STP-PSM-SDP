"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import AuthIllustration from "@/components/AuthIllustration";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const raw = localStorage.getItem("smartpass_users");
      const users: { email: string; password: string; id: string; name: string }[] = raw
        ? JSON.parse(raw)
        : [];
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      if (!user) {
        setError("Invalid email or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "smartpass_user",
        JSON.stringify({ id: user.id, name: user.name, email: user.email })
      );
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        <div className="flex items-center justify-center lg:min-h-0">
          <AuthIllustration />
        </div>
        <main className="flex flex-col justify-center px-6 py-12 lg:px-12">
          <div className="mx-auto w-full max-w-sm space-y-8">
            <div>
              <Link href="/" className="text-lg font-bold text-foreground">
                SmartPass
              </Link>
              <h1 className="mt-8 text-2xl font-bold tracking-tight">Sign in</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access your dashboard.
              </p>
            </div>
            <Card>
              <CardHeader className="space-y-0 pb-4">
                <CardTitle className="text-lg">Login</CardTitle>
                <CardDescription>Use your SmartPass account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <PasswordInput
                      id="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Signing in…" : "Sign in"}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-medium text-primary underline-offset-4 hover:underline">
                    Sign up
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
