import { useParams, useNavigate } from "react-router";
import { ChevronLeft, Eye, BookmarkPlus, Calendar } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import imgArticle from "figma:asset/36f166089da436039788c54134db669b35eb382a.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const articles: Record<string, { title: string; date: string; content: string }> = {
  "1": {
    title: "การใช้สมุนไพร",
    date: "20 กุมภาพันธ์ 2569",
    content: `การใช้สมุนไพรเพื่อบรรเทาอาการเจ็บป่วย: ภูมิปัญญาจากธรรมชาติ

สมุนไพรเป็นของขวัญจากล้ำค่าจากธรรมชาติที่มนุษย์นำมาใช้ประโยชน์ตั้งแต่สมัยโบราณกาล ในปัจจุบัน วิทยาศาสตร์ได้พิสูจน์ว่าสมุนไพรหลายชนิดมีสรรพคุณทางยาที่สามารถช่วยบรรเทาอาการเจ็บป่วยต่างๆ ได้อย่างมีประสิทธิภาพ การใช้สมุนไพรอย่างถูกต้องและเหมาะสมจึงเป็นทางเลือกในการดูแลสุขภาพที่น่าสนใจ

**หลักการพื้นฐานในการใช้สมุนไพร**

1. **รู้จักสมุนไพร:** ศึกษาข้อมูลเกี่ยวกับสมุนไพรแต่ละชนิดก่อนนำมาใช้ รู้ถึงสรรพคุณ วิธีใช้ ข้อควรระวัง และผลข้างเคียงที่อาจเกิดขึ้น
2. **ปรึกษาผู้เชี่ยวชาญ:** หากไม่แน่ใจในการใช้สมุนไพร ควรปรึกษาแพทย์แผนไทย เภสัชกร หรือผู้ที่มีความรู้ความเชี่ยวชาญด้านสมุนไพร
3. **เลือกสมุนไพรที่มีคุณภาพ:** เลือกซื้อสมุนไพรจากแหล่งที่น่าเชื่อถือ สะอาด และได้มาตรฐาน
4. **ใช้ในปริมาณที่เหมาะสม:** ปฏิบัติตามคำแนะนำในการใช้สมุนไพรอย่างเคร่งครัด ไม่ใช้ในปริมาณที่มากเกินไป
5. **สังเกตอาการ:** หากมีอาการผิดปกติเกิดขึ้นหลังใช้สมุนไพร ควรหยุดใช้ทันทีและปรึกษาแพทย์

**ตัวอย่างการใช้สมุนไพรเพื่อบรรเทาอาการเจ็บป่วย**

* **แก้หวัด คัดจมูก:** ฟ้าทะลายโจร ขิง ขมิ้นชัน
* **แก้ไอ เจ็บคอ:** มะขามป้อม ชะเอมเทศ มะแว้ง
* **ลดไข้:** ใบเตย จากหญ่าคา
* **แก้ท้องอืด ท้องเฟ้อ:** ขมิ้นชัน ตะไคร้ กะเพรา
* **บรรเทาอาการปวดเมื่อย:** ไพล ขมิ้นอ้อย
* **รักษาแผล:** ว่านหาง จระเข้ ไม้มวก

**ข้อควรระวังในการใช้สมุนไพร**

* สตรีมีครรภ์และให้นมบุตรควรปรึกษาแพทย์ก่อนใช้สมุนไพร
* ผู้ที่มีโรคประจำตัวควรปรึกษาแพทย์ก่อนใช้สมุนไพร
* หลีกเลี่ยงการใช้สมุนไพรติดต่อกันเป็นเวลานาน
* ระวังการแพ้สมุนไพร

**บทสรุป**

การใช้สมุนไพรเป็นศาสตร์และศิลป์ที่ต้องอาศัยความรู้ความเข้าใจ การใช้สมุนไพรอย่างถูกต้องและเหมาะสามารถช่วยบรรเทาอาการเจ็บป่วยและส่งเสริมสุขภาพที่ดีได้อย่างมีประสิทธิภาพ ควรใช้สมุนไพรอย่างระมัดระวังและปรึกษาผู้เชี่ยวชาญเมื่อจำเป็น เพื่อความปลอดภัยและประสิทธิภาพในการรักษา`,
  },
};

export function BlogDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles[id || "1"] || articles["1"];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
      {/* Back button */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className={`flex items-center gap-1.5 bg-[#d4d4d4] px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer`}>
          <ChevronLeft className="size-3" /> กลับ
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-gray-500">
            <Eye className="size-4" /> <span className={`${font} text-[13px]`}>0</span>
          </div>
          <BookmarkPlus className="size-5 text-gray-500 cursor-pointer hover:text-[#319754]" />
        </div>
      </div>

      {/* Hero image */}
      <div className="w-full h-[200px] sm:h-[300px] lg:h-[400px] rounded-xl overflow-hidden mb-4 sm:mb-6">
        <ImageWithFallback src={imgArticle} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <article className="max-w-[800px] mx-auto">
        <h1 className={`${font} text-[24px] text-black mb-2`} style={{ fontWeight: 600 }}>{article.title}</h1>
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="size-4 text-gray-400" />
          <span className={`${font} text-[13px] text-gray-400`}>{article.date}</span>
        </div>

        <div className={`${font} text-[14px] text-gray-700 leading-relaxed whitespace-pre-line`}>
          {article.content.split("\n").map((line, i) => {
            if (line.startsWith("**") && line.endsWith("**")) {
              return <h2 key={i} className="text-[16px] text-black mt-6 mb-2" style={{ fontWeight: 600 }}>{line.replace(/\*\*/g, "")}</h2>;
            }
            if (line.startsWith("* **")) {
              const parts = line.replace("* **", "").split(":**");
              return <p key={i} className="ml-4 mb-1">• <span style={{ fontWeight: 500 }}>{parts[0]}:</span>{parts[1]}</p>;
            }
            if (line.startsWith("* ")) {
              return <p key={i} className="ml-4 mb-1">• {line.slice(2)}</p>;
            }
            if (line.match(/^\d\./)) {
              const cleaned = line.replace(/\*\*/g, "");
              return <p key={i} className="ml-4 mb-1">{cleaned}</p>;
            }
            return <p key={i} className="mb-2">{line.replace(/\*\*/g, "")}</p>;
          })}
        </div>
      </article>
    </div>
  );
}