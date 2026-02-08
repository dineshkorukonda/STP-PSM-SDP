"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getStoredUser } from "@/lib/storage";

export default function DashboardPage() {
  const [name, setName] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user) setName(user.name);
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Welcome back{name ? `, ${name}` : ""}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Use the sidebar to create a new pass or view your existing passes.
      </p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Get started with your digital transport pass</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="flex-1">
            <Link href="/dashboard/create">Create Pass</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="flex-1">
            <Link href="/dashboard/passes">My Passes</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
