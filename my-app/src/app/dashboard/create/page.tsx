"use client";

import { useState } from "react";
import type { TransportType, Duration } from "@/types";
import PassCard from "@/components/PassCard";
import {
  getStoredUser,
  addStoredPass,
  generatePassId,
  getExpiryDate,
} from "@/lib/storage";
import type { TransportPass } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = getStoredUser();
    if (!user) return;

    const id = generatePassId();
    const expiryDate = getExpiryDate(duration);
    const pass: TransportPass = {
      id,
      userId: user.id,
      userName: user.name,
      transportType,
      duration,
      expiryDate,
      createdAt: new Date().toISOString(),
    };
    addStoredPass(pass);
    setCreatedPass(pass);
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Create Pass</h1>
      <p className="mt-2 text-muted-foreground">
        Choose transport type and duration to generate a new digital pass.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New pass</CardTitle>
            <CardDescription>Select options and create your pass</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="transportType">Transport Type</Label>
                <Select
                  value={transportType}
                  onValueChange={(v) => setTransportType(v as TransportType)}
                >
                  <SelectTrigger id="transportType" className="h-10 w-full">
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
                <Select value={duration} onValueChange={(v) => setDuration(v as Duration)}>
                  <SelectTrigger id="duration" className="h-10 w-full">
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
              <Button type="submit" className="w-full" size="lg">
                Create pass
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Your pass</h2>
          {createdPass ? (
            <PassCard pass={createdPass} />
          ) : (
            <Card className="flex min-h-[200px] items-center justify-center border-dashed">
              <CardContent className="py-12 text-center text-muted-foreground">
                Submit the form to generate a pass. It will appear here.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
