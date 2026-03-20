import { useNavigate, useParams, useSearchParams } from "react-router";
import { useOrders } from "../store/OrderContext";
import { ChevronLeft, CheckCircle, Search, Clock, Truck, Phone, Mail } from "lucide-react";
import { Package } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const typeLabels: Record<string, string> = {
  damaged: "สินค้าเสียหาย",
  wrong_item: "สินค้าไม่ตรงตามที่สั่ง",
  return: "ต้องการคืนสินค้า",
  refund: "ต้องการขอเงินคืน",
};

const timeline = [
  {
    title: "ส่งคำร้องเรียน",
    desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว",
    date: "15 มี.ค. 2569 09:15",
    done: true,
  },
  {
    title: "ตรวจสอบข้อมูล",
    desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล",
    date: "15 มี.ค. 2569 11:30",
    done: true,
  },
  {
    title: "อนุมัติและดำเนินการ",
    desc: "อยู่ระหว่างจัดส่งสินค้าทดแทน",
    date: "16 มี.ค. 2569 14:00",
    done: true,
  },
  {
    title: "จัดส่งสินค้าทดแทน",
    desc: "ส่งสินค้าทดแทนให้ลูกค้า",
    date: "",
    done: false,
    current: true,
  },
  {
    title: "เสร็จสิ้น",
    desc: "ปิดคำร้องเรียน",
    date: "",
    done: false,
  },
];

const evidenceImages = [
  "https://images.unsplash.com/photo-1586769852044-692d6e3703f2?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
  "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200&h=200&fit=crop",
];

export function ComplaintStatusPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "damaged";
  const complaintId = searchParams.get("cid") || "CMP-XXXXXX";
  const amount = searchParams.get("amount") || "0.00";
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className={`${font} text-gray-500`}>ไม่พบคำสั่งซื้อ</p>
      </div>
    );
  }

  const productName = order.items[0]?.name || "สินค้า";

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-6">
      {/* Back */}
      <button onClick={() => navigate("/orders")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4d4d4] text-[12px] ${font} cursor-pointer hover:bg-[#c4c4c4] mb-6`}>
        <ChevronLeft className="size-3" /> กลับ
      </button>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left: ข้อมูลการร้องเรียน */}
        <div className="flex-1 space-y-6">
          {/* ข้อมูลการร้องเรียน */}
          <div className="bg-white rounded-2xl p-6">
            <p className={`${font} text-[16px] text-black pb-2 mb-6 border-b border-[#d4d4d8]`} style={{ fontWeight: 500 }}>ข้อมูลการร้องเรียน</p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6">
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>เลขที่คำสั่งซื้อ</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{order.id}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>สินค้า</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{productName}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>ยอดเงินคืน</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿ {amount}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>ช่องทางคืนเงิน</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ธนาคารทหารไทยธนชาต [*1234]</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>วันที่แจ้ง</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>15 มี.ค. 2569</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>ประเภท</p>
                <p className={`${font} text-[14px] text-[#ef4444]`} style={{ fontWeight: 500 }}>{typeLabels[type] || type}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-[#999]`}>อีเมล</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>metaherb@gmai.com</p>
              </div>
            </div>

            {/* รายละเอียด */}
            <div className="mb-6">
              <p className={`${font} text-[12px] text-[#999] mb-2`}>รายละเอียด</p>
              <div className="border border-[#d4d4d8] rounded-lg px-4 py-3">
                <p className={`${font} text-[14px] text-black`}>กล่องสินค้าบุบเสียหายอย่างหนัก ผลิตภัณฑ์ด้านในแตกออกและหกเลอะ ไม่สามารถใช้งานได้</p>
              </div>
            </div>

            {/* หลักฐานรูปภาพ */}
            <div className="flex gap-3">
              {evidenceImages.map((img, i) => (
                <img key={i} src={img} alt={`หลักฐาน ${i + 1}`} className="size-[120px] rounded-lg object-cover" />
              ))}
            </div>
          </div>

          {/* ข้อความจากร้านค้า */}
          <div className="bg-white rounded-2xl border-l-4 border-l-[#319754] px-5 py-4 flex gap-3 items-start">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="shrink-0 mt-0.5">
              <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2Z" fill="#319754"/>
            </svg>
            <div>
              <p className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 600 }}>ข้อความจากร้านค้า</p>
              <p className={`${font} text-[14px] text-[rgba(0,0,0,0.8)] mt-1`}>ขออภัยในความไม่สะดวก ทางร้านได้ทำการโอนเงินคืนเป็นจำนวน xx.xx บาท ไปยังบัญชี x123 Visa แล้ว</p>
            </div>
          </div>

          {/* ความคืบหน้า */}
          <div>
            <p className={`${font} text-[16px] text-black mb-4`} style={{ fontWeight: 500 }}>ความคืบหน้า</p>

            <div className="bg-white rounded-2xl p-6">
              <div className="space-y-0">
                {timeline.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Indicator */}
                    <div className="flex flex-col items-center">
                      {step.done ? (
                        <div className="size-6 rounded-full bg-[#319754] flex items-center justify-center shrink-0">
                          <CheckCircle className="size-4 text-white" />
                        </div>
                      ) : step.current ? (
                        <div className="size-6 rounded-full bg-[#319754] flex items-center justify-center shrink-0">
                          <Clock className="size-3.5 text-white" />
                        </div>
                      ) : (
                        <div className="size-6 rounded-full bg-[#e5e7eb] shrink-0" />
                      )}
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[40px] ${step.done ? "bg-[#319754]" : "bg-[#e5e7eb]"}`} />
                      )}
                    </div>

                    {/* Content */}
                    <div className="pb-6 -mt-0.5">
                      <p className={`${font} text-[14px] ${step.done || step.current ? "text-black" : "text-[#999]"}`} style={{ fontWeight: 600 }}>{step.title}</p>
                      <p className={`${font} text-[12px] text-[#666] mt-0.5`}>{step.desc}</p>
                      {step.date && (
                        <p className={`${font} text-[12px] text-[#319754] mt-0.5`}>{step.date}</p>
                      )}
                      {!step.done && !step.date && (
                        <p className={`${font} text-[12px] text-[#999] mt-0.5`}>รอดำเนินการ</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: ช่วยเหลือ */}
        <div className="w-full lg:w-[320px]">
          <div className="bg-white rounded-2xl p-6">
            <p className={`${font} text-[16px] text-black mb-4`} style={{ fontWeight: 500 }}>ต้องการความช่วยเหลือ?</p>
            <p className={`${font} text-[14px] text-[#666] mb-4`}>หากมีคำถามเพิ่มเติม ติดต่อเราได้ที่:</p>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="size-5 text-[#319754]" />
                <span className={`${font} text-[14px] text-black`}>061-421-3111</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="size-5 text-[#319754]" />
                <span className={`${font} text-[14px] text-black`}>Metaherb@gmail.com</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#e5e7eb]">
              <p className={`${font} text-[12px] text-[#999]`}>จันทร์ – ศุกร์ 08:30 – 17:30 น.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}