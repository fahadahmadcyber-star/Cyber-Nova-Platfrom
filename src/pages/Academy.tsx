import React from "react";
import {
  GraduationCap, ArrowRight, Clock, Trophy, Target, Cpu, Network, Globe,
  SearchCheck, History, Play, Sparkles, BookOpenCheck,
} from "lucide-react";
import { useStore } from "../store";
import { courseCover } from "../data/media";
import { Bar, EmptyState } from "../components/ui";
import { fmtN } from "./Home";

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu, network: Network, globe: Globe, search: SearchCheck,
};

export const Academy: React.FC = () => {
  const { t, isBn, nav, read, answers, lastVisited, curriculum } = useStore();
  const courses = curriculum;
  const L = (en: string, bn: string) => (isBn ? bn : en);

  const totalMissions = courses.reduce((n, c) => n + c.chapters.length, 0);
  const totalDone = courses.reduce(
    (n, c) => n + c.chapters.filter((ch) => read.includes(ch.id)).length,
    0
  );
  const overallPct = totalMissions ? Math.round((totalDone / totalMissions) * 100) : 0;

  const lvCourse = lastVisited ? courses.find((c) => c.id === lastVisited.courseId) : undefined;
  const lvChapter = lvCourse
    ? lvCourse.chapters.find((ch) => ch.id === lastVisited!.chapterId)
    : undefined;

  return (
    <div className="space-y-7">
      {/* header */}
      <header className="anim-fade-up">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-400/60">
          {L("LEARNING TRACKS", "লার্নিং ট্র্যাক")}
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black flex items-center gap-3">
          <GraduationCap className="text-cyan-300" size={30} />
          <span className="neon-text">{t("navAcademy")}</span>
        </h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">{t("tracksSub")}</p>
      </header>

      {/* overall progress */}
      <section className="glass rounded-2xl p-5 anim-fade-up anim-delay-1">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <BookOpenCheck size={16} className="text-emerald-300" />
            {L("Overall Progress", "সামগ্রিক অগ্রগতি")}
          </div>
          <div className="text-xs text-slate-400 tabular-nums">
            {fmtN(totalDone, isBn)} / {fmtN(totalMissions, isBn)} {L("missions", "মিশন")} ·{" "}
            <span className="text-emerald-300 font-bold">{fmtN(overallPct, isBn)}%</span>
          </div>
        </div>
        <Bar pct={overallPct} />
      </section>

      {/* resume */}
      {lvCourse && lvChapter && (
        <button
          onClick={() =>
            nav({ view: "chapter", courseId: lastVisited!.courseId, chapterId: lastVisited!.chapterId })
          }
          className="w-full text-left glass rounded-2xl p-4 sm:p-5 card-hover flex items-center gap-4 cursor-pointer anim-fade-up"
        >
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 border border-cyan-400/40 text-cyan-200 shrink-0">
            <History size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
              {t("continueTitle")}
            </div>
            <div className="mt-1 font-bold truncate">
              {isBn ? lvChapter.titleBn : lvChapter.title}
            </div>
            <div className="text-xs text-slate-400 truncate">
              {isBn ? lvCourse.titleBn : lvCourse.title}
            </div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 text-xs font-bold px-3 py-1.5 shrink-0">
            {t("continueBtn")} <ArrowRight size={13} />
          </span>
        </button>
      )}

      {/* all tracks */}
      <section>
        {courses.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title={L("No courses available yet", "এখনও কোনো কোর্স নেই")}
            body={L(
              "The owner can add new courses from the Admin Control Center.",
              "ওনার অ্যাডমিন কন্ট্রোল সেন্টার থেকে নতুন কোর্স যোগ করতে পারেন।"
            )}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {courses.map((c, i) => {
              const Icon = iconMap[c.icon] || Cpu;
              const done = c.chapters.filter((ch) => read.includes(ch.id)).length;
              const quizDone = c.chapters.filter((ch) => answers[ch.id]?.correct).length;
              const chTotal = c.chapters.length || 1;
              const pct = Math.round((done / chTotal) * 100);
              const totalMin = c.chapters.reduce((s, ch) => s + ch.minutes, 0);
              return (
                <button
                  key={c.id}
                  onClick={() => nav({ view: "course", courseId: c.id })}
                  className="group relative overflow-hidden text-left rounded-3xl border border-white/10 card-hover cursor-pointer anim-fade-up"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={courseCover[c.id] || courseCover.c1}
                      alt={c.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040917] via-[#040917]/60 to-transparent" />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur border border-white/15 px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-200">
                        <Icon size={11} /> {isBn ? `ট্র্যাক ০${i + 1}` : `TRACK 0${i + 1}`}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-slate-950/70 backdrop-blur border border-white/15 px-2.5 py-1 text-[10px] font-mono text-slate-300">
                      <Clock size={10} /> {fmtN(totalMin, isBn)} {t("minRead")}
                    </div>
                    {c.chapters.length > 0 && done === c.chapters.length && (
                      <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-400/20 border border-emerald-400/50 text-emerald-200 text-[10px] font-bold px-2.5 py-1">
                        <Trophy size={10} /> {t("courseCompleted")}
                      </div>
                    )}
                  </div>
                  <div className="p-5 pt-3 space-y-3">
                    <h3 className="text-lg font-black leading-snug group-hover:text-cyan-100 transition-colors">
                      {isBn ? c.titleBn : c.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {isBn ? c.taglineBn : c.tagline}
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>
                          {t("progressWord")} · {fmtN(pct, isBn)}%
                        </span>
                        <span>
                          {fmtN(done, isBn)}/{fmtN(c.chapters.length, isBn)} {L("missions", "মিশন")}
                        </span>
                      </div>
                      <Bar pct={pct} />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Target size={10} className="text-fuchsia-300" /> {fmtN(quizDone, isBn)}{" "}
                        {L("quizzes cracked", "কুইজ সমাধান")}
                      </span>
                      <span className="inline-flex items-center gap-1 text-cyan-300 font-bold group-hover:gap-2 transition-all">
                        {t("viewAll")} <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>

      {/* start CTA */}
      {totalDone === 0 && courses.length > 0 && (
        <div className="anim-fade-up">
          <EmptyState
            icon={Play}
            title={t("emptyJourney")}
            action={
              <button
                onClick={() =>
                  nav({
                    view: "chapter",
                    courseId: courses[0].id,
                    chapterId: courses[0].chapters[0]?.id,
                  })
                }
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer"
              >
                <Play size={13} /> {t("beginJourney")}
              </button>
            }
          />
        </div>
      )}
    </div>
  );
};
