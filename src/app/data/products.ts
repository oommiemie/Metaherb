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
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 50,
    reviews: [
      { user: "user02", rating: 5, date: "10 ก.พ. 2569 - 10:30 น.", tags: ["สินค้าดี ✓"], comment: "กาแฟหอมมาก คั่วได้ดี กลิ่นช็อกโกแลตอ่อนๆ", images: [] },
      { user: "user07", rating: 4, date: "8 ก.พ. 2569 - 16:20 น.", tags: ["คุ้มค่า ✓"], comment: "รสชาติกลมกล่อม ดื่มง่าย ไม่ขมเกินไป ชอบมากครับ", images: [] },
      { user: "user12", rating: 5, date: "5 ก.พ. 2569 - 09:45 น.", tags: ["ส่งเร็ว ✓"], comment: "แพ็คดีมาก ส่งเร็ว กาแฟสดใหม่ หอมถึงใจ", images: [] },
      { user: "user18", rating: 5, date: "3 ก.พ. 2569 - 14:10 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ซื้อซ้ำหลายรอบแล้ว คุณภาพคงที่ตลอด", images: [] },
      { user: "user25", rating: 4, date: "1 ก.พ. 2569 - 11:00 น.", tags: ["แนะนำ ✓"], comment: "ดริปง่าย กลิ่นหอมฟุ้ง เหมาะกับช่วงเช้า", images: [] },
    ],
  },
  {
    id: "3", name: "น้ำผึ้งดิบ", price: 150, originalPrice: 250, discountPercent: 40, rating: 4.7, sold: "ขายได้ 120+",
    image: "", category: "อาหาร", isFlashSale: true, hasCoupon: false, flashSaleEndsIn: 28800,
    tags: ["ขายดี"], isBestSeller: true,
    description: "น้ำผึ้งแท้ 100% จากป่าธรรมชาติ",
    weight: "350 มล.", type: "น้ำผึ้ง", sku: "MH-HON-001", format: "ขวด",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 30,
    reviews: [
      { user: "สมชาย", rating: 5, date: "12 มี.ค. 2569 - 10:20 น.", tags: ["สินค้าดี ✓"], comment: "น้ำผึ้งแท้ หวานกลมกล่อม กลิ่นหอมดอกไม้ป่า", images: [] },
      { user: "user09", rating: 4, date: "10 มี.ค. 2569 - 15:30 น.", tags: ["คุ้มค่า ✓"], comment: "คุณภาพดี เนื้อข้นหนืด ไม่เจือปน แต่ขวดอาจจะเล็กไปนิด", images: [] },
      { user: "มาลี", rating: 5, date: "8 มี.ค. 2569 - 09:00 น.", tags: ["ส่งเร็ว ✓"], comment: "ผสมน้ำอุ่นดื่มทุกเช้า สุขภาพดีขึ้นเยอะ", images: [] },
      { user: "user15", rating: 5, date: "5 มี.ค. 2569 - 11:45 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "น้ำผึ้งป่าแท้ๆ รสชาติต่างจากน้ำผึ้งทั่วไปมาก", images: [] },
    ],
  },
  {
    id: "4", name: "ขมิ้นชันแคปซูล", price: 185, originalPrice: 260, discountPercent: 29, rating: 4.6, sold: "ขายได้ 210+",
    image: "", category: "สมุนไพร", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ขายดี"], isBestSeller: true,
    description: "ขมิ้นชันสกัดเข้มข้น บำรุงกระเพาะ ลดอักเสบ",
    weight: "60 แคปซูล", type: "อาหารเสริม", sku: "MH-TUR-001", format: "แคปซูล",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 80,
    reviews: [
      { user: "วิทยา", rating: 5, date: "14 มี.ค. 2569 - 08:30 น.", tags: ["สินค้าดี ✓"], comment: "กินมาสองเดือน กระเพาะดีขึ้นมาก ไม่มีผลข้างเคียง", images: [] },
      { user: "user11", rating: 4, date: "11 มี.ค. 2569 - 13:20 น.", tags: ["คุ้มค่า ✓"], comment: "แคปซูลเล็กกลืนง่าย สมุนไพรแท้ เห็นผลจริง", images: [] },
      { user: "สุภา", rating: 5, date: "9 มี.ค. 2569 - 16:00 น.", tags: ["แนะนำ ✓"], comment: "ซื้อให้คุณแม่ทาน ท่านชอบมากค่ะ ช่วยลดอาการท้องอืด", images: [] },
      { user: "user20", rating: 4, date: "7 มี.ค. 2569 - 10:15 น.", tags: ["ส่งเร็ว ✓"], comment: "คุณภาพดี ราคาไม่แพง ส่งมาเร็วด้วย", images: [] },
      { user: "ธนา", rating: 3, date: "4 มี.ค. 2569 - 14:50 น.", tags: ["ปกติ"], comment: "ยังไม่เห็นผลชัดเจน อาจต้องกินต่อเนื่องนานกว่านี้", images: [] },
    ],
  },
  {
    id: "5", name: "น้ำมันมะพร้าวสกัดเย็น", price: 159, originalPrice: 265, discountPercent: 40, rating: 4.7, sold: "ขายได้ 95+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 14400, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "น้ำมันมะพร้าวสกัดเย็นบริสุทธิ์ ใช้ทำอาหารและบำรุงผิว",
    weight: "500 มล.", type: "น้ำมัน", sku: "MH-COCO-001", format: "ขวด",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 25,
    reviews: [
      { user: "พิมพ์", rating: 5, date: "13 มี.ค. 2569 - 11:00 น.", tags: ["สินค้าดี ✓"], comment: "น้ำมันมะพร้าวสกัดเย็นแท้ๆ กลิ่นหอม ใช้ทำอาหารอร่อยมาก", images: [] },
      { user: "user13", rating: 5, date: "10 มี.ค. 2569 - 17:30 น.", tags: ["คุ้มค่า ✓"], comment: "ใช้บำรุงผิวได้ดีมาก ผิวชุ่มชื้นตลอดวัน", images: [] },
      { user: "ณัฐ", rating: 4, date: "8 มี.ค. 2569 - 09:45 น.", tags: ["ส่งเร็ว ✓"], comment: "คุณภาพดี ขวดแน่นหนา ไม่รั่วซึม", images: [] },
    ],
  },
  {
    id: "6", name: "ฟ้าทะลายโจรสกัด", price: 120, rating: 4.6, sold: "ขายได้ 350+",
    image: "", category: "สมุนไพร", isRecommended: true, hasCoupon: false,
    tags: ["ขายดี", "แนะนำ"], isBestSeller: true,
    description: "ฟ้าทะลายโจรสกัดเข้มข้น เสริมภูมิคุ้มกัน",
    weight: "30 แคปซูล", type: "อาหารเสริม", sku: "MH-FAH-001", format: "แคปซูล",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 100,
    reviews: [
      { user: "อรุณ", rating: 5, date: "15 มี.ค. 2569 - 08:00 น.", tags: ["สินค้าดี ✓"], comment: "กินตอนเริ่มมีอาการหวัด หายเร็วมากครับ สมุนไพรดีจริง", images: [] },
      { user: "user08", rating: 5, date: "13 มี.ค. 2569 - 14:30 น.", tags: ["แนะนำ ✓"], comment: "เสริมภูมิคุ้มกัน กินทุกวัน ไม่ค่อยป่วย", images: [] },
      { user: "จิรา", rating: 4, date: "11 มี.ค. 2569 - 10:15 น.", tags: ["คุ้มค่า ✓"], comment: "ราคาถูกกว่ายี่ห้ออื่น คุณภาพเทียบเท่ากัน", images: [] },
      { user: "user22", rating: 4, date: "9 มี.ค. 2569 - 16:45 น.", tags: ["ส่งเร็ว ✓"], comment: "ส่งเร็วมาก แพ็คดี แคปซูลไม่แตก", images: [] },
      { user: "กานต์", rating: 3, date: "6 มี.ค. 2569 - 12:00 น.", tags: ["ปกติ"], comment: "รสขมนิดหน่อย แต่เข้าใจว่าเป็นสมุนไพรแท้", images: [] },
    ],
  },
  {
    id: "7", name: "แยมมัลเบอร์รี่", price: 99, originalPrice: 140, discountPercent: 29, rating: 4.6, sold: "ขายได้ 180+",
    image: "", category: "อาหาร", hasCoupon: true,
    tags: ["ใหม่"], isNew: true,
    description: "แยมมัลเบอร์รี่ออร์แกนิก หวานธรรมชาติ ไม่ใส่น้ำตาล",
    weight: "200 กรัม", type: "แยม", sku: "MH-JAM-001", format: "ขวดแก้ว",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 60,
    reviews: [
      { user: "นิดา", rating: 5, date: "14 มี.ค. 2569 - 09:30 น.", tags: ["สินค้าดี ✓"], comment: "แยมอร่อยมาก หวานธรรมชาติ ทาขนมปังก็ดี ผสมโยเกิร์ตก็เยี่ยม", images: [] },
      { user: "user16", rating: 4, date: "12 มี.ค. 2569 - 15:00 น.", tags: ["คุ้มค่า ✓"], comment: "รสชาติเข้มข้น ไม่ใส่น้ำตาลจริงๆ สุขภาพดี", images: [] },
      { user: "ปรีชา", rating: 5, date: "10 มี.ค. 2569 - 11:20 น.", tags: ["แนะนำ ✓"], comment: "ลูกๆ ชอบมาก ทานกับแพนเค้กทุกเช้า", images: [] },
    ],
  },
  {
    id: "8", name: "ซอสพริกสมุนไพร", price: 89, originalPrice: 120, discountPercent: 26, rating: 4.4, sold: "ขายได้ 90+",
    image: "", category: "อาหาร", hasCoupon: false,
    tags: ["ใหม่", "ส่งฟรี"], isNew: true, isFreeShipping: true,
    description: "ซอสพริกสูตรโบราณ ผสมสมุนไพร 7 ชนิด",
    weight: "250 มล.", type: "ซอส", sku: "MH-SAU-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 45,
    reviews: [
      { user: "ธิดา", rating: 5, date: "15 มี.ค. 2569 - 12:30 น.", tags: ["สินค้าดี ✓"], comment: "ซอสพริกหอมมาก สมุนไพรเยอะ ใส่อะไรก็อร่อย", images: [] },
      { user: "user10", rating: 4, date: "13 มี.ค. 2569 - 16:00 น.", tags: ["คุ้มค่า ✓"], comment: "เผ็ดกำลังดี กินกับข้าวสวยร้อนๆ ฟินมาก", images: [] },
      { user: "วรรณ", rating: 3, date: "10 มี.ค. 2569 - 08:45 น.", tags: ["ปกติ"], comment: "อร่อยแต่เผ็ดไปนิดสำหรับคนไม่กินเผ็ด", images: [] },
      { user: "user19", rating: 5, date: "8 มี.ค. 2569 - 13:20 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "สูตรโบราณจริงๆ กลิ่นสมุนไพรชัด ต่างจากซอสพริกทั่วไป", images: [] },
    ],
  },
  {
    id: "9", name: "ครีมบำรุงว่านหางจระเข้", price: 280, originalPrice: 420, discountPercent: 33, rating: 4.9, sold: "ขายได้ 80+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 7200, hasCoupon: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "ครีมบำรุงผิวจากว่านหางจระเข้สด เข้มข้น 92%",
    weight: "50 มล.", type: "ครีม", sku: "MH-CRM-001", format: "หลอด",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 35,
    reviews: [
      { user: "พลอย", rating: 5, date: "16 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "ครีมเนื้อเนียนมาก ซึมเร็ว ผิวชุ่มชื้นทั้งวัน", images: [] },
      { user: "user14", rating: 5, date: "14 มี.ค. 2569 - 15:30 น.", tags: ["แนะนำ ✓"], comment: "ใช้มาสองอาทิตย์ สิวยุบไปเยอะ ผิวเนียนขึ้น", images: [] },
      { user: "กมล", rating: 4, date: "12 มี.ค. 2569 - 09:15 น.", tags: ["ส่งเร็ว ✓"], comment: "กลิ่นหอมอ่อนๆ ไม่ระคายเคืองผิว ชอบมาก", images: [] },
      { user: "user24", rating: 5, date: "10 มี.ค. 2569 - 14:00 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ว่านหางจระเข้เข้มข้นจริง ผิวแพ้ง่ายก็ใช้ได้", images: [] },
    ],
  },
  {
    id: "10", name: "น้ำมันมะกอกออร์แกนิก", price: 299, originalPrice: 450, discountPercent: 34, rating: 4.9, sold: "ขายได้ 75+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 36000, hasCoupon: false,
    tags: ["ขายดี", "ส่งฟรี"], isBestSeller: true, isFreeShipping: true,
    description: "น้ำมันมะกอกบริสุทธิ์ Extra Virgin นำเข้าจากอิตาลี",
    weight: "500 มล.", type: "น้ำมัน", sku: "MH-OIL-001", format: "ขวด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 20,
    reviews: [
      { user: "เชฟนุ่น", rating: 5, date: "15 มี.ค. 2569 - 10:30 น.", tags: ["สินค้าดี ✓"], comment: "น้ำมันมะกอก Extra Virgin คุณภาพดีมาก กลิ่นหอม ใช้ทำสลัดเยี่ยม", images: [] },
      { user: "user17", rating: 5, date: "13 มี.ค. 2569 - 14:00 น.", tags: ["แนะนำ ✓"], comment: "นำเข้าจากอิตาลีจริงๆ รสชาติต่างจากที่ขายตามห้างมาก", images: [] },
      { user: "ธนพล", rating: 4, date: "11 มี.ค. 2569 - 08:20 น.", tags: ["คุ้มค่า ✓"], comment: "ราคาน่าจะแพงไปนิด แต่คุณภาพคุ้มค่า", images: [] },
      { user: "user21", rating: 5, date: "9 มี.ค. 2569 - 16:45 น.", tags: ["ส่งเร็ว ✓"], comment: "แพ็คดีมาก ขวดไม่แตก ส่งเร็ว สินค้าดีมาก", images: [] },
    ],
  },
  {
    id: "11", name: "กาแฟดริปดอยช้าง", price: 249, rating: 4.8, sold: "ขายได้ 200+",
    image: "", category: "เครื่องดื่ม", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ขายดี"], isBestSeller: true,
    description: "กาแฟดริปคั่วกลาง จากดอยช้าง เชียงราย กลิ่นหอมช็อกโกแลต",
    weight: "200 กรัม", type: "กาแฟ", sku: "MH-COF-002", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 55,
    reviews: [
      { user: "อนันต์", rating: 5, date: "16 มี.ค. 2569 - 07:00 น.", tags: ["สินค้าดี ✓"], comment: "กลิ่นช็อกโกแลตชัดมาก ดริปง่าย รสชาตินุ่มลึก", images: [] },
      { user: "user23", rating: 5, date: "14 มี.ค. 2569 - 09:30 น.", tags: ["แนะนำ ✓"], comment: "กาแฟดอยช้างแท้ๆ คั่วสดใหม่ หอมมาก", images: [] },
      { user: "ศิริ", rating: 4, date: "12 มี.ค. 2569 - 15:00 น.", tags: ["คุ้มค่า ✓"], comment: "ชอบกลิ่นหอมๆ ดื่มทุกเช้า ไม่เบื่อเลย", images: [] },
      { user: "user26", rating: 5, date: "10 มี.ค. 2569 - 11:20 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "เทียบกับร้านกาแฟดังๆ ไม่แพ้กันเลย ราคาถูกกว่าเยอะ", images: [] },
    ],
  },
  {
    id: "12", name: "มะขามป้อมอบแห้ง", price: 75, originalPrice: 110, discountPercent: 32, rating: 4.9, sold: "ขายได้ 420+",
    image: "", category: "อาหาร", isFlashSale: true, flashSaleEndsIn: 21600, hasCoupon: true,
    tags: ["ขายดี", "ใหม่"], isBestSeller: true, isNew: true,
    description: "มะขามป้อมอบแห้ง อุดมวิตามินซี รสชาติกลมกล่อม",
    weight: "150 กรัม", type: "ขนม", sku: "MH-AMB-001", format: "ซองซิป",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 90,
    reviews: [
      { user: "วรา", rating: 5, date: "15 มี.ค. 2569 - 14:00 น.", tags: ["สินค้าดี ✓"], comment: "เปรี้ยวหวานกลมกล่อม อุดมวิตามินซี ทานแล้วสดชื่น", images: [] },
      { user: "user27", rating: 5, date: "13 มี.ค. 2569 - 10:30 น.", tags: ["คุ้มค่า ✓"], comment: "ทานง่าย เด็กๆ ก็ชอบ ราคาไม่แพง", images: [] },
      { user: "ปวีณ", rating: 4, date: "11 มี.ค. 2569 - 16:15 น.", tags: ["แนะนำ ✓"], comment: "ซื้อไว้ทานเล่น ดีต่อสุขภาพ อร่อยด้วย", images: [] },
    ],
  },
  {
    id: "13", name: "ชาเขียวมัทฉะ", price: 320, originalPrice: 480, discountPercent: 33, rating: 4.8, sold: "ขายได้ 60+",
    image: "", category: "เครื่องดื่ม", isFlashSale: true, flashSaleEndsIn: 18000, hasCoupon: true,
    tags: ["ขายดี"], isBestSeller: true, isFreeShipping: true,
    description: "มัทฉะเกรดพรีเมียมจากญี่ปุ่น กลิ่นหอมละมุน",
    weight: "100 กรัม", type: "ชา", sku: "MH-MAT-001", format: "ผง",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 40, reviews: [
      { user: "มินท์", rating: 5, date: "16 มี.ค. 2569 - 09:00 น.", tags: ["สินค้าดี ✓"], comment: "มัทฉะเกรดดีจริงๆ สีเขียวสด กลิ่นหอม ชงลาเต้อร่อยมาก", images: [] },
      { user: "user31", rating: 5, date: "14 มี.ค. 2569 - 13:30 น.", tags: ["แนะนำ ✓"], comment: "คุณภาพเทียบเท่ามัทฉะที่ญี่ปุ่นเลย ราคาดีกว่าเยอะ", images: [] },
      { user: "เอก", rating: 4, date: "12 มี.ค. 2569 - 11:00 น.", tags: ["คุ้มค่า ✓"], comment: "ชงร้อนชงเย็นก็อร่อย กลิ่นไม่หืน", images: [] },
      { user: "ภูมิ", rating: 5, date: "8 มี.ค. 2569 - 07:30 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ซื้อมาทำขนมด้วย สีสวย รสชาติเข้มข้น", images: [] },
    ],
  },
  {
    id: "14", name: "น้ำมันงาดำสกัดเย็น", price: 189, originalPrice: 290, discountPercent: 35, rating: 4.5, sold: "ขายได้ 130+",
    image: "", category: "อาหาร", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "น้ำมันงาดำสกัดเย็น 100% บำรุงร่างกาย",
    weight: "250 มล.", type: "น้ำมัน", sku: "MH-SES-001", format: "ขวด",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 35, reviews: [
      { user: "สมหมาย", rating: 5, date: "14 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "น้ำมันงาดำเข้มข้น กลิ่นหอม ผสมน้ำผึ้งทานดีมาก", images: [] },
      { user: "user34", rating: 4, date: "12 มี.ค. 2569 - 14:30 น.", tags: ["คุ้มค่า ✓"], comment: "ทานวันละช้อน สุขภาพดีขึ้นจริง", images: [] },
      { user: "ลัดดา", rating: 5, date: "10 มี.ค. 2569 - 09:15 น.", tags: ["แนะนำ ✓"], comment: "แม่ซื้อมาทาน บอกว่าข้อเข่าดีขึ้น", images: [] },
    ],
  },
  {
    id: "15", name: "สบู่สมุนไพรมะขาม", price: 65, rating: 4.3, sold: "ขายได้ 300+",
    image: "", category: "ความสวย", hasCoupon: false, isNew: true,
    tags: ["ใหม่"], description: "สบู่สมุนไพรมะขาม ผิวนุ่มกระจ่างใส",
    weight: "100 กรัม", type: "สบู่", sku: "MH-SOP-001", format: "ก้อน",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 150, reviews: [
      { user: "ดาว", rating: 5, date: "15 มี.ค. 2569 - 11:30 น.", tags: ["สินค้าดี ✓"], comment: "สบู่ก้อนใหญ่ ฟองเนียน ใช้แล้วผิวนุ่มเนียน กลิ่นมะขามหอมอ่อนๆ", images: [] },
      { user: "user35", rating: 4, date: "13 มี.ค. 2569 - 15:00 น.", tags: ["คุ้มค่า ✓"], comment: "ราคาถูกมากสำหรับสบู่สมุนไพร ใช้ได้นาน", images: [] },
      { user: "จุฑา", rating: 4, date: "11 มี.ค. 2569 - 09:45 น.", tags: ["ส่งเร็ว ✓"], comment: "ผิวกระจ่างใสขึ้นจริง ใช้มาเดือนกว่า", images: [] },
    ],
  },
  {
    id: "16", name: "ยาหม่องสมุนไพร", price: 45, rating: 4.6, sold: "ขายได้ 500+",
    image: "", category: "ยา", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ยาหม่องสูตรโบราณ บรรเทาปวดเมื่อย",
    weight: "30 กรัม", type: "ยาหม่อง", sku: "MH-BLM-001", format: "กระปุก",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 200, reviews: [
      { user: "ลุงสม", rating: 5, date: "16 มี.ค. 2569 - 08:00 น.", tags: ["สินค้าดี ✓"], comment: "ยาหม่องสูตรโบราณ ทาแล้วร้อนซึ้มลึก หายปวดเมื่อยดีมาก", images: [] },
      { user: "user37", rating: 5, date: "14 มี.ค. 2569 - 13:00 น.", tags: ["แนะนำ ✓"], comment: "ซื้อไปฝากแม่ที่ต่างจังหวัด ท่านชอบมาก", images: [] },
      { user: "ประภา", rating: 4, date: "12 มี.ค. 2569 - 17:30 น.", tags: ["คุ้มค่า ✓"], comment: "กลิ่นสมุนไพรหอม ทาก่อนนอนผ่อนคลายดี", images: [] },
      { user: "user38", rating: 5, date: "10 มี.ค. 2569 - 10:45 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ราคาแค่ 45 บาท คุณภาพดีมากๆ คุ้มสุดๆ", images: [] },
    ],
  },
  {
    id: "17", name: "เทียนหอมลาเวนเดอร์", price: 220, originalPrice: 350, discountPercent: 37, rating: 4.7, sold: "ขายได้ 45+",
    image: "", category: "เครื่องหอม", isFlashSale: true, flashSaleEndsIn: 10800, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "เทียนหอมลาเวนเดอร์ธรรมชาติ ผ่อนคลาย",
    weight: "200 กรัม", type: "เทียนหอม", sku: "MH-CND-001", format: "แก้ว",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 30, reviews: [
      { user: "นภา", rating: 5, date: "15 มี.ค. 2569 - 20:00 น.", tags: ["สินค้าดี ✓"], comment: "กลิ่นลาเวนเดอร์หอมมาก จุดก่อนนอนผ่อนคลายสุดๆ", images: [] },
      { user: "user39", rating: 5, date: "13 มี.ค. 2569 - 11:30 น.", tags: ["แนะนำ ✓"], comment: "เทียนสวย กลิ่นหอม ติดทนนาน จุดได้หลายชั่วโมง", images: [] },
      { user: "ธีร์", rating: 4, date: "11 มี.ค. 2569 - 14:15 น.", tags: ["คุ้มค่า ✓"], comment: "ซื้อไว้ตกแต่งห้องด้วย แก้วสวย กลิ่นดี", images: [] },
    ],
  },
  {
    id: "18", name: "ชุดของขวัญสมุนไพร", price: 599, originalPrice: 890, discountPercent: 33, rating: 4.9, sold: "ขายได้ 25+",
    image: "", category: "ชุดของขวัญ", isRecommended: true, hasCoupon: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "ชุดของขวัญสมุนไพรพรีเมียม รวมชา น้ำผึ้ง และเทียนหอม",
    weight: "500 กรัม", type: "ชุดของขวัญ", sku: "MH-GFT-001", format: "กล่อง",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1", "ตัวเลือก 2"], stock: 15, reviews: [
      { user: "วิภา", rating: 5, date: "14 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "ซื้อไปเป็นของขวัญ กล่องสวยหรูมาก ของข้างในคุณภาพดีทุกชิ้น", images: [] },
      { user: "user41", rating: 5, date: "12 มี.ค. 2569 - 15:30 น.", tags: ["แนะนำ ✓"], comment: "คุ้มค่ามากสำหรับราคานี้ ได้ชา น้ำผึ้ง เทียนหอม ครบเซ็ต", images: [] },
      { user: "ชัยวัฒน์", rating: 5, date: "10 มี.ค. 2569 - 09:00 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ให้เป็นของขวัญปีใหม่ คนรับประทับใจมาก", images: [] },
    ],
  },
  {
    id: "19", name: "แชมพูสมุนไพรอัญชัน", price: 179, originalPrice: 250, discountPercent: 28, rating: 4.4, sold: "ขายได้ 170+",
    image: "", category: "ความสวย", hasCoupon: true, isBestSeller: true,
    tags: ["ขายดี", "ส่งฟรี"], isFreeShipping: true,
    description: "แชมพูสมุนไพรอัญชัน ผมดกดำ เงางาม",
    weight: "300 มล.", type: "แชมพู", sku: "MH-SHP-001", format: "ขวด",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 80, reviews: [
      { user: "แพร", rating: 5, date: "16 มี.ค. 2569 - 09:30 น.", tags: ["สินค้าดี ✓"], comment: "ใช้มาเดือนนึง ผมดกดำขึ้นจริง กลิ่นอัญชันหอมสดชื่น", images: [] },
      { user: "user42", rating: 4, date: "14 มี.ค. 2569 - 14:00 น.", tags: ["คุ้มค่า ✓"], comment: "ฟองเยอะ ล้างออกง่าย ผมไม่แห้งกระด้าง", images: [] },
      { user: "ดวงใจ", rating: 4, date: "12 มี.ค. 2569 - 11:30 น.", tags: ["ส่งเร็ว ✓"], comment: "ขวดใหญ่ใช้ได้นาน สมุนไพรแท้ ผมนุ่ม", images: [] },
    ],
  },
  {
    id: "20", name: "น้ำมันยูคาลิปตัส", price: 95, rating: 4.5, sold: "ขายได้ 220+",
    image: "", category: "สมุนไพร", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "น้ำมันยูคาลิปตัสบริสุทธิ์ ใช้สูดดมหรือนวด",
    weight: "30 มล.", type: "น้ำมันหอมระเหย", sku: "MH-EUC-001", format: "ขวดหยด",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 120, reviews: [
      { user: "ณรงค์", rating: 5, date: "15 มี.ค. 2569 - 08:30 น.", tags: ["สินค้าดี ✓"], comment: "หยดใส่น้ำร้อนสูดดม หายคัดจมูกทันที สมุนไพรดีมาก", images: [] },
      { user: "user44", rating: 4, date: "13 มี.ค. 2569 - 13:00 น.", tags: ["คุ้มค่า ✓"], comment: "ใช้ผสมน้ำนวดก็ได้ กลิ่นสดชื่นมาก", images: [] },
      { user: "สุดา", rating: 5, date: "11 มี.ค. 2569 - 10:15 น.", tags: ["แนะนำ ✓"], comment: "ยูคาลิปตัสแท้ กลิ่นแรงดี ใช้ไล่ยุงได้ด้วย", images: [] },
    ],
  },
  {
    id: "21", name: "ผงขมิ้นชันออร์แกนิก", price: 129, originalPrice: 180, discountPercent: 28, rating: 4.6, sold: "ขายได้ 90+",
    image: "", category: "สมุนไพร", hasCoupon: true, isNew: true,
    tags: ["ใหม่", "ส่งฟรี"], isFreeShipping: true,
    description: "ผงขมิ้นชันบดละเอียด ออร์แกนิก 100%",
    weight: "100 กรัม", type: "ผงสมุนไพร", sku: "MH-TUR-002", format: "ซองซิป",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 70, reviews: [
      { user: "ศรี", rating: 5, date: "14 มี.ค. 2569 - 11:00 น.", tags: ["สินค้าดี ✓"], comment: "ผงละเอียดมาก ชงน้ำอุ่นดื่มง่าย บำรุงกระเพาะดี", images: [] },
      { user: "user45", rating: 4, date: "12 มี.ค. 2569 - 15:30 น.", tags: ["คุ้มค่า ✓"], comment: "ออร์แกนิกแท้ สีเหลืองสดสวย ใช้ทำอาหารก็ได้", images: [] },
      { user: "อภิชาติ", rating: 5, date: "10 มี.ค. 2569 - 09:45 น.", tags: ["ส่งเร็ว ✓"], comment: "ผสมน้ำผึ้งดื่มทุกเช้า ท้องไม่อืดแล้ว", images: [] },
    ],
  },
  {
    id: "22", name: "ชาดอกเก๊กฮวย", price: 110, rating: 4.3, sold: "ขายได้ 140+",
    image: "", category: "เครื่องดื่ม", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "ชาดอกเก๊กฮวยอบแห้ง หอมสดชื่น",
    weight: "50 กรัม", type: "ชา", sku: "MH-CHR-001", format: "ซองซิป",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 60, reviews: [
      { user: "ดวง", rating: 5, date: "15 มี.ค. 2569 - 14:30 น.", tags: ["สินค้าดี ✓"], comment: "ชาดอกเก๊กฮวยหอมมาก ดื่มแล้วสดชื่น ช่วยลดร้อนใน", images: [] },
      { user: "user46", rating: 4, date: "13 มี.ค. 2569 - 10:00 น.", tags: ["แนะนำ ✓"], comment: "ดอกใหญ่สวย กลิ่นหอม ชงได้หลายรอบ", images: [] },
      { user: "พงศ์", rating: 4, date: "11 มี.ค. 2569 - 16:15 น.", tags: ["คุ้มค่า ✓"], comment: "ดื่มเย็นก็อร่อย ผสมน้ำผึ้งยิ่งดี", images: [] },
    ],
  },
  {
    id: "23", name: "ลูกประคบสมุนไพร", price: 85, originalPrice: 120, discountPercent: 29, rating: 4.7, sold: "ขายได้ 180+",
    image: "", category: "บริการ", hasCoupon: true, isBestSeller: true,
    tags: ["ขายดี"], description: "ลูกประคบสมุนไพรไทย บรรเทาอาการปวด",
    weight: "200 กรัม", type: "ลูกประคบ", sku: "MH-CMP-001", format: "ถุง",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 100, reviews: [
      { user: "ป้าแอ๊ด", rating: 5, date: "16 มี.ค. 2569 - 08:00 น.", tags: ["สินค้าดี ✓"], comment: "ประคบแล้วหายปวดเลย ร้อนซึ้มดี สมุนไพรหอมมาก", images: [] },
      { user: "user47", rating: 5, date: "14 มี.ค. 2569 - 12:30 น.", tags: ["แนะนำ ✓"], comment: "นึ่งแล้วกลิ่นหอมทั้งห้อง ช่วยผ่อนคลายมาก", images: [] },
      { user: "ชาติ", rating: 4, date: "12 มี.ค. 2569 - 17:00 น.", tags: ["คุ้มค่า ✓"], comment: "ใช้ซ้ำได้หลายรอบ คุ้มค่ามาก", images: [] },
    ],
  },
  {
    id: "24", name: "แคปซูลกระชายดำ", price: 290, originalPrice: 420, discountPercent: 31, rating: 4.8, sold: "ขายได้ 65+",
    image: "", category: "สมุนไพร", isFlashSale: true, flashSaleEndsIn: 25200, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "กระชายดำสกัดเข้มข้น บำรุงสุขภาพ",
    weight: "60 แคปซูล", type: "อาหารเสริม", sku: "MH-KRA-001", format: "แคปซูล",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 45, reviews: [
      { user: "กร", rating: 5, date: "15 มี.ค. 2569 - 09:00 น.", tags: ["สินค้าดี ✓"], comment: "กระชายดำแท้ๆ สกัดเข้มข้น ทานแล้วรู้สึกแข็งแรงขึ้น", images: [] },
      { user: "user49", rating: 5, date: "13 มี.ค. 2569 - 14:30 น.", tags: ["แนะนำ ✓"], comment: "คุณพ่อทานแล้วบอกดีมาก มีแรงขึ้น", images: [] },
      { user: "จันทร์", rating: 4, date: "11 มี.ค. 2569 - 11:15 น.", tags: ["คุ้มค่า ✓"], comment: "แคปซูลกลืนง่าย ไม่มีกลิ่นแปลก", images: [] },
    ],
  },
  {
    id: "25", name: "โลชั่นตะไคร้หอม", price: 145, rating: 4.4, sold: "ขายได้ 110+",
    image: "", category: "ความสวย", hasCoupon: false, isNew: true,
    tags: ["ใหม่"], description: "โลชั่นตะไคร้หอม ป้องกันยุง บำรุงผิว",
    weight: "200 มล.", type: "โลชั่น", sku: "MH-LOT-001", format: "ขวด",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 85, reviews: [
      { user: "ฟ้า", rating: 5, date: "14 มี.ค. 2569 - 10:30 น.", tags: ["สินค้าดี ✓"], comment: "กลิ่นตะไคร้หอมสดชื่น ทาแล้วยุงไม่กัดจริง ผิวชุ่มชื้นด้วย", images: [] },
      { user: "user51", rating: 4, date: "12 มี.ค. 2569 - 15:00 น.", tags: ["คุ้มค่า ✓"], comment: "ใช้ได้ทั้งไล่ยุงและบำรุงผิว คุ้มมาก", images: [] },
      { user: "สมพร", rating: 4, date: "10 มี.ค. 2569 - 09:30 น.", tags: ["ส่งเร็ว ✓"], comment: "กลิ่นหอมธรรมชาติ ไม่ฉุน ถูกใจมาก", images: [] },
    ],
  },
  {
    id: "26", name: "น้ำผึ้งมะนาว", price: 125, originalPrice: 180, discountPercent: 31, rating: 4.6, sold: "ขายได้ 200+",
    image: "", category: "เครื่องดื่ม", hasCoupon: true, isBestSeller: true,
    tags: ["ขายดี", "ส่งฟรี"], isFreeShipping: true,
    description: "น้ำผึ้งมะนาวสดพร้อมดื่ม สดชื่นจากธรรมชาติ",
    weight: "500 มล.", type: "เครื่องดื่ม", sku: "MH-HLM-001", format: "ขวด",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 65, reviews: [
      { user: "น้ำผึ้ง", rating: 5, date: "16 มี.ค. 2569 - 09:00 น.", tags: ["สินค้าดี ✓"], comment: "น้ำผึ้งมะนาวสดชื่นมาก ดื่มแล้วคอโล่ง หวานกลมกล่อม", images: [] },
      { user: "user52", rating: 5, date: "14 มี.ค. 2569 - 13:30 น.", tags: ["แนะนำ ✓"], comment: "ดื่มเย็นๆ วันร้อนๆ ชื่นใจมาก รสชาติธรรมชาติ", images: [] },
      { user: "เก่ง", rating: 4, date: "12 มี.ค. 2569 - 10:15 น.", tags: ["คุ้มค่า ✓"], comment: "ขวดใหญ่ คุ้มราคา ดื่มได้ทั้งครอบครัว", images: [] },
    ],
  },
  {
    id: "27", name: "สเปรย์สมุนไพรดับกลิ่น", price: 79, rating: 4.2, sold: "ขายได้ 250+",
    image: "", category: "เครื่องหอม", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "สเปรย์สมุนไพรดับกลิ่น สูตรธรรมชาติ",
    weight: "100 มล.", type: "สเปรย์", sku: "MH-SPR-001", format: "ขวดสเปรย์",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 130, reviews: [
      { user: "อ้อม", rating: 5, date: "15 มี.ค. 2569 - 11:00 น.", tags: ["สินค้าดี ✓"], comment: "สเปรย์สมุนไพรดับกลิ่นดีมาก ฉีดในห้องน้ำหายกลิ่นทันที", images: [] },
      { user: "user54", rating: 4, date: "13 มี.ค. 2569 - 14:30 น.", tags: ["คุ้มค่า ✓"], comment: "กลิ่นสมุนไพรหอมสะอาด ไม่ฉุนเหมือนยี่ห้ออื่น", images: [] },
      { user: "บุญมี", rating: 4, date: "11 มี.ค. 2569 - 09:15 น.", tags: ["แนะนำ ✓"], comment: "ใช้ในรถก็ได้ กลิ่นหอมสดชื่น ธรรมชาติ", images: [] },
    ],
  },
  {
    id: "28", name: "เจลว่านหางจระเข้", price: 159, originalPrice: 230, discountPercent: 31, rating: 4.7, sold: "ขายได้ 95+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 14400, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "เจลว่านหางจระเข้เข้มข้น 99% บำรุงผิว",
    weight: "250 มล.", type: "เจล", sku: "MH-ALG-001", format: "หลอด",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 55, reviews: [
      { user: "นุช", rating: 5, date: "16 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "เจลว่านหางจระเข้เข้มข้นมาก ทาแล้วผิวชุ่มชื้น ซึมไว", images: [] },
      { user: "user55", rating: 5, date: "14 มี.ค. 2569 - 15:30 น.", tags: ["แนะนำ ✓"], comment: "ใช้หลังโดนแดดดีมาก ผิวไม่ลอก ชุ่มชื้น", images: [] },
      { user: "ต้น", rating: 4, date: "12 มี.ค. 2569 - 09:45 น.", tags: ["คุ้มค่า ✓"], comment: "หลอดใหญ่ ใช้ได้นาน คุณภาพดี", images: [] },
    ],
  },
  {
    id: "29", name: "ชาอู่หลงบนดอย", price: 350, rating: 4.9, sold: "ขายได้ 35+",
    image: "", category: "เครื่องดื่ม", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ขายดี"], isBestSeller: true,
    description: "ชาอู่หลงจากยอดดอย หอมกรุ่น รสนุ่มลึก",
    weight: "75 กรัม", type: "ชา", sku: "MH-OOL-001", format: "ซองซิป",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 20, reviews: [
      { user: "ชาครีย์", rating: 5, date: "15 มี.ค. 2569 - 07:00 น.", tags: ["สินค้าดี ✓"], comment: "ชาอู่หลงจากดอยแท้ๆ หอมกรุ่น รสนุ่มลึก ดื่มแล้วสงบ", images: [] },
      { user: "user57", rating: 5, date: "13 มี.ค. 2569 - 10:30 น.", tags: ["แนะนำ ✓"], comment: "ชาพรีเมียมคุณภาพเยี่ยม ชงได้หลายรอบ", images: [] },
      { user: "มณี", rating: 5, date: "11 มี.ค. 2569 - 15:00 น.", tags: ["คุ้มค่า ✓"], comment: "ราคาคุ้มค่ามากสำหรับชาระดับนี้", images: [] },
    ],
  },
  {
    id: "30", name: "ยาดมสมุนไพร 7 รส", price: 35, rating: 4.5, sold: "ขายได้ 800+",
    image: "", category: "ยา", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ยาดมสมุนไพร 7 ชนิด สดชื่น",
    weight: "5 กรัม", type: "ยาดม", sku: "MH-INH-001", format: "หลอด",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 300, reviews: [
      { user: "ป้อม", rating: 5, date: "16 มี.ค. 2569 - 08:30 น.", tags: ["สินค้าดี ✓"], comment: "ยาดมหอมสดชื่นมาก มี 7 กลิ่น สูดแล้วโล่ง", images: [] },
      { user: "user59", rating: 5, date: "14 มี.ค. 2569 - 12:00 น.", tags: ["คุ้มค่า ✓"], comment: "35 บาท คุ้มสุดๆ พกพาสะดวก", images: [] },
      { user: "ขวัญ", rating: 4, date: "12 มี.ค. 2569 - 16:30 น.", tags: ["แนะนำ ✓"], comment: "ซื้อไปแจกเพื่อนที่ทำงาน ทุกคนชอบ", images: [] },
      { user: "สันติ", rating: 4, date: "8 มี.ค. 2569 - 13:45 น.", tags: ["ส่งเร็ว ✓"], comment: "พกติดกระเป๋าตลอด สูดเวลาง่วงดีมาก", images: [] },
    ],
  },
  {
    id: "31", name: "ครีมทามือสมุนไพร", price: 139, originalPrice: 199, discountPercent: 30, rating: 4.4, sold: "ขายได้ 85+",
    image: "", category: "ความสวย", hasCoupon: true, isNew: true,
    tags: ["ใหม่", "ส่งฟรี"], isFreeShipping: true,
    description: "ครีมทามือสูตรสมุนไพรไทย บำรุงมือนุ่ม",
    weight: "50 กรัม", type: "ครีม", sku: "MH-HCR-001", format: "หลอด",
    shopName: "METAHERB Store", options: ["ตัวเลือก 1"], stock: 70, reviews: [
      { user: "แอน", rating: 5, date: "15 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "ครีมทามือเนื้อบางเบา ไม่เหนียว ซึมเร็ว มือนุ่มทั้งวัน", images: [] },
      { user: "user61", rating: 4, date: "13 มี.ค. 2569 - 14:30 น.", tags: ["คุ้มค่า ✓"], comment: "กลิ่นสมุนไพรหอมอ่อนๆ ทามือแล้วชุ่มชื้น", images: [] },
      { user: "ดารา", rating: 5, date: "11 มี.ค. 2569 - 09:30 น.", tags: ["แนะนำ ✓"], comment: "หลอดเล็กพกพาง่าย ทาแล้วมือไม่แห้ง", images: [] },
    ],
  },
  {
    id: "32", name: "ถั่วรวมสมุนไพร", price: 89, rating: 4.3, sold: "ขายได้ 160+",
    image: "", category: "อาหาร", hasCoupon: false, isRecommended: true,
    tags: ["แนะนำ"], description: "ถั่วรวม 5 ชนิดปรุงรสสมุนไพร อร่อยมีประโยชน์",
    weight: "200 กรัม", type: "ขนม", sku: "MH-NUT-001", format: "ซองซิป",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 95, reviews: [
      { user: "ดำรง", rating: 5, date: "15 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "ถั่วรวมอร่อยมาก เครื่องเทศสมุนไพรลงตัว ทานเพลิน", images: [] },
      { user: "user62", rating: 4, date: "13 มี.ค. 2569 - 14:00 น.", tags: ["คุ้มค่า ✓"], comment: "ของว่างเพื่อสุขภาพ อร่อยและมีประโยชน์", images: [] },
      { user: "สุมาลี", rating: 4, date: "11 มี.ค. 2569 - 09:30 น.", tags: ["ส่งเร็ว ✓"], comment: "ซองซิปปิดสนิท ถั่วกรอบ รสชาติดี", images: [] },
    ],
  },
  {
    id: "33", name: "น้ำมันหอมระเหยส้ม", price: 175, originalPrice: 260, discountPercent: 33, rating: 4.6, sold: "ขายได้ 70+",
    image: "", category: "เครื่องหอม", hasCoupon: true, isFlashSale: true, flashSaleEndsIn: 32400,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "น้ำมันหอมระเหยส้ม สกัดเย็น กลิ่นสดชื่น",
    weight: "15 มล.", type: "น้ำมันหอมระเหย", sku: "MH-ORG-002", format: "ขวดหยด",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 50, reviews: [
      { user: "เพ็ญ", rating: 5, date: "14 มี.ค. 2569 - 11:00 น.", tags: ["สินค้าดี ✓"], comment: "กลิ่นส้มหอมสดชื่นมาก หยดในเครื่องพ่นหอมทั้งห้อง", images: [] },
      { user: "user63", rating: 4, date: "12 มี.ค. 2569 - 15:30 น.", tags: ["แนะนำ ✓"], comment: "น้ำมันสกัดเย็นคุณภาพดี ใช้ได้หลายแบบ", images: [] },
      { user: "วัฒน์", rating: 5, date: "10 มี.ค. 2569 - 09:00 น.", tags: ["คุ้มค่า ✓"], comment: "ขวดเล็กแต่ใช้ได้นาน กลิ่นเข้มข้น", images: [] },
    ],
  },
  {
    id: "34", name: "ข้าวกล้องงอก", price: 69, rating: 4.5, sold: "ขายได้ 340+",
    image: "", category: "อาหาร", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ข้าวกล้องงอก GABA สูง บำรุงสมอง",
    weight: "1 กก.", type: "ข้าว", sku: "MH-RIC-001", format: "ถุง",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 110, reviews: [
      { user: "ยาย", rating: 5, date: "16 มี.ค. 2569 - 08:00 น.", tags: ["สินค้าดี ✓"], comment: "ข้าวกล้องงอกหุงแล้วนุ่ม อร่อย มีประโยชน์", images: [] },
      { user: "user64", rating: 4, date: "14 มี.ค. 2569 - 12:00 น.", tags: ["คุ้มค่า ✓"], comment: "ทานแทนข้าวขาว สุขภาพดีขึ้น", images: [] },
      { user: "ทวี", rating: 5, date: "12 มี.ค. 2569 - 10:30 น.", tags: ["แนะนำ ✓"], comment: "GABA สูงจริง ทานแล้วนอนหลับดีขึ้น", images: [] },
    ],
  },
  {
    id: "35", name: "ชุดสปาสมุนไพร", price: 450, originalPrice: 650, discountPercent: 31, rating: 4.8, sold: "ขายได้ 20+",
    image: "", category: "ชุดของขวัญ", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: true,
    description: "ชุดสปาสมุนไพรครบเซ็ต สครับ ลูกประคบ น้ำมันนวด",
    weight: "800 กรัม", type: "ชุดของขวัญ", sku: "MH-SPA-001", format: "กล่อง",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 12, reviews: [
      { user: "ปิยะ", rating: 5, date: "15 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "ชุดสปาครบเซ็ต ของดีทุกชิ้น ใช้แล้วผ่อนคลายเหมือนไปสปา", images: [] },
      { user: "user65", rating: 5, date: "13 มี.ค. 2569 - 14:30 น.", tags: ["แนะนำ ✓"], comment: "ซื้อเป็นของขวัญวันเกิดให้เพื่อน เพื่อนชอบมาก", images: [] },
      { user: "สุนีย์", rating: 4, date: "11 มี.ค. 2569 - 09:15 น.", tags: ["คุ้มค่า ✓"], comment: "คุ้มค่ามาก ได้ทั้งสครับ ลูกประคบ น้ำมันนวด", images: [] },
    ],
  },
  {
    id: "36", name: "น้ำมะตูมพร้อมดื่ม", price: 55, rating: 4.2, sold: "ขายได้ 190+",
    image: "", category: "เครื่องดื่ม", hasCoupon: false, isNew: true,
    tags: ["ใหม่"], description: "น้ำมะตูมเข้มข้น หวานธรรมชาติ ดีต่อท้อง",
    weight: "300 มล.", type: "เครื่องดื่ม", sku: "MH-BAL-001", format: "ขวด",
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 75, reviews: [
      { user: "โอ๋", rating: 5, date: "14 มี.ค. 2569 - 11:30 น.", tags: ["สินค้าดี ✓"], comment: "น้ำมะตูมเข้มข้นมาก หวานธรรมชาติ ดีต่อท้อง", images: [] },
      { user: "user66", rating: 4, date: "12 มี.ค. 2569 - 15:00 น.", tags: ["คุ้มค่า ✓"], comment: "ดื่มเย็นๆ ชื่นใจ รสชาติดี", images: [] },
      { user: "มะลิ", rating: 4, date: "10 มี.ค. 2569 - 09:45 น.", tags: ["ส่งเร็ว ✓"], comment: "ท้องไม่สบาย ดื่มแล้วดีขึ้น", images: [] },
    ],
  },
  {
    id: "37", name: "สครับผิวกาแฟ", price: 199, originalPrice: 290, discountPercent: 31, rating: 4.7, sold: "ขายได้ 55+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 9000, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "สครับผิวจากเมล็ดกาแฟ ขจัดเซลล์ผิวเก่า",
    weight: "200 กรัม", type: "สครับ", sku: "MH-SCR-001", format: "กระปุก",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 40, reviews: [
      { user: "บี", rating: 5, date: "16 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "สครับกาแฟเนื้อละเอียด ขัดแล้วผิวเนียนลื่น กลิ่นหอมมาก", images: [] },
      { user: "user67", rating: 5, date: "14 มี.ค. 2569 - 15:30 น.", tags: ["แนะนำ ✓"], comment: "ใช้สัปดาห์ละ 2 ครั้ง ผิวสว่างขึ้นชัด", images: [] },
      { user: "เจน", rating: 4, date: "12 มี.ค. 2569 - 09:00 น.", tags: ["คุ้มค่า ✓"], comment: "กระปุกใหญ่ใช้ได้นาน กลิ่นกาแฟติดผิว", images: [] },
    ],
  },
  {
    id: "38", name: "มะรุมผง", price: 115, rating: 4.4, sold: "ขายได้ 120+",
    image: "", category: "สมุนไพร", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ"], description: "มะรุมผงอบแห้ง อุดมสารอาหาร ซุปเปอร์ฟู้ด",
    weight: "100 กรัม", type: "ผงสมุนไพร", sku: "MH-MOR-001", format: "ซองซิป",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 65, reviews: [
      { user: "กุล", rating: 5, date: "15 มี.ค. 2569 - 08:30 น.", tags: ["สินค้าดี ✓"], comment: "มะรุมผงคุณภาพดี ผสมน้ำผลไม้ดื่มง่าย อุดมสารอาหาร", images: [] },
      { user: "user68", rating: 4, date: "13 มี.ค. 2569 - 13:00 น.", tags: ["คุ้มค่า ✓"], comment: "ซุปเปอร์ฟู้ดแท้ๆ ทานง่าย ดีต่อสุขภาพ", images: [] },
      { user: "พรรณ", rating: 4, date: "11 มี.ค. 2569 - 10:30 น.", tags: ["ส่งเร็ว ✓"], comment: "ผงละเอียด ชงได้ง่าย กลิ่นไม่แรง", images: [] },
    ],
  },
  {
    id: "39", name: "ธูปหอมสมุนไพร", price: 49, rating: 4.3, sold: "ขายได้ 280+",
    image: "", category: "เครื่องหอม", hasCoupon: false, isBestSeller: true,
    tags: ["ขายดี"], description: "ธูปหอมสมุนไพรไทย กลิ่นหอมสะอาด",
    weight: "20 ก้าน", type: "ธูปหอม", sku: "MH-INC-001", format: "กล่อง",
    shopName: "ธรรมชาติพรีเมียม", options: ["ตัวเลือก 1"], stock: 180, reviews: [
      { user: "ชาลี", rating: 5, date: "14 มี.ค. 2569 - 11:00 น.", tags: ["สินค้าดี ✓"], comment: "ธูปหอมกลิ่นสะอาด ไม่ฉุน จุดแล้วห้องหอมนานมาก", images: [] },
      { user: "user69", rating: 4, date: "12 มี.ค. 2569 - 15:30 น.", tags: ["คุ้มค่า ✓"], comment: "ได้ 20 ก้าน ราคาถูก คุณภาพดี", images: [] },
      { user: "มนัส", rating: 5, date: "10 มี.ค. 2569 - 09:00 น.", tags: ["แนะนำ ✓"], comment: "จุดทำสมาธิดีมาก กลิ่นสมุนไพรหอมผ่อนคลาย", images: [] },
    ],
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
    shopName: "สมุนไพรบ้านสวน", options: ["ตัวเลือก 1"], stock: 90, reviews: [
      { user: "ประเสริฐ", rating: 5, date: "15 มี.ค. 2569 - 10:00 น.", tags: ["สินค้าดี ✓"], comment: "พริกไทยดำเม็ดใหญ่ กลิ่นหอมจัด เผ็ดร้อนดี ใส่อาหารอร่อย", images: [] },
      { user: "user70", rating: 4, date: "13 มี.ค. 2569 - 14:30 น.", tags: ["คุ้มค่า ✓"], comment: "คุณภาพดีกว่าที่ขายตามห้าง กลิ่นหอมกว่าเยอะ", images: [] },
      { user: "ศศิ", rating: 5, date: "11 มี.ค. 2569 - 09:15 น.", tags: ["แนะนำ ✓"], comment: "บดสดใส่สเต็กหอมมาก พรีเมียมจริงๆ", images: [] },
    ],
  },
  {
    id: "42", name: "เซรั่มวิตามินซีส้มยูซุ", price: 359, originalPrice: 520, discountPercent: 31, rating: 4.9, sold: "ขายได้ 40+",
    image: "", category: "ความสวย", isFlashSale: true, flashSaleEndsIn: 16200, hasCoupon: true,
    tags: ["ส่งฟรี"], isFreeShipping: true,
    description: "เซรั่มวิตามินซีจากส้มยูซุ ผิวกระจ่างใส",
    weight: "30 มล.", type: "เซรั่ม", sku: "MH-SRM-001", format: "ขวดหยด",
    shopName: "ร้านป่าหมอก", options: ["ตัวเลือก 1"], stock: 25, reviews: [
      { user: "ปุ้ย", rating: 5, date: "16 มี.ค. 2569 - 09:30 น.", tags: ["สินค้าดี ✓"], comment: "เซรั่มซึมเร็วมาก ผิวกระจ่างใสขึ้นภายในสัปดาห์เดียว", images: [] },
      { user: "user71", rating: 5, date: "14 มี.ค. 2569 - 13:00 น.", tags: ["แนะนำ ✓"], comment: "ส้มยูซุหอมมาก ไม่ระคายเคืองผิว ใช้ได้ทุกวัน", images: [] },
      { user: "เบล", rating: 4, date: "12 มี.ค. 2569 - 10:30 น.", tags: ["คุ้มค่า ✓"], comment: "ขวดเล็กแต่ใช้ได้นาน เพราะใช้แค่ 2-3 หยด", images: [] },
      { user: "user72", rating: 5, date: "10 มี.ค. 2569 - 15:00 น.", tags: ["สินค้าดี ส่งเร็ว ✓"], comment: "ดีกว่าเซรั่มแบรนด์ดังที่แพงกว่าหลายเท่า", images: [] },
    ],
  },
  {
    id: "43", name: "บริการนวดสมุนไพร 60 นาที", price: 499, rating: 4.8, sold: "จอง 30+",
    image: "", category: "บริการ", hasCoupon: true, isRecommended: true,
    tags: ["แนะนำ", "ส่งฟรี"], isFreeShipping: false,
    description: "บริการนวดสมุนไพรไทยแท้ ผ่อนคลายทั้งตัว 60 นาที",
    weight: "-", type: "บริการ", sku: "MH-SVC-001", format: "บริการ",
    shopName: "Organic Thai Farm", options: ["ตัวเลือก 1"], stock: 10, reviews: [
      { user: "ไอซ์", rating: 5, date: "15 มี.ค. 2569 - 14:00 น.", tags: ["สินค้าดี ✓"], comment: "นวดสมุนไพรเยี่ยมมาก ผ่อนคลายทั้งตัว หมอนวดเก่งมาก", images: [] },
      { user: "user73", rating: 5, date: "13 มี.ค. 2569 - 10:30 น.", tags: ["แนะนำ ✓"], comment: "คุ้มค่ามากสำหรับ 60 นาที สมุนไพรหอมทั้งตัว", images: [] },
      { user: "พี่ตุ๊ก", rating: 4, date: "11 มี.ค. 2569 - 16:00 น.", tags: ["คุ้มค่า ✓"], comment: "บริการดี สถานที่สะอาด สมุนไพรแท้", images: [] },
    ],
  },
];