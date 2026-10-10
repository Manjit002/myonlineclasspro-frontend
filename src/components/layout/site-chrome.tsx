"use client";

import { usePathname } from "next/navigation";

/**
 * Gates the public marketing chrome — navbar, spacer, footer and the
 * floating contact widgets — off the dashboard.
 *
 * The dashboard is an application shell with its own sidebar and top
 * bar; the site navbar sat above it (pushing the sidebar down by the
 * navbar's height) and the 1072px marketing footer hung below it,
 * which is why a dashboard page scrolled well past the viewport.
 *
 * Implemented as a pathname gate rather than by moving every public
 * route into a route group: the grouping is the tidier long-term
 * shape, but it means relocating ~14 route directories, and the brief
 * is explicit about not touching routing.
 */
function isDashboard(pathname: string | null) {
  return Boolean(pathname && pathname.startsWith("/dashboard"));
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isDashboard(pathname)) return null;
  return <>{children}</>;
}
