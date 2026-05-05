// Realistic Thai review samples with images.
// Reviews are generated deterministically per productId so the same product always
// shows the same set of reviews (consistent UX across navigations).

export interface SampleReview {
  user: string;
  avatar: string;
  rating: number;
  date: string;
  tags: string[];
  comment: string;
  images: string[];
}

const REVIEWERS: { name: string; avatar: string }[] = [
  { name: "นภัสกร", avatar: "https://i.pravatar.cc/120?img=1" },
  { name: "พี่ตุ๊กตา", avatar: "https://i.pravatar.cc/120?img=5" },
  { name: "คุณแม่ฟ้า", avatar: "https://i.pravatar.cc/120?img=9" },
  { name: "Joy_TH", avatar: "https://i.pravatar.cc/120?img=12" },
  { name: "พิมพ์ใจ", avatar: "https://i.pravatar.cc/120?img=16" },
  { name: "user_2284", avatar: "https://i.pravatar.cc/120?img=19" },
  { name: "น้องอิม", avatar: "https://i.pravatar.cc/120?img=23" },
  { name: "พี่อ้อย", avatar: "https://i.pravatar.cc/120?img=25" },
  { name: "ครูจิ๊บ", avatar: "https://i.pravatar.cc/120?img=32" },
  { name: "แอนชา", avatar: "https://i.pravatar.cc/120?img=36" },
  { name: "siriporn88", avatar: "https://i.pravatar.cc/120?img=44" },
  { name: "พี่หนูดี", avatar: "https://i.pravatar.cc/120?img=47" },
  { name: "user_9981", avatar: "https://i.pravatar.cc/120?img=49" },
  { name: "Apinya", avatar: "https://i.pravatar.cc/120?img=52" },
  { name: "คุณนิต", avatar: "https://i.pravatar.cc/120?img=56" },
  { name: "พี่ไก่", avatar: "https://i.pravatar.cc/120?img=58" },
  { name: "เบลล์", avatar: "https://i.pravatar.cc/120?img=63" },
  { name: "user_3471", avatar: "https://i.pravatar.cc/120?img=65" },
  { name: "หมอน", avatar: "https://i.pravatar.cc/120?img=68" },
  { name: "พลอย ✨", avatar: "https://i.pravatar.cc/120?img=20" },
];

// Each entry: comment + rating + tag template. Mixed lengths + sentiments.
const TEMPLATES: { comment: string; rating: number; tag: string }[] = [
  { comment: "ของดีมากค่ะ บรรจุภัณฑ์เรียบร้อยสวยงาม กลิ่นหอมเป็นธรรมชาติ ใช้แล้วรู้สึกดีกับร่างกาย จะกลับมาซื้อซ้ำแน่นอน 🌿", rating: 5, tag: "สินค้าตรงปก ✓" },
  { comment: "ส่งเร็วมาก สั่งเที่ยงได้รับเช้าเลย แพ็คดีไม่มีบุบ ของแท้ 100% รสชาติเป๊ะ ราคาเกินคุ้ม", rating: 5, tag: "ส่งไว ✓" },
  { comment: "ใช้ครั้งแรก ประทับใจมาก ผลลัพธ์ดีกว่าที่คาดไว้ จะแนะนำให้เพื่อนต่อแน่นอน", rating: 5, tag: "แนะนำเพื่อน ✓" },
  { comment: "คุณภาพดี สมราคา ใช้ได้นาน ไม่ระคายเคือง", rating: 4, tag: "คุ้มค่า ✓" },
  { comment: "สินค้าดีค่ะ แต่อยากให้ปรับปรุงเรื่องบรรจุภัณฑ์อีกนิด ที่ปิดฝาหลวมไปหน่อย", rating: 4, tag: "พอใช้ ✓" },
  { comment: "ลองมาแล้วหลายแบรนด์ ตัวนี้ดีจริง รสชาติกลมกล่อมหอมเป็นธรรมชาติ ไม่ใส่อะไรมาก ปลอดภัย ✨", rating: 5, tag: "ของแท้ ✓" },
  { comment: "ซื้อให้คุณแม่ ท่านชอบมาก บอกว่าหอมและดีต่อสุขภาพ ขอบคุณร้านที่ทำของดีๆแบบนี้นะคะ", rating: 5, tag: "ของฝากดี ✓" },
  { comment: "เพิ่งได้ของวันนี้ค่ะ แกะกล่องมาแพ็คเกจเรียบร้อยมาก ของไม่เสียหาย จะลองใช้ดูนะคะ", rating: 5, tag: "แพ็คดี ✓" },
  { comment: "ราคาดีกว่าร้านอื่นที่เคยซื้อ คุณภาพไม่ต่างกัน เก็บไว้ใช้ได้นานและของจริงค่ะ", rating: 5, tag: "ราคาดี ✓" },
  { comment: "พี่ที่ร้านน่ารักมาก ตอบคำถามไว ส่งของให้เร็ว เพิ่มของแถมมาให้ด้วย น่ารักจริงๆ", rating: 5, tag: "บริการดี ✓" },
  { comment: "สั่งซื้อครั้งที่ 3 แล้วค่ะ คุณภาพคงที่ตลอด ไม่เคยผิดหวัง 😊", rating: 5, tag: "ลูกค้าประจำ ✓" },
  { comment: "ของได้ตามรูปเลย กลิ่นหอมมาก ใช้แล้วรู้สึกผ่อนคลาย จะมาซื้อซ้ำแน่นอน", rating: 5, tag: "สินค้าตรงปก ✓" },
  { comment: "โดยรวมโอเคค่ะ แต่กลิ่นแรงไปนิดสำหรับคนที่ชอบกลิ่นเบาๆ", rating: 4, tag: "พอใช้ได้ ✓" },
  { comment: "พี่ส่งเร็วมาก แถมห่อของขวัญให้ด้วย ประทับใจสุดๆ ขอบคุณนะคะ ❤️", rating: 5, tag: "ส่งไว ✓" },
  { comment: "ของถึงเร็ว สภาพดีมาก กลิ่นเป็นธรรมชาติ ไม่ฉุน รู้สึกผ่อนคลายเวลาใช้", rating: 5, tag: "สดใหม่ ✓" },
  { comment: "ราคาถูกกว่าที่คาดเอาไว้ แต่คุณภาพดีจัง คุ้มมากค่ะ จะรีวิวต่อให้เพื่อนๆด้วย", rating: 5, tag: "คุ้มค่า ✓" },
];

// Curated safe Unsplash photo IDs that fit herbal/food/lifestyle reviews.
const REVIEW_IMAGE_POOL = [
  "photo-1556909114-f6e7ad7d3136",
  "photo-1597236955026-3911e0a234b6",
  "photo-1573821663912-6df460f9c684",
  "photo-1546039907-7fa05f864c02",
  "photo-1597481499750-3e6b22637e12",
  "photo-1559717865-a99cac1c95d8",
  "photo-1611080626919-7cf5a9dbab5b",
  "photo-1505740420928-5e560c06d30e",
  "photo-1481833761820-0509d3217039",
  "photo-1542838132-92c53300491e",
  "photo-1592479996-0c8a1e8c5d4e",
  "photo-1556909114-44e3e70034e2",
];

const DATE_TEMPLATES = [
  "2 วันที่แล้ว",
  "5 วันที่แล้ว",
  "1 สัปดาห์ที่แล้ว",
  "12 มี.ค. 2569 - 14:30 น.",
  "10 มี.ค. 2569 - 09:15 น.",
  "8 มี.ค. 2569 - 16:45 น.",
  "5 มี.ค. 2569 - 11:20 น.",
  "2 มี.ค. 2569 - 19:50 น.",
  "27 ก.พ. 2569 - 13:00 น.",
  "22 ก.พ. 2569 - 10:30 น.",
  "18 ก.พ. 2569 - 15:15 น.",
  "15 ก.พ. 2569 - 08:45 น.",
];

// Simple deterministic hash so same productId yields same reviews.
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function imgUrl(id: string) {
  return `https://images.unsplash.com/${id}?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=70`;
}

export function generateSampleReviews(productId: string, count = 12, optionLabels: string[] = []): SampleReview[] {
  const seed = hash(productId);
  const reviews: SampleReview[] = [];
  for (let i = 0; i < count; i++) {
    const r = (seed + i * 1103515245 + 12345) >>> 0;
    const reviewer = REVIEWERS[(r >>> 3) % REVIEWERS.length];
    const tpl = TEMPLATES[(r >>> 5) % TEMPLATES.length];
    const date = DATE_TEMPLATES[(r >>> 7) % DATE_TEMPLATES.length];
    // 70% of reviews include 1-5 photos, 30% are text-only.
    const hasImages = ((r >>> 11) & 0xff) < 180;
    const imageCount = hasImages ? 1 + ((r >>> 13) % 5) : 0;
    const images: string[] = [];
    for (let j = 0; j < imageCount; j++) {
      const idx = (((r >>> (15 + j)) ^ (i * 7 + j * 13)) >>> 0) % REVIEW_IMAGE_POOL.length;
      images.push(imgUrl(REVIEW_IMAGE_POOL[idx]));
    }
    // Slight rating variation: most are 4-5, occasional 3.
    const ratingJitter = ((r >>> 17) % 10);
    const rating = ratingJitter < 7 ? 5 : ratingJitter < 9 ? 4 : 3;
    const optTag = optionLabels.length ? optionLabels[(r >>> 19) % optionLabels.length] : "";
    reviews.push({
      user: reviewer.name,
      avatar: reviewer.avatar,
      rating: tpl.rating === 5 ? rating : tpl.rating, // trust template if it sets non-5
      date,
      tags: optTag ? [optTag, tpl.tag] : [tpl.tag],
      comment: tpl.comment,
      images,
    });
  }
  return reviews;
}
