import Goal = seelie.ZZZGoal;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.ZZZCharacterGoal;
import {getCharacterId, getWeaponId} from "./query";
import HSRCharacterData = mihoyo.ZZZCharacterData;
import WeaponGoal = seelie.ZZZWeaponGoal;
import TalentGoal = seelie.ZZZTalentGoal;
import {
    addGoal,
    batchUpdateGoals,
    getNextId,
    getTotalGoal,
    updateCharacter,
} from "../common";

const addTraceGoal = async (talentCharacter: string, skill_list: mihoyo.ZZZSkill[]) => {
    const totalGoal = await getTotalGoal() as Goal[];
    const talentIdx = totalGoal.findIndex(g => g.type == "talent" && g.character == talentCharacter);
    // 创建排序权重映射
    const typeOrder = [0, 2, 6, 1, 3, 5];
    skill_list.sort((a, b) => {
        const aIndex = typeOrder.indexOf(a.skill_type);
        const bIndex = typeOrder.indexOf(b.skill_type);
        return aIndex - bIndex;
    });

    const [baseCurrent, dodgeCurrent, assistCurrent, specialCurrent, chainCurrent, coreCurrent] = skill_list.map(a => a.level);
    let talentGoal: TalentGoal;
    let coreValue = coreCurrent - 1;
    if (talentIdx < 0) {
        const id = await getNextId();
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
        const seelieGoal = totalGoal[talentIdx] as TalentGoal;
        const {basic, dodge, assist, special, chain, core} = seelieGoal;
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
    await addGoal(talentGoal)
};

/**
 * 由等级 + 突破档解析出唯一档位。对齐 GI 的 resolveStatus。
 * 米游社 ZZZ 的 promotes 语义为「已解锁等级上限 / 10」(1~6)，并非 seelie 的 asc 索引；
 * 例：level=40 promotes=5 → 上限 50、已突破 40 → 取该等级更高档 {40,3}。
 * 无 promotes（武器或字段缺失）时退回旧逻辑：取该等级最高档（已突破），与官方站一致。
 */
const resolveStatus = (level: number, promote?: number): CharacterStatus => {
    const closest = characterStatusList.filter(s => s.level <= level).pop() ?? characterStatusList[0];
    const candidates = characterStatusList.filter(s => s.level === closest.level);
    if (typeof promote !== "number") {
        // 武器/缺失 promotes：沿用等级推导（已突破的最高档），与旧 initCharacterStatus 行为一致
        return {...closest};
    }
    // promotes*10 = 已解锁等级上限；上限严格大于当前所属档位即视为已突破到更高档
    const cap = promote * 10;
    const ascended = cap > closest.level;
    return {...(ascended ? candidates[candidates.length - 1] : candidates[0])};
};

export const addCharacterGoal = async (
    status: CharacterStatus,
    nameEn: string,
    type: "character" | "weapon",
    extra?: { cons?: number; owner?: string }
) => {
    const totalGoal = await getTotalGoal() as Goal[];
    const cons = extra?.cons;
    const owner = extra?.owner ?? "";
    const characterPredicate = (g: Goal) => g.type == type && g.character == nameEn;
    const weaponPredicate = (g: Goal) => g.type == type && g.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus: CharacterStatus = status;

    function initCharacterGoal(id: number) {
        return {
            type: "character",
            character: nameEn,
            current: characterStatus,
            goal: {...characterStatus},
            id,
            cons: cons ?? 0,
        } as unknown as CharacterGoal
    }

    function initWeaponGoal(id: number) {
        const ws: CharacterStatus & { craft?: number } = {...characterStatus, craft: 0};
        return {
            type: "weapon",
            character: owner,
            weapon: nameEn,
            current: ws,
            goal: {...ws},
            id
        } as unknown as WeaponGoal
    }

    let characterGoal: Goal
    if (characterIdx < 0) {
        const id = await getNextId();
        characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
        const seelieGoal = (type == "character" ? totalGoal[characterIdx] as CharacterGoal : totalGoal[characterIdx] as WeaponGoal);
        const {goal, current} = seelieGoal;
        const {level: levelCurrent, asc: ascCurrent} = current;
        const {level: levelGoal, asc: ascGoal} = goal;
        const {level, asc} = characterStatus;
        const merged: any = {
            ...seelieGoal,
            current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
            goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal,
        };
        // 命座只增不减
        if (type == "character" && (cons !== undefined || (seelieGoal as CharacterGoal).cons !== undefined)) {
            merged.cons = Math.max((seelieGoal as CharacterGoal).cons ?? 0, cons ?? 0);
        }
        characterGoal = merged;
    }
    await addGoal(characterGoal)
};

export async function addCharacter(characterDataEx: HSRCharacterData) {

    const {avatar: character, weapon} = characterDataEx;
    const {level: characterLevel, rank, promotes} = character;

    if (weapon) {
        const {level: weaponLevel, promotes: weaponPromotes} = weapon;
        const weaponId = getWeaponId(weapon);
        if (weaponId) {
            // 武器无 promotes 字段，沿用等级推导；craft 默认 0
            await addCharacterGoal(
                resolveStatus(weaponLevel, weaponPromotes),
                weaponId, "weapon"
            );
        }
    }
    const characterId = getCharacterId(character);
    if (!characterId) {
        return
    }
    // 角色：突破档用真实 promotes，命座用 rank 写入 cons
    await addCharacterGoal(
        resolveStatus(characterLevel, promotes),
        characterId, "character",
        {cons: rank}
    );

    await addTraceGoal(characterId, character.skills);
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

const updateTrace = async (talent: TalentGoal, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
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
    await addGoal(talentNew)
}

export const batchUpdateTrace = async (all: boolean, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    if (coreGoal > 6) {
        coreGoal = 6
    }
    await batchUpdateGoals<TalentGoal>(
        'talent',
        'character', // 天赋目标用character字段标识
        (trace) => updateTrace(trace, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal),
        all
    );
}


export const batchUpdateCharacter = async (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<CharacterGoal>(
        'character',
        'character', // 角色目标用character字段标识
        updateCharacter,
        all,
        characterStatusGoal
    ).then(() => {
        console.log("角色更新完成");
    });
}

export const batchUpdateWeapon = async (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<WeaponGoal>(
        'weapon',
        'id', // 武器 inactive 标识用 goal.id（与 seelie getInactiveConfig / computeInactive 一致）
        (weapon) => updateCharacter(weapon as unknown as CharacterGoal, characterStatusGoal),
        all,
        characterStatusGoal
    ).then(() => {
        console.log("武器更新完成");
    });
}
