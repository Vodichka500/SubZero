"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SubscriptionCard } from "@/components/features/subscription/subscription-card"
import { Search, Snowflake } from "lucide-react"
import { motion } from "framer-motion"

import {CATEGORY_VALUES} from "@/lib/constants";

import { Subscription } from "@/lib/types"

interface SubscriptionListViewProps {
  subscriptions: Subscription[]
  onEdit: (id: string) => void
  onFreeze: (id: string) => void
  onDelete: (id: string) => void
}

export function SubscriptionListView({
                                       subscriptions,
                                       onEdit,
                                       onFreeze,
                                       onDelete
                                     }: SubscriptionListViewProps) {
  // HOOKS & STATE
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  // HELPERS
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || sub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <Input
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white focus:border-[#00f3ff]"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a0f1e] border-[#00f3ff]/20 text-white">
            <SelectItem value="all">All Categories</SelectItem>
            {
              CATEGORY_VALUES.map((val) => (
                <SelectItem key={val} value={val}>
                  {val.charAt(0).toUpperCase() + val.slice(1).toLowerCase()}
                </SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSubscriptions.map((sub, i) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <SubscriptionCard
              subscription={sub}
              onEdit={onEdit}
              onFreeze={onFreeze}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredSubscriptions.length === 0 && (
        <div className="text-center py-20">
          <Snowflake className="w-12 h-12 text-slate-800 mx-auto mb-4" />
          <p className="text-slate-500">No subscriptions found</p>
        </div>
      )}
    </div>
  )
}