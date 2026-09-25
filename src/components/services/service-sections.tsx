import Link from "next/link";
import {
  BookOpen,
  ListChecks,
  MonitorSmartphone,
  ArrowRight,
  AlertCircle,
  Check,
  Quote,
  Users,
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Reveal } from "@/components/ui/reveal";
import { getService } from "@/constants/services";
import { getPlatformLogo } from "@/constants/platform-logos";
import type { ServiceDetail } from "@/constants/service-details";

/**
 * Shared section components for the service pages.
 *
 * Server components — no interactivity, so no client JS ships. The
 * layout lives here; every word of the content comes from the
 * per-service data, so no two pages share copy.
 */

function SectionHead({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="svc-head">
      <p className="svc-eyebrow">{eyebrow}</p>
      <h2 className="svc-title">{title}</h2>
    </header>
  );
}

export function ServiceCourseAreas({
  areas,
  subject,
  title,
}: {
  areas: string[];
  subject: string;
  /** Falls back to Title Case, not the old "areas we support" sentence
   * case, which shipped as a bug on all 12 service pages. */
  title?: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="Course areas"
        title={title ?? `${subject} Areas We Support`}
      />
      <div className="svc-grid">
        {areas.map((a) => (
          <Reveal key={a}>
            <Card className="svc-card">
              <span className="svc-card-icon" aria-hidden>
                <BookOpen size={17} />
              </span>
              <CardTitle className="svc-card-title">{a}</CardTitle>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ServiceCoursework({ items }: { items: string[] }) {
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="What we help with"
        title="Coursework And Study Support"
      />
      <ul className="svc-list">
        {items.map((i) => (
          <li key={i}>
            <ListChecks size={16} aria-hidden />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServicePlatforms({ platforms }: { platforms: string[] }) {
  if (!platforms.length) return null;
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="Platforms"
        title="Learning Platforms We Can Help You Navigate"
      />
      <p className="svc-lead">
        We can help you interpret assignment instructions, read a grading rubric
        and locate your course materials on these platforms. You keep control of
        your own account and submit your own graded work.
      </p>
      <div className="svc-platforms">
        {platforms.map((p) => {
          // Reuses the homepage's brand artwork. Where the project has
          // no mark for a brand, a neutral glyph stands in rather than
          // an invented logo.
          const logo = getPlatformLogo(p);
          return (
            <span key={p} className="svc-platform">
              <span className="svc-platform-logo" aria-hidden>
                {logo ?? <MonitorSmartphone size={15} />}
              </span>
              <span className="svc-platform-name">{p}</span>
            </span>
          );
        })}
      </div>
    </section>
  );
}

export function RelatedServices({ slugs }: { slugs: string[] }) {
  const items = slugs.map(getService).filter(Boolean);
  if (!items.length) return null;
  return (
    <section className="svc-section">
      <SectionHead eyebrow="Related" title="Other Subjects We Support" />
      <div className="svc-related">
        {items.map((s) => (
          <Link key={s!.slug} href={`/${s!.slug}`} className="svc-related-card">
            <span className="svc-related-label">{s!.label}</span>
            <ArrowRight size={15} aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ServiceIntegrityNote() {
  return (
    <p className="svc-integrity">
      Our tutors provide explanation, guidance and preparation. You keep control
      of your own account and submit your own graded work, in line with your
      institution&apos;s academic-integrity policy.
    </p>
  );
}

export type { ServiceDetail };

/* ── Optional richer sections ─────────────────────────────────
   Rendered only when a service supplies the data, so they are
   available to every service page rather than one-offs. All use
   the same SectionHead / Card / Reveal primitives as above. */

export function ServiceChallenges({
  items,
  subject,
  intro,
}: {
  items: { title: string; body: string }[];
  subject: string;
  /** Optional framing paragraph, rendered above the card grid. */
  intro?: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="Why students seek help"
        title={`What Makes ${subject} Coursework Hard`}
      />
      {intro && <p className="svc-lead">{intro}</p>}
      <div className="svc-grid">
        {items.map((c) => (
          <Reveal key={c.title}>
            <Card className="svc-chal">
              <span className="svc-card-icon" aria-hidden>
                <AlertCircle size={17} />
              </span>
              <CardTitle className="svc-card-title">{c.title}</CardTitle>
              <p className="svc-chal-body">{c.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ServicePopularCourses({
  courses,
  title,
}: {
  courses: string[];
  title?: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="Courses"
        title={title ?? "Most Popular Online Courses Students Choose"}
      />
      {/* Deliberately a different treatment from the subject-area grid
          above, so the two sections read as distinct. */}
      <ol className="svc-courses">
        {courses.map((c, i) => (
          <li key={c}>
            <span className="svc-course-n">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="svc-course-name">{c}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ServiceFeatures({
  items,
  title,
}: {
  items: { title: string; body: string }[];
  title?: string;
}) {
  return (
    <section className="svc-section">
      {/* Default renamed from "How Our Support Works" — it collided
          with the Process section's "How It Works" a few sections
          down, reading as a duplicate. */}
      <SectionHead
        eyebrow="What you get"
        title={title ?? "Key Features Of Our Support"}
      />
      <div className="svc-feat-grid">
        {items.map((f) => (
          <div key={f.title} className="svc-feat">
            <Check size={15} aria-hidden />
            <div>
              <p className="svc-feat-t">{f.title}</p>
              <p className="svc-feat-b">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceProcess({
  steps,
  title,
}: {
  steps: { title: string; body: string }[];
  title?: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="Process" title={title ?? "How It Works"} />
      <ol className="svc-steps">
        {steps.map((s, i) => (
          <li key={s.title} className="svc-step">
            <span className="svc-step-n">{i + 1}</span>
            <div className="svc-step-body">
              <p className="svc-step-t">{s.title}</p>
              <p className="svc-step-b">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function ServiceStats({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="Track record" title="Why Students Choose Us" />
      <div className="svc-stats">
        {stats.map((s) => (
          <div key={s.label} className="svc-stat">
            <p className="svc-stat-v">{s.value}</p>
            <p className="svc-stat-l">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceTestimonials({
  items,
  title,
}: {
  items: { name: string; headline: string; body: string }[];
  title?: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="Student reviews"
        title={title ?? "What Students Say"}
      />
      <div className="svc-quotes">
        {items.map((t) => (
          <figure key={t.name} className="svc-quote">
            <Quote size={16} aria-hidden />
            <figcaption className="svc-quote-head">{t.headline}</figcaption>
            <blockquote>{t.body}</blockquote>
            <p className="svc-quote-name">— {t.name}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function ServicePricing({
  tiers,
  factors,
}: {
  tiers: { name: string; range: string; body: string }[];
  factors: { title: string; body: string }[];
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="Pricing" title="What Support Typically Costs" />
      <div className="svc-tiers">
        {tiers.map((t) => (
          <div key={t.name} className="svc-tier">
            <p className="svc-tier-n">{t.name}</p>
            <p className="svc-tier-r">{t.range}</p>
            <p className="svc-tier-b">{t.body}</p>
          </div>
        ))}
      </div>
      <p className="svc-lead svc-tier-note">
        These are indicative ranges. Actual pricing depends on your exact
        requirements — use the quote form for a figure for your course.
      </p>
      <div className="svc-feat-grid">
        {factors.map((f) => (
          <div key={f.title} className="svc-feat">
            <Check size={15} aria-hidden />
            <div>
              <p className="svc-feat-t">{f.title}</p>
              <p className="svc-feat-b">{f.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ServiceSubjectAreas({
  areas,
  title,
}: {
  areas: {
    name: string;
    code?: string;
    topics: string[];
  }[];
  title: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="Course areas" title={title} />
      <div className="svc-subj-grid">
        {areas.map((a) => (
          <Reveal key={a.name}>
            <Card className="svc-subj-card">
              <div className="svc-subj-head">
                <CardTitle className="svc-subj-name">{a.name}</CardTitle>
                {a.code && <span className="svc-subj-code">{a.code}</span>}
              </div>
              <p className="svc-subj-topics">{a.topics.join(" · ")}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Additional optional sections ─────────────────────────────
   Each renders only when a service supplies its data — same pattern
   as everything above. Built for content the generic sections don't
   have a slot for: a standalone overview, a dedicated case-study
   callout, a "what help looks like" block, a cross-subject note with
   real links, and a plagiarism/AI-report note. */

export function ServiceOverview({ paragraphs }: { paragraphs: string[] }) {
  return (
    <section className="svc-section svc-overview">
      {paragraphs.map((p) => (
        <p key={p.slice(0, 40)} className="svc-lead">
          {p}
        </p>
      ))}
    </section>
  );
}

export function ServiceCaseStudy({
  title,
  body,
  points,
}: {
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <section className="svc-section">
      <div className="svc-case">
        <div className="svc-case-text">
          <p className="svc-eyebrow">Case study support</p>
          <h2 className="svc-title">{title}</h2>
          <p className="svc-lead">{body}</p>
        </div>
        <ul className="svc-case-list">
          {points.map((pt) => (
            <li key={pt}>
              <Check size={15} aria-hidden />
              <span>{pt}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ServiceHelpOverview({
  title,
  body,
  points,
}: {
  title: string;
  body: string;
  points: string[];
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="What's available" title={title} />
      <p className="svc-lead">{body}</p>
      <ul className="svc-list">
        {points.map((pt) => (
          <li key={pt}>
            <ListChecks size={16} aria-hidden />
            <span>{pt}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServiceCrossSubject({
  body,
  links,
}: {
  body: string;
  links: { label: string; href: string }[];
}) {
  return (
    <section className="svc-section">
      <p className="svc-lead svc-cross-body">{body}</p>
      <div className="svc-related">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="svc-related-card">
            <span className="svc-related-label">{l.label}</span>
            <ArrowRight size={15} aria-hidden />
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ServiceIntegrity({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="svc-section">
      <div className="svc-integrity-block">
        <span className="svc-card-icon" aria-hidden>
          <Check size={17} />
        </span>
        <div>
          <h2 className="svc-title svc-integrity-title">{title}</h2>
          <p className="svc-lead">{body}</p>
        </div>
      </div>
    </section>
  );
}

export function ServiceAudiences({
  title,
  items,
}: {
  title: string;
  items: { title: string; body: string }[];
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="Who it's for" title={title} />
      <div className="svc-grid">
        {items.map((a) => (
          <Reveal key={a.title}>
            <Card className="svc-chal">
              <span className="svc-card-icon" aria-hidden>
                <Users size={17} />
              </span>
              <CardTitle className="svc-card-title">{a.title}</CardTitle>
              <p className="svc-chal-body">{a.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function ServiceBreakdown({
  title,
  intro,
  items,
}: {
  title: string;
  intro?: string;
  items: { title: string; body: string }[];
}) {
  return (
    <section className="svc-section">
      <SectionHead eyebrow="In detail" title={title} />
      {intro && <p className="svc-lead">{intro}</p>}
      <div className="svc-grid">
        {items.map((it) => (
          <Reveal key={it.title}>
            <Card className="svc-chal">
              <span className="svc-card-icon" aria-hidden>
                <ListChecks size={17} />
              </span>
              <CardTitle className="svc-card-title">{it.title}</CardTitle>
              <p className="svc-chal-body">{it.body}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
