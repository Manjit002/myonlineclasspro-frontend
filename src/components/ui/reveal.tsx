"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  /** Stagger offset in seconds, for revealing a list of items in sequence. */
  delay?: number;
  className?: string;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Wraps content that should fade/slide in once it scrolls into view.
 * `viewport={{ once: true }}` means the animation plays a single time per
 * element rather than replaying on every scroll up/down, which is both
 * the more common expectation for this kind of reveal and cheaper to
 * compute. Framer Motion's viewport observer is IntersectionObserver-based
 * under the hood, so this doesn't run a scroll listener per element.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
