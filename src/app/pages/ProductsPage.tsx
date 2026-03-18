import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { products, categories } from "../data/products";
import { Star, ChevronDown, RotateCcw, Heart } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useWishlist } from "../store/WishlistContext";
import { toast } from "sonner";
import svgPaths from "../../imports/svg-7w99agzzp8";
import { FilterSkeleton, ProductGridSkeleton } from "../components/Skeleton";

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
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "ทั้งหมด");
  const [productType, setProductType] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("จากมากไปน้อย");
  const [page, setPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const searchQuery = searchParams.get("search") || "";
  const filtered = products
    .filter((p) => selectedCategory === "ทั้งหมด" || p.category === selectedCategory)
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => {
      if (productType === "สินค้าโปรโมชัน") return p.isFlashSale || !!p.discountPercent;
      if (productType === "สินค้าแนะนำ") return p.isRecommended;
      return true;
    })
    .filter((p) => {
      const min = minPrice ? parseFloat(minPrice) : 0;
      const max = maxPrice ? parseFloat(maxPrice) : Infinity;
      return p.price >= min && p.price <= max;
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

  useEffect(() => { setPage(1); }, [selectedCategory, productType, sortBy, minPrice, maxPrice, searchQuery]);

  if (loading) {
    return (
      <div>
        <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
          <div className="bg-gray-200 w-[200px] h-[24px] rounded-lg mx-auto relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent" />
        </div>
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
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
      {/* Title banner */}
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>
          {searchQuery ? `ผลการค้นหา "${searchQuery}"` : "ผลิตภัณฑ์ทั้งหมด"}
        </h1>
        {searchQuery && (
          <p className={`${font} text-[13px] text-gray-500 mt-1`}>พบ {filtered.length} รายการ</p>
        )}
      </div>

      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {/* Sidebar filters */}
        <aside className="hidden lg:block w-[218px] shrink-0">
          <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ตัวกรอง</span>
              <button onClick={() => { setSelectedCategory("ทั้งหมด"); setProductType("ทั้งหมด"); setMinPrice(""); setMaxPrice(""); setSortBy("จากมากไปน้อย"); }} className="cursor-pointer">
                <svg width="24" height="20" viewBox="0 0 24 20" fill="none">
                  <path d="M23.2815 8.10389H18.6846C17.9719 8.10389 17.7813 8.58405 18.1727 9.123L20.4209 12.2489C20.7421 12.6899 21.224 12.6996 21.5451 12.2489L23.7934 9.13279C24.1949 8.58405 24.0042 8.10389 23.2815 8.10389ZM1.58162 9.99512C1.58162 15.5121 6.1685 19.9903 11.8193 19.9903C15.2519 19.9903 18.243 18.3538 20.1098 15.8256C20.4511 15.3944 20.3306 14.8359 19.9192 14.5909C19.4976 14.346 19.0258 14.4733 18.7247 14.8751C17.1891 16.9525 14.6798 18.3244 11.8193 18.3244C7.10194 18.3244 3.28789 14.6007 3.28789 9.99512C3.28789 5.38952 7.10194 1.66586 11.8193 1.66586C16.5366 1.66586 20.3507 5.38952 20.3507 9.99512C20.3507 10.4557 20.7421 10.828 21.2039 10.828C21.6656 10.828 22.047 10.4655 22.057 10.0049C22.047 4.4684 17.4701 0 11.8193 0C6.1685 0 1.58162 4.47821 1.58162 9.99512Z" fill="black" fillOpacity="0.85" />
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#a3a3a3]" />

            {/* หมวดหมู่ */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>หมวดหมู่</span>
              <div className="relative w-full">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full bg-[#fafafa] h-[48px] rounded-full px-6 py-3 text-[14px] ${font} outline-none appearance-none cursor-pointer pr-12`}>
                  <option>ทั้งหมด</option>
                  {categories.map((c) => <option key={c}>{c}</option>)}
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85" />
                  </svg>
                </div>
              </div>
            </div>

            {/* ประเภทสินค้า */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ประเภทสินค้า</span>
              {["ทั้งหมด", "สินค้าโปรโมชัน", "สินค้าแนะนำ"].map((t) => (
                <button key={t} onClick={() => setProductType(t)} className="flex items-center gap-2 cursor-pointer">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    {productType === t ? (
                      <path d="M15.5375 15.5375C16.5125 14.5625 17 13.3833 17 12C17 10.6167 16.5125 9.4375 15.5375 8.4625C14.5625 7.4875 13.3833 7 12 7C10.6167 7 9.4375 7.4875 8.4625 8.4625C7.4875 9.4375 7 10.6167 7 12C7 13.3833 7.4875 14.5625 8.4625 15.5375C9.4375 16.5125 10.6167 17 12 17C13.3833 17 14.5625 16.5125 15.5375 15.5375ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#46A165" />
                    ) : (
                      <path d="M12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#1C1B1F" />
                    )}
                  </svg>
                  <span className={`${font} text-[14px] text-black`}>{t}</span>
                </button>
              ))}
            </div>

            {/* ช่วงราคา */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ช่วงราคา</span>
              <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="ราคาต่ำสุด" className={`w-full bg-[#fafafa] h-[48px] rounded-full px-6 py-3 text-[14px] ${font} outline-none placeholder:text-[#a3a3a3]`} />
              <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="ราคาสูงสุด" className={`w-full bg-[#fafafa] h-[48px] rounded-full px-6 py-3 text-[14px] ${font} outline-none placeholder:text-[#a3a3a3]`} />
            </div>

            {/* เรียงตาม */}
            <div className="flex flex-col gap-2">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>เรียงตาม</span>
              <div className="relative w-full">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className={`w-full bg-[#fafafa] h-[48px] rounded-full px-6 py-3 text-[14px] ${font} outline-none appearance-none cursor-pointer pr-12`}>
                  <option>จากมากไปน้อย</option>
                  <option>จากน้อยไปมาก</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {/* Mobile filter */}
          <div className="lg:hidden flex gap-2 mb-4 overflow-x-auto pb-1">
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none shrink-0`}>
              <option>ทั้งหมด</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none shrink-0`}>
              <option>จากมากไปน้อย</option>
              <option>จากน้อยไปมาก</option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px]">
            {paginatedItems.map((p, i) => {
              const wishlisted = isWishlisted(p.id);
              const tag: "flashsale" | "discount" | "recommended" | null =
                p.isFlashSale ? "flashsale" : p.discountPercent ? "discount" : p.isRecommended ? "recommended" : null;
              return (
                <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
                  className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group">
                  <div className="flex-1 relative min-h-0 rounded-t-[16px] overflow-hidden">
                    <ImageWithFallback src={productImages[i % productImages.length]} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    {/* Single Tag — priority: flashsale > discount > recommended */}
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
                    {/* Wishlist heart */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(p.id);
                        toast(wishlisted ? "ลบออกจากสินค้าที่ชอบแล้ว" : "เพิ่มในสินค้าที่ชอบแล้ว ❤️");
                      }}
                      className="absolute bottom-2 right-2 size-7 bg-white/90 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10"
                    >
                      <Heart className={`size-3.5 ${wishlisted ? "fill-[#ff383c] text-[#ff383c]" : "text-gray-400"}`} />
                    </button>
                  </div>
                  <div className="p-[10px] flex flex-col gap-[4px]">
                    <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
                    <div className="flex items-center gap-[10px]">
                      <span className={`font-['IBM_Plex_Sans_Thai',sans-serif] text-[14px] ${p.discountPercent ? 'text-[#e62e05]' : 'text-[#226a3b]'}`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                      {p.originalPrice && (
                        <span className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[10px] text-[#a3a3a3] line-through">฿{p.originalPrice.toFixed(2)}</span>
                      )}
                      {p.hasCoupon && <CouponIcon />}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-[8px]">
                        <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                          <path d="M14 0H0V14H14V0Z" fill="#F7C42B" opacity="0" />
                          <path d={svgPaths.p1052b000} fill="#F7C42B" />
                        </svg>
                        <span className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[10px] text-black">{p.rating}/5</span>
                      </div>
                      <span className="font-['IBM_Plex_Sans_Thai',sans-serif] text-[10px] text-black text-right">{p.sold}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <span className={`${font} text-[13px] text-gray-500 mr-2`}>แสดง {(page - 1) * ITEMS_PER_PAGE + 1}-{Math.min(page * ITEMS_PER_PAGE, filtered.length)} จาก {filtered.length} รายการ</span>
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className={`size-8 rounded-full flex items-center justify-center text-[13px] cursor-pointer ${page <= 1 ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>◀</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`size-8 rounded-full flex items-center justify-center text-[13px] cursor-pointer ${p === page ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{p}</button>
              ))}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className={`size-8 rounded-full flex items-center justify-center text-[13px] cursor-pointer ${page >= totalPages ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}>▶</button>
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