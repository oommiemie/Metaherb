import { useState } from "react";
import { useNavigate } from "react-router";
import { useOrders, type OrderStatus } from "../store/OrderContext";
import { useChat } from "../store/ChatContext";
import { Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, Star, Eye, MessageCircle, RotateCcw, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { OrderTimeline } from "../components/OrderTimeline";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const tabs: { label: string; status: OrderStatus | "all"; icon: any }[] = [
  { label: "ทั้งหมด", status: "all", icon: Package },
  { label: "รอชำระเงิน", status: "pending_payment", icon: Clock },
  { label: "รอตรวจสอบ", status: "pending_verify", icon: Eye },
  { label: "กำลังจัดเตรียม", status: "preparing", icon: Package },
  { label: "จัดส่งแล้ว", status: "shipped", icon: Truck },
  { label: "สำเร็จ", status: "completed", icon: CheckCircle },
  { label: "ยกเลิก", status: "cancelled", icon: XCircle },
];

const statusColors: Record<OrderStatus, string> = {
  pending_payment: "bg-[#ee4d2d] text-white",
  pending_verify: "bg-[#f7931d] text-white",
  preparing: "bg-blue-500 text-white",
  shipped: "bg-purple-500 text-white",
  delivered: "bg-teal-500 text-white",
  completed: "bg-[#319754] text-white",
  cancelled: "bg-gray-400 text-white",
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
  const [activeTab, setActiveTab] = useState<OrderStatus | "all">("all");
  const [reviewModal, setReviewModal] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [refundModal, setRefundModal] = useState<string | null>(null);
  const [refundReason, setRefundReason] = useState("");

  const filtered = activeTab === "all" ? orders : orders.filter((o) => o.status === activeTab);

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
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>คำสั่งซื้อของฉัน</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {/* Tabs */}
        <div className="flex gap-1 overflow-x-auto pb-2 mb-4 sm:mb-6 border-b border-gray-200">
          {tabs.map((tab) => {
            const count = tab.status === "all" ? orders.length : orders.filter((o) => o.status === tab.status).length;
            return (
              <button key={tab.status} onClick={() => setActiveTab(tab.status)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] ${font} cursor-pointer whitespace-nowrap transition-colors relative ${
                  activeTab === tab.status ? "text-[#319754]" : "text-gray-500 hover:text-gray-700"
                }`}>
                <tab.icon className="size-4" />
                {tab.label}
                {count > 0 && <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.status ? "bg-[#319754] text-white" : "bg-gray-200"}`}>{count}</span>}
                {activeTab === tab.status && <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#319754]" />}
              </button>
            );
          })}
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
                <div key={order.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{order.shopName}</span>
                      <button onClick={() => openChat("metaherb")}
                        className="flex items-center gap-1 text-[11px] text-[#319754] border border-[#319754] px-2 py-0.5 rounded cursor-pointer hover:bg-[#319754]/5">
                        <MessageCircle className="size-3" /> แชท
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2 py-0.5 rounded ${statusColors[order.status]}`}>{statusLabels[order.status]}</span>
                    </div>
                  </div>

                  {/* Order ID & Date */}
                  <div className="flex items-center gap-2 px-4 sm:px-6 py-2 text-gray-400 border-b border-gray-50">
                    <span className={`${font} text-[12px]`}>{order.id}</span>
                    <button onClick={() => copyOrderId(order.id)} className="cursor-pointer hover:text-gray-600"><Copy className="size-3" /></button>
                    <span className={`${font} text-[12px] ml-auto`}>{order.date}</span>
                  </div>

                  {/* Items */}
                  <div className="px-4 sm:px-6 py-3 space-y-3">
                    {order.items.slice(0, isExpanded ? undefined : 2).map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="size-[60px] bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <div className="w-full h-full bg-gray-200" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${font} text-[13px] truncate`}>{item.name}</p>
                          <p className={`${font} text-[11px] text-gray-400`}>{item.option}</p>
                          <p className={`${font} text-[11px] text-gray-400`}>x{item.quantity}</p>
                        </div>
                        <span className={`${font} text-[14px] text-[#ee4d2d] shrink-0`}>฿{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className={`flex items-center gap-1 text-[12px] text-gray-400 ${font} cursor-pointer hover:text-gray-600 w-full justify-center py-1`}>
                        {isExpanded ? <><ChevronUp className="size-3" /> ย่อ</> : <><ChevronDown className="size-3" /> ดูทั้งหมด ({order.items.length} รายการ)</>}
                      </button>
                    )}
                  </div>

                  {/* Timeline (expanded only) */}
                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-3 border-t border-gray-100 pt-3">
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

                  {/* Footer */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 border-t border-gray-100 gap-2">
                    <div className="flex items-center gap-2">
                      <p className={`${font} text-[14px]`}>รวม: <span className="text-[#ee4d2d] text-[18px]" style={{ fontWeight: 600 }}>฿{order.total.toFixed(2)}</span></p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      {/* View detail toggle */}
                      <button onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                        className={`px-3 py-1.5 rounded-full border border-gray-300 text-gray-500 text-[12px] ${font} cursor-pointer hover:bg-gray-50 flex items-center gap-1`}>
                        {isExpanded ? "ซ่อน" : "ดูรายละเอียด"}
                      </button>

                      {order.status === "pending_payment" && (
                        <>
                          <button onClick={() => { updateOrderStatus(order.id, "cancelled"); toast("ยกเลิกคำสั่งซื้อแล้ว"); }}
                            className={`px-4 py-1.5 rounded-full border border-gray-300 text-gray-500 text-[13px] ${font} cursor-pointer hover:bg-gray-50`}>ยกเลิก</button>
                          <button onClick={() => navigate(`/verify-payment/${order.id}`)}
                            className={`px-4 py-1.5 rounded-full bg-[#319754] text-white text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>ชำระเงิน</button>
                        </>
                      )}
                      {order.status === "pending_verify" && (
                        <button className={`px-4 py-1.5 rounded-full border border-[#319754] text-[#319754] text-[13px] ${font} cursor-pointer`}>แก้ไขข้อมูล</button>
                      )}
                      {order.status === "shipped" && (
                        <button onClick={() => { updateOrderStatus(order.id, "delivered"); toast.success("ยืนยันรับสินค้าแล้ว! 📦"); }}
                          className={`px-4 py-1.5 rounded-full bg-[#319754] text-white text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>ยืนยันรับสินค้า</button>
                      )}
                      {order.status === "delivered" && !order.review && (
                        <>
                          <button onClick={() => setRefundModal(order.id)}
                            className={`px-3 py-1.5 rounded-full border border-orange-300 text-orange-500 text-[12px] ${font} cursor-pointer hover:bg-orange-50 flex items-center gap-1`}>
                            <RotateCcw className="size-3" /> ขอคืนเงิน
                          </button>
                          <button onClick={() => setReviewModal(order.id)}
                            className={`px-4 py-1.5 rounded-full bg-[#f7931d] text-white text-[13px] ${font} cursor-pointer hover:bg-[#e0850f] flex items-center gap-1`}>
                            <Star className="size-3" /> รีวิวสินค้า
                          </button>
                        </>
                      )}
                      {order.status === "completed" && order.review && (
                        <button onClick={() => navigate("/products")}
                          className={`px-4 py-1.5 rounded-full bg-[#319754] text-white text-[13px] ${font} cursor-pointer hover:bg-[#267a43]`}>ซื้ออีกครั้ง</button>
                      )}
                      {(order.status === "delivered" || order.status === "completed") && (
                        <button onClick={() => openChat("metaherb")}
                          className={`px-3 py-1.5 rounded-full border border-[#319754] text-[#319754] text-[12px] ${font} cursor-pointer hover:bg-[#319754]/5 flex items-center gap-1`}>
                          <MessageCircle className="size-3" /> ติดต่อร้าน
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
    </div>
  );
}