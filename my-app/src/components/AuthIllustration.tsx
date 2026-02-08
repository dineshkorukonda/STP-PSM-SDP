"use client";

export default function AuthIllustration() {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-muted/30 p-8 lg:p-12">
      <svg
        viewBox="0 0 400 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full max-h-[320px] w-full max-w-md object-contain"
        aria-hidden
      >
        {/* Card shape */}
        <rect
          x="80"
          y="60"
          width="240"
          height="160"
          rx="16"
          fill="white"
          stroke="oklch(0.922 0 0)"
          strokeWidth="2"
        />
        {/* QR placeholder area on card */}
        <rect x="100" y="85" width="80" height="80" rx="8" fill="oklch(0.97 0 0)" />
        <rect x="108" y="93" width="16" height="16" fill="oklch(0.205 0 0)" />
        <rect x="156" y="93" width="16" height="16" fill="oklch(0.205 0 0)" />
        <rect x="108" y="141" width="16" height="16" fill="oklch(0.205 0 0)" />
        <rect x="156" y="141" width="16" height="16" fill="oklch(0.205 0 0)" />
        {/* Bus icon */}
        <g transform="translate(220, 100)">
          <rect x="0" y="20" width="100" height="50" rx="6" fill="oklch(0.97 0 0)" stroke="oklch(0.922 0 0)" strokeWidth="2" />
          <rect x="8" y="28" width="84" height="26" rx="4" fill="white" stroke="oklch(0.922 0 0)" strokeWidth="1" />
          <circle cx="25" cy="78" r="8" fill="oklch(0.205 0 0)" />
          <circle cx="75" cy="78" r="8" fill="oklch(0.205 0 0)" />
        </g>
        {/* Text line */}
        <rect x="100" y="180" width="120" height="8" rx="4" fill="oklch(0.97 0 0)" />
        <rect x="100" y="198" width="80" height="6" rx="3" fill="oklch(0.97 0 0)" />
      </svg>
    </div>
  );
}
