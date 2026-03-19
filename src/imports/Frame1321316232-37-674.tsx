function TabMenu() {
  return (
    <div className="backdrop-blur-[2px] bg-[#319754] content-stretch flex items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="tab menu">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
        <p className="leading-[normal]">ดูทั้งหมด</p>
      </div>
    </div>
  );
}

function TabMenu1() {
  return (
    <div className="backdrop-blur-[2px] content-stretch flex items-center justify-center px-[12px] py-[4px] relative rounded-[100px] shrink-0" data-name="tab menu">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">ประวัติการถอน</p>
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="bg-white content-stretch flex items-center overflow-clip p-[4px] relative rounded-[100px] shadow-[0px_0px_6px_0px_rgba(0,0,0,0.1)] size-full">
      <TabMenu />
      <TabMenu1 />
    </div>
  );
}