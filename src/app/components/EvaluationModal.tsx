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

/** ===== Read-only display for owner side ===== */
export function EvaluationView({ evaluation, product }: { evaluation: Evaluation; product: TrialProduct }) {
  return (
    <div className="space-y-3.5">
      {/* Overall */}
      <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-[12px] p-3.5">
        <div className="flex flex-col items-center shrink-0">
          <p className={`${font} text-[22px] text-amber-700 tabular-nums leading-none`} style={{ fontWeight: 700 }}>{evaluation.overall}<span className="text-[12px] text-amber-600">/5</span></p>
          <div className="flex mt-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} className={`size-3.5 ${n <= evaluation.overall ? "fill-amber-400 text-amber-400" : "fill-transparent text-amber-200"}`} strokeWidth={2} />
            ))}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`${font} text-[12px] text-amber-700`} style={{ fontWeight: 600 }}>คะแนนรวม — {ratingLabel(evaluation.overall)}</p>
          <p className={`${font} text-[11.5px] text-amber-700/85 inline-flex items-center gap-1 mt-0.5`}>
            {evaluation.wouldRecommend ? <><ThumbsUp className="size-3" /> แนะนำให้เพื่อน</> : <><ThumbsDown className="size-3" /> ไม่แนะนำ</>}
          </p>
        </div>
      </div>

      {/* Per-criterion */}
      <div>
        <p className={`${font} text-[12px] text-gray-700 mb-2`} style={{ fontWeight: 600 }}>คะแนนรายข้อ</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {product.whatToTest.map((w) => {
            const r = evaluation.criteria[w] || 0;
            return (
              <div key={w} className="flex items-center justify-between gap-2 p-2.5 rounded-[10px] bg-gray-50">
                <span className={`${font} text-[12px] text-gray-700 flex-1 truncate`}>{w}</span>
                <div className="flex shrink-0">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} className={`size-3 ${n <= r ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300"}`} strokeWidth={2} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Comment */}
      <div>
        <p className={`${font} text-[12px] text-gray-700 mb-1.5`} style={{ fontWeight: 600 }}>ความคิดเห็น</p>
        <div className="bg-gray-50 rounded-[10px] p-3 border border-gray-100">
          <p className={`${font} text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap`}>{evaluation.comment}</p>
        </div>
      </div>
    </div>
  );
}
