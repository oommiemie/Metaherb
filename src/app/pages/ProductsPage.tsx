import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useProducts } from "../store/ProductsContext";
import { Star, ChevronDown, RotateCcw, Heart, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useWishlist } from "../store/WishlistContext";
import { useLanguage } from "../store/LanguageContext";
import { toast } from "sonner";
import svgPaths from "../../imports/svg-7w99agzzp8";
import { FilterSkeleton, ProductGridSkeleton } from "../components/Skeleton";
import * as SliderPrimitive from "@radix-ui/react-slider";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const productImages = [
  "https://images.unsplash.com/photo-1610643625267-aee6dae3ca22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjB0ZWElMjBvcmdhbmljfGVufDF8fHx8MTc3MzgzMTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1599639932525-213272ff954b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwY29mZmVlJTIwZHJpcCUyMGJhZ3xlbnwxfHx8fDE3NzM4MzE0NzF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1645693091199-77a764e1ea16?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob25leSUyMGphciUyMG9yZ2FuaWN8ZW58MXx8fHwxNzczODIzNjY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1740592754365-2117f5977528?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXJtZXJpYyUyMHN1cHBsZW1lbnQlMjBjYXBzdWxlfGVufDF8fHx8MTc3MzgzMTQ2OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2NvbnV0JTIwb2lsJTIwbmF0dXJhbHxlbnwxfHx8fDE3NzM3NDQ5MDJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1759064716219-ba8c60a7ce07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGhlcmJzJTIwc3BpY2VzfGVufDF8fHx8MTc3MzgzMTQ3MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1558429773-0d5084b445aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZXJyeSUyMGphbSUyMGhvbWV0YWRlJTIwamFyfGVufDF8fHx8MTc3MzgzMTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1645549826194-1956802d83c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlsaSUyMHNhdWNlJTIwYXJ0ิษน์JTIwYm90ต์เล็กxelanwxfHx8fDE3NzM4MzE0NzJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1748390359572-8e7a47bf5cb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9lJTIwdmVyYSUyMHNraW5jYXJlJTIwY3JlYW18ZW58MXx8fHwxNzczODMxNDY5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1765850257647-811b8d3c20ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbGl2ZSUyMG9pbCUyMGJvdHRsZSUyMHByZW1pdW18ZW58MXx8fHwxNzczNzM2NzU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZXJiYWwlMjBlc3NlbnRpYWwlMjBvaWwlMjBhcm9tYXRoZXJhcHl8ZW58MXx8fHwxNzczODMxNDcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1644061923948-f5b918b524c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbWxhJTIwaW5kaWFuJTIwZ29vc2ViZXJyeSUyMGRyaWVkfGVufDF8fHx8MTc3MzgzMTQ3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

export function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { t } = useLanguage();
  const { products, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "ทั้งหมด");
  const [productType, setProductType] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("จากมากไปน้อย");
  const [page, setPage] = useState(1);
  const PRICE_MIN = 0;
  const PRICE_MAX = Math.max(500, ...products.map((p) => p.originalPrice ?? p.price));
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [minPrice, maxPrice] = priceRange;
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const searchQuery = searchParams.get("search") || "";
  const filtered = products
    .filter((p) => selectedCategory === "ทั้งหมด" || p.category === selectedCategory)
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => {
      if (productType === "สินค้า Flash Sale") return !!p.isFlashSale;
      if (productType === "สินค้าโปรโมชัน")    return !p.isFlashSale && !!p.discountPercent;
      if (productType === "สินค้าแนะนำ")       return !p.isFlashSale && !p.discountPercent && !!p.isRecommended;
      return true;
    })
    .filter((p) => {
      return p.price >= minPrice && p.price <= maxPrice;
    })
    .sort((a, b) => {
      if (sortBy === "จากมากไปน้อย") return b.price - a.price;
      if (sortBy === "จากน้อยไปมาก") return a.price - b.price;
      return 0;
    });

  const ITEMS_PER_PAGE = 25;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset page to 1 when filters change
  const resetPage = () => setPage(1);

  useEffect(() => { setPage(1); }, [selectedCategory, productType, sortBy, priceRange, searchQuery]);

  if (loading) {
    return (
      <div>
        <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 text-center">
          <div className="bg-gray-200 w-[200px] h-[24px] rounded-lg mx-auto relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
        </div>
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          <aside className="hidden lg:block w-[218px] shrink-0">
            <FilterSkeleton />
          </aside>
          <div className="flex-1">
            <ProductGridSkeleton count={25} cols="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title banner — extends up behind the appbar (appbar sits on top, transparent areas show through) */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 text-center px-4">
        <h1 className={`${font} text-[20px] sm:text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>
          {searchQuery ? `${t("common_search_results")} "${searchQuery}"` : t("products_title")}
        </h1>
        {searchQuery && (
          <p className={`${font} text-[12px] sm:text-[13px] text-gray-500 mt-1`}>{t("common_results_found")} {filtered.length} {t("products_results")}</p>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-[218px] shrink-0">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{t("products_filter")}</span>
              <button onClick={() => { setSelectedCategory("ทั้งหมด"); setProductType("ทั้งหมด"); setPriceRange([PRICE_MIN, PRICE_MAX]); setSortBy("จากมากไปน้อย"); }}
                title={t("common_reset_filter")}
                className="cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
                <RotateCcw className="size-4" strokeWidth={2} />
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#a3a3a3]" />

            {/* category */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("products_category")}</span>
              <div className="relative w-full">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full bg-[#fafafa] h-[40px] rounded-full px-4 text-[13px] ${font} outline-none appearance-none cursor-pointer pr-10`}>
                  <option>ทั้งหมด</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85" />
                  </svg>
                </div>
              </div>
            </div>

            {/* product type */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("products_type")}</span>
              {[
                { key: "ทั้งหมด", label: t("products_all") },
                { key: "สินค้า Flash Sale", label: t("products_type_flash") },
                { key: "สินค้าโปรโมชัน", label: t("products_type_promo") },
                { key: "สินค้าแนะนำ", label: t("products_type_rec") },
              ].map((opt) => {
                const checked = productType === opt.key;
                return (
                  <button key={opt.key} onClick={() => setProductType(opt.key)} className="group flex items-center gap-2.5 cursor-pointer py-1">
                    <span className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "border-[#319754]" : "border-gray-300 group-hover:border-gray-400"}`}>
                      <span className={`rounded-full bg-[#319754] transition-all ${checked ? "size-[8px]" : "size-0"}`} />
                    </span>
                    <span className={`${font} text-[13px] transition-colors ${checked ? "text-[#319754]" : "text-gray-700 group-hover:text-black"}`} style={{ fontWeight: checked ? 500 : 400 }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* price range */}
            <div className="flex flex-col gap-3">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("products_price_range")}</span>
              {/* Min/Max value text */}
              <div className={`${font} flex items-center justify-between text-[14px] text-[#319754]`} style={{ fontWeight: 600 }}>
                <span>฿{minPrice.toLocaleString()}</span>
                <span className="text-gray-300">—</span>
                <span>฿{maxPrice.toLocaleString()}</span>
              </div>
              {/* Custom Slider */}
              <SliderPrimitive.Root
                min={PRICE_MIN}
                max={PRICE_MAX}
                step={10}
                value={priceRange}
                onValueChange={(v) => setPriceRange(v as [number, number])}
                className="relative flex w-full touch-none items-center select-none h-5"
              >
                <SliderPrimitive.Track className="relative grow h-1.5 rounded-full bg-gray-200">
                  <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#319754] to-[#46A165]" />
                </SliderPrimitive.Track>
                {[0, 1].map((i) => (
                  <SliderPrimitive.Thumb
                    key={i}
                    className="block size-5 rounded-full bg-white border-2 border-[#319754] shadow-[0_2px_6px_rgba(0,0,0,0.15)] hover:border-[#287745] hover:shadow-[0_2px_8px_rgba(49,151,84,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#319754]/20 transition-all cursor-grab active:cursor-grabbing"
                  />
                ))}
              </SliderPrimitive.Root>
            </div>

            {/* sort */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{t("common_sort")}</span>
              <div className="relative w-full">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full bg-[#fafafa] h-[40px] rounded-full px-4 text-[13px] ${font} outline-none appearance-none cursor-pointer pr-10`}>
                  <option value="จากมากไปน้อย">{t("common_sort_desc")}</option>
                  <option value="จากน้อยไปมาก">{t("common_sort_asc")}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filter trigger row */}
          {(() => {
            const activeCount =
              (selectedCategory !== "ทั้งหมด" ? 1 : 0) +
              (productType !== "ทั้งหมด" ? 1 : 0) +
              (minPrice !== PRICE_MIN || maxPrice !== PRICE_MAX ? 1 : 0);
            return (
              <div className="lg:hidden flex gap-2 mb-4 items-center">
                <button onClick={() => setMobileFilterOpen(true)}
                  className={`group flex items-center gap-2 px-3.5 h-[40px] rounded-full text-[13px] ${font} cursor-pointer shrink-0 transition-all active:scale-95 ${
                    activeCount > 0
                      ? "text-white shadow-[0_4px_12px_-2px_rgba(49,151,84,0.45)]"
                      : "bg-white border border-gray-200 text-[#1d5b32] shadow-[0_1px_3px_rgba(16,24,40,0.06)] hover:border-[#319754]/40"
                  }`}
                  style={activeCount > 0
                    ? { background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }
                    : { fontWeight: 500 }}>
                  <SlidersHorizontal className="size-[15px]" strokeWidth={2.2} />
                  <span>{t("products_filter")}</span>
                  {activeCount > 0 && (
                    <span className={`${font} inline-flex items-center justify-center size-[20px] rounded-full text-[10px] tabular-nums bg-white text-[#319754] shadow-[0_2px_4px_rgba(0,0,0,0.15)]`} style={{ fontWeight: 700 }}>
                      {activeCount}
                    </span>
                  )}
                </button>
                <div className="relative flex-1 min-w-0">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className={`w-full appearance-none bg-white border border-gray-200 rounded-full pl-4 pr-9 h-[40px] text-[13px] ${font} outline-none cursor-pointer focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 shadow-[0_1px_3px_rgba(16,24,40,0.06)]`} style={{ fontWeight: 500 }}>
                    <option value="จากมากไปน้อย">{t("common_sort_desc")}</option>
                    <option value="จากน้อยไปมาก">{t("common_sort_asc")}</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            );
          })()}

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {mobileFilterOpen && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="lg:hidden fixed inset-0 z-[100] flex">
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
                <motion.div
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
                  className="relative ml-auto w-[88vw] max-w-[360px] h-full bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.2)] flex flex-col">
                  {/* Header */}
                  <div className="relative bg-gradient-to-br from-[#46c474] via-[#319754] to-[#1d5b32] px-5 py-4 flex items-center justify-between overflow-hidden">
                    <div className="absolute -top-4 -right-4 size-[120px] rounded-full bg-white/10 blur-2xl pointer-events-none" />
                    <div className="relative flex items-center gap-2.5">
                      <div className="size-[34px] rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center ring-1 ring-white/30">
                        <SlidersHorizontal className="size-[16px] text-white" strokeWidth={2.4} />
                      </div>
                      <div>
                        <p className={`${font} text-[16px] text-white leading-none`} style={{ fontWeight: 600 }}>{t("products_filter")}</p>
                        <p className={`${font} text-[11px] text-white/75 mt-1`}>พบ {filtered.length} รายการ</p>
                      </div>
                    </div>
                    <button onClick={() => setMobileFilterOpen(false)}
                      className="relative size-[34px] rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors active:scale-95"
                      aria-label={t("close_aria")}>
                      <X className="size-[16px]" strokeWidth={2.4} />
                    </button>
                  </div>

                  {/* Scrollable body */}
                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
                    {/* category */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#46c474] to-[#319754]" />
                        <span className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 600 }}>{t("products_category")}</span>
                      </div>
                      <div className="relative">
                        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                          className={`w-full appearance-none bg-gray-50 hover:bg-white border border-gray-200 hover:border-[#319754]/40 focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 h-[44px] rounded-xl pl-4 pr-10 text-[13.5px] ${font} outline-none cursor-pointer transition-all`}>
                          <option>ทั้งหมด</option>
                          {categories.map((c) => <option key={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* type — pill chips */}
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#46c474] to-[#319754]" />
                        <span className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 600 }}>{t("products_type")}</span>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {[
                          { key: "ทั้งหมด", label: t("products_all") },
                          { key: "สินค้า Flash Sale", label: t("products_type_flash") },
                          { key: "สินค้าโปรโมชัน", label: t("products_type_promo") },
                          { key: "สินค้าแนะนำ", label: t("products_type_rec") },
                        ].map((opt) => {
                          const checked = productType === opt.key;
                          return (
                            <button key={opt.key} onClick={() => setProductType(opt.key)}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-left transition-all active:scale-[0.98] ${
                                checked ? "bg-[#319754]/8 border border-[#319754]/30" : "border border-gray-100 hover:bg-gray-50"
                              }`}>
                              <span className={`size-[20px] rounded-full border-[2px] flex items-center justify-center shrink-0 transition-all ${
                                checked ? "border-[#319754] shadow-[0_0_0_4px_rgba(49,151,84,0.12)]" : "border-gray-300"
                              }`}>
                                <span className={`rounded-full bg-[#319754] transition-all ${checked ? "size-[10px]" : "size-0"}`} />
                              </span>
                              <span className={`${font} text-[13.5px] ${checked ? "text-[#319754]" : "text-gray-700"}`} style={{ fontWeight: checked ? 600 : 500 }}>{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* price */}
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#46c474] to-[#319754]" />
                        <span className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 600 }}>{t("products_price_range")}</span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className={`${font} flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-center`}>
                          <p className={`${font} text-[10px] text-gray-400 uppercase tracking-wider`} style={{ fontWeight: 500 }}>MIN</p>
                          <p className={`${font} text-[14px] text-[#319754] tabular-nums leading-tight`} style={{ fontWeight: 700 }}>฿{minPrice.toLocaleString()}</p>
                        </div>
                        <span className="text-gray-300 text-[14px]">—</span>
                        <div className={`${font} flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-center`}>
                          <p className={`${font} text-[10px] text-gray-400 uppercase tracking-wider`} style={{ fontWeight: 500 }}>MAX</p>
                          <p className={`${font} text-[14px] text-[#319754] tabular-nums leading-tight`} style={{ fontWeight: 700 }}>฿{maxPrice.toLocaleString()}</p>
                        </div>
                      </div>
                      <SliderPrimitive.Root
                        min={PRICE_MIN}
                        max={PRICE_MAX}
                        step={10}
                        value={priceRange}
                        onValueChange={(v) => setPriceRange(v as [number, number])}
                        className="relative flex w-full touch-none items-center select-none h-6 px-1"
                      >
                        <SliderPrimitive.Track className="relative grow h-2 rounded-full bg-gray-200">
                          <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#46c474] to-[#319754]" />
                        </SliderPrimitive.Track>
                        {[0, 1].map((i) => (
                          <SliderPrimitive.Thumb key={i}
                            className="block size-6 rounded-full bg-white border-2 border-[#319754] shadow-[0_3px_10px_-2px_rgba(49,151,84,0.4)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#319754]/20 cursor-grab active:cursor-grabbing transition-shadow" />
                        ))}
                      </SliderPrimitive.Root>
                    </div>
                  </div>

                  {/* Sticky action bar */}
                  <div className="border-t border-gray-100 p-4 flex gap-2 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
                    <button onClick={() => { setSelectedCategory("ทั้งหมด"); setProductType("ทั้งหมด"); setPriceRange([PRICE_MIN, PRICE_MAX]); setSortBy("จากมากไปน้อย"); }}
                      className={`px-4 h-[44px] rounded-full border border-gray-200 ${font} text-[13.5px] text-gray-700 cursor-pointer hover:bg-gray-50 hover:border-gray-300 active:scale-[0.97] transition-all inline-flex items-center justify-center gap-1.5`} style={{ fontWeight: 500 }}>
                      <RotateCcw className="size-4" strokeWidth={2.2} /> {t("common_reset_filter")}
                    </button>
                    <button onClick={() => setMobileFilterOpen(false)}
                      className={`flex-1 h-[44px] rounded-full text-white ${font} text-[13.5px] cursor-pointer shadow-[0_4px_14px_-2px_rgba(49,151,84,0.45)] hover:shadow-[0_8px_20px_-4px_rgba(49,151,84,0.6)] hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.97] transition-all`}
                      style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)", fontWeight: 600 }}>
                      {t("common_view_all")} ({filtered.length})
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px]">
            {paginatedItems.map((p, i) => {
              const wishlisted = isWishlisted(p.id);
              const tag: "flashsale" | "discount" | "recommended" | null =
                p.isFlashSale ? "flashsale" : p.discountPercent ? "discount" : p.isRecommended ? "recommended" : null;
              return (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group/card">
                  <div className="flex-1 relative min-h-0 overflow-hidden">
                    <ImageWithFallback src={productImages[i % productImages.length]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
                    {/* Single Tag — priority: flashsale > discount > recommended */}
                    {tag === "flashsale" && (
                      <>
                        <div className="absolute top-0 right-0 p-[8px]">
                          <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                            <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_discount_prefix")} {p.discountPercent}%</span>
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
                        <div className="bg-[#e62e05] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(230,46,5,0.4)]">
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_discount_prefix")} {p.discountPercent}%</span>
                        </div>
                      </div>
                    )}
                    {tag === "recommended" && (
                      <div className="absolute top-0 right-0 p-[8px]">
                        <div className="bg-[#319754] px-2.5 py-0.5 rounded-full shadow-[0_2px_6px_rgba(49,151,84,0.4)]">
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>{t("home_recommended_tag")}</span>
                        </div>
                      </div>
                    )}
                    {/* Wishlist heart */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                        toast(wishlisted ? t("pd_removed_from_wishlist") : t("pd_added_to_wishlist"));
                      }}
                      className="absolute bottom-2 right-2 size-7 bg-white/90 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                    >
                      <Heart className={`size-3.5 ${wishlisted ? "fill-[#ff383c] text-[#ff383c]" : "text-gray-400"}`} />
                    </button>
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
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <span className={`${font} text-[13px] text-gray-500 mr-2`}>{t("products_showing")} {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} {t("products_of")} {filtered.length} {t("products_results")}</span>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${page <= 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}
                aria-label={t("common_prev_page")}>
                <ChevronLeft className="size-4" strokeWidth={2.4} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`${font} size-8 rounded-full inline-flex items-center justify-center text-[13px] cursor-pointer transition-colors ${p === page ? "bg-[#319754] text-white" : "text-gray-600 hover:bg-gray-100"}`}
                  style={{ fontWeight: p === page ? 600 : 400 }}>{p}</button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`size-8 rounded-full inline-flex items-center justify-center cursor-pointer transition-colors ${page >= totalPages ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-[#319754]/10 hover:text-[#319754]"}`}
                aria-label={t("common_next_page")}>
                <ChevronRight className="size-4" strokeWidth={2.4} />
              </button>
            </div>
          )}
        </div>
      </div>
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

/* ===== Coupon Icon ===== */
function CouponIcon() {
  return (
    <svg className="w-[14px] h-[15px] shrink-0" fill="none" viewBox="0 0 14 15">
      <path d="M14 0H0V15H14V0Z" fill="#947005" opacity="0" />
      <path d={svgPaths.p1939b280} fill="#DF9723" />
    </svg>
  );
}