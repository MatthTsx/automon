/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const ShopRouter = createTRPCRouter({
    RollShop: protectedProcedure.input(z.object({GameId: z.string()}))
        .mutation(async ({ctx, input}) => {
            const gold = await ctx.db.game.findUnique({where: {id: input.GameId}, select: {Gold: true}})
            if(gold?.Gold == 0) return
            await ctx.db.game.update({where: {id: input.GameId}, data: {Gold: gold!.Gold - 1}})

            const ShopData = await ctx.db.shop.findUnique({where: {GameId: input.GameId}, select: {Tier: true, DamagePlus: true, HealthPlus: true}})

            const getRand = async () => await ctx.db.automon.findFirst({
                    where: {ShopTier: {lte: ShopData?.Tier }},
                    skip: Math.floor( Math.random() * await ctx.db.automon.count( {where: {ShopTier: {lte: ShopData?.Tier}}} ) ),
                    select: {BaseDmg: true, BaseHealth: true, id: true}
                })
            const createNewPet = async () => {
                const data = await getRand()
                return {
                    Damage: data!.BaseDmg + ShopData!.DamagePlus, Heath: data!.BaseHealth + ShopData!.HealthPlus, AutomonId: data!.id
                }
            }

            await ctx.db.pet.deleteMany({
                where: {AND: [{isFrozen: false}, {Shop: {GameId: input.GameId}}]},
            })
            const Quantity = await ctx.db.pet.count({where: {Shop: {GameId: input.GameId}}})
            const mx = ShopData!.Tier >= 5 ? 5 : ShopData!.Tier >= 3 ? 4 : 3
            for(let i = Quantity; i < mx; i++) await ctx.db.shop.update({ where: {GameId: input.GameId}, data: {ShopPets: {create: await createNewPet()} }})
        })
});
