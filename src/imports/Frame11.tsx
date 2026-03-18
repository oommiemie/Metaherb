import svgPaths from "./svg-h7d1kpc9sk";
import imgRectangle9 from "figma:asset/14c82f0b6d40a371e79f24d28a19baf7f3c4e07b.png";
import imgRectangle10 from "figma:asset/182ebaed7dc9d71cbb9cbb8bef6cc896e67c7cda.png";
import imgRectangle11 from "figma:asset/641ef62947463531a09acefe02ab39bfcf9c6e7a.png";

function ArrowBackwardCircleFill() {
  return (
    <div className="h-[19.932px] overflow-clip relative shrink-0 w-[20.283px]" data-name="arrow.backward.circle.fill 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2832 19.9316">
        <g id="Group">
          <path d={svgPaths.p31f27600} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1ec9ac00} fill="var(--fill-0, #737373)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-y-1/2 absolute backdrop-blur-[2px] bg-[rgba(217,217,217,0.5)] content-stretch flex flex-col items-center justify-center left-[20px] overflow-clip rounded-[100px] size-[32px] top-[calc(50%+12.5px)]">
      <ArrowBackwardCircleFill />
    </div>
  );
}

function ArrowForwardCircleFill() {
  return (
    <div className="h-[19.932px] overflow-clip relative shrink-0 w-[20.283px]" data-name="arrow.forward.circle.fill 3">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2832 19.9316">
        <g id="Group">
          <path d={svgPaths.p31f27600} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p249d7900} fill="var(--fill-0, #737373)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="-translate-y-1/2 absolute backdrop-blur-[2px] bg-[rgba(217,217,217,0.5)] content-stretch flex flex-col items-center justify-center overflow-clip right-[20px] rounded-[100px] size-[32px] top-[calc(50%+12.5px)]">
      <ArrowForwardCircleFill />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute h-[10px] left-[365px] top-[213px] w-[44px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 10">
        <g id="Group 1" opacity="0.5">
          <circle cx="5" cy="5" fill="var(--fill-0, #D9D9D9)" id="Ellipse 4" r="5" />
          <circle cx="22" cy="5" id="Ellipse 5" r="4.5" stroke="var(--stroke-0, #D4D4D4)" />
          <circle cx="39" cy="5" id="Ellipse 6" r="4.5" stroke="var(--stroke-0, #D4D4D4)" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="h-[235px] overflow-clip relative rounded-[16px] shrink-0 w-[775px]">
      <div className="absolute h-[235px] left-0 top-0 w-[775px]">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgRectangle9} />
      </div>
      <Frame2 />
      <Frame3 />
      <Group />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative self-stretch">
      <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] w-full">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgRectangle10} />
      </div>
      <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] w-full">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgRectangle11} />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative size-full">
      <Frame4 />
      <Frame1 />
    </div>
  );
}