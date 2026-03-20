import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../store/AuthContext";
import { ChevronLeft, Store, Bell, Truck } from "lucide-react";
import { toast } from "sonner";
import imgLogo from "figma:asset/74096b155d57ea010019b7c7582451c862160695.png";
import imgThaiPost from "figma:asset/abeb9c66722ed46a330a72254347776f83a06d35.png";
import imgKerry from "figma:asset/4bd7479b6d460823113bed1e63aa59635e44889b.png";
import imgFlash from "figma:asset/99777e028092284d9d5e16e0183e6cbcb8c385f5.png";
import imgDHL from "figma:asset/9ce997a9911937728e9277c6192377fc345a3a15.png";
import imgJT from "figma:asset/9627f70566a93994285725fe9e9aa9efa3f89bf5.png";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

type SectionId = "shop_info" | "notifications" | "shipping";

const settingsSections: { id: SectionId; label: string; icon: any }[] = [
  { id: "shop_info", label: "ข้อมูลร้านค้า", icon: Store },
  { id: "notifications", label: "การแจ้งเตือน", icon: Bell },
  { id: "shipping", label: "การจัดส่ง", icon: Truck },
];

/* ========== SIDEBAR ========== */
function SettingsSidebar({ active, onSelect, collapsed, onToggle }: {
  active: SectionId; onSelect: (id: SectionId) => void; collapsed: boolean; onToggle: () => void;
}) {
  const activeStyle = { backgroundImage: "linear-gradient(90deg, rgba(49,151,84,0.1) 0%, rgba(49,151,84,0.1) 100%), linear-gradient(90deg, #fff 0%, #fff 100%)" };

  return (
    <aside className={`shrink-0 p-4 transition-all duration-300 ${collapsed ? "w-[80px]" : "w-[250px]"}`}>
      <div className="bg-white rounded-[16px] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`flex items-center h-[77px] ${collapsed ? "justify-center px-2" : "justify-between pl-4 pr-0"}`}>
          {!collapsed && (
            <p className={`${font} text-[16px] text-[#0a0a0a]`} style={{ fontWeight: 500 }}>ตั้งค่า</p>
          )}
          <button onClick={onToggle} className="backdrop-blur-[2px] bg-white/50 shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] rounded-l-full size-[24px] flex items-center justify-center cursor-pointer shrink-0">
            <ChevronLeft className={`size-3 text-[#999] ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Menu */}
        <nav className={`pb-6 space-y-2.5 ${collapsed ? "px-2" : "px-4"}`}>
          {settingsSections.map((s) => {
            const Icon = s.icon;
            const isActive = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                title={collapsed ? s.label : undefined}
                className={`w-full flex items-center ${collapsed ? "justify-center p-2" : "gap-2.5 pl-2 pr-2 py-2"} rounded-[200px] cursor-pointer transition-colors ${!isActive ? "bg-white hover:bg-gray-50" : ""}`}
                style={isActive ? activeStyle : {}}
              >
                <div className={`size-[28px] rounded-full flex items-center justify-center shrink-0 ${isActive ? "bg-[#319754]" : "bg-[#f5f5f5]"}`}>
                  <Icon className={`size-3 ${isActive ? "text-white" : "text-black/85"}`} />
                </div>
                {!collapsed && (
                  <span className={`${font} text-[14px] ${isActive ? "text-[#319754]" : "text-black"}`} style={{ fontWeight: 500 }}>
                    {s.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

/* ========== DIVIDER ========== */
function Divider() {
  return (
    <div className="h-0 relative w-full">
      <div className="absolute inset-[-1px_0_0_0]">
        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
          <line stroke="#D4D4D8" x2="1094" y1="0.5" y2="0.5" />
        </svg>
      </div>
    </div>
  );
}

/* ========== EDIT BUTTON ========== */
function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="bg-[#f5f5f5] flex gap-2.5 items-center justify-center px-4 py-1 rounded-full cursor-pointer shrink-0 hover:bg-[#eee] transition-colors">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M12 0H0V12H12V0Z" fill="black" opacity="0" /><path d="M10.1464 1.14645C9.95118 0.951184 9.63459 0.951184 9.43934 1.14645L1.5 9.08578V10.5H2.91421L10.8536 2.56066C11.0488 2.36541 11.0488 2.04882 10.8536 1.85357L10.1464 1.14645Z" fill="black" fillOpacity="0.85" /></svg>
      <span className={`${font} text-[12px] text-black`}>แก้ไข</span>
    </button>
  );
}

/* ========== SAVE/CANCEL BUTTONS ========== */
function SaveCancelButtons({ onSave, onCancel }: { onSave: () => void; onCancel: () => void }) {
  return (
    <div className="flex gap-2.5 shrink-0">
      <button onClick={onCancel} className="border border-[#ff3b30] text-[#ff3b30] px-5 py-1.5 rounded-full text-[13px] cursor-pointer hover:bg-red-50 transition-colors" style={{ fontWeight: 500 }}>ยกเลิก</button>
      <button onClick={onSave} className="bg-[#319754] text-white px-5 py-1.5 rounded-full text-[13px] cursor-pointer hover:bg-[#2a8248] transition-colors" style={{ fontWeight: 500 }}>บันทึก</button>
    </div>
  );
}

/* ========== INFO BADGE ========== */
function InfoBadge({ text }: { text: string }) {
  return (
    <div className="flex gap-2 items-center w-full">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
        <path d="M14 0H0V14H14V0Z" fill="#8E8E93" opacity="0" />
        <path d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM6.25 4.5V3.5H7.75V4.5H6.25ZM6.25 10.5V6H7.75V10.5H6.25Z" fill="#8E8E93" />
      </svg>
      <p className={`${font} text-[12px] text-[#8e8e93] flex-1`}>{text}</p>
    </div>
  );
}

/* ========== SHOP INFO SECTION ========== */
function ShopInfoSection() {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("METAHERB Store");
  const [email, setEmail] = useState("METAHERB@gmail.com");
  const [phone, setPhone] = useState("090-000-0000");

  const handleSave = () => { setEditing(false); toast.success("บันทึกข้อมูลร้านค้าเรียบร้อย"); };

  return (
    <div className="bg-white rounded-[16px] overflow-hidden p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ข้อมูลร้านค้า</p>
        {!editing ? <EditButton onClick={() => setEditing(true)} /> : <SaveCancelButtons onSave={handleSave} onCancel={() => setEditing(false)} />}
      </div>
      <Divider />
      <div className="flex gap-4 items-start">
        {/* Profile image */}
        <div className="flex flex-col gap-4 items-center shrink-0 w-[400px]">
          <div className="size-[150px] shrink-0">
            <img src={imgLogo} alt="Store" className="size-full rounded-full object-cover" />
          </div>
          <div className="flex flex-col gap-4 items-center p-4">
            <button className="bg-[#319754] h-10 px-4 rounded-full text-white text-[14px] cursor-pointer hover:bg-[#2a8248] transition-colors">
              เปลี่ยนรูปโปรไฟล์
            </button>
            <p className={`${font} text-[14px] text-black text-center`}>
              รองรับไฟล์: JPEG, PNG, GIF, WebP<br />ขนาดไม่เกิน: 5MB
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          <FieldDisplay label="ชื่อร้านค้า" value={name} editing={editing} onChange={setName} />
          <FieldDisplay label="อีเมล" value={email} editing={editing} onChange={setEmail} />
          <FieldDisplay label="เบอร์โทรศัพท์" value={phone} editing={editing} onChange={setPhone} />
        </div>
      </div>
    </div>
  );
}

function FieldDisplay({ label, value, editing, onChange }: { label: string; value: string; editing: boolean; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className={`${font} text-[14px] text-[#999]`} style={{ fontWeight: 500 }}>{label}</p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`bg-[#fafafa] rounded-full px-6 py-3 text-[14px] ${font} outline-none border border-gray-200`}
          style={{ fontWeight: 500 }}
        />
      ) : (
        <div className="h-12 flex items-center py-3 pr-6">
          <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{value}</p>
        </div>
      )}
    </div>
  );
}

/* ========== STORE ADDRESS SECTION ========== */
function StoreAddressSection() {
  const [editing, setEditing] = useState(false);
  const [address, setAddress] = useState("แขวงราษฎรบูรณะ เขตราษฎร์บรณะ จังหวัด กรุงเทพมหานคร 10140");
  const [detail, setDetail] = useState("บ้านเลขที่ 459/153 หมู่บ้านนิวไฮบ์ สุขสวัสดิ์ ถนนสุขสวัสด");

  const handleSave = () => { setEditing(false); toast.success("บันทึกที่อยู่ร้านค้าเรียบร้อย"); };

  return (
    <div className="bg-white rounded-[16px] overflow-hidden p-4 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2.5 flex-1">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ที่อยู่ร้านค้า</p>
          <InfoBadge text="ใช้แสดงตำแหน่งหรือที่ตั้งหลักของร้านค้า ข้อมูลนี้อาจปรากฏในหน้าโปรไฟล์ร้าน และใช้สำหรับอ้างอิงทางธุรกิจ โปรดระบุข้อมูลให้ถูกต้องและครบถ้วน" />
        </div>
        {!editing ? <EditButton onClick={() => setEditing(true)} /> : <SaveCancelButtons onSave={handleSave} onCancel={() => setEditing(false)} />}
      </div>
      <Divider />
      <FieldDisplay label="ที่อยู่" value={address} editing={editing} onChange={setAddress} />
      <FieldDisplay label="รายละเอียดที่อยู่" value={detail} editing={editing} onChange={setDetail} />
    </div>
  );
}

/* ========== NOTIFICATIONS SECTION ========== */
function NotificationsSection() {
  const [settings, setSettings] = useState({
    orders: true,
    promotions: false,
    messages: true,
    productStatus: true,
    reviews: true,
    system: true,
  });

  const toggle = (key: keyof typeof settings) =>
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => { toast.success("บันทึกการตั้งค่าการแจ้งเตือนเรียบร้อย"); };

  const items: { key: keyof typeof settings; label: string; desc: string }[] = [
    { key: "orders", label: "คำสั่งซื้อ", desc: "แจ้งเตือนเมื่อมีคำสั่งซื้อใหม่ หรือสถานะเปลี่ยนแปลง" },
    { key: "promotions", label: "โปรโมชัน", desc: "แจ้งเตือนโปรโมชันและส่วนลดพิเศษ" },
    { key: "messages", label: "ข้อความแชท", desc: "แจ้งเตือนเมื่อมีข้อความใหม่จากลูกค้า" },
    { key: "productStatus", label: "สถานะสินค้า", desc: "แจ้งเตือนเมื่อสินค้าใกล้หมดหรือหมดสต็อก" },
    { key: "reviews", label: "รีวิวสินค้า", desc: "แจ้งเตือนเมื่อมีรีวิวใหม่จากลูกค้า" },
    { key: "system", label: "ระบบ", desc: "แจ้งเตือนการอัปเดตและการบำรุงรักษาระบบ" },
  ];

  return (
    <div className="bg-white rounded-[16px] overflow-hidden p-4 flex flex-col gap-4">
      <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ตั้งค่าการแจ้งเตือน</p>
      <Divider />
      <div className="space-y-1">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between py-3.5 border-b border-gray-50 last:border-b-0">
            <div>
              <p className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>{item.label}</p>
              <p className={`${font} text-[12px] text-gray-400 mt-0.5`}>{item.desc}</p>
            </div>
            <ToggleSwitch enabled={settings[item.key]} onToggle={() => toggle(item.key)} />
          </div>
        ))}
      </div>
      <div className="pt-2">
        
      </div>
    </div>
  );
}

/* ========== TOGGLE SWITCH ========== */
function ToggleSwitch({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`w-16 h-7 rounded-full cursor-pointer transition-colors relative shrink-0 p-0.5 flex items-center ${enabled ? "bg-[#34c759]" : "bg-[rgba(60,60,67,0.3)]"}`}
    >
      <div className={`w-[39px] h-6 bg-white rounded-full shadow transition-transform ${enabled ? "translate-x-[22px]" : "translate-x-0"}`} />
    </button>
  );
}

/* ========== STEPPER INPUT ========== */
function StepperInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="bg-[#fafafa] h-12 rounded-full w-full flex items-center justify-between pl-6 pr-2 py-3">
      <input
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!isNaN(n)) onChange(Math.max(0, n));
        }}
        className={`bg-transparent text-[14px] ${font} outline-none w-full`}
      />
      <div className="h-8 shrink-0 w-[92px] relative flex items-center rounded-full overflow-hidden">
        {/* Separator */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1 h-6 w-px bg-[rgba(60,60,67,0.3)] rounded-lg" />
        {/* Decrement */}
        <button
          onClick={() => onChange(Math.max(0, value - 50))}
          className="flex-1 h-full bg-[rgba(116,116,128,0.08)] rounded-l-full flex items-center justify-center cursor-pointer hover:bg-[rgba(116,116,128,0.15)] transition-colors"
        >
          <span className="text-[17px] text-black leading-none select-none">−</span>
        </button>
        {/* Increment */}
        <button
          onClick={() => onChange(value + 50)}
          className="flex-1 h-full bg-[rgba(116,116,128,0.08)] rounded-r-full flex items-center justify-center cursor-pointer hover:bg-[rgba(116,116,128,0.15)] transition-colors"
        >
          <span className="text-[17px] text-black leading-none select-none">+</span>
        </button>
      </div>
    </div>
  );
}

/* ========== SHIPPING SECTION ========== */
function ShippingSection() {
  const [editing, setEditing] = useState(true);
  const [freeShippingMin, setFreeShippingMin] = useState(0);
  const [baseShippingCost, setBaseShippingCost] = useState(0);
  const [carriers, setCarriers] = useState([
    { name: "ไปรษณีย์ไทย", img: imgThaiPost, enabled: true },
    { name: "Kerry Express", img: imgKerry, enabled: true },
    { name: "Flash Express", img: imgFlash, enabled: false },
    { name: "DHL Express", img: imgDHL, enabled: false },
    { name: "J&T Express", img: imgJT, enabled: false },
  ]);

  const toggleCarrier = (idx: number) => {
    setCarriers((prev) => prev.map((c, i) => i === idx ? { ...c, enabled: !c.enabled } : c));
  };

  const handleSave = () => { setEditing(false); toast.success("บันทึกการตั้งค่าการจัดส่งเรียบร้อย"); };

  return (
    <div className="bg-white rounded-[16px] overflow-hidden p-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-2.5 flex-1">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ตั้งค่าการจัดส่ง</p>
          <InfoBadge text="กำหนดยอดส่งฟรีและขนส่งที่ร้านใช้บริการ" />
        </div>
        {!editing ? (
          <EditButton onClick={() => setEditing(true)} />
        ) : (
          <div className="flex gap-2.5 shrink-0">
            <button onClick={() => setEditing(false)} className="border border-[#ff3b30] text-[#ff3b30] px-4 py-1 rounded-full text-[12px] cursor-pointer hover:bg-red-50 transition-colors">ยกเลิก</button>
            <button onClick={handleSave} className="bg-[#319754] text-white px-4 py-1 rounded-full text-[12px] cursor-pointer hover:bg-[#2a8248] transition-colors">บันทึก</button>
          </div>
        )}
      </div>
      <Divider />

      {/* Shipping costs - 3 col grid */}
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <p className={`${font} text-[14px] text-[#090909]`} style={{ fontWeight: 500 }}>ยอดสั่งซื้อขั้นต่ำที่ส่งฟรี (บาท)</p>
          {editing ? (
            <StepperInput value={freeShippingMin} onChange={setFreeShippingMin} />
          ) : (
            <div className="h-12 flex items-center py-3 pl-6">
              <p className={`${font} text-[14px] text-black`}>{freeShippingMin}</p>
            </div>
          )}
          <InfoBadge text="ตั้งค่าเป็น 0 เพื่อปิดส่งฟรี (เช่น 500 = ฟรีเมื่อซื้อครบ 500 บาท)" />
        </div>
        <div className="flex flex-col gap-2">
          <p className={`${font} text-[14px] text-[#090909]`} style={{ fontWeight: 500 }}>ค่าจัดส่งเริ่มต้น (บาท)</p>
          {editing ? (
            <StepperInput value={baseShippingCost} onChange={setBaseShippingCost} />
          ) : (
            <div className="h-12 flex items-center py-3 pl-6">
              <p className={`${font} text-[14px] text-black`}>{baseShippingCost}</p>
            </div>
          )}
          <InfoBadge text="ใช้เมื่อไม่มี shipping rate ที่ตรงกับน้ำหนักสินค้า" />
        </div>
      </div>

      <Divider />

      {/* Carriers */}
      <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ขนส่งที่ร้านใช้บริการ</p>
      <div className="grid grid-cols-3 gap-4">
        {carriers.map((c, i) => (
          <div key={c.name} className="bg-[#fafafa] rounded-[16px] p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="size-10 rounded-lg overflow-hidden shrink-0 relative">
                <div className="absolute bg-[#f2f2f7] inset-0 rounded-lg" />
                <img src={c.img} alt={c.name} className="absolute size-full object-cover rounded-lg" />
              </div>
              <p className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>{c.name}</p>
            </div>
            <ToggleSwitch enabled={c.enabled} onToggle={() => toggleCarrier(i)} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== MAIN ========== */
export function SettingsPage() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<SectionId>("shop_info");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={`flex min-h-screen bg-[#fafafa] ${font}`}>
      <SettingsSidebar
        active={activeSection}
        onSelect={setActiveSection}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Content */}
      <div className="flex-1 px-4">
        {/* Page title */}
        <div className="flex items-center h-[100px]">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>
            {activeSection === "shop_info" ? "ข้อมูลร้านค้า" : activeSection === "notifications" ? "การแจ้งเตือน" : "การจัดส่ง"}
          </p>
        </div>

        {/* Section content */}
        <div className="flex flex-col gap-4 pb-8">
          {activeSection === "shop_info" && (
            <>
              <ShopInfoSection />
              <StoreAddressSection />
            </>
          )}
          {activeSection === "notifications" && <NotificationsSection />}
          {activeSection === "shipping" && <ShippingSection />}
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;