"use client";

import { useState } from "react";
import type { VerifiedPassDetails } from "@/types";
import { extractTokenFromQrInput } from "@/lib/parse-qr-input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

export default function VerifyPassPanel({
  title = "Verify a pass",
  description = "Paste a scanned link, QR JSON, or raw token (e.g. SP-…). Details are loaded from the server.",
}: {
  title?: string;
  description?: string;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerifiedPassDetails | null>(null);

  const submit = async () => {
    setError("");
    setResult(null);
    const token = extractTokenFromQrInput(input);
    if (!token) {
      setError("Enter a valid pass link, QR payload, or token (at least 8 characters).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/verify-pass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Verification failed.");
        return;
      }
      if (!data.pass) {
        setError("No pass found for this code.");
        return;
      }
      setResult(data.pass as VerifiedPassDetails);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-neutral-200 bg-white shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="verify-qr">Link, QR data, or token</Label>
          <textarea
            id="verify-qr"
            className="flex min-h-[120px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#6B46FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/25"
            placeholder="https://yoursite.com/p/SP-… or  {&quot;v&quot;:1,&quot;t&quot;:&quot;SP-…&quot;}  or  SP-…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        {error && (
          <p className="flex items-center gap-2 text-sm text-destructive">
            <XCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}
        <Button
          type="button"
          className="min-h-12 w-full bg-[#6B46FE] text-base text-white hover:bg-[#5b3ad4] sm:w-auto"
          onClick={submit}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Checking…
            </>
          ) : (
            "Verify pass"
          )}
        </Button>

        {result && (
          <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Holder
                </p>
                <p className="text-lg font-semibold">{result.holderName}</p>
              </div>
              <div
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                  result.valid
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                    : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200"
                }`}
              >
                {result.valid ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <XCircle className="size-4" />
                )}
                {result.valid ? "Valid" : "Not valid"}
              </div>
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Transport</dt>
                <dd className="font-medium">{result.passType}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Duration</dt>
                <dd className="font-medium">{result.duration}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Valid from</dt>
                <dd className="font-medium">
                  {result.startDate
                    ? new Date(result.startDate).toLocaleDateString("en-GB", {
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
                  {result.expiryDate
                    ? new Date(result.expiryDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Pass ID</dt>
                <dd className="break-all font-mono text-xs">{result.id}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Record status</dt>
                <dd className="font-medium capitalize">{result.status}</dd>
              </div>
            </dl>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
