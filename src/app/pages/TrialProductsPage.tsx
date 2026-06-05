import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Users, Clock, Check, FlaskConical, ShieldCheck, Coins, Pencil } from "lucide-react";
import { TRIAL_PRODUCTS, loadRegistrations, loadTesterProfile, REGISTRATIONS_STORAGE_KEY, TESTER_PROFILE_STORAGE_KEY } from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function TrialProductsPage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(() => loadRegistrations());
  const [testerProfile, setTesterProfile] = useState(() => loadTesterProfile());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === REGISTRATIONS_STORAGE_KEY) setRegistrations(loadRegistrations());
      if (e.key === TESTER_PROFILE_STORAGE_KEY) setTesterProfile(loadTesterProfile());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Refresh from storage on focus too (covers same-tab edits from detail/register pages)
  useEffect(() => {
    const onFocus = () => {
      setRegistrations(loadRegistrations());
      setTesterProfile(loadTesterProfile());
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const registeredIds = useMemo(() => new Set(registrations.map((r) => r.trialId)), [registrations]);
  const totalPoints = useMemo(
    () => TRIAL_PRODUCTS
      .filter((p) => registeredIds.has(p.id))
      .reduce((sum, p) => sum + p.rewardPoints, 0),
    [registeredIds]
  );

  return (
    <div className="w-full">
      {/* ===== Hero — negative margin pulls section up behind translucent appbar ===== */}
      <section className="relative -mt-[98px] md:-mt-[124px] bg-gradient-to-br from-[#f0fdf4] via-white to-[#eff6ff] pt-[120px] md:pt-[150px] pb-8 md:pb-10 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`${font} text-[28px] md:text-[42px] text-[#1a1a1a] mb-3 leading-tight`}
            style={{ fontWeight: 700 }}
          >
            <span style={{ backgroundImage: "linear-gradient(135deg, #319754, #46c474)", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>ผลิตภัณฑ์เพื่อการทดสอบ</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`${font} text-[15px] md:text-[16px] text-gray-600 whitespace-nowrap`}
          >
            ทดลองสินค้า Beta ฟรี
            <span className="mx-2 text-gray-300">·</span>
            ให้รีวิว
            <span className="mx-2 text-gray-300">·</span>
            สะสมคะแนนสมาชิก
          </motion.p>

          <div className="mt-6 flex flex-col items-center gap-3">
          {testerProfile ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1"
            >
              <span className="inline-flex items-center gap-2">
                <Check className="size-[16px] text-[#319754]" strokeWidth={2.6} />
                <span className={`${font} text-[14px] text-[#1d5b32]`} style={{ fontWeight: 600 }}>
                  ลงทะเบียนเป็นผู้ทดสอบแล้ว{testerProfile.displayName ? ` · ${testerProfile.displayName}` : ""}
                </span>
              </span>
              <button
                onClick={() => navigate("/trials/register")}
                aria-label="แก้ไขโปรไฟล์ผู้ทดสอบ"
                title="แก้ไขโปรไฟล์ผู้ทดสอบ"
                className="size-[28px] rounded-full flex items-center justify-center text-gray-500 hover:text-[#319754] hover:bg-[#319754]/10 cursor-pointer transition-colors"
              >
                <Pencil className="size-[14px]" strokeWidth={2.2} />
              </button>
            </motion.div>
          ) : (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/trials/register")}
              className={`${font} inline-flex items-center gap-2 h-[48px] px-6 rounded-full text-white text-[15px] cursor-pointer shadow-[0_10px_24px_-6px_rgba(49,151,84,0.45)] hover:shadow-[0_14px_30px_-6px_rgba(49,151,84,0.55)] transition-shadow`}
              style={{
                background: "linear-gradient(135deg, #319754 0%, #46c474 100%)",
                fontWeight: 600,
              }}
            >
              <FlaskConical className="size-[18px]" strokeWidth={2.4} />
              ลงทะเบียนเข้าร่วมทดสอบ
            </motion.button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 px-5 py-3 bg-white rounded-full border border-gray-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.08)]"
          >
            {(() => {
              const items = [
                { icon: Users, label: "ผู้เข้าร่วม 1,200+", accent: "#319754" },
                { icon: FlaskConical, label: `${TRIAL_PRODUCTS.length} สินค้าทดลอง`, accent: "#319754" },
              ];
              if (registrations.length > 0) {
                items.push(
                  { icon: Check, label: `เข้าร่วมแล้ว ${registrations.length} รายการ`, accent: "#319754" },
                  { icon: Coins, label: `+${totalPoints.toLocaleString()} คะแนน`, accent: "#d97706" },
                );
              }
              return items.map((s, i, arr) => (
                <span key={s.label} className="inline-flex items-center gap-1.5">
                  <s.icon className="size-[14px]" style={{ color: s.accent }} strokeWidth={2.4} />
                  <span className={`${font} text-[13px] text-gray-700`} style={{ fontWeight: 500 }}>{s.label}</span>
                  {i < arr.length - 1 && <span className="text-gray-300 ml-3 hidden sm:inline">·</span>}
                </span>
              ));
            })()}
          </motion.div>
          </div>
        </div>
      </section>

      {/* ===== Trial product grid — clicking a card navigates to /trials/:id ===== */}
      <section id="trial-grid" className="pt-6 pb-12 px-4 md:px-8 scroll-mt-[124px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
            {TRIAL_PRODUCTS.map((p, i) => {
              const spotsLeft = p.spotsTotal - p.spotsTaken;
              const pct = (p.spotsTaken / p.spotsTotal) * 100;
              const isClosed = spotsLeft <= 0 || p.endsInDays <= 0;
              const isRegistered = registeredIds.has(p.id);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => navigate(`/trials/${p.id}`)}
                  className={`bg-white rounded-[16px] border overflow-hidden flex flex-col h-[259px] group/card transition-all duration-300 cursor-pointer ${
                    isClosed
                      ? "border-[#d4d4d4] opacity-70"
                      : isRegistered
                      ? "border-[#319754]/40"
                      : "border-[#d4d4d4] hover:border-[#319754]/40 hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  <div className="flex-1 relative min-h-0 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500"
                    />
                    {/* Top-right badge — fixed width keeps all states visually consistent */}
                    <div className="absolute top-0 right-0 p-[6px]">
                      {isRegistered ? (
                        <div className="bg-[#319754] h-[22px] w-[88px] rounded-full shadow-[0_2px_6px_rgba(49,151,84,0.4)] flex items-center justify-center gap-1">
                          <Check className="size-2.5 text-white" strokeWidth={3} />
                          <span className={`${font} text-[10px] text-white whitespace-nowrap`} style={{ fontWeight: 600 }}>เข้าร่วมแล้ว</span>
                        </div>
                      ) : isClosed ? (
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
                      {!isClosed && !isRegistered && spotsLeft <= 10 && (
                        <span className={`${font} text-[10px] text-[#dc2626] tabular-nums`} style={{ fontWeight: 600 }}>เหลือ {spotsLeft}!</span>
                      )}
                    </div>
                    <div className="h-[4px] rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, pct)}%`,
                          background: pct >= 90 ? "#dc2626" : pct >= 60 ? "#f59e0b" : "#319754",
                        }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
