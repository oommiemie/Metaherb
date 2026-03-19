import { useState } from "react";
import { X, Clock, ChevronDown, Check } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

interface CouponOption {
  id: string;
  type: "FREE" | "MH";
  label: string;
  sublabel: string;
  title: string;
  minSpend: string;
  tag?: string;
  tagColor?: string;
  expiry: string;
  bgColor: string;
  category: "free_shipping" | "discount";
}

const availableCoupons: CouponOption[] = [
  { id: "c1", type: "FREE", label: "FREE", sublabel: "โค้ดส่งฟรี", title: "ส่งฟรี", minSpend: "ขั้นต่ำ ฿0", tag: "ส่งด่วน", tagColor: "#00bfa5", expiry: "ใช้ได้ในอีก: 1 วัน", bgColor: "#00bfa5", category: "free_shipping" },
  { id: "c2", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 27% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ตั้งแต่: 24.03.2026", bgColor: "#319754", category: "discount" },
  { id: "c3", type: "MH", label: "MH", sublabel: "โค้ดส่วนลด", title: "ส่วนลด 27% ลดสูงสุด ฿1,000", minSpend: "ขั้นต่ำ ฿500", expiry: "ใช้ได้ตั้งแต่: 24.03.2026", bgColor: "#319754", category: "discount" },
];

interface SelectCouponModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (coupon: CouponOption | null) => void;
}

export function SelectCouponModal({ open, onClose, onSelect }: SelectCouponModalProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({ free_shipping: true, discount: true });

  if (!open) return null;

  const toggleSection = (key: string) => setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  const handleConfirm = () => {
    const coupon = availableCoupons.find((c) => c.id === selected) || null;
    onSelect(coupon);
    onClose();
  };

  const sections = [
    { key: "free_shipping", label: "ส่งฟรี" },
    { key: "discount", label: "ส่วนลด" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 w-full max-w-[500px] flex flex-col gap-4 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] max-h-[80vh]" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>เลือกโค้ดส่วนลด</p>
          <button onClick={onClose} className="size-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer">
            <X className="size-3.5" />
          </button>
        </div>

        <div className="h-px bg-[#d4d4d8]" />

        {/* Sections */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {sections.map((section) => {
            const coupons = availableCoupons.filter((c) => c.category === section.key);
            return (
              <div key={section.key}>
                <button onClick={() => toggleSection(section.key)} className="flex items-center justify-between w-full cursor-pointer mb-4">
                  <span className={`${font} text-[16px]`} style={{ fontWeight: 500 }}>{section.label}</span>
                  <ChevronDown className={`size-5 transition-transform ${expandedSections[section.key] ? "" : "-rotate-90"}`} />
                </button>
                {expandedSections[section.key] && (
                  <div className="space-y-3">
                    {coupons.map((coupon) => (
                      <button key={coupon.id} onClick={() => setSelected(coupon.id === selected ? null : coupon.id)}
                        className="w-full bg-white rounded-lg relative overflow-hidden border border-[#e8e8e8] shadow-[0px_1px_4px_0px_rgba(0,0,0,0.08)] cursor-pointer text-left">
                        <div className="flex items-center">
                          {/* Left badge */}
                          <div className="relative shrink-0 w-[100px] h-[118px] flex items-center justify-center" style={{ backgroundColor: coupon.bgColor }}>
                            <div className="flex flex-col items-center text-white text-center">
                              <span className={`${fontBold} text-[20px]`} style={{ fontWeight: 700 }}>{coupon.label}</span>
                              <span className={`${font} text-[10px]`}>{coupon.sublabel}</span>
                            </div>
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
                                <span className={`${font} text-[11px] text-[#319754] ml-2`}>เงื่อนไข</span>
                              </div>
                            </div>

                            {/* Radio */}
                            <div className={`size-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              selected === coupon.id ? "border-[#34c759] bg-[#34c759]" : "border-[#8e8e93]"
                            }`}>
                              {selected === coupon.id && <Check className="size-3 text-white" />}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="h-px bg-[#d4d4d8]" />

        <button onClick={handleConfirm} className={`bg-[#008c45] h-[49px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>ตกลง</button>
      </div>
    </div>
  );
}