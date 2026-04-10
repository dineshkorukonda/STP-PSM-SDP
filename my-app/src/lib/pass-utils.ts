import type { Duration } from "@/types";

export function computeExpiryDate(duration: Duration): { start: Date; expiry: Date } {
  const start = new Date();
  const expiry = new Date(start);
  if (duration === "Daily") expiry.setDate(expiry.getDate() + 1);
  else if (duration === "Weekly") expiry.setDate(expiry.getDate() + 7);
  else expiry.setMonth(expiry.getMonth() + 1);
  return { start, expiry };
}

export function formatDateISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function generateQrToken(): string {
  const part = () =>
    Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  return `SP-${part().toUpperCase()}-${part().toUpperCase()}`;
}
