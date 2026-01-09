"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import type { Subscription } from "@/lib/types"
import { ChevronLeft, ChevronRight, X } from "lucide-react" // Добавил иконку X
import { Button } from "@/components/ui/button"
import {
  startOfMonth,
  endOfMonth,
  format,
  getDaysInMonth,
  getDay,
  isSameDay,
  add,
  sub
} from "date-fns"
import { getPaymentsByDayInterval } from "@/lib/utils"

interface CalendarViewProps {
  subscriptions: Subscription[]
}

export function CalendarView({ subscriptions }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(new Date())
  // Добавляем стейт для выбранного дня (для мобильной версии)
  const [selectedDayDate, setSelectedDayDate] = useState<Date | null>(null)

  const { monthStart, monthEnd, daysInMonth, firstDayOfMonth } = useMemo(() => ({
    monthStart: startOfMonth(viewDate),
    monthEnd: endOfMonth(viewDate),
    daysInMonth: getDaysInMonth(viewDate),
    firstDayOfMonth: getDay(startOfMonth(viewDate))
  }), [viewDate])

  const paymentsByDay = useMemo(() =>
      getPaymentsByDayInterval(subscriptions, monthStart, monthEnd),
    [subscriptions, monthStart, monthEnd])

  const nextMonth = () => setViewDate(prev => add(prev, { months: 1 }))
  const prevMonth = () => setViewDate(prev => sub(prev, { months: 1 }))
  const today = new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">{format(viewDate, "MMMM yyyy")}</h2>
        <div className="flex gap-2">
          <Button onClick={prevMonth} variant="outline" size="icon" className="...">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button onClick={() => setViewDate(today)} variant="ghost" className="...">
            Today
          </Button>
          <Button onClick={nextMonth} variant="outline" size="icon" className="...">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="glass-card border border-[#00f3ff]/20 p-4 md:p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs md:text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square opacity-20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateOfCell = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
            const isToday = isSameDay(dateOfCell, today)
            const isSelected = selectedDayDate && isSameDay(dateOfCell, selectedDayDate)

            const payments = paymentsByDay[day] || []
            const totalAmount = payments.reduce((sum, sub) => sum + sub.price, 0)

            return (
              <div
                key={day}
                onClick={() => setSelectedDayDate(dateOfCell)} // Обработчик клика для мобильных
                className={`aspect-square rounded-lg border transition-all ${
                  isToday
                    ? "border-[#00f3ff] bg-[#00f3ff]/10"
                    : isSelected
                      ? "border-[#00f3ff]/50 bg-[#00f3ff]/5" // Подсветка при клике
                      : "border-[#1e293b] bg-[#0a0f1e]/40 hover:bg-[#0a0f1e]/60"
                } p-1 md:p-2 relative group cursor-pointer flex flex-col items-center`}
              >
                {/* Центрируем контент и уменьшаем паддинги для мобилок */}
                <div className="flex flex-col h-full w-full items-center">
                  <span className={`text-xs md:text-sm font-semibold ${isToday ? "text-[#00f3ff]" : "text-white"} mb-1`}>
                    {day}
                  </span>

                  {payments.length > 0 && (
                    <div className="flex-1 flex flex-wrap gap-1 justify-center content-start w-full">
                      {payments.slice(0, 4).map((sub) => (
                        <div
                          key={sub.id}
                          className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full shrink-0" // Чуть меньше точки на мобильных
                          style={{ backgroundColor: sub.color || "#00f3ff" }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* --- DESKTOP TOOLTIP (HOVER) --- */}
                {/* Скрыт на мобильных (hidden md:block), показывается при hover */}
                {payments.length > 0 && (
                  <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                    <Card className="glass-card border border-[#00f3ff]/30 p-3 backdrop-blur-xl min-w-[180px] shadow-2xl">
                      <div className="space-y-2">
                        <div className="text-[10px] text-slate-500 font-bold uppercase pb-1 border-b border-white/10">
                          {format(dateOfCell, "do MMMM")}
                        </div>
                        {payments.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-2">
                              <span>{sub.icon}</span>
                              <span className="text-white truncate max-w-[80px]">{sub.name}</span>
                            </div>
                            <span className="text-[#00f3ff] font-mono">${sub.price}</span>
                          </div>
                        ))}
                        <div className="border-t border-[#1e293b] pt-1 flex justify-between font-bold text-xs">
                          <span className="text-slate-400">Total:</span>
                          <span className="text-white">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}

                {/* --- MOBILE MODAL (CLICK) --- */}
                {/* Появляется только если день выбран и есть платежи. Рендерится через Portal по хорошему, но тут fixed z-50 сработает */}
                {payments.length > 0 && isSelected && (
                  <div className="md:hidden fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                       onClick={(e) => {
                         e.stopPropagation();
                         setSelectedDayDate(null);
                       }}
                  >
                    <Card
                      className="w-full max-w-xs glass-card border border-[#00f3ff]/30 p-4 shadow-2xl animate-in fade-in zoom-in-95"
                      onClick={(e) => e.stopPropagation()} // Чтобы клик по карточке не закрывал её
                    >
                      <div className="flex justify-between items-center mb-3 border-b border-white/10 pb-2">
                         <span className="text-sm text-slate-400 font-bold uppercase">
                            {format(dateOfCell, "do MMMM")}
                         </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:bg-white/10"
                          onClick={() => setSelectedDayDate(null)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        {payments.map((sub) => (
                          <div key={sub.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-lg">{sub.icon}</span>
                              <span className="text-white font-medium">{sub.name}</span>
                            </div>
                            <span className="text-[#00f3ff] font-mono font-bold">${sub.price}</span>
                          </div>
                        ))}

                        <div className="border-t border-[#1e293b] pt-3 mt-2 flex justify-between font-bold">
                          <span className="text-slate-400">Total for day:</span>
                          <span className="text-white text-lg">${totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}