import { ShieldCheck, BadgeCheck, CreditCard } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";

/**
 * Hero intro: heading, supporting copy, trust cards and animated stats.
 *
 * Server component — only the stat counters need the client, and they
 * bring their own "use client" boundary, so nothing else here ships JS.
 *
 * Every surface and text colour comes from the theme tokens rather than
 * fixed palette classes, so the whole block follows the global toggle.
 */

/** Lucide icons, not emoji — they inherit currentColor and scale cleanly. */
const INFO_CARDS = [
  {
    icon: ShieldCheck,
    title: "100% Confidential",
    body: "Your identity and order details are never shared.",
  },
  {
    icon: BadgeCheck,
    title: "Grade B or Higher — Guaranteed",
    body: "We back every order with a money-back grade guarantee.",
  },
  {
    icon: CreditCard,
    title: "Flexible Payment Options",
    body: "Pay in full or split into 2–4 installments.",
  },
];

/** Split into the number to count and the fixed text around it. */
const STATS = [
  { to: 99.95, decimals: 2, suffix: "%", label: "Success Rate" },
  { to: 9, decimals: 0, suffix: "/10", label: "B or Better Grades" },
  { to: 18, decimals: 0, suffix: "K+", label: "Classes Done" },
  { to: 4.9, decimals: 1, suffix: "\u2605", label: "Rating" },
];

/**
 * Shared hero left column — used by the landing page and every service
 * page, so the cards, stats, spacing and equal-height behaviour stay in
 * one place instead of being duplicated per route.
 *
 * Defaults reproduce the landing page exactly; service pages override
 * only the heading (and pass their own lead, which occupies the same
 * slot with the same styling).
 */
export interface HeroIntroProps {
  /** First H1 line, plain colour. */
  leading?: string;
  /** Second H1 line, blue→gold gradient. */
  accent?: string;
  /** Supporting paragraph. Defaults to the landing page copy. */
  lead?: React.ReactNode;
}

export function HeroIntro({
  leading = "Take My Full Online",
  accent = "Class For Me",
  lead,
}: HeroIntroProps = {}) {
  return (
    // Full-height flex column from lg up: the grid row is as tall as the
    // quote form, and justify-between spreads the surplus across the gaps
    // between heading, lead, cards and stats rather than leaving a void
    // under the last block. Below lg there is no surplus, so it is inert.
    <div className="flex flex-col lg:h-full lg:justify-between">
      <Reveal>
        <h1 className="hero-h1">
          <span className="hero-line-1">{leading}</span>
          <br />
          {/* One controlled blue-to-gold ramp across the whole line,
              not a colour per word. */}
          <span className="hero-line-2">{accent}</span>
        </h1>
      </Reveal>

      <Reveal delay={0.08}>
        <p className="hero-lead">
          {lead ?? (
            <>
              Hire a verified USA-based academic expert. Get matched in minutes
              with full confidentiality.{" "}
              <strong className="hero-lead-strong">
                Grade B or higher guaranteed.
              </strong>
            </>
          )}
        </p>
      </Reveal>

      <ul className="hero-cards">
        {INFO_CARDS.map((card, i) => {
          const Icon = card.icon;
          return (
            <Reveal key={card.title} delay={0.14 + i * 0.06}>
              <li className="hero-card">
                <span className="hero-card-icon" aria-hidden>
                  <Icon size={18} />
                </span>
                <p className="hero-card-text">
                  <strong>{card.title}</strong>
                  <span> — {card.body}</span>
                </p>
              </li>
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={0.34}>
        <dl className="hero-stats">
          {STATS.map((s) => (
            <div key={s.label} className="hero-stat">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="hero-stat-num">
                  <CountUp to={s.to} decimals={s.decimals} suffix={s.suffix} />
                </span>
                <span className="hero-stat-label">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </div>
  );
}
