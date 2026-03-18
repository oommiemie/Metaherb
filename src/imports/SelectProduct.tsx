import svgPaths from "./svg-j2jb9xop3h";
import imgFrame1321315985 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";

function Multiply() {
  return (
    <div className="h-[13.015px] overflow-clip relative shrink-0 w-[13.347px]" data-name="multiply 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3472 13.0152">
        <g id="Group">
          <path d={svgPaths.p3fc8f380} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p2449f280} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <button className="bg-[rgba(120,120,128,0.12)] content-stretch cursor-pointer flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <Multiply />
    </button>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">เลือกสินค้า</p>
      </div>
      <ReadMoreContainer />
    </div>
  );
}

function OutlinedGoogleIcons() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="outlined-google-icons">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="outlined-google-icons">
          <path d={svgPaths.p3118780} fill="var(--fill-0, white)" id="search" />
        </g>
      </svg>
    </div>
  );
}

function MdIconButton() {
  return (
    <div className="aspect-[32/32] bg-[#319754] content-stretch flex h-full items-center justify-center relative rounded-[100px] shrink-0" data-name="md-icon-button">
      <OutlinedGoogleIcons />
    </div>
  );
}

function InputSearchBarWithIcon() {
  return (
    <div className="bg-white h-[40px] relative rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] shrink-0 w-full" data-name="input-search-bar-with-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center pl-[16px] pr-[4px] py-[4px] relative size-full">
          <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[#404040] text-[14px] text-ellipsis whitespace-nowrap">
            <p className="leading-[normal] overflow-hidden">ค้นหาสินค้าของคุณ</p>
          </div>
          <MdIconButton />
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="aspect-[80/80] relative rounded-[16px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame11() {
  return (
    <div className="bg-[#d4d4d8] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[80px]">
      <Frame6 />
    </div>
  );
}

function CirclebadgeFill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="circlebadge.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p3d60edc0} fill="var(--fill-0, #FF9500)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Only() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[14px] py-[2px] relative rounded-[100px] shrink-0" data-name="Only" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 149, 0, 0.1) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <CirclebadgeFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff9500] text-[14px] text-left whitespace-nowrap">
        <p className="leading-[normal]">ราคาเดียว</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">Product</p>
      </div>
      <Only />
    </div>
  );
}

function Frame28() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#319754] text-[14px] text-left whitespace-nowrap">
        <p className="leading-[normal]">฿ 0.00</p>
      </div>
    </div>
  );
}

function ShippingboxFill() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.pf31a600} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ShippingboxFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">ชิ้น</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame28 />
      <Frame />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative">
      <Frame21 />
      <Frame22 />
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(212,212,212,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative w-full">
          <Frame11 />
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <Frame12 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
      <Frame34 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="aspect-[80/80] relative rounded-[16px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#d4d4d8] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[80px]">
      <Frame7 />
    </div>
  );
}

function Circlebadge2Fill() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[16px]" data-name="circlebadge.2.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
        <g id="Group">
          <path d="M16 0H0V12H16V0Z" fill="var(--fill-0, #007AFF)" id="Vector" opacity="0" />
          <path d={svgPaths.pffba700} fill="var(--fill-0, #007AFF)" id="Vector_2" />
          <path d={svgPaths.p1ae7eb00} fill="var(--fill-0, #007AFF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Many() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[14px] py-[2px] relative rounded-[100px] shrink-0" data-name="Many" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.1) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Circlebadge2Fill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007aff] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">หลายตัวเลือก</p>
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">Product</p>
      </div>
      <Many />
    </div>
  );
}

function ShippingboxFill1() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.pf31a600} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ShippingboxFill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ชิ้น</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#319754] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">฿ 0.00 - ฿ 0.00</p>
      </div>
      <Frame1 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative">
      <Frame23 />
      <Frame26 />
    </div>
  );
}

function Frame30() {
  return (
    <div className="bg-white h-[112px] relative rounded-[16px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative size-full">
          <Frame13 />
          <Frame14 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(212,212,212,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="aspect-[80/80] relative rounded-[16px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#d4d4d8] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[80px]">
      <Frame8 />
    </div>
  );
}

function Circlebadge2Fill1() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[16px]" data-name="circlebadge.2.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 12">
        <g id="Group">
          <path d="M16 0H0V12H16V0Z" fill="var(--fill-0, #007AFF)" id="Vector" opacity="0" />
          <path d={svgPaths.pffba700} fill="var(--fill-0, #007AFF)" id="Vector_2" />
          <path d={svgPaths.p1ae7eb00} fill="var(--fill-0, #007AFF)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Many1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[14px] py-[2px] relative rounded-[100px] shrink-0" data-name="Many" style={{ backgroundImage: "linear-gradient(90deg, rgba(0, 122, 255, 0.1) 0%, rgba(0, 122, 255, 0.1) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <Circlebadge2Fill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#007aff] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">หลายตัวเลือก</p>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">Product</p>
      </div>
      <Many1 />
    </div>
  );
}

function ShippingboxFill2() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.pf31a600} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ShippingboxFill2 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ชิ้น</p>
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#319754] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">฿ 0.00 - ฿ 0.00</p>
      </div>
      <Frame2 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative">
      <Frame27 />
      <Frame29 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-white h-[112px] relative rounded-[16px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative size-full">
          <Frame15 />
          <Frame16 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(212,212,212,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame9() {
  return (
    <div className="aspect-[80/80] relative rounded-[16px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#d4d4d8] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[80px]">
      <Frame9 />
    </div>
  );
}

function CirclebadgeFill1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="circlebadge.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p3d60edc0} fill="var(--fill-0, #FF9500)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Only1() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[14px] py-[2px] relative rounded-[100px] shrink-0" data-name="Only" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 149, 0, 0.1) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <CirclebadgeFill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff9500] text-[14px] text-left whitespace-nowrap">
        <p className="leading-[normal]">ราคาเดียว</p>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">Product</p>
      </div>
      <Only1 />
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#319754] text-[14px] text-left whitespace-nowrap">
        <p className="leading-[normal]">฿ 0.00</p>
      </div>
    </div>
  );
}

function ShippingboxFill3() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.pf31a600} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ShippingboxFill3 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">ชิ้น</p>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame38 />
      <Frame3 />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative">
      <Frame32 />
      <Frame33 />
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(212,212,212,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative w-full">
          <Frame17 />
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <Frame18 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
      <Frame37 />
    </div>
  );
}

function Frame10() {
  return (
    <div className="aspect-[80/80] relative rounded-[16px] shrink-0 w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#d4d4d8] content-stretch flex flex-col items-center justify-center relative rounded-[16px] shrink-0 size-[80px]">
      <Frame10 />
    </div>
  );
}

function CirclebadgeFill2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="circlebadge.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p3d60edc0} fill="var(--fill-0, #FF9500)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Only2() {
  return (
    <div className="content-stretch flex gap-[8px] items-center pl-[8px] pr-[14px] py-[2px] relative rounded-[100px] shrink-0" data-name="Only" style={{ backgroundImage: "linear-gradient(90deg, rgba(255, 149, 0, 0.1) 0%, rgba(255, 149, 0, 0.1) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
      <CirclebadgeFill2 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff9500] text-[14px] text-left whitespace-nowrap">
        <p className="leading-[normal]">ราคาเดียว</p>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">Product</p>
      </div>
      <Only2 />
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#319754] text-[14px] text-left whitespace-nowrap">
        <p className="leading-[normal]">฿ 0.00</p>
      </div>
    </div>
  );
}

function ShippingboxFill4() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.pf31a600} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <ShippingboxFill4 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-left whitespace-nowrap">
        <p className="leading-[normal]">ชิ้น</p>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame43 />
      <Frame4 />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col h-full items-start justify-between min-h-px min-w-px relative">
      <Frame41 />
      <Frame42 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div aria-hidden="true" className="absolute border border-[rgba(212,212,212,0.25)] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[16px] items-center p-[16px] relative w-full">
          <Frame19 />
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch">
            <Frame20 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
      <Frame40 />
    </div>
  );
}

function Frame24() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[16px] items-start left-0 top-0 w-[468px]">
      <button className="content-stretch cursor-pointer flex items-start overflow-clip relative rounded-[16px] shrink-0 w-full" data-name="item product">
        <Frame35 />
      </button>
      <div className="content-stretch flex flex-col gap-[10px] items-start relative rounded-[16px] shrink-0 w-full">
        <Frame30 />
      </div>
      <div className="content-stretch flex flex-col gap-[10px] items-start relative rounded-[16px] shrink-0 w-full">
        <Frame31 />
      </div>
      <button className="content-stretch cursor-pointer flex items-start overflow-clip relative rounded-[16px] shrink-0 w-full">
        <Frame36 />
      </button>
      <button className="content-stretch cursor-pointer flex items-start overflow-clip relative rounded-[16px] shrink-0 w-full">
        <Frame39 />
      </button>
    </div>
  );
}

function Frame25() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px overflow-x-clip overflow-y-auto relative w-full">
      <Frame24 />
    </div>
  );
}

export default function SelectProduct() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip p-[16px] relative rounded-[16px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] size-full" data-name="Select Product">
      <Frame5 />
      <InputSearchBarWithIcon />
      <Frame25 />
    </div>
  );
}