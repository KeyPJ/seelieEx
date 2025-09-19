import Goal = seelie.GIGoal;
import CharacterDataEx = mihoyo.CharacterDataEx;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.GICharacterGoal;
import TalentGoal = seelie.GITalentGoal;
import WeaponGoal = seelie.GIWeaponGoal;
import {getCharacterId, getElementAttrName, getWeaponId} from "./query";
import {
    batchUpdateGoals,
    getNextId,
    getTotalGoal,
    setGoals
} from "../common";

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

const addTalentGoal = (talentCharacter: string, skill_list: mihoyo.Skill[]) => {
    const totalGoal = getTotalGoal() as Goal[];
    const talentIdx = totalGoal.findIndex(g => g.type == "talent" && g.character == talentCharacter);
    const [normalCurrent, skillCurrent, burstCurrent] = skill_list.filter(a => a.max_level == 10).sort().map(a => a.level_current)
    let talentGoal: TalentGoal;
    if (talentIdx < 0) {
        const id = getNextId();
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
    addGoal(talentGoal)
};

export const addCharacterGoal = (level_current: number, nameEn: String, name: string, type: string) => {
    let totalGoal = getTotalGoal() as Goal[];
    let characterPredicate = (g: Goal) => g.type == type && g.character == nameEn;
    let weaponPredicate = (g: Goal) => g.type == type && g.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus: CharacterStatus = initCharacterStatus(level_current);
    let characterGoal: Goal

    function initCharacterGoal(id: number) {

        return {
            type,
            character: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id
        } as CharacterGoal
    }

    function initWeaponGoal(id: number) {

        return {
            type,
            character: "",
            weapon: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id
        } as WeaponGoal
    }

    if (characterIdx < 0) {
        const id = getNextId();
        characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
        const seelieGoal = type == "character" ? totalGoal[characterIdx] as CharacterGoal : totalGoal[characterIdx] as WeaponGoal
        const {goal, current} = seelieGoal;
        const {level: levelCurrent, asc: ascCurrent} = current;
        const {level: levelGoal, asc: ascGoal} = goal;
        const {level, asc} = characterStatus;

        characterGoal = {
            ...seelieGoal,
            current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
            goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal,
        }
    }
    addGoal(characterGoal)
};

export function addCharacter(characterDataEx: CharacterDataEx) {

    const {character, skill_list, weapon} = characterDataEx;
    const {name, element_attr_id} = character;

    //{"type":"character","character":"traveler","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"weapon","weapon":""deathmatch"","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"talent","character":"traveler_geo","c3":false,"c5":false,"normal":{"current":1,"goal":6},"skill":{"current":1,"goal":6},"burst":{"current":1,"goal":6},"id":2}

    if (weapon) {
        const {name, level_current: weaponLeveL} = weapon;
        const weaponId = getWeaponId(name);
        if (weaponId) {
            addCharacterGoal(weaponLeveL, weaponId, name, "weapon");
        }
    }
    const {level_current: characterLevel} = character;
    const characterId = getCharacterId(name);
    if (!characterId) {
        return
    }
    addCharacterGoal(characterLevel, characterId, name, "character");

    let talentCharacter = characterId;
    if (characterId == "traveler") {
        const elementAttrName = getElementAttrName(element_attr_id);
        talentCharacter = `traveler_${elementAttrName}`;
    }
    addTalentGoal(talentCharacter, skill_list);

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

const updateTalent = (talent: TalentGoal, normalGoal = 9, skillGoal = 9, burstGoal = 9) => {
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
    addGoal(talentNew)
}

export const batchUpdateTalent = (all: boolean, normal: number, skill: number, burst: number) => {
    batchUpdateGoals<TalentGoal>(
        'talent',
        'character', // 天赋目标用character字段标识
        (talent) => updateTalent(talent, normal, skill, burst),
        all
    );
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

export const batchUpdateCharacter: (all: boolean, characterStatusGoal: seelie.CharacterStatus) => void = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<CharacterGoal>(
        'character',
        'character', // 角色目标用character字段标识
        updateCharacter,
        all,
        characterStatusGoal
    );
}

export const batchUpdateWeapon: (all: boolean, characterStatusGoal: seelie.CharacterStatus) => void = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<WeaponGoal>(
        'weapon',
        'weapon', // 武器目标用weapon字段标识
        (weapon) => updateCharacter(weapon as unknown as CharacterGoal, characterStatusGoal),
        all,
        characterStatusGoal
    );
}
