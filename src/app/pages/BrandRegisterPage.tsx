import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, FlaskConical, Send, Lock, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../store/AuthContext";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const STORAGE_KEY = "metaherb:brand:application";

type BrandApplication = {
  userId: string;
  brandName: string;
  tradeRegNo: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: number;
};

/** Seller profile saved at /register when user picks role=owner. Same shape as the form. */
type SellerProfile = { shopName?: string; taxId?: string; ownerName?: string };
function loadSellerProfile(username: string): SellerProfile | null {
  try {
    const raw = localStorage.getItem(`metaherb:seller:${username}`);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function loadApplication(userId: string): BrandApplication | null {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BrandApplication[];
    return all.find((a) => a.userId === userId) || null;
  } catch { return null; }
}
function saveApplication(app: BrandApplication) {
  const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BrandApplication[];
  const next = [...all.filter((a) => a.userId !== app.userId), app];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function BrandRegisterPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const existing = user ? loadApplication(user.id) : null;
  // Pre-fill from the user's saved seller profile (set at /register when role=owner)
  const seller = user ? loadSellerProfile(user.username) : null;
  const [form, setForm] = useState({
    brandName: seller?.shopName || user?.shopName || "",
    tradeRegNo: seller?.taxId || "",
    contactName: seller?.ownerName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    website: "",
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState<BrandApplication | null>(existing);

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  // ----- Gate: must be logged in and have seller role -----
  if (!isAuthenticated) {
    return (
      <GateCard
        icon={<Lock className="size-7 text-[#319754]" strokeWidth={2.2} />}
        title="กรุณาเข้าสู่ระบบก่อน"
        body="ระบบสมัครแบรนด์สินค้าทดสอบเปิดให้เฉพาะสมาชิกที่ล็อกอินอยู่เท่านั้น"
        primaryLabel="เข้าสู่ระบบ"
        onPrimary={() => navigate("/login")}
      />
    );
  }
  if (user!.role !== "owner") {
    return (
      <GateCard
        icon={<ShieldCheck className="size-7 text-[#319754]" strokeWidth={2.2} />}
        title="ต้องสมัครเป็นร้านค้าก่อน"
        body="การสมัครเป็นแบรนด์สินค้าทดสอบ ต้องเป็นเจ้าของร้านค้าที่จดทะเบียนกับ MetaHerb แล้วเท่านั้น"
        primaryLabel="สมัครเป็นร้านค้า"
        onPrimary={() => navigate("/seller/register")}
      />
    );
  }
  if (submitted) {
    return (
      <SuccessCard app={submitted} onBack={() => navigate("/")} onEdit={() => setSubmitted(null)} />
    );
  }

  const handleSubmit = () => {
    if (!form.brandName || !form.tradeRegNo || !form.contactName || !form.email || !form.phone) {
      setError("กรุณากรอกข้อมูลที่จำเป็นให้ครบ"); return;
    }
    const app: BrandApplication = {
      userId: user!.id,
      ...form,
      status: "pending",
      appliedAt: Date.now(),
    };
    saveApplication(app);
    setSubmitted(app);
    toast.success("ส่งใบสมัครสำเร็จ", { description: "ทีมงานจะพิจารณาภายใน 3-5 วันทำการ" });
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-[640px] mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors mb-4`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} /> กลับ
        </button>

        {/* Header card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          className="bg-white rounded-3xl p-7 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-2xl bg-gradient-to-br from-[#319754]/15 to-[#46c474]/15 flex items-center justify-center">
              <FlaskConical className="size-6 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div>
              <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.05em" }}>STEP 3 / 3</p>
              <h1 className={`${font} text-[22px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>สมัครเป็นแบรนด์สินค้าทดสอบ</h1>
            </div>
          </div>
          <p className={`${font} text-[13.5px] text-gray-600 leading-relaxed mt-2`}>
            แบรนด์ที่ผ่านการอนุมัติจะสามารถลงสินค้าให้ผู้ใช้ทดสอบ พร้อมรับ feedback จริงก่อนวางจำหน่าย
          </p>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mt-5 mb-1">
            {[
              { label: "สมาชิก", done: true },
              { label: "ร้านค้า", done: true },
              { label: "แบรนด์ทดสอบ", done: false, current: true },
            ].map((s, i, arr) => (
              <div key={s.label} className="flex items-center gap-2 flex-1">
                <div className={`size-7 rounded-full flex items-center justify-center shrink-0 ${
                  s.done ? "bg-[#319754] text-white" : s.current ? "bg-white border-2 border-[#319754] text-[#319754]" : "bg-gray-100 text-gray-400"
                }`}>
                  {s.done ? <Check className="size-3.5" strokeWidth={3} /> : <span className={`${font} text-[12px]`} style={{ fontWeight: 700 }}>{i + 1}</span>}
                </div>
                <span className={`${font} text-[12px] ${s.done ? "text-gray-700" : s.current ? "text-[#1d5b32]" : "text-gray-400"}`} style={{ fontWeight: s.current ? 600 : 500 }}>{s.label}</span>
                {i < arr.length - 1 && <span className={`flex-1 h-[2px] ${s.done ? "bg-[#319754]" : "bg-gray-200"} rounded-full`} />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.08 }}
          className="bg-white rounded-3xl p-7 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 mt-4"
        >
          {error && (
            <div className={`${font} bg-red-50 text-red-700 text-[13px] px-4 py-2.5 rounded-xl border border-red-100 mb-4`}>{error}</div>
          )}

          {(seller?.shopName || seller?.taxId) && (
            <div className={`${font} bg-[#319754]/8 text-[#1d5b32] text-[12.5px] px-4 py-2.5 rounded-xl border border-[#319754]/20 mb-4 inline-flex items-center gap-2`}>
              <Check className="size-3.5" strokeWidth={2.6} /> ดึงข้อมูลจากร้านค้าของคุณแล้ว — แก้ไขเพิ่มเติมได้
            </div>
          )}

          <div className="flex flex-col gap-4">
            <Field label="ชื่อแบรนด์ / บริษัท" required value={form.brandName} onChange={(v) => update("brandName", v)} placeholder="เช่น Herbal Lab Co., Ltd." />
            <Field label="เลขทะเบียนการค้า" required value={form.tradeRegNo} onChange={(v) => update("tradeRegNo", v)} placeholder="13 หลัก" maxLength={13} tabular />
            <Field label="ชื่อ-นามสกุลผู้ติดต่อหลัก" required value={form.contactName} onChange={(v) => update("contactName", v)} placeholder="ชื่อ-นามสกุล" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="อีเมล" required type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="example@brand.com" />
              <Field label="เบอร์โทร" required value={form.phone} onChange={(v) => update("phone", v)} placeholder="08X-XXX-XXXX" tabular />
            </div>
            <Field label="เว็บไซต์แบรนด์" value={form.website} onChange={(v) => update("website", v)} placeholder="https://www.brand.com" />
          </div>

          <button onClick={handleSubmit}
            className={`${font} mt-6 w-full h-[50px] rounded-full text-white text-[14px] cursor-pointer transition-all shadow-[0_4px_14px_-2px_rgba(49,151,84,0.45)] inline-flex items-center justify-center gap-2`}
            style={{ background: "linear-gradient(135deg, #319754 0%, #46c474 100%)", fontWeight: 600 }}>
            <Send className="size-4" strokeWidth={2.4} /> ส่งใบสมัคร
          </button>
          <p className={`${font} text-[11.5px] text-gray-500 text-center mt-3 leading-relaxed`}>
            ทีมงานจะตรวจสอบใบสมัครภายใน 3-5 วันทำการ และแจ้งผลผ่านอีเมล
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Field({ label, required, value, onChange, placeholder, type = "text", maxLength, tabular }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number; tabular?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} ${tabular ? "tabular-nums" : ""} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
    </div>
  );
}

function GateCard({ icon, title, body, primaryLabel, onPrimary }: {
  icon: React.ReactNode; title: string; body: string; primaryLabel: string; onPrimary: () => void;
}) {
  const navigate = useNavigate();
  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] py-8 px-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl p-8 max-w-[440px] w-full text-center shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="size-16 rounded-2xl bg-[#319754]/10 flex items-center justify-center mx-auto mb-4">{icon}</div>
        <h2 className={`${font} text-[20px] text-[#1a1a1a] mb-2`} style={{ fontWeight: 700 }}>{title}</h2>
        <p className={`${font} text-[14px] text-gray-600 leading-relaxed mb-6`}>{body}</p>
        <div className="flex gap-2 justify-center">
          <button onClick={() => navigate(-1)} className={`${font} h-[44px] px-5 rounded-full text-gray-700 text-[13px] hover:bg-gray-100 cursor-pointer`} style={{ fontWeight: 500 }}>กลับ</button>
          <button onClick={onPrimary} className={`${font} h-[44px] px-6 rounded-full bg-[#319754] hover:bg-[#267a43] text-white text-[13px] cursor-pointer transition-colors`} style={{ fontWeight: 600 }}>{primaryLabel}</button>
        </div>
      </motion.div>
    </div>
  );
}

function SuccessCard({ app, onBack, onEdit }: { app: BrandApplication; onBack: () => void; onEdit: () => void }) {
  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] py-8 px-4 flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl p-8 max-w-[520px] w-full shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100">
        <div className="text-center">
          <div className="size-16 rounded-full bg-[#319754]/12 flex items-center justify-center mx-auto mb-4">
            <Check className="size-7 text-[#319754]" strokeWidth={3} />
          </div>
          <h2 className={`${font} text-[20px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>ส่งใบสมัครเรียบร้อย</h2>
          <p className={`${font} text-[13.5px] text-gray-600`}>ทีมงาน MetaHerb จะตรวจสอบและแจ้งผลทางอีเมลภายใน 3-5 วันทำการ</p>
        </div>
        <div className="mt-5 bg-gray-50 rounded-2xl p-4 space-y-1.5">
          {[
            ["ชื่อแบรนด์",      app.brandName],
            ["เลขทะเบียน",      app.tradeRegNo],
            ["ผู้ติดต่อ",         app.contactName],
            ["อีเมล",            app.email],
            ["เบอร์โทร",         app.phone],
            ["เว็บไซต์",          app.website || "—"],
            ["สถานะ",            "รอตรวจสอบ"],
          ].map(([k, v]) => (
            <div key={k} className="flex gap-3 text-[13px]">
              <span className={`${font} text-gray-500 w-[100px] shrink-0`}>{k}</span>
              <span className={`${font} text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-2 justify-end mt-5">
          <button onClick={onEdit} className={`${font} h-[44px] px-5 rounded-full text-gray-700 text-[13px] hover:bg-gray-100 cursor-pointer`} style={{ fontWeight: 500 }}>แก้ไขใบสมัคร</button>
          <button onClick={onBack} className={`${font} h-[44px] px-6 rounded-full bg-[#319754] hover:bg-[#267a43] text-white text-[13px] cursor-pointer transition-colors`} style={{ fontWeight: 600 }}>กลับหน้าหลัก</button>
        </div>
      </motion.div>
    </div>
  );
}
