import { useState } from "react";
import { motion } from "motion/react";
import { Star, X, Send, ThumbsUp, ThumbsDown } from "lucide-react";
import { toast } from "sonner";
import type { TrialProduct, Evaluation } from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function EvaluationModal({
  product, onClose, onSubmit,
}: {
  product: TrialProduct;
  onClose: () => void;
  onSubmit: (evaluation: Evaluation) => void;
}) {
  const [overall, setOverall] = useState(0);
  const [criteria, setCriteria] = useState<Record<string, number>>({});
  const [comment, setComment] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);

  const allCriteriaRated = product.whatToTest.every((w) => (criteria[w] || 0) > 0);
  const canSubmit = overall > 0 && allCriteriaRated && comment.trim().length >= 10 && wouldRecommend !== null;

  const handleSubmit = () => {
    if (!canSubmit) {
      toast.error("กรอกแบบประเมินให้ครบทุกข้อ");
      return;
    }
    onSubmit({ overall, criteria, comment: comment.trim(), wouldRecommend: wouldRecommend! });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 z-10">
          <div className="flex items-center gap-3 min-w-0">
            <div className="size-[44px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>แบบประเมินผลิตภัณฑ์ทดสอบ</p>
              <h2 className={`${font} text-[16px] text-[#1a1a1a] truncate`} style={{ fontWeight: 700 }}>{product.name}</h2>
            </div>
          </div>
          <button onClick={onClose} aria-label="ปิด" className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0">
            <X className="size-[18px]" strokeWidth={2.4} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Overall rating */}
          <div>
            <p className={`${font} text-[14px] text-[#1a1a1a] mb-2`} style={{ fontWeight: 600 }}>คะแนนรวม *</p>
            <StarRow value={overall} onChange={setOverall} size="lg" />
            {overall > 0 && (
              <p className={`${font} text-[13px] text-gray-500 mt-1`}>{overall}/5 — {ratingLabel(overall)}</p>
            )}
          </div>

          {/* Per-criterion ratings */}
          <div>
            <p className={`${font} text-[14px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 600 }}>ประเมินรายข้อ *</p>
            <div className="space-y-3">
              {product.whatToTest.map((w) => (
                <div key={w} className="flex items-center justify-between gap-3 p-3 rounded-[12px] bg-gray-50">
                  <span className={`${font} text-[13px] text-[#1a1a1a]`}>{w}</span>
                  <StarRow value={criteria[w] || 0} onChange={(v) => setCriteria((prev) => ({ ...prev, [w]: v }))} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div>
            <p className={`${font} text-[14px] text-[#1a1a1a] mb-2`} style={{ fontWeight: 600 }}>ความคิดเห็นเพิ่มเติม *</p>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="เล่าประสบการณ์การใช้สินค้า — ผลลัพธ์, สิ่งที่ชอบ, สิ่งที่อยากให้ปรับปรุง (อย่างน้อย 10 ตัวอักษร)"
              rows={4}
              className={`${font} w-full px-3.5 py-2.5 rounded-[12px] border border-gray-200 text-[13.5px] text-[#1a1a1a] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 transition-all resize-none leading-relaxed placeholder:text-gray-400`}
            />
            <p className={`${font} text-[11px] text-gray-400 mt-1 text-right tabular-nums`}>{comment.trim().length} / 10 ขั้นต่ำ</p>
          </div>

          {/* Recommend */}
          <div>
            <p className={`${font} text-[14px] text-[#1a1a1a] mb-2`} style={{ fontWeight: 600 }}>คุณจะแนะนำสินค้านี้ให้เพื่อนไหม? *</p>
            <div className="grid grid-cols-2 gap-2.5">
              <button onClick={() => setWouldRecommend(true)}
                className={`${font} flex items-center justify-center gap-2 h-[44px] rounded-[12px] border-2 cursor-pointer transition-colors text-[14px] ${
                  wouldRecommend === true
                    ? "border-[#319754] bg-[#319754]/5 text-[#1d5b32]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`} style={{ fontWeight: 600 }}>
                <ThumbsUp className="size-4" strokeWidth={2.4} /> แนะนำ
              </button>
              <button onClick={() => setWouldRecommend(false)}
                className={`${font} flex items-center justify-center gap-2 h-[44px] rounded-[12px] border-2 cursor-pointer transition-colors text-[14px] ${
                  wouldRecommend === false
                    ? "border-[#dc2626] bg-[#dc2626]/5 text-[#991b1b]"
                    : "border-gray-200 text-gray-600 hover:border-gray-300"
                }`} style={{ fontWeight: 600 }}>
                <ThumbsDown className="size-4" strokeWidth={2.4} /> ไม่แนะนำ
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-4 border-t border-gray-100 flex justify-end gap-3 z-10">
          <button onClick={onClose} className={`${font} h-[42px] px-5 rounded-full text-gray-700 text-[14px] hover:bg-gray-100 cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
            ยกเลิก
          </button>
          <button onClick={handleSubmit} disabled={!canSubmit}
            className={`${font} inline-flex items-center gap-2 h-[42px] px-5 rounded-full text-white text-[14px] transition-colors ${canSubmit ? "bg-[#319754] hover:bg-[#267a43] cursor-pointer shadow-[0_4px_14px_-2px_rgba(49,151,84,0.4)]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
            style={{ fontWeight: 600 }}>
            <Send className="size-4" strokeWidth={2.4} /> ส่งแบบประเมิน · รับ +{product.rewardPoints.toLocaleString()} คะแนน
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function StarRow({ value, onChange, size = "md" }: { value: number; onChange: (v: number) => void; size?: "sm" | "md" | "lg" }) {
  const sizeClass = size === "lg" ? "size-7" : size === "sm" ? "size-4" : "size-5";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value;
        return (
          <button key={n} type="button" onClick={() => onChange(n)}
            className="cursor-pointer transition-transform active:scale-90"
            aria-label={`${n} ดาว`}>
            <Star className={`${sizeClass} transition-colors ${active ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300 hover:text-amber-300"}`} strokeWidth={2} />
          </button>
        );
      })}
    </div>
  );
}

function ratingLabel(r: number): string {
  if (r === 5) return "ดีมาก";
  if (r === 4) return "ดี";
  if (r === 3) return "พอใช้";
  if (r === 2) return "ต้องปรับปรุง";
  return "ควรปรับปรุงมาก";
}

/** ===== Read-only display for owner side — mirrors the form preview from AddTrialProduct generator ===== */
export function EvaluationView({ evaluation, product }: { evaluation: Evaluation; product: TrialProduct }) {
  // Group questions to mirror the form preview structure:
  // - "ภาพรวมการประเมิน" phase = product.whatToTest items (Scale 1-5)
  // - "ทุกแบบประเมินรวมเสมอ" phase = overall (Stars) + recommend (Yes/No)
  const ALWAYS_COLOR = "#1a1a1a"; // matches PHASE_META.always.color from generator
  const SCALE_COLOR = "#319754"; // green tier for the per-criterion phase

  return (
    <div className="space-y-5">
      {/* ================== Phase 1: per-criterion (Scale 1-5) ================== */}
      <div>
        {/* Phase header pill (same style as form preview generator) */}
        <div className="flex items-center gap-2 mb-3">
          <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]`}
            style={{ background: `${SCALE_COLOR}15`, color: SCALE_COLOR, fontWeight: 700 }}>
            ภาพรวมการประเมิน
          </span>
          <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{product.whatToTest.length} คำถาม</span>
        </div>

        <div className="space-y-3">
          {product.whatToTest.map((w, idx) => {
            const r = evaluation.criteria[w] || 0;
            return (
              <div key={w} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
                  <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums"
                    style={{ background: `${SCALE_COLOR}15`, color: SCALE_COLOR, fontWeight: 700 }}>{idx + 1}</span>
                  {w}
                </p>
                {/* Scale 1-5 — same shape as FormFieldPreview but with the chosen answer highlighted */}
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((n) => {
                    const isAnswer = n === r;
                    return (
                      <button key={n} type="button" disabled
                        className={`${font} size-10 rounded-full border-2 text-[13px] cursor-not-allowed transition-colors ${
                          isAnswer
                            ? "bg-[#319754] border-[#319754] text-white shadow-[0_2px_8px_rgba(49,151,84,0.35)]"
                            : "bg-white border-gray-200 text-gray-400"
                        }`}
                        style={{ fontWeight: isAnswer ? 700 : 600 }}>
                        {n}
                      </button>
                    );
                  })}
                  <span className={`${font} text-[11px] text-gray-400 ml-2`}>(1 = น้อย, 5 = มาก)</span>
                </div>
                {r === 0 && <p className={`${font} text-[10.5px] text-gray-400 mt-2 italic`}>ยังไม่ได้ตอบ</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ================== Phase 2: ทุกแบบประเมินรวมเสมอ ================== */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]`}
            style={{ background: `${ALWAYS_COLOR}15`, color: ALWAYS_COLOR, fontWeight: 700 }}>
            ทุกแบบประเมินรวมเสมอ
          </span>
          <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>2 คำถาม</span>
        </div>

        <div className="space-y-3">
          {/* Overall = stars_1_5 in the generator */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
              <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums"
                style={{ background: `${ALWAYS_COLOR}15`, color: ALWAYS_COLOR, fontWeight: 700 }}>1</span>
              ความพึงพอใจโดยรวม
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} className="size-7 inline-flex items-center justify-center text-[22px]"
                  style={{ color: n <= evaluation.overall ? "#f59e0b" : "#e5e7eb" }}>★</span>
              ))}
              <span className={`${font} text-[12px] text-amber-700 ml-2`} style={{ fontWeight: 700 }}>
                {evaluation.overall}/5 · {ratingLabel(evaluation.overall)}
              </span>
            </div>
          </div>

          {/* Recommend = ab_choice in the generator */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
              <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums"
                style={{ background: `${ALWAYS_COLOR}15`, color: ALWAYS_COLOR, fontWeight: 700 }}>2</span>
              จะแนะนำให้คนอื่นใช้หรือไม่
            </p>
            <div className="flex gap-2">
              {([
                { val: true,  label: "แนะนำ",     Icon: ThumbsUp,   color: "#319754" },
                { val: false, label: "ไม่แนะนำ",   Icon: ThumbsDown, color: "#ef4444" },
              ]).map((opt) => {
                const isAnswer = evaluation.wouldRecommend === opt.val;
                return (
                  <div key={String(opt.val)}
                    className={`${font} flex-1 h-11 rounded-full border-2 inline-flex items-center justify-center gap-1.5 text-[13px] cursor-not-allowed transition-colors`}
                    style={{
                      borderColor: isAnswer ? opt.color : "#e5e7eb",
                      background: isAnswer ? opt.color : "#fff",
                      color: isAnswer ? "#fff" : "#9ca3af",
                      fontWeight: isAnswer ? 700 : 500,
                      boxShadow: isAnswer ? `0 2px 8px ${opt.color}40` : "none",
                    }}>
                    <opt.Icon className="size-4" strokeWidth={2.4} />
                    {opt.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ================== Comment ================== */}
      {evaluation.comment && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] bg-gray-100 text-gray-600`}
              style={{ fontWeight: 700 }}>
              ความคิดเห็นเพิ่มเติม
            </span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
            <p className={`${font} text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap`}>"{evaluation.comment}"</p>
          </div>
        </div>
      )}
    </div>
  );
}
