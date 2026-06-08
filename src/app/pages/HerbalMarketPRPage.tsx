import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronLeft, ChevronDown, ClipboardList, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { toast } from "sonner";
import { MATERIALS } from "../data/herbalMaterials";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const PRIORITIES = [
  { id: "Low",    label: "Low — ปกติทั่วไป" },
  { id: "Normal", label: "Normal — มาตรฐาน" },
  { id: "High",   label: "High — สำคัญ" },
  { id: "Urgent", label: "Urgent — เร่งด่วน" },
];

type LineItem = {
  id: string;
  itemCode: string;
  description: string;
  qty: number;
  uom: string;
  unitPrice: number;
  notes: string;
};

export default function HerbalMarketPRPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems } = useCart();

  const isBulk = !id;
  const bulkIds = (searchParams.get("ids") || "").split(",").filter(Boolean);
  const singleMaterial = !isBulk ? MATERIALS.find((m) => m.id === id) : undefined;

  // Build initial line items
  const buildInitial = (): LineItem[] => {
    if (isBulk) {
      const filtered = cartItems.filter((c) => bulkIds.length === 0 || bulkIds.includes(c.productId));
      return filtered.map((c, i) => {
        const mat = MATERIALS.find((m) => m.id === c.productId);
        return {
          id: `init-${i}-${c.productId}`,
          itemCode: c.productId.toUpperCase(),
          description: c.name,
          qty: c.quantity,
          uom: mat ? "กก." : "ชิ้น",
          unitPrice: mat?.pricePerKg ?? c.price,
          notes: c.option || "",
        };
      });
    }
    if (singleMaterial) {
      return [{
        id: `init-${singleMaterial.id}`,
        itemCode: singleMaterial.id.toUpperCase(),
        description: singleMaterial.name,
        qty: Number(searchParams.get("qty") || singleMaterial.moq || 100),
        uom: "กก.",
        unitPrice: singleMaterial.pricePerKg,
        notes: `${singleMaterial.grade} · ${singleMaterial.scientificName}`,
      }];
    }
    return [];
  };

  const [submitted, setSubmitted] = useState(false);
  const [priority, setPriority] = useState("Normal");
  const [requiredDate, setRequiredDate] = useState("");
  const [validityDays, setValidityDays] = useState("15");
  const [description, setDescription] = useState("");
  const [justification, setJustification] = useState("");
  const [lineItems] = useState<LineItem[]>(buildInitial());

  const totalAmount = lineItems.reduce((s, li) => s + li.qty * li.unitPrice, 0);

  const prNumber = `PR-${new Date().getFullYear() + 543}-${String(Math.abs(((user?.username || "x") + (description || "y")).split("").reduce((s, c) => s + c.charCodeAt(0), 0)) % 9000 + 1000)}`;
  const todayStr = new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });

  const backTo = isBulk ? "/cart" : singleMaterial ? `/market/${singleMaterial.id}` : "/market";
  const backLabel = isBulk ? "กลับสู่ตะกร้า" : "กลับสู่รายละเอียดวัตถุดิบ";

  const handleSubmit = () => {
    if (lineItems.length === 0) return toast.error("กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ");
    if (!requiredDate) return toast.error("กรุณาเลือกวันที่ต้องการ");
    if (!justification.trim()) return toast.error("กรุณาระบุเหตุผลการขออนุมัติ (Justification)");
    setSubmitted(true);
    toast.success(`ออกใบ ${prNumber} สำเร็จ`, { description: "ส่งให้ผู้อนุมัติแล้ว — รอการตรวจสอบ" });
  };

  // ============== Success screen ==============
  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px]">
        <div className="max-w-[560px] w-full text-center">
          <div className="size-20 rounded-full bg-[#319754]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="size-10 text-[#319754]" strokeWidth={2.2} />
          </div>
          <h1 className={`${font} text-[24px] text-[#319754] mb-2`} style={{ fontWeight: 600 }}>
            ส่งใบ PR เรียบร้อย!
          </h1>
          <p className={`${font} text-[14px] text-gray-600 mb-6 leading-relaxed`}>
            หมายเลข <span className="text-black" style={{ fontWeight: 600 }}>{prNumber}</span> ส่งให้ผู้อนุมัติแล้ว — สถานะใบ PR จะอัปเดตในหน้าจัดการเอกสาร
          </p>
          <div className="bg-[#fafaf7] rounded-xl p-4 mb-6 text-left">
            <p className={`${font} text-[12px] text-gray-500 mb-2`} style={{ fontWeight: 600 }}>ขั้นถัดไป</p>
            <ul className={`${font} text-[13px] text-gray-700 space-y-1.5`}>
              <li>✓ ผู้อนุมัติจะได้รับ Email + Notification ในระบบ</li>
              <li>✓ เมื่ออนุมัติแล้ว PR จะแปลงเป็น PO อัตโนมัติ</li>
              <li>✓ สามารถติดตามสถานะได้ที่หน้า "เอกสารของฉัน"</li>
            </ul>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={() => navigate(backTo)}
              className={`${font} h-11 px-5 rounded-full border border-[#319754] text-[#319754] text-[13px] cursor-pointer hover:bg-[#319754]/5`}
              style={{ fontWeight: 600 }}>
              {backLabel}
            </button>
            <button onClick={() => navigate("/market")}
              className={`${font} h-11 px-5 rounded-full bg-[#319754] text-white text-[13px] cursor-pointer hover:bg-[#287745]`}
              style={{ fontWeight: 600 }}>
              ดู Herbal Market
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center gap-2">
          <h1 className={`${font} text-[24px] md:text-[28px] text-[#319754]`} style={{ fontWeight: 600 }}>
            ออกใบขอสั่งซื้อ (Purchase Requisition)
          </h1>
          <p className={`${font} text-[13px] text-gray-600 max-w-[640px]`}>
            กรอกข้อมูลใบ PR เพื่อขออนุมัติการจัดซื้อ — หลังจากผู้อนุมัติอนุมัติแล้ว ระบบจะแปลงเป็น PO อัตโนมัติ
          </p>
        </div>
      </div>

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-5">
        {/* Back link + PR number badge */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => navigate(backTo)}
            className={`${font} inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#319754] transition-colors cursor-pointer`}>
            <ChevronLeft className="size-3.5" strokeWidth={2.4} />
            {backLabel}
          </button>
          <div className="flex items-center gap-2 text-[12px]">
            <span className={`${font} text-gray-500`}>เลขที่ PR</span>
            <span className={`${font} bg-white border border-gray-200 rounded-full px-3 py-1 text-black`} style={{ fontWeight: 600 }}>{prNumber}</span>
            <span className={`${font} text-gray-400`}>· {todayStr}</span>
          </div>
        </div>

        {/* === Card 1: PR Details === */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 space-y-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          {/* Row 1: Priority / Required Date / Total Amount */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority */}
            <FieldWrap label="Priority" required>
              <div className="relative">
                <select value={priority} onChange={(e) => setPriority(e.target.value)}
                  className={`${font} bg-[#fafafa] h-12 w-full pl-6 pr-12 rounded-full text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow cursor-pointer appearance-none`}>
                  {PRIORITIES.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </select>
                <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />
              </div>
            </FieldWrap>

            {/* Required Date */}
            <FieldWrap label="Required Date" required>
              <input type="date" value={requiredDate} onChange={(e) => setRequiredDate(e.target.value)}
                className={`${font} bg-[#fafafa] h-12 w-full px-6 rounded-full text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow`} />
            </FieldWrap>

            {/* Total Amount (auto-calc, readonly) */}
            <FieldWrap label="Total Amount">
              <input value={`฿${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} readOnly
                className={`${font} bg-[#fafafa] h-12 w-full px-6 rounded-full text-[14px] text-gray-600 outline-none cursor-not-allowed`}
                style={{ fontWeight: 600 }} />
            </FieldWrap>
          </div>

          {/* Row 2: Validity duration (chip select) */}
          <FieldWrap label="ระยะเวลาใบ PR (กำหนดยื่นเพื่ออนุมัติ)" required>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "7",  label: "7 วัน" },
                { value: "10", label: "10 วัน" },
                { value: "15", label: "15 วัน" },
                { value: "30", label: "30 วัน" },
                { value: "60", label: "60 วัน" },
              ].map((opt) => {
                const active = validityDays === opt.value;
                return (
                  <button key={opt.value} type="button" onClick={() => setValidityDays(opt.value)}
                    className={`${font} h-10 px-5 min-w-[88px] rounded-full text-[13px] cursor-pointer transition-all inline-flex items-center justify-center ${
                      active
                        ? "bg-[#319754] text-white shadow-[0_2px_8px_rgba(49,151,84,0.25)]"
                        : "bg-[#fafafa] text-gray-600 hover:bg-gray-100 border border-transparent"
                    }`} style={{ fontWeight: active ? 700 : 500 }}>
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </FieldWrap>

          {/* Description */}
          <FieldWrap label="Description">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              placeholder="คำอธิบายเพิ่มเติม เช่น ใช้สำหรับสายการผลิต A ในเดือนหน้า..."
              className={`${font} bg-[#fafafa] w-full px-6 py-3 rounded-2xl text-[14px] resize-none outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
          </FieldWrap>

          {/* Justification */}
          <FieldWrap label="Justification" required>
            <textarea value={justification} onChange={(e) => setJustification(e.target.value)} rows={3}
              placeholder="เหตุผลในการขออนุมัติจัดซื้อ (จำเป็น)"
              className={`${font} bg-[#fafafa] w-full px-6 py-3 rounded-2xl text-[14px] resize-none outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
          </FieldWrap>
        </div>

        {/* === Card 2: Line Items === */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between gap-3 mb-1 flex-wrap">
            <h3 className={`${font} text-[18px] text-black flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <ClipboardList className="size-5 text-[#319754]" strokeWidth={2.2} />
              Line Items
              <span className={`${font} text-[12px] text-gray-400`}>({lineItems.length} รายการ)</span>
            </h3>
          </div>
          <p className={`${font} text-[12px] text-gray-500 mb-4`}>รายการสินค้ามาจากตะกร้า — หากต้องการเพิ่ม/ลดสินค้า กรุณาแก้ไขในตะกร้าก่อน</p>

          {/* Table */}
          <div className="overflow-x-auto -mx-5 md:-mx-6">
            <table className="w-full border-collapse min-w-[800px]">
              <thead>
                <tr className="border-y border-gray-200 bg-gray-50">
                  <th className={`${font} text-[12px] text-gray-600 text-left px-3 py-2`} style={{ fontWeight: 600 }}>Item Code</th>
                  <th className={`${font} text-[12px] text-gray-600 text-left px-3 py-2`} style={{ fontWeight: 600 }}>Description</th>
                  <th className={`${font} text-[12px] text-gray-600 text-right px-3 py-2 w-[80px]`} style={{ fontWeight: 600 }}>Qty</th>
                  <th className={`${font} text-[12px] text-gray-600 text-left px-3 py-2 w-[90px]`} style={{ fontWeight: 600 }}>UoM</th>
                  <th className={`${font} text-[12px] text-gray-600 text-right px-3 py-2 w-[110px]`} style={{ fontWeight: 600 }}>Unit Price</th>
                  <th className={`${font} text-[12px] text-gray-600 text-right px-3 py-2 w-[110px]`} style={{ fontWeight: 600 }}>Amount</th>
                  <th className={`${font} text-[12px] text-gray-600 text-left px-3 py-2 w-[140px]`} style={{ fontWeight: 600 }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className={`${font} text-center text-[13px] text-gray-400 py-10`}>ไม่มีข้อมูล</td>
                  </tr>
                ) : (
                  lineItems.map((li) => (
                    <tr key={li.id} className="border-b border-gray-100">
                      <td className={`${font} text-[13px] text-gray-700 px-3 py-3 tabular-nums`}>{li.itemCode || "—"}</td>
                      <td className={`${font} text-[13px] text-black px-3 py-3`}>{li.description || "—"}</td>
                      <td className={`${font} text-[13px] text-right text-black px-3 py-3 tabular-nums`}>{li.qty.toLocaleString()}</td>
                      <td className={`${font} text-[13px] text-gray-700 px-3 py-3`}>{li.uom}</td>
                      <td className={`${font} text-[13px] text-right text-black px-3 py-3 tabular-nums`}>
                        {li.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`${font} text-[13px] text-right text-[#319754] px-3 py-3 tabular-nums`} style={{ fontWeight: 600 }}>
                        {(li.qty * li.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className={`${font} text-[12px] text-gray-500 px-3 py-3 truncate max-w-[140px]`}>{li.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-200 bg-gray-50">
                  <td colSpan={5} className={`${font} text-right text-[14px] text-gray-700 px-3 py-3`} style={{ fontWeight: 600 }}>Total:</td>
                  <td className={`${font} text-right text-[16px] text-[#319754] px-3 py-3 tabular-nums`} style={{ fontWeight: 700 }}>
                    {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {lineItems.length === 0 && (
            <p className={`${font} text-[11px] text-[#ff3b30] mt-2 flex items-center gap-1`}>
              <AlertCircle className="size-3" strokeWidth={2.4} />
              ต้องมีอย่างน้อย 1 รายการก่อนส่งใบ PR
            </p>
          )}
        </div>

        {/* === Footer buttons === */}
        <div className="flex items-center justify-end gap-3 pt-2 pb-4">
          <button onClick={() => navigate(backTo)}
            className={`${font} h-11 px-6 rounded-lg border border-gray-300 text-gray-700 text-[14px] cursor-pointer hover:bg-gray-50 uppercase tracking-wide transition-colors`}
            style={{ fontWeight: 600 }}>
            Cancel
          </button>
          <button onClick={handleSubmit}
            className={`${font} h-11 px-6 rounded-lg bg-[#319754] hover:bg-[#287745] text-white text-[14px] cursor-pointer transition-colors uppercase tracking-wide shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
            style={{ fontWeight: 600 }}>
            Submit for Approval
          </button>
        </div>
      </div>

    </div>
  );
}

/* ---- helper ---- */
function FieldWrap({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[13px] text-gray-700`} style={{ fontWeight: 500 }}>
        {label}{required && <span className="text-[#ff3b30] ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
