// Single source of truth for ALL report mock data.
// Every report tab (Sales / Customers / Products / Market) reads from this file
// so the same date filter always produces the same numbers across the dashboard.
//
// Each data point contains ALL metrics so different tabs can pick the fields they need:
//   - Sales: sales, orders, cost, discount, topProduct
//   - Customers: newCust, repeat
//   - Products: units, revenue
//   - Market: visits, orders

import type { DateRange } from "react-day-picker";

export type Period = "daily" | "weekly" | "monthly" | "yearly" | "custom";

export type ReportPoint = {
  label: string;
  sales: number;     // ฿ revenue total
  orders: number;    // count of orders
  visits: number;    // count of page visits
  newCust: number;   // count of new customers
  repeat: number;    // count of repeat customers
  units: number;     // count of items sold
  revenue: number;   // alias for product chart (= sales)
  cost: number;      // ฿ COGS (~55% of sales)
  discount: number;  // ฿ promo discount given
  topProduct: string;
};

export const thaiMonthsShort = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
export const thaiMonthsFull = ["มกราคม","กุมภาพันธ์","มีนาคม","เมษายน","พฤษภาคม","มิถุนายน","กรกฎาคม","สิงหาคม","กันยายน","ตุลาคม","พฤศจิกายน","ธันวาคม"];

const tops = ["ขมิ้นชันแคปซูล", "ฟ้าทะลายโจร", "ชาเก๊กฮวยออร์แกนิก", "น้ำผึ้งดอกลำไย", "ใบบัวบกแคปซูล"];

// Default static datasets per period — used when no date selection requires generation
export const reportDataByPeriod: Record<Period, ReportPoint[]> = {
  daily: [
    { label: "00:00", sales: 0,    orders: 0, visits: 12,  newCust: 0, repeat: 0, units: 0,  revenue: 0,    cost: 0,   discount: 0,  topProduct: "-" },
    { label: "04:00", sales: 120,  orders: 1, visits: 18,  newCust: 1, repeat: 0, units: 2,  revenue: 120,  cost: 66,  discount: 0,  topProduct: "ใบบัวบกแคปซูล" },
    { label: "08:00", sales: 480,  orders: 3, visits: 65,  newCust: 2, repeat: 1, units: 8,  revenue: 480,  cost: 264, discount: 40, topProduct: "ขมิ้นชันแคปซูล" },
    { label: "12:00", sales: 980,  orders: 5, visits: 80,  newCust: 3, repeat: 2, units: 14, revenue: 980,  cost: 539, discount: 80, topProduct: "ฟ้าทะลายโจร" },
    { label: "16:00", sales: 1200, orders: 9, visits: 105, newCust: 2, repeat: 1, units: 22, revenue: 1200, cost: 660, discount: 60, topProduct: "น้ำผึ้งดอกลำไย" },
    { label: "20:00", sales: 720,  orders: 5, visits: 60,  newCust: 3, repeat: 2, units: 11, revenue: 720,  cost: 396, discount: 30, topProduct: "ชาเก๊กฮวยออร์แกนิก" },
  ],
  weekly: [
    { label: "สัปดาห์ที่ 1", sales: 6420,  orders: 38, visits: 1180, newCust: 14, repeat: 9,  units: 42, revenue: 6420,  cost: 3531,  discount: 480, topProduct: "ขมิ้นชันแคปซูล" },
    { label: "สัปดาห์ที่ 2", sales: 8950,  orders: 54, visits: 1620, newCust: 22, repeat: 16, units: 68, revenue: 8950,  cost: 4922,  discount: 720, topProduct: "ฟ้าทะลายโจร" },
    { label: "สัปดาห์ที่ 3", sales: 11240, orders: 68, visits: 1985, newCust: 28, repeat: 21, units: 95, revenue: 11240, cost: 6182,  discount: 920, topProduct: "น้ำผึ้งดอกลำไย" },
    { label: "สัปดาห์ที่ 4", sales: 9780,  orders: 59, visits: 1745, newCust: 19, repeat: 18, units: 81, revenue: 9780,  cost: 5379,  discount: 810, topProduct: "ชาเก๊กฮวยออร์แกนิก" },
    { label: "สัปดาห์ที่ 5", sales: 4380,  orders: 26, visits: 820,  newCust: 8,  repeat: 6,  units: 28, revenue: 4380,  cost: 2409,  discount: 320, topProduct: "น้ำมันมะพร้าวสกัดเย็น" },
  ],
  monthly: Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const seed = (day * 31 + 5) >>> 0;
    const sales = day <= 5 ? [320, 780, 0, 460, 150][i] ?? 0 : 0;
    const orders = sales > 0 ? Math.max(1, Math.round(sales / 200)) : 0;
    const units = sales > 0 ? Math.max(1, Math.round(sales / 145)) : 0;
    return {
      label: String(day),
      sales, orders, units,
      revenue: sales,
      cost: Math.round(sales * 0.55),
      visits: sales > 0 ? 80 + (seed % 380) : 0,
      newCust: sales > 0 ? (seed % 6) : 0,
      repeat: sales > 0 ? (seed % 8) : 0,
      discount: Math.round(sales * 0.05),
      topProduct: tops[seed % tops.length],
    };
  }),
  yearly: [
    { label: "2565", sales: 124800, orders: 845,  visits: 18420, newCust: 285, repeat: 412, units: 685,  revenue: 124800, cost: 68640,  discount: 8200,  topProduct: "ขมิ้นชันแคปซูล" },
    { label: "2566", sales: 168450, orders: 1124, visits: 24680, newCust: 342, repeat: 568, units: 924,  revenue: 168450, cost: 92648,  discount: 11200, topProduct: "น้ำผึ้งดอกลำไย" },
    { label: "2567", sales: 215300, orders: 1486, visits: 32150, newCust: 458, repeat: 742, units: 1248, revenue: 215300, cost: 118415, discount: 14800, topProduct: "ฟ้าทะลายโจร" },
    { label: "2568", sales: 248920, orders: 1672, visits: 38240, newCust: 524, repeat: 868, units: 1492, revenue: 248920, cost: 136906, discount: 17500, topProduct: "ขมิ้นชันแคปซูล" },
    { label: "2569", sales: 86420,  orders: 542,  visits: 12180, newCust: 184, repeat: 268, units: 542,  revenue: 86420,  cost: 47531,  discount: 5840,  topProduct: "ชาเก๊กฮวยออร์แกนิก" },
  ],
  custom: [
    { label: "ธ.ค.",  sales: 0,    orders: 0,   visits: 1520, newCust: 0,  repeat: 0,  units: 0,  revenue: 0,    cost: 0,    discount: 0,   topProduct: "-" },
    { label: "ม.ค.",  sales: 0,    orders: 0,   visits: 1820, newCust: 0,  repeat: 0,  units: 0,  revenue: 0,    cost: 0,    discount: 0,   topProduct: "-" },
    { label: "ก.พ.",  sales: 0,    orders: 0,   visits: 2410, newCust: 0,  repeat: 0,  units: 0,  revenue: 0,    cost: 0,    discount: 0,   topProduct: "-" },
    { label: "มี.ค.", sales: 3680, orders: 15,  visits: 4820, newCust: 9,  repeat: 5,  units: 36, revenue: 3680, cost: 2024, discount: 320, topProduct: "ขมิ้นชันแคปซูล" },
    { label: "เม.ย.", sales: 0,    orders: 0,   visits: 1680, newCust: 0,  repeat: 0,  units: 0,  revenue: 0,    cost: 0,    discount: 0,   topProduct: "-" },
    { label: "พ.ค.",  sales: 641,  orders: 4,   visits: 1080, newCust: 3,  repeat: 1,  units: 6,  revenue: 641,  cost: 353,  discount: 60,  topProduct: "ฟ้าทะลายโจร" },
  ],
};

// Generate one ReportPoint deterministically from a seed + scale
function genPoint(label: string, seed: number, scale: "hour" | "day" | "week" | "month" | "year"): ReportPoint {
  const baseSales =
    scale === "hour"  ? 50  + (seed % 1500) :
    scale === "day"   ? 200 + (seed % 3500) :
    scale === "week"  ? 4000 + (seed % 9000) :
    scale === "month" ? 18000 + (seed % 60000) :
                        80000 + (seed % 250000);
  const orders =
    scale === "hour"  ? Math.max(0, (seed % 18) - 5) :
    scale === "day"   ? 1 + (seed % 18) :
    scale === "week"  ? 25 + (seed % 50) :
    scale === "month" ? 80 + (seed % 280) :
                        500 + (seed % 1500);
  const visits =
    scale === "hour"  ? 30 + (seed % 380) :
    scale === "day"   ? 50 + (seed % 480) :
    scale === "week"  ? 800 + (seed % 1500) :
    scale === "month" ? 2400 + (seed % 6800) :
                        12000 + (seed % 40000);
  const units =
    scale === "hour"  ? Math.round(orders * 2.5) :
    scale === "day"   ? 1 + (seed % 28) :
    scale === "week"  ? 25 + (seed % 80) :
    scale === "month" ? 80 + (seed % 280) :
                        500 + (seed % 1500);
  const sales = baseSales;
  const cost = Math.round(sales * 0.55);
  const newCust =
    scale === "hour"  ? seed % 7 :
    scale === "day"   ? seed % 7 :
    scale === "week"  ? 8 + (seed % 25) :
    scale === "month" ? 30 + (seed % 80) :
                        180 + (seed % 500);
  const repeat =
    scale === "hour"  ? seed % 9 :
    scale === "day"   ? seed % 9 :
    scale === "week"  ? 6 + (seed % 18) :
    scale === "month" ? 25 + (seed % 60) :
                        250 + (seed % 700);
  return {
    label, sales, orders, visits, newCust, repeat, units,
    revenue: sales, cost,
    discount: Math.round(sales * 0.05),
    topProduct: tops[seed % tops.length],
  };
}

export function buildReportData(args: {
  period: Period;
  dailyRange?: DateRange;
  selectedDate: Date;
  monthRange: { from: number; to: number; year: number };
  yearRange: { from: number; to: number };
  today: Date;
}): ReportPoint[] {
  const { period, dailyRange, selectedDate, monthRange, yearRange, today } = args;

  if (period === "daily") {
    const from = dailyRange?.from ?? today;
    const to = dailyRange?.to ?? today;
    const isRange = !!(from && to && to.getTime() !== from.getTime());
    if (!isRange) return reportDataByPeriod.daily;
    const out: ReportPoint[] = [];
    let cur = new Date(from); let i = 0;
    while (cur.getTime() <= to.getTime() && i < 92) {
      const d = cur.getDate(); const m = cur.getMonth() + 1;
      const seed = ((d * 31 + m * 17 + cur.getFullYear()) >>> 0);
      out.push(genPoint(`${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}`, seed, "day"));
      cur.setDate(cur.getDate() + 1); i++;
    }
    return out;
  }

  if (period === "weekly") {
    const year = selectedDate.getFullYear(); const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthShort = thaiMonthsShort[month];
    const weeks: ReportPoint[] = [];
    let weekNum = 1;
    for (let startDay = 1; startDay <= daysInMonth; startDay += 7) {
      const endDay = Math.min(startDay + 6, daysInMonth);
      const seed = ((startDay * 31 + month * 17 + year) >>> 0);
      weeks.push(genPoint(`สัปดาห์ที่ ${weekNum++} (${startDay}-${endDay} ${monthShort})`, seed, "week"));
    }
    return weeks;
  }

  if (period === "monthly") {
    const year = monthRange.year;
    const isRange = monthRange.from !== monthRange.to;
    if (!isRange) {
      const m = monthRange.from;
      const daysInMonth = new Date(year, m + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, i) => {
        const day = i + 1;
        const seed = ((day * 31 + m * 17 + year) >>> 0);
        return genPoint(String(day), seed, "day");
      });
    }
    const months: ReportPoint[] = [];
    for (let m = monthRange.from; m <= monthRange.to; m++) {
      const seed = ((m * 47 + year) >>> 0);
      months.push(genPoint(thaiMonthsShort[m], seed, "month"));
    }
    return months;
  }

  if (period === "yearly") {
    const fromYear = Math.min(yearRange.from, yearRange.to);
    const toYear = Math.max(yearRange.from, yearRange.to);
    const isRange = fromYear !== toYear;
    if (!isRange) {
      return Array.from({ length: 12 }, (_, m) => {
        const seed = ((m * 47 + fromYear) >>> 0);
        return genPoint(thaiMonthsShort[m], seed, "month");
      });
    }
    const years: ReportPoint[] = [];
    for (let y = fromYear; y <= toYear; y++) {
      const seed = ((y * 73) >>> 0);
      years.push(genPoint(String(y + 543), seed, "year"));
    }
    return years;
  }

  return reportDataByPeriod[period];
}
