import { motion } from "motion/react";
import { Ban, Check, Clock, Sparkles } from "lucide-react";
import type { TrialProduct } from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

/** Shared trial product card — used by /trials grid + /trials/:id "recommended" rail.
 *  Renders the tier-coloured hero, status badge, rating block, seats progress, and CTA. */
export function TrialCard({
  p,
  isRegistered = false,
  onOpen,
  index = 0,
}: {
  p: TrialProduct;
  isRegistered?: boolean;
  onOpen: () => void;
  /** Used to stagger the entry animation in a grid */
  index?: number;
}) {
  const spotsLeft = p.spotsTotal - p.spotsTaken;
  const seatsTakenPct = (p.spotsTaken / p.spotsTotal) * 100;
  const seatsFreePct = 100 - seatsTakenPct;
  const isClosed = spotsLeft <= 0 || p.endsInDays <= 0;
  const isUrgent = !isClosed && spotsLeft > 0 && spotsLeft <= 5;
  const isFirstBatch = p.prevAvgRating == null;
  const rating = p.prevAvgRating ?? 0;
  const tier =
    isFirstBatch ? "new" :
    rating >= 4.0 ? "high" :
    rating >= 3.0 ? "mid"  : "low";
  const palette = {
    high: { bg: "#e6f5ec", bar: "#319754", text: "#1d5b32", chip: "bg-[#319754]/12 text-[#1d5b32]" },
    mid:  { bg: "#fff0db", bar: "#f59e0b", text: "#92400e", chip: "bg-[#f59e0b]/15 text-[#92400e]" },
    low:  { bg: "#ffe0e0", bar: "#dc2626", text: "#991b1b", chip: "bg-[#dc2626]/15 text-[#991b1b]" },
    new:  { bg: "#e0eaf5", bar: "#6b7280", text: "#1e3a5f", chip: "bg-[#3b82f6]/15 text-[#1e3a5f]" },
  }[tier];
  const satisfactionPct = isFirstBatch ? 0 : Math.round((rating / 5) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.03, ease: [0.22, 1, 0.36, 1] }}
      onClick={onOpen}
      className={`bg-white rounded-[18px] border overflow-hidden flex flex-col group/card transition-all duration-300 cursor-pointer ${
        isClosed ? "border-[#d4d4d4] opacity-70" : "border-[#d4d4d4] hover:border-[#319754]/40 hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      {/* Hero block — product image */}
      <div className="relative h-[160px] overflow-hidden" style={{ background: palette.bg }}>
        <img src={p.image} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
        {/* Top-left badge — only meaningful states */}
        {(isClosed || isRegistered || isUrgent) && (
          <div className="absolute top-3 left-3">
            {isClosed ? (
              <span className={`${font} text-[11px] bg-gray-800/85 text-white px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 backdrop-blur-sm`} style={{ fontWeight: 600 }}>
                <Ban className="size-3" strokeWidth={2.4} /> ปิดรับสมัคร
              </span>
            ) : isRegistered ? (
              <span className={`${font} text-[11px] bg-[#319754] text-white px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`} style={{ fontWeight: 600 }}>
                <Check className="size-3" strokeWidth={3} /> เข้าร่วมแล้ว
              </span>
            ) : (
              <span className={`${font} text-[11px] text-white px-2.5 py-0.5 rounded-full inline-flex items-center gap-1`} style={{ background: palette.bar, fontWeight: 600 }}>
                <Sparkles className="size-3" strokeWidth={2.4} /> เหลือ {spotsLeft} ที่!
              </span>
            )}
          </div>
        )}
        {/* Top-right days badge */}
        {!isClosed && (
          <div className="absolute top-3 right-3 inline-flex items-center gap-1 bg-white/85 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
            <Clock className="size-3" strokeWidth={2.4} style={{ color: palette.text }} />
            <span className={`${font} text-[11px] tabular-nums`} style={{ color: palette.text, fontWeight: 600 }}>{p.endsInDays} วัน</span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Category chip */}
        <span className={`${font} self-start text-[11px] px-2.5 py-0.5 rounded-full ${palette.chip}`} style={{ fontWeight: 600 }}>{p.category}</span>

        {/* Name + studio */}
        <div>
          <h3 className={`${font} text-[15px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>{p.name}</h3>
          {p.studioName && (
            <div className="flex items-center gap-1.5 mt-1">
              <span className="size-1.5 rounded-full bg-[#319754]" />
              <span className={`${font} text-[12px] text-gray-500`}>{p.studioName}</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className={`${font} text-[12px] text-gray-600 leading-relaxed line-clamp-2`}>{p.tagline}</p>

        {/* Rating block */}
        <div className="mt-1">
          {isFirstBatch ? (
            <div>
              <p className={`${font} text-[15px]`} style={{ color: palette.text, fontWeight: 700 }}>ยังไม่มีข้อมูล</p>
              <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เป็นรุ่นแรกที่เปิดทดสอบ</p>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between gap-2">
                <div className="flex items-baseline gap-2">
                  <span className={`${font} text-[24px] tabular-nums leading-none`} style={{ fontWeight: 700, color: palette.text }}>{p.prevAvgRating!.toFixed(1)}</span>
                  <span className={`${font} text-[11px] text-gray-500`}>พึงพอใจ จาก {p.prevRatingCount} คน</span>
                </div>
                <span className={`${font} text-[11px] tabular-nums`} style={{ color: palette.text, fontWeight: 600 }}>{satisfactionPct}%</span>
              </div>
              <div className="h-[5px] rounded-full bg-gray-100 overflow-hidden mt-1.5">
                <div className="h-full rounded-full transition-all" style={{ width: `${satisfactionPct}%`, background: palette.bar }} />
              </div>
            </>
          )}
        </div>

        {/* Seats block */}
        <div className="mt-1">
          <div className="flex items-center justify-between">
            <span className={`${font} text-[11px] text-gray-500 tabular-nums`}>ที่นั่ง {p.spotsTaken}/{p.spotsTotal}</span>
            {isUrgent ? (
              <span className={`${font} text-[11px] tabular-nums`} style={{ color: palette.bar, fontWeight: 600 }}>เหลือ {spotsLeft} ที่นั่ง</span>
            ) : (
              <span className={`${font} text-[11px] text-gray-500 tabular-nums`}>{Math.round(seatsFreePct)}% ว่าง</span>
            )}
          </div>
          <div className="h-[5px] rounded-full bg-gray-100 overflow-hidden mt-1.5">
            <div className="h-full rounded-full transition-all" style={{ width: `${seatsTakenPct}%`, background: isUrgent ? palette.bar : "#9ca3af" }} />
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onOpen(); }}
          disabled={isClosed}
          className={`${font} mt-2 h-[40px] rounded-[10px] text-white text-[13px] transition-all ${isClosed ? "bg-gray-300 cursor-not-allowed" : "cursor-pointer hover:brightness-105 active:scale-[0.99]"}`}
          style={{ background: isClosed ? undefined : isUrgent ? palette.bar : "#319754", fontWeight: 600 }}
        >
          {isClosed ? "ปิดรับสมัครแล้ว" : isRegistered ? "เข้าร่วมแล้ว ✓" : isUrgent ? `รับด่วน — เหลือ ${spotsLeft} ที่นั่ง!` : "ขอเข้าร่วมทดสอบ"}
        </button>
      </div>
    </motion.div>
  );
}
