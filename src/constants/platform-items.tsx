import type { ReactNode } from "react";

/**
 * Learning-platform logos, taken verbatim from the original index.html.
 *
 * Seven of these are hand-drawn inline SVG recreations of each brand"s
 * mark that already existed in the original project -- they are the
 * real assets, not text stand-ins, so they are reused exactly rather
 * than substituted for third-party logo files. The remaining four are
 * the PNGs the original loaded from the portals/ set.
 *
 * SVG attributes are converted to their JSX equivalents (font-size ->
 * fontSize etc.); the geometry, colours and text are unchanged.
 */
export interface PlatformItem {
  name: String_;
  /** Inline SVG artwork, or an image when the original used a file. */
  art: ReactNode | { src: string; alt: string };
}
type String_ = string;

export const PLATFORM_ITEMS: PlatformItem[] = [
  {
    name: "Canvas",
    art: (
      <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="7" fill="#E66000" opacity="1" />
        <circle cx="30" cy="12" r="5.5" fill="#E66000" opacity=".75" />
        <circle cx="30" cy="48" r="5.5" fill="#E66000" opacity=".75" />
        <circle cx="46" cy="21" r="5.5" fill="#E66000" opacity=".75" />
        <circle cx="46" cy="39" r="5.5" fill="#E66000" opacity=".75" />
        <circle cx="14" cy="21" r="5.5" fill="#E66000" opacity=".75" />
        <circle cx="14" cy="39" r="5.5" fill="#E66000" opacity=".75" />
        <text
          x="60"
          y="35"
          fontFamily="Arial"
          fontSize="15"
          fontWeight="600"
          fill="#555"
          letterSpacing="-0.5"
        >
          canvas
        </text>
      </svg>
    ),
  },
  {
    name: "Lone Star College",
    art: (
      <svg viewBox="0 0 130 60" xmlns="http://www.w3.org/2000/svg">
        <polygon
          points="22,4 27,18 42,18 30,27 35,41 22,32 9,41 14,27 2,18 17,18"
          fill="none"
          stroke="#003087"
          strokeWidth="2.5"
        />
        <text
          x="48"
          y="24"
          fontFamily="Arial"
          fontSize="10"
          fontWeight="800"
          fill="#003087"
        >
          LONE STAR
        </text>
        <text
          x="48"
          y="37"
          fontFamily="Arial"
          fontSize="10"
          fontWeight="800"
          fill="#003087"
        >
          COLLEGE
        </text>
      </svg>
    ),
  },
  {
    name: "Pearson",
    art: (
      <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="22" cy="30" r="20" fill="#007FA3" />
        <text
          x="11"
          y="38"
          fontFamily="Georgia"
          fontSize="26"
          fontWeight="700"
          fill="white"
        >
          P
        </text>
        <text
          x="48"
          y="35"
          fontFamily="Arial"
          fontSize="18"
          fontWeight="600"
          fill="#007FA3"
        >
          Pearson
        </text>
      </svg>
    ),
  },
  {
    name: "WebAssign",
    art: (
      <svg viewBox="0 0 130 60" xmlns="http://www.w3.org/2000/svg">
        <text
          x="4"
          y="32"
          fontFamily="Arial"
          fontSize="18"
          fontWeight="400"
          fill="#555"
        >
          Web
        </text>
        <text
          x="46"
          y="32"
          fontFamily="Arial"
          fontSize="18"
          fontWeight="800"
          fill="#009C54"
        >
          Assign
        </text>
        <text x="4" y="46" fontFamily="Arial" fontSize="7" fill="#888">
          Smart learning. Inspired teaching.
        </text>
      </svg>
    ),
  },
  {
    name: "Cengage",
    art: (
      <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="14" cy="18" r="6" fill="#00AEEF" opacity=".9" />
        <circle cx="28" cy="10" r="5" fill="#00AEEF" opacity=".7" />
        <circle cx="28" cy="26" r="5" fill="#00AEEF" opacity=".7" />
        <circle cx="8" cy="32" r="4" fill="#00AEEF" opacity=".5" />
        <text
          x="38"
          y="28"
          fontFamily="Arial"
          fontSize="16"
          fontWeight="800"
          fill="#005B8E"
          letterSpacing="1"
        >
          CENGAGE
        </text>
      </svg>
    ),
  },
  {
    name: "ALEKS",
    art: (
      <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="10" width="18" height="14" rx="2" fill="#C8102E" />
        <text
          x="3"
          y="21"
          fontFamily="Arial"
          fontSize="8"
          fontWeight="800"
          fill="white"
        >
          Mc
        </text>
        <text
          x="24"
          y="30"
          fontFamily="Arial"
          fontSize="22"
          fontWeight="900"
          fill="#C8102E"
          letterSpacing="1"
        >
          ALEKS
        </text>
        <text x="24" y="45" fontFamily="Arial" fontSize="9" fill="#555">
          Student Experience
        </text>
      </svg>
    ),
  },
  {
    name: "Blackboard",
    art: (
      <svg viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="4" width="90" height="52" rx="8" fill="#C8A84B" />
        <rect x="8" y="7" width="84" height="46" rx="6" fill="#1A1A1A" />
        <text
          x="16"
          y="46"
          fontFamily="Georgia"
          fontSize="34"
          fontWeight="700"
          fill="#C8A84B"
        >
          Bb
        </text>
      </svg>
    ),
  },
  {
    name: "StraighterLine",
    art: {
      src: "https://hirecoursenerds.com/assets/img/portals/img1.png",
      alt: "StraighterLine Online Learning",
    },
  },
  {
    name: "Study.com",
    art: {
      src: "https://hirecoursenerds.com/assets/img/portals/img3.png",
      alt: "Study.com Learning Platform",
    },
  },
  {
    name: "Knewton",
    art: {
      src: "https://hirecoursenerds.com/assets/img/portals/img4.png",
      alt: "Knewton Adaptive Learning",
    },
  },
  {
    name: "Sophia",
    art: {
      src: "https://hirecoursenerds.com/assets/img/portals/img12.png",
      alt: "Sophia Learning Platform",
    },
  },
];
