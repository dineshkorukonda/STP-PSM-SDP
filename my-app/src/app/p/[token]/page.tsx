import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { getPassPublicByToken } from "@/lib/pass-public";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ token: string }> };

export default async function PublicPassPage({ params }: PageProps) {
  const { token: raw } = await params;
  let token = raw;
  try {
    token = decodeURIComponent(raw);
  } catch {
    token = raw;
  }

  let pass: Awaited<ReturnType<typeof getPassPublicByToken>> = null;
  let loadError = false;
  try {
    pass = await getPassPublicByToken(token);
  } catch (e) {
    console.error("p/[token]:", e);
    loadError = true;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background text-foreground">
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold text-primary">
            SmartPass
          </Link>
          <Link
            href="/verify"
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Verify manually
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-10 sm:py-14">
        <h1 className="text-2xl font-bold tracking-tight">Pass check</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Details loaded from the server for this QR link.
        </p>

        {loadError ? (
          <div
            className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6 text-red-900"
            role="alert"
          >
            <p className="font-semibold">Could not load this pass</p>
            <p className="mt-2 text-sm opacity-90">
              The server could not reach the database. If you are the operator, check DATABASE_URL
              and SSL settings on your host.
            </p>
            <Link
              href="/verify"
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
            >
              Try manual verify
            </Link>
          </div>
        ) : !pass ? (
          <div
            className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100"
            role="status"
          >
            <p className="font-semibold">No pass found</p>
            <p className="mt-2 text-sm opacity-90">
              This link may be wrong, expired, or the pass was removed. Ask the holder to show their
              pass in the app or try the verifier with the raw token.
            </p>
            <Link
              href="/verify"
              className="mt-4 inline-block text-sm font-medium underline underline-offset-4"
            >
              Open verifier
            </Link>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold",
                pass.valid
                  ? "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
                  : "border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100"
              )}
            >
              {pass.valid ? (
                <CheckCircle2 className="size-6 shrink-0" aria-hidden />
              ) : (
                <XCircle className="size-6 shrink-0" aria-hidden />
              )}
              <span>{pass.valid ? "Valid for travel" : "Not valid"}</span>
            </div>

            <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Holder
              </p>
              <p className="mt-1 text-xl font-semibold">
                {pass.holderName || "—"}
              </p>

              <dl className="mt-6 grid gap-4 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-muted-foreground">Transport</dt>
                    <dd className="font-medium">{pass.passType || "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Duration</dt>
                    <dd className="font-medium">{pass.duration || "—"}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <dt className="text-muted-foreground">Valid from</dt>
                    <dd className="font-medium">
                      {pass.startDate
                        ? new Date(pass.startDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">Expires</dt>
                    <dd className="font-medium">
                      {pass.expiryDate
                        ? new Date(pass.expiryDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </dd>
                  </div>
                </div>
                <div>
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{pass.status || "—"}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
