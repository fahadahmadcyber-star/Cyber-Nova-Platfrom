import keyboardLessonImage from "../assets/WhatsApp Image 2026-08-22 at 10.18.17 AM - Copy.jpeg";
import mouseLessonImage from "../assets/WhatsApp Image 2026-08-22 at 10.18.17 AM (1) - Copy.jpeg";
import shutdownLessonImage from "../assets/WhatsApp Image 2026-08-22 at 10.18.18 AM - Copy.jpeg";

export interface Quiz {
  q: string;
  qBn: string;
  opts: string[];
  optsBn: string[];
  answer: number;
  explain: string;
  explainBn: string;
  /** When true, options are shuffled on every render so the correct index changes */
  randomize?: boolean;
}

export interface ExamQuestion {
  q: string;
  qBn: string;
  opts: string[];
  optsBn: string[];
  answer: number;
  explain: string;
  explainBn: string;
}

export interface Exam {
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  startLabel?: string;
  startLabelBn?: string;
  passMark: number; // 0-100 percentage required (e.g. 80)
  totalMarks?: number;
  timeLimitMinutes: number;
  /** When enabled, the previous chapter must be completed before this exam opens. */
  requiresPreviousStep?: boolean;
  questions: ExamQuestion[];
}

export interface Section {
  h: string;
  hBn: string;
  b: string;
  bBn: string;
  imageUrl?: string;
}

export interface Chapter {
  id: string;
  title: string;
  titleBn: string;
  minutes: number;
  keywords: string[];
  intro: string;
  introBn: string;
  sections: Section[];
  quiz: Quiz;
  quizzes?: Quiz[];
  exam?: Exam;
}

export interface Course {
  id: string;
  title: string;
  titleBn: string;
  tagline: string;
  taglineBn: string;
  icon: "cpu" | "network" | "globe" | "search";
  hue: string;
  chapters: Chapter[];
  /** Legacy course-level exam data; new exams belong to chapters. */
  finalExam?: Exam;
}

const sec = (h: string, hBn: string, b: string, bBn: string, imageUrl?: string): Section => ({ h, hBn, b, bBn, imageUrl });

const courseSeed: Course[] = [
  {
    id: "c1",
    title: "Networking Masterclass",
    titleBn: "নেটওয়ার্কিং মাস্টারক্লাস",
    tagline: "Start from zero and understand the internet, computers and how to stay safe online.",
    taglineBn: "একদম শূন্য থেকে ইন্টারনেট, কম্পিউটার আর অনলাইনে নিরাপদ থাকার সহজ শিক্ষা।",
    icon: "cpu",
    hue: "from-cyan-500/30 to-blue-600/20",
    chapters: [
      {
        id: "c1-1",
        title: "What is the Internet?",
        titleBn: "ইন্টারনেট কী?",
        minutes: 5,
        keywords: ["internet", "network", "connect", "basics", "device"],
        intro:
          "The internet is the world's biggest network. It connects millions of computers, phones and smart devices all over the globe so they can share information with each other.",
        introBn:
          "ইন্টারনেট হলো বিশ্বের সবচেয়ে বড় নেটওয়ার্ক। এটি সারা বিশ্বের লক্ষ লক্ষ কম্পিউটার, ফোন আর স্মার্ট ডিভাইসকে যুক্ত করে রাখে, যাতে তারা একে অপরের সাথে তথ্য ভাগ করতে পারে।",
        sections: [
          sec(
            "A network connected across the world",
            "বিশ্বজুড়ে যুক্ত এক নেটওয়ার্ক",
            "Think of the internet as a giant web of roads connecting every town on Earth. When you search, watch or chat, your device sends and receives information through this web in just seconds.",
            "ইন্টারনেটকে ভাবো পৃথিবীর প্রতিটি শহর যুক্ত করা এক বিশাল রাস্তার জাল। তুমি যখন সার্চ করো, ভিডিও দেখো বা চ্যাট করো, তখন তোমার ডিভাইস মাত্র কয়েক সেকেন্ডে এই জাল দিয়ে তথ্য পাঠায় আর পায়।"
          ),
          sec(
            "How your device gets connected",
            "তোমার ডিভাইস কীভাবে যুক্ত হয়",
            "Your phone or laptop joins this web through Wi-Fi, mobile data or a cable. Once connected, you can talk to any other connected device on the planet.",
            "তোমার ফোন বা ল্যাপটপ ওয়াই-ফাই, মোবাইল ডেটা বা ক্যাবলের মাধ্যমে এই জালে যোগ দেয়। যুক্ত হওয়ার পরেই তুমি পৃথিবীর যেকোনো যুক্ত ডিভাইসের সাথে কথা বলতে পারো।"
          ),
          sec(
            "Why we start with the internet",
            "কেন আমরা ইন্টারনেট দিয়ে শুরু করি",
            "Almost every cyberattack happens on the internet. So before we learn to defend or explore systems, we must first understand the ground they stand on — the internet itself.",
            "প্রায় সব সাইবার আক্রমণই ইন্টারনেটে ঘটে। তাই সিস্টেম রক্ষা বা অন্বেষণ শেখার আগে প্রথমে বুঝতে হবে সেই মঞ্চটি — অর্থাৎ ইন্টারনেট নিজেই।"
          ),
        ],
        quiz: {
          q: "What is the internet?",
          qBn: "ইন্টারনেট কী?",
          opts: [
            "The world's largest network connecting billions of devices",
            "A single special app",
            "Just one cable",
            "A type of antivirus",
          ],
          optsBn: [
            "বিশ্বের সবচেয়ে বড় নেটওয়ার্ক, যা কোটি কোটি ডিভাইস যুক্ত রাখে",
            "একটি বিশেষ অ্যাপ",
            "শুধু একটি ক্যাবল",
            "এক ধরনের অ্যান্টিভাইরাস",
          ],
          answer: 0,
          explain:
            "The internet is a global network of networks. It connects countless devices so they can share information worldwide.",
          explainBn:
            "ইন্টারনেট হলো নেটওয়ার্কের এক বিশাল নেটওয়ার্ক। এটি অগণিত ডিভাইস যুক্ত করে রাখে, যাতে তারা বিশ্বজুড়ে তথ্য ভাগ করতে পারে।",
        },
      },
      {
        id: "c1-2",
        title: "What is a Computer?",
        titleBn: "কম্পিউটার আসলে কী?",
        minutes: 5,
        keywords: ["computer", "hardware", "software", "input", "output"],
        intro:
          "A computer is a machine that takes instructions, works on them, and gives you results — again and again, extremely fast.",
        introBn:
          "কম্পিউটার হলো এমন এক মেশিন যা নির্দেশ নেয়, সেটি নিয়ে কাজ করে, আর ফলাফল দেয় — বারবার, আর দারুণ দ্রুত।",
        sections: [
          sec(
            "Input, process, output",
            "ইনপুট, প্রসেস, আউটপুট",
            "You type on a keyboard (input), the computer works on it (process), and shows the result on screen (output). Every computer, from a phone to a supercomputer, works on this simple idea.",
            "তুমি কিবোর্ডে টাইপ করো (ইনপুট), কম্পিউটার সেটি নিয়ে কাজ করে (প্রসেস), আর স্ক্রিনে ফল দেখায় (আউটপুট)। ফোন হোক বা সুপারকম্পিউটার — প্রতিটি কম্পিউটার এই সহজ ধারণাতেই চলে।"
          ),
          sec(
            "Hardware and software",
            "হার্ডওয়্যার আর সফটওয়্যার",
            "Hardware is the parts you can touch — screen, keyboard, processor, memory. Software is the set of instructions that tells the hardware what to do, like apps and games.",
            "হার্ডওয়্যার হলো স্পর্শ করা যায় এমন অংশ — স্ক্রিন, কিবোর্ড, প্রসেসর, মেমোরি। সফটওয়্যার হলো সেই নির্দেশের সেট, যা হার্ডওয়্যারকে বলে কী করতে হবে — যেমন অ্যাপ আর গেম।"
          ),
          sec(
            "The role of the operating system",
            "অপারেটিং সিস্টেমের ভূমিকা",
            "The operating system (like Windows, Android or Linux) manages everything. It runs programs, stores files and lets you use the computer easily. It is the manager of the machine.",
            "অপারেটিং সিস্টেম (যেমন উইন্ডোজ, অ্যান্ড্রয়েড বা লিনাক্স) সবকিছু সামলায়। এটি প্রোগ্রাম চালায়, ফাইল রাখে, আর কম্পিউটার ব্যবহার করা সহজ করে তোলে। এটি মেশিনের ম্যানেজার।"
          ),
        ],
        quiz: {
          q: "What are the three basic steps of a computer?",
          qBn: "কম্পিউটারের তিনটি মূল ধাপ কী কী?",
          opts: ["Input, process, output", "Games, music, video", "Start, stop, restart", "Mouse, keyboard, monitor"],
          optsBn: ["ইনপুট, প্রসেস, আউটপুট", "খেলা, গান, ভিডিও", "চালু, বন্ধ, রিস্টার্ট", "মাউস, কিবোর্ড, মনিটর"],
          answer: 0,
          explain:
            "Every computer takes input, works on it (process), and produces output. This simple cycle powers every device you use.",
          explainBn:
            "প্রতিটি কম্পিউটার ইনপুট নেয়, সেটি নিয়ে কাজ করে (প্রসেস), আর আউটপুট দেয়। তুমি যে ডিভাইসই ব্যবহার করো না কেন, এই সহজ চক্রেই তা চলে।",
        },
      },
      {
        id: "c1-3",
        title: "What is an IP Address?",
        titleBn: "আইপি অ্যাড্রেস কী?",
        minutes: 6,
        keywords: ["ip", "address", "device", "network", "number"],
        intro:
          "Just like every house has a home address, every device on the internet has a special address called an IP address. It helps data find the right device.",
        introBn:
          "যেভাবে প্রতিটি বাড়ির একটি ঠিকানা থাকে, তেমনি ইন্টারনেটের প্রতিটি ডিভাইসের একটি বিশেষ ঠিকানা আছে, যাকে বলা হয় আইপি অ্যাড্রেস। এটি ডেটাকে সঠিক ডিভাইস খুঁজে পেতে সাহায্য করে।",
        sections: [
          sec(
            "Just like an address",
            "ঠিকানার মতোই",
            "When you send a letter, the post office needs an address to deliver it. In the same way, data needs an IP address to reach your device and no other.",
            "তুমি চিঠি পাঠালে পোস্ট অফিস পৌঁছে দিতে ঠিকানা চায়। ঠিক একইভাবে ডেটা পৌঁছাতে আইপি ঠিকানা লাগে — যাতে অন্য কোনো ডিভাইসে না যায়।"
          ),
          sec(
            "An address written in numbers",
            "নম্বর দিয়ে লেখা ঠিকানা",
            "A common IP address looks like 192.168.0.1 — four numbers separated by dots. Every device on a network needs its own unique number, so there is no confusion.",
            "সাধারণ একটি আইপি ঠিকানা দেখতে এমন — 192.168.0.1, অর্থাৎ ডট দিয়ে আলাদা করা চারটি সংখ্যা। নেটওয়ার্কে প্রতিটি ডিভাইসের নিজস্ব আলাদা সংখ্যা দরকার, যাতে বিভ্রান্তি না হয়।"
          ),
          sec(
            "Why it matters for security",
            "নিরাপত্তার সাথে সম্পর্ক",
            "If someone knows your IP address, they can try to reach your device. That is why security experts watch IP addresses carefully — both to attack and to defend.",
            "যদি কেউ তোমার আইপি ঠিকানা জানে, সে তোমার ডিভাইসে পৌঁছানোর চেষ্টা করতে পারে। তাই নিরাপত্তা বিশেষজ্ঞরা আইপি ঠিকানা খুব সতর্কভাবে দেখে — আক্রমণ করার জন্যও, রক্ষা করার জন্যও।"
          ),
        ],
        quiz: {
          q: "What is an IP address?",
          qBn: "আইপি অ্যাড্রেস কী?",
          opts: [
            "A unique address of a device that helps data reach it on a network",
            "The name of an app",
            "A type of password",
            "A game",
          ],
          optsBn: [
            "একটি ডিভাইসের অনন্য ঠিকানা, যা দিয়ে নেটওয়ার্কে ডেটা পৌঁছে যায়",
            "একটি অ্যাপের নাম",
            "এক ধরনের পাসওয়ার্ড",
            "একটি গেম",
          ],
          answer: 0,
          explain:
            "An IP address is the unique address of a device on a network. It is used to route data to the right place, just like a home address.",
          explainBn:
            "আইপি অ্যাড্রেস হলো নেটওয়ার্কে একটি ডিভাইসের অনন্য ঠিকানা। বাড়ির ঠিকানার মতোই এটি দিয়ে ডেটাকে সঠিক জায়গায় পাঠানো হয়।",
        },
      },
      {
        id: "c1-4",
        title: "Websites & Domain Names",
        titleBn: "ওয়েবসাইট ও ডোমেইন নাম",
        minutes: 6,
        keywords: ["website", "domain", "dns", "address", "browser"],
        intro:
          "You don't need to remember long numbers to open a website. Instead, you type an easy name like google.com — and the internet finds the address for you.",
        introBn:
          "ওয়েবসাইট খুলতে তোমাকে লম্বা নম্বর মনে রাখতে হয় না। বদলে তুমি google.com-এর মতো সহজ একটি নাম টাইপ করো — আর ইন্টারনেট তোমার জন্য ঠিকানাটি খুঁজে আনে।",
        sections: [
          sec(
            "Easy names, addresses behind them",
            "সহজ নাম, পেছনে ঠিকানা",
            "Every website has an IP address, but numbers are hard to remember. So websites get friendly names called domain names — like youtube.com or cybernova.academy.",
            "প্রতিটি ওয়েবসাইটের একটি আইপি ঠিকানা আছে, কিন্তু নম্বর মনে রাখা কঠিন। তাই ওয়েবসাইটের জন্য সহজ নাম থাকে, যাকে ডোমেইন নাম বলে — যেমন youtube.com বা cybernova.academy।"
          ),
          sec(
            "What happens when you type",
            "টাইপ করলেই কী হয়",
            "When you type a domain name, your device asks the internet 'where is this?' It gets the real address in a flash and opens the site. The whole thing takes less than a second.",
            "তুমি ডোমেইন নাম টাইপ করলে তোমার ডিভাইস ইন্টারনেটকে জিজ্ঞেস করে 'এটা কোথায়?' তাৎক্ষণিকভাবে আসল ঠিকানা পেয়ে সাইট খুলে দেয়। পুরো ব্যাপারটি এক সেকেন্ডেরও কম সময় নেয়।"
          ),
          sec(
            "DNS — the internet's phonebook",
            "ডিএনএস — ইন্টারনেটের ফোনবুক",
            "The system that changes names into addresses is called DNS. Think of it as a giant phonebook — you give it a name, it gives you the number.",
            "নামকে ঠিকানায় বদলানো সেই ব্যবস্থাটিকে বলা হয় DNS। একে ভাবো বিশাল একটি ফোনবুক — তুমি নাম দাও, সে তোমাকে নম্বর দেয়।"
          ),
        ],
        quiz: {
          q: "What is a domain name?",
          qBn: "ডোমেইন নাম কী?",
          opts: [
            "An easy name (like google.com) that finds a website's address",
            "The name of a cable",
            "A password",
            "A type of game",
          ],
          optsBn: [
            "একটি সহজ নাম (যেমন google.com), যা একটি ওয়েবসাইটের ঠিকানা খুঁজে দেয়",
            "একটি ক্যাবলের নাম",
            "একটি পাসওয়ার্ড",
            "এক ধরনের গেম",
          ],
          answer: 0,
          explain:
            "A domain name is a friendly name that maps to a website's IP address, so we don't have to memorize numbers.",
          explainBn:
            "ডোমেইন নাম হলো এমন একটি সহজ নাম যা একটি ওয়েবসাইটের আইপি ঠিকানা খুঁজে দেয়, যাতে আমাদের নম্বর মনে রাখতে না হয়।",
        },
      },
      {
        id: "c1-5",
        title: "First Steps to Stay Safe Online",
        titleBn: "অনলাইনে নিরাপদ থাকার প্রথম ধাপ",
        minutes: 6,
        keywords: ["password", "safe", "privacy", "2fa", "phishing"],
        intro:
          "Your password and your attention are your first shield online. Small habits can protect you from most common attacks.",
        introBn:
          "তোমার পাসওয়ার্ড আর তোমার সতর্কতা হলো অনলাইনে তোমার প্রথম ঢাল। ছোট কিছু অভ্যাসই তোমাকে অনেক সাধারণ আক্রমণ থেকে রক্ষা করতে পারে।",
        sections: [
          sec(
            "Make a strong password",
            "শক্তিশালী পাসওয়ার্ড বানাও",
            "A strong password is long and mixed — capital letters, small letters, numbers and symbols. Use a different password for every important account.",
            "শক্তিশালী পাসওয়ার্ড লম্বা আর মিশ্রিত — বড় হাতের, ছোট হাতের অক্ষর, সংখ্যা আর চিহ্ন একসাথে। প্রতিটি গুরুত্বপূর্ণ অ্যাকাউন্টের জন্য আলাদা পাসওয়ার্ড ব্যবহার করো।"
          ),
          sec(
            "Click carefully",
            "খেয়াল করে ক্লিক করো",
            "If an email or message feels urgent, odd, or asks for your password, slow down. Don't click unknown links or open unexpected files. Verify from a trusted source first.",
            "যদি কোনো ইমেইল বা মেসেজ তাড়াহুড়ো বোধ হয়, অদ্ভুত লাগে, বা তোমার পাসওয়ার্ড চায় — তবে থেমে ভাবো। অজানা লিংকে ক্লিক করো না, অপ্রত্যাশিত ফাইল খোলো না। আগে বিশ্বস্ত সূত্র থেকে যাচাই করো।"
          ),
          sec(
            "Two-step security (2FA)",
            "দুই ধাপের নিরাপত্তা (২FA)",
            "Two-factor authentication asks for a second proof — like a code on your phone — after your password. Even if your password leaks, your account stays safe.",
            "টু-ফ্যাক্টর অথেন্টিকেশন পাসওয়ার্ডের পর আরেকটি প্রমাণ চায় — যেমন ফোনে আসা একটি কোড। এমনকি পাসওয়ার্ড ফাঁস হলেও তোমার অ্যাকাউন্ট নিরাপদ থাকে।"
          ),
        ],
        quiz: {
          q: "What makes a password strong?",
          qBn: "শক্তিশালী পাসওয়ার্ডের বৈশিষ্ট্য কী?",
          opts: [
            "It is long and mixed — capital, small letters, numbers and symbols",
            "It uses only your name",
            "It uses only numbers",
            "It is very short and simple",
          ],
          optsBn: [
            "লম্বা এবং মিশ্রিত — বড়-ছোট অক্ষর, সংখ্যা ও চিহ্ন",
            "শুধু নাম ব্যবহার করা",
            "শুধু সংখ্যা ব্যবহার করা",
            "খুব ছোট ও সহজ",
          ],
          answer: 0,
          explain:
            "Long, mixed-character passwords are far harder to guess, and using a unique one per account limits the damage if one leaks.",
          explainBn:
            "লম্বা ও মিশ্র অক্ষরের পাসওয়ার্ড অনুমান করা অনেক কঠিন, আর প্রতি অ্যাকাউন্টে আলাদা পাসওয়ার্ড ব্যবহার করলে একটি ফাঁস হলেও বাকিগুলো নিরাপদ থাকে।",
        },
      },
      {
        id: "c1-6",
        title: "How Data Travels on the Internet",
        titleBn: "ইন্টারনেটে ডেটা যেভাবে যায়",
        minutes: 6,
        keywords: ["data", "packet", "travel", "speed", "network"],
        intro:
          "When you send a message, it doesn't go as one big piece. It breaks into small parts called packets, which travel and join back together at the end.",
        introBn:
          "তুমি যখন মেসেজ পাঠাও, সেটি এক বড় টুকরো হিসেবে যায় না। এটি ছোট ছোট অংশে ভাগ হয়, যাকে প্যাকেট বলে, আর শেষে এসে আবার জোড়া লাগে।",
        sections: [
          sec(
            "Data gets split into packets",
            "ডেটা ভাগ হয়ে প্যাকেট হয়",
            "A big file is cut into many small packets. Each packet travels like a small envelope with an address label, so even if one path is busy, others still find their way.",
            "বড় ফাইল অনেক ছোট প্যাকেটে কাটা হয়। প্রতিটি প্যাকেট ঠিকানাসহ ছোট খামের মতো ভ্রমণ করে, ফলে কোনো পথ ব্যস্ত থাকলেও বাকিগুলো পথ খুঁজে পায়।"
          ),
          sec(
            "Arrives and joins back together",
            "পৌঁছে আবার জোড়া লাগে",
            "The packets may take different roads, but at the end they reach the same device and join back into your original message — like puzzle pieces fitting together.",
            "প্যাকেটগুলো ভিন্ন ভিন্ন পথ ধরলেও শেষে তারা একই ডিভাইসে পৌঁছে আবার তোমার আসল মেসেজে জোড়া লাগে — যেমন ধাঁধার টুকরো মিলে যাওয়া।"
          ),
          sec(
            "Why speed matters",
            "গতি কেন গুরুত্বপূর্ণ",
            "How fast data travels affects loading a page, watching video or playing games. Tools like ping measure this speed — a skill you'll use a lot in security.",
            "ডেটা কত দ্রুত যায় তা নির্ভর করে পেজ লোড, ভিডিও দেখা বা গেম খেলার ওপর। ping-এর মতো টুল এই গতি মাপে — নিরাপত্তায় তুমি এই দক্ষতা অনেক ব্যবহার করবে।"
          ),
        ],
        quiz: {
          q: "How does a message travel on the internet?",
          qBn: "ইন্টারনেটে মেসেজ যেভাবে যায়",
          opts: [
            "It splits into small packets that travel, then join back at the end",
            "As one big piece",
            "Like a single phone call",
            "It doesn't travel at all",
          ],
          optsBn: [
            "ছোট ছোট প্যাকেটে ভাগ হয়ে বিভিন্ন পথে পৌঁছে শেষে জোড়া লাগে",
            "এক বড় টুকরো হিসেবে",
            "একটি ফোন কলের মতো",
            "মোটেও যায় না",
          ],
          answer: 0,
          explain:
            "Data is broken into packets, sent across the network (possibly on different paths), and reassembled at the destination.",
          explainBn:
            "ডেটা ছোট প্যাকেটে ভাগ হয়, নেটওয়ার্ক দিয়ে পাঠানো হয় (সম্ভবত ভিন্ন পথে), আর গন্তব্যে গিয়ে আবার জোড়া লাগে।",
        },
      },
      {
        id: "c1-7",
        title: "Why Cybersecurity Matters",
        titleBn: "সাইবার নিরাপত্তা কেন জরুরি?",
        minutes: 5,
        keywords: ["cybersecurity", "protect", "data", "hacking", "defender"],
        intro:
          "We keep so much of our life on computers and the internet. Cybersecurity is about protecting that digital life — our data, money, privacy and trust.",
        introBn:
          "আমাদের জীবনের অনেক কিছুই এখন কম্পিউটার আর ইন্টারনেটে। সাইবার নিরাপত্তা মানে সেই ডিজিটাল জীবনকে রক্ষা করা — আমাদের ডেটা, টাকা, গোপনীয়তা আর বিশ্বাস।",
        sections: [
          sec(
            "What we protect",
            "কী কী আমরা রক্ষা করি",
            "We protect devices, accounts, passwords, personal information and whole systems. A single weak password can sometimes risk a whole organization.",
            "আমরা রক্ষা করি ডিভাইস, অ্যাকাউন্ট, পাসওয়ার্ড, ব্যক্তিগত তথ্য আর পুরো সিস্টেম। মাঝে মাঝে একটি দুর্বল পাসওয়ার্ডই পুরো প্রতিষ্ঠানকে ঝুঁকিতে ফেলতে পারে।"
          ),
          sec(
            "Both the good and bad sides",
            "ভালো আর খারাপ দুই দিকই",
            "Cybersecurity has defenders who protect systems and ethical hackers who find and fix problems. Learning this skill lets you be on the helping side.",
            "সাইবার নিরাপত্তায় আছে রক্ষাকারীরা যারা সিস্টেম রক্ষা করে, আর এথিক্যাল হ্যাকাররা যারা সমস্যা খুঁজে ঠিক করে। এই দক্ষতা শিখলে তুমি সাহায্যকারী দলেই থাকবে।"
          ),
          sec(
            "Your journey starts here",
            "তোমার যাত্রা শুরু এখানেই",
            "You've learned the basics. Next, you'll meet networking, operating systems and the tools professionals use. Every expert started exactly where you are now.",
            "তুমি বেসিক শিখে ফেলেছো। এরপর তুমি জানবে নেটওয়ার্কিং, অপারেটিং সিস্টেম আর প্রোরা যেসব টুল ব্যবহার করে। প্রতিটি বিশেষজ্ঞের শুরুও ঠিক এই জায়গা থেকেই ছিল।"
          ),
        ],
        quiz: {
          q: "What does cybersecurity protect?",
          qBn: "সাইবার নিরাপত্তা কিসের সুরক্ষা নিয়ে কাজ করে?",
          opts: ["Devices, accounts, information and systems", "Only games", "Only cables", "Only screens"],
          optsBn: ["ডিভাইস, অ্যাকাউন্ট, তথ্য ও সিস্টেম", "শুধু গেম", "শুধু ক্যাবল", "শুধু স্ক্রিন"],
          answer: 0,
          explain:
            "Cybersecurity protects all digital assets — devices, accounts, data and the systems that run on them.",
          explainBn:
            "সাইবার নিরাপত্তা সব ডিজিটাল সম্পদ রক্ষা করে — ডিভাইস, অ্যাকাউন্ট, ডেটা আর যে সিস্টেমে সেগুলো চলে।",
        },
      },
    ],
  },
  {
    id: "c2",
    title: "Operating System Fundamentals",
    titleBn: "অপারেটিং সিস্টেম ফান্ডামেন্টালস",
    tagline: "Master Linux, the shell and the everyday tools security pros actually use.",
    taglineBn: "লিনাক্স, শেল আর প্রোরা প্রতিদিন যে টুলগুলো ব্যবহার করে — সেগুলোই সহজে শিখো।",
    icon: "network",
    hue: "from-emerald-500/30 to-teal-600/20",
    chapters: [
      {
        id: "c2-1",
        title: "Why Hackers Love Linux",
        titleBn: "হ্যাকাররা লিনাক্স ভালোবাসে কেন",
        minutes: 6,
        keywords: ["linux", "kali", "open source", "kernel", "distro"],
        intro:
          "Linux powers most of the world's servers, and it's open and free to learn. If you want to work in security, this is the language you need to speak.",
        introBn:
          "লিনাক্সে চলে পৃথিবীর বেশিরভাগ সার্ভার, আর এটি উন্মুক্ত ও শেখা সহজ। নিরাপত্তায় কাজ করতে হলে এটাই সেই ভাষা যা জানা দরকার।",
        sections: [
          sec(
            "Open source superpowers",
            "ওপেন সোর্সের সুপারপাওয়ার",
            "Every line of Linux is readable and changeable. That transparency makes it the perfect training ground — nothing is hidden from a curious mind.",
            "লিনাক্সের প্রতিটি লাইন পড়া ও বদলানো যায়। সেই স্বচ্ছতাই একে তোইরি করে নিখুঁত প্রশিক্ষণভূমি — কৌতূহলী মনের কাছে কিছুই লুকানো নেই।"
          ),
          sec(
            "Kali: the offensive distro",
            "কালি: আক্রমণাত্মক ডিস্ট্রো",
            "Kali Linux ships 600+ pre-installed security tools — nmap, hydra, metasploit, wireshark. One ISO, an entire armory.",
            "কালি লিনাক্সে থাকে ৬০০+ প্রি-ইনস্টলড সিকিউরিটি টুল — nmap, hydra, metasploit, wireshark। একটি ISO-তেই পুরো অস্ত্রাগার।"
          ),
          sec(
            "Servers speak Linux",
            "সার্ভাররা লিনাক্স বলে",
            "The machine you hack, pivot through, or defend is almost always Linux. Windows matters too, but the internet's engine room runs on penguins.",
            "যে মেশিন তুমি হ্যাক করো, পিভট করো বা রক্ষা করো, সেটি প্রায় সবসময়ই লিনাক্স। উইন্ডোজও জরুরি, কিন্তু ইন্টারনেটের ইঞ্জিনরুম চলে পেঙ্গুইনে।"
          ),
        ],
        quiz: {
          q: "Kali Linux is best described as…",
          qBn: "কালি লিনাক্সকে সবচেয়ে ভালোভাবে বর্ণনা করা যায়…",
          opts: [
            "A Linux distribution pre-loaded with security and penetration-testing tools",
            "An antivirus suite for Windows servers",
            "A programming language for exploits",
            "A firewall appliance sold by Google",
          ],
          optsBn: [
            "সিকিউরিটি ও পেনেট্রেশন-টেস্টিং টুলসহ প্রি-লোডেড একটি লিনাক্স ডিস্ট্রিবিউশন",
            "উইন্ডোজ সার্ভারের জন্য একটি অ্যান্টিভাইরাস স্যুট",
            "এক্সপ্লয়েট লেখার একটি প্রোগ্রামিং ভাষা",
            "গুগলের বিক্রি করা একটি ফায়ারওয়াল অ্যাপ্লায়েন্স",
          ],
          answer: 0,
          explain:
            "Kali is a Debian-based distro maintained by OffSec, bundling hundreds of offensive-security tools out of the box.",
          explainBn:
            "কালি হলো OffSec রক্ষণাবেক্ষণকৃত ডেবিয়ান-ভিত্তিক ডিস্ট্রো, যাতে বাই ডিফল্ট শ শ অফেনসিভ-সিকিউরিটি টুল থাকে।",
        },
      },
      {
        id: "c2-2",
        title: "The Shell — Your Command Center",
        titleBn: "শেল — তোমার কমান্ড সেন্টার",
        minutes: 7,
        keywords: ["terminal", "bash", "shell", "commands", "cli"],
        intro:
          "The terminal looks ancient, yet nothing is faster. One line of bash can do what a GUI needs fifty clicks for.",
        introBn:
          "টার্মিনাল দেখতে প্রাচীন, অথচ এর চেয়ে দ্রুত আর কিছু নেই। bash-এর এক লাইনে হয় যা GUI-তে পঞ্চাশ ক্লিকে হয়।",
        sections: [
          sec(
            "Navigation: pwd, ls, cd",
            "নেভিগেশন: pwd, ls, cd",
            "pwd shows where you are, ls lists what's there, cd moves you. These three commands are the WASD keys of the hacker universe.",
            "pwd দেখায় তুমি কোথায় আছো, ls দেখায় সেখানে কী আছে, cd নিয়ে যায় অন্য জায়গায়। এই তিনটি কমান্ড হ্যাকার-ইউনিভার্সের WASD কী।"
          ),
          sec(
            "Reading and searching files",
            "ফাইল পড়া ও খোঁজা",
            "cat prints, less pages, grep hunts patterns. Chained with pipes, they become a search engine over your entire filesystem.",
            "cat ছাপে, less পাতায় ভাগে, grep খোঁজে প্যাটার্ন। পাইপ দিয়ে জোড়া লাগালে এরা হয়ে যায় পুরো ফাইলসিস্টেমের সার্চ ইঞ্জিন।"
          ),
          sec(
            "Pipes and redirection",
            "পাইপ আর রিডাইরেকশন",
            "The `|` symbol feeds one command's output into another; `>` writes it to files. Mastering pipes turns the shell into a programming language.",
            "`|` চিহ্ন একটি কমান্ডের আউটপুট অন্যটিতে ঢেলে দেয়; `>` লিখে দেয় ফাইলে। পাইপ আয়ত্তে এনে ফেললে শেল হয়ে ওঠে প্রোগ্রামিং ভাষা।"
          ),
        ],
        quiz: {
          q: "What does the command `cat auth.log | grep Failed` do?",
          qBn: "`cat auth.log | grep Failed` কমান্ডটি কী করে?",
          opts: [
            "Deletes all failed login entries",
            "Prints only the lines of auth.log containing the word 'Failed'",
            "Encrypts the log file with a key named Failed",
            "Creates a new user called Failed",
          ],
          optsBn: [
            "সব ব্যর্থ লগইন এন্ট্রি ডিলিট করে",
            "auth.log-এর শুধু 'Failed' শব্দযুক্ত লাইনগুলো প্রিন্ট করে",
            "Failed নামের কী দিয়ে লগ ফাইল এনক্রিপ্ট করে",
            "Failed নামে নতুন ইউজার তৈরি করে",
          ],
          answer: 1,
          explain:
            "The pipe passes cat's output into grep, which filters and prints only matching lines.",
          explainBn:
            "পাইপটি cat-এর আউটপুট grep-এ পাঠায়, যা শুধু মিলে যাওয়া লাইনগুলো ফিল্টার করে দেখায়।",
        },
      },
      {
        id: "c2-3",
        title: "Files, Permissions & chmod",
        titleBn: "ফাইল, পারমিশন ও chmod",
        minutes: 7,
        keywords: ["chmod", "permissions", "rwx", "root", "file"],
        intro:
          "Linux wraps every file in a permission grid: read, write, execute — for owner, group, and others. Misconfigurations here open real backdoors.",
        introBn:
          "লিনাক্স প্রতিটি ফাইলকে মোড়ানো রাখে পারমিশন গ্রিডে: রিড, রাইট, এক্সিকিউট — মালিক, গ্রুপ আর অন্যদের জন্য। এখানকার ভুল কনফিগারেশনই খুলে দেয় আসল ব্যাকডোর।",
        sections: [
          sec(
            "Reading ls -l",
            "ls -l পড়া শিখো",
            "`-rwxr-x--- owner group file` — ten characters telling exactly who may read, write or run the file. Learn to read this grid at a glance.",
            "`-rwxr-x--- owner group file` — দশটি অক্ষর বলে দেয় কে ফাইলটি পড়তে, লিখতে বা চালাতে পারে। এই গ্রিড এক নজরে পড়তে শেখো।"
          ),
          sec(
            "chmod math: 755 and 600",
            "chmod অঙ্ক: 755 আর 600",
            "r=4, w=2, x=1. chmod 755 means full power for the owner, read+execute for everyone else. 600 locks a file to the owner only.",
            "r=4, w=2, x=1। chmod 755 মানে মালিকের পূর্ণ ক্ষমতা, বাকি সবার জন্য পড়া+চালানো। 600 দিয়ে ফাইল শুধু মালিকের জন্যই তালাবদ্ধ থাকে।"
          ),
          sec(
            "World-writable disasters",
            "ওয়ার্ল্ড-রাইটেবল বিপর্যয়",
            "A 777 script in a web directory is a free shell for any visitor. Permission audits are on every attacker's checklist — and every defender's.",
            "ওয়েব ডিরেক্টরিতে 777 পারমিশনের স্ক্রিপ্ট মানে যেকোনো ভিজিটরের জন্য ফ্রি শেল। পারমিশন অডিট থাকে প্রতিটি অ্যাটাকারের চেকলিস্টে — আর প্রতিটি ডিফেন্ডারেরও।"
          ),
        ],
        quiz: {
          q: "After `chmod 600 secret.txt`, who can read the file?",
          qBn: "`chmod 600 secret.txt` চালানোর পর ফাইলটি কে পড়তে পারবে?",
          opts: ["Any user on the system", "Only the file's owner", "Only the root user, never the owner", "Members of the file's group"],
          optsBn: ["সিস্টেমের যেকোনো ইউজার", "শুধু ফাইলের মালিক", "শুধু root ইউজার, মালিকও নয়", "ফাইলের গ্রুপের সদস্যরা"],
          answer: 1,
          explain:
            "6 = read+write for the owner; the two zeros give group and others nothing. (root bypasses checks, but among normal users only the owner reads.)",
          explainBn:
            "6 = মালিকের পড়া+লেখা; দুই শূন্যে গ্রুপ ও অন্যরা কিছুই পায় না। (root সব পেরিয়ে যায়, তবে সাধারণ ইউজারদের মধ্যে শুধু মালিকই পড়তে পারে।)",
        },
      },
      {
        id: "c2-4",
        title: "Processes & System Monitoring",
        titleBn: "প্রসেস ও সিস্টেম মনিটরিং",
        minutes: 6,
        keywords: ["ps", "top", "kill", "process", "daemon"],
        intro:
          "Every running program is a process with an ID, owner and appetite. Watching them is how you spot both crashes and intruders.",
        introBn:
          "চলমান প্রতিটি প্রোগ্রাম একেকটি প্রসেস, যার আছে আইডি, মালিক আর ক্ষুধা। এদের পর্যবেক্ষণেই ধরা পড়ে ক্র্যাশ, ধরা পড়ে অনুপ্রবেশকারী।",
        sections: [
          sec(
            "ps and top",
            "ps আর top",
            "`ps aux` snapshots every process; `top` or `htop` streams CPU and memory live. A weird process burning CPU at 3 AM deserves your attention.",
            "`ps aux` সব প্রসেসের স্ন্যাপশট নেয়; `top` বা `htop` দেখায় লাইভ CPU ও মেমরি। রাত ৩টায় CPU খাওয়া অদ্ভুত প্রসেস অবশ্যই তোমার নজর চায়।"
          ),
          sec(
            "kill and signals",
            "kill আর সিগন্যাল",
            "kill sends signals: 15 asks politely, 9 executes instantly. Attackers kill logging agents; defenders kill beacons. Same tool, opposite missions.",
            "kill পাঠায় সিগন্যাল: 15 নম্রভাবে অনুরোধ করে, 9 মুহূর্তে শেষ করে। অ্যাটাকার হত্যা করে লগিং এজেন্ট; ডিফেন্ডার হত্যা করে বিকন। একই টুল, উল্টো মিশন।"
          ),
          sec(
            "Background daemons",
            "ব্যাকগ্রাউন্ড ডিমন",
            "Services ending in 'd' (sshd, cron) run silently for years. Persistence mechanisms hide here — check what's scheduled with `crontab -l` and systemd.",
            "'d'-শেষ সার্ভিসগুলো (sshd, cron) নিঃশব্দে বছরের পর বছর চলে। পার্সিস্টেন্স মেকানিজম এখানেই লুকায় — `crontab -l` ও systemd দিয়ে দেখো কী চলছে।"
          ),
        ],
        quiz: {
          q: "What's the difference between `kill -15` and `kill -9`?",
          qBn: "`kill -15` আর `kill -9`-এর পার্থক্য কী?",
          opts: [
            "15 kills faster than 9",
            "15 asks the process to terminate gracefully; 9 forces immediate death that cannot be ignored",
            "9 only works on Windows processes",
            "There is no difference at all",
          ],
          optsBn: [
            "15, 9-এর চেয়ে দ্রুত কাজ করে",
            "15 প্রসেসকে শান্তিপূর্ণভাবে বন্ধ হতে বলে; 9 জোর করে তাৎক্ষণিক শেষ করে, যা উপেক্ষা করা যায় না",
            "9 শুধু উইন্ডোজ প্রসেসে কাজ করে",
            "কোনো পার্থক্যই নেই",
          ],
          answer: 1,
          explain:
            "SIGTERM (15) is a polite request a process can handle or ignore; SIGKILL (9) is delivered by the kernel directly — no cleanup, no refusal.",
          explainBn:
            "SIGTERM (15) হলো নম্র অনুরোধ, প্রসেস সেটা সামলাতে বা উপেক্ষা করতে পারে; SIGKILL (9) সরাসরি কার্নেল দেয় — পরিষ্কারের সুযোগ নেই, অস্বীকারের সুযোগ নেই।",
        },
      },
      {
        id: "c2-5",
        title: "Users, sudo & Privilege Escalation",
        titleBn: "ইউজার, sudo ও প্রিভিলেজ এস্কেলেশন",
        minutes: 8,
        keywords: ["sudo", "root", "privilege", "escalation", "suid"],
        intro:
          "Getting in as a normal user is just the lobby. The real prize is root — and the ladder up is called privilege escalation.",
        introBn:
          "সাধারণ ইউজার হয়ে ঢুকে পড়া মানে শুধু লবিতে পৌঁছানো। আসল পুরস্কার হলো root — আর উপরে ওঠার সিঁড়ির নাম প্রিভিলেজ এস্কেলেশন।",
        sections: [
          sec(
            "root and the sudo club",
            "root আর sudo ক্লাব",
            "root is UID 0 — the god account. sudo lets trusted users borrow that power per-command, and every use is logged.",
            "root হলো UID 0 — ঈশ্বর-অ্যাকাউন্ট। sudo বিশ্বস্ত ইউজারদের কমান্ডে-কমান্ডে সেই ক্ষমতা ধার দেয়, আর প্রতিটি ব্যবহার লগ হয়।"
          ),
          sec(
            "The SUID bit",
            "SUID বিট",
            "A SUID binary runs with its owner's power no matter who launches it. A misconfigured SUID tool is the classic stairs from user to root.",
            "SUID বিটযুক্ত বাইনারি চলে মালিকের ক্ষমতায়, চালায় যেই না কেন। ভুল কনফিগার করা SUID টুলই হলো ইউজার থেকে root-এ যাওয়ার ক্লাসিক সিঁড়ি।"
          ),
          sec(
            "Enumeration: linpeas thinking",
            "এনুমারেশন: linpeas-চিন্তা",
            "Escalation checklists hunt weak configs: writable /etc/passwd, leaked credentials, old kernels with public exploits, sudo rights on odd binaries.",
            "এস্কেলেশন চেকলিস্ট খোঁজে দুর্বল কনফিগ: রাইটেবল /etc/passwd, ফাঁস হওয়া ক্রেডেনশিয়াল, পাবলিক এক্সপ্লয়েটযুক্ত পুরনো কার্নেল, অদ্ভুত বাইনারিতে sudo-অধিকার।"
          ),
        ],
        quiz: {
          q: "A binary with the SUID bit set runs with the privileges of…",
          qBn: "SUID বিটসহ বাইনারি কার ক্ষমতা নিয়ে চলে…",
          opts: [
            "Whoever executed it",
            "The file's owner, regardless of who executes it",
            "The www-data web user always",
            "Nobody — SUID disables execution",
          ],
          optsBn: [
            "যে এটি চালালো",
            "ফাইলের মালিক — চালাচ্ছে যেই না কেন",
            "সবসময় www-data ওয়েব ইউজারের",
            "কারোই না — SUID চালানোই বন্ধ করে দেয়",
          ],
          answer: 1,
          explain:
            "SUID makes the process adopt the file owner's effective user ID — if root owns it, the program runs as root.",
          explainBn:
            "SUID থাকলে প্রসেসটি পায় ফাইল-মালিকের কার্যকর ইউজার আইডি — মালিক root হলে প্রোগ্রামও চলে root হয়ে।",
        },
      },
      {
        id: "c2-6",
        title: "Networking Tools — ip, netstat & nmap",
        titleBn: "নেটওয়ার্কিং টুলস — ip, netstat ও nmap",
        minutes: 8,
        keywords: ["nmap", "netstat", "ip", "scan", "ports"],
        intro:
          "You cannot attack — or defend — what you cannot see. These tools are the flashlights that illuminate entire networks.",
        introBn:
          "যা দেখতে পাও না, তা আক্রমণও করা যায় না, প্রতিরক্ষাও। এই টুলগুলো সেই টর্চলাইট, যা পুরো নেটওয়ার্ক আলোকিত করে।",
        sections: [
          sec(
            "ip & netstat on your own box",
            "নিজের মেশিনে ip আর netstat",
            "`ip a` lists interfaces and addresses; `netstat -tulpn` shows which programs hold which ports open. Baseline knowledge = anomaly detection.",
            "`ip a` দেখায় ইন্টারফেস ও ঠিকানা; `netstat -tulpn` বলে কোন প্রোগ্রাম কোন পোর্ট খুলে রেখেছে। স্বাভাবিক অবস্থা জানা মানেই অনিয়ম শনাক্ত করা।"
          ),
          sec(
            "nmap — the cartographer",
            "nmap — মানচিত্রকার",
            "nmap discovers live hosts, open ports, running services and even operating systems. `-sV` fingerprints versions; `-O` guesses the OS.",
            "nmap খুঁজে বের করে জীবন্ত হোস্ট, খোলা পোর্ট, চলমান সার্ভিস, এমনকি অপারেটিং সিস্টেম। `-sV` চেনে ভার্সন; `-O` অনুমান করে OS।"
          ),
          sec(
            "Stealth and speed tradeoffs",
            "স্টেলথ বনাম গতির ট্রেডঅফ",
            "A noisy `-A` scan lights up every IDS in the building; a slow `-T1` SYN scan whispers under thresholds. Great operators tune timing to the mission.",
            "ঝামেলাপূর্ণ `-A` স্ক্যান জ্বালিয়ে দেয় বিল্ডিংয়ের সব IDS; ধীর `-T1` SYN স্ক্যান ফিসফিস করে থ্রেশহোল্ডের নিচে। দক্ষ অপারেটররা মিশন অনুযায়ী টাইমিং ঠিক করে।"
          ),
        ],
        quiz: {
          q: "Which nmap flag detects service VERSIONS on open ports?",
          qBn: "খোলা পোর্টের সার্ভিসের ভার্সন শনাক্ত করে কোন nmap ফ্ল্যাগ?",
          opts: ["-O", "-sV", "-p-", "-T5"],
          optsBn: ["-O", "-sV", "-p-", "-T5"],
          answer: 1,
          explain:
            "`-sV` probes each open port to identify the service and its version; `-O` targets the OS instead.",
          explainBn:
            "`-sV` প্রতিটি খোলা পোর্ট প্রোব করে সার্ভিস ও তার ভার্সন চেনে; `-O` টার্গেট করে অপারেটিং সিস্টেম।",
        },
      },
      {
        id: "c2-7",
        title: "Bash Scripting — Automate Everything",
        titleBn: "ব্যাশ স্ক্রিপ্টিং — সবকিছু অটোমেট করো",
        minutes: 7,
        keywords: ["bash", "script", "automation", "loop", "variable"],
        intro:
          "A hacker who can't script repeats themselves forever. Ten lines of bash can scan a thousand hosts while you drink coffee.",
        introBn:
          "যে হ্যাকার স্ক্রিপ্ট পারে না, সে বারবার একই কাজ করে। দশ লাইনের bash স্ক্যান করতে পারে হাজার হোস্ট — তুমি ততক্ষণে কফি শেষ করো।",
        sections: [
          sec(
            "Variables and loops",
            "ভেরিয়েবল আর লুপ",
            "`for ip in $(cat hosts.txt); do ping -c1 $ip; done` — loops multiply your hands. Variables remember; conditions decide.",
            "`for ip in $(cat hosts.txt); do ping -c1 $ip; done` — লুপ তোমার হাতকে গুণে দেয় হাজারে। ভেরিয়েবল মনে রাখে; কন্ডিশন সিদ্ধান্ত নেয়।"
          ),
          sec(
            "Your first scanner",
            "তোমার প্রথম স্ক্যানার",
            "Five lines looping nmap over a subnet, logging to timestamped files, is already a professional-grade recon collector.",
            "সাবনেট জুড়ে nmap ঘোরানো পাঁচ লাইন, টাইমস্ট্যাম্পযুক্ত ফাইলে লগ — এটুকুতেই তৈরি প্রফেশনাল-মানের রিকন সংগ্রাহক।"
          ),
          sec(
            "Cron: scripts on rails",
            "Cron: রেললাইনে স্ক্রিপ্ট",
            "Schedule scripts with cron to run at 3 AM daily. Attackers abuse it for persistence; defenders use it for integrity checks.",
            "cron দিয়ে স্ক্রিপ্ট চালু রাখো প্রতিদিন ভোর ৩টায়। অ্যাটাকাররা একে কাজে লাগায় পার্সিস্টেন্সে; ডিফেন্ডাররা ইন্টিগ্রিটি চেকে।"
          ),
        ],
        quiz: {
          q: "In bash, what does `$(cat hosts.txt)` do inside a loop?",
          qBn: "bash-এ লুপের ভেতরে `$(cat hosts.txt)` কী করে?",
          opts: [
            "Deletes hosts.txt after reading",
            "Runs `cat hosts.txt` and substitutes its output into the command line",
            "Encrypts the file with the loop variable",
            "Mounts hosts.txt as a filesystem",
          ],
          optsBn: [
            "পড়ার পর hosts.txt ডিলিট করে",
            "`cat hosts.txt` চালিয়ে তার আউটপুট কমান্ডলাইনে বসিয়ে দেয়",
            "লুপ ভেরিয়েবল দিয়ে ফাইলটি এনক্রিপ্ট করে",
            "hosts.txt-কে ফাইলসিস্টেম হিসেবে মাউন্ট করে",
          ],
          answer: 1,
          explain:
            "Command substitution $( ) executes the inner command and pastes its output in place — feeding the host list to the loop.",
          explainBn:
            "কমান্ড সাবস্টিটিউশন $( ) ভেতরের কমান্ড চালিয়ে আউটপুট সেখানেই বসিয়ে দেয় — ফলে লুপ পায় পুরো হোস্ট তালিকা।",
        },
      },
    ],
  },
  {
    id: "c3",
    title: "Web Hacking & Bug Bounty",
    titleBn: "ওয়েব হ্যাকিং ও বাগ বাউন্টি",
    tagline: "Learn how websites get broken — and how to report them responsibly.",
    taglineBn: "ওয়েবসাইট কীভাবে ভাঙা হয়, আর কীভাবে দায়িত্বশীলভাবে রিপোর্ট করতে হয় — শিখো।",
    icon: "globe",
    hue: "from-fuchsia-500/25 to-cyan-500/20",
    chapters: [
      {
        id: "c3-1",
        title: "How the Web Actually Works",
        titleBn: "ওয়েব আসলে কীভাবে কাজ করে",
        minutes: 6,
        keywords: ["http", "cookies", "session", "request", "response"],
        intro:
          "Every time you click, your browser sends a request and the website sends back a page. Understanding this simple exchange is the first step to understanding web hacking.",
        introBn:
          "তুমি ক্লিক করলে তোমার ব্রাউজার একটি রিকোয়েস্ট পাঠায়, আর ওয়েবসাইট একটি পেজ ফেরত দেয়। এই সহজ আদান-প্রদান বোঝাই ওয়েব হ্যাকিং বোঝার প্রথম ধাপ।",
        sections: [
          sec(
            "Stateless by design",
            "ডিজাইনেই স্টেটলেস",
            "HTTP forgets you between requests. Sessions and tokens rebuild your identity every time — usually via a cookie carrying a session ID.",
            "HTTP প্রতিটি রিকোয়েস্টের পর তোমাকে ভুলে যায়। সেশন আর টোকেন প্রতিবার তোমার পরিচয় পুনর্গঠন করে — সাধারণত সেশন আইডি বহনকারী কুকির মাধ্যমে।"
          ),
          sec(
            "Anatomy of a request",
            "রিকোয়েস্টের শারীরস্থান",
            "Method, path, headers, body. Four pieces of text decide everything the server does. Change one byte and the application may behave completely differently.",
            "মেথড, পাথ, হেডার, বডি — টেক্সটের এই চার অংশই ঠিক করে সার্ভার কী করবে। এক বাইট বদলালেই অ্যাপ্লিকেশন হুবহু অন্যরকম আচরণ করতে পারে।"
          ),
          sec(
            "Client-side vs server-side",
            "ক্লায়েন্ট-সাইড বনাম সার্ভার-সাইড",
            "Anything enforced only in your browser is decoration. Real trust boundaries live on the server — which is why pros always test the server directly.",
            "শুধু ব্রাউজারে প্রয়োগকৃত যেকোনো নিয়ম হলো সাজসজ্জা মাত্র। আসল ট্রাস্ট বাউন্ডারি থাকে সার্ভারে — তাই প্রোরা সবসময় সরাসরি সার্ভারকেই টেস্ট করে।"
          ),
        ],
        quiz: {
          q: "Why is HTTP called 'stateless'?",
          qBn: "HTTP-কে 'স্টেটলেস' বলা হয় কেন?",
          opts: [
            "It cannot transfer files",
            "Each request is independent; the protocol itself remembers nothing between requests",
            "It only works in the United States",
            "It deletes cookies automatically",
          ],
          optsBn: [
            "এটি ফাইল ট্রান্সফার করতে পারে না",
            "প্রতিটি রিকোয়েস্ট স্বাধীন; প্রোটোকল নিজে রিকোয়েস্টগুলোর মাঝে কিছু মনে রাখে না",
            "এটি শুধু যুক্তরাষ্ট্রে কাজ করে",
            "এটি স্বয়ংক্রিয়ভাবে কুকি মুছে দেয়",
          ],
          answer: 1,
          explain:
            "HTTP carries no memory between requests — sessions, cookies and tokens bolt state on top of a forgetful protocol.",
          explainBn:
            "HTTP রিকোয়েস্টের মাঝে কোনো স্মৃতি বহন করে না — সেশন, কুকি আর টোকেন এই ভোলা প্রোটোকলের ওপর বসায় স্টেট।",
        },
      },
      {
        id: "c3-2",
        title: "Recon & OSINT on Targets",
        titleBn: "টার্গেটে রিকন ও ওএসআইএনটি",
        minutes: 7,
        keywords: ["recon", "osint", "subdomain", "gobuster", "enumeration"],
        intro:
          "Professionals spend 70% of their time looking, and 30% breaking. The map you build decide a hunt's success before the first payload fires.",
        introBn:
          "প্রোরা সময়ের ৭০% ব্যয় করে দেখতে, ৩০% ভাঙতে। প্রথম পেলোড ছোড়ার আগেই তোমার বানানো মানচিত্রই ঠিক করে দেয় শিকার সফল হবে কি না।",
        sections: [
          sec(
            "Subdomain harvesting",
            "সাবডোমেইন হার্ভেস্টিং",
            "dev., staging., api., old. — forgotten subdomains host forgotten vulnerabilities. Tools like subfinder and crt.sh pull them out of public data.",
            "dev., staging., api., old. — ভুলে যাওয়া সাবডোমেইনে থাকে ভুলে যাওয়া দুর্বলতা। subfinder আর crt.sh-এর মতো টুল এগুলো বের করে আনে পাবলিক ডেটা থেকে।"
          ),
          sec(
            "Content discovery",
            "কনটেন্ট ডিসকভারি",
            "gobuster and feroxbuster brute-force paths like /admin and /backup.zip against wordlists. One forgotten directory can hand you the keys to the kingdom.",
            "gobuster আর feroxbuster ওয়ার্ডলিস্ট দিয়ে ব্রুট-ফোর্স করে /admin বা /backup.zip-এর মতো পাথ। একটি ভুলে যাওয়া ডিরেক্টরিই হাতিয়ে দিতে পারে পুরো রাজ্যের চাবি।"
          ),
          sec(
            "Tech fingerprinting",
            "টেক ফিঙ্গারপ্রিন্টিং",
            "Headers, cookies and error pages leak what stack a site runs. Knowing it's WordPress 5.8 tells you exactly which public exploits to try first.",
            "হেডার, কুকি আর এরর পেজ ফাঁস করে দেয় সাইটটি কোন স্ট্যাকে চলে। জেনে গেলে এটি WordPress 5.8, বোঝা যাচ্ছে কোন পাবলিক এক্সপ্লয়েট আগে চালাতে হবে।"
          ),
        ],
        quiz: {
          q: "What is the primary goal of the recon phase?",
          qBn: "রিকন ফেজের প্রধান লক্ষ্য কী?",
          opts: [
            "Immediately exploit the login page",
            "Map the target's attack surface before launching any attack",
            "Delete logs from the target server",
            "Social-engineer the CEO's password",
          ],
          optsBn: [
            "সাথে সাথে লগইন পেজে অ্যাটাক করা",
            "কোনো অ্যাটাক চালানোর আগে টার্গেটের অ্যাটাক সারফেস ম্যাপ করা",
            "টার্গেট সার্ভার থেকে লগ ডিলিট করা",
            "CEO-এর পাসওয়ার্ড সোশ্যাল-ইঞ্জিনিয়ার করা",
          ],
          answer: 1,
          explain:
            "Recon builds the map: subdomains, paths, technologies, people. Attacks aimed at a mapped surface succeed far more often.",
          explainBn:
            "রিকন বানায় মানচিত্র: সাবডোমেইন, পাথ, প্রযুক্তি, মানুষ। ম্যাপ করা সারফেসে নিশানা নেওয়া অ্যাটাক অনেক বেশি সফল হয়।",
        },
      },
      {
        id: "c3-3",
        title: "SQL Injection — Breaking the Gate",
        titleBn: "এসকিউএল ইনজেকশন — দরজা ভাঙার শিল্প",
        minutes: 9,
        keywords: ["sqli", "sqlmap", "injection", "database", "or 1=1"],
        intro:
          "When user input becomes database grammar, attackers start writing poetry. SQLi has topped vulnerability charts for two decades.",
        introBn:
          "যখন ইউজার ইনপুট হয়ে যায় ডেটাবেজের ব্যাকরণের অংশ, অ্যাটাকাররা তখন কবিতা লিখতে শুরু করে। দুই দশক ধরে SQLi দুর্বলতার তালিকায় সেরা।",
        sections: [
          sec(
            "The magic payload",
            "জাদুকরী পেলোড",
            "' OR '1'='1 turns 'WHERE user = X AND pass = Y' into an always-true statement. The database obeys — and the login gate swings open.",
            "' OR '1'='1 দিয়ে 'WHERE user = X AND pass = Y' হয়ে যায় সবসময়-সত্য শর্ত। ডেটাবেজ আজ্ঞা মেনে চলে — আর লগইনের দরজা খুলে যায়।"
          ),
          sec(
            "UNION and blind extraction",
            "UNION আর ব্লাইন্ড এক্সট্রাকশন",
            "UNION SELECT stitches attacker queries onto real results. Blind SQLi asks yes/no questions one bit at a time. sqlmap automates both flawlessly.",
            "UNION SELECT জোড়া দেয় অ্যাটাকারের কোয়েরি আসল রেজাল্টের সাথে। ব্লাইন্ড SQLi জিজ্ঞেস করে হ্যাঁ/না প্রশ্ন — বিট ধরে বিট। sqlmap দুটোই নিখুঁতভাবে অটোমেট করে।"
          ),
          sec(
            "The fix: parameterization",
            "সমাধান: প্যারামিটারাইজেশন",
            "Prepared statements keep data and grammar in separate channels forever. One line of fix destroys an entire vulnerability class.",
            "প্রিপেয়ার্ড স্টেটমেন্ট ডেটা আর ব্যাকরণকে চিরকাল আলাদা চ্যানেলে রাখে। এক লাইনের ফিক্স শেষ করে দেয় পুরো একটি দুর্বলতা-শ্রেণী।"
          ),
        ],
        quiz: {
          q: "What makes SQL injection possible?",
          qBn: "SQL ইনজেকশন সম্ভব হয় কিসের কারণে?",
          opts: [
            "Databases are inherently weak software",
            "User input is concatenated directly into SQL queries",
            "HTTPS is disabled on the site",
            "The site loads too many JavaScript files",
          ],
          optsBn: [
            "ডেটাবেজ সফটওয়্যার জন্মগতভাবে দুর্বল",
            "ইউজার ইনপুট সরাসরি SQL কোয়েরির সাথে জোড়া লাগানো হয়",
            "সাইটে HTTPS বন্ধ থাকে",
            "সাইটে বেশি জাভাস্ক্রিপ্ট ফাইল লোড হয়",
          ],
          answer: 1,
          explain:
            "String-concatenating input into queries lets attackers rewrite the SQL grammar itself. Parameterized queries separate the two channels.",
          explainBn:
            "ইনপুট স্ট্রিং-কনক্যাট করে কোয়েরিতে বসালে অ্যাটাকার SQL-এর ব্যাকরণই নতুন করে লিখে ফেলতে পারে। প্যারামিটারাইজড কোয়েরি দুই চ্যানেলকে আলাদা রাখে।",
        },
      },
      {
        id: "c3-4",
        title: "XSS — Cross-Site Scripting",
        titleBn: "XSS — ক্রস-সাইট স্ক্রিপ্টিং",
        minutes: 8,
        keywords: ["xss", "javascript", "reflected", "stored", "dom"],
        intro:
          "XSS turns a website into your puppet stage: your JavaScript runs in the victim's trusted browser, with their cookies and their account.",
        introBn:
          "XSS ওয়েবসাইটকে বানিয়ে দেয় তোমার পুতুলনাচের মঞ্চ: তোমার জাভাস্ক্রিপ্ট চলে ভুক্তভোগীর বিশ্বস্ত ব্রাউজারে — তার কুকি, তার অ্যাকাউন্টসহ।",
        sections: [
          sec(
            "Three flavors: reflected, stored, DOM",
            "তিন স্বাদ: রিফ্লেক্টেড, স্টোরড, DOM",
            "Reflected bounces off URLs; stored hides in databases and hits every visitor; DOM lives purely in JavaScript. Stored XSS is the crown jewel.",
            "রিফ্লেক্টেড ছুঁড়ে মারে URL থেকে; স্টোরড লুকিয়ে থাকে ডেটাবেজে, আঘাত করে প্রতিটি ভিজিটরকে; DOM থাকে পুরোপুরি জাভাস্ক্রিপ্টে। স্টোরড XSS-ই রাজমুকুট।"
          ),
          sec(
            "Beyond alert(1)",
            "alert(1)-এর আড়ালে",
            "Real XSS steals session cookies, keylogs passwords, and forges admin actions. The boring popup is just the knock on the door.",
            "আসল XSS চুরি করে সেশন কুকি, কীলগ করে পাসওয়ার্ড, জালিয়াতি করে অ্যাডমিন অ্যাকশন। বোরিং পপআপটা শুধু দরজায় ধাক্কা।"
          ),
          sec(
            "Output encoding saves lives",
            "আউটপুট এনকোডিং বাঁচায় অ্যাপ",
            "Encode < > \" on output and the browser renders text instead of executing it. Frameworks do this by default — until a developer opts out.",
            "আউটপুটে < > \" এনকোড করলে ব্রাউজার টেক্সট রেন্ডার করে, চালায় না। ফ্রেমওয়ার্ক এটা ডিফল্টভাবেই করে — যতক্ষণ ডেভেলপার নিজে বন্ধ না করে।"
          ),
        ],
        quiz: {
          q: "Which XSS type persists in the application's database and attacks every visitor?",
          qBn: "কোন ধরনের XSS অ্যাপ্লিকেশনের ডেটাবেজে জমা থেকে প্রতিটি ভিজিটরকে আক্রমণ করে?",
          opts: ["Reflected XSS", "Stored XSS", "DOM-based XSS", "Blind clickjacking"],
          optsBn: ["রিফ্লেক্টেড XSS", "স্টোরড XSS", "DOM-ভিত্তিক XSS", "ব্লাইন্ড ক্লিকজ্যাকিং"],
          answer: 1,
          explain:
            "Stored XSS saves the payload server-side (comments, profiles), so every future page view triggers it — the most dangerous variant.",
          explainBn:
            "স্টোরড XSS পেলোড সার্ভারে জমা রাখে (কমেন্ট, প্রোফাইল), ফলে পরবর্তী প্রতিটি পেজ-ভিউতেই সেটি ট্রিগার হয় — এটাই সবচেয়ে বিপজ্জনক রূপ।",
        },
      },
      {
        id: "c3-5",
        title: "IDOR & Broken Access Control",
        titleBn: "IDOR ও ভাঙা অ্যাক্সেস কন্ট্রোল",
        minutes: 7,
        keywords: ["idor", "access control", "authorization", "bac"],
        intro:
          "Change /invoice?id=100 to ?id=101 and read a stranger's bill. The simplest bug class on earth pays some of the biggest bounties.",
        introBn:
          "/invoice?id=100 বদলে ?id=101 লিখে অপরিচিতের বিল পড়ে ফেলো। পৃথিবীর সবচেয়ে সরল বাগ-শ্রেণী দিয়ে যায় সবচেয়ে মোটা বাউন্টিগুলোর কিছু।",
        sections: [
          sec(
            "Authentication ≠ authorization",
            "অথেন্টিকেশন ≠ অথরাইজেশন",
            "Being logged in proves WHO you are, not WHAT you may touch. Servers must check ownership on every object, every request, every time.",
            "লগইন প্রমাণ করে তুমি KE, কিন্তু তুমি KI ছুঁতে পারো তা নয়। সার্ভারকে প্রতিটি অবজেক্টে, প্রতিটি রিকোয়েস্টে, প্রতিবার মালিকানা যাচাই করতে হবে।"
          ),
          sec(
            "Hunting IDORs",
            "IDOR শিকারের কৌশল",
            "Look for numeric IDs, GUIDs and filenames in URLs, APIs and hidden form fields. Increment, swap accounts, replay. Automation makes it trivial.",
            "URL, API ও হিডেন ফর্ম ফিল্ডে সংখ্যাসূচক আইডি, GUID ও ফাইলনেম খোঁজো। বাড়াও, অ্যাকাউন্ট বদলাও, রিপ্লে করো। অটোমেশন এটাকে করে তোলে সহজসাধ্য।"
          ),
          sec(
            "Function-level gaps",
            "ফাংশন-লেভেল ফাঁক",
            "Hiding the admin button in the UI means nothing if GET /admin still answers to regular users. Always test the endpoint, never trust the menu.",
            "UI-তে অ্যাডমিন বোতাম লুকালেই লাভ নেই, যদি GET /admin সাধারণ ইউজারকেও উত্তর দেয়। সবসময় এন্ডপয়েন্ট টেস্ট করো, মেনুকে কখনো বিশ্বাস নয়।"
          ),
        ],
        quiz: {
          q: "An IDOR vulnerability fundamentally means the server failed to check…",
          qBn: "IDOR দুর্বলতা মূলত বোঝায় সার্ভার যাচাই করতে ব্যর্থ হয়েছে…",
          opts: [
            "Whether the user's password is strong enough",
            "Whether the requesting user is authorized to access the specific object",
            "Whether the TLS certificate is expired",
            "Whether the request used the POST method",
          ],
          optsBn: [
            "ইউজারের পাসওয়ার্ড যথেষ্ট শক্তিশালী কি না",
            "রিকোয়েস্টকারী ইউজার নির্দিষ্ট অবজেক্টটি অ্যাক্সেস করার অনুমোদিত কি না",
            "TLS সার্টিফিকেটের মেয়াদ শেষ কি না",
            "রিকোয়েস্টে POST মেথড ব্যবহার হয়েছে কি না",
          ],
          answer: 1,
          explain:
            "IDOR = missing object-level authorization. The server serves whatever ID you ask for, never checking it belongs to you.",
          explainBn:
            "IDOR মানে অবজেক্ট-লেভেল অথরাইজেশনের অনুপস্থিতি। সার্ভার যে আইডি চাও সেটাই দিয়ে দেয়, এটি তোমার কি না তা কখনো যাচাই করে না।",
        },
      },
      {
        id: "c3-6",
        title: "Burp Suite Workflow — Intercept & Repeat",
        titleBn: "Burp Suite ওয়ার্কফ্লো — ইন্টারসেপ্ট ও রিপিট",
        minutes: 7,
        keywords: ["burp", "proxy", "repeater", "intruder", "intercept"],
        intro:
          "Burp Suite is the web hacker's workbench: it sits between your browser and the target and lets you rewrite reality request by request.",
        introBn:
          "Burp Suite হলো ওয়েব হ্যাকারের কর্মক্ষেত্র: এটি বসে তোমার ব্রাউজার আর টার্গেটের মাঝখানে, আর দেয় রিকোয়েস্টে রিকোয়েস্টে বাস্তবতা লিখে দেওয়ার ক্ষমতা।",
        sections: [
          sec(
            "The intercepting proxy",
            "ইন্টারসেপ্টিং প্রক্সি",
            "Point your browser at Burp, and every request pauses mid-flight for editing. Toggle auth headers, flip IDs, remove client-side checks entirely.",
            "ব্রাউজার Burp-এর দিকে ঘোরালেই প্রতিটি রিকোয়েস্ট মাঝপথে থেমে যায় এডিটের জন্য। অথ হেডার বদলাও, আইডি পাল্টাও, ক্লায়েন্ট-সাইড চেক পুরোপুরি সরিয়ে দাও।"
          ),
          sec(
            "Repeater: surgical replays",
            "Repeater: সার্জিক্যাল রিপ্লে",
            "Send any request to Repeater and iterate by hand — change one parameter, fire, diff the response. Ninety percent of bug discoveries happen here.",
            "যেকোনো রিকোয়েস্ট Repeater-এ পাঠাও আর হাতে হাতে পরীক্ষা করো — একটি প্যারামিটার বদলাও, চালাও, রেসপন্স তুলনা করো। বাগ আবিষ্কারের ৯০% ঘটে এখানেই।"
          ),
          sec(
            "Intruder: automated fuzzing",
            "Intruder: অটোমেটেড ফাজিং",
            "Mark payload positions, load a wordlist, unleash hundreds of mutated requests and sort responses by length or status. Boring? No — beautiful.",
            "পেলোড পজিশন মার্ক করো, ওয়ার্ডলিস্ট লোড করো, ছেড়ে দাও শত শত রূপান্তরিত রিকোয়েস্ট, আর সাজাও রেসপন্স লেংথ বা স্ট্যাটাস দিয়ে। একঘেয়ে? না — চমৎকার।"
          ),
        ],
        quiz: {
          q: "What is Burp Suite's Repeater tool primarily used for?",
          qBn: "Burp Suite-এর Repeater টুল মূলত কী কাজে ব্যবহৃত হয়?",
          opts: [
            "Cracking Wi-Fi passwords",
            "Manually modifying and re-sending individual HTTP requests",
            "Scanning networks for open ports",
            "Rendering websites faster",
          ],
          optsBn: [
            "ওয়াই-ফাই পাসওয়ার্ড ভাঙা",
            "একক HTTP রিকোয়েস্ট হাতে এডিট করে বারবার পাঠানো",
            "খোলা পোর্টের জন্য নেটওয়ার্ক স্ক্যান করা",
            "ওয়েবসাইট দ্রুত রেন্ডার করা",
          ],
          answer: 1,
          explain:
            "Repeater lets you hand-craft a single request, send it, study the response, tweak and repeat — the core loop of manual web testing.",
          explainBn:
            "Repeater-এ একটি রিকোয়েস্ট হাতে বানাও, পাঠাও, রেসপন্স দেখো, আবার বদলে পাঠাও — ম্যানুয়াল ওয়েব টেস্টিংয়ের এটাই মূল চক্র।",
        },
      },
      {
        id: "c3-7",
        title: "Bug Bounty Methodology & Reporting",
        titleBn: "বাগ বাউন্টি মেথডোলজি ও রিপোর্টিং",
        minutes: 6,
        keywords: ["bounty", "report", "scope", "cvss", "responsible"],
        intro:
          "Finding the bug is half the job. The other half is proving impact in a report so clear that triagers pay you without asking questions.",
        introBn:
          "বাগ খোঁজা কাজের অর্ধেক। বাকি অর্ধেক হলো এমন পরিষ্কার রিপোর্টে ইমপ্যাক্ট প্রমাণ করা, যাতে ট্রায়াজার প্রশ্ন ছাড়াই পুরস্কার দিয়ে দেয়।",
        sections: [
          sec(
            "Scope is law",
            "স্কোপই আইন",
            "Programs define exactly which domains and techniques are allowed. Testing outside scope isn't hacking — it's just unauthorized intrusion.",
            "প্রোগ্রাম নির্দিষ্ট করে দেয় কোন ডোমেইন ও কৌশল অনুমোদিত। স্কোপের বাইরে টেস্ট করা হ্যাকিং নয় — সেটা শুধু অননুমোদিত অনুপ্রবেশ।"
          ),
          sec(
            "Severity = impact",
            "সিভেরিটি = ইমপ্যাক্ট",
            "A reflected XSS on a marketing page pays $50; the same bug on an admin panel pays $2,500. Frame your finding by what a real attacker achieves.",
            "মার্কেটিং পেজে রিফ্লেক্টেড XSS দেয় $50; একই বাগ অ্যাডমিন প্যানেলে দেয় $2,500। আসল অ্যাটাকার কী অর্জন করতে পারবে, সেই ফ্রেমেই ফাইন্ডিং উপস্থাপন করো।"
          ),
          sec(
            "Reports that pay",
            "যে রিপোর্টে টাকা আসে",
            "Title, steps to reproduce, impact, proof of concept, suggested fix. Make the triager's job easy and bounties follow your name around.",
            "শিরোনাম, রিপ্রোডিউস করার ধাপ, ইমপ্যাক্ট, প্রুফ অভ কনসেপ্ট, সম্ভাব্য ফিক্স। ট্রায়াজারের কাজ সহজ করে দাও — বাউন্টি নিজেই তোমার পেছনে আসবে।"
          ),
        ],
        quiz: {
          q: "Before testing anything in a bug bounty program, you must first verify…",
          qBn: "বাগ বাউন্টি প্রোগ্রামে কিছু টেস্ট করার আগে সবার প্রথমে যাচাই করতে হবে…",
          opts: [
            "Whether the target uses WordPress",
            "Whether the asset is inside the program's defined scope",
            "Whether you have a fast internet connection",
            "Whether the site has a login page",
          ],
          optsBn: [
            "টার্গেটটি WordPress ব্যবহার করে কি না",
            "অ্যাসেটটি প্রোগ্রামের সংজ্ঞায়িত স্কোপের ভেতরে আছে কি না",
            "তোমার দ্রুত ইন্টারনেট সংযোগ আছে কি না",
            "সাইটে লগইন পেজ আছে কি না",
          ],
          answer: 1,
          explain:
            "Scope defines legal authorization. Out-of-scope testing can be prosecutable, no matter how good your intentions are.",
          explainBn:
            "স্কোপই দেয় আইনি অনুমোদন। স্কোপের বাইরে টেস্ট আইনত দণ্ডনীয় হতে পারে, উদ্দেশ্য যতই ভালো হোক।",
        },
      },
    ],
  },
  {
    id: "c4",
    title: "Digital Forensics & OSINT",
    titleBn: "ডিজিটাল ফরেনসিক্স ও ওএসআইএনটি",
    tagline: "Investigate digital crimes and open-source clues like a detective.",
    taglineBn: "ডিজিটাল অপরাধ আর ওপেন-সোর্স ক্লু তদন্ত করো, গোয়েন্দার মতো।",
    icon: "search",
    hue: "from-amber-500/25 to-emerald-500/20",
    chapters: [
      {
        id: "c4-1",
        title: "The Forensics Mindset",
        titleBn: "ফরেনসিক্স মাইন্ডসেট",
        minutes: 6,
        keywords: ["forensics", "evidence", "chain of custody", "investigation"],
        intro:
          "Forensics is like detective work on digital evidence. Every deleted file and log can tell a story — your job is to read it without changing the evidence.",
        introBn:
          "ফরেনসিক্স হলো ডিজিটাল প্রমাণ নিয়ে গোয়েন্দাগিরি। প্রতিটি ডিলিট হওয়া ফাইল আর লগ গল্প বলে — তোমার কাজ হলো প্রমাণ অপরিবর্তিত রেখে সেটি পড়া।",
        sections: [
          sec(
            "Order of volatility",
            "ভোলাটিলিটির ক্রম",
            "RAM dies first, then caches, then disks, then backups. Capture evidence from most-fragile to most-stable, or watch it evaporate.",
            "প্রথমে মরে RAM, তারপর ক্যাশ, তারপর ডিস্ক, সবশেষে ব্যাকআপ। সবচেয়ে ভঙ্গুর থেকে সবচেয়ে স্থায়ীর দিকে এভিডেন্স সংগ্রহ করো, নইলে উধাও হয়ে যাবে।"
          ),
          sec(
            "Chain of custody",
            "চেইন অভ কাস্টডি",
            "Who touched the evidence, when, why — documented forever. Break the chain and perfect evidence becomes legally worthless paper.",
            "কে এভিডেন্স ছুঁলো, কখন, কেন — চিরকালের জন্য নথিভুক্ত। চেইন ভাঙলে নিখুঁত এভিডেন্সও আইনত মূল্যহীন কাগজে পরিণত হয়।"
          ),
          sec(
            "Hash: the evidence fingerprint",
            "হ্যাশ: এভিডেন্সের আঙুলের ছাপ",
            "Hash the disk before and after analysis — SHA-256 matching proves you altered nothing. Integrity is your entire credibility.",
            "বিশ্লেষণের আগে-পরে ডিস্ক হ্যাশ করো — SHA-256 মিললে প্রমাণিত তুমি কিছুই বদলাওনি। ইন্টিগ্রিটিই তোমার সব বিশ্বাসযোগ্যতা।"
          ),
        ],
        quiz: {
          q: "Why do investigators hash evidence with SHA-256?",
          qBn: "তদন্তকারীরা SHA-256 দিয়ে এভিডেন্স হ্যাশ করে কেন?",
          opts: [
            "To encrypt evidence from the suspect",
            "To prove evidence was not altered during analysis",
            "To compress large disk images",
            "To hide the investigator's identity",
          ],
          optsBn: [
            "সন্দেহভাজনের চোখে এভিডেন্স লুকাতে",
            "বিশ্লেষণের সময় এভিডেন্স অপরিবর্তিত ছিল তা প্রমাণ করতে",
            "বড় ডিস্ক ইমেজ কম্প্রেস করতে",
            "তদন্তকারীর পরিচয় গোপন করতে",
          ],
          answer: 1,
          explain:
            "Matching hashes before/after examination cryptographically proves integrity — the backbone of admissible evidence.",
          explainBn:
            "পরীক্ষার আগে-পরে হ্যাশ মিলে গেলে ক্রিপ্টোগ্রাফিকভাবে প্রমাণ হয় ইন্টিগ্রিটি — গ্রহণযোগ্য এভিডেন্সের এটাই মেরুদণ্ড।",
        },
      },
      {
        id: "c4-2",
        title: "File System Forensics & Metadata",
        titleBn: "ফাইল সিস্টেম ফরেনসিক্স ও মেটাডেটা",
        minutes: 7,
        keywords: ["metadata", "exiftool", "filesystem", "deleted", "carving"],
        intro:
          "Files lie; metadata doesn't. Timestamps, GPS coordinates and author names hide inside every file like invisible ink.",
        introBn:
          "ফাইল মিথ্যে বলতে পারে; মেটাডেটা পারে না। টাইমস্ট্যাম্প, GPS স্থানাঙ্ক আর লেখকের নাম লুকিয়ে থাকে প্রতিটি ফাইলে অদৃশ্য কালির মতো।",
        sections: [
          sec(
            "MAC times",
            "MAC টাইম",
            "Modified, Accessed, Created — three timestamps per file tell the story of what was touched and when. Attackers forge them; compare across artifacts.",
            "মডিফাইড, অ্যাক্সেসড, ক্রিয়েটেড — ফাইলপ্রতি তিনটি টাইমস্ট্যাম্প বলে দেয় কী কখন ছোঁয়া হয়েছে। অ্যাটাকাররা এগুলো জাল করে; আর্টিফ্যাক্ট জুড়ে মিলিয়ে দেখো।"
          ),
          sec(
            "EXIF: photos that snitch",
            "EXIF: ফাঁসকারী ছবি",
            "Camera model, serial number, exact GPS position — photos routinely leak where they were taken. exiftool reads it all in one command.",
            "ক্যামেরা মডেল, সিরিয়াল নম্বর, হুবহু GPS অবস্থান — ছবি নিয়মিত ফাঁস করে কোথায় তোলা। exiftool একটি কমান্ডেই সব পড়ে ফেলে।"
          ),
          sec(
            "Carving the deleted",
            "ডিলিট হওয়া উদ্ধার",
            "Deleting removes the pointer, not the data. File carving scans raw disk for magic bytes and resurrects 'destroyed' evidence from unallocated space.",
            "ডিলিট করে মুছে যায় পয়েন্টার, ডেটা নয়। ফাইল কার্ভিং কাঁচা ডিস্কে ম্যাজিক বাইট খুঁজে 'ধ্বংস করা' এভিডেন্স ফিরিয়ে আনে আনঅ্যালোকেটেড স্পেস থেকে।"
          ),
        ],
        quiz: {
          q: "When a file is 'deleted', what actually happens on most filesystems?",
          qBn: "ফাইল 'ডিলিট' হলে বেশিরভাগ ফাইলসিস্টেমে আসলে কী ঘটে?",
          opts: [
            "The data is instantly overwritten with zeros",
            "The file's index entry is removed but its data blocks remain until reused",
            "The disk physically burns the sectors",
            "Nothing — deletion is impossible",
          ],
          optsBn: [
            "ডেটা মুহূর্তেই শূন্য দিয়ে ওভাররাইট হয়ে যায়",
            "ফাইলের ইনডেক্স এন্ট্রি মুছে যায়, কিন্তু ডেটা ব্লক পুনর্ব্যবহারের আগ পর্যন্ত থেকে যায়",
            "ডিস্ক শারীরিকভাবে সেক্টর পুড়িয়ে দেয়",
            "কিছুই না — ডিলিট করা অসম্ভব",
          ],
          answer: 1,
          explain:
            "Deletion frees the pointer; bytes linger until overwritten — which is why forensic carving recovers 'deleted' files.",
          explainBn:
            "ডিলিটে মুছে পয়েন্টার; বাইটগুলো থেকে যায় ওভাররাইটের আগ পর্যন্ত — এই কারণেই ফরেনসিক কার্ভিং 'ডিলিট' ফাইল ফেরত আনে।",
        },
      },
      {
        id: "c4-3",
        title: "Memory & Log Analysis",
        titleBn: "মেমরি ও লগ অ্যানালিসিস",
        minutes: 8,
        keywords: ["logs", "auth.log", "memory", "volatility", "timeline"],
        intro:
          "Logs are the black box of every computer; memory is its short-term consciousness. Together they replay exactly what happened.",
        introBn:
          "লগ হলো প্রতিটি কম্পিউটারের ব্ল্যাক বক্স; মেমরি এর স্বল্পমেয়াদি চেতনা। দুটো মিলে হুবহু রিপ্লে করে কী ঘটেছিল।",
        sections: [
          sec(
            "auth.log never forgets",
            "auth.log কিছু ভোলে না",
            "Every SSH attempt, sudo command and failed login lands in logs. A burst of 4,811 'Failed password' entries at 3 AM is a brute-force signature screaming at you.",
            "প্রতিটি SSH প্রচেষ্টা, sudo কমান্ড আর ব্যর্থ লগইন জমা হয় লগে। ভোর ৩টায় ৪,৮১১টি 'Failed password' মানে চিৎকার করা ব্রুট-ফোর্স স্বাক্ষর।"
          ),
          sec(
            "Volatility in RAM",
            "RAM-এ ভোলাটিলিটি",
            "Memory dumps hold running malware, decrypted keys and live connections that never touch disk. Frameworks like Volatility dissect them process by process.",
            "মেমরি ডাম্পে থাকে চলমান ম্যালওয়্যার, ডিক্রিপ্ট করা কী আর লাইভ সংযোগ, যা কখনো ডিস্ক ছোঁয় না। Volatility-র মতো ফ্রেমওয়ার্ক প্রসেস ধরে প্রসেস এগুলো বিশ্লেষণ করে।"
          ),
          sec(
            "Building the timeline",
            "টাইমলাইন নির্মাণ",
            "Fuse logs, MAC times, browser history and network flows into one spine. Intrusion stories assemble themselves when timestamps align.",
            "লগ, MAC টাইম, ব্রাউজার হিস্ট্রি আর নেটওয়ার্ক ফ্লো মিলিয়ে গড়ো একটি মেরুদণ্ড। টাইমস্ট্যাম্প মিলে গেলে অনুপ্রবেশের গল্প নিজেই জোড়া লেগে যায়।"
          ),
        ],
        quiz: {
          q: "4,811 'Failed password' entries in auth.log within minutes most likely indicates…",
          qBn: "কয়েক মিনিটে auth.log-এ ৪,৮১১টি 'Failed password' সম্ভবত ইঙ্গিত করে…",
          opts: [
            "A hardware disk failure",
            "A brute-force login attack",
            "A normal Tuesday morning",
            "The log rotation daemon working",
          ],
          optsBn: [
            "হার্ডওয়্যার ডিস্ক বিকল হয়েছে",
            "একটি ব্রুট-ফোর্স লগইন অ্যাটাক",
            "স্বাভাবিক মঙ্গলবার সকাল",
            "লগ রোটেশন ডিমন কাজ করছে",
          ],
          answer: 1,
          explain:
            "Thousands of rapid authentication failures are the classic fingerprint of automated password guessing.",
          explainBn:
            "দ্রুতগতির হাজার হাজার অথেন্টিকেশন ব্যর্থতা হলো অটোমেটেড পাসওয়ার্ড অনুমানের ক্লাসিক ছাপ।",
        },
      },
      {
        id: "c4-4",
        title: "Steganography & Hidden Data",
        titleBn: "স্টেগানোগ্রাফি ও লুকানো ডেটা",
        minutes: 6,
        keywords: ["steganography", "steghide", "hidden", "lsb", "covert"],
        intro:
          "Encryption hides meaning; steganography hides existence itself. A vacation photo can smuggle an entire password database in plain sight.",
        introBn:
          "এনক্রিপশন লুকায় অর্থ; স্টেগানোগ্রাফি লুকায় অস্তিত্বই। একটি ছুটির ছবি প্রকাশ্যেই চোরাচালান করতে পারে পুরো পাসওয়ার্ড ডেটাবেজ।",
        sections: [
          sec(
            "LSB: the pixel trick",
            "LSB: পিক্সেলের কারসাজি",
            "The last bit of each color channel is invisible to the eye. Flip millions of them and a hidden message rides inside an untouched-looking image.",
            "প্রতিটি রঙের চ্যানেলের শেষ বিট চোখে দৃশ্যমান নয়। লক্ষ লক্ষ বিট উল্টে দিলেই একটি গোপন বার্তা চেপে বসে সম্পূর্ণ স্বাভাবিক-দেখতে ছবির ভেতর।"
          ),
          sec(
            "The defender's tools",
            "ডিফেন্ডারের টুলস",
            "steghide embeds and extracts; zsteg sniffs LSB channels; binwalk peels apart files hiding other files. CTFs and real cases both start here.",
            "steghide এমবেড ও এক্সট্রাক্ট করে; zsteg শুনে পায় LSB চ্যানেল; binwalk খুলে দেয় ফাইলের ভেতরের লুকানো ফাইল। CTF হোক বা আসল মামলা — শুরু এখানেই।"
          ),
          sec(
            "Passwords guard the payload",
            "পাসওয়ার্ড রক্ষা করে পেলোড",
            "Stego payloads are usually password-protected — which funnels the hunt back to wordlists and brute-force. Every layer is its own battle.",
            "স্টেগো পেলোড সাধারণত পাসওয়ার্ড-সুরক্ষিত — ফলে শিকার ঘুরে আসে ওয়ার্ডলিস্ট আর ব্রুট-ফোর্সে। প্রতিটি স্তর আলাদা যুদ্ধ।"
          ),
        ],
        quiz: {
          q: "LSB steganography hides data by altering…",
          qBn: "LSB স্টেগানোগ্রাফি ডেটা লুকায় পরিবর্তন করে…",
          opts: [
            "The file's filename",
            "The least significant bits of pixel color values",
            "The image's MIME type",
            "The EXIF camera model only",
          ],
          optsBn: [
            "ফাইলের ফাইলনেম",
            "পিক্সেলের রঙের মানগুলোর সর্বনিম্ন বিট (least significant bits)",
            "ছবির MIME টাইপ",
            "শুধু EXIF ক্যামেরা মডেল",
          ],
          answer: 1,
          explain:
            "Flipping the least significant bit of each RGB channel changes color imperceptibly while encoding arbitrary binary data.",
          explainBn:
            "প্রতিটি RGB চ্যানেলের সর্বনিম্ন বিট উল্টে দিলে রঙ বোঝাই যায় না, অথচ তার ভেতর এনকোড হয় খামখেয়ালি বাইনারি ডেটা।",
        },
      },
      {
        id: "c4-5",
        title: "Network Forensics — Wireshark & pcaps",
        titleBn: "নেটওয়ার্ক ফরেনসিক্স — Wireshark ও pcap",
        minutes: 8,
        keywords: ["wireshark", "pcap", "tshark", "traffic", "analysis"],
        intro:
          "A packet capture is a time machine: every byte that crossed the wire, frozen forever. Learn to read pcaps and networks stop keeping secrets.",
        introBn:
          "প্যাকেট ক্যাপচার হলো টাইম মেশিন: তার পেরিয়ে যাওয়া প্রতিটি বাইট, চিরকালের জন্য হিমায়িত। pcap পড়া জানলে নেটওয়ার্ক আর গোপনীয়তা রাখতে পারে না।",
        sections: [
          sec(
            "Capturing the wire",
            "তারের ওপর কান",
            "tcpdump and Wireshark record raw traffic into .pcap files. SPAN ports and TAPs feed them entire network segments without a sound.",
            "tcpdump আর Wireshark কাঁচা ট্রাফিক রেকর্ড করে .pcap ফাইলে। SPAN পোর্ট আর TAP তাদের খাওয়ায় পুরো নেটওয়ার্ক সেগমেন্ট — একদম নিঃশব্দে।"
          ),
          sec(
            "Display filters are scalpels",
            "ডিসপ্লে ফিল্টার হলো কাঁচি",
            "http.request, dns.qry.name contains 'evil', tcp.flags.syn==1 — filters slice millions of packets down to the five that matter.",
            "http.request, dns.qry.name contains 'evil', tcp.flags.syn==1 — ফিল্টার কেটে ফেলে লক্ষ লক্ষ প্যাকেট, রেখে দেয় মাত্র পাঁচটি গুরুত্বপূর্ণ।"
          ),
          sec(
            "Following streams",
            "স্ট্রিম ফলো করা",
            "'Follow TCP Stream' reassembles entire conversations — logins, downloads, exfiltration — into readable transcripts. Beaconing patterns pop out instantly.",
            "'Follow TCP Stream' পুরো কথোপকথন জোড়া লাগায় — লগইন, ডাউনলোড, এক্সফিলট্রেশন — পড়ার মতো ট্রান্সক্রিপ্টে। বিকনিং প্যাটার্ন তখন চোখে পড়েই যায়।"
          ),
        ],
        quiz: {
          q: "What does 'Follow TCP Stream' do in Wireshark?",
          qBn: "Wireshark-এ 'Follow TCP Stream' কী করে?",
          opts: [
            "Blocks a suspicious connection",
            "Reassembles all packets of one conversation into a readable transcript",
            "Encrypts the capture file",
            "Traces the physical cable route",
          ],
          optsBn: [
            "সন্দেহজনক সংযোগ ব্লক করে",
            "একটি কথোপকথনের সব প্যাকেট জোড়া লাগিয়ে পঠনযোগ্য ট্রান্সক্রিপ্ট বানায়",
            "ক্যাপচার ফাইল এনক্রিপ্ট করে",
            "শারীরিক ক্যাবলের পথ অনুসরণ করে",
          ],
          answer: 1,
          explain:
            "It stitches the payload bytes of a single TCP session together, reconstructing what both sides actually said.",
          explainBn:
            "এটি একটি TCP সেশনের পেলোড বাইটগুলো জোড়া লাগিয়ে ফলে, পুনর্গঠন করে দুই পক্ষ আসলে কী বলেছিল।",
        },
      },
      {
        id: "c4-6",
        title: "OSINT — Open Source Intelligence",
        titleBn: "OSINT — ওপেন সোর্স ইন্টেলিজেন্স",
        minutes: 7,
        keywords: ["osint", "google dorks", "whois", "social", "footprint"],
        intro:
          "The most powerful database on earth requires zero exploits: it's everything people already published. OSINT is the art of reading the obvious.",
        introBn:
          "পৃথিবীর সবচেয়ে শক্তিশালী ডেটাবেজে কোনো এক্সপ্লয়েট লাগে না: এটি মানুষের প্রকাশিত সবকিছুই। OSINT হলো স্পষ্ট জিনিসটি পড়ার শিল্প।",
        sections: [
          sec(
            "Google dorking",
            "গুগল ডর্কিং",
            "site:, filetype:, intitle:'index of' — search operators expose directories, spreadsheets and leaked credentials indexed by accident.",
            "site:, filetype:, intitle:'index of' — সার্চ অপারেটর বের করে দেয় ভুল করে ইনডেক্স হওয়া ডিরেক্টরি, স্প্রেডশিট আর ফাঁস হওয়া ক্রেডেনশিয়াল।"
          ),
          sec(
            "Identity pivots",
            "আইডেন্টিটি পিভট",
            "One username can unlock emails, breached passwords, photos and locations across a hundred sites. Tools like Sherlock automate the pivot in seconds.",
            "একটি ইউজারনেম খুলে দিতে পারে শত শত সাইটের ইমেইল, হ্যাক হওয়া পাসওয়ার্ড, ছবি আর লোকেশন। Sherlock-এর মতো টুল সেকেন্ডেই পিভট অটোমেট করে।"
          ),
          sec(
            "whois, DNS & breach data",
            "whois, DNS ও ব্রিচ ডেটা",
            "Domain registrations, historical DNS and breach corpora map infrastructure and people. Ethically sourced, legally bounded — that's the discipline.",
            "ডোমেইন রেজিস্ট্রেশন, ঐতিহাসিক DNS আর ব্রিচ-কর্পোরা ম্যাপ করে অবকাঠামো ও মানুষকে। নৈতিকভাবে সংগৃহীত, আইনত সীমাবদ্ধ — এটাই শৃঙ্খলা।"
          ),
        ],
        quiz: {
          q: "The Google dork `filetype:sql intext:password` searches for…",
          qBn: "`filetype:sql intext:password` গুগল-ডর্ক দিয়ে খোঁজা হয়…",
          opts: [
            "Strong password generators",
            "Publicly indexed SQL files that contain the word 'password'",
            "Encrypted password vaults",
            "Websites that require login",
          ],
          optsBn: [
            "শক্তিশালী পাসওয়ার্ড জেনারেটর",
            "পাবলিকভাবে ইনডেক্স হওয়া SQL ফাইল, যাদের ভেতরে 'password' শব্দটি আছে",
            "এনক্রিপ্ট করা পাসওয়ার্ড ভল্ট",
            "লগইন বাধ্যতামূলক ওয়েবসাইট",
          ],
          answer: 1,
          explain:
            "Dorks combine operators to surface accidentally exposed files — SQL dumps containing password columns are a classic find.",
          explainBn:
            "ডর্ক অপারেটর মিলিয়ে ভুলে প্রকাশিত ফাইল খুঁজে দেয় — পাসওয়ার্ড কলামওয়ালা SQL ডাম্প একটি ক্লাসিক খোঁজ।",
        },
      },
      {
        id: "c4-7",
        title: "Building the Case Report",
        titleBn: "কেস রিপোর্ট তৈরি",
        minutes: 5,
        keywords: ["report", "timeline", "ioc", "documentation", "case"],
        intro:
          "The best investigation that isn't documented never happened. Reports turn your terminal output into courtroom-grade narrative.",
        introBn:
          "সেরা তদন্তও যদি নথিভুক্ত না হয়, সেটি কখনো ঘটেনি। রিপোর্ট তোমার টার্মিনাল আউটপুটকে রূপ দেয় আদালত-মানের বর্ণনায়।",
        sections: [
          sec(
            "IOCs — indicators of compromise",
            "IOC — কমপ্রমাইজের নির্দেশক",
            "Malicious IPs, domains, hashes and filenames — collected IOCs let defenders hunt the same attacker across thousands of machines.",
            "দুষ্ট IP, ডোমেইন, হ্যাশ আর ফাইলনেম — সংগৃহীত IOC দিয়ে ডিফেন্ডাররা একই অ্যাটাকারকে খোঁজে হাজার হাজার মেশিন জুড়ে।"
          ),
          sec(
            "The master timeline",
            "মাস্টার টাইমলাইন",
            "03:12 brute-force starts. 03:17 success. 03:21 payload. 03:24 exfil. One clean timeline makes a 3-month intrusion readable in 3 minutes.",
            "03:12 ব্রুট-ফোর্স শুরু। 03:17 সাফল্য। 03:21 পেলোড। 03:24 এক্সফিল। একটি পরিষ্কার টাইমলাইন ৩ মাসের অনুপ্রবেশকে পড়িয়ে দেয় ৩ মিনিটে।"
          ),
          sec(
            "Write for the reader",
            "পাঠকের জন্য লেখো",
            "Executives need impact in one paragraph; engineers need replication steps. Great reports serve both without lying to either.",
            "কর্তাদের চাই এক প্যারায় ইমপ্যাক্ট; প্রকৌশলীদের চাই প্রতিলিপি করার ধাপ। দারুণ রিপোর্ট দুজনকেই সেবা করে, কাউকে মিথ্যে না বলে।"
          ),
        ],
        quiz: {
          q: "An IOC (Indicator of Compromise) is best described as…",
          qBn: "IOC (Indicator of Compromise) সবচেয়ে ভালোভাবে বর্ণনা করা যায়…",
          opts: [
            "A piece of forensic data identifying malicious activity — like a bad IP, hash, or domain",
            "A law that regulates hacking contests",
            "A backup of the victim's hard drive",
            "A type of firewall hardware",
          ],
          optsBn: [
            "দুষ্ট কার্যকলাপ শনাক্তকারী ফরেনসিক ডেটা — যেমন খারাপ IP, হ্যাশ বা ডোমেইন",
            "হ্যাকিং প্রতিযোগিতা নিয়ন্ত্রণকারী একটি আইন",
            "ভুক্তভোগীর হার্ডড্রাইভের ব্যাকআপ",
            "এক ধরনের ফায়ারওয়াল হার্ডওয়্যার",
          ],
          answer: 0,
          explain:
            "IOCs are shareable forensic artifacts that let other defenders detect the same intrusion elsewhere.",
          explainBn:
            "IOC হলো ভাগ করা যায় এমন ফরেনসিক আর্টিফ্যাক্ট, যা দিয়ে অন্য ডিফেন্ডাররা অন্য জায়গায়ও একই অনুপ্রবেশ শনাক্ত করতে পারে।",
        },
      },
    ],
  },
];

const createEmptyChapter = (courseId: string, index: number): Chapter => ({
  id: `${courseId}-chapter-${String(index + 1).padStart(2, "0")}`,
  title: `Chapter ${index + 1}`,
  titleBn: `চ্যাপ্টার ${index + 1}`,
  minutes: 1,
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
});

const networkingMasterclassTitles: Array<[string, string]> = [
  ["Class 01 — 🌐 What Is a Network?", "ক্লাস ০১ — 🌐 নেটওয়ার্ক আসলে কী?"],
  ["Class 02 — 🖥️ What Devices Are Used in a Network?", "ক্লাস ০২ — 🖥️ Network-এ কোন কোন Device থাকে?"],
  ["Class 03 — 🔗 How Do Devices Connect to Each Other?", "ক্লাস ০৩ — 🔗 Device-গুলো কীভাবে একে অপরের সঙ্গে যুক্ত হয়?"],
  ["Class 04 — 📡 What Are Wired and Wireless Networks?", "ক্লাস ০৪ — 📡 Wired ও Wireless Network কী?"],
  ["Class 05 — 🏠 How Does a Simple Home Network Work?", "ক্লাস ০৫ — 🏠 একটি সাধারণ Home Network কীভাবে কাজ করে?"],
  ["Class 06 — 🏢 How Does an Office Network Work?", "ক্লাস ০৬ — 🏢 একটি Office Network কীভাবে কাজ করে?"],
  ["Class 07 — 📦 What Is Data and How Does It Move Through a Network?", "ক্লাস ০৭ — 📦 Data কী এবং Network-এ কীভাবে চলাচল করে?"],
  ["Class 08 — 🏷️ What Is an IP Address?", "ক্লাস ০৮ — 🏷️ IP Address আসলে কী?"],
  ["Class 09 — 🔢 How Does an IPv4 Address Work?", "ক্লাস ০৯ — 🔢 IPv4 Address কীভাবে কাজ করে?"],
  ["Class 10 — 📝 Skill Test 1", "ক্লাস ১০ — 📝 Skill Test 1\nদক্ষতা পরীক্ষা ১"],
  ["Class 11 — 🔢 What Is a MAC Address?", "ক্লাস ১১ — 🔢 MAC Address কী?"],
  ["Class 12 — 🧩 What Is the OSI Model?", "ক্লাস ১২ — 🧩 OSI Model কী?"],
  ["Class 13 — 📚 What Is a Network Protocol?", "ক্লাস ১৩ — 📚 Network Protocol কী?"],
  ["Class 14 — 🔀 What Is a Switch and How Does It Work?", "ক্লাস ১৪ — 🔀 Switch কী এবং কীভাবে কাজ করে?"],
  ["Class 15 — 🚪 What Is a Gateway?", "ক্লাস ১৫ — 🚪 Gateway কী?"],
  ["Class 16 — 🌐 What Is a Router and How Does It Work?", "ক্লাস ১৬ — 🌐 Router কী এবং কীভাবে কাজ করে?"],
  ["Class 17 — 🧭 How Does a Router Choose a Path for Data?", "ক্লাস ১৭ — 🧭 Router কীভাবে Data-এর পথ ঠিক করে?"],
  ["Class 18 — 🌍 How Do We Connect from a Local Network to the Internet?", "ক্লাস ১৮ — 🌍 Local Network থেকে Internet-এ কীভাবে যাই?"],
  ["Class 19 — 📛 What Is DNS and How Does It Find a Website?", "ক্লাস ১৯ — 📛 DNS কী এবং Website-এর নাম কীভাবে খুঁজে পায়?"],
  ["Class 20 — 📝 Skill Test 2", "ক্লাস ২০ — 📝 Skill Test 2\nদক্ষতা পরীক্ষা ২"],
  ["Class 21 — 🔄 What Are TCP and UDP?", "ক্লাস ২১ — 🔄 TCP ও UDP কী?"],
  ["Class 22 — 🧩 What Is a Subnet Mask?", "ক্লাস ২২ — 🧩 Subnet Mask কী?"],
  ["Class 23 — 🧮 How Does Subnetting Work?", "ক্লাস ২৩ — 🧮 Subnetting কীভাবে কাজ করে?"],
  ["Class 24 — 📶 How Does a Wi-Fi Network Work?", "ক্লাস ২৪ — 📶 Wi-Fi Network কীভাবে কাজ করে?"],
  ["Class 25 — 🔒 Introduction to Network Security", "ক্লাস ২৫ — 🔒 Network Security-এর শুরু"],
  ["Class 26 — 🛡️ What Is a Firewall and How Does It Work?", "ক্লাস ২৬ — 🛡️ Firewall কী এবং কীভাবে কাজ করে?"],
  ["Class 27 — 🔐 What Is Secure Network Communication?", "ক্লাস ২৭ — 🔐 নিরাপদ Network Communication কী?"],
  ["Class 28 — 🚚 The Complete Journey of Data", "ক্লাস ২৮ — 🚚 Data-এর সম্পূর্ণ যাত্রা"],
  ["Class 29 — 🧠 Putting Everything in Networking Together", "ক্লাস ২৯ — 🧠 Networking-এর সবকিছু একসাথে"],
  ["Class 30 — 🏆 Final Exam of Networking", "ক্লাস ৩০ — 🏆 Final Exam of Networking\nনেটওয়ার্কিং-এর চূড়ান্ত পরীক্ষা"],
];

const networkingMasterclassFirstLesson: Pick<Chapter, "minutes" | "keywords" | "intro" | "introBn" | "sections" | "quiz"> = {
  minutes: 25,
  keywords: ["network", "data", "device", "communication", "basics"],
  intro:
    "We hear the word Network almost every day. When the Internet does not work, we often say, \"There is no Network.\" But what exactly is a Network? How does one Device communicate with another Device? And how does a picture, Message, or File travel from one Device to another?\n\nIn this class, you will learn the basics of Networking from the very beginning. You will understand what a Network is, what Data means, and how Devices communicate with each other through simple real-world examples. After completing this class, a beginner will have a clear understanding of the basic ideas needed to continue learning Networking.",
  introBn:
    "আমরা প্রতিদিন Network শব্দটি শুনি। মোবাইলে Internet না চললে বলি, ‘Network নেই।’ কারও সঙ্গে যোগাযোগ করতে সমস্যা হলে Network-এর কথা বলি। কিন্তু এই Network আসলে কী? কীভাবে একটি Device অন্য একটি Device-এর সঙ্গে যোগাযোগ করে? আর একটি ছবি, Message বা File কীভাবে এক Device থেকে অন্য Device-এ পৌঁছে যায়?\n\nএই ধাপে Networking-এর একদম শুরু থেকে বিষয়গুলো সহজভাবে শেখানো হবে। Network কী, Data কী এবং Device-গুলোর মধ্যে কীভাবে যোগাযোগ তৈরি হয়—এসব বাস্তব জীবনের পরিচিত উদাহরণের মাধ্যমে বোঝানো হবে। এই ধাপ শেষ করার পর একজন নতুন শিক্ষার্থী Network সম্পর্কে পরবর্তী বিষয়গুলো শেখার জন্য একটি পরিষ্কার ধারণা পাবে।",
  sections: [
    sec(
      "Lesson 01 — What Is a Network?",
      "লেসন ০১ — নেটওয়ার্ক কী?",
      "You have probably heard the word Network many times. When the Internet is not working, you may say, \"There is no Network.\" When a phone call does not connect, you may say, \"There is a Network problem.\" But what exactly is this Network?\n\nSuppose you have a picture on your phone and want to send it to your friend. The picture is on your phone, but it is not on your friend's phone. You press Send, and after a moment the picture appears on your friend's phone. Even though the two phones were not physically next to each other, they were able to communicate. A Network made that communication possible.\n\nThe same idea applies to Computers. If a File needs to travel from one Computer to another, the Devices need a communication system. This Connection can happen through a Cable or through Wi-Fi. For example:\n\nComputer A → Cable → Switch → Cable → Computer B\n\nOr:\n\nLaptop → Wi-Fi → Network → Another Device\n\nA Network does not have to contain only Computers. Smartphones, Laptops, Smart TVs, and Printers can form a home Network. In an Office, Computers, Printers, and Servers can communicate through the same Network. The Internet is a huge system that connects countless Networks around the world.\n\nRemember: when two or more Devices communicate with each other and exchange Data, the system that allows that communication is called a Network.",
      "আপনি হয়তো Network শব্দটি অসংখ্যবার শুনেছেন। মোবাইলে Internet চলছে না—বললেন, ‘Network নেই।’ কাউকে ফোন করতে গিয়ে কল যাচ্ছে না—আবার বললেন, ‘Network-এর সমস্যা।’ কিন্তু আমরা যে Network-এর কথা এতবার বলি, সেটি আসলে কী?\n\nসহজভাবে চিন্তা করুন। ধরুন, আপনার কাছে একটি ছবি আছে। আপনি ছবিটি আপনার বন্ধুর কাছে পাঠাতে চান। আপনার ফোনে ছবিটি আছে, কিন্তু আপনার বন্ধুর ফোনে নেই। আপনি Send চাপলেন। কিছু সময় পর ছবিটি আপনার বন্ধুর ফোনে চলে গেল। আপনার ফোন এবং আপনার বন্ধুর ফোন সরাসরি পাশাপাশি না থাকলেও তারা একে অপরের সঙ্গে যোগাযোগ করতে পেরেছে। এই যোগাযোগের জন্য একটি Network ব্যবহৃত হয়েছে।\n\nComputer-এর ক্ষেত্রেও একই ঘটনা ঘটে। একটি Computer থেকে অন্য Computer-এ File পাঠাতে হলে Device-গুলোর মধ্যে যোগাযোগের ব্যবস্থা দরকার। এই যোগাযোগ Cable-এর মাধ্যমে হতে পারে, আবার Wi-Fi-এর মাধ্যমেও হতে পারে। উদাহরণ:\n\nComputer A → Cable → Switch → Cable → Computer B\n\nঅথবা:\n\nLaptop → Wi-Fi → Network → অন্য Device\n\nএকটি Network শুধু Computer-এর মধ্যেই হতে হবে এমন নয়। আপনার বাসায় Smartphone, Laptop, Smart TV এবং Printer একটি Network-এর সঙ্গে যুক্ত থাকতে পারে। একটি Office-এ অনেক Computer, Printer এবং Server একই Network-এর মাধ্যমে যোগাযোগ করতে পারে। তাই Network বলতে শুধু Internet বোঝায় না। Internet হলো পৃথিবীর অসংখ্য Network-এর সঙ্গে যুক্ত একটি বিশাল ব্যবস্থা।\n\nমনে রাখবেন: যখন দুই বা তার বেশি Device একে অপরের সঙ্গে যোগাযোগ করে এবং Data আদান-প্রদান করতে পারে, তখন সেই যোগাযোগের ব্যবস্থাকে Network বলা হয়।"
    ),
    sec(
      "Lesson 02 — What Is Data?",
      "লেসন ০২ — Data কী?",
      "When Devices communicate through a Network, what do they exchange? The answer is Data. A picture is Data. A Message is Data. A Video, Document, Audio File, or any other Digital Information can also be Data.\n\nSuppose you send a picture to your friend through Messenger. The picture is stored on your phone. After you press Send, the Data of that picture begins travelling through the Network toward your friend's Device. Eventually, your friend's phone receives the Data and displays the picture on its Screen.\n\nYour phone is the Device sending the Data. Your friend's phone is the Device receiving the Data. The Network provides the communication system that allows the Data to move between them. Opening a Website, watching a Video, sending a Message, and downloading a File all involve Data moving between Devices.\n\nRemember: Pictures, Videos, Messages, Documents, Audio, and other forms of Digital Information can all be Data.",
      "Network দিয়ে যখন Device-গুলো একে অপরের সঙ্গে যোগাযোগ করে, তখন তাদের মধ্যে কী আদান-প্রদান হয়? উত্তর হলো—Data। আপনি কাউকে একটি ছবি পাঠালেন—ছবিটি Data। একটি Message, Video, Document, Audio File বা অন্য কোনো Digital Information-ও Data হতে পারে।\n\nধরুন, আপনি আপনার বন্ধুকে Messenger-এ একটি ছবি পাঠালেন। ছবিটি আপনার ফোনে রয়েছে। আপনি Send করার পর সেই ছবির Data Network-এর মাধ্যমে আপনার বন্ধুর Device-এর দিকে যেতে শুরু করে। শেষ পর্যন্ত আপনার বন্ধুর ফোন সেই Data গ্রহণ করে এবং ছবিটি তার Screen-এ দেখা যায়।\n\nআপনার ফোন হলো Data পাঠানো Device। আপনার বন্ধুর ফোন হলো Data গ্রহণ করা Device। আর এই Data এক Device থেকে অন্য Device-এ যাওয়ার জন্য Network যোগাযোগের ব্যবস্থা তৈরি করে। আপনি Website খুলছেন, Video দেখছেন, Message পাঠাচ্ছেন বা কোনো File Download করছেন—প্রতিটি ক্ষেত্রেই Data Device-এর মধ্যে চলাচল করছে।\n\nমনে রাখবেন: ছবি, Video, Message, Document, Audio এবং অন্যান্য Digital Information—সবই Data হতে পারে।"
    ),
    sec(
      "Lesson 03 — How Do Devices Communicate?",
      "লেসন ০৩ — Device কীভাবে একে অপরের সঙ্গে যোগাযোগ করে?",
      "Now we know what a Network is and what Data is. The next question is: how does one Device communicate with another Device?\n\nSuppose you have two Computers. A File is stored on one Computer, and you want to send it to the other Computer. If there is no communication between them, the File cannot be transferred. So, a Connection needs to be created.\n\nOne method is a Cable:\n\nComputer A → Ethernet Cable → Switch → Ethernet Cable → Computer B\n\nCommunication can also happen without a physical Cable. For example:\n\nLaptop → Wi-Fi → Access Point → Network\n\nSimply connecting two Devices is not enough. They must follow rules for sending and receiving Data, just as people need a shared language to communicate. In Computer Networks, these rules are called Protocols. We will learn about Protocols in later classes.\n\nRemember: Devices need a Connection to communicate, and Protocols help them exchange Data correctly.",
      "এখন আমরা জানি Network কী এবং Data কী। এবার প্রশ্ন হলো—একটি Device কীভাবে অন্য একটি Device-এর সঙ্গে যোগাযোগ করে?\n\nধরুন, আপনার কাছে দুটি Computer আছে। একটি Computer-এ একটি File রয়েছে এবং আপনি সেটি অন্য Computer-এ পাঠাতে চান। দুটি Computer-এর মধ্যে যোগাযোগের ব্যবস্থা না থাকলে File পাঠানো সম্ভব হবে না। তাই তাদের মধ্যে একটি Connection তৈরি করতে হবে।\n\nএকটি পদ্ধতি হলো Cable:\n\nComputer A → Ethernet Cable → Switch → Ethernet Cable → Computer B\n\nআবার Cable ছাড়াও যোগাযোগ করা যায়, যেমন:\n\nLaptop → Wi-Fi → Access Point → Network\n\nদুটি Device শুধু connected হলেই তারা যেকোনোভাবে Data আদান-প্রদান করতে পারে না। তাদের Data পাঠানো ও গ্রহণ করার জন্য নির্দিষ্ট নিয়ম মেনে চলতে হয়। মানুষ যেমন যোগাযোগের সময় একটি ভাষা ব্যবহার করে, Computer Network-এর এই নিয়মগুলোকে Protocol বলা হয়। পরবর্তী ক্লাসগুলোতে Protocol সম্পর্কে আরও শেখা হবে।\n\nমনে রাখবেন: Device-গুলোর মধ্যে যোগাযোগের জন্য Connection দরকার এবং সঠিকভাবে Data আদান-প্রদানের জন্য Protocol ব্যবহার করা হয়।"
    ),
  ],
  quiz: {
    q: "What is the communication system that allows two or more Devices to exchange Data called?",
    qBn: "দুই বা তার বেশি Device-এর মধ্যে Data আদান-প্রদান করার যোগাযোগ ব্যবস্থাকে কী বলা হয়?",
    opts: ["Data", "Network", "File", "Software"],
    optsBn: ["Data", "Network", "File", "Software"],
    answer: 1,
    explain: "A Network connects Devices and allows them to communicate and exchange Data.",
    explainBn: "Network Device-গুলোকে যুক্ত করে এবং তাদের মধ্যে যোগাযোগ ও Data আদান-প্রদানের সুযোগ দেয়।",
  },
  quizzes: [
    {
      q: "What is the communication system that allows two or more Devices to exchange Data called?",
      qBn: "দুই বা তার বেশি Device-এর মধ্যে Data আদান-প্রদান করার যোগাযোগ ব্যবস্থাকে কী বলা হয়?",
      opts: ["Data", "Network", "File", "Software"],
      optsBn: ["Data", "Network", "File", "Software"],
      answer: 1,
      explain: "A Network connects Devices and allows them to communicate and exchange Data.",
      explainBn: "Network Device-গুলোকে যুক্ত করে এবং তাদের মধ্যে যোগাযোগ ও Data আদান-প্রদানের সুযোগ দেয়।",
    },
    {
      q: "Which of the following is an example of Data?",
      qBn: "নিচের কোনটি Data-এর একটি উদাহরণ?",
      opts: ["A Picture", "A Network Cable", "A Switch", "A Wi-Fi Router"],
      optsBn: ["একটি ছবি", "একটি Network Cable", "একটি Switch", "একটি Wi-Fi Router"],
      answer: 0,
      explain: "A picture is digital information, so it is an example of Data.",
      explainBn: "একটি ছবি Digital Information, তাই এটি Data-এর একটি উদাহরণ।",
    },
  ],
};

const createNetworkingMasterclassChapters = (courseId: string): Chapter[] =>
  networkingMasterclassTitles.map(([title, titleBn], index) => ({
    ...createEmptyChapter(courseId, index),
    title,
    titleBn,
    ...(index === 0 ? networkingMasterclassFirstLesson : {}),
  }));

const zeroToProImages = [
  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5385525/pexels-photo-5385525.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4864249/pexels-photo-4864249.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/11391947/pexels-photo-11391947.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const zeroToProLessons: Array<{
  title: string; titleBn: string; intro: string; introBn: string; sections: Array<[string, string, string, string, string]>; minutes: number;
}> = [
  {
    title: "Computer Basics & Fundamentals", titleBn: "কম্পিউটার পরিচিতি ও বেসিক ভিত", minutes: 15,
    intro: "A computer is a precise tool that follows instructions. In this lesson you will meet its main parts and learn how power, processing, memory, and storage work together.",
    introBn: "কম্পিউটার হলো নির্দেশ মেনে চলা একটি নির্ভুল যন্ত্র। এই পাঠে এর প্রধান অংশ, পাওয়ার, প্রসেসিং, মেমোরি ও স্টোরেজ কীভাবে একসঙ্গে কাজ করে তা শিখবে।",
    sections: [
      ["Introduction: Computer is Not Rocket Science!", "সূচনা: কম্পিউটার আসলে কোনো রকেট সায়েন্স না!", "A computer follows exact commands; like a calculator, it waits for your input before doing anything.", "কম্পিউটার নিজের ইচ্ছায় কিছু করে না; ক্যালকুলেটরের মতো তোমার ইনপুটের অপেক্ষা করে।", zeroToProImages[0]],
      ["Hardware Components: Human Body vs Computer", "বাহ্যিক পরিচিতি: মানুষের শরীর বনাম কম্পিউটার", "Your eyes are like the monitor, hands like the keyboard and mouse, and the brain like the CPU.", "তোমার চোখ মনিটরের মতো, হাত কিবোর্ড-মাউসের মতো, আর মস্তিষ্ক CPU-এর মতো কাজ করে।", zeroToProImages[1]],
      ["Hardware vs Software: Body and Soul", "হার্ডওয়্যার বনাম সফটওয়্যার: আত্মা আর শরীরের খেলা", "Hardware is the physical body; software is the invisible program that makes it useful. Without software, hardware is only an expensive paperweight.", "হার্ডওয়্যার হলো ছোঁয়া যায় এমন শরীর, সফটওয়্যার হলো অদৃশ্য প্রোগ্রাম; সফটওয়্যার ছাড়া হার্ডওয়্যার অকেজো।", zeroToProImages[2]],
      ["Inside the Machine: CPU, RAM & Hard Disk", "ভেতরের কারিগর: CPU, RAM ও হার্ডডিস্ক", "The CPU processes, RAM holds active work, and the hard disk stores files for later.", "CPU প্রসেস করে, RAM চলমান কাজ ধরে রাখে, আর হার্ডডিস্ক ফাইল জমিয়ে রাখে।", zeroToProImages[3]],
      ["Power On & Shut Down: Stop Pulling the Plug!", "অন ও শাটডাউন: চটজলদি বন্ধ করার বদভ্যাস ছাড়ুন", "Always use the operating system's shutdown command instead of pulling the plug, or files may become corrupted.", "সরাসরি প্লাগ খুলে নয়, অপারেটিং সিস্টেমের Shut Down ব্যবহার করো; না হলে ফাইল নষ্ট হতে পারে।", zeroToProImages[4]],
    ],
  },
  {
    title: "File Management & OS Basics", titleBn: "ফাইল ম্যানেজমেন্ট ও অপারেটিং সিস্টেমের কাজ", minutes: 14,
    intro: "Learn to organize, find, copy, rename, and safely delete the files you use every day.", introBn: "প্রতিদিনের ফাইল গুছিয়ে রাখা, খোঁজা, কপি, রিনেম ও নিরাপদে ডিলিট করা শিখবে।",
    sections: [
      ["File & Folder: Organizing Your Digital Desk", "ফাইল ও ফোল্ডার: ডিজিটাল পড়ার টেবিল গোছানো", "Files are your songs, photos, and documents; folders are digital drawers that keep them organized.", "গান, ছবি ও ডকুমেন্ট হলো ফাইল; ফোল্ডার হলো সেগুলো গুছিয়ে রাখার ডিজিটাল ড্রয়ার।", "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Desktop & Taskbar: Your Digital Desk", "ডেস্কটপ ও টাস্কবার: ডিজিটাল কাজের ডেস্ক", "The desktop is the main workspace and the taskbar keeps Start and active apps within reach.", "ডেস্কটপ হলো প্রধান কাজের জায়গা, আর টাস্কবারে Start ও খোলা অ্যাপ থাকে।", "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Mouse Magic: Left Click vs Right Click", "মাউসের কেরামতি: লেফট ক্লিক বনাম রাইট ক্লিক", "Left click selects or opens; right click reveals actions such as properties, delete, and rename.", "লেফট ক্লিক সিলেক্ট বা ওপেন করে; রাইট ক্লিক Properties, Delete ও Rename-এর মতো অপশন দেখায়।", "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Recycle Bin: The Magical Dustbin", "রিসাইকেল বিন: ভুল করে ফেলা জিনিসের ডাস্টবিন", "Deleted files usually go to Recycle Bin first, where they can often be restored.", "ডিলিট করা ফাইল সাধারণত আগে Recycle Bin-এ যায়, সেখান থেকে Restore করা যায়।", "https://images.pexels.com/photos/8486915/pexels-photo-8486915.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Copy, Paste & Rename: Digital Photocopy Magic", "কপি, পেস্ট ও রিনেম: ডিজিটাল ফটোকপি", "Copy-paste duplicates a file, while rename changes its label without changing its contents.", "Copy-Paste ফাইলের কপি বানায়, আর Rename ভেতরের তথ্য না বদলে নাম বদলায়।", "https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
  },
  {
    title: "Internet World & Safe Browsing", titleBn: "ইন্টারনেটের দুনিয়া, ব্রাউজার ও নিরাপদ ব্রাউজিং", minutes: 13,
    intro: "Understand the internet, browsers, search engines, Wi-Fi, modems, and the habits that keep browsing safe.", introBn: "ইন্টারনেট, ব্রাউজার, সার্চ ইঞ্জিন, Wi-Fi, মডেম এবং নিরাপদ ব্রাউজিংয়ের অভ্যাস বুঝে নাও।",
    sections: [
      ["What is the Internet? The Cosmic Web", "ইন্টারনেট আসলে কী? অদৃশ্য জালের মহাজাগতিক মেলা", "The internet is a worldwide network where data travels between connected devices.", "ইন্টারনেট হলো বিশ্বজুড়ে যুক্ত ডিভাইসের নেটওয়ার্ক, যেখানে তথ্য এক জায়গা থেকে অন্য জায়গায় যায়।", "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Browser vs Search Engine: Door vs Catalog", "ব্রাউজার বনাম সার্চ ইঞ্জিন: দরজা বনাম ক্যাটালগ", "A browser opens websites; a search engine helps locate information inside the web.", "ব্রাউজার ওয়েবসাইট খোলে; সার্চ ইঞ্জিন ওয়েবের ভেতর তথ্য খুঁজে দেয়।", "https://images.pexels.com/photos/15942036/pexels-photo-15942036.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Wi-Fi and Modem: Invisible Internet Wind", "ওয়াই-ফাই ও মডেম: ইন্টারনেটের অদৃশ্য বাতাস", "A modem brings the connection in; Wi-Fi shares it wirelessly with nearby devices.", "মডেম সংযোগ আনে; Wi-Fi সেটি তার ছাড়া আশেপাশের ডিভাইসে ছড়ায়।", "https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Safe Browsing: Do Not Fall for Freebies", "নিরাপদ ব্রাউজিং: ফাউ জিনিসের লোভে পড়ো না", "Treat suspicious prize messages and unknown links as danger signs. Verify before clicking or downloading.", "অচেনা লিংক ও পুরস্কারের লোভনীয় মেসেজকে বিপদের সংকেত ভাবো; ক্লিকের আগে যাচাই করো।", "https://images.pexels.com/photos/6069510/pexels-photo-6069510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    ],
  },
  {
    title: "Online Communication & Cloud Storage", titleBn: "অনলাইন যোগাযোগ ও ক্লাউড স্টোরেজ", minutes: 13,
    intro: "Use email, documents, and cloud storage to communicate and keep your work available across devices.", introBn: "ইমেইল, ডকুমেন্ট ও ক্লাউড স্টোরেজ ব্যবহার করে যোগাযোগ করো এবং সব ডিভাইসে কাজ হাতের কাছে রাখো।",
    sections: [
      ["Email & Gmail: Modern Digital Letter", "ইমেইল ও জিমেইল: আধুনিক ডিজিটাল চিঠি", "Email sends electronic letters quickly; Gmail is one popular service for sending and receiving them.", "ইমেইল দ্রুত ডিজিটাল চিঠি পাঠায়; Gmail হলো ইমেইল পাঠানো ও পাওয়ার জনপ্রিয় একটি সেবা।", "https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
      ["How to Send an Email", "যেভাবে ইমেইল পাঠাবে", "Add the correct recipient in To, write a clear subject, compose the message, check the address, and send.", "To ঘরে সঠিক ঠিকানা, Subject-এ বিষয়, তারপর মূল লেখা দিয়ে ঠিকানা যাচাই করে Send করো।", "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Google Drive: Keeping Files Safe in the Cloud", "গুগল ড্রাইভ: ফাইল আকাশে নিরাপদে রাখা", "Cloud storage keeps copies online so your work can be reached from another device and backed up more safely.", "ক্লাউড স্টোরেজ ফাইল অনলাইনে রাখে, তাই অন্য ডিভাইস থেকেও কাজ পাওয়া যায় এবং ব্যাকআপ রাখা সহজ হয়।", "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Document Creation: Digital Pen and Paper", "ডকুমেন্ট তৈরি: ডিজিটাল খাতা-কলম", "Word processors help you create clean letters, notes, and resumes that are easy to edit and share.", "Word processor দিয়ে পরিষ্কার চিঠি, নোট ও CV বানানো, সম্পাদনা ও শেয়ার করা যায়।", "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
  },
  {
    title: "Troubleshooting & Security", titleBn: "বেসিক ট্রাবলশুটিং ও ইন্টারনেট সিকিউরিটি", minutes: 13,
    intro: "Build calm troubleshooting habits and protect accounts and devices from common digital threats.", introBn: "শান্তভাবে সমস্যা সমাধান এবং সাধারণ ডিজিটাল ঝুঁকি থেকে অ্যাকাউন্ট ও ডিভাইস রক্ষার অভ্যাস তৈরি করো।",
    sections: [
      ["What to Do When a PC Hangs", "কম্পিউটার হ্যাং করলে কী করবে?", "Save when possible, wait briefly, close the stuck app, or restart safely if the system is unresponsive.", "সম্ভব হলে Save করো, একটু অপেক্ষা করো, আটকে থাকা অ্যাপ বন্ধ করো; পুরো সিস্টেম আটকে গেলে নিরাপদে Restart করো।", "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Password Security: Digital Door Locks", "পাসওয়ার্ড সুরক্ষা: ডিজিটাল দরজার তালা", "Use long, unique passwords and never reuse an important password across services.", "দীর্ঘ ও আলাদা পাসওয়ার্ড ব্যবহার করো এবং গুরুত্বপূর্ণ পাসওয়ার্ড একাধিক সেবায় ব্যবহার করো না।", "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Viruses & Antivirus: Digital Flu and Vaccines", "ভাইরাস ও অ্যান্টিভাইরাস: ডিজিটাল সর্দি-কাশি ও ভ্যাকসিন", "Malware can damage files or steal information. Keep software updated and use trusted security tools.", "Malware ফাইল নষ্ট বা তথ্য চুরি করতে পারে; সফটওয়্যার আপডেট রাখো এবং বিশ্বস্ত নিরাপত্তা টুল ব্যবহার করো।", "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Course Wrap-up: You Are Now a Computer Pro", "সমাপনী কথা: তুমি এখন কম্পিউটার বস!", "You can now organize files, browse carefully, communicate online, use cloud tools, and handle basic problems with confidence.", "এখন তুমি ফাইল সাজাতে, নিরাপদে ব্রাউজ করতে, অনলাইনে যোগাযোগ করতে, ক্লাউড ব্যবহার করতে ও ছোট সমস্যা সামলাতে পারবে।", "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
  },
];

type AuthoredLesson = {
  title: string;
  titleBn: string;
  intro: string;
  introBn: string;
  sections: Array<[string, string, string, string, string]>;
  minutes: number;
  quiz: Quiz;
};

const legacyZeroToProLessons: AuthoredLesson[] = [
  {
    title: "Computer Basics & Fundamentals",
    titleBn: "কম্পিউটার পরিচিতি ও বেসিক ভিত",
    minutes: 18,
    intro: "This chapter introduces the computer as an obedient, instruction-following tool and explains its visible parts, internal components, power handling, and the relationship between hardware and software.",
    introBn: "এই চ্যাপ্টারে কম্পিউটারকে নির্দেশ মেনে চলা একটি বিশ্বস্ত যন্ত্র হিসেবে পরিচয় করানো হবে। এর বাহ্যিক অংশ, ভেতরের উপাদান, হার্ডওয়্যার-সফটওয়্যার এবং নিরাপদ শাটডাউন শেখানো হবে।",
    sections: [
      ["Introduction: Computer is Not Rocket Science!", "সূচনা: কম্পিউটার কোনো রকেট সায়েন্স নয়!", "People get terrified of technology, but a computer is the most obedient servant with zero independent intelligence. Just like a calculator, your PC waits patiently for your commands, so treat it as your friend.", "মানুষ টেকনোলজি শুনলেই ভয়ে পিছিয়ে যায়। অথচ কম্পিউটার হলো পৃথিবীর সবচেয়ে অনুগত গোলাম, যার নিজস্ব কোনো বুদ্ধি বা ফিলিংস নেই। ক্যালকুলেটরের মতো পিসি বা ল্যাপটপও তোমার নির্দেশের অপেক্ষায় থাকে, তাই এটিকে ভয় না পেয়ে বিশ্বস্ত বন্ধু ভাবো।", "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Hardware Components: Human Body vs Computer Anatomy", "বাহ্যিক পরিচিতি: মানব শরীর বনাম কম্পিউটারের অঙ্গপ্রত্যঙ্গ", "The monitor acts as the computer's eyes, while the keyboard and mouse serve as its hands. Treat every external part with care, just like your own body.", "কম্পিউটারের মনিটর হলো আমাদের জোড়া চোখের মতো, আর কিবোর্ড-মাউস হলো ডিজিটাল হাত। মনিটর ও অন্যান্য হার্ডওয়্যার পার্টসকে নিজের শরীরের অঙ্গের মতো পরম যত্নে ব্যবহার করতে হবে।", "https://images.pexels.com/photos/5385525/pexels-photo-5385525.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Hardware vs Software: Physical Bones vs Invisible Soul", "হার্ডওয়্যার বনাম সফটওয়্যার: শরীরের হাড়মাংস বনাম অদৃশ্য আত্মা", "Hardware is the tangible physical body, while software is the invisible soul. Without software, expensive hardware is just an expensive paperweight.", "হার্ডওয়্যার হলো কম্পিউটারের দৃশ্যমান ফিজিক্যাল বডি, আর সফটওয়্যার হলো তার ভেতরের অদৃশ্য প্রাণ বা প্রোগ্রামিং। সফটওয়্যার ছাড়া কোটি টাকার হার্ডওয়্যার কেবল একটি দামি ইটের টুকরো।", "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Inside the Machine: CPU, RAM, and Hard Disk", "ভেতরের কারিগর: সিপিইউ, র‍্যাম ও হার্ডডিস্কের সংসার চালনা", "The CPU is the brain, RAM is the active working desk that clears on shutdown, and the hard disk is your permanent storage closet.", "সিপিইউ হলো কম্পিউটারের আসল বস বা মস্তিষ্ক। র‍্যাম হলো রানিং কাজের টেবিল, যা পিসি বন্ধ করলেই মুছে যায়। আর হার্ডডিস্ক হলো সমস্ত ফাইল জমিয়ে রাখার বিশাল গুদামঘর।", "https://images.pexels.com/photos/4864249/pexels-photo-4864249.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Power On & Shut Down: Stop Yanking the Power Cord!", "অন ও শাটডাউন: হুটহাট পাওয়ার প্লাগ টেনে নেওয়ার বদভ্যাস ছাড়ুন", "Yanking the power plug abruptly corrupts active system files. Always shut down your computer gracefully through the Start menu.", "সরাসরি মাল্টিপ্লাগ থেকে টান দিয়ে পিসি বন্ধ করলে রানিং ফাইল করাপ্ট হয়ে যায়। সবসময় Start menu থেকে সঠিক নিয়মে শাটডাউন করার অভ্যাস করো।", "https://images.pexels.com/photos/11391947/pexels-photo-11391947.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
    quiz: { q: "What is the correct way to shut down a computer?", qBn: "কম্পিউটার বন্ধ করার সঠিক পদ্ধতি কোনটি?", opts: ["Pull the power plug directly", "Shut down from the Start menu", "Turn off the wall switch", "Remove the battery"], optsBn: ["সরাসরি প্লাগ টেনে নেওয়া", "স্টার্ট মেনু থেকে শাটডাউন করা", "সুইচ অফ করা", "ব্যাটারি খোলা"], answer: 1, explain: "Use the operating system's Shut Down command so active files can close safely.", explainBn: "অপারেটিং সিস্টেমের Shut Down ব্যবহার করলে চলমান ফাইল নিরাপদে বন্ধ হয়।" },
  },
  {
    title: "File Management & OS Basics", titleBn: "ফাইল ম্যানেজমেন্ট ও অপারেটিং সিস্টেমের কাজ", minutes: 16,
    intro: "Learn how to keep your digital desk organized with files, folders, the desktop, taskbar, mouse actions, Recycle Bin, and file commands.", introBn: "ফাইল, ফোল্ডার, ডেস্কটপ, টাস্কবার, মাউস, রিসাইকেল বিন এবং ফাইল কমান্ড দিয়ে ডিজিটাল কাজের জায়গা গুছিয়ে রাখার নিয়ম শিখবে।",
    sections: [
      ["File & Folder: Organizing Your Digital Desk", "ফাইল ও ফোল্ডার: আপনার পিসির গোছানো পড়ার টেবিল", "Every saved item is a file, and folders are digital drawers used to organize files neatly and keep drives clutter-free.", "সেভ করা প্রতিটি গান বা ডকুমেন্ট হলো ফাইল, আর এগুলোকে ক্যাটাগরি অনুযায়ী সাজিয়ে রাখার ডিজিটাল ড্রয়ার হলো ফোল্ডার। ড্রাইভও ফোল্ডার বানিয়ে পরিষ্কার রাখতে হবে।", "https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
      ["Desktop & Taskbar: Your Digital Work Desk", "ডেস্কটপ ও টাস্কবার পরিচিতি: আপনার ডিজিটাল লেখার টেবিল", "The main screen is the Desktop, and the bottom strip where apps can be opened and switched is the Taskbar.", "পিসি অন করলে সামনে যে মেইন স্ক্রিন ভেসে ওঠে তা হলো ডেস্কটপ। নিচের লম্বা পটি, যেখান থেকে অ্যাপ ওপেন করা যায়, তাকে টাস্কবার বলে।", "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Proper Use of Mouse: Left Click vs Right Click", "মাউসের সঠিক ব্যবহার: লেফট ক্লিক বনাম রাইট ক্লিক", "Left-click selects or opens items, while right-click reveals hidden drop-down options and actions.", "মাউসের লেফট ক্লিক দিয়ে ফাইল সিলেক্ট বা ওপেন করা হয়। রাইট ক্লিক হলো এমন একটি ক্লিক, যা ড্রপ-ডাউন মেনু ও গোপন অপশন দেখায়।", "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Recycle Bin: The Magical Trash Can", "রিসাইকেল বিন: ডিলিট করা জিনিসের মায়াবী ডাস্টবিন", "Deleted files are not necessarily gone forever; Windows places them in the Recycle Bin where they can be restored.", "ভুল করে কোনো ফাইল ডিলিট করলেই তা হারিয়ে যায় না। Windows সেগুলোকে Recycle Bin-এ রাখে, যেখান থেকে সহজেই Restore করে ফিরিয়ে আনা যায়।", "https://images.pexels.com/photos/8486915/pexels-photo-8486915.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Copy, Paste & Rename: The Greatest Digital Magic", "কপি, পেস্ট ও রিনেম: ডিজিটাল দুনিয়ার ফটোকপি মেশিন", "Copy-paste duplicates a file without changing the original, while Rename replaces an old file name with a new one.", "মূল ফাইল অপরিবর্তিত রেখে ডুপ্লিকেট করার জন্য কপি-পেস্ট ব্যবহার করা হয়। আর পুরোনো নাম বদলে নতুন নাম দেওয়ার জন্য Rename command ব্যবহার করা হয়।", "https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
    quiz: { q: "Where are deleted files temporarily stored?", qBn: "ডিলিট করা ফাইল সাময়িকভাবে কোথায় জমা হয়?", opts: ["Taskbar", "Recycle Bin", "Drive C", "Browser"], optsBn: ["টাস্কবার", "রিসাইকেল বিন", "ড্রাইভ সি", "ব্রাউজার"], answer: 1, explain: "Windows usually moves deleted files to the Recycle Bin before permanent deletion.", explainBn: "Windows সাধারণত ডিলিট করা ফাইল স্থায়ীভাবে মুছে ফেলার আগে Recycle Bin-এ রাখে।" },
  },
  {
    title: "Internet World & Safe Browsing", titleBn: "ইন্টারনেটের দুনিয়া ও নিরাপদ ব্রাউজিং", minutes: 15,
    intro: "Understand the internet, browsers, search engines, Wi-Fi, modems, and how to recognize phishing and scam traps.", introBn: "ইন্টারনেট, ব্রাউজার, সার্চ ইঞ্জিন, Wi-Fi, মডেম এবং ফিশিং ও স্ক্যাম থেকে নিরাপদ থাকার নিয়ম শিখবে।",
    sections: [
      ["What is the Internet? The Cosmic Digital Web", "ইন্টারনেট আসলে কী? মহাজাগতিক ডিজিটাল সুপারহাইওয়ে", "The internet is a massive digital superhighway connecting global devices and enabling fast data and video exchange.", "ইন্টারনেট হলো সারা পৃথিবীর কোটি কোটি ডিভাইসকে অদৃশ্য সুতোয় বেঁধে রাখা এক বিশাল ডিজিটাল মহাসড়ক, যার মাধ্যমে দ্রুত ডেটা ও ভিডিও আদান-প্রদান করা যায়।", "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Browser vs Search Engine: Gateway Door vs Library Catalog", "ব্রাউজার বনাম সার্চ ইঞ্জিন: মেইন গেট বনাম ক্যাটালগ সিস্টেম", "A browser gets you inside the internet, while a search engine hunts down the information you want.", "ইন্টারনেটে ঢোকার বাহন হলো ব্রাউজার, যেমন Chrome। ব্রাউজারের ভেতরে তথ্য খোঁজার সাইট হলো সার্চ ইঞ্জিন, যেমন Google।", "https://images.pexels.com/photos/15942036/pexels-photo-15942036.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Wi-Fi and Modem: Invisible Wind and Connectivity Shower", "ওয়াই-ফাই ও মডেম: ইন্টারনেটের অদৃশ্য বাতাস ও শাওয়ার সিস্টেম", "Modems bring the core line, and Wi-Fi sprays internet connectivity wirelessly around your room.", "মডেম থেকে তারের মাধ্যমে লাইন আসে, আর রাউটার Wi-Fi-এর সাহায্যে পুরো ঘরে বাতাসের মতো ইন্টারনেট সিগন্যাল ছড়িয়ে দেয়।", "https://images.pexels.com/photos/442152/pexels-photo-442152.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Safe Browsing: Escaping Phishing Traps and Freebie Scams", "নিরাপদ ব্রাউজিং: ফাউ জিনিসের লোভ দেখানোর ফিশিং ফাঁদ", "Sketchy pop-ups and unverified winning links can hand personal data to attackers. Stay alert and verify before clicking.", "অচেনা লটারির পপ-আপ বা ফিশিং লিংকে ক্লিক করলে গোপনীয় তথ্য হ্যাকারদের হাতে যেতে পারে। তাই সবসময় সতর্ক থাকতে হবে।", "https://images.pexels.com/photos/6069510/pexels-photo-6069510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
    ],
    quiz: { q: "Which of the following is a search engine?", qBn: "ইন্টারনেটে তথ্য খোঁজার জন্য নিচের কোনটি সার্চ ইঞ্জিন?", opts: ["Google Chrome", "Google.com", "Microsoft Word", "Windows OS"], optsBn: ["Google Chrome", "Google.com", "Microsoft Word", "Windows OS"], answer: 1, explain: "Google.com is a search engine; Chrome is a browser used to open it.", explainBn: "Google.com হলো সার্চ ইঞ্জিন; Chrome হলো সেটি খোলার ব্রাউজার।" },
  },
  {
    title: "Online Communication & Cloud Storage", titleBn: "অনলাইন যোগাযোগ ও ক্লাউড স্টোরেজ", minutes: 15,
    intro: "Use email, Gmail, Google Drive, and document tools to communicate and protect your work online.", introBn: "ইমেইল, Gmail, Google Drive ও ডকুমেন্ট টুল ব্যবহার করে অনলাইনে যোগাযোগ ও কাজ সুরক্ষিত রাখা শিখবে।",
    sections: [
      ["Email & Gmail: The Modern Ultra-Fast Digital Pigeon Post", "ইমেইল ও জিমেইল: অতি-দ্রুতগতির ডিজিটাল চিঠি", "Email is a modern electronic letter that can deliver urgent documents across the world in seconds through services such as Gmail.", "ইমেইল হলো আধুনিক ডিজিটাল চিঠি, যার মাধ্যমে Gmail ব্যবহার করে সেকেন্ডের মধ্যে পৃথিবীর এক প্রান্ত থেকে অন্য প্রান্তে ডকুমেন্ট পাঠানো যায়।", "https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
      ["How to Send an Email: A Single Typo Vanishes Your Letter", "যেভাবে ইমেইল পাঠাবেন: ঠিকানা একটু এদিক-সেদিক হলেই চিঠি গায়েব", "Type the exact recipient ID in the To field, add a subject, write the message, check it, and send. A typo may bounce the email back.", "Gmail-এর To ঘরে প্রাপকের সঠিক ID ও Subject লিখে মেইল পাঠাতে হয়। সামান্য বানান ভুল হলে মেইল bounce back করতে পারে।", "https://images.pexels.com/photos/4226140/pexels-photo-4226140.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Google Drive: Keeping Files Safely in Cloud Storage", "গুগল ড্রাইভ: ক্লাউড স্টোরেজে ফাইল মেঘের রাজ্যে নিরাপদে রাখা", "Google Drive acts as an online vault, helping protect files from a damaged or stolen computer and making them available elsewhere.", "পিসি নষ্ট বা চুরি হলেও ফাইল না হারানোর জন্য Google Drive অনলাইন লকারের মতো কাজ করে এবং অন্য ডিভাইস থেকেও ফাইল পাওয়া যায়।", "https://images.pexels.com/photos/4145153/pexels-photo-4145153.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Document Creation: Say Goodbye to Messy Handwriting", "ডকুমেন্ট তৈরি: ডিজিটাল খাতা-কলমের যুগ", "Use Microsoft Word or Google Docs to create clean, professional resumes, applications, and notes.", "Microsoft Word বা Google Docs ব্যবহার করে সুন্দর ও প্রফেশনাল CV, দরখাস্ত ও নোট তৈরি করা যায়।", "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
    quiz: { q: "Where do you enter the recipient's email address in Gmail?", qBn: "জিমেইলে প্রাপকের ইমেইল আইডি কোথায় লিখতে হয়?", opts: ["Subject", "To", "Attachment", "Desktop"], optsBn: ["Subject ঘরে", "To ঘরে", "Attachment-এ", "ডেস্কে"], answer: 1, explain: "The recipient's address belongs in the To field.", explainBn: "প্রাপকের ইমেইল ঠিকানা To ঘরেই লিখতে হয়।" },
  },
  {
    title: "Troubleshooting & Security", titleBn: "বেসিক ট্রাবলশুটিং ও ইন্টারনেট সিকিউরিটি", minutes: 15,
    intro: "Learn calm troubleshooting, strong password habits, malware awareness, and the confidence to keep practicing.", introBn: "শান্তভাবে সমস্যা সমাধান, শক্তিশালী পাসওয়ার্ড, ম্যালওয়্যার সম্পর্কে সচেতনতা এবং নিয়মিত অনুশীলনের অভ্যাস তৈরি করো।",
    sections: [
      ["What to Do When Your PC Hangs? The Magical Restart", "কম্পিউটার হ্যাং করলে কী করবেন? রিস্টার্টের মহৌষধ", "If your PC freezes under heavy load, do not panic. Close the stuck app or use a safe Restart from the Start menu.", "পিসি অতিরিক্ত চাপে ফ্রিজ হলে প্যানিক করো না। আটকে থাকা অ্যাপ বন্ধ করো অথবা Start menu থেকে নিরাপদে Restart করো।", "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Password Security: Hanging Unbreakable Digital Locks", "পাসওয়ার্ড সুরক্ষা: দুর্ভেদ্য ডিজিটাল তালা ঝোলানো", "Weak passwords invite attackers. Use 8 or more characters with a mix of uppercase, lowercase, numbers, and symbols, and keep passwords unique.", "123456 বা নিজের নামের মতো সহজ পাসওয়ার্ড হ্যাকারদের আমন্ত্রণ জানায়। বড়-ছোট অক্ষর, সংখ্যা ও চিহ্ন মিলিয়ে ৮ বা তার বেশি অক্ষরের আলাদা পাসওয়ার্ড ব্যবহার করো।", "https://images.pexels.com/photos/6069510/pexels-photo-6069510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
      ["Viruses & Antivirus: The Digital Flu and Vaccine", "ভাইরাস ও অ্যান্টিভাইরাস: কম্পিউটারের সর্দি-কাশি ও তার ভ্যাকসিন", "Malware can damage files and slow a PC. Trusted antivirus software acts like an immune system that detects and blocks threats.", "ক্ষতিকর ম্যালওয়্যার বা ভাইরাস ফাইল নষ্ট করে পিসি স্লো করতে পারে। বিশ্বস্ত অ্যান্টিভাইরাস পিসির রোগ প্রতিরোধ ক্ষমতার মতো কাজ করে।", "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=800"],
      ["Course Wrap-up: You Are Now a Confident Computer Master!", "সমাপনী কথা: আপনি এখন একজন আত্মবিশ্বাসী কম্পিউটার বস!", "By finishing these chapters, you have conquered tech anxiety and become a confident computer user. Keep practicing.", "এই পাঁচটি চ্যাপ্টার শেষ করে তুমি টেকনোলজির ভয় কাটিয়ে একজন দক্ষ ও আত্মবিশ্বাসী কম্পিউটার ব্যবহারকারী হয়েছো। নিয়মিত চর্চা চালিয়ে যাও।", "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ],
    quiz: { q: "Which tool is used to remove computer viruses?", qBn: "কম্পিউটারের ভাইরাস দূর করার জন্য কোনটি ব্যবহার করা হয়?", opts: ["Antivirus", "Recycle Bin", "Browser", "Google Drive"], optsBn: ["অ্যান্টিভাইরাস", "রিসাইকেল বিন", "ব্রাউজার", "গুগল ড্রাইভ"], answer: 0, explain: "Trusted antivirus software helps detect and remove malware.", explainBn: "বিশ্বস্ত অ্যান্টিভাইরাস ম্যালওয়্যার শনাক্ত ও দূর করতে সাহায্য করে।" },
  },
];

const requestedZeroToProLessons: AuthoredLesson[] = legacyZeroToProLessons.map((lesson, index) => index === 0 ? {
  ...lesson,
  title: "Computer Introduction & External Parts",
  titleBn: "কম্পিউটার পরিচিতি ও বাহ্যিক যন্ত্রাংশ",
  minutes: 15,
  intro: "In this era of modern technology, computers have become an inseparable part of our lives, but before diving into its magical inner world, understanding its outer appearance and fundamental identity is essential.",
  introBn: "আধুনিক প্রযুক্তির এই যুগে কম্পিউটার আমাদের জীবনের অবিচ্ছেদ্য অংশ হয়ে উঠেছে, কিন্তু এর ভেতরের কাজের জাদুকরী দুনিয়ায় প্রবেশের আগে এর বাহ্যিক রূপ ও বুনিয়াদি পরিচয় জানাটা সবচেয়ে জরুরি।",
  sections: [
    ["What is a Computer?", "কম্পিউটার আসলে কী?", "A computer is an electronic device that accepts instructions or data from humans, processes it accurately, and produces results. It cannot think on its own; it simply follows human commands precisely.", "কম্পিউটার হলো একটি ইলেকট্রনিক ডিভাইস, যা মানুষের দেওয়া নির্দেশ বা ডেটা গ্রহণ করে তা নিখুঁতভাবে প্রসেস করে ফলাফল প্রকাশ করে। এটি নিজের থেকে কোনো চিন্তা করতে পারে না, কেবল আমাদের দেওয়া নির্দেশ নির্ভুলভাবে পালন করে।", "https://snu.edu.in/site/assets/files/16756/b.tech.incomputerscience.1200x0.1600x0.webp"],
    ["Function of the Monitor", "মনিটর (Monitor) এর কাজ", "The monitor is the screen or visual output device of a computer. Whatever we type, play, or browse is clearly displayed right in front of us through this screen.", "মনিটর হলো কম্পিউটারের পর্দা বা ভিজ্যুয়াল আউটপুট ডিভাইস। আমরা কম্পিউটারে যা টাইপ করি, গেম খেলি কিংবা ব্রাউজ করি—সবকিছু পরিষ্কারভাবে এই স্ক্রিনের মাধ্যমে আমাদের সামনে ভেসে ওঠে।", "https://cdn.mos.cms.futurecdn.net/FUYAofwatKBmPuUzXDNM83.jpg"],
    ["Function of the Keyboard", "কিবোর্ড (Keyboard) এর কাজ", "The keyboard is the primary text and data input medium. It contains multiple keys that allow us to type text and give various shortcuts or commands to the computer.", "কিবোর্ড হলো টেক্সট বা ডেটা ইনপুট দেওয়ার মাধ্যম। এতে অনেকগুলো বোতাম বা কি (Keys) থাকে, যার সাহায্যে আমরা লেখালেখি করি এবং কম্পিউটারকে বিভিন্ন শর্টকাট বা কমান্ড দিয়ে থাকি।", keyboardLessonImage],
    ["Function of the Mouse", "মাউস (Mouse) এর কাজ", "The mouse is a pointing device used to control the cursor on the screen. It is used to select, open files, or navigate through menus on the system.", "মাউস হলো স্ক্রিনের কার্সর বা পয়েন্টার নিয়ন্ত্রণ করার যন্ত্র। স্ক্রিনের যেকোনো ফাইল বা ফোল্ডার সিলেক্ট করা, ওপেন করা কিংবা মেনু নেভিগেট করার জন্য মাউস ব্যবহার করা হয়।", mouseLessonImage],
    ["CPU Casing and Safe Shutdown", "সিপিইউ ক্যাসিং ও নিরাপদ শাটডাউন", "The CPU casing is the main box housing all internal components safely. After finishing work, instead of cutting the power directly, the computer must be turned off safely using the Windows 'Shut down' option.", "সিপিইউ ক্যাসিং হলো মূল বাক্সটি যার ভেতরে কম্পিউটারের সব ভেতরের যন্ত্রাংশ সুরক্ষিত থাকে। কাজ শেষে সরাসরি পাওয়ার অফ না করে উইন্ডোজের 'Shut down' অপশন ব্যবহার করে কম্পিউটার নিরাপদে বন্ধ করতে হয়।", shutdownLessonImage],
  ],
  quiz: { q: "Through which device do we see visual outputs like text or games on a computer?", qBn: "আমরা কম্পিউটারে যা লিখি বা স্ক্রিনে গেম খেলি, তা কোন যন্ত্রের মাধ্যমে আমাদের সামনে ভেসে ওঠে?", opts: ["Keyboard", "Monitor", "Mouse", "CPU Casing"], optsBn: ["কিবোর্ড", "মনিটর", "মাউস", "সিপিইউ ক্যাসিং"], answer: 1, explain: "The monitor displays visual output such as text and games.", explainBn: "মনিটর লেখা, গেমসহ কম্পিউটারের ভিজ্যুয়াল আউটপুট দেখায়।" },
} : index === 1 ? {
  ...lesson,
  title: "Mouse, Keyboard & Essential Shortcuts", titleBn: "মাউস, কিবোর্ড ও প্রয়োজনীয় শর্টকাট", minutes: 15,
  intro: "Now that you can turn on the computer, let's learn how to use the mouse properly, type on the keyboard, and master some magical shortcuts to boost your workflow speed.", introBn: "কম্পিউটার তো অন করতে পারলেন, এবার হাত দিয়ে মাউস নাড়ানোর কায়দা, কিবোর্ডে আঙুল চালানোর নিয়ম এবং কাজের গতি কয়েকগুণ বাড়িয়ে দেওয়ার জাদুকরী কিছু শর্টকাট শিখে নেওয়া যাক।",
  sections: [
    ["Mouse Functions: Left, Right & Double Click", "মাউসের কাজ: ক্লিক আর ডাবল ক্লিকের খেলা", "Pressing the left mouse button once (Left Click) selects or opens items. Pressing the right button (Right Click) pops up an options menu. To open a folder or software quickly, press the left button twice in rapid succession, known as a double click.", "মাউসের বাম দিকের বোতামে একবার চাপ দিলে (Left Click) যেকোনো কিছু সিলেক্ট বা ওপেন হয়। আর ডান দিকের বোতামে চাপ দিলে (Right Click) একটা ছোট মেনু বা অপশন বক্স ভেসে ওঠে। এছাড়া কোনো ফোল্ডার বা সফটওয়্যার দ্রুত খুলতে হলে বাম বোতামে পর পর দ্রুত দুইবার চাপ দিতে হয়, যাকে ডাবল ক্লিক বলে।", "https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Keyboard Typing and Basic Key Functions", "কিবোর্ডের টাইপিং ও বেসিক বোতামগুলোর কাজ", "Apart from letters and numbers, the keyboard has special keys. Spacebar adds spaces, Enter moves to a new line, and Backspace deletes typing mistakes.", "কিবোর্ডে অনেকগুলো অক্ষর ও সংখ্যা ছাড়াও কিছু বিশেষ বোতাম থাকে। যেমন—লেখার মাঝে ফাঁকা দিতে 'Spacebar', নতুন লাইনে যাওয়ার জন্য 'Enter', আর ভুল লেখা মুছে ফেলার জন্য 'Backspace' ব্যবহার করা হয়। এগুলো জানা থাকলে খুব সহজে লেখালেখি করা যায়।", "https://images.pexels.com/photos/5385525/pexels-photo-5385525.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["10 Essential Keyboard Shortcuts to Boost Workflow", "কাজের গতি বাড়াতে ১০টি জরুরি কিবোর্ড শর্টকাট", "Instead of relying only on the mouse, knowing key shortcuts speeds up tasks instantly.\n1. Ctrl + C: Used to copy text or files.\n2. Ctrl + V: Used to paste copied items to a desired location.\n3. Ctrl + X: Used to cut text or files to move them elsewhere.\n4. Ctrl + A: Used to select all items or text on the screen or folder.\n5. Ctrl + Z: Used to undo your last action and revert to the previous state.\n6. Ctrl + S: Used to save your working files or documents securely.\n7. Ctrl + F: Used to find specific words or text within a document.\n8. Ctrl + P: Used to open the print window for printing documents.\n9. Alt + Tab: Used to quickly switch between open applications and windows.\n10. Windows Key + D: Used to instantly minimize all active windows and go straight to the desktop.", "বারবার মাউস দিয়ে ক্লিক করে কাজ না করে কিবোর্ডের কিছু দুর্দান্ত শর্টকাট জানলে কাজ নিমেষে শেষ করা যায়। নিচে কম্পিউটারের সবচেয়ে জরুরি ১০টি শর্টকাট এবং তাদের সুনির্দিষ্ট কাজ দেওয়া হলো:\n১. Ctrl + C: কোনো লেখা বা ফাইল কপি (Copy) করতে এটি ব্যবহার করা হয়।\n২. Ctrl + V: কপি করা লেখা বা ফাইল নির্দিষ্ট জায়গায় পেস্ট বা বসাতে এটি ব্যবহার করা হয়।\n৩. Ctrl + X: কোনো লেখা বা ফাইল এক জায়গা থেকে কেটে অন্য জায়গায় সরানোর জন্য (Cut) এটি ব্যবহার করা হয়।\n৪. Ctrl + A: একটি পেজের সব লেখা বা ফোল্ডারের সব ফাইল একসাথে সিলেক্ট (Select All) করতে এটি ব্যবহার করা হয়।\n৫. Ctrl + Z: কম্পিউটারে কাজ করার সময় ভুল কিছু হয়ে গেলে এক ধাপ পেছনে বা আগের অবস্থায় ফিরে যেতে (Undo) এটি ব্যবহার করা হয়।\n৬. Ctrl + S: কাজের ফাইল বা ডকুমেন্ট নিরাপদে সংরক্ষণ (Save) করতে এটি ব্যবহার করা হয়।\n৭. Ctrl + F: কোনো বড় ডকুমেন্টের ভেতর থেকে নির্দিষ্ট কোনো শব্দ বা লেখা খুঁজে বের করতে (Find) এটি ব্যবহার করা হয়।\n৮. Ctrl + P: যেকোনো ডকুমেন্ট বা পেজ প্রিন্ট করার জন্য প্রিন্ট উইন্ডো ওপেন করতে এটি ব্যবহার করা হয়।\n৯. Alt + Tab: একসাথে খোলা একাধিক সফটওয়্যার বা উইন্ডো দ্রুত পরিবর্তন (Switch) করতে এটি ব্যবহার করা হয়।\n১০. Windows Key + D: স্ক্রিনে থাকা সব অ্যাপস বা উইন্ডো মিনিমাইজ করে ডেস্কটপে যেতে এটি ব্যবহার করা হয়।", "https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["The Magic Mistake Fixer: Undo (Ctrl + Z)", "ভুল সংশোধনের জাদুকরী শর্টকাট: আন্ডু (Ctrl + Z)", "If you accidentally delete important text or make a mistake, press Ctrl + Z and your previous action will be undone and restored.", "কম্পিউটারে কাজ করার সময় ভুলবশত কোনো জরুরি লেখা কেটে ফেললে বা কোনো ফাইল এদিক-সেদিক হয়ে গেলে ভয় পাওয়ার কিছু নেই! কিবোর্ডের Ctrl চেপে ধরে Z চাপলেই কাটা যাওয়া লেখা বা আগের অবস্থা আবার ফিরে আসবে।", "https://images.pexels.com/photos/4864249/pexels-photo-4864249.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Select All Shortcut (Ctrl + A)", "একসাথে সব সিলেক্ট করার শর্টকাট (Ctrl + A)", "To select hundreds of lines or all files in a folder at once, press Ctrl + A on your keyboard.", "একটি পেজের হাজারটা লাইন বা ফোল্ডারের সব ফাইল একসাথে সিলেক্ট করতে কিবোর্ডের Ctrl চেপে ধরে A চাপলেই সবকিছু একসাথে সিলেক্ট হয়ে যাবে।", "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ],
  quiz: { q: "Which keyboard shortcut is used to copy any text or file on a computer?", qBn: "কম্পিউটারে যেকোনো লেখা বা ফাইল কপি করার জন্য কিবোর্ডের কোন শর্টকাটটি ব্যবহার করা হয়?", opts: ["Ctrl + V", "Ctrl + C", "Ctrl + Z", "Ctrl + A"], optsBn: ["Ctrl + V", "Ctrl + C", "Ctrl + Z", "Ctrl + A"], answer: 1, explain: "Ctrl + C is used to copy text or files.", explainBn: "Ctrl + C লেখা বা ফাইল কপি করার জন্য ব্যবহার করা হয়।" },
} : index === 2 ? {
  ...lesson,
  title: "Desktop Navigation & File Management", titleBn: "ডেস্কটপ নেভিগেশন ও ফাইল-ফোল্ডার ম্যানেজমেন্ট", minutes: 15,
  intro: "Now that you know the basics, let's learn how to navigate the main screen and organize your working files and folders neatly just the way you want.", introBn: "কম্পিউটার অন করার পর সামনে যে বিশাল স্ক্রিনটি ভেসে ওঠে, তাকে নিজের মতো করে সাজানো এবং কাজের ফাইলগুলো গুছিয়ে রাখার নিখুঁত কৌশলগুলো এবার শিখে নেওয়া যাক।",
  sections: [
    ["Desktop Screen and Taskbar Overview", "ডেস্কটপ স্ক্রিন ও টাস্কবারের পরিচিতি", "The main screen that appears after turning on the computer is called the desktop, where shortcuts to your apps and files are kept. The long bar at the very bottom of the screen is called the taskbar, used to open the Start menu and manage running apps.", "কম্পিউটার চালু হওয়ার পর চোখের সামনে যে মূল স্ক্রিনটি ভেসে ওঠে, তাকে ডেস্কটপ বলে। এখানে আপনার প্রয়োজনীয় সফটওয়্যার বা ফাইলের শর্টকাট আইকনগুলো সাজানো থাকে। আর স্ক্রিনের একদম নিচের লম্বা বারটিকে টাস্কবার (Taskbar) বলা হয়, যেখান থেকে স্টার্ট মেনু ওপেন করা এবং রানিং অ্যাপসগুলো দেখা যায়।", "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["How to Create a New Folder", "নতুন ফোল্ডার তৈরি করার সহজ নিয়ম", "To keep your computer files organized, you need folders. Right-click on any empty space on the desktop, hover over New, and click Folder. Type your preferred name and press Enter.", "কম্পিউটারে এলোমেলো ফাইল না রেখে গুছিয়ে রাখার জন্য ফোল্ডারের প্রয়োজন হয়। ডেস্কটপের যেকোনো ফাঁকা জায়গায় মাউসের ডান বোতামে ক্লিক করলে একটি ছোট মেনু আসবে। সেখানে New অপশনে মাউস নিলে পাশে Folder লেখা আসবে, তাতে ক্লিক করলেই নতুন ফোল্ডার তৈরি হবে। এরপর নিজের পছন্দমতো নাম লিখে এন্টার চাপলেই কাজ শেষ।", "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["How to Rename Files or Folders", "ফাইলের নাম পরিবর্তন বা রিনেম (Rename) করা", "To change a folder or file name, right-click it and select Rename, or select it and press F2. Type the new name and press Enter.", "কোনো ফোল্ডার বা ফাইলের নাম পরে পরিবর্তন করার প্রয়োজন হলে, সেটির ওপর মাউসের ডান ক্লিক করে Rename অপশনে ক্লিক করতে হবে। অথবা ফোল্ডারটি সিলেক্ট করে কিবোর্ডের F2 বোতাম চাপলেই নাম লেখার জায়গা আসবে। এরপর নতুন নাম লিখে এন্টার চাপলেই নাম বদল হয়ে যাবে।", "https://images.pexels.com/photos/4344860/pexels-photo-4344860.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Deleting Files and Recycle Bin", "ফাইল ডিলিট ও রিসাইকেল বিনের কাজ", "Select an unwanted file and press Delete. It first goes to the Recycle Bin, where an accidentally deleted file can be restored.", "কোনো অপ্রয়োজনীয় ফাইল বা ফোল্ডার মুছে ফেলতে চাইলে সেটির ওপর ক্লিক করে কিবোর্ডের Delete বোতাম চাপতে হবে। ফাইলটি স্থায়ীভাবে মোছার আগে Recycle Bin-এ জমা হয়। ভুলবশত ডিলিট হলে সেখান থেকে আগের জায়গায় ফিরিয়ে আনা যায়।", "https://images.pexels.com/photos/8486915/pexels-photo-8486915.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Navigating Drives and Searching Files", "ড্রাইভ ও পিসি থেকে ফাইল খোঁজা", "Open This PC or File Explorer, browse drives such as C or D, or type the file name in the search bar to find it.", "ফাইল বা সফটওয়্যার খুঁজে পাওয়ার জন্য This PC বা ফাইল এক্সপ্লোরার ওপেন করতে হয়। সেখানে C Drive বা D Drive-এর ভেতরে প্রবেশ করে বা ওপরের সার্চ বারে ফাইলের নাম লিখে যেকোনো ফাইল খুঁজে বের করা সম্ভব।", "https://images.pexels.com/photos/4864249/pexels-photo-4864249.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ],
  quiz: { q: "Which keyboard shortcut or key is used to quickly rename a file or folder?", qBn: "কম্পিউটারে কোনো ফোল্ডার বা ফাইলের নাম দ্রুত পরিবর্তনের (Rename) জন্য কিবোর্ডের কোন বোতামটি চাপতে হয়?", opts: ["F1", "F2", "F5", "Enter"], optsBn: ["F1", "F2", "F5", "Enter"], answer: 1, explain: "F2 quickly renames the selected file or folder.", explainBn: "F2 চাপলে নির্বাচিত ফাইল বা ফোল্ডারের নাম দ্রুত বদলানো যায়।" },
} : index === 3 ? {
  ...lesson,
  title: "Internal Hardware & Basic Troubleshooting", titleBn: "ভেতরের যন্ত্রাংশ ও বেসিক ট্রাবলশুটিং", minutes: 15,
  intro: "Now that you know the external parts, let's explore the core engines inside the magical box and learn what to do when your PC slows down or faces minor issues.", introBn: "কম্পিউটারের বাইরে থেকে যা দেখা যায় তার তো জানা হলো, এবার এই জাদুকরী বাক্সের ভেতরে থাকা মূল ইঞ্জিনগুলোর কাজ কী এবং পিসি স্লো হলে বা ছোটখাটো সমস্যা দেখা দিলে কী করতে হবে, তা জেনে নেওয়া যাক।",
  sections: [
    ["CPU: The Brain of the Computer", "সিপিইউ (CPU): কম্পিউটারের আসল মগজ", "The most important part inside the computer is the CPU or processor, often called the brain of the computer. Whatever commands we give via the mouse or keyboard, all calculations and operations are handled precisely by this CPU.", "কম্পিউটারের ভেতরে থাকা সবচেয়ে গুরুত্বপূর্ণ অংশ হলো সিপিইউ বা প্রসেসর, যাকে কম্পিউটারের মগজ বলা হয়। আমরা মাউস বা কিবোর্ড দিয়ে যে নির্দেশই দিই না কেন, তার যাবতীয় হিসাব-নিকাশ এবং পরিচালনা এই সিপিইউ একাই নিখুঁতভাবে সম্পন্ন করে থাকে।", "https://images.pexels.com/photos/4864249/pexels-photo-4864249.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["RAM: The Temporary Working Table", "র‍্যাম (RAM): রানিং কাজের অস্থায়ী টেবিল", "RAM is the temporary memory of the computer. Software, games, or browsers currently active on your screen run quickly using this RAM. When you turn off the computer, everything stored in RAM is cleared.", "র‍্যাম হলো কম্পিউটারের অস্থায়ী মেমোরি। আমরা বর্তমানে কম্পিউটারের স্ক্রিনে যে সফটওয়্যার, গেম বা ব্রাউজার চালিয়ে রাখি, সেগুলো দ্রুত কাজ করার জন্য এই র‍্যামের ভেতর জমা থাকে। তবে কম্পিউটার বন্ধ করলেই র‍্যামের ভেতরের সব ডেটা সম্পূর্ণ খালি হয়ে যায়।", "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["SSD or Hard Disk: The Permanent Storage", "এসএসডি বা হার্ডডিস্ক: স্থায়ী স্টোরেজ বা সিন্দুক", "SSD or Hard Disk is the permanent storage space where files, software, photos, music, and videos are saved for the long term. While RAM handles active tasks temporarily, it keeps your data safely stored.", "কম্পিউটারের ভেতরে ফাইল, সফটওয়্যার, ছবি, গান বা ভিডিও চিরদিনের জন্য জমা রাখার স্থায়ী জায়গা হলো এসএসডি বা হার্ডডিস্ক। র‍্যাম সাময়িকভাবে কাজ চালালেও, আপনার সমস্ত জিনিস নিরাপদে দীর্ঘমেয়াদে সংরক্ষণ করে রাখার কাজটি এই হার্ডডিস্ক বা এসএসডি করে থাকে।", "https://images.pexels.com/photos/11391947/pexels-photo-11391947.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Hardware vs Software: A Simple Difference", "হার্ডওয়্যার বনাম সফটওয়্যার: সহজ পার্থক্য", "Physical components that we can touch are hardware. Programs and operating systems that run invisibly are software. Hardware cannot function alone without software.", "কম্পিউটারের যে যন্ত্রগুলো আমরা হাত দিয়ে ধরতে বা স্পর্শ করতে পারি, সেগুলোকে হার্ডওয়্যার বলে। যে প্রোগ্রাম বা অপারেটিং সিস্টেম অদৃশ্য থেকে কম্পিউটারকে সচল রাখে, সেগুলোকে সফটওয়্যার বলে। সফটওয়্যার ছাড়া হার্ডওয়্যার একা কোনো কাজ করতে পারে না।", "https://images.pexels.com/photos/5385525/pexels-photo-5385525.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Basic Solutions for Slow or Hanged PC", "কম্পিউটার স্লো হলে বা হ্যাং করলে প্রাথমিক সমাধান", "If your computer slows down or stops responding, close unnecessary background apps, press Ctrl + Shift + Esc to open Task Manager and close the frozen app, or restart the PC.", "কম্পিউটার চালাতে চালাতে হঠাৎ যদি স্লো হয়ে যায় বা কাজ করা বন্ধ করে দেয়, তবে অপ্রয়োজনীয় ব্যাকগ্রাউন্ড অ্যাপস বন্ধ করা, Ctrl + Shift + Esc চেপে টাস্ক ম্যানেজার থেকে হ্যাং হওয়া অ্যাপটি ক্লোজ করা, অথবা কম্পিউটার একবার Restart দেওয়া যায়।", "https://images.pexels.com/photos/3674083/pexels-photo-3674083.jpeg?auto=compress&cs=tinysrgb&w=800"],
  ],
  quiz: { q: "Which memory completely clears all its data when the computer is shut down?", qBn: "কম্পিউটার বন্ধ বা শাটডাউন করলে কোন মেমোরির ভেতরের সমস্ত ডেটা সম্পূর্ণ মুছে বা খালি হয়ে যায়?", opts: ["Hard Disk", "SSD", "RAM", "Pen Drive"], optsBn: ["হার্ডডিস্ক", "এসএসডি", "র‍্যাম", "পেনড্রাইভ"], answer: 2, explain: "RAM clears its temporary data when power is removed.", explainBn: "কম্পিউটার বন্ধ হলে RAM-এর অস্থায়ী ডেটা খালি হয়ে যায়।" },
} : index === 4 ? {
  ...lesson,
  title: "Internet Browsing & Online Safety", titleBn: "ইন্টারনেট ব্রাউজিং ও অনলাইন সেফটি", minutes: 15,
  intro: "Now that you know how to operate the computer, let's step into the magical world of the internet that brings the whole world to your fingertips, and learn essential safety browsing tips.", introBn: "কম্পিউটার তো চালানো শিখলেন, এবার সারা পৃথিবীকে হাতের মুঠোয় এনে দেওয়ার জাদুকরী মাধ্যম ইন্টারনেটের দুনিয়ায় প্রবেশ এবং নিরাপদে ব্রাউজ করার প্রয়োজনীয় কৌশলগুলো জেনে নেওয়া যাক।",
  sections: [
    ["What is the Internet?", "ইন্টারনেট আসলে কী?", "Simply put, the internet is a massive network connecting millions of computers worldwide. Through this network, you can instantly share information, watch videos, or communicate globally right from your room.", "সহজ কথায় ইন্টারনেট হলো সারা পৃথিবীর কোটি কোটি কম্পিউটারকে একসাথে যুক্ত করার একটি বিশাল জাল বা নেটওয়ার্ক। এই নেটওয়ার্কের মাধ্যমে ঘরের কোণে বসেই নিমিষেই পৃথিবীর যেকোনো প্রান্তের তথ্য আদান-প্রদান করা, ভিডিও দেখা বা যোগাযোগ করা সম্ভব হয়।", "https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Web Browser and Address Bar", "ওয়েব ব্রাউজার ও এড্রেস বারের কাজ", "To access the internet, we use web browsers such as Google Chrome or Microsoft Edge. The long bar at the top is the address bar; type a website address or URL there and press Enter.", "ইন্টারনেটে প্রবেশ করার জন্য কম্পিউটারে বিশেষ কিছু সফটওয়্যার ব্যবহার করতে হয়, যেগুলোকে ওয়েব ব্রাউজার বলে। ব্রাউজারের উপরের লম্বা ঘরটি এড্রেস বার; সেখানে ওয়েবসাইটের নাম বা URL লিখে এন্টার চাপলেই সাইটটি ওপেন হয়ে যায়।", "https://images.pexels.com/photos/15942036/pexels-photo-15942036.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Finding Information Using Search Engines", "সার্চ ইঞ্জিন ব্যবহার করে সঠিক তথ্য খোঁজা", "Search engines such as Google help you find useful information and websites. Type your topic in the search bar to see relevant results.", "ইন্টারনেটে কোটি কোটি ওয়েবসাইট রয়েছে। নিজের কাজের জিনিস খুঁজে পাওয়ার জন্য গুগলের মতো সার্চ ইঞ্জিন ব্যবহার করা হয়। সার্চ বারে বিষয় লিখলেই প্রয়োজনীয় তথ্য ও ওয়েবসাইট সামনে চলে আসে।", "https://images.pexels.com/photos/5385525/pexels-photo-5385525.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Visiting Websites and URL Links", "ওয়েবসাইট ভিজিট ও লিঙ্ক পরিচিতি", "Clicking a result opens a website. Every website has its own address or link, called a URL, which takes you from one page to another.", "সার্চ রেজাল্টে যে নীল রঙের নামগুলো দেখা যায়, সেগুলোতে ক্লিক করলে নির্দিষ্ট ওয়েবসাইটে প্রবেশ করা যায়। প্রতিটি ওয়েবসাইটের নিজস্ব ঠিকানা বা লিঙ্ককে URL বলা হয়।", "https://images.pexels.com/photos/17323801/pexels-photo-17323801.jpeg?auto=compress&cs=tinysrgb&w=800"],
    ["Online Safety and Secure Browsing", "অনলাইন নিরাপত্তা ও নিরাপদ ব্রাউজিং", "Avoid unknown or suspicious links, do not download files from strangers, and never save personal passwords on public computers.", "অচেনা বা সন্দেহজনক কোনো লিঙ্কে হুট করে ক্লিক করা থেকে বিরত থাকো, অপরিচিত কারো দেওয়া ফাইল ডাউনলোড করো না এবং পাবলিক কম্পিউটারে ব্যক্তিগত অ্যাকাউন্ট বা পাসওয়ার্ড সেভ করো না।", "https://images.pexels.com/photos/6069510/pexels-photo-6069510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200"],
  ],
  quiz: { q: "Which of the following do we typically use to search for information or websites on the internet?", qBn: "ইন্টারনেটে যেকোনো তথ্য বা ওয়েবসাইট খোঁজার জন্য আমরা সাধারণত নিচের কোনটি ব্যবহার করি?", opts: ["MS Word", "A search engine, such as Google", "Recycle Bin", "Task Manager"], optsBn: ["এমএস ওয়ার্ড", "সার্চ ইঞ্জিন, যেমন- গুগল", "রিসাইকেল বিন", "টাস্ক ম্যানেজার"], answer: 1, explain: "A search engine such as Google helps find information online.", explainBn: "গুগলের মতো সার্চ ইঞ্জিন অনলাইনে তথ্য ও ওয়েবসাইট খুঁজে পেতে সাহায্য করে।" },
} : lesson);

const createZeroToProLesson = (courseId: string, index: number): Chapter => {
  const lesson = requestedZeroToProLessons[index];
  const chapter = createEmptyChapter(courseId, index);
  if (!lesson) return chapter;
  return {
    ...chapter,
    title: lesson.title,
    titleBn: lesson.titleBn,
    minutes: lesson.minutes,
    intro: lesson.intro,
    introBn: lesson.introBn,
    sections: lesson.sections.map(([h, hBn, b, bBn, imageUrl]) => ({ h, hBn, b, bBn, imageUrl })),
    quiz: lesson.quiz,
  };
};

const legacyCreateExamChapter = (courseId: string): Chapter => ({
  ...createEmptyChapter(courseId, 5),
  title: "Your Digital Success Journey: Skills Assessment",
  titleBn: "আপনার ডিজিটাল সাফল্যের যাত্রাপথ: দক্ষতা যাচাই ও মূল্যায়ন",
  minutes: 30,
  intro: "Complete the five learning chapters, then use this assessment to demonstrate your skills.",
  introBn: "প্রথম পাঁচটি শিক্ষামূলক চ্যাপ্টার শেষ করে এই পরীক্ষায় তোমার দক্ষতা যাচাই করো।",
  exam: {
    title: "Your Digital Success Journey: Assessment",
    titleBn: "আপনার ডিজিটাল সাফল্যের যাত্রাপথ: পরীক্ষা ও মূল্যায়ন",
    description: "Dear Student,\nCongratulations! You have successfully completed the first important part of your learning journey. Now it is time to evaluate your skills based on all the concepts you have learned so far, ranging from computer and internet basics.\nThis test will play a very effective role in checking how well-prepared you are.\n\n⚠️ Exam Guidelines & Rules:\nTotal Questions: 15 Multiple Choice Questions (MCQs).\nTotal Marks: 30 marks (2 marks for each question).\nPassing Marks: 25 marks (Scoring 25 or above is required to pass and earn a certificate).\nTime Limit: A total of 15 minutes has been allocated for the entire exam.\nStart & End: As soon as you click the Start Skill Test button, a countdown timer will start at the top of the screen.\nSubmission Rules: You can submit your paper by pressing the Submit button at your discretion. However, once the designated 15 minutes are over, the exam will automatically close with no further opportunity to submit.\nResult & Report: No score or result will be shown on the screen immediately after submission. After completing the exam, you must go to the Exam Report option in your dashboard to view your detailed exam results and report.\n\nTest your preparation with a calm mind.\nIf you are ready, click the button below to start the exam!",
    descriptionBn: "প্রিয় শিক্ষার্থী,\nঅভিনন্দন! আপনি আপনার লার্নিং জার্নির প্রথম গুরুত্বপূর্ণ অংশটি সফলভাবে সম্পন্ন করেছেন। এতদিন ধরে কম্পিউটার ও ইন্টারনেটের বেসিক থেকে শুরু করে যে সমস্ত কনসেপ্ট আপনি শিখেছেন, তার ওপর আপনার দক্ষতা যাচাইয়ের সময় এটি।\nনিজের প্রস্তুতি কতদূর হলো তা যাচাই করতে এই টেস্টটি অত্যন্ত কার্যকর ভূমিকা রাখবে।\n\n⚠️ পরীক্ষার নির্দেশিকা ও নিয়মাবলী:\nমোট প্রশ্ন: ১৫টি বহুচয়নমূলক প্রশ্ন (MCQ)।\nপূর্ণমান: ৩০ নম্বর (প্রতিটি প্রশ্নের মান ২ করে)।\nপাস নম্বর: ২৫ নম্বর (২৫ বা তার বেশি পেলে আপনি পাস করবেন এবং সার্টিফিকেট পাবেন)।\nসময়সীমা: পুরো পরীক্ষার জন্য মোট ১৫ মিনিট সময় নির্ধারণ করা হয়েছে।\nশুরু ও শেষ: Start Skill Test বাটনে ক্লিক করার সাথে সাথেই স্ক্রিনের ওপরের দিকে কাউন্টডাউন টাইমার শুরু হয়ে যাবে।\nসাবমিশন নিয়ম: আপনি নিজের ইচ্ছায় Submit বাটন প্রেস করে খাতা জমা দিতে পারবেন। তবে নির্ধারিত ১৫ মিনিট পার হয়ে গেলে পরীক্ষা সাথে সাথে অটোমেটিক ক্লোজ হয়ে যাবে এবং আর সাবমিট করার সুযোগ থাকবে না।\nফলাফল ও রিপোর্ট: পরীক্ষা জমা দেওয়ার পর তাৎক্ষণিকভাবে কোনো স্কোর বা ফলাফল স্ক্রিনে দেখা যাবে না। পরীক্ষা সম্পন্ন হওয়ার পর আপনার ড্যাশবোর্ডের Exam Report অপশনে প্রবেশ করে আপনার সম্পূর্ণ পরীক্ষার বিস্তারিত ফলাফল ও রিপোর্ট দেখতে হবে।\n\nঠান্ডা মাথায় নিজের প্রস্তুতি যাচাই করুন।\nআপনি প্রস্তুত থাকলে নিচের বাটনে ক্লিক করে পরীক্ষা শুরু করুন!",
    startLabel: "Start Skill Test",
    startLabelBn: "Start Skill Test",
    passMark: 25,
    totalMarks: 30,
    timeLimitMinutes: 15,
    requiresPreviousStep: true,
    questions: [
      { q: "What does the CPU do in a computer?", qBn: "কম্পিউটারে CPU কী কাজ করে?", opts: ["Stores deleted files", "Processes instructions", "Displays websites", "Connects a mouse"], optsBn: ["ডিলিট করা ফাইল রাখে", "নির্দেশ প্রসেস করে", "ওয়েবসাইট দেখায়", "মাউস যুক্ত করে"], answer: 1, explain: "The CPU processes instructions and coordinates the computer's work.", explainBn: "CPU নির্দেশ প্রসেস করে এবং কম্পিউটারের কাজ সমন্বয় করে।" },
      { q: "Which memory is used as the active working desk and clears when power is off?", qBn: "কোন মেমোরি চলমান কাজের টেবিল হিসেবে ব্যবহৃত হয় এবং বিদ্যুৎ বন্ধ হলে খালি হয়ে যায়?", opts: ["Hard disk", "Monitor", "RAM", "Keyboard"], optsBn: ["হার্ডডিস্ক", "মনিটর", "RAM", "কিবোর্ড"], answer: 2, explain: "RAM temporarily holds active work while the computer is running.", explainBn: "কম্পিউটার চলার সময় RAM সাময়িকভাবে চলমান কাজ ধরে রাখে।" },
      { q: "What is the main purpose of a folder?", qBn: "ফোল্ডারের প্রধান উদ্দেশ্য কী?", opts: ["To organize files", "To increase Wi-Fi speed", "To remove malware", "To turn off the monitor"], optsBn: ["ফাইল গুছিয়ে রাখা", "Wi-Fi-এর গতি বাড়ানো", "ম্যালওয়্যার দূর করা", "মনিটর বন্ধ করা"], answer: 0, explain: "Folders act like digital drawers for organizing related files.", explainBn: "ফোল্ডার ডিজিটাল ড্রয়ারের মতো সম্পর্কিত ফাইল গুছিয়ে রাখে।" },
      { q: "What usually happens first when a file is deleted in Windows?", qBn: "Windows-এ কোনো ফাইল ডিলিট করলে সাধারণত প্রথমে কী হয়?", opts: ["It becomes an email", "It opens in a browser", "It moves to the Recycle Bin", "It changes its name"], optsBn: ["এটি ইমেইল হয়ে যায়", "ব্রাউজারে খোলে", "এটি Recycle Bin-এ যায়", "এর নাম বদলে যায়"], answer: 2, explain: "Deleted files usually move to the Recycle Bin before permanent deletion.", explainBn: "স্থায়ীভাবে ডিলিট করার আগে ফাইল সাধারণত Recycle Bin-এ যায়।" },
      { q: "Which tool is used to find information on the internet?", qBn: "ইন্টারনেটে তথ্য খুঁজতে কোন টুল ব্যবহার করা হয়?", opts: ["A search engine", "A recycle bin", "A taskbar", "A hard disk"], optsBn: ["সার্চ ইঞ্জিন", "রিসাইকেল বিন", "টাস্কবার", "হার্ডডিস্ক"], answer: 0, explain: "A search engine such as Google finds information across the web.", explainBn: "Google-এর মতো সার্চ ইঞ্জিন ওয়েবের বিভিন্ন তথ্য খুঁজে দেয়।" },
      { q: "What is the role of a browser?", qBn: "ব্রাউজারের ভূমিকা কী?", opts: ["To store deleted files", "To open and view websites", "To replace antivirus", "To format a hard disk"], optsBn: ["ডিলিট করা ফাইল রাখা", "ওয়েবসাইট খোলা ও দেখা", "অ্যান্টিভাইরাসের বদলে কাজ করা", "হার্ডডিস্ক ফরম্যাট করা"], answer: 1, explain: "A browser is the application used to access and view websites.", explainBn: "ব্রাউজার দিয়ে ওয়েবসাইটে প্রবেশ করে সেগুলো দেখা যায়।" },
      { q: "Which key is used to rename a selected file or folder?", qBn: "নির্বাচিত ফাইল বা ফোল্ডারের নাম বদলাতে কোন কী ব্যবহার করা হয়?", opts: ["F1", "F2", "F5", "Enter"], optsBn: ["F1", "F2", "F5", "Enter"], answer: 1, explain: "F2 starts renaming the selected item.", explainBn: "F2 নির্বাচিত ফাইল বা ফোল্ডারের নাম বদলানো শুরু করে।" },
      { q: "What is a key benefit of using folders?", qBn: "ফোল্ডার ব্যবহারের একটি প্রধান সুবিধা কী?", opts: ["They organize files", "They increase monitor brightness", "They replace the keyboard", "They turn off the computer"], optsBn: ["ফাইল গুছিয়ে রাখা", "মনিটরের উজ্জ্বলতা বাড়ানো", "কিবোর্ডের বদলে কাজ করা", "কম্পিউটার বন্ধ করা"], answer: 0, explain: "Folders organize related files in one place.", explainBn: "ফোল্ডার একই ধরনের ফাইল এক জায়গায় গুছিয়ে রাখে।" },
      { q: "What should you do when a computer freezes?", qBn: "কম্পিউটার হ্যাং করলে কী করা উচিত?", opts: ["Stay calm and safely restart if needed", "Pull the power cable immediately", "Delete the system folder", "Share your password"], optsBn: ["শান্ত থেকে প্রয়োজনে নিরাপদে Restart করা", "সঙ্গে সঙ্গে পাওয়ার কেবল টানা", "সিস্টেম ফোল্ডার ডিলিট করা", "পাসওয়ার্ড শেয়ার করা"], answer: 0, explain: "Close the stuck app or use a safe restart instead of abruptly cutting power.", explainBn: "আটকে থাকা অ্যাপ বন্ধ করো বা নিরাপদে Restart করো; হঠাৎ পাওয়ার কেটে দিও না।" },
      { q: "Which device displays text, games, and other visual output?", qBn: "কোন যন্ত্রে লেখা, গেম ও অন্যান্য ভিজ্যুয়াল আউটপুট দেখা যায়?", opts: ["Keyboard", "Monitor", "Mouse", "CPU casing"], optsBn: ["কিবোর্ড", "মনিটর", "মাউস", "সিপিইউ ক্যাসিং"], answer: 1, explain: "The monitor displays visual output.", explainBn: "মনিটর ভিজ্যুয়াল আউটপুট দেখায়।" },
      { q: "Which shortcut selects all text or files?", qBn: "সব লেখা বা ফাইল একসাথে সিলেক্ট করার শর্টকাট কোনটি?", opts: ["Ctrl + C", "Ctrl + V", "Ctrl + A", "Ctrl + Z"], optsBn: ["Ctrl + C", "Ctrl + V", "Ctrl + A", "Ctrl + Z"], answer: 2, explain: "Ctrl + A selects all available content.", explainBn: "Ctrl + A সব লেখা বা ফাইল সিলেক্ট করে।" },
      { q: "What should you do before clicking an unknown link?", qBn: "অচেনা লিঙ্কে ক্লিক করার আগে কী করা উচিত?", opts: ["Verify it first", "Share your password", "Download every file", "Save it on a public computer"], optsBn: ["আগে যাচাই করা", "পাসওয়ার্ড শেয়ার করা", "সব ফাইল ডাউনলোড করা", "পাবলিক কম্পিউটারে সেভ করা"], answer: 0, explain: "Verify suspicious links before opening them.", explainBn: "সন্দেহজনক লিঙ্ক খোলার আগে তা যাচাই করতে হয়।" },
      { q: "Which shortcut opens Task Manager for basic troubleshooting?", qBn: "বেসিক ট্রাবলশুটিংয়ের জন্য Task Manager খোলার শর্টকাট কোনটি?", opts: ["Ctrl + Shift + Esc", "Ctrl + P", "Alt + Tab", "Windows Key + D"], optsBn: ["Ctrl + Shift + Esc", "Ctrl + P", "Alt + Tab", "Windows Key + D"], answer: 0, explain: "Ctrl + Shift + Esc opens Task Manager directly.", explainBn: "Ctrl + Shift + Esc সরাসরি Task Manager খোলে।" },
      { q: "Which shortcut saves a document?", qBn: "ডকুমেন্ট সেভ করার শর্টকাট কোনটি?", opts: ["Ctrl + S", "Ctrl + F", "Ctrl + P", "Ctrl + X"], optsBn: ["Ctrl + S", "Ctrl + F", "Ctrl + P", "Ctrl + X"], answer: 0, explain: "Ctrl + S saves the current document or file.", explainBn: "Ctrl + S বর্তমান ডকুমেন্ট বা ফাইল সেভ করে।" },
      { q: "Which device is used to enter text and data?", qBn: "টেক্সট ও ডেটা ইনপুট দিতে কোন যন্ত্র ব্যবহার করা হয়?", opts: ["Monitor", "Keyboard", "CPU casing", "Recycle Bin"], optsBn: ["মনিটর", "কিবোর্ড", "সিপিইউ ক্যাসিং", "রিসাইকেল বিন"], answer: 1, explain: "The keyboard is used to enter text and data.", explainBn: "কিবোর্ড দিয়ে টেক্সট ও ডেটা ইনপুট দেওয়া হয়।" },
    ],
  },
});

const createExamChapter = (courseId: string): Chapter => ({
  ...createEmptyChapter(courseId, 5),
  title: "Final Skill Assessment",
  titleBn: "চূড়ান্ত দক্ষতা যাচাই",
  minutes: 0,
  intro: "",
  introBn: "",
  exam: {
    title: "Final Skill Test",
    titleBn: "ফাইনাল স্কিল টেস্ট",
    description: "Dear Student,\nCongratulations! You have successfully completed the first important part of your learning journey. Now it is time to evaluate your skills based on all the concepts you have learned so far, ranging from computer and internet basics.\nThis test will play a very effective role in checking how well-prepared you are.\n\n⚠️ Exam Guidelines & Rules:\nTotal Questions: 15 Multiple Choice Questions (MCQs).\nTotal Marks: 30 marks (2 marks for each question).\nPassing Marks: 25 marks (Scoring 25 or above is required to pass and earn a certificate).\nTime Limit: A total of 15 minutes has been allocated for the entire exam.\nStart & End: As soon as you click the Start Skill Test button, a countdown timer will start at the top of the screen.\nSubmission Rules: You can submit your paper by pressing the Submit button at your discretion. However, once the designated 15 minutes are over, the exam will automatically close with no further opportunity to submit.\nResult & Report: No score or result will be shown on the screen immediately after submission. After completing the exam, you must go to the Exam Report option in your dashboard to view your detailed exam results and report.\n\nTest your preparation with a calm mind.\nIf you are ready, click the button below to start the exam!",
    descriptionBn: "প্রিয় শিক্ষার্থী,\nঅভিনন্দন! আপনি আপনার লার্নিং জার্নির প্রথম গুরুত্বপূর্ণ অংশটি সফলভাবে সম্পন্ন করেছেন। এতদিন ধরে কম্পিউটার ও ইন্টারনেটের বেসিক থেকে শুরু করে যে সমস্ত কনসেপ্ট আপনি শিখেছেন, তার ওপর আপনার দক্ষতা যাচাইয়ের সময় এটি।\nনিজের প্রস্তুতি কতদূর হলো তা যাচাই করতে এই টেস্টটি অত্যন্ত কার্যকর ভূমিকা রাখবে।\n\n⚠️ পরীক্ষার নির্দেশিকা ও নিয়মাবলী:\nমোট প্রশ্ন: ১৫টি বহুচয়নমূলক প্রশ্ন (MCQ)।\nপূর্ণমান: ৩০ নম্বর (প্রতিটি প্রশ্নের মান ২ করে)।\nপাস নম্বর: ২৫ নম্বর (২৫ বা তার বেশি পেলে আপনি পাস করবেন এবং সার্টিফিকেট পাবেন)।\nসময়সীমা: পুরো পরীক্ষার জন্য মোট ১৫ মিনিট সময় নির্ধারণ করা হয়েছে।\nশুরু ও শেষ: Start Skill Test বাটনে ক্লিক করার সাথে সাথেই স্ক্রিনের ওপরের দিকে কাউন্টডাউন টাইমার শুরু হয়ে যাবে।\nসাবমিশন নিয়ম: আপনি নিজের ইচ্ছায় Submit বাটন প্রেস করে খাতা জমা দিতে পারবেন। তবে নির্ধারিত ১৫ মিনিট পার হয়ে গেলে পরীক্ষা সাথে সাথে অটোমেটিক ক্লোজ হয়ে যাবে এবং আর সাবমিট করার সুযোগ থাকবে না।\nফলাফল ও রিপোর্ট: পরীক্ষা জমা দেওয়ার পর তাৎক্ষণিকভাবে কোনো স্কোর বা ফলাফল স্ক্রিনে দেখা যাবে না। পরীক্ষা সম্পন্ন হওয়ার পর আপনার ড্যাশবোর্ডের Exam Report অপশনে প্রবেশ করে আপনার সম্পূর্ণ পরীক্ষার বিস্তারিত ফলাফল ও রিপোর্ট দেখতে হবে।\n\nঠান্ডা মাথায় নিজের প্রস্তুতি যাচাই করুন।\nআপনি প্রস্তুত থাকলে নিচের বাটনে ক্লিক করে পরীক্ষা শুরু করুন!",
    startLabel: "Start Skill Test",
    startLabelBn: "Start Skill Test",
    passMark: 25,
    totalMarks: 30,
    timeLimitMinutes: 15,
    requiresPreviousStep: true,
    questions: [
      { q: "A user types a command with the keyboard and sees the result on screen. Which sequence best describes this process?", qBn: "একজন ব্যবহারকারী কিবোর্ডে কমান্ড লিখে স্ক্রিনে ফলাফল দেখেন। এই প্রক্রিয়াটি কোন ক্রমে ঘটে?", opts: ["Output → input → process", "Input → process → output", "Process → output → input", "Storage → output → input"], optsBn: ["আউটপুট → ইনপুট → প্রসেস", "ইনপুট → প্রসেস → আউটপুট", "প্রসেস → আউটপুট → ইনপুট", "স্টোরেজ → আউটপুট → ইনপুট"], answer: 1, explain: "The keyboard provides input, the CPU processes it, and the monitor shows the output.", explainBn: "কিবোর্ড ইনপুট দেয়, CPU তা প্রসেস করে এবং মনিটর আউটপুট দেখায়।" },
      { q: "Why should you use Windows Shut down instead of switching off power directly?", qBn: "সরাসরি পাওয়ার বন্ধ না করে Windows Shut down ব্যবহার করা উচিত কেন?", opts: ["It increases RAM permanently", "It safely closes active system files", "It changes the monitor into a keyboard", "It deletes the Recycle Bin"], optsBn: ["এটি RAM স্থায়ীভাবে বাড়ায়", "এটি চলমান সিস্টেম ফাইল নিরাপদে বন্ধ করে", "এটি মনিটরকে কিবোর্ডে বদলে দেয়", "এটি Recycle Bin মুছে দেয়"], answer: 1, explain: "A proper shutdown lets the operating system close active files safely.", explainBn: "সঠিকভাবে shutdown করলে অপারেটিং সিস্টেম চলমান ফাইল নিরাপদে বন্ধ করতে পারে।" },
      { q: "Which device is primarily responsible for displaying the result after processing?", qBn: "প্রসেসিংয়ের পর ফলাফল দেখানোর প্রধান দায়িত্ব কোন যন্ত্রের?", opts: ["Mouse", "Keyboard", "Monitor", "CPU casing"], optsBn: ["মাউস", "কিবোর্ড", "মনিটর", "CPU casing"], answer: 2, explain: "The monitor is the visual output device.", explainBn: "মনিটর হলো ভিজ্যুয়াল output device।" },
      { q: "A student wants to create a duplicate of a file while keeping the original. Which shortcut sequence is appropriate?", qBn: "মূল ফাইল রেখে তার একটি duplicate তৈরি করতে কোন shortcut sequence ব্যবহার করা যায়?", opts: ["Ctrl + C, then Ctrl + V", "Ctrl + Z, then Ctrl + F", "Ctrl + A, then Ctrl + P", "Alt + Tab, then Ctrl + S"], optsBn: ["Ctrl + C, তারপর Ctrl + V", "Ctrl + Z, তারপর Ctrl + F", "Ctrl + A, তারপর Ctrl + P", "Alt + Tab, তারপর Ctrl + S"], answer: 0, explain: "Copy followed by paste keeps the original and creates a duplicate.", explainBn: "Copy করে Paste করলে মূল ফাইল থাকে এবং একটি duplicate তৈরি হয়।" },
      { q: "Which shortcut reverses the most recent change in a document?", qBn: "ডকুমেন্টের সর্বশেষ পরিবর্তন বাতিল করতে কোন shortcut ব্যবহার করা হয়?", opts: ["Ctrl + S", "Ctrl + Z", "Ctrl + F", "Ctrl + P"], optsBn: ["Ctrl + S", "Ctrl + Z", "Ctrl + F", "Ctrl + P"], answer: 1, explain: "Ctrl + Z performs Undo.", explainBn: "Ctrl + Z Undo করে, অর্থাৎ সর্বশেষ পরিবর্তন বাতিল করে।" },
      { q: "Which shortcut is most useful for locating a word inside a long document?", qBn: "দীর্ঘ ডকুমেন্টের ভেতরে কোনো শব্দ খুঁজতে কোন shortcut সবচেয়ে কার্যকর?", opts: ["Ctrl + F", "Ctrl + X", "Ctrl + D", "Alt + Tab"], optsBn: ["Ctrl + F", "Ctrl + X", "Ctrl + D", "Alt + Tab"], answer: 0, explain: "Ctrl + F opens the Find function.", explainBn: "Ctrl + F Find function চালু করে।" },
      { q: "What is the safest way to remove an unwanted file that you may need to restore later?", qBn: "পরে Restore করার প্রয়োজন হতে পারে এমন ফাইল মুছে ফেলার নিরাপদ পদ্ধতি কোনটি?", opts: ["Select it and press Delete", "Pull the power cable", "Delete the entire drive", "Format the computer"], optsBn: ["ফাইল সিলেক্ট করে Delete চাপা", "পাওয়ার কেবল টেনে খোলা", "পুরো drive delete করা", "কম্পিউটার format করা"], answer: 0, explain: "Delete usually sends the file to Recycle Bin first.", explainBn: "Delete করলে ফাইল সাধারণত আগে Recycle Bin-এ যায়।" },
      { q: "What happens when you press F2 after selecting a file?", qBn: "কোনো ফাইল সিলেক্ট করে F2 চাপলে কী হয়?", opts: ["It prints the file", "It renames the file", "It opens Task Manager", "It shuts down Windows"], optsBn: ["ফাইলটি print হয়", "ফাইলটির নাম বদলানোর সুযোগ আসে", "Task Manager খোলে", "Windows বন্ধ হয়"], answer: 1, explain: "F2 starts rename mode for the selected file or folder.", explainBn: "F2 নির্বাচিত ফাইল বা ফোল্ডারের Rename mode চালু করে।" },
      { q: "Which Windows area gives access to Start and shows currently running applications?", qBn: "কোন Windows অংশে Start-এর access এবং চলমান application দেখা যায়?", opts: ["Taskbar", "Recycle Bin", "Address bar", "CPU casing"], optsBn: ["Taskbar", "Recycle Bin", "Address bar", "CPU casing"], answer: 0, explain: "The taskbar contains Start access and running application controls.", explainBn: "Taskbar-এ Start access এবং চলমান application-এর control থাকে।" },
      { q: "Which component temporarily holds active programs and loses its data when power is removed?", qBn: "কোন component চলমান program সাময়িকভাবে ধরে রাখে এবং power বন্ধ হলে data হারায়?", opts: ["SSD", "RAM", "Monitor", "Keyboard"], optsBn: ["SSD", "RAM", "মনিটর", "কিবোর্ড"], answer: 1, explain: "RAM is temporary volatile memory.", explainBn: "RAM হলো temporary volatile memory, তাই power বন্ধ হলে data থাকে না।" },
      { q: "Which statement correctly compares an SSD or hard disk with RAM?", qBn: "SSD বা hard disk এবং RAM সম্পর্কে কোন বক্তব্যটি সঠিক?", opts: ["Both lose all data when power is off", "RAM stores long-term files while SSD only displays output", "SSD stores data long term while RAM supports active work", "RAM is an external input device"], optsBn: ["দুটিই power বন্ধ হলে সব data হারায়", "RAM long-term file রাখে, SSD শুধু output দেখায়", "SSD দীর্ঘমেয়াদে data রাখে, RAM চলমান কাজে সহায়তা করে", "RAM একটি external input device"], answer: 2, explain: "Storage keeps data long term; RAM supports currently running work.", explainBn: "Storage দীর্ঘমেয়াদে data রাখে, RAM বর্তমানে চলমান কাজে সহায়তা করে।" },
      { q: "A PC becomes unresponsive. Which first step matches the lesson guidance?", qBn: "PC respond না করলে lesson অনুযায়ী প্রথমে কোন পদক্ষেপটি নেওয়া উচিত?", opts: ["Immediately pull the power plug", "Open Task Manager with Ctrl + Shift + Esc", "Delete Windows", "Share your password"], optsBn: ["সঙ্গে সঙ্গে power plug খোলা", "Ctrl + Shift + Esc দিয়ে Task Manager খোলা", "Windows delete করা", "পাসওয়ার্ড share করা"], answer: 1, explain: "Task Manager can help close a frozen application safely.", explainBn: "Task Manager দিয়ে আটকে থাকা application নিরাপদে বন্ধ করা যায়।" },
      { q: "What is the difference between a browser and a search engine?", qBn: "Browser এবং search engine-এর মধ্যে পার্থক্য কী?", opts: ["A browser opens websites; a search engine finds information", "A browser stores RAM; a search engine is hardware", "Both are physical computer parts", "A search engine shuts down the PC"], optsBn: ["Browser website খোলে; search engine information খুঁজে দেয়", "Browser RAM রাখে; search engine hardware", "দুটিই physical computer part", "Search engine PC shutdown করে"], answer: 0, explain: "Chrome or Edge is a browser; Google is a search engine.", explainBn: "Chrome বা Edge browser, আর Google search engine।" },
      { q: "Which action is safest when you receive an unexpected suspicious link?", qBn: "অপ্রত্যাশিত সন্দেহজনক link পেলে সবচেয়ে নিরাপদ কাজ কোনটি?", opts: ["Click immediately", "Verify it before opening", "Download every attachment", "Save your password in it"], optsBn: ["সঙ্গে সঙ্গে click করা", "খোলার আগে যাচাই করা", "সব attachment download করা", "সেখানে password save করা"], answer: 1, explain: "Suspicious links should be verified before clicking.", explainBn: "সন্দেহজনক link click করার আগে যাচাই করতে হয়।" },
      { q: "Why should personal passwords not be saved on a public computer?", qBn: "Public computer-এ ব্যক্তিগত password save করা উচিত নয় কেন?", opts: ["Someone else may access the account", "It improves Wi-Fi too much", "It deletes the monitor", "It changes the URL"], optsBn: ["অন্য কেউ account access করতে পারে", "এতে Wi-Fi অতিরিক্ত দ্রুত হয়", "এতে monitor মুছে যায়", "এতে URL বদলে যায়"], answer: 0, explain: "Other users may access saved personal credentials.", explainBn: "অন্য ব্যবহারকারী saved credential ব্যবহার করে account access করতে পারে।" },
    ],
  },
});

// Keep the course identity and metadata, but start every track with an empty 30-step syllabus.
export const courses: Course[] = courseSeed.map((course) => ({
  ...course,
  chapters: course.id === "c1" ? createNetworkingMasterclassChapters(course.id) : Array.from({ length: 30 }, (_, index) => createEmptyChapter(course.id, index)),
  finalExam: undefined,
}));

const zeroToProCourse: Course = {
  id: "c5",
  title: "Computer & Internet Zero to Pro",
  titleBn: "কম্পিউটার ও ইন্টারনেট জিরো টু প্রো",
  tagline: "Build your computer and internet skills from the ground up.",
  taglineBn: "শূন্য থেকে কম্পিউটার ও ইন্টারনেট দক্ষতার শক্ত ভিত গড়ে তোলো।",
  icon: "cpu",
  hue: "from-emerald-500/30 to-cyan-600/20",
  chapters: Array.from({ length: 6 }, (_, index) => index < 5 ? createZeroToProLesson("c5", index) : createExamChapter("c5")),
};

courses.unshift(zeroToProCourse);

export const getCourse = (id: string) => courses.find((c) => c.id === id);
export const getChapter = (courseId: string, chapterId: string) =>
  getCourse(courseId)?.chapters.find((ch) => ch.id === chapterId);

export const allChapters = courses.flatMap((c) =>
  c.chapters.map((ch) => ({ course: c, chapter: ch }))
);

export const LEVELS = [
  { xp: 0, i: 0 },
  { xp: 150, i: 1 },
  { xp: 400, i: 2 },
  { xp: 800, i: 3 },
  { xp: 1400, i: 4 },
  { xp: 2200, i: 5 },
];

export function levelFor(xp: number) {
  let idx = 0;
  LEVELS.forEach((l, i) => {
    if (xp >= l.xp) idx = i;
  });
  const cur = LEVELS[idx];
  const next = LEVELS[idx + 1];
  const pct = next ? Math.round(((xp - cur.xp) / (next.xp - cur.xp)) * 100) : 100;
  return { index: idx, nextXp: next ? next.xp : null, pct, curXp: cur.xp };
}
