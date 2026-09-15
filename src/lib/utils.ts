import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges class names, resolving Tailwind conflicts sensibly (e.g. a later
 * `px-4` wins over an earlier `px-2` instead of both being applied).
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
