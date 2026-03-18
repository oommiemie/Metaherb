import imgChatGptImage1325690954241 from "figma:asset/bc0647483cfb5a707f778cc18a602a7932c0287f.png";
import imgChatGptImage1325690954242 from "figma:asset/e7332f142579e51e8632e5d3048cd86f0f80158a.png";

function Frame2() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] content-stretch flex flex-col items-start justify-center p-[6px] relative rounded-[100px] shrink-0 size-[32px]">
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="ChatGPT Image 13 ก.พ. 2569 09_54_24 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImage1325690954241} />
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="backdrop-blur-[2px] bg-[rgba(0,0,0,0.05)] content-stretch flex flex-col items-start justify-center p-[6px] relative rounded-[100px] shrink-0 size-[32px]">
      <div className="flex-[1_0_0] min-h-px min-w-px relative w-full" data-name="ChatGPT Image 13 ก.พ. 2569 09_54_24 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgChatGptImage1325690954242} />
      </div>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[16px] items-center relative size-full">
      <Frame2 />
      <Frame1 />
    </div>
  );
}