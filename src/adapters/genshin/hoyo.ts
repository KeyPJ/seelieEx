import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterDataEx = mihoyo.CharacterDataEx;
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";
import axios, {AxiosAdapter, AxiosRequestHeaders} from "axios";
import {getFp, headers, to, seelieGetInventory, seelieSetInventory} from "../common";
// import giItems from "../../data/gi_items.json";

// 素材 id → seelie key 映射库的一条记录
export interface SeelieItemEntry {
    type: string;
    id?: number;
    ids?: number[];
}

export type SeelieItems = Record<string, SeelieItemEntry>;

/**
 * 外置读取 seelie 页面里的素材 id→key 映射库。
 * seelie.me 把这份库挂在根 Vue 实例 data 上，运行时直接取，无需打包静态 JSON。
 * 优先读 data.items，否则遍历 data 找“值含 type + id/ids”的对象。
 * 取不到时回退到 src/data/gi_items.json（开发期从参考站抽出的 469 条）。
 */
export const getItemsFromPage = (): SeelieItems | null => {
    try {
        const app = document.querySelector('#app') as any;
        const data = app?._vnode?.component?.data;
        if (!data) return null;
        if (data.items && typeof data.items === 'object' && !Array.isArray(data.items)) {
            return data.items as SeelieItems;
        }
        for (const key of Object.keys(data)) {
            const v = (data as any)[key];
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                const sample = Object.values(v)[0] as any;
                if (sample && typeof sample === 'object' && typeof sample.type === 'string' && ('id' in sample || 'ids' in sample)) {
                    return v as SeelieItems;
                }
            }
        }
        return null;
    } catch {
        return null;
    }
};

/** 按米游社素材 id 在 items 库中反查 seelie key / type / tier */
export const findItemMatch = (items: SeelieItems, id: number): { key: string; type: string; tier: number } | null => {
    for (const [key, info] of Object.entries(items)) {
        const ids = info.ids ?? (info.id != null ? [info.id] : []);
        const tier = info.ids ? info.ids.indexOf(id) : 0;
        if (ids.includes(id)) {
            return {key, type: info.type, tier};
        }
    }
    return null;
};

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;


const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list'

const ALL_CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/avatar/list'

const BATCH_COMPUTE_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute'

// 米游社标准请求头（含设备标识等，参考官网 fetch 调用）
const buildGenshinHeaders = (fp: string, deviceId: string) => ({
    "x-rpc-device_fp": fp,
    "x-rpc-device_id": deviceId,
    "x-rpc-lrsag": "",
    "x-rpc-page": "__#",
    "x-rpc-platform": "4",
    ...headers,
});

const requestPageSize = 200;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let fp = await getFp();
    const genshinHeaders = buildGenshinHeaders(fp, localStorage.getItem("mysDeviceId") || "");
    const [err, res] = await to(axios.post(CHARACTERS_URL, JSON.stringify({
        "element_attr_ids": [],
        "weapon_cat_ids": [],
        "page": page,
        "size": requestPageSize,
        "uid": uid,
        "region": region,
        "lang": "zh-cn"
    }), {
        timeout: 5000,
        headers: genshinHeaders as unknown as AxiosRequestHeaders
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<Character>;
                return characterList;
            }
        }
    }
    localStorage.removeItem("fp")
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    return {character, ...character} as any as CharacterDataEx
};


export const getDetailList = async (game_uid: string, region: string) => {

    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());


    const characters: Character[] = [];
    for await (let i of idxs) {
        characters.push.apply(characters, await getCharacters(game_uid, region, i + 1))
    }

    const details = characters.map(c => getCharacterDetail(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
        if (!!d) {
            detailList.push(d);
        }
    }
    return detailList;
}

/**
 * 已拥有角色（含武器），v1/sync/avatar/list（需 uid/region）。
 * 分页拉取，单页失败不阻断整体（降级为仅用全量列表）。
 */
const getOwnedCharactersRaw = async (uid: string, region: string): Promise<any[]> => {
    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    if (maxPageSize < 1) maxPageSize = 1;
    const chars: any[] = [];
    for (let i = 0; i < maxPageSize; i++) {
        try {
            const list = await getCharacters(uid, region, i + 1);
            if (list && list.length) chars.push(...list);
        } catch (e) {
            console.warn(`[素材同步] 已拥有角色(第${i + 1}页)获取失败:`, (e as Error)?.message || e);
            break;
        }
    }
    return chars;
};

/**
 * 拉全量角色花名册（含未拥有），v1/avatar/list + is_all:true。
 * 无需 uid/region，返回游戏内全部角色（用于追加未拥有角色做素材清单）。
 */
export const getAllCharacters = async (): Promise<any[]> => {
    let fp = await getFp();
    const deviceId = localStorage.getItem("mysDeviceId") || "";
    const h = buildGenshinHeaders(fp, deviceId);
    const result: any[] = [];
    const size = 200;
    let page = 1;
    while (true) {
        const [err, res] = await to(axios.post(ALL_CHARACTERS_URL, JSON.stringify({
            element_attr_ids: [],
            weapon_cat_ids: [],
            page,
            size,
            is_all: true,
            lang: "zh-cn",
        }), {
            timeout: 5000,
            headers: h as unknown as AxiosRequestHeaders,
        }));
        if (err) {
            console.warn(`[素材同步] 全量角色列表(第${page}页)请求异常:`, err?.message || err);
            break;
        }
        const {status, data: resData} = await res;
        if (status != 200 || resData.retcode !== 0) {
            console.warn(`[素材同步] 全量角色列表错误 retcode=${resData?.retcode}:`, resData?.message || "");
            break;
        }
        const list = resData.data?.list || resData.data?.avatars || [];
        result.push(...list);
        if (list.length < size) break;
        page++;
    }
    return result;
};

/**
 * 原神素材/库存同步（对标参考站组件 B）：
 * 1. 拉养成计算器的角色列表（复用本地 getDetailList，含 current/target 等级、突破、武器、天赋）
 * 2. 组装 batch_compute 入参（对齐真实目标等级：current/target、promote、skill、weapon）
 * 3. 分批次调 v3/batch_compute 计算材料（单次 items 至多 30 条，跨批聚合）
 * 4. 用【外置】的 items 库把 overall_consume 折算写入 seelie 库存（${account}-inventory）
 */
export const batchUpdateInventoryGI = async (uid: string, region: string) => {
    let fp = await getFp();
    const genshinHeaders = buildGenshinHeaders(fp, localStorage.getItem("mysDeviceId") || "");

    // 1. 拉全量角色花名册：
    //    (a) 已拥有角色（含武器）来自 v1/sync/avatar/list（需 uid/region）
    //    (b) 全量角色（含未拥有）来自 v1/avatar/list（is_all:true，无需 uid/region）
    //    合并为「已拥有 + 追加未拥有」的完整花名册；全部强转 baseline：
    //    avatar_level_current=1 / avatar_promote_level=0 / from_user_sync=false / skill level_current=1
    const SKIP_IDS = [10000117, 10000118, 10000005, 10000007];

    const ownedList = await getOwnedCharactersRaw(uid, region);
    const ownedMap = new Map<number, any>();
    for (const c of ownedList) ownedMap.set(c.id, c);

    const allList = await getAllCharacters();
    // 全量花名册：未拥有直接用全量数据；已拥有的用 sync 端武器数据补全
    const roster: any[] = allList.map((c: any) => {
        const owned = ownedMap.get(c.id);
        return owned && owned.weapon ? {...c, weapon: owned.weapon} : c;
    });

    let items = roster
        .filter((c: any) => !SKIP_IDS.includes(c.id))
        .map((c: any) => {
            const item: any = {
                avatar_id: c.id,
                avatar_level_current: 1,
                avatar_level_target: 90,
                avatar_promote_level: 0,
                element_attr_id: c.element_attr_id,
                from_user_sync: false,
                skill_list: (c.skill_list || [])
                    .filter((s: any) => s.level_current < s.max_level && s.max_level === 10)
                    .map((s: any) => ({
                        id: s.group_id,
                        level_current: 1,
                        level_target: 10,
                    })),
            };
            // 武器（baseline：当前1级，目标90）
            const w: any = c.weapon;
            if (w && w.id && w.level_current < w.max_level) {
                item.weapon = {
                    id: w.id,
                    level_current: 1,
                    level_target: 90,
                };
            }
            return item;
        });

    if (items.length === 0) {
        localStorage.removeItem("fp");
        throw new Error("未获取到任何角色，无法计算素材");
    }
    items = items.filter(a => a.avatar_level_current != a.avatar_level_target || a.skill_list.length > 0)
    console.table(items)

    // 2. 批量计算（首试 256 条/批；失败则递归二分重试 128-64-32-16→8→4→2→1；单条仍失败则摘除该条并打印；跨批按素材 id 去重、取 num+lack_num 最大值）
    const BATCH_SIZE = 256;
    const SPLIT_RETRY_DELAY = 1000;   // 二分重试短间隔(ms)：某批失败、准备拆小重试前等待，避免频限爆发
    const consumeRaw: any[] = [];

    // 单次请求一个 chunk：成功返回素材列表，失败(异常/retcode!=0)返回 null
    const doBatch = async (chunk: any[]): Promise<any[] | null> => {
        const [err, res] = await to(axios.post(BATCH_COMPUTE_URL, JSON.stringify({
            items: chunk,
            "uid": uid,
            "region": region,
            "lang": "zh-cn"
        }), {
            timeout: 8000,
            headers: genshinHeaders as unknown as AxiosRequestHeaders
        }));
        if (err) {
            console.warn(`[素材同步] 批次(${chunk.length}条)请求异常:`, err?.message || err);
            return null;
        }
        const {status, data: resData} = await res;
        if (status != 200 || resData.retcode !== 0) {
            console.warn(`[素材同步] 批次(${chunk.length}条)返回错误 retcode=${resData?.retcode}:`, resData?.message || "");
            return null;
        }
        return resData.data?.overall_consume || [];
    };

    // 递归二分重试：成功返回素材列表；size>1 失败则拆两半分别重试；size=1 仍失败则摘除该条并打印
    const processChunk = async (chunk: any[]): Promise<any[]> => {
        const part = await doBatch(chunk);
        if (part !== null) {
            console.log(`[素材同步] 批次(${chunk.length}条)完成，本批 ${part.length} 条素材`);
            return part;
        }
        if (chunk.length > 1) {
            const mid = Math.ceil(chunk.length / 2);
            const left = chunk.slice(0, mid);
            const right = chunk.slice(mid);
            console.warn(`[素材同步] 批次(${chunk.length}条)失败，二分重试 -> ${left.length}+${right.length}，间隔 ${SPLIT_RETRY_DELAY}ms`);
            await new Promise(resolve => setTimeout(resolve, SPLIT_RETRY_DELAY));
            const l = await processChunk(left);
            const r = await processChunk(right);
            return [...l, ...r];
        }
        // 单条仍失败：摘除影响数据并打印，避免阻塞其余 items
        console.error(`[素材同步] 摘除影响数据(单条始终失败):`, JSON.stringify(chunk[0]));
        return [];
    };

    const total = Math.ceil(items.length / BATCH_SIZE);
    let idx = 0;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
        const chunk = items.slice(i, i + BATCH_SIZE);
        idx++;
        const part = await processChunk(chunk);
        if (part.length) consumeRaw.push(...part);
        console.log(`[素材同步] 批次 ${idx}/${total} 处理完毕，累计素材 ${consumeRaw.length} 条`);
    }

    if (consumeRaw.length === 0) {
        localStorage.removeItem("fp");
        throw new Error("Failed to calculate inventory.");
    }
    // 跨批聚合：同一素材 id 不累加，按 (num+lack_num) 取最大值（同批次内 id 不会重复，不同批次取最大）
    const merged: Record<number, any> = {};
    for (const t of consumeRaw) {
        const v = t.num + t.lack_num;
        if (merged[t.id]) {
            if (v > merged[t.id].value) merged[t.id].value = v;
        } else {
            merged[t.id] = {...t, value: v};
        }
    }
    const overall_consume = Object.values(merged) as any[];

    // 4. 折算入库（items 外置：优先页面运行时读取，取不到回退静态 gi_items.json）
    const pageItems = getItemsFromPage();
    const itemLib = pageItems as unknown as SeelieItems;
    console.log(`[素材同步] items 来源：${pageItems ? "页面运行时(#app._vnode.component.data)" : "静态 gi_items.json 兜底"}，共 ${Object.keys(itemLib).length} 条`);

    const results: any[] = [];
    for (const t of overall_consume) {
        let type: string, key: string, tier = 0;
        if (t.id === 104003) { type = "xp"; key = "xp"; }
        else if (t.id === 202) { type = "mora"; key = "mora"; }
        else if (t.id === 104013) { type = "wep_xp"; key = "wep_xp"; }
        else {
            const match = findItemMatch(itemLib, t.id);
            if (!match) {
                console.warn(`[素材同步] 未匹配素材 id=${t.id} name=${t.name}`);
                continue;
            }
            type = match.type; key = match.key; tier = match.tier;
        }
        const value = t.value;  // = num + lack_num（取跨批最大值），即库存值
        const f = seelieGetInventory(type, key, tier);
        results.push({
            type, item: key, tier,
            sort: 0,
            value,
            mod: value - (f ?? 0),
            max: !t.lack_num
        });
        seelieSetInventory(type, key, tier, value);
    }

    localStorage.removeItem("fp");
    console.log(`[素材同步] 已写入 ${results.length} 条素材到 seelie 库存`);
    return {ok: true, count: results.length, source: pageItems ? "page" : "fallback"};
};



