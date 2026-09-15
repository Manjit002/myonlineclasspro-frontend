import type { ApiResult, OrderRequest, OrderResponse } from "@/types/order";

/**
 * Base URL for the existing order endpoint.
 *
 * Read from an env var so the same build can point at staging vs
 * production without a code change. The fallback is the current
 * production proxy the existing site already posts to, so the app still
 * works if the env var is missing rather than failing silently.
 */
const ORDER_ENDPOINT =
  process.env.NEXT_PUBLIC_ORDER_API_URL ??
  "https://myonlineclasspro.com/proxy.php";

/** Matches the backend's requirement: exactly 10 digits, nothing else. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.trim().replace(/\D/g, "");
  return digits.length === 10 ? digits : null;
}

/**
 * Converts a datetime-local value (yyyy-MM-ddTHH:mm) into the
 * LocalDateTime shape the Spring Boot backend parses (adds the seconds
 * component it expects). Returns the input untouched if it's already in
 * some other shape, so this never silently corrupts an unexpected value.
 */
export function toBackendDateTime(value: string): string {
  return value.length === 16 ? `${value}:00` : value;
}

/**
 * Submits a guest order.
 *
 * Returns a discriminated result rather than throwing, so every caller
 * is forced by the type system to handle the failure branch -- the
 * "error state" the UI spec requires can't be accidentally skipped.
 */
export async function submitOrder(
  payload: OrderRequest,
  signal?: AbortSignal,
): Promise<ApiResult<OrderResponse>> {
  try {
    const res = await fetch(ORDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok) {
      // Surface the server's own message when it sends one, since the
      // backend returns useful validation text; fall back to the status
      // code so the user still gets something actionable.
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        error: text || `Request failed with status ${res.status}.`,
      };
    }

    const data = (await res.json().catch(() => ({}))) as OrderResponse;
    return { ok: true, data };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Request cancelled." };
    }
    return {
      ok: false,
      error:
        "Could not reach the server. Please check your connection and try again.",
    };
  }
}
