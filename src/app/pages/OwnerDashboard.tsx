import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useOrders } from "../store/OrderContext";
import { useNavigate } from "react-router";
import {
  BarChart3, Package, ShoppingCart, Zap, Megaphone, Ticket,
  Settings, ChevronDown, ChevronLeft, Store, Search,
  Plus, MoreHorizontal, Eye, AlertCircle, X, Check, Clock, ArrowRight, RotateCcw, Wallet
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import imgLogo from "figma:asset/c494dc0dab30c1bf59f2f6e2c114db61b1755370.png";
import imgSideBar from "figma:asset/9c30b1921f0988e49ef49ac4f89b2dd06b320b33.png";
import imgProd from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgFlash from "figma:asset/8effbd2f0b89604dcbe9aeb239cc524667996e66.png";
import bankLogoKBANK from "figma:asset/fc3734dca1dc1106a8a9ae04448d90848680e3b4.png";
import bankLogoSCB from "figma:asset/480398b2a511e7f907960af090b46919e996b2fb.png";
import bankLogoKTB from "figma:asset/3bc35e854570ff8d031628a1b961ff515af8c04c.png";
import bankLogoTTB from "figma:asset/85a8262de08aace150c02d0d1b8e2a2442158aa8.png";
import bankLogoBBL from "figma:asset/7644739c159ec3c06623b12e5cc595deb95f9ce4.png";
import svgOrderTabs from "../../imports/svg-ht9fbjz0sq";
import svgBankTabs from "../../imports/svg-q7abbwkyjt";
import svgChevron from "../../imports/svg-a36cmd0hr3";
import svgPaths from "../../imports/svg-fmfhn0ojdl";

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

type OwnerTab = "overview" | "orders" | "products" | "flash_sale" | "flash_event" | "promotions" | "coupons" | "bank_settings" | "shop_info" | "add_product" | "finance";
type OrderFilterTab = "all" | "pending_payment" | "pending_verify" | "ready_ship" | "shipping" | "shipped" | "cancelled";

interface SidebarItem {
  id: OwnerTab;
  label: string;
  icon: any;
  children?: { id: OwnerTab; label: string }[];
}

const sidebarItems: SidebarItem[] = [
  { id: "overview", label: "ภาพรวม", icon: BarChart3 },
  { id: "orders", label: "คำสั่งซื้อ", icon: ShoppingCart },
  { id: "products", label: "สินค้า", icon: Package, children: [
    { id: "products", label: "จัดการสินค้า" },
    { id: "flash_sale", label: "Flash Sale" },
    { id: "promotions", label: "โปรโมชั่น" },
    { id: "coupons", label: "คูปอง" },
  ]},
];

const sidebarSettings: SidebarItem[] = [
  { id: "shop_info", label: "ข้อมูลร้านค้า", icon: Store },
];

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
  { id: "1", name: "Product", category: "สมุนไพร", type: "ราคาเดียว", typeColor: "#ff9500", price: "฿ 0.00", stock: "0 ชิ้น", status: "เปิดขาย", statusColor: "#319754", flash: true },
  { id: "2", name: "Product", category: "สมุนไพร", type: "ราคาเดียว", typeColor: "#ff9500", price: "฿ 0.00", stock: "0 ชิ้น", status: "เปิดขาย", statusColor: "#319754" },
  { id: "3", name: "Product", category: "สมุนไพร", type: "ราคาเดียว", typeColor: "#ff9500", price: "฿ 0.00", stock: "0 ชิ้น", status: "เปิดขาย", statusColor: "#319754", recommended: true },
  { id: "4", name: "Product", category: "สมุนไพร", type: "ราคาเดียว", typeColor: "#ff9500", price: "฿ 0.00", stock: "0 ชิ้น", status: "เปิดขาย", statusColor: "#319754" },
  { id: "5", name: "Product", category: "สมุนไพร", type: "หลายตัวเลือก", typeColor: "#007aff", price: "฿ 0.00 - 0.00", stock: "0 ชิ้น", status: "เปิดขาย", statusColor: "#319754" },
  { id: "6", name: "Product", category: "สมุนไพร", type: "ราคาเดียว", typeColor: "#ff9500", price: "฿ 0.00", stock: "0 ชิ้น", status: "เปิดขาย", statusColor: "#319754" },
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
const childIconMap: Record<string, any> = { products: Package, flash_sale: Zap, promotions: Megaphone, coupons: Ticket };

function Sidebar({ active, onSelect, collapsed }: { active: OwnerTab; onSelect: (t: OwnerTab) => void; collapsed: boolean }) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ products: true, settings: false });
  const navigate = useNavigate();
  const toggle = (id: string) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  const activeStyle = { backgroundImage: "linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)" };

  const MenuBtn = ({ isActive, icon: Icon, label, onClick, hasArrow, expanded }: any) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between pl-2 ${hasArrow ? "pr-3" : "pr-2"} py-2 rounded-[200px] cursor-pointer transition-colors ${!isActive ? "bg-white hover:bg-gray-50" : ""}`}
      style={isActive ? activeStyle : {}}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className={`size-[28px] rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5]"}`}>
          <Icon className={`size-3 ${isActive ? "text-white" : "text-black/85"}`} />
        </div>
        <span className={`${font} text-[14px] ${isActive ? "text-[#319754]" : "text-black"}`}>{label}</span>
      </div>
      {hasArrow && <ChevronDown className={`size-3 text-black transition-transform shrink-0 ${expanded ? "" : "-rotate-90"}`} />}
    </button>
  );

  return (
    <aside className={`flex flex-col shrink-0 p-4 ${collapsed ? "w-0 overflow-hidden !p-0" : "w-[282px]"} transition-all`}>
      <div className="bg-white rounded-[16px] overflow-hidden flex flex-col h-full">
        {/* Store header */}
        <div className="flex items-center gap-2.5 pl-4 py-4 pr-0">
          <img src={imgSideBar} className="size-[44px] rounded-full shrink-0 object-cover" alt="" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className={`${font} text-[16px] truncate`} style={{ fontWeight: 500 }}>METAHERB Store</p>
              <button className="backdrop-blur-[2px] bg-white/50 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-l-full size-[24px] flex items-center justify-center cursor-pointer shrink-0">
                <ChevronLeft className="size-3 text-[#999]" />
              </button>
            </div>
            <p className={`${font} text-[14px] text-black`}>ร้านค้า</p>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-4 pb-4 space-y-2.5 overflow-y-auto">
          {sidebarItems.map((item) =>
            !item.children ? (
              <MenuBtn key={item.id} isActive={active === item.id} icon={item.icon} label={item.label} onClick={() => onSelect(item.id)} />
            ) : (
              <div key={item.id} className="space-y-2.5">
                <MenuBtn icon={item.icon} label={item.label} onClick={() => toggle(item.id)} hasArrow expanded={expandedMenus[item.id]} />
                {expandedMenus[item.id] && (
                  <div className="rounded-[16px] border border-[#f5f5f5] p-2.5 space-y-2.5">
                    {item.children.map((child) => (
                      <MenuBtn key={child.id + child.label} isActive={active === child.id} icon={childIconMap[child.id] || Package} label={child.label} onClick={() => onSelect(child.id)} />
                    ))}
                  </div>
                )}
              </div>
            )
          )}

          {/* Finance */}
          <MenuBtn isActive={active === "finance"} icon={Wallet} label="การเงิน" onClick={() => onSelect("finance")} />

          {/* Settings */}
          <div className="space-y-2.5">
            <MenuBtn icon={Settings} label="ตั้งค่าร้านค้า" onClick={() => toggle("settings")} hasArrow expanded={expandedMenus["settings"]} />
            {expandedMenus["settings"] && (
              <div className="rounded-[16px] border border-[#f5f5f5] p-2.5 space-y-2.5">
                {sidebarSettings.map((item) => (
                  <MenuBtn key={item.id} isActive={active === item.id} icon={item.icon} label={item.label} onClick={() => onSelect(item.id)} />
                ))}
              </div>
            )}
          </div>

          {/* Back to main site */}
          <button onClick={() => navigate("/")}
            className="w-full flex items-center gap-2.5 pl-2 pr-3 py-2 rounded-[200px] cursor-pointer transition-colors hover:bg-red-50 bg-white">
            <div className="bg-[#f5f5f5] size-[28px] rounded-full flex items-center justify-center shrink-0">
              <RotateCcw className="size-3 text-[#ff3b30]" />
            </div>
            <span className={`${font} text-[14px] text-[#ff3b30]`}>กลับสู่เว็บไซต์หลัก</span>
          </button>
        </nav>
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
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>จัดการคำสั่งซื้อ</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5 w-[280px]">
            <input className={`${font} flex-1 text-[13px] outline-none bg-transparent`} placeholder="ค้นหาเลขคำสั่งซื้อ, ชื่อลูกค้า...."
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            <button className="bg-[#319754] p-1.5 rounded-full cursor-pointer"><Search className="size-4 text-white" /></button>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] flex items-center justify-between overflow-x-auto p-2 mb-6">
        {orderTabs.map((tab) => {
          const isAct = activeFilter === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
              className={`backdrop-blur-[2px] flex gap-2.5 items-center justify-center pl-3 pr-2 py-1 rounded-[100px] cursor-pointer shrink-0 transition-colors ${isAct ? "bg-[#319754]" : ""}`}>
              <div className="flex flex-col items-center justify-center size-[18px] shrink-0">
                {tab.id === "all" && (
                  <svg width="10" height="16" viewBox="0 0 10 16" fill="none"><path d={orderTabSvgs.clipboard1} fill={isAct ? "white" : "black"} /><path d={orderTabSvgs.clipboard2} fill={isAct ? "white" : "black"} /><path d={orderTabSvgs.clipboard3} fill={isAct ? "white" : "black"} /></svg>
                )}
                {tab.id === "pending_payment" && (
                  <div className="inline-grid relative">
                    <svg className="col-start-1 row-start-1" width="9" height="15" viewBox="0 0 9 15" fill="none"><path d={orderTabSvgs.hourglass} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    <div className={`col-start-1 row-start-1 ${isAct ? "bg-[#319754]" : "bg-white"} border ${isAct ? "border-[#319754]" : "border-white"} rounded-full size-[10px] self-end -ml-[1px] overflow-hidden`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d={orderTabSvgs.bahtCircle} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    </div>
                  </div>
                )}
                {tab.id === "pending_verify" && (
                  <div className="inline-grid relative">
                    <svg className="col-start-1 row-start-1" width="14" height="14" viewBox="0 0 14.08 14.08" fill="none"><path d={orderTabSvgs.magnify} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    <div className={`col-start-1 row-start-1 ${isAct ? "bg-[#319754]" : "bg-white"} border ${isAct ? "border-[#319754]" : "border-white"} rounded-full size-[10px] self-end -ml-[1px] overflow-hidden`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d={orderTabSvgs.bahtCircle2} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    </div>
                  </div>
                )}
                {tab.id === "ready_ship" && (
                  <svg width="13" height="14" viewBox="0 0 13.0777 14" fill="none"><path d={orderTabSvgs.shippingBox} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                )}
                {tab.id === "shipping" && (
                  <div className="inline-grid relative w-full">
                    <svg className="col-start-1 row-start-1 ml-auto" width="15" height="11" viewBox="0 0 14.5693 10.864" fill="none"><path d={orderTabSvgs.truckBox} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    <div className={`col-start-1 row-start-1 ${isAct ? "bg-[#319754]" : "bg-white"} border ${isAct ? "border-[#319754]" : "border-white"} rounded-full size-[10px] self-start overflow-hidden`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d={orderTabSvgs.clockFill} fill={isAct ? "white" : "black"} /></svg>
                    </div>
                  </div>
                )}
                {tab.id === "shipped" && (
                  <div className="inline-grid relative w-full">
                    <svg className="col-start-1 row-start-1 ml-auto" width="15" height="11" viewBox="0 0 14.5693 10.864" fill="none"><path d={orderTabSvgs.truckBox} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    <div className={`col-start-1 row-start-1 ${isAct ? "bg-[#319754]" : "bg-white"} border ${isAct ? "border-[#319754]" : "border-white"} rounded-full size-[10px] self-start overflow-hidden`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d={orderTabSvgs.checkCircle} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    </div>
                  </div>
                )}
                {tab.id === "cancelled" && (
                  <div className="inline-grid relative">
                    <svg className="col-start-1 row-start-1" width="13" height="14" viewBox="0 0 13.3854 14.3294" fill="none"><path d={orderTabSvgs.shippingBox2} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    <div className={`col-start-1 row-start-1 ${isAct ? "bg-[#319754]" : "bg-white"} border ${isAct ? "border-[#319754]" : "border-white"} rounded-full size-[10px] self-end ml-auto overflow-hidden`}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d={orderTabSvgs.xCircle} fill={isAct ? "white" : "black"} fillOpacity={isAct ? 1 : 0.85} /></svg>
                    </div>
                  </div>
                )}
              </div>
              <span className={`${font} text-[14px] whitespace-nowrap ${isAct ? "text-white" : "text-black"}`} style={{ fontWeight: isAct ? 500 : 400 }}>{tab.label}</span>
              <div className={`flex items-center justify-center px-2 py-1 rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] ${isAct ? "bg-white" : "bg-[#ff383c]"}`}>
                <span className={`${font} text-[8px] ${isAct ? "text-[#ff383c]" : "text-white"}`}>{tab.count}</span>
              </div>
            </button>
          );
        })}
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
                    <div className="flex items-center gap-1">
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

  const productFilterTabs = [
    { id: "all", label: "สินค้าทั้งหมด", count: 12 },
    { id: "active", label: "สินค้าเปิดขาย", count: 10 },
    { id: "inactive", label: "สินค้าปิดขาย", count: 0 },
    { id: "out", label: "สินค้าหมด", count: 2 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>จัดการสินค้า</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-full pl-4 pr-1.5 py-1.5 w-[240px]">
            <input className={`${font} flex-1 text-[13px] outline-none bg-transparent`} placeholder="ค้นหาสินค้าของคุณ...." />
            <button className="bg-[#319754] p-1.5 rounded-full cursor-pointer"><Search className="size-4 text-white" /></button>
          </div>
          <button onClick={onAddProduct}
            className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>
            <Plus className="size-4" /> เพิ่มสินค้าใหม่
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {productFilterTabs.map((tab) => (
          <button key={tab.id} onClick={() => setProductFilter(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] ${font} cursor-pointer whitespace-nowrap border ${
              productFilter === tab.id ? "bg-[#319754]/10 border-[#319754] text-[#319754]" : "bg-white border-gray-200 text-gray-500"
            }`}>
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              productFilter === tab.id ? "bg-[#319754] text-white" : "bg-gray-200 text-gray-600"
            }`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className={`${font} text-[12px] text-gray-500 border-b bg-gray-50`}>
              <th className="text-left py-3 px-4">รูปภาพ</th>
              <th className="text-left py-3 px-4">ชื่อสินค้า</th>
              <th className="text-left py-3 px-4">หมวดหมู่</th>
              <th className="text-left py-3 px-4">ประเภท</th>
              <th className="text-left py-3 px-4">ราคา</th>
              <th className="text-left py-3 px-4">คงเหลือ</th>
              <th className="text-left py-3 px-4">สถานะ</th>
              <th className="text-center py-3 px-4">เพิ่มเติม</th>
            </tr>
          </thead>
          <tbody>
            {mockProducts.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <div className="size-[60px] bg-gray-100 rounded-lg overflow-hidden">
                    <ImageWithFallback src={imgProd} alt="" className="w-full h-full object-cover" />
                    {p.flash && (
                      <div className="relative -mt-5 ml-1">
                        <span className={`bg-[#319754] text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit`}>
                          <Zap className="size-2.5" /> Flash Sale
                        </span>
                      </div>
                    )}
                    {p.recommended && (
                      <div className="relative -mt-5 ml-1">
                        <span className={`bg-[#f7931d] text-white text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 w-fit`}>
                          ★ แนะนำ
                        </span>
                      </div>
                    )}
                  </div>
                </td>
                <td className={`${font} text-[13px] py-3 px-4`}>{p.name}</td>
                <td className={`${font} text-[12px] py-3 px-4 text-gray-500`}>{p.category}</td>
                <td className="py-3 px-4">
                  <span className={`flex items-center gap-1 text-[12px] ${font}`} style={{ color: p.typeColor }}>
                    <span className="size-2 rounded-full" style={{ backgroundColor: p.typeColor }} />
                    {p.type}
                  </span>
                </td>
                <td className={`${font} text-[13px] py-3 px-4 text-[#319754]`} style={{ fontWeight: 500 }}>{p.price}</td>
                <td className={`${font} text-[12px] py-3 px-4`}>{p.stock}</td>
                <td className="py-3 px-4">
                  <span className={`${font} text-[12px] flex items-center gap-1`} style={{ color: p.statusColor }}>
                    <Eye className="size-3" /> {p.status}
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
            <button key={p} onClick={() => setCurrentPage(p)}
              className={`size-7 rounded-full flex items-center justify-center text-[12px] ${font} cursor-pointer ${
                currentPage === p ? "bg-[#319754] text-white" : "text-gray-500 hover:bg-gray-100"
              }`}>{p}</button>
          ))}
          <button className="size-7 rounded-full flex items-center justify-center cursor-pointer text-gray-400 rotate-180"><ChevronLeft className="size-4" /></button>
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
          <span className={`${font} text-[12px] text-gray-400`}>เข้าร่วมกั�� Flash Sale กับทาง METAHERB เพื่อรับข้อเสนอสุดพิ��ศษ</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockFlashEvents.map((event) => (
            <div key={event.id} className="relative rounded-xl overflow-hidden cursor-pointer" onClick={() => event.status === "active" ? onViewEvent() : event.status === "join" ? setShowPopup(true) : onViewEvent()}>
              <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff4500] p-4 text-white min-h-[120px] flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>{event.name}</span>
                  {event.countdown && (
                    <div className="flex items-center gap-1">
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
                  <li>สินค้าที่เข้าร่วมกิจกรรมจะได้รับการโปรโมตผ่านช่องทางของ METAHERB</li>
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

  const topProducts = [
    { name: "ข้าวผัดกระเพรา", cat: "อาหารจานเดียว", sold: 1842, revenue: 110520 },
    { name: "ชานมไข่มุก", cat: "เครื่องดื่ม", sold: 1654, revenue: 82700 },
    { name: "ส้มตำไทย", cat: "อาหารจานเดียว", sold: 1523, revenue: 91380 },
    { name: "กาแฟลาเต้", cat: "เครื่องดื่ม", sold: 1389, revenue: 97230 },
    { name: "ข้าวมันไก่", cat: "อาหารจานเดียว", sold: 1245, revenue: 74700 },
    { name: "พิซซ่าชีส", cat: "ฟาสต์ฟู้ด", sold: 1102, revenue: 154280 },
    { name: "ไก่ทอดเกาหลี", cat: "ฟาสต์ฟู้ด", sold: 987, revenue: 138180 },
    { name: "น้ำส้มคั้นสด", cat: "เครื่องดื่ม", sold: 876, revenue: 43800 },
    { name: "ผัดไทยกุ้งสด", cat: "อาหารจานเดียว", sold: 812, revenue: 64960 },
    { name: "เค้กช็อกโกแลต", cat: "ขนม", sold: 745, revenue: 111750 },
  ];

  const topCustomers = [
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

  const maxSold = topProducts[0].sold;
  const maxOrders = topCustomers[0].orders;

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
              <button onClick={() => setViewMode("monthly")} className={`${font} text-[14px] cursor-pointer px-3 py-1 rounded-full transition-colors backdrop-blur-[2px] ${viewMode === "monthly" ? "bg-[#319754] text-white" : "text-black"}`} style={{ fontWeight: viewMode === "monthly" ? 500 : 400 }}>รายเดือน</button>
              <button onClick={() => setViewMode("yearly")} className={`${font} text-[14px] cursor-pointer px-3 py-1 rounded-full transition-colors backdrop-blur-[2px] ${viewMode === "yearly" ? "bg-[#319754] text-white" : "text-black"}`} style={{ fontWeight: viewMode === "yearly" ? 500 : 400 }}>รายปี</button>
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
          {/* Row 1: visits + orders */}
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

          {/* Row 2: sales — highlight card */}
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
            <div className="flex items-center gap-1 mt-2">
              {(viewMode === "yearly" ? 15 : monthSalesChg) >= 0 ? <UpArrow /> : <DownArrow />}
              <span className={`${font} text-[11px] text-white/90`}>~{Math.abs(viewMode === "yearly" ? 15 : monthSalesChg)}% <span className="text-white/60">% เปลี่ยนแปลงจาก{viewMode === "yearly" ? "ปีก่อน" : "เดือนก่อน"}</span></span>
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
            <ChgRow value={viewMode === "yearly" ? monthSalesChg : daySalesChg} label={viewMode === "yearly" ? "เดือนก่อน" : "วันก่อน"} />
          </div>
        </div>
      </div>

      {/* Bottom: Top Product + Top Customers */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h3 className={`${font} text-[20px] mb-0.5`} style={{ fontWeight: 700 }}>Top Product</h3>
          <p className={`${font} text-[13px] text-gray-400 mb-4`}>10 อันดับสินค้าขายดี</p>
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
                      <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{p.name}</p>
                      <p className={`${font} text-[12px] text-gray-400`}>{p.cat}</p>
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
          <p className={`${font} text-[13px] text-gray-400 mb-4`}>ยอดขายลูกค้าประจำ</p>
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
  { date: "13 มี.ค. 2569 11:21", type: "ปล่อยยอด", typeColor: "bg-[#319754] text-white", order: "#ORD-20260313-288830-1", amount: "+฿329.08", balance: "฿0.00" },
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

/* ========== MAIN ========== */
export function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OwnerTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleSelect = (tab: OwnerTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] relative">
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      <div className={`${sidebarCollapsed ? "hidden md:block" : "fixed md:relative z-30 md:z-auto"} md:sticky md:top-0 md:self-start md:h-screen md:overflow-y-auto`}>
        <Sidebar active={activeTab} onSelect={handleSelect} collapsed={false} />
      </div>

      {/* Toggle */}
      

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
        {activeTab === "finance" && <FinanceTab onBankSettings={() => setActiveTab("bank_settings")} />}
        {activeTab === "bank_settings" && <BankSettingsTab onBack={() => setActiveTab("finance")} />}

        {activeTab === "shop_info" && (
          <div>
            <h2 className={`${font} text-[22px] mb-4`} style={{ fontWeight: 600 }}>ข้อมูลร้านค้า</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-[600px] space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>ชื่อร้านค้า</label>
                <input defaultValue={user?.shopName || "METAHERB Store"} className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[14px] ${font} outline-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>คำอธิบาย</label>
                <textarea defaultValue="ร้านขายสมุนไพรออร์แกนิคคุณภาพ" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[14px] ${font} outline-none h-20 resize-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>เบอร์โทรศัพท์</label>
                <input defaultValue="061-421-3111" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[14px] ${font} outline-none`} />
              </div>
              <button className={`bg-[#319754] text-white px-6 py-2.5 rounded-full text-[14px] ${font} cursor-pointer`}>บันทึกการเปลี่ยนแปลง</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}