import Link from "next/link";
import VerifyPassPanel from "@/components/VerifyPassPanel";
import { Button } from "@/components/ui/button";

export default function PublicVerifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-primary">
            SmartPass
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link href="/auth">Log in</Link>
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <h1 className="text-3xl font-bold tracking-tight">Verify a pass</h1>
        <p className="mt-2 text-muted-foreground">
          Public verifier—no account required. Paste QR content or token to load safe,
          server-confirmed pass details.
        </p>
        <div className="mt-10">
          <VerifyPassPanel
            title="Check pass validity"
            description="Uses an anonymous server lookup; only non-sensitive fields are returned."
          />
        </div>
      </main>
    </div>
  );
}
