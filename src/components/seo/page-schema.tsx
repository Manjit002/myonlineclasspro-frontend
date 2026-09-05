/**
 * Page-level JSON-LD, emitted as one @graph per page.
 *
 * The old site shipped up to seven separate <script> blocks per page.
 * A single graph avoids duplicate Organization/WebSite nodes while
 * keeping every entity, and lets nodes reference each other by @id.
 *
 * Two old schema types are deliberately not carried over — see the
 * notes on SpeakableSpecification and aggregateRating below.
 */

const ORIGIN = "https://myonlineclasspro.com";
const ORG_ID = `${ORIGIN}/#organization`;
const SITE_ID = `${ORIGIN}/#website`;

export interface FaqEntry {
  q: string;
  a: string;
}

export interface Crumb {
  name: string;
  path: string;
}

interface PageSchemaInput {
  /** Path with leading slash, e.g. "/take-my-math-class". */
  path: string;
  title: string;
  description: string;
  /** Home -> … trail. Home is prepended automatically. */
  breadcrumbs?: Crumb[];
  /** Only pass FAQs that are actually rendered on the page. */
  faqs?: FaqEntry[];
  /** Set for service pages: the subject offered. */
  serviceName?: string;
  type?: "WebPage" | "CollectionPage" | "AboutPage" | "ContactPage";
}

export function buildPageSchema({
  path,
  title,
  description,
  breadcrumbs = [],
  faqs,
  serviceName,
  type = "WebPage",
}: PageSchemaInput) {
  const url = `${ORIGIN}${path === "/" ? "/" : path}`;
  // Organization and WebSite are emitted once globally by
  // StructuredData in the root layout. Repeating them here would give
  // every page duplicate nodes, so this graph references them by @id
  // instead — valid JSON-LD, and no duplication.
  const graph: Record<string, unknown>[] = [];

  graph.push({
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { "@id": SITE_ID },
    about: { "@id": ORG_ID },
    inLanguage: "en-US",
  });

  // Home is always the first crumb; URLs are the real canonicals, never
  // the old .html filenames.
  const trail: Crumb[] = [{ name: "Home", path: "/" }, ...breadcrumbs];
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${url}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${ORIGIN}${c.path === "/" ? "/" : c.path}`,
    })),
  });

  // Emitted only when the caller passes the FAQs it actually renders,
  // so the schema can never describe questions a visitor cannot see.
  if (faqs?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${url}#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  if (serviceName) {
    // Service, not Product: this is a tutoring service, not a good with
    // a SKU. No `offers` or `aggregateRating` — the page shows neither a
    // fixed price for the subject nor collected ratings, and inventing
    // them would contradict the visible page.
    graph.push({
      "@type": "Service",
      "@id": `${url}#service`,
      name: serviceName,
      serviceType: "Academic tutoring and coursework support",
      description,
      provider: { "@id": ORG_ID },
      areaServed: { "@type": "Country", name: "United States" },
      url,
    });
  }

  return { "@context": "https://schema.org", "@graph": graph };
}

/** Server-rendered so crawlers see it without executing JavaScript. */
export function PageSchema(input: PageSchemaInput) {
  return (
    <script
      type="application/ld+json"
      // Content is built from our own constants, not user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildPageSchema(input)),
      }}
    />
  );
}
