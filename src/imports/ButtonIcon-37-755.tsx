import svgPaths from "./svg-a36cmd0hr3";

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
    <div className="bg-[#fafafa] content-stretch flex gap-[24px] items-center px-[24px] relative rounded-[100px] size-full" data-name="button-icon">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">มีนาคม</p>
      </div>
      <ChevronDown />
    </div>
  );
}