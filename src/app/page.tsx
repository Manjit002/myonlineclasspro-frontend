import { PageSchema } from "@/components/seo/page-schema";
import { FAQS } from "@/constants/faqs";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  UserCheck,
  Lock,
  FileCheck,
  Award,
  Headphones,
  EyeOff,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { OrderForm } from "@/components/sections/order-form";
import { HeroIntro } from "@/components/sections/hero-intro";
import { PlatformMarquee } from "@/components/sections/platform-marquee";
import { ExpertCarousel } from "@/components/sections/expert-carousel";
import { PricingCard } from "@/components/sections/pricing-card";
import { FlightJourney } from "@/components/sections/flight-journey";
import { FaqSection } from "@/components/sections/faq-section";
import { PlatformGridCard } from "@/components/sections/platform-grid-card";
import { PLATFORM_GRID } from "@/constants/platform-grid";

import { LogoMarquee } from "@/components/sections/logo-marquee";
import { GradeProof } from "@/components/sections/grade-proof";
import { UNIVERSITY_LOGOS } from "@/constants/images";
import { ReviewList } from "@/components/reviews/review-list";
import { SERVICES } from "@/constants/services";

import type { Metadata } from "next";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/constants/seo";

/**
 * Homepage metadata, defined here rather than inherited from the root
 * layout so the layout's defaults can never override it.
 *
 * Title, canonical, OG and Twitter values are carried from the old
 * homepage. The description is written to match what this page
 * actually says — see the note in the migration report about the
 * old "Grade B guaranteed" wording.
 */
export const metadata: Metadata = {
  title: {
    absolute: "Take My Online Class For Me | Expert Help | MyOnlineClassPro",
  },
  description:
    "Hire USA-based experts for help with your online class. Expert assigned in 10 minutes. 50,000+ students helped. Starting at $40/week.",
  keywords: [
    "take my online class",
    "online class help",
    "pay someone to take my online class",
    "hire someone for online class",
    "do my online class for me",
  ],
  alternates: { canonical: "https://myonlineclasspro.com/" },
  openGraph: {
    ...OG_DEFAULTS,
    type: "website",
    locale: "en_US",
    siteName: "MyOnlineClassPro",
    url: "https://myonlineclasspro.com/",
    title: "MyOnlineClassPro - Expert Help With Your Online Class",
    description:
      "Hire USA-based experts for help with your online class. Expert assigned in 10 minutes. 50,000+ students helped. Starting at $40/week.",
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
    card: "summary_large_image",
    site: "@MyOnlineClassPro",
    title: "MyOnlineClassPro - Expert Help With Your Online Class",
    description:
      "Hire USA-based experts for help with your online class. Expert assigned in 10 minutes. 50,000+ students helped. Starting at $40/week.",
    images: [
      "https://img.myonlineclasspro.com/photos/my%20online%20class%20pro%20png%204.png",
    ],
  },
};

import {
  PILLARS,
  TRUST_BADGES,
  TRUST_SECTION,
  TRUST_INDICATORS,
} from "@/constants/content";

// Stats carried over from the original hero. Each value is split into
// the number to count and the fixed text around it, so the animation
// lands on exactly "99.95%", "9/10", "18K+" and "4.9★".
const PILLAR_ICONS = [UserCheck, Sparkles, Clock, Lock, FileCheck, Award];
const TRUST_ICONS = [
  EyeOff,
  FileCheck,
  BadgeCheck,
  Lock,
  ShieldCheck,
  Headphones,
];

/** Shared heading block so every section below the hero is spaced identically. */
function SectionHeading({
  eyebrow,
  title,
  accent,
  lead,
}: {
  eyebrow?: string;
  title: string;
  accent?: string;
  lead?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      {eyebrow && (
        <Reveal>
          <span className="border-gold/30 bg-gold-soft text-gold inline-block rounded-full border px-4 py-1.5 text-xs font-bold tracking-widest uppercase">
            {eyebrow}
          </span>
        </Reveal>
      )}
      <Reveal delay={0.06}>
        <h2 className="section-h text-text-primary mt-5">
          {title} {accent && <span className="text-gold">{accent}</span>}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.12}>
          <p className="text-text-secondary mx-auto mt-4 max-w-2xl">{lead}</p>
        </Reveal>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <>
      {/* FAQPage uses the same FAQS array this page renders below. */}
      <PageSchema
        path="/"
        title="Take My Online Class For Me | Expert Help | MyOnlineClassPro"
        description="Expert help with online classes, coursework, assignments and exam preparation. Matched with a subject specialist, 50,000+ students supported."
        faqs={FAQS}
        serviceName="Online Class Help & Academic Support"
      />
      {/* ── Hero + order panel ──
          items-stretch (not items-start) from lg up so both columns share
          the row height; HeroIntro then spreads its own blocks to fill it,
          which aligns the bottom edges without adding blank space. Below
          lg the columns stack, so each row sizes to its own content. */}
      <section className="mx-auto grid max-w-7xl items-start gap-12 px-4 pt-12 pb-14 sm:px-6 lg:grid-cols-2 lg:items-stretch lg:gap-16 lg:px-8 lg:pt-20">
        <HeroIntro />

        <Reveal delay={0.1}>
          <OrderForm />
        </Reveal>
      </section>

      {/* ── Platform logo strip ── */}
      <section className="border-border bg-bg-1 border-y py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="section-h text-text-primary mb-8 text-center">
            10,000+ A Grades Delivered On{" "}
            <span className="text-gold">Learning Platforms</span>
          </p>
          <PlatformMarquee label="Supported learning platforms" />
        </div>
      </section>

      {/* ── Universities ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="section-h text-text-primary mb-8 text-center">
          50,000+ Students From{" "}
          <span className="text-gold">Top Universities</span> Trust Us
        </p>
        <LogoMarquee
          items={UNIVERSITY_LOGOS}
          label="Universities our students attend"
        />
      </section>

      {/* ── Verified grade results ── */}
      <section className="border-border bg-bg-1 border-y py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Verified Real Student Results"
            title="Real Grades,"
            accent="Real Screenshots"
            lead="Actual gradebook results from courses we have completed. Select any screenshot to view it full size."
          />
          <div className="mt-14">
            <GradeProof />
          </div>
        </div>
      </section>

      {/* ── Get Expert Academic Help ── */}
      <section className="expert-section">
        <div className="site-container">
          <div className="expert-head">
            <h2 className="expert-h2">
              Get <span className="gold">Expert</span> Academic Help
            </h2>
            <p className="expert-desc">
              Balancing a job, family, and a relentless syllabus leads to severe
              burnout. When midnight deadlines approach and your GPA is on the
              line, you need reliable academic support for students. We provide
              comprehensive online academic help designed to rescue your
              semester. From daily homework help to advanced online tutoring
              services, our experts step in to manage your workload, eliminate
              your stress, and guarantee the top-tier grades your future career
              demands.
            </p>
          </div>
          <ExpertCarousel />
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <SectionHeading title="The Pillars of Our" accent="Academic Success" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = PILLAR_ICONS[i % PILLAR_ICONS.length];
            return (
              <Reveal key={p.title} delay={0.05 * i}>
                <Card className="h-full">
                  <div className="bg-gold-soft text-gold mb-4 flex h-11 w-11 items-center justify-center rounded-md">
                    <Icon size={22} aria-hidden />
                  </div>
                  <CardTitle>{p.title}</CardTitle>
                  <CardDescription>{p.body}</CardDescription>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ── Reviews ── */}
      <section className="border-border bg-bg-1 border-y py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="What Our" accent="Students Say" />
          <div className="mt-14">
            <ReviewList />
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          title="Academic Support Services"
          accent="Designed to Help You Succeed"
          lead="Full coverage across every subject we support."
        />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={0.04 * i}>
              <Link href={`/${s.slug}`} className="block h-full">
                <Card className="h-full">
                  <CardTitle className="text-lg">{s.label}</CardTitle>
                  <CardDescription>{s.intro}</CardDescription>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Platforms ── */}
      <section className="border-border bg-bg-1 border-y py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="All Major Platforms Covered"
            title="Comprehensive Academic Support"
            accent="Across All Online Platforms"
          />
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {PLATFORM_GRID.map((p, i) => (
              <Reveal key={p.name} delay={0.03 * i}>
                <PlatformGridCard item={p} />
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={TRUST_SECTION.eyebrow}
          title={TRUST_SECTION.title}
          accent={TRUST_SECTION.accent}
          lead={TRUST_SECTION.lead}
        />
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRUST_BADGES.map((t, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <Reveal key={t.title} delay={0.05 * i}>
                <Card className="h-full">
                  <div className="bg-gold-soft text-gold mb-4 flex h-11 w-11 items-center justify-center rounded-md">
                    <Icon size={22} aria-hidden />
                  </div>
                  <CardTitle>{t.title}</CardTitle>
                  <CardDescription>{t.body}</CardDescription>
                </Card>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.1}>
          <ul className="trust-indicators">
            {TRUST_INDICATORS.map((ind) => (
              <li key={ind.label} className="trust-indicator">
                <span aria-hidden>{ind.icon}</span>
                {ind.label}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ── Pricing ── */}
      <PricingCard />

      {/* ── How It Works (flight journey) ── */}
      <FlightJourney />

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── Final CTA ── */}
      <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <Reveal>
          <div className="border-border bg-bg-1 rounded-lg border px-6 py-16 text-center">
            <h2 className="section-h text-text-primary">
              Ready to get <span className="text-gold">started?</span>
            </h2>
            <p className="text-text-secondary mx-auto mt-4 max-w-xl">
              Tell us about your class and we&apos;ll match you with the right
              expert in minutes.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link href="/place-order">
                <Button size="lg">Place your order</Button>
              </Link>
              <Link href="/how-it-works">
                <Button size="lg" variant="secondary">
                  See how it works
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
