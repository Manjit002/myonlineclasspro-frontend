import type { ReactNode } from "react";
import type { PlatformGridItem } from "@/constants/platform-grid";
import { cn } from "@/lib/utils";

/**
 * The white plate a platform mark sits on. Shared by the homepage
 * platforms grid and the service-page platform tiles so both present the
 * same brand marks the same way: fixed height, centred, never scaled.
 */
export function PlatformLogoPlate({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("pl-plate", className)}>{children}</div>;
}

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
      <PlatformLogoPlate>{item.logo}</PlatformLogoPlate>
      <div className="pl-name">{item.name}</div>
      <div className="pl-tag">{item.tag}</div>
    </div>
  );
}
