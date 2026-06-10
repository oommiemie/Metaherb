import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useProducts } from "../store/ProductsContext";
import { useBanners } from "../store/BannersContext";
import { useCategories } from "../store/CategoriesContext";
import { getCategoryIcon } from "../data/categoryIcons";
import { useRecentlyViewed } from "../store/RecentlyViewedContext";
import { useWishlist } from "../store/WishlistContext";
import { useLanguage } from "../store/LanguageContext";
import {
  Star,
  ChevronRight,
  ChevronLeft,
  Clock,
  Play,
  Heart,
  Zap,
  Eye,
  Leaf, UtensilsCrossed, Pill, Sparkles, Flower2, Gift, Coffee, FlaskConical, Droplets,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";
import { BannerSkeleton, CategorySkeleton, ProductGridSkeleton, ArticleSkeleton, VideoSkeleton } from "../components/Skeleton";
import svgPaths from "../../imports/svg-7w99agzzp8";
import svgArticlePaths from "../../imports/svg-ef1ajdelip";
import imgBanner from "figma:asset/8733913171c15098e7d05ed46e3984edcb6d5ed1.png";
import imgPromoSongkran from "../../assets/sec-banner-pro-songkran.jpg";
import imgFlashSale2 from "../../assets/flashsale-2.jpg";
import { productImages, getProductImage } from "../data/productImages";
import { MATERIALS } from "../data/herbalMaterials";
import { TRIAL_PRODUCTS } from "../data/trialProducts";
import { TrialCard } from "../components/TrialCard";
import { Store, BadgeCheck } from "lucide-react";

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

const SAFE_IMAGES = [
  "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?w=600&q=80", // herbal tea
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?w=600&q=80", // coffee drip
  "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?w=600&q=80", // honey jar
  "https://images.unsplash.com/photo-1740592754365-2117f5977528?w=600&q=80", // turmeric capsule
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=600&q=80", // coconut oil
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?w=600&q=80", // dried herbs
  "https://images.unsplash.com/photo-1558429773-0d5084b445aa?w=600&q=80",    // jam
  "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?w=600&q=80", // aloe vera
  "https://images.unsplash.com/photo-1765850257647-811b8d3c20ca?w=600&q=80", // olive oil
  "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?w=600&q=80", // essential oil
  "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?w=600&q=80", // amla dried
];
const flashSaleImages = productImages.length >= 8 ? productImages.slice(2, 8) : SAFE_IMAGES.slice(2, 8);

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
    <div className="flex items-center gap-[4px]">
      {[h, m, s].map((t, i) => (
        <div key={i} className="flex items-center gap-[4px]">
          <div className="rounded-[4px] size-[18px] flex items-center justify-center" style={{ backgroundImage: "linear-gradient(90deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.2) 100%), linear-gradient(#e62e05 0%, #bc1b06 100%)" }}>
            <span className={`${font} text-[10px] text-white tabular-nums`} style={{ fontWeight: 700 }}>{t}</span>
          </div>
          {i < 2 && <span className={`${font} text-[11px] text-white`}>:</span>}
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
  const { t } = useLanguage();
  const wishlisted = isWishlisted(product.id);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100 min-w-[180px] group"
    >
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
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
                ? t("pd_removed_from_wishlist")
                : t("pd_added_to_wishlist"),
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
  // Pull active hero banners from the live admin store — admin add/edit/delete
  // in /admin/content → Banner reflects here immediately.
  const { activeByPosition } = useBanners();
  const heroBanners = activeByPosition("hero");
  const banners = heroBanners.length > 0
    ? heroBanners.map((b) => b.image)
    : ["https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=1600&q=80"];

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Reset to first slide if banner list shrinks
  useEffect(() => {
    if (currentBanner >= banners.length) setCurrentBanner(0);
  }, [banners.length, currentBanner]);

  return (
    <div className="group relative rounded-[16px] overflow-hidden w-full h-full bg-[#faf8f5]">
      {/* Slides */}
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
      {/* Fallback fixed-aspect image to drive height when parent has no aspect — same 775/160 stripe on every viewport. */}
      <div className="invisible aspect-[775/160] w-full" />
      {/* Dots */}
      <div className="absolute bottom-[14px] left-1/2 -translate-x-1/2 flex gap-1.5">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentBanner(i)}
            className={`rounded-full cursor-pointer transition-all ${i === currentBanner ? "w-6 h-2 bg-white" : "size-2 bg-white/60"}`}
          />
        ))}
      </div>
      {/* Arrows — Figma style: 32px circle, light bg, backdrop blur */}
      <button
        onClick={() => setCurrentBanner((p) => (p - 1 + banners.length) % banners.length)}
        className="absolute left-[20px] top-1/2 -translate-y-1/2 size-8 bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronLeft className="size-5" strokeWidth={2.4} />
      </button>
      <button
        onClick={() => setCurrentBanner((p) => (p + 1) % banners.length)}
        className="absolute right-[20px] top-1/2 -translate-y-1/2 size-8 bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] rounded-full flex items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-200"
      >
        <ChevronRight className="size-5" strokeWidth={2.4} />
      </button>
    </div>
  );
}

/* ===== Home Page ===== */
/* ===== Categories row — paginates to match the admin preview's 4/6/9 logic ===== */
function useResponsivePerPage(): number {
  const [perPage, setPerPage] = useState<number>(() => {
    if (typeof window === "undefined") return 9;
    if (window.innerWidth < 640) return 4;
    if (window.innerWidth < 1024) return 6;
    return 9;
  });
  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setPerPage(w < 640 ? 4 : w < 1024 ? 6 : 9);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return perPage;
}

/** Page size for product rows on Home (Recommended / Flash Sale) — mirrors the
 * grid: 2 mobile, 3 sm, 4 md, 6 lg. Phones now show one row of 2 then ▸. */
function useProductsPerPage(): number {
  const compute = () => {
    if (typeof window === "undefined") return 6;
    const w = window.innerWidth;
    if (w < 640)  return 2;
    if (w < 768)  return 3;
    if (w < 1024) return 4;
    return 6;
  };
  const [perPage, setPerPage] = useState<number>(compute);
  useEffect(() => {
    const onResize = () => setPerPage(compute());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return perPage;
}

function CategoryRow({
  categories, page, setPage, onPick,
}: {
  categories: Array<{ id: string; name: string; iconKey: string; iconImage?: string; color: string }>;
  page: number;
  setPage: (n: number | ((p: number) => number)) => void;
  onPick: (name: string) => void;
}) {
  const perPage = useResponsivePerPage();
  const pageCount = Math.max(1, Math.ceil(categories.length / perPage));
  const safePage = Math.min(page, pageCount - 1);
  const pageCats = categories.slice(safePage * perPage, safePage * perPage + perPage);

  // Reset to first page if pageCount shrinks (e.g. admin hides categories)
  useEffect(() => {
    if (safePage !== page) setPage(safePage);
  }, [safePage, page, setPage]);

  if (categories.length === 0) return null;

  return (
    <div className="px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={safePage}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-evenly gap-3 sm:gap-4 py-3 px-4 sm:px-8 lg:px-12 w-full">
            {pageCats.map((cat) => {
              const Icon = getCategoryIcon(cat.iconKey);
              return (
                <button key={cat.id} onClick={() => onPick(cat.name)}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[64px] sm:min-w-[80px] cursor-pointer group shrink-0">
                  <div
                    className="size-[40px] sm:size-[56px] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-md overflow-hidden"
                    style={{ backgroundColor: `${cat.color}1a` }}>
                    {cat.iconImage ? (
                      <img src={cat.iconImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon className="size-5" style={{ color: cat.color }} strokeWidth={1.8} />
                    )}
                  </div>
                  <span className={`${font} text-[11px] sm:text-[12px] text-gray-600 whitespace-nowrap transition-colors duration-300 group-hover:text-[#319754]`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
        {/* Prev arrow */}
        {safePage > 0 && (
          <button onClick={() => setPage((p) => Math.max(0, p - 1))}
            className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.6)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10"
            aria-label="Previous categories">
            <ChevronLeft className="size-5" strokeWidth={2.4} />
          </button>
        )}
        {/* Next arrow */}
        {safePage < pageCount - 1 && (
          <button onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.6)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10"
            aria-label="Next categories">
            <ChevronRight className="size-5" strokeWidth={2.4} />
          </button>
        )}
      </div>
    </div>
  );
}

export function HomePage() {
  const navigate = useNavigate();
  const { recentIds } = useRecentlyViewed();
  const { t } = useLanguage();
  const { products } = useProducts();
  const { activeCategories } = useCategories();
  const [loading, setLoading] = useState(true);
  const [recPage, setRecPage] = useState(0);
  const [catPage, setCatPage] = useState(0);
  const [recDirection, setRecDirection] = useState(0);
  const [promoPage, setPromoPage] = useState(0);
  const [promoDirection, setPromoDirection] = useState(0);
  const [flashPage, setFlashPage] = useState(0);
  const [flashDirection, setFlashDirection] = useState(0);
  const [videoPage, setVideoPage] = useState(0);
  const [videoDirection, setVideoDirection] = useState(0);
  const productsPerPage = useProductsPerPage();

  // Reset paging when viewport changes the page size (e.g. rotate to mobile
  // and the old page index falls off the end of the resized list).
  useEffect(() => { setRecPage(0); setFlashPage(0); setVideoPage(0); }, [productsPerPage]);

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
        <div className="px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6">
          <BannerSkeleton />
        </div>
        <div className="px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <CategorySkeleton />
        </div>
        <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[120px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              <div className="bg-gray-200 w-[80px] h-[14px] rounded-lg" />
            </div>
            <ProductGridSkeleton count={6} />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[160px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
              <div className="bg-gray-200 w-[80px] h-[14px] rounded-lg" />
            </div>
            <ProductGridSkeleton count={6} />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
          <div className="bg-white rounded-[16px] p-[16px]">
            <div className="flex items-center justify-between mb-[16px]">
              <div className="bg-gray-200 w-[120px] h-[20px] rounded-lg relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
            </div>
            <ArticleSkeleton />
          </div>
        </section>
        <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
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
      <div className="px-4 sm:px-6 lg:px-12 pt-4 sm:pt-6">
        <div className="flex flex-col lg:flex-row gap-[10px] w-full">
          <div className="min-w-0 lg:flex-[775_1_0%] lg:aspect-[775/160]">
            <BannerCarousel />
          </div>
          {/* Side promo banners — 2 cols on mobile/tablet, stacked on desktop */}
          <div className="grid grid-cols-2 gap-[10px] lg:flex lg:flex-col lg:flex-[230_1_0%] min-w-0">
            <div className="rounded-[16px] overflow-hidden flex-1 relative aspect-[230/75] lg:aspect-auto lg:min-h-0">
              <ImageWithFallback
                src={imgPromoSongkran}
                alt="โปรโมชั่นสงกรานต์"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="rounded-[16px] overflow-hidden flex-1 relative aspect-[230/75] lg:aspect-auto lg:min-h-0">
              <ImageWithFallback
                src={imgFlashSale2}
                alt="Flash Sale"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories — driven by admin CategoriesContext, paginated to match the admin preview:
          mobile 4 / tablet 6 / desktop 9 per page, with prev/next arrows when overflow */}
      <CategoryRow categories={activeCategories} page={catPage} setPage={setCatPage} onPick={(name) => navigate(`/products?category=${name}`)} />

      {/* Recommended Products */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("home_recommended")}</p>
            <button onClick={() => navigate("/products")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          {/* Product Grid */}
          {(() => {
            const recProducts = products.filter(p => !p.isFlashSale && (p.isRecommended || p.discountPercent));
            const totalRecPages = Math.max(1, Math.ceil(recProducts.length / productsPerPage));
            const pagedProducts = recProducts.slice(recPage * productsPerPage, recPage * productsPerPage + productsPerPage);
            return (
            <div className="group relative overflow-x-clip py-2 -my-2">
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
                const globalIdx = recPage * productsPerPage + i;
                const tag = getProductTag(p);
                return (
                  <div
                    key={`rec-${p.id}`}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group/card"
                  >
                    <div className="flex-1 relative min-h-0 overflow-hidden">
                      <img src={getProductImage(p.id)} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                      {/* Single Tag - priority: flashsale > discount > recommended */}
                      {tag === "flashsale" && (
                        <>
                          <div className="absolute top-0 right-0 p-[6px]">
                            <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                              <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_discount_prefix")} {p.discountPercent}%</span>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 backdrop-blur-[4px] bg-[rgba(230,46,5,0.8)] flex gap-[6px] items-center justify-center px-[10px] py-[6px] rounded-tr-[12px]">
                            <span className={`${font} text-[11px] text-white`} style={{ fontWeight: 600 }}>Flash Sale</span>
                            <MiniCountdown initialSeconds={p.flashSaleEndsIn || 3600} />
                          </div>
                        </>
                      )}
                      {tag === "discount" && (
                        <div className="absolute top-0 right-0 p-[6px]">
                          <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                            <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_discount_prefix")} {p.discountPercent}%</span>
                          </div>
                        </div>
                      )}
                      {tag === "recommended" && (
                        <div className="absolute top-0 right-0 p-[6px]">
                          <div className="bg-[#319754] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(49,151,84,0.4)]">
                            <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_recommended_tag")}</span>
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
              <button onClick={() => { setRecDirection(-1); setRecPage(p => p - 1); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                <ChevronLeft className="size-5" strokeWidth={2.4} />
              </button>
            )}
            {/* Right Arrow */}
            {recPage < totalRecPages - 1 && (
              <button onClick={() => { setRecDirection(1); setRecPage(p => p + 1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                <ChevronRight className="size-5" strokeWidth={2.4} />
              </button>
            )}
          </div>
            );
          })()}
        </div>
      </section>

      {/* Promotion Products */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("home_promotion")}</p>
            <button onClick={() => navigate("/products")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          {/* Product Grid */}
          {(() => {
            // Promotion = has discount, NOT flash sale, NOT recommended (those already shown above)
            const promoProducts = products.filter(p => !p.isFlashSale && !p.isRecommended && p.discountPercent);
            const totalPromoPages = Math.max(1, Math.ceil(promoProducts.length / productsPerPage));
            const pagedProducts = promoProducts.slice(promoPage * productsPerPage, promoPage * productsPerPage + productsPerPage);
            return (
            <div className="group relative overflow-x-clip py-2 -my-2">
            <AnimatePresence mode="wait" initial={false} custom={promoDirection}>
            <motion.div
              key={promoPage}
              custom={promoDirection}
              initial={{ x: promoDirection > 0 ? 300 : -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: promoDirection > 0 ? -300 : 300, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]"
              style={{ backgroundColor: "transparent" }}
            >
              {pagedProducts.map((p, i) => {
                const globalIdx = promoPage * productsPerPage + i;
                return (
                  <div
                    key={`promo-${p.id}`}
                    onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group/card"
                  >
                    <div className="flex-1 relative min-h-0 overflow-hidden">
                      <img src={getProductImage(p.id)} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                      <div className="absolute top-0 right-0 p-[6px]">
                        <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_discount_prefix")} {p.discountPercent}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-[10px] flex flex-col gap-[4px]">
                      <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                      <div className="flex items-center gap-[10px]">
                        <span className={`font-['IBM_Plex_Sans_Thai_Looped',sans-serif] text-[14px] text-[#e62e05]`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
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
            {promoPage > 0 && (
              <button onClick={() => { setPromoDirection(-1); setPromoPage(p => p - 1); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                <ChevronLeft className="size-5" strokeWidth={2.4} />
              </button>
            )}
            {promoPage < totalPromoPages - 1 && (
              <button onClick={() => { setPromoDirection(1); setPromoPage(p => p + 1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                <ChevronRight className="size-5" strokeWidth={2.4} />
              </button>
            )}
          </div>
            );
          })()}
        </div>
      </section>

      {/* Flash Sale */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[10px]">
              <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("home_flash_sale")}</p>
              <FlashSaleCountdown />
            </div>
            <button onClick={() => navigate("/products")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          {/* Flash Sale Grid */}
          {(() => {
            const flashProducts = products.filter(p => p.isFlashSale);
            const totalFlashPages = Math.max(1, Math.ceil(flashProducts.length / productsPerPage));
            const pagedFlash = flashProducts.slice(flashPage * productsPerPage, flashPage * productsPerPage + productsPerPage);
            return (
          <div className="group relative overflow-x-clip py-2 -my-2">
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
                const globalIdx = flashPage * productsPerPage + i;
                return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#e62e05]/40 transition-all duration-300 flex flex-col h-[259px] group/card"
                >
                  {/* Image */}
                  <div className="flex-1 relative min-h-0 overflow-hidden">
                    <img src={flashSaleImages[globalIdx % flashSaleImages.length]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                    {/* Discount tag top-right */}
                    <div className="absolute top-0 right-0 p-[6px]">
                      <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                        <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_discount_prefix")} {p.discountPercent}%</span>
                      </div>
                    </div>
                    {/* Flash Sale badge bottom-left with countdown */}
                    <div className="absolute bottom-0 left-0 backdrop-blur-[4px] bg-[rgba(230,46,5,0.8)] flex gap-[6px] items-center justify-center px-[10px] py-[6px] rounded-tr-[12px]">
                      <span className={`${font} text-[11px] text-white`} style={{ fontWeight: 600 }}>Flash Sale</span>
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
              <button onClick={() => { setFlashDirection(-1); setFlashPage(p => p - 1); }}
                className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                <ChevronLeft className="size-5" strokeWidth={2.4} />
              </button>
            )}
            {/* Right Arrow */}
            {flashPage < totalFlashPages - 1 && (
              <button onClick={() => { setFlashDirection(1); setFlashPage(p => p + 1); }}
                className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                <ChevronRight className="size-5" strokeWidth={2.4} />
              </button>
            )}
          </div>
            );
          })()}
        </div>
      </section>

      {/* === Herbal Market (B2B) === */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                <Store className="size-4.5 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div>
                <p className={`${font} text-[20px] text-black leading-tight`} style={{ fontWeight: 500 }}>ตลาดสมุนไพร</p>
                <p className={`${font} text-[11px] text-gray-500`}>วัตถุดิบสมุนไพรคุณภาพสำหรับผู้ผลิต B2B</p>
              </div>
            </div>
            <button onClick={() => navigate("/market")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
            {MATERIALS.slice(0, 6).map((m) => (
              <div key={m.id} onClick={() => navigate(`/market/${m.id}`)}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 group cursor-pointer">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  <ImageWithFallback src={m.image} alt={m.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  {m.supplierVerified && (
                    <div className="absolute top-2.5 right-2.5 bg-white rounded-full p-1 shadow-sm" title="Verified Supplier">
                      <BadgeCheck className="size-4 text-[#319754]" fill="#319754" stroke="#fff" strokeWidth={2.5} />
                    </div>
                  )}
                  <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                    <span className={`${font} text-[10px] text-white`}>คงเหลือ {m.stock.toLocaleString()} กก.</span>
                  </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-3 flex flex-col gap-2">
                  <div>
                    <h3 className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{m.name}</h3>
                    {/* Supplier (replaces scientific name) — trial-card studio dot style */}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="size-1.5 rounded-full bg-[#319754] shrink-0" />
                      <span className={`${font} text-[12px] text-gray-500 truncate`}>{m.supplier}</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between bg-[#fafafa] rounded-lg px-2.5 py-1.5">
                    <div>
                      <p className={`${font} text-[10px] text-gray-500`}>ราคา/กก.</p>
                      <p className={`${font} text-[18px] text-[#319754]`} style={{ fontWeight: 700 }}>฿{m.pricePerKg.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`${font} text-[10px] text-gray-500`}>MOQ</p>
                      <p className={`${font} text-[13px] text-black`} style={{ fontWeight: 600 }}>{m.moq} กก.</p>
                    </div>
                  </div>

                  {/* Rating + sold row — standard product-card layout */}
                  <div className="flex items-center justify-between mt-auto pt-1">
                    <div className="flex items-center gap-1">
                      <Star className="size-3.5" fill="#f59e0b" strokeWidth={0} />
                      <span className={`${font} text-[11px] text-black tabular-nums`} style={{ fontWeight: 500 }}>{m.rating}/5</span>
                    </div>
                    <span className={`${font} text-[10px] text-gray-500`}>
                      ขายแล้ว {Math.floor(m.stock * (m.rating / 5) * 0.45).toLocaleString()} กก.
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* === Trial Products === */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-2.5">
              <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                <FlaskConical className="size-4.5 text-[#319754]" strokeWidth={2.2} />
              </div>
              <div>
                <p className={`${font} text-[20px] text-black leading-tight`} style={{ fontWeight: 500 }}>ผลิตภัณฑ์ทดสอบ</p>
                <p className={`${font} text-[11px] text-gray-500`}>ทดลองสินค้าฟรี — แลกรีวิวสะสมแต้ม</p>
              </div>
            </div>
            <button onClick={() => navigate("/trials")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
            {TRIAL_PRODUCTS.slice(0, 6).map((p, i) => (
              <TrialCard key={p.id} p={p} index={i} onOpen={() => navigate(`/trials/${p.id}`)} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Viewed - Shopee style */}
      {recentProducts.length > 0 && (
        null
      )}

      {/* Articles */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("home_articles")}</p>
            <button onClick={() => navigate("/blog")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
            {[
              { img: SAFE_IMAGES[3], title: "ขมิ้นชัน — ราชาแห่งสมุนไพรไทย ลดอักเสบช่วยตับ", desc: "รวมงานวิจัยล่าสุดเรื่องสาร Curcumin ช่วยลดการอักเสบและฟื้นฟูตับ พร้อมวิธีบริโภคให้ได้ประโยชน์สูงสุด", views: 1248 },
              { img: SAFE_IMAGES[5], title: "ฟ้าทะลายโจร ทางเลือกธรรมชาติเสริมภูมิต้านทาน", desc: "ข้อมูลทางเภสัชกรรมเรื่อง Andrographolide กับการลดไข้ บรรเทาหวัด พร้อมข้อควรระวัง", views: 892 },
              { img: SAFE_IMAGES[0], title: "ชาเก๊กฮวยกับการบำรุงสายตาและลดความร้อนในร่างกาย", desc: "วิธีชงชาเก๊กฮวยให้หอม ดื่มในช่วงเวลาที่เหมาะ และคู่กับสมุนไพรอื่นเพื่อสุขภาพตา-ตับ", views: 654 },
            ].map((a, i) => (
              <div
                key={i}
                className="bg-white rounded-[16px] border border-[#d4d4d4] h-auto sm:h-[180px] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#af6f08]/40 transition-all duration-300 group"
                onClick={() => navigate(`/blog/${i + 1}`)}
              >
                <div className="flex flex-col sm:flex-row items-stretch h-full">
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
                  <div className="flex-1 flex flex-col gap-[8px] p-[14px] min-w-0">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }} title={a.title}>{a.title}</p>
                    <p className={`${font} text-[12px] text-[#737373] line-clamp-3`}>{a.desc}</p>
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(`/blog/${i + 1}`); }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#af6f08]/10 text-[#af6f08] group-hover:bg-[#af6f08] group-hover:text-white cursor-pointer transition-all duration-200 self-start mt-auto ${font} text-[12px]`}
                      style={{ fontWeight: 500 }}
                    >
                      {t("blog_read_more")}
                      <ChevronRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Videos */}
      <section className="px-4 sm:px-6 lg:px-12 pb-6 sm:pb-8">
        <div className="bg-white rounded-[16px] p-[16px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-[16px]">
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("home_videos")}</p>
            <button onClick={() => navigate("/blog")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
              <span className={`${font} text-[12px]`}>{t("common_view_all")}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
          {/* Video Grid — paginated to match Recommended / Flash Sale (2 per page on mobile) */}
          {(() => {
            const videos = [
              { img: SAFE_IMAGES[9],  views: "12K", title: "ทำน้ำมันสมุนไพรทาแก้ปวดเมื่อยจาก 5 สมุนไพรหาง่าย" },
              { img: SAFE_IMAGES[2],  views: "15K", title: "เปิดสวนน้ำผึ้งดอกลำไย จ.ลำพูน บุกถึงต้นรัง" },
              { img: SAFE_IMAGES[4],  views: "9K",  title: "วิธีคั้นน้ำขิงสด ดื่มอุ่นๆ บรรเทาหวัด" },
              { img: SAFE_IMAGES[0],  views: "20K", title: "ชาคาโมมายล์ — ชงให้หอม ผ่อนคลาย หลับสนิท" },
              { img: SAFE_IMAGES[10], views: "25K", title: "5 สูตรน้ำสมุนไพรดื่มแล้วผิวใส" },
              { img: SAFE_IMAGES[7],  views: "30K", title: "ตำรับยาสมุนไพรไทยโบราณ ที่หลวงปู่ส่งต่อกันมา" },
            ];
            const totalVideoPages = Math.max(1, Math.ceil(videos.length / productsPerPage));
            const pagedVideos = videos.slice(videoPage * productsPerPage, videoPage * productsPerPage + productsPerPage);
            return (
              <div className="group relative overflow-x-clip py-2 -my-2">
                <AnimatePresence mode="wait" initial={false} custom={videoDirection}>
                  <motion.div
                    key={videoPage}
                    custom={videoDirection}
                    initial={{ x: videoDirection > 0 ? 300 : -300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: videoDirection > 0 ? -300 : 300, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
                    {pagedVideos.map((v, i) => (
                      <div
                        key={`vid-${videoPage}-${i}`}
                        className="relative h-[180px] sm:h-[259px] rounded-[16px] overflow-hidden cursor-pointer group/card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                      >
                        <img src={v.img} alt={v.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                        <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/20 transition-colors duration-300" />
                        <div className="relative flex flex-col items-start justify-between p-[10px] h-full">
                          <div className="bg-black/50 flex items-center gap-[10px] px-[12px] py-[4px] rounded-[100px]">
                            <svg className="size-[12px] shrink-0" fill="none" viewBox="0 0 12 12.2116">
                              <path d={svgArticlePaths.p450bbc0} fill="white" />
                            </svg>
                            <span className={`${font} text-[12px] text-white`}>{v.views}</span>
                          </div>
                          <div className="bg-black/50 rounded-[100px] w-full">
                            <div className="flex items-center justify-center px-[12px] py-[4px]">
                              <span className={`${font} text-[12px] text-white truncate`}>{v.title}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
                {/* Left Arrow */}
                {videoPage > 0 && (
                  <button onClick={() => { setVideoDirection(-1); setVideoPage(p => p - 1); }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                    <ChevronLeft className="size-5" strokeWidth={2.4} />
                  </button>
                )}
                {/* Right Arrow */}
                {videoPage < totalVideoPages - 1 && (
                  <button onClick={() => { setVideoDirection(1); setVideoPage(p => p + 1); }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 size-8 rounded-full bg-[rgba(217,217,217,0.5)] backdrop-blur-[2px] hover:bg-[#319754] flex items-center justify-center text-white cursor-pointer transition-all duration-200 z-10">
                    <ChevronRight className="size-5" strokeWidth={2.4} />
                  </button>
                )}
              </div>
            );
          })()}
        </div>
      </section>

      {/* Daily Discover - Shopee style infinite scroll feel */}
      
    </div>
  );
}