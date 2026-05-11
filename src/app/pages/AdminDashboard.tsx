import React, { useState } from "react";
import {
  BarChart3, Users, ShoppingCart, Package, Settings, Image as ImageIcon, TrendingUp,
  Shield, DollarSign, Megaphone, UserCog, BarChart2, ShoppingBag,
  Plus, Pencil, Trash2, MoreHorizontal, Eye, Search, ChevronLeft, ChevronDown,
  Check, X, Mail, Phone, FileText, Store, AlertCircle,
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// Admin theme — สีน้ำเงิน (แทนสีเขียวของฝั่ง shop owner)
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

const mockAdmins = [
  { id: 1, name: "admin01", email: "admin@test.com",   role: "Super Admin",     status: "active"   },
  { id: 2, name: "admin02", email: "admin02@test.com", role: "Content Manager", status: "active"   },
  { id: 3, name: "admin03", email: "admin03@test.com", role: "Order Manager",   status: "inactive" },
];

const mockBanners = [
  { id: 1, title: "Nature's Remedies", position: "Hero Banner",  status: "active" },
  { id: 2, title: "ลดสูงสุด 70%",       position: "Right Top",    status: "active" },
  { id: 3, title: "สินค้ามาใหม่",        position: "Right Bottom", status: "draft"  },
];

/* ========== TAB TYPES ========== */
type AdminTab =
  | "overview"
  | "report_sales" | "report_customers" | "report_products" | "report_marketing"
  | "banners" | "admins" | "settings";

interface AdminItem {
  id: AdminTab | "reports";
  label: string;
  icon: any;
  children?: { id: AdminTab; label: string }[];
}

const adminItems: AdminItem[] = [
  { id: "overview", label: "ภาพรวม", icon: BarChart3 },
  { id: "reports", label: "รายงาน", icon: FileText, children: [
    { id: "report_sales",     label: "รายงานยอดขาย"  },
    { id: "report_customers", label: "ข้อมูลลูกค้า"   },
    { id: "report_products",  label: "ข้อมูลสินค้า"   },
    { id: "report_marketing", label: "ข้อมูลการตลาด" },
  ]},
  { id: "banners",  label: "จัดการ Banner", icon: ImageIcon },
  { id: "admins",   label: "จัดการแอดมิน",  icon: UserCog },
  { id: "settings", label: "ตั้งค่าระบบ",    icon: Settings },
];

const childIconMap: Record<string, any> = {
  report_sales: TrendingUp, report_customers: Users, report_products: ShoppingBag, report_marketing: BarChart2,
};

const tabLabels: Record<AdminTab, string> = {
  overview:         "ภาพรวมระบบ",
  report_sales:     "รายงานยอดขาย",
  report_customers: "รายงานข้อมูลลูกค้า",
  report_products:  "รายงานข้อมูลสินค้า",
  report_marketing: "รายงานข้อมูลการตลาด",
  banners:          "จัดการ Banner",
  admins:           "จัดการแอดมิน",
  settings:         "ตั้งค่าระบบ",
};

const tabSubtitles: Record<AdminTab, string> = {
  overview:         "ภาพรวมยอดขาย ลูกค้า และร้านค้าในระบบ",
  report_sales:     "วิเคราะห์ยอดขายและคำสั่งซื้อรายเดือน",
  report_customers: "ข้อมูลและพฤติกรรมของลูกค้าในระบบ",
  report_products:  "สินค้าขายดี สต็อก และหมวดหมู่",
  report_marketing: "ประสิทธิภาพแคมเปญและโปรโมชัน",
  banners:          "จัดการ Banner ที่แสดงบนหน้าเว็บไซต์",
  admins:           "กำหนดสิทธิ์และบทบาทผู้ดูแลระบบ",
  settings:         "ตั้งค่าทั่วไปของเว็บไซต์",
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

function AdminSidebar({ active, onSelect, collapsed, onToggle }: {
  active: AdminTab; onSelect: (id: AdminTab) => void; collapsed: boolean; onToggle: () => void;
}) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ reports: true });
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
                <p className={`${font} text-[16px] text-[#0a0a0a]`} style={{ fontWeight: 500 }}>แผงควบคุม</p>
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
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } } }}
            className={`flex-1 pb-4 space-y-2.5 overflow-y-auto ${collapsed ? "px-2" : "px-4"}`}>
            {adminItems.map((item) =>
              !item.children ? (
                <motion.div key={item.id}
                  variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25 }}>
                  {withTooltip(item.label,
                    <MenuBtn isActive={active === item.id} icon={item.icon} label={item.label} onClick={() => onSelect(item.id as AdminTab)} collapsed={collapsed} />
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
                                <MenuBtn isActive={active === child.id} icon={childIconMap[child.id] || Package} label={child.label} onClick={() => onSelect(child.id)} collapsed={collapsed} />
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

/* ========== OVERVIEW TAB ========== */
function OverviewTab() {
  const stats = [
    { label: "รายได้รวม",        value: "฿316,000", change: "+18%", color: "#319754", Icon: DollarSign,    hint: "เทียบเดือนที่แล้ว" },
    { label: "คำสั่งซื้อทั้งหมด", value: "885",      change: "+24",  color: "#3b82f6", Icon: ShoppingCart,  hint: "เดือนนี้" },
    { label: "ลูกค้าทั้งหมด",     value: "1,245",    change: "+56",  color: "#9747ff", Icon: Users,         hint: "ลูกค้าใหม่ + กลับมาซื้อ" },
    { label: "ร้านค้าทั้งหมด",    value: "32",       change: "+3",   color: "#ff9500", Icon: Store,         hint: "ร้านค้าที่ active" },
  ];

  // รายการรอดำเนินการ — ที่แอดมินต้อง action
  const pendingActions = [
    { label: "ร้านค้ารอตรวจสอบ", count: 4, color: "#ff9500", Icon: Store },
    { label: "ร้องเรียนใหม่",      count: 7, color: "#ff3b30", Icon: AlertCircle },
    { label: "Banner รอเผยแพร่",   count: 2, color: "#9747ff", Icon: ImageIcon },
    { label: "รีพอร์ตจากผู้ใช้",   count: 3, color: "#f59e0b", Icon: Shield },
  ];

  // Activity feed — กิจกรรมล่าสุดในระบบ
  const activities = [
    { type: "shop",    actor: "ร้าน บ้านสมุนไพร",        action: "สมัครเข้าระบบ — รอตรวจสอบ",                  time: "5 นาทีที่แล้ว",  color: "#319754", Icon: Store         },
    { type: "user",    actor: "user_24856",                action: "ลงทะเบียนเป็นลูกค้าใหม่",                       time: "12 นาทีที่แล้ว", color: "#3b82f6", Icon: Users         },
    { type: "complaint", actor: "DSP-20260509-014",         action: "ร้องเรียนใหม่จาก Metaherb Store",              time: "28 นาทีที่แล้ว", color: "#ff3b30", Icon: AlertCircle    },
    { type: "shop",    actor: "ร้าน อโรม่าฟาร์ม",        action: "ส่งเอกสารเพิ่มเติม",                            time: "1 ชม. ที่แล้ว",  color: "#319754", Icon: Store         },
    { type: "banner",  actor: "Hero Banner — Summer",      action: "ร่างใหม่รอเผยแพร่",                              time: "2 ชม. ที่แล้ว",  color: "#9747ff", Icon: ImageIcon      },
    { type: "user",    actor: "user_24820",                action: "รายงานสินค้าผิดกฎ — Power Boost+",            time: "3 ชม. ที่แล้ว",  color: "#ff9500", Icon: Shield        },
  ];

  // Top shops — ร้านค้าผลงานดีเดือนนี้
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

      {/* Row: Sales chart (2/3) + Pending actions (1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Sales by month */}
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

        {/* Pending actions */}
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

      {/* Row: Categories pie + Activity feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Categories pie */}
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
          {/* Legend */}
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

        {/* Activity feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-3">
          <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
              <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>กิจกรรมล่าสุด</p>
            </div>
            <button className={`${font} text-[12px] hover:underline cursor-pointer`}
              style={{ color: ADMIN_PRIMARY, fontWeight: 500 }}>ดูทั้งหมด</button>
          </div>
          <div className="flex flex-col">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3 py-2.5 border-b border-gray-50 last:border-b-0">
                <div className="size-9 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${a.color}1a` }}>
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

      {/* Top shops leaderboard */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
            <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ร้านค้ายอดเยี่ยมเดือนนี้</p>
          </div>
          <button className={`${font} text-[12px] hover:underline cursor-pointer`}
            style={{ color: ADMIN_PRIMARY, fontWeight: 500 }}>ดูทั้งหมด</button>
        </div>
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "15%" }} />
          </colgroup>
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>อันดับ</th>
              <th className="text-left   pb-3 pr-4" style={{ fontWeight: 500 }}>ร้านค้า</th>
              <th className="text-right  pb-3 pr-4" style={{ fontWeight: 500 }}>คำสั่งซื้อ</th>
              <th className="text-right  pb-3 pr-4" style={{ fontWeight: 500 }}>รายได้</th>
              <th className="text-right  pb-3"      style={{ fontWeight: 500 }}>เติบโต</th>
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
                      style={{ backgroundColor: s.color, fontWeight: 700 }}>
                      {s.name.charAt(0)}
                    </div>
                    <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{s.name}</span>
                  </div>
                </td>
                <td className={`${font} py-3 pr-4 text-right text-[13px] text-black tabular-nums`} style={{ fontWeight: 500 }}>{s.orders.toLocaleString()}</td>
                <td className={`${font} py-3 pr-4 text-right text-[13px] tabular-nums`} style={{ color: "#319754", fontWeight: 600 }}>฿{s.revenue.toLocaleString()}</td>
                <td className="py-3 text-right">
                  <span className={`${font} inline-flex items-center gap-1 text-[12px] tabular-nums`}
                    style={{ color: "#319754", fontWeight: 600 }}>
                    <TrendingUp className="size-3" strokeWidth={2.4} />
                    {s.growth}
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

/* ========== REPORT TAB (generic) ========== */
function ReportTab({ tab }: { tab: Exclude<AdminTab, "overview" | "banners" | "admins" | "settings"> }) {
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
      {/* KPI cards */}
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

      {/* Chart */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
          <TrendingUp className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>{tabLabels[tab]} 6 เดือนล่าสุด</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          {tab === "report_sales" ? (
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#999" }} />
              <YAxis tick={{ fontSize: 12, fill: "#999" }} />
              <Tooltip />
              <Legend />
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

/* ========== BANNERS TAB ========== */
function BannersTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");

  const tabs = [
    { id: "all" as const,    label: "ทั้งหมด", count: mockBanners.length },
    { id: "active" as const, label: "เปิดใช้งาน", count: mockBanners.filter((b) => b.status === "active").length },
    { id: "draft" as const,  label: "ร่าง", count: mockBanners.filter((b) => b.status === "draft").length },
  ];

  const filtered = mockBanners.filter((b) => {
    if (statusFilter !== "all" && b.status !== statusFilter) return false;
    if (searchQuery && !b.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      {/* Filter pill — เหมือน ProductsTab */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-2 mb-4 flex items-center gap-2">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
          {tabs.map((tab) => {
            const isAct = statusFilter === tab.id;
            return (
              <motion.button key={tab.id} onClick={() => setStatusFilter(tab.id)}
                whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-2 h-[36px] px-4 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                {isAct && (
                  <motion.span layoutId="adminBannerPill"
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: ADMIN_PRIMARY, boxShadow: "0 2px 8px rgba(49,151,84,0.25)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <span className={`${font} relative text-[13px] whitespace-nowrap`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{tab.label}</span>
                <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{tab.count}</span>
              </motion.button>
            );
          })}
        </div>
        {/* Search */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] w-[260px] shrink-0">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหา Banner..."
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
          <button className="size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0"
            style={{ backgroundColor: ADMIN_PRIMARY }}>
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "30%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "10%" }} />
          </colgroup>
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ชื่อ Banner</th>
              <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ตำแหน่ง</th>
              <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
              <th className="text-center pb-3"      style={{ fontWeight: 500 }}>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className={`py-12 text-center ${font} text-[13px] text-gray-400`}>ไม่พบ Banner</td></tr>
            ) : filtered.map((b) => {
              const sColor = b.status === "active" ? "#319754" : "#737373";
              const sLabel = b.status === "active" ? "เปิดใช้งาน" : "ร่าง";
              return (
                <tr key={b.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${ADMIN_PRIMARY}1a` }}>
                        <ImageIcon className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
                      </div>
                      <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{b.title}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`${font} text-[13px] text-gray-700`}>{b.position}</span>
                  </td>
                  <td className="py-3 pr-4 text-center">
                    <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                      style={{ backgroundColor: `${sColor}1a`, color: sColor }}>
                      <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                      {sLabel}
                    </span>
                  </td>
                  <td className="py-3 text-center align-middle">
                    <Popover>
                      <PopoverTrigger asChild>
                        <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto"
                          style={{ color: undefined }}>
                          <MoreHorizontal className="size-4" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="end" sideOffset={6}
                        className="w-[180px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                        <button onClick={() => toast.info(`ดู: ${b.title}`)}
                          className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                          <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                          <span style={{ fontWeight: 500 }}>ดูรายละเอียด</span>
                        </button>
                        <button onClick={() => toast.info(`แก้ไข: ${b.title}`)}
                          className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                          <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                          <span style={{ fontWeight: 500 }}>แก้ไข</span>
                        </button>
                        <div className="h-px bg-gray-100 my-1" />
                        <button onClick={() => { if (confirm(`ลบ "${b.title}"?`)) toast.success(`ลบ: ${b.title}`); }}
                          className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                          <Trash2 className="size-3.5" strokeWidth={2.2} />
                          <span style={{ fontWeight: 500 }}>ลบ</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ========== ADMINS TAB ========== */
function AdminsTab() {
  return (
    <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5">
      <table className="w-full table-fixed">
        <colgroup>
          <col style={{ width: "20%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "20%" }} />
          <col style={{ width: "10%" }} />
        </colgroup>
        <thead>
          <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
            <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>ชื่อ</th>
            <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>อีเมล</th>
            <th className="text-left  pb-3 pr-4" style={{ fontWeight: 500 }}>หน้าที่</th>
            <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
            <th className="text-center pb-3"      style={{ fontWeight: 500 }}>จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {mockAdmins.map((a) => {
            const sColor = a.status === "active" ? "#319754" : "#ff3b30";
            const sLabel = a.status === "active" ? "เปิดใช้งาน" : "ปิดใช้งาน";
            return (
              <tr key={a.id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-full flex items-center justify-center text-white"
                      style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 600 }}>
                      {a.name.slice(-2).toUpperCase()}
                    </div>
                    <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{a.name}</span>
                  </div>
                </td>
                <td className={`${font} py-3 pr-4 text-[13px] text-gray-700`}>{a.email}</td>
                <td className="py-3 pr-4">
                  <span className={`${font} inline-flex items-center px-2.5 py-1 rounded-full text-[12px]`}
                    style={{ backgroundColor: `${ADMIN_PRIMARY}1a`, color: ADMIN_PRIMARY, fontWeight: 500 }}>
                    {a.role}
                  </span>
                </td>
                <td className="py-3 pr-4 text-center">
                  <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                    style={{ backgroundColor: `${sColor}1a`, color: sColor }}>
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: sColor }} />
                    {sLabel}
                  </span>
                </td>
                <td className="py-3 text-center align-middle">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="end" sideOffset={6}
                      className="w-[180px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18)]">
                      <button onClick={() => toast.info(`แก้ไข: ${a.name}`)}
                        className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                        <Pencil className="size-3.5 text-gray-500" strokeWidth={2.2} />
                        <span style={{ fontWeight: 500 }}>แก้ไข</span>
                      </button>
                      <div className="h-px bg-gray-100 my-1" />
                      <button onClick={() => { if (confirm(`ลบ "${a.name}"?`)) toast.success(`ลบ: ${a.name}`); }}
                        className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#ff3b30]/5 cursor-pointer transition-colors text-left text-[13px] text-[#ff3b30]`}>
                        <Trash2 className="size-3.5" strokeWidth={2.2} />
                        <span style={{ fontWeight: 500 }}>ลบ</span>
                      </button>
                    </PopoverContent>
                  </Popover>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ========== SETTINGS TAB ========== */
function SettingsTab() {
  const [siteName, setSiteName] = useState("MetaHerb - สมุนไพรออร์แกนิค");
  const [siteDesc, setSiteDesc] = useState("ร้านขายสมุนไพรออร์แกนิคคุณภาพ ส่งตรงจากธรรมชาติ");
  const [contactEmail, setContactEmail] = useState("Metaherb@gmail.com");
  const [contactPhone, setContactPhone] = useState("061-421-3111");
  const [allowRegister, setAllowRegister] = useState(true);
  const [maintenance, setMaintenance] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
      {/* General info */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
          <Settings className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลทั่วไป</p>
        </div>
        <Field icon={Store} label="ชื่อเว็บไซต์" value={siteName} onChange={setSiteName} placeholder="ชื่อเว็บไซต์" />
        <div className="flex flex-col gap-1.5">
          <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
            <FileText className="size-3 text-gray-400" strokeWidth={2.4} />
            คำอธิบายเว็บไซต์ (SEO)
          </label>
          <textarea value={siteDesc} onChange={(e) => setSiteDesc(e.target.value)}
            placeholder="คำอธิบายสำหรับ search engine"
            rows={3}
            className={`${font} bg-[#fafafa] rounded-2xl px-5 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all resize-none placeholder:text-[#a3a3a3]`}
            style={{ fontWeight: 500 }} />
        </div>
        <Field icon={Mail}  label="อีเมลติดต่อ"     value={contactEmail} onChange={setContactEmail} type="email" />
        <Field icon={Phone} label="เบอร์โทรศัพท์"   value={contactPhone} onChange={setContactPhone} />
      </div>

      {/* System toggles */}
      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-5 flex flex-col gap-4">
        <div className="pb-3 border-b border-[#e8e8e8] flex items-center gap-2">
          <Shield className="size-4" style={{ color: ADMIN_PRIMARY }} strokeWidth={2.2} />
          <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ระบบ & สิทธิ์</p>
        </div>

        <ToggleRow
          icon={Store} color="#319754"
          title="เปิดให้ลงทะเบียนร้านค้าใหม่"
          desc="ผู้ใช้ทั่วไปสมัครเป็นเจ้าของร้านได้"
          enabled={allowRegister}
          onToggle={() => setAllowRegister(!allowRegister)}
        />
        <ToggleRow
          icon={AlertCircle} color="#ff9500"
          title="โหมดบำรุงรักษา"
          desc="ปิดเว็บไซต์ชั่วคราว — แสดงเฉพาะหน้า maintenance"
          enabled={maintenance}
          onToggle={() => setMaintenance(!maintenance)}
        />

        {maintenance && (
          <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="bg-[#ff9500]/10 border border-[#ff9500]/30 rounded-xl px-4 py-3 flex items-start gap-2.5">
            <AlertCircle className="size-4 text-[#ff9500] shrink-0 mt-0.5" strokeWidth={2.2} />
            <p className={`${font} text-[12px] text-[#9a3412] leading-relaxed`}>
              เมื่อเปิดโหมดบำรุงรักษา ผู้ใช้ทั้งหมดจะถูก redirect ไปยังหน้า maintenance — เฉพาะแอดมินเท่านั้นที่เข้าใช้งานระบบได้
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, value, onChange, placeholder, type = "text" }: {
  icon?: any; label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className={`${font} text-[12px] text-gray-500 flex items-center gap-1.5`}>
        {Icon && <Icon className="size-3 text-gray-400" strokeWidth={2.4} />}
        {label}
      </label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`${font} bg-[#fafafa] h-12 w-full rounded-full px-5 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 focus:bg-white transition-all placeholder:text-[#a3a3a3]`}
        style={{ fontWeight: 500 }} />
    </div>
  );
}

function ToggleRow({ icon: Icon, color, title, desc, enabled, onToggle }: {
  icon: any; color: string; title: string; desc: string; enabled: boolean; onToggle: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="size-10 rounded-2xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: `${color}1a` }}>
        <Icon className="size-5" style={{ color }} strokeWidth={2.2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{title}</p>
        <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{desc}</p>
      </div>
      <ToggleSwitch enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      className={`w-[44px] h-6 rounded-full cursor-pointer transition-colors relative shrink-0 p-0.5 flex items-center ${enabled ? "" : "bg-[rgba(60,60,67,0.3)]"}`}
      style={enabled ? { backgroundColor: ADMIN_PRIMARY } : {}}>
      <div className={`size-5 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

/* ========== MAIN ========== */
export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Header right action — เปลี่ยนตาม tab
  const headerAction = (() => {
    if (activeTab === "banners") {
      return (
        <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
          onClick={() => toast.success("เปิดหน้าเพิ่ม Banner")}
          className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
          style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
          <Plus className="size-4" strokeWidth={2.4} />
          เพิ่ม Banner
        </motion.button>
      );
    }
    if (activeTab === "admins") {
      return (
        <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
          onClick={() => toast.success("เปิดหน้าเพิ่มแอดมิน")}
          className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
          style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
          <Plus className="size-4" strokeWidth={2.4} />
          เพิ่มแอดมิน
        </motion.button>
      );
    }
    if (activeTab === "settings") {
      return (
        <motion.button whileTap={{ scale: 0.96 }} whileHover={{ scale: 1.03 }}
          onClick={() => toast.success("บันทึกการตั้งค่าเรียบร้อย")}
          className={`${font} inline-flex items-center gap-2 text-[13px] text-white px-5 h-[36px] rounded-full cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
          style={{ backgroundColor: ADMIN_PRIMARY, fontWeight: 500 }}>
          <Check className="size-4" strokeWidth={2.4} />
          บันทึก
        </motion.button>
      );
    }
    return null;
  })();

  return (
    <div className="flex h-full overflow-hidden relative">
      <div className="h-full md:overflow-y-auto shrink-0">
        <AdminSidebar
          active={activeTab}
          onSelect={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Content — only this area scrolls */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0 min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>{tabLabels[activeTab]}</h2>
            <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>{tabSubtitles[activeTab]}</p>
          </div>
          {headerAction}
        </div>

        {/* Tab content */}
        {activeTab === "overview"  && <OverviewTab />}
        {activeTab === "report_sales"     && <ReportTab tab="report_sales" />}
        {activeTab === "report_customers" && <ReportTab tab="report_customers" />}
        {activeTab === "report_products"  && <ReportTab tab="report_products" />}
        {activeTab === "report_marketing" && <ReportTab tab="report_marketing" />}
        {activeTab === "banners"   && <BannersTab />}
        {activeTab === "admins"    && <AdminsTab />}
        {activeTab === "settings"  && <SettingsTab />}
      </main>
    </div>
  );
}
