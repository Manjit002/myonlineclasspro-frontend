"use client";

import { useEffect, useRef, useState } from "react";
import { FAQS } from "@/constants/faqs";

export interface FaqItem {
  q: string;
  a: string;
}

interface FaqSectionProps {
  /** Defaults to the homepage set, so `<FaqSection />` is unchanged. */
  items?: readonly FaqItem[];
  /** Set false where the page already renders its own heading. */
  heading?: boolean;
  eyebrow?: string;
  titleLead?: string;
  titleAccent?: string;
}

/**
 * FAQ accordion — ported from the original index.html.
 *
 * Two behaviours carried over exactly:
 *
 * 1. Reveal. An IntersectionObserver at threshold 0.15 fires once, then
 *    unobserves. Heading first, description at +90ms, then cards at
 *    180ms + 90ms each — the original's timings.
 *
 * 2. Open/close. Toggling .faq-active drives a CSS
 *    grid-template-rows 0fr -> 1fr transition, so the answer animates to
 *    its natural height with no JS measurement and no fixed max-height
 *    that would clip longer answers.
 */
export function FaqSection({
  items = FAQS,
  heading = true,
  eyebrow = "FAQs",
  titleLead = "Frequently Asked",
  titleAccent = "Questions",
}: FaqSectionProps = {}) {
  const sectionRef = useRef<HTMLElement>(null);
  // Initialised eagerly for the no-IntersectionObserver case, so the
  // content is visible from first render rather than being switched on
  // by an effect (which would flash hidden content and trip the
  // set-state-in-effect rule).
  const supportsObserver =
    typeof window === "undefined" || "IntersectionObserver" in window;
  const [revealed, setRevealed] = useState<Set<number>>(() =>
    supportsObserver ? new Set() : new Set(items.map((_, i) => i)),
  );
  const [headingIn, setHeadingIn] = useState(!supportsObserver);
  const [open, setOpen] = useState<Set<number>>(new Set());

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !("IntersectionObserver" in window)) return;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setHeadingIn(true);
          items.forEach((_, i) => {
            timers.push(
              setTimeout(
                () => setRevealed((prev) => new Set(prev).add(i)),
                180 + i * 90,
              ),
            );
          });
          // Fire once — re-revealing on every scroll pass would flicker.
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.15 },
    );

    io.observe(section);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, [items]);

  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  // The original lays these out as two independent columns rather than a
  // row-flowing grid, so items read top-to-bottom within each column.
  const mid = Math.ceil(items.length / 2);
  const columns = [items.slice(0, mid), items.slice(mid)];

  return (
    <section ref={sectionRef} className="faq-section-premium">
      <div className="site-container">
        {heading && (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <div className="eyebrow-blue">{eyebrow}</div>
            <h2
              className={[
                "section-h",
                "faq-heading-premium",
                headingIn && "faq-in",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {titleLead}{" "}
              <span className="gold-gradient-text">{titleAccent}</span>
            </h2>
          </div>
        )}

        <div className="faq-grid-premium">
          {columns.map((col, colIndex) => (
            <div className="faq-col" key={colIndex}>
              {col.map((faq, rowIndex) => {
                const i = colIndex * mid + rowIndex;
                const isOpen = open.has(i);
                return (
                  <div
                    key={faq.q}
                    className={[
                      "faq-card",
                      revealed.has(i) && "faq-in",
                      isOpen && "faq-active",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <button
                      type="button"
                      className="faq-q"
                      id={`faq-q-${i}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${i}`}
                      onClick={() => toggle(i)}
                    >
                      <span className="faq-q-text">{faq.q}</span>
                      <span className="faq-icon" aria-hidden>
                        <span />
                        <span />
                      </span>
                    </button>
                    <div
                      className="faq-a-wrap"
                      id={`faq-a-${i}`}
                      role="region"
                      aria-labelledby={`faq-q-${i}`}
                      aria-hidden={!isOpen}
                    >
                      <div className="faq-a-inner">
                        <div className="faq-a">{faq.a}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
