import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const GameRouter = createTRPCRouter({
    getUser: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            return ctx.db.user.findUnique({
                where: {...input},
                select: {isOnGame: true, GameStatus: true}
            })
        }),
    
    startNewGame: protectedProcedure
        .input(z.object({id: z.string(), isOnGame: z.boolean()}))
        .mutation(async ({ctx, input}) => {

            const getRandom = async () => await ctx.db.automon.findFirst({
                where: {ShopTier: 1},
                skip: Math.floor(Math.random() * await ctx.db.automon.count())
            })

            const createOnShop = async () => {
                const data = await getRandom()
                return {
                    Damage: data!.BaseDmg, Heath: data!.BaseHealth, AutomonId: data!.id
                }
            }

            return ctx.db.user.update({
                where: {...input},
                data: {
                    isOnGame: true,
                    GameStatus: {...input.isOnGame ? {delete: true} : {}, create: { Shop: { create: {
                        ShopPets: {createMany: {data: [
                            await createOnShop(),
                            await createOnShop(),
                            await createOnShop(),
                        ]}}
                    } } } }
                },
                select: {GameStatus: {select: {id: true}}},
            })
        }),
    
    getGameData: publicProcedure
        .input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            if(input.id.length != 24) return null

            return ctx.db.game.findUnique({
                where: {...input},
                include: {Shop: {include: {ShopPets: {include: {BaseData: true}}}}, Pet: true}
            })
        })
});
