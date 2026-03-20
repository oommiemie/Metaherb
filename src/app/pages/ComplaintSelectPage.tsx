import { useNavigate, useParams } from "react-router";
import svgPaths from "../../imports/svg-msiytpo2yd";
import { useOrders } from "../store/OrderContext";
import { ChevronLeft } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const problemTypes = [
  {
    id: "damaged",
    title: "สินค้าเสียหาย",
    desc: "สินค้าที่มีรอยแตก บุบ หรือชำรุดจากการขนส่ง",
    badgeColor: "#FF383C",
    badgeType: "x" as const,
  },
  {
    id: "wrong_item",
    title: "สินค้าไม่ตรงตามที่สั่ง",
    desc: "ได้รับสินค้าผิดรายการจากที่สั่ง",
    badgeColor: "#DF9723",
    badgeType: "question" as const,
  },
  {
    id: "return",
    title: "ต้องการคืนสินค้า",
    desc: "ส่งคืนสินค้าและรับเป็นเครดิตหรือสินค้าใหม่",
    badgeColor: "#9747FF",
    badgeType: "return" as const,
  },
  {
    id: "refund",
    title: "ต้องการขอเงินคืน",
    desc: "ต้องการขอคืนเงินจากการสั่งซื้อ",
    badgeColor: "#0088FF",
    badgeType: "money" as const,
  },
];

function BoxIcon({ badgeColor, badgeType }: { badgeColor: string; badgeType: string }) {
  return (
    <div className="relative shrink-0 size-[80px]">
      {/* Box body */}
      <svg className="absolute inset-[15%_7.81%_2.5%_7.5%] size-[66px]" fill="none" viewBox="0 0 67.7556 66.0001">
        <path d={svgPaths.pe9d5060} fill="#FDA52C" />
        <path d={svgPaths.p1a2ca600} fill="#FFDFB2" />
        <path d={svgPaths.p2e64d800} fill="#FDC981" />
        <path d="M31 58V50L19 47V55L31 58Z" fill="#FEE9D6" />
        <path d={svgPaths.p254a6200} fill="#FFF4EA" />
        <path d={svgPaths.p2f817300} fill="#F0D8C2" />
      </svg>
      {/* Badge */}
      <div className="absolute top-[5%] left-[5%] size-[30px]">
        <svg viewBox="0 0 28 28" fill="none" className="size-full">
          <circle cx="14" cy="14" r="13" fill={badgeColor} stroke="white" strokeWidth="2" />
          {badgeType === "x" && (
            <>
              <path d={svgPaths.p32060600} fill="white" />
              <path d={svgPaths.p17e73100} fill="white" />
            </>
          )}
          {badgeType === "question" && (
            <circle cx="14" cy="14" r="5" fill={badgeColor} stroke="white" strokeWidth="1.5" />
          )}
          {badgeType === "return" && (
            <path d={svgPaths.p11c7f000} fill="white" transform="translate(5,5) scale(0.65)" />
          )}
          {badgeType === "money" && (
            <>
              <path d={svgPaths.p55d6280} fill="white" transform="translate(0,0)" />
              <path d={svgPaths.pca91200} fill="white" transform="translate(0,0)" />
            </>
          )}
        </svg>
      </div>
    </div>
  );
}

export function ComplaintSelectPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders } = useOrders();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className={`${font} text-gray-500`}>ไม่พบคำสั่งซื้อ</p>
        <button onClick={() => navigate("/orders")} className={`mt-4 text-[#319754] ${font} cursor-pointer hover:underline`}>กลับไปหน้าคำสั่งซื้อ</button>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-6">
      {/* Back button */}
      <button onClick={() => navigate("/orders")}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d4d4d4] text-[12px] ${font} cursor-pointer hover:bg-[#c4c4c4] mb-6`}>
        <ChevronLeft className="size-3" /> กลับ
      </button>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 max-w-[720px] mx-auto">
        <div className="flex items-start justify-between mb-6">
          <h1 className={`${font} text-[24px] text-black`} style={{ fontWeight: 600 }}>โปรดระบุปัญหาที่คุณพบ</h1>
          <button onClick={() => navigate("/orders")}
            className="size-10 rounded-full bg-[#f4f4f4] flex items-center justify-center cursor-pointer hover:bg-[#e8e8e8]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d={svgPaths.p1a580680} fill="#1C1B1F" />
            </svg>
          </button>
        </div>

        {/* Order info */}
        <div className={`mb-6 p-3 rounded-lg bg-[#f9fafb] border border-[#e5e7eb]`}>
          <p className={`${font} text-[12px] text-[#999]`}>คำสั่งซื้อ: {order.id}</p>
          <p className={`${font} text-[14px] text-black mt-1`} style={{ fontWeight: 500 }}>{order.shopName}</p>
        </div>

        {/* Problem types grid */}
        <div className="grid grid-cols-2 gap-4">
          {problemTypes.map((type) => (
            <button key={type.id}
              onClick={() => navigate(`/complaint/form/${orderId}?type=${type.id}`)}
              className="bg-white rounded-2xl border border-[#d9d9d9] p-4 cursor-pointer hover:border-[#319754] hover:shadow-md transition-all text-left group">
              <div className="flex gap-3 items-center">
                <BoxIcon badgeColor={type.badgeColor} badgeType={type.badgeType} />
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
}
