"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { GRADE_SCREENSHOTS } from "@/constants/images";

/**
 * Carousel of real gradebook screenshots.
 *
 * One screenshot at a time on a CSS-transformed track — no carousel
 * dependency, and no per-slide mount/unmount, so there is no flicker.
 * The viewport holds a fixed aspect ratio and images use object-contain,
 * so nothing is cropped and the height never shifts between slides of
 * different proportions.
 *
 * Clicking through to full size reuses the shared Modal, which already
 * handles focus trapping and Escape.
 */

const AUTOPLAY_MS = 3800;
/** Dots are windowed: 20 raw dots would be an unreadable strip. */
const DOT_WINDOW = 7;
const SWIPE_THRESHOLD = 48;

export function GradeProof() {
  const total = GRADE_SCREENSHOTS.length;
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total),
    [total],
  );
  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  // Autoplay. Keying the timer on `index` means any advance — automatic
  // or manual — restarts the full delay, so a click never lands right
  // before an auto-advance. Paused while the lightbox is open or the
  // carousel is hovered/focused.
  const paused = lightbox || hovered;
  useEffect(() => {
    if (paused) return;
    const id = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, paused, next]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  /* Pointer events cover mouse and touch in one path. The live offset
     makes the drag feel native rather than snap-on-release. */
  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startX.current = e.clientX;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
  };
  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    const dx = dragX;
    setDragX(0);
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else prev();
    }
  };

  // Windowed dots, clamped so the strip never runs off either end.
  const half = Math.floor(DOT_WINDOW / 2);
  let dotStart = Math.max(0, index - half);
  dotStart = Math.min(dotStart, Math.max(0, total - DOT_WINDOW));
  const dots = Array.from(
    { length: Math.min(DOT_WINDOW, total) },
    (_, i) => dotStart + i,
  );

  const current = GRADE_SCREENSHOTS[index];

  return (
    <>
      <div
        className="gp-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="Verified student result screenshots"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
      >
        <div
          className="gp-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          <div
            className="gp-track"
            style={{
              transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
              transition:
                dragging || reduced
                  ? "none"
                  : "transform .55s cubic-bezier(.22,1,.36,1)",
            }}
          >
            {GRADE_SCREENSHOTS.map((shot, i) => (
              <div
                className="gp-slide"
                key={shot.src}
                aria-hidden={i !== index}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${total}`}
              >
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  width={1200}
                  height={750}
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  unoptimized
                  draggable={false}
                  className="gp-img"
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className="gp-expand"
            onClick={() => setLightbox(true)}
            aria-label={`View full size: ${current.alt}`}
          >
            <Maximize2 size={15} aria-hidden />
            <span>View full size</span>
          </button>
        </div>

        <div className="gp-controls">
          <button
            type="button"
            className="gp-arrow"
            onClick={prev}
            aria-label="Previous screenshot"
          >
            <ChevronLeft size={18} aria-hidden />
          </button>

          <div
            className="gp-dots"
            role="tablist"
            aria-label="Choose screenshot"
          >
            {dotStart > 0 && <span className="gp-dot is-edge" aria-hidden />}
            {dots.map((i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Screenshot ${i + 1} of ${total}`}
                className={["gp-dot", i === index && "is-active"]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setIndex(i)}
              />
            ))}
            {dotStart + DOT_WINDOW < total && (
              <span className="gp-dot is-edge" aria-hidden />
            )}
          </div>

          <button
            type="button"
            className="gp-arrow"
            onClick={next}
            aria-label="Next screenshot"
          >
            <ChevronRight size={18} aria-hidden />
          </button>
        </div>

        <p className="gp-counter" aria-live="polite">
          {index + 1} / {total}
        </p>
      </div>

      <Modal
        open={lightbox}
        onClose={() => setLightbox(false)}
        title={current.alt}
        size="full"
      >
        {/* Only one source exists per screenshot, so the same file is
            used; the sizing constraints are what change. width/height
            are intrinsic hints for Next's Image -- the rendered size is
            driven entirely by the CSS below. */}
        <Image
          src={current.src}
          alt={current.alt}
          width={2400}
          height={1600}
          sizes="96vw"
          unoptimized
          priority
          className="gp-lightbox-img"
        />
      </Modal>
    </>
  );
}
