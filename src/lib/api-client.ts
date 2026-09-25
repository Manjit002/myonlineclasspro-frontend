import type { ApiResult } from "@/types/order";

/**
 * Single source of truth for the Spring Boot backend origin.
 *
 * Every REST path and the WebSocket endpoint are built from this, so the
 * Elastic Beanstalk domain appears exactly once in the codebase. Override
 * with NEXT_PUBLIC_API_BASE_URL. This is the single source of truth for
 * the Spring Boot origin — auth-service and every other service derive
 * their base URL from here rather than keeping their own copy.
 *
 * Always https. The deprecated Elastic Beanstalk origin is not used
 * anywhere and has no fallback path.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://main.myonlineclasspro.com";

/* In-app UI routes. These are Next.js paths, never backend URLs:
   API_BASE_URL is for fetch() only and must never be used as a
   navigation destination. The old server-rendered dashboard is not part
   of the user-facing flow. */
export const LOGIN_ROUTE = "/login";
export const DASHBOARD_ROUTE = "/dashboard";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const t = localStorage.getItem("token");
  return !t || t === "null" || t === "undefined" || !t.trim() ? null : t;
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("userId");
}

export function clearSession() {
  if (typeof window === "undefined") return;
  ["token", "refreshToken", "userId", "userRole", "userEmail"].forEach((k) =>
    localStorage.removeItem(k),
  );
}

export function logout() {
  clearSession();
  // A hard navigation is deliberate here: it discards all in-memory state
  // (cached profile, open WebSocket, panel data) that a client-side
  // router.push would leave behind after signing out.
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  if (typeof window !== "undefined") window.location.href = LOGIN_ROUTE;
}

/**
 * Turns backend/server noise into something a student can act on.
 * Ported from the original dashboard's friendlyError().
 */
export function friendlyError(msg?: string): string {
  if (!msg) return "Unknown error";
  if (/ByteBuddy|hibernate|proxy|Type definition/i.test(msg))
    return "Server serialization error";
  if (/401|Unauthorized/.test(msg))
    return "Session expired — please log in again";
  if (/403|Forbidden/.test(msg)) return "Access denied";
  if (/404/.test(msg)) return "Resource not found";
  if (/500/.test(msg)) return "Server error — please try again";
  if (/NetworkError|Failed to fetch/i.test(msg))
    return "Network error — check your connection";
  return msg.length > 120 ? msg.slice(0, 120) + "…" : msg;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Multipart bodies must not have Content-Type set manually. */
  formData?: FormData;
  signal?: AbortSignal;
}

/**
 * Authenticated request against the Spring Boot API.
 *
 * - Attaches `Authorization: Bearer <token>` (read fresh each call, so a
 *   refreshed token is picked up without a reload).
 * - 401/403 clears the session and redirects to the in-app login, matching
 *   the original dashboard's behaviour.
 * - Never sets Content-Type for FormData: the browser must generate the
 *   multipart boundary itself.
 */
export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<ApiResult<T>> {
  const token = getToken();
  if (!token) {
    logout();
    return { ok: false, error: "Not authenticated." };
  }

  const { body, formData, headers, ...rest } = options;
  const finalHeaders: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...((headers as Record<string, string>) ?? {}),
  };

  let payload: BodyInit | undefined;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: payload,
    });

    if (res.status === 401 || res.status === 403) {
      logout();
      return { ok: false, error: "Session expired — please log in again." };
    }

    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      /* non-JSON response body */
    }

    if (!res.ok) {
      const errObj = parsed as { message?: string; error?: string } | null;
      return {
        ok: false,
        error: friendlyError(
          errObj?.message || errObj?.error || `Request failed (${res.status})`,
        ),
      };
    }
    return { ok: true, data: parsed as T };
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { ok: false, error: "Request cancelled." };
    }
    return { ok: false, error: friendlyError((err as Error)?.message) };
  }
}

/**
 * Jackson serialises LocalDateTime as an array when JavaTimeModule isn't
 * registered, so dates arrive as [y,M,d,H,m,s] | epoch | ISO string.
 * All three are handled here rather than at each call site.
 */
export type BackendDate = string | number | number[] | null | undefined;

export function parseBackendDate(v: BackendDate): Date | null {
  if (v == null || v === "") return null;
  if (Array.isArray(v)) {
    return new Date(
      v[0],
      (v[1] ?? 1) - 1,
      v[2] ?? 1,
      v[3] ?? 0,
      v[4] ?? 0,
      v[5] ?? 0,
    );
  }
  if (typeof v === "number") return new Date(v < 1e11 ? v * 1000 : v);
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDate(v: BackendDate): string {
  const d = parseBackendDate(v);
  if (!d || isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "🚨 4h 12m" / "🔴 OVERDUE" — the original's live deadline label. */
export function deadlineLabel(v: BackendDate): string {
  const d = parseBackendDate(v);
  if (!d) return "—";
  const ms = d.getTime() - Date.now();
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  if (ms < 0) return "🔴 OVERDUE";
  if (h < 1) return `🚨 ${m}m`;
  if (h < 24) return `🚨 ${h}h ${m}m`;
  if (h < 72) return `⚠️ ${Math.round(h / 24)}d ${h % 24}h`;
  return `⏰ ${Math.round(h / 24)}d`;
}

export function deadlineColor(v: BackendDate): string {
  const d = parseBackendDate(v);
  if (!d) return "var(--text-muted)";
  const ms = d.getTime() - Date.now();
  if (ms < 0 || ms < 86400000) return "var(--danger)";
  if (ms < 259200000) return "#ff8c00";
  return "var(--text-muted)";
}

export function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

/** Status → badge class, ported verbatim from the original mapping. */
export function statusBadgeClass(status?: string): string {
  const map: Record<string, string> = {
    CREATED: "badge badge-pending",
    REVIEW_PENDING: "badge badge-pending",
    PRICE_PENDING: "badge badge-price",
    PRICE_QUOTED: "badge badge-price",
    UNDER_REVIEW: "badge badge-review",
    PRICE_SET: "badge badge-price",
    PRICE_UPDATED: "badge badge-price",
    AUTO_PRICED: "badge badge-price",
    ASSIGNED: "badge badge-assigned",
    REASSIGNED: "badge badge-assigned",
    UNASSIGNED: "badge badge-unassigned",
    IN_PROGRESS: "badge badge-progress",
    SUBMITTED: "badge badge-submitted",
    COMPLETED: "badge badge-complete",
    PAID: "badge badge-paid",
    PARTIALLY_PAID: "badge badge-partial",
    INSTALLMENT_ACTIVE: "badge badge-partial",
    REVIEW: "badge badge-review",
    CANCELLED: "badge badge-cancelled",
    FAILED: "badge badge-failed",
    PENDING: "badge badge-pending",
    ACTIVE: "badge badge-active",
  };
  return map[status ?? ""] ?? "badge badge-unknown";
}
