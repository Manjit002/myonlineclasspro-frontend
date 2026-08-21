import { SITE } from "@/constants/site";

/**
 * JSON-LD for the organisation and site search. Rendered as a plain
 * script tag rather than next/script so it's present in the initial
 * server HTML, which is what crawlers read.
 */
export function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#organization`,
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        telephone: SITE.phone,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        publisher: { "@id": `${SITE.url}/#organization` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // Content is fully static and locally authored -- no user input
      // reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
