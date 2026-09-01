import React, { useId } from "react";

import { useStore } from "../store";

export const LogoMark: React.FC<{ size?: number }> = ({ size = 40 }) => {
  const { admin } = useStore();
  const gradientId = useId().replace(/:/g, "");

  if (admin.logoUrl) {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden border border-cyan-400/30 bg-slate-950/80 shadow-[0_0_35px_rgba(34,211,238,0.18)]"
        style={{
          width: size,
          height: size,
          borderRadius: 16,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16), 0 0 28px rgba(34,211,238,0.18)",
        }}
      >
        <img
          src={admin.logoUrl}
          alt={admin.siteNameEn || "Cyber Nova"}
          width={size}
          height={size}
          className="relative h-full w-full object-cover object-center"
          style={{ borderRadius: 16, filter: "drop-shadow(0 0 14px rgba(34,211,238,0.24)) saturate(1.05)" }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden border border-cyan-400/30 bg-slate-950/80"
      style={{
        width: size,
        height: size,
        borderRadius: 18,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18), 0 0 28px rgba(45,212,191,0.16)",
      }}
      aria-label="Cyber Nova"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} className="relative h-full w-full">
        <defs>
          <linearGradient id={`bg-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1222" />
            <stop offset="45%" stopColor="#111827" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <linearGradient id={`ring-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="50%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id={`mark-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9f99d" />
            <stop offset="40%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        <rect x="4" y="4" width="112" height="112" rx="26" fill={`url(#bg-${gradientId})`} stroke="rgba(103,232,249,0.38)" />
        <circle cx="60" cy="60" r="41" fill="none" stroke={`url(#ring-${gradientId})`} strokeWidth="2.4" opacity="0.7" />
        <circle cx="60" cy="60" r="30" fill="none" stroke="rgba(103,232,249,0.38)" strokeWidth="1.3" strokeDasharray="4 7" />
        <path d="M28 80V42L52 70L60 60L68 70L92 42V80" fill="none" stroke={`url(#mark-${gradientId})`} strokeWidth="6.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M46 34L60 50L74 34" fill="none" stroke={`url(#mark-${gradientId})`} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <circle cx="60" cy="60" r="4.5" fill="#ecfeff" />
        <path d="M60 18V10M102 60H110M60 102V110M18 60H10" stroke="rgba(103,232,249,0.72)" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};

export const Logo: React.FC<{ size?: number; withText?: boolean; compact?: boolean }> = ({
  size = 40,
  withText = true,
  compact = false,
}) => {
  const { isBn, admin } = useStore();
  const brandName = isBn ? (admin.siteNameBn || "সাইবার নোভা") : (admin.siteNameEn || "CYBER NOVA");
  const brandTag = isBn ? (admin.siteTaglineBn || "সিকিউরিটি একাডেমি") : (admin.siteTaglineEn || "Security Academy");

  return (
    <span className="inline-flex items-center gap-2.5 select-none">
      <LogoMark size={size} />
      {withText && (
        <span className="leading-none">
          <span
            className="block font-black tracking-[0.14em] neon-text"
            style={{ fontFamily: "var(--font-display)", fontSize: compact ? 14 : 17 }}
          >
            {brandName}
          </span>
          {!compact && (
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.42em] text-slate-500">
              {brandTag}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
