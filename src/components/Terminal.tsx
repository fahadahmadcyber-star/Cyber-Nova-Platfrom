import React, { useEffect, useRef, useState } from "react";
import { Terminal as TermIcon, CircleDot } from "lucide-react";
import { TermScript, terminalScripts } from "../data/terminals";

interface Rendered {
  kind: string;
  text: string;
}

const colorFor = (k: string) =>
  k === "cmd"
    ? "text-slate-100 font-semibold"
    : k === "ok"
    ? "text-emerald-300"
    : k === "warn"
    ? "text-amber-300"
    : k === "err"
    ? "text-rose-400"
    : k === "info"
    ? "text-cyan-300"
    : "text-slate-400";

const PROMPT = "┌──(nova㉿kali)";
const PROMPT2 = "└─$ ";

export const KaliTerminal: React.FC<{ courseId: string; seedIndex: number; label: string; note: string }> = ({
  courseId, seedIndex, label, note,
}) => {
  const scripts = terminalScripts[courseId] || terminalScripts.c1;
  const script: TermScript = scripts[seedIndex % scripts.length];
  const [lines, setLines] = useState<Rendered[]>([]);
  const [typing, setTyping] = useState("");
  const bodyRef = useRef<HTMLDivElement>(null);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    setLines([]);
    setTyping("");
    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    async function run() {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        if (cancelled || !alive.current) return;
        for (const line of script.lines) {
          if (cancelled) return;
          if (line.t === "cmd") {
            // typewriter
            for (let i = 1; i <= line.s.length; i++) {
              if (cancelled) return;
              setTyping(line.s.slice(0, i));
              await wait(18 + Math.random() * 30);
            }
            await wait(260);
            setTyping("");
            setLines((L) => [...L.slice(-60), { kind: "cmd", text: line.s }]);
          } else {
            const parts = line.s.split("\n");
            for (const p of parts) {
              if (cancelled) return;
              setLines((L) => [...L.slice(-60), { kind: line.t, text: p }]);
              await wait(line.t === "out" ? 60 : 140);
            }
            await wait(180 + Math.random() * 240);
          }
        }
        await wait(2600);
        if (cancelled) return;
        setLines([]);
      }
    }
    run();
    return () => {
      cancelled = true;
      alive.current = false;
    };
  }, [script]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, typing]);

  return (
    <div className="rounded-2xl overflow-hidden border border-emerald-400/20 bg-[#050807] shadow-[0_0_50px_-15px_rgba(52,211,153,.3)]">
      {/* title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#0a120e] to-[#07110c] border-b border-emerald-400/15">
        <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
        <div className="ml-2 flex items-center gap-1.5 text-[11px] font-mono text-emerald-300/80">
          <TermIcon size={12} />
          <span>{script.host}:{script.dir}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-emerald-500/60">
          <CircleDot size={10} className="animate-pulse" />
          <span>replay</span>
        </div>
      </div>
      {/* body */}
      <div ref={bodyRef} className="h-64 overflow-y-auto px-4 py-3 font-mono text-[11.5px] leading-[1.55] no-scrollbar">
        {lines.map((l, i) =>
          l.kind === "cmd" ? (
            <div key={i} className="mt-1.5">
              <div className="text-cyan-400/90">{PROMPT}-[{script.dir}]</div>
              <div>
                <span className="text-emerald-400">{PROMPT2}</span>
                <span className={colorFor("cmd")}>{l.text}</span>
              </div>
            </div>
          ) : (
            <div key={i} className={colorFor(l.kind)}>
              {l.text}
            </div>
          )
        )}
        <div>
          <span className="text-emerald-400">{PROMPT2}</span>
          <span className="text-slate-100">{typing}</span>
          <span className="term-caret" />
        </div>
      </div>
      {/* footer */}
      <div className="px-4 py-2 border-t border-emerald-400/10 bg-black/40 flex items-center justify-between gap-3">
        <span className="text-[10px] font-mono text-emerald-500/70 truncate">{label}</span>
        <span className="hidden sm:block text-[10px] font-mono text-slate-500 truncate">{note}</span>
      </div>
    </div>
  );
};
