import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { ChevronLeft, Heart, MessageCircle, Share2, Star, BadgeCheck, MapPin, Package, Clock, Award, Phone, Mail, Globe, Calendar, TrendingUp, Beaker, ThumbsUp, Flag } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useChat } from "../store/ChatContext";
import { toast } from "sonner";
import { MATERIALS, GRADE_STYLE, getSupplierBySlug } from "../data/herbalMaterials";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

interface SupplierReview {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

const MOCK_REVIEWS: SupplierReview[] = [
  { id: "rv-1", userName: "บริษัท ชาเขียวไทย จก.",    rating: 5, date: "12 พ.ค. 2568", comment: "วัตถุดิบสะอาด แห้งสนิท สีและกลิ่นเป็นไปตามสเปค สั่งมาแล้ว 3 ครั้ง คุณภาพคงที่ ไม่มีปัญหา ส่งของตรงเวลา แนะนำเลยครับ", helpful: 24 },
  { id: "rv-2", userName: "Thai Herbal Wholesale",   rating: 5, date: "5 พ.ค. 2568",  comment: "ส่งของเร็ว แพ็คมาเรียบร้อย เกรด Premium คุ้มราคา ใช้ทำชาส่งออก ลูกค้าต่างชาติชอบมาก", helpful: 18 },
  { id: "rv-3", userName: "โรงงานสมุนไพรอุดร",       rating: 4, date: "28 เม.ย. 2568", comment: "คุณภาพดี ราคาเหมาะสม MOQ เหมาะกับโรงงานขนาดกลาง ตอบกลับเร็ว มีตัวอย่างให้ก่อนสั่งจริง", helpful: 15 },
  { id: "rv-4", userName: "Aromatherapy by Anna",     rating: 5, date: "20 เม.ย. 2568", comment: "เกรด A คุณภาพคงที่ ทุก batch สม่ำเสมอ ใบรับรองครบถ้วน Supplier เป็นมืออาชีพ", helpful: 11 },
  { id: "rv-5", userName: "ร้านชาสมุนไพรปู่",         rating: 4, date: "10 เม.ย. 2568", comment: "ของดี ราคาถูกกว่าที่อื่น มีรอบส่งทุกสัปดาห์ บริการดี", helpful: 8 },
  { id: "rv-6", userName: "Spa Wellness Phuket",     rating: 5, date: "3 เม.ย. 2568",  comment: "สั่งมาทำสปา ลูกค้าชอบมาก กลิ่นหอม คุณภาพ Premium จริงๆ", helpful: 14 },
  { id: "rv-7", userName: "ทดสอบ B2B",                rating: 3, date: "25 มี.ค. 2568", comment: "รอบแรกของขนส่งช้าไปนิด แต่ตัวสินค้าโอเค ครั้งต่อๆ ไปดีขึ้น", helpful: 4 },
  { id: "rv-8", userName: "Herbal Tea Export Co.",   rating: 5, date: "18 มี.ค. 2568", comment: "ทำงานด้วยกันมา 2 ปีแล้ว Supplier น่าเชื่อถือ คุยง่าย ส่งของตรงเวลาเสมอ มี Lab test ให้ทุก lot", helpful: 32 },
];

function StarRating({ rating, size = 16, interactive = false, onChange }: { rating: number; size?: number; interactive?: boolean; onChange?: (r: number) => void }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 20 20"
          fill={i <= rating ? "#f59e0b" : "#e5e7eb"}
          className={interactive ? "cursor-pointer hover:scale-110 transition-transform" : ""}
          onClick={() => interactive && onChange?.(i)}>
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
      <Star className="size-3 text-amber-400" fill="#fbbf24" strokeWidth={0} />
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className={`${font} text-[11px] text-gray-400 w-8`}>{count}</span>
    </div>
  );
}

export default function SupplierDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openChat } = useChat();

  const supplier = id ? getSupplierBySlug(id) : undefined;
  const supplierMaterials = supplier ? MATERIALS.filter((m) => m.supplier === supplier.name) : [];

  const [activeTab, setActiveTab] = useState<"materials" | "about" | "reviews">("materials");
  const [following, setFollowing] = useState(false);

  const reviews = MOCK_REVIEWS;
  const ratingCounts = [5, 4, 3, 2, 1].map((s) => ({
    stars: s,
    count: reviews.filter((r) => r.rating === s).length,
  }));
  const reviewAvg = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;

  if (!supplier) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-12 text-center">
        <Beaker className="size-12 text-gray-300 mx-auto mb-3" strokeWidth={1.5} />
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบ Supplier รายการนี้</p>
        <button onClick={() => navigate("/market")}
          className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#287745] transition-colors cursor-pointer`}>
          <ChevronLeft className="size-3.5" strokeWidth={2.4} />
          กลับสู่ตลาดวัตถุดิบ
        </button>
      </div>
    );
  }

  // Aggregate stats from materials
  const avgRating = supplierMaterials.length > 0
    ? (supplierMaterials.reduce((sum, m) => sum + m.rating, 0) / supplierMaterials.length).toFixed(1)
    : "—";
  const totalStock = supplierMaterials.reduce((sum, m) => sum + m.stock, 0);
  const location = supplierMaterials[0]?.location || "—";
  const supplierVerified = supplierMaterials[0]?.supplierVerified ?? false;

  const handleFollow = () => {
    setFollowing(!following);
    toast.success(following ? "เลิกติดตามแล้ว" : `ติดตาม ${supplier.name} แล้ว`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("คัดลอกลิงก์เรียบร้อย");
  };

  return (
    <div className={`${font} bg-[#fafafa] min-h-screen`}>
      {/* Banner — flush with green appbar */}
      <div className="relative h-[264px] md:h-[376px] overflow-hidden -mt-[64px] md:-mt-[116px]">
        <ImageWithFallback src={supplier.banner} alt={supplier.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
        {/* Top bar — 24px below appbar, aligned with profile container */}
        <div className="absolute top-[88px] md:top-[140px] left-0 right-0">
          <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 bg-white/95 hover:bg-white text-gray-700 px-3.5 py-1.5 rounded-full cursor-pointer transition-colors shadow-sm">
              <ChevronLeft className="size-3.5" strokeWidth={2.4} />
              <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>กลับ</span>
            </button>
            <button onClick={handleShare}
              className="inline-flex items-center justify-center bg-white/95 hover:bg-white text-gray-700 rounded-full size-9 cursor-pointer transition-colors shadow-sm">
              <Share2 className="size-3.5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Card — overlaps banner */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 -mt-[60px] relative z-10">
        <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.06)] p-5 md:p-6 flex flex-col lg:flex-row gap-5 items-start">
          {/* Avatar */}
          <div className="size-[100px] md:size-[112px] rounded-full bg-[#319754] flex items-center justify-center text-white shrink-0 -mt-12 border-4 border-white shadow-md">
            <span className={`${fontBold} text-[44px]`} style={{ fontWeight: 700 }}>{supplier.name.charAt(0)}</span>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col gap-2 min-w-0 w-full">
            {/* Row 1: Name + buttons */}
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className={`${font} text-[22px] md:text-[26px] text-black`} style={{ fontWeight: 700 }}>{supplier.name}</h1>
                {supplierVerified && (
                  <span className={`${font} inline-flex items-center gap-1 text-[11px] bg-[#319754]/12 text-[#287745] px-2.5 py-1 rounded-full`} style={{ fontWeight: 600 }}>
                    <BadgeCheck className="size-3" strokeWidth={2.4} />
                    Verified Supplier
                  </span>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={handleFollow}
                  className={`${font} inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-all ${
                    following ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-[#319754] text-white hover:bg-[#287745]"
                  }`} style={{ fontWeight: 500 }}>
                  <Heart className={`size-3.5 ${following ? "fill-[#ff383c] text-[#ff383c]" : ""}`} strokeWidth={2.2} />
                  {following ? "กำลังติดตาม" : "ติดตาม"}
                </button>
                <button onClick={() => openChat("metaherb")}
                  className={`${font} inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-[#319754] text-[#319754] hover:bg-[#319754]/5 text-[13px] cursor-pointer transition-colors`}
                  style={{ fontWeight: 500 }}>
                  <MessageCircle className="size-3.5" strokeWidth={2.2} />
                  แชท
                </button>
              </div>
            </div>

            {/* Description */}
            <p className={`${font} text-[13px] text-gray-600 leading-relaxed max-w-[720px]`}>
              {supplier.description}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap gap-x-5 gap-y-1.5 items-center text-[12px] text-gray-500 mt-1">
              <span className="flex items-center gap-1.5"><MapPin className="size-3.5" strokeWidth={2.2} />{location}</span>
              <span className="flex items-center gap-1.5"><Calendar className="size-3.5" strokeWidth={2.2} />เข้าร่วม {supplier.established}</span>
              <span className="flex items-center gap-1.5"><TrendingUp className="size-3.5" strokeWidth={2.2} />ตอบกลับ {supplier.responseRate}%</span>
              <span className="flex items-center gap-1.5"><Clock className="size-3.5" strokeWidth={2.2} />{supplier.responseTime}</span>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-5 md:gap-7 mt-3 pt-3 border-t border-gray-100 flex-wrap">
              <div className="text-center">
                <p className={`${fontBold} text-[20px] text-[#319754]`} style={{ fontWeight: 700 }}>{avgRating}</p>
                <div className="flex items-center gap-0.5 justify-center">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-2.5" fill={j < Math.round(Number(avgRating)) ? "#F7C42B" : "#E5E5E5"} strokeWidth={0} />
                  ))}
                </div>
                <p className={`${font} text-[10px] text-gray-400 mt-0.5`}>{supplier.totalReviews.toLocaleString()} รีวิว</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className={`${fontBold} text-[20px] text-black`} style={{ fontWeight: 700 }}>{supplier.followers.toLocaleString()}</p>
                <p className={`${font} text-[10px] text-gray-400`}>ผู้ติดตาม</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className={`${fontBold} text-[20px] text-black`} style={{ fontWeight: 700 }}>{supplierMaterials.length}</p>
                <p className={`${font} text-[10px] text-gray-400`}>วัตถุดิบ</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className={`${fontBold} text-[20px] text-black`} style={{ fontWeight: 700 }}>{totalStock.toLocaleString()}</p>
                <p className={`${font} text-[10px] text-gray-400`}>กก. ในสต็อก</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex border-b border-gray-200">
          {[
            { id: "materials" as const, label: `วัตถุดิบ (${supplierMaterials.length})`,    Icon: Package },
            { id: "about"     as const, label: "เกี่ยวกับ Supplier",                            Icon: Award },
            { id: "reviews"   as const, label: `รีวิว (${supplier.totalReviews.toLocaleString()})`, Icon: Star },
          ].map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`${font} px-5 md:px-6 py-3 text-[13px] cursor-pointer transition-colors relative inline-flex items-center gap-1.5 ${
                  active ? "text-[#319754]" : "text-gray-500 hover:text-gray-700"
                }`} style={{ fontWeight: active ? 600 : 500 }}>
                <tab.Icon className="size-3.5" strokeWidth={2.2} />
                {tab.label}
                {active && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#319754]" />}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="py-6">
          {/* Materials tab */}
          {activeTab === "materials" && (
            supplierMaterials.length === 0 ? (
              <div className="bg-white rounded-2xl py-16 flex flex-col items-center gap-2 text-gray-400">
                <Package className="size-10" strokeWidth={1.5} />
                <p className={`${font} text-[14px]`}>Supplier ยังไม่มีวัตถุดิบในร้าน</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {supplierMaterials.map((m) => {
                  const gStyle = GRADE_STYLE[m.grade];
                  return (
                    <div key={m.id} onClick={() => { navigate(`/market/${m.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40 transition-all duration-300 group cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <ImageWithFallback src={m.image} alt={m.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        <div className="absolute top-2.5 left-2.5">
                          <span className={`${font} text-[10px] px-2 py-1 rounded-full shadow-sm`}
                            style={{ backgroundColor: gStyle.bg, color: gStyle.color, fontWeight: 600 }}>
                            เกรด {m.grade}
                          </span>
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                          <span className={`${font} text-[10px] text-white`}>คงเหลือ {m.stock.toLocaleString()} กก.</span>
                        </div>
                      </div>
                      <div className="p-3 flex flex-col gap-1.5">
                        <h3 className={`${font} text-[13px] text-black truncate`} style={{ fontWeight: 600 }}>{m.name}</h3>
                        <p className={`${font} text-[11px] text-gray-500 italic truncate`}>{m.scientificName}</p>
                        <div className="flex items-end justify-between mt-1 pt-1 border-t border-gray-100">
                          <span className={`${fontBold} text-[16px] text-[#319754]`} style={{ fontWeight: 700 }}>
                            ฿{m.pricePerKg.toLocaleString()}<span className={`${font} text-[10px] text-gray-500`} style={{ fontWeight: 400 }}> /กก.</span>
                          </span>
                          <span className={`${font} text-[10px] text-gray-500`}>MOQ {m.moq} กก.</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          )}

          {/* About tab */}
          {activeTab === "about" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 md:p-6 border border-gray-100 flex flex-col gap-5">
                <div>
                  <h3 className={`${font} text-[18px] text-black mb-2`} style={{ fontWeight: 600 }}>เกี่ยวกับ Supplier</h3>
                  <p className={`${font} text-[14px] text-gray-700 leading-relaxed`}>{supplier.description}</p>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div>
                  <h3 className={`${font} text-[16px] text-black mb-3`} style={{ fontWeight: 600 }}>ใบรับรองและมาตรฐาน</h3>
                  <div className="flex flex-wrap gap-2">
                    {supplier.certifications.map((c) => (
                      <span key={c} className={`${font} inline-flex items-center gap-1.5 text-[12px] bg-[#319754]/8 text-[#287745] px-3 py-1.5 rounded-full`} style={{ fontWeight: 600 }}>
                        <Award className="size-3" strokeWidth={2.4} />
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-px w-full bg-gray-200" />
                <div>
                  <h3 className={`${font} text-[16px] text-black mb-3`} style={{ fontWeight: 600 }}>ข้อมูลทั่วไป</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                    {[
                      { Icon: Calendar,   label: "ก่อตั้งเมื่อ",     value: supplier.established },
                      { Icon: MapPin,     label: "ที่ตั้ง",            value: location },
                      { Icon: TrendingUp, label: "อัตราตอบกลับ",   value: `${supplier.responseRate}%` },
                      { Icon: Clock,      label: "เวลาตอบกลับ",     value: supplier.responseTime },
                      { Icon: Package,    label: "วัตถุดิบในร้าน",  value: `${supplierMaterials.length} รายการ` },
                      { Icon: Star,       label: "คะแนนเฉลี่ย",     value: `${avgRating}/5` },
                    ].map((s) => (
                      <div key={s.label} className="flex items-start gap-2.5 py-1">
                        <s.Icon className="size-3.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={2.2} />
                        <div className="flex-1 min-w-0 flex items-center gap-2">
                          <span className={`${font} text-[12px] text-gray-500 w-[110px] shrink-0`}>{s.label}</span>
                          <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>{s.value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 flex flex-col gap-3 h-fit">
                <h3 className={`${font} text-[16px] text-black`} style={{ fontWeight: 600 }}>ติดต่อ Supplier</h3>
                <div className="flex flex-col gap-2.5 mt-1">
                  <a href={`tel:${supplier.contact.phone}`}
                    className={`${font} flex items-center gap-2.5 text-[13px] text-gray-700 hover:text-[#319754] transition-colors`}>
                    <div className="size-8 rounded-lg bg-[#319754]/10 flex items-center justify-center shrink-0">
                      <Phone className="size-3.5 text-[#319754]" strokeWidth={2.4} />
                    </div>
                    {supplier.contact.phone}
                  </a>
                  <a href={`mailto:${supplier.contact.email}`}
                    className={`${font} flex items-center gap-2.5 text-[13px] text-gray-700 hover:text-[#319754] transition-colors break-all`}>
                    <div className="size-8 rounded-lg bg-[#319754]/10 flex items-center justify-center shrink-0">
                      <Mail className="size-3.5 text-[#319754]" strokeWidth={2.4} />
                    </div>
                    {supplier.contact.email}
                  </a>
                  {supplier.contact.website && (
                    <a href={`https://${supplier.contact.website}`} target="_blank" rel="noopener noreferrer"
                      className={`${font} flex items-center gap-2.5 text-[13px] text-gray-700 hover:text-[#319754] transition-colors break-all`}>
                      <div className="size-8 rounded-lg bg-[#319754]/10 flex items-center justify-center shrink-0">
                        <Globe className="size-3.5 text-[#319754]" strokeWidth={2.4} />
                      </div>
                      {supplier.contact.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === "reviews" && (
            <div>
              {/* Rating Overview */}
              <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="text-center md:w-40 shrink-0">
                    <p className={`${fontBold} text-[48px] text-[#319754] leading-none`} style={{ fontWeight: 700 }}>{reviewAvg.toFixed(1)}</p>
                    <div className="flex justify-center mt-2">
                      <StarRating rating={Math.round(reviewAvg)} size={20} />
                    </div>
                    <p className={`${font} text-[12px] text-gray-400 mt-1.5`}>{reviews.length.toLocaleString()} รีวิวทั้งหมด</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {ratingCounts.map((rc) => (
                      <RatingBar key={rc.stars} stars={rc.stars} count={rc.count} total={reviews.length} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Review List */}
              <div className="space-y-3">
                {reviews.map((review) => (
                  <div key={review.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-[#319754]/10 flex items-center justify-center text-[16px]">
                          🏢
                        </div>
                        <div>
                          <p className={`${font} text-[13px] text-gray-800`} style={{ fontWeight: 500 }}>{review.userName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <StarRating rating={review.rating} size={12} />
                            <span className={`${font} text-[11px] text-gray-400`}>{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className={`${font} text-[13px] text-gray-600 mt-2 leading-relaxed`}>{review.comment}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button className={`${font} flex items-center gap-1 text-[11px] text-gray-400 hover:text-[#319754] cursor-pointer transition-colors`}>
                        <ThumbsUp className="size-3.5" />
                        เป็นประโยชน์ ({review.helpful})
                      </button>
                      <button className={`${font} flex items-center gap-1 text-[11px] text-gray-400 hover:text-red-400 cursor-pointer transition-colors`}>
                        <Flag className="size-3.5" />
                        รายงาน
                      </button>
                    </div>
                  </div>
                ))}

                {reviews.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <Star className="size-12 mx-auto mb-3 opacity-30" />
                    <p className={`${font} text-[14px]`}>ยังไม่มีรีวิวสำหรับ Supplier นี้</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
