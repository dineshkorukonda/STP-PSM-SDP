"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PassCard from "@/components/PassCard";
import { getStoredUser, getStoredPasses } from "@/lib/storage";
import type { TransportPass } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MyPassesPage() {
  const [passes, setPasses] = useState<TransportPass[]>([]);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;
    const all = getStoredPasses();
    setPasses(all.filter((p) => p.userId === user.id));
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Passes</h1>
      <p className="mt-2 text-muted-foreground">
        All your digital transport passes in one place.
      </p>

      {passes.length === 0 ? (
        <Card className="mt-12 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-muted-foreground">You don&apos;t have any passes yet.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first pass from the Create Pass section.
            </p>
            <Button asChild className="mt-6" size="lg">
              <Link href="/dashboard/create">Create Pass</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {passes.map((pass) => (
            <PassCard key={pass.id} pass={pass} />
          ))}
        </div>
      )}
    </div>
  );
}
