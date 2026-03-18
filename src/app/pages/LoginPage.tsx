import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import imgLogo from "figma:asset/92a7853cfe8aac5f8954e358ce38a79185856aff.png";
import imgGoogle from "figma:asset/68dde42a389bff5cdec033b3119c11b0f828d957.png";
import imgFacebook from "figma:asset/ae8779b97275473d65b6c2038307e7546a03b82a.png";
import imgLine from "figma:asset/6e789d73932d39a70cb742b8d46fc983aea859d7.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError("กรุณากรอกข้อมูลให้ครบ"); return; }
    const success = login(email, password);
    if (success) navigate("/");
    else setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
  };

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[500px] px-4 sm:px-6 py-6 flex flex-col items-center gap-4">
        <div className="w-full">
          <button onClick={() => navigate(-1)} className={`flex items-center gap-1.5 bg-[#d4d4d4] px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer`}>
            <ChevronLeft className="size-3" /> กลับ
          </button>
        </div>
        <img src={imgLogo} className="size-[58px]" alt="Logo" />
        <div className="text-center">
          <h1 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ยินดีต้อนรับเข้าสู่ระบบ</h1>
          <p className={`${font} text-[12px] text-gray-600 mt-1`}>ดูแลสุขภาพอย่างมั่นใจ ด้วยผลิตภัณฑ์สมุนไพรคัดสรร<br />ช้อปออนไลน์ได้แล้วที่ Metaherb</p>
        </div>

        {error && <p className={`${font} text-[13px] text-red-500`}>{error}</p>}

        <div className="w-full sm:w-[350px] flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>อีเมลหรือชื่อผู้ใช้</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="กรอกอีเมลหรือชื่อผู้ใช้"
              className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none text-gray-700`} />
          </div>
          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รหัสผ่าน</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="กรอกรหัสผ่าน"
                className={`bg-[#fafafa] h-[48px] rounded-full px-6 pr-12 text-[14px] ${font} outline-none w-full text-gray-700`} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                {showPassword ? <Eye className="size-5 text-gray-400" /> : <EyeOff className="size-5 text-gray-400" />}
              </button>
            </div>
            <div className="text-right">
              <span className={`${font} text-[12px] text-[#297a4e] cursor-pointer`}>ลืมรหัสผ่าน?</span>
            </div>
          </div>
        </div>

        {/* Demo accounts info */}
        <div className="w-full sm:w-[350px] bg-green-50 rounded-lg p-3 text-[11px]">
          <p className={`${font} text-[#319754]`} style={{ fontWeight: 500 }}>บัญชีทดสอบ (กดเพื่อกรอกอัตโนมัติ):</p>
          {[
            { label: "User", email: "user@test.com" },
            { label: "Owner", email: "owner@test.com" },
            { label: "Admin", email: "admin@test.com" },
          ].map((acc) => (
            <p
              key={acc.label}
              onClick={() => { setEmail(acc.email); setPassword("12345678"); setError(""); }}
              className={`${font} text-gray-600 cursor-pointer hover:text-[#319754] hover:bg-[#319754]/10 rounded px-1 py-0.5 -mx-1 transition-colors duration-200`}
            >
              {acc.label}: {acc.email} / 12345678
            </p>
          ))}
        </div>

        <button onClick={handleLogin} className={`bg-[#008c45] h-[49px] w-full sm:w-[350px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>เข้าสู่ระบบ</button>

        <div className="flex items-center w-full gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className={`${font} text-[12px] text-gray-500`}>หรือ</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {[{ img: imgGoogle, label: "เข้าสู่ระบบด้วย Google" }, { img: imgFacebook, label: "เข้าสู่ระบบ Facebook" }, { img: imgLine, label: "เข้าสู่ระบบ Line" }].map((s) => (
          <button key={s.label} className={`flex items-center gap-3 h-[48px] w-full sm:w-[350px] px-6 rounded-full border border-gray-300 ${font} text-[14px] text-gray-600 cursor-pointer hover:bg-gray-50`}>
            <img src={s.img} className="size-6" alt="" /> <span className="flex-1 text-center">{s.label}</span>
          </button>
        ))}

        <div className={`flex gap-2 text-[14px] ${font}`}>
          <span className="text-gray-800">คุณยังไม่มีบัญชีผู้ใช้</span>
          <span onClick={() => navigate("/register")} className="text-[#297a4e] underline cursor-pointer">ลงทะเบียน</span>
        </div>
      </div>
    </div>
  );
}