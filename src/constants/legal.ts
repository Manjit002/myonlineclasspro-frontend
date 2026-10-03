/**
 * Policy pages. The original site had these as six separate HTML files
 * sharing an identical shell; here they share one route and differ only
 * by content.
 *
 * Every page carries its full text clause for clause, from one of two
 * sources:
 *   - Terms & Conditions and Payment & Refund Policy: the original HTML
 *     pages.
 *   - Privacy Policy, Cookie Policy, Complaints Policy and Consumer
 *     Feedback: MOC_Pages.docx, last updated September 29, 2026. The few
 *     sentences in that draft addressed to the site owner rather than the
 *     reader are noted on each entry and not published.
 * Change this text by pasting in the owner's wording, rather than having
 * it paraphrased by anyone else.
 *
 * Contact details are deliberately NOT stored here. The original page
 * hard-coded a phone number that has since been retired; every contact
 * channel is read from SITE at render time instead, so there is exactly
 * one place to change it.
 */
import { SITE } from "@/constants/site";

export interface LegalClause {
  /** e.g. "Clause I" -- the original numbered these explicitly. */
  label: string;
  body: string;
}

export interface LegalCallout {
  /** e.g. "Important", "Revision Policy". */
  label: string;
  body: string;
}

export interface LegalSection {
  heading: string;
  /** Anchor target for the table of contents. */
  id?: string;
  /** "Section 01" eyebrow, matching the original page's numbering. */
  label?: string;
  /** Shorter wording for the contents list, where it differed. */
  tocLabel?: string;
  /** Single paragraph -- used by the policies still held as summaries. */
  body?: string;
  /** Lead paragraph shown above any list. */
  intro?: string;
  /** Labelled clauses. */
  clauses?: LegalClause[];
  /** Unordered points. */
  bullets?: string[];
  /** Ordered points, numbered in the original. */
  items?: string[];
  /** Small data table, e.g. the payment policy's rate card. */
  table?: { columns: string[]; rows: string[][] };
  /** Highlighted notice, closing the section by default. */
  callout?: LegalCallout;
  /**
   * Renders the callout after this many clauses instead of at the end,
   * where the original placed it mid-section.
   */
  calloutAfterClause?: number;
  /** Closing "Also see …" line; supports [label](/path) links. */
  footnote?: string;
  /**
   * Renders the live contact channels from SITE. Set instead of listing
   * them as content so a number change never has to be made twice.
   */
  contactChannels?: boolean;
}

export interface LegalPage {
  slug: string;
  title: string;
  accent: string;
  /** Meta description. */
  summary: string;
  /**
   * Social description, where the original used different wording from
   * the meta description. Falls back to `summary`.
   */
  ogDescription?: string;
  /** Where the original's twitter: description differed from og:. */
  twitterDescription?: string;
  /**
   * WebPage/BreadcrumbList name and description, where the original's
   * JSON-LD differed from both the heading and the meta description.
   */
  schemaName?: string;
  schemaDescription?: string;
  /**
   * Breadcrumb label, where the original's trail used shorter wording
   * than its WebPage name. Falls back to `schemaName`.
   */
  breadcrumbName?: string;
  /** Pill above the heading. */
  eyebrow?: string;
  /** Opening paragraph on the page, where it differs from `summary`. */
  lead?: string;
  /** Effective date and scope, shown as chips under the lead. */
  meta?: { label: string; value: string }[];
  /** Statement that precedes the first numbered section. */
  intro?: string;
  sections: LegalSection[];
  /** Closing call to action. */
  cta?: { heading: string; body: string };
}

export const LEGAL_PAGES: LegalPage[] = [
  {
    slug: "terms",
    // Heading reads "Terms & Conditions", as the original did; the
    // <title> and JSON-LD spell out "and", also as the original did.
    title: "Terms &",
    accent: "Conditions",
    summary:
      "Read the Terms and Conditions governing MyOnlineClassPro services. Understand our scope, client responsibilities, delivery, payment, and refund policies.",
    ogDescription:
      "Terms and Conditions governing all services, interactions, and engagements on MyOnlineClassPro.com.",
    schemaName: "Terms and Conditions",
    schemaDescription:
      "Terms and Conditions for MyOnlineClassPro academic assistance services.",
    eyebrow: "Legal & Policy",
    lead: "Please read these terms carefully. By continuing to use MyOnlineClassPro.com and any of its services, you acknowledge and agree to these Terms and Conditions in their entirety.",
    meta: [
      { label: "Effective", value: "January 1, 2026" },
      { label: "Applies to", value: "myonlineclasspro.com" },
    ],
    intro:
      "Any interactions, services, and engagements conducted via MyOnlineClassPro.com, as well as any further usage, are governed by the following Terms and Conditions. Continued use of this platform constitutes full and unconditional acceptance of all terms stated herein. If you do not agree with any part of these terms, you should discontinue use immediately.",
    sections: [
      {
        id: "scope",
        label: "Section 01",
        heading: "Scope of Services",
        clauses: [
          {
            label: "Clause I",
            body: "MyOnlineClassPro offers services as academic assistance, which covers tools assigned to assist students with their assignment writing, coursework, academic consultation, and organized exam preparation — all aimed at enhancing learning outcomes and not substituting student responsibility.",
          },
          {
            label: "Clause II",
            body: "All services will be provided in strict adherence to the information, materials, and instructions given by the client. The client is held accountable for all requirements and the accuracy of all inputs provided to MyOnlineClassPro.",
          },
          {
            label: "Clause III",
            body: "MyOnlineClassPro reserves the right to reject requests that are at variance with institutional policies, codes of conduct, or existing laws. We do not facilitate academic dishonesty and will not process orders that violate institutional integrity policies.",
          },
        ],
        callout: {
          label: "Important",
          body: "All materials delivered by MyOnlineClassPro are intended as model references for academic learning only. They are not to be submitted as original work by the client without proper citation and review per their institution's requirements.",
        },
      },
      {
        id: "client",
        label: "Section 02",
        heading: "Client Responsibilities",
        intro:
          "Clients who use MyOnlineClassPro services accept the following responsibilities in full:",
        bullets: [
          "Clients must submit all accurate, complete, and timely academic specifications — including rubrics, deadlines, format guidelines, and institutional policies — to enable proper fulfilment of the service.",
          "The responsibility for reviewing all delivered material before any submission lies solely with the client. It is the client's obligation to ensure that all course-specific expectations are met prior to any use.",
          "The client is solely entitled to make final submission decisions and retains full academic accountability for any content submitted under their name to any institution.",
          "Clients must not share login credentials, access details, or confidential service communications with third parties not directly involved in their academic engagement.",
        ],
      },
      {
        id: "delivery",
        label: "Section 03",
        heading: "Delivery & Revisions",
        items: [
          "Scheduling of deliveries is computed using agreed deadlines and will only commence once confirmation of requirements and payment is received. Late submission of materials or payment may affect the agreed delivery timeline.",
          "Revision support is restricted to adjustments directly related to the initial instructions and assessment standards provided at the time of order. Revisions that introduce new requirements not specified in the original brief may be treated as a separate engagement.",
          "Orders that concern an increase in scope, changed requirements, or new academic work are considered diverse engagements and will be subject to separate pricing and timelines.",
          "MyOnlineClassPro will make reasonable efforts to meet all agreed deadlines. However, delays caused by the client's failure to provide required materials in a timely manner will not be the responsibility of the service provider.",
        ],
        callout: {
          label: "Revision Policy",
          body: "Revision requests must be submitted within 7 days of the delivery date and must fall within the scope of the original instructions. Contact our support team via WhatsApp or email to initiate a revision.",
        },
      },
      {
        id: "payment",
        label: "Section 04",
        heading: "Payment & Fees",
        items: [
          "All payments are processed securely. MyOnlineClassPro accepts major payment methods as displayed at the point of checkout. Full payment or agreed instalment amounts must be received before service commencement.",
          "Pricing is determined by the nature, volume, and complexity of the academic work requested, as well as deadline urgency. A free quote will be provided before any obligation is made by the client.",
          // Linked to this project's own route, not the old .html path.
          "Refund eligibility is governed by the [Payment & Refund Policy](/legal/payment-refund-policy). Clients are encouraged to review it before placing an order.",
          "MyOnlineClassPro reserves the right to adjust pricing for active or future engagements where the scope of work materially changes from what was originally agreed.",
        ],
      },
      {
        id: "confidentiality",
        label: "Section 05",
        heading: "Confidentiality & Privacy",
        tocLabel: "Confidentiality",
        bullets: [
          "MyOnlineClassPro treats all client information — including personal details, academic materials, and order specifics — as strictly confidential. This data will not be disclosed to any third party without the client's explicit consent.",
          "Client identities, academic profiles, and transaction histories are never sold, rented, or shared with advertisers, data brokers, or any external organization.",
          "All communications between the client and MyOnlineClassPro — whether via email, WhatsApp, or our platform — are handled with the highest standard of discretion.",
          "Clients are responsible for maintaining the confidentiality of their own account credentials and should notify us immediately of any unauthorized access.",
        ],
        callout: {
          label: "100% Confidential",
          body: "Your identity and order details are never shared. We do not keep records that link academic deliverables to your personal identity beyond the active engagement period.",
        },
      },
      {
        id: "ip",
        label: "Section 06",
        heading: "Intellectual Property",
        items: [
          "All academic content, materials, and deliverables produced by MyOnlineClassPro are created exclusively for the purchasing client. Upon full payment, usage rights for the delivered content transfer to the client for personal reference and study.",
          "Clients must not resell, redistribute, or commercially exploit any materials delivered by MyOnlineClassPro without prior written consent.",
          "All trademarks, branding, website design, and platform content belonging to MyOnlineClassPro are the exclusive intellectual property of the company and may not be reproduced without authorization.",
        ],
      },
      {
        id: "liability",
        label: "Section 07",
        heading: "Limitation of Liability",
        bullets: [
          "MyOnlineClassPro provides academic assistance as a support tool only. The company shall not be liable for any academic or institutional consequences arising from the use or misuse of materials delivered.",
          "In no event shall MyOnlineClassPro's total liability to any client exceed the total fees paid by that client for the specific service giving rise to the claim.",
          "MyOnlineClassPro shall not be liable for any indirect, incidental, special, or consequential damages, including but not limited to loss of academic standing, loss of enrollment, or disciplinary action.",
          "Outcomes achieved with delivered materials are dependent on the accuracy and completeness of information provided by the client. MyOnlineClassPro is not liable for outcomes where client-supplied instructions were incomplete or inaccurate.",
        ],
        callout: {
          label: "Disclaimer",
          body: "The reference materials provided by MyOnlineClassPro serve as model papers for students and are not to be submitted as-is. These papers are intended to be used for research and reference purposes only.",
        },
      },
      {
        id: "modifications",
        label: "Section 08",
        heading: "Modifications to Terms",
        tocLabel: "Modifications",
        items: [
          "MyOnlineClassPro reserves the right to update, amend, or replace these Terms and Conditions at any time. The most current version will always be available on this page with an updated effective date.",
          "Continued use of the platform following the publication of any changes constitutes acceptance of those changes. Clients are encouraged to review this page periodically.",
          "For material changes, MyOnlineClassPro will make reasonable efforts to notify active clients via the contact information associated with their account.",
        ],
      },
      {
        id: "contact",
        label: "Section 09",
        heading: "Contact Us",
        intro:
          "If you have any questions, concerns, or disputes regarding these Terms and Conditions, please contact our support team through any of the following channels:",
        contactChannels: true,
      },
    ],
    cta: {
      heading: "Ready to Get Started?",
      body: "Our academic experts are standing by. Place your order in minutes and get an expert assigned in under 10 minutes — no commitment until you approve the quote.",
    },
  },
  {
    slug: "privacy",
    title: "Privacy",
    accent: "Policy",
    summary:
      "Read the MyOnlineClassPro Privacy Policy. Learn how we collect, use, and protect your personal information. Your privacy and confidentiality matter.",
    ogDescription:
      "MyOnlineClassPro Privacy Policy — how we collect, use, and protect your personal data. 100% confidential academic assistance.",
    twitterDescription:
      "MyOnlineClassPro Privacy Policy — how we collect, use, and protect your personal data.",
    schemaName: "Privacy Policy — MyOnlineClassPro",
    schemaDescription:
      "Privacy Policy for MyOnlineClassPro. How we collect, use, and protect your personal information.",
    // The original's trail read just "Privacy Policy", not the longer
    // WebPage name above.
    breadcrumbName: "Privacy Policy",
    eyebrow: "Legal & Policy",
    meta: [{ label: "Last updated", value: "September 29, 2026" }],
    /* Body from MOC_Pages.docx (Privacy Policy, last updated September 29,
       2026), clause for clause. Two sentences in that draft were notes to
       the site owner rather than policy, and are not published here:
         "…our actual payment arrangements should be confirmed before
          publication." (Information we collect)
         "Any cross-border transfers and provider-specific arrangements
          should be disclosed once verified." (Disclosures)
       The draft's blank "Phone" / "WhatsApp: ____" lines are filled by the
       live contact channels from SITE. */
    sections: [
      {
        heading: "Who we are",
        id: "who-we-are",
        label: "Section 01",
        tocLabel: "Who we are",
        intro:
          "MyOnlineClassPro operates the website [https://myonlineclasspro.com/](/).",
        body: `Privacy contact: ${SITE.email}.`,
        contactChannels: true,
      },
      {
        heading: "Information we collect",
        id: "information-we-collect",
        label: "Section 02",
        tocLabel: "Information we collect",
        body: "Depending on your interaction with us, we may collect your name, email address, contact details, inquiries, order and payment records, instructions and materials you choose to submit, messages, complaints, feedback, and technical information generated through website use. Payment card information may be handled by a payment provider. Please do not send passwords, account-recovery codes, or unnecessary sensitive information.",
      },
      {
        heading: "Why we use it",
        id: "why-we-use-it",
        label: "Section 03",
        tocLabel: "Why we use it",
        body: "We use information to answer inquiries, prepare quotes, provide and manage requested services, communicate about orders, process and document payments, respond to complaints, maintain site security, improve our services, and comply with applicable obligations. If we send marketing messages, we will explain the available opt-out method.",
      },
      {
        heading: "Disclosures and service providers",
        id: "disclosures",
        label: "Section 04",
        tocLabel: "Disclosures and service providers",
        body: "Information may be available to personnel and providers who need it to perform a relevant task, including service delivery, website hosting, communications, and payment processing. We may also disclose information when required by law or reasonably necessary to protect rights and security.",
      },
      {
        heading: "Retention and security",
        id: "retention-and-security",
        label: "Section 05",
        tocLabel: "Retention and security",
        body: "We retain information only as long as reasonably necessary for the purposes described here, including service delivery, recordkeeping, disputes, and legal obligations. Specific retention periods or criteria will be documented after review of our systems. We use safeguards appropriate to the information we hold, but no transmission or storage method is entirely risk-free.",
      },
      {
        heading: "Your choices and requests",
        id: "your-choices",
        label: "Section 06",
        tocLabel: "Your choices and requests",
        body: `Email ${SITE.email} with the subject PRIVACY REQUEST to ask about, correct, or request deletion of your information. We may verify your identity and retain records when permitted or required by law. Additional rights may apply based on your location and applicable law.`,
      },
      {
        heading: "Cookies, updates, and contact",
        id: "contact",
        label: "Section 07",
        tocLabel: "Cookies, updates, and contact",
        body: `See [https://myonlineclasspro.com/legal/cookie-policy](/legal/cookie-policy) for more about website technologies. We may update this policy and post a revised date. Email: ${SITE.email}.`,
        contactChannels: true,
      },
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie",
    accent: "Policy",
    // The original's meta, og: and twitter: descriptions were one string.
    summary:
      "Read MyOnlineClassPro's Cookie Policy. Learn what cookies we use, why we use them, and how to manage your cookie preferences.",
    schemaName: "Cookie Policy",
    eyebrow: "Legal & Policy",
    meta: [{ label: "Last updated", value: "September 29, 2026" }],
    /* Body from MOC_Pages.docx (Cookie Policy, last updated September 29,
       2026). Not published: the draft's closing sentence of "Third-party
       technologies" — "A current inventory of cookie names, providers,
       purposes, and durations should be made available alongside this
       policy once confirmed by our website audit." — a note to the site
       owner. Blank WhatsApp / Phone lines are filled from SITE. */
    sections: [
      {
        heading: "About this policy",
        id: "about",
        label: "Section 01",
        tocLabel: "About this policy",
        body: "MyOnlineClassPro uses cookies and similar technologies to support website functions and, where enabled, to understand website use. This policy explains their purposes and your choices. It should be read with our Privacy Policy at [https://myonlineclasspro.com/legal/privacy](/legal/privacy).",
      },
      {
        heading: "What cookies are",
        id: "what-cookies-are",
        label: "Section 02",
        tocLabel: "What cookies are",
        body: "Cookies are small files placed on a browser or device. Similar technologies may include pixels, tags, and browser storage. They can support site functions, remember choices, measure usage, or support advertising, depending on which tools are active.",
      },
      {
        heading: "Types of technologies",
        id: "types",
        label: "Section 03",
        tocLabel: "Types of technologies",
        body: "Strictly necessary technologies support functions such as security, forms, and remembering privacy choices. Analytics technologies, if enabled, help us understand site use. Functional technologies, if enabled, remember optional preferences or provide third-party features. Advertising technologies, if enabled, may measure campaigns or help deliver relevant ads. The presence of a category depends on the tools actually deployed on the site.",
      },
      {
        heading: "Your choices",
        id: "your-choices",
        label: "Section 04",
        tocLabel: "Your choices",
        body: "You can manage or delete cookies through your browser settings. Where a cookie-preferences control is available on our website, use it to review or change your choices. Blocking some technologies may affect site functionality. Our implementation and choices for non-essential technologies will comply with applicable requirements.",
      },
      {
        heading: "Third-party technologies",
        id: "third-party",
        label: "Section 05",
        tocLabel: "Third-party technologies",
        body: "Some website features may rely on third-party providers. Those providers may set or access technologies under their own policies.",
      },
      {
        heading: "Changes and contact",
        id: "contact",
        label: "Section 06",
        tocLabel: "Changes and contact",
        body: `We may update this policy when our technologies change. For questions, email ${SITE.email}.`,
        contactChannels: true,
      },
    ],
  },
  {
    slug: "payment-refund-policy",
    title: "Payment &",
    accent: "Refund Policy",
    summary:
      "Read MyOnlineClassPro Payment and Refund Policy. Understand our pricing structure, refund eligibility, liability limits, and full policy details.",
    ogDescription:
      "Payment and Refund Policy governing all financial transactions and service agreements with MyOnlineClassPro.",
    twitterDescription:
      "Payment and Refund Policy governing all financial transactions with MyOnlineClassPro.",
    schemaName: "Payment and Refund Policy",
    breadcrumbName: "Payment & Refund Policy",
    schemaDescription:
      "Payment and Refund Policy for MyOnlineClassPro academic assistance services.",
    eyebrow: "Legal & Finance",
    lead: "This policy governs all financial transactions, pricing structures, and refund eligibility for services provided by MyOnlineClassPro. Please read carefully before placing an order.",
    meta: [
      { label: "Effective", value: "January 1, 2026" },
      { label: "Applies to", value: "myonlineclasspro.com" },
    ],
    intro:
      "At MyOnlineClassPro, we are committed to transparent and fair financial practices. This Payment and Refund Policy outlines your rights, our obligations, and the conditions under which refunds may be considered. By using our services you agree to the terms below in their entirety.",
    sections: [
      {
        id: "refund",
        label: "Section 01",
        heading: "Payment & Refund Policy",
        tocLabel: "Payment & Refunds",
        clauses: [
          {
            label: "Non-Refundable Work",
            body: "The intellectual work, investment of research funds, and time spent in regard to academic services are paid and hence are not refundable after the work has commenced. Once an expert has been assigned and work has begun, the service fee is considered earned and cannot be reversed.",
          },
          {
            label: "Refund Eligibility",
            body: "Refund considerations are only applicable when there is non-delivery that can be attributed to MyOnlineClassPro — but not for delays arising from incomplete or incorrect information provided by the client. It is the client's responsibility to submit accurate, complete, and timely instructions at the point of order.",
          },
          {
            label: "When refunds may be considered",
            body: "Failure to deliver agreed work within the timeline due to a fault on our side, duplication of payment (confirmed by our payments team), or verified technical errors in the checkout process. Each case is reviewed individually.",
          },
        ],
        // The original placed this notice between the second and third
        // clause rather than at the end of the section.
        calloutAfterClause: 2,
        callout: {
          label: "Important",
          body: "Refund requests must be raised within 7 days of the originally agreed delivery date. Requests submitted after this window will not be considered unless exceptional circumstances apply and are verified by our team.",
        },
      },
      {
        id: "pricing",
        label: "Section 02",
        heading: "Pricing Structure",
        intro:
          "Pricing systems are based on the following factors, each evaluated at the time of order:",
        bullets: [
          "Academic complexity — the depth of subject matter, level of course (undergraduate, graduate, professional), and the number of deliverables involved.",
          "Urgency of the deadline — same-day and next-day orders carry a premium rate due to the intensive expert allocation required.",
          "Subject specialization — niche or highly technical subjects (e.g. advanced pharmacology, quantum mathematics, actuarial science) may be priced higher due to limited expert availability.",
          "Scope of work — single assignment vs. weekly management vs. full course takeover are priced differently. See our [Pricing page](/pricing) for indicative ranges.",
        ],
        /* CARRIED OVER VERBATIM FROM THE OLD PAGE — NOT RECONCILED.
           These figures disagree with SERVICE_PRICES in
           src/constants/pricing.ts, which is the source of truth for the
           order form and the Pricing section:
             Weekly Class Management  $100/week  vs  Full Class  $39/week
             Online Exam Help         $60        vs  Exam        $30
             Quiz (grouped at $15)               vs  Quiz        $25
           Note pricing.ts records the $60 exam as an earlier drift that
           was already corrected once. Reconcile before publishing. */
        table: {
          columns: ["Service Type", "Starting From", "Factors"],
          rows: [
            ["Single Assignment / Quiz", "$15", "Complexity, deadline"],
            ["Weekly Class Management", "$100 / week", "Subject, workload"],
            ["Full Course Takeover", "$299", "Duration, subject, LMS"],
            ["Online Exam Help", "$60", "Subject, proctoring, time"],
          ],
        },
        callout: {
          label: "Free Quote Policy",
          body: "A no-obligation quote is always provided before any payment is requested. You will never be charged without your explicit approval of the price and scope of work.",
        },
      },
      {
        id: "liability",
        label: "Section 03",
        heading: "Limitation of Liability",
        clauses: [
          {
            label: "A",
            body: "MyOnlineClassPro does not claim responsibility in academic performance, grading decisions, and institutional measures that are caused due to student submission choices. The client retains full responsibility for any decision to submit or use delivered materials in any academic context.",
          },
          {
            label: "B",
            body: "Liability is restricted to the value of rendered services — but not to any indirect, consequential, reputational, or academic damages that may arise from the use, misuse, or submission of materials provided. In no event shall our liability exceed the total fees paid by the client for the specific service in question.",
          },
        ],
        callout: {
          label: "Disclaimer",
          body: "All materials delivered by MyOnlineClassPro are intended as model academic references only. They are not to be submitted directly as the client's own work. The client accepts full academic and legal responsibility for any submission made under their name.",
        },
      },
      {
        id: "modifications",
        label: "Section 04",
        heading: "Modification of Terms",
        intro:
          "MyOnlineClassPro reserves the right to modify or amend this Payment and Refund Policy in accordance with operational, legal, or regulatory developments. Changes will be published on this page with an updated effective date.",
        bullets: [
          "Continued use of the platform following the publication of any changes constitutes acknowledgment and acceptance of the modified terms.",
          "Active clients will be notified of material changes via their registered contact information where reasonably possible.",
          "For any questions about past or current policy versions, contact our support team directly.",
        ],
      },
      {
        id: "contact",
        label: "Section 05",
        heading: "Contact Us",
        intro:
          "For any payment queries, refund requests, or policy clarifications, please reach out through any of the channels below:",
        contactChannels: true,
        footnote: "Also see: [Terms & Conditions](/legal/terms)",
      },
    ],
    cta: {
      heading: "Ready to Get Started?",
      body: "Our academic experts are standing by. Get a free quote in minutes — no commitment until you approve the price and scope.",
    },
  },
  {
    slug: "complaints-policy",
    title: "Complaints",
    accent: "Policy",
    // The original's meta, og: and twitter: descriptions were one string.
    summary:
      "Read MyOnlineClassPro's Complaints Policy. Learn how to submit a complaint, our response timeline, resolution options, and escalation process.",
    schemaName: "Complaints Policy",
    eyebrow: "Legal & Policy",
    meta: [{ label: "Last updated", value: "September 29, 2026" }],
    /* Body from MOC_Pages.docx (Complaints Policy, last updated September
       29, 2026), clause for clause. The draft's blank "WhatsApp: ____.
       Phone: ____." are filled by the live contact channels from SITE. */
    sections: [
      {
        heading: "Our approach",
        id: "approach",
        label: "Section 01",
        tocLabel: "Our approach",
        body: "MyOnlineClassPro welcomes complaints and aims to respond fairly and clearly. You may raise concerns about service scope, deadlines, billing, communication, conduct, or privacy. Making a complaint does not waive any right you may have under applicable law.",
      },
      {
        heading: "How to complain",
        id: "how-to-complain",
        label: "Section 02",
        tocLabel: "How to complain",
        body: `Email ${SITE.email} with the subject COMPLAINT and your order ID if available. Explain what happened, relevant dates, the outcome you seek, and attach relevant records. Do not send passwords or unnecessary sensitive information.`,
        contactChannels: true,
      },
      {
        heading: "Acknowledgment and review",
        id: "acknowledgment",
        label: "Section 03",
        tocLabel: "Acknowledgment and review",
        body: "We aim to acknowledge complaints within 24 hours, resolve straightforward matters within 48–72 hours, and respond to more complex matters within 5–7 business days. If we need more time or information, we will explain the reason and provide an update. These are service targets rather than guaranteed resolution periods.",
      },
      {
        heading: "Resolution and refunds",
        id: "resolution",
        label: "Section 04",
        tocLabel: "Resolution and refunds",
        body: "We review the agreed order details and relevant records and explain our decision in writing. Where appropriate, we may correct an error, offer an eligible revision, address conduct or communication, or provide another suitable remedy. Refund requests are considered under [https://myonlineclasspro.com/legal/payment-refund-policy](/legal/payment-refund-policy) and applicable law; a complaint does not itself guarantee a refund.",
      },
      {
        heading: "Escalation",
        id: "escalation",
        label: "Section 05",
        tocLabel: "Escalation",
        body: "If you disagree with our response, reply to the complaint email with the subject ESCALATION and explain what was missed. A senior team member will review the matter and aim to respond within 3–5 business days. You may also pursue any external remedy available to you.",
      },
      {
        heading: "Confidential handling",
        id: "confidential",
        label: "Section 06",
        tocLabel: "Confidential handling",
        body: "Access to complaint information is limited to people who need it to investigate, respond, administer a remedy, or meet an obligation. Our [Privacy Policy](/legal/privacy) describes how we handle personal information.",
      },
    ],
  },
  {
    slug: "consumer-feedback",
    title: "Consumer",
    accent: "Feedback",
    // The original's meta, og: and twitter: descriptions were one string.
    summary:
      "Share your experience with MyOnlineClassPro. Learn how to submit feedback, how we use your input, and our commitment to continuous service improvement.",
    schemaName: "Consumer Feedback",
    eyebrow: "Legal & Policy",
    meta: [{ label: "Last updated", value: "September 29, 2026" }],
    /* Body from MOC_Pages.docx (Consumer Feedback Policy, last updated
       September 29, 2026), clause for clause. The draft's blank
       "WhatsApp: ____." / "Phone: ____." lines are filled by the live
       contact channels from SITE. */
    sections: [
      {
        heading: "We welcome honest feedback",
        id: "welcome",
        label: "Section 01",
        tocLabel: "We welcome honest feedback",
        body: "MyOnlineClassPro welcomes positive, negative, and mixed feedback. You do not need to provide a favorable rating to receive support or to have a concern investigated.",
      },
      {
        heading: "How to share feedback",
        id: "how-to-share",
        label: "Section 02",
        tocLabel: "How to share feedback",
        body: `Email ${SITE.email} with the subject FEEDBACK and, if available, your order ID. Tell us what worked, what did not, and what you would change. Do not include passwords or another person’s private details.`,
        contactChannels: true,
      },
      {
        heading: "Feedback versus complaints",
        id: "feedback-vs-complaints",
        label: "Section 03",
        tocLabel: "Feedback versus complaints",
        body: "If you seek an investigation or remedy for a specific service issue, follow [https://myonlineclasspro.com/legal/complaints-policy](/legal/complaints-policy). You may submit feedback and a complaint about the same experience.",
      },
      {
        heading: "Review integrity",
        id: "review-integrity",
        label: "Section 04",
        tocLabel: "Review integrity",
        body: "We do not intend to publish invented testimonials, attribute reviews to people who did not provide them, require a positive review in exchange for an incentive, or remove an eligible review solely because it is negative. Any offered incentive and material connection should be clearly disclosed when applicable. We may moderate spam, threats, irrelevant material, or unnecessary personal information without misrepresenting the balance of customer feedback.",
      },
      {
        heading: "Use of feedback",
        id: "use-of-feedback",
        label: "Section 05",
        tocLabel: "Use of feedback",
        body: "If we feature a customer’s feedback in marketing, we will seek appropriate permission and will not change its meaning. We may use contact information to follow up. An order-specific issue may require enough information to identify the order. We handle feedback-related personal information under [https://myonlineclasspro.com/legal/privacy](/legal/privacy).",
      },
      {
        heading: "Questions about a review",
        id: "questions",
        label: "Section 06",
        tocLabel: "Questions about a review",
        body: `Email ${SITE.email} to identify a review you believe is inaccurate or contains personal information. Explain the concern so that we can review it.`,
        contactChannels: true,
      },
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
