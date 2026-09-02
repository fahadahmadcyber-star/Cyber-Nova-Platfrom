import React, { useState } from "react";
import {
  ArrowRight, Menu, X, Rocket, TerminalSquare, Languages, BookOpen, Trophy, ShieldCheck,
  Swords, Cpu, Network, Globe, SearchCheck, ChevronDown, Sparkles, Play, Target, Award, Zap,
  LayoutDashboard,
} from "lucide-react";
import { useStore } from "../store";
import { courseCover } from "../data/media";
import { Logo, LogoMark } from "../components/Logo";
import { fmtN } from "./Home";

const trIcon: Record<string, React.ElementType> = {
  cpu: Cpu, network: Network, globe: Globe, search: SearchCheck,
};

export const Landing: React.FC = () => {
  const { isBn, nav, admin, curriculum, user } = useStore();
  const courses = curriculum;
  const [open, setOpen] = useState(false);
  const isLogged = !!user;
  const missionCount = admin.missionCount || courses.reduce((total, course) => total + course.chapters.length, 0);
  const trackCount = admin.trackCount || courses.length;
  const badgeCount = admin.badgeCount || 7;

  const L = (en: string, bn: string) => (isBn ? bn : en);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const features = [
    { icon: Zap, t: L("Gamified Progress", "গেমিফাইড অগ্রগতি"), d: L("Earn real XP, level up, forge badges and climb the leaderboard as you learn.", "শেখার সাথে সাথে আসল XP অর্জন করো, লেভেল বাড়াও, ব্যাজ গড়ো আর লিডারবোর্ডে উঠো।") },
    { icon: TerminalSquare, t: L("Live Kali Labs", "লাইভ কালি ল্যাব"), d: L("Watch realistic terminal replays — nmap, hydra, sqlmap — on every mission.", "প্রতিটি মিশনে বাস্তবসম্মত টার্মিনাল রিপ্লে দেখো — nmap, hydra, sqlmap।") },
    { icon: Languages, t: L("Bangla + English", "বাংলা + ইংরেজি"), d: L("Switch languages instantly. Master cybersecurity in the language you think in.", "তাৎক্ষণিক ভাষা বদলাও। যে ভাষায় তুমি ভাবো, সেই ভাষাতেই সাইবার নিরাপত্তা শেখো।") },
    { icon: BookOpen, t: L("Zero → Hero Path", "শূন্য থেকে হিরো"), d: L("A simple, sequential curriculum built for absolute beginners.", "একদম নতুনদের জন্য সহজ ও ধাপে ধাপে সাজানো কারিকুলাম।") },
    { icon: Target, t: L("Checkpoint Quizzes", "চেকপয়েন্ট কুইজ"), d: L("Every step has a quiz. Every correct answer pumps your XP.", "প্রতিটি ধাপে আছে কুইজ। প্রতিটি সঠিক উত্তর বাড়ায় তোমার XP।") },
    { icon: ShieldCheck, t: L("Ethics First", "নৈতিকতা সবার আগে"), d: L("Learn responsible hacking on an authorized, safe playground.", "অনুমোদিত ও নিরাপদ প্লেগ্রাউন্ডে দায়িত্বশীল হ্যাকিং শেখো।") },
  ];

  const how = [
    { icon: Play, t: L("Sign in & choose a track", "সাইন ইন করে ট্র্যাক বেছে নাও"), d: L("Enter the Cyber-Lamp, pick your first mission and start reading.", "সাইবার-ল্যাম্পে ঢুকো, প্রথম মিশন বেছে নাও আর পড়া শুরু করো।") },
    { icon: TerminalSquare, t: L("Read, then break", "পড়ো, তারপর ভাঙো"), d: L("Study the deck, watch the live shell, then crack the checkpoint quiz.", "পাঠ শেখো, লাইভ শেল দেখো, তারপর চেকপয়েন্ট কুইজ সমাধান করো।") },
    { icon: Trophy, t: L("Earn XP & rank up", "XP অর্জন করো ও র‍্যাংক বাড়াও"), d: L("XP, badges and leaderboards turn every lesson into a game.", "XP, ব্যাজ আর লিডারবোর্ড প্রতিটি পাঠকে বানিয়ে দেয় একটি গেম।") },
  ];

  const navItems = [
    { id: "features", label: L("Features", "ফিচার") },
    { id: "tracks", label: L("Tracks", "ট্র্যাক") },
    { id: "how", label: L("How it works", "যেভাবে কাজ করে") },
  ];

  return (
    <div className={`min-h-screen relative ${isBn ? "bn-mode" : ""}`}>
      {/* ambient bg */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute -top-40 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/15 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-emerald-500/10 blur-[160px]" />
      </div>

      {/* nav */}
      <header className="sticky top-0 z-40 bg-[#040917]/80 backdrop-blur-xl border-b border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center justify-between h-16">
          <button onClick={() => nav({ view: isLogged ? "home" : "login" })} className="cursor-pointer">
            <Logo size={38} compact />
          </button>
          <nav className="hidden md:flex items-center gap-7">
            {navItems.map((n) => (
              <button key={n.id} onClick={() => scrollTo(n.id)} className="text-sm font-semibold text-slate-300 hover:text-cyan-200 transition-colors cursor-pointer">
                {n.label}
              </button>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-3">
            {isLogged ? (
              <button
                onClick={() => nav({ view: "home" })}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.5)] active:scale-[0.97] transition-all cursor-pointer"
              >
                <LayoutDashboard size={15} /> {L("Dashboard", "ড্যাশবোর্ড")}
              </button>
            ) : (
              <button
                onClick={() => nav({ view: "login" })}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.5)] active:scale-[0.97] transition-all cursor-pointer"
              >
                <Swords size={15} /> {L("Sign In", "সাইন ইন")}
              </button>
            )}
          </div>
          <button onClick={() => setOpen(!open)} className="md:hidden grid place-items-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 text-slate-200 cursor-pointer">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open && (
          <div className="md:hidden px-4 pb-4 space-y-2 anim-fade-up">
            {navItems.map((n) => (
              <button key={n.id} onClick={() => { setOpen(false); scrollTo(n.id); }} className="block w-full text-left text-sm font-semibold text-slate-300 bg-white/5 rounded-xl px-4 py-3 cursor-pointer">
                {n.label}
              </button>
            ))}
            <button
              onClick={() => nav({ view: isLogged ? "home" : "login" })}
              className="w-full rounded-xl py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer"
            >
              {isLogged ? L("Dashboard", "ড্যাশবোর্ড") : L("Sign In", "সাইন ইন")}
            </button>
          </div>
        )}
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-14 sm:pt-20 pb-16 grid lg:grid-cols-2 gap-10 items-center">
          <div className="anim-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-emerald-300">
              <Sparkles size={11} /> {L("The gamified cybersecurity academy", "গেমিফাইড সাইবার নিরাপত্তা অ্যাকাডেমি")}
            </span>
            <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.5rem] font-black leading-[1.08] max-w-xl">
              <span className="neon-text text-glow-cyan">{L("Learn to Hack. Learn to Defend.", "হ্যাকিং শেখো। প্রতিরোধ শেখো।")}</span>
              <span className="block text-white mt-2">{L("Become Unstoppable.", "অপরাজেয় হও।")}</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-400">
              {isBn ? admin.heroSubBn : admin.heroSubEn}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              {isLogged ? (
                <button
                  onClick={() => nav({ view: "home" })}
                  className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_40px_rgba(34,211,238,.55)] active:scale-[0.97] transition-all cursor-pointer"
                >
                  <LayoutDashboard size={16} /> {L("Go to Dashboard", "ড্যাশবোর্ডে যাও")}
                </button>
              ) : (
                <>
                  <button
                    onClick={() => nav({ view: "login" })}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_40px_rgba(34,211,238,.55)] active:scale-[0.97] transition-all cursor-pointer"
                  >
                    <Rocket size={16} /> {L("Start Learning Free", "ফ্রি শেখা শুরু করো")}
                  </button>
                  <button
                    onClick={() => nav({ view: "login" })}
                    className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold border border-white/15 bg-white/5 hover:border-cyan-400/50 hover:text-cyan-200 active:scale-[0.97] transition-all cursor-pointer"
                  >
                    <Trophy size={15} /> {L("Enter as Guest", "গেস্ট হিসেবে ঢোকো")}
                  </button>
                </>
              )}
            </div>
            {/* stat strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-md">
              {[
                { v: fmtN(missionCount, isBn), l: L("Missions", "মিশন") },
                { v: fmtN(trackCount, isBn), l: L("Tracks", "ট্র্যাক") },
                { v: fmtN(badgeCount, isBn), l: L("Badges", "ব্যাজ") },
                { v: "২", l: L("Languages", "ভাষা") },
              ].map((s) => (
                <div key={s.l} className="glass rounded-2xl p-3 text-center">
                  <div className="text-xl font-black neon-text">{s.v}</div>
                  <div className="text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          {/* hero video — owner's brand banner */}
          <div className="relative anim-fade-up anim-delay-2">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-cyan-500/25 to-emerald-500/20 blur-2xl" />
            <div className="relative rounded-3xl overflow-hidden border border-cyan-400/25 shadow-2xl scanlines bg-slate-900">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  src="https://streamable.com/e/ifj13k?autoplay=1&muted=1&loop=1"
                  title="Cyber Nova banner video"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                  loading="eager"
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            </div>
          </div>
        </div>
        <button onClick={() => scrollTo("features")} className="hidden sm:flex mx-auto items-center gap-2 pb-8 text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500 hover:text-cyan-300 transition-colors cursor-pointer">
          {L("Explore the range", "রেঞ্জটি ঘুরে দেখো")} <ChevronDown size={14} className="animate-bounce" />
        </button>
      </section>

      {/* features */}
      <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black">
            <span className="neon-text">{L("Why Cyber Nova", "কেন সাইবার নোভা")}</span>
          </h2>
          <p className="mt-3 text-slate-400">{L("Everything a world-class learning platform needs — nothing you don't.", "বিশ্বমানের একটি লার্নিং প্ল্যাটফর্মে যা যা দরকার — তার সবই, অনাবশ্যক কিছু নেই।")}</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div key={f.t} className="glass rounded-3xl p-6 card-hover anim-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="grid place-items-center w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 border border-cyan-400/40 text-cyan-200">
                <f.icon size={20} />
              </div>
              <h3 className="mt-4 font-bold text-lg">{f.t}</h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* tracks preview */}
      <section id="tracks" className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black"><span className="neon-text">{L("Choose your mission track", "তোমার মিশন ট্র্যাক বেছে নাও")}</span></h2>
          <p className="mt-3 text-slate-400">{L("Four tracks, 28 sequential missions — start from the very beginning.", "চারটি ট্র্যাক, ২৮টি ধারাবাহিক মিশন — একদম শুরুর দিক থেকে।")}</p>
        </div>
        <div className="mt-10 grid sm:grid-cols-2 gap-5">
          {courses.map((c, i) => {
            const Icon = trIcon[c.icon];
            return (
              <div key={c.id} className="relative overflow-hidden rounded-3xl border border-white/10 card-hover">
                <img src={courseCover[c.id]} alt={c.title} className="w-full h-44 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040917] via-[#040917]/70 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon size={14} className="text-cyan-300" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-slate-950/60 border border-white/10 rounded-full px-2 py-0.5">
                      {isBn ? `ট্র্যাক ০${i + 1}` : `TRACK 0${i + 1}`}
                    </span>
                  </div>
                  <h3 className="font-black leading-snug">{isBn ? c.titleBn : c.title}</h3>
                  <p className="mt-1 text-xs text-slate-300/80 line-clamp-2">{isBn ? c.taglineBn : c.tagline}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* how it works */}
      <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-black"><span className="neon-text">{L("How it works", "যেভাবে কাজ করে")}</span></h2>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-5">
          {how.map((s, i) => (
            <div key={i} className="relative glass rounded-3xl p-6 text-center card-hover">
              <span className="absolute top-4 right-5 text-4xl font-black text-white/5">{["০১","০২","০৩"][i]}</span>
              <div className="mx-auto grid place-items-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 border border-cyan-400/40 text-cyan-200">
                <s.icon size={24} />
              </div>
              <h3 className="mt-4 font-bold text-lg">{s.t}</h3>
              <p className="mt-1.5 text-sm text-slate-400 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-14">
        <div className="relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-slate-900/40 to-emerald-500/10 p-8 sm:p-14 text-center scanlines">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl" />
          <LogoMark size={52} />
          <h2 className="mt-5 text-2xl sm:text-4xl font-black leading-tight max-w-2xl mx-auto">
            <span className="neon-text text-glow-cyan">{L("Ready to power up the Cyber-Lamp?", "সাইবার-ল্যাম্প জ্বালাতে প্রস্তুত?")}</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">{L("Your journey to the digital universe starts with one switch.", "ডিজিটাল মহাবিশ্বে তোমার যাত্রা শুরু হয় একটি সুইচ দিয়ে।")}</p>
          <button
            onClick={() => nav({ view: "login" })}
            className="mt-7 inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_45px_rgba(34,211,238,.6)] active:scale-[0.97] transition-all cursor-pointer"
          >
            {L("Light it up — Sign In", "জ্বালাও — সাইন ইন")} <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-white/8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={34} compact />
          <p className="text-xs text-slate-500">{L("Built for the next generation of security professionals.", "নতুন প্রজন্মের নিরাপত্তা পেশাজীবীদের জন্য তৈরি।")}</p>
          <div className="flex items-center gap-3 text-slate-500">
            <Award size={15} />
            <span className="text-[11px]">© 2026 {admin.registrations} {L("operatives", "অপারেটিভ")}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
