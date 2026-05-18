import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useShop } from "../store/ShopContext";
import { useAuth } from "../store/AuthContext";
import { useChat } from "../store/ChatContext";
import { useLanguage } from "../store/LanguageContext";
import { useProducts } from "../store/ProductsContext";
import { getShopIdByName } from "../data/shops";
import { Star, Heart, MessageCircle, MapPin, Clock, ShieldCheck, Package, Users, TrendingUp, ChevronRight, ChevronDown, ThumbsUp, Flag, Eye, EyeOff, Trash2, Edit3, Camera, X, Send, Store, Search } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import { useWishlist } from "../store/WishlistContext";
import svgPaths from "../../imports/svg-7w99agzzp8";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// Product images mapping (reuse from other pages)
const productImages: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1621806366061-442c3500deb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "2": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "3": "https://images.unsplash.com/photo-1587049352846-4a222e784d38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "4": "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "5": "https://images.unsplash.com/photo-1526947425960-945c6e72858f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "6": "https://images.unsplash.com/photo-1611241893603-3c359704e0ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "7": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "8": "https://images.unsplash.com/photo-1472476443507-c7a5948772fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "9": "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
  "10": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400",
};

function StarRating({ rating, size = 16, interactive = false, onChange }: { rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 20 20"
          fill={i <= rating ? "#f59e0b" : "#e5e7eb"}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
          onClick={() => interactive && onChange?.(i)}
        >
          <path d="M10 1l2.39 4.84L17.82 7l-3.91 3.81.92 5.39L10 13.47 5.17 16.2l.92-5.39L2.18 7l5.43-.79L10 1z" />
        </svg>
      ))}
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className={`${font} text-[12px] text-gray-500 w-6 text-right`}>{stars}</span>
      <Star className="size-3 text-amber-400 fill-amber-400" />
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className={`${font} text-[11px] text-gray-400 w-8`}>{count}</span>
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

export function ShopProfilePage() {
  const { shopId } = useParams<{ shopId: string }>();
  const navigate = useNavigate();
  const { getShop, isFollowing, followShop, unfollowShop, addShopReview, toggleHideReview, deleteReview, updateShopProfile } = useShop();
  const { user } = useAuth();
  const { openChat } = useChat();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { t } = useLanguage();
  const { products } = useProducts();

  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [productSort, setProductSort] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [productSearch, setProductSearch] = useState<string>("");

  const shop = getShop(shopId || "");

  if (!shop) {
    return (
      <div className={`${font} text-center py-20`}>
        <Store className="size-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-[16px]">{t("vp_not_found")}</p>
        <button onClick={() => navigate("/")} className="mt-4 px-6 py-2 bg-[#319754] text-white rounded-full cursor-pointer hover:bg-[#267a43]">
          กลับหน้าแรก
        </button>
      </div>
    );
  }

  const shopProducts = products.filter((p) => {
    const sid = getShopIdByName(p.shopName);
    return sid === shop.id;
  });

  // Derive distinct categories from this shop's products + count per category
  const shopCategories = (() => {
    const map = new Map<string, number>();
    shopProducts.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  })();

  const filteredByCategory = categoryFilter === "all"
    ? shopProducts
    : shopProducts.filter((p) => p.category === categoryFilter);

  const filteredBySearch = productSearch.trim()
    ? filteredByCategory.filter((p) => {
        const q = productSearch.trim().toLowerCase();
        return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      })
    : filteredByCategory;

  const sortedProducts = [...filteredBySearch].sort((a, b) => {
    if (productSort === "price-asc") return a.price - b.price;
    if (productSort === "price-desc") return b.price - a.price;
    if (productSort === "rating") return b.rating - a.rating;
    return 0;
  });

  const following = isFollowing(shop.id);
  const isOwner = user?.role === "owner" && user?.shopName === shop.name;
  const isAdmin = user?.role === "admin";
  const visibleReviews = isAdmin ? shop.reviews : shop.reviews.filter((r) => !r.hidden);

  // Rating breakdown
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: visibleReviews.filter((r) => r.rating === s && !r.hidden).length,
  }));
  const totalVisible = visibleReviews.filter((r) => !r.hidden).length;

  const handleSubmitReview = () => {
    if (!user) { toast.error("กรุณาเข้าสู่ระบบก่อนรีวิว"); return; }
    if (!reviewComment.trim()) { toast.error("กรุณาเขียนรีวิว"); return; }
    addShopReview(shop.id, {
      userId: user.id,
      userName: user.username,
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
    });
    setReviewComment("");
    setReviewRating(5);
    setShowReviewForm(false);
    toast.success("ส่งรีวิวเรียบร้อยแล้ว");
  };

  const handleSaveProfile = () => {
    updateShopProfile(shop.id, {
      ...(editName.trim() ? { name: editName } : {}),
      ...(editDesc.trim() ? { description: editDesc } : {}),
    });
    setShowEditModal(false);
    toast.success("อัปเดตโปรไฟล์ร้านค้าเรียบร้อย");
  };

  const openEditModal = () => {
    setEditName(shop.name);
    setEditDesc(shop.description);
    setShowEditModal(true);
  };

  return (
    <div className={`${font} min-h-screen bg-gray-50`}>
      {/* Banner — extends behind appbar (matches AboutPage hero pattern) */}
      <div className="relative -mt-[64px] md:-mt-[116px] h-[264px] md:h-[396px] overflow-hidden">
        <ImageWithFallback
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {isOwner && (
          <button
            onClick={openEditModal}
            className="absolute top-[80px] md:top-[132px] right-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-white text-[13px] shadow"
          >
            <Edit3 className="size-4" />
            แก้ไขโปรไฟล์
          </button>
        )}
      </div>

      {/* Shop Info Card */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 -mt-16 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6">
          <div className="relative pl-0 md:pl-[120px]">
            {/* Avatar */}
            <div className="relative shrink-0 self-start md:absolute md:left-0 md:top-[-64px]">
              <div className="size-20 md:size-24 rounded-full bg-[#319754]/10 flex items-center justify-center text-[36px] md:text-[44px] border-[3.8px] border-white shadow-md -mt-14 md:mt-0"
                style={{ backgroundImage: "linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)" }}>
                {shop.avatar}
              </div>
              {isOwner && (
                <button className="absolute bottom-0 right-0 size-7 bg-[#319754] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#267a43] shadow">
                  <Camera className="size-3.5" />
                </button>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-2.5 w-full">
              {/* Row 1: Name + Verified + Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <h1 className="text-[20px] md:text-[24px] text-[#101828]" style={{ fontWeight: 700 }}>{shop.name}</h1>
                  {shop.verified && (
                    <span className="flex items-center gap-1 bg-[#319754]/10 text-[#319754] px-2.5 py-0.5 rounded-full text-[11px]">
                      <ShieldCheck className="size-3.5" /> ยืนยันแล้ว
                    </span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 shrink-0">
                  {!isOwner && (
                    <>
                      <button
                        onClick={() => following ? unfollowShop(shop.id) : followShop(shop.id)}
                        className={`px-5 py-[7px] rounded-full flex items-center gap-2 cursor-pointer text-[13px] transition-all ${
                          following
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            : "bg-[#319754] text-white hover:bg-[#267a43]"
                        }`}
                        style={{ fontWeight: 500 }}
                      >
                        <Heart className={`size-4 ${following ? "fill-red-500 text-red-500" : ""}`} />
                        {following ? t("shop_followed") : t("shop_follow")}
                      </button>
                      <button
                        onClick={() => openChat(shop.id)}
                        className="px-5 py-[7px] rounded-full flex items-center gap-2 cursor-pointer text-[13px] border border-[#319754] text-[#319754] hover:bg-[#319754]/5"
                        style={{ fontWeight: 500 }}
                      >
                        <MessageCircle className="size-4" />
                        แชท
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[#6a7282] text-[13px] line-clamp-2 max-w-[700px]">{shop.description}</p>

              {/* Meta info */}
              <div className="flex items-center gap-4 flex-wrap text-[12px] text-[#6a7282]">
                <span className="flex items-center gap-1"><MapPin className="size-3.5" />{shop.location}</span>
                <span className="flex items-center gap-1"><Clock className="size-3.5" />เข้าร่วม {shop.joined}</span>
                <span className="flex items-center gap-1"><MessageCircle className="size-3.5" />ตอบกลับ {shop.responseRate}%</span>
                <span className="flex items-center gap-1"><Clock className="size-3.5" />{shop.responseTime}</span>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-3 sm:gap-6 mt-1 flex-wrap">
                <div className="text-center">
                  <p className="text-[18px] text-[#319754]" style={{ fontWeight: 700 }}>{shop.rating}</p>
                  <div className="flex items-center gap-0.5 justify-center">
                    <StarRating rating={Math.round(shop.rating)} size={12} />
                  </div>
                  <p className="text-[10px] text-[#99a1af] mt-0.5">{shop.totalReviews.toLocaleString()} รีวิว</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[18px] text-[#101828]" style={{ fontWeight: 700 }}>{shop.followers.toLocaleString()}</p>
                  <p className="text-[10px] text-[#99a1af]">{t("shop_followers")}</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[18px] text-[#101828]" style={{ fontWeight: 700 }}>{shop.totalProducts}</p>
                  <p className="text-[10px] text-[#99a1af]">{t("shop_products")}</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[18px] text-[#101828]" style={{ fontWeight: 700 }}>{shop.totalSold}</p>
                  <p className="text-[10px] text-[#99a1af]">{t("pd_sold")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs — FilterTabPills pattern (matches admin Complaints/Orders pages) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 mt-6">
        <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2">
          {/* Tab pills */}
          <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
            {[
              { id: "products" as const, label: "สินค้า",      icon: Package, count: shopProducts.length },
              { id: "reviews"  as const, label: "รีวิวร้านค้า", icon: Star,    count: visibleReviews.length },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`group/tab relative flex items-center gap-2 h-[38px] pl-1.5 pr-3.5 rounded-full cursor-pointer shrink-0 transition-all duration-200 ${
                    isActive ? "" : "text-[#1d5b32] hover:text-[#287745] hover:-translate-y-[1px]"
                  }`}>
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/[0.08] transition-colors duration-200" />
                  )}
                  {isActive && (
                    <motion.span layoutId="shop-profile-pill"
                      className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                      style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <motion.span layout className="relative flex items-center justify-center size-[28px] rounded-full shrink-0 transition-colors duration-200"
                    style={{
                      backgroundColor: isActive ? "rgba(255,255,255,0.22)" : "rgba(49,151,84,0.12)",
                      boxShadow: isActive ? "inset 0 1px 0 rgba(255,255,255,0.3)" : "none",
                    }}>
                    <tab.icon className="size-[14px]" style={{ color: isActive ? "#fff" : "#319754" }} strokeWidth={2.4} />
                  </motion.span>
                  <span className={`${font} relative text-[13px] leading-none whitespace-nowrap transition-colors duration-200`}
                    style={{ color: isActive ? "#fff" : undefined, fontWeight: isActive ? 600 : 500 }}>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[20px] h-[20px] rounded-full inline-flex items-center justify-center transition-all duration-200 ring-[1.5px]`}
                      style={{
                        background: isActive ? "rgba(255,255,255,0.22)" : "linear-gradient(135deg, #ff8a8a, #ef4444)",
                        color: "#fff",
                        fontWeight: 700,
                        boxShadow: isActive ? "none" : "0 2px 6px rgba(239,56,60,0.5)",
                        ["--tw-ring-color" as any]: isActive ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.95)",
                      }}>{tab.count}</span>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Search — only on products tab, inside the same pill container */}
          {activeTab === "products" && (
            <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 sm:flex-none sm:w-[280px] sm:ml-auto">
              <input value={productSearch} onChange={(e) => setProductSearch(e.target.value)}
                placeholder="ค้นหาสินค้าในร้านนี้"
                className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`} />
              {productSearch ? (
                <button onClick={() => setProductSearch("")}
                  title="ล้างคำค้นหา"
                  className="size-[28px] rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer flex items-center justify-center shrink-0">
                  <X className="size-3.5 text-gray-600" strokeWidth={2.4} />
                </button>
              ) : (
                <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
                  <Search className="size-4 text-white" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-6 pb-20">
        {activeTab === "products" && (
          <div>
            {/* Filter row — count on the left, category + sort dropdowns on the right */}
            <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
              <div className="flex items-center gap-2">
                <Package className="size-4 text-[#319754]" strokeWidth={2.2} />
                <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>
                  {categoryFilter === "all" ? "สินค้าทั้งหมด" : categoryFilter} <span className="text-[#319754]" style={{ fontWeight: 600 }}>{sortedProducts.length}</span> รายการ
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Category dropdown */}
                {shopCategories.length > 0 && (
                  <div className="relative">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className={`${font} text-[13px] text-black bg-white border border-[#d4d4d4] hover:border-[#319754]/40 rounded-full pl-4 pr-10 h-[36px] cursor-pointer appearance-none outline-none focus:border-[#319754] transition-colors`}
                      style={{ fontWeight: 500 }}>
                      <option value="all">ทุกหมวดหมู่ ({shopProducts.length})</option>
                      {shopCategories.map((c) => (
                        <option key={c.name} value={c.name}>{c.name} ({c.count})</option>
                      ))}
                    </select>
                    <ChevronDown className="size-4 text-[#319754] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.4} />
                  </div>
                )}
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    value={productSort}
                    onChange={(e) => setProductSort(e.target.value as typeof productSort)}
                    className={`${font} text-[13px] text-black bg-white border border-[#d4d4d4] hover:border-[#319754]/40 rounded-full pl-4 pr-10 h-[36px] cursor-pointer appearance-none outline-none focus:border-[#319754] transition-colors`}
                    style={{ fontWeight: 500 }}>
                    <option value="default">เรียงตามค่าเริ่มต้น</option>
                    <option value="price-asc">ราคาต่ำ → สูง</option>
                    <option value="price-desc">ราคาสูง → ต่ำ</option>
                    <option value="rating">คะแนนสูงสุด</option>
                  </select>
                  <ChevronDown className="size-4 text-[#319754] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.4} />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-[16px]">
              {sortedProducts.map((p) => {
                const wishlisted = isWishlisted(p.id);
                const tag: "flashsale" | "discount" | "recommended" | null =
                  p.isFlashSale ? "flashsale" : p.discountPercent ? "discount" : p.isRecommended ? "recommended" : null;
                return (
                  <div key={p.id} onClick={() => navigate(`/product/${p.id}`)}
                    className="bg-white rounded-[16px] border border-[#d4d4d4] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 flex flex-col h-[259px] group">
                    <div className="flex-1 relative min-h-0 rounded-t-[16px] overflow-hidden">
                      <ImageWithFallback src={productImages[p.id] || p.image || `https://picsum.photos/seed/${p.id}/400/400`} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
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
                            <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>ลด {p.discountPercent}%</span>
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
                        <span className={`${font} text-[14px] ${p.discountPercent ? 'text-[#e62e05]' : 'text-[#226a3b]'}`} style={{ fontWeight: 600 }}>฿ {p.price.toFixed(2)}</span>
                        {p.originalPrice && (
                          <span className={`${font} text-[10px] text-[#a3a3a3] line-through`}>฿{p.originalPrice.toFixed(2)}</span>
                        )}
                        {p.hasCoupon && <CouponIcon />}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[8px]">
                          <svg className="size-[14px] shrink-0" fill="none" viewBox="0 0 14 14">
                            <path d="M14 0H0V14H14V0Z" fill="#F7C42B" opacity="0" />
                            <path d={svgPaths.p1052b000} fill="#F7C42B" />
                          </svg>
                          <span className={`${font} text-[10px] text-black`}>{p.rating}/5</span>
                        </div>
                        <span className={`${font} text-[10px] text-black text-right`}>{p.sold}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {sortedProducts.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package className="size-12 mx-auto mb-3 opacity-30" />
                <p className={`${font} text-[14px]`}>
                  {shopProducts.length === 0
                    ? "ยังไม่มีสินค้าในร้านนี้"
                    : productSearch.trim()
                      ? `ไม่พบสินค้าที่ตรงกับ "${productSearch}"`
                      : `ไม่มีสินค้าในหมวด ${categoryFilter}`}
                </p>
                {shopProducts.length > 0 && (productSearch.trim() || categoryFilter !== "all") && (
                  <button onClick={() => { setCategoryFilter("all"); setProductSearch(""); }}
                    className={`${font} mt-3 text-[12px] text-[#319754] cursor-pointer hover:underline`}>
                    ล้างตัวกรอง
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            {/* Rating Overview */}
            <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="text-center md:w-40 shrink-0">
                  <p className="text-[48px] text-[#319754]" style={{ fontWeight: 700 }}>{shop.rating}</p>
                  <StarRating rating={Math.round(shop.rating)} size={20} />
                  <p className="text-[12px] text-gray-400 mt-1">{shop.totalReviews.toLocaleString()} รีวิวทั้งหมด</p>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingCounts.map((rc) => (
                    <RatingBar key={rc.stars} stars={rc.stars} count={rc.count} total={totalVisible} />
                  ))}
                </div>
              </div>

              {/* Write review button */}
              {user && user.role === "user" && !isOwner && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="bg-[#319754] text-white px-5 py-2 rounded-full text-[13px] cursor-pointer hover:bg-[#267a43] flex items-center gap-2"
                  >
                    <Edit3 className="size-4" />
                    เขียนรีวิวร้านค้า
                  </button>
                </div>
              )}

              {/* Review Form */}
              {showReviewForm && (
                <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                  <p className="text-[14px] text-gray-700 mb-3" style={{ fontWeight: 600 }}>ให้คะแนนร้านค้า</p>
                  <StarRating rating={reviewRating} size={28} interactive onChange={setReviewRating} />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="เขียนรีวิวของคุณ..."
                    rows={3}
                    className={`${font} w-full mt-3 p-3 border border-gray-200 rounded-xl text-[13px] resize-none outline-none focus:border-[#319754]`}
                  />
                  <div className="flex justify-end gap-2 mt-3">
                    <button
                      onClick={() => setShowReviewForm(false)}
                      className="px-4 py-2 text-gray-500 rounded-full text-[13px] cursor-pointer hover:bg-gray-100"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      className="px-5 py-2 bg-[#319754] text-white rounded-full text-[13px] cursor-pointer hover:bg-[#267a43] flex items-center gap-1.5"
                    >
                      <Send className="size-3.5" />
                      ส่งรีวิว
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin notice */}
            {isAdmin && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                <ShieldCheck className="size-4 text-amber-600" />
                <p className="text-[12px] text-amber-700">โหมด Admin: คุณสามารถซ่อน/ลบรีวิวที่ไม่เหมาะสมได้</p>
              </div>
            )}

            {/* Review List */}
            <div className="space-y-3">
              {visibleReviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white rounded-xl p-4 shadow-sm ${review.hidden ? "opacity-50 border-2 border-dashed border-red-200" : ""}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-full bg-[#319754]/10 flex items-center justify-center text-[14px]">
                        👤
                      </div>
                      <div>
                        <p className="text-[13px] text-gray-800" style={{ fontWeight: 500 }}>{review.userName}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <StarRating rating={review.rating} size={12} />
                          <span className="text-[11px] text-gray-400">{review.date}</span>
                        </div>
                      </div>
                    </div>

                    {/* Admin actions */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toggleHideReview(shop.id, review.id)}
                          className="p-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-400 hover:text-gray-600"
                          title={review.hidden ? "แสดงรีวิว" : "ซ่อนรีวิว"}
                        >
                          {review.hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                        </button>
                        <button
                          onClick={() => { deleteReview(shop.id, review.id); toast.success("ลบรีวิวแล้ว"); }}
                          className="p-1.5 rounded-lg hover:bg-red-50 cursor-pointer text-gray-400 hover:text-red-500"
                          title="ลบรีวิว"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-[13px] text-gray-600 mt-2">{review.comment}</p>
                  {review.hidden && isAdmin && (
                    <span className="inline-block mt-2 text-[11px] text-red-500 bg-red-50 px-2 py-0.5 rounded">ถูกซ่อน</span>
                  )}

                  <div className="flex items-center gap-4 mt-3">
                    <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#319754] cursor-pointer">
                      <ThumbsUp className="size-3.5" />
                      เป็นประโยชน์ ({review.helpful})
                    </button>
                    <button className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-400 cursor-pointer">
                      <Flag className="size-3.5" />
                      รายงาน
                    </button>
                  </div>
                </div>
              ))}

              {visibleReviews.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Star className="size-12 mx-auto mb-3 opacity-30" />
                  <p className="text-[14px]">ยังไม่มีรีวิวสำหรับร้านนี้</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#319754] text-white px-5 py-4 flex items-center justify-between">
              <p className="text-[16px]" style={{ fontWeight: 600 }}>แก้ไขโปรไฟล์ร้านค้า</p>
              <button onClick={() => setShowEditModal(false)} className="cursor-pointer hover:bg-white/10 rounded p-1">
                <X className="size-5" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Banner preview */}
              <div>
                <label className="text-[13px] text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>แบนเนอร์ร้านค้า</label>
                <div className="relative h-32 rounded-xl overflow-hidden bg-gray-100">
                  <ImageWithFallback src={shop.banner} alt="banner" className="w-full h-full object-cover" />
                  <button className="absolute inset-0 bg-black/30 flex items-center justify-center text-white text-[13px] cursor-pointer hover:bg-black/40 transition-all">
                    <Camera className="size-5 mr-2" />
                    เปลี่ยนแบนเนอร์
                  </button>
                </div>
              </div>

              {/* Avatar */}
              <div>
                <label className="text-[13px] text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>รูปโปรไฟล์</label>
                <div className="flex items-center gap-3">
                  <div className="size-16 rounded-full bg-[#319754]/10 flex items-center justify-center text-[28px]">
                    {shop.avatar}
                  </div>
                  <button className="px-4 py-2 border border-gray-200 rounded-full text-[13px] text-gray-600 cursor-pointer hover:bg-gray-50">
                    <Camera className="size-4 inline mr-1.5 -mt-0.5" />
                    เปลี่ยนรูป
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[13px] text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>ชื่อร้านค้า</label>
                <input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`${font} w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] outline-none focus:border-[#319754]`}
                />
              </div>

              <div>
                <label className="text-[13px] text-gray-600 mb-1.5 block" style={{ fontWeight: 500 }}>รายละเอียดร้านค้า</label>
                <textarea
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  className={`${font} w-full px-4 py-2.5 border border-gray-200 rounded-xl text-[13px] resize-none outline-none focus:border-[#319754]`}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowEditModal(false)} className="px-5 py-2 text-gray-500 rounded-full text-[13px] cursor-pointer hover:bg-gray-100">
                  ยกเลิก
                </button>
                <button onClick={handleSaveProfile} className="px-5 py-2 bg-[#319754] text-white rounded-full text-[13px] cursor-pointer hover:bg-[#267a43]">
                  บันทึก
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}