import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, X, Send, Bot, Check, Star, Tag, ShoppingCart, ArrowRight, Plus, Trash2, PanelLeft, PanelLeftClose } from "lucide-react";
import imgLogo from "../../assets/logo.png";
import { useAIAssistant, type AIMessage } from "../store/AIAssistantContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

/** Fallback product photos — used when a product's `image` field is empty (same set HomePage uses). */
const FALLBACK_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=600&q=80",
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=600&q=80",
  "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=600&q=80",
  "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=600&q=80",
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=600&q=80",
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=600&q=80",
  "https://images.unsplash.com/photo-1558429773-0d5084b445aa?w=600&q=80",
  "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=600&q=80",
];
/** Hash a string to a stable image index, so the same product always shows the same fallback photo. */
const hashIdx = (s: string, mod: number) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  return Math.abs(h) % mod;
};
const productImageFor = (p: { id: string; image?: string }) =>
  p.image?.trim() || FALLBACK_PRODUCT_IMAGES[hashIdx(p.id, FALLBACK_PRODUCT_IMAGES.length)];

/** Random greeting prompts — neutral, polite "เมต้า"-as-self tone. */
const GREETING_TEASERS = [
  "สวัสดีค่ะ มีอะไรให้เมต้าช่วยไหมคะ",
  "เมต้าช่วยหาสินค้าให้ได้นะคะ",
  "เมต้าสามารถแนะนำสินค้าที่คุณสนใจได้นะคะ",
  "อยากให้เมต้าช่วยอะไรดีคะ",
  "ลองถามเมต้าได้เลยค่ะ",
  "เมต้าช่วยเปรียบเทียบสินค้าให้ได้ค่ะ",
  "วันนี้สนใจอะไรเป็นพิเศษไหมคะ",
  "เมต้าพร้อมตอบคำถามเรื่องสินค้านะคะ",
  "ให้เมต้าช่วยจัดเซตสินค้าได้ไหมคะ",
  "พิมพ์บอกเมต้าได้เลยค่ะว่าต้องการอะไร",
];

export function AIAssistantBubble() {
  const { open, toggle, unreadCount } = useAIAssistant();
  const [teaser, setTeaser] = useState<string | null>(null);

  // Rotate greeting bubbles — show 4s, hide 8-14s, repeat. Pauses while panel is open.
  useEffect(() => {
    if (open) { setTeaser(null); return; }
    let cancelled = false;
    const cycle = () => {
      const showDelay = 4500 + Math.random() * 6000;
      const hideAfter = 4200;
      const showT = setTimeout(() => {
        if (cancelled) return;
        const msg = GREETING_TEASERS[Math.floor(Math.random() * GREETING_TEASERS.length)];
        setTeaser(msg);
        const hideT = setTimeout(() => { if (!cancelled) { setTeaser(null); cycle(); } }, hideAfter);
        timers.push(hideT);
      }, showDelay);
      timers.push(showT);
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    cycle();
    return () => { cancelled = true; timers.forEach(clearTimeout); };
  }, [open]);

  return (
    <AnimatePresence>
      {!open && (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1, transition: { delay: 0.25, type: "spring", stiffness: 360, damping: 28, mass: 0.6 } }}
      exit={{ opacity: 0, scale: 0.4, transition: { duration: 0.2, ease: [0.32, 0.72, 0, 1] } }}
      className="fixed bottom-5 right-5 z-[55] size-[58px] pointer-events-none"
    >
      {/* Greeting bubble — pops in on the LEFT of the AI button with a tail */}
      <AnimatePresence>
        {teaser && (
          <motion.button
            key={teaser}
            onClick={toggle}
            initial={{ opacity: 0, x: 16, y: -4, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
            className={`${font} absolute right-full top-1/2 -translate-y-1/2 mr-3 whitespace-nowrap max-w-[220px] truncate px-3.5 py-2 rounded-2xl bg-white text-[13px] text-gray-800 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.18),0_2px_6px_rgba(0,0,0,0.06)] cursor-pointer pointer-events-auto hover:bg-gray-50 transition-colors`}
            style={{ fontWeight: 500 }}
            aria-label={teaser}
          >
            {teaser}
            {/* Tail pointing to button */}
            <span aria-hidden className="absolute right-[-5px] top-1/2 -translate-y-1/2 size-2.5 bg-white rotate-45 shadow-[2px_-2px_4px_-2px_rgba(0,0,0,0.08)]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Soft halo — uses logo colors (red→orange) */}
      <motion.div
        aria-hidden
        animate={{ opacity: [0.35, 0.6, 0.35], scale: [1, 1.18, 1] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-[-4px] rounded-full blur-xl"
        style={{ background: "radial-gradient(circle, rgba(247,147,29,0.55) 0%, rgba(237,28,36,0) 70%)" }}
      />

      {/* Iridescent edge — multi-color conic, slowly rotating, blurred to a soft rim */}
      <motion.div
        aria-hidden
        animate={{ rotate: 360 }}
        transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-3px] rounded-full opacity-70 blur-[6px]"
        style={{ background: "conic-gradient(from 0deg, #ed1c24, #f7931d, #facc15, #46c474, #38bdf8, #a855f7, #ec4899, #ed1c24)" }}
      />

      {/* Main button — red→orange diagonal (matches METAHERB logo split) */}
      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.04 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        aria-label="เปิด AI Shopping Assistant"
        className="absolute inset-0 rounded-full flex items-center justify-center text-white cursor-pointer overflow-hidden shadow-[0_8px_22px_-6px_rgba(237,28,36,0.5),0_2px_6px_rgba(0,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.22)_inset] pointer-events-auto"
        style={{ background: "linear-gradient(135deg, #ed1c24 0%, #f15a1a 55%, #f7931d 100%)" }}
      >
        {/* Light shimmer — diagonal sweep, rare + subtle */}
        <motion.div
          aria-hidden
          animate={{ x: ["-130%", "130%"] }}
          transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 4.5, ease: "easeInOut" }}
          className="absolute top-0 bottom-0 w-1/2 pointer-events-none opacity-60"
          style={{ background: "linear-gradient(75deg, transparent, rgba(255,255,255,0.35), transparent)" }}
        />

        {/* Sparkles icon — very subtle breathing */}
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
        >
          <Sparkles className="size-[26px] drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" strokeWidth={2} />
        </motion.div>
      </motion.button>

      {unreadCount > 0 && (
        <motion.span
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 18 }}
          className="absolute -top-1 -right-1 min-w-[20px] h-[20px] px-1.5 rounded-full text-[11px] tabular-nums text-white flex items-center justify-center ring-2 ring-white pointer-events-none"
          style={{ background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
          {unreadCount}
        </motion.span>
      )}
    </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Pool of suggestion questions — empty state randomly samples 5 from this list and rotates every few seconds. */
const EMPTY_STATE_CHIPS_POOL = [
  "แนะนำสมุนไพรช่วยนอนหลับ",
  "ลดน้ำหนัก เริ่มจากตัวไหนดี",
  "บำรุงผิวจากธรรมชาติ",
  "เปรียบเทียบสินค้าขายดี",
  "มีโปรอะไรบ้างวันนี้",
  "สมุนไพรลดความเครียด",
  "ขมิ้นชันกับฟ้าทะลายโจรต่างกันยังไง",
  "บำรุงสายตาด้วยอะไรดี",
  "ตัวไหนช่วยระบบขับถ่าย",
  "งบ 300 ซื้ออะไรได้บ้าง",
  "ของขวัญเพื่อสุขภาพให้คุณแม่",
  "สมุนไพรสำหรับวัยทำงาน",
  "ช่วยเสริมภูมิคุ้มกัน",
  "บำรุงตับ ตัวไหนดี",
  "ลดอาการปวดข้อ",
  "ของกินช่วยไมเกรน",
  "สมุนไพรช่วยลดน้ำตาล",
  "บำรุงผมสำหรับคนผมร่วง",
  "ของขายดีที่สุดอาทิตย์นี้",
  "มีสินค้ามาใหม่อะไรบ้าง",
];

export function AIAssistantPanel() {
  const { open, setOpen, messages, typing, send, quickReplyChips,
          sessions, currentSessionId, newChat, loadSession, deleteSession } = useAIAssistant();
  const [text, setText] = useState("");
  // Sidebar visible on desktop by default, hidden on mobile (slide-over)
  const [sidebarOpen, setSidebarOpen] = useState(() => typeof window !== "undefined" && window.innerWidth >= 768);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  // Empty state when conversation has only the initial greeting
  const isEmpty = messages.length <= 1;

  // Scroll to bottom on new message
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  // Lock body scroll while the panel is open — prevents page scrolling underneath
  // when the user scrolls inside the chat.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const onSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const v = text.trim();
    if (!v) return;
    setText("");
    await send(v);
  };

  const onChip = async (chip: string) => { await send(chip); };

  const handleAction = (action: { intent: string; payload?: any }) => {
    if (action.intent.startsWith("nav:")) { navigate(action.intent.slice(4)); setOpen(false); return; }
    send(action.intent);
  };

  return (
    <AnimatePresence>
      {open && (
      <>
      {/* Backdrop — kept OUTSIDE the scaling wrapper so backdrop-filter keeps working
          (backdrop-filter breaks when an ancestor has a CSS transform). */}
      <motion.div
        key="ai-backdrop"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[59] backdrop-blur-[80px] backdrop-saturate-150 bg-white/15"
      />
      <motion.div
        key="ai-panel"
        initial={{ opacity: 0, scale: 0.08 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.08 }}
        transition={{
          scale: { type: "spring", stiffness: 220, damping: 28, mass: 0.9 },
          opacity: { duration: 0.3, ease: [0.32, 0.72, 0, 1] },
        }}
        style={{ transformOrigin: "calc(100% - 49px) calc(100% - 49px)", willChange: "transform, opacity" }}
        className="fixed inset-0 z-[60] flex pointer-events-none">

        {/* ===== Sidebar (history) — animated width without AnimatePresence ===== */}
        <motion.aside
          initial={false}
          animate={{
            width: sidebarOpen ? 316 : 0,
            opacity: sidebarOpen ? 1 : 0,
          }}
          transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
          className="relative z-10 hidden md:flex shrink-0 h-full overflow-hidden p-4 pr-0 pointer-events-auto"
        >
          <motion.div
            initial={false}
            animate={{ x: sidebarOpen ? 0 : -16 }}
            transition={{ duration: 0.36, ease: [0.32, 0.72, 0, 1] }}
            className="w-[300px] flex-1 bg-white rounded-3xl shadow-[0_4px_24px_-8px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden"
          >
            <SidebarBody
              sessions={sessions}
              currentSessionId={currentSessionId}
              newChat={newChat}
              loadSession={loadSession}
              deleteSession={deleteSession}
              onToggle={() => setSidebarOpen(false)}
            />
          </motion.div>
        </motion.aside>

          {/* Mobile sidebar — overlay drawer */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden absolute inset-0 z-30 flex"
              >
                <motion.aside
                  initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="relative w-[80vw] max-w-[300px] bg-white shadow-[12px_0_40px_rgba(0,0,0,0.1)] overflow-hidden"
                >
                  <SidebarBody
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    newChat={newChat}
                    loadSession={(id) => { loadSession(id); setSidebarOpen(false); }}
                    deleteSession={deleteSession}
                    onToggle={() => setSidebarOpen(false)}
                  />
                </motion.aside>
                <div onClick={() => setSidebarOpen(false)} className="flex-1" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* ===== Main area — scroll fills full area; header/composer overlay ===== */}
          <div className="relative z-10 flex-1 min-w-0 overflow-hidden pointer-events-auto">
            {/* Scroll body — covers entire main area; content scrolls under header.
                CSS mask fades content to transparent near top + bottom edges so it dissolves
                under header/composer instead of being hard-cut. */}
            {isEmpty ? (
              <div className="absolute inset-0 overflow-y-auto overscroll-contain pt-[100px] pb-[100px]"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent 0, black 88px, black calc(100% - 88px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 88px, black calc(100% - 88px), transparent 100%)",
                }}>
                <EmptyState onChip={onChip} />
              </div>
            ) : (
              <div ref={scrollRef} className="absolute inset-0 overflow-y-auto overscroll-contain px-3 sm:px-6 pt-[100px] pb-[120px]"
                style={{
                  maskImage: "linear-gradient(to bottom, transparent 0, black 88px, black calc(100% - 88px), transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 88px, black calc(100% - 88px), transparent 100%)",
                }}>
                <div className="max-w-[800px] mx-auto space-y-3">
                  {messages.map((m) => <MessageBubble key={m.id} m={m} onAction={handleAction} onSend={onChip} onNavigate={(p) => { navigate(p); setOpen(false); }} />)}
                  {typing && <ThinkingIndicator />}
                </div>
              </div>
            )}

            {/* Header — absolute overlay; content scrolls behind it */}
            <div className="absolute top-0 left-0 right-0 z-10 px-6 py-5 flex items-start justify-between pointer-events-none">
              <div className="flex items-center gap-3 min-w-0 pointer-events-auto">
                {!sidebarOpen && (
                  <button onClick={() => setSidebarOpen(true)} aria-label="เปิดประวัติแชท"
                    className="size-[36px] rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors active:scale-95 shrink-0">
                    <PanelLeft className="size-[18px]" strokeWidth={2.2} />
                  </button>
                )}
                <div className="min-w-0 leading-tight">
                  <p className={`${font} text-[28px] sm:text-[32px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>เมต้า</p>
                  <p className={`${font} text-[13px] sm:text-[14px] text-gray-500 mt-0.5`}>
                    <span className="inline-block size-1.5 rounded-full bg-[#319754] mr-1.5 animate-pulse" />
                    AI Shopping Assistant
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="ปิด"
                className="size-[36px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors active:scale-95 shrink-0 pointer-events-auto">
                <X className="size-[18px]" strokeWidth={2.4} />
              </button>
            </div>

            {/* Bottom overlay — quick chips + composer; content scrolls behind */}
            <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
              {!isEmpty && !typing && quickReplyChips.length > 0 && (
                <div className="px-3 sm:px-6 pb-1 pointer-events-auto">
                  <div className="max-w-[800px] mx-auto flex gap-2 overflow-x-auto py-1 -mx-1 px-1">
                    {quickReplyChips.map((c, i) => (
                      <motion.button key={c} onClick={() => onChip(c)}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.04 }}
                        whileTap={{ scale: 0.95 }}
                        className={`${font} group shrink-0 text-[13px] px-4 py-2 rounded-full bg-white/80 backdrop-blur-md text-gray-700 hover:text-[#1d5b32] hover:bg-white border border-gray-200/80 hover:border-[#319754]/50 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_-2px_rgba(49,151,84,0.18)] transition-all cursor-pointer whitespace-nowrap`}
                        style={{ fontWeight: 500 }}>
                        <span className="bg-gradient-to-r from-gray-700 to-gray-700 group-hover:from-[#0088ff] group-hover:to-[#9747ff] bg-clip-text group-hover:text-transparent transition-all">{c}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
              <div className="px-3 sm:px-6 pt-1 pb-[max(env(safe-area-inset-bottom),0.75rem)] pointer-events-auto">
                <Composer
                  value={text}
                  onChange={setText}
                  onSubmit={onSubmit}
                  disabled={typing}
                />
              </div>
            </div>
          </div>
      </motion.div>
      </>
      )}
    </AnimatePresence>
  );
}

/** ===== Sidebar body — used in both desktop column + mobile drawer ===== */
function SidebarBody({ sessions, currentSessionId, newChat, loadSession, deleteSession, onToggle }: {
  sessions: import("../store/AIAssistantContext").ChatSession[];
  currentSessionId: string;
  newChat: () => void;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  onToggle: () => void;
}) {
  return (
    <>
      {/* Top bar: toggle (collapse) + new chat */}
      <div className="flex items-center justify-end gap-1 px-3 pt-3 pb-2 shrink-0">
        <button onClick={onToggle} aria-label="ซ่อนประวัติแชท"
          className="size-[36px] rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors active:scale-95">
          <PanelLeftClose className="size-[16px]" strokeWidth={2.2} />
        </button>
        <button onClick={newChat} aria-label="แชทใหม่"
          className="size-[36px] rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-700 transition-colors active:scale-95">
          <Plus className="size-[18px]" strokeWidth={2.4} />
        </button>
      </div>

      {/* Sessions list — only sessions with user messages count as history.
          The active empty session is shown at the top so the user can see what's current. */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-2 pb-3">
        {(() => {
          const withHistory = sessions.filter((s) => s.messages.some((m) => m.role === "user"));
          const activeEmpty = sessions.find((s) => s.id === currentSessionId && !s.messages.some((m) => m.role === "user"));
          const ordered = activeEmpty ? [activeEmpty, ...withHistory] : withHistory;
          if (ordered.length === 0) {
            return <p className={`${font} text-[13px] text-gray-400 px-3 py-6 text-center`}>ยังไม่มีประวัติแชท</p>;
          }
          return ordered.map((s) => {
          const active = s.id === currentSessionId;
          const isEmptyDraft = !s.messages.some((m) => m.role === "user");
          // Day + abbreviated Thai month, e.g. "4 มิ.ย."
          const dateLabel = new Date(s.updatedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short" });
          return (
            <div key={s.id}
              onClick={() => loadSession(s.id)}
              className={`group px-3 py-2.5 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${active ? "bg-[#319754]/8" : "hover:bg-gray-50"}`}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className={`${font} text-[14px] truncate ${active ? "text-[#1d5b32]" : isEmptyDraft ? "text-gray-400 italic" : "text-[#1a1a1a]"}`} style={{ fontWeight: active ? 600 : 500 }}>{isEmptyDraft ? "ยังไม่มีคำถาม" : s.title}</p>
                  <p className={`${font} text-[11px] text-gray-400 mt-0.5`}>{dateLabel}  ·  {Math.max(0, s.messages.filter((m) => m.role === "user").length)} คำถาม</p>
                </div>
                {!isEmptyDraft && (
                  <button onClick={(e) => { e.stopPropagation(); if (confirm(`ลบแชท "${s.title}"?`)) deleteSession(s.id); }}
                    aria-label="ลบแชท"
                    className="size-6 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all cursor-pointer shrink-0">
                    <Trash2 className="size-3" strokeWidth={2.2} />
                  </button>
                )}
              </div>
            </div>
          );
          });
        })()}
      </div>
    </>
  );
}

/** Pick 5 unique random chips from the pool. */
function pickRandomChips(): string[] {
  const arr = [...EMPTY_STATE_CHIPS_POOL];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, 5);
}

/** ===== Empty state — minimal, premium (Apple/Linear style) ===== */
function EmptyState({ onChip }: { onChip: (s: string) => void }) {
  const [chips, setChips] = useState<string[]>(() => pickRandomChips());
  // Rotate the chip set every 6s for a "live" suggestion feed.
  useEffect(() => {
    const t = setInterval(() => setChips(pickRandomChips()), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="px-4 sm:px-6">
      <div className="text-center max-w-[600px] mx-auto">
        {/* Avatar — refined liquid glass with single soft glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto mb-5 size-[88px]"
        >
          {/* Single subtle glow — very gentle breathe */}
          <motion.div
            aria-hidden
            animate={{ opacity: [0.5, 0.75, 0.5] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-[-16px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at 50% 55%, rgba(99,102,241,0.18), transparent 65%)",
              filter: "blur(12px)",
            }}
          />

          {/* Glass orb */}
          <div
            className="absolute inset-0 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(150deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.3) 100%)",
              backdropFilter: "blur(24px) saturate(180%)",
              WebkitBackdropFilter: "blur(24px) saturate(180%)",
              boxShadow: [
                "inset 0 1.5px 1px rgba(255,255,255,0.9)",
                "inset 0 -1px 0.5px rgba(0,0,0,0.04)",
                "0 10px 30px -8px rgba(0,0,0,0.12)",
                "0 2px 6px -2px rgba(0,0,0,0.06)",
              ].join(", "),
              border: "1px solid rgba(255,255,255,0.5)",
            }}
          >
            {/* Soft specular highlight — single elegant gleam */}
            <span
              aria-hidden
              className="absolute left-[18%] top-[10%] w-[55%] h-[30%] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(ellipse, rgba(255,255,255,0.75), transparent 70%)",
                filter: "blur(1px)",
              }}
            />
            <img src={imgLogo} alt="เมต้า" className="size-[52px] object-contain relative z-10" />
          </div>
        </motion.div>

        {/* Greeting — simple fade-up */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`${font} text-[18px] text-[#1a1a1a] mb-7 leading-snug`}
          style={{ fontWeight: 500, letterSpacing: "-0.01em" }}
        >
          สวัสดีค่ะ มีอะไรให้เมต้าช่วยไหมคะ
        </motion.p>

        {/* Suggestion chips — 2 on top, 3 on bottom; per-chip crossfade with blur for silky rotation */}
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[40px]">
            <AnimatePresence mode="popLayout">
              {chips.slice(0, 2).map((c, i) => (
                <RotatingChip key={c} label={c} onClick={() => onChip(c)} delay={i * 0.06} />
              ))}
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 min-h-[40px]">
            <AnimatePresence mode="popLayout">
              {chips.slice(2).map((c, i) => (
                <RotatingChip key={c} label={c} onClick={() => onChip(c)} delay={0.05 + i * 0.06} />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Rotating chip — crossfade + slight blur + spring scale; per-chip exit for staggered out/in */
function RotatingChip({ label, onClick, delay }: { label: string; onClick: () => void; delay: number }) {
  return (
    <motion.button
      onClick={onClick}
      layout
      initial={{ opacity: 0, scale: 0.85, filter: "blur(6px)", y: 6 }}
      animate={{
        opacity: 1, scale: 1, filter: "blur(0px)", y: 0,
        transition: { delay, type: "spring", stiffness: 240, damping: 24, mass: 0.7 },
      }}
      exit={{
        opacity: 0, scale: 0.9, filter: "blur(6px)", y: -6,
        transition: { duration: 0.25, ease: [0.32, 0.72, 0, 1] },
      }}
      whileTap={{ scale: 0.96 }}
      className={`${font} text-[14px] px-4 py-2 rounded-[100px] bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors`}
      style={{ fontWeight: 500 }}
    >
      {label}
    </motion.button>
  );
}

function SuggestionChip({ label, onClick, delay }: { label: string; onClick: () => void; delay: number }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      whileTap={{ scale: 0.97 }}
      className={`${font} text-[14px] px-4 py-2 rounded-[100px] bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer transition-colors`}
      style={{ fontWeight: 500 }}
    >
      {label}
    </motion.button>
  );
}

/** ===== Thinking indicator — shimmer "เมต้ากำลังคิด..." with animated sparkle ===== */
function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="flex items-center gap-2 py-2"
    >
      {/* Pulsing/rotating sparkle with blue→purple gradient */}
      <motion.div
        animate={{ rotate: [0, 360], scale: [1, 1.15, 1] }}
        transition={{
          rotate: { duration: 4, repeat: Infinity, ease: "linear" },
          scale:  { duration: 1.6, repeat: Infinity, ease: "easeInOut" },
        }}
        className="shrink-0"
      >
        <Sparkles
          className="size-[18px]"
          strokeWidth={2.2}
          style={{
            // Approximate the gradient by hue rotation; the icon uses currentColor.
            color: "#6366f1",
            filter: "drop-shadow(0 0 6px rgba(99,102,241,0.45))",
          }}
        />
      </motion.div>

      {/* Shimmer text — gradient sweeps left→right infinitely */}
      <span
        className={`${font} text-[14px]`}
        style={{
          fontWeight: 500,
          backgroundImage: "linear-gradient(90deg, #6b7280 0%, #6b7280 35%, #0088ff 50%, #9747ff 60%, #6b7280 75%, #6b7280 100%)",
          backgroundSize: "200% 100%",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          animation: "metaShimmer 2s linear infinite",
        }}
      >
        เมต้ากำลังคิด...
      </span>
    </motion.div>
  );
}

/** ===== Composer — Figma node 7587:12443 (SVG icons taken directly from Figma) ===== */
const IconPhoto = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 21 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.69186 15.3916H17.3874C18.9745 15.3916 19.7724 14.5139 19.7724 12.8452L14.5641 7.99567C14.1783 7.63933 13.7135 7.45683 13.2401 7.45683C12.7578 7.45683 12.3282 7.62195 11.9248 7.97828L7.96158 11.4895L6.33945 10.038C5.97118 9.70777 5.56784 9.54269 5.15574 9.54269C4.76116 9.54269 4.38413 9.69905 4.02463 10.0293L0.683924 13.019C0.736533 14.5921 1.38539 15.3916 2.69186 15.3916ZM2.75324 16H17.9223C19.7636 16 20.6755 15.1049 20.6755 13.3145V2.69419C20.6755 0.903853 19.7636 0 17.9223 0H2.75324C0.920666 0 0 0.903853 0 2.69419V13.3145C0 15.1049 0.920666 16 2.75324 16ZM2.77077 14.6007C1.89395 14.6007 1.41169 14.1402 1.41169 13.2363V2.7724C1.41169 1.86855 1.89395 1.39924 2.77077 1.39924H17.9048C18.7728 1.39924 19.2639 1.86855 19.2639 2.7724V13.2363C19.2639 14.1402 18.7728 14.6007 17.9048 14.6007H2.77077Z" />
    <path d="M6.53235 8.08257C7.66346 8.08257 8.59289 7.16134 8.59289 6.03151C8.59289 4.91038 7.66346 3.98045 6.53235 3.98045C5.39248 3.98045 4.46304 4.91038 4.46304 6.03151C4.46304 7.16134 5.39248 8.08257 6.53235 8.08257Z" />
  </svg>
);

const IconMic = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 10 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.8774 12.3207C7.77252 12.3207 9.74798 10.3233 9.74798 7.40783V5.98511C9.74798 5.69077 9.52316 5.45949 9.23709 5.45949C8.95096 5.45949 8.71937 5.69077 8.71937 5.98511V7.36577C8.71937 9.75563 7.20708 11.3395 4.8774 11.3395C2.54088 11.3395 1.02861 9.75563 1.02861 7.36577V5.98511C1.02861 5.69077 0.803814 5.45949 0.510901 5.45949C0.224796 5.45949 0 5.69077 0 5.98511V7.40783C0 10.3233 1.97548 12.3207 4.8774 12.3207ZM2.39783 7.1555C2.39783 8.76742 3.406 9.90275 4.8774 9.90275C6.34198 9.90275 7.35015 8.76742 7.35015 7.1555V2.74726C7.35015 1.12834 6.34198 0 4.8774 0C3.406 0 2.39783 1.12834 2.39783 2.74726V7.1555ZM3.42644 7.1555V2.74726C3.42644 1.71003 4.00546 1.04424 4.8774 1.04424C5.74934 1.04424 6.32154 1.71003 6.32154 2.74726V7.1555C6.32154 8.19273 5.74934 8.85856 4.8774 8.85856C4.00546 8.85856 3.42644 8.19273 3.42644 7.1555ZM1.83243 14.9978H7.91558C8.20165 14.9978 8.43323 14.7666 8.43323 14.4722C8.43323 14.1779 8.20165 13.9395 7.91558 13.9395H1.83243C1.54633 13.9395 1.31472 14.1779 1.31472 14.4722C1.31472 14.7666 1.54633 14.9978 1.83243 14.9978ZM4.8774 14.7666C5.1635 14.7666 5.3883 14.5282 5.3883 14.2339V12.0823C5.3883 11.788 5.1635 11.5498 4.8774 11.5498C4.59129 11.5498 4.35968 11.788 4.35968 12.0823V14.2339C4.35968 14.5282 4.59129 14.7666 4.8774 14.7666Z" />
  </svg>
);

const IconPaperplane = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.96288 16C9.4783 16 9.84336 15.5472 10.1083 14.8462L14.7973 2.35144C14.9261 2.01551 14.9978 1.71611 14.9978 1.46782C14.9978 0.993149 14.7114 0.701049 14.2461 0.701049C14.0027 0.701049 13.7092 0.774078 13.3799 0.905524L1.06667 5.71793C0.465324 5.95161 0 6.32405 0 6.85714C0 7.52901 0.501118 7.75536 1.18836 7.96713L5.05413 9.16479C5.5123 9.31083 5.77001 9.29618 6.07785 9.00409L13.9311 1.51894C14.0242 1.43131 14.1315 1.44591 14.2031 1.51163C14.2747 1.58466 14.2818 1.6942 14.1959 1.78914L6.88679 9.82927C6.6076 10.1287 6.58612 10.377 6.72214 10.8662L7.86042 14.722C8.07514 15.4596 8.29711 16 8.96288 16Z" />
  </svg>
);

function Composer({ value, onChange, onSubmit, disabled }: {
  value: string; onChange: (v: string) => void; onSubmit: (e?: React.FormEvent) => void; disabled?: boolean;
}) {
  const active = value.trim().length > 0 && !disabled;
  const [focused, setFocused] = useState(false);
  // 1:1 port of Figma node 7587:12443; focus state animates dual blue/purple glow per node 7587:12384
  return (
    <form onSubmit={onSubmit} className="flex items-start justify-center px-[16px] py-[8px]">
      <motion.div
        animate={focused ? {
          boxShadow: [
            "0px -2px 8px 0px rgba(0,136,255,0.28), 0px 4px 8px 0px rgba(151,71,255,0.28)",
            "0px -3px 14px 0px rgba(151,71,255,0.38), 0px 5px 14px 0px rgba(0,136,255,0.38)",
            "0px -2px 8px 0px rgba(0,136,255,0.28), 0px 4px 8px 0px rgba(151,71,255,0.28)",
          ],
        } : { boxShadow: "0px 4px 2px 0px rgba(0,0,0,0.1)" }}
        transition={focused ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.25 }}
        className="bg-white flex items-center justify-between p-[8px] rounded-[100px] w-full max-w-[800px]">
        {/* Left group: photo + input — gap-[8px] items-center */}
        <div className="flex items-center gap-[8px] flex-1 min-w-0">
          <button type="button" aria-label="แนบรูป"
            className="flex items-center justify-center rounded-[100px] size-[40px] shrink-0 cursor-pointer hover:bg-black/5 transition-colors">
            <IconPhoto className="w-[21px] h-[16px] text-black" />
          </button>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="พิมพ์คำถามหรือสิ่งที่คุณต้องการ…"
            disabled={disabled}
            className={`${font} flex-1 bg-transparent h-[40px] text-[14px] text-[#1a1a1a] outline-none placeholder:text-[#737373] min-w-0`}
          />
        </div>
        {/* Right group: mic + send — items-center, NO gap */}
        <div className="flex items-center shrink-0">
          <button type="button" aria-label="พูดคำถาม"
            className="flex items-center justify-center rounded-[100px] size-[40px] shrink-0 cursor-pointer hover:bg-black/5 transition-colors">
            <IconMic className="w-[10px] h-[16px] text-black" />
          </button>
          <button type="submit" disabled={!active}
            aria-label="ส่ง"
            className={`flex items-center justify-center rounded-[100px] size-[40px] shrink-0 transition-all ${
              active
                ? "cursor-pointer text-white shadow-[0_2px_8px_rgba(99,102,241,0.35)]"
                : "bg-[#d9d9d9] opacity-50 cursor-not-allowed text-black"
            }`}
            style={active ? { backgroundImage: "linear-gradient(143deg, rgb(0,136,255) 11%, rgb(151,71,255) 100%)" } : undefined}>
            <IconPaperplane className="size-[16px]" />
          </button>
        </div>
      </motion.div>
    </form>
  );
}

/** ===== Message bubble — renders one AI/user message by kind ===== */
function MessageBubble({ m, onAction, onSend, onNavigate }: { m: AIMessage; onAction: (a: any) => void; onSend: (s: string) => void; onNavigate: (path: string) => void }) {
  const isUser = m.role === "user";
  // === User messages — soft gray bubble on the right (Gemini style) ===
  if (isUser && m.kind === "text") {
    return (
      <div className="flex justify-end mb-5">
        <div className={`${font} max-w-[78%] bg-gray-100 text-gray-900 rounded-3xl px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap`} style={{ fontWeight: 400 }}>{m.text}</div>
      </div>
    );
  }

  // === AI messages — NO bubble for text; rich cards float on the page ===
  return (
    <div className="mb-7">
      {m.kind === "text" && (
        <div className={`${font} text-[15px] leading-relaxed text-gray-800 whitespace-pre-wrap`} style={{ fontWeight: 400 }}>{m.text}</div>
      )}

      {m.kind === "products" && (
        <div className="space-y-3">
          <p className={`${font} text-[15px] leading-relaxed text-gray-800 mb-2`}>{m.text}</p>
          {/* Website-style product grid — same card as HomePage / ProductsPage */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[12px]">
            {m.products.map((p) => {
              const tag: "flashsale" | "discount" | "recommended" | null =
                p.isFlashSale ? "flashsale" : p.discountPercent ? "discount" : p.isRecommended ? "recommended" : null;
              return (
                <div
                  key={p.id}
                  onClick={() => onNavigate(`/product/${p.id}`)}
                  className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group/card relative"
                >
                  <div className="flex-1 relative min-h-0 overflow-hidden">
                    <ImageWithFallback src={productImageFor(p)} alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                    {tag === "flashsale" && (
                      <div className="absolute top-0 right-0 p-[6px]">
                        <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>ลด {p.discountPercent}%</span>
                        </div>
                      </div>
                    )}
                    {tag === "discount" && (
                      <div className="absolute top-0 right-0 p-[6px]">
                        <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>ลด {p.discountPercent}%</span>
                        </div>
                      </div>
                    )}
                    {tag === "recommended" && (
                      <div className="absolute top-0 right-0 p-[6px]">
                        <div className="bg-[#319754] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(49,151,84,0.4)]">
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>สินค้าแนะนำ</span>
                        </div>
                      </div>
                    )}
                    {/* Add-to-cart heart-button (bottom-right) — appears on hover */}
                    <button
                      onClick={(e) => { e.stopPropagation(); onSend(`เพิ่ม ${p.name} ใส่ตะกร้า`); }}
                      aria-label={`เพิ่ม ${p.name} เข้าตะกร้า`}
                      className="absolute bottom-2 right-2 size-8 bg-white/90 hover:bg-[#319754] hover:text-white text-[#319754] rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover/card:opacity-100 transition-all shadow-sm z-10"
                    >
                      <ShoppingCart className="size-3.5" strokeWidth={2.2} />
                    </button>
                  </div>
                  <div className="p-[10px] flex flex-col gap-[4px]">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                    <div className="flex items-center gap-[10px]">
                      <span className={`${font} text-[14px] ${p.discountPercent ? "text-[#e62e05]" : "text-[#226a3b]"} tabular-nums`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className={`${font} text-[10px] text-[#a3a3a3] line-through tabular-nums`}>฿{p.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[6px]">
                        <Star className="size-[12px] fill-[#F7C42B] text-[#F7C42B]" strokeWidth={0} />
                        <span className={`${font} text-[10px] text-black tabular-nums`}>{p.rating}/5</span>
                      </div>
                      <span className={`${font} text-[10px] text-black truncate`}>{p.sold}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

        {m.kind === "comparison" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 500 }}>{m.text}</p>
            <div className="overflow-x-auto">
              <table className={`${font} text-[12px] w-full`}>
                <thead>
                  <tr>
                    <th className="text-left text-gray-400 pb-2 pr-2" style={{ fontWeight: 500 }}>รายการ</th>
                    {m.products.map((p) => <th key={p.id} className="text-left text-[#1d5b32] pb-2 pr-2 truncate max-w-[100px]" style={{ fontWeight: 600 }}>{p.name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {m.rows.map((row, i) => (
                    <tr key={i} className="border-t border-gray-100">
                      <td className="text-gray-500 py-1.5 pr-2">{row.label}</td>
                      {row.values.map((v, j) => (
                        <td key={j} className={`py-1.5 pr-2 tabular-nums ${row.highlight === j ? "text-[#319754]" : "text-gray-700"}`} style={{ fontWeight: row.highlight === j ? 700 : 500 }}>
                          {typeof v === "number" ? v.toLocaleString() : v}
                          {row.highlight === j && <Check className="inline size-3 ml-1" strokeWidth={2.6} />}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={`${font} text-[12px] text-gray-700 bg-[#319754]/10 px-3 py-2 rounded-xl flex items-start gap-2`}>
              <Sparkles className="size-3.5 text-[#319754] shrink-0 mt-0.5" strokeWidth={2.2} />
              <span>{m.summary}</span>
            </div>
          </div>
        )}

        {m.kind === "bundle" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <p className={`${font} text-[13px] text-gray-800 mb-2`}>{m.text}</p>
            <div className="rounded-xl p-3 mb-3" style={{ background: "linear-gradient(135deg, #46c474 0%, #319754 100%)" }}>
              <p className={`${font} text-white text-[14px] mb-2`} style={{ fontWeight: 700 }}>📦 {m.name}</p>
              <div className="space-y-1.5">
                {m.items.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-2 py-1.5">
                    <div className="size-7 rounded-md overflow-hidden bg-white/30 shrink-0">
                      <ImageWithFallback src={productImageFor(p)} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <span className={`${font} text-[12px] text-white truncate flex-1`}>{p.name}</span>
                    <span className={`${font} text-[12px] text-white/90 tabular-nums`}>฿{p.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-2 border-t border-white/30 flex items-baseline justify-between">
                <span className={`${font} text-[11px] text-white/80 line-through tabular-nums`}>฿{m.total.toLocaleString()}</span>
                <span className={`${font} text-[18px] text-white tabular-nums`} style={{ fontWeight: 700 }}>฿{m.finalPrice.toLocaleString()}</span>
              </div>
              <p className={`${font} text-[11px] text-white/90`}>ประหยัด ฿{m.discount.toLocaleString()} (10%)</p>
            </div>
            <button onClick={() => m.items.forEach((p) => onSend(`เพิ่ม ${p.name} ใส่ตะกร้า`))}
              className={`${font} w-full h-[42px] rounded-full text-white text-[14px] cursor-pointer transition-shadow shadow-[0_4px_14px_-2px_rgba(49,151,84,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.55)] flex items-center justify-center gap-2`}
              style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
              <ShoppingCart className="size-4" strokeWidth={2.4} /> เพิ่มทั้งชุดเข้าตะกร้า
            </button>
          </div>
        )}

        {m.kind === "value" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className={`${font} text-[13px] text-gray-800`}>{m.text}</p>
            <div className="flex gap-2.5 items-center">
              <div className="size-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                <ImageWithFallback src={productImageFor(m.product)} alt={m.product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }}>{m.product.name}</p>
                <p className={`${font} text-[11px] text-gray-500 tabular-nums`}>฿{m.unitPrice.toFixed(2)} / {m.unit}</p>
                {m.savings && <p className={`${font} text-[11px] text-[#dc2626] tabular-nums`} style={{ fontWeight: 600 }}>{m.savings}</p>}
              </div>
            </div>
            <div className={`${font} inline-flex items-center gap-1.5 text-[12px] bg-[#319754]/10 text-[#1d5b32] px-3 py-1.5 rounded-full`} style={{ fontWeight: 600 }}>
              <Tag className="size-3" strokeWidth={2.4} /> {m.verdict}
            </div>
          </div>
        )}

        {m.kind === "cart" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className={`${font} text-[13px] text-gray-800`}>{m.text}</p>
            {m.items.length > 0 && (
              <div className="space-y-1">
                {m.items.map((it) => (
                  <div key={it.id} className="flex items-center justify-between gap-2 text-[12px]">
                    <span className={`${font} text-gray-700 truncate flex-1`}>×{it.quantity} {it.name}</span>
                    <span className={`${font} text-[#319754] tabular-nums`} style={{ fontWeight: 600 }}>฿{(it.price * it.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-1.5 mt-1 flex items-center justify-between">
                  <span className={`${font} text-[13px] text-gray-700`} style={{ fontWeight: 600 }}>ยอดรวม</span>
                  <span className={`${font} text-[15px] text-[#1d5b32] tabular-nums`} style={{ fontWeight: 700 }}>฿{m.total.toLocaleString()}</span>
                </div>
              </div>
            )}
            {m.promos.length > 0 && (
              <div className="space-y-1">
                {m.promos.map((p, i) => (
                  <div key={i} className={`${font} text-[11px] flex items-start gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-2.5 py-1.5 rounded-lg`}>
                    <Sparkles className="size-3 text-amber-500 shrink-0 mt-0.5" strokeWidth={2.4} />
                    <span><span style={{ fontWeight: 700 }}>{p.title}</span> — {p.body}</span>
                  </div>
                ))}
              </div>
            )}
            {m.items.length > 0 && (
              <button onClick={() => onSend("ชำระเงิน")}
                className={`${font} w-full h-[40px] rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer flex items-center justify-center gap-2 transition-colors`} style={{ fontWeight: 600 }}>
                ดำเนินการชำระเงิน <ArrowRight className="size-4" strokeWidth={2.4} />
              </button>
            )}
          </div>
        )}

        {m.kind === "orders" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className={`${font} text-[13px] text-gray-800`}>{m.text}</p>
            <div className="space-y-1.5">
              {m.orders.map((o) => (
                <div key={o.id} className="flex items-center justify-between gap-2 bg-[#fafafa] rounded-xl px-3 py-2">
                  <div className="min-w-0 flex-1">
                    <p className={`${font} text-[12px] text-[#1a1a1a] truncate tabular-nums`} style={{ fontWeight: 600 }}>{o.id}</p>
                    <p className={`${font} text-[10.5px] text-gray-400`}>{o.date}</p>
                  </div>
                  <span className={`${font} text-[11px] px-2 py-0.5 rounded-full bg-[#319754]/10 text-[#1d5b32]`} style={{ fontWeight: 600 }}>{statusLabel(o.status)}</span>
                  <span className={`${font} text-[12px] text-[#319754] tabular-nums`} style={{ fontWeight: 700 }}>฿{o.total.toLocaleString()}</span>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate("/orders")}
              className={`${font} w-full h-[36px] rounded-full bg-[#319754]/10 hover:bg-[#319754]/20 text-[#1d5b32] text-[12px] cursor-pointer flex items-center justify-center gap-1.5 transition-colors`} style={{ fontWeight: 600 }}>
              ดูทั้งหมด <ArrowRight className="size-3.5" strokeWidth={2.4} />
            </button>
          </div>
        )}

        {m.kind === "actions" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-2">
            <p className={`${font} text-[13px] text-gray-800`}>{m.text}</p>
            <div className="flex flex-wrap gap-1.5">
              {m.actions.map((a, i) => (
                <button key={i} onClick={() => onAction(a)}
                  className={`${font} text-[12px] px-3 py-1.5 rounded-full bg-[#319754] hover:bg-[#287745] text-white cursor-pointer transition-colors`} style={{ fontWeight: 600 }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

function statusLabel(s: string): string {
  const map: Record<string, string> = {
    pending_payment: "รอชำระ", pending_verify: "ตรวจสอบ", preparing: "เตรียมส่ง",
    shipped: "จัดส่งแล้ว", delivered: "ส่งถึงแล้ว", completed: "สำเร็จ", cancelled: "ยกเลิก",
  };
  return map[s] ?? s;
}
