"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useMounted } from "@/hooks/use-mounted";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** `full` widens the panel for media viewers. Defaults to `md`. */
  size?: "md" | "full";
  children: React.ReactNode;
}

/**
 * Accessible dialog: Escape closes it, focus moves inside on open and
 * is trapped while it's open, background scroll is locked, and the
 * overlay click closes. Rendered through a portal so it isn't clipped
 * by any ancestor's overflow rules.
 */
export function Modal({
  open,
  onClose,
  title,
  size = "md",
  children,
}: ModalProps) {
  const mounted = useMounted();
  const panelRef = useRef<HTMLDivElement>(null);

  // Callers pass an inline arrow, so `onClose` has a new identity on every
  // render. Keeping it in a ref means the effect below depends only on
  // `open` -- otherwise it tore down and re-attached the key listener
  // continuously, and its cleanup kept pulling focus back out of the
  // dialog, which stopped Escape working at all.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (e.key !== "Tab") return;

      // Focus trap: cycle within the dialog rather than escaping to the
      // page behind it, which would strand keyboard users.
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      // Return focus to whatever opened the dialog.
      previouslyFocused?.focus();
    };
  }, [open]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className={[
            // The site navbar is z-index:1000 and fixed, so the previous
            // z-[60] put the whole dialog underneath it — the close button
            // measured as present but was not clickable. Raised above the
            // navbar (and above the chat toast layer at 1200) rather than
            // lowering the navbar, which would affect every other page.
            "fixed inset-0 z-[1300] flex items-center justify-center",
            // Tighter gutters for media so the image, not the chrome,
            // gets the phone's width.
            size === "full" ? "p-2 sm:p-4" : "p-4",
          ].join(" ")}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={[
              "border-border bg-bg-1 relative w-full rounded-lg border shadow-2xl outline-none",
              // `md` is the dialog width used by every existing modal.
              // `full` is for media: the panel gets out of the way so the
              // image can use the viewport instead of a 512px column.
              size === "full"
                ? // Column layout so the header keeps its height and the
                  // image can only ever use the space left over — it can
                  // never grow the panel past the viewport and push the
                  // close button off-screen. dvh tracks mobile browser
                  // chrome; vh is the fallback for older engines.
                  "flex max-h-[96vh] max-h-[calc(100dvh-1.5rem)] max-w-[96vw] flex-col overflow-hidden p-3 sm:p-4"
                : "max-w-lg p-6",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-start justify-between gap-4",
                size === "full" ? "mb-3 shrink-0" : "mb-4",
              ].join(" ")}
            >
              <h2 className="card-h text-text-primary">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className={[
                  "flex shrink-0 items-center justify-center rounded-full transition-colors",
                  size === "full"
                    ? // Anchored to the viewport, not to the panel, so it
                      // cannot be pushed out of reach by a tall screenshot,
                      // and carries its own opaque backdrop so the x stays
                      // legible over a light or dark image.
                      "modal-close-float"
                    : "text-text-secondary hover:bg-gold-soft hover:text-gold h-9 w-9",
                ].join(" ")}
              >
                <X size={18} />
              </button>
            </div>
            {size === "full" ? (
              <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                {children}
              </div>
            ) : (
              children
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
