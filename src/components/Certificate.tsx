import React, { useRef, useState } from "react";
// "pro" fork — the original html2canvas cannot parse Tailwind v4's modern
// oklch()/oklab() color functions and throws during export. This fork can.
import html2canvas from "html2canvas-pro";
import { LogoMark } from "./Logo";
import { useStore, Certificate as CertType } from "../store";
import { Download, QrCode, Award, Loader2 } from "lucide-react";

/**
 * PROFESSIONAL CERTIFICATE
 * - Gold double-frame, ornamental corners, embossed seal, founder signature
 * - Unique Certificate ID + verification QR code
 * - Scanning the QR opens the Cyber Nova production site DIRECTLY —
 *   no third-party or preview middle link in between.
 * - Download produces a real PDF file straight to the device (no browser tab).
 */

/* ── Your main production domain. Edit only this line if it changes. ── */
const CYBER_NOVA_SITE_URL = "https://cybernova-academy.vercel.app";

/**
 * Preview / sandbox hosts (arena.site, localhost, etc.) must never leak into
 * the QR — always resolve to the real production domain there.
 */
function resolveSiteUrl(): string {
  if (typeof window === "undefined") return CYBER_NOVA_SITE_URL;
  const origin = window.location.origin;
  const isPreview =
    !origin ||
    /arena\.site|localhost|127\.0\.0\.1|0\.0\.0\.0/.test(origin);
  return isPreview ? CYBER_NOVA_SITE_URL : origin;
}

const QR_API = (data: string, size = 260, bg = "0b1226", color = "facc15") =>
  `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&bgcolor=${bg}&color=${color}&margin=6&data=${encodeURIComponent(data)}`;

export const Certificate: React.FC<{ cert: CertType; isBn?: boolean }> = ({ cert, isBn = true }) => {
  const { user, toast } = useStore();
  const sheetRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = useState(false);

  const siteUrl = resolveSiteUrl();
  const verifyUrl = `${siteUrl}?verify=${cert.id}`;
  const qrSrc = QR_API(verifyUrl, 260);

  const date = new Date(cert.earnedAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const L = (en: string, bn: string) => (isBn ? bn : en);
  const displayName = user?.name || cert.name || "Learner";
  const courseTitle = isBn ? cert.courseTitleBn || cert.courseTitle : cert.courseTitle;

  /* ── Direct image download ─────────────────────────────────────────────
     No PDF, no browser tab, no preview — the certificate is rasterised and
     saved straight to the device's Downloads folder as a crisp PNG.
     PNG via the download attribute is the most reliable cross-device
     trigger (works on Android, iOS, Windows, macOS browsers).           */
  const download = async () => {
    const node = sheetRef.current;
    if (!node || generating) return;
    setGenerating(true);

    // Prepare the anchor BEFORE any async work so the click stays inside
    // the user's tap gesture (some mobile browsers block delayed clicks).
    const a = document.createElement("a");
    a.download = `CyberNova_Certificate_${cert.id}.png`;
    a.rel = "noopener";

    try {
      // Make sure web fonts AND the remote QR image are fully decoded
      // before rasterising, otherwise the file comes out with blank pieces.
      await Promise.all([
        (document as any).fonts?.ready ?? Promise.resolve(),
        ...Array.from(node.querySelectorAll("img")).map(
          (img) =>
            img.complete && img.naturalWidth > 0
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  img.onload = () => resolve();
                  img.onerror = () => resolve(); // never block the export
                })
        ),
      ]);

      const canvas = await html2canvas(node, {
        backgroundColor: "#070b18",
        scale: 2.5,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 8000,
      });

      // Prefer Blob (smaller, faster); fall back to data-URL if unavailable.
      const trigger = (href: string) => {
        a.href = href;
        document.body.appendChild(a);
        a.click();
        a.remove();
      };

      if (typeof canvas.toBlob === "function") {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              trigger(url);
              window.setTimeout(() => URL.revokeObjectURL(url), 4000);
            } else {
              trigger(canvas.toDataURL("image/png"));
            }
          },
          "image/png"
        );
      } else {
        trigger(canvas.toDataURL("image/png"));
      }

      toast(L("Certificate saved to your device", "সার্টিফিকেট ডিভাইসে সেভ হয়েছে"), "xp");
    } catch (err) {
      console.error("[cybernova] certificate export failed:", err);
      toast(L("Download failed — try again", "ডাউনলোড ব্যর্থ — আবার চেষ্টা করো"), "warn");
    } finally {
      setGenerating(false);
    }
  };

  return (
    /* Outer wrapper: centres the card and caps its width so it never bleeds
       edge-to-edge on mobile. max-w-sm keeps it a neat card on small screens. */
    <div className="flex flex-col items-center gap-3 w-full">

      {/* ── Certificate card (captured by html2canvas) ── */}
      <div
        ref={sheetRef}
        className="relative overflow-hidden rounded-2xl border border-yellow-500/30
                   bg-gradient-to-br from-slate-900 via-[#0a1428] to-slate-950
                   shadow-[0_12px_40px_-12px_rgba(250,204,21,.3)]
                   w-full max-w-sm mx-auto"
      >
        {/* decorative inner frames */}
        <div className="absolute inset-2 rounded-xl border border-yellow-500/35 pointer-events-none" />
        <div className="absolute inset-[10px] rounded-[10px] border border-yellow-500/15 pointer-events-none" />

        {/* corner ornaments — scaled for compact card */}
        {[
          "top-0.5 left-0.5 rounded-tl-xl",
          "top-0.5 right-0.5 rounded-tr-xl",
          "bottom-0.5 left-0.5 rounded-bl-xl",
          "bottom-0.5 right-0.5 rounded-br-xl",
        ].map((pos, i) => (
          <div
            key={i}
            className={`absolute w-5 h-5 border-yellow-500/70 pointer-events-none ${pos}`}
            style={{
              borderTopWidth: i < 2 ? 2 : 0,
              borderBottomWidth: i >= 2 ? 2 : 0,
              borderLeftWidth: i % 2 === 0 ? 2 : 0,
              borderRightWidth: i % 2 === 1 ? 2 : 0,
            }}
          />
        ))}

        {/* ambient glow */}
        <div className="absolute -top-16 -right-10 w-40 h-40 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-10 w-40 h-40 rounded-full bg-cyan-500/8 blur-3xl pointer-events-none" />

        {/* ── Card content ── */}
        <div className="relative p-4">

          {/* Brand header */}
          <div className="flex flex-col items-center text-center">
            <LogoMark size={36} />
            <div className="mt-1.5 text-[10px] font-black tracking-[0.35em] text-yellow-300">CYBER NOVA</div>
            <div className="text-[7px] tracking-[0.4em] text-cyan-200/50">SECURITY ACADEMY</div>
            <div
              className="mt-2.5 font-black text-[17px] leading-tight text-yellow-200"
              style={{ fontFamily: "Segoe Script, Brush Script MT, cursive" }}
            >
              Certificate of Completion
            </div>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-yellow-500/50 bg-yellow-400/10 px-3 py-0.5 text-[7px] font-bold uppercase tracking-[0.25em] text-yellow-200">
              <Award size={9} /> {L("Official Credential", "অফিসিয়াল সনদপত্র")}
            </span>
          </div>

          {/* Recipient */}
          <div className="mt-3.5 text-center">
            <div className="text-[8px] tracking-[0.25em] text-slate-400 uppercase">
              {L("Proudly Presented To", "গর্বের সাথে প্রদান করা হলো")}
            </div>
            <div className="mt-1 inline-block px-4 pb-0.5 text-xl font-black text-white border-b border-yellow-500/60 leading-tight">
              {displayName}
            </div>
            <p className="mx-auto mt-2 text-[10px] leading-relaxed text-slate-300/80 max-w-[220px]">
              {L("for completing all missions in", "সম্পূর্ণ মিশন শেষ করার জন্য —")}{" "}
              <span className="font-bold text-amber-300">{courseTitle}</span>
            </p>
            {(cert.location || cert.education) && (
              <div className="mt-1 text-[8px] text-slate-500">
                {[cert.location, cert.education].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>

          {/* Bottom row: sig · seal · QR — horizontal on compact card */}
          <div className="mt-4 flex items-end justify-between gap-2">
            {/* Signature */}
            <div className="text-center flex-1">
              <div
                className="text-yellow-200/85 text-[13px]"
                style={{ fontFamily: "Segoe Script, Brush Script MT, cursive" }}
              >
                Fahad Ahmad
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-yellow-500/60 to-transparent my-1" />
              <div className="text-[6px] uppercase tracking-[0.2em] text-slate-400">FOUNDER &amp; CEO</div>
            </div>

            {/* Seal */}
            <div className="flex flex-col items-center flex-1">
              <div className="relative w-14 h-14 rounded-full border-2 border-yellow-500/65 grid place-items-center shadow-[0_0_20px_rgba(250,204,21,.2)]">
                <div className="text-center">
                  <div className="text-[5px] tracking-[0.25em] text-yellow-300">OFFICIAL</div>
                  <div className="text-[15px] font-black text-yellow-200 leading-none">NR</div>
                  <div className="text-[5px] tracking-[0.25em] text-yellow-300">SEAL</div>
                </div>
                <div className="absolute inset-1.5 rounded-full border border-yellow-500/25 pointer-events-none" />
              </div>
              <div className="mt-1 text-[6px] uppercase tracking-[0.2em] text-slate-400">Nova Registry</div>
              <div className="text-[6px] text-slate-500 font-mono">ID: {cert.id.slice(0, 7)}</div>
              <div className="text-[6px] text-slate-500">{date}</div>
            </div>

            {/* QR */}
            <div className="flex flex-col items-center flex-1">
              <div className="rounded-lg border border-yellow-500/45 bg-[#0b1226] p-1 shadow-[0_0_14px_rgba(250,204,21,.12)]">
                <img
                  src={qrSrc}
                  alt="verification qr"
                  className="w-[52px] h-[52px] rounded"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="mt-1 flex items-center gap-0.5 text-[6px] uppercase tracking-[0.2em] text-yellow-200/80">
                <QrCode size={8} /> {L("Scan", "স্ক্যান")}
              </div>
            </div>
          </div>

        </div>{/* /card content */}
      </div>{/* /sheetRef */}

      {/* Download button — outside the card so it never appears in the saved image */}
      <button
        onClick={download}
        disabled={generating}
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black
                   text-slate-950 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
                   hover:shadow-[0_0_28px_rgba(250,204,21,.45)] active:scale-[0.97]
                   transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
      >
        {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
        {generating ? L("Preparing…", "তৈরি হচ্ছে…") : L("Download Certificate", "সার্টিফিকেট ডাউনলোড")}
      </button>

    </div>
  );
};
