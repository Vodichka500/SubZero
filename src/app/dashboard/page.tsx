"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp, DollarSign, List, Calendar, Snowflake } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SubscriptionCard } from "@/components/features/subscription/subscription-card"
import { CalendarView } from "@/components/features/calendar-view"
import { api } from "@/app/_providers/trpc-provider"
import {getExpectedMonthlyCost, getExpectedYearlyCost} from "@/lib/utils";
import {Skeleton} from "@/components/ui/skeleton";
import {AsyncView} from "@/components/features/async-view";
import {SubscriptionsSkeleton} from "@/components/skeletons/subscriptions-skeleton";
import {MONTHS} from "@/lib/constants";

export default function DashboardPage() {
  const {
    data: subscriptions = [],
    isLoading: isSubscriptionsLoading,
    isError: isSubscriptionsLoadingError,
    error: subscriptionsLoadingError
  } = api.subscription.getAll.useQuery()

  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserLoadingError,
    error: userLoadingError
  } = api.user.getMe.useQuery()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [view, setView] = useState<"list" | "calendar">("list")

  const totalMonthlySpend = getExpectedMonthlyCost(subscriptions)
  const totalYearlySpend = getExpectedYearlyCost(subscriptions)

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || sub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <AsyncView
          isLoading={isUserLoading}
          isError={isUserLoadingError}
          errorMsg={userLoadingError?.message}
          loader={<Skeleton className="h-12 w-64 mb-2" />}
        >
          {
            user &&
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back, <span className="text-[#00f3ff] neon-text">{user.name}</span>
            </h1>
          }
        </AsyncView>


        <p className="text-slate-400">Here&#39;s your subscription overview</p>
      </motion.div>


      <AsyncView
        isLoading={isSubscriptionsLoading}
        isError={isSubscriptionsLoadingError}
        errorMsg={subscriptionsLoadingError?.message}
        loader={<SubscriptionsSkeleton/>}
      >
        {
          subscriptions &&
          <>
            {/* Stats Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border border-[#00f3ff]/30 p-6 hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-[#00f3ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Expenses in {MONTHS[new Date().getMonth()]}</p>
                    <p className="text-4xl font-bold text-[#00f3ff] neon-text">${totalMonthlySpend.toFixed(2)}</p>
                  </div>
                </div>
              </Card>

              <Card className="glass-card border border-[#d946ef]/30 p-6 hover:shadow-[0_0_25px_rgba(217,70,239,0.4)] transition-all bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#d946ef]/10 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-[#d946ef]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Yearly Projection</p>
                    <p className="text-4xl font-bold text-[#d946ef]">${totalYearlySpend.toFixed(2)}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Tabs & Filters */}
            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")} className="w-full">
              <TabsList className="bg-[#0a0f1e]/60 border border-[#00f3ff]/20">
                <TabsTrigger value="list" className="data-[state=active]:bg-[#00f3ff]/20 data-[state=active]:text-[#00f3ff]">
                  <List className="w-4 h-4 mr-2" /> List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-[#00f3ff]/20 data-[state=active]:text-[#00f3ff]">
                  <Calendar className="w-4 h-4 mr-2" /> Calendar View
                </TabsTrigger>
              </TabsList>

              {view === "list" && (
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
                      <SelectItem value="ENTERTAINMENT">Entertainment</SelectItem>
                      <SelectItem value="SOFTWARE">Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <TabsContent value="list" className="mt-6">
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredSubscriptions.map((sub, i) => (
                    <motion.div key={sub.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                      <SubscriptionCard subscription={sub} />
                    </motion.div>
                  ))}
                </div>
                {filteredSubscriptions.length === 0 && (
                  <div className="text-center py-20">
                    <Snowflake className="w-12 h-12 text-slate-800 mx-auto mb-4" />
                    <p className="text-slate-500">No subscriptions found</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <CalendarView subscriptions={subscriptions} />
              </TabsContent>
            </Tabs>
          </>
        }
      </AsyncView>
    </div>
  )
}