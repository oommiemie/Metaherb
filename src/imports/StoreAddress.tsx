import svgPaths from "./svg-g07byj10b6";

function InfoCircleFill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="info.circle.fill 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H0V14H14V0Z" fill="var(--fill-0, #8E8E93)" id="Vector" opacity="0" />
          <path d={svgPaths.p64af700} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <InfoCircleFill />
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#8e8e93] text-[12px]">
        <p className="leading-[normal]">ใช้แสดงตำแหน่งหรือที่ตั้งหลักของร้านค้า ข้อมูลนี้อาจปรากฏในหน้าโปรไฟล์ร้าน และใช้สำหรับอ้างอิงทางธุรกิจ โปรดระบุข้อมูลให้ถูกต้องและครบถ้วน</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ที่อยู่ร้านค้า</p>
      </div>
      <Frame2 />
    </div>
  );
}

function Pencil() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="pencil 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p38941300} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <Pencil />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">แก้ไข</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame3 />
      <ReadMoreContainer />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p>
              <span className="font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] leading-[normal] not-italic">แขวงราษฎรบูรณะ</span>
              <span className="leading-[normal]">{` เขตราษฎร์บรณะ จังหวัด กรุงเทพมหานคร 10140`}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ที่อยู่</p>
      </div>
      <ButtonIcon />
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p className="leading-[normal]">บ้านเลขที่ 459/153 หมู่บ้านนิวไฮบ์ สุขสวัสดิ์ ถนนสุขสวัสด</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">รายละเอียดที่อยู่</p>
      </div>
      <ButtonIcon1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-start relative shrink-0 w-full">
      <Frame1 />
    </div>
  );
}

export default function StoreAddress() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="Store address">
      <Frame4 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="1094" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame />
      <Frame5 />
    </div>
  );
}