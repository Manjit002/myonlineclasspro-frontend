"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { OrderCard } from "@/components/dashboard/order-card";
import { Skeleton, ErrorState, Empty } from "@/components/dashboard/ui";
import { getOrders, getUnreadCount } from "@/services/student-service";
import type { OrderSummary } from "@/types/dashboard";

const FILTERS: { label: string; value: string | null }[] = [
  { label: "All", value: null },
  { label: "Pending", value: "REVIEW_PENDING" },
  { label: "Active", value: "IN_PROGRESS" },
  { label: "Completed", value: "COMPLETED" },
  { label: "In Review", value: "UNDER_REVIEW" },
  { label: "Unpaid", value: "PRICE_PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function OrdersPage() {
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  /* Seeded from the URL so the dashboard stat cards ("In Progress",
     "Completed") actually land on a filtered list. Previously this was
     hard-coded to null and the query parameter was silently ignored. */
  const [status, setStatus] = useState<string | null>(() =>
    searchParams.get("status"),
  );
  const [unread, setUnread] = useState<Record<number, number>>({});

  const load = useCallback(async () => {
    const r = await getOrders(page, 12, status);
    if (!r.ok) {
      setError(r.error);
      return;
    }
    const list = r.data?.content ?? [];
    setOrders(list);
    setTotalPages(r.data?.totalPages ?? 1);
    setTotal(r.data?.totalElements ?? list.length);
    // Unread counts only for the cards on screen — keeps this bounded.
    const map: Record<number, number> = {};
    await Promise.all(
      list.map(async (o) => {
        const c = await getUnreadCount(o.id);
        if (c.ok && typeof c.data === "number" && c.data > 0)
          map[o.id] = c.data;
      }),
    );
    setUnread(map);
  }, [page, status]);

  useEffect(() => {
    void (async () => {
      await load();
    })();
  }, [load]);

  const reset = () => {
    setOrders(null);
    setError(null);
  };

  return (
    <>
      <div className="db-page-head">
        <div>
          <h2 className="db-page-title">My Orders</h2>
          <p className="db-dim">
            {orders
              ? `${total} order${total === 1 ? "" : "s"} total`
              : "Loading…"}
          </p>
        </div>
        <Link href="/dashboard/place-order" className="db-btn-primary">
          <PlusCircle size={15} aria-hidden /> New Order
        </Link>
      </div>

      <div
        className="db-filters"
        role="group"
        aria-label="Filter orders by status"
      >
        {FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            className="db-filter"
            aria-pressed={status === f.value}
            onClick={() => {
              reset();
              setStatus(f.value);
              setPage(0);
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {!orders && !error && (
        <div className="db-order-grid">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} h={196} mb={0} />
          ))}
        </div>
      )}

      {error && (
        <ErrorState
          message={error}
          onRetry={() => {
            reset();
            load();
          }}
        />
      )}

      {orders?.length === 0 && (
        <Empty
          icon="📦"
          title={status ? "No orders match this filter" : "No orders yet"}
          sub={
            status
              ? "Try a different filter to see more of your orders."
              : "Place your first order and we'll match you with an expert."
          }
        >
          {!status && (
            <Link href="/dashboard/place-order" className="db-btn-gold">
              <PlusCircle size={16} aria-hidden /> Place your first order
            </Link>
          )}
        </Empty>
      )}

      {orders && orders.length > 0 && (
        <>
          <div className="db-order-grid">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} unread={unread[o.id] ?? 0} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="db-pagination">
              <span className="db-dim">
                Page {page + 1} of {totalPages}
              </span>
              <span className="db-pg-btns">
                <button
                  type="button"
                  className="db-pg"
                  disabled={page === 0}
                  onClick={() => {
                    reset();
                    setPage((p) => p - 1);
                  }}
                >
                  Prev
                </button>
                <button
                  type="button"
                  className="db-pg"
                  disabled={page >= totalPages - 1}
                  onClick={() => {
                    reset();
                    setPage((p) => p + 1);
                  }}
                >
                  Next
                </button>
              </span>
            </div>
          )}
        </>
      )}
    </>
  );
}
