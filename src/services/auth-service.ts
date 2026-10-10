import { API_BASE_URL } from "@/lib/api-client";
import type { ApiResult } from "@/types/order";
import type { AuthResponse, RegisterPayload } from "@/types/auth";

/**
 * Student auth endpoints on the existing Spring Boot application.
 * The contract is unchanged from the server-rendered pages:
 *   POST /auth/student/login-password  { email, password }
 *   POST /auth/student/send-otp?email=
 *   POST /auth/student/login-otp?email=&otp=
 *   POST /auth/student/register        { name, email, password, ... }
 * No new API layer — this follows the same ApiResult shape as
 * order-service and review-service so callers handle failure explicitly.
 */
/* Single source of truth for the Spring Boot origin. Previously this
   file kept its own copy of the base URL and its own hard-coded
   fallback, so a domain change had to be made in two places and could
   silently miss one — exactly the hazard a migration runs into.
   NEXT_PUBLIC_AUTH_API_URL still overrides it if auth is ever split
   onto a separate host. */
const AUTH_BASE = process.env.NEXT_PUBLIC_AUTH_API_URL ?? API_BASE_URL;

/**
 * Confirms the backend accepts a freshly issued token by calling an
 * authenticated endpoint with it.
 *
 * A JWT can't be cryptographically verified in the browser — the signing
 * secret is server-side — so this proves acceptance rather than decoding
 * the token and asserting validity. Shared by the login, signup and guest
 * order flows so all three produce the same verified session.
 *
 * Uses a direct fetch rather than the shared apiRequest helper on purpose:
 * apiRequest redirects to /login on 401, and a failed verification here
 * must leave the person on the form instead.
 */
export async function verifySession(token: string): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_BASE}/student/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function post<T>(path: string, body?: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${AUTH_BASE}${path}`, {
      method: "POST",
      // Cookies matter here: the backend issues a session alongside the
      // token, and omitting them breaks the dashboard hand-off.
      credentials: "include",
      ...(body
        ? {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        : {}),
    });
    const text = await res.text();
    let parsed: Record<string, unknown> = {};
    try {
      parsed = JSON.parse(text);
    } catch {
      /* non-JSON body */
    }
    if (!res.ok) {
      return {
        ok: false,
        error:
          (parsed.message as string) ||
          (parsed.error as string) ||
          `Request failed (${res.status}).`,
      };
    }
    return { ok: true, data: parsed as T };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Please check your connection.",
    };
  }
}

export const loginWithPassword = (email: string, password: string) =>
  post<AuthResponse>("/auth/student/login-password", { email, password });

export const sendOtp = (email: string) =>
  post<Record<string, never>>(
    `/auth/student/send-otp?email=${encodeURIComponent(email)}`,
  );

export const loginWithOtp = (email: string, otp: string) =>
  post<AuthResponse>(
    `/auth/student/login-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`,
  );

export const registerStudent = (payload: RegisterPayload) =>
  post<AuthResponse>("/auth/student/register", payload);

/**
 * Persists the session exactly as the existing pages do, so the backend
 * dashboard keeps working unchanged.
 *
 * Note: tokens in localStorage are readable by any script on the origin.
 * That's the current contract, not a choice made here — worth moving to
 * httpOnly cookies when the backend can issue them.
 */
export function storeSession(data: AuthResponse, email: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", data.accessToken ?? "");
  localStorage.setItem("refreshToken", data.refreshToken ?? "");
  localStorage.setItem("userId", String(data.userId ?? ""));
  localStorage.setItem("userRole", data.role ?? "");
  localStorage.setItem("userEmail", email);
}
