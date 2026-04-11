"use client";

import { useState } from "react";
import type { VerifiedPassDetails } from "@/types";
import { extractTokenFromQrInput } from "@/lib/parse-qr-input";
import { PassQrScanner } from "@/components/PassQrScanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Keyboard } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "scan" | "paste";

export default function VerifyPassPanel({
  title = "Verify a pass",
  description = "Scan the QR on the pass, or paste a link or token if the camera is not available.",
}: {
  title?: string;
  description?: string;
}) {
  const [mode, setMode] = useState<Mode>("scan");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<VerifiedPassDetails | null>(null);

  const runVerify = async (raw: string) => {
    setError("");
    setResult(null);
    const token = extractTokenFromQrInput(raw);
    if (!token) {
      setError(
        "That code is not a SmartPass QR. Scan the pass QR again, or paste the /p/… link or token."
      );
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

  const submitPasted = () => void runVerify(input);

  return (
    <Card className="border-neutral-200 bg-white shadow-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className="flex w-full gap-1 rounded-xl border border-neutral-200 bg-neutral-100 p-1"
          role="tablist"
          aria-label="Verification method"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "scan"}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold transition-colors",
              mode === "scan"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            )}
            onClick={() => {
              setMode("scan");
              setError("");
            }}
          >
            Scan QR
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "paste"}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-3 text-sm font-semibold transition-colors",
              mode === "paste"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            )}
            onClick={() => {
              setMode("paste");
              setError("");
            }}
          >
            <span className="inline-flex items-center justify-center gap-1.5">
              <Keyboard className="size-4" aria-hidden />
              Paste
            </span>
          </button>
        </div>

        {mode === "scan" ? (
          <PassQrScanner onScan={(text) => void runVerify(text)} disabled={loading} />
        ) : (
          <div className="space-y-2">
            <Label htmlFor="verify-qr">Link, QR data, or token</Label>
            <textarea
              id="verify-qr"
              className="flex min-h-[120px] w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-base text-neutral-900 placeholder:text-neutral-400 focus-visible:border-[#6B46FE] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B46FE]/25"
              placeholder="https://yoursite.com/p/SP-… or JSON or SP-…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
        )}

        {error && (
          <p className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="size-4 shrink-0" />
            {error}
          </p>
        )}

        {mode === "paste" && (
          <Button
            type="button"
            className="min-h-12 w-full bg-[#6B46FE] text-base text-white hover:bg-[#5b3ad4] sm:w-auto"
            onClick={submitPasted}
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
        )}

        {mode === "scan" && loading && (
          <p className="flex items-center gap-2 text-sm text-neutral-600">
            <Loader2 className="size-4 animate-spin text-[#6B46FE]" />
            Looking up pass…
          </p>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    Holder
                  </p>
                  <p className="text-lg font-semibold text-neutral-900">{result.holderName}</p>
                </div>
                <div
                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                    result.valid
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
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
                  <dt className="text-neutral-500">Transport</dt>
                  <dd className="font-medium text-neutral-900">{result.passType}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Duration</dt>
                  <dd className="font-medium text-neutral-900">{result.duration}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Valid from</dt>
                  <dd className="font-medium text-neutral-900">
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
                  <dt className="text-neutral-500">Expires</dt>
                  <dd className="font-medium text-neutral-900">
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
                  <dt className="text-neutral-500">Pass ID</dt>
                  <dd className="break-all font-mono text-xs text-neutral-800">{result.id}</dd>
                </div>
                <div>
                  <dt className="text-neutral-500">Record status</dt>
                  <dd className="font-medium capitalize text-neutral-900">{result.status}</dd>
                </div>
              </dl>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full border-neutral-300 sm:w-auto"
              onClick={() => {
                setResult(null);
                setError("");
                setInput("");
              }}
            >
              Verify another pass
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
