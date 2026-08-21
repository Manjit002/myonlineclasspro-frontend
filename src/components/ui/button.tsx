"use client";

import { forwardRef } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "rounded-full font-semibold transition-colors",
    "disabled:pointer-events-none disabled:opacity-50",
  ].join(" "),
  {
    variants: {
      variant: {
        // Colour comes from the global --btn-primary-* tokens, so this
        // and every hand-rolled primary button share one source.
        primary: "btn-primary",
        secondary:
          "bg-bg-2 text-text-primary border border-border-strong hover:border-gold/50 hover:text-gold",
        ghost: "text-text-secondary hover:text-gold hover:bg-gold-soft",
        outline:
          "border border-gold/50 text-gold hover:bg-gold-soft bg-transparent",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    Omit<HTMLMotionProps<"button">, "children">,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
}

/**
 * Reusable button. Hover/tap feedback is a small, GPU-friendly scale
 * transform (not layout-affecting properties), and respects
 * prefers-reduced-motion automatically since Framer Motion checks it
 * internally for the `whileHover`/`whileTap` gesture props.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
