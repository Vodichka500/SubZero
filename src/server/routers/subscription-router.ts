import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import {SubscriptionSchema} from "@/generated/zod";
import {SubscriptionFormSchema} from "@/lib/zod";



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
    .input(SubscriptionFormSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.subscription.create({
        data: {
          ...input,
          userId: ctx.session.user.id!,
        },
      });
    }),
});