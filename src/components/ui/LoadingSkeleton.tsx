interface LoadingSkeletonProps {
  count?: number;
}

export function LoadingSkeleton({ count = 8 }: LoadingSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5"
      aria-label="Loading listings"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl border border-[#e6e8eb] overflow-hidden shadow-sm flex flex-col animate-pulse"
        >
          <div className="w-full aspect-square bg-[#e6e8eb]" />
          <div className="p-4 flex flex-col gap-2">
            <div className="h-5 w-1/3 bg-[#e6e8eb] rounded" />
            <div className="h-4 w-4/5 bg-[#e6e8eb] rounded" />
            <div className="h-3.5 w-2/3 bg-[#eceef1] rounded mt-1" />
            <div className="h-3 w-1/2 bg-[#eceef1] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
