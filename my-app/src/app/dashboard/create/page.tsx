"use client";

import { useState } from "react";
import type { TransportType, Duration, TransportPass } from "@/types";
import PassCard from "@/components/PassCard";
import { useUser } from "@/contexts/UserContext";
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
import { cn } from "@/lib/utils";

const TRANSPORT_OPTIONS: TransportType[] = [
  "Bus",
  "Metro",
  "Shared Vehicle",
  "All-in-One",
];
const DURATION_OPTIONS: Duration[] = ["Daily", "Weekly", "Monthly"];

type InsertedPass = {
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
      const res = await fetch("/api/passes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ transportType, duration }),
      });
      const data = (await res.json()) as { error?: string; pass?: InsertedPass };

      if (!res.ok || !data.pass) {
        setError(data.error ?? "Failed to create pass.");
        return;
      }

      const inserted = data.pass;
      const pass: TransportPass = {
        id: String(inserted.id),
        userId: String(inserted.user_id),
        userName: user.name,
        transportType: inserted.pass_type as TransportType,
        duration: inserted.duration_type as Duration,
        startDate: String(inserted.start_date ?? "").slice(0, 10),
        expiryDate: String(inserted.expiry_date ?? "").slice(0, 10),
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
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Create pass</h1>
        <p className="mt-2 max-w-2xl text-neutral-500">
          Choose transport and duration. We&apos;ll issue a pass with a secure QR token—full
          details load when the code is verified.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-neutral-200 bg-white shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-900">
              <Sparkles className="size-5 text-[#6B46FE]" />
              New pass
            </CardTitle>
            <CardDescription className="text-neutral-500">
              Options apply immediately after you submit.
            </CardDescription>
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
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button
                type="submit"
                className={cn(
                  "h-12 w-full bg-[#6B46FE] text-white hover:bg-[#5b3ad4]",
                  creating && "opacity-80"
                )}
                size="lg"
                disabled={creating}
              >
                {creating ? "Creating…" : "Create pass"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900">Preview</h2>
          {createdPass ? (
            <PassCard pass={createdPass} />
          ) : (
            <Card className="flex min-h-[280px] items-center justify-center border-2 border-dashed border-neutral-200 bg-white">
              <CardContent className="py-12 text-center text-neutral-500">
                Your new pass and QR will show here after you create it.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
