import React, { useMemo, useState } from "react";
import {
  Inbox, Mail, Clock, Send, ShieldCheck, User as UserIcon, MessageCircle,
  CheckCircle2, ChevronRight, Search,
} from "lucide-react";
import { useStore, SupportTicket } from "../../store";
import { Avatar, EmptyState } from "../../components/ui";
import { LogoMark } from "../../components/Logo";

const fmtTime = (ts: number, bn: boolean) => {
  const d = new Date(ts);
  const t = d.toLocaleTimeString(bn ? "bn-BD" : "en-GB", { hour: "2-digit", minute: "2-digit" });
  const day = d.toLocaleDateString(bn ? "bn-BD" : "en-GB", { day: "numeric", month: "short" });
  return `${day} · ${t}`;
};

export const NovaInbox: React.FC = () => {
  const { isBn, tickets, replyTicket, toast } = useStore();
  const L = (en: string, bn: string) => (isBn ? bn : en);
  const [selected, setSelected] = useState<string | null>(tickets[0]?.id ?? null);
  const [reply, setReply] = useState("");
  const [q, setQ] = useState("");

  const sorted = useMemo(
    () =>
      [...tickets]
        .filter((tk) => {
          if (!q.trim()) return true;
          const s = q.toLowerCase();
          return (
            tk.studentName.toLowerCase().includes(s) ||
            tk.studentEmail.toLowerCase().includes(s) ||
            tk.messages.some((m) => m.text.toLowerCase().includes(s))
          );
        })
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [tickets, q]
  );

  const current: SupportTicket | undefined = sorted.find((t) => t.id === selected) || sorted[0];

  const send = () => {
    if (!reply.trim() || !current) return;
    replyTicket(current.id, reply.trim());
    setReply("");
    toast(L("Reply sent as Cyber Nova Team.", "সাইবার নোভা টিম হিসেবে উত্তর পাঠানো হয়েছে।"), "xp");
  };

  const unread = tickets.filter((t) => t.status === "open").length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black flex items-center gap-2">
            <Inbox size={18} className="text-cyan-300" />
            {L("Nova Inbox — Student Tickets", "নোভা ইনবক্স — শিক্ষার্থীর টিকিট")}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {L(
              "Every message sent from Nova Help lands here. Replies broadcast as “Cyber Nova Team”.",
              "নোভা হেল্প থেকে পাঠানো প্রতিটি বার্তা এখানে আসে। উত্তরগুলো “সাইবার নোভা টিম” হিসেবে যায়।"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
            {L("Total", "মোট")}: {tickets.length}
          </span>
          {unread > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 animate-pulse">
              {unread} {L("open", "খোলা")}
            </span>
          )}
        </div>
      </div>

      {tickets.length === 0 ? (
        <div className="glass rounded-3xl p-8">
          <EmptyState
            icon={Inbox}
            title={L("Inbox is empty", "ইনবক্স খালি")}
            body={L(
              "As soon as students send messages from Nova Help, they appear here.",
              "শিক্ষার্থীরা নোভা হেল্প থেকে বার্তা পাঠালেই সেগুলো এখানে দেখা যাবে।"
            )}
          />
        </div>
      ) : (
        <div className="grid lg:grid-cols-[320px_1fr] gap-4 items-start">
          {/* ==== ticket list ==== */}
          <aside className="glass rounded-3xl overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-cyan-400/50 px-3 py-2">
                <Search size={13} className="text-slate-500 shrink-0" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={L("Search tickets…", "টিকিট খোঁজো…")}
                  className="w-full bg-transparent outline-none text-xs placeholder:text-slate-500"
                />
              </div>
            </div>
            <div className="max-h-[560px] overflow-y-auto">
              {sorted.map((tk) => {
                const active = current?.id === tk.id;
                const last = tk.messages[tk.messages.length - 1];
                return (
                  <button
                    key={tk.id}
                    onClick={() => setSelected(tk.id)}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-white/5 transition-colors cursor-pointer ${
                      active ? "bg-cyan-400/10 border-l-2 border-l-cyan-400" : "hover:bg-white/[0.04]"
                    }`}
                  >
                    <Avatar url={tk.studentAvatar} name={tk.studentName} size={36} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-sm font-bold truncate ${active ? "text-cyan-100" : ""}`}>{tk.studentName}</span>
                        <span className="text-[9px] font-mono text-slate-500 shrink-0">
                          {fmtTime(tk.updatedAt, isBn)}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <Mail size={9} /> {tk.studentEmail}
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        {last?.from === "team" && (
                          <span className="text-[9px] font-bold text-emerald-300 shrink-0">↳ {L("You", "তুমি")}</span>
                        )}
                        <span className="text-xs text-slate-400 truncate">{last?.text}</span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest border ${
                            tk.status === "answered"
                              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                              : "border-amber-400/40 bg-amber-400/10 text-amber-300"
                          }`}
                        >
                          {tk.status === "answered" ? (
                            <>
                              <CheckCircle2 size={9} /> {L("Answered", "উত্তর দেওয়া")}
                            </>
                          ) : (
                            <>
                              <Clock size={9} /> {L("Open", "খোলা")}
                            </>
                          )}
                        </span>
                        <ChevronRight size={12} className="ml-auto text-slate-600" />
                      </div>
                    </div>
                  </button>
                );
              })}
              {sorted.length === 0 && (
                <div className="px-4 py-8 text-center text-xs text-slate-500">
                  {L("No matching tickets.", "মিলে যাওয়া কোনো টিকিট নেই।")}
                </div>
              )}
            </div>
          </aside>

          {/* ==== conversation ==== */}
          <section className="glass rounded-3xl overflow-hidden flex flex-col min-h-[560px]">
            {!current ? (
              <div className="p-8">
                <EmptyState icon={MessageCircle} title={L("Select a ticket to view", "দেখতে একটি টিকিট বেছে নাও")} />
              </div>
            ) : (
              <>
                {/* header */}
                <div className="flex items-center gap-3 p-5 border-b border-white/10">
                  <Avatar url={current.studentAvatar} name={current.studentName} size={42} ring />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <UserIcon size={12} className="text-cyan-300" /> {current.studentName}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                      <Mail size={10} className="text-emerald-300" /> {current.studentEmail}
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-slate-500">
                    <div>{L("Opened", "খোলা হয়েছে")}</div>
                    <div className="font-mono">{fmtTime(current.createdAt, isBn)}</div>
                  </div>
                </div>

                {/* messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-3">
                  {current.messages.map((m) => {
                    const isTeam = m.from === "team";
                    return (
                      <div key={m.id} className={`flex gap-3 ${isTeam ? "flex-row-reverse" : ""} anim-fade-up`}>
                        {isTeam ? (
                          <div className="grid place-items-center w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/30 to-emerald-500/30 border border-cyan-400/50 shrink-0">
                            <LogoMark size={26} />
                          </div>
                        ) : (
                          <Avatar url={current.studentAvatar} name={current.studentName} size={36} />
                        )}
                        <div className={`max-w-[75%] min-w-0 ${isTeam ? "text-right" : ""}`}>
                          <div
                            className={`text-[10px] font-bold uppercase tracking-widest mb-1 flex items-center gap-1.5 ${
                              isTeam ? "text-cyan-300 justify-end" : "text-slate-400"
                            }`}
                          >
                            {isTeam ? (
                              <>
                                <ShieldCheck size={10} /> {L("Cyber Nova Team", "সাইবার নোভা টিম")}
                              </>
                            ) : (
                              current.studentName
                            )}
                          </div>
                          <div
                            className={`inline-block text-left px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words ${
                              isTeam
                                ? "bg-gradient-to-br from-cyan-500/15 to-emerald-500/10 border border-cyan-400/30 text-slate-100 rounded-tr-md"
                                : "bg-white/[0.06] border border-white/10 text-slate-200 rounded-tl-md"
                            }`}
                          >
                            {m.text}
                          </div>
                          <div className={`mt-1 text-[10px] text-slate-500 ${isTeam ? "" : ""}`}>
                            {fmtTime(m.ts, isBn)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* reply composer */}
                <div className="border-t border-white/10 p-4 bg-black/20">
                  <div className="flex items-center gap-2 mb-2 text-[10px] font-bold uppercase tracking-widest text-cyan-300">
                    <ShieldCheck size={11} /> {L("Reply as: Cyber Nova Team (anonymous)", "উত্তর হিসেবে: সাইবার নোভা টিম (গোপন)")}
                  </div>
                  <div className="flex gap-2">
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) send();
                      }}
                      rows={2}
                      placeholder={L("Type your reply…", "উত্তর লেখো…")}
                      className="flex-1 rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/15 outline-none px-4 py-2.5 text-sm resize-y transition-all"
                    />
                    <button
                      onClick={send}
                      disabled={!reply.trim()}
                      className="inline-flex items-center gap-2 rounded-xl px-5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.5)] active:scale-[0.97] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    >
                      <Send size={14} /> {L("Send Reply", "উত্তর পাঠাও")}
                    </button>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
};
