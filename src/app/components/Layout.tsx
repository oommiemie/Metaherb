import { Outlet, useNavigate, useLocation } from "react-router";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import type { CartItem } from "../store/CartContext";
import { useOrders } from "../store/OrderContext";
import { useNotifications } from "../store/NotificationContext";
import type { Notification } from "../store/NotificationContext";
import { useWishlist } from "../store/WishlistContext";
import { ShoppingCart, Bell, Search, ChevronDown, User, LogOut, Store, Shield, MapPin, Heart, Ticket, Monitor, ArrowRight, Menu, X, Clock, TrendingUp, Package, Tag, MessageSquare, Info, BarChart3, DollarSign, Users, Image, Settings, Phone, Wallet, ClipboardCheck, Truck, PackageCheck, Mail, Leaf, ShieldCheck } from "lucide-react";

const ShieldCheckLite = () => <ShieldCheck className="size-[12px] text-[#46c474]" strokeWidth={2.4} />;
import { NotificationDropdown } from "./NotificationDropdown";
import { ChatModal } from "./ChatModal";
import imgLogo from "../../assets/logo.png";
import imgQRCode from "../../assets/QRcordline.png";
import imgLeafA from "../../assets/herb-leaf-a.png";
import imgLeafB from "../../assets/herb-leaf-b.png";
import imgLeafC from "../../assets/herb-leaf-c.png";
import imgLeafD from "../../assets/herb-leaf-d.png";
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
import { useLanguage, LANG_OPTIONS } from "../store/LanguageContext";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const APP_VERSION = "1.0.0";

/* ===== Botanical leaf SVG — realistic herb leaf with veins (footer watermark) ===== */
function BotanicalLeaf({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 100 140" className={className} style={style} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
      {/* Stem */}
      <path d="M50 138 C50 120, 50 100, 50 80" strokeWidth="1.2" />
      {/* Leaf body — pointed oval (lanceolate) */}
      <path d="M50 4 C28 22, 12 50, 14 80 C16 100, 30 118, 50 124 C70 118, 84 100, 86 80 C88 50, 72 22, 50 4 Z" strokeWidth="1.3" />
      {/* Central vein (midrib) */}
      <path d="M50 8 L50 122" strokeWidth="1" />
      {/* Side veins — left side (curving down-out from midrib) */}
      <path d="M50 20 Q35 28, 20 38" strokeWidth="0.7" />
      <path d="M50 36 Q32 46, 16 56" strokeWidth="0.7" />
      <path d="M50 54 Q30 64, 15 76" strokeWidth="0.7" />
      <path d="M50 72 Q32 82, 20 92" strokeWidth="0.7" />
      <path d="M50 90 Q35 98, 26 106" strokeWidth="0.7" />
      <path d="M50 106 Q40 112, 34 118" strokeWidth="0.7" />
      {/* Side veins — right side */}
      <path d="M50 20 Q65 28, 80 38" strokeWidth="0.7" />
      <path d="M50 36 Q68 46, 84 56" strokeWidth="0.7" />
      <path d="M50 54 Q70 64, 85 76" strokeWidth="0.7" />
      <path d="M50 72 Q68 82, 80 92" strokeWidth="0.7" />
      <path d="M50 90 Q65 98, 74 106" strokeWidth="0.7" />
      <path d="M50 106 Q60 112, 66 118" strokeWidth="0.7" />
    </svg>
  );
}

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
    { label: "รอชำระเงิน", Icon: Wallet,          count: 2,  tint: "#f97316" },  // orange
    { label: "รอตรวจสอบ", Icon: ClipboardCheck,  count: 1,  tint: "#0ea5e9" },  // sky
    { label: "รอจัดส่ง",   Icon: Package,         count: 12, tint: "#a855f7" },  // purple
    { label: "จัดส่งแล้ว", Icon: Truck,           count: 1,  tint: "#319754" },  // brand green
  ];

  const go = (path: string) => { onNavigate(path); onClose(); };

  const accent = isAdmin ? "#3b82f6" : "#319754";
  const accentDark = isAdmin ? "#1d4ed8" : "#1d5b32";
  const accentLight = isAdmin ? "#60a5fa" : "#46c474";

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 bg-white rounded-[20px] shadow-[0_20px_50px_-12px_rgba(16,24,40,0.22)] w-[92vw] sm:w-[380px] z-50 overflow-hidden border border-gray-100/80">
      {/* ===== HEADER with role-based gradient ===== */}
      <div className="relative px-5 pt-5 pb-4 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accentLight} 0%, ${accent} 55%, ${accentDark} 100%)` }}>
        {/* Decorative blurs */}
        <div className="absolute -top-10 -right-8 size-32 rounded-full bg-white/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-6 size-28 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img src={avatarByRole[user?.role || "user"]}
              className="size-[58px] rounded-full object-cover ring-[3px] ring-white/70 shadow-[0_6px_16px_-4px_rgba(0,0,0,0.3)]" alt="" />
          </div>
          <div className="flex-1 min-w-0 pt-0.5">
            <p className={`${font} text-[17px] text-white truncate leading-tight`} style={{ fontWeight: 600 }}>{user?.username}</p>
            <p className={`${font} text-[12px] text-white/90 truncate mt-0.5`}>{user?.email}</p>
            <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-[3px] rounded-full text-[11px] ${font} bg-white/25 text-white backdrop-blur-sm ring-1 ring-white/20`} style={{ fontWeight: 500 }}>
              {isOwner ? <><Store className="size-3" strokeWidth={2.4} /> เจ้าของร้านค้า</> :
               isAdmin ? <><Shield className="size-3" strokeWidth={2.4} /> ผู้ดูแลระบบ</> :
                         <><User className="size-3" strokeWidth={2.4} /> สมาชิก</>}
            </span>
          </div>
        </div>
      </div>

      {/* ===== USER: order statuses + menu ===== */}
      {isUser && (
        <>
          <div className="px-4 pt-4 pb-3">
            <div className="flex items-center justify-between mb-2.5">
              <span className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 600 }}>การสั่งซื้อของฉัน</span>
              <button onClick={() => go("/orders")} className={`flex items-center gap-0.5 ${font} text-[11px] text-[#319754] hover:underline cursor-pointer`} style={{ fontWeight: 500 }}>
                ดูทั้งหมด <ArrowRight className="size-3" strokeWidth={2.4} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {orderStatuses.map((s) => (
                <button key={s.label} onClick={() => go("/orders")}
                  className="group/order flex flex-col items-center gap-1.5 px-1 py-2 rounded-[12px] hover:bg-gray-50 active:scale-[0.97] transition-all cursor-pointer">
                  <div className="relative size-[42px] rounded-[14px] flex items-center justify-center transition-all duration-200 group-hover/order:scale-[1.05]"
                    style={{ background: `linear-gradient(135deg, ${s.tint}1f 0%, ${s.tint}33 100%)`, boxShadow: `inset 0 1px 0 rgba(255,255,255,0.6)` }}>
                    {s.count > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] tabular-nums text-white flex items-center justify-center ring-[1.5px] ring-white shadow-[0_2px_4px_rgba(239,56,60,0.45)] z-10"
                        style={{ background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                        {s.count}
                      </span>
                    )}
                    <s.Icon className="size-[20px]" style={{ color: s.tint }} strokeWidth={2.2} />
                  </div>
                  <span className={`${font} text-[11px] text-gray-700 text-center leading-tight`} style={{ fontWeight: 500 }}>{s.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mx-4 h-px bg-gray-100" />

          <div className="px-2 py-2">
            {[
              { icon: User, label: "บัญชีของฉัน", path: "/account" },
              { icon: MapPin, label: "ที่อยู่จัดส่ง", path: "/addresses" },
              { icon: Heart, label: "สินค้าที่ชอบ", path: "/wishlist" },
              { icon: Ticket, label: "คูปองของฉัน", path: "/my-coupons" },
            ].map((item) => (
              <button key={item.label} onClick={() => go(item.path)}
                className="group/menu w-full flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[#319754]/[0.06] cursor-pointer transition-colors">
                <div className="size-[30px] rounded-full bg-[#319754]/10 group-hover/menu:bg-[#319754]/20 flex items-center justify-center shrink-0 transition-colors">
                  <item.icon className="size-[14px] text-[#319754]" strokeWidth={2.2} />
                </div>
                <span className={`${font} text-[13.5px] text-gray-800 flex-1 text-left`} style={{ fontWeight: 500 }}>{item.label}</span>
                <ArrowRight className="size-[14px] text-gray-300 group-hover/menu:text-[#319754] group-hover/menu:translate-x-0.5 transition-all" strokeWidth={2} />
              </button>
            ))}
          </div>
        </>
      )}

      {/* ===== OWNER: shop management ===== */}
      {isOwner && (
        <div className="px-2 pt-3 pb-2">
          <p className={`${font} text-[10px] text-gray-400 uppercase tracking-wider px-3 pb-1.5`} style={{ fontWeight: 600 }}>จัดการร้านค้า</p>
          {[
            { icon: BarChart3, label: "ภาพรวมร้านค้า", path: "/owner" },
            { icon: ShoppingCart, label: "คำสั่งซื้อ", path: "/owner" },
            { icon: Package, label: "จัดการสินค้า", path: "/owner" },
            { icon: Store, label: "หน้าร้านค้า", path: "/shop/metaherb" },
            { icon: Ticket, label: "คูปองและโปรโมชั่น", path: "/owner" },
            { icon: Monitor, label: "ตั้งค่าร้านค้า", path: "/owner" },
          ].map((item) => (
            <button key={item.label} onClick={() => go(item.path)}
              className="group/menu w-full flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[#319754]/[0.06] cursor-pointer transition-colors">
              <div className="size-[30px] rounded-full bg-[#319754]/10 group-hover/menu:bg-[#319754]/20 flex items-center justify-center shrink-0 transition-colors">
                <item.icon className="size-[14px] text-[#319754]" strokeWidth={2.2} />
              </div>
              <span className={`${font} text-[13.5px] text-gray-800 flex-1 text-left`} style={{ fontWeight: 500 }}>{item.label}</span>
              <ArrowRight className="size-[14px] text-gray-300 group-hover/menu:text-[#319754] group-hover/menu:translate-x-0.5 transition-all" strokeWidth={2} />
            </button>
          ))}
          <div className="mx-3 h-px bg-gray-100 my-1.5" />
          <button onClick={() => go("/")}
            className="group/menu w-full flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[#319754]/[0.06] cursor-pointer transition-colors">
            <div className="size-[30px] rounded-full bg-[#319754]/10 group-hover/menu:bg-[#319754]/20 flex items-center justify-center shrink-0 transition-colors">
              <ArrowRight className="size-[14px] text-[#319754] rotate-180" strokeWidth={2.2} />
            </div>
            <span className={`${font} text-[13.5px] text-[#319754] flex-1 text-left`} style={{ fontWeight: 500 }}>กลับสู่เว็บไซต์หลัก</span>
          </button>
        </div>
      )}

      {/* ===== ADMIN: admin management ===== */}
      {isAdmin && (
        <div className="px-2 pt-3 pb-2">
          <p className={`${font} text-[10px] text-gray-400 uppercase tracking-wider px-3 pb-1.5`} style={{ fontWeight: 600 }}>ระบบหลังบ้าน</p>
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
              className="group/menu w-full flex items-center gap-3 px-3 py-2 rounded-[10px] hover:bg-[#3b82f6]/[0.06] cursor-pointer transition-colors">
              <div className="size-[30px] rounded-full bg-[#3b82f6]/10 group-hover/menu:bg-[#3b82f6]/20 flex items-center justify-center shrink-0 transition-colors">
                <item.icon className="size-[14px] text-[#3b82f6]" strokeWidth={2.2} />
              </div>
              <span className={`${font} text-[13.5px] text-gray-800 flex-1 text-left`} style={{ fontWeight: 500 }}>{item.label}</span>
              <ArrowRight className="size-[14px] text-gray-300 group-hover/menu:text-[#3b82f6] group-hover/menu:translate-x-0.5 transition-all" strokeWidth={2} />
            </button>
          ))}
        </div>
      )}

      {/* ===== ROLE SWITCH ===== */}
      <div className="px-4 pt-3 pb-3 bg-gray-50/60 border-t border-gray-100">
        <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wider mb-2`} style={{ fontWeight: 600 }}>สลับมุมมอง</p>
        <div className="flex flex-col gap-1">
          {[
            { role: "user" as const, label: "ฉัน", icon: User, color: "#319754", path: "/" },
            { role: "owner" as const, label: "ร้านค้าของฉัน", icon: Store, color: "#319754", path: "/owner" },
            { role: "admin" as const, label: "ตั้งค่าบนเว็บไซต์", icon: Shield, color: "#3b82f6", path: "/admin" },
          ].filter((s) => s.role !== user?.role).map((s) => (
            <button key={s.role} onClick={() => { switchRole(s.role); navigate(s.path); onClose(); }}
              className="group/swr flex items-center gap-2.5 cursor-pointer w-full text-left px-2 py-1.5 rounded-[8px] hover:bg-white hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all">
              <div className="size-[28px] rounded-full flex items-center justify-center shrink-0 transition-colors" style={{ backgroundColor: `${s.color}1a` }}>
                <s.icon className="size-[13px]" style={{ color: s.color }} strokeWidth={2.2} />
              </div>
              <span className={`${font} text-[13px] text-gray-700 flex-1`} style={{ fontWeight: 500 }}>{s.label}</span>
              <ArrowRight className="size-[13px] text-gray-300 group-hover/swr:translate-x-0.5 transition-all" strokeWidth={2} style={{ color: undefined }} />
            </button>
          ))}
        </div>
      </div>

      {/* ===== LOGOUT ===== */}
      <button onClick={() => { logout(); navigate("/"); onClose(); }}
        className="group/lo w-full flex items-center gap-3 px-5 py-3 hover:bg-red-50 cursor-pointer transition-colors border-t border-gray-100">
        <div className="size-[30px] rounded-full bg-red-50 group-hover/lo:bg-red-100 flex items-center justify-center shrink-0 transition-colors">
          <LogOut className="size-[14px] text-[#ef4444]" strokeWidth={2.2} />
        </div>
        <span className={`${font} text-[13.5px] text-[#ef4444]`} style={{ fontWeight: 500 }}>ออกจากระบบ</span>
      </button>
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
  const [pillSearchOpen, setPillSearchOpen] = useState(false);
  const [pillSearchQuery, setPillSearchQuery] = useState("");
  const pillRef = useRef<HTMLDivElement>(null);
  const { lang, setLang, t } = useLanguage();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!langOpen) return;
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [langOpen]);
  const currentLangOpt = LANG_OPTIONS.find((l) => l.code === lang) ?? LANG_OPTIONS[0];

  // Hover-preview states for notif/cart/profile — render under pill instead of under each icon
  const [notifHovered, setNotifHovered] = useState(false);
  const [cartHovered, setCartHovered] = useState(false);
  const [profileHovered, setProfileHovered] = useState(false);
  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const profileTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openNotif = () => { if (notifTimerRef.current) clearTimeout(notifTimerRef.current); setNotifHovered(true); };
  const closeNotif = () => { notifTimerRef.current = setTimeout(() => setNotifHovered(false), 180); };
  const openCart = () => { if (cartTimerRef.current) clearTimeout(cartTimerRef.current); setCartHovered(true); };
  const closeCart = () => { cartTimerRef.current = setTimeout(() => setCartHovered(false), 180); };
  const openProfile = () => { if (profileTimerRef.current) clearTimeout(profileTimerRef.current); setProfileHovered(true); };
  const closeProfile = () => { profileTimerRef.current = setTimeout(() => setProfileHovered(false), 180); };

  // Close pill-search on outside click or ESC
  useEffect(() => {
    if (!pillSearchOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setPillSearchOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPillSearchOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [pillSearchOpen]);

  const pillSuggestions = pillSearchQuery.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(pillSearchQuery.toLowerCase())).slice(0, 6)
    : [];
  const trendingSearches = ["ชาสมุนไพร", "น้ำผึ้งดิบ", "กาแฟดริป", "ครีมสมุนไพร", "แยมผลไม้"];
  const recentSearches = ["ชาออร์แกนิก", "น้ำผึ้ง", "สมุนไพร", "กาแฟดริป"];

  const submitPillSearch = (q?: string) => {
    const term = (q ?? pillSearchQuery).trim();
    if (!term) return;
    navigate(`/products?search=${encodeURIComponent(term)}`);
    setPillSearchOpen(false);
    setPillSearchQuery("");
  };

  const isOwner = isAuthenticated && user?.role === "owner";
  const isAdmin = isAuthenticated && user?.role === "admin";
  const isStaffRole = isOwner || isAdmin;

  const userMenuItems = [
    { label: t("menu_home"),     path: "/" },
    { label: t("menu_products"), path: "/products" },
    { label: t("menu_blog"),     path: "/blog" },
  ];

  const ownerMenuItems = [
    { label: "ภาพรวม",      path: "/owner" },
    { label: "หน้าร้านค้า", path: "/shop/metaherb" },
    { label: "ตั้งค่า",     path: "/settings" },
  ];

  const adminMenuItems = [
    { label: "ภาพรวม",                path: "/admin" },
    { label: "เนื้อหาบนเว็บ",         path: "/admin/content" },
    { label: "จัดการหน้าเว็บไซต์",   path: "/admin/pages" },
    { label: "ตั้งค่า",                path: "/admin/settings" },
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

  /* ===== NON-STAFF HEADER (customer) — verbatim translation of Figma 7324:11032 =====
   * Structure:
   *   <header sticky>
   *     <absolute green strip top:0 h:80 />
   *     <relative wrapper px-[124px] pt:[20px] flex-col gap-[6px] items-end>
   *       <lang-row w-full justify-end px-[24px]>ไทย ▾</lang-row>
   *       <pill w-full white/90 rounded-100 p-[20px] flex justify-between>
   *         <logo gap-[10px]> [50px] METAHERB </logo>
   *         <menu flex-1 justify-center> [4 tabs px-16 py-4, active = bg-#319754 white text] </menu>
   *         <right gap-[16px]> [search 40] [bell 40] [cart 40] [signin h-48 w-120 outline] </right>
   *       </pill>
   *     </wrapper>
   *   </header>
   */
  const NonStaffHeader = (
    <header className="sticky top-0 z-50">
      {/* Green strip — 80px tall, behind the pill (subtle gradient + inner highlight) */}
      <div className="absolute inset-x-0 top-0 h-[64px] md:h-[80px] backdrop-blur-[8px] shadow-[inset_0_-1px_0_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.12)]"
        style={{ background: "linear-gradient(180deg, #3aa55e 0%, #319754 55%, #287745 100%)" }} />

      {/* Content wrapper — pt set so pill half-overlaps the green strip on both mobile + desktop */}
      <div className="relative w-full max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-12 pt-[38px] md:pt-[20px] flex flex-col gap-[6px] items-end">
        {/* Lang row — sits inside the green strip */}
        <div className="hidden md:flex w-full items-center justify-end px-[24px]">
          <div ref={langRef} className="relative">
            <button onClick={() => setLangOpen((o) => !o)}
              className={`${font} group/lang flex items-center gap-[6px] text-white text-[14px] cursor-pointer px-2.5 py-1 rounded-full hover:bg-white/10 transition-colors ${langOpen ? "bg-white/10" : ""}`}
              style={{ fontWeight: 500 }}>
              <span className="leading-none">{currentLangOpt.native}</span>
              <ChevronDown className={`size-3 transition-transform ${langOpen ? "rotate-180" : "group-hover/lang:translate-y-[1px]"}`} strokeWidth={2.6} />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 bg-white rounded-[14px] shadow-[0_12px_32px_-8px_rgba(0,0,0,0.25)] border border-gray-100 w-[180px] overflow-hidden z-50">
                  {LANG_OPTIONS.map((opt) => {
                    const isActive = opt.code === lang;
                    return (
                      <button key={opt.code} onClick={() => { setLang(opt.code); setLangOpen(false); }}
                        className={`${font} w-full flex items-center gap-2.5 px-3.5 py-2.5 text-left cursor-pointer text-[13.5px] transition-colors ${isActive ? "bg-[#319754]/10 text-[#319754]" : "text-gray-700 hover:bg-gray-50"}`}
                        style={{ fontWeight: isActive ? 600 : 500 }}>
                        <span className="text-[16px] leading-none">{opt.flag}</span>
                        <span className="flex-1">{opt.native}</span>
                        {isActive && <span className="size-[6px] rounded-full bg-[#319754] shadow-[0_0_6px_rgba(49,151,84,0.6)]" />}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Pill — overlaps the bottom of the green strip */}
        <div ref={pillRef} className="relative w-full">
          <div className="w-full backdrop-blur-[14px] rounded-[100px] py-1.5 px-2 md:py-[14px] md:px-[16px] min-h-[52px] md:min-h-[76px] flex items-center ring-1 ring-white/60"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
            }}>
          <AnimatePresence mode="wait" initial={false}>
          {pillSearchOpen ? (
            /* === SEARCH MODE === */
            <motion.div key="search"
              initial={{ opacity: 0, scale: 0.97, y: 6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -4 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="w-full h-full flex items-center gap-2 md:gap-3 px-2">
              <motion.div
                initial={{ rotate: -90, scale: 0.6 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="shrink-0">
                <Search className="size-[22px] text-[#319754]" strokeWidth={2.2} />
              </motion.div>
              <input
                autoFocus
                value={pillSearchQuery}
                onChange={(e) => setPillSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitPillSearch(); }}
                className={`${font} flex-1 min-w-0 bg-transparent outline-none text-[15px] sm:text-[16px] text-[#1d5b32] placeholder:text-gray-400`}
                placeholder={t("search_placeholder")}
              />
              <button onClick={() => submitPillSearch()}
                className={`${font} hidden sm:inline-flex h-[36px] px-4 rounded-full bg-[#319754] hover:bg-[#267a43] text-white text-[13px] transition-colors shrink-0 items-center gap-1.5`}
                style={{ fontWeight: 500 }}>
                <Search className="size-[13px]" strokeWidth={2.4} /> {t("search_button")}
              </button>
              <button onClick={() => { setPillSearchOpen(false); setPillSearchQuery(""); }}
                className="size-[32px] sm:size-[36px] rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors shrink-0"
                aria-label={t("close_aria")}>
                <X className="size-[16px]" strokeWidth={2.4} />
              </button>
            </motion.div>
          ) : (
            /* === DEFAULT MODE === */
            <motion.div key="default"
              initial={{ opacity: 0, scale: 0.98, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 6 }}
              transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
              className="w-full h-full flex items-center justify-between">
          {/* Logo group — gap-[10px] (+ role badge for staff) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 min-w-0">
            <div className="group/logo flex items-center gap-1.5 sm:gap-[10px] cursor-pointer transition-transform duration-300 hover:scale-[1.03]"
              onClick={() => navigate(isOwner ? "/owner" : isAdmin ? "/admin" : "/")}>
              <img src={imgLogo} className="shrink-0 size-[34px] sm:size-[48px] transition-transform duration-500 group-hover/logo:rotate-[8deg]" alt="MetaHerb" />
              <span className={`${fontBold} text-[15px] sm:text-[24px] whitespace-nowrap leading-none tracking-tight`} style={{ fontWeight: 700 }}>
                <span className="text-[#ed1c24]">META</span>
                <span className="text-[#f7931d]">HERB</span>
              </span>
            </div>
            {/* Role badge — only for staff */}
            {isOwner && (
              <span className={`hidden md:inline-flex items-center gap-1.5 ml-1 px-3 py-1 rounded-full text-white text-[11px] ${font} shadow-[0_3px_10px_-2px_rgba(249,115,22,0.5)]`}
                style={{ background: "linear-gradient(135deg, #fb923c 0%, #f97316 55%, #c2410c 100%)", fontWeight: 600 }}>
                <Store className="size-3" strokeWidth={2.4} /> ร้านค้า
              </span>
            )}
            {isAdmin && (
              <span className={`hidden md:inline-flex items-center gap-1.5 ml-1 px-3 py-1 rounded-full text-white text-[11px] ${font} shadow-[0_3px_10px_-2px_rgba(59,130,246,0.5)]`}
                style={{ background: "linear-gradient(135deg, #60a5fa 0%, #3b82f6 55%, #1d4ed8 100%)", fontWeight: 600 }}>
                <Shield className="size-3" strokeWidth={2.4} /> แอดมิน
              </span>
            )}
          </div>

          {/* Menu tabs — flex-1 centered, with hover lift + gradient active pill */}
          <nav className="flex-1 hidden md:flex items-center justify-center gap-[2px] min-w-0">
            {(isStaffRole ? menuItems : [...userMenuItems, { label: t("menu_about"), path: "/about" }]).map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)}
                  className={`${font} group/tab relative flex items-center justify-center px-[18px] h-[34px] rounded-[100px] text-[14px] cursor-pointer transition-all duration-200 ${
                    isActive
                      ? "text-white"
                      : "text-[#1d5b32] hover:text-[#287745] hover:-translate-y-[1px]"
                  }`}
                  style={{ fontWeight: 500 }}>
                  {/* Hover background — inactive only */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-[100px] bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />
                  )}
                  {/* Active gradient pill with shadow + glow */}
                  {isActive && (
                    <motion.div layoutId="topnav-bg"
                      className="absolute inset-0 rounded-[100px] shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                      style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <span className="relative z-10 leading-none whitespace-nowrap">{item.label}</span>
                  {/* Underline accent on hover for inactive */}
                  {!isActive && (
                    <span className="absolute left-1/2 -translate-x-1/2 bottom-[4px] h-[2px] w-0 rounded-full bg-gradient-to-r from-[#319754] to-[#46c474] transition-all duration-300 group-hover/tab:w-[40%]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right group — gap-[16px] */}
          <div className="flex items-center gap-1.5 sm:gap-[16px] justify-end shrink-0">
            {/* Mobile search — opens the SAME pill-morph search as desktop */}
            {!isStaffRole && (
              <motion.button onClick={() => setPillSearchOpen(true)}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 400, damping: 18 }}
                className="md:hidden group/icon size-[32px] rounded-full flex items-center justify-center cursor-pointer relative bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                aria-label={t("search_aria")}>
                <Search className="size-[16px] text-[#1d5b32]" strokeWidth={2} />
              </motion.button>
            )}

            {/* Desktop search — morphs the pill into a search bar (customer only) */}
            {!isStaffRole && (
              <button onClick={() => setPillSearchOpen(true)}
                className="hidden md:flex group/icon size-[32px] rounded-full items-center justify-center cursor-pointer relative bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] hover:bg-[#267a43] hover:shadow-[0_6px_16px_-4px_rgba(49,151,84,0.45)] hover:-translate-y-[1px] active:scale-95 active:translate-y-0 transition-all duration-200"
                aria-label={t("search_aria")}>
                <Search className="size-[16px] text-[#1d5b32] group-hover/icon:text-white transition-colors" strokeWidth={2} />
              </button>
            )}

            {/* Bell — desktop (hover preview rendered under pill) */}
            <div className="hidden sm:block">
              <button onClick={() => { if (isAuthenticated) { setShowNotifications(!showNotifications); setShowProfile(false); } else { navigate("/login"); } }}
                onMouseEnter={() => { if (isAuthenticated) openNotif(); }}
                onMouseLeave={() => { if (isAuthenticated) closeNotif(); }}
                className={`group/icon size-[32px] rounded-full flex items-center justify-center cursor-pointer relative transition-all duration-200 hover:-translate-y-[1px] active:scale-95 active:translate-y-0 ${
                  showNotifications
                    ? "bg-[#267a43] shadow-[0_6px_16px_-4px_rgba(49,151,84,0.45)]"
                    : "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] hover:bg-[#267a43] hover:shadow-[0_6px_16px_-4px_rgba(49,151,84,0.45)]"
                }`}>
                <Bell className={`size-[16px] transition-colors ${showNotifications ? "text-white" : "text-[#1d5b32] group-hover/icon:text-white"}`} strokeWidth={2} />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-[2px] -right-[2px] min-w-[18px] h-[18px] px-[5px] rounded-full text-[10px] tabular-nums text-white flex items-center justify-center ring-[1.5px] ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)] z-10"
                    style={{ background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>
            {/* Bell — mobile */}
            <div className="relative sm:hidden">
              <button onClick={() => { if (isAuthenticated) { setShowNotifications(!showNotifications); setShowProfile(false); } else { navigate("/login"); } }}
                className={`group/icon size-[32px] rounded-full flex items-center justify-center cursor-pointer relative transition-all duration-200 active:scale-95 ${
                  showNotifications
                    ? "bg-[#267a43] shadow-[0_6px_16px_-4px_rgba(49,151,84,0.45)]"
                    : "bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
                }`}>
                <Bell className={`size-[16px] transition-colors ${showNotifications ? "text-white" : "text-[#1d5b32]"}`} strokeWidth={2} />
                {isAuthenticated && unreadCount > 0 && (
                  <span className="absolute -top-[2px] -right-[2px] min-w-[18px] h-[18px] px-[5px] rounded-full text-[10px] tabular-nums text-white flex items-center justify-center ring-[1.5px] ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)] z-10"
                    style={{ background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {showNotifications && isAuthenticated && <NotificationDropdown onClose={() => setShowNotifications(false)} />}
            </div>

            {/* Cart — desktop (customer only, hover preview rendered under pill) */}
            {!isStaffRole && (
              <div className="hidden sm:block">
                <button onClick={() => navigate("/cart")}
                  onMouseEnter={() => { if (isAuthenticated) openCart(); }}
                  onMouseLeave={() => { if (isAuthenticated) closeCart(); }}
                  className="group/icon size-[32px] rounded-full flex items-center justify-center cursor-pointer relative bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] hover:bg-[#267a43] hover:shadow-[0_6px_16px_-4px_rgba(49,151,84,0.45)] hover:-translate-y-[1px] active:scale-95 active:translate-y-0 transition-all duration-200">
                  <ShoppingCart className="size-[16px] text-[#1d5b32] group-hover/icon:text-white transition-colors" strokeWidth={2} />
                  {isAuthenticated && itemCount > 0 && (
                    <span className="absolute -top-[2px] -right-[2px] min-w-[18px] h-[18px] px-[5px] rounded-full text-[10px] tabular-nums text-white flex items-center justify-center ring-[1.5px] ring-white shadow-[0_2px_6px_rgba(49,151,84,0.5)] z-10"
                      style={{ background: "linear-gradient(135deg, #46c474, #267a43)", fontWeight: 700 }}>
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            )}
            {/* Cart — mobile (customer only) */}
            {!isStaffRole && (
              <div className="relative sm:hidden">
                <button onClick={() => navigate("/cart")}
                  className="group/icon size-[32px] rounded-full flex items-center justify-center cursor-pointer relative bg-white shadow-[0_1px_2px_rgba(16,24,40,0.06)] active:scale-95 transition-all duration-200">
                  <ShoppingCart className="size-[16px] text-[#1d5b32]" strokeWidth={2} />
                  {isAuthenticated && itemCount > 0 && (
                    <span className="absolute -top-[2px] -right-[2px] min-w-[18px] h-[18px] px-[5px] rounded-full text-[10px] tabular-nums text-white flex items-center justify-center ring-[1.5px] ring-white shadow-[0_2px_6px_rgba(49,151,84,0.5)] z-10"
                      style={{ background: "linear-gradient(135deg, #46c474, #267a43)", fontWeight: 700 }}>
                      {itemCount}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Auth — hover preview rendered under pill */}
            {isAuthenticated ? (
              <div className="flex items-center">
                <button onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
                  onMouseEnter={openProfile}
                  onMouseLeave={closeProfile}
                  className="cursor-pointer shrink-0 size-[44px] rounded-full flex items-center justify-center transition-transform hover:-translate-y-[1px]"
                  style={{
                    background: isOwner
                      ? "linear-gradient(135deg, #fb923c 0%, #f97316 55%, #c2410c 100%)"
                      : isAdmin
                      ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 55%, #1d4ed8 100%)"
                      : "linear-gradient(135deg, #46c474, #319754)",
                    padding: "2px",
                    boxShadow: isOwner
                      ? "0 4px 14px -2px rgba(249,115,22,0.45)"
                      : isAdmin
                      ? "0 4px 14px -2px rgba(59,130,246,0.45)"
                      : undefined,
                  }}>
                  <span className="size-full rounded-full bg-white flex items-center justify-center p-[2px]">
                    <img src={avatarByRole[user?.role || "user"]} className="size-full rounded-full object-cover" alt="profile" />
                  </span>
                </button>
              </div>
            ) : (
              <button onClick={() => navigate("/login")}
                className={`hidden md:flex border border-[#319754] text-[#1d5b32] h-[48px] px-4 w-[120px] rounded-[100px] text-[14px] ${font} cursor-pointer hover:bg-[#319754]/5 items-center justify-center`}
                style={{ fontWeight: 500 }}>
                <span className="leading-none">{t("button_login")}</span>
              </button>
            )}

            {/* Mobile menu — at the end (right side) of the pill, with morph animation */}
            <motion.button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.08 }}
              transition={{ type: "spring", stiffness: 400, damping: 18 }}
              className={`md:hidden size-[32px] rounded-full flex items-center justify-center cursor-pointer relative transition-colors duration-200 ${
                mobileMenuOpen
                  ? "bg-[#267a43] text-white shadow-[0_4px_12px_-2px_rgba(49,151,84,0.45)]"
                  : "bg-white text-[#1d5b32] shadow-[0_1px_2px_rgba(16,24,40,0.06)]"
              }`}
              aria-label="Menu">
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.span key="x"
                    initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center">
                    <X className="size-[16px]" strokeWidth={2.4} />
                  </motion.span>
                ) : (
                  <motion.span key="menu"
                    initial={{ rotate: 90, opacity: 0, scale: 0.6 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.6 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 flex items-center justify-center">
                    <Menu className="size-[16px]" strokeWidth={2.4} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
            </motion.div>
          )}
          </AnimatePresence>
          </div>

          {/* Notification hover preview — anchored under the pill */}
          {isAuthenticated && (notifHovered || showNotifications) && (
            <div onMouseEnter={openNotif} onMouseLeave={closeNotif}>
              <NotificationDropdown onClose={() => { setShowNotifications(false); setNotifHovered(false); }} />
            </div>
          )}

          {/* Cart hover preview — anchored under the pill */}
          {isAuthenticated && cartHovered && (
            <div onMouseEnter={openCart} onMouseLeave={closeCart}>
              <CartHoverPreview items={cartItems} total={cartTotal} onGoToCart={() => { navigate("/cart"); setCartHovered(false); }} />
            </div>
          )}

          {/* Profile dialog — anchored under the pill, click OR hover */}
          {isAuthenticated && (profileHovered || showProfile) && (
            <div onMouseEnter={openProfile} onMouseLeave={closeProfile}>
              <ProfileDialog
                onClose={() => { setShowProfile(false); setProfileHovered(false); }}
                onNavigate={(path) => { navigate(path); setShowProfile(false); setProfileHovered(false); }}
              />
            </div>
          )}

          {/* Search suggestions dropdown — slides from below pill */}
          <AnimatePresence>
            {pillSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-[20px] shadow-[0_12px_36px_-8px_rgba(16,24,40,0.18)] border border-gray-100 overflow-hidden z-50"
              >
                {pillSuggestions.length > 0 ? (
                  <div className="py-3">
                    <p className={`${font} text-[11px] text-gray-400 px-5 py-1 uppercase tracking-wider`}>ผลการค้นหา</p>
                    {pillSuggestions.map((p) => (
                      <button key={p.id}
                        onClick={() => { navigate(`/product/${p.id}`); setPillSearchOpen(false); setPillSearchQuery(""); }}
                        className="w-full flex items-center gap-3 px-5 py-2.5 hover:bg-[#319754]/5 cursor-pointer text-left transition-colors">
                        <div className="size-[40px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[14px] text-gray-800 truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className={`${font} text-[12px] text-[#319754]`}>฿{p.price.toFixed(2)}</p>
                        </div>
                        <ArrowRight className="size-4 text-gray-300 shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-3 px-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    <div>
                      <p className={`${font} text-[11px] text-gray-400 py-2 uppercase tracking-wider flex items-center gap-1.5`}>
                        <Clock className="size-3" /> ค้นหาล่าสุด
                      </p>
                      <div className="flex flex-wrap gap-1.5 pb-3">
                        {recentSearches.map((h) => (
                          <button key={h} onClick={() => submitPillSearch(h)}
                            className={`px-3 py-1.5 rounded-full bg-gray-100 text-[12px] ${font} text-gray-700 cursor-pointer hover:bg-[#319754]/10 hover:text-[#319754] transition-colors`}>
                            {h}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className={`${font} text-[11px] text-gray-400 py-2 uppercase tracking-wider flex items-center gap-1.5`}>
                        <TrendingUp className="size-3" /> ยอดนิยม
                      </p>
                      <div className="pb-3">
                        {trendingSearches.map((t, i) => (
                          <button key={t} onClick={() => submitPillSearch(t)}
                            className="w-full flex items-center gap-2.5 py-1.5 hover:bg-gray-50 cursor-pointer text-left rounded-md -mx-1 px-1 transition-colors">
                            <span className={`${font} text-[12px] text-[#ee4d2d] w-4 text-center`} style={{ fontWeight: 600 }}>{i + 1}</span>
                            <span className={`${font} text-[13px] text-gray-700`}>{t}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile search overlay */}
      {mobileSearchOpen && (
        <div className="relative px-4 sm:px-6 lg:px-12 pb-3 max-w-[1440px] mx-auto w-full">
          <SearchBar className="w-full md:max-w-[600px] md:mx-auto" />
        </div>
      )}

      {/* Mobile menu — slide-down with staggered items */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
            className="md:hidden relative bg-white border-t border-gray-100 shadow-lg overflow-hidden">
            <motion.div
              initial="hidden" animate="visible" exit="hidden"
              variants={{
                hidden: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
              }}
              className="flex flex-col py-2">
              {[...userMenuItems, { label: t("menu_about"), path: "/about" }].map((item) => (
                <motion.button key={item.path} onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                  variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  whileTap={{ scale: 0.97 }}
                  className={`group/mitem px-6 py-3 text-left text-[14px] ${font} cursor-pointer transition-colors flex items-center gap-2 ${
                    location.pathname === item.path ? "text-[#319754] bg-[#319754]/5" : "text-gray-700 hover:bg-gray-50"
                  }`}>
                  <span className={`size-1.5 rounded-full transition-all ${
                    location.pathname === item.path
                      ? "bg-[#319754] shadow-[0_0_8px_rgba(49,151,84,0.6)]"
                      : "bg-transparent group-hover/mitem:bg-[#319754]/40"
                  }`} />
                  <span className="group-hover/mitem:translate-x-0.5 transition-transform">{item.label}</span>
                </motion.button>
              ))}
              {/* Language switcher section */}
              <motion.div
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                className="h-px bg-gray-100 my-1" />
              <motion.div
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="px-6 pt-2 pb-1">
                <p className={`${font} text-[11px] text-gray-400 uppercase tracking-[0.15em]`} style={{ fontWeight: 600 }}>Language</p>
              </motion.div>
              <motion.div
                variants={{ hidden: { opacity: 0, y: 4 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="px-4 pb-2 flex flex-wrap gap-1.5">
                {LANG_OPTIONS.map((opt) => {
                  const isActive = opt.code === lang;
                  return (
                    <button key={opt.code} onClick={() => { setLang(opt.code); setMobileMenuOpen(false); }}
                      className={`${font} flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] cursor-pointer transition-all active:scale-95 ${
                        isActive
                          ? "text-white shadow-[0_3px_8px_-2px_rgba(49,151,84,0.4)]"
                          : "bg-gray-100 text-gray-700 hover:bg-[#319754]/10 hover:text-[#319754]"
                      }`}
                      style={isActive
                        ? { background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }
                        : { fontWeight: 500 }}>
                      <span className="text-[14px] leading-none">{opt.flag}</span>
                      <span>{opt.native}</span>
                    </button>
                  );
                })}
              </motion.div>

              {/* Login — shown only when not authenticated */}
              {!isAuthenticated && (
                <>
                  <motion.div
                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
                    className="h-px bg-gray-100 my-1" />
                  <motion.button onClick={() => { navigate("/login"); setMobileMenuOpen(false); }}
                    variants={{ hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    whileTap={{ scale: 0.97 }}
                    className={`mx-4 my-2 px-4 py-2.5 rounded-full text-white text-[14px] ${font} cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.55)] hover:-translate-y-[1px] active:translate-y-0 transition-all`}
                    style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 500 }}>
                    <User className="size-4" strokeWidth={2.2} /> {t("button_login")}
                  </motion.button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );


  return (
    <div className={`flex flex-col w-full ${isStaffRole ? "h-screen overflow-hidden" : "min-h-screen"}`} style={{ backgroundColor: "#fafafa" }}>
      {NonStaffHeader}

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
      <footer className="relative overflow-hidden text-white"
        style={{ background: "linear-gradient(180deg, #143f24 0%, #0d2a17 70%, #07180e 100%)" }}>
        {/* Top accent gradient line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#46c474]/60 to-transparent" />
        {/* Decorative blurred orbs */}
        <div className="absolute top-10 left-1/4 size-[420px] rounded-full bg-[#319754]/18 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 size-[520px] rounded-full bg-[#46c474]/8 blur-3xl pointer-events-none" />
        <img src={imgLeafD} alt="" aria-hidden className="absolute -top-8 right-[6%] size-[220px] opacity-[0.07] rotate-[18deg] pointer-events-none select-none" />
        <img src={imgLeafA} alt="" aria-hidden className="absolute bottom-24 left-[4%] size-[180px] opacity-[0.06] -rotate-[35deg] pointer-events-none select-none" />
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        <div className="relative max-w-[1440px] mx-auto flex flex-col gap-5 px-4 sm:px-6 lg:px-12 py-6">
          {/* ===== TOP: brand row ===== */}
          <div className="flex items-center gap-4">
            <div className="size-[48px] sm:size-[56px] rounded-2xl bg-white p-1.5 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.45)] ring-1 ring-white/20 shrink-0">
              <img src={imgLogo} className="w-full h-full" alt="MetaHerb" />
            </div>
            <div className="min-w-0">
              <h3 className={`${fontBold} text-[20px] sm:text-[22px] tracking-tight leading-none`} style={{ fontWeight: 800 }}>
                <span className="text-[#ff9b9b]">META</span><span className="text-[#ffc070]">HERB</span>
              </h3>
              <p className={`${font} text-[12px] sm:text-[13px] text-white/65 mt-1`}>{t("footer_tagline")}</p>
            </div>
          </div>

          {/* ===== 3 BOX SECTIONS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Box 1: Contact */}
            <div className="relative rounded-[20px] bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-sm p-4 flex flex-col justify-center gap-2 hover:from-black/40 hover:to-black/60 transition-all overflow-hidden">
              {/* Watermark — botanical leaf image */}
              <img src={imgLeafA} alt="" aria-hidden className="absolute -bottom-6 -right-8 size-[140px] opacity-[0.12] rotate-[18deg] pointer-events-none select-none" />
              <div className="absolute -top-8 -right-8 size-[120px] rounded-full bg-[#46c474]/10 blur-2xl pointer-events-none" />

              <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                className="relative group flex items-start gap-2.5 -mx-1 px-1.5 py-1.5 rounded-lg text-white/85 hover:text-white hover:bg-white/[0.05] transition-all">
                <div className="size-[26px] rounded-lg bg-[#46c474]/15 border border-[#46c474]/30 flex items-center justify-center shrink-0 group-hover:bg-[#46c474]/25 transition-colors">
                  <MapPin className="size-[12px] text-[#46c474]" strokeWidth={2.4} />
                </div>
                <span className={`${font} text-[12.5px] leading-[1.45] pt-0.5`}>{t("footer_address")}</span>
              </a>
              <a href="tel:0614213111"
                className="relative group flex items-center gap-2.5 -mx-1 px-1.5 py-1.5 rounded-lg text-white/85 hover:text-white hover:bg-white/[0.05] transition-all">
                <div className="size-[26px] rounded-lg bg-[#46c474]/15 border border-[#46c474]/30 flex items-center justify-center shrink-0 group-hover:bg-[#46c474]/25 transition-colors">
                  <Phone className="size-[12px] text-[#46c474]" strokeWidth={2.4} />
                </div>
                <span className={`${font} text-[13px] tabular-nums`} style={{ fontWeight: 500 }}>06-1421-3111</span>
              </a>
              <a href="mailto:metaherb.herb@gmail.com"
                className="relative group flex items-center gap-2.5 -mx-1 px-1.5 py-1.5 rounded-lg text-white/85 hover:text-white hover:bg-white/[0.05] transition-all">
                <div className="size-[26px] rounded-lg bg-[#46c474]/15 border border-[#46c474]/30 flex items-center justify-center shrink-0 group-hover:bg-[#46c474]/25 transition-colors">
                  <Mail className="size-[12px] text-[#46c474]" strokeWidth={2.4} />
                </div>
                <span className={`${font} text-[12.5px]`}>metaherb.herb@gmail.com</span>
              </a>
            </div>

            {/* Box 2: Links */}
            <div className="relative rounded-[20px] bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-sm p-4 flex flex-col justify-center gap-1 hover:from-black/40 hover:to-black/60 transition-all overflow-hidden">
              {/* Watermark — botanical leaf image */}
              <img src={imgLeafB} alt="" aria-hidden className="absolute -top-6 -right-6 size-[130px] opacity-[0.12] -rotate-[20deg] pointer-events-none select-none" />
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 size-[140px] rounded-full bg-[#46c474]/8 blur-3xl pointer-events-none" />

              {[
                { label: t("footer_link_privacy"),  path: "/about" },
                { label: t("footer_link_terms"),    path: "/about" },
                { label: t("footer_link_howto"),    path: "/about" },
                { label: t("footer_link_shipping"), path: "/about" },
              ].map((item) => (
                <a key={item.label} href={item.path}
                  className={`${font} relative group flex items-center gap-2.5 -mx-1 px-2 py-1.5 rounded-lg text-[12.5px] text-white/80 hover:text-white hover:bg-white/[0.05] transition-all`}>
                  <span className="size-[5px] rounded-full bg-[#46c474]/50 group-hover:bg-[#46c474] group-hover:shadow-[0_0_8px_rgba(70,196,116,0.8)] group-hover:scale-150 transition-all shrink-0" />
                  <span className="group-hover:translate-x-0.5 transition-transform flex-1">{item.label}</span>
                  <ArrowRight className="size-[12px] text-white/0 group-hover:text-[#46c474] group-hover:translate-x-0 -translate-x-1 transition-all" strokeWidth={2.4} />
                </a>
              ))}
            </div>

            {/* Box 3: Social + QR */}
            <div className="relative rounded-[20px] bg-gradient-to-br from-black/30 to-black/50 backdrop-blur-sm p-4 flex items-center justify-between gap-3 hover:from-black/40 hover:to-black/60 transition-all overflow-hidden">
              {/* Watermark — botanical leaf image */}
              <img src={imgLeafC} alt="" aria-hidden className="absolute -bottom-8 left-[25%] size-[140px] opacity-[0.12] rotate-[35deg] pointer-events-none select-none" />
              <div className="absolute -bottom-8 -right-8 size-[140px] rounded-full bg-[#46c474]/8 blur-3xl pointer-events-none" />

              <div className="relative flex flex-col gap-1 flex-1 min-w-0">
                {[
                  { name: "Facebook", brand: "#1877F2", icon: (
                    <svg viewBox="0 0 32 32" className="size-[12px]"><path d="M20.4 20.6l.7-4.6h-4.4v-3c0-1.3.6-2.5 2.6-2.5h2V6.6s-1.8-.3-3.6-.3c-3.6 0-6 2.2-6 6.2V16H7.6v4.6h4.1V32h5V20.6h3.7z" fill="currentColor"/></svg>
                  ) },
                  { name: "Instagram", brand: "#E1306C", icon: (
                    <svg viewBox="0 0 32 32" className="size-[12px]" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <rect x="6" y="6" width="20" height="20" rx="5"/>
                      <circle cx="16" cy="16" r="4.5"/>
                      <circle cx="22" cy="10" r="1.2" fill="currentColor"/>
                    </svg>
                  ) },
                  { name: "Tiktok", brand: "#000", icon: (
                    <svg viewBox="0 0 32 32" className="size-[12px]"><path d="M22 9.5c-1.6-.3-3-1.4-3.6-2.9H16v12.7c0 1.3-1 2.3-2.3 2.3-1.3 0-2.3-1-2.3-2.3 0-1.3 1-2.3 2.3-2.3.2 0 .5 0 .7.1V14c-.2 0-.5-.1-.7-.1-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9 4.9-2.2 4.9-4.9v-6.6c1.1.7 2.4 1.2 3.8 1.2V9.8c-.1 0-.3 0-.4-.3z" fill="currentColor"/></svg>
                  ) },
                  { name: "Youtube", brand: "#FF0000", icon: (
                    <svg viewBox="0 0 32 32" className="size-[12px]"><path d="M13 11l9 5-9 5V11z" fill="currentColor"/></svg>
                  ) },
                ].map((s) => (
                  <a key={s.name} href="#" aria-label={s.name}
                    className={`${font} group flex items-center gap-2.5 -mx-1 px-2 py-1.5 rounded-lg text-[12.5px] text-white/85 hover:text-white hover:bg-white/[0.05] transition-all w-fit`}
                    style={{ ["--brand" as any]: s.brand }}>
                    <div className="size-[22px] rounded-md bg-white/[0.1] border border-white/15 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:border-transparent transition-all">
                      <span className="text-white/80 group-hover:text-[var(--brand)] transition-colors">{s.icon}</span>
                    </div>
                    <span className="group-hover:translate-x-0.5 transition-transform" style={{ fontWeight: 500 }}>{s.name}</span>
                  </a>
                ))}
              </div>
              {/* QR Code */}
              <div className="relative size-[76px] shrink-0 self-end flex items-center justify-center">
                <img src={imgQRCode} alt="QR Code" className="w-full h-full object-contain" />
              </div>
            </div>
          </div>

          {/* ===== BOTTOM BAR ===== */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
              <p className={`${font} text-[13px] text-white/75`}>{t("footer_copyright")}</p>
              <span className={`${font} inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full bg-gradient-to-br from-[#46c474]/15 to-[#319754]/5 border border-[#46c474]/25 text-[11px] text-white/85 tabular-nums`} style={{ fontWeight: 600 }}>
                <span className="size-[6px] rounded-full bg-[#46c474] shadow-[0_0_8px_rgba(70,196,116,0.9)] animate-pulse" />
                v{APP_VERSION}
              </span>
            </div>
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <span className={`${font} text-[12px] text-white/65`} style={{ fontWeight: 500 }}>{t("footer_payment")}</span>
              <div className="flex items-center gap-2">
                {[
                  { label: "VISA", color: "#1a1f71" },
                  { label: "MC", color: "#eb001b" },
                  { label: "PP", color: "#003478" },
                  { label: "TM", color: "#ff6600" },
                ].map((p) => (
                  <div key={p.label}
                    className={`${font} size-[34px] sm:size-[40px] rounded-full bg-white flex items-center justify-center text-[9px] sm:text-[10px] tracking-wide shadow-[0_3px_8px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.6)]`}
                    style={{ color: p.color, fontWeight: 800 }}>
                    {p.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
