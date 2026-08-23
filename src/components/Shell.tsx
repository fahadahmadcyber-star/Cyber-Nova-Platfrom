import React, { useMemo, useRef, useState } from "react";
import {
  GraduationCap, Swords, UserCircle2, Search, Menu, X, ShieldHalf, LifeBuoy, LayoutDashboard,
  Home as HomeIcon, Cpu, Network, Globe, SearchCheck, LogOut, Languages, ChevronRight, BookOpen,
  Radar, Bell, Bot,
} from "lucide-react";
import { useStore, Route } from "../store";
import { levelFor } from "../data/courses";
import { Avatar, Bar, XpChip } from "./ui";
import { Logo, LogoMark } from "./Logo";

const iconMap: Record<string, React.ElementType> = {
  cpu: Cpu, network: Network, globe: Globe, search: SearchCheck,
};

const bnNum = (n: number, bn: boolean) =>
  bn ? String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[+d]) : String(n);

/* ================= header search ================= */
const SearchBox: React.FC<{ onPick: () => void }> = ({ onPick }) => {
  const { t, isBn, nav, curriculum } = useStore();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    const hits: { courseId: string; chapterId: string; ct: string; ch: string; idx: number }[] = [];
    for (const c of curriculum) {
      c.chapters.forEach((ch, i) => {
        const hayEn = `${ch.title} ${(ch.keywords || []).join(" ")} ${c.title}`.toLowerCase();
        const hayBn = `${ch.titleBn} ${c.titleBn}`;
        if (hayEn.includes(needle) || hayBn.includes(needle)) {
          hits.push({
            courseId: c.id,
            chapterId: ch.id,
            ct: isBn ? c.titleBn : c.title,
            ch: isBn ? ch.titleBn : ch.title,
            idx: i,
          });
        }
      });
    }
    return hits.slice(0, 8);
  }, [q, isBn, curriculum]);

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  return (
    <div ref={boxRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-cyan-400/50 focus-within:ring-2 focus-within:ring-cyan-400/15 px-3.5 py-2 transition-all">
        <Search size={15} className="text-cyan-300/80 shrink-0" />
        <input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-transparent outline-none text-sm placeholder:text-slate-500"
        />
        {q && (
          <button onClick={() => setQ("")} className="text-slate-500 hover:text-slate-300 cursor-pointer">
            <X size={14} />
          </button>
        )}
      </div>
      {open && q.length > 0 && (
        <div className="absolute mt-2 w-full rounded-2xl glass-strong overflow-hidden z-[70] shadow-2xl">
          <div className="max-h-[320px] overflow-y-auto p-1.5">
            {q.trim().length < 2 && <div className="px-3 py-3 text-xs text-slate-400">{t("searchHint")}</div>}
            {q.trim().length >= 2 && results.length === 0 && (
              <div className="px-3 py-4 text-xs text-slate-400 flex items-center gap-2">
                <Radar size={14} className="text-amber-300" /> {t("searchEmpty")}
              </div>
            )}
            {results.map((r) => (
              <button
                key={r.chapterId}
                onClick={() => {
                  nav({ view: "chapter", courseId: r.courseId, chapterId: r.chapterId });
                  setOpen(false);
                  setQ("");
                  onPick();
                }}
                className="w-full text-left flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-cyan-400/10 transition-colors cursor-pointer group"
              >
                <div className="grid place-items-center w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 shrink-0">
                  <BookOpen size={14} />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate group-hover:text-cyan-200 transition-colors">{r.ch}</div>
                  <div className="text-[11px] text-slate-400 truncate">
                    {r.ct} · {t("chapterWord")} {r.idx + 1}
                  </div>
                </div>
                <ChevronRight size={14} className="ml-auto text-slate-600 group-hover:text-cyan-300 shrink-0" />
              </button>
            ))}
          </div>
          {results.length > 0 && (
            <div className="px-3 py-2 border-t border-white/8 text-[10px] font-mono text-slate-500">
              {results.length} {t("searchResults")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ================= sidebar ================= */
const SideContent: React.FC<{ onNav: () => void }> = ({ onNav }) => {
  const { route, nav, t, tn, isBn, user, xp, read, logout, curriculum } = useStore();
  const lv = levelFor(xp);

  // The Owner Admin Panel is hidden from normal users. It only appears in the
  // sidebar for the admin (admin@cybernova.com), so the owner has full access
  // to the entire app at any time.
  // Home = main Dashboard Overview. Academy = dedicated learning-tracks page.
  // These are now two genuinely different routes/views.
  const items = [
    { key: "homepage", label: isBn ? "হোমপেজ" : "Homepage", icon: HomeIcon, view: "landing" as const },
    { key: "home", label: isBn ? "ড্যাশবোর্ড" : "Dashboard", icon: LayoutDashboard, view: "home" as const },
    { key: "academy", label: t("navAcademy"), icon: GraduationCap, view: "academy" as const },
    { key: "quiz", label: t("navQuiz"), icon: Swords, view: "quiz" as const },
    { key: "nova", label: isBn ? "নোভা স্টাডি অ্যাসিস্ট্যান্ট" : "Nova Study Assistant", icon: Bot, view: "nova" as const },
    { key: "help", label: isBn ? "নোভা হেল্প" : "Nova Help", icon: LifeBuoy, view: "help" as const },
    { key: "profile", label: t("navProfile"), icon: UserCircle2, view: "profile" as const },
    ...(user?.role === "admin"
      ? [{ key: "admin", label: t("navAdmin"), icon: ShieldHalf, view: "admin" as const }]
      : []),
  ];

  const go = (view: Route["view"], courseId?: string, chapterId?: string) => {
    // Always send a clean route object so no stale courseId/chapterId leaks through.
    nav(courseId ? { view, courseId, chapterId } : { view });
    onNav();
  };

  // Exactly ONE item is highlighted at a time.
  const isActive = (key: string) => {
    switch (key) {
      case "homepage":
        return route.view === "landing";
      case "home":
        return route.view === "home";
      case "academy":
        // Academy owns the tracks page plus any course/chapter drill-down.
        return route.view === "academy" || route.view === "course" || route.view === "chapter";
      default:
        return route.view === key;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* logo */}
      <button onClick={() => go("home")} className="px-5 pt-5 pb-4 text-left w-full cursor-pointer hover:opacity-90 transition-opacity">
        <Logo size={38} compact />
      </button>

      <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar">
        {/* main nav */}
        <div className="px-2 pt-1 pb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">{t("navSectionMain")}</div>
        <div className="space-y-1">
          {items.map((it) => {
            const active = isActive(it.key);
            return (
              <button
                key={it.key}
                onClick={() => go(it.view)}
                className={`relative w-full flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all cursor-pointer ${
                  active
                    ? "bg-gradient-to-r from-cyan-400/15 to-emerald-400/10 text-cyan-100 border border-cyan-400/30"
                    : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                }`}
              >
                {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r bg-gradient-to-b from-cyan-400 to-emerald-400 shadow-[0_0_12px_rgba(34,211,238,.8)]" />}
                <it.icon size={17} className={active ? "text-cyan-300" : ""} />
                <span className="truncate">{it.label}</span>
              </button>
            );
          })}
        </div>

        {/* tracks */}
        <div className="px-2 pt-5 pb-1.5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">{t("navSectionTracks")}</div>
        <div className="space-y-1">
          {curriculum.map((c) => {
            const Icon = iconMap[c.icon] || Cpu;
            const done = c.chapters.filter((ch) => read.includes(ch.id)).length;
            const chTotal = c.chapters.length;
            const active = route.courseId === c.id;
            return (
              <button
                key={c.id}
                onClick={() => go("course", c.id, undefined)}
                className={`w-full text-left rounded-xl px-3.5 py-2.5 transition-all cursor-pointer border ${
                  active ? "bg-white/5 border-cyan-400/25" : "border-transparent hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} className={active ? "text-cyan-300" : "text-slate-500"} />
                  <span className={`text-xs font-semibold truncate ${active ? "text-cyan-100" : "text-slate-300"}`}>
                    {isBn ? c.titleBn : c.title}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 pl-6">
                  <Bar pct={(done / (chTotal || 1)) * 100} className="flex-1" />
                  <span className="text-[9px] font-mono text-slate-500">{bnNum(done, isBn)}/{bnNum(chTotal, isBn)}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* user card */}
      <div className="p-3 border-t border-white/8">
        <div className="rounded-2xl glass p-3 flex items-center gap-3">
          <Avatar url={user?.avatarUrl} name={user?.name} size={38} ring />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold truncate">{user?.name}</div>
            <div className="text-[10px] text-slate-400 truncate">
              {isBn ? `লেভেল ${["০","১","২","৩","৪","৫"][lv.index]}` : `Lv.${lv.index}`} · {tn("levelNames", lv.index)}
            </div>
          </div>
          <button
            onClick={logout}
            title={t("logout")}
            className="grid place-items-center w-8 h-8 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-rose-400/10 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

/* ================= floating language toggle ================= */
export const FloatingLang: React.FC = () => {
  const { lang, setLang, toast, t } = useStore();
  const swap = () => {
    const next = lang === "en" ? "bn" : "en";
    setLang(next);
    toast(next === "bn" ? t("langSwitched") : "Language switched to English", "info");
  };
  return (
    <button
      onClick={swap}
      className="fixed bottom-5 left-4 sm:left-6 z-[110] group flex items-center gap-0 rounded-full border border-cyan-400/40 bg-[#050b1a]/90 backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,.35)] p-1.5 cursor-pointer hover:scale-105 active:scale-95 transition-all"
      title="Bangla ⇄ English"
    >
      <span className="px-2 text-cyan-300"><Languages size={16} /></span>
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
          lang === "en" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow" : "text-slate-400"
        }`}
      >
        EN
      </span>
      <span
        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
          lang === "bn" ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 shadow" : "text-slate-400"
        }`}
      >
        বাং
      </span>
    </button>
  );
};

/* ================= notification bell ================= */
const NotificationBell: React.FC = () => {
  const { notifications, markAllRead, nav, isBn } = useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = notifications.filter((n) => !n.read).length;

  React.useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => {
          setOpen(!open);
          if (unread) markAllRead();
        }}
        className="relative grid place-items-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:border-cyan-400/40 transition-colors cursor-pointer"
        title={L("Notifications", "নোটিফিকেশন")}
      >
        <Bell size={15} />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 grid place-items-center min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[9px] font-bold text-white">
            {unread}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 max-w-[85vw] rounded-2xl glass-strong overflow-hidden z-[90] shadow-2xl anim-fade-up">
          <div className="px-4 py-3 border-b border-white/10 font-bold text-sm flex items-center gap-2">
            <Bell size={14} className="text-cyan-300" /> {L("Notifications", "নোটিফিকেশন")}
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            {notifications.length === 0 && (
              <div className="px-3 py-6 text-center text-xs text-slate-500">{L("No notifications yet.", "এখনও কোনো নোটিফিকেশন নেই।")}</div>
            )}
            {notifications.map((n) => (
              <div key={n.id} className={`rounded-xl px-3 py-2.5 mb-1 text-xs ${n.read ? "opacity-70" : "bg-cyan-400/10 border border-cyan-400/20"}`}>
                <div className="text-slate-200">{n.msg}</div>
                <div className="mt-1 text-[9px] font-mono text-slate-500">
                  {new Date(n.ts).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { setOpen(false); nav({ view: "profile" }); }}
            className="w-full px-4 py-2.5 text-xs font-bold text-cyan-300 hover:bg-white/5 transition-colors border-t border-white/10 cursor-pointer"
          >
            {L("Open profile", "প্রোফাইল খোলো")}
          </button>
        </div>
      )}
    </div>
  );
};

/* ================= shell ================= */
export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t, isBn, user, nav, route } = useStore();
  const [drawer, setDrawer] = useState(false);

  return (
    <div className={`min-h-screen relative ${isBn ? "bn-mode" : ""} ${route.view === "nova" ? "nova-shell" : ""}`}>
      {/* ambient bg */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute -top-40 left-[15%] w-[560px] h-[560px] rounded-full bg-cyan-500/10 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[460px] h-[460px] rounded-full bg-emerald-500/8 blur-[160px]" />
      </div>

      {/* ===== sidebar (locked on desktop) ===== */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 w-[280px] z-40 border-r border-white/8 bg-[#040917]/95">
        <SideContent onNav={() => {}} />
      </aside>

      {/* ===== mobile drawer ===== */}
      <div
        className={`lg:hidden fixed inset-0 z-[80] transition-opacity duration-300 ${
          drawer ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setDrawer(false)} />
        <aside
          className={`absolute inset-y-0 left-0 w-[300px] max-w-[85vw] bg-[#040917] border-r border-cyan-400/20 shadow-[20px_0_80px_rgba(0,0,0,.6)] transform transition-transform duration-300 ease-out ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button
            onClick={() => setDrawer(false)}
            className="absolute top-4 right-4 grid place-items-center w-8 h-8 rounded-lg text-slate-400 hover:text-white bg-white/5 cursor-pointer z-10"
          >
            <X size={16} />
          </button>
          <SideContent onNav={() => setDrawer(false)} />
        </aside>
      </div>

      {/* ===== header ===== */}
      <header className="sticky top-0 z-30 lg:pl-[280px]">
        <div className="bg-[#050b1a]/85 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
            <button
              onClick={() => setDrawer(true)}
              className="lg:hidden grid place-items-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 text-slate-200 cursor-pointer shrink-0"
              aria-label="menu"
            >
              <Menu size={18} />
            </button>
            {/* mini logo on mobile */}
            <button onClick={() => nav({ view: "home" })} className="lg:hidden flex items-center shrink-0 cursor-pointer">
              <LogoMark size={34} />
            </button>
            <div className="flex-1 min-w-0">
              <SearchBox onPick={() => {}} />
            </div>
            <div className="hidden sm:block"><XpChip /></div>
            <NotificationBell />
            <button
              onClick={() => nav({ view: "profile" })}
              className="shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
              title={t("navProfile")}
            >
              <Avatar url={user?.avatarUrl} name={user?.name} size={36} ring />
            </button>
          </div>
        </div>
      </header>

      {/* ===== content ===== */}
      <main className="relative z-10 lg:pl-[280px]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8 pb-28">{children}</div>
      </main>
    </div>
  );
};
