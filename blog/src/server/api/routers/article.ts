import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
import {
  ArticleCreateSchema,
  ArticleDetailSchema,
  ArticleUpdateSchema,
  PaginatedArticlesSchema,
} from "~/schemas/article.schema";

const API_URL = process.env.AppLift_URL!;
const API_KEY = process.env.API_KEY!;

function extractErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return fallback;
}

export const articleRouter = createTRPCRouter({
  getArticle: publicProcedure
    .input(
      z.object({
        offset: z.number().optional().default(0),
        limit: z.number().optional().default(10),
      }),
    )
    .query(async ({ input }) => {
      const queryParams = new URLSearchParams({
        offset: input.offset.toString(),
        limit: input.limit.toString(),
      });

      const res = await fetch(`${API_URL}/articles?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as unknown;
        throw new Error(extractErrorMessage(error, "Failed to fetch articles"));
      }

      const data = (await res.json()) as unknown;
      const parsedData = PaginatedArticlesSchema.parse(data);

      parsedData.items.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      return parsedData;
    }),

  getArticleDetail: publicProcedure
    .input(
      z.object({
        articleId: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const res = await fetch(`${API_URL}/articles/${input.articleId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
        },
      });

      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as unknown;
        throw new Error(
          extractErrorMessage(error, "Failed to fetch article detail"),
        );
      }

      const data = (await res.json()) as unknown;
      return ArticleDetailSchema.parse(data);
    }),

  createArticle: privateProcedure
    .input(ArticleCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const { ...articlePayload } = input;

      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${ctx.session.token}`,
        },
        body: JSON.stringify(articlePayload),
      });

      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as unknown;
        throw new Error(extractErrorMessage(error, "Failed to create article"));
      }

      const data = (await res.json()) as unknown;
      return ArticleDetailSchema.parse(data);
    }),

  updateArticle: privateProcedure
    .input(
      z.object({
        articleId: z.string().uuid(),
        ...ArticleUpdateSchema.shape,
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { articleId, ...articlePayload } = input;

      const res = await fetch(`${API_URL}/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${ctx.session.token}`,
        },
        body: JSON.stringify(articlePayload),
      });

      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as unknown;
        throw new Error(extractErrorMessage(error, "Failed to update article"));
      }

      const data = (await res.json()) as unknown;
      return ArticleDetailSchema.parse(data);
    }),

  deleteArticle: privateProcedure
    .input(
      z.object({
        articleId: z.string().uuid(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const res = await fetch(`${API_URL}/articles/${input.articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${ctx.session.token}`,
        },
      });

      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as unknown;
        throw new Error(extractErrorMessage(error, "Failed to delete article"));
      }

      return { success: true };
    }),
});
