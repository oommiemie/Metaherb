import { useState } from "react";
import { useAuth } from "../store/AuthContext";
import { useOrders } from "../store/OrderContext";
import { useNavigate } from "react-router";
import {
  BarChart3, Package, ShoppingCart, Zap, Megaphone, Ticket,
  Settings, ChevronDown, ChevronLeft, CreditCard, Store, Search,
  Plus, MoreHorizontal, Eye, AlertCircle, X, Check, Clock, ArrowRight
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import imgLogo from "figma:asset/c494dc0dab30c1bf59f2f6e2c114db61b1755370.png";
import imgProd from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgFlash from "figma:asset/8effbd2f0b89604dcbe9aeb239cc524667996e66.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai',sans-serif]";

type OwnerTab = "overview" | "orders" | "products" | "flash_sale" | "flash_event" | "promotions" | "coupons" | "bank" | "shop_info" | "add_product";
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
  ]},
  { id: "promotions", label: "โปรโมชั่น", icon: Megaphone },
  { id: "coupons", label: "คูปอง", icon: Ticket },
];

const sidebarSettings: SidebarItem[] = [
  { id: "bank", label: "จัดการบัญชีธนาคาร", icon: CreditCard },
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
    address: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
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
function Sidebar({ active, onSelect, collapsed }: { active: OwnerTab; onSelect: (t: OwnerTab) => void; collapsed: boolean }) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({ products: true });
  const navigate = useNavigate();

  const toggle = (id: string) => setExpandedMenus((p) => ({ ...p, [id]: !p[id] }));

  return (
    <aside className={`bg-white border-r border-gray-100 flex flex-col shrink-0 ${collapsed ? "w-0 overflow-hidden" : "w-[200px]"} transition-all`}>
      {/* Store info */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100">
        <div className="size-[40px] rounded-full overflow-hidden shrink-0">
          <img src={imgLogo} className="w-full h-full object-cover" alt="" />
        </div>
        <div className="min-w-0">
          <p className={`${font} text-[13px] truncate`} style={{ fontWeight: 600 }}>METAHERB Store</p>
          <p className={`${font} text-[11px] text-gray-400`}>ร้านค้า</p>
        </div>
      </div>

      <nav className="flex-1 py-2 overflow-y-auto">
        {sidebarItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => item.children ? toggle(item.id) : onSelect(item.id)}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] ${font} cursor-pointer transition-colors ${
                (active === item.id || item.children?.some((c) => c.id === active)) ? "bg-[#319754]/10 text-[#319754]" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="size-4 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.children && <ChevronDown className={`size-3 transition-transform ${expandedMenus[item.id] ? "" : "-rotate-90"}`} />}
            </button>
            {item.children && expandedMenus[item.id] && (
              <div className="ml-6">
                {item.children.map((child) => (
                  <button key={child.id + child.label} onClick={() => onSelect(child.id)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-[12px] ${font} cursor-pointer rounded-lg ${
                      active === child.id ? "bg-[#319754]/10 text-[#319754]" : "text-gray-500 hover:bg-gray-50"
                    }`}>
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Settings section */}
        <div className="mt-2">
          <button onClick={() => toggle("settings")}
            className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] ${font} cursor-pointer text-gray-600 hover:bg-gray-50`}>
            <Settings className="size-4" />
            <span className="flex-1 text-left">ตั้งค่าร้านค้า</span>
            <ChevronDown className={`size-3 transition-transform ${expandedMenus["settings"] ? "" : "-rotate-90"}`} />
          </button>
          {expandedMenus["settings"] && sidebarSettings.map((item) => (
            <button key={item.id} onClick={() => onSelect(item.id)}
              className={`w-full flex items-center gap-2.5 ml-6 px-4 py-2 text-[12px] ${font} cursor-pointer ${
                active === item.id ? "text-[#319754]" : "text-gray-500 hover:bg-gray-50"
              }`}>
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Back to main site */}
      <button onClick={() => navigate("/")}
        className={`flex items-center gap-2 px-4 py-3 border-t border-gray-100 text-[12px] ${font} text-[#319754] cursor-pointer hover:bg-gray-50`}>
        <ArrowRight className="size-4" /> กลับสู่เว็บไซต์หลัก
      </button>
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
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {orderTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveFilter(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] ${font} cursor-pointer whitespace-nowrap border ${
              activeFilter === tab.id ? "bg-[#319754]/10 border-[#319754] text-[#319754]" : "bg-white border-gray-200 text-gray-500"
            }`}>
            {tab.label}
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              activeFilter === tab.id ? "bg-[#319754] text-white" : "bg-gray-200 text-gray-600"
            }`}>{tab.count}</span>
          </button>
        ))}
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
                    <button className={`border border-red-400 text-red-400 px-5 py-1.5 rounded-lg text-[13px] ${font} cursor-pointer hover:bg-red-50`}>ยกเลิก</button>
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
            className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-lg text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>
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
          <span className={`${font} text-[12px] text-gray-400`}>เข้าร่วมกับ Flash Sale กับทาง METAHERB เพื่อรับข้อเสนอสุดพิเศษ</span>
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
          <button className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-lg text-[13px] ${font} cursor-pointer`}>
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
          className={`flex items-center gap-2 bg-[#319754] text-white px-4 py-2 rounded-lg text-[13px] ${font} cursor-pointer`}>
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
          <button onClick={onBack} className={`border border-gray-300 px-6 py-2 rounded-lg text-[13px] ${font} cursor-pointer hover:bg-gray-50`}>ยกเลิก</button>
          <button className={`bg-[#319754] text-white px-6 py-2 rounded-lg text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>เพิ่มสินค้า</button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left steps */}
        <div className="w-[180px] shrink-0 space-y-2">
          {steps.map((step, i) => (
            <button key={i} onClick={() => setActiveStep(i)}
              className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[13px] ${font} cursor-pointer ${
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
  const stats = [
    { label: "ยอดขายวันนี้", value: "฿12,450", change: "+12%", color: "bg-green-50 text-green-600" },
    { label: "คำสั่งซื้อใหม่", value: "8", change: "+3", color: "bg-blue-50 text-blue-600" },
    { label: "สินค้าทั้งหมด", value: "24", change: "", color: "bg-purple-50 text-purple-600" },
    { label: "ลูกค้า", value: "156", change: "+5", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div>
      <h2 className={`${font} text-[22px] mb-6`} style={{ fontWeight: 600 }}>ภาพรวม</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-5 border border-gray-100">
            <p className={`${font} text-[22px]`} style={{ fontWeight: 700 }}>{s.value}</p>
            <p className={`${font} text-[12px] text-gray-500 mt-1`}>{s.label}</p>
            {s.change && <span className={`${font} text-[11px] text-green-500`}>{s.change}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== MAIN ========== */
export function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<OwnerTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleSelect = (tab: OwnerTab) => {
    setActiveTab(tab);
    if (window.innerWidth < 768) setSidebarCollapsed(true);
  };

  return (
    <div className="flex min-h-[calc(100vh-200px)] relative">
      {!sidebarCollapsed && (
        <div className="fixed inset-0 bg-black/30 z-20 md:hidden" onClick={() => setSidebarCollapsed(true)} />
      )}

      <div className={`${sidebarCollapsed ? "hidden md:block" : "fixed md:relative z-30 md:z-auto"}`}>
        <Sidebar active={activeTab} onSelect={handleSelect} collapsed={false} />
      </div>

      {/* Toggle */}
      <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className="self-start mt-4 ml-1 bg-white border border-gray-200 rounded-full size-7 flex items-center justify-center cursor-pointer z-10 shadow-sm shrink-0">
        <ChevronLeft className={`size-3 transition-transform ${sidebarCollapsed ? "rotate-180" : ""}`} />
      </button>

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
        {activeTab === "bank" && (
          <div>
            <h2 className={`${font} text-[22px] mb-4`} style={{ fontWeight: 600 }}>จัดการบัญชีธนาคาร</h2>
            <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-[500px] space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>ธนาคาร</label>
                <select className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none`}>
                  <option>กสิกรไทย (KBANK)</option>
                  <option>ไทยพาณิชย์ (SCB)</option>
                  <option>กรุงเทพ (BBL)</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>เลขบัญชี</label>
                <input placeholder="xxx-x-xxxxx-x" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none`} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>ชื่อบัญชี</label>
                <input placeholder="ชื่อ-นามสกุล" className={`border border-gray-300 rounded-lg px-3 py-2.5 text-[13px] ${font} outline-none`} />
              </div>
              <button className={`bg-[#319754] text-white px-6 py-2.5 rounded-lg text-[14px] ${font} cursor-pointer`}>บันทึก</button>
            </div>
          </div>
        )}
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
              <button className={`bg-[#319754] text-white px-6 py-2.5 rounded-lg text-[14px] ${font} cursor-pointer`}>บันทึกการเปลี่ยนแปลง</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}