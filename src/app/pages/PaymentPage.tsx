import { useState } from "react";
import { MapPin, Truck, CreditCard, QrCode, Landmark, Banknote, Tag, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { useCart } from "../store/CartContext";
import { useOrders } from "../store/OrderContext";
import { useAuth } from "../store/AuthContext";
import { useLanguage } from "../store/LanguageContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { AddAddressModal } from "../components/AddAddressModal";
import { SelectCouponModal } from "../components/SelectCouponModal";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function PaymentPage() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { user } = useAuth();
  const { t } = useLanguage();

  const paymentMethods = [
    { id: "promptpay", label: t("pay_method_promptpay"), desc: t("pay_method_promptpay_desc"), icon: QrCode },
    { id: "bank", label: t("pay_method_bank"), desc: t("pay_method_bank_desc"), icon: Landmark },
    { id: "credit", label: t("pay_method_credit"), desc: t("pay_method_credit_desc"), icon: CreditCard },
    { id: "cod", label: t("pay_method_cod"), desc: t("pay_method_cod_desc"), icon: Banknote },
  ];
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
    // Derive shop from cart items (first item's shop wins) so owner notifications
    // route to the right shop. Falls back to METAHERB Store for legacy carts.
    const shopName = items[0]?.shopName ?? "METAHERB Store";
    const orderId = addOrder({
      items,
      total: grandTotal,
      status: selectedPayment === "cod" ? "preparing" : "pending_payment",
      shippingAddress: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140",
      paymentMethod: paymentMethods.find((p) => p.id === selectedPayment)?.label || "",
      shopName,
    });
    clearCart();
    // COD: skip verify-payment slip step → go straight home with confirmation
    if (selectedPayment === "cod") {
      toast.success(t("vp_checkout_complete"), { description: t("vp_checkout_complete_desc") });
      setTimeout(() => navigate("/"), 600);
      return;
    }
    navigate(`/verify-payment/${orderId}`);
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <p className={`${font} text-gray-400`}>{t("pay_empty")}</p>
        <button onClick={() => navigate("/products")} className={`mt-4 bg-[#319754] text-white px-6 py-2 rounded-full ${font} cursor-pointer`}>{t("pay_shop_now")}</button>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 text-center px-4">
        <h1 className={`${font} text-[20px] sm:text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>{t("pay_title")}</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-6">
          {/* Address */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>
                <MapPin className="size-5 inline mr-2 text-[#319754]" />{t("pay_address_title")}
              </h3>
              <span className={`${font} text-[13px] text-[#319754] cursor-pointer`}>{t("pay_change")}</span>
            </div>
            <div className="backdrop-blur-[8px] bg-[rgba(242,242,247,0.5)] flex flex-col gap-[10px] items-start p-3 sm:p-[16px] rounded-[16px] w-full">
              <div className="flex items-start justify-between w-full gap-2">
                <div className="flex flex-1 gap-2 sm:gap-[10px] items-center min-w-0 flex-wrap">
                  <p className={`${font} text-[14px] sm:text-[16px] text-black truncate`} style={{ fontWeight: 500 }}>{user?.username}</p>
                  <span className={`bg-[#08f] text-white text-[11px] sm:text-[12px] ${font} px-3 sm:px-[16px] py-[2px] sm:py-[4px] rounded-full shrink-0`} style={{ fontWeight: 500 }}>{t("pay_default_address")}</span>
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
            <button onClick={() => setShowAddAddress(true)} className={`mt-2 text-[13px] text-[#319754] ${font} cursor-pointer hover:underline`}>{t("pay_add_new_address")}</button>
          </div>

          {/* Shipping */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-3`} style={{ fontWeight: 600 }}>
              <Truck className="size-5 inline mr-2 text-[#319754]" />{t("pay_shipping_title")}
            </h3>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-white rounded border flex items-center justify-center text-[10px]" style={{ fontWeight: 700 }}>J&T</div>
                <div>
                  <p className={`${font} text-[13px]`} style={{ fontWeight: 500 }}>J&T Express</p>
                  <p className={`${font} text-[11px] text-gray-400`}>{t("pay_shipping_eta")}</p>
                </div>
              </div>
              <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 600 }}>฿0.00</span>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-xl p-4 sm:p-6 border border-gray-200">
            <h3 className={`${font} text-[16px] mb-3`} style={{ fontWeight: 600 }}>
              <CreditCard className="size-5 inline mr-2 text-[#319754]" />{t("pay_method_title")}
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
          <div className="bg-white rounded-[16px] p-4 lg:sticky lg:top-[140px] flex flex-col gap-4">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("pay_summary")}</p>
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
                    <p className={`${font} text-[12px] text-black`}>{item.option || t("pay_option")}</p>
                    <div className="flex items-center justify-between pr-4 w-full">
                      <span className={`bg-[#f2f2f7] rounded-full px-3 py-1 ${font} text-[12px] text-black`}>{t("pay_qty_text")} {item.quantity} {t("common_pieces")}</span>
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
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("pay_coupon")}</span>
              </div>
              <div className="flex gap-3 items-center">
                {selectedCoupon && (
                  <span className={`bg-[rgba(49,151,84,0.1)] rounded-lg px-2 py-1 ${font} text-[10px] text-[#319754]`}>
                    {selectedCoupon.title}
                  </span>
                )}
                <span onClick={() => setShowCouponModal(true)} className={`${font} text-[14px] text-[#0088ff] cursor-pointer`}>{t("pay_change")}</span>
              </div>
            </div>

            {/* Summary rows */}
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("pay_subtotal")} ({items.length} {t("common_pieces")})</span><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿{total.toFixed(2)}</span></div>
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("pay_discount")}</span><span className={`${font} text-[14px] text-[#34c759]`} style={{ fontWeight: 500 }}>-฿{discount.toFixed(2)}</span></div>
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("pay_vat")}</span><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿{vat.toFixed(2)}</span></div>
            <div className="flex justify-between px-4"><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("pay_shipping")}</span><span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>฿{shipping.toFixed(2)}</span></div>

            {/* Grand total */}
            <div className="flex justify-between items-center px-4">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("pay_grand_total")}</span>
              <span className={`${font} text-[20px] text-[#ff383c]`} style={{ fontWeight: 500 }}>฿{grandTotal.toFixed(2)}</span>
            </div>

            <button onClick={handleConfirm} className={`w-full h-[48px] rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>{t("pay_confirm")}</button>
          </div>
        </div>
      </div>

      <AddAddressModal open={showAddAddress} onClose={() => setShowAddAddress(false)} onSave={() => {}} />
      <SelectCouponModal open={showCouponModal} onClose={() => setShowCouponModal(false)} onSelect={(c) => setSelectedCoupon(c)} />
    </div>
  );
}