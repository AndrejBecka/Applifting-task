import { authRouter } from "~/server/api/routers/auth";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { articleRouter } from "~/server/api/routers/article";
import { commentRouter } from "./routers/comments";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  article: articleRouter,
  comments: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
