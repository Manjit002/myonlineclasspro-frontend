"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMounted } from "@/hooks/use-mounted";

/**
 * Moon icon in light mode (click to go dark), sun icon in dark mode
 * (click to go light) -- the icon shown always represents the mode
 * you're about to switch TO, matching common convention.
 *
 * `mounted` guards against rendering the wrong icon during SSR: the
 * server has no way to know the visitor's stored preference, so this
 * renders a neutral placeholder until the client has hydrated and
 * next-themes has resolved the real value. This is the theme-equivalent
 * of avoiding a flash of incorrect content, applied to the toggle icon
 * itself rather than the page background.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) {
    return <div className="theme-toggle" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
