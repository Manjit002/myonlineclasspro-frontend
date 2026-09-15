"use client";

import Link from "next/link";
import { MessageSquare, ArrowRight } from "lucide-react";
import { deadlineLabel, deadlineColor } from "@/lib/api-client";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { OrderProgress } from "@/components/dashboard/order-progress";
import type { OrderSummary } from "@/types/dashboard";

/**
 * Order summary card.
 *
 * Reuses the shared StatusBadge and OrderProgress rather than
 * re-deriving status styling, so the list, the spotlight and the order
 * detail page can never disagree.
 *
 * Only fields the backend actually returns are shown — the order DTO
 * carries no expert information, so no expert is displayed.
 *
 * `featured` is the dashboard spotlight variant: same content, raised
 * surface and accent border to mark the order needing attention.
 */
export function OrderCard({
  order,
  unread,
  featured = false,
}: {
  order: OrderSummary;
  unread?: number;
  featured?: boolean;
}) {
  return (
    <article
      className={["db-ocard", featured && "is-featured"]
        .filter(Boolean)
        .join(" ")}
    >
      <Link href={`/dashboard/orders/${order.id}`} className="db-ocard-main">
        <header className="db-ocard-head">
          <span className="db-ocard-id">OD-{order.id}</span>
          <StatusBadge status={order.status} size="sm" />
        </header>

        <p className="db-ocard-subject">{order.subject ?? "—"}</p>
        <p className="db-ocard-type">{order.assignmentType ?? "—"}</p>

        <OrderProgress status={order.status} compact />

        <footer className="db-ocard-foot">
          <span>
            <span className="db-ocard-lbl">Deadline</span>
            <span
              style={{ color: deadlineColor(order.deadline), fontWeight: 700 }}
            >
              {deadlineLabel(order.deadline)}
            </span>
          </span>
          <span className="db-ocard-right">
            <span className="db-ocard-lbl">Price</span>
            <span className="db-price">
              {order.price != null ? `$${Number(order.price).toFixed(2)}` : "—"}
            </span>
          </span>
        </footer>
      </Link>

      <div className="db-ocard-actions">
        <Link
          href={`/dashboard/orders/${order.id}?tab=chat`}
          className="db-ocard-chat"
          aria-label={`Message support about order ${order.id}`}
        >
          <MessageSquare size={14} aria-hidden />
          Messages
          {unread ? (
            <span className="db-unread-inline">
              {unread > 9 ? "9+" : unread}
            </span>
          ) : null}
        </Link>
        <Link href={`/dashboard/orders/${order.id}`} className="db-ocard-open">
          Open <ArrowRight size={14} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
