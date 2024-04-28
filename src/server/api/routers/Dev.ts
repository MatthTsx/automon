import { $Enums } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const DevRouter = createTRPCRouter({
    createAutomon: protectedProcedure
        .input(z.object({
            BaseDmg: z.number(), BaseHealth: z.number(), AbilityFunc: z.string(), ImagePath: z.string(), Name: z.string(), LevelAbilityType: z.array(z.nativeEnum($Enums.AbilityType)),
            LevelsDescription: z.array(z.string())
        }))
        .mutation(({ctx, input}) => {
            return ctx.db.automon.create({
                data: {...input}
            })
        }),
    
    isAdmin: publicProcedure.input(z.object({id: z.string()}))
        .query(({ctx, input}) => {
            try {
                return ctx.db.user.findUnique({where: {...input}, select: {isAdmin: true}})
            } catch (error) {return null}
        })
});
