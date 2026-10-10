import { useId, type ReactNode } from "react";
import Image from "next/image";
import { Link2, Mail, MessageSquareText } from "lucide-react";
import { GoogleGLogo } from "@/components/reviews/google-g-logo";
import { WA_PATH } from "@/components/layout/whatsapp-button";
import { LOGO_SRC } from "@/constants/images";
import { SOCIAL_LINKS, type SocialLink } from "@/constants/socials";
import { cn } from "@/lib/utils";

/**
 * Review sources and how each one is shown: the single mapping for the
 * whole app, so a source looks the same wherever it appears.
 *
 * Display only. The stored reviewSource is never changed: it is matched
 * case-insensitively (the API sends upper case, e.g. "GOOGLE") against
 * `key`, and a value that matches none of these keeps its existing text
 * label rather than being given a guessed logo.
 *
 * Every mark is an asset the project already uses:
 * - Website   the company logo file from the site header (LOGO_SRC)
 * - Google    Google's official G (google-g-logo.tsx)
 * - Facebook, X, Instagram   the original footer's brand paths
 *             (constants/socials.ts), in the footer's brand colours
 * - WhatsApp  the WhatsApp mark and #25D366 green from the navbar and
 *             floating button
 * - Email, Text, Other   lucide icons, the project's icon library
 */

/**
 * A brand path set from the footer's social links. Missing (say the
 * footer entry is renamed) means that source is treated as unknown and
 * keeps its text label; it never throws and breaks the review list.
 */
function social(name: string): SocialLink | undefined {
  return SOCIAL_LINKS.find((s) => s.name === name);
}
const FACEBOOK = social("Facebook");
const X = social("X");
const INSTAGRAM = social("Instagram");

function FacebookMark() {
  if (!FACEBOOK) return null;
  return (
    <svg viewBox={FACEBOOK.viewBox} aria-hidden focusable="false">
      {/* White behind the cut-out "f", as in Facebook's own logo, so the
          "f" stays white on the dark card too. */}
      <circle cx="12" cy="12" r="11.5" fill="#fff" />
      {FACEBOOK.paths.map((d) => (
        <path key={d} fill="#1877F2" d={d} />
      ))}
    </svg>
  );
}

function InstagramMark() {
  // Unique per instance: several cards on one page each need a gradient.
  const id = `ig-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  if (!INSTAGRAM) return null;
  return (
    <svg viewBox={INSTAGRAM.viewBox} aria-hidden focusable="false">
      <defs>
        {/* The footer's Instagram gradient (45deg, bottom-left to top-right). */}
        <linearGradient id={id} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#f09433" />
          <stop offset=".25" stopColor="#e6683c" />
          <stop offset=".5" stopColor="#dc2743" />
          <stop offset=".75" stopColor="#cc2366" />
          <stop offset="1" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      {INSTAGRAM.paths.map((d) => (
        <path key={d} fill={`url(#${id})`} d={d} />
      ))}
    </svg>
  );
}

function XMark() {
  // currentColor: white on the dark theme, black on the light (.rv-src--x).
  if (!X) return null;
  return (
    <svg viewBox={X.viewBox} aria-hidden focusable="false">
      {X.paths.map((d) => (
        <path key={d} fill="currentColor" d={d} />
      ))}
    </svg>
  );
}

function WhatsAppMark() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden focusable="false">
      <path fill="#25D366" d={WA_PATH} />
    </svg>
  );
}

function WebsiteMark() {
  // Same file as the header logo; the wrapper carries the accessible name.
  return <Image src={LOGO_SRC} alt="" width={16} height={16} unoptimized />;
}

export interface ReviewSourceDef {
  /** Lower-case stored value; compared case-insensitively. */
  key: string;
  /** Name shown in lists and menus. */
  label: string;
  /** Screen-reader name and hover text for the logo. */
  a11yLabel: string;
  Logo: () => ReactNode;
  /** Extra class: theme colour for X, neutral tone for plain icons. */
  className?: string;
  /** False when the logo's asset is missing; the source then shows as text. */
  available?: boolean;
}

/** In the order of the admin dashboard's Review Source dropdown. */
export const REVIEW_SOURCES: readonly ReviewSourceDef[] = [
  {
    key: "website",
    label: "Website",
    a11yLabel: "Review from the MyOnlineClassPro website",
    Logo: WebsiteMark,
  },
  {
    key: "google",
    label: "Google",
    a11yLabel: "Google review",
    Logo: () => <GoogleGLogo />,
  },
  {
    key: "facebook",
    label: "Facebook",
    a11yLabel: "Facebook review",
    Logo: FacebookMark,
    available: Boolean(FACEBOOK),
  },
  {
    key: "instagram",
    label: "Instagram",
    a11yLabel: "Instagram review",
    Logo: InstagramMark,
    available: Boolean(INSTAGRAM),
  },
  {
    key: "x",
    label: "X",
    a11yLabel: "X review",
    Logo: XMark,
    className: "rv-src--x",
    available: Boolean(X),
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    a11yLabel: "WhatsApp review",
    Logo: WhatsAppMark,
  },
  {
    key: "email",
    label: "Email",
    a11yLabel: "Review sent by email",
    Logo: () => <Mail aria-hidden />,
    className: "rv-src--icon",
  },
  {
    key: "text",
    label: "Text",
    a11yLabel: "Review sent by text message",
    Logo: () => <MessageSquareText aria-hidden />,
    className: "rv-src--icon",
  },
  {
    key: "other",
    label: "Other",
    a11yLabel: "Review from another source",
    Logo: () => <Link2 aria-hidden />,
    className: "rv-src--icon",
  },
];

/** The definition for a stored reviewSource, or null if it isn't one. */
export function findReviewSource(source?: string): ReviewSourceDef | null {
  const key = source?.trim().toLowerCase();
  return (
    REVIEW_SOURCES.find((s) => s.key === key && s.available !== false) ?? null
  );
}

/**
 * A source's logo in a fixed 16px box, named for screen readers and on
 * hover. Renders nothing for a value that isn't a known source.
 */
export function ReviewSourceLogo({
  source,
  className,
}: {
  source?: string;
  className?: string;
}) {
  const def = findReviewSource(source);
  if (!def) return null;
  const { Logo } = def;
  return (
    <span
      className={cn("rv-src", def.className, className)}
      role="img"
      aria-label={def.a11yLabel}
      title={def.a11yLabel}
    >
      <Logo />
    </span>
  );
}
