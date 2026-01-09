"use client"

import type { Subscription } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreVertical, Snowflake, Trash2, Edit } from "lucide-react"
import { motion } from "framer-motion"
import {getDaysToNextPayment} from "@/lib/utils";
import {DEFAULT_CURRENCY} from "@/lib/constants";
import { Period } from "@prisma/client"

interface SubscriptionCardProps {
  subscription: Subscription
  onEdit?: (id: string) => void
  onFreeze?: (id: string) => void
  onDelete?: (id: string) => void
}

export function SubscriptionCard({ subscription, onEdit, onFreeze, onDelete }: SubscriptionCardProps) {


  const daysUntilPayment = getDaysToNextPayment(new Date(subscription.startDate), subscription.period, subscription.frequency)

  const isUrgent = daysUntilPayment <= 3 && subscription.active

  // HELPERS //
  const getReadablePeriod = (period: Period, frequency: number) => {
    const periodNames: Record<Period, string> = {
      [Period.DAILY]: "day",
      [Period.WEEKLY]: "week",
      [Period.MONTHLY]: "month",
      [Period.YEARLY]: "year",
    }

    const name = periodNames[period] ?? "period"

    if (frequency === 1) {
      return `every ${name}`
    } else {
      return `every ${frequency} ${name}s`
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card
        className={`glass-card border ${
          subscription.active
            ? "border-[#00f3ff]/20 hover:shadow-[0_0_20px_rgba(0,243,255,0.3)]"
            : "border-slate-700/50 opacity-60"
        } p-6 transition-all group relative overflow-hidden`}
      >
        {/* Background gradient effect */}
        <div
          className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
          style={{
            background: `radial-gradient(circle at top right, ${subscription.color || "#00f3ff"}, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl backdrop-blur-xl"
                style={{
                  background: `${subscription.color || "#00f3ff"}20`,
                  border: `1px solid ${subscription.color || "#00f3ff"}40`,
                }}
              >
                {subscription.icon}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-wide">{subscription.name}</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{subscription.category}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-[#0a0f1e] border-[#00f3ff]/20 backdrop-blur-xl">
                <DropdownMenuItem
                  onClick={() => onEdit?.(subscription.id)}
                  className="text-white hover:bg-[#00f3ff]/10 hover:text-[#00f3ff] cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onFreeze?.(subscription.id)}
                  className="text-white hover:bg-[#00f3ff]/10 hover:text-[#00f3ff] cursor-pointer"
                >
                  <Snowflake className="w-4 h-4 mr-2" />
                  {subscription.active ? "Freeze" : "Unfreeze"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDelete?.(subscription.id)}
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white">
                {DEFAULT_CURRENCY}
                {subscription.price.toFixed(2)}
              </span>
              <span className="text-sm text-slate-500">
                /{getReadablePeriod(subscription.period, subscription.frequency)}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className={`${
                isUrgent
                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                  : subscription.active
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                    : "border-slate-600/50 bg-slate-600/10 text-slate-400"
              } text-xs`}
            >
              {subscription.active ? `Next: ${daysUntilPayment}d` : "Frozen" }
            </Badge>

            {!subscription.active && <Snowflake className="w-4 h-4 text-[#00f3ff]" />}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
