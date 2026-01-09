"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Snowflake, ArrowLeft, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import { SubscriptionForm } from "@/components/features/subscription/subscription-form"
import {SubscriptionFormData} from "@/lib/types";
import {AppRoutes} from "@/routes";
import {api} from "@/app/_providers/trpc-provider";
import { toast } from "sonner"

export default function AddSubscriptionPage() {
  const router = useRouter()

  const {
    mutate: createSubscription,
    isPending: isCreatingSubscription,
  } = api.subscription.create.useMutation({
    onSuccess: () => {
      toast.success("Subscription added successfully")
      router.push(AppRoutes.dashboard())
      router.refresh()
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create subscription")
    }
  })

  const handleSubmit = (data: SubscriptionFormData) => {
    console.log("GOOD")
    createSubscription(data)
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
              Add New <span className="text-[#00f3ff] neon-text">Subscription</span>
            </h1>
            <p className="text-slate-400">Let our AI help you track your spending</p>
          </div>

          <Card className="glass-card border border-[#00f3ff]/20 p-8">
            <SubscriptionForm
              mode="create"
              onSubmit={handleSubmit}
              isLoading={isCreatingSubscription} // <-- Передаем состояние загрузки
              onCancel={() => router.push(AppRoutes.dashboard())}
            />
          </Card>

          {/* Info Card */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6">
            <Card className="glass-card border border-[#d946ef]/20 p-6">
              <div className="flex items-start gap-4">
                <Sparkles className="w-6 h-6 text-[#d946ef] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-white mb-2">AI-Powered Auto-Fill</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Our AI recognizes popular services and automatically fills in price, category, and color. Try typing
                    &#34;Netflix&#34; or &#34;Spotify&#34; and click the sparkle button to see the magic happen!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
