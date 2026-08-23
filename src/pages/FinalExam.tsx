import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Trophy, AlertTriangle, ArrowRight,
  ClipboardList, Timer, Award, Target, LockKeyhole,
} from "lucide-react";
import { useStore } from "../store";
import { fmtN } from "./Home";

interface ShuffledQ {
  q: string;
  qBn: string;
  opts: string[];
  optsBn: string[];
  answer: number;
  explain: string;
  explainBn: string;
}

function shuffle<T>(items: T[]): T[] {
  return [...items].sort(() => Math.random() - 0.5);
}

const formatClock = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

export const FinalExam: React.FC<{ courseId: string; chapterId: string }> = ({ courseId, chapterId }) => {
  const { isBn, nav, curriculum, read, finalExamResults, submitExam, toast } = useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);

  const course = curriculum.find((c) => c.id === courseId);
  const chapter = course?.chapters.find((item) => item.id === chapterId);
  const exam = chapter?.exam;
  const resultKey = `${courseId}:${chapterId}`;
  const prevResult = finalExamResults?.[resultKey];

  const [phase, setPhase] = useState<"intro" | "exam" | "result">("intro");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [resultSnapshot, setResultSnapshot] = useState<{ score: number; passed: boolean; correctAnswers: number; totalQuestions: number } | null>(null);
  const timerRef = useRef<number | null>(null);

  const totalExamSeconds = Math.max(60, (exam?.timeLimitMinutes ?? 25) * 60);

  const shuffledQs = useMemo<ShuffledQ[]>(() => {
    if (!exam) return [];
    return shuffle(exam.questions).map((orig) => {
      const order = shuffle(orig.opts.map((_, i) => i));
      return {
        q: orig.q,
        qBn: orig.qBn,
        opts: order.map((i) => orig.opts[i]),
        optsBn: order.map((i) => orig.optsBn[i]),
        answer: order.indexOf(orig.answer),
        explain: orig.explain,
        explainBn: orig.explainBn,
      };
    });
  }, [exam]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finalizeExam = useCallback((finalAnswers: (number | null)[], reason: "manual" | "timeout" = "manual") => {
    if (!exam || !shuffledQs.length) return;
    stopTimer();

    const correct = finalAnswers.reduce((total, answer, index) => {
      const expected = shuffledQs[index]?.answer;
      return total + (answer === expected ? 1 : 0);
    }, 0);

    const totalMarks = exam.totalMarks ?? shuffledQs.length;
    const score = Math.round((correct / shuffledQs.length) * totalMarks);
    const durationMinutes = Math.max(1, Math.round(((totalExamSeconds - Math.max(0, timeLeft)) / 60) || 1));
    const passed = score >= exam.passMark;

    setResultSnapshot({ score, passed, correctAnswers: correct, totalQuestions: shuffledQs.length });
    submitExam(courseId, chapterId, score, {
      totalQuestions: shuffledQs.length,
      correctAnswers: correct,
      durationMinutes,
      timeLimitMinutes: exam.timeLimitMinutes,
      questionResults: shuffledQs.map((question, index) => {
        const selectedIndex = finalAnswers[index];
        return {
          question: question.q,
          questionBn: question.qBn,
          selected: selectedIndex === null || selectedIndex === undefined ? "Not answered" : question.opts[selectedIndex],
          selectedBn: selectedIndex === null || selectedIndex === undefined ? "উত্তর দেওয়া হয়নি" : question.optsBn[selectedIndex],
          correct: question.opts[question.answer],
          correctBn: question.optsBn[question.answer],
          isCorrect: selectedIndex === question.answer,
        };
      }),
    });

    if (reason === "timeout") {
      toast(L("Time is up — exam auto-submitted.", "সময় শেষ — পরীক্ষা স্বয়ংক্রিয়ভাবে সাবমিট হয়েছে।"), "warn");
    } else {
      toast(L("Exam submitted successfully.", "পরীক্ষা সফলভাবে জমা হয়েছে।"), "xp");
    }

    setPhase("result");
  }, [courseId, chapterId, exam, shuffledQs, stopTimer, submitExam, timeLeft, totalExamSeconds, toast, L]);

  useEffect(() => {
    if (phase !== "exam") return;

    if (timeLeft <= 0) {
      finalizeExam(answers, "timeout");
      return;
    }

    timerRef.current = window.setInterval(() => {
      setTimeLeft((current) => Math.max(0, current - 1));
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, timeLeft, finalizeExam]);

  const handlePick = (questionIndex: number, optionIndex: number) => {
    if (phase !== "exam") return;
    setAnswers((current) => {
      const next = [...current];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const startExam = () => {
    setAnswers([]);
    setResultSnapshot(null);
    setTimeLeft(totalExamSeconds);
    setPhase("exam");
  };

  if (!course || !exam) {
    return (
      <div className="text-center py-20 text-slate-400">
        {L("No exam is available for this step.", "এই ধাপের জন্য এখনো কোনো পরীক্ষা তৈরি করা হয়নি।")}
      </div>
    );
  }

  const passMark = exam.passMark;
  const chapterIndex = course?.chapters.findIndex((item) => item.id === chapterId) ?? -1;
  const previousChapter = chapterIndex > 0 ? course?.chapters[chapterIndex - 1] : undefined;
  const examUnlocked = exam.requiresPreviousStep === false || !previousChapter || read.includes(previousChapter.id);

  if (!examUnlocked && !prevResult) {
    return (
      <div className="max-w-2xl mx-auto anim-fade-up">
        <div className="rounded-3xl border border-amber-400/30 bg-amber-400/[0.06] p-8 text-center">
          <LockKeyhole size={32} className="mx-auto text-amber-300" />
          <h1 className="mt-4 text-2xl font-black text-white">{L("Exam locked", "এক্সাম লক করা আছে")}</h1>
          <p className="mt-2 text-sm text-slate-400">{L("Complete the previous step before starting this skill test.", "এই স্কিল টেস্ট শুরু করার আগে আগের ধাপটি সম্পূর্ণ করো।")}</p>
          <button onClick={() => nav({ view: "chapter", courseId, chapterId })} className="mt-6 rounded-xl bg-white/10 px-4 py-2.5 text-xs font-bold text-slate-200 cursor-pointer">{L("Back to step", "ধাপে ফিরে যাও")}</button>
        </div>
      </div>
    );
  }

  if (prevResult && phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto anim-fade-up">
        <div className="rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 via-slate-900 to-slate-950 p-7 sm:p-10 text-center">
          <div className="mx-auto grid place-items-center w-20 h-20 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 text-emerald-200 mb-4">
            <LockKeyhole size={34} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{L("Exam locked", "এক্সাম লক হয়ে গেছে")}</h1>
          <p className="mt-2 text-sm text-slate-400">
            {L("This step allows one attempt only. Your submitted report is saved below.", "এই ধাপে একবারই এক্সাম দেওয়া যাবে। তোমার জমা দেওয়া রিপোর্ট নিচে সংরক্ষিত আছে।")}
          </p>
          <div className={`mt-6 rounded-2xl border p-5 ${prevResult.passed ? "border-emerald-400/30 bg-emerald-400/10" : "border-rose-400/30 bg-rose-400/10"}`}>
            <div className="text-[10px] uppercase tracking-widest text-slate-400">{L("Exam report", "এক্সাম রিপোর্ট")}</div>
            <div className={`mt-2 text-5xl font-black ${prevResult.passed ? "text-emerald-300" : "text-rose-300"}`}>{fmtN(prevResult.score, isBn)}%</div>
            <div className="mt-2 text-sm text-slate-300">{prevResult.passed ? L("Passed", "পাস") : L("Not passed", "পাস হয়নি")}</div>
          </div>
          <button onClick={() => nav({ view: "chapter", courseId, chapterId })} className="mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer">
            {L("Back to step", "ধাপে ফিরে যাও")} <ArrowRight size={15} />
          </button>
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div className="max-w-2xl mx-auto space-y-6 anim-fade-up">
        <div className="relative overflow-hidden rounded-3xl border border-amber-400/30 bg-gradient-to-br from-amber-400/10 via-slate-900 to-slate-950 p-7 sm:p-9">
          <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative flex flex-col items-center text-center gap-4">
            <div className="grid place-items-center w-16 h-16 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300">
              <ClipboardList size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {isBn ? exam.titleBn || exam.title : exam.title || L("Step Examination", "ধাপের পরীক্ষা")}
            </h1>
            <p className="text-slate-400 text-sm">{isBn ? chapter?.titleBn : chapter?.title}</p>
            {exam.description && <p className="text-xs text-slate-400 max-w-lg whitespace-pre-line">{isBn ? exam.descriptionBn || exam.description : exam.description}</p>}

            <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
              {[
                { icon: Target, label: L("Questions", "প্রশ্ন"), val: exam.questions.length },
                { icon: Timer, label: L("Time limit", "সময়সীমা"), val: `${exam.timeLimitMinutes}m` },
                { icon: Trophy, label: L("Pass mark", "পাসমার্ক"), val: `${passMark}/${exam.totalMarks ?? 100}` },
                { icon: Award, label: L("Reward", "পুরস্কার"), val: L("Certificate", "সার্টিফিকেট") },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-3 text-center border border-white/10">
                  <s.icon size={16} className="text-amber-300 mx-auto" />
                  <div className="mt-1.5 text-lg font-black text-white">{s.val}</div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>

            {prevResult && (
              <div className={`w-full rounded-2xl border p-4 text-sm ${prevResult.passed ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-rose-400/40 bg-rose-400/10 text-rose-200"}`}>
                {prevResult.passed
                  ? L(`Previous attempt: ${prevResult.score}/${exam.totalMarks ?? 100} — PASSED`, `আগের প্রচেষ্টা: ${prevResult.score}/${exam.totalMarks ?? 100} — পাস হয়েছে`)
                  : L(`Previous attempt: ${prevResult.score}/${exam.totalMarks ?? 100} — Failed. Need ${passMark}/${exam.totalMarks ?? 100}.`, `আগের প্রচেষ্টা: ${prevResult.score}/${exam.totalMarks ?? 100} — ফেল। ${passMark}/${exam.totalMarks ?? 100} লাগবে।`)}
              </div>
            )}

            <div className="w-full rounded-2xl border border-amber-400/25 bg-amber-400/5 p-4 text-left text-sm text-amber-100/80">
              <div className="font-bold text-amber-200 mb-1 flex items-center gap-1.5"><AlertTriangle size={14} /> {L("Exam instructions", "এক্সামের নির্দেশনা")}</div>
              <ul className="space-y-1.5 list-disc list-inside">
                <li>{L("There are 15 multiple-choice questions. Each question carries 2 marks.", "মোট ১৫টি বহুচয়নমূলক প্রশ্ন থাকবে। প্রতিটি প্রশ্নের মান ২ নম্বর।")}</li>
                <li>{L("You have 15 minutes. The countdown starts after you click Start Skill Test.", "সময়সীমা ১৫ মিনিট। Start Skill Test চাপার পরেই কাউন্টডাউন শুরু হবে।")}</li>
                <li>{L("Correctness stays hidden while you answer. Submit after reviewing all answers.", "উত্তর দেওয়ার সময় সঠিক বা ভুল দেখানো হবে না। সব উত্তর দেখে Submit করো।")}</li>
                <li>{L("After submission, your score and answer review will be saved in Profile → Exam Reports.", "Submit করার পর score ও উত্তর পর্যালোচনা Profile → Exam Reports-এ সংরক্ষিত থাকবে।")}</li>
                <li>{L(`Score ${passMark} or higher out of ${exam.totalMarks ?? 30} to pass and earn a certificate.`, `${exam.totalMarks ?? 30}-এর মধ্যে ${passMark} বা বেশি পেলে পাস ও সার্টিফিকেট পাবে।`)}</li>
              </ul>
            </div>

            <button
              onClick={startExam}
              className="w-full rounded-xl py-3.5 text-sm font-black text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:shadow-[0_0_35px_rgba(251,191,36,.5)] active:scale-[0.97] transition-all cursor-pointer"
            >
              {isBn ? exam.startLabelBn || "এক্সাম শুরু করুন" : exam.startLabel || "Start Exam"} →
            </button>
            <button onClick={() => nav({ view: "chapter", courseId, chapterId })} className="text-xs text-slate-500 hover:text-slate-300 cursor-pointer">
              ← {L("Back to step", "ধাপে ফিরে যাও")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "exam") {
    const circum = 2 * Math.PI * 26;
    const offset = circum - (circum * timeLeft) / totalExamSeconds;
    const answeredCount = answers.filter((answer) => answer !== null).length;

    return (
      <div className="max-w-2xl mx-auto space-y-5 anim-fade-up">
        <div className="flex items-center gap-3">
          <div className="flex gap-1 flex-1">
            {shuffledQs.map((_, i) => (
              <div key={i} className={`h-1.5 flex-1 rounded-full transition-all ${i < answeredCount ? "bg-emerald-400" : "bg-white/10"}`} />
            ))}
          </div>
          <span className="text-xs font-mono text-slate-400">{fmtN(answeredCount, isBn)}/{fmtN(shuffledQs.length, isBn)} {L("answered", "উত্তর হয়েছে")}</span>
        </div>

        <div className="glass rounded-3xl border border-white/10 p-6">
          <div className="flex items-center justify-between gap-3 mb-5">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300">{L("Skill test in progress", "স্কিল টেস্ট চলছে")}</div>
              <div className="mt-1 text-xs text-slate-500">{L("Your selections are private until you submit.", "সাবমিট না করা পর্যন্ত তোমার উত্তর গোপন থাকবে।")}</div>
            </div>
            <div className={`shrink-0 text-lg font-black tabular-nums ${timeLeft <= 60 ? "text-rose-300 animate-pulse" : "text-amber-300"}`}>
              <Timer size={15} className="inline mr-1" />{formatClock(timeLeft)}
            </div>
          </div>

          <div className="space-y-5">
            {shuffledQs.map((question, questionIndex) => (
              <div key={questionIndex} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 sm:p-5">
                <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300 mb-2">{L(`Question ${questionIndex + 1}`, `প্রশ্ন ${fmtN(questionIndex + 1, isBn)}`)}</div>
                <h2 className="text-base font-bold leading-snug text-white">{isBn ? question.qBn : question.q}</h2>
                <div className="mt-3 space-y-2">
                  {(isBn ? question.optsBn : question.opts).map((option, optionIndex) => (
                    <label key={optionIndex} className={`flex items-start gap-3 rounded-xl border px-3 py-2.5 text-sm cursor-pointer transition-all ${answers[questionIndex] === optionIndex ? "border-cyan-400/60 bg-cyan-400/10 text-cyan-100" : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-cyan-400/40"}`}>
                      <input type="radio" name={`question-${questionIndex}`} checked={answers[questionIndex] === optionIndex} onChange={() => handlePick(questionIndex, optionIndex)} className="mt-1 accent-cyan-400" />
                      <span><span className="mr-2 font-mono text-[10px] text-slate-500">{String.fromCharCode(65 + optionIndex)}</span>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => finalizeExam([...answers], "manual")}
              className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-200 hover:bg-amber-400/15 cursor-pointer"
            >
              {L("Submit Skill Test", "স্কিল টেস্ট জমা দাও")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    return (
      <div className="max-w-2xl mx-auto anim-fade-up">
        <div className="relative overflow-hidden rounded-3xl border border-emerald-400/30 bg-gradient-to-br from-emerald-400/10 via-slate-900 to-slate-950 p-7 sm:p-10 text-center">
          <div className="mx-auto grid place-items-center w-20 h-20 rounded-2xl border border-emerald-400/40 bg-emerald-400/15 text-emerald-200 text-4xl mb-4">✓</div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">{L("Exam submitted", "পরীক্ষা জমা হয়েছে")}</h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{L("Your answer sheet has been submitted. Your score, correct answers, and answer review are now available in your Profile under Exam Reports.", "তোমার উত্তরপত্র জমা হয়েছে। Score, সঠিক উত্তর এবং উত্তর পর্যালোচনা Profile-এর Exam Reports অপশনে সংরক্ষিত আছে।")}</p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button onClick={() => nav({ view: "profile" })} className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer">
              {L("Open Exam Report", "এক্সাম রিপোর্ট দেখুন")} <ArrowRight size={15} />
            </button>
            <button onClick={() => nav({ view: "chapter", courseId, chapterId })} className="flex-1 rounded-xl py-3 text-sm font-bold border border-white/10 text-slate-300 cursor-pointer">{L("Back to chapter", "চ্যাপ্টারে ফিরে যান")}</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
