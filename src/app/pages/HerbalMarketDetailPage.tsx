import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, Heart, MessageCircle, Share2, Star, BadgeCheck, Package, Beaker, Clock, Award, Store, ShoppingBag, FileText, ClipboardList, Check } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useLanguage } from "../store/LanguageContext";
import { useChat } from "../store/ChatContext";
import { useWishlist } from "../store/WishlistContext";
import { useCart } from "../store/CartContext";
import { toast } from "sonner";
import { MATERIALS, MATERIAL_IMAGES, GRADE_STYLE, slugifySupplier } from "../data/herbalMaterials";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export default function HerbalMarketDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { openChat } = useChat();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { addItem } = useCart();

  const material = MATERIALS.find((m) => m.id === id);
  const [mainImage, setMainImage] = useState(0);
  const [quantity, setQuantity] = useState(material?.moq ?? 1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [flyingItem, setFlyingItem] = useState<{ x: number; y: number; targetX: number; targetY: number; img: string } | null>(null);
  const addBtnRef = useRef<HTMLButtonElement>(null);

  if (!material) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-center">
        <Beaker className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบวัตถุดิบรายการนี้</p>
        <button onClick={() => navigate("/market")}
          className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          กลับสู่ตลาดวัตถุดิบ
        </button>
      </div>
    );
  }

  // Gallery — show main image first + a few others as thumbnails
  const galleryImages = [material.image, ...MATERIAL_IMAGES.filter((img) => img !== material.image).slice(0, 4)];

  const wishlisted = isWishlisted(material.id);
  const gradeStyle = GRADE_STYLE[material.grade];
  const totalPrice = quantity * material.pricePerKg;
  const belowMoq = quantity < material.moq;

  const handleQuoteRequest = () => {
    navigate(`/market/${material.id}/quote?qty=${quantity}`);
  };

  const handleIssuePR = () => {
    navigate(`/market/${material.id}/pr?qty=${quantity}`);
  };

  const handleAddToCart = () => {
    if (belowMoq) {
      toast.error(`จำนวนต่ำกว่า MOQ — ขั้นต่ำ ${material.moq} กก.`);
      return;
    }

    // Trigger flying animation from button → cart icon
    if (addBtnRef.current) {
      const btnRect = addBtnRef.current.getBoundingClientRect();
      const cartIcon = document.querySelector('[alt="cart"]');
      const targetRect = cartIcon ? cartIcon.getBoundingClientRect() : { left: window.innerWidth - 80, top: 20, width: 40, height: 40 };
      setFlyingItem({
        x: btnRect.left + btnRect.width / 2 - 25,
        y: btnRect.top - 25,
        targetX: targetRect.left + (targetRect.width / 2) - 25,
        targetY: targetRect.top + (targetRect.height / 2) - 25,
        img: material.image,
      });
      setTimeout(() => setFlyingItem(null), 800);
    }

    addItem({
      productId: material.id,
      name: material.name,
      image: material.image,
      price: material.pricePerKg,
      option: `${material.grade} · ${quantity} กก.`,
      quantity,
      inStock: material.stock > 0,
      shopName: material.supplier,
    });
    setAddedToCart(true);
    toast.success(`เพิ่ม "${material.name}" ลงตะกร้าแล้ว`, {
      description: `${quantity} กก. · ฿${totalPrice.toLocaleString()}`,
      action: { label: "ดูตะกร้า", onClick: () => navigate("/cart") },
    });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("คัดลอกลิงก์เรียบร้อย");
  };

  const relatedMaterials = MATERIALS.filter((m) => m.id !== id && m.category === material.category).slice(0, 4);
  const fallbackRelated = MATERIALS.filter((m) => m.id !== id).slice(0, 4);
  const recommended = relatedMaterials.length > 0 ? relatedMaterials : fallbackRelated;

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
      {/* Main section */}
      <div className="flex flex-col lg:flex-row gap-[24px] items-start">
        {/* Left: Top bar + Images */}
        <div className="flex flex-col gap-[10px] shrink-0 w-full lg:w-[450px]">
          {/* Top bar */}
          <div className="flex items-center justify-between w-full">
            <button onClick={() => navigate("/market")}
              className="group inline-flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors">
              <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.4} />
              <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>ช็อปปิ้งต่อ</span>
            </button>
            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => { toggleWishlist(material.id); toast(wishlisted ? "เอาออกจากรายการโปรด" : "เพิ่มในรายการโปรด"); }}
                whileTap={{ scale: 0.92 }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full cursor-pointer transition-colors ${
                  wishlisted ? "bg-[#ff383c]/10 text-[#ff383c]" : "bg-[#f5f5f5] text-gray-700 hover:bg-[#ff383c]/10 hover:text-[#ff383c]"
                }`}>
                <Heart className={`size-3.5 transition-colors ${wishlisted ? "fill-[#ff383c]" : ""}`} strokeWidth={2.2} />
                <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>{wishlisted ? "1" : "0"}</span>
              </motion.button>
              <motion.button onClick={() => openChat("metaherb")}
                whileTap={{ scale: 0.92 }}
                className="inline-flex items-center justify-center bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] rounded-full size-8 cursor-pointer transition-colors">
                <MessageCircle className="size-3.5" strokeWidth={2.2} />
              </motion.button>
              <motion.button onClick={handleShare}
                whileTap={{ scale: 0.92 }}
                className="inline-flex items-center justify-center bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] rounded-full size-8 cursor-pointer transition-colors">
                <Share2 className="size-3.5" strokeWidth={2.2} />
              </motion.button>
            </div>
          </div>

          {/* Main image */}
          <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-gray-100 relative">
            <ImageWithFallback src={galleryImages[mainImage % galleryImages.length]} alt={material.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            {/* Grade pill */}
            <div className="absolute top-3 left-3">
              <span className={`${font} text-[11px] px-2.5 py-1 rounded-full shadow-sm`}
                style={{ background: gradeStyle.bg, color: gradeStyle.color, fontWeight: 700, boxShadow: gradeStyle.shadow, textShadow: gradeStyle.textShadow, letterSpacing: "0.02em" }}>
                {material.grade}
              </span>
            </div>
            {material.supplierVerified && (
              <div className="absolute top-3 right-3 bg-white rounded-full p-1.5 shadow-sm" title="Verified Supplier">
                <BadgeCheck className="size-4 text-[#319754]" fill="#319754" stroke="#fff" strokeWidth={2.5} />
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex gap-[10px] overflow-x-auto py-1 px-1 -mx-1">
            {galleryImages.map((img, i) => (
              <div key={i} onClick={() => setMainImage(i)}
                className={`size-[70px] rounded-[16px] overflow-hidden cursor-pointer shrink-0 relative transition-all ${
                  mainImage === i ? "ring-2 ring-inset ring-[#319754] shadow-[0_0_0_2px_#319754]" : ""
                }`}>
                <ImageWithFallback src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex-1 flex flex-col gap-[20px] w-full">
          {/* Name + Rating */}
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className={`${font} text-[24px] text-black`} style={{ fontWeight: 600 }}>{material.name}</h1>
              <span className={`${font} text-[12px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full`} style={{ fontWeight: 500 }}>
                {material.category}
              </span>
            </div>
            <p className={`${font} text-[14px] text-gray-500 italic`}>{material.scientificName}</p>
            <div className="flex gap-[16px] items-center mt-1">
              <div className="flex items-center gap-1.5">
                <Star className="size-3.5 text-[#f59e0b]" fill="#f59e0b" strokeWidth={0} />
                <span className={`${font} text-[13px] text-black`}>{material.rating.toFixed(1)}/5</span>
              </div>
              <span className="text-gray-300">·</span>
              <span className={`${font} text-[13px] text-gray-600`}>คงเหลือ <span className="text-black" style={{ fontWeight: 600 }}>{material.stock.toLocaleString()}</span> กก.</span>
            </div>
          </div>

          {/* Price card */}
          <div className="bg-white border border-gray-200 rounded-[16px] p-[16px] flex flex-col gap-3">
            <span className={`${font} text-[13px] text-gray-500`}>ราคาวัตถุดิบ</span>
            <div className="flex items-end gap-[10px]">
              <span className={`${font} text-[32px] text-[#319754]`} style={{ fontWeight: 700 }}>฿{material.pricePerKg.toLocaleString()}</span>
              <span className={`${font} text-[14px] text-gray-500 pb-1.5`}>/ กก.</span>
              {quantity >= material.moq && (
                <div className="ml-auto text-right">
                  <p className={`${font} text-[11px] text-gray-500`}>ยอดสุทธิ ({quantity} กก.)</p>
                  <p className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>฿{totalPrice.toLocaleString()}</p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className={`${font} inline-flex items-center gap-1 text-[11px] bg-[#f59e0b]/10 text-[#b45309] px-2 py-1 rounded-full`} style={{ fontWeight: 600 }}>
                <Package className="size-3" strokeWidth={2.4} />
                MOQ: {material.moq} กก.
              </span>
              <span className={`${font} text-[11px] text-gray-500`}>จำนวนสั่งซื้อขั้นต่ำต่อครั้ง</span>
            </div>
          </div>

          {/* Quantity selector */}
          <div className="flex flex-col gap-2">
            <span className={`${font} text-[13px] text-gray-700`} style={{ fontWeight: 500 }}>จำนวน (กก.)</span>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-[#f5f5f5] flex items-center gap-4 px-3 py-2 rounded-full">
                <button onClick={() => setQuantity(Math.max(1, quantity - 5))}
                  className={`${font} text-[16px] text-gray-700 cursor-pointer hover:text-[#319754] transition-colors size-6 flex items-center justify-center`}>
                  −
                </button>
                <input type="number" value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(material.stock, Number(e.target.value) || 1)))}
                  className={`${font} w-16 bg-transparent text-center text-[14px] text-black outline-none tabular-nums`} style={{ fontWeight: 600 }} />
                <button onClick={() => setQuantity(Math.min(material.stock, quantity + 5))}
                  className={`${font} text-[16px] text-gray-700 cursor-pointer hover:text-[#319754] transition-colors size-6 flex items-center justify-center`}>
                  +
                </button>
              </div>
              <button onClick={() => setQuantity(material.moq)}
                className={`${font} text-[11px] text-[#319754] hover:underline cursor-pointer`}>
                ตั้งเป็น MOQ ({material.moq} กก.)
              </button>
              {belowMoq && (
                <span className={`${font} text-[11px] text-[#ff3b30]`}>
                  ต่ำกว่า MOQ — ขั้นต่ำ {material.moq} กก.
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-[10px] flex-wrap py-[8px]">
            <motion.button
              ref={addBtnRef}
              onClick={handleAddToCart}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-center gap-[10px] h-[48px] flex-1 sm:flex-none sm:w-[200px] rounded-full border-2 cursor-pointer transition-colors ${
                addedToCart ? "border-[#319754] bg-[#319754] text-white" : "border-[#db8b0a] text-[#db8b0a] hover:bg-[#db8b0a]/5"
              }`}
              style={{ fontWeight: 600 }}>
              <AnimatePresence mode="wait">
                {addedToCart ? (
                  <motion.span key="added" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2">
                    <Check className="size-4" strokeWidth={2.6} />
                    <span className={`${font} text-[14px]`}>เพิ่มแล้ว!</span>
                  </motion.span>
                ) : (
                  <motion.span key="add" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-[10px]">
                    <ShoppingBag className="size-4" strokeWidth={2.4} />
                    <span className={`${font} text-[14px]`}>เพิ่มใส่รถเข็น</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              onClick={handleQuoteRequest}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={`${font} flex items-center justify-center gap-2 h-[48px] flex-1 sm:flex-none sm:w-[200px] rounded-full border-2 border-[#0088ff] text-[#0088ff] text-[14px] cursor-pointer hover:bg-[#0088ff]/5 transition-colors`}
              style={{ fontWeight: 600 }}>
              <FileText className="size-4" strokeWidth={2.4} />
              ขอใบเสนอราคา
            </motion.button>
            <motion.button
              onClick={handleIssuePR}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className={`${font} flex items-center justify-center gap-2 h-[48px] flex-1 sm:flex-none sm:w-[200px] rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[14px] cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
              style={{ fontWeight: 600 }}>
              <ClipboardList className="size-4" strokeWidth={2.4} />
              ออกใบ PR
            </motion.button>
          </div>

        </div>
      </div>

      {/* Description + Specs card */}
      <div className="bg-white rounded-[16px] p-[20px] flex flex-col gap-[16px] mt-6 border border-gray-100">
        <div className="flex flex-col gap-[10px]">
          <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 600 }}>รายละเอียดวัตถุดิบ</h2>
          <p className={`${font} text-[14px] text-black leading-relaxed`}>
            {material.name} ({material.scientificName}) เป็นวัตถุดิบสมุนไพรคุณภาพคัดสรร จากแหล่งปลูก{material.location} —
            ผ่านกระบวนการทำความสะอาด ตากแห้ง และคัดเกรดด้วยมาตรฐานระดับ{material.grade} —
            พร้อมใบรับรอง {material.certifications.join(" / ")} เหมาะสำหรับโรงงานผลิตอาหารเสริม / ชาสมุนไพร / เครื่องสำอาง
          </p>
        </div>
        <div className="h-px w-full bg-gray-200" />
        <div className="flex flex-col gap-[10px]">
          <h3 className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>ข้อมูลจำเพาะ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
            {[
              { label: "ประเภทวัตถุดิบ",  value: material.category },
              { label: "ชื่อวิทยาศาสตร์",  value: material.scientificName },
              { label: "เกรด",              value: material.grade },
              { label: "MOQ",               value: `${material.moq} กก. / คำสั่งซื้อ` },
              { label: "คงเหลือในสต็อก",   value: `${material.stock.toLocaleString()} กก.` },
              { label: "แหล่งผลิต",         value: material.location },
              { label: "ราคา/กก.",          value: `฿${material.pricePerKg.toLocaleString()}` },
              { label: "บรรจุภัณฑ์",        value: "ถุงสุญญากาศ 5 / 10 / 25 กก." },
            ].map((s) => (
              <div key={s.label} className="flex gap-3 py-1">
                <span className={`${font} text-[13px] text-gray-500 w-[140px] shrink-0`}>{s.label}</span>
                <span className={`${font} text-[13px] text-black`}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-gray-200" />
        <div className="flex flex-col gap-[10px]">
          <h3 className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>ใบรับรองและมาตรฐาน</h3>
          <div className="flex flex-wrap gap-2">
            {material.certifications.map((c) => (
              <span key={c} className={`${font} inline-flex items-center gap-1.5 text-[12px] bg-[#319754]/8 text-[#287745] px-3 py-1.5 rounded-full`} style={{ fontWeight: 600 }}>
                <Award className="size-3" strokeWidth={2.4} />
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Supplier info — mirror ProductDetailPage shop info */}
      <div className="bg-white rounded-[16px] p-[16px] mt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[16px]">
        {/* Left: avatar + info */}
        <div className="flex items-center gap-[16px]">
          <div className="size-[70px] rounded-full bg-[#319754] shrink-0 flex items-center justify-center text-white shadow-[inset_0_-2px_4px_rgba(0,0,0,0.15)]">
            <span className={`${font} text-[24px]`} style={{ fontWeight: 700 }}>{material.supplier.charAt(0)}</span>
          </div>
          <div className="flex flex-col gap-[6px]">
            <div className="flex items-center gap-[8px] flex-wrap">
              <span className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>{material.supplier}</span>
              {material.supplierVerified && (
                <span className={`${font} inline-flex items-center gap-1 text-[10px] bg-[#319754]/12 text-[#287745] px-2 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>
                  <BadgeCheck className="size-2.5" strokeWidth={2.4} />
                  Verified Supplier
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-x-[24px] gap-y-[6px] items-center">
              <div className="flex items-center gap-[6px]">
                <Package className="size-[14px] text-black/85" strokeWidth={2} />
                <span className={`${font} text-[14px] text-black`}>วัตถุดิบในร้าน</span>
                <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>32</span>
                <span className={`${font} text-[14px] text-black`}>รายการ</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Star className="size-[14px] text-[#F7C42B]" fill="#F7C42B" strokeWidth={0} />
                <span className={`${font} text-[14px] text-black`}>คะแนนร้าน</span>
                <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>{material.rating}/5</span>
                <span className={`${font} text-[14px] text-black`}>ทั้งหมด</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Clock className="size-[14px] text-black/85" strokeWidth={2} />
                <span className={`${font} text-[14px] text-black`}>ตอบกลับ</span>
                <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>เฉลี่ย 4 ชม.</span>
              </div>
            </div>
          </div>
        </div>
        {/* Right: action buttons (icon-only, expand on hover) */}
        <div className="flex items-center gap-[10px] shrink-0">
          <button onClick={() => navigate(`/supplier/${slugifySupplier(material.supplier)}`)}
            className={`group/shop flex items-center bg-[#eaf5ee] text-[#319754] h-[40px] rounded-full ${font} cursor-pointer hover:bg-[#d6eadd] transition-all duration-300 overflow-hidden pl-[12px] pr-[12px] hover:pr-[16px]`}>
            <Store className="size-[16px] shrink-0" strokeWidth={2} />
            <span className="grid grid-cols-[0fr] group-hover/shop:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
              <span className="overflow-hidden">
                <span className="block whitespace-nowrap pl-[8px] text-[14px]" style={{ fontWeight: 500 }}>ดูร้าน</span>
              </span>
            </span>
          </button>
          <button onClick={() => openChat("metaherb")}
            className={`group/ask flex items-center bg-[#eaf5ee] text-[#319754] h-[40px] rounded-full ${font} cursor-pointer hover:bg-[#d6eadd] transition-all duration-300 overflow-hidden pl-[12px] pr-[12px] hover:pr-[16px]`}>
            <MessageCircle className="size-[16px] shrink-0" strokeWidth={2} />
            <span className="grid grid-cols-[0fr] group-hover/ask:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
              <span className="overflow-hidden">
                <span className="block whitespace-nowrap pl-[8px] text-[14px]" style={{ fontWeight: 500 }}>แชทกับ Supplier</span>
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Related materials */}
      {recommended.length > 0 && (
        <div className="mt-8">
          <h2 className={`${font} text-[20px] text-black mb-4`} style={{ fontWeight: 600 }}>วัตถุดิบที่เกี่ยวข้อง</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommended.map((m) => {
              const gStyle = GRADE_STYLE[m.grade];
              return (
                <div key={m.id} onClick={() => { navigate(`/market/${m.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <ImageWithFallback src={m.image} alt={m.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`${font} text-[10px] px-2 py-1 rounded-full shadow-sm`}
                        style={{ background: gStyle.bg, color: gStyle.color, fontWeight: 700, boxShadow: gStyle.shadow, textShadow: gStyle.textShadow, letterSpacing: "0.02em" }}>
                        {m.grade}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col gap-1.5">
                    <h3 className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{m.name}</h3>
                    <p className={`${font} text-[11px] text-gray-500 italic truncate`}>{m.scientificName}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`${font} text-[15px] text-[#319754]`} style={{ fontWeight: 700 }}>฿{m.pricePerKg}<span className="text-[11px] text-gray-500" style={{ fontWeight: 400 }}> /กก.</span></span>
                      <span className={`${font} text-[10px] text-gray-500`}>MOQ {m.moq}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Flying item animation overlay — image flies from button → cart icon */}
      <AnimatePresence>
        {flyingItem && (
          <motion.div
            key="flying-cart-item"
            initial={{
              position: "fixed",
              left: flyingItem.x,
              top: flyingItem.y,
              width: 50,
              height: 50,
              opacity: 1,
              scale: 1,
              zIndex: 9999,
              borderRadius: 12,
              overflow: "hidden",
              pointerEvents: "none" as const,
              boxShadow: "0 4px 20px rgba(49,151,84,0.4)",
            }}
            animate={{
              left: flyingItem.targetX,
              top: flyingItem.targetY,
              width: 20,
              height: 20,
              opacity: 0.3,
              scale: 0.3,
              borderRadius: 20,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              left: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
              top: { duration: 0.7, ease: [0.15, 0, 0.2, 1] },
            }}
          >
            <img src={flyingItem.img} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
