import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { ChevronLeft, MapPin, Building2, Package, Calendar, Wallet, FileText, MessageSquare, BadgeCheck, Truck, ShieldCheck, ShoppingCart, Receipt, Phone, Mail, ClipboardCheck, AlertCircle, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useAuth } from "../store/AuthContext";
import { toast } from "sonner";
import { MATERIALS, GRADE_STYLE } from "../data/herbalMaterials";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const PAYMENT_TERMS = [
  { id: "full",   label: "ชำระเต็มจำนวน",        desc: "ชำระ 100% ก่อนจัดส่ง",                     icon: "💵" },
  { id: "50-50",  label: "มัดจำ 50% + ปลายทาง 50%", desc: "มัดจำเริ่มงาน + ชำระส่วนที่เหลือก่อนรับสินค้า", icon: "🤝" },
  { id: "net-30", label: "เครดิต 30 วัน",            desc: "ชำระภายใน 30 วันหลังรับสินค้า",            icon: "📅" },
  { id: "net-60", label: "เครดิต 60 วัน",            desc: "ชำระภายใน 60 วันหลังรับสินค้า",            icon: "🗓️" },
];

const DELIVERY_OPTIONS = [
  { id: "supplier-deliver", label: "Supplier จัดส่งให้",     desc: "ผู้ขายรับผิดชอบขนส่งถึงคลังผู้ซื้อ",        fee: 800 },
  { id: "self-pickup",      label: "ผู้ซื้อรับเอง (EXW)",     desc: "ไปรับที่คลัง Supplier",                  fee: 0   },
  { id: "third-party",      label: "ใช้บริการขนส่งบุคคลที่ 3", desc: "เลือกขนส่งเอง — Supplier จัดเตรียมพร้อมส่ง", fee: 0   },
];

export default function HerbalMarketPurchasePage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const material = MATERIALS.find((m) => m.id === id);
  const initialQty = Math.max(material?.moq || 1, Number(searchParams.get("qty") || material?.moq || 1));

  // Buyer info
  const [companyName, setCompanyName] = useState("");
  const [taxId, setTaxId] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [contactName, setContactName] = useState(user?.username || "");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");

  // Shipping
  const [shipAddress, setShipAddress] = useState("");
  const [shipDistrict, setShipDistrict] = useState("");
  const [shipProvince, setShipProvince] = useState("");
  const [shipPostcode, setShipPostcode] = useState("");
  const [shipNote, setShipNote] = useState("");

  // Order
  const [quantity, setQuantity] = useState(initialQty);
  const decQty = () => setQuantity((q) => Math.max(material?.moq ?? 1, q - 5));
  const incQty = () => setQuantity((q) => q + 5);
  const [packaging, setPackaging] = useState("25kg-bag");
  const [meshSize, setMeshSize] = useState("");
  const [requestedDate, setRequestedDate] = useState("");

  // Terms
  const [paymentTerm, setPaymentTerm] = useState("50-50");
  const [deliveryOption, setDeliveryOption] = useState("supplier-deliver");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [note, setNote] = useState("");

  if (!material) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-center">
        <Package className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบวัตถุดิบรายการนี้</p>
        <button onClick={() => navigate("/market")}
          className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          กลับสู่ตลาดวัตถุดิบ
        </button>
      </div>
    );
  }

  const gradeStyle = GRADE_STYLE[material.grade];
  const belowMoq = quantity < material.moq;
  const subtotal = quantity * material.pricePerKg;
  const deliveryFee = DELIVERY_OPTIONS.find((d) => d.id === deliveryOption)?.fee || 0;
  const vat = subtotal * 0.07;
  const grandTotal = subtotal + deliveryFee + vat;
  const depositRate = paymentTerm === "50-50" ? 0.5 : paymentTerm === "full" ? 1 : 0;
  const depositAmount = grandTotal * depositRate;

  const handleConfirm = () => {
    if (belowMoq) return toast.error(`จำนวนต่ำกว่า MOQ — ขั้นต่ำ ${material.moq} กก.`);
    if (!companyName.trim()) return toast.error("กรุณากรอกชื่อบริษัท/นิติบุคคล");
    if (!contactName.trim() || !phone.trim() || !email.trim()) return toast.error("กรุณากรอกข้อมูลผู้ติดต่อให้ครบ");
    if (!shipAddress.trim() || !shipProvince.trim() || !shipPostcode.trim()) return toast.error("กรุณากรอกที่อยู่จัดส่ง");
    if (!requestedDate) return toast.error("กรุณาเลือกวันที่ต้องการรับสินค้า");
    if (!acceptTerms) return toast.error("กรุณายอมรับเงื่อนไขก่อนยืนยัน");

    const poNumber = `PO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 90000) + 10000)}`;
    toast.success(`สร้างใบสั่งซื้อ ${poNumber} สำเร็จ`, {
      description: `Supplier "${material.supplier}" จะตอบกลับยืนยันภายใน 24 ชม.`,
    });
    setTimeout(() => navigate(`/market/${material.id}`), 1500);
  };

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center gap-2">
          <h1 className={`${font} text-[24px] md:text-[28px] text-[#319754]`} style={{ fontWeight: 600 }}>
            สร้างใบสั่งซื้อ (PO)
          </h1>
          <p className={`${font} text-[13px] text-gray-600 max-w-[640px]`}>
            ตรวจสอบรายละเอียดและกรอกข้อมูลการสั่งซื้อ — เมื่อยืนยัน ระบบจะสร้างเลข PO และส่งให้ Supplier ตอบกลับยืนยันภายใน 24 ชม.
          </p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        {/* LEFT — Forms */}
        <div className="flex-1 space-y-5">
          <button onClick={() => navigate(`/market/${material.id}`)}
            className={`${font} inline-flex items-center gap-1 text-[13px] text-gray-500 hover:text-[#319754] transition-colors cursor-pointer`}>
            <ChevronLeft className="size-3.5" strokeWidth={2.4} />
            กลับสู่รายละเอียดวัตถุดิบ
          </button>

          {/* Order details — Cart-row pattern (read-only) */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3 className={`${font} text-[16px] flex items-center gap-2`} style={{ fontWeight: 600 }}>
                  <Package className="size-5 text-[#319754]" strokeWidth={2.2} />
                  รายละเอียดคำสั่งซื้อ
                </h3>
                <p className={`${font} text-[12px] text-gray-500 mt-1`}>ปรับจำนวนได้โดยตรง — ขั้นต่ำตาม MOQ ของ Supplier</p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Supplier group header */}
              <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-full bg-[#319754] flex items-center justify-center text-white text-[11px] shrink-0" style={{ fontWeight: 600 }}>
                    {material.supplier.charAt(0)}
                  </div>
                  <span className={`${font} text-[14px] truncate`} style={{ fontWeight: 500 }}>{material.supplier}</span>
                  {material.supplierVerified && (
                    <span className={`${font} bg-[#319754] text-white text-[9px] px-1.5 py-0.5 rounded shrink-0 inline-flex items-center gap-0.5`} style={{ fontWeight: 500 }}>
                      <BadgeCheck className="size-2.5" strokeWidth={2.6} />
                      Verified
                    </span>
                  )}
                </div>
                <button onClick={() => toast.info(`เปิดแชทกับ ${material.supplier}`)}
                  className={`flex items-center gap-1 text-[12px] text-[#319754] ${font} cursor-pointer hover:underline shrink-0`}>
                  <MessageSquare className="size-3.5" strokeWidth={2.2} />
                  แชทกับ Supplier
                </button>
              </div>

              {/* Item row */}
              <div className="px-4 py-3">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="size-[72px] sm:size-[80px] rounded-lg bg-gray-100 overflow-hidden shrink-0 relative">
                    <ImageWithFallback src={material.image} alt={material.name} className="w-full h-full object-cover" />
                    <div className="absolute top-1 left-1">
                      <span className={`${font} text-[9px] px-1.5 py-0.5 rounded-full`}
                        style={{ background: gradeStyle.bg, color: gradeStyle.color, fontWeight: 700, boxShadow: gradeStyle.shadow, textShadow: gradeStyle.textShadow, letterSpacing: "0.02em" }}>
                        {material.grade}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="min-w-0">
                      <p className={`${font} text-[14px] truncate`} style={{ fontWeight: 500 }}>{material.name}</p>
                      <p className={`${font} text-[12px] text-gray-400 italic truncate`}>{material.scientificName}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-3 flex-wrap">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button onClick={decQty}
                          className="size-7 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-r border-gray-200">
                          <Minus className="size-3" strokeWidth={2.4} />
                        </button>
                        <input type="number" value={quantity}
                          onChange={(e) => setQuantity(Math.max(0, Number(e.target.value)))}
                          className={`${font} text-[14px] w-14 text-center bg-transparent outline-none`}
                          style={{ fontWeight: 500 }} />
                        <button onClick={incQty}
                          className="size-7 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-l border-gray-200">
                          <Plus className="size-3" strokeWidth={2.4} />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className={`${font} text-[11px] text-gray-400`}>฿{material.pricePerKg.toLocaleString()} / กก.</p>
                        <p className={`${font} text-[16px] text-[#319754]`} style={{ fontWeight: 600 }}>฿{subtotal.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer info strip */}
              <div className="px-4 py-2 border-t border-gray-100 bg-[#fafaf7] flex items-center gap-3 flex-wrap">
                <span className={`${font} text-[11px] text-gray-600 inline-flex items-center gap-1`}>
                  <Package className="size-3 text-[#319754]" strokeWidth={2.4} />
                  MOQ ขั้นต่ำ <span className="text-[#319754]" style={{ fontWeight: 600 }}>{material.moq} กก.</span>
                </span>
                <span className="text-gray-300">·</span>
                <span className={`${font} text-[11px] text-gray-600`}>
                  คงคลัง <span className="text-gray-700" style={{ fontWeight: 600 }}>{material.stock.toLocaleString()} กก.</span>
                </span>
              </div>
            </div>

            {belowMoq && (
              <p className={`${font} text-[11px] text-[#ff3b30] mt-2 flex items-center gap-1`}>
                <AlertCircle className="size-3" strokeWidth={2.4} />
                จำนวนต่ำกว่า MOQ ขั้นต่ำ {material.moq} กก.
              </p>
            )}
          </div>

          {/* Spec & delivery date card — PaymentPage row style */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-3 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Calendar className="size-5 text-[#319754]" strokeWidth={2.2} />
              สเปคและกำหนดส่ง
            </h3>
            <div className="backdrop-blur-[8px] bg-[rgba(242,242,247,0.5)] flex flex-col gap-[10px] p-[16px] rounded-[16px] w-full">
              {/* Packaging */}
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <Package className="size-4 text-[#319754] shrink-0" strokeWidth={2.2} />
                  <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>รูปแบบบรรจุภัณฑ์</span>
                </div>
                <select value={packaging} onChange={(e) => setPackaging(e.target.value)}
                  className={`${font} h-9 px-3 pr-8 rounded-full bg-white border border-gray-200 text-[13px] text-black outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 cursor-pointer transition-all max-w-[60%]`}
                  style={{ fontWeight: 500 }}>
                  <option value="1kg-bag">ถุงสุญญากาศ 1 กก.</option>
                  <option value="5kg-bag">ถุง 5 กก.</option>
                  <option value="10kg-bag">ถุง 10 กก.</option>
                  <option value="25kg-bag">กระสอบ 25 กก.</option>
                  <option value="custom">กำหนดเอง (ระบุในหมายเหตุ)</option>
                </select>
              </div>
              <div className="h-px w-full bg-[#D4D4D8]" />

              {/* Mesh */}
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="size-4 text-[#319754] shrink-0" strokeWidth={2.2} />
                  <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ขนาดผง / mesh</span>
                </div>
                <input value={meshSize} placeholder="เช่น 80 mesh"
                  onChange={(e) => setMeshSize(e.target.value)}
                  className={`${font} h-9 px-3 rounded-full bg-white border border-gray-200 text-[13px] text-right text-black placeholder:text-gray-400 outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 transition-all max-w-[60%]`}
                  style={{ fontWeight: 500 }} />
              </div>
              <div className="h-px w-full bg-[#D4D4D8]" />

              {/* Requested date */}
              <div className="flex items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-2 min-w-0">
                  <Calendar className="size-4 text-[#319754] shrink-0" strokeWidth={2.2} />
                  <div className="flex flex-col">
                    <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>
                      วันที่ต้องการรับสินค้า <span className="text-[#ff3b30]">*</span>
                    </span>
                    <span className={`${font} text-[11px] text-gray-400`}>แนะนำเผื่อ ≥ 7 วันสำหรับเตรียมสินค้า</span>
                  </div>
                </div>
                <input type="date" value={requestedDate}
                  onChange={(e) => setRequestedDate(e.target.value)}
                  className={`${font} h-9 px-3 rounded-full bg-white border border-gray-200 text-[13px] text-black outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 transition-all shrink-0`}
                  style={{ fontWeight: 500 }} />
              </div>
            </div>
          </div>

          {/* Buyer / Tax info */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Building2 className="size-5 text-[#319754]" strokeWidth={2.2} />
              ข้อมูลผู้ซื้อ / ออกใบกำกับภาษี
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>ใช้สำหรับออกใบกำกับภาษีและ PO ฉบับสมบูรณ์</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TextField label="ชื่อบริษัท / นิติบุคคล" required value={companyName} onChange={setCompanyName} placeholder="เช่น บริษัท เมต้าเฮิร์บ จำกัด" />
              <TextField label="เลขประจำตัวผู้เสียภาษี" value={taxId} onChange={setTaxId} placeholder="13 หลัก" />
              <div className="md:col-span-2">
                <TextField label="ที่อยู่ออกใบกำกับภาษี" value={billingAddress} onChange={setBillingAddress} placeholder="ที่อยู่ตามทะเบียนพาณิชย์" />
              </div>
              <TextField label="ผู้ติดต่อ" required value={contactName} onChange={setContactName} placeholder="ชื่อ-นามสกุล" />
              <TextField label="ตำแหน่ง" value={position} onChange={setPosition} placeholder="เช่น ฝ่ายจัดซื้อ" />
              <TextField label="เบอร์โทร" required value={phone} onChange={setPhone} placeholder="0XX-XXX-XXXX" icon={Phone} />
              <TextField label="อีเมล" required value={email} onChange={setEmail} placeholder="email@company.com" icon={Mail} type="email" />
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <MapPin className="size-5 text-[#319754]" strokeWidth={2.2} />
              ที่อยู่จัดส่ง
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>คลังสินค้า หรือสถานที่รับวัตถุดิบ</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="md:col-span-2">
                <TextField label="ที่อยู่ (เลขที่ / ซอย / ถนน)" required value={shipAddress} onChange={setShipAddress} placeholder="เช่น 123 ถ.พระราม 2" />
              </div>
              <TextField label="ตำบล / แขวง" value={shipDistrict} onChange={setShipDistrict} placeholder="" />
              <TextField label="จังหวัด" required value={shipProvince} onChange={setShipProvince} placeholder="" />
              <TextField label="รหัสไปรษณีย์" required value={shipPostcode} onChange={setShipPostcode} placeholder="5 หลัก" />
              <div className="md:col-span-2">
                <TextField label="หมายเหตุการจัดส่ง" value={shipNote} onChange={setShipNote} placeholder="เช่น โหลดที่ประตู 3 / มีรถยก" />
              </div>
            </div>
          </div>

          {/* Delivery option */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Truck className="size-5 text-[#319754]" strokeWidth={2.2} />
              รูปแบบการจัดส่ง
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>เลือกผู้รับผิดชอบขนส่ง</p>
            <div className="space-y-2">
              {DELIVERY_OPTIONS.map((d) => {
                const active = deliveryOption === d.id;
                return (
                  <button key={d.id} type="button" onClick={() => setDeliveryOption(d.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      active ? "border-[#319754] bg-[#319754]/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className={`size-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${active ? "border-[#319754]" : "border-gray-300"}`}>
                        {active && <div className="size-2 rounded-full bg-[#319754]" />}
                      </div>
                      <div className="min-w-0">
                        <p className={`${font} text-[13px] text-black`} style={{ fontWeight: active ? 600 : 500 }}>{d.label}</p>
                        <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{d.desc}</p>
                      </div>
                    </div>
                    <span className={`${font} text-[13px] shrink-0 ml-3 ${d.fee === 0 ? "text-[#319754]" : "text-gray-700"}`} style={{ fontWeight: 600 }}>
                      {d.fee === 0 ? "ฟรี" : `฿${d.fee.toLocaleString()}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment terms */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <Wallet className="size-5 text-[#319754]" strokeWidth={2.2} />
              เงื่อนไขการชำระเงิน
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-4`}>เลือกแผนการชำระเงิน — เงื่อนไขสุดท้ายขึ้นกับการตอบกลับของ Supplier</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {PAYMENT_TERMS.map((p) => {
                const active = paymentTerm === p.id;
                return (
                  <button key={p.id} type="button" onClick={() => setPaymentTerm(p.id)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      active ? "border-[#319754] bg-[#319754]/5" : "border-gray-200 hover:border-gray-300"
                    }`}>
                    <span className="text-[20px] leading-none shrink-0">{p.icon}</span>
                    <div className="min-w-0">
                      <p className={`${font} text-[13px] text-black`} style={{ fontWeight: active ? 600 : 500 }}>{p.label}</p>
                      <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>{p.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Note */}
          <div className="bg-white rounded-xl p-5 md:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-1 flex items-center gap-2`} style={{ fontWeight: 600 }}>
              <MessageSquare className="size-5 text-[#319754]" strokeWidth={2.2} />
              หมายเหตุเพิ่มเติม
            </h3>
            <p className={`${font} text-[12px] text-gray-500 mb-3`}>คำขอเฉพาะ, ข้อตกลงพิเศษ, หรือเอกสารเพิ่มเติม</p>
            <textarea value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="เช่น ต้องการ COA ทุก lot / ป้ายระบุ batch / ส่งสำเนา invoice ทาง email"
              rows={3}
              className={`${font} w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] resize-none outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
          </div>

          {/* Accept terms */}
          <div className="bg-[#319754]/5 rounded-xl p-4 border border-[#319754]/20">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)}
                className="size-4 mt-0.5 accent-[#319754] cursor-pointer shrink-0" />
              <span className={`${font} text-[12px] text-gray-700 leading-relaxed`}>
                ฉันยอมรับ <a className="text-[#319754] underline" href="#">เงื่อนไขการสั่งซื้อ B2B</a> และเข้าใจว่า PO นี้จะมีผลผูกพันเมื่อ Supplier ตอบกลับยืนยันภายใน 24 ชม. — สามารถยกเลิก/แก้ไข PO ได้ก่อน Supplier ยืนยัน
              </span>
            </label>
          </div>
        </div>

        {/* RIGHT — Summary (sticky) */}
        <div className="lg:w-[400px]">
          <div className="bg-white rounded-[16px] p-4 sticky top-[140px] flex flex-col gap-4 border border-gray-200">
            <p className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>สรุปใบสั่งซื้อ</p>
            <div className="h-px w-full bg-gray-200" />

            {/* Material info */}
            <div className="flex gap-3">
              <div className="shrink-0 size-[80px] rounded-[12px] overflow-hidden bg-gray-100 relative">
                <ImageWithFallback src={material.image} alt={material.name} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1">
                  <span className={`${font} text-[9px] px-1.5 py-0.5 rounded-full`}
                    style={{ background: gradeStyle.bg, color: gradeStyle.color, fontWeight: 700, boxShadow: gradeStyle.shadow, textShadow: gradeStyle.textShadow, letterSpacing: "0.02em" }}>
                    {material.grade}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{material.name}</p>
                <p className={`${font} text-[11px] text-gray-500 italic truncate`}>{material.scientificName}</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Building2 className="size-3 text-gray-400" strokeWidth={2.2} />
                  <span className={`${font} text-[11px] text-gray-600 truncate`}>{material.supplier}</span>
                  {material.supplierVerified && <BadgeCheck className="size-3 text-[#319754] shrink-0" fill="#319754" stroke="#fff" strokeWidth={2.5} />}
                </div>
              </div>
            </div>

            <div className="bg-[#fafaf7] rounded-xl p-3 flex flex-col gap-1.5">
              <div className="flex justify-between">
                <span className={`${font} text-[12px] text-gray-600`}>ราคา/กก.</span>
                <span className={`${font} text-[12px] text-black`} style={{ fontWeight: 600 }}>฿{material.pricePerKg.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${font} text-[12px] text-gray-600`}>จำนวน</span>
                <span className={`${font} text-[12px] text-black`} style={{ fontWeight: 600 }}>{quantity} กก.</span>
              </div>
              <div className="flex justify-between">
                <span className={`${font} text-[12px] text-gray-600`}>รูปแบบบรรจุ</span>
                <span className={`${font} text-[12px] text-black truncate ml-2`} style={{ fontWeight: 500 }}>
                  {packaging === "custom" ? "กำหนดเอง" : packaging.replace("kg-bag", " กก.").replace("1 ", "1 กก. (vac)")}
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-gray-200" />

            {/* Cost breakdown */}
            <div className="flex flex-col gap-2 px-1">
              <div className="flex justify-between">
                <span className={`${font} text-[13px] text-gray-600`}>ราคาวัตถุดิบ</span>
                <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>฿{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className={`${font} text-[13px] text-gray-600 inline-flex items-center gap-1.5`}>
                  <Truck className="size-3 text-gray-400" strokeWidth={2.2} />
                  ค่าจัดส่ง
                </span>
                <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>
                  {deliveryFee === 0 ? "ฟรี" : `฿${deliveryFee.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${font} text-[13px] text-gray-600`}>VAT 7%</span>
                <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>฿{vat.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
              </div>
              <div className="h-px w-full bg-gray-100 my-1" />
              <div className="flex justify-between items-center">
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>รวมทั้งสิ้น</span>
                <span className={`${font} text-[20px] text-[#319754]`} style={{ fontWeight: 700 }}>฿{grandTotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              {depositAmount > 0 && depositRate < 1 && (
                <div className="flex justify-between mt-1 bg-[#fff8e6] rounded-lg p-2.5">
                  <span className={`${font} text-[11px] text-[#a86a00]`} style={{ fontWeight: 600 }}>มัดจำเริ่มงาน ({depositRate * 100}%)</span>
                  <span className={`${font} text-[13px] text-[#a86a00]`} style={{ fontWeight: 700 }}>฿{depositAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
              )}
            </div>

            {/* PO process info */}
            <div className="bg-[#319754]/5 rounded-xl p-3 flex flex-col gap-2">
              {[
                { Icon: ClipboardCheck, label: "ระบบสร้างเลข PO ทันทีหลังยืนยัน" },
                { Icon: FileText,       label: "Supplier ตอบยืนยันใน 24 ชม." },
                { Icon: ShieldCheck,    label: "คุ้มครอง escrow ก่อน Supplier ยืนยัน" },
              ].map((it) => (
                <div key={it.label} className="flex items-start gap-2">
                  <it.Icon className="size-3.5 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.4} />
                  <span className={`${font} text-[11px] text-gray-700`}>{it.label}</span>
                </div>
              ))}
            </div>

            <button onClick={handleConfirm}
              className={`${font} w-full h-[48px] rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[14px] cursor-pointer transition-colors inline-flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
              style={{ fontWeight: 600 }}>
              <ShoppingCart className="size-4" strokeWidth={2.4} />
              ยืนยันสร้างใบสั่งซื้อ
            </button>
            <p className={`${font} text-[10px] text-gray-400 text-center -mt-2`}>
              PO จะถูกบันทึกในระบบและส่งสำเนา PDF ทางอีเมล
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---- Small helper ---- */
function TextField({ label, value, onChange, placeholder, required, icon: Icon, type = "text" }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  icon?: any;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className={`${font} text-[12px] text-gray-600`}>
        {label}{required && <span className="text-[#ff3b30] ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" strokeWidth={2.2} />
        )}
        <input type={type} value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${font} h-10 ${Icon ? "pl-10" : "pl-3"} pr-3 w-full rounded-lg border border-gray-200 text-[13px] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/10 bg-white transition-all`} />
      </div>
    </div>
  );
}
