import React, { useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  BarChart3, Users, ShoppingCart, Package, Settings, Image as ImageIcon, TrendingUp,
  Shield, DollarSign, Megaphone, UserCog, BarChart2, ShoppingBag,
  Plus, Pencil, Trash2, MoreHorizontal, Eye, Search, ChevronLeft, ChevronDown,
  Check, X, Mail, Phone, FileText, Store, AlertCircle, Star, Video,
  Home, Info, LayoutPanelTop, PanelBottom, Bell, Truck, MapPin, Globe, Tag, Zap, Ticket, Folder,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const ADMIN_PRIMARY = "#319754";
const ADMIN_PRIMARY_DARK = "#287745";

/* ========== MOCK DATA ========== */
const salesData = [
  { month: "ม.ค.", sales: 42000, orders: 120 },
  { month: "ก.พ.", sales: 55000, orders: 150 },
  { month: "มี.ค.", sales: 38000, orders: 95 },
  { month: "เม.ย.", sales: 62000, orders: 180 },
  { month: "พ.ค.", sales: 71000, orders: 210 },
  { month: "มิ.ย.", sales: 48000, orders: 130 },
];

const categoryData = [
  { name: "เครื่องดื่ม", value: 35 },
  { name: "อาหาร",       value: 25 },
  { name: "สมุนไพร",     value: 20 },
  { name: "ครีม",         value: 12 },
  { name: "อื่นๆ",         value: 8  },
];
const COLORS = ["#3b82f6", "#319754", "#f59e0b", "#9747ff", "#ff9500"];

/* ========== SECTION + ITEM TYPES ========== */
type AdminSection = "overview" | "content" | "pages" | "settings";

type ItemId = string;

interface AdminItem {
  id: ItemId;
  label: string;
  icon: any;
  children?: { id: ItemId; label: string; icon?: any }[];
}

// Map URL path → section
const pathToSection = (path: string): AdminSection => {
  if (path.startsWith("/admin/content"))  return "content";
  if (path.startsWith("/admin/pages"))    return "pages";
  if (path.startsWith("/admin/settings")) return "settings";
  return "overview";
};

// Sidebar config per section
const sectionMenus: Record<AdminSection, AdminItem[]> = {
  overview: [
    { id: "dashboard",  label: "Dashboard",      icon: BarChart3 },
    { id: "report",     label: "Report",         icon: FileText, children: [
      { id: "report_sales",     label: "รายงานผลยอดขาย",   icon: TrendingUp },
      { id: "report_customers", label: "รายงานข้อมูลลูกค้า", icon: Users },
      { id: "report_products",  label: "รายงานข้อมูลสินค้า", icon: ShoppingBag },
      { id: "report_marketing", label: "รายงานผลการตลาด",  icon: BarChart2 },
    ]},
    { id: "complaints", label: "การร้องเรียน",    icon: AlertCircle },
    { id: "products",   label: "สินค้า",          icon: Package, children: [
      { id: "products_manage",    label: "จัดการสินค้า",          icon: Package },
      { id: "products_categories", label: "จัดการหมวดหมู่สินค้า", icon: Folder },
      { id: "products_promotions", label: "จัดการโปรโมชั่น",       icon: Megaphone },
      { id: "products_flash",     label: "Flash Sale Events",      icon: Zap },
      { id: "products_coupons",   label: "คูปอง",                  icon: Ticket },
      { id: "products_tags",      label: "แท็กสินค้า",              icon: Tag },
    ]},
    { id: "reviews",    label: "จัดการรีวิว",     icon: Star },
    { id: "orders",     label: "คำสั่งซื้อ",       icon: ShoppingCart },
  ],
  content: [
    { id: "content_banner", label: "Banner",   icon: ImageIcon },
    { id: "content_blog",   label: "บทความ",   icon: FileText },
    { id: "content_video",  label: "วิดีโอ",    icon: Video },
    { id: "content_index",  label: "Index",    icon: Search },
  ],
  pages: [
    { id: "page_home",      label: "หน้าหลัก",                 icon: Home },
    { id: "page_products",  label: "หน้าผลิตภัณฑ์ทั้งหมด",  icon: Package },
    { id: "page_blog",      label: "สาระความรู้ทั้งหมด",     icon: FileText },
    { id: "page_about",     label: "เกี่ยวกับเรา",              icon: Info },
    { id: "page_appbar",    label: "Appbar",                    icon: LayoutPanelTop },
    { id: "page_footer",    label: "Footer",                    icon: PanelBottom },
  ],
  settings: [
    { id: "site_info", label: "ข้อมูลเว็บไซต์", icon: Globe, children: [
      { id: "site_info_general", label: "ข้อมูลเว็บไซต์", icon: Settings },
      { id: "site_info_contact", label: "ข้อมูลติดต่อ",    icon: Phone },
      { id: "site_info_address", label: "ที่อยู่",          icon: MapPin },
      { id: "site_info_social",  label: "Social Media",   icon: Globe },
    ]},
    { id: "settings_shipping",      label: "การจัดส่ง",     icon: Truck },
    { id: "settings_notifications", label: "การแจ้งเตือน",   icon: Bell },
    { id: "settings_users", label: "ผู้ใช้งาน", icon: UserCog, children: [
      { id: "users_list", label: "ผู้ใช้",          icon: Users },
      { id: "shops_list", label: "ทะเบียนร้านค้า", icon: Store },
    ]},
  ],
};

const sectionLabels: Record<AdminSection, string> = {
  overview: "ภาพรวม",
  content:  "เนื้อหาบนเว็บ",
  pages:    "จัดการหน้าเว็บไซต์",
  settings: "ตั้งค่า",
};

// Default first item per section
const defaultItem: Record<AdminSection, ItemId> = {
  overview: "dashboard",
  content:  "content_banner",
  pages:    "page_home",
  settings: "site_info_general",
};

/* ========== SIDEBAR ========== */
const sidebarActiveStyle = { backgroundImage: `linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)` };

function MenuBtn({ isActive, icon: Icon, label, onClick, hasArrow, expanded, collapsed }: {
  isActive?: boolean; icon: any; label: string; onClick: () => void; hasArrow?: boolean; expanded?: boolean; collapsed: boolean;
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
        className={`size-[28px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "" : "bg-[#f5f5f5] group-hover/btn:bg-[#319754]/15"}`}
        style={isActive ? { backgroundColor: ADMIN_PRIMARY } : {}}
        animate={isActive ? { scale: [1, 1.08, 1] } : { scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Icon className={`size-3 ${isActive ? "text-white" : "text-black/85"}`} />
      </motion.div>
      {!collapsed && (
        <span className={`${font} text-[14px] whitespace-nowrap flex-1 text-left ${isActive ? "" : "text-black"}`}
          style={{ color: isActive ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
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

function AdminSidebar({ section, active, onSelect, collapsed, onToggle }: {
  section: AdminSection; active: ItemId; onSelect: (id: ItemId) => void; collapsed: boolean; onToggle: () => void;
}) {
  const items = sectionMenus[section];
  // Auto-expand parent that contains active child on mount/change
  const initialExpanded = useMemo(() => {
    const map: Record<string, boolean> = {};
    items.forEach((it) => {
      if (it.children?.some((c) => c.id === active)) map[it.id] = true;
      else if (it.children) map[it.id] = false;
    });
    return map;
  }, [section, active, items]);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(initialExpanded);
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
        {/* Header */}
        <div className={`flex items-center h-[77px] pr-0 ${collapsed ? "justify-end pl-2" : "justify-between pl-4"}`}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                key="header-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2">
                <Shield className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                <p className={`${font} text-[16px] text-[#0a0a0a]`} style={{ fontWeight: 500 }}>{sectionLabels[section]}</p>
              </motion.div>
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
            key={section}
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
            className={`flex-1 pb-4 space-y-2.5 overflow-y-auto ${collapsed ? "px-2" : "px-4"}`}>
            {items.map((item) =>
              !item.children ? (
                <motion.div key={item.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25 }}>
                  {withTooltip(item.label,
                    <MenuBtn isActive={active === item.id} icon={item.icon} label={item.label} onClick={() => onSelect(item.id)} collapsed={collapsed} />
                  )}
                </motion.div>
              ) : (
                <motion.div key={item.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25 }}
                  className="space-y-2.5">
                  {withTooltip(item.label,
                    <MenuBtn
                      isActive={item.children.some((c) => c.id === active)}
                      icon={item.icon} label={item.label}
                      onClick={() => toggle(item.id)}
                      collapsed={collapsed} hasArrow={!collapsed} expanded={expandedMenus[item.id]}
                    />
                  )}
                  {!collapsed && (
                    <AnimatePresence initial={false}>
                      {expandedMenus[item.id] && (
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
                            {item.children.map((child) => (
                              <motion.div key={child.id}
                                variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                                transition={{ duration: 0.2 }}>
                                <MenuBtn isActive={active === child.id} icon={child.icon || Package} label={child.label} onClick={() => onSelect(child.id)} collapsed={collapsed} />
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

/* ========== DASHBOARD CONTENT ========== */
function DashboardContent() {
  const stats = [
    { label: "รายได้รวม",        value: "฿316,000", change: "+18%", color: "#319754", Icon: DollarSign,    hint: "เทียบเดือนที่แล้ว" },
    { label: "คำสั่งซื้อทั้งหมด", value: "885",      change: "+24",  color: "#3b82f6", Icon: ShoppingCart,  hint: "เดือนนี้" },
    { label: "ลูกค้าทั้งหมด",     value: "1,245",    change: "+56",  color: "#9747ff", Icon: Users,         hint: "ลูกค้าใหม่ + กลับมาซื้อ" },
    { label: "ร้านค้าทั้งหมด",    value: "32",       change: "+3",   color: "#ff9500", Icon: Store,         hint: "ร้านค้าที่ active" },
  ];

  const pendingActions = [
    { label: "ร้านค้ารอตรวจสอบ", count: 4, color: "#ff9500", Icon: Store },
    { label: "ร้องเรียนใหม่",      count: 7, color: "#ff3b30", Icon: AlertCircle },
    { label: "Banner รอเผยแพร่",   count: 2, color: "#9747ff", Icon: ImageIcon },
    { label: "รีพอร์ตจากผู้ใช้",   count: 3, color: "#f59e0b", Icon: Shield },
  ];

  const activities = [
    { actor: "ร้าน บ้านสมุนไพร",        action: "สมัครเข้าระบบ — รอตรวจสอบ",         time: "5 นาทีที่แล้ว",  color: "#319754", Icon: Store         },
    { actor: "user_24856",                action: "ลงทะเบียนเป็นลูกค้าใหม่",              time: "12 นาทีที่แล้ว", color: "#3b82f6", Icon: Users         },
    { actor: "DSP-20260509-014",         action: "ร้องเรียนใหม่จาก Metaherb Store",     time: "28 นาทีที่แล้ว", color: "#ff3b30", Icon: AlertCircle    },
    { actor: "ร้าน อโรม่าฟาร์ม",        action: "ส่งเอกสารเพิ่มเติม",                   time: "1 ชม. ที่แล้ว",  color: "#319754", Icon: Store         },
    { actor: "Hero Banner — Summer",      action: "ร่างใหม่รอเผยแพร่",                     time: "2 ชม. ที่แล้ว",  color: "#9747ff", Icon: ImageIcon      },
    { actor: "user_24820",                action: "รายงานสินค้าผิดกฎ — Power Boost+",   time: "3 ชม. ที่แล้ว",  color: "#ff9500", Icon: Shield        },
  ];

  const topShops = [
    { rank: 1, name: "Metaherb Store",      orders: 412, revenue: 145200, growth: "+24%", color: "#319754" },
    { rank: 2, name: "บ้านสมุนไพรไทย",   orders: 318, revenue: 98640,  growth: "+18%", color: "#3b82f6" },
    { rank: 3, name: "อโรม่าฟาร์ม",      orders: 264, revenue: 72180,  growth: "+12%", color: "#9747ff" },
    { rank: 4, name: "Wellness Garden",    orders: 198, revenue: 58420,  growth: "+9%",  color: "#ff9500" },
    { rank: 5, name: "Herb & Soul",        orders: 156, revenue: 41250,  growth: "+5%",  color: "#737373" },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label}
            className="group rounded-2xl p-4 flex flex-col gap-3 transition-all cursor-default border hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)]"
            style={{ backgroundColor: `${s.color}0d`, borderColor: `${s.color}33` }}>
            <div className="flex items-center justify-between gap-2">
              <p className={`${font} text-[12px] truncate`} style={{ color: s.color, fontWeight: 600 }}>{s.label}</p>
              <div className="size-9 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 shrink-0"
                style={{ backgroundColor: s.color }}>
                <s.Icon className="size-4 text-white" strokeWidth={2.4} />
              </div>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p className={`${font} text-[22px] text-[#101828] tabular-nums leading-none`} style={{ fontWeight: 700 }}>{s.value}</p>
              <span className={`${font} text-[11px] tabular-nums`} style={{ color: s.color, fontWeight: 600 }}>{s.change}</span>
            </div>
            <p className={`${font} text-[11px]`} style={{ color: `${s.color}cc` }}>{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
          <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
            <BarChart3 className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ยอดขายรายเดือน</p>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} />
              <YAxis tick={{ fontSize: 12, fill: "#999" }} />
              <Tooltip cursor={{ fill: "rgba(49,151,84,0.05)" }} />
              <Bar dataKey="sales" fill={ADMIN_PRIMARY} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3">
          <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="size-4 text-[#ff9500]" strokeWidth={2.2} />
              <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>รายการรอดำเนินการ</p>
            </div>
            <span className={`${font} text-[11px] text-gray-500 tabular-nums`}>
              <span style={{ color: "#ff3b30", fontWeight: 600 }}>{pendingActions.reduce((acc, p) => acc + p.count, 0)}</span> รายการ
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {pendingActions.map((p) => (
              <motion.button key={p.label}
                whileTap={{ scale: 0.98 }} whileHover={{ scale: 1.01, x: 2 }}
                onClick={() => toast.info(p.label)}
                className="group/row flex items-center gap-3 p-3 rounded-2xl bg-[#fafbfc] hover:bg-white border border-transparent hover:border-gray-200 cursor-pointer transition-all">
                <div className="size-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${p.color}1a` }}>
                  <p.Icon className="size-5" style={{ color: p.color }} strokeWidth={2.2} />
                </div>
                <p className={`${font} text-[13px] text-black flex-1 text-left`} style={{ fontWeight: 500 }}>{p.label}</p>
                <span className={`${font} inline-flex items-center justify-center min-w-[28px] h-[24px] px-2 rounded-full tabular-nums text-[12px] text-white shadow-sm transition-transform group-hover/row:scale-110`}
                  style={{ backgroundColor: p.color, fontWeight: 700 }}>{p.count}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
          <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
            <Package className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>สัดส่วนสินค้าขายดี</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} dataKey="value">
                {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-x-3 gap-y-1.5">
            {categoryData.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className={`${font} text-[11px] text-gray-600`}>{c.name}</span>
                <span className={`${font} text-[11px] text-gray-400 tabular-nums`}>{c.value}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3">
          <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
              <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>กิจกรรมล่าสุด</p>
            </div>
            <button className={`${font} text-[12px] hover:underline cursor-pointer`} style={{ color: ADMIN_PRIMARY, fontWeight: 500 }}>ดูทั้งหมด</button>
          </div>
          <div className="flex flex-col">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
                <div className="size-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${a.color}1a` }}>
                  <a.Icon className="size-4" style={{ color: a.color }} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }}>{a.actor}</p>
                  <p className={`${font} text-[11px] text-gray-500 truncate`}>{a.action}</p>
                </div>
                <span className={`${font} text-[10px] text-gray-400 shrink-0 mt-1`}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ร้านค้ายอดเยี่ยมเดือนนี้</p>
          </div>
          <button className={`${font} text-[12px] hover:underline cursor-pointer`} style={{ color: ADMIN_PRIMARY, fontWeight: 500 }}>ดูทั้งหมด</button>
        </div>
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "8%" }} /><col style={{ width: "32%" }} /><col style={{ width: "20%" }} /><col style={{ width: "25%" }} /><col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>อันดับ</th>
              <th className="text-left pb-3 pr-4"   style={{ fontWeight: 500 }}>ร้านค้า</th>
              <th className="text-right pb-3 pr-4"  style={{ fontWeight: 500 }}>คำสั่งซื้อ</th>
              <th className="text-right pb-3 pr-4"  style={{ fontWeight: 500 }}>รายได้</th>
              <th className="text-right pb-3"       style={{ fontWeight: 500 }}>เติบโต</th>
            </tr>
          </thead>
          <tbody>
            {topShops.map((s) => (
              <tr key={s.rank} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-4 text-center">
                  <span className={`${font} inline-flex items-center justify-center size-7 rounded-full text-white tabular-nums text-[12px]`}
                    style={{ backgroundColor: s.color, fontWeight: 700 }}>{s.rank}</span>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2.5">
                    <div className="size-9 rounded-full flex items-center justify-center text-white text-[12px]"
                      style={{ backgroundColor: s.color, fontWeight: 700 }}>{s.name.charAt(0)}</div>
                    <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td className={`${font} py-3 pr-4 text-right text-[13px] text-black tabular-nums`} style={{ fontWeight: 500 }}>{s.orders.toLocaleString()}</td>
                <td className={`${font} py-3 pr-4 text-right text-[13px] tabular-nums`} style={{ color: "#319754", fontWeight: 600 }}>฿{s.revenue.toLocaleString()}</td>
                <td className="py-3 text-right">
                  <span className={`${font} inline-flex items-center gap-1 text-[12px] tabular-nums`} style={{ color: "#319754", fontWeight: 600 }}>
                    <TrendingUp className="size-3" strokeWidth={2.4} />{s.growth}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== REPORT CONTENT ========== */
function ReportContent({ tab }: { tab: "report_sales" | "report_customers" | "report_products" | "report_marketing" }) {
  const isCustomer  = tab === "report_customers";
  const isProduct   = tab === "report_products";
  const isMarketing = tab === "report_marketing";

  const kpis = isCustomer ? [
    { label: "ลูกค้าใหม่วันนี้",  value: "12",   color: "#319754" },
    { label: "ลูกค้าที่กลับมา",    value: "45%",  color: "#3b82f6" },
    { label: "มูลค่าเฉลี่ย/ออเดอร์", value: "฿450", color: "#9747ff" },
    { label: "อัตราซื้อซ้ำ",        value: "28%",  color: "#ff9500" },
  ] : isProduct ? [
    { label: "สินค้าขายดี",       value: "ชาออร์แกนิก", color: "#319754" },
    { label: "สต็อกต่ำ",           value: "3 รายการ",    color: "#ff3b30" },
    { label: "หมวดหมู่ยอดนิยม",   value: "เครื่องดื่ม",  color: "#3b82f6" },
    { label: "รีวิวเฉลี่ย",         value: "4.6 ★",       color: "#f59e0b" },
  ] : isMarketing ? [
    { label: "Conversion Rate", value: "3.2%",     color: "#319754" },
    { label: "Click Rate",       value: "12.5%",    color: "#3b82f6" },
    { label: "Revenue from Ads", value: "฿25,000",  color: "#9747ff" },
    { label: "Campaign Active",  value: "5",        color: "#ff9500" },
  ] : [
    { label: "รายได้วันนี้",   value: "฿12,450",     color: "#319754" },
    { label: "รายได้เดือนนี้", value: "฿316,000",    color: "#3b82f6" },
    { label: "รายได้ปีนี้",    value: "฿2,840,000",  color: "#9747ff" },
    { label: "เฉลี่ย/ออเดอร์", value: "฿357",        color: "#ff9500" },
  ];

  const chartColor = isMarketing ? "#f7931d" : isCustomer ? "#9747ff" : isProduct ? "#319754" : ADMIN_PRIMARY;
  const chartKey   = isCustomer ? "orders" : "sales";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((s) => (
          <div key={s.label}
            className="rounded-2xl p-4 flex flex-col gap-2 border hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all"
            style={{ backgroundColor: `${s.color}0d`, borderColor: `${s.color}33` }}>
            <p className={`${font} text-[12px]`} style={{ color: s.color, fontWeight: 600 }}>{s.label}</p>
            <p className={`${font} text-[20px] text-[#101828] tabular-nums leading-none`} style={{ fontWeight: 700 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
          <TrendingUp className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>6 เดือนล่าสุด</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          {tab === "report_sales" ? (
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} />
              <YAxis tick={{ fontSize: 12, fill: "#999" }} />
              <Tooltip /><Legend />
              <Line type="monotone" dataKey="sales"  stroke={ADMIN_PRIMARY} strokeWidth={2.5} dot={{ r: 4 }} name="ยอดขาย (฿)" />
              <Line type="monotone" dataKey="orders" stroke="#f7931d"        strokeWidth={2.5} dot={{ r: 4 }} name="จำนวนคำสั่งซื้อ" />
            </LineChart>
          ) : (
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} />
              <YAxis tick={{ fontSize: 12, fill: "#999" }} />
              <Tooltip cursor={{ fill: `${chartColor}10` }} />
              <Bar dataKey={chartKey} fill={chartColor} radius={[8, 8, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ========== PLACEHOLDER CONTENT ========== */
function PlaceholderContent({ icon: Icon, title, desc }: { icon: any; title: string; desc?: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-12 flex flex-col items-center justify-center gap-4 text-center min-h-[400px]">
      <div className="size-20 rounded-full flex items-center justify-center"
        style={{ backgroundColor: `${ADMIN_PRIMARY}10` }}>
        <Icon className="size-10" style={{ color: ADMIN_PRIMARY }} strokeWidth={1.8} />
      </div>
      <div className="flex flex-col gap-1.5 max-w-[400px]">
        <p className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>{title}</p>
        <p className={`${font} text-[13px] text-gray-500 leading-relaxed`}>
          {desc || "หน้านี้กำลังพัฒนา — ข้อมูลและฟังก์ชันจะถูกเพิ่มเข้ามาในเฟสถัดไป"}
        </p>
      </div>
      <span className={`${font} inline-flex items-center gap-1.5 text-[11px] bg-[#fff7ed] text-[#ff9500] px-3 py-1 rounded-full mt-2`} style={{ fontWeight: 600 }}>
        <span className="size-1.5 rounded-full bg-[#ff9500] animate-pulse" />
        Coming Soon
      </span>
    </div>
  );
}

/* ========== HEADER LABELS ========== */
const itemLabels: Record<string, { title: string; subtitle: string }> = {
  // overview
  dashboard:           { title: "Dashboard",                  subtitle: "ภาพรวมยอดขาย ลูกค้า และร้านค้าในระบบ" },
  report_sales:        { title: "รายงานผลยอดขาย",           subtitle: "วิเคราะห์ยอดขายและคำสั่งซื้อรายเดือน" },
  report_customers:    { title: "รายงานข้อมูลลูกค้า",         subtitle: "ข้อมูลและพฤติกรรมของลูกค้าในระบบ" },
  report_products:     { title: "รายงานข้อมูลสินค้า",         subtitle: "สินค้าขายดี สต็อก และหมวดหมู่" },
  report_marketing:    { title: "รายงานผลการตลาด",          subtitle: "ประสิทธิภาพแคมเปญและโปรโมชัน" },
  complaints:          { title: "การร้องเรียน",                subtitle: "จัดการคำร้องเรียนจากลูกค้าทั้งระบบ" },
  products_manage:     { title: "จัดการสินค้า",                subtitle: "รายการสินค้าทั้งระบบจากร้านค้าทุกร้าน" },
  products_categories: { title: "จัดการหมวดหมู่สินค้า",     subtitle: "จัดหมวดหมู่และโครงสร้างสินค้า" },
  products_promotions: { title: "จัดการโปรโมชั่น",            subtitle: "แคมเปญส่วนลดและโปรโมชั่นในระบบ" },
  products_flash:      { title: "Flash Sale Events",          subtitle: "จัดการ event ลดราคาแฟลชเซลล์" },
  products_coupons:    { title: "คูปอง",                       subtitle: "คูปองส่วนลดที่ออกโดยระบบและร้านค้า" },
  products_tags:       { title: "แท็กสินค้า",                  subtitle: "จัดการแท็ก / label สำหรับค้นหาและกรอง" },
  reviews:             { title: "จัดการรีวิว",                  subtitle: "ตรวจสอบและจัดการรีวิวสินค้า" },
  orders:              { title: "คำสั่งซื้อ",                    subtitle: "ออเดอร์ทั้งระบบ" },
  // content
  content_banner: { title: "Banner",   subtitle: "จัดการ Banner ที่แสดงบนหน้าเว็บไซต์" },
  content_blog:   { title: "บทความ",   subtitle: "จัดการบทความและสาระความรู้" },
  content_video:  { title: "วิดีโอ",    subtitle: "จัดการวิดีโอที่แสดงบนเว็บไซต์" },
  content_index:  { title: "Index",    subtitle: "จัดการ index และ SEO ของเนื้อหา" },
  // pages
  page_home:     { title: "หน้าหลัก",                  subtitle: "ปรับโครงสร้างและคอนเทนต์หน้า Landing" },
  page_products: { title: "หน้าผลิตภัณฑ์ทั้งหมด",   subtitle: "การจัดเรียงและแสดงผลสินค้าทั้งหมด" },
  page_blog:     { title: "สาระความรู้ทั้งหมด",      subtitle: "หน้ารวมบทความและสาระน่ารู้" },
  page_about:    { title: "เกี่ยวกับเรา",               subtitle: "เนื้อหาหน้า About Us" },
  page_appbar:   { title: "Appbar",                    subtitle: "เมนู navigation บนหัวเว็บ" },
  page_footer:   { title: "Footer",                    subtitle: "ข้อมูลและลิงก์ในส่วน Footer" },
  // settings
  site_info_general: { title: "ข้อมูลเว็บไซต์", subtitle: "ชื่อเว็บไซต์ คำอธิบาย และ SEO" },
  site_info_contact: { title: "ข้อมูลติดต่อ",    subtitle: "อีเมล เบอร์โทร และช่องทางติดต่อ" },
  site_info_address: { title: "ที่อยู่",          subtitle: "ที่อยู่บริษัท / สำนักงานหลัก" },
  site_info_social:  { title: "Social Media",   subtitle: "ลิงก์โซเชียลและ embed" },
  settings_shipping:      { title: "การจัดส่ง",     subtitle: "ตั้งค่าระบบขนส่งและค่าธรรมเนียมรวม" },
  settings_notifications: { title: "การแจ้งเตือน",   subtitle: "ตั้งค่าการแจ้งเตือนของระบบ" },
  // users
  users_list: { title: "ผู้ใช้",         subtitle: "รายการผู้ใช้งานทั้งระบบ" },
  shops_list: { title: "ทะเบียนร้านค้า", subtitle: "ร้านค้าที่ลงทะเบียนในระบบ" },
};

// Map item id → icon for placeholder content
const itemIconMap: Record<string, any> = {
  complaints: AlertCircle, products_manage: Package, products_categories: Folder, products_promotions: Megaphone,
  products_flash: Zap, products_coupons: Ticket, products_tags: Tag, reviews: Star, orders: ShoppingCart,
  content_banner: ImageIcon, content_blog: FileText, content_video: Video, content_index: Search,
  page_home: Home, page_products: Package, page_blog: FileText, page_about: Info, page_appbar: LayoutPanelTop, page_footer: PanelBottom,
  site_info_general: Settings, site_info_contact: Phone, site_info_address: MapPin, site_info_social: Globe,
  settings_shipping: Truck, settings_notifications: Bell,
  users_list: Users, shops_list: Store,
};

/* ========== MAIN ========== */
export function AdminDashboard() {
  const location = useLocation();
  const section = pathToSection(location.pathname);
  const [activeItem, setActiveItem] = useState<ItemId>(defaultItem[section]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Reset active item when section changes
  React.useEffect(() => {
    setActiveItem(defaultItem[section]);
  }, [section]);

  const meta = itemLabels[activeItem] ?? { title: activeItem, subtitle: "" };

  const renderContent = () => {
    if (activeItem === "dashboard") return <DashboardContent />;
    if (activeItem === "report_sales" || activeItem === "report_customers" || activeItem === "report_products" || activeItem === "report_marketing") {
      return <ReportContent tab={activeItem as any} />;
    }
    const Icon = itemIconMap[activeItem] || FileText;
    return <PlaceholderContent icon={Icon} title={meta.title} desc={meta.subtitle} />;
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="h-full md:overflow-y-auto shrink-0">
        <AdminSidebar
          section={section}
          active={activeItem}
          onSelect={setActiveItem}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0 min-h-0">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{meta.title}</h2>
            <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>{meta.subtitle}</p>
          </div>
        </div>
        {renderContent()}
      </main>
    </div>
  );
}
