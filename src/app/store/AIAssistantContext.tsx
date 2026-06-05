import { createContext, useCallback, useContext, useMemo, useRef, type ReactNode } from "react";
import { usePersistentState } from "./usePersistentState";
import { useProducts } from "./ProductsContext";
import { useCart } from "./CartContext";
import { useOrders } from "./OrderContext";
import { useAuth } from "./AuthContext";
import {
  detectIntent, extractGoals, extractBudget, extractCategory, goalLabel,
  searchProducts, recommendForGoals, compareProducts, valueAnalysis, buildBundle,
  suggestPromos, crossSell, quickReplies,
  type Intent, type CustomerProfile, type HealthGoal,
} from "../data/aiEngine";
import type { Product } from "../data/products";

/** Rich message payloads — the UI renders cards based on `kind`. */
export type AIMessage =
  | { id: string; role: "user"; ts: number; kind: "text"; text: string }
  | { id: string; role: "ai";   ts: number; kind: "text"; text: string }
  | { id: string; role: "ai";   ts: number; kind: "products"; text: string; products: Product[]; goals?: HealthGoal[] }
  | { id: string; role: "ai";   ts: number; kind: "comparison"; text: string; products: Product[]; rows: { label: string; values: (string | number)[]; highlight?: number }[]; summary: string }
  | { id: string; role: "ai";   ts: number; kind: "bundle"; text: string; items: Product[]; total: number; discount: number; finalPrice: number; name: string }
  | { id: string; role: "ai";   ts: number; kind: "value"; text: string; product: Product; verdict: string; unitPrice: number; unit: string; savings?: string }
  | { id: string; role: "ai";   ts: number; kind: "cart"; text: string; items: { id: string; name: string; price: number; quantity: number }[]; total: number; promos: { type: string; title: string; body: string }[] }
  | { id: string; role: "ai";   ts: number; kind: "orders"; text: string; orders: Array<{ id: string; status: string; total: number; date: string }> }
  | { id: string; role: "ai";   ts: number; kind: "actions"; text: string; actions: { label: string; intent: string; payload?: any }[] };

export interface ChatSession {
  id: string;
  title: string;
  messages: AIMessage[];
  updatedAt: number;
}

interface AIAssistantContextType {
  open: boolean;
  setOpen: (o: boolean) => void;
  toggle: () => void;
  unreadCount: number;
  messages: AIMessage[];
  profile: CustomerProfile;
  typing: boolean;
  send: (text: string) => Promise<void>;
  /** Reset CURRENT session to the greeting (kept for backward compat). */
  reset: () => void;
  quickReplyChips: string[];
  /** ===== Multi-session ===== */
  sessions: ChatSession[];
  currentSessionId: string;
  newChat: () => void;
  loadSession: (id: string) => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | null>(null);

const uid = () => `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
const sid = () => `s_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;

const GREETING: AIMessage = {
  id: "greet", role: "ai", ts: 0, kind: "text",
  text: "สวัสดีค่ะ เมต้าเป็นผู้ช่วยช้อปสมุนไพรของคุณ 🌿 มีอะไรให้เมต้าช่วยไหมคะ — ลองถามได้เลยว่า “หาสินค้าอะไรอยู่” หรือ “แนะนำสินค้าหน่อย”",
};

const createSession = (): ChatSession => ({
  id: sid(),
  title: "แชทใหม่",
  messages: [GREETING],
  updatedAt: Date.now(),
});

/** Auto-title: first 28 chars of the first user message. */
const deriveTitle = (msgs: AIMessage[]): string => {
  const firstUser = msgs.find((m) => m.role === "user" && m.kind === "text") as AIMessage | undefined;
  if (!firstUser || firstUser.kind !== "text") return "แชทใหม่";
  const t = firstUser.text.trim().slice(0, 28);
  return t.length > 0 ? t : "แชทใหม่";
};

/** Seed history — example sessions so the sidebar isn't empty on first run. */
const seedSessions = (): ChatSession[] => {
  const now = Date.now();
  const mk = (id: string, title: string, userText: string, agoMin: number): ChatSession => ({
    id, title,
    updatedAt: now - agoMin * 60_000,
    messages: [
      GREETING,
      { id: `${id}_u`, role: "user", ts: now - agoMin * 60_000 - 5000, kind: "text", text: userText },
      { id: `${id}_a`, role: "ai",   ts: now - agoMin * 60_000 - 4000, kind: "text", text: "เมต้ามีตัวเลือกหลายอย่างเลยค่ะ ลองเปิดดูในแชทเดิมได้เลยนะคะ 🌿" },
    ],
  });
  return [
    // First session = truly empty (just greeting) — shows the empty state UI when opened
    { id: "s_seed_new", title: "แชทใหม่", updatedAt: now, messages: [GREETING] },
    mk("s_seed_1", "แนะนำสมุนไพรช่วยนอนหลับ", "แนะนำสมุนไพรช่วยนอนหลับ", 35),
    mk("s_seed_2", "เปรียบเทียบขมิ้นชัน VS ฟ้าทะลายโจร", "เปรียบเทียบขมิ้นชัน VS ฟ้าทะลายโจร", 90),
    mk("s_seed_3", "ลดน้ำหนัก งบไม่เกิน 500", "ลดน้ำหนัก งบไม่เกิน 500 บาท", 1440),
    mk("s_seed_4", "บำรุงผิวสำหรับผู้สูงอายุ", "บำรุงผิวสำหรับผู้สูงอายุ", 2880),
  ];
};

export function AIAssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = usePersistentState<boolean>("metaherb:ai:open", false);
  // Multi-session storage — seeded with examples for the sidebar.
  // Key versioned to v2 so existing users see the new seed instead of stale "แชทใหม่" sessions.
  const seed = seedSessions();
  const [sessions, setSessions] = usePersistentState<ChatSession[]>("metaherb:ai:sessions:v2", seed);
  const [currentSessionId, setCurrentSessionId] = usePersistentState<string>("metaherb:ai:currentSession:v2", seed[0].id);
  const [profile, setProfile] = usePersistentState<CustomerProfile>("metaherb:ai:profile", { goals: [] });
  const [typing, setTyping] = usePersistentState<boolean>("metaherb:ai:typing", false);
  const [unreadCount, setUnreadCount] = usePersistentState<number>("metaherb:ai:unread", 0);

  const { products, categories } = useProducts();
  const { items: cartItems, addItem, removeItem, total: cartTotal, clearCart } = useCart();
  const { orders, addOrder } = useOrders();
  const { user } = useAuth();

  // Avoid stale-closure inside async handler; track current state via refs.
  const profileRef = useRef(profile);
  profileRef.current = profile;
  const currentSessionIdRef = useRef(currentSessionId);
  currentSessionIdRef.current = currentSessionId;

  // Derived: current session's messages (fallback to greeting if missing)
  const messages: AIMessage[] = useMemo(() => {
    const s = sessions.find((x) => x.id === currentSessionId);
    return s ? s.messages : [GREETING];
  }, [sessions, currentSessionId]);

  /** Mutate the active session — keeps it on top + auto-titles from first user msg. */
  const mutateCurrentSession = useCallback((updater: (prev: AIMessage[]) => AIMessage[]) => {
    const id = currentSessionIdRef.current;
    setSessions((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      let next: ChatSession[];
      if (idx === -1) {
        const fresh: ChatSession = { id, title: "แชทใหม่", messages: updater([GREETING]), updatedAt: Date.now() };
        next = [fresh];
      } else {
        const updatedMsgs = updater(prev[idx].messages);
        const session: ChatSession = {
          ...prev[idx],
          messages: updatedMsgs,
          title: prev[idx].title === "แชทใหม่" ? deriveTitle(updatedMsgs) : prev[idx].title,
          updatedAt: Date.now(),
        };
        next = [session, ...prev.slice(0, idx), ...prev.slice(idx + 1)];
      }
      return next;
    });
  }, [setSessions]);

  const setMessages = useCallback((updater: AIMessage[] | ((prev: AIMessage[]) => AIMessage[])) => {
    mutateCurrentSession((prev) => typeof updater === "function" ? (updater as any)(prev) : updater);
  }, [mutateCurrentSession]);

  const push = useCallback((m: Omit<AIMessage, "id" | "ts">) => {
    const msg = { ...m, id: uid(), ts: Date.now() } as AIMessage;
    setMessages((prev) => [...prev, msg]);
    if (m.role === "ai") setUnreadCount((c) => (open ? 0 : c + 1));
  }, [open, setMessages, setUnreadCount]);

  const updateProfile = useCallback((patch: Partial<CustomerProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch, goals: patch.goals && patch.goals.length > 0 ? Array.from(new Set([...patch.goals, ...prev.goals])).slice(0, 4) : prev.goals }));
  }, [setProfile]);

  /** Mock "thinking" delay — simulates AI streaming. */
  const think = (ms = 600) => new Promise<void>((r) => setTimeout(r, ms));

  const handle = useCallback(async (text: string) => {
    const intent: Intent = detectIntent(text);
    const newGoals = extractGoals(text);
    const budget = extractBudget(text);
    const cat = extractCategory(text, categories);
    const prof = profileRef.current;

    // Update profile with anything we learned
    updateProfile({
      goals: newGoals.length > 0 ? newGoals : undefined,
      budgetMax: budget ?? prof.budgetMax,
      lastIntent: intent,
      lastQuery: text,
      lastCategory: cat,
    });
    const activeGoals = newGoals.length > 0 ? newGoals : prof.goals;

    setTyping(true);
    await think(550);

    switch (intent) {
      case "greet": {
        push({ role: "ai", kind: "text", text: user ? `ยินดีต้อนรับกลับมาค่ะคุณ ${user.username} 🌿 วันนี้สนใจอะไรเป็นพิเศษคะ?` : "สวัสดีค่ะ! ลองบอก goal สุขภาพ เช่น “นอนไม่หลับ” หรือ “บำรุงผิว” ฉันจะแนะนำสินค้าที่เหมาะกับคุณ" });
        break;
      }
      case "help": {
        push({ role: "ai", kind: "text", text: "ฉันช่วยอะไรได้บ้าง:\n• ค้นหา/แนะนำสมุนไพรตามอาการ\n• เปรียบเทียบ + วิเคราะห์ความคุ้มค่า\n• จัดเซตประหยัด + แนะนำโปรโมชั่น\n• เพิ่ม/ลบสินค้าในตะกร้า + ชำระเงิน\n• ดูสถานะออเดอร์" });
        break;
      }
      case "search":
      case "recommend": {
        const results = intent === "recommend" || activeGoals.length > 0
          ? recommendForGoals(products, activeGoals, 5)
          : searchProducts(products, text, { goals: activeGoals, budgetMax: budget ?? prof.budgetMax, category: cat, limit: 5 });
        if (results.length === 0) {
          push({ role: "ai", kind: "text", text: "ขอโทษค่ะ ยังไม่พบสินค้าที่ตรงเลย ลองใช้คำที่กว้างขึ้น หรือบอก goal เช่น “นอนหลับ”, “บำรุงผิว”" });
        } else {
          const head = activeGoals.length > 0
            ? `จาก goal “${activeGoals.map(goalLabel).join(" + ")}”${budget ? ` ภายในงบ ฿${budget}` : ""} แนะนำ:`
            : `พบสินค้าที่น่าจะใช่ ${results.length} รายการ:`;
          push({ role: "ai", kind: "products", text: head, products: results, goals: activeGoals });
        }
        break;
      }
      case "compare": {
        // Pick top 2 from last shown products or from recommendation
        let toCompare: Product[] = [];
        // Look back in messages for the last products list
        for (let i = messages.length - 1; i >= 0; i--) {
          const m = messages[i];
          if (m.kind === "products" && m.products.length >= 2) { toCompare = m.products.slice(0, 3); break; }
        }
        if (toCompare.length < 2) toCompare = recommendForGoals(products, activeGoals, 3);
        const cmp = compareProducts(toCompare);
        push({ role: "ai", kind: "comparison", text: `เปรียบเทียบ ${toCompare.length} รายการ:`, products: toCompare, rows: cmp.rows, summary: cmp.summary });
        break;
      }
      case "bundle": {
        const bundle = buildBundle(products, activeGoals, budget ?? prof.budgetMax);
        push({ role: "ai", kind: "bundle", text: "ฉันจัดชุดให้แล้วค่ะ — ราคารวมพิเศษ:", ...bundle });
        break;
      }
      case "promo": {
        const promos = suggestPromos(cartTotal);
        if (promos.length === 0) {
          push({ role: "ai", kind: "text", text: "เพิ่มสินค้าเข้าตะกร้าก่อนนะคะ ฉันจะช่วยหาโปรที่ใช่ให้" });
        } else {
          push({ role: "ai", kind: "text", text: `จากยอดในตะกร้า ฿${cartTotal.toLocaleString()}:\n${promos.map((p) => `• ${p.title} — ${p.body}`).join("\n")}` });
        }
        break;
      }
      case "value": {
        // analyze the most recent product shown
        let target: Product | undefined;
        for (let i = messages.length - 1; i >= 0; i--) {
          const m = messages[i];
          if (m.kind === "products" && m.products.length > 0) { target = m.products[0]; break; }
        }
        if (!target) target = recommendForGoals(products, activeGoals, 1)[0];
        if (!target) { push({ role: "ai", kind: "text", text: "ลองค้นหาสินค้าก่อน แล้วค่อยถามความคุ้มค่าได้นะคะ" }); break; }
        const v = valueAnalysis(target);
        push({ role: "ai", kind: "value", text: `วิเคราะห์ความคุ้มค่า ${target.name}:`, product: target, verdict: v.verdict, unitPrice: v.unitPrice, unit: v.unit, savings: v.savings });
        break;
      }
      case "cart_add": {
        // Find product mentioned by name token
        const tokens = text.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
        const match = products.find((p) => tokens.some((t) => p.name.toLowerCase().includes(t)));
        if (!match) {
          push({ role: "ai", kind: "text", text: "ยังไม่แน่ใจว่าจะหยิบตัวไหน — ลองพิมพ์ชื่อสินค้าให้ชัดขึ้น หรือกดปุ่ม “เพิ่มเข้าตะกร้า” ใต้การ์ดสินค้าได้เลย" });
          break;
        }
        addItem({
          productId: match.id, name: match.name, image: match.image, price: match.price,
          originalPrice: match.originalPrice, option: match.options?.[0] ?? "ค่าเริ่มต้น",
          quantity: 1, inStock: match.stock > 0, shopName: match.shopName,
        });
        const upsell = crossSell(products, match, 3);
        push({ role: "ai", kind: "text", text: `เพิ่ม “${match.name}” ลงตะกร้าเรียบร้อย ✓\nยอดรวม ฿${(cartTotal + match.price).toLocaleString()}` });
        if (upsell.length > 0) {
          await think(400);
          push({ role: "ai", kind: "products", text: "ลูกค้าที่ซื้อสินค้านี้ มักซื้อพร้อมกับ:", products: upsell });
        }
        break;
      }
      case "cart_remove": {
        if (cartItems.length === 0) { push({ role: "ai", kind: "text", text: "ตะกร้ายังว่างอยู่ค่ะ" }); break; }
        const last = cartItems[cartItems.length - 1];
        removeItem(last.productId);
        push({ role: "ai", kind: "text", text: `เอา “${last.name}” ออกจากตะกร้าแล้วค่ะ` });
        break;
      }
      case "cart_view": {
        const promos = suggestPromos(cartTotal);
        push({
          role: "ai", kind: "cart",
          text: cartItems.length === 0 ? "ตะกร้ายังว่างอยู่ค่ะ ลองหาสินค้าก่อนนะคะ" : `ในตะกร้าตอนนี้มี ${cartItems.length} รายการ`,
          items: cartItems.map((c) => ({ id: c.productId, name: c.name, price: c.price, quantity: c.quantity })),
          total: cartTotal,
          promos,
        });
        break;
      }
      case "checkout": {
        if (!user) { push({ role: "ai", kind: "text", text: "กรุณาเข้าสู่ระบบก่อนสั่งซื้อนะคะ" }); break; }
        if (cartItems.length === 0) { push({ role: "ai", kind: "text", text: "ตะกร้าว่างอยู่ค่ะ ลองค้นหาสินค้าก่อน" }); break; }
        const orderId = addOrder({
          items: cartItems,
          total: cartTotal + (cartTotal >= 500 ? 0 : 40),
          status: "pending_payment",
          shippingAddress: `ใช้ที่อยู่เริ่มต้นของคุณ ${user.username}`,
          paymentMethod: "โอนผ่านธนาคาร",
          shopName: cartItems[0]?.shopName ?? "METAHERB Store",
        });
        clearCart();
        push({ role: "ai", kind: "text", text: `สร้างออเดอร์ ${orderId} เรียบร้อย ✓\nยอดรวม ฿${(cartTotal + (cartTotal >= 500 ? 0 : 40)).toLocaleString()} — โปรดชำระเงินใน 24 ชม.` });
        push({ role: "ai", kind: "actions", text: "ขั้นตอนถัดไป:", actions: [{ label: "ไปหน้าออเดอร์", intent: "nav:/orders" }, { label: "ดูสถานะ", intent: "order_status" }] });
        break;
      }
      case "order_status":
      case "order_recent": {
        const myOrders = orders.slice(0, 3);
        if (myOrders.length === 0) { push({ role: "ai", kind: "text", text: "ยังไม่มีออเดอร์ในระบบค่ะ" }); break; }
        push({
          role: "ai", kind: "orders",
          text: "ออเดอร์ล่าสุดของคุณ:",
          orders: myOrders.map((o) => ({ id: o.id, status: o.status, total: o.total, date: o.date })),
        });
        break;
      }
      case "qa": {
        // Try to find a product mentioned and answer from its description
        const tokens = text.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
        const match = products.find((p) => tokens.some((t) => p.name.toLowerCase().includes(t)));
        if (match) {
          push({ role: "ai", kind: "text", text: `เกี่ยวกับ ${match.name}:\n• ${match.description || "ผลิตภัณฑ์สมุนไพรคุณภาพคัดสรร"}\n• น้ำหนัก: ${match.weight}\n• รูปแบบ: ${match.format || match.type}\n• ข้อควรระวัง: ปรึกษาแพทย์หากใช้ร่วมกับยาประจำตัว` });
        } else {
          push({ role: "ai", kind: "text", text: "บอกชื่อสินค้าให้แม่นยำขึ้นได้ไหมคะ ฉันจะดึงข้อมูลให้" });
        }
        break;
      }
      default: {
        // Treat unknown as search fallback
        const results = searchProducts(products, text, { goals: activeGoals, budgetMax: budget ?? prof.budgetMax, category: cat, limit: 4 });
        if (results.length > 0) {
          push({ role: "ai", kind: "products", text: "ลองดูตัวเลือกเหล่านี้ดูนะคะ:", products: results, goals: activeGoals });
        } else {
          push({ role: "ai", kind: "text", text: "ฉันยังไม่เข้าใจคำขอ — ลองเลือกจากคำถามแนะนำด้านล่างก็ได้ค่ะ" });
        }
      }
    }
    setTyping(false);
  }, [products, categories, cartItems, cartTotal, orders, user, addItem, removeItem, addOrder, clearCart, messages, push, setTyping, updateProfile]);

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    push({ role: "user", kind: "text", text: trimmed });
    await handle(trimmed);
  }, [handle, push]);

  const reset = useCallback(() => {
    setMessages([GREETING]);
    setProfile({ goals: [] });
    setUnreadCount(0);
  }, [setMessages, setProfile, setUnreadCount]);

  /** ===== Multi-session controls ===== */
  const newChat = useCallback(() => {
    setSessions((prev) => {
      // If the current session has no user messages yet, reuse it instead of creating a duplicate "แชทใหม่"
      const cur = prev.find((s) => s.id === currentSessionIdRef.current);
      const isCurrentEmpty = cur && !cur.messages.some((m) => m.role === "user");
      if (isCurrentEmpty) {
        setProfile({ goals: [] });
        setUnreadCount(0);
        return prev;
      }
      const fresh = createSession();
      setCurrentSessionId(fresh.id);
      setProfile({ goals: [] });
      setUnreadCount(0);
      return [fresh, ...prev];
    });
  }, [setSessions, setCurrentSessionId, setProfile, setUnreadCount]);

  const loadSession = useCallback((id: string) => {
    setCurrentSessionId(id);
    setUnreadCount(0);
  }, [setCurrentSessionId, setUnreadCount]);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      // If we deleted the current one, switch to the next-most-recent OR create a fresh one
      if (id === currentSessionIdRef.current) {
        if (next.length > 0) setCurrentSessionId(next[0].id);
        else {
          const fresh = createSession();
          setCurrentSessionId(fresh.id);
          return [fresh];
        }
      }
      return next;
    });
  }, [setSessions, setCurrentSessionId]);

  const renameSession = useCallback((id: string, title: string) => {
    const t = title.trim().slice(0, 60) || "แชทใหม่";
    setSessions((prev) => prev.map((s) => s.id === id ? { ...s, title: t } : s));
  }, [setSessions]);

  const toggle = useCallback(() => {
    setOpen((o) => { if (!o) setUnreadCount(0); return !o; });
  }, [setOpen, setUnreadCount]);

  const setOpenWrap = useCallback((o: boolean) => {
    setOpen(o);
    if (o) setUnreadCount(0);
  }, [setOpen, setUnreadCount]);

  // Compute quick reply chips from last AI intent
  const quickReplyChips = useMemo(() => {
    const lastIntent: Intent = profile.lastIntent ?? "greet";
    return quickReplies(lastIntent, profile);
  }, [profile]);

  const value = useMemo<AIAssistantContextType>(() => ({
    open, setOpen: setOpenWrap, toggle, unreadCount,
    messages, profile, typing,
    send, reset, quickReplyChips,
    sessions, currentSessionId, newChat, loadSession, deleteSession, renameSession,
  }), [open, setOpenWrap, toggle, unreadCount, messages, profile, typing, send, reset, quickReplyChips, sessions, currentSessionId, newChat, loadSession, deleteSession, renameSession]);

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>;
}

export function useAIAssistant() {
  const ctx = useContext(AIAssistantContext);
  if (!ctx) throw new Error("useAIAssistant must be used within AIAssistantProvider");
  return ctx;
}
