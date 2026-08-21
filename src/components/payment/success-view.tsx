"use client";

import { useSearchParams } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import {
  PaymentResult,
  DashboardLink,
  BackHomeLink,
} from "@/components/payment/payment-result";

export function SuccessView() {
  const params = useSearchParams();
  const mounted = useMounted();
  // Stripe appends session_id to its success_url.
  const sessionId = params.get("session_id");

  // Rendered only after mount so the server and client can't disagree
  // on the timestamp.
  const date = mounted
    ? new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  return (
    <PaymentResult
      tone="success"
      tag="Payment Confirmed"
      title="You're All Set!"
      subtitle={
        <>
          Your payment has been processed successfully.
          <br />
          Your order is now active and our team will be in touch shortly.
        </>
      }
      actions={
        <>
          <DashboardLink />
          <BackHomeLink />
        </>
      }
      footer={
        // Only shown when Stripe actually returned a session — never
        // "undefined" or an empty row.
        sessionId ? (
          <div className="pr-session">
            <span className="pr-session-lbl">Stripe Session ID</span>
            <span className="pr-session-val">{sessionId}</span>
          </div>
        ) : null
      }
    >
      <dl className="pr-summary">
        <div className="pr-summary-row">
          <dt>Status</dt>
          <dd className="is-success">Success</dd>
        </div>
        {sessionId && (
          <div className="pr-summary-row">
            <dt>Session</dt>
            <dd className="pr-truncate">{sessionId.slice(0, 20)}…</dd>
          </div>
        )}
        <div className="pr-summary-row">
          <dt>Date</dt>
          <dd suppressHydrationWarning>{date}</dd>
        </div>
      </dl>
    </PaymentResult>
  );
}
