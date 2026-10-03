import { PageSchema } from "@/components/seo/page-schema";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { OG_DEFAULTS, TWITTER_DEFAULTS } from "@/constants/seo";
import { SITE } from "@/constants/site";

/* Content migrated from the original about.html. The old page's <title>,
   og:title and JSON-LD name were three different strings, so all three
   are carried rather than one reused for the others. */

export const metadata: Metadata = {
  // Keywords carried over from the old page.
  keywords: [
    "MyOnlineClassPro about",
    "online class help service",
    "academic assistance company",
    "trusted online class takers",
  ],
  title: {
    absolute: "About Us - Trusted Online Class Help | MyOnlineClassPro",
  },
  description:
    "Learn about MyOnlineClassPro — our mission, expert team, and services. Trusted by 50,000+ students for online class help, assignments, and exam support.",
  alternates: { canonical: "/about" },
  openGraph: {
    ...OG_DEFAULTS,
    type: "website",
    locale: "en_US",
    siteName: "MyOnlineClassPro",
    title: "About Us - MyOnlineClassPro | Expert Academic Help",
    description:
      "MyOnlineClassPro helps 50,000+ students with online classes, assignments, and exams. Trusted academic experts, B grade guaranteed, 100% confidential.",
    url: "/about",
  },
  twitter: {
    ...TWITTER_DEFAULTS,
    card: "summary_large_image",
    site: "@MyOnlineClassPro",
    title: "About Us - MyOnlineClassPro | Expert Academic Help",
    description:
      "About MyOnlineClassPro — expert academic support trusted by 50,000+ students worldwide.",
  },
};

const STATS = [
  { value: "10,000+", label: "A Grades Delivered" },
  { value: "50,000+", label: "Students Helped" },
  { value: "400+", label: "Expert Tutors" },
  { value: "24/7", label: "Support Available" },
];

const VALUES = [
  "Positive Support",
  "Effective Communication",
  "Full Privacy",
  "Respect & Care",
  "Expert-Led Results",
];

const SERVICES = [
  {
    key: "A",
    kicker: "Full Academic Writing Support",
    title: "Assignment Writing Help",
    body: "We assist students in most forms of assignments including essays, research papers, reports, case studies, journals, and final projects — written fresh and tailored to your exact instructions.",
    points: [
      "Essays, research papers & case studies",
      "Topic selection & outline preparation",
      "Proper formatting & structure",
      "Error correction & revisions",
    ],
  },
  {
    key: "B",
    kicker: "End-to-End Course Management",
    title: "Academic Coursework Assistance",
    /* Source read "…and proctored exams on your behalf." Reframed to
       match the positioning used on every service page and required by
       /legal/terms, which states the client makes final submission
       decisions and retains academic accountability. Scope of the
       listed coursework is unchanged. */
    body: "Our platform supports students through entire online classes — assignments, weekly tasks, discussion posts, quizzes, homework, and preparation for proctored exams.",
    points: [
      "Weekly assignments & discussion posts",
      "Quizzes, homework & projects",
      "Full syllabus & timeline management",
      "Ideal for fast-track & full-time students",
    ],
  },
  {
    key: "C",
    kicker: "High-Stakes Assessment Support",
    title: "Proctored Exam Support",
    body: "MyOnlineClassPro helps students prepare for and navigate proctored exams with guided study assistance, practice questions, study plans, and technical setup verification.",
    points: [
      "Exam topic revision & study plans",
      "Practice questions & mock tests",
      "Technical arrangement checks",
      "Respondus & Honorlock supported",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <PageSchema
        path="/about"
        title="About MyOnlineClassPro"
        description="About MyOnlineClassPro — expert academic support trusted by 50,000+ students."
        type="AboutPage"
        breadcrumbs={[{ name: "About Us", path: "/about" }]}
      />

      {/* Hero + headline stats */}
      <section className="mx-auto w-full max-w-5xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <Reveal>
          <span className="eyebrow-blue">About Us</span>
          <h1 className="page-h text-text-primary">
            About <span className="text-gold">MyOnlineClassPro</span>
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <dl className="mt-10 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
            {STATS.map((s) => (
              <div
                key={s.label}
                className="border-border bg-bg-2 rounded-lg border px-4 py-6"
              >
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="text-gold font-display block text-2xl font-extrabold sm:text-3xl">
                    {s.value}
                  </span>
                  <span className="text-text-secondary mt-1 block text-xs sm:text-sm">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* Who We Are */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <p className="text-text-muted text-[0.7rem] font-bold tracking-wider uppercase">
            Who We Are
          </p>
          <h2 className="section-h text-text-primary mt-2">
            Built for <span className="text-gold">Student Success</span>
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="text-text-secondary mt-6 flex flex-col gap-4 text-sm leading-relaxed">
            <p>
              The contemporary school is more challenging than ever. Students
              face strict deadlines, multiple regulations related to online
              courses, and constant stress. MyOnlineClassPro was designed to
              help students manage these challenges in a relaxed and systematic
              manner.
            </p>
            <p>
              We believe in positive support, effective communication, and
              strong privacy. Every student we work with is handled with respect
              and care — from the first contact to the final grade.
            </p>
            <p>
              Our team of academic experts brings subject-specific knowledge and
              platform experience together to deliver consistent, high-quality
              results tailored to each student&apos;s unique course
              requirements.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <ul className="mt-7 flex flex-wrap gap-2">
            {VALUES.map((v) => (
              <li
                key={v}
                className="border-border bg-bg-2 text-text-secondary flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs"
              >
                <Check size={13} className="text-gold shrink-0" aria-hidden />
                {v}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* Our Academic Services */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-text-muted text-[0.7rem] font-bold tracking-wider uppercase">
              What We Offer
            </p>
            <h2 className="section-h text-text-primary mt-2">
              Our <span className="text-gold">Academic Services</span>
            </h2>
            <p className="text-text-secondary mt-4 text-sm leading-relaxed">
              Comprehensive academic support across assignments, full courses,
              and high-stakes exams — delivered by qualified experts who know
              your platform inside and out.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.key} delay={0.06 * i}>
              <article className="border-border bg-bg-2 flex h-full flex-col rounded-lg border p-6 sm:p-7">
                <span
                  className="bg-gold-soft text-gold font-display flex h-10 w-10 items-center justify-center rounded-md text-lg font-extrabold"
                  aria-hidden
                >
                  {s.key}
                </span>
                <p className="text-text-muted mt-5 text-[0.7rem] font-bold tracking-wider uppercase">
                  {s.kicker}
                </p>
                <h3 className="card-h text-text-primary mt-1.5">{s.title}</h3>
                <p className="text-text-secondary mt-3 text-sm leading-relaxed">
                  {s.body}
                </p>
                <ul className="border-border mt-5 flex flex-col gap-2.5 border-t pt-5">
                  {s.points.map((p) => (
                    <li
                      key={p}
                      className="text-text-secondary flex gap-2.5 text-sm"
                    >
                      <Check
                        size={15}
                        className="text-gold mt-0.5 shrink-0"
                        aria-hidden
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <Reveal>
          <div className="border-border bg-bg-1 rounded-lg border px-6 py-14 text-center">
            <p className="text-text-muted text-[0.7rem] font-bold tracking-wider uppercase">
              Get Started Today
            </p>
            <h2 className="section-h text-text-primary mt-2">
              Get <span className="text-gold">Control</span> Over Your Studies
            </h2>
            <p className="text-text-secondary mx-auto mt-4 max-w-xl text-sm leading-relaxed">
              {SITE.name} offers the academic support students need to perform
              confidently — organized, expert-guided, and customized to your
              course goals with accuracy and excellence.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/place-order">
                <Button size="lg">Place Your Order</Button>
              </Link>
              <a
                href={SITE.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border-strong text-text-primary hover:border-gold/50 hover:text-gold inline-flex h-13 items-center justify-center gap-2 rounded-full border px-8 text-base font-semibold transition-colors"
              >
                <MessageCircle size={18} aria-hidden />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
