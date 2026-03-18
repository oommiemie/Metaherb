import { Check, Clock, CreditCard, Eye, Package, Truck, Home, Star } from "lucide-react";
import type { OrderStatus } from "../store/OrderContext";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const steps: { status: OrderStatus; label: string; icon: any }[] = [
  { status: "pending_payment", label: "รอชำระเงิน", icon: CreditCard },
  { status: "pending_verify", label: "รอตรวจสอบ", icon: Eye },
  { status: "preparing", label: "กำลังจัดเตรียม", icon: Package },
  { status: "shipped", label: "จัดส่งแล้ว", icon: Truck },
  { status: "delivered", label: "ได้รับสินค้า", icon: Home },
  { status: "completed", label: "เสร็จสิ้น", icon: Star },
];

const statusOrder: OrderStatus[] = ["pending_payment", "pending_verify", "preparing", "shipped", "delivered", "completed"];

export function OrderTimeline({ currentStatus, trackingNumber }: { currentStatus: OrderStatus; trackingNumber?: string }) {
  if (currentStatus === "cancelled") {
    return (
      <div className={`${font} text-center py-4`}>
        <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mx-auto">
          <span className="text-[20px]">✕</span>
        </div>
        <p className="text-[14px] text-red-500 mt-2" style={{ fontWeight: 500 }}>คำสั่งซื้อถูกยกเลิก</p>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <div className="py-4">
      <div className="flex items-center justify-between relative px-2">
        {/* Connection line */}
        <div className="absolute top-5 left-8 right-8 h-[2px] bg-gray-200" />
        <div
          className="absolute top-5 left-8 h-[2px] bg-[#319754] transition-all"
          style={{ width: `${Math.max(0, (currentIndex / (steps.length - 1)) * (100 - 13))}%` }}
        />

        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;
          const Icon = step.icon;
          return (
            <div key={step.status} className="flex flex-col items-center relative z-10 w-16">
              <div
                className={`size-10 rounded-full flex items-center justify-center transition-colors ${
                  isCompleted
                    ? "bg-[#319754] text-white"
                    : isCurrent
                    ? "bg-[#319754] text-white ring-4 ring-[#319754]/20"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {isCompleted ? <Check className="size-5" /> : <Icon className="size-5" />}
              </div>
              <span
                className={`${font} text-[10px] mt-1.5 text-center ${
                  isCompleted || isCurrent ? "text-[#319754]" : "text-gray-400"
                }`}
                style={{ fontWeight: isCurrent ? 600 : 400 }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {trackingNumber && (currentStatus === "shipped" || currentStatus === "delivered") && (
        <div className={`mt-4 bg-blue-50 rounded-lg p-3 flex items-center gap-3 ${font}`}>
          <Truck className="size-5 text-blue-500 shrink-0" />
          <div>
            <p className="text-[12px] text-blue-700" style={{ fontWeight: 500 }}>หมายเลขพัสดุ: {trackingNumber}</p>
            <p className="text-[11px] text-blue-500">คลิกเพื่อติดตามพัสดุ</p>
          </div>
        </div>
      )}
    </div>
  );
}
