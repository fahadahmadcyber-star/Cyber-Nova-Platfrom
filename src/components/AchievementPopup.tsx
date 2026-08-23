import React from "react";
import { useStore } from "../store";
import { X, Sparkles, Trophy } from "lucide-react";

export const AchievementPopup: React.FC = () => {
  const { activeAchievement, isBn, dismissAchievement } = useStore();
  if (!activeAchievement) return null;

  const title = isBn ? activeAchievement.titleBn : activeAchievement.title;
  const sub = isBn ? "নতুন ব্যাজ আনলক হয়েছে! 🏅" : "New badge unlocked! 🏅";

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 z-[200] pointer-events-none">
      <div className="pointer-events-auto relative w-[92vw] max-w-sm rounded-[22px] overflow-hidden border border-white/15 shadow-[0_20px_80px_rgba(0,0,0,.6),0_0_50px_rgba(245,158,11,.25)] anim-toast">
        {/* glowing bg */}
        <div className={`absolute inset-0 bg-gradient-to-br ${activeAchievement.color} opacity-90`} />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
        <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute inset-0 scanlines opacity-20" />

        <div className="relative p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-white/90">
              <Sparkles size={12} /> {sub}
            </div>
            <button onClick={dismissAchievement} className="grid place-items-center w-7 h-7 rounded-full bg-black/20 text-white/70 hover:text-white hover:bg-black/30 transition-colors cursor-pointer">
              <X size={13} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="grid place-items-center w-16 h-16 rounded-2xl bg-white/15 border border-white/20 shadow-inner text-3xl">
              {activeAchievement.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-black tracking-tight text-white drop-shadow">{title}</div>
              <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-black/25 border border-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white/80">
                <Trophy size={10} /> {isBn ? "কোর্স ব্যাজ" : "Course Badge"}
              </div>
            </div>
          </div>

          <div className="mt-4 h-1 rounded-full bg-black/20 overflow-hidden">
            <div className="h-full bg-white/80 rounded-full animate-[shrink_5s_linear_forwards]" style={{ animation: "shrink 5s linear forwards" }} />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shrink { from { width: 100% } to { width: 0% } }
      `}</style>
    </div>
  );
};
