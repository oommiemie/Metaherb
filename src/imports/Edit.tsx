import svgPaths from "./svg-v5wwq3zqjb";
import imgImage7 from "figma:asset/df528e5485c70efd484e53d21edee863d6012054.png";

function Frame5() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">บัญชีธนาคารสำหรับรับเงิน</p>
      </div>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#ff3b30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff3b30] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">ยกเลิก</p>
      </div>
    </div>
  );
}

function ReadMoreContainer1() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
        <p className="leading-[normal]">บันทึก</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer />
      <ReadMoreContainer1 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame5 />
      <Frame3 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-[rgba(255,141,40,0.1)] content-stretch flex items-center px-[8px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff9500] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">เมื่อมีคำสั่งซื้อสำเร็จ Admin จะโอนเงินค่าสินค้า (หักค่าธรรมเนียม) ให้คุณผ่านบัญชีนี้</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[24px]">
      <div className="aspect-[1024/1024] relative shrink-0 w-full" data-name="image 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[169.333px]">
      <Frame9 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">กสิกรไทย (KBANK)</p>
      </div>
    </div>
  );
}

function ChevronDown() {
  return (
    <div className="h-[9px] overflow-clip relative shrink-0 w-[16px]" data-name="chevron.down 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 9">
        <g id="Group">
          <path d="M16 0H0V9H16V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p2aea2180} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-[24px] py-[12px] relative size-full">
          <Frame8 />
          <ChevronDown />
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-start shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#999] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ธนาคาร</p>
      </div>
      <ButtonIcon />
    </div>
  );
}

function Frame10() {
  return (
    <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full">
      <Frame />
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
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
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
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

export default function Edit() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="edit">
      <Frame6 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="1094" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame4 />
      <Frame10 />
      <Frame7 />
    </div>
  );
}