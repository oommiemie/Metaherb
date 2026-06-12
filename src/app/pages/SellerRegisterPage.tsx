import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { ChevronLeft, EyeOff, Eye, ShoppingBag, ArrowRight, Plus, X, FileText, Upload, Store } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { readImageFile } from "../data/imageUpload";
import { toast } from "sonner";
import imgLogo from "../../assets/logo.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

/** Seller registration — separate from customer flow.
 *  Creates an owner account + persists shop profile in localStorage. */
export function SellerRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [auth, setAuth] = useState({ username: "", password: "", email: "", phone: "" });
  const [seller, setSeller] = useState({
    logoUrl: "",
    shopName: "",
    ownerName: "",
    taxId: "",
    businessType: "personal" as "personal" | "company",
    registeredAddress: "",
    docName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const logoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  const updAuth = (k: keyof typeof auth, v: string) => setAuth((p) => ({ ...p, [k]: v }));
  const updSeller = <K extends keyof typeof seller>(k: K, v: typeof seller[K]) => setSeller((p) => ({ ...p, [k]: v }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    const r = await readImageFile(file, { maxWidth: 400, quality: 0.85 });
    if (!r.ok) { toast.error(r.error); return; }
    updSeller("logoUrl", r.dataUrl);
  };
  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (!file) return;
    updSeller("docName", file.name);
    toast.success("แนบเอกสารแล้ว", { description: file.name });
  };

  const handleSubmit = () => {
    if (!auth.username || !auth.password || !auth.email) { setError("กรุณากรอกข้อมูลบัญชีให้ครบ"); return; }
    if (auth.password.length < 8) { setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"); return; }
    if (!seller.shopName || !seller.ownerName) {
      setError("กรุณากรอกข้อมูลร้านค้าให้ครบ"); return;
    }
    if (!accepted) { setError("กรุณายอมรับข้อกำหนดและนโยบาย"); return; }

    register({ ...auth, role: "owner", name: seller.ownerName });
    localStorage.setItem(`metaherb:seller:${auth.username}`, JSON.stringify(seller));
    toast.success("สมัครร้านค้าสำเร็จ", { description: "ทีมงานจะตรวจสอบและเปิดร้านให้ภายใน 1-2 วันทำการ" });
    navigate("/");
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] py-8 px-4">
      <div className="max-w-[600px] mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors mb-4`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} /> กลับ
        </button>

        {/* Header card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
          className="bg-white rounded-3xl p-7 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 text-center">
          <div className="size-14 mx-auto rounded-2xl bg-gradient-to-br from-[#319754]/15 to-[#46c474]/15 flex items-center justify-center mb-3">
            <Store className="size-7 text-[#319754]" strokeWidth={2.2} />
          </div>
          <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.05em" }}>STEP 2 / 3</p>
          <h1 className={`${font} text-[22px] text-[#1a1a1a] mt-1`} style={{ fontWeight: 700 }}>เปิดร้านค้าบน MetaHerb</h1>
          <p className={`${font} text-[13.5px] text-gray-600 mt-1.5`}>กรอกข้อมูลบัญชี + ข้อมูลร้านค้าในขั้นตอนเดียว</p>
        </motion.div>

        {/* Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white rounded-3xl p-7 shadow-[0_4px_16px_rgba(0,0,0,0.04)] border border-gray-100 mt-4">

          {error && (
            <div className={`${font} bg-red-50 text-red-700 text-[13px] px-4 py-2.5 rounded-xl border border-red-100 mb-5`}>{error}</div>
          )}

          {/* ===== Account section ===== */}
          <SectionTitle>ข้อมูลบัญชี</SectionTitle>
          <div className="flex flex-col gap-4 mt-3">
            <Field label="ชื่อผู้ใช้" required value={auth.username} onChange={(v) => updAuth("username", v)} placeholder="ชื่อผู้ใช้สำหรับเข้าระบบ" />
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รหัสผ่าน <span className="text-[#ff3b30]">*</span></label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={auth.password} onChange={(e) => updAuth("password", e.target.value)} placeholder="อย่างน้อย 8 ตัวอักษร"
                  className={`bg-[#fafafa] h-[48px] rounded-full px-6 pr-12 text-[14px] ${font} outline-none w-full text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                  {showPassword ? <Eye className="size-5 text-gray-400" /> : <EyeOff className="size-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="อีเมล" required type="email" value={auth.email} onChange={(v) => updAuth("email", v)} placeholder="example@email.com" />
              <Field label="เบอร์โทร" value={auth.phone} onChange={(v) => updAuth("phone", v)} placeholder="08X-XXX-XXXX" tabular />
            </div>
          </div>

          {/* ===== Shop section ===== */}
          <div className="h-px bg-gray-200 my-6" />
          <SectionTitle>ข้อมูลร้านค้า</SectionTitle>
          <div className="flex flex-col gap-4 mt-3">
            {/* Logo */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รูปโลโก้ร้าน <span className="text-gray-400 text-[12px]">(ทางเลือก)</span></label>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => logoInputRef.current?.click()}
                  className={`group relative size-[72px] rounded-2xl border-2 border-dashed flex items-center justify-center overflow-hidden shrink-0 cursor-pointer transition-colors ${seller.logoUrl ? "border-[#319754]" : "border-gray-300 hover:border-[#319754]/60"}`}>
                  {seller.logoUrl ? (
                    <>
                      <img src={seller.logoUrl} alt="โลโก้ร้าน" className="absolute inset-0 w-full h-full object-cover" />
                      <span onClick={(e) => { e.stopPropagation(); updSeller("logoUrl", ""); }}
                        role="button" className="absolute top-1 right-1 size-5 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center">
                        <X className="size-3" strokeWidth={2.5} />
                      </span>
                    </>
                  ) : (
                    <Plus className="size-5 text-gray-400 group-hover:text-[#319754] transition-colors" strokeWidth={2.4} />
                  )}
                </button>
                <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleLogoUpload} />
                <p className={`${font} text-[12px] text-gray-500 leading-relaxed`}>คลิกเพื่ออัปโหลด<br />ขนาดไม่เกิน 2MB (JPG, PNG, WebP)</p>
              </div>
            </div>

            <Field label="ชื่อร้าน" required value={seller.shopName} onChange={(v) => updSeller("shopName", v)} placeholder="เช่น เมต้าเฮิร์บ สโตร์" />
            <Field label="ชื่อเจ้าของ / ผู้ติดต่อ" required value={seller.ownerName} onChange={(v) => updSeller("ownerName", v)} placeholder="ชื่อ-นามสกุล" />
            <Field label="เลขประจำตัวผู้เสียภาษี" value={seller.taxId} onChange={(v) => updSeller("taxId", v)} placeholder="13 หลัก" maxLength={13} tabular />

            {/* Business type */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ประเภทธุรกิจ <span className="text-[#ff3b30]">*</span></label>
              <div className="flex gap-2">
                {[
                  { key: "personal", label: "บุคคลธรรมดา" },
                  { key: "company",  label: "นิติบุคคล" },
                ].map((opt) => {
                  const active = seller.businessType === opt.key;
                  return (
                    <button key={opt.key} type="button" onClick={() => updSeller("businessType", opt.key as typeof seller.businessType)}
                      className={`flex-1 h-[44px] rounded-full text-[13px] ${font} cursor-pointer transition-all ${active ? "bg-[#319754] text-white shadow-[0_2px_8px_-2px_rgba(49,151,84,0.4)]" : "bg-[#fafafa] text-gray-600 border border-gray-200 hover:border-[#319754]/40"}`}
                      style={{ fontWeight: active ? 600 : 500 }}>
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ที่อยู่จดทะเบียน</label>
              <textarea value={seller.registeredAddress} onChange={(e) => updSeller("registeredAddress", e.target.value)} placeholder="บ้านเลขที่ ถนน แขวง/ตำบล เขต/อำเภอ จังหวัด รหัสไปรษณีย์" rows={3}
                className={`bg-[#fafafa] rounded-[16px] px-5 py-3 text-[14px] ${font} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow resize-none leading-relaxed`} />
            </div>

            {/* Doc */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>เอกสารยืนยัน</label>
              <p className={`${font} text-[11.5px] text-gray-500 -mt-1`}>{seller.businessType === "personal" ? "สำเนาบัตรประชาชน" : "หนังสือรับรองบริษัท"} (PDF / JPG / PNG)</p>
              <button type="button" onClick={() => docInputRef.current?.click()}
                className={`flex items-center gap-3 h-[48px] px-5 rounded-[16px] border-2 border-dashed cursor-pointer transition-colors text-left ${seller.docName ? "border-[#319754] bg-[#319754]/5" : "border-gray-300 hover:border-[#319754]/60 bg-[#fafafa]"}`}>
                {seller.docName ? <FileText className="size-5 text-[#319754] shrink-0" strokeWidth={2} /> : <Upload className="size-5 text-gray-400 shrink-0" strokeWidth={2} />}
                <span className={`${font} text-[13px] flex-1 truncate ${seller.docName ? "text-[#1d5b32]" : "text-gray-500"}`} style={{ fontWeight: seller.docName ? 600 : 500 }}>
                  {seller.docName || "คลิกเพื่อแนบเอกสาร"}
                </span>
                {seller.docName && (
                  <span onClick={(e) => { e.stopPropagation(); updSeller("docName", ""); }}
                    role="button" className="size-6 rounded-full hover:bg-gray-100 flex items-center justify-center shrink-0">
                    <X className="size-3.5 text-gray-500" strokeWidth={2.4} />
                  </span>
                )}
              </button>
              <input ref={docInputRef} type="file" accept=".pdf,image/jpeg,image/png" className="hidden" onChange={handleDocUpload} />
            </div>
          </div>

          {/* Terms */}
          <label className="flex gap-2.5 items-start cursor-pointer mt-6">
            <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)}
              className="mt-1 size-3.5 cursor-pointer accent-[#319754]" />
            <p className={`${font} text-[12.5px] text-gray-800 leading-relaxed`}>
              ยอมรับ <span className="text-[#297a4e] underline">ข้อกำหนดร้านค้า MetaHerb</span> และ <span className="text-[#297a4e] underline">นโยบายข้อมูลส่วนบุคคล</span>
            </p>
          </label>

          <button onClick={handleSubmit}
            className={`${font} mt-5 w-full h-[50px] rounded-full text-white text-[14px] cursor-pointer transition-all shadow-[0_4px_14px_-2px_rgba(49,151,84,0.45)] inline-flex items-center justify-center gap-2`}
            style={{ background: "linear-gradient(135deg, #319754 0%, #46c474 100%)", fontWeight: 600 }}>
            สมัครเปิดร้านค้า
          </button>
          <p className={`${font} text-[11.5px] text-gray-500 text-center mt-3`}>
            ทีมงานจะตรวจสอบและเปิดร้านให้ภายใน 1-2 วันทำการ
          </p>
        </motion.div>

        {/* Customer cross-link */}
        <button onClick={() => navigate("/register")}
          className={`group/cust mt-4 w-full flex items-center gap-3 bg-white border border-gray-200 hover:border-[#319754]/40 rounded-2xl px-4 py-3 cursor-pointer transition-colors text-left`}>
          <div className="size-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="size-4 text-gray-500" strokeWidth={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>เป็นลูกค้าทั่วไป?</p>
            <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>สมัครสมาชิกธรรมดาแทน (ฟรี ใช้เวลาไม่ถึง 1 นาที)</p>
          </div>
          <ArrowRight className="size-4 text-gray-400 group-hover/cust:text-[#319754] group-hover/cust:translate-x-0.5 transition-all" strokeWidth={2.2} />
        </button>

        <div className={`${font} text-[13px] text-center mt-4 text-gray-600`}>
          มีบัญชีอยู่แล้ว? <span onClick={() => navigate("/login")} className="text-[#297a4e] underline cursor-pointer">เข้าสู่ระบบ</span>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className={`${font} text-[15px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{children}</h2>;
}

function Field({ label, required, value, onChange, placeholder, type = "text", maxLength, tabular }: {
  label: string; required?: boolean; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; maxLength?: number; tabular?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength}
        className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} ${tabular ? "tabular-nums" : ""} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
    </div>
  );
}
