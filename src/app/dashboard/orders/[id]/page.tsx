"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import { Spinner, ErrorState } from "@/components/dashboard/ui";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { OrderChat } from "@/components/dashboard/order-chat";
import { OrderActions } from "@/components/dashboard/order-actions";
import { OrderProgress } from "@/components/dashboard/order-progress";
import { getOrder } from "@/services/student-service";
import { formatDate, deadlineLabel, deadlineColor } from "@/lib/api-client";
import type { OrderDetail } from "@/types/dashboard";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const search = useSearchParams();
  const [tab, setTab] = useState<"details" | "chat">(
    search.get("tab") === "chat" ? "chat" : "details",
  );
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    getOrder(id).then((r) => (r.ok ? setOrder(r.data) : setErr(r.error)));
  }, [id]);

  const facts: [string, React.ReactNode][] = order
    ? [
        ["Order ID", `OD-${order.id}`],
        ["Status", <StatusBadge key="s" status={order.status} />],
        ["Subject", order.subject ?? "—"],
        ["Type", order.assignmentType ?? "—"],
        [
          "Deadline",
          <span
            key="d"
            style={{ color: deadlineColor(order.deadline), fontWeight: 700 }}
          >
            {deadlineLabel(order.deadline)}
          </span>,
        ],
        ["Created", formatDate(order.createdAt)],
        // Returned by OrderDetailDTO but never surfaced before — students
        // could not see the expert's internal target date.
        ...(order.expertDeadline
          ? ([["Expert Target", formatDate(order.expertDeadline)]] as [
              string,
              React.ReactNode,
            ][])
          : []),
        [
          "Price",
          order.price != null
            ? `$${Number(order.price).toFixed(2)}`
            : "Pending review",
        ],
        [
          "Payment",
          `${order.paymentStatus ?? "—"}${order.paymentMethod ? ` · ${order.paymentMethod}` : ""}`,
        ],
        ...(order.academicLevel
          ? ([["Academic Level", order.academicLevel]] as [
              string,
              React.ReactNode,
            ][])
          : []),
        ...(order.university
          ? ([["University", order.university]] as [string, React.ReactNode][])
          : []),
      ]
    : [];

  return (
    <div className="db-workspace">
      <header className="db-ws-head">
        <h2 className="db-ws-title">
          OD-{id}
          {order?.subject ? ` · ${order.subject}` : ""}
        </h2>
        <div className="db-ws-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "details"}
            className="db-ws-tab"
            onClick={() => setTab("details")}
          >
            Details
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "chat"}
            className="db-ws-tab"
            onClick={() => setTab("chat")}
          >
            Chat
          </button>
        </div>
        <div className="db-ws-actions">
          <button
            type="button"
            className="db-btn-ghost"
            onClick={() => window.print()}
            aria-label="Print this order"
          >
            <Printer size={15} />
          </button>
          <Link href="/dashboard/orders" className="db-btn-ghost">
            <ArrowLeft size={15} aria-hidden /> Back
          </Link>
        </div>
      </header>

      <div className="db-ws-body">
        <section
          className={["db-ws-left", tab === "details" && "is-active"]
            .filter(Boolean)
            .join(" ")}
        >
          {!order && !err && (
            <div className="db-center">
              <Spinner />
            </div>
          )}
          {err && <ErrorState message={err} />}
          {order && (
            <>
              <OrderProgress status={order.status} />

              <dl className="db-detail-grid">
                {facts.map(([k, v]) => (
                  <div key={k} className="db-detail-item">
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>

              {order.instructions && (
                <div className="db-panel-box">
                  <p className="db-detail-lbl">Order Description</p>
                  <p className="db-instructions">{order.instructions}</p>
                </div>
              )}
              {order.fileCount ? (
                <div className="db-panel-box">
                  <p className="db-detail-lbl">Files</p>
                  <p className="db-dim">
                    {order.fileCount} file{order.fileCount === 1 ? "" : "s"}{" "}
                    attached to this order
                  </p>
                  <Link href="/dashboard/files" className="db-link-btn">
                    Open My Files
                  </Link>
                </div>
              ) : null}
            </>
          )}

          {/* Sits below the order information cards. Message Support
              switches to the chat tab this page already renders, so no
              second chat surface is created. */}
          {order && (
            <OrderActions
              order={order}
              onMessageSupport={() => setTab("chat")}
            />
          )}
        </section>

        <section
          className={["db-ws-right", tab === "chat" && "is-active"]
            .filter(Boolean)
            .join(" ")}
        >
          <OrderChat orderId={Number(id)} />
        </section>
      </div>
    </div>
  );
}
