"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  /** Disables the lift/glow hover treatment for static, non-interactive cards. */
  interactive?: boolean;
}

/**
 * Reusable card, carrying forward the original site's signature hover
 * treatment (corner glow + lift), reimplemented as a real component
 * instead of the original's nth-of-type CSS color-cycling hack.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = true, children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group border-border bg-bg-2 relative overflow-hidden rounded-lg border p-6",
          interactive && "hover:border-gold/40 transition-colors",
          className,
        )}
        whileHover={interactive ? { y: -6 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        {...props}
      >
        {interactive && (
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute -top-8 -right-8 h-32 w-32 rounded-full",
              "bg-gold/0 blur-2xl transition-all duration-500",
              "group-hover:bg-gold/20",
            )}
          />
        )}
        <div className="relative">{children}</div>
      </motion.div>
    );
  },
);
Card.displayName = "Card";

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-text-primary group-hover:text-gold text-xl tracking-wide transition-colors",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-text-secondary mt-2 text-sm leading-relaxed",
        className,
      )}
      {...props}
    />
  );
}
