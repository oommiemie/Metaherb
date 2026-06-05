import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";
import { useLanguage } from "../store/LanguageContext";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import imgLogo from "../../assets/logo.png";
import imgGoogle from "../../assets/google.png";
import imgFacebook from "../../assets/facebook.png";
import imgLine from "../../assets/line.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (!email || !password) { setError(t("common_required")); return; }
    const success = login(email, password);
    if (success) navigate("/");
    else setError(t("login_invalid"));
  };

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

        {/* Content section: logo + title + form + buttons */}
        <div className="flex flex-col gap-4 items-center px-4 sm:px-[60px] py-4 w-full">
          <img src={imgLogo} className="size-[58px]" alt="MetaHerb" />
          <div className="flex flex-col gap-2 items-center text-center">
            <h1 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("login_welcome")}</h1>
            <p className={`${font} text-[12px] text-black`}>
              {t("login_subtitle")}<br />
              {t("login_subtitle2")}
            </p>
          </div>

          {error && <p className={`${font} text-[13px] text-red-500`}>{error}</p>}

          {/* Form fields */}
          <div className="flex flex-col gap-4 items-stretch w-full max-w-[350px] py-2.5">
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("login_email_label")}</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("login_email_ph")}
                className={`bg-[#fafafa] h-[48px] rounded-full px-6 text-[14px] ${font} outline-none text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("login_password_label")}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("login_password_ph")}
                  className={`bg-[#fafafa] h-[48px] rounded-full px-6 pr-12 text-[14px] ${font} outline-none w-full text-gray-700 placeholder:text-[#a3a3a3] focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer">
                  {showPassword ? <Eye className="size-5 text-gray-400" /> : <EyeOff className="size-5 text-gray-400" />}
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className={`${font} text-[12px] text-[#297a4e] cursor-pointer hover:underline`}>{t("login_forgot")}</span>
            </div>
          </div>

          {/* Demo account info */}
          <div className="w-full max-w-[350px] bg-green-50 rounded-lg p-3 text-[11px]">
            <p className={`${font} text-[#319754]`} style={{ fontWeight: 500 }}>{t("login_demo")}</p>
            <p
              onClick={() => { setEmail("user@test.com"); setPassword("12345678"); setError(""); }}
              className={`${font} text-gray-600 cursor-pointer hover:text-[#319754] hover:bg-[#319754]/10 rounded px-1 py-0.5 -mx-1 transition-colors duration-200`}
            >
              User: user@test.com / 12345678
            </p>
          </div>

          {/* Sign in button — full width of content section */}
          <button onClick={handleLogin}
            className={`bg-[#008c45] hover:bg-[#007a3b] h-[49px] w-full rounded-full text-white text-[14px] ${font} cursor-pointer transition-colors`}>
            {t("login_button")}
          </button>

          {/* Divider */}
          <div className="flex items-center w-full gap-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className={`${font} text-[12px] text-black`}>{t("common_or")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Social buttons — horizontal row of 3 */}
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

        {/* Bottom: register link */}
        <div className={`flex gap-2.5 items-center justify-center p-4 w-full max-w-[350px] ${font} text-[14px] text-center`}>
          <span className="text-[#0a0a0a]">{t("login_no_account")}</span>
          <span onClick={() => navigate("/register")} className="text-[#297a4e] underline cursor-pointer">{t("login_register_link")}</span>
        </div>
      </div>
    </div>
  );
}
