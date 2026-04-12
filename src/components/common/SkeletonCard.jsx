export const SkeletonCard = () => (
  <div className="bg-white border rounded-xl overflow-hidden">
    <div className="pt-[100%] shimmer-bg"></div>
    <div className="p-4 space-y-2">
      <div className="h-3 shimmer-bg rounded w-1/3"></div>
      <div className="h-4 shimmer-bg rounded w-4/5"></div>
      <div className="h-4 shimmer-bg rounded w-2/3"></div>
      <div className="h-5 shimmer-bg rounded w-1/2 mt-3"></div>
    </div>
  </div>
);
