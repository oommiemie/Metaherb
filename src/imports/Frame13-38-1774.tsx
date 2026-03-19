import svgPaths from "./svg-rhf6o4vwkd";
import imgFrame37 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";
import imgFrame38 from "figma:asset/65ea2a657795aec6992e8d4a3ce15d6c97d4a58f.png";
import imgFrame39 from "figma:asset/a2957ec89f7626ef68d6b3c51a451a3e4664c08d.png";
import imgEllipse1 from "figma:asset/f9c837257a7dc5d10d1ea92a733813c293a76a81.png";
import imgFrame40 from "figma:asset/dff4d147a4f36cd01cc4ab790d8ae3472bff4e15.png";
import imgFrame41 from "figma:asset/75fcd2ce0747a1f740ab8306f0a0a74e93ef9cf8.png";
import imgFrame42 from "figma:asset/2760a63146309433afbbc9a2171f4189dfd27e07.png";
import imgFrame43 from "figma:asset/623849f160a45efb31fada62d7efbfb3f3bab60f.png";
import imgFrame44 from "figma:asset/b251ac55d2f44764962036699fe6da4d05a98501.png";

function ChevronForward() {
  return (
    <div className="h-[12px] overflow-clip relative w-[8px]" data-name="chevron.forward 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8 12">
        <g id="Group">
          <path d="M8 0H0V12H8V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1f1a0400} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="bg-[#d4d4d4] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <ChevronForward />
        </div>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">กลับ</p>
      </div>
    </div>
  );
}

function HeartFill() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[13px]" data-name="heart.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 12">
        <g id="Group">
          <path d="M13 0H0V12H13V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p11fa5480} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer1() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <HeartFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">0</p>
      </div>
    </div>
  );
}

function EllipsisMessageFill() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[14px]" data-name="ellipsis.message.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 12">
        <g id="Group">
          <path d="M14 0H0V12H14V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1fcf6300} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer2() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <EllipsisMessageFill />
    </div>
  );
}

function SquareAndArrowUpFill() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-[12px]" data-name="square.and.arrow.up.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 16">
        <g id="Group">
          <path d="M12 0H0V16H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p356a5cc0} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer3() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <SquareAndArrowUpFill />
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <ReadMoreContainer1 />
      <ReadMoreContainer2 />
      <ReadMoreContainer3 />
    </div>
  );
}

function Frame53() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <ReadMoreContainer />
      <Frame55 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-[16px] w-[450px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame37} />
      <div className="flex flex-col items-end size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="pointer-events-none relative rounded-[16px] shrink-0 size-[70px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover rounded-[16px] size-full" src={imgFrame37} />
      <div aria-hidden="true" className="absolute border-2 border-[#f8e8ce] border-solid inset-0 rounded-[16px]" />
    </div>
  );
}

function Frame14() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[70px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame38} />
    </div>
  );
}

function Frame15() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[70px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame39} />
    </div>
  );
}

function Frame16() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[70px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame39} />
    </div>
  );
}

function Frame17() {
  return (
    <div className="relative rounded-[16px] shrink-0 size-[70px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame39} />
    </div>
  );
}

function Frame54() {
  return (
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full">
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame52() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0">
      <Frame53 />
      <Frame12 />
      <Frame54 />
    </div>
  );
}

function Group() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0" data-name="Read More Container">
      <Group />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">4.6/5</p>
      </div>
    </div>
  );
}

function BagFill() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[11px]" data-name="bag.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
        <g id="Group">
          <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p2595fa00} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer5() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0" data-name="Read More Container">
      <BagFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ขายแล้ว 0 ชิ้น</p>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <ReadMoreContainer4 />
      <ReadMoreContainer5 />
    </div>
  );
}

function Frame62() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[20px] text-black text-ellipsis w-full whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ชาออร์แกนิก</p>
      </div>
      <Frame61 />
    </div>
  );
}

function Frame58() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#297a4e] text-[24px] text-center whitespace-nowrap">
        <p className="leading-[normal]">฿ 0.00</p>
      </div>
    </div>
  );
}

function Frame63() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center whitespace-nowrap">
          <p className="leading-[normal]">ราคาสินค้า</p>
        </div>
        <Frame58 />
      </div>
    </div>
  );
}

function ReadMoreContainer6() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ตัวเลือก 1</p>
      </div>
    </div>
  );
}

function ReadMoreContainer7() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ตัวเลือก 2</p>
      </div>
    </div>
  );
}

function ReadMoreContainer8() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ตัวเลือก 3</p>
      </div>
    </div>
  );
}

function ReadMoreContainer9() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ตัวเลือก 4</p>
      </div>
    </div>
  );
}

function ReadMoreContainer10() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ตัวเลือก 5</p>
      </div>
    </div>
  );
}

function Frame60() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0">
      <ReadMoreContainer6 />
      <ReadMoreContainer7 />
      <ReadMoreContainer8 />
      <ReadMoreContainer9 />
      <ReadMoreContainer10 />
    </div>
  );
}

function Frame59() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ตัวเลือกสินค้า</p>
      </div>
      <Frame60 />
    </div>
  );
}

function Minus() {
  return (
    <div className="h-px overflow-clip relative shrink-0 w-[12px]" data-name="minus 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 1">
        <g id="Group">
          <path d="M12 0H0V1H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.pdf75300} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Plus() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="plus 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1a93ed80} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex gap-[24px] items-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="button-icon">
      <Minus />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
      <Plus />
    </div>
  );
}

function ShippingboxFill() {
  return (
    <div className="h-[17px] overflow-clip relative shrink-0 w-[16px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 17">
        <g id="Group">
          <path d="M16 0H0V17H16V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p3a1e14f0} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer11() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative rounded-[100px] shrink-0" data-name="Read More Container">
      <ShippingboxFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">เหลือเพียง 10 ชิ้น</p>
      </div>
    </div>
  );
}

function Frame65() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <ButtonIcon />
      <ReadMoreContainer11 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#666] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">จำนวนสินค้า</p>
      </div>
      <Frame65 />
    </div>
  );
}

function CartBadgePlus() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-[22px]" data-name="cart.badge.plus 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 22 16">
        <g id="Group">
          <path d="M22 0H0V16H22V0Z" fill="var(--fill-0, #C59507)" id="Vector" opacity="0" />
          <path d={svgPaths.p3087100} fill="var(--fill-0, #C59507)" id="Vector_2" />
          <path d={svgPaths.p5cbde00} fill="var(--fill-0, #C59507)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[10px] h-[48px] items-center justify-center relative rounded-[100px] shrink-0 w-[200px]">
      <div aria-hidden="true" className="absolute border border-[#db8b0a] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <CartBadgePlus />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#db8b0a] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">เพิ่มไปยังรถเข็น</p>
      </div>
    </div>
  );
}

function Bag() {
  return (
    <div className="h-[16px] overflow-clip relative shrink-0 w-[14px]" data-name="bag 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 16">
        <g id="Group">
          <path d="M14 0H0V16H14V0Z" fill="var(--fill-0, white)" id="Vector" opacity="0" />
          <path d={svgPaths.p294be700} fill="var(--fill-0, white)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#319754] content-stretch flex gap-[10px] h-[48px] items-center justify-center relative rounded-[100px] shrink-0 w-[200px]">
      <Bag />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">ซื้อสินค้า</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-center py-[24px] relative shrink-0">
      <Frame1 />
      <Frame2 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative self-stretch">
      <Frame62 />
      <Frame63 />
      <Frame59 />
      <Frame64 />
      <Frame3 />
    </div>
  );
}

function Frame67() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start leading-[0] not-italic relative shrink-0 text-black w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 text-[20px] text-center whitespace-nowrap">
        <p className="leading-[normal]">รายละเอียดผลิตภัณฑ์</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center min-w-full relative shrink-0 text-[14px] w-[min-content]">
        <p className="leading-[normal]">สัมผัสรสละมุนของชาออร์แกนิกแท้ 100% จากยอดเขาบรรทัด ปลูกด้วยใจรัก ปราศจากสารเคมีปรุงแต่ง เพื่อสุขภาพที่ดีของคุณ</p>
      </div>
    </div>
  );
}

function Frame69() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 text-[14px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 w-[80px]">
        <p className="leading-[normal]">น้ำหนักสุทธิ:</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-center whitespace-nowrap">
        <p className="leading-[normal]">50 กรัม</p>
      </div>
    </div>
  );
}

function Frame70() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 text-[14px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 w-[80px]">
        <p className="leading-[normal]">ประเภท:</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-center whitespace-nowrap">
        <p className="leading-[normal]">ชาสมุนไพร</p>
      </div>
    </div>
  );
}

function Frame71() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 text-[14px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 w-[80px]">
        <p className="leading-[normal]">รหัสสินค้า:</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-center whitespace-nowrap">
        <p className="leading-[normal]">MH-ORG-TEA-2024</p>
      </div>
    </div>
  );
}

function Frame72() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 text-[14px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 w-[80px]">
        <p className="leading-[normal]">รูปแบบ:</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-center whitespace-nowrap">
        <p className="leading-[normal]">ใบชาอบแห้ง</p>
      </div>
    </div>
  );
}

function Frame68() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start leading-[0] not-italic relative shrink-0 text-black">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 text-[20px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ข้อมูลจำเพาะ</p>
      </div>
      <Frame69 />
      <Frame70 />
      <Frame71 />
      <Frame72 />
    </div>
  );
}

function Frame66() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
          <Frame67 />
          <div className="h-0 relative shrink-0 w-full">
            <div className="absolute inset-[-1px_0_0_0]">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1160 1">
                <line id="Line 2" stroke="var(--stroke-0, #D4D4D8)" x2="1160" y1="0.5" y2="0.5" />
              </svg>
            </div>
          </div>
          <Frame68 />
        </div>
      </div>
    </div>
  );
}

function ShippingboxFill1() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-[13px]" data-name="shippingbox.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 14">
        <g id="Group">
          <path d="M13 0H0V14H13V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p2d3b1d00} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame108() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ShippingboxFill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">รายการสินค้า</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a2845e] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">100</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Light',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">รายการ</p>
      </div>
    </div>
  );
}

function Group1() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, black)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame109() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Group1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">คะแนนร้านค้า</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a2845e] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">4.6/5</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Light',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">การให้คะแนนทั้งหมด 100</p>
      </div>
    </div>
  );
}

function HeartFill1() {
  return (
    <div className="h-[12px] overflow-clip relative shrink-0 w-[13px]" data-name="heart.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 12">
        <g id="Group">
          <path d="M13 0H0V12H13V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p11fa5480} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame112() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <HeartFill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ถูกใจสินค้า</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a2845e] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">100</p>
      </div>
    </div>
  );
}

function Frame110() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0">
      <Frame108 />
      <Frame109 />
      <Frame112 />
    </div>
  );
}

function Frame111() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start justify-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">METAHERB Store</p>
      </div>
      <Frame110 />
    </div>
  );
}

function Frame107() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <div className="relative shrink-0 size-[70px]">
        <img alt="" className="absolute block max-w-none size-full" height="70" src={imgEllipse1} width="70" />
      </div>
      <Frame111 />
    </div>
  );
}

function Storefront() {
  return (
    <div className="overflow-clip relative shrink-0 size-[12px]" data-name="storefront 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Group">
          <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p388b7000} fill="var(--fill-0, #319754)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer12() {
  return (
    <div className="bg-[#d6eadd] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <Storefront />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#319754] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">ดูร้านค้า</p>
      </div>
    </div>
  );
}

function Frame106() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame107 />
      <ReadMoreContainer12 />
    </div>
  );
}

function Frame73() {
  return (
    <div className="bg-white content-stretch flex flex-col h-[102px] items-start overflow-clip p-[16px] relative rounded-[16px] shrink-0 w-[1192px]">
      <Frame106 />
    </div>
  );
}

function Group2() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer13() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <Group2 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ทั้งหมด</p>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer14() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <Group3 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer15() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <Group4 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer16() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <Group5 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Group6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer17() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <Group6 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Group7() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function ReadMoreContainer18() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <Group7 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">5</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0">
      <ReadMoreContainer13 />
      <ReadMoreContainer14 />
      <ReadMoreContainer15 />
      <ReadMoreContainer16 />
      <ReadMoreContainer17 />
      <ReadMoreContainer18 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">รีวิวสินค้า</p>
      </div>
      <Frame6 />
    </div>
  );
}

function Group8() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group9() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group10() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group11() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame81() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Group8 />
      <Group9 />
      <Group10 />
      <Group11 />
      <Group12 />
    </div>
  );
}

function Frame80() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[14px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">user02</p>
      </div>
      <Frame81 />
    </div>
  );
}

function Frame79() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-h-px min-w-px relative">
      <Frame80 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[normal]">15 กุมภาพันธ์ 2568 - 14:30 น.</p>
      </div>
    </div>
  );
}

function Frame78() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <Frame79 />
    </div>
  );
}

function Frame82() {
  return (
    <div className="bg-[#db8b0a] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ตัวเลือกสินค้า: ตัวเลือก 2</p>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full">
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
    </div>
  );
}

function Frame76() {
  return (
    <div className="bg-white col-1 h-[191px] justify-self-stretch relative rounded-[16px] row-1 shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] relative size-full">
        <Frame78 />
        <Frame82 />
        <p className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-w-full not-italic overflow-hidden relative shrink-0 text-[10px] text-black text-ellipsis w-[min-content]">ชานี้หอมมาก รสชาติกลมกลืน!</p>
        <Frame57 />
      </div>
    </div>
  );
}

function Group13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group14() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group15() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group16() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group17() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame87() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Group13 />
      <Group14 />
      <Group15 />
      <Group16 />
      <Group17 />
    </div>
  );
}

function Frame86() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[14px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">user03</p>
      </div>
      <Frame87 />
    </div>
  );
}

function Frame85() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-h-px min-w-px relative">
      <Frame86 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[normal]">16 กุมภาพันธ์ 2568 - 09:15 น.</p>
      </div>
    </div>
  );
}

function Frame84() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <Frame85 />
    </div>
  );
}

function Frame88() {
  return (
    <div className="bg-[#db8b0a] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ตัวเลือกสินค้า: ตัวเลือก 3</p>
      </div>
    </div>
  );
}

function Frame89() {
  return (
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full">
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
    </div>
  );
}

function Frame83() {
  return (
    <div className="bg-white col-2 h-[191px] justify-self-stretch relative rounded-[16px] row-1 shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] relative size-full">
        <Frame84 />
        <Frame88 />
        <p className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-w-full not-italic overflow-hidden relative shrink-0 text-[10px] text-black text-ellipsis w-[min-content]">รู้สึกสดชื่นหลังดื่ม ช่วยให้ผ่อนคลาย</p>
        <Frame89 />
      </div>
    </div>
  );
}

function Group18() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group19() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group20() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group21() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group22() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame94() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Group18 />
      <Group19 />
      <Group20 />
      <Group21 />
      <Group22 />
    </div>
  );
}

function Frame93() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[14px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">user04</p>
      </div>
      <Frame94 />
    </div>
  );
}

function Frame92() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-h-px min-w-px relative">
      <Frame93 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[normal]">17 กุมภาพันธ์ 2568 - 16:45 น.</p>
      </div>
    </div>
  );
}

function Frame91() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <Frame92 />
    </div>
  );
}

function Frame95() {
  return (
    <div className="bg-[#db8b0a] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ตัวเลือกสินค้า: ตัวเลือก 4</p>
      </div>
    </div>
  );
}

function Frame96() {
  return (
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full">
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
    </div>
  );
}

function Frame90() {
  return (
    <div className="bg-white col-3 h-[191px] justify-self-stretch relative rounded-[16px] row-1 shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] relative size-full">
        <Frame91 />
        <Frame95 />
        <p className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-w-full not-italic overflow-hidden relative shrink-0 text-[10px] text-black text-ellipsis w-[min-content]">รสชาติอาจจะเข้มไปนิด แต่ดีต่อสุขภาพ!</p>
        <Frame96 />
      </div>
    </div>
  );
}

function Group23() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group24() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group25() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group26() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Group27() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame101() {
  return (
    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
      <Group23 />
      <Group24 />
      <Group25 />
      <Group26 />
      <Group27 />
    </div>
  );
}

function Frame100() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[14px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">user05</p>
      </div>
      <Frame101 />
    </div>
  );
}

function Frame99() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start justify-center min-h-px min-w-px relative">
      <Frame100 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[10px] text-center whitespace-nowrap">
        <p className="leading-[normal]">18 กุมภาพันธ์ 2568 - 12:00 น.</p>
      </div>
    </div>
  );
}

function Frame98() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative shrink-0 w-full">
      <div className="relative shrink-0 size-[40px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
          <circle cx="20" cy="20" fill="var(--fill-0, #D9D9D9)" id="Ellipse 3" r="20" />
        </svg>
      </div>
      <Frame99 />
    </div>
  );
}

function Frame102() {
  return (
    <div className="bg-[#db8b0a] content-stretch flex items-start px-[8px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[10px] text-ellipsis text-white whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ตัวเลือกสินค้า: ตัวเลือก 5</p>
      </div>
    </div>
  );
}

function Frame103() {
  return (
    <div className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full">
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
      <div className="bg-[#d9d9d9] rounded-[16px] shrink-0 size-[40px]" />
    </div>
  );
}

function Frame97() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[16px] row-1 self-start shrink-0">
      <div aria-hidden="true" className="absolute border border-[#e5e5e5] border-solid inset-0 pointer-events-none rounded-[16px]" />
      <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] relative w-full">
        <Frame98 />
        <Frame102 />
        <p className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] min-w-full not-italic overflow-hidden relative shrink-0 text-[10px] text-black text-ellipsis w-[min-content]">ชาที่ดีที่สุดที่เคยลอง ได้ผลจริง!ชาที่ดีที่สุดที่เคยลอง ได้ผลจริง!ชาที่ดีที่สุดที่เคยลอง ได้ผลจริง!ชาที่ดีที่สุดที่เคยลอง ได้ผลจริง!</p>
        <Frame103 />
      </div>
    </div>
  );
}

function Frame75() {
  return (
    <div className="flex-[1_0_0] gap-x-[10px] gap-y-[10px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] min-h-px min-w-px mr-[-16px] relative">
      <Frame76 />
      <Frame83 />
      <Frame90 />
      <Frame97 />
    </div>
  );
}

function ArrowBackwardCircleFill() {
  return (
    <div className="h-[19.932px] overflow-clip relative shrink-0 w-[20.283px]" data-name="arrow.backward.circle.fill 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2832 19.9316">
        <g id="Group">
          <path d={svgPaths.p31f27600} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p1ec9ac00} fill="var(--fill-0, #143C22)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame104() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[#d6eadd] content-stretch flex flex-col items-center justify-center left-0 overflow-clip rounded-[100px] size-[32px] top-[79.5px]">
      <ArrowBackwardCircleFill />
    </div>
  );
}

function ArrowForwardCircleFill1() {
  return (
    <div className="h-[19.932px] overflow-clip relative shrink-0 w-[20.283px]" data-name="arrow.forward.circle.fill 3">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20.2832 19.9316">
        <g id="Group">
          <path d={svgPaths.p31f27600} fill="var(--fill-0, black)" id="Vector" opacity="0" />
          <path d={svgPaths.p249d7900} fill="var(--fill-0, #143C22)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame105() {
  return (
    <div className="absolute backdrop-blur-[2px] bg-[#d6eadd] content-stretch flex flex-col items-center justify-center left-[1128px] overflow-clip rounded-[100px] size-[32px] top-[79.5px]">
      <ArrowForwardCircleFill1 />
    </div>
  );
}

function Frame77() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center pl-[16px] pr-[32px] relative w-full">
          <Frame75 />
          <Frame104 />
          <Frame105 />
        </div>
      </div>
    </div>
  );
}

function Frame74() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative w-full">
          <Frame7 />
          <Frame77 />
        </div>
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

function Frame9() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ดูทั้งหมด</p>
      </div>
      <ArrowForwardCircleFill />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">สินค้าเหมาะกับคุณ</p>
      </div>
      <Frame9 />
    </div>
  );
}

function Frame19() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#143c22] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">สินค้าแนะนำ</p>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[16px] rounded-tr-[16px] w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] rounded-tr-[16px] size-full" src={imgFrame37} />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end p-[8px] relative size-full">
          <Frame19 />
        </div>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-[14px]" data-name="tag 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <path d="M14 0H0V15H14V0Z" fill="var(--fill-0, #947005)" id="Vector" opacity="0" />
          <path d={svgPaths.p1939b280} fill="var(--fill-0, #DF9723)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 199.00</p>
      </div>
      <Tag />
    </div>
  );
}

function StarFill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="star.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <StarFill />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black w-[28px]">
        <p className="leading-[normal]">4.5/5</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame21 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right w-[71px]">
        <p className="leading-[normal]">ขายไป 150+</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[10px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">ชาออร์แกนิก</p>
        </div>
        <Frame20 />
        <Frame11 />
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#143c22] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">กาแฟอาราบิก้า</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[16px] rounded-tr-[16px] w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] rounded-tr-[16px] size-full" src={imgFrame40} />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end p-[8px] relative size-full">
          <Frame23 />
        </div>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-[14px]" data-name="tag 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <path d="M14 0H0V15H14V0Z" fill="var(--fill-0, #947005)" id="Vector" opacity="0" />
          <path d={svgPaths.p1939b280} fill="var(--fill-0, #DF9723)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame25() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 250.00</p>
      </div>
      <Tag1 />
    </div>
  );
}

function StarFill1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="star.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <StarFill1 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black w-[28px]">
        <p className="leading-[normal]">4.8/5</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame27 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right w-[71px]">
        <p className="leading-[normal]">ขายไป 80+</p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[10px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">กาแฟคั่วบด</p>
        </div>
        <Frame25 />
        <Frame26 />
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#143c22] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">โปรโมชั่นพิเศษ</p>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[16px] rounded-tr-[16px] w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] rounded-tr-[16px] size-full" src={imgFrame41} />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end p-[8px] relative size-full">
          <Frame29 />
        </div>
      </div>
    </div>
  );
}

function Tag2() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-[14px]" data-name="tag 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <path d="M14 0H0V15H14V0Z" fill="var(--fill-0, #947005)" id="Vector" opacity="0" />
          <path d={svgPaths.p1939b280} fill="var(--fill-0, #DF9723)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame31() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 150.00</p>
      </div>
      <Tag2 />
    </div>
  );
}

function StarFill2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="star.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame33() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <StarFill2 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black w-[28px]">
        <p className="leading-[normal]">4.7/5</p>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame33 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right w-[71px]">
        <p className="leading-[normal]">ขายไป 120+</p>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[10px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">น้ำผลไม้สด</p>
        </div>
        <Frame31 />
        <Frame32 />
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#143c22] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">สินค้าขายดี</p>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[16px] rounded-tr-[16px] w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] rounded-tr-[16px] size-full" src={imgFrame42} />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end p-[8px] relative size-full">
          <Frame35 />
        </div>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-[14px]" data-name="tag 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <path d="M14 0H0V15H14V0Z" fill="var(--fill-0, #947005)" id="Vector" opacity="0" />
          <path d={svgPaths.p1939b280} fill="var(--fill-0, #DF9723)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame37() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 180.00</p>
      </div>
      <Tag3 />
    </div>
  );
}

function StarFill3() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="star.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <StarFill3 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black w-[28px]">
        <p className="leading-[normal]">4.6/5</p>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame39 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right w-[71px]">
        <p className="leading-[normal]">ขายไป 90+</p>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[10px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">สมูทตี้เบอร์รี่</p>
        </div>
        <Frame37 />
        <Frame38 />
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#143c22] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">รีวิวจากลูกค้า</p>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[16px] rounded-tr-[16px] w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] rounded-tr-[16px] size-full" src={imgFrame43} />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end p-[8px] relative size-full">
          <Frame41 />
        </div>
      </div>
    </div>
  );
}

function Tag4() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-[14px]" data-name="tag 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <path d="M14 0H0V15H14V0Z" fill="var(--fill-0, #947005)" id="Vector" opacity="0" />
          <path d={svgPaths.p1939b280} fill="var(--fill-0, #DF9723)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame43() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 75.00</p>
      </div>
      <Tag4 />
    </div>
  );
}

function StarFill4() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="star.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame45() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <StarFill4 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black w-[28px]">
        <p className="leading-[normal]">4.5/5</p>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame45 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right w-[71px]">
        <p className="leading-[normal]">ขายไป 200+</p>
      </div>
    </div>
  );
}

function Frame42() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[10px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">ขนมปังโฮลวีต</p>
        </div>
        <Frame43 />
        <Frame44 />
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="bg-[#319754] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div aria-hidden="true" className="absolute border border-[#143c22] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">สินค้าลดราคา</p>
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative rounded-tl-[16px] rounded-tr-[16px] w-full">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-tl-[16px] rounded-tr-[16px] size-full" src={imgFrame44} />
      <div className="flex flex-col items-end size-full">
        <div className="content-stretch flex flex-col items-end p-[8px] relative size-full">
          <Frame47 />
        </div>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div className="h-[15px] overflow-clip relative shrink-0 w-[14px]" data-name="tag 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 15">
        <g id="Group">
          <path d="M14 0H0V15H14V0Z" fill="var(--fill-0, #947005)" id="Vector" opacity="0" />
          <path d={svgPaths.p1939b280} fill="var(--fill-0, #DF9723)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame49() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 300.00</p>
      </div>
      <Tag5 />
    </div>
  );
}

function StarFill5() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="star.fill 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H9.51004e-10V14H14V0Z" fill="var(--fill-0, #F7C42B)" id="Vector" opacity="0" />
          <path d={svgPaths.p1052b000} fill="var(--fill-0, #F7C42B)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame51() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
      <StarFill5 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black w-[28px]">
        <p className="leading-[normal]">4.9/5</p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame51 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right w-[71px]">
        <p className="leading-[normal]">ขายไป 60+</p>
      </div>
    </div>
  );
}

function Frame48() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[4px] items-start p-[10px] relative w-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-black text-ellipsis w-full whitespace-nowrap">
          <p className="leading-[normal] overflow-hidden">เค้กช็อกโกแลต</p>
        </div>
        <Frame49 />
        <Frame50 />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="flex-[1_0_0] gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(6,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] min-h-px min-w-px relative w-full">
      <div className="bg-white col-1 content-stretch flex flex-col h-[259px] items-start justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="product-card/new">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <Frame18 />
        <Frame10 />
      </div>
      <div className="bg-white col-2 content-stretch flex flex-col h-[259px] items-start justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="product-card/new">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <Frame22 />
        <Frame24 />
      </div>
      <div className="bg-white col-3 content-stretch flex flex-col h-[259px] items-start justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="product-card/new">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <Frame28 />
        <Frame30 />
      </div>
      <div className="bg-white col-4 content-stretch flex flex-col h-[259px] items-start justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="product-card/new">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <Frame34 />
        <Frame36 />
      </div>
      <div className="bg-white col-5 content-stretch flex flex-col h-[259px] items-start justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="product-card/new">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <Frame40 />
        <Frame42 />
      </div>
      <div className="bg-white col-6 content-stretch flex flex-col h-[259px] items-start justify-self-stretch relative rounded-[16px] row-1 shrink-0" data-name="product-card/new">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[16px]" />
        <Frame46 />
        <Frame48 />
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[16px] relative w-full">
        <Frame8 />
        <Frame />
      </div>
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col gap-[16px] items-start px-[124px] py-[16px] relative size-full">
      <div className="content-stretch flex gap-[24px] items-start overflow-clip relative shrink-0 w-[1192px]" data-name="producdetail">
        <Frame52 />
        <Frame56 />
      </div>
      <Frame66 />
      <Frame73 />
      <Frame74 />
      <Frame5 />
    </div>
  );
}