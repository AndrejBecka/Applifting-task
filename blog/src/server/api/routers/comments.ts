import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { CommentSchema } from "~/schemas/article.schema";

const API_URL = process.env.AppLift_URL!;
const API_KEY = process.env.API_KEY!;

function extractErrorMessage(error: unknown, fallback: string) {
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: string }).message);
  }
  return fallback;
}

export const commentRouter = createTRPCRouter({
  createComment: publicProcedure
    .input(
      z.object({
        articleId: z.string(),
        author: z.string(),
        content: z.string(),
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { articleId, author, content, token } = input;

      const payload = { articleId, author, content };

      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": API_KEY,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const body = await res.text();

      if (!res.ok) {
        console.error("🚨 Failed response:", res.status, body);
        throw new Error(extractErrorMessage(body, "Failed to create comment"));
      }

      return CommentSchema.parse(JSON.parse(body));
    }),
});
