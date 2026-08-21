"use client";

import { useState } from "react";
import type { Review, ReviewMedia } from "@/types/review";
import { relativeDate } from "@/services/review-service";

const TRUNCATE_AT = 260;

function initialsOf(name?: string) {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function ReviewCard({
  review,
  onOpenMedia,
}: {
  review: Review;
  onOpenMedia: (m: ReviewMedia) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const text = review.review ?? "";
  const isLong = text.length > TRUNCATE_AT;
  const shown = expanded || !isLong ? text : `${text.slice(0, TRUNCATE_AT)}…`;
  const rating = Math.max(0, Math.min(5, Math.round(review.rating ?? 0)));
  const media = review.media ?? [];

  return (
    <article className="rv-card">
      <header className="rv-card-head">
        <span className="rv-avatar" aria-hidden>
          {initialsOf(review.reviewerName)}
        </span>
        <div>
          <p className="rv-name">
            {review.reviewerName || "Anonymous"}
            {review.verifiedPurchase && (
              <span className="rv-verified" title="Verified purchase">
                ✓ Verified
              </span>
            )}
          </p>
          <p className="rv-meta">
            {relativeDate(review.createdAt)}
            {review.reviewSource && (
              <span className="rv-source">{review.reviewSource}</span>
            )}
          </p>
        </div>
      </header>

      <p className="rv-card-stars" aria-label={`${rating} out of 5 stars`}>
        <span aria-hidden>{"★".repeat(rating)}</span>
        <span className="rv-dim" aria-hidden>
          {"★".repeat(5 - rating)}
        </span>
      </p>

      {review.title && <h3 className="rv-card-title">{review.title}</h3>}
      {/* Rendered as JSX text, never dangerouslySetInnerHTML — API content
          is escaped automatically. */}
      <p className="rv-card-text">{shown}</p>

      {isLong && (
        <button
          type="button"
          className="rv-more"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}

      {media.length > 0 && (
        <ul className="rv-media">
          {media.map((m, i) => {
            const isVideo = (m.mediaType || "").toUpperCase() === "VIDEO";
            return (
              <li key={`${m.fileUrl}-${i}`}>
                <button
                  type="button"
                  className="rv-media-thumb"
                  onClick={() => onOpenMedia(m)}
                  aria-label={
                    isVideo ? "Play review video" : "View review photo"
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.thumbnailUrl || m.fileUrl}
                    alt=""
                    loading="lazy"
                  />
                  {isVideo && (
                    <span className="rv-play" aria-hidden>
                      ▶
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {typeof review.helpfulCount === "number" && review.helpfulCount > 0 && (
        <footer className="rv-card-foot">
          {review.helpfulCount} found this helpful
        </footer>
      )}
    </article>
  );
}
