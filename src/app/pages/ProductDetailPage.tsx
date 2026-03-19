import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { products } from "../data/products";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { useWishlist } from "../store/WishlistContext";
import { useChat } from "../store/ChatContext";
import { useRecentlyViewed } from "../store/RecentlyViewedContext";
import { getShopIdByName } from "../data/shops";
import { Star, Heart, Share2, ChevronLeft, ChevronRight, Store, MessageCircle, Check, Zap } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import imgProd1 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgProd2 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgProd3 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgShop from "figma:asset/f9c837257a7dc5d10d1ea92a733813c293a76a81.png";
import imgFrame40 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgFrame41 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgFrame42 from "figma:asset/2760a63146309433afbbc9a2171f4189dfd27e07.png";
import imgFrame43 from "figma:asset/623849f160a45efb31fada62d7efbfb3f3bab60f.png";
import imgFrame44 from "figma:asset/b251ac55d2f44764962036699fe6da4d05a98501.png";
import svgPaths from "../../imports/svg-ho36dslifz";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// Product-specific images (3 per product for gallery)
const productImageMap: Record<string, string[]> = {
  "1": [ // ชาออร์แกนิก
    "https://images.unsplash.com/photo-1621806366061-442c3500deb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1597236955026-3911e0a234b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1768902730271-878b6ea84d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
  ],
  "2": [ // กาแฟดริปออร์แกนิก
    "https://images.unsplash.com/photo-1599639932525-213272ff954b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1565273975921-c884f2b703df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
  ],
  "3": [ // น้ำผึ้งดิบ
    "https://images.unsplash.com/photo-1761416351532-ede97c29fab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1639009302104-0b8311eabe03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
  ],
  "4": [ // ขมิ้นชันแคปซูล
    "https://images.unsplash.com/photo-1577276218751-2ffe1caa4994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1634114627043-9a2abf455494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
  ],
  "5": [ // น้ำมันมะพร้าวสกัดเย็น
    "https://images.unsplash.com/photo-1739923416528-53ac197539f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "6": [ // ฟ้าทะลายโจรสกัด
    "https://images.unsplash.com/photo-1569936906148-06de87cb0681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
    imgProd2,
  ],
  "7": [ // แยมมัลเบอร์รี่
    "https://images.unsplash.com/photo-1705231956335-8987f9ba4e66?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
    imgProd1,
  ],
  "8": [ // ซอสพริกสมุนไพร
    "https://images.unsplash.com/photo-1757845081746-4c6a1a0d34ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "9": [ // ครีมบำรุงว่านหางจระเข้
    "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1675921071386-f800c90e5904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
  ],
  "10": [ // น้ำมันมะกอกออร์แกนิก
    "https://images.unsplash.com/photo-1760445528823-fd942d4b459b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "11": [ // กาแฟดริปดอยช้าง
    "https://images.unsplash.com/photo-1565273975921-c884f2b703df?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1599639932525-213272ff954b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
  ],
  "12": [ // มะขามป้อมอบแห้ง
    "https://images.unsplash.com/photo-1694101715338-e5dabd7fdd20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "13": [ // ชาเขียวมัทฉะ
    "https://images.unsplash.com/photo-1755184108643-a8ee184ce542?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1621806366061-442c3500deb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
  ],
  "14": [ // น้ำมันงาดำสกัดเย็น
    "https://images.unsplash.com/photo-1727233432251-b254881e01a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "15": [ // สบู่สมุนไพรมะขาม
    "https://images.unsplash.com/photo-1566281796817-93bc94d7dbd2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
    imgProd2,
  ],
  "16": [ // ยาหม่องสมุนไพร
    "https://images.unsplash.com/photo-1707735507527-d647d1f6c35c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
    imgProd1,
  ],
  "17": [ // เทียนหอมลาเวนเดอร์
    "https://images.unsplash.com/photo-1745125996161-3fb93bc44f9c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "18": [ // ชุดของขวัญสมุนไพร
    "https://images.unsplash.com/photo-1592239544701-9ef09f132c4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
    imgProd2,
  ],
  "19": [ // แชมพูสมุนไพรอัญชัน
    "https://images.unsplash.com/photo-1596833171433-460249d79533?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
    imgProd1,
  ],
  "20": [ // น้ำมันยูคาลิปตัส
    "https://images.unsplash.com/photo-1647934174425-61136513aed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
    imgProd3,
  ],
  "21": [ // ผงขมิ้นชันออร์แกนิก
    "https://images.unsplash.com/photo-1634114627043-9a2abf455494?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1577276218751-2ffe1caa4994?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
  ],
  "22": [ // ชาดอกเก๊กฮวย
    "https://images.unsplash.com/photo-1768902730271-878b6ea84d62?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1621806366061-442c3500deb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
  ],
  "23": [ // ลูกประคบสมุนไพร
    "https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
    imgProd1,
  ],
  "24": [ // แคปซูลกระชายดำ
    "https://images.unsplash.com/photo-1621586863274-9e5be9debc86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1569936906148-06de87cb0681?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
  ],
  "25": [ // โลชั่นตะไคร้หอม
    "https://images.unsplash.com/photo-1698593975713-95c43f69ef1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
    imgProd1,
  ],
  "26": [ // น้ำผึ้งมะนาว
    "https://images.unsplash.com/photo-1639009302104-0b8311eabe03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1761416351532-ede97c29fab8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
  ],
  "27": [ // สเปรย์สมุนไพรดับกลิ่น
    "https://images.unsplash.com/photo-1666402667362-2e3274fcbb2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
    imgProd1,
  ],
  "28": [ // เจลว่านหางจระเข้
    "https://images.unsplash.com/photo-1675921071386-f800c90e5904?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd2,
  ],
  "29": [ // ชาอู่หลงบนดอย
    "https://images.unsplash.com/photo-1597236955026-3911e0a234b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1621806366061-442c3500deb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd3,
  ],
  "30": [ // ยาดมสมุนไพร 7 รส
    "https://images.unsplash.com/photo-1707735507527-d647d1f6c35c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    "https://images.unsplash.com/photo-1647934174425-61136513aed7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080",
    imgProd1,
  ],
};

const defaultImages = [imgProd1, imgProd2, imgProd3];
const recommendedImages = [imgProd1, imgFrame40, imgFrame41, imgFrame42, imgFrame43, imgFrame44];

function getProductImages(productId: string): string[] {
  return productImageMap[productId] || defaultImages;
}

/* ===== Countdown Timer ===== */
function CountdownTimer({ initialSeconds }: { initialSeconds: number }) {
  const [sec, setSec] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-[4px]">
      {[h, m, s].map((t, i) => (
        <div key={i} className="flex items-center gap-[4px]">
          <div className="rounded-[8px] w-[32px] flex items-center justify-center py-[4px]" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), linear-gradient(#e62e05 0%, #bc1b06 100%)" }}>
            <span className={`${font} text-[16px] text-white text-center`} style={{ fontWeight: 600 }}>{t}</span>
          </div>
          {i < 2 && <span className={`${font} text-[16px] text-black`}>:</span>}
        </div>
      ))}
    </div>
  );
}

const shopLogos: Record<string, string> = {
  "METAHERB Store": imgShop,
  "สมุนไพรบ้านสวน": "https://images.unsplash.com/photo-1762644085409-305634b2123e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiJTIwZ2FyZGVuJTIwY290dGFnZSUyMHNob3B8ZW58MXx8fHwxNzczODg1NDQ0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "ร้านป่าหมอก": "https://images.unsplash.com/photo-1713724782271-6670d50322ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaXN0eSUyMGZvcmVzdCUyMG1vdW50YWluJTIwc2hvcHxlbnwxfHx8fDE3NzM4ODU0NDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "Organic Thai Farm": "https://images.unsplash.com/photo-1593701635836-7fd2cd40a35f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwZmFybSUyMGdyZWVuJTIwZmllbGR8ZW58MXx8fHwxNzczODg1NDQ1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "ธรรมชาติพรีเมียม": "https://images.unsplash.com/photo-1770361515842-cc592571bbd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmFsJTIwcHJlbWl1bSUyMGJvdGFuaWNhbHxlbnwxfHx8fDE3NzM4ODU0NDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
};

export default function ProductDetailPage() {
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
  const [reviewPage, setReviewPage] = useState(1);
  const [flyingItem, setFlyingItem] = useState<{ x: number; y: number; targetX: number; targetY: number; img: string } | null>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);
  const reviewScrollRef = useRef<HTMLDivElement>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (id) addRecent(id);
  }, [id]);

  if (!product) return <div className="p-8 text-center">สินค้าไม่พบ</div>;

  const productImages = getProductImages(product.id);
  const wishlisted = isWishlisted(product.id);
  const filteredReviews = reviewFilter === "all" ? product.reviews : product.reviews.filter((r) => r.rating === reviewFilter);
  const REVIEWS_PER_PAGE = 4;
  const reviewTotalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice((reviewPage - 1) * REVIEWS_PER_PAGE, reviewPage * REVIEWS_PER_PAGE);

  const handleAddToCart = () => {
    if (!isAuthenticated) { navigate("/login"); return; }

    // Trigger flying animation
    if (addBtnRef.current) {
      const btnRect = addBtnRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('[alt="cart"]');
      const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { left: window.innerWidth - 80, top: 20, width: 40, height: 40 };
      setFlyingItem({
        x: btnRect.left + btnRect.width / 2 - 25,
        y: btnRect.top - 25,
        targetX: targetRect.left + (targetRect.width / 2) - 25,
        targetY: targetRect.top + (targetRect.height / 2) - 25,
        img: productImages[0],
      });
      setTimeout(() => setFlyingItem(null), 800);
    }

    addItem({
      productId: product.id,
      name: product.name,
      image: productImages[0],
      price: product.price,
      originalPrice: product.originalPrice,
      option: product.options[selectedOption],
      quantity,
      inStock: true,
      shopName: product.shopName,
    });
    setAddedToCart(true);
    toast.success("เพิ่มลงรถเข็นแล้ว!", {
      description: `${product.name} x ${quantity}`,
      action: { label: "ดูรถเข็น", onClick: () => navigate("/cart") },
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

  const relatedProducts = products.filter((p) => p.id !== id).slice(0, 6);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
      {/* Top bar: Back + actions */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 bg-[#d4d4d4] px-[16px] py-[4px] rounded-full cursor-pointer hover:bg-[#c4c4c4] transition-colors">
          <ChevronLeft className="size-3" />
          <span className={`${font} text-[12px] text-black`}>กลับ</span>
        </button>
        <div className="flex items-center gap-[10px]">
          <button onClick={() => { toggleWishlist(product.id); toast(wishlisted ? "ลบออกจากสินค้าที่ชอบ" : "เพิ่มในสินค้าที่ชอบแล้ว"); }}
            className="flex items-center gap-[10px] bg-[#f5f5f5] px-[16px] py-[4px] rounded-full cursor-pointer hover:bg-[#e5e5e5] transition-colors">
            <Heart className={`size-3 ${wishlisted ? "fill-[#ff383c] text-[#ff383c]" : "text-black/85"}`} />
            <span className={`${font} text-[12px] text-black`}>{wishlisted ? "1" : "0"}</span>
          </button>
          <button onClick={() => openChat("metaherb")}
            className="flex items-center justify-center bg-[#f5f5f5] rounded-full size-[28px] cursor-pointer hover:bg-[#e5e5e5] transition-colors">
            <MessageCircle className="size-3 text-black/85" />
          </button>
          <button onClick={handleShare}
            className="flex items-center justify-center bg-[#f5f5f5] rounded-full size-[28px] cursor-pointer hover:bg-[#e5e5e5] transition-colors">
            <Share2 className="size-3 text-black/85" />
          </button>
        </div>
      </div>

      {/* Main product section */}
      <div className="flex flex-col lg:flex-row gap-[24px]">
        {/* Left: Images */}
        <div className="flex flex-col gap-[10px] shrink-0">
          <div className="w-full lg:w-[450px] aspect-square rounded-[16px] overflow-hidden bg-gray-100 relative cursor-pointer" onClick={() => setLightboxOpen(true)}>
            <ImageWithFallback src={productImages[mainImage % productImages.length]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          <div className="flex gap-[10px] overflow-x-auto">
            {productImages.map((img, i) => (
              <div key={i} onClick={() => setMainImage(i)}
                className={`size-[70px] rounded-[16px] overflow-hidden cursor-pointer shrink-0 relative ${mainImage === i ? "ring-2 ring-[#f8e8ce]" : ""}`}>
                <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-[24px]">
          {/* Name + Rating */}
          <div className="flex flex-col gap-[10px]">
            <h1 className={`${font} text-[20px] text-black truncate`} style={{ fontWeight: 500 }}>{product.name}</h1>
            <div className="flex gap-[16px] items-center">
              <div className="flex items-center gap-[10px]">
                <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                  <path d="M14 0H0V14H14V0Z" fill="#F7C42B" opacity="0" />
                  <path d={svgPaths.p1052b000} fill="#F7C42B" />
                </svg>
                <span className={`${font} text-[12px] text-black`}>{product.rating}/5</span>
              </div>
              <div className="flex items-center gap-[10px]">
                <svg className="size-[12px]" fill="none" viewBox="0 0 11 12">
                  <path d={svgPaths.p2595fa00} fill="black" fillOpacity="0.85" />
                </svg>
                <span className={`${font} text-[12px] text-black`}>{product.sold}</span>
              </div>
            </div>
          </div>

          {/* Flash Sale Banner */}
          {product.isFlashSale && (
            <div className="rounded-[16px] overflow-hidden" style={{ backgroundImage: "linear-gradient(90deg, #fff4ed 0%, #fff4ed 100%), linear-gradient(90deg, #e62e05 0%, #e62e05 100%)" }}>
              <div className="bg-[#e62e05] rounded-t-[16px] px-[10px] py-[6px] flex items-center gap-[10px]">
                <div className="flex items-center gap-[10px] py-[6px]">
                  <Zap className="size-5 text-white fill-white" />
                  <span className={`${font} text-[20px] text-white text-center`} style={{ fontWeight: 500 }}>Flash Sale</span>
                </div>
                <CountdownTimer initialSeconds={product.flashSaleEndsIn || 43988} />
              </div>
              <div className="px-[10px] py-[10px] flex items-center gap-[10px]">
                <span className={`${font} text-[24px] text-[#bc1b06] text-center`} style={{ fontWeight: 500 }}>฿ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className={`${font} text-[16px] text-[#a3a3a3] text-center line-through`} style={{ fontWeight: 500 }}>฿ {product.originalPrice.toFixed(2)}</span>
                )}
                {product.discountPercent && (
                  <div className="bg-[#e62e05] px-[16px] py-[4px] rounded-full">
                    <span className={`${font} text-[12px] text-white text-center`}>ลด {product.discountPercent}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Regular price card */}
          {!product.isFlashSale && (
            <div className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[10px]">
              <span className={`${font} text-[14px] text-[#666]`}>ราคาสินค้า</span>
              <div className="flex items-center gap-[10px]">
                <span className={`${font} text-[24px] ${product.discountPercent ? "text-[#bc1b06]" : "text-[#297a4e]"}`} style={{ fontWeight: 500 }}>฿ {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className={`${font} text-[16px] text-[#a3a3a3] line-through`} style={{ fontWeight: 500 }}>฿ {product.originalPrice.toFixed(2)}</span>
                )}
                {product.discountPercent && (
                  <div className="bg-[#e62e05] px-[16px] py-[4px] rounded-full">
                    <span className={`${font} text-[12px] text-white`}>ลด {product.discountPercent}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Options */}
          <div className="flex flex-col gap-[10px]">
            <span className={`${font} text-[14px] text-[#666]`}>ตัวเลือกสินค้า</span>
            <div className="flex flex-wrap gap-[10px]">
              {product.options.map((opt, i) => (
                <button key={opt} onClick={() => setSelectedOption(i)}
                  className={`px-[16px] py-[4px] rounded-full text-[12px] ${font} cursor-pointer border transition-colors ${
                    selectedOption === i ? "border-[#319754] text-[#319754] bg-[#319754]/5" : "border-[#e5e5e5] text-black"
                  }`}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="flex flex-col gap-[10px]">
            <span className={`${font} text-[14px] text-[#666]`}>จำนวนสินค้า</span>
            <div className="flex items-center gap-[16px]">
              <div className="bg-[#f5f5f5] flex items-center gap-[24px] px-[16px] py-[4px] rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="cursor-pointer flex items-center justify-center">
                  <svg width="12" height="1" viewBox="0 0 12 1" fill="none"><path d={svgPaths.pdf75300} fill="black" fillOpacity="0.85" /></svg>
                </button>
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="cursor-pointer flex items-center justify-center">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={svgPaths.p1a93ed80} fill="black" fillOpacity="0.85" /></svg>
                </button>
              </div>
              <div className="flex items-center gap-[10px]">
                <svg width="16" height="17" viewBox="0 0 16 17" fill="none"><path d={svgPaths.p3a1e14f0} fill="black" fillOpacity="0.85" /></svg>
                <span className={`${font} text-[12px] text-black`}>เหลือเพียง {product.stock} ชิ้น</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-[10px] py-[24px]">
            <motion.button
              ref={addBtnRef}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-center gap-[10px] h-[48px] flex-1 sm:flex-none sm:w-[200px] rounded-full border cursor-pointer transition-colors ${addedToCart ? "border-[#319754] bg-[#319754] text-white" : "border-[#db8b0a] text-[#db8b0a] hover:bg-[#db8b0a]/5"}`}
            >
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span key="added" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-2">
                    <Check className="size-4" /> เพิ่มแล้ว!
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="flex items-center gap-[10px]">
                    <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                      <path d={svgPaths.p3087100} fill="#C59507" />
                      <path d={svgPaths.p5cbde00} fill="#C59507" />
                    </svg>
                    <span className={`${font} text-[14px]`}>เพิ่มไปยังรถเข็น</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <button onClick={handleBuyNow}
              className={`flex items-center justify-center gap-[10px] h-[48px] flex-1 sm:flex-none sm:w-[200px] rounded-full bg-[#319754] text-white ${font} text-[14px] cursor-pointer hover:bg-[#267a43] transition-colors`}>
              <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d={svgPaths.p294be700} fill="white" /></svg>
              ซื้อสินค้า
            </button>
          </div>
        </div>
      </div>

      {/* Description + Specs card */}
      <div className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px] mt-6">
        <div className="flex flex-col gap-[10px]">
          <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>รายละเอียดผลิตภัณฑ์</h2>
          <p className={`${font} text-[14px] text-black leading-relaxed`}>{product.description}</p>
        </div>
        <div className="h-px w-full bg-[#D4D4D8]" />
        <div className="flex flex-col gap-[10px]">
          <h3 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลจำเพาะ</h3>
          {[
            { label: "น้ำหนักสุทธิ:", value: product.weight },
            { label: "ประเภท:", value: product.type },
            { label: "รหัสสินค้า:", value: product.sku },
            { label: "รูปแบบ:", value: product.format },
          ].map((s) => (
            <div key={s.label} className="flex gap-[10px]">
              <span className={`${font} text-[14px] text-black w-[80px] shrink-0`} style={{ fontWeight: 500 }}>{s.label}</span>
              <span className={`${font} text-[14px] text-black`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shop info */}
      <div className="bg-white rounded-[16px] p-4 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={shopLogos[product.shopName] || imgShop} className="size-[48px] rounded-full object-cover" alt="Shop" />
          <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{product.shopName}</span>
        </div>
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-[10px]">
            <svg className="size-[14px]" fill="none" viewBox="0 0 13 14"><path d={svgPaths.p2d3b1d00} fill="black" fillOpacity="0.85" /></svg>
            <span className={`${font} text-[14px] text-black`}>รายการสินค้า</span>
            <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>100</span>
            <span className={`${font} text-[14px] text-black`}>รายการ</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <svg className="size-[14px]" fill="none" viewBox="0 0 14 14"><path d={svgPaths.p1052b000} fill="black" /></svg>
            <span className={`${font} text-[14px] text-black`}>คะแนนร้านค้า</span>
            <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>{product.rating}/5</span>
            <span className={`${font} text-[14px] text-black`}>การให้คะแนนทั้งหมด 100</span>
          </div>
          <div className="flex items-center gap-[10px]">
            <Heart className="size-3 text-black/85" />
            <span className={`${font} text-[14px] text-black`}>ถูกใจสินค้า</span>
            <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>100</span>
          </div>
          <button onClick={() => { const sid = getShopIdByName(product.shopName); navigate(sid ? `/shop/${sid}` : "/products"); }}
            className={`flex items-center gap-1.5 border border-[#319754] text-[#319754] px-4 py-1.5 rounded-full text-[12px] ${font} cursor-pointer hover:bg-[#319754]/5`}>
            <Store className="size-3" /> ดูร้านค้า
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-[#D4D4D8] my-6" />

      {/* Reviews */}
      <div className="flex flex-col gap-[10px]">
        {/* Header + Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3">
          <h2 className={`${font} text-[20px] text-black shrink-0`} style={{ fontWeight: 500 }}>รีวิวสินค้า</h2>
          <div className="flex gap-[8px] sm:gap-[10px] items-center flex-wrap">
            {(["all" as const, 1, 2, 3, 4, 5] as const).map((r) => (
              <button key={r} onClick={() => { setReviewFilter(r); setReviewPage(1); }}
                className={`flex items-center gap-[10px] px-[16px] py-[4px] rounded-full text-[12px] ${font} cursor-pointer transition-colors relative ${
                  reviewFilter === r ? "bg-[#f5f5f5]" : ""
                }`}>
                {reviewFilter !== r && <div className="absolute border border-[#d4d4d4] inset-0 pointer-events-none rounded-full" />}
                <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                  <path d="M14 0H0V14H14V0Z" fill="#F7C42B" opacity="0" />
                  <path d={svgPaths.p1052b000} fill="#F7C42B" />
                </svg>
                <span className={`${font} text-[12px] text-black`}>{typeof r === "number" ? r : "ทั้งหมด"}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Review cards - horizontal scroll */}
        {paginatedReviews.length === 0 ? (
          <p className={`${font} text-[14px] text-gray-400 text-center py-8`}>ยังไม่มีรีวิว</p>
        ) : (
          <div className="relative">
            <div ref={reviewScrollRef} className="flex gap-[10px] overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: "none" }}>
              {paginatedReviews.map((r, i) => (
                <div key={i} className="bg-white rounded-[16px] relative shrink-0 w-[calc(25%-8px)] min-w-[240px]" style={{ height: 191 }}>
                  <div className="absolute border border-[#e5e5e5] inset-0 pointer-events-none rounded-[16px]" />
                  <div className="flex flex-col gap-[10px] items-start p-[10px] size-full">
                    {/* User row */}
                    <div className="flex gap-[10px] items-start w-full">
                      <div className="shrink-0 size-[40px]">
                        <svg className="block size-full" fill="none" viewBox="0 0 40 40">
                          <circle cx="20" cy="20" fill="#D9D9D9" r="20" />
                        </svg>
                      </div>
                      <div className="flex flex-1 flex-col gap-[2px] justify-center min-w-0">
                        <div className="flex items-center justify-between w-full">
                          <span className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{r.user}</span>
                          <div className="flex gap-[4px] items-center shrink-0">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <svg key={j} className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                                <path d={svgPaths.p1052b000} fill={j < r.rating ? "#F7C42B" : "#D4D4D4"} />
                              </svg>
                            ))}
                          </div>
                        </div>
                        <span className={`${font} text-[10px] text-[#a3a3a3]`}>{r.date}</span>
                      </div>
                    </div>
                    {/* Option tag */}
                    {r.tags && r.tags.length > 0 && (
                      <div className="bg-[#db8b0a] px-[8px] py-[4px] rounded-full shrink-0">
                        <span className={`${font} text-[10px] text-white truncate`}>ตัวเลือกสินค้า: {product.options[selectedOption] || r.tags[0]}</span>
                      </div>
                    )}
                    {/* Comment */}
                    <p className={`${font} text-[10px] text-black overflow-hidden text-ellipsis w-full`} style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{r.comment}</p>
                    {/* Image placeholders */}
                    <div className="flex gap-[10px] items-start overflow-clip w-full">
                      {[0, 1, 2, 3, 4].map((j) => (
                        <div key={j} className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Scroll right arrow */}
            {filteredReviews.length > 4 && (
              <button
                onClick={() => {
                  if (reviewScrollRef.current) reviewScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 border border-[#e5e5e5] rounded-full size-[32px] flex items-center justify-center cursor-pointer shadow-md hover:bg-white z-10"
              >
                <ChevronRight className="size-4 text-black" />
              </button>
            )}
          </div>
        )}

        {/* Review pagination */}
        {reviewTotalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-2">
            {Array.from({ length: reviewTotalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setReviewPage(p)}
                className={`size-7 rounded-full flex items-center justify-center text-[12px] ${font} cursor-pointer ${p === reviewPage ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {p}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-full h-px bg-[#D4D4D8] my-6" />

      {/* Related products */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>สินค้าเหมาะกับคุณ</h2>
          <button onClick={() => navigate("/products")} className="flex items-center gap-1 cursor-pointer hover:opacity-80">
            <span className={`${font} text-[12px] text-[#666]`}>ดูทั้งหมด</span>
            <ChevronRight className="size-4 text-[#666]" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[10px]">
          {relatedProducts.map((p, i) => {
            const tag = p.isFlashSale ? "flashsale" : p.discountPercent ? "discount" : p.isRecommended ? "recommended" : null;
            return (
              <div key={p.id} onClick={() => { navigate(`/product/${p.id}`); window.scrollTo(0, 0); }}
                className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="aspect-square relative overflow-hidden">
                  <ImageWithFallback src={getProductImages(p.id)[0]} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {tag === "flashsale" && (
                    <div className="absolute top-0 right-0 p-[6px]">
                      <div className="bg-[#e62e05] px-[10px] py-[2px] rounded-full border border-[#bc1b06]">
                        <span className={`${font} text-[10px] text-white`}>ลด {p.discountPercent}%</span>
                      </div>
                    </div>
                  )}
                  {tag === "discount" && (
                    <div className="absolute top-0 right-0 p-[6px]">
                      <div className="bg-[#e62e05] px-[10px] py-[2px] rounded-full border border-[#bc1b06]">
                        <span className={`${font} text-[10px] text-white`}>ลด {p.discountPercent}%</span>
                      </div>
                    </div>
                  )}
                  {tag === "recommended" && (
                    <div className="absolute top-0 right-0 p-[6px]">
                      <div className="bg-[#319754] px-[10px] py-[2px] rounded-full border border-[#143c22]">
                        <span className={`${font} text-[10px] text-white`}>สินค้าแนะนำ</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-[8px] flex flex-col gap-[2px]">
                  <p className={`${font} text-[12px] text-black truncate`}>{p.name}</p>
                  <span className={`${font} text-[12px] ${p.discountPercent ? "text-[#e62e05]" : "text-[#226a3b]"}`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg className="size-[10px]" fill="none" viewBox="0 0 14 14"><path d={svgPaths.p1052b000} fill="#F7C42B" /></svg>
                      <span className={`${font} text-[10px] text-black`}>{p.rating}/5</span>
                    </div>
                    <span className={`${font} text-[10px] text-black`}>{p.sold}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Flying item animation overlay */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            key="flying-cart-item"
            initial={{
              position: "fixed",
              left: flyingItem.x,
              top: flyingItem.y,
              width: 50,
              height: 50,
              opacity: 1,
              scale: 1,
              zIndex: 9999,
              borderRadius: 12,
              overflow: "hidden",
              pointerEvents: "none" as const,
              boxShadow: "0 4px 20px rgba(49,151,84,0.4)",
            }}
            animate={{
              left: flyingItem.targetX,
              top: flyingItem.targetY,
              width: 20,
              height: 20,
              opacity: 0.3,
              scale: 0.3,
              borderRadius: 20,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              left: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              top: { duration: 0.7, ease: [0.15, 0, 0.2, 1] },
            }}
          >
            <img src={flyingItem.img} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={() => setLightboxOpen(false)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 rounded-full size-[40px] flex items-center justify-center cursor-pointer transition-colors z-10"
            >
              <span className="text-white text-[20px]">&times;</span>
            </button>

            {/* Prev arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); setMainImage((prev) => (prev - 1 + productImages.length) % productImages.length); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full size-[40px] flex items-center justify-center cursor-pointer transition-colors z-10"
            >
              <ChevronLeft className="size-5 text-white" />
            </button>

            {/* Main image */}
            <motion.div
              key={mainImage}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="max-w-[90vw] max-h-[85vh] rounded-[16px] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={productImages[mainImage % productImages.length]}
                alt={product.name}
                className="max-w-[90vw] max-h-[85vh] object-contain"
              />
            </motion.div>

            {/* Next arrow */}
            <button
              onClick={(e) => { e.stopPropagation(); setMainImage((prev) => (prev + 1) % productImages.length); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 rounded-full size-[40px] flex items-center justify-center cursor-pointer transition-colors z-10"
            >
              <ChevronRight className="size-5 text-white" />
            </button>

            {/* Thumbnail strip */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-[8px]" onClick={(e) => e.stopPropagation()}>
              {productImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => setMainImage(i)}
                  className={`size-[56px] rounded-[12px] overflow-hidden cursor-pointer transition-all ${mainImage === i ? "ring-2 ring-white scale-110" : "opacity-60 hover:opacity-100"}`}
                >
                  <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2">
              <span className={`${font} text-[14px] text-white bg-black/40 px-3 py-1 rounded-full`}>
                {(mainImage % productImages.length) + 1} / {productImages.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}