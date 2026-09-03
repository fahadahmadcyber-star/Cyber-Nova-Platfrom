import React, { useEffect, useState } from "react";
import {
  ShieldHalf, LayoutDashboard, Users, BookOpen, Palette, BellRing, Eye, Inbox,
  Plus, Send, RotateCcw, CheckCircle2, Settings, ClipboardList, UserX, UserCheck, Trash2, RefreshCw,
  Bot,
} from "lucide-react";
import { useStore, AdminContent } from "../store";
import { CurriculumEditor } from "./admin/CurriculumEditor";
import { NovaInbox } from "./admin/NovaInbox";
import { SettingsPrivacy } from "./admin/SettingsPrivacy";
import { Logo } from "../components/Logo";
import { EmptyState } from "../components/ui";
import { fmtN } from "./Home";
import { deleteUser as deleteFirestoreUser, subscribeToUsers, updateUserStatus, type FirestoreUser } from "../lib/firebaseAdmin";

type Tab = "dashboard" | "users" | "curriculum" | "exams" | "inbox" | "assistant" | "design" | "broadcast" | "settings";

const Field: React.FC<{ label: string; value: string; onChange: (v: string) => void; multiline?: boolean; placeholder?: string }> = ({
  label, value, onChange, multiline, placeholder,
}) => (
  <label className="block">
    <span className="text-xs font-semibold text-slate-300 mb-1.5 block">{label}</span>
    {multiline ? (
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-2.5 text-sm transition-all resize-y" />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-2.5 text-sm transition-all" />
    )}
  </label>
);

export const Admin: React.FC = () => {
  const {
    t, admin, setAdmin, factoryReset, toast, isBn, user, nav,
    pushNotification, broadcastNotification, notifications, curriculum,
  } = useStore();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [notifyMsg, setNotifyMsg] = useState("");
  const [notifyMsgBn, setNotifyMsgBn] = useState("");
  const [realUsers, setRealUsers] = useState<FirestoreUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");

  const L = (en: string, bn: string) => (isBn ? bn : en);
  const set = (k: keyof AdminContent) => (v: string) => setAdmin({ [k]: v } as Partial<AdminContent>);

  useEffect(() => {
    if (user?.role !== "admin") return;
    setUsersLoading(true);
    setUsersError("");
    const unsubscribe = subscribeToUsers((nextUsers) => {
      setRealUsers(nextUsers);
      setUsersLoading(false);
    });
    return () => unsubscribe();
  }, [user?.role]);

  const changeUserStatus = async (target: FirestoreUser) => {
    try {
      await updateUserStatus(target.id, target.status === "disabled" ? "active" : "disabled");
      toast(target.status === "disabled" ? L("User enabled", "ইউজার চালু করা হয়েছে") : L("User disabled", "ইউজার নিষ্ক্রিয় করা হয়েছে"), "info");
    } catch {
      setUsersError(L("Could not update user status. Check Firestore rules.", "ইউজারের অবস্থা বদলানো যায়নি। Firestore rules পরীক্ষা করো।"));
    }
  };

  const removeUserProfile = async (target: FirestoreUser) => {
    if (!confirm(L(`Remove ${target.email} from the user directory?`, `${target.email}-কে ইউজার ডিরেক্টরি থেকে মুছে ফেলবে?`))) return;
    try {
      await deleteFirestoreUser(target.id);
      toast(L("User profile removed", "ইউজার প্রোফাইল মুছে ফেলা হয়েছে"), "warn");
    } catch {
      setUsersError(L("Could not remove user. Check Firestore rules.", "ইউজার মুছে ফেলা যায়নি। Firestore rules পরীক্ষা করো।"));
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="mx-auto max-w-md">
        <EmptyState
          title={t("ownerOnly")}
          body={L("You don't have permission to view this area.", "এই এলাকা দেখার অনুমতি তোমার নেই।")}
          action={
            <button onClick={() => nav({ view: "home" })} className="rounded-xl px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 cursor-pointer">
              {L("Back to dashboard", "ড্যাশবোর্ডে ফিরে যাও")}
            </button>
          }
        />
      </div>
    );
  }

  const totalLessons = curriculum.reduce((n, c) => n + c.chapters.length, 0);

  const sendNotify = () => {
    const msg = (isBn ? notifyMsgBn || notifyMsg : notifyMsg || notifyMsgBn).trim() || L("New update from Cyber Nova", "সাইবার নোভা থেকে নতুন আপডেট");
    broadcastNotification(msg);
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try { new Notification("Cyber Nova", { body: msg }); } catch { /* ignore */ }
    }
    setNotifyMsg("");
    setNotifyMsgBn("");
    toast(L("Notification broadcast sent", "নোটিফিকেশন পাঠানো হয়েছে"), "xp");
  };

  const tabs = [
    { id: "dashboard", label: L("Overview", "ওভারভিউ"), icon: LayoutDashboard, badge: 0 },
    { id: "users", label: L("Users", "ইউজার"), icon: Users, badge: 0 },
    { id: "curriculum", label: L("Curriculum", "কারিকুলাম"), icon: BookOpen, badge: 0 },
    { id: "exams", label: L("Exam Editor", "এক্সাম এডিটর"), icon: ClipboardList, badge: 0 },
    { id: "inbox", label: L("Messages Inbox", "নোভা ইনবক্স"), icon: Inbox, badge: 0 },
    { id: "assistant", label: L("Nova AI", "নোভা AI"), icon: Bot, badge: 0 },
    { id: "design", label: L("Design", "ডিজাইন"), icon: Palette, badge: 0 },
    { id: "broadcast", label: L("Broadcast", "ব্রডকাস্ট"), icon: BellRing, badge: 0 },
    { id: "settings", label: L("Settings & Privacy", "সেটিংস ও প্রাইভেসি"), icon: Settings, badge: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* header */}
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Logo size={40} compact />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black flex items-center gap-2">
              <ShieldHalf className="text-amber-300" size={24} /> {L("Admin Control Center", "অ্যাডমিন কন্ট্রোল সেন্টার")}
            </h1>
            <p className="text-xs text-slate-400">
              {L("Full access & management of the entire Cyber Nova platform.", "সম্পূর্ণ সাইবার নোভা প্ল্যাটফর্মের পূর্ণ অ্যাক্সেস ও ব্যবস্থাপনা।")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> {L("LIVE", "লাইভ")}
          </span>
          <button
            onClick={() => nav({ view: "home" })}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold hover:border-cyan-400/50 hover:text-cyan-200 transition-all cursor-pointer"
          >
            <Eye size={13} /> {L("View as Student", "শিক্ষার্থী হিসেবে দেখো")}
          </button>
        </div>
      </header>

      {/* tabs */}
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((tb) => (
          <button
            key={tb.id}
            onClick={() => setTab(tb.id as Tab)}
            className={`relative inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all cursor-pointer ${
              tab === tb.id ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950" : "bg-white/5 border border-white/10 hover:border-cyan-400/40 text-slate-300"
            }`}
          >
            <tb.icon size={14} /> {tb.label}
          </button>
        ))}
      </div>

      {/* ============ OVERVIEW ============ */}
      {tab === "dashboard" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: L("Registered Users", "রেজিস্টার্ড ইউজার"), val: realUsers.length, color: "text-emerald-300" },
              { label: L("Courses", "কোর্স"), val: curriculum.length, color: "text-cyan-300" },
              { label: L("Total Lessons", "মোট পাঠ"), val: totalLessons, color: "text-fuchsia-300" },
              { label: L("Notifications", "নোটিফিকেশন"), val: notifications.length, color: "text-amber-300" },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4">
                <div className={`text-2xl font-black tabular-nums ${s.color}`}>{fmtN(s.val, isBn)}</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold mb-3">{L("Registered users (live)", "রেজিস্টার্ড ইউজার (লাইভ)")}</h3>
              <label className="block max-w-xs">
                <span className="text-xs text-slate-400 mb-1.5 block">{t("adminRegistrations")}</span>
                <input
                  type="number" min={0} value={admin.registrations}
                  onChange={(e) => setAdmin({ registrations: Math.max(0, parseInt(e.target.value || "0", 10)) })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 outline-none px-4 py-2.5 text-sm tabular-nums"
                />
              </label>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold mb-3">{L("Quick actions", "দ্রুত কাজ")}</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <button onClick={() => setTab("curriculum")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:border-cyan-400/40 cursor-pointer">
                  {L("Edit curriculum", "কারিকুলাম এডিট")}
                </button>
                <button onClick={() => setTab("design")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:border-cyan-400/40 cursor-pointer">
                  {L("Edit design", "ডিজাইন এডিট")}
                </button>
                <button onClick={() => setTab("broadcast")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:border-cyan-400/40 cursor-pointer">
                  {L("Send notice", "নোটিশ পাঠাও")}
                </button>
                <button onClick={() => setTab("inbox")} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold hover:border-cyan-400/40 cursor-pointer">
                  {L("Manage users", "ইউজার ব্যবস্থাপনা")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ USERS ============ */}
      {tab === "users" && (
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2"><Users size={15} className="text-cyan-300" /> {L("User Management", "ইউজার ম্যানেজমেন্ট")}</h3>
            <button onClick={() => setUsersError("")} className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold bg-cyan-400/10 border border-cyan-400/30 text-cyan-200 cursor-pointer">
              <RefreshCw size={13} /> {L("Live sync", "লাইভ সিঙ্ক")}
            </button>
          </div>
          <div className="mb-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] px-4 py-3 text-xs text-slate-400">
            {L("These records come from Firebase Firestore users, not demo rows. Account deletion from Firebase Authentication requires a trusted server/Admin SDK; this panel controls the app profile and disabled status.", "এই রেকর্ডগুলো Firebase Firestore users collection থেকে আসছে, কোনো demo row নয়। Firebase Authentication account মুছতে trusted server/Admin SDK দরকার; এই panel profile এবং disabled status নিয়ন্ত্রণ করে।")}
          </div>
          {usersError && <div className="mb-4 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-xs text-rose-200">{usersError}</div>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-widest text-slate-500 border-b border-white/10">
                  <th className="py-2 pr-3">#</th>
                  <th className="py-2 pr-3">{L("Name", "নাম")}</th>
                  <th className="py-2 pr-3">{L("Email", "ইমেইল")}</th>
                  <th className="py-2 pr-3">{L("Role", "ভূমিকা")}</th>
                  <th className="py-2 pr-3">{L("Status", "অবস্থা")}</th>
                  <th className="py-2 pr-3">{L("Actions", "অ্যাকশন")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {usersLoading && <tr><td colSpan={6} className="py-8 text-center text-xs text-slate-500">{L("Loading real users…", "রিয়েল ইউজার লোড হচ্ছে…")}</td></tr>}
                {!usersLoading && realUsers.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-xs text-slate-500">{L("No Firestore user profiles yet.", "এখনো কোনো Firestore ইউজার প্রোফাইল নেই।")}</td></tr>}
                {!usersLoading && realUsers.map((target, i) => (
                  <tr key={target.id} className="border-t border-white/5">
                    <td className="py-3 text-slate-400">{fmtN(i + 1, isBn)}</td>
                    <td className="py-3 font-bold text-slate-200">{target.displayName || L("Unnamed user", "নামহীন ইউজার")}</td>
                    <td className="py-3 text-slate-400">{target.email}</td>
                    <td className="py-3"><span className={`rounded-full border text-[10px] font-bold px-2 py-0.5 ${target.role === "admin" ? "bg-amber-400/15 border-amber-400/40 text-amber-300" : "bg-white/5 border-white/10 text-slate-400"}`}>{target.role === "admin" ? L("ADMIN", "অ্যাডমিন") : L("Student", "শিক্ষার্থী")}</span></td>
                    <td className={`py-3 text-xs ${target.status === "disabled" ? "text-rose-300" : "text-emerald-300"}`}>● {target.status === "disabled" ? L("Disabled", "নিষ্ক্রিয়") : L("Active", "সক্রিয়")}</td>
                    <td className="py-3"><div className="flex items-center gap-1.5">
                      <button onClick={() => void changeUserStatus(target)} title={target.status === "disabled" ? L("Enable", "চালু") : L("Disable", "নিষ্ক্রিয়")} className="grid place-items-center w-8 h-8 rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-200 cursor-pointer">{target.status === "disabled" ? <UserCheck size={14} /> : <UserX size={14} />}</button>
                      <button onClick={() => void removeUserProfile(target)} title={L("Remove profile", "প্রোফাইল মুছুন")} className="grid place-items-center w-8 h-8 rounded-lg border border-rose-400/20 bg-rose-400/5 text-rose-300 hover:bg-rose-400/15 cursor-pointer"><Trash2 size={14} /></button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ============ CURRICULUM ============ */}
      {tab === "curriculum" && <CurriculumEditor />}

      {tab === "exams" && <CurriculumEditor />}

      {/* ============ INBOX ============ */}
      {tab === "inbox" && <NovaInbox />}

      {tab === "assistant" && (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="glass rounded-3xl p-6 space-y-5">
            <div>
              <h3 className="font-bold flex items-center gap-2"><Bot size={16} className="text-cyan-300" /> {L("Nova AI Control", "Nova AI নিয়ন্ত্রণ")}</h3>
              <p className="mt-1 text-xs text-slate-500">{L("Control what students can see and how Nova responds.", "শিক্ষার্থীরা কী দেখবে এবং Nova কীভাবে উত্তর দেবে তা নিয়ন্ত্রণ করো।")}</p>
            </div>
            <button onClick={() => setAdmin({ novaEnabled: !admin.novaEnabled })} className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm font-bold cursor-pointer ${admin.novaEnabled ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-rose-400/30 bg-rose-400/10 text-rose-200"}`}>
              {admin.novaEnabled ? L("Nova is live", "Nova চালু আছে") : L("Nova is offline", "Nova বন্ধ আছে")}
              <span className={`relative h-6 w-11 rounded-full ${admin.novaEnabled ? "bg-emerald-400/40" : "bg-white/10"}`}><span className={`absolute top-1 h-4 w-4 rounded-full transition-all ${admin.novaEnabled ? "left-6 bg-emerald-300" : "left-1 bg-slate-500"}`} /></span>
            </button>
            <Field label={L("Nova guidance (optional)", "Nova guidance (ঐচ্ছিক)")} value={admin.novaGuidance} onChange={set("novaGuidance")} multiline placeholder={L("Example: Keep answers beginner-friendly and mention Academy lessons when relevant.", "উদাহরণ: উত্তর সহজ রাখো এবং প্রাসঙ্গিক হলে Academy lesson-এর কথা বলো।")} />
            <label className="block"><span className="mb-1.5 block text-xs font-semibold text-slate-300">{L("Response length", "উত্তরের দৈর্ঘ্য")}</span><select value={admin.novaResponseLength} onChange={(e) => setAdmin({ novaResponseLength: e.target.value as AdminContent["novaResponseLength"] })} className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-2.5 text-sm text-slate-200 outline-none"><option value="concise">{L("Concise", "সংক্ষিপ্ত")}</option><option value="balanced">{L("Balanced", "ভারসাম্যপূর্ণ")}</option><option value="detailed">{L("Detailed", "বিস্তারিত")}</option></select></label>
          </div>
          <div className="space-y-6">
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold mb-4">{L("Student tools", "শিক্ষার্থীদের টুল")}</h3>
              <div className="space-y-2">{[
                ["learn", "Learn a Topic", "একটি বিষয় শিখুন"], ["explain", "Explain Something", "কিছু বুঝিয়ে দিন"], ["practice", "Practice", "অনুশীলন"], ["test", "Test My Knowledge", "আমার জ্ঞান যাচাই"], ["roadmap", "Build My Roadmap", "রোডম্যাপ বানাও"], ["revise", "Revise", "রিভিশন"], ["file", "Learn From My File", "ফাইল থেকে শেখা"],
              ].map(([id, en, bn]) => <button key={id} onClick={() => setAdmin({ novaTools: { ...admin.novaTools, [id]: !admin.novaTools[id] } })} className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-xs font-bold cursor-pointer ${admin.novaTools[id] !== false ? "border-cyan-400/20 bg-cyan-400/[0.05] text-slate-200" : "border-white/10 bg-white/[0.02] text-slate-500"}`}><span>{isBn ? bn : en}</span><span className={`h-2 w-2 rounded-full ${admin.novaTools[id] !== false ? "bg-emerald-300" : "bg-slate-600"}`} /></button>)}
              </div>
            </div>
            <div className="glass rounded-3xl p-6">
              <h3 className="font-bold mb-4">{L("Teaching modes", "শেখানোর মোড")}</h3>
              <div className="grid grid-cols-2 gap-2">{[["simple", "Simple", "সহজ"], ["standard", "Standard", "সাধারণ"], ["deep", "Deep", "গভীর"], ["exam", "Exam", "পরীক্ষা"], ["practice", "Practice", "অনুশীলন"]].map(([id, en, bn]) => <button key={id} onClick={() => setAdmin({ novaModes: { ...admin.novaModes, [id]: !admin.novaModes[id] } })} className={`rounded-xl border px-3 py-2.5 text-xs font-bold cursor-pointer ${admin.novaModes[id] !== false ? "border-violet-400/30 bg-violet-400/10 text-violet-200" : "border-white/10 bg-white/[0.02] text-slate-500"}`}>{isBn ? bn : en}</button>)}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============ SETTINGS & PRIVACY ============ */}
      {tab === "settings" && <SettingsPrivacy />}

      {/* ============ DESIGN ============ */}
      {tab === "design" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 mb-1"><Palette size={15} className="text-fuchsia-300" /> {L("Brand & Platform Design", "ব্র্যান্ড ও প্ল্যাটফর্ম ডিজাইন")}</h3>
            <Field label={L("Site name (English)", "সাইটের নাম (ইংরেজি)")} value={admin.siteNameEn} onChange={set("siteNameEn")} />
            <Field label={L("Site name (Bangla)", "সাইটের নাম (বাংলা)")} value={admin.siteNameBn} onChange={set("siteNameBn")} />
            <Field label={L("Tagline (English)", "ট্যাগলাইন (ইংরেজি)")} value={admin.siteTaglineEn} onChange={set("siteTaglineEn")} />
            <Field label={L("Tagline (Bangla)", "ট্যাগলাইন (বাংলা)")} value={admin.siteTaglineBn} onChange={set("siteTaglineBn")} />
            <Field label={L("Custom logo URL", "কাস্টম লোগো URL")} value={admin.logoUrl} onChange={set("logoUrl")} placeholder="https://..." />
            <Field label={t("adminHeroTitleEn")} value={admin.heroTitleEn} onChange={set("heroTitleEn")} />
            <Field label={t("adminHeroTitleBn")} value={admin.heroTitleBn} onChange={set("heroTitleBn")} />
            <Field label={t("adminHeroSubEn")} value={admin.heroSubEn} onChange={set("heroSubEn")} multiline />
            <Field label={t("adminHeroSubBn")} value={admin.heroSubBn} onChange={set("heroSubBn")} multiline />
            <Field label={t("adminBannerTitleEn")} value={admin.bannerTitleEn} onChange={set("bannerTitleEn")} />
            <Field label={t("adminBannerTitleBn")} value={admin.bannerTitleBn} onChange={set("bannerTitleBn")} />
            <Field label={t("adminBannerBodyEn")} value={admin.bannerBodyEn} onChange={set("bannerBodyEn")} multiline />
            <Field label={t("adminBannerBodyBn")} value={admin.bannerBodyBn} onChange={set("bannerBodyBn")} multiline />
            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 mb-1.5 block">{L("Missions", "মিশন")}</span>
                <input type="number" min={0} value={admin.missionCount} onChange={(e) => setAdmin({ missionCount: Math.max(0, Number(e.target.value || 0)) })} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 mb-1.5 block">{L("Tracks", "ট্র্যাক")}</span>
                <input type="number" min={0} value={admin.trackCount} onChange={(e) => setAdmin({ trackCount: Math.max(0, Number(e.target.value || 0)) })} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm" />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 mb-1.5 block">{L("Badges", "ব্যাজ")}</span>
                <input type="number" min={0} value={admin.badgeCount} onChange={(e) => setAdmin({ badgeCount: Math.max(0, Number(e.target.value || 0)) })} className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-sm" />
              </label>
            </div>
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-3">{L("Live Preview", "লাইভ প্রিভিউ")}</h3>
            <div className="rounded-2xl border border-cyan-400/25 bg-slate-950/60 p-5 scanlines">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400/70">{L("LIVE HERO", "লাইভ হিরো")}</p>
              <h3 className="mt-2 text-xl sm:text-2xl font-black leading-snug"><span className="neon-text">{isBn ? admin.heroTitleBn : admin.heroTitleEn}</span></h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-400 line-clamp-3">{isBn ? admin.heroSubBn : admin.heroSubEn}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500 mb-2">{L("Brand", "ব্র্যান্ড")}</p>
              {admin.logoUrl ? <img src={admin.logoUrl} alt="platform logo" className="h-16 w-16 rounded-full border border-white/10 object-cover bg-slate-950" /> : <Logo size={48} />}
              <div className="mt-3 text-xs text-slate-300">{isBn ? admin.siteNameBn : admin.siteNameEn}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============ BROADCAST ============ */}
      {tab === "broadcast" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="font-bold flex items-center gap-2 mb-1"><BellRing size={15} className="text-amber-300" /> {L("Send a Notification", "নোটিফিকেশন পাঠাও")}</h3>
            <Field label={L("Notification (English)", "নোটিফিকেশন (ইংরেজি)")} value={notifyMsg} onChange={setNotifyMsg} multiline />
            <Field label={L("Notification (Bangla)", "নোটিফিকেশন (বাংলা)")} value={notifyMsgBn} onChange={setNotifyMsgBn} multiline />
            <button
              onClick={sendNotify}
              className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.5)] active:scale-[0.97] transition-all cursor-pointer"
            >
              <Send size={14} /> {L("Broadcast to all users", "সব ইউজারকে পাঠাও")}
            </button>
            {typeof Notification !== "undefined" && Notification.permission === "default" && (
              <button onClick={() => Notification.requestPermission()} className="block text-xs text-slate-400 hover:text-cyan-300 cursor-pointer underline">
                {L("Enable browser notifications", "ব্রাউজার নোটিফিকেশন চালু করো")}
              </button>
            )}
          </div>
          <div className="glass rounded-3xl p-6">
            <h3 className="font-bold mb-3 flex items-center gap-2"><BellRing size={15} /> {L("Broadcast Marquee", "ব্রডকাস্ট মার্কি")}</h3>
            <div className="space-y-3">
              <Field label={t("adminBroadcastEn")} value={admin.announceEn} onChange={set("announceEn")} />
              <Field label={t("adminBroadcastBn")} value={admin.announceBn} onChange={set("announceBn")} />
            </div>
            <button onClick={() => setAdmin({ showAnnounce: !admin.showAnnounce })}
              className={`mt-4 flex items-center justify-between w-full rounded-xl border px-4 py-3 text-sm font-bold transition-all cursor-pointer ${admin.showAnnounce ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/[0.03] text-slate-400"}`}>
              {t("adminBroadcastToggle")}
              <span className={`relative w-11 h-6 rounded-full transition-colors ${admin.showAnnounce ? "bg-emerald-400/40" : "bg-white/10"}`}>
                <span className={`absolute top-1 w-4 h-4 rounded-full transition-all ${admin.showAnnounce ? "left-6 bg-emerald-300" : "left-1 bg-slate-500"}`} />
              </span>
            </button>
            <div className="mt-5">
              <h4 className="text-xs font-bold text-slate-400 mb-2">
                {L("Recent notifications", "সাম্প্রতিক নোটিফিকেশন")} ({fmtN(notifications.length, isBn)})
              </h4>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {notifications.length === 0 && <p className="text-xs text-slate-500">—</p>}
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.02] px-3 py-2 text-xs">
                    <CheckCircle2 size={12} className="text-emerald-300 shrink-0" />
                    <span className="truncate text-slate-300">{n.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* danger zone (hidden on Settings tab — it has its own) */}
      {tab !== "settings" && (
        <div className="rounded-3xl border border-rose-400/25 bg-rose-400/5 p-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-rose-300 flex items-center gap-2"><RotateCcw size={15} /> {L("Factory Reset", "ফ্যাক্টরি রিসেট")}</h3>
            <p className="text-xs text-slate-500 mt-1">{L("Wipe the entire platform state and start over.", "পুরো প্ল্যাটফর্ম স্টেট মুছে আবার শুরু করো।")}</p>
          </div>
          <button onClick={() => { factoryReset(); toast(t("adminResetDone"), "warn"); }} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border border-rose-400/40 text-rose-300 hover:bg-rose-400/10 active:scale-[0.97] transition-all cursor-pointer">
            <RotateCcw size={13} /> {t("adminResetAll")}
          </button>
        </div>
      )}
    </div>
  );
};
