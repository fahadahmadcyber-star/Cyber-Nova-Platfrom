import React, { useMemo } from "react";
import {
  Flame, BookOpenCheck, Crosshair, ArrowRight, Play, Swords,
  Cpu, Network, Globe, SearchCheck, Sparkles, History, Trophy,
  TrendingUp, LifeBuoy, LayoutDashboard, Award, Target, Activity as ActivityIcon,
  Calendar, Zap, GraduationCap, ChevronRight, Clock, Star, StickyNote,
} from "lucide-react";
import { useStore, computeBadges, Activity } from "../store";
import { levelFor, getChapter } from "../data/courses";
import { Bar, BadgeTile, EmptyState, LevelRing, Avatar } from "../components/ui";

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu, network: Network, globe: Globe, search: SearchCheck,
};

const toBn = (n: number) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]);
export const fmtN = (n: number, bn: boolean) => (bn ? toBn(n) : String(n));

export const Home: React.FC = () => {
  const {
    t, tn, isBn, user, xp, read, answers, admin, nav, lastVisited, arena,
    curriculum, activity, certificates,
  } = useStore();
  const courses = curriculum;
  const lv = levelFor(xp);
  const cracked = Object.values(answers).filter((a) => a.correct).length;
  const badges = computeBadges({ xp, read, answers, arena, curriculum });
  const unlockedBadges = badges.filter((b) => b.unlocked).length;
  const totalMissions = courses.reduce((n, c) => n + c.chapters.length, 0);
  const overallPct = totalMissions ? Math.round((read.length / totalMissions) * 100) : 0;

  const lvCourse = lastVisited ? courses.find((c) => c.id === lastVisited.courseId) : undefined;
  const lvChapter = lvCourse ? lvCourse.chapters.find((ch) => ch.id === lastVisited!.chapterId) : undefined;

  const L = (en: string, bn: string) => (isBn ? bn : en);

  /* ---- weekly activity (last 7 days XP) ---- */
  const week = useMemo(() => {
    const days: { label: string; labelBn: string; xp: number; count: number }[] = [];
    const dayNamesEn = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayNamesBn = ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহঃ", "শুক্র", "শনি"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      const start = d.getTime();
      const end = start + 86400000;
      const dayActs = activity.filter((a) => a.ts >= start && a.ts < end);
      days.push({
        label: dayNamesEn[d.getDay()],
        labelBn: dayNamesBn[d.getDay()],
        xp: dayActs.reduce((s, a) => s + a.xp, 0),
        count: dayActs.length,
      });
    }
    return days;
  }, [activity]);
  const weekMaxXp = Math.max(10, ...week.map((d) => d.xp));
  const weekTotalXp = week.reduce((s, d) => s + d.xp, 0);

  /* ---- streak (consecutive days up to today with activity) ---- */
  const streak = useMemo(() => {
    let s = 0;
    for (let i = week.length - 1; i >= 0; i--) {
      if (week[i].count > 0) s++;
      else break;
    }
    return s;
  }, [week]);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return L("Good morning", "শুভ সকাল");
    if (h < 17) return L("Good afternoon", "শুভ অপরাহ্ন");
    return L("Good evening", "শুভ সন্ধ্যা");
  })();

  const today = new Date().toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    weekday: "long", day: "numeric", month: "long",
  });

  /* ---- KPI cards ---- */
  const kpis = [
    { icon: Flame, label: t("statXP"), val: fmtN(xp, isBn), sub: "XP", accent: "text-cyan-300", ring: "from-cyan-500/20 to-blue-500/10", border: "border-cyan-400/25" },
    { icon: GraduationCap, label: L("Level", "লেভেল"), val: fmtN(lv.index, isBn), sub: tn("levelNames", lv.index), accent: "text-emerald-300", ring: "from-emerald-500/20 to-teal-500/10", border: "border-emerald-400/25" },
    { icon: BookOpenCheck, label: t("statRead"), val: fmtN(read.length, isBn), sub: `/ ${fmtN(totalMissions, isBn)}`, accent: "text-sky-300", ring: "from-sky-500/20 to-cyan-500/10", border: "border-sky-400/25" },
    { icon: Crosshair, label: t("statQuizzes"), val: fmtN(cracked, isBn), sub: `/ ${fmtN(totalMissions, isBn)}`, accent: "text-fuchsia-300", ring: "from-fuchsia-500/20 to-purple-500/10", border: "border-fuchsia-400/25" },
    ...(admin.certificatesEnabled
      ? [{ icon: Award, label: L("Certificates", "সার্টিফিকেট"), val: fmtN(certificates.length, isBn), sub: `/ ${fmtN(courses.length, isBn)}`, accent: "text-amber-300", ring: "from-amber-500/20 to-orange-500/10", border: "border-amber-400/25" }]
      : []),
    { icon: Trophy, label: L("Badges", "ব্যাজ"), val: fmtN(unlockedBadges, isBn), sub: `/ ${fmtN(7, isBn)}`, accent: "text-rose-300", ring: "from-rose-500/20 to-pink-500/10", border: "border-rose-400/25" },
  ];

  /* ---- activity feed helpers ---- */
  const actIcon = (a: Activity) =>
    a.kind === "quiz" ? Crosshair : a.kind === "read" ? BookOpenCheck : a.kind === "arena" ? Swords : a.kind === "certificate" ? Award : StickyNote;
  const actLabel = (a: Activity) => {
    const ch = a.chapterId ? getChapter(a.courseId, a.chapterId) : undefined;
    const chName = ch ? (isBn ? ch.titleBn : ch.title) : "";
    if (a.kind === "quiz") return `${L("Cracked quiz", "কুইজ সমাধান")} · ${chName}`;
    if (a.kind === "read") return `${L("Completed mission", "মিশন সম্পন্ন")} · ${chName}`;
    if (a.kind === "arena") return L("Finished a Nova Run", "নোভা রান শেষ");
    if (a.kind === "certificate") return L("Earned a certificate", "সার্টিফিকেট অর্জন");
    return `${L("Added a note", "নোট যোগ")} · ${chName}`;
  };
  const rel = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return L("just now", "এইমাত্র");
    const m = Math.floor(s / 60);
    if (m < 60) return `${fmtN(m, isBn)}${L("m", "মি")}`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${fmtN(h, isBn)}${L("h", "ঘ")}`;
    return `${fmtN(Math.floor(h / 24), isBn)}${L("d", "দি")}`;
  };

  return (
    <div className="space-y-6">
      {/* announcement marquee */}
      {admin.showAnnounce && (
        <div className="relative overflow-hidden rounded-xl border border-cyan-400/25 bg-cyan-400/5 py-2">
          <div className="marquee flex whitespace-nowrap gap-10 text-[11px] font-mono font-bold tracking-[0.25em] text-cyan-300/90">
            {[0, 1].map((k) => (
              <span key={k} className="flex gap-10">
                {Array.from({ length: 4 }).map((_, i) => (
                  <span key={i} className="flex items-center gap-3">
                    <Sparkles size={11} className="text-emerald-300" />
                    {isBn ? admin.announceBn : admin.announceEn}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ===== header ===== */}
      <section className="anim-fade-up flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Avatar url={user?.avatarUrl} name={user?.name} size={54} ring />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400/60 flex items-center gap-2">
              <LayoutDashboard size={12} /> {L("Dashboard", "ড্যাশবোর্ড")}
              <span className="hidden sm:inline text-slate-600">·</span>
              <span className="hidden sm:inline text-slate-500 normal-case tracking-normal font-medium flex items-center gap-1">
                <Calendar size={10} /> {today}
              </span>
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black truncate">
              {greeting}, <span className="neon-text">{user?.name || "Operative"}</span>
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => nav({ view: "academy" })}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_25px_rgba(34,211,238,.4)] active:scale-[0.97] transition-all cursor-pointer"
          >
            <Play size={14} /> {L("Continue Learning", "শেখা চালিয়ে যাও")}
          </button>
          <button
            onClick={() => nav({ view: "quiz" })}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border border-white/15 bg-white/5 hover:border-emerald-400/50 hover:text-emerald-200 active:scale-[0.97] transition-all cursor-pointer"
          >
            <Swords size={14} /> {t("exploreQuiz")}
          </button>
        </div>
      </section>

      {/* ===== KPI grid ===== */}
      <section className="grid grid-cols-2 lg:grid-cols-6 gap-3 anim-fade-up anim-delay-1">
        {kpis.map((s) => (
          <div key={s.label} className={`relative overflow-hidden glass rounded-2xl p-4 card-hover border ${s.border}`}>
            <div className={`absolute -top-8 -right-8 w-20 h-20 rounded-full bg-gradient-to-br ${s.ring} blur-xl`} />
            <s.icon size={18} className={s.accent} />
            <div className="mt-2.5 flex items-baseline gap-1">
              <span className="text-2xl font-black tabular-nums">{s.val}</span>
              <span className="text-[11px] text-slate-500 font-mono truncate">{s.sub}</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 truncate">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ===== main grid: progression + weekly chart ===== */}
      <section className="grid lg:grid-cols-[340px_1fr] gap-5">
        {/* level progression card */}
        <div className="glass rounded-3xl p-6 anim-fade-up flex flex-col items-center text-center">
          <h2 className="self-start text-sm font-bold uppercase tracking-[0.2em] text-emerald-300 flex items-center gap-2">
            <Zap size={15} /> {t("levelProgress")}
          </h2>
          <div className="mt-4"><LevelRing size={150} /></div>
          <div className="mt-4 w-full">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-slate-300">{tn("levelNames", lv.index)}</span>
              <span className="text-slate-500 tabular-nums">
                {lv.nextXp !== null ? `${fmtN(lv.nextXp - xp, isBn)} XP ${t("nextLevel")}` : t("maxLevel")}
              </span>
            </div>
            <Bar pct={lv.pct} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 w-full">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-center gap-1.5 text-amber-300">
                <Flame size={15} /><span className="text-xl font-black tabular-nums">{fmtN(streak, isBn)}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{L("Day Streak", "দিনের ধারা")}</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
              <div className="flex items-center justify-center gap-1.5 text-cyan-300">
                <Star size={15} /><span className="text-xl font-black tabular-nums">{fmtN(arena.best, isBn)}</span>
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{L("Best Run", "সেরা রান")}</div>
            </div>
          </div>
        </div>

        {/* weekly activity + overall progress */}
        <div className="space-y-5">
          <div className="glass rounded-3xl p-6 anim-fade-up anim-delay-1">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
                <TrendingUp size={15} /> {L("Weekly Activity", "সাপ্তাহিক কার্যকলাপ")}
              </h2>
              <span className="text-[11px] text-slate-400">
                {L("This week", "এই সপ্তাহ")}: <b className="text-emerald-300">{fmtN(weekTotalXp, isBn)} XP</b>
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-36">
              {week.map((d, i) => {
                const h = Math.round((d.xp / weekMaxXp) * 100);
                const isToday = i === week.length - 1;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <span className="text-[9px] font-mono text-slate-500 tabular-nums">{d.xp > 0 ? fmtN(d.xp, isBn) : ""}</span>
                    <div className="w-full rounded-t-lg relative group" style={{ height: `${Math.max(4, h)}%` }}>
                      <div className={`absolute inset-0 rounded-t-lg transition-all ${
                        d.xp > 0
                          ? isToday
                            ? "bg-gradient-to-t from-emerald-500 to-cyan-400 shadow-[0_0_15px_rgba(34,211,238,.5)]"
                            : "bg-gradient-to-t from-cyan-500/60 to-emerald-400/60"
                          : "bg-white/5"
                      }`} />
                    </div>
                    <span className={`text-[10px] font-bold ${isToday ? "text-cyan-300" : "text-slate-500"}`}>
                      {isBn ? d.labelBn : d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* overall completion */}
          <div className="glass rounded-3xl p-6 anim-fade-up anim-delay-2">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300 flex items-center gap-2">
                <BookOpenCheck size={15} /> {L("Overall Completion", "সামগ্রিক সম্পন্নতা")}
              </h2>
              <span className="text-lg font-black text-emerald-300 tabular-nums">{fmtN(overallPct, isBn)}%</span>
            </div>
            <Bar pct={overallPct} />
            <div className="mt-2 text-[11px] text-slate-500">
              {fmtN(read.length, isBn)} / {fmtN(totalMissions, isBn)} {L("missions completed across all tracks", "মিশন সম্পন্ন সব ট্র্যাক জুড়ে")}
            </div>
          </div>
        </div>
      </section>

      {/* ===== resume / zero-state ===== */}
      {lvCourse && lvChapter ? (
        <button
          onClick={() => nav({ view: "chapter", courseId: lastVisited!.courseId, chapterId: lastVisited!.chapterId })}
          className="w-full text-left glass rounded-2xl p-4 sm:p-5 card-hover flex items-center gap-4 cursor-pointer anim-fade-up border border-cyan-400/20"
        >
          <div className="grid place-items-center w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/25 to-emerald-500/25 border border-cyan-400/40 text-cyan-200 shrink-0">
            <History size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">{t("continueTitle")}</div>
            <div className="mt-1 font-bold truncate">{isBn ? lvChapter.titleBn : lvChapter.title}</div>
            <div className="text-xs text-slate-400 truncate">{isBn ? lvCourse.titleBn : lvCourse.title}</div>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 text-xs font-bold px-3 py-1.5 shrink-0">
            {t("continueBtn")} <ArrowRight size={13} />
          </span>
        </button>
      ) : (
        <div className="anim-fade-up">
          <EmptyState
            icon={Sparkles}
            title={t("emptyJourney")}
            action={
              <button
                onClick={() => nav({ view: courses[0] ? "chapter" : "academy", courseId: courses[0]?.id, chapterId: courses[0]?.chapters[0]?.id })}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer"
              >
                <Play size={13} /> {t("beginJourney")}
              </button>
            }
          />
        </div>
      )}

      {/* ===== tracks snapshot + recent activity ===== */}
      <section className="grid lg:grid-cols-[1fr_360px] gap-5">
        {/* tracks */}
        <div>
          <div className="flex items-end justify-between gap-3 mb-4">
            <h2 className="text-lg sm:text-xl font-black">{t("yourTracks")}</h2>
            <button
              onClick={() => nav({ view: "academy" })}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-3.5 py-2 text-xs font-bold text-cyan-200 hover:bg-cyan-400/20 transition-all cursor-pointer"
            >
              {L("Open Academy", "অ্যাকাডেমি খোলো")} <ArrowRight size={13} />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {courses.map((c, i) => {
              const Icon = iconMap[c.icon] || Cpu;
              const done = c.chapters.filter((ch) => read.includes(ch.id)).length;
              const chTotal = c.chapters.length || 1;
              const pct = Math.round((done / chTotal) * 100);
              return (
                <button
                  key={c.id}
                  onClick={() => nav({ view: "course", courseId: c.id })}
                  className="group glass rounded-2xl p-4 text-left card-hover cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 text-cyan-200 shrink-0">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-bold truncate group-hover:text-cyan-100 transition-colors">
                        {isBn ? c.titleBn : c.title}
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {isBn ? `ট্র্যাক ০${i + 1}` : `TRACK 0${i + 1}`} · {fmtN(done, isBn)}/{fmtN(c.chapters.length, isBn)}
                      </div>
                    </div>
                    <span className="text-xs font-black text-emerald-300 tabular-nums shrink-0">{fmtN(pct, isBn)}%</span>
                  </div>
                  <div className="mt-3"><Bar pct={pct} /></div>
                </button>
              );
            })}
          </div>
        </div>

        {/* recent activity feed */}
        <div className="glass rounded-3xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2 mb-4">
            <ActivityIcon size={15} /> {L("Recent Activity", "সাম্প্রতিক কার্যকলাপ")}
          </h2>
          {activity.length === 0 ? (
            <div className="py-8 text-center">
              <ActivityIcon size={26} className="mx-auto text-slate-600" />
              <p className="mt-2 text-xs text-slate-500">{L("No activity yet. Start a mission to see your timeline.", "এখনো কোনো কার্যকলাপ নেই। টাইমলাইন দেখতে একটি মিশন শুরু করো।")}</p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto no-scrollbar">
              {activity.slice(0, 10).map((a) => {
                const I = actIcon(a);
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3 py-2.5">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 shrink-0">
                      <I size={13} />
                    </span>
                    <span className="flex-1 min-w-0 text-xs text-slate-300 truncate">{actLabel(a)}</span>
                    {a.xp > 0 && <span className="text-[11px] font-bold text-emerald-300 shrink-0">+{fmtN(a.xp, isBn)}</span>}
                    <span className="text-[10px] text-slate-500 shrink-0 tabular-nums">{rel(a.ts)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===== quick links ===== */}
      <section className="grid sm:grid-cols-3 gap-4 anim-fade-up">
        <button onClick={() => nav({ view: "quiz" })} className="glass rounded-2xl p-5 card-hover text-left cursor-pointer group">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-emerald-400/15 border border-emerald-400/30 text-emerald-300 mb-3">
            <Swords size={18} />
          </div>
          <h3 className="font-bold">{t("quizNovaTitle")}</h3>
          <p className="mt-1 text-xs text-slate-400">{L("Rapid-fire arena — test your skills under pressure.", "র‍্যাপিড-ফায়ার এরিনা — চাপের মধ্যে দক্ষতা পরীক্ষা করো।")}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-300 group-hover:gap-2 transition-all">
            {L("Enter arena", "এরিনায় ঢোকো")} <ArrowRight size={11} />
          </span>
        </button>
        <button onClick={() => nav({ view: "help" })} className="glass rounded-2xl p-5 card-hover text-left cursor-pointer group">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-cyan-400/15 border border-cyan-400/30 text-cyan-300 mb-3">
            <LifeBuoy size={18} />
          </div>
          <h3 className="font-bold">{L("Nova Help", "নোভা হেল্প")}</h3>
          <p className="mt-1 text-xs text-slate-400">{L("Chat with the Cyber Nova Team — 24×7 support.", "সাইবার নোভা টিমের সাথে চ্যাট করো — ২৪×৭ সাপোর্ট।")}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-300 group-hover:gap-2 transition-all">
            {L("Open Nova Help", "নোভা হেল্প খোলো")} <ArrowRight size={11} />
          </span>
        </button>
        <button onClick={() => nav({ view: "profile" })} className="glass rounded-2xl p-5 card-hover text-left cursor-pointer group">
          <div className="grid place-items-center w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 mb-3">
            <Award size={18} />
          </div>
          <h3 className="font-bold">{L("Certificates & Profile", "সার্টিফিকেট ও প্রোফাইল")}</h3>
          <p className="mt-1 text-xs text-slate-400">{L("View earned certificates, badges and edit your identity.", "অর্জিত সার্টিফিকেট, ব্যাজ দেখো ও পরিচয় এডিট করো।")}</p>
          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 group-hover:gap-2 transition-all">
            {L("Open profile", "প্রোফাইল খোলো")} <ArrowRight size={11} />
          </span>
        </button>
      </section>

      {/* ===== achievements ===== */}
      <section>
        <div className="flex items-end justify-between mb-4">
          <h2 className="text-lg font-black flex items-center gap-2">
            <Target size={18} className="text-fuchsia-300" /> {t("badgesTitle")}
          </h2>
          <span className="text-xs text-slate-500">{fmtN(unlockedBadges, isBn)} / {fmtN(7, isBn)} {L("unlocked", "আনলকড")}</span>
        </div>
        {unlockedBadges === 0 && (
          <p className="mb-3 text-xs text-slate-500 flex items-center gap-2">
            <Sparkles size={12} className="text-cyan-300" /> {t("badgesEmpty")}
          </p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {badges.map((b) => (
            <BadgeTile key={b.key} badge={b} compact />
          ))}
        </div>
      </section>

      {/* ===== platform stats footer ===== */}
      <section className="glass rounded-2xl p-5 anim-fade-up">
        <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 mb-4">
          <ChevronRight size={14} className="text-cyan-300" /> {L("Platform Stats", "প্ল্যাটফর্ম পরিসংখ্যান")}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          {[
            { icon: TrendingUp, val: fmtN(admin.registrations, isBn), label: t("statStudents"), c: "text-emerald-300" },
            { icon: BookOpenCheck, val: fmtN(totalMissions, isBn), label: L("Total Missions", "মোট মিশন"), c: "text-cyan-300" },
            { icon: GraduationCap, val: fmtN(courses.length, isBn), label: L("Live Tracks", "লাইভ ট্র্যাক"), c: "text-fuchsia-300" },
            { icon: Clock, val: `24×7`, label: L("Support", "সাপোর্ট"), c: "text-amber-300" },
          ].map((s) => (
            <div key={s.label}>
              <s.icon size={16} className={`mx-auto ${s.c}`} />
              <div className="mt-1.5 text-xl font-black tabular-nums">{s.val}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
