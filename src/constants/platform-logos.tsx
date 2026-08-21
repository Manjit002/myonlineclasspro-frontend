import type { ReactNode } from "react";
import { PLATFORM_ITEMS } from "@/constants/platform-items";
import { PLATFORM_GRID } from "@/constants/platform-grid";

/**
 * One source of truth for platform logos.
 *
 * The homepage already carries real brand artwork in two places: the
 * marquee (PLATFORM_ITEMS) and the platforms grid (PLATFORM_GRID).
 * Rather than duplicating or re-drawing those marks for the service
 * pages, this builds a lookup over both, so a logo change on the
 * homepage flows through here automatically.
 *
 * The grid is preferred as the primary source because it covers more
 * brands and its marks are self-contained (no external files that can
 * 404); the marquee fills the gaps.
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

/**
 * Service pages name some platforms more specifically than the homepage
 * does. These point a specific product at its existing parent-brand
 * mark rather than inventing a new one.
 */
const ALIASES: Record<string, string> = {
  "pearson mylab": "pearson",
  "pearson mymathlab": "pearson",
  "brightspace (d2l)": "d2l brightspace",
  d2l: "d2l brightspace",
  wiley: "wileyplus",
  "wiley plus": "wileyplus",
};

/**
 * Returns the existing brand mark for a platform, or null when the
 * project has no asset for it.
 *
 * Deliberately returns null rather than a substitute: inventing a mark
 * for a brand we have no artwork for would misrepresent it. Callers
 * fall back to a neutral placeholder.
 */
export function getPlatformLogo(name: string): ReactNode | null {
  const key = name.trim().toLowerCase();
  return byName.get(key) ?? byName.get(ALIASES[key] ?? "") ?? null;
}

/** Platforms currently without artwork in the project. */
export function platformsMissingLogos(names: string[]): string[] {
  return names.filter((n) => getPlatformLogo(n) === null);
}
