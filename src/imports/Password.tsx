import imgRectangle33 from "figma:asset/e9fa4baa6fae7a43e086cd2f7372c763ac79e774.png";

function Frame6() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">
        <p className="leading-[normal]">สินค้าที่ต้องการขอคืนเงิน</p>
      </div>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[12px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ชาอูหลงผสมดอกหอมหมื่นลี้</p>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex gap-[10px] h-[23px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 150.00</p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex gap-[62px] h-[17px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right whitespace-nowrap">
        <p className="leading-[normal]">จำนวน 1 ชิ้น</p>
      </div>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0 w-[59px]">
      <Frame3 />
      <Frame />
    </div>
  );
}

function ProductPreview() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="product-preview">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative w-full">
          <div className="relative rounded-[8px] shrink-0 size-[64px]">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgRectangle33} />
          </div>
          <Frame7 />
          <Frame10 />
        </div>
      </div>
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[12px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ชาเขียวมัทฉะผสมส้มยูซุ</p>
      </div>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex gap-[10px] h-[23px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 150.00</p>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex gap-[62px] h-[17px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right whitespace-nowrap">
        <p className="leading-[normal]">จำนวน 1 ชิ้น</p>
      </div>
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0 w-[59px]">
      <Frame4 />
      <Frame1 />
    </div>
  );
}

function ProductPreview1() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="product-preview">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative w-full">
          <div className="bg-[#e7e7e7] rounded-[8px] shrink-0 size-[64px]" />
          <Frame8 />
          <Frame11 />
        </div>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[12px] text-black text-ellipsis whitespace-nowrap">
        <p className="leading-[normal] overflow-hidden">ชาเขียวมัทฉะลาเต้</p>
      </div>
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex gap-[10px] h-[23px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:SemiBold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
        <p className="leading-[normal]">฿ 150.00</p>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex gap-[62px] h-[17px] items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[10px] text-black text-right whitespace-nowrap">
        <p className="leading-[normal]">จำนวน 1 ชิ้น</p>
      </div>
    </div>
  );
}

function Frame12() {
  return (
    <div className="content-stretch flex flex-col items-end justify-center relative shrink-0 w-[59px]">
      <Frame5 />
      <Frame2 />
    </div>
  );
}

function ProductPreview2() {
  return (
    <div className="bg-white relative rounded-[12px] shrink-0 w-full" data-name="product-preview">
      <div aria-hidden="true" className="absolute border border-[#d9d9d9] border-solid inset-0 pointer-events-none rounded-[12px]" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[8px] items-center p-[16px] relative w-full">
          <div className="bg-[#e7e7e7] rounded-[8px] shrink-0 size-[64px]" />
          <Frame9 />
          <Frame12 />
        </div>
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0 w-full">
      <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[20px] text-black whitespace-nowrap">
        <p className="leading-[normal]">รายละเอียดการคืนเงิน</p>
      </div>
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex gap-[16px] items-start leading-[21px] not-italic relative shrink-0 text-[14px] text-black w-full">
      <p className="font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] relative shrink-0 w-[93px]">ยอดเงินคืน</p>
      <p className="font-['IBM_Plex_Sans_Thai_Looped:Bold',sans-serif] relative shrink-0 whitespace-nowrap">฿ 450.00</p>
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[16px] items-start leading-[21px] not-italic relative shrink-0 text-[14px] text-black w-full whitespace-nowrap">
      <p className="relative shrink-0">ช่องทางคืนเงิน</p>
      <p className="relative shrink-0">ธนาคารทหารไทยธนชาต [*1234]</p>
    </div>
  );
}

function TextArea() {
  return (
    <div className="bg-white relative rounded-[12px] self-stretch shrink-0 w-[300px]" data-name="Text Area">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-start px-[16px] py-[12px] relative size-full">
          <p className="font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-[rgba(0,0,0,0.5)] whitespace-nowrap">metaherb@gmai.com</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d4d4d8] border-solid inset-0 pointer-events-none rounded-[12px]" />
    </div>
  );
}

function Frame17() {
  return (
    <div className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full">
      <p className="font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-black w-[93px]">อีเมล</p>
      <TextArea />
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] gap-[16px] items-start justify-end leading-[0] not-italic relative shrink-0 text-[16px] text-right w-full whitespace-nowrap">
      <div className="flex flex-col justify-center relative shrink-0 text-black">
        <p className="leading-[normal]">จำนวนเงินคืนตามจริง</p>
      </div>
      <div className="flex flex-col justify-center relative shrink-0 text-[#319754]">
        <p className="leading-[normal]">฿ 450.00</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="bg-[#319754] content-stretch flex h-[51px] items-center justify-center px-[40px] py-[14px] relative rounded-[100px] shrink-0 w-[169.438px]" data-name="Button">
      <p className="font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] leading-[21px] not-italic relative shrink-0 text-[14px] text-center text-white whitespace-nowrap">ยืนยัน</p>
    </div>
  );
}

function Container() {
  return (
    <div className="content-stretch flex items-center justify-end relative shrink-0 w-full" data-name="Container">
      <Button />
    </div>
  );
}

export default function Password() {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="Password">
      <Frame6 />
      <div className="h-0 relative shrink-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 552 1">
            <line id="Line 3" stroke="var(--stroke-0, #D4D4D8)" x2="552" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>
      <ProductPreview />
      <ProductPreview1 />
      <ProductPreview2 />
      <Frame14 />
      <Frame15 />
      <Frame16 />
      <Frame17 />
      <Frame13 />
      <Container />
    </div>
  );
}