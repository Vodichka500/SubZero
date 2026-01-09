import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function SubscriptionsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse">

      {/* 1. Summary Cards Skeleton (Monthly & Yearly) */}
      <div className="grid md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <Card key={i} className="glass-card border border-slate-800/60 p-6 bg-[#0a0f1e]/20">
            <div className="flex items-center gap-4">
              {/* Icon Placeholder */}
              <Skeleton className="w-14 h-14 rounded-xl bg-slate-800/50" />
              <div className="space-y-2">
                {/* Label Placeholder */}
                <Skeleton className="h-3 w-24 bg-slate-800/50" />
                {/* Value Placeholder */}
                <Skeleton className="h-8 w-32 bg-slate-800/50" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* 2. Tabs & Filters Skeleton */}
      <div className="w-full space-y-6">
        {/* Tabs List */}
        <Skeleton className="h-10 w-full max-w-sm rounded-lg bg-slate-800/30" />

        {/* Search & Select Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Skeleton className="h-10 w-full rounded-md bg-slate-800/30" />
          </div>
          <Skeleton className="h-10 w-full sm:w-48 rounded-md bg-slate-800/30" />
        </div>
      </div>

      {/* 3. Subscriptions Grid Skeleton */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="glass-card border border-slate-800/50 p-6 bg-[#0a0f1e]/20 relative overflow-hidden">
            <div className="relative z-10">
              {/* Card Header: Icon + Title + Menu */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <Skeleton className="w-12 h-12 rounded-lg bg-slate-800/50" />
                  <div className="space-y-2">
                    {/* Title */}
                    <Skeleton className="h-5 w-32 bg-slate-800/50" />
                    {/* Category */}
                    <Skeleton className="h-3 w-20 bg-slate-800/40" />
                  </div>
                </div>
                {/* Menu Button */}
                <Skeleton className="w-8 h-8 rounded-md bg-slate-800/30" />
              </div>

              {/* Price Section */}
              <div className="mb-4 mt-6">
                <div className="flex items-baseline gap-2">
                  <Skeleton className="h-8 w-24 bg-slate-800/50" />
                  <Skeleton className="h-4 w-12 bg-slate-800/30" />
                </div>
              </div>

              {/* Footer: Badge */}
              <div className="flex items-center justify-between mt-4">
                <Skeleton className="h-6 w-24 rounded-full bg-slate-800/40" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}