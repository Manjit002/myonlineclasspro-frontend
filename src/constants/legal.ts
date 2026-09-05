/**
 * Policy pages. The original site had these as six separate HTML files
 * sharing an identical shell; here they share one route and differ only
 * by content.
 *
 * Bodies are summaries of the original policies. These are legal
 * documents -- the full authoritative text should be pasted in from the
 * originals before this goes live, rather than paraphrased by anyone
 * other than whoever owns them.
 */
export interface LegalSection {
  heading: string;
  body: string;
}

export interface LegalPage {
  slug: string;
  title: string;
  accent: string;
  summary: string;
  sections: LegalSection[];
}

const placeholderNotice =
  "This section carries over from the existing policy on the current site. Replace with the full authoritative text before launch.";

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terms",
    title: "Terms and",
    accent: "Conditions",
    summary:
      "The terms governing your use of this website and our academic support services.",
    sections: [
      { heading: "Acceptance of Terms", body: placeholderNotice },
      { heading: "Use of Our Services", body: placeholderNotice },
      { heading: "Payments and Billing", body: placeholderNotice },
      { heading: "Limitation of Liability", body: placeholderNotice },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy",
    accent: "Policy",
    summary:
      "How we collect, use, store, and protect your personal information.",
    sections: [
      { heading: "Information We Collect", body: placeholderNotice },
      { heading: "How We Use Your Information", body: placeholderNotice },
      { heading: "Data Security", body: placeholderNotice },
      { heading: "Your Rights", body: placeholderNotice },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie",
    accent: "Policy",
    summary: "How this site uses cookies and how you can control them.",
    sections: [
      { heading: "What Are Cookies", body: placeholderNotice },
      { heading: "Cookies We Use", body: placeholderNotice },
      { heading: "Managing Cookies", body: placeholderNotice },
    ],
  },
  {
    slug: "payment-refund-policy",
    title: "Payment &",
    accent: "Refund Policy",
    summary: "Accepted payment methods, billing terms, and refund eligibility.",
    sections: [
      { heading: "Payment Methods", body: placeholderNotice },
      { heading: "Instalment Plans", body: placeholderNotice },
      { heading: "Refund Eligibility", body: placeholderNotice },
      { heading: "How to Request a Refund", body: placeholderNotice },
    ],
  },
  {
    slug: "complaints-policy",
    title: "Complaints",
    accent: "Policy",
    summary: "How to raise a concern and how we handle it.",
    sections: [
      { heading: "Raising a Complaint", body: placeholderNotice },
      { heading: "Our Response Process", body: placeholderNotice },
      { heading: "Escalation", body: placeholderNotice },
    ],
  },
  {
    slug: "consumer-feedback",
    title: "Consumer",
    accent: "Feedback",
    summary: "How we collect, verify, and publish student feedback.",
    sections: [
      { heading: "How We Collect Feedback", body: placeholderNotice },
      { heading: "Verification", body: placeholderNotice },
      { heading: "Publishing and Moderation", body: placeholderNotice },
    ],
  },
];

export function getLegalPage(slug: string) {
  return LEGAL_PAGES.find((p) => p.slug === slug);
}

/** Keywords carried over verbatim from the old HTML legal pages. */
export const LEGAL_KEYWORDS: Record<string, string[]> = {
  privacy: [
    "privacy policy MyOnlineClassPro",
    "data protection online class service",
    "confidential academic help",
  ],
  terms: [
    "terms of service MyOnlineClassPro",
    "conditions online class help",
    "academic assistance terms",
  ],
  "cookie-policy": [
    "cookie policy MyOnlineClassPro",
    "cookies online class help website",
    "manage cookies academic assistance site",
  ],
  "payment-refund-policy": [
    "payment policy MyOnlineClassPro",
    "refund policy online class help",
    "money back guarantee academic help",
  ],
  "complaints-policy": [
    "complaints policy MyOnlineClassPro",
    "file complaint online class help",
    "academic service dispute resolution",
  ],
  "consumer-feedback": [
    "consumer feedback MyOnlineClassPro",
    "student review online class help",
    "share experience academic assistance",
  ],
};

/** Exact <title> values from the old HTML legal pages. */
export const LEGAL_TITLES: Record<string, string> = {
  privacy: "Privacy Policy - MyOnlineClassPro",
  terms: "Terms and Conditions - MyOnlineClassPro",
  "cookie-policy": "Cookie Policy | MyOnlineClassPro",
  "payment-refund-policy": "Payment & Refund Policy - MyOnlineClassPro",
  "complaints-policy": "Complaints Policy | MyOnlineClassPro",
  "consumer-feedback": "Consumer Feedback | MyOnlineClassPro",
};
