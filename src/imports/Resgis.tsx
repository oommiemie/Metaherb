import svgPaths from "./svg-rzzl8uko11";
import imgEllipse1 from "figma:asset/92a7853cfe8aac5f8954e358ce38a79185856aff.png";

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

function Frame7() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <ReadMoreContainer />
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#fafafa] content-stretch flex gap-[8px] h-[48px] items-center px-[24px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]" data-name="button-icon">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">ระบชื่อผู้ใช้</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">ชื่อผู้ใช้</p>
      </div>
      <ButtonIcon />
    </div>
  );
}

function EyeSlash() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-[24px]" data-name="eye.slash 1">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 18">
        <g id="Group">
          <path d="M24 0H0V18H24V0Z" fill="var(--fill-0, #A3A3A3)" id="Vector" opacity="0" />
          <path d={svgPaths.p113ac00} fill="var(--fill-0, #A3A3A3)" id="Vector_2" />
          <path d={svgPaths.p33bd4100} fill="var(--fill-0, #A3A3A3)" id="Vector_3" />
        </g>
      </svg>
    </div>
  );
}

function ButtonIcon1() {
  return (
    <div className="bg-[#fafafa] content-stretch flex h-[48px] items-center justify-between px-[24px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]" data-name="button-icon">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p>
          <span className="leading-[normal]">ระบุ</span>
          <span className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] not-italic">หัสผ่าน</span>
          <span className="leading-[normal]">อย่างน้อย 8 ตัว</span>
        </p>
      </div>
      <EyeSlash />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">รหัสผ่าน</p>
      </div>
      <ButtonIcon1 />
    </div>
  );
}

function ButtonIcon2() {
  return (
    <div className="bg-[#fafafa] content-stretch flex gap-[8px] h-[48px] items-center px-[24px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]" data-name="button-icon">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">ระบุอีเมล</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">อีเมล</p>
      </div>
      <ButtonIcon2 />
    </div>
  );
}

function ButtonIcon3() {
  return (
    <div className="bg-[#fafafa] content-stretch flex gap-[8px] h-[48px] items-center px-[24px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]" data-name="button-icon">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">ระบุเบอร์โทรศัพท์</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">เบอร์โทรศัพท์</p>
      </div>
      <ButtonIcon3 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start py-[10px] relative shrink-0">
      <Frame3 />
      <Frame4 />
      <Frame5 />
      <Frame6 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center p-[8px] relative shrink-0">
      <div className="relative rounded-[2px] shrink-0 size-[12px]">
        <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[2px]" />
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[16px] items-start justify-center relative shrink-0 w-[350px]">
      <Frame11 />
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#0a0a0a] text-[0px]">
        <p className="text-[12px]">
          <span className="leading-[normal]">{`ยอมรับ `}</span>
          <span className="[text-decoration-skip-ink:none] decoration-solid leading-[normal] underline">{`ข้อกำหนดการใช้บริการ meta herb `}</span>
          <span className="leading-[normal]">{`และ `}</span>
          <span className="[text-decoration-skip-ink:none] decoration-solid leading-[normal] underline">นโยบายความคุ้มครองข้อมูลส่วนบุคคล</span>
        </p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="bg-[#008c45] content-stretch flex flex-col h-[49px] items-center justify-center relative rounded-[100px] shrink-0 w-[350px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">สมัครสมาชิก</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] gap-[10px] items-start justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center w-[350px] whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-[#0a0a0a]">
        <p className="leading-[normal]">คุณมีบัญชีอยู่แล้ว?</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#297a4e]">
        <p className="decoration-solid leading-[normal] underline">เข้าสู่ระบบ</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[16px] shrink-0 w-[500px]">
      <Frame7 />
      <div className="relative shrink-0 size-[58px]">
        <img alt="" className="absolute block max-w-none size-full" height="58" src={imgEllipse1} width="58" />
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">สมัครสมาชิก</p>
      </div>
      <Frame />
      <Frame10 />
      <Frame1 />
      <Frame9 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[124px] py-[16px] relative w-full">
          <Frame8 />
        </div>
      </div>
    </div>
  );
}

export default function Resgis() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-center justify-center relative size-full" data-name="resgis">
      <Frame2 />
    </div>
  );
}