import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/reveal";
import {
  LEGAL_PAGES,
  getLegalPage,
  LEGAL_KEYWORDS,
  LEGAL_TITLES,
} from "@/constants/legal";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/constants/seo";

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
      description: page.summary,
      url: `/legal/${page.slug}`,
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      card: "summary_large_image",
      site: "@MyOnlineClassPro",
      title,
      description: page.summary,
    },
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <>
      <PageSchema
        path={`/legal/${slug}`}
        title={`${page.title} ${page.accent}`}
        description={page.summary}
        breadcrumbs={[
          { name: `${page.title} ${page.accent}`, path: `/legal/${slug}` },
        ]}
      />
      <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h1 className="page-h text-text-primary">
            {page.title} <span className="text-gold">{page.accent}</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-text-secondary mt-4">{page.summary}</p>
        </Reveal>

        <div className="mt-12 flex flex-col gap-8">
          {page.sections.map((section, i) => (
            <Reveal key={section.heading} delay={0.05 * i}>
              <article>
                <h2 className="card-h text-text-primary">{section.heading}</h2>
                <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                  {section.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
