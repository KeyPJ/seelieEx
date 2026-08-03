import Goal = seelie.HSRGoal;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.HSRCharacterGoal;
import SkillStatus = seelie.SkillStatus;

import {getCharacterId, getWeaponId, getCharacterPath} from "./query";
import HSRCharacterData = mihoyo.HSRCharacterData;
import ConeGoal = seelie.HSRConeGoal;
import TraceGoal = seelie.HSRTraceGoal;
import Bonus = seelie.Bonus;
import {
    addGoal,
    batchUpdateGoals,
    getNextId,
    getTotalGoal,
    updateCharacter,
} from "../common";
let initBonus = {} as Bonus

const addTraceGoal = async (talentCharacter: string, skill_list: mihoyo.HSRSkill[], skills_servant: mihoyo.HSRSkill[]) => {
    const totalGoal = await getTotalGoal() as Goal[];
    const talentIdx = totalGoal.findIndex(g => g.type == "trace" && g.character == talentCharacter);
    // 按 point_type 筛选：type=2 是 4 个战斗技能，type=4 是欢愉技
    const combatSkills = skill_list.filter(s => s.point_type === 2).sort((a, b) => parseInt(a.point_id) - parseInt(b.point_id));
    const elationSkill = skill_list.find(s => s.point_type === 4);
    const [baseCurrent, skillCurrent, ultimateCurrent, talentCurrent] = combatSkills.map(a => a.cur_level);
    const elationCurrent = elationSkill?.cur_level;
    let [petSkillCurrent, petTalentCurrent] = [1, 1]
    let hasServant = skills_servant && skills_servant.length > 0;
    if (hasServant) {
        [petSkillCurrent, petTalentCurrent] = skills_servant.map(a => a.cur_level);
    }
    // 依据角色命途（pageItems 运行时目录 path）判定忆灵/欢愉是否适用：
    // 非对应命途的角色，pet_skill/pet_talent/elation_skill 不初始化（不留 1/1 占位），
    // 与批量修改 batchUpdateTrace 的 path 守卫保持一致。
    const path = getCharacterPath(talentCharacter);
    const isRemembrance = path === "remembrance"; // 忆灵技 / 忆灵天赋
    const isElation = path === "elation";          // 欢愉技
    let talentGoal: TraceGoal;
    if (talentIdx < 0) {
        const id = await getNextId();
        talentGoal = {
            type: "trace",
            character: talentCharacter,
            basic: {
                current: baseCurrent,
                goal: baseCurrent
            },
            skill: {
                current: skillCurrent,
                goal: skillCurrent
            },
            ultimate: {
                current: ultimateCurrent,
                goal: ultimateCurrent
            },
            talent: {
                current: talentCurrent,
                goal: talentCurrent
            },
            bonus: initBonus,
            id,
            ...(isRemembrance ? {
                pet_skill: {
                    current: petSkillCurrent,
                    goal: petSkillCurrent
                },
                pet_talent: {
                    current: petTalentCurrent,
                    goal: petTalentCurrent
                },
            } : {}),
            ...(isElation ? {
                elation_skill: {
                    current: elationCurrent ?? 1,
                    goal: elationCurrent ?? 1
                },
            } : {}),
        }
    } else {
        const seelieGoal = totalGoal[talentIdx] as TraceGoal;
        const {basic, skill, ultimate, talent} = seelieGoal;
        const {goal: basicGoal} = basic;
        const {goal: skillGoal} = skill;
        const {goal: ultimateGoal} = ultimate;
        const {goal: talentGoal2} = talent;
        // 安全读取既有 pet/elation goal（可能不存在，因为按 path 初始化时跳过了）
        const petSkillGoal = seelieGoal.pet_skill?.goal ?? 1;
        const petTalentGoal = seelieGoal.pet_talent?.goal ?? 1;
        const elationGoal = seelieGoal.elation_skill?.goal ?? 1;
        talentGoal = {
            ...seelieGoal,
            basic: {
                current: baseCurrent,
                goal: baseCurrent > basicGoal ? Math.min(baseCurrent, 6) : basicGoal
            }, skill: {
                current: skillCurrent,
                goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
            }, ultimate: {
                current: ultimateCurrent,
                goal: ultimateCurrent > ultimateGoal ? ultimateCurrent : ultimateGoal
            }, talent: {
                current: talentCurrent,
                goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
            },
            ...(isRemembrance ? {
                pet_skill: {
                    current: petSkillCurrent,
                    goal: petSkillCurrent > petSkillGoal ? Math.min(petSkillCurrent, 6) : petSkillGoal
                },
                pet_talent: {
                    current: petTalentCurrent,
                    goal: petTalentCurrent > petTalentGoal ? Math.min(petTalentCurrent, 6) : petTalentGoal
                },
            } : {}),
            ...(isElation ? {
                elation_skill: {
                    current: elationCurrent ?? 1,
                    goal: (elationCurrent ?? 1) > elationGoal ? Math.min(elationCurrent ?? 1, 10) : elationGoal
                }
            } : {}),
        }
    }
    await addGoal(talentGoal)
};

export const addCharacterGoal = async (level_current: number, nameEn: String, name: string, type: string, eidolon?: number) => {
    const totalGoal = await getTotalGoal() as Goal[];
    let characterPredicate = (g: Goal) => g.type == type && g.character == nameEn;
    let weaponPredicate = (g: Goal) => g.type == type && g.cone == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus: CharacterStatus = initCharacterStatus(level_current);
    let characterGoal: Goal

    function initCharacterGoal(id: number) {

        return {
            type,
            character: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id,
            eidolon: eidolon ?? 0
        } as CharacterGoal
    }

    function initWeaponGoal(id: number) {

        return {
            type,
            character: "",
            cone: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id
        } as ConeGoal
    }

    if (characterIdx < 0) {
        const id = await getNextId();
        characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
        const seelieGoal = type == "character" ? totalGoal[characterIdx] as CharacterGoal : totalGoal[characterIdx] as ConeGoal
        const {goal, current} = seelieGoal;
        const {level: levelCurrent, asc: ascCurrent} = current;
        const {level: levelGoal, asc: ascGoal} = goal;
        const {level, asc} = characterStatus;

        const merged: any = {
            ...seelieGoal,
            current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
            goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal,
        };
        // 命座只增不减（光锥无 eidolon 字段，不注入）
        if (type == "character" && (eidolon !== undefined || (seelieGoal as CharacterGoal).eidolon !== undefined)) {
            merged.eidolon = Math.max((seelieGoal as CharacterGoal).eidolon ?? 0, eidolon ?? 0);
        }
        characterGoal = merged as CharacterGoal;
    }
    await addGoal(characterGoal)
};

export async function addCharacter(characterDataEx: HSRCharacterData) {

    const {avatar: character, skills: skill_list, skills_servant, equipment: weapon} = characterDataEx;
    const {item_name: name, item_id: itemId, rank} = character;

    if (weapon) {
        const {item_name: weaponName, item_id: weaponItemId, cur_level: weaponLeveL} = weapon;
        // 米游社 item_id 为字符串（如 "23060"），运行时目录 id 为数字，反查前必须 parseInt
        const weaponId = getWeaponId({id: parseInt(weaponItemId)});
        if (weaponId) {
            await addCharacterGoal(weaponLeveL, weaponId, weaponName, "cone");
        }
    }
    const {cur_level: characterLevel} = character;
    const characterId = getCharacterId({id: parseInt(itemId)});
    // 开拓者一律跳过（沿用既有行为）。运行时目录 5 条开拓者的 id 是男主(8001/8003/8005/8007/8009)、
    // alt_id 是女主(8002/8004/8006/8008/8010)；getIdMap 只映射 entry.id，
    // 故女主号的 item_id 反查为空串，而男主号会命中 trailblazer_* ——必须保留 includes 兜底才能性别无关地跳过。
    if (!characterId || characterId.includes("trailblazer")) {
        return
    }
    // 命座：detail 的 avatar.rank 是字符串（如 "0"），转数字后交由 addCharacterGoal 做「只增不减」合并
    const eidolon = parseInt(rank ?? "") || 0;
    await addCharacterGoal(characterLevel, characterId, name, "character", eidolon);

    await addTraceGoal(characterId, skill_list, skills_servant);

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
    {level: 60, asc: 5, text: "60 A"},
    {level: 70, asc: 5, text: "70"},
    {level: 70, asc: 6, text: "70 A"},
    {level: 80, asc: 6, text: "80"},
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
const updateTrace = async (talent: TraceGoal, normalGoal = 6, skillGoal = 9, burstGoal = 9, talentGoal2 = 9, petSkillGoal = 0, petTalentGoal = 0, elationGoal = 0) => {
    const {
        basic: {current: basicCurrent},
        skill: {current: skillCurrent},
        ultimate: {current: ultimateCurrent},
        talent: {current: talentCurrent}
    } = talent;
    // 依据角色命途（pageItems 运行时目录 data.characters[key].path）精确判定忆灵/欢愉是否适用，
    // 而非依赖 current 近似值：只有对应命途的角色才对该类目标生效。
    const path = getCharacterPath(talent.character);
    const isRemembrance = path === "remembrance"; // 忆灵技 / 忆灵天赋（pet_skill / pet_talent）
    const isElation = path === "elation";          // 欢愉技（elation_skill）
    // 仅当：勾选了上限(cap>0) 且 该角色确属对应命途(applicable) 时，才把目标设为 max(current, cap)；
    // 其余情况（未勾选 / 非对应命途角色）一律保持原值不动。
    const applyExtra = (skill: SkillStatus | undefined, goalCap: number, applicable: boolean): SkillStatus => {
        if (!goalCap || !applicable || !skill) return skill as SkillStatus;
        const cur = skill.current;
        return {current: cur, goal: cur > goalCap ? cur : goalCap};
    };
    const talentNew = {
        ...talent,
        basic: {
            current: basicCurrent,
            goal: basicCurrent > normalGoal ? basicCurrent : normalGoal
        }, skill: {
            current: skillCurrent,
            goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
        }, ultimate: {
            current: ultimateCurrent,
            goal: ultimateCurrent > burstGoal ? ultimateCurrent : burstGoal
        }, talent: {
            current: talentCurrent,
            goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
        },
        pet_skill: applyExtra(talent.pet_skill, petSkillGoal, isRemembrance),
        pet_talent: applyExtra(talent.pet_talent, petTalentGoal, isRemembrance),
        elation_skill: applyExtra(talent.elation_skill, elationGoal, isElation),
    }
    await addGoal(talentNew)
}

export const batchUpdateTrace = async (all: boolean, normal: number, skill: number, burst: number, t: number, petSkill = 0, petTalent = 0, elation = 0) => {
    if (normal > 6) {
        normal = 6
    }
    await batchUpdateGoals<TraceGoal>(
        'trace',
        'character', // 天赋目标用character字段标识
        (trace) => updateTrace(trace, normal, skill, burst, t, petSkill, petTalent, elation),
        all
    );

}


export const batchUpdateCharacter = async (all: boolean, characterStatusGoal: CharacterStatus,) => {
     batchUpdateGoals<CharacterGoal>(
        'character',
        'character',
        updateCharacter,
        all,
        characterStatusGoal
    ).then(() => {
        console.log("角色更新完成");
    });
}

export const batchUpdateWeapon = async (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<ConeGoal>(
        'cone',
        'cone',
        (weapon) => updateCharacter(weapon as unknown as CharacterGoal, characterStatusGoal),
        all,
        characterStatusGoal
    ).then(() => {
        console.log("武器更新完成");
    });
}
