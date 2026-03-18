import svgPaths from "./svg-q4gi1fyb9";
import imgEllipse1 from "figma:asset/f9ee82cc09be4d333092757c8be452dec4955b13.png";
import imgChatGptImage1325690954241 from "figma:asset/bc0647483cfb5a707f778cc18a602a7932c0287f.png";
import imgChatGptImage1325690954242 from "figma:asset/e7332f142579e51e8632e5d3048cd86f0f80158a.png";
import { imgSearch } from "./svg-045fm";

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
      <div className="relative shrink-0 size-[58px]">
        <img alt="" className="absolute block max-w-none size-full" height="58" src={imgEllipse1} width="58" />
      </div>
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p>
          <span className="leading-[normal] text-[#ed1c24]">META</span>
          <span className="leading-[normal] text-[#f7931d]">HERB</span>
        </p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] content-stretch flex flex-col items-start justify-center p-[6px] relative rounded-[100px] shrink-0 size-[32px]">
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="ChatGPT Image 13 ก.พ. 2569 09_54_24 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImage1325690954241} />
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] content-stretch flex flex-col items-start justify-center p-[6px] relative rounded-[100px] shrink-0 size-[32px]">
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="ChatGPT Image 13 ก.พ. 2569 09_54_24 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImage1325690954242} />
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <Frame7 />
      <Frame6 />
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col h-[48px] items-center justify-center relative rounded-[100px] shrink-0 w-[120px]">
      <div aria-hidden="true" className="absolute border border-[#db8b0a] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#db8b0a] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">สมัครสมาชิก</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-[#319754] content-stretch flex flex-col gap-[10px] h-[48px] items-center justify-center overflow-clip relative rounded-[100px] shrink-0 w-[120px]">
      <div className="absolute h-[52px] left-[24px] top-0 w-[102px]" data-name="image 3" />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">เข้าสู่ระบบ</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex flex-[1_0_0] gap-[24px] items-center justify-end min-h-px min-w-px relative">
      <Frame />
      <Frame4 />
    </div>
  );
}

export default function Defual() {
  return (
    <div className="backdrop-blur-[8px] bg-[rgba(255,255,255,0.9)] content-stretch flex items-center justify-between px-[124px] py-[16px] relative size-full" data-name="defual">
      <Frame1 />
      <div className="bg-white content-stretch flex items-center justify-between pl-[16px] pr-[8px] py-[8px] relative rounded-[100px] shrink-0 w-[412px]" data-name="input-search-bar-with-icon">
        <div aria-hidden="true" className="absolute border border-[#d4d4d8] border-solid inset-0 pointer-events-none rounded-[100px]" />
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#404040] text-[14px] whitespace-nowrap">
          <p className="leading-[normal]">ค้นหาสินค้าที่ต้องการ</p>
        </div>
        <div className="bg-[#319754] content-stretch flex items-center p-[8px] relative rounded-[100px] shrink-0" data-name="md-icon-button">
          <div className="relative shrink-0 size-[24px]" data-name="Property 1=search">
            <div className="absolute inset-[12.5%_14.27%_14.27%_12.5%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[-3px_-3px] mask-size-[24px_24px]" data-name="search" style={{ maskImage: `url('${imgSearch}')` }}>
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.575 17.575">
                <path d={svgPaths.p3e87000} fill="var(--fill-0, white)" id="search" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <Frame5 />
    </div>
  );
}