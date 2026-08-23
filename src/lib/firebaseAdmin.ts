import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import { auth } from "../firebase";
import type { User } from "../store";

/**
 *  CYBER NOVA — FIREBASE ADMIN BACKEND SERVICE
 * Real-time database connection for the Admin Panel.
 * All admin features (users, messages, stats, settings) sync with Firebase Firestore.
 */

// Initialize Firestore
const db: Firestore = getFirestore();

export { db };

/* ==================== USERS COLLECTION ==================== */
export interface FirestoreUser {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: "user" | "admin";
  createdAt: any;
  lastLogin?: any;
  xp?: number;
  level?: number;
  status?: "active" | "disabled";
}

/** Save or update a user in Firestore */
export async function saveUserToFirestore(user: User & { id: string }, xp = 0, level = 0) {
  const userRef = doc(db, "users", user.id);
  const data: FirestoreUser = {
    id: user.id,
    email: user.email,
    displayName: user.name,
    photoURL: user.avatarUrl || undefined,
    role: user.role || "user",
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
    xp,
    level,
    status: "active",
  };
  await setDoc(userRef, data, { merge: true });
}

/** Get all users (for admin panel table) */
export async function getAllUsers(): Promise<FirestoreUser[]> {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"), limit(100));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as FirestoreUser);
}

/** Read one application profile so login can honor the disabled status. */
export async function getUserProfile(userId: string): Promise<FirestoreUser | null> {
  const snapshot = await getDoc(doc(db, "users", userId));
  return snapshot.exists() ? snapshot.data() as FirestoreUser : null;
}

/** Subscribe to real-time user updates */
export function subscribeToUsers(callback: (users: FirestoreUser[]) => void): Unsubscribe {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snapshot) => {
    const users = snapshot.docs.map((doc) => doc.data() as FirestoreUser);
    callback(users);
  });
}

/** Update user role */
export async function updateUserRole(userId: string, role: "user" | "admin") {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { role });
}

/** Disable or re-enable a user in the application layer. */
export async function updateUserStatus(userId: string, status: "active" | "disabled") {
  await updateDoc(doc(db, "users", userId), { status });
}

/** Delete a user */
export async function deleteUser(userId: string) {
  const userRef = doc(db, "users", userId);
  await deleteDoc(userRef);
}

/* ==================== SUPPORT MESSAGES COLLECTION ==================== */
export interface SupportMessage {
  id: string;
  fromEmail: string;
  fromName: string;
  subject: string;
  message: string;
  status: "open" | "answered" | "archived";
  createdAt: any;
  repliedAt?: any;
  reply?: string;
}

/** Save a support message from Nova Help */
export async function saveSupportMessage(data: Omit<SupportMessage, "id" | "createdAt" | "status">) {
  const messagesRef = collection(db, "support_messages");
  const newDocRef = doc(messagesRef);
  const messageData: SupportMessage = {
    id: newDocRef.id,
    fromEmail: data.fromEmail,
    fromName: data.fromName,
    subject: data.subject || "Nova Help Message",
    message: data.message,
    status: "open",
    createdAt: serverTimestamp(),
  };
  await setDoc(newDocRef, messageData);
  return newDocRef.id;
}

/** Get all support messages */
export async function getAllSupportMessages(): Promise<SupportMessage[]> {
  const messagesRef = collection(db, "support_messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(100));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as SupportMessage);
}

/** Subscribe to real-time support messages */
export function subscribeToSupportMessages(callback: (messages: SupportMessage[]) => void): Unsubscribe {
  const messagesRef = collection(db, "support_messages");
  const q = query(messagesRef, orderBy("createdAt", "desc"), limit(100));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => doc.data() as SupportMessage);
    callback(messages);
  });
}

/** Reply to a support message */
export async function replyToSupportMessage(messageId: string, reply: string) {
  const messageRef = doc(db, "support_messages", messageId);
  await updateDoc(messageRef, {
    reply,
    repliedAt: serverTimestamp(),
    status: "answered",
  });
}

/** Archive a message */
export async function archiveSupportMessage(messageId: string) {
  const messageRef = doc(db, "support_messages", messageId);
  await updateDoc(messageRef, { status: "archived" });
}

/* ==================== PLATFORM STATS COLLECTION ==================== */
export interface PlatformStats {
  totalUsers: number;
  totalCourses: number;
  totalQuizzes: number;
  activeUsers: number;
  lastUpdated: any;
}

/** Get platform stats */
export async function getPlatformStats(): Promise<PlatformStats | null> {
  const statsRef = doc(db, "platform", "stats");
  const snap = await getDoc(statsRef);
  if (snap.exists()) {
    return snap.data() as PlatformStats;
  }
  return null;
}

/** Update platform stats */
export async function updatePlatformStats(stats: Partial<PlatformStats>) {
  const statsRef = doc(db, "platform", "stats");
  await setDoc(statsRef, { ...stats, lastUpdated: serverTimestamp() }, { merge: true });
}

/* ==================== ADMIN SETTINGS COLLECTION ==================== */
export interface AdminSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowSignups: boolean;
  minPasswordLength: number;
  announcement?: string;
  announcementBn?: string;
}

/** Get admin settings */
export async function getAdminSettings(): Promise<AdminSettings | null> {
  const settingsRef = doc(db, "admin", "settings");
  const snap = await getDoc(settingsRef);
  if (snap.exists()) {
    return snap.data() as AdminSettings;
  }
  // Default settings
  const defaults: AdminSettings = {
    siteName: "Cyber Nova",
    maintenanceMode: false,
    allowSignups: true,
    minPasswordLength: 6,
  };
  await setDoc(settingsRef, defaults);
  return defaults;
}

/** Update admin settings */
export async function updateAdminSettings(settings: Partial<AdminSettings>) {
  const settingsRef = doc(db, "admin", "settings");
  await setDoc(settingsRef, settings, { merge: true });
}

/* ==================== COURSE PROGRESS COLLECTION ==================== */
export interface CourseProgress {
  userId: string;
  courseId: string;
  completedChapters: string[];
  quizScores: Record<string, number>;
  xp: number;
  lastActive: any;
}

/** Save course progress */
export async function saveCourseProgress(progress: CourseProgress) {
  const progressRef = doc(db, "progress", progress.userId);
  await setDoc(progressRef, { ...progress, lastActive: serverTimestamp() }, { merge: true });
}

/** Get all course progress */
export async function getAllCourseProgress(): Promise<CourseProgress[]> {
  const progressRef = collection(db, "progress");
  const snapshot = await getDocs(progressRef);
  return snapshot.docs.map((doc) => doc.data() as CourseProgress);
}

/* ==================== AUTH HELPER ==================== */
/** Check if current user is admin */
export function isAdminUser(): boolean {
  const currentUser = auth.currentUser;
  if (!currentUser) return false;
  return currentUser.email === "fahadahmad.cyber@gmail.com";
}
