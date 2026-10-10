import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Mail, MessageCircle, MessageSquare, Globe } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import {
  LEGAL_PAGES,
  getLegalPage,
  LEGAL_KEYWORDS,
  LEGAL_TITLES,
  type LegalSection,
} from "@/constants/legal";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/constants/seo";
import { SITE } from "@/constants/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return LEGAL_PAGES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) return {};
  // Exact <title> from the old HTML where one exists.
  const title = LEGAL_TITLES[page.slug] ?? `${page.title} ${page.accent}`;
  // The original page's og:/twitter: description differed from its meta
  // description, so both are carried rather than one reused for the other.
  const social = page.ogDescription ?? page.summary;
  return {
    title: { absolute: title },
    description: page.summary,
    // Keywords carried over from the old HTML legal pages.
    keywords: LEGAL_KEYWORDS[page.slug],
    alternates: { canonical: `/legal/${page.slug}` },
    openGraph: {
      ...OG_DEFAULTS,
      type: "website",
      locale: "en_US",
      siteName: "MyOnlineClassPro",
      title,
      description: social,
      url: `/legal/${page.slug}`,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      card: "summary_large_image",
      site: "@MyOnlineClassPro",
      title,
      description: page.twitterDescription ?? social,
    },
  };
}

/**
 * Renders `[label](/path)` inside policy text as a real link, so a clause
 * can point at another policy without the copy being split across fields.
 * Anything that isn't a link is returned untouched.
 */
const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;
const linkClass =
  "text-gold font-semibold underline underline-offset-2 hover:no-underline";

function withLinks(text: string): ReactNode {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const at = m.index ?? 0;
    if (at > last) parts.push(text.slice(last, at));
    const href = m[2];
    // Off-site links open in a new tab, and next/link shouldn't route
    // them. The current policy text links only to on-site pages.
    parts.push(
      href.startsWith("http") ? (
        <a
          key={`${href}-${at}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          {m[1]}
        </a>
      ) : (
        <Link key={`${href}-${at}`} href={href} className={linkClass}>
          {m[1]}
        </Link>
      ),
    );
    last = at + m[0].length;
  }
  if (!parts.length) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

const cardClass =
  "border-border bg-bg-2 rounded-lg border p-6 sm:p-8 scroll-mt-28";
const proseClass = "text-text-secondary text-sm leading-relaxed";

/** Contact channels, read live from SITE rather than stored as content. */
function ContactChannels() {
  const channels = [
    {
      icon: Mail,
      label: "Email",
      value: SITE.email,
      href: `mailto:${SITE.email}`,
      external: false,
    },
    {
      icon: MessageSquare,
      label: "Text",
      value: SITE.textNumber,
      href: SITE.smsHref,
      external: false,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: SITE.whatsapp,
      href: SITE.whatsappHref,
      external: true,
    },
    {
      icon: Globe,
      label: "Website",
      value: SITE.url.replace(/^https?:\/\//, ""),
      href: "/",
      external: false,
    },
  ];

  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {channels.map(({ icon: Icon, label, value, href, external }) => (
        <li key={label}>
          <a
            href={href}
            {...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="border-border bg-bg-1 text-text-secondary hover:border-gold/40 hover:text-gold flex items-center gap-3 rounded-md border px-4 py-3 text-sm break-words transition-colors"
          >
            <Icon size={18} className="text-gold shrink-0" aria-hidden />
            <span>
              <span className="text-text-muted block text-[0.7rem] font-semibold tracking-wider uppercase">
                {label}
              </span>
              {value}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function Callout({
  callout,
}: {
  callout: NonNullable<LegalSection["callout"]>;
}) {
  return (
    <div className="border-gold/30 bg-gold-soft mt-6 rounded-md border p-4 sm:p-5">
      <p className={proseClass}>
        <strong className="text-text-primary font-bold">
          {`${callout.label}:`}
        </strong>{" "}
        {withLinks(callout.body)}
      </p>
    </div>
  );
}

function SectionBody({ section }: { section: LegalSection }) {
  // The callout normally closes the section, but some originals placed
  // it part-way through the clause list.
  const splitAt = section.calloutAfterClause;
  const clauses = section.clauses ?? [];
  const inlineCallout =
    section.callout && splitAt != null && splitAt < clauses.length;

  return (
    <>
      {section.intro && (
        <p className={`${proseClass} mt-3`}>{withLinks(section.intro)}</p>
      )}

      {section.body && (
        <p className={`${proseClass} mt-3`}>{withLinks(section.body)}</p>
      )}

      {clauses.length > 0 && (
        <div className="mt-5 flex flex-col gap-5">
          {clauses.map((clause, i) => (
            <div key={clause.label}>
              <div className="border-gold/40 border-l-2 pl-4 sm:pl-5">
                <p className="text-gold text-[0.7rem] font-bold tracking-wider uppercase">
                  {clause.label}
                </p>
                <p className={`${proseClass} mt-1.5`}>
                  {withLinks(clause.body)}
                </p>
              </div>
              {inlineCallout && i + 1 === splitAt && section.callout && (
                <Callout callout={section.callout} />
              )}
            </div>
          ))}
        </div>
      )}

      {section.bullets && (
        <ul className="mt-5 flex flex-col gap-3">
          {section.bullets.map((point) => (
            <li key={point} className={`${proseClass} flex gap-3`}>
              <span
                className="bg-gold mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                aria-hidden
              />
              <span>{withLinks(point)}</span>
            </li>
          ))}
        </ul>
      )}

      {section.items && (
        <ol className="mt-5 flex flex-col gap-4">
          {section.items.map((item, i) => (
            <li key={item} className={`${proseClass} flex gap-4`}>
              <span
                className="border-border bg-bg-1 text-gold flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold"
                aria-hidden
              >
                {i + 1}
              </span>
              <span className="pt-1">{withLinks(item)}</span>
            </li>
          ))}
        </ol>
      )}

      {section.table && (
        // Scrolls rather than squashing the rate card on a phone.
        <div className="border-border mt-6 overflow-x-auto rounded-md border">
          <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-bg-1">
                {section.table.columns.map((c) => (
                  <th
                    key={c}
                    scope="col"
                    className="text-text-muted border-border border-b px-4 py-3 text-[0.7rem] font-bold tracking-wider uppercase"
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr
                  key={row[0]}
                  className="border-border border-b last:border-0"
                >
                  {row.map((cell, i) => (
                    <td
                      key={cell + i}
                      className={
                        i === 0
                          ? "text-text-primary px-4 py-3 font-semibold"
                          : i === 1
                            ? "text-gold px-4 py-3 font-bold whitespace-nowrap"
                            : "text-text-secondary px-4 py-3"
                      }
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.contactChannels && <ContactChannels />}

      {section.footnote && (
        <p className={`${proseClass} mt-5`}>{withLinks(section.footnote)}</p>
      )}

      {section.callout && !inlineCallout && (
        <Callout callout={section.callout} />
      )}
    </>
  );
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  // Only policies whose sections carry anchors get the contents list and
  // the wider two-column layout; the summary pages render as before.
  const toc = page.sections.filter((s) => s.id);
  const hasToc = toc.length > 0;
  // The original's JSON-LD spelled the name out and used its own
  // description; both fall back to the visible heading and summary.
  const schemaName = page.schemaName ?? `${page.title} ${page.accent}`;

  return (
    <>
      <PageSchema
        path={`/legal/${slug}`}
        title={schemaName}
        description={page.schemaDescription ?? page.summary}
        breadcrumbs={[
          {
            name: page.breadcrumbName ?? schemaName,
            path: `/legal/${slug}`,
          },
        ]}
      />
      <section
        className={`mx-auto w-full px-4 py-16 sm:px-6 lg:px-8 ${
          hasToc ? "max-w-6xl" : "max-w-3xl"
        }`}
      >
        <Reveal>
          {page.eyebrow && <span className="eyebrow-blue">{page.eyebrow}</span>}
          <h1 className="page-h text-text-primary">
            {page.title} <span className="text-gold">{page.accent}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-text-secondary mt-4">
            {page.lead ?? page.summary}
          </p>
        </Reveal>

        {page.meta && (
          <Reveal delay={0.12}>
            <ul className="mt-6 flex flex-wrap gap-2">
              {page.meta.map((m) => (
                <li
                  key={m.label}
                  className="border-border bg-bg-2 text-text-secondary rounded-full border px-4 py-1.5 text-xs"
                >
                  <span className="text-text-muted font-semibold">
                    {`${m.label}:`}
                  </span>{" "}
                  {m.value}
                </li>
              ))}
              {/* Support address comes from the site config, not the page copy. */}
              <li className="border-border bg-bg-2 text-text-secondary rounded-full border px-4 py-1.5 text-xs">
                <span className="text-text-muted font-semibold">
                  Questions:
                </span>{" "}
                <a href={`mailto:${SITE.email}`} className="hover:text-gold">
                  {SITE.email}
                </a>
              </li>
            </ul>
          </Reveal>
        )}

        <div
          className={
            hasToc ? "mt-12 grid gap-10 lg:grid-cols-[240px_1fr]" : "mt-12"
          }
        >
          {hasToc && (
            <Reveal className="lg:sticky lg:top-24 lg:self-start">
              <nav aria-label="Table of Contents">
                <h2 className="text-text-muted text-[0.7rem] font-bold tracking-wider uppercase">
                  Contents
                </h2>
                {/* Pills while the list sits above the content, a plain
                    vertical list once it becomes the sticky sidebar. */}
                <ol className="mt-4 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
                  {toc.map((s, i) => (
                    <li key={s.id}>
                      <a
                        href={`#${s.id}`}
                        className="border-border bg-bg-2 text-text-secondary hover:border-gold/40 hover:text-gold hover:bg-gold-soft flex items-baseline gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors lg:gap-2.5 lg:rounded-md lg:border-transparent lg:bg-transparent lg:px-2.5 lg:py-2 lg:text-sm"
                      >
                        <span className="text-gold text-xs font-bold">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.tocLabel ?? s.heading}
                      </a>
                    </li>
                  ))}
                </ol>
                {/* The original closed its contents list with this CTA. */}
                {page.cta && (
                  <Link
                    href="/place-order"
                    className="btn-primary mt-5 hidden h-10 w-full items-center justify-center rounded-full px-4 text-sm font-semibold lg:inline-flex"
                  >
                    Place Your Order
                  </Link>
                )}
              </nav>
            </Reveal>
          )}

          <div className="flex min-w-0 flex-col gap-6">
            {page.intro && (
              <Reveal>
                <p className={proseClass}>{withLinks(page.intro)}</p>
              </Reveal>
            )}

            {page.sections.map((section, i) => (
              <Reveal key={section.heading} delay={hasToc ? 0 : 0.05 * i}>
                <article
                  id={section.id}
                  className={hasToc ? cardClass : undefined}
                >
                  {section.label && (
                    <p className="text-text-muted text-[0.7rem] font-bold tracking-wider uppercase">
                      {section.label}
                    </p>
                  )}
                  <h2
                    className={`card-h text-text-primary ${
                      section.label ? "mt-1.5" : ""
                    }`}
                  >
                    {section.heading}
                  </h2>
                  <SectionBody section={section} />
                </article>
              </Reveal>
            ))}

            {page.cta && (
              <Reveal>
                <div className="border-gold/30 bg-bg-2 mt-4 rounded-lg border p-8 text-center">
                  <h2 className="section-h text-text-primary">
                    {page.cta.heading}
                  </h2>
                  <p className={`${proseClass} mx-auto mt-3 max-w-xl`}>
                    {page.cta.body}
                  </p>
                  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                    <Link
                      href="/place-order"
                      className="btn-primary inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold"
                    >
                      Place Your Order
                    </Link>
                    <a
                      href={SITE.whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-border-strong text-text-primary hover:border-gold/50 hover:text-gold inline-flex h-11 items-center justify-center gap-2 rounded-full border px-6 text-sm font-semibold transition-colors"
                    >
                      <MessageCircle size={16} aria-hidden />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
