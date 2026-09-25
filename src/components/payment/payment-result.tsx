"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import { DASHBOARD_ROUTE } from "@/lib/api-client";

/**
 * Shared shell for the payment result pages.
 *
 * Both outcomes use the same structure — ambient glow, card, animated
 * icon, status tag, body, actions, countdown — and differ only by tone.
 * Keeping it in one component means the success and failure pages can't
 * drift apart.
 */

export type ResultTone = "success" | "failure";

const REDIRECT_SECONDS = 5;

/** Floating particles, success only. Client-generated so the random
 *  positions can't cause a hydration mismatch. */
function Particles() {
  const mounted = useMounted();
  const [dots] = useState(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      bottom: Math.random() * 30,
      size: 2 + Math.random() * 4,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      opacity: 0.3 + Math.random() * 0.5,
    })),
  );
  if (!mounted) return null;
  return (
    <div className="pr-particles" aria-hidden>
      {dots.map((d) => (
        <span
          key={d.id}
          className="pr-particle"
          style={{
            left: `${d.left}%`,
            bottom: `${d.bottom}%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            animationDuration: `${d.dur}s`,
            animationDelay: `${d.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * Counts down and then navigates to the in-app dashboard.
 *
 * The redirect is guarded by a ref so a re-render can't fire it twice,
 * and the interval is cleared on unmount so no timer outlives the page.
 */
function CountdownRedirect({ tone }: { tone: ResultTone }) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const done = useRef(false);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (seconds > 0 || done.current) return;
    done.current = true;
    // In-app route — never the old server-rendered dashboard.
    router.replace(DASHBOARD_ROUTE);
  }, [seconds, router]);

  return (
    <div className="pr-countdown">
      <p className="pr-countdown-label" aria-live="polite">
        Redirecting to dashboard in <span>{seconds}</span>s
      </p>
      <span className="pr-bar-track">
        <span
          className={`pr-bar-fill ${tone}`}
          style={{ animationDuration: `${REDIRECT_SECONDS}s` }}
        />
      </span>
    </div>
  );
}

export function PaymentResult({
  tone,
  tag,
  title,
  subtitle,
  children,
  actions,
  footer,
}: {
  tone: ResultTone;
  tag: string;
  title: string;
  subtitle: React.ReactNode;
  children?: React.ReactNode;
  actions: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <section className={`pr-page ${tone}`}>
      <div className="pr-ambient" aria-hidden />
      {tone === "success" && <Particles />}

      <div className="pr-card">
        <span className={`pr-icon ${tone}`} aria-hidden>
          {tone === "success" ? (
            <svg viewBox="0 0 24 24">
              <path className="pr-draw" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path className="pr-draw" d="M6 6 L18 18" />
              <path className="pr-draw pr-draw-2" d="M18 6 L6 18" />
            </svg>
          )}
        </span>

        <p className={`pr-tag ${tone}`}>{tag}</p>
        <h1 className="pr-title">{title}</h1>
        <p className="pr-subtitle">{subtitle}</p>

        {children}

        <div className="pr-actions">{actions}</div>
        {footer}

        <CountdownRedirect tone={tone} />
      </div>
    </section>
  );
}

/** Shared secondary action — the in-app homepage, not /index.html. */
export function BackHomeLink() {
  return (
    <Link href="/" className="pr-btn-ghost">
      &larr; Back to Home
    </Link>
  );
}

/** Shared dashboard action — the in-app route, not the legacy HTML one. */
export function DashboardLink({
  variant = "primary",
}: {
  variant?: "primary" | "secondary";
}) {
  return (
    <Link
      href={DASHBOARD_ROUTE}
      className={variant === "primary" ? "pr-btn-primary" : "pr-btn-secondary"}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
      Go to Dashboard
    </Link>
  );
}
