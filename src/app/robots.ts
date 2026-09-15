import type { MetadataRoute } from "next";
import { SITE } from "@/constants/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      /* Private and authenticated areas: kept out of the index, and
         absent from the sitemap. The last three carry over the old
         site's robots.txt disallow rules. */
      disallow: [
        "/dashboard",
        "/dashboard/",
        "/login",
        "/signup",
        "/payment/",
        "/proxy.php",
        "/student/",
        "/admin/",
      ],
    },
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
