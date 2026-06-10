import { useState } from "react";
import { useNavigate } from "react-router";
import { Clock, ChevronRight, ChevronLeft, ShoppingBag } from "lucide-react";
import { AccountSidebar } from "../components/AccountSidebar";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useLanguage } from "../store/LanguageContext";

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
  { id: "5", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 27% ลดสูงสุด ฿1,000", code: "MH27PCT", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ถึง: 24.03.2026", expiryDate: "2026-03-24", bgColor: "#319754", status: "active" },
  { id: "6", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 27% ลดสูงสุด ฿1,000", code: "MH27PCT2", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ถึง: 24.03.2026", expiryDate: "2026-03-24", bgColor: "#319754", status: "expired" },
  { id: "7", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP07", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 12 ชั่วโมง", expiryDate: "2026-03-19", bgColor: "#00bfa5", status: "active" },
  { id: "8", type: "VIP", label: "VIP", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 50% ลดสูงสุด ฿100", code: "VIP50", minSpend: "ขั้นต่ำ ฿199", expiry: "ใช้ได้ในอีก: 1 วัน", expiryDate: "2026-03-20", bgColor: "#9c27b0", status: "expired" },
  { id: "9", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 23% ลดสูงสุด ฿1,000", code: "MH23PCT", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ถึง: 24.03.2026", expiryDate: "2026-03-24", bgColor: "#319754", status: "active" },
  { id: "10", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 17% ลดสูงสุด ฿3,000", code: "MH17PCT", minSpend: "ขั้นต่ำ ฿200", expiry: "ใช้ได้ถึง: 24.03.2026", expiryDate: "2026-03-24", bgColor: "#319754", status: "expired" },
  // Used coupons
  { id: "20", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด ฿50", code: "MH50OFF", minSpend: "ขั้นต่ำ ฿200", expiry: "หมดอายุ: 10.03.2026", expiryDate: "2026-03-10", bgColor: "#319754", status: "used", usedDate: "08.03.2026" },
  { id: "21", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", code: "FREESHIP99", minSpend: "ขั้นต่ำ ฿0", expiry: "หมดอายุ: 12.03.2026", expiryDate: "2026-03-12", bgColor: "#00bfa5", status: "used", usedDate: "11.03.2026" },
];

/* -------- Coupon Badge (left side) -------- */
function CouponBadge({ coupon, inactive }: { coupon: CollectedCoupon; inactive: boolean }) {
  const bg = inactive ? "#999" : coupon.bgColor;
  return (
    <div className="relative shrink-0 w-[72px] sm:w-[100px] h-[118px]" style={{ backgroundColor: bg }}>
      <div className="flex flex-col items-center justify-center h-full text-white text-center px-1">
        <span className={`${font} text-[16px] sm:text-[22px]`} style={{ fontWeight: 700 }}>{coupon.label}</span>
        <span className={`${font} text-[9px] sm:text-[10px]`}>{coupon.sublabel}</span>
      </div>
      {/* Semicircle cutouts */}
      <div className="absolute right-[-6px] top-[24px] size-3 rounded-full bg-[#fafafa]" />
      <div className="absolute right-[-6px] bottom-[24px] size-3 rounded-full bg-[#fafafa]" />
    </div>
  );
}

/* -------- Single Coupon Card -------- */
function MyCouponCard({ coupon }: { coupon: CollectedCoupon }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isInactive = coupon.status === "used" || coupon.status === "expired";

  const handleUse = () => {
    toast.success(t("my_coupons_use_toast"));
    navigate("/products");
  };

  return (
    <div className="bg-white rounded-lg relative overflow-hidden shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] border border-[#e8e8e8]">
      <div className="flex items-stretch">
        <CouponBadge coupon={coupon} inactive={isInactive} />

        {/* Content */}
        <div className="flex-1 flex items-center justify-between gap-2 px-3 sm:px-4 py-3 min-w-0">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <p className={`${font} text-[13px] sm:text-[14px] text-[#222]`} style={{ fontWeight: 500 }}>{coupon.title}</p>
            <p className={`${font} text-[11px] sm:text-[12px] text-[#757575]`}>{coupon.minSpend}</p>
            {coupon.tag && (
              <span
                className={`inline-block w-fit border rounded px-2 py-0.5 text-[10px] ${font}`}
                style={{ borderColor: isInactive ? "#999" : coupon.tagColor, color: isInactive ? "#999" : coupon.tagColor }}
              >
                {coupon.tag}
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <Clock className="size-3 text-[#999]" />
              <span className={`${font} text-[11px] text-[#999]`}>{coupon.expiry}</span>
              {coupon.status === "active" && (
                <span className={`${font} text-[11px] text-[#319754] cursor-pointer hover:underline`}>{t("coupon_terms")}</span>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="shrink-0 ml-3">
            {coupon.status === "active" ? (
              <button
                onClick={handleUse}
                className={`${font} text-[13px] text-[#319754] border border-[#319754] px-4 py-1.5 rounded-full cursor-pointer hover:bg-[#319754] hover:text-white transition-colors whitespace-nowrap`}
              >
                {t("my_coupons_use")}
              </button>
            ) : (
              <span className={`${font} text-[12px] text-[#999] bg-[#f0f0f0] px-4 py-1.5 rounded-full whitespace-nowrap`}>
                {t("my_coupons_expired")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------- Coupon Ticket Icon (SVG) -------- */
function TicketIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M1.333 6C1.863 6 2.372 6.21 2.747 6.584C3.122 6.959 3.333 7.468 3.333 7.998C3.333 8.528 3.122 9.037 2.747 9.412C2.372 9.787 1.863 9.997 1.333 9.997V11.33C1.333 11.684 1.473 12.023 1.723 12.273C1.973 12.523 2.312 12.664 2.666 12.664H13.33C13.684 12.664 14.023 12.523 14.273 12.273C14.523 12.023 14.663 11.684 14.663 11.33V9.997C14.133 9.997 13.624 9.787 13.249 9.412C12.874 9.037 12.664 8.528 12.664 7.998C12.664 7.468 12.874 6.959 13.249 6.584C13.624 6.21 14.133 6 14.663 6V4.666C14.663 4.312 14.523 3.973 14.273 3.723C14.023 3.473 13.684 3.333 13.33 3.333H2.666C2.312 3.333 1.973 3.473 1.723 3.723C1.473 3.973 1.333 4.312 1.333 4.666V6Z"
        stroke="#319754" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      <path d="M8.664 3.333V4.666" stroke="#319754" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.664 11.33V12.664" stroke="#319754" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.664 7.331V8.664" stroke="#319754" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* -------- Main Page -------- */
export function MyCouponsPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

  const filtered = collectedCoupons.filter((c) => {
    if (activeTab === "all") return true;
    if (activeTab === "discount") return (c.type === "MH" || c.type === "VIP") && c.status === "active";
    if (activeTab === "free_shipping") return c.type === "FREE" && c.status === "active";
    if (activeTab === "used") return c.status === "used";
    if (activeTab === "expired") return c.status === "expired";
    return true;
  });

  const discountActive = collectedCoupons.filter((c) => (c.type === "MH" || c.type === "VIP") && c.status === "active").length;
  const freeActive = collectedCoupons.filter((c) => c.type === "FREE" && c.status === "active").length;
  const usedCount = collectedCoupons.filter((c) => c.status === "used").length;
  const expiredCount = collectedCoupons.filter((c) => c.status === "expired").length;

  const tabs: { key: FilterTab; label: string; count: number }[] = [
    { key: "all", label: t("coupon_tab_all"), count: collectedCoupons.length },
    { key: "discount", label: t("coupon_tab_discount"), count: discountActive },
    { key: "free_shipping", label: t("coupon_tab_freeship"), count: freeActive },
    { key: "used", label: t("my_coupons_tab_used"), count: usedCount },
    { key: "expired", label: t("my_coupons_tab_expired"), count: expiredCount },
  ];

  return (
    <div>
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <AccountSidebar />
        <div className="flex-1 min-w-0 space-y-4">
          {/* Header — h2 title (back button removed; sidebar handles navigation) */}
          <h2 className={`${font} text-[24px] mb-2`} style={{ fontWeight: 500 }}>{t("my_coupons_title")}</h2>

          {/* Collect more coupons banner */}
          <button onClick={() => navigate("/coupons")}
            className="w-full bg-[#319754] rounded-2xl border border-dashed border-white/40 px-4 py-3.5 flex items-center justify-between cursor-pointer hover:bg-[#2d8a4c] transition-colors shadow-[0_4px_12px_-2px_rgba(49,151,84,0.25)]">
            <div className="flex items-center gap-3">
              <div className="size-9 bg-[#e8f5e2] rounded-full flex items-center justify-center">
                <TicketIcon />
              </div>
              <span className={`${font} text-[14px] text-white`} style={{ fontWeight: 500 }}>{t("my_coupons_collect_more")}</span>
            </div>
            <ChevronRight className="size-5 text-white" />
          </button>

          {/* Tabs — frosted glass pill with gradient active state (match OrdersPage) */}
          <div className="flex justify-start relative z-10">
            <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full scrollbar-hide ring-1 ring-white/60"
              style={{
                background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
              }}>
              {tabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`group/tab relative flex items-center gap-1.5 px-3 h-[34px] rounded-full text-[13px] ${font} cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
                      isActive ? "text-white" : "text-[#1d5b32] hover:text-[#287745]"
                    }`}
                    style={{ fontWeight: 500 }}>
                    {!isActive && (
                      <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />
                    )}
                    {isActive && (
                      <motion.div layoutId="coupons-tab"
                        className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                        style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <span className="relative z-10 leading-none">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`relative z-10 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10px] tabular-nums ring-[1.5px] ${
                        isActive
                          ? "bg-white text-[#ef4444] ring-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                          : "text-white ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)]"
                      }`}
                      style={isActive ? { fontWeight: 700 } : { background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Coupon grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {filtered.map((coupon) => (
              <MyCouponCard key={coupon.id} coupon={coupon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="size-20 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
              <ShoppingBag className="size-8 text-[#ccc]" />
            </div>
            <p className={`${font} text-[16px] text-[#999]`} style={{ fontWeight: 500 }}>
              {t("my_coupons_empty")}
            </p>
            <p className={`${font} text-[13px] text-[#bbb] mt-1`}>{t("my_coupons_empty_sub")}</p>
            <button
              onClick={() => navigate("/coupons")}
              className={`mt-4 ${font} text-[13px] text-white bg-[#319754] px-6 py-2 rounded-full cursor-pointer hover:bg-[#267a43]`}
            >
              {t("my_coupons_go")}
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}
