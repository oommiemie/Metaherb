export default function Frame() {
  return (
    <div className="bg-white relative rounded-[100px] size-full">
      <div className="content-stretch flex flex-col gap-[10px] items-center justify-center overflow-clip px-[14px] relative rounded-[inherit] size-full">
        <div className="absolute h-[52px] left-[24px] top-0 w-[102px]" data-name="image 3" />
        <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black text-center whitespace-nowrap">
          <p className="leading-[normal]">แจ้งปัญหาสินค้า</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d4d4d8] border-solid inset-0 pointer-events-none rounded-[100px]" />
    </div>
  );
}