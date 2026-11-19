interface LoadingSkeletonProps {
  count?: number;
  className?: string;
}

export function LoadingSkeleton({ count = 8, className = '' }: LoadingSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading marketplace listings"
      aria-busy="true"
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
      <span className="sr-only">Loading listings...</span>
    </div>
  );
}

export function ListingDetailSkeleton() {
  return (
    <section
      className="flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 py-5 animate-pulse"
      role="status"
      aria-live="polite"
      aria-label="Loading listing details"
      aria-busy="true"
    >
      <div className="h-5 w-44 rounded bg-[#e6e8eb] mb-5" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="w-full aspect-[4/3] sm:aspect-square rounded-xl bg-[#e6e8eb]" />
          <div className="grid grid-cols-4 gap-2.5">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-lg bg-[#e6e8eb]" />
            ))}
          </div>
          <div className="h-20 rounded-xl bg-[#e6e8eb] mt-1" />
        </div>
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
            <div className="h-5 w-28 rounded bg-[#e6e8eb]" />
            <div className="h-7 w-4/5 rounded bg-[#e6e8eb]" />
            <div className="h-10 w-2/5 rounded bg-[#e6e8eb]" />
            <div className="h-4 w-3/5 rounded bg-[#eceef1]" />
            <div className="flex gap-2 pt-2">
              <div className="h-10 flex-1 rounded-lg bg-[#e6e8eb]" />
              <div className="h-10 flex-1 rounded-lg bg-[#e6e8eb]" />
              <div className="h-10 flex-1 rounded-lg bg-[#e6e8eb]" />
            </div>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm space-y-3">
            <div className="h-5 w-36 rounded bg-[#e6e8eb]" />
            <div className="h-11 w-full rounded-lg bg-[#eceef1]" />
            <div className="h-24 w-full rounded-lg bg-[#eceef1]" />
            <div className="h-11 w-full rounded-lg bg-[#e6e8eb]" />
          </div>
        </div>
      </div>
      <span className="sr-only">Loading listing details...</span>
    </section>
  );
}
