import { useState } from "react";
import { MapPin, Truck, CreditCard, QrCode, Landmark, Banknote, Tag, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useCart } from "../store/CartContext";
import { useOrders } from "../store/OrderContext";
import { useAuth } from "../store/AuthContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AddAddressModal } from "../components/AddAddressModal";
import { SelectCouponModal } from "../components/SelectCouponModal";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const paymentMethods = [
  { id: "promptpay", label: "พร้อมเพย์ PromptPay", desc: "แสกน QR Code ชำระเงิน", icon: QrCode },
  { id: "bank", label: "บัญชีธนาคาร", desc: "โอนเงินผ่านบัญชีธนาคารร้านค้า", icon: Landmark },
  { id: "credit", label: "บัตรเครดิต/บัตรเดบิต", desc: "ชำระเงินผ่านบัตรเครดิต/บัตรเดบิต", icon: CreditCard },
  { id: "cod", label: "ชำระเงินปลายทาง", desc: "ชำระเงินเมื่อได้รับสินค้าแล้ว", icon: Banknote },
];

export function PaymentPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState("promptpay");
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [couponCode, setCouponCode] = useState("");

  const discount = selectedCoupon ? 100 : 0;
  const vat = (total - discount) * 0.07;
  const shipping = 0;
  const grandTotal = total - discount + vat + shipping;

  const handleConfirm = () => {
    const orderId = addOrder({
      items,
      total: grandTotal,
      status: "pending_payment",
      shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
      paymentMethod: paymentMethods.find((p) => p.id === selectedPayment)?.label || "",
      shopName: "METAHERB Store",
    });
    clearCart();
    navigate(`/verify-payment/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className={`${font} text-gray-400`}>ไม่มีสินค้าในตะกร้า</p>
        <button onClick={() => navigate("/products")} className={`mt-4 bg-[#319754] text-white px-6 py-2 rounded-full ${font} cursor-pointer`}>ช้อปเลย</button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>ชำระเงิน</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Address */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>
                <MapPin className="size-5 inline mr-2 text-[#319754]" />ที่อยู่ในการจัดส่ง
              </h3>
              <span className={`${font} text-[13px] text-[#319754] cursor-pointer`}>เปลี่ยน</span>
            </div>
            <div className="backdrop-blur-[8px] bg-[rgba(242,242,247,0.5)] flex flex-col gap-[10px] items-start p-[16px] rounded-[16px] w-full">
              <div className="flex items-start justify-between w-full">
                <div className="flex flex-1 gap-[10px] items-center">
                  <p className={`${font} text-[16px] text-black whitespace-nowrap`} style={{ fontWeight: 500 }}>{user?.username}</p>
                  <span className={`bg-[#08f] text-white text-[12px] ${font} px-[16px] py-[4px] rounded-full shrink-0`} style={{ fontWeight: 500 }}>ที่อยู่หลัก</span>
                </div>
                <div className="bg-[rgba(120,120,128,0.12)] flex items-center justify-center rounded-full size-[28px] shrink-0 cursor-pointer">
                  <MoreHorizontal className="size-4 text-[#999]" />
                </div>
              </div>
              <div className="h-px w-full bg-[#D4D4D8]" />
              <div className={`${font} flex flex-col gap-[4px] text-black w-full`}>
                <p className="text-[16px]">{user?.phone || "090-000-000"}</p>
                <p className="text-[14px]">เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140</p>
              </div>
            </div>
            <button onClick={() => setShowAddAddress(true)} className={`mt-2 text-[13px] text-[#319754] ${font} cursor-pointer hover:underline`}>+ เพิ่มที่อยู่ใหม่</button>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-3`} style={{ fontWeight: 600 }}>
              <Truck className="size-5 inline mr-2 text-[#319754]" />ตัวเลือกการจัดส่ง
            </h3>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-white rounded border flex items-center justify-center text-[10px]" style={{ fontWeight: 700 }}>J&T</div>
                <div>
                  <p className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>J&T Express</p>
                  <p className={`${font} text-[11px] text-gray-400`}>จะได้รับภายใน 18 ก.พ. - 20 ก.พ.</p>
                </div>
              </div>
              <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 600 }}>฿0.00</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-3`} style={{ fontWeight: 600 }}>
              <CreditCard className="size-5 inline mr-2 text-[#319754]" />ช่องชำระเงิน
            </h3>
            <div className="space-y-3">
              {paymentMethods.map((m) => (
                <div key={m.id} onClick={() => setSelectedPayment(m.id)}
                  className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer border-2 transition-colors ${
                    selectedPayment === m.id ? "border-[#319754] bg-[#319754]/5" : "border-gray-200"
                  }`}>
                  <m.icon className={`size-6 ${selectedPayment === m.id ? "text-[#319754]" : "text-gray-400"}`} />
                  <div>
                    <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{m.label}</p>
                    <p className={`${font} text-[12px] text-gray-400`}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:w-[400px]">
          <div className="bg-white rounded-[16px] p-4 sticky top-[140px] flex flex-col gap-4">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>สรุปคำสั่งซื้อ</p>
            <div className="h-px w-full bg-[#D4D4D8]" />

            {/* Product list */}
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-[10px] items-start">
                  <div className="shrink-0 size-[80px] rounded-[16px] overflow-hidden">
                    <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col gap-1 self-stretch">
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{item.name}</p>
                    <p className={`${font} text-[12px] text-black`}>{item.option || 'ตัวเลือก 1'}</p>
                    <div className="flex items-center justify-between pr-4 w-full">
                      <span className={`bg-[#f2f2f7] rounded-full px-3 py-1 ${font} text-[12px] text-black`}>จำนวน {item.quantity} ชิ้น</span>
                      <span className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>฿{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="h-px w-full bg-[#D4D4D8]" />

            {/* Coupon */}
            <div className="bg-[rgba(242,242,247,0.5)] flex items-center justify-between p-4 rounded-[16px] w-full">
              <div className="flex gap-2 items-center">
                <Tag className="size-4 text-black" />
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>โค้ดส่วนลด</span>
              </div>
              <div className="flex gap-3 items-center">
                {selectedCoupon && (
                  <span className={`bg-[rgba(49,151,84,0.1)] rounded-lg px-2 py-1 ${font} text-[10px] text-[#319754]`}>
                    {selectedCoupon.title}
                  </span>
                )}
                <span onClick={() => setShowCouponModal(true)} className={`${font} text-[14px] text-[#0088ff] cursor-pointer`}>เปลี่ยน</span>
              </div>
            </div>

            {/* Summary rows */}
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ยอดรวมสินค้า ({items.length} ชิ้น)</span><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿{total.toFixed(2)}</span></div>
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ส่วนลด</span><span className={`${font} text-[14px] text-[#34c759]`} style={{ fontWeight: 500 }}>-฿{discount.toFixed(2)}</span></div>
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>VAT 7%</span><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿{vat.toFixed(2)}</span></div>
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ค่าจัดส่ง</span><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿{shipping.toFixed(2)}</span></div>

            {/* Grand total */}
            <div className="flex justify-between items-center px-4">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ยอดที่ต้องชำระ</span>
              <span className={`${font} text-[20px] text-[#ff383c]`} style={{ fontWeight: 500 }}>฿{grandTotal.toFixed(2)}</span>
            </div>

            <button onClick={handleConfirm} className={`w-full h-[48px] rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ยืนยันคำสั่งซื้อ</button>
          </div>
        </div>
      </div>

      <AddAddressModal open={showAddAddress} onClose={() => setShowAddAddress(false)} onSave={() => {}} />
      <SelectCouponModal open={showCouponModal} onClose={() => setShowCouponModal(false)} onSelect={(c) => setSelectedCoupon(c)} />
    </div>
  );
}