import {createTRPCRouter, protectedProcedure} from "@/server/trpc";
import { UserSchema } from "@/generated/zod";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  getMe: protectedProcedure
    .output(UserSchema)
    .query(async ({ctx}) => {

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      })

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return user
    }),
  updateMe: protectedProcedure
    .input(UserSchema.partial())
    .output(UserSchema)
    .mutation(async ({ctx, input}) => {

      const updatedUser = await ctx.db.user.update({
        where: {id: ctx.session.user.id},
        data: input,
      })

      if (!updatedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return updatedUser
    }),
  deleteMe: protectedProcedure
    .mutation(async ({ctx}) => {
      const deletedUser = await ctx.db.user.delete({
        where: { id: ctx.session.user.id },
      })

      if (!deletedUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        })
      }

      return { success: true }
    }),
});