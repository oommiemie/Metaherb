import { useState } from "react";
import { X } from "lucide-react";

const font = "font-['IBM_Plex_Sans_Thai_Looped',sans-serif]";

interface AddAddressModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (address: any) => void;
}

export function AddAddressModal({ open, onClose, onSave }: AddAddressModalProps) {
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", postalCode: "", detail: "", isDefault: true });

  if (!open) return null;

  const update = (k: string, v: any) => setForm((p) => ({ ...p, [k]: v }));

  const handleSave = () => {
    if (!form.firstName || !form.phone || !form.postalCode) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-4 w-full max-w-[500px] flex flex-col gap-4 shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className={`${font} text-[20px] text-black`} style={{ fontWeight: 500 }}>เพิ่มที่อยู่ใหม่</p>
          <button onClick={onClose} className="size-7 rounded-full bg-[rgba(120,120,128,0.12)] flex items-center justify-center cursor-pointer">
            <X className="size-3.5" />
          </button>
        </div>

        <div className="h-px bg-[#d4d4d8]" />

        {/* Name row */}
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-1">
              <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ชื่อ</span>
              <span className="text-[#ff3b30] text-[14px]">*</span>
            </div>
            <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} placeholder="ระบุชื่อผู้รับ"
              className={`bg-[#fafafa] h-12 rounded-full px-6 text-[14px] ${font} text-[#a3a3a3] outline-none`} />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex gap-1">
              <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>นามสกุล</span>
              <span className="text-[#ff3b30] text-[14px]">*</span>
            </div>
            <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} placeholder="นามสกุล"
              className={`bg-[#fafafa] h-12 rounded-full px-6 text-[14px] ${font} text-[#a3a3a3] outline-none`} />
          </div>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>เบอร์โทรศัพท์</span>
            <span className="text-[#ff3b30] text-[14px]">*</span>
          </div>
          <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="ระบุเบอร์โทรศัพท์"
            className={`bg-[#fafafa] h-12 rounded-full px-6 text-[14px] ${font} text-[#a3a3a3] outline-none`} />
        </div>

        {/* Address / postal */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-1">
            <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ที่อยู่</span>
            <span className="text-[#ff3b30] text-[14px]">*</span>
          </div>
          <input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value)} placeholder="ระบุรหัสไปรษณีย์ หรือ ตำบล / แขวง"
            className={`bg-[#fafafa] h-12 rounded-full px-6 text-[14px] ${font} text-[#a3a3a3] outline-none`} />
        </div>

        {/* Detail */}
        <div className="flex flex-col gap-2">
          <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>รายละเอียดที่อยู่</span>
          <input value={form.detail} onChange={(e) => update("detail", e.target.value)} placeholder="บ้านเลขที่, หมู่ที่, ชื่ออาคาร, ซอย ถนน"
            className={`bg-[#fafafa] h-12 rounded-full px-6 text-[14px] ${font} text-[#a3a3a3] outline-none`} />
        </div>

        {/* Default toggle */}
        <div className="flex items-center justify-between px-px">
          <span className={`${font} text-[14px]`} style={{ fontWeight: 500 }}>ตั้งเป็นที่อยู่หลัก</span>
          <button onClick={() => update("isDefault", !form.isDefault)}
            className={`w-16 h-6 rounded-full p-0.5 flex items-center cursor-pointer transition-colors ${form.isDefault ? "bg-[#34c759] justify-end" : "bg-gray-300 justify-start"}`}>
            <div className="size-5 bg-white rounded-full" />
          </button>
        </div>

        <div className="h-px bg-[#d4d4d8]" />

        <button onClick={handleSave} className={`bg-[#008c45] h-[49px] rounded-full text-white text-[14px] ${font} cursor-pointer hover:bg-[#007a3b]`}>เพิ่มที่อยู่</button>
      </div>
    </div>
  );
}