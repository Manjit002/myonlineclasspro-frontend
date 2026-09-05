"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { ReviewMedia } from "@/types/review";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Full-screen media viewer. Escape closes, clicking the backdrop closes,
 * background scroll is locked while open and restored on close.
 * Portalled so no ancestor's overflow can clip it.
 */
export function ReviewLightbox({
  media,
  onClose,
}: {
  media: ReviewMedia | null;
  onClose: () => void;
}) {
  const mounted = useMounted();

  useEffect(() => {
    if (!media) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [media, onClose]);

  if (!mounted || !media) return null;
  const isVideo = (media.mediaType || "").toUpperCase() === "VIDEO";

  return createPortal(
    <div
      className="rv-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Review media"
    >
      <button
        type="button"
        className="rv-lightbox-backdrop"
        onClick={onClose}
        aria-label="Close media viewer"
        tabIndex={-1}
      />
      <button
        type="button"
        className="rv-lightbox-close"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div className="rv-lightbox-inner">
        {isVideo ? (
          <video src={media.fileUrl} controls autoPlay playsInline />
        ) : (
          // Review media comes from the backend at unknown dimensions and
          // arbitrary hosts, so a plain <img> avoids next/image's
          // remotePatterns allowlist rejecting user-uploaded URLs.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={media.fileUrl} alt="" />
        )}
      </div>
    </div>,
    document.body,
  );
}
