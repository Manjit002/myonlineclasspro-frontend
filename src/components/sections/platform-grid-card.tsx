import type { PlatformGridItem } from "@/constants/platform-grid";

/**
 * Platform card for the coverage grid.
 *
 * Keeps the site's existing card language (rounded surface, border,
 * hover lift and gold border on hover) and adds the white logo plate
 * the marks need — several are dark-on-transparent and would be
 * unreadable directly on a dark card.
 */
export function PlatformGridCard({ item }: { item: PlatformGridItem }) {
  return (
    <div className="platform-grid-card">
      <div className="pl-plate">{item.logo}</div>
      <div className="pl-name">{item.name}</div>
      <div className="pl-tag">{item.tag}</div>
    </div>
  );
}
