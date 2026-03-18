import svgPaths from "./svg-92fs8ct4mk";
import imgEllipse1 from "figma:asset/92a7853cfe8aac5f8954e358ce38a79185856aff.png";
import imgEllipse2 from "figma:asset/68dde42a389bff5cdec033b3119c11b0f828d957.png";
import imgEllipse3 from "figma:asset/ae8779b97275473d65b6c2038307e7546a03b82a.png";
import imgEllipse4 from "figma:asset/6e789d73932d39a70cb742b8d46fc983aea859d7.png";

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

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <ReadMoreContainer />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-center leading-[0] not-italic relative shrink-0 text-black text-center whitespace-nowrap">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center relative shrink-0 text-[20px]">
        <p className="leading-[normal]">ยินดีต้อนรับเข้าสู่ระบบ</p>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center relative shrink-0 text-[12px]">
        <p className="leading-[normal] whitespace-pre">
          ดูแลสุขภาพอย่างมั่นใจ ด้วยผลิตภัณฑ์สมุนไพรคัดสรร
          <br aria-hidden="true" />
          {` ช้อปออนไลน์ได้แล้วที่ Metaherb`}
        </p>
      </div>
    </div>
  );
}

function ButtonIcon() {
  return (
    <div className="bg-[#fafafa] content-stretch flex gap-[8px] h-[48px] items-center px-[24px] py-[12px] relative rounded-[100px] shrink-0 w-[350px]" data-name="button-icon">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">กรอกอีเมลหรือชื่อผู้ใช้</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">อีเมลหรือชื่อผู้ใช้</p>
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
          <span className="leading-[normal]">กรอก</span>
          <span className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[normal] not-italic">รหัสผ่าน</span>
        </p>
      </div>
      <EyeSlash />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">รหัสผ่าน</p>
      </div>
      <ButtonIcon1 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-start justify-end relative shrink-0 w-[350px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#297a4e] text-[12px] text-center whitespace-nowrap">
        <p className="leading-[normal]">ลืมรหัสผ่าน?</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start py-[10px] relative shrink-0">
      <Frame4 />
      <Frame5 />
      <Frame9 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="bg-[#008c45] content-stretch flex flex-col h-[49px] items-center justify-center relative rounded-[100px] shrink-0 w-[350px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">เข้าสู่ระบบ</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0 w-full">
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 206.5 1">
            <line id="Line 2" stroke="var(--stroke-0, #D4D4D8)" x2="206.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black text-center whitespace-nowrap">
        <p className="leading-[normal]">หรือ</p>
      </div>
      <div className="flex-[1_0_0] h-0 min-h-px min-w-px relative">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 206.5 1">
            <line id="Line 2" stroke="var(--stroke-0, #D4D4D8)" x2="206.5" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[24px] relative rounded-[100px] shrink-0 w-[350px]">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="absolute block max-w-none size-full" height="24" src={imgEllipse2} width="24" />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#525252] text-[14px] text-center">
        <p className="leading-[normal]">เข้าสู่ระบบด้วย Google</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[24px] relative rounded-[100px] shrink-0 w-[350px]">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="absolute block max-w-none size-full" height="24" src={imgEllipse3} width="24" />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#525252] text-[14px] text-center">
        <p className="leading-[normal]">เข้าสู่ระบบ Facebook</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex gap-[10px] h-[48px] items-center justify-center px-[24px] relative rounded-[100px] shrink-0 w-[350px]">
      <div aria-hidden="true" className="absolute border border-[#d4d4d4] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="relative shrink-0 size-[24px]">
        <img alt="" className="absolute block max-w-none size-full" height="24" src={imgEllipse4} width="24" />
      </div>
      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#525252] text-[14px] text-center">
        <p className="leading-[normal]">เข้าสู่ระบบ Line</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] gap-[10px] items-start justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-center w-[350px] whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-[#0a0a0a]">
        <p className="leading-[normal]">คุณยังไม่มีบัญชีผู้ใช้</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#297a4e]">
        <p className="decoration-solid leading-[normal] underline">ลงทะเบียน</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[16px] shrink-0 w-[500px]">
      <Frame6 />
      <div className="relative shrink-0 size-[58px]">
        <img alt="" className="absolute block max-w-none size-full" height="58" src={imgEllipse1} width="58" />
      </div>
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame8 />
      <Frame10 />
      <Frame11 />
      <Frame12 />
      <Frame13 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="flex flex-col items-center justify-center size-full">
        <div className="content-stretch flex flex-col items-center justify-center px-[124px] py-[16px] relative w-full">
          <Frame7 />
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <div className="bg-[#fafafa] content-stretch flex flex-col items-center justify-center relative size-full" data-name="login">
      <Frame3 />
    </div>
  );
}