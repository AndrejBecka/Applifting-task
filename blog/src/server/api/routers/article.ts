import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { ArticleCreateSchema, ArticleSchema } from "~/schemas/article.schema";

const API_URL = process.env.AppLift_URL;
const API_KEY = process.env.API_KEY;

export const articleRouter = createTRPCRouter({
  getArticle: publicProcedure
    .input(z.object({ ...ArticleSchema.shape, token: z.string() }))
    .query(async ({ input }) => {
      const res = await fetch(`${API_URL}/articles`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY ?? "",
          Authorization: `Bearer ${input.token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({
          message: "Invalid JSON error response",
        }));
        const errorMessage =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : "Login failed";
        throw new Error(errorMessage);
      }

      const data = await res.json();
      const validatedData = ArticleSchema.parse(data);
      return validatedData;
    }),

  createArticle: publicProcedure
    .input(
      z.object({
        ...ArticleCreateSchema.shape,
        token: z.string(), // used only for Authorization
      }),
    )
    .mutation(async ({ input }) => {
      const { token, ...articlePayload } = input;

      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY ?? "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(articlePayload),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({
          message: "Invalid JSON error response",
        }));
        const errorMessage =
          typeof error === "object" && error !== null && "message" in error
            ? String(error.message)
            : JSON.stringify(error);

        throw new Error(errorMessage);
      }

      const data = await res.json();

      return ArticleCreateSchema.parse(data);
    }),
});
