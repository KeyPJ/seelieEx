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

    export interface Goal extends CharacterGoal,TalentGoal{
    }

    export interface CharacterGoal {
        type: "character"|"talent";
        character: string;
        current: CharacterStatus;
        goal: CharacterStatus;
        id: number;
    }

    export interface TalentGoal {
        type: "character"|"talent";
        character: string;
        id: number;
        normal: SkillStatus;
        skill: SkillStatus;
        burst: SkillStatus;
        c3: boolean;
        c5: boolean;
    }

}

