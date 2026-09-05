interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-zinc-200/80 ${className}`}
    />
  );
}

export function SkeletonCard({ aspectRatio = "16/9" }: { aspectRatio?: "16/9" | "4/3" | "1/1" }) {
  const aspectClass = {
    "16/9": "aspect-video",
    "4/3": "aspect-4/3",
    "1/1": "aspect-square",
  }[aspectRatio];

  return (
    <div
      aria-busy="true"
      className="rounded-2xl bg-clean-white border border-zinc-200 p-6 shadow-xs flex flex-col justify-between"
    >
      <div>
        <Skeleton className={`w-full ${aspectClass} rounded-xl mb-4`} />
        <Skeleton className="h-5 w-3/4 mb-2 rounded" />
        <Skeleton className="h-4 w-full mb-1.5 rounded" />
        <Skeleton className="h-4 w-2/3 rounded mb-4" />
      </div>
      <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
    >
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonBrandStrip({ count = 8 }: { count?: number }) {
  return (
    <div
      aria-busy="true"
      className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4"
    >
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-mist-gray/80 border border-zinc-200/80"
        >
          <Skeleton className="h-12 w-12 rounded-lg mb-2" />
          <Skeleton className="h-3 w-16 rounded" />
        </div>
      ))}
    </div>
  );
}
