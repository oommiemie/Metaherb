import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, Share2, Sparkles, Clock, Users, Coins, Check, FlaskConical, Store, MessageCircle, Heart, Send } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../store/AuthContext";
import { TRIAL_PRODUCTS, loadRegistrations, saveRegistrations, getTrialImages, getActiveRegistration, type TrialProduct, type Registration, type Evaluation } from "../data/trialProducts";
import { EvaluationModal } from "../components/EvaluationModal";
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
          {/* Name + meta row (same shape as price page's Name + Rating) */}
          <div className="flex flex-col gap-[10px]">
            <h1 className={`${font} text-[18px] sm:text-[20px] text-black break-words`} style={{ fontWeight: 500 }}>{product.name}</h1>
            <div className="flex gap-[16px] items-center flex-wrap">
              <div className="flex items-center gap-[6px]">
                <FlaskConical className="size-[14px] text-[#319754]" strokeWidth={2.2} />
                <span className={`${font} text-[12px] text-black`}>{product.category}</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Clock className="size-[12px] text-black/85" strokeWidth={2.2} />
                <span className={`${font} text-[12px] text-black`}>เหลือ {product.endsInDays} วัน</span>
              </div>
              <div className="flex items-center gap-[6px]">
                <Users className="size-[12px] text-black/85" strokeWidth={2.2} />
                <span className={`${font} text-[12px] text-black`}>{product.spotsTaken}/{product.spotsTotal} ที่</span>
              </div>
            </div>
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

      {/* ===== Product details card ===== */}
      <div className="bg-white rounded-[16px] p-[16px] flex flex-col gap-[16px] mt-6 border border-gray-200">
        <div className="flex flex-col gap-[10px]">
          <h2 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>รายละเอียดผลิตภัณฑ์</h2>
          <p className={`${font} text-[14px] text-black leading-relaxed`}>
            {product.tagline} ผลิตภัณฑ์นี้อยู่ในช่วงทดสอบสูตร — METAHERB คัดเลือกผู้ใช้จริงในกลุ่มเป้าหมายเพื่อรับฟังความคิดเห็น ก่อนผลิตเชิงพาณิชย์.
            ทุกความคิดเห็นจะถูกนำไปปรับปรุงสูตรและบรรจุภัณฑ์ในรอบถัดไป.
          </p>
        </div>
        <div className="h-px w-full bg-[#D4D4D8]" />
        <div className="flex flex-col gap-[10px]">
          <h3 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>สิ่งที่ต้องประเมิน</h3>
          <ul className={`${font} text-[14px] text-black space-y-1.5`}>
            {product.whatToTest.map((w) => (
              <li key={w} className="flex items-start gap-2">
                <Check className="size-4 text-[#319754] mt-0.5 shrink-0" strokeWidth={2.6} /> {w}
              </li>
            ))}
          </ul>
        </div>
        <div className="h-px w-full bg-[#D4D4D8]" />
        <div className="flex flex-col gap-[10px]">
          <h3 className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลการทดสอบ</h3>
          {[
            { label: "หมวดหมู่", value: product.category },
            { label: "ระยะเวลาทดสอบ", value: `${product.endsInDays} วัน` },
            { label: "ที่นั่งทั้งหมด", value: `${product.spotsTotal} ที่` },
            { label: "ที่นั่งคงเหลือ", value: isClosed ? "ปิดรับสมัคร" : `${spotsLeft} ที่` },
            { label: "รหัส Trial", value: product.id.toUpperCase() },
            { label: "คะแนนที่ได้รับ", value: `+${product.rewardPoints.toLocaleString()} คะแนน` },
          ].map((s) => (
            <div key={s.label} className="flex gap-[10px]">
              <span className={`${font} text-[14px] text-black w-[120px] shrink-0`} style={{ fontWeight: 500 }}>{s.label}</span>
              <span className={`${font} text-[14px] text-black`}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
          {relatedTrials.map((p) => <RelatedTrialCard key={p.id} p={p} onClick={() => { navigate(`/trials/${p.id}`); window.scrollTo(0, 0); }} />)}
        </div>
      </div>

      {/* Evaluation modal */}
      <AnimatePresence>
        {showEvalModal && <EvaluationModal product={product} onClose={() => setShowEvalModal(false)} onSubmit={handleEvaluationSubmit} />}
      </AnimatePresence>
    </div>
  );
}

function RelatedTrialCard({ p, onClick }: { p: TrialProduct; onClick: () => void }) {
  const spotsLeft = p.spotsTotal - p.spotsTaken;
  const pct = (p.spotsTaken / p.spotsTotal) * 100;
  const isClosed = spotsLeft <= 0 || p.endsInDays <= 0;
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-[16px] border overflow-hidden flex flex-col h-[259px] group/card cursor-pointer transition-all duration-300 ${
        isClosed ? "border-[#d4d4d4] opacity-70" : "border-[#d4d4d4] hover:shadow-lg hover:-translate-y-1 hover:border-[#319754]/40"
      }`}
    >
      <div className="flex-1 relative min-h-0 overflow-hidden">
        <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110" />
        <div className="absolute top-0 right-0 p-[6px]">
          {isClosed ? (
            <div className="bg-gray-600 h-[22px] w-[88px] rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.2)] flex items-center justify-center">
              <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>ปิดรับสมัคร</span>
            </div>
          ) : (
            <div className="h-[22px] w-[88px] rounded-full shadow-[0_2px_6px_rgba(151,71,255,0.4)] flex items-center justify-center gap-1"
              style={{ background: "linear-gradient(135deg, #0088ff, #9747ff)" }}>
              <Sparkles className="size-2.5 text-white" strokeWidth={2.4} />
              <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>Beta</span>
            </div>
          )}
        </div>
        {!isClosed && (
          <div className="absolute bottom-0 left-0 backdrop-blur-[4px] bg-black/55 flex gap-[6px] items-center px-[10px] py-[6px] rounded-tr-[12px]">
            <Clock className="size-2.5 text-white" strokeWidth={2.6} />
            <span className={`${font} text-[11px] text-white tabular-nums`} style={{ fontWeight: 600 }}>{p.endsInDays} วัน</span>
          </div>
        )}
      </div>
      <div className="p-[10px] flex flex-col gap-[4px]">
        <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{p.name}</p>
        <div className="flex items-center gap-1">
          <Coins className="size-[12px] text-[#d97706] shrink-0" strokeWidth={2.4} />
          <span className={`${font} text-[12px] text-[#d97706] tabular-nums`} style={{ fontWeight: 700 }}>+{p.rewardPoints.toLocaleString()}</span>
          <span className={`${font} text-[10px] text-gray-500`}>คะแนน</span>
        </div>
        <div className="flex items-center justify-between">
          <span className={`${font} text-[10px] text-gray-500`}>ที่นั่ง {p.spotsTaken}/{p.spotsTotal}</span>
        </div>
        <div className="h-[4px] rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full transition-all" style={{
            width: `${Math.min(100, pct)}%`,
            background: pct >= 90 ? "#dc2626" : pct >= 60 ? "#f59e0b" : "#319754",
          }} />
        </div>
      </div>
    </div>
  );
}
