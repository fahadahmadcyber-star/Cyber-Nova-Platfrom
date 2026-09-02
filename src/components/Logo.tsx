import React, { useId } from "react";

import novaAsset from "../assets/nova.jpeg";
import { useStore } from "../store";

export const LogoMark: React.FC<{ size?: number }> = ({ size = 42 }) => {
  const { admin } = useStore();
  const gradientId = useId().replace(/:/g, "");
  const imageSrc = admin.logoUrl || novaAsset;

  if (admin.logoUrl || novaAsset) {
    return (
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          width: size,
          height: size,
          borderRadius: 18,
        }}
      >
        <img
          src={imageSrc}
          alt={admin.siteNameEn || "Cyber Nova"}
          width={size}
          height={size}
          className="relative h-full w-full object-contain object-center"
          style={{ borderRadius: 18, filter: "drop-shadow(0 10px 18px rgba(76, 166, 255, 0.14))" }}
        />
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        width: size,
        height: size,
        borderRadius: 18,
      }}
      aria-label="Cyber Nova"
    >
      <svg viewBox="0 0 120 120" width={size} height={size} className="relative h-full w-full">
        <defs>
          <linearGradient id={`logo-ring-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6feaf9" />
            <stop offset="45%" stopColor="#49c7ff" />
            <stop offset="100%" stopColor="#5f7dff" />
          </linearGradient>
          <linearGradient id={`logo-mark-${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#b7f5ff" />
            <stop offset="50%" stopColor="#76d9ff" />
            <stop offset="100%" stopColor="#6d8dff" />
          </linearGradient>
        </defs>

        <circle cx="60" cy="60" r="42" fill="none" stroke={`url(#logo-ring-${gradientId})`} strokeWidth="3.2" opacity="0.96" />
        <path d="M42 82V38H50L66 60V38H78V82H70L54 60V82H42Z" fill="none" stroke={`url(#logo-mark-${gradientId})`} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M52 26H68" fill="none" stroke={`url(#logo-mark-${gradientId})`} strokeWidth="4" strokeLinecap="round" opacity="0.9" />
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
    <span className="inline-flex items-center gap-3 select-none">
      <LogoMark size={size + 8} />
      {withText && (
        <span className="leading-none">
          <span
            className="block font-black"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: compact ? 15 : 19,
              letterSpacing: "0.06em",
              background: "linear-gradient(90deg, #9ee8ff 0%, #74d8ff 20%, #5ca6ff 45%, #6d8dff 75%, #6d8dff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 0 8px rgba(92, 166, 255, 0.08)",
            }}
          >
            {brandName}
          </span>
          {!compact && (
            <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.36em]" style={{ color: "#bfdcff", opacity: 0.82 }}>
              {brandTag}
            </span>
          )}
        </span>
      )}
    </span>
  );
};
