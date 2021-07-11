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

    export interface CharacterGoal extends Goal {
        character: string;
        current: CharacterStatus;
        goal: CharacterStatus;
    }

    export interface WeaponGoal extends Goal {
        character: string;
        weapon: string;
        current: CharacterStatus;
        goal: CharacterStatus;
    }

    export interface TalentGoal extends Goal {
        character: string;
        normal: SkillStatus;
        skill: SkillStatus;
        burst: SkillStatus;
        c3: boolean;
        c5: boolean;
    }

}

