"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { PlusCircle, Ticket, QrCode, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-br from-primary/10 via-card to-card p-8 shadow-sm sm:p-10">
        <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-primary">Dashboard</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Create a new digital pass, manage existing ones, or verify a traveller&apos;s QR
            in seconds—all from one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2 shadow-md">
              <Link href="/dashboard/create">
                <PlusCircle className="size-4" />
                Create pass
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 bg-background/80">
              <Link href="/dashboard/passes">
                <Ticket className="size-4" />
                My passes
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ticket className="size-5 text-primary" />
              Your passes
            </CardTitle>
            <CardDescription>
              Each pass gets a unique QR token. Scanning resolves holder and validity on the
              server—no sensitive data baked into the code.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="secondary" className="gap-2">
              <Link href="/dashboard/passes">
                View all passes
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/80 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <QrCode className="size-5 text-primary" />
              Verify
            </CardTitle>
            <CardDescription>
              Operators can paste scanned QR JSON or a raw token to confirm a pass.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/dashboard/verify">
                Open verifier
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
