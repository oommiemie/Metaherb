import { useNavigate } from "react-router";
import { useWishlist } from "../store/WishlistContext";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";
import { products } from "../data/products";
import { Heart, ShoppingCart, Star, Trash2 } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { toast } from "sonner";
import imgProd1 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgProd2 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgProd3 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgProd4 from "figma:asset/2760a63146309433afbbc9a2171f4189dfd27e07.png";
import imgProd5 from "figma:asset/623849f160a45efb31fada62d7efbfb3f3bab60f.png";
import imgProd6 from "figma:asset/b251ac55d2f44764962036699fe6da4d05a98501.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const productImages = [imgProd1, imgProd2, imgProd3, imgProd4, imgProd5, imgProd6];

export function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

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
    toast.success("เพิ่มลงรถเข็นแล้ว", { description: p.name });
  };

  return (
    <div>
      <div className="bg-[rgba(214,234,221,0.5)] py-4 text-center">
        <h1 className={`${font} text-[24px] text-[#319754]`} style={{ fontWeight: 500 }}>
          <Heart className="size-6 inline mr-2 fill-[#319754]" />สินค้าที่ชอบ
        </h1>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4 sm:py-6">
        {wishlistProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="size-16 text-gray-200 mx-auto" />
            <p className={`${font} text-[16px] text-gray-400 mt-4`}>ยังไม่มีสินค้าที่ชอบ</p>
            <button onClick={() => navigate("/products")}
              className={`mt-4 bg-[#319754] text-white px-6 py-2 rounded-full text-[14px] ${font} cursor-pointer`}>
              ไปช้อปปิ้ง
            </button>
          </div>
        ) : (
          <>
            <p className={`${font} text-[14px] text-gray-500 mb-4`}>{wishlistProducts.length} รายการ</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
              {wishlistProducts.map((p, i) => (
                <div key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden cursor-pointer" onClick={() => navigate(`/product/${p.id}`)}>
                    <ImageWithFallback src={productImages[i % productImages.length]} alt={p.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWishlist(p.id); toast("ลบออกจากสินค้าที่ชอบแล้ว"); }}
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
                      <ShoppingCart className="size-3.5" /> เพิ่มลงรถเข็น
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