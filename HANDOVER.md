# MetaHerb — Handover Documentation

> Project: e-commerce + admin/owner dashboards for MetaHerb (Thai herbal products)
> Stack: **React 18 + TypeScript + Vite + Tailwind CSS + react-router + motion/react + Recharts + Radix UI + Sonner (toasts)**
> Repo: https://github.com/oommiemie/Metaherb
> Production: https://oommiemie.github.io/Metaherb/ (auto-deploys on push to `main` via GitHub Pages)

---

## Table of contents
1. [Project structure](#1-project-structure)
2. [i18n / Translation system](#2-i18n--translation-system)
3. [Unified Appbar](#3-unified-appbar)
4. [Profile Dialog](#4-profile-dialog)
5. [Footer](#5-footer)
6. [Layered page headers (behind appbar)](#6-layered-page-headers-behind-appbar)
7. [Dashboard updates (Owner + Admin)](#7-dashboard-updates)
8. [Filter Tab Pills (shared animated tabs)](#8-filter-tab-pills)
9. [Form / Card design system](#9-form--card-design-system)
10. [Asset registry](#10-asset-registry)
11. [Build / Deploy](#11-build--deploy)
12. [Pending work](#12-pending-work)

---

## 1) Project structure

```
src/
├── assets/                         # PNG / images (logos, mock photos, leaf watermarks, QR, payment, etc.)
├── app/
│   ├── routes.tsx                  # createBrowserRouter + Providers nesting
│   ├── components/
│   │   ├── Layout.tsx              # Appbar + Footer + ProfileDialog + global helpers
│   │   ├── ChatModal.tsx
│   │   ├── NotificationDropdown.tsx
│   │   ├── OrderTimeline.tsx
│   │   ├── Skeleton.tsx
│   │   └── figma/ImageWithFallback.tsx
│   ├── store/
│   │   ├── AuthContext.tsx         # user/role + login/logout + switchRole
│   │   ├── CartContext.tsx
│   │   ├── OrderContext.tsx
│   │   ├── WishlistContext.tsx
│   │   ├── NotificationContext.tsx
│   │   ├── ChatContext.tsx
│   │   ├── ShopContext.tsx
│   │   ├── RecentlyViewedContext.tsx
│   │   └── LanguageContext.tsx     # ⭐ NEW — i18n provider
│   ├── pages/                      # all routes
│   │   ├── HomePage.tsx
│   │   ├── ProductsPage.tsx        # filter system, search, pagination
│   │   ├── ProductDetailPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── PaymentPage.tsx
│   │   ├── VerifyPaymentPage.tsx
│   │   ├── OrdersPage.tsx          # tabs, status pills, modals
│   │   ├── BlogPage.tsx / BlogDetailPage.tsx
│   │   ├── CouponPage.tsx / MyCouponsPage.tsx
│   │   ├── WishlistPage.tsx
│   │   ├── AboutPage.tsx           # hero video extending behind appbar
│   │   ├── AccountPage.tsx / AddressPage.tsx
│   │   ├── ComplaintSelectPage.tsx / ComplaintFormPage.tsx / ComplaintStatusPage.tsx
│   │   ├── ShopProfilePage.tsx
│   │   ├── LoginPage.tsx / RegisterPage.tsx
│   │   ├── SettingsPage.tsx        # shop owner settings (large, ~1.3k lines)
│   │   ├── OwnerDashboard.tsx      # shop owner panel (~10k lines)
│   │   └── AdminDashboard.tsx      # platform admin panel (~25k+ lines)
│   └── data/products.ts            # static products data
└── imports/                        # auto-generated SVG paths from Figma
```

---

## 2) i18n / Translation system

### File: `src/app/store/LanguageContext.tsx`

Hand-rolled i18n (no external dep). Three languages: `th` / `en` / `zh` (Simplified Chinese).

### How it works
```ts
const { lang, setLang, t } = useLanguage();
// lang: "th" | "en" | "zh"
// setLang(code): switches language + writes to localStorage
// t("key"): returns translated string, falls back to TH on missing
```

### Storage
- Key: `metaherb-lang` in `localStorage`
- On mount: reads stored lang, defaults to `"th"`
- On change: writes to localStorage + updates `document.documentElement.lang`

### Type safety
```ts
export type TKey = keyof typeof translations.th;
// All 3 dictionaries (th/en/zh) MUST have identical keys or TS errors
```

### Provider chain (see `routes.tsx`)
`<LanguageProvider>` wraps **all** other providers — must be outermost so any page/component can call `useLanguage()`.

### Adding a new key
1. Open `LanguageContext.tsx`
2. Add the same key to all 3 dictionaries (TH first, then EN, ZH)
3. Use `{t("your_new_key")}` in JSX
4. TypeScript will catch if any language is missing the key

### Key naming convention
Prefix by page/section:
- `menu_*` / `button_*` / `search_*` — appbar
- `footer_*` — footer
- `common_*` — shared UI strings
- `login_*` / `register_*`
- `home_*` / `products_*` / `pd_*` (product detail) / `cart_*` / `pay_*` / `orders_*`
- `blog_*` / `coupon_*` / `wishlist_*` / `about_*` / `account_*` / `address_*`
- `cf_*` / `cs_*` (complaint form / select)
- `owner_*` / `admin_*` / `settings_*` — dashboards

### Where the dropdown lives
Layout.tsx — the "ไทย / English / 中文" pill in the green strip (lang row above the white pill).
Uses Framer Motion `AnimatePresence` for open/close.

### Translation coverage status
- ✅ Customer pages (21 pages) + Layout (appbar + footer) + shared components — fully translated
- 🟡 Owner Dashboard / Admin Dashboard / SettingsPage — ~40-90% translated (sidebar + top tabs + main lists done; deep sub-components like report charts, page builders, RTE editor labels remain)
- ⚠️ Mock data (product names, customer names, order IDs, addresses in mock arrays) — intentionally NOT translated (treated as data)

---

## 3) Unified Appbar

### File: `src/app/components/Layout.tsx` → `NonStaffHeader` const

Used for **all roles** (customer / owner / admin). Replaces the old separate StaffHeader.

### Structure
```
<header sticky top-0 z-50>
  ├─ Green strip (absolute top-0, h-80, gradient)
  └─ Wrapper (relative, pt-20, flex-col gap-6, items-end)
      ├─ Lang dropdown row (ไทย ▾)
      └─ Pill ref container (pillRef)
          ├─ White pill (overlapping bottom of green strip)
          │   ├─ Mobile menu button
          │   ├─ Logo + brand + role badge (owner/admin)
          │   ├─ Menu tabs (centered, role-based items)
          │   └─ Right group: search + bell + cart + profile/login
          ├─ Notification dropdown (hover preview, anchored under pill)
          ├─ Cart dropdown (hover preview, anchored under pill)
          ├─ Profile dialog (hover/click preview, anchored under pill)
          └─ Search suggestions dropdown (AnimatePresence)
```

### Key behaviors

**Search button (desktop)**: Click → pill morphs into an inline search bar with `AnimatePresence mode="wait"`. Shows suggestions dropdown below pill. ESC or click outside closes.
- State: `pillSearchOpen`, `pillSearchQuery`
- Ref: `pillRef` (for outside-click detection)

**Hover previews (Bell / Cart / Profile)**:
- State per icon: `notifHovered` / `cartHovered` / `profileHovered`
- Open with `setTimeout` debouncing (180ms) so the mouse can travel from button to preview without flicker
- Functions: `openNotif()` / `closeNotif()` etc.
- Anchored under the pillRef container — so dropdown appears below pill, not directly under each icon

**Role badge** (next to logo in pill, hidden on mobile):
- Owner: 🟠 orange gradient + Store icon + "ร้านค้า"
- Admin: 🔵 blue gradient + Shield icon + "แอดมิน"
- Customer: no badge

**Profile button ring** (matches role color):
```ts
isOwner: linear-gradient(135deg, #fb923c, #f97316, #c2410c)  // orange
isAdmin: linear-gradient(135deg, #60a5fa, #3b82f6, #1d4ed8)  // blue
default: linear-gradient(135deg, #46c474, #319754)           // green
```

**Menu items** (role-based, defined in Layout):
```ts
userMenuItems  = [Home, Products, Articles] + "เกี่ยวกับเรา"
ownerMenuItems = [Overview, Shop, Settings]
adminMenuItems = [Overview, Content, Pages, Settings]
menuItems = isOwner ? owner : isAdmin ? admin : user
```

**Active tab animation**: Uses `motion.div layoutId="topnav-bg"` so the active pill background springs smoothly between tabs.

**Auto-redirect**: When logged in as owner/admin and on a customer page → auto-redirect to `/owner` or `/admin` (effect in Layout).

---

## 4) Profile Dialog

### Component: `ProfileDialog` (inside Layout.tsx)

### Sections (in order)
1. **Header** — role-based gradient banner
   - Avatar 58px with white ring
   - Username + email + role chip
   - Decorative blur orbs

2. **User role only**: Order statuses grid (4 columns)
   ```ts
   { label: "รอชำระเงิน", Icon: Wallet,          count: 2,  tint: "#f97316" }  // orange
   { label: "รอตรวจสอบ", Icon: ClipboardCheck,  count: 1,  tint: "#0ea5e9" }  // sky
   { label: "รอจัดส่ง",   Icon: Package,         count: 12, tint: "#a855f7" }  // purple
   { label: "จัดส่งแล้ว", Icon: Truck,           count: 1,  tint: "#319754" }  // brand green
   ```

3. **Menu links** (role-specific):
   - User: บัญชีของฉัน, ที่อยู่จัดส่ง, สินค้าที่ชอบ, คูปองของฉัน
   - Owner: ภาพรวมร้านค้า, คำสั่งซื้อ, จัดการสินค้า, หน้าร้าน, คูปอง, ตั้งค่า, กลับสู่เว็บไซต์หลัก
   - Admin: ภาพรวมระบบ, รายงาน, ผู้ใช้, ร้านค้า, Banner, แอดมิน, ตั้งค่าระบบ

4. **Role switch** (testing helper) — bg gray-50/60
   - Shows roles other than current
   - Calls `switchRole(role)` from `AuthContext`

5. **Logout** — red gradient row

### Outside click handler
`useEffect` adds `mousedown` listener to close on outside click.

---

## 5) Footer

### Component: in Layout.tsx (under `{!isStaffRole && (<footer>...)}`)
Customer-only footer (staff doesn't show footer because dashboards are full-screen).

### Structure
```
<footer relative overflow-hidden text-white>
  bg: gradient #143f24 → #0d2a17 → #07180e
  Decorations: top accent line, blur orbs, leaf images (D + A), dot pattern
  ├─ Top accent gradient line
  ├─ Decorative blurs / leaf images (background watermark)
  ├─ Hero brand row (logo + name + tagline + trust badges)
  ├─ 3 boxes grid (md:grid-cols-3)
  │   ├─ Box 1: Contact (MapPin + Phone + Mail in colored containers)
  │   ├─ Box 2: Links (4 policy links with green dot + arrow)
  │   └─ Box 3: Social + QR (4 socials with brand-color hover + QR image)
  └─ Bottom bar (copyright + version pill + payment circles)
```

### Box styling
- bg: `gradient from-black/30 to-black/50` (darker tone)
- rounded-[20px], p-4
- hover: bg darker + green hover border
- Watermark: each box has 1 leaf PNG (opacity 12%) + 1 blur orb

### Payment circles
4 white rounded-full 40×40 with brand-color text:
- VISA (#1a1f71)
- MC (#eb001b)
- PromptPay (PP, #003478)
- TrueMoney (TM, #ff6600)

### QR code
- Image at `src/assets/QRcordline.png`
- size 76px, `self-end` (aligned bottom)
- No white bg/padding (image displays directly)

### Translation keys (all in `footer_*`)
- `footer_tagline` — brand tagline
- `footer_address`
- `footer_link_privacy / terms / howto / shipping`
- `footer_payment` — "ช่องทางชำระเงิน"
- `footer_copyright`
- `footer_legal_terms / privacy / cookies`

### Version pill
- Shows `v{APP_VERSION}` where `APP_VERSION = "1.0.0"` (const at top of Layout.tsx)
- Has animated pulse dot (green glow)
- Update version: change the const value

---

## 6) Layered page headers (behind appbar)

### Pattern (`src/app/pages/*.tsx`)

A page section "extends up behind the appbar" using negative margin + padding:

```jsx
<div className="bg-[#eaf3ee] -mt-[64px] md:-mt-[116px] pt-[72px] md:pt-[124px] pb-3 md:pb-4">
  {/* content */}
</div>
```

- `-mt-[64px]` (mobile) / `md:-mt-[116px]` (desktop) → pulls section UP behind appbar by appbar height
- `pt-[72px]` / `md:pt-[124px]` → pushes content DOWN so it appears below appbar visually
- Result: the bg color (light green) is visible through the appbar's transparent areas (around the white pill)

### Pages using this pattern
- ProductsPage, BlogPage, WishlistPage, CartPage, CouponPage, PaymentPage, OrdersPage

### AboutPage variant
Hero video section uses the same trick but for a VIDEO that extends behind appbar:
```jsx
<section className="relative -mt-[64px] md:-mt-[116px] h-[614px] sm:h-[714px] md:h-[866px] lg:h-[966px] overflow-hidden">
```
Heights are tuned so visible content area below appbar is roughly the original design.

---

## 7) Dashboard updates

### File: `src/app/pages/OwnerDashboard.tsx` + `AdminDashboard.tsx`

### A) Sales report tables — added columns
Both Owner + Admin "รายงานการขายสินค้า" tables now show:

| Column | Color | Formula |
|---|---|---|
| ยอดขาย | black | gross sales |
| **GP** | orange `#c2410c` | `sales × 0.07` (7% platform commission, displayed as `−฿X`) |
| **ส่วนลด** | gold `#a16207` | random 0–17% per row (stable seed from name) |
| **ร้านรับสุทธิ** | brand green `#319754` | `sales − gp` (what shop receives) |
| ต้นทุน | gray | cost |
| กำไร | green/red | `net − cost` + margin% |

Constant: `const GP_RATE = 0.07;` (change for different commission rate)

### B) Product report tables — added columns
- **ยอดส่วนลด** — discount applied per product (random 0–17% of revenue)
- **เฉลี่ย/ชิ้น** — `revenue ÷ sold` (avg revenue per unit)

### C) Customer report (Admin) — date-range filtering
Top customers table now filters by selected period:
```ts
custPeriodMaxDays = {
  daily   → days between dateRange.from..to (or 1)
  weekly  → 7
  monthly → monthRange × 30
  yearly  → yearRange × 365
}
sortedCust = customers.filter(c => c.daysAgo <= custPeriodMaxDays)
                      .filter(c => custGroupFilter === "all" || c.group === custGroupFilter)
                      .sort(...)
```

### D) Customer type filter (Admin)
New dropdown next to the sort dropdown:
- `ประเภทลูกค้า: ทั้งหมด` (default)
- ประจำ / ใหม่ / เสี่ยงหาย / etc. (auto-extracted from data)

### E) KPI card images (Admin Customer report)
Updated `bgArt` images per card:
| Card | Image file |
|---|---|
| ลูกค้าใหม่ · ทุกร้านในระบบ | `new-customer2.png` |
| ลูกค้าซื้อซ้ำ · ทุกร้านในระบบ | `repeat-customers2.png` |
| สมาชิกในระบบทั้งหมด | `new-customer 13.png` |
| LTV เฉลี่ย | `LTV.png` |
| จำนวนขาย · ทุกร้านในระบบ | `All-stores-system.png` |

### F) Marketing report (Admin)
Removed channels:
- ❌ Email (Newsletter)
- ❌ Affiliate / Influencer
Pie sources removed: Email + Referral; rebalanced percentages.

### G) Dashboard heading (Admin overview)
The top "Dashboard / ภาพรวมยอดขาย ลูกค้า และร้านค้าในระบบ" header is hidden via:
```jsx
{activeItem !== "dashboard" && ...other excluded items && (<div>title</div>)}
```

### H) Status badges (orders)
Simplified to single brand color:
```ts
pending_payment/pending_verify/preparing/shipped/delivered/completed: "bg-[#319754] text-white"
cancelled: "bg-gray-400 text-white"
```

### I) Stock badge whitespace
Added `whitespace-nowrap` so "X · เหลือน้อย" stays on one line.

---

## 8) Filter Tab Pills

### Component: `FilterTabPills` in AdminDashboard.tsx (~line 5231)

Generic animated tabs used in Banner / Blog / Video / Popup / Complaints / Products / Reviews / Promotions / Flash / Reviews tabs.

### Active tab style (gradient pill)
```ts
background: linear-gradient(135deg, #3fb56b 0%, #319754 50%, #267a43 100%)
shadow: 0_4px_14px_-2px_rgba(49,151,84,0.55), inset_0_1px_0_rgba(255,255,255,0.25)
```

### Animation
`motion.span layoutId={pillId}` slides between tabs with spring physics (stiffness 380, damping 32).

### Mobile fallback
On `< lg`, shows a single dropdown (Popover) instead of a row of tabs.

---

## 9) Form / Card design system

### `SettingsCard` (in AdminDashboard.tsx)
Used by SiteInfo / Settings sub-pages. Standard wrapper:
- `rounded-[20px]` + `border border-gray-100` + hover shadow
- Header: vertical green accent bar + icon container (gradient bg + border) + title + desc + bottom border

### `FormSection` (in AdminDashboard.tsx)
Same visual language as SettingsCard. Used in product edit forms etc.

### `TextField` / `TextareaField`
- `h-[40px]` (or auto for textarea), `rounded-xl`, `bg-gray-50/50`
- Focus: `border-[#319754]` + `ring-[3px] ring-[#319754]/12`
- Label: `text-[12px] text-gray-600 font-weight-500`

### `select` (inline)
Match TextField styling exactly.

---

## 10) Asset registry

### Logo / Brand
- `logo.png` — main logo

### Footer leaves (botanical watermarks)
- `herb-leaf-a.png` — Box 1 (Contact)
- `herb-leaf-b.png` — Box 2 (Links)
- `herb-leaf-c.png` — Box 3 (Social + QR)
- `herb-leaf-d.png` — Footer background decoration

### QR
- `QRcordline.png` — Line OA QR code (footer Box 3)

### Admin KPI card art
- `new-customer.png`, `new-customer2.png`, `new-customer 13.png` (note space in filename)
- `repeat-customers.png`, `repeat-customers2.png`
- `gourp-customer.png` (typo from original — kept for now)
- `member.png`, `LTV.png`
- `All-stores-system.png`
- `products-sold.png`

### Order status icons (ProfileDialog) — replaced with lucide
Old: `imgOrderPay`, `imgOrderVerify`, `imgOrderShip`, `imgOrderDone`
New: `Wallet`, `ClipboardCheck`, `Package`, `Truck` from `lucide-react`

### Shipping carriers (Settings)
- `Thaipost.png`, `flashexpress.png`, `jt.png`, `kerry.png`

---

## 11) Build / Deploy

### Local dev
```bash
npm install
npm run dev      # http://localhost:5173 (or 5174 if busy)
npm run build    # production build to dist/
```

### Auto-deploy
File: `.github/workflows/deploy.yml`
- Trigger: push to `main`
- Steps: checkout → npm ci → npm run build → cp dist/index.html dist/404.html (for SPA fallback) → upload pages artifact → deploy
- Production URL: https://oommiemie.github.io/Metaherb/

### Vite config
- `BASE_URL` is read in `routes.tsx`:
  ```ts
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";
  ```
  This makes routes work both in dev (`/`) and production (`/Metaherb/`).

### TypeScript
- `tsconfig.json` exists (added recently to declare `figma:asset/*.png` and other module shims)
- Build uses `vite build` directly (no `tsc` step); type errors are reported by IDE / `tsc --noEmit` only.

---

## 12) Pending work

### Translation gaps (have keys in dict but JSX not yet swapped)
**Owner Dashboard** (~468 strings):
- Report chart titles + tooltips
- AddProductTab form (long form, many labels)
- FlashEventDetail screens
- OrderDetailTab modals
- ComplaintDetailTab
- Quill / RTE editor labels

**Admin Dashboard** (~829 strings):
- Same as above plus:
- Banner/Blog/Video editors
- Page builders (PageHomeBuilder, PageProductsBuilder, PageBlogBuilder, PageAboutBuilder)
- SiteInfo_* sub-pages (general / contact / address / social)
- Some report card sub-labels

**SettingsPage**: Mostly done but a few helper text strings remain.

**ShopProfilePage**: Edit profile modal + review form labels still Thai.

### Mock data (intentionally NOT translated)
- Product names in `data/products.ts`
- Customer names, order IDs, SKUs in mock arrays
- Chart bucket labels (months, periods — these are data, not UI)

### Known minor issues
- Chunk size warning on build (3MB JS bundle) — fix with code splitting / `manualChunks` if needed
- TypeScript IDE warnings on `figma:asset/*.png` imports — these resolve at build time via Vite, can ignore
- `gourp-customer.png` has a typo in filename (sic) — kept for compatibility

### How to continue translation
1. Open page file (e.g. `OwnerDashboard.tsx`)
2. Find a Thai string, e.g. `<p>คำสั่งซื้อทั้งหมด</p>`
3. Add key to `LanguageContext.tsx` (all 3 langs)
4. Replace string: `<p>{t("owner_orders_all")}</p>`
5. Make sure `useLanguage` is imported and `const { t } = useLanguage()` is called at top of the function component
6. Run `npx vite build` to verify

---

## Useful constants / colors

```ts
// Layout.tsx
const APP_VERSION = "1.0.0";
const font     = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";
const fontBold = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

// AdminDashboard.tsx
const ADMIN_PRIMARY = "#319754";

// Brand palette
green light   = #46c474
green main    = #319754  (BRAND)
green dark    = #1d5b32
orange (owner) = #fb923c → #f97316 → #c2410c
blue (admin)   = #60a5fa → #3b82f6 → #1d4ed8
red (badges)   = #ff8a8a → #ef4444
gold (review)  = #fbbf24 → #f7931d → #d97706
```

---

## Contact / branch info

- Main branch: `main` (auto-deploy)
- Repo: https://github.com/oommiemie/Metaherb
- Production: https://oommiemie.github.io/Metaherb/
- GitHub Actions: https://github.com/oommiemie/Metaherb/actions

---

_Last updated: 2026-05-16_
