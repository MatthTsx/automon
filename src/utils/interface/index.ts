import type { $Enums } from "@prisma/client";
import type { Session } from "next-auth";

export interface SessionRetrieve {
    s: Session
}


export interface AutomonData {
    AbilityFunc: string
    BaseDmg: number
    BaseHealth: number
    ImagePath: string
    LevelAbilityType: $Enums.AbilityType[]
    LevelsDescription: Array<string>
    Name: string
}