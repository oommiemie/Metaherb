import svgPaths from "./svg-ie46n7pau3";

function Frame() {
  return (
    <div className="bg-[#08f] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">ที่อยู่หลัก</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">username01</p>
      </div>
      <Frame />
    </div>
  );
}

function Ellipsis() {
  return (
    <div className="h-[3px] overflow-clip relative shrink-0 w-[16px]" data-name="ellipsis 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 3">
        <g id="Group">
          <path d="M16 0H0V3H16V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p314fee80} fill="var(--fill-0, #999999)" id="Vector_2" />
          <path d={svgPaths.p2da25480} fill="var(--fill-0, #999999)" id="Vector_3" />
          <path d={svgPaths.p386d0900} fill="var(--fill-0, #999999)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="bg-[rgba(120,120,128,0.12)] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <Ellipsis />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame1 />
      <ReadMoreContainer />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] gap-[4px] items-start leading-[0] not-italic relative shrink-0 text-black w-full">
      <div className="flex flex-col justify-center relative shrink-0 text-[16px] text-center whitespace-nowrap">
        <p className="leading-[normal]">090-000-000</p>
      </div>
      <div className="flex flex-col justify-center min-w-full relative shrink-0 text-[14px] w-[min-content]">
        <p className="leading-[normal]">เลขที่ 2 ชั้นที่ 2 ซอยสุขสวัสดิ์33 แขวงราษฎร์บูรณะ, เขตราษฎร์บูรณะ กรุงเทพมหานคร 10140</p>
      </div>
    </div>
  );
}

export default function Address() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(242,242,247,0.5)] content-stretch flex flex-col gap-[10px] items-start p-[16px] relative rounded-[16px] size-full" data-name="address">
      <Frame3 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 712 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="712" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame2 />
    </div>
  );
}