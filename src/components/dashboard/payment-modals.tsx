"use client";

import { useEffect, useState } from "react";
import {
  CreditCard,
  CalendarClock,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Info,
  Tag,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import {
  createCheckout,
  getWallet,
  getInstallmentsForOrder,
  payInstallment,
  walletSaving,
} from "@/services/student-service";
import { formatDate } from "@/lib/api-client";
import {
  validateCoupon,
  type CouponValidationResponse,
} from "@/services/coupon-service";
import type { OrderDetail, Installment } from "@/types/dashboard";

/**
 * Payment and Installments dialogs for the order detail page.
 *
 * Both are presentation over services that already exist:
 *   createCheckout / getWallet / walletSaving  (payment + 5% wallet rule)
 *   getInstallmentsForOrder / payInstallment   (installments)
 * No payment or installment rule is recalculated here.
 */

const money = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

/* ─────────────────────────── Payment ─────────────────────────── */

export function PaymentModal({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: OrderDetail;
}) {
  const [balance, setBalance] = useState<number | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [couponBusy, setCouponBusy] = useState(false);
  const [coupon, setCoupon] = useState<CouponValidationResponse | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const price = typeof order.price === "number" ? order.price : 0;

  /* Amount chain: coupon first, then wallet on the remainder.
     Every coupon figure is the server's own — originalAmount,
     discountAmount and payableAmount are displayed as returned, never
     recomputed, so this panel can't disagree with what the backend
     would charge. */
  const applied = coupon?.valid ? coupon : null;
  const couponDiscount = applied?.discountAmount ?? 0;
  const afterCoupon =
    applied?.payableAmount ?? Math.max(0, price - couponDiscount);

  // The 5% cap is the existing business rule, imported rather than redone.
  // It is applied to the post-coupon amount — see the migration note.
  const saving =
    useWallet && balance != null ? walletSaving(balance, afterCoupon) : 0;
  const payable = Math.max(0, afterCoupon - saving);
  const maxSaving = balance != null ? walletSaving(balance, afterCoupon) : 0;

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code || couponBusy) return;
    setCouponBusy(true);
    setCouponMsg(null);
    const r = await validateCoupon(order.id, code);
    if (!r.ok) {
      setCouponMsg(r.error ?? "Could not check that coupon.");
      setCoupon(null);
    } else if (r.data?.valid) {
      setCoupon(r.data);
      setCouponMsg(r.data.message ?? null);
      // A coupon changes the wallet cap, so re-evaluate the toggle.
      if (
        balance != null &&
        walletSaving(balance, r.data.payableAmount ?? 0) <= 0
      )
        setUseWallet(false);
    } else {
      // valid:false is a successful call — the coupon was checked and
      // rejected, so surface the server's reason rather than an error.
      setCoupon(null);
      setCouponMsg(
        r.data?.message ?? "That coupon isn't valid for this order.",
      );
    }
    setCouponBusy(false);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponMsg(null);
    setCouponInput("");
  };

  useEffect(() => {
    if (!open) return;
    let alive = true;
    getWallet().then((r) => {
      if (!alive) return;
      setErr(null);
      setBalance(r.ok ? (r.data?.balance ?? 0) : 0);
    });
    return () => {
      alive = false;
    };
  }, [open]);

  const submit = async () => {
    if (busy) return;
    setBusy(true);
    setErr(null);
    // Same call and flag the payments page uses.
    // Only a server-validated code is sent.
    const r = await createCheckout(
      order.id,
      useWallet,
      applied?.couponCode ?? null,
    );
    if (r.ok) {
      const url = r.data?.checkoutUrl ?? r.data?.url;
      if (url) {
        window.location.assign(url);
        return;
      }
      setErr("Checkout could not be started. Please try again.");
    } else {
      setErr(r.error ?? "Checkout could not be started. Please try again.");
    }
    setBusy(false);
  };

  return (
    <Modal open={open} onClose={onClose} title="Pay for Order">
      <div className="pm">
        <p className="pm-label">Order</p>
        <p className="pm-order">#{order.id}</p>

        <div className="pm-row">
          <span>Amount due</span>
          <strong>{money(price)}</strong>
        </div>

        {/* Coupon. Amounts shown come straight from the validation
            response — nothing is recalculated client-side. */}
        <div className="pm-coupon">
          {applied ? (
            <div className="pm-coupon-applied">
              <Tag size={14} aria-hidden />
              <span className="pm-coupon-code">{applied.couponCode}</span>
              <span className="pm-coupon-meta">
                {applied.discountType === "PERCENTAGE"
                  ? `${applied.discountValue ?? 0}% off`
                  : `${money(applied.discountValue ?? 0)} off`}
              </span>
              <button
                type="button"
                className="pm-coupon-remove"
                onClick={removeCoupon}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="pm-coupon-row">
              <input
                type="text"
                value={couponInput}
                placeholder="Coupon code"
                aria-label="Coupon code"
                autoCapitalize="characters"
                spellCheck={false}
                onChange={(e) => setCouponInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    applyCoupon();
                  }
                }}
                className="pm-coupon-input"
              />
              <button
                type="button"
                className="pm-coupon-btn"
                onClick={applyCoupon}
                disabled={!couponInput.trim() || couponBusy}
                aria-busy={couponBusy}
              >
                {couponBusy ? "Checking…" : "Apply"}
              </button>
            </div>
          )}
          {couponMsg && (
            <p
              className={applied ? "pm-coupon-ok" : "pm-coupon-bad"}
              role="status"
            >
              {couponMsg}
            </p>
          )}
        </div>

        {applied && couponDiscount > 0 && (
          <div className="pm-row pm-row-sub">
            <span>Coupon discount</span>
            <strong className="pm-minus">−{money(couponDiscount)}</strong>
          </div>
        )}

        <div className="pm-wallet">
          <div className="pm-wallet-head">
            <span className="pm-label">Wallet balance</span>
            <strong>{balance == null ? "…" : money(balance)}</strong>
          </div>
          <label className="pm-check">
            <input
              type="checkbox"
              checked={useWallet}
              disabled={balance == null || maxSaving <= 0}
              onChange={(e) => setUseWallet(e.target.checked)}
            />
            <span>
              Use wallet
              <span className="pm-hint">
                {" "}
                (max 5% of order{maxSaving > 0 ? ` — ${money(maxSaving)}` : ""})
              </span>
            </span>
          </label>
        </div>

        {saving > 0 && (
          <div className="pm-row pm-row-sub">
            <span>Wallet applied</span>
            <strong className="pm-minus">−{money(saving)}</strong>
          </div>
        )}

        <div className="pm-row pm-total">
          <span>You pay</span>
          <strong aria-live="polite">{money(payable)}</strong>
        </div>

        {err && (
          <p className="pm-err" role="alert">
            {err}
          </p>
        )}

        <button
          type="button"
          className="pm-cta"
          onClick={submit}
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? (
            <Loader2 size={16} className="pm-spin" aria-hidden />
          ) : (
            <Lock size={15} aria-hidden />
          )}
          {busy ? "Starting checkout…" : "Continue to secure payment"}
          {!busy && <ArrowRight size={16} aria-hidden />}
        </button>

        <p className="pm-note">
          <CreditCard size={13} aria-hidden />
          Payments are processed by Stripe. Card details never reach this site.
        </p>
      </div>
    </Modal>
  );
}

/* ──────────────────────── Installments ───────────────────────── */

export function InstallmentsModal({
  open,
  onClose,
  order,
}: {
  open: boolean;
  onClose: () => void;
  order: OrderDetail;
}) {
  const [items, setItems] = useState<Installment[] | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const price = typeof order.price === "number" ? order.price : 0;

  useEffect(() => {
    if (!open) return;
    let alive = true;
    // Reset and populate together once the request resolves, rather than
    // setting state synchronously as the effect runs.
    getInstallmentsForOrder(order.id).then((r) => {
      if (!alive) return;
      setItems(r.ok ? (r.data ?? []) : []);
      setErr(r.ok ? null : (r.error ?? null));
    });
    return () => {
      alive = false;
    };
  }, [open, order.id]);

  const pay = async (id: number) => {
    setBusyId(id);
    setErr(null);
    // Identical handling to the payments page's payOne().
    const r = await payInstallment(id);
    if (!r.ok) {
      setErr(r.error);
      setBusyId(null);
      return;
    }
    const url = r.data?.checkoutUrl ?? r.data?.url;
    if (url) {
      window.location.assign(url);
      return;
    }
    // Settled server-side — reload the list.
    const again = await getInstallmentsForOrder(order.id);
    if (again.ok) setItems(again.data ?? []);
    setBusyId(null);
  };

  const paidCount = items?.filter((i) => i.paid).length ?? 0;

  return (
    <Modal open={open} onClose={onClose} title="Installments">
      <div className="pm">
        <p className="pm-label">Order</p>
        <p className="pm-order">#{order.id}</p>

        <div className="pm-row">
          <span>Order total</span>
          <strong>{money(price)}</strong>
        </div>

        {items === null && (
          <p className="pm-muted">
            <Loader2 size={14} className="pm-spin" aria-hidden /> Loading your
            plan…
          </p>
        )}

        {items !== null && items.length === 0 && (
          <div className="pm-empty">
            <Info size={15} aria-hidden />
            <p>
              No installment plan has been set up for this order yet.
              Installment plans are arranged by the team — message support to
              request one, or pay the order in full.
            </p>
          </div>
        )}

        {items !== null && items.length > 0 && (
          <>
            <p className="pm-label pm-plan-head">
              Your plan — {paidCount} of {items.length} paid
            </p>
            <ul className="pm-list">
              {items.map((ins, i) => {
                const done =
                  ins.paid || ins.status === "SUCCESS" || ins.status === "PAID";
                return (
                  <li key={ins.id} className="pm-inst">
                    <span className="pm-inst-n">{i + 1}</span>
                    <span className="pm-inst-body">
                      <strong>
                        {ins.finalAmount != null ? money(ins.finalAmount) : "—"}
                      </strong>
                      {ins.dueDate && (
                        <span className="pm-inst-due">
                          Due {formatDate(ins.dueDate)}
                        </span>
                      )}
                    </span>
                    {done ? (
                      <span className="pm-inst-paid">
                        <CheckCircle2 size={14} aria-hidden /> Paid
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="pm-inst-pay"
                        onClick={() => pay(ins.id)}
                        disabled={busyId != null}
                        aria-busy={busyId === ins.id}
                      >
                        {busyId === ins.id ? (
                          <Loader2 size={13} className="pm-spin" aria-hidden />
                        ) : (
                          <CalendarClock size={13} aria-hidden />
                        )}
                        Pay
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}

        {err && (
          <p className="pm-err" role="alert">
            {err}
          </p>
        )}
      </div>
    </Modal>
  );
}
