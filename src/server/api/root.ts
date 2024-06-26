import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { GameRouter } from "./routers/Game";
import { DevRouter } from "./routers/Dev";
import { ShopRouter } from "./routers/Shop";
import { BattleRouter } from "./routers/Battle";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: GameRouter,
  dev: DevRouter,
  shop: ShopRouter,
  battle: BattleRouter
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
