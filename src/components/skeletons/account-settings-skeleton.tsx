import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"

export function AccountSettingSkeleton() {
  return (
    <div className="min-h-screen bg-[#02040a]">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="animate-pulse">

          <div className="space-y-6">

            {/* Account Information Card Skeleton */}
            <Card className="glass-card border border-slate-800/50 p-8 bg-[#0a0f1e]/20">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-6 h-6 rounded bg-slate-800/60" />
                <Skeleton className="h-8 w-56 bg-slate-800/60" />
              </div>

              {/* Inputs */}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-slate-800/50" /> {/* Label */}
                  <Skeleton className="h-10 w-full bg-slate-800/40" /> {/* Input */}
                </div>

                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-slate-800/50" /> {/* Label */}
                  <Skeleton className="h-10 w-full bg-slate-800/40" /> {/* Input */}
                </div>
              </div>
            </Card>

            {/* Notifications Card Skeleton */}
            <Card className="glass-card border border-slate-800/50 p-8 bg-[#0a0f1e]/20">
              <div className="flex items-center gap-3 mb-6">
                <Skeleton className="w-6 h-6 rounded bg-slate-800/60" />
                <Skeleton className="h-8 w-40 bg-slate-800/60" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-48 bg-slate-800/50" />
                  <Skeleton className="h-4 w-64 bg-slate-800/40" />
                </div>
                <Skeleton className="h-6 w-12 rounded-full bg-slate-800/40" /> {/* Switch */}
              </div>
            </Card>

            {/* Save Button Skeleton */}
            <Skeleton className="h-10 w-full bg-slate-800/50 rounded-md" />

            {/* Danger Zone Skeleton */}
            <Card className="glass-card border border-slate-800/30 p-8 mt-6 bg-[#0a0f1e]/20">
              <div className="mb-6 space-y-2">
                <Skeleton className="h-8 w-36 bg-slate-800/50" />
                <Skeleton className="h-4 w-40 bg-slate-800/40" />
              </div>
              <Skeleton className="h-10 w-32 bg-slate-800/30" />
            </Card>

          </div>
        </div>
      </div>
    </div>
  )
}