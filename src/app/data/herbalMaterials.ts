// Real material photos ported from the MobileMetaherb app (assets/products/herbal/*.jpg)
import imgSaffron       from "../../assets/herbal-materials/herbal-saffron.jpg";
import imgCinnamon      from "../../assets/herbal-materials/herbal-cinnamon.jpg";
import imgGinger        from "../../assets/herbal-materials/herbal-ginger.jpg";
import imgImmunity      from "../../assets/herbal-materials/herbal-immunity.jpg";
import imgLavender      from "../../assets/herbal-materials/herbal-lavender.jpg";
import imgButterflyPea  from "../../assets/herbal-materials/herbal-butterflypea.jpg";
import imgLemon         from "../../assets/herbal-materials/herbal-lemon.jpg";
import imgVanilla       from "../../assets/herbal-materials/herbal-vanilla.jpg";
import imgJasmine       from "../../assets/herbal-materials/herbal-jasmine.jpg";
import imgBlackPepper   from "../../assets/herbal-materials/herbal-blackpepper.jpg";
import imgGoji          from "../../assets/herbal-materials/herbal-goji.jpg";
import imgShiitake      from "../../assets/herbal-materials/herbal-shiitake.jpg";
import imgPumpkinSeed   from "../../assets/herbal-materials/herbal-pumpkinseed.jpg";
import imgJujube        from "../../assets/herbal-materials/herbal-jujube.jpg";
import imgStarAnise     from "../../assets/herbal-materials/herbal-staranise.jpg";
import imgBayLeaf       from "../../assets/herbal-materials/herbal-bayleaf.jpg";
import imgBael          from "../../assets/herbal-materials/herbal-bael.jpg";
import imgChamomile     from "../../assets/herbal-materials/herbal-chamomile.jpg";
import imgGinseng       from "../../assets/herbal-materials/herbal-ginseng.jpg";
import imgFingerRoot    from "../../assets/herbal-materials/herbal-fingerroot.jpg";
import imgCacao         from "../../assets/herbal-materials/herbal-cacao.jpg";
import imgCoffee        from "../../assets/herbal-materials/herbal-coffee.jpg";

export type MaterialCategory = "ราก/หัว" | "ใบ" | "ดอก" | "เปลือก" | "ผล/เมล็ด" | "สมุนไพรรวม" | "เห็ด";
export type MaterialGrade = "พรีเมียม" | "คัดสรร" | "มาตรฐาน" | "ทั่วไป" | "ประหยัด";

export interface HerbalMaterial {
  id: string;
  name: string;
  scientificName: string;
  category: MaterialCategory;
  image: string;
  pricePerKg: number;
  moq: number;          // minimum order quantity in kg
  stock: number;        // available stock in kg
  grade: MaterialGrade;
  supplier: string;
  supplierVerified: boolean;
  location: string;
  rating: number;
  certifications: string[];
}

/** Data ported from MobileMetaherb (src/screens/HerbalMarketScreen.tsx) so the
 *  customer + admin web views stay in sync with the mobile catalog. */
export const MATERIALS: HerbalMaterial[] = [
  { id: "m-saffron",        name: "หญ้าฝรั่นอิหร่าน (Saffron)",         scientificName: "Crocus sativus",          category: "ดอก",         image: imgSaffron,      pricePerKg: 98000, moq: 1,  stock: 18,   grade: "พรีเมียม", supplier: "METAHERB Store",       supplierVerified: true,  location: "กรุงเทพฯ", rating: 5.0, certifications: ["อย.", "Import Grade A", "HACCP"] },
  { id: "m-cinnamon-ceylon",name: "อบเชยซีลอนแท่ง (Ceylon Cinnamon)",   scientificName: "Cinnamomum verum",        category: "เปลือก",      image: imgCinnamon,     pricePerKg: 880,   moq: 5,  stock: 320,  grade: "พรีเมียม", supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.9, certifications: ["อย.", "Organic Thailand", "HACCP"] },
  { id: "m-ginger-old",     name: "ขิงแก่แห้ง (ฝานหนา)",                 scientificName: "Zingiber officinale",     category: "ราก/หัว",     image: imgGinger,       pricePerKg: 290,   moq: 20, stock: 2600, grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "ลำปาง",     rating: 4.8, certifications: ["อย.", "GAP", "Organic Thailand"] },
  { id: "m-immunity-mix",   name: "ชุดสมุนไพรเสริมภูมิรวม",              scientificName: "Immunity Herbal Blend",   category: "สมุนไพรรวม",  image: imgImmunity,     pricePerKg: 1250,  moq: 5,  stock: 280,  grade: "พรีเมียม", supplier: "METAHERB Store",       supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.9, certifications: ["อย.", "ISO 22000", "HACCP"] },
  { id: "m-lavender",       name: "ลาเวนเดอร์แห้ง (Lavender)",            scientificName: "Lavandula angustifolia",  category: "ดอก",         image: imgLavender,     pricePerKg: 1600,  moq: 3,  stock: 150,  grade: "พรีเมียม", supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "นครปฐม",    rating: 4.9, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-butterflypea",   name: "ดอกอัญชันแห้ง (เกรดส่งออก)",          scientificName: "Clitoria ternatea",       category: "ดอก",         image: imgButterflyPea, pricePerKg: 580,   moq: 5,  stock: 360,  grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "เชียงราย",  rating: 4.8, certifications: ["อย.", "Organic Thailand", "ECOCERT"] },
  { id: "m-lemon-dried",    name: "มะนาวอบแห้ง (ฝาน)",                   scientificName: "Citrus limon",            category: "ผล/เมล็ด",    image: imgLemon,        pricePerKg: 340,   moq: 10, stock: 540,  grade: "คัดสรร",   supplier: "METAHERB Store",       supplierVerified: true,  location: "น่าน",       rating: 4.6, certifications: ["อย.", "GAP"] },
  { id: "m-vanilla",        name: "วานิลลาฝัก (Vanilla Beans)",          scientificName: "Vanilla planifolia",      category: "ผล/เมล็ด",    image: imgVanilla,      pricePerKg: 42000, moq: 1,  stock: 35,   grade: "พรีเมียม", supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.9, certifications: ["อย.", "Import Grade A", "HACCP"] },
  { id: "m-jasmine",        name: "ดอกมะลิตูมแห้ง (Jasmine Buds)",       scientificName: "Jasminum sambac",         category: "ดอก",         image: imgJasmine,      pricePerKg: 1200,  moq: 3,  stock: 140,  grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "นครปฐม",    rating: 4.8, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-blackpepper",    name: "พริกไทยดำเม็ด (Black Pepper)",        scientificName: "Piper nigrum",            category: "ผล/เมล็ด",    image: imgBlackPepper,  pricePerKg: 420,   moq: 10, stock: 980,  grade: "คัดสรร",   supplier: "METAHERB Store",       supplierVerified: true,  location: "จันทบุรี",   rating: 4.7, certifications: ["อย.", "GAP"] },
  { id: "m-goji",           name: "เก๋ากี้อบแห้ง (Goji Berry)",          scientificName: "Lycium barbarum",         category: "ผล/เมล็ด",    image: imgGoji,         pricePerKg: 680,   moq: 5,  stock: 420,  grade: "พรีเมียม", supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.8, certifications: ["อย.", "Import Grade A"] },
  { id: "m-shiitake",       name: "เห็ดหอมแห้ง (Shiitake)",              scientificName: "Lentinula edodes",        category: "เห็ด",        image: imgShiitake,     pricePerKg: 750,   moq: 5,  stock: 260,  grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "เชียงใหม่", rating: 4.7, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-pumpkinseed",    name: "เมล็ดฟักทองอบ (Pumpkin Seeds)",       scientificName: "Cucurbita pepo",          category: "ผล/เมล็ด",    image: imgPumpkinSeed,  pricePerKg: 390,   moq: 10, stock: 700,  grade: "คัดสรร",   supplier: "METAHERB Store",       supplierVerified: true,  location: "น่าน",       rating: 4.6, certifications: ["อย.", "GAP"] },
  { id: "m-jujube",         name: "พุทราจีนแห้ง (Red Jujube)",            scientificName: "Ziziphus jujuba",         category: "ผล/เมล็ด",    image: imgJujube,       pricePerKg: 520,   moq: 5,  stock: 480,  grade: "พรีเมียม", supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.8, certifications: ["อย.", "Import Grade A", "HACCP"] },
  { id: "m-staranise",      name: "โป๊ยกั๊ก (Star Anise)",               scientificName: "Illicium verum",          category: "ผล/เมล็ด",    image: imgStarAnise,    pricePerKg: 640,   moq: 5,  stock: 350,  grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.9, certifications: ["อย.", "HACCP"] },
  { id: "m-bayleaf",        name: "ใบกระวานเทศแห้ง (Bay Leaf)",          scientificName: "Laurus nobilis",          category: "ใบ",          image: imgBayLeaf,      pricePerKg: 560,   moq: 5,  stock: 300,  grade: "คัดสรร",   supplier: "METAHERB Store",       supplierVerified: true,  location: "นครปฐม",    rating: 4.6, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-bael",           name: "มะตูมอบแห้ง (Bael Fruit)",            scientificName: "Aegle marmelos",          category: "ผล/เมล็ด",    image: imgBael,         pricePerKg: 320,   moq: 10, stock: 620,  grade: "คัดสรร",   supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "เชียงราย",  rating: 4.7, certifications: ["อย.", "GAP"] },
  { id: "m-chamomile",      name: "ดอกคาโมมายล์แห้ง (Chamomile)",         scientificName: "Matricaria chamomilla",   category: "ดอก",         image: imgChamomile,    pricePerKg: 1450,  moq: 3,  stock: 170,  grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "นครปฐม",    rating: 4.9, certifications: ["อย.", "Organic Thailand", "ECOCERT"] },
  { id: "m-ginseng",        name: "โสมแห้ง (Ginseng Root)",              scientificName: "Panax ginseng",           category: "ราก/หัว",     image: imgGinseng,      pricePerKg: 8800,  moq: 1,  stock: 60,   grade: "พรีเมียม", supplier: "METAHERB Store",       supplierVerified: true,  location: "กรุงเทพฯ", rating: 4.9, certifications: ["อย.", "Import Grade A", "HACCP"] },
  { id: "m-fingerroot",     name: "กระชายฝานแห้ง (Fingerroot)",          scientificName: "Boesenbergia rotunda",    category: "ราก/หัว",     image: imgFingerRoot,   pricePerKg: 420,   moq: 15, stock: 1100, grade: "คัดสรร",   supplier: "บ้านสมุนไพรไทย",     supplierVerified: true,  location: "น่าน",       rating: 4.7, certifications: ["อย.", "GAP"] },
  { id: "m-cacao",          name: "เมล็ดคาเคา/ผงโกโก้ (Cacao)",          scientificName: "Theobroma cacao",         category: "ผล/เมล็ด",    image: imgCacao,        pricePerKg: 760,   moq: 5,  stock: 340,  grade: "พรีเมียม", supplier: "กรีนลีฟ ออร์แกนิก", supplierVerified: true,  location: "จันทบุรี",   rating: 4.8, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-coffee",         name: "เมล็ดกาแฟคั่ว (Roasted Coffee Beans)",scientificName: "Coffea arabica",          category: "ผล/เมล็ด",    image: imgCoffee,       pricePerKg: 540,   moq: 5,  stock: 880,  grade: "คัดสรร",   supplier: "METAHERB Store",       supplierVerified: true,  location: "เชียงราย",  rating: 4.8, certifications: ["อย.", "GAP", "Organic Thailand"] },
];

export const CATEGORIES: ("ทั้งหมด" | MaterialCategory)[] = ["ทั้งหมด", "ราก/หัว", "ใบ", "ดอก", "เปลือก", "ผล/เมล็ด", "สมุนไพรรวม", "เห็ด"];
export const GRADES: ("ทั้งหมด" | MaterialGrade)[] = ["ทั้งหมด", "พรีเมียม", "คัดสรร", "มาตรฐาน", "ทั่วไป", "ประหยัด"];

// Metallic gradients + glow for premium feel — International B2B tier names
// `bg` is a CSS background (gradient), use with `background: gradeStyle.bg` (not backgroundColor)
export const GRADE_STYLE: Record<MaterialGrade, { bg: string; color: string; shadow: string; textShadow: string }> = {
  พรีเมียม: {
    bg: "linear-gradient(135deg, #fde68a 0%, #f59e0b 45%, #b45309 100%)",
    color: "#fff",
    shadow: "0 2px 8px rgba(245,158,11,0.45), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
    textShadow: "0 1px 1px rgba(120,53,15,0.4)",
  },
  คัดสรร: {
    bg: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 50%, #475569 100%)",
    color: "#fff",
    shadow: "0 2px 8px rgba(100,116,139,0.4), inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -1px 0 rgba(0,0,0,0.1)",
    textShadow: "0 1px 1px rgba(51,65,85,0.5)",
  },
  มาตรฐาน: {
    bg: "linear-gradient(135deg, #fdba74 0%, #c2410c 50%, #7c2d12 100%)",
    color: "#fff",
    shadow: "0 2px 8px rgba(194,65,12,0.45), inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.15)",
    textShadow: "0 1px 1px rgba(124,45,18,0.5)",
  },
  ทั่วไป: {
    bg: "linear-gradient(135deg, #a7f3d0 0%, #10b981 50%, #047857 100%)",
    color: "#fff",
    shadow: "0 2px 8px rgba(16,185,129,0.35), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
    textShadow: "0 1px 1px rgba(4,120,87,0.4)",
  },
  ประหยัด: {
    bg: "linear-gradient(135deg, #cbd5e1 0%, #64748b 50%, #334155 100%)",
    color: "#fff",
    shadow: "0 2px 8px rgba(100,116,139,0.35), inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(0,0,0,0.1)",
    textShadow: "0 1px 1px rgba(51,65,85,0.4)",
  },
};

/* ===== Supplier profiles ===== */
export interface SupplierProfile {
  id: string;
  name: string;
  description: string;
  established: string;
  responseRate: number;     // %
  responseTime: string;     // "เฉลี่ย X ชม."
  followers: number;
  totalReviews: number;
  banner: string;
  certifications: string[];
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
}

// ใช้ slug ของ supplier name เป็น id (a-z และ -)
const toSlug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9฀-๿]+/g, "-").replace(/^-|-$/g, "");

export const SUPPLIERS: SupplierProfile[] = [
  {
    id: toSlug("ฟาร์มสมุนไพรนำชัย"),
    name: "ฟาร์มสมุนไพรนำชัย",
    description: "ฟาร์มสมุนไพรออร์แกนิคในเขตเชียงใหม่ — ปลูกและแปรรูปสมุนไพรไทยมานานกว่า 15 ปี ภายใต้มาตรฐาน Organic Thailand และ GMP เน้นเครื่องเทศและสมุนไพรพื้นบ้าน ส่งให้โรงงานชาและอาหารเสริมทั่วประเทศ",
    established: "2552 (15 ปี)",
    responseRate: 98,
    responseTime: "เฉลี่ย 2 ชม.",
    followers: 2840,
    totalReviews: 312,
    banner: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80",
    certifications: ["Organic Thailand", "GMP", "อย.", "GAP"],
    contact: { phone: "053-XXX-1234", email: "info@namchai-farm.co.th", website: "namchai-herbal.com" },
  },
  {
    id: toSlug("วิสาหกิจชุมชนแม่จัน"),
    name: "วิสาหกิจชุมชนแม่จัน",
    description: "วิสาหกิจชุมชนเชียงราย — รวมกลุ่มเกษตรกร 60 ครัวเรือนปลูกใบบัวบกและดอกคำฝอย ภายใต้มาตรฐาน Organic แม่จัน ส่งให้ผู้ผลิตเครื่องสำอางและชาในไทยและต่างประเทศ",
    established: "2557 (10 ปี)",
    responseRate: 95,
    responseTime: "เฉลี่ย 4 ชม.",
    followers: 1240,
    totalReviews: 156,
    banner: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80",
    certifications: ["ECOCERT", "Organic Thailand", "อย."],
    contact: { phone: "053-XXX-5678", email: "contact@maechan-coop.org" },
  },
  {
    id: toSlug("Herbal Garden Bangkok"),
    name: "Herbal Garden Bangkok",
    description: "ผู้ผลิตและส่งออกดอกอัญชัน ดอกกุหลาบ และดอกไม้สมุนไพรในจังหวัดนครปฐม — ทำงานร่วมกับเกษตรกรในเครือข่าย Premium grade ส่งให้ร้านชาและคาเฟ่ทั่วโลก",
    established: "2560 (7 ปี)",
    responseRate: 99,
    responseTime: "เฉลี่ย 1 ชม.",
    followers: 4520,
    totalReviews: 487,
    banner: "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=1600&q=80",
    certifications: ["Organic Thailand", "อย.", "HACCP"],
    contact: { phone: "02-XXX-1212", email: "hello@herbalgarden.bkk", website: "herbalgarden-bkk.com" },
  },
  {
    id: toSlug("Spice Trading Co."),
    name: "Spice Trading Co.",
    description: "ผู้นำเข้าและกระจายเครื่องเทศพรีเมียม — อบเชย เทียนสัตตบุษย์ จากศรีลังกาและอินเดีย ใบรับรอง HACCP มีคลังสินค้าในกรุงเทพฯ จัดส่งทั่วประเทศ",
    established: "2545 (20 ปี)",
    responseRate: 97,
    responseTime: "เฉลี่ย 3 ชม.",
    followers: 6210,
    totalReviews: 902,
    banner: "https://images.unsplash.com/photo-1607164784793-a8f95d20d7b9?w=1600&q=80",
    certifications: ["HACCP", "ISO 22000", "อย."],
    contact: { phone: "02-XXX-3434", email: "sales@spicetrading.co.th", website: "spicetrading.co.th" },
  },
  {
    id: toSlug("สหกรณ์เกษตรอินทรีย์"),
    name: "สหกรณ์เกษตรอินทรีย์",
    description: "สหกรณ์เกษตรกรในจังหวัดลำปาง — เน้นพืชหัวและเหง้า ขิง ขมิ้น ภายใต้มาตรฐาน GAP",
    established: "2555 (12 ปี)",
    responseRate: 92,
    responseTime: "เฉลี่ย 6 ชม.",
    followers: 980,
    totalReviews: 128,
    banner: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600&q=80",
    certifications: ["GAP", "อย."],
    contact: { phone: "054-XXX-7890", email: "lampang.coop@gmail.com" },
  },
  {
    id: toSlug("ฟาร์มสมุนไพรน่าน"),
    name: "ฟาร์มสมุนไพรน่าน",
    description: "ฟาร์มสมุนไพรในจังหวัดน่าน — เชี่ยวชาญเรื่องกระชายและรากสมุนไพรพื้นถิ่น มาตรฐาน GAP",
    established: "2558 (9 ปี)",
    responseRate: 94,
    responseTime: "เฉลี่ย 5 ชม.",
    followers: 720,
    totalReviews: 96,
    banner: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80",
    certifications: ["GAP", "อย."],
    contact: { phone: "054-XXX-1111", email: "nan.herbalfarm@gmail.com" },
  },
  {
    id: toSlug("Metaherb Wholesale"),
    name: "Metaherb Wholesale",
    description: "Metaherb Wholesale — บริการขายส่งสมุนไพรครบวงจร ผสมสูตรชาและสมุนไพรตามต้องการ มีโรงงานบรรจุภายใน HACCP / ISO 22000",
    established: "2562 (5 ปี)",
    responseRate: 99,
    responseTime: "เฉลี่ย 1 ชม.",
    followers: 8120,
    totalReviews: 1245,
    banner: "https://images.unsplash.com/photo-1635004405538-3afd0e58ad6f?w=1600&q=80",
    certifications: ["HACCP", "ISO 22000", "GMP", "อย."],
    contact: { phone: "02-XXX-9999", email: "b2b@metaherb.co.th", website: "metaherb.co.th" },
  },
  {
    id: toSlug("ฟาร์มมะรุมพะเยา"),
    name: "ฟาร์มมะรุมพะเยา",
    description: "ฟาร์มมะรุมในจังหวัดพะเยา — เน้นการแปรรูปใบมะรุมเป็นผง ขายในประเทศและส่งออกผ่านตัวแทน",
    established: "2561 (6 ปี)",
    responseRate: 88,
    responseTime: "เฉลี่ย 8 ชม.",
    followers: 320,
    totalReviews: 42,
    banner: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1600&q=80",
    certifications: ["อย."],
    contact: { phone: "054-XXX-2222", email: "phayao.moringa@gmail.com" },
  },
  {
    id: toSlug("Healthy Seeds Import"),
    name: "Healthy Seeds Import",
    description: "นำเข้าเมล็ดสุขภาพระดับ Organic — เมล็ดเจีย แฟลกซ์ เมล็ดงา จากแหล่งผลิตทั่วโลก พร้อมใบรับรอง",
    established: "2563 (4 ปี)",
    responseRate: 96,
    responseTime: "เฉลี่ย 2 ชม.",
    followers: 1840,
    totalReviews: 213,
    banner: "https://images.unsplash.com/photo-1559054663-e8d23213f55c?w=1600&q=80",
    certifications: ["Organic", "อย.", "HACCP"],
    contact: { phone: "02-XXX-5555", email: "info@healthyseeds.co.th", website: "healthyseeds.co.th" },
  },
];

export const getSupplierBySlug = (slug: string): SupplierProfile | undefined =>
  SUPPLIERS.find((s) => s.id === slug);

export const getSupplierByName = (name: string): SupplierProfile | undefined =>
  SUPPLIERS.find((s) => s.name === name);

export const slugifySupplier = (name: string): string => toSlug(name);

