## Implementation Consistency

### Component Reuse Principle

**Rule (revised):** ถ้า UI component หนึ่งใช้งาน **≥ 3 ที่** + **look + behavior เหมือนกันจริง ๆ** → extract เป็น **shared component** แล้ว `import` ไปใช้

> Sandi Metz: *"Duplication is far cheaper than the wrong abstraction."* — ถ้า extract ผิด แก้ยากกว่า copy/paste

**Why extract (เมื่อทำถูกที่):**
- UI + behavior ต้องเหมือนกันทุกที่ที่ใช้ (Jakob's Law + Consistency Heuristic) → ผู้ใช้เรียนรู้ครั้งเดียวใช้ได้ทุกที่
- ลด visual drift — แก้ที่ source เดียวเปลี่ยนทุกที่อัตโนมัติ
- ลด code duplication → bug surface น้อยลง → maintenance ง่าย

**Decision Checklist (เช็คก่อน extract):**
1. ⬜ ใช้งานจริง **≥ 3 ที่** หรือเปล่า? (Rule of Three — รอจน pattern ชัด)
2. ⬜ Behavior **เหมือนกัน 100%** ไหม? (ไม่ใช่แค่ดูคล้ายกัน)
3. ⬜ ออกแบบ props ได้ **≤ 7 ตัว** ไหม? (ถ้าเกิน = abstraction ผิด)
4. ⬜ ถ้าอนาคต variant แตกต่างมาก สามารถ **inline กลับได้** ไหมโดยไม่ใหญ่โต?

ตอบ "ไม่" ข้อใดข้อหนึ่ง → **ยังอย่า extract** เก็บ duplicate ไว้ก่อน

**How to apply:**
1. **ก่อน**เขียน component ใหม่ → search `src/components/` (หรือ design system folder ของโปรเจค) ก่อนว่ามีของเดิมใช้ได้ไหม
2. ผ่าน checklist → extract เข้า shared component folder
3. หน้า 2 ต้องการ variant ต่างจากของเดิมเล็กน้อย → **เพิ่ม prop** ให้ของเดิม ไม่ fork สร้างใหม่ (แต่ถ้า prop เริ่มเกิน 7 ตัว → คิดใหม่ อาจเป็น 2 component คนละตัวจริง ๆ)
4. ตรวจ shared component เป็นระยะ — ถ้า variant ห่างกันมากเรื่อย ๆ → กล้า split กลับ

**Common candidates (UI ที่มักใช้หลายที่):**
Button, Input, Card (Product/Order/etc.), Modal/BottomSheet, Toast, Avatar, Badge, Pill, Icon button, Tab pill, Filter chip, List row, Empty state, Loader/Skeleton

**Anti-patterns ห้ามทำ:**
- ❌ Copy/paste component จากหน้าหนึ่งไปอีกหน้าหนึ่ง (ครบ 3 ที่ค่อย extract)
- ❌ Extract ตอน 2 instance แรก โดยไม่รู้ว่า variant จริง ๆ จะมีกี่แบบ → premature abstraction
- ❌ ใส่ prop เพื่อ accommodate ทุก variant — เมื่อ **props > 7 ตัว** = สัญญาณว่า abstraction ผิด ให้ split
- ❌ Force share เมื่อ behavior ต่างกัน (เช่น "ดูเหมือน button" แต่ตัวหนึ่งเปิด modal ตัวหนึ่ง navigate)
- ❌ สร้าง `LocalButton` ในหน้า A และ `MyButton` ในหน้า B ที่เกือบเหมือนกัน
- ❌ Hardcode style/color/padding ซ้ำในหลายไฟล์ (ใช้ design token แทน — token ไม่ต้อง ≥ 3)
- ❌ Refactor ครึ่งทาง — เหลือของเดิม + ของใหม่อยู่ในโปรเจคพร้อมกัน (ต้องลบ legacy ทันที)

**When NOT to extract:**
- Component < 20 บรรทัด + ใช้ ≤ 2 ที่ → duplicate ถูกกว่า
- Visual ดูคล้ายกัน แต่ semantic ต่าง (เช่น "card" สำหรับ product vs notification)
- Variant อาจแตกต่างกันในอนาคตที่คาดเดาไม่ได้

**Tokens vs Components:**
- ค่าพื้นฐาน (color, spacing, radius, font size) → **design token** (ไม่ต้องรอ rule of three)
- โครงสร้างประกอบ (button, card, header) → **component** (รอ rule of three)

**Scope:** กฎนี้ใช้กับ**ทุกโปรเจค** (web / mobile / native) — ไม่ปรับตาม project

---

## Accessibility — Color Contrast (WCAG)

### Rule
สีของ **content ที่ผู้ใช้ต้องอ่าน/ใช้งานจริง** ต้องผ่าน **WCAG 2.1 Level AA**:
- Normal text (< 18pt) : contrast ratio **≥ 4.5:1**
- Large text (≥ 18pt / ≥ 14pt bold) : **≥ 3:1**
- UI components / icons / borders : **≥ 3:1** กับ bg

### Apply to (บังคับใช้)
- Body text, label, placeholder, helper text
- Button text + icon
- Form input (border, text, label, error message)
- Navigation items (tab, menu, breadcrumb)
- Interactive icons (back, cart, heart, search, ฯลฯ)
- Status indicators (badge count, dot, chip)
- Link text
- Focus indicator (outline / ring)

### Exemptions (ยกเว้น — ตาม WCAG 1.4.3 + brand policy)
- **Brand colors ที่ใช้เพื่อ identity เท่านั้น** — เช่น banner bg, hero section, splash screen
- **Logo** — ห้ามบังคับเปลี่ยนสีแบรนด์
- **Pure decoration** — watermark, ลายพื้นหลัง, gradient ตกแต่ง
- **Disabled state** — WCAG ไม่บังคับ disabled elements
- **Inactive UI** ที่ผู้ใช้ไม่ต้อง interact
- **Marketing content** ที่ผู้ใช้ดูผ่าน ๆ ไม่ต้องอ่านเนื้อหา

### When brand color conflicts with WCAG (priority order)
1. **คงสีแบรนด์ — ปรับ foreground:** เช่น brand-color bg → ใส่ text สีขาว/ดำที่ ratio ผ่าน
2. **เพิ่ม non-color affordance:** ใส่ icon + label + pattern → ผู้ใช้ที่ตาบอดสีก็เข้าใจได้
3. **สร้าง variant สำหรับ accessible context:** เช่น `BRAND` (decorative) + `BRAND_AA` (text/critical UI)
4. **Document exception:** ถ้าจำเป็นต้องคง brand สีในตำแหน่งที่ไม่ผ่าน → comment + เหตุผลใน code

### Don't rely on color alone (WCAG 1.4.1)
ข้อมูลทุกอย่างที่บอกผ่านสี ต้องบอกด้วยช่องทางอื่น **อย่างน้อย 1 ช่อง** เพิ่ม:
- Icon + label
- Pattern / texture
- Text status
- Position / shape

### Color blindness check
- Test pair `red/green` เป็นพิเศษ (8% ของผู้ชาย, 0.5% ของผู้หญิง affected)
- ใช้ Sim Daltonism, Stark plugin (Figma), Chrome DevTools rendering tab

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Stark plugin (Figma)
- Chrome DevTools → Lighthouse Accessibility
- macOS Accessibility Inspector

### Decision flow (ก่อน design / dev)
1. ⬜ Element นี้ผู้ใช้ต้องอ่าน/กด/รับ info ไหม → ใช่ = บังคับ WCAG AA
2. ⬜ ใช่ brand color บังคับใช้ไหม → ใช่ = ปรับ foreground หรือเพิ่ม affordance
3. ⬜ Decorative อย่างเดียวไหม → ใช่ = exempt (แต่ยังต้องคิด context)
4. ⬜ Info พึ่งสีอย่างเดียวไหม → ใช่ = เพิ่ม icon/label/pattern อีก 1 ช่อง

**Scope:** กฎนี้ใช้กับ**ทุกโปรเจค** (web/mobile/native) — เนื้อหาที่ผู้ใช้ต้องใช้งานต้องผ่าน AA, ตกแต่ง/แบรนด์ identity ยกเว้น

---

**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->
