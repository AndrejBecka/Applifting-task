import type {
  ArticleCreateSchema,
  ArticleDetailSchema,
  ArticleSchema,
  ImageInfoSchema,
} from "~/schemas/article.schema";
import type { z } from "zod";

export type Article = z.infer<typeof ArticleSchema>;

export type ArticleDetail = z.infer<typeof ArticleDetailSchema>;

export type ArticleCreate = z.infer<typeof ArticleCreateSchema>;

export type ImageInfo = z.infer<typeof ImageInfoSchema>;
