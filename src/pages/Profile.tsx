import React, { useRef, useState } from "react";
import {
  UserCircle2, Save, Camera, ChevronRight, Crosshair, BookOpen, StickyNote, Swords,
  Trash2, LogOut, Flame, ScrollText, BadgeCheck, CalendarClock, Phone, MapPin, GraduationCap,
  FileText, Shield, Award, ClipboardList,
} from "lucide-react";
import { useStore, computeBadges, COURSE_BADGE_META, Activity } from "../store";
import { getChapter, levelFor } from "../data/courses";
import { Avatar, BadgeTile, Bar, EmptyState, LevelRing } from "../components/ui";
import { Certificate } from "../components/Certificate";
import { fmtN } from "./Home";

export const Profile: React.FC = () => {
  const { t, tn, isBn, user, xp, read, answers, arena, activity, updateProfile, resetProgress, logout, toast, nav, certificates, curriculum, courseBadges, examHistory, admin } =
    useStore();

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [education, setEducation] = useState(user?.education || "");
  const [location, setLocation] = useState(user?.location || "");
  const [avatarPreview, setAvatarPreview] = useState(user?.avatarUrl || "");
  const [dirty, setDirty] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const lv = levelFor(xp);
  const badges = computeBadges({ xp, read, answers, arena, curriculum });
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const L = (en: string, bn: string) => (isBn ? bn : en);

  if (!user) return null;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast(L("Image too large (max 5MB)", "ছবি খুব বড় (সর্বোচ্চ ৫MB)"), "warn");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setDirty(true);
    };
    reader.readAsDataURL(file);
  };

  const saveAll = () => {
    updateProfile({
      name: name.trim() || user.name,
      avatarUrl: avatarPreview,
      phone: phone.trim(),
      bio: bio.trim(),
      education: education.trim(),
      location: location.trim(),
    });
    setDirty(false);
    toast(t("identitySaved"), "xp");
  };

  const rel = (ts: number) => {
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return t("justNow");
    const m = Math.floor(s / 60);
    if (m < 60) return `${fmtN(m, isBn)}${t("minutesAgo")}`;
    return `${fmtN(Math.floor(m / 60), isBn)}${t("hoursAgo")}`;
  };

  const activityLabel = (a: Activity) => {
    const ch = getChapter(a.courseId, a.chapterId);
    const chName = ch ? (isBn ? ch.titleBn : ch.title) : "";
    if (a.kind === "quiz") return `${t("logQuiz")} ${chName}`;
    if (a.kind === "read") return `${t("logRead")}: ${chName}`;
    if (a.kind === "note") return `${t("logNote")} ${chName}`;
    return `${t("logArena")} · +${a.xp} XP`;
  };

  const iconFor = (a: Activity) =>
    a.kind === "quiz" ? Crosshair : a.kind === "read" ? BookOpen : a.kind === "note" ? StickyNote : Swords;

  return (
    <div className="space-y-6">
      <header className="anim-fade-up">
        <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3">
          <UserCircle2 className="text-cyan-300" size={30} /> {t("profileTitle")}
        </h1>
        <p className="mt-2 text-sm text-slate-400">{t("profileSub")}</p>
      </header>

      <div className="grid lg:grid-cols-[400px_1fr] gap-6 items-start">
        {/* ===== identity card ===== */}
        <section className="glass rounded-3xl p-6 space-y-5 anim-fade-up anim-delay-1">
          <div className="flex items-center gap-2 text-cyan-300">
            <BadgeCheck size={16} />
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">{t("identityCard")}</h2>
          </div>

          {/* avatar with gallery picker */}
          <div className="flex flex-col items-center text-center">
            <div className="relative group">
              <Avatar url={avatarPreview} name={name} size={110} ring />
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 grid place-items-center transition-opacity cursor-pointer"
              >
                <div className="flex flex-col items-center gap-1 text-white">
                  <Camera size={22} />
                  <span className="text-[10px] font-bold">{L("Change photo", "ছবি বদলাও")}</span>
                </div>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
              {/* small camera badge */}
              <span className="absolute -bottom-1 -right-1 grid place-items-center w-8 h-8 rounded-full bg-slate-900 border border-cyan-400/50 text-cyan-300 cursor-pointer" onClick={() => fileRef.current?.click()}>
                <Camera size={13} />
              </span>
            </div>
            <div className="mt-3 font-black text-lg break-all">{name || user.name}</div>
            <div className="text-xs text-slate-500 break-all">{user.email}</div>
            <div className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <CalendarClock size={10} /> {t("memberSince")}: {new Date(user.joinedAt).toLocaleDateString(isBn ? "bn-BD" : "en-GB")}
            </div>
          </div>

          {/* name */}
          <FieldInput
            icon={<UserCircle2 size={13} className="text-cyan-300" />}
            label={t("usernameField")}
            value={name}
            onChange={(v) => { setName(v); setDirty(true); }}
            placeholder={L("Your codename", "তোমার কোডনেম")}
          />

          {/* phone */}
          <FieldInput
            icon={<Phone size={13} className="text-emerald-300" />}
            label={L("Phone number", "ফোন নম্বর")}
            value={phone}
            onChange={(v) => { setPhone(v); setDirty(true); }}
            placeholder={L("+880 1XXX-XXXXXX", "+৮৮০ ১XXX-XXXXXX")}
          />

          {/* education */}
          <FieldInput
            icon={<GraduationCap size={13} className="text-fuchsia-300" />}
            label={L("Education / Field of Study", "শিক্ষা / পড়ালেখার বিষয়")}
            value={education}
            onChange={(v) => { setEducation(v); setDirty(true); }}
            placeholder={L("e.g. CSE, Dhaka University", "যেমন CSE, ঢাকা বিশ্ববিদ্যালয়")}
          />

          {/* location */}
          <FieldInput
            icon={<MapPin size={13} className="text-amber-300" />}
            label={L("Location", "অবস্থান")}
            value={location}
            onChange={(v) => { setLocation(v); setDirty(true); }}
            placeholder={L("City, Country", "শহর, দেশ")}
          />

          {/* bio */}
          <label className="block">
            <span className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText size={13} className="text-cyan-300" /> {L("About me", "আমার সম্পর্কে")}
            </span>
            <textarea
              value={bio}
              onChange={(e) => { setBio(e.target.value); setDirty(true); }}
              rows={3}
              placeholder={L("Write a short bio — your interests, goals…", "একটি ছোট পরিচিতি লেখো — তোমার আগ্রহ, লক্ষ্য…")}
              className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-2.5 text-sm transition-all resize-y"
            />
          </label>

          {/* save button */}
          <button
            onClick={saveAll}
            disabled={!dirty}
            className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-all cursor-pointer active:scale-[0.98] ${
              dirty
                ? "text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.45)]"
                : "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
            }`}
          >
            <Save size={15} /> {t("saveIdentity")}
          </button>
          <button
            onClick={logout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border border-white/10 text-slate-400 hover:text-rose-300 hover:border-rose-400/40 hover:bg-rose-400/5 transition-all cursor-pointer"
          >
            <LogOut size={13} /> {t("logout")}
          </button>
        </section>

        <div className="space-y-6 min-w-0">
          {/* ===== level + stats ===== */}
          <section className="glass rounded-3xl p-6 anim-fade-up anim-delay-2">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300 flex items-center gap-2">
              <Flame size={16} /> {t("levelProgress")}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-6">
              <LevelRing size={128} />
              <div className="flex-1 min-w-[200px] space-y-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">{t("statXP")}</div>
                  <div className="text-3xl font-black tabular-nums neon-text">{fmtN(xp, isBn)} XP</div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400">
                      {t("currentLevel")}: <b className="text-emerald-300">{tn("levelNames", lv.index)}</b>
                    </span>
                    <span className="text-slate-500 tabular-nums">
                      {lv.nextXp !== null ? `${fmtN(lv.nextXp - xp, isBn)} XP ${t("nextLevel")}` : t("maxLevel")}
                    </span>
                  </div>
                  <Bar pct={lv.pct} />
                </div>
                <button
                  onClick={() => nav({ view: "quiz" })}
                  className="text-xs font-bold text-cyan-300 hover:text-cyan-200 inline-flex items-center gap-1 cursor-pointer"
                >
                  {t("exploreQuiz")} <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </section>

          {/* ===== certificates ===== */}
          {admin.certificatesEnabled && (
            <section className="glass rounded-3xl p-6">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-300 flex items-center gap-2">
                <Award size={15} /> {L("Certificates", "সার্টিফিকেট")}
              </h2>
              {certificates.length === 0 && (
                <p className="mt-3 text-xs text-slate-400">
                  {L("Complete any track to earn your first professional certificate.", "যেকোনো ট্র্যাক সম্পন্ন করলে তোমার প্রথম প্রফেশনাল সার্টিফিকেট পাবে।")}
                </p>
              )}
              <div className="mt-4 space-y-4">
                {certificates.map((cert) => (
                  <Certificate key={cert.id} cert={cert} isBn={isBn} />
                ))}
              </div>
            </section>
          )}

          {/* ===== exam reports ===== */}
          <section className="glass rounded-3xl p-6">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber-300 flex items-center gap-2">
                <ClipboardList size={15} /> {L("Exam Reports", "এক্সাম রিপোর্ট")}
              </h2>
              <button
                onClick={() => setShowReports((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-amber-200 hover:bg-amber-400/20 cursor-pointer"
              >
                {showReports ? L("Close", "বন্ধ") : L("Open", "খোলো")}
              </button>
            </div>

            {examHistory.length === 0 ? (
              <p className="mt-3 text-xs text-slate-400">
                {L("No exam attempts yet. Start an exam to generate a report.", "এখনো কোনো এক্সাম চেষ্টা হয়নি। একটি এক্সাম শুরু করে রিপোর্ট তৈরি করো।")}
              </p>
            ) : showReports ? (
              <div className="mt-4 space-y-3 rounded-2xl border border-amber-400/15 bg-gradient-to-br from-amber-400/[0.06] to-cyan-400/[0.03] p-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{L("Your assessment timeline", "তোমার অ্যাসেসমেন্ট টাইমলাইন")}</div>
                {examHistory.map((attempt, index) => (
                  <div key={attempt.id} className="relative pl-8">
                    {index < examHistory.length - 1 && <span className="absolute left-[11px] top-7 bottom-[-16px] w-px bg-amber-400/20" />}
                    <span className={`absolute left-0 top-1 grid place-items-center w-6 h-6 rounded-full border text-[10px] font-black ${attempt.passed ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-300" : "border-rose-400/50 bg-rose-400/15 text-rose-300"}`}>{index + 1}</span>
                    <div className="rounded-xl border border-white/10 bg-[#071022]/60 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="text-sm font-black text-white">{isBn ? attempt.examTitleBn || attempt.examTitle : attempt.examTitle}</div>
                          <div className="mt-0.5 text-[11px] text-cyan-200/70">{isBn ? attempt.chapterTitleBn || attempt.courseTitleBn : attempt.chapterTitle || attempt.courseTitle}</div>
                          <div className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">{isBn ? attempt.courseTitleBn : attempt.courseTitle} · {new Date(attempt.attemptedAt).toLocaleDateString(isBn ? "bn-BD" : "en-GB")}</div>
                        </div>
                        <div className={`text-right ${attempt.passed ? "text-emerald-300" : "text-rose-300"}`}>
                          <div className="text-2xl font-black leading-none">{attempt.score}/{attempt.totalMarks ?? 100}</div>
                          <div className="mt-1 text-[9px] font-bold uppercase tracking-widest">{attempt.passed ? L("Passed", "পাস") : L("Failed", "ফেল")}</div>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-[10px] text-slate-400">
                        <div><span className="block text-slate-600">{L("Correct", "সঠিক")}</span><strong className="text-slate-200">{attempt.correctAnswers}/{attempt.totalQuestions}</strong></div>
                        <div><span className="block text-slate-600">{L("Time used", "ব্যবহৃত সময়")}</span><strong className="text-slate-200">{attempt.durationMinutes}m</strong></div>
                        <div><span className="block text-slate-600">{L("Questions", "প্রশ্ন")}</span><strong className="text-slate-200">{attempt.totalQuestions}</strong></div>
                      </div>
                      {attempt.questionResults && (
                        <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
                          <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{L("Answer review", "উত্তর পর্যালোচনা")}</div>
                          {attempt.questionResults.map((item, questionIndex) => (
                            <div key={`${attempt.id}-${questionIndex}`} className={`rounded-lg border p-2.5 text-[11px] ${item.isCorrect ? "border-emerald-400/20 bg-emerald-400/[0.05]" : "border-rose-400/20 bg-rose-400/[0.05]"}`}>
                              <div className="font-semibold text-slate-200">{fmtN(questionIndex + 1, isBn)}. {isBn ? item.questionBn : item.question}</div>
                              <div className="mt-1 text-slate-400">{L("Your answer", "তোমার উত্তর")}: <span className={item.isCorrect ? "text-emerald-300" : "text-rose-300"}>{isBn ? item.selectedBn : item.selected}</span></div>
                              {!item.isCorrect && <div className="mt-0.5 text-emerald-300">{L("Correct answer", "সঠিক উত্তর")}: {isBn ? item.correctBn : item.correct}</div>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-400">
                {L("Tap View to inspect your full exam history.", "পুরো এক্সাম হিস্ট্রি দেখতে View বাটনে ট্যাপ করো।")}
              </div>
            )}
          </section>

          {/* ===== overview summary cards ===== */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 anim-fade-up">
            {[
              { icon: BookOpen, val: fmtN(read.length, isBn), label: L("Missions done", "সম্পন্ন মিশন"), color: "text-cyan-300" },
              { icon: Crosshair, val: fmtN(Object.values(answers).filter(a => a.correct).length, isBn), label: L("Quizzes cracked", "কুইজ সমাধান"), color: "text-emerald-300" },
              { icon: Swords, val: fmtN(arena.runs, isBn), label: L("Arena runs", "এরিনা রান"), color: "text-fuchsia-300" },
              { icon: Shield, val: `Lv.${lv.index}`, label: L("Current level", "বর্তমান লেভেল"), color: "text-amber-300" },
            ].map(s => (
              <div key={s.label} className="glass rounded-2xl p-3.5 text-center">
                <s.icon size={16} className={`${s.color} mx-auto`} />
                <div className="mt-2 text-lg font-black tabular-nums">{s.val}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 mt-0.5">{s.label}</div>
              </div>
            ))}
          </section>

          {/* ===== badges ===== */}
          <section className="glass rounded-3xl p-6 anim-fade-up anim-delay-3 space-y-8">
            {/* regular badges */}
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-amber-200">
                  {t("badgesAll")} · {fmtN(unlockedCount, isBn)}/{fmtN(7, isBn)}
                </h2>
              </div>
              {unlockedCount === 0 && <p className="mt-2 text-xs text-slate-500">{t("badgesEmpty")}</p>}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                {badges.map((b) => (
                  <BadgeTile key={b.key} badge={b} />
                ))}
              </div>
            </div>

            {/* course badges — gamified */}
            <div className="pt-2 border-t border-white/10">
              <h3 className="text-sm font-black flex items-center gap-2">
                <span className="text-lg">🏅</span> {L("Course Badges — Quiz Victories", "কোর্স ব্যাজ — কুইজ জয়")}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {L(
                  "Earned when you crack your first quiz of a course. Example: Network Scout for course 1, Bug Hunter for course 3.",
                  "একটি কোর্সের প্রথম কুইজ জিতলেই এই ব্যাজ আনলক হয়। যেমন: কোর্স ১-এ Network Scout, কোর্স ৩-এ Bug Hunter।"
                )}
              </p>
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-2 gap-3">
                {curriculum.map((c) => {
                  const meta = COURSE_BADGE_META[c.id];
                  if (!meta) return null;
                  const unlocked = courseBadges.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      className={`relative rounded-2xl border p-4 flex items-center gap-3 transition-all ${
                        unlocked
                          ? "border-amber-400/40 bg-gradient-to-br from-amber-400/15 via-yellow-500/10 to-orange-500/10 shadow-[0_0_30px_-10px_rgba(245,158,11,.6)]"
                          : "border-white/10 bg-white/[0.02] opacity-60"
                      }`}
                    >
                      <div className={`grid place-items-center w-12 h-12 rounded-xl text-2xl shrink-0 border ${unlocked ? "bg-white/10 border-amber-300/40" : "bg-white/5 border-white/10"}`}>
                        {unlocked ? meta.emoji : "🔒"}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className={`text-sm font-black truncate ${unlocked ? "text-white" : "text-slate-500"}`}>
                          {isBn ? meta.nameBn : meta.name} {meta.emoji}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{isBn ? meta.descBn : meta.desc}</div>
                        <div className="mt-1 text-[10px] font-mono text-slate-500 truncate">{isBn ? c.titleBn : c.title}</div>
                      </div>
                      {unlocked && (
                        <span className="absolute top-2 right-2 grid place-items-center w-5 h-5 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300">
                          ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===== activity ===== */}
          <section className="glass rounded-3xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
              <ScrollText size={15} /> {t("activityTitle")}
            </h2>
            <div className="mt-4 space-y-2">
              {activity.length === 0 && <EmptyState title={t("activityEmpty")} icon={ScrollText} />}
              {activity.slice(0, 12).map((a) => {
                const I = iconFor(a);
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-3.5 py-2.5 anim-fade-up">
                    <span className="grid place-items-center w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 shrink-0">
                      <I size={13} />
                    </span>
                    <span className="flex-1 min-w-0 text-xs text-slate-300 truncate">{activityLabel(a)}</span>
                    {a.xp > 0 && <span className="text-[11px] font-bold text-emerald-300 shrink-0">+{fmtN(a.xp, isBn)} XP</span>}
                    <span className="text-[10px] text-slate-500 shrink-0">{rel(a.ts)}</span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== danger ===== */}
          <section className="rounded-3xl border border-rose-400/25 bg-rose-400/5 p-6">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-rose-300">{t("dangerZone")}</h2>
            <button
              onClick={() => {
                resetProgress();
                toast(t("resetConfirm"), "warn");
              }}
              className="mt-3 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold border border-rose-400/40 text-rose-300 hover:bg-rose-400/10 active:scale-[0.97] transition-all cursor-pointer"
            >
              <Trash2 size={13} /> {t("resetProgress")}
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

/* small reusable input field */
const FieldInput: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}> = ({ icon, label, value, onChange, placeholder }) => (
  <label className="block">
    <span className="text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
      {icon} {label}
    </span>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-2.5 text-sm transition-all"
    />
  </label>
);
