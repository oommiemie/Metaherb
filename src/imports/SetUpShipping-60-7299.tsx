import svgPaths from "./svg-fcaayxe3q1";
import imgFrame1321316006 from "figma:asset/abeb9c66722ed46a330a72254347776f83a06d35.png";
import imgFrame1321316007 from "figma:asset/4bd7479b6d460823113bed1e63aa59635e44889b.png";
import imgFrame1321316008 from "figma:asset/99777e028092284d9d5e16e0183e6cbcb8c385f5.png";
import imgFrame1321316009 from "figma:asset/9ce997a9911937728e9277c6192377fc345a3a15.png";
import imgFrame1321316010 from "figma:asset/9627f70566a93994285725fe9e9aa9efa3f89bf5.png";

function InfoCircleFill() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="info.circle.fill 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H0V14H14V0Z" fill="var(--fill-0, #8E8E93)" id="Vector" opacity="0" />
          <path d={svgPaths.p64af700} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <InfoCircleFill />
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#8e8e93] text-[12px]">
        <p className="leading-[normal]">กำหนดยอดส่งฟรีและขนส่งที่ร้านใช้บริการ</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ตั้งค่าการจัดส่ง</p>
      </div>
      <Frame18 />
    </div>
  );
}

function ReadMoreContainer() {
  return (
    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div aria-hidden="true" className="absolute border border-[#ff3b30] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#ff3b30] text-[12px] whitespace-nowrap">
        <p className="leading-[normal]">ยกเลิก</p>
      </div>
    </div>
  );
}

function ReadMoreContainer1() {
  return (
    <button className="bg-[#319754] content-stretch cursor-pointer flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0" data-name="Read More Container">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-left text-white whitespace-nowrap">
        <p className="leading-[normal]">บันทึก</p>
      </div>
    </button>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <ReadMoreContainer />
      <ReadMoreContainer1 />
    </div>
  );
}

function Frame27() {
  return (
    <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
      <Frame19 />
      <Frame12 />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[24px] pr-[8px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p className="leading-[normal]">0</p>
          </div>
          <div className="h-[32px] relative shrink-0 w-[92px]" data-name="Stepper">
            <div className="-translate-x-1/2 absolute bg-[rgba(60,60,67,0.3)] h-[24px] left-1/2 rounded-[8px] top-[4px] w-px" data-name="Separator" />
            <div className="absolute bg-[rgba(116,116,128,0.08)] h-[32px] left-0 right-1/2 rounded-bl-[100px] rounded-tl-[100px] top-0" data-name="_Decrement">
              <div className="-translate-y-1/2 absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] left-0 right-0 text-[17px] text-black text-center top-1/2 tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[22px]">􀅽</p>
              </div>
            </div>
            <div className="absolute bg-[rgba(116,116,128,0.08)] h-[32px] left-1/2 right-0 rounded-br-[100px] rounded-tr-[100px] top-0" data-name="_Increment">
              <div className="-translate-y-1/2 absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] left-0 right-0 text-[17px] text-black text-center top-1/2 tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[22px]">􀅼</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCircleFill1() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="info.circle.fill 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H0V14H14V0Z" fill="var(--fill-0, #8E8E93)" id="Vector" opacity="0" />
          <path d={svgPaths.p64af700} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
      <InfoCircleFill1 />
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#8e8e93] text-[12px]">
        <p className="leading-[normal]">ตั้งค่าเป็น 0 เพื่อปิดส่งฟรี (เช่น 500 = ฟรีเมื่อซื้อครบ 500 บาท)</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-start shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#090909] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ยอดสั่งซื้อขั้นต่ำที่ส่งฟรี (บาท)</p>
      </div>
      <ButtonIcon />
      <Frame20 />
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pl-[24px] pr-[8px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
            <p className="leading-[normal]">0</p>
          </div>
          <div className="h-[32px] relative shrink-0 w-[92px]" data-name="Stepper">
            <div className="-translate-x-1/2 absolute bg-[rgba(60,60,67,0.3)] h-[24px] left-1/2 rounded-[8px] top-[4px] w-px" data-name="Separator" />
            <div className="absolute bg-[rgba(116,116,128,0.08)] h-[32px] left-0 right-1/2 rounded-bl-[100px] rounded-tl-[100px] top-0" data-name="_Decrement">
              <div className="-translate-y-1/2 absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] left-0 right-0 text-[17px] text-black text-center top-1/2 tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[22px]">􀅽</p>
              </div>
            </div>
            <div className="absolute bg-[rgba(116,116,128,0.08)] h-[32px] left-1/2 right-0 rounded-br-[100px] rounded-tr-[100px] top-0" data-name="_Increment">
              <div className="-translate-y-1/2 absolute flex flex-col font-['SF_Pro:Semibold',sans-serif] font-[590] justify-center leading-[0] left-0 right-0 text-[17px] text-black text-center top-1/2 tracking-[-0.43px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                <p className="leading-[22px]">􀅼</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#090909] text-[14px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ค่าจัดส่งเริ่มต้น (บาท)</p>
      </div>
      <ButtonIcon1 />
    </div>
  );
}

function InfoCircleFill2() {
  return (
    <div className="overflow-clip relative shrink-0 size-[14px]" data-name="info.circle.fill 2">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Group">
          <path d="M14 0H0V14H14V0Z" fill="var(--fill-0, #8E8E93)" id="Vector" opacity="0" />
          <path d={svgPaths.p64af700} fill="var(--fill-0, #8E8E93)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0 w-full">
      <InfoCircleFill2 />
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#8e8e93] text-[12px]">
        <p className="leading-[normal]">ใช้เมื่อไม่มี shipping rate ที่ตรงกับน้ำหนักสินค้า</p>
      </div>
    </div>
  );
}

function Frame28() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-start shrink-0">
      <Frame6 />
      <Frame21 />
    </div>
  );
}

function Frame29() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(1,fit-content(100%))] relative shrink-0 w-[1094px]">
      <Frame5 />
      <Frame28 />
    </div>
  );
}

function Frame7() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-[#f2f2f7] inset-0 rounded-[8px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[8px] size-full" src={imgFrame1321316006} />
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
      <Frame7 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ไปรษณีย์ไทย</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-white h-[10px] shrink-0 w-px" data-name="AX Label" />
    </div>
  );
}

function Knob() {
  return <div className="bg-white h-[24px] rounded-[100px] shrink-0 w-[39px]" data-name="Knob" />;
}

function Frame22() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame13 />
      <div className="bg-[#34c759] content-stretch flex items-center justify-between overflow-clip p-[2px] relative rounded-[100px] shrink-0 w-[64px]" data-name="Toggle - Switch">
        <Frame />
        <Knob />
      </div>
    </div>
  );
}

function SaleSeting() {
  return (
    <div className="bg-[#fafafa] col-1 justify-self-stretch relative rounded-[16px] row-1 self-start shrink-0" data-name="Sale Seting">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Frame22 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-[#f2f2f7] inset-0 rounded-[8px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[8px] size-full" src={imgFrame1321316007} />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
      <Frame8 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">Kerry Express</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-center min-h-px min-w-px relative" data-name="Frame">
      <div className="bg-white h-[10px] shrink-0 w-px" data-name="AX Label" />
    </div>
  );
}

function Knob1() {
  return <div className="bg-white h-[24px] rounded-[100px] shrink-0 w-[39px]" data-name="Knob" />;
}

function Frame23() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame14 />
      <div className="bg-[#34c759] content-stretch flex items-center justify-between overflow-clip p-[2px] relative rounded-[100px] shrink-0 w-[64px]" data-name="Toggle - Switch">
        <Frame1 />
        <Knob1 />
      </div>
    </div>
  );
}

function SaleSeting1() {
  return (
    <div className="bg-[#fafafa] col-2 justify-self-stretch relative rounded-[16px] row-1 self-start shrink-0" data-name="Sale Seting">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Frame23 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-[#f2f2f7] inset-0 rounded-[8px]" />
        <img alt="" className="absolute max-w-none object-cover rounded-[8px] size-full" src={imgFrame1321316008} />
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
      <Frame9 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">Flash Express</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="absolute h-[10px] left-[41px] top-[9px] w-[21px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 10">
        <g id="Frame">
          <circle cx="10.5" cy="5" id="AX Label" r="4.5" stroke="var(--stroke-0, #B3B3B3)" />
        </g>
      </svg>
    </div>
  );
}

function Knob2() {
  return <div className="absolute bg-white bottom-[7.14%] left-[2px] rounded-[100px] top-[7.14%] w-[39px]" data-name="Knob" />;
}

function Frame24() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame15 />
      <div className="bg-[rgba(60,60,67,0.3)] h-[28px] overflow-clip relative rounded-[100px] shrink-0 w-[64px]" data-name="Toggle - Switch">
        <Frame2 />
        <Knob2 />
      </div>
    </div>
  );
}

function SaleSeting2() {
  return (
    <div className="bg-[#fafafa] col-3 justify-self-stretch relative rounded-[16px] row-1 self-start shrink-0" data-name="Sale Seting">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Frame24 />
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-[#f2f2f7] inset-0 rounded-[8px]" />
        <img alt="" className="absolute max-w-none object-contain rounded-[8px] size-full" src={imgFrame1321316009} />
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
      <Frame10 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">DHL Express</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="absolute h-[10px] left-[41px] top-[9px] w-[21px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 10">
        <g id="Frame">
          <circle cx="10.5" cy="5" id="AX Label" r="4.5" stroke="var(--stroke-0, #B3B3B3)" />
        </g>
      </svg>
    </div>
  );
}

function Knob3() {
  return <div className="absolute bg-white bottom-[7.14%] left-[2px] rounded-[100px] top-[7.14%] w-[39px]" data-name="Knob" />;
}

function Frame25() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame16 />
      <div className="bg-[rgba(60,60,67,0.3)] h-[28px] overflow-clip relative rounded-[100px] shrink-0 w-[64px]" data-name="Toggle - Switch">
        <Frame3 />
        <Knob3 />
      </div>
    </div>
  );
}

function SaleSeting3() {
  return (
    <div className="bg-[#fafafa] col-1 justify-self-stretch relative rounded-[16px] row-2 self-start shrink-0" data-name="Sale Seting">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Frame25 />
        </div>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[40px]">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[8px]">
        <div className="absolute bg-[#f2f2f7] inset-0 rounded-[8px]" />
        <img alt="" className="absolute max-w-none object-contain rounded-[8px] size-full" src={imgFrame1321316010} />
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[16px] items-center justify-center relative shrink-0">
      <Frame11 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">{`J&T Express`}</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="absolute h-[10px] left-[41px] top-[9px] w-[21px]" data-name="Frame">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21 10">
        <g id="Frame">
          <circle cx="10.5" cy="5" id="AX Label" r="4.5" stroke="var(--stroke-0, #B3B3B3)" />
        </g>
      </svg>
    </div>
  );
}

function Knob4() {
  return <div className="absolute bg-white bottom-[7.14%] left-[2px] rounded-[100px] top-[7.14%] w-[39px]" data-name="Knob" />;
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame17 />
      <div className="bg-[rgba(60,60,67,0.3)] h-[28px] overflow-clip relative rounded-[100px] shrink-0 w-[64px]" data-name="Toggle - Switch">
        <Frame4 />
        <Knob4 />
      </div>
    </div>
  );
}

function SaleSeting4() {
  return (
    <div className="bg-[#fafafa] col-2 justify-self-stretch relative rounded-[16px] row-2 self-start shrink-0" data-name="Sale Seting">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start p-[16px] relative w-full">
          <Frame26 />
        </div>
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(3,minmax(0,1fr))] grid-rows-[repeat(2,fit-content(100%))] relative shrink-0 w-[1094px]">
      <SaleSeting />
      <SaleSeting1 />
      <SaleSeting2 />
      <SaleSeting3 />
      <SaleSeting4 />
    </div>
  );
}

export default function SetUpShipping() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="Set up shipping">
      <Frame27 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="1094" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame29 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1094 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="1094" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ขนส่งที่ร้านใช้บริการ</p>
      </div>
      <Frame30 />
    </div>
  );
}