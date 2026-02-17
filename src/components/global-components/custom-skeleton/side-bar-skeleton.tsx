"use client";

import AnimatedLoadingSkeleton from "./animated-loading-skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="w-full space-y-4 p-4">
      {/* Toolbar skeleton */}
      <div className="rounded-2xl border border-border/40 p-4 space-y-3">
        {/* Search + Sort + Filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 h-10 bg-muted/60 rounded-xl animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-[180px] bg-muted/60 rounded-xl animate-pulse" />
            <div className="h-10 w-24 bg-muted/60 rounded-xl animate-pulse" />
          </div>
        </div>
        {/* Tabs row */}
        <div className="flex gap-2">
          {Array(3)
            .fill(0)
            .map((_, idx) => (
              <div
                key={idx}
                className="h-8 w-32 bg-muted/40 rounded-md animate-pulse"
              />
            ))}
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {Array(10)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="bg-card border border-border/40 rounded-xl overflow-hidden"
            >
              {/* Product image */}
              <div className="relative">
                <div className="absolute top-2 right-2">
                  <div className="h-6 w-16 bg-muted/60 rounded-md animate-pulse" />
                </div>
                <div className="h-48 w-full bg-muted/60 animate-pulse" />
              </div>

              {/* Product info */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div className="h-4 w-full bg-muted/60 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-muted/60 rounded animate-pulse" />

                {/* Category */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">Loại:</div>
                  <div className="h-4 w-24 bg-muted/60 rounded animate-pulse" />
                </div>

                {/* Weight */}
                <div className="flex items-center gap-2">
                  <div className="text-sm text-muted-foreground">
                    Trọng lượng:
                  </div>
                  <div className="h-4 w-10 bg-muted/60 rounded animate-pulse" />
                </div>

                {/* Price and add to cart */}
                <div className="flex justify-between items-center pt-2">
                  <div className="h-6 w-24 bg-muted/60 rounded animate-pulse" />
                  <div className="h-10 w-10 bg-primary/10 rounded-md animate-pulse" />
                </div>
              </div>
            </div>
          ))}
      </div>
      <AnimatedLoadingSkeleton className="min-w-full" />
    </div>
  );
}

// Keep default export for backward compatibility
export default ProductGridSkeleton;
