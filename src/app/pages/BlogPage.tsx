import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, ChevronDown, Play, Eye } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../store/LanguageContext";
import imgArticle1 from "figma:asset/51e11fdedae888e644826410f8d7038f1bbaf2e6.png";
import imgArticle2 from "figma:asset/ca947bfdf5c8f7c7177ecee869d4bbb6fa74e2e0.png";
import imgArticle3 from "figma:asset/eaf91e3dbd420033f1f9e5d7e3813e02f9603e18.png";
import imgVideo1 from "figma:asset/14107b7d6d71a9a8d6e441ef2a495f92de9863e7.png";
import imgVideo2 from "figma:asset/bb3fb70f833c2d436a3fd0469bfbb0e529216bf4.png";
import imgVideo3 from "figma:asset/686343836a80ce937c02210c662664e79d865faa.png";
import imgVideo4 from "figma:asset/e47b7867b8fbbe44bc111e7bd3bca89b5d7594ef.png";
import imgVideo5 from "figma:asset/efc9e75e31f37f69777ef2a5a8184920a4d4336b.png";
import imgVideo6 from "figma:asset/0ac5833739c6ef2f69f7a15e8873667fece676d0.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const SAFE_IMAGES = [
  "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=600&q=80", // herbal tea
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=600&q=80", // coffee drip
  "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=600&q=80", // honey jar
  "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=600&q=80", // turmeric capsule
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=600&q=80", // coconut oil
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=600&q=80", // dried herbs
  "https://images.unsplash.com/photo-1558429773-0d5084b445aa?w=600&q=80",    // jam
  "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=600&q=80", // aloe vera
  "https://images.unsplash.com/photo-1765850257647-811b8d3c20ca?w=600&q=80", // olive oil
  "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=600&q=80", // essential oil
  "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=600&q=80", // amla dried
];

export const articles = [
  { img: SAFE_IMAGES[3], category: "สรรพคุณสมุนไพร", title: "ขมิ้นชัน — ราชาแห่งสมุนไพรไทย ลดอักเสบช่วยตับ",
    desc: "รวมงานวิจัยล่าสุดเรื่องสาร Curcumin ในขมิ้นชันที่ช่วยลดการอักเสบและฟื้นฟูตับ พร้อมวิธีบริโภคให้ได้ประโยชน์สูงสุด", date: "3 พ.ค. 2569", views: 1248 },
  { img: SAFE_IMAGES[5], category: "สรรพคุณสมุนไพร", title: "ฟ้าทะลายโจร ทางเลือกธรรมชาติเสริมภูมิต้านทาน",
    desc: "เปิดข้อมูลทางเภสัชกรรมเรื่อง Andrographolide กับการลดไข้ บรรเทาหวัด พร้อมข้อควรระวังเมื่อทานต่อเนื่อง", date: "30 เม.ย. 2569", views: 892 },
  { img: SAFE_IMAGES[0], category: "ชาสมุนไพร", title: "ชาเก๊กฮวยกับการบำรุงสายตาและลดความร้อนในร่างกาย",
    desc: "วิธีชงชาเก๊กฮวยให้หอม ดื่มในช่วงเวลาที่เหมาะ และคู่กับสมุนไพรอื่นเพื่อสุขภาพตา-ตับที่ดียิ่งขึ้น", date: "28 เม.ย. 2569", views: 654 },
  { img: SAFE_IMAGES[7], category: "เคล็ดลับการปลูก", title: "ปลูกสมุนไพรสวนหลังบ้าน เริ่มได้ใน 7 ขั้นตอน",
    desc: "คู่มือเริ่มต้นปลูกใบบัวบก ตะไคร้ กระเพรา โหระพา ในกระถางหลังบ้าน เลือกดิน รดน้ำ ใส่ปุ๋ยอย่างไรให้งอกงาม", date: "26 เม.ย. 2569", views: 1573 },
  { img: SAFE_IMAGES[10], category: "การเก็บเกี่ยว", title: "ช่วงเวลาทองของการเก็บเกี่ยวสมุนไพร 12 ชนิด",
    desc: "เก็บใบเช้า รากเย็น ผลตามฤดู — ตารางช่วงเวลาที่เหมาะสมสำหรับสมุนไพรไทยยอดนิยม เพื่อสารสำคัญสูงสุด", date: "24 เม.ย. 2569", views: 421 },
  { img: SAFE_IMAGES[9], category: "อโรมาเธอราพี", title: "น้ำมันหอมระเหยจากตะไคร้ ลาเวนเดอร์ ยูคาลิปตัส ใช้อย่างไร",
    desc: "Aromatherapy 101 — สูตรผสมน้ำมันสำหรับนวด คลายเครียด ขับยุง ที่ปลอดภัยและทำเองได้", date: "22 เม.ย. 2569", views: 987 },
  { img: SAFE_IMAGES[4], category: "อาหารสุขภาพ", title: "5 สูตรน้ำสมุนไพรลดน้ำหนัก ดื่มต่อเนื่องเห็นผล",
    desc: "น้ำตะไคร้ใบเตย น้ำขิงมะนาว น้ำมะตูม สูตรชงง่าย แคลอรีต่ำ ช่วยขับสารพิษ เร่งเผาผลาญ", date: "20 เม.ย. 2569", views: 2106 },
  { img: SAFE_IMAGES[2], category: "ผลิตภัณฑ์ออร์แกนิก", title: "น้ำผึ้งดิบ vs น้ำผึ้งผ่านความร้อน ต่างกันอย่างไร",
    desc: "เจาะลึกความแตกต่างของกระบวนการผลิต คุณค่าเอนไซม์ที่หายไป และวิธีเลือกซื้อน้ำผึ้งคุณภาพ", date: "18 เม.ย. 2569", views: 768 },
  { img: SAFE_IMAGES[6], category: "ความเชื่อ-ภูมิปัญญา", title: "ตำรับยาสมุนไพรไทยโบราณ — ภูมิปัญญาที่กำลังจะหายไป",
    desc: "ย้อนรอยตำรายาเก่าแก่ ตำรับยาเขียวเล็กของหลวงปู่ ขับลม แก้ไข้ ที่ส่งต่อกันมาในชุมชน", date: "15 เม.ย. 2569", views: 543 },
  { img: SAFE_IMAGES[8], category: "ดูแลผิว", title: "ขมิ้นกับว่านหางจระเข้ — สูตรมาส์กหน้าจากครัวคุณยาย",
    desc: "ส่วนผสมง่ายๆ ที่หาได้ในครัว ผสมเองได้ใน 5 นาที ลดสิว ลดรอย ผิวกระจ่างใสตามธรรมชาติ", date: "12 เม.ย. 2569", views: 1834 },
  { img: SAFE_IMAGES[1], category: "การดูแลสุขภาพ", title: "สมุนไพรช่วยนอนหลับ — คาโมมายล์ วาเลเรียน ใบบัวบก",
    desc: "นอนไม่หลับเรื้อรัง? ลองสมุนไพรเหล่านี้ก่อนพึ่งยา พร้อมวิธีชงและขนาดที่เหมาะสมในแต่ละวัน", date: "10 เม.ย. 2569", views: 1129 },
  { img: SAFE_IMAGES[5], category: "งานวิจัย", title: "งานวิจัยล่าสุด เห็ดหลินจือกับการเสริมภูมิคุ้มกัน",
    desc: "สรุปงานวิจัย 5 ปีย้อนหลังเกี่ยวกับสาร Polysaccharide ในเห็ดหลินจือกับการต้านอนุมูลอิสระและภูมิคุ้มกัน", date: "8 เม.ย. 2569", views: 612 },
];

export const videos = [
  { img: SAFE_IMAGES[9], views: "12K", title: "ทำน้ำมันสมุนไพรทาแก้ปวดเมื่อย" },
  { img: SAFE_IMAGES[2], views: "15K", title: "เปิดสวนน้ำผึ้งดอกลำไย จ.ลำพูน" },
  { img: SAFE_IMAGES[4], views: "9K", title: "วิธีคั้นน้ำขิงสด บรรเทาหวัด" },
  { img: SAFE_IMAGES[0], views: "120K", title: "ชาคาโมมายล์ ผ่อนคลาย หลับสนิท" },
  { img: SAFE_IMAGES[10], views: "25K", title: "5 สูตรน้ำสมุนไพรผิวใส" },
  { img: SAFE_IMAGES[3], views: "99K", title: "ตำรับยาสมุนไพรไทยโบราณ" },
];

export function BlogPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div>
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 text-center px-4">
        <h1 className={`${font} text-[20px] sm:text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>{t("blog_title")}</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {/* Articles */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${font} text-[20px]`} style={{ fontWeight: 600 }}>{t("blog_articles")}</h2>
          <button className={`flex items-center gap-1 text-gray-500 text-[13px] ${font} cursor-pointer`}>{t("common_sort_desc")} <ChevronDown className="size-4" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {articles.map((a, i) => (
            <div
              key={i}
              className="bg-white rounded-[16px] border border-[#d4d4d4] h-auto sm:h-[180px] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#af6f08]/40 transition-all duration-300 group"
              onClick={() => navigate(`/blog/${i + 1}`)}
            >
              <div className="flex flex-col sm:flex-row items-stretch h-full">
                {/* Image */}
                <div className="relative h-[140px] sm:h-full shrink-0 w-full sm:w-[180px] overflow-hidden">
                  <ImageWithFallback src={a.img} alt={a.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                    <div className="bg-black/50 flex items-center gap-1.5 px-2.5 py-1 rounded-full">
                      <Eye className="size-3 text-white" />
                      <span className={`${font} text-[11px] text-white`}>{a.views.toLocaleString()}</span>
                    </div>
                    <div className="bg-black/50 px-2.5 py-1 rounded-full">
                      <span className={`${font} text-[11px] text-white`}>{a.date}</span>
                    </div>
                  </div>
                </div>
                {/* Content */}
                <div className="flex-1 flex flex-col gap-[8px] p-[14px] min-w-0">
                  <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }} title={a.title}>{a.title}</p>
                  <p className={`${font} text-[12px] text-[#737373] line-clamp-3`}>{a.desc}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/blog/${i + 1}`); }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#af6f08]/10 text-[#af6f08] group-hover:bg-[#af6f08] group-hover:text-white cursor-pointer transition-all duration-200 self-start mt-auto ${font} text-[12px]`}
                    style={{ fontWeight: 500 }}
                  >
                    {t("blog_read_more")}
                    <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button aria-label={t("common_prev_page")}
            className="size-8 rounded-full inline-flex items-center justify-center cursor-pointer text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754] transition-colors">
            <ChevronLeft className="size-4" strokeWidth={2.4} />
          </button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p}
              className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${p === 1 ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
              style={{ fontWeight: p === 1 ? 600 : 400 }}>{p}</button>
          ))}
          <button aria-label={t("common_next_page")}
            className="size-8 rounded-full inline-flex items-center justify-center cursor-pointer text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754] transition-colors">
            <ChevronRight className="size-4" strokeWidth={2.4} />
          </button>
        </div>

        {/* Videos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${font} text-[20px]`} style={{ fontWeight: 600 }}>{t("blog_videos")}</h2>
          <button className={`flex items-center gap-1 text-gray-500 text-[13px] ${font} cursor-pointer`}>{t("common_sort_desc")} <ChevronDown className="size-4" /></button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-[16px]">
          {videos.map((v, i) => (
            <div
              key={i}
              className="relative h-[180px] sm:h-[259px] rounded-[16px] overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <ImageWithFallback src={v.img} alt={v.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                {/* View Count */}
                <div className="bg-black/50 flex items-center gap-1.5 px-3 py-1 rounded-full">
                  <Eye className="size-3 text-white" />
                  <span className={`${font} text-[12px] text-white`}>{v.views}</span>
                </div>
                {/* Title */}
                <div className="bg-black/50 rounded-full w-full">
                  <div className="flex items-center justify-center px-3 py-1">
                    <span className={`${font} text-[12px] text-white truncate`}>{v.title}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}