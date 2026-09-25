"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShieldAlert, Loader2, RefreshCw } from "lucide-react";
import {
  checkIpSecurity,
  VPN_RECHECK_MS,
  type IpSecurityResult,
} from "@/services/ip-security-service";

/**
 * Blocks the site while the backend reports a VPN/proxy connection.
 *
 * The backend is the only authority: this polls the existing security
 * check and reacts. It performs no detection of its own, so a visitor
 * cannot defeat it from devtools — clearing the overlay by hand just
 * means the next poll (or any navigation) puts it straight back.
 *
 * Restores automatically. When the visitor switches the VPN off, the
 * next successful check reports clean and the overlay unmounts — no
 * page refresh, no reload, no lost form state.
 */
export function VpnGuard() {
  const [blocked, setBlocked] = useState(false);
  const [result, setResult] = useState<IpSecurityResult | null>(null);
  const [checking, setChecking] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    // Yield before touching state: this is called straight from an
    // effect on mount, and setting state synchronously there trips the
    // React Compiler's cascading-render rule.
    await Promise.resolve();
    if (!mountedRef.current || ac.signal.aborted) return;
    setChecking(true);
    const r = await checkIpSecurity(ac.signal);
    if (!mountedRef.current || ac.signal.aborted) return;
    setResult(r);
    // Only a positive, readable result blocks — see the failure policy
    // in the service.
    setBlocked(r.determined && r.vpn);
    setChecking(false);
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => {
      mountedRef.current = false;
      abortRef.current?.abort();
    };
  }, [run]);

  // While blocked, keep asking. Toggling a VPN off doesn't notify the
  // page, so polling is what makes the automatic restore possible.
  useEffect(() => {
    if (!blocked) return;
    const id = window.setInterval(run, VPN_RECHECK_MS);
    return () => window.clearInterval(id);
  }, [blocked, run]);

  // Re-check immediately on the events that usually accompany a VPN
  // being switched off, so the visitor isn't left waiting for the timer.
  useEffect(() => {
    const onWake = () => {
      if (document.visibilityState === "visible") run();
    };
    window.addEventListener("online", run);
    window.addEventListener("focus", onWake);
    document.addEventListener("visibilitychange", onWake);
    return () => {
      window.removeEventListener("online", run);
      window.removeEventListener("focus", onWake);
      document.removeEventListener("visibilitychange", onWake);
    };
  }, [run]);

  // Blur and freeze the page behind the overlay. Scroll is locked and
  // the rest of the document is hidden from assistive tech while the
  // block is up.
  useEffect(() => {
    const root = document.body;
    if (blocked) {
      root.classList.add("vpn-blocked");
      const prev = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.classList.remove("vpn-blocked");
        root.style.overflow = prev;
      };
    }
  }, [blocked]);

  // Non-dismissible: swallow Escape, and keep focus inside the dialog
  // so the page behind can't be tabbed into.
  const dialogRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!blocked) return;
    dialogRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.key === "Tab") {
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>(
          "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
        );
        if (!focusables?.length) {
          e.preventDefault();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [blocked]);

  if (!blocked) return null;

  return (
    <div className="vpn-overlay" role="presentation">
      <div
        ref={dialogRef}
        className="vpn-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="vpn-title"
        aria-describedby="vpn-desc"
        tabIndex={-1}
      >
        <span className="vpn-icon" aria-hidden>
          <ShieldAlert size={26} />
        </span>

        <h2 id="vpn-title" className="vpn-title">
          VPN or Proxy Detected
        </h2>

        <p id="vpn-desc" className="vpn-desc">
          For account security and payment protection, MyOnlineClassPro
          can&apos;t be used over a VPN, proxy or anonymised connection.
        </p>

        <ol className="vpn-steps">
          <li>Turn off your VPN, proxy or anonymiser.</li>
          <li>Reconnect to your normal network.</li>
          <li>This page unlocks on its own — no refresh needed.</li>
        </ol>

        <div className="vpn-status" aria-live="polite">
          {checking ? (
            <>
              <Loader2 size={14} className="vpn-spin" aria-hidden />
              Checking your connection…
            </>
          ) : (
            <>
              <span className="vpn-dot" aria-hidden />
              Still detecting a VPN — rechecking automatically.
            </>
          )}
        </div>

        <button type="button" className="vpn-retry" onClick={run}>
          <RefreshCw size={15} aria-hidden />
          Check again now
        </button>

        {result?.country && (
          <p className="vpn-meta">
            Connection reported from {result.country}
            {result.ip ? ` · ${result.ip}` : ""}
          </p>
        )}

        <p className="vpn-help">
          Still stuck? Contact{" "}
          <a href="mailto:support@myonlineclasspro.com">
            support@myonlineclasspro.com
          </a>
        </p>
      </div>
    </div>
  );
}
