type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function limitPerHour() {
  const n = Number(process.env.REVIEW_RATE_LIMIT_PER_HOUR || "8");
  return Number.isFinite(n) && n > 0 ? n : 8;
}

export function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}

export function takeReviewSlot(key: string): { ok: true } | { ok: false; retryMinutes: number } {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const max = limitPerHour();
  const current = buckets.get(key);

  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (current.count >= max) {
    return { ok: false, retryMinutes: Math.max(1, Math.ceil((current.resetAt - now) / 60000)) };
  }

  current.count += 1;
  return { ok: true };
}
