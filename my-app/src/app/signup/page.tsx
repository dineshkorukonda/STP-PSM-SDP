"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthIllustration from "@/components/AuthIllustration";
import { setStoredUser } from "@/lib/storage";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const raw = localStorage.getItem("smartpass_users");
      const users: { email: string }[] = raw ? JSON.parse(raw) : [];
      if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
        setError("An account with this email already exists.");
        setLoading(false);
        return;
      }

      const id = "user-" + Math.random().toString(36).slice(2, 10);
      const newUser = { id, name: name.trim(), email: email.trim().toLowerCase(), password };
      users.push(newUser);
      localStorage.setItem("smartpass_users", JSON.stringify(users));
      localStorage.setItem("smartpass_passes", JSON.stringify([]));
      setStoredUser({ id, name: name.trim(), email: email.trim().toLowerCase() });
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
              <h1 className="mt-8 text-2xl font-bold tracking-tight">Get started</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Create an account to get your digital transport pass.
              </p>
            </div>
            <Card>
              <CardHeader className="space-y-0 pb-4">
                <CardTitle className="text-lg">Create account</CardTitle>
                <CardDescription>Sign up with your details</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-10"
                    />
                  </div>
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
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <Button type="submit" className="w-full" size="lg" disabled={loading}>
                    {loading ? "Creating account…" : "Sign up"}
                  </Button>
                </form>
                <p className="mt-6 text-center text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="font-medium text-primary underline-offset-4 hover:underline">
                    Log in
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
