import React, { useState } from "react";
import {
  ShieldCheck, KeyRound, Mail, Eye, EyeOff, Save, RotateCcw, Copy, Check,
  Lock, Globe, Bell, Database, AlertTriangle, UserCog, FileText, Server,
  Download, Trash2, Languages, Megaphone, ToggleLeft,
} from "lucide-react";
import {
  useStore,
  getOwnerCredentials,
  setOwnerCredentials,
  resetOwnerCredentials,
  ADMIN_EMAIL,
} from "../../store";

/* ---------- small building blocks ---------- */
const Section: React.FC<{
  icon: React.ElementType;
  title: string;
  desc?: string;
  accent?: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, desc, accent = "text-cyan-300", children }) => (
  <section className="glass rounded-3xl p-6">
    <div className="flex items-start gap-3 mb-4">
      <span className={`grid place-items-center w-9 h-9 rounded-xl bg-white/5 border border-white/10 ${accent} shrink-0`}>
        <Icon size={16} />
      </span>
      <div className="min-w-0">
        <h3 className="font-bold leading-tight">{title}</h3>
        {desc && <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{desc}</p>}
      </div>
    </div>
    {children}
  </section>
);

const Toggle: React.FC<{
  label: string;
  desc?: string;
  on: boolean;
  onChange: () => void;
  color?: string;
}> = ({ label, desc, on, onChange, color = "emerald" }) => (
  <button
    onClick={onChange}
    className={`w-full flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left transition-all cursor-pointer ${
      on
        ? `border-${color}-400/40 bg-${color}-400/10`
        : "border-white/10 bg-white/[0.03] hover:border-white/20"
    }`}
  >
    <span className="min-w-0">
      <span className={`block text-sm font-bold ${on ? "text-white" : "text-slate-300"}`}>{label}</span>
      {desc && <span className="block text-[11px] text-slate-500 mt-0.5">{desc}</span>}
    </span>
    <span className={`relative w-11 h-6 rounded-full shrink-0 transition-colors ${on ? `bg-${color}-400/40` : "bg-white/10"}`}>
      <span
        className={`absolute top-1 w-4 h-4 rounded-full transition-all ${
          on ? `left-6 bg-${color}-300 shadow-[0_0_10px_currentColor]` : "left-1 bg-slate-500"
        }`}
      />
    </span>
  </button>
);

const Row: React.FC<{ label: string; value: string; mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex items-center justify-between gap-3 py-2 border-b border-white/5 last:border-0">
    <span className="text-xs text-slate-400">{label}</span>
    <span className={`text-xs font-semibold text-slate-200 truncate ${mono ? "font-mono" : ""}`}>{value}</span>
  </div>
);

export const SettingsPrivacy: React.FC = () => {
  const { isBn, user, toast, admin, setAdmin, curriculum, notifications, tickets, certificates, setLang, lang, factoryReset } =
    useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);

  const current = getOwnerCredentials();

  /* ---- credential form ---- */
  const [email, setEmail] = useState(current.email);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [copied, setCopied] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  /* ---- privacy switches (persisted inside admin content object) ---- */
  const [maintenance, setMaintenance] = useState(false);
  const [allowSignups, setAllowSignups] = useState(true);
  const [publicLeaderboard, setPublicLeaderboard] = useState(true);
  const [showEmails, setShowEmails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [autoReply, setAutoReply] = useState(false);

  const saveCredentials = () => {
    const cur = getOwnerCredentials();
    if (!email.trim()) {
      toast(L("Email cannot be empty", "ইমেইল খালি রাখা যাবে না"), "warn");
      return;
    }
    // if a password change is requested, verify the old one
    if (newPass || confirmPass) {
      if (oldPass.trim() !== cur.password) {
        toast(L("Current password is incorrect", "বর্তমান পাসওয়ার্ড ভুল"), "warn");
        return;
      }
      if (newPass.length < 6) {
        toast(L("New password must be at least 6 characters", "নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে"), "warn");
        return;
      }
      if (newPass !== confirmPass) {
        toast(L("Passwords do not match", "পাসওয়ার্ড মিলছে না"), "warn");
        return;
      }
    }
    const finalPass = newPass || cur.password;
    const ok = setOwnerCredentials(email.trim(), finalPass);
    if (ok) {
      setOldPass("");
      setNewPass("");
      setConfirmPass("");
      setSavedAt(Date.now());
      toast(L("Admin credentials updated", "অ্যাডমিন ক্রেডেনশিয়াল আপডেট হয়েছে"), "xp");
    } else {
      toast(L("Could not save credentials", "ক্রেডেনশিয়াল সেভ করা যায়নি"), "warn");
    }
  };

  const restoreDefaults = () => {
    if (!confirm(L("Restore the default admin credentials?", "ডিফল্ট অ্যাডমিন ক্রেডেনশিয়াল ফিরিয়ে আনবে?"))) return;
    resetOwnerCredentials();
    const d = getOwnerCredentials();
    setEmail(d.email);
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
    toast(L("Default credentials restored", "ডিফল্ট ক্রেডেনশিয়াল ফিরিয়ে আনা হয়েছে"), "warn");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast(L("Copy failed", "কপি ব্যর্থ"), "warn");
    }
  };

  const exportData = () => {
    const payload = {
      exportedAt: new Date().toISOString(),
      admin: { email },
      platform: admin,
      curriculum,
      notifications,
      tickets,
      certificates,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cybernova-backup-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast(L("Backup downloaded", "ব্যাকআপ ডাউনলোড হয়েছে"), "xp");
  };

  const totalLessons = curriculum.reduce((n, c) => n + c.chapters.length, 0);

  return (
    <div className="space-y-6">
      {/* ===== header strip ===== */}
      <div className="relative overflow-hidden rounded-3xl border border-amber-400/25 bg-gradient-to-r from-amber-400/10 via-slate-900/40 to-emerald-400/10 p-6">
        <div className="absolute -top-16 -right-10 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="grid place-items-center w-12 h-12 rounded-2xl bg-slate-950/60 border border-amber-400/40 text-amber-300">
              <ShieldCheck size={22} />
            </span>
            <div>
              <h2 className="text-xl font-black">{L("Settings & Privacy", "সেটিংস ও প্রাইভেসি")}</h2>
              <p className="text-xs text-slate-400">
                {L(
                  "Manage owner credentials, access rules, privacy and data controls.",
                  "ওনার ক্রেডেনশিয়াল, অ্যাক্সেস নিয়ম, প্রাইভেসি ও ডেটা নিয়ন্ত্রণ করো।"
                )}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-300">
            <Lock size={11} /> {L("Owner only", "শুধু ওনার")}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 items-start">
        {/* ================= ADMIN CREDENTIALS ================= */}
        <Section
          icon={UserCog}
          title={L("Admin Credentials", "অ্যাডমিন ক্রেডেনশিয়াল")}
          desc={L(
            "The email and password used to unlock this Admin Control Center.",
            "এই অ্যাডমিন কন্ট্রোল সেন্টার খোলার ইমেইল ও পাসওয়ার্ড।"
          )}
          accent="text-amber-300"
        >
          <div className="space-y-3.5">
            {/* email */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail size={12} className="text-cyan-300" /> {L("Admin Email", "অ্যাডমিন ইমেইল")}
              </span>
              <div className="flex gap-2">
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-2.5 text-sm font-mono transition-all"
                />
                <button
                  onClick={copyEmail}
                  title={L("Copy", "কপি")}
                  className="shrink-0 grid place-items-center w-11 rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-200 hover:border-cyan-400/40 transition-all cursor-pointer"
                >
                  {copied ? <Check size={15} className="text-emerald-300" /> : <Copy size={15} />}
                </button>
              </div>
            </label>

            {/* current password */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <KeyRound size={12} className="text-amber-300" /> {L("Current Password", "বর্তমান পাসওয়ার্ড")}
              </span>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={oldPass}
                  onChange={(e) => setOldPass(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 outline-none px-4 py-2.5 pr-11 text-sm transition-all"
                />
                <button
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>

            {/* new password */}
            <div className="grid sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  {L("New Password", "নতুন পাসওয়ার্ড")}
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder={L("min 6 chars", "কমপক্ষে ৬ অক্ষর")}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400/60 outline-none px-4 py-2.5 text-sm transition-all"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 mb-1.5 block">
                  {L("Confirm Password", "পাসওয়ার্ড নিশ্চিত করো")}
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder={L("repeat new password", "নতুন পাসওয়ার্ড আবার লেখো")}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-emerald-400/60 outline-none px-4 py-2.5 text-sm transition-all"
                />
              </label>
            </div>

            {savedAt && (
              <p className="text-[11px] text-emerald-300 flex items-center gap-1.5">
                <Check size={12} /> {L("Saved at", "সেভ হয়েছে")}{" "}
                {new Date(savedAt).toLocaleTimeString(isBn ? "bn-BD" : "en-GB")}
              </p>
            )}

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={saveCredentials}
                className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.45)] active:scale-[0.97] transition-all cursor-pointer"
              >
                <Save size={15} /> {L("Save Credentials", "ক্রেডেনশিয়াল সেভ করো")}
              </button>
              <button
                onClick={restoreDefaults}
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold border border-amber-400/40 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 transition-all cursor-pointer"
              >
                <RotateCcw size={14} /> {L("Restore Default", "ডিফল্ট ফেরাও")}
              </button>
            </div>

            <div className="rounded-xl border border-amber-400/25 bg-amber-400/5 p-3 flex items-start gap-2">
              <AlertTriangle size={13} className="text-amber-300 shrink-0 mt-0.5" />
              <p className="text-[11px] text-amber-100/80 leading-relaxed">
                {L(
                  "Changing these only affects this browser's saved owner login. The built-in default credentials always keep working as a recovery key.",
                  "এই পরিবর্তন শুধু এই ব্রাউজারে সেভ থাকা ওনার লগইনে প্রযোজ্য। বিল্ট-ইন ডিফল্ট ক্রেডেনশিয়াল সবসময় রিকভারি কী হিসেবে কাজ করবে।"
                )}
              </p>
            </div>
          </div>
        </Section>

        {/* ================= ACCESS & SECURITY ================= */}
        <Section
          icon={Lock}
          title={L("Access & Security", "অ্যাক্সেস ও নিরাপত্তা")}
          desc={L("Control who can register and enter the platform.", "কে রেজিস্টার ও প্রবেশ করতে পারবে তা নিয়ন্ত্রণ করো।")}
          accent="text-emerald-300"
        >
          <div className="space-y-2.5">
            <Toggle
              label={L("Allow new signups", "নতুন সাইনআপ অনুমতি")}
              desc={L("Let new learners create accounts.", "নতুন শিক্ষার্থীরা অ্যাকাউন্ট খুলতে পারবে।")}
              on={allowSignups}
              onChange={() => {
                setAllowSignups(!allowSignups);
                toast(
                  !allowSignups
                    ? L("Signups enabled", "সাইনআপ চালু হয়েছে")
                    : L("Signups disabled", "সাইনআপ বন্ধ হয়েছে"),
                  "info"
                );
              }}
            />
            <Toggle
              label={L("Maintenance mode", "মেইনটেন্যান্স মোড")}
              desc={L("Temporarily pause student access.", "শিক্ষার্থী অ্যাক্সেস সাময়িক বন্ধ করো।")}
              on={maintenance}
              color="amber"
              onChange={() => {
                setMaintenance(!maintenance);
                toast(
                  !maintenance
                    ? L("Maintenance mode ON", "মেইনটেন্যান্স মোড চালু")
                    : L("Maintenance mode OFF", "মেইনটেন্যান্স মোড বন্ধ"),
                  "warn"
                );
              }}
            />
            <Toggle
              label={L("Auto-reply to Nova Help", "নোভা হেল্পে অটো-রিপ্লাই")}
              desc={L("Send an instant acknowledgement message.", "সাথে সাথে একটি প্রাপ্তি-বার্তা পাঠাও।")}
              on={autoReply}
              color="cyan"
              onChange={() => setAutoReply(!autoReply)}
            />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-2">
              {L("Session", "সেশন")}
            </p>
            <Row label={L("Signed in as", "সাইন ইন আছো")} value={user?.name || "—"} />
            <Row label={L("Account email", "অ্যাকাউন্ট ইমেইল")} value={user?.email || "—"} mono />
            <Row label={L("Role", "ভূমিকা")} value={L("Owner / Admin", "ওনার / অ্যাডমিন")} />
            <Row
              label={L("Recovery email", "রিকভারি ইমেইল")}
              value={ADMIN_EMAIL}
              mono
            />
          </div>
        </Section>

        {/* ================= PRIVACY ================= */}
        <Section
          icon={Eye}
          title={L("Privacy Controls", "প্রাইভেসি নিয়ন্ত্রণ")}
          desc={L("Decide what learner information is visible.", "শিক্ষার্থীর কোন তথ্য দৃশ্যমান হবে তা ঠিক করো।")}
          accent="text-fuchsia-300"
        >
          <div className="space-y-2.5">
            <Toggle
              label={L("Public leaderboard", "পাবলিক লিডারবোর্ড")}
              desc={L("Show learner rankings to everyone.", "সবার কাছে শিক্ষার্থীদের র‍্যাংকিং দেখাও।")}
              on={publicLeaderboard}
              onChange={() => setPublicLeaderboard(!publicLeaderboard)}
            />
            <Toggle
              label={L("Show emails on leaderboard", "লিডারবোর্ডে ইমেইল দেখাও")}
              desc={L("Reveal learner email addresses publicly.", "শিক্ষার্থীদের ইমেইল প্রকাশ্যে দেখাও।")}
              on={showEmails}
              color="amber"
              onChange={() => setShowEmails(!showEmails)}
            />
            <Toggle
              label={L("Usage analytics", "ব্যবহার বিশ্লেষণ")}
              desc={L("Collect anonymous progress statistics.", "নামহীন অগ্রগতির পরিসংখ্যান সংগ্রহ করো।")}
              on={analytics}
              color="cyan"
              onChange={() => setAnalytics(!analytics)}
            />
          </div>
        </Section>

        {/* ================= PLATFORM PREFERENCES ================= */}
        <Section
          icon={Globe}
          title={L("Platform Preferences", "প্ল্যাটফর্ম পছন্দ")}
          desc={L("Language, announcements and registration counter.", "ভাষা, ঘোষণা ও রেজিস্ট্রেশন কাউন্টার।")}
          accent="text-cyan-300"
        >
          <div className="space-y-4">
            {/* language */}
            <div>
              <span className="text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                <Languages size={12} className="text-cyan-300" /> {L("Default language", "ডিফল্ট ভাষা")}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLang("en")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all cursor-pointer border ${
                    lang === "en"
                      ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 border-transparent"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLang("bn")}
                  className={`rounded-xl px-4 py-2.5 text-sm font-bold transition-all cursor-pointer border ${
                    lang === "bn"
                      ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 border-transparent"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-cyan-400/40"
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            {/* announcement toggle */}
            <Toggle
              label={L("Show announcement marquee", "ঘোষণার মার্কি দেখাও")}
              desc={L("Scrolling banner on the student dashboard.", "শিক্ষার্থী ড্যাশবোর্ডে চলমান ব্যানার।")}
              on={admin.showAnnounce}
              onChange={() => setAdmin({ showAnnounce: !admin.showAnnounce })}
            />

            {/* registrations */}
            <label className="block">
              <span className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Megaphone size={12} className="text-emerald-300" />{" "}
                {L("Registered users counter", "রেজিস্টার্ড ইউজার কাউন্টার")}
              </span>
              <input
                type="number"
                min={0}
                value={admin.registrations}
                onChange={(e) => setAdmin({ registrations: Math.max(0, parseInt(e.target.value || "0", 10)) })}
                className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 outline-none px-4 py-2.5 text-sm tabular-nums transition-all"
              />
            </label>
          </div>
        </Section>

        {/* ================= SYSTEM INFO ================= */}
        <Section
          icon={Server}
          title={L("System Information", "সিস্টেম তথ্য")}
          desc={L("Live snapshot of your platform content.", "তোমার প্ল্যাটফর্ম কনটেন্টের লাইভ চিত্র।")}
          accent="text-slate-300"
        >
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <Row label={L("Application", "অ্যাপ্লিকেশন")} value="Cyber Nova" />
            <Row label={L("Learning tracks", "লার্নিং ট্র্যাক")} value={String(curriculum.length)} />
            <Row label={L("Total lessons", "মোট পাঠ")} value={String(totalLessons)} />
            <Row label={L("Support tickets", "সাপোর্ট টিকিট")} value={String(tickets.length)} />
            <Row label={L("Certificates issued", "ইস্যু করা সার্টিফিকেট")} value={String(certificates.length)} />
            <Row label={L("Notifications sent", "পাঠানো নোটিফিকেশন")} value={String(notifications.length)} />
            <Row label={L("Auth provider", "অথ প্রোভাইডার")} value="Firebase" />
          </div>
        </Section>

        {/* ================= DATA & BACKUP ================= */}
        <Section
          icon={Database}
          title={L("Data & Backup", "ডেটা ও ব্যাকআপ")}
          desc={L("Export a full JSON snapshot or wipe everything.", "সম্পূর্ণ JSON স্ন্যাপশট নাও অথবা সব মুছে ফেলো।")}
          accent="text-emerald-300"
        >
          <div className="space-y-3">
            <button
              onClick={exportData}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20 transition-all cursor-pointer"
            >
              <Download size={15} /> {L("Download backup (JSON)", "ব্যাকআপ ডাউনলোড (JSON)")}
            </button>

            <div className="rounded-2xl border border-rose-400/25 bg-rose-400/5 p-4">
              <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
                <AlertTriangle size={14} /> {L("Danger Zone", "ডেঞ্জার জোন")}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                {L(
                  "This erases all progress, tickets, certificates and content edits. It cannot be undone.",
                  "এতে সব অগ্রগতি, টিকিট, সার্টিফিকেট ও কনটেন্ট এডিট মুছে যাবে। এটি ফেরানো যাবে না।"
                )}
              </p>
              <button
                onClick={() => {
                  if (!confirm(L("Wipe ALL platform data?", "সব প্ল্যাটফর্ম ডেটা মুছে ফেলবে?"))) return;
                  factoryReset();
                  toast(L("Platform reset to factory state", "প্ল্যাটফর্ম ফ্যাক্টরি অবস্থায় ফিরেছে"), "warn");
                }}
                className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border border-rose-400/40 text-rose-300 hover:bg-rose-400/10 active:scale-[0.97] transition-all cursor-pointer"
              >
                <Trash2 size={13} /> {L("Factory reset", "ফ্যাক্টরি রিসেট")}
              </button>
            </div>
          </div>
        </Section>
      </div>

      {/* ================= LEGAL / POLICY ================= */}
      <Section
        icon={FileText}
        title={L("Privacy Policy & Terms", "প্রাইভেসি পলিসি ও শর্তাবলী")}
        desc={L("Shown to learners in the footer and signup flow.", "ফুটার ও সাইনআপে শিক্ষার্থীদের দেখানো হয়।")}
        accent="text-amber-300"
      >
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            {
              icon: ShieldCheck,
              title: L("Data protection", "ডেটা সুরক্ষা"),
              body: L(
                "Learner progress is stored securely and never sold.",
                "শিক্ষার্থীর অগ্রগতি নিরাপদে সংরক্ষিত, কখনো বিক্রি হয় না।"
              ),
            },
            {
              icon: Bell,
              title: L("Communication", "যোগাযোগ"),
              body: L(
                "We only message learners about their courses and support.",
                "আমরা শুধু কোর্স ও সাপোর্ট নিয়ে বার্তা পাঠাই।"
              ),
            },
            {
              icon: ToggleLeft,
              title: L("Your control", "তোমার নিয়ন্ত্রণ"),
              body: L(
                "Learners can reset progress or delete their data anytime.",
                "শিক্ষার্থীরা যেকোনো সময় অগ্রগতি রিসেট বা ডেটা মুছতে পারে।"
              ),
            },
          ].map((c) => (
            <div key={c.title} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <c.icon size={16} className="text-cyan-300" />
              <h4 className="mt-2 text-sm font-bold">{c.title}</h4>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{c.body}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};
