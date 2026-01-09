import {createTRPCRouter, publicProcedure} from "@/server/trpc";
import {LegalDocumentSchema} from "@/generated/zod"; // Ваша Zod схема

export const termsRouter = createTRPCRouter({
  getActualTerms: publicProcedure
    .output(LegalDocumentSchema)
    .query(async ({ ctx }) => {
      const terms = await ctx.db.legalDocument.findMany({
        where: {
          slug: "terms-of-service",
        },
      });

      if (!terms || terms.length === 0) {
        throw new Error("Terms of Service not found");
      }

      return terms
        .sort((a, b) => {
          return  b.updatedAt.getTime() - a.updatedAt.getTime()
        })[0];
    }),
});