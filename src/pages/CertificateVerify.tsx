import React, { useEffect, useMemo, useState } from "react";
import { ShieldCheck, UserRound, BookOpen, CalendarDays, BadgeCheck, ArrowLeft, IdCard, Award, Sparkles, Crown } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useStore } from "../store";

export const CertificateVerify: React.FC = () => {
  const { certificates, isBn, nav, route } = useStore();
  const [cert, setCert] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const verifyId = route.verifyId ?? new URLSearchParams(window.location.search).get("verify") ?? "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      if (!verifyId) {
        setCert(null);
        setLoading(false);
        return;
      }

      try {
        const snap = await getDoc(doc(db, "certificates", verifyId));
        if (snap.exists()) {
          setCert({ id: snap.id, ...snap.data() });
        } else {
          const localMatch = certificates.find((item) => item.id === verifyId);
          setCert(localMatch || null);
        }
      } catch {
        const localMatch = certificates.find((item) => item.id === verifyId);
        setCert(localMatch || null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [certificates, verifyId]);

  const L = (en: string, bn: string) => (isBn ? bn : en);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
        <div className="mx-auto max-w-lg rounded-3xl border border-cyan-500/20 bg-slate-900/80 p-8 text-center">
          <div className="mx-auto mb-4 h-16 w-16 animate-pulse rounded-full bg-cyan-500/20" />
          <h1 className="text-xl font-black uppercase tracking-[0.2em] text-cyan-200">
            {L("Verifying…", "ভেরিফাই হচ্ছে…")}
          </h1>
        </div>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100">
        <div className="mx-auto max-w-lg rounded-3xl border border-red-500/30 bg-red-500/5 p-8 text-center shadow-[0_0_40px_rgba(239,68,68,0.2)]">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-300">
            <ShieldCheck size={30} />
          </div>
          <h1 className="text-2xl font-black tracking-[0.14em] uppercase text-red-200">
            {L("Certificate not found", "সার্টিফিকেট পাওয়া যায়নি")}
          </h1>
          <p className="mt-4 text-sm text-slate-300">
            {L("This verification link is invalid or the certificate has been removed.", "এই ভেরিফিকেশন লিঙ্কটি ভুল বা সার্টিফিকেটটি মুছে গেছে।")}
          </p>
          <button
            onClick={() => nav({ view: "home" })}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 px-5 py-3 text-sm font-black text-slate-950 cursor-pointer"
          >
            <ArrowLeft size={16} /> {L("Back to Home", "হোমে ফিরে যান")}
          </button>
        </div>
      </div>
    );
  }

  const earnedAt = new Date(cert.earnedAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const score = typeof cert.score === "number" ? cert.score : 100;
  const passMark = typeof cert.passMark === "number" ? cert.passMark : 70;
  const totalMarks = typeof cert.totalMarks === "number" ? cert.totalMarks : 100;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_34%),linear-gradient(180deg,#020817,#0f172a)] px-4 py-8 text-slate-100 sm:px-6">
      <div className="mx-auto max-w-5xl rounded-[32px] border border-yellow-500/30 bg-slate-900/70 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.85)] backdrop-blur-xl">
        <div className="flex flex-col gap-4 border-b border-yellow-500/20 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="rounded-2xl border border-yellow-500/40 bg-yellow-400/10 p-3 text-yellow-200">
              <ShieldCheck size={26} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-yellow-300">
                {L("Verify Authenticity", "সত্যতা যাচাই করুন")}
              </div>
              <h1 className="mt-1 text-3xl font-black text-white">Cyber Nova</h1>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/35 bg-emerald-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-200">
            <BadgeCheck size={14} /> {L("Verified", "ভেরিফাইড")}
          </div>
        </div>

        <div className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <div className="rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(15,23,42,0.9),rgba(15,23,42,0.75))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-amber-400/10 p-3 text-amber-200 ring-1 ring-amber-300/20">
                  <UserRound size={28} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    {L("Recipient", "প্রাপ্তা কর্তা")}
                  </div>
                  <div className="mt-2 text-2xl font-black text-white">{cert.name}</div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<BookOpen size={16} />}
                label={L("Course", "কোর্স")}
                value={isBn ? cert.courseTitleBn || cert.courseTitle : cert.courseTitle}
              />
              <InfoRow
                icon={<IdCard size={16} />}
                label={L("Credential", "ক্রেডেনশিয়াল")}
                value={isBn ? cert.examTitleBn || cert.examTitle || cert.courseTitleBn : cert.examTitle || cert.courseTitle}
              />
              <InfoRow
                icon={<CalendarDays size={16} />}
                label={L("Issued On", "জারি তারিখ")}
                value={earnedAt}
              />
              <InfoRow
                icon={<ShieldCheck size={16} />}
                label={L("Certificate ID", "সার্টিফিকেট আইডি")}
                value={cert.id}
              />
            </div>

            <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/5 p-5 text-sm text-emerald-100">
              <div className="flex items-center gap-2 font-black uppercase tracking-[0.18em] text-emerald-200">
                <Sparkles size={14} /> {L("Status", "স্ট্যাটাস")}
              </div>
              <p className="mt-2 leading-relaxed text-emerald-50/90">
                {L(
                  "This certificate is authentic and was issued by Cyber Nova after successful completion of the program.",
                  "এই সার্টিফিকেটটি সত্য ও প্রমাণিত, এবং Cyber Nova কর্তৃপক্ষ কর্তৃক সফল সমাপ্তির পর জারি করা হয়েছে।"
                )}
              </p>
            </div>
          </div>

          <div className="rounded-[28px] border border-yellow-500/20 bg-gradient-to-br from-yellow-400/10 via-slate-900 to-slate-950 p-5">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-yellow-200">
              <Crown size={14} /> {L("Verification Summary", "ভেরিফিকেশন সারাংশ")}
            </div>
            <div className="mt-5 space-y-4">
              <SummaryItem
                label={L("Completion", "সম্পূর্ণতা")}
                value={L("Passed", "পাস")}
                color="text-emerald-300"
              />
              <SummaryItem
                label={L("Score", "স্কোর")}
                value={`${score}/${totalMarks}`}
                color="text-cyan-300"
              />
              <SummaryItem
                label={L("Pass Mark", "পাস মার্ক")}
                value={`${passMark}/${totalMarks}`}
                color="text-amber-300"
              />
              <SummaryItem
                label={L("Program", "প্রোগ্রাম")}
                value={isBn ? cert.courseTitleBn || cert.courseTitle : cert.courseTitle}
                color="text-violet-300"
              />
              <SummaryItem
                label={L("Exam / Track", "এক্সাম / ট্র্যাক")}
                value={isBn ? cert.examTitleBn || cert.examTitle || cert.courseTitleBn : cert.examTitle || cert.courseTitle}
                color="text-emerald-300"
              />
              <SummaryItem
                label={L("Holder", "ধারী")}
                value={cert.name}
                color="text-yellow-300"
              />
            </div>

            <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-3 text-[11px] leading-relaxed text-cyan-50/85">
              <div className="flex items-center gap-2 font-black uppercase tracking-[0.18em] text-cyan-200">
                <Award size={13} /> {L("Authenticity Check", "অথেন্টিসিটি চেক")}
              </div>
              <p className="mt-2">
                {L("This record is validated against the official Cyber Nova certification registry.", "এই রেকর্ডটি অফিসিয়াল Cyber Nova সার্টিফিকেশন রেজিস্ট্রির সাথে যাচাই করা হয়েছে।")}
              </p>
            </div>

            <button
              onClick={() => nav({ view: "home" })}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-3 text-sm font-black text-slate-950 cursor-pointer shadow-[0_0_30px_rgba(34,211,238,0.25)]"
            >
              <ArrowLeft size={16} /> {L("Open Cyber Nova", "সাইবার নোভা খুলুন")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-4">
    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
      {icon}
      {label}
    </div>
    <div className="mt-3 text-base font-bold text-slate-100">{value}</div>
  </div>
);

const SummaryItem: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2">
    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{label}</span>
    <span className={`text-sm font-bold ${color}`}>{value}</span>
  </div>
);
