"use client";

import { QRCodeSVG } from "qrcode.react";
import type { TransportPass } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PassCardProps {
  pass: TransportPass;
}

export default function PassCard({ pass }: PassCardProps) {
  const isExpired = new Date(pass.expiryDate) < new Date();
  const qrValue = JSON.stringify({
    id: pass.id,
    type: pass.transportType,
    expiry: pass.expiryDate,
  });

  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        isExpired && "opacity-80 ring-2 ring-amber-200"
      )}
    >
      <div className="border-b bg-primary px-6 py-4">
        <p className="text-sm font-medium uppercase tracking-wider text-primary-foreground/90">
          {pass.transportType}
        </p>
        <p className="mt-1 text-2xl font-bold text-primary-foreground">
          {pass.userName}
        </p>
      </div>
      <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pass ID
          </p>
          <p className="font-mono text-sm font-semibold">{pass.id}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Valid until
          </p>
          <p className="text-sm font-medium">
            {new Date(pass.expiryDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            {isExpired && (
              <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                Expired
              </span>
            )}
          </p>
        </div>
        <div className="flex size-24 flex-shrink-0 items-center justify-center rounded-xl border bg-background p-1">
          <QRCodeSVG value={qrValue} size={88} level="M" includeMargin={false} />
        </div>
      </CardContent>
    </Card>
  );
}
