import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, ChevronDown, Building2, User, MapPin, ShieldCheck, Wallet, Check, Upload, Phone, Mail, Globe, MessageCircle, Image as ImageIcon, FileText, BadgeCheck, AlertCircle, CheckCircle2, Sparkles, X, ClipboardCheck, Sprout, FlaskConical, Sun, Truck, Factory, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../store/AuthContext";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const STEPS = [
  { id: 1, title: "ข้อมูลธุรกิจ",          short: "ธุรกิจ",       Icon: Building2 },
  { id: 2, title: "ผู้ติดต่อหลัก",          short: "ติดต่อ",        Icon: User },
  { id: 3, title: "ที่ตั้ง / แหล่งผลิต",   short: "ที่ตั้ง",        Icon: MapPin },
  { id: 4, title: "ใบรับรอง & เอกสาร",   short: "เอกสาร",       Icon: ShieldCheck },
  { id: 5, title: "การค้า & การเงิน",     short: "การค้า",        Icon: Wallet },
];

const BUSINESS_TYPES = [
  { id: "farmer",     Icon: Sprout,        label: "เกษตรกร / ฟาร์ม",     desc: "ปลูกและขายวัตถุดิบเอง" },
  { id: "extract",    Icon: FlaskConical,  label: "โรงสกัด",              desc: "สกัด/Functional ingredient" },
  { id: "dry",        Icon: Sun,           label: "โรงอบ / แปรรูป",       desc: "อบแห้ง บด คั่ว" },
  { id: "wholesaler", Icon: Truck,         label: "พ่อค้าส่ง / Trader",  desc: "รวบรวม/จัดจำหน่าย" },
  { id: "oem",        Icon: Factory,       label: "OEM",                  desc: "รับจ้างผลิต / Contract" },
  { id: "other",      Icon: MoreHorizontal,label: "อื่นๆ",                desc: "สหกรณ์ / วิสาหกิจชุมชน" },
];

const CERT_OPTIONS = [
  { id: "fda",       label: "อย. (FDA)",           desc: "บังคับสำหรับวัตถุดิบบริโภค", required: true },
  { id: "gap",       label: "GAP",                 desc: "Good Agricultural Practices (ฟาร์ม)" },
  { id: "gmp",       label: "GMP",                 desc: "Good Manufacturing Practice (โรงงาน)" },
  { id: "organic-th",label: "Organic Thailand",    desc: "มาตรฐานเกษตรอินทรีย์ไทย" },
  { id: "ecocert",   label: "ECOCERT",             desc: "มาตรฐานอินทรีย์สากล" },
  { id: "usda",      label: "USDA Organic",        desc: "USA Organic" },
  { id: "eu-organic",label: "EU Organic",          desc: "EU Organic" },
  { id: "haccp",     label: "HACCP",               desc: "มาตรฐานความปลอดภัยอาหาร" },
  { id: "iso-22000", label: "ISO 22000",           desc: "Food Safety Management" },
  { id: "iso-9001",  label: "ISO 9001",            desc: "Quality Management" },
  { id: "halal",     label: "Halal",               desc: "" },
  { id: "kosher",    label: "Kosher",              desc: "" },
];

const CATEGORIES = ["ราก/หัว", "ใบ", "ดอก", "เปลือก", "ผล/เมล็ด", "สมุนไพรรวม", "น้ำมันสกัด", "สารสกัดเข้มข้น"];
const DELIVERY_AREAS = ["ทั่วประเทศไทย", "เฉพาะภาคเหนือ", "เฉพาะภาคกลาง", "เฉพาะภาคใต้", "เฉพาะภาคอีสาน", "ส่งออกต่างประเทศ"];
const PAYMENT_TERMS = ["ชำระเต็มจำนวน", "มัดจำ 50% + 50%", "เครดิต 30 วัน", "เครดิต 60 วัน", "เครดิต 90 วัน"];
const LANGUAGES = ["ไทย", "อังกฤษ", "จีน", "ญี่ปุ่น"];

export default function SupplierRegisterPage() {
  const navigate = useNavigate();
  const { user, setSupplierStatus } = useAuth();

  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Step 1 — Business
  // Pre-fill company/brand from the shopName collected at owner-register time so
  // a shop that's already registered doesn't have to retype the same name.
  const [businessType, setBusinessType] = useState("");
  const [companyName, setCompanyName] = useState(user?.shopName || "");
  const [brandName, setBrandName] = useState(user?.shopName || "");
  const [registrationNo, setRegistrationNo] = useState("");
  const [taxId, setTaxId] = useState("");
  const [foundedYear, setFoundedYear] = useState("");
  const [employees, setEmployees] = useState("");
  const [description, setDescription] = useState("");
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [bannerUploaded, setBannerUploaded] = useState(false);

  // Step 2 — Contact
  const [contactName, setContactName] = useState(user?.username || "");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [email, setEmail] = useState(user?.email || "");
  const [emailVerified, setEmailVerified] = useState(false);
  const [website, setWebsite] = useState("");
  const [lineId, setLineId] = useState("");
  const [languages, setLanguages] = useState<string[]>(["ไทย"]);

  // Step 3 — Location
  const [regAddress, setRegAddress] = useState("");
  const [regProvince, setRegProvince] = useState("");
  const [regPostcode, setRegPostcode] = useState("");
  const [sameAsReg, setSameAsReg] = useState(true);
  const [farmAddress, setFarmAddress] = useState("");
  const [farmProvince, setFarmProvince] = useState("");
  const [farmPostcode, setFarmPostcode] = useState("");
  const [gpsLat, setGpsLat] = useState("");
  const [gpsLng, setGpsLng] = useState("");
  const [farmPhotos, setFarmPhotos] = useState<string[]>([]);

  // Step 4 — Documents
  const [docCompanyReg, setDocCompanyReg] = useState(false);
  const [docVat, setDocVat] = useState(false);
  const [docIdCard, setDocIdCard] = useState(false);
  const [docFarmCert, setDocFarmCert] = useState(false);
  const [certs, setCerts] = useState<Record<string, { enabled: boolean; certNo: string; expiry: string; uploaded: boolean }>>({});

  // Step 5 — Trade & Finance
  const [categories, setCategories] = useState<string[]>([]);
  const [capacity, setCapacity] = useState("");
  const [moq, setMoq] = useState("");
  const [deliveryAreas, setDeliveryAreas] = useState<string[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState<string[]>([]);
  const [bankName, setBankName] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [acceptPolicy, setAcceptPolicy] = useState(false);

  const toggleArr = (arr: string[], setter: (v: string[]) => void, value: string) =>
    setter(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);

  const toggleCert = (id: string) => {
    setCerts((c) => ({
      ...c,
      [id]: c[id]?.enabled
        ? { ...c[id], enabled: false }
        : { enabled: true, certNo: c[id]?.certNo || "", expiry: c[id]?.expiry || "", uploaded: c[id]?.uploaded || false },
    }));
  };

  const updateCert = (id: string, field: "certNo" | "expiry" | "uploaded", value: string | boolean) => {
    setCerts((c) => ({ ...c, [id]: { ...c[id], [field]: value } }));
  };

  // Validation disabled — UI preview mode
  const validateStep = (): boolean => true;

  const handleNext = () => {
    if (!validateStep()) return;
    if (step < 5) { setStep(step + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else {
      setSubmitted(true);
      setSupplierStatus(true);  // unlock supplier-only tabs in owner dashboard
      toast.success("ส่งใบสมัคร Supplier เรียบร้อย — ทีมงานจะตรวจสอบภายใน 3 วันทำการ");
    }
  };

  const handleBack = () => {
    if (step > 1) { setStep(step - 1); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else { navigate("/market"); }
  };

  // Success / Submitted screen
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px]">
        <div className="max-w-[560px] w-full text-center">
          <div className="size-20 rounded-full bg-[#319754]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="size-10 text-[#319754]" strokeWidth={2.2} />
          </div>
          <h1 className={`${font} text-[24px] text-[#319754] mb-2`} style={{ fontWeight: 600 }}>
            ส่งใบสมัครเรียบร้อย!
          </h1>
          <p className={`${font} text-[14px] text-gray-600 mb-6 leading-relaxed`}>
            ทีมงานจะตรวจสอบเอกสารและใบรับรองของคุณภายใน <span className="text-black" style={{ fontWeight: 600 }}>3 วันทำการ</span> —
            ผลการอนุมัติจะแจ้งผ่านอีเมลและในแอป
          </p>
          <div className="bg-[#fafaf7] rounded-xl p-4 mb-6 text-left">
            <p className={`${font} text-[12px] text-gray-500 mb-2`} style={{ fontWeight: 600 }}>ขั้นถัดไป</p>
            <ul className={`${font} text-[13px] text-gray-700 space-y-1.5`}>
              <li className="flex items-start gap-2"><Check className="size-3.5 text-[#319754] mt-1 shrink-0" strokeWidth={2.4} /> เตรียมสินค้าตัวอย่าง 3-5 รายการสำหรับการตรวจสอบ</li>
              <li className="flex items-start gap-2"><Check className="size-3.5 text-[#319754] mt-1 shrink-0" strokeWidth={2.4} /> ทีมงานอาจติดต่อขอข้อมูลเพิ่มเติมผ่านเบอร์โทร/อีเมลที่ให้ไว้</li>
              <li className="flex items-start gap-2"><Check className="size-3.5 text-[#319754] mt-1 shrink-0" strokeWidth={2.4} /> หลังผ่านการอนุมัติ คุณจะได้ Badge "Verified Supplier" บนหน้าร้าน</li>
            </ul>
          </div>
          <div className="flex justify-center">
            <button onClick={() => navigate("/owner")}
              className={`${font} h-11 px-6 rounded-full bg-[#319754] text-white text-[13px] cursor-pointer hover:bg-[#287745] inline-flex items-center gap-2`}
              style={{ fontWeight: 600 }}>
              ไปที่ร้านค้าของฉัน
              <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentStep = STEPS[step - 1];

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 relative">
        {/* Back to dashboard — top-left, doesn't affect step navigation */}
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-12 flex justify-start mb-3">
          <button onClick={() => navigate(-1)}
            className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-white hover:bg-gray-50 px-4 py-1.5 rounded-full cursor-pointer transition-colors shadow-[0_1px_4px_rgba(0,0,0,0.06)]`}
            style={{ fontWeight: 500 }}>
            <ChevronLeft className="size-3.5" strokeWidth={2.5} />
            กลับ
          </button>
        </div>
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center gap-2">
          <h1 className={`${font} text-[24px] md:text-[28px] text-[#319754]`} style={{ fontWeight: 600 }}>
            ลงทะเบียนเป็น Supplier
          </h1>
          <p className={`${font} text-[13px] text-gray-600 max-w-[600px]`}>
            เกษตรกร · โรงสกัด · โรงอบ · OEM — ลงทะเบียนฟรี เริ่มขายภายใน 24 ชม.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 sticky top-[64px] md:top-[116px] z-20">
        <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((s, i) => {
              const active = step === s.id;
              const done = step > s.id;
              return (
                <div key={s.id} className="flex-1 flex items-center gap-2">
                  <button onClick={() => setStep(s.id)}
                    className={`shrink-0 size-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      done ? "bg-[#319754] text-white hover:opacity-90"
                           : active ? "bg-[#319754] text-white ring-4 ring-[#319754]/20"
                                    : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    }`}>
                    {done ? <Check className="size-4" strokeWidth={2.6} /> : <s.Icon className="size-4" strokeWidth={2.2} />}
                  </button>
                  <div className="hidden sm:flex flex-col min-w-0">
                    <span className={`${font} text-[10px] text-gray-400`} style={{ fontWeight: 500 }}>ขั้นที่ {s.id}</span>
                    <span className={`${font} text-[12px] truncate ${active || done ? "text-[#319754]" : "text-gray-500"}`} style={{ fontWeight: active ? 600 : 500 }}>{s.short}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`hidden md:block flex-1 h-px ${done ? "bg-[#319754]" : "bg-gray-200"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
        {/* Step title card */}
        <div className="mb-4 flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-[#319754]/10 flex items-center justify-center">
            <currentStep.Icon className="size-5 text-[#319754]" strokeWidth={2.2} />
          </div>
          <div>
            <p className={`${font} text-[11px] text-gray-400`} style={{ fontWeight: 500 }}>ขั้นที่ {step} จาก 5</p>
            <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 600 }}>{currentStep.title}</h2>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-8 space-y-6">
          {step === 1 && (
            <>
              {/* Business type */}
              <div>
                <Label required>ประเภทธุรกิจ</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {BUSINESS_TYPES.map((b) => {
                    const active = businessType === b.id;
                    return (
                      <button key={b.id} type="button" onClick={() => setBusinessType(b.id)}
                        className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all cursor-pointer ${
                          active ? "border-[#319754] bg-[#319754]/5" : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <div className={`size-10 rounded-xl flex items-center justify-center ${active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-500"}`}>
                          <b.Icon className="size-5" strokeWidth={2.2} />
                        </div>
                        <span className={`${font} text-[13px] text-black leading-tight`} style={{ fontWeight: active ? 600 : 500 }}>{b.label}</span>
                        <span className={`${font} text-[10px] text-gray-500 leading-tight`}>{b.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField label="ชื่อกิจการ / นิติบุคคล" required value={companyName} onChange={setCompanyName} placeholder="เช่น บริษัท เมต้าเฮิร์บ จำกัด" />
                <TextField label="ชื่อแบรนด์ที่แสดงบนแพลตฟอร์ม" required value={brandName} onChange={setBrandName} placeholder="เช่น Metaherb Farm" />
                <TextField label="เลขทะเบียน / ภ.พ.20" value={registrationNo} onChange={setRegistrationNo} placeholder="0XXXXXXXXXXXX (ถ้ามี)" />
                <TextField label="เลขผู้เสียภาษี" value={taxId} onChange={setTaxId} placeholder="13 หลัก" />
                <TextField label="ปีที่ก่อตั้ง" value={foundedYear} onChange={setFoundedYear} placeholder="เช่น 2562" />
                <div className="flex flex-col gap-2">
                  <Label>จำนวนพนักงาน</Label>
                  <div className="relative">
                    <select value={employees} onChange={(e) => setEmployees(e.target.value)}
                      className={`${font} bg-[#fafafa] h-12 pl-6 pr-12 w-full rounded-full text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow cursor-pointer appearance-none`}>
                      <option value="">เลือก</option>
                      <option value="1-5">1-5 คน</option>
                      <option value="6-20">6-20 คน</option>
                      <option value="21-50">21-50 คน</option>
                      <option value="51-100">51-100 คน</option>
                      <option value="100+">100+ คน</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label required>คำบรรยายธุรกิจ <span className="text-gray-400 ml-1 text-[11px]">({description.length}/500 ตัวอักษร)</span></Label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value.slice(0, 500))} rows={4}
                  placeholder="เล่าเรื่องราวธุรกิจของคุณ — แหล่งที่มาวัตถุดิบ ความเชี่ยวชาญ จุดเด่น..."
                  className={`${font} bg-[#fafafa] w-full px-6 py-3 rounded-2xl text-[14px] resize-none outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <UploadBox label="โลโก้แบรนด์" hint="PNG/JPG ขนาด ≥ 500×500" uploaded={logoUploaded} onToggle={() => setLogoUploaded(!logoUploaded)} />
                <UploadBox label="แบนเนอร์หน้าร้าน" hint="JPG ขนาด ≥ 1920×600" uploaded={bannerUploaded} onToggle={() => setBannerUploaded(!bannerUploaded)} />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField label="ชื่อ-นามสกุล" required value={contactName} onChange={setContactName} placeholder="ผู้ติดต่อหลัก" icon={User} />
                <TextField label="ตำแหน่ง" required value={position} onChange={setPosition} placeholder="เช่น เจ้าของกิจการ / ผู้จัดการฝ่ายขาย" />
              </div>

              {/* Phone with OTP */}
              <div className="bg-[#fafaf7] rounded-xl p-4 space-y-2">
                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                  <div className="flex-1">
                    <TextField label="เบอร์โทรศัพท์" required value={phone} onChange={(v) => { setPhone(v); setPhoneVerified(false); }} placeholder="0XX-XXX-XXXX" icon={Phone} />
                  </div>
                  <button type="button"
                    onClick={() => {
                      if (!phone.trim()) return toast.error("กรุณากรอกเบอร์โทรก่อน");
                      toast.success(`ส่งรหัส OTP ไปที่ ${phone}`);
                      setTimeout(() => { setPhoneVerified(true); toast.success("ยืนยันเบอร์โทรเรียบร้อย"); }, 1200);
                    }}
                    disabled={phoneVerified}
                    className={`${font} h-10 px-5 rounded-full text-[12px] cursor-pointer transition-all shrink-0 inline-flex items-center gap-1.5 ${
                      phoneVerified ? "bg-[#319754]/10 text-[#319754] cursor-default" : "bg-[#319754] text-white hover:bg-[#287745]"
                    }`} style={{ fontWeight: 600 }}>
                    {phoneVerified ? (<><BadgeCheck className="size-3.5" strokeWidth={2.4} /> ยืนยันแล้ว</>) : "ส่ง OTP"}
                  </button>
                </div>
              </div>

              {/* Email with verify */}
              <div className="bg-[#fafaf7] rounded-xl p-4 space-y-2">
                <div className="flex flex-col md:flex-row gap-3 md:items-end">
                  <div className="flex-1">
                    <TextField label="อีเมล" required value={email} onChange={(v) => { setEmail(v); setEmailVerified(false); }} placeholder="email@company.com" icon={Mail} type="email" />
                  </div>
                  <button type="button"
                    onClick={() => {
                      if (!email.trim()) return toast.error("กรุณากรอกอีเมลก่อน");
                      toast.success(`ส่งลิงก์ยืนยันไปที่ ${email}`);
                      setTimeout(() => { setEmailVerified(true); toast.success("ยืนยันอีเมลเรียบร้อย"); }, 1200);
                    }}
                    disabled={emailVerified}
                    className={`${font} h-10 px-5 rounded-full text-[12px] cursor-pointer transition-all shrink-0 inline-flex items-center gap-1.5 ${
                      emailVerified ? "bg-[#319754]/10 text-[#319754] cursor-default" : "bg-[#319754] text-white hover:bg-[#287745]"
                    }`} style={{ fontWeight: 600 }}>
                    {emailVerified ? (<><BadgeCheck className="size-3.5" strokeWidth={2.4} /> ยืนยันแล้ว</>) : "ส่งลิงก์ยืนยัน"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField label="เว็บไซต์" value={website} onChange={setWebsite} placeholder="https://..." icon={Globe} />
                <TextField label="LINE Official ID" value={lineId} onChange={setLineId} placeholder="@yourshop" icon={MessageCircle} />
              </div>

              <div>
                <Label required>ภาษาที่ติดต่อได้</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {LANGUAGES.map((l) => {
                    const active = languages.includes(l);
                    return (
                      <button key={l} type="button" onClick={() => toggleArr(languages, setLanguages, l)}
                        className={`${font} text-[12px] px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                          active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`} style={{ fontWeight: 500 }}>
                        {l}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              {/* Registered address */}
              <div>
                <Label required>ที่อยู่จดทะเบียน <span className="text-gray-400 ml-1 text-[11px]">(สำหรับใบกำกับภาษี)</span></Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  <div className="md:col-span-2">
                    <TextField label="ที่อยู่" required value={regAddress} onChange={setRegAddress} placeholder="เลขที่ / ซอย / ถนน / ตำบล / อำเภอ" />
                  </div>
                  <TextField label="จังหวัด" required value={regProvince} onChange={setRegProvince} placeholder="" />
                  <TextField label="รหัสไปรษณีย์" required value={regPostcode} onChange={setRegPostcode} placeholder="5 หลัก" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={sameAsReg} onChange={(e) => setSameAsReg(e.target.checked)}
                  className="size-4 accent-[#319754] cursor-pointer" />
                <span className={`${font} text-[13px] text-gray-700`}>ที่อยู่ฟาร์ม/โรงงานเหมือนกับที่อยู่จดทะเบียน</span>
              </label>

              {!sameAsReg && (
                <div>
                  <Label required>ที่อยู่ฟาร์ม / โรงงาน <span className="text-gray-400 ml-1 text-[11px]">(สถานที่ผลิตจริง)</span></Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    <div className="md:col-span-2">
                      <TextField label="ที่อยู่" required value={farmAddress} onChange={setFarmAddress} placeholder="" />
                    </div>
                    <TextField label="จังหวัด" required value={farmProvince} onChange={setFarmProvince} placeholder="" />
                    <TextField label="รหัสไปรษณีย์" value={farmPostcode} onChange={setFarmPostcode} placeholder="5 หลัก" />
                  </div>
                </div>
              )}

              <div>
                <Label>พิกัด GPS <span className="text-gray-400 ml-1 text-[11px]">(optional — ช่วยตรวจสอบความน่าเชื่อถือ)</span></Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <TextField label="Latitude" value={gpsLat} onChange={setGpsLat} placeholder="เช่น 18.7883" />
                  <TextField label="Longitude" value={gpsLng} onChange={setGpsLng} placeholder="เช่น 98.9853" />
                </div>
              </div>

              {/* Farm photos */}
              <div>
                <Label required>รูปฟาร์ม / โรงงาน / กระบวนการผลิต <span className="text-gray-400 ml-1 text-[11px]">(อย่างน้อย 3 รูป — ขั้นต่ำเพื่อ trust signal)</span></Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                  {farmPhotos.map((_, i) => (
                    <div key={i} className="aspect-square rounded-xl bg-gray-100 border border-gray-200 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="size-6 text-gray-400" strokeWidth={1.8} />
                      </div>
                      <button onClick={() => setFarmPhotos(farmPhotos.filter((_, j) => j !== i))}
                        className="absolute top-1 right-1 size-5 rounded-full bg-white shadow flex items-center justify-center cursor-pointer hover:bg-red-50">
                        <X className="size-3 text-red-500" strokeWidth={2.4} />
                      </button>
                    </div>
                  ))}
                  {farmPhotos.length < 10 && (
                    <button type="button" onClick={() => setFarmPhotos([...farmPhotos, `photo-${farmPhotos.length}`])}
                      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-[#319754] hover:bg-[#319754]/5 flex flex-col items-center justify-center gap-1 cursor-pointer transition-all">
                      <Upload className="size-5 text-gray-400" strokeWidth={1.8} />
                      <span className={`${font} text-[10px] text-gray-500`}>เพิ่มรูป</span>
                    </button>
                  )}
                </div>
                <p className={`${font} text-[11px] text-gray-400 mt-2`}>
                  อัปโหลดแล้ว {farmPhotos.length}/10 รูป {farmPhotos.length < 3 && <span className="text-[#ff3b30]">— ต้องการอีก {3 - farmPhotos.length} รูป</span>}
                </p>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              {/* Legal docs */}
              <div>
                <Label required>เอกสารทางกฎหมาย</Label>
                <div className="space-y-2 mt-2">
                  <DocUploadRow label="หนังสือรับรองบริษัท / ทะเบียนพาณิชย์" required uploaded={docCompanyReg} onToggle={() => setDocCompanyReg(!docCompanyReg)} />
                  <DocUploadRow label="ภ.พ.20 (ผู้ประกอบการ VAT)" hint="หากไม่จด VAT ข้ามได้" uploaded={docVat} onToggle={() => setDocVat(!docVat)} />
                  <DocUploadRow label="สำเนาบัตรประชาชนผู้มีอำนาจลงนาม" required uploaded={docIdCard} onToggle={() => setDocIdCard(!docIdCard)} />
                  <DocUploadRow label="หนังสือรับรองโรงเรือน / สถานที่ผลิต" hint="ถ้ามี — เสริม trust" uploaded={docFarmCert} onToggle={() => setDocFarmCert(!docFarmCert)} />
                </div>
              </div>

              {/* Certifications */}
              <div>
                <Label required>ใบรับรองมาตรฐาน</Label>
                <p className={`${font} text-[12px] text-gray-500 mt-0.5 mb-3`}>เลือกใบรับรองที่มี + กรอกเลขที่ + วันหมดอายุ + อัปโหลดไฟล์ <span className="text-[#319754]" style={{ fontWeight: 600 }}>(อย. บังคับ)</span></p>
                <div className="space-y-2">
                  {CERT_OPTIONS.map((c) => {
                    const v = certs[c.id];
                    const enabled = v?.enabled || false;
                    return (
                      <div key={c.id} className={`rounded-xl border-2 transition-all ${enabled ? "border-[#319754] bg-[#319754]/5" : "border-gray-200"}`}>
                        <button type="button" onClick={() => toggleCert(c.id)}
                          className="w-full flex items-start justify-between gap-3 p-3 text-left cursor-pointer">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className={`size-4 rounded mt-0.5 shrink-0 flex items-center justify-center border-2 ${enabled ? "border-[#319754] bg-[#319754]" : "border-gray-300"}`}>
                              {enabled && <Check className="size-3 text-white" strokeWidth={3} />}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`${font} text-[13px] text-black`} style={{ fontWeight: enabled ? 600 : 500 }}>{c.label}</span>
                                {c.required && <span className={`${font} text-[9px] bg-[#ff3b30]/10 text-[#ff3b30] px-1.5 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>บังคับ</span>}
                              </div>
                              {c.desc && <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{c.desc}</p>}
                            </div>
                          </div>
                        </button>
                        {enabled && (
                          <div className="px-3 pb-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                            <input value={v?.certNo || ""} placeholder="เลขที่ใบรับรอง"
                              onChange={(e) => updateCert(c.id, "certNo", e.target.value)}
                              className={`${font} bg-[#fafafa] h-10 px-4 rounded-full text-[12px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
                            <input type="date" value={v?.expiry || ""}
                              onChange={(e) => updateCert(c.id, "expiry", e.target.value)}
                              className={`${font} bg-[#fafafa] h-10 px-4 rounded-full text-[12px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
                            <button type="button" onClick={() => updateCert(c.id, "uploaded", !v?.uploaded)}
                              className={`${font} h-10 px-4 rounded-full text-[12px] cursor-pointer transition-all inline-flex items-center justify-center gap-1.5 ${
                                v?.uploaded ? "bg-[#319754]/10 text-[#319754]" : "bg-white border border-gray-200 text-gray-600 hover:border-[#319754]"
                              }`} style={{ fontWeight: 500 }}>
                              {v?.uploaded ? <><Check className="size-3.5" strokeWidth={2.4} /> อัปโหลดแล้ว</> : <><Upload className="size-3.5" strokeWidth={2.2} /> อัปโหลดไฟล์</>}
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {step === 5 && (
            <>
              <div>
                <Label required>หมวดวัตถุดิบที่จำหน่าย <span className="text-gray-400 ml-1 text-[11px]">(เลือกได้หลายหมวด)</span></Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {CATEGORIES.map((c) => {
                    const active = categories.includes(c);
                    return (
                      <button key={c} type="button" onClick={() => toggleArr(categories, setCategories, c)}
                        className={`${font} text-[12px] px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                          active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`} style={{ fontWeight: 500 }}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextField label="กำลังการผลิต (กก./เดือน)" required value={capacity} onChange={setCapacity} placeholder="เช่น 5000" />
                <TextField label="MOQ ทั่วไป (กก.)" required value={moq} onChange={setMoq} placeholder="เช่น 25" />
              </div>

              <div>
                <Label required>พื้นที่จัดส่ง</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {DELIVERY_AREAS.map((d) => {
                    const active = deliveryAreas.includes(d);
                    return (
                      <button key={d} type="button" onClick={() => toggleArr(deliveryAreas, setDeliveryAreas, d)}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-left cursor-pointer transition-all ${
                          active ? "border-[#319754] bg-[#319754]/5" : "border-gray-200 hover:border-gray-300"
                        }`}>
                        <div className={`size-4 rounded shrink-0 border-2 flex items-center justify-center ${active ? "border-[#319754] bg-[#319754]" : "border-gray-300"}`}>
                          {active && <Check className="size-3 text-white" strokeWidth={3} />}
                        </div>
                        <span className={`${font} text-[12px] text-black truncate`} style={{ fontWeight: active ? 600 : 500 }}>{d}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label required>เงื่อนไขชำระเงินที่รับ</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {PAYMENT_TERMS.map((p) => {
                    const active = acceptedTerms.includes(p);
                    return (
                      <button key={p} type="button" onClick={() => toggleArr(acceptedTerms, setAcceptedTerms, p)}
                        className={`${font} text-[12px] px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                          active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`} style={{ fontWeight: 500 }}>
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bank info */}
              <div className="bg-[#fff8e6] border border-[#f0c674]/40 rounded-xl p-4 flex items-start gap-2.5">
                <AlertCircle className="size-4 text-[#a86a00] shrink-0 mt-0.5" strokeWidth={2.2} />
                <p className={`${font} text-[12px] text-[#7a4a00]`}>
                  บัญชีรับเงินต้อง<span style={{ fontWeight: 600 }}>ตรงกับนิติบุคคล/ชื่อกิจการ</span> — บัญชีส่วนตัวจะไม่ผ่านการตรวจสอบ
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex flex-col gap-2">
                  <Label required>ธนาคาร</Label>
                  <div className="relative">
                    <select value={bankName} onChange={(e) => setBankName(e.target.value)}
                      className={`${font} bg-[#fafafa] h-12 pl-6 pr-12 w-full rounded-full text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow cursor-pointer appearance-none`}>
                      <option value="">เลือกธนาคาร</option>
                      <option>กสิกรไทย (KBANK)</option>
                      <option>กรุงเทพ (BBL)</option>
                      <option>กรุงไทย (KTB)</option>
                      <option>ไทยพาณิชย์ (SCB)</option>
                      <option>กรุงศรีฯ (BAY)</option>
                      <option>ทหารไทยธนชาต (TTB)</option>
                      <option>ธ.ก.ส. (BAAC)</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />
                  </div>
                </div>
                <TextField label="ชื่อบัญชี" required value={bankAccountName} onChange={setBankAccountName} placeholder="ตามนิติบุคคล" />
                <TextField label="เลขที่บัญชี" required value={bankAccountNumber} onChange={setBankAccountNumber} placeholder="" />
              </div>

              {/* Summary preview */}
              <div className="bg-[#fafaf7] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardCheck className="size-4 text-[#319754]" strokeWidth={2.2} />
                  <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>สรุปก่อนส่งใบสมัคร</p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                  <SummaryRow k="ประเภท" v={BUSINESS_TYPES.find((b) => b.id === businessType)?.label || "—"} />
                  <SummaryRow k="ชื่อแบรนด์" v={brandName || "—"} />
                  <SummaryRow k="ผู้ติดต่อ" v={contactName || "—"} />
                  <SummaryRow k="หมวดสินค้า" v={categories.length ? `${categories.length} หมวด` : "—"} />
                  <SummaryRow k="ใบรับรอง" v={`${Object.values(certs).filter((v) => v.enabled).length} ใบ`} />
                  <SummaryRow k="รูปฟาร์ม" v={`${farmPhotos.length} รูป`} />
                </div>
              </div>

              {/* Accept */}
              <label className="flex items-start gap-3 cursor-pointer p-4 rounded-xl border-2 border-[#319754]/20 bg-[#319754]/5">
                <input type="checkbox" checked={acceptPolicy} onChange={(e) => setAcceptPolicy(e.target.checked)}
                  className="size-4 mt-0.5 accent-[#319754] cursor-pointer shrink-0" />
                <span className={`${font} text-[12px] text-gray-700 leading-relaxed`}>
                  ฉันยืนยันว่าข้อมูลและเอกสารทั้งหมดเป็นความจริง และยอมรับ <a className="text-[#319754] underline" href="#">ข้อตกลงผู้จำหน่าย</a>,
                  <a className="text-[#319754] underline mx-1" href="#">นโยบายคุณภาพ (Quality SLA)</a>, และ
                  <a className="text-[#319754] underline ml-1" href="#">ค่าธรรมเนียมแพลตฟอร์ม</a>
                </span>
              </label>
            </>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button onClick={handleBack}
            className={`${font} inline-flex items-center gap-1 h-11 px-5 rounded-full border border-gray-200 text-gray-600 text-[13px] cursor-pointer hover:bg-gray-50 transition-colors`}
            style={{ fontWeight: 600 }}>
            <ChevronLeft className="size-4" strokeWidth={2.4} />
            {step === 1 ? "ยกเลิก" : "ย้อนกลับ"}
          </button>
          <button onClick={handleNext}
            className={`${font} inline-flex items-center gap-1.5 h-11 px-6 rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
            style={{ fontWeight: 600 }}>
            {step < 5 ? (
              <>ถัดไป <ChevronRight className="size-4" strokeWidth={2.4} /></>
            ) : (
              <><Sparkles className="size-4" strokeWidth={2.4} /> ส่งใบสมัคร</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------ helpers ------------ */
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className={`${font} text-[13px] text-gray-700`} style={{ fontWeight: 500 }}>
      {children}{required && <span className="text-[#ff3b30] ml-1">*</span>}
    </label>
  );
}

function TextField({ label, value, onChange, placeholder, required, icon: Icon, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; icon?: any; type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label required={required}>{label}</Label>
      <div className="relative">
        {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />}
        <input type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${font} bg-[#fafafa] h-12 ${Icon ? "pl-12" : "pl-6"} pr-6 w-full rounded-full text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
      </div>
    </div>
  );
}

function UploadBox({ label, hint, uploaded, onToggle }: { label: string; hint: string; uploaded: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed transition-all cursor-pointer text-left w-full ${
        uploaded ? "border-[#319754] bg-[#319754]/5" : "border-gray-300 hover:border-gray-400"
      }`}>
      <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${uploaded ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-500"}`}>
        {uploaded ? <Check className="size-4" strokeWidth={2.6} /> : <Upload className="size-4" strokeWidth={2.2} />}
      </div>
      <div className="min-w-0">
        <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{label}</p>
        <p className={`${font} text-[11px] text-gray-500`}>{uploaded ? "อัปโหลดแล้ว — คลิกเพื่อเปลี่ยน" : hint}</p>
      </div>
    </button>
  );
}

function DocUploadRow({ label, hint, required, uploaded, onToggle }: { label: string; hint?: string; required?: boolean; uploaded: boolean; onToggle: () => void }) {
  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border-2 transition-all ${uploaded ? "border-[#319754] bg-[#319754]/5" : "border-gray-200"}`}>
      <div className="flex items-start gap-2.5 min-w-0">
        <FileText className={`size-4 shrink-0 mt-0.5 ${uploaded ? "text-[#319754]" : "text-gray-400"}`} strokeWidth={2.2} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{label}</span>
            {required && <span className={`${font} text-[9px] bg-[#ff3b30]/10 text-[#ff3b30] px-1.5 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>บังคับ</span>}
          </div>
          {hint && <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{hint}</p>}
        </div>
      </div>
      <button onClick={onToggle}
        className={`${font} shrink-0 h-10 px-4 rounded-full text-[12px] cursor-pointer inline-flex items-center gap-1.5 transition-all ${
          uploaded ? "bg-[#319754]/10 text-[#319754]" : "bg-white border border-gray-200 text-gray-600 hover:border-[#319754]"
        }`} style={{ fontWeight: 500 }}>
        {uploaded ? <><Check className="size-3.5" strokeWidth={2.4} /> อัปโหลดแล้ว</> : <><Upload className="size-3.5" strokeWidth={2.2} /> อัปโหลด</>}
      </button>
    </div>
  );
}

function SummaryRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <span className={`${font} text-[11px] text-gray-500`}>{k}</span>
      <span className={`${font} text-[12px] text-black truncate`} style={{ fontWeight: 500 }}>{v}</span>
    </div>
  );
}
