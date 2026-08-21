"use client";

import { useMemo, useState } from "react";
import { ExpertCard } from "./expert-card";
import { EXPERTS, SUBJECT_FILTERS } from "@/constants/experts-data";
import { SITE } from "@/constants/site";

/**
 * Browse All Experts: subject filter + live search, combined.
 *
 * Filtering is a useMemo over the static dataset rather than DOM
 * queries — 100 cards re-filter instantly with no listeners to manage.
 */
export function ExpertDirectory() {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXPERTS.filter((e) => {
      const matchesSubject = filter === "all" || e.subject === filter;
      if (!matchesSubject) return false;
      if (!q) return true;
      // Original matched on name and subject; role carries the readable
      // subject text ("Accounting Expert"), so both are searched.
      return (
        e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <>
      <div className="exp-controls">
        <label className="sr-only" htmlFor="expert-search">
          Search experts
        </label>
        <input
          id="expert-search"
          type="search"
          className="exp-search"
          placeholder="Search by name or subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div
          className="exp-filters"
          role="group"
          aria-label="Filter by subject"
        >
          {SUBJECT_FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              className="exp-filter"
              aria-pressed={filter === f.value}
              onClick={() => setFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <p className="exp-count" aria-live="polite">
        Showing <strong>{results.length}</strong> of {EXPERTS.length} experts
      </p>

      {results.length === 0 ? (
        <div className="exp-empty">
          <p>No experts match that search.</p>
          <a
            className="exp-cta"
            href={SITE.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            Ask us on WhatsApp
          </a>
        </div>
      ) : (
        <div className="exp-grid">
          {results.map((e, i) => (
            <ExpertCard key={e.id} expert={e} index={i} />
          ))}
        </div>
      )}
    </>
  );
}
