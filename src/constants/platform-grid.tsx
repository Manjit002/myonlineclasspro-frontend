import type { ReactNode } from "react";

/**
 * Platforms for the "Comprehensive Academic Support Across All Online
 * Platforms" grid.
 *
 * Sourced from the original index.html platforms-section, which is a
 * different (and longer) list than the brands marquee: 14 entries, each
 * with a category tag. The original renders these as CSS-styled brand
 * wordmarks rather than image files, so the mark and its brand colour
 * are reproduced here; no external logo files are involved, which means
 * nothing here can 404.
 */
export interface PlatformGridItem {
  name: string;
  /** Category shown beneath the name, e.g. "MyLab & Mastering". */
  tag: string;
  logo: ReactNode;
}

export const PLATFORM_GRID: PlatformGridItem[] = [
  {
    name: "Canvas",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{
          color: "#e13f42",
          fontWeight: 800,
          fontSize: "1.15rem",
          letterSpacing: ".02em",
        }}
      >
        CANVAS
      </span>
    ),
  },
  {
    name: "Blackboard",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{
          background: "#111",
          color: "#f0a500",
          border: "2px solid #f0a500",
          borderRadius: 4,
          padding: "2px 10px",
          fontWeight: 800,
          fontSize: "1.3rem",
        }}
      >
        Bb
      </span>
    ),
  },
  {
    name: "Pearson",
    tag: "MyLab & Mastering",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#111", fontWeight: 700, fontSize: "1rem" }}
      >
        <span
          style={{
            background: "#0f7fb8",
            color: "#fff",
            borderRadius: "50%",
            width: 20,
            height: 20,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: ".8rem",
            marginRight: 5,
          }}
        >
          P
        </span>
        Pearson
      </span>
    ),
  },
  {
    name: "Cengage",
    tag: "MindTap",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#00a3e0", fontWeight: 800, fontSize: "1.1rem" }}
      >
        CENGAGE
      </span>
    ),
  },
  {
    name: "ALEKS",
    tag: "McGraw-Hill",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#c8102e", fontWeight: 800, fontSize: "1.2rem" }}
      >
        ALEKS
      </span>
    ),
  },
  {
    name: "WebAssign",
    tag: "Cengage",
    logo: (
      <span
        className="pl-mark"
        style={{ fontWeight: 700, fontSize: "1.05rem" }}
      >
        <span style={{ color: "#333" }}>Web</span>
        <span style={{ color: "#2e8b3d" }}>Assign</span>
      </span>
    ),
  },
  {
    name: "Brightspace",
    tag: "D2L",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#e8600a", fontWeight: 700, fontSize: ".95rem" }}
      >
        brightspace
      </span>
    ),
  },
  {
    name: "D2L Brightspace",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#1a1a2e", fontWeight: 800, fontSize: "1.05rem" }}
      >
        D2L Brightspace
      </span>
    ),
  },
  {
    name: "Moodle",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{
          color: "#f37021",
          fontWeight: 700,
          fontSize: "1.15rem",
          fontStyle: "italic",
        }}
      >
        moodle
      </span>
    ),
  },
  {
    name: "WileyPLUS",
    tag: "Wiley",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#2b5faa", fontWeight: 800, fontSize: "1.05rem" }}
      >
        WileyPLUS
      </span>
    ),
  },
  {
    name: "StraighterLine",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#c8102e", fontWeight: 800, fontSize: "1.3rem" }}
      >
        SL
      </span>
    ),
  },
  {
    name: "Study.com",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#1a1a2e", fontWeight: 700, fontSize: "1rem" }}
      >
        Study.com
      </span>
    ),
  },
  {
    name: "Knewton",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#2b5faa", fontWeight: 700, fontSize: ".98rem" }}
      >
        Knewton
      </span>
    ),
  },
  {
    name: "Sophia",
    tag: "LMS",
    logo: (
      <span
        className="pl-mark"
        style={{ color: "#6b4c9a", fontWeight: 700, fontSize: "1.05rem" }}
      >
        SOPHIA
      </span>
    ),
  },
];
