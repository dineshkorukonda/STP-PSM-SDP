import type { User, TransportPass } from "@/types";

const USER_KEY = "smartpass_user";
const PASSES_KEY = "smartpass_passes";

export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(USER_KEY);
}

export function getStoredPasses(): TransportPass[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PASSES_KEY);
    return raw ? (JSON.parse(raw) as TransportPass[]) : [];
  } catch {
    return [];
  }
}

export function setStoredPasses(passes: TransportPass[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PASSES_KEY, JSON.stringify(passes));
}

export function addStoredPass(pass: TransportPass): void {
  const passes = getStoredPasses();
  setStoredPasses([pass, ...passes]);
}

export function generatePassId(): string {
  return "SP-" + Math.random().toString(36).slice(2, 10).toUpperCase();
}

export function getExpiryDate(duration: "Daily" | "Weekly" | "Monthly"): string {
  const d = new Date();
  switch (duration) {
    case "Daily":
      d.setDate(d.getDate() + 1);
      break;
    case "Weekly":
      d.setDate(d.getDate() + 7);
      break;
    case "Monthly":
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d.toISOString().split("T")[0];
}
