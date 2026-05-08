# Metaherb — เอกสารส่งมอบงาน (Dashboard & Report)

> เอกสารนี้สรุปฟังก์ชันและรูปแบบการทำงานของหน้า **Dashboard** และ **Report** ทั้งหมดในระบบหลังบ้านร้านค้า (Owner) เพื่อให้นักพัฒนาเอาไปต่อยอด

ไฟล์หลักทั้งหมดอยู่ใน [src/app/pages/OwnerDashboard.tsx](src/app/pages/OwnerDashboard.tsx) (ไฟล์เดียวขนาดใหญ่ — แต่ละ tab แยกเป็น sub-component)

---

## 1. ภาพรวมโครงสร้าง

```
OwnerDashboard (export)        ← root component, จัดการ activeTab + state รวม
├── OverviewTab                 ← /owner (Dashboard)
├── OrdersTab + OrderDetailTab  ← จัดการออเดอร์
├── ProductsTab + AddProductTab ← จัดการสินค้า
├── FlashSaleTab + FlashEventDetail + AddFlashSaleModal
├── PromotionsTab / CouponsTab
├── FinanceTab + BankSettings
├── ComplaintsTab + ComplaintDetailTab
└── Reports
    ├── ReportSalesTab          ← รายงานผลยอดขาย
    ├── ReportCustomersTab      ← รายงานข้อมูลลูกค้า
    ├── ReportProductsTab       ← รายงานข้อมูลสินค้า
    └── ReportMarketTab         ← รายงานข้อมูลตลาด
```

**State หลัก** (อยู่ใน `OwnerDashboard()`):
- `activeTab: OwnerTab` — ใช้สลับหน้า, ค่าเริ่มต้น `"overview"`
- `orders: Order[]` — รายการออเดอร์ (มาจาก `mockOrders` + sync ผ่าน `OrderContext`)
- `selectedFlashEvent` / `flashEventIsNewJoin` — context ของ Flash Sale event ที่เปิดดู

**Sidebar pattern:** เมื่ออยู่ subpage (เช่น `flash_event`, `order_detail`) sidebar จะ highlight parent menu — ผ่าน `subpageToParent` map

---

## 2. หน้า Dashboard (`OverviewTab`)

ตำแหน่งโค้ด: [OwnerDashboard.tsx:4219](src/app/pages/OwnerDashboard.tsx#L4219)

### โครงสร้าง 4 ส่วนหลัก

```
┌──────────────────────────────────────────────────────────┐
│ 1. Wallet card (ซ้าย, 50%)        2. Order tracker (ขวา) │
│   - ยอดพร้อมถอน                       6 ปุ่มสถานะออเดอร์    │
│   - Escrow + รายได้สะสม               (รอชำระ → ยกเลิก)   │
│   - ปุ่มถอนเงิน                                            │
├──────────────────────────────────────────────────────────┤
│ 3. Calendar/Heatmap (ซ้าย)    4. KPI cards (ขวา)         │
│   - สลับ monthly/yearly         - ยอดขาย                  │
│   - Cell สี = ระดับยอดขาย         - ยอดเข้าชม + คำสั่งซื้อ   │
│   - คลิกวัน → popup รายการขาย      - Sub-level (วันละ/เดือน)│
└──────────────────────────────────────────────────────────┘
```

### พฤติกรรมสำคัญ
| ส่วน | การทำงาน |
|---|---|
| **Wallet** | แสดงยอด 3 ตัว (พร้อมถอน, escrow, สะสม) ใช้ `<AnimatedValue>` (count-up animation) ตอน mount |
| **Order tracker** | คลิก card → เรียก `onViewOrders(filterId)` ไปหน้า Orders พร้อม filter พร้อมใช้ |
| **Calendar Heatmap** | จัดสีจาก `heatData` (level 1-5 → 5 สีแดง) ค่า monthly: รายวัน, yearly: รายเดือน |
| **Sales/Visit/Order cards** | ค่าเปลี่ยนอัตโนมัติตาม `viewMode` (monthly ↔ yearly) + เปอร์เซ็นต์ delta เทียบช่วงก่อน |
| **Sales detail popup** | คลิก "ดูรายละเอียด" → เปิด modal ตาราง top products + lock body scroll |

### Mock data
ทั้งหมดเป็น **constant ใน function** — `monthlySalesData`, `monthlyVisits`, `monthlyOrders`, `heatData`, `monthlyHeatData`

> 🔧 **Dev TODO:** แทน mock data ด้วย API call (suggest React Query) — refer ฟังก์ชัน `pct(curr, prev)` สำหรับคำนวณ % delta

---

## 3. หน้า Report

มี 4 รายงานย่อย เลือกผ่าน sidebar `Report > ...`

### 3.1 ReportSalesTab — รายงานผลยอดขาย
ตำแหน่ง: [OwnerDashboard.tsx:5801](src/app/pages/OwnerDashboard.tsx#L5801)

**ฟิลเตอร์ช่วงเวลา (`period`):**
- `daily` — เลือกวันเดียว / ช่วงวัน
- `weekly` — สัปดาห์ในเดือน
- `monthly` — เลือกเดือน / ช่วงเดือน (กด 2 ครั้ง = range)
- `yearly` — ปีเดียว / ช่วงปี
- `custom` — ปฏิทิน range picker

**Charts (สลับ 3 แบบ):**
- `line` — กราฟเส้น
- `bar` — แท่ง
- `pie` — วงกลม

**ตาราง Top Products:**
- เรียงได้ 5 แบบ: `sales_desc | sales_asc | qty_desc | margin_desc | stock_asc`
- Pagination (`productPage`, `productPerPage`)

**ปุ่ม Export:** แสดง icon `Excel` + `PDF` แต่ปัจจุบัน `console.log("export...")` — ยังไม่ wire จริง

### 3.2 ReportCustomersTab — รายงานข้อมูลลูกค้า
ตำแหน่ง: [OwnerDashboard.tsx:6940](src/app/pages/OwnerDashboard.tsx#L6940)

แสดง:
- กราฟลูกค้าใหม่ vs ลูกค้าประจำ
- ตาราง top customers + lifetime value
- KPIs: จำนวนลูกค้า, อัตราการกลับมาซื้อซ้ำ
- ใช้ filter pattern เดียวกับ ReportSales

### 3.3 ReportProductsTab — รายงานข้อมูลสินค้า
ตำแหน่ง: [OwnerDashboard.tsx:7780](src/app/pages/OwnerDashboard.tsx#L7780)

แสดง:
- top selling products
- กราฟยอดขายรายสินค้า
- ตารางสต็อก + อัตราการเคลื่อนไหว

### 3.4 ReportMarketTab — รายงานข้อมูลตลาด
ตำแหน่ง: [OwnerDashboard.tsx:8711](src/app/pages/OwnerDashboard.tsx#L8711)

แสดง:
- ส่วนแบ่งตลาด (market share)
- Trend หมวดสินค้า

### รูปแบบร่วมของทุก Report
| Pattern | คำอธิบาย |
|---|---|
| **Period selector** | กลุ่มปุ่ม pill (รายวัน/สัปดาห์/เดือน/ปี/กำหนดเอง) — กด range พุ่ม 2 click |
| **Date picker** | ใช้ `react-day-picker` ผ่าน component `<Calendar>` ใน popover |
| **Chart library** | `recharts` (LineChart, BarChart, PieChart, ComposedChart) |
| **Export buttons** | UI พร้อม แต่ logic ยังเป็น `console.log` |
| **Mock data builder** | `buildReportData()` ใน [src/app/data/reportMockData.ts](src/app/data/reportMockData.ts) สร้าง dataset ตาม period |

> 🔧 **Dev TODO:**
> 1. Wire Excel export — แนะนำ `xlsx` หรือ server-side generation
> 2. Wire PDF — แนะนำ `jspdf` + `jspdf-autotable` หรือ Puppeteer
> 3. Replace `buildReportData()` ด้วย API + ใส่ loading skeleton

---

## 4. Mock Data Sources (สำหรับ dev mapping API)

| Mock | ตำแหน่ง | ใช้ใน |
|---|---|---|
| `mockProducts` | OwnerDashboard.tsx:135 | Products, Add Flash Sale |
| `mockVariants` | OwnerDashboard.tsx:114 | Add Flash Sale (ตัวเลือกสินค้า) |
| `mockFlashEvents` (function `getMockFlashEvents()`) | OwnerDashboard.tsx:184 | Flash Sale list — generate 12 events ต่อปี (M.M ของแต่ละเดือน) |
| `mockFlashProducts` | OwnerDashboard.tsx:172 | Flash Event Detail table |
| `mockOrders` | OrderContext (src/app/store/OrderContext.tsx) | ทั้งระบบ orders |
| `buildReportData()` | src/app/data/reportMockData.ts | Reports |

---

## 5. การ Routing & Navigation

**ภายใน OwnerDashboard:**
- ใช้ local state `activeTab` (ไม่ใช่ React Router) — แต่ละ tab swap จาก state เดียว
- ส่ง callback `onViewOrders / onViewEvent / onAddProduct` ระหว่าง parent ↔ child
- Parent ↔ Subpage state (เช่น `selectedOrderId`, `selectedFlashEvent`) เก็บไว้ที่ root

**ระหว่าง pages:**
- React Router (`/login`, `/`, `/owner`) — ใน [src/main.tsx](src/main.tsx) หรือ App routing

---

## 6. UI Design System (Tailwind)

| Token | Color |
|---|---|
| Brand green | `#319754` (primary), `#287745` (hover), `#008c45` (CTA) |
| Brand red (Flash Sale) | `#e62e05`, `#bc1b06` |
| Status (order) | pending: `#f59e0b`, ready: `#3b82f6`, success: `#10b981`, danger: `#ff3b30` |
| Text | `#101828` (primary), `#8e8e93` (muted) |
| Surface | `#fafafa`, `#fafbfc` (subtle), `#ffffff` |

**Font:** `IBM Plex Sans Thai Looped` ผ่าน `font` constant

**Animation:** ใช้ `motion/react` (Framer Motion) — pattern: `whileHover` + `whileTap` + `transition spring`

---

## 7. การ Build & Deploy

```bash
npm install        # install deps
npm run dev        # dev server (vite)
npm run build      # production build (output: dist/)
```

**Deploy:** GitHub Pages ผ่าน `.github/workflows/deploy.yml` — push to `main` = auto deploy

URL ที่ deploy: https://oommiemie.github.io/Metaherb/

---

## 8. ข้อจำกัด / สิ่งที่ต้องทำต่อ

| รายการ | Priority |
|---|---|
| Excel/PDF Export ใน Report | High |
| API integration (ตอนนี้ทุก mock อยู่ใน frontend) | High |
| Auth จริง (ตอนนี้ login mock บัญชี `user@test.com / 12345678`) | High |
| Bundle size > 500kB — ควร code-split ตาม route ด้วย dynamic `import()` | Medium |
| Order persistence — ตอนนี้รีเฟรชจะสูญข้อมูลที่แก้ | Medium |
| Real-time countdown ใน Flash Sale (ตอนนี้ tick ทุก 1 วินาที — ควร debounce/throttle ถ้า scale) | Low |
| Notification / toast — ใช้ `sonner` แล้ว แต่บางจุดยังไม่ wire | Low |

---

## 9. ไฟล์สำคัญสำหรับ dev

- [src/app/pages/OwnerDashboard.tsx](src/app/pages/OwnerDashboard.tsx) — โค้ดหลักทั้งหมด (~9,500 lines)
- [src/app/store/OrderContext.tsx](src/app/store/OrderContext.tsx) — order state management
- [src/app/store/AuthContext.tsx](src/app/store/AuthContext.tsx) — auth mock
- [src/app/data/reportMockData.ts](src/app/data/reportMockData.ts) — report data builder
- [src/app/components/Layout.tsx](src/app/components/Layout.tsx) — main layout (sidebar + header)
- [src/imports/SideBar.tsx](src/imports/SideBar.tsx) — sidebar navigation

> **คำแนะนำสำหรับ dev:** ไฟล์ `OwnerDashboard.tsx` ใหญ่มาก ควร refactor แยกเป็นไฟล์ย่อยตาม tab ก่อนเริ่มเขียนฟีเจอร์ใหม่ — เพื่อ maintainability + lazy loading
