"use client"

import { useState } from "react"
import { useForm, Controller, type Resolver } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import {Sparkles, Loader2, Calendar as CalendarIcon, Plus,} from "lucide-react"
import { toast } from "sonner"
import EmojiPicker, { Theme } from "emoji-picker-react"

import { cn } from "@/lib/utils"
import {CATEGORY_VALUES, PERIOD_VALUES, PRESET_COLORS} from "@/lib/constants"
import { api } from "@/app/_providers/trpc-provider"
import { zodResolver } from "@hookform/resolvers/zod"

import { SubscriptionFormData } from "@/lib/types"
import { SubscriptionFormSchema } from "@/lib/zod"
import {CategoryType, PeriodType} from "@/generated/zod"


interface SubscriptionFormProps {
  mode: "create" | "edit"
  initialData?: Partial<SubscriptionFormData> & { id?: string }
  onSubmit: (data: SubscriptionFormData) => void
  isLoading?: boolean
  onCancel?: () => void
}

export function SubscriptionForm({
                                   mode,
                                   initialData,
                                   onSubmit,
                                   isLoading = false,
                                   onCancel,
                                 }: SubscriptionFormProps) {

  // HOOKS & STATE
  const [isEmojiOpen, setIsEmojiOpen] = useState(false)

  // MUTATIONS
  const { mutate: generateDetails, isPending: isAIGenerating } = api.subscription.getAiDetails.useMutation({
    onSuccess: (data) => {
      // Устанавливаем значения, полученные от AI
      setValue("price", data.price, { shouldValidate: true })
      setValue("color", data.color, { shouldValidate: true })
      setValue("icon", data.icon, { shouldValidate: true })
      setValue("category", data.category as CategoryType, { shouldValidate: true })
      setValue("period", data.period as PeriodType, { shouldValidate: true })

      toast.success(`Found details for ${watch("name")}! ✨`)
    },
    onError: (error) => {
      console.error(error)
      toast.error(`
        Sorry. Couldn't generate details via AI: ${error.message || "Unknown error"}.
        Try manual entry.
      `)
    }
  })

  // FORMS
  const {
    register,
    handleSubmit,
    control,
    formState: {errors, isDirty},
    setValue,
    watch,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(SubscriptionFormSchema) as unknown as Resolver<SubscriptionFormData>,
    values: initialData
      ? {
        name: initialData.name ?? "",
        price: initialData.price ?? 0,
        startDate: initialData.startDate ? new Date(initialData.startDate) : new Date(),
        category: initialData.category ?? "ENTERTAINMENT",
        icon: initialData.icon ?? "📦",
        color: initialData.color ?? "#00f3ff",
        frequency: initialData.frequency ?? 1,
        period: initialData.period ?? "MONTHLY",
      }
      : undefined,
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

  // HELPERS
  const formatDateForInput = (date?: Date | string) => {
    if (!date) return new Date().toISOString().split("T")[0]
    const d = new Date(date)
    return isNaN(d.getTime()) ? new Date().toISOString().split("T")[0] : d.toISOString().split("T")[0]
  }

  const nameValue = watch("name")
  const colorValue = watch("color")
  const iconValue = watch("icon")
  const isCustomColor = !PRESET_COLORS.includes(colorValue!)
  const isBusy = isLoading || isAIGenerating

  // HANDLERS
  const handleAIAutofill = async () => {
    if (!nameValue) return
    generateDetails({ name: nameValue })
  }

  const onError = () => {
    toast.error("Please fix the errors in the form before submitting.")
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onError)}
      className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-lg mx-auto rounded-2xl"
    >
      {/* Name & AI */}
      <div className="space-y-2">
        <Label htmlFor="name">Subscription name</Label>
        <div className="flex gap-2 items-start">
          <div className="flex-1 space-y-1">
            <Input
              id="name"
              {...register("name")}
              disabled={isBusy}
              placeholder="e.g. Netflix"
              className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white focus:border-[#00f3ff]"
            />
            {errors.name && <p className="text-red-400 text-xs">{errors.name.message}</p>}
          </div>
          <div className="relative flex items-center justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={handleAIAutofill}
              disabled={isBusy || !nameValue}
              className="relative z-10 shrink-0 border-[#00f3ff]/30 hover:bg-[#00f3ff]/10 hover:text-[#00f3ff]"
            >
              {isAIGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4 mr-2" />
              )}
              Fill with AI
            </Button>
          </div>
        </div>
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", {valueAsNumber: true})}
            disabled={isBusy}
            className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white focus:border-[#00f3ff]"
            placeholder="0.00"
          />
          {errors.price && <p className="text-red-400 text-xs">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Controller
            control={control}
            name="category"
            render={({field}) => (
              <Select onValueChange={field.onChange} value={field.value} disabled={isBusy}>
                <SelectTrigger className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white">
                  <SelectValue placeholder="Select"/>
                </SelectTrigger>
                <SelectContent className="bg-[#050b1a] border-[#1e293b] text-slate-200">
                  {CATEGORY_VALUES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0) + cat.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <Separator className="bg-slate-800 my-6"/>

      {/* Billing Cycle & First Payment */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label>Billing Cycle</Label>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 whitespace-nowrap">Every</span>
            <div className="w-16">
              <Input
                type="number"
                {...register("frequency", {valueAsNumber: true})}
                disabled={isBusy}
                className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white text-center focus:border-[#00f3ff] px-1"
              />
            </div>
            <div className="flex-1 min-w-[100px]">
              <Controller
                control={control}
                name="period"
                render={({field}) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={isBusy}>
                    <SelectTrigger className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white">
                      <SelectValue/>
                    </SelectTrigger>
                    <SelectContent className="bg-[#050b1a] border-[#1e293b] text-slate-200">
                      {PERIOD_VALUES.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p.toLowerCase()}(s)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          {errors.frequency && <p className="text-red-400 text-xs">{errors.frequency.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="startDate">First Payment</Label>
          <div className="relative">
            <Controller
              control={control}
              name="startDate"
              render={({field}) => (
                <Input
                  type="date"
                  disabled={isBusy}
                  value={formatDateForInput(field.value)}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  className="bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-white [color-scheme:dark] focus:border-[#00f3ff]"
                />
              )}
            />
            <CalendarIcon
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none"/>
          </div>
        </div>
      </div>

      {/* Icon & Color */}
      <div className="grid grid-cols-[auto_1fr] gap-6 items-start">
        <div className="space-y-2 flex flex-col">
          <Label>Icon</Label>
          <Popover open={isEmojiOpen} onOpenChange={setIsEmojiOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-16 h-10 bg-[#0a0f1e]/60 border-[#00f3ff]/20 text-2xl p-0 hover:bg-[#00f3ff]/10",
                  isEmojiOpen && "border-[#00f3ff] ring-1 ring-[#00f3ff]"
                )}
              >
                {iconValue}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0 border-none w-auto" side="bottom" align="start">
              <EmojiPicker
                theme={Theme.DARK}
                onEmojiClick={(emojiData) => {
                  setValue("icon", emojiData.emoji, {shouldValidate: true})
                  setIsEmojiOpen(false)
                }}
                lazyLoadEmojis={true}
              />
            </PopoverContent>
          </Popover>
          {errors.icon && <p className="text-red-400 text-xs">{errors.icon.message}</p>}
        </div>

        {/* --- COLOR PICKER --- */}
        <div className="space-y-2 min-w-0">
          <Label>Color</Label>
          <div
            className="flex items-center gap-2 h-10 border border-[#00f3ff]/20 rounded-md px-3 bg-[#0a0f1e]/60 overflow-x-auto no-scrollbar">
            {/* Пресеты */}
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue("color", c)}
                disabled={isBusy}
                className={cn(
                  "w-5 h-5 rounded-full shrink-0 transition-all",
                  colorValue === c && !isCustomColor
                    ? "ring-2 ring-white ring-offset-1 ring-offset-[#0a0f1e] scale-110"
                    : "opacity-70 hover:opacity-100"
                )}
                style={{backgroundColor: c}}
              />
            ))}

            <Separator orientation="vertical" className="h-4 bg-slate-600 mx-1"/>

            <div
              className={cn(
                "relative w-6 h-6 shrink-0 rounded-full flex items-center justify-center transition-all overflow-hidden",
                isCustomColor
                  ? "ring-2 ring-white ring-offset-1 ring-offset-[#0a0f1e] scale-110"
                  : "border border-dashed border-slate-400 opacity-70 hover:opacity-100"
              )}
              style={{
                backgroundColor: isCustomColor ? (colorValue ?? "transparent") : "transparent"
              }}
            >
              <Input
                type="color"
                {...register("color")}
                disabled={isBusy}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full p-0 border-none z-10"
              />
              {!isCustomColor && (
                <Plus className="w-3 h-3 text-slate-400 pointer-events-none"/>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="outline"
            disabled={isBusy}
            className="w-full border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isBusy || (!isDirty && mode === "edit")}
          className={cn(
            "w-full font-bold transition-all",
            isBusy
              ? "bg-slate-800 text-slate-400 cursor-not-allowed"
              : "bg-[#00f3ff] text-[#02040a] hover:bg-[#00f3ff]/90"
          )}
        >
          {isLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin"/> Saving...</>
          ) : (
            mode === "create" ? "Add Subscription" : "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}