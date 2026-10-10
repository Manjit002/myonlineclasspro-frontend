"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Package,
  PlusCircle,
  Wallet,
  Zap,
} from "lucide-react";
import { Card, Skeleton, ErrorState, Empty } from "@/components/dashboard/ui";
import { OrderCard } from "@/components/dashboard/order-card";
import { StatusPill, stageOf } from "@/components/dashboard/order-progress";
import {
  getDashboard,
  getDashboardFallback,
  getOrders,
  getDeadlines,
  getProfile,
} from "@/services/student-service";
import {
  deadlineLabel,
  deadlineColor,
  parseBackendDate,
} from "@/lib/api-client";
import type { DashboardStats, OrderSummary } from "@/types/dashboard";

/** Stat tiles. Every value comes from the dashboard API (or its documented
 *  orders/wallet fallback) — none are computed for display. */
function StatTiles({ data }: { data: DashboardStats }) {
  const tiles = [
    {
      Icon: Package,
      tone: "blue",
      value: String(data.totalOrders ?? 0),
      label: "Total orders",
      href: "/dashboard/orders",
    },
    {
      Icon: Zap,
      tone: "green",
      value: String(data.activeOrders ?? 0),
      label: "In progress",
      href: "/dashboard/orders?status=IN_PROGRESS",
    },
    {
      Icon: CheckCircle2,
      tone: "cyan",
      value: String(data.completedOrders ?? 0),
      label: "Completed",
      href: "/dashboard/orders?status=COMPLETED",
    },
    {
      Icon: Wallet,
      tone: "gold",
      value: `$${data.walletBalance != null ? Number(data.walletBalance).toFixed(2) : "0.00"}`,
      label: "Wallet balance",
      href: "/dashboard/wallet",
    },
  ];
  return (
    <div className="db-stat-grid">
      {tiles.map(({ Icon, tone, value, label, href }) => (
        <Link key={label} href={href} className="db-stat-card">
          <span className={`db-stat-icon ${tone}`} aria-hidden>
            <Icon size={18} />
          </span>
          <span className="db-stat-val">{value}</span>
          <span className="db-stat-label">{label}</span>
        </Link>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [statsErr, setStatsErr] = useState<string | null>(null);
  const [recent, setRecent] = useState<OrderSummary[] | null>(null);
  const [deadlines, setDeadlines] = useState<OrderSummary[] | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  const reload = useCallback(() => {
    setStats(null);
    setStatsErr(null);
    setTick((t) => t + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      const prof = await getProfile();
      if (alive && prof.ok) {
        setName(prof.data?.name || prof.data?.email?.split("@")[0] || null);
      }

      // Primary endpoint; if it fails, derive the same figures from orders
      // and wallet rather than showing "N/A".
      let r = await getDashboard();
      if (!r.ok || !r.data) r = await getDashboardFallback();
      if (!alive) return;
      if (r.ok && r.data) setStats(r.data);
      else setStatsErr(r.ok ? "Could not load your overview." : r.error);

      if (r.ok && r.data?.recentOrders?.length) {
        setRecent(r.data.recentOrders);
      } else {
        const o = await getOrders(0, 5);
        if (alive) setRecent(o.ok ? (o.data?.content ?? []) : []);
      }

      const d = await getDeadlines();
      if (!alive) return;
      if (d.ok && Array.isArray(d.data) && d.data.length) {
        setDeadlines(d.data);
      } else {
        // /student/deadlines covers only the next 24h — fall back to
        // upcoming orders so the panel isn't empty.
        const o = await getOrders(0, 50);
        const now = Date.now();
        const upcoming = (o.ok ? (o.data?.content ?? []) : [])
          .filter((x) => {
            const dt = parseBackendDate(x.deadline);
            return dt != null && dt.getTime() > now;
          })
          .sort(
            (a, b) =>
              (parseBackendDate(a.deadline)?.getTime() ?? 0) -
              (parseBackendDate(b.deadline)?.getTime() ?? 0),
          );
        if (alive) setDeadlines(upcoming);
      }
    })();
    return () => {
      alive = false;
    };
  }, [tick]);

  // Spotlight the order that most needs attention: the one furthest along
  // that isn't finished. Picked from data already fetched — no extra call.
  const spotlight =
    recent
      ?.filter((o) => o.status !== "COMPLETED" && o.status !== "CANCELLED")
      .sort((a, b) => stageOf(b.status) - stageOf(a.status))[0] ?? null;

  return (
    <>
      <header className="db-welcome">
        <div>
          <h2 className="db-welcome-title">
            {name ? `Welcome back, ${name}` : "Welcome back"}
          </h2>
          <p className="db-welcome-sub">
            Here&apos;s where your orders stand right now.
          </p>
        </div>
        <Link href="/dashboard/place-order" className="db-btn-gold">
          <PlusCircle size={16} aria-hidden /> Place new order
        </Link>
      </header>

      {statsErr && <ErrorState message={statsErr} onRetry={reload} />}
      {!stats && !statsErr && (
        <div className="db-stat-grid">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} h={104} mb={0} />
          ))}
        </div>
      )}
      {stats && <StatTiles data={stats} />}

      {spotlight && (
        <section className="db-spotlight" aria-labelledby="db-spotlight-h">
          <h3 id="db-spotlight-h" className="db-section-h">
            Needs your attention
          </h3>
          <OrderCard order={spotlight} featured />
        </section>
      )}

      <div className="db-two-col">
        <Card
          title="Recent orders"
          action={
            <Link href="/dashboard/orders" className="db-link-btn">
              View all <ArrowRight size={13} aria-hidden />
            </Link>
          }
        >
          {!recent && (
            <>
              <Skeleton />
              <Skeleton />
              <Skeleton mb={0} />
            </>
          )}
          {recent && recent.length === 0 && (
            <Empty
              icon="📦"
              title="No orders yet"
              sub="Your orders will appear here."
            >
              <Link href="/dashboard/place-order" className="db-btn-gold">
                <PlusCircle size={15} aria-hidden /> Place your first order
              </Link>
            </Empty>
          )}
          {recent?.slice(0, 5).map((o) => (
            <Link
              key={o.id}
              href={`/dashboard/orders/${o.id}`}
              className="db-row"
            >
              <span>
                <span className="db-row-id">OD-{o.id}</span>
                <span className="db-row-sub">{o.subject ?? "—"}</span>
              </span>
              <StatusPill status={o.status} />
            </Link>
          ))}
        </Card>

        <Card
          title="Upcoming deadlines"
          action={
            <Link href="/dashboard/deadlines" className="db-link-btn">
              View all <ArrowRight size={13} aria-hidden />
            </Link>
          }
        >
          {!deadlines && (
            <>
              <Skeleton h={60} />
              <Skeleton h={60} mb={0} />
            </>
          )}
          {deadlines && deadlines.length === 0 && (
            <Empty
              icon="📅"
              title="Nothing due"
              sub="You have no upcoming deadlines."
            />
          )}
          {deadlines?.slice(0, 4).map((o) => (
            <Link
              key={o.id}
              href={`/dashboard/orders/${o.id}`}
              className="db-row"
            >
              <span>
                <span className="db-row-id">OD-{o.id}</span>
                <span className="db-row-sub">{o.subject ?? "—"}</span>
              </span>
              <span
                className="db-row-right"
                style={{ color: deadlineColor(o.deadline) }}
              >
                <CalendarClock size={13} aria-hidden />
                {deadlineLabel(o.deadline)}
              </span>
            </Link>
          ))}
        </Card>
      </div>
    </>
  );
}
