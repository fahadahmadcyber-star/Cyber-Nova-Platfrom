import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";

/**
 * 🔥 CYBER NOVA — LIVE FIREBASE CONFIG (HARD-CODED)
 * Exact production credentials copied directly from the owner's
 * Firebase Console → Project Settings → Your apps → Web app.
 *
 * These values are baked into the bundle so the app works instantly
 * on Vercel without any environment variables.
 */
const firebaseConfig = {
  apiKey: "AIzaSyA01ODjfD0hEvffGFuK9tumwZIerbuaOz8",
  authDomain: "cyber-nova-91814.firebaseapp.com",
  projectId: "cyber-nova-91814",
  storageBucket: "cyber-nova-91814.firebasestorage.app",
  messagingSenderId: "222532451314",
  appId: "1:222532451314:web:1e9830b72cf81e90d7096b",
};

import { getFirestore, type Firestore } from "firebase/firestore";

// Guard against double-initialization during hot reloads
const app: FirebaseApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

/** Firebase Auth instance — initialized once and reused everywhere. */
export const auth: Auth = getAuth(app);

/** Firestore instance for real-time data sync across all devices. */
export const db: Firestore = getFirestore(app);

/** Official Firebase Google provider used by the login page popup. */
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/** Bilingual, action-oriented error messages surfaced in the login card. */
export function fbErrorMessage(code: string, bn: boolean, fallback?: string): string {
  const map: Record<string, [string, string]> = {
    "auth/api-key-not-valid": [
      "Firebase API key rejected. Verify the key in Firebase Console → Project Settings.",
      "Firebase API কী প্রত্যাখ্যাত। Firebase Console → Project Settings-এ কী যাচাই করো।",
    ],
    "auth/invalid-api-key": [
      "Firebase API key is invalid.",
      "Firebase API কী ইনভ্যালিড।",
    ],
    "auth/email-already-in-use": [
      "This email is already registered. Please sign in instead.",
      "এই ইমেইলটি ইতিমধ্যে নিবন্ধিত। সাইন ইন করো।",
    ],
    "auth/invalid-email": ["Invalid email address.", "ইমেইল ঠিকানাটি সঠিক নয়।"],
    "auth/weak-password": [
      "Password must be at least 6 characters.",
      "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।",
    ],
    "auth/missing-email": ["Please enter an email.", "ইমেইল লিখো।"],
    "auth/missing-password": ["Please enter a password.", "পাসওয়ার্ড লিখো।"],
    "auth/user-not-found": [
      "No account found with this email. Please sign up first.",
      "এই ইমেইলে কোনো অ্যাকাউন্ট নেই। আগে সাইন আপ করো।",
    ],
    "auth/user-disabled": [
      "This account has been disabled.",
      "এই অ্যাকাউন্টটি নিষ্ক্রিয় করা হয়েছে।",
    ],
    "auth/wrong-password": ["Incorrect password. Try again.", "পাসওয়ার্ড ভুল। আবার চেষ্টা করো।"],
    "auth/invalid-credential": ["Invalid email or password.", "ইমেইল বা পাসওয়ার্ড সঠিক নয়।"],
    "auth/too-many-requests": [
      "Too many attempts. Wait a moment and retry.",
      "অনেকবার চেষ্টা করা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করো।",
    ],
    "auth/network-request-failed": [
      "Network error — check your internet connection.",
      "নেটওয়ার্ক সমস্যা — ইন্টারনেট সংযোগ পরীক্ষা করো।",
    ],
    "auth/operation-not-allowed": [
      "Email/Password sign-in is disabled. Enable it in Firebase Console → Authentication → Sign-in method.",
      "Email/Password সাইন-ইন বন্ধ আছে। Firebase Console → Authentication → Sign-in method-এ চালু করো।",
    ],
    "auth/unauthorized-domain": [
      "This domain is not authorized. Add it in Firebase Console → Authentication → Settings → Authorized domains.",
      "এই ডোমেইনটি অনুমোদিত নয়। Firebase Console → Authorized domains-এ যোগ করো।",
    ],
    "auth/quota-exceeded": [
      "Project quota exceeded. Try again later.",
      "প্রজেক্ট কোটা শেষ। কিছু পরে আবার চেষ্টা করো।",
    ],
    "auth/internal-error": [
      "Firebase internal error. Please retry.",
      "Firebase অভ্যন্তরীণ ত্রুটি। আবার চেষ্টা করো।",
    ],
  };
  const pair = map[code];
  if (pair) return bn ? pair[1] : pair[0];
  // Surface the true underlying message instead of a generic failure.
  if (fallback && fallback.trim()) {
    const clean = fallback.replace(/^Firebase:\s*/i, "").replace(/\s*\(auth\/[^)]+\)\.?$/i, "");
    return clean;
  }
  return bn ? "অথেন্টিকেশন ব্যর্থ হয়েছে। আবার চেষ্টা করো।" : "Authentication failed. Please try again.";
}

export default app;
