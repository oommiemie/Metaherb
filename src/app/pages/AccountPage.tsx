import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";
import { useLanguage } from "../store/LanguageContext";
import { ChevronLeft, Pencil, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const avatarByRole: Record<string, string> = {
  user: "https://images.unsplash.com/photo-1718307701476-bf46ac964396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZyaWVuZGx5fGVufDF8fHx8MTc3Mzg4ODExMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  owner: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMGJ1c2luZXNzJTIwb3duZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM4ODgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  admin: "https://images.unsplash.com/photo-1612190219911-286df0e14656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwZ2xhc3Nlc3xlbnwxfHx8fDE3NzM4ODgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

export function AccountPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();

  const roleConfig: Record<string, { label: string; color: string }> = {
    user: { label: t("account_role_user"), color: "bg-[#319754]" },
    owner: { label: t("account_role_owner"), color: "bg-[#0088FF]" },
    admin: { label: t("account_role_admin"), color: "bg-[#ff9500]" },
  };

  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [username, setUsername] = useState(user?.username || "Username01");
  const [email, setEmail] = useState(user?.email || "Username01@gmail.com");
  const [phone, setPhone] = useState(user?.phone || "090-000-0000");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifications, setNotifications] = useState({
    orders: true,
    promotions: false,
    messages: true,
    productStatus: true,
  });

  const role = user?.role || "admin";
  const rc = roleConfig[role] || roleConfig.admin;

  const handleSaveProfile = () => {
    setEditingProfile(false);
    toast.success(t("account_saved"));
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("common_required"));
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error(t("account_pw_mismatch"));
      return;
    }
    setEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success(t("account_pw_changed"));
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4">
      {/* Header */}
      <div className="flex gap-4 items-center mb-4">
        <button onClick={() => navigate(-1)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4d4d4] text-[12px] ${font} cursor-pointer hover:bg-[#c4c4c4]`}>
          <ChevronLeft className="size-3" /> {t("common_back")}
        </button>
        <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("account_title")}</p>
      </div>

      <div className="flex gap-4 items-start flex-col lg:flex-row">
        {/* Left sidebar */}
        <div className="w-full lg:w-[400px] shrink-0 space-y-4">
          {/* Profile photo card */}
          <div className="bg-white rounded-[16px] overflow-hidden">
            {/* Green decorative header */}
            <div className="bg-[#d6eadd] h-[150px] relative overflow-hidden flex items-end justify-center">
              {/* Decorative squares */}
              <svg className="absolute left-[200px] top-[15px] opacity-20" width="200" height="200" viewBox="0 0 200 200" fill="none">
                <rect x="0" y="60" width="146" height="146" rx="24" stroke="url(#g1)" strokeWidth="4" fill="none" />
                <rect x="10" y="40" width="146" height="146" rx="24" stroke="url(#g1)" strokeWidth="4" fill="none" transform="rotate(10 80 110)" />
                <rect x="20" y="20" width="146" height="146" rx="24" stroke="url(#g1)" strokeWidth="4" fill="none" transform="rotate(20 80 110)" />
                <rect x="30" y="5" width="146" height="146" rx="24" stroke="url(#g1)" strokeWidth="4" fill="none" transform="rotate(35 80 110)" />
                <rect x="50" y="10" width="146" height="146" rx="24" stroke="url(#g1)" strokeWidth="4" fill="none" transform="rotate(55 80 110)" />
                <defs><linearGradient id="g1" x1="26" y1="4" x2="130" y2="139"><stop stopColor="#5AAC76"/><stop offset="1" stopColor="#319754"/></linearGradient></defs>
              </svg>
            </div>
            {/* Avatar overlapping */}
            <div className="flex flex-col items-center -mt-[75px] pb-4 relative z-10">
              <img
                src={user?.avatar || avatarByRole[role]}
                alt="avatar"
                className="size-[150px] rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <div className="flex flex-col items-center gap-4 px-4 pb-6">
              <button className={`bg-[#319754] text-white text-[14px] ${font} px-6 h-[40px] rounded-full cursor-pointer hover:bg-[#267a43] transition-colors`}>
                {t("account_change_avatar")}
              </button>
              <p className={`${font} text-[14px] text-black text-center`}>
                {t("account_avatar_sub")}<br />
                {t("account_avatar_size")}
              </p>
            </div>
          </div>

          {/* Role card */}
          <div className="bg-white rounded-[16px] p-4 space-y-4">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("account_role")}</p>
            <div className={`${rc.color} rounded-full p-4 relative overflow-hidden`}>
              <p className={`${font} text-[16px] text-white`} style={{ fontWeight: 500 }}>{rc.label}</p>
              {/* Decorative icon */}
              <div className="absolute right-0 top-0 size-[80px] flex items-center justify-center opacity-20">
                <svg width="60" height="48" viewBox="0 0 72 48" fill="none">
                  <path d="M72 0H0V47.833H72V0Z" fill="black" opacity="0"/>
                  <path d="M60.85 9.48H11.15C7.2 9.48 4 12.68 4 16.63V38.35C4 42.3 7.2 45.5 11.15 45.5H60.85C64.8 45.5 68 42.3 68 38.35V16.63C68 12.68 64.8 9.48 60.85 9.48ZM36 4C32.14 4 29 7.14 29 11H43C43 7.14 39.86 4 36 4Z" fill="white"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* User info card */}
          <div className="bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-4">
              <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("account_user_info")}</p>
              {!editingProfile ? (
                <button onClick={() => setEditingProfile(true)}
                  className={`bg-[#f5f5f5] flex items-center gap-2.5 px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#e5e5e5]`}>
                  <Pencil className="size-3" /> {t("account_edit")}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => setEditingProfile(false)}
                    className={`bg-[#f5f5f5] px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#e5e5e5]`}>
                    {t("common_cancel")}
                  </button>
                  <button onClick={handleSaveProfile}
                    className={`bg-[#319754] text-white px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#267a43]`}>
                    {t("common_save")}
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-[#d4d4d8] pt-4 space-y-4">
              <div className="space-y-2">
                <p className={`${font} text-[14px] text-[#999]`}>{t("account_username")}</p>
                {editingProfile ? (
                  <input value={username} onChange={(e) => setUsername(e.target.value)}
                    className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full px-6 py-3 outline-none focus:ring-1 focus:ring-[#319754]`} />
                ) : (
                  <p className={`${font} text-[14px] text-black py-3`} style={{ fontWeight: 500 }}>{username}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className={`${font} text-[14px] text-[#999]`}>{t("account_email")}</p>
                {editingProfile ? (
                  <input value={email} onChange={(e) => setEmail(e.target.value)}
                    className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full px-6 py-3 outline-none focus:ring-1 focus:ring-[#319754]`} />
                ) : (
                  <p className={`${font} text-[14px] text-black py-3`} style={{ fontWeight: 500 }}>{email}</p>
                )}
              </div>
              <div className="space-y-2">
                <p className={`${font} text-[14px] text-[#999]`}>{t("account_phone")}</p>
                {editingProfile ? (
                  <input value={phone} onChange={(e) => setPhone(e.target.value)}
                    className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full px-6 py-3 outline-none focus:ring-1 focus:ring-[#319754]`} />
                ) : (
                  <p className={`${font} text-[14px] text-black py-3`} style={{ fontWeight: 500 }}>{phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Password card */}
          <div className="bg-white rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-4">
              <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("account_password")}</p>
              {!editingPassword ? (
                <button onClick={() => setEditingPassword(true)}
                  className={`bg-[#f5f5f5] flex items-center gap-2.5 px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#e5e5e5]`}>
                  <Pencil className="size-3" /> {t("account_change_pw")}
                </button>
              ) : (
                <div className="flex gap-2">
                  <button onClick={() => { setEditingPassword(false); setCurrentPassword(""); setNewPassword(""); setConfirmPassword(""); }}
                    className={`bg-[#f5f5f5] px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#e5e5e5]`}>
                    {t("common_cancel")}
                  </button>
                  <button onClick={handleSavePassword}
                    className={`bg-[#319754] text-white px-4 py-1 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#267a43]`}>
                    {t("common_save")}
                  </button>
                </div>
              )}
            </div>
            <div className="border-t border-[#d4d4d8] pt-4">
              {!editingPassword ? (
                <div className="space-y-2">
                  <p className={`${font} text-[14px] text-[#8e8e93]`}>{t("account_password_label")}</p>
                  <p className={`${font} text-[14px] text-black py-3`} style={{ fontWeight: 500 }}>************</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className={`${font} text-[14px] text-[#999]`}>{t("account_current_pw")}</p>
                    <div className="relative">
                      <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full px-6 py-3 pr-10 outline-none focus:ring-1 focus:ring-[#319754]`}
                        placeholder={t("account_current_pw_ph")} />
                      <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#999]">
                        {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className={`${font} text-[14px] text-[#999]`}>{t("account_new_pw")}</p>
                    <div className="relative">
                      <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full px-6 py-3 pr-10 outline-none focus:ring-1 focus:ring-[#319754]`}
                        placeholder={t("account_new_pw_ph")} />
                      <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#999]">
                        {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className={`${font} text-[14px] text-[#999]`}>{t("account_confirm_pw")}</p>
                    <div className="relative">
                      <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full px-6 py-3 pr-10 outline-none focus:ring-1 focus:ring-[#319754]`}
                        placeholder={t("account_confirm_pw_ph")} />
                      <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[#999]">
                        {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Settings card */}
          <div className="bg-white rounded-[16px] p-4">
            <p className={`${font} text-[20px] text-black mb-4`} style={{ fontWeight: 500 }}>{t("account_settings")}</p>
            <div className="border-t border-[#d4d4d8] pt-4">
              <p className={`${font} text-[14px] text-[#8e8e93] mb-2`}>{t("account_about_notif")}</p>
              <div className="space-y-0">
                {([
                  { key: "orders" as const, label: t("account_notif_orders") },
                  { key: "promotions" as const, label: t("account_notif_promo") },
                  { key: "messages" as const, label: t("account_notif_msg") },
                  { key: "productStatus" as const, label: t("account_notif_status") },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between h-[48px]">
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{item.label}</p>
                    <button onClick={() => toggleNotif(item.key)}
                      className={`relative w-[40px] h-[20px] rounded-full cursor-pointer transition-colors ${notifications[item.key] ? "bg-[#319754]" : "bg-[#ebebec]"}`}>
                      <div className={`absolute top-[2px] size-[16px] rounded-full bg-white shadow-[0px_0px_1px_rgba(0,0,0,0.3),0px_2px_10px_rgba(0,0,0,0.06)] transition-all ${notifications[item.key] ? "right-[2px]" : "left-[2px]"}`} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}