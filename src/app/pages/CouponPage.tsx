import { useState } from "react";
import { Clock, Tag, Ticket, Gift } from "lucide-react";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai',sans-serif]";

type CouponType = "all" | "discount" | "free_shipping";

interface Coupon {
  id: string;
  type: "MH" | "FREE" | "VIP";
  label: string;
  sublabel: string;
  title: string;
  minSpend: string;
  tag?: string;
  tagColor?: string;
  expiry: string;
  collected: boolean;
  bgColor: string;
}

const mockCoupons: Coupon[] = [
  { id: "1", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด ฿30", minSpend: "ขั้นต่ำ ฿150", tag: "ทุกร้านค้า", tagColor: "#319754", expiry: "ใช้ได้ถึง: 25.03.2026", collected: true, bgColor: "#319754" },
  { id: "2", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", collected: true, bgColor: "#00bfa5" },
  { id: "3", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", collected: true, bgColor: "#00bfa5" },
  { id: "4", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", collected: true, bgColor: "#00bfa5" },
  { id: "5", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 27% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ตั้งแต่: 24.03.2026", collected: false, bgColor: "#319754" },
  { id: "6", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 27% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ตั้งแต่: 24.03.2026", collected: false, bgColor: "#319754" },
  { id: "7", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 12 ชั่วโมง", collected: true, bgColor: "#00bfa5" },
  { id: "8", type: "VIP", label: "VIP", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 50% ลดสูงสุด ฿100", minSpend: "ขั้นต่ำ ฿199", expiry: "ใช้ได้ในอีก: 1 วัน", collected: false, bgColor: "#9c27b0" },
  { id: "9", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 23% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ตั้งแต่: 24.03.2026", collected: false, bgColor: "#319754" },
  { id: "10", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 17% ลดสูงสุด ฿3,000", minSpend: "ขั้นต่ำ ฿200", expiry: "ใช้ได้ตั้งแต่: 24.03.2026", collected: false, bgColor: "#319754" },
];

function CouponCard({ coupon, onCollect }: { coupon: Coupon; onCollect: (id: string) => void }) {
  return (
    <div className="bg-white rounded-lg relative overflow-hidden border border-[#e8e8e8] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center">
        {/* Left badge */}
        <div className="relative shrink-0 w-[100px] h-[118px] flex items-center justify-center" style={{ backgroundColor: coupon.bgColor }}>
          <div className="flex flex-col items-center text-white text-center">
            <span className={`${fontBold} text-[22px]`} style={{ fontWeight: 700 }}>{coupon.label}</span>
            <span className={`${font} text-[10px]`}>{coupon.sublabel}</span>
          </div>
          {/* Cutout circles */}
          <div className="absolute right-[-6px] top-[24px] size-3 rounded-full bg-[#fafafa]" />
          <div className="absolute right-[-6px] bottom-[24px] size-3 rounded-full bg-[#fafafa]" />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-between px-4 py-3">
          <div className="flex flex-col gap-1.5">
            <p className={`${font} text-[14px] text-[#222]`} style={{ fontWeight: 500 }}>{coupon.title}</p>
            <p className={`${font} text-[12px] text-[#757575]`}>{coupon.minSpend}</p>
            {coupon.tag && (
              <span className={`inline-block w-fit border rounded px-2 py-0.5 text-[10px] ${font}`} style={{ borderColor: coupon.tagColor, color: coupon.tagColor }}>{coupon.tag}</span>
            )}
            <div className="flex items-center gap-1">
              <Clock className="size-3 text-[#999]" />
              <span className={`${font} text-[11px] text-[#999]`}>{coupon.expiry}</span>
              <span className={`${font} text-[11px] text-[#319754] ml-2 cursor-pointer`}>เงื่อนไข</span>
            </div>
          </div>

          {/* Collect button */}
          {coupon.collected ? (
            <span className={`${font} text-[13px] text-[#999] bg-[#f0f0f0] px-4 py-1.5 rounded-lg`}>เก็บแล้ว</span>
          ) : (
            <button onClick={() => onCollect(coupon.id)}
              className={`${font} text-[13px] text-white bg-[#319754] px-5 py-1.5 rounded-lg cursor-pointer hover:bg-[#267a43]`}>เก็บ</button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CouponPage() {
  const [coupons, setCoupons] = useState(mockCoupons);
  const [activeTab, setActiveTab] = useState<CouponType>("all");

  const handleCollect = (id: string) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, collected: true } : c)));
    toast.success("คุณได้รับคูปองแล้ว!");
  };

  const filtered = activeTab === "all" ? coupons :
    activeTab === "discount" ? coupons.filter((c) => c.type === "MH" || c.type === "VIP") :
    coupons.filter((c) => c.type === "FREE");

  const discountCount = coupons.filter((c) => c.type === "MH" || c.type === "VIP").length;
  const freeCount = coupons.filter((c) => c.type === "FREE").length;

  const tabItems: { key: CouponType; label: string; count: number }[] = [
    { key: "all", label: "ทั้งหมด", count: coupons.length },
    { key: "discount", label: "ส่วนลด", count: discountCount },
    { key: "free_shipping", label: "ส่งฟรี", count: freeCount },
  ];

  return (
    <div>
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>คูปอง METAHERB</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {/* Tabs */}
        <div className="flex gap-3 mb-6">
          {tabItems.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-[14px] ${font} cursor-pointer transition-colors ${
                activeTab === tab.key ? "bg-[#319754] text-white" : "bg-white text-gray-600 border border-gray-300"
              }`}>
              {tab.label}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-[#ee4d2d] text-white"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Coupon grid - 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
          {filtered.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} onCollect={handleCollect} />
          ))}
        </div>
      </div>
    </div>
  );
}