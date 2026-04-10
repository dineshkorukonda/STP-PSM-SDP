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
  startDate: string;
  expiryDate: string;
  createdAt: string;
  qrToken: string;
  status: string;
}

/** Payload embedded in QR codes (opaque token; details resolved via verify). */
export interface QrPayload {
  v: 1;
  t: string;
}

/** Result of public.get_pass_public RPC */
export interface VerifiedPassDetails {
  id: string;
  passType: string;
  duration: string;
  startDate: string;
  expiryDate: string;
  status: string;
  holderName: string;
  valid: boolean;
}
