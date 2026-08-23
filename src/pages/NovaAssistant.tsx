import React, { useMemo, useState } from "react";
import {
  ArrowRight, Bot, BookOpen, Brain, CheckCircle2, ChevronRight, Copy, FileText, FlaskConical,
  History, Lightbulb, Map, MessageCircle, RotateCcw, Send, Sparkles, Target, Trophy, Upload,
} from "lucide-react";
import { useStore } from "../store";
import {
  createNovaReply, getCurrentChapter, getNextRecommendation, type NovaLanguage, type NovaMode,
} from "../lib/novaEngine";

interface Message { id: number; role: "user" | "nova"; text: string; suggestions?: string[]; }

const actions = [
  { id: "learn", icon: BookOpen, title: "Learn a Topic", titleBn: "একটি বিষয় শিখুন", prompt: "Teach me my current topic step by step." },
  { id: "explain", icon: Lightbulb, title: "Explain Something", titleBn: "কিছু বুঝিয়ে দিন", prompt: "Explain my current topic simply." },
  { id: "practice", icon: FlaskConical, title: "Practice", titleBn: "অনুশীলন", prompt: "Give me a practice question." },
  { id: "test", icon: Brain, title: "Test My Knowledge", titleBn: "আমার জ্ঞান যাচাই করুন", prompt: "Test me on my current topic." },
  { id: "roadmap", icon: Map, title: "Build My Roadmap", titleBn: "আমার রোডম্যাপ বানান", prompt: "Build me a learning roadmap for Cybersecurity." },
  { id: "revise", icon: RotateCcw, title: "Revise", titleBn: "রিভিশন", prompt: "Give me a quick revision of my current topic." },
  { id: "file", icon: FileText, title: "Learn From My File", titleBn: "আমার ফাইল থেকে শিখুন", prompt: "I want to learn from an educational file." },
];

const modes: Array<{ id: NovaMode; label: string; labelBn: string; color: string }> = [
  { id: "simple", label: "Simple", labelBn: "সহজ", color: "text-emerald-300" },
  { id: "standard", label: "Standard", labelBn: "সাধারণ", color: "text-cyan-300" },
  { id: "deep", label: "Deep", labelBn: "গভীর", color: "text-violet-300" },
  { id: "exam", label: "Exam", labelBn: "পরীক্ষা", color: "text-amber-300" },
  { id: "practice", label: "Practice", labelBn: "অনুশীলন", color: "text-rose-300" },
];

export const NovaAssistant: React.FC = () => {
  const { isBn, user, curriculum, read, answers, lastVisited, admin } = useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);
  const [language, setLanguage] = useState<NovaLanguage>("auto");
  const [mode, setMode] = useState<NovaMode>("standard");
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [copied, setCopied] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const context = useMemo(() => ({ courses: curriculum, read, answers, lastVisited }), [curriculum, read, answers, lastVisited]);
  const current = getCurrentChapter(context);
  const recommendation = getNextRecommendation(context);
  const completed = read.length;
  const total = curriculum.reduce((sum, course) => sum + course.chapters.length, 0);
  const visibleActions = actions.filter((action) => admin.novaTools[action.id] !== false);
  const visibleModes = modes.filter((item) => admin.novaModes[item.id] !== false);
  React.useEffect(() => {
    if (admin.novaModes[mode] === false) setMode(visibleModes[0]?.id || "standard");
  }, [admin.novaModes, mode, visibleModes]);

  const askNova = async (value = prompt) => {
    const clean = value.trim();
    if (!clean || loading || !admin.novaEnabled) return;
    setError("");
    const userMessage = { id: Date.now(), role: "user" as const, text: clean };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setPrompt("");
    setLoading(true);
    try {
      const response = await fetch("/api/nova", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: nextMessages.map((message) => ({ role: message.role === "nova" ? "assistant" : "user", content: message.text })),
          language,
          mode,
          guidance: admin.novaGuidance,
          responseLength: admin.novaResponseLength,
          context: current ? { course: current.course.title, chapter: current.chapter.title, intro: current.chapter.intro } : undefined,
        }),
      });
      if (!response.ok) throw new Error("unavailable");
      const data = await response.json() as { text?: string };
      if (!data.text) throw new Error("empty");
      setMessages((items) => [...items, { id: Date.now() + 1, role: "nova", text: data.text! }]);
    } catch {
      const fallback = createNovaReply(clean, context, language, mode);
      setMessages((items) => [...items, { id: Date.now() + 1, role: "nova", text: fallback.text, suggestions: fallback.suggestions }]);
      setError(L("Live AI is unavailable, so Nova used its local tutor mode.", "Live AI এখন unavailable, তাই Nova local tutor mode ব্যবহার করেছে।"));
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = async (message: Message) => {
    await navigator.clipboard?.writeText(message.text);
    setCopied(message.id);
    window.setTimeout(() => setCopied(null), 1200);
  };

  return (
    <div className="nova-page space-y-6 pb-8">
      {!admin.novaEnabled && <section className="rounded-3xl border border-amber-400/30 bg-amber-400/[0.08] p-5 text-center text-sm text-amber-100">{L("Nova is temporarily offline. Please check back soon.", "Nova সাময়িকভাবে বন্ধ আছে। পরে আবার চেষ্টা করো।")}</section>}
      <header className="nova-hero relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/15 via-slate-950/50 to-emerald-500/10 p-4 sm:p-6 anim-fade-up">
        <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-300"><Bot size={15} /> Cyber Nova Intelligence</div>
            <h1 className="mt-2 text-2xl font-black sm:text-3xl">Nova Study Assistant</h1>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-300">{L("Ask anything. Learn clearly. Talk naturally.", "যেকোনো প্রশ্ন করো। পরিষ্কারভাবে শেখো। স্বাভাবিকভাবে কথা বলো।")}</p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-200"><Sparkles size={14} /> {L("Learning-aware", "Learning-aware")}</div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="nova-actions glass rounded-3xl p-4 sm:p-5 anim-fade-up anim-delay-1">
          <div className="flex items-center justify-between gap-3"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">{L("Quick actions", "দ্রুত কাজ")}</p><h2 className="mt-1 text-xl font-black">{L("Choose your learning move", "তোমার শেখার কাজ বেছে নাও")}</h2></div><Target size={20} className="text-cyan-300" /></div>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {visibleActions.map(({ icon: Icon, title, titleBn, prompt: actionPrompt }) => <button key={title} onClick={() => void askNova(actionPrompt)} disabled={!admin.novaEnabled} className="group flex min-h-16 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.06] cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-400/10 text-cyan-300"><Icon size={17} className="transition group-hover:scale-110" /></span><span className="text-xs font-bold leading-tight">{isBn ? titleBn : title}</span></button>)}
          </div>
        </section>

        <section className="nova-continue glass rounded-3xl p-5 sm:p-6 anim-fade-up anim-delay-2">
          <div className="flex items-center gap-2 text-emerald-300"><History size={17} /><h2 className="text-sm font-bold uppercase tracking-[0.2em]">{L("Continue learning", "শেখা চালিয়ে যাও")}</h2></div>
          {current ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.05] p-4"><div className="text-[10px] uppercase tracking-widest text-slate-500">{current.course.title}</div><div className="mt-1 font-black">{isBn ? current.chapter.titleBn : current.chapter.title}</div><div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-emerald-400" style={{ width: `${Math.round((read.filter((id) => current.course.chapters.some((ch) => ch.id === id)).length / (current.course.chapters.length || 1)) * 100)}%` }} /></div><span className="text-[10px] text-emerald-300">{L("In progress", "চলছে")}</span></div></div> : <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-400">{L("Start a lesson in Academy and Nova will remember your context.", "Academy থেকে একটি lesson শুরু করো, Nova তোমার context মনে রাখবে।")}</div>}
          <div className="mt-4 flex items-center gap-3 text-xs text-slate-500"><BookOpen size={14} className="text-cyan-300" /> {completed}/{total || 0} {L("lessons completed", "টি lesson সম্পন্ন")}</div>
        </section>
      </div>

      <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="nova-chat glass min-h-[360px] rounded-3xl p-4 sm:p-6 lg:min-h-[460px]">
          <div className="flex items-center justify-between border-b border-white/8 pb-4"><div className="flex items-center gap-2"><MessageCircle size={17} className="text-cyan-300" /><h2 className="text-sm font-bold uppercase tracking-[0.2em]">{L("Tutor session", "Tutor session")}</h2></div>{messages.length > 0 && <button onClick={() => setMessages([])} className="text-xs text-slate-500 hover:text-rose-300 cursor-pointer">{L("Clear", "মুছুন")}</button>}</div>
          {messages.length === 0 ? <div className="grid min-h-[260px] place-items-center text-center"><div className="w-full max-w-2xl"><Bot size={32} className="mx-auto text-cyan-300/70" /><p className="mt-3 text-sm text-slate-400">{L("Ask Nova anything. Your answer will appear here.", "Nova-কে যেকোনো প্রশ্ন করো। উত্তর এখানেই আসবে।")}</p><div className="mt-5 flex gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2 text-left"><input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void askNova()} placeholder={L("Ask anything...", "যেকোনো প্রশ্ন করো...")} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600" /><button onClick={() => void askNova()} disabled={loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 cursor-pointer disabled:opacity-50" aria-label={L("Ask Nova", "Nova-কে জিজ্ঞাসা করুন")}><Send size={17} /></button></div></div></div> : <div className="space-y-4 pt-5">{messages.map((message) => <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line ${message.role === "user" ? "bg-cyan-400/15 text-cyan-100" : "border border-white/10 bg-white/[0.03] text-slate-300"}`}><div>{message.text}</div>{message.role === "nova" && <div className="mt-3 flex flex-wrap gap-2">{message.suggestions?.map((suggestion) => <button key={suggestion} onClick={() => void askNova(suggestion)} className="inline-flex items-center gap-1 rounded-lg border border-cyan-400/20 px-2.5 py-1.5 text-[10px] text-cyan-200 hover:bg-cyan-400/10 cursor-pointer">{suggestion}<ChevronRight size={11} /></button>)}<button onClick={() => void copyMessage(message)} className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] text-slate-500 hover:text-slate-200 cursor-pointer"><Copy size={11} />{copied === message.id ? L("Copied", "কপি হয়েছে") : L("Copy", "কপি")}</button></div>}</div></div>)}{loading && <div className="text-xs text-cyan-300/70">{L("Nova is thinking...", "Nova ভাবছে...")}</div>}<div className="flex gap-2 rounded-2xl border border-white/10 bg-slate-950/70 p-2"><input value={prompt} onChange={(e) => setPrompt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && void askNova()} placeholder={L("Continue the conversation...", "কথা চালিয়ে যাও...")} className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-600" /><button onClick={() => void askNova()} disabled={loading} className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 text-slate-950 cursor-pointer disabled:opacity-50" aria-label={L("Send message", "বার্তা পাঠান")}><Send size={17} /></button></div></div>}
          {error && <p className="mt-3 text-[11px] text-amber-300">{error}</p>}
        </div>
        <aside className="nova-side space-y-4">
          <section className="glass rounded-3xl p-5"><div className="flex items-center gap-2 text-cyan-300"><Sparkles size={16} /><h2 className="text-sm font-bold">{L("Teaching mode", "Teaching mode")}</h2></div><div className="mt-3 flex flex-wrap gap-2">{modes.map((item) => <button key={item.id} onClick={() => setMode(item.id)} className={`rounded-lg border px-2.5 py-2 text-[11px] font-bold cursor-pointer ${mode === item.id ? "border-cyan-400/50 bg-cyan-400/10" : "border-white/10 bg-white/[0.03]"} ${item.color}`}>{isBn ? item.labelBn : item.label}</button>)}</div><label className="mt-5 block text-[10px] font-bold uppercase tracking-widest text-slate-500">{L("Response language", "উত্তরের ভাষা")}</label><select value={language} onChange={(e) => setLanguage(e.target.value as NovaLanguage)} className="mt-2 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2.5 text-sm text-slate-200 outline-none"><option value="auto">{L("Auto Detect", "অটো ডিটেক্ট")}</option><option value="en">English</option><option value="bn">বাংলা</option><option value="banglish">Banglish</option></select></section>
          <section className="rounded-3xl border border-amber-400/25 bg-amber-400/[0.06] p-5"><div className="flex items-center gap-2 text-amber-200"><Trophy size={16} /><h2 className="text-sm font-bold">{L("Next recommendation", "পরবর্তী পরামর্শ")}</h2></div><p className="mt-3 text-xs leading-relaxed text-slate-300">{recommendation ? L(`Your next topic: ${recommendation.chapter.title}`, `তোমার পরবর্তী topic: ${recommendation.chapter.titleBn}`) : L("Your Academy path is complete.", "তোমার Academy path সম্পূর্ণ।")}</p>{recommendation && <button onClick={() => askNova(L(`Teach me ${recommendation.chapter.title}`, `আমাকে ${recommendation.chapter.titleBn} শেখাও`))} className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-200 hover:text-amber-100 cursor-pointer">{L("Start next topic", "পরবর্তী topic শুরু করো")}<ArrowRight size={14} /></button>}</section>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/[0.02] p-4 text-xs text-slate-500 hover:border-cyan-400/30 hover:text-slate-300"><Upload size={16} className="text-cyan-300" />{L("Upload PDF or notes (coming next)", "PDF বা notes upload (শীঘ্রই)")}<input type="file" accept=".pdf,.txt,.md" className="hidden" /></label>
        </aside>
      </section>
      <p className="text-center text-[10px] text-slate-600">{user?.name ? `${L("Personalized for", "Personalized for")} ${user.name}` : ""} · {L("Nova uses Academy context first. Secure AI backend can be connected later.", "Nova আগে Academy context ব্যবহার করে। Secure AI backend পরে যুক্ত করা যাবে।")}</p>
    </div>
  );
};
