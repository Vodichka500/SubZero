import { Period } from "@prisma/client"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Subscription } from "@/lib/types";
import {
  add,
  isWithinInterval,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  differenceInCalendarDays, Duration, Interval
} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Вспомогательная функция для прибавления времени к дате.
 * Использует объект Duration из date-fns.
 */
const addPeriod = (date: Date, period: Period, frequency: number): Date => {
  const durationMap: Record<Period, Duration> = {
    [Period.DAILY]: { days: frequency },
    [Period.WEEKLY]: { weeks: frequency },
    [Period.MONTHLY]: { months: frequency },
    [Period.YEARLY]: { years: frequency },
  };
  return add(date, durationMap[period]);
};

/**
 * Считает сумму платежей по ОДНОЙ подписке внутри заданного интервала.
 */
const calculateSubscriptionCostInInterval = (sub: Subscription, interval: Interval): number => {
  if (!sub.active || sub.frequency <= 0) return 0;

  let total = 0;
  let nextPayment = new Date(sub.startDate);

  // Проматываем до начала интервала
  while (nextPayment < interval.start) {
    nextPayment = addPeriod(nextPayment, sub.period, sub.frequency);
  }

  // Считаем все платежи внутри интервала
  while (nextPayment <= interval.end) {
    if (isWithinInterval(nextPayment, interval)) {
      total += sub.price;
    }
    nextPayment = addPeriod(nextPayment, sub.period, sub.frequency);
  }

  return total;
};

/**
 * Дни до следующего платежа
 */
export const getDaysToNextPayment = (startDate: Date, period: Period, frequency: number): number => {
  if (frequency <= 0) return 0;

  const now = new Date();
  let nextPayment = new Date(startDate);

  while (nextPayment <= now) {
    nextPayment = addPeriod(nextPayment, period, frequency);
  }

  return differenceInCalendarDays(nextPayment, now);
};

/**
 * Ожидаемые затраты за месяц
 */
export const getExpectedMonthlyCost = (subscriptions: Subscription[]): number => {
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };

  return subscriptions.reduce((sum, sub) =>
    sum + calculateSubscriptionCostInInterval(sub, interval), 0
  );
};

/**
 * Ожидаемые затраты за год
 */
export const getExpectedYearlyCost = (subscriptions: Subscription[]): number => {
  const now = new Date();
  const interval = { start: startOfYear(now), end: endOfYear(now) };

  return subscriptions.reduce((sum, sub) =>
    sum + calculateSubscriptionCostInInterval(sub, interval), 0
  );
};



/**
 * Генерирует карту платежей по дням для заданного интервала (например, месяца)
 */
export const getPaymentsByDayInterval = (
  subscriptions: Subscription[],
  start: Date,
  end: Date
): Record<number, Subscription[]> => {
  const payments: Record<number, Subscription[]> = {}
  const interval = { start, end }

  subscriptions.forEach((sub) => {
    if (!sub.active || sub.frequency <= 0) return

    let currentPayment = new Date(sub.startDate)

    // 1. Проматываем до начала интервала (если старт подписки был давно)
    while (currentPayment < start) {
      currentPayment = addPeriod(currentPayment, sub.period, sub.frequency)
    }

    // 2. Итерируем, пока не выйдем за пределы конца интервала
    while (currentPayment <= end) {
      if (isWithinInterval(currentPayment, interval)) {
        const day = currentPayment.getDate()
        if (!payments[day]) {
          payments[day] = []
        }
        payments[day].push(sub)
      }
      currentPayment = addPeriod(currentPayment, sub.period, sub.frequency)
    }
  })

  return payments
}