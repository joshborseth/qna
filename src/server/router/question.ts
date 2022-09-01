import { createRouter } from "./context";
import { z } from "zod";

export const questionRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      return await ctx.prisma.question.findMany();
    },
  })
  .mutation("createQuestion", {
    input: z.object({
      title: z.string(),
      body: z.string(),
      isAnswered: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.question.create({
        data: {
          ...input,
        },
      });
    },
  })
  .mutation("deleteQuestion", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.question.delete({
        where: {
          id: input,
        },
      });
    },
  });
