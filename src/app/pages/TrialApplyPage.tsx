import { useState, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, MapPin, FileText, ShieldCheck, Coins, Clock, Users, Check, Sparkles, User, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../store/AuthContext";
import {
  TRIAL_PRODUCTS, loadRegistrations, saveRegistrations,
  loadTesterProfile, getActiveRegistration, getTrialImages,
  type Registration,
} from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type Address = {
  id: string;
  label: string;
  recipient: string;
  phone: string;
  fullAddress: string;
  isDefault?: boolean;
};

/** Mock saved addresses — would come from AddressContext in a real app. */
const SAVED_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    label: "บ้าน",
    recipient: "username01",
    phone: "090-000-0001",
    fullAddress: "เลขที่ 2 ชั้น 2 ซอยสุขสวัสดิ์ 33 แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    isDefault: true,
  },
  {
    id: "addr-2",
    label: "ที่ทำงาน",
    recipient: "username01",
    phone: "090-000-0001",
    fullAddress: "ชั้น 15 อาคาร B ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย กรุงเทพมหานคร 10110",
  },
  {
    id: "addr-3",
    label: "บ้านต่างจังหวัด",
    recipient: "username01",
    phone: "090-000-0002",
    fullAddress: "55/12 หมู่ 5 ตำบลในเมือง อำเภอเมือง จังหวัดเชียงใหม่ 50000",
  },
];

export function TrialApplyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const product = useMemo(() => TRIAL_PRODUCTS.find((p) => p.id === id), [id]);
  const galleryImages = useMemo(() => product ? getTrialImages(product) : [], [product]);
  const testerProfile = useMemo(() => loadTesterProfile(), []);
  const registrations = useMemo(() => loadRegistrations(), []);
  const activeOther = useMemo(() => {
    const a = getActiveRegistration(registrations);
    return a && a.trialId !== id ? a : null;
  }, [registrations, id]);

  const [selectedAddressId, setSelectedAddressId] = useState(SAVED_ADDRESSES.find((a) => a.isDefault)?.id || SAVED_ADDRESSES[0]?.id);
  const [showAddressList, setShowAddressList] = useState(false);
  const [reason, setReason] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [id]);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-12 text-center">
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบผลิตภัณฑ์ทดสอบนี้</p>
        <button onClick={() => navigate("/trials")} className={`${font} text-[14px] text-[#319754] hover:underline`}>กลับไปหน้ารายการ</button>
      </div>
    );
  }

  const spotsLeft = product.spotsTotal - product.spotsTaken;
  const isClosed = spotsLeft <= 0 || product.endsInDays <= 0;
  const selectedAddress = SAVED_ADDRESSES.find((a) => a.id === selectedAddressId);
  const canSubmit = !!selectedAddress && reason.trim().length >= 10 && acceptTerms && !activeOther && !isClosed;

  const handleSubmit = () => {
    if (!canSubmit || !product || !selectedAddress) return;
    const reg: Registration = {
      trialId: product.id,
      name: user?.name || user?.username || testerProfile?.displayName || "",
      phone: selectedAddress.phone,
      address: selectedAddress.fullAddress,
      motivation: reason.trim(),
      submittedAt: Date.now(),
    };
    saveRegistrations([...registrations, reg]);
    toast.success("ส่งใบสมัครเรียบร้อย", {
      description: `METAHERB จะตรวจสอบและติดต่อกลับทาง ${selectedAddress.phone} ภายใน 2 วันทำการ`,
    });
    navigate(`/trials/${product.id}`);
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
      {/* Top bar */}
      <button onClick={() => navigate(-1)}
        className="group inline-flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors mb-5">
        <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.4} />
        <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>กลับ</span>
      </button>

      <h1 className={`${font} text-[22px] sm:text-[26px] text-[#1a1a1a] mb-5`} style={{ fontWeight: 700 }}>ขอเข้าร่วมทดสอบผลิตภัณฑ์</h1>

      <div className="flex flex-col lg:flex-row gap-[20px] items-start">
        {/* ===== Left: form sections ===== */}
        <div className="flex-1 flex flex-col gap-[16px] w-full min-w-0">

          {/* Address — mirrors PaymentPage layout */}
          <section className="bg-white rounded-[16px] p-4 sm:p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>
                <MapPin className="size-5 inline mr-2 text-[#319754]" />ที่อยู่ในการจัดส่ง
              </h3>
              <button onClick={() => setShowAddressList((v) => !v)} className={`${font} text-[13px] text-[#319754] cursor-pointer hover:underline`}>
                {showAddressList ? "ปิด" : "เปลี่ยน"}
              </button>
            </div>

            {/* Selected address card — PaymentPage style */}
            {selectedAddress && (
              <div className="backdrop-blur-[8px] bg-[rgba(242,242,247,0.5)] flex flex-col gap-[10px] items-start p-3 sm:p-[16px] rounded-[16px] w-full">
                <div className="flex items-start justify-between w-full gap-2">
                  <div className="flex flex-1 gap-2 sm:gap-[10px] items-center min-w-0 flex-wrap">
                    <p className={`${font} text-[14px] sm:text-[16px] text-black truncate`} style={{ fontWeight: 500 }}>{selectedAddress.recipient}</p>
                    {selectedAddress.isDefault && (
                      <span className={`bg-[#08f] text-white text-[11px] sm:text-[12px] ${font} px-3 sm:px-[16px] py-[2px] sm:py-[4px] rounded-full shrink-0`} style={{ fontWeight: 500 }}>ที่อยู่หลัก</span>
                    )}
                    <span className={`bg-gray-100 text-gray-700 text-[11px] ${font} px-3 py-[2px] rounded-full shrink-0`} style={{ fontWeight: 500 }}>{selectedAddress.label}</span>
                  </div>
                  <div className="bg-[rgba(120,120,128,0.12)] flex items-center justify-center rounded-full size-[28px] shrink-0 cursor-pointer">
                    <MoreHorizontal className="size-4 text-[#999]" />
                  </div>
                </div>
                <div className="h-px w-full bg-[#D4D4D8]" />
                <div className={`${font} flex flex-col gap-[4px] text-black w-full`}>
                  <p className="text-[16px]">{selectedAddress.phone}</p>
                  <p className="text-[14px]">{selectedAddress.fullAddress}</p>
                </div>
              </div>
            )}

            {/* Address picker — expands when "เปลี่ยน" clicked */}
            {showAddressList && (
              <div className="mt-3 flex flex-col gap-2 pt-3 border-t border-gray-100">
                {SAVED_ADDRESSES.filter((a) => a.id !== selectedAddressId).map((addr) => (
                  <button key={addr.id}
                    onClick={() => { setSelectedAddressId(addr.id); setShowAddressList(false); }}
                    className="flex items-start gap-3 p-3 rounded-[12px] border border-gray-200 hover:border-[#319754] hover:bg-[#319754]/5 cursor-pointer transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>{addr.recipient}</span>
                        <span className={`${font} text-[11px] text-gray-500`}>· {addr.phone}</span>
                        <span className={`${font} text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700`} style={{ fontWeight: 500 }}>{addr.label}</span>
                        {addr.isDefault && (
                          <span className={`${font} text-[10px] px-2 py-0.5 rounded-full bg-[#08f] text-white`} style={{ fontWeight: 500 }}>ที่อยู่หลัก</span>
                        )}
                      </div>
                      <p className={`${font} text-[12.5px] text-gray-600 leading-relaxed`}>{addr.fullAddress}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <button onClick={() => navigate("/addresses")} className={`mt-2 text-[13px] text-[#319754] ${font} cursor-pointer hover:underline`}>+ เพิ่มที่อยู่ใหม่</button>
          </section>

          {/* Tester profile (from earlier registration) */}
          <section className="bg-white rounded-[16px] p-4 sm:p-5 border border-gray-200">
            <h2 className={`${font} text-[16px] text-[#1a1a1a] inline-flex items-center gap-2 mb-3`} style={{ fontWeight: 600 }}>
              <User className="size-[18px] text-[#319754]" strokeWidth={2.4} /> โปรไฟล์ผู้ทดสอบของคุณ
            </h2>
            {testerProfile ? (
              <div className="space-y-2 text-[13px]">
                <Row label="ชื่อแสดง" value={testerProfile.displayName || "—"} />
                <Row label="อายุ" value={testerProfile.ageRange || "—"} />
                <Row label="เพศ" value={testerProfile.gender || "—"} />
                <Row label="รูปแบบการใช้ชีวิต" value={testerProfile.lifestyle.length ? testerProfile.lifestyle.join(" · ") : "—"} />
                <Row label="ปัญหาสุขภาพ" value={testerProfile.health.length ? testerProfile.health.join(" · ") : "—"} />
                <Row label="พฤติกรรมบริโภค" value={testerProfile.consumption.length ? testerProfile.consumption.join(" · ") : "—"} />
                <div className="pt-2">
                  <button onClick={() => navigate("/trials/register")} className={`${font} text-[12px] text-[#319754] hover:underline cursor-pointer`}>แก้ไขโปรไฟล์ผู้ทดสอบ</button>
                </div>
              </div>
            ) : (
              <div className={`${font} text-[13px] text-gray-500 py-4 text-center`}>
                <p className="mb-2">คุณยังไม่ได้ลงทะเบียนเป็นผู้ทดสอบ</p>
                <button onClick={() => navigate("/trials/register")} className={`${font} text-[13px] text-[#319754] hover:underline cursor-pointer`} style={{ fontWeight: 600 }}>
                  ลงทะเบียนตอนนี้ →
                </button>
              </div>
            )}
          </section>

          {/* Reason */}
          <section className="bg-white rounded-[16px] p-4 sm:p-5 border border-gray-200">
            <h2 className={`${font} text-[16px] text-[#1a1a1a] inline-flex items-center gap-2 mb-3`} style={{ fontWeight: 600 }}>
              <FileText className="size-[18px] text-[#319754]" strokeWidth={2.4} /> เหตุผลในการขอทดลองใช้
            </h2>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="เล่าให้เราฟังว่าทำไมสินค้านี้น่าสนใจสำหรับคุณ / คุณมีปัญหาอะไรที่คาดว่าผลิตภัณฑ์นี้จะช่วยได้ — อย่างน้อย 10 ตัวอักษร"
              rows={5}
              className={`${font} w-full px-4 py-3 rounded-[12px] border border-gray-200 text-[14px] text-[#1a1a1a] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 transition-all resize-none placeholder:text-gray-400 leading-relaxed`}
            />
            <p className={`${font} text-[11px] text-gray-400 mt-1.5 text-right tabular-nums`}>
              {reason.trim().length} / 10 ขั้นต่ำ
            </p>
          </section>

        </div>

        {/* ===== Right: trial summary (sticky on desktop) ===== */}
        <aside className="lg:w-[380px] w-full shrink-0">
          <div className="bg-white rounded-[16px] p-4 lg:sticky lg:top-[140px] flex flex-col gap-4 border border-gray-200">
            <p className={`${font} text-[18px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>สินค้าที่ขอเข้าร่วม</p>
            <div className="h-px w-full bg-gray-100" />

            {/* Trial product */}
            <div className="flex gap-3">
              <div className="shrink-0 size-[96px] rounded-[14px] overflow-hidden bg-gray-100 relative">
                <img src={galleryImages[0]} alt={product.name} className="w-full h-full object-cover" />
                <div className="absolute top-1.5 left-1.5">
                  <span className={`${font} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] shadow-md`}
                    style={{ background: "linear-gradient(135deg, #0088ff, #9747ff)", fontWeight: 600 }}>
                    <Sparkles className="size-2.5" strokeWidth={2.4} /> Beta
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{product.category.toUpperCase()}</p>
                <p className={`${font} text-[14px] text-[#1a1a1a] line-clamp-2 leading-snug mt-0.5`} style={{ fontWeight: 600 }}>{product.name}</p>
                <p className={`${font} text-[11.5px] text-gray-500 mt-1 line-clamp-2`}>{product.tagline}</p>
              </div>
            </div>

            <div className="h-px w-full bg-gray-100" />

            {/* Mini stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat icon={Coins} label="คะแนน" value={`+${product.rewardPoints.toLocaleString()}`} accent="#d97706" />
              <Stat icon={Clock} label="เหลือ" value={`${product.endsInDays} วัน`} accent="#6b7280" />
              <Stat icon={Users} label="ที่นั่ง" value={`${product.spotsTaken}/${product.spotsTotal}`} accent="#6b7280" />
            </div>

            <div className="h-px w-full bg-gray-100" />

            {/* Terms & conditions — must accept before submit */}
            <div>
              <p className={`${font} text-[14px] text-[#1a1a1a] inline-flex items-center gap-1.5 mb-2`} style={{ fontWeight: 600 }}>
                <ShieldCheck className="size-[15px] text-[#319754]" strokeWidth={2.4} /> ข้อกำหนดและเงื่อนไข
              </p>
              <div className="bg-gray-50 rounded-[10px] p-3 text-[11.5px] text-gray-700 leading-relaxed space-y-1 mb-2.5 max-h-[120px] overflow-y-auto">
                <p>1. ผู้ขอทดสอบต้องเป็นบุคคลที่มีอายุ 15 ปีขึ้นไป และมีที่อยู่จัดส่งภายในประเทศไทย</p>
                <p>2. METAHERB จะคัดเลือกผู้ทดสอบจากใบสมัครและติดต่อกลับภายใน 2 วันทำการ — การส่งใบสมัครไม่ได้ยืนยันสิทธิ์การได้รับสินค้า</p>
                <p>3. ผู้ทดสอบที่ได้รับเลือก ต้องส่งแบบประเมินผลภายใน 30 วันหลังได้รับสินค้า เพื่อรับ +{product.rewardPoints.toLocaleString()} คะแนนสะสม</p>
                <p>4. สามารถขอเข้าร่วมทดสอบได้ครั้งละ 1 รายการ — รายการถัดไปสมัครได้หลังส่งแบบประเมินครบ</p>
                <p>5. ข้อมูลส่วนตัวจะถูกใช้เพื่อการจัดส่งและสื่อสารเกี่ยวกับการทดสอบเท่านั้น ตามนโยบายความเป็นส่วนตัวของ METAHERB</p>
                <p>6. ผู้ทดสอบยินยอมให้ใช้ความคิดเห็น/ผลการประเมินเพื่อพัฒนาผลิตภัณฑ์ โดยอาจอ้างอิงในรูปแบบที่ไม่ระบุตัวตน</p>
              </div>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="size-[16px] mt-0.5 rounded border-gray-300 text-[#319754] focus:ring-[#319754] cursor-pointer accent-[#319754] shrink-0" />
                <span className={`${font} text-[12px] text-[#1a1a1a] leading-relaxed`}>
                  ฉันได้อ่านและยอมรับ <span className="text-[#319754]" style={{ fontWeight: 600 }}>ข้อกำหนดและเงื่อนไข</span> การเข้าร่วมทดสอบ
                </span>
              </label>
            </div>

            <div className="h-px w-full bg-gray-100" />

            {/* Lock warning */}
            {activeOther && (
              <div className="rounded-[12px] p-3 text-[12px] leading-relaxed border border-amber-200"
                style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)", color: "#92400e" }}>
                คุณมีสินค้าทดลองค้างอยู่ — ส่งแบบประเมินครบก่อนจึงจะสมัครใหม่ได้
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={`${font} w-full h-[48px] rounded-full text-white text-[14px] transition-all flex items-center justify-center gap-2 ${
                canSubmit
                  ? "cursor-pointer shadow-[0_8px_20px_-4px_rgba(49,151,84,0.4)] hover:shadow-[0_12px_28px_-4px_rgba(49,151,84,0.5)]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              style={canSubmit ? { background: "linear-gradient(135deg, #319754, #46c474)", fontWeight: 600 } : { fontWeight: 600 }}
            >
              <Check className="size-4" strokeWidth={2.6} /> ส่งคำขอเข้าร่วมทดสอบ
            </button>
            <p className={`${font} text-[11px] text-gray-400 text-center leading-relaxed`}>
              เมื่อกดส่งคำขอ ทีมงานจะตรวจสอบและติดต่อกลับภายใน 2 วันทำการ
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className={`${font} text-[12.5px] text-gray-500 w-[120px] shrink-0`}>{label}</span>
      <span className={`${font} text-[13px] text-[#1a1a1a] flex-1`}>{value}</span>
    </div>
  );
}

function Stat({ icon: Icon, label, value, accent }: { icon: any; label: string; value: string; accent: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Icon className="size-[16px]" style={{ color: accent }} strokeWidth={2.4} />
      <p className={`${font} text-[10px] text-gray-500`}>{label}</p>
      <p className={`${font} text-[13px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}>{value}</p>
    </div>
  );
}
