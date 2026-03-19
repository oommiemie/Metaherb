import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { products, categories } from "../data/products";
import { useRecentlyViewed } from "../store/RecentlyViewedContext";
import { useWishlist } from "../store/WishlistContext";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  Clock,
  Play,
  Heart,
  Zap,
  Eye,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { BannerSkeleton, CategorySkeleton, ProductGridSkeleton, ArticleSkeleton, VideoSkeleton } from "../components/Skeleton";
import svgPaths from "../../imports/svg-7w99agzzp8";
import svgArticlePaths from "../../imports/svg-ef1ajdelip";
import imgBanner from "figma:asset/8733913171c15098e7d05ed46e3984edcb6d5ed1.png";

// Category icons from Figma
import imgHerb from "figma:asset/73e2cbf5354624aa57506e53de4958d0acf61e55.png";
import imgFood from "figma:asset/35f1f2bd409f81e3d72289ecac4b9bc3cc34d7b6.png";
import imgMedical from "figma:asset/625cc9829942de5a02800999aa5375f3dfbce950.png";
import imgAroma from "figma:asset/5b19655efb6ef5fd2e60a46a152a5eb5100edc3f.png";
import imgCosmetics from "figma:asset/6b71d96b7be0711a2b1cc5cd7642df1b6151beb7.png";
import imgGiftset from "figma:asset/0245085f47577fbc875a74b855a3020b7aa08a5e.png";
import imgService from "figma:asset/f62932d9a24d6ab415c2398b7417bd6cfd1bd20b.png";
import imgPromotion from "figma:asset/07ea732e7ecef0dcc2354d93351d751935e677dc.png";
import imgCoupon from "figma:asset/d6128665f182afeedbe7e125d6ad967a5a403056.png";

import imgBanner2 from "figma:asset/4721591e5972943ca6e23ff8a44bd578469180c5.png";
import imgBanner3 from "figma:asset/dca3bac6bd59c39ad70423824125bb4ea2fa637f.png";
import imgBanner4 from "figma:asset/ca4d3bffba8755731976ce33869784bb158dc884.png";
import imgBannerSmall1 from "figma:asset/316bc7b9bfba1a55e8129d1fa82ad307b21dbd00.png";
import imgBannerSmall2 from "figma:asset/03190bf4a35bdd38096555df5b535d77200444ae.png";
import imgArticle1 from "figma:asset/51e11fdedae888e644826410f8d7038f1bbaf2e6.png";
import imgArticle2 from "figma:asset/ca947bfdf5c8f7c7177ecee869d4bbb6fa74e2e0.png";
import imgArticle3 from "figma:asset/eaf91e3dbd420033f1f9e5d7e3813e02f9603e18.png";
import imgVideo1 from "figma:asset/14107b7d6d71a9a8d6e441ef2a495f92de9863e7.png";
import imgVideo2 from "figma:asset/bb3fb70f833c2d436a3fd0469bfbb0e529216bf4.png";
import imgVideo3 from "figma:asset/686343836a80ce937c02210c662664e79d865faa.png";
import imgVideo4 from "figma:asset/e47b7867b8fbbe44bc111e7bd3bca89b5d7594ef.png";
import imgVideo5 from "figma:asset/efc9e75e31f37f69777ef2a5a8184920a4d4336b.png";
import imgVideo6 from "figma:asset/0ac5833739c6ef2f69f7a15e8873667fece676d0.png";
import imgProd1 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgProd2 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgProd3 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgProd4 from "figma:asset/2760a63146309433afbbc9a2171f4189dfd27e07.png";
import imgProd5 from "figma:asset/623849f160a45efb31fada62d7efbfb3f3bab60f.png";
import imgProd6 from "figma:asset/b251ac55d2f44764962036699fe6da4d05a98501.png";
import imgProd7 from "figma:asset/e7525da64fe7486e2a900960a61c8ad250738010.png";
import imgFlash1 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgFlash2 from "figma:asset/e7525da64fe7486e2a900960a61c8ad250738010.png";
import imgFlash3 from "figma:asset/029873ff49320a6f5af1e12fd34f70a07c967725.png";
import imgFlash4 from "figma:asset/27fca0d1af058b58247ddfdf46b087a282b1cfb8.png";
import imgFlash5 from "figma:asset/5bc8d7108fc61631d06b43324727fd6c7dfe5d04.png";
import imgFlash6 from "figma:asset/9633ae9d3c56aaa84d693d60a12798ecff97ff73.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

const productImages = [
  imgProd1,
  imgProd2,
  imgProd3,
  imgProd4,
  imgProd5,
  imgProd6,
  imgProd7,
];
const flashSaleImages = [
  imgFlash1,
  imgFlash2,
  imgFlash3,
  imgFlash4,
  imgFlash5,
  imgFlash6,
];

/* ===== Flash Sale Countdown ===== */
function FlashSaleCountdown() {
  const [time, setTime] = useState({ h: 12, m: 13, s: 8 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 23;
          m = 59;
          s = 59;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center gap-[4px]">
      {[pad(time.h), pad(time.m), pad(time.s)].map((t, i) => (
        <div key={i} className="flex items-center gap-[4px]">
          <div className="bg-gradient-to-b from-[#e62e05] to-[#bc1b06] rounded-[8px] w-[32px] py-[4px] flex items-center justify-center">
            <span className={`${font} text-[16px] text-white`} style={{ fontWeight: 600 }}>{t}</span>
          </div>
          {i < 2 && <span className={`${font} text-[16px] text-black`}>:</span>}
        </div>
      ))}
    </div>
  );
}

/* ===== Mini Countdown for card ===== */
function MiniCountdown({ initialSeconds }: { initialSeconds: number }) {
  const [sec, setSec] = useState(initialSeconds);
  useEffect(() => {
    const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  const h = String(Math.floor(sec / 3600)).padStart(2, "0");
  const m = String(Math.floor((sec % 3600) / 60)).padStart(2, "0");
  const s = String(sec % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-[3px]">
      {[h, m, s].map((t, i) => (
        <div key={i} className="flex items-center gap-[3px]">
          <div className="rounded-[3px] size-[12px] flex items-center justify-center" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), linear-gradient(#e62e05 0%, #bc1b06 100%)" }}>
            <span className={`${font} text-[6px] text-white`} style={{ fontWeight: 700 }}>{t}</span>
          </div>
          {i < 2 && <span className={`${font} text-[8px] text-white`}>:</span>}
        </div>
      ))}
    </div>
  );
}

/* ===== Tag helpers ===== */
type TagType = "flashsale" | "discount" | "recommended" | null;
function getProductTag(p: { isFlashSale?: boolean; discountPercent?: number; isRecommended?: boolean }): TagType {
  if (p.isFlashSale) return "flashsale";
  if (p.discountPercent) return "discount";
  if (p.isRecommended) return "recommended";
  return null;
}

/* ===== Coupon Icon ===== */
function CouponIcon() {
  return (
    <svg className="w-[14px] h-[15px] shrink-0" fill="none" viewBox="0 0 14 15">
      <path d="M14 0H0V15H14V0Z" fill="#947005" opacity="0" />
      <path d={svgPaths.p1939b280} fill="#DF9723" />
    </svg>
  );
}

/* ===== Product Card ===== */
function ProductCard({
  product,
  image,
  onClick,
}: {
  product: (typeof products)[0];
  image: string;
  onClick: () => void;
}) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 min-w-[180px] group"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <ImageWithFallback
          src={image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {product.tag && (
          <span
            className={`absolute top-2 left-2 bg-[#319754] text-white text-[10px] px-2 py-0.5 rounded ${font}`}
          >
            {product.tag}
          </span>
        )}
        {product.discount && (
          <span
            className={`absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] px-2 py-0.5 rounded ${font}`}
          >
            {product.discount}
          </span>
        )}
        {/* Wishlist heart */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
            toast(
              wishlisted
                ? "ลบออกจากสินค้าที่ชอบแล้ว"
                : "เพิ่มในสินค้าที่ชอบแล้ว ❤️",
            );
          }}
          className="absolute bottom-2 right-2 size-7 bg-white/90 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
        >
          <Heart
            className={`size-3.5 ${wishlisted ? "fill-[#ff383c] text-[#ff383c]" : "text-gray-400"}`}
          />
        </button>
      </div>
      <div className="p-3">
        <p
          className={`${font} text-[13px] text-gray-800 truncate`}
        >
          {product.name}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`${font} text-[14px] text-[#319754]`}
            style={{ fontWeight: 600 }}
          >
            ฿ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span
              className={`${font} text-[11px] text-gray-400 line-through`}
            >
              ฿{product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <div className="flex items-center gap-1">
            <Star className="size-3 fill-[#f7931d] text-[#f7931d]" />
            <span
              className={`${font} text-[11px] text-gray-500`}
            >
              {product.rating}
            </span>
          </div>
          <span className={`${font} text-[11px] text-gray-400`}>
            {product.sold}
          </span>
        </div>
        {/* Progress bar for flash sale items */}
        {product.discount && (
          <div className="mt-1.5">
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ee4d2d] rounded-full"
                style={{ width: `${Math.random() * 60 + 30}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== Banner Carousel ===== */
function BannerCarousel() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const banners = [
    imgBanner,
    imgBanner2,
    imgBanner3,
    imgBanner4,
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden bg-[#faf8f5]">
      {/* First image as layout driver */}
      <ImageWithFallback
        src={banners[0]}
        alt="Banner"
        className="w-full h-auto block invisible"
      />
      {/* Overlay all banners */}
      {banners.map((b, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-700 ${i === currentBanner ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ImageWithFallback
            src={b}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentBanner(i)}
            className={`rounded-full cursor-pointer transition-all ${i === currentBanner ? "w-6 h-2 bg-white" : "size-2 bg-white/50"}`}
          />
        ))}
      </div>
      {/* Arrows */}
      <button
        onClick={() =>
          setCurrentBanner(
            (p) => (p - 1 + banners.length) % banners.length,
          )
        }
        className="absolute left-2 top-1/2 -translate-y-1/2 size-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        onClick={() =>
          setCurrentBanner((p) => (p + 1) % banners.length)
        }
        className="absolute right-2 top-1/2 -translate-y-1/2 size-8 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white cursor-pointer"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

/* ===== Home Page ===== */
export function HomePage() {
  const navigate = useNavigate();
  const { recentIds } = useRecentlyViewed();
  const [loading, setLoading] = useState(true);
  const [recPage, setRecPage] = useState(0);
  const [recDirection, setRecDirection] = useState(0);
  const [flashPage, setFlashPage] = useState(0);
  const [flashDirection, setFlashDirection] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const recentProducts = recentIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as typeof products;

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto">
        <div className="px-4 sm:px-6 lg:px-[124px] pt-4 sm:pt-6">
          <BannerSkeleton />
        </div>
        <div className="px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
          <CategorySkeleton />
        </div>
        <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[120px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              <div className="bg-gray-200 w-[80px] h-[14px] rounded-lg" />
            </div>
            <ProductGridSkeleton count={6} />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[160px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              <div className="bg-gray-200 w-[80px] h-[14px] rounded-lg" />
            </div>
            <ProductGridSkeleton count={6} />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[120px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
            </div>
            <ArticleSkeleton />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[120px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
            </div>
            <VideoSkeleton />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto">
      {/* Banner */}
      <div className="px-4 sm:px-6 lg:px-[124px] pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-[10px] w-full">
          <div className="min-w-0 lg:flex-[73_1_0%]">
            <BannerCarousel />
          </div>
          <div className="hidden lg:flex flex-col gap-[10px] lg:flex-[27_1_0%] min-w-0">
            <div className="rounded-[16px] overflow-hidden flex-1 relative min-h-0">
              <ImageWithFallback
                src={imgBannerSmall1}
                alt="Promo"
                className="absolute inset-0 w-full h-full object-fill"
              />
            </div>
            <div className="rounded-[16px] overflow-hidden flex-1 relative min-h-0">
              <ImageWithFallback
                src={imgBannerSmall2}
                alt="Promo"
                className="absolute inset-0 w-full h-full object-fill"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        <div className="flex items-center justify-center gap-3 sm:gap-4 overflow-x-auto pb-2 scrollbar-hide w-full">
          {([
            { name: "สมุนไพร", img: imgHerb },
            { name: "อาหาร", img: imgFood },
            { name: "ยา", img: imgMedical },
            { name: "เครื่องหอม", img: imgAroma },
            { name: "ความสวย", img: imgCosmetics },
            { name: "ชุดของขวัญ", img: imgGiftset },
            { name: "บริการ", img: imgService },
            { name: "โปรโมชั่น", img: imgPromotion },
            { name: "คูปอง", img: imgCoupon },
          ]).map((cat) => (
            <button
              key={cat.name}
              onClick={() =>
                navigate(cat.name === "คูปอง" ? "/coupons" : `/products?category=${cat.name}`)
              }
              className={`flex flex-col items-center gap-1.5 sm:gap-2 min-w-[64px] sm:min-w-[80px] cursor-pointer group`}
            >
              <div className="size-[56px] sm:size-[72px] rounded-full bg-[#319754]/10 flex items-center justify-center group-hover:bg-[#319754]/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-[#319754]/20 overflow-hidden p-2">
                <ImageWithFallback src={cat.img} alt={cat.name} className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span
                className={`${font} text-[11px] sm:text-[12px] text-gray-600 whitespace-nowrap transition-colors duration-300 group-hover:text-[#319754]`}
              >
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Products - สินค้าแนะนำ */}
      <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>สินค้าแนะนำ</p>
            <button onClick={() => navigate("/products")} className="flex items-center gap-[10px] cursor-pointer">
              <span className={`${font} text-[12px] text-black`}>ดูทั้งหมด</span>
              <svg className="size-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgPaths.p31f27600} fill="black" opacity="0" />
                <path d={svgPaths.p249d7900} fill="black" />
              </svg>
            </button>
          </div>
          {/* Product Grid */}
          {(() => {
            const recProducts = products.filter(p => !p.isFlashSale && (p.isRecommended || p.discountPercent));
            const totalRecPages = Math.ceil(recProducts.length / 6);
            const pagedProducts = recProducts.slice(recPage * 6, recPage * 6 + 6);
            return (
            <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={recDirection}>
            <motion.div
              key={recPage}
              custom={recDirection}
              initial={{ x: recDirection > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: recDirection > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]"
              style={{ backgroundColor: "transparent" }}
            >
              {pagedProducts.map((p, i) => {
                const globalIdx = recPage * 6 + i;
                const tag = getProductTag(p);
                return (
                  <div
                    key={`rec-${p.id}`}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group"
                  >
                    <div className="flex-1 relative min-h-0 rounded-t-[16px] overflow-hidden">
                      <img src={productImages[globalIdx % productImages.length]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {/* Single Tag - priority: flashsale > discount > recommended */}
                      {tag === "flashsale" && (
                        <>
                          <div className="absolute top-0 right-0 p-[8px]">
                            <div className="bg-[#e62e05] px-[16px] py-[4px] rounded-[100px] border border-[#bc1b06]">
                              <span className={`${font} text-[12px] text-white whitespace-nowrap`}>ลด {p.discountPercent}%</span>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 backdrop-blur-[4px] bg-[rgba(230,46,5,0.8)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] rounded-tr-[8px]">
                            <span className={`${font} text-[8px] text-white`}>Flash Sale</span>
                            <MiniCountdown initialSeconds={p.flashSaleEndsIn || 3600} />
                          </div>
                        </>
                      )}
                      {tag === "discount" && (
                        <div className="absolute top-0 right-0 p-[8px]">
                          <div className="bg-[#e62e05] px-[16px] py-[4px] rounded-[100px] border border-[#bc1b06]">
                            <span className={`${font} text-[12px] text-white whitespace-nowrap`}>ลด {p.discountPercent}%</span>
                          </div>
                        </div>
                      )}
                      {tag === "recommended" && (
                        <div className="absolute top-0 right-0 p-[8px]">
                          <div className="bg-[#319754] px-[16px] py-[4px] rounded-[100px] border border-[#143c22]">
                            <span className={`${font} text-[12px] text-white whitespace-nowrap`}>สินค้าแนะนำ</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-[10px] flex flex-col gap-[4px]">
                      <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                      <div className="flex items-center gap-[10px]">
                        <span className={`font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[14px] ${p.discountPercent ? 'text-[#e62e05]' : 'text-[#226a3b]'}`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                        {p.originalPrice && (
                          <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[10px] text-[#a3a3a3] line-through">฿{p.originalPrice.toFixed(2)}</span>
                        )}
                        {p.hasCoupon && <CouponIcon />}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[8px]">
                          <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                            <path d="M14 0H0V14H14V0Z" fill="#F7C42B" opacity="0" />
                            <path d={svgPaths.p1052b000} fill="#F7C42B" />
                          </svg>
                          <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[10px] text-black">{p.rating}/5</span>
                        </div>
                        <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[10px] text-black text-right">{p.sold}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
            </AnimatePresence>
            {/* Left Arrow */}
            {recPage > 0 && (
            <button onClick={() => { setRecDirection(-1); setRecPage(p => p - 1); }} className="absolute left-0 top-1/2 -translate-y-1/2 size-[32px] rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-[rgba(217,217,217,0.8)] transition-colors z-10">
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgPaths.p31f27600} fill="black" opacity="0" />
                <path d={svgPaths.p1ec9ac00} fill="#737373" />
              </svg>
            </button>
            )}
            {/* Right Arrow */}
            {recPage < totalRecPages - 1 && (
            <button onClick={() => { setRecDirection(1); setRecPage(p => p + 1); }} className="absolute right-0 top-1/2 -translate-y-1/2 size-[32px] rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-[rgba(217,217,217,0.8)] transition-colors z-10">
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgPaths.p31f27600} fill="black" opacity="0" />
                <path d={svgPaths.p249d7900} fill="#737373" />
              </svg>
            </button>
            )}
          </div>
            );
          })()}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[10px]">
              <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>Flash Sale</p>
              <FlashSaleCountdown />
            </div>
            <button onClick={() => navigate("/products")} className="flex items-center gap-[10px] cursor-pointer">
              <span className={`${font} text-[12px] text-black`}>ดูทั้งหมด</span>
              <svg className="size-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgPaths.p31f27600} fill="black" opacity="0" />
                <path d={svgPaths.p249d7900} fill="black" />
              </svg>
            </button>
          </div>
          {/* Flash Sale Grid */}
          {(() => {
            const flashProducts = products.filter(p => p.isFlashSale);
            const totalFlashPages = Math.ceil(flashProducts.length / 6);
            const pagedFlash = flashProducts.slice(flashPage * 6, flashPage * 6 + 6);
            return (
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false} custom={flashDirection}>
            <motion.div
              key={flashPage}
              custom={flashDirection}
              initial={{ x: flashDirection > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: flashDirection > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]"
              style={{ backgroundColor: "transparent" }}
            >
              {pagedFlash.map((p, i) => {
                const globalIdx = flashPage * 6 + i;
                return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#e62e05]/40 transition-all duration-300 flex flex-col h-[259px] group"
                >
                  {/* Image */}
                  <div className="flex-1 relative min-h-0 rounded-t-[16px] overflow-hidden">
                    <img src={flashSaleImages[globalIdx % flashSaleImages.length]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {/* Discount tag top-right */}
                    <div className="absolute top-0 right-0 p-[8px]">
                      <div className="bg-[#e62e05] px-[16px] py-[4px] rounded-[100px] border border-[#bc1b06]">
                        <span className={`${font} text-[12px] text-white whitespace-nowrap`}>ลด {p.discountPercent}%</span>
                      </div>
                    </div>
                    {/* Flash Sale badge bottom-left with countdown */}
                    <div className="absolute bottom-0 left-0 backdrop-blur-[4px] bg-[rgba(230,46,5,0.8)] flex gap-[4px] items-center justify-center px-[8px] py-[4px] rounded-tr-[8px]">
                      <span className={`${font} text-[8px] text-white`}>Flash Sale</span>
                      <MiniCountdown initialSeconds={p.flashSaleEndsIn || 3600} />
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-[10px] flex flex-col gap-[4px]">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                    <div className="flex items-center gap-[10px]">
                      <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[14px] text-[#e62e05]" style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[10px] text-[#a3a3a3] line-through">฿{p.originalPrice.toFixed(2)}</span>
                      )}
                      {p.hasCoupon && <CouponIcon />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[8px]">
                        <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                          <path d="M14 0H0V14H14V0Z" fill="#F7C42B" opacity="0" />
                          <path d={svgPaths.p1052b000} fill="#F7C42B" />
                        </svg>
                        <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[10px] text-black">{p.rating}/5</span>
                      </div>
                      <span className="font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[10px] text-black text-right">{p.sold}</span>
                    </div>
                  </div>
                </div>
                );
              })}
            </motion.div>
            </AnimatePresence>
            {/* Left Arrow */}
            {flashPage > 0 && (
            <button onClick={() => { setFlashDirection(-1); setFlashPage(p => p - 1); }} className="absolute left-0 top-1/2 -translate-y-1/2 size-[32px] rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-[rgba(217,217,217,0.8)] transition-colors z-10">
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgPaths.p31f27600} fill="black" opacity="0" />
                <path d={svgPaths.p1ec9ac00} fill="#737373" />
              </svg>
            </button>
            )}
            {/* Right Arrow */}
            {flashPage < totalFlashPages - 1 && (
            <button onClick={() => { setFlashDirection(1); setFlashPage(p => p + 1); }} className="absolute right-0 top-1/2 -translate-y-1/2 size-[32px] rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-[rgba(217,217,217,0.8)] transition-colors z-10">
              <svg className="w-[20px] h-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgPaths.p31f27600} fill="black" opacity="0" />
                <path d={svgPaths.p249d7900} fill="#737373" />
              </svg>
            </button>
            )}
          </div>
            );
          })()}
        </div>
      </section>

      {/* Recently Viewed - Shopee style */}
      {recentProducts.length > 0 && (
        null
      )}

      {/* Articles */}
      <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>บทความแนะนำ</p>
            <button onClick={() => navigate("/blog")} className="flex items-center gap-[10px] cursor-pointer">
              <span className={`${font} text-[12px] text-black`}>ดูทั้งหมด</span>
              <svg className="size-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgArticlePaths.p31f27600} fill="black" opacity="0" />
                <path d={svgArticlePaths.p249d7900} fill="black" />
              </svg>
            </button>
          </div>
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
            {[
              { img: imgArticle1, title: "การใช้สมุนไพร", desc: "วิธีการใช้สมุนไพรเพื่อบรรเทาอาการเจ็บป่วย", views: 2 },
              { img: imgArticle2, title: "ดูดกัญชากันครับ", desc: "การใช้พืชสมุนไพรในการรักษาและทำอาหาร", views: 3 },
              { img: imgArticle3, title: "การเก็บเกี่ยวพืชสมุนไพร", desc: "เทคนิคในการเก็บเกี่ยวและรักษาคุณภาพพืชสมุนไพร", views: 4 },
            ].map((a, i) => (
              <div
                key={i}
                className="bg-white rounded-[16px] border border-[#d4d4d4] h-auto sm:h-[180px] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#af6f08]/40 transition-all duration-300 group"
                onClick={() => navigate("/blog")}
              >
                <div className="flex flex-col sm:flex-row items-start h-full">
                  {/* Image */}
                  <div className="relative h-[140px] sm:h-full shrink-0 w-full sm:w-[180px] overflow-hidden">
                    <img src={a.img} alt={a.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                      {/* View Count */}
                      <div className="bg-black/50 flex items-center gap-[10px] px-[12px] py-[4px] rounded-[100px]">
                        <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 12 12.2116">
                          <path d={svgArticlePaths.p450bbc0} fill="white" />
                        </svg>
                        <span className={`${font} text-[12px] text-white`}>{a.views}</span>
                      </div>
                      {/* Date */}
                      <div className="bg-black/50 flex items-center gap-[10px] px-[12px] py-[4px] rounded-[100px]">
                        <svg className="w-[10px] h-[9px] shrink-0" fill="none" viewBox="0 0 10 9">
                          <path d="M10 0H0V9H10V0Z" fill="white" opacity="0" />
                          <path d={svgArticlePaths.p20fb1c00} fill="white" />
                        </svg>
                        <span className={`${font} text-[12px] text-white`}>20 ก.พ. 2569</span>
                      </div>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-[8px] p-[14px] h-full min-w-0">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{a.title}</p>
                    <p className={`${font} text-[12px] text-[#737373] flex-1 overflow-hidden`} style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const }}>{a.desc}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate("/blog"); }}
                      className="bg-[#af6f08] flex items-center justify-center gap-[10px] px-[16px] py-[4px] rounded-[100px] w-[120px] cursor-pointer hover:bg-[#946008] transition-colors duration-200"
                    >
                      <span className={`${font} text-[12px] text-white`}>อ่านเพิ่มเติม</span>
                      <svg className="w-[8px] h-[12px] shrink-0" fill="none" viewBox="0 0 8 12">
                        <path d="M8 0H0V12H8V0Z" fill="white" opacity="0" />
                        <path d={svgArticlePaths.p1f1a0400} fill="white" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="px-4 sm:px-6 lg:px-[124px] pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>วีดีโอแนะนำ</p>
            <button onClick={() => navigate("/blog")} className="flex items-center gap-[10px] cursor-pointer">
              <span className={`${font} text-[12px] text-black`}>ดูทั้งหมด</span>
              <svg className="size-[20px]" fill="none" viewBox="0 0 20.2832 19.9316">
                <path d={svgArticlePaths.p31f27600} fill="black" opacity="0" />
                <path d={svgArticlePaths.p249d7900} fill="black" />
              </svg>
            </button>
          </div>
          {/* Video Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
            {[
              { img: imgVideo1, views: "12K", title: "บุกสวนทุเรียนจังหวัดจันทบุรี" },
              { img: imgVideo2, views: "15K", title: "ท่องเที่ยวชมทะเลที่จังหวัดตราด" },
              { img: imgVideo3, views: "9K", title: "ประเพณีลงแขกเกี่ยวข้าวที่ีสาน" },
              { img: imgVideo4, views: "20K", title: "ทริปปีนเขาดอยอินทนนท์" },
              { img: imgVideo5, views: "25K", title: "เดินป่าชมธรรมชาติที่เขาใหญ่" },
              { img: imgVideo6, views: "30K", title: "สัมผัสวัฒนธรรมพื้นบ้านที่เชียงใหม่" },
            ].map((v, i) => (
              <div
                key={i}
                className="relative h-[180px] sm:h-[259px] rounded-[16px] overflow-hidden cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <img src={v.img} alt={v.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                  {/* View Count */}
                  <div className="bg-black/50 flex items-center gap-[10px] px-[12px] py-[4px] rounded-[100px]">
                    <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 12 12.2116">
                      <path d={svgArticlePaths.p450bbc0} fill="white" />
                    </svg>
                    <span className={`${font} text-[12px] text-white`}>{v.views}</span>
                  </div>
                  {/* Title */}
                  <div className="bg-black/50 rounded-[100px] w-full">
                    <div className="flex items-center justify-center px-[12px] py-[4px]">
                      <span className={`${font} text-[12px] text-white truncate`}>{v.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Daily Discover - Shopee style infinite scroll feel */}
      
    </div>
  );
}