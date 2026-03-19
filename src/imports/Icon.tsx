import svgPaths from "./svg-4jhyamphkh";

function Text() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Text">
      <p className="font-['Google_Sans:Regular',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#319754] text-[12px] tracking-[0.6px] uppercase whitespace-nowrap">เลื่อนเพื่อดูเนื้อหา</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex inset-[26.3%_45.66%_14.09%_45.66%] items-center px-[16px] py-[8px] rounded-[16777200px]" data-name="Container">
      <Text />
    </div>
  );
}

export default function Icon() {
  return (
    <div className="relative size-full" data-name="Icon">
      <div className="absolute inset-[3.29%_0.07%_0.07%_0]" data-name="Vector">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1439 55.125">
          <path d={svgPaths.p3818e200} fill="var(--fill-0, #F5F0E8)" id="Vector" />
        </svg>
      </div>
      <Container />
    </div>
  );
}