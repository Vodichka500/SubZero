import {CategorySchema, PeriodSchema, SubscriptionSchema} from "@/generated/zod";
import {z} from "zod";
import {LoginSchema, RegisterSchema, SubscriptionFormSchema} from "./zod";

export type Subscription = z.infer<typeof SubscriptionSchema>
export type Category = z.infer<typeof CategorySchema>
export type Period = z.infer<typeof PeriodSchema>

export type SubscriptionFormData = z.infer<typeof SubscriptionFormSchema>;

export type LoginFormValues = z.infer<typeof LoginSchema>
export type RegisterFormValues = z.infer<typeof RegisterSchema>