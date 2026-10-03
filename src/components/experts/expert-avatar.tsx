import type { Expert } from "@/constants/experts-data";

/**
 * Monogram avatar. The original drew these as inline SVG with a
 * per-expert gradient; reproduced here as a small component so the
 * 100 cards don't each carry duplicated SVG markup.
 */
export function ExpertAvatar({ expert }: { expert: Expert }) {
  const gid = `eg-${expert.id}`;
  return (
    <svg
      viewBox="0 0 48 48"
      className="exp-avatar-svg"
      role="img"
      aria-label={`Avatar for ${expert.name}`}
    >
      <defs>
        <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={expert.gradient[0]} />
          <stop offset="100%" stopColor={expert.gradient[1]} />
        </linearGradient>
      </defs>
      <rect width="48" height="48" fill={`url(#${gid})`} />
      <circle cx="27" cy="19" r="25" fill="#ffffff" opacity="0.1" />
      <circle cx="16" cy="16" r="17" fill="#04080f" opacity="0.12" />
      <text
        x="24"
        y="30"
        fontFamily="var(--font-bebas-neue), sans-serif"
        fontSize="17"
        fill="#04080f"
        textAnchor="middle"
        opacity="0.85"
      >
        {expert.initials}
      </text>
    </svg>
  );
}
