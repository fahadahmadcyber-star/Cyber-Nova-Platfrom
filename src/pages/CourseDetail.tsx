import React from "react";
import { ArrowLeft, Cpu, Network, Globe, SearchCheck, Clock, CheckCircle2, Circle, ChevronRight, Crosshair, Flag, GitBranch, LockKeyhole } from "lucide-react";
import { useStore } from "../store";
import { Bar } from "../components/ui";
import { fmtN } from "./Home";

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu, network: Network, globe: Globe, search: SearchCheck,
};

export const CourseDetail: React.FC<{ courseId: string }> = ({ courseId }) => {
  const { t, isBn, nav, read, answers, curriculum } = useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);
  const course = curriculum.find((c) => c.id === courseId);
  if (!course)
    return (
      <Empty title={t("searchEmpty")} />
    );
  const Icon = iconMap[course.icon];
  const done = course.chapters.filter((ch) => read.includes(ch.id)).length;
  const chTotal = course.chapters.length;
  const cleared = chTotal > 0 && done === chTotal;

  return (
    <div className="space-y-6">
      <button
        onClick={() => nav({ view: "home" })}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-200 transition-colors cursor-pointer"
      >
        <ArrowLeft size={14} /> {t("navAcademy")}
      </button>

      {/* header */}
      <section className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${course.hue} p-6 sm:p-8 scanlines anim-fade-up`}>
        <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="flex flex-wrap items-start gap-5">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-slate-950/60 border border-white/15 text-cyan-200 shrink-0">
            <Icon size={26} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black">{isBn ? course.titleBn : course.title}</h1>
              {cleared && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold px-2.5 py-1 tracking-widest">
                  <Flag size={10} /> {t("courseCompleted")}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-slate-400 max-w-2xl">{isBn ? course.taglineBn : course.tagline}</p>
            <div className="mt-4 flex items-center gap-3 max-w-md">
              <Bar pct={(done / (chTotal || 1)) * 100} className="flex-1" />
              <span className="text-[11px] font-mono text-slate-400">
                {fmtN(done, isBn)}/{fmtN(chTotal, isBn)} · {t("progressWord")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* syllabus timeline */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <GitBranch size={15} className="text-cyan-300" />
          <h2 className="text-lg sm:text-xl font-black">{t("syllabus")}</h2>
          <span className="text-[10px] font-mono text-slate-500 border border-white/10 rounded-full px-2 py-0.5">{t("sequential")}</span>
        </div>
        <div className="relative">
          <div className="absolute left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-emerald-400/40" />
          <div className="space-y-2.5">
            {course.chapters.map((ch, i) => {
              const isRead = read.includes(ch.id);
              const isQuiz = !!answers[ch.id]?.correct;
              const isExamChapter = course.id === "c5" && i === 5;
              const examLocked = isExamChapter && !read.includes(course.chapters[4]?.id);
              return (
                <button
                  key={ch.id}
                  onClick={() => { if (!examLocked) nav({ view: "chapter", courseId: course.id, chapterId: ch.id }); }}
                  disabled={examLocked}
                  className={`relative w-full text-left flex items-center gap-4 rounded-2xl border px-4 py-4 transition-all group anim-fade-up ${examLocked ? "border-amber-300/15 bg-amber-300/[0.03] opacity-60 cursor-not-allowed" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-cyan-400/40 cursor-pointer"}`}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className={`relative z-10 grid place-items-center w-9 h-9 rounded-full border font-mono text-xs font-bold shrink-0 ${
                      isRead
                        ? "bg-emerald-400/15 border-emerald-400/50 text-emerald-300"
                        : "bg-slate-900 border-cyan-400/40 text-cyan-300"
                    }`}
                  >
                    {isRead ? <CheckCircle2 size={16} /> : fmtN(i + 1, isBn)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold truncate group-hover:text-cyan-100 transition-colors">
                      {isBn ? ch.titleBn : ch.title}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock size={10} /> {fmtN(ch.minutes, isBn)} {t("minRead")}
                      </span>
                      <span className={`inline-flex items-center gap-1 ${isQuiz ? "text-emerald-300" : ""}`}>
                        <Crosshair size={10} /> {isQuiz ? t("quizAlreadyDone") : t("quizTitle")}
                      </span>
                      {!isRead && (
                        <span className="inline-flex items-center gap-1 text-slate-600">
                          {examLocked ? <LockKeyhole size={10} /> : <Circle size={8} />} {examLocked ? L("Complete Chapter 5 to unlock", "চ্যাপ্টার ৫ শেষ করলে আনলক হবে") : t("locked")}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-600 hidden sm:block shrink-0">
                    {t("stepWord")} {fmtN(i + 1, isBn)}/{fmtN(chTotal, isBn)}
                  </span>
                  <ChevronRight size={16} className="text-slate-600 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};

const Empty: React.FC<{ title: string }> = ({ title }) => (
  <div className="rounded-2xl border border-white/10 p-8 text-center text-slate-400">{title}</div>
);
