import svgPaths from "./svg-uagvavl19v";
import imgSideBar from "figma:asset/9c30b1921f0988e49ef49ac4f89b2dd06b320b33.png";

export default function SideBar() {
  return (
    <div className="content-stretch flex flex-col items-start overflow-clip p-[16px] relative rounded-[16px] size-full" data-name="Side Bar">
      <div className="bg-white content-stretch flex flex-col items-start overflow-clip relative rounded-[16px] shrink-0 w-[250px]">
        <div className="bg-white relative shrink-0 w-full">
          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
            <div className="content-stretch flex gap-[10px] items-center pl-[16px] py-[16px] relative w-full">
              <div className="relative shrink-0 size-[44px]">
                <img alt="" className="absolute block max-w-none size-full" height="44" src={imgSideBar} width="44" />
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative">
                <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                  <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Medium',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic overflow-hidden relative text-[16px] text-black text-ellipsis whitespace-nowrap">
                    <p className="leading-[normal] overflow-hidden">METAHERB Store</p>
                  </div>
                  <button className="backdrop-blur-[2px] bg-[rgba(255,255,255,0.5)] content-stretch cursor-pointer flex flex-col items-center justify-center overflow-clip relative rounded-bl-[100px] rounded-tl-[100px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)] shrink-0 size-[24px]">
                    <div className="h-[14px] overflow-clip relative shrink-0 w-[4px]" data-name="chevron.compact.backward 1">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4 14">
                        <g id="Group">
                          <path d="M4 0H0V14H4V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                          <path d={svgPaths.pcebc600} fill="var(--fill-0, #999999)" id="Vector_2" />
                        </g>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-black whitespace-nowrap">
                  <p className="leading-[normal]">ร้านค้า</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[10px] items-start p-[16px] relative shrink-0">
          <div className="content-stretch flex items-center justify-between pl-[8px] pr-[12px] py-[8px] relative rounded-[200px] shrink-0 w-[218px]" data-name="Side Menu" style={{ backgroundImage: "linear-gradient(90deg, rgba(49, 151, 84, 0.1) 0%, rgba(49, 151, 84, 0.1) 100%), linear-gradient(90deg, rgb(255, 255, 255) 0%, rgb(255, 255, 255) 100%)" }}>
            <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
              <div className="bg-[#319754] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                <div className="h-[12px] relative shrink-0 w-[11px]" data-name="macwindow.stack 1">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
                    <g id="Group">
                      <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector" opacity="0" />
                      <path d={svgPaths.p21e00c00} fill="var(--fill-0, white)" id="Vector_2" />
                      <path d={svgPaths.p343d9f80} fill="var(--fill-0, white)" id="Vector_3" />
                      <path d={svgPaths.p3558b400} fill="var(--fill-0, white)" id="Vector_4" />
                      <path d={svgPaths.p9449100} fill="var(--fill-0, white)" id="Vector_5" />
                      <path d={svgPaths.p22f35b80} fill="var(--fill-0, white)" id="Vector_6" />
                      <path d={svgPaths.p13835df0} fill="var(--fill-0, white)" id="Vector_7" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#319754] text-[14px]">
                <p className="leading-[normal]">ภาพรวม</p>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch flex items-center justify-between p-[8px] relative rounded-[200px] shrink-0 w-[218px]" data-name="Side Menu">
            <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
              <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                <div className="h-[12px] relative shrink-0 w-[11px]" data-name="shippingbox">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
                    <g id="Group">
                      <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                      <path d={svgPaths.p3676a700} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                    </g>
                  </svg>
                </div>
              </div>
              <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                <p className="leading-[normal]">คำสั่งซื้อ</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative rounded-[16px] shrink-0 w-[218px]">
            <div className="bg-white relative rounded-[200px] shrink-0 w-full" data-name="Side Menu">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between pl-[8px] pr-[12px] py-[8px] relative w-full">
                  <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
                    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                      <div className="h-[12px] relative shrink-0 w-[11px]" data-name="bag">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
                          <g id="Group">
                            <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                            <path d={svgPaths.p13628200} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                      <p className="leading-[normal]">สินค้า</p>
                    </div>
                  </div>
                  <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[16px]">􀆈</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative rounded-[16px] shrink-0 w-full">
              <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] relative w-full">
                <div className="bg-white h-[44px] relative rounded-[200px] shrink-0 w-full" data-name="Side Menu">
                  <div className="content-stretch flex gap-[104px] items-start p-[8px] relative size-full">
                    <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0 w-[186px]">
                      <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                        <div className="h-[12px] relative shrink-0 w-[11px]" data-name="bag">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
                            <g id="Group">
                              <path d="M11 0H0V12H11V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                              <path d={svgPaths.p13628200} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                        <p className="leading-[normal]">จัดการสินค้า</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white h-[44px] relative rounded-[200px] shrink-0 w-full" data-name="Side Menu">
                  <div className="content-stretch flex gap-[104px] items-start p-[8px] relative size-full">
                    <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0 w-[186px]">
                      <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                        <div className="h-[12px] relative shrink-0 w-[11px]" data-name="bolt 1">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11 12">
                            <g id="Group">
                              <path d={svgPaths.pffcdd00} fill="var(--fill-0, black)" id="Vector" opacity="0" />
                              <path d={svgPaths.p277c1270} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                        <p className="leading-[normal]">Flash Sale</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white h-[44px] relative rounded-[200px] shrink-0 w-full" data-name="Side Menu">
                  <div className="content-stretch flex gap-[104px] items-start p-[8px] relative size-full">
                    <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0 w-[186px]">
                      <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                        <div className="h-[12px] overflow-clip relative shrink-0 w-[17px]" data-name="giftcard 2">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 12">
                            <g id="Group">
                              <path d="M17 0H0V12H17V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                              <path d={svgPaths.p5460000} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                        <p className="leading-[normal]">โปรโมชั่น</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white h-[44px] relative rounded-[200px] shrink-0 w-full" data-name="Side Menu">
                  <div className="content-stretch flex gap-[104px] items-start p-[8px] relative size-full">
                    <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0 w-[186px]">
                      <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                        <div className="h-[12px] overflow-clip relative shrink-0 w-[17px]" data-name="ticket 2">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17 12">
                            <g id="Group">
                              <path d="M17 0H0V12H17V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                              <path d={svgPaths.p3a43b800} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                        <p className="leading-[normal]">คูปอง</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-[218px]">
            <div className="bg-white relative rounded-[200px] shrink-0 w-full" data-name="Side Menu">
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between pl-[8px] pr-[12px] py-[8px] relative w-full">
                  <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
                    <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                      <div className="overflow-clip relative shrink-0 size-[12px]" data-name="slider.horizontal.2.square 2">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                          <g id="Group">
                            <path d="M12 0H0V12H12V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                            <path d={svgPaths.p1c8056f0} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                            <path d={svgPaths.p171aa900} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_3" />
                            <path d={svgPaths.p17676c80} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_4" />
                            <path d={svgPaths.p34c26430} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_5" />
                            <path d={svgPaths.p24daea00} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_6" />
                          </g>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                      <p className="leading-[normal]">ตั้งค่าร้านค้า</p>
                    </div>
                  </div>
                  <div className="flex flex-col font-['SF_Pro:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-black text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                    <p className="leading-[16px]">􀆈</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[10px] items-start p-[10px] relative rounded-[16px] shrink-0">
              <div aria-hidden="true" className="absolute border border-[#f5f5f5] border-solid inset-0 pointer-events-none rounded-[16px]" />
              <div className="bg-white content-stretch flex gap-[104px] h-[44px] items-start p-[8px] relative rounded-[200px] shrink-0" data-name="Side Menu">
                <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0 w-[186px]">
                  <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                    <div className="h-[12px] overflow-clip relative shrink-0 w-[13px]" data-name="bahtsign.bank.building 1">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 12">
                        <g id="Group">
                          <path d="M13 0H0V12H13V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                          <path d={svgPaths.p3831f300} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                          <path d={svgPaths.pea66580} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_3" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                    <p className="leading-[normal]">จัดการบัญชีธนาคาร</p>
                  </div>
                </div>
              </div>
              <div className="bg-white content-stretch flex gap-[104px] h-[44px] items-start p-[8px] relative rounded-[200px] shrink-0" data-name="Side Menu">
                <div className="content-stretch flex gap-[10px] h-full items-center relative shrink-0 w-[186px]">
                  <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                    <div className="h-[12px] overflow-clip relative shrink-0 w-[13px]" data-name="storefront 1">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13 12">
                        <g id="Group">
                          <path d="M13 0H0V12H13V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                          <path d={svgPaths.p371bfa00} fill="var(--fill-0, black)" fillOpacity="0.85" id="Vector_2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                  <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[14px] text-black">
                    <p className="leading-[normal]">ข้อมูลร้านค้า</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white content-stretch flex items-center justify-between pl-[8px] pr-[12px] py-[8px] relative rounded-[200px] shrink-0 w-[218px]" data-name="Side Menu">
            <div className="content-stretch flex flex-[1_0_0] gap-[10px] items-center min-h-px min-w-px relative">
              <div className="bg-[#f5f5f5] content-stretch flex items-center justify-center overflow-clip relative rounded-[100px] shrink-0 size-[28px]" data-name="Read More Container">
                <div className="h-[12px] overflow-clip relative shrink-0 w-[16px]" data-name="macwindow 1">
                  <div className="absolute contents inset-0" data-name="Group">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                      <path d="M16 0H0V12H16V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                    </svg>
                    <div className="absolute inset-[0_1.55%_0_0]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.7528 12">
                        <path d={svgPaths.p3d605f00} fill="var(--fill-0, #FF3B30)" id="Vector" />
                      </svg>
                    </div>
                    <div className="absolute inset-[18.9%_77.79%_71.37%_14.78%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.18914 1.16675">
                        <path d={svgPaths.p24709400} fill="var(--fill-0, #FF3B30)" id="Vector" />
                      </svg>
                    </div>
                    <div className="absolute inset-[18.9%_65.8%_71.37%_26.76%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.18914 1.16675">
                        <path d={svgPaths.p273e0480} fill="var(--fill-0, #FF3B30)" id="Vector" />
                      </svg>
                    </div>
                    <div className="absolute inset-[18.9%_53.82%_71.37%_38.75%]" data-name="Vector">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.18916 1.16675">
                        <path d={svgPaths.p36a83000} fill="var(--fill-0, #FF3B30)" id="Vector" />
                      </svg>
                    </div>
                    <div className="-translate-x-1/2 -translate-y-1/2 absolute left-[calc(50%-0.5px)] overflow-clip size-[5px] top-[calc(50%+1.5px)]" data-name="arrow.uturn.backward.circle.fill 1">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5 5">
                        <g id="Group">
                          <path d="M5 0H0V5H5V0Z" fill="var(--fill-0, black)" id="Vector" opacity="0" />
                          <path d={svgPaths.p2013cc70} fill="var(--fill-0, #FF3B30)" id="Vector_2" />
                        </g>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-[1_0_0] flex-col font-['IBM_Plex_Sans_Thai_Looped:Regular',sans-serif] justify-center leading-[0] min-h-px min-w-px not-italic relative text-[#ff3b30] text-[14px]">
                <p className="leading-[normal]">กลับสู่เว็บไซต์หลัก</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}