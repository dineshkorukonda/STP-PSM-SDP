"use client";

export default function AuthIllustration() {
  return (
    <div className="flex h-full min-h-[200px] items-center justify-center bg-primary-light/50 p-6 lg:min-h-0 lg:p-12">
      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <div className="size-16 rounded-2xl border-2 border-primary/20 bg-card shadow-sm" />
          <div className="size-16 rounded-2xl border-2 border-primary/20 bg-card shadow-sm" />
        </div>
        <div className="h-3 w-32 rounded-full bg-primary/10" />
        <div className="h-3 w-24 rounded-full bg-primary/10" />
      </div>
    </div>
  );
}
