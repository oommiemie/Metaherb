import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { products, categories } from "../data/products";
import { Star, ChevronDown, RotateCcw } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import imgProd1 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgProd2 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgProd3 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgProd4 from "figma:asset/2760a63146309433afbbc9a2171f4189dfd27e07.png";
import imgProd5 from "figma:asset/623849f160a45efb31fada62d7efbfb3f3bab60f.png";
import imgProd6 from "figma:asset/b251ac55d2f44764962036699fe6da4d05a98501.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const productImages = [imgProd1, imgProd2, imgProd3, imgProd4, imgProd5, imgProd6];

export function ProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "ทั้งหมด");
  const [productType, setProductType] = useState("ทั้งหมด");
  const [sortBy, setSortBy] = useState("จากมากไปน้อย");
  const [page, setPage] = useState(1);

  const searchQuery = searchParams.get("search") || "";
  const filtered = products
    .filter((p) => selectedCategory === "ทั้งหมด" || p.category === selectedCategory)
    .filter((p) => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

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
        <aside className="hidden lg:block w-[200px] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${font} text-[16px]`} style={{ fontWeight: 600 }}>ตัวกรอง</h3>
            <button onClick={() => { setSelectedCategory("ทั้งหมด"); setProductType("ทั้งหมด"); }} className="cursor-pointer"><RotateCcw className="size-4 text-gray-400" /></button>
          </div>

          <div className="mb-6">
            <label className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>หมวดหมู่</label>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
              className={`w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none`}>
              <option>ทั้งหมด</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="mb-6">
            <label className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>ประเภทสินค้า</label>
            <div className="flex flex-col gap-2 mt-2">
              {["ทั้งหมด", "สินค้าโปรโมชัน", "สินค้าแนะนำ"].map((t) => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="type" checked={productType === t} onChange={() => setProductType(t)} className="accent-[#319754]" />
                  <span className={`${font} text-[13px]`}>{t}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>ช่วงราคา</label>
            <div className="flex flex-col gap-2 mt-2">
              <input placeholder="ราคาต่ำสุด" className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none`} />
              <input placeholder="ราคาสูงสุด" className={`border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none`} />
            </div>
          </div>

          <div>
            <label className={`${font} text-[13px] text-gray-600`} style={{ fontWeight: 500 }}>เรียงตาม</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className={`w-full mt-1 border border-gray-300 rounded-lg px-3 py-2 text-[13px] ${font} outline-none`}>
              <option>จากมากไปน้อย</option>
              <option>จากน้อยไปมาก</option>
            </select>
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

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
            {filtered.map((p, i) => (
              <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100">
                <div className="relative aspect-square bg-gray-100 overflow-hidden">
                  <ImageWithFallback src={productImages[i % productImages.length]} alt={p.name} className="w-full h-full object-cover" />
                  {p.discount && <span className={`absolute top-2 right-2 bg-[#ee4d2d] text-white text-[10px] px-2 py-0.5 rounded ${font}`}>{p.discount}</span>}
                  {p.tag && <span className={`absolute top-2 left-2 bg-[#319754] text-white text-[10px] px-2 py-0.5 rounded ${font}`}>{p.tag}</span>}
                </div>
                <div className="p-3">
                  <p className={`${font} text-[13px] text-gray-800 truncate`}>{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                    {p.originalPrice && <span className={`${font} text-[11px] text-gray-400 line-through`}>฿{p.originalPrice.toFixed(2)}</span>}
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="size-3 fill-[#f7931d] text-[#f7931d]" />
                      <span className={`${font} text-[11px] text-gray-500`}>{p.rating}</span>
                    </div>
                    <span className={`${font} text-[11px] text-gray-400`}>{p.sold}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <button className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-[13px] cursor-pointer">◀</button>
            {[1, 2, 3, 4, 5].map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`size-8 rounded-full flex items-center justify-center text-[13px] cursor-pointer ${p === page ? "bg-[#319754] text-white" : "bg-gray-100 text-gray-600"}`}>{p}</button>
            ))}
            <button className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-[13px] cursor-pointer">▶</button>
          </div>
        </div>
      </div>
    </div>
  );
}