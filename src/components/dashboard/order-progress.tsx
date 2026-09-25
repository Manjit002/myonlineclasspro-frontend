import { statusBadgeClass } from "@/lib/api-client";

/**
 * Order lifecycle track.
 *
 * The stages and the status→stage mapping come from the statuses the
 * backend actually emits — nothing here is invented. Statuses outside the
 * happy path (AUTO_PRICED, REASSIGNED, INSTALLMENT_ACTIVE…) fold onto the
 * stage they belong to rather than being dropped.
 */
const STAGES = [
  { key: "REVIEW_PENDING", label: "Received" },
  { key: "UNDER_REVIEW", label: "Reviewing" },
  { key: "PRICE_SET", label: "Priced" },
  { key: "ASSIGNED", label: "Assigned" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "SUBMITTED", label: "Delivered" },
  { key: "COMPLETED", label: "Complete" },
];

const STAGE_INDEX: Record<string, number> = {
  REVIEW_PENDING: 0,
  UNDER_REVIEW: 1,
  PRICE_PENDING: 1,
  AUTO_PRICED: 2,
  PRICE_SET: 2,
  PRICE_QUOTED: 2,
  PRICE_UPDATED: 2,
  ASSIGNED: 3,
  REASSIGNED: 3,
  UNASSIGNED: 3,
  IN_PROGRESS: 4,
  ACTIVE: 4,
  INSTALLMENT_ACTIVE: 4,
  PAID: 4,
  SUBMITTED: 5,
  COMPLETED: 6,
};

export function stageOf(status?: string) {
  return STAGE_INDEX[status ?? ""] ?? 0;
}

export function OrderProgress({
  status,
  compact = false,
}: {
  status?: string;
  compact?: boolean;
}) {
  if (status === "CANCELLED") {
    return (
      <p className="db-track-cancelled" role="status">
        This order was cancelled.
      </p>
    );
  }
  const active = stageOf(status);

  return (
    <ol
      className={["db-track", compact && "is-compact"]
        .filter(Boolean)
        .join(" ")}
      // The visible label below carries the same information, so the list
      // itself is decorative to a screen reader.
      aria-label={`Order stage: ${STAGES[active]?.label ?? "Received"}`}
    >
      {STAGES.map((s, i) => (
        <li
          key={s.key}
          className={[
            "db-track-step",
            i < active && "is-done",
            i === active && "is-active",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="db-track-dot" aria-hidden />
          {!compact && <span className="db-track-label">{s.label}</span>}
        </li>
      ))}
    </ol>
  );
}

/**
 * Status chip. Carries a dot plus the text label so colour is never the
 * only signal, which matters for colour-blind users.
 */
export function StatusPill({ status }: { status?: string }) {
  return (
    <span className={statusBadgeClass(status)}>
      <span className="badge-dot" aria-hidden />
      {(status ?? "—").replace(/_/g, " ")}
    </span>
  );
}
