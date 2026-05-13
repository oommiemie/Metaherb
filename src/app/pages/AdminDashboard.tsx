import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import {
  BarChart3, Users, ShoppingCart, Package, Settings, Image as ImageIcon, TrendingUp,
  Shield, DollarSign, Megaphone, UserCog, BarChart2, ShoppingBag,
  Plus, Minus, Pencil, Trash2, MoreHorizontal, Eye, Search, ChevronLeft, ChevronRight, ChevronDown, Menu,
  Check, X, Mail, Phone, FileText, Store, AlertCircle, Star, Video,
  Home, Info, LayoutPanelTop, PanelBottom, Bell, Truck, MapPin, Globe, Tag, Zap, Ticket, Folder,
  Calendar as CalendarIcon, Clock, Link as LinkIcon, MousePointer2, ArrowRight, EyeOff,
  Image as ImageIcon2, Monitor, Smartphone, Tablet,
  Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3,
  AlignLeft, AlignCenter, AlignRight, AlignJustify, List, ListOrdered, Quote,
  Undo2, Redo2, Type, Palette, Highlighter, RemoveFormatting,
  Sparkles, Loader2, Wand2, Play, Upload, Youtube, Film, Facebook, ExternalLink,
  ScrollText, Lock, Save, Gavel, AlertTriangle, PackageX, Wallet,
  MessageSquare, PackageOpen, RotateCcw, Ban, Filter, Pin, History, Send, FolderEdit,
  Leaf, Coffee, Heart, Droplet, Gift, Apple, GripVertical,
  Sprout, TreePine, TreeDeciduous, Flower, Flower2, Trees, Sun, Cloud,
  Cherry, Grape, Citrus, Banana, Carrot, Wheat, Egg, EggFried, Cookie, Cake,
  IceCream, IceCream2, Pizza, Sandwich, Salad, Soup, Beef, Drumstick, Fish, Ham, Croissant, UtensilsCrossed,
  Wine, GlassWater, CupSoda, Milk, Beer,
  HeartPulse, Gem, Smile, Scissors, Brush, Paintbrush, Stars, Snowflake,
  Pill, Stethoscope, Syringe, Bandage, Activity, Microscope, Cross, FlaskConical, TestTube, TestTubes, Beaker, Droplets,
  Package2, Box, Boxes, ShoppingBasket, Backpack,
  Lamp, Bath, ShowerHead, Bed, Sofa, Armchair,
  Dog, Cat, Bird, PawPrint, Rabbit, Squirrel, Bone,
  Bike, Tent, Footprints, Mountain, Sunrise, Sunset,
  Award, Trophy, Medal, Crown, Flame, Bookmark, Shirt, BookOpen, Book, Music, Gamepad2,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { Calendar } from "../components/ui/calendar";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../components/ui/dialog";
import { toast } from "sonner";
import imgRequests from "../../assets/requests.png";
import imgDamagedGoods from "../../assets/damaged-goods.png";
import { products as siteProducts, categories as productCategories } from "../data/products";

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
    { id: "complaints", label: "การร้องเรียน",    icon: AlertCircle, children: [
      { id: "complaints_stats",  label: "สถิติการร้องเรียน",   icon: BarChart3 },
      { id: "complaints_list",   label: "รายการการร้องเรียน",   icon: FileText },
      { id: "complaints_appeals", label: "ข้ออุทธรณ์",            icon: Gavel },
    ]},
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
    { id: "content_index",  label: "Popup ต้อนรับ",  icon: Megaphone },
    { id: "content_legal",  label: "นโยบาย", icon: Shield, children: [
      { id: "content_terms",   label: "ข้อกำหนด",        icon: ScrollText },
      { id: "content_privacy", label: "ความเป็นส่วนตัว", icon: Lock },
    ]},
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

/* ========== BANNER CONTENT ========== */
type BannerPosition = "hero" | "right_top" | "right_bottom";
type BannerStatus = "active" | "scheduled" | "expired" | "draft";

interface Banner {
  id: string;
  name: string;
  description: string;
  image: string;
  position: BannerPosition;
  startDate: string; // ISO date
  endDate: string;   // ISO date
  status: BannerStatus;
  link?: string;
  clicks?: number;
}

const positionLabels: Record<BannerPosition, string> = {
  hero:         "Hero Carousel",
  right_top:    "Right Top",
  right_bottom: "Right Bottom",
};
const positionColors: Record<BannerPosition, string> = {
  hero:         "#319754",
  right_top:    "#0088ff",
  right_bottom: "#9747ff",
};
const statusLabels: Record<BannerStatus, string> = {
  active:    "เปิดใช้งาน",
  scheduled: "รอเผยแพร่",
  expired:   "หมดเวลา",
  draft:     "ร่าง",
};
const statusColors: Record<BannerStatus, string> = {
  active:    "#319754",
  scheduled: "#f59e0b",
  expired:   "#ff3b30",
  draft:     "#737373",
};

const initialBanners: Banner[] = [
  // Hero carousel — 4 รายการเปิดใช้งานพร้อมกัน (auto-rotate)
  { id: "BNR-001", name: "Nature's Remedies",         description: "แคมเปญหลักประจำเดือน — เน้นจุดเด่นแบรนด์ + Hero CTA",   image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1600&q=80", position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?category=hero", clicks: 1248 },
  { id: "BNR-002", name: "Herbs in Bowl",             description: "บรรยากาศสมุนไพรไทยพรีเมียม — รองรับ campaign ลดราคา",  image: "https://images.unsplash.com/photo-1611073615452-04d76e76e8b2?w=1600&q=80", position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products",                clicks: 892  },
  { id: "BNR-003", name: "Chamomile Tea Promo",       description: "โปรชาคาโมมายล์ — ลดสูงสุด 30% สำหรับสมาชิก",            image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1600&q=80", position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?cat=tea",        clicks: 654  },
  { id: "BNR-004", name: "Wellness Garden",           description: "เซ็ตของขวัญสมุนไพร — เหมาะเป็นของขวัญทุกโอกาส",          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=80", position: "hero",         startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?gift=true",      clicks: 412  },
  // Right top — 1 active + 1 scheduled
  { id: "BNR-005", name: "Bewell Essentials",         description: "สินค้าเสริมสุขภาพ — แนะนำโดยแพทย์",                       image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80",  position: "right_top",    startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?tag=bewell",     clicks: 318 },
  { id: "BNR-006", name: "Summer Detox Series",       description: "แคมเปญดีท็อกซ์ฤดูร้อน — เริ่ม 1 มิ.ย.",                   image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80",  position: "right_top",    startDate: "2026-06-01", endDate: "2026-06-30", status: "scheduled", link: "/products?tag=detox",       clicks: 0   },
  // Right bottom — 1 active
  { id: "BNR-007", name: "Beauty & Skin",             description: "ครีมสมุนไพรบำรุงผิว — สูตรดั้งเดิม",                      image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&q=80",  position: "right_bottom", startDate: "2026-05-01", endDate: "2026-05-31", status: "active",    link: "/products?cat=beauty",     clicks: 256 },
  // Expired & draft examples
  { id: "BNR-008", name: "Songkran Festival",         description: "แคมเปญสงกรานต์ที่ผ่านไป",                                  image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=1600&q=80", position: "hero",         startDate: "2026-04-10", endDate: "2026-04-20", status: "expired",   link: "/promotions/songkran",     clicks: 2148 },
  { id: "BNR-009", name: "New Year 2027 Teaser",      description: "ตัวอย่างแคมเปญต้อนรับปีใหม่ 2570 — ยังไม่กำหนดวัน",     image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1600&q=80", position: "hero",         startDate: "",            endDate: "",            status: "draft",     link: "",                          clicks: 0   },
  { id: "BNR-010", name: "Mother's Day Special",      description: "แคมเปญวันแม่ — กำหนดเปิด ส.ค.",                            image: "https://images.unsplash.com/photo-1607006517806-1abf5ec4923f?w=400&q=80",  position: "right_bottom", startDate: "2026-08-01", endDate: "2026-08-15", status: "scheduled", link: "/promotions/mom",          clicks: 0   },
];

// Hero carousel preview — auto-rotate active hero banners
function HeroCarouselPreview({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (banners.length < 2) return;
    const t = setInterval(() => setIdx((p) => (p + 1) % banners.length), 4000);
    return () => clearInterval(t);
  }, [banners.length]);

  if (banners.length === 0) {
    return (
      <div className="absolute inset-0 bg-[#fafafa] flex items-center justify-center">
        <span className={`${font} text-[12px] text-gray-400`}>ไม่มี Banner ที่กำลังแสดง</span>
      </div>
    );
  }
  return (
    <>
      {banners.map((b, i) => (
        <div key={b.id} className={`absolute inset-0 transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          <ImageWithFallback src={b.image} alt={b.name} className="w-full h-full object-cover" />
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)}
            className={`rounded-full cursor-pointer transition-all ${i === idx ? "w-6 h-2 bg-white" : "size-2 bg-white/60"}`} />
        ))}
      </div>
    </>
  );
}

// Position tag — minimal glass pill (dot + label)
function PositionTag({ color, Icon: _Icon, label, count }: { color: string; Icon?: any; label: string; count?: number }) {
  return (
    <div className="absolute top-2.5 right-2.5 z-20">
      <span className="inline-flex items-center gap-1.5 bg-white/85 backdrop-blur-md rounded-full px-2.5 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
        <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
        <span className={`${font} text-[10px] text-gray-700 whitespace-nowrap`} style={{ fontWeight: 500 }}>{label}</span>
        {typeof count === "number" && (
          <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>· {count}</span>
        )}
      </span>
    </div>
  );
}


// Slot preview (right top / right bottom) — fill parent wrapper 100%
function SlotPreview({ banner, label }: { banner: Banner | undefined; label: string }) {
  return (
    <div className="rounded-[16px] overflow-hidden w-full h-full relative bg-[#fafafa] border border-gray-100">
      {banner ? (
        <ImageWithFallback src={banner.image} alt={banner.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <ImageIcon className="size-5 text-gray-300" strokeWidth={1.8} />
          <span className={`${font} text-[10px] text-gray-400`}>ว่าง · {label}</span>
        </div>
      )}
    </div>
  );
}

// Date picker (ธีมหลัก) — Calendar ใน Popover, แสดงวันที่แบบ Thai BE
function BannerDatePicker({ value, onChange, placeholder = "เลือกวันที่" }: {
  value: string;
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(value) : null;
  const display = parsed
    ? `${String(parsed.getDate()).padStart(2, "0")}/${String(parsed.getMonth() + 1).padStart(2, "0")}/${parsed.getFullYear() + 543}`
    : placeholder;

  const handleSelect = (d: Date | undefined) => {
    if (!d) return;
    const p = (n: number) => String(n).padStart(2, "0");
    onChange(`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button"
          className={`${font} bg-[#fafafa] hover:bg-gray-100/80 flex h-12 items-center justify-between pl-5 pr-4 py-3 rounded-full w-full text-left cursor-pointer transition-all border-2 border-transparent data-[state=open]:border-[#319754]/40 data-[state=open]:bg-white`}>
          <span className={`text-[13px] tabular-nums truncate ${parsed ? "text-black" : "text-[#a3a3a3]"}`} style={{ fontWeight: 500 }}>{display}</span>
          <CalendarIcon className="size-4 text-gray-500 shrink-0 ml-2" strokeWidth={2.2} />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 rounded-2xl border border-gray-100 shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
        align="start">
        <Calendar
          mode="single"
          selected={parsed ?? undefined}
          onSelect={handleSelect}
          defaultMonth={parsed ?? undefined}
        />
        {value && (
          <div className="border-t border-gray-100 p-2 flex items-center justify-end gap-2 bg-[#fafafa]">
            <button type="button" onClick={() => { onChange(""); setOpen(false); }}
              className={`${font} text-[12px] text-gray-600 hover:text-[#ff3b30] px-3 py-1 cursor-pointer transition-colors`}>
              ล้างค่า
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// Inline ToggleSwitch (เหมือน SettingsPage)
function MiniToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`w-[44px] h-6 rounded-full cursor-pointer transition-colors relative shrink-0 p-0.5 flex items-center ${enabled ? "" : "bg-[rgba(60,60,67,0.3)]"}`}
      style={enabled ? { backgroundColor: ADMIN_PRIMARY } : {}}>
      <div className={`size-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

// FilterTabPills — แสดง tabs row บน lg+ / dropdown บน < lg
function FilterTabPills<T extends string>({ tabs, active, onChange, pillId, singleRow }: {
  tabs: { id: T; label: string; count: number; Icon: any }[];
  active: T;
  onChange: (id: T) => void;
  pillId: string;
  singleRow?: boolean;
}) {
  const activeTab = tabs.find((t) => t.id === active);
  const ActiveIcon = activeTab?.Icon;

  return (
    <>
      {/* Desktop (lg+): tabs row */}
      <div className={`hidden lg:flex items-center gap-2 flex-1 min-w-0 ${singleRow ? "flex-nowrap" : "flex-wrap"}`}>
        {tabs.map((tab) => {
          const isAct = active === tab.id;
          return (
            <motion.button key={tab.id} onClick={() => onChange(tab.id)}
              whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
              {isAct && (
                <motion.span layoutId={pillId}
                  className="absolute inset-0 bg-[#319754] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }} />
              )}
              <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                transition={{ duration: 0.2 }}>
                <tab.Icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
              </motion.span>
              <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{tab.label}</span>
              <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{tab.count}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Mobile/tablet (< lg): icon-only dropdown */}
      <Popover>
        <PopoverTrigger asChild>
          <button title={activeTab?.label}
            className="lg:hidden inline-flex items-center justify-center size-[36px] rounded-full bg-[#319754] text-white cursor-pointer shrink-0 data-[state=open]:bg-[#267a43] transition-colors">
            {ActiveIcon && <ActiveIcon className="size-[16px] text-white" strokeWidth={2.2} />}
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" sideOffset={6}
          className="w-[260px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
          <motion.div initial={{ scale: 0.6, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
            style={{ transformOrigin: "top left" }}>
            {tabs.map((tab) => {
              const isAct = active === tab.id;
              return (
                <button key={tab.id} onClick={() => onChange(tab.id)}
                  className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors text-left ${isAct ? "bg-[#319754]/10" : "hover:bg-gray-50"}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`size-7 rounded-full inline-flex items-center justify-center shrink-0 ${isAct ? "bg-[#319754]" : "bg-[#d6eadd]"}`}>
                      <tab.Icon className={`size-3.5 ${isAct ? "text-white" : "text-[#319754]"}`} strokeWidth={2.2} />
                    </span>
                    <span className={`${font} text-[13px] truncate`} style={{ fontWeight: isAct ? 700 : 500, color: isAct ? "#319754" : "#171717" }}>{tab.label}</span>
                  </div>
                  <span className={`${font} text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 ${isAct ? "bg-[#319754] text-white" : "bg-[#ff3b30] text-white"}`} style={{ fontWeight: 600 }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </PopoverContent>
      </Popover>
    </>
  );
}

// Section card wrapper — header ตรงธีมหลัก (icon container ขนาด 36 + bg tint)
function FormSection({ icon: Icon, title, desc, action, iconColor, children }: {
  icon: any; title: string; desc?: string; action?: React.ReactNode; iconColor?: string; children: React.ReactNode;
}) {
  const c = iconColor || ADMIN_PRIMARY;
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
      <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c}1a` }}>
            <Icon className="size-4" style={{ color: c }} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className={`${font} text-[14px] text-black leading-tight truncate`} style={{ fontWeight: 600 }}>{title}</p>
            {desc && <p className={`${font} text-[11px] text-[#8e8e93] mt-0.5 truncate`}>{desc}</p>}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </div>
  );
}

/* ========== ADD / EDIT BANNER VIEW ========== */
const SAMPLE_IMAGES = [
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1600&q=80",
  "https://images.unsplash.com/photo-1611073615452-04d76e76e8b2?w=1600&q=80",
  "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=1600&q=80",
  "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=80",
  "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1600&q=80",
  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1600&q=80",
];

// แนะนำขนาดภาพต่อ position
const slotDimensions: Record<BannerPosition, { w: number; h: number; ratio: string }> = {
  hero:         { w: 775, h: 235, ratio: "3.3 : 1" },
  right_top:    { w: 230, h: 110, ratio: "2.1 : 1" },
  right_bottom: { w: 230, h: 110, ratio: "2.1 : 1" },
};

// Slot in the layout picker
//  - ยังไม่มีภาพในระบบเลย → ทุก slot แสดงปุ่ม "+ เพิ่มภาพจากเครื่อง"
//  - มีภาพแล้วและเป็นช่องที่เลือก → แสดงภาพ + ปุ่ม "เปลี่ยนภาพ"
//  - มีภาพแล้วแต่ไม่ใช่ช่องที่เลือก → แสดงปุ่ม "ย้ายมาที่นี่" (เปลี่ยนเฉพาะตำแหน่ง ไม่เปิด file picker)
function LayoutSlotPicker({ position, aspectClass, selected, draftImage, hasAnyImage, onSelectImage, onSwitchPosition, onDelete }: {
  position: BannerPosition;
  aspectClass: string;
  selected: boolean;
  draftImage: string;
  hasAnyImage: boolean;
  fallbackBanner?: Banner | undefined;
  onSelect?: () => void;
  onSelectImage: (url: string) => void;
  onSwitchPosition: () => void;
  onDelete: () => void;
}) {
  const color = positionColors[position];
  const hasImage = selected && draftImage;
  const isOtherSlot = hasAnyImage && !selected;
  const dim = slotDimensions[position];
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Safety net — global drag-end / drop listener reset state ของทุก slot
  // (HTML5 drag events บาง browser fire ไม่ครบหลัง drop)
  React.useEffect(() => {
    const reset = () => { setIsDragging(false); setIsDragOver(false); };
    document.addEventListener("dragend", reset);
    document.addEventListener("drop", reset);
    return () => {
      document.removeEventListener("dragend", reset);
      document.removeEventListener("drop", reset);
    };
  }, []);

  // Reset drag state เมื่อ slot สูญเสียภาพ (ป้องกัน opacity-50 ค้าง)
  React.useEffect(() => {
    if (!hasImage) setIsDragging(false);
  }, [hasImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      toast.error("รองรับเฉพาะ JPEG / PNG / WebP / GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ใหญ่เกิน 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      onSelectImage(reader.result as string);
      toast.success(`เพิ่มภาพใน ${positionLabels[position]} แล้ว`);
    };
    reader.onerror = () => toast.error("อ่านไฟล์ไม่สำเร็จ");
    reader.readAsDataURL(file);
  };

  const openPicker = () => fileInputRef.current?.click();

  // Drag-drop handlers — ลากภาพระหว่าง slot
  const handleDragStart = (e: React.DragEvent) => {
    if (!hasImage) return;
    setIsDragging(true);
    e.dataTransfer.setData("banner-from-position", position);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragEnd = () => setIsDragging(false);
  const handleDragOver = (e: React.DragEvent) => {
    if (!hasAnyImage || hasImage) return; // ลากมาที่ slot ตัวเองไม่ต้อง
    const from = e.dataTransfer.types.includes("banner-from-position");
    if (!from) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDragOver(true);
  };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const from = e.dataTransfer.getData("banner-from-position") as BannerPosition;
    if (from && from !== position) {
      onSwitchPosition();
    }
  };

  return (
    <div
      draggable={hasImage}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`group/slot relative w-full ${aspectClass || "h-full"} rounded-[16px] overflow-hidden transition-all ${hasImage ? "cursor-grab active:cursor-grabbing" : ""} ${isDragging ? "opacity-50" : ""}`}
    >
      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange} className="hidden" />

      {/* Wireframe background — เส้นขอบเปลี่ยนสีตาม state */}
      <div
        className="absolute inset-0 rounded-[16px] border-2 border-dashed transition-colors pointer-events-none"
        style={{
          borderColor: isDragOver || selected ? color : "#d4d4d8",
          backgroundColor: selected ? `${color}08` : "#fafafa",
          backgroundImage: "repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,0.015) 10px 11px)",
          borderStyle: isDragOver ? "solid" : "dashed",
        }}
      />

      {/* Image overlay (เมื่อ slot นี้ที่เลือก + มีภาพ) */}
      {hasImage && (
        <ImageWithFallback src={draftImage} alt={positionLabels[position]} className="absolute inset-0 w-full h-full object-cover rounded-[16px]" />
      )}

      {/* CASE 1: ไม่มีภาพในระบบเลย → ปุ่ม + เปิด file picker */}
      {!hasAnyImage && (
        <button onClick={openPicker}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="size-9 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: `${color}1a` }}
          >
            <Plus className="size-4" style={{ color }} strokeWidth={2.4} />
          </motion.div>
          <div className="flex flex-col items-center gap-0.5">
            <span className={`${font} text-[11px]`} style={{ color, fontWeight: 600 }}>เพิ่มแบนเนอร์</span>
            <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{dim.w} × {dim.h} px · {dim.ratio}</span>
            <span className={`${font} text-[9px] text-gray-400`}>JPEG/PNG/WebP · ≤ 5MB</span>
          </div>
        </button>
      )}

      {/* Drop indicator — overlay เมื่อลากภาพมาวาง */}
      {isDragOver && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
          style={{ backgroundColor: `${color}20` }}>
          <div className="flex flex-col items-center gap-1.5">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1.1 }} transition={{ duration: 0.4, repeat: Infinity, repeatType: "reverse" }}
              className="size-12 rounded-full flex items-center justify-center bg-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]">
              <ArrowRight className="size-5" style={{ color }} strokeWidth={2.6} />
            </motion.div>
            <span className={`${font} text-[12px] bg-white px-3 py-1 rounded-full shadow-sm`} style={{ color, fontWeight: 700 }}>
              วางที่นี่
            </span>
          </div>
        </div>
      )}

      {/* CASE 2: มีภาพในระบบแล้ว แต่ slot นี้ไม่ใช่ช่องที่เลือก → ปุ่ม "ย้ายมาที่นี่" */}
      {isOtherSlot && (
        <button onClick={onSwitchPosition}
          className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer">
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="size-10 rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)] border-2"
            style={{ borderColor: `${color}66` }}
          >
            <ArrowRight className="size-4" style={{ color }} strokeWidth={2.4} />
          </motion.div>
          <div className="flex flex-col items-center gap-1">
            <span className={`${font} text-[11px]`} style={{ color, fontWeight: 600 }}>ย้ายมาที่นี่</span>
            <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{dim.w} × {dim.h} px · {dim.ratio}</span>
          </div>
        </button>
      )}

      {/* Position tag (มุมขวาบน) */}
      <div className="absolute top-2 right-2 z-20 pointer-events-none">
        <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-full px-2.5 py-1 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <span className="size-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
          <span className={`${font} text-[10px] whitespace-nowrap`} style={{ color: selected ? color : "#525252", fontWeight: selected ? 700 : 500 }}>
            {positionLabels[position]}
          </span>
        </span>
      </div>

      {/* Image actions — segmented toolbar (โผล่ตอน hover) */}
      {hasImage && (
        <>
          {/* Dark gradient — fade in on hover */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent z-10 pointer-events-none rounded-b-[16px] opacity-0 group-hover/slot:opacity-100 transition-opacity duration-200" />
          {/* Toolbar — slide-up + fade on hover */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-stretch bg-black/70 backdrop-blur-md rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.25)] opacity-0 translate-y-1 group-hover/slot:opacity-100 group-hover/slot:translate-y-0 transition-all duration-200">
            <button onClick={openPicker}
              className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer hover:bg-white/10 transition-colors">
              <Pencil className="size-3.5 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[12px] text-white`} style={{ fontWeight: 500 }}>เปลี่ยน</span>
            </button>
            <div className="w-px bg-white/20" />
            <button onClick={() => { onDelete(); toast.success(`ลบภาพออกจาก ${positionLabels[position]} แล้ว`); }}
              className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer hover:bg-[#ff3b30]/40 transition-colors">
              <Trash2 className="size-3.5 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[12px] text-white`} style={{ fontWeight: 500 }}>ลบ</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function BannerEditView({ initial, allBanners, onSave, onCancel }: {
  initial: Banner | null;
  allBanners: Banner[];
  onSave: (b: Banner) => void;
  onCancel: () => void;
}) {
  const isEdit = !!initial;
  const [draft, setDraft] = useState<Banner>(initial ?? {
    id:          `BNR-${String(Date.now()).slice(-3).padStart(3, "0")}`,
    name:        "",
    description: "",
    image:       "",
    position:    "hero",
    startDate:   "",
    endDate:     "",
    status:      "active",
    link:        "",
    clicks:      0,
  });
  const [alwaysOn, setAlwaysOn] = useState(!initial?.startDate);
  const [urlInput, setUrlInput] = useState("");

  const update = <K extends keyof Banner>(key: K, value: Banner[K]) => setDraft((p) => ({ ...p, [key]: value }));

  // Auto-derive status from dates (if not always on)
  React.useEffect(() => {
    if (alwaysOn) {
      update("startDate", "");
      update("endDate", "");
    }
  }, [alwaysOn]);

  // Aspect ratio for preview based on position
  const aspectClass = draft.position === "hero" ? "aspect-[775/235]" : "aspect-[230/110]";
  const positionColor = positionColors[draft.position];

  const canSave = draft.name.trim().length > 0 && draft.image.trim().length > 0;

  const positions: { id: BannerPosition; label: string; desc: string; size: string; Icon: any }[] = [
    { id: "hero",         label: "Hero Carousel", desc: "แสดงด้านซ้ายหน้าแรก เปลี่ยนอัตโนมัติทุก 4 วินาที", size: "775 × 235 px", Icon: LayoutPanelTop },
    { id: "right_top",    label: "Right Top",      desc: "แสดงมุมขวาบน — ขนาดเล็ก static",                      size: "230 × 110 px", Icon: LayoutPanelTop },
    { id: "right_bottom", label: "Right Bottom",   desc: "แสดงมุมขวาล่าง — ขนาดเล็ก static",                    size: "230 × 110 px", Icon: PanelBottom },
  ];

  return (
    <div>
      {/* Back button */}
      <div className="mb-5">
        <button onClick={onCancel}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{isEdit ? "แก้ไข Banner" : "เพิ่ม Banner ใหม่"}</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>
            {isEdit ? `กำลังแก้ไข ${initial?.id}` : "กรอกข้อมูล Banner ที่ต้องการเพิ่มลงในหน้าเว็บไซต์"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 h-[36px] rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            ยกเลิก
          </button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave({ ...draft, status: "draft" }); toast.success("บันทึกแบบร่างแล้ว"); }}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-5 h-[36px] rounded-full transition-colors ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ fontWeight: 500 }}>
            <FileText className="size-3.5" strokeWidth={2.4} />
            บันทึกแบบร่าง
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave(draft); toast.success(isEdit ? "บันทึกการแก้ไขแล้ว" : "เพิ่ม Banner ใหม่แล้ว"); }}
            className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Check className="size-4" strokeWidth={2.4} />
            บันทึก
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col gap-5">

      {/* SECTION 1: Interactive layout picker — เลือกตำแหน่งโดยคลิกที่ slot ในเลย์เอาต์จริง */}
      <FormSection icon={LayoutPanelTop} iconColor="#319754" title="เลือกตำแหน่ง · ดูตัวอย่างใน Layout จริง"
        desc="คลิกที่ช่องเพื่อเลือกตำแหน่ง · ลากภาพย้ายระหว่าง slot ได้">
        {/* Browser frame */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-[#fafafa]">
          {/* Mock browser top bar */}
          <div className="flex items-center gap-2 bg-white border-b border-gray-100 px-3 py-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className={`${font} flex-1 mx-3 bg-[#f5f5f5] rounded-md px-3 py-1 text-[11px] text-gray-500 truncate`}>metaherb.co.th</div>
          </div>
          {/* Scrollable layout */}
          <div className="overflow-x-auto">
            <div style={{ width: 1192 }} className="mx-auto py-5 px-0">
              <div className="flex flex-row gap-[10px]">
                  <div className="relative" style={{ flex: "775 1 0%", minWidth: 0 }}>
                    <LayoutSlotPicker
                      position="hero" aspectClass="aspect-[775/235]"
                      selected={draft.position === "hero"} draftImage={draft.image} hasAnyImage={!!draft.image}
                      onSelectImage={(url) => { update("position", "hero"); update("image", url); }}
                      onSwitchPosition={() => { update("position", "hero"); toast.success("ย้ายภาพไปยัง Hero Carousel"); }}
                      onDelete={() => update("image", "")}
                    />
                  </div>
                  <div className="flex flex-col gap-[10px]" style={{ flex: "230 1 0%", minWidth: 0 }}>
                    <div className="relative flex-1 min-h-0">
                      <LayoutSlotPicker
                        position="right_top" aspectClass=""
                        selected={draft.position === "right_top"} draftImage={draft.image} hasAnyImage={!!draft.image}
                        onSelectImage={(url) => { update("position", "right_top"); update("image", url); }}
                        onSwitchPosition={() => { update("position", "right_top"); toast.success("ย้ายภาพไปยัง Right Top"); }}
                        onDelete={() => update("image", "")}
                      />
                    </div>
                    <div className="relative flex-1 min-h-0">
                      <LayoutSlotPicker
                        position="right_bottom" aspectClass=""
                        selected={draft.position === "right_bottom"} draftImage={draft.image} hasAnyImage={!!draft.image}
                        onSelectImage={(url) => { update("position", "right_bottom"); update("image", url); }}
                        onSwitchPosition={() => { update("position", "right_bottom"); toast.success("ย้ายภาพไปยัง Right Bottom"); }}
                        onDelete={() => update("image", "")}
                      />
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </FormSection>

      {/* Section 2: Info — full width row */}
      <FormSection icon={FileText} iconColor="#0088ff" title="ข้อมูลทั่วไป" desc="ชื่อและคำอธิบายของ banner">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
              ชื่อ Banner <span className="text-[#ff3b30]">*</span>
            </label>
            <input value={draft.name} onChange={(e) => update("name", e.target.value)}
              placeholder="เช่น Nature's Remedies"
              className={`${font} bg-[#fafafa] h-12 rounded-full px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
              style={{ fontWeight: 500 }} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-500`}>คำอธิบาย</label>
            <input value={draft.description} onChange={(e) => update("description", e.target.value)}
              placeholder="คำอธิบายสั้นๆ เกี่ยวกับ banner"
              className={`${font} bg-[#fafafa] h-12 rounded-full px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
              style={{ fontWeight: 500 }} />
          </div>
        </div>
      </FormSection>

      {/* Section 4: Schedule — full width */}
      <FormSection icon={CalendarIcon} iconColor="#f59e0b" title="กำหนดเวลาแสดง" desc="ตั้งช่วงเวลาที่ banner จะแสดง">
            {/* Always on toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fafafa]">
              <div>
                <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>แสดงตลอดเวลา</p>
                <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>banner จะแสดงทันทีและไม่มีวันหมดอายุ</p>
              </div>
              <MiniToggle enabled={alwaysOn} onToggle={() => setAlwaysOn(!alwaysOn)} />
            </div>
            {/* Date range */}
            {!alwaysOn && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.25 }}
                className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                      <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />
                      เริ่มแสดง
                    </label>
                    <BannerDatePicker value={draft.startDate} onChange={(v) => update("startDate", v)} placeholder="เลือกวันเริ่มแสดง" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                      <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />
                      สิ้นสุดการแสดง
                    </label>
                    <BannerDatePicker value={draft.endDate} onChange={(v) => update("endDate", v)} placeholder="เลือกวันสิ้นสุด" />
                  </div>
                </div>
              </motion.div>
            )}
      </FormSection>

      {/* Section 5: Link — full width */}
      <FormSection icon={LinkIcon} iconColor="#9747ff" title="ลิงก์ปลายทาง" desc="หน้าที่ลูกค้าจะถูกพาไปเมื่อคลิก banner">
        <div className="flex flex-col gap-1.5">
          <label className={`${font} text-[12px] text-gray-500`}>URL หรือ path ภายในเว็บ</label>
          <div className="relative">
            <LinkIcon className="size-3.5 text-gray-400 absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
            <input value={draft.link || ""} onChange={(e) => update("link", e.target.value)}
              placeholder="เช่น /products?category=hero หรือ https://..."
              className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-11 pr-5 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
              style={{ fontWeight: 500 }} />
          </div>
          <p className={`${font} text-[10px] text-gray-400 pl-3`}>เว้นว่างถ้าไม่ต้องการให้คลิกได้</p>
        </div>
      </FormSection>

      {/* Section 6: Publish toggle (auto-derive status จากวันที่) */}
      {(() => {
        const isPublished = draft.status !== "draft";
        // คำนวณสถานะอัตโนมัติจาก dates เมื่อเปิดเผยแพร่
        const deriveStatus = (): BannerStatus => {
          if (alwaysOn) return "active";
          const now = new Date();
          if (draft.startDate && new Date(draft.startDate) > now) return "scheduled";
          if (draft.endDate && new Date(draft.endDate + "T23:59:59") < now) return "expired";
          return "active";
        };
        const effectiveStatus: BannerStatus = isPublished ? deriveStatus() : "draft";
        const c = statusColors[effectiveStatus];
        const togglePublish = () => {
          if (isPublished) update("status", "draft");
          else update("status", deriveStatus());
        };
        return (
          <FormSection icon={Settings} iconColor="#ff9500" title="สถานะการเผยแพร่" desc="เปิด/ปิดการเผยแพร่ — สถานะ 'รอเผยแพร่' / 'หมดเวลา' จะคำนวณจากกำหนดเวลาอัตโนมัติ">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fafafa]">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-2xl flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: isPublished ? `${ADMIN_PRIMARY}1a` : "#e5e5e5" }}>
                  <Eye className="size-5" style={{ color: isPublished ? ADMIN_PRIMARY : "#999" }} strokeWidth={2.2} />
                </div>
                <div>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>เผยแพร่ banner นี้บนหน้าเว็บ</p>
                  <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{isPublished ? "ลูกค้าจะเห็น banner ตามกำหนดเวลา" : "ซ่อนจากหน้าเว็บ — ใช้สำหรับเก็บไว้ใช้ภายหลัง"}</p>
                </div>
              </div>
              <MiniToggle enabled={isPublished} onToggle={togglePublish} />
            </div>

            {/* Effective status preview */}
            <div className="flex items-center justify-between gap-3 p-3 rounded-xl border" style={{ borderColor: `${c}33`, backgroundColor: `${c}0d` }}>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white shadow-sm" style={{ color: c }}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: c }} />
                  <span className={`${font} text-[12px]`} style={{ fontWeight: 700 }}>{statusLabels[effectiveStatus]}</span>
                </span>
                <p className={`${font} text-[11px] text-gray-600`}>
                  {effectiveStatus === "active"    && "แสดงบนหน้าเว็บอยู่ขณะนี้"}
                  {effectiveStatus === "scheduled" && `จะเริ่มแสดง ${draft.startDate ? new Date(draft.startDate).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}`}
                  {effectiveStatus === "expired"   && `หมดเวลาแสดงเมื่อ ${draft.endDate ? new Date(draft.endDate).toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "2-digit" }) : "—"}`}
                  {effectiveStatus === "draft"     && "ปิดการเผยแพร่ — ลูกค้าจะไม่เห็น"}
                </p>
              </div>
              <span className={`${font} text-[10px] text-gray-400`}>คำนวณอัตโนมัติ</span>
            </div>
          </FormSection>
        );
      })()}
      </div>
    </div>
  );
}

function BannerContent() {
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BannerStatus>("all");
  const [positionFilter, setPositionFilter] = useState<"all" | BannerPosition>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // View state for add/edit
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  const startAdd = () => { setEditingBanner(null); setView("edit"); };
  const startEdit = (b: Banner) => { setEditingBanner(b); setView("edit"); };
  const closeEdit = () => { setView("list"); setEditingBanner(null); };

  const saveBanner = (b: Banner) => {
    setBanners((prev) => editingBanner ? prev.map((x) => x.id === b.id ? b : x) : [...prev, b]);
    closeEdit();
  };

  // Render edit view if active
  if (view === "edit") {
    return <BannerEditView initial={editingBanner} allBanners={banners} onSave={saveBanner} onCancel={closeEdit} />;
  }

  // Active banners by position (สำหรับ preview)
  const heroActive = banners.filter((b) => b.position === "hero" && b.status === "active");
  const rightTopActive = banners.find((b) => b.position === "right_top" && b.status === "active");
  const rightBottomActive = banners.find((b) => b.position === "right_bottom" && b.status === "active");

  // Status tabs
  const statusTabs: { id: "all" | BannerStatus; label: string; count: number; Icon: any }[] = [
    { id: "all",       label: "ทั้งหมด",      count: banners.length,                                  Icon: ImageIcon },
    { id: "active",    label: "เปิดใช้งาน",   count: banners.filter((b) => b.status === "active").length,    Icon: Check },
    { id: "scheduled", label: "รอเผยแพร่",    count: banners.filter((b) => b.status === "scheduled").length, Icon: Clock },
    { id: "expired",   label: "หมดเวลา",      count: banners.filter((b) => b.status === "expired").length,   Icon: AlertCircle },
    { id: "draft",     label: "ร่าง",          count: banners.filter((b) => b.status === "draft").length,     Icon: FileText },
  ];

  // Filtered list
  const filtered = banners.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (positionFilter !== "all" && b.position !== positionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q) || b.id.toLowerCase().includes(q);
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  const toggleBannerStatus = (id: string) => {
    setBanners((prev) => prev.map((b) =>
      b.id === id ? { ...b, status: b.status === "active" ? "draft" : "active" } : b
    ));
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header — title + subtitle + add button (row เดียวกัน, ธีมหลัก) */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>Banner</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดการ Banner ที่แสดงบนหน้าเว็บไซต์</p>
        </div>
        <motion.button
          onClick={startAdd}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}
        >
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่ม Banner</span>
        </motion.button>
      </div>

      {/* Section 1: Live Preview (ขนาดจริงที่แสดงบนหน้าเว็บ — 1192px + scroll) */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Eye className="size-4 text-[#319754]" strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ตัวอย่าง Banner ที่กำลังแสดงอยู่หน้าเว็บ</p>
            <span className={`${font} text-[11px] text-gray-400`}>(ขนาดจริง · 1192 × 280 px)</span>
          </div>
          <span className={`${font} inline-flex items-center gap-1.5 text-[11px] bg-[#319754]/10 text-[#319754] px-2.5 py-1 rounded-full`} style={{ fontWeight: 600 }}>
            <span className="size-1.5 rounded-full bg-[#319754] animate-pulse" />
            Live
          </span>
        </div>

        {/* Browser-like frame + horizontal scroll if admin area < 1192px */}
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-[#fafafa]">
          {/* Mock browser top bar */}
          <div className="flex items-center gap-2 bg-white border-b border-gray-100 px-3 py-2">
            <div className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-[#ff5f57]" />
              <span className="size-2.5 rounded-full bg-[#febc2e]" />
              <span className="size-2.5 rounded-full bg-[#28c840]" />
            </div>
            <div className={`${font} flex-1 mx-3 bg-[#f5f5f5] rounded-md px-3 py-1 text-[11px] text-gray-500 truncate`}>
              metaherb.co.th
            </div>
          </div>

          {/* Scrollable preview area */}
          <div className="overflow-x-auto">
            <div style={{ width: 1192 }} className="mx-auto py-5 px-0">
              {/* Layout match HomePage banner — 775px hero + 230px right column + 10px gap */}
              <div className="flex flex-row gap-[10px]">
                {/* Hero (left) — 775 / (775+230+10) ratio */}
                <div className="relative" style={{ flex: "775 1 0%", minWidth: 0 }}>
                  <div className="aspect-[775/235] rounded-[16px] overflow-hidden bg-[#faf8f5] relative">
                    <HeroCarouselPreview banners={heroActive} />
                    <PositionTag color="#319754" Icon={LayoutPanelTop} label="Hero Carousel" count={heroActive.length} />
                  </div>
                </div>
                {/* Right column (2 small banners) */}
                <div className="flex flex-col gap-[10px]" style={{ flex: "230 1 0%", minWidth: 0 }}>
                  <div className="relative flex-1 min-h-0">
                    <SlotPreview banner={rightTopActive} label="Right Top" />
                    <PositionTag color="#0088ff" Icon={LayoutPanelTop} label="Right Top" />
                  </div>
                  <div className="relative flex-1 min-h-0">
                    <SlotPreview banner={rightBottomActive} label="Right Bottom" />
                    <PositionTag color="#9747ff" Icon={PanelBottom} label="Right Bottom" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className={`${font} text-[11px] text-gray-400 flex items-center gap-1.5`}>
          <Info className="size-3 text-gray-400" strokeWidth={2.4} />
          แสดงผลขนาดจริงตามที่จะปรากฏบนหน้าเว็บ desktop · ลากแนวนอนเพื่อดูส่วนที่เกิน
        </p>
      </div>

      {/* Section 2: Filter pill (ตรง ProductsTab pattern) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
        <FilterTabPills tabs={statusTabs} active={statusFilter} onChange={(id) => { setStatusFilter(id); setPage(1); }} pillId="bannerStatusPill" />
        {/* Position filter — ซ่อนบนจอเล็ก */}
        <div className="hidden lg:block relative shrink-0">
          <LayoutPanelTop className="size-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
          <select value={positionFilter} onChange={(e) => { setPositionFilter(e.target.value as any); setPage(1); }}
            className={`${font} text-[13px] appearance-none border border-gray-200 rounded-full pl-9 pr-9 h-[36px] bg-white cursor-pointer focus:outline-none focus:border-[#319754] hover:border-gray-300 transition-colors min-w-[150px]`}>
            <option value="all">ทุกตำแหน่ง</option>
            <option value="hero">Hero Carousel</option>
            <option value="right_top">Right Top</option>
            <option value="right_bottom">Right Bottom</option>
          </select>
          <ChevronDown className="size-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.4} />
        </div>
        {/* Search */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
          <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="ค้นหา Banner..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Section 3: Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "8%" }}  />{/* Image */}
            <col style={{ width: "20%" }} />{/* ชื่อ */}
            <col style={{ width: "22%" }} />{/* คำอธิบาย */}
            <col style={{ width: "16%" }} />{/* กำหนดเวลา */}
            <col style={{ width: "14%" }} />{/* ตำแหน่ง */}
            <col style={{ width: "12%" }} />{/* สถานะ */}
            <col style={{ width: "8%" }}  />{/* จัดการ */}
          </colgroup>
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
              <th className="text-left  pb-3 pr-2" style={{ fontWeight: 500 }}>ภาพ</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ชื่อ Banner</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>คำอธิบาย</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>กำหนดเวลาแสดง</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>ตำแหน่ง</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
              <th className="text-center pb-3"      style={{ fontWeight: 500 }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={7} className={`py-12 text-center ${font} text-[13px] text-gray-400`}>ไม่พบ Banner</td></tr>
            ) : paged.map((b) => {
              const pColor = positionColors[b.position];
              const sColor = statusColors[b.status];
              return (
                <tr key={b.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  {/* Image */}
                  <td className="py-3 pr-2">
                    <div className="size-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                      <ImageWithFallback src={b.image} alt={b.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  {/* Name + ID */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{b.name}</p>
                    <p className={`${font} text-[11px] text-gray-400 tabular-nums truncate`}>{b.id}{b.clicks ? ` · ${b.clicks.toLocaleString()} คลิก` : ""}</p>
                  </td>
                  {/* Description */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[12px] text-gray-700 line-clamp-2 leading-snug`} title={b.description}>{b.description}</p>
                  </td>
                  {/* Schedule */}
                  <td className="py-3 pr-4">
                    {b.startDate || b.endDate ? (
                      <div className="flex flex-col gap-0.5 leading-tight">
                        <span className={`${font} text-[11px] text-black tabular-nums`}>{fmtDate(b.startDate)}</span>
                        <span className={`${font} text-[11px] text-gray-400 tabular-nums`}>↳ {fmtDate(b.endDate)}</span>
                      </div>
                    ) : (
                      <span className={`${font} text-[11px] text-gray-400`}>ยังไม่กำหนด</span>
                    )}
                  </td>
                  {/* Position */}
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px]`}
                      style={{ backgroundColor: `${pColor}1a`, color: pColor, fontWeight: 600 }}>
                      <LayoutPanelTop className="size-3" strokeWidth={2.2} />
                      {positionLabels[b.position]}
                    </span>
                  </td>
                  {/* Status */}
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                      style={{ backgroundColor: `${sColor}1a`, color: sColor }}>
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                      {statusLabels[b.status]}
                    </span>
                  </td>
                  {/* Action */}
                  <td className="py-3 text-center align-middle">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={6}
                        className="w-[200px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                        <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                          style={{ transformOrigin: "top right" }} className="overflow-hidden">
                          <button onClick={() => toast.info(`ดูตัวอย่าง: ${b.name}`)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ดูตัวอย่าง</span>
                          </button>
                          <button onClick={() => startEdit(b)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>แก้ไข</span>
                          </button>
                          <button onClick={() => { toggleBannerStatus(b.id); toast.success(`${b.status === "active" ? "ปิด" : "เปิด"}การแสดง: ${b.name}`); }}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            {b.status === "active"
                              ? <X className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              : <Check className="size-3.5 text-gray-500" strokeWidth={2.2} />}
                            <span style={{ fontWeight: 500 }}>{b.status === "active" ? "ปิดการแสดง" : "เปิดการแสดง"}</span>
                          </button>
                          {b.link && (
                            <button onClick={() => toast.info(`Link: ${b.link}`)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <LinkIcon className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>คัดลอกลิงก์</span>
                            </button>
                          )}
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={() => { if (confirm(`ลบ "${b.name}"?`)) { setBanners((prev) => prev.filter((x) => x.id !== b.id)); toast.success(`ลบ: ${b.name}`); } }}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                            <Trash2 className="size-3.5" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ลบ</span>
                          </button>
                        </motion.div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
              <div className="relative">
                <select className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                  value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า · ทั้งหมด {filtered.length} รายการ</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === n ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: safePage === n ? 600 : 400 }}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========== BLOG / ARTICLE CONTENT ========== */
type ArticleStatus = "published" | "unpublished";
type ArticleTag = "featured" | "general";

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  tag: ArticleTag;
  status: ArticleStatus;
  views: number;
  publishedAt: string; // ISO date
}

const articleTagLabels: Record<ArticleTag, string> = {
  featured: "บทความแนะนำ",
  general:  "ทั่วไป",
};
const articleTagColors: Record<ArticleTag, string> = {
  featured: "#ff9500", // orange — เด่นสะดุดตา
  general:  "#737373", // gray — ทั่วไป
};
const articleStatusLabels: Record<ArticleStatus, string> = {
  published:   "เผยแพร่",
  unpublished: "ไม่เผยแพร่",
};
const articleStatusColors: Record<ArticleStatus, string> = {
  published:   "#319754",
  unpublished: "#737373",
};

const initialArticles: Article[] = [
  { id: "ART-001", title: "5 สมุนไพรช่วยลดความเครียดที่หลายคนไม่รู้",          description: "รวมสมุนไพรไทยที่ช่วยให้ผ่อนคลาย ลดความเครียดและช่วยให้นอนหลับสบาย",  image: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&q=80", tag: "featured", status: "published",    views: 12480, publishedAt: "2026-04-22" },
  { id: "ART-002", title: "วิธีชงชาสมุนไพรให้ได้สรรพคุณเต็มที่",                  description: "เทคนิคชงชาแต่ละชนิด เพื่อดึงสารสำคัญออกมาให้ได้มากที่สุด",         image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80", tag: "general",  status: "published",    views: 8412,  publishedAt: "2026-04-18" },
  { id: "ART-003", title: "ขมิ้นชัน — ของขวัญจากธรรมชาติเพื่อสุขภาพตับ",        description: "งานวิจัยเปิดเผยประโยชน์ของขมิ้นชันต่อระบบตับและการอักเสบ",        image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80", tag: "featured", status: "published",    views: 15680, publishedAt: "2026-04-10" },
  { id: "ART-004", title: "ฟ้าทะลายโจร: ตำนานยาฆ่าหวัดแห่งสยาม",                 description: "ทำความรู้จักฟ้าทะลายโจรสมุนไพรที่ทุกบ้านควรมี",                    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&q=80", tag: "general",  status: "published",    views: 6240,  publishedAt: "2026-04-05" },
  { id: "ART-005", title: "อโรม่าธรรมชาติ vs น้ำหอมสังเคราะห์",                    description: "เปรียบเทียบความแตกต่างของน้ำหอมจากธรรมชาติและสังเคราะห์",   image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&q=80", tag: "general",  status: "unpublished", views: 0,     publishedAt: "2026-06-01" },
  { id: "ART-006", title: "10 สูตรน้ำสมุนไพรเย็นสำหรับฤดูร้อน",                   description: "สูตรน้ำสมุนไพรช่วยดับร้อน พร้อมขั้นตอนทำเองที่บ้าน",                  image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80", tag: "featured", status: "published",    views: 9876,  publishedAt: "2026-03-28" },
  { id: "ART-007", title: "เห็ดหลินจือ — ราชาแห่งสมุนไพรจีน",                     description: "ประวัติศาสตร์และสรรพคุณของเห็ดหลินจือต่อระบบภูมิคุ้มกัน",         image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80", tag: "general",  status: "published",    views: 4120,  publishedAt: "2026-02-15" },
  { id: "ART-008", title: "ดูแลผิวด้วยสมุนไพรไทย — ขมิ้น ว่านหางจระเข้ น้ำผึ้ง",   description: "Mask หน้าสมุนไพรไทย 3 สูตรช่วยให้ผิวกระจ่างใส",                       image: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=400&q=80", tag: "general",  status: "published",    views: 7340,  publishedAt: "2026-03-12" },
  { id: "ART-009", title: "ดื่มน้ำผึ้งตอนเช้า ดีจริงไหม?",                            description: "ผลของการดื่มน้ำผึ้งตอนตื่นนอนต่อระบบเผาผลาญ",                          image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&q=80", tag: "general",  status: "unpublished",     views: 0,     publishedAt: "" },
  { id: "ART-010", title: "สมุนไพรช่วยนอนหลับ — เลือกใช้อย่างไรให้ปลอดภัย",       description: "แนะนำสมุนไพรช่วยให้นอนหลับสบาย + ข้อควรระวังในการใช้",          image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400&q=80", tag: "featured", status: "unpublished",     views: 0,     publishedAt: "" },
];

function BlogContent() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ArticleStatus>("all");
  const [tagFilter, setTagFilter] = useState<"all" | ArticleTag>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  // Preview modal
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  // Add / edit view
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const startAdd  = () => { setEditingArticle(null); setView("edit"); };
  const startEdit = (a: Article) => { setEditingArticle(a); setView("edit"); };
  const closeEdit = () => { setView("list"); setEditingArticle(null); };

  const saveArticle = (a: Article) => {
    setArticles((prev) => editingArticle ? prev.map((x) => x.id === a.id ? a : x) : [a, ...prev]);
    closeEdit();
  };

  if (view === "edit") {
    return <ArticleEditView initial={editingArticle} onSave={saveArticle} onCancel={closeEdit} />;
  }

  const statusTabs: { id: "all" | ArticleStatus; label: string; count: number; Icon: any }[] = [
    { id: "all",         label: "ทั้งหมด",     count: articles.length,                                          Icon: FileText },
    { id: "published",   label: "เผยแพร่",     count: articles.filter((a) => a.status === "published").length,   Icon: Eye },
    { id: "unpublished", label: "ไม่เผยแพร่", count: articles.filter((a) => a.status === "unpublished").length, Icon: EyeOff },
  ];

  const filtered = articles.filter((a) => {
    if (statusFilter !== "all" && a.status !== statusFilter) return false;
    if (tagFilter !== "all" && a.tag !== tagFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.id.toLowerCase().includes(q);
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>บทความ</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดการบทความและสาระความรู้บนหน้าเว็บไซต์</p>
        </div>
        <motion.button
          onClick={startAdd}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}>
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่มบทความ</span>
        </motion.button>
      </div>

      {/* Filter pill */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
        <FilterTabPills tabs={statusTabs} active={statusFilter} onChange={(id) => { setStatusFilter(id); setPage(1); }} pillId="articleStatusPill" />
        {/* Tag filter — ซ่อนบนจอเล็ก */}
        <div className="hidden lg:block relative shrink-0">
          <Tag className="size-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
          <select value={tagFilter} onChange={(e) => { setTagFilter(e.target.value as any); setPage(1); }}
            className={`${font} text-[13px] appearance-none border border-gray-200 rounded-full pl-9 pr-9 h-[36px] bg-white cursor-pointer focus:outline-none focus:border-[#319754] hover:border-gray-300 transition-colors min-w-[140px]`}>
            <option value="all">ทุกแท็ก</option>
            <option value="featured">บทความแนะนำ</option>
            <option value="general">ทั่วไป</option>
          </select>
          <ChevronDown className="size-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.4} />
        </div>
        {/* Search */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
          <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="ค้นหาบทความ..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Card grid — ตรง pattern HomePage แต่มี overlay บอกประเภท สถานะ + action menu */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        {paged.length === 0 ? (
          <div className={`py-16 text-center ${font} text-[13px] text-gray-400`}>ไม่พบบทความ</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
            {paged.map((a) => {
              const tColor = articleTagColors[a.tag];
              const sColor = articleStatusColors[a.status];
              return (
                <div key={a.id}
                  className="group bg-white rounded-[16px] border border-[#d4d4d4] h-auto sm:h-[180px] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-[#af6f08]/40 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row items-stretch h-full">
                    {/* Image — ใช้ overlay pattern เดียวกับ BlogPage (relative flex จัด justify-between) */}
                    <div className="relative h-[140px] sm:h-full shrink-0 w-full sm:w-[180px] overflow-hidden">
                      <ImageWithFallback src={a.image} alt={a.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {/* Featured star — เฉพาะบทความแนะนำ (อยู่ขวาบน ลอยอิสระ) */}
                      {a.tag === "featured" && (
                        <div className="absolute top-2.5 right-2.5 z-10 size-7 rounded-full flex items-center justify-center shadow-[0_2px_6px_rgba(255,149,0,0.4)]"
                          style={{ backgroundColor: "#ff9500" }}
                          title="บทความแนะนำ">
                          <Star className="size-3.5 text-white" strokeWidth={2.2} fill="white" />
                        </div>
                      )}
                      {/* Overlay container — views (top) + date (bottom) ตรง pattern BlogPage */}
                      <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                        <div className="bg-black/50 flex items-center gap-1.5 px-2.5 py-1 rounded-full">
                          <Eye className="size-3 text-white" />
                          <span className={`${font} text-[11px] text-white tabular-nums`}>{a.views.toLocaleString()}</span>
                        </div>
                        <div className="bg-black/50 px-2.5 py-1 rounded-full">
                          <span className={`${font} text-[11px] text-white tabular-nums`}>{a.publishedAt ? fmtDate(a.publishedAt) : "—"}</span>
                        </div>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 flex flex-col gap-[8px] p-[14px] min-w-0">
                      {/* Top row: status + action menu */}
                      <div className="flex items-start justify-between gap-2">
                        <span className={`${font} inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-full text-[10px]`}
                          style={{ backgroundColor: `${sColor}1a`, color: sColor }}>
                          <span className="size-1 rounded-full" style={{ backgroundColor: sColor }} />
                          {articleStatusLabels[a.status]}
                        </span>
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="size-6 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer shrink-0 data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                              <MoreHorizontal className="size-3.5" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent align="end" sideOffset={6}
                            className="w-[240px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                            <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                              style={{ transformOrigin: "top right" }} className="overflow-hidden">
                              {/* Toggle publish + featured — switch rows */}
                              {(() => {
                                const isPublished = a.status === "published";
                                const isFeatured  = a.tag === "featured";
                                const togglePublish = () => {
                                  const next: ArticleStatus = isPublished ? "unpublished" : "published";
                                  setArticles((prev) => prev.map((x) => x.id === a.id ? { ...x, status: next } : x));
                                  toast.success(next === "published" ? `เผยแพร่: ${a.title}` : `ไม่เผยแพร่: ${a.title}`);
                                };
                                const toggleFeatured = () => {
                                  const next: ArticleTag = isFeatured ? "general" : "featured";
                                  setArticles((prev) => prev.map((x) => x.id === a.id ? { ...x, tag: next } : x));
                                  toast.success(next === "featured" ? `เพิ่มเป็นบทความแนะนำ: ${a.title}` : `ยกเลิกบทความแนะนำ: ${a.title}`);
                                };
                                return (
                                  <>
                                    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl">
                                      <div className="flex items-center gap-3">
                                        {isPublished
                                          ? <Eye className="size-3.5 text-[#319754]" strokeWidth={2.2} />
                                          : <EyeOff className="size-3.5 text-gray-400" strokeWidth={2.2} />}
                                        <span className={`${font} text-[13px] text-black whitespace-nowrap`} style={{ fontWeight: 500 }}>เผยแพร่</span>
                                      </div>
                                      <MiniToggle enabled={isPublished} onToggle={togglePublish} />
                                    </div>
                                    <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl">
                                      <div className="flex items-center gap-3">
                                        <Star className="size-3.5"
                                          style={{ color: isFeatured ? "#ff9500" : "#a3a3a3" }}
                                          strokeWidth={2.2}
                                          fill={isFeatured ? "#ff9500" : "none"} />
                                        <span className={`${font} text-[13px] text-black whitespace-nowrap`} style={{ fontWeight: 500 }}>บทความแนะนำ</span>
                                      </div>
                                      <MiniToggle enabled={isFeatured} onToggle={toggleFeatured} />
                                    </div>
                                  </>
                                );
                              })()}
                              <div className="h-px bg-gray-100 my-1" />
                              <button onClick={() => startEdit(a)}
                                className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                                <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                                <span style={{ fontWeight: 500 }}>แก้ไข</span>
                              </button>
                              <div className="h-px bg-gray-100 my-1" />
                              <button onClick={() => { if (confirm(`ลบ "${a.title}"?`)) { setArticles((prev) => prev.filter((x) => x.id !== a.id)); toast.success(`ลบ: ${a.title}`); } }}
                                className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                                <Trash2 className="size-3.5" strokeWidth={2.2} />
                                <span style={{ fontWeight: 500 }}>ลบ</span>
                              </button>
                            </motion.div>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {/* Title + Description */}
                      <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }} title={a.title}>{a.title}</p>
                      <p className={`${font} text-[12px] text-[#737373] line-clamp-2`}>{a.description}</p>
                      {/* ดูตัวอย่าง pill — เปิด modal preview */}
                      <button onClick={() => setPreviewArticle(a)}
                        className={`${font} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#af6f08]/10 text-[#af6f08] group-hover:bg-[#af6f08] group-hover:text-white cursor-pointer transition-all duration-200 self-start mt-auto text-[12px]`} style={{ fontWeight: 500 }}>
                        <Eye className="size-3.5" strokeWidth={2.2} />
                        ดูตัวอย่าง
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
              <div className="relative">
                <select className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                  value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า · ทั้งหมด {filtered.length} รายการ</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === n ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: safePage === n ? 600 : 400 }}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <ArticlePreviewModal article={previewArticle} onClose={() => setPreviewArticle(null)} />
    </div>
  );
}

/* ========== ARTICLE PREVIEW MODAL ========== */
function ArticlePreviewModal({ article, onClose }: { article: Article | null; onClose: () => void }) {
  // Lock body scroll
  React.useEffect(() => {
    if (!article) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [article]);

  // Esc to close
  React.useEffect(() => {
    if (!article) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [article, onClose]);

  if (!article) return null;

  const sColor = articleStatusColors[article.status];
  const fmtFull = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[20px] w-full max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]">
          {/* Top bar — preview label + close */}
          <div className="bg-[#fafafa] border-b border-gray-100 flex items-center justify-between px-5 py-3 shrink-0">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-[#319754]" strokeWidth={2.4} />
              <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>ดูตัวอย่างบทความ</p>
              <span className={`${font} text-[11px] text-gray-400 tabular-nums`}>· {article.id}</span>
            </div>
            <button onClick={onClose}
              className="size-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer transition-colors">
              <X className="size-4 text-gray-600" strokeWidth={2.4} />
            </button>
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto flex-1">
            {/* Hero image */}
            <div className="relative w-full aspect-[16/8] overflow-hidden bg-gray-100">
              <ImageWithFallback src={article.image} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
              {/* Featured ribbon */}
              {article.tag === "featured" && (
                <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-[#ff9500] text-white px-3 py-1.5 rounded-full shadow-[0_2px_8px_rgba(255,149,0,0.4)]">
                  <Star className="size-3.5" strokeWidth={2.2} fill="white" />
                  <span className={`${font} text-[12px]`} style={{ fontWeight: 600 }}>บทความแนะนำ</span>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="px-6 sm:px-8 py-6 flex flex-col gap-4">
              {/* Tag + Status */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`${font} inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-full text-[11px]`}
                  style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 600 }}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                  {articleStatusLabels[article.status]}
                </span>
                <span className={`${font} text-[11px] text-gray-400 tabular-nums`}>· {article.id}</span>
              </div>

              {/* Title */}
              <h1 className={`${font} text-[24px] sm:text-[28px] text-black leading-tight`} style={{ fontWeight: 700 }}>
                {article.title}
              </h1>

              {/* Meta: date + views */}
              <div className="flex items-center gap-4 flex-wrap text-[12px] text-gray-500">
                <span className={`${font} inline-flex items-center gap-1.5`}>
                  <CalendarIcon className="size-3.5" strokeWidth={2.2} />
                  {article.publishedAt ? fmtFull(article.publishedAt) : "ยังไม่ลงเนื้อหา"}
                </span>
                <span className={`${font} inline-flex items-center gap-1.5 tabular-nums`}>
                  <Eye className="size-3.5" strokeWidth={2.2} />
                  {article.views.toLocaleString()} ครั้ง
                </span>
              </div>

              <div className="h-px bg-gray-100" />

              {/* Description (body) */}
              <p className={`${font} text-[15px] text-gray-700 leading-[1.8]`}>{article.description}</p>

              {/* Sample body content (Lorem-style — เพราะ mock มีแค่ description) */}
              <p className={`${font} text-[14px] text-gray-600 leading-[1.8]`}>
                ขมิ้นชัน (Curcuma longa) เป็นพืชสมุนไพรในตระกูลขิง มีถิ่นกำเนิดในเอเชียตะวันออกเฉียงใต้ ได้รับการใช้เป็นยา-เครื่องเทศ-สีย้อมมาเป็นเวลานานกว่า 4,000 ปี สาร <em>เคอร์คูมิน (Curcumin)</em> ในขมิ้นชัน เป็นสารต้านอนุมูลอิสระและต้านการอักเสบที่มีงานวิจัยรองรับมากที่สุด
              </p>
              <p className={`${font} text-[14px] text-gray-600 leading-[1.8]`}>
                การศึกษาทางคลินิกหลายชิ้นพบว่า การรับประทานสารสกัดขมิ้นชันต่อเนื่อง 2-3 เดือน ช่วยลดระดับเอนไซม์ตับ (ALT, AST) ในผู้ป่วยที่มีภาวะไขมันพอกตับโดยไม่ใช่จากแอลกอฮอล์ และยังมีฤทธิ์ป้องกันการทำลายเซลล์ตับจากสารพิษได้อีกด้วย
              </p>

              {/* Note */}
              <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-4 flex items-start gap-3 mt-2">
                <AlertCircle className="size-4 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2.2} />
                <div>
                  <p className={`${font} text-[12px] text-[#9a3412]`} style={{ fontWeight: 600 }}>ตัวอย่างเนื้อหา (Mock)</p>
                  <p className={`${font} text-[11px] text-gray-600 mt-0.5 leading-relaxed`}>
                    ระบบยังไม่ได้เชื่อมต่อ rich text editor — ส่วนเนื้อหาด้านบนเป็นข้อความตัวอย่าง ใช้ดูเฉพาะรูปแบบและหน้าตา
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#fafafa] border-t border-gray-100 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
            <p className={`${font} text-[11px] text-gray-500`}>กด Esc เพื่อปิด</p>
            <button onClick={onClose}
              className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[34px] rounded-full cursor-pointer transition-colors`}
              style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
              ปิด
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ========== ADD / EDIT ARTICLE VIEW ========== */
function CoverImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  React.useEffect(() => {
    const reset = () => setIsDragOver(false);
    document.addEventListener("dragend", reset);
    document.addEventListener("drop", reset);
    return () => {
      document.removeEventListener("dragend", reset);
      document.removeEventListener("drop", reset);
    };
  }, []);

  const readFile = (file: File) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) {
      toast.error("รองรับเฉพาะ JPEG / PNG / WebP / GIF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("ไฟล์ใหญ่เกิน 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload  = () => { onChange(reader.result as string); toast.success("เพิ่มภาพหน้าปกแล้ว"); };
    reader.onerror = () => toast.error("อ่านไฟล์ไม่สำเร็จ");
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (file) readFile(file);
  };
  const openPicker = () => fileInputRef.current?.click();

  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      className="group/cover relative w-full h-[260px] sm:h-[360px] lg:h-[450px] rounded-[16px] overflow-hidden bg-[#d9d9d9]">
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange} className="hidden" />

      {/* Wireframe background (เมื่อยังไม่มีภาพ) */}
      {!value && (
        <div className="absolute inset-0 rounded-[16px] border-2 border-dashed transition-colors pointer-events-none"
          style={{
            borderColor: isDragOver ? ADMIN_PRIMARY : "#d4d4d8",
            backgroundColor: isDragOver ? `${ADMIN_PRIMARY}08` : "#fafafa",
            backgroundImage: "repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,0.015) 10px 11px)",
            borderStyle: isDragOver ? "solid" : "dashed",
          }} />
      )}

      {value ? (
        <>
          <ImageWithFallback src={value} alt="cover" className="absolute inset-0 w-full h-full object-cover" />
          {/* Hover toolbar */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent z-10 pointer-events-none rounded-b-[16px] opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200" />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-stretch bg-black/70 backdrop-blur-md rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.25)] opacity-0 translate-y-1 group-hover/cover:opacity-100 group-hover/cover:translate-y-0 transition-all duration-200">
            <button onClick={openPicker}
              className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer hover:bg-white/10 transition-colors">
              <Pencil className="size-3.5 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[12px] text-white`} style={{ fontWeight: 500 }}>เปลี่ยน</span>
            </button>
            <div className="w-px bg-white/20" />
            <button onClick={() => { onChange(""); toast.success("ลบภาพหน้าปกแล้ว"); }}
              className="flex items-center gap-1.5 px-3.5 py-2 cursor-pointer hover:bg-[#ff3b30]/40 transition-colors">
              <Trash2 className="size-3.5 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[12px] text-white`} style={{ fontWeight: 500 }}>ลบ</span>
            </button>
          </div>
        </>
      ) : (
        <button onClick={openPicker} className="absolute inset-0 flex flex-col items-center justify-center gap-2 cursor-pointer">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="size-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
            <ImageIcon className="size-5" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          </motion.div>
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <span className={`${font} text-[13px]`} style={{ color: ADMIN_PRIMARY, fontWeight: 600 }}>
              {isDragOver ? "วางไฟล์ที่นี่" : "เพิ่มภาพหน้าปก"}
            </span>
            <span className={`${font} text-[11px] text-gray-400 tabular-nums`}>1192 × 450 px · ≈ 2.6 : 1</span>
            <span className={`${font} text-[10px] text-gray-400`}>JPEG / PNG / WebP · ≤ 5MB · ลากไฟล์มาวางได้</span>
          </div>
        </button>
      )}
    </div>
  );
}

/* ========== RICH TEXT EDITOR ========== */
const RTE_TEXT_COLORS = [
  "#000000", "#525252", "#737373", "#a3a3a3",
  "#ef4444", "#f97316", "#f59e0b", "#eab308",
  "#22c55e", "#319754", "#0088ff", "#3b82f6",
  "#8b5cf6", "#9747ff", "#ec4899", "#f43f5e",
];
const RTE_HIGHLIGHT_COLORS = [
  "transparent", "#fef3c7", "#fde68a", "#fed7aa",
  "#fecaca", "#fbcfe8", "#e9d5ff", "#ddd6fe",
  "#bfdbfe", "#a5f3fc", "#bbf7d0", "#d6eadd",
];
const RTE_FONT_SIZES = [
  { label: "เล็กมาก", value: "1", px: "10px" },
  { label: "เล็ก",     value: "2", px: "13px" },
  { label: "ปกติ",     value: "3", px: "16px" },
  { label: "กลาง",     value: "4", px: "18px" },
  { label: "ใหญ่",     value: "5", px: "24px" },
  { label: "ใหญ่มาก", value: "6", px: "32px" },
  { label: "ใหญ่สุด", value: "7", px: "48px" },
];

function RTEButton({ active, title, onClick, children, disabled }: {
  active?: boolean; title: string; onClick: () => void; children: React.ReactNode; disabled?: boolean;
}) {
  return (
    <button title={title} disabled={disabled}
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick(); }}
      className={`size-8 rounded-lg flex items-center justify-center transition-colors shrink-0
        ${disabled ? "opacity-40 cursor-not-allowed text-gray-400" : "cursor-pointer"}
        ${active
          ? "bg-[#319754]/12 text-[#319754]"
          : "text-gray-600 hover:bg-white hover:text-gray-800"}`}>
      {children}
    </button>
  );
}

// Visual group wrapper — pill background with subtle inner spacing
function RTEGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-50 rounded-xl p-0.5 shrink-0 border border-gray-100">
      {children}
    </div>
  );
}

const STYLE_OPTIONS: { value: string; label: string; preview: string; previewSize: string; tag: string }[] = [
  { value: "p",          label: "ข้อความปกติ",   preview: "ข้อความปกติ",   previewSize: "15px", tag: "<p>" },
  { value: "h1",         label: "หัวเรื่อง 1",     preview: "หัวเรื่อง 1",     previewSize: "22px", tag: "<h1>" },
  { value: "h2",         label: "หัวเรื่อง 2",     preview: "หัวเรื่อง 2",     previewSize: "18px", tag: "<h2>" },
  { value: "h3",         label: "หัวเรื่อง 3",     preview: "หัวเรื่อง 3",     previewSize: "16px", tag: "<h3>" },
  { value: "blockquote", label: "อ้างอิง",          preview: "ข้อความอ้างอิง", previewSize: "14px", tag: "<blockquote>" },
];

function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editorRef = React.useRef<HTMLDivElement>(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkUrl, setLinkUrl]   = useState("");
  const [styleOpen, setStyleOpen] = useState(false);
  // Track most-recent text & highlight color (for swatch indicator)
  const [recentText, setRecentText]           = useState("#000000");
  const [recentHighlight, setRecentHighlight] = useState("#fde68a");
  const savedRange = React.useRef<Range | null>(null);
  const [, setTick] = useState(0);
  const refresh = () => setTick((n) => n + 1);

  // Set initial content
  React.useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== (value || "")) {
      editorRef.current.innerHTML = value || "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const exec = (cmd: string, val?: string) => {
    editorRef.current?.focus();
    if (savedRange.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedRange.current);
    }
    document.execCommand(cmd, false, val);
    onChange(editorRef.current?.innerHTML || "");
    refresh();
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedRange.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const handleInput = () => {
    onChange(editorRef.current?.innerHTML || "");
    refresh();
  };

  // Helpers
  const isCmd = (cmd: string) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };
  const blockTag = (): string => {
    try { return (document.queryCommandValue("formatBlock") || "p").toLowerCase().replace(/[<>]/g, ""); }
    catch { return "p"; }
  };

  const setStyle = (val: string) => {
    if (val === "blockquote") exec("formatBlock", "<blockquote>");
    else exec("formatBlock", `<${val}>`);
    setStyleOpen(false);
  };

  const insertLink = () => {
    if (!linkUrl) { setLinkOpen(false); return; }
    const url = /^https?:\/\//i.test(linkUrl) ? linkUrl : `https://${linkUrl}`;
    exec("createLink", url);
    if (editorRef.current) {
      editorRef.current.querySelectorAll('a[href="' + url + '"]').forEach((a) => {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      });
      onChange(editorRef.current.innerHTML);
    }
    setLinkUrl("");
    setLinkOpen(false);
  };
  const removeLink = () => exec("unlink");

  const blk = blockTag();
  const currentStyle = STYLE_OPTIONS.find((s) => s.value === blk) || STYLE_OPTIONS[0];

  // Word & character count
  const plainText = (editorRef.current?.innerText || "").trim();
  const charCount = plainText.length;
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;

  return (
    <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white focus-within:border-[#319754] focus-within:shadow-[0_0_0_3px_rgba(49,151,84,0.08)] transition-all">
      {/* Toolbar — sticky inside editor + grouped pills */}
      <div className="bg-white border-b border-gray-100 px-2 py-2 flex items-center gap-1.5 flex-wrap sticky top-0 z-10"
        onMouseDown={() => saveSelection()}>

        {/* GROUP: Undo/Redo */}
        <RTEGroup>
          <RTEButton title="ย้อนกลับ (Ctrl+Z)" onClick={() => exec("undo")}><Undo2 className="size-4" strokeWidth={2.2} /></RTEButton>
          <RTEButton title="ทำซ้ำ (Ctrl+Y)"   onClick={() => exec("redo")}><Redo2 className="size-4" strokeWidth={2.2} /></RTEButton>
        </RTEGroup>

        {/* GROUP: Style + Font size */}
        <RTEGroup>
          {/* Style dropdown */}
          <Popover open={styleOpen} onOpenChange={(o) => { if (o) saveSelection(); setStyleOpen(o); }}>
            <PopoverTrigger asChild>
              <button title="รูปแบบย่อหน้า"
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                className={`${font} h-8 px-2.5 rounded-lg flex items-center gap-1.5 cursor-pointer hover:bg-white hover:text-gray-800 text-gray-600 transition-colors data-[state=open]:bg-[#319754]/12 data-[state=open]:text-[#319754] shrink-0 text-[12px]`}
                style={{ fontWeight: 500 }}>
                <span className="min-w-[78px] text-left truncate">{currentStyle.label}</span>
                <ChevronDown className="size-3" strokeWidth={2.4} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={6}
              className="w-[200px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
              {STYLE_OPTIONS.map((s) => (
                <button key={s.value}
                  onMouseDown={(e) => { e.preventDefault(); setStyle(s.value); }}
                  className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl cursor-pointer transition-colors text-left
                    ${blk === s.value ? "bg-[#319754]/10 text-[#319754]" : "hover:bg-gray-50 text-black"}`}>
                  <span style={{ fontSize: s.previewSize, fontWeight: s.value === "p" ? 400 : 600 }}>{s.preview}</span>
                  {blk === s.value && <Check className="size-3.5 text-[#319754]" strokeWidth={2.6} />}
                </button>
              ))}
            </PopoverContent>
          </Popover>

          {/* Font size */}
          <Popover>
            <PopoverTrigger asChild>
              <button title="ขนาดตัวอักษร"
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                className="h-8 px-2 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-white hover:text-gray-800 text-gray-600 transition-colors data-[state=open]:bg-[#319754]/12 data-[state=open]:text-[#319754] shrink-0">
                <Type className="size-4" strokeWidth={2.2} />
                <ChevronDown className="size-3" strokeWidth={2.4} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={6}
              className="w-[180px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
              {RTE_FONT_SIZES.map((s) => (
                <button key={s.value}
                  onMouseDown={(e) => { e.preventDefault(); exec("fontSize", s.value); }}
                  className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-black`}>
                  <span style={{ fontSize: s.px, fontWeight: 500 }}>{s.label}</span>
                  <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{s.px}</span>
                </button>
              ))}
            </PopoverContent>
          </Popover>
        </RTEGroup>

        {/* GROUP: B/I/U/S */}
        <RTEGroup>
          <RTEButton active={isCmd("bold")}          title="หนา (Ctrl+B)"        onClick={() => exec("bold")}><Bold className="size-4" strokeWidth={2.4} /></RTEButton>
          <RTEButton active={isCmd("italic")}        title="เอียง (Ctrl+I)"     onClick={() => exec("italic")}><Italic className="size-4" strokeWidth={2.4} /></RTEButton>
          <RTEButton active={isCmd("underline")}     title="ขีดเส้นใต้ (Ctrl+U)" onClick={() => exec("underline")}><Underline className="size-4" strokeWidth={2.4} /></RTEButton>
          <RTEButton active={isCmd("strikeThrough")} title="ขีดทับ"             onClick={() => exec("strikeThrough")}><Strikethrough className="size-4" strokeWidth={2.4} /></RTEButton>
        </RTEGroup>

        {/* GROUP: Color + Highlight (with current swatch indicator) */}
        <RTEGroup>
          {/* Text color */}
          <Popover>
            <PopoverTrigger asChild>
              <button title="สีตัวอักษร"
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                className="size-8 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-white hover:text-gray-800 text-gray-600 transition-colors data-[state=open]:bg-[#319754]/12 data-[state=open]:text-[#319754] shrink-0 px-1.5">
                <Palette className="size-3.5" strokeWidth={2.2} />
                <span className="block w-full h-[3px] rounded-sm" style={{ backgroundColor: recentText }} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={6}
              className="w-auto p-3 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
              <p className={`${font} text-[11px] text-gray-500 mb-2`} style={{ fontWeight: 600 }}>สีตัวอักษร</p>
              <div className="grid grid-cols-8 gap-1.5">
                {RTE_TEXT_COLORS.map((c) => (
                  <button key={c} title={c}
                    onMouseDown={(e) => { e.preventDefault(); exec("foreColor", c); setRecentText(c); }}
                    className={`size-6 rounded-md cursor-pointer hover:scale-110 transition-transform border ${recentText === c ? "border-[#319754] ring-2 ring-[#319754]/30" : "border-gray-200"}`}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Highlight */}
          <Popover>
            <PopoverTrigger asChild>
              <button title="ไฮไลต์ข้อความ"
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                className="size-8 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer hover:bg-white hover:text-gray-800 text-gray-600 transition-colors data-[state=open]:bg-[#319754]/12 data-[state=open]:text-[#319754] shrink-0 px-1.5">
                <Highlighter className="size-3.5" strokeWidth={2.2} />
                <span className="block w-full h-[3px] rounded-sm border border-gray-200" style={{ backgroundColor: recentHighlight }} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={6}
              className="w-auto p-3 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
              <p className={`${font} text-[11px] text-gray-500 mb-2`} style={{ fontWeight: 600 }}>ไฮไลต์ข้อความ</p>
              <div className="grid grid-cols-6 gap-1.5">
                {RTE_HIGHLIGHT_COLORS.map((c) => (
                  <button key={c} title={c === "transparent" ? "ลบไฮไลต์" : c}
                    onMouseDown={(e) => { e.preventDefault(); exec("hiliteColor", c === "transparent" ? "transparent" : c); if (c !== "transparent") setRecentHighlight(c); }}
                    className={`size-7 rounded-md cursor-pointer hover:scale-110 transition-transform border relative overflow-hidden ${recentHighlight === c ? "border-[#319754] ring-2 ring-[#319754]/30" : "border-gray-200"}`}
                    style={{ backgroundColor: c === "transparent" ? "white" : c }}>
                    {c === "transparent" && <span className="absolute inset-0 bg-[linear-gradient(135deg,transparent_45%,#ef4444_45%,#ef4444_55%,transparent_55%)]" />}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </RTEGroup>

        {/* GROUP: Alignment */}
        <RTEGroup>
          <RTEButton active={isCmd("justifyLeft")}    title="ชิดซ้าย"   onClick={() => exec("justifyLeft")}><AlignLeft className="size-4" strokeWidth={2.2} /></RTEButton>
          <RTEButton active={isCmd("justifyCenter")}  title="กึ่งกลาง"  onClick={() => exec("justifyCenter")}><AlignCenter className="size-4" strokeWidth={2.2} /></RTEButton>
          <RTEButton active={isCmd("justifyRight")}   title="ชิดขวา"    onClick={() => exec("justifyRight")}><AlignRight className="size-4" strokeWidth={2.2} /></RTEButton>
          <RTEButton active={isCmd("justifyFull")}    title="เต็มแนว"   onClick={() => exec("justifyFull")}><AlignJustify className="size-4" strokeWidth={2.2} /></RTEButton>
        </RTEGroup>

        {/* GROUP: Lists + Link */}
        <RTEGroup>
          <RTEButton active={isCmd("insertUnorderedList")} title="รายการจุด"  onClick={() => exec("insertUnorderedList")}><List className="size-4" strokeWidth={2.2} /></RTEButton>
          <RTEButton active={isCmd("insertOrderedList")}   title="รายการเลข" onClick={() => exec("insertOrderedList")}><ListOrdered className="size-4" strokeWidth={2.2} /></RTEButton>

          {/* Link */}
          <Popover open={linkOpen} onOpenChange={(o) => { if (o) saveSelection(); setLinkOpen(o); }}>
            <PopoverTrigger asChild>
              <button title="แทรกลิงก์"
                onMouseDown={(e) => { e.preventDefault(); saveSelection(); }}
                className="size-8 rounded-lg flex items-center justify-center cursor-pointer hover:bg-white hover:text-gray-800 text-gray-600 transition-colors data-[state=open]:bg-[#319754]/12 data-[state=open]:text-[#319754] shrink-0">
                <LinkIcon className="size-4" strokeWidth={2.2} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" sideOffset={6}
              className="w-[300px] p-3 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
              <p className={`${font} text-[11px] text-gray-500 mb-2`} style={{ fontWeight: 600 }}>แทรกลิงก์ที่เลือก</p>
              <div className="flex items-center gap-1.5">
                <input value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insertLink(); } }}
                  placeholder="https://..."
                  className={`${font} flex-1 bg-[#fafafa] h-9 rounded-full px-3 text-[12px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`} />
                <button onMouseDown={(e) => { e.preventDefault(); insertLink(); }}
                  className={`${font} text-[12px] text-white px-3 h-9 rounded-full cursor-pointer shrink-0`}
                  style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 600 }}>ใส่</button>
              </div>
              <button onMouseDown={(e) => { e.preventDefault(); removeLink(); setLinkOpen(false); }}
                className={`${font} text-[11px] text-gray-500 hover:text-[#ff3b30] cursor-pointer mt-2`}>ลบลิงก์ออก</button>
            </PopoverContent>
          </Popover>
        </RTEGroup>

        {/* Push to right */}
        <div className="flex-1" />

        {/* Clear formatting */}
        <RTEGroup>
          <RTEButton title="ล้างฟอร์แมตทั้งหมด" onClick={() => exec("removeFormat")}><RemoveFormatting className="size-4" strokeWidth={2.2} /></RTEButton>
        </RTEGroup>
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={refresh}
        onMouseUp={() => { saveSelection(); refresh(); }}
        onBlur={saveSelection}
        className={`${font} rte-content min-h-[360px] max-h-[640px] overflow-y-auto px-7 py-6 text-[15px] outline-none leading-[1.85] text-black bg-white`}
        style={{ fontWeight: 400 }}
        data-placeholder="เริ่มเขียนเนื้อหาบทความที่นี่..."
      />

      {/* Footer — word/character count + tip */}
      <div className="bg-[#fafafa] border-t border-gray-100 px-4 py-2 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <span className={`${font} text-[11px] text-gray-500 inline-flex items-center gap-1.5`}>
            <FileText className="size-3 text-gray-400" strokeWidth={2.4} />
            <span className="tabular-nums" style={{ fontWeight: 600 }}>{wordCount}</span> คำ
            <span className="text-gray-300">·</span>
            <span className="tabular-nums" style={{ fontWeight: 600 }}>{charCount}</span> ตัวอักษร
          </span>
        </div>
        <span className={`${font} text-[10px] text-gray-400 inline-flex items-center gap-1.5`}>
          <Info className="size-3 text-gray-400" strokeWidth={2.4} />
          เลือกข้อความก่อนใช้ปุ่มจัดรูปแบบ · ใช้ Ctrl+B / I / U ได้
        </span>
      </div>

      <style>{`
        .rte-content:empty:before {
          content: attr(data-placeholder);
          color: #a3a3a3;
          pointer-events: none;
        }
        .rte-content:focus { outline: none; }
        .rte-content h1 { font-size: 28px; font-weight: 700; margin: 18px 0 10px; line-height: 1.3; }
        .rte-content h2 { font-size: 22px; font-weight: 700; margin: 16px 0 8px;  line-height: 1.35; }
        .rte-content h3 { font-size: 18px; font-weight: 600; margin: 14px 0 6px;  line-height: 1.4; }
        .rte-content p  { margin: 8px 0; }
        .rte-content ul { list-style: disc; padding-left: 28px; margin: 10px 0; }
        .rte-content ol { list-style: decimal; padding-left: 28px; margin: 10px 0; }
        .rte-content li { margin: 4px 0; }
        .rte-content blockquote {
          border-left: 4px solid #319754; padding: 8px 16px; margin: 12px 0;
          background: rgba(49,151,84,0.06); border-radius: 0 10px 10px 0; color: #404040; font-style: italic;
        }
        .rte-content a { color: #0088ff; text-decoration: underline; text-underline-offset: 2px; }
        .rte-content a:hover { color: #319754; }
        /* Custom scrollbar */
        .rte-content::-webkit-scrollbar { width: 8px; }
        .rte-content::-webkit-scrollbar-track { background: transparent; }
        .rte-content::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 4px; }
        .rte-content::-webkit-scrollbar-thumb:hover { background: #d4d4d4; }
      `}</style>
    </div>
  );
}

/* ========== AI CONTENT GENERATOR ========== */
type AITone   = "professional" | "friendly" | "concise" | "persuasive";
type AILength = "short" | "medium" | "long";

const TONES: { id: AITone; label: string; desc: string; emoji: string }[] = [
  { id: "professional", label: "มืออาชีพ",   desc: "ภาษาทางการ น่าเชื่อถือ",   emoji: "🎓" },
  { id: "friendly",     label: "เป็นกันเอง", desc: "อ่านง่าย เหมือนคุยกับเพื่อน", emoji: "💬" },
  { id: "concise",      label: "กระชับ",     desc: "สั้น ตรงประเด็น",            emoji: "⚡" },
  { id: "persuasive",   label: "โน้มน้าว",   desc: "ดึงดูด มี call-to-action",    emoji: "🎯" },
];

const LENGTHS: { id: AILength; label: string; desc: string; sections: number }[] = [
  { id: "short",  label: "สั้น",  desc: "ประมาณ 150-250 คำ",  sections: 2 },
  { id: "medium", label: "กลาง", desc: "ประมาณ 300-500 คำ",  sections: 3 },
  { id: "long",   label: "ยาว",  desc: "ประมาณ 600-900 คำ",  sections: 5 },
];

// Mock generator — สังเคราะห์ HTML article จาก topic + brief + tone + length
function mockGenerateArticle(opts: { topic: string; brief: string; tone: AITone; length: AILength }): string {
  const { topic, brief, tone, length } = opts;
  const lengthCfg = LENGTHS.find((l) => l.id === length)!;

  const intro: Record<AITone, string> = {
    professional: `บทความนี้ได้รวบรวมข้อมูลและงานวิจัยเกี่ยวกับ <strong>${topic || "หัวข้อนี้"}</strong> เพื่อให้ผู้อ่านเข้าใจสาระสำคัญอย่างครบถ้วน`,
    friendly:     `สวัสดีครับ! วันนี้เรามาพูดคุยเรื่อง <strong>${topic || "หัวข้อที่น่าสนใจ"}</strong> กัน รับรองว่าอ่านสนุกและได้ความรู้แน่นอน`,
    concise:      `<strong>${topic || "หัวข้อนี้"}</strong> — ทุกอย่างที่ควรรู้ในที่เดียว`,
    persuasive:   `คุณรู้หรือไม่ว่า <strong>${topic || "เรื่องนี้"}</strong> สามารถเปลี่ยนวิถีการดูแลสุขภาพของคุณได้ตั้งแต่วันนี้?`,
  };

  const sections = [
    { h: "ความสำคัญและที่มา",
      p: `${brief ? `${brief} — ` : ""}เรื่องนี้ได้รับความสนใจจากทั้งวงการแพทย์แผนไทยและงานวิจัยสมัยใหม่ เนื่องจากมีหลักฐานสนับสนุนถึงประสิทธิภาพและความปลอดภัยในการใช้งาน`,
      list: null as string[] | null },
    { h: "ประโยชน์หลักที่ควรรู้",
      p: `จากการศึกษาและประสบการณ์การใช้จริง พบว่า${topic ? topic : "สิ่งนี้"}มีประโยชน์ต่อร่างกายในหลายด้าน ดังนี้`,
      list: [
        "ช่วยเสริมสร้างภูมิคุ้มกันและต้านอนุมูลอิสระ",
        "บรรเทาอาการอักเสบและช่วยให้ร่างกายฟื้นตัวเร็วขึ้น",
        "ส่งเสริมระบบการทำงานของร่างกายให้สมดุล",
        "ปลอดภัยจากธรรมชาติ ใช้ได้ในระยะยาว",
      ],
    },
    { h: "วิธีการใช้และข้อควรระวัง",
      p: `เพื่อให้ได้ประโยชน์สูงสุด ควรใช้อย่างถูกวิธี โดยมีขั้นตอนแนะนำดังนี้`,
      list: [
        "ปรึกษาผู้เชี่ยวชาญก่อนเริ่มใช้ในกรณีมีโรคประจำตัว",
        "เริ่มจากปริมาณน้อยและสังเกตอาการ",
        "เก็บรักษาในที่แห้งและเย็น พ้นแสงแดดโดยตรง",
      ],
    },
    { h: "งานวิจัยและข้อมูลทางวิทยาศาสตร์",
      p: `ในช่วง 5 ปีที่ผ่านมา มีงานวิจัยตีพิมพ์กว่า 200 ฉบับที่เกี่ยวข้อง ผลการศึกษาส่วนใหญ่ยืนยันถึงประสิทธิภาพและสนับสนุนการใช้งานในชีวิตประจำวัน`,
      list: null,
    },
    { h: "คำแนะนำสำหรับผู้เริ่มต้น",
      p: `หากคุณเป็นมือใหม่ที่กำลังสนใจ${topic ? topic : "เรื่องนี้"} แนะนำให้เริ่มจากสิ่งง่ายๆ ก่อน แล้วค่อยๆ เพิ่มความซับซ้อนเมื่อคุ้นเคยแล้ว — ความสม่ำเสมอสำคัญกว่าความเข้มข้น`,
      list: null,
    },
  ];

  const closing: Record<AITone, string> = {
    professional: `จากข้อมูลทั้งหมดข้างต้น สรุปได้ว่า ${topic || "หัวข้อนี้"}เป็นเรื่องที่ควรให้ความสำคัญและศึกษาอย่างต่อเนื่องเพื่อประโยชน์สูงสุด`,
    friendly:     `เป็นไงบ้างครับ? หวังว่าบทความนี้จะมีประโยชน์กับทุกคน หากชอบเนื้อหาแบบนี้ อย่าลืมติดตามบทความใหม่ๆ ของเราด้วยนะ 😊`,
    concise:      `สรุป: ${topic || "เรื่องนี้"} = ดีต่อสุขภาพ + ใช้ง่าย + ปลอดภัย ลองเริ่มวันนี้!`,
    persuasive:   `อย่ารอช้า! เริ่มต้นดูแลสุขภาพด้วย${topic ? topic : "ทางเลือกธรรมชาติ"}ตั้งแต่วันนี้ — ร่างกายคุณจะขอบคุณในระยะยาว 🌿`,
  };

  // Compose article based on length
  const used = sections.slice(0, lengthCfg.sections);
  let html = "";
  html += `<h2>${topic || "บทความใหม่"}</h2>`;
  html += `<p>${intro[tone]}</p>`;

  used.forEach((s, i) => {
    html += `<h3>${s.h}</h3>`;
    html += `<p>${s.p}</p>`;
    if (s.list) {
      html += `<ul>${s.list.map((li) => `<li>${li}</li>`).join("")}</ul>`;
    }
    // Add a quote in the middle
    if (i === Math.floor(used.length / 2) && length !== "short") {
      html += `<blockquote>"การดูแลสุขภาพที่ดีที่สุด คือการเริ่มต้นจากสิ่งเล็กๆ ที่ทำได้ทุกวัน"</blockquote>`;
    }
  });

  html += `<h3>บทสรุป</h3>`;
  html += `<p>${closing[tone]}</p>`;

  return html;
}

function AIGenerateDialog({ open, onClose, defaultTopic, onGenerate }: {
  open: boolean;
  onClose: () => void;
  defaultTopic: string;
  onGenerate: (html: string) => void;
}) {
  const [topic, setTopic]     = useState(defaultTopic);
  const [brief, setBrief]     = useState("");
  const [tone, setTone]       = useState<AITone>("professional");
  const [length, setLength]   = useState<AILength>("medium");
  const [busy, setBusy]       = useState(false);

  // Sync defaultTopic when dialog re-opens
  React.useEffect(() => {
    if (open) {
      setTopic(defaultTopic);
      setBrief("");
      setBusy(false);
    }
  }, [open, defaultTopic]);

  // Lock body scroll + Esc
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, busy, onClose]);

  const handleGenerate = () => {
    if (!brief.trim() && !topic.trim()) {
      toast.error("กรุณาใส่หัวข้อหรือคำอธิบายอย่างน้อย 1 อย่าง");
      return;
    }
    setBusy(true);
    // Mock latency 1.4s
    setTimeout(() => {
      const html = mockGenerateArticle({ topic: topic.trim(), brief: brief.trim(), tone, length });
      onGenerate(html);
      toast.success("AI สร้างเนื้อหาเรียบร้อย");
      setBusy(false);
      onClose();
    }, 1400);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => { if (!busy) onClose(); }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[20px] w-full max-w-[560px] max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#319754]/10 to-[#9747ff]/10 border-b border-gray-100 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-gradient-to-br from-[#319754] to-[#9747ff] flex items-center justify-center shadow-[0_4px_14px_rgba(151,71,255,0.35)]">
                <Sparkles className="size-5 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 700 }}>สร้างเนื้อหาด้วย AI</p>
                <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>ใส่หัวข้อและบรรยายสั้นๆ AI จะเขียนบทความให้</p>
              </div>
            </div>
            <button onClick={onClose} disabled={busy}
              className={`size-8 rounded-full inline-flex items-center justify-center transition-colors ${busy ? "opacity-40 cursor-not-allowed" : "hover:bg-white/60 cursor-pointer"}`}>
              <X className="size-4 text-gray-600" strokeWidth={2.4} />
            </button>
          </div>

          {/* Form */}
          <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
            {/* Topic */}
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                หัวข้อบทความ <span className="text-gray-400">(ดึงจากชื่อบทความอัตโนมัติ)</span>
              </label>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} disabled={busy}
                placeholder="เช่น ขมิ้นชันกับสุขภาพตับ"
                className={`${font} bg-[#fafafa] h-11 rounded-full px-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                style={{ fontWeight: 500 }} />
            </div>

            {/* Brief */}
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                บรรยายโดยย่อ <span className="text-[#ff3b30]">*</span>
              </label>
              <textarea value={brief} onChange={(e) => setBrief(e.target.value)} disabled={busy}
                placeholder="เช่น อยากให้บทความเน้นประโยชน์ของขมิ้นต่อตับ มีงานวิจัยสนับสนุน และคำแนะนำการใช้สำหรับผู้เริ่มต้น"
                rows={4}
                className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none`}
                style={{ fontWeight: 500 }} />
              <p className={`${font} text-[10px] text-gray-400 pl-3 tabular-nums`}>{brief.length} ตัวอักษร · ยิ่งบรรยายชัด AI ก็เขียนได้ตรงประเด็น</p>
            </div>

            {/* Tone */}
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[12px] text-gray-500`}>โทนภาษา</label>
              <div className="grid grid-cols-2 gap-2">
                {TONES.map((t) => {
                  const active = tone === t.id;
                  return (
                    <button key={t.id} onClick={() => !busy && setTone(t.id)} disabled={busy}
                      className={`flex items-start gap-2 p-3 rounded-xl text-left cursor-pointer transition-all ${busy ? "opacity-50 cursor-not-allowed" : ""}
                        ${active ? "bg-[#319754]/10 border-2 border-[#319754]" : "bg-[#fafafa] border-2 border-transparent hover:border-gray-200"}`}>
                      <span className="text-[18px] shrink-0 leading-none">{t.emoji}</span>
                      <div className="min-w-0">
                        <p className={`${font} text-[12px] ${active ? "text-[#319754]" : "text-black"}`} style={{ fontWeight: 600 }}>{t.label}</p>
                        <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>{t.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Length */}
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[12px] text-gray-500`}>ความยาว</label>
              <div className="flex gap-2">
                {LENGTHS.map((l) => {
                  const active = length === l.id;
                  return (
                    <button key={l.id} onClick={() => !busy && setLength(l.id)} disabled={busy}
                      className={`flex-1 flex flex-col items-center gap-0.5 p-3 rounded-xl cursor-pointer transition-all ${busy ? "opacity-50 cursor-not-allowed" : ""}
                        ${active ? "bg-[#319754]/10 border-2 border-[#319754]" : "bg-[#fafafa] border-2 border-transparent hover:border-gray-200"}`}>
                      <span className={`${font} text-[13px] ${active ? "text-[#319754]" : "text-black"}`} style={{ fontWeight: 600 }}>{l.label}</span>
                      <span className={`${font} text-[10px] text-gray-500 tabular-nums`}>{l.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-[#fafafa] border-t border-gray-100 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
            <p className={`${font} text-[10px] text-gray-500 inline-flex items-center gap-1.5`}>
              <Info className="size-3 text-gray-400" strokeWidth={2.4} />
              AI จะแทนที่เนื้อหาเดิม
            </p>
            <div className="flex items-center gap-2">
              <button onClick={onClose} disabled={busy}
                className={`${font} inline-flex items-center gap-1.5 text-[12px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 h-[34px] rounded-full transition-colors ${busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{ fontWeight: 500 }}>
                ยกเลิก
              </button>
              <motion.button onClick={handleGenerate} disabled={busy}
                whileTap={busy ? undefined : { scale: 0.96 }} whileHover={busy ? undefined : { scale: 1.03 }}
                className={`${font} inline-flex items-center gap-2 text-[12px] text-white px-4 h-[34px] rounded-full transition-colors shadow-[0_4px_14px_rgba(151,71,255,0.35)] ${busy ? "cursor-not-allowed" : "cursor-pointer"}`}
                style={{ background: "linear-gradient(135deg, #319754 0%, #9747ff 100%)", fontWeight: 600 }}>
                {busy
                  ? (<><Loader2 className="size-3.5 animate-spin" strokeWidth={2.4} /> AI กำลังเขียน...</>)
                  : (<><Wand2 className="size-3.5" strokeWidth={2.4} /> สร้างเนื้อหา</>)}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function ArticleEditView({ initial, onSave, onCancel }: {
  initial: Article | null;
  onSave: (a: Article) => void;
  onCancel: () => void;
}) {
  const isEdit = !!initial;
  const [draft, setDraft] = useState<Article>(initial ?? {
    id:          `ART-${String(Date.now()).slice(-3).padStart(3, "0")}`,
    title:       "",
    description: "",
    image:       "",
    tag:         "general",
    status:      "published",
    views:       0,
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const [body, setBody]         = useState("");
  const [bodyVersion, setBodyVersion] = useState(0); // bump only on external content reset (AI)
  const [aiOpen, setAiOpen]     = useState(false);

  const handleAIGenerate = (html: string) => {
    setBody(html);
    setBodyVersion((v) => v + 1);
  };

  const update = <K extends keyof Article>(key: K, value: Article[K]) => setDraft((p) => ({ ...p, [key]: value }));

  const canSave = draft.title.trim().length > 0 && draft.image.trim().length > 0;

  const isPublished = draft.status === "published";
  const isFeatured  = draft.tag === "featured";
  const sColor = articleStatusColors[draft.status];

  return (
    <div>
      {/* Back button */}
      <div className="mb-5">
        <button onClick={onCancel}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{isEdit ? "แก้ไขบทความ" : "เพิ่มบทความใหม่"}</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>
            {isEdit ? `กำลังแก้ไข ${initial?.id}` : "กรอกข้อมูลบทความที่ต้องการเผยแพร่บนหน้าเว็บไซต์"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 h-[36px] rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            ยกเลิก
          </button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave({ ...draft, status: "unpublished" }); toast.success("บันทึกแบบร่างแล้ว"); }}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-5 h-[36px] rounded-full transition-colors ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ fontWeight: 500 }}>
            <FileText className="size-3.5" strokeWidth={2.4} />
            บันทึกแบบร่าง
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave(draft); toast.success(isEdit ? "บันทึกการแก้ไขแล้ว" : "เพิ่มบทความใหม่แล้ว"); }}
            className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Check className="size-4" strokeWidth={2.4} />
            บันทึก
          </motion.button>
        </div>
      </div>

      {/* 2-column layout: Main (ภาพ + เนื้อหา) | Sidebar (ข้อมูล + วันเผยแพร่ + การตั้งค่า) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">

        {/* ========== LEFT MAIN ========== */}
        <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">

          {/* SECTION 1: Cover image — แสดงขนาดจริงตามหน้ารายละเอียดบทความ */}
          <FormSection icon={ImageIcon} iconColor="#319754" title="ภาพหน้าปก"
            desc="ภาพหลักของบทความ — แสดงขนาดจริงตรงตามที่ปรากฏบนหน้ารายละเอียด">
            <div className="flex flex-col gap-2.5">
              <CoverImagePicker value={draft.image} onChange={(url) => update("image", url)} />
              <p className={`${font} text-[11px] text-gray-500 flex items-center gap-1.5`}>
                <Info className="size-3 text-gray-400" strokeWidth={2.4} />
                ขนาดจริง <span className="tabular-nums" style={{ fontWeight: 600, color: "#319754" }}>1192 × 450 px</span> (≈ 2.6 : 1) บน desktop · responsive ลงเป็น 360 / 260 บน tablet / mobile · JPEG / PNG / WebP ≤ 5MB
              </p>
            </div>
          </FormSection>

          {/* SECTION 3: Body content — RichTextEditor + AI generator */}
          <FormSection icon={Pencil} iconColor="#9747ff" title="เนื้อหาบทความ"
            desc="แต่งข้อความ จัดหน้า ใส่ลิงก์ ไฮไลต์ และเปลี่ยนสี/ขนาดตัวอักษรได้"
            action={
              <motion.button onClick={() => setAiOpen(true)}
                whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className={`${font} group relative inline-flex items-center gap-1.5 text-[12px] text-white pl-2.5 pr-3.5 h-8 rounded-full cursor-pointer overflow-hidden shadow-[0_4px_14px_rgba(151,71,255,0.3)]`}
                style={{ background: "linear-gradient(135deg, #319754 0%, #9747ff 100%)", fontWeight: 600 }}>
                <span className="size-5 rounded-full bg-white/25 inline-flex items-center justify-center">
                  <Sparkles className="size-3 text-white" strokeWidth={2.4} />
                </span>
                สร้างด้วย AI
              </motion.button>
            }>
            <RichTextEditor key={`rte-${bodyVersion}`} value={body} onChange={setBody} />
          </FormSection>
        </div>

        {/* ========== RIGHT SIDEBAR ========== */}
        <div className="lg:col-span-1 flex flex-col gap-5 min-w-0 lg:sticky lg:top-5">

          {/* SECTION 2: Info */}
          <FormSection icon={FileText} iconColor="#0088ff" title="ข้อมูลบทความ" desc="ชื่อเรื่องและคำอธิบายสั้น">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                  ชื่อบทความ <span className="text-[#ff3b30]">*</span>
                </label>
                <input value={draft.title} onChange={(e) => update("title", e.target.value)}
                  placeholder="เช่น 5 สมุนไพรช่วยลดความเครียด"
                  className={`${font} bg-[#fafafa] h-11 rounded-full px-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                  style={{ fontWeight: 500 }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[12px] text-gray-500`}>คำโปรย</label>
                <textarea value={draft.description} onChange={(e) => update("description", e.target.value)}
                  placeholder="สรุปสั้นๆ ที่จะแสดงในการ์ดบทความ"
                  rows={3}
                  className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none`}
                  style={{ fontWeight: 500 }} />
                <p className={`${font} text-[10px] text-gray-400 pl-3 tabular-nums`}>{draft.description.length} ตัวอักษร · แนะนำไม่เกิน 120</p>
              </div>
            </div>
          </FormSection>

          {/* SECTION 4: Schedule */}
          <FormSection icon={CalendarIcon} iconColor="#f59e0b" title="วันเผยแพร่" desc="วันที่จะแสดงเป็นวันลงบทความ">
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />
                วันที่เผยแพร่
              </label>
              <BannerDatePicker value={draft.publishedAt} onChange={(v) => update("publishedAt", v)} placeholder="เลือกวันเผยแพร่" />
            </div>
          </FormSection>

          {/* SECTION 5: Featured + Publish toggles */}
          <FormSection icon={Settings} iconColor="#ff9500" title="การตั้งค่าการแสดงผล" desc="บทความแนะนำและการเผยแพร่">
            <div className="flex flex-col gap-3">
              {/* Featured toggle */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#fafafa]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: isFeatured ? "#ff950022" : "#e5e5e5" }}>
                    <Star className="size-4"
                      style={{ color: isFeatured ? "#ff9500" : "#999" }}
                      strokeWidth={2.2}
                      fill={isFeatured ? "#ff9500" : "none"} />
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>บทความแนะนำ</p>
                    <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>{isFeatured ? "ปักหมุดเป็นบทความเด่น" : "บทความทั่วไป"}</p>
                  </div>
                </div>
                <MiniToggle enabled={isFeatured} onToggle={() => update("tag", isFeatured ? "general" : "featured")} />
              </div>

              {/* Publish toggle */}
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#fafafa]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: isPublished ? `${ADMIN_PRIMARY}1a` : "#e5e5e5" }}>
                    {isPublished
                      ? <Eye   className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
                      : <EyeOff className="size-4 text-gray-500" strokeWidth={2.2} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เผยแพร่บทความ</p>
                    <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>{isPublished ? "แสดงบนหน้าเว็บ" : "ซ่อนจากหน้าเว็บ"}</p>
                  </div>
                </div>
                <MiniToggle enabled={isPublished} onToggle={() => update("status", isPublished ? "unpublished" : "published")} />
              </div>

              {/* Effective status preview */}
              <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: `${sColor}33`, backgroundColor: `${sColor}0d` }}>
                <span className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white shadow-sm shrink-0" style={{ color: sColor }}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                  <span className={`${font} text-[11px]`} style={{ fontWeight: 700 }}>{articleStatusLabels[draft.status]}</span>
                </span>
                <p className={`${font} text-[10px] text-gray-600 leading-snug min-w-0`}>
                  {isPublished ? "พร้อมแสดงเมื่อกดบันทึก" : "เก็บไว้โดยไม่แสดงบนหน้าเว็บ"}
                </p>
              </div>
            </div>
          </FormSection>
        </div>

      </div>

      {/* AI generate dialog */}
      <AIGenerateDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        defaultTopic={draft.title}
        onGenerate={handleAIGenerate}
      />
    </div>
  );
}

/* ========== VIDEO MGMT ========== */
type VideoStatus = "published" | "unpublished";
type VideoSource = "youtube" | "tiktok" | "facebook" | "other";
type VideoTag    = "featured" | "general";

// Custom TikTok icon (lucide ไม่มี)
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43V8.62a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.84-.05Z" />
    </svg>
  );
}

// Per-source metadata
const sourceMeta: Record<VideoSource, { label: string; color: string; placeholder: string; example: string; Icon: any; isCustomIcon?: boolean }> = {
  youtube:  { label: "YouTube",  color: "#ff0000", placeholder: "https://www.youtube.com/watch?v=...",     example: "youtube.com/watch?v=…",    Icon: Youtube },
  tiktok:   { label: "TikTok",   color: "#000000", placeholder: "https://www.tiktok.com/@user/video/...",  example: "tiktok.com/@user/video/…", Icon: TikTokIcon, isCustomIcon: true },
  facebook: { label: "Facebook", color: "#1877f2", placeholder: "https://www.facebook.com/.../videos/...", example: "facebook.com/.../videos/…", Icon: Facebook },
  other:    { label: "อื่นๆ",     color: "#737373", placeholder: "https://...",                              example: "URL จากที่ใดก็ได้",          Icon: Globe },
};

// URL parsers
function extractTikTokId(url: string): string | null {
  if (!url) return null;
  const m = url.match(/(?:tiktok\.com\/(?:@[^/]+\/video|v|embed(?:\/v2)?)\/)(\d+)/i);
  return m ? m[1] : null;
}
function isFacebookVideoUrl(url: string): boolean {
  if (!url) return false;
  return /(?:^https?:\/\/)?(?:www\.|m\.|web\.)?(?:facebook\.com\/.+\/videos\/|facebook\.com\/watch\/?\?v=|fb\.watch\/)/i.test(url);
}
function isHttpUrl(url: string): boolean {
  if (!url) return false;
  try { const u = new URL(url); return u.protocol === "http:" || u.protocol === "https:"; }
  catch { return false; }
}

// Auto-thumbnail: ดึงภาพปกจาก URL ของแต่ละช่อง
// YouTube ใช้ ytimg ของจริง · ช่องอื่น mock ด้วย SVG data URL (เพราะต้องใช้ backend API จริง)
function makePlaceholderThumb(brandHex: string, label: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 518" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${brandHex}"/><stop offset="1" stop-color="#000" stop-opacity="0.55"/>
    </linearGradient></defs>
    <rect width="360" height="518" fill="url(#g)"/>
    <circle cx="180" cy="220" r="42" fill="#ffffff" fill-opacity="0.95"/>
    <polygon points="170,200 170,240 206,220" fill="${brandHex}"/>
    <text x="180" y="320" fill="#ffffff" font-size="22" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif" font-weight="700">${label}</text>
    <text x="180" y="350" fill="#ffffff" fill-opacity="0.7" font-size="12" text-anchor="middle" font-family="-apple-system,system-ui,sans-serif">Auto Thumbnail</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
function getAutoThumbnail(source: VideoSource, url: string): string | null {
  if (!url) return null;
  if (source === "youtube") {
    const id = extractYouTubeId(url);
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  }
  if (source === "tiktok") {
    return extractTikTokId(url) ? makePlaceholderThumb("#000000", "TikTok") : null;
  }
  if (source === "facebook") {
    return isFacebookVideoUrl(url) ? makePlaceholderThumb("#1877f2", "Facebook") : null;
  }
  if (source === "other") {
    return isHttpUrl(url) ? makePlaceholderThumb("#525252", "Video") : null;
  }
  return null;
}

// Build embed URL — null = ไม่ valid
function getVideoEmbedUrl(source: VideoSource, url: string): string | null {
  if (!url) return null;
  if (source === "youtube") {
    const id = extractYouTubeId(url);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  if (source === "tiktok") {
    const id = extractTikTokId(url);
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
  }
  if (source === "facebook") {
    if (!isFacebookVideoUrl(url)) return null;
    const clean = url.startsWith("http") ? url : `https://${url}`;
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=false&width=560`;
  }
  if (source === "other") {
    return isHttpUrl(url) ? url : null;
  }
  return null;
}

interface VideoItem {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  source: VideoSource;
  videoUrl: string;     // youtube ID หรือ data URL
  duration: string;     // "5:32"
  tag: VideoTag;
  status: VideoStatus;
  views: number;
  publishedAt: string;
}

const videoStatusLabels: Record<VideoStatus, string> = { published: "เผยแพร่", unpublished: "ไม่เผยแพร่" };
const videoStatusColors: Record<VideoStatus, string> = { published: "#319754", unpublished: "#737373" };

// Extract YouTube ID จาก URL (รองรับหลายรูปแบบ)
function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
const ytThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

const initialVideos: VideoItem[] = [
  { id: "VID-001", title: "ทำน้ำมันสมุนไพรทาแก้ปวดเมื่อย",      description: "สอนทำน้ำมันสมุนไพรสูตรโบราณ ใช้แก้ปวดเมื่อย ทำเองได้ที่บ้าน",  source: "youtube",  videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",                        thumbnail: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=640&q=80", duration: "5:32",  tag: "featured", status: "published",   views: 12480, publishedAt: "2026-04-22" },
  { id: "VID-002", title: "เปิดสวนน้ำผึ้งดอกลำไย จ.ลำพูน",       description: "พาเที่ยวสวนน้ำผึ้งดอกลำไย เรียนรู้วิธีเลี้ยงผึ้ง",                   source: "tiktok",   videoUrl: "https://www.tiktok.com/@nature/video/7234567890123456789",            thumbnail: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=640&q=80", duration: "0:58",  tag: "general",  status: "published",   views: 15230, publishedAt: "2026-04-18" },
  { id: "VID-003", title: "วิธีคั้นน้ำขิงสด บรรเทาหวัด",            description: "สูตรน้ำขิงสดบรรเทาหวัด ฉบับทำเองที่บ้าน",                            source: "youtube",  videoUrl: "https://www.youtube.com/watch?v=kJQP7kiw5Fk",                        thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=640&q=80", duration: "4:08",  tag: "general",  status: "published",   views: 9120,  publishedAt: "2026-04-12" },
  { id: "VID-004", title: "ชาคาโมมายล์ ผ่อนคลาย หลับสนิท",         description: "วิธีชงชาคาโมมายล์ให้ได้สรรพคุณเต็มที่ ช่วยคลายเครียด",         source: "facebook", videoUrl: "https://www.facebook.com/metaherb/videos/1234567890",                  thumbnail: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=640&q=80", duration: "6:45",  tag: "featured", status: "published",   views: 120340,publishedAt: "2026-03-28" },
  { id: "VID-005", title: "5 สูตรน้ำสมุนไพรผิวใส",                   description: "รวม 5 สูตรน้ำสมุนไพรช่วยให้ผิวใส กระจ่าง",                            source: "youtube",  videoUrl: "https://www.youtube.com/watch?v=fJ9rUzIMcZQ",                        thumbnail: "https://images.unsplash.com/photo-1556228852-80b6e5eeff06?w=640&q=80", duration: "10:22", tag: "general",  status: "published",   views: 25670, publishedAt: "2026-03-15" },
  { id: "VID-006", title: "ตำรับยาสมุนไพรไทยโบราณ",                description: "เปิดตำรายาแพทย์แผนไทย กับสมุนไพรประจำบ้าน",                       source: "tiktok",   videoUrl: "https://www.tiktok.com/@thaiherbs/video/7345678901234567890",          thumbnail: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=640&q=80", duration: "1:12",  tag: "general",  status: "published",   views: 99450, publishedAt: "2026-03-02" },
  { id: "VID-007", title: "ขมิ้นชัน — ของขวัญจากธรรมชาติ",        description: "พาชมการปลูกและสกัดขมิ้นชันคุณภาพ",                                       source: "youtube",  videoUrl: "https://www.youtube.com/watch?v=RB-RcX5DS5A",                        thumbnail: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=640&q=80", duration: "7:30",  tag: "featured", status: "unpublished", views: 0,     publishedAt: "" },
  { id: "VID-008", title: "ฟ้าทะลายโจร ต้นไม้ในตำนานไทย",          description: "เจาะลึกสรรพคุณฟ้าทะลายโจร ที่บ้านควรมีติดไว้",                          source: "other",    videoUrl: "https://vimeo.com/example/123456789",                                  thumbnail: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=640&q=80", duration: "9:44",  tag: "general",  status: "unpublished", views: 0,     publishedAt: "" },
];

function VideoContent() {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VideoStatus>("all");
  const [tagFilter, setTagFilter] = useState<"all" | VideoTag>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(42); // 6 cols × 7 rows
  const [previewVideo, setPreviewVideo] = useState<VideoItem | null>(null);
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  const startAdd  = () => { setEditingVideo(null); setView("edit"); };
  const startEdit = (v: VideoItem) => { setEditingVideo(v); setView("edit"); };
  const closeEdit = () => { setView("list"); setEditingVideo(null); };

  const saveVideo = (v: VideoItem) => {
    setVideos((prev) => editingVideo ? prev.map((x) => x.id === v.id ? v : x) : [v, ...prev]);
    closeEdit();
  };

  if (view === "edit") {
    return <VideoEditView initial={editingVideo} onSave={saveVideo} onCancel={closeEdit} />;
  }

  const statusTabs: { id: "all" | VideoStatus; label: string; count: number; Icon: any }[] = [
    { id: "all",         label: "ทั้งหมด",     count: videos.length,                                          Icon: Film },
    { id: "published",   label: "เผยแพร่",     count: videos.filter((v) => v.status === "published").length,   Icon: Eye },
    { id: "unpublished", label: "ไม่เผยแพร่", count: videos.filter((v) => v.status === "unpublished").length, Icon: EyeOff },
  ];

  const filtered = videos.filter((v) => {
    if (statusFilter !== "all" && v.status !== statusFilter) return false;
    if (tagFilter !== "all" && v.tag !== tagFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q) || v.id.toLowerCase().includes(q);
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Page header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>วิดีโอ</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดการวิดีโอที่แสดงในหน้าสาระความรู้</p>
        </div>
        <motion.button
          onClick={startAdd}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}>
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่มวิดีโอ</span>
        </motion.button>
      </div>

      {/* Filter pill */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
        <FilterTabPills tabs={statusTabs} active={statusFilter} onChange={(id) => { setStatusFilter(id); setPage(1); }} pillId="videoStatusPill" />
        {/* Tag filter — ซ่อนบนจอเล็ก */}
        <div className="hidden lg:block relative shrink-0">
          <Tag className="size-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
          <select value={tagFilter} onChange={(e) => { setTagFilter(e.target.value as any); setPage(1); }}
            className={`${font} text-[13px] appearance-none border border-gray-200 rounded-full pl-9 pr-9 h-[36px] bg-white cursor-pointer focus:outline-none focus:border-[#319754] hover:border-gray-300 transition-colors min-w-[140px]`}>
            <option value="all">ทุกแท็ก</option>
            <option value="featured">วิดีโอแนะนำ</option>
            <option value="general">ทั่วไป</option>
          </select>
          <ChevronDown className="size-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.4} />
        </div>
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
          <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="ค้นหาวิดีโอ..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Card grid — match ของ BlogPage (portrait 6 col) */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        {paged.length === 0 ? (
          <div className={`py-16 text-center ${font} text-[13px] text-gray-400`}>ไม่พบวิดีโอ</div>
        ) : (
          <div className="grid gap-[16px] justify-start"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 200px))" }}>
            {paged.map((v) => {
              const isUnpublished = v.status === "unpublished";
              return (
                <div key={v.id}
                  className="relative h-[180px] sm:h-[259px] rounded-[16px] overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                  {/* Thumbnail (เหมือน BlogPage) — มี grayscale ถ้าไม่เผยแพร่ */}
                  <ImageWithFallback src={v.thumbnail} alt={v.title}
                    className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${isUnpublished ? "grayscale opacity-60" : ""}`} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

                  {/* Center play icon — hover only */}
                  <button onClick={() => setPreviewVideo(v)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="size-12 rounded-full bg-white/95 inline-flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
                      <Play className="size-5 text-[#319754] translate-x-0.5" strokeWidth={2.4} fill="#319754" />
                    </span>
                  </button>

                  {/* Content overlay — เหมือน BlogPage 100% (views ซ้ายบน + title ล่าง) */}
                  <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                    {/* Views badge — match BlogPage */}
                    <div className="bg-black/50 flex items-center gap-1.5 px-3 py-1 rounded-full z-20">
                      <Eye className="size-3 text-white" />
                      <span className={`${font} text-[12px] text-white tabular-nums`}>{v.views.toLocaleString()}</span>
                    </div>
                    {/* Title pill bottom — match BlogPage */}
                    <div className="bg-black/50 rounded-full w-full z-20">
                      <div className="flex items-center justify-center gap-1.5 px-3 py-1">
                        {v.tag === "featured" && <Star className="size-3 text-[#ff9500] shrink-0" strokeWidth={2.4} fill="#ff9500" />}
                        {isUnpublished && <EyeOff className="size-3 text-gray-300 shrink-0" strokeWidth={2.4} />}
                        <span className={`${font} text-[12px] text-white truncate`} title={v.title}>{v.title}</span>
                      </div>
                    </div>
                  </div>

                  {/* === Admin chrome — โผล่เฉพาะตอน hover เท่านั้น === */}
                  {/* Action menu top-right (hover) */}
                  <div className="absolute top-2.5 right-2.5 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button onClick={(e) => e.stopPropagation()}
                          className="size-7 rounded-full inline-flex items-center justify-center bg-black/60 hover:bg-black/85 text-white transition-colors cursor-pointer backdrop-blur-md data-[state=open]:bg-[#319754] data-[state=open]:opacity-100">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={6}
                        className="w-[240px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                        <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                          style={{ transformOrigin: "top right" }} className="overflow-hidden">
                          {(() => {
                            const isPublished = v.status === "published";
                            const isFeatured  = v.tag === "featured";
                            const togglePublish = () => {
                              const next: VideoStatus = isPublished ? "unpublished" : "published";
                              setVideos((prev) => prev.map((x) => x.id === v.id ? { ...x, status: next } : x));
                              toast.success(next === "published" ? `เผยแพร่: ${v.title}` : `ไม่เผยแพร่: ${v.title}`);
                            };
                            const toggleFeatured = () => {
                              const next: VideoTag = isFeatured ? "general" : "featured";
                              setVideos((prev) => prev.map((x) => x.id === v.id ? { ...x, tag: next } : x));
                              toast.success(next === "featured" ? `เพิ่มเป็นวิดีโอแนะนำ: ${v.title}` : `ยกเลิกวิดีโอแนะนำ: ${v.title}`);
                            };
                            return (
                              <>
                                <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    {isPublished
                                      ? <Eye className="size-3.5 text-[#319754]" strokeWidth={2.2} />
                                      : <EyeOff className="size-3.5 text-gray-400" strokeWidth={2.2} />}
                                    <span className={`${font} text-[13px] text-black whitespace-nowrap`} style={{ fontWeight: 500 }}>เผยแพร่</span>
                                  </div>
                                  <MiniToggle enabled={isPublished} onToggle={togglePublish} />
                                </div>
                                <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    <Star className="size-3.5"
                                      style={{ color: isFeatured ? "#ff9500" : "#a3a3a3" }}
                                      strokeWidth={2.2}
                                      fill={isFeatured ? "#ff9500" : "none"} />
                                    <span className={`${font} text-[13px] text-black whitespace-nowrap`} style={{ fontWeight: 500 }}>วิดีโอแนะนำ</span>
                                  </div>
                                  <MiniToggle enabled={isFeatured} onToggle={toggleFeatured} />
                                </div>
                              </>
                            );
                          })()}
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={() => setPreviewVideo(v)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Play className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ดูตัวอย่าง</span>
                          </button>
                          <button onClick={() => startEdit(v)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>แก้ไข</span>
                          </button>
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={() => { if (confirm(`ลบ "${v.title}"?`)) { setVideos((prev) => prev.filter((x) => x.id !== v.id)); toast.success(`ลบ: ${v.title}`); } }}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                            <Trash2 className="size-3.5" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ลบ</span>
                          </button>
                        </motion.div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {/* Center play (hover) */}
                  <button onClick={() => setPreviewVideo(v)}
                    className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="size-12 rounded-full bg-white/95 inline-flex items-center justify-center shadow-[0_4px_14px_rgba(0,0,0,0.3)]">
                      <Play className="size-5 text-[#319754] translate-x-0.5" strokeWidth={2.4} fill="#319754" />
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
              <div className="relative">
                <select className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                  value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[12, 24, 42, 60, 84].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า · ทั้งหมด {filtered.length} รายการ</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === n ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: safePage === n ? 600 : 400 }}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <VideoPreviewModal video={previewVideo} onClose={() => setPreviewVideo(null)} />
    </div>
  );
}

/* ========== VIDEO PREVIEW MODAL ========== */
function VideoPreviewModal({ video, onClose }: { video: VideoItem | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!video) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [video, onClose]);

  if (!video) return null;

  const embedUrl = getVideoEmbedUrl(video.source, video.videoUrl);
  const sColor = videoStatusColors[video.status];
  const sm = sourceMeta[video.source];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[20px] w-full max-w-[860px] max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]">
          {/* Top bar */}
          <div className="bg-[#fafafa] border-b border-gray-100 flex items-center justify-between px-5 py-3 shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Play className="size-4 text-[#319754]" strokeWidth={2.4} fill="#319754" />
              <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{video.title}</p>
              <span className={`${font} text-[11px] text-gray-400 tabular-nums shrink-0`}>· {video.id}</span>
            </div>
            <button onClick={onClose}
              className="size-8 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer transition-colors shrink-0">
              <X className="size-4 text-gray-600" strokeWidth={2.4} />
            </button>
          </div>
          {/* Video player */}
          <div className="bg-black aspect-video relative">
            {embedUrl ? (
              <iframe className="absolute inset-0 w-full h-full"
                src={video.source === "youtube" ? `${embedUrl}?autoplay=1` : embedUrl}
                title={video.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white/70 p-6">
                <Film className="size-12" strokeWidth={1.6} />
                <p className={`${font} text-[13px] text-center`}>ไม่สามารถฝัง {sm.label} ได้ในแท็บนี้</p>
                {video.videoUrl && isHttpUrl(video.videoUrl) && (
                  <a href={video.videoUrl} target="_blank" rel="noopener noreferrer"
                    className={`${font} inline-flex items-center gap-1.5 bg-white text-black text-[12px] px-4 h-8 rounded-full cursor-pointer hover:bg-gray-100 transition-colors`}
                    style={{ fontWeight: 600 }}>
                    <ExternalLink className="size-3.5" strokeWidth={2.4} />
                    เปิดในแท็บใหม่
                  </a>
                )}
              </div>
            )}
          </div>
          {/* Body info */}
          <div className="overflow-y-auto px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${font} inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-0.5 rounded-full text-[11px]`}
                style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 600 }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                {videoStatusLabels[video.status]}
              </span>
              {video.tag === "featured" && (
                <span className={`${font} inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] bg-[#ff9500]/15 text-[#ff9500]`} style={{ fontWeight: 600 }}>
                  <Star className="size-3" strokeWidth={2.2} fill="currentColor" />
                  วิดีโอแนะนำ
                </span>
              )}
              <span className={`${font} text-[11px] text-gray-500 tabular-nums inline-flex items-center gap-1`}>
                <Eye className="size-3" strokeWidth={2.4} />
                {video.views.toLocaleString()} ครั้ง
              </span>
              <span className={`${font} text-[11px] text-gray-500 tabular-nums inline-flex items-center gap-1`}>
                <Clock className="size-3" strokeWidth={2.4} />
                {video.duration}
              </span>
            </div>
            <p className={`${font} text-[14px] text-gray-700 leading-relaxed`}>{video.description}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ========== ADD / EDIT VIDEO ========== */
function VideoThumbnailPicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  React.useEffect(() => {
    const reset = () => setIsDragOver(false);
    document.addEventListener("dragend", reset);
    document.addEventListener("drop", reset);
    return () => { document.removeEventListener("dragend", reset); document.removeEventListener("drop", reset); };
  }, []);

  const readFile = (file: File) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { toast.error("รองรับเฉพาะ JPEG / PNG / WebP / GIF"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("ไฟล์ใหญ่เกิน 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => { onChange(reader.result as string); toast.success("เพิ่มภาพปกแล้ว"); };
    reader.onerror = () => toast.error("อ่านไฟล์ไม่สำเร็จ");
    reader.readAsDataURL(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (file) readFile(file);
  };
  const openPicker = () => fileInputRef.current?.click();
  const handleDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop      = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files?.[0]; if (file) readFile(file);
  };

  return (
    // กรอบ 220×299 px (object-cover ตัดส่วนเกินตามอัตราส่วน portrait แบบเดียวกับการ์ดบนเว็บ)
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      className="group/cover relative w-[220px] h-[299px] rounded-[16px] overflow-hidden bg-[#d9d9d9] shrink-0">
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange} className="hidden" />
      {!value && (
        <div className="absolute inset-0 rounded-[16px] border-2 border-dashed transition-colors pointer-events-none"
          style={{
            borderColor: isDragOver ? ADMIN_PRIMARY : "#d4d4d8",
            backgroundColor: isDragOver ? `${ADMIN_PRIMARY}08` : "#fafafa",
            backgroundImage: "repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,0.015) 10px 11px)",
            borderStyle: isDragOver ? "solid" : "dashed",
          }} />
      )}
      {value ? (
        <>
          {/* object-cover ตรงกับ BlogPage จริง — เห็นส่วนที่จะถูกตัด */}
          <ImageWithFallback src={value} alt="thumbnail" className="absolute inset-0 w-full h-full object-cover" />
          {/* Mock card overlay — แสดง views top-left + title bottom เหมือนเว็บจริง */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-start justify-between p-[10px]">
            <div className="bg-black/50 flex items-center gap-1.5 px-3 py-1 rounded-full">
              <Eye className="size-3 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[11px] text-white tabular-nums`}>0</span>
            </div>
            <div className="bg-black/50 rounded-full w-full">
              <div className="flex items-center justify-center px-3 py-1">
                <span className={`${font} text-[11px] text-white truncate`}>ตัวอย่างชื่อวิดีโอ</span>
              </div>
            </div>
          </div>
          {/* Hover toolbar */}
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/40 to-transparent z-10 pointer-events-none rounded-t-[16px] opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200" />
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 flex items-stretch bg-black/75 backdrop-blur-md rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.25)] opacity-0 -translate-y-1 group-hover/cover:opacity-100 group-hover/cover:translate-y-2 transition-all duration-200">
            <button onClick={openPicker}
              className="flex items-center gap-1 px-2.5 py-1.5 cursor-pointer hover:bg-white/10 transition-colors">
              <Pencil className="size-3 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[11px] text-white`} style={{ fontWeight: 500 }}>เปลี่ยน</span>
            </button>
            <div className="w-px bg-white/20" />
            <button onClick={() => { onChange(""); toast.success("ลบภาพปกแล้ว"); }}
              className="flex items-center gap-1 px-2.5 py-1.5 cursor-pointer hover:bg-[#ff3b30]/40 transition-colors">
              <Trash2 className="size-3 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[11px] text-white`} style={{ fontWeight: 500 }}>ลบ</span>
            </button>
          </div>
        </>
      ) : (
        <button onClick={openPicker} className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 cursor-pointer px-3">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="size-9 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
            <ImageIcon className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          </motion.div>
          <span className={`${font} text-[11px] text-center`} style={{ color: ADMIN_PRIMARY, fontWeight: 600 }}>
            {isDragOver ? "วางไฟล์ที่นี่" : "เพิ่มภาพปก"}
          </span>
          {/* Concise info — ขนาด + นามสกุล */}
          <div className="flex flex-col items-center gap-0.5 mt-1">
            <span className={`${font} text-[10px] text-gray-500 tabular-nums`} style={{ fontWeight: 500 }}>220 × 299 px</span>
            <span className={`${font} text-[9px] text-gray-400`}>JPEG/PNG/WebP ≤ 5MB</span>
          </div>
        </button>
      )}
    </div>
  );
}

// แสดง auto-thumbnail (read-only) — มีป้าย "จาก URL" + mock overlay เหมือนการ์ดจริง
function AutoThumbnailPreview({ src, sourceColor, sourceLabel }: { src: string; sourceColor: string; sourceLabel: string }) {
  return (
    <div className="relative w-[220px] h-[299px] rounded-[16px] overflow-hidden bg-[#d9d9d9] shrink-0">
      <ImageWithFallback src={src} alt="auto thumbnail" className="absolute inset-0 w-full h-full object-cover" />
      {/* Mock overlay — เหมือน BlogPage */}
      <div className="absolute inset-0 pointer-events-none flex flex-col items-start justify-between p-[10px]">
        <div className="bg-black/50 flex items-center gap-1.5 px-3 py-1 rounded-full">
          <Eye className="size-3 text-white" strokeWidth={2.4} />
          <span className={`${font} text-[11px] text-white tabular-nums`}>0</span>
        </div>
        <div className="bg-black/50 rounded-full w-full">
          <div className="flex items-center justify-center px-3 py-1">
            <span className={`${font} text-[11px] text-white truncate`}>ตัวอย่างชื่อวิดีโอ</span>
          </div>
        </div>
      </div>
      {/* Auto badge top-right — แสดงว่าเป็นภาพดึงอัตโนมัติ */}
      <span className="absolute top-2 right-2 z-10 inline-flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full pl-1.5 pr-2.5 py-1 shadow-[0_2px_6px_rgba(0,0,0,0.15)]">
        <Sparkles className="size-2.5" style={{ color: sourceColor }} strokeWidth={2.6} />
        <span className={`${font} text-[9px]`} style={{ color: sourceColor, fontWeight: 700 }}>{sourceLabel}</span>
      </span>
    </div>
  );
}

function VideoEditView({ initial, onSave, onCancel }: {
  initial: VideoItem | null;
  onSave: (v: VideoItem) => void;
  onCancel: () => void;
}) {
  const isEdit = !!initial;
  const [draft, setDraft] = useState<VideoItem>(initial ?? {
    id:          `VID-${String(Date.now()).slice(-3).padStart(3, "0")}`,
    title:       "",
    description: "",
    thumbnail:   "",
    source:      "youtube",
    videoUrl:    "",
    duration:    "0:00",
    tag:         "general",
    status:      "published",
    views:       0,
    publishedAt: new Date().toISOString().slice(0, 10),
  });
  const update = <K extends keyof VideoItem>(k: K, v: VideoItem[K]) => setDraft((p) => ({ ...p, [k]: v }));

  // Embed URL (validate live)
  const embedUrl = getVideoEmbedUrl(draft.source, draft.videoUrl);
  const isValidUrl = !!embedUrl;
  const ytId = draft.source === "youtube" ? extractYouTubeId(draft.videoUrl) : null;
  const sm = sourceMeta[draft.source];

  // Thumbnail: auto vs manual mode
  const [thumbnailMode, setThumbnailMode] = useState<"auto" | "manual">("auto");
  const autoThumbnail = getAutoThumbnail(draft.source, draft.videoUrl);

  // Sync thumbnail when in auto mode + URL/source changes
  React.useEffect(() => {
    if (thumbnailMode === "auto") {
      update("thumbnail", autoThumbnail || "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoThumbnail, thumbnailMode]);

  const switchToAuto = () => {
    setThumbnailMode("auto");
    if (autoThumbnail) update("thumbnail", autoThumbnail);
  };
  const switchToManual = () => {
    setThumbnailMode("manual");
    update("thumbnail", "");
  };
  const handleManualThumbnail = (url: string) => {
    update("thumbnail", url);
    setThumbnailMode("manual");
  };

  const canSave = draft.title.trim().length > 0 && draft.videoUrl.trim().length > 0 && draft.thumbnail.trim().length > 0 && isValidUrl;
  const isPublished = draft.status === "published";
  const isFeatured  = draft.tag === "featured";
  const sColor = videoStatusColors[draft.status];

  return (
    <div>
      <div className="mb-5">
        <button onClick={onCancel}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{isEdit ? "แก้ไขวิดีโอ" : "เพิ่มวิดีโอใหม่"}</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>
            {isEdit ? `กำลังแก้ไข ${initial?.id}` : "กรอกข้อมูลวิดีโอที่ต้องการแสดงบนหน้าเว็บ"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 h-[36px] rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>ยกเลิก</button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave({ ...draft, status: "unpublished" }); toast.success("บันทึกแบบร่างแล้ว"); }}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-5 h-[36px] rounded-full transition-colors ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ fontWeight: 500 }}>
            <FileText className="size-3.5" strokeWidth={2.4} />
            บันทึกแบบร่าง
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave(draft); toast.success(isEdit ? "บันทึกการแก้ไขแล้ว" : "เพิ่มวิดีโอใหม่แล้ว"); }}
            className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Check className="size-4" strokeWidth={2.4} />
            บันทึก
          </motion.button>
        </div>
      </div>

      {/* 2-col layout (สมดุล 1:1) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT */}
        <div className="flex flex-col gap-5 min-w-0">
          {/* Video section — ภาพปกซ้าย · source+URL+preview ขวา */}
          <FormSection icon={Film} iconColor="#9747ff" title="วิดีโอ"
            desc="เลือกประเภทช่องทาง วาง URL และเลือกภาพปกที่จะแสดงบนการ์ด">
            <div className="flex flex-col sm:flex-row gap-5">
              {/* === LEFT: ภาพปก ขนาดจริง === */}
              <div className="flex flex-col gap-2 shrink-0 w-[220px]">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="size-3.5 text-[#319754]" strokeWidth={2.4} />
                  <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 600 }}>ภาพปก</p>
                  <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>· 220×299</span>
                </div>
                {/* Picker — สลับตามโหมด (ควบคุมด้วย switch toggle ใต้ URL) */}
                {thumbnailMode === "auto" && autoThumbnail ? (
                  <AutoThumbnailPreview src={autoThumbnail} sourceColor={sm.color} sourceLabel={sm.label} />
                ) : (
                  <VideoThumbnailPicker value={draft.thumbnail} onChange={handleManualThumbnail} />
                )}
              </div>

              {/* === RIGHT: title + date + source + URL === */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                {/* ชื่อวิดีโอ */}
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                    ชื่อวิดีโอ <span className="text-[#ff3b30]">*</span>
                  </label>
                  <input value={draft.title} onChange={(e) => update("title", e.target.value)}
                    placeholder="เช่น ทำน้ำมันสมุนไพรทาแก้ปวดเมื่อย"
                    className={`${font} bg-[#fafafa] h-11 rounded-full px-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                    style={{ fontWeight: 500 }} />
                </div>

                {/* Source picker — card style with brand colors */}
                <div className="mt-2">
                  <label className={`${font} text-[12px] text-gray-500 mb-2 block`}>ช่องทาง <span className="text-[#ff3b30]">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(["youtube", "tiktok", "facebook", "other"] as VideoSource[]).map((id) => {
                      const m = sourceMeta[id];
                      const active = draft.source === id;
                      return (
                        <motion.button key={id}
                          onClick={() => { update("source", id); update("videoUrl", ""); }}
                          whileTap={{ scale: 0.96 }}
                          whileHover={!active ? { y: -2 } : undefined}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          className={`relative flex flex-col items-center justify-center gap-2 py-3 px-2 rounded-2xl cursor-pointer transition-all border-2 ${
                            active
                              ? "bg-white shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
                              : "bg-[#fafafa] border-transparent hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                          }`}
                          style={active ? { borderColor: m.color } : {}}>
                          {/* Active checkmark */}
                          {active && (
                            <span className="absolute top-1.5 right-1.5 size-4 rounded-full flex items-center justify-center shadow-sm"
                              style={{ backgroundColor: m.color }}>
                              <Check className="size-2.5 text-white" strokeWidth={3} />
                            </span>
                          )}
                          {/* Brand icon chip — icon ใช้ currentColor inherit จาก span */}
                          <span className="size-10 rounded-xl flex items-center justify-center transition-colors"
                            style={{
                              backgroundColor: active ? m.color : `${m.color}15`,
                              color: active ? "#ffffff" : m.color,
                            }}>
                            {m.isCustomIcon
                              ? <m.Icon className="size-5" />
                              : <m.Icon className="size-5" strokeWidth={2.2} />}
                          </span>
                          <span className={`${font} text-[12px]`} style={{ fontWeight: active ? 700 : 500, color: active ? m.color : "#404040" }}>
                            {m.label}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* URL input */}
                <div className="flex flex-col gap-1.5 mt-3">
                  <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                    {sm.isCustomIcon
                      ? <sm.Icon className="size-3 text-gray-400" />
                      : <sm.Icon className="size-3 text-gray-400" strokeWidth={2.4} />}
                    URL ของ {sm.label} <span className="text-[#ff3b30]">*</span>
                  </label>
                  <div className="relative">
                    <LinkIcon className="size-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
                    <input value={draft.videoUrl} onChange={(e) => update("videoUrl", e.target.value)}
                      placeholder={sm.placeholder}
                      className={`${font} bg-[#fafafa] h-11 w-full rounded-full pl-10 pr-4 text-[12px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                      style={{ fontWeight: 500 }} />
                  </div>
                </div>

                {/* Validation feedback */}
                {isValidUrl ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#319754]/8 border border-[#319754]/20">
                    <Check className="size-3.5 text-[#319754] shrink-0" strokeWidth={2.6} />
                    <p className={`${font} text-[11px] text-[#319754] truncate`} style={{ fontWeight: 600 }}>
                      ลิงก์ใช้ได้ {ytId ? `· ${ytId}` : ""}
                    </p>
                  </div>
                ) : draft.videoUrl ? (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#ff3b30]/5 border border-[#ff3b30]/20">
                    <AlertCircle className="size-3.5 text-[#ff3b30] shrink-0" strokeWidth={2.4} />
                    <p className={`${font} text-[11px] text-[#ff3b30]`} style={{ fontWeight: 500 }}>
                      URL ไม่ใช่ลิงก์ {sm.label} ที่ถูกต้อง
                    </p>
                  </div>
                ) : null}

                {/* Switch — ใช้ภาพปกจาก URL */}
                <div className={`flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#fafafa] ${!autoThumbnail ? "opacity-50" : ""}`}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-8 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: thumbnailMode === "auto" && autoThumbnail ? `${ADMIN_PRIMARY}1a` : "#e5e5e5" }}>
                      <Sparkles className="size-4"
                        style={{ color: thumbnailMode === "auto" && autoThumbnail ? ADMIN_PRIMARY : "#999" }}
                        strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0">
                      <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>ใช้ภาพปกจาก URL</p>
                      <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>
                        {!autoThumbnail
                          ? "ใส่ URL ที่ถูกต้องก่อน"
                          : thumbnailMode === "auto"
                            ? `ดึงอัตโนมัติจาก ${sm.label}`
                            : "ปิดอยู่ — กำลังใช้ภาพที่อัปโหลดเอง"}
                      </p>
                    </div>
                  </div>
                  <MiniToggle
                    enabled={thumbnailMode === "auto" && !!autoThumbnail}
                    onToggle={() => {
                      if (!autoThumbnail) return;
                      if (thumbnailMode === "auto") switchToManual();
                      else switchToAuto();
                    }}
                  />
                </div>

                {/* Other source warning */}
                {draft.source === "other" && embedUrl && (
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-[#fff7ed] border border-[#fed7aa]">
                    <Info className="size-3 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2.4} />
                    <p className={`${font} text-[10px] text-gray-600 leading-relaxed`}>
                      ผู้ให้บริการบางรายอาจไม่อนุญาตการฝัง — หากตัวอย่างไม่ขึ้น ผู้ใช้จะเห็นปุ่ม "เปิดในแท็บใหม่" แทน
                    </p>
                  </div>
                )}
              </div>
            </div>
          </FormSection>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-5">
          <FormSection icon={CalendarIcon} iconColor="#f59e0b" title="วันเผยแพร่">
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />
                วันที่เผยแพร่
              </label>
              <BannerDatePicker value={draft.publishedAt} onChange={(v) => update("publishedAt", v)} placeholder="เลือกวันเผยแพร่" />
            </div>
          </FormSection>

          <FormSection icon={Settings} iconColor="#ff9500" title="การตั้งค่าการแสดงผล" desc="วิดีโอแนะนำและการเผยแพร่">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#fafafa]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: isFeatured ? "#ff950022" : "#e5e5e5" }}>
                    <Star className="size-4"
                      style={{ color: isFeatured ? "#ff9500" : "#999" }}
                      strokeWidth={2.2}
                      fill={isFeatured ? "#ff9500" : "none"} />
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>วิดีโอแนะนำ</p>
                    <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>{isFeatured ? "ปักหมุดเป็นวิดีโอเด่น" : "วิดีโอทั่วไป"}</p>
                  </div>
                </div>
                <MiniToggle enabled={isFeatured} onToggle={() => update("tag", isFeatured ? "general" : "featured")} />
              </div>

              <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#fafafa]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                    style={{ backgroundColor: isPublished ? `${ADMIN_PRIMARY}1a` : "#e5e5e5" }}>
                    {isPublished
                      ? <Eye   className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
                      : <EyeOff className="size-4 text-gray-500" strokeWidth={2.2} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เผยแพร่วิดีโอ</p>
                    <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>{isPublished ? "แสดงบนหน้าเว็บ" : "ซ่อนจากหน้าเว็บ"}</p>
                  </div>
                </div>
                <MiniToggle enabled={isPublished} onToggle={() => update("status", isPublished ? "unpublished" : "published")} />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ borderColor: `${sColor}33`, backgroundColor: `${sColor}0d` }}>
                <span className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white shadow-sm shrink-0" style={{ color: sColor }}>
                  <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                  <span className={`${font} text-[11px]`} style={{ fontWeight: 700 }}>{videoStatusLabels[draft.status]}</span>
                </span>
                <p className={`${font} text-[10px] text-gray-600 leading-snug min-w-0`}>
                  {isPublished ? "พร้อมแสดงเมื่อกดบันทึก" : "เก็บไว้โดยไม่แสดงบนหน้าเว็บ"}
                </p>
              </div>
            </div>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

/* ========== WELCOME POPUP MGMT ========== */
type PopupStatus  = "published" | "unpublished";
type PopupStyle   = "image" | "card";
type PopupTrigger = "first_visit" | "every_visit" | "every_n_days";

interface WelcomePopup {
  id: string;
  name: string;          // ชื่อภายใน (admin only)
  style: PopupStyle;
  image: string;
  title: string;         // หัวเรื่องบนป๊อปอัป (card style เท่านั้น)
  description: string;   // (card style)
  ctaText: string;
  ctaLink: string;
  trigger: PopupTrigger;
  triggerDays: number;   // สำหรับ every_n_days
  startDate: string;
  endDate: string;
  status: PopupStatus;
  views: number;
  clicks: number;
}

const popupStatusLabels: Record<PopupStatus, string> = { published: "เผยแพร่", unpublished: "ไม่เผยแพร่" };
const popupStatusColors: Record<PopupStatus, string> = { published: "#319754", unpublished: "#737373" };
const popupTriggerLabels: Record<PopupTrigger, string> = {
  first_visit:  "ครั้งแรกที่เข้าเท่านั้น",
  every_visit:  "ทุกครั้งที่เข้าเว็บ",
  every_n_days: "ทุก N วัน",
};

const initialPopups: WelcomePopup[] = [
  { id: "POP-001", name: "Songkran Sale 2026",            style: "image", image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80", title: "สงกรานต์ลด 30%",            description: "ฉลองวันสงกรานต์ ลดสูงสุด 30% ทุกชิ้น", ctaText: "ช้อปเลย",  ctaLink: "/products?tag=songkran", trigger: "first_visit",  triggerDays: 0, startDate: "2026-04-10", endDate: "2026-04-20", status: "published",   views: 12480, clicks: 892 },
  { id: "POP-002", name: "Welcome New Member",             style: "card",  image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",   title: "ยินดีต้อนรับ! รับคูปอง 100฿", description: "สมัครสมาชิกใหม่รับคูปองส่วนลดทันที", ctaText: "รับคูปอง",  ctaLink: "/coupons",                trigger: "first_visit",  triggerDays: 0, startDate: "",            endDate: "",            status: "published",   views: 5430,  clicks: 412 },
  { id: "POP-003", name: "Blog ฟ้าทะลายโจร",                style: "card",  image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800&q=80", title: "อ่านบทความใหม่",            description: "ฟ้าทะลายโจร — สรรพคุณและวิธีใช้ที่ถูกต้อง", ctaText: "อ่านเลย",  ctaLink: "/blog/4",                  trigger: "every_n_days", triggerDays: 7, startDate: "2026-05-01", endDate: "2026-05-31", status: "published",   views: 2180,  clicks: 145 },
  { id: "POP-004", name: "Black Friday 2025",              style: "image", image: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80", title: "Black Friday",             description: "",                                    ctaText: "ดูดีล",     ctaLink: "/products?sale=true",      trigger: "every_visit",  triggerDays: 0, startDate: "2025-11-25", endDate: "2025-11-29", status: "unpublished", views: 0,     clicks: 0 },
  { id: "POP-005", name: "Partner Workshop เม.ย.",          style: "card",  image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&q=80", title: "Workshop ทำชาสมุนไพร",       description: "เปิดรับสมัคร Workshop ที่ MetaHerb สาขาทองหล่อ", ctaText: "ลงทะเบียน", ctaLink: "/events/workshop-1",   trigger: "first_visit",  triggerDays: 0, startDate: "2026-04-15", endDate: "2026-04-25", status: "unpublished", views: 0,     clicks: 0 },
];

function PopupContent() {
  const [popups, setPopups] = useState<WelcomePopup[]>(initialPopups);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PopupStatus>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(12);
  const [previewPopup, setPreviewPopup] = useState<WelcomePopup | null>(null);
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingPopup, setEditingPopup] = useState<WelcomePopup | null>(null);

  const startAdd  = () => { setEditingPopup(null); setView("edit"); };
  const startEdit = (p: WelcomePopup) => { setEditingPopup(p); setView("edit"); };
  const closeEdit = () => { setView("list"); setEditingPopup(null); };

  const savePopup = (p: WelcomePopup) => {
    setPopups((prev) => editingPopup ? prev.map((x) => x.id === p.id ? p : x) : [p, ...prev]);
    closeEdit();
  };

  if (view === "edit") {
    return <PopupEditView initial={editingPopup} onSave={savePopup} onCancel={closeEdit} />;
  }

  const statusTabs: { id: "all" | PopupStatus; label: string; count: number; Icon: any }[] = [
    { id: "all",         label: "ทั้งหมด",     count: popups.length,                                          Icon: Megaphone },
    { id: "published",   label: "เผยแพร่",     count: popups.filter((p) => p.status === "published").length,   Icon: Eye },
    { id: "unpublished", label: "ไม่เผยแพร่", count: popups.filter((p) => p.status === "unpublished").length, Icon: EyeOff },
  ];

  const filtered = popups.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>Popup ต้อนรับ</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>ป๊อปอัปแสดง event / campaign ตอนผู้ใช้เข้าเว็บ</p>
        </div>
        <motion.button onClick={startAdd}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}>
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่ม Popup</span>
        </motion.button>
      </div>

      {/* Filter pill */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
        <FilterTabPills tabs={statusTabs} active={statusFilter} onChange={(id) => { setStatusFilter(id); setPage(1); }} pillId="popupStatusPill" />
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
          <input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
            placeholder="ค้นหา popup..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Card grid — landscape thumbnail style */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        {paged.length === 0 ? (
          <div className={`py-16 text-center ${font} text-[13px] text-gray-400`}>ไม่พบ Popup</div>
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 280px))" }}>
            {paged.map((p) => {
              const sColor = popupStatusColors[p.status];
              const ctr = p.views > 0 ? Math.round((p.clicks / p.views) * 100) : 0;
              return (
                <div key={p.id}
                  className="group bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300">
                  {/* Image preview */}
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <ImageWithFallback src={p.image} alt={p.name} className={`absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${p.status === "unpublished" ? "grayscale opacity-60" : ""}`} />
                    {/* Style badge top-left */}
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 bg-white/95 backdrop-blur-md rounded-full px-2 py-0.5 text-[10px] shadow-[0_1px_3px_rgba(0,0,0,0.1)]"
                      style={{ color: p.style === "image" ? "#9747ff" : "#0088ff", fontWeight: 600 }}>
                      {p.style === "image" ? <ImageIcon className="size-2.5" strokeWidth={2.6} /> : <FileText className="size-2.5" strokeWidth={2.6} />}
                      {p.style === "image" ? "Image" : "Card"}
                    </span>
                    {/* Action menu top-right */}
                    <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="size-7 rounded-full inline-flex items-center justify-center bg-black/60 hover:bg-black/85 text-white transition-colors cursor-pointer backdrop-blur-md data-[state=open]:bg-[#319754] data-[state=open]:opacity-100">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent align="end" sideOffset={6}
                          className="w-[220px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                          <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                            style={{ transformOrigin: "top right" }}>
                            {(() => {
                              const isPublished = p.status === "published";
                              const togglePublish = () => {
                                const next: PopupStatus = isPublished ? "unpublished" : "published";
                                setPopups((prev) => prev.map((x) => x.id === p.id ? { ...x, status: next } : x));
                                toast.success(next === "published" ? `เผยแพร่: ${p.name}` : `ซ่อน: ${p.name}`);
                              };
                              return (
                                <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl">
                                  <div className="flex items-center gap-3">
                                    {isPublished
                                      ? <Eye className="size-3.5 text-[#319754]" strokeWidth={2.2} />
                                      : <EyeOff className="size-3.5 text-gray-400" strokeWidth={2.2} />}
                                    <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เผยแพร่</span>
                                  </div>
                                  <MiniToggle enabled={isPublished} onToggle={togglePublish} />
                                </div>
                              );
                            })()}
                            <div className="h-px bg-gray-100 my-1" />
                            <button onClick={() => setPreviewPopup(p)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ดูตัวอย่าง</span>
                            </button>
                            <button onClick={() => startEdit(p)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>แก้ไข</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button onClick={() => { if (confirm(`ลบ "${p.name}"?`)) { setPopups((prev) => prev.filter((x) => x.id !== p.id)); toast.success(`ลบ: ${p.name}`); } }}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                              <Trash2 className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ลบ</span>
                            </button>
                          </motion.div>
                        </PopoverContent>
                      </Popover>
                    </div>
                    {/* Center preview button (hover) */}
                    <button onClick={() => setPreviewPopup(p)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <span className={`${font} bg-white/95 inline-flex items-center gap-1.5 px-4 h-9 rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.3)] text-[12px] text-[#319754]`} style={{ fontWeight: 600 }}>
                        <Eye className="size-3.5" strokeWidth={2.4} />
                        ดูตัวอย่าง
                      </span>
                    </button>
                  </div>
                  {/* Bottom info */}
                  <div className="p-3 flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`${font} text-[13px] text-black truncate min-w-0`} style={{ fontWeight: 600 }} title={p.name}>{p.name}</p>
                      <span className={`${font} inline-flex items-center gap-1 pl-1.5 pr-2 py-0.5 rounded-full text-[10px] shrink-0`}
                        style={{ backgroundColor: `${sColor}1a`, color: sColor }}>
                        <span className="size-1 rounded-full" style={{ backgroundColor: sColor }} />
                        {popupStatusLabels[p.status]}
                      </span>
                    </div>
                    <p className={`${font} text-[11px] text-gray-500 truncate flex items-center gap-1.5`}>
                      <Clock className="size-2.5 text-gray-400 shrink-0" strokeWidth={2.4} />
                      {popupTriggerLabels[p.trigger]}{p.trigger === "every_n_days" && p.triggerDays ? ` (${p.triggerDays}d)` : ""}
                    </p>
                    {p.startDate && (
                      <p className={`${font} text-[10px] text-gray-400 tabular-nums truncate`}>{fmtDate(p.startDate)} ↳ {fmtDate(p.endDate)}</p>
                    )}
                    <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-gray-100">
                      <span className={`${font} text-[10px] text-gray-500 tabular-nums inline-flex items-center gap-1`}>
                        <Eye className="size-2.5 text-gray-400" strokeWidth={2.4} />
                        {p.views.toLocaleString()}
                      </span>
                      <span className={`${font} text-[10px] text-gray-500 tabular-nums inline-flex items-center gap-1`}>
                        <MousePointer2 className="size-2.5 text-gray-400" strokeWidth={2.4} />
                        {p.clicks.toLocaleString()}
                      </span>
                      <span className={`${font} text-[10px] tabular-nums`} style={{ fontWeight: 600, color: ctr > 5 ? "#319754" : "#737373" }}>
                        CTR {ctr}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
              <div className="relative">
                <select className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                  value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[6, 12, 24, 48].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า · ทั้งหมด {filtered.length} รายการ</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === n ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: safePage === n ? 600 : 400 }}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Preview modal */}
      <PopupPreviewModal popup={previewPopup} onClose={() => setPreviewPopup(null)} />
    </div>
  );
}

/* ========== POPUP PREVIEW MODAL ========== */
function PopupPreviewModal({ popup, onClose }: { popup: WelcomePopup | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!popup) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [popup, onClose]);

  if (!popup) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 gap-3"
        onClick={onClose}>
        {/* Mock browser-style preview header */}
        <div className="text-center" onClick={(e) => e.stopPropagation()}>
          <p className={`${font} text-[12px] text-white/70 inline-flex items-center gap-1.5`}>
            <Eye className="size-3" strokeWidth={2.4} />
            ตัวอย่างที่จะแสดงบนหน้าเว็บ · กด Esc เพื่อปิด
          </p>
        </div>

        {/* The popup itself — render as it would appear */}
        <PopupRender popup={popup} onClose={onClose} />
      </motion.div>
    </AnimatePresence>
  );
}

// Render popup as it would appear on the website (used in modal + edit preview)
function PopupRender({ popup, onClose }: { popup: WelcomePopup; onClose: () => void }) {
  if (popup.style === "image") {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[480px] rounded-[20px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)]">
        {/* Close button */}
        <button onClick={onClose}
          className="absolute top-3 right-3 z-20 size-9 rounded-full bg-black/60 backdrop-blur-md hover:bg-black/85 text-white inline-flex items-center justify-center cursor-pointer transition-colors">
          <X className="size-4" strokeWidth={2.4} />
        </button>
        {/* Image */}
        {popup.ctaLink ? (
          <a href={popup.ctaLink} target="_blank" rel="noopener noreferrer"
            className="block aspect-[4/5] bg-gray-100 cursor-pointer">
            <ImageWithFallback src={popup.image} alt={popup.title || popup.name} className="w-full h-full object-cover" />
          </a>
        ) : (
          <div className="aspect-[4/5] bg-gray-100">
            <ImageWithFallback src={popup.image} alt={popup.title || popup.name} className="w-full h-full object-cover" />
          </div>
        )}
        {/* CTA overlay (if has CTA text) */}
        {popup.ctaText && popup.ctaLink && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
            <a href={popup.ctaLink} target="_blank" rel="noopener noreferrer"
              className={`${font} inline-flex items-center gap-2 bg-white text-[#319754] px-6 h-11 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.25)] cursor-pointer hover:bg-[#319754] hover:text-white transition-colors text-[14px]`}
              style={{ fontWeight: 700 }}>
              {popup.ctaText}
              <ArrowRight className="size-4" strokeWidth={2.6} />
            </a>
          </div>
        )}
      </motion.div>
    );
  }

  // Card style
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 10 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 10 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-[20px] w-full max-w-[440px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.4)] relative">
      {/* Close button */}
      <button onClick={onClose}
        className="absolute top-3 right-3 z-20 size-8 rounded-full bg-white/90 hover:bg-gray-100 text-gray-600 inline-flex items-center justify-center cursor-pointer transition-colors shadow-sm">
        <X className="size-4" strokeWidth={2.4} />
      </button>
      {/* Image */}
      <div className="aspect-video bg-gray-100">
        <ImageWithFallback src={popup.image} alt={popup.title || popup.name} className="w-full h-full object-cover" />
      </div>
      {/* Body */}
      <div className="px-6 py-5 flex flex-col gap-2.5">
        <h2 className={`${font} text-[20px] text-black leading-tight`} style={{ fontWeight: 700 }}>
          {popup.title || "ชื่อเรื่อง"}
        </h2>
        {popup.description && (
          <p className={`${font} text-[14px] text-gray-600 leading-relaxed`}>{popup.description}</p>
        )}
        {popup.ctaText && (
          <a href={popup.ctaLink || "#"} target="_blank" rel="noopener noreferrer"
            className={`${font} mt-2 inline-flex items-center justify-center gap-2 bg-[#319754] hover:bg-[#267a43] text-white px-5 h-12 rounded-full cursor-pointer transition-colors text-[14px] shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
            style={{ fontWeight: 600 }}>
            {popup.ctaText}
            <ArrowRight className="size-4" strokeWidth={2.6} />
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ========== ADD / EDIT POPUP ========== */
function PopupImagePicker({ value, onChange, aspectClass }: { value: string; onChange: (url: string) => void; aspectClass: string }) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  React.useEffect(() => {
    const reset = () => setIsDragOver(false);
    document.addEventListener("dragend", reset);
    document.addEventListener("drop", reset);
    return () => { document.removeEventListener("dragend", reset); document.removeEventListener("drop", reset); };
  }, []);

  const readFile = (file: File) => {
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) { toast.error("รองรับเฉพาะ JPEG / PNG / WebP / GIF"); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("ไฟล์ใหญ่เกิน 5MB"); return; }
    const reader = new FileReader();
    reader.onload = () => { onChange(reader.result as string); toast.success("เพิ่มภาพแล้ว"); };
    reader.readAsDataURL(file);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; e.target.value = "";
    if (file) readFile(file);
  };
  const openPicker = () => fileInputRef.current?.click();
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = () => setIsDragOver(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files?.[0]; if (file) readFile(file);
  };

  return (
    <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}
      className={`group/cover relative w-full ${aspectClass} rounded-[16px] overflow-hidden bg-[#d9d9d9]`}>
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange} className="hidden" />
      {!value && (
        <div className="absolute inset-0 rounded-[16px] border-2 border-dashed transition-colors pointer-events-none"
          style={{
            borderColor: isDragOver ? ADMIN_PRIMARY : "#d4d4d8",
            backgroundColor: isDragOver ? `${ADMIN_PRIMARY}08` : "#fafafa",
            backgroundImage: "repeating-linear-gradient(45deg, transparent 0 10px, rgba(0,0,0,0.015) 10px 11px)",
            borderStyle: isDragOver ? "solid" : "dashed",
          }} />
      )}
      {value ? (
        <>
          <ImageWithFallback src={value} alt="popup" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/45 to-transparent z-10 pointer-events-none rounded-b-[16px] opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-stretch bg-black/70 backdrop-blur-md rounded-full overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.25)] opacity-0 translate-y-1 group-hover/cover:opacity-100 group-hover/cover:translate-y-0 transition-all duration-200">
            <button onClick={openPicker} className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors">
              <Pencil className="size-3 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[11px] text-white`} style={{ fontWeight: 500 }}>เปลี่ยน</span>
            </button>
            <div className="w-px bg-white/20" />
            <button onClick={() => { onChange(""); toast.success("ลบภาพแล้ว"); }} className="flex items-center gap-1.5 px-3 py-1.5 cursor-pointer hover:bg-[#ff3b30]/40 transition-colors">
              <Trash2 className="size-3 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[11px] text-white`} style={{ fontWeight: 500 }}>ลบ</span>
            </button>
          </div>
        </>
      ) : (
        <button onClick={openPicker} className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 cursor-pointer">
          <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }}
            transition={{ type: "spring", stiffness: 380, damping: 22 }}
            className="size-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
            <ImageIcon className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          </motion.div>
          <span className={`${font} text-[12px]`} style={{ color: ADMIN_PRIMARY, fontWeight: 600 }}>
            {isDragOver ? "วางไฟล์ที่นี่" : "เพิ่มภาพ"}
          </span>
          <span className={`${font} text-[10px] text-gray-400`}>JPEG/PNG/WebP ≤ 5MB</span>
        </button>
      )}
    </div>
  );
}

function PopupEditView({ initial, onSave, onCancel }: {
  initial: WelcomePopup | null;
  onSave: (p: WelcomePopup) => void;
  onCancel: () => void;
}) {
  const isEdit = !!initial;
  const [draft, setDraft] = useState<WelcomePopup>(initial ?? {
    id:          `POP-${String(Date.now()).slice(-3).padStart(3, "0")}`,
    name:        "",
    style:       "card",
    image:       "",
    title:       "",
    description: "",
    ctaText:     "",
    ctaLink:     "",
    trigger:     "first_visit",
    triggerDays: 7,
    startDate:   "",
    endDate:     "",
    status:      "published",
    views:       0,
    clicks:      0,
  });
  const [alwaysOn, setAlwaysOn] = useState(!initial?.startDate);
  const [showLivePreview, setShowLivePreview] = useState(false);
  const update = <K extends keyof WelcomePopup>(k: K, v: WelcomePopup[K]) => setDraft((p) => ({ ...p, [k]: v }));

  const isPublished = draft.status === "published";
  const sColor = popupStatusColors[draft.status];
  const canSave = draft.name.trim().length > 0 && draft.image.trim().length > 0 &&
    (draft.style === "image" || draft.title.trim().length > 0);

  return (
    <div>
      <div className="mb-5">
        <button onClick={onCancel}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{isEdit ? "แก้ไข Popup" : "เพิ่ม Popup ใหม่"}</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>
            {isEdit ? `กำลังแก้ไข ${initial?.id}` : "ป๊อปอัปต้อนรับที่จะแสดงบนหน้าเว็บ"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLivePreview(true)} disabled={!draft.image}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] px-5 h-[36px] rounded-full transition-colors ${draft.image ? "text-[#9747ff] bg-[#9747ff]/10 hover:bg-[#9747ff]/20 cursor-pointer" : "text-gray-400 bg-gray-100 cursor-not-allowed"}`}
            style={{ fontWeight: 500 }}>
            <Eye className="size-3.5" strokeWidth={2.4} />
            ดูตัวอย่าง
          </button>
          <button onClick={onCancel}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 h-[36px] rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>ยกเลิก</button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave({ ...draft, status: "unpublished" }); toast.success("บันทึกแบบร่างแล้ว"); }}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 px-5 h-[36px] rounded-full transition-colors ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ fontWeight: 500 }}>
            <FileText className="size-3.5" strokeWidth={2.4} />
            บันทึกแบบร่าง
          </motion.button>
          <motion.button whileTap={{ scale: 0.96 }} whileHover={canSave ? { scale: 1.03 } : undefined}
            disabled={!canSave}
            onClick={() => { onSave(draft); toast.success(isEdit ? "บันทึกการแก้ไขแล้ว" : "เพิ่ม Popup ใหม่แล้ว"); }}
            className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] ${canSave ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Check className="size-4" strokeWidth={2.4} />
            บันทึก
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* LEFT: design */}
        <div className="flex flex-col gap-5 min-w-0">
          <FormSection icon={Megaphone} iconColor="#9747ff" title="รูปแบบ Popup" desc="เลือกแบบที่จะแสดงและอัปโหลดภาพ">
            {/* Style picker */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {([
                { id: "image", label: "ภาพอย่างเดียว", desc: "ภาพเต็ม + ปุ่มปิด · เหมาะกับโปรโมชัน", Icon: ImageIcon, color: "#9747ff" },
                { id: "card",  label: "การ์ด",            desc: "ภาพ + ชื่อ + คำอธิบาย + CTA",         Icon: FileText, color: "#0088ff" },
              ] as { id: PopupStyle; label: string; desc: string; Icon: any; color: string }[]).map((s) => {
                const active = draft.style === s.id;
                return (
                  <button key={s.id} onClick={() => update("style", s.id)}
                    className={`relative flex flex-col items-start gap-1 p-3 rounded-2xl cursor-pointer transition-all border-2 text-left ${active ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)]" : "bg-[#fafafa] border-transparent hover:bg-white"}`}
                    style={active ? { borderColor: s.color } : {}}>
                    {active && (
                      <span className="absolute top-2 right-2 size-4 rounded-full flex items-center justify-center" style={{ backgroundColor: s.color }}>
                        <Check className="size-2.5 text-white" strokeWidth={3} />
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="size-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: active ? s.color : `${s.color}15`, color: active ? "#fff" : s.color }}>
                        <s.Icon className="size-4" strokeWidth={2.2} />
                      </span>
                      <p className={`${font} text-[13px]`} style={{ fontWeight: 700, color: active ? s.color : "#171717" }}>{s.label}</p>
                    </div>
                    <p className={`${font} text-[11px] text-gray-500 leading-snug`}>{s.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Image picker — aspect ตาม style */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                <ImageIcon className="size-3 text-gray-400" strokeWidth={2.4} />
                ภาพ Popup <span className="text-[#ff3b30]">*</span>
                <span className="text-[10px] text-gray-400">· {draft.style === "image" ? "อัตราส่วน 4:5 portrait" : "อัตราส่วน 16:9 landscape"}</span>
              </label>
              <PopupImagePicker
                value={draft.image}
                onChange={(url) => update("image", url)}
                aspectClass={draft.style === "image" ? "aspect-[4/5]" : "aspect-video"} />
            </div>
          </FormSection>

          {/* Card-only fields */}
          {draft.style === "card" && (
            <FormSection icon={FileText} iconColor="#0088ff" title="ข้อความบนการ์ด" desc="หัวเรื่องและคำอธิบายที่จะแสดงในการ์ด">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500`}>หัวเรื่อง <span className="text-[#ff3b30]">*</span></label>
                  <input value={draft.title} onChange={(e) => update("title", e.target.value)}
                    placeholder="เช่น ยินดีต้อนรับ! รับคูปอง 100฿"
                    className={`${font} bg-[#fafafa] h-11 rounded-full px-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                    style={{ fontWeight: 500 }} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500`}>คำอธิบาย</label>
                  <textarea value={draft.description} onChange={(e) => update("description", e.target.value)}
                    placeholder="คำอธิบายสั้นๆ"
                    rows={3}
                    className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none`}
                    style={{ fontWeight: 500 }} />
                </div>
              </div>
            </FormSection>
          )}
        </div>

        {/* RIGHT: meta */}
        <div className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-5">
          {/* Internal name */}
          <FormSection icon={Tag} iconColor="#319754" title="ชื่อภายใน" desc="ใช้ระบุใน admin เท่านั้น (ลูกค้าไม่เห็น)">
            <input value={draft.name} onChange={(e) => update("name", e.target.value)}
              placeholder="เช่น Songkran Sale 2026"
              className={`${font} bg-[#fafafa] h-11 rounded-full px-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
              style={{ fontWeight: 500 }} />
          </FormSection>

          {/* CTA */}
          <FormSection icon={MousePointer2} iconColor="#9747ff" title="ปุ่ม Call-to-Action" desc="ปุ่มที่ลูกค้ากดเข้าไปยังหน้าเป้าหมาย">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[12px] text-gray-500`}>ข้อความปุ่ม</label>
                <input value={draft.ctaText} onChange={(e) => update("ctaText", e.target.value)}
                  placeholder="เช่น ช้อปเลย / รับคูปอง"
                  className={`${font} bg-[#fafafa] h-11 rounded-full px-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                  style={{ fontWeight: 500 }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[12px] text-gray-500`}>ลิงก์ปลายทาง</label>
                <div className="relative">
                  <LinkIcon className="size-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
                  <input value={draft.ctaLink} onChange={(e) => update("ctaLink", e.target.value)}
                    placeholder="/products หรือ https://..."
                    className={`${font} bg-[#fafafa] h-11 w-full rounded-full pl-10 pr-4 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all`}
                    style={{ fontWeight: 500 }} />
                </div>
              </div>
            </div>
          </FormSection>

          {/* Trigger */}
          <FormSection icon={Clock} iconColor="#0088ff" title="การแสดงผล" desc="เลือกว่าจะแสดง popup เมื่อไร">
            <div className="flex flex-col gap-2">
              {([
                { id: "first_visit",  label: "ครั้งแรกที่เข้าเว็บ", desc: "แสดงครั้งเดียวต่อผู้ใช้คนหนึ่ง" },
                { id: "every_visit",  label: "ทุกครั้งที่เข้าเว็บ", desc: "แสดงทุกครั้ง — ใช้สำหรับ event สำคัญ" },
                { id: "every_n_days", label: "ทุก N วัน",           desc: "แสดงซ้ำตามรอบที่กำหนด" },
              ] as { id: PopupTrigger; label: string; desc: string }[]).map((t) => {
                const active = draft.trigger === t.id;
                return (
                  <button key={t.id} onClick={() => update("trigger", t.id)}
                    className={`flex items-start justify-between gap-3 p-3 rounded-2xl cursor-pointer transition-colors text-left ${active ? "bg-[#319754]/8 border-2 border-[#319754]" : "bg-[#fafafa] border-2 border-transparent hover:bg-white"}`}>
                    <div className="min-w-0">
                      <p className={`${font} text-[13px]`} style={{ fontWeight: active ? 700 : 500, color: active ? "#319754" : "#171717" }}>{t.label}</p>
                      <p className={`${font} text-[11px] text-gray-500 mt-0.5 leading-snug`}>{t.desc}</p>
                    </div>
                    {active && <Check className="size-4 text-[#319754] shrink-0 mt-1" strokeWidth={2.6} />}
                  </button>
                );
              })}
              {draft.trigger === "every_n_days" && (
                <div className="flex items-center gap-2 mt-1 pl-3">
                  <span className={`${font} text-[12px] text-gray-500`}>แสดงทุก</span>
                  <input type="number" min={1} max={365} value={draft.triggerDays} onChange={(e) => update("triggerDays", Math.max(1, Number(e.target.value)))}
                    className={`${font} bg-[#fafafa] h-9 w-20 rounded-full px-3 text-[13px] tabular-nums outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all text-center`}
                    style={{ fontWeight: 600 }} />
                  <span className={`${font} text-[12px] text-gray-500`}>วัน</span>
                </div>
              )}
            </div>
          </FormSection>

          {/* Schedule */}
          <FormSection icon={CalendarIcon} iconColor="#f59e0b" title="ช่วงเวลาแสดง" desc="ตั้งวันเริ่มและวันสิ้นสุด">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#fafafa] mb-3">
              <div>
                <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>แสดงตลอดเวลา</p>
                <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>ไม่กำหนดวันสิ้นสุด</p>
              </div>
              <MiniToggle enabled={alwaysOn} onToggle={() => {
                const next = !alwaysOn;
                setAlwaysOn(next);
                if (next) { update("startDate", ""); update("endDate", ""); }
              }} />
            </div>
            {!alwaysOn && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                    <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />เริ่มแสดง
                  </label>
                  <BannerDatePicker value={draft.startDate} onChange={(v) => update("startDate", v)} placeholder="วันเริ่ม" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                    <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />สิ้นสุด
                  </label>
                  <BannerDatePicker value={draft.endDate} onChange={(v) => update("endDate", v)} placeholder="วันสิ้นสุด" />
                </div>
              </div>
            )}
          </FormSection>

          {/* Publish toggle */}
          <FormSection icon={Settings} iconColor="#ff9500" title="การเผยแพร่" desc="เปิด/ปิด popup">
            <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-[#fafafa]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: isPublished ? `${ADMIN_PRIMARY}1a` : "#e5e5e5" }}>
                  {isPublished
                    ? <Eye className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
                    : <EyeOff className="size-4 text-gray-500" strokeWidth={2.2} />}
                </div>
                <div className="min-w-0">
                  <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เผยแพร่ Popup</p>
                  <p className={`${font} text-[10px] text-gray-500 mt-0.5 leading-snug`}>{isPublished ? "ลูกค้าจะเห็นบนหน้าเว็บ" : "ซ่อนจากผู้ใช้"}</p>
                </div>
              </div>
              <MiniToggle enabled={isPublished} onToggle={() => update("status", isPublished ? "unpublished" : "published")} />
            </div>
            <div className="flex items-center gap-2 p-3 rounded-xl border mt-3" style={{ borderColor: `${sColor}33`, backgroundColor: `${sColor}0d` }}>
              <span className="inline-flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-white shadow-sm shrink-0" style={{ color: sColor }}>
                <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                <span className={`${font} text-[11px]`} style={{ fontWeight: 700 }}>{popupStatusLabels[draft.status]}</span>
              </span>
              <p className={`${font} text-[10px] text-gray-600 leading-snug`}>
                {isPublished ? "พร้อมแสดงเมื่อกดบันทึก" : "เก็บไว้โดยไม่แสดง"}
              </p>
            </div>
          </FormSection>
        </div>
      </div>

      {/* Live preview modal */}
      {showLivePreview && (
        <PopupPreviewModal popup={draft} onClose={() => setShowLivePreview(false)} />
      )}
    </div>
  );
}

/* ========== LEGAL DOCUMENTS (Terms / Privacy) ========== */
type LegalDocId    = "terms" | "privacy";
type AudienceId    = "customer" | "shop" | "default";
type FileStatus    = "published" | "draft" | "archived";

interface LegalFile {
  id: string;
  version: string;
  status: FileStatus;
  html: string;
  createdAt: string;
  updatedAt: string;
  notes: string;       // changelog / version notes
}

interface LegalAudience {
  id: AudienceId;
  label: string;
  Icon: any;
  files: LegalFile[];  // หลายเวอร์ชันต่อ audience
}

const fileStatusLabels: Record<FileStatus, string> = {
  published: "ใช้งานอยู่",
  draft:     "ฉบับร่าง",
  archived:  "เก็บถาวร",
};
const fileStatusColors: Record<FileStatus, string> = {
  published: "#319754",
  draft:     "#f59e0b",
  archived:  "#737373",
};

const legalDocs: Record<LegalDocId, {
  title: string; subtitle: string; Icon: any; color: string;
  audiences: LegalAudience[];
}> = {
  terms: {
    title:    "ข้อกำหนดการใช้บริการ",
    subtitle: "เงื่อนไขที่ผู้ใช้และร้านค้ายอมรับเมื่อใช้บริการของ MetaHerb",
    Icon:     ScrollText,
    color:    ADMIN_PRIMARY,
    audiences: [
      {
        id: "customer", label: "ลูกค้า", Icon: Users,
        files: [
      {
        id: "TOS-CUST-021", version: "v2.1", status: "published",
        createdAt: "2026-04-18", updatedAt: "2026-04-18",
        notes: "เพิ่มข้อ 4 เรื่องระยะเวลาการคืนสินค้า 7 วัน",
        html: `
<h2>1. การยอมรับเงื่อนไข</h2>
<p>การเข้าใช้งานเว็บไซต์ <strong>MetaHerb</strong> ในฐานะลูกค้าซื้อสินค้า ถือเป็นการยอมรับข้อกำหนดและเงื่อนไขทั้งหมดที่ระบุไว้ในเอกสารฉบับนี้</p>

<h2>2. การใช้งานบริการ</h2>
<p>ผู้ใช้ตกลงจะใช้บริการของเราด้วยความสุจริต และไม่กระทำการใดที่ขัดต่อกฎหมายหรือศีลธรรมอันดี</p>
<ul>
  <li>ไม่นำข้อมูลในเว็บไซต์ไปใช้ในเชิงพาณิชย์โดยไม่ได้รับอนุญาต</li>
  <li>ไม่กระทำการที่อาจสร้างความเสียหายต่อระบบหรือผู้ใช้รายอื่น</li>
  <li>ให้ข้อมูลที่ถูกต้อง ครบถ้วน เมื่อสมัครสมาชิกหรือสั่งซื้อสินค้า</li>
</ul>

<h2>3. การสั่งซื้อและชำระเงิน</h2>
<p>เมื่อสั่งซื้อสินค้า ลูกค้าตกลงชำระค่าสินค้าและค่าบริการตามที่ระบุในรายการคำสั่งซื้อ MetaHerb ขอสงวนสิทธิ์ในการยกเลิกคำสั่งซื้อในกรณีที่ตรวจพบความผิดปกติ</p>

<h2>4. การจัดส่งและคืนสินค้า</h2>
<p>เงื่อนไขการจัดส่งและการคืนสินค้าเป็นไปตามที่ระบุในนโยบายแยกของเรา ซึ่งถือเป็นส่วนหนึ่งของข้อกำหนดฉบับนี้ ลูกค้าสามารถขอคืนสินค้าได้ภายใน 7 วันนับจากวันที่ได้รับสินค้า</p>

<h2>5. ข้อจำกัดความรับผิด</h2>
<p>MetaHerb ไม่รับผิดชอบต่อความเสียหายทางอ้อม หรือผลที่เกิดจากการใช้งานเว็บไซต์ที่อยู่นอกเหนือการควบคุมของเรา</p>

<h2>6. การเปลี่ยนแปลงข้อกำหนด</h2>
<p>เราขอสงวนสิทธิ์ในการแก้ไขข้อกำหนดนี้ได้ทุกเมื่อ โดยจะแจ้งให้ทราบล่วงหน้าผ่านเว็บไซต์</p>

<blockquote>หากมีข้อสงสัย กรุณาติดต่อทีมงานที่อีเมล <a href="mailto:support@metaherb.co.th">support@metaherb.co.th</a></blockquote>
`.trim(),
      },
      {
        id: "TOS-CUST-020", version: "v2.0", status: "archived",
        createdAt: "2026-03-10", updatedAt: "2026-03-10",
        notes: "ปรับโครงสร้างหัวข้อ + ปรับภาษาให้กระชับ",
        html: `<h2>1. การยอมรับเงื่อนไข</h2><p>การเข้าใช้งานเว็บไซต์ MetaHerb ถือเป็นการยอมรับข้อกำหนด</p><h2>2. การใช้งาน</h2><p>ใช้บริการด้วยความสุจริต ไม่ขัดต่อกฎหมาย</p><h2>3. การคืนสินค้า</h2><p>ขอคืนได้ภายใน 14 วัน</p><blockquote>เวอร์ชันเก่า — ใช้ระยะ 1 เดือนแล้วถูกแทนที่ด้วย v2.1</blockquote>`,
      },
      {
        id: "TOS-CUST-015", version: "v1.5", status: "archived",
        createdAt: "2026-02-05", updatedAt: "2026-02-05",
        notes: "เพิ่มข้อกำหนดเรื่อง PDPA",
        html: `<h2>1. การยอมรับเงื่อนไข</h2><p>การใช้บริการ MetaHerb ถือว่าท่านยอมรับเงื่อนไข</p><h2>2. PDPA</h2><p>เราเก็บข้อมูลส่วนบุคคลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562</p><blockquote>เวอร์ชันแรกที่เพิ่มเรื่อง PDPA</blockquote>`,
      },
        ],
      },
      {
        id: "shop", label: "ร้านค้า", Icon: Store,
        files: [
      {
        id: "TOS-SHOP-014", version: "v1.4", status: "published",
        createdAt: "2026-04-10", updatedAt: "2026-04-10",
        notes: "ปรับเพดาน commission สูงสุดเป็น 8% (เดิม 7%)",
        html: `
<h2>1. คุณสมบัติร้านค้า</h2>
<p>ร้านค้าที่สมัครเปิดร้านบนแพลตฟอร์ม <strong>MetaHerb</strong> ต้องเป็นนิติบุคคลหรือบุคคลธรรมดาสัญชาติไทยที่จดทะเบียนพาณิชย์อย่างถูกต้อง</p>
<ul>
  <li>ต้องยื่นเอกสารยืนยันตัวตน (สำเนาบัตรประชาชน / หนังสือรับรองบริษัท / ใบทะเบียนพาณิชย์)</li>
  <li>ต้องมีบัญชีธนาคารในนามที่ตรงกับชื่อผู้ลงทะเบียน</li>
  <li>ผ่านการตรวจสอบและอนุมัติจากทีมงาน MetaHerb ก่อนเปิดขาย</li>
</ul>

<h2>2. ค่าธรรมเนียมและค่าคอมมิชชั่น</h2>
<p>ร้านค้าตกลงชำระค่าธรรมเนียมตามอัตราที่ระบุในตารางค่าบริการ ณ วันที่สมัคร</p>
<ol>
  <li><strong>ค่าคอมมิชชั่น:</strong> 5-8% ของยอดขายต่อรายการ (ตามหมวดสินค้า)</li>
  <li><strong>ค่าธรรมเนียมการชำระเงิน:</strong> 2.5% + 10 บาทต่อรายการ</li>
  <li><strong>ค่า service fee รายเดือน:</strong> ฟรีในปีแรก หลังจากนั้น 199 บาท/เดือน</li>
</ol>

<h2>3. การลงสินค้าและเนื้อหา</h2>
<p>ร้านค้าต้องลงสินค้าด้วยข้อมูลที่ถูกต้อง ครบถ้วน และไม่ทำให้ผู้บริโภคเข้าใจผิด</p>
<ul>
  <li>ภาพสินค้าต้องเป็นภาพจริง ไม่ละเมิดลิขสิทธิ์</li>
  <li>คำอธิบายต้องตรงกับสินค้าที่ส่งมอบ</li>
  <li>ราคาที่แสดงต้องเป็นราคารวม VAT แล้ว</li>
</ul>

<h2>4. สินค้าที่ห้ามจำหน่าย</h2>
<p>ร้านค้าห้ามลงสินค้าประเภทดังต่อไปนี้บนแพลตฟอร์ม MetaHerb อย่างเด็ดขาด</p>
<ul>
  <li>ยา / อาหารเสริมที่ไม่ผ่าน อย.</li>
  <li>ผลิตภัณฑ์ผิดกฎหมาย / สิ่งของผิดศีลธรรม</li>
  <li>สินค้าปลอม / สินค้าละเมิดลิขสิทธิ์</li>
  <li>อาวุธ / วัตถุอันตราย</li>
</ul>

<h2>5. การชำระเงินและการคืนเงิน</h2>
<p>ระบบจะโอนยอดขาย (หักค่าธรรมเนียม) เข้าบัญชีร้านค้าทุก ๆ <strong>15 วัน</strong> โดยอัตโนมัติ ในกรณีลูกค้าขอคืนเงิน ร้านค้าตกลงให้ MetaHerb หักเงินคืนจากยอดขายล็อตถัดไป</p>

<h2>6. ความรับผิดของร้านค้า</h2>
<p>ร้านค้าเป็นผู้รับผิดชอบเต็มจำนวนต่อ:</p>
<ul>
  <li>คุณภาพและความปลอดภัยของสินค้า</li>
  <li>การจัดส่งสินค้าตามเวลาที่ระบุ (ภายใน 3 วันทำการ)</li>
  <li>การให้บริการหลังการขาย</li>
  <li>ภาษีอากรที่เกี่ยวข้องกับการขาย</li>
</ul>

<h2>7. การยกเลิกการเป็นร้านค้า</h2>
<p>MetaHerb ขอสงวนสิทธิ์ในการระงับหรือยกเลิกบัญชีร้านค้าทันทีหากตรวจพบการละเมิดข้อกำหนด เช่น</p>
<ol>
  <li>ลงสินค้าที่ห้ามจำหน่าย</li>
  <li>ได้รับการร้องเรียนจากลูกค้าซ้ำเกิน 5 ครั้งใน 30 วัน</li>
  <li>ไม่ตอบสนองต่อคำสั่งซื้อภายใน 48 ชั่วโมง</li>
  <li>ฉ้อโกงหรือให้ข้อมูลเท็จ</li>
</ol>

<blockquote>สำหรับร้านค้า กรุณาติดต่อทีม Seller Support ที่ <a href="mailto:seller@metaherb.co.th">seller@metaherb.co.th</a> หรือ Line @metaherb-seller</blockquote>
`.trim(),
      },
      {
        id: "TOS-SHOP-015-DRAFT", version: "v1.5", status: "draft",
        createdAt: "2026-05-08", updatedAt: "2026-05-10",
        notes: "(ฉบับร่าง) เพิ่มเงื่อนไข Flash Sale + ปรับรอบโอนเงินเป็น 7 วัน",
        html: `<h2>(ฉบับร่าง) ข้อกำหนดร้านค้า v1.5</h2><p>กำลังจัดทำ — เพิ่มหัวข้อใหม่ดังนี้</p><h3>เงื่อนไข Flash Sale</h3><p>ร้านค้าต้องสำรองสต็อกขั้นต่ำ 50% ของจำนวนที่เข้าร่วม</p><h3>รอบการโอนเงิน</h3><p>ปรับจาก 15 วัน → <strong>7 วัน</strong> (เริ่ม 1 ก.ค. 2569)</p><blockquote>ยังไม่เผยแพร่ — รอ legal review</blockquote>`,
      },
      {
        id: "TOS-SHOP-013", version: "v1.3", status: "archived",
        createdAt: "2026-03-01", updatedAt: "2026-03-01",
        notes: "เริ่มใช้สำหรับร้านค้าชุดแรก",
        html: `<h2>1. คุณสมบัติร้านค้า</h2><p>เป็นนิติบุคคลไทย จดทะเบียนพาณิชย์</p><h2>2. ค่าธรรมเนียม</h2><p>Commission 7% ของยอดขาย</p><blockquote>เวอร์ชันแรกของข้อกำหนดร้านค้า</blockquote>`,
      },
        ],
      },
    ],
  },
  privacy: {
    title:    "นโยบายความเป็นส่วนตัว",
    subtitle: "วิธีการเก็บ ใช้ และคุ้มครองข้อมูลส่วนบุคคลของผู้ใช้",
    Icon:     Lock,
    color:    ADMIN_PRIMARY,
    audiences: [
      {
        id: "default", label: "ทั่วไป", Icon: Lock,
        files: [
      {
        id: "PRV-DEF-021", version: "v2.1", status: "published",
        createdAt: "2026-04-18", updatedAt: "2026-04-18",
        notes: "อัปเดตให้สอดคล้อง PDPA + เพิ่มข้อสิทธิ DPO",
        html: `
<h2>1. ข้อมูลที่เราเก็บ</h2>
<p>เราเก็บข้อมูลส่วนบุคคลที่จำเป็นสำหรับการให้บริการ ได้แก่</p>
<ul>
  <li>ชื่อ-นามสกุล อีเมล และเบอร์โทรศัพท์</li>
  <li>ที่อยู่สำหรับจัดส่งสินค้า</li>
  <li>ประวัติการสั่งซื้อและการใช้งานเว็บไซต์</li>
  <li>ข้อมูลการชำระเงิน (ผ่าน payment gateway ที่ปลอดภัย)</li>
</ul>

<h2>2. วัตถุประสงค์การใช้ข้อมูล</h2>
<p>ข้อมูลที่เก็บจะถูกนำไปใช้เพื่อ</p>
<ol>
  <li>ดำเนินการสั่งซื้อและจัดส่งสินค้า</li>
  <li>ติดต่อลูกค้าเรื่องคำสั่งซื้อหรือบริการหลังการขาย</li>
  <li>ส่งข่าวสาร โปรโมชัน (เฉพาะกรณีที่ลูกค้ายินยอม)</li>
  <li>ปรับปรุงบริการและประสบการณ์การใช้งาน</li>
</ol>

<h2>3. การเปิดเผยข้อมูล</h2>
<p>เราจะ<strong>ไม่เปิดเผย</strong>ข้อมูลส่วนบุคคลของท่านแก่บุคคลที่สาม ยกเว้นในกรณีที่จำเป็นสำหรับการให้บริการ เช่น บริษัทขนส่ง หรือเมื่อกฎหมายกำหนด</p>

<h2>4. การเก็บรักษาความปลอดภัย</h2>
<p>เราใช้มาตรการรักษาความปลอดภัยตามมาตรฐานสากล ทั้ง encryption ในการสื่อสาร (SSL/TLS) และการจัดเก็บข้อมูลในระบบที่มีการควบคุมการเข้าถึง</p>

<h2>5. สิทธิของเจ้าของข้อมูล</h2>
<p>ตาม PDPA ท่านมีสิทธิ</p>
<ul>
  <li>ขอเข้าถึงและรับสำเนาข้อมูลส่วนบุคคล</li>
  <li>ขอแก้ไขข้อมูลที่ไม่ถูกต้อง</li>
  <li>ขอลบหรือระงับการใช้ข้อมูล</li>
  <li>ถอนความยินยอมในการรับการสื่อสารทางการตลาด</li>
</ul>

<h2>6. การติดต่อ</h2>
<p>หากมีคำถามเกี่ยวกับนโยบายฉบับนี้ ติดต่อเจ้าหน้าที่คุ้มครองข้อมูล (DPO) ได้ที่ <a href="mailto:dpo@metaherb.co.th">dpo@metaherb.co.th</a></p>

<blockquote>นโยบายนี้สอดคล้องกับ พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA)</blockquote>
`.trim(),
      },
      {
        id: "PRV-DEF-020", version: "v2.0", status: "archived",
        createdAt: "2026-02-15", updatedAt: "2026-02-15",
        notes: "เริ่มอ้างอิง PDPA",
        html: `<h2>1. ข้อมูลที่เราเก็บ</h2><p>ชื่อ อีเมล เบอร์โทร ที่อยู่จัดส่ง</p><h2>2. วัตถุประสงค์</h2><p>เพื่อให้บริการและปรับปรุง UX</p><h2>3. การติดต่อ</h2><p><a href="mailto:dpo@metaherb.co.th">dpo@metaherb.co.th</a></p><blockquote>เวอร์ชันก่อนปรับโครงเป็น 6 หัวข้อ</blockquote>`,
      },
        ],
      },
    ],
  },
};

function fmtThaiDate(iso: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear() + 543}`;
}

function bumpVersion(v: string, kind: "minor" | "major" = "minor"): string {
  const m = v.match(/^v(\d+)\.(\d+)$/);
  if (!m) return v;
  const major = Number(m[1]); const minor = Number(m[2]);
  return kind === "major" ? `v${major + 1}.0` : `v${major}.${minor + 1}`;
}

// ===== Single file editor (ใช้ใน detail view) — preview ↔ edit + save back to caller =====
function LegalFileEditor({ doc, file, onSave, onBack }: {
  doc: typeof legalDocs[LegalDocId];
  file: LegalFile;
  onSave: (next: LegalFile) => void;
  onBack: () => void;
}) {
  const [html, setHtml]     = useState(file.html);
  const [savedHtml, setSavedHtml] = useState(file.html);
  const [bodyVersion, setBodyVersion] = useState(0);
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  React.useEffect(() => {
    setHtml(file.html); setSavedHtml(file.html); setBodyVersion((v) => v + 1); setMode("preview");
  }, [file.id]);

  const isDirty = html !== savedHtml;

  const handleSave = () => {
    const today = new Date().toISOString().slice(0, 10);
    setSavedHtml(html);
    onSave({ ...file, html, updatedAt: today });
    toast.success("บันทึกการเปลี่ยนแปลงแล้ว");
    setMode("preview");
  };
  const handleCancel = () => {
    if (isDirty && !confirm("ยกเลิกการเปลี่ยนแปลงทั้งหมด?")) return;
    setHtml(savedHtml); setBodyVersion((v) => v + 1); setMode("preview");
  };

  const sColor = fileStatusColors[file.status];
  const wordCount = (savedHtml.replace(/<[^>]+>/g, " ").trim().split(/\s+/) || []).length;

  return (
    <div>
      {/* Back */}
      <div className="mb-5">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{doc.title}</h2>
            <span className={`${font} inline-flex items-center gap-1 tabular-nums px-2 py-0.5 rounded-full text-[11px]`}
              style={{ backgroundColor: `${doc.color}1a`, color: doc.color, fontWeight: 700 }}>
              <FileText className="size-2.5" strokeWidth={2.6} />
              {file.version}
            </span>
            <span className={`${font} inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full`}
              style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 600 }}>
              <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
              {fileStatusLabels[file.status]}
            </span>
            {mode === "edit" && (
              <span className={`${font} inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-[#9747ff]/12 text-[#9747ff]`} style={{ fontWeight: 600 }}>
                <Pencil className="size-2.5" strokeWidth={2.6} />
                กำลังแก้ไข
              </span>
            )}
            {mode === "edit" && isDirty && (
              <span className={`${font} inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full bg-[#ff9500]/12 text-[#ff9500]`} style={{ fontWeight: 600 }}>
                <span className="size-1.5 rounded-full bg-[#ff9500] animate-pulse" />
                ยังไม่ได้บันทึก
              </span>
            )}
          </div>
          <p className={`${font} text-[13px] text-gray-500 mt-1 inline-flex items-center gap-3 flex-wrap`}>
            <span className="inline-flex items-center gap-1.5">
              <CalendarIcon className="size-3 text-gray-400" strokeWidth={2.4} />
              อัปเดต <span className="text-black tabular-nums" style={{ fontWeight: 500 }}>{fmtThaiDate(file.updatedAt)}</span>
            </span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1.5 tabular-nums">
              <FileText className="size-3 text-gray-400" strokeWidth={2.4} />
              {wordCount.toLocaleString()} คำ
            </span>
            <span className="text-gray-300">·</span>
            <span className="text-gray-400 tabular-nums">{file.id}</span>
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {mode === "preview" ? (
            <motion.button onClick={() => setMode("edit")}
              whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}>
              <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center">
                <Pencil className="size-[14px]" strokeWidth={2.6} />
              </span>
              <span style={{ fontWeight: 600 }}>แก้ไขเนื้อหา</span>
            </motion.button>
          ) : (
            <>
              <motion.button onClick={handleCancel} whileTap={{ scale: 0.96 }}
                className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 h-[38px] rounded-full cursor-pointer transition-colors`}
                style={{ fontWeight: 500 }}>
                <X className="size-3.5" strokeWidth={2.4} />
                ยกเลิก
              </motion.button>
              <motion.button onClick={handleSave} disabled={!isDirty}
                whileTap={isDirty ? { scale: 0.96 } : undefined} whileHover={isDirty ? { y: -1 } : undefined}
                className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)] ${isDirty ? "cursor-pointer hover:bg-[#267a43]" : "opacity-50 cursor-not-allowed"}`}>
                <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center">
                  <Save className="size-[14px]" strokeWidth={2.6} />
                </span>
                <span style={{ fontWeight: 600 }}>บันทึก</span>
              </motion.button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-5">
      {/* Notes (changelog) */}
      {file.notes && (
        <div className="bg-[#319754]/5 border border-[#319754]/20 rounded-xl p-3 flex items-start gap-2.5">
          <Info className="size-3.5 text-[#319754] shrink-0 mt-0.5" strokeWidth={2.4} />
          <div>
            <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600 }}>โน้ตเวอร์ชันนี้</p>
            <p className={`${font} text-[12px] text-gray-700 mt-0.5`}>{file.notes}</p>
          </div>
        </div>
      )}

      {/* Body */}
      {mode === "preview" ? (
        <FormSection icon={doc.Icon} iconColor={doc.color} title="ตัวอย่างเนื้อหา"
          desc="แสดงผลตามที่จะปรากฏบนหน้าเว็บไซต์ — กดปุ่ม 'แก้ไขเนื้อหา' เพื่อเริ่มแก้ไข">
          {savedHtml.replace(/<[^>]+>/g, "").trim().length === 0 ? (
            <div className={`py-16 text-center ${font} text-[13px] text-gray-400`}>ยังไม่มีเนื้อหา</div>
          ) : (
            <div className={`${font} legal-preview text-[15px] text-black leading-[1.85]`}
              dangerouslySetInnerHTML={{ __html: savedHtml }} />
          )}
          <style>{`
            .legal-preview h1 { font-size: 28px; font-weight: 700; margin: 18px 0 10px; line-height: 1.3; }
            .legal-preview h2 { font-size: 22px; font-weight: 700; margin: 18px 0 8px;  line-height: 1.35; color: ${doc.color}; }
            .legal-preview h3 { font-size: 18px; font-weight: 600; margin: 14px 0 6px;  line-height: 1.4; }
            .legal-preview p  { margin: 8px 0; }
            .legal-preview ul { list-style: disc;    padding-left: 28px; margin: 10px 0; }
            .legal-preview ol { list-style: decimal; padding-left: 28px; margin: 10px 0; }
            .legal-preview li { margin: 4px 0; }
            .legal-preview blockquote {
              border-left: 4px solid ${doc.color}; padding: 10px 18px; margin: 14px 0;
              background: ${doc.color}0d; border-radius: 0 10px 10px 0; color: #404040; font-style: italic;
            }
            .legal-preview a { color: ${doc.color}; text-decoration: underline; text-underline-offset: 2px; }
            .legal-preview a:hover { opacity: 0.8; }
            .legal-preview strong { font-weight: 700; }
          `}</style>
        </FormSection>
      ) : (
        <FormSection icon={Pencil} iconColor={doc.color} title="แก้ไขเนื้อหา"
          desc="แต่งฟอร์แมต ใส่ลิงก์ ไฮไลต์ และจัดวางได้ — กดบันทึกเพื่อเผยแพร่">
          <RichTextEditor key={`legal-${file.id}-${bodyVersion}`} value={html} onChange={setHtml} />
        </FormSection>
      )}
      </div>
    </div>
  );
}

// ===== AI content arranger (legal-aware) =====
type ArrangeMode = "merge" | "append" | "rewrite";
const ARRANGE_MODES: { id: ArrangeMode; label: string; desc: string; Icon: any }[] = [
  { id: "merge",   label: "รวมและจัดใหม่", desc: "แทรกเนื้อหาใหม่ + จัดเรียงใหม่ทั้งเอกสาร",  Icon: Wand2 },
  { id: "append",  label: "เพิ่มต่อท้าย",   desc: "ใส่หัวข้อใหม่ต่อจากเนื้อหาเดิม",                Icon: Plus },
  { id: "rewrite", label: "เขียนใหม่หมด",   desc: "ทิ้งเนื้อหาเดิม เขียนใหม่ตามคำบรรยาย",      Icon: RemoveFormatting },
];

function mockArrangeLegalContent(opts: { currentHtml: string; brief: string; mode: ArrangeMode; docTitle: string }): string {
  const { currentHtml, brief, mode, docTitle } = opts;
  const briefShort = brief.length > 60 ? brief.slice(0, 60) + "..." : brief;
  const today = new Date();
  const months = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const dateStr = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear() + 543}`;

  // Parse brief for keywords/topics
  const sentences = brief.split(/[.!?\n]+/).map((s) => s.trim()).filter((s) => s.length > 0);
  const mainTopic = sentences[0] || "เนื้อหาใหม่";
  const headerTitle = mainTopic.length > 35 ? mainTopic.slice(0, 35) + "..." : mainTopic;

  // Generated new sections (mock — สังเคราะห์จาก brief)
  const newSections = `
<h2>${headerTitle}</h2>
<p>${brief}</p>
<h3>รายละเอียดสำคัญ</h3>
<ul>
  <li>ข้อกำหนดเพิ่มเติมตามที่ระบุในการอัปเดตวันที่ <strong>${dateStr}</strong></li>
  ${sentences.slice(1, 4).map((s) => `<li>${s}</li>`).join("\n  ") || "<li>เงื่อนไขเป็นไปตามที่ผู้ดูแลกำหนด</li>"}
  <li>ผู้ใช้มีหน้าที่ตรวจสอบและยอมรับเงื่อนไขก่อนใช้บริการ</li>
</ul>
<blockquote>หมายเหตุ: ข้อกำหนดส่วนนี้เพิ่มเติมจาก "${briefShort}" และมีผลบังคับใช้ตั้งแต่วันที่ปรับปรุงเป็นต้นไป</blockquote>
`.trim();

  if (mode === "rewrite") {
    return `
<h2>${docTitle} — ฉบับปรับปรุง</h2>
<p>เอกสารฉบับนี้จัดทำขึ้นใหม่ทั้งหมด โดยอ้างอิงจากคำบรรยาย: <em>"${brief}"</em></p>

${newSections}

<h2>บทสรุป</h2>
<p>ผู้ใช้ที่เข้าใช้บริการถือว่ายอมรับข้อกำหนดที่ระบุในเอกสารฉบับนี้ทั้งหมด การฝ่าฝืนอาจส่งผลต่อสิทธิการใช้งาน</p>
`.trim();
  }

  if (mode === "append") {
    return `${currentHtml}\n\n${newSections}`;
  }

  // merge — แทรกเนื้อหาใหม่ระหว่างเนื้อหาเดิม + เพิ่ม header สรุปการเปลี่ยน
  const sections = currentHtml.split(/(?=<h2)/g).filter((s) => s.trim());
  if (sections.length > 1) {
    const mid = Math.floor(sections.length / 2);
    const before = sections.slice(0, mid).join("\n");
    const after  = sections.slice(mid).join("\n");
    return `${before}\n\n${newSections}\n\n${after}`;
  }
  return `${currentHtml}\n\n${newSections}`;
}

function LegalAIDialog({ open, onClose, currentHtml, docTitle, onApply }: {
  open: boolean;
  onClose: () => void;
  currentHtml: string;
  docTitle: string;
  onApply: (html: string) => void;
}) {
  const [brief, setBrief]       = useState("");
  const [mode, setMode]         = useState<ArrangeMode>("merge");
  const [busy, setBusy]         = useState(false);
  const [generated, setGenerated] = useState<string | null>(null);

  React.useEffect(() => {
    if (open) { setBrief(""); setMode("merge"); setBusy(false); setGenerated(null); }
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !busy) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener("keydown", onKey); };
  }, [open, busy, onClose]);

  const hasCurrentContent = currentHtml.replace(/<[^>]+>/g, "").trim().length > 0;
  const currentWordCount = (currentHtml.replace(/<[^>]+>/g, " ").trim().split(/\s+/) || []).length;

  const handleGenerate = () => {
    if (!brief.trim()) { toast.error("กรุณาใส่คำบรรยาย"); return; }
    setBusy(true);
    setTimeout(() => {
      const html = mockArrangeLegalContent({ currentHtml, brief: brief.trim(), mode, docTitle });
      setGenerated(html);
      setBusy(false);
    }, 1500);
  };

  const handleApply = () => {
    if (!generated) return;
    onApply(generated);
    onClose();
    toast.success("ใส่เนื้อหาที่ AI จัดให้แล้ว");
  };

  const handleRegenerate = () => { setGenerated(null); };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => { if (!busy) onClose(); }}>
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-[20px] w-full max-w-[640px] max-h-[90vh] overflow-hidden flex flex-col shadow-[0_20px_50px_-10px_rgba(0,0,0,0.3)]">

          {/* Header */}
          <div className="bg-gradient-to-br from-[#319754]/10 to-[#9747ff]/10 border-b border-gray-100 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-gradient-to-br from-[#319754] to-[#9747ff] flex items-center justify-center shadow-[0_4px_14px_rgba(151,71,255,0.35)]">
                <Sparkles className="size-5 text-white" strokeWidth={2.2} />
              </div>
              <div>
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 700 }}>จัดเนื้อหาด้วย AI</p>
                <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เพิ่มเนื้อหาใหม่ + AI จัดเรียงให้ใหม่ทั้งเอกสาร</p>
              </div>
            </div>
            <button onClick={onClose} disabled={busy}
              className={`size-8 rounded-full inline-flex items-center justify-center transition-colors ${busy ? "opacity-40 cursor-not-allowed" : "hover:bg-white/60 cursor-pointer"}`}>
              <X className="size-4 text-gray-600" strokeWidth={2.4} />
            </button>
          </div>

          {/* Body */}
          <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
            {generated == null ? (
              <>
                {/* Current content summary */}
                <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="size-4 text-[#319754] shrink-0" strokeWidth={2.2} />
                    <div className="min-w-0">
                      <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 600 }}>เนื้อหาปัจจุบัน</p>
                      <p className={`${font} text-[10px] text-gray-500 mt-0.5 tabular-nums`}>
                        {hasCurrentContent ? `${currentWordCount.toLocaleString()} คำ` : "ยังไม่มีเนื้อหา"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brief */}
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
                    คำบรรยายเนื้อหาใหม่ <span className="text-[#ff3b30]">*</span>
                  </label>
                  <textarea value={brief} onChange={(e) => setBrief(e.target.value)} disabled={busy}
                    placeholder="เช่น เพิ่มข้อกำหนดเรื่องการคืนสินค้าใน 30 วัน · เงื่อนไข Flash Sale · ข้อจำกัด API rate limit ..."
                    rows={5}
                    className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none`}
                    style={{ fontWeight: 500 }} />
                  <p className={`${font} text-[10px] text-gray-400 pl-3 tabular-nums`}>{brief.length} ตัวอักษร · บรรยายชัดเจน AI จัดได้ตรงประเด็น</p>
                </div>

                {/* Mode picker */}
                <div className="flex flex-col gap-1.5">
                  <label className={`${font} text-[12px] text-gray-500`}>วิธีรวมเนื้อหา</label>
                  <div className="flex flex-col gap-2">
                    {ARRANGE_MODES.map((m) => {
                      const isAct = mode === m.id;
                      const isDisabled = !hasCurrentContent && m.id !== "rewrite";
                      return (
                        <button key={m.id}
                          onClick={() => !busy && !isDisabled && setMode(m.id)}
                          disabled={busy || isDisabled}
                          className={`flex items-start gap-3 p-3 rounded-2xl text-left transition-all border-2 ${
                            isDisabled ? "opacity-40 cursor-not-allowed bg-gray-50 border-transparent" :
                            busy ? "opacity-50 cursor-not-allowed border-transparent bg-[#fafafa]" :
                            isAct ? "bg-[#319754]/8 border-[#319754] cursor-pointer" : "bg-[#fafafa] border-transparent hover:bg-white cursor-pointer"
                          }`}>
                          <span className="size-9 rounded-xl flex items-center justify-center shrink-0"
                            style={{ backgroundColor: isAct ? ADMIN_PRIMARY : `${ADMIN_PRIMARY}15`, color: isAct ? "#fff" : ADMIN_PRIMARY }}>
                            <m.Icon className="size-4" strokeWidth={2.2} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className={`${font} text-[13px]`} style={{ fontWeight: 600, color: isAct ? "#319754" : "#171717" }}>{m.label}</p>
                            <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{m.desc}</p>
                          </div>
                          {isAct && <Check className="size-4 text-[#319754] shrink-0 mt-1" strokeWidth={2.6} />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              // === Preview generated content ===
              <>
                <div className="bg-[#319754]/8 border border-[#319754]/20 rounded-2xl p-3 flex items-start gap-2.5">
                  <Sparkles className="size-4 text-[#319754] shrink-0 mt-0.5" strokeWidth={2.4} />
                  <div className="min-w-0">
                    <p className={`${font} text-[12px] text-[#319754]`} style={{ fontWeight: 600 }}>AI จัดเนื้อหาเสร็จแล้ว</p>
                    <p className={`${font} text-[10px] text-gray-600 mt-0.5`}>
                      โหมด: <span style={{ fontWeight: 600 }}>{ARRANGE_MODES.find((x) => x.id === mode)?.label}</span> · {(generated.replace(/<[^>]+>/g, " ").trim().split(/\s+/) || []).length.toLocaleString()} คำ
                    </p>
                  </div>
                </div>
                <div className={`${font} legal-preview-mini bg-[#fafafa] border border-gray-100 rounded-2xl px-5 py-4 max-h-[360px] overflow-y-auto text-[13px] leading-[1.7]`}
                  dangerouslySetInnerHTML={{ __html: generated }} />
                <style>{`
                  .legal-preview-mini h1 { font-size: 22px; font-weight: 700; margin: 12px 0 8px; line-height: 1.3; }
                  .legal-preview-mini h2 { font-size: 17px; font-weight: 700; margin: 12px 0 6px; line-height: 1.35; color: #319754; }
                  .legal-preview-mini h3 { font-size: 14px; font-weight: 600; margin: 10px 0 4px; line-height: 1.4; }
                  .legal-preview-mini p  { margin: 6px 0; }
                  .legal-preview-mini ul { list-style: disc;    padding-left: 20px; margin: 6px 0; }
                  .legal-preview-mini ol { list-style: decimal; padding-left: 20px; margin: 6px 0; }
                  .legal-preview-mini blockquote {
                    border-left: 3px solid #319754; padding: 6px 12px; margin: 8px 0;
                    background: rgba(49,151,84,0.06); border-radius: 0 6px 6px 0; color: #404040; font-style: italic; font-size: 12px;
                  }
                `}</style>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-[#fafafa] border-t border-gray-100 px-5 py-3 flex items-center justify-between gap-3 shrink-0">
            <p className={`${font} text-[10px] text-gray-500 inline-flex items-center gap-1.5`}>
              <Info className="size-3 text-gray-400" strokeWidth={2.4} />
              {generated ? "ตรวจทานก่อนกดใช้" : "AI จะใช้เนื้อหาปัจจุบัน + คำบรรยายเพื่อจัดเรียงใหม่"}
            </p>
            {generated == null ? (
              <div className="flex items-center gap-2">
                <button onClick={onClose} disabled={busy}
                  className={`${font} inline-flex items-center gap-1.5 text-[12px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-4 h-[34px] rounded-full transition-colors ${busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                  style={{ fontWeight: 500 }}>ยกเลิก</button>
                <motion.button onClick={handleGenerate} disabled={busy || !brief.trim()}
                  whileTap={!busy && brief.trim() ? { scale: 0.96 } : undefined} whileHover={!busy && brief.trim() ? { scale: 1.03 } : undefined}
                  className={`${font} inline-flex items-center gap-2 text-[12px] text-white px-4 h-[34px] rounded-full transition-colors shadow-[0_4px_14px_rgba(151,71,255,0.35)] ${busy || !brief.trim() ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                  style={{ background: "linear-gradient(135deg, #319754 0%, #9747ff 100%)", fontWeight: 600 }}>
                  {busy
                    ? (<><Loader2 className="size-3.5 animate-spin" strokeWidth={2.4} /> AI กำลังจัด...</>)
                    : (<><Wand2 className="size-3.5" strokeWidth={2.4} /> ให้ AI จัด</>)}
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={handleRegenerate}
                  className={`${font} inline-flex items-center gap-1.5 text-[12px] text-[#9747ff] bg-[#9747ff]/10 hover:bg-[#9747ff]/20 px-4 h-[34px] rounded-full cursor-pointer transition-colors`}
                  style={{ fontWeight: 600 }}>
                  <Wand2 className="size-3.5" strokeWidth={2.4} />
                  ลองใหม่
                </button>
                <motion.button onClick={handleApply}
                  whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
                  className={`${font} inline-flex items-center gap-2 text-[12px] text-white px-4 h-[34px] rounded-full cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
                  style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 600 }}>
                  <Check className="size-3.5" strokeWidth={2.6} />
                  ใช้เนื้อหานี้
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ===== Create-new-version page (write document directly) =====
function LegalCreateView({ doc, audiences, initialAudienceId, onCancel, onCreate }: {
  doc: typeof legalDocs[LegalDocId];
  audiences: LegalAudience[];
  initialAudienceId: AudienceId;
  onCancel: () => void;
  onCreate: (audienceId: AudienceId, file: LegalFile) => void;
}) {
  const blankHtml = `<h2>เริ่มเขียนเนื้อหาที่นี่...</h2><p>ระบุข้อกำหนดและเงื่อนไขที่ต้องการ</p>`;
  const [audienceId, setAudienceId] = useState<AudienceId>(initialAudienceId);
  const audience = audiences.find((a) => a.id === audienceId) || audiences[0];
  const sortedFiles = [...audience.files].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  const latest = sortedFiles[0];

  // Default: เริ่มจากเอกสารเปล่า + version bump major
  const [version, setVersion] = useState(bumpVersion(latest?.version || "v1.0", "major"));
  const [notes, setNotes] = useState("");
  const [html, setHtml] = useState(blankHtml);
  const [bodyVersion, setBodyVersion] = useState(0);
  const [copyFromId, setCopyFromId] = useState<string>("blank");
  const [aiOpen, setAiOpen] = useState(false);

  // Re-init เมื่อสลับ audience — รีเซ็ตเป็นเอกสารเปล่าด้วย
  React.useEffect(() => {
    const a = audiences.find((x) => x.id === audienceId) || audiences[0];
    const newSorted = [...a.files].sort((x, y) => (x.updatedAt < y.updatedAt ? 1 : -1));
    const newLatest = newSorted[0];
    setHtml(blankHtml);
    setVersion(bumpVersion(newLatest?.version || "v1.0", "major"));
    setCopyFromId("blank");
    setBodyVersion((v) => v + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audienceId]);

  const switchAudience = (id: AudienceId) => {
    if (html !== (sortedFiles.find((f) => f.id === copyFromId)?.html || blankHtml)) {
      if (!confirm("เปลี่ยนกลุ่มจะเขียนทับเนื้อหาที่กำลังเขียน — ดำเนินการต่อ?")) return;
    }
    setAudienceId(id);
  };

  const handleAIApply = (newHtml: string) => {
    setHtml(newHtml);
    setBodyVersion((v) => v + 1);
  };

  const handleSourceChange = (sourceId: string) => {
    if (html !== (sortedFiles.find((f) => f.id === copyFromId)?.html || blankHtml)) {
      if (!confirm("เปลี่ยนแหล่งต้นฉบับจะเขียนทับเนื้อหาที่กำลังเขียน — ดำเนินการต่อ?")) return;
    }
    setCopyFromId(sourceId);
    if (sourceId === "blank") {
      setHtml(blankHtml);
      setVersion(bumpVersion(latest?.version || "v1.0", "major"));
    } else {
      const src = sortedFiles.find((f) => f.id === sourceId);
      if (src) {
        setHtml(src.html);
        setVersion(bumpVersion(src.version, "minor"));
      }
    }
    setBodyVersion((v) => v + 1);
  };

  const versionExists = audience.files.some((f) => f.version === version);
  const versionValid = /^v\d+\.\d+$/.test(version);
  const hasContent = html.replace(/<[^>]+>/g, "").trim().length > 0;
  const canCreate = versionValid && !versionExists && hasContent;

  const handleSubmit = () => {
    const today = new Date().toISOString().slice(0, 10);
    const file: LegalFile = {
      id: `${doc.title.replace(/\s+/g, "")}-${audience.id.toUpperCase()}-${Date.now().toString().slice(-6)}-DRAFT`,
      version,
      status: "draft",
      html,
      createdAt: today, updatedAt: today,
      notes: notes.trim() || (copyFromId === "blank"
        ? "เริ่มจากเอกสารเปล่า"
        : `อ้างอิงจาก ${sortedFiles.find((f) => f.id === copyFromId)?.version || "?"}`),
    };
    onCreate(audienceId, file);
    toast.success(`สร้างฉบับร่าง ${version} สำหรับ${audience.label}`);
  };

  const wordCount = (html.replace(/<[^>]+>/g, " ").trim().split(/\s+/) || []).length;

  return (
    <div>
      {/* Back button — pattern เดียวกับ ArticleEditView/VideoEditView */}
      <div className="mb-5">
        <button onClick={onCancel}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
      </div>

      {/* Header — pattern เดียวกับหน้า edit อื่น */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>เขียนเอกสารใหม่</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>
            {doc.title}{audience.label && <> · สำหรับ{audience.label}</>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onCancel}
            className={`${font} inline-flex items-center gap-1.5 text-[13px] text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-5 h-[36px] rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            ยกเลิก
          </button>
          <motion.button onClick={handleSubmit} disabled={!canCreate}
            whileTap={canCreate ? { scale: 0.96 } : undefined} whileHover={canCreate ? { scale: 1.03 } : undefined}
            className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] ${canCreate ? "cursor-pointer" : "opacity-50 cursor-not-allowed"}`}
            style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
            <Save className="size-4" strokeWidth={2.4} />
            บันทึกฉบับร่าง
          </motion.button>
        </div>
      </div>

      {/* 2-col layout: editor left, meta sidebar right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT: editor (col-span-2) */}
        <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">
          <FormSection icon={Pencil} iconColor={doc.color} title="เนื้อหาเอกสาร"
            desc="เขียนเนื้อหาทั้งหมด — แต่งฟอร์แมต ใส่ลิงก์ ไฮไลต์ จัดวางได้"
            action={
              <motion.button onClick={() => setAiOpen(true)}
                whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.04 }}
                transition={{ type: "spring", stiffness: 380, damping: 22 }}
                className={`${font} group relative inline-flex items-center gap-1.5 text-[12px] text-white pl-2.5 pr-3.5 h-8 rounded-full cursor-pointer overflow-hidden shadow-[0_4px_14px_rgba(151,71,255,0.3)]`}
                style={{ background: "linear-gradient(135deg, #319754 0%, #9747ff 100%)", fontWeight: 600 }}>
                <span className="size-5 rounded-full bg-white/25 inline-flex items-center justify-center">
                  <Sparkles className="size-3 text-white" strokeWidth={2.4} />
                </span>
                จัดด้วย AI
              </motion.button>
            }>
            <RichTextEditor key={`legal-create-${bodyVersion}`} value={html} onChange={setHtml} />
          </FormSection>
        </div>

        {/* RIGHT: meta sidebar */}
        <div className="flex flex-col gap-5 min-w-0 lg:sticky lg:top-5">
          {/* Audience picker — โผล่เฉพาะถ้ามี > 1 audience */}
          {audiences.length > 1 && (
            <FormSection icon={Users} iconColor={ADMIN_PRIMARY} title="เขียนเอกสารสำหรับ"
              desc="เลือกกลุ่มผู้ใช้ที่เอกสารนี้บังคับใช้">
              <div className="grid grid-cols-2 gap-2">
                {audiences.map((a) => {
                  const isAct = audienceId === a.id;
                  const audDesc =
                    a.id === "shop" ? "ร้านค้าที่ขายบนแพลตฟอร์ม" :
                    a.id === "customer" ? "ลูกค้าที่ซื้อสินค้า" :
                    "ผู้ใช้ทั่วไป";
                  return (
                    <button key={a.id} onClick={() => switchAudience(a.id)}
                      className={`relative flex flex-col items-start gap-2 p-3 rounded-2xl text-left transition-all border-2 ${
                        isAct ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] cursor-pointer" : "bg-[#fafafa] border-transparent hover:bg-white cursor-pointer"
                      }`}
                      style={isAct ? { borderColor: ADMIN_PRIMARY } : {}}>
                      {isAct && (
                        <span className="absolute top-2 right-2 size-4 rounded-full flex items-center justify-center" style={{ backgroundColor: ADMIN_PRIMARY }}>
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                        </span>
                      )}
                      <span className="size-9 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: isAct ? ADMIN_PRIMARY : `${ADMIN_PRIMARY}15`, color: isAct ? "#fff" : ADMIN_PRIMARY }}>
                        <a.Icon className="size-4" strokeWidth={2.2} />
                      </span>
                      <p className={`${font} text-[13px]`} style={{ fontWeight: 700, color: isAct ? ADMIN_PRIMARY : "#171717" }}>
                        {a.label}
                      </p>
                      <p className={`${font} text-[10px] text-gray-500 leading-snug`}>{audDesc}</p>
                      <p className={`${font} text-[9px] text-gray-400 tabular-nums mt-0.5`}>มี {a.files.length} เวอร์ชัน</p>
                    </button>
                  );
                })}
              </div>
            </FormSection>
          )}

          {/* Version */}
          <FormSection icon={Tag} iconColor="#0088ff" title="หมายเลขเวอร์ชัน" desc="รูปแบบ vX.Y">
            <div className="flex flex-col gap-1.5">
              <input value={version} onChange={(e) => setVersion(e.target.value)}
                placeholder="v2.2"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-5 text-[15px] tabular-nums outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all text-center`}
                style={{ fontWeight: 700 }} />
              {!versionValid && version.length > 0 ? (
                <p className={`${font} text-[11px] text-[#ff3b30] inline-flex items-center gap-1.5 pl-3`}>
                  <AlertCircle className="size-3" strokeWidth={2.4} />
                  รูปแบบไม่ถูกต้อง — ใช้ vX.Y
                </p>
              ) : versionExists ? (
                <p className={`${font} text-[11px] text-[#ff3b30] inline-flex items-center gap-1.5 pl-3`}>
                  <AlertCircle className="size-3" strokeWidth={2.4} />
                  เวอร์ชัน {version} มีอยู่แล้ว
                </p>
              ) : (
                <p className={`${font} text-[11px] text-[#319754] inline-flex items-center gap-1.5 pl-3`}>
                  <Check className="size-3" strokeWidth={2.6} />
                  ใช้ได้
                </p>
              )}
            </div>
          </FormSection>

          {/* Notes */}
          <FormSection icon={Info} iconColor="#9747ff" title="โน้ตเวอร์ชัน" desc="สรุป changelog ของเวอร์ชันนี้">
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="เช่น เพิ่มข้อ 4 เรื่อง..."
              rows={4}
              className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none w-full`}
              style={{ fontWeight: 500 }} />
            <p className={`${font} text-[10px] text-gray-400 pl-3 mt-1.5`}>เว้นว่างได้ ระบบจะใส่อัตโนมัติ</p>
          </FormSection>

          {/* Source picker */}
          <FormSection icon={ScrollText} iconColor={ADMIN_PRIMARY} title="แหล่งต้นฉบับ" desc="ทำสำเนาเนื้อหาจากเวอร์ชันที่มี">
            <div className="relative">
              <FileText className="size-3.5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
              <select value={copyFromId} onChange={(e) => handleSourceChange(e.target.value)}
                className={`${font} bg-[#fafafa] h-11 w-full rounded-full pl-10 pr-9 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all appearance-none cursor-pointer`}
                style={{ fontWeight: 500 }}>
                <option value="blank">📄 เริ่มจากเอกสารเปล่า</option>
                {sortedFiles.map((f) => (
                  <option key={f.id} value={f.id}>{f.version} · {fileStatusLabels[f.status]}</option>
                ))}
              </select>
              <ChevronDown className="size-3.5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.4} />
            </div>
            <p className={`${font} text-[10px] text-gray-400 pl-3 mt-1.5`}>เปลี่ยนแหล่งจะเขียนทับเนื้อหาในตัวแก้ไข</p>
          </FormSection>

          {/* Tip */}
          <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-3 flex items-start gap-2">
            <AlertCircle className="size-3.5 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2.2} />
            <p className={`${font} text-[10px] text-gray-600 leading-relaxed`}>
              สร้างเป็น <span style={{ fontWeight: 600 }}>ฉบับร่าง</span> · กด "ตั้งเป็นเวอร์ชันใช้งาน" ในรายการเมื่อพร้อมเผยแพร่
            </p>
          </div>
        </div>
      </div>

      {/* AI arrange dialog */}
      <LegalAIDialog
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        currentHtml={html}
        docTitle={doc.title}
        onApply={handleAIApply} />
    </div>
  );
}

// ===== Main LegalContent — list of versions per audience + click to edit =====
function LegalContent({ docId }: { docId: LegalDocId }) {
  const docMeta = legalDocs[docId];
  // Working copy of audiences (mutable in state — รองรับ create/update/delete)
  const [audiences, setAudiences] = useState<LegalAudience[]>(() => docMeta.audiences.map((a) => ({ ...a, files: [...a.files] })));
  const [audienceId, setAudienceId] = useState<AudienceId>(audiences[0].id);
  const [openFileId, setOpenFileId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Reset when docId changes
  React.useEffect(() => {
    const fresh = legalDocs[docId].audiences.map((a) => ({ ...a, files: [...a.files] }));
    setAudiences(fresh);
    setAudienceId(fresh[0].id);
    setOpenFileId(null);
    setCreating(false);
  }, [docId]);

  const audience = audiences.find((a) => a.id === audienceId) || audiences[0];
  const files = [...audience.files].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  const openFile = openFileId ? audience.files.find((f) => f.id === openFileId) || null : null;

  const updateAudience = (mut: (a: LegalAudience) => LegalAudience) => {
    setAudiences((prev) => prev.map((x) => x.id === audienceId ? mut(x) : x));
  };

  const handleSaveFile = (next: LegalFile) => {
    updateAudience((a) => ({ ...a, files: a.files.map((f) => f.id === next.id ? next : f) }));
  };

  const handleStartCreate = () => setCreating(true);

  const handleConfirmCreate = (targetAudienceId: AudienceId, file: LegalFile) => {
    setAudiences((prev) => prev.map((x) => x.id === targetAudienceId ? { ...x, files: [file, ...x.files] } : x));
    setAudienceId(targetAudienceId);
    setCreating(false);
    setOpenFileId(file.id);
  };

  const handleDuplicate = (f: LegalFile) => {
    const newVersion = bumpVersion(f.version, "minor");
    const today = new Date().toISOString().slice(0, 10);
    const dup: LegalFile = {
      id: `${docId.toUpperCase()}-${audienceId.toUpperCase()}-${Date.now().toString().slice(-6)}-DRAFT`,
      version: newVersion,
      status: "draft",
      html: f.html, createdAt: today, updatedAt: today,
      notes: `ทำสำเนาจาก ${f.version}`,
    };
    updateAudience((a) => ({ ...a, files: [dup, ...a.files] }));
    toast.success(`ทำสำเนาเป็น ${newVersion}`);
  };

  const handleSetPublished = (f: LegalFile) => {
    if (f.status === "published") return;
    if (!confirm(`ตั้ง ${f.version} เป็นเวอร์ชันที่ใช้งานอยู่?\nเวอร์ชันที่ใช้อยู่ปัจจุบันจะถูกเก็บถาวร`)) return;
    updateAudience((a) => ({
      ...a,
      files: a.files.map((x) => {
        if (x.id === f.id) return { ...x, status: "published" as FileStatus };
        if (x.status === "published") return { ...x, status: "archived" as FileStatus };
        return x;
      })
    }));
    toast.success(`${f.version} ใช้งานอยู่แล้ว`);
  };

  const handleDelete = (f: LegalFile) => {
    if (f.status === "published") { toast.error("ลบเวอร์ชันที่ใช้งานอยู่ไม่ได้ — ตั้งเวอร์ชันอื่นเป็นปัจจุบันก่อน"); return; }
    if (!confirm(`ลบ ${f.version} (${f.id})?`)) return;
    updateAudience((a) => ({ ...a, files: a.files.filter((x) => x.id !== f.id) }));
    toast.success(`ลบ ${f.version} แล้ว`);
  };

  const switchAudience = (id: AudienceId) => {
    setAudienceId(id);
    setOpenFileId(null);
    setCreating(false);
  };

  // ===== CREATE VIEW =====
  if (creating) {
    return (
      <LegalCreateView doc={docMeta} audiences={audiences} initialAudienceId={audienceId}
        onCancel={() => setCreating(false)}
        onCreate={handleConfirmCreate} />
    );
  }

  // ===== DETAIL VIEW =====
  if (openFile) {
    return (
      <LegalFileEditor doc={docMeta} file={openFile}
        onSave={handleSaveFile}
        onBack={() => setOpenFileId(null)} />
    );
  }

  // ===== LIST VIEW =====
  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="min-w-0">
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{docMeta.title}</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>{docMeta.subtitle}</p>
        </div>
        <motion.button onClick={handleStartCreate}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}>
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>สร้างเอกสารใหม่</span>
        </motion.button>
      </div>

      {/* Audience tabs */}
      {audiences.length > 1 && (
        <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 inline-flex items-center gap-1 self-start max-w-full">
          {audiences.map((a) => {
            const isAct = audienceId === a.id;
            return (
              <motion.button key={a.id} onClick={() => switchAudience(a.id)}
                whileTap={{ scale: 0.96 }}
                className={`relative inline-flex items-center gap-2 h-[36px] pl-1.5 pr-4 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                {isAct && (
                  <motion.span layoutId="legalAudiencePill"
                    className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}>
                  <a.Icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                </motion.span>
                <span className={`${font} relative text-[13px] whitespace-nowrap`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>
                  สำหรับ{a.label}
                </span>
                <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#d4d4d8", color: isAct ? "#fff" : "#525252", fontWeight: 600 }}>
                  {a.files.length}
                </span>
              </motion.button>
            );
          })}
        </div>
      )}

      {/* File cards (versions) */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
          <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
          <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>เวอร์ชันทั้งหมด</p>
          <span className={`${font} text-[11px] text-gray-400 tabular-nums`}>· {files.length} เวอร์ชัน</span>
        </div>

        {files.length === 0 ? (
          <div className={`py-16 text-center ${font} text-[13px] text-gray-400`}>ยังไม่มีเอกสาร — กด "สร้างเอกสารใหม่" เพื่อเริ่ม</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {files.map((f) => {
              const sColor = fileStatusColors[f.status];
              const wc = (f.html.replace(/<[^>]+>/g, " ").trim().split(/\s+/) || []).length;
              const isPublished = f.status === "published";
              const isDraft = f.status === "draft";
              // Extract preview from HTML (first heading + first paragraph)
              const titleMatch = f.html.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
              const bodyMatch = f.html.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
              const previewTitle = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, "").trim() : f.version;
              const previewBody = bodyMatch ? bodyMatch[1].replace(/<[^>]+>/g, "").trim() : "ยังไม่มีเนื้อหา";
              return (
                <motion.div key={f.id}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                  className={`group/file relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all border-2 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${
                    isPublished ? "border-[#319754]" : isDraft ? "border-[#f59e0b]/40" : "border-gray-200"
                  } ${f.status === "archived" ? "opacity-75 hover:opacity-100" : ""}`}
                  onClick={() => setOpenFileId(f.id)}
                  style={{
                    boxShadow: isPublished ? "0 4px 12px rgba(49,151,84,0.08)" : "0 1px 3px rgba(0,0,0,0.04)"
                  }}>

                  {/* Folded corner */}
                  <div className="absolute top-0 right-0 size-10 z-10 pointer-events-none">
                    <div className="absolute top-0 right-0 size-10"
                      style={{ background: "linear-gradient(225deg, #f5f5f5 50%, transparent 50%)" }} />
                    <div className="absolute top-0 right-0 size-10 shadow-[inset_-4px_4px_6px_rgba(0,0,0,0.05)]"
                      style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
                  </div>

                  {/* Top accent strip */}
                  <div className="h-1.5 w-full" style={{ backgroundColor: sColor }} />

                  {/* Body */}
                  <div className="p-5 flex flex-col gap-3 min-h-[280px]">
                    {/* Header: version + status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <FileText className="size-4 shrink-0" style={{ color: docMeta.color }} strokeWidth={2.2} />
                        <span className={`${font} text-[16px] text-black tabular-nums`} style={{ fontWeight: 700 }}>{f.version}</span>
                      </div>
                      <span className={`${font} inline-flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full`}
                        style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 600 }}>
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                        {fileStatusLabels[f.status]}
                      </span>
                    </div>

                    {/* Document preview — title + body lines */}
                    <div className="flex-1 flex flex-col gap-2 mt-1">
                      <p className={`${font} text-[14px] text-black line-clamp-2 leading-snug`} style={{ fontWeight: 600 }} title={previewTitle}>
                        {previewTitle}
                      </p>
                      <p className={`${font} text-[12px] text-gray-500 line-clamp-3 leading-relaxed`} title={previewBody}>
                        {previewBody}
                      </p>
                      {/* Decorative paper lines */}
                      <div className="flex flex-col gap-1.5 mt-2 opacity-60">
                        <div className="h-[3px] bg-gray-100 rounded-full w-full" />
                        <div className="h-[3px] bg-gray-100 rounded-full w-[88%]" />
                        <div className="h-[3px] bg-gray-100 rounded-full w-[72%]" />
                      </div>
                    </div>

                    {/* Notes */}
                    {f.notes && (
                      <div className="flex items-start gap-1.5 text-[10px] text-gray-500">
                        <Info className="size-2.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={2.6} />
                        <p className={`${font} line-clamp-1`} title={f.notes}>{f.notes}</p>
                      </div>
                    )}

                    {/* Footer: date + word count */}
                    <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                      <span className={`${font} inline-flex items-center gap-1.5 text-[10px] text-gray-500`}>
                        <CalendarIcon className="size-2.5 text-gray-400" strokeWidth={2.6} />
                        <span className="tabular-nums">{fmtThaiDate(f.updatedAt)}</span>
                      </span>
                      <span className={`${font} inline-flex items-center gap-1 text-[10px] text-gray-500 tabular-nums`}>
                        {wc.toLocaleString()} คำ
                      </span>
                    </div>

                    {/* ID */}
                    <p className={`${font} text-[9px] text-gray-300 tabular-nums truncate -mt-1`}>{f.id}</p>
                  </div>

                  {/* Hover actions overlay (top-right, below folded corner) */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1 opacity-0 group-hover/file:opacity-100 transition-opacity duration-200"
                    onClick={(e) => e.stopPropagation()}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button onClick={(e) => e.stopPropagation()}
                          className="size-8 rounded-full inline-flex items-center justify-center bg-white/95 hover:bg-white text-gray-700 cursor-pointer transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.12)] data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={6}
                        className="w-[220px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]"
                        onClick={(e) => e.stopPropagation()}>
                        <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                          style={{ transformOrigin: "top right" }}>
                          <button onClick={() => setOpenFileId(f.id)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>เปิดแก้ไข</span>
                          </button>
                          <button onClick={() => handleDuplicate(f)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <FileText className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ทำสำเนาเป็นเวอร์ชันใหม่</span>
                          </button>
                          {!isPublished && (
                            <button onClick={() => handleSetPublished(f)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#319754]/5 cursor-pointer transition-colors text-left text-[13px] text-[#319754]`}>
                              <Check className="size-3.5" strokeWidth={2.6} />
                              <span style={{ fontWeight: 500 }}>ตั้งเป็นเวอร์ชันใช้งาน</span>
                            </button>
                          )}
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={() => handleDelete(f)}
                            disabled={isPublished}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] ${isPublished ? "text-gray-300 cursor-not-allowed" : "hover:bg-[#ff3b30]/5 cursor-pointer text-[#ff3b30]"}`}>
                            <Trash2 className="size-3.5" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ลบเวอร์ชันนี้</span>
                          </button>
                        </motion.div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-2xl p-4 flex items-start gap-3">
        <AlertCircle className="size-4 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2.2} />
        <div className="flex flex-col gap-1">
          <p className={`${font} text-[12px] text-[#9a3412]`} style={{ fontWeight: 600 }}>วิธีจัดการเวอร์ชัน</p>
          <p className={`${font} text-[11px] text-gray-600 leading-relaxed`}>
            มีเวอร์ชัน "ใช้งานอยู่" ได้ <span style={{ fontWeight: 600 }}>ครั้งละ 1 เวอร์ชัน</span> เท่านั้น · ฉบับร่างไว้แก้ไขก่อนเผยแพร่ · ฉบับเก่าจะถูกเก็บถาวรเมื่อมีเวอร์ชันใหม่ขึ้นใช้แทน · กรณีลูกค้าต้องอ้างอิงย้อนหลังสามารถเปิดดูฉบับเก่าได้
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========== ADMIN COMPLAINTS (Stats + List) ========== */
type AdminComplaintStatus   = "pending" | "investigating" | "resolved" | "rejected";
type AdminComplaintCategory = "damaged" | "wrong_item" | "shipping" | "service" | "fraud" | "refund_request";
type AdminComplaintSeverity = "low" | "medium" | "high" | "critical";

interface ComplaintItem {
  image: string;
  name: string;
  option?: string;
  qty: number;
  price: number;
}

interface AdminComplaint {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerHistory: number; // จำนวนครั้งที่ร้องเรียน
  shopId: string;
  shopName: string;
  shopRating: number;      // 1-5
  orderId: string;
  amount: number;
  category: AdminComplaintCategory;
  severity: AdminComplaintSeverity;
  status: AdminComplaintStatus;
  assignedTo: string;      // admin ที่รับผิดชอบ
  internalNote: string;
  title: string;
  description: string;
  createdAt: string;       // ISO date
  responseHours: number;   // เวลาที่ใช้ตอบกลับ (ชม.)
  items: ComplaintItem[];  // สินค้าในคำสั่งซื้อ
  evidence: string[];      // ภาพหลักฐานที่ลูกค้าแนบมา (URLs)
}

const acStatusLabels: Record<AdminComplaintStatus, string> = {
  pending:       "รอดำเนินการ",
  investigating: "กำลังตรวจสอบ",
  resolved:      "แก้ไขแล้ว",
  rejected:      "ปฏิเสธ",
};
const acStatusColors: Record<AdminComplaintStatus, string> = {
  pending:       "#f59e0b",
  investigating: "#0088ff",
  resolved:      "#319754",
  rejected:      "#ff383c",
};
const acCategoryLabels: Record<AdminComplaintCategory, string> = {
  damaged:        "สินค้าเสียหาย",
  wrong_item:     "สินค้าไม่ตรง",
  shipping:       "ปัญหาจัดส่ง",
  service:        "บริการ",
  fraud:          "ฉ้อโกง / ต้องสงสัย",
  refund_request: "ขอคืนเงิน",
};
const acCategoryColors: Record<AdminComplaintCategory, string> = {
  damaged:        "#ff383c",
  wrong_item:     "#df9723",
  shipping:       "#0088ff",
  service:        "#9747ff",
  fraud:          "#dc2626",
  refund_request: "#319754",
};
const acSeverityLabels: Record<AdminComplaintSeverity, string> = {
  low:      "ต่ำ",
  medium:   "ปานกลาง",
  high:     "สูง",
  critical: "วิกฤต",
};
const acSeverityColors: Record<AdminComplaintSeverity, string> = {
  low:      "#319754",
  medium:   "#f59e0b",
  high:     "#ff9500",
  critical: "#ff383c",
};

// helper for product images
const _img = {
  honey:    "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=200&q=80",
  tea:      "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=200&q=80",
  cream:    "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200&q=80",
  oil:      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=200&q=80",
  capsule:  "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&q=80",
  giftset:  "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=200&q=80",
  herbal:   "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&q=80",
  matcha:   "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80",
};
// evidence photos (mock — uses unsplash damage/parcel photos)
const _ev = {
  damaged:  ["https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80", "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80"],
  parcel:   ["https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&q=80", "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=600&q=80"],
  product:  ["https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&q=80"],
  rash:     ["https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=600&q=80", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&q=80"],
};

const initialAdminComplaints: AdminComplaint[] = [
  { id: "CMP-26050001", customerName: "มาลี สวยงาม",      customerEmail: "malee@email.com",      customerPhone: "087-342-1110", customerHistory: 1, shopId: "SHP-001", shopName: "ร้านสมุนไพรไทยแท้",     shopRating: 4.7, orderId: "ORD-20260318-4421", amount: 690,  category: "damaged",        severity: "high",     status: "pending",       assignedTo: "ภานุเดช",  internalNote: "รอตรวจสอบหลักฐานภาพถ่าย",                          title: "สินค้ามาถึงในสภาพชำรุด", description: "ขวดน้ำผึ้งแตก น้ำผึ้งหกเลอะกล่อง — ขอให้ตรวจสอบบรรจุภัณฑ์",                            createdAt: "2026-05-09", responseHours: 6,
    items: [{ image: _img.honey, name: "น้ำผึ้งดอกลำไย",   option: "ขนาด 500ml · 2 ขวด",         qty: 2, price: 345 }],
    evidence: _ev.damaged,
  },
  { id: "CMP-26050002", customerName: "สมชาย ใจดี",        customerEmail: "somchai@email.com",    customerPhone: "084-081-8564", customerHistory: 3, shopId: "SHP-002", shopName: "ทุ่งหญ้าออร์แกนิก",      shopRating: 4.2, orderId: "ORD-20260318-4422", amount: 350,  category: "wrong_item",     severity: "medium",   status: "investigating", assignedTo: "วิภาดา",     internalNote: "ลูกค้าร้องบ่อย — ตรวจประวัติเพิ่มเติม",                title: "ได้รับสินค้าผิดรายการ",   description: "สั่งชาสมุนไพรรวม แต่ได้รับชาคาโมมายล์แทน",                                                 createdAt: "2026-05-08", responseHours: 12,
    items: [{ image: _img.tea, name: "ชาสมุนไพรรวม", option: "30 ซอง · รสชาติรวม", qty: 1, price: 350 }],
    evidence: _ev.product,
  },
  { id: "CMP-26050003", customerName: "วรรณา สุขสบาย",     customerEmail: "wanna@email.com",      customerPhone: "084-478-6908", customerHistory: 1, shopId: "SHP-001", shopName: "ร้านสมุนไพรไทยแท้",     shopRating: 4.7, orderId: "ORD-20260318-4423", amount: 1250, category: "wrong_item",     severity: "low",      status: "resolved",      assignedTo: "ภานุเดช",  internalNote: "คืนเงินเต็มจำนวน — ปิดเคส",                            title: "สินค้าไม่ตรงตามรูป",       description: "เซ็ตสมุนไพรบำรุงผิวที่ได้รับไม่ตรงกับรูปบนเว็บไซต์",                                          createdAt: "2026-05-07", responseHours: 18,
    items: [{ image: _img.giftset, name: "เซ็ตสมุนไพรบำรุงผิว", option: "Premium Set · 5 ชิ้น", qty: 1, price: 1250 }],
    evidence: _ev.product,
  },
  { id: "CMP-26050004", customerName: "ปราณี รักสมุนไพร",  customerEmail: "pranee@email.com",     customerPhone: "088-462-5776", customerHistory: 2, shopId: "SHP-003", shopName: "บ้านสมุนไพรเมต้า",      shopRating: 4.5, orderId: "ORD-20260318-4424", amount: 890,  category: "service",        severity: "medium",   status: "investigating", assignedTo: "ธนัช",     internalNote: "รอความเห็นจากแพทย์",                                  title: "ผลิตภัณฑ์ทำให้แพ้ผิว",      description: "ใช้ครีมสมุนไพรไปครั้งเดียวเกิดอาการระคายเคือง — ขอตรวจสอบส่วนผสม",                       createdAt: "2026-05-06", responseHours: 24,
    items: [{ image: _img.cream, name: "ครีมสมุนไพร", option: "ขนาด 50g · สูตรว่านหางจระเข้", qty: 1, price: 890 }],
    evidence: _ev.rash,
  },
  { id: "CMP-26050005", customerName: "อนุชา ต้นไม้",       customerEmail: "anucha@email.com",     customerPhone: "085-025-7698", customerHistory: 5, shopId: "SHP-004", shopName: "วิถีไทยเฮิร์บ",          shopRating: 3.8, orderId: "ORD-20260318-4425", amount: 480,  category: "shipping",       severity: "low",      status: "resolved",      assignedTo: "วิภาดา",     internalNote: "ขอคืนเงินค่าจัดส่ง 80 บาท",                          title: "จัดส่งล่าช้ากว่ากำหนด",    description: "สั่งวันที่ 1 พ.ค. คาดว่าได้รับ 5 พ.ค. แต่ได้จริง 12 พ.ค.",                                       createdAt: "2026-05-05", responseHours: 8,
    items: [{ image: _img.oil, name: "น้ำมันสมุนไพร", option: "ขนาด 100ml", qty: 1, price: 480 }],
    evidence: [],
  },
  { id: "CMP-26050006", customerName: "มานะ ขยันดี",        customerEmail: "mana@email.com",       customerPhone: "086-908-4893", customerHistory: 1, shopId: "SHP-005", shopName: "สมุนไพรไพล",            shopRating: 4.0, orderId: "ORD-20260318-4426", amount: 195,  category: "damaged",        severity: "low",      status: "rejected",      assignedTo: "ธนัช",     internalNote: "ปฏิเสธ — ไม่มีหลักฐานภาพถ่ายตอนรับสินค้า",            title: "ฝาขวดปิดไม่สนิท",          description: "น้ำมันไหลซึมออกมา (ไม่มีรูปประกอบ)",                                                            createdAt: "2026-05-04", responseHours: 36,
    items: [{ image: _img.oil, name: "น้ำมันไพล", option: "ขนาด 50ml", qty: 1, price: 195 }],
    evidence: [],
  },
  { id: "CMP-26050007", customerName: "ธนพล ทองคำ",         customerEmail: "thanapol@email.com",   customerPhone: "085-496-4376", customerHistory: 1, shopId: "SHP-006", shopName: "เมต้าออร์แกนิก",         shopRating: 4.6, orderId: "ORD-20260319-4427", amount: 1890, category: "refund_request", severity: "low",      status: "pending",       assignedTo: "—",         internalNote: "",                                                       title: "ขอคืนสินค้าและเงิน",       description: "สั่งเป็นของขวัญ ผู้รับไม่ชอบ — สินค้ายังไม่เปิด",                                                  createdAt: "2026-05-03", responseHours: 4,
    items: [{ image: _img.giftset, name: "เซ็ตของขวัญสมุนไพรพรีเมี่ยม", option: "กล่องสีแดง · มีโบว์", qty: 1, price: 1890 }],
    evidence: _ev.parcel,
  },
  { id: "CMP-26050008", customerName: "นภัสสร อ่อนนุช",     customerEmail: "napatsorn@email.com",  customerPhone: "083-921-0603", customerHistory: 2, shopId: "SHP-002", shopName: "ทุ่งหญ้าออร์แกนิก",      shopRating: 4.2, orderId: "ORD-20260319-4428", amount: 440,  category: "wrong_item",     severity: "medium",   status: "investigating", assignedTo: "ภานุเดช",  internalNote: "ตรวจ stock ที่หน้าร้าน",                                title: "ได้รับสินค้าไม่ครบ",        description: "สั่ง 2 ขวด ได้ 1 ขวด — ขอเงินคืนส่วนที่ขาด",                                                  createdAt: "2026-05-02", responseHours: 10,
    items: [{ image: _img.capsule, name: "ขมิ้นชันแคปซูล", option: "60 แคปซูล/ขวด", qty: 2, price: 220 }],
    evidence: _ev.parcel,
  },
  { id: "CMP-26050009", customerName: "พิมพ์ชนก สีแดง",     customerEmail: "pimchanok@email.com",  customerPhone: "088-971-8489", customerHistory: 1, shopId: "SHP-005", shopName: "สมุนไพรไพล",            shopRating: 4.0, orderId: "ORD-20260320-4429", amount: 95,   category: "damaged",        severity: "low",      status: "resolved",      assignedTo: "วิภาดา",     internalNote: "อนุมัติคืนเต็มจำนวน",                                  title: "ตลับแตก",                  description: "บาล์มไหลออกครึ่งตลับ มีรอยแตกชัดเจนตอนรับพัสดุ",                                            createdAt: "2026-05-01", responseHours: 14,
    items: [{ image: _img.oil, name: "บาล์มสมุนไพรไพล", qty: 1, price: 95 }],
    evidence: _ev.damaged,
  },
  { id: "CMP-26050010", customerName: "เกียรติศักดิ์ ภักดี",  customerEmail: "kiat@email.com",       customerPhone: "082-205-0967", customerHistory: 1, shopId: "SHP-007", shopName: "หมอชาวบ้าน",            shopRating: 4.4, orderId: "ORD-20260320-4430", amount: 145,  category: "wrong_item",     severity: "low",      status: "investigating", assignedTo: "ธนัช",     internalNote: "",                                                       title: "ได้รับสินค้าผิดรูปแบบ",     description: "สั่งฟ้าทะลายโจรผง ได้แคปซูล",                                                                  createdAt: "2026-04-30", responseHours: 16,
    items: [{ image: _img.herbal, name: "ฟ้าทะลายโจร", option: "รูปแบบ: ผง 100g", qty: 1, price: 145 }],
    evidence: _ev.product,
  },
  { id: "CMP-26050011", customerName: "สุนันทา จิตรกุล",     customerEmail: "sunanta@email.com",    customerPhone: "083-728-0553", customerHistory: 1, shopId: "SHP-001", shopName: "ร้านสมุนไพรไทยแท้",     shopRating: 4.7, orderId: "ORD-20260321-4431", amount: 375,  category: "damaged",        severity: "high",     status: "resolved",      assignedTo: "วิภาดา",     internalNote: "ติดตามคุณภาพ — เคสที่ 2 ของเดือน",                       title: "สินค้าเปิดมาแล้วขึ้นรา",    description: "เปิดมาแล้วชาขึ้นรา กลิ่นเหม็น — ส่งภาพประกอบมาด้วย",                                            createdAt: "2026-04-28", responseHours: 22,
    items: [{ image: _img.tea, name: "ชาเก๊กฮวยออร์แกนิก", option: "20 ซอง · รสดั้งเดิม", qty: 3, price: 125 }],
    evidence: _ev.product,
  },
  { id: "CMP-26050012", customerName: "อมรเทพ รัตนพล",      customerEmail: "amorn@email.com",      customerPhone: "082-289-5657", customerHistory: 1, shopId: "SHP-008", shopName: "เกษตรกรไทย",            shopRating: 4.1, orderId: "ORD-20260321-4432", amount: 325,  category: "fraud",          severity: "critical", status: "investigating", assignedTo: "ภานุเดช",  internalNote: "อาจเป็นสินค้าหมดอายุ — ส่งทีมตรวจสอบ stock ร้าน",     title: "สินค้าหมดอายุแล้ว",        description: "ฉลากระบุหมดอายุ 11/2568 — รับมา 04/2569",                                                       createdAt: "2026-04-27", responseHours: 3,
    items: [{ image: _img.herbal, name: "สบู่สมุนไพรขมิ้น", option: "ขนาด 100g", qty: 5, price: 65 }],
    evidence: _ev.product,
  },
  { id: "CMP-26050013", customerName: "ชมพูนุช พิมพา",      customerEmail: "chompoo@email.com",    customerPhone: "088-216-8017", customerHistory: 1, shopId: "SHP-006", shopName: "เมต้าออร์แกนิก",         shopRating: 4.6, orderId: "ORD-20260322-4433", amount: 430,  category: "shipping",       severity: "medium",   status: "resolved",      assignedTo: "ธนัช",     internalNote: "",                                                       title: "ขวดแตกระหว่างขนส่ง",      description: "น้ำผึ้งหกเลอะกล่องทั้งใบ",                                                                       createdAt: "2026-04-26", responseHours: 12,
    items: [{ image: _img.honey, name: "น้ำผึ้งดอกลำไย", option: "ขนาด 250ml", qty: 2, price: 215 }],
    evidence: _ev.parcel,
  },
];

// ===== SLA config + helpers =====
const SLA_HOURS: Record<AdminComplaintSeverity, number> = {
  critical: 4,
  high:     12,
  medium:   24,
  low:      48,
};
function hoursSince(iso: string): number {
  if (!iso) return 0;
  const now = new Date();
  const then = new Date(iso);
  return Math.max(0, Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60)));
}
function getSLAStatus(c: { severity: AdminComplaintSeverity; createdAt: string; status: AdminComplaintStatus }) {
  const target = SLA_HOURS[c.severity];
  const elapsed = hoursSince(c.createdAt);
  const remaining = target - elapsed;
  const isResolved = c.status === "resolved" || c.status === "rejected";
  const isBreached = !isResolved && remaining <= 0;
  const isWarn = !isResolved && remaining > 0 && remaining < target * 0.25;
  return { target, elapsed, remaining, isBreached, isWarn, isResolved };
}

// ===== Reply templates (categorized) =====
const REPLY_TEMPLATES: { category: string; items: { label: string; text: string }[] }[] = [
  {
    category: "ทักทาย / ขออภัย",
    items: [
      { label: "ขออภัยและรับเรื่อง",     text: "ขออภัยในความไม่สะดวกที่เกิดขึ้นค่ะ ทีมงานได้รับเรื่องแล้วและกำลังตรวจสอบ จะติดต่อกลับภายใน 24 ชม. ค่ะ" },
      { label: "อัปเดตความคืบหน้า",     text: "อัปเดตความคืบหน้า: เรากำลังประสานงานกับร้านค้าและรอการตรวจสอบ จะแจ้งผลให้ทราบเร็วๆ นี้ค่ะ" },
    ],
  },
  {
    category: "ขอข้อมูลเพิ่ม",
    items: [
      { label: "ขอภาพประกอบ",          text: "ขอความกรุณาส่งภาพถ่ายของสินค้า และภาพบรรจุภัณฑ์ภายนอก เพื่อใช้ประกอบการตรวจสอบ" },
      { label: "ขอเลขพัสดุ + วันรับ",   text: "ขอเลขพัสดุและวันที่รับสินค้า เพื่อตรวจสอบกับบริษัทขนส่ง" },
      { label: "ขอใบเสร็จ",            text: "ขอใบเสร็จหรือหลักฐานการสั่งซื้อ เพื่อยืนยันรายการที่สั่ง" },
    ],
  },
  {
    category: "ผลการตัดสิน",
    items: [
      { label: "อนุมัติคืนเงินเต็ม",    text: "ทีมงานพิจารณาอนุมัติคืนเงินเต็มจำนวน ระบบจะดำเนินการคืนเงินภายใน 3-5 วันทำการ" },
      { label: "อนุมัติคืนเงินบางส่วน", text: "ทีมงานพิจารณาอนุมัติคืนเงินบางส่วน รายละเอียดและเหตุผลจะส่งให้ทาง email" },
      { label: "ปฏิเสธคำร้อง",          text: "ขออภัยที่หลังจากตรวจสอบแล้ว ทีมงานไม่สามารถดำเนินการตามคำร้องได้ เนื่องจาก [ระบุเหตุผล]" },
    ],
  },
];

// ===== Mock conversation generator =====
type ChatRole = "customer" | "admin" | "shop";
interface ComplaintMessage {
  id: string;
  role: ChatRole;
  authorName: string;
  text: string;
  attachments?: string[];
  timestamp: string; // ISO
  isInternal?: boolean; // admin-only note (not visible to customer/shop)
}
function genMockMessages(c: AdminComplaint): ComplaintMessage[] {
  const base = new Date(c.createdAt).getTime();
  const t = (h: number) => new Date(base + h * 3600000).toISOString();
  const msgs: ComplaintMessage[] = [
    { id: "m1", role: "customer", authorName: c.customerName,            text: c.description, timestamp: t(0) },
  ];
  if (c.status !== "pending") {
    msgs.push({ id: "m2", role: "admin", authorName: c.assignedTo, text: "ขออภัยในความไม่สะดวกค่ะ ทีมงานได้รับเรื่องแล้ว ขอเวลาตรวจสอบกับร้านค้าก่อน", timestamp: t(2) });
  }
  if (c.status === "investigating" || c.status === "resolved" || c.status === "rejected") {
    msgs.push({ id: "m3", role: "shop", authorName: c.shopName, text: "ขออภัยลูกค้าค่ะ ทางร้านขอตรวจสอบจากทีมจัดส่งและจะตอบกลับภายใน 24 ชม.", timestamp: t(6) });
  }
  if (c.status === "resolved") {
    msgs.push({ id: "m4", role: "admin", authorName: c.assignedTo, text: "ทีมงานพิจารณาอนุมัติคืนเงินเต็มจำนวน ระบบจะดำเนินการคืนเงินภายใน 3-5 วันทำการค่ะ", timestamp: t(c.responseHours) });
    msgs.push({ id: "m5", role: "customer", authorName: c.customerName, text: "ขอบคุณมากค่ะ", timestamp: t(c.responseHours + 1) });
  }
  if (c.status === "rejected") {
    msgs.push({ id: "m4", role: "admin", authorName: c.assignedTo, text: `ขออภัยค่ะ จากการตรวจสอบ ${c.internalNote || "ทีมงานไม่สามารถดำเนินการได้ตามคำร้อง"}`, timestamp: t(c.responseHours) });
  }
  if (c.internalNote) {
    msgs.push({ id: "mi", role: "admin", authorName: c.assignedTo, text: c.internalNote, timestamp: t(c.responseHours - 0.5), isInternal: true });
  }
  return msgs;
}

function ComplaintStatsContent() {
  const data = initialAdminComplaints;
  const [month, setMonth] = useState("พฤษภาคม");
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

  // 4 highlighted categories (matching Figma — damaged / wrong_item / service / refund_request)
  const cardCats: { id: AdminComplaintCategory; label: string; color: string; Icon: any }[] = [
    { id: "damaged",        label: "สินค้าเสียหาย",       color: "#ff383c", Icon: PackageX },
    { id: "wrong_item",     label: "สินค้าไม่ตรงตามสั่ง", color: "#df9723", Icon: AlertCircle },
    { id: "service",        label: "ต้องการคืนสินค้า",    color: "#9747ff", Icon: RotateCcw },
    { id: "refund_request", label: "ต้องการขอเงินคืน",    color: "#0088ff", Icon: Wallet },
  ];
  const cardCounts = cardCats.map((c) => ({ ...c, count: data.filter((d) => d.category === c.id).length }));

  // Totals — sum of the 4 highlighted categories (so the chart, the คำร้องทั้งหมด card, and per-card % all align)
  const total = cardCounts.reduce((s, c) => s + c.count, 0);

  // ปัญหาที่พบมากที่สุด
  const topCat = [...cardCounts].sort((a, b) => b.count - a.count)[0];

  // Donut data (ประเภทปัญหา) — use the same colors as the cards so visuals match
  const donutData = cardCounts.map((c) => ({
    name: c.label.replace("ต้องการ", "").replace("ตามสั่ง", "").trim(),
    value: c.count,
    color: c.color,
  })).filter((d) => d.value > 0);
  const donutTotal = total;

  // ผลการตัดสินใจร้านค้า
  const accepted = data.filter((c) => c.status === "resolved").length;
  const refused  = data.filter((c) => c.status === "rejected").length;
  const waiting  = data.filter((c) => c.status === "pending" || c.status === "investigating").length;
  const decisionTotal = accepted + refused + waiting || 1;
  const acceptRate = Math.round((accepted / decisionTotal) * 100);
  const rejectRate = Math.round((refused / decisionTotal) * 100);
  const decisionMax = Math.max(accepted, refused, waiting, 1);

  // Month dropdown — reusable pill
  const MonthDropdown = () => (
    <Popover>
      <PopoverTrigger asChild>
        <button className={`${font} bg-white border border-[#d4d4d4] hover:border-[#319754] flex items-center gap-2 px-6 h-9 rounded-full text-[12px] text-black cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          {month}
          <ChevronDown className="size-3 text-gray-500" strokeWidth={2.4} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6}
        className="w-[160px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
        <div className="max-h-[280px] overflow-y-auto">
          {months.map((m) => (
            <button key={m} onClick={() => setMonth(m)}
              className={`${font} w-full flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] ${m === month ? "text-[#319754]" : "text-black"}`}
              style={{ fontWeight: m === month ? 600 : 500 }}>
              {m}
              {m === month && <Check className="size-3.5" strokeWidth={2.6} />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );

  return (
    <div className="flex flex-col gap-5">
      {/* ===== Row 1 — left summary stack + right donut (50/50) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-stretch">
        {/* Left column: 2 stacked summary cards */}
        <div className="flex flex-col gap-4 w-full min-w-0">
          {/* Card 1 — คำร้องทั้งหมด (indigo) */}
          <div className="group bg-white border border-[#f0f0f0] rounded-2xl flex-1 min-h-[164px] overflow-hidden relative p-5">
            <motion.img
              src={imgRequests}
              alt=""
              className="absolute -bottom-4 -right-3 size-[150px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
              style={{
                maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#6366f11a" }}>
                  <MessageSquare className="size-4 text-[#6366f1]" strokeWidth={2} />
                </div>
                <p className={`${font} text-[13px] text-gray-500`}>คำร้องทั้งหมด</p>
              </div>
              <p className={`${font} text-[28px] mt-auto tracking-tight tabular-nums leading-none`} style={{ fontWeight: 700, color: "#6366f1" }}>
                {total.toLocaleString()}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md`}
                  style={{ backgroundColor: "#6366f115", color: "#6366f1", fontWeight: 600 }}>
                  รายการทั้งหมด
                </span>
              </div>
            </div>
          </div>

          {/* Card 2 — ปัญหาที่พบมากที่สุด (green) */}
          <div className="group bg-white border border-[#f0f0f0] rounded-2xl flex-1 min-h-[164px] overflow-hidden relative p-5">
            <motion.img
              src={imgDamagedGoods}
              alt=""
              className="absolute -bottom-4 -right-3 size-[150px] object-contain pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
              style={{
                maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              aria-hidden
            />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#3197541a" }}>
                  <AlertTriangle className="size-4 text-[#319754]" strokeWidth={2} />
                </div>
                <p className={`${font} text-[13px] text-gray-500`}>ปัญหาที่พบมากที่สุด</p>
              </div>
              <p className={`${font} text-[24px] mt-auto tracking-tight leading-[1.2] pb-0.5 max-w-[60%]`} style={{ fontWeight: 700, color: "#319754" }}>
                {topCat.label.replace("ต้องการ", "").trim()}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md tabular-nums`}
                  style={{ backgroundColor: "#31975415", color: "#319754", fontWeight: 600 }}>
                  {topCat.count.toLocaleString()} รายการ
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: ประเภทปัญหา donut card */}
        <div className="bg-white border border-[#e8e8e8] rounded-2xl w-full min-w-0 flex flex-col overflow-hidden self-stretch min-h-[420px]">
          {/* Header */}
          <div className="border-b border-[#f0f0f0] flex items-start justify-between px-5 py-4">
            <div className="flex flex-col gap-0.5">
              <p className={`${font} text-[15px] text-black leading-[22.5px]`} style={{ fontWeight: 500 }}>ประเภทปัญหา</p>
              <p className={`${font} text-[12px] text-[#999] leading-[18px]`}>สัดส่วนแต่ละประเภท</p>
            </div>
            <MonthDropdown />
          </div>
          {/* Donut chart — owner-report style */}
          <div className="flex-1 flex flex-col px-5 py-5">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  nameKey="name"
                  labelLine={false}
                  label={({ percent, cx, cy, midAngle, innerRadius, outerRadius }: any) => {
                    if (percent < 0.06) return null;
                    const RADIAN = Math.PI / 180;
                    const radius = innerRadius + (outerRadius - innerRadius) * 0.55;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
                        style={{ fontSize: 12, fontWeight: 600, pointerEvents: "none" }}>
                        {(percent * 100).toFixed(0)}%
                      </text>
                    );
                  }}
                  isAnimationActive
                  animationDuration={700}
                >
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="#fff" strokeWidth={3} />
                  ))}
                </Pie>
                <text x="50%" y="44%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 11, fill: "#9ca3af" }}>คำร้องทั้งหมด</text>
                <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 20, fill: "#1a1a1a", fontWeight: 700 }}>
                  {donutTotal.toLocaleString()} รายการ
                </text>
                <Tooltip
                  content={({ active, payload }: any) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0];
                    const pct = donutTotal > 0 ? ((p.value / donutTotal) * 100).toFixed(1) : "0";
                    return (
                      <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="size-2 rounded-full shrink-0" style={{ backgroundColor: p.payload.color }} />
                          <span className="text-[12px] text-gray-600" style={{ fontWeight: 500 }}>{p.name}</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-3">
                          <span className="text-[16px] tabular-nums" style={{ fontWeight: 700, color: p.payload.color }}>
                            {p.value.toLocaleString()} รายการ
                          </span>
                          <span className="text-[11px] text-gray-400 tabular-nums">{pct}%</span>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ paddingTop: 16 }}
                  content={({ payload }: any) => (
                    <div className="flex items-center justify-center gap-2 flex-wrap max-w-full px-4">
                      {payload?.map((entry: any, i: number) => (
                        <div key={i} className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px]`}
                          style={{ backgroundColor: `${entry.color}10`, color: entry.color, fontWeight: 600, boxShadow: `0 1px 3px ${entry.color}1a` }}>
                          <span className="block rounded-full" style={{ width: 8, height: 8, backgroundColor: entry.color, boxShadow: `0 0 0 2.5px ${entry.color}25` }} />
                          <span>{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ===== Row 2 — 4 stat cards ===== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {cardCounts.map((c) => {
          const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
          return (
            <div key={c.id}
              className="group bg-white border border-[#e8e8e8] rounded-2xl p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow relative overflow-hidden">
              {/* Background decorative icon — bottom-right, faded like report cards */}
              <c.Icon
                className="absolute -bottom-3 -right-3 size-[110px] pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                style={{
                  color: c.color,
                  opacity: 0.1,
                  maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                }}
                strokeWidth={1.6}
                aria-hidden
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}1a` }}>
                    <c.Icon className="size-4" style={{ color: c.color }} strokeWidth={2} />
                  </div>
                  <p className={`${font} text-[13px] text-gray-500 truncate`}>{c.label}</p>
                </div>
                <p className={`${font} text-[28px] mt-3 tracking-tight tabular-nums leading-none`} style={{ fontWeight: 700, color: c.color }}>
                  {c.count.toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md tabular-nums`}
                    style={{ backgroundColor: `${c.color}15`, color: c.color, fontWeight: 600 }}>
                    {pct}% ของคำร้องทั้งหมด
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===== Row 3 — ผลการตัดสินใจร้านค้า ===== */}
      <div className="bg-white border border-[#e8e8e8] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-[#f0f0f0] flex items-start justify-between px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <p className={`${font} text-[15px] text-black leading-[22.5px]`} style={{ fontWeight: 500 }}>ผลการตัดสินใจร้านค้า</p>
            <p className={`${font} text-[12px] text-[#999] leading-[18px]`}>ยอมรับ / ปฏิเสธ / รอดำเนินการ</p>
          </div>
          <MonthDropdown />
        </div>
        {/* Body */}
        <div className="flex flex-col gap-4 px-5 pt-5 pb-5">
          {/* Big rates: อัตราการยอมรับ (left) / อัตราปฏิเสธ (right) */}
          <div className="flex items-center justify-between h-16">
            <div className="flex flex-col gap-1">
              <p className={`${font} text-[28px] leading-[42px] tabular-nums`} style={{ fontWeight: 500, color: "#319754" }}>{acceptRate}%</p>
              <p className={`${font} text-[12px] text-[#999] leading-[18px]`}>อัตราการยอมรับ</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <p className={`${font} text-[28px] leading-[42px] tabular-nums`} style={{ fontWeight: 500, color: "#ef4444" }}>{rejectRate}%</p>
              <p className={`${font} text-[12px] text-[#999] leading-[18px]`}>อัตราปฏิเสธ</p>
            </div>
          </div>

          {/* Stacked bar */}
          <div className="flex gap-0.5 h-4 overflow-hidden rounded-full w-full bg-gray-100">
            {accepted > 0 && <div className="h-4 transition-all" style={{ width: `${(accepted / decisionTotal) * 100}%`, backgroundColor: "#319754" }} />}
            {refused  > 0 && <div className="h-4 transition-all" style={{ width: `${(refused  / decisionTotal) * 100}%`, backgroundColor: "#ef4444" }} />}
            {waiting  > 0 && <div className="h-4 transition-all" style={{ width: `${(waiting  / decisionTotal) * 100}%`, backgroundColor: "#f59e0b" }} />}
          </div>

          {/* Legend rows with mini progress bars */}
          <div className="flex flex-col gap-2">
            {[
              { label: "ยอมรับคำร้อง", count: accepted, color: "#319754" },
              { label: "ปฏิเสธคำร้อง", count: refused,  color: "#ef4444" },
              { label: "รอดำเนินการ",  count: waiting,  color: "#f59e0b" },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between h-[18px]">
                <div className="flex items-center gap-2 shrink-0">
                  <span className="size-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                  <span className={`${font} text-[12px] text-[#555]`}>{row.label}</span>
                </div>
                <div className="flex items-center gap-3 w-[112px]">
                  <div className="flex-1 h-1.5 rounded-full bg-[#f0f0f0] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(row.count / decisionMax) * 100}%`, backgroundColor: row.color }} />
                  </div>
                  <span className={`${font} text-[12px] text-black tabular-nums w-5 text-right`} style={{ fontWeight: 500 }}>
                    {row.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== Complaint Detail Page =====
function roleColor(role: ChatRole): string {
  if (role === "customer") return "#0088ff";
  if (role === "admin")    return "#319754";
  return "#9747ff"; // shop
}
function roleLabel(role: ChatRole): string {
  return role === "customer" ? "ลูกค้า" : role === "admin" ? "Admin" : "ร้านค้า";
}

function ComplaintDetailContent({ complaint, onBack, onUpdate }: {
  complaint: AdminComplaint;
  onBack: () => void;
  onUpdate: (next: AdminComplaint) => void;
}) {
  const [messages, setMessages] = useState<ComplaintMessage[]>(() => genMockMessages(complaint));
  const [reply, setReply] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [tplOpen, setTplOpen] = useState(false);
  const [internalNote, setInternalNote] = useState(complaint.internalNote);
  const replyRef = React.useRef<HTMLTextAreaElement>(null);
  const focusReply = () => { replyRef.current?.focus(); replyRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); };

  // Selection: 3 status (เลือกก่อนบันทึก)
  const [selectedStatus, setSelectedStatus] = useState<AdminComplaintStatus>(complaint.status);
  const isStatusDirty = selectedStatus !== complaint.status;

  const sla = getSLAStatus(complaint);
  const sColor = acStatusColors[complaint.status];
  const cColor = acCategoryColors[complaint.category];
  const sevColor = acSeverityColors[complaint.severity];

  const handleSend = () => {
    if (!reply.trim()) return;
    const newMsg: ComplaintMessage = {
      id: `m-${Date.now()}`,
      role: "admin",
      authorName: complaint.assignedTo || "Admin",
      text: reply.trim(),
      timestamp: new Date().toISOString(),
      isInternal,
    };
    setMessages((prev) => [...prev, newMsg]);
    setReply("");
    toast.success(isInternal ? "บันทึกโน้ตภายในแล้ว" : "ส่งข้อความแล้ว");
  };

  const handleStatusChange = (next: AdminComplaintStatus) => {
    onUpdate({ ...complaint, status: next });
    toast.success(`เปลี่ยนสถานะเป็น "${acStatusLabels[next]}" แล้ว`);
  };

  const handleSaveInternalNote = () => {
    onUpdate({ ...complaint, internalNote });
    toast.success("บันทึกโน้ตภายในแล้ว");
  };

  const fmtDateTime = (iso: string) => {
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543} · ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  };
  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  return (
    <div>
      {/* Back + date inline */}
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <span className={`${font} text-[13px] text-gray-500`}>ส่งคำร้องเมื่อ {fmtDate(complaint.createdAt)}</span>
      </div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className={`${font} text-[26px] tabular-nums`} style={{ fontWeight: 700 }}>{complaint.id}</h2>
          {/* SLA chip inline ต่อท้าย ID */}
          {(() => {
            const slaColor = sla.isResolved ? "#737373" : sla.isBreached ? "#ff3b30" : sla.isWarn ? "#f59e0b" : "#319754";
            return (
              <span className={`${font} inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full`}
                style={{ backgroundColor: `${slaColor}15`, color: slaColor, fontWeight: 600 }}
                title={`เป้า ${sla.target}h · ใช้ไป ${sla.elapsed}h`}>
                <Clock className="size-3 shrink-0" strokeWidth={2.4} />
                {sla.isResolved ? "ปิดเคสแล้ว" :
                 sla.isBreached ? `เกิน SLA ${Math.abs(sla.remaining)}h` :
                                  `เหลือ ${sla.remaining}h`}
                <span className="text-gray-400 font-normal">· เป้า {sla.target}h · ใช้ไป {sla.elapsed}h</span>
              </span>
            );
          })()}
        </div>
        <span className={`${font} inline-flex items-center gap-2 text-[13px] px-3.5 py-1.5 rounded-full`}
          style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 600 }}>
          <Clock className="size-3.5" strokeWidth={2.4} />
          {acStatusLabels[complaint.status]}
        </span>
      </div>

      {/* 2-col layout — flex + right fixed 408px (ตรงกับร้านค้า) */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
        {/* LEFT: description + items + evidence + chat */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-5">
          {/* รายละเอียดคำร้องเรียน — grid pattern เดียวกับร้านค้า */}
          <FormSection icon={FileText} iconColor={cColor} title="รายละเอียดคำร้องเรียน" desc="ข้อมูลพื้นฐานของคำร้อง">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>เลขที่คำสั่งซื้อ</p>
                <p className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>{complaint.orderId}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>สินค้า</p>
                <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{complaint.items[0]?.name || "—"}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>ลูกค้า</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>{complaint.customerName}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>ประเภท</p>
                <span className={`${font} inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full`}
                  style={{ backgroundColor: `${cColor}1a`, color: cColor, fontWeight: 600 }}>
                  {acCategoryLabels[complaint.category]}
                </span>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>อีเมล</p>
                <p className={`${font} text-[14px] text-black truncate`}>{complaint.customerEmail}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>เบอร์ติดต่อ</p>
                <p className={`${font} text-[14px] text-black tabular-nums`}>{complaint.customerPhone}</p>
              </div>
              {/* Admin extras */}
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1 inline-flex items-center gap-1`}>
                  <Store className="size-3 text-gray-400" strokeWidth={2.4} />
                  ร้านค้า
                </p>
                <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{complaint.shopName}</p>
                <p className={`${font} text-[10px] text-gray-400 inline-flex items-center gap-1 mt-0.5`}>
                  <Star className="size-2.5" fill="#f59e0b" strokeWidth={0} /> {complaint.shopRating.toFixed(1)} · {complaint.shopId}
                </p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1 inline-flex items-center gap-1`}>
                  <UserCog className="size-3 text-gray-400" strokeWidth={2.4} />
                  ผู้ดูแลที่รับผิดชอบ
                </p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>{complaint.assignedTo}</p>
                <p className={`${font} text-[10px] text-gray-400 mt-0.5`}>ระดับ{acSeverityLabels[complaint.severity]} · ตอบ {complaint.responseHours}h</p>
              </div>
              {/* Refund amount — highlighted */}
              <div className="sm:col-span-2 pt-3 mt-1 border-t border-gray-100">
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>ยอดขอคืนเงิน</p>
                <p className={`${font} text-[24px] tabular-nums`} style={{ fontWeight: 700, color: ADMIN_PRIMARY }}>
                  ฿{complaint.amount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* รายละเอียดปัญหา — gray box */}
            <div className="mt-5">
              <p className={`${font} text-[12px] text-gray-500 mb-2`}>รายละเอียดปัญหา</p>
              <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-4">
                <p className={`${font} text-[14px] text-black leading-relaxed`}>{complaint.description}</p>
              </div>
            </div>
          </FormSection>

          {/* Order items */}
          <FormSection icon={Package} iconColor="#0088ff" title="สินค้าในคำสั่งซื้อ" desc={`${complaint.items.length} รายการ · รวม ฿${complaint.amount.toLocaleString()}`}>
            <div className="flex flex-col gap-3">
              {complaint.items.map((it, i) => {
                const subtotal = it.qty * it.price;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fafafa] hover:bg-gray-100 transition-colors">
                    <div className="size-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <ImageWithFallback src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{it.name}</p>
                      {it.option && <p className={`${font} text-[11px] text-gray-500 truncate mt-0.5`}>{it.option}</p>}
                      <p className={`${font} text-[11px] text-gray-400 mt-0.5 tabular-nums`}>
                        จำนวน {it.qty} · ฿{it.price.toLocaleString()}/ชิ้น
                      </p>
                    </div>
                    <p className={`${font} text-[14px] text-black tabular-nums shrink-0`} style={{ fontWeight: 700 }}>
                      ฿{subtotal.toLocaleString()}
                    </p>
                  </div>
                );
              })}
              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`${font} text-[12px] text-gray-500`}>รวมทั้งหมด</span>
                <span className={`${font} text-[16px] tabular-nums`} style={{ fontWeight: 700, color: ADMIN_PRIMARY }}>
                  ฿{complaint.amount.toLocaleString()}
                </span>
              </div>
            </div>
          </FormSection>

          {/* Evidence */}
          <FormSection icon={ImageIcon} iconColor="#9747ff" title="ภาพหลักฐานจากลูกค้า" desc={complaint.evidence.length > 0 ? `${complaint.evidence.length} ภาพ — กดเพื่อดูใหญ่` : "ลูกค้าไม่ได้แนบภาพประกอบ"}>
            {complaint.evidence.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
                <div className="size-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <ImageIcon className="size-6" strokeWidth={2} />
                </div>
                <p className={`${font} text-[12px]`}>ไม่มีภาพหลักฐาน</p>
                <button onClick={() => { setIsInternal(false); setReply("ขอความกรุณาส่งภาพถ่ายของสินค้าและบรรจุภัณฑ์ภายนอก เพื่อใช้ประกอบการตรวจสอบ"); focusReply(); }}
                  className={`${font} text-[11px] text-[#9747ff] bg-[#9747ff]/10 hover:bg-[#9747ff]/20 px-3 h-7 rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5 mt-1`}
                  style={{ fontWeight: 600 }}>
                  <Sparkles className="size-3" strokeWidth={2.4} />
                  ขอภาพหลักฐานจากลูกค้า
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {complaint.evidence.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                    className="group/ev relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-[#9747ff]/40 transition-all">
                    <ImageWithFallback src={url} alt={`evidence ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover/ev:scale-110" />
                    <div className="absolute inset-0 bg-black/0 group-hover/ev:bg-black/30 transition-colors flex items-center justify-center">
                      <ExternalLink className="size-5 text-white opacity-0 group-hover/ev:opacity-100 transition-opacity" strokeWidth={2.4} />
                    </div>
                    <span className={`${font} absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full tabular-nums`} style={{ fontWeight: 600 }}>
                      {i + 1}/{complaint.evidence.length}
                    </span>
                  </a>
                ))}
              </div>
            )}
          </FormSection>

          {/* Chat thread — wrapped in iPhone wireframe */}
          <FormSection icon={Mail} iconColor="#9747ff" title="ประวัติการสนทนา" desc="ตัวอย่างที่ลูกค้าเห็นในแอพมือถือ · ลูกค้า · admin · ร้านค้า">
            {/* iPhone wireframe — ขนาดจริง 375 × 812 (iPhone X / 11 Pro / 13 mini) · กรอบเทา */}
            <div className="mx-auto" style={{ width: 395 }}>
              <div className="rounded-[48px] p-[10px] border-[1.5px] border-gray-300 bg-gray-50/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)]">
                {/* Inner screen — actual 375px display */}
                <div className="bg-white rounded-[38px] overflow-hidden border border-gray-200" style={{ width: 375 }}>
                  {/* Status bar with Dynamic Island (gray) */}
                  <div className="bg-white px-6 pt-2.5 pb-1.5 flex items-center justify-between relative">
                    <span className={`${font} text-[13px] tabular-nums text-gray-600`} style={{ fontWeight: 600 }}>9:41</span>
                    {/* Dynamic Island — gray */}
                    <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-[100px] h-[28px] bg-gray-300 rounded-full" />
                    <div className="flex items-center gap-1.5 text-gray-400">
                      {/* Signal */}
                      <div className="flex items-end gap-[1.5px] h-2.5">
                        <span className="w-[2px] h-1   bg-current rounded-sm" />
                        <span className="w-[2px] h-1.5 bg-current rounded-sm" />
                        <span className="w-[2px] h-2   bg-current rounded-sm" />
                        <span className="w-[2px] h-2.5 bg-current rounded-sm" />
                      </div>
                      {/* Wifi */}
                      <svg viewBox="0 0 16 12" className="size-3 fill-current"><path d="M8 11.5l-1.5-1.5a2.121 2.121 0 0 1 3 0L8 11.5zm-3-3l-1-1a5 5 0 0 1 8 0l-1 1a3.5 3.5 0 0 0-6 0zm-3-3L0 4.5a9 9 0 0 1 16 0l-2 1A7 7 0 0 0 2 5.5z"/></svg>
                      {/* Battery */}
                      <div className="flex items-center">
                        <div className="w-5 h-2.5 border border-current rounded-[3px] flex items-center px-[1px]">
                          <div className="bg-current h-[6px] w-[14px] rounded-[1px]" />
                        </div>
                        <div className="w-[1px] h-1 bg-current ml-[1px] rounded-r-sm" />
                      </div>
                    </div>
                  </div>

                  {/* App header (MetaHerb Support) */}
                  <div className="bg-[#319754] px-4 pt-3 pb-3 flex items-center gap-3 text-white">
                    <ChevronLeft className="size-5 shrink-0" strokeWidth={2.4} />
                    <div className="size-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                      <Shield className="size-4" strokeWidth={2.4} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[14px] truncate`} style={{ fontWeight: 700 }}>MetaHerb Support</p>
                      <p className={`${font} text-[10px] opacity-80 inline-flex items-center gap-1`}>
                        <span className="size-1.5 rounded-full bg-[#4ade80]" />
                        ออนไลน์
                      </p>
                    </div>
                    <Phone className="size-4 shrink-0 opacity-80" strokeWidth={2.4} />
                    <MoreHorizontal className="size-5 shrink-0 opacity-80" strokeWidth={2.4} />
                  </div>

                  {/* Chat messages area — iPhone display 812 - status 44 - header 60 - home 34 = ~674 */}
                  <div className="bg-[#f5f5f5] px-3 py-4 overflow-y-auto flex flex-col gap-3" style={{ height: 674 }}>
                    {messages.map((m) => {
                      const rColor = roleColor(m.role);
                      const isAdmin = m.role === "admin";
                      const RoleIcon = m.role === "customer" ? Users : m.role === "admin" ? Shield : Store;
                      return (
                        <div key={m.id} className={`flex gap-2 items-end ${isAdmin ? "flex-row-reverse" : ""}`}>
                          {/* Avatar */}
                          <div className="size-7 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: rColor, color: "#fff" }}>
                            <RoleIcon className="size-3.5" strokeWidth={2.4} />
                          </div>
                          <div className={`flex flex-col gap-1 min-w-0 max-w-[75%] ${isAdmin ? "items-end" : "items-start"}`}>
                            {!isAdmin && (
                              <span className={`${font} text-[10px] px-1`} style={{ color: rColor, fontWeight: 600 }}>{m.authorName}</span>
                            )}
                            <div className={`px-3.5 py-2 ${isAdmin ? "rounded-2xl rounded-br-md" : "rounded-2xl rounded-bl-md"}`}
                              style={{
                                backgroundColor: m.isInternal ? "#fff7ed" : isAdmin ? ADMIN_PRIMARY : "#fff",
                                color:           m.isInternal ? "#9a3412" : isAdmin ? "#fff" : "#171717",
                                borderColor:     m.isInternal ? "#fed7aa" : isAdmin ? "transparent" : "#e5e7eb",
                                borderWidth:     m.isInternal || !isAdmin ? "1px" : "0",
                                borderStyle:     "solid",
                                boxShadow:       isAdmin ? "0 1px 2px rgba(49,151,84,0.2)" : "0 1px 2px rgba(0,0,0,0.04)",
                              }}>
                              {m.isInternal && (
                                <p className={`${font} text-[9px] inline-flex items-center gap-1 mb-1`} style={{ color: "#ff9500", fontWeight: 700 }}>
                                  <Lock className="size-2.5" strokeWidth={2.6} />
                                  โน้ตภายใน · admin เห็นเท่านั้น
                                </p>
                              )}
                              <p className={`${font} text-[12px] leading-relaxed`}>{m.text}</p>
                            </div>
                            <span className={`${font} text-[9px] text-gray-400 px-1 tabular-nums`}>{fmtDateTime(m.timestamp)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* iPhone home bar — gray (subtle) */}
                  <div className="bg-white py-2 flex items-center justify-center">
                    <div className="w-[120px] h-[4px] bg-gray-300 rounded-full" />
                  </div>
                </div>
              </div>
              {/* Wireframe label */}
              <p className={`${font} text-[10px] text-gray-400 text-center mt-2`}>
                ตัวอย่างที่ลูกค้าเห็นในแอพมือถือ · iPhone preview (375 × 812)
              </p>
            </div>

            {/* === Reply box — redesigned === */}
            <div className="mt-5 pt-5 border-t border-gray-100">
              {/* Mode toggle: ตอบกลับ vs โน้ตภายใน */}
              <div className="flex items-center gap-1.5 p-1 bg-[#fafafa] rounded-full mb-3 self-start w-fit">
                <button onClick={() => setIsInternal(false)}
                  className={`${font} inline-flex items-center gap-1.5 text-[12px] h-8 px-3 rounded-full cursor-pointer transition-all ${!isInternal ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-[#319754]" : "text-gray-500 hover:text-gray-700"}`}
                  style={{ fontWeight: !isInternal ? 700 : 500 }}>
                  <Mail className="size-3" strokeWidth={2.4} />
                  ตอบกลับลูกค้า/ร้านค้า
                </button>
                <button onClick={() => setIsInternal(true)}
                  className={`${font} inline-flex items-center gap-1.5 text-[12px] h-8 px-3 rounded-full cursor-pointer transition-all ${isInternal ? "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)] text-[#ff9500]" : "text-gray-500 hover:text-gray-700"}`}
                  style={{ fontWeight: isInternal ? 700 : 500 }}>
                  <Lock className="size-3" strokeWidth={2.4} />
                  โน้ตภายใน
                </button>
              </div>

              {/* Combined input container — bg เปลี่ยนตามโหมด */}
              <div className={`rounded-3xl p-3 flex flex-col gap-2 transition-colors border ${isInternal ? "bg-[#fff7ed] border-[#fed7aa]" : "bg-[#fafafa] border-transparent focus-within:border-[#319754]/30"}`}>
                <textarea ref={replyRef} value={reply} onChange={(e) => setReply(e.target.value)}
                  placeholder={isInternal ? "เขียนโน้ตภายใน — ลูกค้าและร้านค้าจะไม่เห็น..." : "ตอบกลับลูกค้าและร้านค้า..."}
                  rows={3}
                  className={`${font} bg-transparent outline-none px-2 text-[13px] resize-none w-full`}
                  style={{ fontWeight: 500 }} />
                {/* Action row */}
                <div className="flex items-center justify-between gap-2 px-1">
                  <Popover open={tplOpen} onOpenChange={setTplOpen}>
                    <PopoverTrigger asChild>
                      <button className={`${font} inline-flex items-center gap-1.5 text-[11px] text-gray-600 hover:text-[#319754] hover:bg-white px-2.5 h-8 rounded-full cursor-pointer transition-colors`}
                        style={{ fontWeight: 500 }}>
                        <Sparkles className="size-3.5 text-[#9747ff]" strokeWidth={2.4} />
                        เลือก template
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" sideOffset={6}
                      className="w-[340px] max-h-[400px] overflow-y-auto p-2 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                      {REPLY_TEMPLATES.map((cat) => (
                        <div key={cat.category} className="mb-2 last:mb-0">
                          <p className={`${font} text-[10px] text-gray-500 px-3 py-1.5`} style={{ fontWeight: 700 }}>{cat.category.toUpperCase()}</p>
                          {cat.items.map((tpl) => (
                            <button key={tpl.label}
                              onClick={() => { setReply(tpl.text); setTplOpen(false); }}
                              className={`${font} w-full flex flex-col items-start gap-0.5 px-3 py-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                              <span className={`${font} text-[12px] text-black`} style={{ fontWeight: 600 }}>{tpl.label}</span>
                              <span className={`${font} text-[10px] text-gray-500 line-clamp-1`}>{tpl.text}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </PopoverContent>
                  </Popover>
                  <motion.button onClick={handleSend}
                    whileTap={reply.trim() ? { scale: 0.96 } : undefined}
                    disabled={!reply.trim()}
                    className={`${font} inline-flex items-center gap-1.5 text-[12px] h-9 pl-4 pr-1.5 rounded-full transition-all ${reply.trim() ? `cursor-pointer text-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]` : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
                    style={reply.trim() ? { backgroundColor: isInternal ? "#ff9500" : ADMIN_PRIMARY, fontWeight: 600 } : { fontWeight: 600 }}>
                    {isInternal ? "บันทึกโน้ต" : "ส่งข้อความ"}
                    <span className="size-7 rounded-full bg-white/22 inline-flex items-center justify-center">
                      <ArrowRight className="size-3.5" strokeWidth={2.6} />
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>
          </FormSection>
        </div>

        {/* RIGHT: sidebar — fixed width 408px (ตรงกับร้านค้า) */}
        <div className="w-full lg:w-[408px] lg:shrink-0 flex flex-col gap-5 lg:sticky lg:top-5">
          {/* === การตัดสินคำร้องเรียน — pill buttons (spec ตรงกับร้านค้า: border 1px, icon size-8, radio 1.5px) === */}
          <FormSection icon={Gavel} iconColor={ADMIN_PRIMARY} title="การตัดสินคำร้องเรียน">
            <div className="flex flex-col gap-2 mb-3">
              {(["investigating", "resolved", "rejected"] as AdminComplaintStatus[]).map((s) => {
                const isAct = selectedStatus === s;
                const c = acStatusColors[s];
                const Icon = s === "investigating" ? Search : s === "resolved" ? Check : X;
                return (
                  <button key={s} onClick={() => setSelectedStatus(s)}
                    className={`relative rounded-full flex items-center gap-3 pl-1.5 pr-4 py-1.5 cursor-pointer transition-all ${isAct ? "" : "bg-white hover:bg-gray-50"}`}
                    style={{
                      border: `1px solid ${isAct ? c : "#e8e8e8"}`,
                      backgroundColor: isAct ? `${c}12` : undefined,
                    }}>
                    <span className="size-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: isAct ? c : `${c}20` }}>
                      <Icon className="size-4" style={{ color: isAct ? "#fff" : c }} strokeWidth={2.4} />
                    </span>
                    <p className={`${font} text-[13px] flex-1 text-left`}
                      style={{ color: isAct ? c : "#171717", fontWeight: isAct ? 600 : 500 }}>
                      {acStatusLabels[s]}
                    </p>
                    <span className="size-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors"
                      style={{ borderColor: isAct ? c : "#d4d4d8" }}>
                      {isAct && <span className="size-2 rounded-full" style={{ backgroundColor: c }} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => handleStatusChange(selectedStatus)}
              disabled={!isStatusDirty}
              className={`h-[45px] rounded-full w-full flex items-center justify-center transition-colors ${isStatusDirty ? "bg-[#319754] hover:bg-[#287745] cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}>
              <span className={`${font} text-[14px] ${isStatusDirty ? "text-white" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                บันทึกสถานะ
              </span>
            </button>
          </FormSection>

          {/* หมายเหตุถึงลูกค้า + ปุ่ม contact (เหมือนร้านค้า) */}
          <FormSection icon={Mail} iconColor="#0088ff" title="หมายเหตุถึงลูกค้า">
            <textarea value={isInternal ? "" : reply} onChange={(e) => { setIsInternal(false); setReply(e.target.value); }}
              placeholder="เขียนข้อความถึงลูกค้า..."
              rows={3}
              className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none w-full mb-2`}
              style={{ fontWeight: 500 }} />
            <button onClick={() => { setIsInternal(false); handleSend(); }}
              disabled={!reply.trim() || isInternal}
              className={`${font} w-full inline-flex items-center justify-center gap-1.5 text-[12px] h-9 rounded-full cursor-pointer transition-colors ${reply.trim() && !isInternal ? "bg-[#319754] hover:bg-[#267a43] text-white shadow-[0_2px_8px_rgba(49,151,84,0.25)]" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
              style={{ fontWeight: 600 }}>
              <ArrowRight className="size-3.5" strokeWidth={2.4} />
              ส่งข้อความ
            </button>
          </FormSection>

          {/* ปุ่ม contact: ส่งอีเมล + โทร (สีฟ้า + เขียว — ตรง pattern ร้านค้า) */}
          <div className="flex flex-col gap-2">
            <a href={`mailto:${complaint.customerEmail}`}
              className={`${font} w-full inline-flex items-center justify-center gap-2 text-[13px] h-11 rounded-full bg-[#0088ff] hover:bg-[#0066cc] text-white cursor-pointer transition-colors shadow-[0_2px_8px_rgba(0,136,255,0.25)]`}
              style={{ fontWeight: 600 }}>
              <Mail className="size-4" strokeWidth={2.4} />
              ส่งอีเมลหาลูกค้า
            </a>
            <a href={`tel:${complaint.customerPhone}`}
              className={`${font} w-full inline-flex items-center justify-center gap-2 text-[13px] h-11 rounded-full bg-[#319754] hover:bg-[#267a43] text-white cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
              style={{ fontWeight: 600 }}>
              <Phone className="size-4" strokeWidth={2.4} />
              โทรหาลูกค้า
            </a>
          </div>

          {/* === Admin extras: Customer profile === */}
          <FormSection icon={Users} iconColor="#0088ff" title="ข้อมูลลูกค้า" desc="ประวัติและความเสี่ยง">
            <div className="flex flex-col gap-2.5">
              <div>
                <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>{complaint.customerName}</p>
                <p className={`${font} text-[11px] text-gray-500 truncate`}>{complaint.customerEmail}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#fafafa] rounded-xl p-2.5">
                  <p className={`${font} text-[10px] text-gray-500`}>ครั้งที่ร้องเรียน</p>
                  <p className={`${font} text-[16px] tabular-nums`} style={{ fontWeight: 700, color: complaint.customerHistory > 2 ? "#ff9500" : "#319754" }}>
                    {complaint.customerHistory}
                  </p>
                </div>
                <div className="bg-[#fafafa] rounded-xl p-2.5">
                  <p className={`${font} text-[10px] text-gray-500`}>ระดับความเสี่ยง</p>
                  <p className={`${font} text-[12px]`} style={{ fontWeight: 700, color: complaint.customerHistory > 3 ? "#ff3b30" : complaint.customerHistory > 1 ? "#f59e0b" : "#319754" }}>
                    {complaint.customerHistory > 3 ? "สูง ⚠️" : complaint.customerHistory > 1 ? "กลาง" : "ต่ำ ✓"}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

          {/* Shop info */}
          <FormSection icon={Store} iconColor="#9747ff" title="ข้อมูลร้านค้า" desc={`Rating ${complaint.shopRating.toFixed(1)} ★`}>
            <div className="flex flex-col gap-2.5">
              <div>
                <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>{complaint.shopName}</p>
                <p className={`${font} text-[11px] text-gray-500 tabular-nums`}>{complaint.shopId}</p>
              </div>
              <div className="bg-[#fafafa] rounded-xl p-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className={`${font} text-[10px] text-gray-500`}>คะแนน</span>
                  <span className={`${font} text-[14px] tabular-nums inline-flex items-center gap-1`} style={{ fontWeight: 700, color: complaint.shopRating >= 4.5 ? "#319754" : complaint.shopRating >= 4 ? "#f59e0b" : "#ff3b30" }}>
                    <Star className="size-3.5" fill="currentColor" strokeWidth={0} />
                    {complaint.shopRating.toFixed(1)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(complaint.shopRating / 5) * 100}%`, backgroundColor: complaint.shopRating >= 4.5 ? "#319754" : complaint.shopRating >= 4 ? "#f59e0b" : "#ff3b30" }} />
                </div>
              </div>
              <button onClick={() => toast.info(`ดูร้าน ${complaint.shopName}`)}
                className={`${font} text-[11px] text-[#9747ff] bg-[#9747ff]/10 hover:bg-[#9747ff]/20 h-8 rounded-full cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5`}
                style={{ fontWeight: 600 }}>
                <ExternalLink className="size-3" strokeWidth={2.4} />
                ไปยังโปรไฟล์ร้าน
              </button>
            </div>
          </FormSection>

          {/* Status timeline */}
          <FormSection icon={Clock} iconColor="#f59e0b" title="ไทม์ไลน์สถานะ">
            <div className="flex flex-col gap-3">
              {([
                { id: "pending", label: "รอดำเนินการ", date: complaint.createdAt },
                { id: "investigating", label: "กำลังตรวจสอบ", date: complaint.status !== "pending" ? complaint.createdAt : "" },
                { id: complaint.status === "rejected" ? "rejected" : "resolved", label: complaint.status === "rejected" ? "ปฏิเสธ" : "แก้ไขแล้ว", date: complaint.status === "resolved" || complaint.status === "rejected" ? complaint.createdAt : "" },
              ] as { id: AdminComplaintStatus; label: string; date: string }[]).map((step, i, arr) => {
                const done = !!step.date;
                const stepColor = done ? acStatusColors[step.id] : "#d4d4d8";
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="size-7 rounded-full flex items-center justify-center" style={{ backgroundColor: done ? stepColor : "#f5f5f5" }}>
                        {done ? <Check className="size-3.5 text-white" strokeWidth={3} /> : <span className={`${font} text-[10px] text-gray-400`}>{i + 1}</span>}
                      </div>
                      {i < arr.length - 1 && <div className="w-px h-6 mt-1" style={{ backgroundColor: done ? stepColor : "#e5e5e5" }} />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className={`${font} text-[12px]`} style={{ fontWeight: done ? 600 : 400, color: done ? "#000" : "#a3a3a3" }}>{step.label}</p>
                      {done && <p className={`${font} text-[10px] text-gray-400 tabular-nums`}>{fmtDate(step.date)}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </FormSection>

          {/* Internal note */}
          <FormSection icon={Lock} iconColor="#ff9500" title="โน้ตภายใน" desc="admin เห็นเท่านั้น (ลูกค้า/ร้านค้าไม่เห็น)">
            <textarea value={internalNote} onChange={(e) => setInternalNote(e.target.value)}
              placeholder="บันทึกข้อสังเกต / ข้อมูลภายใน..."
              rows={3}
              className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none w-full mb-2`}
              style={{ fontWeight: 500 }} />
            <button onClick={handleSaveInternalNote}
              className={`${font} text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 h-8 rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5 w-full justify-center`}
              style={{ fontWeight: 600 }}>
              <Save className="size-3" strokeWidth={2.4} />
              บันทึกโน้ต
            </button>
          </FormSection>
        </div>
      </div>
    </div>
  );
}

function ComplaintListContent() {
  const [complaints, setComplaints] = useState<AdminComplaint[]>(initialAdminComplaints);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminComplaintStatus>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openId, setOpenId] = useState<string | null>(null);

  const openComplaint = openId ? complaints.find((c) => c.id === openId) : null;
  if (openComplaint) {
    return (
      <ComplaintDetailContent complaint={openComplaint}
        onBack={() => setOpenId(null)}
        onUpdate={(next) => setComplaints((prev) => prev.map((c) => c.id === next.id ? next : c))} />
    );
  }

  const statusTabs: { id: "all" | AdminComplaintStatus; label: string; count: number; Icon: any }[] = [
    { id: "all",           label: "ทั้งหมด",       count: complaints.length, Icon: AlertCircle },
    { id: "pending",       label: "รอดำเนินการ",   count: complaints.filter((c) => c.status === "pending").length, Icon: Clock },
    { id: "investigating", label: "กำลังตรวจสอบ",  count: complaints.filter((c) => c.status === "investigating").length, Icon: Search },
    { id: "resolved",      label: "แก้ไขแล้ว",     count: complaints.filter((c) => c.status === "resolved").length, Icon: Check },
    { id: "rejected",      label: "ปฏิเสธ",        count: complaints.filter((c) => c.status === "rejected").length, Icon: X },
  ];

  const filtered = complaints.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return [c.id, c.customerName, c.shopName, c.orderId, c.title].some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  return (
    <div>
      {/* Header — pattern เดียวกับ default + ปุ่มขวา (export) ให้สูงเท่าหน้าอื่น */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>รายการการร้องเรียน</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>รายละเอียดคำร้องเรียนทุกร้านค้า พร้อมการจัดสรรผู้ดูแลและบันทึกภายใน</p>
        </div>
        <motion.button
          onClick={() => toast.success(`ส่งออก ${filtered.length} รายการ`)}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer transition-colors`}>
          <span className="size-[26px] bg-[#319754]/10 rounded-full flex items-center justify-center">
            <Upload className="size-[14px] text-[#319754]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>ส่งออกรายการ</span>
        </motion.button>
      </div>

      <div className="flex flex-col gap-5">
      {/* Filter pill */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
        <FilterTabPills tabs={statusTabs} active={statusFilter} onChange={(id) => { setStatusFilter(id); setPage(1); }} pillId="adminComplaintsPill" />
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="ค้นหา ID, ลูกค้า, ร้านค้า..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table — pattern เดียวกับ ComplaintsTab ของร้านค้า */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "16%" }} />{/* เลขที่ + icon ประเภท */}
            <col style={{ width: "18%" }} />{/* ลูกค้า */}
            <col style={{ width: "16%" }} />{/* ร้านค้า */}
            <col style={{ width: "12%" }} />{/* วันที่ */}
            <col style={{ width: "10%" }} />{/* ระดับ */}
            <col style={{ width: "10%" }} />{/* SLA */}
            <col style={{ width: "12%" }} />{/* สถานะ */}
            <col style={{ width: "6%" }}  />{/* จัดการ */}
          </colgroup>
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>เลขที่</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ลูกค้า</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ร้านค้า</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>วันที่</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>ระดับ</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>SLA</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
              <th className="text-center pb-3"      style={{ fontWeight: 500 }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={8} className={`py-12 text-center ${font} text-[13px] text-gray-400`}>ไม่พบคำร้องเรียน</td></tr>
            ) : paged.map((c) => {
              const sColor = acStatusColors[c.status];
              const cColor = acCategoryColors[c.category];
              const sevColor = acSeverityColors[c.severity];
              const sla = getSLAStatus(c);
              const slaColor = sla.isResolved ? "#737373" : sla.isBreached ? "#ff3b30" : sla.isWarn ? "#f59e0b" : "#319754";

              // Type icon mapping (เหมือนร้านค้า)
              const typeIcon: Record<AdminComplaintCategory, { Icon: any; hover: string }> = {
                damaged:        { Icon: AlertTriangle, hover: "group-hover:rotate-[-12deg] group-hover:scale-110" },
                wrong_item:     { Icon: PackageX,      hover: "group-hover:rotate-[12deg] group-hover:scale-110" },
                shipping:       { Icon: Truck,         hover: "group-hover:translate-x-1" },
                service:        { Icon: AlertCircle,   hover: "group-hover:scale-110" },
                fraud:          { Icon: Shield,        hover: "group-hover:scale-110" },
                refund_request: { Icon: Wallet,        hover: "group-hover:-translate-y-0.5 group-hover:scale-110" },
              };
              const statusIcon: Record<AdminComplaintStatus, any> = {
                pending:       Clock, investigating: Search, resolved: Check, rejected: X,
              };
              const { Icon: TIcon, hover: tHover } = typeIcon[c.category];
              const SIcon = statusIcon[c.status];

              return (
                <tr key={c.id} className="group border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setOpenId(c.id)}>
                  {/* เลขที่ + icon ประเภท */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="size-10 rounded-[16px] flex items-center justify-center shrink-0 transform-gpu transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: `${cColor}1a` }}
                        title={acCategoryLabels[c.category]}>
                        <TIcon className={`size-5 transform-gpu transition-transform duration-300 ${tHover}`}
                          style={{ color: cColor }} strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className={`${font} text-[13px] text-black tabular-nums truncate`} style={{ fontWeight: 500 }} title={c.id}>{c.id}</p>
                        <p className={`${font} text-[11px] text-gray-400 truncate`} title={acCategoryLabels[c.category]}>{acCategoryLabels[c.category]}</p>
                      </div>
                    </div>
                  </td>
                  {/* ลูกค้า + history badge */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }} title={c.customerName}>{c.customerName}</p>
                    <p className={`${font} text-[11px] text-gray-400 truncate inline-flex items-center gap-1.5`}>
                      ฿{c.amount.toLocaleString()}
                      {c.customerHistory > 1 && (
                        <span className={`${font} text-[10px] inline-flex items-center px-1.5 rounded-full bg-[#ff9500]/15 text-[#ff9500]`} style={{ fontWeight: 600 }}>
                          ครั้งที่ {c.customerHistory}
                        </span>
                      )}
                    </p>
                  </td>
                  {/* ร้านค้า (admin extra) */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }} title={c.shopName}>{c.shopName}</p>
                    <p className={`${font} text-[11px] text-gray-400 inline-flex items-center gap-0.5 truncate`}>
                      <Star className="size-2.5" fill="#f59e0b" strokeWidth={0} /> {c.shopRating.toFixed(1)} · {c.shopId}
                    </p>
                  </td>
                  {/* วันที่ */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black tabular-nums`}>{fmtDate(c.createdAt)}</p>
                    <p className={`${font} text-[11px] text-gray-400 truncate`}>{c.assignedTo}</p>
                  </td>
                  {/* ระดับ severity */}
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-1.5 pl-2 pr-3 py-0.5 rounded-full text-[12px]`}
                      style={{ backgroundColor: `${sevColor}1a`, color: sevColor, fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: sevColor }} />
                      {acSeverityLabels[c.severity]}
                    </span>
                  </td>
                  {/* SLA */}
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-1 pl-1.5 pr-2.5 py-0.5 rounded-full text-[11px] tabular-nums`}
                      style={{ backgroundColor: `${slaColor}1a`, color: slaColor, fontWeight: 600 }}>
                      <Clock className="size-2.5" strokeWidth={2.6} />
                      {sla.isResolved ? "ปิดเคส" : sla.isBreached ? `เกิน ${Math.abs(sla.remaining)}h` : `${sla.remaining}h`}
                    </span>
                  </td>
                  {/* สถานะ */}
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-1.5 pl-2 pr-3 py-0.5 rounded-full text-[12px] whitespace-nowrap`}
                      style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 500 }}>
                      <SIcon className="size-3" strokeWidth={2.4} />
                      {acStatusLabels[c.status]}
                    </span>
                  </td>
                  {/* จัดการ */}
                  <td className="py-3 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={6}
                        className="w-[200px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                        <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                          style={{ transformOrigin: "top right" }} className="overflow-hidden">
                          <button onClick={() => setOpenId(c.id)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ดูรายละเอียด</span>
                          </button>
                          <button onClick={() => toast.success(`ปิดเคส ${c.id}`)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#319754]/5 cursor-pointer transition-colors text-left text-[13px] text-[#319754]`}>
                            <Check className="size-3.5" strokeWidth={2.6} />
                            <span style={{ fontWeight: 500 }}>ปิดเคส</span>
                          </button>
                          <button onClick={() => toast.info(`มอบหมาย ${c.id}`)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <UserCog className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>มอบหมายผู้ดูแล</span>
                          </button>
                        </motion.div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>


        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
              <div className="relative">
                <select className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                  value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า · ทั้งหมด {filtered.length} รายการ</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === n ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: safePage === n ? 600 : 400 }}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

/* ========== COMPLAINT APPEALS ========== */
type AppealStatus = "pending" | "reviewing" | "upheld" | "denied";

interface ComplaintAppeal {
  id: string;
  originalComplaintId: string;
  originalOrderId: string;
  customerName: string;
  customerEmail: string;
  shopName: string;
  appealReason: string;
  newEvidence: string;
  evidenceImages: string[];
  evidenceVideo?: { url: string; poster: string; duration: string };
  originalItems: { image: string; name: string; option: string; qty: number; price: number }[];
  appealStatus: AppealStatus;
  reviewedBy: string;
  reviewerNote: string;
  submittedAt: string;
  rulingAt: string;
  originalCategory: AdminComplaintCategory;
  originalAmount: number;
  originalRejectReason: string;
}

const appealStatusLabels: Record<AppealStatus, string> = {
  pending:   "รออ่านคำอุทธรณ์",
  reviewing: "กำลังพิจารณา",
  upheld:    "ยืนตามคำอุทธรณ์",  // overturned admin's original rejection
  denied:    "ยืนตามคำตัดสินเดิม", // admin's original rejection stands
};
const appealStatusColors: Record<AppealStatus, string> = {
  pending:   "#f59e0b",
  reviewing: "#0088ff",
  upheld:    "#319754",
  denied:    "#ff383c",
};

const initialAppeals: ComplaintAppeal[] = [
  { id: "APL-26050001", originalComplaintId: "CMP-26050006", originalOrderId: "ORD-20260318-4426", customerName: "มานะ ขยันดี",       customerEmail: "mana@email.com",       shopName: "สมุนไพรไพล",
    appealReason: "ทีมตอบว่าไม่มีหลักฐาน แต่ผมเก็บภาพไว้ในมือถือสำรอง เพิ่งกู้คืนได้ ขอแนบรูปและคลิปวิดีโอตอนแกะกล่อง",
    newEvidence: "รูปขวดน้ำมันที่เสียหาย 3 รูป + คลิปวิดีโอ 23 วินาที ตอนแกะกล่อง (กู้จากมือถือสำรอง)",
    evidenceImages: [
      "https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=800&q=80",
      "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=800&q=80",
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
    ],
    evidenceVideo: { url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", poster: "https://images.unsplash.com/photo-1611073615452-04d76e76e8b2?w=1200&q=80", duration: "0:23" },
    originalItems: [
      { image: _img.oil, name: "น้ำมันไพลสกัดเข้มข้น", option: "ขนาด 30ml · สูตรต้นตำรับ", qty: 1, price: 195 },
    ],
    appealStatus: "reviewing", reviewedBy: "ปริญญา (หัวหน้าฝ่าย)", reviewerNote: "ดูคลิปแล้ว — มีร่องรอยน้ำมันชัดเจน ขอตรวจสอบกับ shop owner ก่อน",
    submittedAt: "2026-05-06", rulingAt: "",
    originalCategory: "damaged", originalAmount: 195, originalRejectReason: "ไม่มีหลักฐานภาพถ่ายตอนรับสินค้า" },

  { id: "APL-26050002", originalComplaintId: "CMP-26050017", originalOrderId: "ORD-20260330-4517", customerName: "ภูริชญา จันทร์เพ็ญ",  customerEmail: "purichaya@email.com",  shopName: "บ้านสมุนไพรเมต้า",
    appealReason: "ไม่ยอมรับว่าถุงหอมยังหอมอยู่ — ส่งกลับให้ทดสอบใหม่ก็ได้ ขอให้ส่งทีมที่เป็นกลางตรวจ",
    newEvidence: "ลูกค้าเสนอส่งคืนสินค้าให้ตรวจ + ขอภาพการทดสอบจากทีมเก่า",
    evidenceImages: [],
    originalItems: [
      { image: _img.herbal, name: "ถุงหอมสมุนไพรไทย", option: "ชุด 3 ถุง · กลิ่นตะไคร้-มะกรูด", qty: 1, price: 199 },
    ],
    appealStatus: "pending", reviewedBy: "—", reviewerNote: "",
    submittedAt: "2026-05-08", rulingAt: "",
    originalCategory: "service", originalAmount: 199, originalRejectReason: "ทดสอบในร้านพบว่ายังหอมปกติ" },

  { id: "APL-26050003", originalComplaintId: "CMP-26050018", originalOrderId: "ORD-20260325-4518", customerName: "นิติพล วัฒนะ",        customerEmail: "nitipol@email.com",    shopName: "เกษตรกรไทย",
    appealReason: "ผมเปิดสินค้าใช้แค่ครั้งเดียวก็เกิดอาการแพ้ — กรณีนี้ควรเข้าข่ายข้อยกเว้นด้านสุขภาพ ขอพิจารณาใหม่",
    newEvidence: "ใบรับรองแพทย์ระบุการแพ้สาร x ในผลิตภัณฑ์ + ภาพผื่นบนผิว 2 รูป",
    evidenceImages: [
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80",
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80",
    ],
    originalItems: [
      { image: _img.cream, name: "ครีมสมุนไพรบำรุงผิว", option: "ขนาด 50g · สูตรอ่อนโยน", qty: 1, price: 245 },
    ],
    appealStatus: "upheld", reviewedBy: "ปริญญา (หัวหน้าฝ่าย)", reviewerNote: "พิจารณาเพิ่ม — กรณีสุขภาพได้รับการยกเว้น คืนเงินเต็มจำนวน + ส่งเรื่องให้ shop ปรับฉลากเตือนการแพ้",
    submittedAt: "2026-05-02", rulingAt: "2026-05-09",
    originalCategory: "service", originalAmount: 245, originalRejectReason: "เปิดใช้แล้วเกิน 7 วัน ไม่ตรงตามนโยบาย" },

  { id: "APL-26050004", originalComplaintId: "CMP-26050020", originalOrderId: "ORD-20260322-4520", customerName: "ศิริรัตน์ ทองดี",       customerEmail: "siriwat@email.com",    shopName: "ทุ่งหญ้าออร์แกนิก",
    appealReason: "ใบสั่งซื้อที่ทีมแสดงเป็น screenshot คนละไฟล์กับของผม ขอตรวจสอบใหม่",
    newEvidence: "Screenshot อีเมลยืนยันคำสั่งซื้อจาก system + ใบเสร็จที่ได้รับ 2 รูป",
    evidenceImages: [
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
      "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80",
    ],
    originalItems: [
      { image: _img.tea,     name: "ชาสมุนไพรอินทรีย์", option: "20 ซอง · รสมิ้นต์",  qty: 1, price: 80 },
      { image: _img.capsule, name: "แคปซูลขมิ้นชัน",     option: "60 เม็ด",            qty: 1, price: 50 },
    ],
    appealStatus: "denied", reviewedBy: "พิเชษฐ์ (Senior Admin)", reviewerNote: "ตรวจ log ของระบบแล้ว — ใบสั่งซื้อตรงตามที่ shop จัดส่ง ลูกค้าจำผิด ปฏิเสธอีกครั้ง",
    submittedAt: "2026-04-28", rulingAt: "2026-05-03",
    originalCategory: "wrong_item", originalAmount: 130, originalRejectReason: "ตรวจสอบใบสั่งซื้อพบว่าตรงตามที่สั่ง" },

  { id: "APL-26050005", originalComplaintId: "CMP-26050022", originalOrderId: "ORD-20260328-4522", customerName: "วิลัยรัตน์ ดำรงค์",     customerEmail: "wilai@email.com",      shopName: "วิถีไทยเฮิร์บ",
    appealReason: "ขอยื่นเรื่องอุทธรณ์ใหม่ พร้อมหลักฐานเพิ่มเติม — ทีมไม่ได้ตรวจสอบกล้องวงจรปิดของบริษัทขนส่ง",
    newEvidence: "ขอให้ติดต่อ Kerry Express สาขาที่ส่ง เพื่อดู CCTV (เคยร้องไปเมื่อต้นเดือน)",
    evidenceImages: [],
    originalItems: [
      { image: _img.giftset, name: "เซ็ตของขวัญสมุนไพรพรีเมียม", option: "Premium Gift Set · 6 ชิ้น", qty: 1, price: 540 },
    ],
    appealStatus: "reviewing", reviewedBy: "วิภาดา", reviewerNote: "ส่งคำขอ CCTV แล้ว รอตอบ 3-5 วัน",
    submittedAt: "2026-05-04", rulingAt: "",
    originalCategory: "shipping", originalAmount: 540, originalRejectReason: "หลักฐานไม่ชัดเจน — ระบบขนส่งแจ้งจัดส่งสำเร็จ" },
];

function ComplaintAppealsContent() {
  const [appeals, setAppeals] = useState<ComplaintAppeal[]>(initialAppeals);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AppealStatus>("all");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [openId, setOpenId] = useState<string | null>(null);

  const openAppeal = openId ? appeals.find((a) => a.id === openId) : null;
  if (openAppeal) {
    return (
      <AppealDetailContent appeal={openAppeal}
        onBack={() => setOpenId(null)}
        onUpdate={(next) => setAppeals((prev) => prev.map((a) => a.id === next.id ? next : a))} />
    );
  }

  const statusTabs: { id: "all" | AppealStatus; label: string; count: number; Icon: any }[] = [
    { id: "all",       label: "ทั้งหมด",          count: appeals.length, Icon: Gavel },
    { id: "pending",   label: "รออ่าน",          count: appeals.filter((a) => a.appealStatus === "pending").length, Icon: Clock },
    { id: "reviewing", label: "กำลังพิจารณา",   count: appeals.filter((a) => a.appealStatus === "reviewing").length, Icon: Search },
    { id: "upheld",    label: "ยืนตามอุทธรณ์",   count: appeals.filter((a) => a.appealStatus === "upheld").length, Icon: Check },
    { id: "denied",    label: "ยืนตามเดิม",      count: appeals.filter((a) => a.appealStatus === "denied").length, Icon: X },
  ];

  const filtered = appeals.filter((a) => {
    if (statusFilter !== "all" && a.appealStatus !== statusFilter) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return [a.id, a.originalComplaintId, a.customerName, a.shopName].some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  return (
    <div>
      {/* Header — pattern เดียวกับ default + ปุ่มขวา (export) */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>ข้ออุทธรณ์</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>เคสที่ลูกค้าขอโต้แย้งผลการตัดสินของผู้ดูแล (เคสที่ถูกปฏิเสธ)</p>
        </div>
        <motion.button
          onClick={() => toast.success(`ส่งออก ${filtered.length} รายการ`)}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer transition-colors`}>
          <span className="size-[26px] bg-[#319754]/10 rounded-full flex items-center justify-center">
            <Upload className="size-[14px] text-[#319754]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>ส่งออกรายการ</span>
        </motion.button>
      </div>

      <div className="flex flex-col gap-5">
      {/* Filter pill */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
        <FilterTabPills tabs={statusTabs} active={statusFilter} onChange={(id) => { setStatusFilter(id); setPage(1); }} pillId="adminAppealsPill" />
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="ค้นหา APL, CMP, ลูกค้า..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table — pattern เดียวกับรายการการร้องเรียน */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "14%" }} />{/* APL ID + ↳ CMP */}
            <col style={{ width: "16%" }} />{/* ลูกค้า */}
            <col style={{ width: "14%" }} />{/* ร้านค้า */}
            <col style={{ width: "10%" }} />{/* ประเภทเดิม */}
            <col style={{ width: "12%" }} />{/* วันที่ยื่น */}
            <col style={{ width: "12%" }} />{/* ผู้พิจารณา */}
            <col style={{ width: "16%" }} />{/* สถานะ */}
            <col style={{ width: "6%" }}  />{/* จัดการ */}
          </colgroup>
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>เลขที่อุทธรณ์</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ลูกค้า</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ร้านค้า</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ประเภทเดิม</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>วันที่ยื่น</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ผู้พิจารณา</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
              <th className="text-center pb-3"      style={{ fontWeight: 500 }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr><td colSpan={8} className={`py-12 text-center ${font} text-[13px] text-gray-400`}>ไม่พบข้ออุทธรณ์</td></tr>
            ) : paged.map((a) => {
              const sColor = appealStatusColors[a.appealStatus];
              const cColor = acCategoryColors[a.originalCategory];
              const statusIcon: Record<AppealStatus, any> = {
                pending: Clock, reviewing: Search, upheld: Check, denied: X,
              };
              const SIcon = statusIcon[a.appealStatus];
              return (
                <tr key={a.id} className="group border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => setOpenId(a.id)}>
                  {/* APL ID + ↳ CMP */}
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <span className="size-10 rounded-[16px] flex items-center justify-center shrink-0 transform-gpu transition-all duration-300 group-hover:scale-105"
                        style={{ backgroundColor: "#9747ff1a" }}
                        title="ข้ออุทธรณ์">
                        <Gavel className="size-5 transform-gpu transition-transform duration-300 group-hover:rotate-[-12deg]" style={{ color: "#9747ff" }} strokeWidth={2} />
                      </span>
                      <div className="min-w-0">
                        <p className={`${font} text-[13px] text-black tabular-nums truncate`} style={{ fontWeight: 500 }}>{a.id}</p>
                        <p className={`${font} text-[11px] text-gray-400 truncate inline-flex items-center gap-0.5`}>
                          ↳ <span className="tabular-nums">{a.originalComplaintId}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  {/* ลูกค้า */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }} title={a.customerName}>{a.customerName}</p>
                    <p className={`${font} text-[11px] text-gray-400 truncate`} title={a.customerEmail}>{a.customerEmail}</p>
                  </td>
                  {/* ร้านค้า */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black truncate inline-flex items-center gap-1`} style={{ fontWeight: 500 }} title={a.shopName}>
                      <Store className="size-3 text-gray-400 shrink-0" strokeWidth={2.4} />
                      <span className="truncate">{a.shopName}</span>
                    </p>
                    <p className={`${font} text-[11px] text-gray-400 tabular-nums`}>฿{a.originalAmount.toLocaleString()}</p>
                  </td>
                  {/* ประเภทเดิม */}
                  <td className="py-3 pr-4">
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full`}
                      style={{ backgroundColor: `${cColor}1a`, color: cColor, fontWeight: 600 }}>
                      {acCategoryLabels[a.originalCategory]}
                    </span>
                  </td>
                  {/* วันที่ยื่น */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black tabular-nums`}>{fmtDate(a.submittedAt)}</p>
                    {a.rulingAt && (
                      <p className={`${font} text-[11px] text-gray-400 tabular-nums truncate`} title={`ตัดสิน ${fmtDate(a.rulingAt)}`}>
                        ตัดสิน {fmtDate(a.rulingAt)}
                      </p>
                    )}
                  </td>
                  {/* ผู้พิจารณา */}
                  <td className="py-3 pr-4">
                    <p className={`${font} text-[13px] text-black truncate inline-flex items-center gap-1`} style={{ fontWeight: 500 }} title={a.reviewedBy}>
                      <UserCog className="size-3 text-gray-400 shrink-0" strokeWidth={2.4} />
                      <span className="truncate">{a.reviewedBy}</span>
                    </p>
                  </td>
                  {/* สถานะอุทธรณ์ */}
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-1.5 pl-2 pr-3 py-0.5 rounded-full text-[12px] whitespace-nowrap`}
                      style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 500 }}>
                      <SIcon className="size-3" strokeWidth={2.4} />
                      {appealStatusLabels[a.appealStatus]}
                    </span>
                  </td>
                  {/* จัดการ */}
                  <td className="py-3 text-center align-middle" onClick={(e) => e.stopPropagation()}>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                          <MoreHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={6}
                        className="w-[220px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                        <motion.div initial={{ scale: 0.4, opacity: 0, y: -6 }} animate={{ scale: 1, opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 380, damping: 26 }}
                          style={{ transformOrigin: "top right" }} className="overflow-hidden">
                          <button onClick={() => setOpenId(a.id)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ดูรายละเอียด</span>
                          </button>
                          <button onClick={() => toast.info(`ดูเคสต้นฉบับ ${a.originalComplaintId}`)}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                            <FileText className="size-3.5 text-gray-500" strokeWidth={2.2} />
                            <span style={{ fontWeight: 500 }}>ดูเคสต้นฉบับ</span>
                          </button>
                          <div className="h-px bg-gray-100 my-1" />
                          <button onClick={() => { setAppeals((prev) => prev.map((x) => x.id === a.id ? { ...x, appealStatus: "upheld", rulingAt: new Date().toISOString().slice(0, 10) } : x)); toast.success(`ยืนตามอุทธรณ์ ${a.id}`); }}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#319754]/5 cursor-pointer transition-colors text-left text-[13px] text-[#319754]`}>
                            <Check className="size-3.5" strokeWidth={2.6} />
                            <span style={{ fontWeight: 500 }}>ยืนตามอุทธรณ์</span>
                          </button>
                          <button onClick={() => { setAppeals((prev) => prev.map((x) => x.id === a.id ? { ...x, appealStatus: "denied", rulingAt: new Date().toISOString().slice(0, 10) } : x)); toast.error(`ยืนตามคำตัดสินเดิม ${a.id}`); }}
                            className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                            <X className="size-3.5" strokeWidth={2.6} />
                            <span style={{ fontWeight: 500 }}>ปฏิเสธอุทธรณ์</span>
                          </button>
                        </motion.div>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
            <div className="flex items-center gap-2">
              <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
              <div className="relative">
                <select className={`${font} text-[12px] appearance-none border border-gray-200 rounded-full pl-3 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                  value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}>
                  {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
                <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
              <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า · ทั้งหมด {filtered.length} รายการ</span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              <button disabled={safePage === 1} onClick={() => setPage(safePage - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === n ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: safePage === n ? 600 : 400 }}>{n}</button>
              ))}
              <button disabled={safePage === totalPages} onClick={() => setPage(safePage + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

/* ========== APPEAL DETAIL ========== */
function AppealDetailContent({ appeal, onBack, onUpdate }: {
  appeal: ComplaintAppeal;
  onBack: () => void;
  onUpdate: (next: ComplaintAppeal) => void;
}) {
  const [selectedStatus, setSelectedStatus] = useState<AppealStatus>(appeal.appealStatus);
  const [reviewerNote, setReviewerNote] = useState(appeal.reviewerNote);
  const [internalNote, setInternalNote] = useState("");
  const isStatusDirty = selectedStatus !== appeal.appealStatus;

  const sColor = appealStatusColors[appeal.appealStatus];
  const cColor = acCategoryColors[appeal.originalCategory];

  const fmtDate = (iso: string) => {
    if (!iso) return "—";
    const d = new Date(iso);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}`;
  };

  const handleSaveStatus = () => {
    onUpdate({ ...appeal, appealStatus: selectedStatus, reviewerNote, rulingAt: selectedStatus === "pending" || selectedStatus === "reviewing" ? "" : new Date().toISOString().slice(0, 10) });
    toast.success(`บันทึกผลการพิจารณา: ${appealStatusLabels[selectedStatus]}`);
  };
  const handleSaveReviewerNote = () => {
    onUpdate({ ...appeal, reviewerNote });
    toast.success("บันทึกบันทึกของผู้พิจารณาแล้ว");
  };

  // Decision options ที่ admin จะเลือกได้ (ไม่รวม pending — ลูกค้าเป็นผู้สร้าง)
  const decisionOptions: { id: AppealStatus; Icon: any }[] = [
    { id: "reviewing", Icon: Search },
    { id: "upheld",    Icon: Check },
    { id: "denied",    Icon: X },
  ];

  return (
    <div>
      {/* Back + วันที่ยื่น */}
      <div className="mb-5 flex items-center gap-3 flex-wrap">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <span className={`${font} text-[13px] text-gray-500`}>ยื่นอุทธรณ์เมื่อ {fmtDate(appeal.submittedAt)}</span>
      </div>

      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className={`${font} text-[26px] tabular-nums`} style={{ fontWeight: 700 }}>{appeal.id}</h2>
          {/* Original CMP link inline */}
          <span className={`${font} inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 tabular-nums`}
            style={{ fontWeight: 500 }} title="เคสต้นฉบับ">
            <FileText className="size-3" strokeWidth={2.4} />
            ↳ {appeal.originalComplaintId}
          </span>
        </div>
        <span className={`${font} inline-flex items-center gap-2 text-[13px] px-3.5 py-1.5 rounded-full whitespace-nowrap`}
          style={{ backgroundColor: `${sColor}1a`, color: sColor, fontWeight: 600 }}>
          <Gavel className="size-3.5" strokeWidth={2.4} />
          {appealStatusLabels[appeal.appealStatus]}
        </span>
      </div>

      {/* 2-col layout (เหมือนหน้ารายละเอียดร้องเรียน) */}
      <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
        {/* LEFT */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-5">
          {/* เคสต้นฉบับ */}
          <FormSection icon={FileText} iconColor={cColor} title="เคสต้นฉบับ" desc="ข้อมูลคำร้องเดิมที่ถูกปฏิเสธ">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>เลขที่คำร้องเดิม</p>
                <p className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>{appeal.originalComplaintId}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>เลขที่คำสั่งซื้อ</p>
                <p className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>{appeal.originalOrderId}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>ประเภทเดิม</p>
                <span className={`${font} inline-flex items-center gap-1.5 text-[12px] px-2.5 py-1 rounded-full`}
                  style={{ backgroundColor: `${cColor}1a`, color: cColor, fontWeight: 600 }}>
                  {acCategoryLabels[appeal.originalCategory]}
                </span>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1 inline-flex items-center gap-1`}>
                  <Store className="size-3 text-gray-400" strokeWidth={2.4} />
                  ร้านค้า
                </p>
                <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{appeal.shopName}</p>
              </div>
              <div>
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>ลูกค้า</p>
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>{appeal.customerName}</p>
                <p className={`${font} text-[11px] text-gray-500 truncate mt-0.5`}>{appeal.customerEmail}</p>
              </div>
              {/* ยอดที่เกี่ยวข้อง */}
              <div className="sm:col-span-2 pt-3 mt-1 border-t border-gray-100">
                <p className={`${font} text-[12px] text-gray-500 mb-1`}>ยอดเงินที่เกี่ยวข้อง</p>
                <p className={`${font} text-[24px] tabular-nums`} style={{ fontWeight: 700, color: ADMIN_PRIMARY }}>
                  ฿{appeal.originalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {/* เหตุผลที่ปฏิเสธในตอนแรก */}
            <div className="mt-5">
              <p className={`${font} text-[12px] text-gray-500 mb-2 inline-flex items-center gap-1.5`}>
                <X className="size-3 text-[#ff3b30]" strokeWidth={2.6} />
                เหตุผลที่ปฏิเสธในตอนแรก
              </p>
              <div className="bg-[#fff5f5] border border-[#fecaca] rounded-2xl p-4">
                <p className={`${font} text-[14px] text-[#7f1d1d] leading-relaxed`}>{appeal.originalRejectReason}</p>
              </div>
            </div>
          </FormSection>

          {/* สินค้าในคำสั่งซื้อ — pattern เดียวกับหน้ารายละเอียดร้องเรียน */}
          <FormSection icon={Package} iconColor="#0088ff" title="สินค้าในคำสั่งซื้อ"
            desc={`${appeal.originalItems.length} รายการ · รวม ฿${appeal.originalItems.reduce((s, it) => s + it.qty * it.price, 0).toLocaleString()}`}>
            <div className="flex flex-col gap-3">
              {appeal.originalItems.map((it, i) => {
                const subtotal = it.qty * it.price;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[#fafafa] hover:bg-gray-100 transition-colors">
                    <div className="size-14 rounded-xl overflow-hidden bg-gray-200 shrink-0">
                      <ImageWithFallback src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{it.name}</p>
                      {it.option && <p className={`${font} text-[11px] text-gray-500 truncate mt-0.5`}>{it.option}</p>}
                      <p className={`${font} text-[11px] text-gray-400 mt-0.5 tabular-nums`}>
                        จำนวน {it.qty} · ฿{it.price.toLocaleString()}/ชิ้น
                      </p>
                    </div>
                    <p className={`${font} text-[14px] text-black tabular-nums shrink-0`} style={{ fontWeight: 700 }}>
                      ฿{subtotal.toLocaleString()}
                    </p>
                  </div>
                );
              })}
              {/* Total */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className={`${font} text-[12px] text-gray-500`}>รวมทั้งหมด</span>
                <span className={`${font} text-[16px] tabular-nums`} style={{ fontWeight: 700, color: ADMIN_PRIMARY }}>
                  ฿{appeal.originalItems.reduce((s, it) => s + it.qty * it.price, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </FormSection>

          {/* เหตุผลการอุทธรณ์ */}
          <FormSection icon={Gavel} iconColor="#9747ff" title="เหตุผลการอุทธรณ์" desc="ข้อโต้แย้งจากลูกค้า">
            <div className="bg-[#fafafa] border border-gray-100 rounded-2xl p-4">
              <p className={`${font} text-[14px] text-black leading-relaxed`}>{appeal.appealReason}</p>
            </div>
          </FormSection>

          {/* หลักฐานเพิ่มเติม — รูป/คลิป + คำอธิบาย */}
          <FormSection icon={ImageIcon} iconColor="#0088ff" title="หลักฐานเพิ่มเติม"
            desc={(() => {
              const n = appeal.evidenceImages.length;
              const v = appeal.evidenceVideo ? 1 : 0;
              if (!n && !v) return "ลูกค้าไม่ได้แนบไฟล์ใหม่";
              const parts: string[] = [];
              if (n) parts.push(`${n} ภาพ`);
              if (v) parts.push(`${v} คลิป`);
              return `${parts.join(" + ")} — กดเพื่อดูใหญ่`;
            })()}>
            <div className="flex flex-col gap-4">
              {/* Media grid — video tile + images (uniform square thumbnails) */}
              {(appeal.evidenceVideo || appeal.evidenceImages.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {/* Video tile (เหมือนภาพ — square, มี play overlay) */}
                  {appeal.evidenceVideo && (
                    <a href={appeal.evidenceVideo.url} target="_blank" rel="noopener noreferrer"
                      className="group/vid relative aspect-square rounded-xl overflow-hidden bg-black cursor-pointer hover:ring-2 hover:ring-[#0088ff]/40 transition-all">
                      <ImageWithFallback src={appeal.evidenceVideo.poster} alt="video preview"
                        className="w-full h-full object-cover opacity-85 group-hover/vid:opacity-100 group-hover/vid:scale-110 transition-all duration-300" />
                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="size-10 rounded-full bg-white/95 flex items-center justify-center shadow-[0_2px_10px_rgba(0,0,0,0.3)] group-hover/vid:scale-110 transition-transform">
                          <Play className="size-4 text-[#0088ff] ml-0.5" fill="#0088ff" strokeWidth={0} />
                        </span>
                      </div>
                      {/* Duration badge */}
                      <span className={`${font} absolute bottom-1.5 right-1.5 bg-black/75 text-white text-[9px] px-1.5 py-0.5 rounded-md tabular-nums inline-flex items-center gap-0.5`} style={{ fontWeight: 600 }}>
                        <Film className="size-2.5" strokeWidth={2.4} />
                        {appeal.evidenceVideo.duration}
                      </span>
                    </a>
                  )}
                  {/* Image tiles */}
                  {appeal.evidenceImages.map((url, i) => (
                    <a key={i} href={url} target="_blank" rel="noopener noreferrer"
                      className="group/ev relative aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-[#0088ff]/40 transition-all">
                      <ImageWithFallback src={url} alt={`evidence ${i + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover/ev:scale-110" />
                      <div className="absolute inset-0 bg-black/0 group-hover/ev:bg-black/30 transition-colors flex items-center justify-center">
                        <ExternalLink className="size-5 text-white opacity-0 group-hover/ev:opacity-100 transition-opacity" strokeWidth={2.4} />
                      </div>
                      <span className={`${font} absolute top-1.5 left-1.5 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded-full tabular-nums`} style={{ fontWeight: 600 }}>
                        {i + 1}/{appeal.evidenceImages.length}
                      </span>
                    </a>
                  ))}
                </div>
              )}

              {/* Description note (always shown if exists) */}
              {appeal.newEvidence && (
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-2xl p-4">
                  <p className={`${font} text-[11px] text-[#0088ff] mb-1.5 inline-flex items-center gap-1`} style={{ fontWeight: 700 }}>
                    <FileText className="size-3" strokeWidth={2.4} />
                    คำอธิบายจากลูกค้า
                  </p>
                  <p className={`${font} text-[14px] text-[#1e3a8a] leading-relaxed whitespace-pre-line`}>{appeal.newEvidence}</p>
                </div>
              )}

              {/* Empty state */}
              {!appeal.evidenceImages.length && !appeal.evidenceVideo && !appeal.newEvidence && (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-gray-400">
                  <div className="size-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="size-6" strokeWidth={2} />
                  </div>
                  <p className={`${font} text-[12px]`}>ลูกค้าไม่ได้แนบหลักฐานใหม่</p>
                </div>
              )}
            </div>
          </FormSection>

          {/* บันทึกของผู้พิจารณา (editable) */}
          <FormSection icon={Mail} iconColor={ADMIN_PRIMARY} title="บันทึกของผู้พิจารณา" desc="ข้อสังเกตและขั้นตอนที่ดำเนินการ">
            <textarea value={reviewerNote} onChange={(e) => setReviewerNote(e.target.value)}
              placeholder="บันทึกการตรวจสอบ ข้อสังเกต หรือขั้นตอนถัดไป..."
              rows={4}
              className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none w-full mb-2 leading-relaxed`}
              style={{ fontWeight: 500 }} />
            <button onClick={handleSaveReviewerNote}
              className={`${font} text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 h-9 rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5`}
              style={{ fontWeight: 600 }}>
              <Save className="size-3" strokeWidth={2.4} />
              บันทึก
            </button>
          </FormSection>
        </div>

        {/* RIGHT 408 */}
        <div className="w-full lg:w-[408px] lg:shrink-0 flex flex-col gap-5 lg:sticky lg:top-5">
          {/* ผลการพิจารณา (decision card) */}
          <FormSection icon={Gavel} iconColor={ADMIN_PRIMARY} title="ผลการพิจารณาอุทธรณ์">
            <div className="flex flex-col gap-2 mb-3">
              {decisionOptions.map(({ id, Icon }) => {
                const isAct = selectedStatus === id;
                const c = appealStatusColors[id];
                return (
                  <button key={id} onClick={() => setSelectedStatus(id)}
                    className={`relative rounded-full flex items-center gap-3 pl-1.5 pr-4 py-1.5 cursor-pointer transition-all ${isAct ? "" : "bg-white hover:bg-gray-50"}`}
                    style={{
                      border: `1px solid ${isAct ? c : "#e8e8e8"}`,
                      backgroundColor: isAct ? `${c}12` : undefined,
                    }}>
                    <span className="size-8 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: isAct ? c : `${c}20` }}>
                      <Icon className="size-4" style={{ color: isAct ? "#fff" : c }} strokeWidth={2.4} />
                    </span>
                    <p className={`${font} text-[13px] flex-1 text-left`}
                      style={{ color: isAct ? c : "#171717", fontWeight: isAct ? 600 : 500 }}>
                      {appealStatusLabels[id]}
                    </p>
                    <span className="size-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors"
                      style={{ borderColor: isAct ? c : "#d4d4d8" }}>
                      {isAct && <span className="size-2 rounded-full" style={{ backgroundColor: c }} />}
                    </span>
                  </button>
                );
              })}
            </div>
            <button onClick={handleSaveStatus}
              disabled={!isStatusDirty}
              className={`h-[45px] rounded-full w-full flex items-center justify-center transition-colors ${isStatusDirty ? "bg-[#319754] hover:bg-[#287745] cursor-pointer" : "bg-gray-200 cursor-not-allowed"}`}>
              <span className={`${font} text-[14px] ${isStatusDirty ? "text-white" : "text-gray-400"}`} style={{ fontWeight: 500 }}>
                บันทึกผล
              </span>
            </button>
          </FormSection>

          {/* ปุ่ม contact */}
          <div className="flex flex-col gap-2">
            <a href={`mailto:${appeal.customerEmail}`}
              className={`${font} w-full inline-flex items-center justify-center gap-2 text-[13px] h-11 rounded-full bg-[#0088ff] hover:bg-[#0066cc] text-white cursor-pointer transition-colors shadow-[0_2px_8px_rgba(0,136,255,0.25)]`}
              style={{ fontWeight: 600 }}>
              <Mail className="size-4" strokeWidth={2.4} />
              ส่งอีเมลหาลูกค้า
            </a>
            <button onClick={() => toast.info(`เปิดเคสต้นฉบับ ${appeal.originalComplaintId}`)}
              className={`${font} w-full inline-flex items-center justify-center gap-2 text-[13px] h-11 rounded-full bg-[#9747ff] hover:bg-[#7c3aed] text-white cursor-pointer transition-colors shadow-[0_2px_8px_rgba(151,71,255,0.25)]`}
              style={{ fontWeight: 600 }}>
              <FileText className="size-4" strokeWidth={2.4} />
              ดูเคสต้นฉบับ
            </button>
          </div>

          {/* ผู้พิจารณา */}
          <FormSection icon={UserCog} iconColor="#0088ff" title="ผู้พิจารณา" desc="ผู้รับผิดชอบเคสนี้">
            <div className="flex items-center gap-3">
              <div className="size-11 rounded-full bg-[#0088ff]/15 flex items-center justify-center shrink-0">
                <UserCog className="size-5 text-[#0088ff]" strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{appeal.reviewedBy || "ยังไม่มอบหมาย"}</p>
                <p className={`${font} text-[11px] text-gray-500`}>หัวหน้าฝ่ายตรวจสอบ</p>
              </div>
            </div>
          </FormSection>

          {/* ข้อมูลร้านค้า */}
          <FormSection icon={Store} iconColor="#9747ff" title="ข้อมูลร้านค้า">
            <div className="flex flex-col gap-2.5">
              <div>
                <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>{appeal.shopName}</p>
                <p className={`${font} text-[11px] text-gray-500`}>เกี่ยวข้องกับเคสต้นฉบับ</p>
              </div>
              <button onClick={() => toast.info(`ดูร้าน ${appeal.shopName}`)}
                className={`${font} text-[11px] text-[#9747ff] bg-[#9747ff]/10 hover:bg-[#9747ff]/20 h-8 rounded-full cursor-pointer transition-colors inline-flex items-center justify-center gap-1.5`}
                style={{ fontWeight: 600 }}>
                <ExternalLink className="size-3" strokeWidth={2.4} />
                ไปยังโปรไฟล์ร้าน
              </button>
            </div>
          </FormSection>

          {/* Timeline */}
          <FormSection icon={Clock} iconColor="#f59e0b" title="ไทม์ไลน์อุทธรณ์">
            <div className="flex flex-col gap-3">
              {([
                { id: "submitted", label: "ยื่นอุทธรณ์",       date: appeal.submittedAt,                                         active: true },
                { id: "reviewing", label: "กำลังพิจารณา",      date: appeal.appealStatus !== "pending" ? appeal.submittedAt : "", active: appeal.appealStatus !== "pending" },
                { id: "ruling",    label: appeal.appealStatus === "upheld" ? "ยืนตามคำอุทธรณ์" : appeal.appealStatus === "denied" ? "ยืนตามคำตัดสินเดิม" : "รอผล", date: appeal.rulingAt, active: !!appeal.rulingAt },
              ]).map((step, i, arr) => {
                const stepColor = step.active ? (step.id === "ruling" ? appealStatusColors[appeal.appealStatus] : "#319754") : "#d4d4d8";
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="size-7 rounded-full flex items-center justify-center" style={{ backgroundColor: step.active ? stepColor : "#f5f5f5" }}>
                        {step.active ? <Check className="size-3.5 text-white" strokeWidth={3} /> : <span className={`${font} text-[10px] text-gray-400`}>{i + 1}</span>}
                      </div>
                      {i < arr.length - 1 && <div className="w-px h-6 mt-1" style={{ backgroundColor: step.active ? stepColor : "#e5e5e5" }} />}
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <p className={`${font} text-[12px]`} style={{ fontWeight: step.active ? 600 : 400, color: step.active ? "#000" : "#a3a3a3" }}>{step.label}</p>
                      {step.date && <p className={`${font} text-[10px] text-gray-400 tabular-nums`}>{fmtDate(step.date)}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </FormSection>

          {/* Internal note */}
          <FormSection icon={Lock} iconColor="#ff9500" title="โน้ตภายใน" desc="admin เห็นเท่านั้น">
            <textarea value={internalNote} onChange={(e) => setInternalNote(e.target.value)}
              placeholder="บันทึกข้อสังเกต / ข้อมูลภายใน..."
              rows={3}
              className={`${font} bg-[#fafafa] rounded-2xl px-4 py-3 text-[13px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none w-full mb-2`}
              style={{ fontWeight: 500 }} />
            <button onClick={() => toast.success("บันทึกโน้ตภายในแล้ว")}
              className={`${font} text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 h-8 rounded-full cursor-pointer transition-colors inline-flex items-center gap-1.5 w-full justify-center`}
              style={{ fontWeight: 600 }}>
              <Save className="size-3" strokeWidth={2.4} />
              บันทึกโน้ต
            </button>
          </FormSection>
        </div>
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
  complaints_stats:    { title: "สถิติการร้องเรียน",          subtitle: "Dashboard ภาพรวมและ insights ของคำร้องเรียนทั้งระบบ" },
  complaints_list:     { title: "รายการการร้องเรียน",         subtitle: "รายละเอียดคำร้องเรียนทุกร้านค้า พร้อมการจัดสรรผู้ดูแลและบันทึกภายใน" },
  complaints_appeals:  { title: "ข้ออุทธรณ์",                  subtitle: "เคสที่ลูกค้าขอโต้แย้งผลการตัดสินของผู้ดูแล (เคสที่ถูกปฏิเสธ)" },
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
  content_index:  { title: "Popup ต้อนรับ", subtitle: "ป๊อปอัปแสดง event / campaign ตอนผู้ใช้เข้าเว็บ" },
  // pages
  page_home:     { title: "หน้าหลัก",                  subtitle: "ปรับโครงสร้างและคอนเทนต์หน้า Landing" },
  page_products: { title: "หน้าผลิตภัณฑ์ทั้งหมด",   subtitle: "การจัดเรียงและแสดงผลสินค้าทั้งหมด" },
  page_blog:     { title: "สาระความรู้ทั้งหมด",      subtitle: "หน้ารวมบทความและสาระน่ารู้" },
  page_about:    { title: "เกี่ยวกับเรา",               subtitle: "เนื้อหาหน้า About Us" },
  content_terms:    { title: "ข้อกำหนดการใช้บริการ",   subtitle: "Terms of Service ที่ลูกค้ายอมรับเมื่อใช้บริการ" },
  content_privacy:  { title: "นโยบายความเป็นส่วนตัว", subtitle: "Privacy Policy การเก็บและใช้ข้อมูลส่วนบุคคล" },
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
  complaints: AlertCircle, complaints_stats: BarChart3, complaints_list: FileText, complaints_appeals: Gavel,
  products_manage: Package, products_categories: Folder, products_promotions: Megaphone,
  products_flash: Zap, products_coupons: Ticket, products_tags: Tag, reviews: Star, orders: ShoppingCart,
  content_banner: ImageIcon, content_blog: FileText, content_video: Video, content_index: Megaphone,
  page_home: Home, page_products: Package, page_blog: FileText, page_about: Info, page_appbar: LayoutPanelTop, page_footer: PanelBottom,
  content_terms: ScrollText, content_privacy: Lock,
  site_info_general: Settings, site_info_contact: Phone, site_info_address: MapPin, site_info_social: Globe,
  settings_shipping: Truck, settings_notifications: Bell,
  users_list: Users, shops_list: Store,
};

/* ========== Products Manage ========== */
type ProductStatus = "normal" | "low" | "out" | "suspended";
const productStatusMeta: Record<ProductStatus, { label: string; color: string; bg: string }> = {
  normal:    { label: "ขายปกติ", color: "#319754", bg: "#3197541a" },
  low:       { label: "ใกล้หมด", color: "#f59e0b", bg: "#f59e0b1a" },
  out:       { label: "หมดสต็อก", color: "#ef4444", bg: "#ef44441a" },
  suspended: { label: "ระงับ",    color: "#737373", bg: "#7373731a" },
};

// Same sample images used in HomePage product grid — keep visuals consistent across the site
const adminProductImages = [
  "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=600&q=80", // herbal tea
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=600&q=80", // coffee drip
  "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=600&q=80", // honey jar
  "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=600&q=80", // turmeric capsule
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=600&q=80", // coconut oil
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=600&q=80", // dried herbs
  "https://images.unsplash.com/photo-1558429773-0d5084b445aa?w=600&q=80",    // jam
  "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=600&q=80", // aloe vera
  "https://images.unsplash.com/photo-1765850257647-811b8d3c20ca?w=600&q=80", // olive oil
  "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=600&q=80", // essential oil
  "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=600&q=80", // amla dried
];

// Compliance: collect quality issues per product so admin can spot listings that fail site standards
function computeProductIssues(p: typeof siteProducts[number]): string[] {
  const issues: string[] = [];
  if (!p.name || p.name.trim().length < 4) issues.push("ชื่อสินค้าสั้นเกินไป");
  if (!p.description || p.description.trim().length < 30) issues.push("คำอธิบายสั้นเกินไป");
  if (!p.sku || p.sku.trim() === "") issues.push("ไม่มี SKU");
  if (!p.category || p.category.trim() === "") issues.push("ไม่มีหมวดหมู่");
  if (p.price < 10) issues.push("ราคาผิดปกติ (ต่ำมาก)");
  if (p.price > 50000) issues.push("ราคาผิดปกติ (สูงมาก)");
  if (p.stock === 0) issues.push("สต็อกหมด — ควรปิดหรือเติม");
  return issues;
}

// Pseudo-deterministic complaint count per product (since complaint items don't carry productId)
function complaintCountFor(productId: string): number {
  // Simple hash from id for stable mock values
  let h = 0;
  for (let i = 0; i < productId.length; i++) h = (h * 31 + productId.charCodeAt(i)) >>> 0;
  const pool = [0, 0, 0, 0, 1, 1, 2, 3]; // most products have 0, some 1-3
  return pool[h % pool.length];
}

const WARNING_REASONS = [
  "รูปภาพไม่ชัดเจน / ไม่ตรงสินค้า",
  "ชื่อสินค้ามีคำผิด / ไม่เหมาะสม",
  "คำอธิบายไม่ครบถ้วน",
  "ราคาน่าสงสัย",
  "สงสัยฉ้อโกง / สินค้าปลอม",
  "อื่นๆ (ระบุเพิ่มเติม)",
];

type AdminProductModalKind = "history" | "warn" | "category" | null;
interface AuditEntry { id: string; action: string; by: string; when: string; reason?: string }

function ProductsManageContent({ onNavigateToComplaints }: { onNavigateToComplaints?: () => void }) {
  const [search, setSearch] = useState("");
  type FilterTab = "all" | "pinned" | "low" | "out" | "issues";
  const [filter, setFilter] = useState<FilterTab>("all");
  const [shopFilter, setShopFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [perPage] = useState(10);
  const [recommended, setRecommended] = useState<Set<string>>(
    () => new Set(siteProducts.filter((p) => p.isRecommended).map((p) => p.id))
  );
  const [suspended, setSuspended] = useState<Set<string>>(new Set());
  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [categoryOverrides, setCategoryOverrides] = useState<Record<string, string>>({});
  const [auditLog, setAuditLog] = useState<Record<string, AuditEntry[]>>({});
  const [modalKind, setModalKind] = useState<AdminProductModalKind>(null);
  const [modalProductId, setModalProductId] = useState<string | null>(null);

  const shopNames = useMemo(() => Array.from(new Set(siteProducts.map((p) => p.shopName))), []);
  const allCategories = useMemo(() => {
    const set = new Set<string>(productCategories);
    siteProducts.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, []);

  const getStatus = (p: typeof siteProducts[number]): ProductStatus => {
    if (suspended.has(p.id)) return "suspended";
    if (p.stock === 0) return "out";
    if (p.stock <= 10) return "low";
    return "normal";
  };
  const productCategory = (p: typeof siteProducts[number]) => categoryOverrides[p.id] ?? p.category;

  // Audit helper — append to log (mock: by = current admin)
  const addAudit = (productId: string, action: string, reason?: string) => {
    setAuditLog((prev) => {
      const entry: AuditEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        action, by: "Admin",
        when: new Date().toISOString(),
        reason,
      };
      return { ...prev, [productId]: [...(prev[productId] || []), entry] };
    });
  };

  // KPI counts
  const total = siteProducts.length;
  const totalRecommended = recommended.size;
  const totalLow = siteProducts.filter((p) => p.stock > 0 && p.stock <= 10).length;
  const totalOut = siteProducts.filter((p) => p.stock === 0).length;
  const totalIssues = siteProducts.filter((p) => computeProductIssues(p).length > 0).length;

  const filterTabs: { id: FilterTab; label: string; count: number; Icon: any }[] = [
    { id: "all",     label: "ทั้งหมด",       count: total, Icon: Package },
    { id: "issues",  label: "ต้องตรวจสอบ",   count: totalIssues, Icon: AlertTriangle },
    { id: "pinned",  label: "ปักหมุด",        count: pinned.size, Icon: Pin },
    { id: "low",     label: "ใกล้หมดสต็อก",  count: totalLow, Icon: AlertTriangle },
    { id: "out",     label: "หมดสต็อก",      count: totalOut, Icon: PackageX },
  ];

  const filtered = siteProducts.filter((p) => {
    if (shopFilter !== "all" && p.shopName !== shopFilter) return false;
    if (filter === "issues" && computeProductIssues(p).length === 0) return false;
    if (filter === "pinned" && !pinned.has(p.id)) return false;
    if (filter === "low"    && !(p.stock > 0 && p.stock <= 10)) return false;
    if (filter === "out"    && p.stock !== 0) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return [p.id, p.name, p.shopName, p.sku, p.category].some((s) => s.toLowerCase().includes(q));
    }
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  // Selection helpers
  const allPagedSelected = paged.length > 0 && paged.every((p) => selectedIds.has(p.id));
  const someSelected = selectedIds.size > 0 && !allPagedSelected;
  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPagedSelected) paged.forEach((p) => next.delete(p.id));
      else paged.forEach((p) => next.add(p.id));
      return next;
    });
  };
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const clearSelection = () => setSelectedIds(new Set());

  // Single-product toggles
  const toggleRecommend = (id: string, name: string) => {
    setRecommended((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.success(`เอา "${name}" ออกจากสินค้าแนะนำแล้ว`); addAudit(id, "ยกเลิกสินค้าแนะนำ"); }
      else { next.add(id); toast.success(`ตั้ง "${name}" เป็นสินค้าแนะนำแล้ว`); addAudit(id, "ตั้งเป็นสินค้าแนะนำ"); }
      return next;
    });
  };
  const toggleSuspend = (id: string, name: string) => {
    setSuspended((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.success(`เปิดการขาย "${name}" อีกครั้งแล้ว`); addAudit(id, "ปลดการระงับ"); }
      else { next.add(id); toast.success(`ระงับการขาย "${name}" แล้ว`, { description: "สินค้านี้จะไม่แสดงในหน้าเว็บไซต์" }); addAudit(id, "ระงับสินค้า"); }
      return next;
    });
  };
  const togglePin = (id: string, name: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast.success(`ปลดปักหมุด "${name}" แล้ว`); addAudit(id, "ปลดปักหมุด"); }
      else { next.add(id); toast.success(`ปักหมุด "${name}" เรียบร้อย`, { description: "จะแสดงในสล็อตหน้าหลัก" }); addAudit(id, "ปักหมุดสินค้า"); }
      return next;
    });
  };

  // Bulk actions (apply to selectedIds)
  const bulkApply = (kind: "recommend" | "unrecommend" | "suspend" | "unsuspend" | "pin" | "unpin" | "delete") => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    if (kind === "recommend")    setRecommended((prev) => new Set([...prev, ...ids]));
    if (kind === "unrecommend")  setRecommended((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
    if (kind === "suspend")      setSuspended((prev) => new Set([...prev, ...ids]));
    if (kind === "unsuspend")    setSuspended((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
    if (kind === "pin")          setPinned((prev) => new Set([...prev, ...ids]));
    if (kind === "unpin")        setPinned((prev) => { const n = new Set(prev); ids.forEach((id) => n.delete(id)); return n; });
    const labelMap = { recommend: "ตั้งเป็นสินค้าแนะนำ", unrecommend: "ยกเลิกสินค้าแนะนำ", suspend: "ระงับ", unsuspend: "ปลดระงับ", pin: "ปักหมุด", unpin: "ปลดปักหมุด", delete: "ลบ" } as const;
    ids.forEach((id) => addAudit(id, `${labelMap[kind]} (bulk)`));
    toast.success(`${labelMap[kind]} ${ids.length} รายการแล้ว`);
    clearSelection();
  };

  // Open a modal for a specific product
  const openModal = (kind: AdminProductModalKind, productId: string) => {
    setModalProductId(productId);
    setModalKind(kind);
  };
  const closeModal = () => { setModalKind(null); setModalProductId(null); };
  const modalProduct = modalProductId ? siteProducts.find((p) => p.id === modalProductId) : null;

  const sendWarning = (productId: string, reason: string) => {
    const p = siteProducts.find((x) => x.id === productId);
    if (!p) return;
    addAudit(productId, "แจ้งเตือนร้านค้า", reason);
    toast.success(`ส่งคำเตือนถึง ${p.shopName} แล้ว`, { description: reason });
  };
  const changeCategory = (productId: string, newCategory: string) => {
    const p = siteProducts.find((x) => x.id === productId);
    if (!p) return;
    const old = productCategory(p);
    setCategoryOverrides((prev) => ({ ...prev, [productId]: newCategory }));
    addAudit(productId, "เปลี่ยนหมวดหมู่", `${old} → ${newCategory}`);
    toast.success(`เปลี่ยนหมวดหมู่ "${p.name}" แล้ว`, { description: `${old} → ${newCategory}` });
  };

  const kpiCards = [
    { label: "สินค้าทั้งหมด",   value: total,            color: "#319754", Icon: Package },
    { label: "สินค้าแนะนำ",    value: totalRecommended, color: "#6366f1", Icon: Sparkles },
    { label: "ต้องตรวจสอบ",   value: totalIssues,      color: "#f59e0b", Icon: AlertTriangle },
    { label: "หมดสต็อก",       value: totalOut,         color: "#ef4444", Icon: PackageX },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>จัดการสินค้า</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>ดูสินค้าทั้งหมดในระบบ ควบคุมมาตรฐาน และจัดทำสินค้าแนะนำของเว็บไซต์</p>
        </div>
        <motion.button
          onClick={() => toast.success(`ส่งออก ${filtered.length} รายการ`)}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer transition-colors`}>
          <span className="size-[26px] bg-[#319754]/10 rounded-full flex items-center justify-center">
            <Upload className="size-[14px] text-[#319754]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>ส่งออกรายการ</span>
        </motion.button>
      </div>

      <div className="flex flex-col gap-5">
        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {kpiCards.map((c) => (
            <div key={c.label}
              className="group bg-white border border-[#e8e8e8] rounded-2xl p-5 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-shadow relative overflow-hidden">
              <c.Icon
                className="absolute -bottom-3 -right-3 size-[110px] pointer-events-none select-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-3"
                style={{
                  color: c.color,
                  opacity: 0.1,
                  maskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                  WebkitMaskImage: "linear-gradient(to bottom, black 45%, rgba(0,0,0,0.35) 80%, transparent 100%)",
                }}
                strokeWidth={1.6}
                aria-hidden
              />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${c.color}1a` }}>
                    <c.Icon className="size-4" style={{ color: c.color }} strokeWidth={2} />
                  </div>
                  <p className={`${font} text-[13px] text-gray-500 truncate`}>{c.label}</p>
                </div>
                <p className={`${font} text-[28px] mt-3 tracking-tight tabular-nums leading-none`} style={{ fontWeight: 700, color: c.color }}>
                  {c.value.toLocaleString()}
                </p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md tabular-nums`}
                    style={{ backgroundColor: `${c.color}15`, color: c.color, fontWeight: 600 }}>
                    {total > 0 ? Math.round((c.value / total) * 100) : 0}% ของทั้งหมด
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bulk action bar (animated, appears when any product selected) */}
        <AnimatePresence>
          {selectedIds.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden">
              <div className="bg-[#319754] rounded-2xl shadow-[0_8px_24px_-8px_rgba(49,151,84,0.45)] flex items-center justify-between gap-3 px-4 py-2.5 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="size-9 rounded-full bg-white/15 flex items-center justify-center">
                    <Check className="size-4 text-white" strokeWidth={2.6} />
                  </div>
                  <div className="flex flex-col">
                    <p className={`${font} text-white text-[14px]`} style={{ fontWeight: 600 }}>เลือก {selectedIds.size} รายการ</p>
                    <p className={`${font} text-white/70 text-[11px]`}>เลือกการดำเนินการเพื่อจัดการพร้อมกัน</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button onClick={() => bulkApply("recommend")} className={`${font} inline-flex items-center gap-1.5 h-[32px] px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
                    <Sparkles className="size-3.5" strokeWidth={2.2} /> ตั้งแนะนำ
                  </button>
                  <button onClick={() => bulkApply("pin")} className={`${font} inline-flex items-center gap-1.5 h-[32px] px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
                    <Pin className="size-3.5" strokeWidth={2.2} /> ปักหมุด
                  </button>
                  <button onClick={() => bulkApply("suspend")} className={`${font} inline-flex items-center gap-1.5 h-[32px] px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
                    <Ban className="size-3.5" strokeWidth={2.2} /> ระงับ
                  </button>
                  <button onClick={() => bulkApply("unsuspend")} className={`${font} inline-flex items-center gap-1.5 h-[32px] px-3 rounded-full bg-white/15 hover:bg-white/25 text-white text-[12px] cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
                    <Check className="size-3.5" strokeWidth={2.2} /> ปลดระงับ
                  </button>
                  <button onClick={() => { if (confirm(`ลบสินค้าที่เลือก ${selectedIds.size} รายการ?`)) bulkApply("delete"); }}
                    className={`${font} inline-flex items-center gap-1.5 h-[32px] px-3 rounded-full bg-white text-[#ff3b30] hover:bg-white/90 text-[12px] cursor-pointer transition-colors`} style={{ fontWeight: 600 }}>
                    <Trash2 className="size-3.5" strokeWidth={2.2} /> ลบ
                  </button>
                  <button onClick={clearSelection}
                    className={`${font} inline-flex items-center justify-center size-[32px] rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer transition-colors`}
                    title="ยกเลิกการเลือก">
                    <X className="size-3.5" strokeWidth={2.2} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter pill */}
        <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
          <FilterTabPills tabs={filterTabs} active={filter} onChange={(id) => { setFilter(id); setPage(1); }} pillId="adminProductsPill" />
          {/* Shop dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className={`${font} inline-flex items-center gap-2 h-[36px] pl-3 pr-2 bg-[#f5f5f5] hover:bg-gray-200 rounded-full text-[13px] cursor-pointer transition-colors shrink-0`}>
                <Filter className="size-[14px] text-[#319754]" />
                <span className="truncate max-w-[140px]">{shopFilter === "all" ? "ทุกร้านค้า" : shopFilter}</span>
                <ChevronDown className="size-[14px] text-gray-500" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 p-1">
              <button onClick={() => { setShopFilter("all"); setPage(1); }}
                className={`${font} text-[13px] w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer ${shopFilter === "all" ? "text-[#319754]" : "text-black"}`}>
                <Store className="size-3.5" />
                <span className="flex-1 text-left">ทุกร้านค้า</span>
                {shopFilter === "all" && <Check className="size-3.5" />}
              </button>
              {shopNames.map((s) => (
                <button key={s} onClick={() => { setShopFilter(s); setPage(1); }}
                  className={`${font} text-[13px] w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer ${shopFilter === s ? "text-[#319754]" : "text-black"}`}>
                  <Store className="size-3.5" />
                  <span className="flex-1 text-left truncate">{s}</span>
                  {shopFilter === s && <Check className="size-3.5 shrink-0" />}
                </button>
              ))}
            </PopoverContent>
          </Popover>
          {/* Search */}
          <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
            <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="ค้นหา ชื่อสินค้า, SKU, ร้านค้า..."
              className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
            <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
              <Search className="size-4 text-white" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "4%" }}  />{/* checkbox */}
              <col style={{ width: "26%" }} />{/* สินค้า */}
              <col style={{ width: "10%" }} />{/* หมวดหมู่ */}
              <col style={{ width: "12%" }} />{/* ประเภท */}
              <col style={{ width: "10%" }} />{/* ราคา */}
              <col style={{ width: "11%" }} />{/* คงเหลือ */}
              <col style={{ width: "11%" }} />{/* สถานะ */}
              <col style={{ width: "8%" }}  />{/* คำร้อง */}
              <col style={{ width: "8%" }}  />{/* จัดการ */}
            </colgroup>
            <thead>
              <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                <th className="text-center pb-3 pr-2" style={{ fontWeight: 500 }}>
                  <input
                    type="checkbox"
                    aria-label="เลือกทั้งหมด"
                    checked={allPagedSelected}
                    ref={(el) => { if (el) el.indeterminate = someSelected && !allPagedSelected; }}
                    onChange={toggleSelectAll}
                    className="size-4 rounded border-gray-300 text-[#319754] focus:ring-[#319754] cursor-pointer accent-[#319754]"
                  />
                </th>
                <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>สินค้า</th>
                <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>หมวดหมู่</th>
                <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ประเภท</th>
                <th className="text-right pb-3 pr-4" style={{ fontWeight: 500 }}>ราคา</th>
                <th className="text-right pb-3 pr-4" style={{ fontWeight: 500 }}>คงเหลือ</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>คำร้อง</th>
                <th className="text-center pb-3"      style={{ fontWeight: 500 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={9} className={`py-12 text-center ${font} text-[13px] text-gray-400`}>ไม่พบสินค้า</td></tr>
              ) : paged.map((p) => {
                const status = getStatus(p);
                const sMeta = productStatusMeta[status];
                const isRec = recommended.has(p.id);
                const isSus = suspended.has(p.id);
                const isPin = pinned.has(p.id);
                const isSel = selectedIds.has(p.id);
                const issues = computeProductIssues(p);
                const cCount = complaintCountFor(p.id);
                const cat = productCategory(p);
                const idx = parseInt(p.id, 10);
                const imgSrc = p.image || adminProductImages[(Number.isFinite(idx) ? idx - 1 : 0) % adminProductImages.length];
                return (
                  <tr key={p.id} className={`group/row border-b border-gray-50 last:border-0 transition-colors ${isSel ? "bg-[#319754]/5" : "hover:bg-gray-50/60"}`}>
                    {/* Checkbox */}
                    <td className="py-3 pr-2 text-center align-middle">
                      <input
                        type="checkbox"
                        aria-label={`เลือก ${p.name}`}
                        checked={isSel}
                        onChange={() => toggleSelect(p.id)}
                        className="size-4 rounded border-gray-300 text-[#319754] focus:ring-[#319754] cursor-pointer accent-[#319754]"
                      />
                    </td>
                    {/* Product */}
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="relative size-[64px] bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover/row:shadow-[0_4px_12px_rgba(0,0,0,0.08)] transition-shadow shrink-0">
                          <ImageWithFallback src={imgSrc} alt={p.name}
                            className={`w-full h-full object-cover transition-transform duration-500 ease-out group-hover/row:scale-110 ${isSus || status === "out" ? "grayscale opacity-60" : ""}`} />
                          {isSus && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 pointer-events-none">
                              <Ban className="size-5 text-white" strokeWidth={2.4} />
                            </div>
                          )}
                          {isPin && !isSus && (
                            <div className="absolute top-1 left-1 size-5 bg-[#f59e0b] rounded-full flex items-center justify-center shadow-[0_1px_3px_rgba(245,158,11,0.4)]">
                              <Pin className="size-3 text-white fill-white" strokeWidth={2.4} />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col min-w-0 gap-0.5">
                          <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-500 min-w-0">
                            <Store className="size-3 shrink-0" />
                            <span className={`${font} truncate`}>{p.shopName}</span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 mt-0.5">
                            {issues.length > 0 && (
                              <span className={`${font} inline-flex items-center gap-1 bg-[#f59e0b] text-white pl-1.5 pr-2 py-0.5 rounded-full text-[10px] cursor-help`}
                                style={{ fontWeight: 500 }}
                                title={issues.join(" · ")}>
                                <AlertTriangle className="size-2.5" strokeWidth={2.4} /> {issues.length} issue
                              </span>
                            )}
                            {p.isFlashSale && (
                              <span className={`${font} inline-flex items-center gap-1 bg-[#e62e05] text-white pl-1.5 pr-2 py-0.5 rounded-full text-[10px]`}
                                style={{ fontWeight: 500 }}>
                                <Zap className="size-2.5 fill-white" strokeWidth={0} /> Flash Sale
                              </span>
                            )}
                            {isRec && (
                              <span className={`${font} inline-flex items-center gap-1 bg-[#319754] text-white pl-1.5 pr-2 py-0.5 rounded-full text-[10px]`}
                                style={{ fontWeight: 500 }}>
                                ★ แนะนำ
                              </span>
                            )}
                            {p.isBestSeller && (
                              <span className={`${font} inline-flex items-center gap-1 bg-[#f7931d] text-white pl-1.5 pr-2 py-0.5 rounded-full text-[10px]`}
                                style={{ fontWeight: 500 }}>
                                <TrendingUp className="size-2.5" strokeWidth={2.4} /> ขายดี
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="py-3 pr-4">
                      <span className={`${font} text-[12px] text-[#555] inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100`}>
                        {cat}
                        {categoryOverrides[p.id] && <span className="ml-1 text-[9px] text-[#0088ff]" title="แก้ไขโดย admin">●</span>}
                      </span>
                    </td>
                    {/* Type (ราคาเดียว / หลายตัวเลือก) — same pill style as OwnerDashboard */}
                    <td className="py-3 pr-4">
                      {(() => {
                        const hasMulti = !!(p.options && p.options.length > 1);
                        const typeColor = hasMulti ? "#007aff" : "#ff9500";
                        const typeLabel = hasMulti ? "หลายตัวเลือก" : "ราคาเดียว";
                        return (
                          <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3 py-0.5 rounded-full text-[12px]`}
                            style={{ backgroundColor: `${typeColor}1a`, color: typeColor }}>
                            {hasMulti ? (
                              <span className="relative inline-block size-[14px] shrink-0">
                                <span className="absolute left-0 top-0 size-[10px] rounded-full" style={{ backgroundColor: typeColor }} />
                                <span className="absolute right-0 bottom-0 size-[10px] rounded-full ring-[1.5px]"
                                  style={{ backgroundColor: typeColor, "--tw-ring-color": `${typeColor}1a` } as React.CSSProperties} />
                              </span>
                            ) : (
                              <span className="size-3 rounded-full inline-block shrink-0" style={{ backgroundColor: typeColor }} />
                            )}
                            <span style={{ fontWeight: 500 }}>{typeLabel}</span>
                          </span>
                        );
                      })()}
                    </td>
                    {/* Price — multi-option shows a range like OwnerDashboard ("฿ 150.00 - 280.00") */}
                    <td className="py-3 pr-4 text-right">
                      {(() => {
                        const hasMultiPrice = !!(p.options && p.options.length > 1);
                        const maxPrice = hasMultiPrice ? Math.round(p.price * (1 + 0.1 * (p.options.length - 1)) * 100) / 100 : p.price;
                        return (
                          <>
                            <p className={`${font} text-[13px] text-[#319754] tabular-nums`} style={{ fontWeight: 500 }}>
                              {hasMultiPrice
                                ? `฿ ${p.price.toFixed(2)} - ${maxPrice.toFixed(2)}`
                                : `฿ ${p.price.toFixed(2)}`}
                            </p>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <p className={`${font} text-[11px] text-gray-400 line-through tabular-nums`}>฿ {p.originalPrice.toFixed(2)}</p>
                            )}
                          </>
                        );
                      })()}
                    </td>
                    {/* Stock — คงเหลือ / รวมทั้งหมด (stock + sold) */}
                    <td className="py-3 pr-4 text-right">
                      {(() => {
                        const soldNum = parseInt((p.sold || "").replace(/[^0-9]/g, ""), 10) || 0;
                        const totalStock = p.stock + soldNum;
                        return (
                          <p className={`${font} text-[13px] tabular-nums`} style={{ fontWeight: 600, color: status === "out" ? "#ef4444" : status === "low" ? "#f59e0b" : "#171717" }}>
                            {p.stock === 0 ? "หมด" : p.stock.toLocaleString()}
                            <span className="text-gray-400" style={{ fontWeight: 400 }}> / {totalStock.toLocaleString()}</span>
                          </p>
                        );
                      })()}
                    </td>
                    {/* Status */}
                    <td className="py-3 pr-4 text-center">
                      <span className={`${font} inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] tabular-nums`}
                        style={{ backgroundColor: sMeta.bg, color: sMeta.color, fontWeight: 600 }}>
                        <span className="size-1.5 rounded-full" style={{ backgroundColor: sMeta.color }} />
                        {sMeta.label}
                      </span>
                    </td>
                    {/* Complaints count — click to navigate to ComplaintList filtered by shop */}
                    <td className="py-3 pr-4 text-center">
                      {cCount > 0 ? (
                        <button
                          onClick={() => { onNavigateToComplaints?.(); toast.info(`เปิดคำร้องเรียนสำหรับ ${p.shopName}`, { description: `${cCount} คำร้องที่เกี่ยวข้อง` }); }}
                          title={`ดู ${cCount} คำร้องที่เกี่ยวข้อง`}
                          className={`${font} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] tabular-nums cursor-pointer hover:scale-105 transition-transform`}
                          style={{ backgroundColor: "#ef44441a", color: "#ef4444", fontWeight: 600 }}>
                          <AlertCircle className="size-2.5" strokeWidth={2.4} />
                          {cCount}
                        </button>
                      ) : (
                        <span className={`${font} text-[12px] text-gray-300 tabular-nums`}>—</span>
                      )}
                    </td>
                    {/* Actions — MoreHorizontal popover, same pattern as OwnerDashboard */}
                    <td className="py-3 text-center align-middle">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="w-[250px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.08)]">
                          <motion.div
                            initial={{ scale: 0.4, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.4, opacity: 0, y: -6 }}
                            transition={{ type: "spring", stiffness: 380, damping: 26 }}
                            style={{ transformOrigin: "top right" }}
                            className="overflow-hidden">
                            {/* สินค้าแนะนำ toggle */}
                            <button
                              onClick={() => toggleRecommend(p.id, p.name)}
                              className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>สินค้าแนะนำ</span>
                              <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${isRec ? "bg-[#319754]" : "bg-gray-300"}`}>
                                <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${isRec ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                              </span>
                            </button>
                            {/* ปักหมุดสินค้า toggle — ON = pinned (amber) */}
                            <button
                              onClick={() => togglePin(p.id, p.name)}
                              className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>ปักหมุดสินค้า</span>
                              <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${isPin ? "bg-[#f59e0b]" : "bg-gray-300"}`}>
                                <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${isPin ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                              </span>
                            </button>
                            {/* ระงับสินค้า toggle — ON = suspended (red) */}
                            <button
                              onClick={() => toggleSuspend(p.id, p.name)}
                              className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>ระงับสินค้า</span>
                              <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${isSus ? "bg-[#ef4444]" : "bg-gray-300"}`}>
                                <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${isSus ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                              </span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            {/* ดูรายละเอียด */}
                            <button
                              onClick={() => toast.info(`เปิดรายละเอียดสินค้า: ${p.name}`)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ดูรายละเอียดสินค้า</span>
                            </button>
                            {/* เปลี่ยนหมวดหมู่ */}
                            <button
                              onClick={() => openModal("category", p.id)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <FolderEdit className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>เปลี่ยนหมวดหมู่</span>
                            </button>
                            {/* แจ้งเตือนร้านค้า */}
                            <button
                              onClick={() => openModal("warn", p.id)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Send className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>แจ้งเตือนร้านค้า</span>
                            </button>
                            {/* ดูประวัติ */}
                            <button
                              onClick={() => openModal("history", p.id)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <History className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ประวัติการเปลี่ยนแปลง</span>
                              {auditLog[p.id]?.length ? (
                                <span className={`${font} ml-auto text-[10px] tabular-nums px-1.5 py-0 rounded-full bg-[#319754]/10 text-[#319754]`}
                                  style={{ fontWeight: 600 }}>{auditLog[p.id].length}</span>
                              ) : null}
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            {/* ลบสินค้า */}
                            <button
                              onClick={() => { if (confirm(`ลบสินค้า "${p.name}" ออกจากระบบ?`)) { addAudit(p.id, "ลบสินค้า"); toast.success(`ลบ: ${p.name}`); } }}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                              <Trash2 className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ลบสินค้า</span>
                            </button>
                          </motion.div>
                        </PopoverContent>
                      </Popover>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {filtered.length > perPage && (
            <div className="flex items-center justify-between pt-5 mt-2 border-t border-gray-100">
              <p className={`${font} text-[12px] text-gray-500 tabular-nums`}>
                แสดง {(safePage - 1) * perPage + 1}-{Math.min(safePage * perPage, filtered.length)} จาก {filtered.length} รายการ
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}
                  className={`size-[32px] rounded-full flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${safePage > 1 ? "hover:bg-gray-100" : ""}`}>
                  <ChevronLeft className="size-4 text-gray-600" />
                </button>
                {Array.from({ length: totalPages }).map((_, i) => {
                  const n = i + 1;
                  const isActive = n === safePage;
                  return (
                    <button key={n} onClick={() => setPage(n)}
                      className={`min-w-[32px] h-[32px] px-2 rounded-full ${font} text-[12px] tabular-nums cursor-pointer transition-colors ${isActive ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                      style={isActive ? { fontWeight: 600 } : {}}>
                      {n}
                    </button>
                  );
                })}
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                  className={`size-[32px] rounded-full flex items-center justify-center cursor-pointer transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${safePage < totalPages ? "hover:bg-gray-100" : ""}`}>
                  <ChevronRight className="size-4 text-gray-600" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* === Modals === */}
      <AnimatePresence>
        {modalKind && modalProduct && (
          <motion.div
            key="admin-product-modal"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-[480px] max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
              {/* Header */}
              <div className="border-b border-gray-100 px-5 py-4 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: modalKind === "warn" ? "#f59e0b1a" : modalKind === "category" ? "#0088ff1a" : "#3197541a" }}>
                    {modalKind === "warn"     && <Send className="size-4 text-[#f59e0b]" strokeWidth={2.2} />}
                    {modalKind === "category" && <FolderEdit className="size-4 text-[#0088ff]" strokeWidth={2.2} />}
                    {modalKind === "history"  && <History className="size-4 text-[#319754]" strokeWidth={2.2} />}
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 600 }}>
                      {modalKind === "warn"     && "แจ้งเตือนร้านค้า"}
                      {modalKind === "category" && "เปลี่ยนหมวดหมู่สินค้า"}
                      {modalKind === "history"  && "ประวัติการเปลี่ยนแปลง"}
                    </p>
                    <p className={`${font} text-[12px] text-gray-500 truncate`}>{modalProduct.name}</p>
                  </div>
                </div>
                <button onClick={closeModal} className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0 transition-colors">
                  <X className="size-4 text-gray-600" strokeWidth={2.2} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5">
                {/* Warn shop body */}
                {modalKind === "warn" && (
                  <div className="flex flex-col gap-3">
                    <p className={`${font} text-[13px] text-gray-600`}>เลือกเหตุผลที่จะส่งให้ <span className="text-black" style={{ fontWeight: 600 }}>{modalProduct.shopName}</span> :</p>
                    <div className="flex flex-col gap-2">
                      {WARNING_REASONS.map((reason) => (
                        <button
                          key={reason}
                          onClick={() => { sendWarning(modalProduct.id, reason); closeModal(); }}
                          className={`${font} group/r w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-[#f59e0b] hover:bg-[#f59e0b]/5 cursor-pointer transition-colors text-left`}>
                          <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{reason}</span>
                          <ArrowRight className="size-3.5 text-gray-400 group-hover/r:text-[#f59e0b] transition-colors" strokeWidth={2.4} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Change category body */}
                {modalKind === "category" && (
                  <div className="flex flex-col gap-3">
                    <p className={`${font} text-[13px] text-gray-600`}>หมวดหมู่ปัจจุบัน: <span className="text-black" style={{ fontWeight: 600 }}>{productCategory(modalProduct)}</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      {allCategories.map((c) => {
                        const isCurrent = productCategory(modalProduct) === c;
                        return (
                          <button key={c}
                            onClick={() => { if (!isCurrent) { changeCategory(modalProduct.id, c); closeModal(); } }}
                            disabled={isCurrent}
                            className={`${font} flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-left transition-colors text-[13px] ${isCurrent ? "border-[#319754] bg-[#319754]/5 text-[#319754] cursor-default" : "border-gray-200 hover:border-[#0088ff] hover:bg-[#0088ff]/5 cursor-pointer text-black"}`}
                            style={{ fontWeight: isCurrent ? 600 : 500 }}>
                            <span className="truncate">{c}</span>
                            {isCurrent && <Check className="size-3.5 shrink-0" strokeWidth={2.4} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* History body */}
                {modalKind === "history" && (
                  <div className="flex flex-col gap-3">
                    {(auditLog[modalProduct.id] || []).length === 0 ? (
                      <div className="py-8 text-center">
                        <History className="size-10 text-gray-300 mx-auto mb-2" />
                        <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีการเปลี่ยนแปลง</p>
                      </div>
                    ) : (
                      <ol className="flex flex-col gap-3">
                        {(auditLog[modalProduct.id] || []).slice().reverse().map((e) => (
                          <li key={e.id} className="flex gap-3">
                            <div className="size-8 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                              <History className="size-3.5 text-[#319754]" strokeWidth={2.2} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{e.action}</p>
                              {e.reason && <p className={`${font} text-[12px] text-gray-500 mt-0.5`}>{e.reason}</p>}
                              <p className={`${font} text-[11px] text-gray-400 mt-0.5 tabular-nums`}>
                                {e.by} · {new Date(e.when).toLocaleString("th-TH", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ========== Products Categories ========== */
// 100-icon library covering common product category needs — grouped for the picker UX
type CategoryIconGroup = "herbs" | "food" | "drinks" | "beauty" | "medical" | "gifts" | "home" | "pets" | "outdoor" | "misc";
const CATEGORY_ICON_GROUPS: { id: CategoryIconGroup; label: string }[] = [
  { id: "herbs",   label: "สมุนไพร / ต้นไม้" },
  { id: "food",    label: "อาหาร" },
  { id: "drinks",  label: "เครื่องดื่ม" },
  { id: "beauty",  label: "ความสวย / สุขภาพ" },
  { id: "medical", label: "ยา / วิทย์" },
  { id: "gifts",   label: "ของขวัญ / กล่อง" },
  { id: "home",    label: "บ้าน" },
  { id: "pets",    label: "สัตว์เลี้ยง" },
  { id: "outdoor", label: "กลางแจ้ง / กีฬา" },
  { id: "misc",    label: "อื่นๆ" },
];

const CATEGORY_PRESET_ICONS: { key: string; Icon: any; group: CategoryIconGroup; keywords: string }[] = [
  // herbs / plants (10)
  { key: "leaf",            Icon: Leaf,           group: "herbs", keywords: "ใบไม้ leaf herbs สมุนไพร" },
  { key: "sprout",          Icon: Sprout,         group: "herbs", keywords: "ต้นกล้า sprout seedling" },
  { key: "tree-pine",       Icon: TreePine,       group: "herbs", keywords: "ต้นสน pine tree" },
  { key: "tree-deciduous",  Icon: TreeDeciduous,  group: "herbs", keywords: "ต้นไม้ tree" },
  { key: "flower",          Icon: Flower,         group: "herbs", keywords: "ดอกไม้ flower" },
  { key: "flower-2",        Icon: Flower2,        group: "herbs", keywords: "ดอกไม้ flower" },
  { key: "trees",           Icon: Trees,          group: "herbs", keywords: "ป่า forest trees" },
  { key: "sun",             Icon: Sun,            group: "herbs", keywords: "ดวงอาทิตย์ sun" },
  { key: "cloud",           Icon: Cloud,          group: "herbs", keywords: "เมฆ cloud" },
  { key: "stars",           Icon: Stars,          group: "herbs", keywords: "ดาว stars" },
  // food (21)
  { key: "apple",           Icon: Apple,          group: "food",  keywords: "แอปเปิ้ล apple" },
  { key: "cherry",          Icon: Cherry,         group: "food",  keywords: "เชอร์รี่ cherry" },
  { key: "grape",           Icon: Grape,          group: "food",  keywords: "องุ่น grape" },
  { key: "citrus",          Icon: Citrus,         group: "food",  keywords: "ส้ม citrus orange" },
  { key: "banana",          Icon: Banana,         group: "food",  keywords: "กล้วย banana" },
  { key: "carrot",          Icon: Carrot,         group: "food",  keywords: "แคร์รอท carrot ผัก" },
  { key: "wheat",           Icon: Wheat,          group: "food",  keywords: "ข้าว wheat ธัญพืช" },
  { key: "egg",             Icon: Egg,            group: "food",  keywords: "ไข่ egg" },
  { key: "egg-fried",       Icon: EggFried,       group: "food",  keywords: "ไข่ดาว egg fried" },
  { key: "cookie",          Icon: Cookie,         group: "food",  keywords: "คุกกี้ cookie ขนม" },
  { key: "cake",            Icon: Cake,           group: "food",  keywords: "เค้ก cake ขนม" },
  { key: "ice-cream",       Icon: IceCream,       group: "food",  keywords: "ไอติม ice cream" },
  { key: "ice-cream-2",     Icon: IceCream2,      group: "food",  keywords: "ไอติม ice cream" },
  { key: "pizza",           Icon: Pizza,          group: "food",  keywords: "พิซซ่า pizza" },
  { key: "sandwich",        Icon: Sandwich,       group: "food",  keywords: "แซนด์วิช sandwich" },
  { key: "salad",           Icon: Salad,          group: "food",  keywords: "สลัด salad" },
  { key: "soup",            Icon: Soup,           group: "food",  keywords: "ซุป soup" },
  { key: "beef",            Icon: Beef,           group: "food",  keywords: "เนื้อ beef เนื้อสัตว์" },
  { key: "drumstick",       Icon: Drumstick,      group: "food",  keywords: "ไก่ chicken drumstick" },
  { key: "fish",            Icon: Fish,           group: "food",  keywords: "ปลา fish" },
  { key: "ham",             Icon: Ham,            group: "food",  keywords: "แฮม ham" },
  { key: "croissant",       Icon: Croissant,      group: "food",  keywords: "ครัวซองต์ croissant ขนมปัง" },
  { key: "utensils-crossed", Icon: UtensilsCrossed, group: "food", keywords: "ช้อนส้อม utensils อาหาร food" },
  // drinks (6)
  { key: "coffee",          Icon: Coffee,         group: "drinks", keywords: "กาแฟ coffee" },
  { key: "wine",            Icon: Wine,           group: "drinks", keywords: "ไวน์ wine" },
  { key: "glass-water",     Icon: GlassWater,     group: "drinks", keywords: "น้ำ water glass" },
  { key: "cup-soda",        Icon: CupSoda,        group: "drinks", keywords: "น้ำอัดลม soda" },
  { key: "milk",            Icon: Milk,           group: "drinks", keywords: "นม milk" },
  { key: "beer",            Icon: Beer,           group: "drinks", keywords: "เบียร์ beer" },
  // beauty / health (10)
  { key: "heart",           Icon: Heart,          group: "beauty", keywords: "หัวใจ heart" },
  { key: "heart-pulse",     Icon: HeartPulse,     group: "beauty", keywords: "หัวใจ heartbeat pulse" },
  { key: "sparkles",        Icon: Sparkles,       group: "beauty", keywords: "ประกาย sparkles" },
  { key: "gem",             Icon: Gem,            group: "beauty", keywords: "เพชร gem" },
  { key: "smile",           Icon: Smile,          group: "beauty", keywords: "ยิ้ม smile" },
  { key: "scissors",        Icon: Scissors,       group: "beauty", keywords: "กรรไกร scissors" },
  { key: "brush",           Icon: Brush,          group: "beauty", keywords: "แปรง brush" },
  { key: "paintbrush",      Icon: Paintbrush,     group: "beauty", keywords: "พู่กัน paint" },
  { key: "wand-2",          Icon: Wand2,          group: "beauty", keywords: "ไม้กายสิทธิ์ wand magic" },
  { key: "snowflake",       Icon: Snowflake,      group: "beauty", keywords: "เกล็ดหิมะ snow" },
  // medical (12)
  { key: "pill",            Icon: Pill,           group: "medical", keywords: "ยา pill" },
  { key: "stethoscope",     Icon: Stethoscope,    group: "medical", keywords: "หูฟัง stethoscope" },
  { key: "syringe",         Icon: Syringe,        group: "medical", keywords: "เข็มฉีดยา syringe" },
  { key: "bandage",         Icon: Bandage,        group: "medical", keywords: "ผ้าพันแผล bandage" },
  { key: "activity",        Icon: Activity,       group: "medical", keywords: "กราฟ activity" },
  { key: "microscope",      Icon: Microscope,     group: "medical", keywords: "กล้องจุลทรรศน์ microscope" },
  { key: "cross",           Icon: Cross,          group: "medical", keywords: "กากบาด cross medical" },
  { key: "flask",           Icon: FlaskConical,   group: "medical", keywords: "ขวดทดลอง flask" },
  { key: "test-tube",       Icon: TestTube,       group: "medical", keywords: "หลอดทดลอง test tube" },
  { key: "test-tubes",      Icon: TestTubes,      group: "medical", keywords: "หลอดทดลอง test tubes" },
  { key: "beaker",          Icon: Beaker,         group: "medical", keywords: "บีกเกอร์ beaker" },
  { key: "droplet",         Icon: Droplet,        group: "medical", keywords: "หยดน้ำ drop oil" },
  // gifts / boxes (10)
  { key: "droplets",        Icon: Droplets,       group: "medical", keywords: "หยดน้ำ drops" },
  { key: "gift",            Icon: Gift,           group: "gifts",   keywords: "ของขวัญ gift" },
  { key: "package",         Icon: Package,        group: "gifts",   keywords: "กล่อง package" },
  { key: "package-2",       Icon: Package2,       group: "gifts",   keywords: "กล่อง package" },
  { key: "box",             Icon: Box,            group: "gifts",   keywords: "กล่อง box" },
  { key: "boxes",           Icon: Boxes,          group: "gifts",   keywords: "กล่อง boxes" },
  { key: "shopping-bag",    Icon: ShoppingBag,    group: "gifts",   keywords: "ถุง shopping bag" },
  { key: "shopping-basket", Icon: ShoppingBasket, group: "gifts",   keywords: "ตะกร้า basket" },
  { key: "backpack",        Icon: Backpack,       group: "gifts",   keywords: "เป้ backpack" },
  { key: "tag",             Icon: Tag,            group: "gifts",   keywords: "ป้าย tag" },
  { key: "ticket",          Icon: Ticket,         group: "gifts",   keywords: "ตั๋ว ticket" },
  // home (6)
  { key: "home",            Icon: Home,           group: "home",    keywords: "บ้าน home" },
  { key: "lamp",            Icon: Lamp,           group: "home",    keywords: "โคมไฟ lamp" },
  { key: "bath",            Icon: Bath,           group: "home",    keywords: "อ่างอาบน้ำ bath" },
  { key: "shower-head",     Icon: ShowerHead,     group: "home",    keywords: "ฝักบัว shower" },
  { key: "bed",             Icon: Bed,            group: "home",    keywords: "เตียง bed" },
  { key: "sofa",            Icon: Sofa,           group: "home",    keywords: "โซฟา sofa" },
  { key: "armchair",        Icon: Armchair,       group: "home",    keywords: "เก้าอี้ armchair" },
  // pets (7)
  { key: "dog",             Icon: Dog,            group: "pets",    keywords: "หมา dog" },
  { key: "cat",             Icon: Cat,            group: "pets",    keywords: "แมว cat" },
  { key: "bird",            Icon: Bird,           group: "pets",    keywords: "นก bird" },
  { key: "paw-print",       Icon: PawPrint,       group: "pets",    keywords: "เท้า paw" },
  { key: "rabbit",          Icon: Rabbit,         group: "pets",    keywords: "กระต่าย rabbit" },
  { key: "squirrel",        Icon: Squirrel,       group: "pets",    keywords: "กระรอก squirrel" },
  { key: "bone",            Icon: Bone,           group: "pets",    keywords: "กระดูก bone" },
  // outdoor (6)
  { key: "bike",            Icon: Bike,           group: "outdoor", keywords: "จักรยาน bike" },
  { key: "tent",            Icon: Tent,           group: "outdoor", keywords: "เต้นท์ tent camping" },
  { key: "footprints",      Icon: Footprints,     group: "outdoor", keywords: "รอยเท้า footprints" },
  { key: "mountain",        Icon: Mountain,       group: "outdoor", keywords: "ภูเขา mountain" },
  { key: "sunrise",         Icon: Sunrise,        group: "outdoor", keywords: "พระอาทิตย์ขึ้น sunrise" },
  { key: "sunset",          Icon: Sunset,         group: "outdoor", keywords: "พระอาทิตย์ตก sunset" },
  // misc (13)
  { key: "award",           Icon: Award,          group: "misc",    keywords: "รางวัล award" },
  { key: "trophy",          Icon: Trophy,         group: "misc",    keywords: "ถ้วยรางวัล trophy" },
  { key: "medal",           Icon: Medal,          group: "misc",    keywords: "เหรียญ medal" },
  { key: "crown",           Icon: Crown,          group: "misc",    keywords: "มงกุฎ crown" },
  { key: "flame",           Icon: Flame,          group: "misc",    keywords: "ไฟ flame fire" },
  { key: "zap",             Icon: Zap,            group: "misc",    keywords: "สายฟ้า zap energy" },
  { key: "bell",            Icon: Bell,           group: "misc",    keywords: "ระฆัง bell" },
  { key: "bookmark",        Icon: Bookmark,       group: "misc",    keywords: "ที่คั่น bookmark" },
  { key: "pin",             Icon: Pin,            group: "misc",    keywords: "หมุด pin" },
  { key: "shirt",           Icon: Shirt,          group: "misc",    keywords: "เสื้อ shirt" },
  { key: "book-open",       Icon: BookOpen,       group: "misc",    keywords: "หนังสือ book" },
  { key: "book",            Icon: Book,           group: "misc",    keywords: "หนังสือ book" },
  { key: "music",           Icon: Music,          group: "misc",    keywords: "ดนตรี music" },
  { key: "gamepad",         Icon: Gamepad2,       group: "misc",    keywords: "เกม gamepad" },
];

const CATEGORY_PRESET_COLORS = ["#319754", "#0088ff", "#f59e0b", "#ef4444", "#9747ff", "#f7931d", "#6366f1", "#14b8a6"];
const getCategoryIcon = (key: string) => CATEGORY_PRESET_ICONS.find((i) => i.key === key)?.Icon || Package;

interface CategoryRow {
  id: string;
  name: string;
  description: string;
  iconKey: string;
  iconImage?: string; // optional uploaded image (data URL) — takes priority over iconKey
  color: string;
  active: boolean;
}

// Reusable category icon — shows uploaded image if present, otherwise lucide icon
function CategoryIcon({ cat, size = 20, strokeWidth = 2.2 }: { cat: CategoryRow; size?: number; strokeWidth?: number }) {
  if (cat.iconImage) {
    return <img src={cat.iconImage} alt="" className="object-cover" style={{ width: size, height: size, borderRadius: 6 }} />;
  }
  const Icon = getCategoryIcon(cat.iconKey);
  return <Icon style={{ width: size, height: size, color: cat.color }} strokeWidth={strokeWidth} />;
}

// Seed to match the public HomePage Categories section exactly (icon + color)
// See HomePage.tsx line 432-441 for the canonical mapping.
const HOMEPAGE_CATEGORY_SEED: Record<string, { iconKey: string; description: string }> = {
  "สมุนไพร":   { iconKey: "leaf",             description: "สมุนไพรไทยและสากล" },
  "อาหาร":     { iconKey: "utensils-crossed", description: "อาหารและของกินจากธรรมชาติ" },
  "ยา":        { iconKey: "pill",             description: "ยาสมุนไพรและผลิตภัณฑ์ดูแลสุขภาพ" },
  "เครื่องหอม": { iconKey: "sparkles",        description: "เครื่องหอมและอโรม่า" },
  "ความสวย":   { iconKey: "flower-2",         description: "ผลิตภัณฑ์ดูแลผิวและความงาม" },
  "ชุดของขวัญ": { iconKey: "gift",            description: "ของขวัญและชุดมอบให้คนสำคัญ" },
  "ชาสมุนไพร":  { iconKey: "coffee",          description: "ชาสมุนไพรเพื่อสุขภาพ" },
  "อาหารเสริม": { iconKey: "flask",           description: "วิตามินและอาหารเสริม" },
  "น้ำมันสกัด": { iconKey: "droplets",        description: "น้ำมันสกัดธรรมชาติ" },
};

function seedCategories(): CategoryRow[] {
  const names = new Set<string>(productCategories);
  siteProducts.forEach((p) => names.add(p.category));
  return Array.from(names).map((name, i) => {
    const preset = HOMEPAGE_CATEGORY_SEED[name];
    return {
      id: name,
      name,
      description: preset?.description || `รวมสินค้าหมวด${name}ทั้งหมดในระบบ`,
      // Brand green for homepage-matched categories; rotated palette for extras (เครื่องดื่ม, ฯลฯ)
      iconKey: preset?.iconKey ?? CATEGORY_PRESET_ICONS[i % CATEGORY_PRESET_ICONS.length].key,
      color:   preset ? "#319754" : CATEGORY_PRESET_COLORS[i % CATEGORY_PRESET_COLORS.length],
      active: true,
    };
  });
}

function ProductsCategoriesContent() {
  const [categories, setCategories] = useState<CategoryRow[]>(() => seedCategories());
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<CategoryRow | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  type CategoryFilterTab = "all" | "active" | "hidden";
  const [filterTab, setFilterTab] = useState<CategoryFilterTab>("all");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  // Reorder enabled only when not filtering — otherwise drag positions are ambiguous
  const reorderEnabled = filterTab === "all" && !search.trim();

  const reorder = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;
    setCategories((prev) => {
      const srcIdx = prev.findIndex((c) => c.id === sourceId);
      const tgtIdx = prev.findIndex((c) => c.id === targetId);
      if (srcIdx < 0 || tgtIdx < 0) return prev;
      const next = prev.slice();
      const [moved] = next.splice(srcIdx, 1);
      next.splice(tgtIdx, 0, moved);
      toast.success(`ย้ายตำแหน่ง "${moved.name}" แล้ว`);
      return next;
    });
  };

  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    siteProducts.forEach((p) => { m[p.category] = (m[p.category] || 0) + 1; });
    return m;
  }, []);

  const productCount = (cat: CategoryRow) => counts[cat.id] || 0;
  const active = categories.filter((c) => c.active).length;

  const hiddenCount = categories.length - active;
  const categoryFilterTabs: { id: CategoryFilterTab; label: string; count: number; Icon: any }[] = [
    { id: "all",    label: "ทั้งหมด",        count: categories.length, Icon: Folder },
    { id: "active", label: "แสดงบนเว็บไซต์", count: active,            Icon: Eye },
    { id: "hidden", label: "ซ่อนการใช้งาน",   count: hiddenCount,       Icon: EyeOff },
  ];

  const filtered = categories.filter((c) => {
    if (filterTab === "active" && !c.active) return false;
    if (filterTab === "hidden" &&  c.active) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [c.name, c.description, c.id].some((s) => s.toLowerCase().includes(q));
  });

  const toggleActive = (id: string) => {
    setCategories((prev) => prev.map((c) => c.id === id ? (() => {
      const next = { ...c, active: !c.active };
      toast.success(`${next.active ? "เปิดแสดง" : "ซ่อน"}หมวด "${c.name}" แล้ว`);
      return next;
    })() : c));
  };

  const deleteCategory = (id: string) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const used = productCount(cat);
    if (used > 0) {
      toast.error(`ลบไม่ได้ — ยังมีสินค้า ${used} ชิ้นในหมวดนี้`, { description: "ย้ายสินค้าไปหมวดอื่นก่อน" });
      return;
    }
    if (!confirm(`ลบหมวด "${cat.name}"?`)) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
    toast.success(`ลบหมวด "${cat.name}" แล้ว`);
  };

  const move = (id: string, dir: "up" | "down") => {
    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx < 0) return prev;
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (target < 0 || target >= prev.length) return prev;
      const next = prev.slice();
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (cat: CategoryRow) => { setEditing(cat); setShowForm(true); };
  const saveForm = (form: CategoryRow) => {
    setCategories((prev) => {
      const exists = prev.find((c) => c.id === form.id);
      if (exists) {
        toast.success(`บันทึกหมวด "${form.name}" แล้ว`);
        return prev.map((c) => c.id === form.id ? form : c);
      }
      if (prev.some((c) => c.name === form.name)) {
        toast.error("ชื่อหมวดหมู่ซ้ำในระบบ");
        return prev;
      }
      toast.success(`เพิ่มหมวด "${form.name}" แล้ว`);
      return [...prev, form];
    });
    setShowForm(false);
    setEditing(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>จัดการหมวดหมู่สินค้า</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดหมวดสินค้าและกำหนดสีไอคอนที่ใช้บนเว็บไซต์</p>
        </div>
        <motion.button
          onClick={openAdd}
          whileTap={{ scale: 0.96 }} whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}>
          <span className="size-[26px] bg-white/15 rounded-full flex items-center justify-center">
            <Plus className="size-[14px] text-white" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่มหมวดหมู่</span>
        </motion.button>
      </div>

      <div className="flex flex-col gap-5">
        {/* Live Preview — how categories render on the public website */}
        <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
          <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <Eye className="size-4 text-[#319754]" strokeWidth={2.2} />
              <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ตัวอย่างหมวดหมู่ที่กำลังแสดงอยู่หน้าเว็บ</p>
              <span className={`${font} text-[11px] text-gray-400`}>(แสดงเฉพาะหมวดที่เปิด)</span>
            </div>
            <span className={`${font} inline-flex items-center gap-1.5 text-[11px] bg-[#319754]/10 text-[#319754] px-2.5 py-1 rounded-full`} style={{ fontWeight: 600 }}>
              <span className="size-1.5 rounded-full bg-[#319754] animate-pulse" />
              Live
            </span>
          </div>

          {/* Browser-like frame */}
          <div className="rounded-xl border border-gray-200 overflow-hidden bg-[#fafafa]">
            <div className="flex items-center gap-2 bg-white border-b border-gray-100 px-3 py-2">
              <div className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-[#ff5f57]" />
                <span className="size-2.5 rounded-full bg-[#febc2e]" />
                <span className="size-2.5 rounded-full bg-[#28c840]" />
              </div>
              <div className={`${font} flex-1 mx-3 bg-[#f5f5f5] rounded-md px-3 py-1 text-[11px] text-gray-500 truncate`}>
                metaherb.co.th / หมวดหมู่สินค้า
              </div>
            </div>

            {/* Content area — replicates HomePage Categories section, paginated 9 per page */}
            <div className="px-6 py-4 sm:py-6">
              {active === 0 ? (
                <div className="py-10 text-center">
                  <EyeOff className="size-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
                  <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีหมวดที่เปิดแสดงในเว็บไซต์</p>
                </div>
              ) : (() => {
                const activeCats = categories.filter((c) => c.active);
                const pageCount = Math.max(1, Math.ceil(activeCats.length / 9));
                const safePage = Math.min(previewPage, pageCount - 1);
                const pageCats = activeCats.slice(safePage * 9, safePage * 9 + 9);
                return (
                  <div className="relative">
                    <motion.div
                      key={safePage}
                      initial={{ opacity: 0, x: 8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-center justify-center gap-3 sm:gap-4 py-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden w-full">
                      {pageCats.map((cat) => (
                        <button key={cat.id}
                          className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[64px] sm:min-w-[80px] cursor-default group/cat shrink-0">
                          <div className="size-[40px] sm:size-[56px] rounded-full flex items-center justify-center transition-all duration-300 group-hover/cat:scale-110 overflow-hidden"
                            style={{ backgroundColor: `${cat.color}1a` }}>
                            <CategoryIcon cat={cat} size={20} strokeWidth={1.8} />
                          </div>
                          <span className={`${font} text-[11px] sm:text-[12px] text-gray-600 whitespace-nowrap transition-colors duration-300`}>
                            {cat.name}
                          </span>
                        </button>
                      ))}
                    </motion.div>
                    {/* Prev arrow — same style as HomePage recommended/flash sale sections */}
                    {safePage > 0 && (
                      <button onClick={() => setPreviewPage((p) => p - 1)}
                        className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                        <ChevronLeft className="size-5" strokeWidth={2.4} />
                      </button>
                    )}
                    {/* Next arrow */}
                    {safePage < pageCount - 1 && (
                      <button onClick={() => setPreviewPage((p) => p + 1)}
                        className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                        <ChevronRight className="size-5" strokeWidth={2.4} />
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
          <p className={`${font} text-[11px] text-gray-400 flex items-center gap-1.5`}>
            <Info className="size-3 text-gray-400" strokeWidth={2.4} />
            ตัวอย่างหน้าตาที่ลูกค้าจะเห็นบนหน้าเว็บไซต์จริง · อัปเดตทันทีเมื่อแก้ไขหมวดหมู่
          </p>
        </div>

        {/* Filter pill — same pattern as จัดการสินค้า */}
        <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
          <FilterTabPills tabs={categoryFilterTabs} active={filterTab} onChange={setFilterTab} pillId="adminCategoriesPill" />
          {/* Search */}
          <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px]">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหา ชื่อหมวด, คำอธิบาย..."
              className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
            <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
              <Search className="size-4 text-white" />
            </button>
          </div>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.length === 0 ? (
            <div className="col-span-full py-16 text-center">
              <Folder className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
              <p className={`${font} text-[14px] text-gray-400`}>ไม่พบหมวดหมู่</p>
            </div>
          ) : filtered.map((cat, idx) => {
            const pc = productCount(cat);
            const isDragging = dragId === cat.id;
            const isDropTarget = dragOverId === cat.id && dragId !== null && dragId !== cat.id;
            return (
              <motion.div key={cat.id}
                layout
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                draggable={reorderEnabled}
                onDragStart={(e: any) => {
                  if (!reorderEnabled) return;
                  setDragId(cat.id);
                  e.dataTransfer.effectAllowed = "move";
                  // Firefox needs setData to start drag
                  try { e.dataTransfer.setData("text/plain", cat.id); } catch {}
                }}
                onDragOver={(e: any) => {
                  if (!reorderEnabled || !dragId) return;
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                  if (dragOverId !== cat.id) setDragOverId(cat.id);
                }}
                onDragLeave={() => { if (dragOverId === cat.id) setDragOverId(null); }}
                onDrop={(e: any) => {
                  if (!reorderEnabled || !dragId) return;
                  e.preventDefault();
                  reorder(dragId, cat.id);
                  setDragId(null);
                  setDragOverId(null);
                }}
                onDragEnd={() => { setDragId(null); setDragOverId(null); }}
                className={`group bg-white border rounded-2xl p-4 hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all relative overflow-hidden ${!cat.active ? "opacity-60" : ""} ${isDragging ? "opacity-40 scale-95" : ""} ${isDropTarget ? "border-[#319754] ring-2 ring-[#319754]/30 -translate-y-1" : "border-[#e8e8e8]"}`}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {reorderEnabled && (
                      <div title="ลากเพื่อจัดเรียงตำแหน่ง"
                        className="size-5 -ml-1 shrink-0 flex items-center justify-center text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing transition-colors">
                        <GripVertical className="size-4" strokeWidth={2.2} />
                      </div>
                    )}
                    <div className="size-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: `${cat.color}1a` }}>
                      <CategoryIcon cat={cat} size={26} />
                    </div>
                    <div className="min-w-0">
                      <p className={`${font} text-[15px] text-black truncate`} style={{ fontWeight: 600 }}>{cat.name}</p>
                      <p className={`${font} text-[11px] text-gray-400 truncate`}>{cat.description}</p>
                    </div>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer shrink-0 data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={6}
                      className="w-[210px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                      <button onClick={() => toggleActive(cat.id)}
                        className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer text-left`}>
                        <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>แสดงในเว็บไซต์</span>
                        <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${cat.active ? "bg-[#319754]" : "bg-gray-300"}`}>
                          <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${cat.active ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                        </span>
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                      <button onClick={() => openEdit(cat)}
                        className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer text-left text-[13px] text-black`}>
                        <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                        <span style={{ fontWeight: 500 }}>แก้ไข</span>
                      </button>
                      <button onClick={() => move(cat.id, "up")} disabled={idx === 0}
                        className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer text-left text-[13px] text-black disabled:opacity-30 disabled:cursor-not-allowed`}>
                        <ChevronLeft className="size-3.5 text-gray-500 rotate-90" strokeWidth={2.2} />
                        <span style={{ fontWeight: 500 }}>เลื่อนขึ้น</span>
                      </button>
                      <button onClick={() => move(cat.id, "down")} disabled={idx === filtered.length - 1}
                        className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer text-left text-[13px] text-black disabled:opacity-30 disabled:cursor-not-allowed`}>
                        <ChevronRight className="size-3.5 text-gray-500 rotate-90" strokeWidth={2.2} />
                        <span style={{ fontWeight: 500 }}>เลื่อนลง</span>
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                      <button onClick={() => deleteCategory(cat.id)}
                        className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer text-left text-[13px] text-[#ff3b30]`}>
                        <Trash2 className="size-3.5" strokeWidth={2.2} />
                        <span style={{ fontWeight: 500 }}>ลบหมวดหมู่</span>
                      </button>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex flex-col">
                    <p className={`${font} text-[20px] tabular-nums leading-none`} style={{ fontWeight: 700, color: cat.color }}>
                      {pc.toLocaleString()}
                    </p>
                    <p className={`${font} text-[10px] text-gray-400 mt-1`}>สินค้าในหมวด</p>
                  </div>
                  <span className={`${font} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]`}
                    style={{ backgroundColor: cat.active ? "#3197541a" : "#9ca3af1a", color: cat.active ? "#319754" : "#737373", fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: cat.active ? "#319754" : "#737373" }} />
                    {cat.active ? "แสดง" : "ซ่อน"}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Add/Edit form modal */}
      <AnimatePresence>
        {showForm && (
          <CategoryFormModal
            initial={editing}
            existingIds={categories.map((c) => c.id)}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSave={saveForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function IconPickerSection({
  iconKey, iconImage, color, fileInputRef, onSelectIcon, onUploadClick, onClearImage,
}: {
  iconKey: string;
  iconImage?: string;
  color: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onSelectIcon: (key: string) => void;
  onUploadClick: () => void;
  onClearImage: () => void;
}) {
  const [iconSearch, setIconSearch] = useState("");
  const [iconGroup, setIconGroup] = useState<"all" | CategoryIconGroup>("all");

  const filteredIcons = CATEGORY_PRESET_ICONS.filter((i) => {
    if (iconGroup !== "all" && i.group !== iconGroup) return false;
    if (iconSearch.trim()) {
      const q = iconSearch.trim().toLowerCase();
      return i.key.toLowerCase().includes(q) || i.keywords.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label className={`${font} text-[12px] text-gray-600`} style={{ fontWeight: 500 }}>
          ไอคอน <span className="text-gray-400 tabular-nums">({CATEGORY_PRESET_ICONS.length} แบบ)</span>
        </label>
        {iconImage && (
          <button onClick={onClearImage}
            className={`${font} text-[11px] text-[#ef4444] hover:underline cursor-pointer`}>
            ลบภาพที่อัปโหลด
          </button>
        )}
      </div>

      {/* Search + Upload row */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-3 pr-1 h-[34px] flex-1 min-w-0">
          <Search className="size-3.5 text-gray-400 shrink-0 mr-2" strokeWidth={2.2} />
          <input value={iconSearch} onChange={(e) => setIconSearch(e.target.value)}
            placeholder="ค้นหาไอคอน เช่น ดอกไม้, กาแฟ, leaf..."
            className={`${font} flex-1 text-[12px] outline-none bg-transparent min-w-0`} />
          {iconSearch && (
            <button onClick={() => setIconSearch("")} className="size-5 rounded-full hover:bg-gray-200 flex items-center justify-center shrink-0">
              <X className="size-3 text-gray-500" strokeWidth={2.4} />
            </button>
          )}
        </div>
        <button onClick={onUploadClick}
          title="อัปโหลดภาพไอคอนเอง (PNG, JPG, SVG ≤ 2MB)"
          className={`${font} h-[34px] inline-flex items-center gap-1.5 px-3 rounded-full text-[12px] cursor-pointer transition-colors shrink-0 ${iconImage ? "bg-[#319754] text-white hover:bg-[#287745]" : "bg-[#319754]/10 text-[#319754] hover:bg-[#319754]/20"}`}
          style={{ fontWeight: 600 }}>
          <Upload className="size-3.5" strokeWidth={2.4} />
          {iconImage ? "เปลี่ยนภาพ" : "อัปโหลด"}
        </button>
      </div>

      {/* Group filter chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden -mx-1 px-1 pb-1">
        {[{ id: "all" as const, label: "ทั้งหมด" }, ...CATEGORY_ICON_GROUPS].map((g) => {
          const isAct = iconGroup === g.id;
          const count = g.id === "all" ? CATEGORY_PRESET_ICONS.length : CATEGORY_PRESET_ICONS.filter((i) => i.group === g.id).length;
          return (
            <button key={g.id} onClick={() => setIconGroup(g.id as any)}
              className={`${font} shrink-0 inline-flex items-center gap-1.5 h-[28px] px-3 rounded-full text-[11px] cursor-pointer transition-colors ${isAct ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              style={{ fontWeight: 500 }}>
              {g.label}
              <span className="tabular-nums opacity-80">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Uploaded image preview (separate row) */}
      {iconImage && (
        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#319754]/5 border border-[#319754]/20">
          <div className="size-10 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: `${color}1a` }}>
            <img src={iconImage} alt="" className="size-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 600 }}>ใช้ภาพที่อัปโหลด</p>
            <p className={`${font} text-[10px] text-gray-500`}>กดไอคอน preset ด้านล่างเพื่อกลับไปใช้ default</p>
          </div>
        </div>
      )}

      {/* Icon grid — scrollable */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-2 max-h-[220px] overflow-y-auto">
        {filteredIcons.length === 0 ? (
          <div className="py-8 text-center">
            <p className={`${font} text-[12px] text-gray-400`}>ไม่พบไอคอนที่ค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-9 gap-1.5">
            {filteredIcons.map((i) => {
              const isSel = !iconImage && iconKey === i.key;
              return (
                <button key={i.key} onClick={() => onSelectIcon(i.key)}
                  title={i.keywords}
                  className={`size-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${isSel ? "ring-2 ring-[#319754] ring-offset-2 ring-offset-gray-50" : "hover:scale-110 bg-white hover:bg-white"}`}
                  style={{ backgroundColor: isSel ? `${color}1a` : "#ffffff" }}>
                  <i.Icon className="size-4" style={{ color: isSel ? color : "#525252" }} strokeWidth={2.2} />
                </button>
              );
            })}
          </div>
        )}
      </div>
      <p className={`${font} text-[10px] text-gray-400 tabular-nums`}>
        แสดง {filteredIcons.length} / {CATEGORY_PRESET_ICONS.length} ไอคอน · รองรับการอัปโหลด PNG / JPG / SVG ≤ 2MB
      </p>
    </div>
  );
}

function CategoryFormModal({ initial, existingIds, onCancel, onSave }: {
  initial: CategoryRow | null;
  existingIds: string[];
  onCancel: () => void;
  onSave: (cat: CategoryRow) => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [iconKey, setIconKey] = useState(initial?.iconKey || CATEGORY_PRESET_ICONS[0].key);
  const [iconImage, setIconImage] = useState<string | undefined>(initial?.iconImage);
  const [color, setColor] = useState(initial?.color || CATEGORY_PRESET_COLORS[0]);
  const [active, setActive] = useState(initial?.active ?? true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isEdit = !!initial;
  const trimmed = name.trim();
  const isDuplicate = !isEdit && existingIds.includes(trimmed);
  const canSave = trimmed.length >= 2 && !isDuplicate;
  const previewCat: CategoryRow = { id: trimmed || "preview", name: trimmed, description, iconKey, iconImage, color, active };

  const handleFile = (file: File | null | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast.error("รองรับเฉพาะไฟล์ภาพ"); return; }
    if (file.size > 2 * 1024 * 1024) { toast.error("ไฟล์ใหญ่เกินไป (สูงสุด 2MB)"); return; }
    const reader = new FileReader();
    reader.onload = (e) => { setIconImage((e.target?.result as string) || undefined); };
    reader.readAsDataURL(file);
  };

  const submit = () => {
    if (!canSave) return;
    onSave({
      id: isEdit ? (initial as CategoryRow).id : trimmed,
      name: trimmed,
      description: description.trim() || `รวมสินค้าหมวด${trimmed}ทั้งหมดในระบบ`,
      iconKey, iconImage, color, active,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onCancel}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 12 }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-[480px] h-[720px] max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-9 rounded-xl flex items-center justify-center shrink-0 overflow-hidden" style={{ backgroundColor: `${color}1a` }}>
              <CategoryIcon cat={previewCat} size={18} />
            </div>
            <div className="min-w-0">
              <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 600 }}>{isEdit ? "แก้ไขหมวดหมู่" : "เพิ่มหมวดหมู่ใหม่"}</p>
              <p className={`${font} text-[12px] text-gray-500 truncate`}>{trimmed || "ยังไม่ได้ตั้งชื่อ"}</p>
            </div>
          </div>
          <button onClick={onCancel} className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0 transition-colors">
            <X className="size-4 text-gray-600" strokeWidth={2.2} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-600`} style={{ fontWeight: 500 }}>ชื่อหมวดหมู่ *</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder="เช่น สมุนไพร"
              className={`${font} h-[40px] px-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#319754] text-[13px] bg-white`} />
            {isDuplicate && <p className={`${font} text-[11px] text-[#ef4444]`}>มีหมวดชื่อนี้แล้ว</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-600`} style={{ fontWeight: 500 }}>คำอธิบาย</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="คำอธิบายสั้นๆ"
              rows={2}
              className={`${font} px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#319754] text-[13px] bg-white resize-none`} />
          </div>

          {/* Icon picker — 100 preset icons grouped + search + custom upload */}
          <IconPickerSection
            iconKey={iconKey}
            iconImage={iconImage}
            color={color}
            fileInputRef={fileInputRef}
            onSelectIcon={(k) => { setIconKey(k); setIconImage(undefined); }}
            onUploadClick={() => fileInputRef.current?.click()}
            onClearImage={() => setIconImage(undefined)}
          />
          <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])} />

          {/* Color picker */}
          <div className="flex flex-col gap-1.5">
            <label className={`${font} text-[12px] text-gray-600`} style={{ fontWeight: 500 }}>สี</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORY_PRESET_COLORS.map((c) => {
                const isSel = color === c;
                return (
                  <button key={c} onClick={() => setColor(c)}
                    className={`size-9 rounded-full cursor-pointer transition-transform ${isSel ? "scale-110 ring-2 ring-offset-2" : "hover:scale-110"}`}
                    style={{ backgroundColor: c, ['--tw-ring-color' as any]: c }}>
                    {isSel && <Check className="size-4 text-white mx-auto" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
            <div className="min-w-0">
              <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>แสดงในเว็บไซต์</p>
              <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เปิดเพื่อให้หมวดนี้ปรากฏในหน้าผลิตภัณฑ์</p>
            </div>
            <button onClick={() => setActive((v) => !v)}
              className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors cursor-pointer shrink-0 ${active ? "bg-[#319754]" : "bg-gray-300"}`}>
              <span className={`absolute size-5 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${active ? "translate-x-[22px]" : "translate-x-[2px]"}`} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 py-3 flex items-center justify-end gap-2 shrink-0">
          <button onClick={onCancel}
            className={`${font} h-[38px] px-4 rounded-full text-[13px] text-gray-700 hover:bg-gray-100 cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            ยกเลิก
          </button>
          <button onClick={submit} disabled={!canSave}
            className={`${font} h-[38px] px-4 rounded-full text-[13px] text-white cursor-pointer transition-colors ${canSave ? "bg-[#319754] hover:bg-[#287745]" : "bg-gray-300 cursor-not-allowed"}`}
            style={{ fontWeight: 600 }}>
            {isEdit ? "บันทึก" : "เพิ่ม"}
          </button>
        </div>
      </motion.div>
    </motion.div>
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

/* ========== MAIN ========== */
export function AdminDashboard() {
  const location = useLocation();
  const section = pathToSection(location.pathname);
  const [activeItem, setActiveItem] = useState<ItemId>(defaultItem[section]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mainRef = React.useRef<HTMLElement>(null);

  // Reset active item when section changes
  React.useEffect(() => {
    setActiveItem(defaultItem[section]);
  }, [section]);

  // Reset scroll to top when route or sidebar item changes — the Layout's window.scrollTo
  // doesn't reach this <main> because the staff shell uses h-screen overflow-hidden,
  // so <main> is the real scroll container (not window).
  React.useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "auto" });
  }, [activeItem, location.pathname]);

  const meta = itemLabels[activeItem] ?? { title: activeItem, subtitle: "" };

  const renderContent = () => {
    if (activeItem === "dashboard") return <DashboardContent />;
    if (activeItem === "report_sales" || activeItem === "report_customers" || activeItem === "report_products" || activeItem === "report_marketing") {
      return <ReportContent tab={activeItem as any} />;
    }
    if (activeItem === "content_banner") return <BannerContent />;
    if (activeItem === "content_blog")   return <BlogContent />;
    if (activeItem === "content_video")  return <VideoContent />;
    if (activeItem === "content_index")  return <PopupContent />;
    if (activeItem === "content_terms")   return <LegalContent docId="terms" />;
    if (activeItem === "content_privacy") return <LegalContent docId="privacy" />;
    if (activeItem === "complaints_stats")   return <ComplaintStatsContent />;
    if (activeItem === "complaints_list")    return <ComplaintListContent />;
    if (activeItem === "complaints_appeals") return <ComplaintAppealsContent />;
    if (activeItem === "products_manage")    return <ProductsManageContent onNavigateToComplaints={() => setActiveItem("complaints_list")} />;
    if (activeItem === "products_categories") return <ProductsCategoriesContent />;
    if (activeItem === "page_home")     return <PageHomeBuilder />;
    if (activeItem === "page_products") return <PageProductsBuilder />;
    if (activeItem === "page_blog")     return <PageBlogBuilder />;
    if (activeItem === "page_about")    return <PageAboutBuilder />;
    const Icon = itemIconMap[activeItem] || FileText;
    return <PlaceholderContent icon={Icon} title={meta.title} desc={meta.subtitle} />;
  };

  // Header right action button — เปลี่ยนตาม activeItem (ปุ่ม "+ เพิ่ม Banner" อยู่ใน BannerContent เอง)
  const headerAction = null;

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

      <main ref={mainRef} className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0 min-h-0">
        {/* BannerContent + BlogContent + VideoContent + PopupContent + LegalContent + ComplaintListContent render their own headers — skip default */}
        {activeItem !== "content_banner" && activeItem !== "content_blog" && activeItem !== "content_video" && activeItem !== "content_index" && activeItem !== "content_terms" && activeItem !== "content_privacy" && activeItem !== "complaints_list" && activeItem !== "complaints_appeals" && activeItem !== "products_manage" && activeItem !== "products_categories" && activeItem !== "page_home" && activeItem !== "page_products" && activeItem !== "page_blog" && activeItem !== "page_about" && (
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{meta.title}</h2>
              <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>{meta.subtitle}</p>
            </div>
            {headerAction}
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}
