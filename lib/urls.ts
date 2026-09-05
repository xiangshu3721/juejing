export function reviewApiUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_REVIEW_API_URL?.trim();
  return fromEnv || "/api/review";
}

export function assetUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}
