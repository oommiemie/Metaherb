function Frame21() {
  return (
    <div className="bg-[#ea6549] relative rounded-[100px] shrink-0 size-[12px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Frame30() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">สูง</p>
      </div>
      <Frame21 />
    </div>
  );
}

function Frame22() {
  return (
    <div className="bg-[#ee846d] relative rounded-[100px] shrink-0 size-[12px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Frame23() {
  return (
    <div className="bg-[rgba(234,101,73,0.5)] relative rounded-[100px] shrink-0 size-[12px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div className="bg-[#fbe0db] relative rounded-[100px] shrink-0 size-[12px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Frame25() {
  return (
    <div className="bg-[#fcefec] relative rounded-[100px] shrink-0 size-[12px]">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="size-full" />
      </div>
    </div>
  );
}

function Frame29() {
  return (
    <div className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0">
      <Frame25 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[12px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ต่ำ</p>
      </div>
    </div>
  );
}

function Frame19() {
  return (
    <div className="content-stretch flex gap-[10px] h-[40px] items-center overflow-clip relative shrink-0 w-[150px]">
      <Frame30 />
      <Frame22 />
      <Frame23 />
      <Frame24 />
      <Frame29 />
    </div>
  );
}

function Frame63() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a4a4a4] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">ประจำเดือน</p>
      </div>
      <Frame19 />
    </div>
  );
}

function Frame31() {
  return (
    <div className="bg-[#f4f4f4] content-stretch flex flex-col items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[24px]">
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="flex-none rotate-90 w-full">
          <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative text-[12px] text-black text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[16px]">􀆈</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame32() {
  return (
    <div className="bg-[#f4f4f4] content-stretch flex flex-col items-start overflow-clip relative rounded-[100px] shrink-0 size-[24px]">
      <div className="flex h-[24px] items-center justify-center relative shrink-0 w-full" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
        <div className="-rotate-90 flex-none w-full">
          <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal h-[24px] justify-center leading-[0] relative text-[12px] text-black text-center w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            <p className="leading-[16px]">􀆈</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame18() {
  return (
    <div className="content-stretch flex gap-[10px] items-center justify-center relative shrink-0">
      <Frame31 />
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[24px] text-black whitespace-nowrap">
        <p className="leading-[normal]">มกราคม 2569</p>
      </div>
      <Frame32 />
    </div>
  );
}

function TabMenu() {
  return (
    <div className="backdrop-blur-[2px] bg-[#319754] content-stretch flex h-[24px] items-center justify-center px-[8px] py-[4px] relative rounded-[100px] shrink-0" data-name="tab menu">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-white whitespace-nowrap">
        <p className="leading-[normal]">รายเดือน</p>
      </div>
    </div>
  );
}

function TabMenu1() {
  return (
    <div className="backdrop-blur-[2px] content-stretch flex h-[24px] items-center justify-center px-[8px] py-[4px] relative rounded-[100px] shrink-0" data-name="tab menu">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black whitespace-nowrap">
        <p className="leading-[normal]">รายปี</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start justify-center overflow-clip p-[4px] relative rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] shrink-0">
      <TabMenu />
      <TabMenu1 />
    </div>
  );
}

function Frame64() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame18 />
      <Frame />
    </div>
  );
}

function Frame20() {
  return (
    <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
      <Frame63 />
      <Frame64 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">จันทร์</p>
      </div>
    </div>
  );
}

function Frame26() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">อังคาร</p>
      </div>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">พุธ</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">พฤหัสบดี</p>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ศุกร์</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">เสาร์</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 w-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">อาทิตย์</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full">
      <Frame5 />
      <Frame26 />
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame10 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Frame27() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="bg-[#ee846d] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">5</p>
      </div>
    </div>
  );
}

function Frame16() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">6</p>
      </div>
    </div>
  );
}

function Frame17() {
  return (
    <div className="bg-[#ee846d] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">7</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
      <Frame12 />
      <Frame27 />
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
    </div>
  );
}

function Frame28() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">8</p>
      </div>
    </div>
  );
}

function Frame33() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">9</p>
      </div>
    </div>
  );
}

function Frame34() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">10</p>
      </div>
    </div>
  );
}

function Frame35() {
  return (
    <div className="bg-[rgba(234,101,73,0.5)] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">11</p>
      </div>
    </div>
  );
}

function Frame36() {
  return (
    <div className="bg-[rgba(234,101,73,0.2)] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">12</p>
      </div>
    </div>
  );
}

function Frame37() {
  return (
    <div className="bg-[rgba(234,101,73,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">13</p>
      </div>
    </div>
  );
}

function Frame38() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">14</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
      <Frame28 />
      <Frame33 />
      <Frame34 />
      <Frame35 />
      <Frame36 />
      <Frame37 />
      <Frame38 />
    </div>
  );
}

function Frame40() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">15</p>
      </div>
    </div>
  );
}

function Frame41() {
  return (
    <div className="bg-[#f1340c] relative rounded-[12px] shrink-0 size-[64px]">
      <div className="content-stretch flex items-center justify-center overflow-clip relative rounded-[inherit] size-full">
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
          <p className="leading-[normal]">16</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border-[#890404] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame42() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">17</p>
      </div>
    </div>
  );
}

function Frame43() {
  return (
    <div className="bg-[rgba(234,101,73,0.5)] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">18</p>
      </div>
    </div>
  );
}

function Frame44() {
  return (
    <div className="bg-[rgba(234,101,73,0.2)] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">19</p>
      </div>
    </div>
  );
}

function Frame45() {
  return (
    <div className="bg-[rgba(234,101,73,0.1)] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">20</p>
      </div>
    </div>
  );
}

function Frame46() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">21</p>
      </div>
    </div>
  );
}

function Frame39() {
  return (
    <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
      <Frame40 />
      <Frame41 />
      <Frame42 />
      <Frame43 />
      <Frame44 />
      <Frame45 />
      <Frame46 />
    </div>
  );
}

function Frame48() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">22</p>
      </div>
    </div>
  );
}

function Frame49() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">23</p>
      </div>
    </div>
  );
}

function Frame50() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">24</p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">25</p>
      </div>
    </div>
  );
}

function Frame52() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">26</p>
      </div>
    </div>
  );
}

function Frame53() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">27</p>
      </div>
    </div>
  );
}

function Frame54() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">28</p>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
      <Frame48 />
      <Frame49 />
      <Frame50 />
      <Frame51 />
      <Frame52 />
      <Frame53 />
      <Frame54 />
    </div>
  );
}

function Frame56() {
  return (
    <div className="bg-[#fbe0db] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">29</p>
      </div>
    </div>
  );
}

function Frame57() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">30</p>
      </div>
    </div>
  );
}

function Frame58() {
  return (
    <div className="bg-[#ea6549] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">31</p>
      </div>
    </div>
  );
}

function Frame59() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">1</p>
      </div>
    </div>
  );
}

function Frame60() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">2</p>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">3</p>
      </div>
    </div>
  );
}

function Frame62() {
  return (
    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[12px] shrink-0 size-[64px]">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#a3a3a3] text-[14px] whitespace-nowrap">
        <p className="leading-[normal]">4</p>
      </div>
    </div>
  );
}

function Frame55() {
  return (
    <div className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full">
      <Frame56 />
      <Frame57 />
      <Frame58 />
      <Frame59 />
      <Frame60 />
      <Frame61 />
      <Frame62 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start min-h-px min-w-px relative w-full">
      <Frame2 />
      <Frame11 />
      <Frame4 />
      <Frame39 />
      <Frame47 />
      <Frame55 />
    </div>
  );
}

export default function Frame1() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[16px] relative rounded-[16px] size-full">
      <Frame20 />
      <Frame3 />
    </div>
  );
}