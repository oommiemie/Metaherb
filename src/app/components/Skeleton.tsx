const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`bg-gray-200 rounded-lg ${shimmer} ${className}`} />;
}

/* Banner skeleton */
export function BannerSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-[10px] w-full">
      <div className="min-w-0 lg:flex-[73_1_0%]">
        <SkeletonBox className="w-full aspect-[2.5/1] rounded-xl" />
      </div>
      <div className="hidden lg:flex flex-col gap-[10px] lg:flex-[27_1_0%] min-w-0">
        <SkeletonBox className="flex-1 rounded-[16px]" />
        <SkeletonBox className="flex-1 rounded-[16px]" />
      </div>
    </div>
  );
}

/* Category row skeleton */
export function CategorySkeleton() {
  return (
    <div className="flex items-center justify-center gap-4 w-full">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 min-w-[80px]">
          <SkeletonBox className="size-[72px] !rounded-full" />
          <SkeletonBox className="w-[48px] h-[12px]" />
        </div>
      ))}
    </div>
  );
}

/* Product card skeleton */
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] overflow-hidden flex flex-col h-[259px]">
      <div className="flex-1 min-h-0">
        <SkeletonBox className="w-full h-full !rounded-none !rounded-t-[16px]" />
      </div>
      <div className="p-[10px] flex flex-col gap-[6px]">
        <SkeletonBox className="w-3/4 h-[14px]" />
        <SkeletonBox className="w-1/2 h-[14px]" />
        <div className="flex justify-between">
          <SkeletonBox className="w-[60px] h-[10px]" />
          <SkeletonBox className="w-[40px] h-[10px]" />
        </div>
      </div>
    </div>
  );
}

/* Product grid skeleton */
export function ProductGridSkeleton({ count = 6, cols = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6" }: { count?: number; cols?: string }) {
  return (
    <div className={`grid ${cols} gap-[16px]`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

/* Article skeleton */
export function ArticleSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-[16px]">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="bg-white rounded-[16px] border border-[#e5e5e5] h-[180px] overflow-hidden flex">
          <SkeletonBox className="w-[180px] h-full shrink-0 !rounded-none" />
          <div className="flex-1 p-[14px] flex flex-col gap-[8px]">
            <SkeletonBox className="w-3/4 h-[14px]" />
            <SkeletonBox className="w-full h-[12px]" />
            <SkeletonBox className="w-full h-[12px]" />
            <div className="mt-auto">
              <SkeletonBox className="w-[120px] h-[28px] !rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* Video skeleton */
export function VideoSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
      {Array.from({ length: 6 }).map((_, i) => (
        <SkeletonBox key={i} className="h-[259px] !rounded-[16px]" />
      ))}
    </div>
  );
}

/* Sidebar filter skeleton */
export function FilterSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col gap-4">
      <div className="flex justify-between">
        <SkeletonBox className="w-[80px] h-[20px]" />
        <SkeletonBox className="size-[24px] !rounded-full" />
      </div>
      <SkeletonBox className="w-full h-px" />
      <SkeletonBox className="w-[60px] h-[14px]" />
      <SkeletonBox className="w-full h-[48px] !rounded-full" />
      <SkeletonBox className="w-[80px] h-[14px]" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <SkeletonBox className="size-[24px] !rounded-full" />
          <SkeletonBox className="w-[100px] h-[14px]" />
        </div>
      ))}
      <SkeletonBox className="w-[60px] h-[14px]" />
      <SkeletonBox className="w-full h-[48px] !rounded-full" />
      <SkeletonBox className="w-full h-[48px] !rounded-full" />
    </div>
  );
}
