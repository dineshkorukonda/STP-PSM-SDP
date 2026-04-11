import Link from "next/link";
import VerifyPassPanel from "@/components/VerifyPassPanel";
import { Button } from "@/components/ui/button";

export default function PublicVerifyPage() {
  return (
    <div className="min-h-screen min-h-[100dvh] bg-gradient-to-b from-primary/5 to-background supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
      <header className="border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex min-h-14 max-w-3xl items-center justify-between gap-3 px-4 py-2">
          <Link href="/" className="min-h-11 content-center text-lg font-bold text-primary">
            SmartPass
          </Link>
          <Button asChild variant="outline" size="default" className="min-h-11 shrink-0">
            <Link href="/auth">Log in</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-14">
        <h1 className="text-pretty text-3xl font-bold tracking-tight sm:text-4xl">
          Verify a pass
        </h1>
        <p className="mt-3 max-w-prose text-base leading-relaxed text-muted-foreground">
          No account needed. Paste a pass link, QR data, or token—details are loaded from the
          server.
        </p>
        <div className="mt-8 sm:mt-10">
          <VerifyPassPanel
            title="Check pass validity"
            description="Uses an anonymous server lookup; only non-sensitive fields are returned."
          />
        </div>
      </main>
    </div>
  );
}
