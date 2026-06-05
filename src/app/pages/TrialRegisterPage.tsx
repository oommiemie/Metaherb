import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import {
  loadTesterProfile, saveTesterProfile, TESTER_PROFILE_STORAGE_KEY, type TesterProfile,
} from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const AGE_RANGES = ["15-24", "25-34", "35-44", "45-54", "55+"] as const;
const GENDERS = ["ชาย", "หญิง", "LGBTQ+", "ไม่ระบุ"] as const;

const LIFESTYLE_OPTIONS = [
  { emoji: "🙂", label: "ผู้บริโภคทั่วไป" },
  { emoji: "💚", label: "สายสุขภาพ" },
  { emoji: "💪", label: "นักกีฬา/ออกกำลัง" },
  { emoji: "🧘", label: "สายโยคะ/meditation" },
  { emoji: "✨", label: "สาย skincare" },
  { emoji: "🌿", label: "ชื่นชอบสมุนไพรธรรมชาติ" },
  { emoji: "🌱", label: "มังสวิรัติ/วีแกน" },
  { emoji: "☕", label: "คนดื่มกาแฟ" },
  { emoji: "💼", label: "พนักงานออฟฟิศ" },
  { emoji: "🚴", label: "ชอบเดินทาง/outdoor" },
  { emoji: "🌙", label: "มีปัญหาการนอน" },
  { emoji: "😴", label: "นอนดึก/ทำงานกะ" },
  { emoji: "🤰", label: "ตั้งครรภ์/ให้นมบุตร" },
  { emoji: "👶", label: "ดูแลเด็กเล็ก" },
  { emoji: "🧓", label: "ดูแลผู้สูงอายุในบ้าน" },
  { emoji: "😌", label: "ผู้สูงอายุ (60+)" },
  { emoji: "🤧", label: "ภูมิแพ้/แพ้ง่าย" },
  { emoji: "🍃", label: "สาย wellness/detox" },
];

const HEALTH_OPTIONS = [
  { emoji: "😴", label: "นอนหลับยาก" },
  { emoji: "😩", label: "เครียด/วิตกกังวล" },
  { emoji: "😫", label: "อ่อนเพลีย/พลังงานต่ำ" },
  { emoji: "🧠", label: "สมาธิ/ความจำ" },
  { emoji: "💆", label: "ปวดหัว/ไมเกรน" },
  { emoji: "🌸", label: "ปัญหาผิว/สิว" },
  { emoji: "💧", label: "ผิวแห้ง/ขาดน้ำ" },
  { emoji: "👁️", label: "บำรุงสายตา" },
  { emoji: "👩‍🦳", label: "ผมร่วง/บำรุงผม" },
  { emoji: "🍽️", label: "ระบบย่อย/ท้องอืด" },
  { emoji: "🚽", label: "ระบบขับถ่าย/ท้องผูก" },
  { emoji: "🦴", label: "ปวดข้อ/ปวดเมื่อย" },
  { emoji: "💪", label: "กล้ามเนื้อ/ฟื้นฟู" },
  { emoji: "⚖️", label: "ควบคุมน้ำหนัก" },
  { emoji: "🩸", label: "ระดับน้ำตาล/เบาหวาน" },
  { emoji: "❤️", label: "ความดัน/หัวใจ" },
  { emoji: "🫁", label: "เสริมภูมิคุ้มกัน" },
  { emoji: "🤧", label: "ภูมิแพ้/หวัดบ่อย" },
  { emoji: "🩺", label: "บำรุงตับ" },
  { emoji: "🦷", label: "สุขภาพช่องปาก" },
];

const CONSUMPTION_OPTIONS = [
  { emoji: "🍵", label: "ชาสมุนไพร" },
  { emoji: "🥤", label: "เครื่องดื่มชง/instant" },
  { emoji: "💊", label: "แคปซูล/เม็ด" },
  { emoji: "💉", label: "ยาน้ำ/น้ำสกัด" },
  { emoji: "🌶️", label: "ผง/สมุนไพรบด" },
  { emoji: "🍯", label: "น้ำผึ้งสมุนไพร" },
  { emoji: "🍬", label: "ลูกอม/อมยิ้ม" },
  { emoji: "💧", label: "น้ำมันสกัด/oil" },
  { emoji: "🌸", label: "น้ำมันหอมระเหย" },
  { emoji: "🧴", label: "ครีม/เซรั่ม/โลชั่น" },
  { emoji: "🧊", label: "บาล์ม/ขี้ผึ้ง" },
  { emoji: "🌬️", label: "สเปรย์/aroma" },
  { emoji: "🛁", label: "สบู่/แชมพูสมุนไพร" },
  { emoji: "🌿", label: "ลูกประคบ/อบสมุนไพร" },
  { emoji: "🍴", label: "อาหาร functional" },
];

const TOTAL_STEPS = 5; // 4 input steps + 1 success state

export function TrialRegisterPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const existingProfile = useMemo(() => loadTesterProfile(), []);

  // If already registered, jump straight to success step
  const [step, setStep] = useState<number>(existingProfile ? 5 : 1);
  const [displayName, setDisplayName] = useState(existingProfile?.displayName || user?.name || "");
  const [ageRange, setAgeRange] = useState<TesterProfile["ageRange"]>(existingProfile?.ageRange || "");
  const [gender, setGender] = useState<TesterProfile["gender"]>(existingProfile?.gender || "");
  const [lifestyle, setLifestyle] = useState<string[]>(existingProfile?.lifestyle || []);
  const [health, setHealth] = useState<string[]>(existingProfile?.health || []);
  const [consumption, setConsumption] = useState<string[]>(existingProfile?.consumption || []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); }, [step]);

  const toggle = (arr: string[], value: string, setter: (v: string[]) => void) => {
    setter(arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value]);
  };

  const canProceed =
    (step === 1 && displayName.trim().length >= 2 && ageRange && gender) ||
    (step === 2 && lifestyle.length > 0) ||
    (step === 3 && health.length > 0) ||
    (step === 4 && consumption.length > 0);

  const handleSubmit = () => {
    const profile: TesterProfile = {
      displayName: displayName.trim(),
      ageRange, gender, lifestyle, health, consumption,
      registeredAt: Date.now(),
    };
    saveTesterProfile(profile);
    setStep(5);
  };

  return (
    <div>
      {/* ===== Hero band — exact match with BlogPage hero ===== */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 text-center px-4">
        <h1 className={`${font} text-[20px] sm:text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>
          ลงทะเบียนผู้ทดสอบผลิตภัณฑ์
        </h1>
      </div>

      {/* ===== Body — description + stepper + step card OUTSIDE the green band ===== */}
      <div className="max-w-[760px] mx-auto px-4 py-6 sm:py-8">
        {/* Description */}
        <p className={`${font} text-[14px] text-gray-600 text-center mb-6`}>
          กรอกข้อมูล 4 ขั้นตอน · ระบบจะแนะนำผลิตภัณฑ์ที่เหมาะสมกับคุณ
        </p>

        {/* ===== Stepper ===== */}
        <div className="flex items-center justify-between mb-8 px-2">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((n) => {
            const done = step > n || step === 5;
            const active = step === n;
            return (
              <div key={n} className="flex items-center flex-1 last:flex-none">
                <div
                  className={`size-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    done
                      ? "bg-[#319754] text-white"
                      : active
                      ? "bg-[#319754] text-white ring-4 ring-[#319754]/15"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {done ? <Check className="size-4" strokeWidth={3} /> : <span className={`${font} text-[13px]`} style={{ fontWeight: 600 }}>{n}</span>}
                </div>
                {n < TOTAL_STEPS && (
                  <div className={`flex-1 h-[2px] mx-2 rounded-full ${step > n ? "bg-[#319754]" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* ===== Step card ===== */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="bg-white rounded-[20px] border border-gray-200 p-5 md:p-7 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.06)] min-h-[460px] flex flex-col"
          >
            {step === 1 && (
              <Step
                title="ข้อมูลส่วนบุคคล"
                subtitle="โปรดกรอกข้อมูลพื้นฐานเพื่อเริ่มต้นการลงทะเบียน"
              >
                <FieldLabel>ชื่อที่ใช้แสดง *</FieldLabel>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="เช่น ก้อง"
                  className={`${font} w-full h-[44px] px-4 rounded-full border border-gray-200 text-[14px] text-[#1a1a1a] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 transition-all placeholder:text-gray-400 mb-5`}
                />
                <FieldLabel>อายุ *</FieldLabel>
                <ChipRow>
                  {AGE_RANGES.map((a) => (
                    <Chip key={a} selected={ageRange === a} onClick={() => setAgeRange(a)}>{a}</Chip>
                  ))}
                </ChipRow>
                <div className="h-5" />
                <FieldLabel>เพศ *</FieldLabel>
                <ChipRow>
                  {GENDERS.map((g) => (
                    <Chip key={g} selected={gender === g} onClick={() => setGender(g)}>{g}</Chip>
                  ))}
                </ChipRow>
              </Step>
            )}

            {step === 2 && (
              <Step
                title="รูปแบบการใช้ชีวิต"
                subtitle="สามารถเลือกได้มากกว่าหนึ่งข้อ"
              >
                <ChipRow>
                  {LIFESTYLE_OPTIONS.map((o) => (
                    <Chip key={o.label} selected={lifestyle.includes(o.label)} onClick={() => toggle(lifestyle, o.label, setLifestyle)}>
                      <span className="mr-1">{o.emoji}</span> {o.label}
                    </Chip>
                  ))}
                </ChipRow>
              </Step>
            )}

            {step === 3 && (
              <Step
                title="ข้อมูลด้านสุขภาพ"
                subtitle="โปรดเลือกปัญหาสุขภาพที่ท่านต้องการดูแล (เลือกได้หลายข้อ)"
              >
                <ChipRow>
                  {HEALTH_OPTIONS.map((o) => (
                    <Chip key={o.label} selected={health.includes(o.label)} onClick={() => toggle(health, o.label, setHealth)}>
                      <span className="mr-1">{o.emoji}</span> {o.label}
                    </Chip>
                  ))}
                </ChipRow>
              </Step>
            )}

            {step === 4 && (
              <Step
                title="พฤติกรรมการบริโภค"
                subtitle="โปรดเลือกรูปแบบผลิตภัณฑ์สมุนไพรที่คุ้นเคย"
              >
                <ChipRow>
                  {CONSUMPTION_OPTIONS.map((o) => (
                    <Chip key={o.label} selected={consumption.includes(o.label)} onClick={() => toggle(consumption, o.label, setConsumption)}>
                      <span className="mr-1">{o.emoji}</span> {o.label}
                    </Chip>
                  ))}
                </ChipRow>
              </Step>
            )}

            {step === 5 && (
              <div className="flex flex-col items-center text-center py-6">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18 }}
                  className="size-20 rounded-full flex items-center justify-center mb-4 shadow-[0_8px_20px_-4px_rgba(49,151,84,0.4)]"
                  style={{ background: "linear-gradient(135deg, #46c474, #319754)" }}
                >
                  <Check className="size-10 text-white" strokeWidth={3} />
                </motion.div>
                <h2 className={`${font} text-[22px] text-[#1a1a1a] mb-2`} style={{ fontWeight: 700 }}>ลงทะเบียนสำเร็จ</h2>
                <p className={`${font} text-[14px] text-gray-600 max-w-[420px] mb-5 leading-relaxed`}>
                  ขอบคุณที่เข้าร่วมเป็นส่วนหนึ่งของ MetaLab คุณ{displayName ? ` "${displayName}"` : ""} จะได้รับข่าวสารสินค้าที่เหมาะกับ lifestyle ของคุณก่อนใคร
                </p>
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={() => navigate("/trials")}
                    className={`${font} inline-flex items-center gap-2 h-[44px] px-6 rounded-full text-white text-[14px] cursor-pointer hover:bg-[#267a43] transition-colors bg-[#319754]`}
                    style={{ fontWeight: 600 }}
                  >
                    ดูผลิตภัณฑ์ที่เปิดรับ <ArrowRight className="size-4" strokeWidth={2.4} />
                  </button>
                  <button
                    onClick={() => {
                      if (!confirm("ล้างโปรไฟล์ผู้ทดสอบและเริ่มลงทะเบียนใหม่?")) return;
                      localStorage.removeItem(TESTER_PROFILE_STORAGE_KEY);
                      setDisplayName(""); setAgeRange(""); setGender("");
                      setLifestyle([]); setHealth([]); setConsumption([]);
                      setStep(1);
                    }}
                    className={`${font} inline-flex items-center gap-2 h-[44px] px-5 rounded-full text-gray-600 text-[13px] cursor-pointer hover:bg-gray-100 transition-colors`}
                    style={{ fontWeight: 500 }}
                  >
                    ลงทะเบียนใหม่
                  </button>
                </div>
              </div>
            )}

            {/* ===== Nav buttons (hidden on success step) — pinned to bottom of card ===== */}
            {step < 5 && (
              <div className="flex items-center justify-between mt-auto pt-5 border-t border-gray-100">
                <button
                  onClick={() => step > 1 ? setStep(step - 1) : navigate("/trials")}
                  className={`${font} inline-flex items-center gap-2 h-[40px] px-4 rounded-full text-[13px] cursor-pointer transition-colors ${
                    step === 1
                      ? "text-gray-400 hover:bg-gray-50"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  style={{ fontWeight: 500 }}
                >
                  <ArrowLeft className="size-4" strokeWidth={2.4} /> ย้อนกลับ
                </button>
                <button
                  onClick={() => step === 4 ? handleSubmit() : canProceed && setStep(step + 1)}
                  disabled={!canProceed}
                  className={`${font} inline-flex items-center gap-2 h-[40px] px-5 rounded-full text-[13px] transition-all ${
                    canProceed
                      ? "bg-[#319754] text-white cursor-pointer hover:bg-[#267a43]"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                  style={{ fontWeight: 600 }}
                >
                  {step === 4 ? "ยืนยันการลงทะเบียน" : (<>ถัดไป <ArrowRight className="size-4" strokeWidth={2.4} /></>)}
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Step({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className={`${font} text-[20px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>{title}</h2>
      <p className={`${font} text-[13px] text-gray-500 mb-5`}>{subtitle}</p>
      {children}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className={`${font} text-[13px] text-[#1a1a1a] mb-2`} style={{ fontWeight: 500 }}>{children}</p>;
}

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-2">{children}</div>;
}

function Chip({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileTap={{ scale: 0.96 }}
      className={`${font} text-[13px] px-4 py-2 rounded-full border cursor-pointer transition-all ${
        selected
          ? "bg-[#319754] text-white border-[#319754] shadow-[0_2px_8px_rgba(49,151,84,0.3)]"
          : "bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      }`}
      style={{ fontWeight: 500 }}
    >
      {children}
    </motion.button>
  );
}
