import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Package, MapPin, User, Ticket, Heart, FlaskConical, FileText, Sparkles, FileSpreadsheet, FileCheck2, type LucideIcon } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { loadRegistrations, TRIAL_PRODUCTS } from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// Same mapping used by Layout.tsx — falls back to a role-based portrait when
// the user record doesn't carry an explicit avatar URL.
const avatarByRole: Record<string, string> = {
  user:  "https://images.unsplash.com/photo-1718307701476-bf46ac964396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0aGFpJTIwd29tYW4lMjBwb3J0cmFpdCUyMGZyaWVuZGx5fGVufDF8fHx8MTc3Mzg4ODExMnww&ixlib=rb-4.1.0&q=80&w=200",
  owner: "https://images.unsplash.com/photo-1701463387028-3947648f1337?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMGJ1c2luZXNzJTIwb3duZXIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzM4ODgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=200",
  admin: "https://images.unsplash.com/photo-1612190219911-286df0e14656?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0JTIwZ2xhc3Nlc3xlbnwxfHx8fDE3NzM4ODgxMTJ8MA&ixlib=rb-4.1.0&q=80&w=200",
};

type Item = { path: string; label: string; Icon: LucideIcon };

const ITEMS: Item[] = [
  { path: "/orders",         label: "คำสั่งซื้อของฉัน",  Icon: Package },
  { path: "/pr-history",     label: "ใบขอสั่งซื้อ (PR)", Icon: FileText },
  { path: "/quote-history",  label: "ใบเสนอราคา (RFQ)", Icon: FileSpreadsheet },
  { path: "/po-history",     label: "ใบสั่งซื้อ (PO)",   Icon: FileCheck2 },
  { path: "/my-trials",      label: "สินค้าทดลองของฉัน", Icon: FlaskConical },
  { path: "/my-coupons",     label: "คูปองของฉัน",       Icon: Ticket },
  { path: "/wishlist",       label: "รายการที่ชื่นชอบ",    Icon: Heart },
  { path: "/addresses",      label: "ที่อยู่จัดส่ง",         Icon: MapPin },
  { path: "/account",        label: "ข้อมูลบัญชี",         Icon: User },
];

/** Sticky sidebar nav shared by customer "account" pages (orders, addresses, coupons, etc).
 *  Mirrors the OwnerDashboard sidebar pattern — vertical button list with icon + label. */
export function AccountSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Reward points = sum of rewardPoints from all evaluated trial registrations
  const points = useMemo(() => {
    const regs = loadRegistrations().filter((r) => !!r.evaluatedAt);
    return regs.reduce((sum, r) => {
      const product = TRIAL_PRODUCTS.find((p) => p.id === r.trialId);
      return sum + (product?.rewardPoints ?? 0);
    }, 0);
  }, []);

  return (
    <aside className="hidden lg:block w-[240px] shrink-0">
      <div className="bg-white rounded-2xl p-3 flex flex-col gap-3 sticky top-[128px]">
        {/* Profile card — gradient green with points (nested inside sidebar) */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#319754] to-[#267a43] p-3.5 shadow-[0_4px_12px_-4px_rgba(49,151,84,0.4)]">
          <Sparkles className="absolute -top-1 -right-1 size-14 text-white/10" strokeWidth={1.5} />
          <div className="relative flex items-center gap-2.5 mb-2.5">
            <div className="size-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 border border-white/30 overflow-hidden">
              {(() => {
                const src = user?.avatar || avatarByRole[user?.role || "user"];
                return src
                  ? <img src={src} alt={user?.name || user?.username || ""} className="w-full h-full object-cover" />
                  : <User className="size-5 text-white" strokeWidth={2.2} />;
              })()}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`${font} text-[13px] text-white truncate`} style={{ fontWeight: 700 }}>
                {user?.name || user?.username || "ผู้ใช้ทั่วไป"}
              </p>
              <p className={`${font} text-[10.5px] text-white/75 truncate`}>{user?.email || "ยังไม่ได้เข้าสู่ระบบ"}</p>
            </div>
          </div>
          <div className="relative bg-white/15 backdrop-blur-sm rounded-lg px-2.5 py-1.5 border border-white/20">
            <p className={`${font} text-[9.5px] text-white/80 uppercase tracking-wide`} style={{ fontWeight: 500 }}>คะแนนสะสม</p>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className={`${font} text-[18px] text-white tabular-nums leading-none`} style={{ fontWeight: 700 }}>
                {points.toLocaleString()}
              </span>
              <span className={`${font} text-[10.5px] text-white/85`}>pts</span>
            </div>
          </div>
        </div>

        {/* Menu — pill highlight slides between items with motion.layoutId */}
        <nav className="flex flex-col gap-1">
          {ITEMS.map(({ path, label, Icon }) => {
            const active = location.pathname === path || (path === "/orders" && location.pathname.startsWith("/orders"));
            return (
              <button key={path} onClick={() => navigate(path)}
                className={`group/item relative ${font} flex items-center gap-2.5 px-3 py-2.5 rounded-full text-left text-[13px] cursor-pointer transition-colors ${
                  active ? "text-[#1d5b32]" : "text-gray-700 hover:bg-gray-50"
                }`}
                style={{ fontWeight: active ? 600 : 500 }}>
                {active && (
                  <motion.span layoutId="account-sidebar-active"
                    className="absolute inset-0 bg-[#319754]/10 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <Icon className={`relative z-10 size-4 shrink-0 transition-colors ${active ? "text-[#319754]" : "text-gray-400 group-hover/item:text-gray-600"}`} strokeWidth={2.2} />
                <span className="relative z-10 truncate">{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
