"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExpertAvatar } from "./expert-avatar";
import { useExpertMatcher } from "@/hooks/use-expert-matcher";
import {
  MATCH_SUBJECTS,
  URGENCY_OPTIONS,
  type Expert,
} from "@/constants/experts-data";

type Phase = "subject" | "urgency" | "loading" | "result";

/** Parses "500+" -> {n:500, suffix:"+"}, "99%" -> {n:99, suffix:"%"}. */
function splitStat(raw: string): { value: number; suffix: string } {
  const m = raw.match(/^([\d.]+)(.*)$/);
  return m
    ? { value: parseFloat(m[1]), suffix: m[2] }
    : { value: 0, suffix: raw };
}

/** Years pulled from credentials text, e.g. "8+ yrs experience" -> 8. */
function yearsFrom(credentials: string): number {
  const m = credentials.match(/(\d+)\+?\s*yrs?/i);
  return m ? parseInt(m[1], 10) : 0;
}

/** Counts 0 -> value once, then holds. Mirrors the original result stats. */
function StatCount({
  value,
  suffix,
  delay = 0,
}: {
  value: number;
  suffix: string;
  delay?: number;
}) {
  // Decided once at first render so reduced-motion users never see a
  // frame of "0", and no state is set from inside the effect.
  const animate =
    typeof window === "undefined" ||
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [n, setN] = useState(animate ? 0 : value);

  useEffect(() => {
    if (!animate) return;
    let raf = 0;
    let start = 0;
    const DUR = 900;
    const run = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / DUR, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(value * eased);
      if (p < 1) raf = requestAnimationFrame(run);
      else setN(value);
    };
    const timer = setTimeout(() => {
      raf = requestAnimationFrame(run);
    }, delay);
    return () => {
      clearTimeout(timer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [value, delay, animate]);

  const shown = Number.isInteger(value) ? Math.round(n) : n.toFixed(1);
  return (
    <>
      {shown}
      {suffix}
    </>
  );
}

export function ExpertMatcher() {
  const [phase, setPhase] = useState<Phase>("subject");
  const [subject, setSubject] = useState<string | null>(null);
  const [urgency, setUrgency] = useState<string | null>(null);
  const [match, setMatch] = useState<Expert | null>(null);
  const pickExpert = useExpertMatcher();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  const runMatch = useCallback(
    (subj: string, urg: string) => {
      setUrgency(urg);
      // Skeleton first, then the result — the original never jumps
      // straight from the urgency click to the expert card.
      setPhase("loading");
      const t = setTimeout(() => {
        setMatch(pickExpert(subj));
        setPhase("result");
      }, 750);
      timers.current.push(t);
    },
    [pickExpert],
  );

  const reset = () => {
    setPhase("subject");
    setSubject(null);
    setUrgency(null);
    setMatch(null);
  };

  const subjectLabel =
    MATCH_SUBJECTS.find((s) => s.value === subject)?.label ?? "";
  const urgencyMsg = URGENCY_OPTIONS.find((u) => u.value === urgency)?.message;

  return (
    <div className="expm">
      {/* Step 1 */}
      {phase === "subject" && (
        <div className="expm-step">
          <p className="expm-q">What subject do you need help with?</p>
          <div className="expm-chips">
            {MATCH_SUBJECTS.map((s) => (
              <button
                key={s.value}
                type="button"
                className="expm-chip"
                onClick={() => {
                  setSubject(s.value);
                  setPhase("urgency");
                }}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 */}
      {phase === "urgency" && (
        <div className="expm-step">
          <p className="expm-q">How soon do you need help?</p>
          <div className="expm-chips">
            {URGENCY_OPTIONS.map((u) => (
              <button
                key={u.value}
                type="button"
                className="expm-chip"
                onClick={() => subject && runMatch(subject, u.value)}
              >
                {u.label}
              </button>
            ))}
          </div>
          <button type="button" className="expm-link" onClick={reset}>
            &larr; Change subject
          </button>
        </div>
      )}

      {/* Skeleton */}
      {phase === "loading" && (
        <div className="expm-skeleton" aria-hidden>
          <div className="expm-sk-row">
            <div className="expm-sk expm-sk-avatar" />
            <div style={{ flex: 1 }}>
              <div className="expm-sk expm-sk-line" style={{ width: "45%" }} />
              <div className="expm-sk expm-sk-line" style={{ width: "30%" }} />
            </div>
          </div>
          <div className="expm-sk expm-sk-line" style={{ width: "80%" }} />
          <div className="expm-sk expm-sk-line" style={{ width: "60%" }} />
        </div>
      )}

      {/* Result */}
      <div aria-live="polite">
        {phase === "result" && match && (
          <div className="expm-result">
            <div className="expm-ribbon">★ {match.rating}</div>

            <div className="expm-head">
              <div className="expm-avatar">
                <ExpertAvatar expert={match} />
              </div>
              <div>
                <p className="expm-name">{match.name}</p>
                <p className="expm-role">{match.role}</p>
              </div>
            </div>

            {urgencyMsg && <p className="expm-urgency">{urgencyMsg}</p>}
            <p className="expm-cred">{match.credentials}</p>

            <div className="expm-divider" />

            <dl className="expm-stats">
              <div>
                <dd>
                  <StatCount {...splitStat(match.orders)} />
                </dd>
                <dt>Orders</dt>
              </div>
              <div>
                <dd>
                  <StatCount {...splitStat(match.successRate)} delay={150} />
                </dd>
                <dt>Success Rate</dt>
              </div>
              <div>
                <dd>
                  <StatCount
                    value={yearsFrom(match.credentials)}
                    suffix="+ Yrs"
                    delay={300}
                  />
                </dd>
                <dt>Experience</dt>
              </div>
            </dl>

            <a className="expm-cta" href={match.href}>
              Request This Expert
            </a>

            <div className="expm-links">
              <Link className="expm-link" href="#browse-experts">
                See All {subjectLabel} Experts
              </Link>
              <button type="button" className="expm-link" onClick={reset}>
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
