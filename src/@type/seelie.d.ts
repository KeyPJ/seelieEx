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
        type: "character"| "cone" | "trace";
        id: number;
        character?: string;
        current?: CharacterStatus;
        goal?: CharacterStatus;
        skill?: SkillStatus;
        basic?: SkillStatus
        ultimate?: SkillStatus
        talent?: SkillStatus
        bonus?: Bonus
        cone?: string;
        eidolon?: number
    }

    export interface Bonus {
        [K: string]: BonusTrace
    }

    export interface BonusTrace {
        type: string
        done: boolean
    }

    export interface TraceGoal extends Goal {
        character: string
        basic: SkillStatus
        skill: SkillStatus
        ultimate: SkillStatus
        talent: SkillStatus
        bonus: Bonus
    }

    export interface ConeGoal extends Goal {
        character: string;
        cone: string;
        current: CharacterStatus;
        goal: CharacterStatus;
    }

    export interface CharacterGoal extends Goal {
        character: string;
        current: CharacterStatus;
        goal: CharacterStatus;
        eidolon: number
    }
}

