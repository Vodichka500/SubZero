"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller, type Resolver } from "react-hook-form"
import {
  Sparkles,
  Loader2,
  Calendar as CalendarIcon,
  DollarSign,
  Repeat,
  Save,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { cn } from "@/lib/utils"
import { SubscriptionFormData } from "@/lib/types"
import { SubscriptionFormSchema } from "@/lib/zod"
import { CategoryType } from "@/generated/zod"
import { CATEGORY_VALUES, PERIOD_VALUES } from "@/lib/constants"

interface SubscriptionFormProps {
  mode: "create" | "edit"
  initialData?: Partial<SubscriptionFormData> & { id?: string }
  onSubmit: (data: SubscriptionFormData) => void
  isLoading?: boolean
  onCancel?: () => void
}

const formatDateForInput = (date?: Date | string) => {
  if (!date) return new Date().toISOString().split("T")[0]
  const d = new Date(date)
  return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0]
}

export function SubscriptionForm({
                                   mode,
                                   initialData,
                                   onSubmit,
                                   isLoading = false,
                                   onCancel
                                 }: SubscriptionFormProps) {
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  // Объединенное состояние загрузки (AI или отправка формы родителем)
  const isBusy = isLoading || isAIGenerating

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setValue,
    watch,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(SubscriptionFormSchema) as unknown as Resolver<SubscriptionFormData>,
    values: initialData ? {
      name: initialData.name ?? "",
      price: initialData.price ?? 0,
      startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
      category: initialData.category ?? "ENTERTAINMENT",
      icon: initialData.icon ?? "📦",
      color: initialData.color ?? "#00f3ff",
      frequency: initialData.frequency ?? 1,
      period: initialData.period ?? "MONTHLY",
    } : undefined,
    resetOptions: {
      keepDirtyValues: true,
    },
    defaultValues: {
      name: "",
      price: 0,
      startDate: new Date(),
      category: "ENTERTAINMENT",
      icon: "📦",
      color: "#00f3ff",
      frequency: 1,
      period: "MONTHLY",
    },
  })

  // --- AI Logic ---
  const nameValue = watch("name")
  const colorValue = watch("color")

  const handleAIAutofill = async () => {
    if (!nameValue) return
    setIsAIGenerating(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const aiSuggestions: Record<string, Partial<SubscriptionFormData>> = {
        netflix: { icon: "🎬", color: "#E50914", category: "ENTERTAINMENT", price: 15.99 },
        spotify: { icon: "🎵", color: "#1DB954", category: "ENTERTAINMENT", price: 10.99 },
        github: { icon: "💻", color: "#6e5494", category: "SOFTWARE", price: 4.0 },
        adobe: { icon: "🎨", color: "#FF0000", category: "SOFTWARE", price: 54.99 },
        aws: { icon: "☁️", color: "#FF9900", category: "UTILITIES", price: 29.0 },
      }

      const key = Object.keys(aiSuggestions).find((k) => nameValue.toLowerCase().includes(k))
      const suggestion = key ? aiSuggestions[key] : { icon: "📦", color: "#00f3ff", category: "OTHER" as CategoryType, price: 9.99 }

      if (suggestion) {
        if (suggestion.icon) setValue("icon", suggestion.icon, { shouldValidate: true })
        if (suggestion.color) setValue("color", suggestion.color, { shouldValidate: true })
        if (suggestion.category && CATEGORY_VALUES.includes(suggestion.category as CategoryType)) {
          setValue("category", suggestion.category as CategoryType, { shouldValidate: true })
        }
        if (suggestion.price) setValue("price", suggestion.price, { shouldValidate: true })
        toast.info("Auto-filled details with AI ✨")
      }
    } catch (e) {
      toast.error("AI Generation failed")
    } finally {
      setIsAIGenerating(false)
    }
  }

  const onError = (errors: any) => {
    toast.error("Please fix the errors in the form before submitting.")
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

        {/* --- Main Info Section --- */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Subscription Name</Label>
            <div className="relative flex items-center group">
              <Input
                id="name"
                {...register("name")}
                disabled={isBusy}
                placeholder="e.g. Netflix Premium"
                className="pr-12 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white placeholder:text-slate-600 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50 h-12 text-lg transition-all"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAIAutofill}
                disabled={isBusy || !nameValue}
                className="absolute right-1 top-1 h-10 w-10 bg-transparent hover:bg-[#00f3ff]/10 text-[#d946ef] hover:text-[#00f3ff] transition-colors"
                title="Auto-fill with AI"
              >
                {isAIGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              </Button>
            </div>
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Price</Label>
              <div className="relative group">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-[#00f3ff] transition-colors" />
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                  disabled={isBusy}
                  className="pl-9 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="text-red-400 text-xs">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isBusy}>
                    <SelectTrigger className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white data-[placeholder]:text-slate-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050b1a] border-[#1e293b] text-slate-200">
                      {CATEGORY_VALUES.map((cat) => (
                        <SelectItem key={cat} value={cat} className="focus:bg-[#00f3ff]/10 focus:text-[#00f3ff] cursor-pointer">
                          {cat.charAt(0) + cat.slice(1).toLowerCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[#1e293b] to-transparent my-6" />

        {/* --- Details Section --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold flex items-center gap-2">
              <Repeat className="w-3 h-3 text-[#00f3ff]" />
              Billing Cycle
            </Label>
            <div className="flex gap-2">
              <div className="w-1/3">
                <Input
                  type="number"
                  min="1"
                  {...register("frequency")}
                  disabled={isBusy}
                  className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white text-center"
                />
              </div>
              <div className="flex-1">
                <Controller
                  control={control}
                  name="period"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isBusy}>
                      <SelectTrigger className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#050b1a] border-[#1e293b] text-slate-200">
                        {PERIOD_VALUES.map((p) => (
                          <SelectItem key={p} value={p} className="focus:bg-[#00f3ff]/10 focus:text-[#00f3ff]">
                            {p.toLowerCase()}(s)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">First Payment</Label>
            <div className="relative group">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10 pointer-events-none group-focus-within:text-[#00f3ff] transition-colors" />
              <Controller
                control={control}
                name="startDate"
                render={({ field }) => (
                  <Input
                    type="date"
                    disabled={isBusy}
                    value={formatDateForInput(field.value)}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                    className="pl-9 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white [color-scheme:dark] cursor-pointer focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* --- Appearance Section --- */}
        <div className="grid grid-cols-[1fr_2fr] gap-4 items-end">
          <div className="space-y-2">
            <Label htmlFor="icon" className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Icon</Label>
            <Input
              id="icon"
              {...register("icon")}
              disabled={isBusy}
              className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white text-center text-2xl h-12 focus:border-[#00f3ff] focus:ring-[#00f3ff]/50"
              maxLength={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Color Tag</Label>
            <div className="flex items-center gap-3 p-1">
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 ring-2 ring-transparent hover:ring-[#00f3ff]/50 transition-all">
                <Input
                  type="color"
                  {...register("color")}
                  disabled={isBusy}
                  className="absolute -top-2 -left-2 w-16 h-16 p-0 border-none cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["#E50914", "#1DB954", "#00f3ff", "#d946ef", "#FF9900"].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setValue("color", c)}
                    disabled={isBusy}
                    className={cn(
                      "w-6 h-6 rounded-full transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100",
                      colorValue === c ? "ring-2 ring-white ring-offset-2 ring-offset-[#02040a]" : "opacity-70 hover:opacity-100"
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* --- Action Buttons --- */}
        <div className="pt-6 flex gap-3">
          {onCancel && (
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isBusy}
              className="flex-1 border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            disabled={isBusy || (!isDirty && mode === "edit")}
            className={cn(
              "flex-[2] font-bold transition-all relative overflow-hidden",
              isBusy
                ? "bg-slate-800 text-slate-400 cursor-not-allowed"
                : "bg-gradient-to-r from-[#00f3ff] to-[#0ea5e9] text-[#02040a] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)]"
            )}
          >
            {isLoading ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> {mode === "create" ? "Add Subscription" : "Save Changes"}</>
            )}
          </Button>
        </div>
      </form>
    </>
  )
}