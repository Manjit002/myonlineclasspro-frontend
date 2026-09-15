"use client";

import { useEffect, useRef, useState } from "react";

export interface CountUpSpec {
  /** Target number to count to. */
  to: number;
  /** Decimal places to show while counting and at rest. */
  decimals?: number;
  /** Rendered before the number, e.g. "" for most. */
  prefix?: string;
  /** Rendered after the number, e.g. "%", "/10", "K+", "★". */
  suffix?: string;
}

/**
 * Counts from 0 to `to` once, when the element first scrolls into view.
 *
 * Notes on the approach:
 *
 * - Driven by requestAnimationFrame against a timestamp rather than an
 *   interval, so the duration is wall-clock accurate regardless of frame
 *   rate and there is no timer left running afterwards.
 * - Eased with easeOutExpo, which moves quickly at first and settles
 *   into the final value — that decelerating finish is what makes the
 *   effect read as deliberate rather than mechanical.
 * - Fires once (the observer unobserves on first intersection), so
 *   scrolling back and forth doesn't restart it.
 * - Under prefers-reduced-motion the final value renders immediately.
 * - The final frame assigns `to` exactly, so the value can never land on
 *   99.94999 from floating-point drift.
 */
export function CountUp({
  to,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 2400,
}: CountUpSpec & { duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Decided once at first render rather than switched on inside an
  // effect: reduced-motion users then never see a frame of "0" before
  // the real value, and no state is set from the effect body.
  const shouldAnimate =
    typeof window !== "undefined" &&
    "IntersectionObserver" in window &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [value, setValue] = useState(shouldAnimate ? 0 : to);
  const [done, setDone] = useState(!shouldAnimate);

  useEffect(() => {
    const el = ref.current;
    if (!el || !shouldAnimate) return;

    let raf = 0;
    let start = 0;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(to * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Land on the exact target rather than an eased approximation.
        setValue(to);
        setDone(true);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          raf = requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration, shouldAnimate]);

  const shown = done ? to : value;

  return (
    // The server renders the final value (good for SEO and no-JS), while
    // the client deliberately starts at 0 before animating. That is a
    // legitimate server/client difference, so the mismatch warning is
    // suppressed here rather than worked around by delaying the render.
    <span ref={ref} suppressHydrationWarning>
      {prefix}
      {shown.toFixed(decimals)}
      {suffix}
    </span>
  );
}
