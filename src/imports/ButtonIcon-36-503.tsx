import svgPaths from "./svg-4lfy24aeqg";
import imgImage7 from "figma:asset/df528e5485c70efd484e53d21edee863d6012054.png";

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative shrink-0 size-[24px]">
      <div className="aspect-[1024/1024] relative shrink-0 w-full" data-name="image 7">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-[169.333px]">
      <Frame1 />
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

export default function ButtonIcon() {
  return (
    <div className="bg-[#fafafa] content-stretch flex items-center justify-between px-[24px] py-[12px] relative rounded-[100px] size-full" data-name="button-icon">
      <Frame />
      <ChevronDown />
    </div>
  );
}