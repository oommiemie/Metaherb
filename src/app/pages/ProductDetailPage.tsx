import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { products } from "../data/products";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { useWishlist } from "../store/WishlistContext";
import { useChat } from "../store/ChatContext";
import { useRecentlyViewed } from "../store/RecentlyViewedContext";
import { Star, Heart, Share2, Minus, Plus, ShoppingCart, ChevronLeft, ChevronRight, Store, MessageCircle, Shield, Truck, RotateCcw, Check } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import imgProd1 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgProd2 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgProd3 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgShop from "figma:asset/f9c837257a7dc5d10d1ea92a733813c293a76a81.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const productImages = [imgProd1, imgProd2, imgProd3];

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openChat } = useChat();
  const { addRecent } = useRecentlyViewed();
  const product = products.find((p) => p.id === id);
  const [selectedOption, setSelectedOption] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [reviewFilter, setReviewFilter] = useState<number | "all">("all");
  const [addedToCart, setAddedToCart] = useState(false);

  // Track recently viewed
  useEffect(() => {
    if (id) addRecent(id);
  }, [id]);

  if (!product) return <div className="p-8 text-center">สินค้าไม่พบ</div>;

  const wishlisted = isWishlisted(product.id);
  const filteredReviews = reviewFilter === "all" ? product.reviews : product.reviews.filter((r) => r.rating === reviewFilter);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    addItem({
      productId: product.id,
      name: product.name,
      image: productImages[0],
      price: product.price,
      originalPrice: product.originalPrice,
      option: product.options[selectedOption],
      quantity,
      inStock: true,
    });
    setAddedToCart(true);
    toast.success("เพิ่มลงรถเข็นแล้ว!", {
      description: `${product.name} x ${quantity}`,
      action: {
        label: "ดูรถเข็น",
        onClick: () => navigate("/cart"),
      },
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    if (isAuthenticated) navigate("/cart");
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("คัดลอกลิงก์แล้ว!");
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
      {/* Back */}
      <button onClick={() => navigate(-1)} className={`flex items-center gap-1 text-gray-500 text-[13px] ${font} mb-4 cursor-pointer hover:text-gray-700`}>
        <ChevronLeft className="size-4" /> กลับ
      </button>

      {/* Product Info */}
      <div className="flex flex-col lg:flex-row gap-6 sm:gap-8">
        {/* Images */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-2 sm:mb-3 relative">
            <ImageWithFallback src={productImages[mainImage % productImages.length]} alt={product.name} className="w-full h-full object-cover" />
            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-full">
              {mainImage + 1}/{productImages.length}
            </div>
          </div>
          <div className="flex gap-1.5 sm:gap-2">
            {productImages.map((img, i) => (
              <div key={i} onClick={() => setMainImage(i)}
                className={`size-12 sm:size-16 rounded-lg overflow-hidden cursor-pointer border-2 ${mainImage === i ? "border-[#319754]" : "border-transparent"}`}>
                <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <h1 className={`${font} text-[22px] text-gray-800`} style={{ fontWeight: 500 }}>{product.name}</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => { toggleWishlist(product.id); toast(wishlisted ? "ลบออกจากสินค้าที่ชอบ" : "เพิ่มในสินค้าที่ชอบแล้ว ❤️"); }}
                className="cursor-pointer hover:scale-110 transition-transform">
                <Heart className={`size-5 ${wishlisted ? "fill-[#ff383c] text-[#ff383c]" : "text-gray-400"}`} />
              </button>
              <button onClick={handleShare} className="cursor-pointer hover:scale-110 transition-transform">
                <Share2 className="size-5 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
            <Star className="size-4 fill-[#f7931d] text-[#f7931d]" />
            <span className={`${font} text-[14px] text-gray-600`}>{product.rating}/5</span>
            <span className={`${font} text-[13px] text-gray-400`}>• {product.reviews.length} รีวิว</span>
            <span className={`${font} text-[13px] text-gray-400`}>• {product.sold}</span>
          </div>

          {/* Flash Sale banner */}
          {product.discount && (
            <div className="bg-gradient-to-r from-[#ee4d2d] to-[#ff6633] text-white rounded-lg px-4 py-2.5 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className={`${font} text-[14px]`} style={{ fontWeight: 600 }}>⚡ Flash Sale</span>
              </div>
              <span className={`${font} text-[12px] opacity-80`}>สิ้นสุดใน 12:13:08</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-4 bg-[#fafafa] rounded-lg p-4">
            <span className={`${font} text-[28px] text-[#ee4d2d]`} style={{ fontWeight: 700 }}>฿{product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <>
                <span className={`${font} text-[16px] text-gray-400 line-through`}>฿{product.originalPrice.toFixed(2)}</span>
                <span className={`bg-[#ee4d2d] text-white text-[12px] px-2 py-0.5 rounded ${font}`}>{product.discount}</span>
              </>
            )}
          </div>

          {/* Shipping info - Shopee style */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <Truck className="size-4 text-gray-400 shrink-0" />
              <div className="flex-1">
                <span className={`${font} text-[13px] text-gray-600`}>ส่งฟรี</span>
                <span className={`${font} text-[11px] text-gray-400 ml-2`}>จัดส่งภายใน 1-3 วันทำการ</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="size-4 text-gray-400 shrink-0" />
              <span className={`${font} text-[13px] text-gray-600`}>การันตีคืนสินค้าภายใน 15 วัน</span>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw className="size-4 text-gray-400 shrink-0" />
              <span className={`${font} text-[13px] text-gray-600`}>เปลี่ยนสินค้าฟรี</span>
            </div>
          </div>

          {/* Options */}
          <div className="mt-6">
            <p className={`${font} text-[14px] text-gray-600 mb-2`}>ตัวเลือกสินค้า</p>
            <div className="flex flex-wrap gap-2">
              {product.options.map((opt, i) => (
                <button key={opt} onClick={() => setSelectedOption(i)}
                  className={`px-4 py-2 rounded-lg text-[13px] ${font} cursor-pointer border transition-colors ${
                    selectedOption === i ? "border-[#319754] text-[#319754] bg-[#319754]/5" : "border-gray-300 text-gray-600"
                  }`}>{opt}</button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className={`${font} text-[14px] text-gray-600 mb-2`}>จำนวนสินค้า</p>
            <div className="flex items-center gap-3">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="size-8 rounded border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"><Minus className="size-4" /></button>
              <span className={`${font} text-[16px] w-8 text-center`}>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="size-8 rounded border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-50"><Plus className="size-4" /></button>
              <span className={`${font} text-[13px] text-gray-400`}>เหลือสินค้า {product.stock} ชิ้น</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
            <button onClick={handleAddToCart}
              className={`flex items-center justify-center gap-2 px-6 sm:px-8 py-3 rounded-lg border-2 ${addedToCart ? "border-[#319754] bg-[#319754] text-white" : "border-[#319754] text-[#319754]"} ${font} text-[14px] cursor-pointer hover:bg-[#319754]/5 transition-colors`}>
              {addedToCart ? <><Check className="size-5" /> เพิ่มแล้ว!</> : <><ShoppingCart className="size-5" /> เพิ่มในรถเข็น</>}
            </button>
            <button onClick={handleBuyNow}
              className={`flex-1 py-3 rounded-lg bg-[#319754] text-white ${font} text-[14px] cursor-pointer hover:bg-[#267a43]`}>
              ซื้อสินค้า
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-10 bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
        <h2 className={`${font} text-[18px] text-gray-800 mb-3`} style={{ fontWeight: 600 }}>รายละเอียดสินค้า</h2>
        <p className={`${font} text-[14px] text-gray-600 leading-relaxed`}>{product.description}</p>
        <div className="mt-4 border-t pt-4">
          <h3 className={`${font} text-[14px] text-gray-800 mb-2`} style={{ fontWeight: 600 }}>ข้อมูลจำเพาะ</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "น้ำหนักสุทธิ", value: product.weight },
              { label: "ประเภท", value: product.type },
              { label: "รหัสสินค้า", value: product.sku },
              { label: "รูปแบบ", value: product.format },
            ].map((s) => (
              <div key={s.label} className="flex gap-2">
                <span className={`${font} text-[13px] text-gray-400 w-24 shrink-0`}>{s.label}</span>
                <span className={`${font} text-[13px] text-gray-700`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Shop info */}
      <div className="mt-4 bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img src={imgShop} className="size-[48px] rounded-full" alt="Shop" />
            <div>
              <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{product.shopName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="size-2 rounded-full bg-green-400" />
                <span className={`${font} text-[11px] text-green-500`}>ออนไลน์</span>
              </div>
              <div className={`flex gap-4 text-[12px] text-gray-500 ${font} mt-0.5`}>
                <span>สินค้า <span className="text-[#319754]">100</span></span>
                <span>คะแนน <span className="text-[#319754]">4.6</span></span>
                <span>ตอบกลับ <span className="text-[#319754]">95%</span></span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => openChat("metaherb")}
              className={`flex items-center gap-1.5 border border-[#319754] text-[#319754] px-4 py-1.5 rounded-lg text-[13px] ${font} cursor-pointer hover:bg-[#319754]/5`}>
              <MessageCircle className="size-4" /> แชท
            </button>
            <button onClick={() => navigate("/products")}
              className={`flex items-center gap-1.5 border border-gray-300 text-gray-600 px-4 py-1.5 rounded-lg text-[13px] ${font} cursor-pointer hover:bg-gray-50`}>
              <Store className="size-4" /> ดูร้านค้า
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-4 bg-white rounded-xl p-4 sm:p-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <div>
            <h2 className={`${font} text-[18px] text-gray-800`} style={{ fontWeight: 600 }}>รีวิวสินค้า</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className={`${font} text-[28px] text-[#ee4d2d]`} style={{ fontWeight: 700 }}>{product.rating}</span>
              <span className={`${font} text-[14px] text-gray-400`}>/ 5</span>
              <div className="flex gap-0.5 ml-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`size-4 ${s <= Math.round(product.rating) ? "fill-[#f7931d] text-[#f7931d]" : "text-gray-300"}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {(["all" as const, 5, 4, 3, 2, 1] as const).map((r) => (
              <button key={r} onClick={() => setReviewFilter(r)}
                className={`px-3 py-1 rounded text-[12px] ${font} cursor-pointer transition-colors ${
                  reviewFilter === r ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}>
                {typeof r === "number" ? `${r} ★` : `ทั้งหมด (${product.reviews.length})`}
              </button>
            ))}
          </div>
        </div>
        {filteredReviews.length === 0 ? (
          <p className={`${font} text-[14px] text-gray-400 text-center py-8`}>ยังไม่มีรีวิว</p>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((r, i) => (
              <div key={i} className="border-b border-gray-100 pb-4 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-[12px]">{r.user.charAt(0).toUpperCase()}</div>
                  <div>
                    <span className={`${font} text-[13px]`}>{r.user}</span>
                    <div className="flex gap-0.5">{Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="size-3 fill-[#f7931d] text-[#f7931d]" />)}</div>
                  </div>
                </div>
                <p className={`${font} text-[11px] text-gray-400 mt-1`}>{r.date}</p>
                {r.tags.map((t) => <span key={t} className={`inline-block bg-[#319754]/10 text-[#319754] text-[10px] px-2 py-0.5 rounded mt-1 mr-1 ${font}`}>{t}</span>)}
                <p className={`${font} text-[13px] text-gray-600 mt-2`}>{r.comment}</p>
                {/* Helpful button */}
                <button className={`mt-2 flex items-center gap-1 text-[11px] text-gray-400 ${font} cursor-pointer hover:text-gray-600`}>
                  👍 เป็นประโยชน์
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      <div className="mt-6 sm:mt-8">
        <h2 className={`${font} text-[16px] sm:text-[18px] text-gray-800 mb-3 sm:mb-4`} style={{ fontWeight: 600 }}>สินค้าเหมาะกับคุณ</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
          {products.filter((p) => p.id !== id).slice(0, 6).map((p, i) => (
            <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
              className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
              <div className="aspect-square bg-gray-100 overflow-hidden">
                <ImageWithFallback src={productImages[i % productImages.length]} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                <p className={`${font} text-[12px] truncate`}>{p.name}</p>
                <span className={`${font} text-[13px] text-[#319754]`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
