/**
 * Single source of truth for site-wide values. These are carried over
 * verbatim from the existing site so contact details and URLs stay
 * consistent across the rebuild -- change them here, not inline.
 */
export const SITE = {
  name: "MyOnlineClassPro",
  url: "https://myonlineclasspro.com",
  email: "support@myonlineclasspro.com",
  /* Support line is text/SMS only — there is no inbound call number.
     Keys are named accordingly so nothing re-introduces a tel: link. */
  textNumber: "+1 (817) 507-1278",
  smsHref: "sms:+18175071278",
  whatsapp: "+1 581 809-6586",
  whatsappHref: "https://wa.me/15818096586",
} as const;

export interface NavLink {
  label: string;
  href: string;
}

/** Service pages, shown in the "Services" dropdown. */
export const SERVICE_LINKS: NavLink[] = [
  { label: "Accounting Class", href: "/take-my-accounting-class" },
  { label: "Biology Class", href: "/take-my-biology-class" },
  { label: "Chemistry Class", href: "/take-my-chemistry-class" },
  { label: "Computer Science Class", href: "/take-my-computer-science-class" },
  { label: "Database Class", href: "/take-my-database-class" },
  { label: "Finance Class", href: "/take-my-finance-class" },
  { label: "Management Class", href: "/take-my-management-class" },
  { label: "Math Class", href: "/take-my-math-class" },
  { label: "Nursing Class", href: "/take-my-nursing-class" },
  { label: "Sophia Class", href: "/take-my-sophia-class" },
  { label: "WGU Class", href: "/take-my-wgu-class" },
  { label: "Online Exam", href: "/take-my-online-exam" },
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
