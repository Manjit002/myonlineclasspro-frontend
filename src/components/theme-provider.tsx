"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * Thin wrapper around next-themes.
 *
 * next-themes is used deliberately rather than a hand-rolled toggle: it
 * injects a blocking inline script before hydration so the correct theme
 * class is present on <html> before first paint (no flash of the wrong
 * theme), reads the OS preference on first visit via
 * `prefers-color-scheme`, and persists the explicit choice to
 * localStorage once the user picks one -- exactly the three requirements
 * from the spec, already solved and well-tested rather than reimplemented.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
