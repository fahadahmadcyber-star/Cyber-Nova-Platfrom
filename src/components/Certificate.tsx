import React, { useRef, useState } from "react";
// "pro" fork — the original html2canvas cannot parse Tailwind v4's modern
// oklch()/oklab() color functions and throws during export. This fork can.
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { LogoMark } from "./Logo";
import { useStore, Certificate as CertType } from "../store";
import { Download, QrCode, Award, Loader2, FileImage, FileText } from "lucide-react";

/**
 * PROFESSIONAL CERTIFICATE
 * - Gold double-frame, ornamental corners, embossed seal, founder signature
 * - Unique Certificate ID + QR code that opens the live platform directly
 * - Download PDF prints as a white-background black-text document for physical printing
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
  const qrTarget = siteUrl;
  const qrSrc = QR_API(qrTarget, 260, "0b1226", "facc15");

  const date = new Date(cert.earnedAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const L = (en: string, bn: string) => (isBn ? bn : en);
  const displayName = user?.name || cert.name || "Learner";
  const courseTitle = isBn ? cert.courseTitleBn || cert.courseTitle : cert.courseTitle;

  const captureCard = async () => {
    const node = sheetRef.current;
    if (!node) throw new Error("certificate node missing");

    await Promise.all([
      (document as any).fonts?.ready ?? Promise.resolve(),
      ...Array.from(node.querySelectorAll("img")).map(
        (img) =>
          img.complete && img.naturalWidth > 0
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
              })
      ),
    ]);

    return html2canvas(node, {
      backgroundColor: "#070b18",
      scale: 2.5,
      useCORS: true,
      allowTaint: false,
      logging: false,
      imageTimeout: 8000,
    });
  };

  const triggerDownload = (href: string, filename: string) => {
    const a = document.createElement("a");
    a.href = href;
    a.download = filename;
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const downloadPNG = async () => {
    const node = sheetRef.current;
    if (!node || generating) return;
    setGenerating(true);

    try {
      const canvas = await captureCard();
      if (typeof canvas.toBlob === "function") {
        canvas.toBlob((blob) => {
          if (!blob) {
            triggerDownload(canvas.toDataURL("image/png"), `CyberNova_Certificate_${cert.id}.png`);
            return;
          }
          const url = URL.createObjectURL(blob);
          triggerDownload(url, `CyberNova_Certificate_${cert.id}.png`);
          window.setTimeout(() => URL.revokeObjectURL(url), 4000);
        }, "image/png");
      } else {
        triggerDownload(canvas.toDataURL("image/png"), `CyberNova_Certificate_${cert.id}.png`);
      }

      toast(L("Certificate saved to your device", "সার্টিফিকেট ডিভাইসে সেভ হয়েছে"), "xp");
    } catch (err) {
      console.error("[cybernova] png export failed:", err);
      toast(L("Download failed — try again", "ডাউনলোড ব্যর্থ — আবার চেষ্টা করো"), "warn");
    } finally {
      setGenerating(false);
    }
  };

  const downloadPDF = async () => {
    const node = sheetRef.current;
    if (!node || generating) return;
    setGenerating(true);

    try {
      const canvas = await captureCard();
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 26;
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const usableHeight = pageHeight - margin * 2;
      const finalHeight = Math.min(imgHeight, usableHeight);
      const finalWidth = (canvas.width * finalHeight) / canvas.height;

      pdf.addImage(imgData, "PNG", (pageWidth - finalWidth) / 2, margin, finalWidth, finalHeight);
      pdf.save(`CyberNova_Certificate_${cert.id}.pdf`);

      toast(L("PDF downloaded in certificate style", "পিডিএফ ডাউনলোড হয়েছে সার্টিফিকেট স্টাইলে"), "xp");
    } catch (err) {
      console.error("[cybernova] pdf export failed:", err);
      toast(L("PDF export failed — try again", "পিডিএফ এক্সপোর্ট ব্যর্থ — আবার চেষ্টা করো"), "warn");
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
        className="relative overflow-hidden rounded-[26px] border border-yellow-500/35
                   bg-[radial-gradient(circle_at_top,_rgba(250,204,21,0.18),_transparent_34%),linear-gradient(135deg,#020817,#0b1325_45%,#101827)]
                   shadow-[0_30px_70px_-25px_rgba(250,204,21,0.35)]
                   w-full max-w-sm mx-auto"
      >
        {/* decorative inner frames */}
        <div className="absolute inset-2 rounded-[20px] border border-yellow-500/35 pointer-events-none" />
        <div className="absolute inset-[12px] rounded-[18px] border border-yellow-500/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(250,204,21,0.06)_50%,transparent_100%)] pointer-events-none" />

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
            <div className="rounded-full border border-yellow-500/40 bg-yellow-400/8 p-2 shadow-[0_0_30px_rgba(250,204,21,0.18)]">
              <LogoMark size={36} />
            </div>
            <div className="mt-2 text-[10px] font-black tracking-[0.35em] text-yellow-300">CYBER NOVA</div>
            <div className="text-[7px] tracking-[0.45em] text-cyan-200/60">SECURITY ACADEMY</div>
            <div
              className="mt-3 font-black text-[17px] leading-tight text-yellow-200"
              style={{ fontFamily: "Segoe Script, Brush Script MT, cursive" }}
            >
              Certificate of Completion
            </div>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-yellow-500/50 bg-yellow-400/10 px-3 py-1 text-[7px] font-bold uppercase tracking-[0.25em] text-yellow-200">
              <Award size={9} /> {L("Official Credential", "অফিসিয়াল সনদপত্র")}
            </span>
          </div>

          {/* Recipient */}
          <div className="mt-4 text-center">
            <div className="text-[8px] tracking-[0.25em] text-slate-400 uppercase">
              {L("Proudly Presented To", "গর্বের সাথে প্রদান করা হলো")}
            </div>
            <div className="mt-2 inline-flex max-w-[200px] items-center justify-center rounded-full border border-yellow-500/30 bg-white/3 px-4 py-1.5 text-xl font-black text-white leading-tight shadow-[0_0_20px_rgba(250,204,21,0.08)]">
              {displayName}
            </div>
            <p className="mx-auto mt-2 text-[10px] leading-relaxed text-slate-300/80 max-w-[220px]">
              {L("for successfully completing the program and demonstrating mastery in", "প্রোগ্রাম সফলভাবে শেষ করার এবং দক্ষতা প্রদর্শনের জন্য —")} <span className="font-bold text-amber-300">{courseTitle}</span>
            </p>
            {(cert.location || cert.education) && (
              <div className="mt-1.5 text-[8px] text-slate-500">
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
              <div className="relative w-14 h-14 rounded-full border-2 border-yellow-500/70 grid place-items-center shadow-[0_0_22px_rgba(250,204,21,.2)] bg-[radial-gradient(circle,_rgba(250,204,21,0.12),_transparent_65%)]">
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
              <div className="rounded-[10px] border border-yellow-500/45 bg-[#0b1226] p-1.5 shadow-[0_0_18px_rgba(250,204,21,.14)]">
                <img
                  src={qrSrc}
                  alt="verification qr"
                  className="w-[52px] h-[52px] rounded-[6px]"
                  loading="lazy"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="mt-1.5 flex items-center gap-0.5 text-[6px] uppercase tracking-[0.22em] text-yellow-200/80">
                <QrCode size={8} /> {L("Verify Authenticity", "সত্যতা যাচাই করুন")}
              </div>
            </div>
          </div>

        </div>{/* /card content */}
      </div>{/* /sheetRef */}

      <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
        <button
          onClick={downloadPNG}
          disabled={generating}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[11px] font-black
                     text-slate-950 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500
                     hover:shadow-[0_0_28px_rgba(250,204,21,.45)] active:scale-[0.97]
                     transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          {generating ? <Loader2 size={14} className="animate-spin" /> : <FileImage size={14} />}
          {generating ? L("Preparing…", "তৈরি হচ্ছে…") : L("Download PNG", "PNG ডাউনলোড")}
        </button>

        <button
          onClick={downloadPDF}
          disabled={generating}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 px-4 py-2.5 text-[11px] font-black text-cyan-100
                     hover:bg-cyan-500/15 active:scale-[0.97] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
        >
          {generating ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
          {L("Download PDF", "PDF ডাউনলোড")}
        </button>
      </div>

    </div>
  );
};
