import imgImage1 from "figma:asset/4e853dd1de66b2ba78b0fecd9bd277b4aaacee97.png";

export default function Medical() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative size-full" data-name="Medical">
      <div className="h-[431px] relative shrink-0 w-[432px]" data-name="image 1">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
      </div>
    </div>
  );
}