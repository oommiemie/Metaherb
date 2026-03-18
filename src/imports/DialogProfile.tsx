import svgPaths from "./svg-lzqwyr3g2q";
import imgEllipse1 from "figma:asset/b7fc67ab435cec835d62ca00260981ad2d129656.png";
import imgGroup41 from "figma:asset/8be1dbf7f80482d74e88f48b419a6464198f2b87.png";
import imgImage6 from "figma:asset/6b92d0e6831d20c47dd648a6fca5410d5d285bd6.png";
import imgImage7 from "figma:asset/bc3856a249e9261822188ed229ddd0e2ad6d0b2d.png";
import imgImage8 from "figma:asset/6fe3df791a7ffa4eb26dc3d280886d11308e2b73.png";
import imgImage9 from "figma:asset/affa7b2c27f58769e6b6bc5c0bac9bbeee21a3ef.png";

function Group() {
  return (
    <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] not-italic place-items-start relative shrink-0 text-black text-center whitespace-nowrap">
      <div className="col-1 flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center ml-0 mt-0 relative row-1 text-[20px]">
        <p className="leading-[normal]">Username</p>
      </div>
      <div className="col-1 flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center ml-px mt-[33px] relative row-1 text-[14px]">
        <p className="leading-[normal]">Username@gmail.com</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#d6eadd] h-[150px] relative shrink-0 w-full">
      <div className="flex flex-row items-end overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-end p-[16px] relative size-full">
          <div className="relative shrink-0 size-[60px]">
            <img alt="" className="absolute block max-w-none size-full" height="60" src={imgEllipse1} width="60" />
          </div>
          <Group />
          <div className="absolute h-[207px] left-[215px] top-[16px] w-[259px]" data-name="Group 4 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgGroup41} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">การสั่งซื้อของฉัน</p>
      </div>
    </div>
  );
}

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

function Frame() {
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
      <Frame11 />
      <Frame />
    </div>
  );
}

function Frame10() {
  return (
    <div className="absolute bg-[#ff383c] content-stretch flex items-center justify-center px-[8px] py-[4px] right-[-10px] rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] top-[-9px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[8px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[10px] items-start p-[6px] relative rounded-[16px] shrink-0 size-[48px]">
      <Frame10 />
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage6} />
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-[90px]">
      <Frame3 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[12px] text-black text-center w-[min-content]">
        <p className="leading-[normal]">รอชำระเงิน</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="absolute bg-[#ff383c] content-stretch flex items-center justify-center px-[8px] py-[4px] right-[-10.33px] rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] top-[-9px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[8px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[10px] items-start p-[6px] relative rounded-[16px] shrink-0 size-[48px]">
      <Frame12 />
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage7} />
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-[90px]">
      <Frame6 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[12px] text-black text-center w-[min-content]">
        <p className="leading-[normal]">รอตรวจสอบ</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="absolute bg-[#ff383c] content-stretch flex items-center justify-center px-[8px] py-[4px] right-[-9.67px] rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] top-[-9px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[8px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">12</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[10px] items-start p-[6px] relative rounded-[16px] shrink-0 size-[48px]">
      <Frame14 />
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage8} />
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-[90px]">
      <Frame13 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[12px] text-black text-center w-[min-content]">
        <p className="leading-[normal]">รอจัดส่ง</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="absolute bg-[#ff383c] content-stretch flex items-center justify-center px-[8px] py-[4px] right-[-10px] rounded-[100px] shadow-[0px_2px_4px_0px_rgba(0,0,0,0.15)] top-[-9px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[8px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex flex-col gap-[10px] items-center justify-center p-[6px] relative rounded-[16px] shrink-0 size-[48px]">
      <Frame17 />
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="image 6">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage9} />
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-center relative shrink-0 w-[90px]">
      <Frame16 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[12px] text-black text-center w-[min-content]">
        <p className="leading-[normal]">จัดส่งแล้ว</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame4 />
      <Frame5 />
      <Frame7 />
      <Frame15 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[16px] relative w-full">
        <Frame2 />
        <Frame8 />
      </div>
    </div>
  );
}

function PersonFill() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="person.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p5938100} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <PersonFill />
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">บัญชีของฉัน</p>
      </div>
    </div>
  );
}

function LocationCircle() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="location.circle 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1c5b4200} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
          <path d={svgPaths.p12fdf710} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <LocationCircle />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ที่อยู่จัดส่ง</p>
      </div>
    </div>
  );
}

function Heart() {
  return (
    <div className="h-[11px] overflow-clip relative shrink-0 w-[12px]" data-name="heart 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 11">
        <g id="Group">
          <path d="M12 0H0V11H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p128bca00} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <Heart />
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer2 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">สินค้าที่ชอบ</p>
      </div>
    </div>
  );
}

function Ticket() {
  return (
    <div className="h-[8px] overflow-clip relative shrink-0 w-[12px]" data-name="ticket 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 8">
        <g id="Group">
          <path d="M12 0H0V8H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p304bb80} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer3() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <Ticket />
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer3 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">คูปองของฉัน</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative w-full">
        <Frame19 />
        <Frame20 />
        <Frame21 />
        <Frame22 />
      </div>
    </div>
  );
}

function Storefront() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="storefront 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p388b7000} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer4() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <Storefront />
    </div>
  );
}

function Frame24() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer4 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ร้านค้าของฉัน</p>
      </div>
    </div>
  );
}

function MacbookAndIpad() {
  return (
    <div className="h-[8px] overflow-clip relative shrink-0 w-[14px]" data-name="macbook.and.ipad 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 8">
        <g id="Group">
          <path d="M14 0H0V8H14V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1c2f78f0} fill="var(--fill-0, black)" fillOpacity="0.2125" id="Vector_2" />
          <path d={svgPaths.p1f873d00} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_3" />
          <path d={svgPaths.p2a23a400} fill="var(--fill-0, black)" fillOpacity="0.2125" id="Vector_4" />
          <path d={svgPaths.pff934f0} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_5" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer5() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <MacbookAndIpad />
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer5 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ตั้งค่าระบบ</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative w-full">
        <Frame24 />
        <Frame25 />
      </div>
    </div>
  );
}

function DoorLeftHandOpen() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[9px]" data-name="door.left.hand.open 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 12">
        <g id="Group">
          <path d="M9 0H0V12H9V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1714e100} fill="var(--fill-0, #FF383C)" id="Vector_2" />
          <path d={svgPaths.p860f200} fill="var(--fill-0, #FF383C)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer6() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <DoorLeftHandOpen />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer6 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff383c] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ออกจากระบบ</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
        <Frame27 />
      </div>
    </div>
  );
}

export default function DialogProfile() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[16px] shadow-[2px_4px_24px_0px_rgba(0,0,0,0.1)] size-full" data-name="Dialog profile">
      <Frame1 />
      <Frame9 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 1">
            <line id="Line 4" stroke="var(--stroke-0, #D4D4D8)" x2="400" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame18 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 1">
            <line id="Line 4" stroke="var(--stroke-0, #D4D4D8)" x2="400" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame23 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 400 1">
            <line id="Line 4" stroke="var(--stroke-0, #D4D4D8)" x2="400" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame26 />
    </div>
  );
}