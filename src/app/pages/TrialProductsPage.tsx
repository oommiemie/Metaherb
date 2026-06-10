import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Sparkles, Users, Clock, Check, FlaskConical, ShieldCheck, Coins, Pencil, ArrowRight, RotateCcw } from "lucide-react";
import { TrialCard } from "../components/TrialCard";
import { TRIAL_PRODUCTS, TRIAL_CONCERNS, loadRegistrations, loadTesterProfile, REGISTRATIONS_STORAGE_KEY, TESTER_PROFILE_STORAGE_KEY, getRegistrationStatus, type ConcernKey } from "../data/trialProducts";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

export function TrialProductsPage() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(() => loadRegistrations());
  const [testerProfile, setTesterProfile] = useState(() => loadTesterProfile());
  const [concernFilter, setConcernFilter] = useState<ConcernKey | "all">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "joined" | "needsEval">("all");
  const filteredTrials = useMemo(() => {
    // Trial IDs the user is currently joined on (still active = not evaluated/rejected)
    const joinedIds = new Set(registrations.filter((r) => !r.rejectedAt).map((r) => r.trialId));
    const needsEvalIds = new Set(
      registrations.filter((r) => getRegistrationStatus(r) === "approved").map((r) => r.trialId),
    );
    return TRIAL_PRODUCTS.filter((p) => {
      if (concernFilter !== "all" && !p.concerns?.includes(concernFilter)) return false;
      if (typeFilter === "joined"    && !joinedIds.has(p.id))    return false;
      if (typeFilter === "needsEval" && !needsEvalIds.has(p.id)) return false;
      return true;
    });
  }, [concernFilter, typeFilter, registrations]);
  const resetFilters = () => { setConcernFilter("all"); setTypeFilter("all"); };

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
      {/* ===== Hero — match /products title size + style ===== */}
      <section className="relative -mt-[64px] md:-mt-[116px] bg-[#eaf3ee] pt-[80px] md:pt-[136px] pb-5 md:pb-6 px-4 md:px-8">
        <div className="max-w-[1200px] mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={`${font} text-[20px] sm:text-[24px] text-[#319754] leading-tight`}
            style={{ fontWeight: 500 }}
          >
            ผลิตภัณฑ์เพื่อการทดสอบ
          </motion.h1>
          <div className="mt-3 flex flex-col items-center gap-3">
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
              onClick={() => navigate("/trials/register")}
              className={`${font} group mt-3 inline-flex items-center gap-2 h-11 pl-2 pr-5 rounded-full bg-white border border-[#319754]/30 text-[#287745] hover:bg-[#319754] hover:text-white hover:border-[#319754] text-[14px] cursor-pointer transition-all shadow-[0_2px_8px_rgba(49,151,84,0.12)]`}
              style={{ fontWeight: 600 }}
            >
              <span className="size-7 rounded-full bg-[#319754]/15 group-hover:bg-white/20 flex items-center justify-center transition-colors">
                <FlaskConical className="size-3.5" strokeWidth={2.4} />
              </span>
              ลงทะเบียนเข้าร่วมทดสอบ
              <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.4} />
            </motion.button>
          )}

          </div>

          {/* KPI strip — platform-level trial stats (inside the green header) */}
          {(() => {
            const openCount = TRIAL_PRODUCTS.filter((p) => (p.spotsTotal - p.spotsTaken) > 0 && p.endsInDays > 0).length;
            const quotaTotal = TRIAL_PRODUCTS.reduce((s, p) => s + p.spotsTotal, 0);
            const appliedTotal = TRIAL_PRODUCTS.reduce((s, p) => s + p.spotsTaken, 0);
            const pointsTotal = TRIAL_PRODUCTS.reduce((s, p) => s + p.rewardPoints, 0);
            const kpis = [
              { label: "ผลิตภัณฑ์ที่เปิดรับ", value: openCount.toLocaleString(),    color: "#1a1a1a" },
              { label: "โควตาผู้ทดสอบ",     value: quotaTotal.toLocaleString(),   color: "#1a1a1a" },
              { label: "ผู้สมัครเข้าร่วม",     value: appliedTotal.toLocaleString(), color: "#1a1a1a" },
              { label: "คะแนนสะสมรวม",    value: `${pointsTotal.toLocaleString()} pts`, color: "#d97706" },
            ];
            return (
              <div className="max-w-[900px] mx-auto mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                {kpis.map((k) => (
                  <div key={k.label} className="bg-white/85 backdrop-blur-sm rounded-[14px] border border-white/60 px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-left">
                    <p className={`${font} text-[12px] text-gray-500`}>{k.label}</p>
                    <p className={`${font} text-[22px] tabular-nums mt-1`} style={{ fontWeight: 700, color: k.color }}>{k.value}</p>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ===== Trial product grid — same layout as /products ===== */}
      <section id="trial-grid" className="scroll-mt-[124px]">
        <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-4 sm:py-6">
          {/* Sidebar — mirrors ProductsPage filter structure */}
          <aside className="hidden lg:block w-[218px] shrink-0">
            <div className="bg-white rounded-2xl p-4 flex flex-col gap-4 sticky top-[128px]">
              {/* Header + reset */}
              <div className="flex items-center justify-between">
                <span className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ตัวกรอง</span>
                <button onClick={resetFilters} title="รีเซ็ตตัวกรอง"
                  className="cursor-pointer text-gray-500 hover:text-[#319754] transition-colors">
                  <RotateCcw className="size-4" strokeWidth={2} />
                </button>
              </div>
              <div className="w-full h-px bg-[#a3a3a3]" />

              {/* หมวดหมู่ — vertical button list (emoji + count) */}
              <div className="flex flex-col gap-2">
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>หมวดหมู่</span>
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => setConcernFilter("all")}
                    className={`${font} flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-left text-[13px] transition-colors cursor-pointer ${
                      concernFilter === "all" ? "bg-[#319754]/10 text-[#1d5b32]" : "text-gray-700 hover:bg-gray-50"
                    }`}
                    style={{ fontWeight: concernFilter === "all" ? 600 : 500 }}
                  >
                    <span className="text-[14px]">📋</span> ทั้งหมด
                    <span className={`${font} ml-auto text-[11px] text-gray-500 tabular-nums`}>{TRIAL_PRODUCTS.length}</span>
                  </button>
                  {TRIAL_CONCERNS.map((c) => {
                    const count = TRIAL_PRODUCTS.filter((p) => p.concerns?.includes(c.key)).length;
                    const active = concernFilter === c.key;
                    return (
                      <button
                        key={c.key}
                        onClick={() => setConcernFilter(c.key)}
                        className={`${font} flex items-center gap-2.5 px-3 py-2 rounded-[10px] text-left text-[13px] transition-colors cursor-pointer ${
                          active ? "bg-[#319754]/10 text-[#1d5b32]" : "text-gray-700 hover:bg-gray-50"
                        }`}
                        style={{ fontWeight: active ? 600 : 500 }}
                      >
                        <span className="text-[14px]">{c.emoji}</span> {c.label}
                        <span className={`${font} ml-auto text-[11px] text-gray-500 tabular-nums`}>{count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ประเภทสินค้า — radio buttons */}
              <div className="flex flex-col gap-2">
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ประเภทสินค้า</span>
                {[
                  { key: "all",       label: "ทั้งหมด" },
                  { key: "joined",    label: "สินค้าที่เข้าร่วมทดสอบ" },
                  { key: "needsEval", label: "สินค้าที่ต้องทำแบบทดสอบ" },
                ].map((opt) => {
                  const checked = typeFilter === opt.key;
                  return (
                    <button key={opt.key} onClick={() => setTypeFilter(opt.key as typeof typeFilter)}
                      className="group flex items-center gap-2.5 cursor-pointer py-1 text-left">
                      <span className={`size-[16px] rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "border-[#319754]" : "border-gray-300 group-hover:border-gray-400"}`}>
                        <span className={`rounded-full bg-[#319754] transition-all ${checked ? "size-[8px]" : "size-0"}`} />
                      </span>
                      <span className={`${font} text-[13px] transition-colors ${checked ? "text-[#319754]" : "text-gray-700 group-hover:text-black"}`} style={{ fontWeight: checked ? 500 : 400 }}>{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Main column — same width treatment as /products */}
          <div className="flex-1 min-w-0">
            {/* Mobile concern pills */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 mb-3">
              <button onClick={() => setConcernFilter("all")}
                className={`${font} shrink-0 text-[13px] px-3.5 py-1.5 rounded-full border transition-colors ${concernFilter === "all" ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-700"}`}
                style={{ fontWeight: 600 }}>📋 ทั้งหมด</button>
              {TRIAL_CONCERNS.map((c) => {
                const active = concernFilter === c.key;
                return (
                  <button key={c.key} onClick={() => setConcernFilter(c.key)}
                    className={`${font} shrink-0 text-[13px] px-3.5 py-1.5 rounded-full border transition-colors ${active ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-700"}`}
                    style={{ fontWeight: 600 }}>{c.emoji} {c.label}</button>
                );
              })}
            </div>

            <p className={`${font} text-[16px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 600 }}>
              คะแนนความพึงพอใจจากเทสเตอร์รุ่นก่อน
              {concernFilter !== "all" && (
                <span className={`${font} ml-2 text-[13px] text-gray-500`} style={{ fontWeight: 400 }}>
                  · {filteredTrials.length} รายการ
                </span>
              )}
            </p>
            {filteredTrials.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-300 rounded-[16px] py-12 text-center">
                <p className={`${font} text-[14px] text-gray-500`}>ไม่พบสินค้าทดลองในหมวดนี้</p>
              </div>
            ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-[16px]">
              {filteredTrials.map((p, i) => (
                <TrialCard key={p.id} p={p} isRegistered={registeredIds.has(p.id)} onOpen={() => navigate(`/trials/${p.id}`)} index={i} />
              ))}
          </div>
          )}
          </div>

        </div>
      </section>
    </div>
  );
}
