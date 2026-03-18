import svgPaths from "./svg-ef1ajdelip";
import imgContainer from "figma:asset/51e11fdedae888e644826410f8d7038f1bbaf2e6.png";
import imgContainer1 from "figma:asset/ca947bfdf5c8f7c7177ecee869d4bbb6fa74e2e0.png";
import imgContainer2 from "figma:asset/eaf91e3dbd420033f1f9e5d7e3813e02f9603e18.png";

function ArrowForwardCircleFill() {
  return (
    <div className="h-[19.932px] overflow-clip relative shrink-0 w-[20.283px]" data-name="arrow.forward.circle.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2832 19.9316">
        <g id="Group">
          <path d={svgPaths.p31f27600} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p249d7900} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ดูทั้งหมด</p>
      </div>
      <ArrowForwardCircleFill />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">บทความแนะนำ</p>
      </div>
      <Frame3 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[0.03%_0_-1.79%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12.2116">
        <g id="Group">
          <path d={svgPaths.p450bbc0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function EyeCircleFill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="eye.circle.fill 1">
      <Group />
    </div>
  );
}

function ViewCount() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="View Count">
      <EyeCircleFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="h-[9px] relative shrink-0 w-[10px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9">
        <g id="Group">
          <path d="M10 0H0V9H10V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p20fb1c00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ViewCount1() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="View Count">
      <Group1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">20 ก.พ. 2569</p>
      </div>
    </div>
  );
}

function DateContainer() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Date Container">
      <ViewCount1 />
    </div>
  );
}

function Container() {
  return (
    <div className="h-full relative shrink-0 w-[180px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgContainer} />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-between p-[10px] relative size-full">
          <ViewCount />
          <DateContainer />
        </div>
      </div>
    </div>
  );
}

function ChevronForward() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[8px]" data-name="chevron.forward 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
        <g id="Group">
          <path d="M8 0H0V12H8V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p1f1a0400} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="bg-[#af6f08] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0 w-[120px]" data-name="Read More Container">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
        <p className="leading-[normal]">อ่านเพิ่มเติม</p>
      </div>
      <ChevronForward />
    </div>
  );
}

function ContentContainer() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Content Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[14px] relative size-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-[152px] whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">การใช้สมุนไพร</p>
        </div>
        <p className="flex-[1_0_0] font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic overflow-hidden relative text-[#737373] text-[12px] text-ellipsis w-[152px]">วิธีการใช้สมุนไพรเพื่อบรรเทาอาการเจ็บป่วย</p>
        <ReadMoreContainer />
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[0.03%_0_-1.79%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12.2116">
        <g id="Group">
          <path d={svgPaths.p450bbc0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function EyeCircleFill1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="eye.circle.fill 1">
      <Group2 />
    </div>
  );
}

function ViewCount2() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="View Count">
      <EyeCircleFill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="h-[9px] relative shrink-0 w-[10px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9">
        <g id="Group">
          <path d="M10 0H0V9H10V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p20fb1c00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ViewCount3() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="View Count">
      <Group3 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">20 ก.พ. 2569</p>
      </div>
    </div>
  );
}

function DateContainer1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Date Container">
      <ViewCount3 />
    </div>
  );
}

function Container1() {
  return (
    <div className="h-full relative shrink-0 w-[180px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgContainer1} />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-between p-[10px] relative size-full">
          <ViewCount2 />
          <DateContainer1 />
        </div>
      </div>
    </div>
  );
}

function ChevronForward1() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[8px]" data-name="chevron.forward 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
        <g id="Group">
          <path d="M8 0H0V12H8V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p1f1a0400} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer1() {
  return (
    <div className="bg-[#af6f08] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0 w-[120px]" data-name="Read More Container">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
        <p className="leading-[normal]">อ่านเพิ่มเติม</p>
      </div>
      <ChevronForward1 />
    </div>
  );
}

function ContentContainer1() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Content Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[14px] relative size-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-[152px] whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">ดูดกัญชากันครับ</p>
        </div>
        <p className="flex-[1_0_0] font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic overflow-hidden relative text-[#737373] text-[12px] text-ellipsis w-[152px]">การใช้พืชสมุนไพรในการรักษาและทำอาหาร</p>
        <ReadMoreContainer1 />
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[0.03%_0_-1.79%_0]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12.2116">
        <g id="Group">
          <path d={svgPaths.p450bbc0} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function EyeCircleFill2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="eye.circle.fill 1">
      <Group4 />
    </div>
  );
}

function ViewCount4() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="View Count">
      <EyeCircleFill2 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="h-[9px] relative shrink-0 w-[10px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 9">
        <g id="Group">
          <path d="M10 0H0V9H10V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p20fb1c00} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ViewCount5() {
  return (
    <div className="bg-[rgba(0,0,0,0.5)] content-stretch flex gap-[10px] items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="View Count">
      <Group5 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">20 ก.พ. 2569</p>
      </div>
    </div>
  );
}

function DateContainer2() {
  return (
    <div className="content-stretch flex items-center relative shrink-0" data-name="Date Container">
      <ViewCount5 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-full relative shrink-0 w-[180px]" data-name="Container">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgContainer2} />
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-between p-[10px] relative size-full">
          <ViewCount4 />
          <DateContainer2 />
        </div>
      </div>
    </div>
  );
}

function ChevronForward2() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[8px]" data-name="chevron.forward 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
        <g id="Group">
          <path d="M8 0H0V12H8V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p1f1a0400} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer2() {
  return (
    <div className="bg-[#af6f08] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0 w-[120px]" data-name="Read More Container">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
        <p className="leading-[normal]">อ่านเพิ่มเติม</p>
      </div>
      <ChevronForward2 />
    </div>
  );
}

function ContentContainer2() {
  return (
    <div className="flex-[1_0_0] h-full min-h-px min-w-px relative" data-name="Content Container">
      <div className="content-stretch flex flex-col gap-[8px] items-start p-[14px] relative size-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-[152px] whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">การเก็บเกี่ยวพืชสมุนไพร</p>
        </div>
        <p className="flex-[1_0_0] font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic overflow-hidden relative text-[#737373] text-[12px] text-ellipsis w-[152px]">เทคนิคในการเก็บเกี่ยวและรักษาคุณภาพพืชสมุนไพร</p>
        <ReadMoreContainer2 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-full">
      <div className="bg-white col-1 h-[180px] justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="blog-card">
        <div className="content-stretch flex gap-[10px] items-start overflow-clip relative rounded-[inherit] size-full">
          <Container />
          <ContentContainer />
        </div>
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <div className="bg-white col-2 h-[180px] justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="blog-card">
        <div className="content-stretch flex gap-[10px] items-start overflow-clip relative rounded-[inherit] size-full">
          <Container1 />
          <ContentContainer1 />
        </div>
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
      <div className="bg-white col-3 h-[180px] justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="blog-card">
        <div className="content-stretch flex gap-[10px] items-start overflow-clip relative rounded-[inherit] size-full">
          <Container2 />
          <ContentContainer2 />
        </div>
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] size-full">
      <Frame2 />
      <Frame />
    </div>
  );
}