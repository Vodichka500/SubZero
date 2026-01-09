"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, TrendingUp, DollarSign, List, Calendar, Snowflake } from "lucide-react"
import { toast } from "sonner" // Предполагаем использование sonner для уведомлений

// UI Components
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

// Features
import { SubscriptionCard } from "@/components/features/subscription/subscription-card"
import { CalendarView } from "@/components/features/calendar-view"
import { SubscriptionForm } from "@/components/features/subscription/subscription-form"
import { AsyncView } from "@/components/features/async-view"
import { SubscriptionsSkeleton } from "@/components/skeletons/subscriptions-skeleton"

// Utils & TRPC
import { api } from "@/app/_providers/trpc-provider"
import { getExpectedMonthlyCost, getExpectedYearlyCost } from "@/lib/utils"
import { MONTHS } from "@/lib/constants"
import { SubscriptionFormData } from "@/lib/types"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const utils = api.useUtils()

  // --- Queries ---
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

  // --- Mutations ---
  const { mutate: updateSubscription, isPending: isUpdating } = api.subscription.update.useMutation({
    onMutate: async (variables) => {
      await utils.subscription.getAll.cancel()
      const previousSubscriptions = utils.subscription.getAll.getData()
      utils.subscription.getAll.setData(undefined, (old) => {
        return old?.map(sub => {
          if (sub.id === variables.id) {
            return { ...sub, ...variables.data}
          } else {
            return sub
          }
        }) || []
      })
      return { previousSubscriptions }
    },
    onSuccess: () => {
      utils.subscription.getAll.invalidate()
        .then(() => toast.success("Subscription updated successfully"))
      setEditingId(null)
    },
    onError: (err) => toast.error(err.message || "Failed to update subscription")
  })

  const { mutate: deleteSubscription } = api.subscription.delete.useMutation({
    onMutate: async (variables) => {
      await utils.subscription.getAll.cancel()
      const previousSubscriptions = utils.subscription.getAll.getData()
      utils.subscription.getAll.setData(undefined, (old) => {
        return old?.filter(sub => sub.id !== variables.id) || []
      })
      toast.success("Subscription deleted")
      return { previousSubscriptions }
    },
    onError: (err, variables, context) => {
      if (context?.previousSubscriptions) {
        utils.subscription.getAll.setData(undefined, context.previousSubscriptions);
      }
      toast.error(err.message || "Failed to delete subscription")
    },
    onSuccess: () => {
      utils.subscription.getAll.invalidate()
    },
  })

  // --- State ---
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [view, setView] = useState<"list" | "calendar">("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // --- Helpers ---
  const totalMonthlySpend = getExpectedMonthlyCost(subscriptions)
  const totalYearlySpend = getExpectedYearlyCost(subscriptions)

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || sub.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const editingSubscription = subscriptions.find(s => s.id === editingId)

  // --- Handlers ---

  const handleFreeze = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id)
    if (!sub) return

    // Если активно -> false (freeze), если неактивно -> true (unfreeze)
    updateSubscription({
      id,
      data: { active: !sub.active }
    })

    const action = sub.active ? "Frozen" : "Unfrozen"
    toast.info(`Subscription ${action}`)
  }

  const handleDelete = (id: string) => {
    deleteSubscription({ id })
    setDeletingId(null);
  }

  const handleEditSubmit = (data: SubscriptionFormData) => {
    if (!editingId) return
    updateSubscription({
      id: editingId,
      data: data
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-8 relative">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <AsyncView
          isLoading={isUserLoading}
          isError={isUserLoadingError}
          errorMsg={userLoadingError?.message}
          loader={<Skeleton className="h-12 w-64 mb-2" />}
        >
          {user && (
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2 tracking-tight">
              Welcome back, <span className="text-[#00f3ff] neon-text">{user.name}</span>
            </h1>
          )}
        </AsyncView>
        <p className="text-slate-400">Here&#39;s your subscription overview</p>
      </motion.div>

      <AsyncView
        isLoading={isSubscriptionsLoading}
        isError={isSubscriptionsLoadingError}
        errorMsg={subscriptionsLoadingError?.message}
        loader={<SubscriptionsSkeleton />}
      >
        {subscriptions && (
          <>
            {/* Stats Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-card border border-[#00f3ff]/30 p-6 hover:shadow-[0_0_25px_rgba(0,243,255,0.4)] transition-all bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-[#00f3ff]/10 flex items-center justify-center">
                    <DollarSign className="w-8 h-8 text-[#00f3ff]" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">
                      Expenses in {MONTHS[new Date().getMonth()]}
                    </p>
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
                      <SubscriptionCard
                        subscription={sub}
                        onEdit={(id) => setEditingId(id)}
                        onFreeze={handleFreeze}
                        onDelete={(id) => setDeletingId(id)}
                      />
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
        )}
      </AsyncView>

      {/* Edit Modal */}
      <Dialog open={!!editingId} onOpenChange={(open) => !open && setEditingId(null)}>
        <DialogContent className="bg-[#02040a] border-[#00f3ff]/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
          </DialogHeader>

          {editingSubscription && (
            <SubscriptionForm
              mode="edit"
              initialData={{
                ...editingSubscription,
                startDate: new Date(editingSubscription.startDate)
              }}
              onSubmit={handleEditSubmit}
              isLoading={isUpdating}
              onCancel={() => setEditingId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

    {/* Delete Confirmation Modal */}
      {/* Delete Confirmation Modal */}
      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent className="glass-card border border-red-500/30 bg-[#02040a]/90 backdrop-blur-xl text-white max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-red-500 tracking-tight">
              Confirm Deletion
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <p className="text-slate-400">
              Are you sure you want to delete this subscription? This action <span className="text-red-400 font-semibold">cannot be undone</span>.
            </p>
          </div>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="bg-transparent border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600/20 border border-red-600/50 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)]"
              onClick={() => {
                if (deletingId) {
                  handleDelete(deletingId);
                }
              }}
            >
              Delete Subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}