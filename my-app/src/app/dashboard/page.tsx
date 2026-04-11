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
import { cn } from "@/lib/utils";

const ACCENT = "bg-[#6B46FE] hover:bg-[#5b3ad4] text-white";

export default function DashboardPage() {
  const { user } = useUser();

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-sky-200/90 blur-2xl sm:-right-24 sm:-top-24 sm:size-72" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 size-40 rounded-full bg-[#6B46FE]/10 blur-2xl" />
        <div className="relative">
          <p className="text-sm font-semibold text-[#6B46FE]">Dashboard</p>
          <h1 className="mt-2 text-pretty text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl">
            Welcome back{user?.name ? `, ${user.name}` : ""}
          </h1>
          <p className="mt-3 max-w-xl text-pretty text-base leading-relaxed text-neutral-500">
            Create a new digital pass, manage existing ones, or verify a traveller&apos;s QR in
            seconds—same bold look as the marketing site, tuned for your phone.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className={cn("min-h-12 w-full gap-2 shadow-md sm:w-auto sm:min-w-[10rem]", ACCENT)}
            >
              <Link href="/dashboard/create">
                <PlusCircle className="size-5" />
                Create pass
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-h-12 w-full gap-2 border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50 sm:w-auto sm:min-w-[10rem]"
            >
              <Link href="/dashboard/passes">
                <Ticket className="size-5" />
                My passes
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <Card className="border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-neutral-900 sm:text-xl">
              <Ticket className="size-5 shrink-0 text-[#6B46FE] sm:size-6" />
              Your passes
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-neutral-500">
              Each pass gets a unique QR link. Scanning opens a public page with holder and validity.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              asChild
              variant="secondary"
              className="min-h-11 w-full gap-2 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 sm:w-auto"
            >
              <Link href="/dashboard/passes">
                View all passes
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-neutral-900 sm:text-xl">
              <QrCode className="size-5 shrink-0 text-[#6B46FE] sm:size-6" />
              Verify
            </CardTitle>
            <CardDescription className="text-base leading-relaxed text-neutral-500">
              Paste a link or token to confirm a pass—works great on mobile.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-2">
            <Button
              asChild
              variant="outline"
              className="min-h-11 w-full gap-2 border-neutral-200 text-neutral-900 hover:bg-neutral-50"
            >
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
