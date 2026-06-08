export type TrialProduct = {
  id: string;
  name: string;
  tagline: string;
  category: string;
  image: string;
  images?: string[];   // optional extra gallery images; fallback below if omitted
  spotsTotal: number;
  spotsTaken: number;
  endsInDays: number;
  rewardPoints: number;
  whatToTest: string[];
  /** Brand / studio that owns this trial (shown beneath product name) */
  studioName?: string;
  /** Average satisfaction rating from PRIOR test batches (1–5). Omit for first-batch products. */
  prevAvgRating?: number;
  /** How many testers gave the prevAvgRating */
  prevRatingCount?: number;
  /** Detailed product profile shown on the detail page (rendered only if present) */
  detail?: TrialDetail;
  /** Use-case concerns this trial targets (used by the sidebar filter on /trials) */
  concerns?: ConcernKey[];
};

export type ConcernKey = "sleep" | "focus" | "fitness" | "skin" | "general" | "elder";

/** Sidebar filter — keep in sync with the chips on /trials */
export const TRIAL_CONCERNS: { key: ConcernKey; emoji: string; label: string }[] = [
  { key: "sleep",   emoji: "🌙", label: "การนอนหลับ" },
  { key: "focus",   emoji: "☕", label: "สมาธิและการทำงาน" },
  { key: "fitness", emoji: "💪", label: "การออกกำลังกาย" },
  { key: "skin",    emoji: "🌸", label: "ผิวพรรณ" },
  { key: "general", emoji: "🍵", label: "สุขภาพทั่วไป" },
  { key: "elder",   emoji: "🧓", label: "ผู้สูงอายุ" },
];

/** Extended fields for the trial detail page — every section is rendered only if data exists. */
export type TrialDetail = {
  developerName?: string;
  longDescription?: string;
  productInfo?: { label: string; value: string }[];
  certifications?: string[];
  benefits?: string[];
  howToUse?: string[];
  warnings?: string[];
  /** 4 KPI cards in the safety/study section */
  studyStats?: { label: string; value: string; sub?: string }[];
  safetyTests?: string[];
  /** Ingredient list — items with `isActive: true` are highlighted as key actives */
  ingredients?: { name: string; isActive?: boolean }[];
  /** Track / roadmap timeline; mark the current stage with `isCurrent: true` */
  timeline?: { stage: string; date: string; detail: string; isCurrent?: boolean }[];
  /** Previous batch breakdown — per-criterion ratings */
  prevCriteriaRatings?: { criterion: string; rating: number }[];
  /** What to evaluate, scheduled per day */
  testSchedule?: { day: string; focus: string }[];
};

/** Pool of supplementary lifestyle photos used to pad each trial's gallery to 3+ images. */
const GALLERY_POOL: Record<string, string[]> = {
  "บำรุงผิว": [
    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=800&q=80",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80",
  ],
  "เครื่องดื่ม": [
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    "https://images.unsplash.com/photo-1597318236547-ce0b53676e69?w=800&q=80",
    "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=800&q=80",
  ],
  "ดูแลร่างกาย": [
    "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    "https://images.unsplash.com/photo-1583209814683-c023dd293cc6?w=800&q=80",
  ],
  "อาหารเสริม": [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
  ],
  "น้ำมันสกัด": [
    "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    "https://images.unsplash.com/photo-1611250282006-4484dd3fba6b?w=800&q=80",
    "https://images.unsplash.com/photo-1635252585262-8f95757fe7a3?w=800&q=80",
  ],
  "ผ่อนคลาย": [
    "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&q=80",
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80",
  ],
  "ดูแลช่องปาก": [
    "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80",
    "https://images.unsplash.com/photo-1559588232-c81e4d5dc52d?w=800&q=80",
    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&q=80",
  ],
  "บำรุงผม": [
    "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
    "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800&q=80",
  ],
};

/** Return the gallery for a trial: explicit `images` if set, otherwise main + 2 from the category pool. */
export function getTrialImages(p: TrialProduct): string[] {
  if (p.images && p.images.length > 0) return p.images;
  const pool = GALLERY_POOL[p.category] || [];
  const extras = pool.filter((url) => url !== p.image).slice(0, 2);
  return [p.image, ...extras];
}

export type Evaluation = {
  /** Overall 1-5 rating */
  overall: number;
  /** Per-criterion 1-5 ratings, keyed by the criterion label (matches whatToTest items). */
  criteria: Record<string, number>;
  /** Free-form comment from the tester. */
  comment: string;
  /** Would the tester recommend the product to a friend? */
  wouldRecommend: boolean;
};

export type Registration = {
  trialId: string;
  name: string;
  phone: string;
  address: string;
  motivation: string;
  submittedAt: number;
  /** Owner approved the application. */
  approvedAt?: number;
  /** Owner rejected the application. */
  rejectedAt?: number;
  /** User submitted the evaluation survey. */
  evaluatedAt?: number;
  /** Filled when user submits the evaluation form. */
  evaluation?: Evaluation;
};

export type RegistrationStatus = "pending_approval" | "approved" | "evaluated" | "rejected";

export function getRegistrationStatus(r: Registration): RegistrationStatus {
  if (r.rejectedAt) return "rejected";
  if (r.evaluatedAt) return "evaluated";
  if (r.approvedAt) return "approved";
  return "pending_approval";
}

/** Returns the user's currently-active registration (approved + joined but not yet evaluated/rejected), if any. */
export function getActiveRegistration(regs: Registration[]): Registration | null {
  return regs.find((r) => !r.evaluatedAt && !r.rejectedAt) || null;
}

export const REGISTRATIONS_STORAGE_KEY = "metaherb:trial:registrations";

/** Tester profile — captured on the multi-step registration wizard.
 *  Reused later to suggest matching trials + pre-fill future surveys. */
export type TesterProfile = {
  displayName: string;
  ageRange: "15-24" | "25-34" | "35-44" | "45-54" | "55+" | "";
  gender: "ชาย" | "หญิง" | "LGBTQ+" | "ไม่ระบุ" | "";
  lifestyle: string[];
  health: string[];
  consumption: string[];
  registeredAt: number;
};

export const TESTER_PROFILE_STORAGE_KEY = "metaherb:tester:profile";

export function loadTesterProfile(): TesterProfile | null {
  try {
    const raw = localStorage.getItem(TESTER_PROFILE_STORAGE_KEY);
    return raw ? JSON.parse(raw) as TesterProfile : null;
  } catch { return null; }
}
export function saveTesterProfile(profile: TesterProfile) {
  localStorage.setItem(TESTER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function loadRegistrations(): Registration[] {
  try { return JSON.parse(localStorage.getItem(REGISTRATIONS_STORAGE_KEY) || "[]"); }
  catch { return []; }
}
export function saveRegistrations(list: Registration[]) {
  localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
}

/** Mock catalog of products in trial — handpicked photos from Unsplash. */
export const TRIAL_PRODUCTS: TrialProduct[] = [
  {
    id: "trial-1",
    name: "เซรั่มขมิ้นชัน Brightening v2",
    tagline: "เพิ่มความกระจ่างใส ลดรอยด่างดำ สูตรสารสกัดขมิ้นชัน 5% เหมาะสำหรับทุกสภาพผิว",
    category: "บำรุงผิว",
    image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=800&q=80",
    spotsTotal: 50, spotsTaken: 32, endsInDays: 12, rewardPoints: 200,
    whatToTest: ["กลิ่นและเนื้อสัมผัส", "ผลลัพธ์ใน 14 วัน", "การระคายเคือง"],
    concerns: ["skin"],
    studioName: "Herbal Lab Co.", prevAvgRating: 4.7, prevRatingCount: 32,
    detail: {
      developerName: "ดร. วรรณา สุขสม",
      longDescription: "เพิ่มความกระจ่างใส ลดรอยด่างดำ สูตรสารสกัดขมิ้นชัน 5% เหมาะสำหรับทุกสภาพผิว",
      productInfo: [
        { label: "ชื่อสินค้า",   value: "เซรั่มขมิ้นชัน Brightening v2" },
        { label: "แบรนด์",       value: "Herbal Lab Co." },
        { label: "ผู้พัฒนา",      value: "ดร. วรรณา สุขสม" },
        { label: "ประเภท",       value: "เซรั่มบำรุงผิวหน้า" },
        { label: "ปริมาณสุทธิ",  value: "30 ml" },
        { label: "วันที่ผลิต",     value: "มีนาคม 2569" },
        { label: "วันหมดอายุ",   value: "มีนาคม 2571" },
        { label: "รหัส Batch",  value: "HL-2569-03-V2" },
      ],
      certifications: [
        "GMP Certified",
        "อย. เลขที่ 10-1-6200xxxxx",
        "Dermatologist Tested",
        "Cruelty Free",
        "No Paraben",
      ],
      benefits: [
        "ลดรอยด่างดำและจุดด่างจากแสงแดดภายใน 14 วัน",
        "เพิ่มความกระจ่างใสด้วยสารสกัดขมิ้นชัน 5%",
        "ต้านอนุมูลอิสระ ชะลอริ้วรอยก่อนวัย",
        "เนื้อเซรั่มบางเบา ซึมเร็ว ไม่เหนียวเหนอะหนะ",
      ],
      howToUse: [
        "ล้างหน้าให้สะอาด ซับหน้าให้แห้ง",
        "หยดเซรั่ม 2–3 หยดลงบนฝ่ามือ",
        "ทาบริเวณใบหน้า เน้นจุดที่มีรอยด่างดำ",
        "นวดเบาๆ จนซึม ใช้เช้า–เย็น",
        "ตามด้วยมอยส์เจอไรเซอร์และกันแดด (ช่วงเช้า)",
      ],
      warnings: [
        "หากเกิดการระคายเคือง ผื่นแดง หยุดใช้ทันทีและติดต่อทีม MetaHerb",
        "หลีกเลี่ยงบริเวณรอบดวงตา",
        "ไม่เหมาะสำหรับผู้แพ้ขมิ้น หรือสมุนไพรในตระกูล Curcuma",
        "เก็บในที่เย็น หลีกเลี่ยงแสงแดดโดยตรง",
      ],
      studyStats: [
        { label: "ขนาดกลุ่มทดสอบ (Lab)", value: "120 คน",  sub: "ทดสอบ in-vitro + อาสาสมัคร" },
        { label: "ระยะเวลาศึกษา",         value: "8 สัปดาห์", sub: "ก่อนเปิด Beta Testing" },
        { label: "อัตราการระคายเคือง",     value: "1.2%",    sub: "ต่ำกว่าเกณฑ์มาตรฐาน (5%)" },
        { label: "ประสิทธิภาพลดรอยดำ",     value: "+34%",    sub: "เทียบกับ placebo ใน 4 สัปดาห์" },
      ],
      safetyTests: [
        "Patch Test — ผ่าน ไม่พบการระคายเคืองในกลุ่มผิวปกติ",
        "Heavy Metal Test — ไม่พบสารโลหะหนักเกินมาตรฐาน",
        "Microbial Test — ผ่านมาตรฐาน USP ไม่พบเชื้อโรค",
        "ผิวแพ้ง่าย (Sensitive Skin) — แนะนำทดสอบบริเวณข้อพับแขนก่อนใช้ 24 ชม.",
      ],
      ingredients: [
        { name: "Curcumin 5%",         isActive: true },
        { name: "Niacinamide 3%",      isActive: true },
        { name: "Hyaluronic Acid",     isActive: true },
        { name: "Glycerin" },
        { name: "Aloe Vera Extract" },
        { name: "Centella Asiatica" },
        { name: "Aqua" },
      ],
      timeline: [
        { stage: "R&D เสร็จสิ้น",               date: "มกราคม 2569",   detail: "ปรับสูตรจาก v1 เพิ่มความเข้มข้น Curcumin" },
        { stage: "ทดสอบความปลอดภัย (Lab)",    date: "กุมภาพันธ์ 2569", detail: "Patch test ผ่าน, ไม่พบสารอันตราย" },
        { stage: "ผลิต Batch แรก",             date: "มีนาคม 2569",   detail: "Batch HL-2569-03-V2 จำนวน 200 หน่วย" },
        { stage: "เปิด Beta Testing (ปัจจุบัน)", date: "มิถุนายน 2569", detail: "รับ Tester 50 คน", isCurrent: true },
        { stage: "วางจำหน่ายจริง",              date: "คาดการณ์ กันยายน 2569", detail: "" },
      ],
      prevCriteriaRatings: [
        { criterion: "กลิ่น",       rating: 4.5 },
        { criterion: "เนื้อสัมผัส",  rating: 4.8 },
        { criterion: "ผลลัพธ์",     rating: 4.4 },
        { criterion: "ระคายเคือง", rating: 4.9 },
      ],
      testSchedule: [
        { day: "วันที่ 1",  focus: "ความประทับใจแรก กลิ่น เนื้อสัมผัส การซึมของเซรั่ม" },
        { day: "วันที่ 7",  focus: "การระคายเคือง ความชุ่มชื้น ความเปลี่ยนแปลงเบื้องต้น" },
        { day: "วันที่ 12", focus: "ผลลัพธ์โดยรวม รอยด่างดำ ความกระจ่างใส ความพึงพอใจสุดท้าย" },
      ],
    },
  },
  {
    id: "trial-2",
    name: "ชาสมุนไพรช่วยนอน Sleep+",
    tagline: "เบลนด์ใหม่จากคาโมมายล์ + วาเลอเรียน — ทดลองก่อนเปิดตัว",
    category: "เครื่องดื่ม",
    image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=800&q=80",
    spotsTotal: 100, spotsTaken: 78, endsInDays: 7, rewardPoints: 150,
    whatToTest: ["ผลต่อการนอน 7 คืน", "รสชาติ", "ความสะดวกในการชง"],
    concerns: ["sleep", "general"],
    studioName: "Sleep Co Studio", prevAvgRating: 4.2, prevRatingCount: 28,
  },
  {
    id: "trial-3",
    name: "ครีมว่านหางจระเข้ x ไพล",
    tagline: "ลดอาการปวดเมื่อย — กำลังหา tester ผู้สูงวัย 60+",
    category: "ดูแลร่างกาย",
    image: "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=800&q=80",
    spotsTotal: 30, spotsTaken: 11, endsInDays: 18, rewardPoints: 300,
    whatToTest: ["บรรเทาปวดข้อ", "ความเหนียวเหนอะ", "กลิ่น"],
    concerns: ["elder", "fitness"],
    studioName: "Botanic Lab", prevAvgRating: 4.5, prevRatingCount: 22,
  },
  {
    id: "trial-4",
    name: "แคปซูลฟ้าทะลายโจร Daily",
    tagline: "ปริมาณ andrographolide สูง — รับสมัครเฉพาะคนเป็นหวัดบ่อย",
    category: "อาหารเสริม",
    image: "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=800&q=80",
    spotsTotal: 40, spotsTaken: 40, endsInDays: 0, rewardPoints: 250,
    whatToTest: ["ความถี่ของอาการ", "ผลข้างเคียง"],
    concerns: ["general"],
    studioName: "MetaHerb Lab", prevAvgRating: 4.6, prevRatingCount: 41,
  },
  {
    id: "trial-5",
    name: "น้ำมันมะพร้าวสกัดเย็น Pure",
    tagline: "ไม่ผ่านความร้อน — ทดลองใช้ทำอาหาร + ทาผิว",
    category: "น้ำมันสกัด",
    image: "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=800&q=80",
    spotsTotal: 60, spotsTaken: 24, endsInDays: 25, rewardPoints: 200,
    whatToTest: ["รสชาติ", "การดูดซึมบนผิว", "ความคงตัวที่อุณหภูมิห้อง"],
    concerns: ["skin", "general"],
    studioName: "Pure Oils Studio", prevAvgRating: 4.8, prevRatingCount: 18,
  },
  {
    id: "trial-6",
    name: "ลูกประคบสมุนไพรสเปรย์",
    tagline: "ใหม่: รูปแบบสเปรย์แทนถุงประคบเดิม — หา tester คนทำงานออฟฟิศ",
    category: "ผ่อนคลาย",
    image: "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=800&q=80",
    spotsTotal: 25, spotsTaken: 9, endsInDays: 30, rewardPoints: 350,
    whatToTest: ["ความสะดวก", "กลิ่นและความร้อน", "เปรียบเทียบกับลูกประคบเดิม"],
    concerns: ["fitness", "focus"],
    studioName: "Wellness Lab",
  },
  {
    id: "trial-7",
    name: "สครับน้ำตาลมะรุม Glow",
    tagline: "เม็ดสครับธรรมชาติ — ขอ tester ผิวบอบบาง",
    category: "บำรุงผิว",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
    spotsTotal: 40, spotsTaken: 18, endsInDays: 21, rewardPoints: 200,
    whatToTest: ["ความหยาบของเม็ดสครับ", "ความนุ่มของผิวหลังใช้"],
    concerns: ["skin"],
    studioName: "Moru Naturals", prevAvgRating: 4.4, prevRatingCount: 20,
  },
  {
    id: "trial-8",
    name: "ยาสีฟันสมุนไพรขมิ้น-เกลือ",
    tagline: "ลดคราบหินปูน — ขอ tester ใช้ติดต่อกัน 30 วัน",
    category: "ดูแลช่องปาก",
    image: "https://images.unsplash.com/photo-1559591935-c6c92c6dfbd2?w=800&q=80",
    spotsTotal: 80, spotsTaken: 45, endsInDays: 15, rewardPoints: 150,
    whatToTest: ["รสชาติ", "ความสะอาด", "ผลต่อเหงือก"],
    concerns: ["general"],
    studioName: "Smile Lab", prevAvgRating: 4.1, prevRatingCount: 30,
  },
  {
    id: "trial-9",
    name: "เซรั่มบำรุงผม รากแมงลัก",
    tagline: "ลดผมร่วง — กำลังรับ tester ที่มีอาการชัดเจน",
    category: "บำรุงผม",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
    spotsTotal: 50, spotsTaken: 47, endsInDays: 5, rewardPoints: 400,
    whatToTest: ["ความถี่ผมร่วงใน 30 วัน", "ความหนาของเส้นผม"],
    concerns: ["skin"],
    studioName: "NaturaSkin Studio", prevAvgRating: 3.8, prevRatingCount: 18,
  },
  {
    id: "trial-10",
    name: "ดีท็อกซ์ตับกระเจี๊ยบ + ขมิ้น",
    tagline: "สูตรชง 7 วัน — ขอ tester ที่ดื่มแอลกอฮอล์เป็นประจำ",
    category: "อาหารเสริม",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
    spotsTotal: 35, spotsTaken: 22, endsInDays: 14, rewardPoints: 350,
    whatToTest: ["พลังงานในตอนเช้า", "ระบบขับถ่าย", "ค่าตับก่อน/หลัง"],
    concerns: ["general"],
    studioName: "MetaHerb Lab",
  },
  {
    id: "trial-11",
    name: "บาล์มกะเพรา ลดอาการคัดจมูก",
    tagline: "สูตรไม่มีเมนทอล — กำลังหา tester เด็ก 6+ และผู้ใหญ่",
    category: "ดูแลร่างกาย",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800&q=80",
    spotsTotal: 60, spotsTaken: 14, endsInDays: 28, rewardPoints: 250,
    whatToTest: ["กลิ่นและความฉุน", "ผลต่ออาการคัดจมูก", "ความระคาย"],
    concerns: ["general", "elder"],
    studioName: "Botanic Lab", prevAvgRating: 4.3, prevRatingCount: 14,
  },
  {
    id: "trial-12",
    name: "ชาลดน้ำหนัก Slim 14",
    tagline: "สูตร 14 วัน — รับ tester ที่ต้องการลด 1-3 กก.",
    category: "เครื่องดื่ม",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    spotsTotal: 120, spotsTaken: 96, endsInDays: 10, rewardPoints: 200,
    whatToTest: ["น้ำหนักก่อน/หลัง", "อาการข้างเคียง", "รสชาติ"],
    concerns: ["fitness", "general"],
    studioName: "Slim Studio", prevAvgRating: 3.6, prevRatingCount: 24,
  },
  {
    id: "trial-13",
    name: "ครีมกันแดด สารสกัดบัวบก SPF50",
    tagline: "ไม่มีสารเคมีกันแดด — ขอ tester ทุกประเภทผิว",
    category: "บำรุงผิว",
    image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=800&q=80",
    spotsTotal: 75, spotsTaken: 31, endsInDays: 20, rewardPoints: 300,
    whatToTest: ["คราบขาว", "ความรู้สึกหลังทา", "ผลต่อสิว"],
    concerns: ["skin"],
    studioName: "Sun Care Co.", prevAvgRating: 4.5, prevRatingCount: 19,
  },
  {
    id: "trial-14",
    name: "น้ำมันงาดำสกัดเย็น Premium",
    tagline: "บีบเย็นรอบเดียว — ขอ tester ทำอาหาร + ดื่ม",
    category: "น้ำมันสกัด",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&q=80",
    spotsTotal: 45, spotsTaken: 12, endsInDays: 32, rewardPoints: 250,
    whatToTest: ["รสชาติ", "กลิ่น", "ความรู้สึกหลังบริโภค"],
    concerns: ["general", "elder"],
    studioName: "Pure Oils Studio", prevAvgRating: 4.7, prevRatingCount: 15,
  },
  {
    id: "trial-15",
    name: "เจลล้างหน้าทาบาว",
    tagline: "ใหม่: ฟอง creamy — สำหรับผิวมัน/ผสม",
    category: "บำรุงผิว",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    spotsTotal: 55, spotsTaken: 38, endsInDays: 9, rewardPoints: 200,
    whatToTest: ["ฟองและการล้างออก", "ความตึงของผิว", "สิว"],
    concerns: ["skin"],
    studioName: "Herbal Lab Co.", prevAvgRating: 4.0, prevRatingCount: 25,
  },
  {
    id: "trial-16",
    name: "แคปซูลใบบัวบก เสริมความจำ",
    tagline: "สำหรับวัยทำงาน — ขอ tester อายุ 30-50",
    category: "อาหารเสริม",
    image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&q=80",
    spotsTotal: 80, spotsTaken: 80, endsInDays: 0, rewardPoints: 300,
    whatToTest: ["ความจำระยะสั้น", "สมาธิ", "การนอน"],
    concerns: ["focus", "elder"],
    studioName: "Memory Lab",
  },
  {
    id: "trial-17",
    name: "สเปรย์ฉีดผม สารสกัดอัญชัน",
    tagline: "กระตุ้นรากผม — ขอ tester ที่ผมบางบริเวณกระหม่อม",
    category: "บำรุงผม",
    image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=800&q=80",
    spotsTotal: 40, spotsTaken: 8, endsInDays: 35, rewardPoints: 350,
    whatToTest: ["ความมันบนหนังศีรษะ", "ความเหนียว", "กลิ่น"],
    concerns: ["skin"],
    studioName: "NaturaSkin Studio", prevAvgRating: 4.6, prevRatingCount: 12,
  },
  {
    id: "trial-18",
    name: "เครื่องดื่มชง วิตามินซีอะเซโรลา",
    tagline: "วิตซีจากผลไม้ — ขอ tester ที่ป่วยง่ายช่วงเปลี่ยนฤดู",
    category: "เครื่องดื่ม",
    image: "https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80",
    spotsTotal: 90, spotsTaken: 51, endsInDays: 17, rewardPoints: 250,
    whatToTest: ["รสชาติ", "ความถี่ของหวัดใน 30 วัน", "การละลาย"],
    concerns: ["general"],
    studioName: "MetaHerb Lab", prevAvgRating: 4.4, prevRatingCount: 35,
  },
];
