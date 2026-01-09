import { z } from "zod";
import {SubscriptionSchema} from "@/generated/zod";

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

export const SubscriptionFormSchema = SubscriptionSchema.omit(
  { id: true, active: true, createdAt: true, updatedAt: true, userId: true }
)