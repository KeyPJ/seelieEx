import Goal = seelie.Goal;
import {mohoyo} from "./@type/mohoyo";
import CharacterDataEx = mohoyo.CharacterDataEx;
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

const addTalentGoal = (talentCharacter: string, skill_list: mohoyo.Skill[]) => {
    const totalGoal: Goal[] = getTotalGoal();
    const ids = totalGoal.map(g=>g.id);
    const id = Math.max(...ids) + 1 || 1;
    const talentIdx = totalGoal.findIndex(g => g.type == "talent" && g.character == talentCharacter);
    const {level_current: normalCurrent} = skill_list[0];
    const {level_current: skillCurrent} = skill_list[1];
    const {level_current: burstCurrent} = skill_list[2];

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
    const ids = totalGoal.map(g=>g.id);
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
            character:"",
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
        const {goal} = seelieGoal;
        const {level, asc} = goal;
        const {level: levelCurrent, asc: ascCurrent} = characterStatus;

        characterGoal = {
            ...seelieGoal,
            current: characterStatus,
            goal: levelCurrent >= level && ascCurrent >= asc ? characterStatus : goal,
        }
    }
    // @ts-ignore
    type == "character" ?vue.addGoal(characterGoal as CharacterGoal):vue.addGoal(characterGoal as WeaponGoal)
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
        console.log(weaponId,name);
        if (weaponId) {
            addCharacterGoal(weaponLeveL, weaponId, name, "weapon");
        }
    }
    const {level_current: characterLevel} = character;
    const characterId = getCharacterId(name);
    if (!characterId){
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

function initCharacterStatus(level_current: number, name: string) {
    let initCharacterStatus = characterStatusList[0];
    let initLevel = 1;
    for (let characterStatus of characterStatusList) {
        const {level} = characterStatus;
        if (level_current >= level) {
            initLevel = level
            initCharacterStatus = characterStatus
            continue
        }
        if (initLevel == level) {
            console.log(`米游社数据无法判断是否突破,请自行比较${name}是否已突破`)
            return characterStatus
        } else {
            return initCharacterStatus;
        }
    }
    return initCharacterStatus;
}


