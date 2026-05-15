import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";
import { ChevronLeft, ChevronDown, Store, Bell, BellOff, Truck, User as UserIcon, MapPin, Camera, Mail, Phone, BadgeCheck, Pencil, Check, Calendar as CalendarIcon, Package, PackageX, ShoppingCart, X, Wallet, MessageCircle, Megaphone, Star, AlertTriangle, Settings as SettingsIcon, Smartphone, Moon, ShieldCheck, Clock, Globe, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import imgLogo from "../../assets/logo.png";
import imgThaiPost from "../../assets/Thaipost.png";
import imgKerry from "../../assets/kerry.png";
import imgFlash from "../../assets/flashexpress.png";
import imgJT from "../../assets/jt.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type SectionId = "shop_account" | "shop_address" | "notifications" | "shipping";

interface SettingsItem {
  id: SectionId | "shop_info"; // parent อาจไม่ใช่ section ที่ render ได้
  label: string;
  icon: any;
  children?: { id: SectionId; label: string; icon: any }[];
}

const settingsSections: SettingsItem[] = [
  // ข้อมูลร้านค้า — parent menu มี 2 sub-items
  { id: "shop_info", label: "ข้อมูลร้านค้า", icon: Store, children: [
    { id: "shop_account", label: "บัญชีร้านค้า", icon: UserIcon },
    { id: "shop_address", label: "ที่อยู่ร้านค้า", icon: MapPin },
  ]},
  { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
  { id: "shipping", label: "การจัดส่ง", icon: Truck },
];

// แมพหา label จาก section id (สำหรับ page title)
const sectionLabels: Record<SectionId, string> = {
  shop_account:  "บัญชีร้านค้า",
  shop_address:  "ที่อยู่ร้านค้า",
  notifications: "การแจ้งเตือน",
  shipping:      "การจัดส่ง",
};

/* ========== SIDEBAR (ตรง pattern เดียวกับ OwnerDashboard Sidebar) ========== */
const sidebarActiveStyle = { backgroundImage: "linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)" };

function MenuBtn({ isActive, icon: Icon, label, onClick, collapsed, hasArrow, expanded }: {
  isActive?: boolean; icon: any; label: string; onClick: () => void; collapsed: boolean; hasArrow?: boolean; expanded?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      title={collapsed ? label : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 25 }}
      className={`group/btn relative w-full flex items-center ${collapsed ? "justify-center p-2" : "gap-2.5 pl-2 pr-3 py-2"} rounded-[200px] cursor-pointer transition-colors ${!isActive ? "bg-white hover:bg-gray-50" : ""}`}
      style={!collapsed && isActive ? sidebarActiveStyle : {}}
    >
      <motion.div
        className={`size-[28px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5] group-hover/btn:bg-[#319754]/15"}`}
        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Icon className={`size-3 ${isActive ? "text-white" : "text-black/85"}`} />
      </motion.div>
      {!collapsed && (
        <span className={`${font} text-[14px] whitespace-nowrap flex-1 text-left ${isActive ? "text-[#319754]" : "text-black"}`} style={{ fontWeight: 500 }}>
          {label}
        </span>
      )}
      {!collapsed && hasArrow && (
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
          <ChevronDown className="size-3.5 text-gray-400" strokeWidth={2.4} />
        </motion.div>
      )}
    </motion.button>
  );
}

function SettingsSidebar({ active, onSelect, collapsed, onToggle }: {
  active: SectionId; onSelect: (id: SectionId) => void; collapsed: boolean; onToggle: () => void;
}) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ shop_info: true });
  const toggle = (id: string) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  const withTooltip = (label: string, node: React.ReactNode) => collapsed ? (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger asChild><div>{node}</div></TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content side="right" sideOffset={12}
          className={`${font} bg-white text-gray-700 text-[12px] rounded-xl px-3 py-2 shadow-[0px_4px_16px_rgba(0,0,0,0.1)] border border-gray-100 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[side=right]:slide-in-from-left-1`}
          style={{ fontWeight: 500 }}>
          {label}
          <TooltipPrimitive.Arrow className="fill-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.06)]" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  ) : node;

  return (
    <aside className={`flex flex-col shrink-0 p-4 h-full transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[282px]"}`}>
      <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-full">
        {/* Header — ตรง OwnerDashboard pattern */}
        <div className={`flex items-center h-[77px] pr-0 ${collapsed ? "justify-end pl-2" : "justify-between pl-4"}`}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                key="header-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className={`${font} text-[16px] text-[#0a0a0a]`} style={{ fontWeight: 500 }}>ตั้งค่า</motion.p>
            )}
          </AnimatePresence>
          <motion.button
            onClick={onToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            className="backdrop-blur-[2px] bg-white/50 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-l-full size-[24px] flex items-center justify-center cursor-pointer shrink-0">
            <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ type: "spring", stiffness: 320, damping: 24 }}>
              <ChevronLeft className="size-3 text-[#999]" />
            </motion.div>
          </motion.button>
        </div>

        {/* Menu */}
        <TooltipPrimitive.Provider delayDuration={120}>
          <motion.nav
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
            className={`flex-1 pb-4 space-y-2.5 overflow-y-auto ${collapsed ? "px-2" : "px-4"}`}>
            {settingsSections.map((s) =>
              !s.children ? (
                <motion.div key={s.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25 }}>
                  {withTooltip(s.label,
                    <MenuBtn isActive={active === s.id} icon={s.icon} label={s.label} onClick={() => onSelect(s.id as SectionId)} collapsed={collapsed} />
                  )}
                </motion.div>
              ) : (
                <motion.div key={s.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5">
                  {/* Parent: คลิกเพื่อ toggle expand */}
                  {withTooltip(s.label,
                    <MenuBtn
                      isActive={s.children.some((c) => c.id === active)}
                      icon={s.icon}
                      label={s.label}
                      onClick={() => toggle(s.id)}
                      collapsed={collapsed}
                      hasArrow={!collapsed}
                      expanded={expandedMenus[s.id]}
                    />
                  )}
                  {/* Children — accordion */}
                  {!collapsed && (
                    <AnimatePresence initial={false}>
                      {expandedMenus[s.id] && (
                        <motion.div
                          key="submenu"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden">
                          <motion.div
                            initial="hidden"
                            animate="show"
                            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.03 } } }}
                            className="rounded-[16px] border border-[#f5f5f5] p-2.5 space-y-2.5">
                            {s.children.map((child) => (
                              <motion.div key={child.id}
                                variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                                transition={{ duration: 0.2 }}>
                                <MenuBtn isActive={active === child.id} icon={child.icon} label={child.label} onClick={() => onSelect(child.id)} collapsed={collapsed} />
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </motion.div>
              )
            )}
          </motion.nav>
        </TooltipPrimitive.Provider>
      </div>
    </aside>
  );
}

/* ========== DIVIDER ========== */
function Divider() {
  return (
    <div className="h-0 relative w-full">
      <div className="absolute inset-[-1px_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
          <line stroke="#D4D4D8" x2="1094" y1="0.5" y2="0.5" />
        </svg>
      </div>
    </div>
  );
}

/* ========== EDIT BUTTON ========== */
function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-[#f5f5f5] flex gap-2.5 items-center justify-center px-4 py-1 rounded-full cursor-pointer shrink-0 hover:bg-[#eee] transition-colors">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M12 0H0V12H12V0Z" fill="black" opacity="0" /><path d="M10.1464 1.14645C9.95118 0.951184 9.63459 0.951184 9.43934 1.14645L1.5 9.08578V10.5H2.91421L10.8536 2.56066C11.0488 2.36541 11.0488 2.04882 10.8536 1.85357L10.1464 1.14645Z" fill="black" fillOpacity="0.85" /></svg>
      <span className={`${font} text-[12px] text-black`}>แก้ไข</span>
    </button>
  );
}

/* ========== SAVE/CANCEL BUTTONS ========== */
function SaveCancelButtons({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-2.5 shrink-0">
      <button onClick={onCancel} className="border border-[#ff3b30] text-[#ff3b30] px-5 py-1.5 rounded-full text-[13px] cursor-pointer hover:bg-red-50 transition-colors" style={{ fontWeight: 500 }}>ยกเลิก</button>
      <button onClick={onSave} className="bg-[#319754] text-white px-5 py-1.5 rounded-full text-[13px] cursor-pointer hover:bg-[#2a8248] transition-colors" style={{ fontWeight: 500 }}>บันทึก</button>
    </div>
  );
}

/* ========== INFO BADGE ========== */
function InfoBadge({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-center w-full">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
        <path d="M14 0H0V14H14V0Z" fill="#8E8E93" opacity="0" />
        <path d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM6.25 4.5V3.5H7.75V4.5H6.25ZM6.25 10.5V6H7.75V10.5H6.25Z" fill="#8E8E93" />
      </svg>
      <p className={`${font} text-[12px] text-[#8e8e93] flex-1`}>{text}</p>
    </div>
  );
}

/* ========== SHOP INFO SECTION (บัญชีร้านค้า — Redesigned) ========== */
function ShopInfoSection() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("METAHERB Store");
  const [email, setEmail] = useState("METAHERB@gmail.com");
  const [phone, setPhone] = useState("090-000-0000");
  const [tagline, setTagline] = useState("ร้านค้าสมุนไพรออร์แกนิก เพื่อสุขภาพที่ดีของทุกคน");

  const handleSave = () => { setEditing(false); toast.success("บันทึกข้อมูลร้านค้าเรียบร้อย"); };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

      {/* LEFT: Profile card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Cover banner — gradient + leaf pattern + decorative blobs */}
        <div className="relative h-32 overflow-hidden" style={{
          background: "linear-gradient(135deg, #319754 0%, #46A165 50%, #7bc290 100%)",
        }}>
          {/* Decorative blobs */}
          <div className="absolute -top-10 -right-6 size-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute -bottom-8 -left-4 size-28 rounded-full bg-white/8 blur-lg" />
          {/* Dot pattern overlay */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, white 1.5px, transparent 1.5px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px), radial-gradient(circle at 60% 70%, white 1px, transparent 1px)",
            backgroundSize: "32px 32px, 24px 24px, 28px 28px",
          }} />
        </div>

        {/* Profile body */}
        <div className="px-5 pb-5 flex flex-col items-center gap-3 -mt-14">
          {/* Avatar with camera overlay + online indicator */}
          <div className="relative group/avatar">
            {/* Outer glow ring on hover */}
            <motion.div
              className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[#319754] via-[#46A165] to-[#7bc290] opacity-0 group-hover/avatar:opacity-100 blur transition-opacity duration-500"
              aria-hidden
            />
            <div className="relative size-28 rounded-full overflow-hidden ring-4 ring-white shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)] bg-white">
              <img src={imgLogo} alt="Store" className="size-full object-cover" />
            </div>
            {/* Camera button — bottom right */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.1, rotate: -8 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className="absolute bottom-0 right-0 size-9 rounded-full bg-[#319754] hover:bg-[#287745] flex items-center justify-center cursor-pointer shadow-[0_4px_10px_rgba(49,151,84,0.5)] ring-[3px] ring-white"
              title="เปลี่ยนรูปโปรไฟล์">
              <Camera className="size-4 text-white" strokeWidth={2.4} />
            </motion.button>
            {/* Online indicator — top right */}
            <div className="absolute top-1 right-1 flex items-center justify-center">
              <span className="absolute inline-flex size-3 rounded-full bg-[#10b981] opacity-75 animate-ping" />
              <span className="relative inline-flex size-3 rounded-full bg-[#10b981] ring-2 ring-white" />
            </div>
          </div>

          {/* Shop name + verified badge */}
          <div className="flex flex-col items-center gap-1 mt-1">
            <div className="flex items-center gap-1.5">
              <p className={`${font} text-[18px] text-black`} style={{ fontWeight: 700 }}>{name}</p>
              <BadgeCheck className="size-5 text-[#319754]" strokeWidth={2.4} fill="#319754" stroke="#fff" />
            </div>
            {/* Verified pill */}
            <span className={`${font} inline-flex items-center gap-1 bg-[#319754]/10 text-[#319754] text-[10px] px-2 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>
              <Check className="size-2.5" strokeWidth={3} />
              ร้านค้ายืนยันแล้ว
            </span>
          </div>

          {/* Tagline — quoted */}
          <p className={`${font} text-[12px] text-gray-600 text-center leading-relaxed italic mt-1 px-3`}>
            "{tagline}"
          </p>

          {/* Stats grid — premium card with gradient */}
          <div className="grid grid-cols-3 gap-px bg-gray-100 rounded-2xl overflow-hidden w-full mt-3 border border-gray-100">
            {[
              { Icon: Package,      label: "สินค้า",  value: "248",   color: "#319754" },
              { Icon: ShoppingCart, label: "ออเดอร์", value: "1,432", color: "#0088ff" },
              { Icon: CalendarIcon, label: "เริ่ม",    value: "2566",  color: "#9747ff" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-3 flex flex-col items-center gap-1">
                <div className="size-7 rounded-full flex items-center justify-center" style={{ backgroundColor: `${s.color}1a` }}>
                  <s.Icon className="size-3.5" style={{ color: s.color }} strokeWidth={2.4} />
                </div>
                <p className={`${font} text-[16px] text-black tabular-nums leading-none mt-1`} style={{ fontWeight: 700 }}>{s.value}</p>
                <p className={`${font} text-[10px] text-gray-500`}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Contact pills — gradient bg */}
          <div className="flex flex-col gap-2 w-full mt-2">
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#319754]/5 to-transparent rounded-xl px-3 py-2.5 border border-[#319754]/10 hover:border-[#319754]/30 transition-colors">
              <div className="size-7 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                <Mail className="size-3.5 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`${font} text-[10px] text-gray-500 leading-none`}>อีเมล</p>
                <p className={`${font} text-[12px] text-gray-800 truncate mt-0.5`} style={{ fontWeight: 500 }}>{email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-[#0088ff]/5 to-transparent rounded-xl px-3 py-2.5 border border-[#0088ff]/10 hover:border-[#0088ff]/30 transition-colors">
              <div className="size-7 rounded-full bg-[#0088ff]/10 flex items-center justify-center shrink-0">
                <Phone className="size-3.5 text-[#0088ff]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`${font} text-[10px] text-gray-500 leading-none`}>เบอร์โทรศัพท์</p>
                <p className={`${font} text-[12px] text-gray-800 truncate mt-0.5 tabular-nums`} style={{ fontWeight: 500 }}>{phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Account info form */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        {/* Section heading */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-2">
            <UserIcon className="size-4 text-[#319754]" strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลบัญชี</p>
          </div>
          {!editing ? (
            <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
              onClick={() => setEditing(true)}
              className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-3.5 h-[32px] rounded-full cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              <Pencil className="size-3" strokeWidth={2.4} />
              แก้ไข
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)}
                className={`${font} inline-flex items-center gap-1.5 text-[12px] text-gray-600 bg-gray-100 hover:bg-gray-200 px-3.5 h-[32px] rounded-full cursor-pointer transition-colors`}
                style={{ fontWeight: 500 }}>
                <X className="size-3" strokeWidth={2.4} />
                ยกเลิก
              </button>
              <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
                onClick={handleSave}
                className={`${font} inline-flex items-center gap-1.5 text-[12px] text-white bg-[#319754] hover:bg-[#287745] px-3.5 h-[32px] rounded-full cursor-pointer transition-colors shadow-[0_2px_6px_rgba(49,151,84,0.25)]`}
                style={{ fontWeight: 500 }}>
                <Check className="size-3.5" strokeWidth={2.5} />
                บันทึก
              </motion.button>
            </div>
          )}
        </div>

        {/* Form fields */}
        <FieldDisplay label="ชื่อร้านค้า" icon={Store} value={name} editing={editing} onChange={setName} placeholder="ชื่อร้านของคุณ" />
        <FieldDisplay label="คำอธิบายร้าน" icon={Pencil} value={tagline} editing={editing} onChange={setTagline} placeholder="อธิบายสั้นๆ เกี่ยวกับร้านของคุณ" />
        <FieldDisplay label="อีเมล" icon={Mail} value={email} editing={editing} onChange={setEmail} placeholder="email@example.com" type="email" />
        <FieldDisplay label="เบอร์โทรศัพท์" icon={Phone} value={phone} editing={editing} onChange={setPhone} placeholder="0xx-xxx-xxxx" />

        {/* Upload tip (only in edit mode) */}
        {editing && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#319754]/5 border border-[#319754]/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <Camera className="size-4 text-[#319754] shrink-0 mt-0.5" strokeWidth={2.2} />
            <div className="flex-1 min-w-0">
              <p className={`${font} text-[12px] text-[#287745]`} style={{ fontWeight: 600 }}>เปลี่ยนรูปโปรไฟล์</p>
              <p className={`${font} text-[11px] text-gray-600 mt-0.5`}>รองรับไฟล์ JPEG, PNG, GIF, WebP · ขนาดไม่เกิน 5MB</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FieldDisplay({ label, icon: Icon, value, editing, onChange, placeholder, type = "text" }: {
  label: string; icon?: any; value: string; editing: boolean; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
        {Icon && <Icon className="size-3 text-gray-400" strokeWidth={2.4} />}
        {label}
      </label>
      {editing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`bg-[#fafafa] h-12 w-full rounded-full px-5 text-[14px] ${font} outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all placeholder:text-[#a3a3a3]`}
          style={{ fontWeight: 500 }}
        />
      ) : (
        <div className="bg-[#fafafa]/60 h-12 flex items-center px-5 rounded-full">
          <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{value}</p>
        </div>
      )}
    </div>
  );
}

/* ========== STORE ADDRESS SECTION (ที่อยู่ร้านค้า — Redesigned) ========== */
function StoreAddressSection() {
  const [editing, setEditing] = useState(false);
  const [houseNo, setHouseNo] = useState("459/153");
  const [village, setVillage] = useState("หมู่บ้านนิวไฮบ์");
  const [road, setRoad] = useState("สุขสวัสดิ์");
  const [subdistrict, setSubdistrict] = useState("ราษฎร์บูรณะ");
  const [district, setDistrict] = useState("ราษฎร์บูรณะ");
  const [province, setProvince] = useState("กรุงเทพมหานคร");
  const [postalCode, setPostalCode] = useState("10140");

  const handleSave = () => { setEditing(false); toast.success("บันทึกที่อยู่ร้านค้าเรียบร้อย"); };

  // ที่อยู่เต็ม — รวมจาก fields ทั้งหมด (สำหรับแสดงบนการ์ดสรุป)
  const fullAddress = [
    houseNo && `${houseNo}`,
    village,
    road && `ถ.${road}`,
    subdistrict && `แขวง${subdistrict}`,
    district && `เขต${district}`,
    province,
    postalCode,
  ].filter(Boolean).join(" ");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">

      {/* LEFT: Location preview card */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
        {/* Map area — stylized fake map */}
        <div className="relative h-[260px] overflow-hidden bg-gradient-to-br from-[#e8f5ec] via-[#f0faf3] to-[#e8f5ec]">
          {/* Grid lines (เหมือน street layout) */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: `
              linear-gradient(rgba(49,151,84,0.15) 1px, transparent 1px),
              linear-gradient(90deg, rgba(49,151,84,0.15) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }} />
          {/* Curved "roads" */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 260" fill="none" preserveAspectRatio="none">
            <path d="M 0 80 Q 100 60, 200 100 T 400 130" stroke="rgba(49,151,84,0.25)" strokeWidth="14" fill="none" strokeLinecap="round" />
            <path d="M 0 80 Q 100 60, 200 100 T 400 130" stroke="white" strokeWidth="2" strokeDasharray="6 6" fill="none" strokeLinecap="round" />
            <path d="M 80 0 Q 100 100, 180 180 T 220 260" stroke="rgba(49,151,84,0.2)" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M 320 0 Q 280 80, 340 160 T 360 260" stroke="rgba(49,151,84,0.15)" strokeWidth="8" fill="none" strokeLinecap="round" />
          </svg>
          {/* Decorative blocks (อาคาร) */}
          <div className="absolute top-12 left-8 size-10 bg-[#319754]/10 rounded-md rotate-3" />
          <div className="absolute top-32 right-12 size-14 bg-[#319754]/8 rounded-md -rotate-6" />
          <div className="absolute bottom-16 left-16 size-8 bg-[#319754]/12 rounded-md rotate-12" />
          <div className="absolute bottom-8 right-20 size-12 bg-[#319754]/8 rounded-md -rotate-3" />

          {/* Center pin */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Pulsing ring */}
              <span className="absolute inset-0 -m-3 rounded-full bg-[#319754]/30 animate-ping" />
              <span className="absolute inset-0 -m-2 rounded-full bg-[#319754]/20" />
              {/* Pin */}
              <motion.div
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.2 }}
                className="relative size-12 rounded-full bg-[#319754] shadow-[0_8px_20px_rgba(49,151,84,0.4)] flex items-center justify-center ring-4 ring-white"
              >
                <Store className="size-5 text-white" strokeWidth={2.4} />
              </motion.div>
              {/* Pin shadow on ground */}
              <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 w-8 h-1.5 rounded-full bg-black/15 blur-sm" />
            </div>
          </div>

          {/* "พิกัดร้าน" label top-left */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 bg-white/90 backdrop-blur rounded-full px-3 py-1 shadow-sm">
            <MapPin className="size-3 text-[#319754]" strokeWidth={2.4} />
            <span className={`${font} text-[11px] text-gray-700`} style={{ fontWeight: 500 }}>พิกัดร้านค้า</span>
          </div>
        </div>

        {/* Address summary below map */}
        <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start gap-3">
            <div className="size-10 rounded-2xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <MapPin className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${font} text-[11px] text-gray-500`}>ที่อยู่ร้านค้า</p>
              <p className={`${font} text-[14px] text-black leading-relaxed mt-0.5`} style={{ fontWeight: 500 }}>
                {fullAddress || "ยังไม่ได้กรอกที่อยู่"}
              </p>
            </div>
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-gray-100">
            <button
              onClick={() => { navigator.clipboard?.writeText(fullAddress); toast.success("คัดลอกที่อยู่แล้ว"); }}
              className={`${font} inline-flex items-center justify-center gap-2 text-[12px] text-gray-700 bg-gray-50 hover:bg-gray-100 px-3 h-[36px] rounded-full cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}
            >
              <Check className="size-3.5" strokeWidth={2.4} />
              คัดลอก
            </button>
            <button
              onClick={() => toast.info("กำลังเปิดแผนที่...")}
              className={`${font} inline-flex items-center justify-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-3 h-[36px] rounded-full cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}
            >
              <MapPin className="size-3.5" strokeWidth={2.4} />
              เปิดแผนที่
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT: Address form */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        {/* Section heading */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-[#319754]" strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลที่อยู่</p>
          </div>
          {!editing ? (
            <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
              onClick={() => setEditing(true)}
              className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-3.5 h-[32px] rounded-full cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              <Pencil className="size-3" strokeWidth={2.4} />
              แก้ไข
            </motion.button>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => setEditing(false)}
                className={`${font} inline-flex items-center gap-1.5 text-[12px] text-gray-600 bg-gray-100 hover:bg-gray-200 px-3.5 h-[32px] rounded-full cursor-pointer transition-colors`}
                style={{ fontWeight: 500 }}>
                <X className="size-3" strokeWidth={2.4} />
                ยกเลิก
              </button>
              <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
                onClick={handleSave}
                className={`${font} inline-flex items-center gap-1.5 text-[12px] text-white bg-[#319754] hover:bg-[#287745] px-3.5 h-[32px] rounded-full cursor-pointer transition-colors shadow-[0_2px_6px_rgba(49,151,84,0.25)]`}
                style={{ fontWeight: 500 }}>
                <Check className="size-3.5" strokeWidth={2.5} />
                บันทึก
              </motion.button>
            </div>
          )}
        </div>

        {/* Info notice */}
        <div className="bg-[#0088ff]/5 border border-[#0088ff]/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
          <div className="size-5 rounded-full bg-[#0088ff]/15 flex items-center justify-center shrink-0 mt-0.5">
            <span className="text-[10px] text-[#0088ff]" style={{ fontWeight: 700 }}>i</span>
          </div>
          <p className={`${font} text-[12px] text-gray-700 leading-relaxed`}>
            ที่อยู่นี้จะใช้แสดงในหน้าโปรไฟล์ร้านและเป็นข้อมูลอ้างอิงทางธุรกิจ โปรดระบุให้ถูกต้องและครบถ้วน
          </p>
        </div>

        {/* Form fields */}
        <div className="grid grid-cols-2 gap-3">
          <FieldDisplay label="บ้านเลขที่" value={houseNo} editing={editing} onChange={setHouseNo} placeholder="เช่น 459/153" />
          <FieldDisplay label="หมู่บ้าน / อาคาร" value={village} editing={editing} onChange={setVillage} placeholder="เช่น หมู่บ้านนิวไฮบ์" />
        </div>
        <FieldDisplay label="ถนน" value={road} editing={editing} onChange={setRoad} placeholder="เช่น สุขสวัสดิ์" />
        <div className="grid grid-cols-2 gap-3">
          <FieldDisplay label="ตำบล / แขวง" value={subdistrict} editing={editing} onChange={setSubdistrict} placeholder="ตำบล/แขวง" />
          <FieldDisplay label="อำเภอ / เขต" value={district} editing={editing} onChange={setDistrict} placeholder="อำเภอ/เขต" />
        </div>
        <div className="grid grid-cols-[1fr_140px] gap-3">
          <FieldDisplay label="จังหวัด" value={province} editing={editing} onChange={setProvince} placeholder="จังหวัด" />
          <FieldDisplay label="รหัสไปรษณีย์" value={postalCode} editing={editing} onChange={setPostalCode} placeholder="xxxxx" />
        </div>
      </div>
    </div>
  );
}

/* ========== NOTIFICATIONS SECTION (Redesigned — categorized + multi-channel) ========== */
type NotifChannel = "inApp" | "email" | "sms";

interface NotifItem {
  key: string;
  label: string;
  desc: string;
  enabled: boolean;
  channels: Record<NotifChannel, boolean>;
}

interface NotifCategory {
  id: string;
  label: string;
  desc: string;
  Icon: any;
  color: string;
  items: NotifItem[];
}

const initialCategories: NotifCategory[] = [
  {
    id: "orders", label: "คำสั่งซื้อ", desc: "การแจ้งเตือนที่เกี่ยวกับออเดอร์ของลูกค้า",
    Icon: ShoppingCart, color: "#319754",
    items: [
      { key: "order_new",       label: "คำสั่งซื้อใหม่",         desc: "เมื่อมีลูกค้าสั่งซื้อสินค้าใหม่",                enabled: true,  channels: { inApp: true,  email: true,  sms: true  } },
      { key: "order_status",    label: "สถานะคำสั่งซื้อเปลี่ยน", desc: "เมื่อสถานะออเดอร์มีการเปลี่ยนแปลง",            enabled: true,  channels: { inApp: true,  email: false, sms: false } },
      { key: "order_cancel",    label: "ออเดอร์ยกเลิก",          desc: "เมื่อลูกค้าหรือร้านยกเลิกออเดอร์",              enabled: true,  channels: { inApp: true,  email: true,  sms: false } },
      { key: "order_complete",  label: "ออเดอร์สำเร็จ",          desc: "เมื่อลูกค้าได้รับสินค้าและปิดออเดอร์",          enabled: false, channels: { inApp: true,  email: false, sms: false } },
    ],
  },
  {
    id: "finance", label: "การเงิน", desc: "การแจ้งเตือนที่เกี่ยวกับยอดเงินในบัญชี",
    Icon: Wallet, color: "#0088ff",
    items: [
      { key: "fin_release",   label: "ปล่อยยอดเข้าบัญชี",     desc: "เมื่อยอด Escrow ถูกปล่อยเข้ายอดพร้อมถอน",   enabled: true,  channels: { inApp: true, email: true,  sms: false } },
      { key: "fin_withdraw",  label: "ถอนเงินสำเร็จ",          desc: "เมื่อการถอนเงินเข้าบัญชีธนาคารเสร็จสมบูรณ์",  enabled: true,  channels: { inApp: true, email: true,  sms: true  } },
      { key: "fin_fee",       label: "ค่าธรรมเนียม GP",        desc: "เมื่อมีการเรียกเก็บค่าธรรมเนียม",              enabled: false, channels: { inApp: true, email: false, sms: false } },
    ],
  },
  {
    id: "inventory", label: "สต็อกสินค้า", desc: "การแจ้งเตือนเกี่ยวกับสต็อกและสินค้า",
    Icon: Package, color: "#9747ff",
    items: [
      { key: "inv_low",       label: "สินค้าใกล้หมด",          desc: "เมื่อสินค้าเหลือต่ำกว่าจำนวนที่กำหนด (10 ชิ้น)", enabled: true,  channels: { inApp: true,  email: true,  sms: false } },
      { key: "inv_out",       label: "สินค้าหมดสต็อก",         desc: "เมื่อสินค้าหมดสต็อกอย่างสมบูรณ์",                enabled: true,  channels: { inApp: true,  email: true,  sms: true  } },
      { key: "inv_flash_end", label: "Flash Sale สิ้นสุด",      desc: "เมื่อแคมเปญ Flash Sale ใกล้/สิ้นสุด",              enabled: true,  channels: { inApp: true,  email: false, sms: false } },
    ],
  },
  {
    id: "customer", label: "ลูกค้า", desc: "การโต้ตอบกับลูกค้า — ข้อความ, รีวิว, ร้องเรียน",
    Icon: MessageCircle, color: "#ff9500",
    items: [
      { key: "cus_message",   label: "ข้อความแชทใหม่",         desc: "เมื่อลูกค้าส่งข้อความเข้ามาในแชท",            enabled: true,  channels: { inApp: true, email: false, sms: false } },
      { key: "cus_review",    label: "รีวิวสินค้าใหม่",         desc: "เมื่อลูกค้ารีวิวสินค้าหลังได้รับ",            enabled: true,  channels: { inApp: true, email: true,  sms: false } },
      { key: "cus_complaint", label: "การร้องเรียนใหม่",       desc: "เมื่อลูกค้าส่งคำร้องเรียน (refund/damaged)",   enabled: true,  channels: { inApp: true, email: true,  sms: true  } },
    ],
  },
  {
    id: "marketing", label: "การตลาด & โปรโมชัน", desc: "การแจ้งเตือนแคมเปญและคูปอง",
    Icon: Megaphone, color: "#e62e05",
    items: [
      { key: "mkt_promo_end",   label: "โปรโมชันสิ้นสุด",       desc: "เมื่อโปรโมชันใกล้/สิ้นสุดเวลา",                  enabled: false, channels: { inApp: true, email: false, sms: false } },
      { key: "mkt_coupon_end",  label: "คูปองหมดอายุ",          desc: "เมื่อคูปองในระบบใกล้หมดอายุ (3 วัน)",         enabled: false, channels: { inApp: true, email: false, sms: false } },
      { key: "mkt_top_product", label: "สินค้าขายดี",           desc: "เมื่อสินค้าของคุณติด Top 10 ในหมวด",            enabled: true,  channels: { inApp: true, email: true,  sms: false } },
    ],
  },
  {
    id: "system", label: "ระบบ & ความปลอดภัย", desc: "การแจ้งเตือนเกี่ยวกับระบบและบัญชี",
    Icon: ShieldCheck, color: "#737373",
    items: [
      { key: "sys_update",   label: "อัปเดตระบบ",            desc: "เมื่อมีการอัปเดตหรือฟีเจอร์ใหม่",                enabled: true,  channels: { inApp: true,  email: false, sms: false } },
      { key: "sys_maint",    label: "การบำรุงรักษาระบบ",     desc: "แจ้งล่วงหน้าก่อนปิดปรับปรุงระบบ",                 enabled: true,  channels: { inApp: true,  email: true,  sms: false } },
      { key: "sys_security", label: "ความปลอดภัยบัญชี",       desc: "เข้าสู่ระบบจากอุปกรณ์ใหม่ / เปลี่ยนรหัสผ่าน",   enabled: true,  channels: { inApp: true,  email: true,  sms: true  } },
    ],
  },
];

const channelMeta: Record<NotifChannel, { label: string; Icon: any; color: string }> = {
  inApp: { label: "ใน-แอป", Icon: Bell,        color: "#319754" },
  email: { label: "อีเมล",   Icon: Mail,        color: "#0088ff" },
  sms:   { label: "SMS",     Icon: Smartphone,  color: "#9747ff" },
};

function NotificationsSection() {
  const [categories, setCategories] = useState<NotifCategory[]>(initialCategories);

  const toggleItem = (catId: string, itemKey: string) => {
    setCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.map((it) => it.key !== itemKey ? it : { ...it, enabled: !it.enabled }) }
    ));
  };
  const toggleChannel = (catId: string, itemKey: string, ch: NotifChannel) => {
    setCategories((prev) => prev.map((c) =>
      c.id !== catId ? c : { ...c, items: c.items.map((it) =>
        it.key !== itemKey ? it : { ...it, channels: { ...it.channels, [ch]: !it.channels[ch] } }
      )}
    ));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Categories */}
      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Category header */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100" style={{ backgroundColor: `${cat.color}08` }}>
              <div className="size-10 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${cat.color}1a` }}>
                <cat.Icon className="size-5" style={{ color: cat.color }} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 600 }}>{cat.label}</p>
                <p className={`${font} text-[12px] text-gray-500 mt-0.5`}>{cat.desc}</p>
              </div>
              <span className={`${font} text-[11px] text-gray-500 tabular-nums shrink-0`}>
                <span style={{ color: cat.color, fontWeight: 600 }}>{cat.items.filter((i) => i.enabled).length}</span>
                <span className="text-gray-400"> / {cat.items.length}</span>
              </span>
            </div>

            {/* Items */}
            <div className="divide-y divide-gray-50">
              {cat.items.map((item) => (
                <div key={item.key} className={`p-4 flex items-start gap-3 transition-colors ${item.enabled ? "" : "bg-gray-50/40"}`}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className={`${font} text-[14px] ${item.enabled ? "text-black" : "text-gray-500"}`} style={{ fontWeight: 500 }}>{item.label}</p>
                    </div>
                    <p className={`${font} text-[12px] text-gray-500 mt-0.5`}>{item.desc}</p>
                    {/* Channel selector — แสดงเฉพาะตอน enabled */}
                    {item.enabled && (
                      <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                        <span className={`${font} text-[11px] text-gray-400 mr-0.5`}>ส่งผ่าน:</span>
                        {(Object.keys(channelMeta) as NotifChannel[]).map((ch) => {
                          const meta = channelMeta[ch];
                          const active = item.channels[ch];
                          return (
                            <motion.button
                              key={ch}
                              whileTap={{ scale: 0.94 }}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => toggleChannel(cat.id, item.key, ch)}
                              className={`${font} inline-flex items-center gap-1.5 px-2.5 h-[26px] rounded-full text-[11px] cursor-pointer transition-colors`}
                              style={{
                                backgroundColor: active ? `${meta.color}1a` : "#f3f4f6",
                                color: active ? meta.color : "#9ca3af",
                                fontWeight: active ? 600 : 500,
                              }}
                              title={`${active ? "ปิด" : "เปิด"} ช่องทาง ${meta.label}`}
                            >
                              <meta.Icon className="size-3" strokeWidth={2.4} />
                              {meta.label}
                            </motion.button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {/* Master toggle */}
                  <ToggleSwitch enabled={item.enabled} onToggle={() => toggleItem(cat.id, item.key)} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ========== TOGGLE SWITCH ========== */
function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-16 h-7 rounded-full cursor-pointer transition-colors relative shrink-0 p-0.5 flex items-center ${enabled ? "bg-[#34c759]" : "bg-[rgba(60,60,67,0.3)]"}`}
    >
      <div className={`w-[39px] h-6 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-[22px]" : "translate-x-0"}`} />
    </button>
  );
}

/* ========== STEPPER INPUT ========== */
function StepperInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="bg-[#fafafa] h-12 rounded-full w-full flex items-center justify-between pl-6 pr-2 py-3">
      <input
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!isNaN(n)) onChange(Math.max(0, n));
        }}
        className={`bg-transparent text-[14px] ${font} outline-none w-full`}
      />
      <div className="h-8 shrink-0 w-[92px] relative flex items-center rounded-full overflow-hidden">
        {/* Separator */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1 h-6 w-px bg-[rgba(60,60,67,0.3)] rounded-lg" />
        {/* Decrement */}
        <button
          onClick={() => onChange(Math.max(0, value - 50))}
          className="flex-1 h-full bg-[rgba(116,116,128,0.08)] rounded-l-full flex items-center justify-center cursor-pointer hover:bg-[rgba(116,116,128,0.15)] transition-colors"
        >
          <span className="text-[17px] text-black leading-none select-none">−</span>
        </button>
        {/* Increment */}
        <button
          onClick={() => onChange(value + 50)}
          className="flex-1 h-full bg-[rgba(116,116,128,0.08)] rounded-r-full flex items-center justify-center cursor-pointer hover:bg-[rgba(116,116,128,0.15)] transition-colors"
        >
          <span className="text-[17px] text-black leading-none select-none">+</span>
        </button>
      </div>
    </div>
  );
}

/* ========== SHIPPING SECTION (Redesigned) ========== */
// Carrier badge — colored circle + ตัวอักษรย่อ (figma:asset logos render เป็น transparent stub)
interface CarrierConfig {
  id: string;
  name: string;
  code: string;
  color: string;
  logo?: string;           // path/URL ของรูปโลโก้ขนส่ง
  baseRate: number;        // ค่าส่งเริ่มต้น
  perKg: number;           // ค่าส่งต่อ kg
  cod: boolean;            // รองรับ COD
  estimatedDays: string;   // เวลาจัดส่งโดยประมาณ
  trackingUrl: string;
  enabled: boolean;
}

const initialCarriers: CarrierConfig[] = [
  { id: "thpost",  name: "ไปรษณีย์ไทย",  code: "TH",  color: "#f8201e", logo: imgThaiPost, baseRate: 35, perKg: 10, cod: true,  estimatedDays: "2-4 วัน", trackingUrl: "track.thailandpost.co.th", enabled: true  },
  { id: "kerry",   name: "Kerry Express", code: "K",   color: "#ff6600", logo: imgKerry,    baseRate: 50, perKg: 15, cod: true,  estimatedDays: "1-3 วัน", trackingUrl: "th.kerryexpress.com",       enabled: true  },
  { id: "flash",   name: "Flash Express", code: "F",   color: "#fdc70d", logo: imgFlash,    baseRate: 30, perKg: 10, cod: true,  estimatedDays: "1-2 วัน", trackingUrl: "flashexpress.com",          enabled: false },
  { id: "jt",      name: "J&T Express",   code: "J&T", color: "#d40511", logo: imgJT,       baseRate: 40, perKg: 12, cod: true,  estimatedDays: "1-3 วัน", trackingUrl: "jtexpress.co.th",           enabled: false },
  { id: "dhl",     name: "DHL Express",   code: "DHL", color: "#ffcc00",                    baseRate: 120, perKg: 50, cod: false, estimatedDays: "1 วัน",  trackingUrl: "dhl.com/th-th",             enabled: false },
];

function CarrierBadge({ carrier, size = 44 }: { carrier: CarrierConfig; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center shrink-0 text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]"
      style={{
        width: size,
        height: size,
        backgroundColor: carrier.color,
        // dark text on yellow logos for contrast
        color: ["flash", "dhl"].includes(carrier.id) ? "#1a1a1a" : "#fff",
        fontSize: size * 0.32,
        fontWeight: 800,
        letterSpacing: carrier.code.length > 2 ? "-0.5px" : "0",
      }}
    >
      {carrier.code}
    </div>
  );
}

function ShippingSection() {
  const [carriers, setCarriers] = useState<CarrierConfig[]>(initialCarriers);
  const [freeShippingMin, setFreeShippingMin] = useState(500);
  const [baseShippingCost, setBaseShippingCost] = useState(35);
  const [defaultWeight, setDefaultWeight] = useState(500);
  const [codFee, setCodFee] = useState(20);
  const [codEnabled, setCodEnabled] = useState(true);
  // รับสินค้าที่ร้าน (ฟรี)
  const [pickupEnabled, setPickupEnabled] = useState(true);
  const [pickupHours, setPickupHours] = useState("จันทร์–ศุกร์ 09:00–18:00 น.");
  const [pickupAddress, setPickupAddress] = useState("459/153 ถ.สุขสวัสดิ์ แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพฯ 10140");
  const [pickupNote, setPickupNote] = useState("กรุณาแจ้งเลขออเดอร์ที่หน้าร้านเพื่อรับสินค้า");
  // จัดส่งพื้นที่ห่างไกล (เกาะ / พื้นที่จัดส่งยาก) — ราคาเหมา
  const [remoteEnabled, setRemoteEnabled] = useState(false);
  const [remoteFee, setRemoteFee] = useState(150);
  const [remoteAreas, setRemoteAreas] = useState("เกาะสมุย, เกาะพะงัน, เกาะเต่า, เกาะช้าง, เกาะลันตา, แม่ฮ่องสอน (อ.ปาย, อ.ปางมะผ้า)");

  const toggleCarrier = (id: string) => {
    setCarriers((prev) => prev.map((c) => c.id === id ? { ...c, enabled: !c.enabled } : c));
  };
  const updateCarrier = (id: string, patch: Partial<CarrierConfig>) => {
    setCarriers((prev) => prev.map((c) => c.id === id ? { ...c, ...patch } : c));
  };

  const enabledCount = carriers.filter((c) => c.enabled).length;

  return (
    <div className="flex flex-col gap-5">
      {/* General settings */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
          <SettingsIcon className="size-4 text-[#319754]" strokeWidth={2.2} />
          <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ค่าตั้งต้นการจัดส่ง</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Free shipping minimum */}
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
              <Package className="size-3 text-gray-400" strokeWidth={2.4} />
              ส่งฟรีเมื่อซื้อครบ (฿)
            </label>
            <StepperInput value={freeShippingMin} onChange={setFreeShippingMin} />
            <p className={`${font} text-[10px] text-gray-400 pl-3`}>0 = ปิดใช้งานส่งฟรี</p>
          </div>
          {/* Base shipping cost */}
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
              <Wallet className="size-3 text-gray-400" strokeWidth={2.4} />
              ค่าจัดส่งเริ่มต้น (฿)
            </label>
            <StepperInput value={baseShippingCost} onChange={setBaseShippingCost} />
            <p className={`${font} text-[10px] text-gray-400 pl-3`}>ใช้เมื่อไม่มี shipping rate ที่ตรงกับสินค้า</p>
          </div>
          {/* Default weight */}
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
              <Truck className="size-3 text-gray-400" strokeWidth={2.4} />
              น้ำหนักเริ่มต้น (กรัม)
            </label>
            <StepperInput value={defaultWeight} onChange={setDefaultWeight} />
            <p className={`${font} text-[10px] text-gray-400 pl-3`}>สำหรับสินค้าที่ยังไม่กรอกน้ำหนัก</p>
          </div>
        </div>
      </div>

      {/* Carriers */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Truck className="size-4 text-[#319754]" strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ขนส่งที่ร้านใช้บริการ</p>
          </div>
          <span className={`${font} text-[11px] text-gray-500`}>
            <span className="text-[#319754] tabular-nums" style={{ fontWeight: 600 }}>{enabledCount}</span>
            <span className="text-gray-400"> / {carriers.length} ขนส่ง</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {carriers.map((c) => (
            <div key={c.id}
              className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)] transition-colors"
              style={{ backgroundColor: c.enabled ? c.color : "#9ca3af" }}>

              {/* HEADER — brand color bg (deep) */}
              <div className="relative overflow-hidden">
                {/* Truck illustration — inside header, behind content */}
                {c.logo && (
                  <img src={c.logo} alt=""
                    className="absolute pointer-events-none select-none z-0 transition-all"
                    style={{
                      right: 8,
                      top: 8,
                      height: "100px",
                      width: "auto",
                      maxWidth: "210px",
                      objectFit: "contain",
                      objectPosition: "right top",
                      filter: c.enabled ? "none" : "grayscale(100%)",
                    }} />
                )}
                <div className="relative z-10 flex items-start gap-3 p-4 pr-4">
                  {/* Small logo circle — white bg with brand color text */}
                  <div className="size-12 rounded-full flex items-center justify-center shrink-0 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.08)] bg-white transition-colors"
                    style={{ color: c.enabled ? c.color : "#9ca3af" }}>
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 800, letterSpacing: c.code.length > 2 ? "-0.5px" : "0" }}>
                      {c.code}
                    </span>
                  </div>
                  {/* Name + tracking URL */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`${font} text-[18px] text-white`} style={{ fontWeight: 700 }}>{c.name}</h3>
                      {c.cod && (
                        <span className={`${font} inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-white text-black`} style={{ fontWeight: 600 }}>
                          <ShieldCheck className="size-2.5 text-[#319754]" strokeWidth={2.4} />
                          COD
                        </span>
                      )}
                    </div>
                    <p className={`${font} text-[12px] mt-0.5 flex items-center gap-1.5 text-white/85 leading-none`}>
                      <Globe className="size-3 shrink-0" strokeWidth={2.4} />
                      <span className="truncate">{c.trackingUrl || "ยังไม่ได้กรอก URL ติดตาม"}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* BODY — white card with rounded all 4 corners */}
              <div className="relative z-10">
                <div className="rounded-2xl p-4 flex flex-col gap-3 bg-white">
                  {/* Master toggle row */}
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-200">
                    <span className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 600 }}>เปิดใช้งานขนส่งนี้</span>
                    <ToggleSwitch enabled={c.enabled} onToggle={() => toggleCarrier(c.id)} />
                  </div>

                  {/* Settings (disabled inputs when toggle off) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className={`${font} text-[10px] text-gray-500`}>ค่าส่งเริ่มต้น (฿)</label>
                      <input type="number" value={c.baseRate} disabled={!c.enabled}
                        onChange={(e) => updateCarrier(c.id, { baseRate: Number(e.target.value) || 0 })}
                        onFocus={(e) => {
                          if (!c.enabled) return;
                          e.currentTarget.style.borderColor = c.color;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${c.color}33`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        className={`${font} bg-white h-10 rounded-full px-4 text-[13px] tabular-nums outline-none border border-gray-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`${font} text-[10px] text-gray-500`}>ต่อ กก. (฿)</label>
                      <input type="number" value={c.perKg} disabled={!c.enabled}
                        onChange={(e) => updateCarrier(c.id, { perKg: Number(e.target.value) || 0 })}
                        onFocus={(e) => {
                          if (!c.enabled) return;
                          e.currentTarget.style.borderColor = c.color;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${c.color}33`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        className={`${font} bg-white h-10 rounded-full px-4 text-[13px] tabular-nums outline-none border border-gray-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`${font} text-[10px] text-gray-500`}>ระยะเวลาจัดส่ง</label>
                      <input value={c.estimatedDays} disabled={!c.enabled}
                        onChange={(e) => updateCarrier(c.id, { estimatedDays: e.target.value })}
                        onFocus={(e) => {
                          if (!c.enabled) return;
                          e.currentTarget.style.borderColor = c.color;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${c.color}33`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        className={`${font} bg-white h-10 rounded-full px-4 text-[13px] outline-none border border-gray-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`${font} text-[10px] text-gray-500`}>เว็บไซต์ติดตาม</label>
                      <input value={c.trackingUrl} disabled={!c.enabled}
                        onChange={(e) => updateCarrier(c.id, { trackingUrl: e.target.value })}
                        onFocus={(e) => {
                          if (!c.enabled) return;
                          e.currentTarget.style.borderColor = c.color;
                          e.currentTarget.style.boxShadow = `0 0 0 3px ${c.color}33`;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = "#e5e7eb";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                        className={`${font} bg-white h-10 rounded-full px-4 text-[13px] outline-none border border-gray-200 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* รับสินค้าที่ร้าน (ฟรี) */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Store className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>รับสินค้าที่ร้าน</p>
                <span className={`${font} inline-flex items-center gap-1 bg-[#319754] text-white text-[10px] px-2 py-0.5 rounded-full`} style={{ fontWeight: 700 }}>
                  ฟรี
                </span>
              </div>
              <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เปิดให้ลูกค้าเลือกมารับสินค้าด้วยตัวเองที่หน้าร้าน — ไม่มีค่าจัดส่ง</p>
            </div>
          </div>
          <ToggleSwitch enabled={pickupEnabled} onToggle={() => setPickupEnabled(!pickupEnabled)} />
        </div>

        <AnimatePresence initial={false}>
          {pickupEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="flex flex-col gap-4">
                {/* Address (read-only — ใช้ข้อมูลจาก "ที่อยู่ร้านค้า") */}
                <div className="bg-[#319754]/5 border border-[#319754]/20 rounded-xl p-3 flex items-start gap-2.5">
                  <MapPin className="size-4 text-[#319754] shrink-0 mt-0.5" strokeWidth={2.2} />
                  <div className="flex-1 min-w-0">
                    <p className={`${font} text-[11px] text-[#287745]`} style={{ fontWeight: 600 }}>จุดรับสินค้า</p>
                    <p className={`${font} text-[12px] text-gray-700 mt-0.5 leading-relaxed`}>{pickupAddress}</p>
                  </div>
                </div>
                {/* Hours + Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                      <Clock className="size-3 text-gray-400" strokeWidth={2.4} />
                      เวลาเปิดให้รับสินค้า
                    </label>
                    <input
                      value={pickupHours}
                      onChange={(e) => setPickupHours(e.target.value)}
                      placeholder="เช่น จันทร์–ศุกร์ 09:00–18:00 น."
                      className={`${font} bg-[#fafafa] h-12 rounded-full px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                      style={{ fontWeight: 500 }} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                      <MessageCircle className="size-3 text-gray-400" strokeWidth={2.4} />
                      หมายเหตุถึงลูกค้า
                    </label>
                    <input
                      value={pickupNote}
                      onChange={(e) => setPickupNote(e.target.value)}
                      placeholder="ข้อความที่จะแสดงให้ลูกค้าเห็น"
                      className={`${font} bg-[#fafafa] h-12 rounded-full px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                      style={{ fontWeight: 500 }} />
                  </div>
                </div>
                {/* Tip */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-start gap-2.5">
                  <div className="size-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] text-blue-600" style={{ fontWeight: 700 }}>i</span>
                  </div>
                  <p className={`${font} text-[12px] text-gray-700 leading-relaxed`}>
                    ลูกค้าจะเห็นตัวเลือก "รับสินค้าที่ร้าน (ฟรี)" ในขั้นตอนเลือกวิธีจัดส่ง · จุดรับสินค้าใช้ที่อยู่จากเมนู
                    <button onClick={() => toast.info("ไปที่หน้า ที่อยู่ร้านค้า")} className="text-[#319754] hover:underline mx-1" style={{ fontWeight: 600 }}>ที่อยู่ร้านค้า</button>
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* จัดส่งพื้นที่ห่างไกล (เกาะ / พื้นที่จัดส่งยาก) — ราคาเหมา */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#0088ff]/10 flex items-center justify-center shrink-0">
              <MapPin className="size-5 text-[#0088ff]" strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>จัดส่งพื้นที่ห่างไกล</p>
                <span className={`${font} inline-flex items-center gap-1 bg-[#0088ff]/10 text-[#0088ff] text-[10px] px-2 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>
                  ราคาเหมา
                </span>
              </div>
              <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เปิดรับออเดอร์จากเกาะ / พื้นที่จัดส่งยาก พร้อมตั้งค่าจัดส่งเหมาจ่าย</p>
            </div>
          </div>
          <ToggleSwitch enabled={remoteEnabled} onToggle={() => setRemoteEnabled(!remoteEnabled)} />
        </div>

        <AnimatePresence initial={false}>
          {remoteEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Flat rate */}
                  <div className="flex flex-col gap-1.5">
                    <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                      <Wallet className="size-3 text-gray-400" strokeWidth={2.4} />
                      ค่าจัดส่งเหมาจ่าย (฿)
                    </label>
                    <StepperInput value={remoteFee} onChange={setRemoteFee} />
                    <p className={`${font} text-[10px] text-gray-400 pl-3`}>ใช้แทนค่าส่งปกติเมื่อปลายทางอยู่ในพื้นที่ห่างไกล</p>
                  </div>
                  {/* Tip / warning */}
                  <div className="bg-[#0088ff]/5 border border-[#0088ff]/20 rounded-xl p-4 flex items-start gap-2.5">
                    <AlertTriangle className="size-4 text-[#0088ff] shrink-0 mt-0.5" strokeWidth={2.2} />
                    <div>
                      <p className={`${font} text-[12px] text-[#0066b8]`} style={{ fontWeight: 600 }}>วิธีคำนวณ</p>
                      <p className={`${font} text-[11px] text-gray-600 mt-0.5 leading-relaxed`}>
                        ค่าส่งจะถูก override เป็นราคาเหมา (฿{remoteFee.toLocaleString()}) ทันที เมื่อระบบตรวจพบที่อยู่อยู่ในรายการพื้นที่ห่างไกล
                      </p>
                    </div>
                  </div>
                </div>

                {/* Areas list (textarea) */}
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                    <MapPin className="size-3 text-gray-400" strokeWidth={2.4} />
                    รายการพื้นที่ห่างไกล
                  </label>
                  <textarea
                    value={remoteAreas}
                    onChange={(e) => setRemoteAreas(e.target.value)}
                    placeholder="ระบุชื่ออำเภอ / เกาะ / จังหวัด คั่นด้วยเครื่องหมายจุลภาค (,) เช่น เกาะสมุย, เกาะพะงัน"
                    rows={3}
                    className={`${font} bg-[#fafafa] rounded-2xl px-5 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none placeholder:text-[#a3a3a3]`}
                    style={{ fontWeight: 500 }}
                  />
                  <p className={`${font} text-[10px] text-gray-400 pl-3`}>ระบบจะตรวจที่อยู่ลูกค้าตาม keyword ในรายการนี้ (case-insensitive)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COD settings */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#ff9500]/10 flex items-center justify-center shrink-0">
              <Wallet className="size-5 text-[#ff9500]" strokeWidth={2.2} />
            </div>
            <div>
              <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>เก็บเงินปลายทาง (COD)</p>
              <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เปิดให้ลูกค้าเลือกชำระเงินเมื่อรับสินค้า</p>
            </div>
          </div>
          <ToggleSwitch enabled={codEnabled} onToggle={() => setCodEnabled(!codEnabled)} />
        </div>

        <AnimatePresence initial={false}>
          {codEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500`}>ค่าธรรมเนียม COD (฿)</label>
                  <StepperInput value={codFee} onChange={setCodFee} />
                  <p className={`${font} text-[10px] text-gray-400 pl-3`}>เพิ่มต่อออเดอร์ที่ใช้ COD</p>
                </div>
                <div className="bg-[#ff9500]/5 border border-[#ff9500]/20 rounded-xl p-4 flex items-start gap-2.5">
                  <AlertTriangle className="size-4 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2.2} />
                  <div>
                    <p className={`${font} text-[12px] text-[#9a3412]`} style={{ fontWeight: 600 }}>ข้อแนะนำ COD</p>
                    <p className={`${font} text-[11px] text-gray-600 mt-0.5 leading-relaxed`}>
                      ออเดอร์ COD มีโอกาสถูกปฏิเสธรับสินค้าสูงกว่า แนะนำให้เก็บค่าธรรมเนียมเพื่อชดเชยความเสี่ยง
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

/* ========== MAIN ========== */
export function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>("shop_account");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`flex h-full overflow-hidden bg-[#fafafa] ${font}`}>
      {/* Sidebar — fixed (ไม่เลื่อนตามหน้า) */}
      <div className="h-full md:overflow-y-auto shrink-0">
        <SettingsSidebar
          active={activeSection}
          onSelect={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Content — เฉพาะส่วนนี้ที่ scroll */}
      <main className="flex-1 px-4 overflow-y-auto min-w-0 min-h-0">
        {/* Page title */}
        <div className="flex items-center h-[100px]">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>
            {sectionLabels[activeSection]}
          </p>
        </div>

        {/* Section content */}
        <div className="flex flex-col gap-4 pb-8">
          {activeSection === "shop_account"  && <ShopInfoSection />}
          {activeSection === "shop_address"  && <StoreAddressSection />}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "shipping"      && <ShippingSection />}
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;