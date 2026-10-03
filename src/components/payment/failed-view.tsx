"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcw, Loader2 } from "lucide-react";
import {
  PaymentResult,
  DashboardLink,
  BackHomeLink,
} from "@/components/payment/payment-result";
import { createCheckout } from "@/services/student-service";
import { SITE } from "@/constants/site";

const STEPS = [
  "Check that your card details are correct and the card is active.",
  "Ensure sufficient balance or try a different payment method.",
  "Return to your dashboard and retry the payment from your order.",
];

export function FailedView() {
  const params = useSearchParams();
  const router = useRouter();
  // Stripe's cancel_url can carry the order back so Retry knows what to
  // re-open. Without it we can't invent one, so Retry sends the student
  // to Payments where they pick the order — never a dead button.
  const orderId = params.get("orderId") ?? params.get("order_id");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function retry() {
    if (busy) return;
    if (!orderId) {
      router.push("/dashboard/payments");
      return;
    }
    setBusy(true);
    setError(null);
    // Reuses the existing checkout service — no second payment system,
    // no hard-coded Stripe URL.
    const r = await createCheckout(orderId, false);
    if (!r.ok) {
      setBusy(false);
      setError(r.error);
      return;
    }
    const url = r.data?.checkoutUrl ?? r.data?.url;
    if (!url) {
      setBusy(false);
      setError(
        "We couldn't start a new payment session. Please try from your dashboard.",
      );
      return;
    }
    window.location.assign(url);
  }

  return (
    <PaymentResult
      tone="failure"
      tag="Payment Failed"
      title="Something went wrong"
      subtitle={
        <>
          Your payment could not be processed.
          <br />
          No charges have been made to your account.
        </>
      }
      actions={
        <>
          <button
            type="button"
            className="pr-btn-primary"
            onClick={retry}
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 size={15} className="animate-spin" aria-hidden />
                Starting payment…
              </>
            ) : (
              <>
                <RotateCcw size={15} aria-hidden />
                Retry Payment
              </>
            )}
          </button>
          <DashboardLink variant="secondary" />
          <BackHomeLink />
        </>
      }
      footer={
        <p className="pr-support">
          Still having trouble?{" "}
          <a href={`mailto:${SITE.email}`}>Contact support</a>
        </p>
      }
    >
      <div className="pr-reason" role="note">
        <span aria-hidden>⚠️</span>
        <p>
          This can happen due to <strong>insufficient funds</strong>, a{" "}
          <strong>declined card</strong>, a network timeout, or the session
          expiring. Your order is still saved.
        </p>
      </div>

      <div className="pr-steps">
        <h2>What to do next</h2>
        <ol>
          {STEPS.map((s, i) => (
            <li key={s}>
              <span className="pr-step-n" aria-hidden>
                {i + 1}
              </span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>

      {error && (
        <p className="pr-error" role="alert">
          {error}
        </p>
      )}
    </PaymentResult>
  );
}
