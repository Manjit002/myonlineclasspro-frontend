"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Card, Skeleton, Empty, Alert } from "@/components/dashboard/ui";
import {
  getWallet,
  getWalletTransactions,
  getPaymentSummary,
  topUpWallet,
} from "@/services/student-service";
import { formatDate } from "@/lib/api-client";
import type {
  Wallet as W,
  WalletTransaction,
  PaymentSummary,
} from "@/types/dashboard";

const CREDIT_TYPES = ["CREDIT", "BONUS", "REFUND", "ADJUSTMENT"];
const LABELS: Record<string, string> = {
  CREDIT: "Top-Up",
  BONUS: "Signup Bonus",
  PAYMENT: "Payment",
  REFUND: "Refund",
  ADJUSTMENT: "Adjustment",
};

export default function WalletPage() {
  const [wallet, setWallet] = useState<W | null>(null);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [txs, setTxs] = useState<WalletTransaction[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [topErr, setTopErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [w, s, t] = await Promise.all([
      getWallet(),
      getPaymentSummary(),
      getWalletTransactions(),
    ]);
    if (w.ok) setWallet(w.data);
    else setErr(w.error);
    if (s.ok) setSummary(s.data);
    setTxs(t.ok ? (t.data?.content ?? []) : []);
  }, []);

  useEffect(() => {
    // Wrapped so the first statement is an await — the effect body
    // itself never calls setState synchronously.
    void (async () => {
      await load();
    })();
  }, [load]);

  async function handleTopUp() {
    setTopErr(null);
    const v = parseFloat(amount);
    if (!v || v < 1) {
      setTopErr("Enter a valid amount (min $1).");
      return;
    }
    if (v > 10000) {
      setTopErr("Max top-up limit is $10,000.");
      return;
    }
    setBusy(true);
    const r = await topUpWallet(v);
    setBusy(false);
    if (!r.ok) {
      setTopErr(r.error);
      return;
    }
    // Backend returns a hosted checkout URL — redirect, never collect cards here.
    if (r.data?.url) window.location.href = r.data.url;
    else setTopErr("No checkout URL returned from server.");
  }

  return (
    <div className="db-wallet-grid">
      <div>
        <div className="db-wallet-card">
          <p className="db-wc-label">Available Balance</p>
          <p className="db-wc-balance">
            {wallet ? `$${Number(wallet.balance ?? 0).toFixed(2)}` : "$—"}
          </p>
          <p className="db-wc-sub">
            {err
              ? err
              : wallet
                ? `Wallet ID: ${wallet.id ?? "—"}`
                : "Loading wallet…"}
          </p>
          <div className="db-topup-row">
            <label htmlFor="topup" className="sr-only">
              Top-up amount in USD
            </label>
            <input
              id="topup"
              type="number"
              min={1}
              step={1}
              inputMode="decimal"
              className="db-input"
              placeholder="Amount (USD)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <button
              type="button"
              className="db-btn-gold"
              onClick={handleTopUp}
              disabled={busy}
            >
              {busy ? "Processing…" : "Add Money"}
            </button>
          </div>
          {topErr && <Alert kind="error">{topErr}</Alert>}
        </div>

        <div className="db-mini-grid">
          <div className="db-mini db-mini-green">
            <span className="db-mini-label">Total Paid</span>
            <span className="db-mini-val">
              {summary?.totalPaid != null
                ? `$${Number(summary.totalPaid).toFixed(2)}`
                : "$—"}
            </span>
          </div>
          <div className="db-mini db-mini-gold">
            <span className="db-mini-label">Pending Installments</span>
            <span className="db-mini-val">
              {summary?.pendingInstallments ?? "—"}
            </span>
          </div>
        </div>
      </div>

      <Card title="Transaction History">
        {!txs && (
          <>
            <Skeleton h={56} />
            <Skeleton h={56} />
            <Skeleton h={56} mb={0} />
          </>
        )}
        {txs?.length === 0 && <Empty icon="💳" title="No transactions yet" />}
        {txs?.map((t, i) => {
          const credit = CREDIT_TYPES.includes(t.type ?? "");
          return (
            <div key={t.id ?? i} className="db-tx">
              <span
                className={`db-tx-icon ${credit ? "credit" : "debit"}`}
                aria-hidden
              >
                {credit ? <ArrowUp size={15} /> : <ArrowDown size={15} />}
              </span>
              <span className="db-tx-info">
                <span className="db-tx-desc">
                  {t.reason || LABELS[t.type ?? ""] || t.type || "—"}
                </span>
                <span className="db-tx-date">
                  {formatDate(t.createdAt)}
                  {t.balanceAfter != null &&
                    ` · Balance: $${Number(t.balanceAfter).toFixed(2)}`}
                </span>
              </span>
              <span className={`db-tx-amt ${credit ? "credit" : "debit"}`}>
                {credit ? "+" : "-"}${Math.abs(t.amount ?? 0).toFixed(2)}
              </span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
