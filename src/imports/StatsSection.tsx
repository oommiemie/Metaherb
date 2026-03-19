import imgImage from "figma:asset/f1ceefb74e0b735c05a881e21bdc83ccd797fa20.png";
import imgImage1 from "figma:asset/7f17e783f1ef7618e9192f2aafe3f9c41a98a922.png";
import imgImage2 from "figma:asset/c62bf17009bd747369419c446709fd9ba2080b91.png";

function Container() {
  return <div className="absolute bg-[rgba(125,184,112,0.1)] left-[1209px] rounded-[16777200px] size-[256px] top-[-96px]" data-name="Container" />;
}

function Container1() {
  return <div className="absolute bg-[rgba(125,184,112,0.1)] left-[-64px] rounded-[16777200px] size-[192px] top-[561px]" data-name="Container" />;
}

function Image() {
  return (
    <div className="absolute left-[-1px] size-[512px] top-[-1px]" data-name="Image (ผลิตภัณฑ์สมุนไพร)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage} />
    </div>
  );
}

function Container4() {
  return <div className="absolute bg-gradient-to-t from-[rgba(13,31,13,0.8)] left-[-1px] size-[512px] to-[rgba(0,0,0,0)] top-[-1px] via-1/2 via-[rgba(0,0,0,0)]" data-name="Container" />;
}

function Paragraph() {
  return (
    <div className="absolute h-[20.398px] left-0 top-0 w-[464px]" data-name="Paragraph">
      <p className="absolute font-['Sarabun:Regular',sans-serif] leading-[20.4px] left-0 not-italic text-[13.6px] text-[rgba(255,255,255,0.8)] top-0 whitespace-nowrap">ผลิตภัณฑ์เด่นของเรา</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="absolute h-[31.195px] left-0 top-[24.4px] w-[464px]" data-name="Paragraph">
      <p className="absolute font-['Playfair_Display:Bold','Noto_Sans_Thai:Bold',sans-serif] font-bold leading-[31.2px] left-0 text-[20.8px] text-white top-[0.5px] whitespace-nowrap">ชาสมุนไพรเชียงราย</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[20.398px] left-0 top-[55.59px] w-[464px]" data-name="Paragraph">
      <p className="absolute font-['Sarabun:Regular',sans-serif] leading-[20.4px] left-0 not-italic text-[#a8d5a0] text-[13.6px] top-0 whitespace-nowrap">ผสมจากสมุนไพร 7 ชนิด คัดสรรพิเศษ</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[75.992px] left-[23px] top-[411.01px] w-[464px]" data-name="Container">
      <Paragraph />
      <Paragraph1 />
      <Paragraph2 />
    </div>
  );
}

function Container3() {
  return (
    <div className="border border-solid border-white overflow-clip relative rounded-[40px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[512px]" data-name="Container">
      <Image />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Image1() {
  return (
    <div className="absolute left-[-1px] size-[512px] top-[-1px]" data-name="Image (ผลิตภัณฑ์สมุนไพร)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
    </div>
  );
}

function Container7() {
  return <div className="absolute bg-gradient-to-t from-[rgba(13,31,13,0.8)] left-[-1px] size-[512px] to-[rgba(0,0,0,0)] top-[-1px] via-1/2 via-[rgba(0,0,0,0)]" data-name="Container" />;
}

function Paragraph3() {
  return (
    <div className="absolute h-[20.398px] left-0 top-0 w-[464px]" data-name="Paragraph">
      <p className="absolute font-['Sarabun:Regular',sans-serif] leading-[20.4px] left-0 not-italic text-[13.6px] text-[rgba(255,255,255,0.8)] top-0 whitespace-nowrap">ผลิตภัณฑ์เด่นของเรา</p>
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[31.195px] left-0 top-[24.4px] w-[464px]" data-name="Paragraph">
      <p className="absolute font-['Playfair_Display:Bold','Noto_Sans_Thai:Bold',sans-serif] font-bold leading-[31.2px] left-0 text-[20.8px] text-white top-[0.5px] whitespace-nowrap">ชาสมุนไพรเชียงราย</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[20.398px] left-0 top-[55.59px] w-[464px]" data-name="Paragraph">
      <p className="absolute font-['Sarabun:Regular',sans-serif] leading-[20.4px] left-0 not-italic text-[#a8d5a0] text-[13.6px] top-0 whitespace-nowrap">ผสมจากสมุนไพร 7 ชนิด คัดสรรพิเศษ</p>
    </div>
  );
}

function Container8() {
  return (
    <div className="absolute h-[75.992px] left-[23px] top-[411.01px] w-[464px]" data-name="Container">
      <Paragraph3 />
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Container6() {
  return (
    <div className="border border-solid border-white overflow-clip relative rounded-[40px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[512px]" data-name="Container">
      <Image1 />
      <Container7 />
      <Container8 />
    </div>
  );
}

function Heading() {
  return (
    <div className="font-['Google_Sans:Bold',sans-serif] h-[96px] leading-[normal] not-italic relative shrink-0 text-[40px] w-full whitespace-nowrap" data-name="Heading 2">
      <p className="absolute left-0 text-white top-[-1px]">ความไว้วางใจที่</p>
      <p className="absolute left-0 text-[#7db870] top-[47px]">สร้างมาจากมาตรฐาน</p>
    </div>
  );
}

function Text() {
  return (
    <div className="bg-[#ff8a65] h-[24px] relative rounded-[16777200px] shrink-0 w-[89.969px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[12px] py-[4px] relative size-full">
        <p className="font-['Sarabun:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">ขายดีอันดับ 1</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pr-[262.695px] relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Heading 4">
      <p className="font-['Inter:Semi_Bold','Noto_Sans_Thai:SemiBold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">ชาสมุนไพร 7 ชนิด</p>
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Sarabun:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(255,255,255,0.7)]">{`ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน `}</p>
    </div>
  );
}

function Container12() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative w-full" data-name="Container">
      <Container13 />
      <Heading1 />
      <Paragraph6 />
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[135px] items-start left-[0.5px] p-[16px] rounded-[16px] top-0 w-[286px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <Container12 />
    </div>
  );
}

function Text1() {
  return (
    <div className="bg-[#7db870] h-[24px] relative rounded-[16777200px] shrink-0 w-[71.203px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[12px] py-[4px] relative size-full">
        <p className="font-['Sarabun:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">สินค้าใหม่</p>
      </div>
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pr-[262.695px] relative size-full">
        <Text1 />
      </div>
    </div>
  );
}

function Heading2() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Heading 4">
      <p className="font-['Inter:Semi_Bold','Noto_Sans_Thai:SemiBold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">ชาสมุนไพร 7 ชนิด</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Sarabun:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(255,255,255,0.7)]">{`ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน `}</p>
    </div>
  );
}

function Container15() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative w-full" data-name="Container">
      <Container16 />
      <Heading2 />
      <Paragraph7 />
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[136.305px] items-start left-[306px] p-[16px] rounded-[16px] top-0 w-[286px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <Container15 />
    </div>
  );
}

function Text2() {
  return (
    <div className="bg-[#5b8dee] h-[24px] relative rounded-[16777200px] shrink-0 w-[66.891px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start px-[12px] py-[4px] relative size-full">
        <p className="font-['Sarabun:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">ยอดนิยม</p>
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <div className="content-stretch flex items-start pr-[262.695px] relative size-full">
        <Text2 />
      </div>
    </div>
  );
}

function Heading3() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Heading 4">
      <p className="font-['Inter:Semi_Bold','Noto_Sans_Thai:SemiBold',sans-serif] font-semibold leading-[24px] not-italic relative shrink-0 text-[16px] text-white whitespace-nowrap">ชาสมุนไพร 7 ชนิด</p>
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="content-stretch flex items-center justify-center relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Sarabun:Regular',sans-serif] leading-[normal] min-h-px min-w-px not-italic relative text-[14px] text-[rgba(255,255,255,0.7)]">{`ผสมจากตะไคร้ ขิง ขมิ้น กระชาย ใบเตย มะตูม และดอกอัญชัน `}</p>
    </div>
  );
}

function Container18() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col gap-[8px] items-start min-h-px min-w-px relative w-full" data-name="Container">
      <Container19 />
      <Heading3 />
      <Paragraph8 />
    </div>
  );
}

function Container17() {
  return (
    <div className="absolute bg-[rgba(255,255,255,0.05)] content-stretch flex flex-col h-[136.305px] items-start left-0 p-[16px] rounded-[16px] top-[156.3px] w-[286px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[rgba(255,255,255,0.1)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]" />
      <Container18 />
    </div>
  );
}

function Container10() {
  return (
    <div className="h-[292.609px] relative shrink-0 w-full" data-name="Container">
      <Container11 />
      <Container14 />
      <Container17 />
    </div>
  );
}

function Text3() {
  return (
    <div className="absolute bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] border-solid h-[33.195px] left-0 rounded-[16777200px] top-0 w-[88.797px]" data-name="Text">
      <p className="absolute font-['Sarabun:Regular','Noto_Sans:Regular',sans-serif] leading-[19.2px] left-[16px] text-[#a8d5a0] text-[12.8px] top-[6px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        ✓ อย. ไทย
      </p>
    </div>
  );
}

function Text4() {
  return (
    <div className="absolute bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] border-solid h-[33.195px] left-[100.8px] rounded-[16777200px] top-0 w-[140.945px]" data-name="Text">
      <p className="absolute font-['Sarabun:Regular','Noto_Sans:Regular',sans-serif] leading-[19.2px] left-[16px] text-[#a8d5a0] text-[12.8px] top-[6px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        ✓ Organic Thailand
      </p>
    </div>
  );
}

function Text5() {
  return (
    <div className="absolute bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] border-solid h-[33.195px] left-[253.74px] rounded-[16777200px] top-0 w-[104.18px]" data-name="Text">
      <p className="absolute font-['Sarabun:Regular','Noto_Sans:Regular',sans-serif] leading-[19.2px] left-[16px] text-[#a8d5a0] text-[12.8px] top-[6px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        ✓ ISO 22000
      </p>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[rgba(125,184,112,0.2)] border border-[rgba(125,184,112,0.4)] border-solid h-[33.195px] left-[369.92px] rounded-[16777200px] top-0 w-[72.594px]" data-name="Text">
      <p className="absolute font-['Sarabun:Regular','Noto_Sans:Regular',sans-serif] leading-[19.2px] left-[16px] text-[#a8d5a0] text-[12.8px] top-[6px] whitespace-nowrap" style={{ fontVariationSettings: "'CTGR' 0, 'wdth' 100, 'wght' 400" }}>
        ✓ GMP
      </p>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[33.195px] relative shrink-0 w-full" data-name="Container">
      <Text3 />
      <Text4 />
      <Text5 />
      <Text6 />
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[40px] items-start left-[640px] top-0 w-[592px]" data-name="Container">
      <Heading />
      <Container10 />
      <Container20 />
    </div>
  );
}

function Image2() {
  return (
    <div className="absolute left-[-1px] size-[512px] top-[-1px]" data-name="Image (ผลิตภัณฑ์สมุนไพร)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
    </div>
  );
}

function Container22() {
  return <div className="absolute bg-gradient-to-t from-[rgba(13,31,13,0.8)] left-[-1px] size-[512px] to-[rgba(0,0,0,0)] top-[-1px] via-1/2 via-[rgba(0,0,0,0)]" data-name="Container" />;
}

function Paragraph9() {
  return (
    <div className="h-[20.398px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Noto_Sans_Thai_UI:Regular',sans-serif] font-normal leading-[20.4px] left-0 text-[13.6px] text-[rgba(255,255,255,0.8)] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        ผลิตภัณฑ์เด่นของเรา
      </p>
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="h-[31.195px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Google_Sans:Bold',sans-serif] leading-[31.2px] left-0 not-italic text-[20.8px] text-white top-[0.5px] whitespace-nowrap">พิมเสนน้ำอโรมา ตราเมต้าเฮิร์บ</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="h-[20.398px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Noto_Sans_Thai_UI:Regular',sans-serif] font-normal leading-[20.4px] left-0 text-[#a8d5a0] text-[13.6px] top-0 whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        พิมเสนน้ำอโรม่า ตราเมต้าเฮิร์บ มีชิ้นส่วนสมุนไพร
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-0 top-[4px] w-[464px]">
      <Paragraph9 />
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function Container23() {
  return (
    <div className="absolute h-[75.992px] left-[23px] top-[411.01px] w-[464px]" data-name="Container">
      <Frame />
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute border border-solid border-white left-0 overflow-clip rounded-[40px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] size-[512px] top-[8.5px]" data-name="Container">
      <Image2 />
      <Container22 />
      <Container23 />
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute h-[529px] left-[68.5px] top-[80px] w-[1232px]" data-name="Container">
      <div className="absolute flex items-center justify-center left-[-51.67px] size-[616.324px] top-[-43.17px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "85" } as React.CSSProperties}>
        <div className="flex-none rotate-[13.34deg]">
          <Container3 />
        </div>
      </div>
      <div className="absolute flex items-center justify-center left-[-28.34px] size-[572.175px] top-[-20.84px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "85" } as React.CSSProperties}>
        <div className="flex-none rotate-[7.21deg]">
          <Container6 />
        </div>
      </div>
      <Container9 />
      <Container21 />
    </div>
  );
}

export default function StatsSection() {
  return (
    <div className="bg-[#1a2e1a] relative size-full" data-name="StatsSection">
      <Container />
      <Container1 />
      <Container2 />
    </div>
  );
}