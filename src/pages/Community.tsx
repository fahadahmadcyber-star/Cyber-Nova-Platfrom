import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MessageSquareText,
  Users,
  Search,
  Send,
  Paperclip,
  Image as ImageIcon,
  Code2,
  Wifi,
  WifiOff,
  Plus,
  X,
  UserRound,
  Video,
  ShieldCheck,
  Check,
} from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import { useStore, type User } from "../store";

interface CommunityUser extends User {
  id: string;
  status?: "online" | "offline";
  courseIds?: string[];
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  text?: string;
  imageUrl?: string;
  fileUrl?: string;
  fileName?: string;
  code?: string;
  createdAt?: any;
  type?: "text" | "image" | "file" | "code";
}

interface ChatRoom {
  id: string;
  type: "direct" | "course" | "group";
  name: string;
  participantIds: string[];
  courseId?: string;
  createdBy?: string;
  createdAt?: any;
  updatedAt?: any;
}

const formatTime = (ts: any) => {
  if (!ts) return "now";
  const d = ts?.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const isDateObj = (value: any) => !!value && typeof value.toDate === "function";

const sortByNewest = (list: any[]) =>
  [...list].sort((a, b) => {
    const aTime = isDateObj(a.createdAt) ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
    const bTime = isDateObj(b.createdAt) ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
    return bTime - aTime;
  });

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const createRoomId = (a: string, b: string) => [a, b].sort().join("::");

const defaultAvatar = "https://ui-avatars.com/api/?name=Student&background=0b1325&color=facc15";

const getUserKey = (value?: string | null, fallback?: string | null) => {
  if (value && value.trim()) return value.trim();
  return fallback || "guest";
};

export const Community: React.FC = () => {
  const { user, curriculum, isBn, nav } = useStore();
  const [directory, setDirectory] = useState<CommunityUser[]>([]);
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string>("");
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [groupName, setGroupName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<CommunityUser | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const currentUser = user;
  const currentUserId = getUserKey(currentUser?.uid, currentUser?.email);

  useEffect(() => {
    if (!user) {
      nav({ view: "home" });
      return;
    }

    const usersRef = collection(db, "users");
    const unsub = onSnapshot(usersRef, (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Record<string, any>;
        const uid = getUserKey(data.uid || docSnap.id, data.email);
        return {
          id: docSnap.id,
          uid,
          ...data,
          name: data.displayName || data.name || data.email || "Student",
          email: data.email || "",
        } as CommunityUser;
      });
      setDirectory(list.filter((entry) => getUserKey(entry.uid, entry.email) !== currentUserId));
    });

    return () => unsub();
  }, [currentUserId, nav, user]);

  useEffect(() => {
    if (!user) return;
    const roomsRef = collection(db, "community_rooms");
    const unsub = onSnapshot(roomsRef, (snapshot) => {
      const arr = snapshot.docs
        .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() } as ChatRoom))
        .filter((room) => room.participantIds?.some((participant) => participant === currentUserId || participant === currentUser?.email))
        .sort((a, b) => {
          const at = isDateObj(a.updatedAt) ? a.updatedAt.toDate().getTime() : 0;
          const bt = isDateObj(b.updatedAt) ? b.updatedAt.toDate().getTime() : 0;
          return bt - at;
        });
      setRooms(arr);
      if (!arr.length) {
        setActiveRoomId("");
        setActiveRoom(null);
      } else if (!activeRoomId || !arr.find((room) => room.id === activeRoomId)) {
        setActiveRoomId(arr[0].id);
      }
    });

    return () => unsub();
  }, [currentUserId, user]);

  useEffect(() => {
    if (!activeRoomId) {
      setMessages([]);
      setActiveRoom(null);
      return;
    }

    const roomRef = doc(db, "community_rooms", activeRoomId);
    const unsubRoom = onSnapshot(roomRef, async (snap) => {
      if (!snap.exists()) return;
      const room = { id: snap.id, ...snap.data() } as ChatRoom;
      setActiveRoom(room);

      const msgRef = collection(db, "community_rooms", activeRoomId, "messages");
      const q = query(msgRef, orderBy("createdAt", "asc"));
      const unsubMessages = onSnapshot(q, (msgSnap) => {
        const next = msgSnap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatMessage[];
        setMessages(next);
      });

      return () => unsubMessages();
    });

    return () => unsubRoom();
  }, [activeRoomId]);

  useEffect(() => {
    if (!user || !directory.length) return;

    const ensureDirectRooms = async () => {
      const roomIds = new Set<string>();
      const rows = directory.filter((peer) => getUserKey(peer.uid, peer.email) !== currentUserId);
      for (const peer of rows) {
        const peerId = getUserKey(peer.uid, peer.email || peer.id);
        const roomId = createRoomId(currentUserId, peerId);
        roomIds.add(roomId);
      }

      const roomSnap = await getDocs(collection(db, "community_rooms"));
      const existing = new Set(roomSnap.docs.map((docSnap) => docSnap.id));
      const batch = writeBatch(db);
      let hasMutations = false;
      for (const roomId of roomIds) {
        if (!existing.has(roomId)) {
          const [a, b] = roomId.split("::");
          const participants = [a, b].filter(Boolean);
          const roomRef = doc(db, "community_rooms", roomId);
          batch.set(roomRef, {
            id: roomId,
            type: "direct",
            name: "Direct Message",
            participantIds: participants,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
          hasMutations = true;
        }
      }
      if (hasMutations) await batch.commit();
    };

    void ensureDirectRooms();
  }, [currentUser?.email, currentUserId, directory, user]);

  useEffect(() => {
    if (!user || !curriculum.length) return;

    const ensureCourseRooms = async () => {
      const courseIds = user.enrolledCourses || [];
      const batch = writeBatch(db);
      const roomSnap = await getDocs(collection(db, "community_rooms"));
      const existing = new Set(roomSnap.docs.map((d) => d.id));
      let hasMutations = false;

      for (const courseId of courseIds) {
        const roomId = `course:${courseId}`;
        if (existing.has(roomId)) continue;
        const course = curriculum.find((item) => item.id === courseId);
        const roomRef = doc(db, "community_rooms", roomId);
        batch.set(roomRef, {
          id: roomId,
          type: "course",
          name: course?.titleBn || course?.title || "Course Community",
          participantIds: [currentUserId],
          courseId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        hasMutations = true;
      }
      if (hasMutations) await batch.commit();
    };

    void ensureCourseRooms();
  }, [curriculum, currentUserId, user]);

  const visibleStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    return directory.filter((entry) => {
      const pattern = `${entry.name || ""} ${entry.email || ""}`.toLowerCase();
      return !term || pattern.includes(term);
    });
  }, [directory, search]);

  const roomPeers = useMemo(() => {
    if (!activeRoom) return [] as CommunityUser[];
    return directory.filter((entry) => {
      const itemKey = getUserKey(entry.uid, entry.email || entry.id);
      return activeRoom.participantIds.some((pid) => pid === itemKey || pid === entry.email || pid === entry.id);
    });
  }, [activeRoom, directory]);

  const lovelyTitle = activeRoom?.type === "direct"
    ? roomPeers[0]?.name || "Direct Message"
    : activeRoom?.name || "Community";

  const buildRoom = async (peerId: string) => {
    const roomId = createRoomId(currentUserId, peerId);
    const roomRef = doc(db, "community_rooms", roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) {
      await setDoc(roomRef, {
        id: roomId,
        type: "direct",
        name: "Direct Message",
        participantIds: [currentUserId, peerId],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }
    setActiveRoomId(roomId);
  };

  const sendMessage = async () => {
    if (!activeRoomId || (!newMessage.trim() && !isComposerOpen)) return;

    const messageText = newMessage.trim();
    const msgRef = collection(db, "community_rooms", activeRoomId, "messages");
    const payload: Partial<ChatMessage> = {
      roomId: activeRoomId,
      senderId: currentUserId,
      senderName: currentUser?.name || "You",
      createdAt: serverTimestamp(),
      type: "text",
    };

    if (messageText) payload.text = messageText;
    if (isComposerOpen) payload.type = "code";
    if (isComposerOpen && !messageText) return;

    await addDoc(msgRef, payload);
    await updateDoc(doc(db, "community_rooms", activeRoomId), { updatedAt: serverTimestamp() });
    setNewMessage("");
    setIsComposerOpen(false);
  };

  const attachFile = async (kind: "image" | "file") => {
    const input = kind === "image" ? imageInputRef.current : fileInputRef.current;
    if (!input) return;
    input.onchange = async (event: any) => {
      const file = event.target.files?.[0];
      if (!file || !activeRoomId) return;
      setUploading(true);
      try {
        const storagePath = `community/${activeRoomId}/${Date.now()}-${file.name}`;
        const uploadRef = ref(storage, storagePath);
        const snapshot = await uploadBytes(uploadRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);

        const fileInfo = {
          id: `${Date.now()}-${file.name}`,
          roomId: activeRoomId,
          senderId: currentUserId,
          senderName: currentUser?.name || "You",
          createdAt: serverTimestamp(),
          type: kind,
          fileName: file.name,
          imageUrl: kind === "image" ? downloadUrl : undefined,
          fileUrl: kind === "file" ? downloadUrl : undefined,
        };
        await addDoc(collection(db, "community_rooms", activeRoomId, "messages"), fileInfo);
        await updateDoc(doc(db, "community_rooms", activeRoomId), { updatedAt: serverTimestamp() });
      } finally {
        setUploading(false);
        input.value = "";
      }
    };
    input.click();
  };

  const createStudyGroup = async () => {
    if (!selectedMembers.length || !groupName.trim()) return;
    const roomId = `group:${slug(groupName)}:${Date.now()}`;
    const members = Array.from(new Set([currentUserId, ...selectedMembers]));
    await setDoc(doc(db, "community_rooms", roomId), {
      id: roomId,
      type: "group",
      name: groupName.trim(),
      participantIds: members,
      createdBy: currentUserId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    setSelectedMembers([]);
    setGroupName("");
    setActiveRoomId(roomId);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-4 text-slate-100">
      <div className="mx-auto grid max-w-[1600px] gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="rounded-[26px] border border-white/10 bg-slate-900/80 p-3 shadow-[0_25px_60px_rgba(15,23,42,0.7)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.35em] text-cyan-300">Community</div>
              <h2 className="mt-1 text-xl font-black">{isBn ? "কমিউনিটি" : "Community"}</h2>
            </div>
            <button
              onClick={() => setIsComposerOpen((v) => !v)}
              className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 p-2 text-cyan-200 cursor-pointer"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="mb-4 flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-500"
              placeholder={isBn ? "স্টুডেন্ট খুঁজুন" : "Search students"}
            />
          </div>

          <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950/40 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{isBn ? "সব স্টুডেন্ট" : "All Students"}</div>
              <span className="text-[10px] text-cyan-300">{visibleStudents.length}</span>
            </div>
            <div className="space-y-2">
              {visibleStudents.map((entry) => {
                const online = entry.online !== false;
                return (
                  <button
                    key={entry.id || entry.email}
                    onClick={() => setSelectedProfile(entry)}
                    className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/3 px-2.5 py-2 text-left transition hover:bg-white/5 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative">
                        <img src={entry.avatarUrl || defaultAvatar} alt={entry.name} className="h-9 w-9 rounded-full object-cover" />
                        <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-900 ${online ? "bg-emerald-400" : "bg-slate-500"}`} />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-100">{entry.name || entry.email}</div>
                        <div className="text-[10px] text-slate-400">{online ? (isBn ? "অনলাইন" : "Online") : (isBn ? "অফলাইনে" : "Offline")}</div>
                      </div>
                    </div>
                    <MessageSquareText size={14} className="text-cyan-300" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mb-5">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{isBn ? "চ্যাট রুম" : "Chats"}</div>
            <div className="space-y-2">
              {rooms.map((room) => {
                const lastPeer = room.type === "direct"
                  ? directory.find((entry) => room.participantIds.includes(entry.email || entry.id))
                  : null;
                const isActive = room.id === activeRoomId;
                return (
                  <button
                    key={room.id}
                    onClick={() => setActiveRoomId(room.id)}
                    className={`flex w-full items-center justify-between gap-2 rounded-xl border px-2.5 py-2.5 text-left transition cursor-pointer ${
                      isActive ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/8 bg-white/3 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200">
                        {room.type === "group" ? <Users size={16} /> : <UserRound size={16} />}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold text-slate-100">
                          {room.type === "direct" ? (lastPeer?.name || "Direct") : room.name}
                        </div>
                        <div className="text-[10px] text-slate-400">{room.type === "course" ? "Course room" : room.type === "group" ? "Study group" : "Direct chat"}</div>
                      </div>
                    </div>
                    <div className="shrink-0 text-[9px] text-slate-500">{room.type === "direct" ? (lastPeer?.online !== false ? "Live" : "Away") : "Room"}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/40 p-3">
            <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{isBn ? "স্টাডি গ্রুপ" : "Study Groups"}</div>
            <div className="space-y-2">
              {rooms.filter((r) => r.type === "group").map((room) => (
                <button
                  key={room.id}
                  onClick={() => setActiveRoomId(room.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/8 bg-white/3 px-2.5 py-2 text-left cursor-pointer hover:bg-white/5"
                >
                  <span className="text-sm font-semibold text-slate-100">{room.name}</span>
                  <Users size={14} className="text-violet-300" />
                </button>
              ))}
              <div className="pt-2">
                <input
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-3 py-2 text-xs outline-none focus:border-cyan-400/40"
                  placeholder={isBn ? "গ্রুপ নাম" : "Group name"}
                />
                <div className="mt-2 max-h-28 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/60 p-2">
                  {directory.map((entry) => {
                    const checked = selectedMembers.includes(entry.email);
                    return (
                      <label key={entry.id || entry.email} className="mb-1 flex items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-xs text-slate-200">
                        <span>{entry.name || entry.email}</span>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setSelectedMembers((prev) => checked ? prev.filter((m) => m !== entry.email) : [...prev, entry.email])}
                        />
                      </label>
                    );
                  })}
                </div>
                <button
                  onClick={createStudyGroup}
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 px-3 py-2 text-xs font-black text-white cursor-pointer"
                >
                  {isBn ? "গ্রুপ তৈরি" : "Create Group"}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {selectedProfile && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/75 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[26px] border border-white/10 bg-slate-900 p-5 shadow-[0_30px_70px_rgba(15,23,42,0.9)]">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src={selectedProfile.avatarUrl || defaultAvatar} alt={selectedProfile.name} className="h-14 w-14 rounded-full object-cover" />
                  <div>
                    <div className="text-lg font-black text-white">{selectedProfile.name || selectedProfile.email}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-400">{selectedProfile.online !== false ? (isBn ? "অনলাইন" : "Online") : (isBn ? "অফলাইনে" : "Offline")}</div>
                  </div>
                </div>
                <button onClick={() => setSelectedProfile(null)} className="rounded-full border border-white/10 p-2 text-slate-300 cursor-pointer"><X size={15} /></button>
              </div>

              <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 text-sm text-slate-300">
                <div><span className="text-slate-500">Email:</span> {selectedProfile.email}</div>
                <div><span className="text-slate-500">Role:</span> {selectedProfile.role || "user"}</div>
                <div><span className="text-slate-500">Location:</span> {selectedProfile.location || "Not set"}</div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedProfile(null);
                    void buildRoom(selectedProfile.email);
                  }}
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3 text-sm font-black text-slate-950 cursor-pointer"
                >
                  {isBn ? "মেসেজ পাঠান" : "Send Message"}
                </button>
                <button
                  onClick={() => setSelectedProfile(null)}
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-slate-200 cursor-pointer"
                >
                  {isBn ? "বন্ধ" : "Close"}
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="rounded-[26px] border border-white/10 bg-slate-900/80 p-3 shadow-[0_25px_60px_rgba(15,23,42,0.7)]">
          {!activeRoom ? (
            <div className="grid min-h-[620px] place-items-center rounded-[22px] border border-dashed border-white/10 bg-slate-950/40 px-6 text-center">
              <div>
                <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-cyan-500/10 text-cyan-300">
                  <Users size={28} />
                </div>
                <h3 className="text-2xl font-black text-white">{isBn ? "কমিউনিটি শুরু করুন" : "Start community"}</h3>
                <p className="mt-2 max-w-md text-sm text-slate-400">
                  {isBn ? "সরাসরি একজন স্টুডেন্টের সঙ্গে চ্যাট শুরু করুন বা স্টাডি গ্রুপ তৈরি করুন।" : "Start a one-to-one chat or create a study group with classmates."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[620px] flex-col rounded-[22px] border border-white/10 bg-slate-950/50">
              <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-200">
                    {activeRoom.type === "group" ? <Users size={18} /> : <UserRound size={18} />}
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-base font-black text-white">{lovelyTitle}</div>
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-400">
                      {activeRoom.type === "group" ? <ShieldCheck size={12} /> : <Wifi size={12} />}
                      {activeRoom.type === "group" ? (isBn ? "স্টাডি গ্রুপ" : "Study group") : (isBn ? "ডিরেক্ট চ্যাট" : "Direct chat")}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="rounded-xl border border-white/10 bg-white/3 p-2 text-slate-300 cursor-pointer"><Video size={15} /></button>
                </div>
              </header>

              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((msg) => {
                  const mine = msg.senderId === currentUserId;
                  return (
                    <div key={msg.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] rounded-2xl border p-3 ${mine ? "border-cyan-400/30 bg-cyan-400/10" : "border-white/10 bg-slate-900"}`}>
                        {!mine && <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">{msg.senderName}</div>}
                        {msg.type === "code" && msg.code ? (
                          <pre className="overflow-x-auto rounded-xl bg-slate-950/80 p-2 text-[11px] text-cyan-200">{msg.code}</pre>
                        ) : msg.type === "image" && msg.imageUrl ? (
                          <img src={msg.imageUrl} alt={msg.fileName || "shared image"} className="max-h-64 rounded-xl object-contain" />
                        ) : msg.type === "file" && msg.fileUrl ? (
                          <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cyan-200">
                            {msg.fileName || "Attachment"}
                          </a>
                        ) : (
                          <div className="text-sm leading-relaxed text-slate-100">{msg.text}</div>
                        )}
                        <div className="mt-2 text-[9px] uppercase tracking-[0.15em] text-slate-500">{formatTime(msg.createdAt)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/10 bg-slate-950/60 p-3">
                {isComposerOpen && (
                  <div className="mb-3 rounded-2xl border border-cyan-400/20 bg-cyan-500/5 p-2">
                    <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200">
                      <Code2 size={12} /> {isBn ? "কোড স্নিপেট" : "Code Snippet"}
                    </div>
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                      className="w-full resize-none rounded-xl border border-white/10 bg-slate-900/80 p-3 text-sm outline-none focus:border-cyan-400/40"
                      placeholder={isBn ? "কোড লিখুন..." : "Write code..."}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-2">
                  <button onClick={() => attachFile("image")} className="rounded-xl border border-white/10 bg-white/5 p-2 text-cyan-200 cursor-pointer"><ImageIcon size={15} /></button>
                  <button onClick={() => attachFile("file")} className="rounded-xl border border-white/10 bg-white/5 p-2 text-violet-200 cursor-pointer"><Paperclip size={15} /></button>
                  <button
                    onClick={() => setIsComposerOpen((v) => !v)}
                    className="rounded-xl border border-white/10 bg-white/5 p-2 text-amber-200 cursor-pointer"
                  >
                    <Code2 size={15} />
                  </button>
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" />
                  <input ref={fileInputRef} type="file" className="hidden" />
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-slate-500"
                    placeholder={isBn ? "বার্তা লিখুন..." : "Type a message..."}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={uploading || (!newMessage.trim() && !isComposerOpen)}
                    className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-3 py-2 text-sm font-black text-slate-950 disabled:opacity-50 cursor-pointer"
                  >
                    <Send size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
