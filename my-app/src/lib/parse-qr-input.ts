/**
 * Extract a pass token from pasted QR content: public URL, legacy JSON, or raw token.
 */
export function extractTokenFromQrInput(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const urlMatch = trimmed.match(/\/p\/([^/?#]+)/);
  if (urlMatch?.[1]) {
    try {
      const t = decodeURIComponent(urlMatch[1]).trim();
      return t.length >= 8 ? t : null;
    } catch {
      const t = urlMatch[1].trim();
      return t.length >= 8 ? t : null;
    }
  }

  try {
    const parsed = JSON.parse(trimmed) as { v?: number; t?: string };
    if (parsed && typeof parsed.t === "string" && parsed.t.trim().length > 0) {
      const t = parsed.t.trim();
      return t.length >= 8 ? t : null;
    }
  } catch {
    /* plain token */
  }

  if (trimmed.startsWith("SP-") && trimmed.length >= 8) return trimmed;
  return trimmed.length >= 8 ? trimmed : null;
}
