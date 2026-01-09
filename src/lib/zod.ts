import { z } from "zod";
import {SubscriptionSchema} from "@/generated/zod";
import {CATEGORY_VALUES, PERIOD_VALUES} from "@/lib/constants";

export const LoginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Incorrect email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const AccountSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Please enter a valid email address"),
  sendNotifications: z.boolean(),
})

export const SubscriptionFormSchema = SubscriptionSchema
  .omit({ id: true, createdAt: true, updatedAt: true, userId: true })
  .extend({
    name: z.string().min(1, "Subscription name is required"),
    price: z.number().min(0, "Price must be at least 0"),
    frequency: z.number().int().min(1, "Frequency must be at least 1"),
    color: z
      .string()
      .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
        message: "Color must be a valid hex code (E.g., #FFFFFF)",
      })
      .nullable()
      .optional(),
    icon: z.emoji("Only emoji").nullable().optional(),
    active: z.boolean().optional(),
    startDate: z.date(),
  })

export const AiSubscriptionSchema = SubscriptionSchema
  .omit({ id: true, active: true, createdAt: true, updatedAt: true, userId: true, name: true, startDate: true })
  .extend({
    price: z.number().min(0, "Price must be at least 0").describe("Standard monthly cost. Example: 15.99 for Netflix."),
    color: z.string().describe("Dominant brand color in HEX..."),
    icon: z.string().describe("A single emoji that best represents the service (e.g. 🎬, 🎵, 📦)."),
    category: z.enum(CATEGORY_VALUES as [string, ...string[]]).describe("Subscription category."),
    period: z.enum(PERIOD_VALUES as [string, ...string[]]).describe("Billing cycle period."),
    frequency: z.number().int().min(1, "Frequency must be at least 1").describe("Billing frequency. Usually 1. Example: for 'every 3 months', frequency is 3, period is MONTHLY."),
  })