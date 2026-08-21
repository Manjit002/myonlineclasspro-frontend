/**
 * Official service pricing — the single source of truth.
 *
 * Both the Order Creation form and the homepage Pricing section read
 * from here. They previously held separate hard-coded lists, which is
 * how the section drifted to showing a $60 exam while the form charged
 * $30. Changing a price here changes it in both places.
 *
 * `label` is also the exact `assignmentType` value sent to
 * /orders/guest/v2, so it must not be reworded casually.
 *
 * `price` is display-only. The backend derives the real amount, and no
 * price field is ever sent in the order request.
 */
export interface ServicePrice {
  id: "FULL_CLASS" | "ASSIGNMENT" | "EXAM" | "QUIZ";
  /** Sent to the API as assignmentType, and shown on the form cards. */
  label: string;
  price: number;
  /** Rate wording used by the Pricing section only. */
  unit: string;
}

export const SERVICE_PRICES: readonly ServicePrice[] = [
  { id: "FULL_CLASS", label: "Full Class", price: 40, unit: "each week" },
  { id: "ASSIGNMENT", label: "Assignment", price: 15, unit: "each task" },
  { id: "EXAM", label: "Exam", price: 30, unit: "each exam" },
  { id: "QUIZ", label: "Quiz", price: 25, unit: "each quiz" },
] as const;

/**
 * Display order for the Pricing section, which reads Full Class → Exam →
 * Quiz → Assignment. The order form keeps its own order; only the
 * sequence differs, never the prices.
 */
const PRICING_SECTION_ORDER: ServicePrice["id"][] = [
  "FULL_CLASS",
  "EXAM",
  "QUIZ",
  "ASSIGNMENT",
];

export const PRICING_SECTION_ITEMS: ServicePrice[] = PRICING_SECTION_ORDER.map(
  (id) => SERVICE_PRICES.find((s) => s.id === id) as ServicePrice,
);
