"use client";

import { useCallback, useRef } from "react";
import { EXPERTS, type Expert } from "@/constants/experts-data";

/**
 * Per-subject shuffle-bag expert rotation.
 *
 * Reproduces the original page's behaviour rather than "pick a random
 * one" or "always show the first":
 *
 *  - Each subject keeps its own independent queue.
 *  - A queue is a Fisher-Yates shuffle of that subject's experts, drawn
 *    from the front, so every expert appears once before any repeats.
 *  - When a queue empties it reshuffles, and if the reshuffled queue
 *    would open with the expert just shown, that entry is swapped with
 *    the next one — preventing a back-to-back repeat across the seam.
 *  - Queues live in a ref, so they survive re-renders and switching
 *    subjects and coming back continues where that subject left off,
 *    for the lifetime of the page session.
 */
type Queues = Record<string, number[]>;

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function useExpertMatcher() {
  const queues = useRef<Queues>({});
  const lastShown = useRef<Record<string, number>>({});

  return useCallback((subject: string): Expert | null => {
    const pool = EXPERTS.filter((e) => e.subject === subject);
    if (pool.length === 0) return null;

    let queue = queues.current[subject];

    if (!queue || queue.length === 0) {
      queue = shuffle(pool.map((_, i) => i));
      // Avoid an immediate repeat across the reshuffle boundary.
      const prev = lastShown.current[subject];
      if (queue.length > 1 && prev !== undefined && queue[0] === prev) {
        [queue[0], queue[1]] = [queue[1], queue[0]];
      }
    }

    const idx = queue.shift() as number;
    queues.current[subject] = queue;
    lastShown.current[subject] = idx;

    return pool[idx];
  }, []);
}
