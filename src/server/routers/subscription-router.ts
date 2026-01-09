import { createTRPCRouter, protectedProcedure } from "@/server/trpc";
import { z } from "zod";
import {SubscriptionSchema} from "@/generated/zod";
import {AiSubscriptionSchema, SubscriptionFormSchema} from "@/lib/zod";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";



export const subscriptionRouter = createTRPCRouter({
  // GET ALL
  getAll: protectedProcedure
    .output(z.array(SubscriptionSchema))
    .query(async ({ ctx }) => {
      return ctx.db.subscription.findMany({
        where: {
          userId: ctx.session.user.id
        },
        orderBy: [
          { active: 'desc' },
          { startDate: 'desc' }
        ]

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

  // UPDATE
  update: protectedProcedure
    .input(z.object({
      id: z.cuid(),
      data: SubscriptionFormSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const edited = await ctx.db.subscription.update({
        where: { id: input.id },
        data: input.data,
      });
      if (!edited) {
        throw new Error("Subscription not found");
      }
      return edited;
    }),

  // DELETE
  delete: protectedProcedure
    .input(z.object({ id: z.cuid() }))
    .mutation(async ({ ctx, input }) => {
      // ДОБАВИТЬ await ТУТ
      const deleted = await ctx.db.subscription.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id // Хорошая практика: проверять владельца при удалении
        },
      });

      if (!deleted) {
        throw new Error("Subscription not found");
      }
      return { success: true };
    }),

  // AI-POWERED SUBSCRIPTION DETAILS GENERATION
  getAiDetails: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const result = await generateObject({
        model: openai("gpt-4o"),
        schema: AiSubscriptionSchema,
        prompt: `Generate subscription details for "${input.name}". Use known pricing/branding if possible, otherwise estimate.`,
      });
      return {
        ...result.object,
      };
    }),
});
