import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Lang, dict, Dict } from "./data/i18n";
import { courses as seedCourses, Course, Chapter, Section, Quiz, Exam } from "./data/courses";
import { db } from "./firebase";
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  limit,
} from "firebase/firestore";
export type { Course, Chapter, Section, Quiz, Exam };

/* ---------- Gamified Course Badge Meta ---------- */
export const COURSE_BADGE_META: Record<
  string,
  { name: string; nameBn: string; emoji: string; desc: string; descBn: string; color: string }
> = {
  c1: {
    name: "Network Scout",
    nameBn: "নেটওয়ার্ক স্কাউট",
    emoji: "🖥️",
    desc: "Cracked your first quiz in Computer & Internet Basics",
    descBn: "কম্পিউটার ও ইন্টারনেট বেসিক-এ প্রথম কুইজ জিতেছো",
    color: "from-cyan-400 to-blue-500",
  },
  c2: {
    name: "Linux Warrior",
    nameBn: "লিনাক্স যোদ্ধা",
    emoji: "🐧",
    desc: "First victory in Networking & OS Fundamentals",
    descBn: "নেটওয়ার্কিং ও অপারেটিং সিস্টেমে প্রথম জয়",
    color: "from-emerald-400 to-teal-500",
  },
  c3: {
    name: "Bug Hunter",
    nameBn: "বাগ হান্টার",
    emoji: "🎯",
    desc: "Found your first bug in Web Hacking & Bug Bounty",
    descBn: "ওয়েব হ্যাকিং ও বাগ বাউন্টিতে প্রথম বাগ ধরেছো",
    color: "from-fuchsia-400 to-rose-500",
  },
  c4: {
    name: "Forensic Eye",
    nameBn: "ফরেনসিক আই",
    emoji: "🔍",
    desc: "Uncovered first clue in Digital Forensics & OSINT",
    descBn: "ডিজিটাল ফরেনসিক্স ও ওএসআইএনটি-তে প্রথম ক্লু উদ্ধার",
    color: "from-amber-400 to-orange-500",
  },
};

export interface ActiveAchievement {
  id: number;
  courseId: string;
  title: string;
  titleBn: string;
  emoji: string;
  color: string;
}

/* ---------------- types ---------------- */
export interface Note {
  id: string;
  text: string;
  ts: number;
}
export interface User {
  name: string;
  email: string;
  avatarUrl: string;
  joinedAt: number;
  role?: "user" | "admin";
  phone?: string;
  bio?: string;
  education?: string;
  location?: string;
}

/**
 * 🔐 MAIN ADMIN CREDENTIALS (HARD-CODED)
 * These are the ONLY credentials that grant access to the Admin Panel.
 * DO NOT share these credentials publicly.
 */
export const ADMIN_EMAIL = "fahadahmad.cyber@gmail.com";
export const ADMIN_PASS = "Admin#nova";

const ADMIN_CREDS_KEY = "cybernova_owner_creds";

/** Owner credentials are persisted in the "backend" (browser storage).
 *  They can be rotated by writing a new pair to localStorage["cybernova_owner_creds"]. */
function getAdminCreds(): { email: string; password: string } {
  try {
    const raw = localStorage.getItem(ADMIN_CREDS_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (p && typeof p.email === "string" && typeof p.password === "string" && p.email && p.password) {
        return { email: p.email, password: p.password };
      }
    }
  } catch {
    /* fall back to defaults */
  }
  // seed the saved creds so they always exist in storage
  try {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }));
  } catch {
    /* storage unavailable */
  }
  return { email: ADMIN_EMAIL, password: ADMIN_PASS };
}

/** Read the currently active owner credentials (defaults or rotated). */
export function getOwnerCredentials(): { email: string; password: string } {
  return getAdminCreds();
}

/** Rotate the owner credentials. Stored in the local "backend" (browser storage). */
export function setOwnerCredentials(email: string, password: string): boolean {
  const e = email.trim();
  const p = password.trim();
  if (!e || !p) return false;
  try {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ email: e, password: p }));
    return true;
  } catch {
    return false;
  }
}

/** Restore the owner credentials back to the hard-coded defaults. */
export function resetOwnerCredentials(): void {
  try {
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASS }));
  } catch {
    /* storage unavailable */
  }
}

/** Robust comparison — ignores casing, extra spaces, non-breaking spaces and paste artifacts. */
export function isAdminCredentials(email: string, pass: string): { emailOk: boolean; passOk: boolean; ok: boolean } {
  const creds = getAdminCreds();
  const norm = (s: string) => s.toLowerCase().replace(/[\s\u00A0\u200B]+/g, "").trim();
  // Accept the default owner credentials ALWAYS, even if storage got corrupted.
  const emailOk = norm(email) === norm(ADMIN_EMAIL) || norm(email) === norm(creds.email);
  const passOk = norm(pass) === norm(ADMIN_PASS) || norm(pass) === norm(creds.password);
  return { emailOk, passOk, ok: emailOk && passOk };
}
export interface QuizAnswer {
  correct: boolean;
  xp: number;
}
export interface Activity {
  id: string;
  kind: "quiz" | "read" | "arena" | "note" | "certificate";
  ts: number;
  courseId: string;
  chapterId: string;
  xp: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  courseTitleBn: string;
  earnedAt: number;
  name: string;
  location: string;
  education: string;
}

export interface ExamResult {
  courseId: string;
  chapterId: string;
  score: number;       // 0-100
  passed: boolean;     // score >= passMark
  attemptedAt: number;
  attempts: number;
}

export interface ExamAttempt {
  id: string;
  courseId: string;
  chapterId: string;
  courseTitle: string;
  courseTitleBn: string;
  examTitle: string;
  examTitleBn: string;
  chapterTitle: string;
  chapterTitleBn: string;
  score: number;
  passed: boolean;
  attemptedAt: number;
  durationMinutes: number;
  timeLimitMinutes: number;
  totalQuestions: number;
  correctAnswers: number;
  totalMarks?: number;
  questionResults?: { question: string; questionBn: string; selected: string; selectedBn: string; correct: string; correctBn: string; isCorrect: boolean }[];
}

export interface SupportReply {
  id: string;
  from: "student" | "team";
  text: string;
  ts: number;
}
export interface SupportTicket {
  id: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  createdAt: number;
  updatedAt: number;
  status: "open" | "answered";
  messages: SupportReply[];
}
export interface AdminContent {
  siteNameEn: string;
  siteNameBn: string;
  siteTaglineEn: string;
  siteTaglineBn: string;
  logoUrl: string;
  heroTitleEn: string;
  heroTitleBn: string;
  heroSubEn: string;
  heroSubBn: string;
  bannerTitleEn: string;
  bannerTitleBn: string;
  bannerBodyEn: string;
  bannerBodyBn: string;
  announceEn: string;
  announceBn: string;
  showAnnounce: boolean;
  registrations: number;
  missionCount: number;
  trackCount: number;
  badgeCount: number;
  novaEnabled: boolean;
  novaGuidance: string;
  novaResponseLength: "concise" | "balanced" | "detailed";
  novaTools: Record<string, boolean>;
  novaModes: Record<string, boolean>;
}
export type Route = {
  view: "landing" | "login" | "home" | "academy" | "course" | "chapter" | "quiz" | "nova" | "profile" | "admin" | "help" | "finalExam";
  courseId?: string;
  chapterId?: string;
};
interface Toast {
  id: number;
  msg: string;
  kind: "xp" | "info" | "warn";
}

const DEFAULT_ADMIN: AdminContent = {
  siteNameEn: "CYBER NOVA",
  siteNameBn: "সাইবার নোভা",
  siteTaglineEn: "Security Academy",
  siteTaglineBn: "সিকিউরিটি একাডেমি",
  logoUrl: "",
  heroTitleEn: "Log In. Break the Code. Secure the Digital Universe.",
  heroTitleBn: "লগইন করো। কোড ভাঙো। ডিজিটাল মহাবিশ্ব সুরক্ষিত করো।",
  heroSubEn:
    "A gamified hands-on playground where absolute beginners and future elite hackers train side by side. Read, break, quiz, rank up — all inside your browser.",
  heroSubBn:
    "একটি গেমিফাইড হ্যান্ডস-অন প্লেগ্রাউন্ড, যেখানে একদম নতুন শিক্ষার্থী আর ভবিষ্যৎ এলিট হ্যাকাররা পাশাপাশি ট্রেনিং নেয়। পড়ো, ভাঙো, কুইজ দাও, র‍্যাংক বাড়াও — সবকিছু তোমার ব্রাউজারের ভেতরেই।",
  bannerTitleEn: "Master the Terminal. Rule the Network.",
  bannerTitleBn: "টার্মিনালে দক্ষতা আনো। নেটওয়ার্কে রাজত্ব করো।",
  bannerBodyEn:
    "Nova Elite Cohort — live instructor-led hacking labs with Python automation, real Kali ranges and a bounty-hunter capstone. Seats are limited per season.",
  bannerBodyBn:
    "নোভা এলিট কোহোর্ট — লাইভ ইনস্ট্রাক্টর-লেড হ্যাকিং ল্যাব, পাইথন অটোমেশন, রিয়েল কালি রেঞ্জ আর বাউন্টি-হান্টার ক্যাপস্টোনসহ। প্রতি সিজনে সীমিত আসন।",
  announceEn: "CYBER NOVA SEASON 04 ENROLLMENT OPEN · 28 MISSIONS · 4 TRACKS · ZERO TO HERO",
  announceBn: "সাইবার নোভা সিজন ০৪ ভর্তি চলছে · ২৮ টি মিশন · ৪ টি ট্র্যাক · শূন্য থেকে হিরো",
  showAnnounce: true,
  registrations: 247,
  missionCount: 28,
  trackCount: 4,
  badgeCount: 7,
  novaEnabled: true,
  novaGuidance: "",
  novaResponseLength: "balanced",
  novaTools: { learn: true, explain: true, practice: true, test: true, roadmap: true, revise: true, file: true },
  novaModes: { simple: true, standard: true, deep: true, exam: true, practice: true },
};

const LS_KEY = "cybernova_state_v1";
const CURRICULUM_VERSION = 29;

function buildDefaultExam(title: string): NonNullable<Chapter["exam"]> {
  const examTitle = title || "Cyber Skills Exam";
  return {
    title: `${examTitle} Exam`,
    description: "Check your understanding of this step.",
    passMark: 70,
    timeLimitMinutes: 25,
    questions: [
      {
        q: `Which concept is most important to understand in ${examTitle}?`,
        qBn: `${examTitle}-এ কোন ধারণাটি বোঝা সবচেয়ে গুরুত্বপূর্ণ?`,
        opts: ["Core fundamentals", "Only shortcut commands", "Random trial and error", "Ignoring the syllabus"],
        optsBn: ["মৌলিক ভিত্তি", "শুধু শর্টকাট কমান্ড", "এলোমেলো পরীক্ষা-ভুল", "সিলেবাসকে উপেক্ষা করা"],
        answer: 0,
        explain: "Strong fundamentals reduce mistakes and make advanced tasks more understandable.",
        explainBn: "সঠিক ভিত্তি ভুল কমায় এবং উন্নত কাজ সহজ করে তোলে।",
      },
      {
        q: "What is the safest habit when you are learning a new cyber or IT topic?",
        qBn: "কোনো নতুন সাইবার বা আইটি বিষয় শিখতে গেলে সবচেয়ে নিরাপদ অভ্যাস কী?",
        opts: ["Read, practice, verify, and review safely", "Guess until something works", "Skip notes and proceed", "Use every tool without understanding"],
        optsBn: ["নিরাপদে পড়ো, অনুশীলন করো, যাচাই করো, পুনরावलোকন করো", "কিছু কাজ না হওয়া পর্যন্ত অনুমান করো", "নোট এড়িয়ে এগিয়ে যাও", "বুঝতে না পারলেও সব টুল ব্যবহার করো"],
        answer: 0,
        explain: "Structured learning creates reliable knowledge and reduces risky shortcuts.",
        explainBn: "গঠনমূলক শিখন নিরাপদ জ্ঞান গড়ে তোলে এবং ঝুঁকিপূর্ণ শর্টকাট কমায়।",
      },
      {
        q: "Why do we evaluate performance using scores and pass marks?",
        qBn: "স্কোর ও পাসমার্ক দিয়ে পারফরম্যান্স কেন মূল্যায়ন করা হয়?",
        opts: ["To measure understanding and readiness", "To make tests harder", "To hide progress", "To replace practice"],
        optsBn: ["বুঝার শক্তি ও প্রস্তুতি যাচাই করতে", "টেস্ট কঠিন করতে", "অগ্রগতি লুকাতে", "অনুশীলনকে বাতিল করতে"],
        answer: 0,
        explain: "Clear pass marks show whether knowledge is solid enough for the next step.",
        explainBn: "স্পষ্ট পাসমার্ক দেখায় কী জ্ঞান পরবর্তী ধাপে যেতে যথেষ্ট আছে কি না।",
      },
    ],
  };
}

function normalizeCurriculum(courses: Course[]): Course[] {
  return courses.map((course) => {
    const cleanCourse: Record<string, unknown> = { ...course };
    delete cleanCourse.finalExam;

    const chapters = course.chapters.map((chapter, index) => {
      const cleanChapter: Record<string, unknown> = { ...chapter };
      const exam = chapter.exam ?? (index === 0 ? course.finalExam : undefined);
      if (exam !== undefined) cleanChapter.exam = exam;
      else delete cleanChapter.exam;
      return cleanChapter as Chapter;
    });

    cleanCourse.chapters = chapters;
    return cleanCourse as Course;
  });
}

function sanitizeForFirestore<T>(value: T): T {
  if (value === undefined) return undefined as T;
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeForFirestore(item))
      .filter((item) => item !== undefined) as T;
  }
  if (value && typeof value === "object") {
    const cleaned: Record<string, unknown> = {};
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      const cleanedItem = sanitizeForFirestore(item as never);
      if (cleanedItem !== undefined) cleaned[key] = cleanedItem;
    }
    return cleaned as T;
  }
  return value;
}

function orderCurriculum(courses: Course[]): Course[] {
  return [...courses].sort((a, b) => Number(b.id === "c5") - Number(a.id === "c5"));
}

interface Persisted {
  lang: Lang;
  user: User | null;
  xp: number;
  answers: Record<string, QuizAnswer>;
  read: string[];
  notes: Record<string, Note[]>;
  activity: Activity[];
  arena: { best: number; runs: number };
  admin: AdminContent;
  lastVisited: { courseId: string; chapterId: string } | null;
  certificates: Certificate[];
  notifications: { id: string; msg: string; ts: number; read: boolean }[];
  route: Route;
  curriculum: Course[];
  curriculumVersion: number;
  tickets: SupportTicket[];
  courseBadges: string[];
  finalExamResults: Record<string, ExamResult>; // legacy result map
  examHistory: ExamAttempt[];
}

const DEFAULT_STATE: Persisted = {
  lang: "en",
  user: null,
  xp: 0,
  answers: {},
  read: [],
  notes: {},
  activity: [],
  arena: { best: 0, runs: 0 },
  admin: DEFAULT_ADMIN,
  lastVisited: null,
  certificates: [],
  notifications: [],
  route: { view: "landing" },
  curriculum: normalizeCurriculum(seedCourses),
  tickets: [],
  courseBadges: [],
  finalExamResults: {},
  examHistory: [],
  curriculumVersion: CURRICULUM_VERSION,
};

function load(): Persisted {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return DEFAULT_STATE;
    const p = JSON.parse(raw);
    const merged: Persisted = {
      ...DEFAULT_STATE,
      ...p,
      curriculum: orderCurriculum(p.curriculum || DEFAULT_STATE.curriculum),
      admin: { ...DEFAULT_ADMIN, ...(p.admin || {}) },
    };
    if (p.curriculumVersion !== CURRICULUM_VERSION) {
      return {
        ...merged,
        curriculum: DEFAULT_STATE.curriculum,
        curriculumVersion: CURRICULUM_VERSION,
        answers: {},
        read: [],
        notes: {},
        lastVisited: null,
        certificates: [],
        courseBadges: [],
        finalExamResults: {},
        examHistory: [],
        route: merged.route?.view === "admin" && merged.user?.role !== "admin" ? { view: "home" } : merged.route,
      };
    }
    // Safety: a non-admin must never restore onto the admin panel.
    if (merged.route?.view === "admin" && merged.user?.role !== "admin") {
      merged.route = { view: "home" };
    }
    return merged;
  } catch {
    return DEFAULT_STATE;
  }
}

/* ---------------- context ---------------- */
interface Store extends Persisted {
  route: Route;
  toasts: Toast[];
  activeAchievement: ActiveAchievement | null;
  t: (k: keyof Dict) => string;
  tn: (k: keyof Dict, i: number) => string;
  isBn: boolean;
  setLang: (l: Lang) => void;
  nav: (r: Route) => void;
  login: (u: User, initialRoute: Route) => void;
  logout: () => void;
  updateProfile: (patch: Partial<User>) => void;
  toast: (msg: string, kind?: Toast["kind"]) => void;
  quizResult: (courseId: string, chapterId: string, correct: boolean, firstTry: boolean, quizIndex?: number) => number;
  markRead: (courseId: string, chapterId: string) => void;
  addNote: (chapterId: string, text: string) => void;
  editNote: (chapterId: string, id: string, text: string) => void;
  deleteNote: (chapterId: string, id: string) => void;
  arenaFinish: (score: number, total: number, xpGained: number) => void;
  setAdmin: (patch: Partial<AdminContent>) => void;
  resetProgress: () => void;
  factoryReset: () => void;
  issueCertificate: (courseId: string) => void;
  pushNotification: (msg: string) => void;
  markAllRead: () => void;
  // ---- curriculum CRUD (owner) ----
  addCourse: (title: string, titleBn: string) => void;
  updateCourse: (courseId: string, patch: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  addChapter: (courseId: string, title: string, titleBn: string) => void;
  updateChapter: (courseId: string, chapterId: string, patch: Partial<Chapter>) => void;
  deleteChapter: (courseId: string, chapterId: string) => void;
  addSection: (courseId: string, chapterId: string) => void;
  updateSection: (courseId: string, chapterId: string, idx: number, patch: Partial<Section>) => void;
  deleteSection: (courseId: string, chapterId: string, idx: number) => void;
  clearChapterLessons: (courseId: string, chapterId: string) => void;
  updateQuiz: (courseId: string, chapterId: string, patch: Partial<Quiz>) => void;
  deleteQuiz: (courseId: string, chapterId: string) => void;
  updateExam: (courseId: string, chapterId: string, patch: Partial<Exam>) => void;
  addExamQuestion: (courseId: string, chapterId: string) => void;
  updateExamQuestion: (courseId: string, chapterId: string, questionIndex: number, patch: Partial<Exam["questions"][number]>) => void;
  deleteExamQuestion: (courseId: string, chapterId: string, questionIndex: number) => void;
  resetCurriculum: () => void;
  // ---- Nova Help ----
  submitTicket: (text: string) => void;
  replyTicket: (ticketId: string, text: string) => void;
  dismissAchievement: () => void;
  // ---- Chapter Exams ----
  submitExam: (
    courseId: string,
    chapterId: string,
    score: number,
    meta?: {
      totalQuestions?: number;
      correctAnswers?: number;
      durationMinutes?: number;
      timeLimitMinutes?: number;
      questionResults?: ExamAttempt["questionResults"];
    }
  ) => void;
  resetExam: (courseId: string, chapterId: string) => void;
}

const Ctx = createContext<Store | null>(null);
export const useStore = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("store missing");
  return v;
};

let toastId = 0;

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<Persisted>(load);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [activeAchievement, setActiveAchievement] = useState<ActiveAchievement | null>(null);
  const saveTimer = useRef<number | null>(null);
  const achTimer = useRef<number | null>(null);

  // persist (debounced)
  useEffect(() => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(state));
      } catch {
        /* storage unavailable */
      }
    }, 200);
    return () => {
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
    };
  }, [state]);

  useEffect(() => {
    const settingsRef = doc(db, "admin", "settings");
    const unsubscribe = onSnapshot(settingsRef, (snap) => {
      if (!snap.exists()) return;
      const next = snap.data() as Partial<AdminContent>;
      setState((prev) => ({
        ...prev,
        admin: { ...DEFAULT_ADMIN, ...prev.admin, ...next },
      }));
    }, (error) => {
      console.error("[cybernova] Firestore admin config sync failed:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const curriculumRef = doc(db, "platform", "curriculum");
    const unsubscribe = onSnapshot(curriculumRef, (snap) => {
      if (!snap.exists()) return;
      const payload = snap.data();
      const nextCurriculum = Array.isArray(payload?.items) ? payload.items as Course[] : [];
      if (!nextCurriculum.length) return;
      const normalized = orderCurriculum(normalizeCurriculum(nextCurriculum));
      setState((prev) => {
        const same = JSON.stringify(prev.curriculum) === JSON.stringify(normalized);
        return same ? prev : { ...prev, curriculum: normalized };
      });
    }, (error) => {
      console.error("[cybernova] Firestore curriculum sync failed:", error);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const payload = { items: sanitizeForFirestore(state.curriculum), updatedAt: Date.now() };
    setDoc(doc(db, "platform", "curriculum"), payload, { merge: true }).catch(() => {
      /* ignore remote sync failures */
    });
  }, [state.curriculum]);

  // Real-time Firestore Sync for Support Tickets across ALL devices
  useEffect(() => {
    const ticketsRef = collection(db, "support_tickets");
    const q = query(ticketsRef, orderBy("updatedAt", "desc"), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketsList: SupportTicket[] = [];
      snapshot.forEach((doc) => {
        ticketsList.push(doc.data() as SupportTicket);
      });
      setState((prev) => ({ ...prev, tickets: ticketsList }));
    }, (error) => {
      console.error("[cybernova] Firestore real-time sync failed:", error);
    });

    return () => unsubscribe();
  }, []);

  const toast = useCallback((msg: string, kind: Toast["kind"] = "info") => {
    const id = ++toastId;
    setToasts((ts) => [...ts.slice(-3), { id, msg, kind }]);
    window.setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 3400);
  }, []);

  const patch = useCallback(
    (p: Partial<Persisted> | ((s: Persisted) => Partial<Persisted>)) =>
      setState((s) => ({ ...s, ...(typeof p === "function" ? p(s) : p) })),
    []
  );

  const pushActivity = (a: Omit<Activity, "id">): Activity => ({
    ...a,
    id: Math.random().toString(36).slice(2, 9),
  });

  const store: Store = {
    ...state,
    route: state.route,
    toasts,
    activeAchievement,
    isBn: state.lang === "bn",
    t: (k) => {
      const v = dict[state.lang][k];
      return typeof v === "string" ? v : String(v);
    },
    tn: (k, i) => {
      const v = dict[state.lang][k];
      return Array.isArray(v) ? (v as string[])[i] || "" : "";
    },
    setLang: (l) => patch({ lang: l }),
    nav: (r) => {
      // Admin panel is protected: only the owner (admin@cybernova.com) may open it.
      if (r.view === "admin" && state.user?.role !== "admin") {
        setState((s) => ({ ...s, route: { view: "home" } }));
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return;
      }
      setState((s) => ({ ...s, route: r }));
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    },
    login: (u, initialRoute) => {
      // Force the route by role so the owner ALWAYS lands on the admin panel
      // and regular users ALWAYS land on the dashboard.
      const target: Route = u.role === "admin" ? { view: "admin" } : initialRoute && initialRoute.view !== "admin" ? initialRoute : { view: "home" };
      const next = { ...state, user: u, route: target };
      setState(next);
      // Persist IMMEDIATELY (synchronously) — not via the 200ms debounce —
      // so a page reload/refresh right after sign-up can never drop the session
      // and dump the user back on the dark login screen.
      try {
        localStorage.setItem(LS_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    },
    logout: () => {
      setState((s) => ({ ...s, user: null, route: { view: "landing" } }));
    },
    updateProfile: (p) =>
      setState((s) => ({ ...s, user: s.user ? { ...s.user, ...p } : null })),
    toast,
    quizResult: (courseId, chapterId, correct, firstTry, quizIndex = 0) => {
      const resultKey = quizIndex === 0 ? chapterId : `${chapterId}:quiz-${quizIndex}`;
      let gained = 0;
      let unlockedCourse: string | null = null;
      setState((s) => {
        if (s.answers[resultKey]?.correct) return s;
        if (!correct) return s;
        gained = firstTry ? 100 : 50;

        const courseChapters = s.curriculum.find((c) => c.id === courseId)?.chapters.map((ch) => ch.id) || [];
        const hasCorrectBefore = courseChapters.some((id) => s.answers[id]?.correct);
        const hasBadge = s.courseBadges.includes(courseId);
        let newCourseBadges = s.courseBadges;
        let didUnlock = false;
        if (!hasBadge && !hasCorrectBefore) {
          newCourseBadges = [...s.courseBadges, courseId];
          unlockedCourse = courseId;
          didUnlock = true;
        }

        return {
          ...s,
          xp: s.xp + gained,
          courseBadges: newCourseBadges,
          answers: { ...s.answers, [resultKey]: { correct: true, xp: gained } },
          activity: [
            pushActivity({ kind: "quiz", ts: Date.now(), courseId, chapterId: resultKey, xp: gained }),
            ...s.activity,
          ].slice(0, 40),
          notifications: didUnlock
            ? [
                {
                  id: Math.random().toString(36).slice(2, 9),
                  msg:
                    s.lang === "bn"
                      ? `নতুন ব্যাজ আনলক হয়েছে! ${COURSE_BADGE_META[courseId]?.nameBn || "🏅"} ${COURSE_BADGE_META[courseId]?.emoji || ""}`
                      : `New badge unlocked! ${COURSE_BADGE_META[courseId]?.name || "Badge"} ${COURSE_BADGE_META[courseId]?.emoji || ""} 🏅`,
                  ts: Date.now(),
                  read: false,
                },
                ...s.notifications,
              ].slice(0, 30)
            : s.notifications,
        };
      });

      if (unlockedCourse) {
        const meta = COURSE_BADGE_META[unlockedCourse];
        const achId = Date.now();
        if (meta) {
          setActiveAchievement({
            id: achId,
            courseId: unlockedCourse,
            title: meta.name,
            titleBn: meta.nameBn,
            emoji: meta.emoji,
            color: meta.color,
          });
          if (achTimer.current) window.clearTimeout(achTimer.current);
          achTimer.current = window.setTimeout(() => setActiveAchievement(null), 5000);
        }
      }

      return gained;
    },
    markRead: (courseId, chapterId) => {
      setState((s) => {
        if (s.read.includes(chapterId)) return { ...s, lastVisited: { courseId, chapterId } };
        return {
          ...s,
          xp: s.xp + 25,
          read: [...s.read, chapterId],
          lastVisited: { courseId, chapterId },
          activity: [
            pushActivity({ kind: "read", ts: Date.now(), courseId, chapterId, xp: 25 }),
            ...s.activity,
          ].slice(0, 40),
        };
      });
    },
    addNote: (chapterId, text) =>
      setState((s) => {
        const courseId = Object.keys(s.notes).length ? "" : "";
        void courseId;
        return {
          ...s,
          notes: {
            ...s.notes,
            [chapterId]: [
              ...(s.notes[chapterId] || []),
              { id: Math.random().toString(36).slice(2, 9), text, ts: Date.now() },
            ],
          },
          activity: [
            pushActivity({ kind: "note", ts: Date.now(), courseId: "", chapterId, xp: 0 }),
            ...s.activity,
          ].slice(0, 40),
        };
      }),
    editNote: (chapterId, id, text) =>
      setState((s) => ({
        ...s,
        notes: {
          ...s.notes,
          [chapterId]: (s.notes[chapterId] || []).map((n) =>
            n.id === id ? { ...n, text, ts: Date.now() } : n
          ),
        },
      })),
    deleteNote: (chapterId, id) =>
      setState((s) => ({
        ...s,
        notes: {
          ...s.notes,
          [chapterId]: (s.notes[chapterId] || []).filter((n) => n.id !== id),
        },
      })),
    arenaFinish: (score, _total, xpGained) =>
      setState((s) => ({
        ...s,
        xp: s.xp + xpGained,
        arena: { best: Math.max(s.arena.best, score), runs: s.arena.runs + 1 },
        activity: [
          pushActivity({ kind: "arena", ts: Date.now(), courseId: "", chapterId: "", xp: xpGained }),
          ...s.activity,
        ].slice(0, 40),
      })),
    setAdmin: (p) =>
      setState((s) => {
        const nextAdmin = { ...s.admin, ...p };
        setDoc(doc(db, "admin", "settings"), nextAdmin, { merge: true }).catch(() => {
          /* ignore remote sync failures */
        });
        return { ...s, admin: nextAdmin };
      }),
    resetProgress: () =>
      setState((s) => ({
        ...s,
        xp: 0,
        answers: {},
        read: [],
        notes: {},
        activity: [],
        arena: { best: 0, runs: 0 },
        lastVisited: null,
        courseBadges: [],
        certificates: [],
        finalExamResults: {},
        examHistory: [],
      })),
    factoryReset: () => {
      try {
        localStorage.removeItem(LS_KEY);
      } catch {
        /* noop */
      }
      setState({ ...DEFAULT_STATE, user: state.user, route: { view: "home" } });
    },
    issueCertificate: (courseId) => {
      const course = state.curriculum.find((c) => c.id === courseId);
      if (!course) return;
      setState((s) => {
        if (s.certificates.some((c) => c.courseId === courseId)) return s;
        const cert: Certificate = {
          id: Math.random().toString(36).slice(2, 9),
          courseId,
          courseTitle: course.title,
          courseTitleBn: course.titleBn,
          earnedAt: Date.now(),
          name: s.user?.name || "Student",
          location: s.user?.location || "",
          education: s.user?.education || "",
        };
        return {
          ...s,
          certificates: [...s.certificates, cert],
          activity: [
            pushActivity({ kind: "certificate", ts: Date.now(), courseId, chapterId: "", xp: 0 }),
            ...s.activity,
          ].slice(0, 40),
        };
      });
    },
    pushNotification: (msg) =>
      setState((s) => ({
        ...s,
        notifications: [{ id: Math.random().toString(36).slice(2, 9), msg, ts: Date.now(), read: false }, ...s.notifications].slice(0, 30),
      })),
    markAllRead: () =>
      setState((s) => ({
        ...s,
        notifications: s.notifications.map((n) => ({ ...n, read: true })),
      })),

    /* ---------------- curriculum CRUD ---------------- */
    addCourse: (title, titleBn) =>
      setState((s) => ({
        ...s,
        curriculum: [
          ...s.curriculum,
          {
            id: `c${Date.now()}`,
            title: title || "New Course",
            titleBn: titleBn || title || "নতুন কোর্স",
            tagline: "",
            taglineBn: "",
            icon: "cpu",
            hue: "from-cyan-500/30 to-blue-600/20",
            chapters: [],
          } as Course,
        ],
      })),
    updateCourse: (courseId, p) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) => (c.id === courseId ? { ...c, ...p } : c)),
      })),
    deleteCourse: (courseId) =>
      setState((s) => ({ ...s, curriculum: s.curriculum.filter((c) => c.id !== courseId) })),
    addChapter: (courseId, title, titleBn) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId
            ? {
                ...c,
                chapters: [
                  ...c.chapters,
                  {
                    id: `${courseId}-${Date.now()}`,
                    title: title || "New Chapter",
                    titleBn: titleBn || title || "নতুন চ্যাপ্টার",
                    minutes: 5,
                    keywords: [],
                    intro: "",
                    introBn: "",
                    sections: [],
                    quiz: {
                      q: "",
                      qBn: "",
                      opts: ["", "", "", ""],
                      optsBn: ["", "", "", ""],
                      answer: 0,
                      explain: "",
                      explainBn: "",
                    },
                  } as Chapter,
                ],
              }
            : c
        ),
      })),
    updateChapter: (courseId, chapterId, p) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId
            ? { ...c, chapters: c.chapters.map((ch) => (ch.id === chapterId ? { ...ch, ...p } : ch)) }
            : c
        ),
      })),
    deleteChapter: (courseId, chapterId) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId ? { ...c, chapters: c.chapters.filter((ch) => ch.id !== chapterId) } : c
        ),
      })),
    addSection: (courseId, chapterId) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId
            ? {
                ...c,
                chapters: c.chapters.map((ch) =>
                  ch.id === chapterId
                    ? { ...ch, sections: [...ch.sections, { h: "", hBn: "", b: "", bBn: "" }] }
                    : ch
                ),
              }
            : c
        ),
      })),
    updateSection: (courseId, chapterId, idx, p) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId
            ? {
                ...c,
                chapters: c.chapters.map((ch) =>
                  ch.id === chapterId
                    ? { ...ch, sections: ch.sections.map((sec, i) => (i === idx ? { ...sec, ...p } : sec)) }
                    : ch
                ),
              }
            : c
        ),
      })),
    deleteSection: (courseId, chapterId, idx) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId
            ? {
                ...c,
                chapters: c.chapters.map((ch) =>
                  ch.id === chapterId ? { ...ch, sections: ch.sections.filter((_, i) => i !== idx) } : ch
                ),
              }
            : c
        ),
      })),
    clearChapterLessons: (courseId, chapterId) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((course) => course.id !== courseId ? course : {
          ...course,
          chapters: course.chapters.map((chapter) => chapter.id === chapterId ? { ...chapter, sections: [] } : chapter),
        }),
      })),
    updateQuiz: (courseId, chapterId, p) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((c) =>
          c.id === courseId
            ? {
                ...c,
                chapters: c.chapters.map((ch) =>
                  ch.id === chapterId ? { ...ch, quiz: { ...ch.quiz, ...p } } : ch
                ),
              }
            : c
        ),
      })),
    deleteQuiz: (courseId, chapterId) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((course) => course.id !== courseId ? course : {
          ...course,
          chapters: course.chapters.map((chapter) => chapter.id === chapterId ? {
            ...chapter,
            quiz: { q: "", qBn: "", opts: ["", "", "", ""], optsBn: ["", "", "", ""], answer: 0, explain: "", explainBn: "" },
          } : chapter),
        }),
      })),
    updateExam: (courseId, chapterId, patch) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((course) => course.id !== courseId ? course : {
          ...course,
          chapters: course.chapters.map((chapter) => chapter.id !== chapterId ? chapter : {
            ...chapter,
            exam: {
              title: chapter.exam?.title ?? `${chapter.title} Exam`,
              titleBn: chapter.exam?.titleBn ?? `${chapter.titleBn} পরীক্ষা`,
              description: chapter.exam?.description ?? "Check your understanding of this step.",
              descriptionBn: chapter.exam?.descriptionBn ?? "এই ধাপের বোঝাপড়া যাচাই করো।",
              startLabel: chapter.exam?.startLabel ?? "Start Exam",
              startLabelBn: chapter.exam?.startLabelBn ?? "এক্সাম শুরু করুন",
              passMark: chapter.exam?.passMark ?? 70,
              totalMarks: chapter.exam?.totalMarks ?? 100,
              timeLimitMinutes: chapter.exam?.timeLimitMinutes ?? 25,
              requiresPreviousStep: chapter.exam?.requiresPreviousStep ?? true,
              questions: chapter.exam?.questions ?? [],
              ...patch,
            },
          }),
        }),
      })),
    addExamQuestion: (courseId, chapterId) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((course) => course.id !== courseId ? course : {
          ...course,
          chapters: course.chapters.map((chapter) => chapter.id !== chapterId ? chapter : {
            ...chapter,
            exam: {
              title: chapter.exam?.title ?? `${chapter.title} Exam`,
              titleBn: chapter.exam?.titleBn ?? `${chapter.titleBn} পরীক্ষা`,
              description: chapter.exam?.description ?? "Check your understanding of this step.",
              descriptionBn: chapter.exam?.descriptionBn ?? "এই ধাপের বোঝাপড়া যাচাই করো।",
              startLabel: chapter.exam?.startLabel ?? "Start Exam",
              startLabelBn: chapter.exam?.startLabelBn ?? "এক্সাম শুরু করুন",
              passMark: chapter.exam?.passMark ?? 70,
              totalMarks: chapter.exam?.totalMarks ?? 100,
              timeLimitMinutes: chapter.exam?.timeLimitMinutes ?? 25,
              requiresPreviousStep: chapter.exam?.requiresPreviousStep ?? true,
              questions: [...(chapter.exam?.questions ?? []), { q: "", qBn: "", opts: ["", "", "", ""], optsBn: ["", "", "", ""], answer: 0, explain: "", explainBn: "" }],
            },
          }),
        }),
      })),
    updateExamQuestion: (courseId, chapterId, questionIndex, patch) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((course) => {
          const chapter = course.id === courseId ? course.chapters.find((item) => item.id === chapterId) : undefined;
          if (!chapter?.exam || !chapter.exam.questions[questionIndex]) return course;
          const questions = [...chapter.exam.questions];
          questions[questionIndex] = { ...questions[questionIndex], ...patch };
          return { ...course, chapters: course.chapters.map((item) => item.id === chapterId ? { ...item, exam: { ...chapter.exam!, questions } } : item) };
        }),
      })),
    deleteExamQuestion: (courseId, chapterId, questionIndex) =>
      setState((s) => ({
        ...s,
        curriculum: s.curriculum.map((course) => {
          const chapter = course.id === courseId ? course.chapters.find((item) => item.id === chapterId) : undefined;
          if (!chapter?.exam) return course;
          return { ...course, chapters: course.chapters.map((item) => item.id === chapterId ? { ...item, exam: { ...chapter.exam!, questions: chapter.exam!.questions.filter((_, index) => index !== questionIndex) } } : item) };
        }),
      })),
    resetCurriculum: () => setState((s) => ({ ...s, curriculum: normalizeCurriculum(seedCourses) })),

    /* ---------------- Chapter Exams ---------------- */
    submitExam: (courseId, chapterId, score, meta = {}) => {
      setState((s) => {
        const course = s.curriculum.find((c) => c.id === courseId);
        const chapter = course?.chapters.find((item) => item.id === chapterId);
        const passMark = chapter?.exam?.passMark ?? 80;
        const passed = score >= passMark;
        const resultKey = `${courseId}:${chapterId}`;
        const prev = s.finalExamResults[resultKey];
        const totalQuestions = meta.totalQuestions ?? chapter?.exam?.questions.length ?? 0;
        const correctAnswers = meta.correctAnswers ?? Math.round((score / 100) * totalQuestions);
        const durationMinutes = Math.max(1, Math.round((meta.durationMinutes ?? 0) || 1));
        const timeLimitMinutes = meta.timeLimitMinutes ?? chapter?.exam?.timeLimitMinutes ?? 25;
        const result: ExamResult = {
          courseId,
          chapterId,
          score,
          passed,
          attemptedAt: Date.now(),
          attempts: (prev?.attempts || 0) + 1,
        };

        const attemptRecord: ExamAttempt = {
          id: Math.random().toString(36).slice(2, 9),
          courseId,
          chapterId,
          courseTitle: course?.title || "Course",
          courseTitleBn: course?.titleBn || "কোর্স",
          examTitle: chapter?.exam?.title || "Skill Test",
          examTitleBn: chapter?.exam?.title || "স্কিল টেস্ট",
          chapterTitle: chapter?.title || "Step",
          chapterTitleBn: chapter?.titleBn || "ধাপ",
          score,
          passed,
          attemptedAt: Date.now(),
          durationMinutes,
          timeLimitMinutes,
          totalQuestions,
          correctAnswers,
          totalMarks: chapter?.exam?.totalMarks ?? 100,
          questionResults: meta.questionResults,
        };

        let certificates = s.certificates;
        if (passed && !s.certificates.some((c) => c.courseId === courseId)) {
          const cert: Certificate = {
            id: Math.random().toString(36).slice(2, 9),
            courseId,
            courseTitle: course?.title || "",
            courseTitleBn: course?.titleBn || "",
            earnedAt: Date.now(),
            name: s.user?.name || "Student",
            location: s.user?.location || "",
            education: s.user?.education || "",
          };
          certificates = [...s.certificates, cert];
        }
        return {
          ...s,
          finalExamResults: { ...s.finalExamResults, [resultKey]: result },
          certificates,
          examHistory: [attemptRecord, ...s.examHistory].slice(0, 30),
        };
      });
    },
    resetExam: (courseId, chapterId) => {
      setState((s) => {
        const next = { ...s.finalExamResults };
        delete next[`${courseId}:${chapterId}`];
        return { ...s, finalExamResults: next };
      });
    },

    /* ---------------- Nova Help support tickets (Firestore Live Sync) ---------------- */
    submitTicket: (text) => {
      const trimmed = text.trim();
      if (!trimmed || !state.user) return;

      const userEmail = state.user.email.toLowerCase();
      const msg: SupportReply = {
        id: Math.random().toString(36).slice(2, 9),
        from: "student",
        text: trimmed,
        ts: Date.now(),
      };

      // Determine ticket structure
      const existing = state.tickets.find((tk) => tk.studentEmail.toLowerCase() === userEmail);
      const ticketId = existing?.id || Math.random().toString(36).slice(2, 9);

      const updatedTicket: SupportTicket = existing
        ? {
            ...existing,
            studentName: state.user.name,
            studentAvatar: state.user.avatarUrl,
            updatedAt: Date.now(),
            status: "open",
            messages: [...existing.messages, msg],
          }
        : {
            id: ticketId,
            studentName: state.user.name,
            studentEmail: state.user.email,
            studentAvatar: state.user.avatarUrl,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            status: "open",
            messages: [msg],
          };

      // Write straight to Google Firestore cloud database!
      // This will immediately trigger onSnapshot on all other devices (your laptop, etc.)
      const docRef = doc(db, "support_tickets", ticketId);
      setDoc(docRef, updatedTicket).catch((err) => {
        console.error("[cybernova] Failed to save ticket to Firestore:", err);
      });
    },
    replyTicket: (ticketId, text) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const existing = state.tickets.find((tk) => tk.id === ticketId);
      if (!existing) return;

      const updatedTicket: SupportTicket = {
        ...existing,
        status: "answered",
        updatedAt: Date.now(),
        messages: [
          ...existing.messages,
          {
            id: Math.random().toString(36).slice(2, 9),
            from: "team",
            text: trimmed,
            ts: Date.now(),
          },
        ],
      };

      // Write straight to Google Firestore cloud database!
      const docRef = doc(db, "support_tickets", ticketId);
      setDoc(docRef, updatedTicket).catch((err) => {
        console.error("[cybernova] Failed to save reply to Firestore:", err);
      });
    },
    dismissAchievement: () => {
      if (achTimer.current) window.clearTimeout(achTimer.current);
      setActiveAchievement(null);
    },
  };

  const memo = useMemo(() => store, [state, toasts, activeAchievement]); // eslint-disable-line
  return <Ctx.Provider value={memo}>{children}</Ctx.Provider>;
};

/* ------------- derived helpers ------------- */
export interface Badge {
  key: string;
  icon: string;
  nameKey: keyof Dict;
  descKey: keyof Dict;
  unlocked: boolean;
}

export function computeBadges(s: {
  xp: number;
  read: string[];
  answers: Record<string, QuizAnswer>;
  arena: { best: number; runs: number };
  curriculum?: Course[];
}): Badge[] {
  const list = s.curriculum || seedCourses;
  const total = list.reduce((n, c) => n + c.chapters.length, 0) || 28;
  const correctCount = Object.values(s.answers).filter((a) => a.correct).length;
  const doneCourse = list.some((c) => c.chapters.length > 0 && c.chapters.every((ch) => s.read.includes(ch.id)));
  return [
    { key: "first", icon: "zap", nameKey: "badgeFirstContact", descKey: "badgeFirstContactD", unlocked: s.xp > 0 },
    { key: "book", icon: "book", nameKey: "badgeBookworm", descKey: "badgeBookwormD", unlocked: s.read.length >= 5 },
    { key: "quiz", icon: "target", nameKey: "badgeQuizzer", descKey: "badgeQuizzerD", unlocked: correctCount >= 10 },
    { key: "slayer", icon: "sword", nameKey: "badgeSlayer", descKey: "badgeSlayerD", unlocked: doneCourse },
    { key: "half", icon: "flag", nameKey: "badgeMarathon", descKey: "badgeMarathonD", unlocked: s.read.length >= Math.ceil(total / 2) },
    { key: "grad", icon: "grad", nameKey: "badgeGrad", descKey: "badgeGradD", unlocked: s.read.length >= total },
    { key: "arena", icon: "trophy", nameKey: "badgeArena", descKey: "badgeArenaD", unlocked: s.arena.best >= 5 },
  ];
}
