import React, { useEffect, useState } from "react";
import { StoreProvider, useStore } from "./store";
import { auth } from "./firebase";
import { Login } from "./components/Login";
import { AppShell, FloatingLang } from "./components/Shell";
import { Toasts } from "./components/ui";
import { AchievementPopup } from "./components/AchievementPopup";
import { Landing } from "./pages/Landing";
import { LogoMark } from "./components/Logo";
import { Home } from "./pages/Home";
import { Academy } from "./pages/Academy";
import { CourseDetail } from "./pages/CourseDetail";
import { ChapterView } from "./pages/ChapterView";
import { QuizNova } from "./pages/QuizNova";
import { Profile } from "./pages/Profile";
import { Admin } from "./pages/Admin";
import { NovaHelp } from "./pages/NovaHelp";
import { NovaAssistant } from "./pages/NovaAssistant";
import { FinalExam } from "./pages/FinalExam";
import { CertificateVerify } from "./pages/CertificateVerify";
import { Community } from "./pages/Community";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { setUserPresence } from "./lib/firebaseAdmin";

const Boot: React.FC = () => {
  const { t } = useStore();
  const [lines, setLines] = useState(0);
  useEffect(() => {
    const iv = window.setInterval(() => setLines((l) => Math.min(3, l + 1)), 260);
    return () => window.clearInterval(iv);
  }, []);
  const bootLines = [t("bootLine1"), t("bootLine2"), t("bootLine3")];
  return (
    <div className="min-h-screen grid place-items-center bg-nova-950 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full bg-cyan-500/10 blur-[130px]" />
      <div className="relative z-10 w-[min(90vw,420px)]">
        <div className="flex items-center justify-center">
          <LogoMark size={56} />
        </div>
        <div className="mt-4 text-center text-[10px] font-bold tracking-[0.45em] text-cyan-300/80 uppercase" style={{ fontFamily: "var(--font-display)" }}>
          {t("bootTitle")}
        </div>
        <div className="mt-5 rounded-xl border border-white/10 bg-black/50 p-4 font-mono text-[11px] space-y-1.5 h-24">
          {bootLines.slice(0, lines).map((l, i) => (
            <div key={i} className="text-emerald-300/90 anim-fade-up">{l}</div>
          ))}
        </div>
        <div className="mt-3 h-1 rounded-full bg-white/8 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500" style={{ width: `${(lines / 3) * 100}%` }} />
        </div>
      </div>
    </div>
  );
};

const Views: React.FC = () => {
  const { route, admin } = useStore();
  switch (route.view) {
    case "academy":
      return <Academy />;
    case "course":
      return <CourseDetail key={route.courseId} courseId={route.courseId!} />;
    case "chapter":
      return <ChapterView key={route.chapterId} courseId={route.courseId!} chapterId={route.chapterId!} />;
    case "quiz":
      return <QuizNova />;
    case "help":
      return <NovaHelp />;
    case "nova":
      return <NovaAssistant />;
    case "finalExam":
      return <FinalExam courseId={route.courseId!} chapterId={route.chapterId!} />;
    case "community":
      return admin.communityEnabled ? <Community /> : <Home />;
    case "verify":
      return admin.certificatesEnabled ? <CertificateVerify /> : <Home />;
    case "profile":
      return <Profile />;
    case "admin":
      return <Admin />;
    default:
      return <Home />;
  }
};

const PresenceSync: React.FC = () => {
  const { user } = useStore();

  useEffect(() => {
    if (!auth || !user?.uid) return;

    const sync = async (online: boolean) => {
      await setUserPresence(user.uid!, user, online);
    };

    void sync(true);

    const interval = window.setInterval(() => {
      void sync(true);
    }, 30000);

    const handleVisibility = () => {
      if (document.hidden) {
        void sync(false);
      } else {
        void sync(true);
      }
    };

    const handleBeforeUnload = () => {
      void sync(false);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      void sync(false);
    };
  }, [user?.uid, user?.email, user?.name, user?.avatarUrl, user?.role]);

  return null;
};

const Gate: React.FC = () => {
  const { user, route, nav } = useStore();
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const tm = window.setTimeout(() => setBooted(true), 1250);
    return () => window.clearTimeout(tm);
  }, []);

  useEffect(() => {
    const verifyId = new URLSearchParams(window.location.search).get("verify");
    if (!verifyId) return;
    if (route.view !== "verify" || route.verifyId !== verifyId) {
      nav({ view: "verify", verifyId });
    }
  }, [route.view, route.verifyId, nav]);

  const view = !booted ? (
    <Boot />
  ) : route.view === "verify" ? (
    <CertificateVerify />
  ) : !user ? (
    route.view === "login" ? <Login /> : <Landing />
  ) : route.view === "landing" ? (
    // Logged-in user opened the "Homepage" option → show the public home page
    <Landing />
  ) : (
    <AppShell>
      <Views />
    </AppShell>
  );
  return (
    <>
      <PresenceSync />
      {view}
      <FloatingLang />
    </>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <Gate />
        <Toasts />
        <AchievementPopup />
      </StoreProvider>
    </ErrorBoundary>
  );
}
