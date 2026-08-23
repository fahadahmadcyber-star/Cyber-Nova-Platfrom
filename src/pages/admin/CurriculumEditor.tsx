import React, { useState } from "react";
import {
  BookOpen, Plus, Trash2, ChevronRight, ChevronDown, Save, FileText,
  HelpCircle, CheckCircle2, Layers, RotateCcw, Image,
} from "lucide-react";
// Full CRUD editor for every course, lesson, reading section and quiz.
import { useStore } from "../../store";

const Inp: React.FC<{
  label?: string; value: string; onChange: (v: string) => void; ph?: string; area?: boolean; small?: boolean;
}> = ({ label, value, onChange, ph, area, small }) => (
  <label className="block">
    {label && <span className="text-[11px] font-semibold text-slate-400 mb-1 block">{label}</span>}
    {area ? (
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={ph}
        className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-3 py-2 text-sm transition-all resize-y"
      />
    ) : (
      <input
        value={value} onChange={(e) => onChange(e.target.value)} placeholder={ph}
        className={`w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-3 py-2 transition-all ${small ? "text-xs" : "text-sm"}`}
      />
    )}
  </label>
);

export const CurriculumEditor: React.FC = () => {
  const {
    isBn, curriculum, toast, pushNotification,
    addCourse, updateCourse, deleteCourse,
    addChapter, updateChapter, deleteChapter,
    addSection, updateSection, deleteSection,
    clearChapterLessons, deleteQuiz,
    updateQuiz, resetCurriculum,
    updateExam, addExamQuestion,
    updateExamQuestion, deleteExamQuestion,
  } = useStore();

  const L = (en: string, bn: string) => (isBn ? bn : en);
  const [openCourse, setOpenCourse] = useState<string | null>(curriculum[0]?.id ?? null);
  const [openChapter, setOpenChapter] = useState<string | null>(null);
  const [newCourse, setNewCourse] = useState({ en: "", bn: "" });
  const [newCh, setNewCh] = useState<Record<string, { en: string; bn: string }>>({});

  return (
    <div className="space-y-5">
      {/* create course */}
      <div className="glass rounded-3xl p-6">
        <h3 className="font-bold flex items-center gap-2 mb-1">
          <Layers size={16} className="text-cyan-300" /> {L("Create a New Course", "নতুন কোর্স তৈরি করো")}
        </h3>
        <p className="text-xs text-slate-500 mb-3">
          {L("Every course you add appears instantly across the whole app.", "তুমি যে কোর্সই যোগ করো, তা সাথে সাথে পুরো অ্যাপে দেখা যাবে।")}
        </p>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
          <Inp value={newCourse.en} onChange={(v) => setNewCourse((s) => ({ ...s, en: v }))} ph={L("Course title (English)", "কোর্সের শিরোনাম (ইংরেজি)")} />
          <Inp value={newCourse.bn} onChange={(v) => setNewCourse((s) => ({ ...s, bn: v }))} ph={L("Course title (Bangla)", "কোর্সের শিরোনাম (বাংলা)")} />
          <button
            onClick={() => {
              if (!newCourse.en.trim() && !newCourse.bn.trim()) return;
              addCourse(newCourse.en.trim(), newCourse.bn.trim());
              setNewCourse({ en: "", bn: "" });
              toast(L("Course created", "কোর্স তৈরি হয়েছে"), "xp");
            }}
            className="rounded-lg px-5 py-2 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 active:scale-[0.97] transition-all cursor-pointer flex items-center gap-1.5 justify-center"
          >
            <Plus size={15} /> {L("Add", "যোগ")}
          </button>
        </div>
      </div>

      {/* courses */}
      {curriculum.map((course) => {
        const expanded = openCourse === course.id;
        return (
          <div key={course.id} className="glass rounded-3xl overflow-hidden">
            {/* course header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8">
              <button
                onClick={() => setOpenCourse(expanded ? null : course.id)}
                className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
              >
                {expanded ? <ChevronDown size={16} className="text-cyan-300 shrink-0" /> : <ChevronRight size={16} className="text-slate-500 shrink-0" />}
                <BookOpen size={16} className="text-cyan-300 shrink-0" />
                <span className="font-black truncate">{isBn ? course.titleBn || course.title : course.title}</span>
                <span className="text-[10px] font-mono text-slate-500 shrink-0">
                  {course.chapters.length} {L("chapters", "চ্যাপ্টার")}
                </span>
              </button>
              <button
                onClick={() => {
                  if (confirm(L(`Delete course "${course.title}"?`, `"${course.titleBn}" কোর্সটি মুছে ফেলবে?`))) {
                    deleteCourse(course.id);
                    toast(L("Course deleted", "কোর্স মুছে ফেলা হয়েছে"), "warn");
                  }
                }}
                className="grid place-items-center w-8 h-8 rounded-lg text-rose-300/70 hover:text-rose-300 hover:bg-rose-400/10 transition-colors cursor-pointer shrink-0"
                title={L("Delete course", "কোর্স ডিলিট")}
              >
                <Trash2 size={14} />
              </button>
            </div>

            {expanded && (
              <div className="p-5 space-y-5">
                {/* course fields */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <Inp label={L("Title (English)", "শিরোনাম (ইংরেজি)")} value={course.title} onChange={(v) => updateCourse(course.id, { title: v })} />
                  <Inp label={L("Title (Bangla)", "শিরোনাম (বাংলা)")} value={course.titleBn} onChange={(v) => updateCourse(course.id, { titleBn: v })} />
                  <Inp label={L("Tagline (English)", "ট্যাগলাইন (ইংরেজি)")} value={course.tagline} onChange={(v) => updateCourse(course.id, { tagline: v })} area />
                  <Inp label={L("Tagline (Bangla)", "ট্যাগলাইন (বাংলা)")} value={course.taglineBn} onChange={(v) => updateCourse(course.id, { taglineBn: v })} area />
                </div>

                {/* chapters */}
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
                    {L("Lessons / Chapters", "পাঠ / চ্যাপ্টার")}
                  </div>
                  <div className="space-y-2">
                    {course.chapters.length === 0 && (
                      <p className="text-xs text-slate-500 py-3">{L("No chapters yet — add one below.", "এখনও কোনো চ্যাপ্টার নেই — নিচে যোগ করো।")}</p>
                    )}
                    {course.chapters.map((ch, ci) => {
                      const chOpen = openChapter === ch.id;
                      return (
                        <div key={ch.id} className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-2.5">
                            <button
                              onClick={() => setOpenChapter(chOpen ? null : ch.id)}
                              className="flex items-center gap-2 flex-1 min-w-0 text-left cursor-pointer"
                            >
                              {chOpen ? <ChevronDown size={14} className="text-cyan-300 shrink-0" /> : <ChevronRight size={14} className="text-slate-500 shrink-0" />}
                              <span className="grid place-items-center w-6 h-6 rounded-md bg-cyan-400/10 border border-cyan-400/25 text-[10px] font-mono font-bold text-cyan-300 shrink-0">
                                {ci + 1}
                              </span>
                              <span className="text-sm font-semibold truncate">{isBn ? ch.titleBn || ch.title : ch.title}</span>
                            </button>
                            <button
                              onClick={() => {
                                deleteChapter(course.id, ch.id);
                                toast(L("Chapter deleted", "চ্যাপ্টার মুছে ফেলা হয়েছে"), "warn");
                              }}
                              className="grid place-items-center w-7 h-7 rounded-lg text-rose-300/70 hover:text-rose-300 hover:bg-rose-400/10 transition-colors cursor-pointer shrink-0"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {chOpen && (
                            <div className="px-4 pb-4 space-y-4 border-t border-white/8 pt-4">
                              {/* chapter basics */}
                              <div className="grid sm:grid-cols-2 gap-3">
                                <Inp label={L("Lesson title (English)", "পাঠের শিরোনাম (ইংরেজি)")} value={ch.title} onChange={(v) => updateChapter(course.id, ch.id, { title: v })} />
                                <Inp label={L("Lesson title (Bangla)", "পাঠের শিরোনাম (বাংলা)")} value={ch.titleBn} onChange={(v) => updateChapter(course.id, ch.id, { titleBn: v })} />
                                <Inp label={L("Intro (English)", "সূচনা (ইংরেজি)")} value={ch.intro} onChange={(v) => updateChapter(course.id, ch.id, { intro: v })} area />
                                <Inp label={L("Intro (Bangla)", "সূচনা (বাংলা)")} value={ch.introBn} onChange={(v) => updateChapter(course.id, ch.id, { introBn: v })} area />
                              </div>
                              <label className="block max-w-[180px]">
                                <span className="text-[11px] font-semibold text-slate-400 mb-1 block">{L("Read time (minutes)", "পড়ার সময় (মিনিট)")}</span>
                                <input
                                  type="number" min={1} value={ch.minutes}
                                  onChange={(e) => updateChapter(course.id, ch.id, { minutes: Math.max(1, parseInt(e.target.value || "1", 10)) })}
                                  className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2 text-sm tabular-nums"
                                />
                              </label>

                              {/* sections */}
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1.5">
                                    <FileText size={11} /> {L("Reading sections", "পড়ার সেকশন")} ({ch.sections.length})
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => addSection(course.id, ch.id)}
                                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 cursor-pointer"
                                    >
                                      <Plus size={11} /> {L("Add section", "সেকশন যোগ")}
                                    </button>
                                    <button
                                      onClick={() => { if (confirm(L("Delete all reading sections in this step?", "এই ধাপের সব পড়ার সেকশন মুছে ফেলবে?"))) clearChapterLessons(course.id, ch.id); }}
                                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold bg-rose-400/10 border border-rose-400/30 text-rose-300 cursor-pointer"
                                    >
                                      <Trash2 size={11} /> {L("Delete lessons", "লেসন ডিলিট")}
                                    </button>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  {ch.sections.map((sec, si) => (
                                    <div key={si} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-mono text-slate-500">#{si + 1}</span>
                                        <button
                                          onClick={() => deleteSection(course.id, ch.id, si)}
                                          className="text-rose-300/70 hover:text-rose-300 cursor-pointer"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>
                                      <div className="grid sm:grid-cols-2 gap-2">
                                        <Inp label={L("Heading (EN)", "শিরোনাম (ইংরেজি)")} value={sec.h} onChange={(v) => updateSection(course.id, ch.id, si, { h: v })} small />
                                        <Inp label={L("Heading (BN)", "শিরোনাম (বাংলা)")} value={sec.hBn} onChange={(v) => updateSection(course.id, ch.id, si, { hBn: v })} small />
                                        <Inp label={L("Body (EN)", "বিবরণ (ইংরেজি)")} value={sec.b} onChange={(v) => updateSection(course.id, ch.id, si, { b: v })} area />
                                        <Inp label={L("Body (BN)", "বিবরণ (বাংলা)")} value={sec.bBn} onChange={(v) => updateSection(course.id, ch.id, si, { bBn: v })} area />
                                        <Inp label={L("Image URL (optional)", "ছবির URL (ঐচ্ছিক)")} value={sec.imageUrl || ""} onChange={(v) => updateSection(course.id, ch.id, si, { imageUrl: v || undefined })} ph="https://..." small />
                                        <label className="block">
                                          <span className="text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1"><Image size={11} /> {L("Choose from gallery", "গ্যালারি থেকে ছবি বাছাই")}</span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                              const file = e.target.files?.[0];
                                              if (!file) return;
                                              const reader = new FileReader();
                                              reader.onload = () => updateSection(course.id, ch.id, si, { imageUrl: String(reader.result) });
                                              reader.readAsDataURL(file);
                                              e.currentTarget.value = "";
                                            }}
                                            className="block w-full text-xs text-slate-400 file:mr-2 file:rounded-lg file:border-0 file:bg-cyan-400/15 file:px-2.5 file:py-1.5 file:text-xs file:font-bold file:text-cyan-200 hover:file:bg-cyan-400/25"
                                          />
                                        </label>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* quiz */}
                              <div className="rounded-xl border border-cyan-400/25 bg-cyan-400/[0.04] p-3">
                                <div className="flex items-center justify-between gap-2 mb-2">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-300 flex items-center gap-1.5">
                                    <HelpCircle size={11} /> {L("Checkpoint quiz", "চেকপয়েন্ট কুইজ")}
                                  </span>
                                  <button
                                    onClick={() => { if (confirm(L("Delete this checkpoint quiz?", "এই চেকপয়েন্ট কুইজটি মুছে ফেলবে?"))) deleteQuiz(course.id, ch.id); }}
                                    className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold bg-rose-400/10 border border-rose-400/30 text-rose-300 cursor-pointer"
                                  >
                                    <Trash2 size={11} /> {L("Delete quiz", "কুইজ ডিলিট")}
                                  </button>
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2">
                                  <Inp label={L("Question (EN)", "প্রশ্ন (ইংরেজি)")} value={ch.quiz.q} onChange={(v) => updateQuiz(course.id, ch.id, { q: v })} area />
                                  <Inp label={L("Question (BN)", "প্রশ্ন (বাংলা)")} value={ch.quiz.qBn} onChange={(v) => updateQuiz(course.id, ch.id, { qBn: v })} area />
                                </div>
                                <div className="mt-3 space-y-2">
                                  {[0, 1, 2, 3].map((oi) => (
                                    <div key={oi} className="flex items-start gap-2">
                                      <button
                                        onClick={() => updateQuiz(course.id, ch.id, { answer: oi })}
                                        title={L("Mark as correct answer", "সঠিক উত্তর হিসেবে চিহ্নিত করো")}
                                        className={`mt-5 grid place-items-center w-6 h-6 rounded-md border shrink-0 cursor-pointer transition-all ${
                                          ch.quiz.answer === oi
                                            ? "bg-emerald-400/20 border-emerald-400/60 text-emerald-300"
                                            : "border-white/15 text-slate-600 hover:border-emerald-400/40"
                                        }`}
                                      >
                                        <CheckCircle2 size={13} />
                                      </button>
                                      <div className="grid sm:grid-cols-2 gap-2 flex-1">
                                        <Inp
                                          label={oi === 0 ? L("Options (EN)", "অপশন (ইংরেজি)") : undefined}
                                          value={ch.quiz.opts[oi] || ""}
                                          onChange={(v) => {
                                            const opts = [...ch.quiz.opts];
                                            opts[oi] = v;
                                            updateQuiz(course.id, ch.id, { opts });
                                          }}
                                          ph={`${L("Option", "অপশন")} ${String.fromCharCode(65 + oi)}`}
                                          small
                                        />
                                        <Inp
                                          label={oi === 0 ? L("Options (BN)", "অপশন (বাংলা)") : undefined}
                                          value={ch.quiz.optsBn[oi] || ""}
                                          onChange={(v) => {
                                            const optsBn = [...ch.quiz.optsBn];
                                            optsBn[oi] = v;
                                            updateQuiz(course.id, ch.id, { optsBn });
                                          }}
                                          ph={`${L("Option", "অপশন")} ${String.fromCharCode(65 + oi)}`}
                                          small
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="grid sm:grid-cols-2 gap-2 mt-3">
                                  <Inp label={L("Explanation (EN)", "ব্যাখ্যা (ইংরেজি)")} value={ch.quiz.explain} onChange={(v) => updateQuiz(course.id, ch.id, { explain: v })} area />
                                  <Inp label={L("Explanation (BN)", "ব্যাখ্যা (বাংলা)")} value={ch.quiz.explainBn} onChange={(v) => updateQuiz(course.id, ch.id, { explainBn: v })} area />
                                </div>
                              </div>

                              <div className="rounded-xl border border-amber-400/25 bg-amber-400/[0.04] p-3">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300 flex items-center gap-1.5">
                                    <HelpCircle size={11} /> {L("Exam Editor", "এক্সাম এডিটর")}
                                  </span>
                                  <button
                                    onClick={() => addExamQuestion(course.id, ch.id)}
                                    className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold bg-amber-400/15 border border-amber-400/40 text-amber-300 cursor-pointer"
                                  >
                                    <Plus size={11} /> {L("Add question", "প্রশ্ন যোগ")}
                                  </button>
                                </div>

                                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                                  <Inp label={L("Exam title", "এক্সামের শিরোনাম")} value={ch.exam?.title || ""} onChange={(v) => updateExam(course.id, ch.id, { title: v })} />
                                  <Inp label={L("Exam title (BN)", "এক্সামের শিরোনাম (বাংলা)")} value={ch.exam?.titleBn || ""} onChange={(v) => updateExam(course.id, ch.id, { titleBn: v })} />
                                  <label className="block">
                                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">{L("Time limit (minutes)", "সময়সীমা (মিনিট)")}</span>
                                    <input
                                      type="number" min={1} value={ch.exam?.timeLimitMinutes || 25}
                                      onChange={(e) => updateExam(course.id, ch.id, { timeLimitMinutes: Math.max(1, parseInt(e.target.value || "25", 10)) })}
                                      className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2 text-sm tabular-nums"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">{L("Full marks", "পূর্ণমান")}</span>
                                    <input
                                      type="number" min={1} value={ch.exam?.totalMarks || 100}
                                      onChange={(e) => updateExam(course.id, ch.id, { totalMarks: Math.max(1, parseInt(e.target.value || "100", 10)) })}
                                      className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2 text-sm tabular-nums"
                                    />
                                  </label>
                                  <label className="block">
                                    <span className="text-[11px] font-semibold text-slate-400 mb-1 block">{L("Pass marks", "পাস নম্বর")}</span>
                                    <input
                                      type="number" min={0} max={ch.exam?.totalMarks || 100} value={ch.exam?.passMark ?? 70}
                                      onChange={(e) => updateExam(course.id, ch.id, { passMark: Math.min(ch.exam?.totalMarks || 100, Math.max(0, parseInt(e.target.value || "0", 10))) })}
                                      className="w-full rounded-lg bg-white/5 border border-white/10 focus:border-cyan-400/60 outline-none px-3 py-2 text-sm tabular-nums"
                                    />
                                  </label>
                                  <Inp label={L("Instructions (EN)", "নির্দেশনা (ইংরেজি)")} value={ch.exam?.description || ""} onChange={(v) => updateExam(course.id, ch.id, { description: v })} area />
                                  <Inp label={L("Instructions (BN)", "নির্দেশনা (বাংলা)")} value={ch.exam?.descriptionBn || ""} onChange={(v) => updateExam(course.id, ch.id, { descriptionBn: v })} area />
                                  <Inp label={L("Start button (EN)", "Start বাটন (ইংরেজি)")} value={ch.exam?.startLabel || "Start Exam"} onChange={(v) => updateExam(course.id, ch.id, { startLabel: v })} />
                                  <Inp label={L("Start button (BN)", "Start বাটন (বাংলা)")} value={ch.exam?.startLabelBn || "এক্সাম শুরু করুন"} onChange={(v) => updateExam(course.id, ch.id, { startLabelBn: v })} />
                                  <label className="sm:col-span-2 flex items-center gap-2 rounded-lg border border-amber-400/20 bg-amber-400/[0.04] px-3 py-2.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={ch.exam?.requiresPreviousStep ?? true}
                                      onChange={(e) => updateExam(course.id, ch.id, { requiresPreviousStep: e.target.checked })}
                                      className="accent-amber-400"
                                    />
                                    <span className="text-xs text-amber-100/80">
                                      {L("Lock until the previous step is completed", "আগের ধাপ শেষ না হওয়া পর্যন্ত এক্সাম লক রাখো")}
                                    </span>
                                  </label>
                                </div>

                                <div className="space-y-3">
                                  {(ch.exam?.questions || []).map((question, qi) => (
                                    <div key={qi} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                                      <div className="mb-2 flex items-center justify-between gap-2">
                                        <span className="text-[10px] font-mono text-slate-500">Q#{qi + 1}</span>
                                        <button
                                          onClick={() => deleteExamQuestion(course.id, ch.id, qi)}
                                          className="text-rose-300/70 hover:text-rose-300 cursor-pointer"
                                        >
                                          <Trash2 size={12} />
                                        </button>
                                      </div>

                                      <div className="grid sm:grid-cols-2 gap-2">
                                        <Inp label={L("Question (EN)", "প্রশ্ন (ইংরেজি)")} value={question.q} onChange={(v) => updateExamQuestion(course.id, ch.id, qi, { q: v })} area />
                                        <Inp label={L("Question (BN)", "প্রশ্ন (বাংলা)")} value={question.qBn} onChange={(v) => updateExamQuestion(course.id, ch.id, qi, { qBn: v })} area />
                                      </div>

                                      <div className="mt-3 space-y-2">
                                        {[0, 1, 2, 3].map((oi) => (
                                          <div key={oi} className="flex items-start gap-2">
                                            <button
                                              onClick={() => updateExamQuestion(course.id, ch.id, qi, { answer: oi })}
                                              className={`mt-5 grid place-items-center w-6 h-6 rounded-md border shrink-0 cursor-pointer transition-all ${question.answer === oi ? "bg-emerald-400/20 border-emerald-400/60 text-emerald-300" : "border-white/15 text-slate-600 hover:border-emerald-400/40"}`}
                                            >
                                              <CheckCircle2 size={13} />
                                            </button>
                                            <div className="grid sm:grid-cols-2 gap-2 flex-1">
                                              <Inp
                                                label={oi === 0 ? L("Option (EN)", "অপশন (ইংরেজি)") : undefined}
                                                value={question.opts[oi] || ""}
                                                onChange={(v) => {
                                                  const opts = [...question.opts];
                                                  opts[oi] = v;
                                                  updateExamQuestion(course.id, ch.id, qi, { opts });
                                                }}
                                                ph={`${L("Option", "অপশন")} ${String.fromCharCode(65 + oi)}`}
                                                small
                                              />
                                              <Inp
                                                label={oi === 0 ? L("Option (BN)", "অপশন (বাংলা)") : undefined}
                                                value={question.optsBn[oi] || ""}
                                                onChange={(v) => {
                                                  const optsBn = [...question.optsBn];
                                                  optsBn[oi] = v;
                                                  updateExamQuestion(course.id, ch.id, qi, { optsBn });
                                                }}
                                                ph={`${L("Option", "অপশন")} ${String.fromCharCode(65 + oi)}`}
                                                small
                                              />
                                            </div>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="grid sm:grid-cols-2 gap-2 mt-3">
                                        <Inp label={L("Explanation (EN)", "ব্যাখ্যা (ইংরেজি)")} value={question.explain} onChange={(v) => updateExamQuestion(course.id, ch.id, qi, { explain: v })} area />
                                        <Inp label={L("Explanation (BN)", "ব্যাখ্যা (বাংলা)")} value={question.explainBn} onChange={(v) => updateExamQuestion(course.id, ch.id, qi, { explainBn: v })} area />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                                <Save size={12} /> {L("All edits save automatically and appear live.", "সব পরিবর্তন স্বয়ংক্রিয়ভাবে সেভ হয় ও সাথে সাথে দেখা যায়।")}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* add chapter */}
                  <div className="mt-3 grid sm:grid-cols-[1fr_1fr_auto] gap-2">
                    <Inp
                      value={newCh[course.id]?.en || ""}
                      onChange={(v) => setNewCh((p) => ({ ...p, [course.id]: { en: v, bn: p[course.id]?.bn || "" } }))}
                      ph={L("New lesson title (English)", "নতুন পাঠের শিরোনাম (ইংরেজি)")}
                    />
                    <Inp
                      value={newCh[course.id]?.bn || ""}
                      onChange={(v) => setNewCh((p) => ({ ...p, [course.id]: { en: p[course.id]?.en || "", bn: v } }))}
                      ph={L("New lesson title (Bangla)", "নতুন পাঠের শিরোনাম (বাংলা)")}
                    />
                    <button
                      onClick={() => {
                        const v = newCh[course.id];
                        if (!v?.en?.trim() && !v?.bn?.trim()) return;
                        addChapter(course.id, v.en.trim(), v.bn.trim());
                        setNewCh((p) => ({ ...p, [course.id]: { en: "", bn: "" } }));
                        toast(L("Lesson added", "পাঠ যোগ হয়েছে"), "xp");
                        pushNotification(
                          isBn ? `"${course.titleBn}" ট্র্যাকে নতুন পাঠ যোগ হয়েছে` : `A new lesson was added to "${course.title}"`
                        );
                      }}
                      className="rounded-lg px-5 py-2 text-sm font-bold bg-emerald-400/15 border border-emerald-400/40 text-emerald-300 cursor-pointer flex items-center gap-1.5 justify-center"
                    >
                      <Plus size={15} /> {L("Add lesson", "পাঠ যোগ")}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* restore */}
      <div className="rounded-3xl border border-amber-400/25 bg-amber-400/5 p-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-bold text-amber-300 text-sm">{L("Restore original curriculum", "মূল কারিকুলাম ফিরিয়ে আনো")}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{L("Reverts all courses and lessons back to the default content.", "সব কোর্স ও পাঠ ডিফল্ট কনটেন্টে ফিরিয়ে দেয়।")}</p>
        </div>
        <button
          onClick={() => {
            resetCurriculum();
            toast(L("Curriculum restored", "কারিকুলাম ফিরিয়ে আনা হয়েছে"), "warn");
          }}
          className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border border-amber-400/40 text-amber-300 hover:bg-amber-400/10 active:scale-[0.97] transition-all cursor-pointer"
        >
          <RotateCcw size={13} /> {L("Restore", "ফিরিয়ে আনো")}
        </button>
      </div>
    </div>
  );
};
