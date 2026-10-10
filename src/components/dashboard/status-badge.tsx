import {
  Clock,
  Search,
  DollarSign,
  UserCheck,
  Zap,
  Upload,
  CheckCircle2,
  XCircle,
  CreditCard,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";

/**
 * Status pill.
 *
 * Each status carries an icon as well as a colour, so state is never
 * communicated by colour alone (readable for colour-blind users and in
 * high-contrast modes). Tones map to the existing badge classes.
 */
const MAP: Record<string, { Icon: LucideIcon; cls: string; label?: string }> = {
  CREATED: { Icon: Clock, cls: "badge-pending" },
  REVIEW_PENDING: {
    Icon: Clock,
    cls: "badge-pending",
    label: "Review pending",
  },
  UNDER_REVIEW: { Icon: Search, cls: "badge-review", label: "Under review" },
  PRICE_PENDING: {
    Icon: DollarSign,
    cls: "badge-price",
    label: "Awaiting price",
  },
  PRICE_QUOTED: { Icon: DollarSign, cls: "badge-price", label: "Price quoted" },
  PRICE_SET: { Icon: DollarSign, cls: "badge-price", label: "Priced" },
  PRICE_UPDATED: {
    Icon: DollarSign,
    cls: "badge-price",
    label: "Price updated",
  },
  AUTO_PRICED: { Icon: DollarSign, cls: "badge-price", label: "Auto-priced" },
  ASSIGNED: { Icon: UserCheck, cls: "badge-assigned" },
  REASSIGNED: { Icon: UserCheck, cls: "badge-assigned" },
  UNASSIGNED: { Icon: AlertCircle, cls: "badge-unassigned" },
  IN_PROGRESS: { Icon: Zap, cls: "badge-progress", label: "In progress" },
  ACTIVE: { Icon: Zap, cls: "badge-active" },
  INSTALLMENT_ACTIVE: {
    Icon: CreditCard,
    cls: "badge-partial",
    label: "Installments",
  },
  SUBMITTED: { Icon: Upload, cls: "badge-submitted" },
  COMPLETED: { Icon: CheckCircle2, cls: "badge-complete" },
  PAID: { Icon: CheckCircle2, cls: "badge-paid" },
  PARTIALLY_PAID: {
    Icon: CreditCard,
    cls: "badge-partial",
    label: "Part paid",
  },
  PENDING: { Icon: Clock, cls: "badge-pending" },
  SUCCESS: { Icon: CheckCircle2, cls: "badge-paid" },
  FAILED: { Icon: XCircle, cls: "badge-failed" },
  CANCELLED: { Icon: XCircle, cls: "badge-cancelled" },
};

/** Turns SCREAMING_SNAKE into readable text when no label is mapped. */
function humanise(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((w, i) => (i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}

export function StatusBadge({
  status,
  size = "md",
}: {
  status?: string;
  size?: "sm" | "md";
}) {
  if (!status) return null;
  const entry = MAP[status] ?? { Icon: AlertCircle, cls: "badge-unknown" };
  const { Icon, cls } = entry;
  return (
    <span className={`badge ${cls} db-badge${size === "sm" ? "is-sm" : ""}`}>
      <Icon size={size === "sm" ? 11 : 12} aria-hidden />
      {entry.label ?? humanise(status)}
    </span>
  );
}
