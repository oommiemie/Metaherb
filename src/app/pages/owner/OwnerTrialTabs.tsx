import { useState, useMemo, useEffect, useRef } from "react";
import { readImageFile } from "../../data/imageUpload";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical, Users, Coins, Check, Clock, ChevronLeft, ChevronRight, Search, Plus, X,
  ArrowUpRight, Calendar, Sparkles, Trash2, Edit3, MapPin, AlertCircle, Phone, MessageCircle, Ban,
  MoreHorizontal, Pencil, EyeOff, Eye, Star, FileText, ThumbsUp, ThumbsDown, Package, ChevronDown,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { EvaluationView } from "../../components/EvaluationModal";
import { toast } from "sonner";
import {
  TRIAL_PRODUCTS, loadRegistrations, saveRegistrations, REGISTRATIONS_STORAGE_KEY,
  getRegistrationStatus,
  type Registration, type TrialProduct, type RegistrationStatus,
} from "../../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// ============================================================================
//  SHARED DATA HOOKS — combine real (localStorage) + mock owner-wide registrations
// ============================================================================

/** Mock seed of registrations from OTHER users — added to the owner view to make
 *  the tracking table feel realistic. Real user submissions still come from
 *  localStorage and are merged on top of these. */
const MOCK_REGISTRATIONS: Registration[] = [
  // 4 pending_approval (just submitted, owner hasn't decided yet)
  { trialId: "trial-2",  name: "ปัญญา สุขสบาย",     phone: "082-100-9988", address: "22/8 พหลโยธิน 24 จตุจักร กทม. 10900",       motivation: "นอนไม่หลับเรื้อรัง ต้องการตัวช่วยจากธรรมชาติ",  submittedAt: Date.now() - 1 * 86400000 },
  { trialId: "trial-6",  name: "ดวงใจ พรหมเดช",     phone: "081-888-9911", address: "120/3 ถ.รัชดา ห้วยขวาง กทม. 10310",          motivation: "ทำงานออฟฟิศ ปวดเมื่อยทุกวัน",                  submittedAt: Date.now() - 1 * 86400000 },
  { trialId: "trial-9",  name: "สรพล ศรีจันทร์",     phone: "082-555-3344", address: "29 ลาดพร้าว 71 วังทองหลาง กทม. 10310",      motivation: "ผมร่วงเยอะมาก ขอลองดู",                         submittedAt: Date.now() - 2 * 86400000 },
  { trialId: "trial-13", name: "อนุชา รุ่งเรือง",   phone: "081-555-8899", address: "77 พหลโยธิน 35 จตุจักร กทม. 10900",          motivation: "ผิวมัน หาครีมกันแดดที่ไม่ทำให้มันเพิ่ม",        submittedAt: Date.now() - 1 * 86400000 },

  // 3 approved (waiting for evaluation submission)
  { trialId: "trial-1",  name: "นภัสวรรณ สุขดี",   phone: "081-234-1100", address: "10/2 ถ.พระราม 9 บางกะปิ กทม. 10240",         motivation: "อยากลองสูตรใหม่ — เคยใช้สูตรเก่าแล้วชอบ",       submittedAt: Date.now() - 4 * 86400000, approvedAt: Date.now() - 3 * 86400000 },
  { trialId: "trial-3",  name: "วิภาวดี ทองดี",     phone: "088-222-4455", address: "73 ม.1 สันทราย เชียงใหม่ 50210",              motivation: "ปวดข้อเรื้อรัง ลองครีมบรรเทา",                  submittedAt: Date.now() - 5 * 86400000, approvedAt: Date.now() - 4 * 86400000 },
  { trialId: "trial-7",  name: "ภัทรภร โสภณ",       phone: "083-444-1122", address: "8 ม.4 ปากเกร็ด นนทบุรี 11120",              motivation: "ผิวบอบบาง อยากลองสครับธรรมชาติ",                submittedAt: Date.now() - 6 * 86400000, approvedAt: Date.now() - 5 * 86400000 },

  // 4 evaluated (full cycle done) — with sample evaluation data
  { trialId: "trial-1",  name: "อรอนงค์ เจริญสุข", phone: "089-555-2200", address: "55 ม.5 บางใหญ่ นนทบุรี 11140",               motivation: "ผิวมีปัญหารอยดำ อยากลองดูว่าจะช่วยได้ไหม",      submittedAt: Date.now() - 12 * 86400000, approvedAt: Date.now() - 11 * 86400000, evaluatedAt: Date.now() - 1 * 86400000,
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 4, "การระคายเคือง": 5 }, comment: "เนื้อบางซึมไว ใช้ครบ 2 สัปดาห์เห็นรอยดำจางลงชัดเจน กลิ่นขมิ้นอ่อน ไม่ฉุนเหมือนสูตรเก่า แนะนำเพื่อนแล้ว!", wouldRecommend: true } },
  { trialId: "trial-2",  name: "สมรัก ใจเย็น",       phone: "086-777-3300", address: "9/14 ถ.บางนา บางพลี สมุทรปราการ 10540",      motivation: "อยากลดยานอนหลับ ลองสมุนไพรก่อน",                submittedAt: Date.now() - 15 * 86400000, approvedAt: Date.now() - 14 * 86400000, evaluatedAt: Date.now() - 2 * 86400000,
    evaluation: { overall: 4, criteria: { "ผลต่อการนอน 7 คืน": 4, "รสชาติ": 3, "ความสะดวกในการชง": 5 }, comment: "นอนหลับลึกขึ้นจริงๆ ตื่นมาสดชื่น แต่รสติดขมไปนิด อยากให้เพิ่มกลิ่นวานิลลาหรือน้ำผึ้งหน่อย", wouldRecommend: true } },
  { trialId: "trial-5",  name: "กิตติศักดิ์ พงษ์ดี", phone: "087-333-6677", address: "44/9 สุขุมวิท 31 วัฒนา กทม. 10110",           motivation: "ทำอาหารคลีน อยากลองน้ำมันสกัดเย็น",             submittedAt: Date.now() - 18 * 86400000, approvedAt: Date.now() - 17 * 86400000, evaluatedAt: Date.now() - 3 * 86400000,
    evaluation: { overall: 5, criteria: { "รสชาติ": 5, "การดูดซึมบนผิว": 4, "ความคงตัวที่อุณหภูมิห้อง": 5 }, comment: "กลิ่นหอมมากกว่าน้ำมันมะพร้าวสกัดร้อนชัดเจน ใช้ทำน้ำสลัดอร่อย ทาผิวก็เข้าผิวไว", wouldRecommend: true } },
  { trialId: "trial-8",  name: "นเรศ ภูศิริ",        phone: "089-666-7788", address: "302/8 ถ.บางขุนเทียน บางขุนเทียน กทม. 10150",  motivation: "อยากเลิกใช้ฟลูออไรด์ ขอลองสูตรขมิ้น-เกลือ",     submittedAt: Date.now() - 20 * 86400000, approvedAt: Date.now() - 19 * 86400000, evaluatedAt: Date.now() - 1 * 86400000,
    evaluation: { overall: 3, criteria: { "รสชาติ": 2, "ความสะอาด": 4, "ผลต่อเหงือก": 4 }, comment: "ฟันสะอาดดี เหงือกไม่บวม แต่รสเค็มจัดมาก ใช้ครั้งแรกอึ้งไปเลย อยากให้ปรับปริมาณเกลือลง", wouldRecommend: false } },
  { trialId: "trial-12", name: "พิมพ์ใจ บุญมา",     phone: "088-999-2255", address: "5/3 ถ.เทพารักษ์ บางพลี สมุทรปราการ 10540",    motivation: "อยากลดน้ำหนัก ลองชาดู",                          submittedAt: Date.now() - 22 * 86400000, approvedAt: Date.now() - 21 * 86400000, evaluatedAt: Date.now() - 4 * 86400000,
    evaluation: { overall: 4, criteria: { "น้ำหนักก่อน/หลัง": 4, "อาการข้างเคียง": 5, "รสชาติ": 4 }, comment: "ลดได้ 2 กก. ใน 14 วัน ไม่มีอาการใจสั่น ท้องไม่ปวด ดีกว่าชาลดน้ำหนักยี่ห้ออื่นที่เคยลอง", wouldRecommend: true } },

  // 1 rejected
  { trialId: "trial-4",  name: "สุชาติ จันทร์ฉาย",   phone: "087-111-2233", address: "100/5 รามอินทรา 65 บางเขน กทม. 10220",       motivation: "อยากลอง",                                          submittedAt: Date.now() - 7 * 86400000, rejectedAt: Date.now() - 6 * 86400000 },
];

const CUSTOM_PRODUCTS_KEY = "metaherb:trial:products:custom";

function loadCustomProducts(): TrialProduct[] {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || "[]"); }
  catch { return []; }
}
function saveCustomProducts(list: TrialProduct[]) {
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(list));
}

function useAllRegistrations() {
  const [regs, setRegs] = useState<Registration[]>(() => [...MOCK_REGISTRATIONS, ...loadRegistrations()]);
  useEffect(() => {
    const refresh = () => setRegs([...MOCK_REGISTRATIONS, ...loadRegistrations()]);
    const onStorage = (e: StorageEvent) => { if (e.key === REGISTRATIONS_STORAGE_KEY) refresh(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", refresh); };
  }, []);
  const updateOne = (predicate: (r: Registration) => boolean, patch: Partial<Registration>) => {
    setRegs((prev) => prev.map((r) => predicate(r) ? { ...r, ...patch } : r));
    // Persist only if it's a localStorage registration (not mock)
    const realRegs = loadRegistrations();
    const updatedReal = realRegs.map((r) => predicate(r) ? { ...r, ...patch } : r);
    saveRegistrations(updatedReal);
  };
  return { regs, updateOne, refresh: () => setRegs([...MOCK_REGISTRATIONS, ...loadRegistrations()]) };
}

function useAllTrialProducts() {
  const [custom, setCustom] = useState<TrialProduct[]>(() => loadCustomProducts());
  const all = useMemo(() => [...TRIAL_PRODUCTS, ...custom], [custom]);
  const add = (p: TrialProduct) => {
    const next = [...custom, p];
    setCustom(next);
    saveCustomProducts(next);
  };
  const remove = (id: string) => {
    const next = custom.filter((p) => p.id !== id);
    setCustom(next);
    saveCustomProducts(next);
  };
  return { all, custom, add, remove };
}

// ============================================================================
//  KPIs — shared widget used by both overview tab and main dashboard
// ============================================================================

export function OwnerTrialsKpiStrip() {
  const { regs } = useAllRegistrations();
  const { all } = useAllTrialProducts();

  const pendingApproval = regs.filter((r) => getRegistrationStatus(r) === "pending_approval").length;
  const approved = regs.filter((r) => getRegistrationStatus(r) === "approved").length;
  const evaluated = regs.filter((r) => getRegistrationStatus(r) === "evaluated").length;

  const items = [
    { label: "สินค้าทดลอง",  value: `${all.length}`,        suffix: "รายการ", icon: FlaskConical, accent: "#319754" },
    { label: "ผู้สมัครรวม",   value: `${regs.length}`,       suffix: "คน",     icon: Users,        accent: "#0088ff" },
    { label: "รออนุมัติ",     value: `${pendingApproval}`,   suffix: "คน",     icon: AlertCircle,  accent: "#ef4444" },
    { label: "กำลังทดสอบ",   value: `${approved}`,          suffix: "คน",     icon: Clock,        accent: "#f59e0b" },
    { label: "ประเมินแล้ว",   value: `${evaluated}`,         suffix: "คน",     icon: Check,        accent: "#319754" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((s) => (
        <div key={s.label} className="bg-white rounded-[14px] border border-gray-200 p-3.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className={`${font} text-[11.5px] text-gray-500`} style={{ fontWeight: 500 }}>{s.label}</span>
            <div className="size-[28px] rounded-lg flex items-center justify-center" style={{ background: `${s.accent}15` }}>
              <s.icon className="size-[14px]" style={{ color: s.accent }} strokeWidth={2.4} />
            </div>
          </div>
          <p className={`${font} text-[20px] text-[#1a1a1a] tabular-nums leading-tight`} style={{ fontWeight: 700 }}>
            {s.value}
            {s.suffix && <span className={`${font} text-[11px] text-gray-500 ml-1`} style={{ fontWeight: 500 }}>{s.suffix}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
//  TAB 1 — OVERVIEW
// ============================================================================

export function OwnerTrialsOverview({ onGoTracking }: { onGoTracking: () => void }) {
  const { regs } = useAllRegistrations();
  const { all } = useAllTrialProducts();

  // Top trials by applicants
  const trialApplicants = useMemo(() => {
    const counts = new Map<string, number>();
    regs.forEach((r) => counts.set(r.trialId, (counts.get(r.trialId) || 0) + 1));
    return all
      .map((p) => ({ product: p, count: counts.get(p.id) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [regs, all]);

  // Recent registrations
  const recent = useMemo(
    () => [...regs].sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 6),
    [regs]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className={`${font} text-[22px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>ภาพรวมสินค้าทดลอง</h2>
        <p className={`${font} text-[13px] text-gray-500`}>สรุปสถิติโปรแกรมทดสอบและรายการล่าสุด</p>
      </div>

      <OwnerTrialsKpiStrip />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top trials chart */}
        <div className="bg-white rounded-[16px] border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${font} text-[15px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>สินค้าที่มีคนสมัครมากที่สุด</h3>
            <span className={`${font} text-[11px] text-gray-400`}>Top 5</span>
          </div>
          <div className="space-y-3">
            {trialApplicants.map(({ product, count }) => {
              const max = Math.max(1, ...trialApplicants.map((x) => x.count));
              const pct = (count / max) * 100;
              return (
                <div key={product.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${font} text-[12.5px] text-[#1a1a1a] truncate flex-1 mr-2`} style={{ fontWeight: 500 }}>{product.name}</span>
                    <span className={`${font} text-[12.5px] text-gray-600 tabular-nums shrink-0`} style={{ fontWeight: 600 }}>{count} คน</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #319754, #46c474)" }}
                    />
                  </div>
                </div>
              );
            })}
            {trialApplicants.every((x) => x.count === 0) && (
              <p className={`${font} text-[13px] text-gray-400 text-center py-6`}>ยังไม่มีผู้สมัคร</p>
            )}
          </div>
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-[16px] border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${font} text-[15px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>คำขอล่าสุด</h3>
            <button onClick={onGoTracking} className={`${font} text-[12px] text-[#319754] hover:underline cursor-pointer inline-flex items-center gap-1`} style={{ fontWeight: 500 }}>
              ดูทั้งหมด <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {recent.map((r, i) => {
              const product = all.find((p) => p.id === r.trialId);
              return (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-[10px] hover:bg-gray-50 transition-colors">
                  <div className="size-[36px] rounded-full bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
                    <span className={`${font} text-[12px] text-[#319754]`} style={{ fontWeight: 700 }}>{r.name.slice(0, 1)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }}>{r.name}</p>
                    <p className={`${font} text-[11px] text-gray-500 truncate`}>{product?.name || r.trialId}</p>
                  </div>
                  {r.evaluatedAt ? (
                    <span className={`${font} text-[10px] text-[#319754] bg-[#319754]/10 px-2 py-0.5 rounded-full shrink-0`} style={{ fontWeight: 600 }}>เสร็จ</span>
                  ) : (
                    <span className={`${font} text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0`} style={{ fontWeight: 600 }}>รอประเมิน</span>
                  )}
                </div>
              );
            })}
            {recent.length === 0 && (
              <p className={`${font} text-[13px] text-gray-400 text-center py-6`}>ยังไม่มีคำขอ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//  TAB 2 — TRACKING (registrations management)
// ============================================================================

export function OwnerTrialsTracking() {
  const { regs, updateOne } = useAllRegistrations();
  const { all } = useAllTrialProducts();

  type FilterKey = "all" | "pending_approval" | "approved" | "evaluated" | "rejected";
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const count = (s: RegistrationStatus) => regs.filter((r) => getRegistrationStatus(r) === s).length;

  const filtered = useMemo(() => {
    let result = regs.slice().sort((a, b) => b.submittedAt - a.submittedAt);
    if (filter !== "all") result = result.filter((r) => getRegistrationStatus(r) === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (all.find((p) => p.id === r.trialId)?.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [regs, filter, search, all]);

  const matchReg = (target: Registration) =>
    (r: Registration) => r.trialId === target.trialId && r.name === target.name && r.submittedAt === target.submittedAt;

  const approve = (reg: Registration) => {
    updateOne(matchReg(reg), { approvedAt: Date.now() });
    toast.success("อนุมัติคำขอเรียบร้อย", { description: `${reg.name} จะได้รับสินค้าทดสอบเร็ว ๆ นี้` });
  };
  const reject = (reg: Registration) => {
    if (!confirm(`ปฏิเสธคำขอของ "${reg.name}"?`)) return;
    updateOne(matchReg(reg), { rejectedAt: Date.now() });
    toast.success("ปฏิเสธคำขอเรียบร้อย");
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className={`${font} text-[22px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>ติดตามสินค้าทดลอง</h2>
        <p className={`${font} text-[13px] text-gray-500`}>จัดการคำขอเข้าร่วมและติดตามการประเมินของผู้ทดสอบ</p>
      </div>

      {/* Filters + search — single white pill (matches OwnerDashboard Orders style) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
          {([
            { key: "all" as const,              label: "ทั้งหมด",     count: regs.length,                  icon: FlaskConical },
            { key: "pending_approval" as const, label: "รออนุมัติ",   count: count("pending_approval"),    icon: AlertCircle },
            { key: "approved" as const,         label: "กำลังทดสอบ",  count: count("approved"),            icon: Clock },
            { key: "evaluated" as const,        label: "ประเมินแล้ว", count: count("evaluated"),           icon: Check },
            { key: "rejected" as const,         label: "ปฏิเสธ",      count: count("rejected"),            icon: Ban },
          ]).map((t) => {
            const isAct = filter === t.key;
            return (
              <motion.button key={t.key} onClick={() => setFilter(t.key)}
                whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                {isAct && (
                  <motion.span layoutId="ownerTrialTabActivePill"
                    className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                  transition={{ duration: 0.2 }}>
                  <t.icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                </motion.span>
                <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{t.label}</span>
                <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{t.count}</span>
              </motion.button>
            );
          })}
        </div>
        {/* Search (inside same pill) */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px] lg:ml-auto">
          <input
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาชื่อ, เบอร์, สินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Card list — mirrors OrdersTab OrderCard layout */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center justify-center gap-2">
          <FlaskConical className="size-10 text-gray-300" strokeWidth={1.5} />
          <p className={`${font} text-[14px] text-gray-400`}>ไม่มีรายการที่ตรงกับเงื่อนไข</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((r, i) => {
              const product = all.find((p) => p.id === r.trialId);
              return (
                <RegistrationCard
                  key={`${r.name}-${r.submittedAt}-${i}`}
                  reg={r}
                  product={product}
                  onApprove={() => approve(r)}
                  onReject={() => reject(r)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/** Status visual config — pill bg + text color + label */
const STATUS_CFG: Record<RegistrationStatus, { label: string; pillBg: string; pillText: string }> = {
  pending_approval: { label: "รออนุมัติ",   pillBg: "#ef4444", pillText: "#fff" },
  approved:         { label: "กำลังทดสอบ",  pillBg: "#f59e0b", pillText: "#fff" },
  evaluated:        { label: "ประเมินแล้ว", pillBg: "#319754", pillText: "#fff" },
  rejected:         { label: "ปฏิเสธ",      pillBg: "#6b7280", pillText: "#fff" },
};

function RegistrationCard({ reg, product, onApprove, onReject }: {
  reg: Registration;
  product: TrialProduct | undefined;
  onApprove: () => void;
  onReject: () => void;
}) {
  const status = getRegistrationStatus(reg);
  const cfg = STATUS_CFG[status];
  const submittedLabel = new Date(reg.submittedAt).toLocaleString("th-TH", { day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  const [showEval, setShowEval] = useState(false);

  const actions = (() => {
    switch (status) {
      case "pending_approval":
        return (
          <>
            <button onClick={onReject}
              className={`${font} border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
              <X className="size-3.5" strokeWidth={2.4} /> ปฏิเสธ
            </button>
            <button onClick={onApprove}
              className={`${font} bg-[#319754] hover:bg-[#287745] text-white h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}>
              <Check className="size-3.5" strokeWidth={2.6} /> อนุมัติ
            </button>
          </>
        );
      case "approved":
        return (
          <>
            <span className={`${font} text-[12px] text-amber-700 inline-flex items-center gap-1.5 mr-2`} style={{ fontWeight: 500 }}>
              <Clock className="size-3.5" strokeWidth={2.4} /> รอผู้ทดสอบส่งแบบประเมิน
            </span>
            <button
              className={`${font} border border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
              <Phone className="size-3.5" /> ติดต่อ
            </button>
            <button
              className={`${font} border border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
              <MessageCircle className="size-3.5" /> ส่งข้อความ
            </button>
          </>
        );
      case "evaluated":
        return (
          <>
            {reg.evaluation && (
              <div className={`${font} text-[12px] text-amber-700 inline-flex items-center gap-1.5 mr-2`} style={{ fontWeight: 600 }}>
                <Star className="size-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                {reg.evaluation.overall}/5
                <span className="text-gray-400 mx-1">·</span>
                {reg.evaluation.wouldRecommend ? (
                  <span className="text-[#319754] inline-flex items-center gap-0.5"><ThumbsUp className="size-3" strokeWidth={2.4} /> แนะนำ</span>
                ) : (
                  <span className="text-red-600 inline-flex items-center gap-0.5"><ThumbsDown className="size-3" strokeWidth={2.4} /> ไม่แนะนำ</span>
                )}
              </div>
            )}
            <button
              onClick={() => setShowEval(true)}
              disabled={!reg.evaluation}
              className={`${font} h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${
                reg.evaluation
                  ? "bg-[#319754] hover:bg-[#287745] text-white shadow-[0_2px_8px_rgba(49,151,84,0.25)]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}>
              <FileText className="size-3.5" strokeWidth={2.4} /> ดูแบบประเมิน
            </button>
          </>
        );
      case "rejected":
        return (
          <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1.5`} style={{ fontWeight: 500 }}>
            <Ban className="size-3.5" strokeWidth={2.4} /> คำขอถูกปฏิเสธ
          </span>
        );
    }
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all">
      {/* Header: applicant id + status pill | date */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-4 pt-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-[36px] rounded-full bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
            <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 700 }}>{reg.name.slice(0, 1)}</span>
          </div>
          <div className="min-w-0">
            <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }}>{reg.name}</p>
            <p className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1`}>
              <Phone className="size-3" strokeWidth={2.2} /> {reg.phone}
            </p>
          </div>
          <span className={`${font} text-[12px] px-4 py-1 rounded-full whitespace-nowrap ml-2`}
            style={{ backgroundColor: cfg.pillBg, color: cfg.pillText, fontWeight: 500 }}>
            {cfg.label}
          </span>
        </div>
        <span className={`${font} text-[12px] text-gray-500`}>{submittedLabel}</span>
      </div>

      {/* Body: product + address + motivation */}
      <div className="px-4 py-3 mt-2 flex flex-col gap-3">
        {/* Trial product row */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-[12px] p-3">
          <div className="size-[56px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
            {product && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{product?.category.toUpperCase()}</p>
            <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }}>{product?.name || reg.trialId}</p>
            <p className={`${font} text-[12px] text-gray-500 truncate`}>{product?.tagline}</p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className={`${font} text-[11px] text-gray-500`}>คะแนน</span>
            <span className={`${font} text-[14px] tabular-nums inline-flex items-center gap-0.5`} style={{ color: "#d97706", fontWeight: 700 }}>
              <Coins className="size-3.5" strokeWidth={2.4} />+{(product?.rewardPoints || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Address + Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px] text-gray-700">
          <div className="flex items-start gap-2">
            <MapPin className="size-3.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={2.2} />
            <div className="min-w-0">
              <p className={`${font} text-[11px] text-gray-500 mb-0.5`} style={{ fontWeight: 500 }}>ที่อยู่จัดส่ง</p>
              <p className={`${font} leading-relaxed`}>{reg.address || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageCircle className="size-3.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={2.2} />
            <div className="min-w-0">
              <p className={`${font} text-[11px] text-gray-500 mb-0.5`} style={{ fontWeight: 500 }}>เหตุผลในการขอ</p>
              <p className={`${font} leading-relaxed line-clamp-2`}>{reg.motivation || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: actions */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-2 flex-wrap bg-gray-50/30">
        {actions}
      </div>

      {/* Evaluation read-only modal */}
      <AnimatePresence>
        {showEval && reg.evaluation && product && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEval(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[20px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-[44px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>แบบประเมินจากผู้ทดสอบ</p>
                    <h2 className={`${font} text-[15px] text-[#1a1a1a] truncate`} style={{ fontWeight: 700 }}>{reg.name}</h2>
                    <p className={`${font} text-[11px] text-gray-500 truncate`}>{product.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowEval(false)} className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0">
                  <X className="size-[18px]" strokeWidth={2.4} />
                </button>
              </div>
              <div className="p-5">
                <EvaluationView evaluation={reg.evaluation} product={product} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`${font} text-[11px] text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap ${className || ""}`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{children}</th>;
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 ${className || ""}`}>{children}</td>;
}

// ============================================================================
//  TAB 3 — PRODUCTS REGISTRY
// ============================================================================

export function OwnerTrialsProducts({ onAddProduct }: { onAddProduct: () => void }) {
  const { all, custom, remove } = useAllTrialProducts();
  type ProductFilter = "all" | "active" | "ending_soon" | "closed";
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [search, setSearch] = useState("");

  const isClosed = (p: TrialProduct) => p.endsInDays <= 0 || p.spotsTotal - p.spotsTaken <= 0;
  const isEndingSoon = (p: TrialProduct) => !isClosed(p) && (p.spotsTotal - p.spotsTaken <= 10 || p.endsInDays <= 7);

  const counts = {
    all: all.length,
    active: all.filter((p) => !isClosed(p)).length,
    ending_soon: all.filter(isEndingSoon).length,
    closed: all.filter(isClosed).length,
  };

  const filtered = all.filter((p) => {
    if (filter === "active" && isClosed(p)) return false;
    if (filter === "ending_soon" && !isEndingSoon(p)) return false;
    if (filter === "closed" && !isClosed(p)) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>ทะเบียนสินค้าทดลอง</h2>
        <motion.button
          onClick={onAddProduct}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-1.5 sm:pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}>
          <span className="bg-white/22 size-[28px] rounded-full inline-flex items-center justify-center shrink-0">
            <Plus className="size-4" strokeWidth={2.6} />
          </span>
          <span className="hidden sm:inline" style={{ fontWeight: 600 }}>เพิ่มสินค้าทดลอง</span>
        </motion.button>
      </div>

      {/* Filter tabs + search — single white pill (matches OwnerDashboard Products/Orders) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 mb-6 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
          {([
            { key: "all" as const,          label: "ทั้งหมด",       count: counts.all,         icon: FlaskConical },
            { key: "active" as const,       label: "เปิดรับสมัคร",   count: counts.active,      icon: Check },
            { key: "ending_soon" as const,  label: "เกือบเต็ม",     count: counts.ending_soon, icon: Clock },
            { key: "closed" as const,       label: "ปิดรับ",        count: counts.closed,      icon: Ban },
          ]).map((t) => {
            const isAct = filter === t.key;
            return (
              <motion.button key={t.key} onClick={() => setFilter(t.key)}
                whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                {isAct && (
                  <motion.span layoutId="ownerTrialProductsActivePill"
                    className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                  transition={{ duration: 0.2 }}>
                  <t.icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                </motion.span>
                <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{t.label}</span>
                <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{t.count}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px] lg:ml-auto">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาชื่อสินค้า, หมวดหมู่..." />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table — matches OwnerDashboard products table style */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100">
              <tr>
                <Th>สินค้า</Th>
                <Th>หมวดหมู่</Th>
                <Th>ที่นั่ง</Th>
                <Th>เหลือเวลา</Th>
                <Th>คะแนน</Th>
                <Th>ที่มา</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const isCustomP = custom.some((c) => c.id === p.id);
                const spotsLeft = p.spotsTotal - p.spotsTaken;
                const pct = (p.spotsTaken / p.spotsTotal) * 100;
                const closed = isClosed(p);
                return (
                  <tr key={p.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                    <Td>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`relative size-[52px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 ${closed ? "grayscale opacity-60" : ""}`}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className={`${font} text-[14px] text-black truncate leading-tight`} style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className={`${font} text-[12px] text-gray-500 truncate max-w-[280px] mt-0.5`}>{p.tagline}</p>
                        </div>
                      </div>
                    </Td>
                    <Td><span className={`${font} text-[12.5px] text-gray-700`}>{p.category}</span></Td>
                    <Td>
                      <div className="flex flex-col gap-1 min-w-[110px]">
                        <span className={`${font} text-[12px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 600 }}>{p.spotsTaken}/{p.spotsTotal} ที่</span>
                        <div className="h-[4px] rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{
                            width: `${Math.min(100, pct)}%`,
                            background: pct >= 90 ? "#dc2626" : pct >= 60 ? "#f59e0b" : "#319754",
                          }} />
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className={`${font} text-[12.5px] inline-flex items-center gap-1 ${p.endsInDays <= 0 ? "text-red-600" : p.endsInDays <= 7 ? "text-amber-600" : "text-gray-700"}`} style={{ fontWeight: 500 }}>
                        <Clock className="size-3.5" strokeWidth={2.2} />
                        {p.endsInDays <= 0 ? "หมดเวลา" : `${p.endsInDays} วัน`}
                      </span>
                    </Td>
                    <Td>
                      <span className={`${font} text-[13px] tabular-nums inline-flex items-center gap-1`} style={{ color: "#d97706", fontWeight: 700 }}>
                        <Coins className="size-3.5" strokeWidth={2.4} />
                        +{p.rewardPoints.toLocaleString()}
                      </span>
                    </Td>
                    <Td>
                      {isCustomP ? (
                        <span className={`${font} text-[11px] text-[#0088ff] bg-[#0088ff]/10 px-2.5 py-1 rounded-full inline-flex items-center gap-1`} style={{ fontWeight: 600 }}>
                          <Sparkles className="size-3" strokeWidth={2.6} /> เพิ่มเอง
                        </span>
                      ) : (
                        <span className={`${font} text-[11px] text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full`} style={{ fontWeight: 500 }}>ระบบ</span>
                      )}
                    </Td>
                    <Td className="text-right">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="w-[230px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                        >
                          <motion.div
                            initial={{ scale: 0.4, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.4, opacity: 0, y: -6 }}
                            transition={{ type: "spring", stiffness: 380, damping: 26 }}
                            style={{ transformOrigin: "top right" }}
                            className="overflow-hidden"
                          >
                            {/* เปิดรับสมัคร toggle */}
                            <button
                              onClick={() => toast.success(closed ? `เปิดรับสมัคร: ${p.name}` : `ปิดรับสมัคร: ${p.name}`)}
                              className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เปิดรับสมัคร</span>
                              <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${!closed ? "bg-[#319754]" : "bg-gray-300"}`}>
                                <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${!closed ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                              </span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => toast.info(`แก้ไขสินค้า: ${p.name}`)}
                              disabled={!isCustomP}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] ${isCustomP ? "text-black hover:bg-gray-50 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}>
                              <Pencil className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>แก้ไข</span>
                            </button>
                            <button
                              onClick={() => toast.info(`ดูผู้สมัคร: ${p.name}`)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Users className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ดูผู้สมัคร ({p.spotsTaken} คน)</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => { if (!isCustomP) { toast.error("ลบได้เฉพาะสินค้าที่เพิ่มเอง"); return; } if (confirm(`ลบสินค้าทดลอง "${p.name}"?`)) { remove(p.id); toast.success(`ลบ: ${p.name}`); } }}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] ${isCustomP ? "text-[#ff3b30] hover:bg-[#ff3b30]/5 cursor-pointer" : "text-gray-300 cursor-not-allowed"}`}>
                              <Trash2 className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ลบ</span>
                            </button>
                          </motion.div>
                        </PopoverContent>
                      </Popover>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่มีรายการที่ตรงกับเงื่อนไข</p>
        )}
      </div>

    </div>
  );
}

/** Pre-built evaluation form templates by product type. Owner picks one (or "กำหนดเอง"). */
const EVAL_TEMPLATES: { key: string; label: string; criteria: string[] }[] = [
  { key: "skincare",      label: "🌸 บำรุงผิว/เครื่องสำอาง", criteria: ["กลิ่นและเนื้อสัมผัส", "การซึมสู่ผิว", "ความชุ่มชื้น/ความนุ่ม", "ผลลัพธ์ที่เห็นใน 14 วัน", "การระคายเคือง"] },
  { key: "beverage",      label: "🍵 เครื่องดื่ม/ชา",         criteria: ["รสชาติและความหอม", "ความสะดวกในการชง/ละลาย", "สี", "ความรู้สึกหลังดื่ม", "ผลข้างเคียง"] },
  { key: "food",          label: "🍴 อาหาร",                 criteria: ["รสชาติ", "เนื้อสัมผัส", "กลิ่นและสี", "ความสดและคุณภาพ", "บรรจุภัณฑ์และความสะดวก"] },
  { key: "supplement",    label: "💊 อาหารเสริม/แคปซูล",      criteria: ["ขนาด/กลิ่น/รสของเม็ด", "ความสะดวกในการกลืน", "ผลที่รู้สึกได้", "ผลข้างเคียง", "ความถี่ในการใช้"] },
  { key: "oil",           label: "💧 น้ำมันสกัด",             criteria: ["กลิ่นและรสชาติ", "ความใสและสี", "การใช้กับอาหาร", "การดูดซึมบนผิว", "ความคงตัวที่อุณหภูมิห้อง"] },
  { key: "aroma",         label: "🌬️ ผ่อนคลาย/Aromatherapy",   criteria: ["กลิ่นและความเข้มข้น", "ผลต่อการผ่อนคลาย", "ระยะเวลาที่กลิ่นคงอยู่", "ความสะดวกในการใช้"] },
  { key: "perfume",       label: "🌹 น้ำหอม",                 criteria: ["Top note (แรกฉีด)", "Middle note (1 ชม.)", "Base note (4 ชม.+)", "ความติดทนของกลิ่น", "บรรจุภัณฑ์/ขวด"] },
  { key: "haircare",      label: "💆 บำรุงผม",               criteria: ["ความถี่ของผมร่วงใน 30 วัน", "ความหนา/ความเงาของเส้นผม", "ความสะอาดของหนังศีรษะ", "กลิ่นและเนื้อสัมผัส", "การระคายหนังศีรษะ"] },
  { key: "bodycare",      label: "🛁 ดูแลร่างกาย",            criteria: ["กลิ่นและเนื้อสัมผัส", "ความสบาย/ความเย็น", "ประสิทธิภาพในการบรรเทาอาการ", "การระคายผิว", "ความสะดวกในการใช้"] },
  { key: "oralcare",      label: "🦷 ดูแลช่องปาก",            criteria: ["รสชาติและฟอง", "ความสะอาดและความรู้สึกหลังใช้", "ผลต่อเหงือก/ฟัน", "กลิ่นปาก", "การระคายเคือง"] },
  { key: "household",     label: "🧹 ทำความสะอาด/ของใช้ในบ้าน", criteria: ["กลิ่น", "ประสิทธิภาพในการทำความสะอาด", "ความปลอดภัยกับเด็ก/สัตว์", "ปริมาณที่ใช้ต่อครั้ง", "บรรจุภัณฑ์"] },
];

/** Map สินค้า category → default template key */
const CATEGORY_TO_TEMPLATE: Record<string, string> = {
  "บำรุงผิว": "skincare",
  "เครื่องดื่ม": "beverage",
  "อาหารเสริม": "supplement",
  "น้ำมันสกัด": "oil",
  "ผ่อนคลาย": "aroma",
  "บำรุงผม": "haircare",
  "ดูแลร่างกาย": "bodycare",
  "ดูแลช่องปาก": "oralcare",
};

export function AddTrialProductTab({ onBack }: { onBack: () => void }) {
  const { add } = useAllTrialProducts();
  const onSave = (p: TrialProduct) => { add(p); toast.success("เพิ่มสินค้าทดลองเรียบร้อย", { description: p.name }); onBack(); };
  return <AddTrialProductForm onBack={onBack} onSave={onSave} />;
}

function AddTrialProductForm({ onBack, onSave }: { onBack: () => void; onSave: (p: TrialProduct) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("บำรุงผิว");
  const [tagline, setTagline] = useState("");
  // 3 image slots — slot 0 = primary, used as the main `image`; all stored in `images[]`
  const [productImages, setProductImages] = useState<(string | null)[]>([
    "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=800&q=80", null, null,
  ]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const triggerImageUpload = (slot: number) => { setUploadingSlot(slot); imageInputRef.current?.click(); };
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const slot = uploadingSlot;
    setUploadingSlot(null);
    if (!file || slot === null) return;
    const result = await readImageFile(file, { maxWidth: 1200, quality: 0.85 });
    if (!result.ok) { toast.error(result.error); return; }
    setProductImages((prev) => prev.map((v, i) => i === slot ? result.dataUrl : v));
    toast.success("เพิ่มรูปสินค้าแล้ว");
  };
  const removeImage = (slot: number) => setProductImages((prev) => prev.map((v, i) => i === slot ? null : v));
  const image = productImages[0] || "";
  const [spotsTotal, setSpotsTotal] = useState(50);
  const [endsInDays, setEndsInDays] = useState(14);
  const [rewardPoints, setRewardPoints] = useState(200);
  // Initial template derived from default category
  const initialTplKey = CATEGORY_TO_TEMPLATE[category] || "custom";
  const initialTpl = EVAL_TEMPLATES.find((t) => t.key === initialTplKey);
  const [whatToTestText, setWhatToTestText] = useState<string>(
    initialTpl ? initialTpl.criteria.join("\n") : "กลิ่นและเนื้อสัมผัส\nผลลัพธ์ใน 14 วัน\nการระคายเคือง"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTplKey);

  // When category changes, auto-apply the matching template (overrides current selection)
  useEffect(() => {
    const suggested = CATEGORY_TO_TEMPLATE[category];
    if (!suggested) return;
    const tpl = EVAL_TEMPLATES.find((t) => t.key === suggested);
    if (tpl) {
      setWhatToTestText(tpl.criteria.join("\n"));
      setSelectedTemplate(tpl.key);
    }
  }, [category]);

  const applyTemplate = (key: string) => {
    const tpl = EVAL_TEMPLATES.find((t) => t.key === key);
    if (!tpl) return;
    setWhatToTestText(tpl.criteria.join("\n"));
    setSelectedTemplate(key);
  };

  // Per-section validation
  const infoValid = name.trim().length >= 3 && tagline.trim().length >= 5 && rewardPoints > 0;
  const imageValid = image.trim().length > 0;
  const conditionsValid = spotsTotal > 0 && endsInDays > 0;
  const criteriaValid = whatToTestText.split("\n").map((s) => s.trim()).filter(Boolean).length > 0;
  const canSave = infoValid && conditionsValid && criteriaValid;

  // Sections for the step-progress sidebar (รูปภาพสินค้าอยู่บนสุด — เหมือนหน้าเพิ่มสินค้า)
  const sections: { id: string; label: string; required: boolean; valid: boolean }[] = [
    { id: "image",      label: "รูปภาพสินค้า",      required: false, valid: imageValid },
    { id: "info",       label: "ข้อมูลพื้นฐาน",     required: true,  valid: infoValid },
    { id: "conditions", label: "เงื่อนไขการทดสอบ",  required: true,  valid: conditionsValid },
    { id: "criteria",   label: "สิ่งที่ต้องประเมิน",  required: true,  valid: criteriaValid },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  const scrollToSection = (id: string, idx: number) => {
    setActiveStep(idx);
    setMaxVisitedStep((p) => Math.max(p, idx));
    document.getElementById(`trialprod-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const id = visible[0].target.id.replace("trialprod-", "");
          const idx = ids.indexOf(id);
          if (idx >= 0) {
            setActiveStep(idx);
            setMaxVisitedStep((p) => Math.max(p, idx));
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(`trialprod-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleSave = () => {
    if (!canSave) { toast.error("กรอกข้อมูลให้ครบและถูกต้อง"); return; }
    const gallery = productImages.filter((x): x is string => !!x);
    const p: TrialProduct = {
      id: `trial-custom-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      image: gallery[0] || "",
      images: gallery.length > 1 ? gallery : undefined,
      spotsTotal,
      spotsTaken: 0,
      endsInDays,
      rewardPoints,
      whatToTest: whatToTestText.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    onSave(p);
  };

  return (
    <div className="flex items-start gap-4">
      {/* Left content */}
      <div className="flex-1 min-w-0">
        {/* Top bar — back button (matches AddProductTab) */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button onClick={onBack}
            className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            <ChevronLeft className="size-3.5" strokeWidth={2.5} /> กลับ
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <h2 className={`${font} text-[20px] text-black leading-[30px]`} style={{ fontWeight: 500 }}>เพิ่มสินค้าทดลองใหม่</h2>
        </div>

        <div className="space-y-4">
        {/* Section: รูปภาพสินค้า — 3 slots like AddProductTab */}
        <section id="trialprod-image" onMouseEnter={() => { setActiveStep(0); setMaxVisitedStep((p) => Math.max(p, 0)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Package className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>รูปภาพสินค้า</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>อัปโหลดได้สูงสุด 3 รูป (JPG, PNG, WebP) ขนาดไม่เกิน 2MB</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="flex flex-wrap gap-3">
            {[
              { label: "รูปปกสินค้า", sub: "รูปหลัก", primary: true },
              { label: "รูป 2", sub: "เพิ่มเติม", primary: false },
              { label: "รูป 3", sub: "เพิ่มเติม", primary: false },
            ].map((item, slot) => {
              const uploaded = productImages[slot];
              return (
                <motion.button key={item.label} type="button"
                  onClick={() => triggerImageUpload(slot)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group/upload relative bg-gradient-to-br from-gray-50 to-gray-100/60 border-2 border-dashed rounded-2xl size-[150px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shrink-0 overflow-hidden ${
                    uploaded
                      ? "border-[#319754] from-white to-white"
                      : item.primary
                        ? "border-[#319754]/40 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10"
                        : "border-gray-300 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10"
                  }`}>
                  {uploaded ? (
                    <>
                      <img src={uploaded} alt={item.label} className="absolute inset-0 w-full h-full object-cover" />
                      {item.primary && (
                        <span className={`${font} absolute top-2 right-2 text-[9px] bg-[#319754] text-white px-2 py-0.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)]`} style={{ fontWeight: 600 }}>หลัก</span>
                      )}
                      <span
                        onClick={(e) => { e.stopPropagation(); removeImage(slot); }}
                        role="button"
                        className="absolute top-2 left-2 size-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="ลบรูป">
                        <X className="size-3.5" strokeWidth={2.4} />
                      </span>
                    </>
                  ) : (
                    <>
                      {item.primary && (
                        <span className={`${font} absolute top-2 right-2 text-[9px] bg-[#319754] text-white px-2 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>หลัก</span>
                      )}
                      <div className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-transform group-hover/upload:scale-110 group-hover/upload:rotate-90 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                        <Plus className="size-4 text-gray-500 group-hover/upload:text-[#319754] transition-colors" strokeWidth={2.4} />
                      </div>
                      <div className="text-center px-2">
                        <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>{item.label}</p>
                        <p className={`${font} text-[10px] text-gray-400 mt-0.5`}>{item.sub}</p>
                      </div>
                    </>
                  )}
                </motion.button>
              );
            })}
            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageFile} />
          </div>
        </section>

        {/* Section: ข้อมูลพื้นฐาน — mirrors AddProductTab info layout (3-col grid + pill inputs) */}
        <section id="trialprod-info" onMouseEnter={() => { setActiveStep(1); setMaxVisitedStep((p) => Math.max(p, 1)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <FileText className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <h3 className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>ข้อมูลสินค้า</h3>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ชื่อสินค้าทดลอง <span className="text-[#ff3b30]">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น: เซรั่มขมิ้นชัน Brightening v3"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>หมวดหมู่ <span className="text-[#ff3b30]">*</span></label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-6 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow appearance-none cursor-pointer`}>
                  {["บำรุงผิว","เครื่องดื่ม","ดูแลร่างกาย","อาหารเสริม","น้ำมันสกัด","ผ่อนคลาย","ดูแลช่องปาก","บำรุงผม"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="size-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>คะแนนที่ผู้ทดสอบจะได้รับ <span className="text-[#ff3b30]">*</span></label>
              <input type="number" value={String(rewardPoints)} onChange={(e) => setRewardPoints(Number(e.target.value) || 0)} placeholder="200"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            {/* Row 2 — Tagline spans all 3 columns */}
            <div className="flex flex-col gap-2 md:col-span-3">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>คำอธิบายสั้น <span className="text-[#ff3b30]">*</span></label>
              <textarea rows={3} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="เช่น: สูตรใหม่ลดความหมอง — รอผลตอบรับก่อนเปิดขายจริง"
                className={`${font} bg-[#fafafa] w-full rounded-2xl px-6 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] resize-none`} />
            </div>
          </div>
        </section>

        {/* Section: เงื่อนไขการทดสอบ */}
        <section id="trialprod-conditions" onMouseEnter={() => { setActiveStep(2); setMaxVisitedStep((p) => Math.max(p, 2)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>เงื่อนไขการทดสอบ</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>จำนวนผู้ทดสอบและระยะเวลาเปิดรับสมัคร</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="จำนวนที่นั่ง *" type="number" value={String(spotsTotal)} onChange={(v) => setSpotsTotal(Number(v) || 0)} placeholder="50" />
            <Input label="ระยะเวลาเปิดรับสมัคร (วัน) *" type="number" value={String(endsInDays)} onChange={(v) => setEndsInDays(Number(v) || 0)} placeholder="14" />
          </div>
        </section>

        {/* Section: สิ่งที่ต้องประเมิน */}
        <section id="trialprod-criteria" onMouseEnter={() => { setActiveStep(3); setMaxVisitedStep((p) => Math.max(p, 3)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Check className="size-5 text-[#319754]" strokeWidth={2.4} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>สิ่งที่ต้องประเมิน</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>เกณฑ์ที่ผู้ทดสอบต้องให้คะแนน (1 บรรทัด = 1 ข้อ)</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          {/* Template chips — document-style file cards */}
          <div className="mb-4">
            <label className={`${font} text-[14px] block mb-2.5`} style={{ fontWeight: 500 }}>เลือกแบบฟอร์มประเมินสำเร็จรูป</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {EVAL_TEMPLATES.map((t) => {
                const isActive = selectedTemplate === t.key;
                const title = t.label.replace(/^\p{Emoji}\s*/u, "");
                return (
                  <motion.button key={t.key} type="button"
                    onClick={() => applyTemplate(t.key)}
                    whileTap={{ scale: 0.97 }}
                    whileHover={{ y: -2 }}
                    className={`${font} group/doc relative bg-white border-2 rounded-[14px] p-3 cursor-pointer transition-all text-left overflow-hidden ${
                      isActive
                        ? "border-[#319754] shadow-[0_4px_12px_-2px_rgba(49,151,84,0.25)]"
                        : "border-gray-200 hover:border-[#319754]/40 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                    }`}>
                    {/* Document corner fold */}
                    <span aria-hidden className={`absolute top-0 right-0 size-[18px] ${isActive ? "bg-[#319754]/15" : "bg-gray-100 group-hover/doc:bg-[#319754]/10"} transition-colors`}
                      style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
                    {/* Selected check */}
                    {isActive && (
                      <span className="absolute top-1.5 right-1.5 size-[16px] rounded-full bg-[#319754] flex items-center justify-center">
                        <Check className="size-[10px] text-white" strokeWidth={3} />
                      </span>
                    )}
                    {/* File icon */}
                    <div className="flex items-start gap-2.5 mb-2">
                      <div className={`size-[36px] rounded-[8px] flex items-center justify-center shrink-0 transition-colors ${
                        isActive ? "bg-[#319754]/10" : "bg-gray-50 group-hover/doc:bg-[#319754]/5"
                      }`}>
                        <FileText className={`size-[18px] transition-colors ${isActive ? "text-[#319754]" : "text-gray-400 group-hover/doc:text-[#319754]"}`} strokeWidth={2} />
                      </div>
                      <p className={`${font} text-[12.5px] leading-tight pt-0.5`} style={{ color: isActive ? "#1d5b32" : "#1a1a1a", fontWeight: isActive ? 700 : 600 }}>{title}</p>
                    </div>
                    <p className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{t.criteria.length} ข้อประเมิน</p>
                  </motion.button>
                );
              })}
              {/* Custom card */}
              <motion.button type="button"
                onClick={() => setSelectedTemplate("custom")}
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -2 }}
                className={`${font} group/doc relative bg-white border-2 border-dashed rounded-[14px] p-3 cursor-pointer transition-all text-left ${
                  selectedTemplate === "custom"
                    ? "border-gray-400 bg-gray-50"
                    : "border-gray-200 hover:border-gray-400"
                }`}>
                <div className="flex items-start gap-2.5 mb-2">
                  <div className="size-[36px] rounded-[8px] bg-gray-100 flex items-center justify-center shrink-0">
                    <Pencil className="size-[16px] text-gray-500" strokeWidth={2.2} />
                  </div>
                  <p className={`${font} text-[12.5px] text-gray-700 leading-tight pt-0.5`} style={{ fontWeight: selectedTemplate === "custom" ? 700 : 600 }}>กำหนดเอง</p>
                </div>
                <p className={`${font} text-[10.5px] text-gray-400`}>เริ่มจากศูนย์</p>
              </motion.button>
            </div>
            <p className={`${font} text-[12px] text-gray-500 mt-2.5`}>เลือกฟอร์มที่ตรงกับสินค้า แล้วปรับข้อประเมินด้านล่างได้</p>
          </div>
          <Textarea label="เกณฑ์ทั้งหมด (1 บรรทัด = 1 ข้อ)" value={whatToTestText} onChange={(v) => { setWhatToTestText(v); setSelectedTemplate("custom"); }} rows={6} placeholder="กลิ่นและเนื้อสัมผัส&#10;ผลลัพธ์ใน 14 วัน&#10;การระคายเคือง" />
        </section>

        </div>
      </div>

      {/* Right sidebar — sticky stepper + action buttons (matches AddProductTab) */}
      <aside className="w-[240px] shrink-0 sticky top-0 hidden lg:block">
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col">
          <p className={`${font} text-[11px] text-[#8e8e93] uppercase tracking-wider mb-4`} style={{ fontWeight: 600 }}>ขั้นตอนการเพิ่มสินค้า</p>
          {sections.map((s, i) => {
            const isActive = activeStep === i;
            const isLast = i === sections.length - 1;
            const isVisited = i <= maxVisitedStep;
            const showError = !isActive && isVisited && s.required && !s.valid;
            const showDone  = !isActive && isVisited && s.valid;
            return (
              <div key={s.id}>
                <motion.button onClick={() => scrollToSection(s.id, i)}
                  whileTap={{ scale: 0.98 }}
                  className={`${font} relative flex items-center gap-3 text-[14px] cursor-pointer w-full text-left rounded-xl px-2.5 py-2 transition-colors ${
                    isActive ? "" : "hover:bg-gray-50"
                  }`}>
                  {isActive && (
                    <motion.span layoutId="trialprod-step-pill"
                      className="absolute inset-0 bg-[#319754]/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <motion.span
                    initial={false}
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={isActive ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                    className={`relative size-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      showDone   ? "bg-[#319754] shadow-[0_2px_4px_rgba(49,151,84,0.25)]"
                      : showError ? "bg-[#ff3b30] shadow-[0_2px_4px_rgba(255,59,48,0.25)]"
                      : isActive  ? "bg-white border-2 border-[#319754] shadow-[0_0_0_3px_rgba(49,151,84,0.15)]"
                      :             "bg-white border-2 border-gray-300"
                    }`}>
                    {showDone   ? <Check className="size-3 text-white" strokeWidth={3} />
                    : showError ? <AlertCircle className="size-3 text-white" strokeWidth={3} fill="transparent" />
                    : isActive  ? <span className="size-1.5 rounded-full bg-[#319754]" />
                    : null}
                  </motion.span>
                  <span className={`relative ${
                    isActive  ? "text-[#319754]"
                    : showDone  ? "text-gray-700"
                    : showError ? "text-[#ff3b30]"
                    :             "text-[#8e8e93]"
                  }`} style={{ fontWeight: isActive ? 600 : (showDone || showError) ? 500 : 400 }}>
                    {s.label}
                  </span>
                </motion.button>
                {!isLast && (
                  <div className={`ml-[18px] my-0.5 w-0.5 h-3 rounded-full transition-colors ${
                    showDone ? "bg-[#319754]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="h-px bg-gray-100 my-4" />
          <div className="flex flex-col gap-2">
            <button onClick={handleSave} disabled={!canSave}
              className={`${font} h-[44px] rounded-full text-white text-[14px] transition-colors ${canSave ? "bg-[#319754] hover:bg-[#267a43] cursor-pointer shadow-[0_4px_14px_-2px_rgba(49,151,84,0.4)]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              style={{ fontWeight: 600 }}>
              บันทึกสินค้า
            </button>
            <button onClick={onBack}
              className={`${font} h-[44px] rounded-full border border-[#ff3b30] text-[#ff3b30] text-[14px] hover:bg-[#ff3b30]/5 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

/** Pill input — matches AddProductTab style */
function Input({ label, value, onChange, placeholder, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
    </div>
  );
}
function Select({ label, value, onChange, options, required = false }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-6 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow appearance-none cursor-pointer`}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="size-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
      </div>
    </div>
  );
}
function Textarea({ label, value, onChange, rows = 3, placeholder, required = false }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
          {label} {required && <span className="text-[#ff3b30]">*</span>}
        </label>
      )}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className={`${font} bg-[#fafafa] w-full rounded-2xl px-6 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] resize-none leading-relaxed`} />
    </div>
  );
}
