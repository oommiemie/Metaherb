import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, Plus, MoreHorizontal, X, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]"; // v2

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  postalOrSubdistrict: string;
  addressDetail: string;
  isDefault: boolean;
}

const initialAddresses: Address[] = [
  { id: "1", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: true },
  { id: "2", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "3", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "4", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "5", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "6", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "7", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "8", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
  { id: "9", firstName: "username01", lastName: "", phone: "090-000-000", postalOrSubdistrict: "ราษฎร์บูรณะ, ราษฎร์บูรณะ, กรุงเทพมหานคร, 10140", addressDetail: "เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33", isDefault: false },
];

/* ---- Thai address data ---- */
interface ThaiAddress {
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

const thaiAddresses: ThaiAddress[] = [
  { subdistrict: "ราษฎร์บูรณะ", district: "ราษฎร์บูรณะ", province: "กรุงเทพมหานคร", postalCode: "10140" },
  { subdistrict: "บางปะกอก", district: "ราษฎร์บูรณะ", province: "กรุงเทพมหานคร", postalCode: "10140" },
  { subdistrict: "ทุ่งครุ", district: "ทุ่งครุ", province: "กรุงเทพมหานคร", postalCode: "10140" },
  { subdistrict: "บางมด", district: "ทุ่งครุ", province: "กรุงเทพมหานคร", postalCode: "10140" },
  { subdistrict: "บางแค", district: "บางแค", province: "กรุงเทพมหานคร", postalCode: "10160" },
  { subdistrict: "บางแคเหนือ", district: "บางแค", province: "กรุงเทพมหานคร", postalCode: "10160" },
  { subdistrict: "บางไผ่", district: "บางแค", province: "กรุงเทพมหานคร", postalCode: "10160" },
  { subdistrict: "หลักสอง", district: "บางแค", province: "กรุงเทพมหานคร", postalCode: "10160" },
  { subdistrict: "จอมทอง", district: "จอมทอง", province: "กรุงเทพมหานคร", postalCode: "10150" },
  { subdistrict: "บางขุนเทียน", district: "จอมทอง", province: "กรุงเทพมหานคร", postalCode: "10150" },
  { subdistrict: "บางมด", district: "จอมทอง", province: "กรุงเทพมหานคร", postalCode: "10150" },
  { subdistrict: "บางค้อ", district: "จอมทอง", province: "กรุงเทพมหานคร", postalCode: "10150" },
  { subdistrict: "พระโขนง", district: "คลองเตย", province: "กรุงเทพมหานคร", postalCode: "10110" },
  { subdistrict: "คลองเตย", district: "คลองเตย", province: "กรุงเทพมหานคร", postalCode: "10110" },
  { subdistrict: "คลองตัน", district: "คลองเตย", province: "กรุงเทพมหานคร", postalCode: "10110" },
  { subdistrict: "สาทร", district: "สาทร", province: "กรุงเทพมหานคร", postalCode: "10120" },
  { subdistrict: "ยานนาวา", district: "สาทร", province: "กรุงเทพมหานคร", postalCode: "10120" },
  { subdistrict: "ทุ่งมหาเมฆ", district: "สาทร", province: "กรุงเทพมหานคร", postalCode: "10120" },
  { subdistrict: "ทุ่งวัดดอน", district: "สาทร", province: "กรุงเทพมหานคร", postalCode: "10120" },
  { subdistrict: "สีลม", district: "บางรัก", province: "กรุงเทพมหานคร", postalCode: "10500" },
  { subdistrict: "สุริยวงศ์", district: "บางรัก", province: "กรุงเทพมหานคร", postalCode: "10500" },
  { subdistrict: "บางรัก", district: "บางรัก", province: "กรุงเทพมหานคร", postalCode: "10500" },
  { subdistrict: "ปทุมวัน", district: "ปทุมวัน", province: "กรุงเทพมหานคร", postalCode: "10330" },
  { subdistrict: "ลุมพินี", district: "ปทุมวัน", province: "กรุงเทพมหานคร", postalCode: "10330" },
  { subdistrict: "รองเมือง", district: "ปทุมวัน", province: "กรุงเทพมหานคร", postalCode: "10330" },
  { subdistrict: "วังใหม่", district: "ปทุมวัน", province: "กรุงเทพมหานคร", postalCode: "10330" },
  { subdistrict: "จตุจักร", district: "จตุจักร", province: "กรุงเทพมหานคร", postalCode: "10900" },
  { subdistrict: "ลาดยาว", district: "จตุจักร", province: "กรุงเทพมหานคร", postalCode: "10900" },
  { subdistrict: "เสนานิคม", district: "จตุจักร", province: "กรุงเทพมหานคร", postalCode: "10900" },
  { subdistrict: "บางซื่อ", district: "บางซื่อ", province: "กรุงเทพมหานคร", postalCode: "10800" },
  { subdistrict: "วงศ์สว่าง", district: "บางซื่อ", province: "กรุงเทพมหานคร", postalCode: "10800" },
  { subdistrict: "ดินแดง", district: "ดินแดง", province: "กรุงเทพมหานคร", postalCode: "10400" },
  { subdistrict: "ห้วยขวาง", district: "ห้วยขวาง", province: "กรุงเทพมหานคร", postalCode: "10310" },
  { subdistrict: "บางกะปิ", district: "ห้วยขวาง", province: "กรุงเทพมหานคร", postalCode: "10310" },
  { subdistrict: "สามเสนนอก", district: "ห้วยขวาง", province: "กรุงเทพมหานคร", postalCode: "10310" },
  { subdistrict: "ลาดพร้าว", district: "ลาดพร้าว", province: "กรุงเทพมหานคร", postalCode: "10230" },
  { subdistrict: "จรเข้บัว", district: "ลาดพร้าว", province: "กรุงเทพมหานคร", postalCode: "10230" },
  { subdistrict: "บางเขน", district: "บางเขน", province: "กรุงเทพมหานคร", postalCode: "10220" },
  { subdistrict: "อนุสาวรีย์", district: "บางเขน", province: "กรุงเทพมหานคร", postalCode: "10220" },
  { subdistrict: "ท่าเรือ", district: "บางเขน", province: "กรุงเทพมหานคร", postalCode: "10220" },
  { subdistrict: "สายไหม", district: "สายไหม", province: "กรุงเทพมหานคร", postalCode: "10220" },
  { subdistrict: "คลองถนน", district: "สายไหม", province: "กรุงเทพมหานคร", postalCode: "10220" },
  { subdistrict: "ดอนเมือง", district: "ดอนเมือง", province: "กรุงเทพมหานคร", postalCode: "10210" },
  { subdistrict: "สีกัน", district: "ดอนเมือง", province: "กรุงเทพมหานคร", postalCode: "10210" },
  { subdistrict: "หลักสี่", district: "หลักสี่", province: "กรุงเทพมหานคร", postalCode: "10210" },
  { subdistrict: "ทุ่งสองห้อง", district: "หลักสี่", province: "กรุงเทพมหานคร", postalCode: "10210" },
  { subdistrict: "มีนบุรี", district: "มีนบุรี", province: "กรุงเทพมหานคร", postalCode: "10510" },
  { subdistrict: "แสนแสบ", district: "มีนบุรี", province: "กรุงเทพมหานคร", postalCode: "10510" },
  { subdistrict: "คลองสามวา", district: "คลองสามวา", province: "กรุงเทพมหานคร", postalCode: "10510" },
  { subdistrict: "หนองจอก", district: "หนองจอก", province: "กรุงเทพมหานคร", postalCode: "10530" },
  { subdistrict: "ลาดกระบัง", district: "ลาดกระบัง", province: "กรุงเทพมหานคร", postalCode: "10520" },
  { subdistrict: "คลองสองต้นนุ่น", district: "ลาดกระบัง", province: "กรุงเทพมหานคร", postalCode: "10520" },
  { subdistrict: "สวนหลวง", district: "สวนหลวง", province: "กรุงเทพมหานคร", postalCode: "10250" },
  { subdistrict: "อ่อนนุช", district: "สวนหลวง", province: "กรุงเทพมหานคร", postalCode: "10250" },
  { subdistrict: "ประเวศ", district: "ประเวศ", province: "กรุงเทพมหานคร", postalCode: "10250" },
  { subdistrict: "บางนา", district: "บางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
  { subdistrict: "บางนาเหนือ", district: "บางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
  { subdistrict: "บางนาใต้", district: "บางนา", province: "กรุงเทพมหานคร", postalCode: "10260" },
  { subdistrict: "พระนคร", district: "พระนคร", province: "กรุงเทพมหานคร", postalCode: "10200" },
  { subdistrict: "วัดราชบพิธ", district: "พระนคร", province: "กรุงเทพมหานคร", postalCode: "10200" },
  { subdistrict: "สำราญราษฎร์", district: "พระนคร", province: "กรุงเทพมหานคร", postalCode: "10200" },
  // เชียงใหม่
  { subdistrict: "ศรีภูมิ", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50200" },
  { subdistrict: "พระสิงห์", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50200" },
  { subdistrict: "ช้างม่อย", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50300" },
  { subdistrict: "หายยา", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50100" },
  { subdistrict: "สุเทพ", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50200" },
  { subdistrict: "แม่เหียะ", district: "เมืองเชียงใหม่", province: "เชียงใหม่", postalCode: "50100" },
  // นนทบุรี
  { subdistrict: "สวนใหญ่", district: "เมืองนนทบุรี", province: "นนทบุรี", postalCode: "11000" },
  { subdistrict: "ตลาดขวัญ", district: "เมืองนนทบุรี", province: "นนทบุรี", postalCode: "11000" },
  { subdistrict: "บางกระสอ", district: "เมืองนนทบุรี", province: "นนทบุรี", postalCode: "11000" },
  { subdistrict: "ท่าทราย", district: "เมืองนนทบุรี", province: "นนทบุรี", postalCode: "11000" },
  { subdistrict: "ปากเกร็ด", district: "ปากเกร็ด", province: "นนทบุรี", postalCode: "11120" },
  { subdistrict: "บางตลาด", district: "ปากเกร็ด", province: "นนทบุรี", postalCode: "11120" },
  { subdistrict: "บ้านใหม่", district: "ปากเกร็ด", province: "นนทบุรี", postalCode: "11120" },
  { subdistrict: "บางบัวทอง", district: "บางบัวทอง", province: "นนทบุรี", postalCode: "11110" },
  // ปทุมธานี
  { subdistrict: "บางปรอก", district: "เมืองปทุมธานี", province: "ปทุมธานี", postalCode: "12000" },
  { subdistrict: "บ้านใหม่", district: "เมืองปทุมธานี", province: "ปทุมธานี", postalCode: "12000" },
  { subdistrict: "รังสิต", district: "ธัญบุรี", province: "ปทุมธานี", postalCode: "12110" },
  { subdistrict: "ประชาธิปัตย์", district: "ธัญบุรี", province: "ปทุมธานี", postalCode: "12130" },
  { subdistrict: "ลำลูกกา", district: "ลำลูกกา", province: "ปทุมธานี", postalCode: "12150" },
  { subdistrict: "คลองหลวง", district: "คลองหลวง", province: "ปทุมธานี", postalCode: "12120" },
  // สมุทรปราการ
  { subdistrict: "ปากน้ำ", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ", postalCode: "10270" },
  { subdistrict: "บางเมือง", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ", postalCode: "10270" },
  { subdistrict: "แพรกษา", district: "เมืองสมุทรปราการ", province: "สมุทรปราการ", postalCode: "10280" },
  { subdistrict: "บางพลี", district: "บางพลี", province: "สมุทรปราการ", postalCode: "10540" },
  { subdistrict: "บางบ่อ", district: "บางบ่อ", province: "สมุทรปราการ", postalCode: "10560" },
  // ชลบุรี
  { subdistrict: "บางปลาสร้อย", district: "เมืองชลบุรี", province: "ชลบุรี", postalCode: "20000" },
  { subdistrict: "ศรีราชา", district: "ศรีราชา", province: "ชลบุรี", postalCode: "20110" },
  { subdistrict: "นาเกลือ", district: "บางละมุง", province: "ชลบุรี", postalCode: "20150" },
  { subdistrict: "หนองปรือ", district: "บางละมุง", province: "ชลบุรี", postalCode: "20150" },
  // ขอนแก่น
  { subdistrict: "ในเมือง", district: "เมืองขอนแก่น", province: "ขอนแก่น", postalCode: "40000" },
  { subdistrict: "ศิลา", district: "เมืองขอนแก่น", province: "ขอนแก่น", postalCode: "40000" },
  // ภูเก็ต
  { subdistrict: "ตลาดใหญ่", district: "เมืองภูเก็ต", province: "ภูเก็ต", postalCode: "83000" },
  { subdistrict: "ป่าตอง", district: "กะทู้", province: "ภูเก็ต", postalCode: "83150" },
  // นครราชสีมา
  { subdistrict: "ในเมือง", district: "เมืองนครราชสีมา", province: "นครราชสีมา", postalCode: "30000" },
  { subdistrict: "หนองไผ่ล้อม", district: "เมืองนครราชสีมา", province: "นครราชสีมา", postalCode: "30000" },
];

function formatThaiAddress(a: ThaiAddress): string {
  return `${a.subdistrict}, ${a.district}, ${a.province}, ${a.postalCode}`;
}

/* ---- Address Card ---- */
function AddressCard({
  addr,
  onSetDefault,
  onEdit,
  onDelete,
}: {
  addr: Address;
  onSetDefault: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg border border-[#e8e8e8] p-4 relative">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <p className={`${font} text-[14px] text-black truncate`} style={{ fontWeight: 500 }}>{addr.firstName}</p>
          {addr.isDefault && (
            <span className={`${font} text-[11px] text-white bg-[#319754] px-3 py-0.5 rounded-full shrink-0`}>
              ที่อยู่หลัก
            </span>
          )}
        </div>
        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="size-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] cursor-pointer text-[#999]"
          >
            <MoreHorizontal className="size-5" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-[#e8e8e8] py-1 w-[160px]">
                {!addr.isDefault && (
                  <button
                    onClick={() => { onSetDefault(); setMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[13px] ${font} hover:bg-[#f5f5f5] cursor-pointer text-black flex items-center gap-2`}
                  >
                    <MapPinIcon className="size-3.5" /> ตั้งเป็นหลัก
                  </button>
                )}
                <button
                  onClick={() => { onEdit(); setMenuOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-[13px] ${font} hover:bg-[#f5f5f5] cursor-pointer text-black flex items-center gap-2`}
                >
                  <Pencil className="size-3.5" /> แก้ไข
                </button>
                {!addr.isDefault && (
                  <button
                    onClick={() => { onDelete(); setMenuOpen(false); }}
                    className={`w-full text-left px-4 py-2 text-[13px] ${font} hover:bg-[#f5f5f5] cursor-pointer text-[#d32f2f] flex items-center gap-2`}
                  >
                    <Trash2 className="size-3.5" /> ลบ
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {/* Phone */}
      <p className={`${font} text-[14px] text-black mb-2`}>{addr.phone}</p>
      {/* Address */}
      <p className={`${font} text-[12px] text-[#757575] leading-[18px]`}>{addr.addressDetail}</p>
    </div>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

/* ---- Add/Edit Modal ---- */
function AddressModal({
  isOpen,
  onClose,
  onSave,
  initial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { firstName: string; lastName: string; phone: string; postalOrSubdistrict: string; addressDetail: string; isDefault: boolean }) => void;
  initial?: { firstName: string; lastName: string; phone: string; postalOrSubdistrict: string; addressDetail: string; isDefault: boolean };
}) {
  const [firstName, setFirstName] = useState(initial?.firstName || "");
  const [lastName, setLastName] = useState(initial?.lastName || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [postalOrSubdistrict, setPostalOrSubdistrict] = useState(initial?.postalOrSubdistrict || "");
  const [addressDetail, setAddressDetail] = useState(initial?.addressDetail || "");
  const [setAsDefault, setSetAsDefault] = useState(initial?.isDefault || false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);

  if (!isOpen) return null;

  const query = postalOrSubdistrict.trim().toLowerCase();
  const suggestions = query.length >= 2
    ? thaiAddresses.filter((a) => {
        const full = formatThaiAddress(a).toLowerCase();
        return full.includes(query) || a.postalCode.includes(query) || a.subdistrict.toLowerCase().includes(query) || a.district.toLowerCase().includes(query);
      }).slice(0, 8)
    : [];

  const handleSave = () => {
    if (!firstName || !phone || !postalOrSubdistrict) {
      toast.error("กรุณากรอกข้อมูลที่จำเป็นให้ครบ");
      return;
    }
    onSave({ firstName, lastName, phone, postalOrSubdistrict, addressDetail, isDefault: setAsDefault });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-[16px] w-[90%] max-w-[500px] p-4 relative shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>
            {initial ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่"}
          </p>
          <button
            onClick={onClose}
            className="size-[28px] rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer hover:bg-[rgba(120,120,128,0.2)]"
          >
            <X className="size-[13px] text-black" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#d4d4d8] mb-4" />

        <div className="space-y-4">
          {/* ชื่อ + นามสกุล (side by side) */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-[5px]">
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ชื่อ</span>
                <span className={`${font} text-[14px] text-[#ff3b30]`} style={{ fontWeight: 500 }}>*</span>
              </div>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full h-[48px] px-6 outline-none focus:ring-1 focus:ring-[#319754] placeholder:text-[#a3a3a3]`}
                placeholder="ระบุชื่อผู้รับ"
              />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-[5px]">
                <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>นามสกุล</span>
                <span className={`${font} text-[14px] text-[#ff3b30]`} style={{ fontWeight: 500 }}>*</span>
              </div>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full h-[48px] px-6 outline-none focus:ring-1 focus:ring-[#319754] placeholder:text-[#a3a3a3]`}
                placeholder="นามสกุล"
              />
            </div>
          </div>

          {/* เบอร์โทรศัพท์ */}
          <div className="space-y-2">
            <div className="flex items-center gap-[5px]">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>เบอร์โทรศัพท์</span>
              <span className={`${font} text-[14px] text-[#ff3b30]`} style={{ fontWeight: 500 }}>*</span>
            </div>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full h-[48px] px-6 outline-none focus:ring-1 focus:ring-[#319754] placeholder:text-[#a3a3a3]`}
              placeholder="ระบุเบอร์โทรศัพท์"
            />
          </div>

          {/* ที่อยู่ */}
          <div className="space-y-2 relative">
            <div className="flex items-center gap-[5px]">
              <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ที่อยู่</span>
              <span className={`${font} text-[14px] text-[#ff3b30]`} style={{ fontWeight: 500 }}>*</span>
            </div>
            <input
              value={postalOrSubdistrict}
              onChange={(e) => { setPostalOrSubdistrict(e.target.value); setShowSuggestions(true); setHighlightIdx(-1); }}
              className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full h-[48px] px-6 outline-none focus:ring-1 focus:ring-[#319754] placeholder:text-[#a3a3a3]`}
              placeholder="ระบุรหัสไปรษณีย์ หรือ ตำบล / แขวง"
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setHighlightIdx((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
                } else if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setHighlightIdx((prev) => (prev > 0 ? prev - 1 : prev));
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  if (highlightIdx >= 0 && highlightIdx < suggestions.length) {
                    setPostalOrSubdistrict(formatThaiAddress(suggestions[highlightIdx]));
                    setShowSuggestions(false);
                  }
                }
              }}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-20 bg-white border border-[#d4d4d8] rounded-lg shadow-lg max-h-[160px] overflow-y-auto mt-1">
                {suggestions.map((s, idx) => (
                  <button
                    key={`${s.subdistrict}-${s.district}-${s.postalCode}`}
                    type="button"
                    className={`w-full text-left px-4 py-2.5 ${font} text-[13px] cursor-pointer transition-colors ${
                      idx === highlightIdx ? "bg-[#2979ff] text-white" : "text-black hover:bg-[#f0f0f0]"
                    }`}
                    onMouseEnter={() => setHighlightIdx(idx)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setPostalOrSubdistrict(formatThaiAddress(s));
                      setShowSuggestions(false);
                    }}
                  >
                    {formatThaiAddress(s)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* รายละเอียดที่อยู่ */}
          <div className="space-y-2">
            <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>รายละเอียดที่อยู่</span>
            <input
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              className={`${font} text-[14px] text-black w-full bg-[#fafafa] rounded-full h-[48px] px-6 outline-none focus:ring-1 focus:ring-[#319754] placeholder:text-[#a3a3a3]`}
              placeholder="บ้านเลขที่, หมู่ที่, ชื่ออาคาร, ซอย ถนน"
            />
          </div>

          {/* Toggle ตั้งเป็นที่อยู่หลัก */}
          <div className="flex items-center justify-between">
            <span className={`${font} text-[14px] text-black`} style={{ fontWeight: 500 }}>ตั้งเป็นที่อยู่หลัก</span>
            <button
              onClick={() => setSetAsDefault(!setAsDefault)}
              className={`w-[64px] h-[30px] rounded-full p-[2px] cursor-pointer transition-colors duration-200 ${setAsDefault ? "bg-[#34c759]" : "bg-[#e5e5ea]"}`}
            >
              <div
                className={`size-[26px] bg-white rounded-full shadow-sm transition-transform duration-200 ${setAsDefault ? "translate-x-[34px]" : "translate-x-0"}`}
              />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#d4d4d8] mt-4 mb-4" />

        {/* Submit button */}
        <button
          onClick={handleSave}
          className={`w-full h-[49px] bg-[#008c45] text-white rounded-full ${font} text-[14px] cursor-pointer hover:bg-[#007a3d] transition-colors`}
        >
          {initial ? "บันทึกที่อยู่" : "เพิ่มที่อยู่"}
        </button>
      </div>
    </div>
  );
}

/* ---- Main Page ---- */
export function AddressPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Address | null>(null);

  const handleSetDefault = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("ตั้งเป็นที่อยู่หลักแล้ว");
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    toast.success("ลบที่อยู่แล้ว");
  };

  const handleEdit = (addr: Address) => {
    setEditTarget(addr);
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const handleSave = (data: { firstName: string; lastName: string; phone: string; postalOrSubdistrict: string; addressDetail: string; isDefault: boolean }) => {
    if (editTarget) {
      setAddresses((prev) =>
        prev.map((a) => {
          if (a.id === editTarget.id) return { ...a, ...data };
          if (data.isDefault) return { ...a, isDefault: false };
          return a;
        })
      );
      toast.success("แก้ไขที่อยู่แล้ว");
    } else {
      const newAddr: Address = {
        id: Date.now().toString(),
        ...data,
      };
      if (data.isDefault) {
        setAddresses((prev) => [...prev.map((a) => ({ ...a, isDefault: false })), newAddr]);
      } else {
        setAddresses((prev) => [...prev, newAddr]);
      }
      toast.success("เพิ่มที่อยู่ใหม่แล้ว");
    }
    setModalOpen(false);
    setEditTarget(null);
  };

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[124px] py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[12px] ${font} cursor-pointer hover:bg-[#f0f0f0]`}
            >
              <ChevronLeft className="size-3" /> กลับ
            </button>
            <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>ที่อยู่จัดส่ง</p>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 px-5 py-2 rounded-full bg-[#319754] text-white text-[13px] ${font} cursor-pointer hover:bg-[#267a43] transition-colors`}
          >
            <Plus className="size-4" /> เพิ่มที่อยู่ใหม่
          </button>
        </div>

        {/* Address Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              addr={addr}
              onSetDefault={() => handleSetDefault(addr.id)}
              onEdit={() => handleEdit(addr)}
              onDelete={() => handleDelete(addr.id)}
            />
          ))}
        </div>
      </div>

      <AddressModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTarget(null); }}
        onSave={handleSave}
        initial={editTarget ? { firstName: editTarget.firstName, lastName: editTarget.lastName, phone: editTarget.phone, postalOrSubdistrict: editTarget.postalOrSubdistrict, addressDetail: editTarget.addressDetail, isDefault: editTarget.isDefault } : undefined}
      />
    </div>
  );
}