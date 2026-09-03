import React, { useState } from "react";
import {
  Power, Mail, KeyRound, User as UserIcon, LogIn, Loader2, AlertTriangle,
  Sparkles,
} from "lucide-react";
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile,
  signInWithPopup, signOut,
} from "firebase/auth";
import { auth, fbErrorMessage, googleProvider, isFirebaseConfigured } from "../firebase";
import { useStore, isAdminCredentials } from "../store";
import { Logo } from "./Logo";
import { getUserProfile, saveUserToFirestore } from "../lib/firebaseAdmin";

export const Login: React.FC = () => {
  const { t, isBn, login, toast } = useStore();
  const [on, setOn] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);
  const [authBusy, setAuthBusy] = useState(false);
  const [formError, setFormError] = useState("");
  const [err, setErr] = useState(false);

  /* ---------- finalize local session (keeps app state active) ---------- */
  const enter = (n: string, e: string, isAdmin: boolean, avatarUrl: string = "", uid?: string) => {
    setBusy(true);
    setTimeout(() => {
      if (uid) {
        void saveUserToFirestore({ id: uid, name: n, email: e, avatarUrl, joinedAt: Date.now(), role: isAdmin ? "admin" : "user" });
      }
      login(
        { uid, name: n, email: e, avatarUrl, joinedAt: Date.now(), role: isAdmin ? "admin" : "user" },
        { view: isAdmin ? "admin" : "home" }
      );
      toast(
        isBn
          ? isAdmin
            ? "ওনার প্যানেল আনলকড — স্বাগতম!"
            : "ড্যাশবোর্ড আনলকড — স্বাগতম!"
          : isAdmin
          ? "Owner panel unlocked — welcome!"
          : "Dashboard unlocked — welcome!",
        "xp"
      );
      setBusy(false);
    }, 700);
  };

  const displayFromEmail = (em: string) =>
    em.split("@")[0].replace(/[^a-z0-9_ -]/gi, "") || "Operative";

  /* ---------- One-Click Guest Demo Access (autofill only) ---------- */
  const demo = () => {
    setOn(true);
    setMode("login");
    setEmail("demo@cybernova.com");
    setPass("demo123");
    setFormError("");
    toast(t("demoAutofill"), "xp");
  };

  /* ---------- Email & Password Authentication ---------- */
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setFormError("");

    const trimmedEmail = email.trim();
    const trimmedName = name.trim();

    // Basic field-level validation FIRST — surface clear messages.
    if (!trimmedEmail || !pass || (mode === "signup" && !trimmedName)) {
      setErr(true);
      setTimeout(() => setErr(false), 600);
      setFormError(
        isBn
          ? "সব ঘর পূরণ করো — ইমেইল, পাসওয়ার্ড" + (mode === "signup" ? " এবং নাম" : "")
          : "Please fill every field — email, password" + (mode === "signup" ? " and name" : "")
      );
      return;
    }
    if (mode === "signup" && pass.length < 6) {
      setErr(true);
      setTimeout(() => setErr(false), 600);
      setFormError(
        isBn
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।"
          : "Password must be at least 6 characters long."
      );
      return;
    }

    const cleanEmail = trimmedEmail.toLowerCase();

    // 1) Demo Account Fast-Track (local demo — never touches Firebase)
    if (cleanEmail === "demo@cybernova.com") {
      enter(isBn ? "নোভা ক্যাডেট" : "Nova Cadet", "demo@cybernova.com", false);
      return;
    }

    // 2) Owner Credential Check
    const isOwner = isAdminCredentials(trimmedEmail, pass).ok;

    // 3) Guard — reject empty auth handle
    if (!auth || !isFirebaseConfigured) {
      setFormError(
        isBn ? "Firebase API key সেট করা হয়নি।" : "Firebase API key is not configured."
      );
      setErr(true);
      setTimeout(() => setErr(false), 650);
      return;
    }

    setAuthBusy(true);
    try {
      if (mode === "signup") {
        // Owner email is reserved
        if (isAdminCredentials(trimmedEmail, pass).emailOk) {
          setFormError(
            isBn
              ? "এই ইমেইলটি ওনার অ্যাকাউন্টের জন্য সংরক্ষিত। সাইন ইন করো।"
              : "This email is reserved for the owner account. Please sign in."
          );
          setErr(true);
          setTimeout(() => setErr(false), 600);
          return;
        }

        // ✅ CORRECT REGISTRATION CALL — createUserWithEmailAndPassword(auth, email, password)
        const cred = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
        // Attach the display name to the Firebase user profile (optional).
        if (cred.user && trimmedName) {
          try {
            await updateProfile(cred.user, { displayName: trimmedName });
          } catch (nameErr) {
            // Non-fatal: log but proceed.
            console.warn("[cybernova] display name update skipped:", nameErr);
          }
        }
        enter(trimmedName || displayFromEmail(trimmedEmail), trimmedEmail, false, "", cred.user.uid);
        return;
      }

      // ✅ Sign In path
      let signInCred;
      try {
        signInCred = await signInWithEmailAndPassword(auth, trimmedEmail, pass);
      } catch (signInError: any) {
        // The owner credentials may predate the Firebase Auth account. Provision
        // that one account so the admin session has a real Firebase identity.
        if (
          isOwner &&
          (signInError?.code === "auth/user-not-found" ||
            signInError?.code === "auth/invalid-credential")
        ) {
          try {
            signInCred = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
          } catch (provisionError: any) {
            // An existing account with a different password must remain a normal
            // authentication failure; never replace it or silently bypass Auth.
            throw provisionError?.code === "auth/email-already-in-use"
              ? signInError
              : provisionError;
          }
        } else {
          throw signInError;
        }
      }
      const storedProfile = await getUserProfile(signInCred.user.uid);
      const firebaseIsAdmin =
        signInCred.user.email?.toLowerCase() === "fahadahmad.cyber@gmail.com" ||
        storedProfile?.role === "admin";
      if (storedProfile?.status === "disabled") {
        await signOut(auth);
        setFormError(isBn ? "এই অ্যাকাউন্টটি অ্যাডমিন নিষ্ক্রিয় করেছেন।" : "This account has been disabled by an administrator.");
        setErr(true);
        setTimeout(() => setErr(false), 650);
        return;
      }
      enter(
        firebaseIsAdmin
          ? "Owner Admin"
          : signInCred.user.displayName?.trim() || displayFromEmail(trimmedEmail),
        trimmedEmail,
        firebaseIsAdmin,
        "",
        signInCred.user.uid
      );
    } catch (e: any) {
      // Extract the EXACT Firebase error — never throw a generic failure.
      const code: string = e?.code || "";
      const message: string = e?.message || String(e);
      // Log full error object to console for debugging.
      console.error("[cybernova] Firebase auth error:", { code, message, error: e });

      setFormError(fbErrorMessage(code, isBn, message));
      setErr(true);
      setTimeout(() => setErr(false), 650);
    } finally {
      setAuthBusy(false);
    }
  };

  const loading = busy || authBusy;

  /* ---------- Google popup authentication ---------- */
  const signInWithGoogle = async () => {
    if (loading) return;
    setFormError("");
    if (!auth || !isFirebaseConfigured) {
      setFormError(isBn ? "Firebase API key সেট করা হয়নি।" : "Firebase API key is not configured.");
      return;
    }
    setAuthBusy(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const googleUser = result.user;
      const googleEmail = googleUser.email?.trim() || "";
      const googleName = googleUser.displayName?.trim() || displayFromEmail(googleEmail);
      const storedProfile = await getUserProfile(googleUser.uid);
      const firebaseIsAdmin =
        googleEmail.toLowerCase() === "fahadahmad.cyber@gmail.com" ||
        storedProfile?.role === "admin";
      if (storedProfile?.status === "disabled") {
        await signOut(auth);
        setFormError(isBn ? "এই অ্যাকাউন্টটি অ্যাডমিন নিষ্ক্রিয় করেছেন।" : "This account has been disabled by an administrator.");
        return;
      }
      enter(googleName, googleEmail, firebaseIsAdmin, googleUser.photoURL || "", googleUser.uid);
    } catch (e: any) {
      const code = e?.code || "";
      const message = e?.message || String(e);
      console.error("[cybernova] Google auth error:", { code, message, error: e });
      setFormError(fbErrorMessage(code, isBn, message));
      setErr(true);
      setTimeout(() => setErr(false), 650);
    } finally {
      setAuthBusy(false);
    }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden ${isBn ? "bn-mode" : ""}`}>
      {/* dark room overlay */}
      <div className={`room-overlay absolute inset-0 z-[5] pointer-events-none ${on ? "bg-black/0" : "bg-black/80"}`} />
      {/* ambient background */}
      <div className="absolute inset-0 grid-bg" />
      <div className={`absolute -top-32 left-1/4 w-[520px] h-[520px] rounded-full blur-[140px] transition-all duration-1000 ${on ? "bg-cyan-500/25" : "bg-cyan-500/5"}`} />
      <div className={`absolute bottom-0 right-0 w-[420px] h-[420px] rounded-full blur-[140px] transition-all duration-1000 ${on ? "bg-emerald-500/20" : "bg-emerald-500/5"}`} />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 min-h-screen grid lg:grid-cols-2 gap-6 lg:gap-10 items-center py-10">
        {/* ---- lamp scene ---- */}
        <div className="relative h-[46vh] sm:h-[54vh] lg:h-[76vh] order-1">
          <div className={`light-cone absolute left-1/2 -translate-x-1/2 top-[34%] w-[min(78vw,430px)] h-[62%] ${on ? "opacity-100" : "opacity-0"}`} />
          <div className="lamp-swing absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
            <div className="w-[3px] h-[16vh] min-h-[110px] bg-gradient-to-b from-slate-700 via-slate-600 to-slate-500" />
            <div className="w-4 h-4 rounded-full bg-slate-500 border border-slate-400/50 -mt-1" />
            <div
              className={`relative mt-1 w-40 sm:w-48 h-20 sm:h-24 transition-all duration-1000 ${
                on ? "drop-shadow-[0_0_35px_rgba(34,211,238,.45)]" : ""
              }`}
              style={{
                clipPath: "polygon(26% 0, 74% 0, 100% 100%, 0 100%)",
                background: on
                  ? "linear-gradient(180deg,#155e75 0%,#164e63 55%,#083344 100%)"
                  : "linear-gradient(180deg,#1e293b 0%,#0f172a 70%,#0b1120 100%)",
              }}
            >
              <div className="absolute inset-x-6 top-2 h-1.5 rounded-full bg-white/10" />
            </div>
            <div className={`-mt-3 w-11 h-11 rounded-full transition-all duration-700 ${on ? "bulb-on animate-flicker" : "bulb-off"}`} />
          </div>
          <div
            className={`absolute left-1/2 -translate-x-1/2 bottom-2 w-[min(70vw,380px)] h-24 rounded-[50%] blur-2xl transition-all duration-1000 ${
              on ? "bg-cyan-400/25" : "bg-transparent"
            }`}
          />
          <div className="absolute right-2 sm:right-8 top-[38%] flex flex-col items-center gap-3 select-none">
            <div
              className={`text-[10px] font-bold tracking-[0.3em] uppercase transition-colors duration-700 ${
                on ? "text-cyan-300 text-glow-cyan" : "text-slate-500"
              }`}
              style={{ fontFamily: isBn ? "inherit" : "var(--font-display)" }}
            >
              {on ? t("lampOn") : t("lampOff")}
            </div>
            <button
              aria-label="lamp switch"
              onClick={() => setOn(!on)}
              className={`relative w-14 h-24 rounded-2xl border transition-all duration-500 cursor-pointer ${
                on
                  ? "border-cyan-300/70 bg-cyan-400/15 shadow-[0_0_35px_rgba(34,211,238,.55)]"
                  : "border-slate-600 bg-slate-900/80 hover:border-slate-500"
              }`}
            >
              <span
                className={`absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full transition-all duration-500 grid place-items-center ${
                  on
                    ? "top-2 bg-gradient-to-br from-cyan-300 to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,.9)]"
                    : "bottom-2 bg-slate-700"
                }`}
              >
                <Power size={15} className={on ? "text-slate-950" : "text-slate-400"} />
              </span>
            </button>
            <div className={`text-[11px] transition-opacity duration-700 ${on ? "opacity-0" : "opacity-70 text-slate-400 animate-pulse"}`}>
              {t("switchLabel")}
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center w-full px-6">
            <div className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase" style={{ fontFamily: isBn ? "inherit" : "var(--font-display)" }}>
              {t("lampTitle")}
            </div>
            {!on && <p className="mt-2 text-xs text-slate-500 max-w-xs mx-auto">{t("lampHint")}</p>}
          </div>
        </div>

        {/* ---- login card ---- */}
        <div
          className={`order-2 w-full max-w-md mx-auto transition-all duration-1000 ${
            on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
        >
          <div className="glass-strong rounded-3xl p-6 sm:p-8 scanlines relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-52 h-52 rounded-full bg-cyan-500/15 blur-3xl" />
            {/* logo */}
            <div className="flex items-center justify-center">
              <Logo size={46} />
            </div>

            {/* golden signature slogan */}
            <h1 className="mt-5 text-2xl sm:text-[1.7rem] font-black tracking-tight leading-tight text-center">
              {isBn ? (
                <>
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]">
                    লগইন করো। কোড ভাঙো।
                  </span>
                  <br />
                  <span className="text-slate-100">ডিজিটাল মহাবিশ্ব সুরক্ষিত করো।</span>
                </>
              ) : (
                <>
                  <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(245,158,11,0.35)]">
                    Log In. Break the Code.
                  </span>
                  <br />
                  <span className="text-slate-100">Secure the Digital Universe.</span>
                </>
              )}
            </h1>

            <div className="mt-5 text-center">
              <h2 className="text-xl font-bold">{mode === "login" ? t("welcomeBack") : t("createAccount")}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{t("loginSub")}</p>
            </div>

            <form onSubmit={submit} className={`mt-5 space-y-3.5 ${err ? "anim-shake" : ""}`}>
              {mode === "signup" && (
                <label className="block">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                    <UserIcon size={12} className="text-cyan-300" /> {t("nameLabel")}
                  </span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none px-4 py-2.5 text-sm transition-all"
                    placeholder="night_owl"
                  />
                </label>
              )}
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <Mail size={12} className="text-cyan-300" /> {t("emailLabel")}
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none px-4 py-2.5 text-sm transition-all"
                  placeholder="you@grid.io"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                  <KeyRound size={12} className="text-cyan-300" /> {t("passLabel")}
                </span>
                <input
                  type="password"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full rounded-xl bg-white/5 border border-white/10 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/20 outline-none px-4 py-2.5 text-sm transition-all"
                  placeholder="••••••••"
                />
              </label>

              {/* Clean error surface */}
              {formError && (
                <div className="flex items-start gap-2 rounded-xl border border-rose-400/40 bg-rose-400/10 px-3.5 py-2.5 text-xs leading-relaxed text-rose-200 anim-fade-up">
                  <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 rounded-xl py-3 font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:shadow-[0_0_35px_rgba(34,211,238,.5)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              >
                {authBusy || busy ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                {authBusy
                  ? (isBn ? "সাইন আপ হচ্ছে…" : "Creating account…")
                  : busy
                  ? t("signingIn")
                  : mode === "login"
                  ? t("signIn")
                  : t("createAccount")}
              </button>
            </form>

            {/* Official Firebase Google sign-in */}
            <div className="mt-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                {isBn ? "অথবা" : "OR"}
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/10" />
            </div>

            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={loading}
              className="mt-4 w-full group relative overflow-hidden rounded-xl border border-white/20 bg-slate-950/70 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(34,211,238,.12)] transition-all hover:border-cyan-400/50 hover:bg-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-white/5 to-emerald-400/0 opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="relative flex items-center justify-center gap-2.5">
                {authBusy ? (
                  <Loader2 size={18} className="animate-spin text-cyan-300" />
                ) : (
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-white">
                    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09A6.98 6.98 0 015.47 12c0-.72.13-1.42.36-2.09V7.07H2.18A11 11 0 001 12c0 1.78.43 3.45 1.18 4.93l3.66-2.84z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                  </span>
                )}
                <span>Sign in with Google</span>
              </span>
            </button>

            {/* ── One-Click Guest Demo (autofill only) ── */}
            <div className="mt-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-white/10" />
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                {isBn ? "দ্রুত প্রবেশ" : "QUICK ACCESS"}
              </span>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent via-white/15 to-white/10" />
            </div>

            <button
              onClick={demo}
              disabled={loading}
              className="mt-4 w-full rounded-xl py-3 text-sm font-bold border border-emerald-400/40 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20 hover:shadow-[0_0_30px_rgba(52,211,153,.35)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Sparkles size={16} />
              {t("guestDemo")}
            </button>

            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              disabled={loading}
              className="mt-6 w-full py-2 text-center text-base font-black tracking-tight text-cyan-200 transition-all hover:text-cyan-100 cursor-pointer disabled:opacity-50 sm:text-lg"
            >
              {mode === "login" ? (
                isBn ? (
                  t("newHere")
                ) : (
                  <>
                    <span className="text-slate-200">New operative? </span>
                    <span className="underline decoration-cyan-400 decoration-2 underline-offset-4 text-glow-cyan">Join the academy</span>
                  </>
                )
              ) : (
                t("haveAccount")
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
