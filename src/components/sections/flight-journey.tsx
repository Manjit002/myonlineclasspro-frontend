"use client";

import { useEffect, useRef } from "react";

const DESKTOP_PATH =
  "M 100 250 C 150 250, 200 100, 300 100 C 400 100, 400 400, 500 400 C 600 400, 600 100, 700 100 C 800 100, 850 250, 900 250";
const MOBILE_PATH =
  "M 200 100 C 200 200, 100 250, 100 350 C 100 450, 300 500, 300 600 C 300 700, 100 750, 100 850 C 100 950, 200 1000, 200 1100";

const PLANE_BODY =
  "M21 11.5L14 6V2.5C14 1.67 13.33 1 12.5 1C11.67 1 11 1.67 11 2.5V6L4 11.5V13.5L11 11.5V17L8.5 19V21L12.5 19.5L16.5 21V19L14 17V11.5L21 13.5V11.5Z";
const PLANE_TIP = "M12.5 1L14 2.5V6L12.5 5L11 6V2.5L12.5 1Z";

const STATIONS = [
  {
    num: "Step 01",
    title: "Share Your Class Details",
    pos: "pfj-pos-up pfj-m-pos-down",
  },
  {
    num: "Step 02",
    title: "Specify Your Requirements",
    pos: "pfj-pos-down pfj-m-pos-right",
  },
  { num: "Step 03", title: "Make a Payment", pos: "pfj-pos-up pfj-m-pos-left" },
  {
    num: "Step 04",
    title: "Get Your Tracking ID",
    pos: "pfj-pos-down pfj-m-pos-right",
  },
  {
    num: "Step 05",
    title: "Monitor Progress & Grades",
    pos: "pfj-pos-up pfj-m-pos-up",
  },
];

const PARTICLES = [
  { top: "15%", left: "20%", delay: "0s", size: "" },
  { top: "45%", left: "80%", delay: "1.2s", size: "pfj-p-lg" },
  { top: "75%", left: "40%", delay: "2.5s", size: "pfj-p-sm" },
  { top: "25%", left: "60%", delay: "3.8s", size: "" },
  { top: "85%", left: "90%", delay: "0.5s", size: "pfj-p-lg" },
  { top: "55%", left: "12%", delay: "1.8s", size: "pfj-p-sm" },
  { top: "10%", left: "48%", delay: "4.2s", size: "" },
  { top: "65%", left: "68%", delay: "2.9s", size: "pfj-p-sm" },
  { top: "35%", left: "5%", delay: "3.3s", size: "pfj-p-lg" },
  { top: "90%", left: "55%", delay: "0.9s", size: "pfj-p-sm" },
];

function Track({ variant }: { variant: "desktop" | "mobile" }) {
  const isDesktop = variant === "desktop";
  const filterId = `pfj-glow-${variant}`;
  return (
    <svg
      className={`pfj-svg pfj-${variant}`}
      viewBox={isDesktop ? "0 0 1000 500" : "0 0 400 1200"}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden
    >
      <defs>
        <filter id={filterId}>
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        className="pfj-path-base"
        d={isDesktop ? DESKTOP_PATH : MOBILE_PATH}
      />
      <path
        className="pfj-path-fill"
        filter={`url(#${filterId})`}
        d={isDesktop ? DESKTOP_PATH : MOBILE_PATH}
      />
      <g className="pfj-plane-group">
        <g transform="translate(-12, -12)">
          <path d={PLANE_BODY} className="pfj-plane-body" />
          <path d={PLANE_TIP} className="pfj-plane-tip" />
        </g>
      </g>
    </svg>
  );
}

/**
 * "How It Works" flight journey, ported from the original index.html.
 *
 * Scroll progress through the section drives three things in step: how
 * much of the gold route is drawn (via stroke-dashoffset), where the
 * plane sits along that route (getPointAtLength), and which station is
 * marked visited/active.
 *
 * The plane is rotated to face its direction of travel by sampling a
 * second point slightly further along the path and taking the angle
 * between them -- the +90 offset is because the icon is drawn pointing
 * up rather than right.
 */
export function FlightJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const stations = Array.from(
      section.querySelectorAll<HTMLElement>(".pfj-station"),
    );

    if (reduce) {
      // No scroll choreography -- present every step as complete so the
      // content is fully readable without motion.
      stations.forEach((s) => s.classList.add("visited"));
      stations[stations.length - 1]?.classList.add("celebrate");
      section
        .querySelectorAll<SVGPathElement>(".pfj-path-fill")
        .forEach((p) => {
          p.style.strokeDasharray = "none";
        });
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the section's top reaches the viewport bottom, 1 when its
      // bottom reaches the viewport top.
      const raw = (vh - rect.top) / (vh + rect.height);
      const progress = Math.min(Math.max(raw, 0), 1);

      const isMobile = window.innerWidth <= 768;
      const svg = section.querySelector<SVGSVGElement>(
        isMobile ? ".pfj-mobile" : ".pfj-desktop",
      );
      if (!svg) return;

      const fill = svg.querySelector<SVGPathElement>(".pfj-path-fill");
      const plane = svg.querySelector<SVGGElement>(".pfj-plane-group");
      if (!fill || !plane) return;

      const len = fill.getTotalLength();
      fill.style.strokeDasharray = `${len}`;
      fill.style.strokeDashoffset = `${len * (1 - progress)}`;

      const at = len * progress;
      const p = fill.getPointAtLength(at);
      // Sample a little ahead to derive heading; clamp so we never read
      // past the end of the path.
      const ahead = fill.getPointAtLength(Math.min(at + 2, len));
      const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
      plane.setAttribute(
        "transform",
        `translate(${p.x}, ${p.y}) rotate(${angle + 90})`,
      );

      stations.forEach((st, i) => {
        const threshold = i / (stations.length - 1);
        const reached = progress >= threshold - 0.06;
        st.classList.toggle("visited", reached);
        const isCurrent =
          reached && progress < (i + 1) / (stations.length - 1) - 0.06;
        st.classList.toggle("active", isCurrent);
        if (i === stations.length - 1) {
          st.classList.toggle("celebrate", progress > 0.96);
        }
      });
    };

    const onScroll = () => {
      // Coalesce scroll events into one write per frame.
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="premium-flight-journey"
      id="flight-journey"
      aria-label="How it works"
    >
      <div className="pfj-bg" aria-hidden>
        <div className="pfj-map-texture" />
        <div className="pfj-particles">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className={`pfj-p ${p.size}`}
              style={{ top: p.top, left: p.left, animationDelay: p.delay }}
            />
          ))}
        </div>
        <div className="pfj-orb pfj-orb-1" />
        <div className="pfj-orb pfj-orb-2" />
        <div className="pfj-orb pfj-orb-3" />
      </div>

      <div className="site-container">
        <div className="pfj-header">
          <div className="pfj-eyebrow">Interactive Journey</div>
          <h2 className="pfj-title">
            How It <span className="gold">Works</span>
          </h2>
          <p className="pfj-subtitle">
            Experience a seamless flight from your first order to exceptional
            grades.
          </p>
        </div>

        <div className="pfj-track-container">
          <Track variant="desktop" />
          <Track variant="mobile" />

          <ol className="contents">
            {STATIONS.map((s, i) => (
              <li key={s.num} className={`pfj-station pfj-station-${i + 1}`}>
                <div className="pfj-node" aria-hidden>
                  <div className="pfj-node-pulse" />
                </div>
                <div className={`pfj-card ${s.pos}`}>
                  <div className="pfj-step-num">{s.num}</div>
                  <h3 className="pfj-card-title">{s.title}</h3>
                  <div className="pfj-progress-track" aria-hidden>
                    <div className="pfj-progress-fill" />
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
