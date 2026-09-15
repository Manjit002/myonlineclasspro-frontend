"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Static showcase card, carried over from the original page.
 *
 * The original deliberately does NOT populate these figures from the
 * review API — they describe the Google Business Profile, not the
 * on-site reviews — so they stay hard-coded here for the same reason.
 * Animations fire once when the card enters the viewport.
 */
const BARS = [
  { stars: 5, pct: 94 },
  { stars: 4, pct: 34 },
  { stars: 3, pct: 9 },
  { stars: 2, pct: 3 },
  { stars: 1, pct: 3 },
];

const QUICK = [
  { n: "189", l: "Total Reviews" },
  { n: "4.6", l: "Average Rating" },
  { n: "98%", l: "Recommend Us" },
  { n: "100%", l: "Response Rate" },
];

const GOOGLE_URL =
  "https://www.google.com/maps/place/MyOnlineClassPro/@38.3679863,-171.2317355,3z";

export function ReviewStats() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const [shown, setShown] = useState(reduce);
  const [rating, setRating] = useState(reduce ? 4.6 : 0);

  // Observer effect: only flips `shown`. It deliberately does not depend
  // on `shown`, because re-running it would tear down the animation
  // started by the state change it just caused.
  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          io.unobserve(e.target);
          setShown(true);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  // Count 0.0 -> 4.6 over ~900ms once the card is visible. Kept separate
  // so its cleanup only cancels the frame on unmount, not on every
  // unrelated re-render.
  useEffect(() => {
    if (!shown || reduce) return;
    let raf = 0;
    let start = 0;
    const step = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / 900, 1);
      setRating(4.6 * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(step);
      else setRating(4.6);
    };
    raf = requestAnimationFrame(step);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [shown, reduce]);

  return (
    <div className="rv-stats" ref={ref}>
      <div className="rv-stats-left">
        <p className="rv-stats-label">Business Profile Reviews</p>
        <p className="rv-rating-num">{rating.toFixed(1)}</p>
        <p className="rv-stars-big" aria-label="4.6 out of 5 stars">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={["rv-star", shown && "in"].filter(Boolean).join(" ")}
              style={{ transitionDelay: `${i * 80}ms` }}
              aria-hidden
            >
              ★
            </span>
          ))}
        </p>
        <p className="rv-stats-sub">Based on 189 Google reviews</p>
        <a
          className="rv-google-btn"
          href={GOOGLE_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Google <span aria-hidden>→</span>
        </a>
      </div>

      <div className="rv-stats-bars">
        {BARS.map((b, i) => (
          <div className="rv-bar-row" key={b.stars}>
            <span className="rv-bar-k">{b.stars}★</span>
            <span className="rv-bar-track">
              <span
                className="rv-bar-fill"
                style={{
                  width: shown ? `${b.pct}%` : "0%",
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            </span>
            <span className="rv-bar-pct">{b.pct}%</span>
          </div>
        ))}
      </div>

      <dl className="rv-quickstats">
        {QUICK.map((q, i) => (
          <div
            key={q.l}
            className={["rv-qs", shown && "in"].filter(Boolean).join(" ")}
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            <dd className="rv-qs-num">{q.n}</dd>
            <dt className="rv-qs-lbl">{q.l}</dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
