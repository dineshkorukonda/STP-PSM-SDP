"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
          SmartPass
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/auth?mode=login"
            className="rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/auth?mode=signup"
            className="rounded-full bg-foreground px-3 py-2 text-sm font-medium text-background dark:bg-primary dark:text-primary-foreground"
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
