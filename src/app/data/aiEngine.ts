/**
 * Mock AI shopping-assistant engine. Pure functions — no API calls.
 * Parses user text via keyword matching, returns a structured Reply that
 * the AIAssistant UI renders into rich cards (product list, comparison,
 * bundle, action chips).
 */
import type { Product } from "./products";

export type Intent =
  | "greet" | "help"
  | "search" | "recommend" | "compare" | "bundle"
  | "promo" | "value"
  | "cart_add" | "cart_view" | "cart_remove" | "checkout"
  | "order_status" | "order_recent"
  | "qa" | "unknown";

/** Health goals we map free text to canonical labels. */
export type HealthGoal =
  | "sleep" | "weight_loss" | "weight_gain" | "skin" | "hair"
  | "brain" | "energy" | "immune" | "digestion" | "joint"
  | "pressure" | "diabetes" | "senior" | "kids" | "stress";

export interface CustomerProfile {
  goals: HealthGoal[];
  budgetMax?: number;
  ageBucket?: "kid" | "adult" | "senior";
  lastIntent?: Intent;
  lastCategory?: string;
  lastQuery?: string;
}

/** ===== Keyword → canonical mappings (Thai-leaning) ===== */
const GOAL_KEYWORDS: Record<HealthGoal, string[]> = {
  sleep:        ["นอน", "หลับ", "อินซอม", "พักผ่อน", "sleep", "insomnia"],
  weight_loss:  ["ลดน้ำหนัก", "ลดความอ้วน", "ผอม", "ดีท็อกซ์", "diet", "burn"],
  weight_gain:  ["เพิ่มน้ำหนัก", "อ้วน", "บำรุงร่างกาย"],
  skin:         ["ผิว", "หน้าใส", "สิว", "ฝ้า", "skin", "คอลลาเจน", "ขาว"],
  hair:         ["ผม", "หัวล้าน", "ผมร่วง", "hair"],
  brain:        ["สมอง", "ความจำ", "บำรุงสมอง", "memory", "focus", "เด็ก"],
  energy:       ["พลังงาน", "อ่อนเพลีย", "เหนื่อย", "energy", "บำรุงกำลัง"],
  immune:       ["ภูมิคุ้มกัน", "ป้องกัน", "หวัด", "ไข้หวัด", "immune"],
  digestion:    ["ย่อย", "ท้อง", "ขับถ่าย", "ลำไส้", "stomach"],
  joint:        ["ข้อ", "เข่า", "ปวดข้อ", "joint", "กระดูก"],
  pressure:     ["ความดัน", "blood pressure"],
  diabetes:     ["เบาหวาน", "น้ำตาล", "diabetes"],
  senior:       ["ผู้สูงอายุ", "คนแก่", "ปู่ย่า", "ตายาย", "senior"],
  kids:         ["เด็ก", "ลูก", "kids"],
  stress:       ["เครียด", "วิตก", "stress", "anxiety"],
};

const GOAL_LABEL: Record<HealthGoal, string> = {
  sleep: "ช่วยนอนหลับ", weight_loss: "ลดน้ำหนัก", weight_gain: "เพิ่มน้ำหนัก",
  skin: "บำรุงผิว", hair: "บำรุงผม", brain: "บำรุงสมอง", energy: "เพิ่มพลังงาน",
  immune: "เสริมภูมิคุ้มกัน", digestion: "ช่วยย่อย-ขับถ่าย", joint: "บำรุงข้อ-เข่า",
  pressure: "ดูแลความดัน", diabetes: "ดูแลเบาหวาน", senior: "ผู้สูงอายุ",
  kids: "สำหรับเด็ก", stress: "ลดความเครียด",
};

/** Words that hint each goal might fit certain product names/categories. */
const GOAL_PRODUCT_HINTS: Record<HealthGoal, string[]> = {
  sleep:       ["คาโมมายล์", "ดอกคำฝอย", "ลาเวนเดอร์", "magnesium", "valerian", "ชา"],
  weight_loss: ["ดีท็อกซ์", "ขมิ้น", "ฟ้าทะลาย", "ชาเขียว", "garcinia"],
  weight_gain: ["บำรุง", "โสม", "ถั่งเช่า"],
  skin:        ["คอลลาเจน", "vitamin c", "วิตามินซี", "ผิว", "อโรม่า", "สบู่"],
  hair:        ["บำรุงผม", "biotin", "ใบบัวบก"],
  brain:       ["บัวบก", "ใบบัวบก", "ginkgo", "สมอง"],
  energy:      ["โสม", "ถั่งเช่า", "วิตามินบี"],
  immune:      ["ฟ้าทะลาย", "ขมิ้น", "vitamin c", "vitamin d", "elderberry", "หลินจือ"],
  digestion:   ["ขิง", "มะรุม", "ตะไคร้", "probiotic", "ฟ้าทะลาย"],
  joint:       ["ขมิ้น", "ไพล", "collagen", "calcium"],
  pressure:    ["รางจืด", "ใบบัวบก", "garlic"],
  diabetes:    ["มะระ", "ฟ้าทะลาย", "ใบบัวบก"],
  senior:      ["calcium", "หลินจือ", "omega", "collagen"],
  kids:        ["vitamin c", "elderberry"],
  stress:      ["คาโมมายล์", "ลาเวนเดอร์", "อโรม่า"],
};

/** ===== Intent parser ===== */
export function detectIntent(text: string): Intent {
  const t = text.toLowerCase().trim();
  if (!t) return "unknown";
  if (/^(สวัสดี|hello|hi|หวัดดี|ดีครับ|ดีค่ะ)/i.test(t)) return "greet";
  // "help" must be explicit (ช่วยอะไร / วิธีใช้ / how to use), not just contain ช่วย
  if (/(ช่วยอะไร|ทำอะไรได้|ใช้งานยังไง|วิธีใช้|how to use|what can you)/i.test(t)) return "help";

  if (/(เปรียบเทียบ|compare|ต่างกัน|แบบไหนดีกว่า)/.test(t)) return "compare";
  if (/(จัดเซต|bundle|ชุด|แพ็ค|รวม|set)/.test(t)) return "bundle";
  if (/(โปร|promo|ส่วนลด|คูปอง|coupon|deal)/.test(t)) return "promo";
  if (/(คุ้ม|ความคุ้ม|value|ราคาต่อ|คุ้มกว่า)/.test(t)) return "value";

  if (/(เพิ่มใส่|ใส่ตะกร้า|add to cart|หยิบ.*ตะกร้า)/.test(t)) return "cart_add";
  if (/(ตะกร้า|cart|รถเข็น)/.test(t) && /(ดู|แสดง|เปิด|view)/.test(t)) return "cart_view";
  if (/(เอาออก|ลบ.*ตะกร้า|remove)/.test(t)) return "cart_remove";
  if (/(ชำระ|checkout|สั่งซื้อ|สั่ง.*เลย|order now)/.test(t)) return "checkout";

  if (/(ออเดอร์.*ถึงไหน|order.*status|ติดตาม|เลข.*track|tracking)/.test(t)) return "order_status";
  if (/(ออเดอร์.*ล่าสุด|ประวัติ.*สั่ง|orders|my orders)/.test(t)) return "order_recent";

  if (/(แนะนำ|recommend|มีอะไร|มีตัว|แบบไหน|suggest)/.test(t)) return "recommend";
  if (/(หา|search|มี.*ไหม|มี|อยาก.*หา|มอง)/.test(t)) return "search";

  if (/(วิธีรับประทาน|กิน.*ยังไง|วิธี.*ใช้|ส่วนประกอบ|ข้อควรระวัง|กลุ่ม.*เหมาะ)/.test(t)) return "qa";

  return "unknown";
}

/** ===== Goal extraction from free text ===== */
export function extractGoals(text: string): HealthGoal[] {
  const t = text.toLowerCase();
  const hits: HealthGoal[] = [];
  for (const g of Object.keys(GOAL_KEYWORDS) as HealthGoal[]) {
    if (GOAL_KEYWORDS[g].some((kw) => t.includes(kw.toLowerCase()))) hits.push(g);
  }
  return hits;
}

export function extractBudget(text: string): number | undefined {
  const m = text.match(/(\d{2,5})\s*(บาท|baht|฿|thb)?/i);
  if (m) {
    const n = parseInt(m[1], 10);
    if (n >= 50 && n <= 100000) return n;
  }
  return undefined;
}

export function extractCategory(text: string, knownCats: string[]): string | undefined {
  const t = text.toLowerCase();
  for (const c of knownCats) {
    if (t.includes(c.toLowerCase())) return c;
  }
  return undefined;
}

export function goalLabel(g: HealthGoal): string { return GOAL_LABEL[g]; }

/** ===== Search / recommendation ===== */
export function scoreProduct(p: Product, goals: HealthGoal[], q: string): number {
  let score = 0;
  const text = `${p.name} ${p.category} ${p.description ?? ""}`.toLowerCase();

  // Plain query token match (each token adds points)
  q.toLowerCase().split(/\s+/).filter(Boolean).forEach((tok) => {
    if (tok.length < 2) return;
    if (text.includes(tok)) score += 3;
  });

  // Goal hints — if any hint keyword in name/desc → +5 per match
  goals.forEach((g) => {
    GOAL_PRODUCT_HINTS[g].forEach((hint) => {
      if (text.includes(hint.toLowerCase())) score += 5;
    });
  });

  // Boost slightly for recommended / bestseller / lower price
  if (p.isRecommended) score += 1;
  if (p.isBestSeller)  score += 1.5;
  if (p.rating >= 4.5) score += 1;

  return score;
}

export function searchProducts(
  products: Product[],
  q: string,
  opts: { goals?: HealthGoal[]; budgetMax?: number; category?: string; limit?: number } = {},
): Product[] {
  const goals = opts.goals ?? extractGoals(q);
  const budgetMax = opts.budgetMax;
  const cat = opts.category;
  const limit = opts.limit ?? 5;

  return products
    .filter((p) => !cat || p.category === cat)
    .filter((p) => !budgetMax || p.price <= budgetMax)
    .map((p) => ({ p, s: scoreProduct(p, goals, q) }))
    .filter(({ s }) => s > 0 || goals.length > 0 || q.trim().length === 0)
    .sort((a, b) => b.s - a.s || b.p.rating - a.p.rating)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** Recommend top products for a goal even with no explicit query. */
export function recommendForGoals(products: Product[], goals: HealthGoal[], limit = 5): Product[] {
  if (goals.length === 0) {
    return [...products].sort((a, b) => (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0) || b.rating - a.rating).slice(0, limit);
  }
  return products
    .map((p) => ({ p, s: scoreProduct(p, goals, "") }))
    .sort((a, b) => b.s - a.s || b.p.rating - a.p.rating)
    .slice(0, limit)
    .map(({ p }) => p);
}

/** ===== Comparison ===== */
export interface ComparisonRow {
  label: string;
  values: (string | number)[];
  highlight?: number; // index of "best" cell
}

export function compareProducts(products: Product[]): { products: Product[]; rows: ComparisonRow[]; summary: string } {
  if (products.length < 2) return { products, rows: [], summary: "ต้องเปรียบเทียบอย่างน้อย 2 รายการ" };

  const rows: ComparisonRow[] = [
    { label: "ราคา (บาท)", values: products.map((p) => p.price), highlight: argMin(products.map((p) => p.price)) },
    { label: "ราคาเดิม",    values: products.map((p) => p.originalPrice ?? p.price) },
    { label: "ส่วนลด %",    values: products.map((p) => p.discountPercent ?? 0), highlight: argMax(products.map((p) => p.discountPercent ?? 0)) },
    { label: "คะแนนรีวิว",  values: products.map((p) => p.rating), highlight: argMax(products.map((p) => p.rating)) },
    { label: "หมวดหมู่",    values: products.map((p) => p.category) },
    { label: "คงเหลือ",     values: products.map((p) => `${p.stock} ชิ้น`) },
  ];

  // Cheapest summary
  const cheapestIdx = argMin(products.map((p) => p.price));
  const priciestIdx = argMax(products.map((p) => p.price));
  const saving = Math.round((1 - products[cheapestIdx].price / products[priciestIdx].price) * 100);
  const summary = cheapestIdx === priciestIdx
    ? `ราคาใกล้เคียงกัน เลือกตามคะแนนรีวิว (${products[argMax(products.map((p) => p.rating))].name})`
    : `หากเน้นความคุ้มค่า ${products[cheapestIdx].name} ราคาถูกกว่าประมาณ ${saving}%`;

  return { products, rows, summary };
}

function argMin(arr: number[]): number { return arr.reduce((bi, v, i, a) => v < a[bi] ? i : bi, 0); }
function argMax(arr: number[]): number { return arr.reduce((bi, v, i, a) => v > a[bi] ? i : bi, 0); }

/** ===== Value analysis ===== */
export function valueAnalysis(p: Product): { unitPrice: number; unit: string; savings?: string; verdict: string } {
  // Try to parse weight like "60 แคปซูล" or "100 g"
  const m = (p.weight || "").match(/(\d[\d,.]*)\s*(\D+)?/);
  const qty = m ? parseFloat(m[1].replace(",", "")) : 0;
  const unit = (m?.[2] || "ชิ้น").trim();
  const unitPrice = qty > 0 ? p.price / qty : p.price;
  const savings = p.originalPrice && p.originalPrice > p.price
    ? `ประหยัด ฿${(p.originalPrice - p.price).toFixed(0)} (${Math.round((1 - p.price / p.originalPrice) * 100)}%)`
    : undefined;
  let verdict = unitPrice < 5 ? "คุ้มมาก" : unitPrice < 15 ? "คุ้ม" : "ราคาปกติ";
  if (p.isFlashSale) verdict = "Flash Sale — คุ้มสุดๆ";
  return { unitPrice, unit, savings, verdict };
}

/** ===== Bundle generator ===== */
export function buildBundle(products: Product[], goals: HealthGoal[], budgetMax?: number): { items: Product[]; total: number; discount: number; finalPrice: number; name: string } {
  const candidates = recommendForGoals(products, goals, 8);
  const picked: Product[] = [];
  let total = 0;
  for (const p of candidates) {
    if (budgetMax && total + p.price > budgetMax * 0.9) continue;
    picked.push(p);
    total += p.price;
    if (picked.length === 3) break;
  }
  if (picked.length === 0 && candidates.length > 0) picked.push(candidates[0]);
  const discount = Math.round(picked.reduce((s, p) => s + p.price, 0) * 0.1);
  total = picked.reduce((s, p) => s + p.price, 0);
  const name = goals.length > 0 ? `ชุด${goalLabel(goals[0])}` : "ชุดแนะนำ";
  return { items: picked, total, discount, finalPrice: total - discount, name };
}

/** ===== Promotion advisor ===== */
export interface PromoSuggestion {
  type: "discount" | "freeship" | "upsell";
  title: string;
  body: string;
}
export function suggestPromos(cartTotal: number, freeshipThreshold = 500, discountThreshold = 1000): PromoSuggestion[] {
  const out: PromoSuggestion[] = [];
  if (cartTotal === 0) return out;
  if (cartTotal < freeshipThreshold) {
    const diff = freeshipThreshold - cartTotal;
    out.push({ type: "freeship", title: "ใกล้ได้ส่งฟรี!", body: `เพิ่มอีก ฿${diff.toLocaleString()} รับส่งฟรี` });
  } else {
    out.push({ type: "freeship", title: "ส่งฟรี ✓", body: "ออเดอร์นี้ได้ส่งฟรีแล้ว" });
  }
  if (cartTotal < discountThreshold) {
    const diff = discountThreshold - cartTotal;
    out.push({ type: "discount", title: "ใกล้ได้ส่วนลด 10%", body: `เพิ่มอีก ฿${diff.toLocaleString()} รับโค้ดส่วนลด` });
  }
  if (cartTotal >= 1500) {
    out.push({ type: "upsell", title: "VIP คุ้มกว่า", body: "ออเดอร์ ≥ ฿1,500 ใช้โค้ด VIP10 ลดเพิ่ม 10%" });
  }
  return out;
}

/** Cross-sell from a "seed" product. */
export function crossSell(products: Product[], seed: Product, limit = 3): Product[] {
  return products
    .filter((p) => p.id !== seed.id && p.category === seed.category)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
}

/** ===== Quick-reply suggestions based on intent ===== */
export function quickReplies(intent: Intent, profile: CustomerProfile): string[] {
  switch (intent) {
    case "greet":
    case "unknown":
      return ["มีสมุนไพรช่วยนอนหลับไหม", "อยากลดน้ำหนัก แนะนำหน่อย", "เปรียบเทียบสินค้าขายดี", "ออเดอร์ล่าสุด"];
    case "search":
    case "recommend":
      return ["จัดเซตแนะนำให้หน่อย", "ตัวที่ถูกที่สุด", "เปรียบเทียบ 2 ตัวบนสุด", "ดูโปรโมชั่น"];
    case "compare":
      return ["ตัวไหนคุ้มกว่า", "เพิ่มตัวคุ้มสุดเข้าตะกร้า", "มีโปรไหม"];
    case "cart_view":
    case "promo":
      return ["ชำระเงิน", "แนะนำของแถม", "ลบสินค้าออก"];
    case "checkout":
      return ["ใช้ที่อยู่เดิม", "เลือกที่อยู่อื่น", "ยกเลิก"];
    default:
      return ["หาสินค้าใหม่", "ตะกร้า", "ออเดอร์ของฉัน", profile.goals[0] ? `${goalLabel(profile.goals[0])} อะไรดี` : "จัดเซตแนะนำ"];
  }
}
