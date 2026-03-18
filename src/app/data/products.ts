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
  isFlashSale?: boolean;
  isRecommended?: boolean;
  hasCoupon?: boolean;
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

export const categories = ["สมุนไพร", "อาหาร", "กาแมซอ", "เครื่องหอม", "ยา", "เครื่องดื่ม", "บริการ", "โปรโมชั่น"];

export const products: Product[] = [
  {
    id: "1", name: "ชาออร์แกนิก", price: 199, originalPrice: 330, discountPercent: 40, rating: 4.5, sold: "ขายได้ 150+",
    image: "", category: "เครื่องดื่ม", isFlashSale: true, hasCoupon: true, flashSaleEndsIn: 43988,
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
    description: "กาแฟคั่วบดสดใหม่จากดอยสูง ให้กลิ่นหอมนุ่มละมุน",
    weight: "200 กรัม", type: "กาแฟ", sku: "MH-COF-001", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 50,
    reviews: [{ user: "user02", rating: 5, date: "10 ก.พ. 2569", tags: ["สินค้าดี ✓"], comment: "กาแฟหอมมาก", images: [] }],
  },
  {
    id: "3", name: "น้ำผึ้งดิบ", price: 150, originalPrice: 250, discountPercent: 40, rating: 4.7, sold: "ขายได้ 120+",
    image: "", category: "อาหาร", isFlashSale: true, hasCoupon: false, flashSaleEndsIn: 28800,
    description: "น้ำผึ้งแท้ 100% จากป่าธรรมชาติ",
    weight: "350 มล.", type: "น้ำผึ้ง", sku: "MH-HON-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 30,
    reviews: [],
  },
  {
    id: "4", name: "ขมิ้นชันแคปซูล", price: 185, originalPrice: 260, discountPercent: 29, rating: 4.6, sold: "ขายได้ 210+",
    image: "", category: "สมุนไพร", isRecommended: true, hasCoupon: true,
    description: "ขมิ้นชันสกัดเข้มข้น บำรุงกระเพาะ ลดอักเสบ",
    weight: "60 แคปซูล", type: "อาหารเสริม", sku: "MH-TUR-001", format: "แคปซูล",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 80,
    reviews: [],
  },
  {
    id: "5", name: "น้ำมันมะพร้าวสกัดเย็น", price: 159, originalPrice: 265, discountPercent: 40, rating: 4.7, sold: "ขายได้ 95+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 14400, hasCoupon: true,
    description: "น้ำมันมะพร้าวสกัดเย็นบริสุทธิ์ ใช้ทำอาหารและบำรุงผิว",
    weight: "500 มล.", type: "น้ำมัน", sku: "MH-COCO-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 25,
    reviews: [],
  },
  {
    id: "6", name: "ฟ้าทะลายโจรสกัด", price: 120, rating: 4.6, sold: "ขายได้ 350+",
    image: "", category: "สมุนไพร", isRecommended: true, hasCoupon: false,
    description: "ฟ้าทะลายโจรสกัดเข้มข้น เสริมภูมิคุ้มกัน",
    weight: "30 แคปซูล", type: "อาหารเสริม", sku: "MH-FAH-001", format: "แคปซูล",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 100,
    reviews: [],
  },
  {
    id: "7", name: "แยมมัลเบอร์รี่", price: 99, originalPrice: 140, discountPercent: 29, rating: 4.6, sold: "ขายได้ 180+",
    image: "", category: "อาหาร", hasCoupon: true,
    description: "แยมมัลเบอร์รี่ออร์แกนิก หวานธรรมชาติ ไม่ใส่น้ำตาล",
    weight: "200 กรัม", type: "แยม", sku: "MH-JAM-001", format: "ขวดแก้ว",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 60,
    reviews: [],
  },
  {
    id: "8", name: "ซอสพริกสมุนไพร", price: 89, originalPrice: 120, discountPercent: 26, rating: 4.4, sold: "ขายได้ 90+",
    image: "", category: "อาหาร", hasCoupon: false,
    description: "ซอสพริกสูตรโบราณ ผสมสมุนไพร 7 ชนิด",
    weight: "250 มล.", type: "ซอส", sku: "MH-SAU-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 45,
    reviews: [],
  },
  {
    id: "9", name: "ครีมบำรุงว่านหางจระเข้", price: 280, originalPrice: 420, discountPercent: 33, rating: 4.9, sold: "ขายได้ 80+",
    image: "", category: "สมุนไพร", isFlashSale: true, flashSaleEndsIn: 7200, hasCoupon: true,
    description: "ครีมบำรุงผิวจากว่านหางจระเข้สด เข้มข้น 92%",
    weight: "50 มล.", type: "ครีม", sku: "MH-CRM-001", format: "หลอด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 35,
    reviews: [],
  },
  {
    id: "10", name: "น้ำมันมะกอกออร์แกนิก", price: 299, originalPrice: 450, discountPercent: 34, rating: 4.9, sold: "ขายได้ 75+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 36000, hasCoupon: false,
    description: "น้ำมันมะกอกบริสุทธิ์ Extra Virgin นำเข้าจากอิตาลี",
    weight: "500 มล.", type: "น้ำมัน", sku: "MH-OIL-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 20,
    reviews: [],
  },
  {
    id: "11", name: "กาแฟดริปดอยช้าง", price: 249, rating: 4.8, sold: "ขายได้ 200+",
    image: "", category: "เครื่องดื่ม", isRecommended: true, hasCoupon: true,
    description: "กาแฟดริปคั่วกลาง จากดอยช้าง เชียงราย กลิ่นหอมช็อกโกแลต",
    weight: "200 กรัม", type: "กาแฟ", sku: "MH-COF-002", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 55,
    reviews: [],
  },
  {
    id: "12", name: "มะขามป้อมอบแห้ง", price: 75, originalPrice: 110, discountPercent: 32, rating: 4.9, sold: "ขายได้ 420+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 21600, hasCoupon: true,
    description: "มะขามป้อมอบแห้ง อุดมวิตามินซี รสชาติกลมกล่อม",
    weight: "150 กรัม", type: "ขนม", sku: "MH-AMB-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 90,
    reviews: [],
  },
];