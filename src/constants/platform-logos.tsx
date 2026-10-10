import type { CSSProperties, ReactNode } from "react";
import { PLATFORM_ITEMS } from "@/constants/platform-items";
import { PLATFORM_GRID } from "@/constants/platform-grid";

/**
 * One source of truth for platform logos.
 *
 * The homepage already carries brand marks in two places: the marquee
 * (PLATFORM_ITEMS) and the platforms grid (PLATFORM_GRID). Rather than
 * duplicating those marks for the service pages, this builds a lookup
 * over both, so a logo change on the homepage flows through here
 * automatically.
 *
 * The grid is preferred as the primary source because it covers more
 * brands and its marks are self-contained (no external files that can
 * 404); the marquee fills the gaps, and SERVICE_MARKS below fills what
 * neither covers.
 */

/** Marquee art is either inline SVG or a hosted image. */
function isImageArt(art: unknown): art is { src: string; alt: string } {
  return typeof art === "object" && art !== null && "src" in art;
}

const byName = new Map<string, ReactNode>();

// Grid first — broader coverage, no external assets.
for (const item of PLATFORM_GRID) {
  byName.set(item.name.toLowerCase(), item.logo);
}
// Marquee fills anything the grid lacks. Image-backed entries are
// skipped: those are third-party hosted and can 404, which would put a
// broken image in a chip.
for (const item of PLATFORM_ITEMS) {
  const key = String(item.name).toLowerCase();
  if (byName.has(key)) continue;
  if (isImageArt(item.art)) continue;
  byName.set(key, item.art as ReactNode);
}

/* ── Marks for platforms only the service pages name ──────────────
   Built from the same parts as the homepage grid marks
   (platform-grid.tsx), with no image files:
   - a brand-coloured wordmark (Canvas, Cengage, Moodle)
   - a two-tone wordmark (WebAssign)
   - an initial badge before the wordmark (Pearson's circle "P")
   - text on a filled box (Blackboard's "Bb")
   Plus one addition: a small product label under the wordmark, for
   names with a product after the brand ("Connect", "Online").
   These are simplified typographic treatments in brand-inspired
   colours, not reproductions of the companies' logo artwork. */

/** A run of wordmark text with its own colour (two-tone wordmarks). */
type MarkSegment = {
  text: string;
  color: string;
  weight?: number;
  /** Word gap before this segment ("Google Classroom", not "eCampus"). */
  space?: boolean;
};

type ServiceMark = {
  /** Platform name exactly as the service data spells it. */
  name: string;
  /** Wordmark: plain text, or segments for a two-tone mark. */
  text: string | MarkSegment[];
  /** Wordmark colour (for plain text marks). */
  color?: string;
  /** rem size, chosen so each mark fits the plate like the homepage marks. */
  size: string;
  weight?: number;
  italic?: boolean;
  letterSpacing?: string;
  /** Initial badge before the wordmark (Pearson pattern). */
  badge?: { text: string; bg: string; shape: "circle" | "square" };
  /** Wordmark on a filled box (Blackboard pattern). */
  box?: { bg: string; color: string; radius: number; padding: string };
  /** Small product label under the wordmark. */
  sub?: { text: string; color: string };
};

const SERVICE_MARKS: ServiceMark[] = [
  {
    // Dark wordmark, red accent on the badge and product label only.
    name: "McGraw Hill Connect",
    text: "McGraw Hill",
    color: "#1a1a1a",
    size: ".9rem",
    weight: 800,
    badge: { text: "MH", bg: "#d0021b", shape: "square" },
    sub: { text: "Connect", color: "#d0021b" },
  },
  {
    name: "QuickBooks Online",
    text: "QuickBooks",
    color: "#393a3d",
    size: ".92rem",
    weight: 800,
    badge: { text: "qb", bg: "#2ca01c", shape: "circle" },
    sub: { text: "Online", color: "#2ca01c" },
  },
  {
    name: "Xero",
    text: "xero",
    size: "1.1rem",
    weight: 700,
    letterSpacing: ".02em",
    box: { bg: "#13b5ea", color: "#fff", radius: 999, padding: "3px 14px" },
  },
  {
    name: "Edmentum",
    text: "edmentum",
    color: "#009dda",
    size: "1.08rem",
    weight: 800,
  },
  {
    name: "Edgenuity",
    text: "edgenuity",
    color: "#4158d0",
    size: "1.08rem",
    weight: 800,
  },
  {
    name: "Coursera",
    text: "coursera",
    color: "#0056d2",
    size: "1.12rem",
    weight: 700,
  },
  {
    name: "Google Classroom",
    text: [
      { text: "Google", color: "#5f6368", weight: 600 },
      { text: "Classroom", color: "#1e8e3e", space: true },
    ],
    // The longest name: sized to clear the plate like "D2L Brightspace".
    size: ".86rem",
    weight: 800,
  },
  {
    name: "Sakai",
    text: "sakai",
    color: "#383838",
    size: "1.05rem",
    weight: 700,
    badge: { text: "S", bg: "#3899ec", shape: "circle" },
  },
  {
    name: "edX",
    text: "edX",
    size: "1.08rem",
    weight: 700,
    italic: true,
    box: { bg: "#02262b", color: "#fff", radius: 4, padding: "3px 12px" },
  },
  {
    name: "Zoom-integrated online classes",
    text: "zoom",
    color: "#0b5cff",
    size: "1.2rem",
    weight: 800,
  },
  // Not brands: generic labels in the service data. Neutral treatments
  // in the site's own ink and indigo, so they read as labels rather
  // than claiming a company's colours.
  {
    name: "eCampus",
    text: [
      { text: "e", color: "#4f46e5" },
      { text: "Campus", color: "#1a1a2e" },
    ],
    size: "1.08rem",
    weight: 800,
  },
  {
    name: "Self-paced learning platforms",
    text: "Self-Paced",
    color: "#1a1a2e",
    size: ".95rem",
    weight: 800,
    sub: { text: "Learning", color: "#4f46e5" },
  },
];

/** Renders a ServiceMark with the homepage grid's `.pl-mark` markup. */
function ServiceMarkLogo({ mark }: { mark: ServiceMark }) {
  const outer: CSSProperties = {
    color: mark.box?.color ?? mark.color,
    fontWeight: mark.weight,
    fontSize: mark.size,
    ...(mark.italic && { fontStyle: "italic" }),
    ...(mark.letterSpacing && { letterSpacing: mark.letterSpacing }),
    ...(mark.box && {
      background: mark.box.bg,
      borderRadius: mark.box.radius,
      padding: mark.box.padding,
    }),
  };

  const word =
    typeof mark.text === "string"
      ? mark.text
      : mark.text.map((seg) => (
          <span
            key={seg.text}
            style={{
              color: seg.color,
              ...(seg.weight && { fontWeight: seg.weight }),
              // Flex items drop the whitespace between them, so a word
              // gap is a margin.
              ...(seg.space && { marginLeft: ".28em" }),
            }}
          >
            {seg.text}
          </span>
        ));

  // The stacked marks are taller, so their badge is a step larger to
  // stay in proportion; single-line marks use Pearson's 20px badge.
  const badgeSize = mark.sub ? 24 : 20;

  return (
    <span className="pl-mark" style={outer}>
      {mark.badge && (
        <span
          style={{
            background: mark.badge.bg,
            color: "#fff",
            borderRadius: mark.badge.shape === "circle" ? "50%" : 4,
            width: badgeSize,
            height: badgeSize,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: mark.badge.text.length > 1 ? ".7rem" : ".8rem",
            fontStyle: "normal",
            letterSpacing: 0,
            marginRight: mark.sub ? 6 : 5,
          }}
        >
          {mark.badge.text}
        </span>
      )}
      {mark.sub ? (
        <span
          style={{
            display: "inline-flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          <span>{word}</span>
          <span
            style={{
              color: mark.sub.color,
              fontSize: ".6em",
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              marginTop: 3,
            }}
          >
            {mark.sub.text}
          </span>
        </span>
      ) : (
        word
      )}
    </span>
  );
}

// Fill gaps only: a platform the homepage already has a mark for keeps it.
for (const mark of SERVICE_MARKS) {
  const key = mark.name.toLowerCase();
  if (byName.has(key)) continue;
  byName.set(key, <ServiceMarkLogo mark={mark} />);
}

/**
 * Service pages name some platforms more specifically than the homepage
 * does. These point a specific product at its existing parent-brand
 * mark rather than inventing a new one.
 */
const ALIASES: Record<string, string> = {
  "pearson mylab": "pearson",
  "pearson mymathlab": "pearson",
  // Same Pearson products the homepage card tags "MyLab & Mastering".
  "pearson mylab & mastering": "pearson",
  "pearson mylab finance": "pearson",
  // Blackboard Learn and Canvas LMS are those brands' own LMS names.
  "blackboard learn": "blackboard",
  "canvas lms": "canvas",
  // The homepage Cengage card is tagged "MindTap".
  "cengage mindtap": "cengage",
  // The service data spells McGraw Hill three ways; all are the same
  // brand and share one mark.
  "mcgraw-hill connect": "mcgraw hill connect",
  "mcgraw hill": "mcgraw hill connect",
  "brightspace (d2l)": "d2l brightspace",
  d2l: "d2l brightspace",
  wiley: "wileyplus",
  "wiley plus": "wileyplus",
};

/**
 * Returns the mark for a platform, or null when the project has none.
 * Callers fall back to a neutral placeholder icon.
 */
export function getPlatformLogo(name: string): ReactNode | null {
  const key = name.trim().toLowerCase();
  return byName.get(key) ?? byName.get(ALIASES[key] ?? "") ?? null;
}

/** Platforms currently without a mark in the project. */
export function platformsMissingLogos(names: string[]): string[] {
  return names.filter((n) => getPlatformLogo(n) === null);
}
