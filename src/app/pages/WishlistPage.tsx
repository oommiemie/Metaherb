import { useNavigate } from "react-router";
import { useWishlist } from "../store/WishlistContext";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { useLanguage } from "../store/LanguageContext";
import { products } from "../data/products";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const productImages = [
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "https://images.unsplash.com/photo-1559525839-d9acfd03c2cf?w=600&q=80",
  "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
  "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=600&q=80",
  "https://images.unsplash.com/photo-1591282017732-207fbba7dfd4?w=600&q=80",
  "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=600&q=80",
];

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const wishlistProducts = products.filter((p) => wishlist.has(p.id));

  const handleAddToCart = (p: typeof products[0], i: number) => {
    if (!isAuthenticated) { navigate("/login"); return; }
    addItem({
      productId: p.id,
      name: p.name,
      image: productImages[i % productImages.length],
      price: p.price,
      originalPrice: p.originalPrice,
      option: p.options[0],
      quantity: 1,
      inStock: true,
    });
    toast.success(t("wishlist_added_cart"), { description: p.name });
  };

  return (
    <div>
      <div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[80px] md:pt-[136px] pb-5 md:pb-6 text-center px-4">
        <h1 className={`${font} text-[20px] sm:text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>
          <Heart className="size-5 sm:size-6 inline mr-2 fill-[#319754]" />{t("wishlist_title")}
        </h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="size-16 text-gray-200 mx-auto" />
            <p className={`${font} text-[16px] text-gray-400 mt-4`}>{t("wishlist_empty")}</p>
            <button onClick={() => navigate("/products")}
              className={`mt-4 bg-[#319754] text-white px-6 py-2 rounded-full text-[14px] ${font} cursor-pointer`}>
              {t("wishlist_shop")}
            </button>
          </div>
        ) : (
          <>
            <p className={`${font} text-[14px] text-gray-500 mb-4`}>{wishlistProducts.length} {t("wishlist_count_unit")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {wishlistProducts.map((p, i) => (
                <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                    <ImageWithFallback src={productImages[i % productImages.length]} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); toast(t("pd_removed_from_wishlist")); }}
                      className="absolute top-2 right-2 size-8 bg-white/90 rounded-full flex items-center justify-center cursor-pointer shadow-sm"
                    >
                      <Heart className="size-4 fill-[#ff383c] text-[#ff383c]" />
                    </button>
                    {p.discount && (
                      <span className={`absolute top-2 left-2 bg-[#ee4d2d] text-white text-[10px] px-2 py-0.5 rounded ${font}`}>{p.discount}</span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className={`${font} text-[13px] text-gray-800 truncate cursor-pointer`} onClick={() => navigate(`/product/${p.id}`)}>{p.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 600 }}>฿{p.price.toFixed(2)}</span>
                      {p.originalPrice && <span className={`${font} text-[11px] text-gray-400 line-through`}>฿{p.originalPrice.toFixed(2)}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <div className="flex items-center gap-1">
                        <Star className="size-3 fill-[#f7931d] text-[#f7931d]" />
                        <span className={`${font} text-[11px] text-gray-500`}>{p.rating}</span>
                      </div>
                      <span className={`${font} text-[11px] text-gray-400`}>{p.sold}</span>
                    </div>
                    <button
                      onClick={() => handleAddToCart(p, i)}
                      className={`w-full mt-2 py-1.5 rounded-full bg-[#319754] text-white text-[12px] ${font} cursor-pointer hover:bg-[#267a43] flex items-center justify-center gap-1`}
                    >
                      <ShoppingCart className="size-3.5" /> {t("wishlist_add_cart")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}