import React, { useState, Fragment, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { useOrders } from "../store/OrderContext";
import { useNavigate } from "react-router";
import {
  BarChart3, Package, ShoppingCart, Zap, Megaphone, Ticket,
  Settings, ChevronDown, ChevronLeft, Store, Search,
  Plus, MoreHorizontal, Eye, AlertCircle, X, Check, Clock, ArrowRight, RotateCcw, Wallet,
  AlertTriangle, Phone, Mail, ChevronRight, Filter,
  FileText, TrendingUp, Users, ShoppingBag, BarChart2, Download, FileSpreadsheet,
  ClipboardList, ScanSearch, Truck, PackageCheck, PackageX, EyeOff
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, ComposedChart } from "recharts";
import { Calendar as CalendarIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../components/ui/hover-card";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { DateRange } from "react-day-picker";
import imgLogo from "../../assets/logo.png";
import imgSideBar from "figma:asset/9c30b1921f0988e49ef49ac4f89b2dd06b320b33.png";
import imgProd from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgFlash from "figma:asset/8effbd2f0b89604dcbe9aeb239cc524667996e66.png";
import imgEvidence0 from "figma:asset/d0cb417cf99aba1cdf79d5426f5fd585177d3d46.png";
import imgEvidence1 from "figma:asset/7506073c04064524065ab7d328509bd53de6d2ae.png";
import imgRefundProduct from "figma:asset/e9fa4baa6fae7a43e086cd2f7372c763ac79e774.png";
import bankLogoKBANK from "figma:asset/fc3734dca1dc1106a8a9ae04448d90848680e3b4.png";
import bankLogoSCB from "figma:asset/480398b2a511e7f907960af090b46919e996b2fb.png";
import bankLogoKTB from "figma:asset/3bc35e854570ff8d031628a1b961ff515af8c04c.png";
import bankLogoTTB from "figma:asset/85a8262de08aace150c02d0d1b8e2a2442158aa8.png";
import bankLogoBBL from "figma:asset/7644739c159ec3c06623b12e5cc595deb95f9ce4.png";
import svgOrderTabs from "../../imports/svg-ht9fbjz0sq";
import svgBankTabs from "../../imports/svg-q7abbwkyjt";
import svgChevron from "../../imports/svg-a36cmd0hr3";
import svgPaths from "../../imports/svg-fmfhn0ojdl";
import svgComplaint from "../../imports/svg-ysz5k1ajog";
import svgDetail from "../../imports/svg-4nbwddesrb";

const orderTabSvgs = {
  clipboard1: svgOrderTabs.p16f83e00,
  clipboard2: svgOrderTabs.p3f9d1a00,
  clipboard3: svgOrderTabs.p3322fb80,
  hourglass: svgOrderTabs.p1d19b180,
  bahtCircle: svgOrderTabs.p39f24900,
  magnify: svgOrderTabs.p36681c14,
  bahtCircle2: svgOrderTabs.p310c8100,
  shippingBox: svgOrderTabs.p226519f0,
  truckBox: svgOrderTabs.p2302bd80,
  clockFill: svgOrderTabs.p3b039580,
  checkCircle: svgOrderTabs.p3f907180,
  shippingBox2: svgOrderTabs.p338c7f70,
  xCircle: svgOrderTabs.pcbb7d80,
};

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type OwnerTab = "overview" | "orders" | "products" | "flash_sale" | "flash_event" | "promotions" | "coupons" | "bank_settings" | "shop_info" | "add_product" | "finance" | "complaints" | "complaint_detail" | "reports" | "report_sales" | "report_customers" | "report_products" | "report_market";
type OrderFilterTab = "all" | "pending_payment" | "pending_verify" | "ready_ship" | "shipping" | "shipped" | "cancelled";

interface SidebarItem {
  id: OwnerTab;
  label: string;
  icon: any;
  children?: { id: OwnerTab; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "Dashboard", icon: BarChart3 },
  { id: "orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
  { id: "products", label: "สินค้า", icon: Package, children: [
    { id: "products", label: "จัดการสินค้า" },
    { id: "flash_sale", label: "Flash Sale" },
    { id: "promotions", label: "โปรโมชั่น" },
    { id: "coupons", label: "คูปอง" },
  ]},
  { id: "reports", label: "Report", icon: FileText, children: [
    { id: "report_sales", label: "รายงานผลยอดขาย" },
    { id: "report_customers", label: "รายงานข้อมูลลูกค้า" },
    { id: "report_products", label: "รายงานข้อมูลสินค้า" },
    { id: "report_market", label: "Market Report" },
  ]},
];

const sidebarSettings: SidebarItem[] = [];

const orderTabs: { id: OrderFilterTab; label: string; count: number }[] = [
  { id: "all", label: "ทั้งหมด", count: 20 },
  { id: "pending_payment", label: "รอชำระเงิน", count: 2 },
  { id: "pending_verify", label: "รอตรวจสอบ", count: 1 },
  { id: "ready_ship", label: "พร้อมจัดส่ง", count: 1 },
  { id: "shipping", label: "กำลังจัดส่ง", count: 15 },
  { id: "shipped", label: "ส่งสำเร็จ", count: 0 },
  { id: "cancelled", label: "ยกเลิก", count: 1 },
];

const mockProducts = [
  { id: "1",  name: "พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ",       category: "เครื่องหอม & อโรม่า", type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 89.00",          stock: "120 ชิ้น", status: "เปิดขาย", statusColor: "#319754", flash: true,
    image: "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=400&q=80" }, // essential oil bottle
  { id: "2",  name: "ขมิ้นชันแคปซูล 60 แคป",                category: "สมุนไพรแคปซูล",       type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 220.00",         stock: "85 ชิ้น",  status: "เปิดขาย", statusColor: "#319754", recommended: true,
    image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=400&q=80" }, // turmeric capsule
  { id: "3",  name: "ฟ้าทะลายโจรผง 100 g",                  category: "ผงสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 145.00",         stock: "40 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=400&q=80" }, // dried herbs
  { id: "4",  name: "กาแฟดริป Signature อเมริกาโนเย็น",     category: "อาหารและเครื่องดื่ม", type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 150.00 - 280.00", stock: "62 ชิ้น",  status: "เปิดขาย", statusColor: "#319754", flash: true,
    image: "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=400&q=80" }, // coffee drip
  { id: "5",  name: "ใบบัวบกแคปซูล 60 แคป",                 category: "สมุนไพรแคปซูล",       type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 180.00",         stock: "95 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=400&q=80" }, // green capsule / centella
  { id: "6",  name: "ชาเก๊กฮวยออร์แกนิก 20 ซอง",            category: "ชาสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 125.00",         stock: "210 ชิ้น", status: "เปิดขาย", statusColor: "#319754", recommended: true,
    image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=400&q=80" }, // herbal tea
  { id: "7",  name: "น้ำมันมะพร้าวสกัดเย็น 250 ml",         category: "น้ำมันสมุนไพร",       type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 290.00 - 520.00", stock: "48 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=400&q=80" }, // coconut oil
  { id: "8",  name: "ชามะรุม 30 ซอง",                        category: "ชาสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 130.00",         stock: "75 ชิ้น",  status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=400&q=80" }, // tea bags
  { id: "9",  name: "เห็ดหลินจือสกัด 60 แคป",               category: "สมุนไพรสกัด",         type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 245.00",         stock: "0 ชิ้น",   status: "สินค้าหมด", statusColor: "#dc2626",
    image: "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=400&q=80" }, // mushroom dried
  { id: "10", name: "น้ำผึ้งดอกลำไย 250 ml",                category: "ผลิตภัณฑ์ออร์แกนิก",   type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 215.00 - 380.00", stock: "32 ชิ้น",  status: "เปิดขาย", statusColor: "#319754", flash: true,
    image: "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=400&q=80" }, // honey jar
  { id: "11", name: "ขิงผงออร์แกนิก 100 g",                 category: "ผงสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 130.00",         stock: "150 ชิ้น", status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=400&q=80" }, // ginger powder
  { id: "12", name: "สบู่สมุนไพรขมิ้น",                      category: "ของใช้ออร์แกนิก",     type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 65.00",          stock: "180 ชิ้น", status: "เปิดขาย", statusColor: "#319754", recommended: true,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80" }, // soap bar
  { id: "13", name: "บาล์มสมุนไพรไพล",                       category: "ของใช้ออร์แกนิก",     type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 95.00",          stock: "8 ชิ้น",   status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1546039907-7fa05f864c02?w=400&q=80" }, // balm jar
  { id: "14", name: "ถุงหอมอโรมา MetaHerb Bloom Essence",   category: "เครื่องหอม & อโรม่า", type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 79.00 - 199.00",  stock: "0 ชิ้น",   status: "ปิดขาย", statusColor: "#737373",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80" }, // sachet pouch
  { id: "15", name: "ชาตะไคร้ใบเตย 30 ซอง",                 category: "ชาสมุนไพร",           type: "ราคาเดียว",   typeColor: "#ff9500", price: "฿ 110.00",         stock: "245 ชิ้น", status: "เปิดขาย", statusColor: "#319754",
    image: "https://images.unsplash.com/photo-1592479996-0c8a1e8c5d4e?w=400&q=80" }, // tea bags / lemongrass
];

const mockFlashEvents = [
  { id: "1", name: "Flash Sale 2.2", items: 5, date: "00 M.M. 0000 - 00 M.M. 0000", status: "active", countdown: { h: "00", m: "00", s: "00" } },
  { id: "2", name: "Flash Sale 2.2", items: 5, date: "00 M.M. 0000 - 00 M.M. 0000", status: "pending" },
  { id: "3", name: "Flash Sale 2.2", items: 0, date: "00 M.M. 0000 - 00 M.M. 0000", status: "join" },
];

const mockFlashProducts = [
  { id: "1", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "2", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "3", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "4", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "5", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
  { id: "6", name: "Product", normalPrice: "฿ 0.00", flashPrice: "฿ 0.00", start: "00 M.M. 0000 - 00:00 น.", end: "00 M.M. 0000 - 00:00 น.", status: "กำลังดำเนินการ", statusColor: "#319754" },
];

const mockOrders = [
  {
    id: "ORD-20260218-03571", status: "pending_payment" as const, date: "18 ก.พ. 2569 - 15:00 น.",
    customer: "username01", phone: "090-000-000",
    address: "เลขที่ 2 ชั้นที�� 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
    total: 0, items: [] as any[],
  },
  {
    id: "ORD-20260218-03571", status: "shipping" as const, date: "18 ก.พ. 2569 - 15:00 น.",
    customer: "username01", phone: "090-000-000",
    address: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33",
    total: 0,
    items: [
      { name: "ชาออร์แกนิก", option: "ตัวเลือก 1", qty: 1, price: 0 },
      { name: "ชาออร์แกนิก", option: "ตัวเลือก 2", qty: 1, price: 0 },
      { name: "ชาออร์แกนิก", option: "ตัวเลือก 3", qty: 1, price: 0 },
    ],
  },
];

/* ========== SIDEBAR ========== */
const childIconMap: Record<string, any> = { products: Package, flash_sale: Zap, promotions: Megaphone, coupons: Ticket, report_sales: TrendingUp, report_customers: Users, report_products: ShoppingBag, report_market: BarChart2 };

const sidebarActiveStyle = { backgroundImage: "linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)" };

function MenuBtn({ isActive, icon: Icon, label, onClick, hasArrow, expanded, collapsed }: any) {
  return (
    <motion.button
      onClick={onClick}
      title={collapsed ? label : undefined}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      className={`flex items-center cursor-pointer transition-colors ${
        collapsed
          ? `mx-auto rounded-full p-1 ${isActive ? "bg-[#319754]/10 ring-1 ring-[#319754]/30" : "hover:bg-gray-50"}`
          : `w-full justify-between pl-2 ${hasArrow ? "pr-3" : "pr-2"} py-2 rounded-[200px] ${!isActive ? "bg-white hover:bg-gray-50" : ""}`
      }`}
      style={!collapsed && isActive ? sidebarActiveStyle : {}}
    >
      <div className={`flex items-center ${collapsed ? "" : "gap-2.5 flex-1 min-w-0"}`}>
        <div className={`size-[28px] rounded-full flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5]"}`}>
          <Icon className={`size-3 transition-colors ${isActive ? "text-white" : "text-black/85"}`} />
        </div>
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              key="label"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.18 }}
              className={`${font} text-[14px] whitespace-nowrap overflow-hidden ${isActive ? "text-[#319754]" : "text-black"}`}>
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      {hasArrow && !collapsed && (
        <motion.div animate={{ rotate: expanded ? 0 : -90 }} transition={{ type: "spring", stiffness: 380, damping: 28 }} className="shrink-0">
          <ChevronDown className="size-3 text-black" />
        </motion.div>
      )}
    </motion.button>
  );
}

function Sidebar({ active, onSelect, collapsed, onToggle }: { active: OwnerTab; onSelect: (t: OwnerTab) => void; collapsed: boolean; onToggle: () => void }) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ products: true, settings: false });
  const navigate = useNavigate();
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
    <aside className={`flex flex-col shrink-0 p-4 transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[282px]"}`}>
      <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className={`flex items-center h-[77px] pr-0 ${collapsed ? "justify-end pl-2" : "justify-between pl-4"}`}>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.p
                key="header-label"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
                className={`${font} text-[16px] text-[#0a0a0a]`} style={{ fontWeight: 500 }}>ภาพรวม</motion.p>
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
          {sidebarItems.map((item) =>
            !item.children ? (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }}>
                {withTooltip(item.label,
                  <MenuBtn isActive={active === item.id} icon={item.icon} label={item.label} onClick={() => onSelect(item.id)} collapsed={collapsed} />
                )}
              </motion.div>
            ) : (
              <motion.div key={item.id} variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }} className="space-y-2.5">
                {collapsed ? (
                  <HoverCard openDelay={80} closeDelay={120}>
                    <HoverCardTrigger asChild>
                      <div>
                        <MenuBtn icon={item.icon} label={item.label} hasArrow={false} collapsed={collapsed}
                          onClick={() => { /* noop in collapsed: hover-only */ }} />
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent side="right" align="start" sideOffset={12}
                      className="w-auto min-w-[200px] p-2.5 rounded-[16px] border-gray-100 bg-white shadow-[0px_8px_24px_rgba(0,0,0,0.12)]">
                      <p className={`${font} text-[11px] text-gray-400 px-2 pt-1 pb-2`} style={{ fontWeight: 500 }}>{item.label}</p>
                      <div className="space-y-1.5">
                        {item.children.map((child) => {
                          const isActive = active === child.id;
                          const Icon = childIconMap[child.id] || Package;
                          return (
                            <button key={child.id + child.label} onClick={() => onSelect(child.id)}
                              className={`w-full flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-[200px] cursor-pointer transition-colors ${isActive ? "bg-[#319754]/10" : "hover:bg-gray-50"}`}>
                              <div className={`size-[24px] rounded-full flex items-center justify-center shrink-0 transition-colors ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5]"}`}>
                                <Icon className={`size-3 ${isActive ? "text-white" : "text-black/85"}`} />
                              </div>
                              <span className={`${font} text-[13px] whitespace-nowrap ${isActive ? "text-[#319754]" : "text-black"}`} style={{ fontWeight: isActive ? 500 : 400 }}>{child.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                ) : (
                  <>
                    <MenuBtn icon={item.icon} label={item.label} onClick={() => toggle(item.id)} hasArrow expanded={expandedMenus[item.id]} collapsed={collapsed} />
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
                              <motion.div key={child.id + child.label} variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.2 }}>
                                <MenuBtn isActive={active === child.id} icon={childIconMap[child.id] || Package} label={child.label} onClick={() => onSelect(child.id)} collapsed={collapsed} />
                              </motion.div>
                            ))}
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                )}
              </motion.div>
            )
          )}

          {/* Complaints */}
          <motion.div variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }}>
            {withTooltip("การร้องเรียน",
              <MenuBtn isActive={active === "complaints" || active === "complaint_detail"} icon={AlertTriangle} label="การร้องเรียน" onClick={() => onSelect("complaints")} collapsed={collapsed} />
            )}
          </motion.div>

          {/* Finance */}
          <motion.div variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0 } }} transition={{ duration: 0.25 }}>
            {withTooltip("การเงิน",
              <MenuBtn isActive={active === "finance"} icon={Wallet} label="การเงิน" onClick={() => onSelect("finance")} collapsed={collapsed} />
            )}
          </motion.div>
        </motion.nav>
        </TooltipPrimitive.Provider>
      </div>
    </aside>
  );
}

/* ========== ORDER TAB CONTENT ========== */
function OrdersTab() {
  const [activeFilter, setActiveFilter] = useState<OrderFilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const statusMap: Record<string, { label: string; color: string }> = {
    pending_payment: { label: "รอชำระเงิน", color: "bg-[#ff3b30] text-white" },
    pending_verify: { label: "รอตรวจสอบ", color: "bg-[#ff9500] text-white" },
    ready_ship: { label: "พร้อมจัดส่ง", color: "bg-[#007aff] text-white" },
    shipping: { label: "กำลังจัดส่ง", color: "bg-[#319754] text-white" },
    shipped: { label: "ส่งสำเร็จ", color: "bg-gray-500 text-white" },
    cancelled: { label: "ยกเลิก", color: "bg-red-600 text-white" },
  };

  return (
    <div>
      <h2 className={`${font} text-[22px] mb-6`} style={{ fontWeight: 600 }}>จัดการคำสั่งซื้อ</h2>

      {/* Filter tabs + search (in one pill) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-2 mb-6 flex items-center gap-2">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
        {(() => {
          const tabStyle: Record<string, { Icon: any; color: string; bg: string }> = {
            all:             { Icon: ClipboardList,  color: "#319754", bg: "#d6eadd" },
            pending_payment: { Icon: Wallet,         color: "#ff3b30", bg: "#ffe4e3" },
            pending_verify:  { Icon: ScanSearch,     color: "#ff9500", bg: "#fff1dc" },
            ready_ship:      { Icon: Package,        color: "#007aff", bg: "#dceafd" },
            shipping:        { Icon: Truck,          color: "#319754", bg: "#d6eadd" },
            shipped:         { Icon: PackageCheck,   color: "#737373", bg: "#f0f0f0" },
            cancelled:       { Icon: PackageX,       color: "#dc2626", bg: "#fde2e2" },
          };
          return orderTabs.map((tab) => {
          const isAct = activeFilter === tab.id;
          const { Icon, color, bg } = tabStyle[tab.id];
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              whileTap={{ scale: 0.94 }}
              whileHover={!isAct ? { scale: 1.04 } : undefined}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${
                !isAct ? "hover:bg-gray-50" : ""
              }`}
            >
              {/* Sliding green pill (active background) */}
              {isAct && (
                <motion.span
                  layoutId="orderTabActivePill"
                  className="absolute inset-0 bg-[#319754] shadow-[0_2px_8px_rgba(49,151,84,0.25)] rounded-full"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <motion.span
                layout
                className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : bg }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="size-[14px]" style={{ color: isAct ? "#fff" : color }} strokeWidth={2.2} />
              </motion.span>
              <span
                className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}
              >
                {tab.label}
              </span>
              <motion.span
                layout
                className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                style={{
                  backgroundColor: isAct ? "rgba(255,255,255,0.25)" : color,
                  color: "#fff",
                  fontWeight: 600,
                }}
              >
                <motion.span
                  key={tab.count}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {tab.count}
                </motion.span>
              </motion.span>
            </motion.button>
          );
        });
        })()}
        </div>
        {/* Search (inside same pill, aligned right) */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] w-[260px] shrink-0 ml-auto">
          <input
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาเลขคำสั่งซื้อ, ชื่อลูกค้า...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>
      {/* Order cards */}
      <div className="space-y-4">
        {mockOrders.map((order, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Order header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{order.id}</span>
                <span className={`${font} text-[11px] px-2.5 py-0.5 rounded-full ${statusMap[order.status]?.color || "bg-gray-200"}`}>
                  {statusMap[order.status]?.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className={`${font} text-[12px] text-gray-400 flex items-center gap-1`}>ดูรายละเอียด <Eye className="size-3.5" /></span>
                <span className={`${font} text-[12px] text-gray-400`}>{order.date}</span>
              </div>
            </div>

            {/* Order body */}
            <div className="px-5 py-4">
              {order.items.length === 0 ? (
                <>
                  {/* Customer info for pending payment */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-3">
                    <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{order.customer}</p>
                    <p className={`${font} text-[13px] text-gray-500 mt-1`}>{order.phone}</p>
                    <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>{order.address}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#ff9500] mb-3">
                    <AlertCircle className="size-3.5" />
                    <span className={`${font} text-[12px]`}>ยังไม่ได้อัพโหลดหลักฐานการชำระเงิน</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className={`${font} text-[14px]`}>รวมการสั่งซื้อ:</span>
                      <span className={`${font} text-[18px] text-[#319754]`} style={{ fontWeight: 600 }}>฿{order.total.toFixed(2)}</span>
                    </div>
                    <button className={`border border-red-400 text-red-400 px-5 py-1.5 rounded-full text-[13px] ${font} cursor-pointer hover:bg-red-50`}>ยกเลิก</button>
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="size-[60px] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{item.name}</p>
                        <p className={`${font} text-[12px] text-gray-400`}>{item.option}</p>
                        <p className={`${font} text-[12px] text-gray-400`}>จำนวน {item.qty} ชิ้น</p>
                      </div>
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>฿{item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== PRODUCTS TAB ========== */
function ProductsTab({ onAddProduct }: { onAddProduct: () => void }) {
  const [productFilter, setProductFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  // Counts derived from data so tabs always match current inventory
  const counts = {
    all: mockProducts.length,
    active: mockProducts.filter((p) => p.status === "เปิดขาย").length,
    inactive: mockProducts.filter((p) => p.status === "ปิดขาย").length,
    out: mockProducts.filter((p) => p.status === "สินค้าหมด").length,
  };

  const productFilterTabs = [
    { id: "all",      label: "สินค้าทั้งหมด", count: counts.all },
    { id: "active",   label: "สินค้าเปิดขาย", count: counts.active },
    { id: "inactive", label: "สินค้าปิดขาย", count: counts.inactive },
    { id: "out",      label: "สินค้าหมด",     count: counts.out },
  ];

  const filteredProducts = mockProducts.filter((p) => {
    if (productFilter === "all") return true;
    if (productFilter === "active") return p.status === "เปิดขาย";
    if (productFilter === "inactive") return p.status === "ปิดขาย";
    if (productFilter === "out") return p.status === "สินค้าหมด";
    return true;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * perPage;
  const pageItems = filteredProducts.slice(pageStart, pageStart + perPage);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>จัดการสินค้า</h2>
        <motion.button
          onClick={onAddProduct}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}
        >
          <span className="size-[26px] bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
            <Plus className="size-[14px]" strokeWidth={2.6} />
          </span>
          <span style={{ fontWeight: 600 }}>เพิ่มสินค้า</span>
        </motion.button>
      </div>

      {/* Filter tabs + search (in one pill) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-2 mb-6 flex items-center gap-2">
        <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0">
          {(() => {
            const tabStyle: Record<string, { Icon: any; color: string; bg: string }> = {
              all:      { Icon: Package,       color: "#319754", bg: "#d6eadd" },
              active:   { Icon: PackageCheck,  color: "#319754", bg: "#d6eadd" },
              inactive: { Icon: EyeOff,        color: "#737373", bg: "#f0f0f0" },
              out:      { Icon: AlertTriangle, color: "#dc2626", bg: "#fde2e2" },
            };
            return productFilterTabs.map((tab) => {
              const isAct = productFilter === tab.id;
              const { Icon, color, bg } = tabStyle[tab.id];
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => { setProductFilter(tab.id); setCurrentPage(1); }}
                  whileTap={{ scale: 0.94 }}
                  whileHover={!isAct ? { scale: 1.04 } : undefined}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${
                    !isAct ? "hover:bg-gray-50" : ""
                  }`}
                >
                  {isAct && (
                    <motion.span
                      layoutId="productTabActivePill"
                      className="absolute inset-0 bg-[#319754] shadow-[0_2px_8px_rgba(49,151,84,0.25)] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <motion.span
                    layout
                    className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                    style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : bg }}
                    transition={{ duration: 0.2 }}
                  >
                    <Icon className="size-[14px]" style={{ color: isAct ? "#fff" : color }} strokeWidth={2.2} />
                  </motion.span>
                  <span
                    className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                    style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}
                  >
                    {tab.label}
                  </span>
                  <motion.span
                    layout
                    className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                    style={{
                      backgroundColor: isAct ? "rgba(255,255,255,0.25)" : color,
                      color: "#fff",
                      fontWeight: 600,
                    }}
                  >
                    <motion.span
                      key={tab.count}
                      initial={{ y: 8, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                      {tab.count}
                    </motion.span>
                  </motion.span>
                </motion.button>
              );
            });
          })()}
        </div>
        {/* Search (inside same pill, aligned right) */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] w-[260px] shrink-0 ml-auto">
          <input
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาสินค้าของคุณ...."
          />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table — matches report style */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div>
          <table className="w-full table-fixed">
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "26%" }} />
              <col style={{ width: "11%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "10%" }} />
              <col style={{ width: "13%" }} />
              <col style={{ width: "6%" }} />
            </colgroup>
            <thead>
              <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                <th className="text-center pb-3 pr-2" style={{ fontWeight: 500 }}>รูปภาพ</th>
                <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>สินค้า</th>
                <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>หมวดหมู่</th>
                <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>ประเภท</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>ราคา</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>คงเหลือ</th>
                <th className="text-center pb-3 pr-4" style={{ fontWeight: 500 }}>สถานะ</th>
                <th className="text-center pb-3" style={{ fontWeight: 500 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={8} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบสินค้าในหมวดนี้</td>
                </tr>
              )}
              {pageItems.map((p) => {
                const stockMatch = p.stock.match(/^(\d[\d,]*)\s*(.*)$/);
                return (
                  <tr key={p.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/40 transition-colors">
                    {/* Image */}
                    <td className="py-2 pr-2">
                      <div className="size-[80px] bg-[#d4d4d8] rounded-[16px] overflow-hidden mx-auto">
                        <ImageWithFallback src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    {/* Name + Flash/recommended pill below */}
                    <td className="py-2 pr-4 align-middle">
                      <div className="flex flex-col gap-2 min-w-0">
                        <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }} title={p.name}>{p.name}</p>
                        {p.flash && (
                          <span className={`${font} inline-flex items-center gap-2 bg-[#e62e05] text-white px-3 py-1 rounded-full text-[12px] w-fit`}>
                            <Zap className="size-3 fill-white" strokeWidth={0} /> Flash Sale
                          </span>
                        )}
                        {p.recommended && !p.flash && (
                          <span className={`${font} inline-flex items-center gap-2 bg-[#f7931d] text-white px-3 py-1 rounded-full text-[12px] w-fit`}>
                            ★ แนะนำ
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Category */}
                    <td className={`py-2 pr-4 align-middle ${font} text-[14px] text-black truncate`} title={p.category}>{p.category}</td>
                    {/* Type pill (tinted) */}
                    <td className="py-2 pr-4 align-middle">
                      <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                        style={{ backgroundColor: `${p.typeColor}1a`, color: p.typeColor }}>
                        <span className="size-3 rounded-full inline-block" style={{ backgroundColor: p.typeColor }} />
                        {p.type}
                      </span>
                    </td>
                    {/* Price */}
                    <td className={`py-2 pr-4 text-center align-middle ${font} text-[14px] text-[#319754] tabular-nums`} style={{ fontWeight: 500 }}>{p.price}</td>
                    {/* Stock — bold number + regular unit */}
                    <td className="py-2 pr-4 text-center align-middle">
                      {stockMatch ? (
                        <span className={`${font} text-[14px] text-black`}>
                          <span className="tabular-nums" style={{ fontWeight: 500 }}>{stockMatch[1]}</span> <span>{stockMatch[2]}</span>
                        </span>
                      ) : (
                        <span className={`${font} text-[14px] text-black`}>{p.stock}</span>
                      )}
                    </td>
                    {/* Status pill (tinted) */}
                    <td className="py-2 pr-4 text-center align-middle">
                      <span className={`${font} inline-flex items-center gap-2 pl-2 pr-3.5 py-0.5 rounded-full text-[14px]`}
                        style={{ backgroundColor: `${p.statusColor}1a`, color: p.statusColor }}>
                        <Package className="size-3" strokeWidth={2.4} />
                        {p.status}
                      </span>
                    </td>
                    {/* More button (gray round) */}
                    <td className="py-2 text-center align-middle">
                      <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto">
                        <MoreHorizontal className="size-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
          <div className="flex items-center gap-2">
            <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
            <div className="relative">
              <select
                className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}
                value={perPage}
                onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              >
                {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)}
              aria-label="หน้าก่อน"
              className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
              <ChevronLeft className="size-4" strokeWidth={2.4} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                style={{ fontWeight: safePage === p ? 600 : 400 }}>
                {p}
              </button>
            ))}
            <button disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)}
              aria-label="หน้าถัดไป"
              className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
              <ChevronRight className="size-4" strokeWidth={2.4} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== FLASH SALE TAB ========== */
function FlashSaleTab({ onViewEvent }: { onViewEvent: () => void }) {
  const [flashFilter, setFlashFilter] = useState("all");
  const [showPopup, setShowPopup] = useState(false);

  const flashFilterTabs = [
    { id: "all", label: "ทั้งหมด", count: 10 },
    { id: "active", label: "กำลังดำเนินการ", count: 6 },
    { id: "scheduled", label: "กำหนดไว้ล่วงหน้า", count: 0 },
  ];

  return (
    <div>
      <h2 className={`${font} text-[22px] mb-6`} style={{ fontWeight: 600 }}>Flash Sale</h2>

      {/* Flash Sale Events */}
      <div className="mb-8">
        <h3 className={`${font} text-[16px] mb-2`} style={{ fontWeight: 600 }}>Flash Sale Event</h3>
        <div className="flex items-center gap-1.5 mb-4">
          <AlertCircle className="size-3.5 text-gray-400" />
          <span className={`${font} text-[12px] text-gray-400`}>เข้าร่วมกั�� Flash Sale กับทาง METAHERB เพื่อรับข้อ���สนอสุดพิ��ศษ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockFlashEvents.map((event) => (
            <div key={event.id} className="relative rounded-xl overflow-hidden cursor-pointer" onClick={() => event.status === "active" ? onViewEvent() : event.status === "join" ? setShowPopup(true) : onViewEvent()}>
              <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff4500] p-4 text-white min-h-[120px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>{event.name}</span>
                  {event.countdown && (
                    <div className="flex items-center gap-1 flex-wrap">
                      {[event.countdown.h, event.countdown.m, event.countdown.s].map((v, i) => (
                        <span key={i} className="bg-[#319754] text-white text-[12px] px-1.5 py-0.5 rounded">{v}</span>
                      ))}
                    </div>
                  )}
                  {event.status === "pending" && (
                    <span className={`bg-white/20 text-white text-[11px] px-2 py-0.5 rounded ${font}`}>เข้าร่วมแล้วรอยืนยากจากทางร้าน</span>
                  )}
                  {event.status === "join" && (
                    <span className={`bg-white text-[#ff4500] text-[11px] px-3 py-0.5 rounded ${font}`}>เข้าร่วมเลย</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <Package className="size-3" />
                    <span>{event.status === "join" ? "คุณยังไม่มีสินค้าเข้าร่วม" : `จำนวน ${event.items} รายการ`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] mt-1">
                    <Clock className="size-3" />
                    <span>{event.date}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Store */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>Flash Sale Store</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <AlertCircle className="size-3.5 text-gray-400" />
              <span className={`${font} text-[12px] text-gray-400`}>เข้าร่วมกับ Flash Sale กับทาง METAHERB เพื่อรับข้อเสนอสุดพิเศษ</span>
            </div>
          </div>
          <button className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-full text-[13px] ${font} cursor-pointer`}>
            <Plus className="size-4" /> เพิ่มสินค้า Flash Sale
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {flashFilterTabs.map((tab) => (
            <button key={tab.id} onClick={() => setFlashFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] ${font} cursor-pointer whitespace-nowrap border ${
                flashFilter === tab.id ? "bg-[#319754]/10 border-[#319754] text-[#319754]" : "bg-white border-gray-200 text-gray-500"
              }`}>
              {tab.label}
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${flashFilter === tab.id ? "bg-[#319754] text-white" : "bg-gray-200 text-gray-600"}`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className={`${font} text-[12px] text-gray-500 border-b bg-gray-50`}>
                <th className="text-left py-3 px-4">สินค้า</th>
                <th className="text-left py-3 px-4">ราคาปกติ</th>
                <th className="text-left py-3 px-4">Flash Sale</th>
                <th className="text-left py-3 px-4">เวลาเริ่ม</th>
                <th className="text-left py-3 px-4">เวลาสิ้นสุด</th>
                <th className="text-left py-3 px-4">สถานะ</th>
                <th className="text-center py-3 px-4">เพิ่มเติม</th>
              </tr>
            </thead>
            <tbody>
              {mockFlashProducts.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="size-[50px] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className={`${font} text-[13px]`}>{p.name}</span>
                    </div>
                  </td>
                  <td className={`${font} text-[13px] py-3 px-4`}>{p.normalPrice}</td>
                  <td className={`${font} text-[13px] py-3 px-4 text-[#ff3b30]`} style={{ fontWeight: 500 }}>{p.flashPrice}</td>
                  <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.start}</td>
                  <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.end}</td>
                  <td className="py-3 px-4">
                    <span className={`${font} text-[12px] flex items-center gap-1`} style={{ color: p.statusColor }}>
                      <span className="size-2 rounded-full" style={{ backgroundColor: p.statusColor }} />
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button className="cursor-pointer"><MoreHorizontal className="size-5 text-gray-400" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Flash Sale Join Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowPopup(false)}>
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-[520px] shadow-xl" onClick={(e) => e.stopPropagation()}>
            {/* Hero */}
            <div className="bg-gradient-to-b from-[rgba(230,46,5,0.7)] to-[#e62e05] h-[200px] relative flex items-center justify-center">
              <button onClick={() => setShowPopup(false)}
                className="absolute top-4 right-4 size-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer">
                <X className="size-3.5 text-white" />
              </button>
              <div className="w-[180px] h-[160px]">
                <ImageWithFallback src={imgFlash} alt="" className="w-full h-full object-contain" />
              </div>
            </div>
            {/* Content */}
            <div className="p-4 space-y-4">
              <h3 className={`${font} text-[20px] text-center`} style={{ fontWeight: 500 }}>เงื่อนไขและข้อเสนอสุดพิเศษ</h3>
              <div className={`${font} text-[14px] text-black space-y-2`}>
                <p style={{ fontWeight: 600 }}>ข้อเสนอสุดพิเศษ</p>
                <ul className="list-disc ml-5 space-y-1 text-[13px]">
                  <li>รับส่วนลดสูงสุดตามที่บริษัทกำหนดเฉพาะช่วงกิจกรรม Flash Sale</li>
                  <li>สินค้าที่เข้าร่วมกิจกรรมจะไ���้รับการโปรโมตผ่านช่องทางของ METAHERB</li>
                  <li>เพิ่มโอกาสในการเข้าถึงลูกค้าใหม่ และกระตุ้นยอดขายในระยะเวลาจำกัด</li>
                </ul>
                <p style={{ fontWeight: 600 }}>เงื่อนไขการเข้าร่วม</p>
                <ul className="list-disc ml-5 space-y-1 text-[13px]">
                  <li>การเข้าร่วม Flash Sale เป็นไปตามรอบกิจกรรมที่ผู้ดูแลระบบ (Admin) เป็นผู้กำหนด</li>
                  <li>ร้านค้าต้องเลือกและตั้งค่าสินค้าที่ต้องการเข้าร่วม Flash Sale ภายในระยะเวลาที่กำหนด</li>
                  <li>ราคาสินค้าและส่วนลดต้องเป็นไปตามเงื่อนไขที่ METAHERB กำหนด</li>
                  <li>ไม่สามารถยกเลิกหรือเปลี่ยนแปลงสินค้าที่เข้าร่วมได้หลังจากเริ่มกิจกรรมแล้ว</li>
                </ul>
              </div>
              <div className="border-t pt-4">
                <button onClick={() => setShowPopup(false)}
                  className={`w-full bg-[#008c45] h-[49px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>เข้าร่วม</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== FLASH EVENT DETAIL ========== */
function FlashEventDetail({ onBack }: { onBack: () => void }) {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className={`flex items-center gap-1 bg-[#d4d4d4] px-3 py-1 rounded-full text-[12px] ${font} cursor-pointer`}>
            <ChevronLeft className="size-3" /> กลับ
          </button>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>Flash Sale Event</h2>
        </div>
        <button onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-full text-[13px] ${font} cursor-pointer`}>
          <Plus className="size-4" /> เพิ่มสินค้า Flash Sale
        </button>
      </div>

      {/* Date & countdown */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          <Clock className="size-4 text-gray-500" />
          <span className={`${font} text-[13px] text-gray-500`}>00 M.M. 0000 - 00 M.M. 0000</span>
        </div>
        <div className="flex items-center gap-1">
          {["00", "00", "00"].map((v, i) => (
            <span key={i} className="bg-[#319754] text-white text-[12px] px-2 py-0.5 rounded">{v}</span>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b bg-gray-50`}>
              <th className="text-left py-3 px-4">สินค้า</th>
              <th className="text-left py-3 px-4">ราคาปกติ</th>
              <th className="text-left py-3 px-4">Flash Sale</th>
              <th className="text-left py-3 px-4">เวลาเริ่ม</th>
              <th className="text-left py-3 px-4">เวลาสิ้นสุด</th>
              <th className="text-left py-3 px-4">สถานะ</th>
              <th className="text-center py-3 px-4">เพิ่มเติม</th>
            </tr>
          </thead>
          <tbody>
            {mockFlashProducts.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="size-[50px] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                    </div>
                    <span className={`${font} text-[13px]`}>{p.name}</span>
                  </div>
                </td>
                <td className={`${font} text-[13px] py-3 px-4`}>{p.normalPrice}</td>
                <td className={`${font} text-[13px] py-3 px-4 text-[#ff3b30]`} style={{ fontWeight: 500 }}>{p.flashPrice}</td>
                <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.start}</td>
                <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.end}</td>
                <td className="py-3 px-4">
                  <span className={`${font} text-[12px] flex items-center gap-1`} style={{ color: p.statusColor }}>
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.statusColor }} /> {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button className="cursor-pointer"><MoreHorizontal className="size-5 text-gray-400" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-end gap-1 p-4">
          <button className="size-7 rounded-full flex items-center justify-center cursor-pointer text-gray-400"><ChevronLeft className="size-4" /></button>
          {[1, 2, 3, 4, 5].map((p) => (
            <button key={p} className={`size-7 rounded-full flex items-center justify-center text-[12px] ${font} cursor-pointer ${p === 1 ? "bg-[#319754] text-white" : "text-gray-500"}`}>{p}</button>
          ))}
          <button className="size-7 rounded-full flex items-center justify-center cursor-pointer text-gray-400 rotate-180"><ChevronLeft className="size-4" /></button>
        </div>
      </div>

      {/* Add Product Flash Sale Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl p-4 w-full max-w-[600px] max-h-[80vh] flex flex-col gap-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <p className={`${font} text-[20px]`} style={{ fontWeight: 500 }}>เพิ่มสินค้า Flash Sale</p>
              <button onClick={() => setShowAddModal(false)} className="size-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer">
                <X className="size-3.5" />
              </button>
            </div>
            <div className="border-t" />

            {/* Add product area */}
            <button className="border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-[#319754]/50">
              <Plus className="size-10 text-gray-400" />
              <span className={`${font} text-[14px] text-gray-500`}>เพิ่มเลือกสินค้าเข้าร่วม</span>
            </button>

            {/* Selected product */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 flex items-center gap-4">
              <div className="size-[80px] bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>Product</span>
                  <span className="bg-[#007aff]/10 text-[#007aff] text-[12px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span className="size-2 rounded-full bg-[#007aff]" /> หลายตัวเลือก
                  </span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>฿ 0.00</span>
                  <span className={`${font} text-[12px] text-gray-500 flex items-center gap-1`}>
                    <Package className="size-3" /> 0 ชิ้น
                  </span>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
              <span className={`${font} text-[12px]`}>ตัวเเลือกสินค้า</span>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4">
                  <div className="size-[80px] bg-gray-200 rounded-2xl overflow-hidden shrink-0">
                    <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>Product</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`${font} text-[12px] text-gray-400`}>เข้าร่วม Flash Sale</span>
                        <div className="size-4 border border-gray-300 rounded" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>฿ 0.00</span>
                      <span className={`${font} text-[12px] text-gray-500 flex items-center gap-1`}>
                        <Package className="size-3" /> 0 ชิ้น
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t" />
            <button className={`w-full bg-[#008c45] h-[49px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>
              เพิ่มสินค้า Flash Sale
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ========== ADD PRODUCT ========== */
function AddProductTab({ onBack }: { onBack: () => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const steps = ["รูปภาพสินค้า", "ข้อมูลสินค้า", "ตัวเลือกสินค้า", "ตั้งค่า SEO", "ตั้งค่าสินค้า"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>เพิ่มสินค้าใหม่</h2>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className={`border border-gray-300 px-6 py-2 rounded-full text-[13px] ${font} cursor-pointer hover:bg-gray-50`}>ยกเลิก</button>
          <button className={`bg-[#319754] text-white px-6 py-2 rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>เพิ่มสินค้า</button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left steps */}
        <div className="w-[180px] shrink-0 space-y-2">
          {steps.map((step, i) => (
            <button key={i} onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-full text-[13px] ${font} cursor-pointer ${
                activeStep === i ? "text-[#319754]" : "text-gray-400"
              }`}>
              <span className={`size-2 rounded-full ${activeStep === i ? "bg-[#319754]" : "bg-gray-300"}`} />
              {step}
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 space-y-6">
          {/* Image upload */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className={`${font} text-[16px] mb-2`} style={{ fontWeight: 600 }}>รูปภาพสินค้า</h3>
            <div className="flex items-center gap-1.5 mb-4">
              <AlertCircle className="size-3.5 text-gray-400" />
              <span className={`${font} text-[12px] text-gray-400`}>อัปโหลดได้สูงสุด 3 รูป รองรับไฟล์ (JPG, PNG, WebP) ขนาดไม่เกิน 2MB</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {["รูปปกสินค้า(รูปหลัก)", "รูป 2", "รูป3"].map((label, i) => (
                <button key={i} className="border-2 border-dashed border-gray-300 rounded-2xl h-[160px] flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#319754]/50">
                  <Package className="size-10 text-gray-300" />
                  <span className={`${font} text-[12px] text-gray-400`}>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Product info */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className={`${font} text-[16px] mb-4`} style={{ fontWeight: 600 }}>ข้อมูลสินค้า</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>ชื่อสินค้า <span className="text-red-500">*</span></label>
                <input placeholder="เช่น: ขมิ้นชันบง" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>หมวดหมู่ <span className="text-red-500">*</span></label>
                <select className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none appearance-none`}>
                  <option>เลือกหมวดหมู่</option>
                  <option>สมุนไพร</option>
                  <option>อาหารเสริม</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>หน่วย</label>
                <select className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none appearance-none`}>
                  <option>ชิ้น</option>
                  <option>กล่อง</option>
                  <option>ซอง</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>รหัสสินค้า (SKU) <span className="text-red-500">*</span></label>
                <input placeholder="เช่น: META-001" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>รูปแบบสินค้า</label>
                <input placeholder="เช่น: ใบชาอบแห้ง, แคปซูล, ผง" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none`} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>รายละเอียดสินค้า</label>
              <textarea placeholder="อธิบายรายละเอียดสินค้า..." className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none h-24 resize-none`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== OVERVIEW ========== */
function OverviewTab() {
  const [selectedDate, setSelectedDate] = useState(16);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [currentYear, setCurrentYear] = useState(2026);
  const [viewMode, setViewMode] = useState<"monthly" | "yearly">("monthly");
  const [salesPopupScope, setSalesPopupScope] = useState<"day" | "month" | "year" | null>(null);

  // Lock body scroll while popup is open
  useEffect(() => {
    if (!salesPopupScope) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [salesPopupScope]);

  const monthNames = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const dayNames = ["จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์", "อาทิตย์"];

  // Monthly heat data per month index (for yearly view)
  const monthlyHeatData: Record<number, number> = {
    0: 5, 1: 4, 2: 3, 3: 4, 4: 2, 5: 3, 6: 2, 7: 3, 8: 1, 9: 1, 10: 2, 11: 1,
  };

  const year = currentYear;
  const month = currentMonth;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const prevMonthDays = new Date(year, month, 0).getDate();

  const heatData: Record<number, number> = {
    1: 5, 2: 5, 3: 5, 4: 4, 5: 2, 6: 3, 7: 4,
    8: 1, 9: 2, 10: 2, 11: 3, 12: 1, 13: 2, 14: 2,
    15: 1, 16: 5, 17: 3, 18: 4, 19: 2, 20: 1, 21: 1,
    22: 2, 23: 4, 24: 4, 25: 4, 26: 1, 27: 1, 28: 1,
    29: 2, 30: 5, 31: 5,
  };

  const getHeatColor = (level: number) => {
    switch (level) {
      case 5: return "bg-[#ea6549]";
      case 4: return "bg-[#ee846d]";
      case 3: return "bg-[rgba(234,101,73,0.5)]";
      case 2: return "bg-[#fbe0db]";
      case 1: return "bg-[#fcefec]";
      default: return "bg-gray-50";
    }
  };

  const calendarCells: { day: number; inMonth: boolean; heat: number }[] = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push({ day: prevMonthDays - startOffset + 1 + i, inMonth: false, heat: 0 });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({ day: d, inMonth: true, heat: heatData[d] || 0 });
  }
  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let i = 1; i <= remaining; i++) {
      calendarCells.push({ day: i, inMonth: false, heat: 0 });
    }
  }

  const baseTopProducts = [
    { name: "ขมิ้นชันแคปซูล", cat: "สมุนไพรแคปซูล", sold: 1842, revenue: 110520 },
    { name: "ฟ้าทะลายโจร", cat: "สมุนไพรแคปซูล", sold: 1654, revenue: 82700 },
    { name: "ชาเก๊กฮวยออร์แกนิก", cat: "ชาสมุนไพร", sold: 1523, revenue: 91380 },
    { name: "น้ำผึ้งดอกลำไย", cat: "ผลิตภัณฑ์ออร์แกนิก", sold: 1389, revenue: 97230 },
    { name: "ใบบัวบกแคปซูล", cat: "สมุนไพรแคปซูล", sold: 1245, revenue: 74700 },
    { name: "น้ำมันมะพร้าวสกัดเย็น", cat: "น้ำมันสมุนไพร", sold: 1102, revenue: 154280 },
    { name: "เห็ดหลินจือสกัด", cat: "สมุนไพรสกัด", sold: 987, revenue: 138180 },
    { name: "ชาตะไคร้แห้ง", cat: "ชาสมุนไพร", sold: 876, revenue: 43800 },
    { name: "ขิงผงออร์แกนิก", cat: "ผงสมุนไพร", sold: 812, revenue: 64960 },
    { name: "สบู่สมุนไพรขมิ้น", cat: "ของใช้ออร์แกนิก", sold: 745, revenue: 111750 },
  ];

  const baseTopCustomers = [
    { name: "คุณสมชาย", email: "somchai@email.com", orders: 1842, total: 25520 },
    { name: "คุณสมพรหญิง", email: "somying@email.com", orders: 1654, total: 22700 },
    { name: "คุณทานตะวัน", email: "tantawan@email.com", orders: 1523, total: 21380 },
    { name: "คุณสายฝน", email: "saifon@email.com", orders: 1389, total: 19230 },
    { name: "คุณฟ้าใส", email: "fasai@email.com", orders: 1245, total: 18700 },
    { name: "คุณทะเล", email: "talay@email.com", orders: 1102, total: 17280 },
    { name: "คุณภูเขา", email: "phukao@email.com", orders: 987, total: 16180 },
    { name: "คุณคำธาร", email: "lumtan@email.com", orders: 876, total: 15800 },
    { name: "คุณแม่น้ำ", email: "maenam@email.com", orders: 812, total: 14960 },
    { name: "คุณอวกาศ", email: "awakas@email.com", orders: 745, total: 13750 },
  ];

  const BahtIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d={svgPaths.p19084720} fill="black" /></svg>
  );
  const DownArrow = () => (
    <svg width="10" height="5" viewBox="0 0 13 5" fill="none"><path d={svgPaths.p1d9de400} stroke="#ea6549" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
  const UpArrow = () => (
    <svg width="10" height="5" viewBox="0 0 13 5" fill="none"><path d="M1 4.5L6.5 1L12 4.5" stroke="#319754" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );

  const seed = (a: number, b: number) => ((a * 137 + b * 293 + 7) % 100);
  const monthlyVisits = [3200, 2800, 4100, 3600, 2900, 3500, 4500, 3100, 2600, 3800, 4200, 2700];
  const monthlyOrders = [480, 390, 620, 510, 430, 560, 710, 450, 370, 580, 640, 400];
  const monthlySalesData = [96000, 78000, 124000, 102000, 86000, 112000, 142000, 90000, 74000, 116000, 128000, 80000];
  const dailyVisits = (day: number) => 50 + seed(currentMonth, day) * 3;
  const dailyOrders = (day: number) => 5 + seed(currentMonth + 3, day) * 0.5;
  const dailySalesVal = (day: number) => 1000 + seed(currentMonth + 7, day) * 120;

  const productImageMap: Record<string, string> = {
    "ขมิ้นชันแคปซูล": "https://picsum.photos/seed/turmeric-capsule/200",
    "ฟ้าทะลายโจร": "https://picsum.photos/seed/andrographis/200",
    "ชาเก๊กฮวยออร์แกนิก": "https://picsum.photos/seed/chrysanthemum-tea/200",
    "น้ำผึ้งดอกลำไย": "https://picsum.photos/seed/longan-honey/200",
    "ใบบัวบกแคปซูล": "https://picsum.photos/seed/centella/200",
    "น้ำมันมะพร้าวสกัดเย็น": "https://picsum.photos/seed/coconut-oil/200",
    "เห็ดหลินจือสกัด": "https://picsum.photos/seed/lingzhi/200",
    "ชาตะไคร้แห้ง": "https://picsum.photos/seed/lemongrass-tea/200",
    "ขิงผงออร์แกนิก": "https://picsum.photos/seed/ginger-powder/200",
    "สบู่สมุนไพรขมิ้น": "https://picsum.photos/seed/turmeric-soap/200",
  };
  const productThumb = (name: string) =>
    productImageMap[name] ?? `https://picsum.photos/seed/${encodeURIComponent(name)}/200`;

  const dailySalesOrders = (day: number) => {
    const orderCount = 2 + (seed(currentMonth + 11, day) % 3); // 2-4 orders
    return Array.from({ length: orderCount }, (_, oi) => {
      const c = baseTopCustomers[(seed(currentMonth + 5, day) + oi * 3) % baseTopCustomers.length];
      const itemCount = 1 + (seed(currentMonth + oi * 7, day) % 3); // 1-3 items per order
      const items = Array.from({ length: itemCount }, (_, ii) => {
        const p = baseTopProducts[(seed(currentMonth + oi * 13 + ii * 5, day)) % baseTopProducts.length];
        const qty = 1 + (seed(currentMonth + oi + ii, day) % 3);
        const unit = Math.round(p.revenue / Math.max(p.sold, 1));
        return { name: p.name, category: p.cat, qty, unit, subtotal: qty * unit };
      });
      const orderTotal = items.reduce((s, x) => s + x.subtotal, 0);
      const orderSeq = String(1 + oi + (seed(currentMonth, day) % 90)).padStart(4, "0");
      const orderId = `ORD-${currentYear}${String(currentMonth + 1).padStart(2, "0")}${String(day).padStart(2, "0")}-${orderSeq}`;
      const time = `${String((seed(currentMonth + oi * 3, day) % 12) + 8).padStart(2, "0")}:${String((seed(currentMonth + oi * 7, day) % 60)).padStart(2, "0")}`;
      return { id: orderId, buyer: c.name, buyerEmail: c.email, time, items, total: orderTotal };
    });
  };

  // Scoped Top Product / Top Customers — filter by calendar selection
  // monthly view → daily scope (~1/30), yearly view → monthly scope (full base values)
  const scopeSeed = viewMode === "monthly"
    ? seed(currentMonth + 13, selectedDate)
    : seed(currentYear + 17, currentMonth);
  const scopeScale = viewMode === "monthly" ? 1 / 30 : 1;
  const rotate = <T,>(arr: T[], by: number) => [...arr.slice(by), ...arr.slice(0, by)];

  const topProducts = rotate(baseTopProducts, scopeSeed % baseTopProducts.length)
    .map((p, i) => ({
      ...p,
      sold: Math.max(1, Math.round(p.sold * scopeScale * (1 - i * 0.04))),
      revenue: Math.max(1, Math.round(p.revenue * scopeScale * (1 - i * 0.04))),
    }))
    .sort((a, b) => b.sold - a.sold);

  const topCustomers = rotate(baseTopCustomers, (scopeSeed + 3) % baseTopCustomers.length)
    .map((c, i) => ({
      ...c,
      orders: Math.max(1, Math.round(c.orders * scopeScale * (1 - i * 0.04))),
      total: Math.max(1, Math.round(c.total * scopeScale * (1 - i * 0.04))),
    }))
    .sort((a, b) => b.orders - a.orders);

  const maxSold = topProducts[0].sold;
  const maxOrders = topCustomers[0].orders;

  const scopeLabel = viewMode === "monthly"
    ? `${selectedDate} ${monthNames[currentMonth]} ${currentYear + 543}`
    : `${monthNames[currentMonth]} ${currentYear + 543}`;
  const yearlyVisits = monthlyVisits.reduce((a, b) => a + b, 0);
  const yearlyOrders = monthlyOrders.reduce((a, b) => a + b, 0);
  const yearlySales = monthlySalesData.reduce((a, b) => a + b, 0);
  const prevMo = currentMonth > 0 ? currentMonth - 1 : 11;
  const pct = (cur: number, prev: number) => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : 0;
  const monthVisitChg = pct(monthlyVisits[currentMonth], monthlyVisits[prevMo]);
  const monthOrderChg = pct(monthlyOrders[currentMonth], monthlyOrders[prevMo]);
  const monthSalesChg = pct(monthlySalesData[currentMonth], monthlySalesData[prevMo]);
  const prevDay = selectedDate > 1 ? selectedDate - 1 : 1;
  const dayVisitChg = pct(dailyVisits(selectedDate), dailyVisits(prevDay));
  const dayOrderChg = pct(dailyOrders(selectedDate), dailyOrders(prevDay));
  const daySalesChg = pct(dailySalesVal(selectedDate), dailySalesVal(prevDay));
  const fmt = (n: number) => Math.round(n).toLocaleString("th-TH");
  const ChgRow = ({ value, label }: { value: number; label: string }) => {
    const up = value >= 0;
    return (
      <div className="flex items-center gap-1 mt-2">
        {up ? <UpArrow /> : <DownArrow />}
        <span className={`${font} text-[11px] ${up ? "text-[#319754]" : "text-[#ea6549]"}`}>~{Math.abs(value)}% <span className="text-gray-400">% เปลี่ยนแปลงจาก{label}</span></span>
      </div>
    );
  };

  return (
    <div>
      <h2 className={`${font} text-[24px] mb-6`} style={{ fontWeight: 500 }}>Dashboard</h2>

      {/* Wallet */}
      <div className="bg-white rounded-xl border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="size-8 rounded-full bg-[#319754]/10 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <h3 className={`${font} text-[18px]`} style={{ fontWeight: 700 }}>กระเป๋าเงิน</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 border-t border-gray-100">
          <div className="pt-4">
            <p className={`${font} text-[13px] text-gray-400`}>ยอดพร้อมถอน</p>
            <p className={`${font} text-[24px] text-[#319754] mt-2`} style={{ fontWeight: 700 }}>฿2,775.21</p>
          </div>
          <div className="pt-4 md:border-l md:border-gray-100 md:pl-6">
            <p className={`${font} text-[13px] text-gray-400 flex items-center gap-1`}>
              ยอด Escrow
              <span className="inline-flex items-center justify-center size-4 rounded-full border border-gray-300 text-[10px] text-gray-400">i</span>
            </p>
            <p className={`${font} text-[24px] text-[#1a1a1a] mt-2`} style={{ fontWeight: 700 }}>฿1,370.6</p>
          </div>
          <div className="pt-4 md:border-l md:border-gray-100 md:pl-6">
            <p className={`${font} text-[13px] text-gray-400`}>รายได้สะสม</p>
            <p className={`${font} text-[24px] text-[#3b82f6] mt-2`} style={{ fontWeight: 700 }}>฿2,775.21</p>
          </div>
        </div>
      </div>

      {/* Top section: Calendar + Stats */}
      <div className="flex flex-col xl:flex-row gap-6 mb-8">
        {/* Calendar / Year Heatmap */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex-1 min-w-0 xl:basis-1/2">
          {/* Row 1: label + legend */}
          <div className="flex items-center justify-between mb-4">
            <p className={`${font} text-[14px] text-[#a4a4a4]`}>{viewMode === "monthly" ? "ประจำเดือน" : "ประจำปี"}</p>
            <div className="flex items-center gap-2.5 h-10">
              <div className="flex items-center gap-1.5"><span className={`${font} text-[12px]`}>สูง</span><div className="size-3 rounded-full bg-[#ea6549]" /></div>
              <div className="size-3 rounded-full bg-[#ee846d]" />
              <div className="size-3 rounded-full bg-[rgba(234,101,73,0.5)]" />
              <div className="size-3 rounded-full bg-[#fbe0db]" />
              <div className="flex items-center gap-1.5"><div className="size-3 rounded-full bg-[#fcefec]" /><span className={`${font} text-[12px]`}>ต่ำ</span></div>
            </div>
          </div>

          {/* Row 2: nav + toggle */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              {viewMode === "monthly" ? (
                <>
                  <button onClick={() => setCurrentMonth(m => m > 0 ? m - 1 : 11)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className={`${font} text-[24px]`} style={{ fontWeight: 700 }}>{monthNames[currentMonth]} {currentYear + 543}</span>
                  <button onClick={() => setCurrentMonth(m => m < 11 ? m + 1 : 0)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors rotate-180">
                    <ChevronLeft className="size-3.5" />
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => setCurrentYear(y => y - 1)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                    <ChevronLeft className="size-3.5" />
                  </button>
                  <span className={`${font} text-[24px]`} style={{ fontWeight: 700 }}>{currentYear + 543}</span>
                  <button onClick={() => setCurrentYear(y => y + 1)} className="bg-[#f4f4f4] rounded-full size-6 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors rotate-180">
                    <ChevronLeft className="size-3.5" />
                  </button>
                </>
              )}
            </div>
            <div className="bg-white flex items-center overflow-clip p-[4px] rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)]">
              {([
                { id: "monthly" as const, label: "รายเดือน" },
                { id: "yearly" as const, label: "รายปี" },
              ]).map((vm) => (
                <button key={vm.id} onClick={() => setViewMode(vm.id)}
                  className={`${font} text-[14px] cursor-pointer px-3 py-1 rounded-full relative transition-colors ${viewMode === vm.id ? "text-white" : "text-black"}`}
                  style={{ fontWeight: viewMode === vm.id ? 500 : 400 }}>
                  {viewMode === vm.id && (
                    <motion.div layoutId="overview-viewmode-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative z-10">{vm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {viewMode === "monthly" ? (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-3 mb-3">
                {dayNames.map(d => (
                  <div key={d} className={`${font} text-[14px] text-center text-black`}>{d}</div>
                ))}
              </div>
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-3">
                {calendarCells.map((cell, i) => {
                  const isSelected = cell.inMonth && cell.day === selectedDate;
                  const isOutside = !cell.inMonth;
                  return (
                    <button key={i}
                      onClick={() => cell.inMonth && setSelectedDate(cell.day)}
                      className={`aspect-square rounded-xl flex items-center justify-center text-[14px] ${font} cursor-pointer transition-all duration-200 relative
                        ${isOutside ? "bg-[#f5f5f5] text-[#a3a3a3] hover:bg-[#ebebeb]" : isSelected ? "bg-[#f1340c] text-white hover:bg-[#d92e0a] shadow-[0px_2px_8px_rgba(241,52,12,0.35)]" : getHeatColor(cell.heat) + " text-black hover:scale-110 hover:shadow-[0px_3px_10px_rgba(0,0,0,0.12)] hover:z-10"}
                        ${cell.inMonth && !isSelected && cell.heat === 0 ? "!bg-[#f5f5f5] hover:!bg-[#ebebeb]" : ""}`}>
                      {cell.day}
                      {isSelected && <div className="absolute inset-0 rounded-xl border-[1.5px] border-[#890404] pointer-events-none" />}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            /* Yearly: 3 rows x 4 cols month grid */
            <div className="grid grid-cols-4 gap-4">
              {monthNames.map((mName, mi) => {
                const heat = monthlyHeatData[mi] || 0;
                const isSelected = mi === currentMonth;
                return (
                  <button key={mi}
                    onClick={() => { setCurrentMonth(mi); setViewMode("monthly"); }}
                    className={`aspect-[4/3] rounded-xl flex items-end justify-center pb-3 text-[14px] ${font} cursor-pointer transition-all duration-200 relative
                      ${isSelected ? "bg-[#f1340c] text-white hover:bg-[#d92e0a] shadow-[0px_2px_8px_rgba(241,52,12,0.35)]" : getHeatColor(heat) + " text-black hover:scale-105 hover:shadow-[0px_3px_10px_rgba(0,0,0,0.12)] hover:z-10"}
                      ${heat === 0 && !isSelected ? "!bg-[#f5f5f5] hover:!bg-[#ebebeb]" : ""}`}>
                    {mName}
                    {isSelected && <div className="absolute inset-0 rounded-xl border-[1.5px] border-[#890404] pointer-events-none" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right stats */}
        <div className="flex flex-col gap-3 flex-1 xl:basis-1/2">
          {/* Row 1: sales — highlight card */}
          <div className="bg-gradient-to-r from-[#319754] to-[#46A165] rounded-2xl p-5 shadow-[0px_2px_12px_rgba(49,151,84,0.25)]">
            <div className="flex items-center justify-between">
              <p className={`${font} text-[12px] text-white/70`}>{viewMode === "yearly" ? "ยอดขายรายปี" : "ยอดขายรายเดือน"}</p>
              <div className="size-8 rounded-full bg-white/20 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className={`${font} text-[28px] text-white`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? yearlySales : monthlySalesData[currentMonth])}</span>
              <span className={`${font} text-[13px] text-white/70`}>บาท</span>
            </div>
            <div className="flex items-center justify-between gap-2 mt-2">
              <div className="flex items-center gap-1 min-w-0">
                {(viewMode === "yearly" ? 15 : monthSalesChg) >= 0 ? <UpArrow /> : <DownArrow />}
                <span className={`${font} text-[11px] text-white/90 truncate`}>~{Math.abs(viewMode === "yearly" ? 15 : monthSalesChg)}% <span className="text-white/60">% เปลี่ยนแปลงจาก{viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"}</span></span>
              </div>
              <button onClick={() => setSalesPopupScope(viewMode === "yearly" ? "year" : "month")}
                className={`${font} text-[11px] inline-flex items-center justify-center gap-1 bg-white/20 hover:bg-white/30 text-white px-3 rounded-full cursor-pointer transition-colors shrink-0 h-8`}
                style={{ fontWeight: 600 }}>
                <Eye className="size-3" />
                ดูรายละเอียด
              </button>
            </div>
          </div>

          {/* Row 2: visits + orders */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gradient-to-br from-white to-[#f0faf3] rounded-2xl border border-[#e0f0e5] p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(49,151,84,0.1)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "ยอดเข้าชมรายปี" : "ยอดเข้าชมรายเดือน"}</p>
                <div className="size-8 rounded-full bg-[#319754]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? yearlyVisits : monthlyVisits[currentMonth])}</span>
                <span className={`${font} text-[13px] text-gray-400`}>ครั้ง</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? 12 : monthVisitChg} label={viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"} />
            </div>
            <div className="bg-gradient-to-br from-white to-[#f0faf3] rounded-2xl border border-[#e0f0e5] p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(49,151,84,0.1)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "คำสั่งซื้อรายปี" : "คำสั่งซื้อรายเดือน"}</p>
                <div className="size-8 rounded-full bg-[#3b82f6]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? yearlyOrders : monthlyOrders[currentMonth])}</span>
                <span className={`${font} text-[13px] text-gray-400`}>รายการ</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? 8 : monthOrderChg} label={viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"} />
            </div>
          </div>

          {/* Row 3: sub-level visits + orders */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "ยอดเข้าชมรายเดือน" : "ยอดเข้าชมรายวัน"}</p>
                <div className="size-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? monthlyVisits[currentMonth] : dailyVisits(selectedDate))}</span>
                <span className={`${font} text-[13px] text-gray-400`}>ครั้ง</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? monthVisitChg : dayVisitChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(0,0,0,0.06)] transition-shadow">
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-400`}>{viewMode === "yearly" ? "คำสั่งซื้อรายเดือน" : "คำสั่งซื้อรายวัน"}</p>
                <div className="size-8 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
              </div>
              <div className="flex items-baseline gap-1.5 mt-3">
                <span className={`${font} text-[26px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? monthlyOrders[currentMonth] : dailyOrders(selectedDate))}</span>
                <span className={`${font} text-[13px] text-gray-400`}>รายการ</span>
              </div>
              <ChgRow value={viewMode === "yearly" ? monthOrderChg : dayOrderChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
            </div>
          </div>

          {/* Row 4: contextual sales */}
          <div className="bg-gradient-to-br from-white to-[#fef9f0] rounded-2xl border border-[#f0e6d4] p-5 shadow-[0px_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0px_2px_12px_rgba(245,158,11,0.1)] transition-shadow">
            <div className="flex items-center justify-between">
              <p className={`${font} text-[12px] text-gray-400`}>
                {viewMode === "yearly"
                  ? `ยอดขาย ${monthNames[currentMonth]} ${currentYear + 543}`
                  : `ยอดขาย ${selectedDate} ${monthNames[currentMonth]} ${currentYear + 543}`}
              </p>
              <div className="size-8 rounded-full bg-[#f59e0b]/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className={`${font} text-[26px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{fmt(viewMode === "yearly" ? monthlySalesData[currentMonth] : dailySalesVal(selectedDate))}</span>
              <span className={`${font} text-[13px] text-gray-400`}>บาท</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <ChgRow value={viewMode === "yearly" ? monthSalesChg : daySalesChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
              <button onClick={() => setSalesPopupScope(viewMode === "yearly" ? "month" : "day")}
                className={`${font} text-[11px] inline-flex items-center justify-center gap-1 bg-white hover:bg-gray-50 text-gray-600 px-3 rounded-full cursor-pointer transition-colors shrink-0 mt-2 h-8`}
                style={{ fontWeight: 600 }}>
                <Eye className="size-3" />
                ดูรายละเอียด
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Top Product + Top Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className={`${font} text-[20px] mb-0.5`} style={{ fontWeight: 700 }}>Top Product</h3>
          <p className={`${font} text-[13px] text-gray-400 mb-4`}>10 อันดับสินค้าขายดี · {scopeLabel}</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${font} text-[13px] text-gray-500`}>
                  <th className="text-left pb-3 pr-2">#</th>
                  <th className="text-left pb-3 pr-4">สินค้า</th>
                  <th className="text-right pb-3 pr-4">ยอดขาย(ชิ้น)</th>
                  <th className="text-right pb-3">รายได้ (฿)</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((p, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-3 pr-2">
                      <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font} ${i < 3 ? "bg-[#ea6549] text-white" : "text-gray-500"}`} style={{ fontWeight: 600 }}>{i + 1}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`${font} text-[14px] truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className={`${font} text-[12px] text-gray-400 truncate`}>{p.cat}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4a90d9] rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                        </div>
                        <span className={`${font} text-[14px] w-12 text-right`}>{p.sold.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className={`py-3 text-right ${font} text-[14px]`}>{p.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className={`${font} text-[20px] mb-0.5`} style={{ fontWeight: 700 }}>Top Customers</h3>
          <p className={`${font} text-[13px] text-gray-400 mb-4`}>ยอดขายลูกค้าประจำ · {scopeLabel}</p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${font} text-[13px] text-gray-500`}>
                  <th className="text-left pb-3 pr-2">#</th>
                  <th className="text-left pb-3 pr-4">ลูกค้า</th>
                  <th className="text-right pb-3 pr-4">คำสั่งซื้อ</th>
                  <th className="text-right pb-3">ยอดรวม (฿)</th>
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((c, i) => (
                  <tr key={i} className="border-t border-gray-50">
                    <td className="py-3 pr-2">
                      <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font} ${i < 3 ? "bg-[#ea6549] text-white" : "text-gray-500"}`} style={{ fontWeight: 600 }}>{i + 1}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{c.name}</p>
                      <p className={`${font} text-[12px] text-gray-400`}>{c.email}</p>
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#4a90d9] rounded-full" style={{ width: `${(c.orders / maxOrders) * 100}%` }} />
                        </div>
                        <span className={`${font} text-[14px] w-12 text-right`}>{c.orders.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className={`py-3 text-right ${font} text-[14px]`}>{c.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {salesPopupScope && (() => {
        // Build day-month tuples to aggregate based on scope
        const tasks: Array<[number, number]> = []; // [month, day]
        if (salesPopupScope === "day") {
          tasks.push([currentMonth, selectedDate]);
        } else if (salesPopupScope === "month") {
          const dim = new Date(currentYear, currentMonth + 1, 0).getDate();
          for (let d = 1; d <= dim; d++) tasks.push([currentMonth, d]);
        } else {
          for (let m = 0; m < 12; m++) {
            const dim = new Date(currentYear, m + 1, 0).getDate();
            for (let d = 1; d <= dim; d++) tasks.push([m, d]);
          }
        }

        // Note: dailySalesOrders is seeded by currentMonth — for year scope we approximate by reusing the helper across days.
        const byProduct = new Map<string, { name: string; category: string; unit: number; qty: number; sales: number }>();
        tasks.forEach(([_m, d]) => {
          dailySalesOrders(d).forEach((o) => o.items.forEach((it) => {
            const cur = byProduct.get(it.name);
            if (cur) { cur.qty += it.qty; cur.sales += it.subtotal; }
            else byProduct.set(it.name, { name: it.name, category: it.category, unit: it.unit, qty: it.qty, sales: it.subtotal });
          }));
        });
        const products = [...byProduct.values()]
          .map((p) => ({ ...p, cost: Math.round(p.sales * 0.45) }))
          .sort((a, b) => b.sales - a.sales);
        const totalSum = products.reduce((s, p) => s + p.sales, 0);
        const totalQty = products.reduce((s, p) => s + p.qty, 0);
        const title = salesPopupScope === "day"
          ? `รายการขาย ${selectedDate} ${monthNames[currentMonth]} ${currentYear + 543}`
          : salesPopupScope === "month"
            ? `รายการขาย ${monthNames[currentMonth]} ${currentYear + 543}`
            : `รายการขาย ปี ${currentYear + 543}`;
        const emptyText = salesPopupScope === "day" ? "ไม่มีรายการขายในวันนี้"
          : salesPopupScope === "month" ? "ไม่มีรายการขายในเดือนนี้"
          : "ไม่มีรายการขายในปีนี้";
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSalesPopupScope(null)}>
            <div className="bg-white rounded-2xl overflow-hidden w-full max-w-[720px] max-h-[85vh] flex flex-col shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <div>
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 700 }}>{title}</h3>
                  <p className={`${font} text-[13px] text-gray-400 mt-0.5`}>
                    ยอดรวม <span className="text-[#319754]" style={{ fontWeight: 600 }}>{totalSum.toLocaleString()} บาท</span> · {totalQty} ชิ้น · {products.length} รายการ
                  </p>
                </div>
                <button onClick={() => setSalesPopupScope(null)}
                  className="size-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer">
                  <X className="size-4 text-gray-600" />
                </button>
              </div>
              <div className="overflow-y-auto overscroll-contain p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-gray-50/50">
                {products.map((p, i) => {
                  const profit = p.sales - p.cost;
                  const margin = p.sales > 0 ? (profit / p.sales) * 100 : 0;
                  const profitLow = margin < 55;
                  return (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
                      <div className="flex items-start gap-3">
                        <div className="size-12 rounded-lg overflow-hidden shrink-0">
                          <ImageWithFallback src={productThumb(p.name)} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }} title={p.name}>{p.name}</p>
                          <p className={`${font} text-[11px] text-gray-400 truncate`}>{p.category}</p>
                          <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{p.unit.toLocaleString()} ฿/ชิ้น</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-50">
                        <div>
                          <p className={`${font} text-[10px] text-gray-400`}>จำนวน</p>
                          <p className={`${font} text-[14px] text-[#1a1a1a] mt-0.5`} style={{ fontWeight: 600 }}>{p.qty} <span className="text-[10px] text-gray-400">ชิ้น</span></p>
                        </div>
                        <div>
                          <p className={`${font} text-[10px] text-gray-400`}>ยอดขาย</p>
                          <p className={`${font} text-[14px] text-[#319754] mt-0.5`} style={{ fontWeight: 700 }}>฿{p.sales.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className={`${font} text-[10px] text-gray-400`}>ต้นทุน</p>
                          <p className={`${font} text-[14px] text-gray-600 mt-0.5`} style={{ fontWeight: 500 }}>฿{p.cost.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                        <p className={`${font} text-[11px] text-gray-400`}>กำไร / มาร์จิ้น</p>
                        <p className={`${font} text-[14px]`} style={{ fontWeight: 700, color: profitLow ? "#dc2626" : "#15803d" }}>
                          ฿{profit.toLocaleString()} <span className="text-[11px]">· {margin.toFixed(1)}%</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
                {products.length === 0 && (
                  <div className={`${font} col-span-full text-center py-10 text-[13px] text-gray-400`}>{emptyText}</div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ========== FINANCE TAB ========== */
const financeTransactions = [
  { date: "16 มี.ค. 2569 14:42", type: "ค่าธรรมเนียม GP", typeColor: "bg-[#ff9500] text-white", order: "#ORD-20260316-202753-1", amount: "-฿3.96", balance: "฿0.00" },
  { date: "16 มี.ค. 2569 14:42", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260316-202753-1", amount: "+฿115.24", balance: "฿0.00" },
  { date: "16 มี.ค. 2569 14:41", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260316-202753-1", amount: "-฿119.20", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:52", type: "ค่าธรรมเนียม GP", typeColor: "bg-[#ff9500] text-white", order: "#ORD-20260313-472419-1", amount: "-฿5.56", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:52", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260313-472419-1", amount: "+฿105.64", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:44", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260313-472419-1", amount: "-฿111.20", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:21", type: "ค่าธรรมเนียม GP", typeColor: "bg-[#ff9500] text-white", order: "#ORD-20260313-288830-1", amount: "-฿17.32", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:21", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260313-288830-1", amount: "+���329.08", balance: "฿0.00" },
  { date: "13 มี.ค. 2569 11:18", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260313-288830-1", amount: "-฿346.40", balance: "฿0.00" },
  { date: "12 มี.ค. 2569 19:00", type: "Escrow", typeColor: "bg-[#007aff] text-white", order: "#ORD-20260312-108642-1", amount: "-฿160.00", balance: "฿0.00" },
];

function FinanceTab({ onBankSettings }: { onBankSettings: () => void }) {
  const [activeView, setActiveView] = useState<"all" | "withdraw">("all");
  const [selectedMonth, setSelectedMonth] = useState("มี.ค. 2569");
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const monthOptions = [
    { value: "มี.ค. 2569", label: "มีนาคม" },
    { value: "ก.พ. 2569", label: "กุมภาพันธ์" },
    { value: "ม.ค. 2569", label: "มกราคม" },
  ];
  const filteredTx = financeTransactions.filter((tx) => tx.date.includes(selectedMonth));
  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className={`${fontBold} text-[22px]`} style={{ fontWeight: 700 }}>กระเป๋าเงิน</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดการรายได้และการถอนเงินของร้านค้า</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={onBankSettings} className={`border border-gray-300 text-gray-700 px-5 py-2 rounded-full text-[14px] ${font} cursor-pointer hover:bg-gray-50 transition-colors flex items-center gap-1.5`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            ตั้งค่าการเงิน
          </button>
          <button className={`bg-[#319754] text-white px-5 py-2 rounded-full text-[14px] ${font} cursor-pointer hover:bg-[#2a8348] transition-colors`}>ถอนเงิน</button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "ยอดพร้อมถอน", value: "฿663.96", icon: "💰", gradient: "from-[#319754] to-[#46A165]", text: "text-white", sub: "text-white/70" },
          { label: "ยอด ESCROW ⓘ", value: "฿697.00", icon: "🔒", gradient: "from-[#007aff] to-[#339af0]", text: "text-white", sub: "text-white/70" },
          { label: "รายได้สะสม", value: "฿663.96", icon: "📈", gradient: "from-[#ff9500] to-[#ffb340]", text: "text-white", sub: "text-white/70" },
          { label: "ถอนไปแล้ว", value: "฿0.00", icon: "🏦", gradient: "from-gray-50 to-white", text: "text-gray-800", sub: "text-gray-500", isBorder: true },
        ].map((c) => (
          <div key={c.label} className={`bg-gradient-to-br ${c.gradient} rounded-2xl p-5 relative overflow-hidden ${c.isBorder ? "border border-gray-200" : "shadow-sm"}`}>
            <div className="absolute -top-3 -right-3 text-[48px] opacity-15 select-none">{c.icon}</div>
            <p className={`${font} text-[12px] ${c.sub} mb-2`}>{c.label}</p>
            <p className={`${fontBold} text-[24px] ${c.text}`} style={{ fontWeight: 700 }}>{c.value}</p>
          </div>
        ))}
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 flex-wrap gap-3">
          <p className={`${fontBold} text-[16px]`} style={{ fontWeight: 600 }}>รายการเคลื่อนไหวล่าสุด</p>
          <div className="flex items-center gap-4">
            <div className="relative">
              <button onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                className={`${font} bg-[#fafafa] flex items-center gap-[24px] px-[24px] py-[6px] rounded-[100px] cursor-pointer text-[14px] text-black`} style={{ fontWeight: 400 }}>
                {monthOptions.find(m => m.value === selectedMonth)?.label}
                <svg className="w-[16px] h-[9px] shrink-0" fill="none" viewBox="0 0 16 9">
                  <path d={svgChevron.p2aea2180} fill="black" fillOpacity="0.85" />
                </svg>
              </button>
              {showMonthDropdown && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowMonthDropdown(false)} />
                  <div className="absolute top-full left-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[160px]">
                    {monthOptions.map((m) => (
                      <button key={m.value} onClick={() => { setSelectedMonth(m.value); setShowMonthDropdown(false); }}
                        className={`${font} w-full text-left px-4 py-2 text-[14px] cursor-pointer hover:bg-gray-50 transition-colors ${selectedMonth === m.value ? "text-[#319754]" : "text-gray-700"}`}
                        style={{ fontWeight: selectedMonth === m.value ? 500 : 400 }}>
                        {m.label}{selectedMonth === m.value && " ✓"}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="bg-white flex items-center overflow-clip p-[4px] rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] w-fit">
              <button onClick={() => setActiveView("all")}
                className={`${font} text-[14px] cursor-pointer backdrop-blur-[2px] flex items-center justify-center px-[12px] py-[4px] rounded-[100px] transition-colors ${activeView === "all" ? "bg-[#319754] text-white" : "text-black"}`} style={{ fontWeight: activeView === "all" ? 500 : 400 }}>ดูทั้งหมด</button>
              <button onClick={() => setActiveView("withdraw")}
                className={`${font} text-[14px] cursor-pointer backdrop-blur-[2px] flex items-center justify-center px-[12px] py-[4px] rounded-[100px] transition-colors ${activeView === "withdraw" ? "bg-[#319754] text-white" : "text-black"}`} style={{ fontWeight: activeView === "withdraw" ? 500 : 400 }}>ประวัติการถอน</button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-gray-100">
                <th className={`${font} text-[12px] text-gray-500 text-left px-5 py-3`} style={{ fontWeight: 500 }}>วันที่</th>
                <th className={`${font} text-[12px] text-gray-500 text-left px-5 py-3`} style={{ fontWeight: 500 }}>ประเภท</th>
                <th className={`${font} text-[12px] text-gray-500 text-left px-5 py-3`} style={{ fontWeight: 500 }}>เลขออเดอร์</th>
                <th className={`${font} text-[12px] text-gray-500 text-right px-5 py-3`} style={{ fontWeight: 500 }}>จำนวนเงิน</th>
                <th className={`${font} text-[12px] text-gray-500 text-right px-5 py-3`} style={{ fontWeight: 500 }}>ยอดคงเหลือ</th>
              </tr>
            </thead>
            <tbody>
              {(activeView === "all" ? filteredTx : []).map((tx, i) => (
                <tr key={i} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className={`${font} text-[13px] text-gray-700 px-5 py-3 whitespace-nowrap`}>{tx.date}</td>
                  <td className="px-5 py-3">
                    <span className={`${font} text-[11px] px-2.5 py-1 rounded-md ${tx.typeColor}`} style={{ fontWeight: 500 }}>{tx.type}</span>
                  </td>
                  <td className={`${font} text-[13px] text-gray-700 px-5 py-3 whitespace-nowrap`}>{tx.order}</td>
                  <td className={`${font} text-[13px] text-right px-5 py-3 whitespace-nowrap ${tx.amount.startsWith("+") ? "text-[#319754]" : "text-gray-700"}`}>{tx.amount}</td>
                  <td className={`${font} text-[13px] text-gray-700 text-right px-5 py-3 whitespace-nowrap`}>{tx.balance}</td>
                </tr>
              ))}
              {activeView === "all" && filteredTx.length === 0 && (
                <tr><td colSpan={5} className={`${font} text-[13px] text-gray-400 text-center py-8`}>ไม่มีรายการในเดือนนี้</td></tr>
              )}
              {activeView === "withdraw" && (
                <tr><td colSpan={5} className={`${font} text-[13px] text-gray-400 text-center py-8`}>ยังไม่มีประวัติการถอน</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}

/* ========== BANK SETTINGS ========== */
const bankOptions = [
  { value: "KTB", label: "ธนาคารกรุงไทย", logo: bankLogoKTB },
  { value: "KBANK", label: "ธนาคารกสิกรไทย", logo: bankLogoKBANK },
  { value: "SCB", label: "ธนาคารไทยพาณิชย์", logo: bankLogoSCB },
  { value: "BBL", label: "ธนาคารกรุงเทพ", logo: bankLogoBBL },
  { value: "TTB", label: "ธนาคารทหารไทยธนชาต", logo: bankLogoTTB },
];

function BankSettingsTab({ onBack }: { onBack: () => void }) {
  const [editing, setEditing] = useState(false);
  const [bankData, setBankData] = useState({ bank: "KTB", account: "000-000-0000", name: "บริษัท เมต้าเฮิร์บ จำกัด" });
  const [draft, setDraft] = useState(bankData);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSave = () => {
    setBankData(draft);
    setEditing(false);
  };

  const selectedBank = bankOptions.find(b => b.value === bankData.bank) || bankOptions[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <button onClick={onBack} className="bg-[#d4d4d4] hover:bg-[#c4c4c4] flex gap-2.5 items-center justify-center px-4 py-1 rounded-full cursor-pointer transition-colors">
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" className="rotate-180"><path d="M8 5.99654C8 5.82383 7.93314 5.66493 7.80612 5.54058L2.51294 0.17962C2.39264 0.0621761 2.24561 0 2.07184 0C1.73099 0 1.46365 0.26943 1.46365 0.62867C1.46365 0.80138 1.53049 0.960275 1.63742 1.07772L6.5029 5.99654L1.63742 10.9154C1.53049 11.0328 1.46365 11.1848 1.46365 11.3644C1.46365 11.7237 1.73099 11.9931 2.07184 11.9931C2.24561 11.9931 2.39264 11.9309 2.51294 11.8066L7.80612 6.4525C7.93314 6.32124 8 6.16925 8 5.99654Z" fill="black"/></svg>
            <span className={`${font} text-[12px] text-black`}>กลับ</span>
          </button>
          <h2 className={`${fontBold} text-[22px]`} style={{ fontWeight: 700 }}>ตั้งค่าการเงิน</h2>
        </div>
        <div className="pl-[82px]">
          <p className={`${font} text-[13px] text-[#6a7282]`}>จัดการบัญชีธนาคารสำหรับรับเงินจากการขาย</p>
        </div>
      </div>

      {/* Bank Card */}
      <div className="bg-white rounded-2xl p-4 w-full flex flex-col gap-4">
        {/* Title row */}
        <div className="flex items-start justify-between">
          <h3 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>บัญชีธนาคารสำหรับรับเงิน</h3>
          {!editing ? (
            <button onClick={() => { setDraft(bankData); setEditing(true); }} className="bg-[#f2f2f7] hover:bg-[#e5e5ea] flex gap-2.5 items-center justify-center px-4 py-1 rounded-full cursor-pointer transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.00955 11.3122L10.0345 3.08148L8.74737 1.75248L0.714958 9.98325L0.0161701 11.6671C-0.0573865 11.8484 0.133861 12.0598 0.310397 11.9842L2.00955 11.3122ZM10.6819 2.43208L11.4248 1.68452C11.7999 1.29941 11.822 0.884102 11.4837 0.536747L11.2335 0.280008C10.9026 -0.0597926 10.498 -0.0295881 10.1228 0.347968L9.37992 1.10308L10.6819 2.43208Z" fill="black" fillOpacity="0.85"/></svg>
              <span className={`${font} text-[12px] text-black`}>แก้ไข</span>
            </button>
          ) : (
            <div className="flex gap-2.5 items-center">
              <button onClick={() => setEditing(false)} className="border border-[#ff3b30] flex items-center justify-center px-4 py-1 rounded-full cursor-pointer hover:bg-red-50 transition-colors">
                <span className={`${font} text-[12px] text-[#ff3b30]`}>ยกเลิก</span>
              </button>
              <button onClick={handleSave} className="bg-[#319754] hover:bg-[#2a8348] flex items-center justify-center px-4 py-1 rounded-full cursor-pointer transition-colors">
                <span className={`${font} text-[12px] text-white`}>บันทึก</span>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-[#d4d4d8]" />

        {!editing ? (
          <>
            {/* Notice */}
            <div className="bg-[rgba(255,141,40,0.1)] px-2 py-1 rounded-full inline-flex self-start">
              <span className={`${font} text-[12px] text-[#ff9500]`}>เมื่อมีคำสั่งซื้อสำเร็จ Admin จะโอนเงินค่าสินค้า (หักค่าธรรมเนียม) ให้คุณผ่านบัญชีนี้</span>
            </div>

            {/* Bank info */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ธนาคาร</span>
              <div className="flex gap-2 items-center py-3">
                <img src={selectedBank.logo} alt="" className="w-7 h-7 object-contain rounded-full" />
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{selectedBank.label}</span>
              </div>
            </div>

            {/* Account number & name side by side */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <span className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>เลขที่บัญชี</span>
                <div className="py-3">
                  <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{bankData.account}</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <span className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ชื่อบัญชี</span>
                <div className="py-3">
                  <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{bankData.name}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Notice */}
            <div className="bg-[rgba(255,141,40,0.1)] px-2 py-1 rounded-full inline-flex self-start">
              <span className={`${font} text-[12px] text-[#ff9500]`}>เมื่อมีคำสั่งซื้อสำเร็จ Admin จะโอนเงินค่าสินค้า (หักค่าธรรมเนียม) ให้คุณผ่านบัญชีนี้</span>
            </div>

            {/* Bank select */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ธนาคาร</label>
              <div className="relative w-full sm:w-1/2">
                {/* Custom dropdown trigger */}
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`bg-[#fafafa] h-[48px] w-full rounded-full px-6 py-3 text-[14px] ${font} outline-none cursor-pointer flex items-center gap-2.5 pr-12`}
                  style={{ fontWeight: 500 }}
                >
                  {(() => { const db = bankOptions.find(b => b.value === draft.bank); return db ? <><img src={db.logo} alt="" className="w-6 h-6 object-contain rounded-full shrink-0" /><span className="truncate">{db.label}</span></> : null; })()}
                </button>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none" className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}><path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85"/></svg>
                </div>
                {/* Dropdown list */}
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute top-[52px] left-0 w-full bg-white rounded-2xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                      {bankOptions.map(b => (
                        <button
                          key={b.value}
                          type="button"
                          onClick={() => { setDraft({ ...draft, bank: b.value }); setDropdownOpen(false); }}
                          className={`w-full flex items-center gap-2.5 px-6 py-3 hover:bg-[#f5f5f5] cursor-pointer transition-colors ${draft.bank === b.value ? "bg-[#f0faf3]" : ""}`}
                        >
                          <img src={b.logo} alt="" className="w-6 h-6 object-contain rounded-full shrink-0" />
                          <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{b.label}</span>
                          {draft.bank === b.value && (
                            <svg className="ml-auto shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Account number & name */}
            <div className="flex gap-4">
              <div className="flex-1 flex flex-col gap-2">
                <label className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>เลขที่บัญชี</label>
                <input value={draft.account} onChange={(e) => setDraft({ ...draft, account: e.target.value })} placeholder="xxx-x-xxxxx-x" className={`bg-[#fafafa] h-[48px] w-full rounded-full px-6 py-3 text-[14px] ${font} outline-none`} style={{ fontWeight: 500 }} />
              </div>
              <div className="flex-1 flex flex-col gap-2">
                <label className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>ชื่อบัญชี</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="ชื่อ-นามสกุล" className={`bg-[#fafafa] h-[48px] w-full rounded-full px-6 py-3 text-[14px] ${font} outline-none`} style={{ fontWeight: 500 }} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ========== COMPLAINTS DATA ========== */
type ComplaintStatus = "pending" | "in_progress" | "approved" | "completed" | "rejected";
type ComplaintType = "damaged" | "defective" | "return" | "refund" | "wrong_item";

interface Complaint {
  id: string;
  orderId: string;
  customer: string;
  customerEmail: string;
  customerPhone: string;
  type: ComplaintType;
  status: ComplaintStatus;
  product: string;
  description: string;
  amount: number;
  refundChannel: string;
  createdAt: string;
  items: { name: string; qty: number; price: number; hasImage: boolean }[];
  timeline: { title: string; desc: string; date: string; done: boolean }[];
}

const typeLabels: Record<ComplaintType, string> = { damaged: "สินค้าเสียหาย", defective: "สินค้ามีตำหนิ", return: "คืนสินค้า", refund: "ขอเงินคืน", wrong_item: "สินค้าผิดรายการ" };
const statusLabels: Record<ComplaintStatus, string> = { pending: "รอดำเนินการ", in_progress: "กำลังดำเนินการ", approved: "อนุมัติแล้ว", completed: "เสร็จสิ้น", rejected: "ปฏิเสธ" };
const statusColors: Record<ComplaintStatus, string> = { pending: "bg-[#ff9500] text-white", in_progress: "bg-[#007aff] text-white", approved: "bg-[#319754] text-white", completed: "bg-gray-500 text-white", rejected: "bg-[#ff3b30] text-white" };
const typeTextColors: Record<ComplaintType, string> = { damaged: "text-[#ef4444]", defective: "text-[#f97316]", return: "text-[#3b82f6]", refund: "text-[#8b5cf6]", wrong_item: "text-[#eab308]" };

const mockComplaints: Complaint[] = [
  { id: "CPL-001", orderId: "ORD-20260301-5821", customer: "สมชาย ใจดี", customerEmail: "metaherb@gmail.com", customerPhone: "061-421-3111", type: "damaged", status: "in_progress", product: "ชาสมุนไพรเมต้าเฮิร์บ (กล่อง 30 ซอง)", description: "กล่องสินค้าบุบเสียหายอย่างหนัก ผลิตภัณฑ์ด้านในแตกออกและหกเลอะ ไม่สามารถใช้งานได้", amount: 450, refundChannel: "ธนาคารทหารไทยธนชาต [*1234]", createdAt: "15 มี.ค. 2569", items: [{ name: "ชาอูหลงผสมดอกหอมหมื่นลี้", qty: 1, price: 150, hasImage: true }, { name: "ชาเขียวมัทฉะผสมส้มยูซุ", qty: 1, price: 150, hasImage: false }, { name: "ชาเขียวมัทฉะลาเต้", qty: 1, price: 150, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "15 มี.ค. 2569 09:15", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "15 มี.ค. 2569 11:30", done: true }, { title: "อนุมัติและดำเนินการ", desc: "อยู่ระหว่างจัดส่งสินค้าทดแทน", date: "16 มี.ค. 2569 14:00", done: true }, { title: "จัดส่งสินค้าทดแทน", desc: "ส่งสินค้าทดแทนให้ลูกค้า", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-002", orderId: "ORD-20260228-015", customer: "วรรณา สุขสบาย", customerEmail: "wanna@email.com", customerPhone: "089-876-5432", type: "wrong_item", status: "pending", product: "ชาสมุนไพรรวม MetaHerb 30 ซอง", description: "สั่งชาสมุนไพรรวม แต่ได้รับชาดอกคาโมมายล์แทน", amount: 350, refundChannel: "ธนาคารไทยพาณิชย์ [*5432]", createdAt: "10 มี.ค. 2569", items: [{ name: "ชาสมุนไพรรวม MetaHerb 30 ซอง", qty: 1, price: 350, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "10 มี.ค. 2569 14:20", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "รอดำเนินการ", done: false }, { title: "อนุมัติและดำเนินการ", desc: "รอการพิจารณา", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-003", orderId: "ORD-20260225-008", customer: "ปราณี รักสมุนไพร", customerEmail: "pranee@email.com", customerPhone: "062-111-2222", type: "refund", status: "approved", product: "ครีมสมุนไพร MetaHerb 50g", description: "ใช้ผลิตภัณฑ์แล้วเกิดอาการแพ้ ต้องการขอเงินคืนเต็มจำนวน", amount: 890, refundChannel: "ธนาคารกรุงเทพ [*3333]", createdAt: "8 มี.ค. 2569", items: [{ name: "ครีมสมุนไพร MetaHerb 50g", qty: 1, price: 890, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "8 มี.ค. 2569 10:00", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "9 มี.ค. 2569 09:30", done: true }, { title: "อนุมัติและดำเนินการ", desc: "อนุมัติคืนเงินเรียบร้อย", date: "10 มี.ค. 2569 14:00", done: true }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-004", orderId: "ORD-20260220-022", customer: "อนุชา ต้นไม้", customerEmail: "anucha@email.com", customerPhone: "095-333-4444", type: "return", status: "completed", product: "เซ็ตสมุนไพรบำรุงผิว MetaHerb", description: "สินค้าที่ได้รับไม่ตรงกับรูปและรายละเอียดที่แสดงบนเว็บไซต์", amount: 1250, refundChannel: "ธนาคารกสิกรไทย [*4444]", createdAt: "5 มี.ค. 2569", items: [{ name: "เซ็ตสมุนไพรบำรุงผิว MetaHerb", qty: 1, price: 1250, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "5 มี.ค. 2569 08:30", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานตรวจสอบเสร็จสิ้น", date: "6 มี.ค. 2569 10:00", done: true }, { title: "อนุมัติและดำเนินการ", desc: "อนุมัติคืนสินค้าเรียบร้อย", date: "7 มี.ค. 2569 11:00", done: true }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียนเรียบร้อย", date: "10 มี.ค. 2569 16:00", done: true }] },
  { id: "CPL-005", orderId: "ORD-20260218-030", customer: "มานะ ขยันดี", customerEmail: "mana@email.com", customerPhone: "087-555-6666", type: "defective", status: "rejected", product: "น้ำมันไพล MetaHerb 50ml", description: "ฝาขวดปิดไม่สนิท น้ำมันไหลซึมออกมา", amount: 195, refundChannel: "ธนาคารกรุงไทย [*6666]", createdAt: "1 มี.ค. 2569", items: [{ name: "น้ำมันไพล MetaHerb 50ml", qty: 1, price: 195, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "1 มี.ค. 2569 13:00", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานตรวจสอบเสร็จสิ้น", date: "2 มี.ค. 2569 09:00", done: true }, { title: "ปฏิเสธคำร้อง", desc: "ไม่อยู่ในเงื่อนไขการรับประกัน", date: "3 มี.ค. 2569 10:00", done: true }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-006", orderId: "ORD-20260315-011", customer: "จิราภรณ์ ดอกไม้", customerEmail: "jira@email.com", customerPhone: "063-777-8888", type: "damaged", status: "pending", product: "สบู่สมุนไพร MetaHerb 3 ก้อน", description: "กล่องพัสดุถูกทับจนบุบ สินค้าข้างในเสียรูป", amount: 450, refundChannel: "ธนาคารกสิกรไทย [*8888]", createdAt: "17 มี.ค. 2569", items: [{ name: "สบู่สมุนไพร MetaHerb 3 ก้อน", qty: 1, price: 450, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "17 มี.ค. 2569 10:45", done: true }, { title: "ตรวจสอบข้อมูล", desc: "รอตรวจสอบ", date: "รอดำเนินการ", done: false }, { title: "อนุมัติและดำเนินการ", desc: "รอการพิจารณา", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
  { id: "CPL-007", orderId: "ORD-20260310-005", customer: "กนกวรรณ ใจเย็น", customerEmail: "kanok@email.com", customerPhone: "091-999-0000", type: "refund", status: "in_progress", product: "แชมพูสมุนไพร MetaHerb 300ml", description: "ชำระเงินซ้ำ 2 รอบ ต้องการเงินคืน 1 รายการ", amount: 780, refundChannel: "ธนาคารกรุงไทย [*0000]", createdAt: "12 มี.ค. 2569", items: [{ name: "แชมพูสมุนไพร MetaHerb 300ml", qty: 1, price: 780, hasImage: false }], timeline: [{ title: "ส่งคำร้องเรียน", desc: "ระบบได้รับคำร้องเรียนของคุณแล้ว", date: "12 มี.ค. 2569 16:30", done: true }, { title: "ตรวจสอบข้อมูล", desc: "ทีมงานกำลังตรวจสอบหลักฐานและข้อมูล", date: "14 มี.ค. 2569 09:00", done: true }, { title: "อนุมัติและดำเนินการ", desc: "รอการพิจารณา", date: "รอดำเนินการ", done: false }, { title: "เสร็จสิ้น", desc: "ปิดคำร้องเรียน", date: "รอดำเนินการ", done: false }] },
];

/* ========== COMPLAINTS TAB (List) ========== */
function ComplaintsTab({ onViewDetail }: { onViewDetail: (id: string) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ComplaintType | "all">("all");

  const statusTabs: { id: ComplaintStatus | "all"; label: string; count: number }[] = [
    { id: "all", label: "ทั้งหมด", count: mockComplaints.length },
    { id: "pending", label: "รอดำเนินการ", count: mockComplaints.filter((c) => c.status === "pending").length },
    { id: "in_progress", label: "กำลังดำเนินการ", count: mockComplaints.filter((c) => c.status === "in_progress").length },
    { id: "approved", label: "อนุมัติแล้ว", count: mockComplaints.filter((c) => c.status === "approved").length },
    { id: "completed", label: "เสร็จสิ้น", count: mockComplaints.filter((c) => c.status === "completed").length },
    { id: "rejected", label: "ปฏิเสธ", count: mockComplaints.filter((c) => c.status === "rejected").length },
  ];

  const typeTabs: { id: ComplaintType | "all"; label: string }[] = [
    { id: "all", label: "ทุกประเภท" },
    { id: "damaged", label: "สินค้าเสียหาย" },
    { id: "defective", label: "สินค้ามีตำหนิ" },
    { id: "return", label: "คืนสินค้า" },
    { id: "refund", label: "ขอเงินคืน" },
    { id: "wrong_item", label: "สินค้าผิดรายการ" },
  ];

  const filtered = mockComplaints.filter((c) => {
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (typeFilter !== "all" && c.type !== typeFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return c.id.toLowerCase().includes(q) || c.customer.toLowerCase().includes(q) || c.orderId.toLowerCase().includes(q) || c.product.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>การร้องเรียน</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5 w-[320px]">
            <input className={`${font} flex-1 text-[13px] outline-none bg-transparent`} placeholder="ค้นหาเลขร้องเรียน, ชื่อลูกค้า..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="bg-[#319754] p-1.5 rounded-full cursor-pointer"><Search className="size-4 text-white" /></button>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="bg-white rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] flex items-center justify-start gap-1 overflow-x-auto p-2 mb-4">
        {statusTabs.map((tab) => {
          const isAct = statusFilter === tab.id;
          return (
            <button key={tab.id} onClick={() => setStatusFilter(tab.id)}
              className={`backdrop-blur-[2px] flex gap-2.5 items-center justify-center pl-3 pr-2 py-1 rounded-[100px] cursor-pointer shrink-0 transition-colors ${isAct ? "bg-[#319754]" : ""}`}>
              <span className={`${font} text-[14px] whitespace-nowrap ${isAct ? "text-white" : "text-black"}`} style={{ fontWeight: isAct ? 500 : 400 }}>{tab.label}</span>
              <div className={`flex items-center justify-center px-2 py-1 rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] ${isAct ? "bg-white" : "bg-[#ff383c]"}`}>
                <span className={`${font} text-[8px] ${isAct ? "text-[#ff383c]" : "text-white"}`}>{tab.count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <Filter className="size-4 text-gray-400" />
        {typeTabs.map((tab) => (
          <button key={tab.id} onClick={() => setTypeFilter(tab.id)}
            className={`px-3 py-1 rounded-full text-[12px] cursor-pointer transition-colors border ${typeFilter === tab.id ? "border-[#319754] bg-[#319754]/10 text-[#319754]" : "border-gray-200 text-gray-500 hover:bg-gray-50"} ${font}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table - Figma style */}
      <div className="bg-white rounded-[16px] overflow-hidden relative border border-[#e8e8e8]">
        {/* Header */}
        <div className="bg-[#fafafa] border-b border-[#e8e8e8] grid grid-cols-[1fr_1fr_0.75fr_0.5fr_0.5fr] items-center px-5 py-3">
          {["การร้องเรียน","สินค้า / คำสั่งซื้อ","ผู้แจ้ง","ประเภท","สถานะ"].map((h, i) => (
            <p key={i} className={`${font} text-[12px] text-[#999]`} style={{ fontWeight: 500 }}>{h}</p>
          ))}
        </div>
        {/* Rows */}
        {filtered.map((c) => {
          const typeIconConfig: Record<ComplaintType, { bg: string; border: string; color: string }> = {
            refund: { bg: "bg-[#eef2ff]", border: "border-[#c7d2fe]", color: "#6366F1" },
            damaged: { bg: "bg-[#fef2f2]", border: "border-[#fecaca]", color: "#EF4444" },
            return: { bg: "bg-[#f0fdf4]", border: "border-[#bbf7d0]", color: "#319754" },
            wrong_item: { bg: "bg-[#fffbeb]", border: "border-[#fde68a]", color: "#F59E0B" },
            defective: { bg: "bg-[#fff7ed]", border: "border-[#fed7aa]", color: "#F97316" },
          };
          const typeBadgeConfig: Record<ComplaintType, { bg: string; text: string }> = {
            refund: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]" },
            damaged: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]" },
            return: { bg: "bg-[#f0fdf4]", text: "text-[#319754]" },
            wrong_item: { bg: "bg-[#fffbeb]", text: "text-[#f59e0b]" },
            defective: { bg: "bg-[#fff7ed]", text: "text-[#f97316]" },
          };
          const statusBadgeConfig: Record<ComplaintStatus, { bg: string; text: string; color: string }> = {
            pending: { bg: "bg-[#fffbeb]", text: "text-[#f59e0b]", color: "#F59E0B" },
            in_progress: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", color: "#3B82F6" },
            approved: { bg: "bg-[#f0fdf4]", text: "text-[#319754]", color: "#319754" },
            completed: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]", color: "#6366F1" },
            rejected: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]", color: "#EF4444" },
          };
          const ti = typeIconConfig[c.type];
          const tb = typeBadgeConfig[c.type];
          const sb = statusBadgeConfig[c.status];
          return (
            <div key={c.id} className="grid grid-cols-[1fr_1fr_0.75fr_0.5fr_0.5fr] items-center px-5 py-4 border-b border-[#f5f5f5] hover:bg-gray-50/50 cursor-pointer transition-colors" onClick={() => onViewDetail(c.id)}>
              {/* Col 1: Icon + ID + Date */}
              <div className="flex items-center gap-3">
                <div className={`${ti.bg} border ${ti.border} rounded-lg size-9 shrink-0 flex items-center justify-center`}>
                  {c.type === "refund" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p2949e900} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p22e64900} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "damaged" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p18993c00} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M8 14.6667V8" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p14df0fc0} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M5 2.84667L11 6.28" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "return" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p12949080} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M2 2V5.33333H5.33333" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "wrong_item" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p19987d80} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M14 2V5.33333H10.6667" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p2a3e9c80} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M5.33333 10.6667H2V14" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                  {c.type === "defective" && (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d={svgComplaint.p18993c00} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M8 14.6667V8" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d={svgComplaint.p14df0fc0} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M5 2.84667L11 6.28" stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></svg>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{c.id}</p>
                  <p className={`${font} text-[11px] text-[#999]`}>{c.createdAt}</p>
                </div>
              </div>
              {/* Col 2: Product + Order ID */}
              <div className="flex flex-col justify-center min-w-0">
                <p className={`${font} text-[13px] text-black truncate`}>{c.product}</p>
                <p className={`${font} text-[11px] text-[#999]`}>{c.orderId}</p>
              </div>
              {/* Col 3: Email + Phone */}
              <div className="flex flex-col justify-center min-w-0">
                <p className={`${font} text-[13px] text-black truncate`}>{c.customerEmail}</p>
                <p className={`${font} text-[11px] text-[#999]`}>{c.customerPhone}</p>
              </div>
              {/* Col 4: Type badge */}
              <div>
                <span className={`${font} text-[11px] ${tb.bg} ${tb.text} px-2.5 py-1 rounded-full inline-block`}>{typeLabels[c.type]}</span>
              </div>
              {/* Col 5: Status badge with icon */}
              <div>
                <span className={`${font} text-[11px] ${sb.bg} ${sb.text} pl-[10px] pr-2.5 py-1 rounded-full inline-flex items-center gap-1`}>
                  {c.status === "pending" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="5" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M6 3V6L8 7" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {c.status === "in_progress" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgComplaint.p3e7757b0} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M6 4V6" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M6 8H6.005" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {(c.status === "approved" || c.status === "completed") && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgComplaint.p23551518} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 5.5L6 7L11 2" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {c.status === "rejected" && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgComplaint.p3e7757b0} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M7.5 4.5L4.5 7.5" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /><path d="M4.5 4.5L7.5 7.5" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" /></svg>
                  )}
                  {statusLabels[c.status]}
                </span>
              </div>

            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className={`${font} text-center py-12 text-[#999] text-[14px]`}>ไม่พบรายการร้องเรียน</div>
        )}
      </div>
    </div>
  );
}

/* ========== COMPLAINT DETAIL TAB (Figma-matched layout) ========== */
function ComplaintDetailTab({ complaintId, onBack }: { complaintId: string; onBack: () => void }) {
  const complaint = mockComplaints.find((c) => c.id === complaintId) || mockComplaints[0];
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus>(complaint.status);
  const [noteText, setNoteText] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);

  /* --- type icon config for header --- */
  const typeIconConfig: Record<ComplaintType, { bg: string; border: string; color: string }> = {
    refund: { bg: "bg-[#eef2ff]", border: "border-[#c7d2fe]", color: "#6366F1" },
    damaged: { bg: "bg-[#fef2f2]", border: "border-[#fecaca]", color: "#EF4444" },
    return: { bg: "bg-[#f0fdf4]", border: "border-[#bbf7d0]", color: "#319754" },
    wrong_item: { bg: "bg-[#fffbeb]", border: "border-[#fde68a]", color: "#F59E0B" },
    defective: { bg: "bg-[#fff7ed]", border: "border-[#fed7aa]", color: "#F97316" },
  };
  const statusBadgeConfig: Record<ComplaintStatus, { bg: string; text: string; borderColor: string; color: string }> = {
    pending: { bg: "bg-[#fffbeb]", text: "text-[#f59e0b]", borderColor: "rgba(245,158,11,0.38)", color: "#F59E0B" },
    in_progress: { bg: "bg-[#eff6ff]", text: "text-[#3b82f6]", borderColor: "rgba(59,130,246,0.38)", color: "#3B82F6" },
    approved: { bg: "bg-[#f0fdf4]", text: "text-[#319754]", borderColor: "rgba(49,151,84,0.38)", color: "#319754" },
    completed: { bg: "bg-[#eef2ff]", text: "text-[#6366f1]", borderColor: "rgba(99,102,241,0.38)", color: "#6366F1" },
    rejected: { bg: "bg-[#fef2f2]", text: "text-[#ef4444]", borderColor: "rgba(239,68,68,0.38)", color: "#EF4444" },
  };
  const ti = typeIconConfig[complaint.type];
  const sb = statusBadgeConfig[complaint.status];

  return (
    <div>
      {/* Back button */}
      <div className="mb-6">
        <button onClick={onBack} className="flex gap-2 items-center bg-[#d4d4d4] rounded-full px-4 py-1 cursor-pointer hover:bg-[#c4c4c4] transition-colors">
          <ChevronLeft size={14} />
          <span className={`${font} text-[12px] text-black`}>กลับ</span>
        </button>
      </div>

      {/* ===== HEADER: Type icon + Title + Status badge ===== */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className={`${ti.bg} border ${ti.border} rounded-[12px] size-12 shrink-0 flex items-center justify-center`}>
            {complaint.type === "refund" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "damaged" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "return" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "wrong_item" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
            {complaint.type === "defective" && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d={svgDetail.p1cbf6000} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /><path d={svgDetail.p10779400} stroke={ti.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" /></svg>
            )}
          </div>
          <div>
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{typeLabels[complaint.type]}</p>
            <p className={`${font} text-[13px] text-[#999]`}>#{complaint.id} · {complaint.createdAt}</p>
          </div>
        </div>
        {/* Status badge */}
        <div className={`${sb.bg} rounded-full h-[37px] flex items-center gap-2 px-4`} style={{ border: `1px solid ${sb.borderColor}` }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d={svgDetail.p39ee6532} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
            {complaint.status === "pending" && <path d="M8 4V8L10.6667 9.33333" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />}
            {complaint.status === "in_progress" && <><path d="M8 5.33333V8" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M8 10.6667H8.00667" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></>}
            {(complaint.status === "approved" || complaint.status === "completed") && <path d={svgDetail.p1f2c5400} stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />}
            {complaint.status === "rejected" && <><path d="M10 6L6 10" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /><path d="M6 6L10 10" stroke={sb.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" /></>}
          </svg>
          <p className={`${font} text-[14px] ${sb.text}`} style={{ fontWeight: 500 }}>{statusLabels[complaint.status]}</p>
        </div>
      </div>

      {/* ===== TWO-COLUMN LAYOUT ===== */}
      <div className="flex gap-6 items-start">

        {/* LEFT COLUMN */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Card: รายละเอียดคำร้องเรียน */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-4 p-5">
              {/* Section heading with bottom border */}
              <div className="pb-3 border-b border-[#e8e8e8]">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>รายละเอียดคำร้องเรียน</p>
              </div>

              {/* Info rows */}
              <div className="flex flex-col gap-4">
                {/* Row 1: เลขที่คำสั่งซื้อ | สินค้า */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>เลขที่คำสั่งซื้อ</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.orderId}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>สินค้า</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.product}</p>
                  </div>
                </div>
                {/* Row 2: อีเมล | เบอร์ติดต่อ */}
                <div className="flex gap-4">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>อีเมล</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.customerEmail}</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className={`${font} text-[11px] text-[#999]`}>เบอร์ติดต่อ</p>
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{complaint.customerPhone}</p>
                  </div>
                </div>
                {/* Row 3: ยอดขอคืนเงิน */}
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ยอดขอคืนเงิน</p>
                  <p className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 500 }}>฿{complaint.amount.toLocaleString()}</p>
                </div>
              </div>

              {/* รายละเอียดปัญหา */}
              <div className="flex flex-col gap-1">
                <p className={`${font} text-[11px] text-[#999]`}>รายละเอียดปัญหา</p>
                <div className="bg-[#fafafa] rounded-[10px] relative border border-[#e8e8e8] px-[17px] py-[17px]">
                  <p className={`${font} text-[14px] text-black`}>{complaint.description}</p>
                </div>
              </div>

              {/* Evidence images */}
              <div className="flex gap-3">
                <div className="rounded-[10px] relative shrink-0 size-[133px] overflow-hidden border border-[#d4d4d8]">
                  <img src={imgEvidence0} alt="หลักฐาน 1" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-[10px] relative shrink-0 size-[133px] overflow-hidden border border-[#d4d4d8]">
                  <img src={imgEvidence1} alt="หลักฐาน 2" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>

          {/* Card: สินค้าที่ต้องการขอคืนเงิน */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8] overflow-hidden">
            <div className="flex flex-col gap-4 p-4">
              <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>สินค้าที่ต้องการขอคืนเงิน</p>
              <div className="h-px bg-[#d4d4d8]" />
              {complaint.items.map((item, idx) => (
                <div key={idx} className="bg-white rounded-[12px] relative border border-[#d9d9d9]">
                  <div className="flex items-center gap-2 p-4">
                    <div className="rounded-lg shrink-0 size-16 overflow-hidden">
                      {item.hasImage ? (
                        <img src={imgRefundProduct} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <div className="bg-[#e7e7e7] rounded-lg size-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[12px] text-black truncate`} style={{ fontWeight: 500 }}>{item.name}</p>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿ {item.price.toFixed(2)}</p>
                      <p className={`${font} text-[10px] text-black`}>จำนวน {item.qty} ชิ้น</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: ข้อมูลบัญชีธนาคาร */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-4 pt-5 px-5 pb-5">
              {/* Heading with icon */}
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d={svgDetail.p35993080} stroke="#6366F1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  <path d="M1.33333 6.66667H14.6667" stroke="#6366F1" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                </svg>
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลบัญชีธนาคาร</p>
              </div>

              {/* Bank info grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ธนาคาร</p>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ธนาคารไทยพาณิชย์ (SCB)</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ชื่อบัญชี</p>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>มาลี สวยงาม</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>เลขบัญชี</p>
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>987-6-54321-0</p>
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className={`${font} text-[11px] text-[#999]`}>ยอดโอน</p>
                  <p className={`${font} text-[18px] text-[#6366f1]`} style={{ fontWeight: 500 }}>฿{complaint.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card: บันทึกของเจ้าหน้าที่ */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-3 pt-5 px-5 pb-5">
              {/* Heading row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d={svgDetail.p1bb15080} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                  </svg>
                  <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>บันทึกของเจ้าหน้าที่</p>
                </div>
                <button onClick={() => setIsEditingNote(!isEditingNote)} className="flex items-center gap-1 cursor-pointer">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 11.6667H12.25" stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                    <path d={svgDetail.p3d94d500} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
                  </svg>
                  <span className={`${font} text-[12px] text-[#319754]`} style={{ fontWeight: 500 }}>แก้ไข</span>
                </button>
              </div>
              {/* Note content */}
              {isEditingNote ? (
                <div className="flex flex-col gap-2">
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="เพิ่มบันทึก..."
                    className={`${font} text-[14px] bg-[#f0fdf4] rounded-[12px] border border-[#bbf7d0] px-[17px] py-[17px] min-h-[57px] resize-none outline-none`}
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setIsEditingNote(false)} className={`${font} text-[12px] text-[#999] px-3 py-1 rounded-full cursor-pointer`}>ยกเลิก</button>
                    <button onClick={() => setIsEditingNote(false)} className={`${font} text-[12px] text-white bg-[#319754] px-4 py-1 rounded-full cursor-pointer`}>บันทึก</button>
                  </div>
                </div>
              ) : (
                <div className="bg-[#f0fdf4] rounded-[12px] relative border border-[#bbf7d0] px-[17px] py-[17px]">
                  <p className={`${font} text-[14px] text-[#999]`}>{noteText || "ยังไม่มีบันทึก"}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="shrink-0 flex flex-col gap-5" style={{ width: 408 }}>

          {/* Card: อัปเดตสถานะ */}
          <div className="bg-white rounded-[16px] relative border border-[#e8e8e8]">
            <div className="flex flex-col gap-4 p-5">
              {/* Section heading */}
              <div className="pb-3 border-b border-[#e8e8e8]">
                <p className={`${font} text-[15px] text-black`} style={{ fontWeight: 500 }}>อัปเดตสถานะ</p>
              </div>

              {/* Status radio buttons */}
              <div className="flex flex-col gap-2">
                {(["pending", "in_progress", "approved", "completed", "rejected"] as ComplaintStatus[]).map((status) => {
                  const isSelected = selectedStatus === status;
                  const sbc = statusBadgeConfig[status];
                  return (
                    <button
                      key={status}
                      onClick={() => setSelectedStatus(status)}
                      className={`relative h-[45.5px] rounded-[12px] flex items-center gap-2 px-[17px] cursor-pointer transition-colors ${
                        isSelected ? `${sbc.bg}` : "bg-white"
                      }`}
                      style={{ border: `1px solid ${isSelected ? sbc.borderColor : "#e8e8e8"}` }}
                    >
                      {/* Status icon */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        {status === "pending" && (
                          <>
                            <path d={svgDetail.p39ee6532} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M8 4V8L10.6667 9.33333" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                        {status === "in_progress" && (
                          <>
                            <path d={svgDetail.p39ee6532} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M8 5.33333V8" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M8 10.6667H8.00667" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                        {(status === "approved" || status === "completed") && (
                          <>
                            <path d={svgDetail.p34e03900} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d={svgDetail.p1f2c5400} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                        {status === "rejected" && (
                          <>
                            <path d={svgDetail.p39ee6532} stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M10 6L6 10" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                            <path d="M6 6L10 10" stroke={isSelected ? sbc.color : "#666"} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                          </>
                        )}
                      </svg>
                      <p className={`${font} text-[13px] ${isSelected ? sbc.text : "text-[#666]"}`} style={{ fontWeight: 500 }}>{statusLabels[status]}</p>
                      {/* Active indicator dot */}
                      {isSelected && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 size-2 rounded-full" style={{ backgroundColor: sbc.color }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Save button */}
              <button className="bg-[#319754] h-[45px] rounded-full w-full flex items-center justify-center cursor-pointer hover:bg-[#2a8248] transition-colors">
                <span className={`${font} text-[14px] text-white`} style={{ fontWeight: 500 }}>บันทึกสถานะ</span>
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            {/* ส่งอีเมลหาลูกค้า */}
            <button className="bg-[#f0fdf4] h-[41.5px] rounded-full w-full flex items-center justify-center gap-2 border border-[#bbf7d0] cursor-pointer hover:bg-[#dcfce7] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d={svgDetail.p17070980} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                <path d={svgDetail.p120c8200} stroke="#319754" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <span className={`${font} text-[13px] text-[#319754]`}>ส่งอีเมลหาลูกค้า</span>
            </button>
            {/* โทรหาลูกค้า */}
            <button className="bg-[#f5f5f5] h-[41.5px] rounded-full w-full flex items-center justify-center gap-2 border border-[#e8e8e8] cursor-pointer hover:bg-[#ebebeb] transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d={svgDetail.p2a44c680} stroke="#555" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
              </svg>
              <span className={`${font} text-[13px] text-[#555]`}>โทรหาลูกค้า</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ========== REPORT — SALES ========== */
function ReportSalesTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [productSort, setProductSort] = useState<"sales_desc" | "sales_asc" | "qty_desc" | "margin_desc" | "stock_asc">("sales_desc");
  const [productPage, setProductPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [dailyRange, setDailyRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [monthRange, setMonthRange] = useState<{ from: number; to: number; year: number }>({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() });
  const [monthClickPhase, setMonthClickPhase] = useState<0 | 1>(0);
  const [yearRange, setYearRange] = useState<{ from: number; to: number }>({ from: today.getFullYear(), to: today.getFullYear() });
  const [yearClickPhase, setYearClickPhase] = useState<0 | 1>(0);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [datasetCalOpen, setDatasetCalOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];
  const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];

  // Past 5 years available for yearly filter (CE values, will display in BE)
  const availableYears = Array.from({ length: 5 }, (_, i) => today.getFullYear() - i); // [current, current-1, ..., current-4]

  const datasetLabel = (() => {
    switch (period) {
      case "daily": {
        if (dailyRange?.from && dailyRange.to && dailyRange.to.getTime() !== dailyRange.from.getTime()) {
          return `${fmtDate(dailyRange.from)} - ${fmtDate(dailyRange.to)}`;
        }
        const d = dailyRange?.from ?? today;
        return `วันที่ ${d.getDate()} ${thaiMonthsFull[d.getMonth()]} ${d.getFullYear() + 543}`;
      }
      case "weekly":
        return `เดือน${thaiMonthsFull[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
      case "monthly": {
        const yr = monthRange.year + 543;
        if (monthRange.from === monthRange.to) return `เดือน${thaiMonthsFull[monthRange.from]} ${yr}`;
        return `${thaiMonthsShort[monthRange.from]} – ${thaiMonthsShort[monthRange.to]} ${yr}`;
      }
      case "yearly": {
        if (yearRange.from === yearRange.to) return `ปี ${yearRange.from + 543}`;
        const a = Math.min(yearRange.from, yearRange.to);
        const b = Math.max(yearRange.from, yearRange.to);
        return `ปี ${a + 543} – ${b + 543}`;
      }
      case "custom":
        return rangeLabel;
    }
  })();

  const handleMonthClick = (m: number) => {
    if (monthClickPhase === 0) {
      setMonthRange((cur) => ({ ...cur, from: m, to: m }));
      setMonthClickPhase(1);
    } else {
      setMonthRange((cur) => ({ ...cur, from: Math.min(cur.from, m), to: Math.max(cur.from, m) }));
      setMonthClickPhase(0);
      setDatasetCalOpen(false);
    }
  };

  const handleYearClick = (y: number) => {
    if (yearClickPhase === 0) {
      setYearRange({ from: y, to: y });
      setYearClickPhase(1);
    } else {
      setYearRange((cur) => ({ from: Math.min(cur.from, y), to: Math.max(cur.from, y) }));
      setYearClickPhase(0);
      setDatasetCalOpen(false);
    }
  };

  const dataByPeriod = {
    daily: [
      { label: "00:00", sales: 0, orders: 0, visits: 12, newCust: 0, repeatCust: 0, discount: 0, topProduct: "-" },
      { label: "04:00", sales: 120, orders: 1, visits: 18, newCust: 1, repeatCust: 0, discount: 0, topProduct: "ใบบัวบกแคปซูล" },
      { label: "08:00", sales: 480, orders: 3, visits: 65, newCust: 2, repeatCust: 1, discount: 40, topProduct: "ขมิ้นชันแคปซูล" },
      { label: "12:00", sales: 920, orders: 6, visits: 142, newCust: 3, repeatCust: 3, discount: 80, topProduct: "ฟ้าทะลายโจร" },
      { label: "16:00", sales: 1340, orders: 9, visits: 198, newCust: 4, repeatCust: 5, discount: 120, topProduct: "น้ำผึ้งดอกลำไย" },
      { label: "20:00", sales: 641, orders: 4, visits: 88, newCust: 1, repeatCust: 3, discount: 50, topProduct: "ชาเก๊กฮวยออร์แกนิก" },
    ],
    weekly: [
      { label: "สัปดาห์ที่ 1", sales: 6420, orders: 38, visits: 1180, newCust: 12, repeatCust: 18, discount: 480, topProduct: "ขมิ้นชันแคปซูล" },
      { label: "สัปดาห์ที่ 2", sales: 8950, orders: 54, visits: 1620, newCust: 18, repeatCust: 26, discount: 720, topProduct: "ฟ้าทะลายโจร" },
      { label: "สัปดาห์ที่ 3", sales: 11240, orders: 68, visits: 1985, newCust: 22, repeatCust: 34, discount: 920, topProduct: "น้ำผึ้งดอกลำไย" },
      { label: "สัปดาห์ที่ 4", sales: 9780, orders: 59, visits: 1745, newCust: 19, repeatCust: 30, discount: 810, topProduct: "ชาเก๊กฮวยออร์แกนิก" },
      { label: "สัปดาห์ที่ 5", sales: 4380, orders: 26, visits: 820, newCust: 9, repeatCust: 12, discount: 320, topProduct: "น้ำมันมะพร้าวสกัดเย็น" },
    ],
    monthly: Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const samples: Record<number, any> = {
        1: { sales: 145, orders: 1, visits: 32, newCust: 1, repeatCust: 0, discount: 0, topProduct: "ขมิ้นชันแคปซูล" },
        2: { sales: 320, orders: 2, visits: 65, newCust: 1, repeatCust: 1, discount: 30, topProduct: "ฟ้าทะลายโจร" },
        4: { sales: 180, orders: 1, visits: 48, newCust: 0, repeatCust: 1, discount: 0, topProduct: "ใบบัวบกแคปซูล" },
        5: { sales: 91, orders: 1, visits: 52, newCust: 1, repeatCust: 0, discount: 10, topProduct: "ชาเก๊กฮวยออร์แกนิก" },
      };
      const d = samples[day] ?? { sales: 0, orders: 0, visits: 0, newCust: 0, repeatCust: 0, discount: 0, topProduct: "-" };
      return { label: String(day), ...d };
    }),
    yearly: [
      { label: "2565", sales: 124800, orders: 845, visits: 18420, newCust: 285, repeatCust: 412, discount: 8200, topProduct: "ขมิ้นชันแคปซูล" },
      { label: "2566", sales: 168450, orders: 1124, visits: 24680, newCust: 342, repeatCust: 568, discount: 11200, topProduct: "น้ำผึ้งดอกลำไย" },
      { label: "2567", sales: 215300, orders: 1486, visits: 32150, newCust: 458, repeatCust: 742, discount: 14800, topProduct: "ฟ้าทะลายโจร" },
      { label: "2568", sales: 248920, orders: 1672, visits: 38240, newCust: 524, repeatCust: 868, discount: 17500, topProduct: "ขมิ้นชันแคปซูล" },
      { label: "2569", sales: 86420, orders: 542, visits: 12180, newCust: 184, repeatCust: 268, discount: 5840, topProduct: "ชาเก๊กฮวยออร์แกนิก" },
    ],
    custom: [
      { label: "ธ.ค.", sales: 0, orders: 0, visits: 250, newCust: 0, repeatCust: 0, discount: 0, topProduct: "-" },
      { label: "ม.ค.", sales: 0, orders: 0, visits: 320, newCust: 0, repeatCust: 0, discount: 0, topProduct: "-" },
      { label: "ก.พ.", sales: 0, orders: 0, visits: 410, newCust: 0, repeatCust: 0, discount: 0, topProduct: "-" },
      { label: "มี.ค.", sales: 3680, orders: 15, visits: 680, newCust: 9, repeatCust: 6, discount: 320, topProduct: "ขมิ้นชันแคปซูล" },
      { label: "เม.ย.", sales: 0, orders: 0, visits: 280, newCust: 0, repeatCust: 0, discount: 0, topProduct: "-" },
      { label: "พ.ค.", sales: 641, orders: 4, visits: 195, newCust: 3, repeatCust: 1, discount: 60, topProduct: "ฟ้าทะลายโจร" },
    ],
  };
  const data = dataByPeriod[period];

  const PIE_COLORS = ["#319754", "#46A165", "#7bc290", "#aedab8", "#f7931d", "#fbbf24"];

  // Mock products / customers for the orders popup
  const baseProducts = [
    { name: "ขมิ้นชันแคปซูล", cat: "สมุนไพรแคปซูล", unit: 60 },
    { name: "ฟ้าทะลายโจร", cat: "สมุนไพรแคปซูล", unit: 50 },
    { name: "ชาเก๊กฮวยออร์แกนิก", cat: "ชาสมุนไพร", unit: 60 },
    { name: "น้ำผึ้งดอกลำไย", cat: "ผลิตภัณฑ์ออร์แกนิก", unit: 70 },
    { name: "ใบบัวบกแคปซูล", cat: "สมุนไพรแคปซูล", unit: 60 },
    { name: "น้ำมันมะพร้าวสกัดเย็น", cat: "น้ำมันสมุนไพร", unit: 140 },
    { name: "เห็ดหลินจือสกัด", cat: "สมุนไพรสกัด", unit: 140 },
    { name: "ชาตะไคร้แห้ง", cat: "ชาสมุนไพร", unit: 50 },
    { name: "ขิงผงออร์แกนิก", cat: "ผงสมุนไพร", unit: 80 },
    { name: "สบู่สมุนไพรขมิ้น", cat: "ของใช้ออร์แกนิก", unit: 150 },
  ];
  const baseCustomers = [
    { name: "คุณสมชาย", email: "somchai@email.com" },
    { name: "คุณสมหญิง", email: "somying@email.com" },
    { name: "คุณทานตะวัน", email: "tantawan@email.com" },
    { name: "คุณสายฝน", email: "saifon@email.com" },
    { name: "คุณฟ้าใส", email: "fasai@email.com" },
    { name: "คุณภูเขา", email: "phukao@email.com" },
    { name: "คุณทะเล", email: "talay@email.com" },
    { name: "คุณแม่น้ำ", email: "maenam@email.com" },
  ];
  const productImageMap: Record<string, string> = {
    "ขมิ้นชันแคปซูล": "https://picsum.photos/seed/turmeric-capsule/200",
    "ฟ้าทะลายโจร": "https://picsum.photos/seed/andrographis/200",
    "ชาเก๊กฮวยออร์แกนิก": "https://picsum.photos/seed/chrysanthemum-tea/200",
    "น้ำผึ้งดอกลำไย": "https://picsum.photos/seed/longan-honey/200",
    "ใบบัวบกแคปซูล": "https://picsum.photos/seed/centella/200",
    "น้ำมันมะพร้าวสกัดเย็น": "https://picsum.photos/seed/coconut-oil/200",
    "เห็ดหลินจือสกัด": "https://picsum.photos/seed/lingzhi/200",
    "ชาตะไคร้แห้ง": "https://picsum.photos/seed/lemongrass-tea/200",
    "ขิงผงออร์แกนิก": "https://picsum.photos/seed/ginger-powder/200",
    "สบู่สมุนไพรขมิ้น": "https://picsum.photos/seed/turmeric-soap/200",
  };
  const productThumb = (name: string) =>
    productImageMap[name] ?? `https://picsum.photos/seed/${encodeURIComponent(name)}/200`;

  const labelHash = (s: string) => Array.from(s).reduce((a, ch) => a + ch.charCodeAt(0), 0);

  // Generate deterministic orders for a row that fit the row's totals
  const rowOrders = (row: { label: string; sales: number; orders: number }) => {
    if (row.orders === 0) return [];
    const n = Math.max(1, row.orders);
    const h = labelHash(row.label);
    let remaining = row.sales;
    return Array.from({ length: n }, (_, oi) => {
      const isLast = oi === n - 1;
      const targetTotal = isLast ? remaining : Math.max(60, Math.round(row.sales / n + ((h + oi * 17) % 200) - 100));
      const orderTotal = Math.min(remaining, Math.max(60, targetTotal));
      remaining -= orderTotal;
      const c = baseCustomers[(h + oi * 3) % baseCustomers.length];
      const itemCount = 1 + ((h + oi * 11) % 3); // 1-3 items
      let leftover = orderTotal;
      const items = Array.from({ length: itemCount }, (_, ii) => {
        const p = baseProducts[(h + oi * 13 + ii * 5) % baseProducts.length];
        const isLastItem = ii === itemCount - 1;
        const idealQty = Math.max(1, Math.round((leftover / Math.max(itemCount - ii, 1)) / p.unit));
        const qty = isLastItem ? Math.max(1, Math.round(leftover / p.unit)) : Math.max(1, idealQty);
        const subtotal = qty * p.unit;
        leftover -= subtotal;
        return { name: p.name, category: p.cat, qty, unit: p.unit, subtotal };
      });
      const realTotal = items.reduce((s, x) => s + x.subtotal, 0);
      const orderSeq = String(1 + oi + (h % 90)).padStart(4, "0");
      const orderId = `ORD-${row.label.replace(/[^\w]/g, "")}-${orderSeq}`;
      const time = `${String((h + oi * 3) % 12 + 8).padStart(2, "0")}:${String((h + oi * 7) % 60).padStart(2, "0")}`;
      return { id: orderId, buyer: c.name, buyerEmail: c.email, time, items, total: realTotal };
    });
  };

  const todayRev = 641;
  const monthRev = 641;
  const yearRev = 4282.4;
  const fmt = (n: number) => "฿" + n.toLocaleString(undefined, { maximumFractionDigits: 1 });

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานผลยอดขาย</h2>
        <Popover>
          <PopoverTrigger asChild>
            <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white px-5 py-2 rounded-full cursor-pointer`}>
              <Download className="size-4" />
              ส่งออกรายงาน
              <ChevronDown className="size-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <button onClick={() => console.log("export excel")}
              className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
              <span>Excel (.xlsx)</span>
            </button>
            <button onClick={() => console.log("export pdf")}
              className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileText className="size-4 text-[#dc2626]" />
              <span>PDF (.pdf)</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            {
              label: "รายได้วันนี้", value: fmt(todayRev), change: "+12%", positive: true,
              accent: "#10b981",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
              ),
            },
            {
              label: "รายได้เดือนนี้", value: fmt(monthRev), change: "+8%", positive: true,
              accent: "#6366f1",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              ),
            },
            {
              label: "รายได้ปีนี้", value: fmt(yearRev), change: "+24%", positive: true,
              accent: "#f59e0b",
              icon: (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
              ),
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: `${s.accent}0d`, borderColor: `${s.accent}26` }}>
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>
                  {s.icon}
                </div>
              </div>
              <p className={`${font} text-[28px] mt-3 tracking-tight`} style={{ fontWeight: 700, color: s.accent }}>{s.value}</p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`${font} inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-md`}
                  style={{ backgroundColor: s.positive ? "#dcfce7" : "#fee2e2", color: s.positive ? "#15803d" : "#b91c1c", fontWeight: 600 }}>
                  {s.positive
                    ? <svg width="9" height="9" viewBox="0 0 13 5" fill="none"><path d="M1 4.5L6.5 1L12 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="9" height="9" viewBox="0 0 13 5" fill="none"><path d="M1 0.5L6.5 4L12 0.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  {s.change}
                </span>
                <span className={`${font} text-[11px] text-gray-400`}>เทียบช่วงก่อนหน้า</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
          <div>
            <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>รายงานผลยอดขาย</h3>
            <Popover open={datasetCalOpen} onOpenChange={setDatasetCalOpen}>
              <PopoverTrigger asChild>
                <button
                  className={`${font} text-[12px] text-gray-500 mt-1 inline-flex items-center gap-1.5 hover:text-[#319754] transition-colors cursor-pointer group`}
                  aria-label="เปลี่ยนวันที่"
                >
                  <CalendarIcon className="size-3.5 text-gray-400 group-hover:text-[#319754]" />
                  <span>ข้อมูลของ <span className="underline decoration-dotted underline-offset-2" style={{ fontWeight: 500 }}>{datasetLabel}</span></span>
                  <ChevronDown className="size-3 text-gray-400 group-hover:text-[#319754]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                {(period === "daily" || period === "custom") && (
                  <>
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      selected={period === "daily" ? dailyRange : range}
                      onSelect={period === "daily" ? setDailyRange : setRange}
                      defaultMonth={(period === "daily" ? dailyRange?.from : range?.from) ?? today}
                    />
                    <div className="flex items-center justify-between gap-2 p-3 border-t">
                      <span className={`${font} text-[11px] text-gray-400`}>คลิกเลือกวันเดียว หรือคลิก 2 ครั้งเพื่อเลือกช่วง</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => { period === "daily" ? setDailyRange({ from: today, to: today }) : setRange(undefined); }}
                          className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                        <button onClick={() => setDatasetCalOpen(false)}
                          className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                      </div>
                    </div>
                  </>
                )}

                {period === "weekly" && (
                  <>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => { if (d) { setSelectedDate(d); setDatasetCalOpen(false); } }}
                      defaultMonth={selectedDate}
                    />
                    <div className="flex items-center justify-end gap-2 p-3 border-t">
                      <button onClick={() => { setSelectedDate(today); setDatasetCalOpen(false); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>วันนี้</button>
                    </div>
                  </>
                )}

                {period === "monthly" && (
                  <div className="p-3 w-[280px]">
                    {/* Year nav */}
                    <div className="flex items-center justify-between mb-3">
                      <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year - 1 }))}
                        className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                        <ChevronLeft className="size-4 text-gray-600" />
                      </button>
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ปี {monthRange.year + 543}</span>
                      <button onClick={() => setMonthRange((c) => ({ ...c, year: c.year + 1 }))}
                        className="size-7 rounded-full hover:bg-gray-100 inline-flex items-center justify-center cursor-pointer">
                        <ChevronRight className="size-4 text-gray-600" />
                      </button>
                    </div>
                    {/* Month grid */}
                    <div className="grid grid-cols-3 gap-1.5">
                      {thaiMonthsShort.map((m, i) => {
                        const inRange = i >= Math.min(monthRange.from, monthRange.to) && i <= Math.max(monthRange.from, monthRange.to);
                        const isEdge = i === monthRange.from || i === monthRange.to;
                        return (
                          <button key={m} onClick={() => handleMonthClick(i)}
                            className={`${font} text-[13px] py-2 rounded-lg cursor-pointer transition-colors ${
                              isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"
                            }`}
                            style={{ fontWeight: isEdge ? 600 : 500 }}>
                            {m}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                      <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                      <button onClick={() => { setMonthRange({ from: today.getMonth(), to: today.getMonth(), year: today.getFullYear() }); setMonthClickPhase(0); setDatasetCalOpen(false); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>เดือนนี้</button>
                    </div>
                  </div>
                )}

                {period === "yearly" && (
                  <div className="p-3 w-[200px]">
                    <p className={`${font} text-[11px] text-gray-400 mb-2`}>ย้อนหลังได้ถึง 5 ปี</p>
                    <div className="flex flex-col gap-1">
                      {availableYears.map((y) => {
                        const inRange = y >= Math.min(yearRange.from, yearRange.to) && y <= Math.max(yearRange.from, yearRange.to);
                        const isEdge = y === yearRange.from || y === yearRange.to;
                        return (
                          <button key={y} onClick={() => handleYearClick(y)}
                            className={`${font} text-[13px] py-2 px-3 rounded-lg cursor-pointer transition-colors text-left ${
                              isEdge ? "bg-[#319754] text-white" : inRange ? "bg-[#319754]/15 text-[#319754]" : "hover:bg-gray-100 text-gray-700"
                            }`}
                            style={{ fontWeight: isEdge ? 600 : 500 }}>
                            ปี {y + 543}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t">
                      <span className={`${font} text-[11px] text-gray-400`}>คลิก 2 ครั้งเพื่อเลือกช่วง</span>
                      <button onClick={() => { setYearRange({ from: today.getFullYear(), to: today.getFullYear() }); setYearClickPhase(0); setDatasetCalOpen(false); }}
                        className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ปีนี้</button>
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1 self-start md:self-auto overflow-x-auto max-w-full">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-period-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className={`${font} text-[13px] inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#319754] focus:outline-none focus:border-[#319754] cursor-pointer min-w-[230px]`}>
                  <CalendarIcon className="size-4 text-gray-500" />
                  <span className={range?.from ? "text-[#1a1a1a]" : "text-gray-400"}>{rangeLabel}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  numberOfMonths={2}
                  selected={range}
                  onSelect={setRange}
                  defaultMonth={range?.from}
                />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <button onClick={() => { setRange(undefined); }}
                    className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                  <button onClick={() => setCalendarOpen(false)}
                    className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                </div>
              </PopoverContent>
            </Popover>
            <button className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-5 py-1.5 rounded-full cursor-pointer`}>ค้นหา</button>
          </div>
        )}

        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setProductPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#319754" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#f7931d" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#319754" strokeWidth={2.5} name="ยอดขาย (฿)"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#319754" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f7931d" strokeWidth={2.5} name="จำนวนคำสั่งซื้อ"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#f7931d" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setProductPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#319754" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#f7931d" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar yAxisId="left" dataKey="sales" name="ยอดขาย (฿)" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#319754" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
              <Bar yAxisId="right" dataKey="orders" name="จำนวนคำสั่งซื้อ" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#f7931d" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data.filter((d) => d.sales > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={120}
                dataKey="sales" nameKey="label" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                onClick={(entry: any) => { if (entry?.label) { setFocusedLabel(entry.label); setProductPage(1); } }}>
                {data.filter((d) => d.sales > 0).map((d, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke={d.label === focusedLabel ? "#1a1a1a" : "#fff"}
                    strokeWidth={d.label === focusedLabel ? 3 : 1}
                    fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.4 : 1} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-chart-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Sales Report */}
      {(() => {
        const allProducts = [
          { name: "ขมิ้นชันแคปซูล 60 แคป", sku: "HRB-001", initial: "ขม", bg: "#fef3c7", fg: "#b45309", category: "สมุนไพรแคปซูล", qty: 8, sales: 1420, cost: 640, trend: [4,5,6,5,7,8], stock: 42 },
          { name: "ฟ้าทะลายโจรผง 100 g", sku: "HRB-014", initial: "ฟท", bg: "#dcfce7", fg: "#15803d", category: "ผงสมุนไพร", qty: 5, sales: 1150, cost: 480, trend: [3,4,3,4,5,5], stock: 28 },
          { name: "น้ำมันมะพร้าวสกัดเย็น", sku: "OIL-003", initial: "นม", bg: "#fef9c3", fg: "#a16207", category: "น้ำมันสมุนไพร", qty: 3, sales: 870, cost: 420, trend: [4,3,4,3,3,3], stock: 9 },
          { name: "ชาตะไคร้ใบเตย 30 ซอง", sku: "TEA-007", initial: "ชต", bg: "#ecfccb", fg: "#4d7c0f", category: "ชาสมุนไพร", qty: 2, sales: 580, cost: 240, trend: [4,3,3,2,2,2], stock: 56 },
          { name: "ยาดมสมุนไพร 6 หลอด", sku: "INH-002", initial: "ยด", bg: "#ffe4e6", fg: "#be123c", category: "ของใช้ออร์แกนิก", qty: 1, sales: 262, cost: 110, trend: [2,1,2,1,1,1], stock: 3 },
          { name: "รางจืดแคปซูล 30 แคป", sku: "HRB-022", initial: "รจ", bg: "#f3f4f6", fg: "#525252", category: "สมุนไพรแคปซูล", qty: 0, sales: 0, cost: 0, trend: [0,0,0,0,0,0], stock: 18 },
          { name: "ใบบัวบกแคปซูล 60 แคป", sku: "HRB-005", initial: "บก", bg: "#dcfce7", fg: "#15803d", category: "สมุนไพรแคปซูล", qty: 7, sales: 1280, cost: 560, trend: [3,4,5,6,6,7], stock: 35 },
          { name: "เห็ดหลินจือสกัด 60 แคป", sku: "HRB-009", initial: "หล", bg: "#fef3c7", fg: "#92400e", category: "สมุนไพรสกัด", qty: 4, sales: 980, cost: 420, trend: [2,3,4,3,4,4], stock: 22 },
          { name: "ชาเก๊กฮวยออร์แกนิก 20 ซอง", sku: "TEA-002", initial: "กฮ", bg: "#fef9c3", fg: "#854d0e", category: "ชาสมุนไพร", qty: 6, sales: 760, cost: 320, trend: [3,4,4,5,5,6], stock: 41 },
          { name: "น้ำผึ้งดอกลำไย 250 ml", sku: "HNY-001", initial: "นผ", bg: "#fef3c7", fg: "#a16207", category: "ผลิตภัณฑ์ออร์แกนิก", qty: 3, sales: 645, cost: 280, trend: [2,2,3,3,3,3], stock: 14 },
          { name: "ขิงผงออร์แกนิก 100 g", sku: "PWR-004", initial: "ขผ", bg: "#fef9c3", fg: "#854d0e", category: "ผงสมุนไพร", qty: 4, sales: 520, cost: 220, trend: [2,3,3,4,4,4], stock: 31 },
          { name: "สบู่สมุนไพรขมิ้น", sku: "SOAP-01", initial: "สม", bg: "#fde68a", fg: "#854d0e", category: "ของใช้ออร์แกนิก", qty: 12, sales: 1800, cost: 720, trend: [6,8,9,10,11,12], stock: 67 },
          { name: "บาล์มสมุนไพรไพล", sku: "BLM-001", initial: "บส", bg: "#ffe4e6", fg: "#be123c", category: "ของใช้ออร์แกนิก", qty: 2, sales: 380, cost: 160, trend: [1,2,2,2,2,2], stock: 8 },
          { name: "ชามะรุม 30 ซอง", sku: "TEA-009", initial: "ชม", bg: "#ecfccb", fg: "#4d7c0f", category: "ชาสมุนไพร", qty: 5, sales: 650, cost: 290, trend: [3,3,4,4,5,5], stock: 26 },
          { name: "ขมิ้นชันผง 50 g", sku: "PWR-002", initial: "ขผ", bg: "#fef9c3", fg: "#a16207", category: "ผงสมุนไพร", qty: 3, sales: 420, cost: 180, trend: [2,2,3,3,3,3], stock: 19 },
          { name: "น้ำมันงาขี้ม้อน 250 ml", sku: "OIL-005", initial: "งม", bg: "#fed7aa", fg: "#9a3412", category: "น้ำมันสมุนไพร", qty: 1, sales: 320, cost: 140, trend: [1,1,1,1,1,1], stock: 6 },
          { name: "เก๊กฮวยอบแห้ง 50 g", sku: "HRB-031", initial: "กฮ", bg: "#fef9c3", fg: "#854d0e", category: "สมุนไพร", qty: 4, sales: 480, cost: 200, trend: [2,3,3,4,4,4], stock: 23 },
          { name: "ตะไคร้แห้งบดละเอียด 50 g", sku: "PWR-008", initial: "ตค", bg: "#dcfce7", fg: "#15803d", category: "ผงสมุนไพร", qty: 2, sales: 240, cost: 100, trend: [1,1,2,2,2,2], stock: 17 },
          { name: "ลูกซัด 60 แคป", sku: "HRB-040", initial: "ลซ", bg: "#fef3c7", fg: "#b45309", category: "สมุนไพรแคปซูล", qty: 3, sales: 540, cost: 240, trend: [2,2,3,3,3,3], stock: 11 },
          { name: "เห็ดถั่งเช่า 30 แคป", sku: "HRB-018", initial: "ถช", bg: "#fde68a", fg: "#854d0e", category: "สมุนไพรสกัด", qty: 2, sales: 720, cost: 320, trend: [1,2,2,2,2,2], stock: 4 },
          { name: "หญ้าหวานผง 30 g", sku: "PWR-012", initial: "หว", bg: "#dcfce7", fg: "#15803d", category: "ผงสมุนไพร", qty: 6, sales: 390, cost: 170, trend: [3,4,4,5,5,6], stock: 33 },
          { name: "พริกไทยดำบด 100 g", sku: "PWR-015", initial: "พท", bg: "#f3f4f6", fg: "#525252", category: "ผงสมุนไพร", qty: 5, sales: 320, cost: 140, trend: [3,3,4,4,5,5], stock: 45 },
          { name: "เปลือกมังคุดผง 50 g", sku: "PWR-020", initial: "มค", bg: "#fce7f3", fg: "#9d174d", category: "ผงสมุนไพร", qty: 3, sales: 285, cost: 125, trend: [2,2,2,3,3,3], stock: 21 },
          { name: "ดอกคำฝอย 30 g", sku: "HRB-055", initial: "คฝ", bg: "#fed7aa", fg: "#9a3412", category: "สมุนไพร", qty: 4, sales: 360, cost: 160, trend: [2,3,3,4,4,4], stock: 29 },
        ];

        // Filter products by chart period — base list is "monthly", scale + drop to simulate other periods
        const periodHash = period.length * 13 + (range?.from?.getMonth() ?? new Date().getMonth()) * 5;
        const periodScale = period === "daily" ? 0.35 : period === "weekly" ? 0.7 : period === "yearly" ? 12 : 1;
        const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;
        let periodProducts = allProducts.map((p, i) => {
          const drop = period === "daily" ? (i + periodHash) % 3 === 0 : period === "weekly" ? (i + periodHash) % 5 === 0 : false;
          if (drop || p.qty === 0) return { ...p, qty: 0, sales: 0, cost: 0 };
          return {
            ...p,
            qty: Math.max(1, Math.round(p.qty * periodScale)),
            sales: Math.round(p.sales * periodScale),
            cost: Math.round(p.cost * periodScale),
          };
        }).filter((p) => p.qty > 0);

        // Further narrow when a chart point is focused
        if (focusedLabel) {
          const focusRow = data.find((d) => d.label === focusedLabel);
          const focusOrders = focusRow?.orders ?? 0;
          if (focusOrders === 0) {
            periodProducts = [];
          } else {
            const focusHash = Array.from(focusedLabel).reduce((s, c) => s + c.charCodeAt(0), 0);
            const rotateBy = focusHash % Math.max(periodProducts.length, 1);
            const rotated = [...periodProducts.slice(rotateBy), ...periodProducts.slice(0, rotateBy)];
            const count = Math.min(focusOrders + 2, rotated.length); // a few products per order
            const totalRowSales = focusRow?.sales ?? 0;
            const baseSum = rotated.slice(0, count).reduce((s, p) => s + p.sales, 0) || 1;
            const focusScale = totalRowSales / baseSum;
            periodProducts = rotated.slice(0, count).map((p) => ({
              ...p,
              qty: Math.max(1, Math.round(p.qty * focusScale)),
              sales: Math.max(1, Math.round(p.sales * focusScale)),
              cost: Math.max(1, Math.round(p.cost * focusScale)),
            }));
          }
        }

        const sorted = [...periodProducts].sort((a, b) => {
          switch (productSort) {
            case "sales_desc": return b.sales - a.sales;
            case "sales_asc": return a.sales - b.sales;
            case "qty_desc": return b.qty - a.qty;
            case "margin_desc": {
              const ma = a.sales > 0 ? (a.sales - a.cost) / a.sales : 0;
              const mb = b.sales > 0 ? (b.sales - b.cost) / b.sales : 0;
              return mb - ma;
            }
            case "stock_asc": return a.stock - b.stock;
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / productPerPage));
        const safePage = Math.min(productPage, totalPages);
        const pageStart = (safePage - 1) * productPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + productPerPage);

        const pageTotalQty = pageItems.reduce((s, p) => s + p.qty, 0);
        const pageTotalSales = pageItems.reduce((s, p) => s + p.sales, 0);
        const pageTotalCost = pageItems.reduce((s, p) => s + p.cost, 0);
        const pageTotalProfit = pageTotalSales - pageTotalCost;
        const pageMargin = pageTotalSales > 0 ? (pageTotalProfit / pageTotalSales) * 100 : 0;

        const Sparkline = ({ values }: { values: number[] }) => {
          if (values.every((v) => v === 0)) return <div className="h-6 border-t border-dashed border-gray-300 mt-2.5 w-16 mx-auto" />;
          const min = Math.min(...values), max = Math.max(...values), range = max - min || 1;
          const w = 64, h = 24;
          const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - ((v - min) / range) * h}`).join(" ");
          const trend = values[values.length - 1] - values[0];
          const color = trend > 0 ? "#15803d" : trend < 0 ? "#dc2626" : "#9ca3af";
          return (
            <svg width={w} height={h} className="inline-block">
              <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          );
        };

        const stockColor = (s: number) => s <= 5 ? "#dc2626" : s <= 15 ? "#ea580c" : "#15803d";

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>รายงานการขายสินค้า</h3>
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#f0faf3] text-[#319754]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#319754]" />
                    {periodLabelMap[period]}
                  </span>
                  {focusedLabel && (
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full bg-[#c2410c]" />
                      เฉพาะ {focusedLabel}
                      <button onClick={() => setFocusedLabel(null)} className="ml-0.5 hover:text-[#7c2d12] cursor-pointer">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>
                  แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length} จากทั้งหมด {sorted.length} รายการ
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={productSort} onChange={(e) => setProductSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="sales_desc">เรียง: ยอดขายสูงสุด</option>
                    <option value="sales_asc">เรียง: ยอดขายต่ำสุด</option>
                    <option value="qty_desc">เรียง: จำนวนขายสูงสุด</option>
                    <option value="margin_desc">เรียง: มาร์จิ้นสูงสุด</option>
                    <option value="stock_asc">เรียง: สต็อกน้อยสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "12%" }} />
                  <col style={{ width: "15%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "8%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>สินค้า</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>จำนวนขาย</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ยอดขาย</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ต้นทุน</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>กำไร / มาร์จิ้น</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>เทรนด์ 6 ด.</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>สต็อก</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((p, i) => {
                    const profit = p.sales - p.cost;
                    const margin = p.sales > 0 ? (profit / p.sales) * 100 : 0;
                    const profitDown = margin < 55 && profit > 0;
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={p.name}>{p.name}</p>
                              <p className={`${font} text-[11px] text-gray-400 truncate`}>SKU: {p.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>
                          {p.qty} <span className="text-gray-400 text-[11px]">ชิ้น</span>
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>฿{p.sales.toLocaleString()}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-gray-600`}>฿{p.cost.toLocaleString()}</td>
                        <td className="py-3 pr-3 text-right">
                          <p className={`${font} text-[14px]`} style={{ fontWeight: 700, color: profit > 0 ? (profitDown ? "#dc2626" : "#15803d") : "#9ca3af" }}>
                            ฿{profit.toLocaleString()}
                          </p>
                          <p className={`${font} text-[11px]`} style={{ color: profit > 0 ? (profitDown ? "#dc2626" : "#15803d") : "#9ca3af" }}>
                            {p.sales > 0 ? `${margin.toFixed(1)}%` : "-"}
                          </p>
                        </td>
                        <td className="py-3 pr-3 text-right"><div className="inline-block"><Sparkline values={p.trend} /></div></td>
                        <td className={`py-3 text-right ${font} text-[14px]`} style={{ fontWeight: 700, color: stockColor(p.stock) }}>{p.stock}</td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={7} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบสินค้าที่ตรงกับเงื่อนไข</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td className={`pt-3 pr-3 ${font} text-[12px] truncate`} style={{ fontWeight: 600 }} title={`รวม ${pageItems.length} รายการที่แสดง`}>รวม ({pageItems.length} รายการ)</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700 }}>{pageTotalQty} <span className="text-gray-400 text-[11px]">ชิ้น</span></td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[14px]`} style={{ fontWeight: 700 }}>฿{pageTotalSales.toLocaleString()}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-gray-600`} style={{ fontWeight: 600 }}>฿{pageTotalCost.toLocaleString()}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[14px] text-[#15803d]`} style={{ fontWeight: 700 }}>
                        ฿{pageTotalProfit.toLocaleString()}
                        <span className={`${font} text-[11px] block`} style={{ fontWeight: 500 }}>{pageMargin.toFixed(1)}%</span>
                      </td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={productPerPage} onChange={(e) => { setProductPerPage(Number(e.target.value)); setProductPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setProductPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setProductPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setProductPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}

/* ========== REPORT — CUSTOMERS ========== */
function ReportCustomersTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [custSort, setCustSort] = useState<"total_desc" | "total_asc" | "orders_desc" | "recent" | "oldest">("total_desc");
  const [custPage, setCustPage] = useState(1);
  const [custPerPage, setCustPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const dataByPeriod = {
    daily: [
      { label: "00:00", newCust: 0, repeat: 0 },
      { label: "04:00", newCust: 1, repeat: 0 },
      { label: "08:00", newCust: 2, repeat: 1 },
      { label: "12:00", newCust: 3, repeat: 2 },
      { label: "16:00", newCust: 2, repeat: 1 },
      { label: "20:00", newCust: 3, repeat: 2 },
    ],
    weekly: [
      { label: "สัปดาห์ที่ 1", newCust: 14, repeat: 9 },
      { label: "สัปดาห์ที่ 2", newCust: 22, repeat: 16 },
      { label: "สัปดาห์ที่ 3", newCust: 28, repeat: 21 },
      { label: "สัปดาห์ที่ 4", newCust: 19, repeat: 18 },
      { label: "สัปดาห์ที่ 5", newCust: 8, repeat: 6 },
    ],
    monthly: Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const samples: Record<number, { newCust: number; repeat: number }> = {
        1: { newCust: 1, repeat: 0 }, 2: { newCust: 1, repeat: 1 }, 4: { newCust: 0, repeat: 1 }, 5: { newCust: 1, repeat: 0 },
      };
      return { label: String(day), ...(samples[day] ?? { newCust: 0, repeat: 0 }) };
    }),
    yearly: [
      { label: "2565", newCust: 285, repeat: 412 },
      { label: "2566", newCust: 342, repeat: 568 },
      { label: "2567", newCust: 458, repeat: 742 },
      { label: "2568", newCust: 524, repeat: 868 },
      { label: "2569", newCust: 184, repeat: 268 },
    ],
    custom: [
      { label: "ธ.ค.", newCust: 0, repeat: 0 },
      { label: "ม.ค.", newCust: 0, repeat: 0 },
      { label: "ก.พ.", newCust: 0, repeat: 0 },
      { label: "มี.ค.", newCust: 9, repeat: 5 },
      { label: "เม.ย.", newCust: 0, repeat: 0 },
      { label: "พ.ค.", newCust: 3, repeat: 1 },
    ],
  };
  const data = dataByPeriod[period];

  const PIE_COLORS = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#1e40af", "#6366f1"];

  const newToday = 3;
  const repeatBuyers = 4;
  const avgOrder = 252;
  const repeatRate = 33.33;
  const fmt = (n: number) => n.toLocaleString();

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานข้อมูลลูกค้า</h2>
        <Popover>
          <PopoverTrigger asChild>
            <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-2 rounded-full cursor-pointer`}>
              <Download className="size-4" />
              ส่งออกรายงาน
              <ChevronDown className="size-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <button onClick={() => console.log("export excel")}
              className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
              <span>Excel (.xlsx)</span>
            </button>
            <button onClick={() => console.log("export pdf")}
              className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileText className="size-4 text-[#dc2626]" />
              <span>PDF (.pdf)</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              key: "new" as const, label: "ลูกค้าใหม่วันนี้", value: fmt(newToday), suffix: "คน", change: "+12%",
              accent: "#3b82f6",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
            },
            {
              key: "repeat" as const, label: "ลูกค้าซื้อซ้ำ", value: fmt(repeatBuyers), suffix: "คน", change: "+8%",
              accent: "#6366f1",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>,
            },
            {
              key: "highAov" as const, label: "มูลค่าเฉลี่ย/ออเดอร์", value: `฿${fmt(avgOrder)}`, suffix: "", change: "+5%",
              accent: "#10b981",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
            },
            {
              key: "retention" as const, label: "อัตราซื้อซ้ำ", value: `${repeatRate}%`, suffix: "", change: "+3%",
              accent: "#f59e0b",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: `${s.accent}0d`, borderColor: `${s.accent}26` }}>
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>{s.icon}</div>
              </div>
              <p className={`${font} text-[26px] mt-3 tracking-tight`} style={{ fontWeight: 700, color: s.accent }}>
                {s.value}{s.suffix && <span className="text-[14px] text-gray-400 ml-1" style={{ fontWeight: 500 }}>{s.suffix}</span>}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`${font} inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-md`}
                  style={{ backgroundColor: "#dcfce7", color: "#15803d", fontWeight: 600 }}>
                  <svg width="9" height="9" viewBox="0 0 13 5" fill="none"><path d="M1 4.5L6.5 1L12 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {s.change}
                </span>
                <span className={`${font} text-[11px] text-gray-400`}>เทียบช่วงก่อนหน้า</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>รายงานข้อมูลลูกค้า</h3>
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1 self-start md:self-auto overflow-x-auto max-w-full">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-cust-period-bg" className="absolute inset-0 bg-[#3b82f6] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className={`${font} text-[13px] inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#3b82f6] focus:outline-none focus:border-[#3b82f6] cursor-pointer min-w-[230px]`}>
                  <CalendarIcon className="size-4 text-gray-500" />
                  <span className={range?.from ? "text-[#1a1a1a]" : "text-gray-400"}>{rangeLabel}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} defaultMonth={range?.from} />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <button onClick={() => setRange(undefined)} className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                  <button onClick={() => setCalendarOpen(false)} className={`${font} text-[13px] bg-[#3b82f6] hover:bg-[#2563eb] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                </div>
              </PopoverContent>
            </Popover>
            <button className={`${font} text-[13px] bg-[#3b82f6] hover:bg-[#2563eb] text-white px-5 py-1.5 rounded-full cursor-pointer`}>ค้นหา</button>
          </div>
        )}

        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setCustPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#3b82f6" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="newCust" stroke="#3b82f6" strokeWidth={2.5} name="ลูกค้าใหม่ (คน)"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#3b82f6" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
              <Line type="monotone" dataKey="repeat" stroke="#6366f1" strokeWidth={2.5} name="ซื้อซ้ำ (คน)"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#6366f1" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setCustPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#3b82f6" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar dataKey="newCust" name="ลูกค้าใหม่ (คน)" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#3b82f6" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
              <Bar dataKey="repeat" name="ซื้อซ้ำ (คน)" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#6366f1" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data.filter((d) => d.newCust > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={120}
                dataKey="newCust" nameKey="label" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                onClick={(entry: any) => { if (entry?.label) { setFocusedLabel(entry.label); setCustPage(1); } }}>
                {data.filter((d) => d.newCust > 0).map((d, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke={d.label === focusedLabel ? "#1a1a1a" : "#fff"}
                    strokeWidth={d.label === focusedLabel ? 3 : 1}
                    fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.4 : 1} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-cust-chart-bg" className="absolute inset-0 bg-[#3b82f6] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      {(() => {
        const baseCustomers = [
          { id: "CST-001", email: "somchai.j@gmail.com", name: "สมชาย ใจดี", group: "VIP", initial: "สม", bg: "#fef3c7", fg: "#b45309", orders: 5, total: 1420, lastBuy: "2 พ.ค.", daysAgo: 2, fav: "ขมิ้นชัน" },
          { id: "CST-007", email: "malee.s@hotmail.com", name: "มาลี สดใส", group: "VIP", initial: "มล", bg: "#fde68a", fg: "#854d0e", orders: 4, total: 980, lastBuy: "28 เม.ย.", daysAgo: 6, fav: "ฟ้าทะลายโจร" },
          { id: "CST-003", email: "warapron.t@gmail.com", name: "วราภรณ์ ทองดี", group: "ประจำ", initial: "วร", bg: "#dcfce7", fg: "#15803d", orders: 3, total: 720, lastBuy: "25 เม.ย.", daysAgo: 9, fav: "น้ำมันมะพร้าว" },
          { id: "CST-012", email: "preeya.k@gmail.com", name: "ปรียา แก้วใส", group: "ใหม่", initial: "ปร", bg: "#dbeafe", fg: "#1e40af", orders: 1, total: 580, lastBuy: "3 พ.ค.", daysAgo: 1, fav: "ชาตะไคร้" },
          { id: "CST-002", email: "adithep.p@yahoo.com", name: "อดิเทพ พงษ์เพชร", group: "เสี่ยงหาย", initial: "อด", bg: "#fee2e2", fg: "#b91c1c", orders: 2, total: 420, lastBuy: "95 วันที่แล้ว", daysAgo: 95, fav: "ยาดมสมุนไพร" },
          { id: "CST-011", email: "naphaporn.d@gmail.com", name: "นภาพร ดวงดี", group: "ใหม่", initial: "นภ", bg: "#dbeafe", fg: "#1e40af", orders: 1, total: 162, lastBuy: "4 พ.ค.", daysAgo: 0, fav: "รางจืด" },
          { id: "CST-005", email: "pichaya.r@hotmail.com", name: "พิชญา รุ่งเรือง", group: "ประจำ", initial: "พช", bg: "#dcfce7", fg: "#15803d", orders: 3, total: 540, lastBuy: "1 พ.ค.", daysAgo: 3, fav: "ใบบัวบก" },
          { id: "CST-008", email: "thanaphol.s@gmail.com", name: "ธนพล ศรีสุข", group: "VIP", initial: "ธน", bg: "#fef3c7", fg: "#b45309", orders: 4, total: 880, lastBuy: "29 เม.ย.", daysAgo: 5, fav: "เห็ดหลินจือ" },
          { id: "CST-014", email: "sudarat.m@gmail.com", name: "สุดารัตน์ มีโชค", group: "ใหม่", initial: "สด", bg: "#dbeafe", fg: "#1e40af", orders: 1, total: 280, lastBuy: "2 พ.ค.", daysAgo: 2, fav: "น้ำผึ้งดอกลำไย" },
          { id: "CST-006", email: "kitti.p@yahoo.com", name: "กิตติ ภักดี", group: "เสี่ยงหาย", initial: "กต", bg: "#fee2e2", fg: "#b91c1c", orders: 2, total: 380, lastBuy: "75 วันที่แล้ว", daysAgo: 75, fav: "สบู่สมุนไพร" },
          { id: "CST-009", email: "wanwipa.j@hotmail.com", name: "วรรณวิภา จงเจริญ", group: "หายไป", initial: "วว", bg: "#f3f4f6", fg: "#525252", orders: 1, total: 180, lastBuy: "120 วันที่แล้ว", daysAgo: 120, fav: "ขิงผง" },
          { id: "CST-010", email: "phuri.t@gmail.com", name: "ภูริ ทองเนื้อเก้า", group: "ประจำ", initial: "ภร", bg: "#dcfce7", fg: "#15803d", orders: 3, total: 620, lastBuy: "30 เม.ย.", daysAgo: 4, fav: "บาล์มไพล" },
        ];

        // Filter customers by chart period — base list is "monthly", scale + drop to simulate other periods
        const periodHash = period.length * 13 + (range?.from?.getMonth() ?? new Date().getMonth()) * 5;
        const periodScale = period === "daily" ? 0.35 : period === "weekly" ? 0.7 : period === "yearly" ? 12 : 1;
        const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;
        let working = baseCustomers.map((c, i) => {
          const drop = period === "daily" ? (i + periodHash) % 3 === 0 : period === "weekly" ? (i + periodHash) % 5 === 0 : false;
          if (drop) return { ...c, orders: 0, total: 0 };
          return {
            ...c,
            orders: Math.max(1, Math.round(c.orders * periodScale)),
            total: Math.max(1, Math.round(c.total * periodScale)),
          };
        }).filter((c) => c.orders > 0);

        // Further narrow by chart focus
        if (focusedLabel) {
          const focusedRow = data.find((d) => d.label === focusedLabel);
          const totalCust = focusedRow ? focusedRow.newCust + focusedRow.repeat : 0;
          if (totalCust === 0) working = [];
          else {
            const hash = Array.from(focusedLabel).reduce((s, ch) => s + ch.charCodeAt(0), 0);
            const rotateBy = hash % Math.max(working.length, 1);
            working = [...working.slice(rotateBy), ...working.slice(0, rotateBy)]
              .slice(0, Math.min(totalCust, working.length))
              .map((c, i) => ({
                ...c,
                orders: Math.max(1, Math.round(c.orders * (1 - i * 0.08))),
                total: Math.max(1, Math.round(c.total * (0.4 + (((hash + i) % 60) / 100)))),
              }));
          }
        }

        const sorted = [...working].sort((a, b) => {
          switch (custSort) {
            case "total_desc": return b.total - a.total;
            case "total_asc": return a.total - b.total;
            case "orders_desc": return b.orders - a.orders;
            case "recent": return a.daysAgo - b.daysAgo;
            case "oldest": return b.daysAgo - a.daysAgo;
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / custPerPage));
        const safePage = Math.min(custPage, totalPages);
        const pageStart = (safePage - 1) * custPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + custPerPage);

        const pageOrders = pageItems.reduce((s, c) => s + c.orders, 0);
        const pageTotal = pageItems.reduce((s, c) => s + c.total, 0);
        const pageAovAvg = pageOrders > 0 ? Math.round(pageTotal / pageOrders) : 0;

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>ลูกค้าที่มียอดซื้อสูงสุด</h3>
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#eff6ff] text-[#1e40af]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#3b82f6]" />
                    {periodLabelMap[period]}
                  </span>
                  {focusedLabel && (
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full bg-[#c2410c]" />
                      เฉพาะ {focusedLabel}
                      <button onClick={() => setFocusedLabel(null)} className="ml-0.5 hover:text-[#7c2d12] cursor-pointer">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>
                  แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length} จาก {sorted.length} คน
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={custSort} onChange={(e) => setCustSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#3b82f6]`}>
                    <option value="total_desc">เรียง: ยอดซื้อรวม</option>
                    <option value="total_asc">เรียง: ยอดซื้อต่ำสุด</option>
                    <option value="orders_desc">เรียง: ออเดอร์มากสุด</option>
                    <option value="recent">เรียง: ซื้อล่าสุด</option>
                    <option value="oldest">เรียง: ห่างจากซื้อ</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "7%" }} />
                  <col style={{ width: "25%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "11%" }} />
                  <col style={{ width: "14%" }} />
                  <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-2" style={{ fontWeight: 500 }}>#</th>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>ลูกค้า</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ออเดอร์</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ยอดรวม</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>AOV</th>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>ซื้อล่าสุด</th>
                    <th className="text-left pb-3" style={{ fontWeight: 500 }}>สินค้าที่ชอบ</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c, i) => {
                    const aov = c.orders > 0 ? Math.round(c.total / c.orders) : 0;
                    const stale = c.daysAgo > 30;
                    const rank = pageStart + i;
                    const rankBg = rank === 0 ? "#facc15" : rank === 1 ? "#94a3b8" : rank === 2 ? "#f97316" : "transparent";
                    const rankFg = rank < 3 ? "white" : "#9ca3af";
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font}`}
                            style={{ backgroundColor: rankBg, color: rankFg, fontWeight: 600 }}>
                            {rank + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-3 min-w-0">
                          <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={c.name}>{c.name}</p>
                          <p className={`${font} text-[11px] text-gray-400 truncate`} title={c.email}>{c.email}</p>
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{c.orders}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>฿{c.total.toLocaleString()}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-gray-600`}>฿{aov.toLocaleString()}</td>
                        <td className={`py-3 pr-3 ${font} text-[12px] truncate`} style={{ color: stale ? "#dc2626" : "#374151", fontWeight: stale ? 600 : 400 }} title={c.lastBuy}>{c.lastBuy}</td>
                        <td className={`py-3 ${font} text-[12px] text-[#1a1a1a] truncate`} title={c.fav}>{c.fav}</td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={7} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบลูกค้าที่ตรงกับเงื่อนไข</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td />
                      <td className={`pt-3 pr-3 ${font} text-[12px] truncate`} style={{ fontWeight: 600 }}>รวม ({pageItems.length} คนที่แสดง)</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700 }}>{pageOrders}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[14px]`} style={{ fontWeight: 700 }}>฿{pageTotal.toLocaleString()}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-gray-700`} style={{ fontWeight: 700 }}>฿{pageAovAvg.toLocaleString()}</td>
                      <td colSpan={2} />
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={custPerPage} onChange={(e) => { setCustPerPage(Number(e.target.value)); setCustPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#3b82f6]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>คนต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setCustPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setCustPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#3b82f6] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setCustPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ========== REPORT — PRODUCTS ========== */
function ReportProductsTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [productSort, setProductSort] = useState<"sold_desc" | "sold_asc" | "revenue_desc">("sold_desc");
  const [productPage, setProductPage] = useState(1);
  const [productPerPage, setProductPerPage] = useState(50);
  const [ratingSort, setRatingSort] = useState<"rating_desc" | "rating_asc" | "reviews_desc">("rating_desc");
  const [ratingPage, setRatingPage] = useState(1);
  const [ratingPerPage, setRatingPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const dataByPeriod = {
    daily: [
      { label: "00:00", units: 0 },
      { label: "04:00", units: 2 },
      { label: "08:00", units: 8 },
      { label: "12:00", units: 14 },
      { label: "16:00", units: 22 },
      { label: "20:00", units: 11 },
    ],
    weekly: [
      { label: "สัปดาห์ที่ 1", units: 42 },
      { label: "สัปดาห์ที่ 2", units: 68 },
      { label: "สัปดาห์ที่ 3", units: 95 },
      { label: "สัปดาห์ที่ 4", units: 81 },
      { label: "สัปดาห์ที่ 5", units: 28 },
    ],
    monthly: Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const samples: Record<number, number> = { 1: 2, 2: 5, 4: 3, 5: 1 };
      return { label: String(day), units: samples[day] ?? 0 };
    }),
    yearly: [
      { label: "2565", units: 685 },
      { label: "2566", units: 924 },
      { label: "2567", units: 1248 },
      { label: "2568", units: 1492 },
      { label: "2569", units: 542 },
    ],
    custom: [
      { label: "ธ.ค.", units: 0 },
      { label: "ม.ค.", units: 0 },
      { label: "ก.พ.", units: 0 },
      { label: "มี.ค.", units: 36 },
      { label: "เม.ย.", units: 0 },
      { label: "พ.ค.", units: 6 },
    ],
  };
  const data = dataByPeriod[period];

  const PIE_COLORS = ["#319754", "#46A165", "#7bc290", "#aedab8", "#10b981", "#34d399"];

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานข้อมูลสินค้า</h2>
        <Popover>
          <PopoverTrigger asChild>
            <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#319754] hover:bg-[#287745] text-white px-5 py-2 rounded-full cursor-pointer`}>
              <Download className="size-4" />
              ส่งออกรายงาน
              <ChevronDown className="size-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
              <span>Excel (.xlsx)</span>
            </button>
            <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileText className="size-4 text-[#dc2626]" />
              <span>PDF (.pdf)</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "สินค้าขายดี", value: "พิมเสนน้ำอโรมา", subValue: "ตราเมต้าเฮิร์บ",
              accent: "#319754",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#319754" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 010-5H6"/><path d="M18 9h1.5a2.5 2.5 0 000-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0012 0V2z"/></svg>,
            },
            {
              label: "สต็อกต่ำ", value: "4", subValue: "รายการ",
              accent: "#dc2626",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
            },
            {
              label: "หมวดหมู่ยอดนิยม", value: "ผลิตภัณฑ์สมุนไพร", subValue: "8 หมวด",
              accent: "#6366f1",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
            },
            {
              label: "รีวิวเฉลี่ย", value: "5.0", subValue: "★★★★★",
              accent: "#f59e0b",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: `${s.accent}0d`, borderColor: `${s.accent}26` }}>
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>{s.icon}</div>
              </div>
              <p className={`${font} text-[20px] mt-3 tracking-tight truncate`} style={{ fontWeight: 700, color: s.accent }} title={s.value}>{s.value}</p>
              <p className={`${font} text-[11px] text-gray-400 mt-1 truncate`}>{s.subValue}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>รายงานข้อมูลสินค้า</h3>
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1 self-start md:self-auto overflow-x-auto max-w-full">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-prod-period-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className={`${font} text-[13px] inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#319754] focus:outline-none focus:border-[#319754] cursor-pointer min-w-[230px]`}>
                  <CalendarIcon className="size-4 text-gray-500" />
                  <span className={range?.from ? "text-[#1a1a1a]" : "text-gray-400"}>{rangeLabel}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} defaultMonth={range?.from} />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <button onClick={() => setRange(undefined)} className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                  <button onClick={() => setCalendarOpen(false)} className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                </div>
              </PopoverContent>
            </Popover>
            <button className={`${font} text-[13px] bg-[#319754] hover:bg-[#287745] text-white px-5 py-1.5 rounded-full cursor-pointer`}>ค้นหา</button>
          </div>
        )}

        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setProductPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#319754" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Line type="monotone" dataKey="units" stroke="#319754" strokeWidth={2.5} name="จำนวนสินค้าที่ขายได้ (ชิ้น)"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#319754" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setProductPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#319754" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar dataKey="units" name="จำนวนสินค้าที่ขายได้ (ชิ้น)" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#319754" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data.filter((d) => d.units > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={120}
                dataKey="units" nameKey="label" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                onClick={(entry: any) => { if (entry?.label) { setFocusedLabel(entry.label); setProductPage(1); } }}>
                {data.filter((d) => d.units > 0).map((d, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke={d.label === focusedLabel ? "#1a1a1a" : "#fff"}
                    strokeWidth={d.label === focusedLabel ? 3 : 1}
                    fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.4 : 1} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-prod-chart-bg" className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Product + Rating Product (side-by-side) */}
      {(() => {
        const baseProducts = [
          { name: "พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ", category: "ผลิตภัณฑ์สมุนไพร", sold: 16, revenue: 1122 },
          { name: "ถุงหอมอโรมา MetaHerb Bloom Essence", category: "เครื่องหอม & อโรม่า", sold: 11, revenue: 1069.2 },
          { name: "กาแฟดริป signature อเมริกาโนเย็น", category: "อาหารและเครื่องดื่ม", sold: 5, revenue: 850 },
          { name: "ขมิ้นชันแคปซูล 60 แคป", category: "สมุนไพรแคปซูล", sold: 8, revenue: 1420 },
          { name: "ฟ้าทะลายโจรผง 100 g", category: "ผงสมุนไพร", sold: 5, revenue: 1150 },
          { name: "น้ำมันมะพร้าวสกัดเย็น", category: "น้ำมันสมุนไพร", sold: 3, revenue: 870 },
          { name: "ชาตะไคร้ใบเตย 30 ซอง", category: "ชาสมุนไพร", sold: 2, revenue: 580 },
          { name: "ใบบัวบกแคปซูล 60 แคป", category: "สมุนไพรแคปซูล", sold: 7, revenue: 1280 },
          { name: "เห็ดหลินจือสกัด 60 แคป", category: "สมุนไพรสกัด", sold: 4, revenue: 980 },
          { name: "ชาเก๊กฮวยออร์แกนิก 20 ซอง", category: "ชาสมุนไพร", sold: 6, revenue: 760 },
          { name: "น้ำผึ้งดอกลำไย 250 ml", category: "ผลิตภัณฑ์ออร์แกนิก", sold: 3, revenue: 645 },
          { name: "ขิงผงออร์แกนิก 100 g", category: "ผงสมุนไพร", sold: 4, revenue: 520 },
          { name: "สบู่สมุนไพรขมิ้น", category: "ของใช้ออร์แกนิก", sold: 12, revenue: 1800 },
          { name: "บาล์มสมุนไพรไพล", category: "ของใช้ออร์แกนิก", sold: 2, revenue: 380 },
          { name: "ชามะรุม 30 ซอง", category: "ชาสมุนไพร", sold: 5, revenue: 650 },
        ];

        // Period filtering
        const periodHash = period.length * 13 + (range?.from?.getMonth() ?? new Date().getMonth()) * 5;
        const periodScale = period === "daily" ? 0.35 : period === "weekly" ? 0.7 : period === "yearly" ? 12 : 1;
        let working = baseProducts.map((p, i) => {
          const drop = period === "daily" ? (i + periodHash) % 3 === 0 : period === "weekly" ? (i + periodHash) % 5 === 0 : false;
          if (drop) return { ...p, sold: 0, revenue: 0 };
          return {
            ...p,
            sold: Math.max(1, Math.round(p.sold * periodScale)),
            revenue: Math.round(p.revenue * periodScale),
          };
        }).filter((p) => p.sold > 0);

        // Narrow by chart focus
        if (focusedLabel) {
          const focusRow = data.find((d) => d.label === focusedLabel);
          const focusUnits = focusRow?.units ?? 0;
          if (focusUnits === 0) working = [];
          else {
            const focusHash = Array.from(focusedLabel).reduce((s, ch) => s + ch.charCodeAt(0), 0);
            const rotateBy = focusHash % Math.max(working.length, 1);
            const rotated = [...working.slice(rotateBy), ...working.slice(0, rotateBy)];
            const count = Math.min(Math.max(3, Math.ceil(focusUnits / 2)), rotated.length);
            working = rotated.slice(0, count).map((p, i) => ({
              ...p,
              sold: Math.max(1, Math.round(p.sold * (1 - i * 0.1))),
              revenue: Math.max(1, Math.round(p.revenue * (0.5 + (((focusHash + i) % 50) / 100)))),
            }));
          }
        }

        const sorted = [...working].sort((a, b) => {
          switch (productSort) {
            case "sold_desc": return b.sold - a.sold;
            case "sold_asc": return a.sold - b.sold;
            case "revenue_desc": return b.revenue - a.revenue;
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / productPerPage));
        const safePage = Math.min(productPage, totalPages);
        const pageStart = (safePage - 1) * productPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + productPerPage);
        const maxSold = pageItems.length > 0 ? Math.max(...pageItems.map((p) => p.sold)) : 1;

        const pageTotalSold = pageItems.reduce((s, p) => s + p.sold, 0);
        const pageTotalRevenue = pageItems.reduce((s, p) => s + p.revenue, 0);

        const rankColor = (i: number) => i === 0 ? "#facc15" : i === 1 ? "#94a3b8" : i === 2 ? "#f97316" : "transparent";
        const rankText = (i: number) => i < 3 ? "white" : "#9ca3af";

        // Build rating data (deterministic per product name)
        const hashStr = (s: string) => { let h = 0; for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
        const ratingData = baseProducts.map((p) => {
          const h = hashStr(p.name);
          // Rating: 3.5 - 5.0 in 0.1 steps (favoring 4.0-5.0 for realism)
          const ratingRaw = 3.5 + ((h >>> 3) % 16) * 0.1; // 3.5 to 5.0
          const rating = Math.round(ratingRaw * 10) / 10;
          const reviews = 5 + ((h >>> 5) % 248); // 5 - 252 reviews
          const trendPct = (((h >>> 7) % 30) - 12); // -12 to +17
          return { name: p.name, category: p.category, rating, reviews, trend: trendPct };
        });
        const ratingSorted = [...ratingData].sort((a, b) => {
          switch (ratingSort) {
            case "rating_desc": return b.rating - a.rating || b.reviews - a.reviews;
            case "rating_asc": return a.rating - b.rating || b.reviews - a.reviews;
            case "reviews_desc": return b.reviews - a.reviews;
          }
        });
        const avgRating = (ratingData.reduce((s, p) => s + p.rating, 0) / ratingData.length).toFixed(2);
        const totalReviews = ratingData.reduce((s, p) => s + p.reviews, 0);
        // Pagination for rating table
        const ratingTotalPages = Math.max(1, Math.ceil(ratingSorted.length / ratingPerPage));
        const ratingSafePage = Math.min(ratingPage, ratingTotalPages);
        const ratingPageStart = (ratingSafePage - 1) * ratingPerPage;
        const ratingTop = ratingSorted.slice(ratingPageStart, ratingPageStart + ratingPerPage);

        return (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>Top Product</h3>
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#f0faf3] text-[#319754]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#319754]" />
                    {periodLabelMap[period]}
                  </span>
                  {focusedLabel && (
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full bg-[#c2410c]" />
                      เฉพาะ {focusedLabel}
                      <button onClick={() => setFocusedLabel(null)} className="ml-0.5 hover:text-[#7c2d12] cursor-pointer">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>
                  สินค้าทั้งหมด {sorted.length} รายการ · แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={productSort} onChange={(e) => setProductSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="sold_desc">เรียง: ยอดขายสูงสุด</option>
                    <option value="sold_asc">เรียง: ยอดขายต่ำสุด</option>
                    <option value="revenue_desc">เรียง: รายได้สูงสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "44%" }} />
                  <col style={{ width: "26%" }} />
                  <col style={{ width: "22%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-2" style={{ fontWeight: 500 }}>#</th>
                    <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>สินค้า</th>
                    <th className="text-right pb-3 pr-4" style={{ fontWeight: 500 }}>ยอดขาย (ชิ้น)</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>รายได้ (฿)</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((p, i) => {
                    const rank = pageStart + i;
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font}`}
                            style={{ backgroundColor: rankColor(rank), color: rankText(rank), fontWeight: 600 }}>
                            {rank + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={p.name}>{p.name}</p>
                              <p className={`${font} text-[11px] text-gray-400 truncate`}>{p.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-[#319754] rounded-full" style={{ width: `${(p.sold / maxSold) * 100}%` }} />
                            </div>
                            <span className={`${font} text-[14px] w-8 text-right`}>{p.sold.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className={`py-3 text-right ${font} text-[14px]`} style={{ fontWeight: 600 }}>{p.revenue.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={4} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบข้อมูลสินค้า</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td />
                      <td className={`pt-3 pr-4 ${font} text-[13px]`} style={{ fontWeight: 600 }}>รวม ({pageItems.length} รายการที่แสดง)</td>
                      <td className={`pt-3 pr-4 text-right ${font} text-[14px]`} style={{ fontWeight: 700 }}>{pageTotalSold.toLocaleString()}</td>
                      <td className={`pt-3 text-right ${font} text-[14px] text-[#319754]`} style={{ fontWeight: 700 }}>{pageTotalRevenue.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={productPerPage} onChange={(e) => { setProductPerPage(Number(e.target.value)); setProductPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setProductPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setProductPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setProductPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>

          {/* Rating Product card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>Rating Product</h3>
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#f59e0b]" />
                    เฉลี่ย {avgRating} ★
                  </span>
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>
                  สินค้าทั้งหมด {ratingSorted.length} รายการ · แสดง {ratingSorted.length === 0 ? 0 : ratingPageStart + 1}–{ratingPageStart + ratingTop.length} · รีวิวรวม {totalReviews.toLocaleString()} ครั้ง
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={ratingSort} onChange={(e) => setRatingSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    <option value="rating_desc">เรียง: คะแนนสูงสุด</option>
                    <option value="rating_asc">เรียง: คะแนนต่ำสุด</option>
                    <option value="reviews_desc">เรียง: รีวิวมากสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "44%" }} />
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "18%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-2" style={{ fontWeight: 500 }}>#</th>
                    <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>สินค้า</th>
                    <th className="text-left pb-3 pr-4" style={{ fontWeight: 500 }}>คะแนน</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>รีวิว</th>
                  </tr>
                </thead>
                <tbody>
                  {ratingTop.map((p, i) => {
                    const rank = ratingPageStart + i;
                    const rankBg = rank === 0 ? "#facc15" : rank === 1 ? "#94a3b8" : rank === 2 ? "#f97316" : "transparent";
                    const rankText = rank < 3 ? "white" : "#9ca3af";
                    const stars = Math.round(p.rating);
                    return (
                      <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-2">
                          <span className={`inline-flex items-center justify-center size-7 rounded-full text-[12px] ${font}`}
                            style={{ backgroundColor: rankBg, color: rankText, fontWeight: 600 }}>
                            {rank + 1}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                              <ImageWithFallback src={`https://picsum.photos/seed/${encodeURIComponent(p.name)}/120`} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={p.name}>{p.name}</p>
                              <p className={`${font} text-[11px] text-gray-400 truncate`}>{p.category}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {Array.from({ length: 5 }).map((_, j) => (
                                <svg key={j} className="size-[12px] shrink-0" viewBox="0 0 24 24" fill={j < stars ? "#f59e0b" : "#e5e7eb"}>
                                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                </svg>
                              ))}
                            </div>
                            <span className={`${font} text-[13px] text-[#c2410c] tabular-nums`} style={{ fontWeight: 600 }}>{p.rating.toFixed(1)}</span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`${font} text-[13px] text-gray-700 tabular-nums`} style={{ fontWeight: 500 }}>{p.reviews.toLocaleString()}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-100">
                    <td />
                    <td className={`pt-3 pr-4 ${font} text-[13px]`} style={{ fontWeight: 600 }}>คะแนนเฉลี่ยทั้งร้าน</td>
                    <td className="pt-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, j) => (
                            <svg key={j} className="size-[12px] shrink-0" viewBox="0 0 24 24" fill={j < Math.round(parseFloat(avgRating)) ? "#f59e0b" : "#e5e7eb"}>
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                        <span className={`${font} text-[14px] text-[#c2410c] tabular-nums`} style={{ fontWeight: 700 }}>{avgRating}</span>
                      </div>
                    </td>
                    <td className={`pt-3 text-right ${font} text-[14px] tabular-nums`} style={{ fontWeight: 700 }}>{totalReviews.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={ratingPerPage} onChange={(e) => { setRatingPerPage(Number(e.target.value)); setRatingPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#319754]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>รายการต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={ratingSafePage === 1} onClick={() => setRatingPage(ratingSafePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${ratingSafePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: ratingTotalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setRatingPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${ratingSafePage === p ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: ratingSafePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={ratingSafePage === ratingTotalPages} onClick={() => setRatingPage(ratingSafePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${ratingSafePage === ratingTotalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

/* ========== REPORT — MARKET ========== */
function ReportMarketTab() {
  const [chartType, setChartType] = useState<"line" | "bar" | "pie">("line");
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly" | "yearly" | "custom">("daily");
  const [focusedLabel, setFocusedLabel] = useState<string | null>(null);
  const [chSort, setChSort] = useState<"revenue_desc" | "visits_desc" | "conv_desc" | "roas_desc">("revenue_desc");
  const [chPage, setChPage] = useState(1);
  const [chPerPage, setChPerPage] = useState(10);
  const today = new Date();
  const [range, setRange] = useState<DateRange | undefined>({ from: today, to: today });
  const [calendarOpen, setCalendarOpen] = useState(false);
  const fmtDate = (d?: Date) => d ? `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear() + 543}` : "";
  const rangeLabel = range?.from
    ? range.to && range.to.getTime() !== range.from.getTime()
      ? `${fmtDate(range.from)} - ${fmtDate(range.to)}`
      : fmtDate(range.from)
    : "เลือกช่วงวันที่";

  const dataByPeriod = {
    daily: [
      { label: "00:00", visits: 18, orders: 0 },
      { label: "04:00", visits: 32, orders: 1 },
      { label: "08:00", visits: 145, orders: 6 },
      { label: "12:00", visits: 280, orders: 14 },
      { label: "16:00", visits: 410, orders: 22 },
      { label: "20:00", visits: 195, orders: 9 },
    ],
    weekly: [
      { label: "สัปดาห์ที่ 1", visits: 4280, orders: 145 },
      { label: "สัปดาห์ที่ 2", visits: 5640, orders: 198 },
      { label: "สัปดาห์ที่ 3", visits: 6920, orders: 248 },
      { label: "สัปดาห์ที่ 4", visits: 5980, orders: 215 },
      { label: "สัปดาห์ที่ 5", visits: 2410, orders: 88 },
    ],
    monthly: Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      const samples: Record<number, { visits: number; orders: number }> = {
        1: { visits: 145, orders: 5 }, 2: { visits: 280, orders: 9 }, 3: { visits: 95, orders: 2 },
        4: { visits: 320, orders: 11 }, 5: { visits: 240, orders: 8 },
      };
      return { label: String(day), ...(samples[day] ?? { visits: 0, orders: 0 }) };
    }),
    yearly: [
      { label: "2565", visits: 24580, orders: 845 },
      { label: "2566", visits: 32420, orders: 1124 },
      { label: "2567", visits: 41680, orders: 1486 },
      { label: "2568", visits: 48920, orders: 1672 },
      { label: "2569", visits: 14180, orders: 542 },
    ],
    custom: [
      { label: "ธ.ค.", visits: 1520, orders: 0 },
      { label: "ม.ค.", visits: 1820, orders: 0 },
      { label: "ก.พ.", visits: 2410, orders: 0 },
      { label: "มี.ค.", visits: 4820, orders: 165 },
      { label: "เม.ย.", visits: 1680, orders: 0 },
      { label: "พ.ค.", visits: 1080, orders: 32 },
    ],
  };
  const data = dataByPeriod[period];

  const PIE_COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#6366f1", "#818cf8", "#f59e0b"];

  const periodTabs: { id: typeof period; label: string }[] = [
    { id: "daily", label: "รายวัน" },
    { id: "weekly", label: "รายสัปดาห์" },
    { id: "monthly", label: "รายเดือน" },
    { id: "yearly", label: "รายปี" },
  ];

  const chartTabs: { id: typeof chartType; label: string }[] = [
    { id: "line", label: "กราฟเส้น" },
    { id: "bar", label: "กราฟแท่ง" },
    { id: "pie", label: "กราฟวงกลม" },
  ];

  const periodLabelMap = { daily: "วันนี้", weekly: "สัปดาห์นี้", monthly: "เดือนนี้", yearly: "ปีนี้", custom: "ช่วงที่เลือก" } as const;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h2 className={`${font} text-[24px]`} style={{ fontWeight: 500 }}>รายงานข้อมูลตลาด</h2>
        <Popover>
          <PopoverTrigger asChild>
            <button className={`${font} text-[13px] inline-flex items-center gap-2 bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-2 rounded-full cursor-pointer`}>
              <Download className="size-4" />
              ส่งออกรายงาน
              <ChevronDown className="size-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
              <span>Excel (.xlsx)</span>
            </button>
            <button className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
              <FileText className="size-4 text-[#dc2626]" />
              <span>PDF (.pdf)</span>
            </button>
          </PopoverContent>
        </Popover>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: "อัตราการแปลง", value: "4.2", suffix: "%", change: "+0.5%", positive: true,
              accent: "#7c3aed",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
            },
            {
              label: "CAC ต่อราย", value: "฿85", suffix: "", change: "−12%", positive: true,
              accent: "#10b981",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,
            },
            {
              label: "ROAS แคมเปญ", value: "3.8x", suffix: "", change: "+0.4", positive: true,
              accent: "#f59e0b",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
            },
            {
              label: "คูปองที่ใช้", value: "32", suffix: "ครั้ง", change: "+8", positive: true,
              accent: "#ec4899",
              icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12V8H6a2 2 0 010-4h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/><path d="M18 12a2 2 0 000 4h4v-4z"/></svg>,
            },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border p-5 transition-shadow hover:shadow-[0px_2px_12px_rgba(0,0,0,0.04)]"
              style={{ backgroundColor: `${s.accent}0d`, borderColor: `${s.accent}26` }}>
              <div className="flex items-center justify-between">
                <p className={`${font} text-[12px] text-gray-500`}>{s.label}</p>
                <div className="size-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${s.accent}1a` }}>{s.icon}</div>
              </div>
              <p className={`${font} text-[26px] mt-3 tracking-tight`} style={{ fontWeight: 700, color: s.accent }}>
                {s.value}{s.suffix && <span className="text-[14px] text-gray-400 ml-1" style={{ fontWeight: 500 }}>{s.suffix}</span>}
              </p>
              <div className="flex items-center gap-1.5 mt-2">
                <span className={`${font} inline-flex items-center gap-0.5 text-[11px] px-1.5 py-0.5 rounded-md`}
                  style={{ backgroundColor: "#dcfce7", color: "#15803d", fontWeight: 600 }}>
                  <svg width="9" height="9" viewBox="0 0 13 5" fill="none"><path d="M1 4.5L6.5 1L12 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {s.change}
                </span>
                <span className={`${font} text-[11px] text-gray-400`}>เทียบช่วงก่อนหน้า</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
          <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>การเข้าชม & คอนเวิร์ต</h3>
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1 self-start md:self-auto overflow-x-auto max-w-full">
            {periodTabs.map((t) => (
              <button key={t.id} onClick={() => setPeriod(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${period === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {period === t.id && (
                  <motion.div layoutId="report-mkt-period-bg" className="absolute inset-0 bg-[#7c3aed] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {period === "custom" && (
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className={`${font} text-[13px] inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 hover:border-[#7c3aed] focus:outline-none focus:border-[#7c3aed] cursor-pointer min-w-[230px]`}>
                  <CalendarIcon className="size-4 text-gray-500" />
                  <span className={range?.from ? "text-[#1a1a1a]" : "text-gray-400"}>{rangeLabel}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="range" numberOfMonths={2} selected={range} onSelect={setRange} defaultMonth={range?.from} />
                <div className="flex items-center justify-end gap-2 p-3 border-t">
                  <button onClick={() => setRange(undefined)} className={`${font} text-[13px] text-gray-600 hover:text-black px-3 py-1.5 rounded-lg cursor-pointer`}>ล้าง</button>
                  <button onClick={() => setCalendarOpen(false)} className={`${font} text-[13px] bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-3 py-1.5 rounded-lg cursor-pointer`}>เสร็จ</button>
                </div>
              </PopoverContent>
            </Popover>
            <button className={`${font} text-[13px] bg-[#7c3aed] hover:bg-[#6d28d9] text-white px-5 py-1.5 rounded-full cursor-pointer`}>ค้นหา</button>
          </div>
        )}

        <ResponsiveContainer width="100%" height={320}>
          {chartType === "line" ? (
            <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setChPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#7c3aed" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#f59e0b" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Line yAxisId="left" type="monotone" dataKey="visits" stroke="#7c3aed" strokeWidth={2.5} name="ผู้เข้าชม"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#7c3aed" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2.5} name="คอนเวิร์ต (ออเดอร์)"
                dot={(props: any) => {
                  const isActive = data[props.index]?.label === focusedLabel;
                  return <circle key={props.index} cx={props.cx} cy={props.cy} r={isActive ? 6 : 4} fill="#f59e0b" stroke={isActive ? "#fff" : "none"} strokeWidth={isActive ? 2 : 0} />;
                }} />
            </LineChart>
          ) : chartType === "bar" ? (
            <BarChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              onClick={(state: any) => {
                const i = state?.activeTooltipIndex;
                if (typeof i === "number" && data[i]) { setFocusedLabel(data[i].label); setChPage(1); }
              }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={{ stroke: "#e5e7eb" }} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#7c3aed" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#f59e0b" }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Legend iconType="circle" />
              <Bar yAxisId="left" dataKey="visits" name="ผู้เข้าชม" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#7c3aed" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
              <Bar yAxisId="right" dataKey="orders" name="คอนเวิร์ต (ออเดอร์)" radius={[6, 6, 0, 0]}>
                {data.map((d, i) => <Cell key={i} fill="#f59e0b" fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.35 : 1} />)}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie data={data.filter((d) => d.visits > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={120}
                dataKey="visits" nameKey="label" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                onClick={(entry: any) => { if (entry?.label) { setFocusedLabel(entry.label); setChPage(1); } }}>
                {data.filter((d) => d.visits > 0).map((d, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]}
                    stroke={d.label === focusedLabel ? "#1a1a1a" : "#fff"}
                    strokeWidth={d.label === focusedLabel ? 3 : 1}
                    fillOpacity={focusedLabel && d.label !== focusedLabel ? 0.4 : 1} />
                ))}
              </Pie>
              <Tooltip />
              <Legend iconType="circle" />
            </PieChart>
          )}
        </ResponsiveContainer>

        <div className="flex justify-center mt-5 overflow-x-auto">
          <div className="inline-flex items-center bg-gray-50 rounded-full p-1">
            {chartTabs.map((t) => (
              <button key={t.id} onClick={() => setChartType(t.id)}
                className={`${font} text-[13px] px-4 py-1.5 rounded-full cursor-pointer relative transition-colors ${chartType === t.id ? "text-white" : "text-gray-600 hover:text-black"}`}>
                {chartType === t.id && (
                  <motion.div layoutId="report-mkt-chart-bg" className="absolute inset-0 bg-[#7c3aed] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Channel Performance */}
      {(() => {
        const baseChannels = [
          { name: "Google Search", type: "Organic", visits: 1240, orders: 52, revenue: 24800, cost: 0, initial: "G", bg: "#fff", fg: "#4285f4" },
          { name: "TikTok", type: "Social", visits: 1450, orders: 45, revenue: 19800, cost: 2200, initial: "T", bg: "#0f0f0f", fg: "#fff" },
          { name: "Facebook", type: "Social", visits: 980, orders: 38, revenue: 18200, cost: 1500, initial: "f", bg: "#1877f2", fg: "#fff" },
          { name: "Google Ads", type: "Paid", visits: 890, orders: 31, revenue: 16500, cost: 3200, initial: "Ad", bg: "#fef3c7", fg: "#a16207" },
          { name: "Instagram", type: "Social", visits: 720, orders: 28, revenue: 14600, cost: 1200, initial: "I", bg: "#fce7f3", fg: "#be185d" },
          { name: "Line OA", type: "Direct", visits: 540, orders: 22, revenue: 12300, cost: 800, initial: "L", bg: "#dcfce7", fg: "#15803d" },
          { name: "Email Marketing", type: "Direct", visits: 320, orders: 18, revenue: 8400, cost: 200, initial: "@", bg: "#fee2e2", fg: "#b91c1c" },
          { name: "Direct (URL)", type: "Direct", visits: 280, orders: 12, revenue: 6800, cost: 0, initial: "U", bg: "#f3f4f6", fg: "#525252" },
          { name: "Affiliate", type: "Partner", visits: 210, orders: 9, revenue: 5400, cost: 540, initial: "Af", bg: "#e0e7ff", fg: "#4338ca" },
          { name: "YouTube", type: "Social", visits: 180, orders: 6, revenue: 3200, cost: 600, initial: "Y", bg: "#fee2e2", fg: "#b91c1c" },
        ];

        // Period filtering
        const periodHash = period.length * 13 + (range?.from?.getMonth() ?? new Date().getMonth()) * 5;
        const periodScale = period === "daily" ? 0.35 : period === "weekly" ? 0.7 : period === "yearly" ? 12 : 1;
        let working = baseChannels.map((c, i) => {
          const drop = period === "daily" ? (i + periodHash) % 4 === 0 : period === "weekly" ? (i + periodHash) % 6 === 0 : false;
          if (drop) return { ...c, visits: 0, orders: 0, revenue: 0, cost: 0 };
          return {
            ...c,
            visits: Math.max(1, Math.round(c.visits * periodScale)),
            orders: Math.max(1, Math.round(c.orders * periodScale)),
            revenue: Math.round(c.revenue * periodScale),
            cost: Math.round(c.cost * periodScale),
          };
        }).filter((c) => c.visits > 0);

        // Narrow by chart focus
        if (focusedLabel) {
          const focusRow = data.find((d) => d.label === focusedLabel);
          const focusVisits = focusRow?.visits ?? 0;
          if (focusVisits === 0) working = [];
          else {
            const focusHash = Array.from(focusedLabel).reduce((s, ch) => s + ch.charCodeAt(0), 0);
            const rotateBy = focusHash % Math.max(working.length, 1);
            const rotated = [...working.slice(rotateBy), ...working.slice(0, rotateBy)];
            working = rotated.map((c, i) => ({
              ...c,
              visits: Math.max(1, Math.round(c.visits * (0.4 + (((focusHash + i) % 60) / 100)))),
              orders: Math.max(1, Math.round(c.orders * (0.4 + (((focusHash + i * 3) % 60) / 100)))),
              revenue: Math.max(1, Math.round(c.revenue * (0.4 + (((focusHash + i * 5) % 60) / 100)))),
              cost: Math.max(0, Math.round(c.cost * (0.4 + (((focusHash + i * 7) % 60) / 100)))),
            }));
          }
        }

        const sorted = [...working].sort((a, b) => {
          switch (chSort) {
            case "revenue_desc": return b.revenue - a.revenue;
            case "visits_desc": return b.visits - a.visits;
            case "conv_desc": {
              const ac = a.visits > 0 ? a.orders / a.visits : 0;
              const bc = b.visits > 0 ? b.orders / b.visits : 0;
              return bc - ac;
            }
            case "roas_desc": {
              const ar = a.cost > 0 ? a.revenue / a.cost : Infinity;
              const br = b.cost > 0 ? b.revenue / b.cost : Infinity;
              if (ar === Infinity && br === Infinity) return b.revenue - a.revenue;
              return br - ar;
            }
          }
        });

        const totalPages = Math.max(1, Math.ceil(sorted.length / chPerPage));
        const safePage = Math.min(chPage, totalPages);
        const pageStart = (safePage - 1) * chPerPage;
        const pageItems = sorted.slice(pageStart, pageStart + chPerPage);

        const pageVisits = pageItems.reduce((s, c) => s + c.visits, 0);
        const pageOrdersTotal = pageItems.reduce((s, c) => s + c.orders, 0);
        const pageRevenue = pageItems.reduce((s, c) => s + c.revenue, 0);
        const pageCost = pageItems.reduce((s, c) => s + c.cost, 0);
        const pageConv = pageVisits > 0 ? (pageOrdersTotal / pageVisits) * 100 : 0;
        const pageRoas = pageCost > 0 ? pageRevenue / pageCost : 0;

        const typeColor = (t: string) => {
          switch (t) {
            case "Organic": return { bg: "#dcfce7", fg: "#15803d" };
            case "Social": return { bg: "#fce7f3", fg: "#be185d" };
            case "Paid": return { bg: "#fef3c7", fg: "#a16207" };
            case "Direct": return { bg: "#dbeafe", fg: "#1e40af" };
            case "Partner": return { bg: "#e0e7ff", fg: "#4338ca" };
            default: return { bg: "#f3f4f6", fg: "#525252" };
          }
        };

        return (
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className={`${font} text-[18px]`} style={{ fontWeight: 600 }}>ประสิทธิภาพช่องทางการตลาด</h3>
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#f5f3ff] text-[#6d28d9]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#7c3aed]" />
                    {periodLabelMap[period]}
                  </span>
                  {focusedLabel && (
                    <span className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-[#fff7ed] text-[#c2410c]`} style={{ fontWeight: 600 }}>
                      <span className="size-1.5 rounded-full bg-[#c2410c]" />
                      เฉพาะ {focusedLabel}
                      <button onClick={() => setFocusedLabel(null)} className="ml-0.5 hover:text-[#7c2d12] cursor-pointer">
                        <X className="size-2.5" />
                      </button>
                    </span>
                  )}
                </div>
                <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>
                  รายได้และคอนเวิร์ตต่อช่องทาง · แสดง {sorted.length === 0 ? 0 : pageStart + 1}–{pageStart + pageItems.length} จาก {sorted.length} ช่องทาง
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select value={chSort} onChange={(e) => setChSort(e.target.value as any)}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 bg-white cursor-pointer focus:outline-none focus:border-[#7c3aed]`}>
                    <option value="revenue_desc">เรียง: รายได้สูงสุด</option>
                    <option value="visits_desc">เรียง: ผู้เข้าชมมากสุด</option>
                    <option value="conv_desc">เรียง: Conv. Rate สูงสุด</option>
                    <option value="roas_desc">เรียง: ROAS สูงสุด</option>
                  </select>
                  <ChevronDown className="size-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <table className="w-full table-fixed">
                <colgroup>
                  <col style={{ width: "30%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "13%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "16%" }} />
                  <col style={{ width: "12%" }} />
                </colgroup>
                <thead>
                  <tr className={`${font} text-[12px] text-gray-500 border-b border-gray-100`}>
                    <th className="text-left pb-3 pr-3" style={{ fontWeight: 500 }}>ช่องทาง</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ผู้เข้าชม</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>ออเดอร์</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>Conv. Rate</th>
                    <th className="text-right pb-3 pr-3" style={{ fontWeight: 500 }}>รายได้ (฿)</th>
                    <th className="text-right pb-3" style={{ fontWeight: 500 }}>ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((c, i) => {
                    const conv = c.visits > 0 ? (c.orders / c.visits) * 100 : 0;
                    const roas = c.cost > 0 ? c.revenue / c.cost : null;
                    const tc = typeColor(c.type);
                    return (
                      <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-9 rounded-full flex items-center justify-center shrink-0 border border-gray-100"
                              style={{ backgroundColor: c.bg, color: c.fg }}>
                              <span className={`${font} text-[12px]`} style={{ fontWeight: 700 }}>{c.initial}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }} title={c.name}>{c.name}</p>
                              <span className={`${font} inline-flex items-center text-[10px] px-1.5 py-0.5 rounded-full mt-0.5`}
                                style={{ backgroundColor: tc.bg, color: tc.fg, fontWeight: 600 }}>{c.type}</span>
                            </div>
                          </div>
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{c.visits.toLocaleString()}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px] text-[#f59e0b]`} style={{ fontWeight: 600 }}>{c.orders}</td>
                        <td className={`py-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 600, color: conv >= 4 ? "#15803d" : conv >= 2 ? "#ca8a04" : "#9ca3af" }}>
                          {conv.toFixed(1)}%
                        </td>
                        <td className={`py-3 pr-3 text-right ${font} text-[14px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>฿{c.revenue.toLocaleString()}</td>
                        <td className={`py-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700, color: roas === null ? "#9ca3af" : roas >= 3 ? "#15803d" : roas >= 1 ? "#ca8a04" : "#dc2626" }}>
                          {roas === null ? "—" : `${roas.toFixed(1)}x`}
                        </td>
                      </tr>
                    );
                  })}
                  {pageItems.length === 0 && (
                    <tr><td colSpan={6} className={`py-10 text-center ${font} text-[13px] text-gray-400`}>ไม่พบข้อมูลช่องทาง</td></tr>
                  )}
                </tbody>
                {pageItems.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-gray-100">
                      <td className={`pt-3 pr-3 ${font} text-[12px] truncate`} style={{ fontWeight: 600 }}>รวม ({pageItems.length} ช่องทางที่แสดง)</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px]`} style={{ fontWeight: 700 }}>{pageVisits.toLocaleString()}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-[#f59e0b]`} style={{ fontWeight: 700 }}>{pageOrdersTotal}</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[13px] text-gray-700`} style={{ fontWeight: 700 }}>{pageConv.toFixed(1)}%</td>
                      <td className={`pt-3 pr-3 text-right ${font} text-[14px] text-[#7c3aed]`} style={{ fontWeight: 700 }}>฿{pageRevenue.toLocaleString()}</td>
                      <td className={`pt-3 text-right ${font} text-[13px] text-[#15803d]`} style={{ fontWeight: 700 }}>{pageCost > 0 ? `${pageRoas.toFixed(1)}x` : "—"}</td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
              <div className="flex items-center gap-2">
                <span className={`${font} text-[12px] text-gray-500`}>แสดง</span>
                <div className="relative">
                  <select value={chPerPage} onChange={(e) => { setChPerPage(Number(e.target.value)); setChPage(1); }}
                    className={`${font} text-[12px] appearance-none border border-gray-200 rounded-md pl-2 pr-7 py-1 bg-white cursor-pointer focus:outline-none focus:border-[#7c3aed]`}>
                    {[5, 10, 20, 50].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                  <ChevronDown className="size-3 text-gray-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <span className={`${font} text-[12px] text-gray-500`}>ช่องทางต่อหน้า</span>
              </div>
              <div className="flex items-center gap-1 flex-wrap">
                <button disabled={safePage === 1} onClick={() => setChPage(safePage - 1)}
                  aria-label="หน้าก่อน"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronLeft className="size-4" strokeWidth={2.4} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setChPage(p)}
                    className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${safePage === p ? "bg-[#7c3aed] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                    style={{ fontWeight: safePage === p ? 600 : 400 }}>
                    {p}
                  </button>
                ))}
                <button disabled={safePage === totalPages} onClick={() => setChPage(safePage + 1)}
                  aria-label="หน้าถัดไป"
                  className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${safePage === totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}>
                  <ChevronRight className="size-4" strokeWidth={2.4} />
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

/* ========== MAIN ========== */
export function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OwnerTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState("CPL-001");

  const handleSelect = (tab: OwnerTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  return (
    <div className="flex h-full overflow-hidden relative">
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      <div className={`${sidebarCollapsed ? "hidden md:block" : "fixed md:relative z-30 md:z-auto"} md:h-full md:overflow-y-auto shrink-0 transition-all duration-300`}>
        <Sidebar active={activeTab} onSelect={handleSelect} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      </div>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto min-w-0">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "products" && <ProductsTab onAddProduct={() => setActiveTab("add_product")} />}
        {activeTab === "flash_sale" && <FlashSaleTab onViewEvent={() => setActiveTab("flash_event")} />}
        {activeTab === "flash_event" && <FlashEventDetail onBack={() => setActiveTab("flash_sale")} />}
        {activeTab === "add_product" && <AddProductTab onBack={() => setActiveTab("products")} />}
        {activeTab === "promotions" && (
          <div>
            <h2 className={`${font} text-[22px] mb-4`} style={{ fontWeight: 600 }}>โปรโมชั่น</h2>
            <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีโปรโมชั่นที่ใช้งานอยู่</p>
          </div>
        )}
        {activeTab === "coupons" && (
          <div>
            <h2 className={`${font} text-[22px] mb-4`} style={{ fontWeight: 600 }}>คูปอง</h2>
            <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีคูปองที่ใช้งานอยู่</p>
          </div>
        )}
        {activeTab === "complaints" && <ComplaintsTab onViewDetail={(id: string) => { setSelectedComplaintId(id); setActiveTab("complaint_detail"); }} />}
        {activeTab === "complaint_detail" && <ComplaintDetailTab complaintId={selectedComplaintId} onBack={() => setActiveTab("complaints")} />}
        {activeTab === "finance" && <FinanceTab onBankSettings={() => setActiveTab("bank_settings")} />}
        {activeTab === "bank_settings" && <BankSettingsTab onBack={() => setActiveTab("finance")} />}
        {activeTab === "report_sales" && <ReportSalesTab />}
        {activeTab === "report_customers" && <ReportCustomersTab />}
        {activeTab === "report_products" && <ReportProductsTab />}
        {activeTab === "report_market" && <ReportMarketTab />}


      </main>
    </div>
  );
}