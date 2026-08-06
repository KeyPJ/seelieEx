import adapter from "axios-userscript-adapter/dist/esm";
import axios, {AxiosAdapter, AxiosRequestHeaders} from "axios";
import {ACT_MIHOYO_BASE_URL, DEVICE_FP_URL, ROLE_URL} from "./apiUrls";
import Data = mihoyo.Data;
import Role = mihoyo.Role;
import Goal = seelie.Goal;
import GICharacterGoal = seelie.GICharacterGoal;
import {GoalTypeConfig, GameType} from "./game";
import {AdapterManager} from "./adapterManager";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

// ===== 同步请求计数器 =====
// 统计「点击同步」后实际发起的 HTTP 请求数（含素材同步的重试）。通过 axios 请求拦截器自动累加，
// 在 syncAll 开头 resetSyncRequestCount()，结束时 getSyncRequestCount() 读取总数。
let syncRequestCount = 0;
export const resetSyncRequestCount = (): void => { syncRequestCount = 0; };
export const getSyncRequestCount = (): number => syncRequestCount;

axios.interceptors.request.use((config) => {
    syncRequestCount++;
    const method = (config.method || "get").toUpperCase();
    console.log(`[请求计数] #${syncRequestCount} ${method} ${config.url}`);
    return config;
});

// ===== 请求异常统一日志 =====
// 请求发生异常时，统一 console.error「请求 URL + 请求体(body)」，方便排查。覆盖两类：
//   1) 网络/HTTP 层错误（进入 onRejected）：打印 URL + body + 原始 error；
//   2) 业务层 retcode 非 0 且非 -100（HTTP 200 但业务失败）：打印 URL + body + message。
// 特别排除 -100（未登录）：它走 HTTP 200 + retcode -100，由 checkLogin 统一提示并跳转计算器页面，
// 此处不重复打印，避免刷屏。
axios.interceptors.response.use(
    (response) => {
        const data = response.data;
        // 仅对携带 retcode 的 JSON 对象响应做业务层判断（排除数组/字符串/非业务响应）
        if (data && typeof data === "object" && !Array.isArray(data) && "retcode" in data) {
            const retcode = (data as any).retcode;
            if (retcode !== 0 && retcode !== -100) {
                const cfg = response.config;
                const method = (cfg.method || "get").toUpperCase();
                console.error(`[请求异常] retcode=${retcode} ${method} ${cfg.url}`);
                if (cfg.data) console.error(`[请求异常] body:`, cfg.data);
                else if (cfg.params) console.error(`[请求异常] params:`, cfg.params);
                const message = (data as any).message;
                if (message) console.error(`[请求异常] message:`, message);
            }
        }
        return response;
    },
    (error) => {
        const cfg = error?.config;
        if (cfg) {
            const method = (cfg.method || "get").toUpperCase();
            console.error(`[请求异常] ${method} ${cfg.url}`);
            if (cfg.data) console.error(`[请求异常] body:`, cfg.data);
            else if (cfg.params) console.error(`[请求异常] params:`, cfg.params);
        }
        console.error(error);
        return Promise.reject(error);
    }
);

export async function refreshPage() {
    console.log("刷新页面?");
    const confirmed = confirm('确定要刷新页面吗？刷新后将重新加载所有数据。');
    //
    // // 只有当用户确认后才执行页面刷新
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
    Referer: ACT_MIHOYO_BASE_URL,
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
        let url = DEVICE_FP_URL;
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

// 账户接口专用请求头（参考 references/1.md 抓包：getUserGameRolesByCookie* 需带 device_id / lrsag / mi_referrer）
const buildRoleHeaders = (): AxiosRequestHeaders => {
    const deviceId = localStorage.getItem("mysDeviceId") || getGuid();
    return {
        ...headers,
        "x-rpc-device_id": deviceId,
        "x-rpc-lrsag": "",
        "x-rpc-mi_referrer": ACT_MIHOYO_BASE_URL,
    } as unknown as AxiosRequestHeaders;
};

export const getAccount = async (gameBiz: string, openUrl: string, gameType: string) => {
    const roleUrl = `${ROLE_URL}?game_biz=${gameBiz}`;
    const [err, res] = await to(axios.get(roleUrl, {headers: buildRoleHeaders()}));
    if (!err && res) {
        const {status, data: resData} = res;
        if (status === 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: accountList} = data as Data<Role>;
                return accountList;
            }
            // 统一登录态处理：retcode=-100 走 checkLogin（once-flag 防重复弹窗 + 打开计算器页 + 抛错）
            checkLogin(retcode, gameType, openUrl);
            console.warn(`[账户] 获取失败 retcode=${retcode}: ${resData?.message || ""}`);
        }
    }
    alert(`请确认已登录活动页面且绑定${gameType}账户!`);
    GM_openInTab(openUrl);
    throw err ? err : new Error("账户信息获取失败");
};

const getStorageAccount: () => string = () => localStorage.account || "main";

// ===== seelie 库存读写（素材/库存同步专用）=====
// 存储格式：{type, item, tier, value}[]，持久化到 localStorage[`${account}-inventory`]
// 另有 localStorage[`${account}-inv_sync`] 同步标记（时间戳）
export interface SeelieInventoryItem {
    type: string;
    item: string;
    tier: number;
    value: number;
}

export const seelieGetInventory = (type: string, item: string, tier: number): number | null => {
    const account = getStorageAccount();
    const raw = localStorage.getItem(`${account}-inventory`);
    if (!raw) return null;
    try {
        const arr = JSON.parse(raw) as SeelieInventoryItem[];
        const found = arr.find(a => a.type === type && a.item === item && a.tier === tier);
        return found ? found.value : null;
    } catch {
        return null;
    }
};

export const seelieSetInventory = (type: string, item: string, tier: number, value: number): void => {
    const account = getStorageAccount();
    const key = `${account}-inventory`;
    const raw = localStorage.getItem(key);
    const arr: SeelieInventoryItem[] = raw ? JSON.parse(raw) as SeelieInventoryItem[] : [];
    const found = arr.find(a => a.type === type && a.item === item && a.tier === tier);
    if (found) {
        found.value = value;
    } else {
        arr.push({type, item, tier, value});
    }
    localStorage.setItem(key, JSON.stringify(arr));
    localStorage.setItem(`${account}-inv_sync`, Date.now().toString());
};

export const getTotalGoal: () => Promise<seelie.Goal[]> = async () => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-goals`;
    const text = await currentAdapter.getItem(key) || "[]";
    return typeof text === 'string' ? JSON.parse(text as unknown as string) as Goal[] : text as unknown as Goal[];
};

export const getGoalInactive: () => Promise<string[]> = async () => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-inactive`;
    const text = await currentAdapter.getItem(key) || "[]";
    return Object.keys(typeof text === 'string' ? JSON.parse(text as unknown as string) : text) as string[];
};

export const setGoalInactive = async (ids = new Set()) => {
    const inactiveObject = Object.fromEntries(
        [...ids].map(id => [id as unknown as string, true])
    );
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-inactive`;
    await currentAdapter.setItem(key, inactiveObject);
    await refreshPage();
}

/**
 * 增量合并 inactive 状态（不会清空其它条目）。
 * @param updates 形如 { [identifierKey]: boolean }，true=设为 inactive，false=取消 inactive（移除）。
 * 注意：inactive 存储的 key 是目标标识符（角色名 / 武器id / 光锥id），不是 goal 的数字 id。
 */
export const mergeGoalInactive = async (updates: Record<string, boolean>) => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-inactive`;
    const text = await currentAdapter.getItem(key) || "{}";
    const currentObj = (typeof text === 'string' ? JSON.parse(text) : text) || {};
    const merged = {...currentObj};
    for (const rawId of Object.keys(updates)) {
        if (updates[rawId]) merged[rawId] = true;
        else delete merged[rawId];
    }
    await currentAdapter.setItem(key, merged);
    await refreshPage();
}

/**
 * 计算「完全达成」的实体标识符列表（用于「一键激活/取消规划」）。
 * - 角色(goalType='character')：角色自身等级目标达成 且 该角色所有天赋子技能均达成（cur>=target）。
 * - 武器/光锥(goalType='weapon'|'cone')：武器自身等级目标达成（cur>=target）。
 * 标识符取 batchUpdateGoals 实际过滤用的字段：角色=character(名)，武器=weapon，光锥=cone。
 * 注意：用 >=（达到或超越目标）判定达成，与 seelie 自身 isGoalCompleted(goal.level<=current.level) 一致；
 * 严格相等只是其中特例。
 */
/**
 * 按实体聚合目标，判断每个实体是否「完全达成」。
 * - 角色：自身等级目标 + 所有天赋子技能（basic/skill/burst…）均 cur>=target 才算达成
 * - 武器/光锥：自身等级目标 cur>=target 即达成
 * 标识符字段必须与 seelie 自身 computeInactive 一致（取自 getInactiveConfig）：
 *   角色=character(名)，武器/光锥=id（注意：不是 g.weapon/g.cone，否则写入的 -inactive key 与 seelie 读取对不上）。
 * 返回 completed（已达标）与 incomplete（未达标，任一子目标 cur<target）两组标识符。
 */
export const getEntityCompletion = async (
    goalType: 'character' | 'weapon' | 'cone',
    tiers?: number[]
): Promise<{ completed: string[], incomplete: string[] }> => {
    const adapter = AdapterManager.getCurrentAdapter();
    const goals = await getTotalGoal() as any[];
    const config = adapter.getInactiveConfig();
    // 标识符字段直接取自 getInactiveConfig，保证与 seelie 的 -inactive 读取口径一致
    const cfgEntry = config.find(c => c.type === goalType);
    const identifierField: string = cfgEntry?.identifierKey || (goalType === 'character' ? 'character' : 'id');
    const talentConfig = config.find(c => c.isTalent);
    const talentType = talentConfig?.type;
    const talentKeys = talentConfig?.talentKeys || [];

    // 按实体标识符分组（角色名 / 武器id / 光锥id）
    const byEntity = new Map<string, any[]>();
    const ensure = (id: string) => {
        if (!byEntity.has(id)) byEntity.set(id, []);
        return byEntity.get(id)!;
    };
    for (const g of goals) {
        if (g.type === goalType) ensure(String(g[identifierField])).push(g);
        if (goalType === 'character' && talentType && g.type === talentType) {
            ensure(String(g.character)).push(g);
        }
    }

    // 稀有度过滤：tiers 为 undefined → 不过滤（兼容旧调用，处理所有 tier）；
    // tiers 为 [] → 启用过滤但无匹配 → 该角色/武器行整体跳过（不处理任何 tier）；
    // tiers 为 [5]/[4]/[5,4] → 仅保留对应 tier。tier 取自页面运行时目录。
    // 无法判定 tier 的实体（不在目录中）一律忽略，避免误伤。
    const tierMap = tiers !== undefined ? getTierMap(goalType) : null;

    const completed: string[] = [];
    const incomplete: string[] = [];
    for (const [id, gs] of byEntity) {
        // 稀有度过滤：用实体名查 tierMap。角色=id（角色名）；武器=g.weapon；光锥=g.cone。
        // 三者均与 getTierMap 的 key（顶层代码名）一致，避免武器/光锥因 id 口径不同而全部被过滤跳过。
        const tierKey = goalType === 'character'
            ? id
            : (gs[0] ? gs[0][goalType === 'weapon' ? 'weapon' : 'cone'] : undefined);
        if (tierMap && (tierKey === undefined || tierMap[tierKey] === undefined || !tiers!.includes(tierMap[tierKey]))) continue;
        const levelGoals = gs.filter(g => g.type === goalType);
        const talentGoals = talentType ? gs.filter(g => g.type === talentType) : [];
        let done = true;
        for (const lg of levelGoals) {
            if (!(Number(lg.current?.level) >= Number(lg.goal?.level))) { done = false; break; }
        }
        if (done && talentGoals.length > 0) {
            for (const tg of talentGoals) {
                for (const k of talentKeys) {
                    const sk = tg[k];
                    if (!(sk && Number(sk.current) >= Number(sk.goal))) { done = false; break; }
                }
                if (!done) break;
            }
        }
        if (done) completed.push(id);
        else incomplete.push(id);
    }
    return { completed, incomplete };
};

/**
 * 从 seelie 页面运行时目录读取「实体标识符→tier(稀有度)」映射，供一键激活/取消按稀有度过滤。
 * - 角色：identifier=seelie key(角色名)，取自 data.characters[key].tier
 * - 武器/光锥：identifier=数字 id，取自 data.weapons / data.cones 条目的 id→tier
 * tier 取值 5(橙/金) / 4(紫) 等，与「橙色/紫色」勾选框一一对应。
 * 该映射与 getEntityCompletion 使用的 identifier 完全一致，可直接用于过滤。
 */
export const getTierMap = (goalType: 'character' | 'weapon' | 'cone'): Record<string, number> => {
    const map: Record<string, number> = {};
    try {
        const app = document.querySelector('#app') as any;
        const data = app?._vnode?.component?.data;
        if (!data) return map;
        if (goalType === 'character') {
            const cat = data.characters || {};
            for (const [k, v] of Object.entries(cat)) {
                const t = (v as any)?.tier;
                if (typeof t === 'number') map[k] = t;
            }
        } else {
            // 武器/光锥：tierMap 的 key 用运行时目录的顶层代码名（如 "a_teaspoon_of_transcendence"），
            // 与 goal 的 weapon/cone 字段（由 getWeaponId/getConeId 反查得到，同为代码名）一致。
            // 不能用 v.id（数字模板 id）：goal 里没有模板 id 字段，会令 tier 过滤全部跳过。
            const kind = goalType === 'cone' ? 'cones' : 'weapons';
            const cat = data[kind] || {};
            for (const [k, v] of Object.entries(cat)) {
                const t = (v as any)?.tier;
                if (typeof k === 'string' && typeof t === 'number') map[k] = t;
            }
        }
    } catch {
        // 页面结构异常时返回空映射（等价于不过滤）
    }
    return map;
};

export const setGoals = async (goals: any) => {
    const key = `${getStorageAccount()}-goals`;
    const currentAdapter = AdapterManager.getCurrentAdapter();
    await currentAdapter.setItem(key, goals);
    await currentAdapter.setItem("last_update", new Date().toISOString());
};

export const getNextId = async () => {
    const goals = await getTotalGoal();
    const ids = goals.map(g => g.id).filter((id): id is number => true);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
};

/**
 * 通用 addGoal：按 character+type 或 id 查找已有目标并合并/新建。
 * @param data 目标数据
 * @param fallbackToId 是否在 character 未命中时按 id 回落（GI 武器兼容旧数据需要）
 */
export const addGoal = async (data: any, fallbackToId = false) => {
    let index: number = -1;
    const goals = await getTotalGoal();

    if (data.character) {
        index = goals.findIndex(
            (g: any) => g.character === data.character && g.type === data.type
        );
    } else if (data.id) {
        index = goals.findIndex((g: any) => g.id === data.id);
    }
    // GI 兼容：character 未命中时按 id 回落（旧版武器目标的 character 为 ""）
    if (index < 0 && fallbackToId && typeof data.id === "number") {
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

/** 武器/光锥归属回收用的收集器：synced=本次实际同步到的角色；worn=角色→其当前穿戴的武器/光锥 key 集合 */
export interface OwnershipRecorder {
    synced: Set<string>;
    worn: Map<string, Set<string>>;
}

/**
 * 同步末尾校准武器/光锥归属：解决「角色脱下武器后旧归属残留」。
 * 规则：对每条 weapon/cone goal，若其 character 指向角色 C：
 *   - C 本次未参与同步（状态未知）→ 保留，避免误清；
 *   - C 本次同步了但仍穿戴该武器/光锥 → 保留（addCharacter 已写对）；
 *   - C 本次同步了但已不再穿戴 → 清空 character（释放过期归属）。
 * 不触碰角色目标与武器自身养成数据，仅回收"关联角色"字段。
 */
export const reconcileWeaponOwnership = async (
    syncedCharacters: Set<string>,
    wornByCharacter: Map<string, Set<string>>
) => {
    const goals = await getTotalGoal() as Goal[];
    let changed = false;
    for (const g of goals) {
        if (g.type !== "weapon" && g.type !== "cone") continue;
        const c = (g as any).character;
        if (!c) continue;
        if (!syncedCharacters.has(c)) continue;
        const key = g.type === "cone" ? (g as any).cone : (g as any).weapon;
        if (wornByCharacter.get(c)?.has(key)) continue;
        (g as any).character = "";
        changed = true;
    }
    if (changed) await setGoals(goals);
};

/** 通用 updateCharacter（三端完全相同） */
export const updateCharacter = async (character: any, characterStatusGoal: seelie.CharacterStatus) => {
    const {current} = character;
    const {level: levelCurrent, asc: ascCurrent} = current;
    const {level, asc} = characterStatusGoal;
    const characterGoalNew = {
        ...character,
        goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current,
    }
    await addGoal(characterGoalNew);
};

/**
 * 技能/天赋等级「只增不减」合并：current 高于旧 goal 时取 current（可选 cap 封顶），否则保留旧 goal。
 * 用于三端 updateTrace/updateTalent 与 addTraceGoal 合并分支，统一重复的 `x > g ? x : g` 三元表达式。
 */
export const mergeLevel = (current: number, oldGoal: number, cap?: number): number => {
    if (current > oldGoal) return cap !== undefined ? Math.min(current, cap) : current;
    return oldGoal;
};

/**
 * 角色/武器档位「只增不减」合并（hsr/zzz 共用）：newStatus 在 level 与 asc 都 >= 旧值时整体提升，否则保留旧值。
 * 返回新的 current 与 goal（结构分离，便于并入 merged 对象）。仅依赖 level/asc，不要求 text 等附带字段。
 */
export const mergeCharacterStatus = (
    next: { level: number; asc: number },
    oldCurrent: { level: number; asc: number },
    oldGoal: { level: number; asc: number }
): { current: { level: number; asc: number }; goal: { level: number; asc: number } } => ({
    current: next.level >= oldCurrent.level && next.asc >= oldCurrent.asc ? next : oldCurrent,
    goal: next.level >= oldGoal.level && next.asc >= oldGoal.asc ? next : oldGoal,
});

export const batchUpdateGoals = async <T extends Goal>(
    type: string,
    identifierKey: 'character' | 'weapon' | 'talent' | 'cone' | 'id', // 支持不同游戏的标识字段（角色/武器/天赋/光锥；武器与光锥用 goal.id）
    updateFn: (item: T, ...args: any[]) => Promise<void>,
    all: boolean,
    ...updateArgs: any[]
) => {
    const totalGoal = await getTotalGoal() as Goal[];
    const goalInactive = await getGoalInactive();
    const goals = totalGoal
        .filter(a => a.type === type)
        .filter(a => all || !goalInactive.includes((a as any)[identifierKey]));
    for (let goal of goals) {
        await updateFn(goal as T, ...updateArgs);
    }
    await refreshPage();
};


// 通用未达标目标计算函数（变量名规范化版）
export const computeInactive = (goals: Goal[], config: GoalTypeConfig[]): Set<string> => {
    // 1. 明确函数语义：判断目标是否"已完成"（而非模糊的"达标"）
    const isGoalCompleted = (goal: { goal: { level: number }, current: { level: number } }) =>
        goal.goal.level <= goal.current.level;

    // 2. 存储"目标类型→标识符集合"的映射（原名：resultMap）
    const goalTypeIdentifiers = new Map<string, Set<string>>();

    config.forEach(({type, identifierKey, isTalent, talentKeys}) => {
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

export const setInactive: (config: GoalTypeConfig[]) => void = async (config) => {
    const goals = await getTotalGoal();
    const inactive = computeInactive(goals, config); // 调用通用函数
    await setGoalInactive(inactive);
};

/**
 * 检查 API 返回的 retcode 是否为 -100（未登录）。
 * 如果是，弹出提示并打开对应计算器页面，然后抛出错误终止流程。
 * 用 GM_openInTab 而不是 window.open，避免被浏览器拦截。
 * 每次只打开一次（用 flag 标记），避免多批次循环中重复弹窗。
 */
let _loginPromptShown = false;
export const checkLogin = (retcode: number, gameName: string, calcUrl: string): void => {
    if (retcode !== -100) return;
    if (_loginPromptShown) throw new Error(`${gameName} 登录态已过期`);
    _loginPromptShown = true;
    alert(`${gameName} 登录态已过期！\n请前往米游社登录并打开${gameName}计算器页面，\n确保页面加载完成后再回来同步。`);
    GM_openInTab(calcUrl);
    throw new Error(`${gameName} 登录态已过期，已打开计算器页面，请重新登录后同步`);
};

/** 重置登录提示标记（每次 syncAll 开始时调用） */
export const resetLoginFlag = (): void => { _loginPromptShown = false; };
