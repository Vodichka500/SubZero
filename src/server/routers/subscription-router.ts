import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import { Category, Period } from "@prisma/client";

const SubscriptionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  startDate: z.date(),
  category: z.enum(Category),
  icon: z.string().nullable(), // nullable так как в схеме Prisma стоит ?
  color: z.string().nullable(),
  active: z.boolean(),
  price: z.number(),
  frequency: z.number(),
  period: z.enum(Period),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const CreateSubscriptionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0),
  startDate: z.date(),
  category: z.enum(Category),
  period: z.enum(Period),
  frequency: z.number().default(1),
  icon: z.string().optional(),
  color: z.string().optional(),
});

export const subscriptionRouter = createTRPCRouter({
  // GET ALL
  getAll: protectedProcedure
    .output(z.array(SubscriptionSchema))
    .query(async ({ ctx }) => {
      return ctx.db.subscription.findMany({
        where: {
          userId: ctx.session.user.id
        },
        orderBy: {
          startDate: 'desc'
        }
      });
    }),

  // CREATE
  create: protectedProcedure
    .input(CreateSubscriptionSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.create({
        data: {
          ...input,
          userId: ctx.session.user.id!,
        },
      });
    }),
});