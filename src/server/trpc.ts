import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import superjson from "superjson";
import { ZodError } from "zod";

// 1. Context Creation
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    db: prisma,
    session,
    ...opts,
  };
};

// 2. Initialization
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

// 3. Routers & Procedures
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

// Protected Procedure (Middleware)
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const createCallerFactory = t.createCallerFactory;