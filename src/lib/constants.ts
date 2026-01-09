import {CategorySchema, PeriodSchema} from "@/generated/zod";

export const DEFAULT_CURRENCY = '$';
export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
export const CATEGORY_VALUES = CategorySchema.options
export const PERIOD_VALUES = PeriodSchema.options