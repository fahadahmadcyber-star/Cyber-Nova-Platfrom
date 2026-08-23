import React, { useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, Clock, TerminalSquare, Crosshair, CheckCircle2, ClipboardList, LockKeyhole,
  XCircle, Info, StickyNote, Plus, Pencil, Trash2, Check, X, Flag,
} from "lucide-react";
import { useStore } from "../store";
import { Logo } from "../components/Logo";
import { chapterImage } from "../data/media";
import { KaliTerminal } from "../components/Terminal";
import { EmptyState } from "../components/ui";
import { fmtN } from "./Home";

export const ChapterView: React.FC<{ courseId: string; chapterId: string }> = ({ courseId, chapterId }) => {
  const { t, isBn, nav, read, answers, markRead, quizResult, toast, notes, addNote, editNote, deleteNote, curriculum, issueCertificate, pushNotification, finalExamResults } =
    useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);
  const course = curriculum.find((c) => c.id === courseId);
  const idx = course?.chapters.findIndex((c) => c.id === chapterId) ?? -1;
  const chapter = idx >= 0 ? course!.chapters[idx] : undefined;
  const isFinalExamChapter = courseId === "c5" && idx === 5;
  const examResult = finalExamResults?.[`${courseId}:${chapterId}`];
  const previousChapter = idx > 0 ? course?.chapters[idx - 1] : undefined;
  const examUnlocked = chapter?.exam?.requiresPreviousStep === false || !previousChapter || read.includes(previousChapter.id);

  const isRead = read.includes(chapterId);
  const quizzes = chapter?.quizzes?.length ? chapter.quizzes : chapter ? [chapter.quiz] : [];
  const [picked, setPicked] = useState<Record<number, number | null>>({});
  const [tries, setTries] = useState<Record<number, number>>({});
  const [shaking, setShaking] = useState<{ quizIndex: number; option: number } | null>(null);
  const [lightboxImage, setLightboxImage] = useState<{ src: string; alt: string } | null>(null);

  const [noteText, setNoteText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const list = useMemo(() => notes[chapterId] || [], [notes, chapterId]);

  if (!course || !chapter) return <EmptyState title={t("searchEmpty")} />;
  const randomizedQuizzes = useMemo(() => quizzes.map((rawQ) => {
    if (!rawQ.randomize) return rawQ;
    const order = rawQ.opts.map((_, i) => i).sort(() => Math.random() - 0.5);
    return {
      ...rawQ,
      opts: order.map((i) => rawQ.opts[i]),
      optsBn: order.map((i) => rawQ.optsBn[i]),
      answer: order.indexOf(rawQ.answer),
    };
  }), [chapterId, quizzes]);

  if (isFinalExamChapter && chapter.exam) {
    const examReady = examUnlocked && !examResult;
    return (
      <div className="max-w-3xl mx-auto space-y-5 anim-fade-up">
        <button onClick={() => nav({ view: "course", courseId })} className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-200 cursor-pointer">
          <ArrowLeft size={14} /> {t("backToTrack")}
        </button>
        <section className="relative overflow-hidden rounded-3xl border border-amber-300/45 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.24),transparent_42%),linear-gradient(135deg,#241406,#0b1020_65%,#111827)] p-7 sm:p-10 text-center">
          <div className="flex items-center justify-center gap-3">
            <Logo size={42} withText={false} />
            <div className="grid place-items-center w-16 h-16 rounded-2xl border border-amber-300/50 bg-amber-300/15 text-amber-200">
              <ClipboardList size={30} />
            </div>
          </div>
          <div className="mt-5 text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300">FINAL ASSESSMENT · {chapter.exam.totalMarks ?? 100} MARKS</div>
          <h1 className="mt-3 text-2xl sm:text-4xl font-black leading-tight text-amber-50">{isBn ? chapter.titleBn : chapter.title}</h1>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-300">{isBn ? chapter.exam.descriptionBn || chapter.exam.description : chapter.exam.description}</p>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-3"><div className="text-xl font-black text-amber-200">{chapter.exam.questions.length}</div><div className="text-[10px] text-slate-500">{L("Questions", "প্রশ্ন")}</div></div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-3"><div className="text-xl font-black text-amber-200">{chapter.exam.totalMarks ?? 100}</div><div className="text-[10px] text-slate-500">{L("Full marks", "পূর্ণমান")}</div></div>
            <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] p-3"><div className="text-xl font-black text-amber-200">{chapter.exam.passMark}</div><div className="text-[10px] text-slate-500">{L("Pass marks", "পাস নম্বর")}</div></div>
          </div>
          {!examReady && !examResult && <p className="mt-5 text-sm text-amber-200">{L("Complete the five learning chapters first to unlock this assessment.", "এই পরীক্ষা আনলক করতে আগে পাঁচটি শিক্ষামূলক অধ্যায় সম্পন্ন করুন।")}</p>}
          {examResult && <p className="mt-5 text-sm text-emerald-300">{L("This exam has already been submitted. Open your Profile to view the report.", "এই পরীক্ষা ইতিমধ্যে জমা হয়েছে। রিপোর্ট দেখতে Profile খুলুন।")}</p>}
          {examReady && (
            <button onClick={() => nav({ view: "finalExam", courseId, chapterId })} className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-black text-slate-950 bg-gradient-to-r from-amber-300 to-orange-400 hover:shadow-[0_0_35px_rgba(251,191,36,.45)] cursor-pointer">
              <ClipboardList size={16} /> {L("Open Exam Instructions", "পরীক্ষার নির্দেশনা দেখুন")} <ArrowRight size={16} />
            </button>
          )}
        </section>
      </div>
    );
  }

  const pick = (quizIndex: number, quiz: (typeof randomizedQuizzes)[number], i: number) => {
    const resultKey = quizIndex === 0 ? chapterId : `${chapterId}:quiz-${quizIndex}`;
    const solved = answers[resultKey]?.correct;
    const quizTries = tries[quizIndex] || 0;
    if (solved) return;
    setPicked((current) => ({ ...current, [quizIndex]: i }));
    if (i === quiz.answer) {
      const firstTry = quizTries === 0;
      const gained = quizResult(courseId, chapterId, true, firstTry, quizIndex);
      if (gained > 0) toast(`${firstTry ? t("xpFirst") : t("xpRetry")} · ${t("xpToast")}`, "xp");
    } else {
      setTries((current) => ({ ...current, [quizIndex]: quizTries + 1 }));
      setShaking({ quizIndex, option: i });
      setTimeout(() => {
        setShaking(null);
        setPicked((current) => ({ ...current, [quizIndex]: null }));
      }, 650);
    }
  };

  const prev = idx > 0 ? course.chapters[idx - 1] : null;
  const next = idx < course.chapters.length - 1 ? course.chapters[idx + 1] : null;

  return (
    <div className="space-y-6">
      {/* breadcrumb */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => nav({ view: "course", courseId })}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-cyan-200 transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} /> {t("backToTrack")}
        </button>
        <span className="text-[10px] font-mono text-slate-500">
          {t("chapterWord")} {fmtN(idx + 1, isBn)} {t("ofWord")} {fmtN(course.chapters.length, isBn)}
        </span>
      </div>

      {/* header */}
      <header className={`relative overflow-hidden rounded-3xl border p-6 sm:p-8 anim-fade-up ${isFinalExamChapter ? "border-amber-300/50 bg-[radial-gradient(circle_at_top_right,rgba(251,191,36,.24),transparent_45%),linear-gradient(135deg,#241406,#0b1020_65%,#111827)]" : `border-white/10 bg-gradient-to-br ${course.hue}`}`}>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-slate-400">
          <span className="bg-slate-950/50 border border-white/10 rounded-full px-2.5 py-1">{isBn ? course.titleBn : course.title}</span>
          <span className="bg-slate-950/50 border border-white/10 rounded-full px-2.5 py-1 inline-flex items-center gap-1">
            <Clock size={9} /> {fmtN(chapter.minutes, isBn)} {t("minRead")}
          </span>
          {isRead && (
            <span className="bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 rounded-full px-2.5 py-1 inline-flex items-center gap-1">
              <CheckCircle2 size={9} /> {t("markedRead")}
            </span>
          )}
        </div>
          <h1 className={`mt-3 text-2xl sm:text-4xl font-black leading-tight max-w-3xl ${isFinalExamChapter ? "text-amber-100" : ""}`}>
          {isBn ? chapter.titleBn : chapter.title}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-3xl">
          {isBn ? chapter.introBn : chapter.intro}
        </p>
      </header>

      <div className="grid lg:grid-cols-[1fr_380px] gap-6 items-start">
        {/* ===== left: reading + notes ===== */}
        <div className="space-y-6 min-w-0">
          <section className="glass rounded-3xl p-5 sm:p-7 space-y-6">
            <div className="flex items-center gap-2 text-cyan-300">
              <BookOpen size={16} />
              <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{t("readChapter")}</h2>
            </div>
            {/* lesson image */}
            {chapterImage[chapterId] && (
              <button type="button" onClick={() => setLightboxImage({ src: chapterImage[chapterId], alt: isBn ? chapter.titleBn : chapter.title })} className="relative block w-full overflow-hidden rounded-2xl border border-white/10 cursor-zoom-in text-left">
                <img src={chapterImage[chapterId]} alt={isBn ? chapter.titleBn : chapter.title} className="w-full h-48 sm:h-56 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-200 bg-slate-950/60 border border-cyan-400/30 rounded-full px-2.5 py-1">
                  {isBn ? course.titleBn : course.title}
                </span>
              </button>
            )}
            {chapter.sections.map((s, i) => (
              <article key={i} className="relative pl-5">
                <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-full bg-gradient-to-b from-cyan-400/70 to-emerald-400/70" />
                <div className={`grid gap-4 items-start ${s.imageUrl ? "sm:grid-cols-[minmax(0,1fr)_220px]" : ""}`}>
                  <div>
                    <h3 className="font-bold text-[15px]">{isBn ? s.hBn : s.h}</h3>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-[1.75] text-slate-400">{isBn ? s.bBn : s.b}</p>
                  </div>
                  {s.imageUrl && (
                    <button type="button" onClick={() => setLightboxImage({ src: s.imageUrl!, alt: isBn ? s.hBn : s.h })} className="block w-full cursor-zoom-in text-left">
                      <img
                        src={s.imageUrl}
                        alt={isBn ? s.hBn : s.h}
                        className="w-full h-36 sm:h-32 object-cover rounded-xl border border-white/10"
                        loading="lazy"
                      />
                    </button>
                  )}
                </div>
              </article>
            ))}
            <div className="pt-2">
              {!isRead ? (
                <button
                  onClick={() => {
                    markRead(courseId, chapterId);
                    toast(t("xpReadToast"), "xp");
                    // auto-issue certificate when the whole track is finished
                    const after = new Set([...read, chapterId]);
                    if (course.chapters.length > 0 && course.chapters.every((c) => after.has(c.id))) {
                      issueCertificate(courseId);
                      pushNotification(
                        isBn
                          ? `অভিনন্দন! "${course.titleBn}" ট্র্যাক সম্পন্ন — সার্টিফিকেট অর্জিত হয়েছে।`
                          : `Congratulations! You completed "${course.title}" — certificate earned.`
                      );
                      toast(isBn ? "🎓 সার্টিফিকেট অর্জিত!" : "🎓 Certificate earned!", "xp");
                    }
                  }}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(52,211,153,.45)] active:scale-[0.97] transition-all cursor-pointer"
                >
                  <Flag size={15} /> {t("markRead")}
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-bold text-emerald-300">
                  <CheckCircle2 size={16} /> {t("markedRead")}
                </span>
              )}
            </div>
          </section>

          {/* notes CRUD */}
          <section className="glass rounded-3xl p-5 sm:p-7">
            <div className="flex items-center gap-2 text-amber-200">
              <StickyNote size={16} />
                <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{t("notesTitle")}</h2>
                <p className="text-[11px] text-slate-500 normal-case tracking-normal font-normal mt-0.5">{t("notesSub")}</p>
              </div>
            <div className="mt-4 flex gap-2">
              <input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && noteText.trim()) {
                    addNote(chapterId, noteText.trim());
                    setNoteText("");
                  }
                }}
                placeholder={t("notePlaceholder")}
                className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 focus:border-amber-300/50 focus:ring-2 focus:ring-amber-300/15 outline-none px-4 py-2.5 text-sm transition-all"
              />
              <button
                onClick={() => {
                  if (!noteText.trim()) return;
                  addNote(chapterId, noteText.trim());
                  setNoteText("");
                }}
                className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold bg-amber-300/15 border border-amber-300/40 text-amber-200 hover:bg-amber-300/25 active:scale-[0.97] transition-all cursor-pointer"
              >
                <Plus size={15} /> <span className="hidden sm:inline">{t("addNote")}</span>
              </button>
            </div>
            <div className="mt-4 space-y-2.5">
              {list.length === 0 && <EmptyState title={t("notesEmpty")} icon={StickyNote} />}
              {list.map((n) => (
                <div key={n.id} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 anim-fade-up">
                  {editingId === n.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 min-w-0 rounded-lg bg-white/5 border border-amber-300/40 outline-none px-3 py-2 text-sm"
                        autoFocus
                      />
                      <button
                        onClick={() => {
                          editNote(chapterId, n.id, editText.trim() || n.text);
                          setEditingId(null);
                        }}
                        className="grid place-items-center w-9 rounded-lg bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 cursor-pointer"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="grid place-items-center w-9 rounded-lg bg-white/5 border border-white/10 text-slate-400 cursor-pointer"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start gap-3">
                      <p className="flex-1 text-sm text-slate-300 leading-relaxed break-words">{n.text}</p>
                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingId(n.id);
                            setEditText(n.text);
                          }}
                          title={t("edit")}
                          className="grid place-items-center w-8 h-8 rounded-lg text-slate-400 hover:text-amber-200 hover:bg-amber-300/10 transition-colors cursor-pointer"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => deleteNote(chapterId, n.id)}
                          title={t("delete")}
                          className="grid place-items-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {chapter.exam && (
            <section className="relative overflow-hidden rounded-3xl border border-amber-400/35 bg-gradient-to-br from-amber-400/10 to-slate-950 p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="grid place-items-center w-11 h-11 rounded-xl border border-amber-400/40 bg-amber-400/15 text-amber-200 shrink-0">
                  <ClipboardList size={19} />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-black text-white">{examResult ? L("Exam completed", "এক্সাম সম্পন্ন") : chapter.exam.title}</h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {examResult
                      ? L("This step is locked after one submission.", "একবার জমা দেওয়ার পর এই ধাপের এক্সাম লক হয়ে গেছে।")
                      : !examUnlocked
                      ? L("Complete the previous step to unlock this exam.", "এই এক্সাম আনলক করতে আগের ধাপটি সম্পূর্ণ করো।")
                      : chapter.exam.description}
                  </p>
                  <div className="mt-2 text-[10px] uppercase tracking-widest text-amber-300">
                    {examResult
                      ? `${L("Score", "স্কোর")} ${examResult.score}% · ${examResult.passed ? L("Passed", "পাস") : L("Not passed", "পাস হয়নি")}`
                      : `${chapter.exam.questions.length} ${L("questions", "প্রশ্ন")} · ${chapter.exam.timeLimitMinutes}m · ${L("pass", "পাস")} ${chapter.exam.passMark}%`}
                  </div>
                </div>
                {examResult || !examUnlocked ? <LockKeyhole size={18} className="shrink-0 text-amber-300" /> : (
                  <button onClick={() => nav({ view: "finalExam", courseId, chapterId })} className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 cursor-pointer">
                    <ClipboardList size={14} /> {L("Take exam", "এক্সাম দাও")}
                  </button>
                )}
              </div>
            </section>
          )}
        </div>

        {/* ===== right: terminal + quiz ===== */}
        <div className="space-y-6 min-w-0">
          <section>
            <div className="flex items-center gap-2 text-emerald-300 mb-3 px-1">
              <TerminalSquare size={16} />
              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{t("shellTitle")}</h2>
                <p className="text-[11px] text-slate-500 normal-case tracking-normal font-normal">{t("shellNote")}</p>
              </div>
            </div>
            <KaliTerminal courseId={courseId} seedIndex={idx} label={`${courseId}/${chapterId}`} note={t("shellNote")} />
          </section>

          {randomizedQuizzes.map((q, quizIndex) => {
            const resultKey = quizIndex === 0 ? chapterId : `${chapterId}:quiz-${quizIndex}`;
            const solved = answers[resultKey]?.correct;
            const quizTries = tries[quizIndex] || 0;
            return (
              <section key={quizIndex} className="glass rounded-3xl p-5 sm:p-6 border-cyan-400/25!">
                <div className="flex items-center gap-2 text-cyan-300">
                  <Crosshair size={16} />
                  <div>
                    <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{t("quizTitle")} {quizIndex + 1}</h2>
                    {!solved && <p className="text-[11px] text-slate-500 normal-case tracking-normal font-normal mt-0.5">{t("quizSub")}</p>}
                  </div>
                </div>
                <h3 className="mt-4 font-bold leading-snug">{isBn ? q.qBn : q.q}</h3>
                <div className="mt-4 space-y-2.5">
                  {(isBn ? q.optsBn : q.opts).map((opt, i) => {
                    const isPicked = picked[quizIndex] === i;
                    const isCorrect = solved && i === q.answer;
                    const wrongFlash = shaking?.quizIndex === quizIndex && shaking.option === i;
                    let cls = "border-white/10 bg-white/[0.03] hover:border-cyan-400/40 hover:bg-cyan-400/5 text-slate-300";
                    if (isCorrect) cls = "border-emerald-400/60 bg-emerald-400/15 text-emerald-200 shadow-[0_0_25px_-5px_rgba(52,211,153,.5)]";
                    else if (wrongFlash) cls = "border-rose-400/70 bg-rose-400/15 text-rose-200 anim-shake";
                    else if (isPicked && !solved) cls = "border-cyan-400/50 bg-cyan-400/10";
                    return (
                      <button key={i} onClick={() => pick(quizIndex, q, i)} disabled={!!solved} className={`w-full text-left flex items-start gap-3 rounded-xl border px-4 py-3 text-sm transition-all cursor-pointer disabled:cursor-default ${cls}`}>
                        <span className={`mt-0.5 grid place-items-center w-5 h-5 rounded-md border text-[10px] font-mono font-bold shrink-0 ${isCorrect ? "border-emerald-400/60 bg-emerald-400/20 text-emerald-200" : wrongFlash ? "border-rose-400/60 bg-rose-400/20 text-rose-200" : "border-white/15 text-slate-500"}`}>
                          {String.fromCharCode(65 + i)}
                        </span>
                        <span className="leading-relaxed">{opt}</span>
                        {isCorrect && <CheckCircle2 size={16} className="ml-auto mt-0.5 text-emerald-300 shrink-0 anim-pop" />}
                        {wrongFlash && <XCircle size={16} className="ml-auto mt-0.5 text-rose-300 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {(solved || quizTries > 0) && (
                  <div className={`mt-4 flex items-start gap-2 text-xs font-semibold ${solved ? "text-emerald-300" : "text-rose-300"}`}>
                    {solved ? <CheckCircle2 size={14} className="mt-0.5 shrink-0" /> : <XCircle size={14} className="mt-0.5 shrink-0" />}
                    <span>{solved ? `${t("checkResult")} ${answers[resultKey]?.xp ? `+${answers[resultKey].xp} XP` : ""}` : t("wrongResult")}</span>
                  </div>
                )}
                {solved && (
                  <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4 anim-fade-up">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-cyan-300"><Info size={11} /> {t("explanation")}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-400">{isBn ? q.explainBn : q.explain}</p>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      {/* prev / next */}
      <div className="flex items-center justify-between gap-3 pt-2">
        {prev ? (
          <button
            onClick={() => nav({ view: "chapter", courseId, chapterId: prev.id })}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold hover:border-cyan-400/40 transition-all cursor-pointer max-w-[45%]"
          >
            <ArrowLeft size={14} className="shrink-0" />
            <span className="truncate">{t("prevChapter")}: {isBn ? prev.titleBn : prev.title}</span>
          </button>
        ) : (
          <span />
        )}
        {next ? (
          <button
            onClick={() => nav({ view: "chapter", courseId, chapterId: next.id })}
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_25px_rgba(34,211,238,.45)] active:scale-[0.97] transition-all cursor-pointer max-w-[45%]"
          >
            <span className="truncate">{t("nextChapter")}: {isBn ? next.titleBn : next.title}</span>
            <ArrowRight size={14} className="shrink-0" />
          </button>
        ) : (
          <button
            onClick={() => nav({ view: "course", courseId })}
            className="ml-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 cursor-pointer"
          >
            <Flag size={14} /> {t("backToTrack")}
          </button>
        )}
      </div>
      {lightboxImage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/90 p-4" role="dialog" aria-modal="true" onClick={() => setLightboxImage(null)}>
          <button type="button" aria-label={L("Close image", "ছবি বন্ধ করুন")} onClick={() => setLightboxImage(null)} className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-slate-900/80 text-2xl text-white hover:bg-slate-800 cursor-pointer">×</button>
          <img src={lightboxImage.src} alt={lightboxImage.alt} onClick={(e) => e.stopPropagation()} className="max-h-[90vh] max-w-[95vw] rounded-xl object-contain shadow-2xl" />
        </div>
      )}
    </div>
  );
};
