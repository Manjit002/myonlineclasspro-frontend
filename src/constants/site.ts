/**
 * Single source of truth for site-wide values. These are carried over
 * verbatim from the existing site so contact details and URLs stay
 * consistent across the rebuild -- change them here, not inline.
 */
export const SITE = {
  name: "MyOnlineClassPro",
  url: "https://myonlineclasspro.com",
  email: "support@myonlineclasspro.com",
  phone: "+1 585 522-2449",
  phoneHref: "tel:+15855222449",
  whatsapp: "+1 581 809-6586",
  whatsappHref: "https://wa.me/15818096586",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Service pages, shown in the "Services" dropdown. */
export const SERVICE_LINKS: NavLink[] = [
  { label: "Accounting Class Help", href: "/take-my-accounting-class" },
  { label: "Biology Class Help", href: "/take-my-biology-class" },
  { label: "Chemistry Class Help", href: "/take-my-chemistry-class" },
  {
    label: "Computer Science Class Help",
    href: "/take-my-computer-science-class",
  },
  { label: "Database Class Help", href: "/take-my-database-class" },
  { label: "Finance Class Help", href: "/take-my-finance-class" },
  { label: "Management Class Help", href: "/take-my-management-class" },
  { label: "Math Class Help", href: "/take-my-math-class" },
  { label: "Nursing Class Help", href: "/take-my-nursing-class" },
  { label: "Sophia Class Help", href: "/take-my-sophia-class" },
  { label: "WGU Class Help", href: "/take-my-wgu-class" },
  { label: "Take My Online Exam", href: "/take-my-online-exam" },
];

/** Top-level navigation, in the same order as the original site. */
export const MAIN_LINKS: NavLink[] = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "Reviews", href: "/reviews" },
  { label: "Experts", href: "/experts" },
  { label: "About", href: "/about" },
  { label: "Our Offices", href: "/our-offices" },
];

export const FOOTER_LEGAL_LINKS: NavLink[] = [
  { label: "Terms & Conditions", href: "/legal/terms" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Payment & Refund Policy", href: "/legal/payment-refund-policy" },
  { label: "Cookie Policy", href: "/legal/cookie-policy" },
  { label: "Complaints Policy", href: "/legal/complaints-policy" },
  { label: "Consumer Feedback", href: "/legal/consumer-feedback" },
];
