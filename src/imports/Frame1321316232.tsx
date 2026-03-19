import svgPaths from "./svg-q7abbwkyjt";

function ListBulletClipboard() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-[10px]" data-name="list.bullet.clipboard 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 16">
        <g id="Group">
          <path d="M10 0H0V16H10V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p16f83e00} fill="var(--fill-0, white)" id="Vector_2" />
          <path d={svgPaths.p3f9d1a00} fill="var(--fill-0, white)" id="Vector_3" />
          <path d={svgPaths.p3322fb80} fill="var(--fill-0, white)" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[18px]">
      <ListBulletClipboard />
    </div>
  );
}

function TabMenu() {
  return (
    <div className="backdrop-blur-[2px] bg-[#319754] content-stretch flex gap-[10px] items-center justify-center pl-[12px] pr-[8px] py-[4px] relative rounded-[100px] shrink-0" data-name="tab menu">
      <Frame />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">ทั้งหมด</p>
      </div>
    </div>
  );
}

function HourglassBottomhalfFilled() {
  return (
    <div className="col-1 h-[14.609px] ml-0 mt-0 overflow-clip relative row-1 w-[8.348px]" data-name="hourglass.bottomhalf.filled 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.34797 14.6085">
        <g id="Group">
          <path d={svgPaths.p2532b700} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1d19b180} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[-1px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10 10">
        <g id="Group">
          <path d="M10 0H0V10H10V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p39f24900} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function BahtsignCircleFill() {
  return (
    <div className="bg-white border border-solid border-white col-1 ml-[5.15px] mt-[6.5px] overflow-clip relative rounded-[100px] row-1 size-[10px]" data-name="bahtsign.circle.fill 3">
      <Group />
    </div>
  );
}

function Group1() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0">
      <HourglassBottomhalfFilled />
      <BahtsignCircleFill />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[18px]">
      <Group1 />
    </div>
  );
}

function TabMenu1() {
  return (
    <div className="backdrop-blur-[2px] content-stretch flex gap-[10px] items-center justify-center pl-[12px] pr-[8px] py-[4px] relative rounded-[100px] shrink-0" data-name="tab menu">
      <Frame1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">รอชำระเงิน</p>
      </div>
    </div>
  );
}

export default function Frame2() {
  return (
    <div className="bg-white content-stretch flex gap-[10px] items-center overflow-clip p-[4px] relative rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] size-full">
      <TabMenu />
      <TabMenu1 />
    </div>
  );
}