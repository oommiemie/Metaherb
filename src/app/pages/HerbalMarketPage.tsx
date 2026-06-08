import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { Star, RotateCcw, BadgeCheck, MapPin, Package, Beaker, ShieldCheck, Store, ArrowRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../store/LanguageContext";
import { useAuth } from "../store/AuthContext";
import { toast } from "sonner";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { MATERIALS, CATEGORIES, GRADES, GRADE_STYLE, type MaterialCategory, type MaterialGrade } from "../data/herbalMaterials";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function HerbalMarketPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();

  const handleBecomeSupplier = () => {
    if (user?.role === "owner") {
      toast.success("เปิดหน้าจัดการสินค้าของคุณ");
      navigate("/owner");
      return;
    }
    if (user?.role === "admin") {
      navigate("/admin");
      return;
    }
    navigate("/supplier/register");
  };

  const supplierBtnLabel =
    isAuthenticated && user?.role === "owner" ? "ไปหน้าร้านของฉัน" : "มาเป็น Supplier กับเรา";

  const [selectedCategory, setSelectedCategory] = useState<"ทั้งหมด" | MaterialCategory>("ทั้งหมด");
  const [selectedGrade, setSelectedGrade] = useState<"ทั้งหมด" | MaterialGrade>("ทั้งหมด");
  const [sortBy, setSortBy] = useState("popular");
  const [page, setPage] = useState(1);

  const PRICE_MIN = 0;
  const PRICE_MAX = Math.max(1000, ...MATERIALS.map((m) => m.pricePerKg));
  const [priceRange, setPriceRange] = useState<[number, number]>([PRICE_MIN, PRICE_MAX]);
  const [minPrice, maxPrice] = priceRange;

  const searchQuery = searchParams.get("search") || "";

  const filtered = MATERIALS
    .filter((m) => selectedCategory === "ทั้งหมด" || m.category === selectedCategory)
    .filter((m) => selectedGrade === "ทั้งหมด" || m.grade === selectedGrade)
    .filter((m) => !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase()) || m.scientificName.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((m) => m.pricePerKg >= minPrice && m.pricePerKg <= maxPrice)
    .sort((a, b) => {
      if (sortBy === "price_asc")  return a.pricePerKg - b.pricePerKg;
      if (sortBy === "price_desc") return b.pricePerKg - a.pricePerKg;
      if (sortBy === "moq_asc")    return a.moq - b.moq;
      return b.rating - a.rating;  // popular
    });

  // 20 = fills the 5-col grid (4 rows) and 4-col grid (5 rows) evenly
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  const paginatedItems = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [selectedCategory, selectedGrade, sortBy, priceRange, searchQuery]);

  return (
    <div>
      {/* Hero banner */}
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-8 md:pb-10">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 flex flex-col items-center text-center gap-2">
          <h1 className={`${font} text-[28px] md:text-[34px] text-[#319754]`} style={{ fontWeight: 600 }}>
            {searchQuery ? `${t("common_search_results")} "${searchQuery}"` : "ตลาดวัตถุดิบสมุนไพร"}
          </h1>
          <p className={`${font} text-[14px] md:text-[15px] text-gray-600 max-w-[600px]`}>
            เลือกซื้อวัตถุดิบจากเกษตรกรและ supplier จริง — มีใบรับรอง อย. / Organic / GMP — ขอใบเสนอราคาและตัวอย่างได้ทันที
          </p>
          {searchQuery && (
            <p className={`${font} text-[13px] text-gray-500`}>{t("common_results_found")} {filtered.length} รายการ</p>
          )}

          {/* Supplier CTA */}
          <button onClick={handleBecomeSupplier}
            className={`${font} group mt-3 inline-flex items-center gap-2 h-11 pl-2 pr-5 rounded-full bg-white border border-[#319754]/30 text-[#287745] hover:bg-[#319754] hover:text-white hover:border-[#319754] text-[14px] cursor-pointer transition-all shadow-[0_2px_8px_rgba(49,151,84,0.12)]`}
            style={{ fontWeight: 600 }}>
            <span className="size-7 rounded-full bg-[#319754]/15 group-hover:bg-white/20 flex items-center justify-center transition-colors">
              <Store className="size-3.5" strokeWidth={2.4} />
            </span>
            {supplierBtnLabel}
            <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-[218px] shrink-0">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 sticky top-[140px]">
            <div className="flex items-center justify-between">
              <span className={`${font} text-[18px] text-black`} style={{ fontWeight: 500 }}>{t("products_filter")}</span>
              <button onClick={() => {
                  setSelectedCategory("ทั้งหมด"); setSelectedGrade("ทั้งหมด");
                  setPriceRange([PRICE_MIN, PRICE_MAX]); setSortBy("popular");
                }}
                title={t("common_reset_filter")}
                className="cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
                <RotateCcw className="size-4" strokeWidth={2} />
              </button>
            </div>
            <div className="w-full h-px bg-[#e5e5e5]" />

            {/* Category */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>ประเภทวัตถุดิบ</span>
              <div className="flex flex-col gap-1">
                {CATEGORIES.map((c) => {
                  const active = selectedCategory === c;
                  return (
                    <button key={c} onClick={() => setSelectedCategory(c)}
                      className={`${font} text-left text-[13px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                        active ? "bg-[#319754]/10 text-[#319754]" : "text-gray-700 hover:bg-gray-50"
                      }`} style={{ fontWeight: active ? 600 : 400 }}>
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-[#e5e5e5]" />

            {/* Grade */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>เกรดวัตถุดิบ</span>
              <div className="flex flex-wrap gap-1.5">
                {GRADES.map((g) => {
                  const active = selectedGrade === g;
                  return (
                    <button key={g} onClick={() => setSelectedGrade(g)}
                      className={`${font} text-[12px] px-3 py-1 rounded-full transition-all cursor-pointer ${
                        active ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`} style={{ fontWeight: 500 }}>
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full h-px bg-[#e5e5e5]" />

            {/* Price per kg */}
            <div className="flex flex-col gap-3">
              <span className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>ราคา / กก. (บาท)</span>
              <div className={`${font} flex items-center justify-between text-[13px] text-[#319754]`} style={{ fontWeight: 600 }}>
                <span>฿{minPrice.toLocaleString()}</span>
                <span className="text-gray-300">—</span>
                <span>฿{maxPrice.toLocaleString()}</span>
              </div>
              <SliderPrimitive.Root
                min={PRICE_MIN} max={PRICE_MAX} step={10} value={priceRange}
                onValueChange={(v) => setPriceRange(v as [number, number])}
                className="relative flex w-full touch-none items-center select-none h-5">
                <SliderPrimitive.Track className="relative grow h-1.5 rounded-full bg-gray-200">
                  <SliderPrimitive.Range className="absolute h-full rounded-full bg-gradient-to-r from-[#319754] to-[#46A165]" />
                </SliderPrimitive.Track>
                {[0, 1].map((i) => (
                  <SliderPrimitive.Thumb key={i}
                    className="block size-5 rounded-full bg-white border-2 border-[#319754] shadow-[0_2px_6px_rgba(0,0,0,0.15)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#319754]/20 transition-all cursor-grab active:cursor-grabbing" />
                ))}
              </SliderPrimitive.Root>
            </div>

            <div className="w-full h-px bg-[#e5e5e5]" />

            {/* Sort */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>{t("common_sort")}</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                className={`w-full bg-[#fafafa] h-[40px] rounded-full px-4 text-[13px] ${font} outline-none cursor-pointer`}>
                <option value="popular">ยอดนิยม</option>
                <option value="price_asc">ราคา: น้อย → มาก</option>
                <option value="price_desc">ราคา: มาก → น้อย</option>
                <option value="moq_asc">MOQ น้อยสุด</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Materials grid */}
        <div className="flex-1 min-w-0">
          {/* Mobile filters */}
          <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value as any)}
              className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none shrink-0 bg-white`}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={selectedGrade} onChange={(e) => setSelectedGrade(e.target.value as any)}
              className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none shrink-0 bg-white`}>
              {GRADES.map((g) => <option key={g}>เกรด {g}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none shrink-0 bg-white`}>
              <option value="popular">ยอดนิยม</option>
              <option value="price_asc">ราคาน้อย</option>
              <option value="price_desc">ราคามาก</option>
              <option value="moq_asc">MOQ น้อย</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-between mb-3">
            <p className={`${font} text-[13px] text-gray-500`}>
              พบ <span className="text-[#319754]" style={{ fontWeight: 600 }}>{filtered.length}</span> รายการ
            </p>
          </div>

          {/* Grid */}
          {paginatedItems.length === 0 ? (
            <div className="bg-white rounded-2xl py-16 flex flex-col items-center gap-3 text-gray-400">
              <Beaker className="size-12" strokeWidth={1.5} />
              <p className={`${font} text-[14px]`}>ไม่พบวัตถุดิบที่ตรงกับเงื่อนไข</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px]">
              {paginatedItems.map((m) => {
                const gradeStyle = GRADE_STYLE[m.grade];
                return (
                  <div key={m.id} onClick={() => navigate(`/market/${m.id}`)}
                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 group cursor-pointer">
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <ImageWithFallback src={m.image} alt={m.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                      {/* Grade pill */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className={`${font} text-[10px] px-2 py-1 rounded-full shadow-sm`}
                          style={{ background: gradeStyle.bg, color: gradeStyle.color, fontWeight: 700, boxShadow: gradeStyle.shadow, textShadow: gradeStyle.textShadow, letterSpacing: "0.02em" }}>
                          {m.grade}
                        </span>
                      </div>
                      {/* Verified supplier */}
                      {m.supplierVerified && (
                        <div className="absolute top-2.5 right-2.5 bg-white rounded-full p-1 shadow-sm" title="Verified Supplier">
                          <BadgeCheck className="size-4 text-[#319754]" fill="#319754" stroke="#fff" strokeWidth={2.5} />
                        </div>
                      )}
                      {/* Stock badge */}
                      <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                        <span className={`${font} text-[10px] text-white`}>คงเหลือ {m.stock.toLocaleString()} กก.</span>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 p-3 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 600 }}>{m.name}</h3>
                          <p className={`${font} text-[11px] text-gray-500 italic truncate`}>{m.scientificName}</p>
                        </div>
                        <span className={`${font} inline-flex items-center gap-0.5 text-[12px] text-[#f59e0b] shrink-0`} style={{ fontWeight: 600 }}>
                          <Star className="size-3" fill="#f59e0b" strokeWidth={0} />
                          {m.rating}
                        </span>
                      </div>

                      {/* Price + MOQ */}
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

                      {/* Supplier + Location */}
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <Package className="size-3 shrink-0" strokeWidth={2.4} />
                        <span className="truncate">{m.supplier}</span>
                        <span className="text-gray-300">·</span>
                        <MapPin className="size-3 shrink-0" strokeWidth={2.4} />
                        <span className="truncate">{m.location}</span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                className={`${font} h-9 px-3 rounded-full border border-gray-200 text-[12px] cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}>
                ก่อนหน้า
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button key={n} onClick={() => setPage(n)}
                  className={`${font} size-9 rounded-full text-[12px] cursor-pointer transition-colors ${
                    n === page ? "bg-[#319754] text-white" : "border border-gray-200 hover:bg-gray-50"
                  }`} style={{ fontWeight: n === page ? 600 : 400 }}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className={`${font} h-9 px-3 rounded-full border border-gray-200 text-[12px] cursor-pointer hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed`}>
                ถัดไป
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
