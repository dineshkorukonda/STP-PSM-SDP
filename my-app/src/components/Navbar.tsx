"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-lg font-bold tracking-tight text-primary sm:text-xl"
        >
          SmartPass
        </Link>
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/login"
            className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary sm:px-4"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary-hover sm:px-4"
          >
            Sign up
          </Link>
        </div>
      </div>
    </nav>
  );
}
