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
        character: string;
        current: CharacterStatus;
        goal: CharacterStatus;
        id: number;
        normal?: SkillStatus;
        skill?: SkillStatus;
        burst?: SkillStatus;
        c3?: boolean;
        c5?: boolean;
        weapon?: string;
    }

}

