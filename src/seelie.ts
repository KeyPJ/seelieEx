import Goal = seelie.Goal;
import CharacterStatus = seelie.CharacterStatus;
import CharacterGoal = seelie.CharacterGoal;

import {getCharacterId, getWeaponId} from "./query";
import HSRCharacterData = mihoyo.HSRCharacterData;
import ConeGoal = seelie.ConeGoal;
import TraceGoal = seelie.TraceGoal;
import Bonus = seelie.Bonus;


const getAccount: () => string = () => localStorage.account || "main";

const getTotalGoal: () => Goal[] = () =>
    JSON.parse(
        localStorage.getItem(`${getAccount()}-goals`) || "[]"
    ) as Goal[];

const getGoalInactive: () => string[] = () =>
    Object.keys(JSON.parse(localStorage.getItem(`${getAccount()}-inactive`) || "{}"));

const setGoals = (goals: any) => {
    // console.log(`${getAccount()}-goals`)
    // console.log(JSON.stringify(goals))
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
        console.log(data);
    }
    setGoals(goals);
};
let initBonus = {
    "bonus-trace-1-1": {
        "type": "a4m",
        "done": false
    },
    "bonus-trace-1-1-1": {
        "type": "a4s",
        "done": false
    },
    "bonus-trace-1-1-1-1": {
        "type": "a5s",
        "done": false
    },
    "bonus-trace-1-1-1-1-1": {
        "type": "a5s",
        "done": false
    },
    "bonus-trace-1-2": {
        "type": "a2m",
        "done": false
    },
    "bonus-trace-1-2-1": {
        "type": "a2s",
        "done": false
    },
    "bonus-trace-1-2-1-1": {
        "type": "a3s",
        "done": false
    },
    "bonus-trace-1-2-1-1-1": {
        "type": "a3s",
        "done": false
    },
    "bonus-trace-1-3": {
        "type": "a6m",
        "done": false
    },
    "bonus-trace-1-3-1": {
        "type": "a6s",
        "done": false
    },
    "bonus-trace-1-3-1-1": {
        "type": "l75",
        "done": false
    },
    "bonus-trace-1-3-1-2": {
        "type": "l80",
        "done": false
    },
    "bonus-trace-1-4": {
        "type": "l1",
        "done": false
    }
} as Bonus

const addTraceGoal = (talentCharacter: string, skill_list: mihoyo.HSRSkill[]) => {
    const totalGoal: Goal[] = getTotalGoal();
    const ids = totalGoal.map(g => g.id);
    const id = Math.max(...ids) + 1 || 1;
    const talentIdx = totalGoal.findIndex(g => g.type == "trace" && g.character == talentCharacter);
    skill_list.sort((a, b) => a.point_id > b.point_id ? 1 : 0);
    const [baseCurrent, skillCurrent, ultimateCurrent, talentCurrent] = skill_list.map(a => a.cur_level)
    let talentGoal: TraceGoal;
    if (talentIdx < 0) {
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
            id
        }
    } else {
        const seelieGoal = totalGoal[talentIdx] as TraceGoal;
        const {basic, skill, ultimate, talent, bonus} = seelieGoal;
        const {goal: basicGoal} = basic;
        const {goal: skillGoal} = skill;
        const {goal: ultimateGoal} = ultimate;
        const {goal: talentGoal2} = talent;
        talentGoal = {
            ...seelieGoal,
            basic: {
                current: baseCurrent,
                goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
            }, skill: {
                current: skillCurrent,
                goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
            }, ultimate: {
                current: ultimateCurrent,
                goal: ultimateCurrent > ultimateGoal ? ultimateCurrent : ultimateGoal
            }, talent: {
                current: talentCurrent,
                goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
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
    let weaponPredicate = (g: Goal) => g.type == type && g.cone == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus: CharacterStatus = initCharacterStatus(level_current);

    let characterGoal: Goal

    function initCharacterGoal() {
        return {
            type,
            character: nameEn,
            current: characterStatus,
            goal: characterStatus,
            id,
            eidolon:0
        } as CharacterGoal
    }

    function initWeaponGoal() {
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
        }
    }
    addGoal(characterGoal)
};

export function addCharacter(characterDataEx: HSRCharacterData) {

    const {avatar: character, skills: skill_list, skills_other, equipment: weapon} = characterDataEx;
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
    if (!characterId||characterId.includes("trailblazer")) {
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
    getTotalGoal().filter(a => a.type == 'trace').filter(a => all || !getGoalInactive().includes(a.character as string))
        .map(a => updateTrace(a as TraceGoal, normal, skill, burst, t))
    location.reload()
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
    location.reload()
}

export const batchUpdateWeapon = (all: boolean, characterStatusGoal: CharacterStatus,) => {
    getTotalGoal().filter(a => a.type == "cone").filter(a => all || !getGoalInactive().includes(a.cone as string))
        .map(a => updateCharacter(a as CharacterGoal, characterStatusGoal))
    location.reload()
}
