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

---

# 📌 Changelog / ส่วนเพิ่มเติม

## v1.1 — 11/05/69 (11 พฤษภาคม 2569)

**ผู้พัฒนา:** ณัฐพงษ์ ธีโรภาส

### เพิ่มฟีเจอร์: Page Home Builder (จัดการเว็บไซต์ → หน้าหลัก)

ตำแหน่งโค้ด: [src/app/pages/AdminDashboard.tsx](src/app/pages/AdminDashboard.tsx) — component `PageHomeBuilder`

ฟีเจอร์สำหรับให้ admin จัดวาง / ปรับแต่ง layout ของหน้า Landing Page ผ่าน wireframe builder

### 10.1 โครงสร้าง

```
PageHomeBuilder
├── Canvas (ซ้าย)           ← wireframe preview ของ section
│   └── Toolbar             ← view toggle (Desktop / Tablet / Mobile)
└── Sidebar (ขวา)           ← controls: show/hide + reorder + reset/save
```

**Section ทั้งหมด 6 ส่วน** (อ้างอิงตาม [HomePage.tsx](src/app/pages/HomePage.tsx)):
1. **Banner** — main banner + side banners
2. **หมวดหมู่** — แถบไอคอนหมวดหมู่
3. **สินค้าแนะนำ** — grid สินค้า
4. **Flash Sale** — grid สินค้า + countdown
5. **บทความแนะนำ** — card บทความ
6. **วีดีโอแนะนำ** — grid วีดีโอ

### 10.2 ฟีเจอร์หลัก

| ฟีเจอร์ | คำอธิบาย |
|---|---|
| **Wireframe Preview** | wireframe โทน gray ทั้งหมด (skeleton-style) — ไม่ใส่รูปจริง สื่อแค่โครงสร้าง |
| **Responsive View Toggle** | สลับมุมมอง Desktop (1600px) / Tablet (820px) / Mobile (420px) — transition smooth ทุกทิศทาง (`transition-[max-width] 500ms`) |
| **Drag & Drop Reorder** | ลาก section ได้ทั้งบน canvas และ sidebar — ใช้ HTML5 native drag API |
| **Ghost Placeholder Preview** | ขณะลาก section ที่กำลังลากจะย้ายไปอยู่ตำแหน่งที่จะวางจริง (faded + dashed border + chip "วาง '<ชื่อ>' ที่นี่") sections อื่นๆ slide ตาม |
| **Show/Hide Sections** | toggle eye icon เปิด-ปิดการแสดงแต่ละ section ได้ทั้งจาก canvas และ sidebar |
| **Per-Section Settings** | ปุ่ม gear (Settings) เปิด Popover ปรับแต่งเฉพาะ section |
| **Reset / Save** | ปุ่ม "รีเซ็ตทั้งหมด" + "บันทึก" ที่ sidebar (reset เปิดเฉพาะตอน dirty) |

### 10.3 Settings ต่อ Section

| Section | ปรับได้ |
|---|---|
| Banner | `showSideBanners` (toggle), `sideBannerPosition` (ซ้าย/ขวา) |
| หมวดหมู่ | `compact` (ขนาดเล็ก), `showLabels` (แสดงชื่อ) + **drag-reorder หมวดหมู่ภายใน section** + ปุ่ม "รีเซ็ต section นี้" |
| สินค้าแนะนำ | `desktopCols` (3–6) |
| Flash Sale | `desktopCols` (3–6), `showCountdown` (toggle) |
| บทความ | `desktopCols` (2–4) |
| วีดีโอ | `desktopCols` (3–6) |

> **หมายเหตุ:** Tablet ใช้ 4 cols / Articles ใช้ 2 cols, Mobile ใช้ 2 cols / Articles เป็น stack แนวตั้ง — ไม่ปรับได้

### 10.4 Section หมวดหมู่ — ฟีเจอร์พิเศษ

- **ดึงข้อมูลจาก `DEFAULT_CATEGORIES`** (module-level constant) — 9 หมวดหมู่ (สมุนไพร, อาหาร, ยา, เครื่องหอม, ความสวย, ชุดของขวัญ, ชาสมุนไพร, อาหารเสริม, น้ำมันสกัด)
- **Drag-reorder ได้ภายใน section** (state แยกจาก section-level drag — มี `e.stopPropagation()` กันชน)
- **Wireframe style** — วงกลม `bg-gray-200`, icon `text-gray-500` (ไม่มีสี brand)
- **ปุ่ม reset เฉพาะ section นี้** (อยู่ใน Settings popover) — รีเซ็ตทั้ง config + ลำดับหมวดหมู่

> 🔧 **Dev TODO:** `DEFAULT_CATEGORIES` ควรย้ายเป็น shared source — เชื่อมต่อหน้า "จัดการหมวดหมู่สินค้า" (sidebar: `products_categories`) ในอนาคต

### 10.5 State หลักใน `PageHomeBuilder`

```ts
sections      : HomeSection[]      // ลำดับ + visibility ของ section
configs       : SectionConfigs     // settings ของแต่ละ section
categories    : HomeCategory[]     // ลำดับหมวดหมู่
view          : ViewMode           // "desktop" | "tablet" | "mobile"

// Section drag state
dragId, overId, overPos            // drag-and-drop state

// Category drag state (แยก)
catDragId, catOverId, catOverPos
```

**Preview reordering (ghost placeholder):**
- `previewSections` / `previewSidebar` / `previewCategories` — คำนวณลำดับใหม่ระหว่างลากโดยไม่แตะ source state จนกว่าจะปล่อย

### 10.6 ข้อจำกัด / ที่ต้องทำต่อ

| รายการ | Priority |
|---|---|
| Persist layout — ตอนนี้รีเฟรชจะสูญข้อมูล (ควรเก็บเข้า DB / localStorage) | High |
| Wire ปุ่ม "บันทึก" กับ backend จริง (ตอนนี้แสดงแค่ toast) | High |
| ดึง `DEFAULT_CATEGORIES` จาก source ร่วมกับหน้าจัดการหมวดหมู่ | Medium |
| Touch drag support สำหรับ tablet/mobile (ตอนนี้ใช้ HTML5 native — รองรับ mouse เท่านั้น) | Medium |
| Per-section preview customization — เช่น preview แบบใส่รูปจริง | Low |

---

## v1.2 — 12/05/69 (12 พฤษภาคม 2569)

**ผู้พัฒนา:** ณัฐพงษ์ ธีโรภาส

### เพิ่ม Page Builder ครบ 4 หน้า ใน "จัดการเว็บไซต์"

ตำแหน่งโค้ดทั้งหมดอยู่ใน [src/app/pages/AdminDashboard.tsx](src/app/pages/AdminDashboard.tsx)

| Builder | Sidebar item | Component |
|---|---|---|
| หน้าหลัก *(v1.1)* | `page_home` | `PageHomeBuilder` |
| **ผลิตภัณฑ์ทั้งหมด** | `page_products` | `PageProductsBuilder` |
| **สาระความรู้ทั้งหมด** | `page_blog` | `PageBlogBuilder` |
| **เกี่ยวกับเรา** | `page_about` | `PageAboutBuilder` |

### 11.1 PageProductsBuilder — หน้าผลิตภัณฑ์ทั้งหมด

โครงสร้าง **single section** (ไม่มี drag-reorder เพราะหน้าจริงมี Filter+Grid เท่านั้น)

**Settings ที่แก้ได้ (จัดกลุ่ม 4 หมวด):**
- **Filter Sidebar** — แสดง/ซ่อน, ตำแหน่งซ้าย/ขวา
- **Filter ที่แสดง** — toggle 8 ตัว: หมวดหมู่ / ประเภทสินค้า / ช่วงราคา / เรียงตาม / แบรนด์ / Rating / ส่วนลด / สต็อก
- **การ์ดสินค้า** — toggle 7 ตัว: ราคาเดิม / Badge ส่วนลด / Badge Flash Sale / Rating / จำนวนขาย / Wishlist / Quick View
- **Grid / Pagination** — คอลัมน์ Desktop (3–5), จำนวนต่อหน้า (12/24/48/96), โหมด pagination/loadMore

> ใช้ `products` จาก [data/products.ts](src/app/data/products.ts) ตรง ๆ ในการ render preview

### 11.2 PageBlogBuilder — หน้าสาระความรู้

**2 sections** (drag-reorder + show/hide):
- **บทความ** — desktopCols (1–3 / 2–5 ขึ้นกับ layout), showSort, itemsPerPage, paginationMode, **cardLayout: horizontal/vertical**, card content toggles (viewCount/date/category/description/readMore)
- **วีดีโอ** — desktopCols (4–6), showSort

> ใช้ข้อมูลจริงจาก [BlogPage.tsx](src/app/pages/BlogPage.tsx) ที่ export `articles`, `videos` ออกมา

### 11.3 PageAboutBuilder — หน้าเกี่ยวกับเรา

**5 sections** ตามโครงสร้างจริงของ [AboutPage.tsx](src/app/pages/AboutPage.tsx) (drag-reorder + show/hide + inline editing):

| Section | จุดเด่นที่ปรับได้ |
|---|---|
| **Hero** | Badge / Headline 3 บรรทัด (สลับสีขาว-เขียวอ่อน) / Subtitle 2 บรรทัด / CTA 2 ปุ่ม / **Video URL** + Image fallback |
| **เรื่องราวของเรา (Story)** | Badge / Title 1+2 (italic) / Description / Main + Floating image / Features 3 ข้อ (title+desc) |
| **ความไว้วางใจที่สร้างจากมาตรฐาน (Trust)** | Heading 2 บรรทัด / Show product cards + certifications toggle / 4 cert chips (อย./Organic/ISO/GMP) — **product cards ดึงจาก products จริงไม่ต้อง edit** |
| **พันธกิจ (Mission)** | Image + Top overlay text 2 บรรทัด / Quote + Description / **Stats 4 ใบ** (value+label) ที่คอลัมน์ขวา |
| **ติดต่อเรา (Contact)** | Heading 2 บรรทัด + subtitle / Contact info (label+value+sub × 3) / Social cards (name+handle × 4) / **Contact form** (heading + sub + submit text) |

**Inline editing helpers** ใหม่ใน Settings popover (ขยาย w-[340px], max-h-[420px] scrollable):
- `TextField` — single-line input + focus ring
- `TextareaField` — 2-row textarea
- `ImageField` — URL + thumbnail preview
- `FieldGroup` — section header uppercase tracking + divider

### 11.4 Save Confirmation Dialog (ทุก builder)

ทุก builder กดปุ่ม "บันทึก" → เปิด **Dialog** แสดง **real preview** (ไม่ใช่ wireframe):

โครงสร้างซ้อน 3 ชั้นในทุก dialog:
```
Dialog
└── BrowserMockup (chrome: ⚪🔴🟡 + nav + URL)
    └── SitePreviewFrame (header + footer ของจริงจาก Layout.tsx)
        └── <Page-specific preview> (จริงทุกพิกเซล — สี/ภาพ/ฟ้อนต์)
```

**Components ที่เพิ่ม:**
- `BrowserMockup` — มี traffic light dots, URL bar, จำลอง browser chrome
- `SitePreviewFrame` — copy header (logo, search, badges, green nav) + footer (3-col, social SVGs, copyright) จาก [Layout.tsx](src/app/components/Layout.tsx) แบบ static (ไม่ติดต่อ context จริง)
- **Device toggle ใน dialog** — สลับ Desktop/Tablet/Mobile preview ก่อนยืนยัน

**Dialog max-width:** ขยายเป็น **1500px** (max-w-95vw clamp) เพื่อให้เห็นภาพชัด

### 11.5 Shared data + helpers ใหม่

| ของเดิม → ใหม่ | จุดประสงค์ |
|---|---|
| `SAFE_PRODUCT_IMAGES` (11 Unsplash URLs) | fallback เมื่อ `product.image` เป็นค่าว่าง |
| `pickProductImage(p, idx)` | คืน `p.image` หรือ Unsplash ตาม index (mirror ของ HomePage) |
| `HOME_BANNER_IMAGES` | ภาพ banner สำหรับ Hero preview |
| BlogPage `articles`, `videos` (เปลี่ยนเป็น `export const`) | reuse ใน preview ทุกหน้า |
| `realProducts`, `realArticles`, `realVideos` imports | เลิก hardcode sample data — ใช้ source จริงทั้งหมด |

### 11.6 ข้อจำกัด / ที่ต้องทำต่อ

| รายการ | Priority |
|---|---|
| **Trust section product cards** — wire กับ products API ที่กรอง `isBestSeller`, `isNew`, `isPopular` | High |
| **About page** — refactor เป็น config-driven จริง (ปัจจุบัน config อยู่แค่ใน builder, AboutPage ยัง hardcode) | High |
| **Contact form** — ตอนนี้ใน preview เป็นแค่ static UI ยังไม่ submit จริง | High |
| Video upload สำหรับ Hero (ปัจจุบันรับ URL อย่างเดียว) | Medium |
| Theme tokens (สี brand) — ดึงจาก central config ให้ทุกหน้าใช้ตรงกัน | Medium |
| Color picker ใน Trust สำหรับ product tag colors (ตอนนี้ removed แล้วแต่อาจกลับมาเมื่อ wire กับ API) | Low |
| Image upload จริง (ตอนนี้รับ URL อย่างเดียว) | Low |

### 11.7 ตำแหน่งโค้ดอ้างอิง

- `BrowserMockup`, `SitePreviewFrame` — ~บรรทัด 990–1170 ของ [AdminDashboard.tsx](src/app/pages/AdminDashboard.tsx)
- `PageProductsBuilder` + `ProductsListPreview` — ~1820–2300
- `PageBlogBuilder` + `BlogArticlesPreview` / `BlogVideosPreview` — ~2380–2900
- `PageAboutBuilder` + `AboutFullPreview` + per-section configs — ~3200–4200
- `TextField` / `TextareaField` / `ImageField` / `FieldGroup` — ~3300

---

## v1.2 — 12/05/69 — ส่วนเสริม

**Sample image declaration:** เพิ่ม `declare module "*.png"` ใน [src/figma-assets.d.ts](src/figma-assets.d.ts) เพื่อให้ TS รู้จัก import `imgLogo` จาก `src/assets/logo.png`

