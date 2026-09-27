export function reviewApiUrl() {
  const fromEnv = process.env.NEXT_PUBLIC_REVIEW_API_URL?.trim();
  return fromEnv || "/api/review";
}

export function assetUrl(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}`;
}

/**
 * In-app route for a full document load.
 * `next/link` adds basePath itself; a plain `<a>` or `location` does not.
 * Pages sets basePath and trailingSlash together, so a non-empty base
 * also gets a trailing slash (`/juejing/new/`).
 */
export function appHref(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const splitAt = ["?", "#"]
    .map((mark) => path.indexOf(mark))
    .filter((index) => index >= 0)
    .reduce((min, index) => Math.min(min, index), path.length);
  let pathname = path.slice(0, splitAt);
  const suffix = path.slice(splitAt);
  if (!pathname.startsWith("/")) pathname = `/${pathname}`;
  if (base) {
    if (!pathname.endsWith("/")) pathname += "/";
  } else if (pathname.length > 1) {
    pathname = pathname.replace(/\/+$/, "");
  }
  return `${base}${pathname}${suffix}`;
}
