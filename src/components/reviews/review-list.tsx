"use client";

import { useEffect, useMemo, useState } from "react";
import { ReviewCard } from "./review-card";
import { ReviewLightbox } from "./review-lightbox";
import { CardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { fetchReviews } from "@/services/review-service";
import type { Review, ReviewMedia } from "@/types/review";

const FILTERS = [
  { value: "all", label: "All Reviews" },
  { value: "5", label: "5 Stars" },
  { value: "4", label: "4 Stars" },
  { value: "3", label: "3 Stars" },
  { value: "2", label: "2 Stars" },
  { value: "1", label: "1 Star" },
  { value: "media", label: "With Media" },
];

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; reviews: Review[] };

export function ReviewList() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("recent");
  const [lightbox, setLightbox] = useState<ReviewMedia | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchReviews(controller.signal).then((r) => {
      if (controller.signal.aborted) return;
      setState(
        r.ok
          ? { status: "ready", reviews: r.data }
          : { status: "error", message: r.error },
      );
    });
    return () => controller.abort();
  }, [reloadKey]);

  // Filter + sort locally; the API is fetched once, not per interaction.
  const visible = useMemo(() => {
    if (state.status !== "ready") return [];
    let list = state.reviews;
    if (filter === "media") {
      list = list.filter((r) => (r.media?.length ?? 0) > 0);
    } else if (filter !== "all") {
      list = list.filter((r) => Math.round(r.rating ?? 0) === Number(filter));
    }
    const sorted = [...list];
    if (sort === "highest") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sort === "lowest") {
      sorted.sort((a, b) => (a.rating ?? 0) - (b.rating ?? 0));
    } else {
      sorted.sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime(),
      );
    }
    return sorted;
  }, [state, filter, sort]);

  return (
    <>
      <div className="rv-controls">
        <div className="rv-filters" role="group" aria-label="Filter reviews">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className="rv-filter"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="rv-sort">
          <label htmlFor="rv-sort-select" className="sr-only">
            Sort reviews
          </label>
          <select
            id="rv-sort-select"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {state.status === "loading" && (
        <>
          <span className="sr-only" role="status">
            Loading reviews…
          </span>
          <div className="rv-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </>
      )}

      {state.status === "error" && (
        <div className="rv-error-box" role="alert">
          <p>{state.message}</p>
          <button
            type="button"
            className="rv-more"
            onClick={() => {
              // Reset to loading here rather than inside the effect, so
              // the retry is driven by the interaction that caused it.
              setState({ status: "loading" });
              setReloadKey((k) => k + 1);
            }}
          >
            Try again
          </button>
        </div>
      )}

      {state.status === "ready" && visible.length === 0 && (
        <EmptyState
          title="No reviews to show"
          description="No reviews match this filter yet. Try a different filter, or be the first to share your experience."
        />
      )}

      {state.status === "ready" && visible.length > 0 && (
        <div className="rv-grid">
          {visible.map((r) => (
            <ReviewCard key={r.id} review={r} onOpenMedia={setLightbox} />
          ))}
        </div>
      )}

      <ReviewLightbox media={lightbox} onClose={() => setLightbox(null)} />
    </>
  );
}
