import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrders, type OrderStatus } from "../store/OrderContext";
import { useChat } from "../store/ChatContext";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, Star, Eye, MessageCircle, RotateCcw, Copy, ChevronDown, ChevronUp, ClipboardList, Hourglass, Search, Ban, ArrowRightCircle } from "lucide-react";
import { OrderTimeline } from "../components/OrderTimeline";
import { toast } from "sonner";
import svgPaths from "../../imports/svg-msiytpo2yd";
import imgDamaged from "figma:asset/4f59e2204352b9ea47e8c08661dec6d473c60c53.png";
import imgWrongItem from "figma:asset/4517e4a0ab01b002c578ac42c372cf5b3a5ab1af.png";
import imgReturn from "figma:asset/a93992c00d6ca24ac5ac6db4f9ba36829787f574.png";
import imgRefund from "figma:asset/2c8e0b82e046f224d900948034e932ec386e66ff.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const problemTypes = [
  { id: "damaged", title: "สินค้าเสียหาย", desc: "สินค้าที่มีรอยแตก บุบ หรือชำรุดจากการขนส่ง", badgeColor: "#FF383C", icon: imgDamaged },
  { id: "wrong_item", title: "สินค้าไม่ตรงตามที่สั่ง", desc: "ได้รับสินค้าผิดรายการจากที่สั่ง", badgeColor: "#DF9723", icon: imgWrongItem },
  { id: "return", title: "ต้องการคืนสินค้า", desc: "ส่งคืนสินค้าและรับเป็นเครดิตหรือสินค้าใหม่", badgeColor: "#9747FF", icon: imgReturn },
  { id: "refund", title: "ต้องการขอเงินคืน", desc: "ต้องการขอคืนเงินจากการสั่งซื้อ", badgeColor: "#0088FF", icon: imgRefund },
];

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

const tabs: { label: string; status: OrderStatus | "all" | "pending_group"; icon: any }[] = [
  { label: "ทั้งหมด", status: "all", icon: Package },
  { label: "รอชำระเงิน", status: "pending_group", icon: Clock },
  { label: "กำลังจัดเตรียม", status: "preparing", icon: Package },
  { label: "จัดส่งแล้ว", status: "shipped", icon: Truck },
  { label: "ได้รับสินค้าแล้ว", status: "delivered", icon: ClipboardList },
  { label: "สำเร็จ", status: "completed", icon: CheckCircle },
  { label: "ยกเลิก", status: "cancelled", icon: XCircle },
];

const statusBadgeColors: Record<OrderStatus, string> = {
  pending_payment: "bg-[#ff8d28] text-white",
  pending_verify: "bg-[#f7931d] text-white",
  preparing: "bg-[#3b82f6] text-white",
  shipped: "bg-[#8b5cf6] text-white",
  delivered: "bg-[#14b8a6] text-white",
  completed: "bg-[#319754] text-white",
  cancelled: "bg-[#9ca3af] text-white",
};

const statusLabels: Record<OrderStatus, string> = {
  pending_payment: "รอชำระเงิน",
  pending_verify: "รอตรวจสอบ",
  preparing: "กำลังจัดเตรียม",
  shipped: "จัดส่งแล้ว",
  delivered: "รับสินค้าแล้ว",
  completed: "สำเร็จ",
  cancelled: "ยกเลิก",
};

export function OrdersPage() {
  const navigate = useNavigate();
  const { orders, updateOrderStatus, addReview } = useOrders();
  const { openChat } = useChat();
  const [activeTab, setActiveTab] = useState<OrderStatus | "all" | "pending_group">("all");
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
    toast.success("ขอบคุณสำหรับรีวิว! 🎉");
  };

  const handleRefund = (orderId: string) => {
    toast.success("ส่งคำขอคืนเงินเรียบร้อย", { description: "ทีมงานจะตรวจสอบภายใน 1-3 วันทำการ" });
    setRefundModal(null);
    setRefundReason("");
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    toast.success("คัดลอกหมายเลขคำสั่งซื้อแล้ว");
  };

  return (
    <div>
      {/* Header with shipping box pattern */}
      <div className="bg-[rgba(214,234,221,0.5)] relative overflow-hidden">
        <div className="relative py-6 text-center">
          <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>คำสั่งซื้อของฉัน</h1>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {/* Tabs - pill style */}
        <div className="flex justify-center -mt-10 mb-4 sm:mb-6 relative z-10">
          <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] p-2 flex gap-2 sm:gap-4 overflow-x-auto max-w-full">
            {tabs.map((tab) => {
              const count = tab.status === "all" ? orders.length : tab.status === "pending_group"
                ? orders.filter((o) => o.status === "pending_payment" || o.status === "pending_verify").length
                : orders.filter((o) => o.status === tab.status).length;
              const isActive = activeTab === tab.status;
              return (
                <button key={tab.status} onClick={() => setActiveTab(tab.status)}
                  className={`flex items-center gap-2 pl-3 pr-2 py-1 rounded-full text-[14px] ${font} cursor-pointer whitespace-nowrap transition-all active:scale-95 duration-150 ${
                    isActive ? "bg-[#319754] text-white backdrop-blur-sm" : "text-black hover:bg-gray-50"
                  }`}>
                  <tab.icon className="size-[18px]" />
                  {tab.label}
                  {count > 0 && (
                    <span className={`text-[8px] px-2 py-0.5 rounded-full shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] ${
                      isActive ? "bg-white text-[#ff383c]" : "bg-[#ff383c] text-white"
                    }`}>{count}</span>
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
            <p className={`${font} text-[14px] text-gray-400 mt-4`}>ไม่มีคำสั่งซื้อ</p>
            <button onClick={() => navigate("/products")} className={`mt-3 text-[13px] text-[#319754] ${font} cursor-pointer hover:underline`}>ไปช้อปปิ้ง</button>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((order) => {
              const isExpanded = expandedOrder === order.id;
              return (
                <div key={order.id} className="bg-white rounded-2xl overflow-hidden p-4 shadow-sm">
                  {/* Top: Shop name + View detail */}
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{order.shopName}</span>
                    <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className={`flex items-center gap-1.5 text-[12px] text-black ${font} cursor-pointer hover:opacity-70`}>
                      ดูรายละเอียด
                      <ArrowRightCircle className="size-[20px]" />
                    </button>
                  </div>

                  {/* Order ID + Status + Date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`${font} text-[14px] text-black`}>{order.id}</span>
                      <span className={`${font} text-[12px] px-4 py-0.5 rounded-full ${statusBadgeColors[order.status]}`} style={{ fontWeight: 500 }}>{statusLabels[order.status]}</span>
                    </div>
                    <span className={`${font} text-[12px] text-[#8e8e93]`}>{order.date}</span>
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
                            <span className={`${font} text-[10px] text-[#999]`}>จำนวน {item.quantity} ชิ้น</span>
                            <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 600 }}>฿{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && !isExpanded && (
                      <button onClick={() => setExpandedOrder(order.id)}
                        className={`flex items-center gap-1 text-[12px] text-gray-400 ${font} cursor-pointer hover:text-gray-600 w-full justify-center py-1`}>
                        <ChevronDown className="size-3" /> ดูทั้งหมด ({order.items.length} รายการ)
                      </button>
                    )}
                  </div>

                  {/* Timeline (expanded only) */}
                  {isExpanded && (
                    <div className="pb-3 border-t border-gray-100 pt-3 mb-3">
                      <p className={`${font} text-[13px] text-gray-600 mb-2`} style={{ fontWeight: 500 }}>สถานะคำสั่งซื้อ</p>
                      <OrderTimeline currentStatus={order.status} trackingNumber={order.trackingNumber} />
                      {order.trackingNumber && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`${font} text-[12px] text-gray-500`}>หมายเลขพัสดุ: {order.trackingNumber}</span>
                          <button onClick={() => { navigator.clipboard.writeText(order.trackingNumber!); toast.success("คัดลอกหมายเลขพัสดุแล้ว"); }}
                            className="cursor-pointer"><Copy className="size-3 text-gray-400" /></button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Divider */}
                  <div className="w-full h-px bg-[#D4D4D8] mb-3" />

                  {/* Footer: Total + Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className={`${font} text-[14px] text-[#8e8e93]`} style={{ fontWeight: 500 }}>รวมการสั่งซื้อ:</span>
                      <span className={`${font} text-[20px] text-[#ff383c]`} style={{ fontWeight: 500 }}>฿{order.total.toFixed(2)}</span>
                    </div>
                    <div className="flex gap-2.5">
                      {order.status === "pending_payment" && (
                        <>
                          <button onClick={() => { updateOrderStatus(order.id, "cancelled"); toast("ยกเลิกคำสั่งซื้อแล้ว"); }}
                            className={`w-[120px] h-[40px] rounded-full border border-[#ff3b30] text-[#ff383c] text-[14px] ${font} cursor-pointer hover:bg-red-50`}>ยกเลิก</button>
                          <button onClick={() => navigate(`/verify-payment/${order.id}`)}
                            className={`w-[120px] h-[40px] rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ชำระเงิน</button>
                        </>
                      )}
                      {order.status === "pending_verify" && (
                        <button className={`w-[120px] h-[40px] rounded-full border border-[#319754] text-[#319754] text-[14px] ${font} cursor-pointer hover:bg-green-50`}>แก้ไขข้อมูล</button>
                      )}
                      {order.status === "preparing" && (
                        <button onClick={() => openChat("metaherb")}
                          className={`w-[120px] h-[40px] rounded-full border border-[#319754] text-[#319754] text-[14px] ${font} cursor-pointer hover:bg-green-50 flex items-center justify-center gap-1`}>
                          <MessageCircle className="size-4" /> ติดต่อร้าน
                        </button>
                      )}
                      {order.status === "shipped" && (
                        <button onClick={() => { updateOrderStatus(order.id, "delivered"); toast.success("ยืนยันรับสินค้าแล้ว! 📦"); }}
                          className={`h-[40px] px-6 rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ยืนยันรับสินค้า</button>
                      )}
                      {order.status === "delivered" && !order.review && (
                        <>
                          <button onClick={() => setComplaintModal(order.id)}
                            className={`px-[14px] h-[40px] rounded-full border border-[#d4d4d8] text-black text-[14px] ${font} cursor-pointer hover:bg-gray-50 flex items-center justify-center`}>
                            แจ้งปัญหาสินค้า
                          </button>
                          <button onClick={() => setReviewModal(order.id)}
                            className={`w-[120px] h-[40px] rounded-full bg-[#f7931d] text-white text-[14px] ${font} cursor-pointer hover:bg-[#e0850f] flex items-center justify-center gap-1`}>
                            <Star className="size-4" /> รีวิวสินค้า
                          </button>
                        </>
                      )}
                      {order.status === "completed" && order.review && (
                        <button onClick={() => navigate("/products")}
                          className={`w-[120px] h-[40px] rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ซื้ออีกครั้ง</button>
                      )}
                      {order.status === "cancelled" && (
                        <button onClick={() => navigate("/products")}
                          className={`w-[120px] h-[40px] rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ซื้อใหม่</button>
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
            <h3 className={`${font} text-[18px] text-center mb-4`} style={{ fontWeight: 600 }}>รีวิวสินค้า</h3>

            <p className={`${font} text-[13px] text-gray-500 text-center mb-3`}>แตะดาวเพื่อให้คะแนน</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} onClick={() => setReviewRating(s)}
                  className={`size-10 cursor-pointer transition-transform hover:scale-110 ${s <= reviewRating ? "fill-[#f7931d] text-[#f7931d]" : "text-gray-300"}`} />
              ))}
            </div>
            <p className={`${font} text-[12px] text-center text-[#f7931d] mb-4`}>
              {["", "แย่มาก", "ไม่ดี", "ปกติ", "ดี", "ดีมาก"][reviewRating]}
            </p>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {["สินค้าดี", "ส่งเร็ว", "แพ็คเกจดี", "คุ้มค่า", "ตรงปก"].map((tag) => (
                <button key={tag} onClick={() => setReviewComment((p) => p + (p ? " " : "") + tag)}
                  className={`px-3 py-1 rounded-full border border-gray-200 text-[12px] ${font} cursor-pointer hover:border-[#319754] hover:text-[#319754]`}>
                  {tag}
                </button>
              ))}
            </div>

            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder="เขียนรีวิวของคุณ..."
              className={`w-full h-24 border border-gray-300 rounded-lg p-3 text-[14px] ${font} outline-none resize-none focus:border-[#319754]`} />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setReviewModal(null)} className={`flex-1 py-3 rounded-full border border-gray-300 text-gray-600 text-[14px] ${font} cursor-pointer`}>ยกเลิก</button>
              <button onClick={() => handleReview(reviewModal)} className={`flex-1 py-3 rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer`}>ส่งรีวิว</button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      {refundModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRefundModal(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-[450px]" onClick={(e) => e.stopPropagation()}>
            <h3 className={`${font} text-[18px] text-center mb-2`} style={{ fontWeight: 600 }}>ขอคืนเงิน/คืนสินค้า</h3>
            <p className={`${font} text-[12px] text-gray-500 text-center mb-4`}>เลือกเหตุผลในการขอคืนเงิน</p>

            <div className="space-y-2 mb-4">
              {["สินค้าไม่ตรงตามคำอธิบาย", "สินค้าชำรุด/เสียหาย", "ได้รับสินค้าผิดชิ้น", "สินค้าไม่ครบตามจำนวน", "เปลี่ยนใจ", "อื่นๆ"].map((reason) => (
                <label key={reason} className="flex items-center gap-3 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50">
                  <input type="radio" name="refundReason" value={reason} checked={refundReason === reason}
                    onChange={() => setRefundReason(reason)} className="accent-[#319754] size-4" />
                  <span className={`${font} text-[14px]`}>{reason}</span>
                </label>
              ))}
            </div>

            <textarea placeholder="รายละเอียดเพิ่มเติม (ไม่บังคับ)"
              className={`w-full h-20 border border-gray-300 rounded-lg p-3 text-[13px] ${font} outline-none resize-none`} />

            <div className="flex gap-2 mt-4">
              <button onClick={() => setRefundModal(null)} className={`flex-1 py-3 rounded-full border border-gray-300 text-gray-600 text-[14px] ${font} cursor-pointer`}>ยกเลิก</button>
              <button onClick={() => handleRefund(refundModal)} disabled={!refundReason}
                className={`flex-1 py-3 rounded-full text-[14px] ${font} cursor-pointer ${refundReason ? "bg-[#ee4d2d] text-white" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>ส่งคำขอ</button>
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
                <h3 className={`${font} text-[24px] text-black`} style={{ fontWeight: 600 }}>โปรดระบุปัญหาที่คุณพบ</h3>
                <button onClick={() => setComplaintModal(null)}
                  className="size-10 rounded-full bg-[#f4f4f4] flex items-center justify-center cursor-pointer hover:bg-[#e8e8e8]">
                  <XCircle className="size-5 text-gray-500" />
                </button>
              </div>

              {complaintOrder && (
                <div className={`mb-6 p-3 rounded-lg bg-[#f9fafb] border border-[#e5e7eb]`}>
                  <p className={`${font} text-[12px] text-[#999]`}>คำสั่งซื้อ: {complaintOrder.id}</p>
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