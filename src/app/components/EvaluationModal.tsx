import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Star, X, Send, Sparkles, FileText, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import type { TrialProduct, Evaluation, ConditionalAnswer } from "../data/trialProducts";
import {
  generateEvalQuestions, PHASE_META,
  type EvalQuestion, type Phase,
} from "../data/evalQuestions";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

/** Per-question form state — covers every QuestionType the library can produce. Each
 *  question's state lives in its matching map keyed by `q.id`. */
type FormState = {
  /** Scale 1-5 ratings (also covers the always-on `core_overall` stars question). */
  scoreById: Record<string, number>;
  /** NPS 0-10 (always-on `core_nps`). */
  npsScores: Record<string, number>;
  /** Single-pick MC. */
  mcAnswers: Record<string, string>;
  /** Multi-select tags. */
  tagAnswers: Record<string, string[]>;
  /** A/B preference. */
  abChoices: Record<string, "A" | "B">;
  /** Free-text (price ceiling, A/B diff notes, always-on comment is special-cased). */
  textAnswers: Record<string, string>;
  /** Conditional yes/no + note. */
  conditionalAnswers: Record<string, ConditionalAnswer>;
};

const emptyForm = (): FormState => ({
  scoreById: {}, npsScores: {}, mcAnswers: {}, tagAnswers: {},
  abChoices: {}, textAnswers: {}, conditionalAnswers: {},
});

/** Resolve the trial's form definition. Falls back to legacy `whatToTest` strings
 *  for trials without testObjectives so the modal still works on legacy data. */
function getFormQuestions(product: TrialProduct): EvalQuestion[] {
  const objectives = product.testObjectives ?? [];
  if (objectives.length > 0) {
    // Falls back to baseline + after_full because the create-form modal no longer exposes
    // "first_use" as a phase. We also hard-strip it out of any cached activePhases so legacy
    // trials don't surface a "during use" form.
    const phases = (product.activePhases && product.activePhases.length > 0
      ? product.activePhases
      : (["baseline", "after_full"] as Exclude<Phase, "always">[])
    ).filter((ph) => ph !== "first_use") as Exclude<Phase, "always">[];
    return generateEvalQuestions(objectives, product.category)
      .filter((q) => q.phase !== "first_use" && (q.phase === "always" || phases.includes(q.phase as Exclude<Phase, "always">)));
  }
  // Legacy fallback — treat whatToTest entries as scale_1_5 baseline questions.
  const legacy: EvalQuestion[] = product.whatToTest.map((label, i) => ({
    id: `legacy_${i}`,
    label,
    type: "scale_1_5",
    phase: "baseline",
    objective: "efficacy",
  }));
  legacy.push(
    { id: "core_overall", label: "ความพึงพอใจโดยรวม", type: "stars_1_5", phase: "always", objective: "efficacy" },
    { id: "core_nps",     label: "แนะนำให้คนอื่น (NPS)", type: "nps_0_10", phase: "always", objective: "efficacy" },
    { id: "core_text",    label: "คำแนะนำเพิ่มเติม",   type: "text",     phase: "always", objective: "efficacy" },
  );
  return legacy;
}

/** Group generated questions into the Tester-facing forms (one per non-"always" phase),
 *  with always-on questions appended to the LAST form so Tester answers them once. */
function groupIntoForms(questions: EvalQuestion[], evaluationDays?: number) {
  const groups: Record<Phase, EvalQuestion[]> = { baseline: [], first_use: [], after_full: [], always: [] };
  questions.forEach((q) => { groups[q.phase].push(q); });
  const alwaysList = groups.always;
  const selected = (["baseline", "first_use", "after_full"] as Exclude<Phase, "always">[])
    .filter((ph) => groups[ph].length > 0);
  const lastIdx = selected.length - 1;
  return selected.map((ph, idx) => ({
    phase: ph,
    meta: PHASE_META[ph],
    timing: ph === "baseline"
      ? "ส่งทันทีหลังจัดส่ง"
      : ph === "after_full"
        ? evaluationDays ? `ส่งวันที่ ${evaluationDays}` : "หลังใช้ครบ"
        : "หลังใช้ครั้งแรก",
    questions: [
      ...groups[ph],
      ...(idx === lastIdx ? alwaysList : []),
    ],
    isLast: idx === lastIdx,
  }));
}

/** Project the form state back into the canonical `Evaluation` shape the dashboard reads. */
function buildEvaluation(form: FormState, questions: EvalQuestion[]): Evaluation {
  const overall = form.scoreById["core_overall"] ?? 0;
  const nps = form.npsScores["core_nps"];
  // Comment lives at `evaluation.comment` for back-compat with existing dashboard widgets.
  const comment = form.textAnswers["core_text"] ?? "";
  // wouldRecommend derived from NPS when present (Promoter = 9-10 → true); falls back to
  // overall ≥ 4 when the always-on NPS wasn't selected.
  const wouldRecommend = typeof nps === "number" ? nps >= 7 : overall >= 4;
  // Legacy criteria map — keyed by question LABEL so older dashboard surfaces that haven't
  // been migrated to scoreById still find their data.
  const criteria: Record<string, number> = {};
  questions.forEach((q) => {
    if (q.type === "scale_1_5") {
      const v = form.scoreById[q.id];
      if (typeof v === "number" && v >= 1 && v <= 5) criteria[q.label] = v;
    }
  });
  return {
    overall,
    criteria,
    comment: comment.trim(),
    wouldRecommend,
    scoreById: { ...form.scoreById },
    npsScores: { ...form.npsScores },
    mcAnswers: { ...form.mcAnswers },
    tagAnswers: { ...form.tagAnswers },
    abChoices: { ...form.abChoices },
    textAnswers: Object.fromEntries(
      Object.entries(form.textAnswers).filter(([k]) => k !== "core_text")
    ),
    conditionalAnswers: { ...form.conditionalAnswers },
  };
}

/** Has the tester answered this question? Used for completion gating. */
function isAnswered(q: EvalQuestion, form: FormState): boolean {
  switch (q.type) {
    case "scale_1_5":
    case "stars_1_5":     return (form.scoreById[q.id] ?? 0) > 0;
    case "nps_0_10":      return typeof form.npsScores[q.id] === "number";
    case "multiple_choice":return !!form.mcAnswers[q.id];
    case "tag":            return (form.tagAnswers[q.id]?.length ?? 0) > 0;
    case "conditional":    return !!form.conditionalAnswers[q.id];
    case "text":
      if (q.id === "core_text") return (form.textAnswers[q.id] ?? "").trim().length >= 10;
      return (form.textAnswers[q.id] ?? "").trim().length > 0;
    case "ab_choice":      return !!form.abChoices[q.id];
  }
}

// ============================================================
//  Tester-facing form modal
// ============================================================

export function EvaluationModal({
  product, onClose, onSubmit,
}: {
  product: TrialProduct;
  onClose: () => void;
  onSubmit: (evaluation: Evaluation) => void;
}) {
  const questions = useMemo(() => getFormQuestions(product), [product]);
  const forms = useMemo(() => groupIntoForms(questions, product.evaluationDays), [questions, product.evaluationDays]);
  const [form, setForm] = useState<FormState>(emptyForm);

  const allAnswered = questions.every((q) => isAnswered(q, form));
  const handleSubmit = () => {
    if (!allAnswered) {
      toast.error("กรอกแบบประเมินให้ครบทุกข้อ");
      return;
    }
    onSubmit(buildEvaluation(form, questions));
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
        className="bg-white rounded-[20px] max-w-[620px] w-full max-h-[92vh] overflow-y-auto shadow-2xl"
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

        {/* Body — one card per form (matches the preview Tester sees on the trial detail) */}
        <div className="bg-gradient-to-b from-[#fafafa] to-white p-5 space-y-5">
          {forms.map((f, formIdx) => (
            <div key={f.phase} className="rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]">
              <FormHeader formNum={formIdx + 1} totalForms={forms.length} label={f.meta.label} timing={f.timing} color={f.meta.color} questionCount={f.questions.length} />
              <div className="bg-white p-4 space-y-3">
                {f.questions.map((q, idx) => (
                  <QuestionField key={q.id} q={q} idx={idx} accentColor={f.meta.color} form={form} setForm={setForm} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white/95 backdrop-blur-md px-5 py-4 border-t border-gray-100 flex justify-between items-center gap-3 z-10">
          <p className={`${font} text-[11px] text-gray-500`}>
            {questions.filter((q) => isAnswered(q, form)).length} / {questions.length} ข้อที่ตอบแล้ว
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className={`${font} h-[42px] px-5 rounded-full text-gray-700 text-[14px] hover:bg-gray-100 cursor-pointer transition-colors`} style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
            <button onClick={handleSubmit} disabled={!allAnswered}
              className={`${font} inline-flex items-center gap-2 h-[42px] px-5 rounded-full text-white text-[14px] transition-colors ${allAnswered ? "bg-[#319754] hover:bg-[#267a43] cursor-pointer shadow-[0_4px_14px_-2px_rgba(49,151,84,0.4)]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              style={{ fontWeight: 600 }}>
              <Send className="size-4" strokeWidth={2.4} /> ส่งแบบประเมิน · รับ +{product.rewardPoints.toLocaleString()} คะแนน
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** ===== Form header shared between editable modal and read-only view ===== */
function FormHeader({ formNum, totalForms, label, timing, color, questionCount }: {
  formNum: number; totalForms: number; label: string; timing: string; color: string; questionCount: number;
}) {
  return (
    <div className="relative px-5 py-3.5 overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}>
      <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" strokeWidth={1.5} />
      <div className="relative flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
            <FileText className="size-4 text-white" strokeWidth={2.4} />
          </div>
          <div className="min-w-0">
            <p className={`${font} text-[10.5px] text-white/80 uppercase tracking-wide`} style={{ fontWeight: 600 }}>
              ฟอร์มที่ {formNum} / {totalForms}
            </p>
            <p className={`${font} text-[14px] text-white leading-tight`} style={{ fontWeight: 700 }}>{label}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`${font} inline-flex items-center gap-1 text-[10.5px] text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full`}>
            <Clock className="size-3" strokeWidth={2.4} />
            {timing}
          </span>
          <span className={`${font} text-[10px] text-white/75 tabular-nums`}>{questionCount} คำถาม</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  Per-question editable inputs — dispatches on q.type
// ============================================================

function QuestionField({ q, idx, accentColor, form, setForm }: {
  q: EvalQuestion; idx: number; accentColor: string;
  form: FormState; setForm: (updater: (prev: FormState) => FormState) => void;
}) {
  return (
    <div className="bg-gradient-to-br from-gray-50/40 to-transparent rounded-xl p-3.5 border border-gray-100">
      <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3 flex items-start gap-2`} style={{ fontWeight: 500 }}>
        <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] tabular-nums shrink-0 mt-px"
          style={{ background: `${accentColor}15`, color: accentColor, fontWeight: 700 }}>{idx + 1}</span>
        <span className="flex-1">{q.label}</span>
        {q.phase === "always" && (
          <span className={`${font} text-[9.5px] inline-flex items-center px-1.5 py-0.5 rounded-full shrink-0`}
            style={{ background: `${accentColor}10`, color: accentColor, fontWeight: 600 }}>
            สรุปท้ายฟอร์ม
          </span>
        )}
      </p>
      <QuestionInput q={q} accentColor={accentColor} form={form} setForm={setForm} />
    </div>
  );
}

function QuestionInput({ q, accentColor, form, setForm }: {
  q: EvalQuestion; accentColor: string;
  form: FormState; setForm: (updater: (prev: FormState) => FormState) => void;
}) {
  switch (q.type) {
    case "scale_1_5":
      return <ScaleInput value={form.scoreById[q.id] ?? 0}
        onChange={(v) => setForm((p) => ({ ...p, scoreById: { ...p.scoreById, [q.id]: v } }))}
        color={accentColor} />;
    case "stars_1_5":
      return <StarsInput value={form.scoreById[q.id] ?? 0}
        onChange={(v) => setForm((p) => ({ ...p, scoreById: { ...p.scoreById, [q.id]: v } }))} />;
    case "nps_0_10":
      return <NpsInput value={form.npsScores[q.id]}
        onChange={(v) => setForm((p) => ({ ...p, npsScores: { ...p.npsScores, [q.id]: v } }))} />;
    case "multiple_choice":
      return <McInput options={q.options ?? []} value={form.mcAnswers[q.id] ?? ""}
        onChange={(v) => setForm((p) => ({ ...p, mcAnswers: { ...p.mcAnswers, [q.id]: v } }))}
        color={accentColor} />;
    case "tag":
      return <TagInput options={q.options ?? ["นุ่ม", "ลื่น", "ฉ่ำ", "ซึมไว", "เย็น", "หอมอ่อน"]}
        value={form.tagAnswers[q.id] ?? []}
        onChange={(v) => setForm((p) => ({ ...p, tagAnswers: { ...p.tagAnswers, [q.id]: v } }))}
        color={accentColor} />;
    case "conditional":
      return <ConditionalInput value={form.conditionalAnswers[q.id]}
        onChange={(v) => setForm((p) => ({ ...p, conditionalAnswers: { ...p.conditionalAnswers, [q.id]: v } }))} />;
    case "text":
      return <TextInput
        value={form.textAnswers[q.id] ?? ""}
        onChange={(v) => setForm((p) => ({ ...p, textAnswers: { ...p.textAnswers, [q.id]: v } }))}
        isLong={q.id === "core_text"}
        minChars={q.id === "core_text" ? 10 : undefined}
      />;
    case "ab_choice":
      return <AbInput value={form.abChoices[q.id]}
        onChange={(v) => setForm((p) => ({ ...p, abChoices: { ...p.abChoices, [q.id]: v } }))} />;
  }
}

function ScaleInput({ value, onChange, color }: { value: number; onChange: (v: number) => void; color: string }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n === value;
        return (
          <button key={n} type="button" onClick={() => onChange(n)}
            className={`${font} size-10 rounded-full border-2 text-[13px] cursor-pointer transition-all ${
              active ? "text-white" : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
            }`}
            style={{
              background: active ? color : undefined,
              borderColor: active ? color : undefined,
              boxShadow: active ? `0 2px 8px ${color}40` : undefined,
              fontWeight: active ? 700 : 600,
            }}>
            {n}
          </button>
        );
      })}
      <span className={`${font} text-[11px] text-gray-400 ml-2`}>(1 = น้อย, 5 = มาก)</span>
    </div>
  );
}

function StarsInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" onClick={() => onChange(n)} className="cursor-pointer transition-transform active:scale-90">
          <Star className={`size-7 transition-colors ${n <= value ? "fill-amber-400 text-amber-400" : "fill-transparent text-gray-300 hover:text-amber-300"}`} strokeWidth={2} />
        </button>
      ))}
      {value > 0 && <span className={`${font} text-[12px] text-amber-700 ml-2 tabular-nums`} style={{ fontWeight: 700 }}>{value}/5</span>}
    </div>
  );
}

function NpsInput({ value, onChange }: { value: number | undefined; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {Array.from({ length: 11 }, (_, n) => n).map((n) => {
          const active = n === value;
          const color = n <= 6 ? "#ef4444" : n <= 8 ? "#f59e0b" : "#319754";
          return (
            <button key={n} type="button" onClick={() => onChange(n)}
              className={`${font} size-8 rounded-full text-[12px] tabular-nums transition-all cursor-pointer ${active ? "text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"}`}
              style={{
                background: active ? color : undefined,
                borderColor: active ? color : undefined,
                fontWeight: active ? 700 : 600,
                boxShadow: active ? `0 2px 8px ${color}40` : undefined,
              }}>
              {n}
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className={`${font} text-[10.5px] text-gray-400`}>0 = ไม่แนะนำเลย</span>
        <span className={`${font} text-[10.5px] text-gray-400`}>10 = แนะนำสุด ๆ</span>
      </div>
    </div>
  );
}

function McInput({ options, value, onChange, color }: { options: string[]; value: string; onChange: (v: string) => void; color: string }) {
  return (
    <div className="space-y-1.5">
      {options.map((opt) => {
        const active = opt === value;
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`${font} w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[12.5px] text-left cursor-pointer transition-all border-2`}
            style={{
              background: active ? `${color}10` : "white",
              borderColor: active ? color : "#e5e7eb",
              color: active ? color : "#1a1a1a",
              fontWeight: active ? 700 : 500,
            }}>
            <span className={`size-4 rounded-full border-2 flex-shrink-0 inline-flex items-center justify-center`}
              style={{ borderColor: active ? color : "#cbd5e1" }}>
              {active && <span className="size-2 rounded-full" style={{ background: color }} />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function TagInput({ options, value, onChange, color }: { options: string[]; value: string[]; onChange: (v: string[]) => void; color: string }) {
  const toggle = (t: string) => {
    if (value.includes(t)) onChange(value.filter((x) => x !== t));
    else onChange([...value, t]);
  };
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((opt) => {
        const active = value.includes(opt);
        return (
          <button key={opt} type="button" onClick={() => toggle(opt)}
            className={`${font} inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] cursor-pointer transition-all border-2`}
            style={{
              background: active ? color : "white",
              borderColor: active ? color : "#e5e7eb",
              color: active ? "white" : "#1a1a1a",
              fontWeight: active ? 700 : 500,
            }}>
            {active && <span className="text-[10px]">✓</span>}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function ConditionalInput({ value, onChange }: { value: ConditionalAnswer | undefined; onChange: (v: ConditionalAnswer) => void }) {
  const yes = value?.has === true;
  const no = value?.has === false;
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => onChange({ has: false })}
          className={`${font} h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border-2 text-[13px] cursor-pointer transition-all ${
            no ? "border-[#319754] bg-[#319754] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
          style={{ fontWeight: no ? 700 : 600 }}>
          ไม่มี
        </button>
        <button type="button" onClick={() => onChange({ has: true, note: value?.note ?? "" })}
          className={`${font} h-[44px] inline-flex items-center justify-center gap-2 rounded-lg border-2 text-[13px] cursor-pointer transition-all ${
            yes ? "border-[#ef4444] bg-[#ef4444] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
          style={{ fontWeight: yes ? 700 : 600 }}>
          <AlertTriangle className="size-3.5" strokeWidth={2.4} /> มี (ระบุ)
        </button>
      </div>
      {yes && (
        <textarea
          value={value?.note ?? ""}
          onChange={(e) => onChange({ has: true, note: e.target.value })}
          placeholder="กรุณาระบุอาการหรือผลข้างเคียงที่พบ"
          rows={2}
          className={`${font} w-full px-3 py-2 rounded-lg border border-red-200 text-[12.5px] text-[#1a1a1a] outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all resize-none placeholder:text-gray-400`}
        />
      )}
    </div>
  );
}

function TextInput({ value, onChange, isLong, minChars }: { value: string; onChange: (v: string) => void; isLong?: boolean; minChars?: number }) {
  if (isLong) {
    return (
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="เล่าประสบการณ์การใช้สินค้า — ผลลัพธ์, สิ่งที่ชอบ, สิ่งที่อยากให้ปรับปรุง"
          rows={3}
          className={`${font} w-full px-3 py-2.5 rounded-lg border border-gray-200 text-[13px] text-[#1a1a1a] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 transition-all resize-none leading-relaxed placeholder:text-gray-400`}
        />
        {minChars && (
          <p className={`${font} text-[10.5px] text-gray-400 mt-1 text-right tabular-nums`}>
            {value.trim().length} / {minChars} ขั้นต่ำ
          </p>
        )}
      </div>
    );
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="พิมพ์คำตอบที่นี่..."
      className={`${font} w-full px-3 py-2 rounded-lg border border-gray-200 text-[13px] text-[#1a1a1a] outline-none focus:border-[#319754] focus:ring-2 focus:ring-[#319754]/15 transition-all placeholder:text-gray-400`}
    />
  );
}

function AbInput({ value, onChange }: { value: "A" | "B" | undefined; onChange: (v: "A" | "B") => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {(["A", "B"] as const).map((opt) => {
        const active = opt === value;
        const color = opt === "A" ? "#3b82f6" : "#319754";
        return (
          <button key={opt} type="button" onClick={() => onChange(opt)}
            className={`${font} h-[52px] rounded-xl border-2 text-[15px] cursor-pointer transition-all`}
            style={{
              background: active ? color : "white",
              borderColor: active ? color : "#e5e7eb",
              color: active ? "white" : "#6b7280",
              fontWeight: active ? 800 : 600,
              boxShadow: active ? `0 4px 14px ${color}40` : undefined,
            }}>
            สูตร {opt}
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

// ============================================================
//  Read-only Owner-side view — renders each Tester answer back
// ============================================================

export function EvaluationView({ evaluation, product }: { evaluation: Evaluation; product: TrialProduct }) {
  const questions = useMemo(() => getFormQuestions(product), [product]);
  const forms = useMemo(() => groupIntoForms(questions, product.evaluationDays), [questions, product.evaluationDays]);

  return (
    <div className="space-y-5">
      {forms.map((f, formIdx) => (
        <div key={f.phase} className="rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]">
          <FormHeader formNum={formIdx + 1} totalForms={forms.length} label={f.meta.label} timing={f.timing} color={f.meta.color} questionCount={f.questions.length} />
          <div className="bg-gradient-to-b from-[#fafafa] to-white p-5 space-y-3">
            {f.questions.map((q, idx) => (
              <ReadOnlyAnswer key={q.id} q={q} idx={idx} accentColor={f.meta.color} evaluation={evaluation} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Read-only view for one answer. Mirrors the layout used by the editable QuestionField. */
function ReadOnlyAnswer({ q, idx, accentColor, evaluation }: {
  q: EvalQuestion; idx: number; accentColor: string; evaluation: Evaluation;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
      <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3 flex items-start gap-2`} style={{ fontWeight: 500 }}>
        <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] tabular-nums shrink-0 mt-px"
          style={{ background: `${accentColor}15`, color: accentColor, fontWeight: 700 }}>{idx + 1}</span>
        <span className="flex-1">{q.label}</span>
      </p>
      <ReadOnlyAnswerBody q={q} accentColor={accentColor} evaluation={evaluation} />
    </div>
  );
}

function ReadOnlyAnswerBody({ q, accentColor, evaluation }: { q: EvalQuestion; accentColor: string; evaluation: Evaluation }) {
  const noAnswer = <p className={`${font} text-[11px] text-gray-400 italic`}>ยังไม่ได้ตอบ</p>;
  switch (q.type) {
    case "scale_1_5": {
      const v = evaluation.scoreById?.[q.id] ?? evaluation.criteria[q.label] ?? 0;
      if (!v) return noAnswer;
      return (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n === v;
            return (
              <span key={n}
                className={`${font} size-10 inline-flex items-center justify-center rounded-full border-2 text-[13px]`}
                style={{
                  background: active ? accentColor : "white",
                  borderColor: active ? accentColor : "#e5e7eb",
                  color: active ? "white" : "#9ca3af",
                  fontWeight: active ? 700 : 600,
                  boxShadow: active ? `0 2px 8px ${accentColor}40` : undefined,
                }}>
                {n}
              </span>
            );
          })}
          <span className={`${font} text-[11px] text-gray-400 ml-2`}>(1 = น้อย, 5 = มาก)</span>
        </div>
      );
    }
    case "stars_1_5": {
      const v = q.id === "core_overall" ? evaluation.overall : (evaluation.scoreById?.[q.id] ?? 0);
      if (!v) return noAnswer;
      return (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <span key={n} className="size-7 inline-flex items-center justify-center text-[22px]"
              style={{ color: n <= v ? "#f59e0b" : "#e5e7eb" }}>★</span>
          ))}
          <span className={`${font} text-[12px] text-amber-700 ml-2`} style={{ fontWeight: 700 }}>
            {v}/5 · {ratingLabel(v)}
          </span>
        </div>
      );
    }
    case "nps_0_10": {
      const v = evaluation.npsScores?.[q.id];
      if (typeof v !== "number") return noAnswer;
      const segment = v <= 6 ? { label: "Detractor", color: "#ef4444" }
                    : v <= 8 ? { label: "Passive",   color: "#f59e0b" }
                    :          { label: "Promoter",  color: "#319754" };
      return (
        <div className="flex items-center gap-2">
          <span className={`${font} inline-flex items-center justify-center size-9 rounded-full text-[15px] tabular-nums text-white`}
            style={{ background: segment.color, fontWeight: 700 }}>{v}</span>
          <span className={`${font} inline-flex items-center px-2 py-0.5 rounded-full text-[11px]`}
            style={{ background: `${segment.color}15`, color: segment.color, fontWeight: 700 }}>
            {segment.label}
          </span>
        </div>
      );
    }
    case "multiple_choice": {
      const v = evaluation.mcAnswers?.[q.id];
      if (!v) return noAnswer;
      return (
        <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px]`}
          style={{ background: `${accentColor}12`, color: accentColor, fontWeight: 700 }}>
          ✓ {v}
        </span>
      );
    }
    case "tag": {
      const v = evaluation.tagAnswers?.[q.id];
      if (!v || v.length === 0) return noAnswer;
      return (
        <div className="flex flex-wrap gap-1.5">
          {v.map((t) => (
            <span key={t} className={`${font} inline-flex items-center px-2.5 py-1 rounded-full text-[11.5px]`}
              style={{ background: `${accentColor}15`, color: accentColor, fontWeight: 600 }}>
              {t}
            </span>
          ))}
        </div>
      );
    }
    case "conditional": {
      const v = evaluation.conditionalAnswers?.[q.id];
      if (!v) return noAnswer;
      const color = v.has ? "#ef4444" : "#319754";
      return (
        <div className="space-y-2">
          <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px]`}
            style={{ background: `${color}15`, color, fontWeight: 700 }}>
            {v.has ? "⚠ มี" : "✓ ไม่มี"}
          </span>
          {v.has && v.note && (
            <p className={`${font} text-[12px] text-gray-700 italic leading-relaxed bg-red-50/40 rounded-lg px-3 py-2 border border-red-100`}>
              "{v.note}"
            </p>
          )}
        </div>
      );
    }
    case "text": {
      const v = q.id === "core_text" ? evaluation.comment : evaluation.textAnswers?.[q.id];
      if (!v) return noAnswer;
      return (
        <p className={`${font} text-[12.5px] text-gray-700 leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-3 border border-gray-100`}>
          "{v}"
        </p>
      );
    }
    case "ab_choice": {
      const v = evaluation.abChoices?.[q.id];
      if (!v) return noAnswer;
      const color = v === "A" ? "#3b82f6" : "#319754";
      return (
        <span className={`${font} inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[13px] text-white`}
          style={{ background: color, fontWeight: 700, boxShadow: `0 2px 8px ${color}40` }}>
          ✓ สูตร {v}
        </span>
      );
    }
  }
}

