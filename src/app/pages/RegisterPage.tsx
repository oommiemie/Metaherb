import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";
import { useLanguage } from "../store/LanguageContext";
import { ChevronLeft, EyeOff, Eye, Store, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import imgLogo from "../../assets/logo.png";
import imgGoogle from "../../assets/google.png";
import imgFacebook from "../../assets/facebook.png";
import imgLine from "../../assets/line.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

/** Customer registration only. Sellers register at /seller/register. */
export function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t } = useLanguage();
  const [form, setForm] = useState({ username: "", password: "", email: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => {
    if (!form.username || !form.password || !form.email || !form.phone) { setError(t("common_required")); return; }
    if (form.password.length < 8) { setError(t("register_password_min")); return; }
    if (!accepted) { setError(t("register_accept_terms")); return; }
    register({ ...form, role: "user", name: form.username });
    toast.success("สมัครสมาชิกสำเร็จ");
    navigate("/");
  };

  const update = (k: keyof typeof form, v: string) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="bg-[#fafafa] min-h-[calc(100vh-200px)] flex items-center justify-center py-8 px-4">
      <div className="bg-white rounded-2xl w-full max-w-[500px] flex flex-col items-center justify-center overflow-clip">
        {/* Top row: back button */}
        <div className="flex items-center p-4 w-full">
          <button onClick={() => navigate(-1)}
            className={`bg-[#319754]/10 flex gap-2 items-center justify-center px-4 py-1.5 rounded-full ${font} text-[12px] text-[#319754] cursor-pointer hover:bg-[#319754]/20 transition-colors`}
            style={{ fontWeight: 500 }}>
            <ChevronLeft className="size-3.5" strokeWidth={2.5} />
            {t("common_back")}
          </button>
        </div>

        <div className="flex flex-col gap-4 items-center px-4 sm:px-[60px] py-4 w-full">
          <img src={imgLogo} className="size-[58px]" alt="MetaHerb" />
          <div className="flex flex-col gap-2 items-center text-center">
            <h1 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("register_title")}</h1>
            <p className={`${font} text-[12px] text-black`}>
              {t("register_subtitle")}<br />
              {t("register_subtitle2")}
            </p>
          </div>

          {error && <p className={`${font} text-[13px] text-red-500`}>{error}</p>}

          <div className="flex flex-col gap-4 items-stretch w-full max-w-[350px] py-2.5">
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("register_username_label")}</label>
              <input value={form.username} onChange={(e) => update("username", e.target.value)} placeholder={t("register_username_ph")}
                className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
            </div>

            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("register_password_label")}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => update("password", e.target.value)} placeholder={t("register_password_ph")}
                  className={`bg-[#fafafa] h-[48px] rounded-full px-6 pr-12 text-[14px] ${font} outline-none w-full text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                  {showPassword ? <Eye className="size-5 text-gray-400" /> : <EyeOff className="size-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("register_email_label")}</label>
              <input value={form.email} onChange={(e) => update("email", e.target.value)} placeholder={t("register_email_ph")}
                className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
            </div>

            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("register_phone_label")}</label>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder={t("register_phone_ph")}
                className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
            </div>

            <label className="flex gap-2.5 items-start cursor-pointer">
              <input type="checkbox" checked={accepted} onChange={() => setAccepted(!accepted)}
                className="mt-1 size-3.5 cursor-pointer accent-[#319754]" />
              <p className={`${font} text-[12px] text-gray-800 leading-relaxed`}>
                {t("register_accept")} <span className="text-[#297a4e] underline">{t("register_terms")}</span> {t("register_and")} <span className="text-[#297a4e] underline">{t("register_privacy")}</span>
              </p>
            </label>
          </div>

          <button onClick={handleRegister}
            className={`bg-[#008c45] hover:bg-[#007a3b] h-[49px] w-full rounded-full text-white text-[14px] ${font} cursor-pointer transition-colors`}>
            {t("register_button")}
          </button>

          {/* Seller cross-link card */}
          <button onClick={() => navigate("/seller/register")}
            className={`group/sell w-full flex items-center gap-3 bg-[#319754]/8 hover:bg-[#319754]/12 border border-[#319754]/20 rounded-2xl px-4 py-3 cursor-pointer transition-colors text-left`}>
            <div className="size-9 rounded-xl bg-white flex items-center justify-center shrink-0">
              <Store className="size-4 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${font} text-[13px] text-[#1d5b32]`} style={{ fontWeight: 600 }}>อยากเปิดร้านค้าบน MetaHerb?</p>
              <p className={`${font} text-[11.5px] text-gray-600 mt-0.5`}>สมัครเป็นร้านค้า แล้วลงขายสินค้าได้ทันที</p>
            </div>
            <ArrowRight className="size-4 text-[#319754] group-hover/sell:translate-x-0.5 transition-transform" strokeWidth={2.2} />
          </button>

          <div className="flex items-center w-full gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className={`${font} text-[12px] text-black`}>{t("common_or")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="flex gap-2 sm:gap-4 items-stretch w-full">
            {[
              { img: imgGoogle, label: "Google" },
              { img: imgFacebook, label: "Facebook" },
              { img: imgLine, label: "Line" },
            ].map((s) => (
              <button key={s.label}
                className={`flex-1 min-w-0 border border-[#d4d4d4] flex gap-1.5 sm:gap-2 items-center justify-center h-10 px-2 sm:px-6 rounded-full ${font} text-[11px] sm:text-[12px] text-[#525252] cursor-pointer hover:bg-gray-50 transition-colors`}
                style={{ fontWeight: 500 }}>
                <img src={s.img} className="size-4 sm:size-5 shrink-0" alt="" />
                <span className="truncate">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={`flex gap-2.5 items-center justify-center p-4 w-full max-w-[350px] ${font} text-[14px] text-center`}>
          <span className="text-[#0a0a0a]">{t("register_has_account")}</span>
          <span onClick={() => navigate("/login")} className="text-[#297a4e] underline cursor-pointer">{t("register_login_link")}</span>
        </div>
      </div>
    </div>
  );
}
