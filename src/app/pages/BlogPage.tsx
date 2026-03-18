import { useNavigate } from "react-router";
import { ChevronRight, ChevronDown, Play } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
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

const articles = [
  { img: imgArticle1, title: "การใช้สมุนไพร", desc: "วิธีการใช้สมุนไพรเพื่อบรรเทาอาการเจ็บป่วย", date: "20 ก.พ. 2569", views: 2 },
  { img: imgArticle2, title: "ดูแลกิญชาก้นครัว", desc: "การใช้สมุนไพรในการดูแลสุขภาพ", date: "20 ก.พ. 2569", views: 3 },
  { img: imgArticle3, title: "การเก็บเกี่ยวพืชสมุนไพร", desc: "เทคนิคในการเก็บเกี่ยวและรักษาคุณภาพสมุนไพร", date: "20 มี.ค. 2569", views: 4 },
  { img: imgArticle1, title: "เคล็ดลับการเก็บเกี่ยวที่...", desc: "คู่มือการเก็บเกี่ยวและการทำ บริเวณเก็บ", date: "20 ก.พ. 2569", views: 4 },
  { img: imgArticle2, title: "ชีวะ:มหัศจรรย์แห่งสม...", desc: "เคล็ดลับการเก็บเกี่ยวชีวะและจักรวาลจากผืนดุน", date: "20 ก.พ. 2569", views: 4 },
  { img: imgArticle3, title: "ช่วงเวลาทองของการ...", desc: "คู่มือเก็บเกี่ยวสมุนไพร ทั้งสถานที่เก็บจัดเจ", date: "20 ก.พ. 2569", views: 4 },
];

const videos = [imgVideo1, imgVideo2, imgVideo3, imgVideo4, imgVideo5, imgVideo6];

export function BlogPage() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>สาระความรู้ทั้งหมด</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {/* Articles */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${font} text-[20px]`} style={{ fontWeight: 600 }}>บทความแนะนำ</h2>
          <button className={`flex items-center gap-1 text-gray-500 text-[13px] ${font} cursor-pointer`}>จากมากไปน้อย <ChevronDown className="size-4" /></button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {articles.map((a, i) => (
            <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer flex" onClick={() => navigate(`/blog/${i + 1}`)}>
              <div className="w-[140px] shrink-0 overflow-hidden">
                <ImageWithFallback src={a.img} alt={a.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="bg-[#319754]/10 text-[#319754] text-[10px] px-1.5 py-0.5 rounded">{a.views}</span>
                  </div>
                  <h3 className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{a.title}</h3>
                  <p className={`${font} text-[12px] text-gray-500 mt-1`}>{a.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`${font} text-[11px] text-gray-400`}>{a.date}</span>
                  <button className={`flex items-center gap-1 text-[12px] text-[#319754] ${font} cursor-pointer`}>อ่านเพิ่มเติม <ChevronRight className="size-3" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <button className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-[13px] cursor-pointer">◀</button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} className={`size-8 rounded-full flex items-center justify-center text-[13px] cursor-pointer ${p === 1 ? "bg-[#319754] text-white" : "bg-gray-100"}`}>{p}</button>
          ))}
          <button className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-[13px] cursor-pointer">▶</button>
        </div>

        {/* Videos */}
        <div className="flex items-center justify-between mb-4">
          <h2 className={`${font} text-[20px]`} style={{ fontWeight: 600 }}>วิดีโอแนะนำ</h2>
          <button className={`flex items-center gap-1 text-gray-500 text-[13px] ${font} cursor-pointer`}>จากมากไปน้อย <ChevronDown className="size-4" /></button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {videos.map((v, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] cursor-pointer group">
              <ImageWithFallback src={v} alt="Video" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <Play className="size-8 text-white fill-white/80" />
              </div>
              <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                <span>{["12K", "15K", "9K", "120K", "25K", "99K"][i]}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-2">
                <p className={`${font} text-[11px] text-white truncate`}>{["บทความสมุนไพรดีๆ", "ท่องเที่ยวสบายๆ", "ผลิตภัณฑ์สมุนไพร", "ทริปเดินทางสุดเจ๋ง", "เดินป่าธรรมชาติ", "สัมผัสธรรมชาติ"][i]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}