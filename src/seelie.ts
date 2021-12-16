import Goal = seelie.Goal;
import {mihoyo} from "./@type/mihoyo";
import CharacterDataEx = mihoyo.CharacterDataEx;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.CharacterGoal;
import TalentGoal = seelie.TalentGoal;
import {getCharacterId, getElementAttrName, getWeaponId} from "./query";
import WeaponGoal = seelie.WeaponGoal;


export const getTotalGoal = () => {
    // @ts-ignore
    const goals: Goal[] = vue.goals;
    return goals;
};

const addTalentGoal = (talentCharacter: string, skill_list: mihoyo.Skill[]) => {
    const totalGoal: Goal[] = getTotalGoal();
    const ids = totalGoal.map(g => g.id);
    const id = Math.max(...ids) + 1 || 1;
    const talentIdx = totalGoal.findIndex(g => g.type == "talent" && g.character == talentCharacter);
    const [normalCurrent, skillCurrent, burstCurrent] = skill_list.filter(a => a.max_level == 10).sort().map(a => a.level_current)
    console.log(talentCharacter, [normalCurrent, skillCurrent, burstCurrent])
    let talentGoal: TalentGoal;
    if (talentIdx < 0) {
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
    // @ts-ignore
    vue.addGoal(talentGoal)
};

export const addCharacterGoal = (level_current: number, nameEn: String, name: string, type: string) => {
    let totalGoal: Goal[] = getTotalGoal();
    const ids = totalGoal.map(g => g.id);
    const id = Math.max(...ids) + 1 || 1;
    let characterPredicate = (g: Goal) => g.type == type && g.character == nameEn;
    let weaponPredicate = (g: Goal) => g.type == type && g.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus: CharacterStatus = initCharacterStatus(level_current, name);

    let characterGoal: Goal

    function initCharacterGoal() {
        return {
            type,
            character: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id
        } as CharacterGoal
    }

    function initWeaponGoal() {
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
        characterGoal = type == "character" ? initCharacterGoal() : initWeaponGoal();
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
    // @ts-ignore
    type == "character" ? vue.addGoal(characterGoal as CharacterGoal) : vue.addGoal(characterGoal as WeaponGoal)
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
        console.log(weaponId, name);
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

const characterStatusList: CharacterStatus[] = [
    {level: 1, asc: 0, text: "1"},
    {level: 20, asc: 0, text: "20"},
    {level: 40, asc: 1, text: "40"},
    {level: 50, asc: 2, text: "50"},
    {level: 60, asc: 3, text: "60"},
    {level: 70, asc: 4, text: "70"},
    {level: 80, asc: 5, text: "80"},
    {level: 90, asc: 6, text: "90"},
]

const initCharacterStatus = (level_current: number, name: string) => {
    let initCharacterStatus = characterStatusList[0];
    if (level_current < 20) {
        return initCharacterStatus;
    }
    for (let characterStatus of characterStatusList) {
        const {level} = characterStatus;
        if (level_current < level) {
            const {asc, text} = initCharacterStatus
            return {
                ...initCharacterStatus,
                asc: asc + 1,
                text: `${text} A`
            }
        } else if (level_current == level) {
            if (level_current != 90) {
                console.log(`米游社数据无法判断是否突破,请自行比较${name}是否已突破`)
            }
            return characterStatus;
        } else if (level_current >= level) {
            initCharacterStatus = characterStatus
        }
    }
    return initCharacterStatus;
};
