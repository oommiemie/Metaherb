import svgPaths from "./svg-j7chvn7m99";
import imgEllipse2 from "figma:asset/74096b155d57ea010019b7c7582451c862160695.png";

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ข้อมูลร้านค้า</p>
      </div>
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

function Frame6() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame5 />
      <ReadMoreContainer />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[#319754] content-stretch flex flex-col h-[40px] items-center justify-center overflow-clip px-[16px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">เปลี่ยนรูปโปรไฟล์</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[134px] relative shrink-0 w-full">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-center p-[16px] relative size-full">
          <Frame />
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
            <p className="leading-[normal]">
              รองรับไฟล์: JPEG, PNG, GIF, WebP
              <br aria-hidden="true" />
              ขนาดไม่เกิน: 5MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-center relative shrink-0 w-[400px]">
      <div className="relative shrink-0 size-[150px]">
        <img alt="" className="absolute block max-w-none size-full" height="150" src={imgEllipse2} width="150" />
      </div>
      <Frame4 />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p className="leading-[normal]">METAHERB Store</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ชื่อร้านค้า</p>
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
            <p className="leading-[normal]">METAHERB@gmail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">อีเมล</p>
      </div>
      <ButtonIcon1 />
    </div>
  );
}

function ButtonIcon2() {
  return (
    <div className="h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p className="leading-[normal]">090-000-0000</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">เบอร์โทรศัพท์</p>
      </div>
      <ButtonIcon2 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[16px] items-start min-h-px min-w-px relative">
      <Frame1 />
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame7 />
      <Frame8 />
    </div>
  );
}

export default function StoreInformation() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="Store information">
      <Frame6 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="1094" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame9 />
    </div>
  );
}