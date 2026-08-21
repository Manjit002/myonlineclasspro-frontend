import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { OrderForm } from "@/components/sections/order-form";
import { FaqSection } from "@/components/sections/faq-section";
import { SERVICES, getService } from "@/constants/services";
import { SERVICE_DETAILS } from "@/constants/service-details";
import {
  ServiceCourseAreas,
  ServiceCoursework,
  ServicePlatforms,
  RelatedServices,
  ServiceIntegrityNote,
} from "@/components/services/service-sections";

/**
 * Any slug outside generateStaticParams is a real 404, not a
 * render-on-demand miss.
 *
 * Without this, a root-level [slug] route swallows every unknown path
 * and Next.js serves it with a 200 status -- a "soft 404". Search
 * engines treat those as valid thin pages rather than removing them,
 * which is actively harmful for SEO. Since the valid service slugs are
 * a known, finite set, opting out of dynamic params is both the correct
 * behaviour and cheaper (no runtime rendering attempt for junk URLs).
 */
export const dynamicParams = false;

/**
 * Pre-renders all 12 service routes at build time. Because the content
 * comes from a typed data module, adding a service is a data change --
 * no new page file, no layout drift between services.
 */
export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  // Each service carries its own title and description — no shared
  // boilerplate across the twelve pages.
  const detail = SERVICE_DETAILS[slug];
  const title = detail?.metaTitle ?? `${service.title} ${service.accent}`;
  const description = detail?.metaDescription ?? service.intro;
  return {
    title,
    description,
    keywords: detail ? detail.courseAreas.slice(0, 6) : undefined,
    alternates: { canonical: `/${service.slug}` },
    openGraph: { title, description, url: `/${service.slug}` },
    twitter: { title, description },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  const detail = SERVICE_DETAILS[slug];

  return (
    <>
      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pt-20">
        <div>
          <Reveal>
            <h1 className="font-display text-text-primary text-4xl leading-[1.05] tracking-wide sm:text-5xl lg:text-6xl">
              {service.title}{" "}
              <span className="text-gold">{service.accent}</span>
            </h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-text-secondary mt-6 max-w-xl text-base leading-relaxed">
              {detail?.heroLead ?? service.intro}
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <ul className="mt-8 grid gap-2 sm:grid-cols-2">
              {service.topics.map((topic) => (
                <li
                  key={topic}
                  className="text-text-secondary flex items-start gap-2 text-sm"
                >
                  <Check
                    size={16}
                    className="text-gold mt-0.5 shrink-0"
                    aria-hidden
                  />
                  {topic}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <OrderForm />
        </Reveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="font-display text-text-primary text-center text-3xl tracking-wide sm:text-4xl">
            What We <span className="text-gold">Cover</span>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {service.topics.map((topic, i) => (
            <Reveal key={topic} delay={0.05 * i}>
              <Card className="h-full">
                <CardTitle className="text-lg">{topic}</CardTitle>
                <CardDescription>
                  Expert guidance and full coursework support in this area.
                </CardDescription>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="border-border bg-bg-1 rounded-lg border px-6 py-14 text-center">
            <h2 className="font-display text-text-primary text-3xl tracking-wide sm:text-4xl">
              Need help with {service.accent.toLowerCase()}?
            </h2>
            <p className="text-text-secondary mx-auto mt-3 max-w-xl">
              Share your course details and we&apos;ll assign a verified expert.
            </p>
            <Link href="/place-order" className="mt-8 inline-block">
              <Button size="lg">Place your order</Button>
            </Link>
          </div>
        </Reveal>
      </section>
      {detail && (
        <div className="site-container svc-wrap">
          <ServiceCourseAreas
            areas={detail.courseAreas}
            subject={service.accent.replace(/ Class$/, "")}
          />
          <ServiceCoursework items={detail.coursework} />
          <ServicePlatforms platforms={detail.platforms} />

          <RelatedServices slugs={detail.related} />
          <ServiceIntegrityNote />
        </div>
      )}
      {detail && (
        <FaqSection
          items={detail.faqs}
          titleLead="Frequently Asked"
          titleAccent="Questions"
        />
      )}
    </>
  );
}
