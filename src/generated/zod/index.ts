import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','sendNotifications','createdAt','updatedAt']);

export const SubscriptionScalarFieldEnumSchema = z.enum(['id','userId','name','startDate','category','icon','color','active','price','frequency','period','createdAt','updatedAt']);

export const LegalDocumentScalarFieldEnumSchema = z.enum(['id','slug','title','content','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const PeriodSchema = z.enum(['DAILY','WEEKLY','MONTHLY','YEARLY']);

export type PeriodType = `${z.infer<typeof PeriodSchema>}`

export const CategorySchema = z.enum(['ENTERTAINMENT','SOFTWARE','HEALTH','FINANCE','TRANSPORT','EDUCATION','UTILITIES','SHOPPING','OTHER']);

export type CategoryType = `${z.infer<typeof CategorySchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.cuid(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  sendNotifications: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// SUBSCRIPTION SCHEMA
/////////////////////////////////////////

export const SubscriptionSchema = z.object({
  category: CategorySchema,
  period: PeriodSchema,
  id: z.cuid(),
  userId: z.string(),
  name: z.string(),
  startDate: z.coerce.date(),
  icon: z.string().nullable(),
  color: z.string().nullable(),
  active: z.boolean(),
  price: z.number(),
  frequency: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Subscription = z.infer<typeof SubscriptionSchema>

/////////////////////////////////////////
// LEGAL DOCUMENT SCHEMA
/////////////////////////////////////////

export const LegalDocumentSchema = z.object({
  id: z.cuid(),
  slug: z.string(),
  title: z.string(),
  content: z.string(),
  updatedAt: z.coerce.date(),
})

export type LegalDocument = z.infer<typeof LegalDocumentSchema>
