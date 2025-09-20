import Goal = seelie.HSRGoal;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.HSRCharacterGoal;

import {getCharacterId, getWeaponId} from "./query";
import HSRCharacterData = mihoyo.HSRCharacterData;
import ConeGoal = seelie.HSRConeGoal;
import TraceGoal = seelie.HSRTraceGoal;
import Bonus = seelie.Bonus;
import {
    batchUpdateGoals,
    getNextId,
    getTotalGoal,
    setGoals
} from "../common";

const addGoal = (data: any) => {
    let index: number = -1;
    const goals = getTotalGoal() as Goal[];

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

const addTraceGoal = (talentCharacter: string, skill_list: mihoyo.HSRSkill[], skills_servant: mihoyo.HSRSkill[]) => {
    const totalGoal = getTotalGoal() as Goal[];
    const talentIdx = totalGoal.findIndex(g => g.type == "trace" && g.character == talentCharacter);
    skill_list.sort((a, b) => a.point_id > b.point_id ? 1 : 0);
    const [baseCurrent, skillCurrent, ultimateCurrent, talentCurrent] = skill_list.map(a => a.cur_level);
    let [petSkillCurrent, petTalentCurrent] = [1, 1]
    let hasServant = skills_servant && skills_servant.length > 0;
    if (hasServant) {
        [petSkillCurrent, petTalentCurrent] = skills_servant.map(a => a.cur_level);
    }
    let talentGoal: TraceGoal;
    if (talentIdx < 0) {
        const id = getNextId();
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
            pet_skill: {
                current: petSkillCurrent,
                goal: petSkillCurrent
            },
            pet_talent: {
                current: petSkillCurrent,
                goal: petSkillCurrent
            },
            bonus: initBonus,
            id
        }
    } else {
        const seelieGoal = totalGoal[talentIdx] as TraceGoal;
        const {basic, skill, ultimate, talent, pet_skill, pet_talent} = seelieGoal;
        const {goal: basicGoal} = basic;
        const {goal: skillGoal} = skill;
        const {goal: ultimateGoal} = ultimate;
        const {goal: talentGoal2} = talent;
        const {goal: petSkillGoal} = pet_skill;
        const {goal: petTalentGoal} = pet_talent;
        talentGoal = {
            ...seelieGoal,
            basic: {
                current: baseCurrent,
                goal: baseCurrent > basicGoal ? Math.min(petSkillCurrent, 6) : basicGoal
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
            pet_skill: {
                current: petSkillCurrent,
                goal: petSkillCurrent > petSkillGoal ? Math.min(petSkillCurrent, 6) : petSkillGoal
            },
            pet_talent: {
                current: petTalentCurrent,
                goal: petTalentCurrent > petTalentGoal ? Math.min(petTalentCurrent, 6) : petTalentGoal
            }
        }
    }
    addGoal(talentGoal)
};

export const addCharacterGoal = (level_current: number, nameEn: String, name: string, type: string) => {
    const totalGoal = getTotalGoal() as Goal[];
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
            eidolon: 0
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
        const id = getNextId();
        characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
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

    const {avatar: character, skills: skill_list, skills_servant, equipment: weapon} = characterDataEx;
    const {item_name: name} = character;

    //{"type":"character","character":"traveler","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"weapon","weapon":""deathmatch"","current":{"level":70,"asc":4,"text":"70"},"goal":{"level":70,"asc":4,"text":"70"},"id":1},
    //{"type":"talent","character":"traveler_geo","c3":false,"c5":false,"normal":{"current":1,"goal":6},"skill":{"current":1,"goal":6},"burst":{"current":1,"goal":6},"id":2}

    //hsr
    //{"type":"character","character":"seele","cons":0,"current":{"level":60,"asc":4,"text":"60"},"goal":{"level":70,"asc":5,"text":"70"},"id":1}
    //{"type":"cone","id":6,"cone":"but_the_battle_isnt_over","current":{"level":80,"asc":6,"text":"80"},"goal":{"level":80,"asc":6,"text":"80"}}
    //{
    //   "type": "trace",
    //   "character": "clara",
    //   "basic": {
    //     "current": 6,
    //     "goal": 6
    //   },
    //   "skill": {
    //     "current": 8,
    //     "goal": 8
    //   },
    //   "ultimate": {
    //     "current": 8,
    //     "goal": 8
    //   },
    //   "talent": {
    //     "current": 8,
    //     "goal": 8
    //   },
    //   "bonus": {
    //     "bonus-trace-1-1": {
    //       "type": "a4m",
    //       "done": false
    //     },
    //     "bonus-trace-1-1-1": {
    //       "type": "a4s",
    //       "done": false
    //     },
    //     "bonus-trace-1-1-1-1": {
    //       "type": "a5s",
    //       "done": false
    //     },
    //     "bonus-trace-1-1-1-1-1": {
    //       "type": "a5s",
    //       "done": false
    //     },
    //     "bonus-trace-1-2": {
    //       "type": "a2m",
    //       "done": false
    //     },
    //     "bonus-trace-1-2-1": {
    //       "type": "a2s",
    //       "done": false
    //     },
    //     "bonus-trace-1-2-1-1": {
    //       "type": "a3s",
    //       "done": false
    //     },
    //     "bonus-trace-1-2-1-1-1": {
    //       "type": "a3s",
    //       "done": false
    //     },
    //     "bonus-trace-1-3": {
    //       "type": "a6m",
    //       "done": false
    //     },
    //     "bonus-trace-1-3-1": {
    //       "type": "a6s",
    //       "done": false
    //     },
    //     "bonus-trace-1-3-1-1": {
    //       "type": "l75",
    //       "done": false
    //     },
    //     "bonus-trace-1-3-1-2": {
    //       "type": "l80",
    //       "done": false
    //     },
    //     "bonus-trace-1-4": {
    //       "type": "l1",
    //       "done": false
    //     }
    //   },
    //   "id": 5
    // }

    if (weapon) {
        const {item_name: name, cur_level: weaponLeveL} = weapon;
        const weaponId = getWeaponId(name);
        if (weaponId) {
            addCharacterGoal(weaponLeveL, weaponId, name, "cone");
        }
    }
    const {cur_level: characterLevel} = character;
    const characterId = getCharacterId(name);
    if (!characterId || characterId.includes("trailblazer")) {
        return
    }
    addCharacterGoal(characterLevel, characterId, name, "character");

    addTraceGoal(characterId, skill_list, skills_servant);

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
const updateTrace = (talent: TraceGoal, normalGoal = 6, skillGoal = 9, burstGoal = 9, talentGoal2 = 9) => {
    const {
        basic: {current: basicCurrent},
        skill: {current: skillCurrent},
        ultimate: {current: ultimateCurrent},
        talent: {current: talentCurrent}
    } = talent;
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
    }
    addGoal(talentNew)
}

export const batchUpdateTrace = (all: boolean, normal: number, skill: number, burst: number, t: number) => {
    if (normal > 6) {
        normal = 6
    }
    batchUpdateGoals<TraceGoal>(
        'trace',
        'character', // 天赋目标用character字段标识
        (trace) => updateTrace(trace, normal, skill, burst, t),
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

export const batchUpdateCharacter = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<CharacterGoal>(
        'character',
        'character',
        updateCharacter,
        all,
        characterStatusGoal
    );
}

export const batchUpdateWeapon = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    batchUpdateGoals<ConeGoal>(
        'cone',
        'cone',
        (weapon) => updateCharacter(weapon as unknown as CharacterGoal, characterStatusGoal),
        all,
        characterStatusGoal
    );
}
