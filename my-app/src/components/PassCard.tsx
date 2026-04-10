"use client";

import { QRCodeSVG } from "qrcode.react";
import type { TransportPass } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { QrPayload } from "@/types";

interface PassCardProps {
  pass: TransportPass;
  className?: string;
}

function qrEncode(payload: QrPayload): string {
  return JSON.stringify(payload);
}

export default function PassCard({ pass, className }: PassCardProps) {
  const expiry = new Date(pass.expiryDate);
  const start = new Date(pass.startDate);
  const isExpired = expiry < new Date(new Date().toDateString());
  const isActive = pass.status === "active" && !isExpired;

  const qrValue = qrEncode({ v: 1, t: pass.qrToken });

  return (
    <Card
      className={cn(
        "overflow-hidden border-border/80 shadow-md transition-shadow hover:shadow-lg",
        isExpired && "opacity-90 ring-2 ring-amber-300/60",
        className
      )}
    >
      <div className="relative border-b bg-gradient-to-br from-primary to-primary-hover px-6 py-5 text-primary-foreground">
        <div className="absolute right-4 top-4 rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
          {pass.transportType}
        </div>
        <p className="text-xs font-medium uppercase tracking-wider text-primary-foreground/85">
          Digital pass
        </p>
        <p className="mt-1 text-2xl font-bold tracking-tight">{pass.userName}</p>
        <p className="mt-2 text-sm text-primary-foreground/90">
          {pass.duration} · Valid through{" "}
          {expiry.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <CardContent className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1 space-y-3 text-sm">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Pass ID
            </p>
            <p className="mt-0.5 break-all font-mono text-xs font-medium text-foreground">
              {pass.id}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Starts
              </p>
              <p className="mt-0.5 font-medium">
                {start.toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <p className="mt-0.5">
                <span
                  className={cn(
                    "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
                    isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                      : "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100"
                  )}
                >
                  {isActive ? "Active" : isExpired ? "Expired" : pass.status}
                </span>
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Scanning the code looks up this pass server-side—no personal data is
            stored in the QR itself beyond a secure token.
          </p>
        </div>
        <div className="flex flex-shrink-0 flex-col items-center gap-2">
          <div className="flex size-28 items-center justify-center rounded-2xl border-2 border-border bg-white p-2 shadow-inner dark:bg-zinc-900">
            <QRCodeSVG value={qrValue} size={96} level="M" includeMargin={false} />
          </div>
          <p className="max-w-[7rem] text-center text-[10px] text-muted-foreground">
            Show at gates & validators
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
