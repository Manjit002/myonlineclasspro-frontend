import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { OrderForm } from "@/components/sections/order-form";
import { FaqSection } from "@/components/sections/faq-section";
import { SERVICES, getService } from "@/constants/services";
import { SERVICE_DETAILS } from "@/constants/service-details";
import { PageSchema } from "@/components/seo/page-schema";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/constants/seo";
import { HeroIntro } from "@/components/sections/hero-intro";
import {
  ServiceCourseAreas,
  ServiceSubjectAreas,
  ServiceCoursework,
  ServicePlatforms,
  RelatedServices,
  ServiceIntegrityNote,
  ServiceChallenges,
  ServiceOverview,
  ServiceCaseStudy,
  ServiceHelpOverview,
  ServiceAudiences,
  ServiceBreakdown,
  ServiceCrossSubject,
  ServiceIntegrity,
  ServicePopularCourses,
  ServiceFeatures,
  ServiceProcess,
  ServiceStats,
  ServiceTestimonials,
  ServicePricing,
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
    /* absolute, not the layout template: these are the exact <title>
       values from the old HTML and already carry their own suffix, so
       the template's "| MyOnlineClassPro" would double it. */
    title: { absolute: title },
    description,
    keywords: detail ? detail.courseAreas.slice(0, 6) : undefined,
    alternates: { canonical: `/${service.slug}` },
    openGraph: {
      ...OG_DEFAULTS,
      type: "website",
      locale: "en_US",
      siteName: "MyOnlineClassPro",
      title,
      description,
      url: `/${service.slug}`,
      // The old service pages all used the site logo as their OG image.
      images: [
        {
          url: "https://img.myonlineclasspro.com/photos/my%20online%20class%20pro%20png%204.png",
          width: 1200,
          height: 630,
          alt: "MyOnlineClassPro",
        },
      ],
    },
    twitter: {
      ...TWITTER_DEFAULTS,
      title,
      description,
      card: "summary_large_image",
      // Page-level twitter replaces the layout default wholesale.
      site: "@MyOnlineClassPro",
      images: [
        "https://img.myonlineclasspro.com/photos/my%20online%20class%20pro%20png%204.png",
      ],
    },
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
      {/* FAQs passed here are the same array the page renders below, so
          the schema can never describe a question a visitor can't see. */}
      <PageSchema
        path={`/${service.slug}`}
        title={
          detail?.metaTitle ??
          `${detail?.heroLeading ?? service.title} ${detail?.heroAccent ?? service.accent}`
        }
        description={detail?.metaDescription ?? service.intro}
        breadcrumbs={[{ name: service.label, path: `/${service.slug}` }]}
        faqs={detail?.faqs}
        serviceName={`${service.accent} Help`}
      />
      {/* Same hero system as the landing page: shared HeroIntro on the
          left (cards, stats and the lg:items-stretch equal-height
          behaviour all come from there), shared OrderForm on the right.
          Only the H1 and the lead are subject-specific. */}
      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 pt-12 pb-16 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-8 lg:pt-20">
        <HeroIntro
          leading={detail?.heroLeading ?? service.title}
          accent={detail?.heroAccent ?? service.accent}
          lead={detail?.heroLead ?? service.intro}
        />

        <Reveal delay={0.1}>
          <OrderForm />
        </Reveal>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="section-h text-text-primary">
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

      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="border-border bg-bg-1 rounded-lg border px-6 py-14 text-center">
            <h2 className="section-h text-text-primary">
              Need help with {service.accent.toLowerCase()}?
            </h2>
            {detail?.closingBody ? (
              <div className="svc-closing mx-auto mt-3 max-w-xl">
                {detail.closingBody.map((p) => (
                  <p key={p.slice(0, 40)} className="text-text-secondary">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary mx-auto mt-3 max-w-xl">
                Share your course details and we&apos;ll assign a verified
                expert.
              </p>
            )}
            <Link href="/place-order" className="mt-8 inline-block">
              <Button size="lg">Place your order</Button>
            </Link>
          </div>
        </Reveal>
      </section>
      {detail && (
        <div className="site-container svc-wrap">
          {/* Each block renders only when the service supplies its data,
              so pages without the richer content are unchanged. */}
          {detail.overview && <ServiceOverview paragraphs={detail.overview} />}
          {detail.challenges && (
            <ServiceChallenges
              items={detail.challenges}
              subject={service.accent.replace(/ Class$/, "")}
              intro={detail.challengesIntro}
            />
          )}
          {detail.caseStudyDetail && (
            <ServiceCaseStudy
              title={detail.caseStudyDetail.title}
              body={detail.caseStudyDetail.body}
              points={detail.caseStudyDetail.points}
            />
          )}
          {/* Richer code-badged cards replace the plain grid when a
              service supplies subjectAreas, rather than showing the
              same subjects twice in two formats. */}
          {detail.subjectAreas ? (
            <ServiceSubjectAreas
              areas={detail.subjectAreas}
              title={
                detail.courseAreasTitle ??
                `${service.accent.replace(/ Class$/, "")} Areas We Support`
              }
            />
          ) : (
            <ServiceCourseAreas
              areas={detail.courseAreas}
              subject={service.accent.replace(/ Class$/, "")}
              title={detail.courseAreasTitle}
            />
          )}
          {detail.popularCourses && (
            <ServicePopularCourses
              courses={detail.popularCourses}
              title={detail.popularCoursesTitle}
            />
          )}
          <ServiceCoursework items={detail.coursework} />
          {detail.breakdown && (
            <ServiceBreakdown
              title={detail.breakdown.title}
              intro={detail.breakdown.intro}
              items={detail.breakdown.items}
            />
          )}
          {detail.helpOverview && (
            <ServiceHelpOverview
              title={detail.helpOverview.title}
              body={detail.helpOverview.body}
              points={detail.helpOverview.points}
            />
          )}
          {detail.audiences && (
            <ServiceAudiences
              title={detail.audiences.title}
              items={detail.audiences.items}
            />
          )}
          {detail.features && (
            <ServiceFeatures
              items={detail.features}
              title={detail.featuresTitle}
            />
          )}
          {detail.process && (
            <ServiceProcess
              steps={detail.process}
              title={detail.processTitle}
            />
          )}
          {detail.stats && <ServiceStats stats={detail.stats} />}
          {detail.pricingTiers && detail.pricingFactors && (
            <ServicePricing
              tiers={detail.pricingTiers}
              factors={detail.pricingFactors}
            />
          )}
          {detail.testimonials && (
            <ServiceTestimonials
              items={detail.testimonials}
              title={detail.testimonialsTitle}
            />
          )}
          <ServicePlatforms platforms={detail.platforms} />
          {detail.integritySection && (
            <ServiceIntegrity
              title={detail.integritySection.title}
              body={detail.integritySection.body}
            />
          )}
          {detail.crossSubject && (
            <ServiceCrossSubject
              body={detail.crossSubject.body}
              links={detail.crossSubject.links}
            />
          )}

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
