import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { readImageFile } from "../../data/imageUpload";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical, Users, Coins, Check, Clock, ChevronLeft, ChevronRight, Search, Plus, X,
  ArrowUpRight, Calendar, Sparkles, Trash2, Edit3, MapPin, AlertCircle, Phone, MessageCircle, Ban,
  MoreHorizontal, Pencil, EyeOff, Eye, Star, FileText, ThumbsUp, ThumbsDown, Package, ChevronDown,
  Beaker, ShieldCheck, Upload, Info, BarChart3, Lock, ArrowDownToLine, Download, FileSpreadsheet,
} from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import genderWomenImg from "../../../assets/women.png";
import genderMenImg from "../../../assets/men.png";
import genderLgbtqImg from "../../../assets/LGBTQ+.png";
import genderOtherImg from "../../../assets/other.png";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
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
  { trialId: "trial-2",  name: "ปัญญา สุขสบาย",     phone: "082-100-9988", address: "22/8 พหลโยธิน 24 จตุจักร กทม. 10900",       motivation: "นอนไม่หลับเรื้อรัง ต้องการตัวช่วยจากธรรมชาติ",  submittedAt: Date.now() - 1 * 86400000, gender: "female", ageRange: "35-44" },
  { trialId: "trial-6",  name: "ดวงใจ พรหมเดช",     phone: "081-888-9911", address: "120/3 ถ.รัชดา ห้วยขวาง กทม. 10310",          motivation: "ทำงานออฟฟิศ ปวดเมื่อยทุกวัน",                  submittedAt: Date.now() - 1 * 86400000, gender: "female", ageRange: "25-34" },
  { trialId: "trial-9",  name: "สรพล ศรีจันทร์",     phone: "082-555-3344", address: "29 ลาดพร้าว 71 วังทองหลาง กทม. 10310",      motivation: "ผมร่วงเยอะมาก ขอลองดู",                         submittedAt: Date.now() - 2 * 86400000, gender: "male",   ageRange: "35-44" },
  { trialId: "trial-13", name: "อนุชา รุ่งเรือง",   phone: "081-555-8899", address: "77 พหลโยธิน 35 จตุจักร กทม. 10900",          motivation: "ผิวมัน หาครีมกันแดดที่ไม่ทำให้มันเพิ่ม",        submittedAt: Date.now() - 1 * 86400000, gender: "male",   ageRange: "25-34" },

  // 3 approved (waiting for evaluation submission)
  { trialId: "trial-1",  name: "นภัสวรรณ สุขดี",   phone: "081-234-1100", address: "10/2 ถ.พระราม 9 บางกะปิ กทม. 10240",         motivation: "อยากลองสูตรใหม่ — เคยใช้สูตรเก่าแล้วชอบ",       submittedAt: Date.now() - 4 * 86400000, approvedAt: Date.now() - 3 * 86400000, gender: "female", ageRange: "25-34" },
  { trialId: "trial-3",  name: "วิภาวดี ทองดี",     phone: "088-222-4455", address: "73 ม.1 สันทราย เชียงใหม่ 50210",              motivation: "ปวดข้อเรื้อรัง ลองครีมบรรเทา",                  submittedAt: Date.now() - 5 * 86400000, approvedAt: Date.now() - 4 * 86400000, gender: "female", ageRange: "55+" },
  { trialId: "trial-7",  name: "ภัทรภร โสภณ",       phone: "083-444-1122", address: "8 ม.4 ปากเกร็ด นนทบุรี 11120",              motivation: "ผิวบอบบาง อยากลองสครับธรรมชาติ",                submittedAt: Date.now() - 6 * 86400000, approvedAt: Date.now() - 5 * 86400000, gender: "female", ageRange: "15-24" },

  // 4 evaluated (full cycle done) — with sample evaluation data
  { trialId: "trial-1",  name: "อรอนงค์ เจริญสุข", phone: "089-555-2200", address: "55 ม.5 บางใหญ่ นนทบุรี 11140",               motivation: "ผิวมีปัญหารอยดำ อยากลองดูว่าจะช่วยได้ไหม",      submittedAt: Date.now() - 12 * 86400000, approvedAt: Date.now() - 11 * 86400000, evaluatedAt: Date.now() - 1 * 86400000,
    gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 4, "การระคายเคือง": 5 }, comment: "เนื้อบางซึมไว ใช้ครบ 2 สัปดาห์เห็นรอยดำจางลงชัดเจน กลิ่นขมิ้นอ่อน ไม่ฉุนเหมือนสูตรเก่า แนะนำเพื่อนแล้ว!", wouldRecommend: true } },
  { trialId: "trial-2",  name: "สมรัก ใจเย็น",       phone: "086-777-3300", address: "9/14 ถ.บางนา บางพลี สมุทรปราการ 10540",      motivation: "อยากลดยานอนหลับ ลองสมุนไพรก่อน",                submittedAt: Date.now() - 15 * 86400000, approvedAt: Date.now() - 14 * 86400000, evaluatedAt: Date.now() - 2 * 86400000,
    gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: { "ผลต่อการนอน 7 คืน": 4, "รสชาติ": 3, "ความสะดวกในการชง": 5 }, comment: "นอนหลับลึกขึ้นจริงๆ ตื่นมาสดชื่น แต่รสติดขมไปนิด อยากให้เพิ่มกลิ่นวานิลลาหรือน้ำผึ้งหน่อย", wouldRecommend: true } },
  { trialId: "trial-5",  name: "กิตติศักดิ์ พงษ์ดี", phone: "087-333-6677", address: "44/9 สุขุมวิท 31 วัฒนา กทม. 10110",           motivation: "ทำอาหารคลีน อยากลองน้ำมันสกัดเย็น",             submittedAt: Date.now() - 18 * 86400000, approvedAt: Date.now() - 17 * 86400000, evaluatedAt: Date.now() - 3 * 86400000,
    gender: "male", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "รสชาติ": 5, "การดูดซึมบนผิว": 4, "ความคงตัวที่อุณหภูมิห้อง": 5 }, comment: "กลิ่นหอมมากกว่าน้ำมันมะพร้าวสกัดร้อนชัดเจน ใช้ทำน้ำสลัดอร่อย ทาผิวก็เข้าผิวไว", wouldRecommend: true } },
  { trialId: "trial-8",  name: "นเรศ ภูศิริ",        phone: "089-666-7788", address: "302/8 ถ.บางขุนเทียน บางขุนเทียน กทม. 10150",  motivation: "อยากเลิกใช้ฟลูออไรด์ ขอลองสูตรขมิ้น-เกลือ",     submittedAt: Date.now() - 20 * 86400000, approvedAt: Date.now() - 19 * 86400000, evaluatedAt: Date.now() - 1 * 86400000,
    gender: "male", ageRange: "35-44",
    evaluation: { overall: 3, criteria: { "รสชาติ": 2, "ความสะอาด": 4, "ผลต่อเหงือก": 4 }, comment: "ฟันสะอาดดี เหงือกไม่บวม แต่รสเค็มจัดมาก ใช้ครั้งแรกอึ้งไปเลย อยากให้ปรับปริมาณเกลือลง", wouldRecommend: false } },
  { trialId: "trial-12", name: "พิมพ์ใจ บุญมา",     phone: "088-999-2255", address: "5/3 ถ.เทพารักษ์ บางพลี สมุทรปราการ 10540",    motivation: "อยากลดน้ำหนัก ลองชาดู",                          submittedAt: Date.now() - 22 * 86400000, approvedAt: Date.now() - 21 * 86400000, evaluatedAt: Date.now() - 4 * 86400000,
    gender: "female", ageRange: "25-34",
    evaluation: { overall: 4, criteria: { "น้ำหนักก่อน/หลัง": 4, "อาการข้างเคียง": 5, "รสชาติ": 4 }, comment: "ลดได้ 2 กก. ใน 14 วัน ไม่มีอาการใจสั่น ท้องไม่ปวด ดีกว่าชาลดน้ำหนักยี่ห้ออื่นที่เคยลอง", wouldRecommend: true } },

  // 1 rejected
  { trialId: "trial-4",  name: "สุชาติ จันทร์ฉาย",   phone: "087-111-2233", address: "100/5 รามอินทรา 65 บางเขน กทม. 10220",       motivation: "อยากลอง",                                          submittedAt: Date.now() - 7 * 86400000, rejectedAt: Date.now() - 6 * 86400000, gender: "male", ageRange: "55+" },

  // ========== Rich evaluation dataset for trial-1 (เซรั่มขมิ้นชัน Brightening v2) ==========
  // 14 more evaluated testers with varied demographics + ratings — drives the dashboard analytics
  { trialId: "trial-1", name: "ธัญลักษณ์ ศิริมงคล", phone: "081-220-3344", address: "88 ลาดพร้าว 122 วังทองหลาง กทม. 10310", motivation: "ผิวหมองคล้ำ อยากให้กระจ่างขึ้น",
    submittedAt: Date.now() - 14*86400000, approvedAt: Date.now() - 13*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 5, "การระคายเคือง": 5 }, comment: "ผิวกระจ่างใสขึ้นจริง ไม่แห้ง", wouldRecommend: true } },
  { trialId: "trial-1", name: "พรพิมล แสงทอง", phone: "082-441-5566", address: "12 รามคำแหง 24 หัวหมาก กทม. 10240", motivation: "ทดสอบสูตรใหม่",
    submittedAt: Date.now() - 13*86400000, approvedAt: Date.now() - 12*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "กลิ่นและเนื้อสัมผัส": 4, "ผลลัพธ์ใน 14 วัน": 4, "การระคายเคือง": 5 }, comment: "เห็นผลช้านิด แต่ไม่ระคายเคืองดีมาก", wouldRecommend: true } },
  { trialId: "trial-1", name: "สมชาย ใจดี", phone: "083-555-7788", address: "44/12 สุขุมวิท 71 พระโขนง กทม. 10110", motivation: "ลองดู เผื่อช่วยรอยสิว",
    submittedAt: Date.now() - 12*86400000, approvedAt: Date.now() - 11*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 4, "ผลลัพธ์ใน 14 วัน": 5, "การระคายเคือง": 5 }, comment: "ครีมซึมไว ผิวเนียนขึ้น", wouldRecommend: true } },
  { trialId: "trial-1", name: "ฉัตรชัย พงศ์ดี", phone: "081-660-2244", address: "5 ม.7 บางพลี สมุทรปราการ 10540", motivation: "ฝ้ากระเยอะ ลองสูตรขมิ้น",
    submittedAt: Date.now() - 11*86400000, approvedAt: Date.now() - 10*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 3, criteria: { "กลิ่นและเนื้อสัมผัส": 3, "ผลลัพธ์ใน 14 วัน": 3, "การระคายเคือง": 4 }, comment: "พอใช้ ฝ้ายังไม่จาง", wouldRecommend: false } },
  { trialId: "trial-1", name: "ปิยะดา รักษ์ไพร", phone: "084-118-3322", address: "77 บางนา-ตราด กม.3 บางนา กทม. 10260", motivation: "ผิวแห้งช่วงหน้าหนาว",
    submittedAt: Date.now() - 10*86400000, approvedAt: Date.now() - 9*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "45-54",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 5, "การระคายเคือง": 5 }, comment: "ผิวชุ่มชื้น เห็นผลใน 1 สัปดาห์", wouldRecommend: true } },
  { trialId: "trial-1", name: "เบญจมาศ วงศ์ทอง", phone: "086-227-9911", address: "99/3 ม.5 สันป่าตอง เชียงใหม่ 50120", motivation: "ทดสอบสูตรสมุนไพรไทย",
    submittedAt: Date.now() - 9*86400000, approvedAt: Date.now() - 8*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "55+",
    evaluation: { overall: 4, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 3, "การระคายเคือง": 4 }, comment: "กลิ่นหอม ใช้ง่าย", wouldRecommend: true } },
  { trialId: "trial-1", name: "นิติพงษ์ ปานทอง", phone: "082-998-4455", address: "23 รามอินทรา 8 บางเขน กทม. 10220", motivation: "อายุน้อย ผิวเริ่มไม่ดี",
    submittedAt: Date.now() - 9*86400000, approvedAt: Date.now() - 8*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "male", ageRange: "15-24",
    evaluation: { overall: 4, criteria: { "กลิ่นและเนื้อสัมผัส": 4, "ผลลัพธ์ใน 14 วัน": 4, "การระคายเคือง": 5 }, comment: "เหมาะกับวัยรุ่น ไม่มัน", wouldRecommend: true } },
  { trialId: "trial-1", name: "กฤษณา ทองดี", phone: "088-771-3300", address: "11/9 ลาดพร้าว 80 วังทองหลาง กทม. 10310", motivation: "อยากลองสูตรไม่มีพาราเบน",
    submittedAt: Date.now() - 8*86400000, approvedAt: Date.now() - 7*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 5, "การระคายเคือง": 5 }, comment: "ดีเยี่ยม ไม่มีพาราเบนตามที่บอก", wouldRecommend: true } },
  { trialId: "trial-1", name: "วราภรณ์ สุขสมบูรณ์", phone: "087-554-6677", address: "65 สาทร 1 บางรัก กทม. 10500", motivation: "ทำงานออฟฟิศ ผิวหมอง",
    submittedAt: Date.now() - 8*86400000, approvedAt: Date.now() - 7*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "กลิ่นและเนื้อสัมผัส": 4, "ผลลัพธ์ใน 14 วัน": 5, "การระคายเคือง": 4 }, comment: "เห็นผลชัดเจน ผิวสว่างขึ้น", wouldRecommend: true } },
  { trialId: "trial-1", name: "ณัฏฐา พิทักษ์ชน", phone: "081-330-9988", address: "8/22 ม.4 บางใหญ่ นนทบุรี 11140", motivation: "ลองดูแล้วรีวิว",
    submittedAt: Date.now() - 7*86400000, approvedAt: Date.now() - 6*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "lgbtq", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 4, "การระคายเคือง": 5 }, comment: "ใช้ดีมาก แนะนำเพื่อนแล้ว", wouldRecommend: true } },
  { trialId: "trial-1", name: "ทิพย์รัตน์ มั่นคง", phone: "089-447-1100", address: "172 จรัญสนิทวงศ์ 65 บางพลัด กทม. 10700", motivation: "ผิวบาง อยากบำรุง",
    submittedAt: Date.now() - 6*86400000, approvedAt: Date.now() - 5*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "กลิ่นและเนื้อสัมผัส": 4, "ผลลัพธ์ใน 14 วัน": 4, "การระคายเคือง": 4 }, comment: "ผิวดีขึ้น แต่อยากให้กลิ่นจาง", wouldRecommend: true } },
  { trialId: "trial-1", name: "อภิวัฒน์ คงทอง", phone: "083-882-5544", address: "9 ม.1 ปากเกร็ด นนทบุรี 11120", motivation: "ดูจากรีวิวเลยอยากลอง",
    submittedAt: Date.now() - 6*86400000, approvedAt: Date.now() - 5*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "male", ageRange: "35-44",
    evaluation: { overall: 2, criteria: { "กลิ่นและเนื้อสัมผัส": 3, "ผลลัพธ์ใน 14 วัน": 2, "การระคายเคือง": 2 }, comment: "ระคายเคืองนิดหน่อย ผลไม่ค่อยเห็น", wouldRecommend: false } },
  { trialId: "trial-1", name: "ศุภาพิชญ์ บุญรอด", phone: "086-330-7722", address: "33 ม.2 บางบ่อ สมุทรปราการ 10560", motivation: "ผิวอ่อนแอ ลองเสริมความแข็งแรง",
    submittedAt: Date.now() - 5*86400000, approvedAt: Date.now() - 4*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "15-24",
    evaluation: { overall: 5, criteria: { "กลิ่นและเนื้อสัมผัส": 5, "ผลลัพธ์ใน 14 วัน": 5, "การระคายเคือง": 5 }, comment: "เป๊ะปังมาก ใช้ทุกวัน", wouldRecommend: true } },
  { trialId: "trial-1", name: "ดนุพล จิตรอารี", phone: "081-005-8866", address: "201 บรรทัดทอง ถ.พญาไท ราชเทวี กทม. 10400", motivation: "ทดลองสูตรไทย",
    submittedAt: Date.now() - 5*86400000, approvedAt: Date.now() - 4*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: { "กลิ่นและเนื้อสัมผัส": 3, "ผลลัพธ์ใน 14 วัน": 3, "การระคายเคือง": 4 }, comment: "พอใช้ได้ ไม่ว้าวมาก", wouldRecommend: true } },
];

const CUSTOM_PRODUCTS_KEY = "metaherb:trial:products:custom";
const HIDDEN_PRODUCTS_KEY = "metaherb:trial:products:hidden";   // IDs of mock products that the owner deleted
const OVERRIDES_KEY       = "metaherb:trial:products:overrides"; // edits applied on top of mock products

function loadCustomProducts(): TrialProduct[] {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || "[]"); }
  catch { return []; }
}
function saveCustomProducts(list: TrialProduct[]) {
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(list));
}
function loadHiddenIds(): string[] {
  try { return JSON.parse(localStorage.getItem(HIDDEN_PRODUCTS_KEY) || "[]"); }
  catch { return []; }
}
function saveHiddenIds(ids: string[]) {
  localStorage.setItem(HIDDEN_PRODUCTS_KEY, JSON.stringify(ids));
}
function loadOverrides(): Record<string, Partial<TrialProduct>> {
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); }
  catch { return {}; }
}
function saveOverrides(map: Record<string, Partial<TrialProduct>>) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
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
  const [hidden, setHidden] = useState<string[]>(() => loadHiddenIds());
  const [overrides, setOverrides] = useState<Record<string, Partial<TrialProduct>>>(() => loadOverrides());

  /** Mock products with overrides applied, then hidden ones filtered out, then custom appended. */
  const all = useMemo(() => {
    const mockWithOverrides = TRIAL_PRODUCTS
      .filter((p) => !hidden.includes(p.id))
      .map((p) => overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
    return [...mockWithOverrides, ...custom];
  }, [custom, hidden, overrides]);

  const add = (p: TrialProduct) => {
    const next = [...custom, p];
    setCustom(next);
    saveCustomProducts(next);
  };
  const remove = (id: string) => {
    // Custom product: drop from custom list
    if (custom.some((p) => p.id === id)) {
      const next = custom.filter((p) => p.id !== id);
      setCustom(next);
      saveCustomProducts(next);
      return;
    }
    // Mock product: add to hidden list (soft delete)
    if (!hidden.includes(id)) {
      const next = [...hidden, id];
      setHidden(next);
      saveHiddenIds(next);
    }
  };
  const update = (id: string, patch: Partial<TrialProduct>) => {
    if (custom.some((p) => p.id === id)) {
      const next = custom.map((p) => p.id === id ? { ...p, ...patch } : p);
      setCustom(next);
      saveCustomProducts(next);
      return;
    }
    // Mock product: persist patch in overrides map
    const nextOv = { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } };
    setOverrides(nextOv);
    saveOverrides(nextOv);
  };
  return { all, custom, add, remove, update };
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
                    <span className={`${font} text-[12px] text-[#319754]`} style={{ fontWeight: 700 }}>{(r.name || "?").slice(0, 1)}</span>
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
        (r.name || "").toLowerCase().includes(q) ||
        (r.phone || "").includes(q) ||
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
            <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 700 }}>{(reg.name?.trim() || "?").slice(0, 1)}</span>
          </div>
          <div className="min-w-0">
            <p className={`${font} text-[14px] truncate ${reg.name?.trim() ? "text-[#1a1a1a]" : "text-gray-400 italic"}`} style={{ fontWeight: 600 }}>{reg.name?.trim() || "ไม่ระบุชื่อ"}</p>
            <p className={`${font} text-[12px] inline-flex items-center gap-1 ${reg.phone?.trim() ? "text-gray-500" : "text-gray-400 italic"}`}>
              <Phone className="size-3" strokeWidth={2.2} /> {reg.phone?.trim() || "ไม่ระบุเบอร์"}
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
function Td({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return <td className={`px-4 py-3 ${className || ""}`} onClick={onClick}>{children}</td>;
}

// ============================================================================
//  TAB 3 — PRODUCTS REGISTRY
// ============================================================================

export function OwnerTrialsProducts({ onAddProduct }: { onAddProduct: () => void }) {
  const { all, custom, remove } = useAllTrialProducts();
  type ProductFilter = "all" | "active" | "ending_soon" | "closed";
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [search, setSearch] = useState("");
  /** Applicants modal — shows the people who registered for a specific trial */
  const [viewApplicantsOf, setViewApplicantsOf] = useState<TrialProduct | null>(null);
  /** Combined: real registrations from localStorage + the mocked roster */
  const allRegs = useMemo(() => [...MOCK_REGISTRATIONS, ...loadRegistrations()], []);
  const applicantsList = useMemo(() => {
    if (!viewApplicantsOf) return [];
    return allRegs.filter((r) => r.trialId === viewApplicantsOf.id).sort((a, b) => b.submittedAt - a.submittedAt);
  }, [viewApplicantsOf, allRegs]);

  const seatsTaken = (p: TrialProduct) => allRegs.filter((r) => r.trialId === p.id && !r.rejectedAt).length;
  const isClosed = (p: TrialProduct) => p.endsInDays <= 0 || p.spotsTotal - seatsTaken(p) <= 0;
  const isEndingSoon = (p: TrialProduct) => !isClosed(p) && (p.spotsTotal - seatsTaken(p) <= 10 || p.endsInDays <= 7);

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

  // Render the detail page in-place instead of the list when a product is selected
  if (viewApplicantsOf) {
    return (
      <TrialDetailPage
        product={viewApplicantsOf}
        applicants={applicantsList}
        onBack={() => setViewApplicantsOf(null)}
        onDelete={() => remove(viewApplicantsOf.id)}
      />
    );
  }

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
                // Real seat count = applicants not rejected (same logic as detail page)
                const spotsTakenReal = allRegs.filter((r) => r.trialId === p.id && !r.rejectedAt).length;
                const spotsLeft = Math.max(0, p.spotsTotal - spotsTakenReal);
                const pct = (spotsTakenReal / p.spotsTotal) * 100;
                const closed = isClosed(p);
                return (
                  <tr key={p.id}
                    onClick={() => setViewApplicantsOf(p)}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer">
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
                        <span className={`${font} text-[12px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 600 }}>{spotsTakenReal}/{p.spotsTotal} ที่</span>
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
                    <Td className="text-right" onClick={(e) => e.stopPropagation()}>
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
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] text-black hover:bg-gray-50 cursor-pointer`}>
                              <Pencil className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>แก้ไข</span>
                            </button>
                            <button
                              onClick={() => setViewApplicantsOf(p)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ดูรายละเอียด</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => { if (confirm(`ลบสินค้าทดลอง "${p.name}"?`)) { remove(p.id); toast.success(`ลบ: ${p.name}`); } }}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] text-[#ff3b30] hover:bg-[#ff3b30]/5 cursor-pointer`}>
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
  "เครื่องสำอาง":            "skincare",
  "สุขภาพ / อาหารเสริม":      "supplement",
  "อโรมา / เครื่องหอม":       "aroma",
  "อาหาร / เครื่องดื่ม":       "food",
  "อุปกรณ์ / เครื่องมือ":      "household",
};

/* =============================================================
 * EVALUATION FORM AUTO-GENERATOR
 * ============================================================= */

type TestObjective = "efficacy" | "sensory" | "packaging" | "market" | "formula_ab";

/** Multi-select test objectives the owner picks; the form is generated from these + category. */
const TEST_OBJECTIVES: { key: TestObjective; label: string; description: string; example: string[]; accent: string }[] = [
  { key: "efficacy",   label: "ทดสอบประสิทธิภาพ (Efficacy)",            description: "พิสูจน์ว่าสินค้าทำงานได้จริงตามสรรพคุณ วัดด้วย Before/After", accent: "#319754",
    example: ["ระดับความชุ่มชื้นผิว (Scale 1-5)", "ปัญหาผิวที่ต้องการแก้ไข (Multiple Choice)", "ผลข้างเคียง / อาการแพ้ (Conditional)"] },
  { key: "sensory",    label: "ทดสอบประสาทสัมผัส (Sensory)",            description: "วัดความพึงพอใจด้านเนื้อสัมผัส กลิ่น รสชาติ สี", accent: "#f59e0b",
    example: ["เนื้อสัมผัส (Texture) เหมาะกับผิว (Scale 1-5)", "กลิ่นน่าใช้ ไม่ฉุนรบกวน (Scale 1-5)", "สัมผัสแรกที่รู้สึกได้ (Tags)"] },
  { key: "packaging",  label: "ทดสอบบรรจุภัณฑ์ (Packaging)",            description: "วัดดีไซน์ ความสวยงาม ฟังก์ชันการใช้งาน และ First Impression", accent: "#8b5cf6",
    example: ["ดีไซน์ / ความสวยงาม (Scale 1-5)", "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา) (Scale 1-5)", "First Impression (Multiple Choice)"] },
  { key: "market",     label: "ทดสอบด้านการตลาด (Market Research)",     description: "วัด Purchase Intent ราคาที่ยอมจ่าย NPS และกลุ่มเป้าหมาย", accent: "#ef4444",
    example: ["Purchase Intent — คุณจะซื้อจริงไหม (Scale 1-5)", "ราคาสูงสุดที่ยอมจ่าย (Text)", "เหมาะกับกลุ่มเป้าหมายแบบใด (Multiple Choice)"] },
  { key: "formula_ab", label: "เปรียบเทียบสูตร A/B (Formula Comparison)", description: "Tester ลองทั้งสองสูตรและประเมิน Side-by-Side", accent: "#ec4899",
    example: ["ชอบสูตรไหนมากกว่า (A vs B)", "ความแตกต่างที่สังเกตได้ (Text)"] },
];

type QuestionType = "scale_1_5" | "stars_1_5" | "nps_0_10" | "multiple_choice" | "tag" | "conditional" | "text" | "ab_choice";
type Phase = "baseline" | "first_use" | "after_full" | "always";

const PHASE_META: Record<Phase, { emoji: string; label: string; color: string }> = {
  baseline:   { emoji: "📋", label: "ก่อนใช้สินค้า (Baseline)",     color: "#3b82f6" },
  first_use:  { emoji: "✨", label: "หลังใช้ครั้งแรก",                color: "#f59e0b" },
  after_full: { emoji: "📊", label: "หลังใช้ครบกำหนด",                color: "#319754" },
  always:     { emoji: "⭐", label: "ทุกแบบประเมินรวมเสมอ",            color: "#1a1a1a" },
};

const TYPE_LABEL: Record<QuestionType, string> = {
  scale_1_5: "Scale 1-5", stars_1_5: "1-5 ดาว", nps_0_10: "NPS 0-10",
  multiple_choice: "Multiple Choice", tag: "Tag หลายข้อ", conditional: "Conditional",
  text: "Text", ab_choice: "A vs B",
};

type EvalQuestion = { id: string; label: string; type: QuestionType; phase: Phase; objective: TestObjective; options?: string[] };

/** Question library keyed by objective → category (`"_default"` fallback for un-mapped categories). */
const QUESTION_LIBRARY: Record<TestObjective, Record<string, EvalQuestion[]>> = {
  efficacy: {
    "เครื่องสำอาง": [
      { id: "skin_moist_b",  label: "ระดับความชุ่มชื้นผิวตอนนี้",    type: "scale_1_5",       phase: "baseline",   objective: "efficacy" },
      { id: "skin_bright_b", label: "ความกระจ่างใสของผิวตอนนี้",     type: "scale_1_5",       phase: "baseline",   objective: "efficacy" },
      { id: "skin_problem",  label: "ปัญหาผิวที่ต้องการแก้ไข",        type: "multiple_choice", phase: "baseline",   objective: "efficacy",
        options: ["สิว / ผด", "จุดด่างดำ / ฝ้า", "ริ้วรอย / ผิวหย่อนคล้อย", "ผิวแห้ง / ลอก", "รูขุมขนกว้าง", "ผิวมัน / ผิวผสม", "ผิวแพ้ง่าย / ระคายเคือง"] },
      { id: "skin_sat_b",    label: "ความพึงพอใจสภาพผิวโดยรวมตอนนี้",  type: "scale_1_5",       phase: "baseline",   objective: "efficacy" },
      { id: "skin_moist_a",  label: "ผิวชุ่มชื้นขึ้นเทียบกับก่อนใช้",     type: "scale_1_5",       phase: "after_full", objective: "efficacy" },
      { id: "skin_bright_a", label: "ผิวกระจ่างใสขึ้น",                type: "scale_1_5",       phase: "after_full", objective: "efficacy" },
      { id: "skin_fix",      label: "ปัญหาผิวที่เลือกไว้ดีขึ้นแค่ไหน",     type: "scale_1_5",       phase: "after_full", objective: "efficacy" },
      { id: "skin_side",     label: "ผลข้างเคียง / อาการแพ้",          type: "conditional",     phase: "after_full", objective: "efficacy" },
    ],
    "อาหาร / เครื่องดื่ม": [
      { id: "drink_taste_b",  label: "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ", type: "scale_1_5", phase: "baseline",   objective: "efficacy" },
      { id: "drink_effect",   label: "ผลที่รู้สึกได้หลังดื่ม",            type: "multiple_choice", phase: "after_full", objective: "efficacy",
        options: ["รู้สึกสดชื่น / ตื่นตัว", "ผ่อนคลาย / นอนหลับดีขึ้น", "ระบบขับถ่ายดีขึ้น", "ภูมิคุ้มกันดีขึ้น", "ไม่รู้สึกต่างจากเดิม"] },
    ],
    "สุขภาพ / อาหารเสริม": [
      { id: "supp_baseline",  label: "ปัญหาสุขภาพที่ต้องการแก้",         type: "multiple_choice", phase: "baseline",   objective: "efficacy",
        options: ["ภูมิคุ้มกันต่ำ / เป็นหวัดบ่อย", "นอนไม่หลับ / นอนไม่เพียงพอ", "เหนื่อยล้า / อ่อนเพลีย", "ระบบขับถ่ายไม่ปกติ", "ปวดข้อ / กล้ามเนื้อ", "ผิวพรรณ / ผม / เล็บ"] },
      { id: "supp_effect",    label: "ผลที่รู้สึกได้หลังใช้ครบกำหนด",      type: "scale_1_5",       phase: "after_full", objective: "efficacy" },
      { id: "supp_side",      label: "ผลข้างเคียง / อาการไม่พึงประสงค์",  type: "conditional",     phase: "after_full", objective: "efficacy" },
    ],
    "_default": [
      { id: "eff_b",   label: "ระดับปัญหาที่ต้องการแก้ตอนนี้",        type: "scale_1_5", phase: "baseline",   objective: "efficacy" },
      { id: "eff_a",   label: "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด",     type: "scale_1_5", phase: "after_full", objective: "efficacy" },
      { id: "eff_side",label: "ผลข้างเคียง / อาการไม่พึงประสงค์",     type: "conditional", phase: "after_full", objective: "efficacy" },
    ],
  },
  sensory: {
    "เครื่องสำอาง": [
      { id: "sens_texture",  label: "เนื้อสัมผัส (Texture) เหมาะกับผิว", type: "scale_1_5", phase: "first_use", objective: "sensory" },
      { id: "sens_absorb",   label: "การดูดซึม (Absorption)",            type: "scale_1_5", phase: "first_use", objective: "sensory" },
      { id: "sens_smell",    label: "กลิ่นน่าใช้ ไม่ฉุนรบกวน",             type: "scale_1_5", phase: "first_use", objective: "sensory" },
      { id: "sens_color",    label: "สีและลักษณะน่าพอใจ",                type: "scale_1_5", phase: "first_use", objective: "sensory" },
      { id: "sens_first",    label: "สัมผัสแรกที่รู้สึกได้",                type: "tag",       phase: "first_use", objective: "sensory" },
    ],
    "_default": [
      { id: "sens_smell_d",  label: "กลิ่นและรสชาติ",   type: "scale_1_5", phase: "first_use", objective: "sensory" },
      { id: "sens_texture_d",label: "เนื้อสัมผัส",       type: "scale_1_5", phase: "first_use", objective: "sensory" },
      { id: "sens_first_d",  label: "สัมผัสแรก",        type: "tag",       phase: "first_use", objective: "sensory" },
    ],
  },
  packaging: {
    "_default": [
      { id: "pkg_design", label: "ดีไซน์ / ความสวยงาม",        type: "scale_1_5",       phase: "baseline", objective: "packaging" },
      { id: "pkg_func",   label: "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)", type: "scale_1_5",       phase: "baseline", objective: "packaging" },
      { id: "pkg_first",  label: "First Impression",            type: "multiple_choice", phase: "baseline", objective: "packaging",
        options: ["ดูพรีเมียม / น่าใช้", "ดูธรรมชาติ / Organic", "ดูทันสมัย / มินิมอล", "ดูคลาสสิก / น่าเชื่อถือ", "ดูธรรมดา ไม่ประทับใจ"] },
    ],
  },
  market: {
    "_default": [
      { id: "mkt_intent", label: "Purchase Intent — คุณจะซื้อจริงไหม",   type: "scale_1_5", phase: "after_full", objective: "market" },
      { id: "mkt_price",  label: "ราคาสูงสุดที่ยอมจ่าย",                 type: "text",      phase: "after_full", objective: "market" },
      { id: "mkt_target", label: "เหมาะกับกลุ่มเป้าหมายแบบใด",            type: "multiple_choice", phase: "after_full", objective: "market",
        options: ["วัยรุ่น (15-24 ปี)", "วัยทำงาน (25-39 ปี)", "วัยกลางคน (40-54 ปี)", "วัยสูงอายุ (55+ ปี)", "ทุกเพศทุกวัย"] },
    ],
  },
  formula_ab: {
    "_default": [
      { id: "ab_prefer",  label: "ชอบสูตรไหนมากกว่า",              type: "ab_choice", phase: "after_full", objective: "formula_ab" },
      { id: "ab_diff",    label: "ความแตกต่างที่สังเกตได้",          type: "text",      phase: "after_full", objective: "formula_ab" },
    ],
  },
};

/** Build the final evaluation form from selected objectives + product category. */
function generateEvalQuestions(objectives: TestObjective[], category: string): EvalQuestion[] {
  const result: EvalQuestion[] = [];
  for (const obj of objectives) {
    const byCategory = QUESTION_LIBRARY[obj];
    const list = byCategory[category] || byCategory["_default"] || [];
    result.push(...list);
  }
  // Always-on core questions — included regardless of selection
  result.push(
    { id: "core_overall", label: "ความพึงพอใจโดยรวม",      type: "stars_1_5", phase: "always", objective: "efficacy" },
    { id: "core_nps",     label: "แนะนำให้คนอื่น (NPS)",    type: "nps_0_10",  phase: "always", objective: "efficacy" },
    { id: "core_text",    label: "คำแนะนำเพิ่มเติม",        type: "text",      phase: "always", objective: "efficacy" },
  );
  return result;
}

export function AddTrialProductTab({ onBack }: { onBack: () => void }) {
  const { add } = useAllTrialProducts();
  const onSave = (p: TrialProduct) => { add(p); toast.success("เพิ่มสินค้าทดลองเรียบร้อย", { description: p.name }); onBack(); };
  return <AddTrialProductForm onBack={onBack} onSave={onSave} />;
}

function AddTrialProductForm({ onBack, onSave }: { onBack: () => void; onSave: (p: TrialProduct) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("เครื่องสำอาง");
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
  /** Auto-generated evaluation form — driven by selected objectives + category */
  const [testObjectives, setTestObjectives] = useState<TestObjective[]>(["efficacy", "sensory"]);
  /** Which evaluation phases the owner wants to collect. "always" is always included. */
  const [activePhases, setActivePhases] = useState<Exclude<Phase, "always">[]>(["baseline", "first_use", "after_full"]);
  /** Modal for the form generator */
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  /** Dedicated read-only preview that renders the form exactly as Tester will see it */
  const [formPreviewOpen, setFormPreviewOpen] = useState(false);
  /** Preview mode inside the modal: compact list vs. actual rendered form */
  const [previewMode, setPreviewMode] = useState<"list" | "form">("list");
  /** Staged objectives + phases — only commit on "Apply" so cancel reverts */
  const [stagedObjectives, setStagedObjectives] = useState<TestObjective[]>(testObjectives);
  const [stagedPhases, setStagedPhases] = useState<Exclude<Phase, "always">[]>(activePhases);
  // Sync staged when opening the modal
  useEffect(() => {
    if (evalModalOpen) {
      setStagedObjectives(testObjectives);
      setStagedPhases(activePhases);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalModalOpen]);
  /** Generated questions filtered by the staged phase selection */
  const stagedQuestions = useMemo(
    () => generateEvalQuestions(stagedObjectives, category)
      .filter((q) => q.phase === "always" || stagedPhases.includes(q.phase)),
    [stagedObjectives, category, stagedPhases]
  );
  const stagedByPhase = useMemo(() => {
    const groups: Record<Phase, EvalQuestion[]> = { baseline: [], first_use: [], after_full: [], always: [] };
    for (const q of stagedQuestions) groups[q.phase].push(q);
    return groups;
  }, [stagedQuestions]);
  const generatedQuestions = useMemo(
    () => generateEvalQuestions(testObjectives, category)
      .filter((q) => q.phase === "always" || activePhases.includes(q.phase)),
    [testObjectives, category, activePhases]
  );
  /** Group by phase for the preview UI */
  const questionsByPhase = useMemo(() => {
    const groups: Record<Phase, EvalQuestion[]> = { baseline: [], first_use: [], after_full: [], always: [] };
    for (const q of generatedQuestions) groups[q.phase].push(q);
    return groups;
  }, [generatedQuestions]);
  const [whatToTestText, setWhatToTestText] = useState<string>(
    initialTpl ? initialTpl.criteria.join("\n") : "กลิ่นและเนื้อสัมผัส\nผลลัพธ์ใน 14 วัน\nการระคายเคือง"
  );
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTplKey);

  /** Sync the legacy text representation so validation + save keep working */
  useEffect(() => {
    if (testObjectives.length > 0) {
      setWhatToTestText(generatedQuestions.map((q) => q.label).join("\n"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedQuestions]);

  // ===== Product info fields (ส่วนประกอบ & วิธีใช้) =====
  const [ingredients, setIngredients] = useState("");
  const [warnings, setWarnings] = useState("");
  const [howToUse, setHowToUse] = useState("");

  // ===== Target audience (5 multi-select groups) + Feedback + sample count =====
  const [targetAge, setTargetAge] = useState<string[]>(["25-34"]);
  const [targetGender, setTargetGender] = useState<string[]>(["ชาย", "หญิง"]);
  const [targetLifestyle, setTargetLifestyle] = useState<string[]>([]);
  const [targetHealth, setTargetHealth] = useState<string[]>([]);
  const [targetBehavior, setTargetBehavior] = useState<string[]>([]);
  const [feedbackTypes, setFeedbackTypes] = useState<string[]>(["แบบสอบถาม"]);

  const AGE_OPTIONS       = ["15-24", "25-34", "35-44", "45-54", "55+"];
  const GENDER_OPTIONS    = ["ชาย", "หญิง", "LGBTQ+"];
  const LIFESTYLE_OPTIONS = [
    { emoji: "🙂", label: "ผู้บริโภคทั่วไป" },
    { emoji: "💚", label: "สายสุขภาพ" },
    { emoji: "🧓", label: "ผู้สูงอายุ" },
    { emoji: "💪", label: "นักกีฬา/ออกกำลัง" },
    { emoji: "☕", label: "คนดื่มกาแฟ" },
    { emoji: "🌙", label: "มีปัญหาการนอน" },
    { emoji: "✨", label: "สาย skincare" },
  ];
  const HEALTH_OPTIONS = [
    { emoji: "😴", label: "นอนหลับยาก" },
    { emoji: "😰", label: "เครียด" },
    { emoji: "😩", label: "อ่อนเพลีย" },
    { emoji: "🌸", label: "ปัญหาผิว" },
    { emoji: "🍽", label: "ระบบย่อย" },
    { emoji: "🦴", label: "ปวดข้อ" },
    { emoji: "🧠", label: "สมาธิ" },
  ];
  const BEHAVIOR_OPTIONS = [
    { emoji: "🍵", label: "ชาสมุนไพร" },
    { emoji: "💊", label: "แคปซูล" },
    { emoji: "🥤", label: "ผง" },
    { emoji: "💧", label: "น้ำมัน" },
    { emoji: "🧴", label: "ครีม/เซรั่ม" },
  ];
  const FEEDBACK_OPTIONS = ["แบบสอบถาม", "สัมภาษณ์ออนไลน์", "รีวิวยาว", "รูปก่อน-หลัง", "วิดีโอรีวิว"];

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (k: string) =>
    setter((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
  const toggleAge       = toggle(setTargetAge);
  const toggleGender    = toggle(setTargetGender);
  const toggleLifestyle = toggle(setTargetLifestyle);
  const toggleHealth    = toggle(setTargetHealth);
  const toggleBehavior  = toggle(setTargetBehavior);
  const toggleFeedback  = toggle(setFeedbackTypes);

  // ===== Quality & Documents (คุณภาพ & เอกสาร) — file names + key fields =====
  const [docs, setDocs] = useState({
    labResult: "",            // ผลทดสอบจากห้องแล็บ (file name)
    labNote: "",              // สรุปผลทดสอบสั้นๆ
    fdaNumber: "",            // เลข อย.
    fdaDoc: "",               // ใบ อย. (file)
    factoryName: "",          // ชื่อโรงงาน
    factoryAddress: "",       // ที่อยู่โรงงาน
    factoryGmpDoc: "",        // ใบ GMP (file)
    sdsDoc: "",               // Safety Data Sheet (file)
    insuranceDoc: "",         // ประกันความรับผิด (file)
    insuranceProvider: "",    // ผู้รับประกัน
  });
  const updDoc = <K extends keyof typeof docs>(k: K, v: typeof docs[K]) => setDocs((p) => ({ ...p, [k]: v }));
  const docRefs = {
    labResult: useRef<HTMLInputElement>(null),
    fdaDoc: useRef<HTMLInputElement>(null),
    factoryGmpDoc: useRef<HTMLInputElement>(null),
    sdsDoc: useRef<HTMLInputElement>(null),
    insuranceDoc: useRef<HTMLInputElement>(null),
  };
  const onDocFile = (k: keyof typeof docs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    updDoc(k, f.name as any);
    toast.success("แนบเอกสารแล้ว", { description: f.name });
  };

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
  const usageValid = ingredients.trim().length > 0 && howToUse.trim().length > 0;
  const conditionsValid = spotsTotal > 0 && endsInDays > 0;
  const targetValid = targetAge.length > 0 && targetGender.length > 0;
  const qualityValid = !!(docs.labResult && docs.fdaNumber && docs.factoryName);
  const criteriaValid =
    whatToTestText.split("\n").map((s) => s.trim()).filter(Boolean).length > 0;
  const canSave = infoValid && conditionsValid && criteriaValid;

  // Sections for the step-progress sidebar
  const sections: { id: string; label: string; required: boolean; valid: boolean }[] = [
    { id: "image",      label: "รูปภาพสินค้า",       required: false, valid: imageValid },
    { id: "info",       label: "ข้อมูลพื้นฐาน",      required: true,  valid: infoValid },
    { id: "usage",      label: "ส่วนประกอบ & วิธีใช้",  required: false, valid: usageValid },
    { id: "conditions", label: "เงื่อนไขการทดสอบ",    required: true,  valid: conditionsValid },
    { id: "quality",    label: "คุณภาพ & เอกสาร",     required: false, valid: qualityValid },
    { id: "target",     label: "กลุ่มเป้าหมาย",       required: false, valid: targetValid },
    { id: "criteria",   label: "แบบประเมิน Tester",    required: true,  valid: criteriaValid },
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
                  {["เครื่องสำอาง","สุขภาพ / อาหารเสริม","อโรมา / เครื่องหอม","อาหาร / เครื่องดื่ม","อุปกรณ์ / เครื่องมือ"].map((c) => (
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

        {/* Section: ส่วนประกอบ & วิธีใช้ */}
        <section id="trialprod-usage" onMouseEnter={() => { setActiveStep(2); setMaxVisitedStep((p) => Math.max(p, 2)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Beaker className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>ส่วนประกอบ &amp; วิธีใช้</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>Ingredient list, วิธีการใช้, และคำเตือนสำหรับผู้ทดสอบ</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="space-y-3.5">
            <Textarea label="ส่วนประกอบ (Ingredients)" value={ingredients} onChange={setIngredients} rows={4}
              placeholder="เช่น Curcumin 5%&#10;Niacinamide 3%&#10;Hyaluronic Acid&#10;Glycerin&#10;Aqua" />
            <Textarea label="วิธีการใช้" value={howToUse} onChange={setHowToUse} rows={4}
              placeholder="ขั้นตอนการใช้ — 1 ขั้นตอน ต่อ 1 บรรทัด&#10;เช่น ล้างหน้าให้สะอาด&#10;หยด 2-3 หยดลงฝ่ามือ&#10;ทาบนใบหน้า เน้นจุดที่ต้องการบำรุง" />
            <Textarea label="คำเตือน" value={warnings} onChange={setWarnings} rows={3}
              placeholder="เช่น หยุดใช้ทันทีหากเกิดการระคายเคือง&#10;หลีกเลี่ยงรอบดวงตา&#10;ไม่เหมาะกับผู้แพ้ขมิ้น" />
          </div>
        </section>

        {/* Section: เงื่อนไขการทดสอบ */}
        <section id="trialprod-conditions" onMouseEnter={() => { setActiveStep(3); setMaxVisitedStep((p) => Math.max(p, 3)); }}
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
            {/* จำนวนที่นั่ง — input อิสระ + quick suggestion chips */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
                จำนวนที่นั่ง <span className="text-[#ff3b30]">*</span>
              </label>
              <input type="number" min={1} value={spotsTotal || ""} onChange={(e) => setSpotsTotal(Math.max(0, Number(e.target.value) || 0))}
                placeholder="กรอกจำนวนที่นั่งที่ต้องการ"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] tabular-nums`} />
              <div className="flex flex-wrap gap-1.5">
                {[10, 25, 50, 100, 200, 500].map((n) => {
                  const isOn = spotsTotal === n;
                  return (
                    <button key={n} type="button" onClick={() => setSpotsTotal(n)}
                      className={`${font} text-[11.5px] tabular-nums px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                        isOn ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#319754]/40"
                      }`}
                      style={{ fontWeight: 500 }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
            <Select label="ระยะเวลาเปิดรับสมัคร (วัน)" required value={String(endsInDays)} onChange={(v) => setEndsInDays(Number(v) || 0)}
              options={["7", "14", "21", "30"]} />
          </div>
        </section>

        {/* Section: กลุ่มเป้าหมาย & Feedback */}
        {/* Section: คุณภาพ & เอกสาร */}
        <section id="trialprod-quality" onMouseEnter={() => { setActiveStep(4); setMaxVisitedStep((p) => Math.max(p, 4)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>คุณภาพ &amp; เอกสารรับรอง</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>ผลแล็บ, อย., โรงงาน GMP, SDS, ประกันความรับผิด</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="space-y-4">
            {/* ────── Required: FDA registration (ขึ้นก่อนเพราะสำคัญสุด) ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="เลข อย." required value={docs.fdaNumber} onChange={(v) => updDoc("fdaNumber", v)} placeholder="10-1-6200xxxxx" />
              <div>
                <DocUpload label="ใบอนุญาต อย." fileName={docs.fdaDoc}
                  onPick={() => docRefs.fdaDoc.current?.click()} onClear={() => updDoc("fdaDoc", "")} />
                <input ref={docRefs.fdaDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("fdaDoc")} />
              </div>
            </div>

            {/* ────── Required: Factory info ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="ชื่อโรงงานผลิต" required value={docs.factoryName} onChange={(v) => updDoc("factoryName", v)} placeholder="เช่น โรงงาน ABC Pharma" />
              <div>
                <DocUpload label="ใบรับรอง GMP โรงงาน" fileName={docs.factoryGmpDoc}
                  onPick={() => docRefs.factoryGmpDoc.current?.click()} onClear={() => updDoc("factoryGmpDoc", "")} />
                <input ref={docRefs.factoryGmpDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("factoryGmpDoc")} />
              </div>
            </div>
            <Textarea label="ที่อยู่โรงงาน" value={docs.factoryAddress} onChange={(v) => updDoc("factoryAddress", v)} rows={2} placeholder="เลขที่ ถนน แขวง/ตำบล จังหวัด รหัสไปรษณีย์" />

            {/* Subtle divider between required vs optional groups */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-gray-100 flex-1" />
              <span className={`${font} text-[11px] text-gray-400`} style={{ fontWeight: 500 }}>เอกสารเพิ่มเติม (ทางเลือก)</span>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            {/* ────── Optional: Lab result ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <DocUpload label="ผลทดสอบจากห้องแล็บ (ISO/GMP)" fileName={docs.labResult}
                  onPick={() => docRefs.labResult.current?.click()} onClear={() => updDoc("labResult", "")} />
                <input ref={docRefs.labResult} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("labResult")} />
              </div>
              <Input label="สรุปผลทดสอบสั้น ๆ" value={docs.labNote} onChange={(v) => updDoc("labNote", v)} placeholder="เช่น ผ่าน Patch Test 99%" />
            </div>

            {/* ────── Optional: SDS + Insurance ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <DocUpload label="Safety Data Sheet (SDS)" fileName={docs.sdsDoc}
                  onPick={() => docRefs.sdsDoc.current?.click()} onClear={() => updDoc("sdsDoc", "")} />
                <input ref={docRefs.sdsDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("sdsDoc")} />
              </div>
              <div>
                <DocUpload label="ประกันความรับผิดต่อผลิตภัณฑ์" fileName={docs.insuranceDoc}
                  onPick={() => docRefs.insuranceDoc.current?.click()} onClear={() => updDoc("insuranceDoc", "")} />
                <input ref={docRefs.insuranceDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("insuranceDoc")} />
              </div>
            </div>
            <Input label="ผู้รับประกัน (Insurance provider)" value={docs.insuranceProvider} onChange={(v) => updDoc("insuranceProvider", v)} placeholder="เช่น บริษัทประกันภัย XYZ" />
          </div>
        </section>

        <section id="trialprod-target" onMouseEnter={() => { setActiveStep(5); setMaxVisitedStep((p) => Math.max(p, 5)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Users className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>กลุ่มเป้าหมาย</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>คุณสมบัติของ Tester ที่ต้องการ</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          {/* ────── Required: ข้อมูลพื้นฐาน Tester ────── */}
          <div className="bg-gradient-to-br from-[#319754]/[0.04] to-transparent border border-[#319754]/15 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="size-1.5 rounded-full bg-[#319754]" />
              <p className={`${font} text-[12px] text-[#1d5b32] uppercase tracking-wide`} style={{ fontWeight: 700 }}>ข้อมูลพื้นฐาน Tester</p>
              <span className={`${font} text-[10.5px] text-gray-500`}>· จำเป็นต้องระบุ</span>
            </div>
            <div className="space-y-4">
              <ChipGroup label="ช่วงอายุ" required selected={targetAge} onToggle={toggleAge}
                options={AGE_OPTIONS.map((a) => ({ label: a }))} />
              <ChipGroup label="เพศ" required selected={targetGender} onToggle={toggleGender}
                options={GENDER_OPTIONS.map((g) => ({ label: g }))} />
            </div>
          </div>

          {/* ────── Optional: ข้อมูลเสริม ────── */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="size-1.5 rounded-full bg-gray-400" />
              <p className={`${font} text-[12px] text-gray-600 uppercase tracking-wide`} style={{ fontWeight: 700 }}>ข้อมูลเสริม</p>
              <span className={`${font} text-[10.5px] text-gray-500`}>· ยิ่งระบุละเอียด ระบบจะ match Tester แม่นยำขึ้น</span>
            </div>
            <div className="space-y-4">
              <ChipGroup label="รูปแบบชีวิต" selected={targetLifestyle} onToggle={toggleLifestyle}
                options={LIFESTYLE_OPTIONS} />
              <div className="h-px bg-gray-100" />
              <ChipGroup label="สุขภาพ" selected={targetHealth} onToggle={toggleHealth}
                options={HEALTH_OPTIONS} />
              <div className="h-px bg-gray-100" />
              <ChipGroup label="พฤติกรรมการบริโภค" selected={targetBehavior} onToggle={toggleBehavior}
                options={BEHAVIOR_OPTIONS} />
            </div>
          </div>
        </section>

        {/* Section: สิ่งที่ต้องประเมิน */}
        <section id="trialprod-criteria" onMouseEnter={() => { setActiveStep(6); setMaxVisitedStep((p) => Math.max(p, 6)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Check className="size-5 text-[#319754]" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>แบบประเมินสำหรับ Tester</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>ระบบจะสร้างคำถามให้อัตโนมัติตามวัตถุประสงค์ที่เลือก</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />

          {/* Empty-state form-style clickable card (shown when no objectives selected) */}
          {testObjectives.length === 0 && (
            <motion.button type="button"
              onClick={() => setEvalModalOpen(true)}
              whileTap={{ scale: 0.99 }}
              whileHover={{ y: -2 }}
              className="group/empty w-full bg-gradient-to-br from-[#f9fdfa] to-white border-2 border-dashed border-[#319754]/30 hover:border-[#319754] rounded-[14px] p-8 cursor-pointer transition-all flex flex-col items-center text-center hover:shadow-[0_8px_24px_-6px_rgba(49,151,84,0.2)]">
              <div className="size-14 rounded-2xl bg-[#319754]/10 group-hover/empty:bg-[#319754] flex items-center justify-center mb-3 transition-colors">
                <FileText className="size-7 text-[#319754] group-hover/empty:text-white transition-colors" strokeWidth={1.8} />
              </div>
              <p className={`${font} text-[15px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>ยังไม่มีแบบประเมิน</p>
              <p className={`${font} text-[12.5px] text-gray-500 max-w-[400px] leading-snug`}>
                คลิกที่นี่เพื่อเริ่มสร้างแบบประเมินอัตโนมัติ — เลือกวัตถุประสงค์การทดสอบ + ช่วงเวลา ระบบจะสร้างคำถามให้ทันที
              </p>
              <span className={`${font} mt-3 inline-flex items-center gap-1.5 text-[12px] text-[#319754]`} style={{ fontWeight: 600 }}>
                <Plus className="size-3.5" strokeWidth={2.6} />
                สร้างแบบประเมิน
              </span>
            </motion.button>
          )}

          {/* Document-style summary card with action buttons */}
          {testObjectives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white border border-gray-200 rounded-[14px] p-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {/* Decorative document corner fold */}
              <span aria-hidden className="absolute top-0 right-0 size-[20px] bg-[#319754]/10"
                style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

              {/* Header row: icon + title + actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="size-9 rounded-[8px] bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${font} text-[13.5px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>แบบประเมิน Tester</p>
                    <p className={`${font} text-[11px] text-gray-500 mt-0.5 tabular-nums`}>
                      {generatedQuestions.length} คำถาม · {activePhases.length + 1} เฟส · {testObjectives.length} วัตถุประสงค์
                    </p>
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button"
                    onClick={() => setFormPreviewOpen(true)}
                    title="ดูตัวอย่างฟอร์มที่ Tester จะเห็น"
                    className="size-8 rounded-full hover:bg-[#319754]/10 text-gray-500 hover:text-[#319754] flex items-center justify-center cursor-pointer transition-colors">
                    <Eye className="size-4" strokeWidth={2.2} />
                  </button>
                  <button type="button"
                    onClick={() => { setEvalModalOpen(true); setPreviewMode("list"); }}
                    title="แก้ไขแบบประเมิน"
                    className="size-8 rounded-full hover:bg-[#319754]/10 text-gray-500 hover:text-[#319754] flex items-center justify-center cursor-pointer transition-colors">
                    <Pencil className="size-4" strokeWidth={2.2} />
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (!confirm("ต้องการลบแบบประเมินนี้ออกจริง ๆ ใช่ไหม?")) return;
                      setTestObjectives([]);
                      setWhatToTestText("");
                      toast.success("ลบแบบประเมินเรียบร้อย");
                    }}
                    title="ลบแบบประเมิน"
                    className="size-8 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center cursor-pointer transition-colors">
                    <Trash2 className="size-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-3" />

              {/* Phase breakdown chips — muted neutral style */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph) => {
                  const list = questionsByPhase[ph];
                  if (!list.length) return null;
                  const meta = PHASE_META[ph];
                  return (
                    <span key={ph} className={`${font} text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600`}
                      style={{ fontWeight: 500 }}>
                      {meta.label}
                      <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{list.length}</span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Evaluation detail — auto-populated from generated questions, editable */}
          {testObjectives.length > 0 && (
            <div className="mt-4">
              <Textarea
                label="รายละเอียดการประเมิน"
                value={whatToTestText}
                onChange={setWhatToTestText}
                rows={6}
                placeholder="กลิ่นและเนื้อสัมผัส&#10;ผลลัพธ์ใน 14 วัน&#10;การระคายเคือง"
              />
              <p className={`${font} text-[11px] text-gray-400 mt-1`}>
                ข้อมูลถูกดึงมาจากชุดคำถามอัตโนมัติ — สามารถพิมพ์เพิ่มเติม / แก้ไขได้
              </p>
            </div>
          )}

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

      {/* Evaluation form generator — modal popup */}
      <AnimatePresence>
        {evalModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEvalModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[720px] bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header — minimal style matching other popups in the system */}
              <div className="sticky top-0 bg-white px-6 pt-5 pb-4 flex items-start justify-between gap-3 z-10 rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                    <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>สร้างแบบประเมินอัตโนมัติ</h2>
                    <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>
                      วัตถุประสงค์ที่เลือก + หมวดหมู่ <span className="text-[#319754]" style={{ fontWeight: 600 }}>"{category}"</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setEvalModalOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Body — scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {/* Step 1: objectives */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`${font} size-6 rounded-full inline-flex items-center justify-center text-[12px] shadow-[0_2px_6px_-1px_rgba(49,151,84,0.35)] ${stagedObjectives.length > 0 ? "bg-gradient-to-br from-[#3fb56b] to-[#267a43] text-white" : "bg-gradient-to-br from-[#319754] to-[#267a43] text-white"}`} style={{ fontWeight: 700 }}>
                      {stagedObjectives.length > 0 ? <Check className="size-3.5" strokeWidth={3} /> : "1"}
                    </span>
                    <p className={`${font} text-[14.5px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>เลือกวัตถุประสงค์การทดสอบ</p>
                    <span className={`${font} text-[11px] text-gray-500`}>เลือกได้มากกว่า 1 ข้อ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TEST_OBJECTIVES.map((o) => {
                      const isOn = stagedObjectives.includes(o.key);
                      return (
                        <motion.div key={o.key}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStagedObjectives((prev) => isOn ? prev.filter((k) => k !== o.key) : [...prev, o.key])}
                          className={`${font} relative bg-white border-2 rounded-[12px] p-3 text-left cursor-pointer transition-all ${
                            isOn ? "border-[#319754] shadow-[0_4px_12px_-2px_rgba(49,151,84,0.2)]" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <div className="flex items-start gap-3">
                            <span className={`size-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isOn ? "bg-[#319754]" : "bg-white border-2 border-gray-300"}`}>
                              {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`${font} text-[13px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>{o.label}</p>
                                {/* Info popover with example questions */}
                                <HoverCard openDelay={120} closeDelay={80}>
                                  <HoverCardTrigger asChild>
                                    <button type="button" onClick={(e) => e.stopPropagation()}
                                      className="shrink-0 text-gray-400 hover:text-[#319754] transition-colors cursor-help">
                                      <Info className="size-3.5" strokeWidth={2.2} />
                                    </button>
                                  </HoverCardTrigger>
                                  <HoverCardContent side="top" className={`${font} w-[280px] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-gray-100 p-3 z-[60]`}>
                                    <p className={`${font} text-[11px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 600 }}>ตัวอย่างคำถามในแบบประเมิน</p>
                                    <ul className="space-y-1.5">
                                      {o.example.map((q, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <span className="size-1 rounded-full mt-2 shrink-0" style={{ background: o.accent }} />
                                          <span className={`${font} text-[12px] text-gray-700 leading-snug`}>{q}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              <p className={`${font} text-[11px] text-gray-500 mt-1 leading-snug`}>{o.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: which phases to send */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`${font} size-6 rounded-full inline-flex items-center justify-center text-[12px] shadow-[0_2px_6px_-1px_rgba(49,151,84,0.35)] ${stagedPhases.length > 0 ? "bg-gradient-to-br from-[#3fb56b] to-[#267a43] text-white" : "bg-gradient-to-br from-[#319754] to-[#267a43] text-white"}`} style={{ fontWeight: 700 }}>
                      {stagedPhases.length > 0 ? <Check className="size-3.5" strokeWidth={3} /> : "2"}
                    </span>
                    <p className={`${font} text-[14.5px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>เลือกช่วงเวลาที่จะให้ Tester ประเมิน</p>
                    <span className={`${font} text-[11px] text-gray-500`}>เลือกได้มากกว่า 1 ช่วง</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {([
                      { key: "baseline" as const,   label: "ก่อนใช้สินค้า",        sub: "Baseline — ส่งก่อนเริ่มทดสอบ" },
                      { key: "first_use" as const,  label: "ระหว่าง/หลังใช้ครั้งแรก", sub: "First impression" },
                      { key: "after_full" as const, label: "หลังใช้ครบกำหนด",      sub: "Final assessment" },
                    ]).map((p) => {
                      const isOn = stagedPhases.includes(p.key);
                      return (
                        <motion.button key={p.key} type="button"
                          onClick={() => setStagedPhases((prev) => isOn ? prev.filter((k) => k !== p.key) : [...prev, p.key])}
                          whileTap={{ scale: 0.98 }}
                          className={`${font} relative bg-white border-2 rounded-[12px] p-3 text-left cursor-pointer transition-all ${
                            isOn ? "border-[#319754] shadow-[0_4px_12px_-2px_rgba(49,151,84,0.2)]" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <div className="flex items-start gap-2.5">
                            <span className={`size-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isOn ? "bg-[#319754]" : "bg-white border-2 border-gray-300"}`}>
                              {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <p className={`${font} text-[12.5px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>{p.label}</p>
                              <p className={`${font} text-[10.5px] text-gray-500 mt-0.5 leading-snug`}>{p.sub}</p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  <p className={`${font} text-[10.5px] text-gray-400 mt-2`}>💡 คำถาม "ทุกแบบประเมินรวมเสมอ" (รวมคะแนน + NPS) จะติดมาในทุกเฟส</p>
                </div>

                {/* Step 3: live preview */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <span className={`${font} size-6 rounded-full inline-flex items-center justify-center text-[12px] shadow-[0_2px_6px_-1px_rgba(49,151,84,0.35)] bg-gradient-to-br from-[#3fb56b] to-[#267a43] text-white`} style={{ fontWeight: 700 }}>3</span>
                      <p className={`${font} text-[14.5px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>พรีวิวแบบประเมิน</p>
                      {stagedQuestions.length > 0 && (
                        <span className={`${font} text-[11px] text-[#319754] bg-[#319754]/10 px-2 py-0.5 rounded-full tabular-nums`} style={{ fontWeight: 600 }}>{stagedQuestions.length} คำถาม</span>
                      )}
                    </div>
                    {/* List ↔ Form toggle */}
                    {stagedObjectives.length > 0 && (
                      <div className="inline-flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
                        {(["list", "form"] as const).map((m) => (
                          <button key={m} onClick={() => setPreviewMode(m)}
                            className={`${font} text-[11px] px-3 py-1 rounded-full cursor-pointer transition-colors ${
                              previewMode === m ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                            style={{ fontWeight: previewMode === m ? 600 : 500 }}>
                            {m === "list" ? "📋 รายการ" : "👁 ฟอร์มจริง"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {stagedObjectives.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gradient-to-br from-gray-50 to-white">
                      <div className="size-14 rounded-2xl bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                        <FileText className="size-7 text-gray-300" strokeWidth={1.5} />
                      </div>
                      <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>เลือกวัตถุประสงค์อย่างน้อย 1 ข้อด้านบน</p>
                    </div>
                  ) : previewMode === "form" ? (
                    /* === FORM PREVIEW — looks like what Tester actually fills === */
                    <div className="rounded-2xl overflow-hidden shadow-[0_8px_24px_-8px_rgba(49,151,84,0.15)] border border-[#319754]/15">
                      {/* Document-style header bar */}
                      <div className="relative bg-gradient-to-br from-[#319754] to-[#267a43] px-5 py-3.5 overflow-hidden">
                        <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" strokeWidth={1.5} />
                        <div className="relative flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Eye className="size-4 text-white" strokeWidth={2.2} />
                          </div>
                          <div>
                            <p className={`${font} text-[13px] text-white leading-tight`} style={{ fontWeight: 700 }}>พรีวิวฟอร์มที่ Tester จะเห็น</p>
                            <p className={`${font} text-[10.5px] text-white/80 mt-0.5`}>ไม่สามารถกรอกได้ — เป็นภาพตัวอย่าง</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gradient-to-b from-[#fafafa] to-white">
                        {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph, phIdx) => {
                          const list = stagedByPhase[ph];
                          if (!list.length) return null;
                          const meta = PHASE_META[ph];
                          return (
                            <div key={ph} className={`p-5 ${phIdx > 0 ? "border-t border-gray-100" : ""}`}>
                              {/* Phase header pill */}
                              <div className="flex items-center gap-2 mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]"
                                  style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>
                                  {meta.label}
                                </span>
                                <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{list.length} คำถาม</span>
                              </div>
                              <div className="space-y-5">
                                {list.map((q, idx) => (
                                  <div key={q.id} className="bg-white rounded-xl p-3.5 border border-gray-100">
                                    <p className={`${font} text-[13px] text-[#1a1a1a] mb-2.5`} style={{ fontWeight: 500 }}>
                                      <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums"
                                        style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{idx + 1}</span>
                                      {q.label}
                                    </p>
                                    <FormFieldPreview type={q.type} options={q.options} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* === LIST VIEW — compact summary, polished === */
                    <div className="rounded-2xl overflow-hidden shadow-[0_8px_24px_-8px_rgba(49,151,84,0.15)] border border-[#319754]/15">
                      {/* Header bar — phase timeline */}
                      <div className="relative bg-gradient-to-br from-[#319754] to-[#267a43] px-5 py-3.5 overflow-hidden">
                        <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" strokeWidth={1.5} />
                        <div className="relative flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Calendar className="size-4 text-white" strokeWidth={2.2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`${font} text-[13px] text-white leading-tight`} style={{ fontWeight: 700 }}>ลำดับการส่งให้ Tester</p>
                            <p className={`${font} text-[10.5px] text-white/80 mt-0.5`}>
                              {(["baseline", "first_use", "after_full"] as Phase[])
                                .filter((ph) => stagedByPhase[ph].length > 0)
                                .map((ph, i) => `${i + 1}. ${PHASE_META[ph].label}`)
                                .join(" → ")}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Phase groups with timeline */}
                      <div className="bg-white">
                        {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph, phIdx) => {
                          const list = stagedByPhase[ph];
                          if (!list.length) return null;
                          const meta = PHASE_META[ph];
                          return (
                            <div key={ph} className={`p-4 ${phIdx > 0 ? "border-t border-gray-100" : ""}`}>
                              {/* Phase header */}
                              <div className="flex items-center justify-between mb-2.5">
                                <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]`}
                                  style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>
                                  {meta.label}
                                </span>
                                <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{list.length} ข้อ</span>
                              </div>
                              {/* Question rows */}
                              <div className="space-y-1.5">
                                {list.map((q, idx) => (
                                  <div key={q.id} className="flex items-center justify-between gap-3 py-2 px-3 bg-gradient-to-r from-gray-50/50 to-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                      <span className={`${font} inline-flex items-center justify-center size-5 rounded-full text-[10px] tabular-nums shrink-0`}
                                        style={{ background: `${meta.color}10`, color: meta.color, fontWeight: 700 }}>{idx + 1}</span>
                                      <span className={`${font} text-[12.5px] text-[#1a1a1a]`}>{q.label}</span>
                                    </div>
                                    <span className={`${font} text-[10px] text-gray-600 px-2.5 py-0.5 rounded-full bg-gray-100 shrink-0 whitespace-nowrap`} style={{ fontWeight: 600 }}>{TYPE_LABEL[q.type]}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer — apply / cancel with summary chip */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-3 bg-gradient-to-b from-white to-gray-50/80">
                <div className="flex items-center gap-2 min-w-0">
                  <button onClick={() => setEvalModalOpen(false)}
                    className={`${font} h-10 px-5 rounded-full text-gray-600 hover:bg-gray-100 text-[13px] cursor-pointer transition-colors shrink-0`}
                    style={{ fontWeight: 500 }}>
                    ยกเลิก
                  </button>
                  {/* Summary chip — current selection at a glance */}
                  {stagedObjectives.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                      <span className="size-1.5 rounded-full bg-[#319754]" />
                      <span className={`${font}`}>{stagedObjectives.length} วัตถุประสงค์ · {stagedPhases.length} เฟส · {stagedQuestions.length} คำถาม</span>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => { setTestObjectives(stagedObjectives); setActivePhases(stagedPhases); setEvalModalOpen(false); toast.success("สร้างแบบประเมินเรียบร้อย"); }}
                  disabled={stagedObjectives.length === 0}
                  whileTap={stagedObjectives.length > 0 ? { scale: 0.97 } : undefined}
                  whileHover={stagedObjectives.length > 0 ? { y: -1 } : undefined}
                  className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full text-white text-[13px] cursor-pointer transition-shadow shrink-0 ${
                    stagedObjectives.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "shadow-[0_6px_18px_-3px_rgba(49,151,84,0.5)]"
                  }`}
                  style={{
                    fontWeight: 600,
                    background: stagedObjectives.length === 0 ? undefined : "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)",
                  }}>
                  <Check className="size-4" strokeWidth={2.8} />
                  ใช้แบบประเมินนี้
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* DEDICATED FORM PREVIEW MODAL — read-only, what Tester will see */}
      {/* ============================================================ */}
      <AnimatePresence>
        {formPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFormPreviewOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[640px] bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 pt-5 pb-4 flex items-start justify-between gap-3 z-10 rounded-t-3xl border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                    <Eye className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>พรีวิวแบบประเมิน</h2>
                    <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>มุมมองที่ Tester จะเห็นจริง — ไม่สามารถกรอกได้</p>
                  </div>
                </div>
                <button onClick={() => setFormPreviewOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Body — pure form, grouped by phase */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fafafa] to-white px-5 py-4 space-y-5">
                {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph) => {
                  const list = questionsByPhase[ph];
                  if (!list.length) return null;
                  const meta = PHASE_META[ph];
                  return (
                    <div key={ph}>
                      {/* Phase header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]`}
                          style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>
                          {meta.label}
                        </span>
                        <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{list.length} คำถาม</span>
                      </div>
                      <div className="space-y-3">
                        {list.map((q, idx) => (
                          <div key={q.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                            <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
                              <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums"
                                style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{idx + 1}</span>
                              {q.label}
                            </p>
                            <FormFieldPreview type={q.type} options={q.options} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-3 bg-white">
                <p className={`${font} text-[11px] text-gray-500`}>
                  {generatedQuestions.length} คำถาม · {activePhases.length + 1} เฟส
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFormPreviewOpen(false)}
                    className={`${font} h-10 px-5 rounded-full text-gray-600 hover:bg-gray-100 text-[13px] cursor-pointer transition-colors`}
                    style={{ fontWeight: 500 }}>
                    ปิด
                  </button>
                  <button onClick={() => { setFormPreviewOpen(false); setEvalModalOpen(true); setPreviewMode("list"); }}
                    className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer transition-colors shadow-[0_4px_12px_-2px_rgba(49,151,84,0.35)]`}
                    style={{ fontWeight: 600 }}>
                    <Pencil className="size-3.5" strokeWidth={2.4} />
                    แก้ไขแบบประเมิน
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Pill input — matches AddProductTab style */
function Input({ label, value, onChange, placeholder, type = "text", required = false, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      {/* min-h forces empty hint to occupy the same vertical space as a populated one */}
      {hint !== undefined && <p className={`${font} text-[11.5px] text-gray-500 -mt-1 min-h-[17px]`}>{hint || " "}</p>}
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

/** Multi-select chip group — used by the target audience section.
 *  Selected chips are filled green with a check; unselected are bordered + emoji + label. */
function ChipGroup({ label, required, selected, onToggle, options }: {
  label: string;
  required?: boolean;
  selected: string[];
  onToggle: (k: string) => void;
  options: { label: string; emoji?: string }[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
          {label} {required && <span className="text-[#ff3b30]">*</span>}
        </label>
        {selected.length > 0 && (
          <span className={`${font} text-[11.5px] text-gray-500 tabular-nums`}>{selected.length} เลือก</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.label);
          return (
            <button key={opt.label} type="button" onClick={() => onToggle(opt.label)}
              className={`${font} text-[13px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 cursor-pointer transition-all ${
                active ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-700 hover:border-[#319754]/40"
              }`}
              style={{ fontWeight: active ? 600 : 500 }}>
              {opt.emoji && <span className="text-[14px] leading-none">{opt.emoji}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Inline file-upload button used for Quality & Document fields. */
function DocUpload({ label, hint, fileName, onPick, onClear }: { label: string; hint?: string; fileName: string; onPick: () => void; onClear: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{label}</label>
      {hint && <p className={`${font} text-[11.5px] text-gray-500 -mt-1`}>{hint}</p>}
      <button type="button" onClick={onPick}
        className={`flex items-center gap-3 h-12 px-5 rounded-full border-2 border-dashed cursor-pointer transition-colors text-left ${fileName ? "border-[#319754] bg-[#319754]/5" : "border-gray-300 hover:border-[#319754]/60 bg-[#fafafa]"}`}>
        {fileName ? <FileText className="size-4 text-[#319754] shrink-0" strokeWidth={2} /> : <Upload className="size-4 text-gray-400 shrink-0" strokeWidth={2} />}
        <span className={`${font} text-[13px] flex-1 truncate ${fileName ? "text-[#1d5b32]" : "text-gray-500"}`} style={{ fontWeight: fileName ? 600 : 500 }}>
          {fileName || "คลิกเพื่อแนบเอกสาร"}
        </span>
        {fileName && (
          <span onClick={(e) => { e.stopPropagation(); onClear(); }}
            role="button" className="size-6 rounded-full hover:bg-gray-100 flex items-center justify-center shrink-0">
            <X className="size-3.5 text-gray-500" strokeWidth={2.4} />
          </span>
        )}
      </button>
    </div>
  );
}

/** Non-interactive form-field preview — shows the Tester-facing input control
 *  for each question type so the owner knows exactly what the form will look like. */
function FormFieldPreview({ type, options }: { type: QuestionType; options?: string[] }) {
  switch (type) {
    case "scale_1_5":
      return (
        <div className="flex items-center gap-2">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" disabled
              className={`${font} size-10 rounded-full border-2 border-gray-200 bg-white text-[13px] text-gray-500 cursor-not-allowed transition-colors hover:border-[#319754]/40`}
              style={{ fontWeight: 600 }}>{n}</button>
          ))}
          <span className={`${font} text-[11px] text-gray-400 ml-2`}>(1 = น้อย, 5 = มาก)</span>
        </div>
      );
    case "stars_1_5":
      return (
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((n) => (
            <span key={n} className="size-7 inline-flex items-center justify-center text-[22px] text-gray-300">★</span>
          ))}
          <span className={`${font} text-[11px] text-gray-400 ml-2`}>(แตะดาวเพื่อให้คะแนน)</span>
        </div>
      );
    case "nps_0_10":
      return (
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 11 }, (_, n) => (
            <button key={n} type="button" disabled
              className={`${font} min-w-[32px] h-9 px-2 rounded-lg border-2 border-gray-200 bg-white text-[12px] text-gray-500 cursor-not-allowed`}
              style={{ fontWeight: 600 }}>{n}</button>
          ))}
          <p className={`${font} text-[10.5px] text-gray-400 w-full mt-1 flex justify-between`}>
            <span>0 = ไม่แนะนำเลย</span><span>10 = แนะนำสุด ๆ</span>
          </p>
        </div>
      );
    case "multiple_choice":
      return (
        <div className="flex flex-col gap-2">
          {(options && options.length > 0 ? options : ["ตัวเลือกที่ 1", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3"]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-not-allowed">
              <span className="size-4 rounded-full border-2 border-gray-300 inline-block shrink-0" />
              <span className={`${font} text-[12.5px] text-gray-500`}>{opt}</span>
            </label>
          ))}
        </div>
      );
    case "tag":
      return (
        <div className="flex flex-wrap gap-2">
          {["นุ่ม", "ลื่น", "ฉ่ำ", "ซึมไว", "เย็น", "อื่น ๆ..."].map((t) => (
            <span key={t} className={`${font} text-[11.5px] px-3 py-1 rounded-full border-2 border-gray-200 bg-white text-gray-600`}>
              {t}
            </span>
          ))}
        </div>
      );
    case "conditional":
      return (
        <div className="flex gap-2">
          {["ไม่มี", "มี (ระบุ)"].map((opt, i) => (
            <button key={opt} type="button" disabled
              className={`${font} flex-1 h-10 rounded-lg border-2 ${i === 0 ? "border-[#319754]/30 bg-[#319754]/[0.04] text-[#1d5b32]" : "border-gray-200 bg-white text-gray-600"} text-[12.5px] cursor-not-allowed`}
              style={{ fontWeight: 500 }}>
              {opt}
            </button>
          ))}
        </div>
      );
    case "text":
      return (
        <div className="border-2 border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
          <p className={`${font} text-[12px] text-gray-400`}>พิมพ์คำตอบที่นี่...</p>
        </div>
      );
    case "ab_choice":
      return (
        <div className="grid grid-cols-2 gap-2">
          {["สูตร A", "สูตร B"].map((opt) => (
            <button key={opt} type="button" disabled
              className={`${font} h-12 rounded-xl border-2 border-gray-200 bg-white text-gray-600 text-[13px] cursor-not-allowed`}
              style={{ fontWeight: 600 }}>
              {opt}
            </button>
          ))}
        </div>
      );
    default:
      return null;
  }
}

/** ============================================================
 *  TrialDetailModal — Hero card + 3 tabs (overview, applicants, info)
 *  ============================================================ */
function TrialDetailPage({ product, onBack, onDelete }: {
  product: TrialProduct;
  applicants: Registration[];  // unused — kept for compat with caller
  onBack: () => void;
  onDelete?: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "applicants" | "info">("overview");
  /** Read-only form preview modal — shows the form Tester will see */
  const [formPreviewOpen, setFormPreviewOpen] = useState(false);

  // Live registrations — filter to this trial product so mutations (approve/reject) re-render
  const { regs, updateOne } = useAllRegistrations();
  const applicants = useMemo(
    () => regs.filter((r) => r.trialId === product.id).sort((a, b) => b.submittedAt - a.submittedAt),
    [regs, product.id]
  );

  // Filter pills state (mirrors OwnerTrialsTracking)
  type FilterKey = "all" | "pending_approval" | "approved" | "evaluated" | "rejected";
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const countByStatus = (s: RegistrationStatus) => applicants.filter((r) => getRegistrationStatus(r) === s).length;
  const filteredApplicants = useMemo(() => {
    let result = applicants;
    if (filter !== "all") result = result.filter((r) => getRegistrationStatus(r) === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((r) => (r.name || "").toLowerCase().includes(q) || (r.phone || "").includes(q));
    }
    return result;
  }, [applicants, filter, search]);

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

  // Stats derived from applicants
  const evaluated = applicants.filter((r) => !!r.evaluatedAt);
  const approved = applicants.filter((r) => !!r.approvedAt && !r.rejectedAt && !r.evaluatedAt);
  const pending = applicants.filter((r) => !r.approvedAt && !r.rejectedAt && !r.evaluatedAt);
  const rejected = applicants.filter((r) => !!r.rejectedAt);
  const avgRating = evaluated.length > 0
    ? evaluated.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / evaluated.length
    : 0;
  const recommendCount = evaluated.filter((r) => r.evaluation?.wouldRecommend).length;
  const recommendPct = evaluated.length > 0 ? Math.round((recommendCount / evaluated.length) * 100) : 0;

  // Real seat count = applicants who are actively registered (approved + currently testing + evaluated)
  // Pending and rejected don't occupy a seat
  const spotsTakenReal = applicants.filter((r) => !r.rejectedAt).length;
  const spotsLeft = Math.max(0, product.spotsTotal - spotsTakenReal);
  const spotsPct = Math.round((spotsTakenReal / product.spotsTotal) * 100);

  return (
    <div>
      {/* Top row: back button | edit + export */}
      <div className="flex items-center justify-between mb-5 gap-2 flex-wrap">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info(`แก้ไขสินค้า: ${product.name}`)}
            title="แก้ไขข้อมูลสินค้า"
            className={`${font} inline-flex items-center justify-center size-10 rounded-full bg-white border border-gray-200 hover:border-[#319754] hover:text-[#319754] text-gray-600 cursor-pointer transition-colors`}>
            <Pencil className="size-4" strokeWidth={2.4} />
          </button>
          <button
            onClick={() => {
              if (!onDelete) { toast.info("ฟังก์ชันลบยังไม่พร้อมใช้งาน"); return; }
              if (!confirm(`ลบสินค้าทดลอง "${product.name}"?\nการลบจะนำคุณกลับไปที่ทะเบียนสินค้าทดลอง`)) return;
              onDelete();
              toast.success(`ลบ: ${product.name}`);
              onBack();
            }}
            title="ลบสินค้าทดลอง"
            className={`${font} inline-flex items-center justify-center size-10 rounded-full bg-white border border-gray-200 hover:border-[#ff3b30] hover:text-[#ff3b30] hover:bg-[#ff3b30]/5 text-gray-600 cursor-pointer transition-colors`}>
            <Trash2 className="size-4" strokeWidth={2.4} />
          </button>
          {/* Export — popover dropdown (matches Report page pattern) */}
          <Popover>
            <PopoverTrigger asChild>
              <button aria-label="ส่งออก"
                className={`${font} inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer transition-shadow shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
                style={{ fontWeight: 600 }}>
                <Download className="size-4" strokeWidth={2.4} />
                ส่งออก
                <ChevronDown className="size-3.5" strokeWidth={2.4} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button onClick={() => toast.success(`ส่งออก Excel: ${product.name}`)}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
                <span>Excel (.xlsx)</span>
              </button>
              <button onClick={() => toast.success(`ส่งออก PDF: ${product.name}`)}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileText className="size-4 text-[#dc2626]" />
                <span>PDF (.pdf)</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* ===== HERO CARD ===== */}
        <div className="relative bg-gradient-to-br from-[#319754] via-[#287745] to-[#1d5b32] p-4 overflow-hidden">
          <Sparkles className="absolute -top-4 -right-4 size-32 text-white/5" strokeWidth={1.5} />
          <div className="relative flex items-start gap-4">
            {/* Product image */}
            <div className="size-20 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Text info */}
            <div className="flex-1 min-w-0 pr-12">
              <p className={`${font} text-[10.5px] text-white/75 uppercase tracking-wider mb-1`} style={{ fontWeight: 600 }}>{product.category}</p>
              <h2 className={`${font} text-[18px] text-white leading-tight`} style={{ fontWeight: 700 }}>{product.name}</h2>
              <p className={`${font} text-[12px] text-white/85 mt-1 leading-snug line-clamp-2`}>{product.tagline}</p>
              {product.studioName && (
                <p className={`${font} text-[11px] text-white/70 mt-2 inline-flex items-center gap-1`}>
                  <span className="size-1.5 rounded-full bg-white/70" />
                  {product.studioName}
                </p>
              )}
            </div>
          </div>

          {/* KPI strip — minimal inline labels separated by thin dividers */}
          <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
            {[
              { label: "ที่นั่ง",       value: `${spotsTakenReal}/${product.spotsTotal}`, sub: `${spotsLeft} เหลือ` },
              { label: "เวลาเหลือ",     value: `${product.endsInDays}`, sub: "วัน" },
              { label: "คะแนนสะสม",     value: `${product.rewardPoints}`, sub: "pts" },
              { label: "ความพึงพอใจ",   value: avgRating > 0 ? avgRating.toFixed(1) : "—", sub: evaluated.length > 0 ? `${evaluated.length} รีวิว` : "ยังไม่มี" },
            ].map((k, i, arr) => (
              <Fragment key={k.label}>
                <div className="inline-flex items-baseline gap-1.5">
                  <span className={`${font} text-[10px] text-white/65`} style={{ fontWeight: 500 }}>{k.label}</span>
                  <span className={`${font} text-[14px] text-white tabular-nums leading-none`} style={{ fontWeight: 700 }}>{k.value}</span>
                  <span className={`${font} text-[10px] text-white/65`}>{k.sub}</span>
                </div>
                {i < arr.length - 1 && <span className="h-3 w-px bg-white/20" aria-hidden />}
              </Fragment>
            ))}
          </div>

          {/* ===== TABS NAV — white pill bar, green active ===== */}
          <div className="relative mt-4">
            <div className="inline-flex items-center gap-1 bg-white rounded-full p-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              {([
                { key: "overview" as const,    label: "ภาพรวม",     icon: BarChart3 },
                { key: "applicants" as const,  label: "ผู้สมัคร",     icon: Users, badge: applicants.length },
                { key: "info" as const,        label: "ข้อมูลสินค้า", icon: FileText },
              ]).map((t) => {
                const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`${font} relative inline-flex items-center gap-1.5 px-4 h-[34px] rounded-full text-[12.5px] cursor-pointer transition-colors ${
                      active ? "text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                    style={{ fontWeight: active ? 700 : 500 }}>
                    {active && (
                      <motion.span layoutId="trial-detail-tab"
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3fb56b] to-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.35)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <t.icon className="size-3.5 relative z-10" strokeWidth={2.2} />
                    <span className="relative z-10">{t.label}</span>
                    {t.badge !== undefined && t.badge > 0 && (
                      <span className={`${font} relative z-10 text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-[#ff4757] text-white"}`} style={{ fontWeight: 600 }}>{t.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TAB CONTENT — no outer wrapper, content cards sit directly on page ===== */}
      <div className="mt-4">
          {tab === "overview" && (
            <TrialOverviewDashboard
              product={product}
              applicants={applicants}
              evaluated={evaluated}
              pending={pending}
              approved={approved}
              rejected={rejected}
              spotsPct={spotsPct}
              recommendPct={recommendPct}
            />
          )}

          {tab === "applicants" && (
            <div className="flex flex-col gap-4">
              {/* Filter pills + search — matches OwnerTrialsTracking style */}
              <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
                  {([
                    { key: "all" as const,              label: "ทั้งหมด",     count: applicants.length,             icon: FlaskConical },
                    { key: "pending_approval" as const, label: "รออนุมัติ",   count: countByStatus("pending_approval"), icon: AlertCircle },
                    { key: "approved" as const,         label: "กำลังทดสอบ",  count: countByStatus("approved"),         icon: Clock },
                    { key: "evaluated" as const,        label: "ประเมินแล้ว", count: countByStatus("evaluated"),        icon: Check },
                    { key: "rejected" as const,         label: "ปฏิเสธ",      count: countByStatus("rejected"),         icon: Ban },
                  ]).map((t) => {
                    const isAct = filter === t.key;
                    return (
                      <motion.button key={t.key} onClick={() => setFilter(t.key)}
                        whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                        {isAct && (
                          <motion.span layoutId="trialDetailApplicantFilter"
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
                    className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
                    placeholder="ค้นหาชื่อ, เบอร์..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
                    <Search className="size-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Card list — uses shared RegistrationCard (correct status colors + evaluation modal) */}
              {filteredApplicants.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
                  <Users className="size-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
                  <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>ไม่มีรายการที่ตรงกับเงื่อนไข</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {filteredApplicants.map((r, i) => (
                      <RegistrationCard
                        key={`${r.name}-${r.submittedAt}-${i}`}
                        reg={r}
                        product={product}
                        onApprove={() => approve(r)}
                        onReject={() => reject(r)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {tab === "info" && (
            <div className="space-y-4">
              {/* Basic info card */}
              <InfoCard title="ข้อมูลพื้นฐาน" rows={[
                { label: "ชื่อสินค้า",     value: product.name },
                { label: "หมวดหมู่",      value: product.category },
                { label: "Studio",        value: product.studioName ?? "—" },
                { label: "Tagline",       value: product.tagline },
              ]} />

              {/* Trial conditions */}
              <InfoCard title="เงื่อนไขการทดสอบ" rows={[
                { label: "จำนวนที่นั่ง",       value: `${product.spotsTotal} ที่ (เหลือ ${spotsLeft})` },
                { label: "ระยะเวลาทดสอบ",     value: `${product.endsInDays} วัน` },
                { label: "คะแนนตอบแทน",       value: `${product.rewardPoints} pts` },
              ]} />

              {/* Detail content (if exists) */}
              {product.detail?.productInfo && product.detail.productInfo.length > 0 && (
                <InfoCard title="รายละเอียดสินค้า" rows={product.detail.productInfo.map((p) => ({ label: p.label, value: p.value }))} />
              )}

              {/* Eval card — document card + รายละเอียดการประเมิน merged into one container */}
              {product.whatToTest && product.whatToTest.length > 0 && (
                <div className="relative bg-white border border-gray-200 rounded-[14px] p-4 overflow-hidden">
                  {/* Decorative document corner fold */}
                  <span aria-hidden className="absolute top-0 right-0 size-[20px] bg-[#319754]/10"
                    style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

                  {/* Header row: icon + title + count + Eye action */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-9 rounded-[8px] bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`${font} text-[13.5px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>แบบประเมิน Tester</p>
                      <p className={`${font} text-[11px] text-gray-500 mt-0.5 tabular-nums`}>
                        {product.whatToTest.length + 2} คำถาม
                      </p>
                    </div>
                    <button type="button"
                      onClick={() => setFormPreviewOpen(true)}
                      title="ดูตัวอย่างฟอร์มที่ Tester จะเห็น"
                      className="size-8 rounded-full hover:bg-[#319754]/10 text-gray-500 hover:text-[#319754] flex items-center justify-center cursor-pointer transition-colors shrink-0">
                      <Eye className="size-4" strokeWidth={2.2} />
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 mb-3" />

                  {/* Phase chip(s) — muted neutral style */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    <span className={`${font} text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600`}
                      style={{ fontWeight: 500 }}>
                      ภาพรวมการประเมิน
                      <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{product.whatToTest.length}</span>
                    </span>
                    <span className={`${font} text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600`}
                      style={{ fontWeight: 500 }}>
                      ทุกแบบประเมินรวมเสมอ
                      <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>2</span>
                    </span>
                  </div>

                  {/* รายละเอียดการประเมิน — inside same card */}
                  <p className={`${font} text-[12px] text-gray-500 uppercase tracking-wide mb-2`} style={{ fontWeight: 600 }}>รายละเอียดการประเมิน</p>
                  <div className="bg-gray-50/70 rounded-xl p-3.5 border border-gray-100">
                    <ul className="space-y-1.5">
                      {product.whatToTest.map((item, i) => (
                        <li key={i} className={`${font} text-[13px] text-[#1a1a1a] leading-relaxed`}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* ===== Form preview modal — opens from the document card Eye icon ===== */}
      <AnimatePresence>
        {formPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFormPreviewOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[640px] bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                    <Eye className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>พรีวิวแบบประเมิน</h2>
                    <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>มุมมองที่ Tester จะเห็นจริง — ไม่สามารถกรอกได้</p>
                  </div>
                </div>
                <button onClick={() => setFormPreviewOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fafafa] to-white px-5 py-4 space-y-5">
                {/* Phase 1: per-criterion (Scale 1-5) */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] bg-[#319754]/15 text-[#319754]`} style={{ fontWeight: 700 }}>
                      ภาพรวมการประเมิน
                    </span>
                    <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{product.whatToTest.length} คำถาม</span>
                  </div>
                  <div className="space-y-3">
                    {product.whatToTest.map((q, idx) => (
                      <div key={q} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                        <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
                          <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums bg-[#319754]/15 text-[#319754]" style={{ fontWeight: 700 }}>{idx + 1}</span>
                          {q}
                        </p>
                        <FormFieldPreview type="scale_1_5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phase 2: always */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] bg-[#1a1a1a]/10 text-[#1a1a1a]`} style={{ fontWeight: 700 }}>
                      ทุกแบบประเมินรวมเสมอ
                    </span>
                    <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>2 คำถาม</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                      <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
                        <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums bg-[#1a1a1a]/10 text-[#1a1a1a]" style={{ fontWeight: 700 }}>1</span>
                        ความพึงพอใจโดยรวม
                      </p>
                      <FormFieldPreview type="stars_1_5" />
                    </div>
                    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                      <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
                        <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums bg-[#1a1a1a]/10 text-[#1a1a1a]" style={{ fontWeight: 700 }}>2</span>
                        จะแนะนำให้คนอื่นใช้หรือไม่
                      </p>
                      <FormFieldPreview type="ab_choice" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-3 bg-white">
                <p className={`${font} text-[11px] text-gray-500`}>
                  {product.whatToTest.length + 2} คำถาม · 2 เฟส
                </p>
                <button onClick={() => setFormPreviewOpen(false)}
                  className={`${font} h-10 px-5 rounded-full text-gray-600 hover:bg-gray-100 text-[13px] cursor-pointer transition-colors`}
                  style={{ fontWeight: 500 }}>
                  ปิด
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Helpers for the 3D bar chart (matches Report page style). */
function shadeColor(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

/** 3D-look bar shape (vertical bars) — top face lighter, right face darker, front rect for label color. */
function Bar3D(props: any) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0 || !width) return null;
  const depth = Math.min(Math.max(width * 0.28, 5), 9);
  const top = shadeColor(fill, 12);
  const right = shadeColor(fill, -18);
  return (
    <g>
      <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={right} />
      <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={top} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
}

/** 3D-look bar shape (horizontal bars) — depth scales with bar thickness (height), not length. */
function Bar3DHorizontal(props: any) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0 || !width || width <= 0) return null;
  const depth = Math.min(Math.max(height * 0.28, 5), 9);
  const top = shadeColor(fill, 12);
  const right = shadeColor(fill, -18);
  return (
    <g>
      <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={right} />
      <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={top} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
}

/** ============================================================
 *  Trial detail overview dashboard — drives all widgets from the
 *  evaluation form structure (per-question stats) plus demographics
 *  (gender, age) so the owner can analyse who answered what.
 *  ============================================================ */
function TrialOverviewDashboard({ product, applicants, evaluated, pending, approved, rejected, spotsPct, recommendPct }: {
  product: TrialProduct;
  applicants: Registration[];
  evaluated: Registration[];
  pending: Registration[];
  approved: Registration[];
  rejected: Registration[];
  spotsPct: number;
  recommendPct: number;
}) {
  /** Per-criterion Scale 1-5 distribution — one chart per whatToTest item */
  const criteriaStats = useMemo(() => {
    return product.whatToTest.map((label) => {
      const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      let sum = 0, count = 0;
      evaluated.forEach((r) => {
        const v = r.evaluation?.criteria?.[label];
        if (typeof v === "number" && v >= 1 && v <= 5) {
          dist[v]++;
          sum += v;
          count++;
        }
      });
      return { label, dist, avg: count > 0 ? sum / count : 0, count };
    });
  }, [evaluated, product.whatToTest]);

  /** Gender breakdown across all applicants */
  const genderStats = useMemo(() => {
    const counts: Record<string, number> = { male: 0, female: 0, lgbtq: 0, unknown: 0 };
    applicants.forEach((r) => {
      const g = r.gender || "unknown";
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [applicants]);

  /** Age range breakdown across all applicants */
  const ageStats = useMemo(() => {
    const ranges = ["15-24", "25-34", "35-44", "45-54", "55+"] as const;
    const counts: Record<string, number> = {};
    ranges.forEach((r) => { counts[r] = 0; });
    let unknown = 0;
    applicants.forEach((r) => {
      if (r.ageRange && ranges.includes(r.ageRange)) counts[r.ageRange]++;
      else unknown++;
    });
    return { ranges: [...ranges], counts, unknown };
  }, [applicants]);

  const recommendCount = evaluated.filter((r) => r.evaluation?.wouldRecommend).length;

  // Average overall rating (for hero stat)
  const avgOverall = evaluated.length > 0
    ? evaluated.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / evaluated.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Demographics — gender donut + age bars side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Gender — Figma design: 4 pastel circles + 3D illustrations clipped by card edge */}
        <div className="bg-white rounded-2xl border border-gray-100 pt-5 px-5 pb-0 overflow-hidden">
          <div className="mb-4">
            <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>เพศของผู้สมัคร</h3>
            <p className={`${font} text-[12px] text-gray-500 mt-1`}>สัดส่วนเพศของ Tester ทั้งหมดในการทดลองนี้ — hover ดูรายละเอียดเพิ่มเติม</p>
          </div>
          {applicants.length === 0 ? (
            <p className={`${font} text-[12px] text-gray-400 italic pb-5`}>ยังไม่มีข้อมูล</p>
          ) : (
            <div className="grid grid-cols-4 gap-3 items-end">
              {([
                { key: "female",  label: "หญิง",   bg: "#fbcfe8", accent: "#ec4899", text: "#1a1a1a", img: genderWomenImg, scale: 1 },
                { key: "male",    label: "ชาย",     bg: "#bfdbfe", accent: "#3b82f6", text: "#1a1a1a", img: genderMenImg,   scale: 1 },
                { key: "lgbtq",   label: "LGBTQ+", bg: "#e9d5ff", accent: "#a855f7", text: "#1a1a1a", img: genderLgbtqImg, scale: 1 },
                { key: "unknown", label: "อื่นๆ",   bg: "#e5e7eb", accent: "#6b7280", text: "#1a1a1a", img: genderOtherImg, scale: 1 },
              ] as const).map((g) => {
                const cnt = genderStats[g.key] || 0;
                const pct = applicants.length > 0 ? Math.round((cnt / applicants.length) * 100) : 0;
                // Demographic breakdown for this gender
                const groupApplicants = applicants.filter((r) => (r.gender || "unknown") === g.key);
                const evaluatedInGroup = groupApplicants.filter((r) => !!r.evaluatedAt);
                const recommendInGroup = evaluatedInGroup.filter((r) => r.evaluation?.wouldRecommend).length;
                const recommendPctInGroup = evaluatedInGroup.length > 0 ? Math.round((recommendInGroup / evaluatedInGroup.length) * 100) : 0;
                const avgRatingInGroup = evaluatedInGroup.length > 0
                  ? evaluatedInGroup.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / evaluatedInGroup.length
                  : 0;
                const ageBreakdown = ["15-24", "25-34", "35-44", "45-54", "55+"]
                  .map((ar) => ({ range: ar, cnt: groupApplicants.filter((r) => r.ageRange === ar).length }))
                  .filter((a) => a.cnt > 0)
                  .sort((a, b) => b.cnt - a.cnt);
                const topAge = ageBreakdown[0];
                return (
                  <HoverCard key={g.key} openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="group/gender relative flex flex-col items-center cursor-pointer">
                        {/* Pastel circle — animated lift + brighten on hover */}
                        <motion.div
                          whileHover={{ y: -4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="relative w-[78%] aspect-square rounded-full flex flex-col items-center justify-center px-2 transition-shadow group-hover/gender:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)]"
                          style={{ background: g.bg }}>
                          <p className={`${font} text-[13px] text-center transition-colors`} style={{ color: g.text, fontWeight: 500 }}>{g.label}</p>
                          <p className={`${font} text-[26px] tabular-nums leading-none my-1.5 transition-colors`} style={{ color: g.text, fontWeight: 700 }}>{cnt}</p>
                          <p className={`${font} text-[12px] tabular-nums`} style={{ color: g.text, fontWeight: 500 }}>{pct}%</p>
                        </motion.div>
                        {/* Bigger illustration — fades out at the bottom */}
                        <motion.img src={g.img} alt={g.label}
                          whileHover={{ scale: g.scale * 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="relative z-10 w-full h-auto pointer-events-none select-none -mt-[45%]"
                          style={{
                            aspectRatio: "1 / 1",
                            objectFit: "contain",
                            objectPosition: "bottom",
                            transform: `scale(${g.scale})`,
                            transformOrigin: "bottom center",
                            WebkitMaskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)",
                            maskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)",
                          }} />
                      </div>
                    </HoverCardTrigger>
                    {cnt > 0 && (
                      <HoverCardContent side="top" align="center" sideOffset={8}
                        className="bg-white text-[#1a1a1a] border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] min-w-[240px]">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                          <span className="size-2.5 rounded-full shrink-0" style={{ background: g.accent }} />
                          <p className={`${font} text-[13px]`} style={{ color: g.accent, fontWeight: 700 }}>{g.label}</p>
                          <span className={`${font} text-[10.5px] text-gray-400 tabular-nums ml-auto`}>{cnt}/{applicants.length} · {pct}%</span>
                        </div>
                        <div className="space-y-1.5">
                          {topAge && (
                            <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                              <span className="inline-flex items-center gap-1.5"><Calendar className="size-3 text-gray-400" strokeWidth={2.2} />อายุส่วนใหญ่</span>
                              <span className="tabular-nums text-[#1a1a1a]" style={{ fontWeight: 600 }}>{topAge.range} ({topAge.cnt} คน)</span>
                            </div>
                          )}
                          {evaluatedInGroup.length > 0 && (
                            <>
                              <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                                <span className="inline-flex items-center gap-1.5"><Check className="size-3 text-gray-400" strokeWidth={2.4} />ประเมินแล้ว</span>
                                <span className="tabular-nums text-[#1a1a1a]" style={{ fontWeight: 600 }}>{evaluatedInGroup.length}/{cnt} คน</span>
                              </div>
                              <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                                <span className="inline-flex items-center gap-1.5"><Star className="size-3 fill-amber-400 text-amber-400" strokeWidth={0} />คะแนนเฉลี่ย</span>
                                <span className="tabular-nums text-amber-700" style={{ fontWeight: 700 }}>{avgRatingInGroup.toFixed(1)}/5</span>
                              </div>
                              <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                                <span className="inline-flex items-center gap-1.5"><ThumbsUp className="size-3 text-gray-400" strokeWidth={2.2} />แนะนำ</span>
                                <span className="tabular-nums text-[#319754]" style={{ fontWeight: 700 }}>{recommendInGroup}/{evaluatedInGroup.length} ({recommendPctInGroup}%)</span>
                              </div>
                            </>
                          )}
                        </div>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Age range bars */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="mb-4">
            <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>ช่วงอายุของผู้สมัคร</h3>
            <p className={`${font} text-[12px] text-gray-500 mt-1`}>การกระจายตัวของช่วงอายุ Tester — กลุ่มที่ใหญ่ที่สุดถูกเน้นเป็นสีเขียว</p>
          </div>
          {applicants.length === 0 ? (
            <p className={`${font} text-[12px] text-gray-400 italic`}>ยังไม่มีข้อมูล</p>
          ) : (() => {
            const maxCnt = Math.max(...ageStats.ranges.map((r) => ageStats.counts[r] || 0));
            const chartData = ageStats.ranges.map((r) => ({
              label: r,
              count: ageStats.counts[r] || 0,
              isMax: (ageStats.counts[r] || 0) === maxCnt && maxCnt > 0,
            }));
            return (
              <div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }} barCategoryGap="22%">
                    <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickMargin={12} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
                    <RechartsTooltip
                      cursor={{ fill: "rgba(148,163,184,0.08)" }}
                      content={({ active, payload, label }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        const pct = applicants.length > 0 ? Math.round((d.count / applicants.length) * 100) : 0;
                        return (
                          <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                            <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>ช่วงอายุ {label}</p>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[12.5px] text-gray-600 inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#319754]" />ผู้สมัคร
                              </span>
                              <span className="text-[13.5px] tabular-nums text-[#319754]" style={{ fontWeight: 700 }}>{d.count} คน ({pct}%)</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="count" name="จำนวนผู้สมัคร" maxBarSize={48} animationDuration={700} shape={<Bar3D />}>
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.isMax ? "#319754" : "#9ca3af"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {ageStats.unknown > 0 && (
                  <p className={`${font} text-[10.5px] text-gray-400 italic mt-2 pt-2 border-t border-gray-100`}>ไม่ระบุอายุ: {ageStats.unknown} คน</p>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Per-question evaluation analytics — driven by product.whatToTest */}
      {evaluated.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="size-14 rounded-2xl bg-gray-50 mx-auto mb-3 flex items-center justify-center">
            <BarChart3 className="size-7 text-gray-300" strokeWidth={1.5} />
          </div>
          <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 600 }}>ยังไม่มีผลประเมินจาก Tester</p>
          <p className={`${font} text-[11.5px] text-gray-400 mt-1 max-w-[300px] mx-auto`}>เมื่อ Tester ส่งแบบประเมินเข้ามา ระบบจะวิเคราะห์คำตอบรายข้อให้ที่นี่</p>
        </div>
      ) : (
        <>
          {/* Phase 1 — ภาพรวมการประเมิน (per-criterion histograms with hover detail) */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>ภาพรวมการประเมิน</h3>
                <p className={`${font} text-[12px] text-gray-500 mt-1`}>การกระจายคะแนน 1-5 ของแต่ละเกณฑ์การประเมิน — hover แท่งเพื่อดูข้อมูลผู้ตอบรายเพศ</p>
              </div>
              <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] tabular-nums bg-[#319754]/10 text-[#319754] shrink-0`} style={{ fontWeight: 600 }}>
                {product.whatToTest.length} คำถาม · {evaluated.length} ผู้ตอบ
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {criteriaStats.map((c, idx) => {
                const topAnswer = [5, 4, 3, 2, 1].reduce((a, b) => (c.dist[a] >= c.dist[b] ? a : b), 5);
                const chartData = [1, 2, 3, 4, 5].map((n) => {
                  const cnt = c.dist[n] || 0;
                  const respondents = evaluated.filter((r) => r.evaluation?.criteria?.[c.label] === n);
                  return {
                    label: String(n),
                    count: cnt,
                    isTop: n === topAnswer && cnt > 0,
                    female: respondents.filter((r) => r.gender === "female").length,
                    male: respondents.filter((r) => r.gender === "male").length,
                    lgbtq: respondents.filter((r) => r.gender === "lgbtq").length,
                  };
                });
                // For horizontal display we want 5 on top, 1 at bottom
                const horizontalData = [...chartData].reverse();
                return (
                  <div key={c.label} className="bg-gradient-to-br from-gray-50/40 to-transparent rounded-xl p-3.5 border border-gray-100">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <p className={`${font} text-[13px] text-[#1a1a1a] flex items-start gap-2 flex-1 min-w-0`} style={{ fontWeight: 600 }}>
                        <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] tabular-nums bg-[#319754] text-white shrink-0 mt-px" style={{ fontWeight: 700 }}>{idx + 1}</span>
                        <span className="line-clamp-2">{c.label}</span>
                      </p>
                      <div className={`${font} inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[11px] shrink-0`} style={{ fontWeight: 700 }}>
                        <Star className="size-3 fill-amber-500 text-amber-500" strokeWidth={0} />
                        <span className="tabular-nums">{c.avg > 0 ? c.avg.toFixed(1) : "—"}</span>
                        <span className="text-amber-500 font-normal text-[10px]">/5</span>
                      </div>
                    </div>
                    {/* 3D horizontal bar chart */}
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={horizontalData} layout="vertical" margin={{ top: 4, right: 24, left: 0, bottom: 4 }} barCategoryGap="22%">
                        <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" horizontal={false} />
                        <XAxis type="number" hide allowDecimals={false} />
                        <YAxis dataKey="label" type="category" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickMargin={12} width={32} />
                        <RechartsTooltip
                          cursor={{ fill: "rgba(148,163,184,0.08)" }}
                          content={({ active, payload, label }: any) => {
                            if (!active || !payload?.length) return null;
                            const d = payload[0].payload;
                            const pct = c.count > 0 ? Math.round((d.count / c.count) * 100) : 0;
                            return (
                              <div className={`${font} bg-white rounded-lg shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] border border-gray-100 p-2.5 min-w-[160px]`}>
                                <p className="text-[11.5px] mb-1.5 inline-flex items-center gap-1.5 text-amber-700" style={{ fontWeight: 700 }}>
                                  <Star className="size-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                                  {label} ดาว · {d.count} คน <span className="text-gray-400 font-normal">({pct}%)</span>
                                </p>
                                <div className="text-[10.5px] text-gray-700 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                  {d.female > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-pink-500" />หญิง {d.female}</span>}
                                  {d.male > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-blue-500" />ชาย {d.male}</span>}
                                  {d.lgbtq > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-purple-500" />LGBTQ+ {d.lgbtq}</span>}
                                </div>
                              </div>
                            );
                          }}
                        />
                        <Bar dataKey="count" maxBarSize={20} animationDuration={700} radius={[10, 10, 10, 10]}>
                          {horizontalData.map((entry, i) => (
                            <Cell key={i} fill={entry.isTop ? "#319754" : "#fbbf24"} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Phase 2 — ทุกแบบประเมินรวมเสมอ — split into 2 separate cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 — Overall rating vertical bar chart */}
              {(() => {
                const counts = [1, 2, 3, 4, 5].map((star) => {
                  const respondents = evaluated.filter((r) => r.evaluation?.overall === star);
                  return {
                    star,
                    cnt: respondents.length,
                    female: respondents.filter((r) => r.gender === "female").length,
                    male: respondents.filter((r) => r.gender === "male").length,
                    lgbtq: respondents.filter((r) => r.gender === "lgbtq").length,
                    ageBreakdown: ["15-24", "25-34", "35-44", "45-54", "55+"].map((ar) => ({
                      range: ar,
                      cnt: respondents.filter((r) => r.ageRange === ar).length,
                    })).filter((a) => a.cnt > 0),
                  };
                });
                const max = Math.max(1, ...counts.map((c) => c.cnt));
                const topStar = counts.reduce((a, b) => (a.cnt >= b.cnt ? a : b)).star;
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>ความพึงพอใจโดยรวม</h3>
                        <p className={`${font} text-[12px] text-gray-500 mt-1`}>การกระจายคะแนนดาว 1-5 จากผู้ตอบทั้งหมด — hover แท่งเพื่อดูข้อมูลผู้ตอบ</p>
                      </div>
                      <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] tabular-nums bg-amber-50 text-amber-700 shrink-0`} style={{ fontWeight: 600 }}>
                        {evaluated.length} ผู้ตอบ
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex items-end gap-2 h-[180px] pb-9">
                        {counts.map(({ star, cnt, female, male, lgbtq, ageBreakdown }) => {
                          const pct = evaluated.length > 0 ? Math.round((cnt / evaluated.length) * 100) : 0;
                          const heightPct = (cnt / max) * 100;
                          const isTop = star === topStar && cnt > 0;
                          return (
                            <div key={star} className="group/vbar relative flex-1 flex flex-col items-center justify-end h-full min-w-0">
                              {/* Count number above stars */}
                              {cnt > 0 && (
                                <span className={`${font} text-[12px] tabular-nums ${isTop ? "text-amber-700" : "text-[#1a1a1a]"}`} style={{ fontWeight: isTop ? 700 : 600 }}>
                                  {cnt}
                                </span>
                              )}
                              {/* Stars row — only filled stars, centered with bar */}
                              <div className="flex items-center justify-center gap-px mt-0.5 mb-1.5 w-full flex-wrap">
                                {Array.from({ length: star }).map((_, i) => (
                                  <Star key={i} className="size-3 fill-amber-500 text-amber-500 shrink-0" strokeWidth={0} />
                                ))}
                              </div>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className={`w-full rounded-t-md cursor-pointer transition-all ${isTop ? "bg-gradient-to-b from-amber-300 to-amber-500 group-hover/vbar:from-amber-400 group-hover/vbar:to-amber-600" : "bg-gradient-to-b from-amber-200/70 to-amber-300/70 group-hover/vbar:from-amber-300 group-hover/vbar:to-amber-400"}`}
                                style={{ minHeight: cnt > 0 ? "8px" : "0" }} />
                              {/* Tooltip — white theme */}
                              {cnt > 0 && (
                                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 opacity-0 scale-95 group-hover/vbar:opacity-100 group-hover/vbar:scale-100 transition-all duration-150">
                                  <div className="bg-white text-[#1a1a1a] border border-gray-100 rounded-lg px-3 py-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] whitespace-nowrap">
                                    <p className={`${font} text-[11.5px] mb-1.5 inline-flex items-center gap-1.5 text-amber-700`} style={{ fontWeight: 700 }}>
                                      <Star className="size-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                                      {star} ดาว · {cnt} คน <span className="text-gray-400 font-normal">({pct}%)</span>
                                    </p>
                                    <div className={`${font} text-[10.5px] text-gray-700 flex items-center gap-3 mb-1`}>
                                      {female > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-pink-500" />หญิง {female}</span>}
                                      {male > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-blue-500" />ชาย {male}</span>}
                                      {lgbtq > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-purple-500" />LGBTQ+ {lgbtq}</span>}
                                    </div>
                                    {ageBreakdown.length > 0 && (
                                      <div className={`${font} text-[10px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5`}>
                                        {ageBreakdown.map((a) => (
                                          <span key={a.range} className="tabular-nums">{a.range}: {a.cnt}</span>
                                        ))}
                                      </div>
                                    )}
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-white border-r border-b border-gray-100" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 flex items-center gap-2 pointer-events-none">
                        {counts.map(({ star, cnt }) => {
                          const pct = evaluated.length > 0 ? Math.round((cnt / evaluated.length) * 100) : 0;
                          const isTop = star === topStar && cnt > 0;
                          return (
                            <div key={star} className="flex-1 flex flex-col items-center min-w-0">
                              <span className={`${font} text-[11px] tabular-nums ${isTop ? "text-amber-700" : "text-gray-500"}`} style={{ fontWeight: isTop ? 700 : 500 }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Q2 — Recommend vertical bar chart with hover tooltips */}
              {(() => {
                const opts = [
                  { val: true,  label: "แนะนำ",    Icon: ThumbsUp,   color: "#319754" },
                  { val: false, label: "ไม่แนะนำ",  Icon: ThumbsDown, color: "#ef4444" },
                ];
                const data = opts.map((o) => {
                  const respondents = evaluated.filter((r) => r.evaluation?.wouldRecommend === o.val);
                  return {
                    ...o,
                    cnt: respondents.length,
                    female: respondents.filter((r) => r.gender === "female").length,
                    male: respondents.filter((r) => r.gender === "male").length,
                    lgbtq: respondents.filter((r) => r.gender === "lgbtq").length,
                    avgRating: respondents.length > 0
                      ? respondents.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / respondents.length
                      : 0,
                    ageBreakdown: ["15-24", "25-34", "35-44", "45-54", "55+"].map((ar) => ({
                      range: ar,
                      cnt: respondents.filter((r) => r.ageRange === ar).length,
                    })).filter((a) => a.cnt > 0),
                  };
                });
                const max = Math.max(1, ...data.map((d) => d.cnt));
                const topVal = data.reduce((a, b) => (a.cnt >= b.cnt ? a : b)).val;
                const recommendCnt = data.find((d) => d.val === true)?.cnt ?? 0;
                const recommendPctCard = evaluated.length > 0 ? Math.round((recommendCnt / evaluated.length) * 100) : 0;
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>จะแนะนำให้คนอื่นใช้หรือไม่</h3>
                        <p className={`${font} text-[12px] text-gray-500 mt-1`}>ความตั้งใจในการแนะนำสินค้าให้ผู้อื่น — ตัวชี้วัดความพึงพอใจที่สูงกว่าคะแนนดาว</p>
                      </div>
                      <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] tabular-nums bg-[#319754]/10 text-[#319754] shrink-0`} style={{ fontWeight: 600 }}>
                        แนะนำ {recommendPctCard}%
                      </span>
                    </div>
                    <div className="relative">
                      <div className="flex items-end justify-center gap-6 h-[160px] pb-9 px-4">
                        {data.map((d) => {
                          const pct = evaluated.length > 0 ? Math.round((d.cnt / evaluated.length) * 100) : 0;
                          const heightPct = (d.cnt / max) * 100;
                          const isTop = d.val === topVal && d.cnt > 0;
                          return (
                            <div key={String(d.val)} className="group/rbar relative flex-1 max-w-[100px] flex flex-col items-center justify-end h-full">
                              {d.cnt > 0 && (
                                <span className={`${font} text-[10.5px] tabular-nums mb-1`} style={{ fontWeight: 700, color: d.color }}>
                                  {d.cnt}
                                </span>
                              )}
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="w-full rounded-t-md cursor-pointer transition-all group-hover/rbar:brightness-110"
                                style={{
                                  minHeight: d.cnt > 0 ? "8px" : "0",
                                  background: isTop ? `linear-gradient(180deg, ${d.color}, ${d.color}dd)` : `linear-gradient(180deg, ${d.color}80, ${d.color}50)`,
                                }} />
                              {/* Tooltip — white theme */}
                              {d.cnt > 0 && (
                                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 opacity-0 scale-95 group-hover/rbar:opacity-100 group-hover/rbar:scale-100 transition-all duration-150">
                                  <div className="bg-white text-[#1a1a1a] border border-gray-100 rounded-lg px-3 py-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] whitespace-nowrap">
                                    <p className={`${font} text-[11.5px] mb-1.5 inline-flex items-center gap-1.5`} style={{ color: d.color, fontWeight: 700 }}>
                                      <d.Icon className="size-3" style={{ color: d.color }} strokeWidth={2.4} />
                                      {d.label} · {d.cnt} คน <span className="text-gray-400 font-normal">({pct}%)</span>
                                    </p>
                                    <div className={`${font} text-[10.5px] text-gray-700 flex items-center gap-3 mb-1`}>
                                      {d.female > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-pink-500" />หญิง {d.female}</span>}
                                      {d.male > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-blue-500" />ชาย {d.male}</span>}
                                      {d.lgbtq > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-purple-500" />LGBTQ+ {d.lgbtq}</span>}
                                    </div>
                                    {d.ageBreakdown.length > 0 && (
                                      <div className={`${font} text-[10px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1`}>
                                        {d.ageBreakdown.map((a) => (
                                          <span key={a.range} className="tabular-nums">{a.range}: {a.cnt}</span>
                                        ))}
                                      </div>
                                    )}
                                    {d.avgRating > 0 && (
                                      <p className={`${font} text-[10px] text-amber-700 inline-flex items-center gap-1`} style={{ fontWeight: 600 }}>
                                        <Star className="size-2.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                                        คะแนนเฉลี่ย {d.avgRating.toFixed(1)}/5
                                      </p>
                                    )}
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-white border-r border-b border-gray-100" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-6 px-4 pointer-events-none">
                        {data.map((d) => {
                          const pct = evaluated.length > 0 ? Math.round((d.cnt / evaluated.length) * 100) : 0;
                          return (
                            <div key={String(d.val)} className="flex-1 max-w-[100px] flex flex-col items-center">
                              <span className={`${font} text-[11px] inline-flex items-center gap-1`} style={{ color: d.color, fontWeight: 700 }}>
                                <d.Icon className="size-3" strokeWidth={2.4} />
                                {d.label}
                              </span>
                              <span className={`${font} text-[9.5px] text-gray-400 tabular-nums`}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
          </div>
        </>
      )}
    </div>
  );
}

function InfoCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className={`${font} text-[12px] text-gray-500 uppercase tracking-wide mb-3`} style={{ fontWeight: 600 }}>{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <p className={`${font} text-[11px] text-gray-400`} style={{ fontWeight: 500 }}>{r.label}</p>
            <p className={`${font} text-[12.5px] text-[#1a1a1a] mt-0.5`} style={{ fontWeight: 500 }}>{r.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
