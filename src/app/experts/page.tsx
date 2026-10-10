import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { ExpertMatcher } from "@/components/experts/expert-matcher";
import { ExpertDirectory } from "@/components/experts/expert-directory";
import { FaqSection } from "@/components/sections/faq-section";
import { EXPERT_FAQS, MATCH_STEPS, EXPERTS } from "@/constants/experts-data";
import { SITE } from "@/constants/site";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/constants/seo";

export const metadata: Metadata = {
  // Keywords carried over from the old page.
  keywords: [
    "online class experts",
    "tutoring experts",
    "subject matter experts",
    "meet our tutors",
    "academic experts",
  ],
  title: "Meet Our 500+ Vetted Academic Experts",
  description:
    "Meet the 500+ vetted academic experts behind MyOnlineClassPro - filterable by Accounting, Biology, Chemistry, Computer Science, Finance, Math, Nursing, and more.",
  alternates: { canonical: "/experts" },
  openGraph: {
    ...OG_DEFAULTS,
    title: "Meet Our 500+ Vetted Academic Experts | MyOnlineClassPro",
    description:
      "Every order is handled by a real subject-matter specialist. Browse and filter our vetted expert network.",
    url: "/experts",
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    // Page twitter replaces the layout default wholesale.
    site: "@MyOnlineClassPro",
    title: "Meet Our 500+ Vetted Academic Experts | MyOnlineClassPro",
    description:
      "Every order is handled by a real subject-matter specialist. Browse and filter our vetted expert network.",
  },
};

/** FAQPage + BreadcrumbList, carrying over the original page's schema. */
function ExpertsStructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        mainEntity: EXPERT_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE.url,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Experts",
            item: `${SITE.url}/experts`,
          },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function ExpertsPage() {
  return (
    <>
      <ExpertsStructuredData />

      {/* Hero + matcher */}
      <section className="exp-hero">
        <div className="site-container">
          <Reveal>
            <div className="exp-hero-badge">
              <span className="live-dot" aria-hidden />
              {EXPERTS.length}+ specialists listed
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="exp-h1">
              Meet the Experts Behind{" "}
              <span className="text-gold">10,000+ Student Success Stories</span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="exp-lead">
              Every order is handled by a real subject-matter specialist, not a
              generic writer. Answer two quick questions, and we&apos;ll
              instantly match you with the right expert.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <ExpertMatcher />
          </Reveal>
        </div>
      </section>

      {/* Browse all */}
      <section className="exp-browse" id="browse-experts">
        <div className="site-container">
          <Reveal>
            <h2 className="exp-h2">
              Browse <span className="text-gold">All Experts</span>
            </h2>
          </Reveal>
          <ExpertDirectory />
        </div>
      </section>

      {/* How we match */}
      <section className="exp-how">
        <div className="site-container">
          <Reveal>
            <h2 className="exp-h2">
              How We <span className="text-gold">Match You With an Expert</span>
            </h2>
          </Reveal>
          <ol className="exp-steps">
            {MATCH_STEPS.map((s, i) => (
              <Reveal key={s.title} delay={0.06 * i}>
                <li className="exp-step">
                  <span className="exp-step-n" aria-hidden>
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="exp-step-t">{s.title}</h3>
                    <p className="exp-step-b">{s.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section-premium">
        <div className="site-container">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="eyebrow-blue">FAQs</div>
            <h2 className="exp-h2">
              Questions About <span className="text-gold">Our Experts</span>
            </h2>
          </div>
          <FaqSection items={EXPERT_FAQS} heading={false} />
        </div>
      </section>

      {/* CTA */}
      <section className="exp-cta-section">
        <div className="site-container">
          <Reveal>
            <div className="exp-cta-card">
              <h2 className="exp-h2">
                Hire an <span className="text-gold">Expert Today</span>
              </h2>
              <p className="exp-lead">
                Tell us your subject and deadline — we&apos;ll match you in
                minutes.
              </p>
              <div className="exp-cta-row">
                <Link href="/place-order">
                  <Button size="lg">Place your order</Button>
                </Link>
                <a
                  className="wa-cta"
                  href={SITE.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
