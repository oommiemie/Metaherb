export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  discountPercent?: number;
  rating: number;
  sold: string;
  image: string;
  category: string;
  tag?: string;
  tags?: string[];
  isFlashSale?: boolean;
  isRecommended?: boolean;
  hasCoupon?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isFreeShipping?: boolean;
  flashSaleEndsIn?: number; // seconds remaining
  description: string;
  weight: string;
  type: string;
  sku: string;
  format: string;
  shopName: string;
  options: string[];
  stock: number;
  reviews: { user: string; rating: number; date: string; tags: string[]; comment: string; images: string[] }[];
}

export const categories = ["สมุนไพร", "อาหาร", "ยา", "เครื่องหอม", "ความสวย", "ชุดของขวัญ", "บริการ", "โปรโมชั่น", "คูปอง"];

export const products: Product[] = [
  {
    id: "1", name: "ชาออร์แกนิก", price: 199, originalPrice: 330, discountPercent: 40, rating: 4.5, sold: "ขายได้ 150+",
    image: "", category: "เครื่องดื่ม", isFlashSale: true, hasCoupon: true, flashSaleEndsIn: 43988,
    tags: ["ขายดี", "ส่งฟรี"], isBestSeller: true, isFreeShipping: true,
    description: "สัมผัสรสชาติสมุนไพรชาออร์แกนิก 100% จากยอดเขาเหนือรหัส นุ่มลิ้มลึกซึ้ง บรรจงจากสามเณรมีรุ่นแง่ เพื่อสุขภาพที่ดีของคุณ.",
    weight: "50 กรัม", type: "ชาสมุนไพร", sku: "MH-ORG-TEA-2024", format: "ใบชายบดค้าง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2", "ตัวเลือก 3", "ตัวเลือก 4", "ตัวเลือก 5"], stock: 10,
    reviews: [
      { user: "user02", rating: 5, date: "15 กุมภาพันธ์ 2569 - 14:50 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ชื่นชอบมาก สินค้าดีมากครับ/ค่ะ", images: [] },
      { user: "user03", rating: 5, date: "14 กุมภาพันธ์ 2569 - 09:15 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "รสชาติดี กลิ่นหอมมาก ชอบๆ", images: [] },
      { user: "user04", rating: 5, date: "13 กุมภาพันธ์ 2569 - 14:41 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "เลอค่ามาก สินค้าดีมาก แพ็คเกจดีงามมาก", images: [] },
      { user: "user05", rating: 5, date: "12 กุมภาพันธ์ 2569 - 12:15 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "สินค้าดีมากครับ คุ้มค่าสุดๆ แพ็คเกจสวยงามมาก", images: [] },
    ],
  },
  {
    id: "2", name: "กาแฟดริปออร์แกนิก", price: 250, originalPrice: 350, discountPercent: 29, rating: 4.9, sold: "ขายได้ 80+",
    image: "", category: "เครื่องดื่ม", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "กาแฟคั่วบดสดใหม่จากดอยสูง ให้กลิ่นหอมนุ่มละมุน",
    weight: "200 กรัม", type: "กาแฟ", sku: "MH-COF-001", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 50,
    reviews: [{ user: "user02", rating: 5, date: "10 ก.พ. 2569", tags: ["สินค้าดี ✓"], comment: "กาแฟหอมมาก", images: [] }],
  },
  {
    id: "3", name: "น้ำผึ้งดิบ", price: 150, originalPrice: 250, discountPercent: 40, rating: 4.7, sold: "ขายได้ 120+",
    image: "", category: "อาหาร", isFlashSale: true, hasCoupon: false, flashSaleEndsIn: 28800,
    tags: ["ขายดี"], isBestSeller: true,
    description: "น้ำผึ้งแท้ 100% จากป่าธรรมชาติ",
    weight: "350 มล.", type: "น้ำผึ้ง", sku: "MH-HON-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 30,
    reviews: [],
  },
  {
    id: "4", name: "ขมิ้นชันแคปซูล", price: 185, originalPrice: 260, discountPercent: 29, rating: 4.6, sold: "ขายได้ 210+",
    image: "", category: "สมุนไพร", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ขายดี"], isBestSeller: true,
    description: "ขมิ้นชันสกัดเข้มข้น บำรุงกระเพาะ ลดอักเสบ",
    weight: "60 แคปซูล", type: "อาหารเสริม", sku: "MH-TUR-001", format: "แคปซูล",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 80,
    reviews: [],
  },
  {
    id: "5", name: "น้ำมันมะพร้าวสกัดเย็น", price: 159, originalPrice: 265, discountPercent: 40, rating: 4.7, sold: "ขายได้ 95+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 14400, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "น้ำมันมะพร้าวสกัดเย็นบริสุทธิ์ ใช้ทำอาหารและบำรุงผิว",
    weight: "500 มล.", type: "น้ำมัน", sku: "MH-COCO-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 25,
    reviews: [],
  },
  {
    id: "6", name: "ฟ้าทะลายโจรสกัด", price: 120, rating: 4.6, sold: "ขายได้ 350+",
    image: "", category: "สมุนไพร", isRecommended: true, hasCoupon: false,
    tags: ["ขายดี", "แนะนำ"], isBestSeller: true,
    description: "ฟ้าทะลายโจรสกัดเข้มข้น เสริมภูมิคุ้มกัน",
    weight: "30 แคปซูล", type: "อาหารเสริม", sku: "MH-FAH-001", format: "แคปซูล",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 100,
    reviews: [],
  },
  {
    id: "7", name: "แยมมัลเบอร์รี่", price: 99, originalPrice: 140, discountPercent: 29, rating: 4.6, sold: "ขายได้ 180+",
    image: "", category: "อาหาร", hasCoupon: true,
    tags: ["ใหม่"], isNew: true,
    description: "แยมมัลเบอร์รี่ออร์แกนิก หวานธรรมชาติ ไม่ใส่น้ำตาล",
    weight: "200 กรัม", type: "แยม", sku: "MH-JAM-001", format: "ขวดแก้ว",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 60,
    reviews: [],
  },
  {
    id: "8", name: "ซอสพริกสมุนไพร", price: 89, originalPrice: 120, discountPercent: 26, rating: 4.4, sold: "ขายได้ 90+",
    image: "", category: "อาหาร", hasCoupon: false,
    tags: ["ใหม่", "ส่งฟรี"], isNew: true, isFreeShipping: true,
    description: "ซอสพริกสูตรโบราณ ผสมสมุนไพร 7 ชนิด",
    weight: "250 มล.", type: "ซอส", sku: "MH-SAU-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 45,
    reviews: [],
  },
  {
    id: "9", name: "ครีมบำรุงว่านหางจระเข้", price: 280, originalPrice: 420, discountPercent: 33, rating: 4.9, sold: "ขายได้ 80+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 7200, hasCoupon: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "ครีมบำรุงผิวจากว่านหางจระเข้สด เข้มข้น 92%",
    weight: "50 มล.", type: "ครีม", sku: "MH-CRM-001", format: "หลอด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 35,
    reviews: [],
  },
  {
    id: "10", name: "น้ำมันมะกอกออร์แกนิก", price: 299, originalPrice: 450, discountPercent: 34, rating: 4.9, sold: "ขายได้ 75+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 36000, hasCoupon: false,
    tags: ["ขายดี", "ส่งฟรี"], isBestSeller: true, isFreeShipping: true,
    description: "น้ำมันมะกอกบริสุทธิ์ Extra Virgin นำเข้าจากอิตาลี",
    weight: "500 มล.", type: "น้ำมัน", sku: "MH-OIL-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 20,
    reviews: [],
  },
  {
    id: "11", name: "กาแฟดริปดอยช้าง", price: 249, rating: 4.8, sold: "ขายได้ 200+",
    image: "", category: "เครื่องดื่ม", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ขายดี"], isBestSeller: true,
    description: "กาแฟดริปคั่วกลาง จากดอยช้าง เชียงราย กลิ่นหอมช็อกโกแลต",
    weight: "200 กรัม", type: "กาแฟ", sku: "MH-COF-002", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 55,
    reviews: [],
  },
  {
    id: "12", name: "มะขามป้อมอบแห้ง", price: 75, originalPrice: 110, discountPercent: 32, rating: 4.9, sold: "ขายได้ 420+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 21600, hasCoupon: true,
    tags: ["ขายดี", "ใหม่"], isBestSeller: true, isNew: true,
    description: "มะขามป้อมอบแห้ง อุดมวิตามินซี รสชาติกลมกล่อม",
    weight: "150 กรัม", type: "ขนม", sku: "MH-AMB-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 90,
    reviews: [],
  },
  {
    id: "13", name: "ชาเขียวมัทฉะ", price: 320, originalPrice: 480, discountPercent: 33, rating: 4.8, sold: "ขายได้ 60+",
    image: "", category: "เครื่องดื่ม", isFlashSale: true, flashSaleEndsIn: 18000, hasCoupon: true,
    tags: ["ขายดี"], isBestSeller: true, isFreeShipping: true,
    description: "มัทฉะเกรดพรีเมียมจากญี่ปุ่น กลิ่นหอมละมุน",
    weight: "100 กรัม", type: "ชา", sku: "MH-MAT-001", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 40, reviews: [],
  },
  {
    id: "14", name: "น้ำมันงาดำสกัดเย็น", price: 189, originalPrice: 290, discountPercent: 35, rating: 4.5, sold: "ขายได้ 130+",
    image: "", category: "อาหาร", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "น้ำมันงาดำสกัดเย็น 100% บำรุงร่างกาย",
    weight: "250 มล.", type: "น้ำมัน", sku: "MH-SES-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 35, reviews: [],
  },
  {
    id: "15", name: "สบู่สมุนไพรมะขาม", price: 65, rating: 4.3, sold: "ขายได้ 300+",
    image: "", category: "ความสวย", hasCoupon: false, isNew: true,
    tags: ["ใหม่"], description: "สบู่สมุนไพรมะขาม ผิวนุ่มกระจ่างใส",
    weight: "100 กรัม", type: "สบู่", sku: "MH-SOP-001", format: "ก้อน",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 150, reviews: [],
  },
  {
    id: "16", name: "ยาหม่องสมุนไพร", price: 45, rating: 4.6, sold: "ขายได้ 500+",
    image: "", category: "ยา", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ยาหม่องสูตรโบราณ บรรเทาปวดเมื่อย",
    weight: "30 กรัม", type: "ยาหม่อง", sku: "MH-BLM-001", format: "กระปุก",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 200, reviews: [],
  },
  {
    id: "17", name: "เทียนหอมลาเวนเดอร์", price: 220, originalPrice: 350, discountPercent: 37, rating: 4.7, sold: "ขายได้ 45+",
    image: "", category: "เครื่องหอม", isFlashSale: true, flashSaleEndsIn: 10800, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "เทียนหอมลาเวนเดอร์ธรรมชาติ ผ่อนคลาย",
    weight: "200 กรัม", type: "เทียนหอม", sku: "MH-CND-001", format: "แก้ว",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 30, reviews: [],
  },
  {
    id: "18", name: "ชุดของขวัญสมุนไพร", price: 599, originalPrice: 890, discountPercent: 33, rating: 4.9, sold: "ขายได้ 25+",
    image: "", category: "ชุดของขวัญ", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "ชุดของขวัญสมุนไพรพรีเมียม รวมชา น้ำผึ้ง และเทียนหอม",
    weight: "500 กรัม", type: "ชุดของขวัญ", sku: "MH-GFT-001", format: "กล่อง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 15, reviews: [],
  },
  {
    id: "19", name: "แชมพูสมุนไพรอัญชัน", price: 179, originalPrice: 250, discountPercent: 28, rating: 4.4, sold: "ขายได้ 170+",
    image: "", category: "ความสวย", hasCoupon: true, isBestSeller: true,
    tags: ["ขายดี", "ส่งฟรี"], isFreeShipping: true,
    description: "แชมพูสมุนไพรอัญชัน ผมดกดำ เงางาม",
    weight: "300 มล.", type: "แชมพู", sku: "MH-SHP-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 80, reviews: [],
  },
  {
    id: "20", name: "น้ำมันยูคาลิปตัส", price: 95, rating: 4.5, sold: "ขายได้ 220+",
    image: "", category: "สมุนไพร", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "น้ำมันยูคาลิปตัสบริสุทธิ์ ใช้สูดดมหรือนวด",
    weight: "30 มล.", type: "น้ำมันหอมระเหย", sku: "MH-EUC-001", format: "ขวดหยด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 120, reviews: [],
  },
  {
    id: "21", name: "ผงขมิ้นชันออร์แกนิก", price: 129, originalPrice: 180, discountPercent: 28, rating: 4.6, sold: "ขายได้ 90+",
    image: "", category: "สมุนไพร", hasCoupon: true, isNew: true,
    tags: ["ใหม่", "ส่งฟรี"], isFreeShipping: true,
    description: "ผงขมิ้นชันบดละเอียด ออร์แกนิก 100%",
    weight: "100 กรัม", type: "ผงสมุนไพร", sku: "MH-TUR-002", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 70, reviews: [],
  },
  {
    id: "22", name: "ชาดอกเก๊กฮวย", price: 110, rating: 4.3, sold: "ขายได้ 140+",
    image: "", category: "เครื่องดื่ม", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "ชาดอกเก๊กฮวยอบแห้ง หอมสดชื่น",
    weight: "50 กรัม", type: "ชา", sku: "MH-CHR-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 60, reviews: [],
  },
  {
    id: "23", name: "ลูกประคบสมุนไพร", price: 85, originalPrice: 120, discountPercent: 29, rating: 4.7, sold: "ขายได้ 180+",
    image: "", category: "บริการ", hasCoupon: true, isBestSeller: true,
    tags: ["ขายดี"], description: "ลูกประคบสมุนไพรไทย บรรเทาอาการปวด",
    weight: "200 กรัม", type: "ลูกประคบ", sku: "MH-CMP-001", format: "ถุง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 100, reviews: [],
  },
  {
    id: "24", name: "แคปซูลกระชายดำ", price: 290, originalPrice: 420, discountPercent: 31, rating: 4.8, sold: "ขายได้ 65+",
    image: "", category: "สมุนไพร", isFlashSale: true, flashSaleEndsIn: 25200, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "กระชายดำสกัดเข้มข้น บำรุงสุขภาพ",
    weight: "60 แคปซูล", type: "อาหารเสริม", sku: "MH-KRA-001", format: "แคปซูล",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 45, reviews: [],
  },
  {
    id: "25", name: "โลชั่นตะไคร้หอม", price: 145, rating: 4.4, sold: "ขายได้ 110+",
    image: "", category: "ความสวย", hasCoupon: false, isNew: true,
    tags: ["ใหม่"], description: "โลชั่นตะไคร้หอม ป้องกันยุง บำรุงผิว",
    weight: "200 มล.", type: "โลชั่น", sku: "MH-LOT-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 85, reviews: [],
  },
  {
    id: "26", name: "น้ำผึ้งมะนาว", price: 125, originalPrice: 180, discountPercent: 31, rating: 4.6, sold: "ขายได้ 200+",
    image: "", category: "เครื่องดื่ม", hasCoupon: true, isBestSeller: true,
    tags: ["ขายดี", "ส่งฟรี"], isFreeShipping: true,
    description: "น้ำผึ้งมะนาวสดพร้อมดื่ม สดชื่นจากธรรมชาติ",
    weight: "500 มล.", type: "เครื่องดื่ม", sku: "MH-HLM-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 65, reviews: [],
  },
  {
    id: "27", name: "สเปรย์สมุนไพรดับกลิ่น", price: 79, rating: 4.2, sold: "ขายได้ 250+",
    image: "", category: "เครื่องหอม", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "สเปรย์สมุนไพรดับกลิ่น สูตรธรรมชาติ",
    weight: "100 มล.", type: "สเปรย์", sku: "MH-SPR-001", format: "ขวดสเปรย์",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 130, reviews: [],
  },
  {
    id: "28", name: "เจลว่านหางจระเข้", price: 159, originalPrice: 230, discountPercent: 31, rating: 4.7, sold: "ขายได้ 95+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 14400, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "เจลว่านหางจระเข้เข้มข้น 99% บำรุงผิว",
    weight: "250 มล.", type: "เจล", sku: "MH-ALG-001", format: "หลอด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 55, reviews: [],
  },
  {
    id: "29", name: "ชาอู่หลงบนดอย", price: 350, rating: 4.9, sold: "ขายได้ 35+",
    image: "", category: "เครื่องดื่ม", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ขายดี"], isBestSeller: true,
    description: "ชาอู่หลงจากยอดดอย หอมกรุ่น รสนุ่มลึก",
    weight: "75 กรัม", type: "ชา", sku: "MH-OOL-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 20, reviews: [],
  },
  {
    id: "30", name: "ยาดมสมุนไพร 7 รส", price: 35, rating: 4.5, sold: "ขายได้ 800+",
    image: "", category: "ยา", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ยาดมสมุนไพร 7 ชนิด สดชื่น",
    weight: "5 กรัม", type: "ยาดม", sku: "MH-INH-001", format: "หลอด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 300, reviews: [],
  },
  {
    id: "31", name: "ครีมทามือสมุนไพร", price: 139, originalPrice: 199, discountPercent: 30, rating: 4.4, sold: "ขายได้ 85+",
    image: "", category: "ความสวย", hasCoupon: true, isNew: true,
    tags: ["ใหม่", "ส่งฟรี"], isFreeShipping: true,
    description: "ครีมทามือสูตรสมุนไพรไทย บำรุงมือนุ่ม",
    weight: "50 กรัม", type: "ครีม", sku: "MH-HCR-001", format: "หลอด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 70, reviews: [],
  },
  {
    id: "32", name: "ถั่วรวมสมุนไพร", price: 89, rating: 4.3, sold: "ขายได้ 160+",
    image: "", category: "อาหาร", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "ถั่วรวม 5 ชนิดปรุงรสสมุนไพร อร่อยมีประโยชน์",
    weight: "200 กรัม", type: "ขนม", sku: "MH-NUT-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 95, reviews: [],
  },
  {
    id: "33", name: "น้ำมันหอมระเหยส้ม", price: 175, originalPrice: 260, discountPercent: 33, rating: 4.6, sold: "ขายได้ 70+",
    image: "", category: "เครื่องหอม", hasCoupon: true, isFlashSale: true, flashSaleEndsIn: 32400,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "น้ำมันหอมระเหยส้ม สกัดเย็น กลิ่นสดชื่น",
    weight: "15 มล.", type: "น้ำมันหอมระเหย", sku: "MH-ORG-002", format: "ขวดหยด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 50, reviews: [],
  },
  {
    id: "34", name: "ข้าวกล้องงอก", price: 69, rating: 4.5, sold: "ขายได้ 340+",
    image: "", category: "อาหาร", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ข้าวกล้องงอก GABA สูง บำรุงสมอง",
    weight: "1 กก.", type: "ข้าว", sku: "MH-RIC-001", format: "ถุง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 110, reviews: [],
  },
  {
    id: "35", name: "ชุดสปาสมุนไพร", price: 450, originalPrice: 650, discountPercent: 31, rating: 4.8, sold: "ขายได้ 20+",
    image: "", category: "ชุดของขวัญ", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "ชุดสปาสมุนไพรครบเซ็ต สครับ ลูกประคบ น้ำมันนวด",
    weight: "800 กรัม", type: "ชุดของขวัญ", sku: "MH-SPA-001", format: "กล่อง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 12, reviews: [],
  },
  {
    id: "36", name: "น้ำมะตูมพร้อมดื่ม", price: 55, rating: 4.2, sold: "ขายได้ 190+",
    image: "", category: "เครื่องดื่ม", hasCoupon: false, isNew: true,
    tags: ["ใหม่"], description: "น้ำมะตูมเข้มข้น หวานธรรมชาติ ดีต่อท้อง",
    weight: "300 มล.", type: "เครื่องดื่ม", sku: "MH-BAL-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 75, reviews: [],
  },
  {
    id: "37", name: "สครับผิวกาแฟ", price: 199, originalPrice: 290, discountPercent: 31, rating: 4.7, sold: "ขายได้ 55+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 9000, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "สครับผิวจากเมล็ดกาแฟ ขจัดเซลล์ผิวเก่า",
    weight: "200 กรัม", type: "สครับ", sku: "MH-SCR-001", format: "กระปุก",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 40, reviews: [],
  },
  {
    id: "38", name: "มะรุมผง", price: 115, rating: 4.4, sold: "ขายได้ 120+",
    image: "", category: "สมุนไพร", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ"], description: "มะรุมผงอบแห้ง อุดมสารอาหาร ซุปเปอร์ฟู้ด",
    weight: "100 กรัม", type: "ผงสมุนไพร", sku: "MH-MOR-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 65, reviews: [],
  },
  {
    id: "39", name: "ธูปหอมสมุนไพร", price: 49, rating: 4.3, sold: "ขายได้ 280+",
    image: "", category: "เครื่องหอม", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ธูปหอมสมุนไพรไทย กลิ่นหอมสะอาด",
    weight: "20 ก้าน", type: "ธูปหอม", sku: "MH-INC-001", format: "กล่อง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 180, reviews: [],
  },
  {
    id: "40", name: "คูปองส่วนลด 20%", price: 0, rating: 5.0, sold: "แจกแล้ว 500+",
    image: "", category: "คูปอง", hasCoupon: false,
    tags: [], description: "คูปองส่วนลด 20% ใช้ได้ทั้งร้าน",
    weight: "-", type: "คูปอง", sku: "MH-CPN-001", format: "ดิจิทัล",
    shopName: "METAHERB Store", options: [], stock: 999, reviews: [],
  },
  {
    id: "41", name: "พริกไทยดำเกรดพรีเมียม", price: 79, originalPrice: 110, discountPercent: 28, rating: 4.5, sold: "ขายได้ 150+",
    image: "", category: "อาหาร", hasCoupon: true, isNew: true,
    tags: ["ใหม่"], description: "พริกไทยดำเม็ดใหญ่ กลิ่นหอมจัด",
    weight: "100 กรัม", type: "เครื่องเทศ", sku: "MH-PEP-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 90, reviews: [],
  },
  {
    id: "42", name: "เซรั่มวิตามินซีส้มยูซุ", price: 359, originalPrice: 520, discountPercent: 31, rating: 4.9, sold: "ขายได้ 40+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 16200, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "เซรั่มวิตามินซีจากส้มยูซุ ผิวกระจ่างใส",
    weight: "30 มล.", type: "เซรั่ม", sku: "MH-SRM-001", format: "ขวดหยด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 25, reviews: [],
  },
  {
    id: "43", name: "บริการนวดสมุนไพร 60 นาที", price: 499, rating: 4.8, sold: "จอง 30+",
    image: "", category: "บริการ", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: false,
    description: "บริการนวดสมุนไพรไทยแท้ ผ่อนคลายทั้งตัว 60 นาที",
    weight: "-", type: "บริการ", sku: "MH-SVC-001", format: "บริการ",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 10, reviews: [],
  },
];