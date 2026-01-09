import { createTRPCRouter } from "@/server/trpc";
import { subscriptionRouter } from "@/server/routers/subscription-router";
import {authRouter} from "@/server/routers/auth-router";
import {userRouter} from "@/server/routers/user-router";
import {termsRouter} from "@/server/routers/terms-router";

export const appRouter = createTRPCRouter({
  subscription: subscriptionRouter,
  auth: authRouter,
  user: userRouter,
  terms: termsRouter,
});

export type AppRouter = typeof appRouter;