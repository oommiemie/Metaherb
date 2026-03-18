import svgPaths from "./svg-awq66h9ar7";

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
    <div className="bg-[rgba(120,120,128,0.12)] content-stretch flex items-center justify-center relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
      <Multiply />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">เพิ่มที่อยู่ใหม่</p>
      </div>
      <ReadMoreContainer />
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[5px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">ชื่อ</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#ff3b30]">
        <p className="leading-[normal]">*</p>
      </div>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
            <p className="leading-[normal]">ระบุชื่อผู้รับ</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <Frame10 />
      <ButtonIcon />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[5px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">นามสกุล</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#ff3b30]">
        <p className="leading-[normal]">*</p>
      </div>
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
            <p className="leading-[normal]">นามสกุล</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative">
      <Frame11 />
      <ButtonIcon1 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <Frame2 />
      <Frame5 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[5px] h-[23px] items-center leading-[0] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">เบอร์โทรศัพท์</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#ff3b30]">
        <p className="leading-[normal]">*</p>
      </div>
    </div>
  );
}

function ButtonIcon2() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
            <p className="leading-[normal]">ระบุเบอร์โทรศัพท์</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame12 />
      <ButtonIcon2 />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[5px] items-center justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">ที่อยู่</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#ff3b30]">
        <p className="leading-[normal]">*</p>
      </div>
    </div>
  );
}

function ButtonIcon3() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
            <p className="leading-[normal]">ระบุรหัสไปรษณีย์ หรือ ตำบล / แขวง</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <Frame13 />
      <ButtonIcon3 />
    </div>
  );
}

function ButtonIcon4() {
  return (
    <div className="bg-[#fafafa] h-[48px] relative rounded-[100px] shrink-0 w-full" data-name="button-icon">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center px-[24px] py-[12px] relative size-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
            <p className="leading-[normal]">บ้านเลขที่, หมู่ที่, ชื่ออาคาร, ซอย ถนน</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">รายละเอียดที่อยู่</p>
      </div>
      <ButtonIcon4 />
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

function Frame9() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between px-px relative w-full">
          <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
            <p className="leading-[normal]">ตังเป็นที่อยู่หลัก</p>
          </div>
          <div className="bg-[#34c759] content-stretch flex items-center justify-between overflow-clip p-[2px] relative rounded-[100px] shrink-0 w-[64px]" data-name="Toggle - Switch">
            <Frame />
            <Knob />
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#008c45] content-stretch flex flex-col h-[49px] items-center justify-center relative rounded-[100px] shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">เพิ่มที่อยู๋</p>
      </div>
    </div>
  );
}

export default function AddAddress() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip p-[16px] relative rounded-[16px] shadow-[0px_0px_8px_0px_rgba(0,0,0,0.25)] size-full" data-name="Add Address">
      <Frame4 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 468 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="468" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame6 />
      <Frame3 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 468 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="468" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <Frame1 />
    </div>
  );
}