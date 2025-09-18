declare module seelie {

    export interface CharacterStatus {
        level: number;
        asc: number;
        text: string;
    }

    export interface SkillStatus {
        current: number;
        goal: number;
    }

    export interface Goal {
        type: string;
        id: number;
    }

    export interface GIGoal extends Goal {
        type: "character" | "talent" | "weapon";
        id: number;
        character?: string;
        weapon?: string;
        current?: CharacterStatus;
        goal?: CharacterStatus;
        normal?: SkillStatus;
        skill?: SkillStatus;
        burst?: SkillStatus;
        c3?: boolean;
        c5?: boolean;
    }

    export interface GICharacterGoal extends GIGoal {
        character: string;
        current: CharacterStatus;
        goal: CharacterStatus;
    }

    export interface GIWeaponGoal extends GIGoal {
        character: string;
        weapon: string;
        current: CharacterStatus;
        goal: CharacterStatus;
    }

    export interface GITalentGoal extends GIGoal {
        character: string;
        normal: SkillStatus;
        skill: SkillStatus;
        burst: SkillStatus;
        c3: boolean;
        c5: boolean;
    }

    //hsr start
    export interface HSRGoal extends Goal {
        type: "character" | "cone" | "trace";
        id: number;
        character?: string;
        cone?: string;
        trace?: string;
    }

    export interface HSRCharacterGoal extends HSRGoal {
        type: "character";
        character: string;
        current: CharacterStatus;
        goal: CharacterStatus;
        eidolon: number
    }

    export interface HSRTraceGoal extends Goal {
        type: "trace";
        character: string
        basic: SkillStatus
        skill: SkillStatus
        ultimate: SkillStatus
        talent: SkillStatus
        bonus: Bonus
        pet_skill: SkillStatus
        pet_talent: SkillStatus
    }

    export interface HSRConeGoal extends HSRGoal {
        type: "cone";
        character: string;
        cone: string;
        current: CharacterStatus;
        goal: CharacterStatus;
    }

    export interface Bonus {
        [K: string]: BonusTrace
    }

    export interface BonusTrace {
        type: string
        done: boolean
    }

    //hsr end

}

