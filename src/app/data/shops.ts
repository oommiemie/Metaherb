export interface ShopReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  reported: boolean;
  hidden: boolean;
}

export interface Shop {
  id: string;
  name: string;
  avatar: string;
  banner: string;
  description: string;
  rating: number;
  totalReviews: number;
  followers: number;
  joined: string;
  responseRate: number;
  responseTime: string;
  totalProducts: number;
  totalSold: string;
  location: string;
  verified: boolean;
  reviews: ShopReview[];
}

export const shops: Shop[] = [
  {
    id: "metaherb",
    name: "METAHERB Store",
    avatar: "🌿",
    banner: "https://images.unsplash.com/photo-1765809255360-6ed6240bd10f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    description: "ร้านค้าสมุนไพรออร์แกนิกคุณภาพระดับพรีเมียม คัดสรรวัตถุดิบจากแหล่งธรรมชาติทั่วประเทศไทย ผ่านมาตรฐาน อย. และ GMP รับประกันคุณภาพทุกชิ้น จัดส่งรวดเร็วภายใน 1-2 วัน",
    rating: 4.8,
    totalReviews: 1250,
    followers: 8520,
    joined: "มกราคม 2567",
    responseRate: 98,
    responseTime: "ภายใน 5 นาที",
    totalProducts: 45,
    totalSold: "15,000+",
    location: "กรุงเทพมหานคร",
    verified: true,
    reviews: [
      { id: "sr1", userId: "u1", userName: "user01", rating: 5, comment: "ร้านดีมากค่ะ สินค้าคุณภาพ ส่งเร็ว แพ็คดี", date: "15 มี.ค. 2569", helpful: 24, reported: false, hidden: false },
      { id: "sr2", userId: "u2", userName: "สมชาย", rating: 5, comment: "ซื้อประจำเลยครับ สินค้าออร์แกนิกจริง ไม่มีสารเคมี", date: "12 มี.ค. 2569", helpful: 18, reported: false, hidden: false },
      { id: "sr3", userId: "u3", userName: "นุ่น", rating: 4, comment: "สินค้าดี แต่บางครั้งส่งช้าไปหน่อย", date: "10 มี.ค. 2569", helpful: 8, reported: false, hidden: false },
      { id: "sr4", userId: "u4", userName: "วิชัย", rating: 5, comment: "ชาออร์แกนิกหอมมากครับ คุ้มค่าสุดๆ จะสั่งซ้ำแน่นอน", date: "8 มี.ค. 2569", helpful: 15, reported: false, hidden: false },
      { id: "sr5", userId: "u5", userName: "มินนี่", rating: 4, comment: "แพ็คเกจสวย ให้เป็นของขวัญได้เลย ราคาดีด้วย", date: "5 มี.ค. 2569", helpful: 12, reported: false, hidden: false },
    ],
  },
  {
    id: "bansuan",
    name: "สมุนไพรบ้านสวน",
    avatar: "🏡",
    banner: "https://images.unsplash.com/photo-1762920738955-38d51d7a7645?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    description: "สมุนไพรจากสวนบ้านเรา ปลูกด้วยใจ ไร้สารเคมี ส่งตรงจากสวนถึงมือคุณ เน้นผลิตภัณฑ์ธรรมชาติ 100% มีสินค้าหลากหลายตั้งแต่ชาสมุนไพร สบู่ น้ำมันหอม จนถึงเครื่องเทศ",
    rating: 4.6,
    totalReviews: 820,
    followers: 5340,
    joined: "มีนาคม 2567",
    responseRate: 95,
    responseTime: "ภายใน 15 นาที",
    totalProducts: 32,
    totalSold: "9,800+",
    location: "เชียงใหม่",
    verified: true,
    reviews: [
      { id: "sr6", userId: "u1", userName: "user01", rating: 5, comment: "สินค้าสดจากสวนจริงๆ คุณภาพดีมาก", date: "14 มี.ค. 2569", helpful: 10, reported: false, hidden: false },
      { id: "sr7", userId: "u6", userName: "ปิ่น", rating: 4, comment: "ชอบแยมมัลเบอร์รี่มากค่ะ หวานธรรมชาติ", date: "11 มี.ค. 2569", helpful: 7, reported: false, hidden: false },
      { id: "sr8", userId: "u7", userName: "เดวิด", rating: 5, comment: "สบู่สมุนไพรดีมากครับ ผิวนุ่มขึ้นจริง", date: "9 มี.ค. 2569", helpful: 5, reported: false, hidden: false },
    ],
  },
  {
    id: "pahmok",
    name: "ร้านป่าหมอก",
    avatar: "🌫️",
    banner: "https://images.unsplash.com/photo-1759704855345-4d30489674eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    description: "สมุนไพรจากป่าเขาภาคเหนือ คัดสรรสมุนไพรหายากจากป่าดิบ ปลูกบนดอยสูง อากาศเย็นสบาย ผลิตภัณฑ์ทุกชิ้นผ่านการทดสอบคุณภาพ",
    rating: 4.7,
    totalReviews: 640,
    followers: 3980,
    joined: "มิถุนายน 2567",
    responseRate: 90,
    responseTime: "ภายใน 30 นาที",
    totalProducts: 28,
    totalSold: "7,200+",
    location: "เชียงราย",
    verified: true,
    reviews: [
      { id: "sr9", userId: "u1", userName: "user01", rating: 5, comment: "น้ำผึ้งแท้จริงๆ หอมมาก คุ้มค่า", date: "13 มี.ค. 2569", helpful: 14, reported: false, hidden: false },
      { id: "sr10", userId: "u8", userName: "แอน", rating: 4, comment: "ยาหม่องใช้ดีค่ะ สูตรโบราณจริงๆ", date: "7 มี.ค. 2569", helpful: 9, reported: false, hidden: false },
    ],
  },
  {
    id: "organicthai",
    name: "Organic Thai Farm",
    avatar: "🌾",
    banner: "https://images.unsplash.com/photo-1518369623551-510c7b3c9f5d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    description: "ฟาร์มออร์แกนิกไทยแท้ ปลูกพืชสมุนไพรแบบเกษตรอินทรีย์ ได้รับมาตรฐาน Organic Thailand ส่งฟรีทั่วประเทศเมื่อสั่งครบ 500 บาท",
    rating: 4.7,
    totalReviews: 950,
    followers: 6720,
    joined: "กุมภาพันธ์ 2567",
    responseRate: 96,
    responseTime: "ภายใน 10 นาที",
    totalProducts: 35,
    totalSold: "12,500+",
    location: "เชียงราย",
    verified: true,
    reviews: [
      { id: "sr11", userId: "u1", userName: "user01", rating: 5, comment: "ขมิ้นชันคุณภาพดีมากครับ ทานแล้วกระเพาะดีขึ้น", date: "15 มี.ค. 2569", helpful: 20, reported: false, hidden: false },
      { id: "sr12", userId: "u9", userName: "พลอย", rating: 5, comment: "ส่งเร็วมากค่ะ สินค้าแพ็คอย่างดี ชอบมาก", date: "10 มี.ค. 2569", helpful: 11, reported: false, hidden: false },
    ],
  },
  {
    id: "thammachat",
    name: "ธรรมชาติพรีเมียม",
    avatar: "💎",
    banner: "https://images.unsplash.com/photo-1760621393386-3906922b0b78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    description: "สินค้าสมุนไพรระดับพรีเมียม คัดสรรคุณภาพเกรด A เน้นแพ็คเกจสวยงาม เหมาะเป็นของขวัญ ของฝาก มีบริการห่อของขวัญฟรี",
    rating: 4.8,
    totalReviews: 720,
    followers: 4560,
    joined: "เมษายน 2567",
    responseRate: 97,
    responseTime: "ภายใน 8 นาที",
    totalProducts: 30,
    totalSold: "8,900+",
    location: "กรุงเทพมหานคร",
    verified: true,
    reviews: [
      { id: "sr13", userId: "u1", userName: "user01", rating: 5, comment: "ชุดของขวัญสวยมากค่ะ คนรับชอบมาก", date: "14 มี.ค. 2569", helpful: 16, reported: false, hidden: false },
      { id: "sr14", userId: "u10", userName: "ตั้ม", rating: 4, comment: "ยาดมหอมดีครับ พกพาสะดวก", date: "6 มี.ค. 2569", helpful: 6, reported: false, hidden: false },
    ],
  },
];

// Helper to map shopName from products to shopId
export function getShopIdByName(shopName: string): string | undefined {
  return shops.find((s) => s.name === shopName)?.id;
}
