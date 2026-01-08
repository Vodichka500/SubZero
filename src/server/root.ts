import { createTRPCRouter } from "@/server/trpc";
import { subscriptionRouter } from "@/server/routers/subscription-router";

export const appRouter = createTRPCRouter({
  subscription: subscriptionRouter,
});

export type AppRouter = typeof appRouter;