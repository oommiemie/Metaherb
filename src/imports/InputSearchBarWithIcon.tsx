import svgPaths from "./svg-bdek5ty1rr";

function OutlinedGoogleIcons() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="outlined-google-icons">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="outlined-google-icons">
          <mask height="16" id="mask0_8_224" maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }} width="16" x="0" y="0">
            <rect fill="var(--fill-0, #D9D9D9)" height="16" id="Bounding box" width="16" />
          </mask>
          <g mask="url(#mask0_8_224)">
            <path d={svgPaths.p232500} fill="var(--fill-0, white)" id="search" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function MdIconButton() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center p-[8px] relative rounded-[100px] shrink-0 size-[32px]" data-name="md-icon-button">
      <OutlinedGoogleIcons />
    </div>
  );
}

export default function InputSearchBarWithIcon() {
  return (
    <div className="bg-white content-stretch flex items-center justify-between pl-[16px] pr-[4px] py-[4px] relative rounded-[100px] size-full" data-name="input-search-bar-with-icon">
      <div aria-hidden="true" className="absolute border border-[#d4d4d8] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">ค้นหาสินค้าที่ต้องการ</p>
      </div>
      <MdIconButton />
    </div>
  );
}