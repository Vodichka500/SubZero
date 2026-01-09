import { Skeleton } from "@/components/ui/skeleton";

export const ProfileBadgeSkeleton = () => {
  return (
    <div className="p-4 border-t border-[#1e293b]">
      {/* Profile Card*/}
      <div className="glass-card border border-slate-800/50 p-4 rounded-lg bg-[#0a0f1e]/20">

        <div className="flex items-center gap-3 mb-3">
          {/* Avatar Skeleton */}
          <Skeleton className="h-10 w-10 rounded-full bg-slate-800/60 shrink-0" />

          {/* Text Skeleton */}
          <div className="flex flex-col gap-1.5 w-full">
            <Skeleton className="h-4 w-24 bg-slate-800/60" /> {/* Name */}
            <Skeleton className="h-3 w-32 bg-slate-800/40" /> {/* Email */}
          </div>
        </div>
        {/* Button */}
        <Skeleton className="h-9 w-full rounded-md bg-slate-800/30" />
      </div>
    </div>
  );
};