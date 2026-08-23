import type { Chapter, Course } from "../data/courses";

export type NovaLanguage = "auto" | "en" | "bn" | "banglish";
export type NovaMode = "simple" | "standard" | "deep" | "exam" | "practice";

export interface NovaContext {
  courses: Course[];
  read: string[];
  answers: Record<string, { correct: boolean; xp: number }>;
  lastVisited?: { courseId: string; chapterId: string } | null;
}

export interface NovaReply {
  text: string;
  suggestions: string[];
}

export function detectLanguage(input: string): Exclude<NovaLanguage, "auto"> {
  if (/[অ-৳]/.test(input)) return "bn";
  if (/(ta|koro|korbo|ki|eta|easy|bujhao|explain koro|acha)\b/i.test(input) && /[a-z]/i.test(input)) return "banglish";
  return "en";
}

export function getCurrentChapter(context: NovaContext): { course: Course; chapter: Chapter } | null {
  if (!context.lastVisited) return null;
  const course = context.courses.find((item) => item.id === context.lastVisited?.courseId);
  const chapter = course?.chapters.find((item) => item.id === context.lastVisited?.chapterId);
  return course && chapter ? { course, chapter } : null;
}

export function getNextRecommendation(context: NovaContext): { course: Course; chapter: Chapter } | null {
  for (const course of context.courses) {
    const chapter = course.chapters.find((item) => !context.read.includes(item.id));
    if (chapter) return { course, chapter };
  }
  return null;
}

function topicFromPrompt(prompt: string, current: ReturnType<typeof getCurrentChapter>): string {
  const normalized = prompt.toLowerCase();
  if (normalized.includes("subnet")) return "Subnetting";
  if (normalized.includes("osi")) return "the OSI Model";
  if (normalized.includes("tcp") || normalized.includes("udp")) return "TCP and UDP";
  if (normalized.includes("router")) return "Routers";
  if (normalized.includes("network")) return "Networks";
  return current?.chapter.title || "your current topic";
}

export function createNovaReply(prompt: string, context: NovaContext, language: NovaLanguage, mode: NovaMode): NovaReply {
  const detected = language === "auto" ? detectLanguage(prompt) : language;
  const current = getCurrentChapter(context);
  const topic = topicFromPrompt(prompt, current);
  const isBanglish = detected === "banglish";
  const isBangla = detected === "bn";
  const isPractice = mode === "practice" || /practice|question|test|quiz/i.test(prompt);

  const isIdentity = /who are you|what are you|আপনি কে|তুমি কে|কে তুমি/i.test(prompt);
  const isWellbeing = /how are you|কেমন আছ|কেমন আছেন|ভালো আছ|মন খারাপ|মন ভালো|sad|upset|depressed|খারাপ লাগ/i.test(prompt);
  const isGreeting = /^(hi|hello|hey|হাই|হ্যালো|আসসালামু আলাইকুম|salam|good morning|good evening)\b/i.test(prompt.trim());

  if (isIdentity) {
    if (isBangla) return { text: "আমি Nova, Cyber Nova-এর Study Assistant। আমি তোমার AI tutor, learning coach এবং study friend হিসেবে কাজ করি। তুমি যেকোনো বিষয় জিজ্ঞেস করতে পারো—আমি সহজভাবে বুঝিয়ে বলব, উদাহরণ দেব, practice করাব এবং তোমার পরের learning step সাজেস্ট করব।", suggestions: ["আমাকে Network শেখাও", "আমি কী শিখব?", "আমাকে একটি প্রশ্ন করো"] };
    if (isBanglish) return { text: "Ami Nova, Cyber Nova-er Study Assistant. Ami tomar AI tutor, learning coach, ar study friend. Tumi je kono topic niye jiggesh korte paro—ami easy kore explain, example, practice, ar next step suggest korbo.", suggestions: ["Network শেখাও", "Ami ki shikhbo?", "Amake ekta question koro"] };
    return { text: "I’m Nova, Cyber Nova’s Study Assistant. I’m your AI tutor, learning coach, and study friend. Ask me about any subject and I’ll explain it clearly, give examples, practice with you, and suggest what to learn next.", suggestions: ["Teach me Networking", "What should I learn next?", "Ask me a question"] };
  }

  if (isWellbeing) {
    if (isBangla) return { text: "আমি ভালো আছি, আর তোমার কথা শুনতে এখানে আছি। তোমার মন খারাপ হলে চাইলে আমাকে বলতে পারো কী হয়েছে। আমরা একটু কথা বলতে পারি, অথবা তোমার মন অন্যদিকে নিতে ছোট কোনো learning activity শুরু করতে পারি।", suggestions: ["আমার মন খারাপ", "চলো একটু কথা বলি", "একটি সহজ topic শেখাও"] };
    if (isBanglish) return { text: "Ami bhalo achi, ar tomar kotha shunte ekhanei achi. Tomar mon kharap hole ki hoyeche bolte paro. Chaile amra ektu kotha bolte pari, ba mon halka korar jonno ekta easy learning activity korte pari.", suggestions: ["Amar mon kharap", "Ektu kotha boli", "Easy ekta topic শেখাও"] };
    return { text: "I’m doing well, and I’m here to listen to you. If you’re feeling low, you can tell me what happened. We can talk for a while, or do a small, easy learning activity to gently shift your focus.", suggestions: ["I’m feeling low", "Let’s talk", "Teach me something easy"] };
  }

  if (isGreeting) {
    if (isBangla) return { text: "হ্যালো! আমি Nova। আজ তোমার সঙ্গে কথা বলতে এবং শেখায় সাহায্য করতে প্রস্তুত। কী নিয়ে শুরু করব?", suggestions: ["আমি কে জানতে চাই", "একটি topic শেখাও", "আমাকে practice করাও"] };
    if (isBanglish) return { text: "Hello! Ami Nova. Aaj tomar sathe kotha bolte ar learning-e help korte ready. Ki niye start korbo?", suggestions: ["Tumi ke?", "Ekta topic শেখাও", "Practice করাও"] };
    return { text: "Hello! I’m Nova. I’m ready to talk with you and help you learn today. What would you like to start with?", suggestions: ["Who are you?", "Teach me a topic", "Give me practice"] };
  }

  if (isPractice) {
    if (isBangla) return { text: `${topic} নিয়ে ছোট একটি practice প্রশ্ন:\n\nএকটি Network-এ Device-গুলো একে অপরের সঙ্গে Data আদান-প্রদান করতে কী ব্যবহার করে?\n\nA. Communication system\nB. শুধু Monitor\nC. শুধু Keyboard\nD. Recycle Bin`, suggestions: ["আমার উত্তর যাচাই করো", "আরও কঠিন প্রশ্ন দাও"] };
    if (isBanglish) return { text: `${topic} niye ekta quick practice:\n\nNetwork-e Device-gulo Data exchange korte ki use kore?\n\nA. Communication system\nB. Shudhu Monitor\nC. Shudhu Keyboard\nD. Recycle Bin`, suggestions: ["Amar answer check koro", "Hard question dao"] };
    return { text: `Quick practice on ${topic}:\n\nWhat allows Devices in a Network to exchange Data?\n\nA. A communication system\nB. Only a Monitor\nC. Only a Keyboard\nD. The Recycle Bin`, suggestions: ["Check my answer", "Give me a harder question"] };
  }

  if (isBangla) return { text: `${topic} সহজভাবে বুঝি।\n\nপ্রথমে এই বিষয়টির মূল ধারণা হলো: এটি কী, কেন দরকার এবং বাস্তবে কোথায় ব্যবহার হয়—এই তিনটি প্রশ্নের উত্তর পরিষ্কার করা।\n\nএকটি সহজ উদাহরণ দিয়ে ভাবুন, তারপর বিষয়টিকে ছোট ছোট ধাপে ভাগ করে শিখুন। ${mode === "deep" ? "গভীরভাবে শিখতে হলে এর মূল উপাদান, কাজের ধাপ, সীমাবদ্ধতা এবং বাস্তব প্রয়োগও দেখা দরকার।" : "এভাবে শিখলে ধারণাটি মনে রাখা এবং পরে practice করা সহজ হবে।"}`, suggestions: ["একটি উদাহরণ দাও", "আমাকে practice করাও", "পরের topic দেখাও"] };
  if (isBanglish) return { text: `${topic} easy kore bujhi.\n\nProthome bujhte hobe eta ki, keno dorkar, ar real life-e kothay use hoy. Tarpor topic-ta choto choto step-e vag kore shikhi.\n\n${mode === "deep" ? "Deeply shikhte hole er main components, process, limitation, ar practical use-o dekhte hobe." : "Eibhabe shikhle concept mone rakha ar practice kora easy hoy."}`, suggestions: ["Ekta example dao", "Practice korai", "Next topic dekhao"] };
  return { text: `Let's make ${topic} clear.\n\nStart with three questions: what is it, why does it matter, and where is it used in real life? Then break the topic into small, connected steps and test your understanding as you go.\n\n${mode === "deep" ? "For a deeper understanding, we should also examine its core components, process, practical trade-offs, and real-world applications." : "This approach makes the idea easier to remember and apply."}`, suggestions: ["Give me an example", "Let me practice", "Show my next topic"] };
}
