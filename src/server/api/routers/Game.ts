/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
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
                skip: Math.floor(Math.random() * await ctx.db.automon.count({where: {ShopTier: 1}}))
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
                include: {Shop: {include: {ShopPets: {include: {BaseData: true}}}}, Pet: {include: {BaseData: true}}}
            })
        }),
    
    GoToPlace: protectedProcedure.input(z.object({gameId: z.string(), p1: z.string(), Pos: z.number(), actualPos: z.number()}))
    .mutation(async ({ctx, input}) => {
        const has = await ctx.db.pet.findFirst({
            where: {GameId: input.gameId, BattlePosition: input.Pos}, select: {id: true}
        })
        await ctx.db.pet.update({
            where: {id: input.p1}, data: {BattlePosition: input.Pos}
        })
        if(has) await ctx.db.pet.update({
            where: {id: has.id}, data: {BattlePosition: input.actualPos}
        })
    }),

    
    LevelUp: publicProcedure
        .input(z.object({id1: z.string(), id2: z.string(), gameId: z.string()}))
        .mutation( async ({ctx, input}) => {
            const pet1 = await ctx.db.pet.findUnique({
                where: {id: input.id1},
                select: {Level: true, LevelProgress: true}
            })
            const game = await ctx.db.game.findUnique({
                where: {id: input.gameId},
                select: {Gold: true}
            })

            if (pet1?.Level == 3) return

            const pet2 = await ctx.db.pet.findUnique({
                where: {id: input.id2},
                select: {Level: true, LevelProgress: true, ShopId: true}
            })

            if(pet2?.ShopId){
                if(game!.Gold < 3) return
                await ctx.db.game.update({where: {id: input.gameId}, data: {Gold: {decrement: 3}}})
            }
            await ctx.db.pet.delete({where: {id: input.id2}})

            let statsUp = (pet2!.Level == 3 ? 6 : pet2!.LevelProgress == 2 ? 3 : 0) + 1 + pet2!.LevelProgress
            let progress = pet1!.LevelProgress + statsUp
            let Level = pet1!.Level
            statsUp = Math.min(pet1!.LevelProgress + statsUp + (pet1!.Level == 3 ? 6 : pet1!.Level == 2 ? 3 : 0), 6)
            statsUp -= (pet1!.LevelProgress + (pet1!.Level == 3 ? 6 : pet1!.Level == 2 ? 3 : 0))

            if (Level == 1 && progress >= 2){
                Level ++;
                progress -= 2;
            }
            if (Level == 2 && progress >= 3){
                Level ++;
                progress = 0;
            }

            await ctx.db.pet.update({
                where: {id: input.id1},
                data: {
                    Level, LevelProgress: progress,
                    Damage: {increment: statsUp},
                    Heath: {increment: statsUp},
                }
            })
        })
});
