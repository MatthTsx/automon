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

    StartBattle: protectedProcedure
        .input(z.object({id: z.string()}))
        .mutation(async ({ctx, input}) => {
            const data = await ctx.db.game.findUnique({
                where: {id: input.id}, include: {Pet: true}
            })
            if(!data) return

            const D1 = await ctx.db.battleDuelist.create({
                data: {Turn: data.Turn, Lives: data.Lives, Pets: {createMany: {data:
                    data.Pet.map(p =>  ({
                        AutomonId: p.AutomonId, Damage: p.Damage, Heath: p.Heath, BattlePosition: p.BattlePosition, Level: p.Level,
                        LevelProgress: p.LevelProgress }) )
                }}, BaseGame: {connect: {id: input.id}}
            }
            })

            const getRandom = await ctx.db.battleDuelist.findFirst({
                where: { Turn: data.Turn, BaseGame: {NOT: {id: input.id}} },
                skip: Math.floor( Math.random() * await ctx.db.battleDuelist.count({ where: {Turn: data.Turn, BaseGame:{NOT: {id: input.id }} } }) ),
                include: {Pets: true}
            })

            if(!getRandom?.id) return




            return await ctx.db.battleFought.create({
                data: {
                    BattleD: {connect: {id: D1.id}},
                    BattleD2:{connect: {id: getRandom.id}}
                }
            })
        }),

    GetFightData: publicProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ctx, input}) => {
            return await ctx.db.battleFought.findUnique({
                where: {id: input.id},
                include: {
                    BattleD: {include: {Pets: true}},
                    BattleD2: {include: {Pets: true}}
                }
            })
        })
});
