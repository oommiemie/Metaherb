import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, MapPin, User, Briefcase, MessageSquare, Truck, FileText, Beaker, Package, Clock, ShieldCheck, BadgeCheck, Check, Phone, Mail, Building2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../store/AuthContext";
import { toast } from "sonner";
import { MATERIALS, GRADE_STYLE } from "../data/herbalMaterials";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const PURPOSES = [
  { id: "rd",       emoji: "🧪", label: "R&D / สูตรใหม่",          desc: "ทดสอบสูตร / ปรับปรุงผลิตภัณฑ์" },
  { id: "qc",       emoji: "🔬", label: "QC / ทดสอบคุณภาพ",       desc: "Lab test / QA / QC" },
  { id: "compare",  emoji: "⚖️", label: "เปรียบเทียบ Supplier",  desc: "เทียบคุณภาพ/ราคา หลายเจ้า" },
  { id: "test",     emoji: "📦", label: "ทดลองตลาด",             desc: "ทดสอบรับฟีดแบ็คจากลูกค้า" },
];

const SAMPLE_SIZES = [50, 100, 250, 500];

const BIZ_TYPES = [
  "โรงงานผลิต",
  "ส่งออก / นำเข้า",
  "ร้านชา / คาเฟ่",
  "เครื่องสำอาง / สปา",
  "อาหารเสริม",
  "เภสัชกรรม",
  "อื่นๆ",
];

export default function HerbalMarketSamplePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const material = MATERIALS.find((m) => m.id === id);

  // Form state
  const [contactName, setContactName] = useState(user?.username || "");
  const [companyName, setCompanyName] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("");
  const [province, setProvince] = useState("");
  const [postcode, setPostcode] = useState("");
  const [shippingNote, setShippingNote] = useState("");

  const [bizType, setBizType] = useState("");
  const [purpose, setPurpose] = useState("rd");
  const [estimatedVolume, setEstimatedVolume] = useState<number | "">("");
  const [timeline, setTimeline] = useState("1-3-months");
  const [note, setNote] = useState("");

  if (!material) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-center">
        <Beaker className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบวัตถุดิบรายการนี้</p>
        <button onClick={() => navigate("/market")}
          className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          กลับสู่ตลาดวัตถุดิบ
        </button>
      </div>
    );
  }

  const [sampleSize, setSampleSize] = useState(100);
  const SAMPLE_FEE = 0;
  const SHIPPING_FEE = sampleSize <= 100 ? 80 : sampleSize <= 250 ? 120 : 180;
  const TOTAL = SAMPLE_FEE + SHIPPING_FEE;

  const gradeStyle = GRADE_STYLE[material.grade];

  const handleSubmit = () => {
    // Basic validation
    if (!contactName.trim()) return toast.error("กรุณากรอกชื่อผู้ติดต่อ");
    if (!phone.trim() || !email.trim()) return toast.error("กรุณากรอกเบอร์โทรและอีเมล");
    if (!address.trim() || !province.trim() || !postcode.trim()) return toast.error("กรุณากรอกที่อยู่จัดส่ง");
    if (!bizType) return toast.error("กรุณาเลือกประเภทธุรกิจ");

    toast.success(`ส่งคำขอตัวอย่าง "${material.name}" เรียบร้อย`, {
      description: `Supplier จะติดต่อกลับภายใน 24 ชม. — ติดตามสถานะได้ที่หน้า "คำขอตัวอย่าง"`,
    });
    setTimeout(() => navigate(`/market/${material.id}`), 1200);
  };

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center gap-2">
          <h1 className={`${font} text-[24px] md:text-[28px] text-[#319754]`} style={{ fontWeight: 600 }}>
            ขอตัวอย่างวัตถุดิบ
          </h1>
          <p className={`${font} text-[13px] text-gray-600 max-w-[600px]`}>
            กรอกข้อมูลเพื่อให้ Supplier จัดส่งตัวอย่างให้คุณ — รับตัวอย่างเล็กก่อนตัดสินใจสั่งจริง
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        {/* LEFT — Forms */}
        <div className="flex-1 space-y-5">
          {/* Back link */}
          <button onClick={() => navigate(`/market/${material.id}`)}
            className={`${font} inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#319754] transition-colors cursor-pointer`}>
            <ChevronLeft className="size-3.5" strokeWidth={2.4} />
            กลับสู่รายละเอียดวัตถุดิบ
          </button>

          {/* Contact Info card */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <User className="size-5 text-[#319754]" strokeWidth={2.2} />
              ข้อมูลผู้ติดต่อ
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>Supplier จะใช้ข้อมูลนี้ในการติดต่อกลับ</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextField label="ชื่อ-นามสกุล" required value={contactName} onChange={setContactName} placeholder="ชื่อจริง" />
              <TextField label="ชื่อบริษัท / ร้าน" value={companyName} onChange={setCompanyName} placeholder="ชื่อนิติบุคคล (ถ้ามี)" />
              <TextField label="ตำแหน่ง" value={position} onChange={setPosition} placeholder="เช่น เจ้าของกิจการ / ฝ่ายจัดซื้อ" />
              <TextField label="เบอร์โทร" required value={phone} onChange={setPhone} placeholder="0XX-XXX-XXXX" icon={Phone} />
              <div className="md:col-span-2">
                <TextField label="อีเมล" required value={email} onChange={setEmail} placeholder="email@company.com" icon={Mail} type="email" />
              </div>
            </div>
          </div>

          {/* Shipping Address card */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <MapPin className="size-5 text-[#319754]" strokeWidth={2.2} />
              ที่อยู่จัดส่งตัวอย่าง
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>ระบุที่อยู่ที่ Supplier จะส่งตัวอย่างไป</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <TextField label="ที่อยู่ (เลขที่ / ซอย / ถนน)" required value={address} onChange={setAddress} placeholder="เช่น 123 ถ.สุขุมวิท 45" />
              </div>
              <TextField label="ตำบล / แขวง" value={district} onChange={setDistrict} placeholder="" />
              <TextField label="จังหวัด" required value={province} onChange={setProvince} placeholder="" />
              <TextField label="รหัสไปรษณีย์" required value={postcode} onChange={setPostcode} placeholder="5 หลัก" />
              <div className="md:col-span-2">
                <TextField label="หมายเหตุการจัดส่ง" value={shippingNote} onChange={setShippingNote} placeholder="เช่น ส่งวันธรรมดา 9-17 น." />
              </div>
            </div>
          </div>

          {/* Purpose & Business card */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Briefcase className="size-5 text-[#319754]" strokeWidth={2.2} />
              วัตถุประสงค์การใช้งาน
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>ช่วย Supplier เตรียมตัวอย่างที่ตรงตามความต้องการ</p>

            {/* Business type */}
            <div className="mb-4">
              <label className={`${font} text-[12px] text-gray-600 block mb-2`}>ประเภทธุรกิจ <span className="text-[#ff3b30]">*</span></label>
              <div className="flex flex-wrap gap-2">
                {BIZ_TYPES.map((b) => {
                  const active = bizType === b;
                  return (
                    <button key={b} type="button" onClick={() => setBizType(b)}
                      className={`${font} text-[12px] px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                        active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`} style={{ fontWeight: 500 }}>
                      {b}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Purpose */}
            <div className="mb-4">
              <label className={`${font} text-[12px] text-gray-600 block mb-2`}>วัตถุประสงค์</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PURPOSES.map((p) => {
                  const active = purpose === p.id;
                  return (
                    <button key={p.id} type="button" onClick={() => setPurpose(p.id)} title={p.desc}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                        active ? "border-[#319754] bg-[#319754]/5" : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <span className="text-[20px] leading-none">{p.emoji}</span>
                      <span className={`${font} text-[12px] text-black leading-tight`} style={{ fontWeight: active ? 600 : 500 }}>{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sample size */}
            <div className="mb-4">
              <label className={`${font} text-[12px] text-gray-600 block mb-2`}>ขนาดตัวอย่างที่ต้องการ</label>
              <div className="flex gap-2 flex-wrap">
                {SAMPLE_SIZES.map((sz) => {
                  const active = sampleSize === sz;
                  return (
                    <button key={sz} type="button" onClick={() => setSampleSize(sz)}
                      className={`${font} flex-1 min-w-[70px] h-10 px-3 rounded-full text-[13px] border-2 cursor-pointer transition-all ${
                        active ? "bg-[#319754] text-white border-[#319754]" : "bg-white text-gray-700 border-gray-200 hover:border-[#319754]"
                      }`} style={{ fontWeight: 600 }}>
                      {sz} g
                    </button>
                  );
                })}
              </div>
              <p className={`${font} text-[11px] text-gray-400 mt-1.5`}>ค่าจัดส่งจะปรับตามขนาด ({sampleSize} g = ฿{SHIPPING_FEE})</p>
            </div>

            {/* Volume + timeline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className={`${font} text-[12px] text-gray-600`}>ปริมาณคาดว่าจะสั่งจริง (กก./เดือน)</label>
                <input type="number" value={estimatedVolume}
                  onChange={(e) => setEstimatedVolume(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="เช่น 100"
                  className={`${font} h-10 px-3 rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
              </div>
              <div className="flex flex-col gap-1">
                <label className={`${font} text-[12px] text-gray-600`}>คาดว่าจะสั่ง bulk เมื่อใด</label>
                <select value={timeline} onChange={(e) => setTimeline(e.target.value)}
                  className={`${font} h-10 px-3 rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white cursor-pointer transition-all`}>
                  <option value="immediate">ทันที (ภายใน 1 เดือน)</option>
                  <option value="1-3-months">1-3 เดือน</option>
                  <option value="3-6-months">3-6 เดือน</option>
                  <option value="6-months-plus">6 เดือนขึ้นไป</option>
                  <option value="undecided">ยังไม่แน่ใจ</option>
                </select>
              </div>
            </div>
          </div>

          {/* Note to supplier */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <MessageSquare className="size-5 text-[#319754]" strokeWidth={2.2} />
              ข้อความถึง Supplier
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-3`}>คำขอเฉพาะ เช่น สเปคการบด ขนาดแพ็ค หรือคำถามอื่นๆ</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ขอตัวอย่างแบบบดละเอียด 80 mesh / มี Certificate of Analysis แนบ"
              rows={4}
              className={`${font} w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] resize-none outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
          </div>
        </div>

        {/* RIGHT — Summary (sticky) */}
        <div className="lg:w-[400px]">
          <div className="bg-white rounded-[16px] p-4 sticky top-[140px] flex flex-col gap-4 border border-gray-200">
            <p className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>สรุปคำขอตัวอย่าง</p>
            <div className="h-px w-full bg-gray-200" />

            {/* Material info */}
            <div className="flex gap-3">
              <div className="shrink-0 size-[80px] rounded-[12px] overflow-hidden bg-gray-100 relative">
                <ImageWithFallback src={material.image} alt={material.name} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1">
                  <span className={`${font} text-[9px] px-1.5 py-0.5 rounded-full`}
                    style={{ background: gradeStyle.bg, color: gradeStyle.color, fontWeight: 700, boxShadow: gradeStyle.shadow, textShadow: gradeStyle.textShadow, letterSpacing: "0.02em" }}>
                    {material.grade}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{material.name}</p>
                <p className={`${font} text-[11px] text-gray-500 italic truncate`}>{material.scientificName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Building2 className="size-3 text-gray-400" strokeWidth={2.2} />
                  <span className={`${font} text-[11px] text-gray-600 truncate`}>{material.supplier}</span>
                  {material.supplierVerified && <BadgeCheck className="size-3 text-[#319754] shrink-0" fill="#319754" stroke="#fff" strokeWidth={2.5} />}
                </div>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200" />

            {/* What's included */}
            <div className="flex flex-col gap-2">
              <p className={`${font} text-[12px] text-gray-600`} style={{ fontWeight: 600 }}>ตัวอย่างประกอบด้วย</p>
              {[
                { Icon: Package,     label: `วัตถุดิบ ${sampleSize} กรัม`,                sub: "แพ็คสุญญากาศ" },
                { Icon: FileText,    label: "Certificate of Analysis",      sub: "เลข lot + ผล lab" },
                { Icon: ShieldCheck, label: "ใบรับรองคุณภาพ",                   sub: `${material.certifications.slice(0, 2).join(" / ")}` },
              ].map((it) => (
                <div key={it.label} className="flex items-start gap-2.5">
                  <div className="size-7 rounded-lg bg-[#319754]/10 flex items-center justify-center shrink-0">
                    <it.Icon className="size-3.5 text-[#319754]" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>{it.label}</p>
                    <p className={`${font} text-[10px] text-gray-500`}>{it.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-gray-200" />

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 px-1">
              <div className="flex justify-between">
                <span className={`${font} text-[13px] text-gray-600`}>ค่าตัวอย่าง</span>
                <span className={`${font} text-[13px] text-[#319754]`} style={{ fontWeight: 600 }}>{SAMPLE_FEE === 0 ? "ฟรี" : `฿${SAMPLE_FEE}`}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${font} text-[13px] text-gray-600 inline-flex items-center gap-1.5`}>
                  <Truck className="size-3 text-gray-400" strokeWidth={2.2} />
                  ค่าจัดส่ง
                </span>
                <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>฿{SHIPPING_FEE}</span>
              </div>
              <div className="h-px w-full bg-gray-100 my-1" />
              <div className="flex justify-between items-center">
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>รวมทั้งสิ้น</span>
                <span className={`${font} text-[20px] text-[#319754]`} style={{ fontWeight: 700 }}>฿{TOTAL.toLocaleString()}</span>
              </div>
            </div>

            {/* ETA */}
            <div className="bg-[#319754]/5 rounded-xl p-3 flex items-start gap-2">
              <Clock className="size-3.5 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.2} />
              <div>
                <p className={`${font} text-[12px] text-[#287745]`} style={{ fontWeight: 600 }}>ระยะเวลาจัดส่ง</p>
                <p className={`${font} text-[11px] text-gray-600`}>Supplier จะตอบกลับใน 24 ชม. และจัดส่งภายใน 3-5 วันทำการ</p>
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit}
              className={`${font} w-full h-[48px] rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
              style={{ fontWeight: 600 }}>
              <Check className="size-4" strokeWidth={2.4} />
              ยืนยันส่งคำขอตัวอย่าง
            </button>
            <p className={`${font} text-[10px] text-gray-400 text-center -mt-2`}>
              กดยืนยัน = ยอมรับข้อตกลงการขอตัวอย่าง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Small helper ---- */
function TextField({ label, value, onChange, placeholder, required, icon: Icon, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: any;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${font} text-[12px] text-gray-600`}>
        {label}{required && <span className="text-[#ff3b30] ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />
        )}
        <input type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${font} h-10 ${Icon ? "pl-10" : "pl-3"} pr-3 w-full rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
      </div>
    </div>
  );
}
