import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Share2, Sparkles, Clock, Users, Coins, Check, FlaskConical, Store, MessageCircle, Heart, Send, AlertTriangle, BadgeCheck, ListChecks, Beaker, TrendingUp, CalendarCheck, Star, Lightbulb, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../store/AuthContext";
import { TRIAL_PRODUCTS, loadRegistrations, saveRegistrations, getTrialImages, getActiveRegistration, type TrialProduct, type Registration, type Evaluation } from "../data/trialProducts";
import { EvaluationModal } from "../components/EvaluationModal";
import { TrialCard } from "../components/TrialCard";
import imgLogo from "../../assets/logo.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function TrialDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { user } = useAuth();
  const product = useMemo(() => TRIAL_PRODUCTS.find((p) => p.id === id), [id]);
  const galleryImages = useMemo(() => product ? getTrialImages(product) : [], [product]);
  const [mainImage, setMainImage] = useState(0);
  const [registrations, setRegistrations] = useState(() => loadRegistrations());
  const myRegistration = useMemo(() => registrations.find((r) => r.trialId === id), [registrations, id]);
  const isRegistered = !!myRegistration;
  const isEvaluated = !!myRegistration?.evaluatedAt;
  const activeOther = useMemo(() => {
    const active = getActiveRegistration(registrations);
    return active && active.trialId !== id ? active : null;
  }, [registrations, id]);
  const activeOtherProduct = useMemo(
    () => activeOther ? TRIAL_PRODUCTS.find((p) => p.id === activeOther.trialId) : null,
    [activeOther]
  );
  const [justJoined, setJustJoined] = useState(false);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const relatedTrials = useMemo(
    () => TRIAL_PRODUCTS.filter((p) => p.id !== id).slice(0, 6),
    [id]
  );

  useEffect(() => { window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior }); setMainImage(0); }, [id]);

  if (!product) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-12 text-center">
        <p className={`${font} text-[16px] text-gray-500 mb-4`}>ไม่พบผลิตภัณฑ์ทดสอบนี้</p>
        <button onClick={() => navigate("/trials")} className={`${font} text-[14px] text-[#319754] hover:underline`}>
          กลับไปหน้ารายการ
        </button>
      </div>
    );
  }

  const spotsLeft = product.spotsTotal - product.spotsTaken;
  const pct = (product.spotsTaken / product.spotsTotal) * 100;
  const isClosed = spotsLeft <= 0 || product.endsInDays <= 0;

  const handleJoin = () => {
    if (!product || isRegistered || isClosed) return;
    if (activeOther) {
      toast.error("คุณมีสินค้าทดลองที่ยังไม่ได้ส่งแบบประเมิน", {
        description: `กรุณาส่งแบบประเมินของ "${activeOtherProduct?.name}" ก่อนสมัครรายการใหม่`,
      });
      return;
    }
    if (!user) {
      toast.error("กรุณาเข้าสู่ระบบก่อนเข้าร่วมทดสอบ");
      navigate("/login");
      return;
    }
    navigate(`/trials/${product.id}/apply`);
  };

  const handleEvaluationSubmit = (evaluation: Evaluation) => {
    if (!product) return;
    const next = registrations.map((r) =>
      r.trialId === product.id && !r.evaluatedAt
        ? { ...r, evaluatedAt: Date.now(), evaluation }
        : r
    );
    setRegistrations(next);
    saveRegistrations(next);
    setShowEvalModal(false);
    toast.success("ส่งแบบประเมินสำเร็จ", {
      description: `ได้รับ +${product.rewardPoints.toLocaleString()} คะแนนสะสม — สามารถสมัครรายการใหม่ได้แล้ว`,
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) await navigator.share({ title: product.name, url });
      else { await navigator.clipboard.writeText(url); toast("คัดลอกลิงก์แล้ว"); }
    } catch { /* user cancelled */ }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
      {/* ===== Main section — mirrors ProductDetailPage layout ===== */}
      <div className="flex flex-col lg:flex-row gap-[24px] items-start">
        {/* Left: top bar + image */}
        <div className="flex flex-col gap-[10px] shrink-0 w-full lg:w-[450px]">
          <div className="flex items-center justify-between w-full">
            <button onClick={() => navigate(-1)}
              className="group inline-flex items-center gap-1.5 bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] px-3.5 py-1.5 rounded-full cursor-pointer transition-colors">
              <ChevronLeft className="size-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" strokeWidth={2.4} />
              <span className={`${font} text-[12px]`} style={{ fontWeight: 500 }}>กลับ</span>
            </button>
            <motion.button
              onClick={handleShare}
              whileTap={{ scale: 0.92 }}
              className="inline-flex items-center justify-center bg-[#f5f5f5] hover:bg-[#319754]/10 text-gray-700 hover:text-[#319754] rounded-full size-8 cursor-pointer transition-colors"
              title="แชร์"
            >
              <Share2 className="size-3.5" strokeWidth={2.2} />
            </motion.button>
          </div>
          {/* Main image — like ProductDetailPage */}
          <div className="w-full aspect-square rounded-[16px] overflow-hidden bg-gray-100 relative">
            <img src={galleryImages[mainImage % galleryImages.length]} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
            <div className="absolute top-3 left-3">
              {isRegistered ? (
                <span className={`${font} inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#319754] text-white text-[12px] shadow-md`} style={{ fontWeight: 600 }}>
                  <Check className="size-3" strokeWidth={2.8} /> เข้าร่วมแล้ว
                </span>
              ) : isClosed ? (
                <span className={`${font} inline-flex items-center px-3 py-1 rounded-full bg-gray-600 text-white text-[12px]`} style={{ fontWeight: 600 }}>
                  ปิดรับสมัคร
                </span>
              ) : (
                <span className={`${font} inline-flex items-center gap-1 px-3 py-1 rounded-full text-white text-[12px] shadow-md`}
                  style={{ background: "linear-gradient(135deg, #0088ff, #9747ff)", fontWeight: 600 }}>
                  <Sparkles className="size-3" strokeWidth={2.4} /> Beta
                </span>
              )}
            </div>
          </div>
          {/* Thumbnails — like ProductDetailPage */}
          <div className="flex gap-[10px] overflow-x-auto">
            {galleryImages.map((img, i) => (
              <div key={i} onClick={() => setMainImage(i)}
                className={`size-[70px] rounded-[16px] overflow-hidden cursor-pointer shrink-0 relative ${mainImage === i ? "border-2 border-[#319754]" : "border-2 border-transparent"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: details — mirrors ProductDetailPage text styling */}
        <div className="flex-1 flex flex-col gap-[24px] w-full">
          {/* Name + meta row */}
          <div className="flex flex-col gap-[10px]">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`${font} inline-flex items-center gap-1 text-[11px] text-white px-2.5 py-0.5 rounded-full`} style={{ background: "linear-gradient(135deg, #0088ff, #9747ff)", fontWeight: 600 }}>
                <Sparkles className="size-3" strokeWidth={2.4} /> Beta
              </span>
              <span className={`${font} text-[11px] bg-[#319754]/12 text-[#1d5b32] px-2.5 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>{product.category}</span>
            </div>
            <h1 className={`${font} text-[22px] sm:text-[24px] text-[#1a1a1a] leading-tight break-words`} style={{ fontWeight: 700 }}>{product.name}</h1>
            {(product.studioName || product.detail?.developerName) && (
              <div className="flex items-center gap-2 flex-wrap text-[13px]">
                {product.studioName && (
                  <span className={`${font} inline-flex items-center gap-1.5 text-[#319754]`} style={{ fontWeight: 600 }}>
                    <span className="size-1.5 rounded-full bg-[#319754]" />{product.studioName}
                  </span>
                )}
                {product.studioName && product.detail?.developerName && <span className="text-gray-300">·</span>}
                {product.detail?.developerName && (
                  <span className={`${font} text-gray-600`}>ผู้พัฒนา: <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{product.detail.developerName}</span></span>
                )}
              </div>
            )}
            <p className={`${font} text-[14px] text-gray-700 leading-relaxed`}>{product.detail?.longDescription ?? product.tagline}</p>
          </div>

          {/* Reward + Time + Spots cards */}
          <div className="grid grid-cols-3 gap-[10px]">
            <div className="bg-white rounded-[16px] p-[14px] border border-amber-100"
              style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)" }}>
              <div className="flex items-center gap-1.5 mb-1">
                <Coins className="size-[14px] text-[#d97706]" strokeWidth={2.4} />
                <span className={`${font} text-[11px] text-amber-700`} style={{ fontWeight: 600 }}>คะแนนที่ได้</span>
              </div>
              <p className={`${font} text-[18px] sm:text-[20px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}>
                +{product.rewardPoints.toLocaleString()}
              </p>
            </div>
            <div className="bg-white rounded-[16px] p-[14px] border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="size-[14px] text-gray-600" strokeWidth={2.4} />
                <span className={`${font} text-[11px] text-gray-600`} style={{ fontWeight: 600 }}>เหลือเวลา</span>
              </div>
              <p className={`${font} text-[18px] sm:text-[20px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}>
                {product.endsInDays} <span className="text-[13px] text-gray-500" style={{ fontWeight: 500 }}>วัน</span>
              </p>
            </div>
            <div className="bg-white rounded-[16px] p-[14px] border border-gray-200">
              <div className="flex items-center gap-1.5 mb-1">
                <Users className="size-[14px] text-gray-600" strokeWidth={2.4} />
                <span className={`${font} text-[11px] text-gray-600`} style={{ fontWeight: 600 }}>ที่นั่ง</span>
              </div>
              <p className={`${font} text-[18px] sm:text-[20px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}>
                {product.spotsTaken}<span className="text-[13px] text-gray-500" style={{ fontWeight: 500 }}>/{product.spotsTotal}</span>
              </p>
              <div className="h-[4px] rounded-full bg-gray-100 overflow-hidden mt-1.5">
                <div className="h-full rounded-full" style={{
                  width: `${Math.min(100, pct)}%`,
                  background: pct >= 90 ? "#dc2626" : pct >= 60 ? "#f59e0b" : "#319754",
                }} />
              </div>
            </div>
          </div>

          {/* Conditions */}
          <div className="bg-[#f0fdf4] rounded-[16px] p-[16px] border border-[#319754]/15">
            <h2 className={`${font} text-[14px] text-[#1d5b32] mb-2`} style={{ fontWeight: 700 }}>เงื่อนไขการเข้าร่วม</h2>
            <ul className={`${font} text-[13px] text-gray-700 space-y-1 leading-relaxed`}>
              <li>· METAHERB จะคัดเลือก tester และติดต่อกลับภายใน 2 วันทำการ</li>
              <li>· ส่งผลิตภัณฑ์ฟรี ไม่มีค่าใช้จ่าย — กรุณายืนยันที่อยู่ให้ถูกต้อง</li>
              <li>· <span style={{ fontWeight: 600 }}>สมัครได้ครั้งละ 1 รายการ</span> — รายการถัดไปสมัครได้หลังส่งแบบประเมินครบ</li>
              <li>· ต้องส่งแบบประเมินผลการทดสอบภายใน 30 วัน เพื่อรับ +{product.rewardPoints.toLocaleString()} คะแนน</li>
              <li>· คะแนนสามารถใช้แลกของรางวัล/ส่วนลดในระบบสมาชิกได้</li>
            </ul>
          </div>

          {/* Notice: only one active trial at a time */}
          {activeOther && !isRegistered && (
            <div className="rounded-[14px] px-4 py-3 border border-amber-200 flex items-start gap-2.5"
              style={{ background: "linear-gradient(135deg, #fffbeb, #fef3c7)" }}>
              <Coins className="size-[16px] text-[#d97706] shrink-0 mt-0.5" strokeWidth={2.4} />
              <p className={`${font} text-[13px] text-amber-800 leading-relaxed`}>
                คุณมีสินค้าทดลองที่ยังไม่ได้ส่งแบบประเมิน — <span style={{ fontWeight: 700 }}>"{activeOtherProduct?.name}"</span><br />
                สามารถสมัครรายการใหม่ได้หลังส่งแบบประเมินครบตามเงื่อนไข
              </p>
            </div>
          )}

          {/* CTA — context-aware:
              - Already evaluated → status badge (no action)
              - Registered, not evaluated → "ทำแบบประเมิน" (unlocks new applications)
              - Otherwise → "เข้าร่วมทดลองใช้" or locked variant
          */}
          {isRegistered && isEvaluated ? (
            <div className="inline-flex items-center gap-2 h-[48px] w-full sm:w-[260px] justify-center rounded-full bg-[#319754]/10 border border-[#319754]/20">
              <Check className="size-4 text-[#319754]" strokeWidth={2.8} />
              <span className={`${font} text-[14px] text-[#1d5b32]`} style={{ fontWeight: 600 }}>ทดสอบเสร็จสิ้น</span>
            </div>
          ) : isRegistered && !isEvaluated ? (
            <div className="flex flex-col sm:flex-row gap-2.5 w-full sm:w-auto">
              <div className="inline-flex items-center gap-2 h-[48px] px-5 justify-center rounded-full bg-[#319754]/10 border border-[#319754]/20">
                <Check className="size-4 text-[#319754]" strokeWidth={2.8} />
                <span className={`${font} text-[14px] text-[#1d5b32] whitespace-nowrap`} style={{ fontWeight: 600 }}>
                  {justJoined ? "ลงทะเบียนสำเร็จ" : "เข้าร่วมแล้ว"}
                </span>
              </div>
              <button
                onClick={() => setShowEvalModal(true)}
                className={`${font} flex items-center justify-center gap-[10px] h-[48px] px-5 rounded-full bg-[#319754] text-white text-[14px] cursor-pointer hover:bg-[#267a43] transition-colors whitespace-nowrap`}
                style={{ fontWeight: 500 }}
              >
                <Send className="size-4" strokeWidth={2.4} />
                ทำแบบประเมิน · รับ +{product.rewardPoints.toLocaleString()} คะแนน
              </button>
            </div>
          ) : (
            <button
              onClick={handleJoin}
              disabled={isClosed || !!activeOther}
              className={`flex items-center justify-center gap-[10px] h-[48px] w-full sm:w-[260px] rounded-full ${font} text-[14px] transition-colors ${
                isClosed || activeOther
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#319754] text-white cursor-pointer hover:bg-[#267a43]"
              }`}
              style={{ fontWeight: 500 }}
            >
              <AnimatePresence mode="wait">
                {isClosed ? (
                  <motion.span key="closed" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                    ปิดรับสมัครแล้ว
                  </motion.span>
                ) : activeOther ? (
                  <motion.span key="locked" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                    ทดลองครั้งละ 1 รายการ
                  </motion.span>
                ) : (
                  <motion.span key="join" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-2">
                    <Send className="size-4" strokeWidth={2.4} />
                    เข้าร่วมทดลองใช้
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </div>

      {/* ===== Rich detail sections (rendered only when data exists) ===== */}
      <DetailSections product={product} isClosed={isClosed} spotsLeft={spotsLeft} />

      {/* ===== Shop info ===== */}
      <div className="bg-white rounded-[16px] p-[16px] mt-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-[16px] border border-gray-200">
        <div className="flex items-center gap-[16px]">
          <img src={imgLogo} className="size-[70px] rounded-full object-cover shrink-0 bg-gray-50 p-2" alt="METAHERB Store" />
          <div className="flex flex-col gap-[6px]">
            <span className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>METAHERB Store</span>
            <div className="flex flex-wrap gap-x-[24px] gap-y-[6px] items-center">
              <div className="flex items-center gap-[6px]">
                <FlaskConical className="size-[14px] text-black/85" strokeWidth={2} />
                <span className={`${font} text-[14px] text-black`}>โปรแกรมทดลอง</span>
                <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>{TRIAL_PRODUCTS.length}</span>
                <span className={`${font} text-[14px] text-black`}>รายการ</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Users className="size-[14px] text-black/85" strokeWidth={2} />
                <span className={`${font} text-[14px] text-black`}>ผู้ร่วมทดสอบ</span>
                <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>1,200+</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Heart className="size-[14px] text-black/85" strokeWidth={2} />
                <span className={`${font} text-[14px] text-black`}>คะแนนเฉลี่ย</span>
                <span className={`${font} text-[14px] text-[#a2845e]`} style={{ fontWeight: 500 }}>4.8/5</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-[10px] shrink-0">
          <button onClick={() => navigate("/shop/metaherb")}
            className={`group/shop flex items-center bg-[#eaf5ee] text-[#319754] h-[40px] rounded-full ${font} cursor-pointer hover:bg-[#d6eadd] transition-all duration-300 overflow-hidden pl-[12px] pr-[12px] hover:pr-[16px]`}>
            <Store className="size-[16px] shrink-0" strokeWidth={2} />
            <span className="grid grid-cols-[0fr] group-hover/shop:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
              <span className="overflow-hidden">
                <span className="block whitespace-nowrap pl-[8px] text-[14px]" style={{ fontWeight: 500 }}>เยี่ยมชมร้านค้า</span>
              </span>
            </span>
          </button>
          <button
            className={`group/ask flex items-center bg-[#eaf5ee] text-[#319754] h-[40px] rounded-full ${font} cursor-pointer hover:bg-[#d6eadd] transition-all duration-300 overflow-hidden pl-[12px] pr-[12px] hover:pr-[16px]`}>
            <MessageCircle className="size-[16px] shrink-0" strokeWidth={2} />
            <span className="grid grid-cols-[0fr] group-hover/ask:grid-cols-[1fr] transition-[grid-template-columns] duration-300 ease-out">
              <span className="overflow-hidden">
                <span className="block whitespace-nowrap pl-[8px] text-[14px]" style={{ fontWeight: 500 }}>สอบถามร้านค้า</span>
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* ===== Recommended trials ===== */}
      <div className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px] mt-6 border border-gray-200">
        <div className="flex items-end justify-between w-full">
          <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>สินค้าทดลองแนะนำ</h2>
          <button onClick={() => navigate("/trials")} className="flex items-center gap-1.5 cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
            <span className={`${font} text-[12px]`}>ดูทั้งหมด</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]">
          {relatedTrials.slice(0, 4).map((p, i) => (
            <TrialCard
              key={p.id}
              p={p}
              isRegistered={registrations.some((r) => r.trialId === p.id && !r.rejectedAt)}
              onOpen={() => { navigate(`/trials/${p.id}`); window.scrollTo(0, 0); }}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* Evaluation modal */}
      <AnimatePresence>
        {showEvalModal && <EvaluationModal product={product} onClose={() => setShowEvalModal(false)} onSubmit={handleEvaluationSubmit} />}
      </AnimatePresence>
    </div>
  );
}


/* ===================================================================
   Rich detail sections — only render sections whose data is provided.
   Layout: section header (icon + title) + content block.
   =================================================================== */
function DetailSections({ product, isClosed, spotsLeft }: { product: TrialProduct; isClosed: boolean; spotsLeft: number }) {
  const d = product.detail;

  // Fallback "Test information" table — always shown so the basic metadata is visible
  const baseInfo: { label: string; value: string }[] = [
    { label: "หมวดหมู่",       value: product.category },
    { label: "ระยะเวลาทดสอบ", value: `${product.endsInDays} วัน` },
    { label: "ที่นั่งทั้งหมด",   value: `${product.spotsTotal} ที่` },
    { label: "ที่นั่งคงเหลือ",   value: isClosed ? "ปิดรับสมัคร" : `${spotsLeft} ที่` },
    { label: "รหัส Trial",     value: product.id.toUpperCase() },
    { label: "คะแนนที่ได้รับ",   value: `+${product.rewardPoints.toLocaleString()} คะแนน` },
  ];

  return (
    <div className="mt-6 flex flex-col gap-4">
      {/* ===== ข้อมูลผลิตภัณฑ์ ===== */}
      <SectionCard icon={<FlaskConical className="size-5 text-[#319754]" strokeWidth={2.2} />} title="ข้อมูลผลิตภัณฑ์">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {(d?.productInfo ?? baseInfo).map((row) => (
            <div key={row.label} className="flex gap-3 py-1.5 border-b border-gray-100">
              <span className={`${font} text-[13px] text-gray-500 w-[110px] shrink-0`} style={{ fontWeight: 500 }}>{row.label}</span>
              <span className={`${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{row.value}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* ===== มาตรฐานการผลิต ===== */}
      {d?.certifications && d.certifications.length > 0 && (
        <SectionCard icon={<BadgeCheck className="size-5 text-[#319754]" strokeWidth={2.2} />} title="มาตรฐานการผลิต">
          <div className="flex flex-wrap gap-2">
            {d.certifications.map((c) => (
              <span key={c} className={`${font} inline-flex items-center gap-1.5 text-[12.5px] text-[#1d5b32] bg-[#319754]/10 border border-[#319754]/25 px-3 py-1.5 rounded-full`} style={{ fontWeight: 500 }}>
                <ShieldCheck className="size-3.5" strokeWidth={2.4} /> {c}
              </span>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ===== สรรพคุณ ===== */}
      {d?.benefits && d.benefits.length > 0 && (
        <SectionCard icon={<Lightbulb className="size-5 text-amber-500" strokeWidth={2.2} />} title="สรรพคุณ">
          <ul className="space-y-2">
            {d.benefits.map((b) => (
              <li key={b} className="flex items-start gap-2.5">
                <Check className="size-4 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.6} />
                <span className={`${font} text-[14px] text-[#1a1a1a] leading-relaxed`}>{b}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* ===== วิธีใช้ ===== */}
      {d?.howToUse && d.howToUse.length > 0 && (
        <SectionCard icon={<ListChecks className="size-5 text-[#319754]" strokeWidth={2.2} />} title="วิธีใช้">
          <ol className="space-y-2.5">
            {d.howToUse.map((step, i) => (
              <li key={step} className="flex items-start gap-3">
                <span className={`${font} size-6 rounded-full bg-[#319754] text-white text-[12px] inline-flex items-center justify-center shrink-0 tabular-nums`} style={{ fontWeight: 700 }}>{i + 1}</span>
                <span className={`${font} text-[14px] text-[#1a1a1a] leading-relaxed pt-0.5`}>{step}</span>
              </li>
            ))}
          </ol>
        </SectionCard>
      )}

      {/* ===== คำเตือน ===== */}
      {d?.warnings && d.warnings.length > 0 && (
        <SectionCard
          icon={<AlertTriangle className="size-5 text-amber-600" strokeWidth={2.2} />}
          title="คำเตือน"
          tone="warning"
        >
          <ul className="space-y-2">
            {d.warnings.map((w) => (
              <li key={w} className="flex items-start gap-2.5">
                <span className="text-amber-600 mt-1.5 size-1.5 rounded-full bg-amber-500 shrink-0" />
                <span className={`${font} text-[13.5px] text-amber-900 leading-relaxed`}>{w}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      )}

      {/* ===== ข้อมูลการศึกษาและความปลอดภัย ===== */}
      {(d?.studyStats || d?.safetyTests || d?.ingredients) && (
        <SectionCard icon={<Beaker className="size-5 text-[#319754]" strokeWidth={2.2} />} title="ข้อมูลการศึกษาและความปลอดภัย">
          {/* 4 KPI cards */}
          {d.studyStats && d.studyStats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              {d.studyStats.map((s) => (
                <div key={s.label} className="bg-[#f0fdf4] border border-[#319754]/20 rounded-[14px] p-3.5">
                  <p className={`${font} text-[11.5px] text-[#1d5b32] mb-1`} style={{ fontWeight: 600 }}>{s.label}</p>
                  <p className={`${font} text-[22px] text-[#1a1a1a] tabular-nums leading-none`} style={{ fontWeight: 700 }}>{s.value}</p>
                  {s.sub && <p className={`${font} text-[11px] text-gray-600 mt-1.5`}>{s.sub}</p>}
                </div>
              ))}
            </div>
          )}
          {/* Safety tests list */}
          {d.safetyTests && d.safetyTests.length > 0 && (
            <div className="mb-5">
              <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-2.5`} style={{ fontWeight: 600 }}>ผลการทดสอบความปลอดภัย</p>
              <ul className="space-y-2">
                {d.safetyTests.map((t) => (
                  <li key={t} className="flex items-start gap-2.5">
                    <BadgeCheck className="size-4 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.4} />
                    <span className={`${font} text-[13.5px] text-gray-700 leading-relaxed`}>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Ingredients */}
          {d.ingredients && d.ingredients.length > 0 && (
            <div>
              <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-2.5`} style={{ fontWeight: 600 }}>ส่วนประกอบหลัก (Key Ingredients)</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {d.ingredients.map((ing) => (
                  <span key={ing.name}
                    className={`${font} text-[12px] px-3 py-1 rounded-full border ${
                      ing.isActive ? "bg-[#319754]/10 border-[#319754]/30 text-[#1d5b32]" : "bg-gray-50 border-gray-200 text-gray-700"
                    }`} style={{ fontWeight: ing.isActive ? 600 : 500 }}>
                    {ing.name}
                  </span>
                ))}
              </div>
              <p className={`${font} text-[11px] text-gray-500`}>
                <span className="inline-block size-2 rounded-full bg-[#319754] mr-1.5 align-middle" />
                สีเขียว = สารออกฤทธิ์หลัก
              </p>
            </div>
          )}
        </SectionCard>
      )}

      {/* ===== ผลความพึงพอใจจากเทสเตอร์รุ่นก่อน ===== */}
      {product.prevAvgRating != null && (
        <SectionCard icon={<TrendingUp className="size-5 text-[#319754]" strokeWidth={2.2} />} title="ผลความพึงพอใจจากเทสเตอร์รุ่นก่อน">
          <div className="flex flex-col md:flex-row gap-5 items-start">
            {/* Big rating */}
            <div className="bg-[#f0fdf4] border border-[#319754]/20 rounded-[16px] p-5 text-center md:w-[200px] shrink-0">
              <p className={`${font} text-[44px] text-[#1d5b32] tabular-nums leading-none`} style={{ fontWeight: 700 }}>
                {product.prevAvgRating.toFixed(1)}
              </p>
              <p className={`${font} text-[12px] text-gray-600 mt-1`}>จาก 5.0</p>
              <div className="flex justify-center gap-0.5 my-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className={`size-4 ${n <= Math.round(product.prevAvgRating!) ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300"}`} strokeWidth={2} />
                ))}
              </div>
              <p className={`${font} text-[12px] text-[#319754] mt-1`} style={{ fontWeight: 600 }}>{Math.round((product.prevAvgRating / 5) * 100)}% พึงพอใจโดยรวม</p>
              {product.prevRatingCount != null && (
                <p className={`${font} text-[11px] text-gray-500 mt-1.5`}>จากเทสเตอร์ {product.prevRatingCount} คน รุ่น v1</p>
              )}
            </div>
            {/* Per-criterion bars */}
            {d?.prevCriteriaRatings && d.prevCriteriaRatings.length > 0 && (
              <div className="flex-1 w-full space-y-3">
                {d.prevCriteriaRatings.map((c) => (
                  <div key={c.criterion}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`${font} text-[13px] text-[#1a1a1a]`} style={{ fontWeight: 500 }}>{c.criterion}</span>
                      <span className={`${font} text-[13px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}>{c.rating.toFixed(1)}</span>
                    </div>
                    <div className="h-[8px] rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{
                        width: `${(c.rating / 5) * 100}%`,
                        background: c.rating >= 4 ? "#319754" : c.rating >= 3 ? "#f59e0b" : "#dc2626",
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SectionCard>
      )}

      {/* ===== สิ่งที่ต้องประเมิน ===== */}
      <SectionCard icon={<ListChecks className="size-5 text-[#319754]" strokeWidth={2.2} />} title="สิ่งที่ต้องประเมิน">
        {d?.testSchedule && d.testSchedule.length > 0 ? (
          <div className="space-y-3">
            {d.testSchedule.map((s) => (
              <div key={s.day} className="flex gap-3 p-3 bg-gray-50 rounded-[12px]">
                <span className={`${font} text-[12px] text-[#319754] bg-[#319754]/10 px-3 py-1 rounded-full shrink-0 h-fit`} style={{ fontWeight: 700 }}>{s.day}</span>
                <p className={`${font} text-[13.5px] text-[#1a1a1a] leading-relaxed pt-0.5`}>{s.focus}</p>
              </div>
            ))}
          </div>
        ) : (
          <ul className="space-y-1.5">
            {product.whatToTest.map((w) => (
              <li key={w} className="flex items-start gap-2">
                <Check className="size-4 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.6} />
                <span className={`${font} text-[14px] text-[#1a1a1a]`}>{w}</span>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

function SectionCard({ icon, title, tone = "default", children }: { icon: React.ReactNode; title: string; tone?: "default" | "warning"; children: React.ReactNode }) {
  const bg = tone === "warning" ? "bg-amber-50 border-amber-200" : "bg-white border-gray-200";
  return (
    <section className={`${bg} rounded-[18px] p-5 border`}>
      <div className="flex items-center gap-2.5 mb-4">
        <div className="size-9 rounded-[10px] bg-[#319754]/10 flex items-center justify-center shrink-0">{icon}</div>
        <h2 className={`${font} text-[17px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>{title}</h2>
      </div>
      {children}
    </section>
  );
}
