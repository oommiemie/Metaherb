import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useShop } from "../store/ShopContext";
import { useAuth } from "../store/AuthContext";
import { useChat } from "../store/ChatContext";
import { products } from "../data/products";
import { getShopIdByName } from "../data/shops";
import { Star, Heart, MessageCircle, MapPin, Clock, ShieldCheck, Package, Users, TrendingUp, ChevronRight, ThumbsUp, Flag, Eye, EyeOff, Trash2, Edit3, Camera, X, Send, Store } from "lucide-react";
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

  const [activeTab, setActiveTab] = useState<"products" | "reviews">("products");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [productSort, setProductSort] = useState<"default" | "price-asc" | "price-desc" | "rating">("default");

  const shop = getShop(shopId || "");

  if (!shop) {
    return (
      <div className={`${font} text-center py-20`}>
        <Store className="size-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-[16px]">ไม่พบร้านค้านี้</p>
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

  const sortedProducts = [...shopProducts].sort((a, b) => {
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
      {/* Banner */}
      <div className="relative h-[200px] md:h-[280px] overflow-hidden">
        <ImageWithFallback
          src={shop.banner}
          alt={shop.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {isOwner && (
          <button
            onClick={openEditModal}
            className="absolute top-4 right-4 bg-white/90 text-gray-700 px-3 py-1.5 rounded-full flex items-center gap-1.5 cursor-pointer hover:bg-white text-[13px] shadow"
          >
            <Edit3 className="size-4" />
            แก้ไขโปรไฟล์
          </button>
        )}
      </div>

      {/* Shop Info Card */}
      <div className="max-w-5xl mx-auto px-4 -mt-16 relative z-10">
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
                        {following ? "ติดตามแล้ว" : "ติดตาม"}
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
              <div className="flex items-center gap-6 mt-1">
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
                  <p className="text-[10px] text-[#99a1af]">ผู้ติดตาม</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[18px] text-[#101828]" style={{ fontWeight: 700 }}>{shop.totalProducts}</p>
                  <p className="text-[10px] text-[#99a1af]">สินค้า</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <p className="text-[18px] text-[#101828]" style={{ fontWeight: 700 }}>{shop.totalSold}</p>
                  <p className="text-[10px] text-[#99a1af]">ขายแล้ว</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-6 py-3 text-[14px] cursor-pointer transition-all relative ${
              activeTab === "products" ? "text-[#319754]" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: activeTab === "products" ? 600 : 400 }}
          >
            <Package className="size-4 inline mr-1.5 -mt-0.5" />
            สินค้า ({shopProducts.length})
            {activeTab === "products" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#319754]" />}
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-6 py-3 text-[14px] cursor-pointer transition-all relative ${
              activeTab === "reviews" ? "text-[#319754]" : "text-gray-500 hover:text-gray-700"
            }`}
            style={{ fontWeight: activeTab === "reviews" ? 600 : 400 }}
          >
            <Star className="size-4 inline mr-1.5 -mt-0.5" />
            รีวิวร้านค้า ({visibleReviews.length})
            {activeTab === "reviews" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#319754]" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-6 pb-20">
        {activeTab === "products" && (
          <div>
            {/* Sort */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-[14px] text-gray-600">สินค้าทั้งหมด {shopProducts.length} รายการ</p>
              <div className="relative">
                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value as typeof productSort)}
                  className={`${font} text-[14px] text-black bg-white rounded-full px-6 py-2.5 pr-12 cursor-pointer appearance-none outline-none`}
                >
                  <option value="default">เรียงตามค่าเริ่มต้น</option>
                  <option value="price-asc">ราคาต่ำ → สูง</option>
                  <option value="price-desc">ราคาสูง → ต่ำ</option>
                  <option value="rating">คะแนนสูงสุด</option>
                </select>
                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="16" height="9" viewBox="0 0 16 9" fill="none">
                    <path d="M7.83767 9C8.06314 9 8.28862 8.91545 8.44194 8.75493L15.4228 2.05352C15.5761 1.90986 15.6663 1.72394 15.6663 1.51268C15.6663 1.07323 15.3145 0.73521 14.8455 0.73521C14.6201 0.73521 14.4127 0.819718 14.2594 0.954933L7.35062 7.57182H8.31568L1.40699 0.954933C1.26269 0.819718 1.05525 0.73521 0.820745 0.73521C0.351748 0.73521 0 1.07323 0 1.51268C0 1.72394 0.0901917 1.90986 0.243518 2.06197L7.22436 8.75493C7.39572 8.91545 7.60316 9 7.83767 9Z" fill="black" fillOpacity="0.85" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-[16px]">
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
                          toast(wishlisted ? "ลบออกจากสินค้าที่ชอบแล้ว" : "เพิ่มในสินค้าที่ชอบแล้ว");
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

            {shopProducts.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <Package className="size-12 mx-auto mb-3 opacity-30" />
                <p className="text-[14px]">ยังไม่มีสินค้าในร้านนี้</p>
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