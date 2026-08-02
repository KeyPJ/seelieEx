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

const BATCH_COMPUTE_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute'

const requestPageSize = 200;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let fp = await getFp();
    const genshinHeaders = {
        "x-rpc-device_fp": fp,
        ...headers,
    }
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
 * 原神素材/库存同步（对标参考站组件 B）：
 * 1. 拉养成计算器的角色列表（复用本地 getDetailList，含 element_attr_id / skill_list）与 5★ 武器列表
 * 2. 组装 batch_compute 入参（角色→90 级 + 天赋→10 级；5★ 武器→90 级）
 * 3. 调 v3/batch_compute 计算材料需求
 * 4. 用【外置】的 items 库把 overall_consume 折算写入 seelie 库存（${account}-inventory）
 */
export const batchUpdateInventoryGI = async (uid: string, region: string) => {
    let fp = await getFp();
    const genshinHeaders = {
        "x-rpc-device_fp": fp,
        ...headers,
    }

    // 1. 养成计算器角色列表（含 current/target 等级、突破、武器、天赋），按真实目标折算
    //    入参严格对齐米游社 v3/batch_compute：
    //    avatar_level_current/target、avatar_promote_level、skill_list[].level_current/target、
    //    weapon.level_current/target，from_user_sync=true
    const details = await getDetailList(uid, region) as CharacterDataEx[];
    const SKIP_IDS = [10000117, 10000118, 10000005, 10000007];
    let items = details
        .filter(c => c.character && !SKIP_IDS.includes(c.character.id))
        .map(c => {
            const ch: any = c.character;
            const item: any = {
                avatar_id: ch.id,
                avatar_level_current: ch.level_current ?? 1,
                avatar_level_target: 90,
                avatar_promote_level: ch.promote_level ?? 0,
                element_attr_id: ch.element_attr_id,
                from_user_sync: true,
                skill_list: (c.skill_list || []).filter(s => s.level_current < s.max_level && s.max_level === 10).map((s: any) => ({
                    id: s.group_id,
                    level_current: s.level_current,
                    level_target: 10,
                })),
            };
            // 武器目标（来自角色详情里的 weapon 字段，含当前/目标等级）
            const w: any = (c as any).weapon ?? ch.weapon;
            if (w && w.id) {
                if (w.level_current < w.max_level) {
                    item.weapon = {
                        id: w.id,
                        level_current: w.level_current ?? 1,
                        level_target: 90,
                    };
                }
            }
            return item;
        });

    if (items.length === 0) {
        localStorage.removeItem("fp");
        throw new Error("未获取到任何角色目标，请先在米游社养成计算器添加目标");
    }
    items = items.filter(a => a.avatar_level_current != a.avatar_level_target || a.skill_list.length > 0)
    console.table(items)

    // 2. 批量计算
    const [err, res] = await to(axios.post(BATCH_COMPUTE_URL, JSON.stringify({
        items,
        "uid": uid,
        "region": region,
        "lang": "zh-cn"
    }), {
        timeout: 8000,
        headers: genshinHeaders as unknown as AxiosRequestHeaders
    }));

    if (err) {
        localStorage.removeItem("fp");
        throw err;
    }
    const {status, data: resData} = await res;
    if (status != 200 || resData.retcode !== 0) {
        localStorage.removeItem("fp");
        throw new Error(resData?.message || "库存列表获取失败");
    }

    const overall_consume = resData.data?.overall_consume;
    if (!overall_consume || overall_consume.length === 0) {
        localStorage.removeItem("fp");
        throw new Error("Failed to calculate inventory.");
    }

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
        const value = t.lack_num * -1 + t.num;  // = num - lack_num（规划器视角下的现有持有量）
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



