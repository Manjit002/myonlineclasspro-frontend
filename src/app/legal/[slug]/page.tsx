import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/ui/reveal";
import { LEGAL_PAGES, getLegalPage } from "@/constants/legal";

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
  const title = `${page.title} ${page.accent}`;
  return {
    title,
    description: page.summary,
    alternates: { canonical: `/legal/${page.slug}` },
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
    <section className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-display text-text-primary text-4xl tracking-wide sm:text-5xl">
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
              <h2 className="font-display text-text-primary text-xl tracking-wide">
                {section.heading}
              </h2>
              <p className="text-text-secondary mt-2 text-sm leading-relaxed">
                {section.body}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
