import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useOrders } from "../store/OrderContext";
import { useLanguage } from "../store/LanguageContext";
import { ChevronLeft, Camera, Upload, X, Package } from "lucide-react";
import { toast } from "sonner";
import svgPaths from "../../imports/svg-msiytpo2yd";
import svgPaths2 from "../../imports/svg-vhvp3js49g";
import imgDamaged from "figma:asset/4f59e2204352b9ea47e8c08661dec6d473c60c53.png";
import imgWrongItem from "figma:asset/4517e4a0ab01b002c578ac42c372cf5b3a5ab1af.png";
import imgReturn from "figma:asset/a93992c00d6ca24ac5ac6db4f9ba36829787f574.png";
import imgRefund from "figma:asset/2c8e0b82e046f224d900948034e932ec386e66ff.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

function SmallBoxIcon({ color, icon }: { color: string; icon: string }) {
  return (
    <img src={icon} alt="" className="size-[40px] shrink-0 object-contain" />
  );
}

export function ComplaintFormPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") || "damaged";
  const { orders } = useOrders();
  const { t } = useLanguage();
  const order = orders.find((o) => o.id === orderId);

  const typeLabels: Record<string, { title: string; desc: string; color: string; icon: string }> = {
    damaged: { title: t("complaint_type_damaged"), desc: t("complaint_type_damaged_desc"), color: "#FF383C", icon: imgDamaged },
    wrong_item: { title: t("complaint_type_wrong"), desc: t("complaint_type_wrong_desc"), color: "#DF9723", icon: imgWrongItem },
    return: { title: t("complaint_type_return"), desc: t("complaint_type_return_desc"), color: "#9747FF", icon: imgReturn },
    refund: { title: t("complaint_type_refund"), desc: t("complaint_type_refund_desc"), color: "#0088FF", icon: imgRefund },
  };

  const [detail, setDetail] = useState("");
  const [email, setEmail] = useState("metaherb@gmail.com");
  const [images, setImages] = useState<string[]>([]);
  const [address] = useState("เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140");
  const [showChangePopup, setShowChangePopup] = useState(false);

  const typeInfo = typeLabels[type] || typeLabels.damaged;

  const handleImageUpload = () => {
    // Simulate image upload
    const mockImages = [
      "https://images.unsplash.com/photo-1586769852044-692d6e3703f2?w=200&h=200&fit=crop",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop",
    ];
    if (images.length < 5) {
      setImages((prev) => [...prev, mockImages[prev.length % mockImages.length]]);
      toast.success(t("cf_image_uploaded"));
    }
  };

  const totalRefund = order
    ? order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0;

  const handleSubmit = () => {
    if (!detail.trim()) {
      toast.error(t("cf_detail_required"));
      return;
    }
    // Generate complaint ID
    const complaintId = `CMP-${Date.now().toString(36).toUpperCase()}`;
    toast.success(t("cf_submitted"));
    navigate(`/complaint/status/${orderId}?type=${type}&cid=${complaintId}&amount=${totalRefund.toFixed(2)}`);
  };

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className={`${font} text-gray-500`}>{t("vp_not_found")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6">
      {/* Back */}
      <button onClick={() => navigate("/orders")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4d4d4] text-[12px] ${font} cursor-pointer hover:bg-[#c4c4c4] mb-6`}>
        <ChevronLeft className="size-3" /> {t("common_back")}
      </button>

      <div className="flex gap-6 flex-col lg:flex-row">
        {/* Left column */}
        <div className="flex-1 space-y-6">
          {/* Reason */}
          <div className="bg-white rounded-2xl p-4 sm:p-6">
            <div className="border-b border-[#d4d4d8] pb-2 mb-5">
              <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>{t("cf_reason_title")}</p>
            </div>
            <div className="border border-[#d9d9d9] rounded-2xl p-4">
              <div className="flex gap-3 items-center">
                <SmallBoxIcon color={typeInfo.color} icon={typeInfo.icon} />
                <div className="flex-1">
                  <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 600 }}>{typeInfo.title}</p>
                  <p className={`${font} text-[14px] text-[rgba(0,0,0,0.8)]`}>{typeInfo.desc}</p>
                </div>
                <button onClick={() => setShowChangePopup(true)}
                  className={`text-[#0088FF] text-[14px] ${font} cursor-pointer hover:underline`}>{t("common_change")}</button>
              </div>
            </div>
          </div>

          {/* Address */}
          {(type === "return" || type === "damaged") && (
            <div className="bg-white rounded-2xl p-4 sm:p-6">
              <div className="border-b border-[#d4d4d8] pb-2 mb-5">
                <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>{t("cf_return_addr_title")}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("cf_shipping_addr")}</p>
                  <span className={`px-4 py-0.5 rounded-full bg-[#0088FF] text-white text-[12px] ${font}`} style={{ fontWeight: 500 }}>{t("cf_default")}</span>
                </div>
                <div className="border border-[#d4d4d8] rounded-lg px-4 py-3">
                  <p className={`${font} text-[14px] text-black`}>{address}</p>
                </div>
              </div>
            </div>
          )}

          {/* Evidence */}
          <div className="bg-white rounded-2xl p-4 sm:p-6">
            <div className="border-b border-[#d4d4d8] pb-2 mb-5">
              <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>{t("cf_evidence")}</p>
            </div>
            <p className={`${font} text-[13px] text-[#666] mb-4`}>{t("cf_evidence_sub")}</p>

            {/* Upload area */}
            <div onClick={handleImageUpload}
              className="border-2 border-dashed border-[#d4d4d8] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#319754] hover:bg-[#f0fdf4] transition-all mb-4">
              <div className="size-14 rounded-full bg-[#f0fdf4] flex items-center justify-center mb-3">
                <Camera className="size-7 text-[#319754]" />
              </div>
              <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("cf_upload_click")}</p>
              <p className={`${font} text-[12px] text-[#999]`}>{t("cf_upload_drag")}</p>
              <button className={`mt-3 px-5 py-2 rounded-full bg-[#319754] text-white text-[13px] ${font} flex items-center gap-2 cursor-pointer hover:bg-[#267a43]`}>
                <Upload className="size-4" /> {t("cf_upload_choose")}
              </button>
            </div>

            {/* Uploaded images */}
            {images.length > 0 && (
              <div className="flex gap-3 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative size-[133px] rounded-lg overflow-hidden border border-[#d4d4d8]">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute top-1 right-1 size-6 rounded-full bg-black/50 flex items-center justify-center cursor-pointer">
                      <X className="size-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* More detail */}
          <div className="bg-white rounded-2xl p-4 sm:p-6">
            <div className="border-b border-[#d4d4d8] pb-2 mb-5">
              <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>{t("cf_more_detail")}</p>
            </div>
            <textarea value={detail} onChange={(e) => setDetail(e.target.value)}
              placeholder={t("cf_more_detail_ph")}
              className={`w-full h-32 border border-[#d4d4d8] rounded-lg p-4 text-[14px] ${font} outline-none resize-none focus:border-[#319754]`} />
          </div>
        </div>

        {/* Right column */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            {/* Items */}
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("cf_refund_items")}</p>
            <div className="w-full h-0 border-t border-[#d4d4d8]" />

            {/* Item list */}
            {order.items.map((item, i) => (
              <div key={i} className="relative rounded-[12px] border border-[#d9d9d9] bg-white">
                <div className="flex gap-2 items-center p-4">
                  <div className="size-[64px] rounded-lg overflow-hidden shrink-0 bg-[#e7e7e7]">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="size-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${font} text-[12px] text-black truncate`} style={{ fontWeight: 500 }}>{item.name}</p>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿ {(item.price * item.quantity).toFixed(2)}</p>
                    <p className={`${font} text-[10px] text-black`}>{t("pay_qty_text")} {item.quantity} {t("common_pieces")}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Refund details */}
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("cf_refund_details")}</p>

            {/* Refund amount */}
            <div className="flex gap-4 items-start">
              <p className={`${font} text-[14px] text-black w-[93px] shrink-0`} style={{ fontWeight: 500 }}>{t("cf_refund_amount")}</p>
              <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 700 }}>฿ {totalRefund.toFixed(2)}</p>
            </div>

            {/* Refund channel */}
            <div className="flex gap-4 items-start">
              <p className={`${font} text-[14px] text-black shrink-0`} style={{ fontWeight: 500 }}>{t("cf_refund_channel")}</p>
              <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("cf_refund_bank")}</p>
            </div>

            {/* Email */}
            <div className="flex gap-4 items-start">
              <p className={`${font} text-[14px] text-black w-[93px] shrink-0 pt-2.5`} style={{ fontWeight: 500 }}>{t("cf_email")}</p>
              <input value={email} onChange={(e) => setEmail(e.target.value)}
                className={`flex-1 border border-[#d4d4d8] rounded-[12px] px-4 py-3 text-[14px] ${font} outline-none focus:border-[#319754]`} />
            </div>

            {/* Actual refund */}
            <div className="flex gap-4 items-center justify-end">
              <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 500 }}>{t("cf_actual_refund")}</p>
              <p className={`${font} text-[16px] text-[#319754]`} style={{ fontWeight: 500 }}>฿ {totalRefund.toFixed(2)}</p>
            </div>

            {/* Confirm */}
            <div className="flex justify-end">
              <button onClick={handleSubmit}
                className={`w-full py-3.5 rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43] transition-colors`} style={{ fontWeight: 500 }}>
                {t("cf_confirm")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Change type popup */}
      {showChangePopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto" onClick={() => setShowChangePopup(false)}>
          <div className="bg-white rounded-[16px] w-full max-w-[720px] p-4 sm:p-6 flex flex-col gap-4 my-auto max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-start justify-between gap-2">
              <p className={`${font} text-[18px] sm:text-[24px] text-black`} style={{ fontWeight: 600 }}>{t("complaint_select_title")}</p>
              <button onClick={() => setShowChangePopup(false)}
                className="bg-[#f4f4f4] rounded-full size-[40px] flex items-center justify-center cursor-pointer hover:bg-[#e5e5e5] shrink-0">
                <X className="size-5 text-[#1C1B1F]" />
              </button>
            </div>

            {/* 2x2 grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(typeLabels).map(([key, info]) => (
                <button key={key} onClick={() => {
                  navigate(`/complaint/form/${orderId}?type=${key}`, { replace: true });
                  setShowChangePopup(false);
                }}
                  className={`bg-white rounded-[16px] border cursor-pointer transition-all text-left p-3 sm:p-4 ${
                    key === type ? "border-[#319754] bg-[#f0fdf4]" : "border-[#d9d9d9] hover:border-[#319754]"
                  }`}>
                  <div className="flex gap-3 items-center w-full">
                    <img src={info.icon} alt={info.title} className="size-[56px] sm:size-[80px] shrink-0 object-contain" />
                    <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
                      <p className={`${font} text-[14px] sm:text-[16px] text-black`} style={{ fontWeight: 600 }}>{info.title}</p>
                      <p className={`${font} text-[12px] sm:text-[14px] text-[rgba(0,0,0,0.8)]`}>{info.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}