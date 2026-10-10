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
    /* Two sitemaps: this app's own, plus the WordPress blog at /blog,
       which is a separate application with its own generator. Listing
       it here is the only link between them — nothing about the blog
       or either sitemap is generated or proxied by this project. */
    sitemap: [`${SITE.url}/sitemap.xml`, `${SITE.url}/blog/wp-sitemap.xml`],
  };
}
