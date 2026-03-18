import imgImage2 from "figma:asset/58b5803b2004438a222516fd9a07dab9d45a3307.png";

export default function Herb() {
  return (
    <div className="content-stretch flex flex-col items-center justify-center relative size-full" data-name="Herb">
      <div className="h-[439px] relative shrink-0 w-[440px]" data-name="image 2">
        <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage2} />
      </div>
    </div>
  );
}