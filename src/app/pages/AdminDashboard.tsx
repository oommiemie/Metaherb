import React, { useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  BarChart3, Users, ShoppingCart, Package, Settings, Image as ImageIcon, TrendingUp,
  Shield, DollarSign, Megaphone, UserCog, BarChart2, ShoppingBag,
  Plus, Minus, Pencil, Trash2, MoreHorizontal, Eye, EyeOff, Search, ChevronLeft, ChevronRight, ChevronDown, Menu,
  Check, X, Mail, Phone, FileText, Store, AlertCircle, Star, Video,
  Home, Info, LayoutPanelTop, PanelBottom, Bell, Truck, MapPin, Globe, Tag, Zap, Ticket, Folder,
  GripVertical, RotateCcw, Save, Image as ImageIcon2, Film, Monitor, Smartphone, Tablet,
  Leaf, UtensilsCrossed, Pill, Sparkles, Flower2, Gift, Coffee, FlaskConical, Droplets, Heart, ArrowRight, Send,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { toast } from "sonner";

import imgLogo from "../../assets/logo.png";
import { products as realProducts } from "../data/products";
import { articles as realArticles, videos as realVideos } from "./BlogPage";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

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

/* ========== PAGE HOME WIREFRAME BUILDER ========== */
type HomeSectionId = "banner" | "categories" | "recommended" | "flashsale" | "articles" | "videos";
interface HomeSection { id: HomeSectionId; label: string; visible: boolean; }

interface HomeCategory { id: string; name: string; icon: any; }
const DEFAULT_CATEGORIES: HomeCategory[] = [
  { id: "herb",       name: "สมุนไพร",     icon: Leaf },
  { id: "food",       name: "อาหาร",        icon: UtensilsCrossed },
  { id: "med",        name: "ยา",            icon: Pill },
  { id: "aroma",      name: "เครื่องหอม",   icon: Sparkles },
  { id: "beauty",     name: "ความสวย",      icon: Flower2 },
  { id: "gift",       name: "ชุดของขวัญ",   icon: Gift },
  { id: "tea",        name: "ชาสมุนไพร",    icon: Coffee },
  { id: "supplement", name: "อาหารเสริม",   icon: FlaskConical },
  { id: "oil",        name: "น้ำมันสกัด",   icon: Droplets },
];

const DEFAULT_HOME_SECTIONS: HomeSection[] = [
  { id: "banner",      label: "Banner",            visible: true },
  { id: "categories",  label: "หมวดหมู่",          visible: true },
  { id: "recommended", label: "สินค้าแนะนำ",      visible: true },
  { id: "flashsale",   label: "Flash Sale",        visible: true },
  { id: "articles",    label: "บทความแนะนำ",     visible: true },
  { id: "videos",      label: "วีดีโอแนะนำ",      visible: true },
];

/* Skeleton building blocks */
const SkelLine = ({ w = "60%" }: { w?: string }) => (
  <div className="h-2 bg-gray-200 rounded-full" style={{ width: w }} />
);

type ViewMode = "desktop" | "tablet" | "mobile";

interface SectionConfigs {
  banner:      { showSideBanners: boolean; sideBannerPosition: "left" | "right" };
  categories:  { compact: boolean; showLabels: boolean };
  recommended: { desktopCols: number };
  flashsale:   { desktopCols: number; showCountdown: boolean };
  articles:    { desktopCols: number };
  videos:      { desktopCols: number };
}

const DEFAULT_CONFIGS: SectionConfigs = {
  banner:      { showSideBanners: true, sideBannerPosition: "right" },
  categories:  { compact: false, showLabels: true },
  recommended: { desktopCols: 6 },
  flashsale:   { desktopCols: 6, showCountdown: true },
  articles:    { desktopCols: 3 },
  videos:      { desktopCols: 6 },
};

/* ===== Tiny control primitives ===== */
function Stepper({ value, min, max, onChange, suffix }: {
  value: number; min: number; max: number; onChange: (v: number) => void; suffix?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  return (
    <div className="inline-flex items-center bg-[#f5f5f5] rounded-lg overflow-hidden h-7">
      <button
        onClick={() => onChange(clamp(value - 1))}
        disabled={value <= min}
        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
      ><Minus className="size-3" strokeWidth={2.4} /></button>
      <span className={`${font} text-[12px] w-10 text-center tabular-nums`} style={{ fontWeight: 600 }}>
        {value}{suffix}
      </span>
      <button
        onClick={() => onChange(clamp(value + 1))}
        disabled={value >= max}
        className="w-7 h-7 flex items-center justify-center text-gray-600 hover:bg-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors"
      ><Plus className="size-3" strokeWidth={2.4} /></button>
    </div>
  );
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition-colors cursor-pointer ${checked ? "" : "bg-gray-200"}`}
      style={checked ? { backgroundColor: ADMIN_PRIMARY } : {}}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full shadow-sm transition-transform ${checked ? "translate-x-4" : ""}`}
      />
    </button>
  );
}

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className={`${font} text-[12px] text-gray-700`}>{label}</span>
      {children}
    </div>
  );
}

function SectionSettings({ id, configs, setConfigs, isDirty, onReset }: {
  id: HomeSectionId;
  configs: SectionConfigs;
  setConfigs: React.Dispatch<React.SetStateAction<SectionConfigs>>;
  isDirty: boolean;
  onReset: () => void;
}) {
  const upd = <K extends HomeSectionId>(key: K, patch: Partial<SectionConfigs[K]>) =>
    setConfigs(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const ResetBtn = (
    <div className="pt-2 mt-1 border-t border-gray-100">
      <button
        onClick={onReset}
        disabled={!isDirty}
        className={`${font} w-full inline-flex items-center justify-center gap-1.5 h-8 rounded-lg border text-[12px] transition-all ${
          isDirty ? "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer" : "border-gray-100 text-gray-300 cursor-not-allowed"
        }`}
        style={{ fontWeight: 500 }}
      >
        <RotateCcw className="size-3.5" strokeWidth={2.2} />
        รีเซ็ต section นี้
      </button>
    </div>
  );

  if (id === "banner") {
    const c = configs.banner;
    return (
      <div className="flex flex-col divide-y divide-gray-100">
        <ConfigRow label="แสดง Banner ด้านข้าง">
          <ToggleSwitch checked={c.showSideBanners} onChange={(v) => upd("banner", { showSideBanners: v })} />
        </ConfigRow>
        {c.showSideBanners && (
          <ConfigRow label="ตำแหน่ง Banner ด้านข้าง">
            <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
              {(["left", "right"] as const).map((pos) => {
                const active = c.sideBannerPosition === pos;
                return (
                  <button
                    key={pos}
                    onClick={() => upd("banner", { sideBannerPosition: pos })}
                    className={`${font} px-2.5 h-6 rounded-md text-[11px] transition-all cursor-pointer ${
                      active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"
                    }`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}
                  >
                    {pos === "left" ? "ซ้าย" : "ขวา"}
                  </button>
                );
              })}
            </div>
          </ConfigRow>
        )}
      </div>
    );
  }
  if (id === "categories") {
    const c = configs.categories;
    return (
      <>
        <div className="flex flex-col divide-y divide-gray-100">
          <ConfigRow label="ขนาดเล็ก (Compact)">
            <ToggleSwitch checked={c.compact} onChange={(v) => upd("categories", { compact: v })} />
          </ConfigRow>
          <ConfigRow label="แสดงชื่อหมวดหมู่">
            <ToggleSwitch checked={c.showLabels} onChange={(v) => upd("categories", { showLabels: v })} />
          </ConfigRow>
        </div>
        {ResetBtn}
      </>
    );
  }
  if (id === "flashsale") {
    const c = configs.flashsale;
    return (
      <div className="flex flex-col divide-y divide-gray-100">
        <ConfigRow label="คอลัมน์ (Desktop)">
          <Stepper value={c.desktopCols} min={3} max={6} onChange={(v) => upd("flashsale", { desktopCols: v })} />
        </ConfigRow>
        <ConfigRow label="แสดง Countdown">
          <ToggleSwitch checked={c.showCountdown} onChange={(v) => upd("flashsale", { showCountdown: v })} />
        </ConfigRow>
      </div>
    );
  }
  if (id === "articles") {
    const c = configs.articles;
    return (
      <div className="flex flex-col divide-y divide-gray-100">
        <ConfigRow label="คอลัมน์ (Desktop)">
          <Stepper value={c.desktopCols} min={2} max={4} onChange={(v) => upd("articles", { desktopCols: v })} />
        </ConfigRow>
      </div>
    );
  }
  // recommended / videos share shape
  const key = id as "recommended" | "videos";
  const c = configs[key];
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      <ConfigRow label="คอลัมน์ (Desktop)">
        <Stepper value={c.desktopCols} min={3} max={6} onChange={(v) => upd(key, { desktopCols: v })} />
      </ConfigRow>
    </div>
  );
}

function BannerWire({ view, cfg }: { view: ViewMode; cfg: SectionConfigs["banner"] }) {
  const slides = Array.from({ length: 4 });
  const showSide = cfg.showSideBanners && view === "desktop";
  if (!showSide) {
    return (
      <div className="flex flex-col gap-2">
        <div className={`bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl flex items-center justify-center relative ${
          view === "mobile" ? "aspect-[16/9]" : "aspect-[775/235]"
        }`}>
          <ImageIcon className={`text-gray-400 ${view === "mobile" ? "size-6" : "size-8"}`} strokeWidth={1.5} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {slides.map((_, i) => <span key={i} className={`h-1.5 rounded-full ${i===0 ? "w-5 bg-gray-400" : "w-1.5 bg-gray-300"}`} />)}
          </div>
        </div>
      </div>
    );
  }
  const mainBanner = (
    <div className="flex-[775_1_0%] aspect-[775/235] bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl flex items-center justify-center relative">
      <ImageIcon className="size-8 text-gray-400" strokeWidth={1.5} />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => <span key={i} className={`h-1.5 rounded-full ${i===0 ? "w-5 bg-gray-400" : "w-1.5 bg-gray-300"}`} />)}
      </div>
    </div>
  );
  const sideBanners = (
    <div className="flex-[230_1_0%] flex flex-col gap-2.5">
      <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl flex items-center justify-center">
        <ImageIcon className="size-5 text-gray-400" strokeWidth={1.5} />
      </div>
      <div className="flex-1 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl flex items-center justify-center">
        <ImageIcon className="size-5 text-gray-400" strokeWidth={1.5} />
      </div>
    </div>
  );
  return (
    <div className="flex gap-2.5">
      {cfg.sideBannerPosition === "left"
        ? <>{sideBanners}{mainBanner}</>
        : <>{mainBanner}{sideBanners}</>}
    </div>
  );
}

function CategoriesWire({ view, cfg, categories, catDrag, onCatDragStart, onCatDragOver, onCatDrop, onCatDragEnd }: {
  view: ViewMode;
  cfg: SectionConfigs["categories"];
  categories: HomeCategory[];
  catDrag: { dragId: string | null };
  onCatDragStart: (e: React.DragEvent, id: string) => void;
  onCatDragOver:  (e: React.DragEvent, id: string) => void;
  onCatDrop:      (e: React.DragEvent) => void;
  onCatDragEnd:   () => void;
}) {
  const compact = view === "mobile" || cfg.compact;
  const scrollable = view !== "desktop";
  return (
    <div className={`flex items-center py-2 ${scrollable ? "justify-start gap-3 overflow-x-auto" : "justify-center gap-3"}`}>
      {categories.map((cat) => {
        const Icon = cat.icon;
        const isDragging = catDrag.dragId === cat.id;
        return (
          <div
            key={cat.id}
            draggable
            onDragStart={(e) => { e.stopPropagation(); onCatDragStart(e, cat.id); }}
            onDragOver={(e)  => { e.stopPropagation(); onCatDragOver(e, cat.id); }}
            onDrop={(e)      => { e.stopPropagation(); onCatDrop(e); }}
            onDragEnd={()    => onCatDragEnd()}
            title={cat.name}
            className={`flex flex-col items-center gap-1.5 shrink-0 cursor-grab active:cursor-grabbing rounded-lg p-1 transition-all ${
              compact ? "min-w-[56px]" : "min-w-[64px]"
            } ${isDragging ? "opacity-50 bg-[#319754]/10 border-2 border-dashed" : "hover:bg-gray-50 border-2 border-transparent"}`}
            style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}
          >
            <div className={`rounded-full flex items-center justify-center bg-gray-200 ${compact ? "size-9" : "size-12"}`}>
              <Icon className={`${compact ? "size-4" : "size-5"} text-gray-500`} strokeWidth={1.8} />
            </div>
            {cfg.showLabels && (
              <span className={`${font} text-gray-500 whitespace-nowrap ${compact ? "text-[10px]" : "text-[11px]"}`}>
                {cat.name}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProductGridWire({ accent, view, cfg, showCountdown }: {
  accent?: boolean; view: ViewMode;
  cfg: { desktopCols: number };
  showCountdown?: boolean;
}) {
  const desktopColsClass: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-4" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-6");
  const count = view === "mobile" ? 4 : view === "tablet" ? 4 : cfg.desktopCols;
  const compact = view === "mobile";
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`bg-gray-300 rounded-full ${compact ? "h-3 w-20" : "h-4 w-24"}`} />
          {accent && showCountdown ? <div className="flex gap-1">{[0,1,2].map(i => <div key={i} className={`bg-gray-300 rounded ${compact ? "w-4 h-3" : "w-5 h-4"}`} />)}</div> : null}
        </div>
        <div className="h-3 bg-gray-200 rounded-full w-12" />
      </div>
      <div className={`grid ${cols} gap-2`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`border border-gray-200 rounded-xl overflow-hidden flex flex-col ${compact ? "h-[170px]" : "h-[180px]"}`}>
            <div className="flex-1 bg-gray-100" />
            <div className="p-2 flex flex-col gap-1.5">
              <SkelLine w="80%" />
              <SkelLine w="40%" />
              <div className="flex items-center justify-between"><SkelLine w="30%" /><SkelLine w="20%" /></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ArticlesWire({ view, cfg }: { view: ViewMode; cfg: SectionConfigs["articles"] }) {
  if (view === "mobile") {
    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 bg-gray-300 rounded-full w-24" />
          <div className="h-3 bg-gray-200 rounded-full w-12" />
        </div>
        <div className="flex flex-col gap-2.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-[16/9] bg-gray-100" />
              <div className="p-3 flex flex-col gap-1.5">
                <SkelLine w="90%" />
                <SkelLine w="60%" />
                <div className="h-4 w-16 bg-gray-200 rounded-full mt-1" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  const desktopColsClass: Record<number, string> = { 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4" };
  const cols  = view === "tablet" ? "grid-cols-2" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-3");
  const count = view === "tablet" ? 2 : cfg.desktopCols;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded-full w-28" />
        <div className="h-3 bg-gray-200 rounded-full w-14" />
      </div>
      <div className={`grid ${cols} gap-3`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden flex h-[130px]">
            <div className="w-[40%] bg-gray-100" />
            <div className="flex-1 p-3 flex flex-col gap-2 justify-between">
              <div className="flex flex-col gap-1.5">
                <SkelLine w="90%" />
                <SkelLine w="70%" />
                <SkelLine w="80%" />
              </div>
              <div className="h-5 w-20 bg-gray-200 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function VideosWire({ view, cfg }: { view: ViewMode; cfg: SectionConfigs["videos"] }) {
  const desktopColsClass: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-4" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-6");
  const count = view === "mobile" ? 4 : view === "tablet" ? 4 : cfg.desktopCols;
  const compact = view === "mobile";
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className={`bg-gray-300 rounded-full ${compact ? "h-3 w-20" : "h-4 w-24"}`} />
        <div className="h-3 bg-gray-200 rounded-full w-12" />
      </div>
      <div className={`grid ${cols} gap-2`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center relative">
            <Video className={`text-gray-300 ${compact ? "size-5" : "size-7"}`} strokeWidth={1.5} />
            <div className="absolute bottom-2 left-2 right-2 h-3 bg-gray-200 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

const sectionRenderers: Record<Exclude<HomeSectionId, "categories">, (view: ViewMode, configs: SectionConfigs) => React.ReactNode> = {
  banner:      (v, c) => <BannerWire view={v} cfg={c.banner} />,
  recommended: (v, c) => <ProductGridWire view={v} cfg={c.recommended} />,
  flashsale:   (v, c) => <ProductGridWire view={v} cfg={c.flashsale} accent showCountdown={c.flashsale.showCountdown} />,
  articles:    (v, c) => <ArticlesWire view={v} cfg={c.articles} />,
  videos:      (v, c) => <VideosWire view={v} cfg={c.videos} />,
};

const sectionIcons: Record<HomeSectionId, any> = {
  banner: ImageIcon, categories: LayoutPanelTop, recommended: Star,
  flashsale: Zap, articles: FileText, videos: Video,
};

/* Site Frame — mirrors real Layout.tsx (static, no interactions) */
function SitePreviewFrame({ currentPath, view, children }: { currentPath: string; view: ViewMode; children: React.ReactNode }) {
  const menuItems = [
    { label: "หน้าหลัก",     path: "/" },
    { label: "ผลิตภัณท์",    path: "/products" },
    { label: "สาระความรู้",   path: "/blog" },
  ];
  const isMobile  = view === "mobile";
  const isDesktop = view === "desktop";
  const pxCls = isDesktop ? "px-[60px]" : view === "tablet" ? "px-6" : "px-4";

  return (
    <div className="flex flex-col w-full">
      {/* Header — copied from Layout.tsx */}
      <header className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.9)]">
        <div className={`flex items-center justify-between py-3 sm:py-4 ${pxCls}`}>
          {/* Mobile menu button */}
          {isMobile && (
            <button className="p-1.5">
              <Menu className="size-6 text-gray-600" />
            </button>
          )}

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <img src={imgLogo} className={`shrink-0 ${isMobile ? "size-[40px]" : "size-[58px]"}`} alt="MetaHerb" />
            <span className={`${fontBold} whitespace-nowrap ${isMobile ? "text-[18px]" : "text-[24px]"}`} style={{ fontWeight: 700 }}>
              <span className="text-[#ed1c24]">META</span>
              <span className="text-[#f7931d]">HERB</span>
            </span>
          </div>

          {/* Search — desktop only (mirrors real SearchBar in Layout.tsx) */}
          {!isMobile && (
            <div className={`shrink-0 mx-4 ${isDesktop ? "w-[300px] lg:w-[412px]" : "w-[240px]"}`}>
              <div className="flex items-center bg-white border border-[#d4d4d8] rounded-full pl-4 pr-1 py-1">
                <span className={`${font} flex-1 text-[14px] text-[#a3a3a3]`}>ค้นหาสินค้าที่ต้องการ</span>
                <div className="bg-[#319754] rounded-full size-8 flex items-center justify-center shrink-0">
                  <Search className="size-4 text-white" />
                </div>
              </div>
            </div>
          )}

          {/* Right icons */}
          <div className="flex items-center gap-2 sm:gap-4 justify-end">
            {isMobile && <Search className="size-5 text-gray-600" />}

            <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] rounded-[100px] size-[36px] sm:size-[40px] flex items-center justify-center relative">
              <Bell className="size-[20px] sm:size-[22px] text-gray-700" strokeWidth={2} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full border-2 border-white">3</span>
            </div>

            <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] rounded-[100px] size-[36px] sm:size-[40px] flex items-center justify-center relative">
              <ShoppingCart className="size-[20px] sm:size-[22px] text-gray-700" strokeWidth={2} />
              <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full border-2 border-white">2</span>
            </div>

            {/* Register / Login buttons (not authenticated state) */}
            {!isMobile && (
              <div className="flex items-center gap-2.5">
                <button className={`border border-[#db8b0a] text-[#db8b0a] h-[40px] w-[120px] rounded-full text-[14px] ${font}`}>
                  สมัครสมาชิก
                </button>
                <button className={`bg-[#319754] text-white h-[40px] w-[120px] rounded-full text-[14px] ${font}`}>
                  เข้าสู่ระบบ
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Green nav — desktop only */}
        {!isMobile && (
          <nav className="bg-[#319754]">
            <div className="flex items-center justify-center gap-2 py-2.5 px-6">
              {menuItems.map((item) => {
                const active = item.path === currentPath;
                return (
                  <span key={item.path}
                    className={`px-4 py-1.5 rounded-full text-[14px] text-white ${font} relative ${active ? "bg-black/15" : ""}`}>
                    {item.label}
                  </span>
                );
              })}
              <span className={`px-4 py-1.5 rounded-full text-[14px] text-white ${font}`}>เกี่ยวกับเรา</span>
            </div>
          </nav>
        )}
      </header>

      {/* Main content with real page bg */}
      <main style={{ backgroundColor: "#fafafa" }}>
        {children}
      </main>

      {/* Footer — copied from Layout.tsx */}
      <footer>
        <div className="bg-[#226a3b]">
          <div className={`grid ${isDesktop ? "grid-cols-3" : view === "tablet" ? "grid-cols-2" : "grid-cols-1"} gap-6 sm:gap-8 py-6 sm:py-8 ${pxCls}`}>
            <div className="flex flex-col gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <img src={imgLogo} className="size-[48px]" alt="" />
                <span className={`${fontBold} text-[20px]`}>METAHERB</span>
              </div>
              <p className={`${font} text-[12px]`}>บริษัท เมต้าเฮิร์บ จำกัด</p>
              <p className={`${font} text-[12px] leading-relaxed`}>
                ที่อยู่ : 459/153 ถนนสุขสวัสดิ์ แขวงราษฎร์บูรณะ ราษฎร์บูรณะ กรุงเทพมหานคร 10140
              </p>
              <p className={`${font} text-[12px]`}>เบอร์โทรศัพท์ : 0614213111</p>
              <p className={`${font} text-[12px]`}>อีเมล : metaherb.herb@gmail.com</p>
            </div>
            <div className="flex flex-col gap-3 text-white">
              <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>เกี่ยวกับเรา</p>
              {["นโยบาย", "พันธกิจ", "ข้อมูลติดต่อ", "คูปอง"].map((item) => (
                <p key={item} className={`${font} text-[12px]`}>{item}</p>
              ))}
            </div>
            <div className="flex flex-col gap-3 text-white">
              <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ติดตามเรา</p>
              {[
                { name: "Facebook", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <circle cx="16" cy="16" r="16" fill="#1877F2" />
                    <path d="M20.4 20.6l.7-4.6h-4.4v-3c0-1.3.6-2.5 2.6-2.5h2V6.6s-1.8-.3-3.6-.3c-3.6 0-6 2.2-6 6.2V16H7.6v4.6h4.1V32h5V20.6h3.7z" fill="#fff" />
                  </svg>
                ) },
                { name: "Line", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <circle cx="16" cy="16" r="16" fill="#06C755" />
                    <path d="M26 14.7c0-4.5-4.5-8.2-10-8.2S6 10.2 6 14.7c0 4 3.6 7.4 8.4 8.1.3.1.7.2.8.5.1.3.1.7 0 1l-.1.8c0 .2-.2 1 .9.5 1.1-.5 5.7-3.4 7.8-5.8 1.4-1.6 2.2-3.3 2.2-5.1z" fill="#fff" />
                  </svg>
                ) },
                { name: "Instagram", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <defs>
                      <radialGradient id={`igGrad-${view}`} cx="0.3" cy="1" r="1.2">
                        <stop offset="0%" stopColor="#FED576" />
                        <stop offset="25%" stopColor="#F47133" />
                        <stop offset="50%" stopColor="#BC3081" />
                        <stop offset="100%" stopColor="#4F5BD5" />
                      </radialGradient>
                    </defs>
                    <rect width="32" height="32" rx="9" fill={`url(#igGrad-${view})`} />
                    <rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="16" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="21.5" cy="10.5" r="1.2" fill="#fff" />
                  </svg>
                ) },
                { name: "Tiktok", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <circle cx="16" cy="16" r="16" fill="#000" />
                    <path d="M21.7 12.2c-1.6-.3-3-1.4-3.6-2.9h-2.4v9.7c0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9v-4.6c1.1.7 2.4 1.2 3.8 1.2v-2.6c-.1 0-.2 0-.4 0z" fill="#fff" />
                  </svg>
                ) },
                { name: "Youtube", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <circle cx="16" cy="16" r="16" fill="#FF0000" />
                    <path d="M13 11l9 5-9 5V11z" fill="#fff" />
                  </svg>
                ) },
              ].map((s) => (
                <div key={s.name} className="flex items-center gap-2.5">
                  {s.icon}
                  <span className={`${font} text-[12px]`}>{s.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-[#226a3b] border-t border-white/15 text-center py-4">
          <p className={`${font} text-[14px] text-white`}>© 2026 MetaHerb. สงวนลิขสิทธิ์ทั้งหมด.</p>
        </div>
      </footer>
    </div>
  );
}

/* Browser mockup wrapper for save preview */
function BrowserMockup({ url, view, children }: { url: string; view: ViewMode; children: React.ReactNode }) {
  const isMobile = view === "mobile";
  return (
    <div className="rounded-[12px] overflow-hidden border border-gray-300 shadow-[0_8px_24px_rgba(0,0,0,0.1)] bg-white">
      {/* Chrome */}
      <div className="bg-gradient-to-b from-[#f0f0f2] to-[#e4e4e7] border-b border-gray-300 flex items-center gap-3 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="size-3 rounded-full bg-[#ff5f57] border border-[#e0443e]/30" />
          <span className="size-3 rounded-full bg-[#febc2e] border border-[#dea123]/30" />
          <span className="size-3 rounded-full bg-[#28c840] border border-[#1aab29]/30" />
        </div>
        {!isMobile && (
          <div className="flex items-center gap-1 text-gray-400 ml-1">
            <ChevronLeft className="size-3.5" strokeWidth={2.2} />
            <ChevronRight className="size-3.5" strokeWidth={2.2} />
            <RotateCcw className="size-3 ml-0.5" strokeWidth={2.2} />
          </div>
        )}
        <div className="flex-1 bg-white/90 rounded-md h-6 px-3 flex items-center gap-2 border border-gray-200 max-w-[420px] mx-auto">
          <svg className="size-3 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3v2M6 11c0-3.314 2.686-6 6-6s6 2.686 6 6v2h2v9H4v-9h2v-2z" />
          </svg>
          <span className={`${font} text-[11px] text-gray-600 truncate`}>{url}</span>
        </div>
        {!isMobile && <div className="size-4 text-gray-400 shrink-0">⋯</div>}
      </div>
      {/* Page content */}
      <div className="bg-[#fafafa]">{children}</div>
    </div>
  );
}

/* Real-styled previews for Home Save dialog */
function HomeBannerPreview({ cfg, view }: { cfg: SectionConfigs["banner"]; view: ViewMode }) {
  const showSide = cfg.showSideBanners && view === "desktop";
  const main = (
    <div className="flex-[775_1_0%] rounded-[16px] overflow-hidden relative aspect-[775/235]">
      <img src={HOME_BANNER_IMAGES[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {[0,1,2,3].map(i => <span key={i} className={`rounded-full ${i===0 ? "h-2 w-6 bg-white" : "h-2 w-2 bg-white/60"}`} />)}
      </div>
    </div>
  );
  const side = (
    <div className="flex-[230_1_0%] flex flex-col gap-2.5">
      <div className="rounded-[16px] overflow-hidden flex-1 relative">
        <img src={HOME_BANNER_IMAGES[1]} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <div className="rounded-[16px] overflow-hidden flex-1 relative">
        <img src={HOME_BANNER_IMAGES[2]} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>
    </div>
  );
  if (!showSide) {
    return (
      <div className={`w-full ${view === "mobile" ? "aspect-[16/9]" : "aspect-[775/235]"} rounded-[16px] overflow-hidden relative`}>
        <img src={HOME_BANNER_IMAGES[0]} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0,1,2,3].map(i => <span key={i} className={`rounded-full ${i===0 ? "h-2 w-6 bg-white" : "h-2 w-2 bg-white/60"}`} />)}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      {cfg.sideBannerPosition === "left" ? <>{side}{main}</> : <>{main}{side}</>}
    </div>
  );
}

function HomeCategoriesPreview({ cfg, view, categories }: { cfg: SectionConfigs["categories"]; view: ViewMode; categories: HomeCategory[] }) {
  const compact = view === "mobile" || cfg.compact;
  return (
    <div className={`flex items-center py-2 ${view !== "desktop" ? "justify-start gap-3 overflow-x-auto" : "justify-center gap-4"}`}>
      {categories.map((cat) => {
        const Icon = cat.icon;
        return (
          <div key={cat.id} className={`flex flex-col items-center gap-1.5 shrink-0 ${compact ? "min-w-[60px]" : "min-w-[72px]"}`}>
            <div className={`rounded-full bg-[#319754]/10 flex items-center justify-center ${compact ? "size-10" : "size-14"}`}>
              <Icon className={compact ? "size-4" : "size-5"} style={{ color: ADMIN_PRIMARY }} strokeWidth={1.8} />
            </div>
            {cfg.showLabels && (
              <span className={`${font} text-gray-600 whitespace-nowrap ${compact ? "text-[10px]" : "text-[11px]"}`}>{cat.name}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HomeProductsPreview({ cfg, view, accent, showCountdown }: { cfg: { desktopCols: number }; view: ViewMode; accent?: boolean; showCountdown?: boolean }) {
  const desktopColsClass: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-4" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-6");
  const count = view === "mobile" ? 4 : view === "tablet" ? 4 : cfg.desktopCols;
  const title = accent ? "Flash Sale" : "สินค้าแนะนำ";
  const items = (accent
    ? realProducts.filter(p => p.isFlashSale)
    : realProducts.filter(p => !p.isFlashSale && (p.isRecommended || p.discountPercent))
  ).slice(0, count);
  return (
    <div className="bg-white rounded-[16px] p-[16px]">
      <div className="flex items-center justify-between mb-[16px]">
        <div className="flex items-center gap-[10px]">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{title}</p>
          {accent && showCountdown && (
            <div className="flex items-center gap-[4px]">
              {["12","13","08"].map((t, i) => (
                <div key={i} className="flex items-center gap-[4px]">
                  <div className="bg-gradient-to-b from-[#e62e05] to-[#bc1b06] rounded-[8px] w-[32px] py-[4px] flex items-center justify-center">
                    <span className={`${font} text-[16px] text-white`} style={{ fontWeight: 600 }}>{t}</span>
                  </div>
                  {i < 2 && <span className={`${font} text-[16px] text-black`}>:</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1.5 cursor-pointer hover:text-[#319754] transition-colors`}>ดูทั้งหมด <ChevronRight className="size-4" /></span>
      </div>
      <div className={`grid ${cols} gap-[16px]`}>
        {items.map((p, idx) => (
          <div key={p.id} className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden flex flex-col h-[259px]">
            <div className="flex-1 relative min-h-0 overflow-hidden">
              <img src={pickProductImage(p, idx)} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
              {accent ? (
                <>
                  <div className="absolute top-0 right-0 p-[6px]">
                    <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                      <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>ลด {p.discountPercent}%</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 backdrop-blur-[4px] bg-[rgba(230,46,5,0.8)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] rounded-tr-[8px]">
                    <span className={`${font} text-[8px] text-white`}>Flash Sale</span>
                  </div>
                </>
              ) : p.discountPercent ? (
                <div className="absolute top-0 right-0 p-[6px]">
                  <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                    <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>ลด {p.discountPercent}%</span>
                  </div>
                </div>
              ) : p.isRecommended ? (
                <div className="absolute top-0 right-0 p-[6px]">
                  <div className="bg-[#319754] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(49,151,84,0.4)]">
                    <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>สินค้าแนะนำ</span>
                  </div>
                </div>
              ) : null}
            </div>
            <div className="p-[10px] flex flex-col gap-[4px]">
              <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
              <div className="flex items-center gap-[10px]">
                <span className={`${font} text-[14px] ${p.discountPercent ? 'text-[#e62e05]' : 'text-[#226a3b]'}`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                {p.originalPrice && (
                  <span className={`${font} text-[10px] text-[#a3a3a3] line-through`}>฿{p.originalPrice.toFixed(2)}</span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-[8px]">
                  <Star className="size-[14px] fill-[#F7C42B] text-[#F7C42B]" strokeWidth={1} />
                  <span className={`${font} text-[10px] text-black`}>{p.rating}/5</span>
                </div>
                <span className={`${font} text-[10px] text-black`}>{p.sold}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeArticlesPreview({ view }: { view: ViewMode }) {
  const cols  = view === "mobile" ? "grid-cols-1" : view === "tablet" ? "grid-cols-2" : "grid-cols-3";
  const items = realArticles.slice(0, 3);
  return (
    <div className="bg-white rounded-[16px] p-[16px]">
      <div className="flex items-center justify-between mb-[16px]">
        <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>บทความแนะนำ</p>
        <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1.5 cursor-pointer hover:text-[#319754] transition-colors`}>ดูทั้งหมด <ChevronRight className="size-4" /></span>
      </div>
      <div className={`grid ${cols} gap-[16px]`}>
        {items.map((a, i) => (
          <div key={i} className="bg-white rounded-[16px] border border-[#d4d4d4] h-[180px] overflow-hidden flex">
            <div className="relative h-full shrink-0 w-[180px] overflow-hidden">
              <img src={a.img} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                <div className="bg-black/50 flex items-center gap-[10px] px-[12px] py-[4px] rounded-[100px]">
                  <Eye className="size-3 text-white" strokeWidth={2} />
                  <span className={`${font} text-[12px] text-white`}>{a.views}</span>
                </div>
                <div className="bg-black/50 px-[12px] py-[4px] rounded-[100px]">
                  <span className={`${font} text-[12px] text-white`}>{a.date}</span>
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[8px] p-[14px] min-w-0">
              <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{a.title}</p>
              <p className={`${font} text-[12px] text-[#737373] line-clamp-3`}>{a.desc}</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#af6f08]/10 text-[#af6f08] self-start mt-auto ${font} text-[12px]`} style={{ fontWeight: 500 }}>
                อ่านเพิ่มเติม
                <ChevronRight className="size-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeVideosPreview({ view }: { view: ViewMode }) {
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-4" : "grid-cols-6";
  const count = view === "mobile" ? 4 : view === "tablet" ? 4 : 6;
  const items = realVideos.slice(0, count);
  return (
    <div className="bg-white rounded-[16px] p-[16px]">
      <div className="flex items-center justify-between mb-[16px]">
        <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>วีดีโอแนะนำ</p>
        <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1.5 cursor-pointer hover:text-[#319754] transition-colors`}>ดูทั้งหมด <ChevronRight className="size-4" /></span>
      </div>
      <div className={`grid ${cols} gap-[16px]`}>
        {items.map((v, i) => (
          <div key={i} className="relative h-[259px] rounded-[16px] overflow-hidden">
            <img src={v.img} alt={v.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
              <div className="bg-black/50 flex items-center gap-[10px] px-[12px] py-[4px] rounded-[100px]">
                <Eye className="size-3 text-white" strokeWidth={2} />
                <span className={`${font} text-[12px] text-white`}>{v.views}</span>
              </div>
              <div className="bg-black/50 rounded-[100px] w-full">
                <div className="flex items-center justify-center px-[12px] py-[4px]">
                  <span className={`${font} text-[12px] text-white truncate`}>{v.title}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageHomeBuilder() {
  const [sections, setSections]     = useState<HomeSection[]>(DEFAULT_HOME_SECTIONS);
  const [configs, setConfigs]       = useState<SectionConfigs>(DEFAULT_CONFIGS);
  const [categories, setCategories] = useState<HomeCategory[]>(DEFAULT_CATEGORIES);
  const [showSave, setShowSave]     = useState(false);
  const [previewView, setPreviewView] = useState<ViewMode>("desktop");
  const [dragId, setDragId]         = useState<HomeSectionId | null>(null);
  const [overId, setOverId]         = useState<HomeSectionId | null>(null);
  const [overPos, setOverPos]       = useState<"before" | "after" | null>(null);
  const [catDragId, setCatDragId]   = useState<string | null>(null);
  const [catOverId, setCatOverId]   = useState<string | null>(null);
  const [catOverPos, setCatOverPos] = useState<"before" | "after" | null>(null);
  const [view, setView]             = useState<ViewMode>("desktop");

  const reorderCategories = (from: string, to: string, pos: "before" | "after") => {
    setCategories(prev => {
      const fromIdx = prev.findIndex(c => c.id === from);
      let toIdx     = prev.findIndex(c => c.id === to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      if (pos === "after") toIdx += 1;
      if (fromIdx < toIdx) toIdx -= 1;
      if (fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };
  const handleCatDragStart = (e: React.DragEvent, id: string) => {
    setCatDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleCatDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!catDragId || catDragId === id) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos: "before" | "after" = (e.clientX - rect.left) < rect.width / 2 ? "before" : "after";
    setCatOverId(id);
    setCatOverPos(pos);
  };
  const handleCatDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (catDragId && catOverId && catDragId !== catOverId && catOverPos) reorderCategories(catDragId, catOverId, catOverPos);
    setCatDragId(null); setCatOverId(null); setCatOverPos(null);
  };
  const handleCatDragEnd = () => { setCatDragId(null); setCatOverId(null); setCatOverPos(null); };

  const previewCategories = (() => {
    if (!catDragId || !catOverId || !catOverPos || catDragId === catOverId) return categories;
    const fromIdx = categories.findIndex(c => c.id === catDragId);
    let toIdx     = categories.findIndex(c => c.id === catOverId);
    if (fromIdx < 0 || toIdx < 0) return categories;
    if (catOverPos === "after") toIdx += 1;
    if (fromIdx < toIdx) toIdx -= 1;
    if (fromIdx === toIdx) return categories;
    const next = [...categories];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    return next;
  })();

  const toggleVisible = (id: HomeSectionId) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));

  const reorder = (from: HomeSectionId, to: HomeSectionId, pos: "before" | "after") => {
    setSections(prev => {
      const fromIdx = prev.findIndex(s => s.id === from);
      let toIdx     = prev.findIndex(s => s.id === to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      if (pos === "after") toIdx += 1;
      if (fromIdx < toIdx) toIdx -= 1;
      if (fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };

  const handleDragStart = (e: React.DragEvent, id: HomeSectionId) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragOver = (e: React.DragEvent, id: HomeSectionId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragId || dragId === id) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos: "before" | "after" = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
    setOverId(id);
    setOverPos(pos);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragId && overId && dragId !== overId && overPos) reorder(dragId, overId, overPos);
    setDragId(null); setOverId(null); setOverPos(null);
  };
  const handleDragEnd = () => { setDragId(null); setOverId(null); setOverPos(null); };

  const isSectionDirty = (id: HomeSectionId): boolean => {
    const configDiff = JSON.stringify(configs[id]) !== JSON.stringify(DEFAULT_CONFIGS[id]);
    if (id === "categories") {
      const orderDiff = JSON.stringify(categories.map(c => c.id)) !== JSON.stringify(DEFAULT_CATEGORIES.map(c => c.id));
      return configDiff || orderDiff;
    }
    return configDiff;
  };
  const resetSection = (id: HomeSectionId) => {
    setConfigs(prev => ({ ...prev, [id]: DEFAULT_CONFIGS[id] }));
    if (id === "categories") setCategories(DEFAULT_CATEGORIES);
  };

  const sectionsDirty   = sections.some((s, i) => s.id !== DEFAULT_HOME_SECTIONS[i].id || s.visible !== DEFAULT_HOME_SECTIONS[i].visible);
  const configsDirty    = JSON.stringify(configs) !== JSON.stringify(DEFAULT_CONFIGS);
  const categoriesDirty = JSON.stringify(categories.map(c => c.id)) !== JSON.stringify(DEFAULT_CATEGORIES.map(c => c.id));
  const isDirty = sectionsDirty || configsDirty || categoriesDirty;
  const resetAll = () => { setSections(DEFAULT_HOME_SECTIONS); setConfigs(DEFAULT_CONFIGS); setCategories(DEFAULT_CATEGORIES); };

  const visibleSections = sections.filter(s => s.visible);
  const previewSections = (() => {
    if (!dragId || !overId || !overPos || dragId === overId) return visibleSections;
    const fromIdx = visibleSections.findIndex(s => s.id === dragId);
    let toIdx     = visibleSections.findIndex(s => s.id === overId);
    if (fromIdx < 0 || toIdx < 0) return visibleSections;
    if (overPos === "after") toIdx += 1;
    if (fromIdx < toIdx) toIdx -= 1;
    if (fromIdx === toIdx) return visibleSections;
    const next = [...visibleSections];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    return next;
  })();
  const previewSidebar = (() => {
    if (!dragId || !overId || !overPos || dragId === overId) return sections;
    const fromIdx = sections.findIndex(s => s.id === dragId);
    let toIdx     = sections.findIndex(s => s.id === overId);
    if (fromIdx < 0 || toIdx < 0) return sections;
    if (overPos === "after") toIdx += 1;
    if (fromIdx < toIdx) toIdx -= 1;
    if (fromIdx === toIdx) return sections;
    const next = [...sections];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    return next;
  })();
  const visibleCount = visibleSections.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      {/* Canvas — wireframe preview */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 sm:p-5">
        <div className="pb-3 mb-4 border-b border-[#e8e8e8] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <LayoutPanelTop className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ตัวอย่าง Layout</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${font} text-[11px] text-gray-400 hidden sm:inline`}>ลากการ์ดเพื่อสลับลำดับ</span>
            {/* View mode toggle */}
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = view === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => setView(m.id)}
                    title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${
                      active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"
                    }`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}
                  >
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col gap-4 bg-[#fafbfc] rounded-xl p-4 min-h-[400px] mx-auto w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ maxWidth: view === "mobile" ? 420 : view === "tablet" ? 820 : 1600 }}
        >
          {sections.filter(s => s.visible).length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <EyeOff className="size-8" strokeWidth={1.5} />
              <p className={`${font} text-[13px]`}>ทุก section ถูกซ่อนอยู่</p>
            </div>
          )}
          {previewSections.map((s) => {
            const Icon = sectionIcons[s.id];
            const isDragging = dragId === s.id;
            return (
              <div
                key={s.id}
                draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e) => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`group relative rounded-2xl border-2 transition-all ${
                  isDragging
                    ? "border-dashed opacity-60 bg-[#319754]/5"
                    : "bg-white border-dashed border-gray-200 hover:border-[#319754]/40"
                }`}
                style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}
              >
                {/* Section toolbar */}
                <div className="absolute -top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-3 py-1 border border-gray-200 shadow-sm pointer-events-auto cursor-grab active:cursor-grabbing">
                    <div className="size-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
                      <GripVertical className="size-3" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                    </div>
                    <Icon className="size-3 text-gray-500" strokeWidth={2.2} />
                    <span className={`${font} text-[11px] text-black`} style={{ fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button
                          title="ตั้งค่า section นี้"
                          className="bg-white rounded-full size-7 flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#319754]/40 hover:bg-[#319754]/5 transition-all cursor-pointer"
                        >
                          <Settings className="size-3.5 text-gray-500" strokeWidth={2.2} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={8} className="w-[260px] p-3">
                        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-gray-100">
                          <Icon className="size-3.5" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                          <p className={`${font} text-[13px]`} style={{ fontWeight: 600 }}>{s.label}</p>
                        </div>
                        <SectionSettings
                          id={s.id}
                          configs={configs}
                          setConfigs={setConfigs}
                          isDirty={isSectionDirty(s.id)}
                          onReset={() => resetSection(s.id)}
                        />
                      </PopoverContent>
                    </Popover>
                    <button
                      onClick={() => toggleVisible(s.id)}
                      title="ซ่อน section นี้"
                      className="bg-white rounded-full size-7 flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#ff3b30]/40 hover:bg-[#ff3b30]/5 transition-all cursor-pointer"
                    >
                      <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>

                <div className={`p-4 pt-6 ${isDragging ? "opacity-30" : ""}`}>
                  {s.id === "categories" ? (
                    <CategoriesWire
                      view={view}
                      cfg={configs.categories}
                      categories={previewCategories}
                      catDrag={{ dragId: catDragId }}
                      onCatDragStart={handleCatDragStart}
                      onCatDragOver={handleCatDragOver}
                      onCatDrop={handleCatDrop}
                      onCatDragEnd={handleCatDragEnd}
                    />
                  ) : (
                    sectionRenderers[s.id](view, configs)
                  )}
                </div>
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div
                      className={`${font} flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border-2`}
                      style={{ borderColor: ADMIN_PRIMARY, color: ADMIN_PRIMARY, fontWeight: 600 }}
                    >
                      <GripVertical className="size-3.5" strokeWidth={2.4} />
                      <span className="text-[12px]">วาง “{s.label}” ที่นี่</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar — section controls */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3 h-fit lg:sticky lg:top-4">
        <div className="pb-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-2">
            <Settings className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>การแสดงผล</p>
          </div>
          <p className={`${font} text-[11px] text-gray-500 mt-1`}>เปิด/ปิด และจัดลำดับแต่ละ section</p>
          <p className={`${font} text-[11px] text-gray-400 mt-1`}>
            แสดงอยู่ <span style={{ color: ADMIN_PRIMARY, fontWeight: 600 }}>{visibleCount}</span> จาก {sections.length} section
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {previewSidebar.map((s) => {
            const Icon = sectionIcons[s.id];
            const isDragging = dragId === s.id;
            return (
              <div
                key={s.id}
                draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e) => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`relative flex items-center gap-2 px-2 py-2 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                  isDragging ? "border-dashed bg-[#319754]/5" :
                  s.visible ? "border-gray-200 bg-white hover:border-[#319754]/40" :
                  "border-gray-100 bg-gray-50"
                }`}
                style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}
              >
                <GripVertical className="size-4 text-gray-400 shrink-0" strokeWidth={2.2} />
                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${s.visible ? "" : "opacity-40"}`}
                  style={{ backgroundColor: s.visible ? `${ADMIN_PRIMARY}1a` : "#f5f5f5" }}>
                  <Icon className="size-3.5" style={{ color: s.visible ? ADMIN_PRIMARY : "#999" }} strokeWidth={2.2} />
                </div>
                <span className={`${font} text-[13px] flex-1 truncate ${s.visible ? "text-black" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                  {s.label}
                </span>
                <button
                  onClick={() => toggleVisible(s.id)}
                  title={s.visible ? "ซ่อน" : "แสดง"}
                  className="size-7 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer shrink-0 transition-colors"
                >
                  {s.visible
                    ? <Eye className="size-3.5 text-gray-600" strokeWidth={2.2} />
                    : <EyeOff className="size-3.5 text-gray-400" strokeWidth={2.2} />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#e8e8e8] flex gap-2">
          <button
            onClick={resetAll}
            disabled={!isDirty}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border text-[12px] transition-all ${
              isDirty ? "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer" : "border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}
          >
            <RotateCcw className="size-3.5" strokeWidth={2.2} />
            รีเซ็ตทั้งหมด
          </button>
          <button
            onClick={() => { setPreviewView(view); setShowSave(true); }}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl text-white text-[12px] transition-all cursor-pointer hover:opacity-90`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}
          >
            <Save className="size-3.5" strokeWidth={2.2} />
            บันทึก
          </button>
        </div>
      </div>

      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent className="!max-w-[95vw] !w-[1500px] max-h-[92vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-100">
            <DialogTitle className={`${font} text-[17px]`} style={{ fontWeight: 600 }}>ตัวอย่างก่อนบันทึก</DialogTitle>
            <DialogDescription className={`${font} text-[12px] text-gray-500`}>
              นี่คือภาพหน้าจริงที่ผู้ใช้จะเห็น — ถ้าตกลง กดปุ่ม “ยืนยันบันทึก”
            </DialogDescription>
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5 self-start mt-2">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = previewView === m.id;
                return (
                  <button key={m.id} onClick={() => setPreviewView(m.id)} title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-[#e9ecef] p-4">
            <div
              className="mx-auto transition-[max-width] duration-500"
              style={{ maxWidth: previewView === "mobile" ? 420 : previewView === "tablet" ? 820 : 1280 }}
            >
              <BrowserMockup url="metaherb.com/" view={previewView}>
              <SitePreviewFrame currentPath="/" view={previewView}>
              <div className={`flex flex-col gap-4 py-4 ${previewView === "desktop" ? "px-12" : previewView === "tablet" ? "px-5" : "px-3"}`}>
              {sections.filter(s => s.visible).map((s) => {
                if (s.id === "banner")     return <HomeBannerPreview     key={s.id} cfg={configs.banner}     view={previewView} />;
                if (s.id === "categories") return <HomeCategoriesPreview key={s.id} cfg={configs.categories} view={previewView} categories={categories} />;
                if (s.id === "recommended")return <HomeProductsPreview   key={s.id} cfg={configs.recommended} view={previewView} />;
                if (s.id === "flashsale")  return <HomeProductsPreview   key={s.id} cfg={configs.flashsale}  view={previewView} accent showCountdown={configs.flashsale.showCountdown} />;
                if (s.id === "articles")   return <HomeArticlesPreview   key={s.id} view={previewView} />;
                if (s.id === "videos")     return <HomeVideosPreview     key={s.id} view={previewView} />;
                return null;
              })}
              {sections.filter(s => s.visible).length === 0 && (
                <div className="text-center text-gray-400 py-12">— ไม่มี section ที่จะแสดง —</div>
              )}
              </div>
              </SitePreviewFrame>
              </BrowserMockup>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 gap-2">
            <button onClick={() => setShowSave(false)}
              className={`${font} h-9 px-5 rounded-xl border border-gray-200 text-gray-700 text-[12px] hover:bg-gray-50 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
            <button onClick={() => { toast.success("บันทึก layout เรียบร้อย"); setShowSave(false); }}
              className={`${font} h-9 px-5 rounded-xl text-white text-[12px] cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-1.5`}
              style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
              <Save className="size-3.5" strokeWidth={2.2} />
              ยืนยันบันทึก
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========== PAGE PRODUCTS BUILDER ========== */
type FilterKey = "category" | "productType" | "price" | "sort" | "brand" | "rating" | "discount" | "stock";
type CardKey   = "originalPrice" | "discountBadge" | "flashSaleBadge" | "rating" | "soldCount" | "wishlist" | "quickView";

interface ProductsMainConfig {
  showFilter: boolean;
  filterPosition: "left" | "right";
  filters: Record<FilterKey, boolean>;
  card: Record<CardKey, boolean>;
  desktopCols: number;
  itemsPerPage: number;
  paginationMode: "pagination" | "loadMore";
}

const DEFAULT_PRODUCTS_MAIN: ProductsMainConfig = {
  showFilter: true,
  filterPosition: "left",
  filters: {
    category: true, productType: true, price: true, sort: true,
    brand: false, rating: false, discount: false, stock: false,
  },
  card: {
    originalPrice: true, discountBadge: true, flashSaleBadge: true,
    rating: true, soldCount: true, wishlist: true, quickView: false,
  },
  desktopCols: 4,
  itemsPerPage: 24,
  paginationMode: "pagination",
};

const FILTER_LABELS: Record<FilterKey, string> = {
  category: "หมวดหมู่", productType: "ประเภทสินค้า", price: "ช่วงราคา", sort: "เรียงตาม",
  brand: "แบรนด์/ร้านค้า", rating: "Rating", discount: "ส่วนลด", stock: "สต็อก",
};
const CARD_LABELS: Record<CardKey, string> = {
  originalPrice: "ราคาเดิม (ขีดทับ)", discountBadge: "Badge ส่วนลด %", flashSaleBadge: "Badge Flash Sale",
  rating: "Rating (ดาว + เลข)", soldCount: "จำนวนที่ขายแล้ว", wishlist: "ปุ่ม Wishlist", quickView: "Quick View / Add to Cart",
};

function FilterBlock({ body }: { body: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5 pt-2 border-t border-gray-100">
      <div className="h-3 bg-gray-300 rounded-full w-24" />
      {body}
    </div>
  );
}

function ProductsMainWire({ cfg, view }: { cfg: ProductsMainConfig; view: ViewMode }) {
  const desktopColsClass: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };
  const cols = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-3" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-4");
  const itemCount = view === "mobile" ? Math.min(6, cfg.itemsPerPage) : view === "tablet" ? Math.min(6, cfg.itemsPerPage) : Math.min(cfg.itemsPerPage, cfg.desktopCols * 2);
  const showSidebar = cfg.showFilter && view !== "mobile";

  const filterBody: Record<FilterKey, React.ReactNode> = {
    category: <div className="h-7 rounded-full bg-gray-100" />,
    productType: (
      <div className="flex flex-col gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-3 rounded-full border border-gray-300" />
            <SkelLine w={i === 0 ? "60%" : i === 1 ? "70%" : "50%"} />
          </div>
        ))}
      </div>
    ),
    price: (
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between"><SkelLine w="30%" /><SkelLine w="30%" /></div>
        <div className="h-1 bg-gray-200 rounded-full relative">
          <div className="absolute h-full w-2/3 bg-gray-300 rounded-full" />
          <div className="absolute size-3 bg-white border border-gray-300 rounded-full -top-1 left-[20%]" />
          <div className="absolute size-3 bg-white border border-gray-300 rounded-full -top-1 left-[60%]" />
        </div>
      </div>
    ),
    sort: <div className="h-7 rounded-full bg-gray-100" />,
    brand: (
      <div className="flex flex-col gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-3 rounded-sm border border-gray-300" />
            <SkelLine w="60%" />
          </div>
        ))}
      </div>
    ),
    rating: (
      <div className="flex flex-col gap-1">
        {[0,1,2].map(i => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="size-3 rounded-sm border border-gray-300" />
            <div className="flex gap-0.5">{[0,1,2,3,4].map(s => <div key={s} className={`size-2 rounded-sm ${s < 4-i ? "bg-gray-300" : "bg-gray-100"}`} />)}</div>
          </div>
        ))}
      </div>
    ),
    discount: (
      <div className="flex flex-col gap-1">
        {[0,1].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-3 rounded-sm border border-gray-300" />
            <SkelLine w={i === 0 ? "55%" : "70%"} />
          </div>
        ))}
      </div>
    ),
    stock: (
      <div className="flex items-center gap-2">
        <div className="size-3 rounded-sm border border-gray-300" />
        <SkelLine w="60%" />
      </div>
    ),
  };

  const enabledFilters = (Object.keys(cfg.filters) as FilterKey[]).filter((k) => cfg.filters[k]);

  const sidebar = (
    <div className="w-[200px] shrink-0 flex flex-col gap-3 p-3 border border-gray-200 rounded-xl bg-white self-start">
      <div className="flex items-center justify-between">
        <div className="h-3 bg-gray-300 rounded-full w-16" />
        <div className="size-4 rounded-full border border-gray-300" />
      </div>
      {enabledFilters.length === 0 && (
        <div className="text-center py-2 text-[10px] text-gray-300">— ไม่มี filter ที่เปิดอยู่ —</div>
      )}
      {enabledFilters.map((k) => <FilterBlock key={k} body={filterBody[k]} />)}
    </div>
  );

  const grid = (
    <div className="flex-1 min-w-0">
      <div className={`grid ${cols} gap-2`}>
        {Array.from({ length: itemCount }).map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-xl overflow-hidden flex flex-col bg-white">
            <div className="aspect-square bg-gray-100 relative">
              {cfg.card.flashSaleBadge && (
                <div className="absolute top-1.5 left-1.5 bg-gray-300 px-1.5 h-4 rounded-full inline-flex items-center">
                  <div className="h-1.5 w-8 bg-white/60 rounded-full" />
                </div>
              )}
              {cfg.card.discountBadge && (
                <div className="absolute top-1.5 right-1.5 bg-gray-300 px-1.5 h-4 rounded-full inline-flex items-center">
                  <div className="h-1.5 w-5 bg-white/60 rounded-full" />
                </div>
              )}
              {cfg.card.wishlist && (
                <div className="absolute bottom-1.5 right-1.5 size-5 rounded-full bg-white/80 border border-gray-200 inline-flex items-center justify-center">
                  <Heart className="size-2.5 text-gray-400" strokeWidth={1.8} />
                </div>
              )}
            </div>
            <div className="p-2 flex flex-col gap-1">
              <SkelLine w="85%" />
              <div className="flex items-center gap-2">
                <div className="h-3 bg-gray-300 rounded-full w-12" />
                {cfg.card.originalPrice && <div className="h-2 bg-gray-200 rounded-full w-8 line-through" />}
              </div>
              {(cfg.card.rating || cfg.card.soldCount) && (
                <div className="flex items-center justify-between">
                  {cfg.card.rating ? (
                    <div className="flex items-center gap-1">
                      <div className="size-2 rounded-sm bg-gray-300" />
                      <SkelLine w="20px" />
                    </div>
                  ) : <span />}
                  {cfg.card.soldCount && <SkelLine w="30px" />}
                </div>
              )}
              {cfg.card.quickView && (
                <div className="h-5 rounded-full bg-gray-200 mt-1" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {cfg.paginationMode === "pagination" ? (
          [0,1,2,3,4].map((i) => (
            <div key={i} className={`size-7 rounded-lg ${i === 0 ? "bg-gray-300" : "bg-gray-100 border border-gray-200"}`} />
          ))
        ) : (
          <div className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-gray-200">
            <SkelLine w="70px" />
          </div>
        )}
      </div>
    </div>
  );
  if (!showSidebar) return grid;
  return (
    <div className="flex gap-3">
      {cfg.filterPosition === "left" ? <>{sidebar}{grid}</> : <>{grid}{sidebar}</>}
    </div>
  );
}

function ProductsListPreview({ cfg, view }: { cfg: ProductsMainConfig; view: ViewMode }) {
  const desktopColsClass: Record<number, string> = { 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-3" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-4");
  const count = view === "mobile" ? 6 : view === "tablet" ? 6 : Math.min(cfg.itemsPerPage, realProducts.length);
  const items = realProducts.slice(0, count);
  const showSidebar = cfg.showFilter && view !== "mobile";
  const enabledFilters = (Object.keys(cfg.filters) as FilterKey[]).filter(k => cfg.filters[k]);

  const sidebar = (
    <aside className="w-[218px] shrink-0 self-start">
      <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 border border-gray-100">
        <div className="flex items-center justify-between">
          <span className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>ตัวกรอง</span>
          <RotateCcw className="size-4 text-gray-400 cursor-pointer" strokeWidth={2} />
        </div>
        {enabledFilters.length === 0 && <p className={`${font} text-[11px] text-gray-400 text-center py-2`}>— ไม่มี filter ที่เปิดอยู่ —</p>}
        {enabledFilters.includes("category") && (
          <div className="flex flex-col gap-2">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>หมวดหมู่</span>
            <div className={`${font} bg-[#fafafa] h-9 rounded-full px-3 text-[12px] flex items-center justify-between border border-gray-100`}>
              <span className="text-gray-700">ทั้งหมด</span>
              <ChevronDown className="size-3 text-gray-400" />
            </div>
          </div>
        )}
        {enabledFilters.includes("productType") && (
          <div className="flex flex-col gap-1.5">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>ประเภทสินค้า</span>
            {["ทั้งหมด", "สินค้า Flash Sale", "สินค้าโปรโมชัน"].map((t, i) => (
              <div key={t} className="flex items-center gap-2">
                <span className={`size-3.5 rounded-full border-2 flex items-center justify-center ${i === 0 ? "border-[#319754]" : "border-gray-300"}`}>
                  {i === 0 && <span className="size-1.5 rounded-full bg-[#319754]" />}
                </span>
                <span className={`${font} text-[12px] ${i === 0 ? "text-[#319754]" : "text-gray-700"}`}>{t}</span>
              </div>
            ))}
          </div>
        )}
        {enabledFilters.includes("price") && (
          <div className="flex flex-col gap-2">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>ช่วงราคา</span>
            <div className={`${font} flex items-center justify-between text-[12px] text-[#319754]`} style={{ fontWeight: 600 }}>
              <span>฿0</span><span className="text-gray-300">—</span><span>฿500</span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full relative">
              <div className="absolute h-full w-2/3 left-[16%] bg-gradient-to-r from-[#319754] to-[#46A165] rounded-full" />
              <div className="absolute size-4 bg-white border-2 border-[#319754] rounded-full -top-1 left-[16%]" />
              <div className="absolute size-4 bg-white border-2 border-[#319754] rounded-full -top-1 left-[80%]" />
            </div>
          </div>
        )}
        {enabledFilters.includes("brand") && (
          <div className="flex flex-col gap-1.5">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>แบรนด์/ร้านค้า</span>
            {["Metaherb Store", "บ้านสมุนไพรไทย", "อโรม่าฟาร์ม"].map((b) => (
              <label key={b} className="flex items-center gap-2 cursor-pointer">
                <span className="size-3.5 rounded-sm border border-gray-300" />
                <span className={`${font} text-[12px] text-gray-700`}>{b}</span>
              </label>
            ))}
          </div>
        )}
        {enabledFilters.includes("rating") && (
          <div className="flex flex-col gap-1.5">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>Rating</span>
            {[5, 4, 3].map((r) => (
              <label key={r} className="flex items-center gap-1.5 cursor-pointer">
                <span className="size-3.5 rounded-sm border border-gray-300" />
                <div className="flex gap-0.5">
                  {[0,1,2,3,4].map(s => <Star key={s} className={`size-3 ${s < r ? "fill-[#f7c42b] text-[#f7c42b]" : "text-gray-200"}`} strokeWidth={1} />)}
                </div>
                <span className={`${font} text-[11px] text-gray-500`}>ขึ้นไป</span>
              </label>
            ))}
          </div>
        )}
        {enabledFilters.includes("discount") && (
          <div className="flex flex-col gap-1.5">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>ส่วนลด</span>
            {["มีส่วนลด", "Flash Sale"].map((d) => (
              <label key={d} className="flex items-center gap-2 cursor-pointer">
                <span className="size-3.5 rounded-sm border border-gray-300" />
                <span className={`${font} text-[12px] text-gray-700`}>{d}</span>
              </label>
            ))}
          </div>
        )}
        {enabledFilters.includes("stock") && (
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="size-3.5 rounded-sm border border-gray-300" />
            <span className={`${font} text-[12px] text-gray-700`}>เฉพาะที่พร้อมส่ง</span>
          </label>
        )}
        {enabledFilters.includes("sort") && (
          <div className="flex flex-col gap-2">
            <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เรียงตาม</span>
            <div className={`${font} bg-[#fafafa] h-9 rounded-full px-3 text-[12px] flex items-center justify-between border border-gray-100`}>
              <span className="text-gray-700">จากมากไปน้อย</span>
              <ChevronDown className="size-3 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );

  const grid = (
    <div className="flex-1 min-w-0">
      <div className={`grid ${cols} gap-3`}>
        {items.map((p, i) => (
          <div key={i} className="bg-white rounded-[12px] border border-[#d4d4d4] overflow-hidden hover:shadow-lg transition-all flex flex-col">
            <div className="aspect-square bg-gray-100 relative">
              <img src={pickProductImage(p, i)} alt={p.name} className="absolute inset-0 w-full h-full object-cover" />
              {cfg.card.flashSaleBadge && p.isFlashSale && (
                <div className="absolute top-1.5 left-1.5 bg-[rgba(230,46,5,0.9)] text-white px-2 h-5 rounded-full inline-flex items-center text-[9px]" style={{ fontWeight: 600 }}>
                  Flash Sale
                </div>
              )}
              {cfg.card.discountBadge && p.discountPercent && (
                <div className="absolute top-1.5 right-1.5 bg-[#e62e05] text-white px-2 h-5 rounded-full inline-flex items-center text-[10px]" style={{ fontWeight: 600 }}>
                  -{p.discountPercent}%
                </div>
              )}
              {cfg.card.wishlist && (
                <div className="absolute bottom-1.5 right-1.5 size-7 rounded-full bg-white/90 border border-gray-200 inline-flex items-center justify-center">
                  <Heart className="size-3.5 text-gray-400" strokeWidth={1.8} />
                </div>
              )}
            </div>
            <div className="p-2 flex flex-col gap-1">
              <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
              <div className="flex items-center gap-1.5">
                <span className={`${font} text-[13px] text-[#319754]`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                {cfg.card.originalPrice && p.originalPrice && <span className={`${font} text-[10px] text-[#a3a3a3] line-through`}>฿{p.originalPrice.toFixed(2)}</span>}
              </div>
              {(cfg.card.rating || cfg.card.soldCount) && (
                <div className="flex items-center justify-between">
                  {cfg.card.rating ? (
                    <div className="flex items-center gap-1">
                      <Star className="size-3 fill-[#f7c42b] text-[#f7c42b]" strokeWidth={1.5} />
                      <span className={`${font} text-[10px] text-gray-700`}>{p.rating}</span>
                    </div>
                  ) : <span />}
                  {cfg.card.soldCount && <span className={`${font} text-[10px] text-gray-500`}>{p.sold}</span>}
                </div>
              )}
              {cfg.card.quickView && (
                <button className={`${font} mt-1 h-7 rounded-full bg-[#319754]/10 text-[#319754] text-[11px] hover:bg-[#319754] hover:text-white transition-colors`} style={{ fontWeight: 500 }}>
                  ดูเพิ่มเติม
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        {cfg.paginationMode === "pagination" ? (
          <>
            <button className="size-8 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-[#319754]/10">
              <ChevronLeft className="size-4" strokeWidth={2.4} />
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button key={p} className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] ${p === 1 ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                style={{ fontWeight: p === 1 ? 600 : 400 }}>{p}</button>
            ))}
            <button className="size-8 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-[#319754]/10">
              <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </>
        ) : (
          <button className={`${font} h-9 px-6 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745]`} style={{ fontWeight: 500 }}>
            โหลดเพิ่ม
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4">
      {!showSidebar ? grid : cfg.filterPosition === "left" ? <>{sidebar}{grid}</> : <>{grid}{sidebar}</>}
    </div>
  );
}

function PageProductsBuilder() {
  const [cfg, setCfg]   = useState<ProductsMainConfig>(DEFAULT_PRODUCTS_MAIN);
  const [view, setView] = useState<ViewMode>("desktop");
  const [showSave, setShowSave] = useState(false);
  const [previewView, setPreviewView] = useState<ViewMode>("desktop");

  const isDirty = JSON.stringify(cfg) !== JSON.stringify(DEFAULT_PRODUCTS_MAIN);
  const reset = () => setCfg(DEFAULT_PRODUCTS_MAIN);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      {/* Canvas */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 sm:p-5">
        <div className="pb-3 mb-4 border-b border-[#e8e8e8] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Package className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ตัวอย่าง Layout</p>
          </div>
          <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5">
            {([
              { id: "desktop" as const, label: "Desktop", Icon: Monitor },
              { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
              { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
            ]).map((m) => {
              const active = view === m.id;
              return (
                <button key={m.id} onClick={() => setView(m.id)} title={m.label}
                  className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                  style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                  <m.Icon className="size-3.5" strokeWidth={2.2} />
                  {m.label}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className="bg-[#fafbfc] rounded-xl p-4 min-h-[400px] mx-auto w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ maxWidth: view === "mobile" ? 420 : view === "tablet" ? 820 : 1600 }}
        >
          <ProductsMainWire cfg={cfg} view={view} />
        </div>
      </div>

      {/* Sidebar — direct config controls */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3 h-fit lg:sticky lg:top-4">
        <div className="pb-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-2">
            <Settings className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>การแสดงผล</p>
          </div>
          <p className={`${font} text-[11px] text-gray-500 mt-1`}>ปรับแต่ง Filter + Grid</p>
        </div>

        {/* Section: Filter Sidebar */}
        <div className="flex flex-col gap-1">
          <p className={`${font} text-[11px] uppercase tracking-wide text-gray-400 mb-1`} style={{ fontWeight: 600 }}>Filter Sidebar</p>
          <div className="flex flex-col divide-y divide-gray-100">
            <ConfigRow label="แสดง Filter Sidebar">
              <ToggleSwitch checked={cfg.showFilter} onChange={(v) => setCfg(c => ({ ...c, showFilter: v }))} />
            </ConfigRow>
            {cfg.showFilter && (
              <ConfigRow label="ตำแหน่ง Filter">
                <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
                  {(["left", "right"] as const).map((pos) => {
                    const active = cfg.filterPosition === pos;
                    return (
                      <button key={pos} onClick={() => setCfg(c => ({ ...c, filterPosition: pos }))}
                        className={`${font} px-2.5 h-6 rounded-md text-[11px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                        style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                        {pos === "left" ? "ซ้าย" : "ขวา"}
                      </button>
                    );
                  })}
                </div>
              </ConfigRow>
            )}
          </div>
        </div>

        {/* Section: Filter items */}
        {cfg.showFilter && (
          <div className="flex flex-col gap-1">
            <p className={`${font} text-[11px] uppercase tracking-wide text-gray-400 mb-1`} style={{ fontWeight: 600 }}>Filter ที่แสดง</p>
            <div className="flex flex-col divide-y divide-gray-100">
              {(Object.keys(cfg.filters) as FilterKey[]).map((k) => (
                <ConfigRow key={k} label={FILTER_LABELS[k]}>
                  <ToggleSwitch checked={cfg.filters[k]} onChange={(v) => setCfg(c => ({ ...c, filters: { ...c.filters, [k]: v } }))} />
                </ConfigRow>
              ))}
            </div>
          </div>
        )}

        {/* Section: Card */}
        <div className="flex flex-col gap-1">
          <p className={`${font} text-[11px] uppercase tracking-wide text-gray-400 mb-1`} style={{ fontWeight: 600 }}>การ์ดสินค้า</p>
          <div className="flex flex-col divide-y divide-gray-100">
            {(Object.keys(cfg.card) as CardKey[]).map((k) => (
              <ConfigRow key={k} label={CARD_LABELS[k]}>
                <ToggleSwitch checked={cfg.card[k]} onChange={(v) => setCfg(c => ({ ...c, card: { ...c.card, [k]: v } }))} />
              </ConfigRow>
            ))}
          </div>
        </div>

        {/* Section: Grid / Pagination */}
        <div className="flex flex-col gap-1">
          <p className={`${font} text-[11px] uppercase tracking-wide text-gray-400 mb-1`} style={{ fontWeight: 600 }}>Grid / Pagination</p>
          <div className="flex flex-col divide-y divide-gray-100">
            <ConfigRow label="คอลัมน์ (Desktop)">
              <Stepper value={cfg.desktopCols} min={3} max={5} onChange={(v) => setCfg(c => ({ ...c, desktopCols: v }))} />
            </ConfigRow>
            <ConfigRow label="จำนวนต่อหน้า">
              <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
                {[12, 24, 48, 96].map((n) => {
                  const active = cfg.itemsPerPage === n;
                  return (
                    <button key={n} onClick={() => setCfg(c => ({ ...c, itemsPerPage: n }))}
                      className={`${font} px-2 h-6 rounded-md text-[11px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                      style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </ConfigRow>
            <ConfigRow label="โหมด Pagination">
              <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
                {([
                  { id: "pagination" as const, label: "หน้า" },
                  { id: "loadMore"   as const, label: "โหลดเพิ่ม" },
                ]).map((m) => {
                  const active = cfg.paginationMode === m.id;
                  return (
                    <button key={m.id} onClick={() => setCfg(c => ({ ...c, paginationMode: m.id }))}
                      className={`${font} px-2.5 h-6 rounded-md text-[11px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                      style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </ConfigRow>
          </div>
        </div>

        <div className="pt-3 border-t border-[#e8e8e8] flex gap-2">
          <button onClick={reset} disabled={!isDirty}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border text-[12px] transition-all ${
              isDirty ? "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer" : "border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}>
            <RotateCcw className="size-3.5" strokeWidth={2.2} />
            รีเซ็ตทั้งหมด
          </button>
          <button onClick={() => { setPreviewView(view); setShowSave(true); }}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl text-white text-[12px] transition-all cursor-pointer hover:opacity-90`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Save className="size-3.5" strokeWidth={2.2} />
            บันทึก
          </button>
        </div>
      </div>

      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent className="!max-w-[95vw] !w-[1500px] max-h-[92vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-100">
            <DialogTitle className={`${font} text-[17px]`} style={{ fontWeight: 600 }}>ตัวอย่างก่อนบันทึก</DialogTitle>
            <DialogDescription className={`${font} text-[12px] text-gray-500`}>
              นี่คือภาพหน้าจริงที่ผู้ใช้จะเห็น — ถ้าตกลง กดปุ่ม “ยืนยันบันทึก”
            </DialogDescription>
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5 self-start mt-2">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = previewView === m.id;
                return (
                  <button key={m.id} onClick={() => setPreviewView(m.id)} title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-[#e9ecef] p-4">
            <div
              className="mx-auto transition-[max-width] duration-500"
              style={{ maxWidth: previewView === "mobile" ? 420 : previewView === "tablet" ? 820 : 1280 }}
            >
              <BrowserMockup url="metaherb.com/products" view={previewView}>
                <SitePreviewFrame currentPath="/products" view={previewView}>
                  <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
                    <h1 className={`${font} text-[20px] text-[#319754]`} style={{ fontWeight: 500 }}>ผลิตภัณฑ์ทั้งหมด</h1>
                  </div>
                  <div className={`py-4 ${previewView === "desktop" ? "px-12" : previewView === "tablet" ? "px-5" : "px-3"}`}>
                    <ProductsListPreview cfg={cfg} view={previewView} />
                  </div>
                </SitePreviewFrame>
              </BrowserMockup>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 gap-2">
            <button onClick={() => setShowSave(false)}
              className={`${font} h-9 px-5 rounded-xl border border-gray-200 text-gray-700 text-[12px] hover:bg-gray-50 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
            <button onClick={() => { toast.success("บันทึก layout เรียบร้อย"); setShowSave(false); }}
              className={`${font} h-9 px-5 rounded-xl text-white text-[12px] cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-1.5`}
              style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
              <Save className="size-3.5" strokeWidth={2.2} />
              ยืนยันบันทึก
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========== PAGE BLOG BUILDER ========== */
type BlogSectionId = "blog_articles" | "blog_videos";
interface BlogSection { id: BlogSectionId; label: string; visible: boolean; }

const DEFAULT_BLOG_SECTIONS: BlogSection[] = [
  { id: "blog_articles", label: "บทความ", visible: true },
  { id: "blog_videos",   label: "วีดีโอ",  visible: true },
];

type ArticleCardKey = "viewCount" | "date" | "category" | "description" | "readMore";

interface BlogConfigs {
  blog_articles: {
    desktopCols: number;
    showSort: boolean;
    itemsPerPage: number;
    paginationMode: "pagination" | "loadMore";
    cardLayout: "horizontal" | "vertical";
    card: Record<ArticleCardKey, boolean>;
  };
  blog_videos:   { desktopCols: number; showSort: boolean };
}

const DEFAULT_BLOG_CONFIGS: BlogConfigs = {
  blog_articles: {
    desktopCols: 3, showSort: true, itemsPerPage: 12, paginationMode: "pagination",
    cardLayout: "horizontal",
    card: { viewCount: true, date: true, category: false, description: true, readMore: true },
  },
  blog_videos: { desktopCols: 6, showSort: true },
};

const HOME_BANNER_IMAGES = [
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1600&q=80",
  "https://images.unsplash.com/photo-1611073615452-04d76e76e8b2?w=1200&q=80",
  "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1200&q=80",
];

// Fallback images for products (real product.image is often empty) — mirrors HomePage's SAFE_IMAGES
const SAFE_PRODUCT_IMAGES = [
  "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=600&q=80",
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=600&q=80",
  "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=600&q=80",
  "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=600&q=80",
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=600&q=80",
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=600&q=80",
  "https://images.unsplash.com/photo-1558429773-0d5084b445aa?w=600&q=80",
  "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=600&q=80",
  "https://images.unsplash.com/photo-1765850257647-811b8d3c20ca?w=600&q=80",
  "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=600&q=80",
  "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=600&q=80",
];
const pickProductImage = (p: { image?: string }, idx: number) =>
  p.image && p.image.startsWith("http") ? p.image : SAFE_PRODUCT_IMAGES[idx % SAFE_PRODUCT_IMAGES.length];

const ARTICLE_CARD_LABELS: Record<ArticleCardKey, string> = {
  viewCount: "View count badge", date: "วันที่",  category: "หมวดหมู่บทความ",
  description: "คำอธิบายย่อ",   readMore: "ปุ่ม “อ่านเพิ่มเติม”",
};

const blogSectionIcons: Record<BlogSectionId, any> = {
  blog_articles: FileText, blog_videos: Video,
};

function BlogArticlesWire({ cfg, view }: { cfg: BlogConfigs["blog_articles"]; view: ViewMode }) {
  const desktopColsClass: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };
  const cols  = view === "mobile" ? "grid-cols-1" : view === "tablet" ? "grid-cols-2" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-3");
  const count = view === "mobile" ? 4 : view === "tablet" ? 4 : Math.min(cfg.itemsPerPage, cfg.desktopCols * 2);
  // Force vertical layout on mobile (horizontal layout cramps on small width)
  const isHorizontal = cfg.cardLayout === "horizontal" && view !== "mobile";

  const imageArea = (
    <div className={`bg-gray-100 relative ${isHorizontal ? "w-[40%] shrink-0" : "aspect-[16/9] w-full"}`}>
      {cfg.card.viewCount && (
        <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-gray-200/80 px-1.5 h-4 rounded-full">
          <div className="size-1.5 rounded-full bg-gray-400" />
          <SkelLine w="20px" />
        </div>
      )}
      {cfg.card.date && (
        <div className="absolute bottom-1.5 left-1.5 bg-gray-200/80 px-1.5 h-4 rounded-full inline-flex items-center">
          <SkelLine w="40px" />
        </div>
      )}
    </div>
  );
  const contentArea = (
    <div className="flex-1 p-3 flex flex-col gap-1.5 min-w-0">
      {cfg.card.category && (
        <div className="h-3 w-16 bg-gray-200 rounded-full" />
      )}
      <SkelLine w="90%" />
      <SkelLine w="80%" />
      {cfg.card.description && (
        <>
          <div className="h-2 bg-gray-100 rounded-full w-full mt-1" />
          <div className="h-2 bg-gray-100 rounded-full w-[85%]" />
        </>
      )}
      {cfg.card.readMore && (
        <div className="h-5 w-20 bg-gray-200 rounded-full mt-auto" />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded-full w-20" />
        {cfg.showSort && (
          <div className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-gray-200 bg-white">
            <SkelLine w="60px" />
            <ChevronDown className="size-3 text-gray-400" strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div className={`grid ${cols} gap-3`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`border border-gray-200 rounded-xl overflow-hidden bg-white ${
            isHorizontal ? "flex h-[140px]" : "flex flex-col"
          }`}>
            {imageArea}
            {contentArea}
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {cfg.paginationMode === "pagination" ? (
          [0,1,2,3,4].map((i) => (
            <div key={i} className={`size-7 rounded-lg ${i === 0 ? "bg-gray-300" : "bg-gray-100 border border-gray-200"}`} />
          ))
        ) : (
          <div className="inline-flex items-center gap-1.5 h-8 px-4 rounded-full bg-gray-200">
            <SkelLine w="70px" />
          </div>
        )}
      </div>
    </div>
  );
}

function BlogVideosWire({ cfg, view }: { cfg: BlogConfigs["blog_videos"]; view: ViewMode }) {
  const desktopColsClass: Record<number, string> = { 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-3" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-6");
  const count = view === "mobile" ? 4 : view === "tablet" ? 6 : cfg.desktopCols;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-300 rounded-full w-20" />
        {cfg.showSort && (
          <div className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded-lg border border-gray-200 bg-white">
            <SkelLine w="60px" />
            <ChevronDown className="size-3 text-gray-400" strokeWidth={2.2} />
          </div>
        )}
      </div>
      <div className={`grid ${cols} gap-2`}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="aspect-[3/4] rounded-xl bg-gray-100 border border-gray-200 flex flex-col justify-between p-2 relative">
            <div className="bg-gray-200/80 px-2 h-5 rounded-full inline-flex items-center gap-1 self-start">
              <div className="size-1.5 rounded-full bg-gray-400" />
              <SkelLine w="20px" />
            </div>
            <Video className="size-7 text-gray-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" strokeWidth={1.5} />
            <div className="bg-gray-200/80 px-2 h-5 rounded-full inline-flex items-center justify-center">
              <SkelLine w="60%" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogSectionSettings({ id, configs, setConfigs }: {
  id: BlogSectionId;
  configs: BlogConfigs;
  setConfigs: React.Dispatch<React.SetStateAction<BlogConfigs>>;
}) {
  const upd = <K extends BlogSectionId>(key: K, patch: Partial<BlogConfigs[K]>) =>
    setConfigs(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  if (id === "blog_articles") {
    const c = configs.blog_articles;
    return (
      <div className="flex flex-col gap-3">
        {/* Section: Grid */}
        <div className="flex flex-col gap-1">
          <p className={`${font} text-[11px] uppercase tracking-wide text-gray-400 mb-1`} style={{ fontWeight: 600 }}>Grid</p>
          <div className="flex flex-col divide-y divide-gray-100">
            <ConfigRow label="คอลัมน์ (Desktop)">
              <Stepper
                value={c.desktopCols}
                min={c.cardLayout === "vertical" ? 2 : 1}
                max={c.cardLayout === "vertical" ? 5 : 3}
                onChange={(v) => upd("blog_articles", { desktopCols: v })}
              />
            </ConfigRow>
            <ConfigRow label="แสดง Sort dropdown">
              <ToggleSwitch checked={c.showSort} onChange={(v) => upd("blog_articles", { showSort: v })} />
            </ConfigRow>
            <ConfigRow label="จำนวนต่อหน้า">
              <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
                {[6, 12, 24, 48].map((n) => {
                  const active = c.itemsPerPage === n;
                  return (
                    <button key={n} onClick={() => upd("blog_articles", { itemsPerPage: n })}
                      className={`${font} px-2 h-6 rounded-md text-[11px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                      style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </ConfigRow>
            <ConfigRow label="โหมด Pagination">
              <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
                {([
                  { id: "pagination" as const, label: "หน้า" },
                  { id: "loadMore"   as const, label: "โหลดเพิ่ม" },
                ]).map((m) => {
                  const active = c.paginationMode === m.id;
                  return (
                    <button key={m.id} onClick={() => upd("blog_articles", { paginationMode: m.id })}
                      className={`${font} px-2.5 h-6 rounded-md text-[11px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                      style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </ConfigRow>
          </div>
        </div>

        {/* Section: Card */}
        <div className="flex flex-col gap-1">
          <p className={`${font} text-[11px] uppercase tracking-wide text-gray-400 mb-1`} style={{ fontWeight: 600 }}>การ์ดบทความ</p>
          <div className="flex flex-col divide-y divide-gray-100">
            <ConfigRow label="Layout การ์ด">
              <div className="inline-flex bg-[#f5f5f5] rounded-lg p-0.5">
                {([
                  { id: "horizontal" as const, label: "แนวนอน" },
                  { id: "vertical"   as const, label: "แนวตั้ง" },
                ]).map((m) => {
                  const active = c.cardLayout === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        const nextCols = m.id === "vertical" ? Math.max(2, c.desktopCols) : Math.min(3, c.desktopCols);
                        upd("blog_articles", { cardLayout: m.id, desktopCols: nextCols });
                      }}
                      className={`${font} px-2.5 h-6 rounded-md text-[11px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                      style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                      {m.label}
                    </button>
                  );
                })}
              </div>
            </ConfigRow>
            {(Object.keys(c.card) as ArticleCardKey[]).map((k) => (
              <ConfigRow key={k} label={ARTICLE_CARD_LABELS[k]}>
                <ToggleSwitch checked={c.card[k]} onChange={(v) => upd("blog_articles", { card: { ...c.card, [k]: v } })} />
              </ConfigRow>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // videos
  const c = configs.blog_videos;
  return (
    <div className="flex flex-col divide-y divide-gray-100">
      <ConfigRow label="คอลัมน์ (Desktop)">
        <Stepper value={c.desktopCols} min={4} max={6} onChange={(v) => upd("blog_videos", { desktopCols: v })} />
      </ConfigRow>
      <ConfigRow label="แสดง Sort dropdown">
        <ToggleSwitch checked={c.showSort} onChange={(v) => upd("blog_videos", { showSort: v })} />
      </ConfigRow>
    </div>
  );
}

/* Real-styled (non-wireframe) preview for Save confirmation */
function BlogArticlesPreview({ cfg, view }: { cfg: BlogConfigs["blog_articles"]; view: ViewMode }) {
  const desktopColsClass: Record<number, string> = { 1: "grid-cols-1", 2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4", 5: "grid-cols-5" };
  const cols  = view === "mobile" ? "grid-cols-1" : view === "tablet" ? "grid-cols-2" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-3");
  const count = view === "mobile" ? 4 : view === "tablet" ? 4 : Math.min(cfg.itemsPerPage, realArticles.length);
  const isHorizontal = cfg.cardLayout === "horizontal" && view !== "mobile";
  const items = realArticles.slice(0, count);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 600 }}>บทความ</h2>
        {cfg.showSort && (
          <button className={`${font} flex items-center gap-1 text-gray-500 text-[13px] cursor-pointer`}>จากมากไปน้อย <ChevronDown className="size-4" /></button>
        )}
      </div>
      <div className={`grid ${cols} gap-4`}>
        {items.map((a, i) => (
          <div key={i} className={`bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden hover:shadow-lg transition-all ${isHorizontal ? "flex h-[160px]" : "flex flex-col"}`}>
            <div className={`relative shrink-0 ${isHorizontal ? "w-[40%] h-full" : "aspect-[16/9] w-full"}`}>
              <img src={a.img} alt={a.title} className="absolute inset-0 w-full h-full object-cover" />
              <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                {cfg.card.viewCount && (
                  <div className="bg-black/50 flex items-center gap-1.5 px-2.5 py-1 rounded-full">
                    <Eye className="size-3 text-white" />
                    <span className={`${font} text-[11px] text-white`}>{a.views.toLocaleString()}</span>
                  </div>
                )}
                {cfg.card.date && (
                  <div className="bg-black/50 px-2.5 py-1 rounded-full mt-auto">
                    <span className={`${font} text-[11px] text-white`}>{a.date}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[6px] p-[14px] min-w-0">
              {cfg.card.category && (
                <span className={`${font} inline-block self-start text-[10px] text-[#319754] bg-[#319754]/10 px-2 py-0.5 rounded-full`} style={{ fontWeight: 500 }}>{a.category}</span>
              )}
              <p className={`${font} text-[14px] text-black ${isHorizontal ? "truncate" : "line-clamp-2"}`} style={{ fontWeight: 500 }} title={a.title}>{a.title}</p>
              {cfg.card.description && (
                <p className={`${font} text-[12px] text-[#737373] ${isHorizontal ? "line-clamp-3" : "line-clamp-2"}`}>{a.desc}</p>
              )}
              {cfg.card.readMore && (
                <button className={`${font} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#af6f08]/10 text-[#af6f08] hover:bg-[#af6f08] hover:text-white transition-all self-start mt-auto text-[12px]`} style={{ fontWeight: 500 }}>
                  อ่านเพิ่มเติม
                  <ChevronRight className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        {cfg.paginationMode === "pagination" ? (
          <>
            <button className="size-8 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-[#319754]/10">
              <ChevronLeft className="size-4" strokeWidth={2.4} />
            </button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button key={p}
                className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] ${p === 1 ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                style={{ fontWeight: p === 1 ? 600 : 400 }}>{p}</button>
            ))}
            <button className="size-8 rounded-full inline-flex items-center justify-center text-gray-600 hover:bg-[#319754]/10">
              <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </>
        ) : (
          <button className={`${font} h-9 px-6 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745]`} style={{ fontWeight: 500 }}>
            โหลดเพิ่ม
          </button>
        )}
      </div>
    </div>
  );
}

function BlogVideosPreview({ cfg, view }: { cfg: BlogConfigs["blog_videos"]; view: ViewMode }) {
  const desktopColsClass: Record<number, string> = { 4: "grid-cols-4", 5: "grid-cols-5", 6: "grid-cols-6" };
  const cols  = view === "mobile" ? "grid-cols-2" : view === "tablet" ? "grid-cols-3" : (desktopColsClass[cfg.desktopCols] ?? "grid-cols-6");
  const count = view === "mobile" ? 4 : view === "tablet" ? 6 : cfg.desktopCols;
  const items = realVideos.slice(0, count);
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 600 }}>วีดีโอ</h2>
        {cfg.showSort && (
          <button className={`${font} flex items-center gap-1 text-gray-500 text-[13px] cursor-pointer`}>จากมากไปน้อย <ChevronDown className="size-4" /></button>
        )}
      </div>
      <div className={`grid ${cols} gap-4`}>
        {items.map((v, i) => (
          <div key={i} className="relative aspect-[3/4] rounded-[16px] overflow-hidden cursor-pointer group hover:shadow-lg transition-all">
            <img src={v.img} alt={v.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
            <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
              <div className="bg-black/50 flex items-center gap-1.5 px-3 py-1 rounded-full">
                <Eye className="size-3 text-white" />
                <span className={`${font} text-[12px] text-white`}>{v.views}</span>
              </div>
              <div className="bg-black/50 rounded-full w-full">
                <div className="flex items-center justify-center px-3 py-1">
                  <span className={`${font} text-[12px] text-white truncate`}>{v.title}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PageBlogBuilder() {
  const [sections, setSections] = useState<BlogSection[]>(DEFAULT_BLOG_SECTIONS);
  const [configs, setConfigs]   = useState<BlogConfigs>(DEFAULT_BLOG_CONFIGS);
  const [dragId, setDragId]     = useState<BlogSectionId | null>(null);
  const [overId, setOverId]     = useState<BlogSectionId | null>(null);
  const [overPos, setOverPos]   = useState<"before" | "after" | null>(null);
  const [view, setView]         = useState<ViewMode>("desktop");
  const [showSave, setShowSave] = useState(false);
  const [previewView, setPreviewView] = useState<ViewMode>("desktop");

  const toggleVisible = (id: BlogSectionId) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));

  const reorder = (from: BlogSectionId, to: BlogSectionId, pos: "before" | "after") => {
    setSections(prev => {
      const fromIdx = prev.findIndex(s => s.id === from);
      let toIdx     = prev.findIndex(s => s.id === to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      if (pos === "after") toIdx += 1;
      if (fromIdx < toIdx) toIdx -= 1;
      if (fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };
  const handleDragStart = (e: React.DragEvent, id: BlogSectionId) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragOver = (e: React.DragEvent, id: BlogSectionId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragId || dragId === id) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos: "before" | "after" = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
    setOverId(id);
    setOverPos(pos);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragId && overId && dragId !== overId && overPos) reorder(dragId, overId, overPos);
    setDragId(null); setOverId(null); setOverPos(null);
  };
  const handleDragEnd = () => { setDragId(null); setOverId(null); setOverPos(null); };

  const sectionsDirty = sections.some((s, i) => s.id !== DEFAULT_BLOG_SECTIONS[i].id || s.visible !== DEFAULT_BLOG_SECTIONS[i].visible);
  const configsDirty  = JSON.stringify(configs) !== JSON.stringify(DEFAULT_BLOG_CONFIGS);
  const isDirty = sectionsDirty || configsDirty;
  const resetAll = () => { setSections(DEFAULT_BLOG_SECTIONS); setConfigs(DEFAULT_BLOG_CONFIGS); };

  const visibleSections = sections.filter(s => s.visible);
  const computePreview = <T extends { id: string }>(arr: T[], dId: string | null, oId: string | null, pos: "before" | "after" | null): T[] => {
    if (!dId || !oId || !pos || dId === oId) return arr;
    const fromIdx = arr.findIndex(s => s.id === dId);
    let toIdx     = arr.findIndex(s => s.id === oId);
    if (fromIdx < 0 || toIdx < 0) return arr;
    if (pos === "after") toIdx += 1;
    if (fromIdx < toIdx) toIdx -= 1;
    if (fromIdx === toIdx) return arr;
    const next = [...arr];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    return next;
  };
  const previewSections = computePreview(visibleSections, dragId, overId, overPos);
  const previewSidebar  = computePreview(sections, dragId, overId, overPos);
  const visibleCount = visibleSections.length;

  const renderSection = (id: BlogSectionId) => {
    if (id === "blog_articles") return <BlogArticlesWire cfg={configs.blog_articles} view={view} />;
    return <BlogVideosWire cfg={configs.blog_videos} view={view} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      {/* Canvas */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 sm:p-5">
        <div className="pb-3 mb-4 border-b border-[#e8e8e8] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <FileText className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ตัวอย่าง Layout</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${font} text-[11px] text-gray-400 hidden sm:inline`}>ลากการ์ดเพื่อสลับลำดับ</span>
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = view === m.id;
                return (
                  <button key={m.id} onClick={() => setView(m.id)} title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div
          className="flex flex-col gap-4 bg-[#fafbfc] rounded-xl p-4 min-h-[400px] mx-auto w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ maxWidth: view === "mobile" ? 420 : view === "tablet" ? 820 : 1600 }}
        >
          {previewSections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <EyeOff className="size-8" strokeWidth={1.5} />
              <p className={`${font} text-[13px]`}>ทุก section ถูกซ่อนอยู่</p>
            </div>
          )}
          {previewSections.map((s) => {
            const Icon = blogSectionIcons[s.id];
            const isDragging = dragId === s.id;
            return (
              <div
                key={s.id}
                draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e)  => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`group relative rounded-2xl border-2 transition-all ${
                  isDragging ? "border-dashed opacity-60 bg-[#319754]/5" : "bg-white border-dashed border-gray-200 hover:border-[#319754]/40"
                }`}
                style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}
              >
                <div className="absolute -top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-3 py-1 border border-gray-200 shadow-sm pointer-events-auto cursor-grab active:cursor-grabbing">
                    <div className="size-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
                      <GripVertical className="size-3" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                    </div>
                    <Icon className="size-3 text-gray-500" strokeWidth={2.2} />
                    <span className={`${font} text-[11px] text-black`} style={{ fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button title="ตั้งค่า section นี้"
                          className="bg-white rounded-full size-7 flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#319754]/40 hover:bg-[#319754]/5 transition-all cursor-pointer">
                          <Settings className="size-3.5 text-gray-500" strokeWidth={2.2} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={8} className="w-[260px] p-3">
                        <div className="flex items-center gap-2 pb-2 mb-1 border-b border-gray-100">
                          <Icon className="size-3.5" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                          <p className={`${font} text-[13px]`} style={{ fontWeight: 600 }}>{s.label}</p>
                        </div>
                        <BlogSectionSettings id={s.id} configs={configs} setConfigs={setConfigs} />
                      </PopoverContent>
                    </Popover>
                    <button onClick={() => toggleVisible(s.id)} title="ซ่อน section นี้"
                      className="bg-white rounded-full size-7 flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#ff3b30]/40 hover:bg-[#ff3b30]/5 transition-all cursor-pointer">
                      <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>

                <div className={`p-4 pt-6 ${isDragging ? "opacity-30" : ""}`}>
                  {renderSection(s.id)}
                </div>
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`${font} flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border-2`}
                      style={{ borderColor: ADMIN_PRIMARY, color: ADMIN_PRIMARY, fontWeight: 600 }}>
                      <GripVertical className="size-3.5" strokeWidth={2.4} />
                      <span className="text-[12px]">วาง “{s.label}” ที่นี่</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sidebar */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3 h-fit lg:sticky lg:top-4">
        <div className="pb-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-2">
            <Settings className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>การแสดงผล</p>
          </div>
          <p className={`${font} text-[11px] text-gray-500 mt-1`}>เปิด/ปิด และจัดลำดับแต่ละ section</p>
          <p className={`${font} text-[11px] text-gray-400 mt-1`}>
            แสดงอยู่ <span style={{ color: ADMIN_PRIMARY, fontWeight: 600 }}>{visibleCount}</span> จาก {sections.length} section
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {previewSidebar.map((s) => {
            const Icon = blogSectionIcons[s.id];
            const isDragging = dragId === s.id;
            return (
              <div
                key={s.id}
                draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e)  => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`relative flex items-center gap-2 px-2 py-2 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                  isDragging ? "border-dashed bg-[#319754]/5" :
                  s.visible ? "border-gray-200 bg-white hover:border-[#319754]/40" :
                  "border-gray-100 bg-gray-50"
                }`}
                style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}
              >
                <GripVertical className="size-4 text-gray-400 shrink-0" strokeWidth={2.2} />
                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${s.visible ? "" : "opacity-40"}`}
                  style={{ backgroundColor: s.visible ? `${ADMIN_PRIMARY}1a` : "#f5f5f5" }}>
                  <Icon className="size-3.5" style={{ color: s.visible ? ADMIN_PRIMARY : "#999" }} strokeWidth={2.2} />
                </div>
                <span className={`${font} text-[13px] flex-1 truncate ${s.visible ? "text-black" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                  {s.label}
                </span>
                <button onClick={() => toggleVisible(s.id)} title={s.visible ? "ซ่อน" : "แสดง"}
                  className="size-7 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer shrink-0 transition-colors">
                  {s.visible ? <Eye className="size-3.5 text-gray-600" strokeWidth={2.2} /> : <EyeOff className="size-3.5 text-gray-400" strokeWidth={2.2} />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#e8e8e8] flex gap-2">
          <button onClick={resetAll} disabled={!isDirty}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border text-[12px] transition-all ${
              isDirty ? "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer" : "border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}>
            <RotateCcw className="size-3.5" strokeWidth={2.2} />
            รีเซ็ตทั้งหมด
          </button>
          <button onClick={() => { setPreviewView(view); setShowSave(true); }}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl text-white text-[12px] transition-all cursor-pointer hover:opacity-90`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Save className="size-3.5" strokeWidth={2.2} />
            บันทึก
          </button>
        </div>
      </div>

      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent className="!max-w-[95vw] !w-[1500px] max-h-[92vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-100">
            <DialogTitle className={`${font} text-[17px]`} style={{ fontWeight: 600 }}>ตัวอย่างก่อนบันทึก</DialogTitle>
            <DialogDescription className={`${font} text-[12px] text-gray-500`}>
              นี่คือภาพหน้าจริงที่ผู้ใช้จะเห็น — ถ้าตกลง กดปุ่ม “ยืนยันบันทึก”
            </DialogDescription>
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5 self-start mt-2">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = previewView === m.id;
                return (
                  <button key={m.id} onClick={() => setPreviewView(m.id)} title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-[#e9ecef] p-4">
            <div
              className="mx-auto transition-[max-width] duration-500"
              style={{ maxWidth: previewView === "mobile" ? 420 : previewView === "tablet" ? 820 : 1280 }}
            >
              <BrowserMockup url="metaherb.com/blog" view={previewView}>
                <SitePreviewFrame currentPath="/blog" view={previewView}>
                  <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
                    <h1 className={`${font} text-[20px] text-[#319754]`} style={{ fontWeight: 500 }}>สาระความรู้ทั้งหมด</h1>
                  </div>
                  <div className={`flex flex-col gap-6 py-5 ${previewView === "desktop" ? "px-12" : previewView === "tablet" ? "px-5" : "px-3"}`}>
                    {sections.filter(s => s.visible).map((s) => (
                      <div key={s.id}>
                        {s.id === "blog_articles"
                          ? <BlogArticlesPreview cfg={configs.blog_articles} view={previewView} />
                          : <BlogVideosPreview   cfg={configs.blog_videos}   view={previewView} />}
                      </div>
                    ))}
                    {sections.filter(s => s.visible).length === 0 && (
                      <div className="text-center text-gray-400 py-12">— ไม่มี section ที่จะแสดง —</div>
                    )}
                  </div>
                </SitePreviewFrame>
              </BrowserMockup>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 gap-2">
            <button onClick={() => setShowSave(false)}
              className={`${font} h-9 px-5 rounded-xl border border-gray-200 text-gray-700 text-[12px] hover:bg-gray-50 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
            <button onClick={() => { toast.success("บันทึก layout เรียบร้อย"); setShowSave(false); }}
              className={`${font} h-9 px-5 rounded-xl text-white text-[12px] cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-1.5`}
              style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
              <Save className="size-3.5" strokeWidth={2.2} />
              ยืนยันบันทึก
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ========== PAGE ABOUT BUILDER ========== */
type AboutSectionId = "about_hero" | "about_story" | "about_trust" | "about_mission" | "about_contact";
interface AboutSection { id: AboutSectionId; label: string; visible: boolean; }

const DEFAULT_ABOUT_SECTIONS: AboutSection[] = [
  { id: "about_hero",    label: "Hero (เปิดเว็บ)",    visible: true },
  { id: "about_story",   label: "เรื่องราวของเรา",     visible: true },
  { id: "about_trust",   label: "ผลิตภัณฑ์ที่เชื่อถือ", visible: true },
  { id: "about_mission", label: "พันธกิจ",              visible: true },
  { id: "about_contact", label: "ติดต่อเรา",            visible: true },
];

interface AboutConfigs {
  about_hero: {
    badge: string;
    headline1: string; headline2: string; headline3: string;
    subtitleLine1: string; subtitleLine2: string;
    ctaPrimaryText: string; ctaSecondaryText: string;
    showSecondaryCTA: boolean;
    videoUrl: string; bgImage: string;
  };
  about_story: {
    showFloatingImage: boolean;
    badge: string; title1: string; title2: string; description: string;
    mainImage: string; floatingImage: string;
    f1Title: string; f1Desc: string;
    f2Title: string; f2Desc: string;
    f3Title: string; f3Desc: string;
  };
  about_trust: {
    showProductCards: boolean; showCertifications: boolean;
    title1: string; title2: string;
    p1Tag: string; p1TagColor: string; p1Title: string; p1Desc: string;
    p2Tag: string; p2TagColor: string; p2Title: string; p2Desc: string;
    p3Tag: string; p3TagColor: string; p3Title: string; p3Desc: string;
    cert1: string; cert2: string; cert3: string; cert4: string;
  };
  about_mission: {
    overlayTopTitle: string; overlayTopSubtitle: string;
    quoteTitle: string; quoteDescription: string;
    missionImage: string;
    stat1Value: string; stat1Label: string;
    stat2Value: string; stat2Label: string;
    stat3Value: string; stat3Label: string;
    stat4Value: string; stat4Label: string;
  };
  about_contact: {
    showSocial: boolean; showForm: boolean;
    title1: string; title2: string; subtitle: string;
    leftHeading: string;
    phoneLabel: string; phone: string; phoneSub: string;
    emailLabel: string; email: string; emailSub: string;
    addressLabel: string; address: string; addressSub: string;
    socialHeading: string;
    s1Name: string; s1Handle: string;
    s2Name: string; s2Handle: string;
    s3Name: string; s3Handle: string;
    s4Name: string; s4Handle: string;
    formHeading: string; formSubheading: string; formSubmitText: string;
  };
}

const DEFAULT_ABOUT_CONFIGS: AboutConfigs = {
  about_hero: {
    badge: "ยินดีต้อนรับ",
    headline1: "จากพืชพรรณ",
    headline2: "สู่ผลิตภัณฑ์",
    headline3: "เมต้าเฮิร์บ",
    subtitleLine1: "แม้เป็นสมุนไพรที่หายากแต่เมต้าเฮิร์บ",
    subtitleLine2: "สามารถคัดสรรและจัดหาให้คุณได้",
    ctaPrimaryText: "เลือกซื้อได้ที่",
    ctaSecondaryText: "พันธกิจของเรา",
    showSecondaryCTA: true,
    videoUrl: "https://res.cloudinary.com/dujq74ght/video/upload/ท่องโลกสมุนไพร_EP._6_ตะลุยต่างแดน_ตอน__ชาซีลอน_ศรีลังกา__1_1_xvtgqw.mp4",
    bgImage: HOME_BANNER_IMAGES[0],
  },
  about_story: {
    showFloatingImage: true,
    badge: "เรื่องราวของเรา",
    title1: "ผลผลิตจากเกษตรกร",
    title2: "สู่ทุกบ้านทั่วไทย",
    description: "เราเป็นผู้นำด้านสมุนไพรคุณภาพ เพื่อสุขภาพที่ยั่งยืน",
    mainImage: SAFE_PRODUCT_IMAGES[5],
    floatingImage: SAFE_PRODUCT_IMAGES[0],
    f1Title: "ต้นกำเนิดจากธรรมชาติแท้",
    f1Desc: "สมุนไพรทุกชนิดได้รับการปลูกและดูแลโดยเกษตรกรท้องถิ่น",
    f2Title: "ภูมิปัญญาดั้งเดิมสู่นวัตกรรมใหม่",
    f2Desc: "ผสมผสานองค์ความรู้สมุนไพรไทยโบราณกว่า 200 ปี",
    f3Title: "การรับรองมาตรฐานระดับสากล",
    f3Desc: "ผ่านการตรวจสอบและรับรองจาก อย. และ ISO 22000",
  },
  about_trust: {
    showProductCards: true, showCertifications: true,
    title1: "ความไว้วางใจที่",
    title2: "สร้างมาจากมาตรฐาน",
    p1Tag: "ขายดีอันดับ 1", p1TagColor: "#ff8a65",
    p1Title: "ชาสมุนไพร 7 ชนิด",
    p1Desc:  "ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน",
    p2Tag: "สินค้าใหม่",      p2TagColor: "#7db870",
    p2Title: "ชาสมุนไพร 7 ชนิด",
    p2Desc:  "ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน",
    p3Tag: "ยอดนิยม",         p3TagColor: "#5b8dee",
    p3Title: "ชาสมุนไพร 7 ชนิด",
    p3Desc:  "ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน",
    cert1: "✓ อย. ไทย", cert2: "✓ Organic Thailand",
    cert3: "✓ ISO 22000", cert4: "✓ GMP",
  },
  about_mission: {
    overlayTopTitle: "พันธกิจและวิสัยทัศน์",
    overlayTopSubtitle: "เราทำงานเพื่ออะไร ?",
    quoteTitle: "\"เป็นผู้นำสมุนไพรไทยสู่ตลาดโลก\"",
    quoteDescription: "มุ่งมั่นที่จะเป็นผู้นำในการนำเสนอสมุนไพรไทยคุณภาพสู่ผู้บริโภค เพื่อสุขภาพที่ดีและยั่งยืน",
    missionImage: SAFE_PRODUCT_IMAGES[5],
    stat1Value: "3+",       stat1Label: "ปีแห่งประสบการณ์",
    stat2Value: "120",      stat2Label: "ไร่แปลงเกษตรอินทรีย์",
    stat3Value: "50+",      stat3Label: "ผลิตภัณฑ์สมุนไพร",
    stat4Value: "2,400+",   stat4Label: "ลูกค้าทั่วไทย",
  },
  about_contact: {
    showSocial: true, showForm: true,
    title1: "พูดคุยกับเรา",
    title2: "ได้ทุกช่องทาง",
    subtitle: "เราพร้อมให้คำปรึกษาเรื่องสมุนไพรและผลิตภัณฑ์ทุกชนิด ติดต่อเราได้ผ่านช่องทางที่คุณสะดวก",
    leftHeading: "ข้อมูลการติดต่อ",
    phoneLabel: "โทรศัพท์", phone: "098-765-4321", phoneSub: "จันทร์-ศุกร์: 08.30 - 17.30",
    emailLabel: "อีเมล", email: "hello@metaherb.co.th", emailSub: "ตอบกลับภายใน 24 ชั่วโมง",
    addressLabel: "ที่อยู่",
    address: "459/153 หมู่บ้านนิวไฮบ์ สุขสวัสดิ์",
    addressSub: "แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพฯ 10140",
    socialHeading: "ติดตามเราบนโซเชียล",
    s1Name: "Facebook",  s1Handle: "MetaherbOfficial",
    s2Name: "Line",       s2Handle: "@metaherb",
    s3Name: "YouTube",    s3Handle: "MetaherbTV",
    s4Name: "Instagram",  s4Handle: "@metaherb.th",
    formHeading: "ส่งข้อความถึงเรา",
    formSubheading: "กรอกแบบฟอร์มด้านล่าง",
    formSubmitText: "ส่งข้อความ",
  },
};

/* Editing helpers */
function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${font} text-[11px] text-gray-500`}>{label}</label>
      <input type="text" value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`${font} h-8 px-2.5 rounded-md border border-gray-200 text-[12px] focus:outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
    </div>
  );
}
function TextareaField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${font} text-[11px] text-gray-500`}>{label}</label>
      <textarea value={value} rows={2}
        onChange={(e) => onChange(e.target.value)}
        className={`${font} px-2.5 py-1.5 rounded-md border border-gray-200 text-[12px] focus:outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white resize-none transition-all`} />
    </div>
  );
}
function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${font} text-[11px] text-gray-500`}>{label}</label>
      <div className="flex gap-2 items-center">
        <div className="size-10 rounded-md bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
          {value
            ? <img src={value} alt="" className="w-full h-full object-cover" />
            : <ImageIcon className="size-4 text-gray-400" />}
        </div>
        <input type="text" value={value} placeholder="URL รูปภาพ"
          onChange={(e) => onChange(e.target.value)}
          className={`${font} flex-1 min-w-0 h-8 px-2.5 rounded-md border border-gray-200 text-[11px] focus:outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
      </div>
    </div>
  );
}
function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pt-2 border-t border-gray-100 first:border-t-0 first:pt-0">
      <p className={`${font} text-[10px] uppercase tracking-wide text-gray-400`} style={{ fontWeight: 600 }}>{title}</p>
      {children}
    </div>
  );
}

const aboutSectionIcons: Record<AboutSectionId, any> = {
  about_hero: ImageIcon, about_story: FileText, about_trust: Shield,
  about_mission: Star, about_contact: Phone,
};

function AboutHeroWire({ cfg, view }: { cfg: AboutConfigs["about_hero"]; view: ViewMode }) {
  const isMobile = view === "mobile";
  const isDesktop = view === "desktop";
  return (
    <div className={`relative rounded-xl bg-gradient-to-br from-gray-300 to-gray-200 overflow-hidden ${isMobile ? "aspect-[4/5]" : view === "tablet" ? "aspect-[16/10]" : "aspect-[1440/770]"}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,31,13,0.7)] via-[rgba(13,31,13,0.25)] to-transparent" />
      {/* Bottom-left content */}
      <div className={`absolute flex flex-col ${
        isMobile ? "bottom-6 left-4 right-4 gap-2.5" :
        isDesktop ? "bottom-16 left-12 right-12 gap-4" :
        "bottom-10 left-8 right-8 gap-3"
      }`}>
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-[#7db870]/20 border border-[#7db870]/40 rounded-full w-fit ${isMobile ? "px-3 py-1.5" : "px-4 py-2"}`}>
          <Leaf className={`text-[#a8d5a0] ${isMobile ? "size-3" : "size-4"}`} strokeWidth={2.2} />
          <div className={`bg-[#a8d5a0]/60 rounded-full ${isMobile ? "h-2 w-12" : "h-2.5 w-16"}`} />
        </div>
        {/* Heading — 3 lines, BIG */}
        <div className={`flex flex-col ${isMobile ? "gap-1.5" : isDesktop ? "gap-2.5" : "gap-2"}`}>
          <div className={`bg-white rounded-md ${isMobile ? "h-7 w-[55%]" : isDesktop ? "h-14 w-[60%]" : "h-10 w-[60%]"}`} />
          <div className={`bg-[#a8d5a0] rounded-md ${isMobile ? "h-7 w-[65%]" : isDesktop ? "h-14 w-[70%]" : "h-10 w-[70%]"}`} />
          <div className={`bg-white rounded-md ${isMobile ? "h-7 w-[45%]" : isDesktop ? "h-14 w-[50%]" : "h-10 w-[50%]"}`} />
        </div>
        {/* Subtitle 2 lines */}
        <div className="flex flex-col gap-1.5">
          <div className={`bg-white/70 rounded-full ${isMobile ? "h-2.5 w-[60%]" : "h-3 w-[45%]"}`} />
          <div className={`bg-white/70 rounded-full ${isMobile ? "h-2.5 w-[50%]" : "h-3 w-[35%]"}`} />
        </div>
        {/* CTA buttons — LARGE */}
        <div className="flex flex-wrap gap-3 items-center mt-2">
          <div className={`bg-[#7db870] inline-flex items-center justify-center gap-2 rounded-full ${isMobile ? "h-10 px-6" : isDesktop ? "h-14 px-12" : "h-12 px-9"}`}>
            <div className={`bg-white/80 rounded-full ${isMobile ? "h-2 w-14" : "h-2.5 w-20"}`} />
            <div className={`bg-white/80 rounded-full ${isMobile ? "size-3" : "size-4"}`} />
          </div>
          {cfg.showSecondaryCTA && (
            <div className={`bg-white/15 inline-flex items-center justify-center rounded-full backdrop-blur-sm ${isMobile ? "h-10 px-5" : isDesktop ? "h-14 px-7" : "h-12 px-6"}`}>
              <div className={`bg-white/70 rounded-full ${isMobile ? "h-2 w-16" : "h-2.5 w-20"}`} />
            </div>
          )}
        </div>
      </div>
      {/* Wave bottom */}
      <svg viewBox="0 0 1440 56" className="absolute bottom-0 left-0 right-0 w-full" preserveAspectRatio="none" style={{ height: isDesktop ? "32px" : "20px" }}>
        <path d="M0 55.125C491.333 -18.375 971 -18.375 1440 55.125H0Z" fill="#f5f0e8" />
      </svg>
    </div>
  );
}

function AboutStoryWire({ cfg, view }: { cfg: AboutConfigs["about_story"]; view: ViewMode }) {
  const stacked = view === "mobile" || view === "tablet";
  return (
    <div className="rounded-xl bg-[#f5f0e8]/60 p-6">
      <div className="text-center mb-6 flex flex-col items-center gap-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#319754]/15"><SkelLine w="50px" /></div>
        <div className="h-5 bg-gray-300 rounded-full w-48 mx-auto" />
        <SkelLine w="60%" />
      </div>
      <div className={`flex ${stacked ? "flex-col" : "flex-row"} gap-6`}>
        <div className="relative w-full lg:w-[55%]">
          <div className="aspect-[3/2] bg-gray-200 rounded-2xl flex items-center justify-center">
            <ImageIcon className="size-8 text-gray-400" />
          </div>
          {cfg.showFloatingImage && !stacked && (
            <div className="absolute -bottom-4 right-4 size-24 rounded-3xl bg-gray-300 border-4 border-[#f5f0e8]" />
          )}
        </div>
        <div className="flex-1 flex flex-col gap-3">
          {[0,1,2].map(i => (
            <div key={i} className="flex gap-3">
              <div className="size-10 rounded-full bg-gray-200 shrink-0" />
              <div className="flex-1 flex flex-col gap-1">
                <SkelLine w="70%" /><SkelLine w="90%" /><SkelLine w="60%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutTrustWire({ cfg, view }: { cfg: AboutConfigs["about_trust"]; view: ViewMode }) {
  const isMobile = view === "mobile";
  const isDesktop = view === "desktop";
  const stacked = view !== "desktop";
  const tagColors = [cfg.p1TagColor, cfg.p2TagColor, cfg.p3TagColor];

  // Scale tokens per view (bigger images, narrower right content on desktop)
  const stackSize  = isDesktop ? 460 : view === "tablet" ? 300 : 260;
  const stackH     = isDesktop ? 500 : view === "tablet" ? 350 : 320;

  return (
    <div className={`relative rounded-xl bg-[#1a2e1a] overflow-hidden ${isDesktop ? "p-10 lg:p-12" : isMobile ? "p-5" : "p-8"}`}>
      {/* Decorative circles */}
      <div className={`absolute rounded-full bg-[rgba(125,184,112,0.1)] ${isDesktop ? "right-[60px] top-[-80px] size-[200px]" : "right-[-30px] top-[-50px] size-32"}`} />
      <div className={`absolute rounded-full bg-[rgba(125,184,112,0.1)] ${isDesktop ? "left-[-60px] bottom-[-40px] size-[160px]" : "left-[-30px] bottom-[-30px] size-24"}`} />

      <div className={`relative flex ${stacked ? "flex-col" : "flex-row"} ${isDesktop ? "gap-10" : "gap-6"} items-center`}>
        {/* Left — stacked rotated product images, vertically centered */}
        <div className="relative shrink-0 flex items-center justify-center" style={{ width: stacked ? "100%" : `${stackSize + 90}px`, height: stackH }}>
          <div className="relative" style={{ width: stackSize + 60, height: stackSize + 20 }}>
            <div className="absolute left-[50px] top-0 aspect-square rounded-[40px] bg-gray-400/60 border border-white/30 shadow-md" style={{ width: stackSize - 40, transform: "rotate(13deg)" }} />
            <div className="absolute left-[25px] top-[10px] aspect-square rounded-[40px] bg-gray-300 border border-white/50 shadow-lg" style={{ width: stackSize - 25, transform: "rotate(7deg)" }} />
            <div className="absolute left-0 top-[20px] aspect-square rounded-[40px] bg-gradient-to-br from-gray-200 to-gray-400 border-2 border-white shadow-2xl overflow-hidden" style={{ width: stackSize }}>
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.8)] via-transparent to-transparent" />
              <div className={`absolute left-4 right-4 flex flex-col gap-1.5 ${isDesktop ? "bottom-10" : "bottom-6"}`}>
                <div className={`bg-white/50 rounded-full ${isDesktop ? "h-2 w-1/2" : "h-1 w-1/2"}`} />
                <div className={`bg-white rounded-full ${isDesktop ? "h-4 w-3/4" : "h-2 w-3/4"}`} />
                <div className={`bg-[#a8d5a0] rounded-full ${isDesktop ? "h-2.5 w-2/3" : "h-1.5 w-2/3"}`} />
              </div>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                <div className={`rounded-full bg-white ${isDesktop ? "h-2 w-6" : "h-1 w-4"}`} />
                <div className={`rounded-full bg-white/40 ${isDesktop ? "size-2" : "size-1"}`} />
                <div className={`rounded-full bg-white/40 ${isDesktop ? "size-2" : "size-1"}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Right — heading + cards + certs (NARROWER on desktop) */}
        <div className={`min-w-0 flex flex-col ${isDesktop ? "gap-5 w-[360px] shrink-0" : "flex-1 gap-4"}`}>
          <div className={`flex flex-col ${isDesktop ? "gap-2.5" : "gap-1.5"}`}>
            <div className={`bg-white rounded-md ${isDesktop ? "h-9 w-[55%]" : isMobile ? "h-5 w-[55%]" : "h-7 w-[55%]"}`} />
            <div className={`bg-[#7db870] rounded-md ${isDesktop ? "h-9 w-[80%]" : isMobile ? "h-5 w-[80%]" : "h-7 w-[80%]"}`} />
          </div>
          {cfg.showProductCards && (
            <div className={`grid grid-cols-2 ${isDesktop ? "gap-4" : "gap-2.5"}`}>
              {[0,1,2].map(i => (
                <div key={i} className={`bg-white/5 border border-white/10 rounded-2xl shadow-md flex flex-col ${isDesktop ? "p-4 gap-2" : "p-3 gap-1.5"}`}>
                  <div className={`rounded-full inline-flex items-center px-3 self-start ${isDesktop ? "h-5" : "h-4"}`} style={{ backgroundColor: tagColors[i] }}>
                    <div className={`bg-white/85 rounded-full ${isDesktop ? "h-1.5 w-14" : "h-1 w-10"}`} />
                  </div>
                  <div className={`bg-white/60 rounded-full ${isDesktop ? "h-3 w-3/4" : "h-2 w-3/4"}`} />
                  <div className={`bg-white/25 rounded-full ${isDesktop ? "h-2 w-full" : "h-1.5 w-full"}`} />
                  <div className={`bg-white/25 rounded-full ${isDesktop ? "h-2 w-2/3" : "h-1.5 w-2/3"}`} />
                </div>
              ))}
            </div>
          )}
          {cfg.showCertifications && (
            <div className={`flex flex-wrap ${isDesktop ? "gap-2" : "gap-1.5"}`}>
              {[0,1,2,3].map(i => (
                <div key={i} className={`bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] rounded-full flex items-center ${isDesktop ? "px-4 py-1.5" : "px-3 py-1"}`}>
                  <div className={`bg-[#a8d5a0]/80 rounded-full ${isDesktop ? "h-2 w-16" : "h-1.5 w-12"}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AboutMissionWire({ view }: { cfg: AboutConfigs["about_mission"]; view: ViewMode }) {
  const isDesktop = view === "desktop";
  const isMobile  = view === "mobile";
  const stacked   = view !== "desktop";
  return (
    <div className={`rounded-xl bg-white ${isDesktop ? "p-8" : isMobile ? "p-4" : "p-6"}`}>
      <div className={`flex ${stacked ? "flex-col gap-4" : "flex-row gap-6"} ${stacked ? "items-stretch" : "items-stretch"}`}>
        {/* Left — big image with overlay (takes more width on desktop) */}
        <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-300 to-gray-500 ${
          isDesktop ? "flex-[2.2] h-[320px]" : isMobile ? "h-[200px]" : "h-[240px]"
        }`}>
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.85)] via-[rgba(13,31,13,0.2)] to-transparent" />
          {/* Overlay top text */}
          <div className={`absolute ${isDesktop ? "top-5 left-5" : "top-3 left-3"} flex flex-col gap-1`}>
            <div className={`bg-white rounded-md ${isDesktop ? "h-6 w-56" : isMobile ? "h-3 w-32" : "h-4 w-40"}`} />
            <div className={`bg-white/70 rounded-md ${isDesktop ? "h-6 w-48" : isMobile ? "h-3 w-28" : "h-4 w-36"}`} />
          </div>
          {/* Overlay bottom text */}
          <div className={`absolute ${isDesktop ? "bottom-5 left-5 right-5" : "bottom-3 left-3 right-3"} flex flex-col gap-1.5`}>
            <div className={`bg-white rounded-md ${isDesktop ? "h-5 w-[80%]" : isMobile ? "h-3 w-[70%]" : "h-4 w-[75%]"}`} />
            <div className={`bg-white/60 rounded-full ${isDesktop ? "h-2.5 w-[90%]" : "h-2 w-[85%]"}`} />
            <div className={`bg-white/60 rounded-full ${isDesktop ? "h-2.5 w-[70%]" : "h-2 w-[65%]"}`} />
          </div>
        </div>

        {/* Right — stats cards (narrower, vertical on desktop) */}
        <div className={`${isDesktop ? "flex-1 flex flex-col gap-3" : "flex flex-row flex-wrap gap-3 justify-center"}`}>
          {[0,1,2,3].map(i => (
            <div key={i} className={`bg-[#f5f0e8] border border-[#e0d5c5] rounded-2xl flex flex-col gap-1 ${
              isDesktop ? "p-4 flex-1" : isMobile ? "p-3 flex-1 min-w-[42%]" : "p-3 flex-1 min-w-[140px]"
            }`}>
              <div className={`bg-gray-700 rounded-md ${isDesktop ? "h-6 w-12" : "h-4 w-10"}`} />
              <div className={`bg-[#4a6741]/70 rounded-full ${isDesktop ? "h-2.5 w-3/4" : "h-2 w-3/4"}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AboutContactWire({ cfg, view }: { cfg: AboutConfigs["about_contact"]; view: ViewMode }) {
  const isDesktop = view === "desktop";
  const stacked = view !== "desktop";
  return (
    <div className={`rounded-xl bg-[#f5f0e8]/60 ${isDesktop ? "p-8" : "p-5"}`}>
      {/* Heading center */}
      <div className="text-center mb-6 flex flex-col items-center gap-1.5">
        <div className={`bg-[#1a2e1a]/70 rounded-md ${isDesktop ? "h-5 w-44" : "h-4 w-36"}`} />
        <div className={`bg-[#7db870]/70 rounded-md ${isDesktop ? "h-5 w-40" : "h-4 w-32"}`} />
        <SkelLine w="50%" />
      </div>

      <div className={`flex ${stacked ? "flex-col" : "flex-row"} gap-5`}>
        {/* Left — Contact info + Social */}
        <div className="flex-1 flex flex-col gap-3">
          <div className={`bg-gray-700 rounded-md ${isDesktop ? "h-3 w-32" : "h-2.5 w-28"}`} />
          {/* Contact cards with sub */}
          {[0,1,2].map(i => (
            <div key={i} className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-[#e0d5c5] shadow-sm">
              <div className="size-9 rounded-xl bg-[#e8f5e2] shrink-0" />
              <div className="flex-1 flex flex-col gap-1">
                <SkelLine w="30%" />
                <div className="h-2.5 bg-gray-700 rounded-full w-[70%]" />
                <SkelLine w="80%" />
              </div>
            </div>
          ))}
          {cfg.showSocial && (
            <>
              <div className={`bg-gray-700 rounded-md mt-2 ${isDesktop ? "h-3 w-36" : "h-2.5 w-32"}`} />
              <div className="grid grid-cols-2 gap-2">
                {[0,1,2,3].map(i => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-[#e0d5c5]">
                    <div className="size-8 rounded-lg bg-[#e7cfbc] shrink-0" />
                    <div className="flex-1 flex flex-col gap-0.5">
                      <SkelLine w="60%" />
                      <SkelLine w="80%" />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right — Form */}
        {cfg.showForm && (
          <div className="flex-1 bg-white rounded-2xl border border-[#e0d5c5] shadow-sm p-4 flex flex-col gap-3">
            <div className={`bg-gray-700 rounded-md ${isDesktop ? "h-3.5 w-36" : "h-3 w-32"}`} />
            <SkelLine w="40%" />
            <div className="flex gap-2">
              <div className="flex-1 flex flex-col gap-1">
                <SkelLine w="40%" />
                <div className="h-9 bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl" />
              </div>
              <div className="flex-1 flex flex-col gap-1">
                <SkelLine w="40%" />
                <div className="h-9 bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <SkelLine w="30%" />
              <div className="h-9 bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl" />
            </div>
            <div className="flex flex-col gap-1">
              <SkelLine w="30%" />
              <div className="h-20 bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl" />
            </div>
            <div className={`bg-[#319754] rounded-xl flex items-center justify-center gap-2 ${isDesktop ? "h-10" : "h-9"}`}>
              <Send className={`text-white ${isDesktop ? "size-4" : "size-3.5"}`} />
              <div className={`bg-white/80 rounded-full ${isDesktop ? "h-2.5 w-20" : "h-2 w-16"}`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AboutSectionSettings({ id, configs, setConfigs }: {
  id: AboutSectionId;
  configs: AboutConfigs;
  setConfigs: React.Dispatch<React.SetStateAction<AboutConfigs>>;
}) {
  const upd = <K extends AboutSectionId>(key: K, patch: Partial<AboutConfigs[K]>) =>
    setConfigs(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  if (id === "about_hero") {
    const c = configs.about_hero;
    return (
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        <FieldGroup title="Badge ด้านบน">
          <TextField label="ข้อความ Badge" value={c.badge} onChange={(v) => upd("about_hero", { badge: v })} />
        </FieldGroup>
        <FieldGroup title="หัวข้อ 3 บรรทัด">
          <TextField label="บรรทัด 1 (สีขาว)" value={c.headline1} onChange={(v) => upd("about_hero", { headline1: v })} />
          <TextField label="บรรทัด 2 (สีเขียวอ่อน)" value={c.headline2} onChange={(v) => upd("about_hero", { headline2: v })} />
          <TextField label="บรรทัด 3 (สีขาว)" value={c.headline3} onChange={(v) => upd("about_hero", { headline3: v })} />
        </FieldGroup>
        <FieldGroup title="คำบรรยาย">
          <TextField label="บรรทัด 1" value={c.subtitleLine1} onChange={(v) => upd("about_hero", { subtitleLine1: v })} />
          <TextField label="บรรทัด 2" value={c.subtitleLine2} onChange={(v) => upd("about_hero", { subtitleLine2: v })} />
        </FieldGroup>
        <FieldGroup title="ปุ่ม CTA">
          <TextField label="ปุ่มหลัก (เขียว)" value={c.ctaPrimaryText} onChange={(v) => upd("about_hero", { ctaPrimaryText: v })} />
          <ConfigRow label="แสดงปุ่มรอง"><ToggleSwitch checked={c.showSecondaryCTA} onChange={(v) => upd("about_hero", { showSecondaryCTA: v })} /></ConfigRow>
          {c.showSecondaryCTA && <TextField label="ปุ่มรอง (Outline)" value={c.ctaSecondaryText} onChange={(v) => upd("about_hero", { ctaSecondaryText: v })} />}
        </FieldGroup>
        <FieldGroup title="พื้นหลัง">
          <TextField label="URL วิดีโอ (.mp4)" value={c.videoUrl} onChange={(v) => upd("about_hero", { videoUrl: v })} placeholder="https://.../video.mp4" />
          <ImageField label="รูป fallback (ใช้เมื่อไม่มีวิดีโอ)" value={c.bgImage} onChange={(v) => upd("about_hero", { bgImage: v })} />
        </FieldGroup>
      </div>
    );
  }
  if (id === "about_story") {
    const c = configs.about_story;
    return (
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        <FieldGroup title="การแสดงผล">
          <ConfigRow label="แสดงภาพซ้อน"><ToggleSwitch checked={c.showFloatingImage} onChange={(v) => upd("about_story", { showFloatingImage: v })} /></ConfigRow>
        </FieldGroup>
        <FieldGroup title="ข้อความหลัก">
          <TextField label="Badge ด้านบน" value={c.badge} onChange={(v) => upd("about_story", { badge: v })} />
          <TextField label="หัวข้อบรรทัด 1" value={c.title1} onChange={(v) => upd("about_story", { title1: v })} />
          <TextField label="หัวข้อบรรทัด 2 (italic)" value={c.title2} onChange={(v) => upd("about_story", { title2: v })} />
          <TextareaField label="คำบรรยาย" value={c.description} onChange={(v) => upd("about_story", { description: v })} />
        </FieldGroup>
        <FieldGroup title="ภาพประกอบ">
          <ImageField label="ภาพหลัก" value={c.mainImage} onChange={(v) => upd("about_story", { mainImage: v })} />
          {c.showFloatingImage && <ImageField label="ภาพซ้อน" value={c.floatingImage} onChange={(v) => upd("about_story", { floatingImage: v })} />}
        </FieldGroup>
        <FieldGroup title="คุณสมบัติ 1">
          <TextField label="หัวข้อ" value={c.f1Title} onChange={(v) => upd("about_story", { f1Title: v })} />
          <TextareaField label="คำอธิบาย" value={c.f1Desc} onChange={(v) => upd("about_story", { f1Desc: v })} />
        </FieldGroup>
        <FieldGroup title="คุณสมบัติ 2">
          <TextField label="หัวข้อ" value={c.f2Title} onChange={(v) => upd("about_story", { f2Title: v })} />
          <TextareaField label="คำอธิบาย" value={c.f2Desc} onChange={(v) => upd("about_story", { f2Desc: v })} />
        </FieldGroup>
        <FieldGroup title="คุณสมบัติ 3">
          <TextField label="หัวข้อ" value={c.f3Title} onChange={(v) => upd("about_story", { f3Title: v })} />
          <TextareaField label="คำอธิบาย" value={c.f3Desc} onChange={(v) => upd("about_story", { f3Desc: v })} />
        </FieldGroup>
      </div>
    );
  }
  if (id === "about_trust") {
    const c = configs.about_trust;
    return (
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        <FieldGroup title="การแสดงผล">
          <ConfigRow label="แสดงการ์ดสินค้า"><ToggleSwitch checked={c.showProductCards} onChange={(v) => upd("about_trust", { showProductCards: v })} /></ConfigRow>
          <ConfigRow label="แสดง Certifications"><ToggleSwitch checked={c.showCertifications} onChange={(v) => upd("about_trust", { showCertifications: v })} /></ConfigRow>
        </FieldGroup>
        <FieldGroup title="หัวข้อ 2 บรรทัด">
          <TextField label="บรรทัด 1 (สีขาว)" value={c.title1} onChange={(v) => upd("about_trust", { title1: v })} />
          <TextField label="บรรทัด 2 (สีเขียวอ่อน)" value={c.title2} onChange={(v) => upd("about_trust", { title2: v })} />
        </FieldGroup>
        {c.showProductCards && (
          <FieldGroup title="การ์ดสินค้า">
            <div className="bg-[#f0f9ff] border border-[#7dd3fc]/40 rounded-lg p-2.5 flex items-start gap-2">
              <Info className="size-3.5 text-[#0284c7] shrink-0 mt-0.5" strokeWidth={2.2} />
              <p className={`${font} text-[11px] text-[#0c4a6e] leading-relaxed`}>
                การ์ด <span style={{ fontWeight: 600 }}>สินค้าขายดี / สินค้าใหม่ / ยอดนิยม</span> จะดึงข้อมูลจากระบบสินค้าจริง — ไม่ต้องกรอกที่นี่
              </p>
            </div>
          </FieldGroup>
        )}
        {c.showCertifications && (
          <FieldGroup title="Certifications">
            <TextField label="ใบรับรอง 1" value={c.cert1} onChange={(v) => upd("about_trust", { cert1: v })} />
            <TextField label="ใบรับรอง 2" value={c.cert2} onChange={(v) => upd("about_trust", { cert2: v })} />
            <TextField label="ใบรับรอง 3" value={c.cert3} onChange={(v) => upd("about_trust", { cert3: v })} />
            <TextField label="ใบรับรอง 4" value={c.cert4} onChange={(v) => upd("about_trust", { cert4: v })} />
          </FieldGroup>
        )}
      </div>
    );
  }
  if (id === "about_mission") {
    const c = configs.about_mission;
    return (
      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
        <FieldGroup title="ข้อความบนรูป (Top)">
          <TextField label="หัวข้อหลัก (สีขาว)" value={c.overlayTopTitle} onChange={(v) => upd("about_mission", { overlayTopTitle: v })} />
          <TextField label="หัวข้อรอง (สีจาง)" value={c.overlayTopSubtitle} onChange={(v) => upd("about_mission", { overlayTopSubtitle: v })} />
        </FieldGroup>
        <FieldGroup title="Quote บนรูป (Bottom)">
          <TextareaField label="ข้อความ Quote" value={c.quoteTitle} onChange={(v) => upd("about_mission", { quoteTitle: v })} />
          <TextareaField label="คำอธิบายใต้ Quote" value={c.quoteDescription} onChange={(v) => upd("about_mission", { quoteDescription: v })} />
        </FieldGroup>
        <FieldGroup title="ภาพประกอบ">
          <ImageField label="ภาพหลัก Mission" value={c.missionImage} onChange={(v) => upd("about_mission", { missionImage: v })} />
        </FieldGroup>
        <FieldGroup title="Stats 4 รายการ">
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ค่า 1" value={c.stat1Value} onChange={(v) => upd("about_mission", { stat1Value: v })} /><TextField label="ป้าย 1" value={c.stat1Label} onChange={(v) => upd("about_mission", { stat1Label: v })} /></div>
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ค่า 2" value={c.stat2Value} onChange={(v) => upd("about_mission", { stat2Value: v })} /><TextField label="ป้าย 2" value={c.stat2Label} onChange={(v) => upd("about_mission", { stat2Label: v })} /></div>
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ค่า 3" value={c.stat3Value} onChange={(v) => upd("about_mission", { stat3Value: v })} /><TextField label="ป้าย 3" value={c.stat3Label} onChange={(v) => upd("about_mission", { stat3Label: v })} /></div>
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ค่า 4" value={c.stat4Value} onChange={(v) => upd("about_mission", { stat4Value: v })} /><TextField label="ป้าย 4" value={c.stat4Label} onChange={(v) => upd("about_mission", { stat4Label: v })} /></div>
        </FieldGroup>
      </div>
    );
  }
  const c = configs.about_contact;
  return (
    <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
      <FieldGroup title="การแสดงผล">
        <ConfigRow label="แสดง Social Media"><ToggleSwitch checked={c.showSocial} onChange={(v) => upd("about_contact", { showSocial: v })} /></ConfigRow>
        <ConfigRow label="แสดงฟอร์มติดต่อ"><ToggleSwitch checked={c.showForm} onChange={(v) => upd("about_contact", { showForm: v })} /></ConfigRow>
      </FieldGroup>
      <FieldGroup title="หัวข้อ">
        <TextField label="บรรทัด 1 (สีเข้ม)" value={c.title1} onChange={(v) => upd("about_contact", { title1: v })} />
        <TextField label="บรรทัด 2 (สีเขียวอ่อน)" value={c.title2} onChange={(v) => upd("about_contact", { title2: v })} />
        <TextareaField label="คำบรรยาย" value={c.subtitle} onChange={(v) => upd("about_contact", { subtitle: v })} />
      </FieldGroup>
      <FieldGroup title="ข้อมูลติดต่อ (ฝั่งซ้าย)">
        <TextField label="หัวข้อกลุ่ม" value={c.leftHeading} onChange={(v) => upd("about_contact", { leftHeading: v })} />
        <TextField label="เบอร์โทรศัพท์" value={c.phone} onChange={(v) => upd("about_contact", { phone: v })} />
        <TextField label="ข้อความใต้เบอร์" value={c.phoneSub} onChange={(v) => upd("about_contact", { phoneSub: v })} />
        <TextField label="อีเมล" value={c.email} onChange={(v) => upd("about_contact", { email: v })} />
        <TextField label="ข้อความใต้อีเมล" value={c.emailSub} onChange={(v) => upd("about_contact", { emailSub: v })} />
        <TextareaField label="ที่อยู่ (บรรทัดหลัก)" value={c.address} onChange={(v) => upd("about_contact", { address: v })} />
        <TextareaField label="ที่อยู่ (บรรทัดเสริม)" value={c.addressSub} onChange={(v) => upd("about_contact", { addressSub: v })} />
      </FieldGroup>
      {c.showSocial && (
        <FieldGroup title="ติดตามเราบนโซเชียล">
          <TextField label="หัวข้อกลุ่ม Social" value={c.socialHeading} onChange={(v) => upd("about_contact", { socialHeading: v })} />
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ชื่อ 1" value={c.s1Name} onChange={(v) => upd("about_contact", { s1Name: v })} /><TextField label="Handle 1" value={c.s1Handle} onChange={(v) => upd("about_contact", { s1Handle: v })} /></div>
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ชื่อ 2" value={c.s2Name} onChange={(v) => upd("about_contact", { s2Name: v })} /><TextField label="Handle 2" value={c.s2Handle} onChange={(v) => upd("about_contact", { s2Handle: v })} /></div>
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ชื่อ 3" value={c.s3Name} onChange={(v) => upd("about_contact", { s3Name: v })} /><TextField label="Handle 3" value={c.s3Handle} onChange={(v) => upd("about_contact", { s3Handle: v })} /></div>
          <div className="grid grid-cols-[1fr_2fr] gap-2"><TextField label="ชื่อ 4" value={c.s4Name} onChange={(v) => upd("about_contact", { s4Name: v })} /><TextField label="Handle 4" value={c.s4Handle} onChange={(v) => upd("about_contact", { s4Handle: v })} /></div>
        </FieldGroup>
      )}
      {c.showForm && (
        <FieldGroup title="ฟอร์ม (ฝั่งขวา)">
          <TextField label="หัวข้อฟอร์ม" value={c.formHeading} onChange={(v) => upd("about_contact", { formHeading: v })} />
          <TextField label="ข้อความรอง" value={c.formSubheading} onChange={(v) => upd("about_contact", { formSubheading: v })} />
          <TextField label="ข้อความปุ่มส่ง" value={c.formSubmitText} onChange={(v) => upd("about_contact", { formSubmitText: v })} />
        </FieldGroup>
      )}
    </div>
  );
}

function AboutFullPreview({ sections, configs, view }: { sections: AboutSection[]; configs: AboutConfigs; view: ViewMode }) {
  const px = view === "desktop" ? "px-[60px]" : view === "tablet" ? "px-6" : "px-4";
  const visible = sections.filter(s => s.visible);
  return (
    <div>
      {visible.map((s) => {
        if (s.id === "about_hero") {
          const c = configs.about_hero;
          return (
            <section key={s.id} className={`relative overflow-hidden ${view === "mobile" ? "h-[500px]" : view === "tablet" ? "h-[600px]" : "h-[770px]"}`}>
              {/* Background — video if available, fallback to image */}
              <div className="absolute inset-0">
                {c.videoUrl ? (
                  <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src={c.videoUrl} type="video/mp4" />
                  </video>
                ) : (
                  <img src={c.bgImage || HOME_BANNER_IMAGES[0]} alt="" className="w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(13,31,13,0.85)] via-[rgba(13,31,13,0.3)] to-transparent" />
              </div>

              {/* Content — bottom-left aligned */}
              <div className={`relative z-10 max-w-[1440px] mx-auto flex flex-col gap-6 justify-end h-full pb-20 ${view === "desktop" ? "pl-[69px] pr-8" : "px-6 sm:px-8"}`}>
                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] rounded-full px-4 py-2 w-fit">
                  <Leaf className="size-3.5 text-[#a8d5a0]" />
                  <span className="text-[#a8d5a0] text-[12px] tracking-wider uppercase">{c.badge}</span>
                </div>
                {/* Heading 3 lines */}
                <h1 className={`${font} ${view === "mobile" ? "text-[40px]" : view === "tablet" ? "text-[56px]" : "text-[80px] leading-[88px]"} leading-[1.1]`} style={{ fontWeight: 700 }}>
                  <span className="block text-white">{c.headline1}</span>
                  <span className="block text-[#a8d5a0]">{c.headline2}</span>
                  <span className="block text-white">{c.headline3}</span>
                </h1>
                {/* Subtitle */}
                <p className={`${font} ${view === "mobile" ? "text-[16px]" : "text-[20px]"} text-white/80 max-w-[500px]`}>
                  {c.subtitleLine1}<br />
                  {c.subtitleLine2}
                </p>
                {/* CTA buttons */}
                <div className="flex flex-wrap gap-4 items-center">
                  <button className={`${font} bg-[#7db870] text-white px-8 sm:px-16 py-3 sm:py-6 rounded-full ${view === "mobile" ? "text-[16px]" : "text-[20px]"} cursor-pointer flex items-center gap-4`}>
                    {c.ctaPrimaryText} <ArrowRight className="size-5 sm:size-6" />
                  </button>
                  {c.showSecondaryCTA && (
                    <button className={`${font} bg-white/10 text-white px-6 sm:px-7 py-3 sm:py-6 rounded-full ${view === "mobile" ? "text-[14px]" : "text-[16px]"} cursor-pointer`}>
                      {c.ctaSecondaryText}
                    </button>
                  )}
                </div>
              </div>

              {/* Bottom wave divider */}
              <div className="absolute bottom-0 left-0 right-0 z-[5]">
                <div className="relative">
                  <svg viewBox="0 0 1440 56" fill="none" className="w-full block relative z-[1]" preserveAspectRatio="none" style={{ height: "56px" }}>
                    <path d="M0 55.125C491.333 -18.375 971 -18.375 1440 55.125H0Z" fill="#f5f0e8" />
                  </svg>
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#f5f0e8] z-[2]" />
                </div>
                <div className="absolute top-[30%] left-1/2 -translate-x-1/2 z-[3]">
                  <span className={`${font} text-[#319754] text-[12px] tracking-wider uppercase whitespace-nowrap`}>เลื่อนเพื่อดูเนื้อหา</span>
                </div>
              </div>
            </section>
          );
        }
        if (s.id === "about_story") {
          const c = configs.about_story;
          const stacked = view === "mobile" || view === "tablet";
          return (
            <section key={s.id} className="bg-[#f5f0e8] py-12 sm:py-16">
              <div className={`max-w-[1280px] mx-auto ${px}`}>
                <div className="text-center mb-8 sm:mb-12">
                  <div className="inline-flex items-center gap-2 bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] rounded-full px-4 py-2 mb-3">
                    <Leaf className="size-3.5 text-[#319754]" />
                    <span className={`${font} text-[#319754] text-[11px] tracking-wider uppercase`}>{c.badge}</span>
                  </div>
                  <h2 className={`${font} text-[26px] sm:text-[36px] text-[#4e4e4e]`} style={{ fontWeight: 600 }}>{c.title1}</h2>
                  <h2 className="text-[26px] sm:text-[36px] italic text-[#4e4e4e]" style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{c.title2}</h2>
                  <p className={`${font} text-[14px] text-[#333] mt-3 max-w-[614px] mx-auto leading-7`}>{c.description}</p>
                </div>
                <div className={`flex ${stacked ? "flex-col" : "flex-row"} gap-8 lg:gap-12 items-center`}>
                  <div className="w-full lg:w-[55%] relative">
                    <div className="rounded-3xl overflow-hidden shadow-xl h-[260px] sm:h-[340px] relative">
                      <img src={c.mainImage || SAFE_PRODUCT_IMAGES[5]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.4)] to-transparent" />
                    </div>
                    {c.showFloatingImage && !stacked && (
                      <div className="absolute -bottom-4 right-[-12px] size-32 rounded-3xl overflow-hidden border-4 border-[#f5f0e8] shadow-xl">
                        <img src={c.floatingImage || SAFE_PRODUCT_IMAGES[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-5">
                    {[
                      { title: c.f1Title, desc: c.f1Desc },
                      { title: c.f2Title, desc: c.f2Desc },
                      { title: c.f3Title, desc: c.f3Desc },
                    ].map((item, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="size-11 bg-[#e7cfbc] rounded-full flex items-center justify-center shrink-0">
                          <Leaf className="size-5 text-[#9D5400]" />
                        </div>
                        <div>
                          <h3 className={`${font} text-[16px] text-[#333]`} style={{ fontWeight: 600 }}>{item.title}</h3>
                          <p className={`${font} text-[13px] text-[#4a6741] leading-6 mt-0.5`}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }
        if (s.id === "about_trust") {
          const c = configs.about_trust;
          const stacked = view === "mobile" || view === "tablet";
          const productCards = [
            { tag: c.p1Tag, tagColor: c.p1TagColor, title: c.p1Title, desc: c.p1Desc },
            { tag: c.p2Tag, tagColor: c.p2TagColor, title: c.p2Title, desc: c.p2Desc },
            { tag: c.p3Tag, tagColor: c.p3TagColor, title: c.p3Title, desc: c.p3Desc },
          ];
          return (
            <section key={s.id} className="bg-[#1a2e1a] py-12 sm:py-16 lg:py-20 text-white overflow-hidden relative">
              {/* Decorative circles */}
              <div className="absolute right-[140px] top-[-96px] size-[256px] rounded-full bg-[rgba(125,184,112,0.1)]" />
              <div className="absolute left-[-64px] bottom-[-40px] size-[192px] rounded-full bg-[rgba(125,184,112,0.1)]" />

              <div className={`max-w-[1280px] mx-auto relative ${px}`}>
                <div className={`flex ${stacked ? "flex-col" : "flex-row"} gap-8 lg:gap-12 items-center`}>
                  {/* Left — product images stacked & rotated */}
                  <div className={`relative shrink-0 ${stacked ? "w-full h-[300px]" : "w-1/2 h-[400px] lg:h-[480px]"}`}>
                    <div className="absolute left-[40px] sm:left-[60px] top-0 sm:top-[-20px] w-[200px] sm:w-[300px] lg:w-[420px] aspect-square rounded-[40px] overflow-hidden border border-white shadow-lg z-0" style={{ transform: "rotate(13deg)" }}>
                      <img src={SAFE_PRODUCT_IMAGES[3]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute left-[20px] sm:left-[30px] top-[10px] sm:top-[-10px] w-[210px] sm:w-[310px] lg:w-[430px] aspect-square rounded-[40px] overflow-hidden border border-white shadow-lg z-[1]" style={{ transform: "rotate(7deg)" }}>
                      <img src={SAFE_PRODUCT_IMAGES[5]} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute left-0 top-[20px] sm:top-[10px] w-[220px] sm:w-[320px] lg:w-[440px] aspect-square rounded-[40px] overflow-hidden border border-white shadow-[0px_0px_4px_rgba(0,0,0,0.25)] z-10">
                      <img src={SAFE_PRODUCT_IMAGES[7]} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.8)] via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-6 right-6">
                        <p className="text-white/80 text-[12px]">ผลิตภัณฑ์เด่นของเรา</p>
                        <p className={`${font} text-white text-[16px] sm:text-[20px]`} style={{ fontWeight: 700 }}>พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ</p>
                        <p className={`${font} text-[#a8d5a0] text-[12px]`}>พิมเสนน้ำอโรม่า ตราเมต้าเฮิร์บ มีชิ้นส่วนสมุนไพร</p>
                      </div>
                      {/* Dots */}
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                        <div className="h-2 w-6 rounded-full bg-white" />
                        <div className="size-2 rounded-full bg-white/40" />
                        <div className="size-2 rounded-full bg-white/40" />
                      </div>
                    </div>
                  </div>

                  {/* Right — heading + cards + certs */}
                  <div className="w-full lg:w-1/2 min-w-0">
                    <h2 className={`${font} text-[26px] sm:text-[34px] lg:text-[40px] leading-tight`} style={{ fontWeight: 700 }}>
                      <span className="text-white block">{c.title1}</span>
                      <span className="text-[#7db870] block">{c.title2}</span>
                    </h2>

                    {c.showProductCards && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                        {productCards.map((card, i) => (
                          <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                            <span className={`${font} inline-block text-white text-[11px] px-3 py-1 rounded-full`} style={{ backgroundColor: card.tagColor }}>{card.tag}</span>
                            <h4 className={`${font} text-white text-[15px] mt-2`} style={{ fontWeight: 600 }}>{card.title}</h4>
                            <p className={`${font} text-white/70 text-[12px] mt-1 line-clamp-2`}>{card.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {c.showCertifications && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {[c.cert1, c.cert2, c.cert3, c.cert4].map((cert) => (
                          <span key={cert} className={`${font} bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] text-[#a8d5a0] text-[12px] px-3 py-1.5 rounded-full`}>{cert}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        }
        if (s.id === "about_mission") {
          const c = configs.about_mission;
          const stacked = view === "mobile" || view === "tablet";
          const stats = [
            { v: c.stat1Value, l: c.stat1Label },
            { v: c.stat2Value, l: c.stat2Label },
            { v: c.stat3Value, l: c.stat3Label },
            { v: c.stat4Value, l: c.stat4Label },
          ];
          return (
            <section key={s.id} id="mission" className="bg-white py-12 sm:py-16 lg:py-20">
              <div className={`max-w-[1280px] mx-auto ${px}`}>
                <div className={`flex ${stacked ? "flex-col" : "flex-row"} gap-6 lg:gap-10`}>
                  {/* Left — big image with text overlay */}
                  <div className={`relative rounded-3xl overflow-hidden shrink-0 ${
                    stacked ? "w-full h-[300px]" : "flex-[1.8] h-[440px] lg:h-[520px]"
                  }`}>
                    <img src={c.missionImage || SAFE_PRODUCT_IMAGES[5]} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,31,13,0.85)] via-[rgba(13,31,13,0.25)] to-transparent" />
                    {/* Top overlay text */}
                    <div className="absolute top-6 sm:top-8 left-6 sm:left-8">
                      <p className={`${font} text-white uppercase ${view === "mobile" ? "text-[22px]" : "text-[28px] lg:text-[40px]"}`} style={{ fontWeight: 700 }}>{c.overlayTopTitle}</p>
                      <p className={`${font} text-white/70 ${view === "mobile" ? "text-[22px]" : "text-[28px] lg:text-[40px]"}`} style={{ fontWeight: 700 }}>{c.overlayTopSubtitle}</p>
                    </div>
                    {/* Bottom overlay text */}
                    <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 right-6 sm:right-auto max-w-[640px]">
                      <h3 className={`${font} text-white leading-tight ${view === "mobile" ? "text-[20px]" : "text-[28px] lg:text-[36px]"}`} style={{ fontWeight: 700 }}>{c.quoteTitle}</h3>
                      <p className={`${font} text-white/70 mt-2 leading-relaxed ${view === "mobile" ? "text-[13px]" : "text-[16px] lg:text-[18px]"}`}>{c.quoteDescription}</p>
                    </div>
                  </div>

                  {/* Right — 4 stat cards vertical (on desktop) */}
                  <div className={`${stacked ? "grid grid-cols-2 gap-3" : "flex flex-col gap-3 flex-1 min-w-[220px]"}`}>
                    {stats.map((stat, i) => (
                      <div key={i} className="bg-[#f5f0e8] border border-[#e0d5c5] rounded-2xl p-4 sm:p-5 flex-1">
                        <p className={`${font} text-[#333] ${view === "mobile" ? "text-[22px]" : "text-[28px] lg:text-[32px]"}`} style={{ fontWeight: 700 }}>{stat.v}</p>
                        <p className={`${font} text-[#4a6741] ${view === "mobile" ? "text-[11px]" : "text-[13px] lg:text-[14px]"}`} style={{ fontWeight: 600 }}>{stat.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          );
        }
        const c = configs.about_contact;
        const stacked = view === "mobile" || view === "tablet";
        const contacts = [
          { icon: Phone,  label: c.phoneLabel,   value: c.phone,   sub: c.phoneSub },
          { icon: Mail,   label: c.emailLabel,   value: c.email,   sub: c.emailSub },
          { icon: MapPin, label: c.addressLabel, value: c.address, sub: c.addressSub },
        ];
        const socials = [
          { name: c.s1Name, handle: c.s1Handle },
          { name: c.s2Name, handle: c.s2Handle },
          { name: c.s3Name, handle: c.s3Handle },
          { name: c.s4Name, handle: c.s4Handle },
        ];
        return (
          <section key={s.id} className="bg-[#f5f0e8] py-12 sm:py-16 lg:py-20">
            <div className={`max-w-[1280px] mx-auto ${px}`}>
              <div className="text-center mb-10">
                <h2 className={`${font} text-[28px] sm:text-[36px] lg:text-[44px] text-[#1a2e1a]`} style={{ fontWeight: 700 }}>{c.title1}</h2>
                <h2 className={`${font} text-[28px] sm:text-[36px] lg:text-[44px] text-[#7db870]`} style={{ fontWeight: 700 }}>{c.title2}</h2>
                <p className={`${font} text-[13px] sm:text-[15px] text-[#4a6741] mt-3 max-w-[554px] mx-auto`}>{c.subtitle}</p>
              </div>

              <div className={`flex ${stacked ? "flex-col" : "flex-row"} gap-6 lg:gap-10`}>
                {/* Left — contact info + social */}
                <div className="flex-1 flex flex-col gap-5">
                  <h3 className={`${font} text-[18px] sm:text-[20px] text-[#333]`} style={{ fontWeight: 700 }}>{c.leftHeading}</h3>
                  {/* Contact cards with sub-text */}
                  <div className="flex flex-col gap-3">
                    {contacts.map((item, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-[#e0d5c5] shadow-sm p-4 flex gap-3 items-start">
                        <div className="size-10 bg-[#e8f5e2] rounded-xl flex items-center justify-center shrink-0">
                          <item.icon className="size-5 text-[#7db870]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[#4a6741] text-[12px]`}>{item.label}</p>
                          <p className={`${font} text-[#1a2e1a] text-[14px]`} style={{ fontWeight: 600 }}>{item.value}</p>
                          <p className={`${font} text-[11px] text-black/70 mt-0.5`}>{item.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Social section */}
                  {c.showSocial && (
                    <div className="mt-2">
                      <h3 className={`${font} text-[18px] sm:text-[20px] text-[#333] mb-3`} style={{ fontWeight: 700 }}>{c.socialHeading}</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {socials.map((sc) => (
                          <div key={sc.name} className="bg-white border border-[#e0d5c5] rounded-2xl px-3 py-2.5 flex items-center gap-2.5">
                            <div className="size-9 bg-[#e7cfbc] rounded-xl flex items-center justify-center shrink-0">
                              <span className={`${font} text-[#9D5400] text-[11px]`} style={{ fontWeight: 700 }}>{sc.name[0]}</span>
                            </div>
                            <div className="min-w-0">
                              <p className={`${font} text-[#1a2e1a] text-[13px]`} style={{ fontWeight: 600 }}>{sc.name}</p>
                              <p className={`${font} text-[#4a6741] text-[11px] truncate`}>{sc.handle}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right — contact form */}
                {c.showForm && (
                  <div className="flex-1 max-w-[600px]">
                    <div className="bg-white rounded-2xl border border-[#e0d5c5] shadow-sm p-5 sm:p-6">
                      <h3 className={`${font} text-[18px] sm:text-[20px] text-[#333]`} style={{ fontWeight: 700 }}>{c.formHeading}</h3>
                      <p className={`${font} text-[12px] text-[#4a6741] mb-5`}>{c.formSubheading}</p>
                      <div className="flex flex-col gap-3">
                        <div className={`flex ${view === "mobile" ? "flex-col" : "flex-row"} gap-3`}>
                          <div className="flex-1">
                            <label className={`${font} text-[12px] text-[#333] mb-1 block`}>ชื่อ-นามสกุล</label>
                            <div className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-3 py-2.5 ${font} text-[13px] text-gray-400`}>ชื่อของคุณ</div>
                          </div>
                          <div className="flex-1">
                            <label className={`${font} text-[12px] text-[#333] mb-1 block`}>อีเมล</label>
                            <div className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-3 py-2.5 ${font} text-[13px] text-gray-400`}>อีเมลของคุณ</div>
                          </div>
                        </div>
                        <div>
                          <label className={`${font} text-[12px] text-[#333] mb-1 block`}>หัวข้อ</label>
                          <div className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-3 py-2.5 ${font} text-[13px] text-gray-400`}>หัวข้อการติดต่อ</div>
                        </div>
                        <div>
                          <label className={`${font} text-[12px] text-[#333] mb-1 block`}>ข้อความ</label>
                          <div className={`w-full bg-[#f5f5f5] border border-[#e0d5c5] rounded-xl px-3 py-2.5 ${font} text-[13px] text-gray-400 min-h-[100px]`}>พิมพ์ข้อความของคุณ...</div>
                        </div>
                        <button className={`${font} w-full bg-[#319754] text-white py-2.5 rounded-xl text-[13px] flex items-center justify-center gap-2 mt-1`} style={{ fontWeight: 500 }}>
                          <Send className="size-4" /> {c.formSubmitText}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}

function PageAboutBuilder() {
  const [sections, setSections] = useState<AboutSection[]>(DEFAULT_ABOUT_SECTIONS);
  const [configs, setConfigs]   = useState<AboutConfigs>(DEFAULT_ABOUT_CONFIGS);
  const [dragId, setDragId]     = useState<AboutSectionId | null>(null);
  const [overId, setOverId]     = useState<AboutSectionId | null>(null);
  const [overPos, setOverPos]   = useState<"before" | "after" | null>(null);
  const [view, setView]         = useState<ViewMode>("desktop");
  const [showSave, setShowSave] = useState(false);
  const [previewView, setPreviewView] = useState<ViewMode>("desktop");

  const toggleVisible = (id: AboutSectionId) =>
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));

  const reorder = (from: AboutSectionId, to: AboutSectionId, pos: "before" | "after") => {
    setSections(prev => {
      const fromIdx = prev.findIndex(s => s.id === from);
      let toIdx     = prev.findIndex(s => s.id === to);
      if (fromIdx < 0 || toIdx < 0) return prev;
      if (pos === "after") toIdx += 1;
      if (fromIdx < toIdx) toIdx -= 1;
      if (fromIdx === toIdx) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      return next;
    });
  };
  const handleDragStart = (e: React.DragEvent, id: AboutSectionId) => {
    setDragId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
  };
  const handleDragOver = (e: React.DragEvent, id: AboutSectionId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (!dragId || dragId === id) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pos: "before" | "after" = (e.clientY - rect.top) < rect.height / 2 ? "before" : "after";
    setOverId(id);
    setOverPos(pos);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragId && overId && dragId !== overId && overPos) reorder(dragId, overId, overPos);
    setDragId(null); setOverId(null); setOverPos(null);
  };
  const handleDragEnd = () => { setDragId(null); setOverId(null); setOverPos(null); };

  const sectionsDirty = sections.some((s, i) => s.id !== DEFAULT_ABOUT_SECTIONS[i].id || s.visible !== DEFAULT_ABOUT_SECTIONS[i].visible);
  const configsDirty  = JSON.stringify(configs) !== JSON.stringify(DEFAULT_ABOUT_CONFIGS);
  const isDirty = sectionsDirty || configsDirty;
  const resetAll = () => { setSections(DEFAULT_ABOUT_SECTIONS); setConfigs(DEFAULT_ABOUT_CONFIGS); };

  const visibleSections = sections.filter(s => s.visible);
  const computePreview = <T extends { id: string }>(arr: T[], dId: string | null, oId: string | null, pos: "before" | "after" | null): T[] => {
    if (!dId || !oId || !pos || dId === oId) return arr;
    const fromIdx = arr.findIndex(s => s.id === dId);
    let toIdx     = arr.findIndex(s => s.id === oId);
    if (fromIdx < 0 || toIdx < 0) return arr;
    if (pos === "after") toIdx += 1;
    if (fromIdx < toIdx) toIdx -= 1;
    if (fromIdx === toIdx) return arr;
    const next = [...arr];
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    return next;
  };
  const previewSections = computePreview(visibleSections, dragId, overId, overPos);
  const previewSidebar  = computePreview(sections, dragId, overId, overPos);
  const visibleCount = visibleSections.length;

  const renderWire = (id: AboutSectionId) => {
    if (id === "about_hero")    return <AboutHeroWire    cfg={configs.about_hero}    view={view} />;
    if (id === "about_story")   return <AboutStoryWire   cfg={configs.about_story}   view={view} />;
    if (id === "about_trust")   return <AboutTrustWire   cfg={configs.about_trust}   view={view} />;
    if (id === "about_mission") return <AboutMissionWire cfg={configs.about_mission} view={view} />;
    return <AboutContactWire cfg={configs.about_contact} view={view} />;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5">
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-4 sm:p-5">
        <div className="pb-3 mb-4 border-b border-[#e8e8e8] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Info className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ตัวอย่าง Layout</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`${font} text-[11px] text-gray-400 hidden sm:inline`}>ลากการ์ดเพื่อสลับลำดับ</span>
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = view === m.id;
                return (
                  <button key={m.id} onClick={() => setView(m.id)} title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 bg-[#fafbfc] rounded-xl p-4 min-h-[400px] mx-auto w-full transition-[max-width] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={{ maxWidth: view === "mobile" ? 420 : view === "tablet" ? 820 : 1600 }}>
          {previewSections.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-gray-400">
              <EyeOff className="size-8" strokeWidth={1.5} />
              <p className={`${font} text-[13px]`}>ทุก section ถูกซ่อนอยู่</p>
            </div>
          )}
          {previewSections.map((s) => {
            const Icon = aboutSectionIcons[s.id];
            const isDragging = dragId === s.id;
            return (
              <div key={s.id} draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e)  => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`group relative rounded-2xl border-2 transition-all ${
                  isDragging ? "border-dashed opacity-60 bg-[#319754]/5" : "bg-white border-dashed border-gray-200 hover:border-[#319754]/40"
                }`}
                style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}>
                <div className="absolute -top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                  <div className="flex items-center gap-2 bg-white rounded-full pl-1.5 pr-3 py-1 border border-gray-200 shadow-sm pointer-events-auto cursor-grab active:cursor-grabbing">
                    <div className="size-5 rounded-full flex items-center justify-center" style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
                      <GripVertical className="size-3" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                    </div>
                    <Icon className="size-3 text-gray-500" strokeWidth={2.2} />
                    <span className={`${font} text-[11px] text-black`} style={{ fontWeight: 500 }}>{s.label}</span>
                  </div>
                  <div className="pointer-events-auto flex items-center gap-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button title="ตั้งค่า section นี้" className="bg-white rounded-full size-7 flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#319754]/40 hover:bg-[#319754]/5 transition-all cursor-pointer">
                          <Settings className="size-3.5 text-gray-500" strokeWidth={2.2} />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={8} className="w-[340px] p-3">
                        <div className="flex items-center gap-2 pb-2 mb-2 border-b border-gray-100">
                          <Icon className="size-3.5" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.4} />
                          <p className={`${font} text-[13px]`} style={{ fontWeight: 600 }}>{s.label}</p>
                        </div>
                        <AboutSectionSettings id={s.id} configs={configs} setConfigs={setConfigs} />
                      </PopoverContent>
                    </Popover>
                    <button onClick={() => toggleVisible(s.id)} title="ซ่อน section นี้"
                      className="bg-white rounded-full size-7 flex items-center justify-center border border-gray-200 shadow-sm hover:border-[#ff3b30]/40 hover:bg-[#ff3b30]/5 transition-all cursor-pointer">
                      <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                    </button>
                  </div>
                </div>
                <div className={`p-4 pt-6 ${isDragging ? "opacity-30" : ""}`}>
                  {renderWire(s.id)}
                </div>
                {isDragging && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`${font} flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-md border-2`}
                      style={{ borderColor: ADMIN_PRIMARY, color: ADMIN_PRIMARY, fontWeight: 600 }}>
                      <GripVertical className="size-3.5" strokeWidth={2.4} />
                      <span className="text-[12px]">วาง “{s.label}” ที่นี่</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3 h-fit lg:sticky lg:top-4">
        <div className="pb-3 border-b border-[#e8e8e8]">
          <div className="flex items-center gap-2">
            <Settings className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>การแสดงผล</p>
          </div>
          <p className={`${font} text-[11px] text-gray-500 mt-1`}>เปิด/ปิด และจัดลำดับแต่ละ section</p>
          <p className={`${font} text-[11px] text-gray-400 mt-1`}>
            แสดงอยู่ <span style={{ color: ADMIN_PRIMARY, fontWeight: 600 }}>{visibleCount}</span> จาก {sections.length} section
          </p>
        </div>

        <div className="flex flex-col gap-2">
          {previewSidebar.map((s) => {
            const Icon = aboutSectionIcons[s.id];
            const isDragging = dragId === s.id;
            return (
              <div key={s.id} draggable
                onDragStart={(e) => handleDragStart(e, s.id)}
                onDragOver={(e)  => handleDragOver(e, s.id)}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                className={`relative flex items-center gap-2 px-2 py-2 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing ${
                  isDragging ? "border-dashed bg-[#319754]/5" :
                  s.visible ? "border-gray-200 bg-white hover:border-[#319754]/40" :
                  "border-gray-100 bg-gray-50"
                }`}
                style={isDragging ? { borderColor: ADMIN_PRIMARY } : {}}>
                <GripVertical className="size-4 text-gray-400 shrink-0" strokeWidth={2.2} />
                <div className={`size-7 rounded-lg flex items-center justify-center shrink-0 ${s.visible ? "" : "opacity-40"}`}
                  style={{ backgroundColor: s.visible ? `${ADMIN_PRIMARY}1a` : "#f5f5f5" }}>
                  <Icon className="size-3.5" style={{ color: s.visible ? ADMIN_PRIMARY : "#999" }} strokeWidth={2.2} />
                </div>
                <span className={`${font} text-[13px] flex-1 truncate ${s.visible ? "text-black" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                  {s.label}
                </span>
                <button onClick={() => toggleVisible(s.id)} title={s.visible ? "ซ่อน" : "แสดง"}
                  className="size-7 rounded-lg flex items-center justify-center hover:bg-gray-100 cursor-pointer shrink-0 transition-colors">
                  {s.visible ? <Eye className="size-3.5 text-gray-600" strokeWidth={2.2} /> : <EyeOff className="size-3.5 text-gray-400" strokeWidth={2.2} />}
                </button>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#e8e8e8] flex gap-2">
          <button onClick={resetAll} disabled={!isDirty}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl border text-[12px] transition-all ${
              isDirty ? "border-gray-200 text-gray-700 hover:bg-gray-50 cursor-pointer" : "border-gray-100 text-gray-300 cursor-not-allowed"
            }`}
            style={{ fontWeight: 500 }}>
            <RotateCcw className="size-3.5" strokeWidth={2.2} />
            รีเซ็ตทั้งหมด
          </button>
          <button onClick={() => { setPreviewView(view); setShowSave(true); }}
            className={`${font} flex-1 inline-flex items-center justify-center gap-1.5 h-9 rounded-xl text-white text-[12px] transition-all cursor-pointer hover:opacity-90`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Save className="size-3.5" strokeWidth={2.2} />
            บันทึก
          </button>
        </div>
      </div>

      <Dialog open={showSave} onOpenChange={setShowSave}>
        <DialogContent className="!max-w-[95vw] !w-[1500px] max-h-[92vh] overflow-hidden p-0 flex flex-col">
          <DialogHeader className="px-6 pt-5 pb-3 border-b border-gray-100">
            <DialogTitle className={`${font} text-[17px]`} style={{ fontWeight: 600 }}>ตัวอย่างก่อนบันทึก</DialogTitle>
            <DialogDescription className={`${font} text-[12px] text-gray-500`}>
              นี่คือภาพหน้าจริงที่ผู้ใช้จะเห็น — ถ้าตกลง กดปุ่ม “ยืนยันบันทึก”
            </DialogDescription>
            <div className="inline-flex items-center bg-[#f5f5f5] rounded-full p-0.5 self-start mt-2">
              {([
                { id: "desktop" as const, label: "Desktop", Icon: Monitor },
                { id: "tablet"  as const, label: "Tablet",  Icon: Tablet },
                { id: "mobile"  as const, label: "Mobile",  Icon: Smartphone },
              ]).map((m) => {
                const active = previewView === m.id;
                return (
                  <button key={m.id} onClick={() => setPreviewView(m.id)} title={m.label}
                    className={`${font} inline-flex items-center gap-1.5 px-3 h-7 rounded-full text-[12px] transition-all cursor-pointer ${active ? "bg-white shadow-sm" : "text-gray-500 hover:text-black"}`}
                    style={{ color: active ? ADMIN_PRIMARY : undefined, fontWeight: 500 }}>
                    <m.Icon className="size-3.5" strokeWidth={2.2} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto bg-[#e9ecef] p-4">
            <div className="mx-auto transition-[max-width] duration-500"
              style={{ maxWidth: previewView === "mobile" ? 420 : previewView === "tablet" ? 820 : 1280 }}>
              <BrowserMockup url="metaherb.com/about" view={previewView}>
                <SitePreviewFrame currentPath="/about" view={previewView}>
                  <AboutFullPreview sections={sections} configs={configs} view={previewView} />
                </SitePreviewFrame>
              </BrowserMockup>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 border-t border-gray-100 gap-2">
            <button onClick={() => setShowSave(false)}
              className={`${font} h-9 px-5 rounded-xl border border-gray-200 text-gray-700 text-[12px] hover:bg-gray-50 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
            <button onClick={() => { toast.success("บันทึก layout เรียบร้อย"); setShowSave(false); }}
              className={`${font} h-9 px-5 rounded-xl text-white text-[12px] cursor-pointer hover:opacity-90 transition-opacity inline-flex items-center gap-1.5`}
              style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
              <Save className="size-3.5" strokeWidth={2.2} />
              ยืนยันบันทึก
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
    if (activeItem === "page_home")     return <PageHomeBuilder />;
    if (activeItem === "page_products") return <PageProductsBuilder />;
    if (activeItem === "page_blog")     return <PageBlogBuilder />;
    if (activeItem === "page_about")    return <PageAboutBuilder />;
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
