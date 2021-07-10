import Goal = seelie.Goal;
import {mohoyo} from "./@type/mohoyo";
import CharacterDataEx = mohoyo.CharacterDataEx;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.CharacterGoal;
import TalentGoal = seelie.TalentGoal;
import {getElementAttrName} from "./query";


const getTotalGoal = () => {
    // @ts-ignore
    const goals: Goal[] = vue.goals;
    return goals;
};

export function addCharacter(characterDataEx: CharacterDataEx) {

    const {character, skill_list} = characterDataEx;
    const {name, nameEn, element_attr_id} = character;

    //{"type":"character","character":"traveler","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"talent","character":"traveler_geo","c3":false,"c5":false,"normal":{"current":1,"goal":6},"skill":{"current":1,"goal":6},"burst":{"current":1,"goal":6},"id":2}


    let totalGoal: Goal[] = getTotalGoal();
    const length = totalGoal.length;
    const characterIdx = totalGoal.findIndex(g => g.type == "character" && g.character == nameEn);
    const {level_current} = character;
    const characterStatus: CharacterStatus = initCharacterStatus(level_current, name);

    let characterGoal: CharacterGoal
    if (characterIdx < 0) {
        characterGoal = {
            type: "character",
            character: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id: length
        }
    } else {
        const seelieGoal: Goal = totalGoal[characterIdx];
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
    vue.addGoal(characterGoal)

    let talentCharacter = nameEn;
    if (nameEn == "traveler") {
        const elementAttrName = getElementAttrName(element_attr_id);
        talentCharacter = `traveler_${elementAttrName}`;
    }

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
            id: length
        }
    } else {
        const seelieGoal: TalentGoal = totalGoal[talentIdx];
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
