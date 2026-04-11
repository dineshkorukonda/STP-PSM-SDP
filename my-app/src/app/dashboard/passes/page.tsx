"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PassCard from "@/components/PassCard";
import { useUser } from "@/contexts/UserContext";
import type { TransportPass, TransportType, Duration } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type PassRow = {
  id: string;
  user_id: string;
  pass_type: string | null;
  duration_type: string | null;
  start_date: string | null;
  expiry_date: string | null;
  status: string | null;
  qr_token: string;
  created_at: string;
};

export default function MyPassesPage() {
  const [passes, setPasses] = useState<TransportPass[]>([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const res = await fetch("/api/passes", { credentials: "include" });
      if (cancelled) return;

      if (!res.ok) {
        setPasses([]);
        setLoading(false);
        return;
      }

      const json = (await res.json()) as { passes?: PassRow[] };
      const data = json.passes ?? [];

      const mapped: TransportPass[] = data.map((row) => ({
        id: String(row.id),
        userId: String(row.user_id),
        userName: user.name,
        transportType: row.pass_type as TransportType,
        duration: row.duration_type as Duration,
        startDate: row.start_date
          ? String(row.start_date).slice(0, 10)
          : "",
        expiryDate: row.expiry_date
          ? String(row.expiry_date).slice(0, 10)
          : "",
        createdAt: row.created_at
          ? new Date(String(row.created_at)).toISOString()
          : "",
        qrToken: String(row.qr_token ?? ""),
        status: String(row.status ?? "active"),
      }));
      setPasses(mapped);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My passes</h1>
        <p className="mt-2 text-muted-foreground">
          All passes tied to your account. Each QR encodes only a token—verify to see full
          details.
        </p>
      </div>

      {loading ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center gap-3 py-20">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading passes…</p>
          </CardContent>
        </Card>
      ) : passes.length === 0 ? (
        <Card className="border-dashed border-2 bg-muted/10">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="font-medium text-foreground">No passes yet</p>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Create your first digital pass—it only takes a moment.
            </p>
            <Button asChild className="mt-8" size="lg">
              <Link href="/dashboard/create">Create pass</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {passes.map((pass) => (
            <PassCard key={pass.id} pass={pass} />
          ))}
        </div>
      )}
    </div>
  );
}
