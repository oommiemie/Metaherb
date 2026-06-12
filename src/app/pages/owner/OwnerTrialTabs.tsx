import { useState, useMemo, useEffect, useRef, Fragment } from "react";
import { readImageFile } from "../../data/imageUpload";
import { motion, AnimatePresence } from "motion/react";
import {
  FlaskConical, Users, Coins, Check, Clock, ChevronLeft, ChevronRight, Search, Plus, X,
  ArrowUpRight, Calendar, Sparkles, Trash2, Edit3, MapPin, AlertCircle, Phone, MessageCircle, Ban,
  MoreHorizontal, Pencil, EyeOff, Eye, Star, FileText, ThumbsUp, ThumbsDown, Package, ChevronDown,
  Frown, Meh, Smile, AlertTriangle,
  Beaker, ShieldCheck, Upload, Info, BarChart3, Lock, ArrowDownToLine, Download, FileSpreadsheet,
} from "lucide-react";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie } from "recharts";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import genderWomenImg from "../../../assets/women.png";
import genderMenImg from "../../../assets/men.png";
import genderLgbtqImg from "../../../assets/LGBTQ+.png";
import genderOtherImg from "../../../assets/other.png";
import imgDetractors from "../../../assets/Detractors.png";
import imgPassives   from "../../../assets/Passives.png";
import imgPromoters  from "../../../assets/Promoters.png";
import imgCoinLow    from "../../../assets/low-cion.png";
import imgCoinMid    from "../../../assets/medium-cion.png";
import imgCoinHigh   from "../../../assets/higth-cion.png";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import { EvaluationView } from "../../components/EvaluationModal";
import { toast } from "sonner";
import {
  TRIAL_PRODUCTS, loadRegistrations, saveRegistrations, REGISTRATIONS_STORAGE_KEY,
  getRegistrationStatus,
  type Registration, type TrialProduct, type RegistrationStatus,
  type Evaluation, type ConditionalAnswer,
} from "../../data/trialProducts";
import {
  generateEvalQuestions, PHASE_META,
  type TestObjective, type QuestionType, type Phase, type EvalQuestion,
} from "../../data/evalQuestions";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// ============================================================================
//  SHARED DATA HOOKS — combine real (localStorage) + mock owner-wide registrations
// ============================================================================

/** Mock seed of registrations from OTHER users — added to the owner view to make
 *  the tracking table feel realistic. Real user submissions still come from
 *  localStorage and are merged on top of these. */
/** Hand-authored seed rows. The `evaluation` literal on each row supplies overall/comment/
 *  wouldRecommend + a small criteria sample. Real `MOCK_REGISTRATIONS` (declared after
 *  generateEvalQuestions) enriches each row's evaluation with ALL the type-specific maps
 *  the dashboard needs — keeping hand-crafted qualitative fields and synthesising the rest
 *  from QUESTION_LIBRARY so every chart card has data. */
const MOCK_REGISTRATIONS_BASE: Registration[] = [
  // 4 pending_approval (just submitted, owner hasn't decided yet)
  { trialId: "trial-2",  name: "ปัญญา สุขสบาย",     phone: "082-100-9988", address: "22/8 พหลโยธิน 24 จตุจักร กทม. 10900",       motivation: "นอนไม่หลับเรื้อรัง ต้องการตัวช่วยจากธรรมชาติ",  submittedAt: Date.now() - 1 * 86400000, gender: "female", ageRange: "35-44" },
  { trialId: "trial-6",  name: "ดวงใจ พรหมเดช",     phone: "081-888-9911", address: "120/3 ถ.รัชดา ห้วยขวาง กทม. 10310",          motivation: "ทำงานออฟฟิศ ปวดเมื่อยทุกวัน",                  submittedAt: Date.now() - 1 * 86400000, gender: "female", ageRange: "25-34" },

  // 3 approved (waiting for evaluation submission)
  { trialId: "trial-1",  name: "นภัสวรรณ สุขดี",   phone: "081-234-1100", address: "10/2 ถ.พระราม 9 บางกะปิ กทม. 10240",         motivation: "อยากลองสูตรใหม่ — เคยใช้สูตรเก่าแล้วชอบ",       submittedAt: Date.now() - 4 * 86400000, approvedAt: Date.now() - 3 * 86400000, gender: "female", ageRange: "25-34" },
  // Just-approved testers — baseline done, after-use form still locked (haven't reached day 14)
  { trialId: "trial-1",  name: "ธารินี อ่อนหวาน",   phone: "081-220-8800", address: "78 ม.3 บางเขน กทม. 10220",                       motivation: "ทำงานหน้าจอมาก ผิวคล้ำ",                         submittedAt: Date.now() - 2 * 86400000, approvedAt: Date.now() - 1 * 86400000, gender: "female", ageRange: "25-34" },
  { trialId: "trial-1",  name: "ภาสกร วรสิทธิ์",     phone: "082-770-3344", address: "12/9 ลาดพร้าว 64 วังทองหลาง กทม. 10310",         motivation: "ลองสูตรขมิ้นชัน",                                  submittedAt: Date.now() - 5 * 86400000, approvedAt: Date.now() - 4 * 86400000, gender: "male",   ageRange: "35-44" },
  // Approved long ago — after-use unlocked but Tester hasn't submitted yet
  { trialId: "trial-1",  name: "พิมพ์ลภัส รัตนกุล", phone: "086-118-9911", address: "23 รามคำแหง 12 หัวหมาก กทม. 10240",              motivation: "ฝ้ากระเยอะ อยากให้กระจ่างขึ้น",                  submittedAt: Date.now() - 22 * 86400000, approvedAt: Date.now() - 20 * 86400000, gender: "female", ageRange: "45-54" },
  { trialId: "trial-1",  name: "เจษฎา ภูริชา",       phone: "087-447-2200", address: "56 สาทร 8 บางรัก กทม. 10500",                    motivation: "ลองดู เผื่อรอยสิวจาง",                            submittedAt: Date.now() - 18 * 86400000, approvedAt: Date.now() - 16 * 86400000, gender: "male",   ageRange: "25-34" },

  // 4 evaluated (full cycle done) — with sample evaluation data
  { trialId: "trial-1",  name: "อรอนงค์ เจริญสุข", phone: "089-555-2200", address: "55 ม.5 บางใหญ่ นนทบุรี 11140",               motivation: "ผิวมีปัญหารอยดำ อยากลองดูว่าจะช่วยได้ไหม",      submittedAt: Date.now() - 12 * 86400000, approvedAt: Date.now() - 11 * 86400000, evaluatedAt: Date.now() - 1 * 86400000,
    gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 5, "ดีไซน์ / ความสวยงาม": 4, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "เนื้อบางซึมไว ใช้ครบ 2 สัปดาห์เห็นรอยดำจางลงชัดเจน กลิ่นขมิ้นอ่อน ไม่ฉุนเหมือนสูตรเก่า แนะนำเพื่อนแล้ว!", wouldRecommend: true } },
  { trialId: "trial-2",  name: "สมรัก ใจเย็น",       phone: "086-777-3300", address: "9/14 ถ.บางนา บางพลี สมุทรปราการ 10540",      motivation: "อยากลดยานอนหลับ ลองสมุนไพรก่อน",                submittedAt: Date.now() - 15 * 86400000, approvedAt: Date.now() - 14 * 86400000, evaluatedAt: Date.now() - 2 * 86400000,
    gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 4, "ดีไซน์ / ความสวยงาม": 3, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "นอนหลับลึกขึ้นจริงๆ ตื่นมาสดชื่น แต่รสติดขมไปนิด อยากให้เพิ่มกลิ่นวานิลลาหรือน้ำผึ้งหน่อย", wouldRecommend: true } },

  // 1 rejected
  { trialId: "trial-4",  name: "สุชาติ จันทร์ฉาย",   phone: "087-111-2233", address: "100/5 รามอินทรา 65 บางเขน กทม. 10220",       motivation: "อยากลอง",                                          submittedAt: Date.now() - 7 * 86400000, rejectedAt: Date.now() - 6 * 86400000, gender: "male", ageRange: "55+" },

  // ========== Rich evaluation dataset for trial-1 (เซรั่มขมิ้นชัน Brightening v2) ==========
  // 14 more evaluated testers with varied demographics + ratings — drives the dashboard analytics
  { trialId: "trial-1", name: "ธัญลักษณ์ ศิริมงคล", phone: "081-220-3344", address: "88 ลาดพร้าว 122 วังทองหลาง กทม. 10310", motivation: "ผิวหมองคล้ำ อยากให้กระจ่างขึ้น",
    submittedAt: Date.now() - 14*86400000, approvedAt: Date.now() - 13*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ผลที่รู้สึกได้หลังใช้ครบกำหนด": 5, "ดีไซน์ / ความสวยงาม": 4, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "ผิวกระจ่างใสขึ้นจริง ไม่แห้ง", wouldRecommend: true } },
  { trialId: "trial-1", name: "พรพิมล แสงทอง", phone: "082-441-5566", address: "12 รามคำแหง 24 หัวหมาก กทม. 10240", motivation: "ทดสอบสูตรใหม่",
    submittedAt: Date.now() - 13*86400000, approvedAt: Date.now() - 12*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 4, "ความกระจ่างใสของผิวตอนนี้": 3, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "เห็นผลช้านิด แต่ไม่ระคายเคืองดีมาก", wouldRecommend: true } },
  { trialId: "trial-1", name: "สมชาย ใจดี", phone: "083-555-7788", address: "44/12 สุขุมวิท 71 พระโขนง กทม. 10110", motivation: "ลองดู เผื่อช่วยรอยสิว",
    submittedAt: Date.now() - 12*86400000, approvedAt: Date.now() - 11*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 5, "ความกระจ่างใสของผิวตอนนี้": 4, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "ครีมซึมไว ผิวเนียนขึ้น", wouldRecommend: true } },
  { trialId: "trial-1", name: "ฉัตรชัย พงศ์ดี", phone: "081-660-2244", address: "5 ม.7 บางพลี สมุทรปราการ 10540", motivation: "ฝ้ากระเยอะ ลองสูตรขมิ้น",
    submittedAt: Date.now() - 11*86400000, approvedAt: Date.now() - 10*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 3, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 3, "ความกระจ่างใสของผิวตอนนี้": 2, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 4 }, comment: "พอใช้ ฝ้ายังไม่จาง", wouldRecommend: false } },
  { trialId: "trial-1", name: "ปิยะดา รักษ์ไพร", phone: "084-118-3322", address: "77 บางนา-ตราด กม.3 บางนา กทม. 10260", motivation: "ผิวแห้งช่วงหน้าหนาว",
    submittedAt: Date.now() - 10*86400000, approvedAt: Date.now() - 9*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "45-54",
    evaluation: { overall: 5, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 5, "ความกระจ่างใสของผิวตอนนี้": 4, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "ผิวชุ่มชื้น เห็นผลใน 1 สัปดาห์", wouldRecommend: true } },
  { trialId: "trial-1", name: "เบญจมาศ วงศ์ทอง", phone: "086-227-9911", address: "99/3 ม.5 สันป่าตอง เชียงใหม่ 50120", motivation: "ทดสอบสูตรสมุนไพรไทย",
    submittedAt: Date.now() - 9*86400000, approvedAt: Date.now() - 8*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "55+",
    evaluation: { overall: 4, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 4, "ความกระจ่างใสของผิวตอนนี้": 3, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "กลิ่นหอม ใช้ง่าย", wouldRecommend: true } },
  { trialId: "trial-1", name: "นิติพงษ์ ปานทอง", phone: "082-998-4455", address: "23 รามอินทรา 8 บางเขน กทม. 10220", motivation: "อายุน้อย ผิวเริ่มไม่ดี",
    submittedAt: Date.now() - 9*86400000, approvedAt: Date.now() - 8*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "male", ageRange: "15-24",
    evaluation: { overall: 4, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 4, "ความกระจ่างใสของผิวตอนนี้": 3, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "เหมาะกับวัยรุ่น ไม่มัน", wouldRecommend: true } },
  { trialId: "trial-1", name: "กฤษณา ทองดี", phone: "088-771-3300", address: "11/9 ลาดพร้าว 80 วังทองหลาง กทม. 10310", motivation: "อยากลองสูตรไม่มีพาราเบน",
    submittedAt: Date.now() - 8*86400000, approvedAt: Date.now() - 7*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 5, "ความกระจ่างใสของผิวตอนนี้": 4, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "ดีเยี่ยม ไม่มีพาราเบนตามที่บอก", wouldRecommend: true } },
  { trialId: "trial-1", name: "วราภรณ์ สุขสมบูรณ์", phone: "087-554-6677", address: "65 สาทร 1 บางรัก กทม. 10500", motivation: "ทำงานออฟฟิศ ผิวหมอง",
    submittedAt: Date.now() - 8*86400000, approvedAt: Date.now() - 7*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 4, "ความกระจ่างใสของผิวตอนนี้": 3, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "เห็นผลชัดเจน ผิวสว่างขึ้น", wouldRecommend: true } },
  { trialId: "trial-1", name: "ณัฏฐา พิทักษ์ชน", phone: "081-330-9988", address: "8/22 ม.4 บางใหญ่ นนทบุรี 11140", motivation: "ลองดูแล้วรีวิว",
    submittedAt: Date.now() - 7*86400000, approvedAt: Date.now() - 6*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "lgbtq", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 5, "ความกระจ่างใสของผิวตอนนี้": 4, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "ใช้ดีมาก แนะนำเพื่อนแล้ว", wouldRecommend: true } },
  { trialId: "trial-1", name: "ทิพย์รัตน์ มั่นคง", phone: "089-447-1100", address: "172 จรัญสนิทวงศ์ 65 บางพลัด กทม. 10700", motivation: "ผิวบาง อยากบำรุง",
    submittedAt: Date.now() - 6*86400000, approvedAt: Date.now() - 5*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 4, "ความกระจ่างใสของผิวตอนนี้": 3, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "ผิวดีขึ้น แต่อยากให้กลิ่นจาง", wouldRecommend: true } },
  { trialId: "trial-1", name: "อภิวัฒน์ คงทอง", phone: "083-882-5544", address: "9 ม.1 ปากเกร็ด นนทบุรี 11120", motivation: "ดูจากรีวิวเลยอยากลอง",
    submittedAt: Date.now() - 6*86400000, approvedAt: Date.now() - 5*86400000, evaluatedAt: Date.now() - 2*86400000, gender: "male", ageRange: "35-44",
    evaluation: { overall: 2, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 2, "ความกระจ่างใสของผิวตอนนี้": 1, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 3 }, comment: "ระคายเคืองนิดหน่อย ผลไม่ค่อยเห็น", wouldRecommend: false } },
  { trialId: "trial-1", name: "ศุภาพิชญ์ บุญรอด", phone: "086-330-7722", address: "33 ม.2 บางบ่อ สมุทรปราการ 10560", motivation: "ผิวอ่อนแอ ลองเสริมความแข็งแรง",
    submittedAt: Date.now() - 5*86400000, approvedAt: Date.now() - 4*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "female", ageRange: "15-24",
    evaluation: { overall: 5, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 5, "ความกระจ่างใสของผิวตอนนี้": 4, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 5 }, comment: "เป๊ะปังมาก ใช้ทุกวัน", wouldRecommend: true } },
  { trialId: "trial-1", name: "ดนุพล จิตรอารี", phone: "081-005-8866", address: "201 บรรทัดทอง ถ.พญาไท ราชเทวี กทม. 10400", motivation: "ทดลองสูตรไทย",
    submittedAt: Date.now() - 5*86400000, approvedAt: Date.now() - 4*86400000, evaluatedAt: Date.now() - 1*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: { "ระดับความชุ่มชื้นผิวตอนนี้": 3, "ความกระจ่างใสของผิวตอนนี้": 2, "ความพึงพอใจสภาพผิวโดยรวมตอนนี้": 4 }, comment: "พอใช้ได้ ไม่ว้าวมาก", wouldRecommend: true } },

  // ========== Auto-generated evaluation pool for trials 2–18 (5 testers each) ==========
  { trialId: "trial-2", name: "อรุณี ศรีสุข", phone: "081-440-1100", address: "กรุงเทพฯ และปริมณฑล", motivation: "นอนไม่หลับเรื้อรัง",
    submittedAt: Date.now()-17*86400000, approvedAt: Date.now()-15*86400000, evaluatedAt: Date.now()-3*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 5, "ดีไซน์ / ความสวยงาม": 4, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "หลับสนิทขึ้นจริง ตื่นมาสดชื่น", wouldRecommend: true } },
  { trialId: "trial-2", name: "สมพงษ์ ไกรเกษม", phone: "082-554-2200", address: "กรุงเทพฯ และปริมณฑล", motivation: "ทำงานเครียด",
    submittedAt: Date.now()-19*86400000, approvedAt: Date.now()-17*86400000, evaluatedAt: Date.now()-5*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 4, "ดีไซน์ / ความสวยงาม": 3, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "ช่วยให้ผ่อนคลายได้ดี", wouldRecommend: true } },
  { trialId: "trial-2", name: "กชกร แก้วใจ", phone: "083-118-7733", address: "กรุงเทพฯ และปริมณฑล", motivation: "ลองชาธรรมชาติ",
    submittedAt: Date.now()-21*86400000, approvedAt: Date.now()-19*86400000, evaluatedAt: Date.now()-7*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 5, "ดีไซน์ / ความสวยงาม": 4, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "กลิ่นหอมไม่ขมเลย", wouldRecommend: true } },
  { trialId: "trial-2", name: "ธีรภัทร นาคทอง", phone: "086-225-9911", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากลดยานอนหลับ",
    submittedAt: Date.now()-23*86400000, approvedAt: Date.now()-21*86400000, evaluatedAt: Date.now()-9*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 3, "ดีไซน์ / ความสวยงาม": 2, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 4 }, comment: "ดื่มต่อเนื่อง 7 วันหลับลึกขึ้น", wouldRecommend: false } },
  { trialId: "trial-2", name: "ฟลิป มานะดี", phone: "087-660-1122", address: "กรุงเทพฯ และปริมณฑล", motivation: "ตามรีวิว",
    submittedAt: Date.now()-25*86400000, approvedAt: Date.now()-23*86400000, evaluatedAt: Date.now()-11*86400000, gender: "lgbtq", ageRange: "15-24",
    evaluation: { overall: 4, criteria: { "รสชาติเครื่องดื่มที่ดื่มเป็นประจำ": 4, "ดีไซน์ / ความสวยงาม": 3, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "พอใช้ได้ แต่รสติดขม", wouldRecommend: true } },
  { trialId: "trial-4", name: "ศิริพร ดอกไม้", phone: "081-552-3344", address: "กรุงเทพฯ และปริมณฑล", motivation: "ภูมิแพ้บ่อย",
    submittedAt: Date.now()-17*86400000, approvedAt: Date.now()-15*86400000, evaluatedAt: Date.now()-3*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ผลที่รู้สึกได้หลังใช้ครบกำหนด": 5, "ดีไซน์ / ความสวยงาม": 4, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "เป็นหวัดน้อยลง ไม่มีผลข้างเคียง", wouldRecommend: true } },
  { trialId: "trial-4", name: "ภานุวัฒน์ คล้ายฟ้า", phone: "082-441-9900", address: "กรุงเทพฯ และปริมณฑล", motivation: "ลองดู",
    submittedAt: Date.now()-19*86400000, approvedAt: Date.now()-17*86400000, evaluatedAt: Date.now()-5*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: { "ผลที่รู้สึกได้หลังใช้ครบกำหนด": 4, "ดีไซน์ / ความสวยงาม": 3, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "กินง่าย ไม่ขม", wouldRecommend: true } },
  { trialId: "trial-4", name: "สุภา ใจงาม", phone: "083-006-7788", address: "กรุงเทพฯ และปริมณฑล", motivation: "ทำงานหนัก",
    submittedAt: Date.now()-21*86400000, approvedAt: Date.now()-19*86400000, evaluatedAt: Date.now()-7*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: { "ผลที่รู้สึกได้หลังใช้ครบกำหนด": 5, "ดีไซน์ / ความสวยงาม": 4, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "ภูมิคุ้มกันดีขึ้นจริง", wouldRecommend: true } },
  { trialId: "trial-4", name: "เจษฎา รุ่งสกุล", phone: "086-220-3300", address: "กรุงเทพฯ และปริมณฑล", motivation: "คุณแม่บ้าน",
    submittedAt: Date.now()-23*86400000, approvedAt: Date.now()-21*86400000, evaluatedAt: Date.now()-9*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: { "ผลที่รู้สึกได้หลังใช้ครบกำหนด": 3, "ดีไซน์ / ความสวยงาม": 2, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 4 }, comment: "พอใช้ ผลไม่ชัดเจน", wouldRecommend: false } },
  { trialId: "trial-4", name: "พิม ปริญญา", phone: "087-449-2211", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากเสริมภูมิ",
    submittedAt: Date.now()-25*86400000, approvedAt: Date.now()-23*86400000, evaluatedAt: Date.now()-11*86400000, gender: "lgbtq", ageRange: "15-24",
    evaluation: { overall: 4, criteria: { "ผลที่รู้สึกได้หลังใช้ครบกำหนด": 4, "ดีไซน์ / ความสวยงาม": 3, "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา)": 5 }, comment: "ดีเลยแนะนำสำหรับเด็ก", wouldRecommend: true } },
  { trialId: "trial-6", name: "ปริมประภา ใจเย็น", phone: "081-882-2200", address: "กรุงเทพฯ และปริมณฑล", motivation: "ปวดเมื่อยทั่วไป",
    submittedAt: Date.now()-17*86400000, approvedAt: Date.now()-15*86400000, evaluatedAt: Date.now()-3*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 5, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 4, "ดีไซน์ / ความสวยงาม": 5 }, comment: "สะดวกพกพา กลิ่นดี", wouldRecommend: true } },
  { trialId: "trial-6", name: "อภิชาติ ทัศนีย์", phone: "082-006-3311", address: "กรุงเทพฯ และปริมณฑล", motivation: "ทำงานออฟฟิศ",
    submittedAt: Date.now()-19*86400000, approvedAt: Date.now()-17*86400000, evaluatedAt: Date.now()-5*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 4, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 3, "ดีไซน์ / ความสวยงาม": 5 }, comment: "ใช้แล้วผ่อนคลายเร็ว", wouldRecommend: true } },
  { trialId: "trial-6", name: "สิริวรรณ ภูเขียว", phone: "083-557-9900", address: "กรุงเทพฯ และปริมณฑล", motivation: "ลองเทียบลูกประคบ",
    submittedAt: Date.now()-21*86400000, approvedAt: Date.now()-19*86400000, evaluatedAt: Date.now()-7*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 5, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 4, "ดีไซน์ / ความสวยงาม": 5 }, comment: "สเปรย์สะดวกกว่าเดิม", wouldRecommend: true } },
  { trialId: "trial-6", name: "ปฐมพร โพธิ์ทอง", phone: "086-118-2200", address: "กรุงเทพฯ และปริมณฑล", motivation: "ปวดหลัง",
    submittedAt: Date.now()-23*86400000, approvedAt: Date.now()-21*86400000, evaluatedAt: Date.now()-9*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 3, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 2, "ดีไซน์ / ความสวยงาม": 4 }, comment: "ร้อนพอดี กลิ่นหอม", wouldRecommend: false } },
  { trialId: "trial-6", name: "เปรมิกา ทองดี", phone: "087-225-5544", address: "กรุงเทพฯ และปริมณฑล", motivation: "หลังออกกำลัง",
    submittedAt: Date.now()-25*86400000, approvedAt: Date.now()-23*86400000, evaluatedAt: Date.now()-11*86400000, gender: "lgbtq", ageRange: "15-24",
    evaluation: { overall: 4, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 4, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 3, "ดีไซน์ / ความสวยงาม": 5 }, comment: "ดี ใช้ทุกวัน", wouldRecommend: true } },
  // ========== Sample evaluations for trial-eq (อุปกรณ์) ==========
  { trialId: "trial-eq", name: "มาิชญา รุ่งสว่าง", phone: "081-110-2233", address: "44 รามอินทรา 12 บางเขน กทม. 10220", motivation: "มองหาดิฟฟิวเซอร์ใหม่",
    submittedAt: Date.now()-16*86400000, approvedAt: Date.now()-14*86400000, evaluatedAt: Date.now()-2*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 5, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 4, "ดีไซน์ / ความสวยงาม": 5 }, comment: "เครื่องเงียบมาก ไอน้ำกระจายได้ทั่วห้อง จะซื้อจริง", wouldRecommend: true } },
  { trialId: "trial-eq", name: "ธนพล เจริญยิ่ง", phone: "082-220-9911", address: "5 พหลโยธิน 12 จตุจักร กทม. 10900", motivation: "ต้องการเครื่องที่เงียบ",
    submittedAt: Date.now()-18*86400000, approvedAt: Date.now()-16*86400000, evaluatedAt: Date.now()-4*86400000, gender: "male", ageRange: "35-44",
    evaluation: { overall: 4, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 4, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 3, "ดีไซน์ / ความสวยงาม": 5 }, comment: "พอใช้ได้ แบตเตอรี่หมดไว ต้องชาร์จบ่อย", wouldRecommend: true } },
  { trialId: "trial-eq", name: "ธัญญรัตน์ บุญล้อม", phone: "083-440-7755", address: "8/2 สุขุมวิท 31 วัฒนา กทม. 10110", motivation: "ชอบอโรมาก่อนนอน",
    submittedAt: Date.now()-15*86400000, approvedAt: Date.now()-13*86400000, evaluatedAt: Date.now()-1*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 5, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 4, "ดีไซน์ / ความสวยงาม": 5 }, comment: "หอมโชยถึงห้อง รล. ยอดเยี่ยม", wouldRecommend: true } },
  { trialId: "trial-eq", name: "อัมรินทร์ วรสิทธิ์", phone: "086-770-1144", address: "23 ลาดพร้าว 64 วังทองหลาง กทม. 10310", motivation: "ลองดู",
    submittedAt: Date.now()-17*86400000, approvedAt: Date.now()-15*86400000, evaluatedAt: Date.now()-3*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 3, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 2, "ดีไซน์ / ความสวยงาม": 4 }, comment: "พอใช้ ยังไม่ได้ว้าว", wouldRecommend: false } },
  { trialId: "trial-eq", name: "พิมอร รุ่งโรจน์", phone: "087-220-5544", address: "12 รามคำแหง 12 หัวหมาก กทม. 10240", motivation: "ชอบไล้ฟ์สไตล์บ้าน",
    submittedAt: Date.now()-14*86400000, approvedAt: Date.now()-12*86400000, evaluatedAt: Date.now()-1*86400000, gender: "lgbtq", ageRange: "25-34",
    evaluation: { overall: 4, criteria: { "ระดับปัญหาที่ต้องการแก้ตอนนี้": 4, "ปัญหาดีขึ้นหลังใช้สินค้าครบกำหนด": 3, "ดีไซน์ / ความสวยงาม": 5 }, comment: "ดีไซน์สวย ใช้ง่าย ต้องชาร์จบ่อย", wouldRecommend: true } },

  // ========== Bumped sample sizes — additional evaluated rows for trial-2/4/6/eq (bring n to ~13 each) ==========
  // trial-2 (ชาสมุนไพรช่วยนอน Sleep+) — 8 more evaluated testers
  { trialId: "trial-2", name: "ชุติมา ทองดี", phone: "081-700-1188", address: "กรุงเทพฯ และปริมณฑล", motivation: "นอนไม่หลับ",
    submittedAt: Date.now()-27*86400000, approvedAt: Date.now()-25*86400000, evaluatedAt: Date.now()-13*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: {}, comment: "หลับลึก ตื่นมาสดชื่น ใช้ต่อแน่ๆ", wouldRecommend: true } },
  { trialId: "trial-2", name: "พงศ์ศักดิ์ ก้องเกียรติ", phone: "082-700-2299", address: "กรุงเทพฯ และปริมณฑล", motivation: "ทำงานเครียดมาก",
    submittedAt: Date.now()-28*86400000, approvedAt: Date.now()-26*86400000, evaluatedAt: Date.now()-14*86400000, gender: "male", ageRange: "35-44",
    evaluation: { overall: 4, criteria: {}, comment: "ดื่มแล้วผ่อนคลายดี รสไม่ขมเหมือนยาสมุนไพรอื่น", wouldRecommend: true } },
  { trialId: "trial-2", name: "สุนิสา รวยรัตน์", phone: "083-700-3300", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากลดยานอนหลับ",
    submittedAt: Date.now()-29*86400000, approvedAt: Date.now()-27*86400000, evaluatedAt: Date.now()-15*86400000, gender: "female", ageRange: "45-54",
    evaluation: { overall: 4, criteria: {}, comment: "ค่อยๆ ลดยานอนหลับลงได้ แต่อยากให้รสหวานขึ้น", wouldRecommend: true } },
  { trialId: "trial-2", name: "นพดล วงศ์ใหญ่", phone: "086-700-4411", address: "กรุงเทพฯ และปริมณฑล", motivation: "อายุยังน้อย ไม่อยากใช้ยา",
    submittedAt: Date.now()-30*86400000, approvedAt: Date.now()-28*86400000, evaluatedAt: Date.now()-16*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 5, criteria: {}, comment: "ดีมาก ไม่ตื่นกลางดึก จะซื้อเก็บไว้", wouldRecommend: true } },
  { trialId: "trial-2", name: "อารยา ลิ้มสุวรรณ", phone: "087-700-5522", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากผ่อนคลาย",
    submittedAt: Date.now()-31*86400000, approvedAt: Date.now()-29*86400000, evaluatedAt: Date.now()-17*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 4, criteria: {}, comment: "กลิ่นหอม ดื่มแล้วสบายใจ", wouldRecommend: true } },
  { trialId: "trial-2", name: "ภคพล ทักษิณ", phone: "081-700-6633", address: "กรุงเทพฯ และปริมณฑล", motivation: "ลองสมุนไพรไทย",
    submittedAt: Date.now()-33*86400000, approvedAt: Date.now()-31*86400000, evaluatedAt: Date.now()-18*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 3, criteria: {}, comment: "ผลพอใช้ ติดรสขมไปนิด", wouldRecommend: false } },
  { trialId: "trial-2", name: "วิภาวี ปานทอง", phone: "082-700-7744", address: "กรุงเทพฯ และปริมณฑล", motivation: "ค้นหาตัวช่วยนอน",
    submittedAt: Date.now()-34*86400000, approvedAt: Date.now()-32*86400000, evaluatedAt: Date.now()-19*86400000, gender: "female", ageRange: "55+",
    evaluation: { overall: 5, criteria: {}, comment: "ผู้สูงอายุก็ดื่มได้ ปลอดภัยกว่ายา", wouldRecommend: true } },
  { trialId: "trial-2", name: "ปิติพงษ์ คงไทย", phone: "083-700-8855", address: "กรุงเทพฯ และปริมณฑล", motivation: "ดูรีวิว",
    submittedAt: Date.now()-35*86400000, approvedAt: Date.now()-33*86400000, evaluatedAt: Date.now()-20*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 4, criteria: {}, comment: "หลับลึกขึ้น แต่ตื่นเช้ายังง่วงนิดๆ", wouldRecommend: true } },

  // trial-4 (แคปซูลฟ้าทะลายโจร) — 8 more evaluated testers
  { trialId: "trial-4", name: "พรพรรณ สวัสดี", phone: "081-800-1188", address: "กรุงเทพฯ และปริมณฑล", motivation: "หวัดบ่อย",
    submittedAt: Date.now()-29*86400000, approvedAt: Date.now()-27*86400000, evaluatedAt: Date.now()-13*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: {}, comment: "หวัดน้อยลง ภูมิคุ้มกันดีขึ้น", wouldRecommend: true } },
  { trialId: "trial-4", name: "อนุพงษ์ ใจหาญ", phone: "082-800-2299", address: "กรุงเทพฯ และปริมณฑล", motivation: "ไอเรื้อรัง",
    submittedAt: Date.now()-30*86400000, approvedAt: Date.now()-28*86400000, evaluatedAt: Date.now()-14*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: {}, comment: "ดีขึ้น แต่กลิ่นแคปซูลแรงไปหน่อย", wouldRecommend: true } },
  { trialId: "trial-4", name: "กชพร แก้วใส", phone: "083-800-3300", address: "กรุงเทพฯ และปริมณฑล", motivation: "ภูมิคุ้มกันต่ำ",
    submittedAt: Date.now()-31*86400000, approvedAt: Date.now()-29*86400000, evaluatedAt: Date.now()-15*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: {}, comment: "ไม่เป็นหวัดตลอด 30 วัน ดีมาก", wouldRecommend: true } },
  { trialId: "trial-4", name: "ธีรพันธ์ สมจิต", phone: "086-800-4411", address: "กรุงเทพฯ และปริมณฑล", motivation: "เสริมภูมิ",
    submittedAt: Date.now()-32*86400000, approvedAt: Date.now()-30*86400000, evaluatedAt: Date.now()-16*86400000, gender: "male", ageRange: "35-44",
    evaluation: { overall: 4, criteria: {}, comment: "เห็นผลใน 2 สัปดาห์ พอใจ", wouldRecommend: true } },
  { trialId: "trial-4", name: "สุดารัตน์ มากดี", phone: "087-800-5522", address: "กรุงเทพฯ และปริมณฑล", motivation: "อายุเริ่มมาก ภูมิตก",
    submittedAt: Date.now()-33*86400000, approvedAt: Date.now()-31*86400000, evaluatedAt: Date.now()-17*86400000, gender: "female", ageRange: "55+",
    evaluation: { overall: 5, criteria: {}, comment: "ใช้ได้ดี ไม่มีผลข้างเคียง", wouldRecommend: true } },
  { trialId: "trial-4", name: "วรุฒ ตั้งจิต", phone: "081-800-6633", address: "กรุงเทพฯ และปริมณฑล", motivation: "ลองดู",
    submittedAt: Date.now()-34*86400000, approvedAt: Date.now()-32*86400000, evaluatedAt: Date.now()-18*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 3, criteria: {}, comment: "ดีกลางๆ ขมเกินไป", wouldRecommend: false } },
  { trialId: "trial-4", name: "นุชนาฏ เสริมสุข", phone: "082-800-7744", address: "กรุงเทพฯ และปริมณฑล", motivation: "ต้องการเสริมภูมิ",
    submittedAt: Date.now()-35*86400000, approvedAt: Date.now()-33*86400000, evaluatedAt: Date.now()-19*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 4, criteria: {}, comment: "ผลดี เป็นหวัดน้อยลงจริง", wouldRecommend: true } },
  { trialId: "trial-4", name: "ชัยพร เสริมศักดิ์", phone: "083-800-8855", address: "กรุงเทพฯ และปริมณฑล", motivation: "อายุเริ่มมาก",
    submittedAt: Date.now()-36*86400000, approvedAt: Date.now()-34*86400000, evaluatedAt: Date.now()-20*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: {}, comment: "ค่อยๆ ดี ใช้ครบ 30 วันเห็นผล", wouldRecommend: true } },

  // trial-6 (ลูกประคบสมุนไพรสเปรย์) — 8 more evaluated testers
  { trialId: "trial-6", name: "ปิยฉัตร ใจอ่อน", phone: "081-900-1188", address: "กรุงเทพฯ และปริมณฑล", motivation: "ปวดเมื่อยหลัง",
    submittedAt: Date.now()-28*86400000, approvedAt: Date.now()-26*86400000, evaluatedAt: Date.now()-12*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: {}, comment: "สเปรย์สะดวกมาก กลิ่นหอม ใช้บนรถได้", wouldRecommend: true } },
  { trialId: "trial-6", name: "ก้องเกียรติ ดอกไม้", phone: "082-900-2299", address: "กรุงเทพฯ และปริมณฑล", motivation: "ออฟฟิศซินโดรม",
    submittedAt: Date.now()-29*86400000, approvedAt: Date.now()-27*86400000, evaluatedAt: Date.now()-13*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 4, criteria: {}, comment: "ใช้ที่คอบ่าไหล่ ผ่อนคลายดี", wouldRecommend: true } },
  { trialId: "trial-6", name: "นพรัตน์ สุขใจ", phone: "083-900-3300", address: "กรุงเทพฯ และปริมณฑล", motivation: "ปวดเข่า",
    submittedAt: Date.now()-30*86400000, approvedAt: Date.now()-28*86400000, evaluatedAt: Date.now()-14*86400000, gender: "female", ageRange: "55+",
    evaluation: { overall: 5, criteria: {}, comment: "ผู้สูงอายุใช้สะดวก ไม่ต้องนึ่งลูกประคบ", wouldRecommend: true } },
  { trialId: "trial-6", name: "ภัทรพล ก้าวหน้า", phone: "086-900-4411", address: "กรุงเทพฯ และปริมณฑล", motivation: "เล่นกีฬาบ่อย",
    submittedAt: Date.now()-31*86400000, approvedAt: Date.now()-29*86400000, evaluatedAt: Date.now()-15*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 4, criteria: {}, comment: "ใช้หลังออกกำลังกาย ดีมาก", wouldRecommend: true } },
  { trialId: "trial-6", name: "วาสนา ทรัพย์ดี", phone: "087-900-5522", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากลอง",
    submittedAt: Date.now()-32*86400000, approvedAt: Date.now()-30*86400000, evaluatedAt: Date.now()-16*86400000, gender: "female", ageRange: "45-54",
    evaluation: { overall: 5, criteria: {}, comment: "ดีจริง ปวดน้อยลงตั้งแต่วันแรก", wouldRecommend: true } },
  { trialId: "trial-6", name: "ชนะ ตั้งใจ", phone: "081-900-6633", address: "กรุงเทพฯ และปริมณฑล", motivation: "ปวดหลังเรื้อรัง",
    submittedAt: Date.now()-33*86400000, approvedAt: Date.now()-31*86400000, evaluatedAt: Date.now()-17*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: {}, comment: "ดี แต่ขวดเล็กไปหน่อย", wouldRecommend: true } },
  { trialId: "trial-6", name: "พิมพ์ใจ รักดี", phone: "082-900-7744", address: "กรุงเทพฯ และปริมณฑล", motivation: "หลังตึง",
    submittedAt: Date.now()-34*86400000, approvedAt: Date.now()-32*86400000, evaluatedAt: Date.now()-18*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: {}, comment: "ใช้ก่อนนอน หลับสบาย", wouldRecommend: true } },
  { trialId: "trial-6", name: "ธวัชชัย โพธิ์ทอง", phone: "083-900-8855", address: "กรุงเทพฯ และปริมณฑล", motivation: "ดูจากเพื่อน",
    submittedAt: Date.now()-35*86400000, approvedAt: Date.now()-33*86400000, evaluatedAt: Date.now()-19*86400000, gender: "male", ageRange: "55+",
    evaluation: { overall: 3, criteria: {}, comment: "พอใช้ ฉีดแล้วร้อนเร็ว", wouldRecommend: false } },

  // trial-eq (ดิฟฟิวเซอร์ Mist Pro) — 8 more evaluated testers
  { trialId: "trial-eq", name: "ปริญญา ดวงดาว", phone: "081-310-1188", address: "กรุงเทพฯ และปริมณฑล", motivation: "ใช้ก่อนนอน",
    submittedAt: Date.now()-27*86400000, approvedAt: Date.now()-25*86400000, evaluatedAt: Date.now()-12*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: {}, comment: "เสียงเงียบมาก ใช้ตอนนอนได้", wouldRecommend: true } },
  { trialId: "trial-eq", name: "สมเกียรติ ใจตรง", phone: "082-310-2299", address: "กรุงเทพฯ และปริมณฑล", motivation: "ของขวัญให้ภรรยา",
    submittedAt: Date.now()-28*86400000, approvedAt: Date.now()-26*86400000, evaluatedAt: Date.now()-13*86400000, gender: "male", ageRange: "45-54",
    evaluation: { overall: 4, criteria: {}, comment: "ดีไซน์สวย เหมาะเป็นของขวัญ", wouldRecommend: true } },
  { trialId: "trial-eq", name: "อัญชลี ศรีงาม", phone: "083-310-3300", address: "กรุงเทพฯ และปริมณฑล", motivation: "ชอบกลิ่นหอม",
    submittedAt: Date.now()-29*86400000, approvedAt: Date.now()-27*86400000, evaluatedAt: Date.now()-14*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: {}, comment: "ไอน้ำกระจายดี ห้องหอมทั้งวัน", wouldRecommend: true } },
  { trialId: "trial-eq", name: "อภิสิทธิ์ สวยงาม", phone: "086-310-4411", address: "กรุงเทพฯ และปริมณฑล", motivation: "ตกแต่งห้องนอน",
    submittedAt: Date.now()-30*86400000, approvedAt: Date.now()-28*86400000, evaluatedAt: Date.now()-15*86400000, gender: "male", ageRange: "25-34",
    evaluation: { overall: 4, criteria: {}, comment: "ใช้ดี แสง LED สวย ติดตั้งง่าย", wouldRecommend: true } },
  { trialId: "trial-eq", name: "ธิดารัตน์ พรประเสริฐ", phone: "087-310-5522", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากผ่อนคลาย",
    submittedAt: Date.now()-31*86400000, approvedAt: Date.now()-29*86400000, evaluatedAt: Date.now()-16*86400000, gender: "female", ageRange: "35-44",
    evaluation: { overall: 5, criteria: {}, comment: "ใช้บ่อยมาก คุ้มกับราคา", wouldRecommend: true } },
  { trialId: "trial-eq", name: "เกียรติศักดิ์ สมบัติ", phone: "081-310-6633", address: "กรุงเทพฯ และปริมณฑล", motivation: "ลองดู",
    submittedAt: Date.now()-32*86400000, approvedAt: Date.now()-30*86400000, evaluatedAt: Date.now()-17*86400000, gender: "male", ageRange: "55+",
    evaluation: { overall: 3, criteria: {}, comment: "พอใช้ แบตหมดเร็ว", wouldRecommend: false } },
  { trialId: "trial-eq", name: "ปาณิสรา ดอกบัว", phone: "082-310-7744", address: "กรุงเทพฯ และปริมณฑล", motivation: "อยากได้ของใหม่",
    submittedAt: Date.now()-33*86400000, approvedAt: Date.now()-31*86400000, evaluatedAt: Date.now()-18*86400000, gender: "female", ageRange: "25-34",
    evaluation: { overall: 5, criteria: {}, comment: "ดีไซน์มินิมอล เข้ากับห้องทุกแบบ", wouldRecommend: true } },
  { trialId: "trial-eq", name: "ปรีชา รวยสุข", phone: "083-310-8855", address: "กรุงเทพฯ และปริมณฑล", motivation: "ใช้กับสปาที่บ้าน",
    submittedAt: Date.now()-34*86400000, approvedAt: Date.now()-32*86400000, evaluatedAt: Date.now()-19*86400000, gender: "male", ageRange: "35-44",
    evaluation: { overall: 4, criteria: {}, comment: "ดี ใช้กับน้ำมันหอมระเหยได้หลายชนิด", wouldRecommend: true } },
];

const CUSTOM_PRODUCTS_KEY = "metaherb:trial:products:custom";
const HIDDEN_PRODUCTS_KEY = "metaherb:trial:products:hidden";   // IDs of mock products that the owner deleted
const OVERRIDES_KEY       = "metaherb:trial:products:overrides"; // edits applied on top of mock products

function loadCustomProducts(): TrialProduct[] {
  try { return JSON.parse(localStorage.getItem(CUSTOM_PRODUCTS_KEY) || "[]"); }
  catch { return []; }
}
function saveCustomProducts(list: TrialProduct[]) {
  localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(list));
}
function loadHiddenIds(): string[] {
  try { return JSON.parse(localStorage.getItem(HIDDEN_PRODUCTS_KEY) || "[]"); }
  catch { return []; }
}
function saveHiddenIds(ids: string[]) {
  localStorage.setItem(HIDDEN_PRODUCTS_KEY, JSON.stringify(ids));
}
function loadOverrides(): Record<string, Partial<TrialProduct>> {
  try { return JSON.parse(localStorage.getItem(OVERRIDES_KEY) || "{}"); }
  catch { return {}; }
}
function saveOverrides(map: Record<string, Partial<TrialProduct>>) {
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(map));
}

export function useAllRegistrations() {
  const [regs, setRegs] = useState<Registration[]>(() => [...MOCK_REGISTRATIONS, ...loadRegistrations()]);
  useEffect(() => {
    const refresh = () => setRegs([...MOCK_REGISTRATIONS, ...loadRegistrations()]);
    const onStorage = (e: StorageEvent) => { if (e.key === REGISTRATIONS_STORAGE_KEY) refresh(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener("focus", refresh);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener("focus", refresh); };
  }, []);
  const updateOne = (predicate: (r: Registration) => boolean, patch: Partial<Registration>) => {
    setRegs((prev) => prev.map((r) => predicate(r) ? { ...r, ...patch } : r));
    // Persist only if it's a localStorage registration (not mock)
    const realRegs = loadRegistrations();
    const updatedReal = realRegs.map((r) => predicate(r) ? { ...r, ...patch } : r);
    saveRegistrations(updatedReal);
  };
  return { regs, updateOne, refresh: () => setRegs([...MOCK_REGISTRATIONS, ...loadRegistrations()]) };
}

export function useAllTrialProducts() {
  const [custom, setCustom] = useState<TrialProduct[]>(() => loadCustomProducts());
  const [hidden, setHidden] = useState<string[]>(() => loadHiddenIds());
  const [overrides, setOverrides] = useState<Record<string, Partial<TrialProduct>>>(() => loadOverrides());

  /** Mock products with overrides applied, then hidden ones filtered out, then custom appended. */
  const all = useMemo(() => {
    const mockWithOverrides = TRIAL_PRODUCTS
      .filter((p) => !hidden.includes(p.id))
      .map((p) => overrides[p.id] ? { ...p, ...overrides[p.id] } : p);
    return [...mockWithOverrides, ...custom];
  }, [custom, hidden, overrides]);

  const add = (p: TrialProduct) => {
    const next = [...custom, p];
    setCustom(next);
    saveCustomProducts(next);
  };
  const remove = (id: string) => {
    // Custom product: drop from custom list
    if (custom.some((p) => p.id === id)) {
      const next = custom.filter((p) => p.id !== id);
      setCustom(next);
      saveCustomProducts(next);
      return;
    }
    // Mock product: add to hidden list (soft delete)
    if (!hidden.includes(id)) {
      const next = [...hidden, id];
      setHidden(next);
      saveHiddenIds(next);
    }
  };
  const update = (id: string, patch: Partial<TrialProduct>) => {
    if (custom.some((p) => p.id === id)) {
      const next = custom.map((p) => p.id === id ? { ...p, ...patch } : p);
      setCustom(next);
      saveCustomProducts(next);
      return;
    }
    // Mock product: persist patch in overrides map
    const nextOv = { ...overrides, [id]: { ...(overrides[id] || {}), ...patch } };
    setOverrides(nextOv);
    saveOverrides(nextOv);
  };
  return { all, custom, add, remove, update };
}

// ============================================================================
//  KPIs — shared widget used by both overview tab and main dashboard
// ============================================================================

export function OwnerTrialsKpiStrip() {
  const { regs } = useAllRegistrations();
  const { all } = useAllTrialProducts();

  const pendingApproval = regs.filter((r) => getRegistrationStatus(r) === "pending_approval").length;
  const approved = regs.filter((r) => getRegistrationStatus(r) === "approved").length;
  const evaluated = regs.filter((r) => getRegistrationStatus(r) === "evaluated").length;

  const items = [
    { label: "สินค้าทดลอง",  value: `${all.length}`,        suffix: "รายการ", icon: FlaskConical, accent: "#319754" },
    { label: "ผู้ทดลองรวม",   value: `${regs.length}`,       suffix: "คน",     icon: Users,        accent: "#0088ff" },
    { label: "รออนุมัติ",     value: `${pendingApproval}`,   suffix: "คน",     icon: AlertCircle,  accent: "#ef4444" },
    { label: "กำลังทดสอบ",   value: `${approved}`,          suffix: "คน",     icon: Clock,        accent: "#f59e0b" },
    { label: "ประเมินแล้ว",   value: `${evaluated}`,         suffix: "คน",     icon: Check,        accent: "#319754" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {items.map((s) => (
        <div key={s.label} className="bg-white rounded-[14px] border border-gray-200 p-3.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className={`${font} text-[11.5px] text-gray-500`} style={{ fontWeight: 500 }}>{s.label}</span>
            <div className="size-[28px] rounded-lg flex items-center justify-center" style={{ background: `${s.accent}15` }}>
              <s.icon className="size-[14px]" style={{ color: s.accent }} strokeWidth={2.4} />
            </div>
          </div>
          <p className={`${font} text-[20px] text-[#1a1a1a] tabular-nums leading-tight`} style={{ fontWeight: 700 }}>
            {s.value}
            {s.suffix && <span className={`${font} text-[11px] text-gray-500 ml-1`} style={{ fontWeight: 500 }}>{s.suffix}</span>}
          </p>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
//  TAB 1 — OVERVIEW
// ============================================================================

export function OwnerTrialsOverview({ onGoTracking }: { onGoTracking: () => void }) {
  const { regs } = useAllRegistrations();
  const { all } = useAllTrialProducts();

  // Top trials by applicants
  const trialApplicants = useMemo(() => {
    const counts = new Map<string, number>();
    regs.forEach((r) => counts.set(r.trialId, (counts.get(r.trialId) || 0) + 1));
    return all
      .map((p) => ({ product: p, count: counts.get(p.id) || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [regs, all]);

  // Recent registrations
  const recent = useMemo(
    () => [...regs].sort((a, b) => b.submittedAt - a.submittedAt).slice(0, 6),
    [regs]
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className={`${font} text-[22px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>ภาพรวมสินค้าทดลอง</h2>
        <p className={`${font} text-[13px] text-gray-500`}>สรุปสถิติโปรแกรมทดสอบและรายการล่าสุด</p>
      </div>

      <OwnerTrialsKpiStrip />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top trials chart */}
        <div className="bg-white rounded-[16px] border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${font} text-[15px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>สินค้าที่มีคนสมัครมากที่สุด</h3>
            <span className={`${font} text-[11px] text-gray-400`}>Top 5</span>
          </div>
          <div className="space-y-3">
            {trialApplicants.map(({ product, count }) => {
              const max = Math.max(1, ...trialApplicants.map((x) => x.count));
              const pct = (count / max) * 100;
              return (
                <div key={product.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`${font} text-[12.5px] text-[#1a1a1a] truncate flex-1 mr-2`} style={{ fontWeight: 500 }}>{product.name}</span>
                    <span className={`${font} text-[12.5px] text-gray-600 tabular-nums shrink-0`} style={{ fontWeight: 600 }}>{count} คน</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-gray-100 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full"
                      style={{ background: "linear-gradient(90deg, #319754, #46c474)" }}
                    />
                  </div>
                </div>
              );
            })}
            {trialApplicants.every((x) => x.count === 0) && (
              <p className={`${font} text-[13px] text-gray-400 text-center py-6`}>ยังไม่มีผู้ทดลอง</p>
            )}
          </div>
        </div>

        {/* Recent registrations */}
        <div className="bg-white rounded-[16px] border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`${font} text-[15px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>คำขอล่าสุด</h3>
            <button onClick={onGoTracking} className={`${font} text-[12px] text-[#319754] hover:underline cursor-pointer inline-flex items-center gap-1`} style={{ fontWeight: 500 }}>
              ดูทั้งหมด <ChevronRight className="size-3" />
            </button>
          </div>
          <div className="space-y-2.5">
            {recent.map((r, i) => {
              const product = all.find((p) => p.id === r.trialId);
              return (
                <div key={i} className="flex items-center gap-2.5 p-2.5 rounded-[10px] hover:bg-gray-50 transition-colors">
                  <div className="size-[36px] rounded-full bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
                    <span className={`${font} text-[12px] text-[#319754]`} style={{ fontWeight: 700 }}>{(r.name || "?").slice(0, 1)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`${font} text-[13px] text-[#1a1a1a] truncate`} style={{ fontWeight: 500 }}>{r.name}</p>
                    <p className={`${font} text-[11px] text-gray-500 truncate`}>{product?.name || r.trialId}</p>
                  </div>
                  {r.evaluatedAt ? (
                    <span className={`${font} text-[10px] text-[#319754] bg-[#319754]/10 px-2 py-0.5 rounded-full shrink-0`} style={{ fontWeight: 600 }}>เสร็จ</span>
                  ) : (
                    <span className={`${font} text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full shrink-0`} style={{ fontWeight: 600 }}>รอประเมิน</span>
                  )}
                </div>
              );
            })}
            {recent.length === 0 && (
              <p className={`${font} text-[13px] text-gray-400 text-center py-6`}>ยังไม่มีคำขอ</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
//  TAB 2 — TRACKING (registrations management)
// ============================================================================

export function OwnerTrialsTracking() {
  const { regs, updateOne } = useAllRegistrations();
  const { all } = useAllTrialProducts();

  type FilterKey = "all" | "pending_approval" | "approved" | "evaluated" | "rejected";
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const count = (s: RegistrationStatus) => regs.filter((r) => getRegistrationStatus(r) === s).length;

  const filtered = useMemo(() => {
    let result = regs.slice().sort((a, b) => b.submittedAt - a.submittedAt);
    if (filter !== "all") result = result.filter((r) => getRegistrationStatus(r) === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((r) =>
        (r.name || "").toLowerCase().includes(q) ||
        (r.phone || "").includes(q) ||
        (all.find((p) => p.id === r.trialId)?.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [regs, filter, search, all]);

  const matchReg = (target: Registration) =>
    (r: Registration) => r.trialId === target.trialId && r.name === target.name && r.submittedAt === target.submittedAt;

  const approve = (reg: Registration) => {
    updateOne(matchReg(reg), { approvedAt: Date.now() });
    toast.success("อนุมัติคำขอเรียบร้อย", { description: `${reg.name} จะได้รับสินค้าทดสอบเร็ว ๆ นี้` });
  };
  const reject = (reg: Registration) => {
    if (!confirm(`ปฏิเสธคำขอของ "${reg.name}"?`)) return;
    updateOne(matchReg(reg), { rejectedAt: Date.now() });
    toast.success("ปฏิเสธคำขอเรียบร้อย");
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>ติดตามสินค้าทดลอง</h2>

      {/* Filters + search — single white pill (matches OwnerDashboard Orders style) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
          {([
            { key: "all" as const,              label: "ทั้งหมด",     count: regs.length,                  icon: FlaskConical },
            { key: "pending_approval" as const, label: "รออนุมัติ",   count: count("pending_approval"),    icon: AlertCircle },
            { key: "approved" as const,         label: "กำลังทดสอบ",  count: count("approved"),            icon: Clock },
            { key: "evaluated" as const,        label: "ประเมินแล้ว", count: count("evaluated"),           icon: Check },
            { key: "rejected" as const,         label: "ปฏิเสธ",      count: count("rejected"),            icon: Ban },
          ]).map((t) => {
            const isAct = filter === t.key;
            return (
              <motion.button key={t.key} onClick={() => setFilter(t.key)}
                whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                {isAct && (
                  <motion.span layoutId="ownerTrialTabActivePill"
                    className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                  transition={{ duration: 0.2 }}>
                  <t.icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                </motion.span>
                <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{t.label}</span>
                <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{t.count}</span>
              </motion.button>
            );
          })}
        </div>
        {/* Search (inside same pill) */}
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px] lg:ml-auto">
          <input
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาชื่อ, เบอร์, สินค้า..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Card list — mirrors OrdersTab OrderCard layout */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 flex flex-col items-center justify-center gap-2">
          <FlaskConical className="size-10 text-gray-300" strokeWidth={1.5} />
          <p className={`${font} text-[14px] text-gray-400`}>ไม่มีรายการที่ตรงกับเงื่อนไข</p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {filtered.map((r, i) => {
              const product = all.find((p) => p.id === r.trialId);
              return (
                <RegistrationCard
                  key={`${r.name}-${r.submittedAt}-${i}`}
                  reg={r}
                  product={product}
                  onApprove={() => approve(r)}
                  onReject={() => reject(r)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

/** Status visual config — pill bg + text color + label */
const STATUS_CFG: Record<RegistrationStatus, { label: string; pillBg: string; pillText: string }> = {
  pending_approval: { label: "รออนุมัติ",   pillBg: "#ef4444", pillText: "#fff" },
  approved:         { label: "กำลังทดสอบ",  pillBg: "#f59e0b", pillText: "#fff" },
  evaluated:        { label: "ประเมินแล้ว", pillBg: "#319754", pillText: "#fff" },
  rejected:         { label: "ปฏิเสธ",      pillBg: "#6b7280", pillText: "#fff" },
};

function RegistrationCard({ reg, product, onApprove, onReject }: {
  reg: Registration;
  product: TrialProduct | undefined;
  onApprove: () => void;
  onReject: () => void;
}) {
  const status = getRegistrationStatus(reg);
  const cfg = STATUS_CFG[status];
  const submittedLabel = new Date(reg.submittedAt).toLocaleString("th-TH", { day: "numeric", month: "short", year: "2-digit", hour: "2-digit", minute: "2-digit" });
  const [showEval, setShowEval] = useState(false);

  const actions = (() => {
    switch (status) {
      case "pending_approval":
        return (
          <>
            <button onClick={onReject}
              className={`${font} border border-[#ff3b30] text-[#ff3b30] hover:bg-[#ff3b30]/5 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
              <X className="size-3.5" strokeWidth={2.4} /> ปฏิเสธ
            </button>
            <button onClick={onApprove}
              className={`${font} bg-[#319754] hover:bg-[#287745] text-white h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5 shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}>
              <Check className="size-3.5" strokeWidth={2.6} /> อนุมัติ
            </button>
          </>
        );
      case "approved":
        return (
          <>
            <span className={`${font} text-[12px] text-amber-700 inline-flex items-center gap-1.5 mr-2`} style={{ fontWeight: 500 }}>
              <Clock className="size-3.5" strokeWidth={2.4} /> รอผู้ทดสอบส่งแบบประเมิน
            </span>
            <button
              className={`${font} border border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
              <Phone className="size-3.5" /> ติดต่อ
            </button>
            <button
              className={`${font} border border-gray-300 text-gray-700 hover:bg-gray-50 h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5`}>
              <MessageCircle className="size-3.5" /> ส่งข้อความ
            </button>
          </>
        );
      case "evaluated":
        return (
          <>
            {reg.evaluation && (
              <div className={`${font} text-[12px] text-amber-700 inline-flex items-center gap-1.5 mr-2`} style={{ fontWeight: 600 }}>
                <Star className="size-3.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                {reg.evaluation.overall}/5
                <span className="text-gray-400 mx-1">·</span>
                {reg.evaluation.wouldRecommend ? (
                  <span className="text-[#319754] inline-flex items-center gap-0.5"><ThumbsUp className="size-3" strokeWidth={2.4} /> แนะนำ</span>
                ) : (
                  <span className="text-red-600 inline-flex items-center gap-0.5"><ThumbsDown className="size-3" strokeWidth={2.4} /> ไม่แนะนำ</span>
                )}
              </div>
            )}
            <button
              onClick={() => setShowEval(true)}
              disabled={!reg.evaluation}
              className={`${font} h-9 px-4 rounded-full text-[13px] cursor-pointer transition-colors inline-flex items-center gap-1.5 ${
                reg.evaluation
                  ? "bg-[#319754] hover:bg-[#287745] text-white shadow-[0_2px_8px_rgba(49,151,84,0.25)]"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}>
              <FileText className="size-3.5" strokeWidth={2.4} /> ดูแบบประเมิน
            </button>
          </>
        );
      case "rejected":
        return (
          <span className={`${font} text-[12px] text-gray-500 inline-flex items-center gap-1.5`} style={{ fontWeight: 500 }}>
            <Ban className="size-3.5" strokeWidth={2.4} /> คำขอถูกปฏิเสธ
          </span>
        );
    }
  })();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] hover:border-gray-200 transition-all">
      {/* Header: applicant id + status pill | date */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-4 pt-4">
        <div className="flex items-center gap-2.5 min-w-0">
          {reg.name?.trim() ? (
            <div className="size-[36px] rounded-full overflow-hidden shrink-0 border-2 border-[#319754]/15">
              <img src={portraitForApplicant(reg.name, reg.gender)} alt={reg.name} loading="lazy" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="size-[36px] rounded-full bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
              <span className={`${font} text-[14px] text-[#319754]`} style={{ fontWeight: 700 }}>?</span>
            </div>
          )}
          <div className="min-w-0">
            <p className={`${font} text-[14px] truncate ${reg.name?.trim() ? "text-[#1a1a1a]" : "text-gray-400 italic"}`} style={{ fontWeight: 600 }}>{reg.name?.trim() || "ไม่ระบุชื่อ"}</p>
            <p className={`${font} text-[12px] inline-flex items-center gap-1 ${reg.phone?.trim() ? "text-gray-500" : "text-gray-400 italic"}`}>
              <Phone className="size-3" strokeWidth={2.2} /> {reg.phone?.trim() || "ไม่ระบุเบอร์"}
            </p>
          </div>
          <span className={`${font} text-[12px] px-4 py-1 rounded-full whitespace-nowrap ml-2`}
            style={{ backgroundColor: cfg.pillBg, color: cfg.pillText, fontWeight: 500 }}>
            {cfg.label}
          </span>
        </div>
        <span className={`${font} text-[12px] text-gray-500`}>{submittedLabel}</span>
      </div>

      {/* Body: product + address + motivation */}
      <div className="px-4 py-3 mt-2 flex flex-col gap-3">
        {/* Trial product row */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-[12px] p-3">
          <div className="size-[56px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
            {product && <img src={product.image} alt={product.name} className="w-full h-full object-cover" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{product?.category.toUpperCase()}</p>
            <p className={`${font} text-[14px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }}>{product?.name || reg.trialId}</p>
            <p className={`${font} text-[12px] text-gray-500 truncate`}>{product?.tagline}</p>
          </div>
          <div className="flex flex-col items-end shrink-0">
            <span className={`${font} text-[11px] text-gray-500`}>คะแนน</span>
            <span className={`${font} text-[14px] tabular-nums inline-flex items-center gap-0.5`} style={{ color: "#d97706", fontWeight: 700 }}>
              <Coins className="size-3.5" strokeWidth={2.4} />+{(product?.rewardPoints || 0).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Form completion progress — only for multi-form trials (has evaluationDays) */}
        {product?.evaluationDays && (() => {
          const baselineDone = !!reg.approvedAt;
          const afterDone = !!reg.evaluatedAt;
          const daysSinceReg = reg.approvedAt ? Math.floor((Date.now() - reg.approvedAt) / 86400000) : 0;
          const afterUnlocked = daysSinceReg >= product.evaluationDays;
          const forms = [
            { label: "ก่อนใช้สินค้า", done: baselineDone, unlocked: true,        timing: "ส่งทันที" },
            { label: "หลังใช้ครบกำหนด", done: afterDone,  unlocked: afterUnlocked, timing: `วันที่ ${product.evaluationDays}` },
          ];
          return (
            <div className="flex items-center gap-1.5 flex-wrap">
              {forms.map((f, idx) => {
                const color = f.done ? "#319754" : f.unlocked ? "#d97706" : "#9ca3af";
                return (
                  <span key={idx} className={`${font} inline-flex items-center gap-1 text-[11px] px-2 py-1 rounded-full border border-gray-200 bg-white text-gray-600`}
                    style={{ fontWeight: 500 }}>
                    {f.done
                      ? <Check className="size-3" style={{ color }} strokeWidth={3} />
                      : <Clock className="size-3" style={{ color }} strokeWidth={2.4} />}
                    <span>ฟอร์ม {idx + 1} · {f.label}</span>
                    <span className="text-gray-400">·</span>
                    <span style={{ color, fontWeight: 600 }}>
                      {f.done ? "ประเมินแล้ว" : f.unlocked ? "รอกรอก" : `วันที่ ${product.evaluationDays}`}
                    </span>
                  </span>
                );
              })}
            </div>
          );
        })()}

        {/* Address + Motivation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px] text-gray-700">
          <div className="flex items-start gap-2">
            <MapPin className="size-3.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={2.2} />
            <div className="min-w-0">
              <p className={`${font} text-[11px] text-gray-500 mb-0.5`} style={{ fontWeight: 500 }}>ที่อยู่จัดส่ง</p>
              <p className={`${font} leading-relaxed`}>{reg.address || "—"}</p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageCircle className="size-3.5 text-gray-400 shrink-0 mt-0.5" strokeWidth={2.2} />
            <div className="min-w-0">
              <p className={`${font} text-[11px] text-gray-500 mb-0.5`} style={{ fontWeight: 500 }}>เหตุผลในการขอ</p>
              <p className={`${font} leading-relaxed line-clamp-2`}>{reg.motivation || "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer: actions */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center justify-end gap-2 flex-wrap bg-gray-50/30">
        {actions}
      </div>

      {/* Evaluation read-only modal */}
      <AnimatePresence>
        {showEval && reg.evaluation && product && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowEval(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-[20px] max-w-[560px] w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Header */}
              <div className="sticky top-0 bg-white/95 backdrop-blur-md px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3 z-10">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-[44px] rounded-[10px] overflow-hidden bg-gray-100 shrink-0">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <p className={`${font} text-[11px] text-[#319754]`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>แบบประเมินจากผู้ทดสอบ</p>
                    <h2 className={`${font} text-[15px] text-[#1a1a1a] truncate`} style={{ fontWeight: 700 }}>{reg.name}</h2>
                    <p className={`${font} text-[11px] text-gray-500 truncate`}>{product.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowEval(false)} className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0">
                  <X className="size-[18px]" strokeWidth={2.4} />
                </button>
              </div>
              <div className="p-5">
                <EvaluationView evaluation={reg.evaluation} product={product} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return <th className={`${font} text-[11px] text-gray-500 uppercase tracking-wider px-4 py-3 whitespace-nowrap ${className || ""}`} style={{ fontWeight: 600, letterSpacing: "0.04em" }}>{children}</th>;
}
function Td({ children, className, onClick }: { children: React.ReactNode; className?: string; onClick?: (e: React.MouseEvent) => void }) {
  return <td className={`px-4 py-3 ${className || ""}`} onClick={onClick}>{children}</td>;
}

// ============================================================================
//  TAB 3 — PRODUCTS REGISTRY
// ============================================================================

export function OwnerTrialsProducts({ onAddProduct }: { onAddProduct: () => void }) {
  const { all, custom, remove } = useAllTrialProducts();
  type ProductFilter = "all" | "active" | "ending_soon" | "closed";
  const [filter, setFilter] = useState<ProductFilter>("all");
  const [search, setSearch] = useState("");
  /** Applicants modal — shows the people who registered for a specific trial */
  const [viewApplicantsOf, setViewApplicantsOf] = useState<TrialProduct | null>(null);
  /** Combined: real registrations from localStorage + the mocked roster */
  const allRegs = useMemo(() => [...MOCK_REGISTRATIONS, ...loadRegistrations()], []);
  const applicantsList = useMemo(() => {
    if (!viewApplicantsOf) return [];
    return allRegs.filter((r) => r.trialId === viewApplicantsOf.id).sort((a, b) => b.submittedAt - a.submittedAt);
  }, [viewApplicantsOf, allRegs]);

  const seatsTaken = (p: TrialProduct) => allRegs.filter((r) => r.trialId === p.id && !r.rejectedAt).length;
  const isClosed = (p: TrialProduct) => p.endsInDays <= 0 || p.spotsTotal - seatsTaken(p) <= 0;
  const isEndingSoon = (p: TrialProduct) => !isClosed(p) && (p.spotsTotal - seatsTaken(p) <= 10 || p.endsInDays <= 7);

  const counts = {
    all: all.length,
    active: all.filter((p) => !isClosed(p)).length,
    ending_soon: all.filter(isEndingSoon).length,
    closed: all.filter(isClosed).length,
  };

  const filtered = all.filter((p) => {
    if (filter === "active" && isClosed(p)) return false;
    if (filter === "ending_soon" && !isEndingSoon(p)) return false;
    if (filter === "closed" && !isClosed(p)) return false;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      return p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
    }
    return true;
  });

  // Render the detail page in-place instead of the list when a product is selected
  if (viewApplicantsOf) {
    return (
      <TrialDetailPage
        product={viewApplicantsOf}
        applicants={applicantsList}
        onBack={() => setViewApplicantsOf(null)}
        onDelete={() => remove(viewApplicantsOf.id)}
      />
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-5 gap-3 flex-wrap">
        <div>
          <h2 className={`${font} text-[22px]`} style={{ fontWeight: 600 }}>ทะเบียนสินค้าทดลอง</h2>
          <p className={`${font} text-[13px] text-gray-500 mt-0.5`}>จัดการสินค้าทดลอง รับสมัคร และติดตามคำตอบจาก Tester</p>
        </div>
        <motion.button
          onClick={onAddProduct}
          whileTap={{ scale: 0.96 }}
          whileHover={{ y: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`group flex items-center gap-2 bg-[#319754] text-white pl-1.5 pr-1.5 sm:pr-4 h-[38px] rounded-full text-[13px] ${font} cursor-pointer hover:bg-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
          style={{ transition: "background-color 200ms, box-shadow 200ms" }}>
          <span className="bg-white/22 size-[28px] rounded-full inline-flex items-center justify-center shrink-0">
            <Plus className="size-4" strokeWidth={2.6} />
          </span>
          <span className="hidden sm:inline" style={{ fontWeight: 600 }}>เพิ่มสินค้าทดลอง</span>
        </motion.button>
      </div>

      {/* KPI strip — same component used in the Overview tab so numbers stay in sync */}
      <div className="mb-5">
        <OwnerTrialsKpiStrip />
      </div>

      {/* Filter tabs + search — single white pill (matches OwnerDashboard Products/Orders) */}
      <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 mb-6 flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
          {([
            { key: "all" as const,          label: "ทั้งหมด",       count: counts.all,         icon: FlaskConical },
            { key: "active" as const,       label: "เปิดรับสมัคร",   count: counts.active,      icon: Check },
            { key: "ending_soon" as const,  label: "เกือบเต็ม",     count: counts.ending_soon, icon: Clock },
            { key: "closed" as const,       label: "ปิดรับ",        count: counts.closed,      icon: Ban },
          ]).map((t) => {
            const isAct = filter === t.key;
            return (
              <motion.button key={t.key} onClick={() => setFilter(t.key)}
                whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                {isAct && (
                  <motion.span layoutId="ownerTrialProductsActivePill"
                    className="absolute inset-0 bg-[#319754] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                )}
                <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                  transition={{ duration: 0.2 }}>
                  <t.icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                </motion.span>
                <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                  style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{t.label}</span>
                <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                  style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{t.count}</span>
              </motion.button>
            );
          })}
        </div>
        <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px] lg:ml-auto">
          <input
            value={search} onChange={(e) => setSearch(e.target.value)}
            className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
            placeholder="ค้นหาชื่อสินค้า, หมวดหมู่..." />
          <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
            <Search className="size-4 text-white" />
          </button>
        </div>
      </div>

      {/* Table — matches OwnerDashboard products table style */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 md:p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-100">
              <tr>
                <Th>สินค้า</Th>
                <Th>หมวดหมู่</Th>
                <Th>สถานะ</Th>
                <Th>ที่นั่ง</Th>
                <Th>เหลือเวลา</Th>
                <Th>คะแนน</Th>
                <Th className="text-right">จัดการ</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                // Real seat count = applicants not rejected (same logic as detail page)
                const spotsTakenReal = allRegs.filter((r) => r.trialId === p.id && !r.rejectedAt).length;
                const spotsLeft = Math.max(0, p.spotsTotal - spotsTakenReal);
                const pct = (spotsTakenReal / p.spotsTotal) * 100;
                const closed = isClosed(p);
                const endingSoon = isEndingSoon(p);
                // Status meta — drives left rail color + status pill
                const status = closed
                  ? { label: "ปิดรับ", color: "#6b7280", bg: "#f3f4f6", dot: "#9ca3af", rail: "#e5e7eb" }
                  : endingSoon
                    ? { label: "เกือบเต็ม", color: "#b45309", bg: "#fef3c7", dot: "#f59e0b", rail: "#f59e0b" }
                    : { label: "เปิดรับ",   color: "#287745", bg: "#dcfce7", dot: "#16a34a", rail: "#319754" };
                return (
                  <tr key={p.id}
                    onClick={() => setViewApplicantsOf(p)}
                    className="group/row border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors cursor-pointer relative">
                    <Td>
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`relative size-[52px] rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 ${closed ? "grayscale opacity-60" : ""}`}>
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className={`${font} text-[14px] text-black truncate leading-tight`} style={{ fontWeight: 500 }}>{p.name}</p>
                          <p className={`${font} text-[12px] text-gray-500 truncate max-w-[280px] mt-0.5`}>{p.tagline}</p>
                        </div>
                      </div>
                    </Td>
                    <Td><span className={`${font} text-[12.5px] text-gray-700`}>{p.category}</span></Td>
                    <Td>
                      <span className={`${font} inline-flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full whitespace-nowrap`}
                        style={{ backgroundColor: status.bg, color: status.color, fontWeight: 600 }}>
                        <span className="size-1.5 rounded-full" style={{ background: status.dot }} />
                        {status.label}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex flex-col gap-1 min-w-[110px]">
                        <div className="flex items-baseline justify-between gap-2">
                          <span className={`${font} text-[12px] text-[#1a1a1a] tabular-nums`} style={{ fontWeight: 700 }}>{spotsTakenReal}<span className="text-gray-400 font-normal">/</span>{p.spotsTotal}</span>
                          <span className={`${font} text-[10px] tabular-nums`} style={{ color: pct >= 90 ? "#dc2626" : pct >= 60 ? "#b45309" : "#287745", fontWeight: 700 }}>
                            {spotsLeft > 0 ? `เหลือ ${spotsLeft}` : "เต็ม"}
                          </span>
                        </div>
                        <div className="h-[5px] rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full transition-[width] duration-700" style={{
                            width: `${Math.min(100, pct)}%`,
                            background: pct >= 90
                              ? "linear-gradient(90deg, #fca5a5 0%, #dc2626 100%)"
                              : pct >= 60
                                ? "linear-gradient(90deg, #fcd34d 0%, #f59e0b 100%)"
                                : "linear-gradient(90deg, #86efac 0%, #319754 100%)",
                          }} />
                        </div>
                      </div>
                    </Td>
                    <Td>
                      <span className={`${font} text-[12.5px] inline-flex items-center gap-1 ${p.endsInDays <= 0 ? "text-red-600" : p.endsInDays <= 7 ? "text-amber-600" : "text-gray-700"}`} style={{ fontWeight: 500 }}>
                        <Clock className="size-3.5" strokeWidth={2.2} />
                        {p.endsInDays <= 0 ? "หมดเวลา" : `${p.endsInDays} วัน`}
                      </span>
                    </Td>
                    <Td>
                      <span className={`${font} text-[13px] tabular-nums inline-flex items-center gap-1`} style={{ color: "#d97706", fontWeight: 700 }}>
                        <Coins className="size-3.5" strokeWidth={2.4} />
                        +{p.rewardPoints.toLocaleString()}
                      </span>
                    </Td>
                    <Td className="text-right" onClick={(e) => e.stopPropagation()}>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="size-7 rounded-full inline-flex items-center justify-center bg-[#787880]/15 hover:bg-[#787880]/25 text-gray-700 transition-colors cursor-pointer mx-auto data-[state=open]:bg-[#319754] data-[state=open]:text-white">
                            <MoreHorizontal className="size-4" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          align="end"
                          sideOffset={6}
                          className="w-[230px] p-1.5 rounded-2xl border border-gray-100 bg-white shadow-[0_10px_28px_-8px_rgba(0,0,0,0.18),0_4px_12px_-4px_rgba(0,0,0,0.08)]"
                        >
                          <motion.div
                            initial={{ scale: 0.4, opacity: 0, y: -6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.4, opacity: 0, y: -6 }}
                            transition={{ type: "spring", stiffness: 380, damping: 26 }}
                            style={{ transformOrigin: "top right" }}
                            className="overflow-hidden"
                          >
                            {/* เปิดรับสมัคร toggle */}
                            <button
                              onClick={() => toast.success(closed ? `เปิดรับสมัคร: ${p.name}` : `ปิดรับสมัคร: ${p.name}`)}
                              className={`${font} w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left`}>
                              <span className={`${font} text-[13px] text-black`} style={{ fontWeight: 500 }}>เปิดรับสมัคร</span>
                              <span className={`relative inline-flex items-center w-9 h-5 rounded-full transition-colors ${!closed ? "bg-[#319754]" : "bg-gray-300"}`}>
                                <span className={`absolute size-4 bg-white rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform ${!closed ? "translate-x-[18px]" : "translate-x-[2px]"}`} />
                              </span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => toast.info(`แก้ไขสินค้า: ${p.name}`)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] text-black hover:bg-gray-50 cursor-pointer`}>
                              <Pencil className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>แก้ไข</span>
                            </button>
                            <button
                              onClick={() => setViewApplicantsOf(p)}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors text-left text-[13px] text-black`}>
                              <Eye className="size-3.5 text-gray-500" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ดูรายละเอียด</span>
                            </button>
                            <div className="h-px bg-gray-100 my-1" />
                            <button
                              onClick={() => { if (confirm(`ลบสินค้าทดลอง "${p.name}"?`)) { remove(p.id); toast.success(`ลบ: ${p.name}`); } }}
                              className={`${font} w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left text-[13px] text-[#ff3b30] hover:bg-[#ff3b30]/5 cursor-pointer`}>
                              <Trash2 className="size-3.5" strokeWidth={2.2} />
                              <span style={{ fontWeight: 500 }}>ลบ</span>
                            </button>
                          </motion.div>
                        </PopoverContent>
                      </Popover>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center text-center gap-2.5">
            <div className="size-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <FlaskConical className="size-5 text-gray-400" strokeWidth={2.2} />
            </div>
            <p className={`${font} text-[14px] text-gray-700`} style={{ fontWeight: 600 }}>
              {all.length === 0 ? "ยังไม่มีสินค้าทดลอง" : "ไม่พบรายการที่ตรงกับเงื่อนไข"}
            </p>
            <p className={`${font} text-[12px] text-gray-500 max-w-[320px]`}>
              {all.length === 0
                ? "เริ่มต้นโดยเพิ่มสินค้าทดลองแรก แล้วเปิดรับ Tester มาประเมินสินค้าของคุณ"
                : "ลองเปลี่ยน filter หรือค้นหาด้วยคำอื่น"}
            </p>
            {all.length === 0 && (
              <button onClick={onAddProduct}
                className={`${font} mt-2 inline-flex items-center gap-2 h-9 px-4 rounded-full bg-[#319754] hover:bg-[#267a43] text-white text-[12.5px] cursor-pointer transition-colors shadow-[0_2px_8px_rgba(49,151,84,0.25)]`}
                style={{ fontWeight: 600 }}>
                <Plus className="size-3.5" strokeWidth={2.6} />
                เพิ่มสินค้าทดลอง
              </button>
            )}
          </div>
        )}
      </div>

    </div>
  );
}

/** Pre-built evaluation form templates by product type. Owner picks one (or "กำหนดเอง"). */
const EVAL_TEMPLATES: { key: string; label: string; criteria: string[] }[] = [
  { key: "skincare",      label: "🌸 บำรุงผิว/เครื่องสำอาง", criteria: ["กลิ่นและเนื้อสัมผัส", "การซึมสู่ผิว", "ความชุ่มชื้น/ความนุ่ม", "ผลลัพธ์ที่เห็นใน 14 วัน", "การระคายเคือง"] },
  { key: "beverage",      label: "🍵 เครื่องดื่ม/ชา",         criteria: ["รสชาติและความหอม", "ความสะดวกในการชง/ละลาย", "สี", "ความรู้สึกหลังดื่ม", "ผลข้างเคียง"] },
  { key: "food",          label: "🍴 อาหาร",                 criteria: ["รสชาติ", "เนื้อสัมผัส", "กลิ่นและสี", "ความสดและคุณภาพ", "บรรจุภัณฑ์และความสะดวก"] },
  { key: "supplement",    label: "💊 อาหารเสริม/แคปซูล",      criteria: ["ขนาด/กลิ่น/รสของเม็ด", "ความสะดวกในการกลืน", "ผลที่รู้สึกได้", "ผลข้างเคียง", "ความถี่ในการใช้"] },
  { key: "oil",           label: "💧 น้ำมันสกัด",             criteria: ["กลิ่นและรสชาติ", "ความใสและสี", "การใช้กับอาหาร", "การดูดซึมบนผิว", "ความคงตัวที่อุณหภูมิห้อง"] },
  { key: "aroma",         label: "🌬️ ผ่อนคลาย/Aromatherapy",   criteria: ["กลิ่นและความเข้มข้น", "ผลต่อการผ่อนคลาย", "ระยะเวลาที่กลิ่นคงอยู่", "ความสะดวกในการใช้"] },
  { key: "perfume",       label: "🌹 น้ำหอม",                 criteria: ["Top note (แรกฉีด)", "Middle note (1 ชม.)", "Base note (4 ชม.+)", "ความติดทนของกลิ่น", "บรรจุภัณฑ์/ขวด"] },
  { key: "haircare",      label: "💆 บำรุงผม",               criteria: ["ความถี่ของผมร่วงใน 30 วัน", "ความหนา/ความเงาของเส้นผม", "ความสะอาดของหนังศีรษะ", "กลิ่นและเนื้อสัมผัส", "การระคายหนังศีรษะ"] },
  { key: "bodycare",      label: "🛁 ดูแลร่างกาย",            criteria: ["กลิ่นและเนื้อสัมผัส", "ความสบาย/ความเย็น", "ประสิทธิภาพในการบรรเทาอาการ", "การระคายผิว", "ความสะดวกในการใช้"] },
  { key: "oralcare",      label: "🦷 ดูแลช่องปาก",            criteria: ["รสชาติและฟอง", "ความสะอาดและความรู้สึกหลังใช้", "ผลต่อเหงือก/ฟัน", "กลิ่นปาก", "การระคายเคือง"] },
  { key: "household",     label: "🧹 ทำความสะอาด/ของใช้ในบ้าน", criteria: ["กลิ่น", "ประสิทธิภาพในการทำความสะอาด", "ความปลอดภัยกับเด็ก/สัตว์", "ปริมาณที่ใช้ต่อครั้ง", "บรรจุภัณฑ์"] },
];

/** Map สินค้า category → default template key */
const CATEGORY_TO_TEMPLATE: Record<string, string> = {
  "เครื่องสำอาง":            "skincare",
  "สุขภาพ / อาหารเสริม":      "supplement",
  "อโรมา / เครื่องหอม":       "aroma",
  "อาหาร / เครื่องดื่ม":       "food",
  "อุปกรณ์ / เครื่องมือ":      "household",
};

/* =============================================================
 * EVALUATION FORM AUTO-GENERATOR
 * ============================================================= */

/** Multi-select test objectives the owner picks; the form is generated from these + category. */
const TEST_OBJECTIVES: { key: TestObjective; label: string; description: string; example: string[]; accent: string }[] = [
  { key: "efficacy",   label: "ทดสอบประสิทธิภาพ (Efficacy)",            description: "พิสูจน์ว่าสินค้าทำงานได้จริงตามสรรพคุณ วัดด้วย Before/After", accent: "#319754",
    example: ["ระดับความชุ่มชื้นผิว (Scale 1-5)", "ปัญหาผิวที่ต้องการแก้ไข (Multiple Choice)", "ผลข้างเคียง / อาการแพ้ (Conditional)"] },
  { key: "sensory",    label: "ทดสอบประสาทสัมผัส (Sensory)",            description: "วัดความพึงพอใจด้านเนื้อสัมผัส กลิ่น รสชาติ สี", accent: "#f59e0b",
    example: ["เนื้อสัมผัส (Texture) เหมาะกับผิว (Scale 1-5)", "กลิ่นน่าใช้ ไม่ฉุนรบกวน (Scale 1-5)", "สัมผัสแรกที่รู้สึกได้ (Tags)"] },
  { key: "packaging",  label: "ทดสอบบรรจุภัณฑ์ (Packaging)",            description: "วัดดีไซน์ ความสวยงาม ฟังก์ชันการใช้งาน และ First Impression", accent: "#8b5cf6",
    example: ["ดีไซน์ / ความสวยงาม (Scale 1-5)", "ฟังก์ชันการใช้งาน (เปิด/ปิด/พกพา) (Scale 1-5)", "First Impression (Multiple Choice)"] },
  { key: "market",     label: "ทดสอบด้านการตลาด (Market Research)",     description: "วัด Purchase Intent ราคาที่ยอมจ่าย NPS และกลุ่มเป้าหมาย", accent: "#ef4444",
    example: ["Purchase Intent — คุณจะซื้อจริงไหม (Scale 1-5)", "ราคาสูงสุดที่ยอมจ่าย (Text)", "เหมาะกับกลุ่มเป้าหมายแบบใด (Multiple Choice)"] },
  { key: "formula_ab", label: "เปรียบเทียบสูตร A/B (Formula Comparison)", description: "Tester ลองทั้งสองสูตรและประเมิน Side-by-Side", accent: "#ec4899",
    example: ["ชอบสูตรไหนมากกว่า (A vs B)", "ความแตกต่างที่สังเกตได้ (Text)"] },
];

const TYPE_LABEL: Record<QuestionType, string> = {
  scale_1_5: "Scale 1-5", stars_1_5: "1-5 ดาว", nps_0_10: "NPS 0-10",
  multiple_choice: "Multiple Choice", tag: "Tag หลายข้อ", conditional: "Conditional",
  text: "Text", ab_choice: "A vs B",
};

/* ============================================================
 *  Mock evaluation generator — turns each hand-authored base row into a fully populated
 *  evaluation matching the trial's generated question set. Keeps overall/comment/
 *  wouldRecommend from the seed; synthesises type-specific maps deterministically per
 *  (trial × tester × question) so charts stay stable across re-renders.
 *  ============================================================ */

/** Deterministic 32-bit PRNG (mulberry32) so mock data is identical across reloads. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** djb2-style hash over a string → 32-bit seed for mulberry32. */
function seedFor(parts: string): number {
  let h = 5381;
  for (let i = 0; i < parts.length; i++) h = (h * 33) ^ parts.charCodeAt(i);
  return h >>> 0;
}

/** Pick an item from `pool` weighted by index — earlier items more likely (~60/30/10). */
function weightedPick<T>(pool: T[], rng: () => number, frontBias = 0.6): T {
  if (pool.length === 0) throw new Error("weightedPick: empty pool");
  if (pool.length === 1) return pool[0];
  const r = rng();
  if (r < frontBias) return pool[Math.floor(rng() * Math.min(2, pool.length))];
  return pool[Math.floor(rng() * pool.length)];
}

/** Bias an integer 1-5 toward the middle-high end (mock realism — most evaluations skew positive). */
function biasedScale(rng: () => number, mean: number): number {
  const noise = (rng() - 0.5) * 2; // -1..1
  const v = Math.round(mean + noise * 1.2);
  return Math.max(1, Math.min(5, v));
}

/** Bias an NPS 0-10 toward 7-10 (matches a typical promoter-heavy beta cohort). */
function biasedNps(rng: () => number): number {
  const r = rng();
  if (r < 0.55) return 9 + Math.floor(rng() * 2);       // 9-10 (promoter)
  if (r < 0.85) return 7 + Math.floor(rng() * 2);       // 7-8  (passive)
  return Math.floor(rng() * 7);                          // 0-6  (detractor)
}

/** Tag pools per category — pulled in when generating multi-select tag answers. */
const TAG_POOLS: Record<string, string[]> = {
  "เครื่องสำอาง":     ["นุ่ม", "ลื่น", "ฉ่ำ", "ซึมไว", "เย็น", "หอมอ่อน", "บางเบา"],
  "อาหาร / เครื่องดื่ม": ["หอม", "กลมกล่อม", "สดชื่น", "ดื่มง่าย", "หวานน้อย", "ขมเล็กน้อย"],
  "สุขภาพ / อาหารเสริม": ["กลืนง่าย", "ไม่ขม", "ไม่ติดคอ", "ขนาดพอดี", "ไม่มีกลิ่น"],
  "อโรมา / เครื่องหอม":  ["หอมโทนอุ่น", "หอมโทนเย็น", "ผ่อนคลาย", "สดชื่น", "ติดทนนาน"],
  "อุปกรณ์ / เครื่องมือ": ["ใช้ง่าย", "พกพาสะดวก", "เงียบ", "ดูพรีเมียม", "ขนาดพอดี"],
};

/** Realistic side-effect notes for the conditional safety question. */
const SIDE_NOTES = [
  "ผิวแดงเล็กน้อยช่วงแรก หายไปใน 2-3 วัน",
  "รู้สึกแสบเบาๆ ตอนเริ่มใช้ แต่ปรับตัวได้",
  "คันบริเวณที่ทาเป็นบางครั้ง",
  "มีผื่นเล็กน้อยช่วงแรก",
  "รู้สึกร้อนนิดหน่อยตอนทาแรก",
];

/** Realistic "ความแตกต่างที่สังเกตได้" (A/B diff) notes. */
const AB_DIFF_NOTES = [
  "สูตร A เนื้อนุ่มกว่า แต่ B หอมกว่า",
  "B ซึมไวกว่า แต่ A ให้ความชุ่มชื้นนานกว่า",
  "ทั้งสองสูตรดี แต่ A เข้ากับผิวมากกว่า",
  "สูตร B เนื้อเข้มข้นกว่า เหมาะกับผิวแห้ง",
  "A กลิ่นนุ่มกว่า เหมาะใช้กลางวัน",
  "ไม่ต่างกันมาก ทั้งคู่ใช้แล้วผิวดีขึ้น",
];

/** Build a fully-populated Evaluation for one tester on one trial.
 *  - `seed` is a stable per-tester key (the registration index).
 *  - `overrides` lets seed rows preserve their hand-authored overall/comment/wouldRecommend. */
function buildMockEvaluation(
  trialId: string,
  seed: number,
  overrides?: Partial<Evaluation>
): Evaluation {
  const trial = TRIAL_PRODUCTS.find((t) => t.id === trialId);
  // If the trial isn't in the static catalog (e.g. localStorage-added custom trial),
  // fall back to the override only — don't crash, just return a benign minimal eval.
  if (!trial) {
    return {
      overall: overrides?.overall ?? 4,
      criteria: overrides?.criteria ?? {},
      comment: overrides?.comment ?? "",
      wouldRecommend: overrides?.wouldRecommend ?? true,
      ...overrides,
    };
  }
  const objectives = trial.testObjectives ?? [];
  const allQuestions = objectives.length > 0
    ? generateEvalQuestions(objectives, trial.category)
    : [];
  // Defensive: empty objectives → only seed minimal scale data for whatToTest labels so the
  // legacy 1-5 histograms keep working with at least scale charts.
  if (allQuestions.length === 0) {
    const rng = mulberry32(seedFor(`${trialId}:fallback:${seed}`));
    const criteria: Record<string, number> = { ...(overrides?.criteria ?? {}) };
    for (const label of trial.whatToTest) {
      if (criteria[label] === undefined) criteria[label] = biasedScale(rng, 4);
    }
    return {
      overall: overrides?.overall ?? biasedScale(rng, 4),
      criteria,
      comment: overrides?.comment ?? "",
      wouldRecommend: overrides?.wouldRecommend ?? rng() > 0.25,
    };
  }

  const criteria: Record<string, number> = { ...(overrides?.criteria ?? {}) };
  const scoreById: Record<string, number> = {};
  const npsScores: Record<string, number> = {};
  const mcAnswers: Record<string, string> = {};
  const tagAnswers: Record<string, string[]> = {};
  const abChoices: Record<string, "A" | "B"> = {};
  const textAnswers: Record<string, string> = {};
  const conditionalAnswers: Record<string, ConditionalAnswer> = {};

  let overall = overrides?.overall ?? 4;
  let comment = overrides?.comment ?? "";
  // Bias `meanScore` by the seed row's overall so cards look consistent with the hero comment.
  const meanScore = overrides?.overall ?? 4;

  for (const q of allQuestions) {
    const rng = mulberry32(seedFor(`${trialId}:${q.id}:${seed}`));
    switch (q.type) {
      case "scale_1_5": {
        const v = biasedScale(rng, meanScore);
        scoreById[q.id] = v;
        // Mirror into legacy criteria map keyed by label so existing scale charts keep working.
        if (criteria[q.label] === undefined) criteria[q.label] = v;
        break;
      }
      case "stars_1_5": {
        // core_overall lives at evaluation.overall — only override if no seed value given.
        if (overrides?.overall === undefined) overall = biasedScale(rng, meanScore);
        break;
      }
      case "nps_0_10": {
        // Bias NPS upward if the row was overall-positive; downward otherwise.
        const v = meanScore >= 4 ? biasedNps(rng) : Math.floor(rng() * 8);
        npsScores[q.id] = v;
        break;
      }
      case "multiple_choice": {
        if (q.options && q.options.length > 0) {
          mcAnswers[q.id] = weightedPick(q.options, rng);
        }
        break;
      }
      case "tag": {
        const pool = TAG_POOLS[trial.category] ?? TAG_POOLS["เครื่องสำอาง"];
        const count = 1 + Math.floor(rng() * 3); // 1-3 tags
        const picks = new Set<string>();
        while (picks.size < Math.min(count, pool.length)) picks.add(pool[Math.floor(rng() * pool.length)]);
        tagAnswers[q.id] = Array.from(picks);
        break;
      }
      case "conditional": {
        // ~30% report an issue — gives 3-4 has:true entries across trial-1's n=15 and 4-5
        // across the n=13 trials, enough to make the donut meaningful without alarmism.
        const has = rng() < 0.3;
        conditionalAnswers[q.id] = has
          ? { has: true, note: SIDE_NOTES[Math.floor(rng() * SIDE_NOTES.length)] }
          : { has: false };
        break;
      }
      case "text": {
        if (q.id === "core_text") {
          // Always-on free comment is the hero comment from the seed row.
          if (comment === "") comment = "ใช้แล้วประทับใจ จะแนะนำเพื่อน";
        } else if (q.id === "mkt_price") {
          const base = 240 + Math.floor(rng() * 8) * 30;
          textAnswers[q.id] = `฿${base}`;
        } else if (q.id === "ab_diff") {
          textAnswers[q.id] = AB_DIFF_NOTES[Math.floor(rng() * AB_DIFF_NOTES.length)];
        } else {
          textAnswers[q.id] = "—";
        }
        break;
      }
      case "ab_choice": {
        abChoices[q.id] = rng() < 0.55 ? "A" : "B";
        break;
      }
    }
  }

  // wouldRecommend derived from the dominant NPS if present, else from overall, else override.
  const npsList = Object.values(npsScores);
  const derivedRecommend = npsList.length > 0
    ? npsList.filter((n) => n >= 7).length >= npsList.length / 2
    : overall >= 4;

  return {
    overall,
    criteria,
    comment,
    wouldRecommend: overrides?.wouldRecommend ?? derivedRecommend,
    scoreById,
    npsScores,
    mcAnswers,
    tagAnswers,
    abChoices,
    textAnswers,
    conditionalAnswers,
  };
}

/** Enriched view of MOCK_REGISTRATIONS_BASE — built once per module load (lazy via the const
 *  declaration order). Each row keeps its hand-authored overall/comment/wouldRecommend; its
 *  evaluation is regenerated with the full set of type-specific maps the dashboard needs. */
const MOCK_REGISTRATIONS: Registration[] = MOCK_REGISTRATIONS_BASE.map((r, i) => {
  if (!r.evaluation) return r;
  return {
    ...r,
    evaluation: buildMockEvaluation(r.trialId, i, r.evaluation),
  };
});

export function AddTrialProductTab({ onBack }: { onBack: () => void }) {
  const { add } = useAllTrialProducts();
  const onSave = (p: TrialProduct) => { add(p); toast.success("เพิ่มสินค้าทดลองเรียบร้อย", { description: p.name }); onBack(); };
  return <AddTrialProductForm onBack={onBack} onSave={onSave} />;
}

function AddTrialProductForm({ onBack, onSave }: { onBack: () => void; onSave: (p: TrialProduct) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [tagline, setTagline] = useState("");
  // 3 image slots — slot 0 = primary, used as the main `image`; all stored in `images[]`
  const [productImages, setProductImages] = useState<(string | null)[]>([null, null, null]);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploadingSlot, setUploadingSlot] = useState<number | null>(null);
  const triggerImageUpload = (slot: number) => { setUploadingSlot(slot); imageInputRef.current?.click(); };
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const slot = uploadingSlot;
    setUploadingSlot(null);
    if (!file || slot === null) return;
    const result = await readImageFile(file, { maxWidth: 1200, quality: 0.85 });
    if (!result.ok) { toast.error(result.error); return; }
    setProductImages((prev) => prev.map((v, i) => i === slot ? result.dataUrl : v));
    toast.success("เพิ่มรูปสินค้าแล้ว");
  };
  const removeImage = (slot: number) => setProductImages((prev) => prev.map((v, i) => i === slot ? null : v));
  const image = productImages[0] || "";
  const [spotsTotal, setSpotsTotal] = useState(0);
  const [endsInDays, setEndsInDays] = useState(0);
  const [rewardPoints, setRewardPoints] = useState(0);
  // Initial template derived from default category
  const initialTplKey = CATEGORY_TO_TEMPLATE[category] || "custom";
  const initialTpl = EVAL_TEMPLATES.find((t) => t.key === initialTplKey);
  /** Auto-generated evaluation form — driven by selected objectives + category */
  const [testObjectives, setTestObjectives] = useState<TestObjective[]>([]);
  /** Which evaluation phases the owner wants to collect. "always" is always included. */
  const [activePhases, setActivePhases] = useState<Exclude<Phase, "always">[]>([]);
  /** Days after registration when the "after use" form becomes available to Tester. */
  const [evaluationDays, setEvaluationDays] = useState<number>(7);
  /** Modal for the form generator */
  const [evalModalOpen, setEvalModalOpen] = useState(false);
  /** Dedicated read-only preview that renders the form exactly as Tester will see it */
  const [formPreviewOpen, setFormPreviewOpen] = useState(false);
  /** Preview mode inside the modal: compact list vs. actual rendered form */
  const [previewMode, setPreviewMode] = useState<"list" | "form">("list");
  /** Staged objectives + phases — only commit on "Apply" so cancel reverts */
  const [stagedObjectives, setStagedObjectives] = useState<TestObjective[]>(testObjectives);
  const [stagedPhases, setStagedPhases] = useState<Exclude<Phase, "always">[]>(activePhases);
  // Sync staged when opening the modal
  useEffect(() => {
    if (evalModalOpen) {
      setStagedObjectives(testObjectives);
      setStagedPhases(activePhases);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [evalModalOpen]);
  /** Generated questions filtered by the staged phase selection */
  const stagedQuestions = useMemo(
    () => generateEvalQuestions(stagedObjectives, category)
      .filter((q) => q.phase === "always" || stagedPhases.includes(q.phase)),
    [stagedObjectives, category, stagedPhases]
  );
  const stagedByPhase = useMemo(() => {
    const groups: Record<Phase, EvalQuestion[]> = { baseline: [], first_use: [], after_full: [], always: [] };
    for (const q of stagedQuestions) groups[q.phase].push(q);
    return groups;
  }, [stagedQuestions]);
  const generatedQuestions = useMemo(
    () => generateEvalQuestions(testObjectives, category)
      .filter((q) => q.phase === "always" || activePhases.includes(q.phase)),
    [testObjectives, category, activePhases]
  );
  /** Group by phase for the preview UI */
  const questionsByPhase = useMemo(() => {
    const groups: Record<Phase, EvalQuestion[]> = { baseline: [], first_use: [], after_full: [], always: [] };
    for (const q of generatedQuestions) groups[q.phase].push(q);
    return groups;
  }, [generatedQuestions]);
  const [whatToTestText, setWhatToTestText] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  /** Sync the legacy text representation so validation + save keep working */
  useEffect(() => {
    if (testObjectives.length > 0) {
      setWhatToTestText(generatedQuestions.map((q) => q.label).join("\n"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedQuestions]);

  // ===== Product info fields (ส่วนประกอบ & วิธีใช้) =====
  const [ingredients, setIngredients] = useState("");
  const [warnings, setWarnings] = useState("");
  const [howToUse, setHowToUse] = useState("");

  // ===== Target audience (5 multi-select groups) + Feedback + sample count =====
  const [targetAge, setTargetAge] = useState<string[]>([]);
  const [targetGender, setTargetGender] = useState<string[]>([]);
  const [targetLifestyle, setTargetLifestyle] = useState<string[]>([]);
  const [targetHealth, setTargetHealth] = useState<string[]>([]);
  const [targetBehavior, setTargetBehavior] = useState<string[]>([]);
  const [feedbackTypes, setFeedbackTypes] = useState<string[]>(["แบบสอบถาม"]);

  const AGE_OPTIONS       = ["15-24", "25-34", "35-44", "45-54", "55+"];
  const GENDER_OPTIONS    = ["ชาย", "หญิง", "LGBTQ+"];
  const LIFESTYLE_OPTIONS = [
    { emoji: "🙂", label: "ผู้บริโภคทั่วไป" },
    { emoji: "💚", label: "สายสุขภาพ" },
    { emoji: "🧓", label: "ผู้สูงอายุ" },
    { emoji: "💪", label: "นักกีฬา/ออกกำลัง" },
    { emoji: "☕", label: "คนดื่มกาแฟ" },
    { emoji: "🌙", label: "มีปัญหาการนอน" },
    { emoji: "✨", label: "สาย skincare" },
  ];
  const HEALTH_OPTIONS = [
    { emoji: "😴", label: "นอนหลับยาก" },
    { emoji: "😰", label: "เครียด" },
    { emoji: "😩", label: "อ่อนเพลีย" },
    { emoji: "🌸", label: "ปัญหาผิว" },
    { emoji: "🍽", label: "ระบบย่อย" },
    { emoji: "🦴", label: "ปวดข้อ" },
    { emoji: "🧠", label: "สมาธิ" },
  ];
  const BEHAVIOR_OPTIONS = [
    { emoji: "🍵", label: "ชาสมุนไพร" },
    { emoji: "💊", label: "แคปซูล" },
    { emoji: "🥤", label: "ผง" },
    { emoji: "💧", label: "น้ำมัน" },
    { emoji: "🧴", label: "ครีม/เซรั่ม" },
  ];
  const FEEDBACK_OPTIONS = ["แบบสอบถาม", "สัมภาษณ์ออนไลน์", "รีวิวยาว", "รูปก่อน-หลัง", "วิดีโอรีวิว"];

  const toggle = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (k: string) =>
    setter((prev) => prev.includes(k) ? prev.filter((x) => x !== k) : [...prev, k]);
  const toggleAge       = toggle(setTargetAge);
  const toggleGender    = toggle(setTargetGender);
  const toggleLifestyle = toggle(setTargetLifestyle);
  const toggleHealth    = toggle(setTargetHealth);
  const toggleBehavior  = toggle(setTargetBehavior);
  const toggleFeedback  = toggle(setFeedbackTypes);

  // ===== Quality & Documents (คุณภาพ & เอกสาร) — file names + key fields =====
  const [docs, setDocs] = useState({
    labResult: "",            // ผลทดสอบจากห้องแล็บ (file name)
    labNote: "",              // สรุปผลทดสอบสั้นๆ
    fdaNumber: "",            // เลข อย.
    fdaDoc: "",               // ใบ อย. (file)
    factoryName: "",          // ชื่อโรงงาน
    factoryAddress: "",       // ที่อยู่โรงงาน
    factoryGmpDoc: "",        // ใบ GMP (file)
    sdsDoc: "",               // Safety Data Sheet (file)
    insuranceDoc: "",         // ประกันความรับผิด (file)
    insuranceProvider: "",    // ผู้รับประกัน
  });
  const updDoc = <K extends keyof typeof docs>(k: K, v: typeof docs[K]) => setDocs((p) => ({ ...p, [k]: v }));
  const docRefs = {
    labResult: useRef<HTMLInputElement>(null),
    fdaDoc: useRef<HTMLInputElement>(null),
    factoryGmpDoc: useRef<HTMLInputElement>(null),
    sdsDoc: useRef<HTMLInputElement>(null),
    insuranceDoc: useRef<HTMLInputElement>(null),
  };
  const onDocFile = (k: keyof typeof docs) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    updDoc(k, f.name as any);
    toast.success("แนบเอกสารแล้ว", { description: f.name });
  };

  // When category changes, auto-apply the matching template (overrides current selection)
  useEffect(() => {
    const suggested = CATEGORY_TO_TEMPLATE[category];
    if (!suggested) return;
    const tpl = EVAL_TEMPLATES.find((t) => t.key === suggested);
    if (tpl) {
      setWhatToTestText(tpl.criteria.join("\n"));
      setSelectedTemplate(tpl.key);
    }
  }, [category]);

  const applyTemplate = (key: string) => {
    const tpl = EVAL_TEMPLATES.find((t) => t.key === key);
    if (!tpl) return;
    setWhatToTestText(tpl.criteria.join("\n"));
    setSelectedTemplate(key);
  };

  // Per-section validation
  const infoValid = name.trim().length >= 3 && tagline.trim().length >= 5 && rewardPoints > 0;
  const imageValid = image.trim().length > 0;
  const usageValid = ingredients.trim().length > 0 && howToUse.trim().length > 0;
  const conditionsValid = spotsTotal > 0 && endsInDays > 0;
  const targetValid = targetAge.length > 0 && targetGender.length > 0;
  const qualityValid = !!(docs.labResult && docs.fdaNumber && docs.factoryName);
  const criteriaValid =
    whatToTestText.split("\n").map((s) => s.trim()).filter(Boolean).length > 0;
  const canSave = infoValid && conditionsValid && criteriaValid;

  // Sections for the step-progress sidebar
  const sections: { id: string; label: string; required: boolean; valid: boolean }[] = [
    { id: "image",      label: "รูปภาพสินค้า",       required: false, valid: imageValid },
    { id: "info",       label: "ข้อมูลพื้นฐาน",      required: true,  valid: infoValid },
    { id: "usage",      label: "ส่วนประกอบ & วิธีใช้",  required: false, valid: usageValid },
    { id: "conditions", label: "เงื่อนไขการทดสอบ",    required: true,  valid: conditionsValid },
    { id: "quality",    label: "คุณภาพ & เอกสาร",     required: false, valid: qualityValid },
    { id: "target",     label: "กลุ่มเป้าหมาย",       required: false, valid: targetValid },
    { id: "criteria",   label: "แบบประเมิน Tester",    required: true,  valid: criteriaValid },
  ];
  const [activeStep, setActiveStep] = useState(0);
  const [maxVisitedStep, setMaxVisitedStep] = useState(0);

  const scrollToSection = (id: string, idx: number) => {
    setActiveStep(idx);
    setMaxVisitedStep((p) => Math.max(p, idx));
    document.getElementById(`trialprod-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Scroll-spy: track which section is in view
  useEffect(() => {
    const ids = sections.map((s) => s.id);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const id = visible[0].target.id.replace("trialprod-", "");
          const idx = ids.indexOf(id);
          if (idx >= 0) {
            setActiveStep(idx);
            setMaxVisitedStep((p) => Math.max(p, idx));
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(`trialprod-${id}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleSave = () => {
    if (!canSave) { toast.error("กรอกข้อมูลให้ครบและถูกต้อง"); return; }
    const gallery = productImages.filter((x): x is string => !!x);
    const p: TrialProduct = {
      id: `trial-custom-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      image: gallery[0] || "",
      images: gallery.length > 1 ? gallery : undefined,
      spotsTotal,
      spotsTaken: 0,
      endsInDays,
      rewardPoints,
      whatToTest: whatToTestText.split("\n").map((s) => s.trim()).filter(Boolean),
      testObjectives: testObjectives.length > 0 ? [...testObjectives] : undefined,
      activePhases: activePhases.length > 0 ? [...activePhases] : undefined,
      evaluationDays: activePhases.includes("after_full") ? evaluationDays : undefined,
    };
    onSave(p);
  };

  return (
    <div className="flex items-start gap-4">
      {/* Left content */}
      <div className="flex-1 min-w-0">
        {/* Top bar — back button (matches AddProductTab) */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <button onClick={onBack}
            className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
            style={{ fontWeight: 500 }}>
            <ChevronLeft className="size-3.5" strokeWidth={2.5} /> กลับ
          </button>
        </div>

        {/* Title */}
        <div className="flex items-center gap-4 mb-5 flex-wrap">
          <h2 className={`${font} text-[20px] text-black leading-[30px]`} style={{ fontWeight: 500 }}>เพิ่มสินค้าทดลองใหม่</h2>
        </div>

        <div className="space-y-4">
        {/* Section: รูปภาพสินค้า — 3 slots like AddProductTab */}
        <section id="trialprod-image" onMouseEnter={() => { setActiveStep(0); setMaxVisitedStep((p) => Math.max(p, 0)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Package className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>รูปภาพสินค้า</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>อัปโหลดได้สูงสุด 3 รูป (JPG, PNG, WebP) ขนาดไม่เกิน 2MB</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="flex flex-wrap gap-3">
            {[
              { label: "รูปปกสินค้า", sub: "รูปหลัก", primary: true },
              { label: "รูป 2", sub: "เพิ่มเติม", primary: false },
              { label: "รูป 3", sub: "เพิ่มเติม", primary: false },
            ].map((item, slot) => {
              const uploaded = productImages[slot];
              return (
                <motion.button key={item.label} type="button"
                  onClick={() => triggerImageUpload(slot)}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className={`group/upload relative bg-gradient-to-br from-gray-50 to-gray-100/60 border-2 border-dashed rounded-2xl size-[150px] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all shrink-0 overflow-hidden ${
                    uploaded
                      ? "border-[#319754] from-white to-white"
                      : item.primary
                        ? "border-[#319754]/40 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10"
                        : "border-gray-300 hover:border-[#319754] hover:from-[#319754]/5 hover:to-[#319754]/10"
                  }`}>
                  {uploaded ? (
                    <>
                      <img src={uploaded} alt={item.label} className="absolute inset-0 w-full h-full object-cover" />
                      {item.primary && (
                        <span className={`${font} absolute top-2 right-2 text-[9px] bg-[#319754] text-white px-2 py-0.5 rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.2)]`} style={{ fontWeight: 600 }}>หลัก</span>
                      )}
                      <span
                        onClick={(e) => { e.stopPropagation(); removeImage(slot); }}
                        role="button"
                        className="absolute top-2 left-2 size-6 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center cursor-pointer transition-colors"
                        aria-label="ลบรูป">
                        <X className="size-3.5" strokeWidth={2.4} />
                      </span>
                    </>
                  ) : (
                    <>
                      {item.primary && (
                        <span className={`${font} absolute top-2 right-2 text-[9px] bg-[#319754] text-white px-2 py-0.5 rounded-full`} style={{ fontWeight: 600 }}>หลัก</span>
                      )}
                      <div className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center transition-transform group-hover/upload:scale-110 group-hover/upload:rotate-90 shadow-[0_2px_6px_rgba(0,0,0,0.06)]">
                        <Plus className="size-4 text-gray-500 group-hover/upload:text-[#319754] transition-colors" strokeWidth={2.4} />
                      </div>
                      <div className="text-center px-2">
                        <p className={`${font} text-[12px] text-black`} style={{ fontWeight: 500 }}>{item.label}</p>
                        <p className={`${font} text-[10px] text-gray-400 mt-0.5`}>{item.sub}</p>
                      </div>
                    </>
                  )}
                </motion.button>
              );
            })}
            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageFile} />
          </div>
        </section>

        {/* Section: ข้อมูลพื้นฐาน — mirrors AddProductTab info layout (3-col grid + pill inputs) */}
        <section id="trialprod-info" onMouseEnter={() => { setActiveStep(1); setMaxVisitedStep((p) => Math.max(p, 1)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <FileText className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <h3 className={`${font} text-[18px] text-black`} style={{ fontWeight: 600 }}>ข้อมูลสินค้า</h3>
          </div>
          <div className="h-px bg-gray-100" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ชื่อสินค้าทดลอง <span className="text-[#ff3b30]">*</span></label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น: เซรั่มขมิ้นชัน Brightening v3"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>หมวดหมู่ <span className="text-[#ff3b30]">*</span></label>
              <div className="relative">
                <select value={category} onChange={(e) => setCategory(e.target.value)}
                  className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-6 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow appearance-none cursor-pointer ${category ? "text-[#1a1a1a]" : "text-[#a3a3a3]"}`}>
                  <option value="" disabled>เลือกหมวดหมู่</option>
                  {["เครื่องสำอาง","สุขภาพ / อาหารเสริม","อโรมา / เครื่องหอม","อาหาร / เครื่องดื่ม","อุปกรณ์ / เครื่องมือ"].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown className="size-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>คะแนนที่ผู้ทดสอบจะได้รับ <span className="text-[#ff3b30]">*</span></label>
              <input type="number" value={String(rewardPoints)} onChange={(e) => setRewardPoints(Number(e.target.value) || 0)} placeholder="200"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
            </div>
            {/* Row 2 — Tagline spans all 3 columns */}
            <div className="flex flex-col gap-2 md:col-span-3">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>คำอธิบายสั้น <span className="text-[#ff3b30]">*</span></label>
              <textarea rows={3} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="เช่น: สูตรใหม่ลดความหมอง — รอผลตอบรับก่อนเปิดขายจริง"
                className={`${font} bg-[#fafafa] w-full rounded-2xl px-6 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] resize-none`} />
            </div>
          </div>
        </section>

        {/* Section: ส่วนประกอบ & วิธีใช้ */}
        <section id="trialprod-usage" onMouseEnter={() => { setActiveStep(2); setMaxVisitedStep((p) => Math.max(p, 2)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Beaker className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>ส่วนประกอบ &amp; วิธีใช้</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>Ingredient list, วิธีการใช้, และคำเตือนสำหรับผู้ทดสอบ</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="space-y-3.5">
            <Textarea label="ส่วนประกอบ (Ingredients)" value={ingredients} onChange={setIngredients} rows={4}
              placeholder="เช่น Curcumin 5%&#10;Niacinamide 3%&#10;Hyaluronic Acid&#10;Glycerin&#10;Aqua" />
            <Textarea label="วิธีการใช้" value={howToUse} onChange={setHowToUse} rows={4}
              placeholder="ขั้นตอนการใช้ — 1 ขั้นตอน ต่อ 1 บรรทัด&#10;เช่น ล้างหน้าให้สะอาด&#10;หยด 2-3 หยดลงฝ่ามือ&#10;ทาบนใบหน้า เน้นจุดที่ต้องการบำรุง" />
            <Textarea label="คำเตือน" value={warnings} onChange={setWarnings} rows={3}
              placeholder="เช่น หยุดใช้ทันทีหากเกิดการระคายเคือง&#10;หลีกเลี่ยงรอบดวงตา&#10;ไม่เหมาะกับผู้แพ้ขมิ้น" />
          </div>
        </section>

        {/* Section: เงื่อนไขการทดสอบ */}
        <section id="trialprod-conditions" onMouseEnter={() => { setActiveStep(3); setMaxVisitedStep((p) => Math.max(p, 3)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Clock className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>เงื่อนไขการทดสอบ</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>จำนวนผู้ทดสอบและระยะเวลาเปิดรับสมัคร</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* จำนวนที่นั่ง — input อิสระ + quick suggestion chips */}
            <div className="flex flex-col gap-2">
              <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
                จำนวนที่นั่ง <span className="text-[#ff3b30]">*</span>
              </label>
              <input type="number" min={1} value={spotsTotal || ""} onChange={(e) => setSpotsTotal(Math.max(0, Number(e.target.value) || 0))}
                placeholder="กรอกจำนวนที่นั่งที่ต้องการ"
                className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] tabular-nums`} />
              <div className="flex flex-wrap gap-1.5">
                {[10, 25, 50, 100, 200, 500].map((n) => {
                  const isOn = spotsTotal === n;
                  return (
                    <button key={n} type="button" onClick={() => setSpotsTotal(n)}
                      className={`${font} text-[11.5px] tabular-nums px-2.5 py-1 rounded-full border cursor-pointer transition-colors ${
                        isOn ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#319754]/40"
                      }`}
                      style={{ fontWeight: 500 }}>
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
            <Select label="ระยะเวลาเปิดรับสมัคร (วัน)" required value={String(endsInDays)} onChange={(v) => setEndsInDays(Number(v) || 0)}
              options={["7", "14", "21", "30"]} />
          </div>
        </section>

        {/* Section: กลุ่มเป้าหมาย & Feedback */}
        {/* Section: คุณภาพ & เอกสาร */}
        <section id="trialprod-quality" onMouseEnter={() => { setActiveStep(4); setMaxVisitedStep((p) => Math.max(p, 4)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>คุณภาพ &amp; เอกสารรับรอง</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>ผลแล็บ, อย., โรงงาน GMP, SDS, ประกันความรับผิด</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          <div className="space-y-4">
            {/* ────── Required: FDA registration (ขึ้นก่อนเพราะสำคัญสุด) ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="เลข อย." required value={docs.fdaNumber} onChange={(v) => updDoc("fdaNumber", v)} placeholder="10-1-6200xxxxx" />
              <div>
                <DocUpload label="ใบอนุญาต อย." fileName={docs.fdaDoc}
                  onPick={() => docRefs.fdaDoc.current?.click()} onClear={() => updDoc("fdaDoc", "")} />
                <input ref={docRefs.fdaDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("fdaDoc")} />
              </div>
            </div>

            {/* ────── Required: Factory info ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input label="ชื่อโรงงานผลิต" required value={docs.factoryName} onChange={(v) => updDoc("factoryName", v)} placeholder="เช่น โรงงาน ABC Pharma" />
              <div>
                <DocUpload label="ใบรับรอง GMP โรงงาน" fileName={docs.factoryGmpDoc}
                  onPick={() => docRefs.factoryGmpDoc.current?.click()} onClear={() => updDoc("factoryGmpDoc", "")} />
                <input ref={docRefs.factoryGmpDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("factoryGmpDoc")} />
              </div>
            </div>
            <Textarea label="ที่อยู่โรงงาน" value={docs.factoryAddress} onChange={(v) => updDoc("factoryAddress", v)} rows={2} placeholder="เลขที่ ถนน แขวง/ตำบล จังหวัด รหัสไปรษณีย์" />

            {/* Subtle divider between required vs optional groups */}
            <div className="flex items-center gap-3 pt-1">
              <div className="h-px bg-gray-100 flex-1" />
              <span className={`${font} text-[11px] text-gray-400`} style={{ fontWeight: 500 }}>เอกสารเพิ่มเติม (ทางเลือก)</span>
              <div className="h-px bg-gray-100 flex-1" />
            </div>

            {/* ────── Optional: Lab result ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <DocUpload label="ผลทดสอบจากห้องแล็บ (ISO/GMP)" fileName={docs.labResult}
                  onPick={() => docRefs.labResult.current?.click()} onClear={() => updDoc("labResult", "")} />
                <input ref={docRefs.labResult} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("labResult")} />
              </div>
              <Input label="สรุปผลทดสอบสั้น ๆ" value={docs.labNote} onChange={(v) => updDoc("labNote", v)} placeholder="เช่น ผ่าน Patch Test 99%" />
            </div>

            {/* ────── Optional: SDS + Insurance ────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <DocUpload label="Safety Data Sheet (SDS)" fileName={docs.sdsDoc}
                  onPick={() => docRefs.sdsDoc.current?.click()} onClear={() => updDoc("sdsDoc", "")} />
                <input ref={docRefs.sdsDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("sdsDoc")} />
              </div>
              <div>
                <DocUpload label="ประกันความรับผิดต่อผลิตภัณฑ์" fileName={docs.insuranceDoc}
                  onPick={() => docRefs.insuranceDoc.current?.click()} onClear={() => updDoc("insuranceDoc", "")} />
                <input ref={docRefs.insuranceDoc} type="file" accept=".pdf,image/*" className="hidden" onChange={onDocFile("insuranceDoc")} />
              </div>
            </div>
            <Input label="ผู้รับประกัน (Insurance provider)" value={docs.insuranceProvider} onChange={(v) => updDoc("insuranceProvider", v)} placeholder="เช่น บริษัทประกันภัย XYZ" />
          </div>
        </section>

        <section id="trialprod-target" onMouseEnter={() => { setActiveStep(5); setMaxVisitedStep((p) => Math.max(p, 5)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Users className="size-5 text-[#319754]" strokeWidth={2.2} />
            </div>
            <div className="flex-1">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>กลุ่มเป้าหมาย</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>คุณสมบัติของ Tester ที่ต้องการ</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />
          {/* ────── Required: ข้อมูลพื้นฐาน Tester ────── */}
          <div className="bg-gradient-to-br from-[#319754]/[0.04] to-transparent border border-[#319754]/15 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="size-1.5 rounded-full bg-[#319754]" />
              <p className={`${font} text-[12px] text-[#1d5b32] uppercase tracking-wide`} style={{ fontWeight: 700 }}>ข้อมูลพื้นฐาน Tester</p>
              <span className={`${font} text-[10.5px] text-gray-500`}>· จำเป็นต้องระบุ</span>
            </div>
            <div className="space-y-4">
              <ChipGroup label="ช่วงอายุ" required selected={targetAge} onToggle={toggleAge}
                options={AGE_OPTIONS.map((a) => ({ label: a }))} />
              <ChipGroup label="เพศ" required selected={targetGender} onToggle={toggleGender}
                options={GENDER_OPTIONS.map((g) => ({ label: g }))} />
            </div>
          </div>

          {/* ────── Optional: ข้อมูลเสริม ────── */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="size-1.5 rounded-full bg-gray-400" />
              <p className={`${font} text-[12px] text-gray-600 uppercase tracking-wide`} style={{ fontWeight: 700 }}>ข้อมูลเสริม</p>
              <span className={`${font} text-[10.5px] text-gray-500`}>· ยิ่งระบุละเอียด ระบบจะ match Tester แม่นยำขึ้น</span>
            </div>
            <div className="space-y-4">
              <ChipGroup label="รูปแบบชีวิต" selected={targetLifestyle} onToggle={toggleLifestyle}
                options={LIFESTYLE_OPTIONS} />
              <div className="h-px bg-gray-100" />
              <ChipGroup label="สุขภาพ" selected={targetHealth} onToggle={toggleHealth}
                options={HEALTH_OPTIONS} />
              <div className="h-px bg-gray-100" />
              <ChipGroup label="พฤติกรรมการบริโภค" selected={targetBehavior} onToggle={toggleBehavior}
                options={BEHAVIOR_OPTIONS} />
            </div>
          </div>
        </section>

        {/* Section: สิ่งที่ต้องประเมิน */}
        <section id="trialprod-criteria" onMouseEnter={() => { setActiveStep(6); setMaxVisitedStep((p) => Math.max(p, 6)); }}
          className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)]">
          <div className="flex items-start gap-3 mb-4">
            <div className="size-10 rounded-xl bg-[#319754]/10 flex items-center justify-center shrink-0">
              <Check className="size-5 text-[#319754]" strokeWidth={2.4} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className={`${font} text-[18px] text-black leading-tight`} style={{ fontWeight: 600 }}>แบบประเมินสำหรับ Tester</h3>
              <div className="flex items-center gap-1.5 mt-1">
                <AlertCircle className="size-3.5 text-gray-400" />
                <span className={`${font} text-[12px] text-[#8e8e93]`}>ระบบจะสร้างคำถามให้อัตโนมัติตามวัตถุประสงค์ที่เลือก</span>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-100 mb-4" />

          {/* Empty-state form-style clickable card (shown when no objectives selected) */}
          {testObjectives.length === 0 && (
            <motion.button type="button"
              onClick={() => setEvalModalOpen(true)}
              whileTap={{ scale: 0.99 }}
              whileHover={{ y: -2 }}
              className="group/empty w-full bg-gradient-to-br from-[#f9fdfa] to-white border-2 border-dashed border-[#319754]/30 hover:border-[#319754] rounded-[14px] p-8 cursor-pointer transition-all flex flex-col items-center text-center hover:shadow-[0_8px_24px_-6px_rgba(49,151,84,0.2)]">
              <div className="size-14 rounded-2xl bg-[#319754]/10 group-hover/empty:bg-[#319754] flex items-center justify-center mb-3 transition-colors">
                <FileText className="size-7 text-[#319754] group-hover/empty:text-white transition-colors" strokeWidth={1.8} />
              </div>
              <p className={`${font} text-[15px] text-[#1a1a1a] mb-1`} style={{ fontWeight: 700 }}>ยังไม่มีแบบประเมิน</p>
              <p className={`${font} text-[12.5px] text-gray-500 max-w-[400px] leading-snug`}>
                คลิกที่นี่เพื่อเริ่มสร้างแบบประเมินอัตโนมัติ — เลือกวัตถุประสงค์การทดสอบ + ช่วงเวลา ระบบจะสร้างคำถามให้ทันที
              </p>
              <span className={`${font} mt-3 inline-flex items-center gap-1.5 text-[12px] text-[#319754]`} style={{ fontWeight: 600 }}>
                <Plus className="size-3.5" strokeWidth={2.6} />
                สร้างแบบประเมิน
              </span>
            </motion.button>
          )}

          {/* Document-style summary card with action buttons */}
          {testObjectives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white border border-gray-200 rounded-[14px] p-4 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {/* Decorative document corner fold */}
              <span aria-hidden className="absolute top-0 right-0 size-[20px] bg-[#319754]/10"
                style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

              {/* Header row: icon + title + actions */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="size-9 rounded-[8px] bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
                    <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`${font} text-[13.5px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>แบบประเมิน Tester</p>
                    <p className={`${font} text-[11px] text-gray-500 mt-0.5 tabular-nums`}>
                      {generatedQuestions.length} คำถาม · {activePhases.length} ฟอร์ม · {testObjectives.length} วัตถุประสงค์
                    </p>
                    {activePhases.includes("after_full") && (
                      <p className={`${font} text-[10.5px] text-[#319754] mt-1 inline-flex items-center gap-1`} style={{ fontWeight: 600 }}>
                        <Clock className="size-3" strokeWidth={2.4} />
                        ฟอร์มหลังใช้: ส่งวันที่ {evaluationDays} หลังลงทะเบียน
                      </p>
                    )}
                  </div>
                </div>
                {/* Action buttons */}
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button"
                    onClick={() => setFormPreviewOpen(true)}
                    title="ดูตัวอย่างฟอร์มที่ Tester จะเห็น"
                    className="size-8 rounded-full hover:bg-[#319754]/10 text-gray-500 hover:text-[#319754] flex items-center justify-center cursor-pointer transition-colors">
                    <Eye className="size-4" strokeWidth={2.2} />
                  </button>
                  <button type="button"
                    onClick={() => { setEvalModalOpen(true); setPreviewMode("list"); }}
                    title="แก้ไขแบบประเมิน"
                    className="size-8 rounded-full hover:bg-[#319754]/10 text-gray-500 hover:text-[#319754] flex items-center justify-center cursor-pointer transition-colors">
                    <Pencil className="size-4" strokeWidth={2.2} />
                  </button>
                  <button type="button"
                    onClick={() => {
                      if (!confirm("ต้องการลบแบบประเมินนี้ออกจริง ๆ ใช่ไหม?")) return;
                      setTestObjectives([]);
                      setWhatToTestText("");
                      toast.success("ลบแบบประเมินเรียบร้อย");
                    }}
                    title="ลบแบบประเมิน"
                    className="size-8 rounded-full hover:bg-red-50 text-gray-500 hover:text-red-600 flex items-center justify-center cursor-pointer transition-colors">
                    <Trash2 className="size-4" strokeWidth={2.2} />
                  </button>
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-3" />

              {/* Phase breakdown chips — muted neutral style */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph) => {
                  const list = questionsByPhase[ph];
                  if (!list.length) return null;
                  const meta = PHASE_META[ph];
                  return (
                    <span key={ph} className={`${font} text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-white text-gray-600`}
                      style={{ fontWeight: 500 }}>
                      {meta.label}
                      <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{list.length}</span>
                    </span>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Evaluation detail — auto-populated from generated questions, editable */}
          {testObjectives.length > 0 && (
            <div className="mt-4">
              <Textarea
                label="รายละเอียดการประเมิน"
                value={whatToTestText}
                onChange={setWhatToTestText}
                rows={6}
                placeholder="กลิ่นและเนื้อสัมผัส&#10;ผลลัพธ์ใน 14 วัน&#10;การระคายเคือง"
              />
              <p className={`${font} text-[11px] text-gray-400 mt-1`}>
                ข้อมูลถูกดึงมาจากชุดคำถามอัตโนมัติ — สามารถพิมพ์เพิ่มเติม / แก้ไขได้
              </p>
            </div>
          )}

        </section>

        </div>
      </div>

      {/* Right sidebar — sticky stepper + action buttons (matches AddProductTab) */}
      <aside className="w-[240px] shrink-0 sticky top-0 hidden lg:block">
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] flex flex-col">
          <p className={`${font} text-[11px] text-[#8e8e93] uppercase tracking-wider mb-4`} style={{ fontWeight: 600 }}>ขั้นตอนการเพิ่มสินค้า</p>
          {sections.map((s, i) => {
            const isActive = activeStep === i;
            const isLast = i === sections.length - 1;
            const isVisited = i <= maxVisitedStep;
            const showError = !isActive && isVisited && s.required && !s.valid;
            const showDone  = !isActive && isVisited && s.valid;
            return (
              <div key={s.id}>
                <motion.button onClick={() => scrollToSection(s.id, i)}
                  whileTap={{ scale: 0.98 }}
                  className={`${font} relative flex items-center gap-3 text-[14px] cursor-pointer w-full text-left rounded-xl px-2.5 py-2 transition-colors ${
                    isActive ? "" : "hover:bg-gray-50"
                  }`}>
                  {isActive && (
                    <motion.span layoutId="trialprod-step-pill"
                      className="absolute inset-0 bg-[#319754]/10 rounded-xl"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                  )}
                  <motion.span
                    initial={false}
                    animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                    transition={isActive ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 }}
                    className={`relative size-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      showDone   ? "bg-[#319754] shadow-[0_2px_4px_rgba(49,151,84,0.25)]"
                      : showError ? "bg-[#ff3b30] shadow-[0_2px_4px_rgba(255,59,48,0.25)]"
                      : isActive  ? "bg-white border-2 border-[#319754] shadow-[0_0_0_3px_rgba(49,151,84,0.15)]"
                      :             "bg-white border-2 border-gray-300"
                    }`}>
                    {showDone   ? <Check className="size-3 text-white" strokeWidth={3} />
                    : showError ? <AlertCircle className="size-3 text-white" strokeWidth={3} fill="transparent" />
                    : isActive  ? <span className="size-1.5 rounded-full bg-[#319754]" />
                    : null}
                  </motion.span>
                  <span className={`relative ${
                    isActive  ? "text-[#319754]"
                    : showDone  ? "text-gray-700"
                    : showError ? "text-[#ff3b30]"
                    :             "text-[#8e8e93]"
                  }`} style={{ fontWeight: isActive ? 600 : (showDone || showError) ? 500 : 400 }}>
                    {s.label}
                  </span>
                </motion.button>
                {!isLast && (
                  <div className={`ml-[18px] my-0.5 w-0.5 h-3 rounded-full transition-colors ${
                    showDone ? "bg-[#319754]" : "bg-gray-200"
                  }`} />
                )}
              </div>
            );
          })}

          {/* Action buttons */}
          <div className="h-px bg-gray-100 my-4" />
          <div className="flex flex-col gap-2">
            <button onClick={handleSave} disabled={!canSave}
              className={`${font} h-[44px] rounded-full text-white text-[14px] transition-colors ${canSave ? "bg-[#319754] hover:bg-[#267a43] cursor-pointer shadow-[0_4px_14px_-2px_rgba(49,151,84,0.4)]" : "bg-gray-200 text-gray-400 cursor-not-allowed"}`}
              style={{ fontWeight: 600 }}>
              บันทึกสินค้า
            </button>
            <button onClick={onBack}
              className={`${font} h-[44px] rounded-full border border-[#ff3b30] text-[#ff3b30] text-[14px] hover:bg-[#ff3b30]/5 cursor-pointer transition-colors`}
              style={{ fontWeight: 500 }}>
              ยกเลิก
            </button>
          </div>
        </div>
      </aside>

      {/* Evaluation form generator — modal popup */}
      <AnimatePresence>
        {evalModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setEvalModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[720px] bg-white rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden">
              {/* Header — minimal style matching other popups in the system */}
              <div className="sticky top-0 bg-white px-6 pt-5 pb-4 flex items-start justify-between gap-3 z-10 rounded-t-3xl">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                    <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>สร้างแบบประเมินอัตโนมัติ</h2>
                    <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>
                      วัตถุประสงค์ที่เลือก + หมวดหมู่ <span className="text-[#319754]" style={{ fontWeight: 600 }}>"{category}"</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setEvalModalOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Body — scrollable */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
                {/* Step 1: objectives */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`${font} size-6 rounded-full inline-flex items-center justify-center text-[12px] shadow-[0_2px_6px_-1px_rgba(49,151,84,0.35)] ${stagedObjectives.length > 0 ? "bg-gradient-to-br from-[#3fb56b] to-[#267a43] text-white" : "bg-gradient-to-br from-[#319754] to-[#267a43] text-white"}`} style={{ fontWeight: 700 }}>
                      {stagedObjectives.length > 0 ? <Check className="size-3.5" strokeWidth={3} /> : "1"}
                    </span>
                    <p className={`${font} text-[14.5px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>เลือกวัตถุประสงค์การทดสอบ</p>
                    <span className={`${font} text-[11px] text-gray-500`}>เลือกได้มากกว่า 1 ข้อ</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {TEST_OBJECTIVES.map((o) => {
                      const isOn = stagedObjectives.includes(o.key);
                      return (
                        <motion.div key={o.key}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setStagedObjectives((prev) => isOn ? prev.filter((k) => k !== o.key) : [...prev, o.key])}
                          className={`${font} relative bg-white border-2 rounded-[12px] p-3 text-left cursor-pointer transition-all ${
                            isOn ? "border-[#319754] shadow-[0_4px_12px_-2px_rgba(49,151,84,0.2)]" : "border-gray-200 hover:border-gray-300"
                          }`}>
                          <div className="flex items-start gap-3">
                            <span className={`size-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isOn ? "bg-[#319754]" : "bg-white border-2 border-gray-300"}`}>
                              {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className={`${font} text-[13px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>{o.label}</p>
                                {/* Info popover with example questions */}
                                <HoverCard openDelay={120} closeDelay={80}>
                                  <HoverCardTrigger asChild>
                                    <button type="button" onClick={(e) => e.stopPropagation()}
                                      className="shrink-0 text-gray-400 hover:text-[#319754] transition-colors cursor-help">
                                      <Info className="size-3.5" strokeWidth={2.2} />
                                    </button>
                                  </HoverCardTrigger>
                                  <HoverCardContent side="top" className={`${font} w-[280px] bg-white rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.18)] border border-gray-100 p-3 z-[60]`}>
                                    <p className={`${font} text-[11px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 600 }}>ตัวอย่างคำถามในแบบประเมิน</p>
                                    <ul className="space-y-1.5">
                                      {o.example.map((q, i) => (
                                        <li key={i} className="flex items-start gap-2">
                                          <span className="size-1 rounded-full mt-2 shrink-0" style={{ background: o.accent }} />
                                          <span className={`${font} text-[12px] text-gray-700 leading-snug`}>{q}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </HoverCardContent>
                                </HoverCard>
                              </div>
                              <p className={`${font} text-[11px] text-gray-500 mt-1 leading-snug`}>{o.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Step 2: which phases to send */}
                <div>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span className={`${font} size-6 rounded-full inline-flex items-center justify-center text-[12px] shadow-[0_2px_6px_-1px_rgba(49,151,84,0.35)] ${stagedPhases.length > 0 ? "bg-gradient-to-br from-[#3fb56b] to-[#267a43] text-white" : "bg-gradient-to-br from-[#319754] to-[#267a43] text-white"}`} style={{ fontWeight: 700 }}>
                      {stagedPhases.length > 0 ? <Check className="size-3.5" strokeWidth={3} /> : "2"}
                    </span>
                    <p className={`${font} text-[14.5px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>เลือกช่วงเวลาที่จะให้ Tester ประเมิน</p>
                    <span className={`${font} text-[11px] text-gray-500`}>เลือกได้มากกว่า 1 ช่วง</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {([
                      { key: "baseline" as const,   label: "ก่อนใช้สินค้า",        sub: "Baseline — ส่งฟอร์มทันทีหลังจัดส่งสินค้า" },
                      { key: "after_full" as const, label: "หลังใช้ครบกำหนด",      sub: "Final assessment — Tester จะกรอกได้หลังถึงวันที่กำหนด" },
                    ]).map((p) => {
                      const isOn = stagedPhases.includes(p.key);
                      const isAfterFull = p.key === "after_full";
                      return (
                        <div key={p.key} className={`${font} relative bg-white border-2 rounded-[12px] cursor-pointer transition-all overflow-hidden ${
                          isOn ? "border-[#319754] shadow-[0_4px_12px_-2px_rgba(49,151,84,0.2)]" : "border-gray-200 hover:border-gray-300"
                        }`}>
                          <motion.button type="button"
                            onClick={() => setStagedPhases((prev) => isOn ? prev.filter((k) => k !== p.key) : [...prev, p.key])}
                            whileTap={{ scale: 0.98 }}
                            className="w-full p-3 text-left cursor-pointer">
                            <div className="flex items-start gap-2.5">
                              <span className={`size-5 rounded-md mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isOn ? "bg-[#319754]" : "bg-white border-2 border-gray-300"}`}>
                                {isOn && <Check className="size-3 text-white" strokeWidth={3} />}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className={`${font} text-[12.5px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>{p.label}</p>
                                <p className={`${font} text-[10.5px] text-gray-500 mt-0.5 leading-snug`}>{p.sub}</p>
                              </div>
                            </div>
                          </motion.button>
                          {/* After-use day picker — only shown when phase is selected */}
                          {isAfterFull && isOn && (
                            <div className="border-t-2 border-[#319754]/15 bg-[#319754]/[0.04] px-3 py-2.5">
                              <label className={`${font} text-[10.5px] text-[#1d5b32] inline-flex items-center gap-1.5 mb-1.5`} style={{ fontWeight: 600 }}>
                                <Clock className="size-3" strokeWidth={2.4} />
                                ส่งฟอร์มให้ Tester ในวันที่
                              </label>
                              <div className="flex items-center gap-2">
                                <input type="number" min={1} max={365} value={evaluationDays || ""}
                                  onChange={(e) => setEvaluationDays(Math.max(1, Number(e.target.value) || 1))}
                                  className={`${font} bg-white border-2 border-[#319754]/20 focus:border-[#319754] rounded-lg h-9 w-20 px-3 text-[13px] text-center outline-none tabular-nums transition-colors`} />
                                <span className={`${font} text-[11.5px] text-gray-600`}>วันหลังลงทะเบียน</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-2">
                                {[7, 14, 21, 30].map((d) => (
                                  <button key={d} type="button" onClick={() => setEvaluationDays(d)}
                                    className={`${font} text-[10.5px] tabular-nums px-2 py-0.5 rounded-full border transition-colors cursor-pointer ${
                                      evaluationDays === d ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-600 hover:border-[#319754]/40"
                                    }`} style={{ fontWeight: 500 }}>
                                    {d} วัน
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className={`${font} text-[10.5px] text-gray-400 mt-2`}>💡 คำถาม "สรุปท้ายฟอร์ม" (คะแนนรวม + NPS + ความคิดเห็น) จะอยู่ในฟอร์มสุดท้ายเท่านั้น — Tester ตอบเพียงรอบเดียว</p>
                </div>

                {/* Step 3: live preview */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <span className={`${font} size-6 rounded-full inline-flex items-center justify-center text-[12px] shadow-[0_2px_6px_-1px_rgba(49,151,84,0.35)] bg-gradient-to-br from-[#3fb56b] to-[#267a43] text-white`} style={{ fontWeight: 700 }}>3</span>
                      <p className={`${font} text-[14.5px] text-[#1a1a1a]`} style={{ fontWeight: 600 }}>พรีวิวแบบประเมิน</p>
                      {stagedQuestions.length > 0 && (
                        <span className={`${font} text-[11px] text-[#319754] bg-[#319754]/10 px-2 py-0.5 rounded-full tabular-nums`} style={{ fontWeight: 600 }}>{stagedQuestions.length} คำถาม</span>
                      )}
                    </div>
                    {/* List ↔ Form toggle */}
                    {stagedObjectives.length > 0 && (
                      <div className="inline-flex items-center gap-0.5 bg-gray-100 rounded-full p-0.5">
                        {(["list", "form"] as const).map((m) => (
                          <button key={m} onClick={() => setPreviewMode(m)}
                            className={`${font} text-[11px] px-3 py-1 rounded-full cursor-pointer transition-colors ${
                              previewMode === m ? "bg-white text-[#1a1a1a] shadow-sm" : "text-gray-500 hover:text-gray-700"
                            }`}
                            style={{ fontWeight: previewMode === m ? 600 : 500 }}>
                            {m === "list" ? "📋 รายการ" : "👁 ฟอร์มจริง"}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {stagedObjectives.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center bg-gradient-to-br from-gray-50 to-white">
                      <div className="size-14 rounded-2xl bg-gray-100 mx-auto mb-3 flex items-center justify-center">
                        <FileText className="size-7 text-gray-300" strokeWidth={1.5} />
                      </div>
                      <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>เลือกวัตถุประสงค์อย่างน้อย 1 ข้อด้านบน</p>
                    </div>
                  ) : previewMode === "form" ? (
                    /* === FORM PREVIEW — ONE CARD PER FORM (Tester fills each separately) === */
                    <div className="space-y-4">
                      {(() => {
                        // Build the list of forms Tester will receive.
                        // Each selected phase = 1 form. "always" questions go ONLY on the LAST form
                        // (since they are summary questions that should be answered once at the end).
                        const alwaysList = stagedByPhase.always;
                        const selectedPhases = (["baseline", "first_use", "after_full"] as Exclude<Phase, "always">[])
                          .filter((ph) => stagedByPhase[ph].length > 0);
                        const lastPhaseIdx = selectedPhases.length - 1;
                        const forms = selectedPhases.map((ph, idx) => ({
                          phase: ph,
                          meta: PHASE_META[ph],
                          timing: ph === "baseline"
                            ? "ส่งทันทีหลังจัดส่งสินค้า"
                            : ph === "after_full"
                              ? `ส่งให้ Tester ในวันที่ ${evaluationDays} หลังลงทะเบียน`
                              : "ส่งหลังใช้ครั้งแรก",
                          questions: [
                            ...stagedByPhase[ph],
                            ...(idx === lastPhaseIdx ? alwaysList : []),
                          ],
                          isLastForm: idx === lastPhaseIdx,
                        }));

                        if (forms.length === 0) {
                          return (
                            <div className="rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/50">
                              <p className={`${font} text-[12.5px] text-gray-500`} style={{ fontWeight: 500 }}>เลือกช่วงเวลาประเมินอย่างน้อย 1 ช่วงด้านบน</p>
                            </div>
                          );
                        }

                        return forms.map((form, formIdx) => (
                          <div key={form.phase}
                            className="rounded-2xl overflow-hidden shadow-[0_8px_24px_-8px_rgba(49,151,84,0.15)] border border-[#319754]/15">
                            {/* Form header bar — distinct color per form */}
                            <div className="relative px-5 py-3.5 overflow-hidden"
                              style={{ background: `linear-gradient(135deg, ${form.meta.color}, ${form.meta.color}cc)` }}>
                              <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" strokeWidth={1.5} />
                              <div className="relative flex items-start justify-between gap-3 flex-wrap">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="size-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                                    <FileText className="size-4 text-white" strokeWidth={2.4} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className={`${font} text-[10.5px] text-white/80 uppercase tracking-wide`} style={{ fontWeight: 600 }}>
                                      ฟอร์มที่ {formIdx + 1} / {forms.length}
                                    </p>
                                    <p className={`${font} text-[14px] text-white leading-tight`} style={{ fontWeight: 700 }}>{form.meta.label}</p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1 shrink-0">
                                  <span className={`${font} inline-flex items-center gap-1 text-[10.5px] text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full`}>
                                    <Clock className="size-3" strokeWidth={2.4} />
                                    {form.timing}
                                  </span>
                                  <span className={`${font} text-[10px] text-white/75 tabular-nums`}>{form.questions.length} คำถาม</span>
                                </div>
                              </div>
                            </div>
                            {/* Form body — questions */}
                            <div className="bg-gradient-to-b from-[#fafafa] to-white p-5 space-y-3">
                              {form.questions.map((q, idx) => {
                                const qMeta = PHASE_META[q.phase];
                                const isShared = q.phase === "always";
                                return (
                                  <div key={q.id} className="bg-white rounded-xl p-3.5 border border-gray-100">
                                    <p className={`${font} text-[13px] text-[#1a1a1a] mb-2.5 flex items-start gap-2`} style={{ fontWeight: 500 }}>
                                      <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] tabular-nums shrink-0 mt-px"
                                        style={{ background: `${form.meta.color}15`, color: form.meta.color, fontWeight: 700 }}>{idx + 1}</span>
                                      <span className="flex-1">{q.label}</span>
                                      {isShared && (
                                        <span className={`${font} text-[9.5px] inline-flex items-center px-1.5 py-0.5 rounded-full shrink-0`}
                                          style={{ background: `${qMeta.color}10`, color: qMeta.color, fontWeight: 600 }}>
                                          สรุปท้ายฟอร์ม
                                        </span>
                                      )}
                                    </p>
                                    <FormFieldPreview type={q.type} options={q.options} />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : (
                    /* === LIST VIEW — compact summary, polished === */
                    <div className="rounded-2xl overflow-hidden shadow-[0_8px_24px_-8px_rgba(49,151,84,0.15)] border border-[#319754]/15">
                      {/* Header bar — phase timeline */}
                      <div className="relative bg-gradient-to-br from-[#319754] to-[#267a43] px-5 py-3.5 overflow-hidden">
                        <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" strokeWidth={1.5} />
                        <div className="relative flex items-center gap-2.5">
                          <div className="size-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Calendar className="size-4 text-white" strokeWidth={2.2} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`${font} text-[13px] text-white leading-tight`} style={{ fontWeight: 700 }}>ลำดับการส่งให้ Tester</p>
                            <p className={`${font} text-[10.5px] text-white/80 mt-0.5`}>
                              {(["baseline", "first_use", "after_full"] as Phase[])
                                .filter((ph) => stagedByPhase[ph].length > 0)
                                .map((ph, i) => `${i + 1}. ${PHASE_META[ph].label}`)
                                .join(" → ")}
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Phase groups with timeline */}
                      <div className="bg-white">
                        {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph, phIdx) => {
                          const list = stagedByPhase[ph];
                          if (!list.length) return null;
                          const meta = PHASE_META[ph];
                          return (
                            <div key={ph} className={`p-4 ${phIdx > 0 ? "border-t border-gray-100" : ""}`}>
                              {/* Phase header */}
                              <div className="flex items-center justify-between mb-2.5">
                                <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]`}
                                  style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>
                                  {meta.label}
                                </span>
                                <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{list.length} ข้อ</span>
                              </div>
                              {/* Question rows */}
                              <div className="space-y-1.5">
                                {list.map((q, idx) => (
                                  <div key={q.id} className="flex items-center justify-between gap-3 py-2 px-3 bg-gradient-to-r from-gray-50/50 to-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                      <span className={`${font} inline-flex items-center justify-center size-5 rounded-full text-[10px] tabular-nums shrink-0`}
                                        style={{ background: `${meta.color}10`, color: meta.color, fontWeight: 700 }}>{idx + 1}</span>
                                      <span className={`${font} text-[12.5px] text-[#1a1a1a]`}>{q.label}</span>
                                    </div>
                                    <span className={`${font} text-[10px] text-gray-600 px-2.5 py-0.5 rounded-full bg-gray-100 shrink-0 whitespace-nowrap`} style={{ fontWeight: 600 }}>{TYPE_LABEL[q.type]}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer — apply / cancel with summary chip */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-3 bg-gradient-to-b from-white to-gray-50/80">
                <div className="flex items-center gap-2 min-w-0">
                  <button onClick={() => setEvalModalOpen(false)}
                    className={`${font} h-10 px-5 rounded-full text-gray-600 hover:bg-gray-100 text-[13px] cursor-pointer transition-colors shrink-0`}
                    style={{ fontWeight: 500 }}>
                    ยกเลิก
                  </button>
                  {/* Summary chip — current selection at a glance */}
                  {stagedObjectives.length > 0 && (
                    <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-gray-500 truncate">
                      <span className="size-1.5 rounded-full bg-[#319754]" />
                      <span className={`${font}`}>{stagedObjectives.length} วัตถุประสงค์ · {stagedPhases.length} เฟส · {stagedQuestions.length} คำถาม</span>
                    </div>
                  )}
                </div>
                <motion.button
                  onClick={() => { setTestObjectives(stagedObjectives); setActivePhases(stagedPhases); setEvalModalOpen(false); toast.success("สร้างแบบประเมินเรียบร้อย"); }}
                  disabled={stagedObjectives.length === 0}
                  whileTap={stagedObjectives.length > 0 ? { scale: 0.97 } : undefined}
                  whileHover={stagedObjectives.length > 0 ? { y: -1 } : undefined}
                  className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full text-white text-[13px] cursor-pointer transition-shadow shrink-0 ${
                    stagedObjectives.length === 0
                      ? "bg-gray-300 cursor-not-allowed"
                      : "shadow-[0_6px_18px_-3px_rgba(49,151,84,0.5)]"
                  }`}
                  style={{
                    fontWeight: 600,
                    background: stagedObjectives.length === 0 ? undefined : "linear-gradient(135deg, #3fb56b 0%, #319754 55%, #267a43 100%)",
                  }}>
                  <Check className="size-4" strokeWidth={2.8} />
                  ใช้แบบประเมินนี้
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* DEDICATED FORM PREVIEW MODAL — read-only, what Tester will see */}
      {/* ============================================================ */}
      <AnimatePresence>
        {formPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFormPreviewOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[640px] bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 bg-white px-6 pt-5 pb-4 flex items-start justify-between gap-3 z-10 rounded-t-3xl border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                    <Eye className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>พรีวิวแบบประเมิน</h2>
                    <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>มุมมองที่ Tester จะเห็นจริง — ไม่สามารถกรอกได้</p>
                  </div>
                </div>
                <button onClick={() => setFormPreviewOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Body — pure form, grouped by phase */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fafafa] to-white px-5 py-4 space-y-5">
                {(["baseline", "first_use", "after_full", "always"] as Phase[]).map((ph) => {
                  const list = questionsByPhase[ph];
                  if (!list.length) return null;
                  const meta = PHASE_META[ph];
                  return (
                    <div key={ph}>
                      {/* Phase header */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px]`}
                          style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>
                          {meta.label}
                        </span>
                        <span className={`${font} text-[10.5px] text-gray-400 tabular-nums`}>{list.length} คำถาม</span>
                      </div>
                      <div className="space-y-3">
                        {list.map((q, idx) => (
                          <div key={q.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                            <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 500 }}>
                              <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] mr-2 tabular-nums"
                                style={{ background: `${meta.color}15`, color: meta.color, fontWeight: 700 }}>{idx + 1}</span>
                              {q.label}
                            </p>
                            <FormFieldPreview type={q.type} options={q.options} />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-3 bg-white">
                <p className={`${font} text-[11px] text-gray-500`}>
                  {generatedQuestions.length} คำถาม · {activePhases.length + 1} เฟส
                </p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setFormPreviewOpen(false)}
                    className={`${font} h-10 px-5 rounded-full text-gray-600 hover:bg-gray-100 text-[13px] cursor-pointer transition-colors`}
                    style={{ fontWeight: 500 }}>
                    ปิด
                  </button>
                  <button onClick={() => { setFormPreviewOpen(false); setEvalModalOpen(true); setPreviewMode("list"); }}
                    className={`${font} inline-flex items-center gap-1.5 h-10 px-5 rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer transition-colors shadow-[0_4px_12px_-2px_rgba(49,151,84,0.35)]`}
                    style={{ fontWeight: 600 }}>
                    <Pencil className="size-3.5" strokeWidth={2.4} />
                    แก้ไขแบบประเมิน
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Pill input — matches AddProductTab style */
function Input({ label, value, onChange, placeholder, type = "text", required = false, hint }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean; hint?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      {/* min-h forces empty hint to occupy the same vertical space as a populated one */}
      {hint !== undefined && <p className={`${font} text-[11.5px] text-gray-500 -mt-1 min-h-[17px]`}>{hint || " "}</p>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`${font} bg-[#fafafa] h-12 rounded-full px-6 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3]`} />
    </div>
  );
}
function Select({ label, value, onChange, options, required = false }: { label: string; value: string; onChange: (v: string) => void; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
        {label} {required && <span className="text-[#ff3b30]">*</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className={`${font} bg-[#fafafa] h-12 w-full rounded-full pl-6 pr-12 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow appearance-none cursor-pointer`}>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="size-4 text-gray-400 absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={2.2} />
      </div>
    </div>
  );
}
function Textarea({ label, value, onChange, rows = 3, placeholder, required = false }: { label: string; value: string; onChange: (v: string) => void; rows?: number; placeholder?: string; required?: boolean }) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
          {label} {required && <span className="text-[#ff3b30]">*</span>}
        </label>
      )}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} placeholder={placeholder}
        className={`${font} bg-[#fafafa] w-full rounded-2xl px-6 py-3 text-[14px] outline-none focus:ring-2 focus:ring-[#319754]/30 transition-shadow placeholder:text-[#a3a3a3] resize-none leading-relaxed`} />
    </div>
  );
}

/** Multi-select chip group — used by the target audience section.
 *  Selected chips are filled green with a check; unselected are bordered + emoji + label. */
function ChipGroup({ label, required, selected, onToggle, options }: {
  label: string;
  required?: boolean;
  selected: string[];
  onToggle: (k: string) => void;
  options: { label: string; emoji?: string }[];
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>
          {label} {required && <span className="text-[#ff3b30]">*</span>}
        </label>
        {selected.length > 0 && (
          <span className={`${font} text-[11.5px] text-gray-500 tabular-nums`}>{selected.length} เลือก</span>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt.label);
          return (
            <button key={opt.label} type="button" onClick={() => onToggle(opt.label)}
              className={`${font} text-[13px] inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 cursor-pointer transition-all ${
                active ? "bg-[#319754] border-[#319754] text-white" : "bg-white border-gray-200 text-gray-700 hover:border-[#319754]/40"
              }`}
              style={{ fontWeight: active ? 600 : 500 }}>
              {opt.emoji && <span className="text-[14px] leading-none">{opt.emoji}</span>}
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Inline file-upload button used for Quality & Document fields. */
function DocUpload({ label, hint, fileName, onPick, onClear }: { label: string; hint?: string; fileName: string; onPick: () => void; onClear: () => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{label}</label>
      {hint && <p className={`${font} text-[11.5px] text-gray-500 -mt-1`}>{hint}</p>}
      <button type="button" onClick={onPick}
        className={`flex items-center gap-3 h-12 px-5 rounded-full border-2 border-dashed cursor-pointer transition-colors text-left ${fileName ? "border-[#319754] bg-[#319754]/5" : "border-gray-300 hover:border-[#319754]/60 bg-[#fafafa]"}`}>
        {fileName ? <FileText className="size-4 text-[#319754] shrink-0" strokeWidth={2} /> : <Upload className="size-4 text-gray-400 shrink-0" strokeWidth={2} />}
        <span className={`${font} text-[13px] flex-1 truncate ${fileName ? "text-[#1d5b32]" : "text-gray-500"}`} style={{ fontWeight: fileName ? 600 : 500 }}>
          {fileName || "คลิกเพื่อแนบเอกสาร"}
        </span>
        {fileName && (
          <span onClick={(e) => { e.stopPropagation(); onClear(); }}
            role="button" className="size-6 rounded-full hover:bg-gray-100 flex items-center justify-center shrink-0">
            <X className="size-3.5 text-gray-500" strokeWidth={2.4} />
          </span>
        )}
      </button>
    </div>
  );
}

/** Non-interactive form-field preview — shows the Tester-facing input control
 *  for each question type so the owner knows exactly what the form will look like. */
function FormFieldPreview({ type, options }: { type: QuestionType; options?: string[] }) {
  switch (type) {
    case "scale_1_5":
      return (
        <div className="flex items-center gap-2">
          {[1,2,3,4,5].map((n) => (
            <button key={n} type="button" disabled
              className={`${font} size-10 rounded-full border-2 border-gray-200 bg-white text-[13px] text-gray-500 cursor-not-allowed transition-colors hover:border-[#319754]/40`}
              style={{ fontWeight: 600 }}>{n}</button>
          ))}
          <span className={`${font} text-[11px] text-gray-400 ml-2`}>(1 = น้อย, 5 = มาก)</span>
        </div>
      );
    case "stars_1_5":
      return (
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map((n) => (
            <span key={n} className="size-7 inline-flex items-center justify-center text-[22px] text-gray-300">★</span>
          ))}
          <span className={`${font} text-[11px] text-gray-400 ml-2`}>(แตะดาวเพื่อให้คะแนน)</span>
        </div>
      );
    case "nps_0_10":
      return (
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 11 }, (_, n) => (
            <button key={n} type="button" disabled
              className={`${font} min-w-[32px] h-9 px-2 rounded-lg border-2 border-gray-200 bg-white text-[12px] text-gray-500 cursor-not-allowed`}
              style={{ fontWeight: 600 }}>{n}</button>
          ))}
          <p className={`${font} text-[10.5px] text-gray-400 w-full mt-1 flex justify-between`}>
            <span>0 = ไม่แนะนำเลย</span><span>10 = แนะนำสุด ๆ</span>
          </p>
        </div>
      );
    case "multiple_choice":
      return (
        <div className="flex flex-col gap-2">
          {(options && options.length > 0 ? options : ["ตัวเลือกที่ 1", "ตัวเลือกที่ 2", "ตัวเลือกที่ 3"]).map((opt) => (
            <label key={opt} className="flex items-center gap-2 cursor-not-allowed">
              <span className="size-4 rounded-full border-2 border-gray-300 inline-block shrink-0" />
              <span className={`${font} text-[12.5px] text-gray-500`}>{opt}</span>
            </label>
          ))}
        </div>
      );
    case "tag":
      return (
        <div className="flex flex-wrap gap-2">
          {["นุ่ม", "ลื่น", "ฉ่ำ", "ซึมไว", "เย็น", "อื่น ๆ..."].map((t) => (
            <span key={t} className={`${font} text-[11.5px] px-3 py-1 rounded-full border-2 border-gray-200 bg-white text-gray-600`}>
              {t}
            </span>
          ))}
        </div>
      );
    case "conditional":
      return (
        <div className="flex gap-2">
          {["ไม่มี", "มี (ระบุ)"].map((opt, i) => (
            <button key={opt} type="button" disabled
              className={`${font} flex-1 h-10 rounded-lg border-2 ${i === 0 ? "border-[#319754]/30 bg-[#319754]/[0.04] text-[#1d5b32]" : "border-gray-200 bg-white text-gray-600"} text-[12.5px] cursor-not-allowed`}
              style={{ fontWeight: 500 }}>
              {opt}
            </button>
          ))}
        </div>
      );
    case "text":
      return (
        <div className="border-2 border-gray-200 rounded-lg px-3 py-2.5 bg-gray-50">
          <p className={`${font} text-[12px] text-gray-400`}>พิมพ์คำตอบที่นี่...</p>
        </div>
      );
    case "ab_choice":
      return (
        <div className="grid grid-cols-2 gap-2">
          {["สูตร A", "สูตร B"].map((opt) => (
            <button key={opt} type="button" disabled
              className={`${font} h-12 rounded-xl border-2 border-gray-200 bg-white text-gray-600 text-[13px] cursor-not-allowed`}
              style={{ fontWeight: 600 }}>
              {opt}
            </button>
          ))}
        </div>
      );
    default:
      return null;
  }
}

/** ============================================================
 *  TrialDetailModal — Hero card + 3 tabs (overview, applicants, info)
 *  ============================================================ */
function TrialDetailPage({ product, onBack, onDelete }: {
  product: TrialProduct;
  applicants: Registration[];  // unused — kept for compat with caller
  onBack: () => void;
  onDelete?: () => void;
}) {
  const [tab, setTab] = useState<"overview" | "applicants" | "info">("overview");
  /** Read-only form preview modal — shows the form Tester will see */
  const [formPreviewOpen, setFormPreviewOpen] = useState(false);

  // Live registrations — filter to this trial product so mutations (approve/reject) re-render
  const { regs, updateOne } = useAllRegistrations();
  const applicants = useMemo(
    () => regs.filter((r) => r.trialId === product.id).sort((a, b) => b.submittedAt - a.submittedAt),
    [regs, product.id]
  );

  // Filter pills state (mirrors OwnerTrialsTracking)
  type FilterKey = "all" | "pending_approval" | "approved" | "evaluated" | "rejected";
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");
  const countByStatus = (s: RegistrationStatus) => applicants.filter((r) => getRegistrationStatus(r) === s).length;
  const filteredApplicants = useMemo(() => {
    let result = applicants;
    if (filter !== "all") result = result.filter((r) => getRegistrationStatus(r) === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((r) => (r.name || "").toLowerCase().includes(q) || (r.phone || "").includes(q));
    }
    return result;
  }, [applicants, filter, search]);

  const matchReg = (target: Registration) =>
    (r: Registration) => r.trialId === target.trialId && r.name === target.name && r.submittedAt === target.submittedAt;
  const approve = (reg: Registration) => {
    updateOne(matchReg(reg), { approvedAt: Date.now() });
    toast.success("อนุมัติคำขอเรียบร้อย", { description: `${reg.name} จะได้รับสินค้าทดสอบเร็ว ๆ นี้` });
  };
  const reject = (reg: Registration) => {
    if (!confirm(`ปฏิเสธคำขอของ "${reg.name}"?`)) return;
    updateOne(matchReg(reg), { rejectedAt: Date.now() });
    toast.success("ปฏิเสธคำขอเรียบร้อย");
  };

  // Stats derived from applicants
  const evaluated = applicants.filter((r) => !!r.evaluatedAt);
  const approved = applicants.filter((r) => !!r.approvedAt && !r.rejectedAt && !r.evaluatedAt);
  const pending = applicants.filter((r) => !r.approvedAt && !r.rejectedAt && !r.evaluatedAt);
  const rejected = applicants.filter((r) => !!r.rejectedAt);
  const avgRating = evaluated.length > 0
    ? evaluated.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / evaluated.length
    : 0;
  const recommendCount = evaluated.filter((r) => r.evaluation?.wouldRecommend).length;
  const recommendPct = evaluated.length > 0 ? Math.round((recommendCount / evaluated.length) * 100) : 0;

  // Real seat count = applicants who are actively registered (approved + currently testing + evaluated)
  // Pending and rejected don't occupy a seat
  const spotsTakenReal = applicants.filter((r) => !r.rejectedAt).length;
  const spotsLeft = Math.max(0, product.spotsTotal - spotsTakenReal);
  const spotsPct = Math.round((spotsTakenReal / product.spotsTotal) * 100);

  /** Regenerate the EXACT same questions the form generator produced — driven by
   *  testObjectives + category. This guarantees preview ↔ create-modal parity:
   *  same labels, same types, same options, same phase split. */
  const previewForms = useMemo(() => {
    const objectives = product.testObjectives ?? [];
    if (objectives.length === 0) return null;
    // Use the trial's persisted activePhases. Falls back to baseline + (after_full when there
    // are evaluation days) — first_use is no longer exposed in the create-form modal so we
    // don't default it in here either, AND we hard-strip it out of any cached activePhases.
    const phases: Exclude<Phase, "always">[] = (product.activePhases && product.activePhases.length > 0
      ? product.activePhases
      : product.evaluationDays
        ? ["baseline", "after_full"]
        : ["baseline"]
    ).filter((ph) => ph !== "first_use") as Exclude<Phase, "always">[];
    const all = generateEvalQuestions(objectives, product.category)
      .filter((q) => q.phase !== "first_use" && (q.phase === "always" || phases.includes(q.phase as Exclude<Phase, "always">)));
    const groups: Record<Phase, EvalQuestion[]> = { baseline: [], first_use: [], after_full: [], always: [] };
    for (const q of all) groups[q.phase].push(q);
    const alwaysList = groups.always;
    const selected = (["baseline", "first_use", "after_full"] as Exclude<Phase, "always">[])
      .filter((ph) => groups[ph].length > 0);
    const lastIdx = selected.length - 1;
    return selected.map((ph, idx) => ({
      phase: ph,
      meta: PHASE_META[ph],
      timing: ph === "baseline"
        ? "ส่งทันทีหลังจัดส่งสินค้า"
        : ph === "after_full"
          ? `ส่งให้ Tester ในวันที่ ${product.evaluationDays} หลังลงทะเบียน`
          : "ส่งหลังใช้ครั้งแรก",
      questions: [
        ...groups[ph],
        ...(idx === lastIdx ? alwaysList : []),
      ],
      isLast: idx === lastIdx,
    }));
  }, [product.testObjectives, product.activePhases, product.category, product.evaluationDays]);

  const previewTotalCount = useMemo(
    () => previewForms ? previewForms.reduce((s, f) => s + f.questions.length, 0) : 0,
    [previewForms]
  );

  return (
    <div>
      {/* Top row: back button | edit + export */}
      <div className="flex items-center justify-between mb-5 gap-2 flex-wrap">
        <button onClick={onBack}
          className={`${font} inline-flex items-center gap-2 text-[12px] text-[#319754] bg-[#319754]/10 hover:bg-[#319754]/20 px-4 py-1.5 rounded-full cursor-pointer transition-colors`}
          style={{ fontWeight: 500 }}>
          <ChevronLeft className="size-3.5" strokeWidth={2.5} />
          กลับ
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.info(`แก้ไขสินค้า: ${product.name}`)}
            title="แก้ไขข้อมูลสินค้า"
            className={`${font} inline-flex items-center justify-center size-10 rounded-full bg-white border border-gray-200 hover:border-[#319754] hover:text-[#319754] text-gray-600 cursor-pointer transition-colors`}>
            <Pencil className="size-4" strokeWidth={2.4} />
          </button>
          <button
            onClick={() => {
              if (!onDelete) { toast.info("ฟังก์ชันลบยังไม่พร้อมใช้งาน"); return; }
              if (!confirm(`ลบสินค้าทดลอง "${product.name}"?\nการลบจะนำคุณกลับไปที่ทะเบียนสินค้าทดลอง`)) return;
              onDelete();
              toast.success(`ลบ: ${product.name}`);
              onBack();
            }}
            title="ลบสินค้าทดลอง"
            className={`${font} inline-flex items-center justify-center size-10 rounded-full bg-white border border-gray-200 hover:border-[#ff3b30] hover:text-[#ff3b30] hover:bg-[#ff3b30]/5 text-gray-600 cursor-pointer transition-colors`}>
            <Trash2 className="size-4" strokeWidth={2.4} />
          </button>
          {/* Export — popover dropdown (matches Report page pattern) */}
          <Popover>
            <PopoverTrigger asChild>
              <button aria-label="ส่งออก"
                className={`${font} inline-flex items-center gap-2 h-10 px-5 rounded-full bg-[#319754] hover:bg-[#287745] text-white text-[13px] cursor-pointer transition-shadow shadow-[0_2px_8px_rgba(49,151,84,0.25)] hover:shadow-[0_4px_14px_rgba(49,151,84,0.35)]`}
                style={{ fontWeight: 600 }}>
                <Download className="size-4" strokeWidth={2.4} />
                ส่งออก
                <ChevronDown className="size-3.5" strokeWidth={2.4} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1">
              <button onClick={() => toast.success(`ส่งออก Excel: ${product.name}`)}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileSpreadsheet className="size-4 text-[#0f7a3a]" />
                <span>Excel (.xlsx)</span>
              </button>
              <button onClick={() => toast.success(`ส่งออก PDF: ${product.name}`)}
                className={`${font} text-[13px] w-full flex items-center gap-2.5 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer`}>
                <FileText className="size-4 text-[#dc2626]" />
                <span>PDF (.pdf)</span>
              </button>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* ===== HERO CARD ===== */}
        <div className="relative bg-gradient-to-br from-[#319754] via-[#287745] to-[#1d5b32] p-4 overflow-hidden">
          <Sparkles className="absolute -top-4 -right-4 size-32 text-white/5" strokeWidth={1.5} />
          <div className="relative flex items-start gap-4">
            {/* Product image */}
            <div className="size-20 rounded-2xl overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 shrink-0">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            {/* Text info */}
            <div className="flex-1 min-w-0 pr-12">
              <p className={`${font} text-[10.5px] text-white/75 uppercase tracking-wider mb-1`} style={{ fontWeight: 600 }}>{product.category}</p>
              <h2 className={`${font} text-[18px] text-white leading-tight`} style={{ fontWeight: 700 }}>{product.name}</h2>
              <p className={`${font} text-[12px] text-white/85 mt-1 leading-snug line-clamp-2`}>{product.tagline}</p>
              {product.studioName && (
                <p className={`${font} text-[11px] text-white/70 mt-2 inline-flex items-center gap-1`}>
                  <span className="size-1.5 rounded-full bg-white/70" />
                  {product.studioName}
                </p>
              )}
            </div>
          </div>

          {/* KPI strip — minimal inline labels separated by thin dividers */}
          <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 mt-4">
            {[
              { label: "ที่นั่ง",       value: `${spotsTakenReal}/${product.spotsTotal}`, sub: `${spotsLeft} เหลือ` },
              { label: "เวลาเหลือ",     value: `${product.endsInDays}`, sub: "วัน" },
              { label: "คะแนนสะสม",     value: `${product.rewardPoints}`, sub: "pts" },
              { label: "ความพึงพอใจ",   value: avgRating > 0 ? avgRating.toFixed(1) : "—", sub: evaluated.length > 0 ? `${evaluated.length} รีวิว` : "ยังไม่มี" },
            ].map((k, i, arr) => (
              <Fragment key={k.label}>
                <div className="inline-flex items-baseline gap-1.5">
                  <span className={`${font} text-[10px] text-white/65`} style={{ fontWeight: 500 }}>{k.label}</span>
                  <span className={`${font} text-[14px] text-white tabular-nums leading-none`} style={{ fontWeight: 700 }}>{k.value}</span>
                  <span className={`${font} text-[10px] text-white/65`}>{k.sub}</span>
                </div>
                {i < arr.length - 1 && <span className="h-3 w-px bg-white/20" aria-hidden />}
              </Fragment>
            ))}
          </div>

          {/* ===== TABS NAV — white pill bar, green active ===== */}
          <div className="relative mt-4">
            <div className="inline-flex items-center gap-1 bg-white rounded-full p-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
              {([
                { key: "overview" as const,    label: "ภาพรวม",     icon: BarChart3 },
                { key: "applicants" as const,  label: "ผู้ทดลอง",     icon: Users, badge: applicants.length },
                { key: "info" as const,        label: "ข้อมูลสินค้า", icon: FileText },
              ]).map((t) => {
                const active = tab === t.key;
                return (
                  <button key={t.key} onClick={() => setTab(t.key)}
                    className={`${font} relative inline-flex items-center gap-1.5 px-4 h-[34px] rounded-full text-[12.5px] cursor-pointer transition-colors ${
                      active ? "text-white" : "text-gray-600 hover:text-gray-900"
                    }`}
                    style={{ fontWeight: active ? 700 : 500 }}>
                    {active && (
                      <motion.span layoutId="trial-detail-tab"
                        className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3fb56b] to-[#267a43] shadow-[0_2px_8px_rgba(49,151,84,0.35)]"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }} />
                    )}
                    <t.icon className="size-3.5 relative z-10" strokeWidth={2.2} />
                    <span className="relative z-10">{t.label}</span>
                    {t.badge !== undefined && t.badge > 0 && (
                      <span className={`${font} relative z-10 text-[10px] tabular-nums px-1.5 py-0.5 rounded-full ${active ? "bg-white/25 text-white" : "bg-[#ff4757] text-white"}`} style={{ fontWeight: 600 }}>{t.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ===== TAB CONTENT — no outer wrapper, content cards sit directly on page ===== */}
      <div className="mt-4">
          {tab === "overview" && (
            <TrialOverviewDashboard
              product={product}
              applicants={applicants}
              evaluated={evaluated}
              pending={pending}
              approved={approved}
              rejected={rejected}
              spotsPct={spotsPct}
              recommendPct={recommendPct}
            />
          )}

          {tab === "applicants" && (
            <div className="flex flex-col gap-4">
              {/* Filter pills + search — matches OwnerTrialsTracking style */}
              <div className="bg-white rounded-full shadow-[0px_0px_6px_0px_rgba(0,0,0,0.08)] p-1 flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1 flex-1 min-w-0 flex-wrap">
                  {([
                    { key: "all" as const,              label: "ทั้งหมด",     count: applicants.length,             icon: FlaskConical },
                    { key: "pending_approval" as const, label: "รออนุมัติ",   count: countByStatus("pending_approval"), icon: AlertCircle },
                    { key: "approved" as const,         label: "กำลังทดสอบ",  count: countByStatus("approved"),         icon: Clock },
                    { key: "evaluated" as const,        label: "ประเมินแล้ว", count: countByStatus("evaluated"),        icon: Check },
                    { key: "rejected" as const,         label: "ปฏิเสธ",      count: countByStatus("rejected"),         icon: Ban },
                  ]).map((t) => {
                    const isAct = filter === t.key;
                    return (
                      <motion.button key={t.key} onClick={() => setFilter(t.key)}
                        whileTap={{ scale: 0.94 }} whileHover={!isAct ? { scale: 1.04 } : undefined}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className={`relative flex items-center gap-2 h-[36px] pl-1.5 pr-3 rounded-full cursor-pointer shrink-0 ${!isAct ? "hover:bg-gray-50" : ""}`}>
                        {isAct && (
                          <motion.span layoutId="trialDetailApplicantFilter"
                            className="absolute inset-0 bg-[#319754] rounded-full"
                            transition={{ type: "spring", stiffness: 380, damping: 32 }} />
                        )}
                        <motion.span layout className="relative flex items-center justify-center size-[26px] rounded-full shrink-0"
                          style={{ backgroundColor: isAct ? "rgba(255,255,255,0.22)" : "#d6eadd" }}
                          transition={{ duration: 0.2 }}>
                          <t.icon className="size-[14px]" style={{ color: isAct ? "#fff" : "#319754" }} strokeWidth={2.2} />
                        </motion.span>
                        <span className={`${font} relative text-[13px] whitespace-nowrap transition-colors duration-200`}
                          style={{ color: isAct ? "#fff" : "#171717", fontWeight: isAct ? 600 : 500 }}>{t.label}</span>
                        <span className={`${font} relative text-[10px] tabular-nums px-1.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center transition-colors duration-200`}
                          style={{ backgroundColor: isAct ? "rgba(255,255,255,0.25)" : "#ff3b30", color: "#fff", fontWeight: 600 }}>{t.count}</span>
                      </motion.button>
                    );
                  })}
                </div>
                <div className="flex items-center bg-[#f5f5f5] rounded-full pl-4 pr-1 h-[36px] flex-1 min-w-0 lg:flex-none lg:w-[260px] lg:ml-auto">
                  <input
                    className={`${font} flex-1 text-[13px] outline-none bg-transparent min-w-0`}
                    placeholder="ค้นหาชื่อ, เบอร์..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="bg-[#319754] size-[28px] rounded-full cursor-pointer flex items-center justify-center shrink-0">
                    <Search className="size-4 text-white" />
                  </button>
                </div>
              </div>

              {/* Card list — uses shared RegistrationCard (correct status colors + evaluation modal) */}
              {filteredApplicants.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
                  <Users className="size-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
                  <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>ไม่มีรายการที่ตรงกับเงื่อนไข</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <AnimatePresence initial={false}>
                    {filteredApplicants.map((r, i) => (
                      <RegistrationCard
                        key={`${r.name}-${r.submittedAt}-${i}`}
                        reg={r}
                        product={product}
                        onApprove={() => approve(r)}
                        onReject={() => reject(r)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

          {tab === "info" && (
            <div className="space-y-4">
              {/* Basic info card */}
              <InfoCard title="ข้อมูลพื้นฐาน" rows={[
                { label: "ชื่อสินค้า",     value: product.name },
                { label: "หมวดหมู่",      value: product.category },
                { label: "Studio",        value: product.studioName ?? "—" },
                { label: "Tagline",       value: product.tagline },
              ]} />

              {/* Trial conditions */}
              <InfoCard title="เงื่อนไขการทดสอบ" rows={[
                { label: "จำนวนที่นั่ง",       value: `${product.spotsTotal} ที่ (เหลือ ${spotsLeft})` },
                { label: "ระยะเวลาทดสอบ",     value: `${product.endsInDays} วัน` },
                { label: "คะแนนตอบแทน",       value: `${product.rewardPoints} pts` },
              ]} />

              {/* Detail content (if exists) */}
              {product.detail?.productInfo && product.detail.productInfo.length > 0 && (
                <InfoCard title="รายละเอียดสินค้า" rows={product.detail.productInfo.map((p) => ({ label: p.label, value: p.value }))} />
              )}

              {/* Eval card — document card + รายละเอียดการประเมิน merged into one container.
                  Driven by previewForms (regenerated from testObjectives) so it stays in sync
                  with the create-form generator: same labels, types, and phase split. */}
              {previewForms && previewForms.length > 0 && (
                <div className="relative bg-white border border-gray-200 rounded-[14px] p-4 overflow-hidden">
                  {/* Decorative document corner fold */}
                  <span aria-hidden className="absolute top-0 right-0 size-[20px] bg-[#319754]/10"
                    style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />

                  {/* Header row: icon + title + count + Eye action */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="size-9 rounded-[8px] bg-gradient-to-br from-[#319754]/15 to-[#319754]/5 flex items-center justify-center shrink-0">
                      <FileText className="size-4 text-[#319754]" strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={`${font} text-[13.5px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>แบบประเมิน Tester</p>
                      <p className={`${font} text-[11px] text-gray-500 mt-0.5 tabular-nums`}>
                        {previewTotalCount} คำถาม · {previewForms.length} ฟอร์ม
                      </p>
                      {product.evaluationDays && (
                        <p className={`${font} text-[10.5px] text-[#319754] mt-1 inline-flex items-center gap-1`} style={{ fontWeight: 600 }}>
                          <Clock className="size-3" strokeWidth={2.4} />
                          ฟอร์มหลังใช้: ส่งวันที่ {product.evaluationDays} หลังลงทะเบียน
                        </p>
                      )}
                    </div>
                    <button type="button"
                      onClick={() => setFormPreviewOpen(true)}
                      title="ดูตัวอย่างฟอร์มที่ Tester จะเห็น"
                      className="size-8 rounded-full hover:bg-[#319754]/10 text-gray-500 hover:text-[#319754] flex items-center justify-center cursor-pointer transition-colors shrink-0">
                      <Eye className="size-4" strokeWidth={2.2} />
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 mb-3" />

                  {/* Form chips — one per generated form */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-4">
                    {previewForms.map((form, idx) => (
                      <span key={form.phase}
                        className={`${font} text-[11px] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-white`}
                        style={{ borderColor: `${form.meta.color}40`, color: form.meta.color, fontWeight: 600 }}>
                        ฟอร์มที่ {idx + 1} · {form.meta.label}
                        <span className={`${font} text-[10px] text-gray-400 tabular-nums`}>{form.questions.length}</span>
                      </span>
                    ))}
                  </div>

                  {/* รายละเอียดการประเมิน — one section per form */}
                  <p className={`${font} text-[12px] text-gray-500 uppercase tracking-wide mb-2`} style={{ fontWeight: 600 }}>รายละเอียดการประเมิน</p>
                  <div className="space-y-3">
                    {previewForms.map((form, idx) => (
                      <div key={form.phase} className="rounded-xl border overflow-hidden" style={{ borderColor: `${form.meta.color}25` }}>
                        <div className="px-3 py-2 flex items-center gap-2 text-[11px]"
                          style={{ background: `${form.meta.color}08`, color: form.meta.color, fontWeight: 700 }}>
                          <FileText className="size-3" strokeWidth={2.4} />
                          ฟอร์มที่ {idx + 1} · {form.meta.label}
                          <span className="text-gray-400 font-normal ml-auto">
                            {form.phase === "baseline" ? "ส่งทันที" : form.phase === "after_full" ? `วันที่ ${product.evaluationDays}` : "หลังใช้ครั้งแรก"}
                          </span>
                        </div>
                        <ul className="bg-gray-50/70 px-3.5 py-2.5 space-y-1.5">
                          {form.questions.map((q) => (
                            <li key={q.id} className={`${font} text-[12.5px] leading-relaxed inline-flex items-baseline gap-1.5 ${q.phase === "always" ? "text-gray-600" : "text-[#1a1a1a]"}`}>
                              {q.label}
                              {q.phase === "always" && (
                                <span className={`${font} text-[9.5px] px-1.5 py-0.5 rounded-full`}
                                  style={{ background: `${form.meta.color}12`, color: form.meta.color, fontWeight: 600 }}>
                                  สรุปท้ายฟอร์ม
                                </span>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      {/* ===== Form preview modal — opens from the document card Eye icon ===== */}
      <AnimatePresence>
        {formPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setFormPreviewOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[640px] bg-white rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-6 pt-5 pb-4 flex items-start justify-between gap-3 border-b border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-xl bg-[#319754]/10 flex items-center justify-center">
                    <Eye className="size-4 text-[#319754]" strokeWidth={2.2} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>พรีวิวแบบประเมิน</h2>
                    <p className={`${font} text-[11.5px] text-gray-500 mt-0.5`}>มุมมองที่ Tester จะเห็นจริง — ไม่สามารถกรอกได้</p>
                  </div>
                </div>
                <button onClick={() => setFormPreviewOpen(false)} className="size-8 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>

              {/* Body — One card per generated form. Uses the SAME generator as the
                  create-form modal so question types, options, and phase split all match. */}
              <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#fafafa] to-white px-5 py-4 space-y-4">
                {!previewForms || previewForms.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center bg-gray-50/50">
                    <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>
                      สินค้านี้ยังไม่ได้ตั้งค่าวัตถุประสงค์การทดสอบ
                    </p>
                  </div>
                ) : (
                  previewForms.map((form, formIdx) => (
                    <div key={form.phase}
                      className="rounded-2xl overflow-hidden border border-gray-100 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06)]">
                      {/* Form header — distinct color per form */}
                      <div className="relative px-5 py-3.5 overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${form.meta.color}, ${form.meta.color}cc)` }}>
                        <Sparkles className="absolute -top-2 -right-2 size-16 text-white/10" strokeWidth={1.5} />
                        <div className="relative flex items-start justify-between gap-3 flex-wrap">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="size-9 rounded-lg bg-white/25 backdrop-blur-sm flex items-center justify-center shrink-0">
                              <FileText className="size-4 text-white" strokeWidth={2.4} />
                            </div>
                            <div className="min-w-0">
                              <p className={`${font} text-[10.5px] text-white/80 uppercase tracking-wide`} style={{ fontWeight: 600 }}>
                                ฟอร์มที่ {formIdx + 1} / {previewForms.length}
                              </p>
                              <p className={`${font} text-[14px] text-white leading-tight`} style={{ fontWeight: 700 }}>{form.meta.label}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`${font} inline-flex items-center gap-1 text-[10.5px] text-white bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full`}>
                              <Clock className="size-3" strokeWidth={2.4} />
                              {form.timing}
                            </span>
                            <span className={`${font} text-[10px] text-white/75 tabular-nums`}>{form.questions.length} คำถาม</span>
                          </div>
                        </div>
                      </div>
                      {/* Form body — questions with real types */}
                      <div className="bg-gradient-to-b from-[#fafafa] to-white p-5 space-y-3">
                        {form.questions.map((q, idx) => {
                          const qMeta = PHASE_META[q.phase];
                          const isShared = q.phase === "always";
                          return (
                            <div key={q.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
                              <p className={`${font} text-[13.5px] text-[#1a1a1a] mb-3 flex items-start gap-2`} style={{ fontWeight: 500 }}>
                                <span className="inline-flex items-center justify-center size-5 rounded-full text-[10.5px] tabular-nums shrink-0 mt-px"
                                  style={{ background: `${form.meta.color}15`, color: form.meta.color, fontWeight: 700 }}>{idx + 1}</span>
                                <span className="flex-1">{q.label}</span>
                                {isShared && (
                                  <span className={`${font} text-[9.5px] inline-flex items-center px-1.5 py-0.5 rounded-full shrink-0`}
                                    style={{ background: `${qMeta.color}10`, color: qMeta.color, fontWeight: 600 }}>
                                    สรุปท้ายฟอร์ม
                                  </span>
                                )}
                              </p>
                              <FormFieldPreview type={q.type} options={q.options} />
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-100 px-6 py-3 flex items-center justify-between gap-3 bg-white">
                <p className={`${font} text-[11px] text-gray-500`}>
                  {previewForms && previewForms.length > 0
                    ? `${previewTotalCount} คำถาม · ${previewForms.length} ฟอร์ม`
                    : "ยังไม่ได้ตั้งค่า"}
                </p>
                <button onClick={() => setFormPreviewOpen(false)}
                  className={`${font} h-10 px-5 rounded-full text-gray-600 hover:bg-gray-100 text-[13px] cursor-pointer transition-colors`}
                  style={{ fontWeight: 500 }}>
                  ปิด
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Curated portrait pool — Unsplash photo IDs, deterministic per registration. */
const PORTRAIT_POOL = {
  female: [
    "photo-1494790108377-be9c29b29330",
    "photo-1544005313-94ddf0286df2",
    "photo-1517841905240-472988babdf9",
    "photo-1438761681033-6461ffad8d80",
    "photo-1531746020798-e6953c6e8e04",
    "photo-1554151228-14d9def656e4",
    "photo-1567532939604-b6b5b0db2604",
    "photo-1564087709253-a83d5f4fdb3a",
  ],
  male: [
    "photo-1507003211169-0a1dd7228f2d",
    "photo-1472099645785-5658abf4ff4e",
    "photo-1506794778202-cad84cf45f1d",
    "photo-1500648767791-00dcc994a43e",
    "photo-1539571696357-5a69c17a67c6",
    "photo-1463453091185-61582044d556",
    "photo-1568602471122-7832951cc4c5",
    "photo-1545996124-0501ebae84d0",
  ],
  lgbtq: [
    "photo-1599566150163-29194dcaad36",
    "photo-1602233158242-3ba0ac4d2167",
    "photo-1531123897727-8f129e1688ce",
    "photo-1611002831541-da4bf2bc6164",
  ],
  unknown: [
    "photo-1535713875002-d1d0cf377fde",
    "photo-1502323777036-f29e3972d82f",
    "photo-1492562080023-ab3db95bfbce",
  ],
} as const;

/** Returns a consistent Unsplash portrait URL for a registration based on name + gender. */
function portraitForApplicant(name: string, gender: string | undefined): string {
  const key = (gender || "unknown") as keyof typeof PORTRAIT_POOL;
  const pool = PORTRAIT_POOL[key] || PORTRAIT_POOL.unknown;
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  const id = pool[h % pool.length];
  return `https://images.unsplash.com/${id}?crop=faces&fit=crop&fm=jpg&w=200&h=200&q=80`;
}

/** Helpers for the 3D bar chart (matches Report page style). */
function shadeColor(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const r = Math.max(0, Math.min(255, (n >> 16) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt));
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

/** 3D-look bar shape (vertical bars) — top face lighter, right face darker, front rect for label color. */
function Bar3D(props: any) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0 || !width) return null;
  const depth = Math.min(Math.max(width * 0.28, 5), 9);
  const top = shadeColor(fill, 12);
  const right = shadeColor(fill, -18);
  return (
    <g>
      <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={right} />
      <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={top} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
}

/** 3D-look bar shape (horizontal bars) — depth scales with bar thickness (height), not length. */
function Bar3DHorizontal(props: any) {
  const { x, y, width, height, fill } = props;
  if (!height || height <= 0 || !width || width <= 0) return null;
  const depth = Math.min(Math.max(height * 0.28, 5), 9);
  const top = shadeColor(fill, 12);
  const right = shadeColor(fill, -18);
  return (
    <g>
      <path d={`M${x + width},${y} L${x + width + depth},${y - depth} L${x + width + depth},${y + height - depth} L${x + width},${y + height} Z`} fill={right} />
      <path d={`M${x},${y} L${x + depth},${y - depth} L${x + width + depth},${y - depth} L${x + width},${y} Z`} fill={top} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
}

/** ============================================================
 *  Per-question analytics — every question type gets its own stat shape
 *  and its own chart card. Stats are computed once per (question, evaluated)
 *  pair via `computeQuestionStat`; chart components below read off the
 *  matching `kind`.
 *  ============================================================ */

type ScaleBucketWithGender = { count: number; female: number; male: number; lgbtq: number; isTop: boolean };

type PerQuestionStat = {
  q: EvalQuestion;
  kind: "scale" | "nps" | "mc" | "tag" | "cond" | "text" | "ab";
  /** Number of evaluated registrations that had a non-null answer for this question. */
  responses: number;
  /** Set when kind === "scale" (covers scale_1_5 and stars_1_5). */
  scale?: { dist: Record<number, ScaleBucketWithGender>; avg: number; topAnswer: number };
  /** Set when kind === "nps". */
  nps?: { dist: number[]; score: number; promoters: number; passives: number; detractors: number };
  /** Set when kind === "mc". options preserves the question's declared order. */
  mc?: { options: string[]; counts: Record<string, number>; topOption: string | null };
  /** Set when kind === "tag". */
  tag?: { counts: Record<string, number>; total: number };
  /** Set when kind === "cond". `regsWithNotes` keeps each "มี" tester paired with their note;
   *  `noRegs` is the full list of "ไม่มี" testers so the tooltip can show demographics per side. */
  cond?: {
    yes: number; no: number; notes: string[];
    regsWithNotes: { reg: Registration; note: string }[];
    noRegs: Registration[];
  };
  /** Set when kind === "text". `samplesByReg` keeps each sample paired with its tester
   *  Registration so price-band hover popovers can show demographics. */
  text?: { samples: string[]; samplesByReg: { reg: Registration; value: string }[] };
  /** Set when kind === "ab". aRegs/bRegs are the testers who chose each formula — used to
   *  drive the hover-card demographic breakdown. */
  ab?: {
    a: number; b: number; aPct: number; bPct: number; winner: "A" | "B" | null; gap: number;
    aRegs: Registration[]; bRegs: Registration[];
  };
};

/** Read a question's answer from an Evaluation, dispatching on q.id (for always-on core
 *  questions) and q.type. Returns undefined when the tester did not answer this question. */
function readAnswer(ev: Evaluation | undefined, q: EvalQuestion): unknown {
  if (!ev) return undefined;
  if (q.id === "core_overall") return ev.overall;
  if (q.id === "core_text")    return ev.comment || undefined;
  switch (q.type) {
    case "scale_1_5":
    case "stars_1_5":
      return ev.scoreById?.[q.id] ?? ev.criteria?.[q.label];
    case "nps_0_10":
      return ev.npsScores?.[q.id];
    case "multiple_choice":
      return ev.mcAnswers?.[q.id];
    case "tag":
      return ev.tagAnswers?.[q.id];
    case "conditional":
      return ev.conditionalAnswers?.[q.id];
    case "text":
      return ev.textAnswers?.[q.id];
    case "ab_choice":
      return ev.abChoices?.[q.id];
  }
}

/** Aggregate answers across all evaluated testers for one question. */
function computeQuestionStat(q: EvalQuestion, evaluated: Registration[]): PerQuestionStat {
  switch (q.type) {
    case "scale_1_5":
    case "stars_1_5": {
      const seed = (): ScaleBucketWithGender => ({ count: 0, female: 0, male: 0, lgbtq: 0, isTop: false });
      const dist: Record<number, ScaleBucketWithGender> = { 1: seed(), 2: seed(), 3: seed(), 4: seed(), 5: seed() };
      let sum = 0, count = 0;
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q);
        if (typeof v === "number" && v >= 1 && v <= 5) {
          const b = dist[v];
          b.count++;
          if (r.gender === "female") b.female++;
          else if (r.gender === "male") b.male++;
          else if (r.gender === "lgbtq") b.lgbtq++;
          sum += v; count++;
        }
      });
      const topAnswer = [5, 4, 3, 2, 1].reduce((a, b) => dist[a].count >= dist[b].count ? a : b, 5);
      if (dist[topAnswer].count > 0) dist[topAnswer].isTop = true;
      return { q, kind: "scale", responses: count, scale: { dist, avg: count > 0 ? sum / count : 0, topAnswer } };
    }
    case "nps_0_10": {
      const dist = new Array(11).fill(0);
      let promoters = 0, passives = 0, detractors = 0, count = 0;
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q);
        if (typeof v === "number" && v >= 0 && v <= 10) {
          dist[v]++;
          count++;
          if (v >= 9) promoters++;
          else if (v >= 7) passives++;
          else detractors++;
        }
      });
      const score = count > 0 ? Math.round(((promoters - detractors) / count) * 100) : 0;
      return { q, kind: "nps", responses: count, nps: { dist, score, promoters, passives, detractors } };
    }
    case "multiple_choice": {
      const options = q.options ?? [];
      const counts: Record<string, number> = {};
      options.forEach((o) => { counts[o] = 0; });
      let total = 0;
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q);
        if (typeof v === "string" && v.length > 0) {
          counts[v] = (counts[v] ?? 0) + 1;
          total++;
        }
      });
      let topOption: string | null = null;
      let topCount = 0;
      options.forEach((o) => { if ((counts[o] ?? 0) > topCount) { topOption = o; topCount = counts[o]; } });
      return { q, kind: "mc", responses: total, mc: { options, counts, topOption } };
    }
    case "tag": {
      const counts: Record<string, number> = {};
      let total = 0;
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q);
        if (Array.isArray(v)) {
          v.forEach((t) => {
            if (typeof t === "string" && t.length > 0) {
              counts[t] = (counts[t] ?? 0) + 1;
            }
          });
          if (v.length > 0) total++;
        }
      });
      return { q, kind: "tag", responses: total, tag: { counts, total } };
    }
    case "conditional": {
      let yes = 0, no = 0;
      const notes: string[] = [];
      const regsWithNotes: { reg: Registration; note: string }[] = [];
      const noRegs: Registration[] = [];
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q) as ConditionalAnswer | undefined;
        if (v) {
          if (v.has) {
            yes++;
            const note = v.note?.trim() ?? "";
            if (note) notes.push(note);
            regsWithNotes.push({ reg: r, note });
          } else {
            no++;
            noRegs.push(r);
          }
        }
      });
      return { q, kind: "cond", responses: yes + no, cond: { yes, no, notes, regsWithNotes, noRegs } };
    }
    case "text": {
      const samples: string[] = [];
      const samplesByReg: { reg: Registration; value: string }[] = [];
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q);
        if (typeof v === "string" && v.trim().length > 0) {
          const trimmed = v.trim();
          samples.push(trimmed);
          samplesByReg.push({ reg: r, value: trimmed });
        }
      });
      return { q, kind: "text", responses: samples.length, text: { samples, samplesByReg } };
    }
    case "ab_choice": {
      const aRegs: Registration[] = [];
      const bRegs: Registration[] = [];
      evaluated.forEach((r) => {
        const v = readAnswer(r.evaluation, q);
        if (v === "A") aRegs.push(r);
        else if (v === "B") bRegs.push(r);
      });
      const a = aRegs.length;
      const b = bRegs.length;
      const total = a + b;
      const aPct = total > 0 ? Math.round((a / total) * 100) : 0;
      const bPct = total > 0 ? Math.round((b / total) * 100) : 0;
      const winner: "A" | "B" | null = total === 0 ? null : a > b ? "A" : b > a ? "B" : null;
      return { q, kind: "ab", responses: total, ab: { a, b, aPct, bPct, winner, gap: Math.abs(aPct - bPct), aRegs, bRegs } };
    }
  }
}

/** Visual recipe per phase — phase header + accent color. */
const PHASE_RECIPE: Record<Phase, { label: string; emoji: string; color: string; timing: (days?: number) => string }> = {
  baseline:   { label: "ก่อนใช้สินค้า",     emoji: "📝", color: "#3b82f6", timing: () => "ส่งทันทีหลังจัดส่ง" },
  first_use:  { label: "ระหว่างใช้",        emoji: "✨", color: "#a855f7", timing: () => "ส่งหลังใช้ครั้งแรก" },
  after_full: { label: "หลังใช้ครบกำหนด",  emoji: "🎯", color: "#319754", timing: (d) => d ? `ส่งวันที่ ${d}` : "หลังใช้ครบ" },
  always:     { label: "สรุปท้ายฟอร์ม",    emoji: "⭐", color: "#f59e0b", timing: () => "จบทุกฟอร์ม" },
};

/** Per-type minimum-N thresholds. Below these the card renders in muted style with a
 *  low-data badge — keeps charts from claiming statistical conclusions on n=1. */
const RESPONSE_FLOOR: Record<PerQuestionStat["kind"], number> = {
  scale: 5,
  nps: 8,
  mc: 5,
  tag: 5,
  cond: 5,
  text: 1,
  ab: 6,
};

/** Visual recipe per question type — used by chart headers. */
const TYPE_BADGE: Record<PerQuestionStat["kind"], { label: string; bg: string; color: string }> = {
  scale: { label: "Scale 1-5",  bg: "#319754",  color: "#319754"  },
  nps:   { label: "NPS 0-10",   bg: "#f59e0b",  color: "#a16207"  },
  mc:    { label: "ตัวเลือก",     bg: "#3b82f6",  color: "#1d4ed8"  },
  tag:   { label: "แท็ก",        bg: "#06b6d4",  color: "#0e7490"  },
  cond:  { label: "ใช่/ไม่ใช่",    bg: "#ef4444",  color: "#b91c1c"  },
  text:  { label: "ข้อความ",     bg: "#6b7280",  color: "#374151"  },
  ab:    { label: "A/B",        bg: "#8b5cf6",  color: "#6d28d9"  },
};

/** Low-data badge — rendered in card headers when responses < per-type floor. */
function LowDataBadge({ n }: { n: number }) {
  return (
    <span className={`${font} inline-flex items-center gap-1 text-[9.5px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 shrink-0`}
      style={{ fontWeight: 600 }}>
      n={n} ตัวอย่างน้อย
    </span>
  );
}

/** Header bar shared by every question card — label only (type badge removed per design). */
function QuestionCardHeader({ stat }: { stat: PerQuestionStat }) {
  const floor = RESPONSE_FLOOR[stat.kind];
  return (
    <div className="flex items-start justify-between gap-2 mb-3 flex-wrap">
      <p className={`${font} text-[13px] text-[#1a1a1a] line-clamp-2 flex-1 min-w-0`} style={{ fontWeight: 600 }}>
        {stat.q.label}
      </p>
      {stat.responses > 0 && stat.responses < floor && (
        <div className="shrink-0"><LowDataBadge n={stat.responses} /></div>
      )}
    </div>
  );
}

/** Empty-state card body — rendered when nobody answered this question yet. */
function EmptyAnswerState({ message = "ยังไม่มีข้อมูล" }: { message?: string }) {
  return (
    <div className="bg-gray-50/60 rounded-lg py-6 text-center">
      <p className={`${font} text-[11.5px] text-gray-400 italic`}>{message}</p>
    </div>
  );
}

/** ===== Per-type chart bodies ===== */

function ScaleHistogramBody({ stat, accentColor }: { stat: PerQuestionStat; accentColor: string }) {
  if (!stat.scale || stat.responses === 0) return <EmptyAnswerState />;
  const { dist, avg, topAnswer } = stat.scale;
  const isStar = stat.q.type === "stars_1_5";
  // Compact row layout (mirrors McOptionBarsBody) — saves ~50px per card vs the
  // previous 170px Recharts horizontal histogram, since empty buckets no longer
  // take the same vertical footprint as filled ones.
  const maxCount = Math.max(1, ...[1, 2, 3, 4, 5].map((n) => dist[n].count));
  return (
    <>
      <div className="flex items-center justify-end mb-2">
        <div className={`${font} inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-100 text-amber-700 text-[11px]`} style={{ fontWeight: 700 }}>
          <Star className="size-3 fill-amber-500 text-amber-500" strokeWidth={0} />
          <span className="tabular-nums">{avg.toFixed(1)}</span>
          <span className="text-amber-500 font-normal text-[10px]">{isStar ? "ดาว" : "/5"}</span>
        </div>
      </div>
      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((n) => {
          const b = dist[n];
          const pct = stat.responses > 0 ? Math.round((b.count / stat.responses) * 100) : 0;
          const isTop = n === topAnswer && b.count > 0;
          const barPct = (b.count / maxCount) * 100;
          // Title attr surfaces the gender breakdown on hover without a separate tooltip
          // component (keeps the row compact).
          const breakdownTitle = b.count > 0
            ? `${n} ${isStar ? "ดาว" : "คะแนน"} · ${b.count} คน (${pct}%)` +
              [
                b.female > 0 ? `\nหญิง ${b.female}` : "",
                b.male > 0 ? `\nชาย ${b.male}` : "",
                b.lgbtq > 0 ? `\nLGBTQ+ ${b.lgbtq}` : "",
              ].join("")
            : `${n} ${isStar ? "ดาว" : "คะแนน"} · ไม่มีผู้ตอบ`;
          return (
            <div key={n} className="flex items-center gap-2" title={breakdownTitle}>
              <span className={`${font} w-3 text-[10.5px] text-gray-500 tabular-nums shrink-0 text-center`} style={{ fontWeight: 600 }}>{n}</span>
              <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full transition-all"
                  style={{ width: `${barPct}%`, background: isTop ? accentColor : "#fbbf24" }} />
              </div>
              <span className={`${font} text-[10.5px] tabular-nums shrink-0 w-[58px] text-right`}
                style={{ color: isTop ? accentColor : "#6b7280", fontWeight: 700 }}>
                {b.count}<span className="text-gray-400 font-normal ml-1">({pct}%)</span>
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
}

function NpsBreakdownBody({ stat }: { stat: PerQuestionStat }) {
  if (!stat.nps || stat.responses === 0) return <EmptyAnswerState />;
  const { dist, score, promoters, passives, detractors } = stat.nps;
  const promotersPct = stat.responses > 0 ? Math.round((promoters / stat.responses) * 100) : 0;
  const passivesPct = stat.responses > 0 ? Math.round((passives / stat.responses) * 100) : 0;
  const detractorsPct = stat.responses > 0 ? Math.round((detractors / stat.responses) * 100) : 0;
  const chartData = dist.map((c, i) => ({
    label: String(i), count: c,
    color: i <= 6 ? "#ef4444" : i <= 8 ? "#fbbf24" : "#319754",
  }));
  return (
    <>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barCategoryGap="14%">
          <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
          <YAxis hide allowDecimals={false} />
          <RechartsTooltip
            cursor={{ fill: "rgba(148,163,184,0.08)" }}
            content={({ active, payload, label }: any) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload;
              const seg = Number(label) <= 6 ? "Detractor" : Number(label) <= 8 ? "Passive" : "Promoter";
              return (
                <div className={`${font} bg-white rounded-lg shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] border border-gray-100 p-2 min-w-[100px]`}>
                  <p className="text-[11px]" style={{ fontWeight: 700 }}>{label} · {d.count} คน</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{seg}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {[
          { label: "Promoters", value: promotersPct, color: "#319754", sub: `${promoters} คน` },
          { label: "Passives",  value: passivesPct,  color: "#fbbf24", sub: `${passives} คน` },
          { label: "Detractors",value: detractorsPct,color: "#ef4444", sub: `${detractors} คน` },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-gray-100 px-2 py-2 text-center">
            <p className={`${font} text-[18px] tabular-nums`} style={{ fontWeight: 700, color: s.color }}>{s.value}%</p>
            <p className={`${font} text-[10.5px] text-gray-600`} style={{ fontWeight: 600 }}>{s.label}</p>
            <p className={`${font} text-[9.5px] text-gray-400 tabular-nums`}>{s.sub}</p>
          </div>
        ))}
      </div>
      <div className="mt-2 flex items-center justify-center">
        <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] tabular-nums`}
          style={{ background: score >= 30 ? "#31975412" : score >= 0 ? "#fbbf2412" : "#ef444412",
                   color: score >= 30 ? "#319754" : score >= 0 ? "#a16207" : "#b91c1c",
                   fontWeight: 700 }}>
          NPS = {score > 0 ? `+${score}` : score}
        </span>
      </div>
    </>
  );
}

function McOptionBarsBody({ stat, accentColor }: { stat: PerQuestionStat; accentColor: string }) {
  if (!stat.mc || stat.responses === 0) return <EmptyAnswerState />;
  const { options, counts, topOption } = stat.mc;
  const sorted = [...options].sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0));
  const maxCount = Math.max(1, ...sorted.map((o) => counts[o] ?? 0));
  return (
    <div className="space-y-1.5">
      {sorted.map((opt) => {
        const c = counts[opt] ?? 0;
        const pct = stat.responses > 0 ? Math.round((c / stat.responses) * 100) : 0;
        const isTop = opt === topOption && c > 0;
        const barPct = (c / maxCount) * 100;
        return (
          <div key={opt} className="bg-white rounded-lg border border-gray-100 px-2.5 py-1.5">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className={`${font} text-[11.5px] text-[#1a1a1a] line-clamp-1 flex-1`} style={{ fontWeight: isTop ? 700 : 500 }}>
                {opt}
              </p>
              <span className={`${font} text-[10.5px] tabular-nums shrink-0`} style={{ color: isTop ? accentColor : "#6b7280", fontWeight: 700 }}>
                {c} <span className="text-gray-400 font-normal">({pct}%)</span>
              </span>
            </div>
            <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full transition-all"
                style={{ width: `${barPct}%`, background: isTop ? accentColor : "#cbd5e1" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TagCloudBody({ stat, accentColor }: { stat: PerQuestionStat; accentColor: string }) {
  if (!stat.tag || stat.responses === 0) return <EmptyAnswerState />;
  const entries = Object.entries(stat.tag.counts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(1, ...entries.map((e) => e[1]));
  return (
    <div className="flex flex-wrap gap-1.5">
      {entries.map(([tag, count]) => {
        const intensity = count / maxCount;
        const isTop = count === maxCount;
        return (
          <span key={tag}
            className={`${font} inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] tabular-nums`}
            style={{
              background: isTop ? accentColor : `${accentColor}${Math.round(8 + intensity * 20).toString(16).padStart(2, "0")}`,
              color: isTop ? "white" : accentColor,
              fontWeight: isTop ? 700 : 600,
            }}>
            {tag} <span className="opacity-80 text-[10.5px]">· {count}</span>
          </span>
        );
      })}
    </div>
  );
}

function ConditionalDonutBody({ stat }: { stat: PerQuestionStat }) {
  const [checkModalOpen, setCheckModalOpen] = useState(false);
  if (!stat.cond || stat.responses === 0) return <EmptyAnswerState />;
  const { yes, no, regsWithNotes } = stat.cond;
  const total = yes + no;
  const yesPct = total > 0 ? Math.round((yes / total) * 100) : 0;
  const isSafe = yes === 0;
  const centerColor = isSafe ? "#15803d" : "#dc2626";
  // SVG gradient IDs are scoped per stat.q.id so multiple conditional cards on the page
  // don't collide via the global <defs> namespace.
  const safeId = `condSafe-${stat.q.id}`;
  const riskId = `condRisk-${stat.q.id}`;
  const haloId = `condHalo-${stat.q.id}`;
  const noPct = total > 0 ? Math.round((no / total) * 100) : 0;
  // Gradient slice fills — clinical palette but with subtle depth so the chart doesn't read flat
  const data = [
    { name: "ไม่มี", value: no,  fill: `url(#${safeId})`, tone: "safe" as const },
    { name: "มี",    value: yes, fill: `url(#${riskId})`, tone: "risk" as const },
  ];
  // Sample notes — show up to 2 in the tooltip when hovering the "มี" slice
  const sampleNotes = regsWithNotes
    .filter((x) => x.note.trim().length > 0)
    .slice(0, 2)
    .map((x) => ({ name: x.reg.name, note: x.note }));
  const CondTooltip = (p: any) => {
    if (!p.active || !p.payload || !p.payload.length) return null;
    const d = p.payload[0]?.payload as { name: string; value: number; tone: "safe" | "risk" };
    if (!d) return null;
    const isRisk = d.tone === "risk";
    const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
    const ringColor = isRisk ? "#dc2626" : "#16a34a";
    const bgColor = isRisk ? "#fef2f2" : "#f0fdf4";
    const textColor = isRisk ? "#b91c1c" : "#15803d";
    return (
      <div className={`${font} bg-white rounded-xl shadow-[0_8px_24px_-4px_rgba(0,0,0,0.16)] border border-gray-100 px-3 py-2.5 min-w-[160px]`}>
        <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
          <span className="size-2 rounded-full shrink-0" style={{ background: ringColor }} />
          <span className="text-[12px] text-[#1a1a1a]" style={{ fontWeight: 700 }}>{isRisk ? "มีอาการ" : "ไม่มีอาการ"}</span>
        </div>
        <div className="flex items-baseline gap-2 mt-1.5">
          <span className="text-[16px] tabular-nums leading-none" style={{ fontWeight: 800, color: textColor }}>{d.value}</span>
          <span className="text-[10px] text-gray-500">คน · {pct}%</span>
        </div>
        {isRisk && sampleNotes.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 space-y-1.5" style={{ background: bgColor, borderRadius: 8, padding: 6 }}>
            {sampleNotes.map((s) => (
              <div key={s.name} className="text-[10.5px] text-gray-700">
                <span style={{ fontWeight: 600 }}>{s.name}:</span> <span className="text-gray-600">{s.note.slice(0, 60)}{s.note.length > 60 ? "…" : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="space-y-2.5">
      {/* ===== DONUT (editorial) — chart left, big % gradient right ===== */}
      <div className="flex items-center gap-4">
        {/* Donut + soft halo */}
        <div className="relative size-[120px] shrink-0">
          {/* Outer soft glow */}
          <div className="absolute -inset-2 rounded-full pointer-events-none" aria-hidden
            style={{
              background: yes > 0
                ? "radial-gradient(circle, rgba(220,38,38,0.10) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 70%)",
            }} />
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                <linearGradient id={safeId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#bbf7d0" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
                <linearGradient id={riskId} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%"   stopColor="#fca5a5" />
                  <stop offset="100%" stopColor="#b91c1c" />
                </linearGradient>
              </defs>
              {/* Background ring — gives unfilled portion a subtle quiet tone */}
              <Pie data={[{ v: 1 }]} dataKey="v" innerRadius={40} outerRadius={54}
                startAngle={0} endAngle={360} fill="#f3f4f6" stroke="none" isAnimationActive={false} />
              <Pie data={data} dataKey="value" innerRadius={40} outerRadius={56}
                startAngle={90} endAngle={-270} stroke="#ffffff" strokeWidth={3}
                animationBegin={0} animationDuration={900}
                cornerRadius={8} paddingAngle={3}>
                {data.map((d, i) => <Cell key={i} fill={d.fill} style={{ cursor: "pointer" }} />)}
              </Pie>
              <RechartsTooltip content={<CondTooltip />} cursor={false} wrapperStyle={{ outline: "none", zIndex: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center — N/total denominator */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={`${font} text-[20px] tabular-nums leading-none tracking-tight`}
              style={{ fontWeight: 800, color: "#1a1a1a" }}>
              {yes}<span className="text-gray-400 font-normal">/</span>{total}
            </motion.p>
            <p className={`${font} text-[8.5px] uppercase mt-1 text-gray-400`}
              style={{ fontWeight: 600, letterSpacing: "0.14em" }}>
              Tester
            </p>
          </div>
        </div>

        {/* Right column — eyebrow + big editorial % + mini legend */}
        <div className="flex-1 min-w-0">
          <motion.div
            initial={{ opacity: 0, x: 6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}>
            <p className={`${font} text-[10px] uppercase text-gray-400`} style={{ fontWeight: 600, letterSpacing: "0.14em" }}>
              อัตรารายงาน
            </p>
            <p className={`${font} text-[38px] tabular-nums leading-[1.05] tracking-tight mt-0.5`}
              style={{
                fontWeight: 800,
                background: yes > 0
                  ? "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)"
                  : "linear-gradient(135deg, #16a34a 0%, #14532d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
              {yesPct}<span className="text-[20px]" style={{ fontWeight: 700 }}>%</span>
            </p>
            <div className="flex items-center gap-2.5 mt-2">
              <span className="inline-flex items-center gap-1 text-[11px] tabular-nums text-gray-600" style={{ fontWeight: 500 }}>
                <span className="size-1.5 rounded-full bg-[#16a34a]" />
                {no} ไม่มี
              </span>
              <span className="text-gray-200">·</span>
              <span className="inline-flex items-center gap-1 text-[11px] tabular-nums" style={{ fontWeight: 600, color: yes > 0 ? "#b91c1c" : "#9ca3af" }}>
                <span className="size-1.5 rounded-full" style={{ background: yes > 0 ? "#dc2626" : "#d1d5db" }} />
                {yes} มี
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ===== Thin ratio bar tying donut + numbers together ===== */}
      <div className="h-1.5 rounded-full overflow-hidden bg-gray-100 flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${noPct}%` }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
          style={{ background: "linear-gradient(90deg, #bbf7d0 0%, #16a34a 100%)" }} />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${yesPct}%` }}
          transition={{ duration: 0.7, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="h-full"
          style={{ background: yes > 0 ? "linear-gradient(90deg, #fca5a5 0%, #b91c1c 100%)" : "transparent" }} />
      </div>

      {/* ===== CTA — refined pill with pulsing alarm badge ===== */}
      {yes > 0 && (
        <motion.button
          type="button"
          onClick={() => setCheckModalOpen(true)}
          whileTap={{ scale: 0.99 }}
          whileHover={{ y: -1 }}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.5 }}
          className={`${font} group/cta w-full rounded-xl bg-gradient-to-br from-[#fef2f2] via-[#fef2f2] to-[#fee2e2] hover:from-[#fee2e2] hover:to-[#fecaca] border border-red-100 text-[#991b1b] px-3.5 py-2 text-[12px] flex items-center justify-between cursor-pointer transition-all shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_1px_0_rgba(185,28,28,0.04)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_6px_16px_-4px_rgba(185,28,28,0.2)]`}
          style={{ fontWeight: 600 }}>
          <span className="inline-flex items-center gap-2">
            <span className="size-5 rounded-md bg-red-100 inline-flex items-center justify-center">
              <AlertTriangle className="size-3 text-[#b91c1c]" strokeWidth={2.6} />
            </span>
            ต้องตรวจสอบเพิ่มเติม
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="relative inline-flex">
              <motion.span
                className="absolute inset-0 rounded-md bg-red-500"
                animate={{ opacity: [0.55, 0, 0.55] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                aria-hidden />
              <span className="relative bg-gradient-to-br from-red-500 to-red-700 text-white rounded-md px-1.5 text-[11px] tabular-nums leading-[18px] shadow-[0_1px_2px_rgba(0,0,0,0.1)]" style={{ fontWeight: 800 }}>{yes}</span>
            </span>
            <ChevronRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5" strokeWidth={2.4} />
          </span>
        </motion.button>
      )}

      {/* ===== ต้องตรวจสอบ — modal listing every tester who reported a symptom ===== */}
      <AnimatePresence>
        {checkModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setCheckModalOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-[560px] w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)]">
              {/* Header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0 flex items-start gap-2.5">
                  <div className="size-8 rounded-xl bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="size-4 text-red-600" strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>รายการต้องตรวจสอบ</h2>
                    <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>Tester {yes} คน รายงานอาการระหว่างทดสอบ</p>
                  </div>
                </div>
                <button onClick={() => setCheckModalOpen(false)} aria-label="ปิด"
                  className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0">
                  <X className="size-4" strokeWidth={2.4} />
                </button>
              </div>
              {/* Body — list of testers who reported symptoms */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 bg-gradient-to-b from-gray-50/40 to-white">
                {regsWithNotes.length === 0 ? (
                  <p className={`${font} text-[12px] text-gray-400 italic text-center py-8`}>ยังไม่มีรายงาน</p>
                ) : (
                  regsWithNotes.map(({ reg, note }) => (
                    <div key={`${reg.name}-${reg.submittedAt}`} className="bg-gray-50 rounded-xl px-3 py-2.5">
                      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200/70">
                        <div className="size-7 rounded-full overflow-hidden shrink-0 border border-gray-200">
                          <img src={portraitForApplicant(reg.name, reg.gender)} alt={reg.name} loading="lazy" className="w-full h-full object-cover" />
                        </div>
                        <p className={`${font} text-[12.5px] text-[#1a1a1a] truncate flex-1`} style={{ fontWeight: 600 }}>{reg.name}</p>
                        <span className={`${font} inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] shrink-0 bg-red-50 text-red-700`} style={{ fontWeight: 700 }}>
                          <AlertTriangle className="size-2.5" strokeWidth={2.6} />
                          มีอาการ
                        </span>
                      </div>
                      <p className={`${font} text-[12px] text-gray-700 leading-relaxed mt-2`}>
                        {note || <span className="text-gray-400 italic">ไม่ได้ระบุรายละเอียด</span>}
                      </p>
                    </div>
                  ))
                )}
              </div>
              {/* Footer */}
              <div className="px-5 py-3 border-t border-gray-100 flex justify-end bg-white">
                <button onClick={() => setCheckModalOpen(false)}
                  className={`${font} h-9 px-4 rounded-full text-gray-700 text-[12.5px] hover:bg-gray-100 cursor-pointer transition-colors`}
                  style={{ fontWeight: 500 }}>
                  ปิด
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TextSamplesBody({ stat }: { stat: PerQuestionStat }) {
  if (!stat.text || stat.responses === 0) return <EmptyAnswerState />;
  const { samples } = stat.text;
  // For mkt_price, parse the amounts and render a podium-style arch pillar visual.
  const isPriceQ = stat.q.id === "mkt_price";
  const amounts = isPriceQ
    ? samples.map((s) => Number(s.replace(/[^\d.]/g, ""))).filter((n) => !isNaN(n) && n > 0).sort((a, b) => a - b)
    : [];
  const median = amounts.length > 0 ? amounts[Math.floor(amounts.length / 2)] : 0;
  if (isPriceQ && amounts.length > 0) {
    const lo = amounts[0];
    const hi = amounts[amounts.length - 1];
    // Percentage of total = roughly how many testers wrote a price in that band.
    const loCount = amounts.filter((a) => a <= lo + (hi - lo) * 0.25).length;
    const hiCount = amounts.filter((a) => a >= hi - (hi - lo) * 0.25).length;
    const midCount = amounts.length - loCount - hiCount;
    const total = amounts.length;
    const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;
    // Pillar heights are data-driven by percentage: tallest = max-pct band, others scale
    // proportionally. Subtle colour tint per band (rose / green / amber) replaces the
    // uniform gray. Shape-distinct coin piles still clip at the card's bottom edge.
    const pcts = [pct(loCount), pct(midCount), pct(hiCount)];
    const maxPctVal = Math.max(1, ...pcts);
    const BASE_H = 150;
    const MAX_H = 280;
    const heightFor = (p: number) => Math.round(BASE_H + (p / maxPctVal) * (MAX_H - BASE_H));
    // Group sampled testers into the same lo/mid/hi bands the pillars represent so each
    // pillar's hover popover can show who answered what.
    const samplesByReg = stat.text?.samplesByReg ?? [];
    const loThreshold = lo + (hi - lo) * 0.25;
    const hiThreshold = hi - (hi - lo) * 0.25;
    const parseAmt = (s: string) => Number(s.replace(/[^\d.]/g, ""));
    const inBand = (band: "lo" | "mid" | "hi") => samplesByReg.filter(({ value }) => {
      const v = parseAmt(value);
      if (isNaN(v) || v <= 0) return false;
      if (band === "lo") return v <= loThreshold;
      if (band === "hi") return v >= hiThreshold;
      return v > loThreshold && v < hiThreshold;
    });
    const pillars = [
      { value: `฿${lo}`,     label: "ต่ำสุด", pct: pcts[0], height: heightFor(pcts[0]),
        color: "linear-gradient(180deg, #FFE4E6 0%, #FECDD3 55%, #FDA4AF 100%)",
        accent: "#e11d48",
        coin: imgCoinLow,  coinW: "w-[88%]", coinOverflow: "-bottom-8",
        regs: inBand("lo") },
      { value: `฿${median}`, label: "กลาง",   pct: pcts[1], height: heightFor(pcts[1]),
        color: "linear-gradient(180deg, #D1FAE5 0%, #A7F3D0 55%, #6EE7B7 100%)",
        accent: "#059669",
        coin: imgCoinMid,  coinW: "w-[88%]", coinOverflow: "-bottom-4",
        regs: inBand("mid") },
      { value: `฿${hi}`,     label: "สูงสุด", pct: pcts[2], height: heightFor(pcts[2]),
        color: "linear-gradient(180deg, #DBEAFE 0%, #BFDBFE 55%, #93C5FD 100%)",
        accent: "#2563eb",
        coin: imgCoinHigh, coinW: "w-[78%]", coinOverflow: "-bottom-5",
        regs: inBand("hi") },
    ];
    return (
      // Negative margins push the podium row to the card's true edges (negating the parent's p-5),
      // and overflow-hidden + rounded-b-2xl clips coin piles at the card's bottom-rounded edge.
      <div className="-mx-5 -mb-5 overflow-hidden rounded-b-2xl">
        <div className="grid grid-cols-3 gap-2 items-end px-5">
          {pillars.map((p) => {
            // Per-band demographics computed from the testers whose ฿ answer falls in this range.
            const female = p.regs.filter((x) => x.reg.gender === "female").length;
            const male   = p.regs.filter((x) => x.reg.gender === "male").length;
            const lgbtq  = p.regs.filter((x) => x.reg.gender === "lgbtq").length;
            const ageBreak = (["15-24", "25-34", "35-44", "45-54", "55+"] as const)
              .map((ar) => ({ range: ar, cnt: p.regs.filter((x) => x.reg.ageRange === ar).length }))
              .filter((a) => a.cnt > 0);
            const sortedPrices = [...p.regs]
              .map((x) => parseAmt(x.value))
              .filter((v) => !isNaN(v) && v > 0)
              .sort((a, b) => a - b);
            const bandMin = sortedPrices[0];
            const bandMax = sortedPrices[sortedPrices.length - 1];
            const bandAvg = sortedPrices.length > 0
              ? Math.round(sortedPrices.reduce((s, v) => s + v, 0) / sortedPrices.length)
              : 0;
            return (
              <HoverCard key={p.label} openDelay={120} closeDelay={60}>
                <HoverCardTrigger asChild>
                  {/* Entrance: rise + fade-in, staggered by pillar index. Hovering the pillar
                      propagates the "hover" variant to the coin (parent itself stays still). */}
                  <motion.div
                    variants={{
                      initial: { opacity: 0, y: 24 },
                      animate: { opacity: 1, y: 0 },
                      hover:   {},  // empty — parent doesn't move; just sets state for children
                    }}
                    initial="initial"
                    animate="animate"
                    whileHover="hover"
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 * pillars.indexOf(p) }}
                    className="group/pillar relative mx-auto w-full cursor-default"
                    style={{
                      maxWidth: "111px",
                      height: `${p.height}px`,
                      borderTopLeftRadius: "9999px",
                      borderTopRightRadius: "9999px",
                      background: p.color,
                      boxShadow: `0 4px 18px -8px ${p.accent}30`,
                    }}>
                    {/* Hover glow overlay — soft radial highlight on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover/pillar:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(ellipse at top, ${p.accent}18 0%, transparent 60%)`,
                        borderTopLeftRadius: "9999px",
                        borderTopRightRadius: "9999px",
                      }} />
                    {/* Top content stack — ฿amount, label, % chip */}
                    <div className="absolute inset-x-0 top-0 pt-7 flex flex-col items-center">
                      <p className={`${font} text-[15px] tabular-nums text-center leading-none`} style={{ fontWeight: 700, color: "#101828" }}>{p.value}</p>
                      <p className={`${font} text-[10px] mt-1.5 text-center`} style={{ fontWeight: 400, color: "#101828" }}>{p.label}</p>
                      <span className={`${font} mt-1.5 inline-flex items-center justify-center rounded-2xl text-[10px] tabular-nums`}
                        style={{ background: "rgba(0,0,0,0.05)", color: "#101828", fontWeight: 400, minWidth: "38px", height: "22px", padding: "0 8px" }}>
                        {p.pct}%
                      </span>
                    </div>
                    {/* Coin pile — animation triggers via PARENT pillar's hover state
                        (Framer Motion variant propagation). Hovering anywhere on the dome
                        fires the bouncy lift + rotate. */}
                    <motion.div
                      className={`${p.coinW} ${p.coinOverflow} absolute left-1/2 -translate-x-1/2 select-none pointer-events-none`}
                      variants={{
                        initial: { scale: 1, y: 0, rotate: 0 },
                        animate: { scale: 1, y: 0, rotate: 0 },
                        hover:   { scale: 1.12, y: -10, rotate: [0, -6, 4, 0] },
                      }}
                      transition={{
                        scale:  { type: "spring", stiffness: 280, damping: 18 },
                        y:      { type: "spring", stiffness: 280, damping: 18 },
                        rotate: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                      }}
                      style={{ transformOrigin: "bottom center" }}>
                      {/* Soft glow plate behind the coin */}
                      <div className="absolute inset-x-2 bottom-1 h-3 rounded-full blur-md opacity-40"
                        style={{ background: p.accent }} />
                      <img src={p.coin} alt="" aria-hidden
                        className="relative w-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.18)]"
                        style={{
                          maskImage: "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.6) 78%, transparent 100%)",
                          WebkitMaskImage: "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.6) 78%, transparent 100%)",
                        }} />
                    </motion.div>
                  </motion.div>
                </HoverCardTrigger>
                <HoverCardContent side="top" align="center" sideOffset={8}
                  className="w-[260px] p-3 bg-white rounded-xl shadow-[0_18px_40px_-10px_rgba(0,0,0,0.18)] border border-gray-100">
                  {/* Title row */}
                  <div className="flex items-center gap-2 mb-2.5">
                    <div className="size-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${p.accent}15` }}>
                      <span className={`${font} text-[12px] tabular-nums`} style={{ fontWeight: 800, color: p.accent }}>฿</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`${font} text-[12px]`} style={{ fontWeight: 700, color: p.accent }}>ราคา{p.label}</p>
                      <p className={`${font} text-[10px] text-gray-500 tabular-nums`}>{p.regs.length} จาก {samplesByReg.length} คน · {p.pct}%</p>
                    </div>
                  </div>
                  {p.regs.length === 0 ? (
                    <p className={`${font} text-[11px] text-gray-400 italic text-center py-2`}>ยังไม่มีผู้ตอบในช่วงนี้</p>
                  ) : (
                    <>
                      {/* Price stats — min / avg / max */}
                      <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                        {[
                          { label: "ต่ำสุด", v: `฿${bandMin}` },
                          { label: "เฉลี่ย", v: `฿${bandAvg}` },
                          { label: "สูงสุด", v: `฿${bandMax}` },
                        ].map((s) => (
                          <div key={s.label} className="rounded-lg border px-1.5 py-1 text-center"
                            style={{ background: `${p.accent}08`, borderColor: `${p.accent}25` }}>
                            <p className={`${font} text-[12px] tabular-nums leading-none`} style={{ fontWeight: 700, color: p.accent }}>{s.v}</p>
                            <p className={`${font} text-[9px] text-gray-500 mt-0.5`}>{s.label}</p>
                          </div>
                        ))}
                      </div>
                      {/* Demographics */}
                      {(female + male + lgbtq) > 0 && (
                        <>
                          <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 700 }}>เพศของผู้ตอบ</p>
                          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-2">
                            {female > 0 && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-pink-500" /> หญิง {female}</span>}
                            {male > 0   && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-blue-500" /> ชาย {male}</span>}
                            {lgbtq > 0  && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-purple-500" /> LGBTQ+ {lgbtq}</span>}
                          </div>
                        </>
                      )}
                      {ageBreak.length > 0 && (
                        <>
                          <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 700 }}>ช่วงอายุ</p>
                          <div className="flex flex-wrap gap-1.5">
                            {ageBreak.map((a) => (
                              <span key={a.range} className={`${font} inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tabular-nums`}
                                style={{ background: `${p.accent}12`, color: p.accent, fontWeight: 700 }}>
                                {a.range} · {a.cnt}
                              </span>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <div className="space-y-1.5">
        {samples.slice(0, 4).map((t, i) => (
          <div key={i} className={`${font} text-[11.5px] text-gray-700 italic leading-relaxed bg-gray-50/70 rounded-md px-2.5 py-2 border border-gray-100 line-clamp-2`}>
            "{t}"
          </div>
        ))}
      </div>
      {samples.length > 4 && (
        <p className={`${font} text-[10.5px] text-gray-400 text-center tabular-nums`}>+{samples.length - 4} คำตอบเพิ่มเติม</p>
      )}
    </div>
  );
}

function AbSplitBarBody({ stat }: { stat: PerQuestionStat }) {
  if (!stat.ab || stat.responses === 0) return <EmptyAnswerState />;
  const { a, b, aPct, bPct, winner, gap, aRegs, bRegs } = stat.ab;
  // Hover-popover content — gender + age breakdown for one side of the A/B vote.
  const sideHoverContent = (side: "A" | "B", regs: Registration[], pct: number, color: string) => {
    const female = regs.filter((r) => r.gender === "female").length;
    const male   = regs.filter((r) => r.gender === "male").length;
    const lgbtq  = regs.filter((r) => r.gender === "lgbtq").length;
    const ageBreak = (["15-24", "25-34", "35-44", "45-54", "55+"] as const)
      .map((ar) => ({ range: ar, cnt: regs.filter((r) => r.ageRange === ar).length }))
      .filter((x) => x.cnt > 0);
    return (
      <HoverCardContent side="top" align="center" sideOffset={8}
        className="w-[240px] p-3 bg-white rounded-xl shadow-[0_18px_40px_-10px_rgba(0,0,0,0.18)] border border-gray-100">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="size-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${color}15`, color, fontWeight: 800 }}>
            <span className={`${font} text-[13px]`}>{side}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`${font} text-[12px]`} style={{ fontWeight: 700, color }}>สูตร {side}</p>
            <p className={`${font} text-[10px] text-gray-500 tabular-nums`}>{regs.length} จาก {stat.responses} คน · {pct}%</p>
          </div>
        </div>
        {(female + male + lgbtq) > 0 && (
          <>
            <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 700 }}>เพศของผู้ตอบ</p>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-2">
              {female > 0 && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-pink-500" /> หญิง {female}</span>}
              {male > 0   && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-blue-500" /> ชาย {male}</span>}
              {lgbtq > 0  && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-purple-500" /> LGBTQ+ {lgbtq}</span>}
            </div>
          </>
        )}
        {ageBreak.length > 0 && (
          <>
            <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 700 }}>ช่วงอายุ</p>
            <div className="flex flex-wrap gap-1.5">
              {ageBreak.map((x) => (
                <span key={x.range} className={`${font} inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tabular-nums`}
                  style={{ background: `${color}12`, color, fontWeight: 700 }}>
                  {x.range} · {x.cnt}
                </span>
              ))}
            </div>
          </>
        )}
        {regs.length === 0 && (
          <p className={`${font} text-[11px] text-gray-400 italic text-center py-2`}>ยังไม่มีผู้เลือกสูตรนี้</p>
        )}
      </HoverCardContent>
    );
  };
  return (
    // Figma node 7707:3492 layout — two large dark percentages with a tiny 'vs' in the middle,
    // two thin colored pill bars below, and the winner pill centered at the bottom.
    // Each side is hoverable to surface demographic breakdown.
    <div className="space-y-3">
      {/* Top row — % + caption, with 'vs' floating in the middle */}
      <div className="grid grid-cols-2 gap-x-4 relative items-end">
        <span className={`${font} absolute left-1/2 -translate-x-1/2 top-1.5 text-[11px] text-gray-300 uppercase tracking-wider`} style={{ fontWeight: 600 }}>
          vs
        </span>
        <HoverCard openDelay={120} closeDelay={60}>
          <HoverCardTrigger asChild>
            <div className="text-center cursor-default">
              <p className={`${font} text-[28px] tabular-nums leading-none`} style={{ fontWeight: 800, color: "#3b82f6" }}>{aPct}%</p>
              <p className={`${font} text-[11px] text-gray-500 mt-1.5`} style={{ fontWeight: 500 }}>สูตร A · {a} คน</p>
            </div>
          </HoverCardTrigger>
          {sideHoverContent("A", aRegs, aPct, "#3b82f6")}
        </HoverCard>
        <HoverCard openDelay={120} closeDelay={60}>
          <HoverCardTrigger asChild>
            <div className="text-center cursor-default">
              <p className={`${font} text-[28px] tabular-nums leading-none`} style={{ fontWeight: 800, color: "#319754" }}>{bPct}%</p>
              <p className={`${font} text-[11px] text-gray-500 mt-1.5`} style={{ fontWeight: 500 }}>สูตร B · {b} คน</p>
            </div>
          </HoverCardTrigger>
          {sideHoverContent("B", bRegs, bPct, "#319754")}
        </HoverCard>
      </div>
      {/* Two thin pills — one under each side, colored by formula (A=blue, B=green) */}
      <div className="grid grid-cols-2 gap-x-4">
        <div className="h-2 rounded-full transition-all" style={{ background: "#3b82f6" }} />
        <div className="h-2 rounded-full transition-all" style={{ background: "#319754" }} />
      </div>
      {/* Winner pill — neutral gray tag centered at the bottom (Figma) */}
      {winner && (
        <div className="flex items-center justify-center pt-1">
          <span className={`${font} inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px]`}
            style={{ background: "#F3F4F6", color: "#1a1a1a", fontWeight: 600 }}>
            สูตร {winner} ชนะ +{gap}%
          </span>
        </div>
      )}
    </div>
  );
}

/** Card body — dispatches on stat.kind. */
function QuestionCardBody({ stat, accentColor }: { stat: PerQuestionStat; accentColor: string }) {
  switch (stat.kind) {
    case "scale": return <ScaleHistogramBody stat={stat} accentColor={accentColor} />;
    case "nps":   return <NpsBreakdownBody stat={stat} />;
    case "mc":    return <McOptionBarsBody stat={stat} accentColor={accentColor} />;
    case "tag":   return <TagCloudBody stat={stat} accentColor={accentColor} />;
    case "cond":  return <ConditionalDonutBody stat={stat} />;
    case "text":  return <TextSamplesBody stat={stat} />;
    case "ab":    return <AbSplitBarBody stat={stat} />;
  }
}

/** ============================================================
 *  Trial detail overview dashboard — drives all widgets from the
 *  evaluation form structure (per-question stats) plus demographics
 *  (gender, age) so the owner can analyse who answered what.
 *  ============================================================ */
function TrialOverviewDashboard({ product, applicants, evaluated, pending, approved, rejected, spotsPct, recommendPct }: {
  product: TrialProduct;
  applicants: Registration[];
  evaluated: Registration[];
  pending: Registration[];
  approved: Registration[];
  rejected: Registration[];
  spotsPct: number;
  recommendPct: number;
}) {
  /** Pagination state for the bottom "ความคิดเห็นเพิ่มเติม" 4-col grid. */
  /** Modal toggle for "ดูเพิ่มเติม" button on the ab_diff list (ความแตกต่าง). */
  const [abDiffModalOpen, setAbDiffModalOpen] = useState(false);
  /** Modal toggle for "ดูเพิ่มเติม" button on the comments list (คำแนะนำเพิ่มเติม). */
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  /** Per-question stats — driven by `generateEvalQuestions` so each card knows its question
   *  type and can render the right chart. Falls back to whatToTest as scale-only labels for
   *  legacy products without testObjectives. */
  const perQuestionStats = useMemo<PerQuestionStat[]>(() => {
    // Honor the trial's activePhases — the create-form modal no longer exposes "first_use"
    // as a selectable phase, so dashboards for trials that don't include it must hide it too.
    // Always-on questions (core_overall / core_nps / core_text) always render regardless of
    // which phases the owner picked. `first_use` is HARD-EXCLUDED everywhere so legacy/cached
    // trials that still carry it in activePhases don't leak the section into the dashboard.
    const phases: Exclude<Phase, "always">[] = (product.activePhases && product.activePhases.length > 0
      ? product.activePhases
      : product.evaluationDays
        ? ["baseline", "after_full"]
        : ["baseline"]
    ).filter((ph) => ph !== "first_use") as Exclude<Phase, "always">[];
    const raw: EvalQuestion[] = product.testObjectives && product.testObjectives.length > 0
      ? generateEvalQuestions(product.testObjectives, product.category)
      : product.whatToTest.map((label, i) => ({
          id: `legacy_${i}`,
          label,
          type: "scale_1_5" as const,
          phase: "baseline" as const,
          objective: "efficacy" as const,
        }));
    // `core_overall` + `core_nps` show in the side-by-side hero cards above; `core_text`
    // is rendered as the dedicated "คำแนะนำเพิ่มเติม" 4-col + pagination section at the
    // bottom. Strip all three from the per-question grid so nothing is shown twice.
    const questions = raw.filter((q) =>
      q.phase !== "first_use"
      && q.id !== "core_overall"
      && q.id !== "core_nps"
      && q.id !== "core_text"
      && (q.phase === "always" || phases.includes(q.phase as Exclude<Phase, "always">))
    );
    return questions.map((q) => computeQuestionStat(q, evaluated));
  }, [evaluated, product.testObjectives, product.activePhases, product.category, product.evaluationDays, product.whatToTest]);

  /** Group cards by phase so the dashboard doesn't render as a 20-card scroll wall. */
  const groupedByPhase = useMemo(() => {
    const groups: Record<Phase, PerQuestionStat[]> = { baseline: [], first_use: [], after_full: [], always: [] };
    perQuestionStats.forEach((s) => { groups[s.q.phase].push(s); });
    return groups;
  }, [perQuestionStats]);

  /** Phases that actually have questions — render section in this order.
   *  `first_use` intentionally omitted: the create-form modal has retired it, so the
   *  dashboard never surfaces it either even if a legacy trial still carries it. */
  const phasesWithData = (["baseline", "after_full", "always"] as Phase[])
    .filter((ph) => groupedByPhase[ph].length > 0);

  /** Gender breakdown across all applicants */
  const genderStats = useMemo(() => {
    const counts: Record<string, number> = { male: 0, female: 0, lgbtq: 0, unknown: 0 };
    applicants.forEach((r) => {
      const g = r.gender || "unknown";
      counts[g] = (counts[g] || 0) + 1;
    });
    return counts;
  }, [applicants]);

  /** Age range breakdown across all applicants */
  const ageStats = useMemo(() => {
    const ranges = ["15-24", "25-34", "35-44", "45-54", "55+"] as const;
    const counts: Record<string, number> = {};
    ranges.forEach((r) => { counts[r] = 0; });
    let unknown = 0;
    applicants.forEach((r) => {
      if (r.ageRange && ranges.includes(r.ageRange)) counts[r.ageRange]++;
      else unknown++;
    });
    return { ranges: [...ranges], counts, unknown };
  }, [applicants]);

  const recommendCount = evaluated.filter((r) => r.evaluation?.wouldRecommend).length;

  // Average overall rating (for hero stat)
  const avgOverall = evaluated.length > 0
    ? evaluated.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / evaluated.length
    : 0;

  return (
    <div className="space-y-4">
      {/* Demographics — gender donut + age bars side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Gender — Figma design: 4 pastel circles + 3D illustrations clipped by card edge */}
        <div className="bg-white rounded-2xl border border-gray-100 pt-5 px-5 pb-0 overflow-hidden">
          <div className="mb-4">
            <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>เพศของผู้ทดลอง</h3>
            <p className={`${font} text-[12px] text-gray-500 mt-1`}>สัดส่วนเพศของ Tester ทั้งหมดในการทดลองนี้ — hover ดูรายละเอียดเพิ่มเติม</p>
          </div>
          {applicants.length === 0 ? (
            <p className={`${font} text-[12px] text-gray-400 italic pb-5`}>ยังไม่มีข้อมูล</p>
          ) : (
            <div className="grid grid-cols-4 gap-3 items-end">
              {([
                { key: "female",  label: "หญิง",   bg: "#fbcfe8", accent: "#ec4899", text: "#1a1a1a", img: genderWomenImg, scale: 1 },
                { key: "male",    label: "ชาย",     bg: "#bfdbfe", accent: "#3b82f6", text: "#1a1a1a", img: genderMenImg,   scale: 1 },
                { key: "lgbtq",   label: "LGBTQ+", bg: "#e9d5ff", accent: "#a855f7", text: "#1a1a1a", img: genderLgbtqImg, scale: 1 },
                { key: "unknown", label: "อื่นๆ",   bg: "#e5e7eb", accent: "#6b7280", text: "#1a1a1a", img: genderOtherImg, scale: 1 },
              ] as const).map((g) => {
                const cnt = genderStats[g.key] || 0;
                const pct = applicants.length > 0 ? Math.round((cnt / applicants.length) * 100) : 0;
                // Demographic breakdown for this gender
                const groupApplicants = applicants.filter((r) => (r.gender || "unknown") === g.key);
                const evaluatedInGroup = groupApplicants.filter((r) => !!r.evaluatedAt);
                const recommendInGroup = evaluatedInGroup.filter((r) => r.evaluation?.wouldRecommend).length;
                const recommendPctInGroup = evaluatedInGroup.length > 0 ? Math.round((recommendInGroup / evaluatedInGroup.length) * 100) : 0;
                const avgRatingInGroup = evaluatedInGroup.length > 0
                  ? evaluatedInGroup.reduce((s, r) => s + (r.evaluation?.overall ?? 0), 0) / evaluatedInGroup.length
                  : 0;
                const ageBreakdown = ["15-24", "25-34", "35-44", "45-54", "55+"]
                  .map((ar) => ({ range: ar, cnt: groupApplicants.filter((r) => r.ageRange === ar).length }))
                  .filter((a) => a.cnt > 0)
                  .sort((a, b) => b.cnt - a.cnt);
                const topAge = ageBreakdown[0];
                return (
                  <HoverCard key={g.key} openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="group/gender relative flex flex-col items-center cursor-pointer">
                        {/* Pastel circle — animated lift + brighten on hover */}
                        <motion.div
                          whileHover={{ y: -4 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                          className="relative w-[78%] aspect-square rounded-full flex flex-col items-center justify-center px-2 transition-shadow group-hover/gender:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.15)]"
                          style={{ background: g.bg }}>
                          <p className={`${font} text-[13px] text-center transition-colors`} style={{ color: g.text, fontWeight: 500 }}>{g.label}</p>
                          <p className={`${font} text-[26px] tabular-nums leading-none my-1.5 transition-colors`} style={{ color: g.text, fontWeight: 700 }}>{cnt}</p>
                          <p className={`${font} text-[12px] tabular-nums`} style={{ color: g.text, fontWeight: 500 }}>{pct}%</p>
                        </motion.div>
                        {/* Bigger illustration — fades out at the bottom */}
                        <motion.img src={g.img} alt={g.label}
                          whileHover={{ scale: g.scale * 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 280, damping: 22 }}
                          className="relative z-10 w-full h-auto pointer-events-none select-none -mt-[45%]"
                          style={{
                            aspectRatio: "1 / 1",
                            objectFit: "contain",
                            objectPosition: "bottom",
                            transform: `scale(${g.scale})`,
                            transformOrigin: "bottom center",
                            WebkitMaskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)",
                            maskImage: "linear-gradient(to bottom, #000 60%, transparent 100%)",
                          }} />
                      </div>
                    </HoverCardTrigger>
                    {cnt > 0 && (
                      <HoverCardContent side="top" align="center" sideOffset={8}
                        className="bg-white text-[#1a1a1a] border border-gray-100 rounded-xl px-3.5 py-2.5 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] min-w-[240px]">
                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                          <span className="size-2.5 rounded-full shrink-0" style={{ background: g.accent }} />
                          <p className={`${font} text-[13px]`} style={{ color: g.accent, fontWeight: 700 }}>{g.label}</p>
                          <span className={`${font} text-[10.5px] text-gray-400 tabular-nums ml-auto`}>{cnt}/{applicants.length} · {pct}%</span>
                        </div>
                        <div className="space-y-1.5">
                          {topAge && (
                            <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                              <span className="inline-flex items-center gap-1.5"><Calendar className="size-3 text-gray-400" strokeWidth={2.2} />อายุส่วนใหญ่</span>
                              <span className="tabular-nums text-[#1a1a1a]" style={{ fontWeight: 600 }}>{topAge.range} ({topAge.cnt} คน)</span>
                            </div>
                          )}
                          {evaluatedInGroup.length > 0 && (
                            <>
                              <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                                <span className="inline-flex items-center gap-1.5"><Check className="size-3 text-gray-400" strokeWidth={2.4} />ประเมินแล้ว</span>
                                <span className="tabular-nums text-[#1a1a1a]" style={{ fontWeight: 600 }}>{evaluatedInGroup.length}/{cnt} คน</span>
                              </div>
                              <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                                <span className="inline-flex items-center gap-1.5"><Star className="size-3 fill-amber-400 text-amber-400" strokeWidth={0} />คะแนนเฉลี่ย</span>
                                <span className="tabular-nums text-amber-700" style={{ fontWeight: 700 }}>{avgRatingInGroup.toFixed(1)}/5</span>
                              </div>
                              <div className={`${font} text-[11px] text-gray-700 flex items-center justify-between gap-3`}>
                                <span className="inline-flex items-center gap-1.5"><ThumbsUp className="size-3 text-gray-400" strokeWidth={2.2} />แนะนำ</span>
                                <span className="tabular-nums text-[#319754]" style={{ fontWeight: 700 }}>{recommendInGroup}/{evaluatedInGroup.length} ({recommendPctInGroup}%)</span>
                              </div>
                            </>
                          )}
                        </div>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Age range bars */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="mb-4">
            <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>ช่วงอายุของผู้ทดลอง</h3>
            <p className={`${font} text-[12px] text-gray-500 mt-1`}>การกระจายตัวของช่วงอายุ Tester — กลุ่มที่ใหญ่ที่สุดถูกเน้นเป็นสีเขียว</p>
          </div>
          {applicants.length === 0 ? (
            <p className={`${font} text-[12px] text-gray-400 italic`}>ยังไม่มีข้อมูล</p>
          ) : (() => {
            const maxCnt = Math.max(...ageStats.ranges.map((r) => ageStats.counts[r] || 0));
            const chartData = ageStats.ranges.map((r) => ({
              label: r,
              count: ageStats.counts[r] || 0,
              isMax: (ageStats.counts[r] || 0) === maxCnt && maxCnt > 0,
            }));
            return (
              <div>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} margin={{ top: 20, right: 20, left: 0, bottom: 10 }} barCategoryGap="22%">
                    <CartesianGrid strokeDasharray="4 6" stroke="#eef2f6" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} tickMargin={12} />
                    <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} width={32} allowDecimals={false} />
                    <RechartsTooltip
                      cursor={{ fill: "rgba(148,163,184,0.08)" }}
                      content={({ active, payload, label }: any) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload;
                        const pct = applicants.length > 0 ? Math.round((d.count / applicants.length) * 100) : 0;
                        return (
                          <div className={`${font} bg-white rounded-xl shadow-[0_8px_28px_rgba(0,0,0,0.12)] border border-gray-100 p-3 min-w-[160px]`}>
                            <p className="text-[12px] text-gray-500 mb-2" style={{ fontWeight: 500 }}>ช่วงอายุ {label}</p>
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-[12.5px] text-gray-600 inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#319754]" />ผู้ทดลอง
                              </span>
                              <span className="text-[13.5px] tabular-nums text-[#319754]" style={{ fontWeight: 700 }}>{d.count} คน ({pct}%)</span>
                            </div>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="count" name="จำนวนผู้ทดลอง" maxBarSize={48} animationDuration={700} shape={<Bar3D />}>
                      {chartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.isMax ? "#319754" : "#9ca3af"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {ageStats.unknown > 0 && (
                  <p className={`${font} text-[10.5px] text-gray-400 italic mt-2 pt-2 border-t border-gray-100`}>ไม่ระบุอายุ: {ageStats.unknown} คน</p>
                )}
              </div>
            );
          })()}
        </div>
      </div>

      {/* Per-question evaluation analytics — driven by product.whatToTest */}
      {evaluated.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
          <div className="size-14 rounded-2xl bg-gray-50 mx-auto mb-3 flex items-center justify-center">
            <BarChart3 className="size-7 text-gray-300" strokeWidth={1.5} />
          </div>
          <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 600 }}>ยังไม่มีผลประเมินจาก Tester</p>
          <p className={`${font} text-[11.5px] text-gray-400 mt-1 max-w-[300px] mx-auto`}>เมื่อ Tester ส่งแบบประเมินเข้ามา ระบบจะวิเคราะห์คำตอบรายข้อให้ที่นี่</p>
        </div>
      ) : (
        <>
          {/* Overall + NPS — promoted ABOVE the per-question grid so the two headline metrics
              hit the owner first, before drilling into per-question detail. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Card 1 — Overall rating vertical bar chart */}
              {(() => {
                const counts = [1, 2, 3, 4, 5].map((star) => {
                  const respondents = evaluated.filter((r) => r.evaluation?.overall === star);
                  return {
                    star,
                    cnt: respondents.length,
                    female: respondents.filter((r) => r.gender === "female").length,
                    male: respondents.filter((r) => r.gender === "male").length,
                    lgbtq: respondents.filter((r) => r.gender === "lgbtq").length,
                    ageBreakdown: ["15-24", "25-34", "35-44", "45-54", "55+"].map((ar) => ({
                      range: ar,
                      cnt: respondents.filter((r) => r.ageRange === ar).length,
                    })).filter((a) => a.cnt > 0),
                  };
                });
                const max = Math.max(1, ...counts.map((c) => c.cnt));
                const topStar = counts.reduce((a, b) => (a.cnt >= b.cnt ? a : b)).star;
                return (
                  // flex col + h-full so the chart can stretch to fill whatever height the
                  // NPS card sets (grid row is auto-equalised by `grid-cols-2`).
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>ความพึงพอใจโดยรวม</h3>
                        <p className={`${font} text-[12px] text-gray-500 mt-1`}>การกระจายคะแนนดาว 1-5 จากผู้ตอบทั้งหมด — hover แท่งเพื่อดูข้อมูลผู้ตอบ</p>
                      </div>
                      <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] tabular-nums bg-amber-50 text-amber-700 shrink-0`} style={{ fontWeight: 600 }}>
                        {evaluated.length} ผู้ตอบ
                      </span>
                    </div>
                    <div className="relative flex-1 flex flex-col">
                      <div className="flex items-end gap-2 flex-1 min-h-[220px] pb-9">
                        {counts.map(({ star, cnt, female, male, lgbtq, ageBreakdown }) => {
                          const pct = evaluated.length > 0 ? Math.round((cnt / evaluated.length) * 100) : 0;
                          const heightPct = (cnt / max) * 100;
                          const isTop = star === topStar && cnt > 0;
                          return (
                            <div key={star} className="group/vbar relative flex-1 flex flex-col items-center justify-end h-full min-w-0">
                              {/* Count number above stars */}
                              {cnt > 0 && (
                                <span className={`${font} text-[12px] tabular-nums ${isTop ? "text-amber-700" : "text-[#1a1a1a]"}`} style={{ fontWeight: isTop ? 700 : 600 }}>
                                  {cnt}
                                </span>
                              )}
                              {/* Stars row — only filled stars, centered with bar */}
                              <div className="flex items-center justify-center gap-px mt-0.5 mb-1.5 w-full flex-wrap">
                                {Array.from({ length: star }).map((_, i) => (
                                  <Star key={i} className="size-3 fill-amber-500 text-amber-500 shrink-0" strokeWidth={0} />
                                ))}
                              </div>
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${heightPct}%` }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className={`w-full rounded-t-md cursor-pointer transition-all ${isTop ? "bg-gradient-to-b from-amber-300 to-amber-500 group-hover/vbar:from-amber-400 group-hover/vbar:to-amber-600" : "bg-gradient-to-b from-amber-200/70 to-amber-300/70 group-hover/vbar:from-amber-300 group-hover/vbar:to-amber-400"}`}
                                style={{ minHeight: cnt > 0 ? "8px" : "0" }} />
                              {/* Tooltip — white theme */}
                              {cnt > 0 && (
                                <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 opacity-0 scale-95 group-hover/vbar:opacity-100 group-hover/vbar:scale-100 transition-all duration-150">
                                  <div className="bg-white text-[#1a1a1a] border border-gray-100 rounded-lg px-3 py-2 shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] whitespace-nowrap">
                                    <p className={`${font} text-[11.5px] mb-1.5 inline-flex items-center gap-1.5 text-amber-700`} style={{ fontWeight: 700 }}>
                                      <Star className="size-3 fill-amber-400 text-amber-400" strokeWidth={0} />
                                      {star} ดาว · {cnt} คน <span className="text-gray-400 font-normal">({pct}%)</span>
                                    </p>
                                    <div className={`${font} text-[10.5px] text-gray-700 flex items-center gap-3 mb-1`}>
                                      {female > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-pink-500" />หญิง {female}</span>}
                                      {male > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-blue-500" />ชาย {male}</span>}
                                      {lgbtq > 0 && <span className="inline-flex items-center gap-1"><span className="size-1.5 rounded-full bg-purple-500" />LGBTQ+ {lgbtq}</span>}
                                    </div>
                                    {ageBreakdown.length > 0 && (
                                      <div className={`${font} text-[10px] text-gray-500 flex flex-wrap items-center gap-x-2 gap-y-0.5`}>
                                        {ageBreakdown.map((a) => (
                                          <span key={a.range} className="tabular-nums">{a.range}: {a.cnt}</span>
                                        ))}
                                      </div>
                                    )}
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-white border-r border-b border-gray-100" />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className="absolute bottom-0 inset-x-0 flex items-center gap-2 pointer-events-none">
                        {counts.map(({ star, cnt }) => {
                          const pct = evaluated.length > 0 ? Math.round((cnt / evaluated.length) * 100) : 0;
                          const isTop = star === topStar && cnt > 0;
                          return (
                            <div key={star} className="flex-1 flex flex-col items-center min-w-0">
                              <span className={`${font} text-[11px] tabular-nums ${isTop ? "text-amber-700" : "text-gray-500"}`} style={{ fontWeight: isTop ? 700 : 500 }}>{pct}%</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Q2 — NPS 0-10 (แนะนำให้คนอื่น) — mirrors the per-question NPS card visual but
                  promoted to the prominent side-by-side layout next to overall satisfaction. */}
              {(() => {
                // Read NPS from the always-on core_nps map; fall back to overall as a 1-5 → 0-10
                // approximation only when the new field is missing (legacy data).
                const dist = new Array(11).fill(0);
                let promoters = 0, passives = 0, detractors = 0, count = 0;
                evaluated.forEach((r) => {
                  const v = r.evaluation?.npsScores?.["core_nps"];
                  if (typeof v === "number" && v >= 0 && v <= 10) {
                    dist[v]++;
                    count++;
                    if (v >= 9) promoters++;
                    else if (v >= 7) passives++;
                    else detractors++;
                  }
                });
                const score = count > 0 ? Math.round(((promoters - detractors) / count) * 100) : 0;
                const promoterPct  = count > 0 ? Math.round((promoters / count) * 100)  : 0;
                const passivePct   = count > 0 ? Math.round((passives / count) * 100)   : 0;
                const detractorPct = count > 0 ? Math.round((detractors / count) * 100) : 0;
                const chartData = dist.map((c, i) => ({
                  label: String(i), count: c,
                  color: i <= 6 ? "#ef4444" : i <= 8 ? "#fbbf24" : "#319754",
                }));
                return (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col h-full">
                    <div className="flex items-start justify-between gap-3 mb-5 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 600 }}>แนะนำให้คนอื่น (NPS)</h3>
                        <p className={`${font} text-[12px] text-gray-500 mt-1`}>การกระจายคะแนน 0-10 จากผู้ตอบ — Promoters / Passives / Detractors</p>
                      </div>
                      <span className={`${font} inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10.5px] tabular-nums shrink-0`}
                        style={{
                          background: score >= 30 ? "#31975412" : score >= 0 ? "#fbbf2412" : "#ef444412",
                          color: score >= 30 ? "#319754" : score >= 0 ? "#a16207" : "#b91c1c",
                          fontWeight: 700,
                        }}>
                        NPS = {score > 0 ? `+${score}` : score}
                      </span>
                    </div>
                    {count === 0 ? (
                      <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center bg-gray-50/40">
                        <p className={`${font} text-[12.5px] text-gray-500`} style={{ fontWeight: 500 }}>ยังไม่มีข้อมูล NPS</p>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col">
                        {/* Stat tiles — promoted ABOVE the chart so the owner sees Promoter / Passive /
                            Detractor headlines first, before scanning the 0-10 distribution. */}
                        {/* Report-style KPI cards — pastel bg, large dark headline number,
                            white icon tile in the top-right, sub-badge bottom-left. Each card
                            opens a HoverCard with the per-score / demographic / age breakdown. */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {[
                            { label: "Detractors", pct: detractorPct, count: detractors, color: "#ef4444", bg: "#fef2f2", sub: "0–6",  range: [0, 1, 2, 3, 4, 5, 6], Icon: Frown, img: imgDetractors },
                            { label: "Passives",   pct: passivePct,   count: passives,   color: "#f59e0b", bg: "#fffbeb", sub: "7–8",  range: [7, 8],                Icon: Meh,   img: imgPassives   },
                            { label: "Promoters",  pct: promoterPct,  count: promoters,  color: "#319754", bg: "#f0fdf4", sub: "9–10", range: [9, 10],               Icon: Smile, img: imgPromoters  },
                          ].map((s) => {
                            // Per-score breakdown within this segment (e.g. for Detractors: 0..6 buckets).
                            const scoreBreakdown = s.range.map((n) => ({ score: n, count: dist[n] }));
                            const maxBucket = Math.max(1, ...scoreBreakdown.map((b) => b.count));
                            // Testers whose NPS falls in this segment — used for demographics.
                            const segTesters = evaluated.filter((r) => {
                              const v = r.evaluation?.npsScores?.["core_nps"];
                              return typeof v === "number" && s.range.includes(v);
                            });
                            const female = segTesters.filter((r) => r.gender === "female").length;
                            const male   = segTesters.filter((r) => r.gender === "male").length;
                            const lgbtq  = segTesters.filter((r) => r.gender === "lgbtq").length;
                            const ageBreak = (["15-24", "25-34", "35-44", "45-54", "55+"] as const)
                              .map((ar) => ({ range: ar, cnt: segTesters.filter((r) => r.ageRange === ar).length }))
                              .filter((a) => a.cnt > 0);
                            return (
                              <HoverCard key={s.label} openDelay={120} closeDelay={60}>
                                <HoverCardTrigger asChild>
                                  <div className="group/kpi relative rounded-xl p-2.5 overflow-hidden cursor-default transition-transform hover:-translate-y-0.5"
                                    style={{ background: s.bg }}>
                                    {/* 3D illustration — bottom-right, fades into bg via mask gradient */}
                                    <motion.img
                                      src={s.img}
                                      alt=""
                                      aria-hidden
                                      className="absolute -bottom-2 -right-2 size-[72px] object-contain pointer-events-none select-none opacity-90 transition-transform duration-500 ease-out group-hover/kpi:scale-110 group-hover/kpi:-rotate-3"
                                      style={{
                                        maskImage: "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.4) 85%, transparent 100%)",
                                        WebkitMaskImage: "linear-gradient(to bottom, black 55%, rgba(0,0,0,0.4) 85%, transparent 100%)",
                                      }}
                                      initial={{ y: 20, opacity: 0 }}
                                      animate={{ y: 0, opacity: 0.9 }}
                                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                    {/* Content stack — kept to left ~60% so it doesn't overlap the illustration */}
                                    <div className="relative max-w-[62%]">
                                      <p className={`${font} text-[10.5px] text-gray-600`} style={{ fontWeight: 500 }}>{s.label}</p>
                                      <p className={`${font} text-[20px] tabular-nums leading-none mt-1.5`} style={{ fontWeight: 800, color: "#1a1a1a" }}>
                                        {s.pct}%
                                      </p>
                                      <span className={`${font} inline-flex items-center gap-1 mt-2 px-1.5 py-0.5 rounded-full text-[10px] tabular-nums`}
                                        style={{ background: `${s.color}18`, color: s.color, fontWeight: 700 }}>
                                        <BarChart3 className="size-2.5" strokeWidth={2.4} />
                                        {s.count} คน · {s.sub}
                                      </span>
                                    </div>
                                  </div>
                                </HoverCardTrigger>
                                <HoverCardContent side="top" align="center" sideOffset={8}
                                  className="w-[260px] p-3 bg-white rounded-xl shadow-[0_18px_40px_-10px_rgba(0,0,0,0.18)] border border-gray-100">
                                  {/* Title row */}
                                  <div className="flex items-center gap-2 mb-2.5">
                                    <div className="size-7 rounded-lg flex items-center justify-center shrink-0"
                                      style={{ background: `${s.color}15` }}>
                                      <s.Icon className="size-3.5" style={{ color: s.color }} strokeWidth={2.4} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className={`${font} text-[12px]`} style={{ fontWeight: 700, color: s.color }}>{s.label}</p>
                                      <p className={`${font} text-[10px] text-gray-500 tabular-nums`}>{s.count} จาก {count} คน · {s.pct}%</p>
                                    </div>
                                  </div>
                                  {/* Per-score mini-distribution */}
                                  {s.count > 0 && (
                                    <>
                                      <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 700 }}>การกระจายคะแนน</p>
                                      <div className="space-y-1 mb-2.5">
                                        {scoreBreakdown.filter((b) => b.count > 0).map((b) => {
                                          const widthPct = (b.count / maxBucket) * 100;
                                          const ofSegPct = s.count > 0 ? Math.round((b.count / s.count) * 100) : 0;
                                          return (
                                            <div key={b.score} className="flex items-center gap-2">
                                              <span className={`${font} text-[10.5px] text-gray-500 tabular-nums w-4 shrink-0`}>{b.score}</span>
                                              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                                                <div className="h-full rounded-full transition-all"
                                                  style={{ width: `${widthPct}%`, background: s.color }} />
                                              </div>
                                              <span className={`${font} text-[10.5px] tabular-nums shrink-0`} style={{ color: s.color, fontWeight: 700 }}>
                                                {b.count}<span className="text-gray-400 font-normal ml-0.5">({ofSegPct}%)</span>
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </>
                                  )}
                                  {/* Demographics */}
                                  {(female + male + lgbtq) > 0 && (
                                    <>
                                      <div className="h-px bg-gray-100 my-2" />
                                      <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mb-1.5`} style={{ fontWeight: 700 }}>เพศของผู้ตอบ</p>
                                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-1">
                                        {female > 0 && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-pink-500" /> หญิง {female}</span>}
                                        {male > 0   && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-blue-500" /> ชาย {male}</span>}
                                        {lgbtq > 0  && <span className={`${font} text-[10.5px] inline-flex items-center gap-1 text-gray-700 tabular-nums`}><span className="size-1.5 rounded-full bg-purple-500" /> LGBTQ+ {lgbtq}</span>}
                                      </div>
                                    </>
                                  )}
                                  {/* Age breakdown */}
                                  {ageBreak.length > 0 && (
                                    <>
                                      <p className={`${font} text-[10px] text-gray-500 uppercase tracking-wide mt-2 mb-1.5`} style={{ fontWeight: 700 }}>ช่วงอายุ</p>
                                      <div className="flex flex-wrap gap-1.5">
                                        {ageBreak.map((a) => (
                                          <span key={a.range} className={`${font} inline-flex items-center px-2 py-0.5 rounded-full text-[10px] tabular-nums`}
                                            style={{ background: `${s.color}10`, color: s.color, fontWeight: 700 }}>
                                            {a.range} · {a.cnt}
                                          </span>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                  {s.count === 0 && (
                                    <p className={`${font} text-[11px] text-gray-400 italic text-center py-2`}>ยังไม่มีผู้ตอบในช่วงนี้</p>
                                  )}
                                </HoverCardContent>
                              </HoverCard>
                            );
                          })}
                        </div>
                        <ResponsiveContainer width="100%" height="100%" minHeight={160}>
                          <BarChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barCategoryGap="22%">
                            <CartesianGrid strokeDasharray="2 6" stroke="#f3f4f6" vertical={false} />
                            <XAxis dataKey="label" tick={{ fontSize: 10.5, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickMargin={6} />
                            <YAxis hide allowDecimals={false} />
                            <RechartsTooltip
                              cursor={{ fill: "rgba(148,163,184,0.06)" }}
                              content={({ active, payload, label }: any) => {
                                if (!active || !payload?.length) return null;
                                const d = payload[0].payload;
                                const seg = Number(label) <= 6 ? "Detractor" : Number(label) <= 8 ? "Passive" : "Promoter";
                                const pct = count > 0 ? Math.round((d.count / count) * 100) : 0;
                                return (
                                  <div className={`${font} bg-white rounded-lg shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] border border-gray-100 p-2.5 min-w-[140px]`}>
                                    <p className="text-[11.5px] mb-1" style={{ fontWeight: 700 }}>คะแนน {label} · {d.count} คน <span className="text-gray-400 font-normal">({pct}%)</span></p>
                                    <p className="text-[10.5px] text-gray-500">{seg}</p>
                                  </div>
                                );
                              }}
                            />
                            {/* Pill-shaped bars — fully rounded corners + thin width for a minimal look. */}
                            <Bar dataKey="count" radius={[12, 12, 12, 12]} animationDuration={700} maxBarSize={18}>
                              {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                );
              })()}
          </div>

          {/* Per-question analytics — split into 3 zones for the "report" layout:
                1) Big "ภาพรวมการประเมิน" card (rating cards by phase) + AB sidebar (สูตร + ความแตกต่าง)
                2) Other-type cards (conditional / MC / tag / text-price) in a flexible masonry grid
                3) core_text comments stay in their own section below */}
          {phasesWithData.length === 0 ? (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center">
              <p className={`${font} text-[13px] text-gray-500`} style={{ fontWeight: 500 }}>
                สินค้านี้ยังไม่ได้ตั้งค่าวัตถุประสงค์การทดสอบ — ไปที่หน้า "สร้างแบบประเมิน" เพื่อเลือกชุดคำถาม
              </p>
            </div>
          ) : (
            (() => {
              const RATING_KINDS: PerQuestionStat["kind"][] = ["scale", "stars"];
              const ratingByPhase: Record<Phase, PerQuestionStat[]> = { baseline: [], first_use: [], after_full: [], always: [] };
              let abChoiceCard: PerQuestionStat | null = null;
              let abDiffCard: PerQuestionStat | null = null;
              const otherCards: PerQuestionStat[] = [];
              for (const stat of perQuestionStats) {
                if (RATING_KINDS.includes(stat.kind)) ratingByPhase[stat.q.phase].push(stat);
                else if (stat.q.id === "ab_prefer") abChoiceCard = stat;
                else if (stat.q.id === "ab_diff")   abDiffCard   = stat;
                else otherCards.push(stat);
              }
              const ratingPhases = (["baseline", "first_use", "after_full"] as Phase[])
                .filter((ph) => ratingByPhase[ph].length > 0);
              const hasRatings = ratingPhases.length > 0;
              const hasAb = !!abChoiceCard || !!abDiffCard;
              const totalRatings = ratingPhases.reduce((s, ph) => s + ratingByPhase[ph].length, 0);
              // Promote the tallest MC card (≥6 options) into the right sidebar so the empty
              // space under สูตร+ความแตกต่าง fills with the tall problem-options card. The
              // rest stays in Zone 2's grid.
              const tallestMcIdx = otherCards.reduce<{ idx: number; opts: number }>(
                (acc, c, i) => (c.kind === "mc" && c.mc && c.mc.options.length > acc.opts && c.mc.options.length >= 6)
                  ? { idx: i, opts: c.mc.options.length }
                  : acc,
                { idx: -1, opts: 0 },
              );
              const promotedTallCard = tallestMcIdx.idx >= 0 ? otherCards[tallestMcIdx.idx] : null;
              const otherCardsAfterPromoted = promotedTallCard
                ? otherCards.filter((_, i) => i !== tallestMcIdx.idx)
                : otherCards;
              // Split remaining cards: conditional (ผลข้างเคียง), mkt_price (ราคา), pkg_first
              // (First Impression), and mkt_target (กลุ่มเป้าหมาย) all join the LEFT column
              // under ภาพรวมการประเมิน — they fill the wider 2fr column in a 2x2 grid.
              // Explicit position order so they render row-by-row left-to-right as:
              //   Row 1: ผลข้างเคียง  ·  First Impression
              //   Row 2: กลุ่มเป้าหมาย ·  ราคาสูงสุด
              const LEFT_PRIORITY: Record<string, number> = {
                pkg_first: 1,
                mkt_target: 2,
                mkt_price: 3,
              };
              const LEFT_IDS = new Set(["mkt_price", "pkg_first", "mkt_target"]);
              const leftSideExtras = otherCardsAfterPromoted
                .filter((c) => c.kind === "cond" || LEFT_IDS.has(c.q.id))
                .sort((a, b) => {
                  const ka = a.kind === "cond" ? 0 : (LEFT_PRIORITY[a.q.id] ?? 99);
                  const kb = b.kind === "cond" ? 0 : (LEFT_PRIORITY[b.q.id] ?? 99);
                  return ka - kb;
                });
              const otherCardsForZone2 = otherCardsAfterPromoted.filter(
                (c) => !(c.kind === "cond" || LEFT_IDS.has(c.q.id))
              );
              const renderRatingCard = (stat: PerQuestionStat, recipeColor: string) => (
                // Inner tile sits on the white outer card — light border + roomier padding
                // (Figma: rounded-2xl, ~16px padding, no fill).
                <div key={stat.q.id}
                  className="rounded-2xl p-4 border border-gray-100">
                  <QuestionCardHeader stat={stat} />
                  <QuestionCardBody stat={stat} accentColor={recipeColor} />
                </div>
              );
              return (
                <div className="space-y-4">
                  {/* ===== Zone 1: ภาพรวมการประเมิน + AB sidebar ===== */}
                  {(hasRatings || hasAb) && (
                    <div className={hasAb && hasRatings ? "grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 items-start" : ""}>
                      {(hasRatings || leftSideExtras.length > 0) && (
                        // LEFT column wrapper — ภาพรวมการประเมิน + (optional) ผลข้างเคียง / ราคา
                        // stacked vertically so both extras sit directly under the rating card.
                        <div className="space-y-4">
                          {hasRatings && (
                            // Figma layout: one white outer card titled "ภาพรวมการประเมิน" containing
                            // both phase sub-sections. Phase headers are plain Thai text.
                            <div className="bg-white rounded-2xl border border-gray-100 p-5">
                              <div className="mb-4">
                                <h3 className={`${font} text-[18px] text-[#1a1a1a] leading-tight`} style={{ fontWeight: 700 }}>ภาพรวมการประเมิน</h3>
                                <p className={`${font} text-[12px] text-gray-500 mt-1`}>คะแนน 1-5 ของแต่ละข้อ — แยกตามช่วงเวลาที่ Tester ตอบ</p>
                              </div>
                              <div className="space-y-5">
                                {ratingPhases.map((ph) => {
                                  const recipe = PHASE_RECIPE[ph];
                                  const phCards = ratingByPhase[ph];
                                  const cleanLabel = recipe.label.replace(/\s*\([^)]*\)\s*$/, "");
                                  return (
                                    <section key={ph}>
                                      <h4 className={`${font} text-[14px] text-[#1a1a1a] mb-3`} style={{ fontWeight: 600 }}>
                                        {cleanLabel}
                                      </h4>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                                        {phCards.map((stat) => renderRatingCard(stat, recipe.color))}
                                      </div>
                                    </section>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          {/* ผลข้างเคียง + ราคาสูงสุด — moved here to flow under ภาพรวมการประเมิน,
                              keeping them on the wider LEFT side where their internal 3-col content
                              (donut+pills / 3 podium arches) has room to breathe. */}
                          {leftSideExtras.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {leftSideExtras.map((stat) => {
                                const recipe = PHASE_RECIPE[stat.q.phase];
                                // Per-card description (Figma asks for a subtitle under the title).
                                const description = stat.kind === "cond"
                                  ? `Tester ${stat.cond?.yes ?? 0} คน รายงานอาการระหว่างทดสอบ`
                                  : stat.q.id === "mkt_price"
                                    ? "ราคาที่ Tester พร้อมจ่ายสำหรับสินค้านี้"
                                    : stat.q.id === "pkg_first"
                                      ? "ภาพแรกของบรรจุภัณฑ์ที่ Tester รู้สึก"
                                      : stat.q.id === "mkt_target"
                                        ? "กลุ่มเป้าหมายที่ Tester มองว่าเหมาะสม"
                                        : null;
                                return (
                                  <div key={stat.q.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                                    <div className="flex items-start justify-between gap-2 mb-5 flex-wrap">
                                      <div className="flex-1 min-w-0">
                                        <h3 className={`${font} text-[16px] text-[#1a1a1a] leading-snug`} style={{ fontWeight: 700 }}>
                                          {stat.q.label}
                                        </h3>
                                        {description && (
                                          <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>
                                            {description}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                    <QuestionCardBody stat={stat} accentColor={recipe.color} />
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                      {(hasAb || promotedTallCard) && (
                        // Right-column wrapper — AB combined card + promoted tall MC card stack
                        // vertically inside the SAME grid cell so the tall card sits directly
                        // beneath ความแตกต่าง (not under ภาพรวมการประเมิน as a separate row).
                        <div className="space-y-4">
                      {hasAb && (() => {
                        // Figma node 7707:3489 — สูตร + ความแตกต่าง live INSIDE one shared card,
                        // separated by a thin horizontal divider. Each ab_diff comment is a small
                        // gray rounded box with an inner divider line between the name row and
                        // the message body.
                        const diffEntries = abDiffCard
                          ? evaluated
                              .map((r) => ({
                                reg: r,
                                note: r.evaluation?.textAnswers?.["ab_diff"]?.trim(),
                              }))
                              .filter((x): x is { reg: typeof x.reg; note: string } => !!x.note)
                          : [];
                        const VISIBLE = 4;
                        return (
                          <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            {/* ===== สูตร section ===== */}
                            {abChoiceCard && (
                              <div className="mb-5">
                                <div className="mb-5">
                                  <h3 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>สูตร</h3>
                                  <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เปรียบเทียบสูตร A กับ B</p>
                                </div>
                                <QuestionCardBody stat={abChoiceCard} accentColor="#8b5cf6" />
                              </div>
                            )}
                            {/* Divider between sections */}
                            {abChoiceCard && abDiffCard && (
                              <div className="h-px bg-gray-100 -mx-5 mb-5" />
                            )}
                            {/* ===== ความแตกต่าง section ===== */}
                            {abDiffCard && (
                              <div>
                                <div className="mb-5">
                                  <h3 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>ความแตกต่าง</h3>
                                  <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>สิ่งที่ Tester สังเกตได้ระหว่างสูตร A กับ B</p>
                                </div>
                                {diffEntries.length === 0 ? (
                                  <p className={`${font} text-[11.5px] text-gray-400 italic text-center py-4`}>ยังไม่มีคำตอบ</p>
                                ) : (
                                  <>
                                    <div className="space-y-2.5">
                                      {diffEntries.slice(0, VISIBLE).map(({ reg, note }) => (
                                        <div key={`${reg.name}-${reg.submittedAt}`}
                                          className="bg-gray-50 rounded-xl px-3 py-2.5">
                                          {/* Row 1 — avatar + name */}
                                          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200/70">
                                            <div className="size-7 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                              <img src={portraitForApplicant(reg.name, reg.gender)} alt={reg.name} loading="lazy" className="w-full h-full object-cover" />
                                            </div>
                                            <p className={`${font} text-[12px] text-[#1a1a1a] truncate`} style={{ fontWeight: 600 }}>{reg.name}</p>
                                          </div>
                                          {/* Row 2 — message body */}
                                          <p className={`${font} text-[11.5px] text-gray-600 leading-relaxed line-clamp-2 mt-2`}>{note}</p>
                                        </div>
                                      ))}
                                    </div>
                                    {diffEntries.length > VISIBLE && (
                                      <div className="flex justify-center pt-3">
                                        <button
                                          type="button"
                                          onClick={() => setAbDiffModalOpen(true)}
                                          className={`${font} inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] tabular-nums bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors`}
                                          style={{ fontWeight: 600 }}>
                                          +{diffEntries.length - VISIBLE} คำตอบเพิ่มเติม
                                          <ChevronRight className="size-3" strokeWidth={2.4} />
                                        </button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      {/* The tall MC card (e.g. ปัญหาผิวที่ต้องการแก้ไข) sits directly under the
                          สูตร+ความแตกต่าง card to fill the otherwise-empty sidebar space below it. */}
                      {promotedTallCard && (() => {
                        const recipe = PHASE_RECIPE[promotedTallCard.q.phase];
                        return (
                          <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="flex items-start justify-between gap-2 mb-5 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <h3 className={`${font} text-[16px] text-[#1a1a1a] leading-snug`} style={{ fontWeight: 700 }}>
                                  {promotedTallCard.q.label}
                                </h3>
                                <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>
                                  {promotedTallCard.responses} คน · เรียงตามตัวเลือกที่ Tester เลือกบ่อยที่สุด
                                </p>
                              </div>
                            </div>
                            <QuestionCardBody stat={promotedTallCard} accentColor={recipe.color} />
                          </div>
                        );
                      })()}
                      {/* Remaining other-type cards (conditional / price / MC / tag / text) also
                          stack inside the right column so the dashboard has no large empty band
                          between Zone 1 and the next section — everything flows continuously. */}
                      {otherCardsForZone2.map((stat) => {
                        const recipe = PHASE_RECIPE[stat.q.phase];
                        return (
                          <div key={stat.q.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                            <h3 className={`${font} text-[15px] text-[#1a1a1a] leading-snug mb-3`} style={{ fontWeight: 700 }}>
                              {stat.q.label}
                            </h3>
                            <QuestionCardBody stat={stat} accentColor={recipe.color} />
                          </div>
                        );
                      })}
                      {/* ===== คำแนะนำเพิ่มเติม — moved into the RIGHT column (single-col stack
                          with pagination), so the dashboard no longer needs a full-width
                          comments band at the bottom. ===== */}
                      {(() => {
                        const commentedEvals = evaluated.filter((r) => r.evaluation?.comment && r.evaluation.comment.trim().length > 0);
                        if (commentedEvals.length === 0) return null;
                        const VISIBLE = 4;
                        const pageItems = commentedEvals.slice(0, VISIBLE);
                        return (
                          <div className="bg-white rounded-2xl border border-gray-100 p-5">
                            <div className="mb-3">
                              <h3 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>คำแนะนำเพิ่มเติม</h3>
                              <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เสียงจริงจาก Tester ที่ทดสอบสินค้า</p>
                            </div>
                            {/* List style matches ความแตกต่าง: gray box + inner divider + ⭐ rating badge */}
                            <div className="space-y-2.5">
                              {pageItems.map((r) => {
                                const photo = portraitForApplicant(r.name, r.gender);
                                const stars = r.evaluation?.overall || 0;
                                return (
                                  <div key={`${r.name}-${r.submittedAt}`} className="bg-gray-50 rounded-xl px-3 py-2.5">
                                    <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200/70">
                                      <div className="size-7 rounded-full overflow-hidden shrink-0 border border-gray-200">
                                        <img src={photo} alt={r.name} loading="lazy" className="w-full h-full object-cover" />
                                      </div>
                                      <p className={`${font} text-[12px] text-[#1a1a1a] truncate flex-1 min-w-0`} style={{ fontWeight: 600 }}>{r.name}</p>
                                      {stars > 0 && (
                                        <span className={`${font} inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] shrink-0 bg-amber-50 text-amber-700 tabular-nums`} style={{ fontWeight: 700 }}>
                                          <Star className="size-2.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                                          {stars}/5
                                        </span>
                                      )}
                                    </div>
                                    <p className={`${font} text-[11.5px] text-gray-600 leading-relaxed line-clamp-2 mt-2`}>
                                      {r.evaluation?.comment}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                            {/* "ดูเพิ่มเติม" button — opens modal showing all comments */}
                            {commentedEvals.length > VISIBLE && (
                              <div className="flex justify-center pt-3">
                                <button
                                  type="button"
                                  onClick={() => setCommentsModalOpen(true)}
                                  className={`${font} inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] tabular-nums bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors`}
                                  style={{ fontWeight: 600 }}>
                                  +{commentedEvals.length - VISIBLE} คำตอบเพิ่มเติม
                                  <ChevronRight className="size-3" strokeWidth={2.4} />
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ===== Zone 2 — disabled: other-type cards now flow inside the right column above. ===== */}
                  {false && otherCardsForZone2.length > 0 && (() => {
                    // (kept as a no-op for potential future reuse)
                    let tallestIdx = -1;
                    let tallestOpts = 0;
                    otherCardsForZone2.forEach((c, i) => {
                      if (c.kind === "mc" && c.mc) {
                        const optCount = c.mc.options.length;
                        if (optCount > tallestOpts) { tallestOpts = optCount; tallestIdx = i; }
                      }
                    });
                    // Only promote to row-span-2 if there are at least 6 options (it has to be
                    // visibly taller than the others to justify spanning) AND there are enough
                    // sibling cards to fill cols 1+2 of both rows.
                    const useRowSpan = tallestIdx >= 0 && tallestOpts >= 6 && otherCardsForZone2.length >= 3;
                    const tallestCard = useRowSpan ? otherCardsForZone2[tallestIdx] : null;
                    const otherList = useRowSpan
                      ? otherCardsForZone2.filter((_, i) => i !== tallestIdx)
                      : otherCardsForZone2;
                    const renderCard = (stat: PerQuestionStat, extraClass = "") => {
                      const recipe = PHASE_RECIPE[stat.q.phase];
                      return (
                        <div key={stat.q.id}
                          className={`bg-white rounded-2xl border border-gray-100 p-5 ${extraClass}`}>
                          <h3 className={`${font} text-[15px] text-[#1a1a1a] leading-snug mb-3`} style={{ fontWeight: 700 }}>
                            {stat.q.label}
                          </h3>
                          <QuestionCardBody stat={stat} accentColor={recipe.color} />
                        </div>
                      );
                    };
                    if (useRowSpan && tallestCard) {
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
                          {/* Tall card — col 3, spans both rows on lg+ */}
                          <div className="lg:col-start-3 lg:row-span-2">
                            {renderCard(tallestCard)}
                          </div>
                          {/* Other cards — auto-flow into cols 1+2 */}
                          {otherList.map((stat) => renderCard(stat))}
                        </div>
                      );
                    }
                    // Fallback: plain masonry when there's no tall card to anchor the layout.
                    return (
                      <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
                        {otherCardsForZone2.map((stat) => (
                          <div key={stat.q.id} className="break-inside-avoid mb-4">
                            {renderCard(stat)}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              );
            })()
          )}

          {/* คำแนะนำเพิ่มเติม — now lives inside the right column above (not full-width here). */}
        </>
      )}

      {/* ===== ความแตกต่าง — full modal showing every ab_diff answer ===== */}
      <AnimatePresence>
        {abDiffModalOpen && (() => {
          const allDiffs = evaluated
            .map((r) => ({ reg: r, note: r.evaluation?.textAnswers?.["ab_diff"]?.trim() }))
            .filter((x): x is { reg: typeof x.reg; note: string } => !!x.note);
          const aChoices: Record<string, "A" | "B" | undefined> = {};
          evaluated.forEach((r) => {
            const v = r.evaluation?.abChoices?.["ab_prefer"];
            aChoices[`${r.name}-${r.submittedAt}`] = v;
          });
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setAbDiffModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-[560px] w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)]">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>ความแตกต่างทั้งหมด</h2>
                    <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>สิ่งที่ Tester สังเกตได้ระหว่างสูตร A กับ B · {allDiffs.length} คำตอบ</p>
                  </div>
                  <button onClick={() => setAbDiffModalOpen(false)} aria-label="ปิด"
                    className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0">
                    <X className="size-4" strokeWidth={2.4} />
                  </button>
                </div>
                {/* Body — scrollable list */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 bg-gradient-to-b from-gray-50/40 to-white">
                  {allDiffs.length === 0 ? (
                    <p className={`${font} text-[12px] text-gray-400 italic text-center py-8`}>ยังไม่มีคำตอบ</p>
                  ) : (
                    allDiffs.map(({ reg, note }) => {
                      const choice = aChoices[`${reg.name}-${reg.submittedAt}`];
                      const choiceColor = choice === "A" ? "#3b82f6" : choice === "B" ? "#319754" : "#9ca3af";
                      return (
                        <div key={`${reg.name}-${reg.submittedAt}`} className="bg-gray-50 rounded-xl px-3 py-2.5">
                          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200/70">
                            <div className="size-7 rounded-full overflow-hidden shrink-0 border border-gray-200">
                              <img src={portraitForApplicant(reg.name, reg.gender)} alt={reg.name} loading="lazy" className="w-full h-full object-cover" />
                            </div>
                            <p className={`${font} text-[12.5px] text-[#1a1a1a] truncate flex-1`} style={{ fontWeight: 600 }}>{reg.name}</p>
                            {choice && (
                              <span className={`${font} inline-flex items-center px-2 py-0.5 rounded-full text-[10px] shrink-0`}
                                style={{ background: `${choiceColor}15`, color: choiceColor, fontWeight: 700 }}>
                                ชอบสูตร {choice}
                              </span>
                            )}
                          </div>
                          <p className={`${font} text-[12px] text-gray-700 leading-relaxed mt-2`}>{note}</p>
                        </div>
                      );
                    })
                  )}
                </div>
                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 flex justify-end bg-white">
                  <button onClick={() => setAbDiffModalOpen(false)}
                    className={`${font} h-9 px-4 rounded-full text-gray-700 text-[12.5px] hover:bg-gray-100 cursor-pointer transition-colors`}
                    style={{ fontWeight: 500 }}>
                    ปิด
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ===== คำแนะนำเพิ่มเติม — full modal showing every comment ===== */}
      <AnimatePresence>
        {commentsModalOpen && (() => {
          const allComments = evaluated.filter((r) => r.evaluation?.comment && r.evaluation.comment.trim().length > 0);
          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCommentsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 12 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl max-w-[560px] w-full max-h-[85vh] overflow-hidden flex flex-col shadow-[0_24px_60px_-12px_rgba(0,0,0,0.25)]">
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h2 className={`${font} text-[16px] text-[#1a1a1a]`} style={{ fontWeight: 700 }}>คำแนะนำเพิ่มเติมทั้งหมด</h2>
                    <p className={`${font} text-[11px] text-gray-500 mt-0.5`}>เสียงจริงจาก Tester ที่ทดสอบสินค้า · {allComments.length} ความคิดเห็น</p>
                  </div>
                  <button onClick={() => setCommentsModalOpen(false)} aria-label="ปิด"
                    className="size-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center cursor-pointer shrink-0">
                    <X className="size-4" strokeWidth={2.4} />
                  </button>
                </div>
                {/* Body — scrollable list (matches ความแตกต่าง modal styling) */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2.5 bg-gradient-to-b from-gray-50/40 to-white">
                  {allComments.length === 0 ? (
                    <p className={`${font} text-[12px] text-gray-400 italic text-center py-8`}>ยังไม่มีความคิดเห็น</p>
                  ) : (
                    allComments.map((r) => {
                      const stars = r.evaluation?.overall || 0;
                      return (
                        <div key={`${r.name}-${r.submittedAt}`} className="bg-gray-50 rounded-xl px-3 py-2.5">
                          <div className="flex items-center gap-2 pb-1.5 border-b border-gray-200/70">
                            <div className="size-7 rounded-full overflow-hidden shrink-0 border border-gray-200">
                              <img src={portraitForApplicant(r.name, r.gender)} alt={r.name} loading="lazy" className="w-full h-full object-cover" />
                            </div>
                            <p className={`${font} text-[12.5px] text-[#1a1a1a] truncate flex-1`} style={{ fontWeight: 600 }}>{r.name}</p>
                            {stars > 0 && (
                              <span className={`${font} inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] shrink-0 bg-amber-50 text-amber-700`} style={{ fontWeight: 700 }}>
                                <Star className="size-2.5 fill-amber-400 text-amber-400" strokeWidth={0} />
                                {stars}/5
                              </span>
                            )}
                          </div>
                          <p className={`${font} text-[12px] text-gray-700 leading-relaxed mt-2`}>{r.evaluation?.comment}</p>
                        </div>
                      );
                    })
                  )}
                </div>
                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-100 flex justify-end bg-white">
                  <button onClick={() => setCommentsModalOpen(false)}
                    className={`${font} h-9 px-4 rounded-full text-gray-700 text-[12.5px] hover:bg-gray-100 cursor-pointer transition-colors`}
                    style={{ fontWeight: 500 }}>
                    ปิด
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

function InfoCard({ title, rows }: { title: string; rows: { label: string; value: string }[] }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4">
      <p className={`${font} text-[12px] text-gray-500 uppercase tracking-wide mb-3`} style={{ fontWeight: 600 }}>{title}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
        {rows.map((r) => (
          <div key={r.label}>
            <p className={`${font} text-[11px] text-gray-400`} style={{ fontWeight: 500 }}>{r.label}</p>
            <p className={`${font} text-[12.5px] text-[#1a1a1a] mt-0.5`} style={{ fontWeight: 500 }}>{r.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
