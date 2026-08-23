import React from "react";
import {
  Zap, BookOpen, Target, Swords, Flag, GraduationCap, Trophy,
  CheckCircle2, Info, AlertTriangle, Flame, Lock,
} from "lucide-react";
import { useStore, Badge as BadgeType } from "../store";
import { levelFor } from "../data/courses";

export const loc = (n: number | string, bn: boolean) =>
  bn ? String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]) : String(n);

/* ---------- toast viewport ---------- */
export const Toasts: React.FC = () => {
  const { toasts } = useStore();
  return (
    <div className="fixed bottom-5 right-4 sm:right-6 z-[120] flex flex-col gap-2 items-end pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`anim-toast pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-2xl border backdrop-blur-xl ${
            t.kind === "xp"
              ? "bg-emerald-500/15 border-emerald-400/40 text-emerald-200 shadow-emerald-500/20"
              : t.kind === "warn"
              ? "bg-amber-500/15 border-amber-400/40 text-amber-200"
              : "bg-cyan-500/15 border-cyan-400/40 text-cyan-100 shadow-cyan-500/20"
          }`}
        >
          {t.kind === "xp" ? <Zap size={15} className="shrink-0" /> : t.kind === "warn" ? <AlertTriangle size={15} className="shrink-0" /> : <Info size={15} className="shrink-0" />}
          <span>{t.msg}</span>
        </div>
      ))}
    </div>
  );
};

/* ---------- avatar ---------- */
export const Avatar: React.FC<{ url?: string; name?: string; size?: number; ring?: boolean }> = ({
  url, name, size = 36, ring = false,
}) => {
  const [err, setErr] = React.useState(false);
  React.useEffect(() => setErr(false), [url]);
  const dim = { width: size, height: size };
  const cls = `rounded-full object-cover ${ring ? "ring-2 ring-cyan-400/50" : ""}`;
  if (url && !err) {
    return <img src={url} alt={name || "avatar"} style={dim} onError={() => setErr(true)} className={`${cls} bg-slate-800`} referrerPolicy="no-referrer" />;
  }
  return (
    <div
      style={dim}
      className={`${cls} grid place-items-center bg-gradient-to-br from-cyan-500/30 via-slate-900 to-emerald-500/30 border border-cyan-400/40 select-none shrink-0`}
      title="Cyber Nova"
    >
      <span className="font-extrabold tracking-tighter neon-text" style={{ fontSize: size * 0.32, fontFamily: "var(--font-display)" }}>
        CN
      </span>
    </div>
  );
};

/* ---------- level ring ---------- */
export const LevelRing: React.FC<{ size?: number }> = ({ size = 120 }) => {
  const { xp, t, tn, isBn } = useStore();
  const lv = levelFor(xp);
  const R = size / 2 - 8;
  const circ = 2 * Math.PI * R;
  const off = circ - (circ * lv.pct) / 100;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={R} stroke="rgba(148,163,184,.15)" strokeWidth="7" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={R}
          stroke="url(#lvgrad)" strokeWidth="7" fill="none" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)" }}
        />
        <defs>
          <linearGradient id="lvgrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className={`font-black leading-none ${size > 90 ? "text-3xl" : "text-xl"}`}>{loc(lv.pct, isBn)}%</div>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 max-w-[90px] leading-tight">
            {tn("levelNames", lv.index) || t("levelWord")}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- xp chip ---------- */
export const XpChip: React.FC = () => {
  const { xp, isBn } = useStore();
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-200 shadow-[0_0_18px_rgba(34,211,238,.15)]">
      <Flame size={13} className="text-emerald-300" />
      <span className="tabular-nums">{loc(xp, isBn)}</span>
      <span className="text-[10px] text-cyan-400/80 font-semibold">XP</span>
    </div>
  );
};

/* ---------- badge tile ---------- */
const badgeIcons: Record<string, React.ElementType> = {
  zap: Zap, book: BookOpen, target: Target, sword: Swords, flag: Flag, grad: GraduationCap, trophy: Trophy,
};
export const BadgeTile: React.FC<{ badge: BadgeType; compact?: boolean }> = ({ badge, compact }) => {
  const { t } = useStore();
  const Icon = badgeIcons[badge.icon] || Trophy;
  return (
    <div
      className={`relative rounded-2xl border p-3 text-center transition-all duration-300 ${
        badge.unlocked
          ? "border-emerald-400/40 bg-gradient-to-b from-emerald-400/10 to-cyan-400/5 shadow-[0_0_30px_-8px_rgba(52,211,153,.4)]"
          : "border-white/8 bg-white/[0.02] opacity-60"
      }`}
    >
      {!badge.unlocked && <Lock size={12} className="absolute top-2 right-2 text-slate-500" />}
      <div
        className={`mx-auto grid place-items-center rounded-xl ${
          badge.unlocked ? "bg-gradient-to-br from-cyan-400/25 to-emerald-400/25 text-emerald-300" : "bg-white/5 text-slate-600"
        } ${compact ? "w-9 h-9" : "w-11 h-11"}`}
      >
        <Icon size={compact ? 17 : 20} />
      </div>
      <div className={`mt-2 leading-tight font-bold ${compact ? "text-[11px]" : "text-xs"} ${badge.unlocked ? "text-slate-100" : "text-slate-500"}`}>
        {t(badge.nameKey)}
      </div>
      {!compact && <div className="mt-1 text-[10px] leading-snug text-slate-500">{t(badge.descKey)}</div>}
      {badge.unlocked && (
        <div className="mt-1 inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-emerald-300">
          <CheckCircle2 size={9} /> {t("unlocked")}
        </div>
      )}
    </div>
  );
};

/* ---------- empty state ---------- */
export const EmptyState: React.FC<{ icon?: React.ElementType; title: string; body?: string; action?: React.ReactNode }> = ({
  icon: Icon = Info, title, body, action,
}) => (
  <div className="grid place-items-center text-center rounded-2xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-10">
    <div className="grid place-items-center w-12 h-12 rounded-2xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 mb-3">
      <Icon size={20} />
    </div>
    <div className="font-bold text-slate-200">{title}</div>
    {body && <div className="mt-1 text-sm text-slate-400 max-w-sm">{body}</div>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

/* ---------- tiny progress bar ---------- */
export const Bar: React.FC<{ pct: number; className?: string }> = ({ pct, className }) => (
  <div className={`h-1.5 rounded-full bg-white/8 overflow-hidden ${className || ""}`}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-700"
      style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
    />
  </div>
);
