import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import type { CartItem } from "../store/CartContext";
import { useOrders } from "../store/OrderContext";
import { useNotifications } from "../store/NotificationContext";
import type { Notification } from "../store/NotificationContext";
import { useWishlist } from "../store/WishlistContext";
import { ShoppingCart, Bell, Search, ChevronDown, User, LogOut, Store, Shield, MapPin, Heart, Ticket, Monitor, ArrowRight, Menu, X, Clock, TrendingUp, Package, Tag, MessageSquare, Info, BarChart3, DollarSign, Users, Image, Settings } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ChatModal } from "./ChatModal";
import imgLogo from "../../assets/logo.png";
import imgBell from "figma:asset/bc0647483cfb5a707f778cc18a602a7932c0287f.png";
import imgCart from "figma:asset/e7332f142579e51e8632e5d3048cd86f0f80158a.png";
import imgAvatar from "figma:asset/02fc4d2560c804d8d3f2f8e525b1926bf3ef0ac2.png";
import imgGroup41 from "figma:asset/8be1dbf7f80482d74e88f48b419a6464198f2b87.png";
import imgOrderPay from "figma:asset/6b92d0e6831d20c47dd648a6fca5410d5d285bd6.png";
import imgOrderVerify from "figma:asset/bc3856a249e9261822188ed229ddd0e2ad6d0b2d.png";
import imgOrderShip from "figma:asset/6fe3df791a7ffa4eb26dc3d280886d11308e2b73.png";
import imgOrderDone from "figma:asset/affa7b2c27f58769e6b6bc5c0bac9bbeee21a3ef.png";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { products } from "../data/products";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const avatarByRole: Record<string, string> = {
  user: "https://images.unsplash.com/photo-1718307701476-bf46ac964396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZyaWVuZGx5fGVufDF8fHx8MTc3Mzg4ODExMnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  owner: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMGJ1c2luZXNzJTIwb3duZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM4ODgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  admin: "https://images.unsplash.com/photo-1612190219911-286df0e14656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwZ2xhc3Nlc3xlbnwxfHx8fDE3NzM4ODgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

/* ========== SEARCH with suggestions ========== */
function SearchBar({ className = "" }: { className?: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [searchHistory] = useState(["ชาออร์แกนิก", "น้ำผึ้ง", "สมุนไพร", "กาแฟดริป"]);
  const ref = useRef<HTMLDivElement>(null);

  const trending = ["ชาสมุนไพร", "น้ำผึ้งดิบ", "กาแฟดริป", "ครีมสมุนไพร", "แยมผลไม้"];

  const suggestions = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase())).slice(0, 6)
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (q?: string) => {
    const searchTerm = q || query;
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm}`);
      setFocused(false);
      setQuery(searchTerm);
    }
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <div className="flex items-center bg-white border border-[#d4d4d8] rounded-full pl-4 pr-1 py-1 transition-all duration-200 hover:border-[#319754] hover:shadow-[0_0_0_3px_rgba(49,151,84,0.1)]">
        <input
          className={`${font} flex-1 text-[14px] outline-none bg-transparent text-[#404040]`}
          placeholder="ค้นหาสินค้าที่ต้องการ"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={() => handleSearch()} className="bg-[#319754] p-2 rounded-full cursor-pointer shrink-0 size-8 flex items-center justify-center transition-colors duration-200 hover:bg-[#267a43]">
          <Search className="size-4 text-white" />
        </button>
      </div>

      {/* Dropdown */}
      {focused && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
          {suggestions.length > 0 ? (
            <div className="py-2">
              <p className={`${font} text-[11px] text-gray-400 px-4 py-1`}>ผลการค้นหา</p>
              {suggestions.map((p) => (
                <button key={p.id} onClick={() => { navigate(`/product/${p.id}`); setFocused(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer text-left`}>
                  <Search className="size-3.5 text-gray-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`${font} text-[13px] truncate`}>{p.name}</p>
                    <p className={`${font} text-[11px] text-[#319754]`}>฿{p.price.toFixed(2)}</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-2">
              {searchHistory.length > 0 && (
                <>
                  <p className={`${font} text-[11px] text-gray-400 px-4 py-1 flex items-center gap-1`}>
                    <Clock className="size-3" /> ค้นหาล่าสุด
                  </p>
                  <div className="flex flex-wrap gap-1.5 px-4 py-1.5">
                    {searchHistory.map((h) => (
                      <button key={h} onClick={() => handleSearch(h)}
                        className={`px-3 py-1 rounded-full bg-gray-100 text-[12px] ${font} text-gray-600 cursor-pointer hover:bg-gray-200`}>
                        {h}
                      </button>
                    ))}
                  </div>
                </>
              )}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <p className={`${font} text-[11px] text-gray-400 px-4 py-1 flex items-center gap-1`}>
                  <TrendingUp className="size-3" /> ยอดนิยม
                </p>
                {trending.map((t, i) => (
                  <button key={t} onClick={() => handleSearch(t)}
                    className="w-full flex items-center gap-3 px-4 py-1.5 hover:bg-gray-50 cursor-pointer text-left">
                    <span className={`${font} text-[12px] text-[#ee4d2d] w-4 text-center`} style={{ fontWeight: 600 }}>{i + 1}</span>
                    <span className={`${font} text-[13px]`}>{t}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ========== NOTIFICATION HOVER PREVIEW ========== */
const notifIconMap: Record<string, any> = {
  order: Package,
  promo: Tag,
  chat: MessageSquare,
  system: Info,
};

function NotificationHoverPreview({ notifications, unreadCount, onViewAll }: { notifications: Notification[]; unreadCount: number; onViewAll: () => void }) {
  const previewItems = notifications.slice(0, 4);

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-[12px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] w-[320px] z-50 overflow-hidden border border-gray-100">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-100">
        <span className={`${font} text-[13px] text-gray-500`}>การแจ้งเตือน</span>
        {unreadCount > 0 && (
          <span className={`${font} text-[11px] text-white bg-[#ff383c] px-2 py-0.5 rounded-full`}>{unreadCount} ใหม่</span>
        )}
      </div>
      {notifications.length === 0 ? (
        <div className="py-8 text-center">
          <Bell className="size-10 text-gray-300 mx-auto mb-2" />
          <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีการแจ้งเตือน</p>
        </div>
      ) : (
        <>
          <div className="max-h-[260px] overflow-y-auto">
            {previewItems.map((n) => {
              const Icon = notifIconMap[n.type] || Bell;
              return (
                <div key={n.id} className={`flex items-start gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors ${!n.read ? "bg-[#319754]/5" : ""}`}>
                  <div className={`size-[32px] rounded-full flex items-center justify-center shrink-0 ${
                    n.type === "order" ? "bg-blue-100 text-blue-600" :
                    n.type === "promo" ? "bg-orange-100 text-orange-600" :
                    n.type === "chat" ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-500"
                  }`}>
                    <Icon className="size-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${font} text-[12px] text-gray-800 truncate`} style={!n.read ? { fontWeight: 500 } : {}}>{n.title}</p>
                    <p className={`${font} text-[11px] text-gray-400 truncate`}>{n.message}</p>
                    <p className={`${font} text-[10px] text-gray-300 mt-0.5`}>{n.time}</p>
                  </div>
                  {!n.read && <div className="size-2 rounded-full bg-[#319754] shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
          <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50 text-center">
            <button onClick={onViewAll}
              className={`${font} text-[12px] text-[#319754] cursor-pointer hover:underline`}>
              ดูการแจ้งเตือนทั้งหมด
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ========== CART HOVER PREVIEW ========== */
function CartHoverPreview({ items, total, onGoToCart }: { items: CartItem[]; total: number; onGoToCart: () => void }) {
  const previewItems = items.slice(0, 5);
  const remaining = items.length - 5;

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-[12px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] w-[340px] z-50 overflow-hidden border border-gray-100">
      <div className="px-4 pt-3 pb-2 flex items-center justify-between border-b border-gray-100">
        <span className={`${font} text-[13px] text-gray-500`}>สินค้าที่เพิ่มล่าสุด</span>
        <span className={`${font} text-[12px] text-[#319754]`}>{items.length} ชิ้น</span>
      </div>
      {items.length === 0 ? (
        <div className="py-8 text-center">
          <ShoppingCart className="size-10 text-gray-300 mx-auto mb-2" />
          <p className={`${font} text-[13px] text-gray-400`}>ยังไม่มีสินค้าในตะกร้า</p>
        </div>
      ) : (
        <>
          <div className="max-h-[280px] overflow-y-auto">
            {previewItems.map((item) => (
              <div key={item.productId} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                <img src={item.image} className="size-[48px] rounded-[8px] object-cover border border-gray-100 shrink-0" alt="" />
                <div className="flex-1 min-w-0">
                  <p className={`${font} text-[12px] text-gray-800 truncate`}>{item.name}</p>
                  {item.option && <p className={`${font} text-[11px] text-gray-400`}>{item.option}</p>}
                </div>
                <div className="text-right shrink-0">
                  <p className={`${font} text-[12px] text-[#e62e05]`}>฿{item.price.toFixed(2)}</p>
                  <p className={`${font} text-[10px] text-gray-400`}>x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {remaining > 0 && (
            <div className="px-4 py-1.5 border-t border-gray-50">
              <p className={`${font} text-[11px] text-gray-400 text-center`}>และอีก {remaining} ชิ้นในตะกร้า</p>
            </div>
          )}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <div>
              <span className={`${font} text-[11px] text-gray-500`}>รวมทั้งหมด </span>
              <span className={`${font} text-[14px] text-[#e62e05]`} style={{ fontWeight: 600 }}>฿{total.toFixed(2)}</span>
            </div>
            <button onClick={onGoToCart}
              className={`bg-[#319754] text-white px-4 py-1.5 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#267a43] transition-colors`}>
              ดูตะกร้าสินค้า
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ========== PROFILE HOVER PREVIEW ========== */
function ProfileHoverPreview({ user, onNavigate }: { user: any; onNavigate: (path: string) => void }) {
  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-[12px] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.12)] w-[220px] z-50 overflow-hidden border border-gray-100">
      <div className="p-3 flex items-center gap-3 bg-[#d6eadd]/40">
        <img src={avatarByRole[user?.role || "user"]} className="size-[36px] rounded-full shrink-0 object-cover" alt="" />
        <div className="min-w-0">
          <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }}>{user?.username}</p>
          <p className={`${font} text-[11px] text-gray-500 truncate`}>{user?.email}</p>
        </div>
      </div>
      <div className="py-1.5">
        {[
          { label: "บัญชีของฉัน", path: "/orders", icon: User },
          { label: "คำสั่งซื้อ", path: "/orders", icon: ShoppingCart },
          { label: "สินค้าที่ชอบ", path: "/wishlist", icon: Heart },
        ].map((item) => (
          <button key={item.label} onClick={() => onNavigate(item.path)}
            className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer text-left transition-colors">
            <item.icon className="size-3.5 text-gray-400" />
            <span className={`${font} text-[12px] text-gray-700`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ========== PROFILE DIALOG ========== */
function ProfileDialog({ onClose, onNavigate }: { onClose: () => void; onNavigate: (path: string) => void }) {
  const { user, logout, switchRole } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const isOwner = user?.role === "owner";
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user" || (!isOwner && !isAdmin);

  const orderStatuses = [
    { label: "รอชำระเงิน", icon: imgOrderPay, count: 2 },
    { label: "รอตรวจสอบ", icon: imgOrderVerify, count: 1 },
    { label: "รอจัดส่ง", icon: imgOrderShip, count: 12 },
    { label: "จัดส่งแล้ว", icon: imgOrderDone, count: 1 },
  ];

  const go = (path: string) => { onNavigate(path); onClose(); };

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 bg-white rounded-[16px] shadow-[2px_4px_24px_0px_rgba(0,0,0,0.1)] w-[90vw] sm:w-[400px] z-50 overflow-hidden">
      <div className={`${isOwner ? "bg-[#e8f5e9]" : isAdmin ? "bg-[#e3f2fd]" : "bg-[#d6eadd]"} h-[150px] relative overflow-hidden`}>
        <div className="flex items-end gap-4 p-4 h-full">
          <img src={avatarByRole[user?.role || "user"]} className="size-[60px] rounded-full shrink-0 relative z-10 object-cover" alt="" />
          <div className="relative z-10">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{user?.username}</p>
            <p className={`${font} text-[14px] text-black`}>{user?.email}</p>
            <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] ${font} ${
              isOwner ? "bg-[#319754] text-white" : isAdmin ? "bg-[#3b82f6] text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {isOwner ? "🏪 เจ้าของร้านค้า" : isAdmin ? "🛡️ ผู้ดูแลระบบ" : "👤 สมาชิก"}
            </span>
          </div>
        </div>
        <img src={imgGroup41} className="absolute right-0 top-4 w-[259px] h-[207px] object-contain opacity-30 pointer-events-none" alt="" />
      </div>

      {/* User role: show order statuses */}
      {isUser && (
        <>
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>การสั่งซื้อของฉัน</span>
              <button onClick={() => go("/orders")} className={`flex items-center gap-1.5 ${font} text-[12px] text-black cursor-pointer`}>
                ดูทั้งหมด <ArrowRight className="size-4" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              {orderStatuses.map((s) => (
                <button key={s.label} onClick={() => go("/orders")} className="flex flex-col items-center gap-2.5 w-[90px] cursor-pointer">
                  <div className="bg-[#f5f5f5] rounded-[16px] size-[48px] p-1.5 relative">
                    {s.count > 0 && (
                      <span className="absolute -top-2.5 -right-2.5 bg-[#ff383c] text-white text-[8px] px-2 py-1 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] z-10">
                        {s.count}
                      </span>
                    )}
                    <img src={s.icon} className="w-full h-full object-cover" alt="" />
                  </div>
                  <span className={`${font} text-[12px] text-black text-center`}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-[#d4d4d8] mx-0" />
          <div className="px-4 py-3 space-y-2.5">
            {[
              { icon: User, label: "บัญชีของฉัน", path: "/account", color: "text-black" },
              { icon: MapPin, label: "ที่อยู่จัดส่ง", path: "/addresses", color: "text-black" },
              { icon: Heart, label: "สินค้าที่ชอบ", path: "/wishlist", color: "text-black" },
              { icon: Ticket, label: "คูปองของฉัน", path: "/my-coupons", color: "text-black" },
            ].map((item) => (
              <button key={item.label} onClick={() => go(item.path)}
                className={`flex items-center gap-2.5 cursor-pointer w-full text-left ${item.color}`}>
                <div className="bg-[#f5f5f5] size-[28px] rounded-full flex items-center justify-center shrink-0">
                  <item.icon className="size-3" />
                </div>
                <span className={`${font} text-[14px]`}>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Owner role: shop management menu */}
      {isOwner && (
        <>
          <div className="px-4 py-3 space-y-2.5">
            <p className={`${font} text-[11px] text-gray-400 uppercase tracking-wider`}>จัดการร้านค้า</p>
            {[
              { icon: BarChart3, label: "ภาพรวมร้านค้า", path: "/owner" },
              { icon: ShoppingCart, label: "คำสั่งซื้อ", path: "/owner" },
              { icon: Package, label: "จัดการสินค้า", path: "/owner" },
              { icon: Store, label: "หน้าร้านค้า", path: "/shop/metaherb" },
              { icon: Ticket, label: "คูปองและโปรโมชั่น", path: "/owner" },
              { icon: Monitor, label: "ตั้งค่าร้านค้า", path: "/owner" },
            ].map((item) => (
              <button key={item.label} onClick={() => go(item.path)}
                className="flex items-center gap-2.5 cursor-pointer w-full text-left text-black">
                <div className="bg-[#319754]/10 size-[28px] rounded-full flex items-center justify-center shrink-0">
                  <item.icon className="size-3 text-[#319754]" />
                </div>
                <span className={`${font} text-[14px]`}>{item.label}</span>
              </button>
            ))}
            <div className="h-px bg-gray-100 my-1" />
            <button onClick={() => go("/")}
              className="flex items-center gap-2.5 cursor-pointer w-full text-left text-[#319754]">
              <div className="bg-[#319754]/10 size-[28px] rounded-full flex items-center justify-center shrink-0">
                <ArrowRight className="size-3 text-[#319754] rotate-180" />
              </div>
              <span className={`${font} text-[14px]`}>กลับสู่เว็บไซต์หลัก</span>
            </button>
          </div>
        </>
      )}

      {/* Admin role: admin management menu */}
      {isAdmin && (
        <>
          <div className="px-4 py-3 space-y-2.5">
            <p className={`${font} text-[11px] text-gray-400 uppercase tracking-wider`}>ระบบหลังบ้าน</p>
            {[
              { icon: BarChart3, label: "ภาพรวมระบบ", path: "/admin" },
              { icon: DollarSign, label: "รายงานยอดขาย", path: "/admin" },
              { icon: Users, label: "จัดการผู้ใช้", path: "/admin" },
              { icon: Store, label: "จัดการร้านค้า", path: "/admin" },
              { icon: Image, label: "จัดการ Banner", path: "/admin" },
              { icon: Shield, label: "จัดการแอดมิน", path: "/admin" },
              { icon: Settings, label: "ตั้งค่าระบบ", path: "/admin" },
            ].map((item) => (
              <button key={item.label} onClick={() => go(item.path)}
                className="flex items-center gap-2.5 cursor-pointer w-full text-left text-black">
                <div className="bg-[#3b82f6]/10 size-[28px] rounded-full flex items-center justify-center shrink-0">
                  <item.icon className="size-3 text-[#3b82f6]" />
                </div>
                <span className={`${font} text-[14px]`}>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Quick switch sections — testing helper */}
      <div className="h-px bg-[#d4d4d8]" />
      <div className="px-4 py-3 space-y-2.5">
        <p className={`${font} text-[11px] text-gray-400 uppercase tracking-wider`}>สลับมุมมอง</p>
        {[
          { role: "user" as const, label: "ฉัน", icon: User, color: "#319754", path: "/" },
          { role: "owner" as const, label: "ร้านค้าของฉัน", icon: Store, color: "#319754", path: "/owner" },
          { role: "admin" as const, label: "ตั้งค่าบนเว็บไซต์", icon: Shield, color: "#3b82f6", path: "/admin" },
        ].filter((s) => s.role !== user?.role).map((s) => (
          <button key={s.role} onClick={() => { switchRole(s.role); navigate(s.path); onClose(); }}
            className="flex items-center gap-2.5 cursor-pointer w-full text-left hover:bg-gray-50 rounded-md -mx-1 px-1 py-1 transition-colors">
            <div className="size-[28px] rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: `${s.color}1a` }}>
              <s.icon className="size-3" style={{ color: s.color }} />
            </div>
            <span className={`${font} text-[14px] text-black`}>{s.label}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-[#d4d4d8]" />

      <div className="px-4 py-3">
        <button onClick={() => { logout(); navigate("/"); onClose(); }}
          className="flex items-center gap-2.5 cursor-pointer text-[#ff383c]">
          <div className="bg-[#f5f5f5] size-[28px] rounded-full flex items-center justify-center shrink-0">
            <LogOut className="size-3 text-[#ff383c]" />
          </div>
          <span className={`${font} text-[14px] text-[#ff383c]`}>ออกจากระบบ</span>
        </button>
      </div>
    </div>
  );
}

/* ========== LAYOUT ========== */
export function Layout() {
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, itemCount, total: cartTotal } = useCart();
  const { notifications, unreadCount } = useNotifications();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  // Scroll to top whenever the route (path or search/query) changes.
  // Skips on hash links so in-page anchors keep working.
  useEffect(() => {
    if (location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname, location.search]);

  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const isOwner = isAuthenticated && user?.role === "owner";
  const isAdmin = isAuthenticated && user?.role === "admin";
  const isStaffRole = isOwner || isAdmin;

  const userMenuItems = [
    { label: "หน้าหลัก", path: "/" },
    { label: "ผลิตภัณท์", path: "/products" },
    { label: "สาระความรู้", path: "/blog" },
  ];

  const ownerMenuItems = [
    { label: "ภาพรวม", path: "/owner" },
    { label: "หน้าร้านค้า", path: "/shop/metaherb" },
  ];

  const adminMenuItems = [
    { label: "แผงควบคุม", path: "/admin" },
  ];

  const menuItems = isOwner ? ownerMenuItems : isAdmin ? adminMenuItems : userMenuItems;

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  // Auto-redirect owner/admin to their dashboard on login
  useEffect(() => {
    if (!isAuthenticated) return;
    const shoppingPaths = ["/", "/products", "/cart", "/payment", "/orders", "/wishlist", "/coupons", "/my-coupons", "/blog"];
    const isOnShoppingPage = shoppingPaths.some((p) => location.pathname === p) || location.pathname.startsWith("/product/") || location.pathname.startsWith("/verify-payment/") || location.pathname.startsWith("/blog/");
    if (isOwner && isOnShoppingPage) {
      navigate("/owner", { replace: true });
    } else if (isAdmin && isOnShoppingPage) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, user?.role, location.pathname]);

  return (
    <div className={`flex flex-col w-full ${isStaffRole ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* Header */}
      <header className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.9)] sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-[124px] py-3 sm:py-4">
          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 cursor-pointer">
            {mobileMenuOpen ? <X className="size-6 text-gray-600" /> : <Menu className="size-6 text-gray-600" />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0" onClick={() => navigate(isOwner ? "/owner" : isAdmin ? "/admin" : "/")}>
            <img src={imgLogo} className="size-[40px] sm:size-[58px] shrink-0" alt="MetaHerb" />
            <span className={`${fontBold} text-[18px] sm:text-[24px] whitespace-nowrap`} style={{ fontWeight: 700 }}>
              <span className="text-[#ed1c24]">META</span>
              <span className="text-[#f7931d]">HERB</span>
            </span>
            {/* Role badge next to logo */}
            {isOwner && (
              <span className={`hidden sm:inline-flex items-center gap-1 ml-2 px-2.5 py-1 rounded-full bg-[#319754]/10 text-[#319754] text-[11px] ${font}`}>
                <Store className="size-3" /> ร้านค้า
              </span>
            )}
            {isAdmin && (
              <span className={`hidden sm:inline-flex items-center gap-1 ml-2 px-2.5 py-1 rounded-full bg-[#3b82f6]/10 text-[#3b82f6] text-[11px] ${font}`}>
                <Shield className="size-3" /> แอดมิน
              </span>
            )}
          </div>

          {/* Search - desktop (user only) */}
          {!isStaffRole && <SearchBar className="hidden md:block w-[300px] lg:w-[412px] shrink-0 mx-4" />}

          {/* Spacer for staff roles */}
          {isStaffRole && <div className="flex-1" />}

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4 justify-end">
            {/* Mobile search toggle (user only) */}
            {!isStaffRole && (
              <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden p-1 cursor-pointer">
                <Search className="size-5 text-gray-600" />
              </button>
            )}

            {/* Notifications */}
            <div className="relative group/notif hidden sm:block">
              <button onClick={() => { if (isAuthenticated) { setShowNotifications(!showNotifications); setShowProfile(false); } else { navigate("/login"); } }}
                className="group/icon backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] hover:bg-[#319754]/10 rounded-[100px] size-[36px] sm:size-[40px] cursor-pointer relative flex items-center justify-center transition-colors">
                <Bell className="size-[20px] sm:size-[22px] text-gray-700 group-hover/icon:text-[#287745] transition-colors" strokeWidth={2} />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && isAuthenticated && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
              {!showNotifications && isAuthenticated && (
                <div className="hidden group-hover/notif:block">
                  <NotificationDropdown onClose={() => setShowNotifications(false)} />
                </div>
              )}
            </div>
            {/* Notifications - mobile (no hover) */}
            <div className="relative sm:hidden">
              <button onClick={() => { if (isAuthenticated) { setShowNotifications(!showNotifications); setShowProfile(false); } else { navigate("/login"); } }}
                className="group/icon backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] hover:bg-[#319754]/10 rounded-[100px] size-[36px] cursor-pointer relative flex items-center justify-center transition-colors">
                <Bell className="size-[20px] text-gray-700 group-hover/icon:text-[#287745] transition-colors" strokeWidth={2} />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && isAuthenticated && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>

            {/* Cart (user only) */}
            {!isStaffRole && (
              <>
                <div className="relative group/cart hidden sm:block">
                  <button onClick={() => navigate("/cart")}
                    className="group/icon backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] hover:bg-[#319754]/10 rounded-[100px] size-[36px] sm:size-[40px] cursor-pointer relative flex items-center justify-center transition-colors">
                    <ShoppingCart className="size-[20px] sm:size-[22px] text-gray-700 group-hover/icon:text-[#287745] transition-colors" strokeWidth={2} />
                    {isAuthenticated && itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                        {itemCount}
                      </span>
                    )}
                  </button>
                  {isAuthenticated && (
                    <div className="hidden group-hover/cart:block">
                      <CartHoverPreview
                        items={cartItems}
                        total={cartTotal}
                        onGoToCart={() => navigate("/cart")}
                      />
                    </div>
                  )}
                </div>
                {/* Cart - mobile (no hover) */}
                <div className="relative sm:hidden">
                  <button onClick={() => navigate("/cart")}
                    className="group/icon backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] hover:bg-[#319754]/10 rounded-[100px] size-[36px] cursor-pointer relative flex items-center justify-center transition-colors">
                    <ShoppingCart className="size-[20px] text-gray-700 group-hover/icon:text-[#287745] transition-colors" strokeWidth={2} />
                    {isAuthenticated && itemCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                        {itemCount}
                      </span>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* Profile / Auth buttons */}
            {isAuthenticated ? (
              <div className="relative group/profile">
                <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="cursor-pointer shrink-0">
                  <img src={avatarByRole[user?.role || "user"]} className="size-[48px] rounded-full object-cover" alt="profile" />
                </button>
                {showProfile && (
                  <ProfileDialog
                    onClose={() => setShowProfile(false)}
                    onNavigate={(path) => { navigate(path); setShowProfile(false); }}
                  />
                )}
                {!showProfile && (
                  <div className="hidden sm:group-hover/profile:block">
                    <ProfileDialog
                      onClose={() => setShowProfile(false)}
                      onNavigate={(path) => { navigate(path); }}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <button onClick={() => navigate("/register")}
                  className={`border border-[#db8b0a] text-[#db8b0a] h-[40px] px-3 sm:w-[120px] rounded-full text-[12px] sm:text-[14px] ${font} cursor-pointer hover:bg-[#db8b0a]/5`}>
                  สมัคร<span className="hidden sm:inline">สมาชิก</span>
                </button>
                <button onClick={() => navigate("/login")}
                  className={`bg-[#319754] text-white h-[40px] px-3 sm:w-[120px] rounded-full text-[12px] sm:text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>
                  เข้าสู่ระบบ
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile search bar (user only) */}
        {!isStaffRole && mobileSearchOpen && (
          <div className="md:hidden px-4 pb-3">
            <SearchBar className="w-full" />
          </div>
        )}

        {/* Menu Bar - Desktop */}
        <nav className="bg-[#319754] hidden md:block">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2 py-2.5 px-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`px-4 py-1.5 rounded-full text-[14px] text-white ${font} cursor-pointer relative transition-colors ${
                  location.pathname === item.path ? "" : "hover:bg-white/10"
                }`}
              >
                {location.pathname === item.path && (
                  <motion.div layoutId="topnav-bg" className="absolute inset-0 bg-black/15 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            ))}
            {!isStaffRole && (
              <button onClick={() => navigate("/about")} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[14px] text-white ${font} cursor-pointer relative ${location.pathname === "/about" ? "" : "hover:bg-white/10"}`}>
                {location.pathname === "/about" && (
                  <motion.div layoutId="topnav-bg" className="absolute inset-0 bg-black/15 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">เกี่ยวกับเรา</span>
              </button>
            )}
            {isStaffRole && (
              <button onClick={() => navigate("/settings")} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[14px] text-white ${font} cursor-pointer relative transition-colors ${location.pathname === "/settings" ? "" : "hover:bg-white/10"}`}>
                {location.pathname === "/settings" && (
                  <motion.div layoutId="topnav-bg" className="absolute inset-0 bg-black/15 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                )}
                <span className="relative z-10">ตั้งค่า</span>
              </button>
            )}
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="flex flex-col py-2">
              {menuItems.map((item) => (
                <button key={item.path} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer ${
                    location.pathname === item.path ? "text-[#319754] bg-[#319754]/5" : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  {item.label}
                </button>
              ))}
              {!isStaffRole && (
                <>
                  <button onClick={() => navigate("/wishlist")}
                    className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer text-gray-700 hover:bg-gray-50 flex items-center gap-2`}>
                    <Heart className="size-4" /> สินค้าที่ชอบ
                    {wishlistCount > 0 && <span className="bg-[#ff383c] text-white text-[10px] px-1.5 rounded-full">{wishlistCount}</span>}
                  </button>
                  <button onClick={() => { navigate("/about"); setMobileMenuOpen(false); }} className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer ${location.pathname === "/about" ? "text-[#319754] bg-[#319754]/5" : "text-gray-700 hover:bg-gray-50"}`}>
                    เกี่ยวกับเรา
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className={`flex-1 ${isStaffRole ? "overflow-hidden min-h-0" : ""}`} style={{ backgroundColor: "#fafafa" }}>
        <div className={isStaffRole ? "h-full" : ""}>
          <Outlet />
        </div>
      </main>

      {/* Chat Modal - Shopee-style floating chat */}
      {isAuthenticated && <ChatModal />}

      {/* Footer (user only) */}
      {!isStaffRole && (
      <footer>
        <div className="bg-[#226a3b]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-[124px] py-6 sm:py-8">
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
                <p key={item} className={`${font} text-[12px] cursor-pointer hover:underline`}>{item}</p>
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
                    <path d="M26 14.7c0-4.5-4.5-8.2-10-8.2S6 10.2 6 14.7c0 4 3.6 7.4 8.4 8.1.3.1.7.2.8.5.1.3.1.7 0 1l-.1.8c0 .2-.2 1 .9.5 1.1-.5 5.7-3.4 7.8-5.8 1.4-1.6 2.2-3.3 2.2-5.1zM12.8 17.1c0 .1-.1.2-.2.2H10c-.1 0-.2 0-.2-.1l-.1-.1v-4.4c0-.1.1-.2.2-.2h.7c.1 0 .2.1.2.2v3.5h2c.1 0 .2.1.2.2v.7zm1.7 0c0 .1-.1.2-.2.2h-.7c-.1 0-.2-.1-.2-.2v-4.4c0-.1.1-.2.2-.2h.7c.1 0 .2.1.2.2v4.4zm5 0c0 .1-.1.2-.2.2h-.8s-.1 0-.1-.1l-2-2.7v2.6c0 .1-.1.2-.2.2h-.7c-.1 0-.2-.1-.2-.2v-4.4c0-.1.1-.2.2-.2h.8s.1 0 .1.1l2 2.7v-2.6c0-.1.1-.2.2-.2h.7c.1 0 .2.1.2.2v4.4zm4.1-3.7c0 .1-.1.2-.2.2h-2v.7h2c.1 0 .2.1.2.2v.7c0 .1-.1.2-.2.2h-2v.7h2c.1 0 .2.1.2.2v.7c0 .1-.1.2-.2.2h-2.9c-.1 0-.2-.1-.2-.2v-4.3c0-.1.1-.2.2-.2h2.9c.1 0 .2.1.2.2v.7z" fill="#fff" />
                  </svg>
                ) },
                { name: "Instagram", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <defs>
                      <radialGradient id="igGrad" cx="0.3" cy="1" r="1.2">
                        <stop offset="0%" stopColor="#FED576" />
                        <stop offset="25%" stopColor="#F47133" />
                        <stop offset="50%" stopColor="#BC3081" />
                        <stop offset="100%" stopColor="#4F5BD5" />
                      </radialGradient>
                    </defs>
                    <rect width="32" height="32" rx="9" fill="url(#igGrad)" />
                    <rect x="8" y="8" width="16" height="16" rx="5" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="16" cy="16" r="4" fill="none" stroke="#fff" strokeWidth="2" />
                    <circle cx="21.5" cy="10.5" r="1.2" fill="#fff" />
                  </svg>
                ) },
                { name: "Tiktok", icon: (
                  <svg viewBox="0 0 32 32" className="size-[22px]">
                    <circle cx="16" cy="16" r="16" fill="#000" />
                    <path d="M21.5 12.4c-1.6-.3-3-1.4-3.6-2.9h-2.5v9.7c0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3.2 0 .5 0 .7.1v-2.6c-.2 0-.5-.1-.7-.1-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9V14.6c1.1.7 2.4 1.2 3.8 1.2v-2.6c-.1 0-.2 0-.3-.1z" fill="#FF0050" opacity="0.8" />
                    <path d="M22 12c-1.6-.3-3-1.4-3.6-2.9H16v9.7c0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3.2 0 .5 0 .7.1V14c-.2 0-.5-.1-.7-.1-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9V14.2c1.1.7 2.4 1.2 3.8 1.2v-2.6c-.1 0-.3 0-.4-.1z" fill="#00F2EA" opacity="0.8" />
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
      )}
    </div>
  );
}