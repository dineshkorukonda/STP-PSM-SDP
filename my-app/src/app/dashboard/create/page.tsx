"use client";

import { useState } from "react";
import type { TransportType, Duration, TransportPass } from "@/types";
import PassCard from "@/components/PassCard";
import { useUser } from "@/contexts/UserContext";
import { createClient } from "@/lib/supabase/client";
import {
  computeExpiryDate,
  formatDateISO,
  generateQrToken,
} from "@/lib/pass-utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const TRANSPORT_OPTIONS: TransportType[] = [
  "Bus",
  "Metro",
  "Shared Vehicle",
  "All-in-One",
];
const DURATION_OPTIONS: Duration[] = ["Daily", "Weekly", "Monthly"];

export default function CreatePassPage() {
  const [transportType, setTransportType] = useState<TransportType>("Bus");
  const [duration, setDuration] = useState<Duration>("Monthly");
  const [createdPass, setCreatedPass] = useState<TransportPass | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setError("");
    setCreating(true);
    try {
      const supabase = createClient();
      const { start, expiry } = computeExpiryDate(duration);
      const startDateStr = formatDateISO(start);
      const expiryDateStr = formatDateISO(expiry);
      const qrToken = generateQrToken();

      const { data: inserted, error: insertErr } = await supabase
        .from("passes")
        .insert({
          user_id: user.id,
          pass_type: transportType,
          duration_type: duration,
          start_date: startDateStr,
          expiry_date: expiryDateStr,
          status: "active",
          qr_token: qrToken,
        })
        .select("id, user_id, pass_type, duration_type, start_date, expiry_date, status, qr_token, created_at")
        .single();

      if (insertErr || !inserted) {
        setError(insertErr?.message ?? "Failed to create pass.");
        return;
      }

      const { data: tt } = await supabase
        .from("transport_types")
        .select("id")
        .eq("name", transportType)
        .maybeSingle();

      if (tt?.id != null) {
        await supabase.from("pass_transport_map").insert({
          pass_id: inserted.id,
          transport_type_id: tt.id,
        });
      }

      const pass: TransportPass = {
        id: String(inserted.id),
        userId: String(inserted.user_id),
        userName: user.name,
        transportType: inserted.pass_type as TransportType,
        duration: inserted.duration_type as Duration,
        startDate: String(inserted.start_date ?? startDateStr).slice(0, 10),
        expiryDate: String(inserted.expiry_date ?? expiryDateStr).slice(0, 10),
        createdAt: inserted.created_at
          ? new Date(String(inserted.created_at)).toISOString()
          : new Date().toISOString(),
        qrToken: String(inserted.qr_token),
        status: String(inserted.status ?? "active"),
      };
      setCreatedPass(pass);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create pass</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Choose transport and duration. We&apos;ll issue a pass with a secure QR token—full
          details load when the code is verified.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-border/80 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="size-5 text-primary" />
              New pass
            </CardTitle>
            <CardDescription>Options apply immediately after you submit.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="transportType">Transport</Label>
                <Select
                  value={transportType}
                  onValueChange={(v) => setTransportType(v as TransportType)}
                >
                  <SelectTrigger id="transportType" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSPORT_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select
                  value={duration}
                  onValueChange={(v) => setDuration(v as Duration)}
                >
                  <SelectTrigger id="duration" className="h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full h-11" size="lg" disabled={creating}>
                {creating ? "Creating…" : "Create pass"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Preview</h2>
          {createdPass ? (
            <PassCard pass={createdPass} />
          ) : (
            <Card className="flex min-h-[280px] items-center justify-center border-dashed border-2 bg-muted/20">
              <CardContent className="py-12 text-center text-muted-foreground">
                Your new pass and QR will show here after you create it.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
