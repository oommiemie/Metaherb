import { useParams, useNavigate } from "react-router";
import { useOrders } from "../store/OrderContext";
import { QrCode, Upload, AlertTriangle, ChevronRight } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function VerifyPaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, updateOrderStatus } = useOrders();
  const order = orders.find((o) => o.id === id);

  if (!order) return <div className="p-8 text-center">ไม่พบคำสั่งซื้อ</div>;

  const handleUpload = () => {
    updateOrderStatus(order.id, "pending_verify");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6 flex flex-col lg:flex-row gap-6">
      {/* Left - Payment Info */}
      <div className="flex-1">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className={`${font} text-[20px] text-[#319754]`} style={{ fontWeight: 600 }}>รอชำระเงิน</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-1`}>กรุณาชำระเงินภายใน 24 ชม. เพื่อไม่ให้คำสั่งซื้อของคุณถูกยกเลิก</p>

          <div className="bg-[#319754] text-white rounded-lg p-4 mt-4 flex justify-between items-center">
            <span className={`${font} text-[14px]`}>ยอดที่ต้องชำระ</span>
            <span className={`${font} text-[22px]`} style={{ fontWeight: 700 }}>฿{order.total.toFixed(2)}</span>
          </div>

          {/* QR Code placeholder */}
          <div className="flex flex-col items-center mt-6">
            <div className="size-[200px] bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
              <QrCode className="size-24 text-gray-300" />
            </div>
            <p className={`${font} text-[14px] text-gray-600 mt-3`} style={{ fontWeight: 500 }}>ชำระด้วยพร้อมเพย์ PromptPay</p>
            <p className={`${font} text-[13px] text-gray-400`}>เหลือเวลาชำระเงิน 24:00:00 ชั่วโมง</p>
          </div>

          <div className={`mt-4 space-y-2 ${font} text-[13px]`}>
            <div className="flex justify-between"><span className="text-gray-500">ชื่อผู้รับเงิน:</span><span style={{ fontWeight: 500 }}>ทดสอบ ระบบ</span></div>
            <div className="flex justify-between"><span className="text-gray-500">หมายเลขพร้อมเพย์:</span><span style={{ fontWeight: 500 }}>080-000-0000</span></div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4 flex gap-2">
            <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5" />
            <p className={`${font} text-[12px] text-red-600`}>สำคัญ: กรุณาอย่าชำระ QR Code นี้กับผู้อื่น และตรวจสอบจำนวนเงินให้ถูกต้องก่อนชำระเงิน</p>
          </div>

          <div className="mt-6 space-y-3">
            <button onClick={() => navigate(`/orders`)} className={`w-full py-3 rounded-full bg-[#319754] text-white text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ดูรายละเอียดคำสั่งซื้อ</button>
            <button onClick={() => navigate("/orders")} className={`w-full py-3 rounded-full border border-gray-300 text-gray-600 text-[14px] ${font} cursor-pointer hover:bg-gray-50`}>คำสั่งซื้อทั้งหมด</button>
            <button onClick={() => navigate("/products")} className={`w-full py-3 rounded-full border border-gray-300 text-gray-600 text-[14px] ${font} cursor-pointer hover:bg-gray-50`}>ช้อปปิ้งต่อ</button>
          </div>
        </div>
      </div>

      {/* Right - Order + Upload */}
      <div className="lg:w-[400px] space-y-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>{order.id}</h3>
          <p className={`${font} text-[12px] text-gray-400 mt-1`}>{order.date}</p>
          <div className={`mt-3 bg-gray-50 rounded-lg p-3 ${font} text-[13px] text-gray-600 space-y-1`}>
            <p>username01</p>
            <p>090-000-000</p>
            <p>เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140</p>
          </div>
          <div className={`mt-3 space-y-2 ${font} text-[13px]`}>
            <div className="flex justify-between"><span className="text-gray-500">วิธีชำระเงิน:</span><span>{order.paymentMethod}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">จำนวนเงิน:</span><span>฿{order.total.toFixed(2)}</span></div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">สถานะการชำระเงิน:</span>
              <span className="bg-[#ee4d2d] text-white text-[11px] px-2 py-0.5 rounded">รอชำระเงิน</span>
            </div>
          </div>
        </div>

        {/* Upload proof */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className={`${font} text-[18px] text-[#319754]`} style={{ fontWeight: 600 }}>อัพโหลดหลักฐานการชำระเงิน</h3>
          <p className={`${font} text-[12px] text-gray-500 mt-1 bg-[#319754]/10 rounded-lg p-3`}>กรุณาอัพโหลดสลิปหรือหลักฐานการโอนเงินเพื่อให้เราตรวจสอบและดำเนินการจัดส่งสินค้า</p>
          <div onClick={handleUpload} className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#319754]">
            <Upload className="size-12 text-gray-300" />
            <p className={`${font} text-[14px] text-[#319754] mt-2`}>เลือกไฟล์รูปภาพ (JPG, PNG)</p>
          </div>
        </div>
      </div>
    </div>
  );
}