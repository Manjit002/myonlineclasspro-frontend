"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import {
  COUNTRIES,
  DEFAULT_COUNTRY,
  flagOf,
  type Country,
} from "@/constants/countries";

/**
 * Country code selector + 10-digit national number.
 *
 * The two controls are presentational only. The parent keeps storing a
 * single `phone` string in the shape the order API already expects —
 * "<dial> <10 digits>", e.g. "+1 9876543210" — so nothing downstream
 * changes.
 */

interface Props {
  /** Combined value, e.g. "+1 9876543210". */
  value: string;
  onChange: (combined: string) => void;
  id?: string;
  invalid?: boolean;
  describedBy?: string;
  inputClassName?: string;
}

/** Splits a stored combined value back into its two parts. */
function parse(value: string): { country: Country; national: string } {
  const trimmed = (value || "").trim();
  if (trimmed) {
    // Longest dial code first, so +1876 wins over +1.
    const match = [...COUNTRIES]
      .sort((a, b) => b.dial.length - a.dial.length)
      .find((c) => trimmed.startsWith(c.dial + " ") || trimmed === c.dial);
    if (match) {
      return {
        country: match,
        national: trimmed.slice(match.dial.length).replace(/\D/g, ""),
      };
    }
    return { country: DEFAULT_COUNTRY, national: trimmed.replace(/\D/g, "") };
  }
  return { country: DEFAULT_COUNTRY, national: "" };
}

/** Exactly one space between code and number — the stored format. */
export function combinePhone(country: Country, national: string): string {
  const digits = national.replace(/\D/g, "").slice(0, 10);
  return digits ? `${country.dial} ${digits}` : "";
}

export function PhoneField({
  value,
  onChange,
  id = "of-phone",
  invalid,
  describedBy,
  inputClassName,
}: Props) {
  const parsed = parse(value);
  const [country, setCountry] = useState<Country>(parsed.country);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const national = parse(value).national;

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q.startsWith("+") ? q : `+${q}`) ||
        c.iso.toLowerCase() === q,
    );
  }, [query]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const pick = (c: Country) => {
    setCountry(c);
    setOpen(false);
    setQuery("");
    onChange(combinePhone(c, national));
  };

  return (
    <div className="phone-field" ref={wrapRef}>
      <div className="phone-cc">
        <button
          type="button"
          className="phone-cc-btn"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label={`Country code: ${country.name} ${country.dial}`}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="phone-flag" aria-hidden>
            {flagOf(country.iso)}
          </span>
          <span className="phone-dial">{country.dial}</span>
          <ChevronDown size={13} aria-hidden />
        </button>

        {open && (
          <div
            className="phone-menu"
            role="listbox"
            aria-label="Select country"
          >
            <div className="phone-search">
              <Search size={13} aria-hidden />
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search country or code"
                aria-label="Search countries"
              />
            </div>
            <ul className="phone-list">
              {results.map((c) => (
                <li key={c.iso}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.iso === country.iso}
                    className={
                      c.iso === country.iso
                        ? "phone-opt is-active"
                        : "phone-opt"
                    }
                    onClick={() => pick(c)}
                  >
                    <span className="phone-flag" aria-hidden>
                      {flagOf(c.iso)}
                    </span>
                    <span className="phone-opt-name">{c.name}</span>
                    <span className="phone-opt-dial">{c.dial}</span>
                  </button>
                </li>
              ))}
              {!results.length && (
                <li className="phone-empty">No matching country</li>
              )}
            </ul>
          </div>
        )}
      </div>

      <input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        maxLength={10}
        value={national}
        placeholder="10-digit mobile number"
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onChange={(e) =>
          // Strip anything that isn't a digit as the user types, so the
          // stored value can never contain letters, spaces or symbols.
          onChange(combinePhone(country, e.target.value.replace(/\D/g, "")))
        }
        className={inputClassName}
      />
    </div>
  );
}
