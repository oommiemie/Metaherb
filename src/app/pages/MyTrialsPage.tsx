import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { FlaskConical, Sparkles, Clock, Coins, Check, MapPin, ChevronRight, FileText, Calendar } from "lucide-react";
import { AccountSidebar } from "../components/AccountSidebar";
import { toast } from "sonner";
import {
  TRIAL_PRODUCTS, loadRegistrations, saveRegistrations, getTrialImages,
  type Registration, type TrialProduct, type Evaluation,
} from "../data/trialProducts";
import { EvaluationModal } from "../components/EvaluationModal";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type TabKey = "active" | "completed";

export function MyTrialsPage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState<Registration[]>(() => loadRegistrations());
  const [tab, setTab] = useState<TabKey>("active");
  const [evalTrialId, setEvalTrialId] = useState<string | null>(null);
  const evalProduct = useMemo(() => TRIAL_PRODUCTS.find((p) => p.id === evalTrialId), [evalTrialId]);

  // refresh on focus
  useEffect(() => {
    const onFocus = () => setRegistrations(loadRegistrations());
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const enriched = useMemo(() => {
    return registrations
      .map((r) => ({ reg: r, product: TRIAL_PRODUCTS.find((p) => p.id === r.trialId) }))
      .filter((x): x is { reg: Registration; product: TrialProduct } => !!x.product);
  }, [registrations]);

  const active = useMemo(() => enriched.filter((x) => !x.reg.evaluatedAt), [enriched]);
  const completed = useMemo(() => enriched.filter((x) => !!x.reg.evaluatedAt), [enriched]);

  const totalEarned = useMemo(
    () => completed.reduce((sum, x) => sum + x.product.rewardPoints, 0),
    [completed]
  );

  const list = tab === "active" ? active : completed;

  const handleEvaluationSubmit = (evaluation: Evaluation) => {
    if (!evalProduct) return;
    const next = registrations.map((r) =>
      r.trialId === evalProduct.id && !r.evaluatedAt ? { ...r, evaluatedAt: Date.now(), evaluation } : r
    );
    setRegistrations(next);
    saveRegistrations(next);
    setEvalTrialId(null);
    toast.success("ส่งแบบประเมินสำเร็จ", {
      description: `ได้รับ +${evalProduct.rewardPoints.toLocaleString()} คะแนนสะสม`,
    });
    setTab("completed");
  };

  return (
    <div>
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
        <AccountSidebar />
        <div className="flex-1 min-w-0">
          <h2 className={`${font} text-[24px] mb-6`} style={{ fontWeight: 500 }}>ผลิตภัณฑ์ทดสอบของฉัน</h2>
        {/* Tabs — overlap header band with -mt-10 (matches OrdersPage) */}
        <div className="flex justify-start mb-5 sm:mb-7 relative z-10">
          <div className="backdrop-blur-[14px] rounded-full p-[6px] flex gap-1 overflow-x-auto max-w-full scrollbar-hide ring-1 ring-white/60"
            style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 100%)",
              boxShadow: "0 1px 0 rgba(255,255,255,0.9) inset, 0 -1px 0 rgba(255,255,255,0.5) inset, 0 2px 6px rgba(0,0,0,0.06), 0 12px 28px -8px rgba(20,63,36,0.18)"
            }}>
            {([
              { key: "active" as const,    label: "กำลังทดสอบ",        count: active.length,    icon: FlaskConical },
              { key: "completed" as const, label: "ทดสอบเสร็จแล้ว",     count: completed.length, icon: Check },
            ]).map((t) => {
              const isActive = tab === t.key;
              return (
                <button key={t.key} onClick={() => setTab(t.key)}
                  className={`group/tab relative flex items-center gap-1.5 px-3 h-[34px] rounded-full text-[13px] ${font} cursor-pointer whitespace-nowrap transition-all duration-200 active:scale-[0.97] ${
                    isActive ? "text-white" : "text-[#1d5b32] hover:text-[#287745]"
                  }`}
                  style={{ fontWeight: 500 }}>
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full bg-[#319754]/0 group-hover/tab:bg-[#319754]/10 transition-colors duration-200" />
                  )}
                  {isActive && (
                    <motion.div layoutId="my-trials-tab"
                      className="absolute inset-0 rounded-full shadow-[0_4px_14px_-2px_rgba(49,151,84,0.55),inset_0_1px_0_rgba(255,255,255,0.25)]"
                      style={{ background: "linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)" }}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                  )}
                  <t.icon className="size-[15px] relative z-10" strokeWidth={2.2} />
                  <span className="relative z-10 leading-none">{t.label}</span>
                  {t.count > 0 && (
                    <span className={`relative z-10 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full text-[10px] tabular-nums ring-[1.5px] ${
                      isActive
                        ? "bg-white text-[#ef4444] ring-white/40 shadow-[0_2px_4px_rgba(0,0,0,0.15)]"
                        : "text-white ring-white shadow-[0_2px_6px_rgba(239,56,60,0.5)]"
                    }`}
                    style={isActive ? { fontWeight: 700 } : { background: "linear-gradient(135deg, #ff8a8a, #ef4444)", fontWeight: 700 }}>
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Empty state */}
        {list.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-gray-200 p-10 text-center">
            <div className="size-14 rounded-full bg-gray-100 mx-auto flex items-center justify-center mb-3">
              <FlaskConical className="size-6 text-gray-400" strokeWidth={2.2} />
            </div>
            <p className={`${font} text-[14px] text-gray-600 mb-1`} style={{ fontWeight: 600 }}>
              {tab === "active" ? "ยังไม่มีสินค้าที่กำลังทดสอบ" : "ยังไม่มีรายการที่ทดสอบเสร็จ"}
            </p>
            <p className={`${font} text-[13px] text-gray-500 mb-4`}>
              {tab === "active" ? "ลองสมัครสินค้าทดสอบเพื่อรับฟรี + สะสมคะแนน" : "ส่งแบบประเมินรายการที่กำลังทดสอบเพื่อรับคะแนน"}
            </p>
            <button onClick={() => navigate("/trials")}
              className={`${font} inline-flex items-center gap-2 h-[40px] px-5 rounded-full bg-[#319754] text-white text-[14px] cursor-pointer hover:bg-[#267a43] transition-colors`}
              style={{ fontWeight: 600 }}>
              ดูผลิตภัณฑ์ทดสอบทั้งหมด <ChevronRight className="size-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {list.map(({ reg, product }) => (
              <TrialItemCard
                key={reg.trialId}
                product={product}
                registration={reg}
                onView={() => navigate(`/trials/${product.id}`)}
                onEvaluate={() => setEvalTrialId(product.id)}
              />
            ))}
          </div>
        )}
        </div>
      </div>

      <AnimatePresence>
        {evalProduct && <EvaluationModal product={evalProduct} onClose={() => setEvalTrialId(null)} onSubmit={handleEvaluationSubmit} />}
      </AnimatePresence>
    </div>
  );
}

function TrialItemCard({
  product, registration, onView, onEvaluate,
}: {
  product: TrialProduct;
  registration: Registration;
  onView: () => void;
  onEvaluate: () => void;
}) {
  const isEvaluated = !!registration.evaluatedAt;
  const submittedDate = new Date(registration.submittedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" });
  const evaluatedDate = registration.evaluatedAt
    ? new Date(registration.evaluatedAt).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "2-digit" })
    : null;

  return (
    <div className="bg-white rounded-[16px] border border-gray-200 hover:border-[#319754]/40 transition-colors overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-4">
        {/* Image */}
        <div className="size-[100px] sm:size-[120px] rounded-[12px] overflow-hidden bg-gray-100 shrink-0 relative cursor-pointer" onClick={onView}>
          <img src={getTrialImages(product)[0]} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute top-1.5 left-1.5">
            {isEvaluated ? (
              <span className={`${font} inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#319754] text-white text-[10px] shadow-md`} style={{ fontWeight: 600 }}>
                <Check className="size-2.5" strokeWidth={2.8} /> เสร็จ
              </span>
            ) : (
              <span className={`${font} inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-white text-[10px] shadow-md`}
                style={{ background: "linear-gradient(135deg, #0088ff, #9747ff)", fontWeight: 600 }}>
                <Sparkles className="size-2.5" strokeWidth={2.4} /> Beta
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
          <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{product.category.toUpperCase()}</p>
          <button onClick={onView} className={`${font} text-[15px] text-[#1a1a1a] cursor-pointer hover:text-[#319754] transition-colors text-left`} style={{ fontWeight: 600 }}>
            {product.name}
          </button>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-0.5">
            <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1`}>
              <Calendar className="size-3" strokeWidth={2.2} /> สมัคร {submittedDate}
            </span>
            {evaluatedDate && (
              <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1`}>
                <Check className="size-3" strokeWidth={2.4} /> ส่งแบบประเมิน {evaluatedDate}
              </span>
            )}
            <span className={`${font} text-[12px] inline-flex items-center gap-1`} style={{ color: "#d97706", fontWeight: 600 }}>
              <Coins className="size-3" strokeWidth={2.4} /> +{product.rewardPoints.toLocaleString()} คะแนน
            </span>
          </div>
          {registration.address && (
            <p className={`${font} text-[12px] text-gray-500 mt-1 inline-flex items-start gap-1`}>
              <MapPin className="size-3 mt-0.5 shrink-0" strokeWidth={2.2} />
              <span className="truncate">{registration.address}</span>
            </p>
          )}
          {/* Days remaining (active only) */}
          {!isEvaluated && (
            <div className="mt-2 flex items-center gap-2 text-[12px]">
              <Clock className="size-3 text-amber-600" strokeWidth={2.4} />
              <span className={`${font} text-amber-700`} style={{ fontWeight: 500 }}>
                เหลือเวลาส่งแบบประเมินอีกประมาณ 30 วัน
              </span>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="flex sm:flex-col gap-2 sm:items-stretch sm:justify-center sm:w-[160px] shrink-0">
          {isEvaluated ? (
            <button onClick={onView}
              className={`${font} flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-[40px] px-4 rounded-full border border-gray-200 text-gray-700 text-[13px] hover:bg-gray-50 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ดูรายละเอียด
            </button>
          ) : (
            <>
              <button onClick={onEvaluate}
                className={`${font} flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-[40px] px-4 rounded-full bg-[#319754] text-white text-[13px] hover:bg-[#267a43] cursor-pointer transition-colors`}
                style={{ fontWeight: 600 }}>
                <FileText className="size-3.5" strokeWidth={2.4} /> ทำแบบประเมิน
              </button>
              <button onClick={onView}
                className={`${font} flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 h-[36px] px-4 rounded-full text-[12px] text-[#319754] hover:bg-[#319754]/5 cursor-pointer transition-colors`}
                style={{ fontWeight: 500 }}>
                ดูรายละเอียด
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
