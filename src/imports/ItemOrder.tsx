import svgPaths from "./svg-spn304ifvl";
import imgFrame1321315985 from "figma:asset/9e21f4217f39c8b2aaff50eadcf63d44b0fcf83c.png";

function Frame20() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ชื่อร้านค้า</p>
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

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] items-end relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ดูรายละเอียด</p>
      </div>
      <ArrowForwardCircleFill />
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame20 />
      <Frame3 />
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#ff8d28] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-center text-white whitespace-nowrap">
        <p className="leading-[normal]">รอชำระเงิน</p>
      </div>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ORD-20260218-03571</p>
      </div>
      <Frame15 />
    </div>
  );
}

function Frame23() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame21 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#8e8e93] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">18 ก.พ. 2569 - 15:00 น.</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start relative shrink-0 w-full">
      <Frame18 />
      <Frame23 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="aspect-[80/80] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[60px]">
      <Frame5 />
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[#999] text-[10px]">
        <p className="leading-[normal]">จำนวน 1 ชิ้น</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
        <p className="leading-[normal]">฿0.00</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[0] min-h-px min-w-px not-italic relative self-stretch text-center whitespace-nowrap">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 text-[12px] text-black">
        <p className="leading-[normal]">ชาออร์แกนิก</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[10px] text-black">
        <p className="leading-[normal]">ตัวเลือก 1</p>
      </div>
      <Frame14 />
    </div>
  );
}

function ProductPay() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[16px] shrink-0 w-full" data-name="product pay">
      <Frame10 />
      <Frame6 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="aspect-[80/80] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[60px]">
      <Frame7 />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[#999] text-[10px]">
        <p className="leading-[normal]">จำนวน 1 ชิ้น</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
        <p className="leading-[normal]">฿0.00</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[0] min-h-px min-w-px not-italic relative text-center whitespace-nowrap">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 text-[12px] text-black">
        <p className="leading-[normal]">ชาออร์แกนิก</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[10px] text-black">
        <p className="leading-[normal]">ตัวเลือก 1</p>
      </div>
      <Frame16 />
    </div>
  );
}

function ProductPay1() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[16px] shrink-0 w-full" data-name="product pay">
      <Frame11 />
      <Frame8 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="aspect-[80/80] flex-[1_0_0] min-h-px min-w-px relative rounded-[16px]">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[16px] size-full" src={imgFrame1321315985} />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 size-[60px]">
      <Frame9 />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[#999] text-[10px]">
        <p className="leading-[normal]">จำนวน 1 ชิ้น</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:SemiBold',sans-serif] justify-center relative shrink-0 text-[14px] text-black">
        <p className="leading-[normal]">฿0.00</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[2px] items-start leading-[0] min-h-px min-w-px not-italic relative self-stretch text-center whitespace-nowrap">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 text-[12px] text-black">
        <p className="leading-[normal]">ชาออร์แกนิก</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[10px] text-black">
        <p className="leading-[normal]">ตัวเลือก 1</p>
      </div>
      <Frame17 />
    </div>
  );
}

function ProductPay2() {
  return (
    <div className="content-stretch flex gap-[10px] items-start relative rounded-[16px] shrink-0 w-full" data-name="product pay">
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[10px] h-[33px] items-center justify-end leading-[0] not-italic relative shrink-0 text-center whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-[#8e8e93] text-[14px]">
        <p className="leading-[normal]">รวมการสั่งซื้อ:</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#ff383c] text-[20px]">
        <p className="leading-[normal]">฿0.00</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col h-[40px] items-center justify-center relative rounded-[100px] shrink-0 w-[120px]">
      <div aria-hidden="true" className="absolute border border-[#ff3b30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff383c] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">ยกเลิก</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#319754] content-stretch flex flex-col gap-[10px] h-[40px] items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[120px]">
      <div className="absolute h-[52px] left-[24px] top-0 w-[102px]" data-name="image 3" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">ชำระเงิน</p>
      </div>
    </div>
  );
}

function Frame22() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame4 />
      <Frame22 />
    </div>
  );
}

export default function ItemOrder() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[10px] items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="item order">
      <Frame19 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 768 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="768" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <ProductPay />
      <ProductPay1 />
      <ProductPay2 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 768 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="768" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame2 />
    </div>
  );
}