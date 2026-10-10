"use client";

import Image from "next/image";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import { PLATFORM_ITEMS, type PlatformItem } from "@/constants/platform-items";

function isImageArt(
  art: PlatformItem["art"],
): art is { src: string; alt: string } {
  return typeof art === "object" && art !== null && "src" in art;
}

function PlatformCard({
  item,
  decorative,
}: {
  item: PlatformItem;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const art = item.art;

  return (
    <li
      // The duplicated half of the track is decorative -- hiding it stops
      // screen readers announcing every platform twice.
      aria-hidden={decorative}
      className="marquee-card"
      title={item.name}
    >
      {isImageArt(art) ? (
        failed ? (
          // The four PNGs are third-party hosted; if one 404s, show the
          // brand name rather than a broken-image icon in an empty card.
          <span className="text-center text-sm font-bold text-slate-700">
            {item.name}
          </span>
        ) : (
          <Image
            src={art.src}
            alt={decorative ? "" : art.alt}
            width={200}
            height={80}
            loading="lazy"
            unoptimized
            onError={() => setFailed(true)}
          />
        )
      ) : (
        // Inline SVG from the original -- no network request, so it can
        // never fail to load.
        art
      )}
    </li>
  );
}

/**
 * Learning-platform logo carousel.
 *
 * Uses the same .marquee-* classes as the university strip, so both
 * sections are the same component shape with different content -- card
 * size, radius, shadow, gap, fade width, hover and loop all come from
 * one place rather than two implementations that happen to agree.
 */
export function PlatformMarquee({ label }: { label: string }) {
  const reduceMotion = useReducedMotion();
  const items = reduceMotion
    ? PLATFORM_ITEMS
    : [...PLATFORM_ITEMS, ...PLATFORM_ITEMS];

  return (
    <div className="marquee-viewport" role="group" aria-label={label}>
      <ul className="marquee-track">
        {items.map((item, i) => (
          <PlatformCard
            key={`${item.name}-${i}`}
            item={item}
            decorative={!reduceMotion && i >= PLATFORM_ITEMS.length}
          />
        ))}
      </ul>
    </div>
  );
}
