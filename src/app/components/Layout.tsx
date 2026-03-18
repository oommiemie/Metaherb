import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import type { CartItem } from "../store/CartContext";
import { useOrders } from "../store/OrderContext";
import { useNotifications } from "../store/NotificationContext";
import type { Notification } from "../store/NotificationContext";
import { useWishlist } from "../store/WishlistContext";
import { ShoppingCart, Bell, Search, ChevronDown, User, LogOut, Store, Shield, MapPin, Heart, Ticket, Monitor, ArrowRight, Menu, X, Clock, TrendingUp, Package, Tag, MessageSquare, Info } from "lucide-react";
import { NotificationDropdown } from "./NotificationDropdown";
import { ChatModal } from "./ChatModal";
import imgLogo from "figma:asset/c494dc0dab30c1bf59f2f6e2c114db61b1755370.png";
import imgSocial from "figma:asset/70017910a949817aa1c11716388ee64b40b2eafa.png";
import imgBell from "figma:asset/bc0647483cfb5a707f778cc18a602a7932c0287f.png";
import imgCart from "figma:asset/e7332f142579e51e8632e5d3048cd86f0f80158a.png";
import imgAvatar from "figma:asset/02fc4d2560c804d8d3f2f8e525b1926bf3ef0ac2.png";
import imgGroup41 from "figma:asset/8be1dbf7f80482d74e88f48b419a6464198f2b87.png";
import imgOrderPay from "figma:asset/6b92d0e6831d20c47dd648a6fca5410d5d285bd6.png";
import imgOrderVerify from "figma:asset/bc3856a249e9261822188ed229ddd0e2ad6d0b2d.png";
import imgOrderShip from "figma:asset/6fe3df791a7ffa4eb26dc3d280886d11308e2b73.png";
import imgOrderDone from "figma:asset/affa7b2c27f58769e6b6bc5c0bac9bbeee21a3ef.png";
import { useState, useRef, useEffect } from "react";
import { products } from "../data/products";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai',sans-serif]";

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
        <img src={imgAvatar} className="size-[36px] rounded-full shrink-0" alt="" />
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
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const orderStatuses = [
    { label: "รอชำระเงิน", icon: imgOrderPay, count: 2 },
    { label: "รอตรวจสอบ", icon: imgOrderVerify, count: 1 },
    { label: "รอจัดส่ง", icon: imgOrderShip, count: 12 },
    { label: "จัดส่งแล้ว", icon: imgOrderDone, count: 1 },
  ];

  const menuSections = [
    {
      items: [
        { icon: User, label: "บัญชีของฉัน", path: "/orders", color: "text-black" },
        { icon: MapPin, label: "ที่อยู่จัดส่ง", path: "/orders", color: "text-black" },
        { icon: Heart, label: "สินค้าที่ชอบ", path: "/wishlist", color: "text-black" },
        { icon: Ticket, label: "คูปองของฉัน", path: "/coupons", color: "text-black" },
      ],
    },
    {
      items: [
        ...(user?.role === "owner" ? [{ icon: Store, label: "ร้านค้าของฉัน", path: "/owner", color: "text-black" }] : []),
        ...(user?.role === "admin" ? [{ icon: Shield, label: "แผงควบคุม", path: "/admin", color: "text-black" }] : []),
        { icon: Monitor, label: "ตั้งค่าระบบ", path: "/orders", color: "text-black" },
      ],
    },
  ];

  const go = (path: string) => { onNavigate(path); onClose(); };

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 bg-white rounded-[16px] shadow-[2px_4px_24px_0px_rgba(0,0,0,0.1)] w-[90vw] sm:w-[400px] z-50 overflow-hidden">
      <div className="bg-[#d6eadd] h-[150px] relative overflow-hidden">
        <div className="flex items-end gap-4 p-4 h-full">
          <img src={imgAvatar} className="size-[60px] rounded-full shrink-0 relative z-10" alt="" />
          <div className="relative z-10">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{user?.username}</p>
            <p className={`${font} text-[14px] text-black`}>{user?.email}</p>
          </div>
        </div>
        <img src={imgGroup41} className="absolute right-0 top-4 w-[259px] h-[207px] object-contain opacity-30 pointer-events-none" alt="" />
      </div>

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

      {menuSections.map((section, si) => (
        <div key={si}>
          <div className="px-4 py-3 space-y-2.5">
            {section.items.map((item) => (
              <button key={item.label} onClick={() => go(item.path)}
                className={`flex items-center gap-2.5 cursor-pointer w-full text-left ${item.color}`}>
                <div className="bg-[#f5f5f5] size-[28px] rounded-full flex items-center justify-center shrink-0">
                  <item.icon className="size-3" />
                </div>
                <span className={`${font} text-[14px]`}>{item.label}</span>
              </button>
            ))}
          </div>
          {si < menuSections.length - 1 && <div className="h-px bg-[#d4d4d8]" />}
        </div>
      ))}

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
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const menuItems = [
    { label: "หน้าหลัก", path: "/" },
    { label: "ผลิตภัณท์", path: "/products" },
    { label: "สาระความรู้", path: "/blog" },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen w-full">
      {/* Header */}
      <header className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.9)] sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-[124px] py-3 sm:py-4">
          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-1.5 cursor-pointer">
            {mobileMenuOpen ? <X className="size-6 text-gray-600" /> : <Menu className="size-6 text-gray-600" />}
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 cursor-pointer shrink-0" onClick={() => navigate("/")}>
            <img src={imgLogo} className="size-[40px] sm:size-[58px] shrink-0" alt="MetaHerb" />
            <span className={`${fontBold} text-[18px] sm:text-[24px] whitespace-nowrap`} style={{ fontWeight: 700 }}>
              <span className="text-[#ed1c24]">META</span>
              <span className="text-[#f7931d]">HERB</span>
            </span>
          </div>

          {/* Search - desktop */}
          <SearchBar className="hidden md:block w-[300px] lg:w-[412px] shrink-0 mx-4" />

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-4 justify-end">
            {/* Mobile search toggle */}
            <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden p-1 cursor-pointer">
              <Search className="size-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <div className="relative group/notif hidden sm:block">
              <button onClick={() => { if (isAuthenticated) { setShowNotifications(!showNotifications); setShowProfile(false); } else { navigate("/login"); } }}
                className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] rounded-[100px] size-[36px] sm:size-[40px] cursor-pointer relative flex items-center justify-center">
                <img src={imgBell} className="size-[20px] sm:size-[22px] object-contain" alt="notifications" />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && isAuthenticated && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
              {!showNotifications && isAuthenticated && (
                <div className="hidden group-hover/notif:block">
                  <NotificationHoverPreview
                    notifications={notifications}
                    unreadCount={unreadCount}
                    onViewAll={() => setShowNotifications(true)}
                  />
                </div>
              )}
            </div>
            {/* Notifications - mobile (no hover) */}
            <div className="relative sm:hidden">
              <button onClick={() => { if (isAuthenticated) { setShowNotifications(!showNotifications); setShowProfile(false); } else { navigate("/login"); } }}
                className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] rounded-[100px] size-[36px] cursor-pointer relative flex items-center justify-center">
                <img src={imgBell} className="size-[20px] object-contain" alt="notifications" />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && isAuthenticated && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>

            {/* Cart */}
            <div className="relative group/cart hidden sm:block">
              <button onClick={() => navigate("/cart")}
                className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] rounded-[100px] size-[36px] sm:size-[40px] cursor-pointer relative flex items-center justify-center">
                <img src={imgCart} className="size-[20px] sm:size-[22px] object-contain" alt="cart" />
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
                className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] rounded-[100px] size-[36px] cursor-pointer relative flex items-center justify-center">
                <img src={imgCart} className="size-[20px] object-contain" alt="cart" />
                {isAuthenticated && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#ff383c] text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center px-1 rounded-full z-10 shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] border-2 border-white">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile / Auth buttons */}
            {isAuthenticated ? (
              <div className="relative group/profile">
                <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }} className="cursor-pointer shrink-0">
                  <img src={imgAvatar} className="size-[48px] rounded-full" alt="profile" />
                </button>
                {showProfile && (
                  <ProfileDialog
                    onClose={() => setShowProfile(false)}
                    onNavigate={(path) => { navigate(path); setShowProfile(false); }}
                  />
                )}
                {!showProfile && (
                  <div className="hidden sm:group-hover/profile:block">
                    <ProfileHoverPreview
                      user={user}
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

        {/* Mobile search bar */}
        {mobileSearchOpen && (
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
                className={`px-4 py-1.5 rounded-full text-[14px] text-white ${font} cursor-pointer transition-colors ${
                  location.pathname === item.path ? "bg-black/15" : "hover:bg-white/10"
                }`}
              >
                {item.label}
              </button>
            ))}
            <button onClick={() => navigate("/about")} className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[14px] text-white ${font} cursor-pointer ${location.pathname === "/about" ? "bg-black/15" : "hover:bg-white/10"}`}>
              เกี่ยวกับเรา
            </button>
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
              <button onClick={() => navigate("/wishlist")}
                className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer text-gray-700 hover:bg-gray-50 flex items-center gap-2`}>
                <Heart className="size-4" /> สินค้าที่ชอบ
                {wishlistCount > 0 && <span className="bg-[#ff383c] text-white text-[10px] px-1.5 rounded-full">{wishlistCount}</span>}
              </button>
              <button onClick={() => { navigate("/about"); setMobileMenuOpen(false); }} className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer ${location.pathname === "/about" ? "text-[#319754] bg-[#319754]/5" : "text-gray-700 hover:bg-gray-50"}`}>
                เกี่ยวกับเรา
              </button>
              {isAuthenticated && user?.role === "owner" && (
                <button onClick={() => { navigate("/owner"); setMobileMenuOpen(false); }}
                  className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer text-[#319754] border-t border-gray-100`}>
                  จัดการร้านค้า
                </button>
              )}
              {isAuthenticated && user?.role === "admin" && (
                <button onClick={() => { navigate("/admin"); setMobileMenuOpen(false); }}
                  className={`px-6 py-3 text-left text-[14px] ${font} cursor-pointer text-[#319754] border-t border-gray-100`}>
                  แผงควบคุม
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 bg-[#fafafa]">
        <Outlet />
      </main>

      {/* Chat Modal - Shopee-style floating chat */}
      {isAuthenticated && <ChatModal />}

      {/* Footer */}
      <footer>
        <div className="bg-gradient-to-t from-[#226a3b] to-[#5aac76] via-[#319754]">
          <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-[124px] py-6 sm:py-8">
            <div className="flex flex-col gap-3 text-white">
              <div className="flex items-center gap-2.5">
                <img src={imgLogo} className="size-[48px]" alt="" />
                <span className={`${fontBold} text-[20px]`}>METAHERB</span>
              </div>
              <p className={`${font} text-[12px] leading-relaxed`}>
                บริษัทเมต้าเฮิร์บ จำกัด ที่อยู่ : บ้านเลขที่ 459/153 หมู่บ้านนิวไฮบ์<br />
                สุขสวัสดิ์ ถนนสุขสวัสดิ์แขวงราษฎรบูรณะ เขต ราษฎร์บรณะ<br />
                จังหวัด กรุงเทพมหานคร 10140
              </p>
              <p className={`${font} text-[12px]`}>เบอร์โทรศัพท์ : 061-421-3111</p>
              <p className={`${font} text-[12px]`}>อีเมล : Metaherb@gmail.com</p>
            </div>
            <div className="flex flex-col gap-3 text-white">
              <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>เกี่ยวกับเรา</p>
              <p className={`${font} text-[12px] cursor-pointer hover:underline`}>นโยบาย</p>
              <p className={`${font} text-[12px] cursor-pointer hover:underline`}>About me</p>
            </div>
            <div className="flex flex-col gap-3 text-white">
              <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ติดตามเรา</p>
              {["Facebook", "Line", "Instagram", "Tiktok", "Youtube"].map((s) => (
                <div key={s} className="flex items-center gap-2.5">
                  <img src={imgSocial} className="size-5 rounded-full" alt="" />
                  <span className={`${font} text-[12px]`}>{s}</span>
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