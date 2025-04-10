import { z } from "zod";

export const ArticleSchema = z.object({
  articleId: z.string(),
  title: z.string(),
  perex: z.string(),
  imageId: z.string(),
  createdAt: z.string(),
  lastUpdatedAt: z.string(),
});

export const CommentSchema = z.object({
  commentId: z.string(),
  content: z.string(),
  author: z.string(), // or email, or object — as needed
  createdAt: z.string(),
});

export const ArticleDetailSchema = ArticleSchema.extend({
  content: z.string(),
  comments: z.array(CommentSchema),
});

export const ArticleCreateSchema = z.object({
  title: z.string(),
  perex: z.string(),
  content: z.string(),
  imageId: z.string().uuid().nullable().optional(),
});

export const ImageInfoSchema = z.object({
  imageId: z.string(),
  imageUrl: z.string(),
});

export const PaginatedArticlesSchema = z.object({
  items: z.array(ArticleSchema),
  count: z.number().optional(),
});
