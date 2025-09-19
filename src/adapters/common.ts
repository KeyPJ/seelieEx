import adapter from "axios-userscript-adapter/dist/esm";
import axios, {AxiosAdapter, AxiosRequestHeaders} from "axios";
import Data = mihoyo.Data;
import Role = mihoyo.Role;
import Goal = seelie.Goal;
import GICharacterGoal = seelie.GICharacterGoal;
import {GoalTypeConfig} from "./game";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

export function refreshPage() {
    const confirmed = confirm('确定要刷新页面吗？刷新后将重新加载所有数据。');

    // 只有当用户确认后才执行页面刷新
    if (confirmed) {
        window.location.reload();
    }
}

function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

function generateCharString(number = 16) {
    const characters = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

export const headers = {
    Referer: "https://act.mihoyo.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
}

export const to = (promise: Promise<any>) => promise.then(data => {
    return [null, data];
}).catch(err => {
    console.error(err)
    return [err];
});

export const getFp = async () => {
    let fp = localStorage.getItem("fp");
    let deviceId = localStorage.getItem("mysDeviceId");
    if (!deviceId) {
        deviceId = getGuid()
        localStorage.setItem("mysDeviceId", deviceId);
    }
    if (!fp) {
        let url = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
        const [err, res] = await to(axios.post(url,
            JSON.stringify({
                seed_id: generateCharString(),
                device_id: deviceId.toUpperCase(),
                platform: '1',
                seed_time: new Date().getTime() + '',
                ext_fields: `{"proxyStatus":"0","accelerometer":"-0.159515x-0.830887x-0.682495","ramCapacity":"3746","IDFV":"${deviceId.toUpperCase()}","gyroscope":"-0.191951x-0.112927x0.632637","isJailBreak":"0","model":"iPhone12,5","ramRemain":"115","chargeStatus":"1","networkType":"WIFI","vendor":"--","osVersion":"17.0.2","batteryStatus":"50","screenSize":"414×896","cpuCores":"6","appMemory":"55","romCapacity":"488153","romRemain":"157348","cpuType":"CPU_TYPE_ARM64","magnetometer":"-84.426331x-89.708435x-37.117889"}`,
                app_name: 'bbs_cn',
                device_fp: '38d7ee834d1e9'
            }), {
                timeout: 5000,
                headers: headers as unknown as AxiosRequestHeaders
            }));
        if (!err) {
            const {status, data: resData} = await res;
            if (status == 200) {
                const {retcode, data} = resData;
                if (retcode === 0) {
                    let resFp = data["device_fp"];
                    localStorage.setItem("fp", resFp);
                    return resFp;
                }
            }
        }
    } else {
        return fp;
    }
};

export const getAccount = async (roleUrl: string, openUrl: string, gameType: string) => {
    // try {
    const [err, res] = await to(axios.get(roleUrl, {
        headers: headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: accountList} = await data as Data<Role>;
                return accountList;
            }
        }
    }
    alert(`请确认已登录活动页面且绑定${gameType}账户!`)
    GM_openInTab(openUrl)
    throw err ? err : new Error("账户信息获取失败");
};

const getStorageAccount: () => string = () => localStorage.account || "main";

export const getTotalGoal: () => Goal[] = () =>
    JSON.parse(
        localStorage.getItem(`${getStorageAccount()}-goals`) || "[]"
    ) as Goal[];

export const getGoalInactive: () => string[] = () =>
    Object.keys(JSON.parse(localStorage.getItem(`${getStorageAccount()}-inactive`) || "{}"));

export const setGoalInactive = (ids = new Set()) => {
    const inactiveObject = Object.fromEntries(
        [...ids].map(id => [id as unknown as string, true])
    );
    localStorage.setItem(`${getStorageAccount()}-inactive`, JSON.stringify(inactiveObject));
    refreshPage();
}

export const setGoals = (goals: any) => {
    localStorage.setItem(`${getStorageAccount()}-goals`, JSON.stringify(goals));
    localStorage.setItem("last_update", new Date().toISOString());
};

export const getNextId = () => {
    const goals = getTotalGoal();
    const ids = goals.map(g => g.id).filter((id): id is number => typeof id === 'number');
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

export const batchUpdateGoals = <T extends Goal>(
    type: string,
    identifierKey: 'character' | 'weapon' | 'talent' | 'cone', // 支持不同游戏的标识字段（角色/武器/天赋）
    updateFn: (item: T, ...args: any[]) => void,
    all: boolean,
    ...updateArgs: any[]
) => {
    const totalGoal = getTotalGoal() as Goal[];
    const goals = totalGoal
        .filter(a => a.type === type)
        .filter(a => all || !getGoalInactive().includes((a as any)[identifierKey]));
    goals.map(item => updateFn(item as T, ...updateArgs))
    refreshPage();

};



// 通用未达标目标计算函数（变量名规范化版）
export const computeInactive  = (goals: Goal[], config: GoalTypeConfig[]): Set<string> => {
    // 1. 明确函数语义：判断目标是否"已完成"（而非模糊的"达标"）
    const isGoalCompleted = (goal: { goal: { level: number }, current: { level: number } }) =>
        goal.goal.level <= goal.current.level;

    // 2. 存储"目标类型→标识符集合"的映射（原名：resultMap）
    const goalTypeIdentifiers = new Map<string, Set<string>>();

    config.forEach(({ type, identifierKey, isTalent, talentKeys }) => {
        // 3. 筛选当前类型的目标（原名：goalGroup）
        const filteredGoals = goals.filter(g => g.type === type);

        // 4. 天赋类目标：所有子类型均完成（原名：达标天赋）
        if (isTalent && talentKeys) {
            const completedTalents = filteredGoals.filter(talent =>
                talentKeys.every(key =>
                    (talent as any)[key].goal <= (talent as any)[key].current
                )
            );
            goalTypeIdentifiers.set(type, new Set(completedTalents.map(g => (g as any)[identifierKey].toString())));
        }
        // 5. 普通目标：直接判断完成状态（原名：达标目标）
        else {
            const goals1 = filteredGoals as unknown as GICharacterGoal[];
            const completedGoals = goals1.filter(isGoalCompleted);
            goalTypeIdentifiers.set(type, new Set(completedGoals.map(g => (g as any)[identifierKey].toString())));
        }
    });

    // 6. 提取角色/天赋/武器目标类型（避免硬编码索引，增强可读性）
    const characterType = config.find(c => c.type === "character")?.type;
    const talentType = config.find(c => c.isTalent)?.type;
    const weaponType = config.find(c => !c.isTalent && c.type !== "character")?.type;

    // 7. 明确变量语义：角色/天赋/武器的完成标识符集合（原名：角色IDs/天赋IDs/武器IDs）
    const characterIds = goalTypeIdentifiers.get(characterType!) || new Set();
    const talentIds = goalTypeIdentifiers.get(talentType!) || new Set();
    const weaponIds = goalTypeIdentifiers.get(weaponType!) || new Set();

    // 8. 计算角色与天赋的交集（原名：角色天赋交集）
    const characterNames = new Set([...talentIds].filter(id => characterIds.has(id)));

    // 合并交集与武器标识符
    return new Set([...characterNames, ...weaponIds]);
};

export const setInactive: (config: GoalTypeConfig[]) => void = (config) => {
    const goals = getTotalGoal();
    const inactive = computeInactive(goals, config); // 调用通用函数
    setGoalInactive(inactive);
};
