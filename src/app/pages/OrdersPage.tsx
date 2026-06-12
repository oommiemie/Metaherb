import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useOrders, type OrderStatus } from "../store/OrderContext";
import { useChat } from "../store/ChatContext";
import { useLanguage } from "../store/LanguageContext";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, ChevronLeft, Star, Eye, MessageCircle, RotateCcw, Copy, ChevronDown, ClipboardList, Hourglass, Search, Ban, ArrowRightCircle, FileText, AlertCircle, Store, Calendar, Wallet } from "lucide-react";
import { OrderTimeline } from "../components/OrderTimeline";
import { AccountSidebar } from "../components/AccountSidebar";
import { toast } from "sonner";
import { motion } from "motion/react";
import svgPaths from "../../imports/svg-msiytpo2yd";
import imgDamaged from "figma:asset/4f59e2204352b9ea47e8c08661dec6d473c60c53.png";
import imgWrongItem from "figma:asset/4517e4a0ab01b002c578ac42c372cf5b3a5ab1af.png";
import imgReturn from "figma:asset/a93992c00d6ca24ac5ac6db4f9ba36829787f574.png";
import imgRefund from "figma:asset/2c8e0b82e046f224d900948034e932ec386e66ff.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

function BoxIcon({ badgeColor }: { badgeColor: string }) {
  return (
    <div className="relative shrink-0 size-[60px]">
      <svg className="absolute inset-[10%]" fill="none" viewBox="0 0 67.7556 66.0001" style={{ width: "80%", height: "80%" }}>
        <path d={svgPaths.pe9d5060} fill="#FDA52C" />
        <path d={svgPaths.p1a2ca600} fill="#FFDFB2" />
        <path d={svgPaths.p2e64d800} fill="#FDC981" />
      </svg>
      <div className="absolute top-0 left-0 size-[22px]">
        <svg viewBox="0 0 28 28" fill="none" className="size-full">
          <circle cx="14" cy="14" r="13" fill={badgeColor} stroke="white" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

const statusBadgeColors: Record<OrderStatus, string> = {
  pending_payment: "bg-[#319754] text-white",
  pending_verify:  "bg-[#319754] text-white",
  preparing:       "bg-[#319754] text-white",
  shipped:         "bg-[#319754] text-white",
  delivered:       "bg-[#319754] text-white",
  completed:       "bg-[#319754] text-white",
  cancelled:       "bg-gray-400 text-white",
};

/* ===== PR (Purchase Requisition) — mock history ===== */
type PRStatus = "pending" | "approved" | "converted" | "rejected";

interface PRItem { name: string; supplier: string; qty: number; unit: string; price: number; image?: string }
interface PRRecord {
  id: string;
  date: string;
  totalAmount: number;
  priority: "Low" | "Normal" | "High" | "Urgent";
  status: PRStatus;
  approver?: string;
  validityDays: number;
  poNumber?: string;
  rejectReason?: string;
  items: PRItem[];
}

const MOCK_PRS: PRRecord[] = [
  // ===== Scenario 1: from QT-3012 → PR-3012 → PO-3012 =====
  {
    id: "PR-2569-3012", date: "11 มี.ค. 2569 - 10:30 น.", totalAmount: 64000, priority: "Normal", status: "converted", validityDays: 15, approver: "คุณวิชัย ใจกล้า", poNumber: "PO-2569-3012",
    items: [
      { name: "ขมิ้นชันแห้ง (ผง)", supplier: "METAHERB Store", qty: 200, unit: "กก.", price: 320, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&q=80" },
    ],
  },
  // ===== Scenario 2: direct PR-3019 → PO-3019 (no quote) =====
  {
    id: "PR-2569-3019", date: "9 มี.ค. 2569 - 14:18 น.", totalAmount: 190200, priority: "High", status: "converted", validityDays: 10, approver: "คุณสมศักดิ์ ดวงดี", poNumber: "PO-2569-3019",
    items: [
      { name: "ฟ้าทะลายโจร (ผง)", supplier: "METAHERB Store", qty: 500, unit: "กก.", price: 240, image: "https://images.unsplash.com/photo-1583500178690-f7eb1664d873?w=200&q=80" },
      { name: "ใบบัวบกแห้ง",       supplier: "METAHERB Store", qty: 150, unit: "กก.", price: 180, image: "https://images.unsplash.com/photo-1597301518497-69c4d4d10e7a?w=200&q=80" },
      { name: "ใบมะรุมแห้ง (ผง)", supplier: "METAHERB Store", qty: 80,  unit: "กก.", price: 540, image: "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=200&q=80" },
    ],
  },
  // ===== Scenario 3: PR-3023 pending approval (not yet sent) =====
  {
    id: "PR-2569-3023", date: "8 มี.ค. 2569 - 09:42 น.", totalAmount: 84000, priority: "Normal", status: "pending", validityDays: 15,
    items: [
      { name: "ขิงผงออร์แกนิก", supplier: "METAHERB Store", qty: 300, unit: "กก.", price: 280, image: "https://images.unsplash.com/photo-1573821663912-6df460f9c684?w=200&q=80" },
    ],
  },
  // ===== Scenario 4: from QT-3028 → PR-3028 → PO-3028 =====
  {
    id: "PR-2569-3028", date: "27 ก.พ. 2569 - 13:08 น.", totalAmount: 153600, priority: "Urgent", status: "converted", validityDays: 7, approver: "คุณวิชัย ใจกล้า", poNumber: "PO-2569-3028",
    items: [
      { name: "เห็ดหลินจือสกัด", supplier: "METAHERB Store", qty: 50, unit: "กก.", price: 2400, image: "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=200&q=80" },
      { name: "เก๊กฮวยแห้ง",       supplier: "METAHERB Store", qty: 80, unit: "กก.", price: 420,  image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=200&q=80" },
    ],
  },
  // ===== Scenario 5: from QT-3035 → PR-3035 → PO-3035 =====
  {
    id: "PR-2569-3035", date: "21 ก.พ. 2569 - 11:20 น.", totalAmount: 588000, priority: "High", status: "converted", validityDays: 30, approver: "คุณวิชัย ใจกล้า", poNumber: "PO-2569-3035",
    items: [
      { name: "ขมิ้นชันแคปซูล",   supplier: "METAHERB Store", qty: 1000, unit: "กก.", price: 380, image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=200&q=80" },
      { name: "ฟ้าทะลายโจรสกัด", supplier: "METAHERB Store", qty: 400,  unit: "กก.", price: 520, image: "https://images.unsplash.com/photo-1583500178690-f7eb1664d873?w=200&q=80" },
    ],
  },
  // ===== Scenario 9: PR-3048 — exceeded budget, rejected internally =====
  {
    id: "PR-2569-3048", date: "18 ก.พ. 2569 - 13:55 น.", totalAmount: 8320, priority: "Low", status: "rejected", validityDays: 30, rejectReason: "ยอดเกินงบประมาณไตรมาส",
    items: [
      { name: "ดอกอัญชันแห้ง", supplier: "METAHERB Store", qty: 16, unit: "กก.", price: 520, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200&q=80" },
    ],
  },
];

const PR_STATUS_BADGE: Record<PRStatus, { bg: string; label: string }> = {
  pending:   { bg: "bg-[#f59e0b]", label: "รออนุมัติ" },
  approved:  { bg: "bg-[#10b981]", label: "อนุมัติแล้ว" },
  converted: { bg: "bg-[#a855f7]", label: "แปลงเป็น PO" },
  rejected:  { bg: "bg-gray-400",  label: "ปฏิเสธ" },
};

const PR_PRIORITY_STYLE: Record<PRRecord["priority"], { bg: string; color: string }> = {
  Low:    { bg: "#f3f4f6",                color: "#6b7280" },
  Normal: { bg: "rgba(59, 130, 246, 0.1)", color: "#2563eb" },
  High:   { bg: "rgba(245, 158, 11, 0.1)", color: "#d97706" },
  Urgent: { bg: "rgba(239, 68, 68, 0.1)",  color: "#dc2626" },
};

/* ===== Quote (RFQ) — factory side: requests sent to suppliers ===== */
type QuoteStatus = "received" | "expired";
interface QuoteItem { name: string; supplier: string; qty: number; unit: string; price: number; image?: string }
interface QuoteRecord {
  id: string;
  date: string;
  validUntil: string;       // ISO-ish display string for expiry
  daysRemaining: number;    // < 0 = expired, used for colored badge
  supplier: string;
  totalAmount: number;
  status: QuoteStatus;
  items: QuoteItem[];
  note?: string;
}

// Customer (factory) side — IDs match what the supplier (METAHERB Store) issued
// so the same documents can be traced end-to-end across the two systems.
const MOCK_QUOTES: QuoteRecord[] = [
  // Scenario 1 — received from METAHERB Store; factory turned into PR-3012 → PO-3012
  {
    id: "QT-2569-3012", date: "10 มี.ค. 2569 - 09:30 น.", validUntil: "10 เม.ย. 2569", daysRemaining: 28,
    supplier: "METAHERB Store", totalAmount: 64000, status: "received",
    items: [
      { name: "ขมิ้นชันแห้ง (ผง)", supplier: "METAHERB Store", qty: 200, unit: "กก.", price: 320, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&q=80" },
    ],
  },
  // Scenario 4 — accepted, already converted to PR-3028 → PO-3028 shipped
  {
    id: "QT-2569-3028", date: "26 ก.พ. 2569 - 13:45 น.", validUntil: "26 มี.ค. 2569", daysRemaining: 14,
    supplier: "METAHERB Store", totalAmount: 153600, status: "received",
    items: [
      { name: "เห็ดหลินจือสกัด", supplier: "METAHERB Store", qty: 50, unit: "กก.", price: 2400, image: "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=200&q=80" },
      { name: "เก๊กฮวยแห้ง",       supplier: "METAHERB Store", qty: 80, unit: "กก.", price: 420,  image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=200&q=80" },
    ],
  },
  // Scenario 5 — converted to PR-3035 → PO-3035 delivered
  {
    id: "QT-2569-3035", date: "20 ก.พ. 2569 - 11:20 น.", validUntil: "20 มี.ค. 2569", daysRemaining: 8,
    supplier: "METAHERB Store", totalAmount: 588000, status: "received",
    items: [
      { name: "ขมิ้นชันแคปซูล",   supplier: "METAHERB Store", qty: 1000, unit: "กก.", price: 380, image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=200&q=80" },
      { name: "ฟ้าทะลายโจรสกัด", supplier: "METAHERB Store", qty: 400,  unit: "กก.", price: 520, image: "https://images.unsplash.com/photo-1583500178690-f7eb1664d873?w=200&q=80" },
    ],
  },
  // Scenario 8 — expired
  {
    id: "QT-2569-3045", date: "5 ก.พ. 2569 - 10:00 น.", validUntil: "7 มี.ค. 2569", daysRemaining: -5,
    supplier: "METAHERB Store", totalAmount: 36000, status: "expired",
    items: [
      { name: "ใบบัวบกแห้ง", supplier: "METAHERB Store", qty: 80, unit: "กก.", price: 450, image: "https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?w=200&q=80" },
    ],
  },
];

const QT_STATUS_BADGE: Record<QuoteStatus, { bg: string; label: string }> = {
  received: { bg: "bg-[#10b981]", label: "ได้รับใบเสนอราคา" },
  expired:  { bg: "bg-gray-400",  label: "หมดอายุ" },
};

/* ===== PO — factory side: POs the factory issued to suppliers ===== */
type POStatusF = "pending" | "preparing" | "shipped" | "delivered" | "completed" | "cancelled";
interface POItemF { name: string; supplier: string; qty: number; unit: string; price: number; image?: string }
interface PORecord {
  id: string;
  date: string;
  deliveryDate: string;
  supplier: string;
  paymentTerms: string;
  totalAmount: number;
  status: POStatusF;
  refPrId?: string;
  refQuoteId?: string;
  trackingNumber?: string;
  items: POItemF[];
  note?: string;
}

const MOCK_POS: PORecord[] = [
  // ===== Scenario 1: from QT-3012 → PR-3012 → PO-3012 — pending payment =====
  {
    id: "PO-2569-3012", date: "12 มี.ค. 2569 - 09:30 น.", deliveryDate: "26 มี.ค. 2569",
    supplier: "METAHERB Store", paymentTerms: "เครดิต 30 วัน", totalAmount: 68480, status: "pending",
    refQuoteId: "QT-2569-3012", refPrId: "PR-2569-3012",
    items: [
      { name: "ขมิ้นชันแห้ง (ผง)", supplier: "METAHERB Store", qty: 200, unit: "กก.", price: 320, image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200&q=80" },
    ],
  },
  // ===== Scenario 2: direct PR-3019 → PO-3019 — preparing =====
  {
    id: "PO-2569-3019", date: "10 มี.ค. 2569 - 14:18 น.", deliveryDate: "22 มี.ค. 2569",
    supplier: "METAHERB Store", paymentTerms: "เครดิต 60 วัน", totalAmount: 203514, status: "preparing",
    refPrId: "PR-2569-3019",
    items: [
      { name: "ฟ้าทะลายโจร (ผง)", supplier: "METAHERB Store", qty: 500, unit: "กก.", price: 240, image: "https://images.unsplash.com/photo-1583500178690-f7eb1664d873?w=200&q=80" },
      { name: "ใบบัวบกแห้ง",       supplier: "METAHERB Store", qty: 150, unit: "กก.", price: 180, image: "https://images.unsplash.com/photo-1597301518497-69c4d4d10e7a?w=200&q=80" },
      { name: "ใบมะรุมแห้ง (ผง)", supplier: "METAHERB Store", qty: 80,  unit: "กก.", price: 540, image: "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=200&q=80" },
    ],
  },
  // ===== Scenario 4: from QT-3028 → PR-3028 → PO-3028 — shipped =====
  {
    id: "PO-2569-3028", date: "28 ก.พ. 2569 - 13:08 น.", deliveryDate: "15 มี.ค. 2569",
    supplier: "METAHERB Store", paymentTerms: "เครดิต 60 วัน", totalAmount: 164352, status: "shipped",
    refQuoteId: "QT-2569-3028", refPrId: "PR-2569-3028", trackingNumber: "TH00125478963",
    items: [
      { name: "เห็ดหลินจือสกัด", supplier: "METAHERB Store", qty: 50, unit: "กก.", price: 2400, image: "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=200&q=80" },
      { name: "เก๊กฮวยแห้ง",       supplier: "METAHERB Store", qty: 80, unit: "กก.", price: 420,  image: "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=200&q=80" },
    ],
  },
  // ===== Scenario 5: from QT-3035 → PR-3035 → PO-3035 — delivered =====
  {
    id: "PO-2569-3035", date: "22 ก.พ. 2569 - 11:20 น.", deliveryDate: "8 มี.ค. 2569",
    supplier: "METAHERB Store", paymentTerms: "เครดิต 90 วัน", totalAmount: 629160, status: "delivered",
    refQuoteId: "QT-2569-3035", refPrId: "PR-2569-3035", trackingNumber: "TH00124589632",
    items: [
      { name: "ขมิ้นชันแคปซูล",   supplier: "METAHERB Store", qty: 1000, unit: "กก.", price: 380, image: "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=200&q=80" },
      { name: "ฟ้าทะลายโจรสกัด", supplier: "METAHERB Store", qty: 400,  unit: "กก.", price: 520, image: "https://images.unsplash.com/photo-1583500178690-f7eb1664d873?w=200&q=80" },
    ],
  },
  // ===== Bonus: older delivered + reviewed → completed =====
  {
    id: "PO-2569-3001", date: "20 ม.ค. 2569 - 11:30 น.", deliveryDate: "5 ก.พ. 2569",
    supplier: "METAHERB Store", paymentTerms: "เครดิต 30 วัน", totalAmount: 42000, status: "completed",
    trackingNumber: "TH00124573821",
    items: [
      { name: "กระชายแห้ง (ฝาน)", supplier: "METAHERB Store", qty: 100, unit: "กก.", price: 420, image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=200&q=80" },
    ],
  },
  // ===== Scenario 6: from QT-3038 → PO-3038 — cancelled =====
  {
    id: "PO-2569-3038", date: "18 ก.พ. 2569 - 10:45 น.", deliveryDate: "5 มี.ค. 2569",
    supplier: "METAHERB Store", paymentTerms: "เครดิต 30 วัน", totalAmount: 55640, status: "cancelled",
    refQuoteId: "QT-2569-3038",
    items: [
      { name: "ดอกอัญชันแห้ง", supplier: "METAHERB Store", qty: 100, unit: "กก.", price: 520, image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200&q=80" },
    ],
    note: "ยกเลิกเนื่องจากเปลี่ยนสูตรการผลิต",
  },
];

const PO_STATUS_BADGE: Record<POStatusF, { bg: string; label: string }> = {
  pending:   { bg: "bg-[#f59e0b]", label: "รอชำระเงิน" },
  preparing: { bg: "bg-[#007aff]", label: "กำลังจัดเตรียม" },
  shipped:   { bg: "bg-[#319754]", label: "จัดส่งแล้ว" },
  delivered: { bg: "bg-[#10b981]", label: "รับสินค้าแล้ว" },
  completed: { bg: "bg-[#0c8a3e]", label: "สำเร็จ" },
  cancelled: { bg: "bg-[#ef4444]", label: "ยกเลิก" },
};

/* ========== Full-page document detail (PR / Quote / PO) — factory side ==========
 * Mirrors the supplier's PO detail layout: back bar, title + status, a 2/3 items
 * column with totals, and a 1/3 info column. Read-only — the factory just
 * reviews what it already sent / received. */
function DocumentDetailPage({ kind, pr, quote, po, onBack, onOpenPo, onPayPo, onContact, onReorder }: {
  kind: "pr" | "quote" | "po";
  pr: PRRecord | null;
  quote: QuoteRecord | null;
  po: PORecord | null;
  onBack: () => void;
  onOpenPo: (poId: string) => void;          // PR → its converted PO detail
  onPayPo: () => void;                        // PO pending → payment
  onContact: () => void;                      // open supplier chat
  onReorder: (po: PORecord) => void;          // PO completed/cancelled → new PR
}) {
  // Normalize the three document shapes into one render model.
  const model = (() => {
    if (kind === "pr" && pr) {
      const s = PR_STATUS_BADGE[pr.status];
      return {
        title: "รายละเอียดใบขอสั่งซื้อ (PR)", id: pr.id, date: pr.date,
        statusBg: s.bg, statusLabel: s.label,
        items: pr.items.map((it) => ({ ...it })),
        total: pr.totalAmount,
        meta: [
          { label: "ระยะเวลายื่นอนุมัติ", value: `${pr.validityDays} วัน` },
          ...(pr.approver ? [{ label: "ผู้อนุมัติ", value: pr.approver }] : []),
          ...(pr.poNumber ? [{ label: "เลข PO", value: pr.poNumber, accent: "#7c3aed" }] : []),
        ],
        note: pr.rejectReason ? { text: `เหตุผลปฏิเสธ: ${pr.rejectReason}`, danger: true } : undefined,
        supplier: pr.items[0]?.supplier ?? "METAHERB Store",
      };
    }
    if (kind === "quote" && quote) {
      const s = QT_STATUS_BADGE[quote.status];
      return {
        title: "รายละเอียดใบเสนอราคา (RFQ)", id: quote.id, date: quote.date,
        statusBg: s.bg, statusLabel: s.label,
        items: quote.items.map((it) => ({ ...it })),
        total: quote.totalAmount,
        meta: [
          { label: "มีผลถึง", value: quote.validUntil },
          { label: "คงเหลือ", value: quote.daysRemaining <= 0 ? "หมดอายุ" : `${quote.daysRemaining} วัน`, accent: quote.daysRemaining <= 0 ? "#dc2626" : undefined },
        ],
        note: quote.note ? { text: quote.note, danger: false } : undefined,
        supplier: quote.supplier,
      };
    }
    const p = po!;
    const s = PO_STATUS_BADGE[p.status];
    return {
      title: "รายละเอียดใบสั่งซื้อ (PO)", id: p.id, date: p.date,
      statusBg: s.bg, statusLabel: s.label,
      items: p.items.map((it) => ({ ...it })),
      total: p.totalAmount,
      meta: [
        { label: "วันที่ส่งของ", value: p.deliveryDate },
        { label: "เงื่อนไขชำระเงิน", value: p.paymentTerms, accent: "#d97706" },
        ...(p.refQuoteId ? [{ label: "อ้างอิงใบเสนอราคา", value: p.refQuoteId, accent: "#319754" }] : []),
        ...(p.refPrId ? [{ label: "อ้างอิงใบ PR", value: p.refPrId, accent: "#319754" }] : []),
        ...(p.trackingNumber ? [{ label: "หมายเลขพัสดุ", value: p.trackingNumber, accent: "#319754" }] : []),
      ],
      note: p.status === "cancelled" && p.note ? { text: p.note, danger: true } : undefined,
      supplier: p.supplier,
    };
  })();

  return (
    <div>
      {/* Back bar */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <span className={`${font} text-[12px] text-[#8e8e93]`}>{model.date}</span>
      </div>

      {/* Title + status */}
      <div className="flex items-center gap-4 mb-5 flex-wrap">
        <h2 className={`${font} text-[20px] text-black leading-[30px]`} style={{ fontWeight: 500 }}>{model.id}</h2>
        <span className={`${font} text-[12px] text-white px-4 py-1 rounded-full whitespace-nowrap ${model.statusBg}`} style={{ fontWeight: 500 }}>
          {model.statusLabel}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 — items + totals */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
            <div className="flex flex-col gap-4 pt-4 px-4">
              <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>รายการสินค้า</h3>
              <div className="h-px bg-gray-200 w-full" />
            </div>
            <div className="flex flex-col gap-2.5 p-4">
              {model.items.map((it, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="size-[70px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                    {it.image ? (
                      <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package className="size-5 text-gray-300" /></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between self-stretch py-1">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{it.name}</p>
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className={`${font} bg-[#f5f5f5] text-[#262626] text-[10px] px-2.5 py-0.5 rounded-full whitespace-nowrap tabular-nums`} style={{ fontWeight: 500 }}>
                        {it.qty.toLocaleString()} {it.unit} × ฿{it.price.toLocaleString()}/{it.unit}
                      </span>
                      <span className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>
                        ฿{(it.qty * it.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <span className={`${font} text-[14px] text-[#8e8e93]`} style={{ fontWeight: 500 }}>รวมทั้งสิ้น:</span>
              <span className={`${font} text-[20px] text-[#ff383c] tabular-nums`} style={{ fontWeight: 500 }}>
                ฿{model.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {model.note && (
            <div className={`rounded-2xl px-4 py-3 border flex items-start gap-2 ${model.note.danger ? "bg-red-50 border-red-100" : "bg-blue-50 border-blue-100"}`}>
              <AlertCircle className={`size-4 shrink-0 mt-0.5 ${model.note.danger ? "text-red-500" : "text-blue-500"}`} strokeWidth={2.4} />
              <p className={`${font} text-[13px] ${model.note.danger ? "text-red-700" : "text-blue-700"}`}>{model.note.text}</p>
            </div>
          )}
        </div>

        {/* Right 1/3 — supplier + meta */}
        <div className="bg-white rounded-2xl overflow-hidden self-start border border-gray-100">
          <div className="flex flex-col gap-4 pt-4 px-4">
            <h3 className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลเอกสาร</h3>
            <div className="h-px bg-gray-200 w-full" />
          </div>
          <div className="flex flex-col gap-3 p-4">
            <div className="flex items-center gap-3">
              <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                <Store className="size-4 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`${font} text-[11px] text-gray-400`}>Supplier</p>
                <p className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>{model.supplier}</p>
              </div>
            </div>
            <div className="h-px bg-gray-100" />
            {model.meta.map((m, i) => (
              <div key={i} className="flex items-center justify-between gap-2">
                <span className={`${font} text-[13px] text-gray-500`}>{m.label}</span>
                <span className={`${font} text-[13px] tabular-nums`} style={{ fontWeight: 600, color: (m as any).accent || "#111827" }}>{m.value}</span>
              </div>
            ))}
          </div>

          {/* Status-aware actions — same set as the list cards */}
          <div className="flex flex-col gap-3 p-4 pt-0">
            {/* PR — converted: jump to its PO */}
            {kind === "pr" && pr?.status === "converted" && pr.poNumber && (
              <button onClick={() => onOpenPo(pr.poNumber!)}
                className={`${font} w-full bg-[#007aff] hover:bg-[#0066cc] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,122,255,0.25)]`}
                style={{ fontWeight: 500 }}>
                <FileText className="size-4" />
                ดูใบ {pr.poNumber}
              </button>
            )}
            {/* Quote — download (unless expired) */}
            {kind === "quote" && quote && quote.status !== "expired" && (
              <button onClick={() => toast.success(`เริ่มดาวน์โหลด ${quote.id}.pdf`)}
                className={`${font} w-full bg-[#319754] hover:bg-[#287745] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
                style={{ fontWeight: 500 }}>
                <FileText className="size-4" />
                โหลดเอกสาร
              </button>
            )}
            {/* PO — status-driven actions mirroring the list card */}
            {kind === "po" && po && (
              <>
                {po.status === "pending" && (
                  <button onClick={onPayPo}
                    className={`${font} w-full bg-[#319754] hover:bg-[#287745] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
                    style={{ fontWeight: 500 }}>
                    <Wallet className="size-4" />
                    ชำระเงิน
                  </button>
                )}
                {po.status === "shipped" && (
                  <button onClick={() => toast.success(`ยืนยันรับสินค้า ${po.id} แล้ว`)}
                    className={`${font} w-full bg-[#319754] hover:bg-[#287745] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
                    style={{ fontWeight: 500 }}>
                    ได้รับสินค้าแล้ว
                  </button>
                )}
                {po.status === "delivered" && (
                  <button onClick={() => toast.success(`รีวิว ${po.id}`)}
                    className={`${font} w-full text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(247,147,29,0.25)]`}
                    style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f7931d 55%, #d97706 100%)", fontWeight: 500 }}>
                    <Star className="size-4" /> รีวิว Supplier
                  </button>
                )}
                {(po.status === "completed" || po.status === "cancelled") && (
                  <button onClick={() => onReorder(po)}
                    className={`${font} w-full bg-[#319754] hover:bg-[#287745] text-white h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
                    style={{ fontWeight: 500 }}>
                    <RotateCcw className="size-4" /> ซื้ออีกครั้ง (ออกใบ PR)
                  </button>
                )}
                <button onClick={onContact}
                  className={`${font} w-full border border-gray-200 text-gray-700 hover:bg-gray-50 h-10 rounded-full text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2`}
                  style={{ fontWeight: 500 }}>
                  <MessageCircle className="size-4" />
                  ติดต่อ Supplier
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addReview } = useOrders();
  const { openChat } = useChat();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<OrderStatus | "all" | "pending_group">("all");
  // viewMode is determined by URL — sidebar menu switches between distinct doc views.
  const location = useLocation();
  const viewMode: "orders" | "pr" | "quote" | "po" =
    location.pathname.startsWith("/pr-history")    ? "pr" :
    location.pathname.startsWith("/quote-history") ? "quote" :
    location.pathname.startsWith("/po-history")    ? "po" :
    "orders";
  const [prFilter, setPrFilter] = useState<"all" | PRStatus>("all");
  const [prDetailModal, setPrDetailModal] = useState<PRRecord | null>(null);
  const [quoteFilter, setQuoteFilter] = useState<"all" | QuoteStatus>("all");
  const [quoteDetailModal, setQuoteDetailModal] = useState<QuoteRecord | null>(null);
  const [poFilter, setPoFilter] = useState<"all" | POStatusF>("all");
  const [poDetailModal, setPoDetailModal] = useState<PORecord | null>(null);

  // Switching sidebar menu (viewMode changes via URL) closes any open detail page
  // so the user lands back on the list of the section they navigated to.
  useEffect(() => {
    setPrDetailModal(null);
    setQuoteDetailModal(null);
    setPoDetailModal(null);
  }, [location.pathname]);

  const prCounts = {
    pending:   MOCK_PRS.filter((p) => p.status === "pending").length,
    approved:  MOCK_PRS.filter((p) => p.status === "approved").length,
    converted: MOCK_PRS.filter((p) => p.status === "converted").length,
    rejected:  MOCK_PRS.filter((p) => p.status === "rejected").length,
  };
  // Priority order: รออนุมัติ (pending) first — those need the user's attention,
  // then อนุมัติแล้ว, แปลงเป็น PO, and ปฏิเสธ last.
  const PR_STATUS_ORDER: Record<PRStatus, number> = { pending: 0, approved: 1, converted: 2, rejected: 3 };
  const filteredPRs = (prFilter === "all" ? MOCK_PRS : MOCK_PRS.filter((p) => p.status === prFilter))
    .slice()
    .sort((a, b) => {
      const sa = PR_STATUS_ORDER[a.status] ?? 99;
      const sb = PR_STATUS_ORDER[b.status] ?? 99;
      if (sa !== sb) return sa - sb;
      return b.id.localeCompare(a.id); // newer ID first within the same status
    });

  const quoteCounts = {
    received: MOCK_QUOTES.filter((q) => q.status === "received").length,
    expired:  MOCK_QUOTES.filter((q) => q.status === "expired").length,
  };
  const filteredQuotes = quoteFilter === "all" ? MOCK_QUOTES : MOCK_QUOTES.filter((q) => q.status === quoteFilter);

  const poCounts = {
    pending:   MOCK_POS.filter((p) => p.status === "pending").length,
    preparing: MOCK_POS.filter((p) => p.status === "preparing").length,
    shipped:   MOCK_POS.filter((p) => p.status === "shipped").length,
    delivered: MOCK_POS.filter((p) => p.status === "delivered").length,
    completed: MOCK_POS.filter((p) => p.status === "completed").length,
    cancelled: MOCK_POS.filter((p) => p.status === "cancelled").length,
  };
  const filteredPOs = poFilter === "all" ? MOCK_POS : MOCK_POS.filter((p) => p.status === poFilter);

  const tabs: { label: string; status: OrderStatus | "all" | "pending_group"; icon: any }[] = [
    { label: t("orders_tab_all"), status: "all", icon: Package },
    { label: t("orders_tab_pending"), status: "pending_group", icon: Clock },
    { label: t("orders_tab_preparing"), status: "preparing", icon: Package },
    { label: t("orders_tab_shipped"), status: "shipped", icon: Truck },
    { label: t("orders_tab_delivered"), status: "delivered", icon: ClipboardList },
    { label: t("orders_tab_completed"), status: "completed", icon: CheckCircle },
    { label: t("orders_tab_cancelled"), status: "cancelled", icon: XCircle },
  ];

  const statusLabels: Record<OrderStatus, string> = {
    pending_payment: t("orders_status_pending_payment"),
    pending_verify: t("orders_status_pending_verify"),
    preparing: t("orders_status_preparing"),
    shipped: t("orders_status_shipped"),
    delivered: t("orders_status_delivered"),
    completed: t("orders_status_completed"),
    cancelled: t("orders_status_cancelled"),
  };

  const problemTypes = [
    { id: "damaged", title: t("complaint_type_damaged"), desc: t("complaint_type_damaged_desc"), badgeColor: "#FF383C", icon: imgDamaged },
    { id: "wrong_item", title: t("complaint_type_wrong"), desc: t("complaint_type_wrong_desc"), badgeColor: "#DF9723", icon: imgWrongItem },
    { id: "return", title: t("complaint_type_return"), desc: t("complaint_type_return_desc"), badgeColor: "#9747FF", icon: imgReturn },
    { id: "refund", title: t("complaint_type_refund"), desc: t("complaint_type_refund_desc"), badgeColor: "#0088FF", icon: imgRefund },
  ];
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [refundModal, setRefundModal] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");
  const [complaintModal, setComplaintModal] = useState<string | null>(null);

  const filtered = activeTab === "all"
    ? orders
    : activeTab === "pending_group"
      ? orders.filter((o) => o.status === "pending_payment" || o.status === "pending_verify")
      : orders.filter((o) => o.status === activeTab);

  const handleReview = (orderId: string) => {
    addReview(orderId, reviewRating, reviewComment);
    updateOrderStatus(orderId, "completed");
    setReviewModal(null);
    setReviewComment("");
    setReviewRating(5);
    toast.success(t("review_thanks"));
  };

  const handleRefund = (orderId: string) => {
    toast.success(t("refund_success"), { description: t("refund_success_desc") });
    setRefundModal(null);
    setRefundReason("");
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success(t("orders_id_copied"));
  };

  // Which full-page detail (if any) is open. Mirrors the supplier-side detail
  // page rather than a modal — a back button returns to the list.
  const detailOpen = prDetailModal || quoteDetailModal || poDetailModal;

  return (
    <div>
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <AccountSidebar />
        <div className="flex-1 min-w-0">

        {/* ======== Full-page detail (PR / Quote / PO) ======== */}
        {detailOpen ? (
          <DocumentDetailPage
            kind={prDetailModal ? "pr" : quoteDetailModal ? "quote" : "po"}
            pr={prDetailModal} quote={quoteDetailModal} po={poDetailModal}
            onBack={() => { setPrDetailModal(null); setQuoteDetailModal(null); setPoDetailModal(null); }}
            onOpenPo={(poId) => {
              const target = MOCK_POS.find((p) => p.id === poId);
              setPrDetailModal(null); setQuoteDetailModal(null);
              if (target) { setPoDetailModal(target); }
              else { toast.info(`เปิดดู ${poId}`); }
            }}
            onPayPo={() => navigate("/payment")}
            onContact={() => openChat("metaherb")}
            onReorder={(po) => {
              try {
                sessionStorage.setItem("metaherb:reorder-po-items", JSON.stringify(
                  po.items.map((it) => ({ name: it.name, supplier: it.supplier, qty: it.qty, unit: it.unit, price: it.price }))
                ));
              } catch {/* ignore */}
              navigate("/cart/pr?from=po");
            }}
          />
        ) : (
        <>
          <h2 className={`${font} text-[24px] mb-6`} style={{ fontWeight: 500 }}>
            {viewMode === "pr"    ? "ประวัติใบขอสั่งซื้อ (PR)" :
             viewMode === "quote" ? "ประวัติใบเสนอราคา (RFQ)" :
             viewMode === "po"    ? "ประวัติใบสั่งซื้อ (PO)" :
             t("orders_title")}
          </h2>

        {/* ======== PR view ======== */}
        {viewMode === "pr" && (
          <div className="space-y-5">
            {/* PR Tabs — frosted glass pill matching the orders style */}
            <div className="flex justify-start mb-5 sm:mb-7 relative z-10">
              <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full scrollbar-hide ring-1 ring-white/60"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
                }}>
                {([
                  { id: "all"       as const,   label: "ทั้งหมด",     icon: ClipboardList,    count: MOCK_PRS.length },
                  { id: "pending"   as PRStatus, label: "รออนุมัติ",  icon: Clock,            count: prCounts.pending },
                  { id: "approved"  as PRStatus, label: "อนุมัติแล้ว", icon: CheckCircle,      count: prCounts.approved },
                  { id: "converted" as PRStatus, label: "แปลงเป็น PO", icon: ArrowRightCircle, count: prCounts.converted },
                  { id: "rejected"  as PRStatus, label: "ปฏิเสธ",      icon: XCircle,          count: prCounts.rejected },
                ]).map((tab) => {
                  const isActive = prFilter === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setPrFilter(tab.id)}
                      className={`group/tab relative flex items-center gap-1.5 px-3 h-[34px] rounded-full text-[13px] ${font} cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
                        isActive ? "text-white" : "text-[#1d5b32] hover:text-[#287745]"
                      }`}
                      style={{ fontWeight: 500 }}>
                      {!isActive && (
                        <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />
                      )}
                      {isActive && (
                        <motion.div layoutId="pr-tab"
                          className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                          style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                      )}
                      <tab.icon className="size-[15px] relative z-10" strokeWidth={2.2} />
                      <span className="relative z-10 leading-none">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`relative z-10 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10px] tabular-nums ring-[1.5px] ${
                          isActive
                            ? "bg-white text-[#ef4444] ring-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                            : "text-white ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)]"
                        }`}
                        style={isActive ? { fontWeight: 700 } : { background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PR list — same visual language as order history cards */}
            {filteredPRs.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="size-16 text-gray-200 mx-auto" strokeWidth={1.5} />
                <p className={`${font} text-[14px] text-gray-400 mt-4`}>ไม่พบใบ PR ในสถานะนี้</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPRs.map((pr) => {
                  const pStyle = PR_PRIORITY_STYLE[pr.priority];
                  const sStyle = PR_STATUS_BADGE[pr.status];
                  return (
                    <div key={pr.id} onClick={() => setPrDetailModal(pr)}
                      className="bg-white rounded-[20px] overflow-hidden p-4 sm:p-5 shadow-[0_4px_12px_-4px_rgba(16,24,40,0.08)] border border-gray-100 hover:shadow-[0_12px_28px_-8px_rgba(16,24,40,0.12)] hover:border-gray-200 cursor-pointer transition-all duration-300">
                      {/* Top: Issuer */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="size-[24px] rounded-full bg-gradient-to-br from-[#46c474] to-[#319754] flex items-center justify-center text-white shadow-[0_2px_6px_-1px_rgba(49,151,84,0.4)]">
                          <ClipboardList className="size-3" strokeWidth={2.4} />
                        </div>
                        <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ใบขอสั่งซื้อ (Purchase Requisition)</span>
                      </div>

                      {/* PR ID + Status + Priority + Date */}
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`${font} text-[12.5px] text-gray-500 tabular-nums`}>{pr.id}</span>
                          <span className={`${font} text-[11px] px-3 py-1 rounded-full text-white ${sStyle.bg}`} style={{ fontWeight: 600 }}>{sStyle.label}</span>
                          <span className={`${font} text-[11px] px-2.5 py-1 rounded-full inline-flex items-center gap-1`}
                            style={{ backgroundColor: pStyle.bg, color: pStyle.color, fontWeight: 600 }}>
                            {pr.priority === "Urgent" && <AlertCircle className="size-2.5" strokeWidth={2.6} />}
                            {pr.priority}
                          </span>
                        </div>
                        <span className={`${font} text-[11.5px] text-gray-400`}>{pr.date}</span>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                      {/* Items — preview first 3 */}
                      <div className="space-y-3 mb-3">
                        {pr.items.slice(0, 3).map((item, i) => (
                          <div key={i} className="flex gap-2.5 items-start">
                            <div className="size-[60px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                  <Package className="size-5 text-gray-300" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                              <span className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>{item.name}</span>
                              <span className={`${font} text-[10px] text-black`}>Supplier: {item.supplier}</span>
                              <div className="flex items-center justify-between">
                                <span className={`${font} text-[10px] text-[#999]`}>จำนวน {item.qty.toLocaleString()} {item.unit}</span>
                                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿{(item.price * item.qty).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {pr.items.length > 3 && (
                          <button onClick={(e) => { e.stopPropagation(); setPrDetailModal(pr); }}
                            className={`flex items-center gap-1 text-[12px] text-gray-400 ${font} cursor-pointer hover:text-gray-600 w-full justify-center py-1`}>
                            <ChevronDown className="size-3" /> ดูทั้งหมด ({pr.items.length} รายการ)
                          </button>
                        )}
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                      {/* Footer: Total + Action */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>ยอดรวม:</span>
                          <span className={`${font} text-[22px] text-[#319754] tabular-nums`} style={{ fontWeight: 700 }}>฿{pr.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {pr.status === "converted" && pr.poNumber ? (
                            <button onClick={() => {
                              const target = MOCK_POS.find((p) => p.id === pr.poNumber);
                              if (target) setPoDetailModal(target);
                              else toast.info(`เปิดดู ${pr.poNumber}`);
                            }}
                              className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(0,122,255,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(0,122,255,0.4)] flex items-center justify-center gap-1.5`}
                              style={{ background: "linear-gradient(135deg, #5aa9ff 0%, #007aff 55%, #0066cc 100%)", fontWeight: 600 }}>
                              <FileText className="size-4" strokeWidth={2.2} /> ใบ {pr.poNumber}
                            </button>
                          ) : (
                            <button onClick={() => setPrDetailModal(pr)}
                              className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)] flex items-center justify-center gap-1.5`}
                              style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
                              <Eye className="size-4" strokeWidth={2.2} /> ดูใบ PR
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======== Quote (RFQ) view ======== */}
        {viewMode === "quote" && (
          <div className="space-y-5">
            {/* Quote Tabs — same frosted glass style as PR/Orders */}
            <div className="flex justify-start mb-5 sm:mb-7 relative z-10">
              <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full scrollbar-hide ring-1 ring-white/60"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
                }}>
                {([
                  { id: "all"      as const,       label: "ทั้งหมด",            icon: ClipboardList, count: MOCK_QUOTES.length },
                  { id: "received" as QuoteStatus, label: "ได้รับใบเสนอราคา", icon: CheckCircle,   count: quoteCounts.received },
                  { id: "expired"  as QuoteStatus, label: "หมดอายุ",            icon: AlertCircle,   count: quoteCounts.expired },
                ]).map((tab) => {
                  const isActive = quoteFilter === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setQuoteFilter(tab.id)}
                      className={`group/tab relative flex items-center gap-1.5 px-3 h-[34px] rounded-full text-[13px] ${font} cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
                        isActive ? "text-white" : "text-[#1d5b32] hover:text-[#287745]"
                      }`}
                      style={{ fontWeight: 500 }}>
                      {!isActive && <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />}
                      {isActive && (
                        <motion.div layoutId="quote-tab"
                          className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                          style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                      )}
                      <tab.icon className="size-[15px] relative z-10" strokeWidth={2.2} />
                      <span className="relative z-10 leading-none">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`relative z-10 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10px] tabular-nums ring-[1.5px] ${
                          isActive
                            ? "bg-white text-[#ef4444] ring-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                            : "text-white ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)]"
                        }`}
                        style={isActive ? { fontWeight: 700 } : { background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quote cards */}
            {filteredQuotes.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="size-16 text-gray-200 mx-auto" strokeWidth={1.5} />
                <p className={`${font} text-[14px] text-gray-400 mt-4`}>ไม่พบใบเสนอราคาในสถานะนี้</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredQuotes.map((qt) => {
                  const sStyle = QT_STATUS_BADGE[qt.status];
                  const daysColor = qt.daysRemaining <= 0 ? "#dc2626" : qt.daysRemaining <= 7 ? "#dc2626" : qt.daysRemaining <= 30 ? "#d97706" : "#319754";
                  const daysBg    = qt.daysRemaining <= 0 ? "rgba(239,68,68,0.1)" : qt.daysRemaining <= 7 ? "rgba(239,68,68,0.1)" : qt.daysRemaining <= 30 ? "rgba(217,119,6,0.08)" : "rgba(49,151,84,0.1)";
                  return (
                    <div key={qt.id} onClick={() => setQuoteDetailModal(qt)}
                      className="bg-white rounded-[20px] overflow-hidden p-4 sm:p-5 shadow-[0_4px_12px_-4px_rgba(16,24,40,0.08)] border border-gray-100 hover:shadow-[0_12px_28px_-8px_rgba(16,24,40,0.12)] hover:border-gray-200 cursor-pointer transition-all duration-300">
                      {/* Top: Issuer */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="size-[24px] rounded-full bg-gradient-to-br from-[#46c474] to-[#319754] flex items-center justify-center text-white shadow-[0_2px_6px_-1px_rgba(49,151,84,0.4)]">
                          <FileText className="size-3" strokeWidth={2.4} />
                        </div>
                        <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ใบเสนอราคา (Quotation)</span>
                      </div>

                      {/* QT ID + Status + Days + Date */}
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`${font} text-[12.5px] text-gray-500 tabular-nums`}>{qt.id}</span>
                          <span className={`${font} text-[11px] px-3 py-1 rounded-full text-white ${sStyle.bg}`} style={{ fontWeight: 600 }}>{sStyle.label}</span>
                          <span className={`${font} inline-flex items-baseline gap-1 px-2.5 py-1 rounded-full text-[11px] tabular-nums`}
                            style={{ backgroundColor: daysBg, color: daysColor, fontWeight: 700 }}>
                            {qt.daysRemaining <= 0 ? "หมดอายุ" : (<>{qt.daysRemaining}<span className="text-[10px] opacity-70" style={{ fontWeight: 500 }}>วัน</span></>)}
                          </span>
                        </div>
                        <span className={`${font} text-[11.5px] text-gray-400`}>{qt.date}</span>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                      {/* Supplier row */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="size-[36px] rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                          <Store className="size-4 text-[#319754]" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{qt.supplier}</p>
                          <p className={`${font} text-[11px] text-gray-500 truncate`}>มีผลถึง {qt.validUntil}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 mb-3">
                        {qt.items.map((item, i) => (
                          <div key={i} className="flex gap-2.5 items-start">
                            <div className="size-[60px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Package className="size-5 text-gray-300" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{item.name}</span>
                              <span className={`${font} text-[10px] text-gray-500 tabular-nums`}>ราคา/หน่วย: ฿{item.price.toLocaleString()} / {item.unit}</span>
                              <div className="flex items-center justify-between">
                                <span className={`${font} text-[10px] text-[#999]`}>จำนวน {item.qty.toLocaleString()} {item.unit}</span>
                                <span className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>฿{(item.price * item.qty).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Note (if any) */}
                      {qt.note && (
                        <div className="bg-blue-50 rounded-2xl px-4 py-3 border border-blue-100 mb-3">
                          <p className={`${font} text-[12px] text-blue-700`}>{qt.note}</p>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                      {/* Footer: Total + Action */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>ยอดรวม:</span>
                          <span className={`${font} text-[22px] text-[#319754] tabular-nums`} style={{ fontWeight: 700 }}>฿{qt.totalAmount.toLocaleString()}</span>
                        </div>
                        {qt.status === "expired" ? (
                          <button disabled onClick={(e) => e.stopPropagation()}
                            className={`min-w-[110px] h-[40px] px-4 rounded-full bg-gray-200 text-gray-400 text-[13.5px] ${font} cursor-not-allowed flex items-center justify-center gap-1.5`}
                            style={{ fontWeight: 600 }}
                            title="ใบเสนอราคาหมดอายุ — โหลดเอกสารไม่ได้">
                            <FileText className="size-4" strokeWidth={2.2} /> หมดอายุ
                          </button>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); toast.success(`เริ่มดาวน์โหลด ${qt.id}.pdf`); }}
                            className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)] flex items-center justify-center gap-1.5`}
                            style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
                            <FileText className="size-4" strokeWidth={2.2} /> โหลดเอกสาร
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======== PO view ======== */}
        {viewMode === "po" && (
          <div className="space-y-5">
            {/* PO Tabs */}
            <div className="flex justify-start mb-5 sm:mb-7 relative z-10">
              <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full scrollbar-hide ring-1 ring-white/60"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
                  boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
                }}>
                {([
                  { id: "all"       as const,     label: "ทั้งหมด",         icon: ClipboardList, count: MOCK_POS.length },
                  { id: "pending"   as POStatusF, label: "รอชำระเงิน",      icon: Clock,         count: poCounts.pending },
                  { id: "preparing" as POStatusF, label: "กำลังจัดเตรียม", icon: Package,       count: poCounts.preparing },
                  { id: "shipped"   as POStatusF, label: "จัดส่งแล้ว",      icon: Truck,         count: poCounts.shipped },
                  { id: "delivered" as POStatusF, label: "รับสินค้าแล้ว",   icon: ClipboardList, count: poCounts.delivered },
                  { id: "completed" as POStatusF, label: "สำเร็จ",          icon: CheckCircle,   count: poCounts.completed },
                  { id: "cancelled" as POStatusF, label: "ยกเลิก",          icon: XCircle,       count: poCounts.cancelled },
                ]).map((tab) => {
                  const isActive = poFilter === tab.id;
                  return (
                    <button key={tab.id} onClick={() => setPoFilter(tab.id)}
                      className={`group/tab relative flex items-center gap-1.5 px-3 h-[34px] rounded-full text-[13px] ${font} cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
                        isActive ? "text-white" : "text-[#1d5b32] hover:text-[#287745]"
                      }`}
                      style={{ fontWeight: 500 }}>
                      {!isActive && <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />}
                      {isActive && (
                        <motion.div layoutId="po-tab"
                          className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                          style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                      )}
                      <tab.icon className="size-[15px] relative z-10" strokeWidth={2.2} />
                      <span className="relative z-10 leading-none">{tab.label}</span>
                      {tab.count > 0 && (
                        <span className={`relative z-10 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10px] tabular-nums ring-[1.5px] ${
                          isActive
                            ? "bg-white text-[#ef4444] ring-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                            : "text-white ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)]"
                        }`}
                        style={isActive ? { fontWeight: 700 } : { background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PO cards */}
            {filteredPOs.length === 0 ? (
              <div className="text-center py-16">
                <FileText className="size-16 text-gray-200 mx-auto" strokeWidth={1.5} />
                <p className={`${font} text-[14px] text-gray-400 mt-4`}>ไม่พบใบ PO ในสถานะนี้</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPOs.map((po) => {
                  const sStyle = PO_STATUS_BADGE[po.status];
                  return (
                    <div key={po.id} onClick={() => setPoDetailModal(po)}
                      className="bg-white rounded-[20px] overflow-hidden p-4 sm:p-5 shadow-[0_4px_12px_-4px_rgba(16,24,40,0.08)] border border-gray-100 hover:shadow-[0_12px_28px_-8px_rgba(16,24,40,0.12)] hover:border-gray-200 cursor-pointer transition-all duration-300">
                      {/* Top: Issuer */}
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="size-[24px] rounded-full bg-gradient-to-br from-[#46c474] to-[#319754] flex items-center justify-center text-white shadow-[0_2px_6px_-1px_rgba(49,151,84,0.4)]">
                          <FileText className="size-3" strokeWidth={2.4} />
                        </div>
                        <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>ใบสั่งซื้อ (Purchase Order)</span>
                      </div>

                      {/* PO ID + Status + Ref + Date */}
                      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className={`${font} text-[12.5px] text-gray-500 tabular-nums`}>{po.id}</span>
                          <span className={`${font} text-[11px] px-3 py-1 rounded-full text-white ${sStyle.bg}`} style={{ fontWeight: 600 }}>{sStyle.label}</span>
                          {(po.refQuoteId || po.refPrId) && (
                            <span className={`${font} bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full inline-flex items-center gap-1`} style={{ fontWeight: 500 }}>
                              <ArrowRightCircle className="size-2.5" strokeWidth={2.4} />
                              อ้างอิง {po.refQuoteId || po.refPrId}
                            </span>
                          )}
                        </div>
                        <span className={`${font} text-[11.5px] text-gray-400`}>{po.date}</span>
                      </div>

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                      {/* Supplier row */}
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="size-[36px] rounded-full bg-[#319754]/10 flex items-center justify-center shrink-0">
                          <Store className="size-4 text-[#319754]" strokeWidth={2.2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{po.supplier}</p>
                          <p className={`${font} text-[11px] text-gray-500 truncate`}>ส่งภายใน {po.deliveryDate} · {po.paymentTerms}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-3 mb-3">
                        {po.items.map((item, i) => (
                          <div key={i} className="flex gap-2.5 items-start">
                            <div className="size-[60px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center"><Package className="size-5 text-gray-300" /></div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{item.name}</span>
                              <span className={`${font} text-[10px] text-gray-500 tabular-nums`}>ราคา/หน่วย: ฿{item.price.toLocaleString()} / {item.unit}</span>
                              <div className="flex items-center justify-between">
                                <span className={`${font} text-[10px] text-[#999]`}>จำนวน {item.qty.toLocaleString()} {item.unit}</span>
                                <span className={`${font} text-[14px] text-black tabular-nums`} style={{ fontWeight: 600 }}>฿{(item.price * item.qty).toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tracking + cancel note */}
                      {po.trackingNumber && (
                        <div className="bg-[#319754]/5 rounded-2xl px-4 py-3 border border-[#319754]/15 mb-3 flex items-center gap-2">
                          <Truck className="size-4 text-[#319754] shrink-0" strokeWidth={2.4} />
                          <p className={`${font} text-[12px] text-gray-700`}>
                            หมายเลขพัสดุ: <span className="text-[#319754] tabular-nums" style={{ fontWeight: 600 }}>{po.trackingNumber}</span>
                          </p>
                        </div>
                      )}
                      {po.status === "cancelled" && po.note && (
                        <div className="bg-red-50 rounded-2xl px-4 py-3 border border-red-100 mb-3 flex items-start gap-2">
                          <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" strokeWidth={2.4} />
                          <p className={`${font} text-[12px] text-red-700`}>{po.note}</p>
                        </div>
                      )}

                      {/* Divider */}
                      <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                      {/* Footer: Total + status-aware actions (mirrors order history actions) */}
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <div className="flex items-baseline gap-2">
                          <span className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>ยอดรวม:</span>
                          <span className={`${font} text-[22px] text-[#319754] tabular-nums`} style={{ fontWeight: 700 }}>฿{po.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          {po.status === "pending" && (
                            <>
                              <button onClick={() => toast(`ยกเลิก ${po.id}`)}
                                className={`min-w-[110px] h-[40px] px-4 rounded-full border border-[#ff3b30] text-[#ef4444] text-[13.5px] ${font} cursor-pointer hover:bg-red-50 active:scale-[0.97] transition-all`} style={{ fontWeight: 500 }}>
                                ยกเลิก
                              </button>
                              <button onClick={() => navigate(`/payment`)}
                                className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)]`}
                                style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
                                ชำระเงิน
                              </button>
                            </>
                          )}
                          {po.status === "preparing" && (
                            <button onClick={() => openChat("metaherb")}
                              className={`min-w-[110px] h-[40px] px-4 rounded-full border border-[#319754] text-[#319754] text-[13.5px] ${font} cursor-pointer hover:bg-[#319754]/5 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5`} style={{ fontWeight: 500 }}>
                              <MessageCircle className="size-4" strokeWidth={2.2} /> ติดต่อ Supplier
                            </button>
                          )}
                          {po.status === "shipped" && (
                            <button onClick={() => toast.success(`ยืนยันรับสินค้า ${po.id} แล้ว`)}
                              className={`h-[40px] px-6 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)]`}
                              style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
                              ได้รับสินค้าแล้ว
                            </button>
                          )}
                          {po.status === "delivered" && (
                            <button onClick={() => toast.success(`รีวิว ${po.id}`)}
                              className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(247,147,29,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(247,147,29,0.4)] flex items-center justify-center gap-1.5`}
                              style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f7931d 55%, #d97706 100%)", fontWeight: 600 }}>
                              <Star className="size-4" strokeWidth={2.2} /> รีวิว Supplier
                            </button>
                          )}
                          {(po.status === "completed" || po.status === "cancelled") && (
                            <button onClick={() => {
                              // Stash PO line items so the PR form can pre-fill description / qty /
                              // unit price / supplier — fields that don't change between orders.
                              // Required date, priority, and justification stay empty for new input.
                              try {
                                sessionStorage.setItem("metaherb:reorder-po-items", JSON.stringify(
                                  po.items.map((it) => ({ name: it.name, supplier: it.supplier, qty: it.qty, unit: it.unit, price: it.price }))
                                ));
                              } catch {/* ignore quota errors */}
                              navigate("/cart/pr?from=po");
                            }}
                              className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)] flex items-center justify-center gap-1.5`}
                              style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
                              <RotateCcw className="size-4" strokeWidth={2.2} /> ซื้ออีกครั้ง (ออกใบ PR)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ======== Orders view (existing) ======== */}
        {viewMode === "orders" && (
        <>
        {/* Tabs — frosted glass pill with gradient active state */}
        <div className="flex justify-start mb-5 sm:mb-7 relative z-10">
          <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full scrollbar-hide ring-1 ring-white/60"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
            }}>
            {tabs.map((tab) => {
              const count = tab.status === "all" ? orders.length : tab.status === "pending_group"
                ? orders.filter((o) => o.status === "pending_payment" || o.status === "pending_verify").length
                : orders.filter((o) => o.status === tab.status).length;
              const isActive = activeTab === tab.status;
              return (
                <button key={tab.status} onClick={() => setActiveTab(tab.status)}
                  className={`group/tab relative flex items-center gap-1.5 px-3 h-[34px] rounded-full text-[13px] ${font} cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
                    isActive ? "text-white" : "text-[#1d5b32] hover:text-[#287745]"
                  }`}
                  style={{ fontWeight: 500 }}>
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />
                  )}
                  {isActive && (
                    <motion.div layoutId="orders-tab"
                      className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                      style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <tab.icon className="size-[15px] relative z-10" strokeWidth={2.2} />
                  <span className="relative z-10 leading-none">{tab.label}</span>
                  {count > 0 && (
                    <span className={`relative z-10 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10px] tabular-nums ring-[1.5px] ${
                      isActive
                        ? "bg-white text-[#ef4444] ring-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                        : "text-white ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)]"
                    }`}
                    style={isActive ? { fontWeight: 700 } : { background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Package className="size-16 text-gray-200 mx-auto" />
            <p className={`${font} text-[14px] text-gray-400 mt-4`}>{t("orders_empty")}</p>
            <button onClick={() => navigate("/products")} className={`mt-3 text-[13px] text-[#319754] ${font} cursor-pointer hover:underline`}>{t("orders_shop_now")}</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-white rounded-[20px] overflow-hidden p-4 sm:p-5 shadow-[0_4px_12px_-4px_rgba(16,24,40,0.08)] border border-gray-100 hover:shadow-[0_12px_28px_-8px_rgba(16,24,40,0.12)] transition-shadow duration-300">
                  {/* Top: Shop name + View detail */}
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="size-[24px] rounded-full bg-gradient-to-br from-[#46c474] to-[#319754] flex items-center justify-center text-white shadow-[0_2px_6px_-1px_rgba(49,151,84,0.4)]">
                        <Package className="size-3" strokeWidth={2.4} />
                      </div>
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>{order.shopName}</span>
                    </div>
                    <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className={`group/det flex items-center gap-1.5 text-[12px] text-[#319754] ${font} cursor-pointer hover:gap-2 transition-all`}
                      style={{ fontWeight: 500 }}>
                      {t("orders_view_details")}
                      <ArrowRightCircle className="size-[18px] group-hover/det:translate-x-0.5 transition-transform" strokeWidth={2.2} />
                    </button>
                  </div>

                  {/* Order ID + Status + Date */}
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`${font} text-[12.5px] text-gray-500 tabular-nums`}>{order.id}</span>
                      <span className={`${font} text-[11px] px-3 py-1 rounded-full ${statusBadgeColors[order.status]}`} style={{ fontWeight: 600 }}>{statusLabels[order.status]}</span>
                    </div>
                    <span className={`${font} text-[11.5px] text-gray-400`}>{order.date}</span>
                  </div>

                  {/* Divider */}
                  <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                  {/* Items */}
                  <div className="space-y-3 mb-3">
                    {order.items.slice(0, isExpanded ? undefined : 3).map((item, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <div className="size-[60px] rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <Package className="size-5 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                          <span className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>{item.name}</span>
                          <span className={`${font} text-[10px] text-black`}>{item.option}</span>
                          <div className="flex items-center justify-between">
                            <span className={`${font} text-[10px] text-[#999]`}>{t("pay_qty_text")} {item.quantity} {t("common_pieces")}</span>
                            <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && !isExpanded && (
                      <button onClick={() => setExpandedOrder(order.id)}
                        className={`flex items-center gap-1 text-[12px] text-gray-400 ${font} cursor-pointer hover:text-gray-600 w-full justify-center py-1`}>
                        <ChevronDown className="size-3" /> {t("orders_view_all_items")} ({order.items.length} {t("common_items")})
                      </button>
                    )}
                  </div>

                  {/* Timeline (expanded only) */}
                  {isExpanded && (
                    <div className="pb-3 border-t border-gray-100 pt-3 mb-3">
                      <p className={`${font} text-[13px] text-gray-600 mb-2`} style={{ fontWeight: 500 }}>{t("orders_status_label")}</p>
                      <OrderTimeline currentStatus={order.status} trackingNumber={order.trackingNumber} />
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`${font} text-[12px] text-gray-500`}>{t("orders_tracking_no")} {order.trackingNumber}</span>
                          <button onClick={() => { navigator.clipboard.writeText(order.trackingNumber!); toast.success(t("orders_tracking_copied")); }}
                            className="cursor-pointer"><Copy className="size-3 text-gray-400" /></button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                  {/* Footer: Total + Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-baseline gap-2">
                      <span className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>{t("orders_total_label")}</span>
                      <span className={`${font} text-[22px] text-[#ef4444] tabular-nums`} style={{ fontWeight: 700 }}>฿{order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2">
                      {order.status === "pending_payment" && (
                        <>
                          <button onClick={() => { updateOrderStatus(order.id, "cancelled"); toast(t("orders_cancelled_toast")); }}
                            className={`min-w-[110px] h-[40px] px-4 rounded-full border border-[#ff3b30] text-[#ef4444] text-[13.5px] ${font} cursor-pointer hover:bg-red-50 active:scale-[0.97] transition-all`} style={{ fontWeight: 500 }}>{t("orders_btn_cancel")}</button>
                          <button onClick={() => navigate(`/verify-payment/${order.id}`)}
                            className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)]`}
                            style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>{t("orders_btn_pay")}</button>
                        </>
                      )}
                      {order.status === "pending_verify" && (
                        <button className={`min-w-[110px] h-[40px] px-4 rounded-full border border-[#319754] text-[#319754] text-[13.5px] ${font} cursor-pointer hover:bg-[#319754]/5 active:scale-[0.97] transition-all`} style={{ fontWeight: 500 }}>{t("orders_btn_edit")}</button>
                      )}
                      {order.status === "preparing" && (
                        <button onClick={() => openChat("metaherb")}
                          className={`min-w-[110px] h-[40px] px-4 rounded-full border border-[#319754] text-[#319754] text-[13.5px] ${font} cursor-pointer hover:bg-[#319754]/5 active:scale-[0.97] transition-all flex items-center justify-center gap-1.5`} style={{ fontWeight: 500 }}>
                          <MessageCircle className="size-4" strokeWidth={2.2} /> {t("orders_btn_contact")}
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button onClick={() => { updateOrderStatus(order.id, "delivered"); toast.success(t("orders_received_toast")); }}
                          className={`h-[40px] px-6 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)]`}
                          style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>{t("orders_btn_confirm_received")}</button>
                      )}
                      {order.status === "delivered" && !order.review && (
                        <>
                          <button onClick={() => setComplaintModal(order.id)}
                            className={`min-w-[110px] h-[40px] px-4 rounded-full border border-gray-200 text-gray-700 text-[13.5px] ${font} cursor-pointer hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all`} style={{ fontWeight: 500 }}>
                            {t("orders_btn_complaint")}
                          </button>
                          <button onClick={() => setReviewModal(order.id)}
                            className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(247,147,29,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(247,147,29,0.4)] flex items-center justify-center gap-1.5`}
                            style={{ background: "linear-gradient(135deg, #fbbf24 0%, #f7931d 55%, #d97706 100%)", fontWeight: 600 }}>
                            <Star className="size-4" strokeWidth={2.2} /> {t("orders_btn_review")}
                          </button>
                        </>
                      )}
                      {order.status === "completed" && order.review && (
                        <button onClick={() => navigate("/products")}
                          className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)]`}
                          style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>{t("orders_btn_buy_again")}</button>
                      )}
                      {order.status === "cancelled" && (
                        <button onClick={() => navigate("/products")}
                          className={`min-w-[110px] h-[40px] px-4 rounded-full text-white text-[13.5px] ${font} cursor-pointer hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.5)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all shadow-[0_4px_12px_-2px_rgba(49,151,84,0.4)]`}
                          style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>{t("orders_btn_rebuy")}</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        </>
        )}
        </>
        )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setReviewModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-[400px]" onClick={(e) => e.stopPropagation()}>
            <h3 className={`${font} text-[18px] text-center mb-4`} style={{ fontWeight: 600 }}>{t("review_title")}</h3>

            <p className={`${font} text-[13px] text-gray-500 text-center mb-3`}>{t("review_tap_star")}</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} onClick={() => setReviewRating(s)}
                  className={`size-10 cursor-pointer transition-transform hover:scale-110 ${s <= reviewRating ? "fill-[#f7931d] text-[#f7931d]" : "text-gray-300"}`} />
              ))}
            </div>
            <p className={`${font} text-[12px] text-center text-[#f7931d] mb-4`}>
              {["", t("review_rating_1"), t("review_rating_2"), t("review_rating_3"), t("review_rating_4"), t("review_rating_5")][reviewRating]}
            </p>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[t("review_tag_good"), t("review_tag_fast"), t("review_tag_package"), t("review_tag_worth"), t("review_tag_accurate")].map((tag) => (
                <button key={tag} onClick={() => setReviewComment((p) => p + (p ? " " : "") + tag)}
                  className={`px-3 py-1 rounded-full border border-gray-200 text-[12px] ${font} cursor-pointer hover:border-[#319754] hover:text-[#319754]`}>
                  {tag}
                </button>
              ))}
            </div>

            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder={t("review_placeholder")}
              className={`w-full h-24 border border-gray-300 rounded-lg p-3 text-[14px] ${font} outline-none resize-none focus:border-[#319754]`} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setReviewModal(null)} className={`flex-1 py-3 rounded-full border border-gray-300 text-gray-600 text-[14px] ${font} cursor-pointer`}>{t("common_cancel")}</button>
              <button onClick={() => handleReview(reviewModal)} className={`flex-1 py-3 rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer`}>{t("review_submit")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRefundModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <h3 className={`${font} text-[18px] text-center mb-2`} style={{ fontWeight: 600 }}>{t("refund_title")}</h3>
            <p className={`${font} text-[12px] text-gray-500 text-center mb-4`}>{t("refund_subtitle")}</p>

            <div className="space-y-2 mb-4">
              {[t("refund_reason_desc"), t("refund_reason_damaged"), t("refund_reason_wrong"), t("refund_reason_qty"), t("refund_reason_change"), t("refund_reason_other")].map((reason) => (
                <label key={reason} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50">
                  <input type="radio" name="refundReason" value={reason} checked={refundReason === reason}
                    onChange={() => setRefundReason(reason)} className="accent-[#319754] size-4" />
                  <span className={`${font} text-[14px]`}>{reason}</span>
                </label>
              ))}
            </div>

            <textarea placeholder={t("refund_detail_ph")}
              className={`w-full h-20 border border-gray-300 rounded-lg p-3 text-[13px] ${font} outline-none resize-none`} />

            <div className="flex gap-2 mt-4">
              <button onClick={() => setRefundModal(null)} className={`flex-1 py-3 rounded-full border border-gray-300 text-gray-600 text-[14px] ${font} cursor-pointer`}>{t("common_cancel")}</button>
              <button onClick={() => handleRefund(refundModal)} disabled={!refundReason}
                className={`flex-1 py-3 rounded-full text-[14px] ${font} cursor-pointer ${refundReason ? "bg-[#ee4d2d] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>{t("refund_submit")}</button>
            </div>
          </div>
        </div>
      )}

      {/* Complaint Select Modal */}
      {complaintModal && (() => {
        const complaintOrder = orders.find((o) => o.id === complaintModal);
        return (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setComplaintModal(null)}>
            <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-[720px] my-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <h3 className={`${font} text-[18px] sm:text-[24px] text-black`} style={{ fontWeight: 600 }}>{t("complaint_select_title")}</h3>
                <button onClick={() => setComplaintModal(null)}
                  className="size-10 rounded-full bg-[#f4f4f4] flex items-center justify-center cursor-pointer hover:bg-[#e8e8e8]">
                  <XCircle className="size-5 text-gray-500" />
                </button>
              </div>

              {complaintOrder && (
                <div className={`mb-6 p-3 rounded-lg bg-[#f9fafb] border border-[#e5e7eb]`}>
                  <p className={`${font} text-[12px] text-[#999]`}>{t("complaint_order_label")} {complaintOrder.id}</p>
                  <p className={`${font} text-[14px] text-black mt-1`} style={{ fontWeight: 500 }}>{complaintOrder.shopName}</p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {problemTypes.map((type) => (
                  <button key={type.id}
                    onClick={() => { setComplaintModal(null); navigate(`/complaint/form/${complaintModal}?type=${type.id}`); }}
                    className="bg-white rounded-2xl border border-[#d9d9d9] p-3 sm:p-4 cursor-pointer hover:border-[#319754] hover:shadow-md transition-all text-left group">
                    <div className="flex gap-3 items-center">
                      <img src={type.icon} alt={type.title} className="size-[48px] sm:size-[60px] shrink-0 object-contain" />
                      <div className="flex-1 min-w-0">
                        <p className={`${font} text-[14px] sm:text-[16px] text-black`} style={{ fontWeight: 600 }}>{type.title}</p>
                        <p className={`${font} text-[12px] sm:text-[14px] text-[rgba(0,0,0,0.8)] mt-0.5`}>{type.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}