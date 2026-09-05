"use client";

import { useState } from "react";
import {
  MessageSquare,
  CreditCard,
  CalendarClock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import {
  PaymentModal,
  InstallmentsModal,
} from "@/components/dashboard/payment-modals";
import type { OrderDetail } from "@/types/dashboard";

/**
 * Action area for the order detail page.
 *
 * Every action routes to functionality that already exists:
 *   • Message Support  -> the page's existing chat tab
 *   • Pay              -> createCheckout(), the same call the payment
 *                         retry view uses
 *   • Installments     -> the existing /dashboard/payments view, which
 *                         already loads installments per order
 * No new payment, installment or chat logic is introduced here.
 */

/** Mirrors the payments page's list so paid state is judged identically. */
const PAID_STATUSES = ["SUCCESS", "PAID", "COMPLETED", "CANCELLED"];

function isPaid(order: OrderDetail): boolean {
  return PAID_STATUSES.includes(
    String(order.paymentStatus ?? "").toUpperCase(),
  );
}

export function OrderActions({
  order,
  onMessageSupport,
}: {
  order: OrderDetail;
  /** Switches the page to its existing chat tab. */
  onMessageSupport: () => void;
}) {
  const [payOpen, setPayOpen] = useState(false);
  const [instOpen, setInstOpen] = useState(false);

  const paid = isPaid(order);
  // Amount comes straight from the order, so it tracks any price change.
  const amount = typeof order.price === "number" ? order.price : null;
  const amountLabel =
    amount != null
      ? amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
      : null;

  return (
    <section className="ord-actions" aria-label="Order actions">
      <button type="button" className="ord-support" onClick={onMessageSupport}>
        <MessageSquare size={16} aria-hidden />
        Message Support
      </button>

      <div className="ord-pay-row">
        {paid ? (
          <p className="ord-paid" role="status">
            <CheckCircle2 size={16} aria-hidden />
            Payment complete
            {amountLabel ? ` — ${amountLabel}` : ""}
          </p>
        ) : (
          <button
            type="button"
            className="ord-pay"
            onClick={() => setPayOpen(true)}
            disabled={amount == null}
          >
            <CreditCard size={16} aria-hidden />
            <span className="ord-pay-label">
              {`Pay ${amountLabel ?? ""}`.trim()}
            </span>
            <ArrowRight size={16} aria-hidden />
          </button>
        )}

        <button
          type="button"
          className="ord-inst"
          onClick={() => setInstOpen(true)}
        >
          <CalendarClock size={15} aria-hidden />
          Installments
        </button>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        order={order}
      />
      <InstallmentsModal
        open={instOpen}
        onClose={() => setInstOpen(false)}
        order={order}
      />
    </section>
  );
}
