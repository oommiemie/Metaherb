import svgPaths from "./svg-q2p5p3y651";
import imgImage7 from "figma:asset/df528e5485c70efd484e53d21edee863d6012054.png";

function ChevronForward() {
  return (
    <div className="h-[12px] overflow-clip relative w-[8px]" data-name="chevron.forward 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
        <g id="Group">
          <path d="M8 0H0V12H8V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1f1a0400} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="bg-[#d4d4d4] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0 w-[74px]" data-name="Read More Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <ChevronForward />
        </div>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">กลับ</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ReadMoreContainer />
      <p className="font-['IBM_Plex_Sans_Thai_Looped:Bold',sans-serif] leading-[33px] not-italic relative shrink-0 text-[#0a0a0a] text-[22px] whitespace-nowrap">ตั้งค่าการเงิน</p>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-center px-[82px] relative shrink-0">
      <p className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[19.5px] not-italic relative shrink-0 text-[#6a7282] text-[13px] whitespace-nowrap">จัดการบัญชีธนาคารสำหรับรับเงินจากการขาย</p>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-[574.763px]">
      <Frame8 />
      <Frame9 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">บัญชีธนาคารสำหรับรับเงิน</p>
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

function ReadMoreContainer1() {
  return (
    <div className="bg-[#f2f2f7] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
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
      <Frame4 />
      <ReadMoreContainer1 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[rgba(255,141,40,0.1)] content-stretch flex items-center px-[8px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff9500] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">เมื่อมีคำสั่งซื้อสำเร็จ Admin จะโอนเงินค่าสินค้า (หักค่าธรรมเนียม) ให้คุณผ่านบัญชีนี้</p>
      </div>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center pr-[24px] py-[12px] relative size-full">
          <div className="relative shrink-0 size-[32px]" data-name="image 7">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
          </div>
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p className="leading-[normal]">ธนาคารกรุงไทย</p>
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
        <p className="leading-[normal]">ธนาคาร</p>
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
            <p className="leading-[normal]">000-000-0000</p>
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
        <p className="leading-[normal]">เลขที่บัญชี</p>
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
            <p className="leading-[normal]">บริษัท เมต้าเฮิร์บ จำกัด</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ชื่อบัญชี</p>
      </div>
      <ButtonIcon2 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function ManageBankAccounts() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[1126px]" data-name="Manage bank accounts">
      <Frame6 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="1094" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame3 />
      <Frame />
      <Frame7 />
    </div>
  );
}

export default function MainContent() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start pt-[23.999px] px-[23.999px] relative size-full" data-name="Main Content">
      <Frame5 />
      <ManageBankAccounts />
    </div>
  );
}