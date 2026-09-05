import { API_BASE_URL, friendlyError } from "@/lib/api-client";
import type { ApiResult } from "@/types/order";

// Re-exported so callers of this flow import verification from one place.
export { verifySession } from "@/services/auth-service";

/**
 * Guest Order V2 — the homepage "Free Instant Quote" handoff.
 *
 * This endpoint is an authentication handoff, not just an order create:
 * the backend finds-or-creates the student, provisions their wallet,
 * resolves IP/country/VPN, creates the order, notifies admins, sends the
 * emails, and returns a JWT. None of that is duplicated here.
 *
 * Deliberately NOT the older /orders/guest, and NOT the authenticated
 * multipart /orders used by the in-dashboard order form.
 */

/** Matches GuestOrderV2RequestDTO exactly — do not rename these fields. */
export interface GuestOrderV2Request {
  assignmentType: string;
  subject: string;
  deadline: string;
  name: string;
  phone: string;
  email: string;
}

/** Matches GuestOrderV2ResponseDTO exactly. */
export interface GuestOrderV2Response {
  token: string;
  studentId: number;
  orderId: number;
}

/**
 * Deadline keys the backend understands. Sent lowercase; the UI keeps its
 * own capitalised labels. The backend derives the actual date from these
 * (longer→+60d, regular→+30d, standard→+10d, urgent→+5d), so no date is
 * calculated or sent from here.
 */
export const DEADLINE_VALUES = {
  LONGER: "longer",
  REGULAR: "regular",
  STANDARD: "standard",
  URGENT: "urgent",
} as const;

/**
 * Creates the guest order.
 *
 * JSON, not multipart. No Authorization header — this is a guest route.
 * No price, expectedPrice, files, IP or country: the displayed $15/$40/$25
 * is UI-only and is intentionally not part of this contract.
 */
export async function createGuestOrderV2(
  payload: GuestOrderV2Request,
): Promise<ApiResult<GuestOrderV2Response>> {
  try {
    const res = await fetch(`${API_BASE_URL}/orders/guest/v2`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      /* non-JSON body — fall through to a status-based message */
    }

    if (!res.ok) {
      const err = parsed as { message?: string; error?: string } | null;
      // Prefer the backend's own message when it sends one; never surface
      // a stack trace or raw exception text to the student.
      return {
        ok: false,
        error: friendlyError(
          err?.message || err?.error || `Request failed (${res.status})`,
        ),
      };
    }

    const data = parsed as Partial<GuestOrderV2Response> | null;
    // Validate the response shape before trusting it as a session.
    if (!data?.token) {
      return { ok: false, error: "Authentication token was not returned." };
    }
    if (data.studentId == null) {
      return { ok: false, error: "Student ID was not returned." };
    }
    if (data.orderId == null) {
      return { ok: false, error: "Order ID was not returned." };
    }

    return {
      ok: true,
      data: {
        token: data.token,
        studentId: data.studentId,
        orderId: data.orderId,
      },
    };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Please check your connection.",
    };
  }
}
