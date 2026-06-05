export type MaterialCategory = "ราก/หัว" | "ใบ" | "ดอก" | "เปลือก" | "ผล/เมล็ด" | "สมุนไพรรวม";
export type MaterialGrade = "Premium" | "A" | "B";

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

export const MATERIAL_IMAGES = [
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=600&q=80",
  "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&q=80",
  "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&q=80",
  "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=600&q=80",
  "https://images.unsplash.com/photo-1607164784793-a8f95d20d7b9?w=600&q=80",
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=600&q=80",
  "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?w=600&q=80",
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80",
];

export const MATERIALS: HerbalMaterial[] = [
  { id: "m-1",  name: "ขมิ้นชันแห้ง (ผง)",        scientificName: "Curcuma longa",        category: "ราก/หัว",       image: MATERIAL_IMAGES[1], pricePerKg: 320,  moq: 25,  stock: 2400, grade: "Premium", supplier: "ฟาร์มสมุนไพรนำชัย",     supplierVerified: true,  location: "เชียงใหม่",   rating: 4.9, certifications: ["อย.", "Organic Thailand", "GMP"] },
  { id: "m-2",  name: "ตะไคร้แห้ง (สับ)",         scientificName: "Cymbopogon citratus",  category: "ใบ",            image: MATERIAL_IMAGES[0], pricePerKg: 180,  moq: 20,  stock: 1800, grade: "A",       supplier: "ฟาร์มสมุนไพรนำชัย",     supplierVerified: true,  location: "เชียงใหม่",   rating: 4.7, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-3",  name: "ใบบัวบกแห้ง",              scientificName: "Centella asiatica",     category: "ใบ",            image: MATERIAL_IMAGES[6], pricePerKg: 450,  moq: 10,  stock: 800,  grade: "Premium", supplier: "วิสาหกิจชุมชนแม่จัน",    supplierVerified: true,  location: "เชียงราย",    rating: 4.8, certifications: ["อย.", "ECOCERT"] },
  { id: "m-4",  name: "ดอกอัญชันแห้ง",            scientificName: "Clitoria ternatea",    category: "ดอก",           image: MATERIAL_IMAGES[2], pricePerKg: 520,  moq: 5,   stock: 320,  grade: "Premium", supplier: "Herbal Garden Bangkok",  supplierVerified: true,  location: "นครปฐม",      rating: 4.9, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-5",  name: "ขิงแก่แห้ง (ฝาน)",         scientificName: "Zingiber officinale",   category: "ราก/หัว",       image: MATERIAL_IMAGES[3], pricePerKg: 280,  moq: 30,  stock: 3500, grade: "A",       supplier: "สหกรณ์เกษตรอินทรีย์",   supplierVerified: true,  location: "ลำปาง",       rating: 4.6, certifications: ["อย.", "GAP"] },
  { id: "m-6",  name: "อบเชยเทศ (แท่ง)",          scientificName: "Cinnamomum verum",     category: "เปลือก",        image: MATERIAL_IMAGES[4], pricePerKg: 780,  moq: 10,  stock: 450,  grade: "Premium", supplier: "Spice Trading Co.",     supplierVerified: true,  location: "กรุงเทพฯ",   rating: 4.8, certifications: ["อย.", "HACCP"] },
  { id: "m-7",  name: "เมล็ดเทียนสัตตบุษย์",      scientificName: "Pimpinella anisum",    category: "ผล/เมล็ด",    image: MATERIAL_IMAGES[7], pricePerKg: 620,  moq: 5,   stock: 220,  grade: "A",       supplier: "Spice Trading Co.",     supplierVerified: true,  location: "กรุงเทพฯ",   rating: 4.5, certifications: ["อย."] },
  { id: "m-8",  name: "กระชายแห้ง (ฝาน)",         scientificName: "Boesenbergia rotunda",  category: "ราก/หัว",       image: MATERIAL_IMAGES[3], pricePerKg: 420,  moq: 15,  stock: 1100, grade: "A",       supplier: "ฟาร์มสมุนไพรน่าน",       supplierVerified: true,  location: "น่าน",         rating: 4.7, certifications: ["อย.", "GAP"] },
  { id: "m-9",  name: "ดอกคำฝอย",                  scientificName: "Carthamus tinctorius",  category: "ดอก",           image: MATERIAL_IMAGES[2], pricePerKg: 380,  moq: 5,   stock: 180,  grade: "Premium", supplier: "วิสาหกิจชุมชนแม่จัน",    supplierVerified: true,  location: "เชียงราย",    rating: 4.6, certifications: ["อย.", "Organic Thailand"] },
  { id: "m-10", name: "สมุนไพรชา 7 ชนิดผสม",     scientificName: "Herbal Tea Blend",       category: "สมุนไพรรวม", image: MATERIAL_IMAGES[5], pricePerKg: 950,  moq: 5,   stock: 240,  grade: "Premium", supplier: "Metaherb Wholesale",     supplierVerified: true,  location: "กรุงเทพฯ",   rating: 4.9, certifications: ["อย.", "ISO 22000", "HACCP"] },
  { id: "m-11", name: "ใบมะรุมแห้ง (ผง)",        scientificName: "Moringa oleifera",      category: "ใบ",            image: MATERIAL_IMAGES[6], pricePerKg: 540,  moq: 10,  stock: 680,  grade: "Premium", supplier: "ฟาร์มมะรุมพะเยา",         supplierVerified: false, location: "พะเยา",       rating: 4.5, certifications: ["อย."] },
  { id: "m-12", name: "เมล็ดเจียแห้ง",             scientificName: "Salvia hispanica",       category: "ผล/เมล็ด",    image: MATERIAL_IMAGES[7], pricePerKg: 280,  moq: 20,  stock: 1400, grade: "A",       supplier: "Healthy Seeds Import",   supplierVerified: true,  location: "กรุงเทพฯ",   rating: 4.4, certifications: ["อย.", "Organic"] },
];

export const CATEGORIES: ("ทั้งหมด" | MaterialCategory)[] = ["ทั้งหมด", "ราก/หัว", "ใบ", "ดอก", "เปลือก", "ผล/เมล็ด", "สมุนไพรรวม"];
export const GRADES: ("ทั้งหมด" | MaterialGrade)[] = ["ทั้งหมด", "Premium", "A", "B"];

export const GRADE_STYLE: Record<MaterialGrade, { bg: string; color: string }> = {
  Premium: { bg: "#319754", color: "#fff" },
  A:       { bg: "#3b82f6", color: "#fff" },
  B:       { bg: "#9ca3af", color: "#fff" },
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

