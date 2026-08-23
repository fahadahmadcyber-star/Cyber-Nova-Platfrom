import React from "react";

/* Geometric "Nova" mark: a hexagonal core with circuit traces and an orbiting ring. */
export const LogoMark: React.FC<{ size?: number }> = ({ size = 40 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,.45))" }}
    >
      <defs>
        <linearGradient id="lg-core" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#67e8f9" />
          <stop offset="0.55" stopColor="#22d3ee" />
          <stop offset="1" stopColor="#34d399" />
        </linearGradient>
      </defs>
      {/* orbit ring */}
      <ellipse cx="32" cy="32" rx="28" ry="10.5" stroke="#22d3ee" strokeOpacity="0.35" strokeWidth="1.4" transform="rotate(38 32 32)" strokeDasharray="4 3" />
      {/* hexagon shield */}
      <path
        d="M32 4 L55 16 V40 L32 60 L9 40 V16 Z"
        fill="rgba(8,15,32,0.85)"
        stroke="url(#lg-core)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      {/* inner circuit traces */}
      <path d="M32 12 L42 17 L42 30" stroke="#22d3ee" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      <path d="M32 12 L22 17 L22 34 L28 40" stroke="#34d399" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      {/* nodes */}
      <circle cx="42" cy="30" r="2.4" fill="#22d3ee" />
      <circle cx="22" cy="34" r="2.4" fill="#34d399" />
      {/* central nucleus */}
      <circle cx="32" cy="32" r="6.5" fill="url(#lg-core)" opacity="0.9" />
      <circle cx="32" cy="32" r="2.6" fill="#04141f" />
      <circle cx="32" cy="32" r="1.1" fill="#a7f3d0" />
    </svg>
  );
};

export const Logo: React.FC<{ size?: number; withText?: boolean; compact?: boolean }> = ({
  size = 40,
  withText = true,
  compact = false,
}) => {
  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <LogoMark size={size} />
      {withText && (
        <span className="leading-none">
          <span
            className="block font-black tracking-[0.14em] neon-text"
            style={{ fontFamily: "var(--font-display)", fontSize: compact ? 14 : 17 }}
          >
            CYBER·NOVA
          </span>
          {!compact && (
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.42em] text-slate-500">
              Security Academy
            </span>
          )}
        </span>
      )}
    </span>
  );
};
