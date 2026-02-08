export type TransportType = "Bus" | "Metro" | "Shared Vehicle" | "All-in-One";
export type Duration = "Daily" | "Weekly" | "Monthly";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TransportPass {
  id: string;
  userId: string;
  userName: string;
  transportType: TransportType;
  duration: Duration;
  expiryDate: string;
  createdAt: string;
}
