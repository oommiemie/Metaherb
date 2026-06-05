import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const TEMPLATE_URL = `${import.meta.env.BASE_URL}quote-template.pdf`;
const FONT_REGULAR_URL = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Regular.ttf";
const FONT_BOLD_URL    = "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/sarabun/Sarabun-Bold.ttf";

export interface QuoteData {
  rfqNumber: string;
  todayStr: string;
  companyName: string;
  companyAddress: string;
  taxId: string;
  contactName: string;
  position: string;
  phone: string;
  email: string;
  poReference: string;
  requiredBy: string;
  certPref: string;
  note: string;
  items: Array<{ name: string; qty: number; unit: string }>;
}

let tplCache: ArrayBuffer | null = null;
let regCache: ArrayBuffer | null = null;
let bldCache: ArrayBuffer | null = null;

const fetchBytes = async (url: string): Promise<ArrayBuffer> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load ${url}: ${res.status}`);
  return res.arrayBuffer();
};

export async function generateQuotePdfBlob(data: QuoteData): Promise<Blob> {
  tplCache = tplCache ?? (await fetchBytes(TEMPLATE_URL));
  regCache = regCache ?? (await fetchBytes(FONT_REGULAR_URL));
  bldCache = bldCache ?? (await fetchBytes(FONT_BOLD_URL));

  const pdf = await PDFDocument.load(tplCache);
  pdf.registerFontkit(fontkit);
  const fontReg  = await pdf.embedFont(regCache);
  const fontBold = await pdf.embedFont(bldCache);

  const page = pdf.getPages()[0];
  const { height } = page.getSize(); // 841.8

  // ===== 1) Whiteout baked-in sample values from template =====
  // pdf-lib y origin is BOTTOM-LEFT; rectangle uses bottom-left corner.
  const wipe = (x: number, yBottom: number, w: number, h: number) => {
    page.drawRectangle({ x, y: yBottom, width: w, height: h, color: rgb(1, 1, 1) });
  };

  // Doc meta values (right side)
  wipe(404, 667, 100, 16);  // MT-005/69
  wipe(404, 649, 100, 16);  // 20/3/2569
  wipe(403, 612, 60,  13);  // ": 30" of อ้างถึง
  wipe(440, 591, 50,  13);  // ") : 30" of กำหนดยื่นราคา

  // Sample table row 1
  wipe(66,  533, 240, 17);  // covers "1" + name area + "4"
  wipe(338, 533, 35,  17);  // "กล่อง"
  wipe(400, 533, 45,  17);  // "169.00"
  wipe(485, 533, 45,  17);  // "676.00"

  // Totals values (right column)
  wipe(480, 420, 55, 15);   // 676.00 ยอดรวม
  wipe(480, 399, 55, 15);   // 631.78
  wipe(485, 383, 50, 15);   // 44.22
  wipe(480, 366, 55, 15);   // 676.00 final

  // Amount-in-words
  wipe(330, 350, 220, 16);  // "หกร้อยเจ็ดสิบหกบาทถ้วน"

  // ===== 2) Draw user data =====
  // helper — yTop measured from page top (visual)
  const draw = (text: string, xLeft: number, yTop: number, opts?: { size?: number; bold?: boolean; maxWidth?: number; lineGap?: number }) => {
    if (!text) return;
    const size = opts?.size ?? 10;
    const font = opts?.bold ? fontBold : fontReg;
    const lineGap = opts?.lineGap ?? size * 1.2;
    const lines = wrapText(text, font, size, opts?.maxWidth ?? 9999);
    lines.forEach((line, i) => {
      page.drawText(line, { x: xLeft, y: height - yTop - i * lineGap, size, font, color: rgb(0, 0, 0) });
    });
  };

  // --- LEFT customer block ---
  draw(data.companyName,      110, 170, { size: 11, bold: true, maxWidth: 250 });
  if (data.companyAddress)
    draw(`ที่อยู่ : ${data.companyAddress}`, 60, 188, { size: 9, maxWidth: 300, lineGap: 11 });
  if (data.taxId)
    draw(`เลขประจำตัวผู้เสียภาษี: ${data.taxId}`, 60, 212, { size: 9 });

  // ผู้ติดต่อ value (label is at x=64, ":" at x=90)
  draw(data.contactName + (data.position ? ` (${data.position})` : ""), 100, 225, { size: 10, maxWidth: 130 });
  // โทรศัพท์ value (label at x=234, ":" at x=264)
  draw(data.phone, 275, 225, { size: 10 });
  // อีเมล์ value (label at x=72, ":" at x=90)
  draw(data.email, 100, 245, { size: 10, maxWidth: 130 });

  // --- RIGHT doc meta block ---
  draw(data.rfqNumber, 410, 170, { size: 10, bold: true });
  draw(data.todayStr,  410, 188, { size: 10 });
  // อ้างถึง — overwrite "30" with user PO ref (or restore default "30")
  draw(`: ${data.poReference || "30"}`, 405, 225, { size: 10 });
  // กำหนดยื่นราคา — restore "30"
  draw(": 30", 448, 245, { size: 10 });

  // --- ITEMS TABLE ---
  // First row top is at yTop=301; subsequent rows ~22pt apart
  const tableTopY = 301;
  const rowH = 22;
  data.items.forEach((it, i) => {
    const yTop = tableTopY + i * rowH;
    draw(String(i + 1),  68,  yTop, { size: 10 });
    draw(it.name,        80,  yTop, { size: 10, maxWidth: 210, lineGap: 11 });
    draw(String(it.qty), 305, yTop, { size: 10 });
    draw(it.unit,        345, yTop, { size: 10 });
    // ราคาต่อหน่วย + ราคารวม → blank (RFQ — supplier fills in)
  });

  // --- NOTES (left) ---
  let notesY = 440;
  if (data.requiredBy) { draw(`ต้องการรับสินค้าภายใน: ${data.requiredBy}`, 60, notesY, { size: 9 }); notesY += 14; }
  if (data.certPref && data.certPref !== "ทั่วไป") { draw(`เกรด/Certificate: ${data.certPref}`, 60, notesY, { size: 9 }); notesY += 14; }
  if (data.note) draw(data.note, 60, notesY, { size: 9, maxWidth: 280, lineGap: 12 });

  // --- TOTALS column — show "รอ Supplier เสนอราคา" as italic-style placeholders ---
  const placeholderColor = rgb(0.6, 0.6, 0.6);
  const drawDim = (text: string, x: number, yTop: number, size = 10) => {
    page.drawText(text, { x, y: height - yTop, size, font: fontReg, color: placeholderColor });
  };
  drawDim("รอเสนอ", 485, 408);
  drawDim("รอเสนอ", 485, 429);
  drawDim("รอเสนอ", 490, 445);
  drawDim("รอเสนอ", 485, 462);
  drawDim("รอ Supplier เสนอราคา", 350, 480, 9);

  // --- SIGNATURE: ตำแหน่ง field on left box ---
  if (data.position) draw(data.position, 110, 621, { size: 9, maxWidth: 180 });

  const bytes = await pdf.save();
  return new Blob([new Uint8Array(bytes)], { type: "application/pdf" });
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  if (!text) return [];
  if (maxWidth >= 9999) return text.split("\n");
  const lines: string[] = [];
  for (const raw of text.split("\n")) {
    let line = "";
    for (const ch of raw) {
      const trial = line + ch;
      if (font.widthOfTextAtSize(trial, size) > maxWidth && line) {
        lines.push(line);
        line = ch;
      } else {
        line = trial;
      }
    }
    if (line) lines.push(line);
  }
  return lines;
}

// Reference unused export to silence TS in some configs
export type _Unused = PDFPage;
