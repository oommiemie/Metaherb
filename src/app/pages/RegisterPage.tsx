import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth, type UserRole } from "../store/AuthContext";
import { ChevronLeft, EyeOff, Eye } from "lucide-react";
import imgLogo from "figma:asset/92a7853cfe8aac5f8954e358ce38a79185856aff.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: "", password: "", email: "", phone: "", role: "user" as UserRole });
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!form.username || !form.password || !form.email || !form.phone) { setError("กรุณากรอกข้อมูลให้ครบ"); return; }
    if (form.password.length < 8) { setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"); return; }
    if (!accepted) { setError("กรุณายอมรับข้อกำหนด"); return; }
    register(form);
    navigate("/");
  };

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[500px] px-4 sm:px-6 py-6 flex flex-col items-center gap-4">
        <div className="w-full">
          <button onClick={() => navigate(-1)} className={`flex items-center gap-1.5 bg-[#d4d4d4] px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer`}>
            <ChevronLeft className="size-3" /> กลับ
          </button>
        </div>
        <img src={imgLogo} className="size-[58px]" alt="" />
        <h1 className={`${font} text-[20px]`} style={{ fontWeight: 500 }}>สมัครสมาชิก</h1>

        {error && <p className={`${font} text-[13px] text-red-500`}>{error}</p>}

        <div className="w-full sm:w-[350px] flex flex-col gap-4 py-2">
          {/* Role selection */}
          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ประเภทบัญชี</label>
            <div className="flex gap-2">
              {([["user", "ผู้ซื้อ"], ["owner", "ร้านค้า"]] as [UserRole, string][]).map(([role, label]) => (
                <button key={role} onClick={() => update("role", role)}
                  className={`flex-1 h-[40px] rounded-full text-[13px] ${font} cursor-pointer transition-colors ${
                    form.role === role ? "bg-[#319754] text-white" : "bg-[#fafafa] text-gray-600 border border-gray-300"
                  }`}>{label}</button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ชื่อผู้ใช้</label>
            <input value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="ระบุชื่อผู้ใช้"
              className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none`} />
          </div>
          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รหัสผ่าน</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder="ระบุรหัสผ่านอย่างน้อย 8 ตัว"
                className={`bg-[#fafafa] h-[48px] rounded-full px-6 pr-12 text-[14px] ${font} outline-none w-full`} />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                {showPassword ? <Eye className="size-5 text-gray-400" /> : <EyeOff className="size-5 text-gray-400" />}
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>อีเมล</label>
            <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="ระบุอีเมล"
              className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none`} />
          </div>
          <div className="flex flex-col gap-2">
            <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>เบอร์โทรศัพท์</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="ระบุเบอร์โทรศัพท์"
              className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none`} />
          </div>
        </div>

        <div className="flex gap-4 items-start w-full sm:w-[350px]">
          <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)} className="mt-1 size-3 cursor-pointer accent-[#319754]" />
          <p className={`${font} text-[12px] text-gray-800`}>
            ยอมรับ <span className="underline">ข้อกำหนดการใช้บริการ meta herb</span> และ <span className="underline">นโยบายความคุ้มครองข้อมูลส่วนบุคคล</span>
          </p>
        </div>

        <button onClick={handleRegister} className={`bg-[#008c45] h-[49px] w-full sm:w-[350px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>สมัครสมาชิก</button>

        <div className={`flex gap-2 text-[14px] ${font}`}>
          <span>คุณมีบัญชีอยู่แล้ว?</span>
          <span onClick={() => navigate("/login")} className="text-[#297a4e] underline cursor-pointer">เข้าสู่ระบบ</span>
        </div>
      </div>
    </div>
  );
}