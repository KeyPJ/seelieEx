import Goal = seelie.GIGoal;
import CharacterDataEx = mihoyo.CharacterDataEx;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.GICharacterGoal;
import TalentGoal = seelie.GITalentGoal;
import WeaponGoal = seelie.GIWeaponGoal;
import {getCharacterId, getWeaponId} from "./query";
import {
    batchUpdateGoals,
    getNextId,
    getTotalGoal,
    setGoals
} from "../common";

const addGoal = async (data: any) => {
    let index: number = -1;
    const goals = await getTotalGoal();

    if (data.character) {
        index = goals.findIndex(
            (g: any) => g.character === data.character && g.type === data.type
        );
    }
    // character 未命中但自身携带已有 id 时按 id 回落。
    // 旧版武器目标的 character 为 ""，迁移写回时 character 已被改成 owner，
    // 只有按 id 才能原地更新旧条目，否则会新插一条、旧孤儿依旧残留。
    // 新建目标走 getNextId()（恒为 max+1），不会误命中已有条目。
    if (index < 0 && typeof data.id === "number") {
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
    await setGoals(goals);
};

const TALENT_KEYS = ["normal", "skill", "burst"] as const;

const addTalentGoal = async (talentCharacter: string, skill_list: mihoyo.Skill[]) => {
    const totalGoal = await getTotalGoal() as Goal[];
    const talentIdx = totalGoal.findIndex(g => g.type == "talent" && g.character == talentCharacter);
    // max_level == 10 的恰好 3 条为战斗天赋，接口顺序即 普攻 -> 战技 -> 爆发；其余 max_level == 1 为被动/命座技，过滤掉
    const combat = (skill_list ?? []).filter(s => s.max_level === 10);
    if (combat.length !== TALENT_KEYS.length) {
        console.warn(`[角色同步] ${talentCharacter} 战斗天赋数量异常: ${combat.length}`, combat);
    }
    const lv: Record<string, number> = {};
    combat.slice(0, TALENT_KEYS.length).forEach((s, i) => {
        lv[TALENT_KEYS[i]] = s.level_current;
    });
    const normalCurrent = lv.normal ?? 1, skillCurrent = lv.skill ?? 1, burstCurrent = lv.burst ?? 1;
    let talentGoal: TalentGoal;
    if (talentIdx < 0) {
        const id = await getNextId();
        talentGoal = {
            type: "talent",
            character: talentCharacter,
            c3: false,
            c5: false,
            normal: {
                current: normalCurrent,
                goal: normalCurrent
            },
            skill: {
                current: skillCurrent,
                goal: skillCurrent
            },
            burst: {
                current: burstCurrent,
                goal: burstCurrent
            },
            id
        }
    } else {
        const seelieGoal = totalGoal[talentIdx] as TalentGoal;
        const {normal, skill, burst} = seelieGoal;
        const {goal: normalGoal} = normal;
        const {goal: skillGoal} = skill;
        const {goal: burstGoal} = burst;
        talentGoal = {
            ...seelieGoal,
            normal: {
                current: normalCurrent,
                goal: normalCurrent > normalGoal ? normalCurrent : normalGoal
            }, skill: {
                current: skillCurrent,
                goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
            }, burst: {
                current: burstCurrent,
                goal: burstCurrent > burstGoal ? burstCurrent : burstGoal
            }
        }
    }
    await addGoal(talentGoal)
};

export const addCharacterGoal = async (
    status: CharacterStatus,
    nameEn: string,
    type: "character" | "weapon",
    extra?: { cons?: number; owner?: string }
) => {
    const totalGoal = await getTotalGoal() as Goal[];
    const owner = extra?.owner ?? "";
    const characterPredicate = (g: Goal) => g.type == type && g.character == nameEn;
    // 武器按「所属角色」去重（与原站一致）：换武器即更新该角色的武器目标，而不是残留旧武器
    const weaponPredicate = (g: Goal) => g.type == "weapon" && g.character == owner;
    // 旧版兼容：老数据的武器目标写的是 character: ""（按武器名去重），owner 谓词永远命中不了，
    // 会给老用户多留一条孤儿目标。owner 未命中时按「空 character + 同武器名」回捞旧条目，
    // 合并时把 character 回填成 owner，完成一次性迁移。
    // 注意顺序：必须 owner 优先、legacy 兜底，否则「孤儿 + 新条目」并存时会命中孤儿，
    // 导致 addGoal 把孤儿的 id 覆盖到新条目上，产生重复 id。
    const legacyWeaponPredicate = (g: Goal) => g.type == "weapon" && !g.character && g.weapon == nameEn;
    let characterIdx: number;
    if (type == "character") {
        characterIdx = totalGoal.findIndex(characterPredicate);
    } else {
        characterIdx = totalGoal.findIndex(weaponPredicate);
        if (characterIdx < 0) {
            characterIdx = totalGoal.findIndex(legacyWeaponPredicate);
        }
    }
    let characterGoal: Goal

    function initCharacterGoal(id: number) {

        return {
            type,
            character: nameEn,
            current: status,
            goal: {...status},
            ...(extra?.cons !== undefined ? {cons: extra.cons} : {}),
            id
        } as CharacterGoal
    }

    function initWeaponGoal(id: number) {

        return {
            type,
            character: owner,
            weapon: nameEn,
            current: status,
            goal: {...status},
            id
        } as WeaponGoal
    }

    if (characterIdx < 0) {
        const id = await getNextId();
        characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
        const oldGoal = (totalGoal[characterIdx] as CharacterGoal | WeaponGoal).goal;
        // goal 逐字段取 max 后 snap 回合法档位，避免出现 (90, 4) 这类非法组合
        const goalLevel = Math.max(oldGoal.level, status.level);
        const goalAsc = Math.min(Math.max(oldGoal.asc, status.asc), 6);
        const goal = characterStatusList.find(s => s.level === goalLevel && s.asc === goalAsc) ?? oldGoal;

        if (type == "character") {
            const old = totalGoal[characterIdx] as CharacterGoal;
            const next: CharacterGoal = {
                ...old,
                character: nameEn,
                current: status,
                goal: {...goal},
            };
            if (extra?.cons !== undefined || old.cons !== undefined) {
                // 命座只增不减
                next.cons = Math.max(old.cons ?? 0, extra?.cons ?? 0);
            }
            characterGoal = next;
        } else {
            const old = totalGoal[characterIdx] as WeaponGoal;
            const next: WeaponGoal = {
                ...old,
                character: owner,
                weapon: nameEn,
                current: status,
                goal: {...goal},
            };
            characterGoal = next;
        }
    }
    await addGoal(characterGoal)
};

export async function addCharacter(characterDataEx: CharacterDataEx) {

    const {character, skill_list, weapon} = characterDataEx;

    //{"type":"character","character":"traveler","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"weapon","weapon":""deathmatch"","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"talent","character":"traveler_geo","c3":false,"c5":false,"normal":{"current":1,"goal":6},"skill":{"current":1,"goal":6},"burst":{"current":1,"goal":6},"id":2}

    // 传整个角色对象（含数字米游社 id）：用 id 在运行时目录反查；
    // 旅行者(id=0)无有效 id，getCharacterId 返回空串，下面 if 直接 return 跳过。
    const characterId = getCharacterId(character);
    if (!characterId) {
        return
    }
    // 角色：突破档直接用接口的 promote_level，命座用 constellation_num
    await addCharacterGoal(
        resolveStatus(character.level_current, character.promote_level),
        characterId, "character",
        {cons: character.constellation_num}
    );

    if (weapon) {
        // 传整个武器对象（含数字米游社 id 与中文名），优先用 id 在运行时目录反查。
        const weaponId = getWeaponId(weapon);
        if (weaponId) {
            // 武器突破继续由 level_current 推导（weapon_level 是随稀有度变化的 promotion 阶，不能当 asc）
            await addCharacterGoal(
                resolveStatus(weapon.level_current),
                weaponId, "weapon", {owner: characterId}
            );
        }
    }

    await addTalentGoal(characterId, skill_list);

}

export const characterStatusList: CharacterStatus[] = [
    {level: 1, asc: 0, text: "1"},
    {level: 20, asc: 0, text: "20"},
    {level: 20, asc: 1, text: "20 A"},
    {level: 40, asc: 1, text: "40"},
    {level: 40, asc: 2, text: "40 A"},
    {level: 50, asc: 2, text: "50"},
    {level: 50, asc: 3, text: "50 A"},
    {level: 60, asc: 3, text: "60"},
    {level: 60, asc: 4, text: "60 A"},
    {level: 70, asc: 4, text: "70"},
    {level: 70, asc: 5, text: "70 A"},
    {level: 80, asc: 5, text: "80"},
    {level: 80, asc: 6, text: "80 A"},
    {level: 90, asc: 6, text: "90"},
]

/**
 * 由等级 + 突破档解析出唯一档位。
 * 同一等级存在「未突破 / 已突破」两档（如 80 与 80 A），有 promote 时精确命中，
 * 没有 promote（武器）时退回未突破档，与官方站推导一致。
 */
const resolveStatus = (level: number, promote?: number): CharacterStatus => {
    const closest = characterStatusList.filter(s => s.level <= level).pop() ?? characterStatusList[0];
    const candidates = characterStatusList.filter(s => s.level === closest.level);
    const hit = typeof promote === "number" ? candidates.find(s => s.asc === promote) : undefined;
    return {...(hit ?? candidates[0])};
};

const updateTalent = async (talent: TalentGoal, normalGoal = 9, skillGoal = 9, burstGoal = 9) => {
    const {normal: {current: normalCurrent}, skill: {current: skillCurrent}, burst: {current: burstCurrent}} = talent;
    const talentNew = {
        ...talent,
        normal: {
            current: normalCurrent,
            goal: normalCurrent > normalGoal ? normalCurrent : normalGoal
        }, skill: {
            current: skillCurrent,
            goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
        }, burst: {
            current: burstCurrent,
            goal: burstCurrent > burstGoal ? burstCurrent : burstGoal
        }
    }
    await addGoal(talentNew)
}

export const batchUpdateTalent = async (all: boolean, normal: number, skill: number, burst: number) => {
    await batchUpdateGoals<TalentGoal>(
        'talent',
        'character', // 天赋目标用character字段标识
        (talent) => updateTalent(talent, normal, skill, burst),
        all
    );
}


const updateCharacter = async (character: CharacterGoal, characterStatusGoal: CharacterStatus) => {
    const {current} = character;
    const {level: levelCurrent, asc: ascCurrent} = current;
    const {level, asc} = characterStatusGoal;

    const characterGoalNew = {
        ...character,
        goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current,
    }
    await addGoal(characterGoalNew)
}

export const batchUpdateCharacter: (all: boolean, characterStatusGoal: seelie.CharacterStatus) => void = async (all: boolean, characterStatusGoal: CharacterStatus,) => {
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

export const batchUpdateWeapon: (all: boolean, characterStatusGoal: seelie.CharacterStatus) => void = async (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<WeaponGoal>(
        'weapon',
        'weapon', // 武器目标用weapon字段标识
        (weapon) => updateCharacter(weapon as unknown as CharacterGoal, characterStatusGoal),
        all,
        characterStatusGoal
    ).then(() => {
        console.log("武器更新完成");
    });
}
