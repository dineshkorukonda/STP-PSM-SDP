"use client";

export default function DashboardIllustration() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center bg-muted/20 p-6">
      <svg
        viewBox="0 0 320 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full max-h-[220px] w-full max-w-sm object-contain"
        aria-hidden
      >
        <rect x="40" y="40" width="100" height="120" rx="12" fill="white" stroke="oklch(0.922 0 0)" strokeWidth="2" />
        <rect x="56" y="56" width="68" height="68" rx="8" fill="oklch(0.97 0 0)" />
        <rect x="64" y="64" width="12" height="12" fill="oklch(0.205 0 0)" />
        <rect x="96" y="64" width="12" height="12" fill="oklch(0.205 0 0)" />
        <rect x="64" y="96" width="12" height="12" fill="oklch(0.205 0 0)" />
        <rect x="96" y="96" width="12" height="12" fill="oklch(0.205 0 0)" />
        <rect x="180" y="60" width="100" height="80" rx="12" fill="white" stroke="oklch(0.922 0 0)" strokeWidth="2" />
        <rect x="196" y="76" width="68" height="48" rx="6" fill="oklch(0.97 0 0)" />
        <rect x="180" y="160" width="100" height="40" rx="8" fill="white" stroke="oklch(0.922 0 0)" strokeWidth="2" />
        <rect x="196" y="172" width="50" height="6" rx="3" fill="oklch(0.97 0 0)" />
      </svg>
    </div>
  );
}
