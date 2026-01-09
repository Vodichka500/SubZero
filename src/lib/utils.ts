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
 * Function to add a specific period and frequency to a date.
 * @param date
 * @param period
 * @param frequency
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
 * Calculates the total cost of a subscription within a given interval.
 * @param sub
 * @param interval
 */
const calculateSubscriptionCostInInterval = (sub: Subscription, interval: Interval): number => {
  if (!sub.active || sub.frequency <= 0) return 0;

  let total = 0;
  let nextPayment = new Date(sub.startDate);

  while (nextPayment < interval.start) {
    nextPayment = addPeriod(nextPayment, sub.period, sub.frequency);
  }

  while (nextPayment <= interval.end) {
    if (isWithinInterval(nextPayment, interval)) {
      total += sub.price;
    }
    nextPayment = addPeriod(nextPayment, sub.period, sub.frequency);
  }

  return total;
};

/**
 * Days until the next payment
 * @param startDate
 * @param period
 * @param frequency
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
 * Expected monthly cost
 * @param subscriptions
 */
export const getExpectedMonthlyCost = (subscriptions: Subscription[]): number => {
  const now = new Date();
  const interval = { start: startOfMonth(now), end: endOfMonth(now) };

  return subscriptions.reduce((sum, sub) =>
    sum + calculateSubscriptionCostInInterval(sub, interval), 0
  );
};

/**
 * Expected yearly cost
 * @param subscriptions
 */
export const getExpectedYearlyCost = (subscriptions: Subscription[]): number => {
  const now = new Date();
  const interval = { start: startOfYear(now), end: endOfYear(now) };

  return subscriptions.reduce((sum, sub) =>
    sum + calculateSubscriptionCostInInterval(sub, interval), 0
  );
};


/**
 * Get payments by day interval
 * @param subscriptions
 * @param start
 * @param end
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

    while (currentPayment < start) {
      currentPayment = addPeriod(currentPayment, sub.period, sub.frequency)
    }

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