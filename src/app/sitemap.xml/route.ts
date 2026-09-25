import { SITEMAP_ENTRIES } from "@/constants/sitemap-entries";

/**
 * /sitemap.xml — emitted as raw XML rather than through Next's
 * MetadataRoute sitemap convention.
 *
 * WHY A ROUTE HANDLER INSTEAD OF app/sitemap.ts:
 * MetadataRoute.Sitemap types `priority` as a number, so the supplied
 * values lose their trailing zeros on serialisation — 1.0000 emits as
 * "1", 0.9000 as "0.9", 0.5120 as "0.512". That silently rewrote 53 of
 * the 81 supplied values. Emitting the XML directly keeps every field
 * byte-identical to the SEO-approved source.
 *
 * Nothing here is generated, sorted or derived: the entries are
 * rendered in the order given, with the values exactly as given.
 */

// Static: the data is a fixed constant, so this is built once rather
// than recomputed per request.
export const dynamic = "force-static";

/** Minimal XML escaping. Applied defensively — the supplied URLs
 *  contain no reserved characters, but an ampersand in a future entry
 *  would otherwise produce invalid XML. */
function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET(): Response {
  const urls = SITEMAP_ENTRIES.map(
    ([loc, lastmod, priority, changefreq]) =>
      `  <url>\n` +
      `    <loc>${xmlEscape(loc)}</loc>\n` +
      `    <lastmod>${lastmod}</lastmod>\n` +
      `    <priority>${priority}</priority>\n` +
      `    <changefreq>${changefreq}</changefreq>\n` +
      `  </url>`,
  ).join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    `${urls}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
