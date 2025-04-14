import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import {
  ArticleCreateSchema,
  ArticleDetailSchema,
  ArticleImageSchema,
  ArticleUpdateSchema,
  ImageInfoSchema,
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
        token: z.string(),
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
          Authorization: `Bearer ${input.token}`,
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

  createArticle: publicProcedure
    .input(
      z.object({
        ...ArticleCreateSchema.shape,
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { token, ...articlePayload } = input;

      const res = await fetch(`${API_URL}/articles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
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

  getArticleDetail: publicProcedure
    .input(
      z.object({
        articleId: z.string().uuid(),
        token: z.string(),
      }),
    )
    .query(async ({ input }) => {
      const res = await fetch(`${API_URL}/articles/${input.articleId}`, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${input.token}`,
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

  updateArticle: publicProcedure
    .input(
      z.object({
        articleId: z.string().uuid(),
        token: z.string(),
        ...ArticleUpdateSchema.shape,
      }),
    )
    .mutation(async ({ input }) => {
      const { token, articleId, ...articlePayload } = input;

      console.log("🛠 Sent payload to PATCH /articles/:id:", articlePayload);

      const res = await fetch(`${API_URL}/articles/${articleId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
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

  deleteArticle: publicProcedure
    .input(
      z.object({
        articleId: z.string().uuid(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const res = await fetch(`${API_URL}/articles/${input.articleId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${input.token}`,
        },
      });

      if (!res.ok) {
        const error = (await res.json().catch(() => ({}))) as unknown;
        throw new Error(extractErrorMessage(error, "Failed to delete article"));
      }

      return { success: true };
    }),
});
