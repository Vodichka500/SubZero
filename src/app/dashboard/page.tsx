"use client"

import { useState } from "react"

import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarView } from "@/components/features/calendar-view"
import { SubscriptionForm } from "@/components/features/subscription/subscription-form"
import { AsyncView } from "@/components/features/async-view"
import { SubscriptionsSkeleton } from "@/components/skeletons/subscriptions-skeleton"
import Stats from "@/components/features/dashboard/stats";
import { SubscriptionListView } from "@/components/features/dashboard/subscription-list-view"
import { List, Calendar } from "lucide-react"
import { toast } from "sonner"
import { motion } from "framer-motion"

import { api } from "@/app/_providers/trpc-provider"
import { getExpectedMonthlyCost, getExpectedYearlyCost } from "@/lib/utils"

import { SubscriptionFormData } from "@/lib/types"


export default function DashboardPage() {

  // HOOKS & STATE
  const utils = api.useUtils()
  const [view, setView] = useState<"list" | "calendar">("list")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // QUERIES
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

  // MUTATIONS
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


  // HELPERS
  const totalMonthlySpend = getExpectedMonthlyCost(subscriptions)
  const totalYearlySpend = getExpectedYearlyCost(subscriptions)
  const editingSubscription = subscriptions.find(s => s.id === editingId)

  // HANDLERS
  const handleFreeze = (id: string) => {
    const sub = subscriptions.find((s) => s.id === id)
    if (!sub) return
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
            <Stats totalMonthlySpend={totalMonthlySpend} totalYearlySpend={totalYearlySpend}/>

            <Tabs value={view} onValueChange={(v) => setView(v as "list" | "calendar")} className="w-full">
              <TabsList className="bg-[#0a0f1e]/60 border border-[#00f3ff]/20">
                <TabsTrigger value="list" className="data-[state=active]:bg-[#00f3ff]/20 data-[state=active]:text-[#00f3ff]">
                  <List className="w-4 h-4 mr-2" /> List View
                </TabsTrigger>
                <TabsTrigger value="calendar" className="data-[state=active]:bg-[#00f3ff]/20 data-[state=active]:text-[#00f3ff]">
                  <Calendar className="w-4 h-4 mr-2" /> Calendar View
                </TabsTrigger>
              </TabsList>

              {/* View Content */}
              <TabsContent value="list" className="mt-6">
                <SubscriptionListView
                  subscriptions={subscriptions}
                  onEdit={setEditingId}
                  onFreeze={handleFreeze}
                  onDelete={setDeletingId}
                />
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