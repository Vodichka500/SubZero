import { createTRPCRouter, publicProcedure } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { saltAndHashPassword } from "@/lib/password";
import { RegisterSchema } from "@/lib/zod";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, password, name } = input;

      const existingUser = await ctx.db.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User with this email already exists",
        });
      }

      const hashedPassword = await saltAndHashPassword(password);

      const newUser = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return {
        status: 201,
        message: "Account created successfully",
        user: { id: newUser.id, email: newUser.email },
      };
    }),
});