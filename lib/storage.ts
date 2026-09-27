import { normalizeReport } from "./report";
import type { SavedReview } from "./types";

const KEY = "juelens.reviews.v1";

function canUseStorage() {
  return typeof window !== "undefined";
}

export function listReviews(): SavedReview[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedReview[];
    return Array.isArray(parsed)
      ? parsed
          .map((item) => {
            try {
              return { ...item, report: normalizeReport(item.report) };
            } catch {
              return null;
            }
          })
          .filter((item): item is SavedReview => Boolean(item))
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      : [];
  } catch {
    return [];
  }
}

export function getReview(id: string): SavedReview | null {
  return listReviews().find((item) => item.id === id) ?? null;
}

export function newReviewId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `review-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function saveReview(review: SavedReview): SavedReview {
  const all = listReviews().filter((item) => item.id !== review.id);
  all.unshift(review);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  return review;
}

export function nextCaseName(): string {
  const n = listReviews().length + 1;
  return `个案 ${String(n).padStart(3, "0")}`;
}
