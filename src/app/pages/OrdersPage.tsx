import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrders, type OrderStatus } from "../store/OrderContext";
import { useChat } from "../store/ChatContext";
import { useLanguage } from "../store/LanguageContext";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, Star, Eye, MessageCircle, RotateCcw, Copy, ChevronDown, ChevronUp, ClipboardList, Hourglass, Search, Ban, ArrowRightCircle } from "lucide-react";
import { OrderTimeline } from "../components/OrderTimeline";
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

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addReview } = useOrders();
  const { openChat } = useChat();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<OrderStatus | "all" | "pending_group">("all");

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

  return (
    <div>
      {/* Header with shipping box pattern — extends up behind the appbar */}
      <div className="bg-[#eaf3ee] relative overflow-hidden -mt-[64px] md:-mt-[116px] pt-[64px] md:pt-[116px]">
        <div className="relative py-6 text-center">
          <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>{t("orders_title")}</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {/* Tabs — frosted glass pill with gradient active state */}
        <div className="flex justify-center -mt-10 mb-5 sm:mb-7 relative z-10">
          <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full ring-1 ring-white/60"
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
                <div key={order.id} className="bg-white rounded-[20px] overflow-hidden p-5 shadow-[0_4px_12px_-4px_rgba(16,24,40,0.08)] border border-gray-100 hover:shadow-[0_12px_28px_-8px_rgba(16,24,40,0.12)] transition-shadow duration-300">
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
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setComplaintModal(null)}>
            <div className="bg-white rounded-2xl p-6 w-full max-w-[720px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <h3 className={`${font} text-[24px] text-black`} style={{ fontWeight: 600 }}>{t("complaint_select_title")}</h3>
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

              <div className="grid grid-cols-2 gap-4">
                {problemTypes.map((type) => (
                  <button key={type.id}
                    onClick={() => { setComplaintModal(null); navigate(`/complaint/form/${complaintModal}?type=${type.id}`); }}
                    className="bg-white rounded-2xl border border-[#d9d9d9] p-4 cursor-pointer hover:border-[#319754] hover:shadow-md transition-all text-left group">
                    <div className="flex gap-3 items-center">
                      <img src={type.icon} alt={type.title} className="size-[60px] shrink-0 object-contain" />
                      <div className="flex-1 min-w-0">
                        <p className={`${font} text-[16px] text-black`} style={{ fontWeight: 600 }}>{type.title}</p>
                        <p className={`${font} text-[14px] text-[rgba(0,0,0,0.8)] mt-0.5`}>{type.desc}</p>
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