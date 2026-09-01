import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  LifeBuoy, Send, MessageCircle, ShieldCheck, Sparkles, Mail, User as UserIcon, Clock,
  CheckCircle2, Loader2, Lock, LogIn,
} from "lucide-react";
import { useStore, SupportTicket } from "../store";
import { Avatar, EmptyState } from "../components/ui";
import { LogoMark } from "../components/Logo";
import { auth } from "../firebase";

const WELCOME_BN =
  "প্রিয় লার্নার, সাইবার নোভা একাডেমিতে আপনার শেখার যাত্রাকে সহজ করতে আমরা সবসময় প্রস্তুত। প্ল্যাটফর্ম ব্যবহার করতে বা কোনো মডিউল বুঝতে সমস্যা হলে নিচে আপনার বার্তাটি লিখুন। আমাদের টিম দ্রুত আপনার সাথে যোগাযোগ করবে।";

const WELCOME_EN =
  "Dear learner, we're always here to smooth your journey through the Cyber Nova Academy. If you're stuck using the platform or a specific module, write your message below and our team will get back to you shortly.";

const fmtTime = (ts: number, bn: boolean) => {
  const d = new Date(ts);
  const t = d.toLocaleTimeString(bn ? "bn-BD" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  const day = d.toLocaleDateString(bn ? "bn-BD" : "en-GB", { day: "numeric", month: "short" });
  return `${day} · ${t}`;
};

export const NovaHelp: React.FC = () => {
  const { isBn, user, tickets, submitTicket, toast, logout } = useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  /**
   * VERIFIED ACCOUNT GATE
   * This app uses a custom app session for normal learners, not always a
   * Firebase auth.currentUser. A real signed-in user should be allowed to open
   * a support ticket as long as they are not the demo guest account.
   */
  const isDemoAccount = (user?.email || "").toLowerCase() === "demo@cybernova.com";
  const hasRealSignedInUser = !!user?.email && !isDemoAccount;
  const canSendMessage = hasRealSignedInUser;

  // The student's own thread (auto-attached from active session)
  const myThread: SupportTicket | undefined = useMemo(
    () => tickets.find((tk) => tk.studentEmail.toLowerCase() === (user?.email || "").toLowerCase()),
    [tickets, user]
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [myThread?.messages.length]);

  const send = () => {
    if (!text.trim() || !user) return;
    // Hard gate — demo/guest sessions cannot open tickets.
    if (!canSendMessage || !user?.email) {
      toast(
        L(
          "Guest Demo cannot send messages. Please sign in with your real email.",
          "গেস্ট ডেমো থেকে বার্তা পাঠানো যাবে না। আসল ইমেইল দিয়ে সাইন ইন করো।"
        ),
        "warn"
      );
      return;
    }
    setSending(true);
    // Background: attaches student's Name + Email + timestamp automatically.
    submitTicket(text.trim());
    setText("");
    // Simulated delivery delay for a polished feel.
    setTimeout(() => {
      setSending(false);
      toast(L("Your message was sent to the Cyber Nova Team.", "তোমার বার্তা সাইবার নোভা টিমের কাছে পাঠানো হয়েছে।"), "xp");
    }, 420);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <header className="anim-fade-up">
        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-cyan-400/70">
          {L("Nova Help", "নোভা হেল্প")}
        </p>
        <h1 className="mt-1 text-3xl sm:text-4xl font-black flex items-center gap-3">
          <LifeBuoy className="text-cyan-300" size={28} />
          <span className="neon-text">{L("Customer Support", "কাস্টমার সাপোর্ট")}</span>
        </h1>
      </header>

      {/* welcome card */}
      <section className="relative overflow-hidden rounded-3xl border border-cyan-400/25 bg-gradient-to-br from-cyan-500/10 via-slate-900/30 to-emerald-500/10 p-6 sm:p-8 scanlines anim-fade-up anim-delay-1">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row items-start gap-4">
          <div className="grid place-items-center w-14 h-14 rounded-2xl bg-slate-950/60 border border-cyan-400/40 text-cyan-200 shrink-0 shadow-[0_0_25px_rgba(34,211,238,.3)]">
            <MessageCircle size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                <ShieldCheck size={10} />{" "}
                {canSendMessage
                  ? L("Verified Session", "যাচাইকৃত সেশন")
                  : L("Guest Demo Session", "গেস্ট ডেমো সেশন")}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-300">
                <Sparkles size={10} /> {L("24×7 Support", "২৪×৭ সাপোর্ট")}
              </span>
            </div>
            <p className={`leading-[1.85] text-slate-200 ${isBn ? "text-[15px]" : "text-sm sm:text-[15px]"}`}>
              {isBn ? WELCOME_BN : WELCOME_EN}
            </p>
          </div>
        </div>
      </section>

      {/* session info + compose */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* ===== LOCKED STATE — Guest Demo cannot send ===== */}
        {!canSendMessage ? (
          <section className="relative overflow-hidden glass rounded-3xl p-6 sm:p-8 anim-fade-up anim-delay-2 border border-amber-400/30">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-amber-400/10 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center w-12 h-12 rounded-2xl bg-amber-400/15 border border-amber-400/40 text-amber-300 shrink-0">
                  <Lock size={22} />
                </span>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {L("Verified account required", "যাচাইকৃত অ্যাকাউন্ট প্রয়োজন")}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {L("Guest Demo sessions cannot open support tickets.", "গেস্ট ডেমো সেশন থেকে সাপোর্ট টিকিট খোলা যায় না।")}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-slate-300">
                {L(
                  "To protect learner privacy, Nova Help is available only to members signed in with a real email address (Email/Password or Google). Please sign out of the demo and log in with your own account to chat with the Cyber Nova Team.",
                  "শিক্ষার্থীদের গোপনীয়তা রক্ষার জন্য নোভা হেল্প শুধুমাত্র আসল ইমেইল (ইমেইল/পাসওয়ার্ড বা Google) দিয়ে সাইন ইন করা সদস্যদের জন্য। সাইবার নোভা টিমের সাথে চ্যাট করতে ডেমো থেকে বেরিয়ে নিজের অ্যাকাউন্টে লগইন করো।"
                )}
              </p>

              <ul className="mt-5 space-y-2.5">
                {[
                  L("Sign out of the Guest Demo session", "গেস্ট ডেমো সেশন থেকে সাইন আউট করো"),
                  L("Create an account or sign in with Google", "একটি অ্যাকাউন্ট খোলো বা Google দিয়ে সাইন ইন করো"),
                  L("Return to Nova Help and send your message", "নোভা হেল্পে ফিরে এসে তোমার বার্তা পাঠাও"),
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                    <span className="grid place-items-center w-5 h-5 rounded-md bg-cyan-400/15 border border-cyan-400/30 text-[10px] font-mono font-bold text-cyan-300 shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ul>

              <button
                onClick={logout}
                className="mt-6 inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-orange-400 hover:shadow-[0_0_30px_rgba(245,158,11,.45)] active:scale-[0.97] transition-all cursor-pointer"
              >
                <LogIn size={15} /> {L("Sign in with a real account", "আসল অ্যাকাউন্ট দিয়ে সাইন ইন করো")}
              </button>
            </div>
          </section>
        ) : (
        /* ===== compose (verified members only) ===== */
        <section className="glass rounded-3xl p-6 anim-fade-up anim-delay-2 space-y-4">
          <label className="block">
            <span className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <MessageCircle size={12} className="text-cyan-300" />
              {L("Your message", "তোমার বার্তা")}
            </span>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              placeholder={L("Write your problem here...", "আপনার সমস্যাটি এখানে লিখুন...")}
              className="w-full rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-3 text-sm leading-relaxed resize-y transition-all"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-emerald-300 shrink-0" />
              <span>
                {L(
                  "Your name and email are auto-attached from your session.",
                  "তোমার নাম ও ইমেইল সেশন থেকে স্বয়ংক্রিয়ভাবে যুক্ত হবে।"
                )}
              </span>
            </div>
            <button
              onClick={send}
              disabled={!text.trim() || sending}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_35px_rgba(34,211,238,.55)] active:scale-[0.97] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              {L("Send message", "বার্তা পাঠান")}
            </button>
          </div>
        </section>
        )}

        {/* session identity card */}
        <aside className="glass rounded-3xl p-5 anim-fade-up anim-delay-3">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500 mb-3">
            {L("Attached automatically", "স্বয়ংক্রিয়ভাবে সংযুক্ত")}
          </h3>
          <div className="flex items-center gap-3">
            <Avatar url={user?.avatarUrl} name={user?.name} size={44} ring />
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold truncate flex items-center gap-1.5">
                <UserIcon size={11} className="text-cyan-300" /> {user?.name}
              </div>
              <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5">
                <Mail size={10} className="text-emerald-300" /> {user?.email}
              </div>
            </div>
          </div>
          <div
            className={`mt-4 rounded-xl border px-3 py-2.5 text-[11px] ${
              canSendMessage
                ? "border-white/10 bg-white/[0.02] text-slate-400"
                : "border-amber-400/30 bg-amber-400/10 text-amber-200"
            }`}
          >
            {canSendMessage
              ? L(
                  "Your tickets remain private between you and the Cyber Nova Team.",
                  "তোমার বার্তা শুধু তোমার আর সাইবার নোভা টিমের মধ্যে থাকে।"
                )
              : L(
                  "Demo accounts are read-only. Sign in with a real email to send messages.",
                  "ডেমো অ্যাকাউন্ট শুধু পড়ার জন্য। বার্তা পাঠাতে আসল ইমেইল দিয়ে সাইন ইন করো।"
                )}
          </div>
        </aside>
      </div>

      {/* conversation thread */}
      <section className="glass rounded-3xl p-6 anim-fade-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300 flex items-center gap-2">
            <MessageCircle size={15} /> {L("Conversation", "কথোপকথন")}
          </h3>
          {myThread && (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                myThread.status === "answered"
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-amber-400/40 bg-amber-400/10 text-amber-300"
              }`}
            >
              {myThread.status === "answered" ? (
                <>
                  <CheckCircle2 size={10} /> {L("Answered", "উত্তর দেওয়া হয়েছে")}
                </>
              ) : (
                <>
                  <Clock size={10} /> {L("Awaiting reply", "উত্তরের অপেক্ষায়")}
                </>
              )}
            </span>
          )}
        </div>

        {!myThread ? (
          <EmptyState
            icon={MessageCircle}
            title={L("No messages yet", "এখনও কোনো বার্তা নেই")}
            body={L(
              "Send your first message above and the Cyber Nova Team will get back to you.",
              "উপরে প্রথম বার্তাটি পাঠাও, সাইবার নোভা টিম শীঘ্রই তোমার সাথে যোগাযোগ করবে।"
            )}
          />
        ) : (
          <div ref={scrollerRef} className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {myThread.messages.map((m) => {
              const isTeam = m.from === "team";
              return (
                <div key={m.id} className={`flex gap-3 ${isTeam ? "" : "flex-row-reverse"} anim-fade-up`}>
                  {/* avatar */}
                  {isTeam ? (
                    <div className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 border border-cyan-400/50 shrink-0 shadow-[0_0_18px_rgba(34,211,238,.35)]">
                      <LogoMark size={26} />
                    </div>
                  ) : (
                    <Avatar url={user?.avatarUrl} name={user?.name} size={36} />
                  )}
                  {/* bubble */}
                  <div className={`max-w-[80%] min-w-0 ${isTeam ? "" : "text-right"}`}>
                    <div
                      className={`text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 ${
                        isTeam ? "text-cyan-300" : "text-slate-400 justify-end"
                      }`}
                    >
                      {isTeam ? (
                        <>
                          <ShieldCheck size={10} /> {L("From: Cyber Nova Team", "প্রেরক: সাইবার নোভা টিম")}
                        </>
                      ) : (
                        L("You", "তুমি")
                      )}
                    </div>
                    <div
                      className={`inline-block text-left px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                        isTeam
                          ? "bg-gradient-to-br from-cyan-500/15 to-emerald-500/10 border border-cyan-400/30 text-slate-100 rounded-tl-md shadow-[0_0_25px_-10px_rgba(34,211,238,.5)]"
                          : "bg-white/[0.06] border border-white/10 text-slate-200 rounded-tr-md"
                      }`}
                    >
                      {m.text}
                    </div>
                    <div className={`mt-1 text-[10px] text-slate-500 ${isTeam ? "" : "text-right"}`}>
                      {fmtTime(m.ts, isBn)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
