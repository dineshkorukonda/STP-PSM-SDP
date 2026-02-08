"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--card-border)] bg-[var(--card-bg)] shadow-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-[var(--primary)]"
        >
          SmartPass
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--primary)]"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow transition-colors hover:bg-[var(--primary-hover)]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
