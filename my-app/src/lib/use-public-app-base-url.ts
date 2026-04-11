"use client";

import { useEffect, useState } from "react";

/** Base URL for public pass links (QR). Uses NEXT_PUBLIC_APP_URL, then the current origin. */
export function usePublicAppBaseUrl(): string {
  const [base, setBase] = useState(() => {
    const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
    return env;
  });

  useEffect(() => {
    if (!base) {
      setBase(window.location.origin);
    }
  }, [base]);

  return base;
}
