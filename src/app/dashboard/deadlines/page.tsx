"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, Skeleton, ErrorState, Empty } from "@/components/dashboard/ui";
import { getDeadlines, getOrders } from "@/services/student-service";
import {
  statusBadgeClass,
  deadlineLabel,
  deadlineColor,
  parseBackendDate,
} from "@/lib/api-client";
import type { OrderSummary } from "@/types/dashboard";

export default function DeadlinesPage() {
  const [items, setItems] = useState<OrderSummary[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    const r = await getDeadlines();
    if (r.ok && Array.isArray(r.data) && r.data.length) {
      setItems(r.data);
      return;
    }
    // The endpoint only returns the next 24h; derive the rest from orders
    // so the panel shows everything upcoming — the original's fallback.
    const o = await getOrders(0, 100);
    if (!o.ok) {
      setErr(o.error);
      return;
    }
    const now = Date.now();
    setItems(
      (o.data?.content ?? [])
        .filter((x) => {
          const d = parseBackendDate(x.deadline);
          return d != null && d.getTime() > now;
        })
        .sort(
          (a, b) =>
            (parseBackendDate(a.deadline)?.getTime() ?? 0) -
            (parseBackendDate(b.deadline)?.getTime() ?? 0),
        ),
    );
  }, []);

  useEffect(() => {
    // Wrapped so the first statement is an await — the effect body
    // itself never calls setState synchronously.
    void (async () => {
      await load();
    })();
  }, [load]);

  return (
    <Card title="Upcoming Deadlines">
      {!items && !err && (
        <>
          <Skeleton h={70} />
          <Skeleton h={70} />
          <Skeleton h={70} mb={0} />
        </>
      )}
      {err && (
        <ErrorState
          message={err}
          onRetry={() => {
            setItems(null);
            setErr(null);
            load();
          }}
        />
      )}
      {items?.length === 0 && (
        <Empty
          icon="📅"
          title="No upcoming deadlines"
          sub="You're all clear."
        />
      )}
      {items?.map((o) => (
        <Link key={o.id} href={`/dashboard/orders/${o.id}`} className="db-row">
          <span>
            <span className="db-row-id">OD-{o.id}</span>
            <span className="db-row-sub">{o.subject ?? "—"}</span>
            <span className="db-row-meta">{o.assignmentType ?? "—"}</span>
          </span>
          <span className="db-row-right">
            <span style={{ color: deadlineColor(o.deadline), fontWeight: 700 }}>
              {deadlineLabel(o.deadline)}
            </span>
            <span className={statusBadgeClass(o.status)}>
              {o.status ?? "—"}
            </span>
          </span>
        </Link>
      ))}
    </Card>
  );
}
