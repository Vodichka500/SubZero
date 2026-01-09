"use client"

import { useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import type { Subscription } from "@/lib/types"
import { ChevronLeft, ChevronRight } from "lucide-react"
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
import { getPaymentsByDayInterval } from "@/lib/utils" // Импорт нашей функции

interface CalendarViewProps {
  subscriptions: Subscription[]
}

export function CalendarView({ subscriptions }: CalendarViewProps) {
  const [viewDate, setViewDate] = useState(new Date())

  // Мемоизируем границы месяца
  const { monthStart, monthEnd, daysInMonth, firstDayOfMonth } = useMemo(() => ({
    monthStart: startOfMonth(viewDate),
    monthEnd: endOfMonth(viewDate),
    daysInMonth: getDaysInMonth(viewDate),
    firstDayOfMonth: getDay(startOfMonth(viewDate))
  }), [viewDate])

  // Используем вынесенную функцию
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

      <Card className="glass-card border border-[#00f3ff]/20 p-6">
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-slate-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square opacity-20" />
          ))}

          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const dateOfCell = new Date(viewDate.getFullYear(), viewDate.getMonth(), day)
            const isToday = isSameDay(dateOfCell, today)

            const payments = paymentsByDay[day] || []
            const totalAmount = payments.reduce((sum, sub) => sum + sub.price, 0)

            return (
              <div
                key={day}
                className={`aspect-square rounded-lg border transition-all ${
                  isToday
                    ? "border-[#00f3ff] bg-[#00f3ff]/10"
                    : "border-[#1e293b] bg-[#0a0f1e]/40 hover:bg-[#0a0f1e]/60"
                } p-2 relative group cursor-pointer`}
              >
                <div className="flex flex-col h-full">
                  <span className={`text-sm font-semibold ${isToday ? "text-[#00f3ff]" : "text-white"} mb-1`}>
                    {day}
                  </span>

                  {payments.length > 0 && (
                    <div className="flex-1 flex flex-wrap gap-1 content-start">
                      {payments.slice(0, 4).map((sub) => (
                        <div
                          key={sub.id}
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: sub.color || "#00f3ff" }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Tooltip */}
                {payments.length > 0 && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
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
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}