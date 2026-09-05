"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { EXPERT_CARDS } from "@/constants/expert-cards";

const GAP = 24; // must match .expert-carousel-track's gap

/** Visible slot count, matching the original's breakpoints exactly. */
function visibleCount(width: number) {
  if (width >= 1200) return 4;
  if (width >= 900) return 3;
  if (width >= 600) return 2;
  return 1;
}

/**
 * "Get Expert Academic Help" carousel.
 *
 * Reproduces the original's infinite-clone approach: a copy of the last
 * N cards is prepended and a copy of the first N appended, so stepping
 * past either end lands on a clone that looks identical to the real
 * card. The transition is then disabled for one frame while the track
 * snaps back to the real index -- which is why the loop has no visible
 * rewind.
 *
 * N depends on how many cards are visible, so the clone set is rebuilt
 * on resize.
 */
export function ExpertCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(4);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const busy = useRef(false);

  const total = EXPERT_CARDS.length;

  useEffect(() => {
    const onResize = () => setVisible(visibleCount(window.innerWidth));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Prepend the last `visible` cards and append the first `visible`.
  const lead = EXPERT_CARDS.slice(-visible);
  const tail = EXPERT_CARDS.slice(0, visible);
  const rendered = [...lead, ...EXPERT_CARDS, ...tail];

  const step = useCallback((dir: number) => {
    if (busy.current) return;
    busy.current = true;
    setAnimate(true);
    setIndex((i) => i + dir);
  }, []);

  // After the slide finishes, if we've landed on a clone, jump to the
  // matching real card with the transition off so the swap is invisible.
  const onTransitionEnd = () => {
    busy.current = false;
    if (index >= total) {
      setAnimate(false);
      setIndex(index - total);
    } else if (index < 0) {
      setAnimate(false);
      setIndex(index + total);
    }
  };

  // Re-enable the transition on the frame after a silent jump.
  useEffect(() => {
    if (!animate) {
      const id = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(id);
    }
  }, [animate]);

  // Auto-advance, paused while the pointer is over the carousel.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => step(1), 4500);
    return () => clearInterval(id);
  }, [paused, step]);

  // Track offset: one leading clone-set plus the current index.
  const cardPct = 100 / visible;
  const offset = `calc(${-(index + visible) * cardPct}% - ${(index + visible) * (GAP - GAP / visible)}px)`;

  const activeDot = ((index % total) + total) % total;

  return (
    <>
      <div
        className="expert-carousel-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="expert-carousel-track"
          style={{
            transform: `translate3d(${offset}, 0, 0)`,
            transition: animate ? undefined : "none",
          }}
          onTransitionEnd={onTransitionEnd}
        >
          {rendered.map((card, i) => {
            const isClone = i < visible || i >= visible + total;
            return (
              <div
                key={`${card.title}-${i}`}
                className="ecard"
                // Clones duplicate real content -- hide them from AT so
                // each card is announced once.
                aria-hidden={isClone}
              >
                <div className="ecard-img">
                  <div className="ecard-img-inner">
                    <Image
                      src={card.img}
                      alt={isClone ? "" : card.alt}
                      width={400}
                      height={260}
                      unoptimized
                      loading="lazy"
                    />
                  </div>
                </div>
                <div className="ecard-body">
                  <div className="ecard-title">{card.title}</div>
                  <div className="ecard-text">{card.text}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="expert-controls">
        <button
          type="button"
          className="expert-arrow"
          onClick={() => step(-1)}
          aria-label="Previous cards"
        >
          &#9664;
        </button>
        <div className="expert-dots">
          {EXPERT_CARDS.map((card, i) => (
            <button
              key={card.title}
              type="button"
              className={["edot", i === activeDot && "active"]
                .filter(Boolean)
                .join(" ")}
              onClick={() => {
                setAnimate(true);
                setIndex(i);
              }}
              aria-label={`Go to card ${i + 1}: ${card.title}`}
              aria-current={i === activeDot}
            />
          ))}
        </div>
        <button
          type="button"
          className="expert-arrow"
          onClick={() => step(1)}
          aria-label="Next cards"
        >
          &#9654;
        </button>
      </div>
    </>
  );
}
