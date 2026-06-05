import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronLeft, Building2, Phone, Mail, Calendar, Sparkles, ClipboardList, CheckCircle2, MessageSquare, BadgeCheck, Package, ShoppingBag, Download } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";
import { toast } from "sonner";
import { MATERIALS, GRADE_STYLE } from "../data/herbalMaterials";
import imgLogo from "../../assets/logo.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const UNITS = ["kg", "ตัน", "ลิตร", "ชิ้น"];
const CERT_OPTIONS = ["ทั่วไป", "Organic", "GAP", "GMP", "ISO", "HALAL"];

export default function HerbalMarketQuotePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems } = useCart();

  // Mode detection: single (from material detail) vs bulk (from cart)
  const isBulk = !id;
  const bulkIds = (searchParams.get("ids") || "").split(",").filter(Boolean);

  // Build quote items
  type QuoteItem = { id: string; name: string; image: string; supplier: string; grade?: string; pricePerKg?: number; quantity: number; option?: string };

  const singleMaterial = !isBulk ? MATERIALS.find((m) => m.id === id) : undefined;

  const quoteItems: QuoteItem[] = isBulk
    ? cartItems
        .filter((c) => bulkIds.length === 0 || bulkIds.includes(c.productId))
        .map((c) => {
          const mat = MATERIALS.find((m) => m.id === c.productId);
          return {
            id: c.productId,
            name: c.name,
            image: c.image,
            supplier: c.shopName || mat?.supplier || "—",
            grade: mat?.grade,
            pricePerKg: mat?.pricePerKg ?? c.price,
            quantity: c.quantity,
            option: c.option,
          };
        })
    : singleMaterial
      ? [{
          id: singleMaterial.id,
          name: singleMaterial.name,
          image: singleMaterial.image,
          supplier: singleMaterial.supplier,
          grade: singleMaterial.grade,
          pricePerKg: singleMaterial.pricePerKg,
          quantity: Number(searchParams.get("qty") || singleMaterial.moq || 100),
        }]
      : [];

  const [submitted, setSubmitted] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Company info (for issuing quote)
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");

  // Primary contact
  const [contactName, setContactName] = useState(user?.username || "");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [poReference, setPoReference] = useState("");

  // Material details (single mode only)
  const [materialDetail, setMaterialDetail] = useState(
    singleMaterial ? `${singleMaterial.name} · เกรด ${singleMaterial.grade}` : ""
  );
  const [qty, setQty] = useState<number | "">(quoteItems[0]?.quantity ?? 100);
  const [unit, setUnit] = useState("kg");
  const [certPref, setCertPref] = useState("ทั่วไป");
  const [requiredBy, setRequiredBy] = useState("");
  const [note, setNote] = useState("");

  // Empty states
  if (!isBulk && !singleMaterial) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-center">
        <ClipboardList className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบวัตถุดิบรายการนี้</p>
        <button onClick={() => navigate("/market")}
          className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          กลับสู่ตลาดวัตถุดิบ
        </button>
      </div>
    );
  }
  if (isBulk && quoteItems.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-center">
        <ShoppingBag className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่มีรายการในตะกร้าสำหรับขอใบเสนอราคา</p>
        <button onClick={() => navigate("/cart")}
          className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          กลับสู่ตะกร้า
        </button>
      </div>
    );
  }

  const singleGradeStyle = singleMaterial ? GRADE_STYLE[singleMaterial.grade] : undefined;

  const handlePreview = () => {
    if (!companyName.trim()) return toast.error("กรุณากรอกชื่อบริษัท");
    if (!companyAddress.trim()) return toast.error("กรุณากรอกที่อยู่บริษัท");
    if (!contactName.trim()) return toast.error("กรุณากรอกชื่อผู้ติดต่อ");
    if (!email.trim()) return toast.error("กรุณากรอกอีเมล");
    if (!isBulk) {
      if (!materialDetail.trim()) return toast.error("กรุณาระบุวัตถุดิบ");
      if (!qty || Number(qty) <= 0) return toast.error("กรุณาระบุปริมาณ");
    }
    if (!requiredBy) return toast.error("กรุณาเลือกวันที่ต้องการ");
    setPreviewMode(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConfirmSend = () => {
    setSubmitted(true);
    toast.success("ส่ง RFQ เรียบร้อย — Supplier จะติดต่อกลับใน 24 ชม.");
  };

  const handleDownloadPdf = () => {
    window.print();
  };

  const backTo = isBulk ? "/cart" : `/market/${singleMaterial!.id}`;
  const backLabel = isBulk ? "กลับสู่ตะกร้า" : "กลับสู่รายละเอียดวัตถุดิบ";

  // Doc metadata
  const rfqNumber = `RFQ-${new Date().getFullYear() + 543}-${String(Math.abs(((companyName || "x") + email).split("").reduce((s, c) => s + c.charCodeAt(0), 0)) % 9000 + 1000)}`;
  const todayStr = new Date().toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Group items by supplier for bulk mode → produce one RFQ per supplier
  type DocBlock = { supplier: string; rfqNumber: string; rows: Array<{ name: string; qty: number; unit: string; price: number }> };
  const docs: DocBlock[] = (() => {
    if (!isBulk) {
      return [{
        supplier: singleMaterial?.supplier || "—",
        rfqNumber,
        rows: [{ name: materialDetail, qty: Number(qty || 0), unit, price: singleMaterial?.pricePerKg ?? 0 }],
      }];
    }
    const bySupplier = new Map<string, QuoteItem[]>();
    quoteItems.forEach((q) => {
      const key = q.supplier || "—";
      if (!bySupplier.has(key)) bySupplier.set(key, []);
      bySupplier.get(key)!.push(q);
    });
    return Array.from(bySupplier.entries()).map(([supplier, items], i) => ({
      supplier,
      rfqNumber: `${rfqNumber}-${String(i + 1).padStart(2, "0")}`,
      rows: items.map((q) => ({
        name: `${q.name}${q.option ? ` · ${q.option}` : ""}${q.grade ? ` · เกรด ${q.grade}` : ""}`,
        qty: q.quantity,
        unit: "kg",
        price: q.pricePerKg ?? 0,
      })),
    }));
  })();

  // ============== Preview screen ==============
  if (previewMode && !submitted) {
    return (
      <div className="-mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] bg-gray-100 min-h-screen pb-10">
        <style>{`@media print {
          html, body { background: white !important; margin: 0 !important; padding: 0 !important; }
          body * { visibility: hidden !important; }
          .rfq-doc-stack, .rfq-doc-stack * { visibility: visible !important; }
          .rfq-doc-stack { position: absolute !important; top: 0 !important; left: 0 !important; right: 0 !important; margin: 0 !important; padding: 0 !important; }
          .rfq-print-page { box-shadow: none !important; margin: 0 !important; padding: 0 !important; max-width: 100% !important; width: 100% !important; page-break-after: always; break-after: page; }
          .rfq-print-page:last-child { page-break-after: auto; break-after: auto; }
          /* margin: 0 removes browser-rendered header (URL, title) + footer (date, page #) */
          @page { size: A4; margin: 0; }
        }`}</style>

        {/* Top toolbar */}
        <div className="no-print max-w-[820px] mx-auto px-4 mb-4 flex items-center justify-between gap-3 flex-wrap">
          <button onClick={() => setPreviewMode(false)}
            className={`${font} inline-flex items-center gap-1 h-10 px-4 rounded-full border border-gray-200 bg-white text-gray-700 text-[13px] cursor-pointer hover:bg-gray-50 transition-colors`}
            style={{ fontWeight: 600 }}>
            <ChevronLeft className="size-4" strokeWidth={2.4} />
            แก้ไขข้อมูล
          </button>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleDownloadPdf}
              className={`${font} inline-flex items-center gap-2 h-10 px-4 rounded-full border-2 border-[#0088ff] text-[#0088ff] text-[13px] cursor-pointer hover:bg-[#0088ff]/5 transition-colors bg-white`}
              style={{ fontWeight: 600 }}>
              <Download className="size-4" strokeWidth={2.4} />
              ดาวน์โหลด PDF
            </button>
            <button onClick={handleConfirmSend}
              className={`${font} inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
              style={{ fontWeight: 600 }}>
              ส่ง RFQ ใน ERP
            </button>
          </div>
        </div>

        {/* A4 documents — one per supplier in bulk mode */}
        <div className="rfq-doc-stack">
        {docs.map((doc, docIdx) => (
        <div key={doc.rfqNumber} className="rfq-print-page max-w-[820px] mx-auto bg-white shadow-[0_8px_24px_rgba(16,24,40,0.08)] mb-6" style={{ pageBreakAfter: docIdx < docs.length - 1 ? "always" : "auto" }}>
          <div className={`${font} p-8 text-[12px] text-black`}>
            {/* Header — Metaherb logo + company info */}
            <div className="flex items-start gap-3">
              <img src={imgLogo} alt="Metaherb" className="size-14 shrink-0 mt-1 object-contain" />
              <div className="flex-1 text-right">
                <p className="text-[15px]" style={{ fontWeight: 700 }}>บริษัท เมต้าเฮิร์บ จำกัด</p>
                <p className="text-[11px]">เลขที่ 459/153 ถนนสุขสวัสดิ์ แขวงราษฎร์บูรณะ เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140</p>
                <p className="text-[11px]">โทรศัพท์ 061-4213111</p>
                <p className="text-[11px]">เลขประจำตัวผู้เสียภาษี: 0105565148242</p>
              </div>
            </div>

            <p className="text-center text-[16px] mt-3 mb-1" style={{ fontWeight: 700 }}>ใบเสนอราคา/Quotation</p>
            {isBulk && docs.length > 1 && (
              <p className="text-center text-[11px] text-gray-600 mb-2">
                ใบที่ {docIdx + 1} / {docs.length} · จาก Supplier: <span style={{ fontWeight: 600 }}>{doc.supplier}</span>
              </p>
            )}

            {/* Customer + doc meta */}
            <div className="space-y-1 text-[12px]">
              <div className="grid grid-cols-[80px_1fr_120px_120px] gap-x-2 items-baseline">
                <span><span style={{ fontWeight: 600 }}>เรียน :</span></span>
                <span style={{ fontWeight: 600 }}>{companyName || "—"}</span>
                <span><span style={{ fontWeight: 600 }}>เลขที่ :</span></span>
                <span>{doc.rfqNumber}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_120px_120px] gap-x-2 items-baseline">
                <span><span style={{ fontWeight: 600 }}>ที่อยู่ :</span></span>
                <span className="leading-snug">{companyAddress || "—"}{taxId && <><br/><span className="text-[11px]">เลขประจำตัวผู้เสียภาษี: {taxId}</span></>}</span>
                <span><span style={{ fontWeight: 600 }}>วันที่ :</span></span>
                <span>{todayStr}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_120px_120px] gap-x-2 items-baseline pt-1">
                <span><span style={{ fontWeight: 600 }}>ผู้ติดต่อ:</span></span>
                <span>{contactName || ""}{position && ` (${position})`}</span>
                <span><span style={{ fontWeight: 600 }}>อ้างถึง :</span></span>
                <span>{poReference || "30"}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_120px_120px] gap-x-2 items-baseline">
                <span><span style={{ fontWeight: 600 }}>อีเมล์:</span></span>
                <span>{email || ""}</span>
                <span className="text-[11px]"><span style={{ fontWeight: 600 }}>กำหนดยื่นราคา(วัน) :</span></span>
                <span>30</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_120px_120px] gap-x-2 items-baseline">
                <span><span style={{ fontWeight: 600 }}>โทรศัพท์:</span></span>
                <span>{phone || ""}</span>
                <span></span>
                <span></span>
              </div>
            </div>

            <p className="text-center mt-3 mb-2 text-[12px]">ทาง<span style={{ fontWeight: 600 }}>{doc.supplier}</span> (ผ่านแพลตฟอร์ม Metaherb) มีความยินดีขอเสนอราคาดังรายการต่อไปนี้</p>

            {/* Items table */}
            <table className="w-full border-collapse text-[11px]" style={{ tableLayout: "fixed" }}>
              <colgroup>
                <col style={{ width: "10%" }} />
                <col />
                <col style={{ width: "10%" }} />
                <col style={{ width: "12%" }} />
                <col style={{ width: "14%" }} />
                <col style={{ width: "16%" }} />
              </colgroup>
              <thead>
                <tr>
                  <th className="border border-black px-1 py-1 text-center" style={{ fontWeight: 600 }}>ลำดับ</th>
                  <th className="border border-black px-1 py-1 text-center" style={{ fontWeight: 600 }}>รายการ</th>
                  <th className="border border-black px-1 py-1 text-center" style={{ fontWeight: 600 }}>จำนวน</th>
                  <th className="border border-black px-1 py-1 text-center" style={{ fontWeight: 600 }}>หน่วยนับ</th>
                  <th className="border border-black px-1 py-1 text-center" style={{ fontWeight: 600 }}>ราคาต่อหน่วย</th>
                  <th className="border border-black px-1 py-1 text-center" style={{ fontWeight: 600 }}>ราคารวม(บาท)</th>
                </tr>
              </thead>
              <tbody>
                {(() => {
                  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  return (
                    <>
                      {doc.rows.map((row, idx) => (
                        <tr key={idx}>
                          <td className="border border-black px-1 py-1 text-center">{idx + 1}</td>
                          <td className="border border-black px-1 py-1">{row.name}</td>
                          <td className="border border-black px-1 py-1 text-center">{row.qty}</td>
                          <td className="border border-black px-1 py-1 text-center">{row.unit}</td>
                          <td className="border border-black px-1 py-1 text-right">{fmt(row.price)}</td>
                          <td className="border border-black px-1 py-1 text-right">{fmt(row.qty * row.price)}</td>
                        </tr>
                      ))}
                      {Array.from({ length: Math.max(0, 7 - doc.rows.length) }).map((_, i) => (
                        <tr key={`empty-${i}`} style={{ height: "22px" }}>
                          <td className="border border-black px-1">&nbsp;</td>
                          <td className="border border-black px-1">&nbsp;</td>
                          <td className="border border-black px-1">&nbsp;</td>
                          <td className="border border-black px-1">&nbsp;</td>
                          <td className="border border-black px-1">&nbsp;</td>
                          <td className="border border-black px-1">&nbsp;</td>
                        </tr>
                      ))}
                    </>
                  );
                })()}
              </tbody>
            </table>

            {/* Notes + Totals */}
            <div className="grid grid-cols-[1fr_300px] mt-1 text-[11px]">
              <div className="pr-2 py-1">
                <p><span style={{ fontWeight: 700 }}>หมายเหตุ :</span></p>
                {note && <p className="mt-1 leading-snug">{note}</p>}
                <p className="mt-2 leading-snug"><span style={{ fontWeight: 600 }}>เงื่อนไขการชำระเงิน:</span> เช็คสั่งจ่าย หรือ การโอน บัญชีธนาคารกรุงไทย ชื่อบัญชีบริษัท เมต้าเฮิร์บ จำกัด เลขที่บัญชี 173-074649-7 โปรดชำระในวันรับสินค้าหรือชำระก่อนวันรับสินค้า</p>
                {(certPref !== "ทั่วไป" || requiredBy) && (
                  <p className="mt-2 leading-snug text-gray-700">
                    {certPref !== "ทั่วไป" && <>เกรด/Certificate: <span style={{ fontWeight: 600 }}>{certPref}</span></>}
                    {certPref !== "ทั่วไป" && requiredBy && " · "}
                    {requiredBy && <>ต้องการภายใน: <span style={{ fontWeight: 600 }}>{requiredBy}</span></>}
                  </p>
                )}
              </div>
              <div className="border border-black">
                {(() => {
                  const totalQtyPrice = doc.rows.reduce((s, r) => s + r.qty * r.price, 0);
                  const beforeVat = totalQtyPrice * 100 / 107;
                  const vatAmt    = totalQtyPrice * 7   / 107;
                  const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                  return (
                    <>
                      {[
                        ["ยอดรวม",                       fmt(totalQtyPrice)],
                        ["ราคาก่อนภาษีมูลค่าเพิ่ม 7%",   fmt(beforeVat)],
                        ["ภาษีมูลค่าเพิ่ม 7%",            fmt(vatAmt)],
                        ["รวมราคาสินค้าหลังหักส่วนลด",   fmt(totalQtyPrice)],
                      ].map(([k, v]) => (
                        <div key={k} className="flex justify-between border-b border-black px-2 py-0.5">
                          <span style={{ fontWeight: 600 }}>{k}</span>
                          <span>{v}</span>
                        </div>
                      ))}
                      <div className="px-2 py-1 text-center italic text-[11px]">{thaiBahtText(totalQtyPrice)}</div>
                    </>
                  );
                })()}
              </div>
            </div>

            <p className="mt-3 text-[11px] leading-snug">
              *หากท่านลงนามหรือประทับตราหน่วยบริการตามที่บริษัท เมต้าเฮิร์บ จำกัด ได้นำเสนอในใบเสนอราคาฉบับนี้แล้ว ทางบริษัทจะนับใบเสนอราคาฉบับนี้คือเอกสารยืนยันการสั่งซื้อ โดยทันที
            </p>

            <div className="grid grid-cols-2 mt-2 text-[11px]">
              <div className="border border-black p-2">
                <p className="text-center" style={{ fontWeight: 700 }}>สำหรับ ลูกค้า</p>
                <p className="text-center text-[11px] mt-0.5">กรุณาลงนามและประทับตราหน่วยบริการ</p>
                <p className="text-center text-[11px]">เพื่อยืนยันการสั่งซื้อ</p>
                <div className="mt-4 space-y-4">
                  <div className="flex items-end gap-2">
                    <span className="shrink-0">ลงนาม:</span>
                    <span className="flex-1 border-b border-dotted border-black h-3" />
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="shrink-0">ตำแหน่ง :</span>
                    <span className="flex-1 border-b border-dotted border-black h-3" />
                  </div>
                  <div className="flex items-end gap-2 justify-center">
                    <span className="shrink-0">วันที่</span>
                    <span className="w-8 border-b border-dotted border-black h-3" />
                    <span className="shrink-0">/</span>
                    <span className="w-8 border-b border-dotted border-black h-3" />
                    <span className="shrink-0">/</span>
                    <span className="w-12 border-b border-dotted border-black h-3" />
                  </div>
                </div>
                <p className="mt-4">ประทับตราบริการหน่วย (ถ้ามี)</p>
                <div className="mt-4 border-b border-dotted border-black h-3" />
              </div>
              <div className="border border-black border-l-0 p-2 flex flex-col">
                <p className="text-center" style={{ fontWeight: 700 }}>จึงเรียนมาเพื่อโปรดพิจารณา</p>
                <div className="flex-1 min-h-[80px]" />
                <div className="text-center">
                  <p>........................................................</p>
                  <p>(นายอรรถพล อุทัยเรือง)</p>
                  <p>ผู้เสนอราคา</p>
                </div>
              </div>
            </div>

            <p className="mt-2 text-[10px]">** กรุณาลงลายมือชื่อเพื่อยืนยันใบเสนอราคาดังกล่าวและ Email : mataherb.herb@gmail.com</p>
          </div>
        </div>
        ))}
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px]">
        <div className="max-w-[560px] w-full text-center">
          <div className="size-20 rounded-full bg-[#319754]/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="size-10 text-[#319754]" strokeWidth={2.2} />
          </div>
          <h1 className={`${font} text-[24px] text-[#319754] mb-2`} style={{ fontWeight: 600 }}>
            ส่ง RFQ เรียบร้อย!
          </h1>
          <p className={`${font} text-[14px] text-gray-600 mb-6 leading-relaxed`}>
            ระบบจะกระจายคำขอไปยัง Supplier ที่ตรงกลุ่ม — รับ quote หลายเจ้าผ่านอีเมล
            <span className="text-black mx-1" style={{ fontWeight: 600 }}>{email || "บัญชีของคุณ"}</span>
            ภายใน 24 ชม.
          </p>
          <div className="bg-[#fafaf7] rounded-xl p-4 mb-6 text-left">
            <p className={`${font} text-[12px] text-gray-500 mb-2`} style={{ fontWeight: 600 }}>สิ่งที่จะได้รับ</p>
            <ul className={`${font} text-[13px] text-gray-700 space-y-1.5`}>
              <li>✓ Email confirmation พร้อมเลข RFQ</li>
              <li>✓ Quote จาก Supplier 3-5 เจ้า เปรียบเทียบ ราคา/MOQ/lead time ได้</li>
              <li>✓ COA + product spec sheet แนบใน quote</li>
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
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center gap-2">
          <h1 className={`${font} text-[24px] md:text-[28px] text-[#319754]`} style={{ fontWeight: 600 }}>
            ขอใบเสนอราคา (RFQ) {isBulk && <span className="text-[18px] text-gray-500">— {quoteItems.length} รายการ</span>}
          </h1>
          <p className={`${font} text-[13px] text-gray-600 max-w-[600px]`}>
            {isBulk
              ? "ส่ง RFQ พร้อมกันหลายรายการในตะกร้า — ระบบจะกระจายไปยัง Supplier แต่ละเจ้าให้ตอบกลับใน 24 ชม."
              : "ส่งคำขอครั้งเดียว — รับ quote หลายเจ้าใน 24 ชม. เปรียบเทียบราคา MOQ และ lead time ก่อนตัดสินใจ"}
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-12 py-6 space-y-5">
        {/* Back */}
        <button onClick={() => navigate(backTo)}
          className={`${font} inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#319754] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          {backLabel}
        </button>

        {/* Material preview — single OR bulk list */}
        {!isBulk && singleMaterial && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="shrink-0 size-[64px] rounded-lg overflow-hidden bg-gray-100 relative">
              <ImageWithFallback src={singleMaterial.image} alt={singleMaterial.name} className="w-full h-full object-cover" />
              <div className="absolute top-1 left-1">
                <span className={`${font} text-[9px] px-1.5 py-0.5 rounded-full`}
                  style={{ backgroundColor: singleGradeStyle!.bg, color: singleGradeStyle!.color, fontWeight: 600 }}>
                  {singleMaterial.grade}
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{singleMaterial.name}</p>
              <p className={`${font} text-[11px] text-gray-500 italic truncate`}>{singleMaterial.scientificName}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <Building2 className="size-3 text-gray-400" strokeWidth={2.2} />
                <span className={`${font} text-[11px] text-gray-600 truncate`}>{singleMaterial.supplier}</span>
                {singleMaterial.supplierVerified && <BadgeCheck className="size-3 text-[#319754] shrink-0" fill="#319754" stroke="#fff" strokeWidth={2.5} />}
              </div>
            </div>
            <span className={`${font} text-[11px] text-gray-400 hidden sm:inline shrink-0`}>RFQ จะส่งให้ Supplier ที่ตรงกลุ่ม</span>
          </div>
        )}

        {isBulk && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="size-4 text-[#319754]" strokeWidth={2.2} />
                <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>รายการขอใบเสนอราคา</span>
                <span className={`${font} text-[12px] text-gray-500`}>({quoteItems.length} รายการ)</span>
              </div>
              <button onClick={() => navigate("/cart")}
                className={`${font} text-[12px] text-[#319754] hover:underline cursor-pointer`}>
                แก้ไขในตะกร้า
              </button>
            </div>
            <div className="divide-y divide-gray-50">
              {quoteItems.map((q) => {
                const gradeSt = q.grade ? GRADE_STYLE[q.grade as keyof typeof GRADE_STYLE] : undefined;
                return (
                  <div key={q.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="shrink-0 size-[56px] rounded-lg overflow-hidden bg-gray-100 relative">
                      <ImageWithFallback src={q.image} alt={q.name} className="w-full h-full object-cover" />
                      {q.grade && gradeSt && (
                        <div className="absolute top-1 left-1">
                          <span className={`${font} text-[9px] px-1.5 py-0.5 rounded-full`}
                            style={{ backgroundColor: gradeSt.bg, color: gradeSt.color, fontWeight: 600 }}>
                            {q.grade}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 500 }}>{q.name}</p>
                      {q.option && <p className={`${font} text-[11px] text-gray-400 truncate`}>{q.option}</p>}
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Building2 className="size-3 text-gray-400" strokeWidth={2.2} />
                        <span className={`${font} text-[11px] text-gray-600 truncate`}>{q.supplier}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>{q.quantity} กก.</p>
                      {q.pricePerKg && <p className={`${font} text-[11px] text-gray-400`}>≈ ฿{(q.pricePerKg * q.quantity).toLocaleString()}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="px-4 py-2 bg-[#0088ff]/5 border-t border-[#0088ff]/10 flex items-center gap-2">
              <Sparkles className="size-3 text-[#0088ff]" strokeWidth={2.4} />
              <span className={`${font} text-[11px] text-gray-700`}>ระบบจะส่ง RFQ แยกตาม Supplier — คุณจะได้รับ quote หลายเจ้าใน 24 ชม.</span>
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 space-y-5">
          {/* Company info */}
          <section>
            <h2 className={`${font} text-[15px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Building2 className="size-4 text-[#319754]" strokeWidth={2.2} />
              ข้อมูลบริษัท
            </h2>
            <p className={`${font} text-[11px] text-gray-400 mb-3`}>ใช้สำหรับออกใบเสนอราคาและใบกำกับภาษี</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="ชื่อบริษัท / นิติบุคคล" required value={companyName} onChange={setCompanyName} placeholder="เช่น บริษัท เฮอร์บาแบรนด์ จำกัด" />
              <Field label="เลขประจำตัวผู้เสียภาษี" value={taxId} onChange={setTaxId} placeholder="13 หลัก" />
              <div className="md:col-span-2 flex flex-col gap-1">
                <label className={`${font} text-[12px] text-gray-600`}>ที่อยู่บริษัท <span className="text-[#ff3b30] ml-1">*</span></label>
                <textarea value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)}
                  rows={2} placeholder="เลขที่ / ซอย / ถนน / ตำบล / อำเภอ / จังหวัด / รหัสไปรษณีย์"
                  className={`${font} w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] resize-none outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          {/* Contact info */}
          <section>
            <h2 className={`${font} text-[15px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Sparkles className="size-4 text-[#319754]" strokeWidth={2.2} />
              ผู้ติดต่อ
            </h2>
            <p className={`${font} text-[11px] text-gray-400 mb-3`}>Supplier จะส่ง quote ไปที่ Email นี้</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="ชื่อ-นามสกุล" required value={contactName} onChange={setContactName} placeholder="ผู้ติดต่อหลัก" />
              <Field label="ตำแหน่ง" value={position} onChange={setPosition} placeholder="เช่น ฝ่ายจัดซื้อ" />
              <Field label="เบอร์โทร" value={phone} onChange={setPhone} placeholder="081-xxx-xxxx" icon={Phone} />
              <Field label="Email" required value={email} onChange={setEmail} placeholder="you@company.com" icon={Mail} type="email" />
              <div className="md:col-span-2">
                <Field label="เลขที่อ้างอิง / PO Reference" value={poReference} onChange={setPoReference} placeholder="optional — เลข PO ฝั่งคุณ (ถ้ามี)" />
              </div>
            </div>
          </section>

          <div className="h-px bg-gray-100" />

          {/* Material details / Conditions */}
          <section>
            <h2 className={`${font} text-[15px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <ClipboardList className="size-4 text-[#319754]" strokeWidth={2.2} />
              {isBulk ? "เงื่อนไขที่ต้องการ" : "รายละเอียดวัตถุดิบ"}
            </h2>
            <p className={`${font} text-[11px] text-gray-400 mb-3`}>
              {isBulk ? "เงื่อนไขจะใช้กับทุกรายการในใบเสนอราคา" : "ระบุละเอียดเท่าไหร่ ยิ่งได้ quote แม่นยำขึ้น"}
            </p>

            <div className="space-y-3">
              {!isBulk && (
                <>
                  <Field label="วัตถุดิบ" required value={materialDetail} onChange={setMaterialDetail}
                    placeholder="เช่น ขมิ้นชันออร์แกนิก แห้ง บด 80 mesh" icon={Package} />

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2 flex flex-col gap-1">
                      <label className={`${font} text-[12px] text-gray-600`}>ปริมาณ <span className="text-[#ff3b30] ml-0.5">*</span></label>
                      <input type="number" value={qty} placeholder="100"
                        onChange={(e) => setQty(e.target.value === "" ? "" : Number(e.target.value))}
                        className={`${font} h-10 px-3 rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className={`${font} text-[12px] text-gray-600`}>หน่วย</label>
                      <select value={unit} onChange={(e) => setUnit(e.target.value)}
                        className={`${font} h-10 px-3 rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white cursor-pointer transition-all`}>
                        {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className={`${font} text-[12px] text-gray-600 block mb-1.5`}>เกรด / Certificate ที่ต้องการ</label>
                <div className="flex flex-wrap gap-2">
                  {CERT_OPTIONS.map((c) => {
                    const active = certPref === c;
                    return (
                      <button key={c} type="button" onClick={() => setCertPref(c)}
                        className={`${font} text-[12px] px-3 py-1.5 rounded-full cursor-pointer transition-all ${
                          active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`} style={{ fontWeight: 500 }}>
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`${font} text-[12px] text-gray-600`}>ต้องการภายใน <span className="text-[#ff3b30] ml-0.5">*</span></label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />
                  <input type="date" value={requiredBy}
                    onChange={(e) => setRequiredBy(e.target.value)}
                    className={`${font} h-10 pl-10 pr-3 w-full rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className={`${font} text-[12px] text-gray-600 flex items-center gap-1`}>
                  <MessageSquare className="size-3 text-gray-400" strokeWidth={2.4} />
                  หมายเหตุ <span className="text-gray-400 text-[11px]">(optional)</span>
                </label>
                <textarea value={note} onChange={(e) => setNote(e.target.value)}
                  rows={3} placeholder="เช่น ต้องการแหล่งปลูกในไทย / ขอ COA แนบ / ส่งตัวอย่างก่อน"
                  className={`${font} w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] resize-none outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
              </div>
            </div>
          </section>

          {/* Info banner */}
          <div className="bg-[#319754]/5 rounded-xl p-3 flex items-start gap-2">
            <Sparkles className="size-3.5 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.4} />
            <p className={`${font} text-[11px] text-gray-700 leading-relaxed`}>
              ระบบจะส่ง RFQ ไปยัง Supplier ที่ตรงกลุ่ม <span style={{ fontWeight: 600 }}>โดยอัตโนมัติ</span> — คุณจะได้รับ quote หลายเจ้าผ่านอีเมลภายใน 24 ชม.
            </p>
          </div>

          <button onClick={handlePreview}
            className={`${font} w-full h-[48px] rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
            style={{ fontWeight: 600 }}>
            ดูตัวอย่างใบขอเสนอราคา {isBulk && `(${quoteItems.length} รายการ)`}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Convert Thai baht amount to words ---- */
function thaiBahtText(amount: number): string {
  if (!isFinite(amount) || amount === 0) return "ศูนย์บาทถ้วน";
  const digits = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const positions = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const readChunk = (numStr: string): string => {
    let s = "";
    const len = numStr.length;
    for (let i = 0; i < len; i++) {
      const d = parseInt(numStr[i]);
      const pos = len - i - 1;
      if (d === 0) continue;
      if (pos === 0 && d === 1 && len > 1) s += "เอ็ด";
      else if (pos === 1 && d === 2) s += "ยี่" + positions[pos];
      else if (pos === 1 && d === 1) s += positions[pos];
      else s += digits[d] + positions[pos];
    }
    return s;
  };
  const rounded = Math.round(amount * 100) / 100;
  const baht = Math.floor(rounded);
  const satang = Math.round((rounded - baht) * 100);
  let result = "";
  if (baht >= 1_000_000) {
    const millions = Math.floor(baht / 1_000_000);
    const rest = baht % 1_000_000;
    result += readChunk(String(millions)) + "ล้าน";
    if (rest > 0) result += readChunk(String(rest).padStart(6, "0").replace(/^0+/, ""));
  } else {
    result += readChunk(String(baht));
  }
  result += "บาท";
  if (satang === 0) result += "ถ้วน";
  else result += readChunk(String(satang)) + "สตางค์";
  return result;
}

/* ---- helper ---- */
function Field({ label, value, onChange, placeholder, required, icon: Icon, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; required?: boolean; icon?: any; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${font} text-[12px] text-gray-600`}>
        {label}{required && <span className="text-[#ff3b30] ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />}
        <input type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${font} h-10 ${Icon ? "pl-10" : "pl-3"} pr-3 w-full rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
      </div>
    </div>
  );
}
