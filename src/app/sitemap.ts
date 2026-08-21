import type { MetadataRoute } from "next";
import { SERVICES } from "@/constants/services";
import { MAIN_LINKS, FOOTER_LEGAL_LINKS, SITE } from "@/constants/site";

/**
 * Generated from the same constants the nav and routes use, so the
 * sitemap can't drift out of sync with the actual pages the way a
 * hand-maintained XML file does.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/place-order", priority: 0.9 },
    ...MAIN_LINKS.map((l) => ({ path: l.href, priority: 0.7 })),
    ...FOOTER_LEGAL_LINKS.map((l) => ({ path: l.href, priority: 0.3 })),
  ];

  return [
    ...staticRoutes.map(({ path, priority }) => ({
      url: `${SITE.url}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority,
    })),
    ...SERVICES.map((s) => ({
      url: `${SITE.url}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
