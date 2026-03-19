import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, Ticket, ChevronRight, Search, Copy, Check, ArrowLeft, ShoppingBag } from "lucide-react";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type FilterTab = "all" | "discount" | "free_shipping" | "used" | "expired";

interface CollectedCoupon {
  id: string;
  type: "MH" | "FREE" | "VIP";
  label: string;
  sublabel: string;
  title: string;
  code: string;
  minSpend: string;
  tag?: string;
  tagColor?: string;
  expiry: string;
  expiryDate: string;
  bgColor: string;
  status: "active" | "used" | "expired";
  usedDate?: string;
}

const collectedCoupons: CollectedCoupon[] = [
  { id: "1", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด ฿30", code: "MH30OFF", minSpend: "ขั้นต่ำ ฿150", tag: "ทุกร้านค้า", tagColor: "#319754", expiry: "ใช้ได้ถึง: 25.03.2026", expiryDate: "2026-03-25", bgColor: "#319754", status: "active" },
  { id: "2", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP01", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", expiryDate: "2026-03-20", bgColor: "#00bfa5", status: "active" },
  { id: "3", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP02", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", expiryDate: "2026-03-20", bgColor: "#00bfa5", status: "active" },
  { id: "4", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP03", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", expiryDate: "2026-03-20", bgColor: "#00bfa5", status: "active" },
  { id: "7", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP07", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 12 ชั่วโมง", expiryDate: "2026-03-19", bgColor: "#00bfa5", status: "active" },
  { id: "11", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 15% ลดสูงสุด ฿500", code: "MH15PCT", minSpend: "ขั้นต่ำ ฿300", expiry: "ใช้ได้ถึง: 30.03.2026", expiryDate: "2026-03-30", bgColor: "#319754", status: "active" },
  { id: "12", type: "VIP", label: "VIP", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 50% ลดสูงสุด ฿200", code: "VIP50", minSpend: "ขั้นต่ำ ฿199", expiry: "ใช้ได้ถึง: 28.03.2026", expiryDate: "2026-03-28", bgColor: "#9c27b0", status: "active" },
  // Used coupons
  { id: "20", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด ฿50", code: "MH50OFF", minSpend: "ขั้นต่ำ ฿200", expiry: "หมดอายุ: 10.03.2026", expiryDate: "2026-03-10", bgColor: "#319754", status: "used", usedDate: "08.03.2026" },
  { id: "21", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP99", minSpend: "ขั้นต่ำ ฿0", expiry: "หมดอายุ: 12.03.2026", expiryDate: "2026-03-12", bgColor: "#00bfa5", status: "used", usedDate: "11.03.2026" },
  // Expired coupons
  { id: "30", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 10% ลดสูงสุด ฿300", code: "MH10PCT", minSpend: "ขั้นต่ำ ฿100", expiry: "หมดอายุ: 01.03.2026", expiryDate: "2026-03-01", bgColor: "#319754", status: "expired" },
  { id: "31", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP50", minSpend: "ขั้นต่ำ ฿0", expiry: "หมดอายุ: 05.03.2026", expiryDate: "2026-03-05", bgColor: "#00bfa5", status: "expired" },
];

function MyCouponCard({ coupon }: { coupon: CollectedCoupon }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const isInactive = coupon.status === "used" || coupon.status === "expired";

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code).then(() => {
      setCopied(true);
      toast.success("คัดลอกโค้ดแล้ว!", { description: coupon.code });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`bg-white rounded-lg relative overflow-hidden border border-[#e8e8e8] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] ${isInactive ? "opacity-60" : ""}`}>
      <div className="flex items-center">
        {/* Left badge */}
        <div className="relative shrink-0 w-[100px] h-[130px] flex items-center justify-center" style={{ backgroundColor: isInactive ? "#999" : coupon.bgColor }}>
          <div className="flex flex-col items-center text-white text-center">
            <span className={`${font} text-[22px]`} style={{ fontWeight: 700 }}>{coupon.label}</span>
            <span className={`${font} text-[10px]`}>{coupon.sublabel}</span>
          </div>
          <div className="absolute right-[-6px] top-[24px] size-3 rounded-full bg-[#fafafa]" />
          <div className="absolute right-[-6px] bottom-[24px] size-3 rounded-full bg-[#fafafa]" />
          {/* Dashed line */}
          <div className="absolute right-0 top-[36px] bottom-[36px] border-r border-dashed border-white/30" />
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-between px-4 py-3 min-w-0">
          <div className="flex flex-col gap-1 min-w-0 flex-1">
            <p className={`${font} text-[14px] text-[#222] truncate`} style={{ fontWeight: 500 }}>{coupon.title}</p>
            <p className={`${font} text-[12px] text-[#757575]`}>{coupon.minSpend}</p>
            {coupon.tag && (
              <span className={`inline-block w-fit border rounded px-2 py-0.5 text-[10px] ${font}`} style={{ borderColor: isInactive ? "#999" : coupon.tagColor, color: isInactive ? "#999" : coupon.tagColor }}>{coupon.tag}</span>
            )}
            {/* Code row */}
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`${font} text-[11px] bg-[#f5f5f5] border border-dashed border-[#d0d0d0] px-2 py-0.5 rounded text-[#555] tracking-wider`}>{coupon.code}</span>
              {coupon.status === "active" && (
                <button onClick={handleCopy} className="cursor-pointer text-[#319754] hover:text-[#267a43]">
                  {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="size-3 text-[#999]" />
              <span className={`${font} text-[11px] ${coupon.status === "active" ? "text-[#999]" : "text-[#d32f2f]"}`}>{coupon.expiry}</span>
              {coupon.status === "active" && <span className={`${font} text-[11px] text-[#319754] ml-2 cursor-pointer`}>เงื่อนไข</span>}
            </div>
            {coupon.status === "used" && coupon.usedDate && (
              <span className={`${font} text-[10px] text-[#757575]`}>ใช้เมื่อ: {coupon.usedDate}</span>
            )}
          </div>

          {/* Action button */}
          <div className="shrink-0 ml-3">
            {coupon.status === "active" ? (
              <button onClick={() => navigate("/products")}
                className={`${font} text-[12px] text-white bg-[#319754] px-4 py-2 rounded-full cursor-pointer hover:bg-[#267a43] flex items-center gap-1.5 whitespace-nowrap`}>
                ใช้เลย
              </button>
            ) : coupon.status === "used" ? (
              <span className={`${font} text-[12px] text-[#999] bg-[#f0f0f0] px-4 py-1.5 rounded-full`}>ใช้แล้ว</span>
            ) : (
              <span className={`${font} text-[12px] text-[#999] bg-[#f0f0f0] px-4 py-1.5 rounded-full`}>หมดอายุ</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MyCouponsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchCode, setSearchCode] = useState("");

  const filtered = collectedCoupons.filter((c) => {
    if (searchCode) {
      const q = searchCode.toLowerCase();
      if (!c.code.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false;
    }
    if (activeTab === "all") return true;
    if (activeTab === "discount") return (c.type === "MH" || c.type === "VIP") && c.status === "active";
    if (activeTab === "free_shipping") return c.type === "FREE" && c.status === "active";
    if (activeTab === "used") return c.status === "used";
    if (activeTab === "expired") return c.status === "expired";
    return true;
  });

  const activeCount = collectedCoupons.filter((c) => c.status === "active").length;
  const discountActive = collectedCoupons.filter((c) => (c.type === "MH" || c.type === "VIP") && c.status === "active").length;
  const freeActive = collectedCoupons.filter((c) => c.type === "FREE" && c.status === "active").length;
  const usedCount = collectedCoupons.filter((c) => c.status === "used").length;
  const expiredCount = collectedCoupons.filter((c) => c.status === "expired").length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: "ทั้งหมด", count: collectedCoupons.length },
    { key: "discount", label: "ส่วนลด", count: discountActive },
    { key: "free_shipping", label: "ส่งฟรี", count: freeActive },
    { key: "used", label: "ใช้แล้ว", count: usedCount },
    { key: "expired", label: "หมดอายุ", count: expiredCount },
  ];

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#319754] to-[#46A165] py-6 sm:py-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-20px] right-[-40px] size-[160px] rounded-full border-[20px] border-white" />
          <div className="absolute bottom-[-30px] left-[10%] size-[100px] rounded-full border-[14px] border-white" />
        </div>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] relative">
          <div className="flex items-center gap-3 mb-3">
            <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white cursor-pointer">
              <ArrowLeft className="size-5" />
            </button>
            <Ticket className="size-6 text-white" />
            <h1 className={`${font} text-[22px] sm:text-[26px] text-white`} style={{ fontWeight: 600 }}>คูปองของฉัน</h1>
          </div>
          <p className={`${font} text-[13px] text-white/80 ml-8`}>คูปองที่เก็บไว้ทั้งหมด {activeCount} ใบพร้อมใช้งาน</p>

          {/* Search bar */}
          <div className="mt-4 ml-8 max-w-[400px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#999]" />
              <input
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="ค้นหาโค้ดคูปอง..."
                className={`w-full bg-white/90 backdrop-blur-sm rounded-full pl-9 pr-4 py-2 text-[13px] ${font} outline-none placeholder:text-[#999]`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {/* Tabs - scrollable on mobile */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] ${font} cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.key ? "bg-[#319754] text-white shadow-sm" : "bg-white text-gray-600 border border-gray-200 hover:border-[#319754] hover:text-[#319754]"
              }`}>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-white/20 text-white" : "bg-[#ee4d2d] text-white"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Quick action - go get more coupons */}
        <button onClick={() => navigate("/coupons")}
          className={`w-full bg-white border border-dashed border-[#319754] rounded-lg p-3 mb-5 flex items-center justify-between cursor-pointer hover:bg-[#f0faf3] transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="size-9 bg-[#e8f5e2] rounded-full flex items-center justify-center">
              <Ticket className="size-4 text-[#319754]" />
            </div>
            <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>เก็บคูปองเพิ่มเติม</span>
          </div>
          <ChevronRight className="size-5 text-[#319754]" />
        </button>

        {/* Coupon list */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((coupon) => (
              <MyCouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-20 bg-[#f0f0f0] rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="size-8 text-[#ccc]" />
            </div>
            <p className={`${font} text-[16px] text-[#999]`} style={{ fontWeight: 500 }}>
              {searchCode ? "ไม่พบคูปองที่ค้นหา" : "ยังไม่มีคูปองในหมวดนี้"}
            </p>
            <p className={`${font} text-[13px] text-[#bbb] mt-1`}>
              {searchCode ? "ลองค้นหาด้วยคำอื่น" : "ไปเก็บคูปองเพิ่มได้เลย!"}
            </p>
            <button onClick={() => navigate("/coupons")}
              className={`mt-4 ${font} text-[13px] text-white bg-[#319754] px-6 py-2 rounded-full cursor-pointer hover:bg-[#267a43]`}>
              เก็บคูปอง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
