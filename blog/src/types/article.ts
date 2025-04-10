import type {
  ArticleCreateSchema,
  ArticleSchema,
  ImageInfoSchema,
  PaginatedArticlesSchema,
} from "~/schemas/article.schema";
import type { z } from "zod";
import type { AppRouter } from "~/server/api/root";
import type { inferRouterOutputs } from "@trpc/server";

export type Article = z.infer<typeof ArticleSchema>;

export type ArticleCreate = z.infer<typeof ArticleCreateSchema>;

export type ImageInfo = z.infer<typeof ImageInfoSchema>;

export type PaginatedArticles = z.infer<typeof PaginatedArticlesSchema>;

type RouterOutput = inferRouterOutputs<AppRouter>;

export type ArticleDetail = RouterOutput["article"]["getArticleDetail"];
