import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Swords, Timer, Trophy, Play, RotateCcw, CheckCircle2, XCircle, Crown, Activity as ActIcon, Database,
} from "lucide-react";
import { useStore } from "../store";
import { levelFor } from "../data/courses";
import { Avatar } from "../components/ui";
import { fmtN } from "./Home";

const RUN_LEN = 6;
const TIME = 25;

interface RunQ {
  courseId: string;
  chapterId: string;
  courseTitle: string;
}

export const QuizNova: React.FC = () => {
  const { t, isBn, arena, arenaFinish, toast, curriculum } = useStore();
  const [run, setRun] = useState<RunQ[] | null>(null);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME);
  const [finished, setFinished] = useState(false);
  const timerRef = useRef<number | null>(null);
  const scoreRef = useRef(0);

  // Live question bank — only chapters that actually have a question.
  const bank = useMemo(
    () =>
      curriculum.flatMap((c) =>
        c.chapters
          .filter((ch) => ch.quiz && ch.quiz.q?.trim() && ch.quiz.opts?.some((o) => o.trim()))
          .map((ch) => ({ course: c, chapter: ch }))
      ),
    [curriculum]
  );
  const current = run ? bank.find((b) => b.chapter.id === run[qi]?.chapterId) || null : null;

  const start = () => {
    const shuffled = [...bank].sort(() => Math.random() - 0.5).slice(0, RUN_LEN);
    setRun(shuffled.map((b) => ({ courseId: b.course.id, chapterId: b.chapter.id, courseTitle: isBn ? b.course.titleBn : b.course.title })));
    setQi(0);
    setScore(0);
    scoreRef.current = 0;
    setFinished(false);
    setPicked(null);
    setRevealed(false);
    setTimeLeft(TIME);
  };

  const finishRun = (finalScore: number) => {
    const xpGained = finalScore * 20;
    arenaFinish(finalScore, RUN_LEN, xpGained);
    if (xpGained > 0) toast(`${t("arenaXp")}: +${fmtN(xpGained, isBn)} XP`, "xp");
    setFinished(true);
  };

  const nextQ = (newScore: number) => {
    if (qi + 1 >= RUN_LEN) finishRun(newScore);
    else {
      setQi(qi + 1);
      setPicked(null);
      setRevealed(false);
      setTimeLeft(TIME);
    }
  };

  const pick = (i: number) => {
    if (revealed || !current) return;
    setPicked(i);
    setRevealed(true);
    const ok = i === current.chapter.quiz.answer;
    if (ok) {
      scoreRef.current += 1;
      setScore(scoreRef.current);
    }
    window.setTimeout(() => nextQ(scoreRef.current), 1400);
  };

  // countdown
  useEffect(() => {
    if (!run || finished || revealed) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) window.clearInterval(timerRef.current);
          setRevealed(true);
          setPicked(-1);
          window.setTimeout(() => nextQ(scoreRef.current), 1500);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, qi, finished, revealed]);

  const accuracy = arena.runs > 0 ? Math.round((arena.best / RUN_LEN) * 100) : 0;
  const circumference = 2 * Math.PI * 26;

  return (
    <div className="space-y-6">
      {/* header */}
      <header className="anim-fade-up">
        <div className="flex items-center gap-2">
          <Swords className="text-emerald-300" size={22} />
          <h1 className="text-3xl sm:text-4xl font-black neon-text" style={{ fontFamily: isBn ? "inherit" : "var(--font-display)" }}>
            {t("quizNovaTitle")}
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-400 max-w-xl">{t("quizNovaSub")}</p>
      </header>

      {/* stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-up anim-delay-1">
        {[
          { icon: Trophy, label: t("arenaBest"), val: `${fmtN(arena.best, isBn)}/${fmtN(RUN_LEN, isBn)}` },
          { icon: ActIcon, label: t("arenaRuns"), val: fmtN(arena.runs, isBn) },
          { icon: CheckCircle2, label: t("accuracy"), val: `${fmtN(accuracy, isBn)}%` },
          { icon: Database, label: t("arenaBank"), val: fmtN(bank.length, isBn) },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-3.5 card-hover">
            <s.icon size={16} className="text-cyan-300" />
            <div className="mt-2 text-xl font-black tabular-nums">{s.val}</div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 truncate">{s.label}</div>
          </div>
        ))}
      </div>

      {/* ============ arena ============ */}
      {!run || finished ? (
        <section className="grid lg:grid-cols-2 gap-5">
          {/* launcher / results */}
          <div className="relative overflow-hidden glass rounded-3xl p-7 sm:p-9 scanlines">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl" />
            {finished ? (
              <div className="anim-pop">
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-300">{t("runOver")}</div>
                <div className="mt-3 text-5xl font-black">
                  {t("runScore")} <span className="neon-text">{fmtN(score, isBn)}/{fmtN(RUN_LEN, isBn)}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  {t("arenaXp")}: <span className="text-emerald-300 font-bold">+{fmtN(score * 20, isBn)} XP</span>
                </p>
                <div className="mt-3 flex gap-1.5">
                  {Array.from({ length: RUN_LEN }).map((_, i) => (
                    <span key={i} className={`h-2 flex-1 rounded-full ${i < score ? "bg-gradient-to-r from-cyan-400 to-emerald-400" : "bg-white/10"}`} />
                  ))}
                </div>
                <button
                  onClick={start}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_35px_rgba(34,211,238,.5)] active:scale-[0.97] transition-all cursor-pointer"
                >
                  <RotateCcw size={15} /> {t("again")}
                </button>
              </div>
            ) : (
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300">{t("howItWorks")}</div>
                <h2 className="mt-3 text-2xl font-black">{t("startRun")}</h2>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">{t("runRules")}</p>
                <ul className="mt-4 space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2"><Timer size={13} className="text-cyan-300 shrink-0" /> {fmtN(TIME, isBn)} {t("timeLeft")} / {t("questionWord").toLowerCase()}</li>
                  <li className="flex items-center gap-2"><Database size={13} className="text-emerald-300 shrink-0" /> {t("arenaBankSub")}</li>
                  <li className="flex items-center gap-2"><Trophy size={13} className="text-amber-300 shrink-0" /> {t("badgeArenaD")}</li>
                </ul>
                <button
                  onClick={start}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_35px_rgba(34,211,238,.55)] active:scale-[0.97] transition-all cursor-pointer"
                >
                  <Play size={15} /> {t("startRun")}
                </button>
              </div>
            )}
          </div>

          {/* leaderboard */}
          <Leaderboard />
        </section>
      ) : (
        /* ============ live question ============ */
        current && (
          <section className="glass rounded-3xl p-6 sm:p-8 max-w-3xl mx-auto anim-fade-up" key={qi}>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                {Array.from({ length: RUN_LEN }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-7 rounded-full transition-all ${
                      i < qi ? "bg-emerald-400" : i === qi ? "bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,.8)]" : "bg-white/10"
                    }`}
                  />
                ))}
              </div>
              {/* timer ring */}
              <div className="relative w-14 h-14 shrink-0">
                <svg width="56" height="56" className="-rotate-90">
                  <circle cx="28" cy="28" r="26" stroke="rgba(148,163,184,.15)" strokeWidth="4" fill="none" />
                  <circle
                    cx="28" cy="28" r="26" stroke={timeLeft <= 6 ? "#fb7185" : "#22d3ee"} strokeWidth="4" fill="none"
                    strokeLinecap="round" strokeDasharray={circumference}
                    strokeDashoffset={circumference - (circumference * timeLeft) / TIME}
                    style={{ transition: "stroke-dashoffset 1s linear" }}
                  />
                </svg>
                <div className={`absolute inset-0 grid place-items-center text-sm font-black tabular-nums ${timeLeft <= 6 ? "text-rose-300 animate-pulse" : ""}`}>
                  {fmtN(timeLeft, isBn)}
                </div>
              </div>
            </div>

            <div className="mt-4 text-[10px] font-mono uppercase tracking-widest text-slate-500">
              {t("questionWord")} {fmtN(qi + 1, isBn)}/{fmtN(RUN_LEN, isBn)} · {run[qi].courseTitle}
            </div>
            <h2 className="mt-2 text-lg sm:text-xl font-bold leading-snug">
              {isBn ? current.chapter.quiz.qBn : current.chapter.quiz.q}
            </h2>

            <div className="mt-5 space-y-2.5">
              {(isBn ? current.chapter.quiz.optsBn : current.chapter.quiz.opts).map((opt, i) => {
                const ans = current.chapter.quiz.answer;
                let cls = "border-white/10 bg-white/[0.03] text-slate-300";
                if (!revealed) cls += " hover:border-cyan-400/50 hover:bg-cyan-400/5 cursor-pointer";
                if (revealed && i === ans) cls = "border-emerald-400/60 bg-emerald-400/15 text-emerald-200";
                else if (revealed && picked === i && i !== ans) cls = "border-rose-400/60 bg-rose-400/15 text-rose-200 anim-shake";
                else if (revealed) cls = "border-white/8 bg-white/[0.02] text-slate-500";
                return (
                  <button
                    key={i}
                    onClick={() => pick(i)}
                    disabled={revealed}
                    className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-all ${cls}`}
                  >
                    <span className="mt-0.5 grid place-items-center w-5 h-5 rounded-md border border-white/15 text-[10px] font-mono font-bold shrink-0 text-slate-500">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="leading-relaxed">{opt}</span>
                    {revealed && i === ans && <CheckCircle2 size={16} className="ml-auto mt-0.5 text-emerald-300 shrink-0 anim-pop" />}
                    {revealed && picked === i && i !== ans && <XCircle size={16} className="ml-auto mt-0.5 text-rose-300 shrink-0" />}
                  </button>
                );
              })}
            </div>
            {revealed && picked === -1 && (
              <p className="mt-4 text-xs font-bold text-rose-300 flex items-center gap-2">
                <Timer size={13} /> {t("timeoutMsg")}
              </p>
            )}
          </section>
        )
      )}
    </div>
  );
};

/* ============ leaderboard (zero-state) ============ */
const Leaderboard: React.FC = () => {
  const { t, tn, isBn, user, xp } = useStore();
  const lv = levelFor(xp);

  const rows = [1, 2, 3, 4, 5];
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-black flex items-center gap-2">
          <Crown size={17} className="text-amber-300" /> {t("leaderboard")}
        </h3>
        <span className="text-[9px] font-mono uppercase tracking-widest text-emerald-300 border border-emerald-400/30 rounded-full px-2 py-0.5 bg-emerald-400/10">
          {isBn ? "লাইভ · লোকাল" : "live · local"}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-slate-500">{t("leaderboardNote")}</p>
      <div className="mt-4 space-y-2">
        {xp > 0 && user && (
          <div className="anim-pop flex items-center gap-3 rounded-xl border border-cyan-400/40 bg-gradient-to-r from-cyan-400/15 to-emerald-400/10 px-3.5 py-3 shadow-[0_0_25px_-8px_rgba(34,211,238,.5)]">
            <span className="w-7 text-center font-black text-amber-300">1</span>
            <Avatar url={user.avatarUrl} name={user.name} size={32} />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate flex items-center gap-1.5">
                {user.name}
                <span className="text-[9px] font-bold uppercase tracking-widest text-cyan-300 bg-cyan-400/10 border border-cyan-400/30 rounded px-1.5 py-0.5">
                  {t("you")}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">{tn("levelNames", lv.index)}</div>
            </div>
            <span className="font-black tabular-nums text-emerald-300 text-sm">{xp} XP</span>
          </div>
        )}
        {rows.slice(xp > 0 ? 1 : 0).map((r) => (
          <div key={r} className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 bg-white/[0.02] px-3.5 py-3 opacity-70">
            <span className="w-7 text-center font-bold text-slate-600">{r}</span>
            <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 grid place-items-center text-slate-600 text-xs">?</div>
            <div className="flex-1 text-xs text-slate-500 italic">{xp === 0 && r === 1 ? t("emptyBoard") : t("awaiting")}</div>
            <span className="text-xs text-slate-600 font-mono">—</span>
          </div>
        ))}
      </div>
    </div>
  );
};
