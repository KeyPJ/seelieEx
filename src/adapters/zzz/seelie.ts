import Goal = seelie.ZZZGoal;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.ZZZCharacterGoal;

import {getCharacterId, getWeaponId} from "./query";
import HSRCharacterData = mihoyo.ZZZCharacterData;
import ConeGoal = seelie.ZZZWeaponGoal;
import TraceGoal = seelie.ZZZTalentGoal;
import Bonus = seelie.Bonus;
import {refreshPage} from "../common";
import ZZZTalentGoal = seelie.ZZZTalentGoal;

const getAccount: () => string = () => localStorage.account || "main";

const getTotalGoal: () => Goal[] = () =>
    JSON.parse(
        localStorage.getItem(`${getAccount()}-goals`) || "[]"
    ) as Goal[];

const getGoalInactive: () => string[] = () =>
    Object.keys(JSON.parse(localStorage.getItem(`${getAccount()}-inactive`) || "{}"));

const setGoals = (goals: any) => {
    localStorage.setItem(`${getAccount()}-goals`, JSON.stringify(goals));
    localStorage.setItem("last_update", new Date().toISOString());
};

const addGoal = (data: any) => {
    let index: number = -1;
    const goals = getTotalGoal();

    if (data.character) {
        index = goals.findIndex(
            (g: any) => g.character === data.character && g.type === data.type
        );
    } else if (data.id) {
        index = goals.findIndex((g: any) => g.id === data.id);
    }

    if (index >= 0) {
        goals[index] = {...goals[index], ...data};
    } else {
        const lastId = goals
            ?.map((g: any) => g.id)
            ?.filter((id: any) => typeof id == "number")
            ?.sort((a: number, b: number) => (a < b ? 1 : -1))[0];

        data.id = (lastId || 0) + 1;
        goals.push(data);
    }
    setGoals(goals);
};
let initBonus = {} as Bonus

const addTraceGoal = (talentCharacter: string, skill_list: mihoyo.ZZZSkill[]) => {
    const totalGoal: Goal[] = getTotalGoal();
    const ids = totalGoal.map(g => g.id);
    const id = Math.max(...ids) + 1 || 1;
    const talentIdx = totalGoal.findIndex(g => g.type == "talent" && g.character == talentCharacter);
    // 创建排序权重映射
    const typeOrder = [0, 2, 6, 1, 3, 5];
    skill_list.sort((a, b) => {
        const aIndex = typeOrder.indexOf(a.skill_type);
        const bIndex = typeOrder.indexOf(b.skill_type);
        return aIndex - bIndex;
    });

    const [baseCurrent, dodgeCurrent, assistCurrent, specialCurrent, chainCurrent, coreCurrent] = skill_list.map(a => a.level);
    let talentGoal: TraceGoal;
    let coreValue = coreCurrent - 1;
    if (talentIdx < 0) {
        talentGoal = {
            type: "talent",
            character: talentCharacter,
            basic: {
                current: baseCurrent,
                goal: baseCurrent
            },
            dodge: {
                current: dodgeCurrent,
                goal: dodgeCurrent
            },
            assist: {
                current: assistCurrent,
                goal: assistCurrent
            },
            special: {
                current: specialCurrent,
                goal: specialCurrent
            },
            chain: {
                current: chainCurrent,
                goal: chainCurrent
            },
            core: {
                current: Math.max(1, coreValue),
                goal: Math.max(1, coreValue),
            },
            id
        }
    } else {
        const seelieGoal = totalGoal[talentIdx] as TraceGoal;
        const {basic, dodge, assist, special, chain, core} = seelieGoal as ZZZTalentGoal;
        const {goal: basicGoal} = basic;
        const {goal: dodgeGoal} = dodge;
        const {goal: assistGoal} = assist;
        const {goal: specialGoal} = special;
        const {goal: chainGoal} = chain;
        const {goal: coreGoal} = core;
        talentGoal = {
            ...seelieGoal,
            basic: {
                current: baseCurrent,
                goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
            }, dodge: {
                current: dodgeCurrent,
                goal: dodgeCurrent > dodgeGoal ? dodgeCurrent : dodgeGoal
            }, assist: {
                current: assistCurrent,
                goal: assistCurrent > assistGoal ? assistCurrent : assistGoal
            }, special: {
                current: specialCurrent,
                goal: specialCurrent > specialGoal ? specialCurrent : specialGoal
            },
            chain: {
                current: chainCurrent,
                goal: chainCurrent > chainGoal ? chainCurrent : chainGoal
            },
            core: {
                current: coreValue,
                goal: coreValue > coreGoal ? coreValue : coreGoal
            }
        }
    }
    addGoal(talentGoal)
};

export const addCharacterGoal = (level_current: number, nameEn: String, name: string, type: string) => {
    let totalGoal: Goal[] = getTotalGoal();
    const ids = totalGoal.map(g => g.id);
    const id = Math.max(...ids) + 1 || 1;
    let characterPredicate = (g: Goal) => g.type == type && g.character == nameEn;
    let weaponPredicate = (g: Goal) => g.type == type && g.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus: CharacterStatus = initCharacterStatus(level_current);

    let characterGoal: Goal

    function initCharacterGoal() {
        return {
            type: "character",
            character: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id,
            cons: 0,
        } as unknown as CharacterGoal
    }

    function initWeaponGoal() {
        return {
            type: "weapon",
            character: "",
            weapon: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id
        } as unknown as ConeGoal
    }

    if (characterIdx < 0) {
        characterGoal = type == "character" ? initCharacterGoal() : initWeaponGoal();
    } else {
        const seelieGoal = type == "character" ? totalGoal[characterIdx] as CharacterGoal : totalGoal[characterIdx] as ConeGoal
        const {goal, current} = seelieGoal;
        const {level: levelCurrent, asc: ascCurrent} = current;
        const {level: levelGoal, asc: ascGoal} = goal;
        const {level, asc} = characterStatus;

        characterGoal = {
            ...seelieGoal,
            current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
            goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal,
        } as CharacterGoal
    }
    addGoal(characterGoal)
};

export function addCharacter(characterDataEx: HSRCharacterData) {

    const {avatar: character, weapon} = characterDataEx;
    const {name_mi18n: name, skills: skill_list} = character;

    // [
    //     {
    //         "type": "character",
    //         "character": "soldier_11",
    //         "cons": 0,
    //         "current": {
    //             "level": 10,
    //             "asc": 0
    //         },
    //         "goal": {
    //             "level": 60,
    //             "asc": 5
    //         },
    //         "id": 1
    //     },
    //     {
    //         "type": "talent",
    //         "character": "soldier_11",
    //         "basic": {
    //             "current": 1,
    //             "goal": 12
    //         },
    //         "dodge": {
    //             "current": 2,
    //             "goal": 12
    //         },
    //         "assist": {
    //             "current": 3,
    //             "goal": 12
    //         },
    //         "special": {
    //             "current": 4,
    //             "goal": 12
    //         },
    //         "chain": {
    //             "current": 5,
    //             "goal": 12
    //         },
    //         "core": {
    //             "current": 2,
    //             "goal": 6
    //         },
    //         "id": 2
    //     },
    //     {
    //         "type": "weapon",
    //         "id": 3,
    //         "weapon": "tusks_of_fury",
    //         "current": {
    //             "level": 10,
    //             "asc": 0,
    //             "craft": 0
    //         },
    //         "goal": {
    //             "level": 15,
    //             "asc": 1,
    //             "craft": 1
    //         }
    //     }
    // ]

    if (weapon) {
        const {name, level: weaponLeveL} = weapon;
        const weaponId = getWeaponId(name);
        if (weaponId) {
            addCharacterGoal(weaponLeveL, weaponId, name, "weapon");
        }
    }
    const {level: characterLevel} = character;
    const characterId = getCharacterId(name);
    if (!characterId || characterId.includes("trailblazer")) {
        return
    }
    addCharacterGoal(characterLevel, characterId, name, "character");

    addTraceGoal(characterId, skill_list);

}

export const characterStatusList: CharacterStatus[] = [
    {level: 1, asc: 0, text: "1"},
    {level: 20, asc: 0, text: "20"},
    {level: 20, asc: 1, text: "20 A"},
    {level: 30, asc: 1, text: "30"},
    {level: 30, asc: 2, text: "30 A"},
    {level: 40, asc: 2, text: "40"},
    {level: 40, asc: 3, text: "40 A"},
    {level: 50, asc: 3, text: "50"},
    {level: 50, asc: 4, text: "50 A"},
    {level: 60, asc: 5, text: "60"},
]

const initCharacterStatus = (level_current: number) => {
    let initCharacterStatus = characterStatusList[0];
    if (level_current < 20) {
        return initCharacterStatus;
    }
    for (let characterStatus of characterStatusList) {
        const {level} = characterStatus;
        if (level_current < level) {
            return initCharacterStatus;
        } else if (level_current == level) {
            return characterStatus;
        } else if (level_current > level) {
            initCharacterStatus = characterStatus
        }
    }
    return initCharacterStatus;
};
const updateTrace = (talent: TraceGoal, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    const {
        basic: {current: baseCurrent},
        dodge: {current: dodgeCurrent},
        assist: {current: assistCurrent},
        special: {current: specialCurrent},
        chain: {current: chainCurrent},
        core: {current: coreCurrent},
    } = talent;
    const talentNew = {
        ...talent,
        basic: {
            current: baseCurrent,
            goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
        }, dodge: {
            current: dodgeCurrent,
            goal: dodgeCurrent > dodgeGoal ? dodgeCurrent : dodgeGoal
        }, assist: {
            current: assistCurrent,
            goal: assistCurrent > assistGoal ? assistCurrent : assistGoal
        }, special: {
            current: specialCurrent,
            goal: specialCurrent > specialGoal ? specialCurrent : specialGoal
        },
        chain: {
            current: chainCurrent,
            goal: chainCurrent > chainGoal ? chainCurrent : chainGoal
        },
        core: {
            current: coreCurrent,
            goal: coreCurrent > coreGoal ? coreCurrent : coreGoal
        }
    }
    addGoal(talentNew)
}

export const batchUpdateTrace = (all: boolean, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    if (coreGoal > 6) {
        coreGoal = 6
    }
    getTotalGoal().filter(a => a.type == 'talent').filter(a => all || !getGoalInactive().includes(a.character as string))
        .map(a => updateTrace(a as TraceGoal, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal))
    refreshPage()
}


const updateCharacter = (character: CharacterGoal, characterStatusGoal: CharacterStatus) => {
    const {current} = character;
    const {level: levelCurrent, asc: ascCurrent} = current;
    const {level, asc} = characterStatusGoal;

    const characterGoalNew = {
        ...character,
        goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current,
    }
    addGoal(characterGoalNew)
}

export const batchUpdateCharacter = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    getTotalGoal().filter(a => a.type == "character").filter(a => all || !getGoalInactive().includes(a.character as string))
        .map(a => updateCharacter(a as CharacterGoal, characterStatusGoal))
    refreshPage()
}

export const batchUpdateWeapon = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    getTotalGoal().filter(a => a.type == "weapon").filter(a => all || !getGoalInactive().includes(a.weapon as string))
        .map(a => updateCharacter(a as CharacterGoal, characterStatusGoal))
    refreshPage()
}
