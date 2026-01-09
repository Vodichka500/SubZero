"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Bell, User, Mail, Sparkles, AlertTriangle, Trash2 } from "lucide-react"
import { motion } from "framer-motion"
import { AppRoutes } from "@/routes"
import { toast } from "sonner"
import { AsyncView } from "@/components/features/async-view"
import { AccountSettingSkeleton } from "@/components/skeletons/account-settings-skeleton"

import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { api } from "@/app/_providers/trpc-provider"
import {signOut} from "next-auth/react";
import Link from "next/link"

import { AccountSettingsSchema } from "@/lib/zod"
type AccountSettingsFormValues = z.infer<typeof AccountSettingsSchema>






export default function SettingsPage() {

  const router = useRouter()

  // HOOKS & STATE
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [deleteTimer, setDeleteTimer] = useState(5)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (deleteConfirmOpen && deleteTimer > 0) {
      interval = setInterval(() => {
        setDeleteTimer((prev) => prev - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [deleteConfirmOpen, deleteTimer])

  // QUERIES
  const {
    data: user,
    isLoading: isUserLoading,
    isError: isUserLoadingError,
    error: userLoadingError
  } = api.user.getMe.useQuery()

  // MUTATIONS
  const {
    mutate: updateProfileMutation,
    isPending: isUpdatingProfile,
    isError: isUpdateProfileError,
    error: updateProfileError
  } = api.user.updateMe.useMutation({
    onSuccess: (updatedUser) => {
      toast.success("Settings updated successfully")
      reset({
        name: updatedUser.name,
        email: updatedUser.email,
        sendNotifications: updatedUser.sendNotifications,
      })
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile")
    }
  })

  const deleteAccountMutation = api.user.deleteMe.useMutation({
    onSuccess: async () => {
      toast.success("Account deleted successfully")
      await signOut()
      router.push(AppRoutes.landing())
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete account")
      setDeleteConfirmOpen(false)
    }
  })

  // FORMS
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty },
    reset,
  } = useForm<AccountSettingsFormValues>({
    resolver: zodResolver(AccountSettingsSchema),
    values: user ? {
      name: user.name ?? "",
      email: user.email ?? "",
      sendNotifications: user.sendNotifications ?? true,
    } : undefined,
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      name: "",
      email: "",
      sendNotifications: true,
    },
  })


  // HANDLERS
  const handleOpenDeleteDialog = () => {
    setDeleteTimer(5)
    setDeleteConfirmOpen(true)
  }

  const onSubmit = async (data: AccountSettingsFormValues) => {
    updateProfileMutation(data)
    reset(data)
  }

  const handleDeleteAccount = () => {
    if (deleteTimer === 0) {
      deleteAccountMutation.mutate()
    }
  }

  return (
    <div className="min-h-screen bg-[#02040a]">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <Link href={AppRoutes.dashboard()}>
              <div className="text-slate-600 hover:text-[#00f3ff] flex items-center gap-1 mb-2 cursor-pointer transition duration-300">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </div>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              <span className="text-[#00f3ff] neon-text">Settings</span>
            </h1>
            <p className="text-slate-400">Manage your account and preferences</p>
          </div>

          <AsyncView
            isLoading={isUserLoading}
            isError={isUserLoadingError}
            errorMsg={userLoadingError?.message}
            loader={<AccountSettingSkeleton/>}
          >
            {
              user &&
              <>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Account Information */}
                  <Card className="glass-card border border-[#00f3ff]/20 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <User className="w-6 h-6 text-[#00f3ff]" />
                      <h2 className="text-2xl font-bold text-white tracking-wide">Account Information</h2>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white uppercase tracking-wider text-sm">
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          {...register("name")}
                          disabled={isUpdatingProfile}
                          className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-xs">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white uppercase tracking-wider text-sm">
                          Email Address
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            disabled={isUpdatingProfile}
                            className="pl-10 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                          />
                        </div>
                        {errors.email && (
                          <p className="text-red-400 text-xs">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* Notifications */}
                  <Card className="glass-card border border-[#00f3ff]/20 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <Bell className="w-6 h-6 text-[#00f3ff]" />
                      <h2 className="text-2xl font-bold text-white tracking-wide">Notifications</h2>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-white mb-1">Payment Reminders</p>
                        <p className="text-sm text-slate-400">Get notified before upcoming subscription payments</p>
                      </div>

                      <Controller
                        control={control}
                        name="sendNotifications"
                        render={({ field }) => (
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-[#00f3ff]"
                            disabled={isUpdatingProfile}
                          />
                        )}
                      />
                    </div>
                  </Card>


                  <Button
                    type="submit"
                    disabled={isUpdatingProfile || !isDirty || isSubmitting}
                    className={`w-full font-semibold transition-all ${
                      !isDirty
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                        : "bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] hover:shadow-[0_0_20px_rgba(0,243,255,0.6)]"
                    }`}
                  >
                    <AsyncView
                      isLoading={isUpdatingProfile}
                      loader={<><Sparkles className="w-4 h-4 mr-2 animate-spin" /> Saving...</>}
                      isError={isUpdateProfileError}
                      errorMsg={updateProfileError?.message}
                    >
                      <>Save Changes</>
                    </AsyncView>
                  </Button>
                </form>

                {/* Danger Zone */}
                <div className="mt-6">
                  <Card className="glass-card border border-red-500/20 p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold text-red-400 tracking-wide mb-2">Danger Zone</h2>
                      <p className="text-slate-400 text-sm">Irreversible actions</p>
                    </div>

                    <Button
                      variant="outline"
                      type="button"
                      onClick={handleOpenDeleteDialog}
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-400 bg-transparent w-full sm:w-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </Card>
                </div>

                {/* Confirm Dialog */}
                <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                  <AlertDialogContent className="bg-[#050b1a] border border-red-500/20 text-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400 mt-2">
                        This action cannot be undone. This will permanently delete your
                        account and remove all your data from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-4">
                      <AlertDialogCancel className="bg-slate-800 text-white border-slate-700 hover:bg-slate-700 hover:text-white">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.preventDefault()
                          handleDeleteAccount()
                        }}
                        disabled={deleteTimer > 0 || deleteAccountMutation.isPending}
                        className="w-full bg-red-500 text-white hover:bg-red-600 border-none disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteAccountMutation.isPending ? (
                          "Deleting..."
                        ) : deleteTimer > 0 ? (
                          `Wait ${deleteTimer}s`
                        ) : (
                          "Confirm Delete"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            }
          </AsyncView>
        </motion.div>
      </div>
    </div>
  )
}