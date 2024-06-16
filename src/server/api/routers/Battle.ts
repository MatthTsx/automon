/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import type { $Enums } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

interface Duelist{
    Pets: {
        Heath: number;
        Damage: number;
        Level: number;
        BattlePosition: number;
        BaseData: {
            AbilityFunc: string;
            LevelAbilityType: $Enums.AbilityType[];
        };
    }[]
}

enum Result{
    WIN, TIE, LOST
}

function calculateResult(D1: Duelist, D2: Duelist){
    D1.Pets.sort((b,a) => a.BattlePosition - b.BattlePosition)
    D2.Pets.sort((b,a) => a.BattlePosition - b.BattlePosition)
    let i = 0, j = 0
    while (i < D1.Pets.length && j < D2.Pets.length){
        D1.Pets[i]!.Heath -= Math.max(D2.Pets[j]!.Damage, 1)
        D2.Pets[j]!.Heath -= Math.max(D1.Pets[i]!.Damage, 1)
        
        if(D1.Pets[i]!.Heath <= 0) i++
        if(D2.Pets[j]!.Heath <= 0) j++
    }

    return D1.Pets[D1.Pets.length-1]!.Heath > 0 ? Result.WIN : D2.Pets[D2.Pets.length-1]!.Heath > 0 ? Result.LOST : Result.TIE
}

function ResultDataChange(result: Result){
    const common = {Turn: {increment: 1}, Gold: 10}
    let extra = {}

    if(result == Result.WIN) extra = {Trophies: {increment: 1}}
    else if (result == Result.LOST) extra = {Lives: {decrement: 1}}

    return {...common, ...extra}
}


export const BattleRouter = createTRPCRouter({
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
                }}, BaseGame: input.id
                },
                select: {Pets: {
                    select: {Damage: true, BaseData: true, Heath: true, Level: true, BattlePosition: true}
                }, id: true}
            })

            const getRandom = await ctx.db.battleDuelist.findFirst({
                // where: { Turn: data.Turn, BaseGame: {not: input.id} },
                where: {BaseGame: {not: input.id} },
                // skip: Math.floor( Math.random() * await ctx.db.battleDuelist.count({ where: {Turn: data.Turn, BaseGame:{NOT: {id: input.id }} } }) ),
                // skip: Math.floor( Math.random() * await ctx.db.battleDuelist.count({ where: {Turn: data.Turn, BaseGame:{not:input.id} } }) ),
                skip: Math.floor( Math.random() * await ctx.db.battleDuelist.count({ where: {BaseGame:{not:input.id} } }) ),
                select: {Pets: {
                    select: {Damage: true, Heath: true, Level: true, BattlePosition: true, BaseData: {select: {
                        AbilityFunc: true, LevelAbilityType: true
                    }}}
                }, id: true}
            })

            if(!getRandom?.id) return
            // TODO: Create random computer opponent

            
            
            const result = calculateResult(D1 as Duelist, getRandom as Duelist)
            
            await ctx.db.game.update({
                where: {id: input.id},
                data: ResultDataChange(result)
            })

            return await ctx.db.battleFought.create({
                data: {
                    BattleD: {connect: {id: D1.id}},
                    BattleD2:{connect: {id: getRandom.id}}
                }, select: {id: true}
            })
        }),

    GetFightData: publicProcedure
        .input(z.object({id: z.string()}))
        .query(async ({ctx, input}) => {
            return await ctx.db.battleFought.findUnique({
                where: {id: input.id},
                include: {
                    BattleD: {include: {Pets: {include: {BaseData: true}}}},
                    BattleD2: {include: {Pets: {include:{BaseData: true}}}}
                }
            })
        }),

});
