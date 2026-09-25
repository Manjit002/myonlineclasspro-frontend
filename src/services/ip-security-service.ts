import { API_BASE_URL } from "@/lib/api-client";

/**
 * IP / VPN security check.
 *
 * The backend already resolves IP, country and VPN status (the same
 * resolution the Guest Order V2 handoff performs). This reads that
 * result; no detection is performed here, and nothing about it is
 * inferred in the browser.
 *
 * ── The one line to change if the route differs ──────────────
 * Everything else in this feature is written against the normalised
 * shape below, so pointing at a different path is a single edit.
 */
export const IP_SECURITY_PATH = "/security/ip-check";

/** How often to re-check while a visitor is blocked. */
export const VPN_RECHECK_MS = 10_000;

/** Normalised result the UI works with. */
export interface IpSecurityResult {
  /** True only when the backend positively reports a VPN/proxy. */
  vpn: boolean;
  country: string | null;
  ip: string | null;
  /** False when the check could not be completed (see failure policy). */
  determined: boolean;
}

/**
 * Field names differ between security providers, so the common ones are
 * accepted rather than forcing the backend to match one exact key.
 * Anything truthy among them means "VPN detected".
 */
function readVpnFlag(d: Record<string, unknown>): boolean | null {
  const keys = [
    "vpn",
    "isVpn",
    "vpnDetected",
    "isVpnDetected",
    "proxy",
    "isProxy",
    "anonymizer",
    "blocked",
  ];
  for (const k of keys) {
    const v = d[k];
    if (typeof v === "boolean") return v;
    if (typeof v === "string" && /^(true|false)$/i.test(v))
      return v.toLowerCase() === "true";
  }
  return null;
}

function readString(d: Record<string, unknown>, keys: string[]): string | null {
  for (const k of keys) {
    const v = d[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/**
 * Asks the backend whether the current connection is a VPN/proxy.
 *
 * FAILURE POLICY — fail open. If the endpoint errors, times out or
 * returns something unreadable, `determined` is false and `vpn` is
 * false, so the site stays usable. A blocking overlay that triggers on
 * its own outage would lock every visitor out of the site, including
 * paying customers, which is a worse failure than briefly missing a
 * VPN. Only a positive, readable "yes" from the backend blocks.
 */
export async function checkIpSecurity(
  signal?: AbortSignal,
): Promise<IpSecurityResult> {
  const fallback: IpSecurityResult = {
    vpn: false,
    country: null,
    ip: null,
    determined: false,
  };
  try {
    const res = await fetch(`${API_BASE_URL}${IP_SECURITY_PATH}`, {
      method: "GET",
      // Never served from cache: the whole point is the connection as
      // it is right now, after the visitor toggles their VPN.
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal,
    });
    if (!res.ok) return fallback;

    const data: unknown = await res.json();
    if (!data || typeof data !== "object") return fallback;
    const d = data as Record<string, unknown>;

    const flag = readVpnFlag(d);
    if (flag === null) return fallback;

    return {
      vpn: flag,
      country: readString(d, ["country", "countryCode", "country_code"]),
      ip: readString(d, ["ip", "ipAddress", "clientIp"]),
      determined: true,
    };
  } catch {
    return fallback;
  }
}
