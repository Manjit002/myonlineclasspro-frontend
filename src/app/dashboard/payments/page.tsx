"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Card, Spinner, Empty, Alert } from "@/components/dashboard/ui";
import {
  getOrders,
  getWallet,
  getPayments,
  getInstallmentsForOrder,
  createCheckout,
  payInstallment,
  walletSaving,
} from "@/services/student-service";
import {
  formatDate,
  statusBadgeClass,
  parseBackendDate,
} from "@/lib/api-client";
import type {
  OrderSummary,
  PaymentHistory,
  Installment,
} from "@/types/dashboard";

const PAID = ["SUCCESS", "PAID", "COMPLETED", "CANCELLED"];

export default function PaymentsPage() {
  const [payable, setPayable] = useState<OrderSummary[]>([]);
  const [orderId, setOrderId] = useState("");
  const [balance, setBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const [history, setHistory] = useState<PaymentHistory[] | null>(null);
  const [planOrderId, setPlanOrderId] = useState("");
  const [plan, setPlan] = useState<Installment[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [o, w, p] = await Promise.all([
      getOrders(0, 100),
      getWallet(),
      getPayments(),
    ]);
    if (o.ok) {
      setPayable(
        (o.data?.content ?? []).filter(
          (x) =>
            x.price != null &&
            Number(x.price) > 0 &&
            !PAID.includes(String(x.paymentStatus ?? "").toUpperCase()),
        ),
      );
    }
    if (w.ok) setBalance(Number(w.data?.balance ?? 0));
    setHistory(p.ok ? (Array.isArray(p.data) ? p.data : []) : []);
  }, []);

  useEffect(() => {
    // Wrapped so the first statement is an await — the effect body
    // itself never calls setState synchronously.
    void (async () => {
      await load();
    })();
  }, [load]);

  useEffect(() => {
    if (!planOrderId) return;
    getInstallmentsForOrder(planOrderId).then((r) =>
      setPlan(r.ok && Array.isArray(r.data) ? r.data : []),
    );
  }, [planOrderId]);

  const selected = useMemo(
    () => payable.find((o) => String(o.id) === orderId) ?? null,
    [payable, orderId],
  );
  const price = Number(selected?.price ?? 0);
  // Wallet covers at most 5% of the order value — the original's rule.
  const saving = useWallet ? walletSaving(balance, price) : 0;

  async function checkout() {
    if (!orderId) {
      setErr("Please select an order first.");
      return;
    }
    setBusy(true);
    setErr(null);
    const r = await createCheckout(orderId, useWallet);
    setBusy(false);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    const url = r.data?.checkoutUrl ?? r.data?.url;
    if (!url) {
      setErr("Invalid checkout URL returned.");
      return;
    }
    window.location.assign(url);
  }

  async function payOne(id: number) {
    const r = await payInstallment(id);
    if (!r.ok) {
      setErr(r.error);
      return;
    }
    const url = r.data?.checkoutUrl ?? r.data?.url;
    if (url) {
      window.location.assign(url);
      return;
    }
    // No checkout URL means it settled server-side — refresh the view.
    const again = await getInstallmentsForOrder(planOrderId);
    setPlan(again.ok && Array.isArray(again.data) ? again.data : []);
    load();
  }

  const totals = useMemo(() => {
    if (!plan) return null;
    const total = plan.reduce((s, i) => s + (i.finalAmount ?? 0), 0);
    const paid = plan
      .filter((i) => i.paid || i.status === "SUCCESS" || i.status === "PAID")
      .reduce((s, i) => s + (i.finalAmount ?? 0), 0);
    return { total, paid, left: total - paid };
  }, [plan]);

  return (
    <>
      <div className="db-two-col">
        <Card title="Pay for Order">
          {err && <Alert kind="error">{err}</Alert>}
          <div className="db-field">
            <label htmlFor="pay-order">Order</label>
            <select
              id="pay-order"
              className="db-input"
              value={orderId}
              onChange={(e) => {
                setOrderId(e.target.value);
                setErr(null);
              }}
            >
              <option value="">
                {payable.length
                  ? "— Select an order —"
                  : "— No pending payments —"}
              </option>
              {payable.map((o) => (
                <option key={o.id} value={o.id}>
                  OD-{o.id} — {o.subject ?? "—"} (${Number(o.price).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {selected && (
            <>
              <div className="db-pay-summary">
                <span className="db-dim">Amount Due</span>
                <span className="db-pay-amount">${price.toFixed(2)}</span>
              </div>
              <label className="db-check-row">
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={(e) => setUseWallet(e.target.checked)}
                />
                <span>
                  Use Wallet <span className="db-dim">(max 5%)</span> — balance
                  ${balance.toFixed(2)}
                </span>
              </label>
              {saving > 0 && (
                <p className="db-saving">
                  Wallet covers ${saving.toFixed(2)} — Stripe charged $
                  {(price - saving).toFixed(2)}
                </p>
              )}
            </>
          )}

          <button
            type="button"
            className="db-btn-primary db-btn-block"
            onClick={checkout}
            disabled={busy || !orderId}
          >
            {busy ? "Redirecting…" : "Continue to Secure Payment"}
          </button>
          <p className="db-dim db-center-text">
            Secured by Stripe — you will be redirected to complete payment.
          </p>
        </Card>

        <Card title="Installment Plans">
          <div className="db-field">
            <label htmlFor="plan-order">Select Order</label>
            <select
              id="plan-order"
              className="db-input"
              value={planOrderId}
              onChange={(e) => {
                setPlan(null);
                setPlanOrderId(e.target.value);
              }}
            >
              <option value="">— Choose an order —</option>
              {payable.map((o) => (
                <option key={o.id} value={o.id}>
                  OD-{o.id} — {o.subject ?? "—"}
                </option>
              ))}
            </select>
          </div>

          {!planOrderId && (
            <Empty
              icon="📋"
              title="No plan selected"
              sub="Choose an order to view its schedule."
            />
          )}
          {planOrderId && !plan && (
            <div className="db-center">
              <Spinner />
            </div>
          )}
          {plan?.length === 0 && (
            <Empty
              icon="📆"
              title="No installment plan"
              sub="This order has no plan yet."
            />
          )}

          {totals && plan && plan.length > 0 && (
            <>
              <div className="db-mini-grid db-mini-3">
                <div className="db-mini">
                  <span className="db-mini-label">Total</span>
                  <span className="db-mini-val">
                    ${totals.total.toFixed(2)}
                  </span>
                </div>
                <div className="db-mini db-mini-green">
                  <span className="db-mini-label">Paid</span>
                  <span className="db-mini-val">${totals.paid.toFixed(2)}</span>
                </div>
                <div className="db-mini db-mini-gold">
                  <span className="db-mini-label">Left</span>
                  <span className="db-mini-val">${totals.left.toFixed(2)}</span>
                </div>
              </div>
              <ul className="db-inst-list">
                {plan.map((ins, i) => {
                  const isPaid =
                    ins.paid ||
                    ins.status === "SUCCESS" ||
                    ins.status === "PAID";
                  const due = parseBackendDate(ins.dueDate);
                  return (
                    <li key={ins.id}>
                      <span className="db-inst-n">{i + 1}</span>
                      <span className="db-inst-info">
                        <span className="db-inst-amt">
                          ${(ins.finalAmount ?? 0).toFixed(2)}
                        </span>
                        <span className="db-dim">
                          Due:{" "}
                          {due
                            ? due.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "—"}
                        </span>
                      </span>
                      <span
                        className={
                          isPaid
                            ? "badge badge-complete"
                            : "badge badge-pending"
                        }
                      >
                        {isPaid ? "Paid" : "Pending"}
                      </span>
                      {!isPaid && (
                        <button
                          type="button"
                          className="db-pg"
                          onClick={() => payOne(ins.id)}
                        >
                          Pay
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </Card>
      </div>

      <Card title="Payment History">
        {!history && (
          <div className="db-center">
            <Spinner />
          </div>
        )}
        {history?.length === 0 && (
          <Empty
            icon="🧾"
            title="No payments yet"
            sub="Your payment history will appear here."
          />
        )}
        {history && history.length > 0 && (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Order</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((t, i) => (
                  <tr key={t.id ?? i}>
                    <td data-label="Date" className="db-dim">
                      {formatDate(t.createdAt)}
                    </td>
                    <td data-label="Type">
                      {t.typeLabel ||
                        (t.isInstallment
                          ? "Installment Payment"
                          : "Full Payment")}
                      {t.isInstallment && t.totalInstallments ? (
                        <span className="db-dim db-block">
                          Installment {t.installmentNumber ?? "?"} of{" "}
                          {t.totalInstallments}
                        </span>
                      ) : null}
                      {t.walletUsed ? (
                        <span className="db-saving db-block">
                          + ${Number(t.walletUsed).toFixed(2)} wallet credit
                        </span>
                      ) : null}
                      {t.failureReason ? (
                        <span className="db-fail db-block">
                          {t.failureReason.slice(0, 60)}
                        </span>
                      ) : null}
                    </td>
                    <td data-label="Order">
                      {t.orderId ? `OD-${t.orderId}` : "—"}
                    </td>
                    <td data-label="Amount" className="db-price">
                      {t.amount != null
                        ? `$${Number(t.amount).toFixed(2)}`
                        : "—"}
                    </td>
                    <td data-label="Status">
                      <span className={statusBadgeClass(t.status)}>
                        {t.statusLabel || t.status || "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
