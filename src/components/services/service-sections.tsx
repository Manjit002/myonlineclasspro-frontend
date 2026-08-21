import Link from "next/link";
import {
  BookOpen,
  ListChecks,
  MonitorSmartphone,
  ArrowRight,
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
}: {
  areas: string[];
  subject: string;
}) {
  return (
    <section className="svc-section">
      <SectionHead
        eyebrow="Course areas"
        title={`${subject} areas we support`}
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
        title="Coursework and study support"
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
        title="Learning platforms we can help you navigate"
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
      <SectionHead eyebrow="Related" title="Other subjects we support" />
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
