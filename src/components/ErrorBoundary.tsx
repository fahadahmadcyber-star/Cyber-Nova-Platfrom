import React from "react";

interface Props {
  children: React.ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Global safety net: if ANY component throws during render (which would
 * otherwise leave a blank black screen), this catches it and shows a readable
 * error + quick recovery — including the most common real-world cause,
 * a conflicting browser extension.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[cybernova] Render crash caught by ErrorBoundary:", error, info);
  }

  reload = () => window.location.reload();

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6">
          <div className="max-w-lg w-full rounded-3xl border border-rose-400/30 bg-rose-400/5 p-7 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-rose-400/15 text-rose-300 text-3xl font-black">
              !
            </div>
            <h1 className="mt-4 text-xl font-black text-white">কিছুটা সমস্যা হয়েছে</h1>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              সাইন-আপ/নেভিগেশনের সময় একটি DOM এরর ধরা পড়েছে। এটি সাধারণত
              <b className="text-slate-200"> ব্রাউজার এক্সটেনশন</b> (Translate / Grammarly /
              Ad-blocker) React-এর render-এর মাঝখানে হস্তক্ষেপ করলে হয় — অ্যাপের
              কোড নয়।
            </p>

            <div className="mt-4 rounded-xl bg-black/40 border border-white/10 p-3 text-left">
              <pre className="max-h-28 overflow-auto text-xs text-rose-200 font-mono whitespace-pre-wrap break-words">
                {this.state.error?.message || "Unknown error"}
              </pre>
            </div>

            <div className="mt-4 text-left rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-slate-300 leading-relaxed">
              <b className="text-cyan-200">২টি দ্রুত সমাধান:</b>
              <ul className="mt-2 space-y-1.5 list-disc list-inside text-slate-400">
                <li><b className="text-slate-200">Incognito mode</b>-এ খুলুন — এতে এক্সটেনশন বন্ধ থাকে, সাইন-আপ ঠিক করলে দোষী একটা এক্সটেনশন।</li>
                <li>
                  <b className="text-slate-200">chrome://extensions</b> → সব এক্সটেনশন
                  OFF করে দেখুন; তারপর একে একে ON করে যেটা সমস্যা ফেরাচ্ছে খুঁজে বের করুন।
                </li>
              </ul>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.reload}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_30px_rgba(34,211,238,.5)] active:scale-[0.97] transition-all cursor-pointer"
              >
                ↻ Reload App
              </button>
            </div>
            <p className="mt-3 text-[11px] text-slate-500">
              Chrome: <b>Ctrl + Shift + N</b> · Edge: <b>Ctrl + Shift + N</b> (Incognito/Private)
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
