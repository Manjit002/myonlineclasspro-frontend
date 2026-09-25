"use client";

import Image from "next/image";
import { useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { ImageAsset } from "@/constants/images";

function LogoCard({
  item,
  decorative,
}: {
  item: ImageAsset;
  decorative?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <li aria-hidden={decorative} className="marquee-card" title={item.alt}>
      {failed ? (
        // Third-party logo hosts (Wikimedia, university sites, Google
        // thumbnail caches) can go away without notice -- fall back to
        // the institution name rather than a broken-image icon.
        <span className="text-center text-xs leading-tight font-bold text-slate-700">
          {item.alt}
        </span>
      ) : (
        <Image
          src={item.src}
          alt={decorative ? "" : item.alt}
          width={200}
          height={80}
          loading="lazy"
          unoptimized
          onError={() => setFailed(true)}
        />
      )}
    </li>
  );
}

/**
 * University logo carousel. Shares the .marquee-* classes with the
 * platform strip so the two sections are visually identical by
 * construction, matching how .uni-item and .brand-item were identical
 * in the original index.html.
 */
export function LogoMarquee({
  items,
  label,
}: {
  items: ImageAsset[];
  label: string;
}) {
  const reduceMotion = useReducedMotion();
  const rendered = reduceMotion ? items : [...items, ...items];

  return (
    <div className="marquee-viewport" role="group" aria-label={label}>
      {/* Slightly slower than the platform strip because this list is
          twice as long -- keeps the two perceived speeds similar. */}
      <ul className="marquee-track [--marquee-duration:60s]">
        {rendered.map((item, i) => (
          <LogoCard
            key={`${item.src}-${i}`}
            item={item}
            decorative={!reduceMotion && i >= items.length}
          />
        ))}
      </ul>
    </div>
  );
}
