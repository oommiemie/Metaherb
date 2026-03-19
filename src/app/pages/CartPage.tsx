import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../store/CartContext";
import { Trash2, Minus, Plus, ChevronLeft, Store, Tag, MessageCircle, ShieldCheck } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useChat } from "../store/ChatContext";
import { toast } from "sonner";
import { products } from "../data/products";
import imgShop from "figma:asset/f9c837257a7dc5d10d1ea92a733813c293a76a81.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const shopLogos: Record<string, string> = {
  "METAHERB Store": imgShop,
  "สมุนไพรบ้านสวน": "https://images.unsplash.com/photo-1762644085409-305634b2123e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiJTIwZ2FyZGVuJTIwY290dGFnZSUyMHNob3B8ZW58MXx8fHwxNzczODg1NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "ร้านป่าหมอก": "https://images.unsplash.com/photo-1713724782271-6670d50322ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXN0eSUyMGZvcmVzdCUyMG1vdW50YWluJTIwc2hvcHxlbnwxfHx8fDE3NzM4ODU0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "Organic Thai Farm": "https://images.unsplash.com/photo-1593701635836-7fd2cd40a35f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGdyZWVuJTIwZmllbGR8ZW58MXx8fHwxNzczODg1NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "ธรรมชาติพรีเมียม": "https://images.unsplash.com/photo-1770361515842-cc592571bbd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwcHJlbWl1bSUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NzM4ODU0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

export function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, total } = useCart();
  const { openChat } = useChat();
  const [selected, setSelected] = useState<Set<string>>(new Set(items.filter((i) => i.inStock).map((i) => i.productId)));
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const toggleAll = () => {
    if (selected.size === items.filter((i) => i.inStock).length) setSelected(new Set());
    else setSelected(new Set(items.filter((i) => i.inStock).map((i) => i.productId)));
  };

  const selectedTotal = items.filter((i) => selected.has(i.productId)).reduce((s, i) => s + i.price * i.quantity, 0);
  const selectedCount = items.filter((i) => selected.has(i.productId)).length;
  const discount = appliedCoupon ? 100 : 0;

  const handleRemove = (id: string, name: string) => {
    removeItem(id);
    selected.delete(id);
    setSelected(new Set(selected));
    toast("ลบสินค้าออกจากรถเข็นแล้ว", { description: name });
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      toast.success("ใช้โค้ดส่วนลดสำเร็จ!", { description: `ลด ฿100.00` });
    }
  };

  // Group items by shop
  const groupedItems = items.reduce((acc, item) => {
    const shop = item.shopName || products.find(p => p.id === item.productId)?.shopName || "METAHERB Store";
    if (!acc[shop]) acc[shop] = [];
    acc[shop].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <div>
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>รถเข็น</h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="size-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-[40px]">🛒</span>
            </div>
            <p className={`${font} text-[16px] text-gray-400 mt-4`}>รถเข็นว่างเปล่า</p>
            <p className={`${font} text-[13px] text-gray-400 mt-1`}>เพิ่มสินค้าที่คุณชื่นชอบลงในรถเข็น</p>
            <button onClick={() => navigate("/products")} className={`mt-4 bg-[#319754] text-white px-8 py-2.5 rounded-full text-[14px] ${font} cursor-pointer hover:bg-[#267a43]`}>ไปช้อปปิ้งเลย</button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              {/* Select all header */}
              <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-3 border border-gray-200">
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={selected.size === items.filter((i) => i.inStock).length && items.length > 0} onChange={toggleAll} className="accent-[#319754] cursor-pointer size-4" />
                  <span className={`${font} text-[14px]`}>เลือกทั้งหมด ({items.length} รายการ)</span>
                </div>
                <button onClick={() => {
                  const toDelete = items.filter((i) => selected.has(i.productId));
                  toDelete.forEach((i) => removeItem(i.productId));
                  setSelected(new Set());
                  toast("ลบสินค้าที่เลือกแล้ว");
                }} className={`text-[13px] text-red-400 ${font} cursor-pointer hover:text-red-500`}>ลบที่เลือก</button>
              </div>

              {/* Grouped by shop */}
              {Object.entries(groupedItems).map(([shopName, shopItems]) => (
                <div key={shopName} className="bg-white rounded-xl border border-gray-200 mb-3 overflow-hidden">
                  {/* Shop header */}
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <input type="checkbox"
                        checked={shopItems.every((i) => !i.inStock || selected.has(i.productId))}
                        onChange={() => {
                          const next = new Set(selected);
                          const allSelected = shopItems.every((i) => !i.inStock || next.has(i.productId));
                          shopItems.forEach((i) => { if (i.inStock) { allSelected ? next.delete(i.productId) : next.add(i.productId); } });
                          setSelected(next);
                        }}
                        className="accent-[#319754] cursor-pointer size-4" />
                      <img src={shopLogos[shopName] || imgShop} alt={shopName} className="size-5 rounded-full object-cover" />
                      <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{shopName}</span>
                      <span className="bg-[#319754] text-white text-[9px] px-1.5 py-0.5 rounded">ร้านค้าแนะนำ</span>
                    </div>
                    <button onClick={() => openChat("metaherb")}
                      className={`flex items-center gap-1 text-[12px] text-[#319754] ${font} cursor-pointer hover:underline`}>
                      <MessageCircle className="size-3.5" /> แชทกับร้านค้า
                    </button>
                  </div>

                  {/* Items */}
                  <div className="divide-y divide-gray-50">
                    {shopItems.map((item) => (
                      <div key={item.productId} className="px-4 py-3">
                        <div className="flex items-center gap-3 sm:gap-4">
                          <input type="checkbox" checked={selected.has(item.productId)} onChange={() => toggleSelect(item.productId)}
                            disabled={!item.inStock} className="accent-[#319754] cursor-pointer size-4 shrink-0" />
                          <div className="size-[72px] sm:size-[80px] rounded-lg bg-gray-100 overflow-hidden shrink-0 cursor-pointer" onClick={() => navigate(`/product/${item.productId}`)}>
                            <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className={`${font} text-[14px] truncate cursor-pointer hover:text-[#319754]`} onClick={() => navigate(`/product/${item.productId}`)}>{item.name}</p>
                                <p className={`${font} text-[12px] text-gray-400`}>{item.option}</p>
                              </div>
                              <button onClick={() => handleRemove(item.productId, item.name)} className="cursor-pointer shrink-0 p-1 hover:bg-red-50 rounded">
                                <Trash2 className="size-4 text-gray-400 hover:text-red-400" />
                              </button>
                            </div>
                            {!item.inStock && (
                              <span className={`inline-block bg-gray-200 text-gray-600 text-[11px] px-2 py-0.5 rounded mt-1 ${font}`}>สินค้าหมด</span>
                            )}
                            <div className="flex items-center justify-between mt-2">
                              {item.inStock ? (
                                <div className="flex items-center border border-gray-200 rounded">
                                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="size-7 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-r border-gray-200"><Minus className="size-3" /></button>
                                  <span className={`${font} text-[14px] w-8 text-center`}>{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="size-7 flex items-center justify-center cursor-pointer hover:bg-gray-50 border-l border-gray-200"><Plus className="size-3" /></button>
                                </div>
                              ) : <div />}
                              <div className="text-right">
                                {item.originalPrice && <p className={`${font} text-[11px] text-gray-400 line-through`}>฿{(item.originalPrice * item.quantity).toFixed(2)}</p>}
                                <p className={`${font} text-[16px] text-[#ee4d2d]`} style={{ fontWeight: 600 }}>฿{(item.price * item.quantity).toFixed(2)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shop voucher */}
                  <div className="px-4 py-2 border-t border-gray-100 bg-[#fff8f0] flex items-center gap-2">
                    <Tag className="size-3.5 text-[#ee4d2d]" />
                    <span className={`${font} text-[12px] text-[#ee4d2d]`}>คูปองร้านค้า: ลดเพิ่ม ฿30 เมื่อซื้อขั้นต่ำ ฿300</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:w-[340px]">
              <div className="bg-white rounded-xl p-6 border border-gray-200 sticky top-[140px]">
                {/* Coupon code */}
                
                {appliedCoupon && (
                  <div className="flex items-center justify-between mb-3 bg-green-50 rounded-lg px-3 py-2">
                    <span className={`${font} text-[12px] text-[#319754]`}>โค้ด: {appliedCoupon}</span>
                    <button onClick={() => { setAppliedCoupon(null); toast("ลบโค้ดส่วนลดแล้ว"); }} className={`text-[11px] text-red-400 cursor-pointer`}>ลบ</button>
                  </div>
                )}

                <h3 className={`${font} text-[16px] mb-4`} style={{ fontWeight: 600 }}>สรุปคำสั่งซื้อ</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className={`${font} text-[13px] text-gray-600`}>สินค้าที่เลือก</span>
                    <span className={`${font} text-[13px] text-[#319754]`} style={{ fontWeight: 600 }}>{selectedCount} รายการ</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${font} text-[13px] text-gray-600`}>ยอดรวมสินค้า ({items.reduce((s, i) => s + i.quantity, 0)} ชิ้น)</span>
                    <span className={`${font} text-[13px]`}>฿{selectedTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${font} text-[13px] text-gray-600`}>ส่วนลด</span>
                    <span className={`${font} text-[13px] text-[#ee4d2d]`}>-฿{discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className={`${font} text-[13px] text-gray-600`}>ค่าจัดส่ง</span>
                    <span className={`${font} text-[13px] text-[#319754]`}>ฟรี</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>มูลค่าสินค้ารวม</span>
                    <span className={`${font} text-[22px] text-[#ee4d2d]`} style={{ fontWeight: 700 }}>฿{(selectedTotal - discount).toFixed(2)}</span>
                  </div>
                </div>

                {/* Guarantee badge */}
                <div className="flex items-center gap-2 mt-3 text-gray-400">
                  <ShieldCheck className="size-4" />
                  <span className={`${font} text-[11px]`}>การซื้อของคุณได้รับการคุ้มครอง</span>
                </div>

                <button onClick={() => selectedCount > 0 && navigate("/payment")}
                  className={`w-full mt-4 py-3 rounded-full text-[14px] ${font} cursor-pointer transition-colors ${selectedCount > 0 ? "bg-[#319754] text-white hover:bg-[#267a43]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}>
                  สั่งซื้อสินค้า ({selectedCount})
                </button>
                <button onClick={() => navigate("/products")} className={`w-full mt-2 py-3 rounded-full border border-[#319754] text-[#319754] text-[14px] ${font} cursor-pointer hover:bg-[#319754]/5`}>ช้อปปิ้งต่อ</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}