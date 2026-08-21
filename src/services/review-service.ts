import type { ApiResult } from "@/types/order";
import type { Review, ReviewSubmission } from "@/types/review";

/**
 * Existing PHP proxy. It bridges this HTTPS front end to the HTTP Spring
 * Boot backend and owns the API contract:
 *   GET  ?               -> GET  /api/reviews
 *   GET  ?action=detail  -> GET  /api/reviews/{id}
 *   POST ?action=create  -> POST /api/reviews  (multipart/form-data)
 * Not replaced or re-specified here.
 */
const REVIEWS_ENDPOINT =
  process.env.NEXT_PUBLIC_REVIEWS_API_URL ??
  "https://myonlineclasspro.com/reviews-proxy.php";

/** Limits enforced by the proxy; mirrored so the UI can warn early. */
export const MAX_FILE_BYTES = 25 * 1024 * 1024;
export const MAX_IMAGES = 6;
export const MAX_VIDEOS = 2;
export const ALLOWED_IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "gif"];
export const ALLOWED_VIDEO_EXT = ["mp4", "mov", "webm"];

export async function fetchReviews(
  signal?: AbortSignal,
): Promise<ApiResult<Review[]>> {
  try {
    const res = await fetch(REVIEWS_ENDPOINT, { signal });
    if (!res.ok) {
      return { ok: false, error: `Could not load reviews (${res.status}).` };
    }
    const data = await res.json();
    // The endpoint may return a bare array or an object wrapping one.
    const list: Review[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.reviews)
        ? data.reviews
        : [];
    return { ok: true, data: list };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Request cancelled." };
    }
    return { ok: false, error: "Could not reach the server." };
  }
}

/**
 * Creates a review.
 *
 * Content-Type is deliberately NOT set: the browser must generate the
 * multipart boundary itself, and setting the header manually omits it,
 * which makes the proxy fail to parse the body.
 */
export async function submitReview(
  payload: ReviewSubmission,
): Promise<ApiResult<{ message?: string }>> {
  const fd = new FormData();
  fd.append("reviewerName", payload.reviewerName.trim());
  fd.append("rating", String(payload.rating));
  fd.append("title", payload.title.trim());
  fd.append("review", payload.review.trim());
  if (payload.email?.trim()) fd.append("email", payload.email.trim());
  if (payload.country?.trim()) fd.append("country", payload.country.trim());
  payload.images.forEach((f) => fd.append("images", f));
  payload.videos.forEach((f) => fd.append("videos", f));

  try {
    const res = await fetch(`${REVIEWS_ENDPOINT}?action=create`, {
      method: "POST",
      body: fd,
    });
    const text = await res.text();
    let parsed: { error?: string; message?: string } = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      /* non-JSON body; fall through to status-based message */
    }
    if (!res.ok) {
      // Surface the backend's own validation message when it sends one.
      return {
        ok: false,
        error: parsed.error || text || `Submission failed (${res.status}).`,
      };
    }
    return { ok: true, data: parsed };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Please check your connection.",
    };
  }
}

/** "Today", "5 days ago", "2 months ago" — matching the original card. */
export function relativeDate(iso?: string): string {
  if (!iso) return "";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}
