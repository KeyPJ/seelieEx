import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterDataEx = mihoyo.CharacterDataEx;
import {getCharactersNum} from "./query";
import axios, {AxiosRequestHeaders} from "axios";
import {to, checkLogin} from "../common";
import {GameApiConfig} from "../game";
import {getItemsFromPage} from "../items";
import {MaterialMatch, loadSeelieItems, sleep, writeMergedToSeelieInventory, buildBaseHeaders, getFpDeviceId} from "../inventory-common";
// import giItems from "../../data/gi_items.json";

// axios.defaults（adapter/withCredentials）已由 ../common 统一设置，此处不再重复。

const requestPageSize = 200;

// 米游社标准请求头（含设备标识等，参考官网 fetch 调用）
const buildGenshinHeaders = async () => {
    const {fp, deviceId} = await getFpDeviceId();
    return {
        ...buildBaseHeaders(fp, deviceId),
        "x-rpc-lrsag": "",
        "x-rpc-page": "__#",
    };
};

const getCharacters = async (uid: string, region: string, page = 1, cfg: GameApiConfig) => {

    const genshinHeaders = await buildGenshinHeaders();
    const [err, res] = await to(axios.post(cfg.charactersUrl, JSON.stringify({
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
            // 非零 retcode（含 -100 未登录）：交给 checkLogin 处理（未登录会提示+跳转计算器页面+抛错）
            checkLogin(retcode, "原神", cfg.calcPageUrl);
            console.warn(`[GI] 角色列表获取失败 retcode=${retcode}: ${resData?.message || ""}`);
        }
    }
    localStorage.removeItem("fp")
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    return {character, ...character} as any as CharacterDataEx
};


export const getDetailList = async (game_uid: string, region: string, cfg: GameApiConfig) => {

    let maxPageSize = Math.ceil(getCharactersNum() / requestPageSize);
    if (maxPageSize < 1) maxPageSize = 1;
    let idxs = Array.from(new Array(maxPageSize).keys());


    const characters: Character[] = [];
    for await (let i of idxs) {
        characters.push.apply(characters, await getCharacters(game_uid, region, i + 1, cfg))
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
const getOwnedCharactersRaw = async (uid: string, region: string, cfg: GameApiConfig): Promise<any[]> => {
    let maxPageSize = Math.ceil(getCharactersNum() / requestPageSize);
    if (maxPageSize < 1) maxPageSize = 1;
    const chars: any[] = [];
    for (let i = 0; i < maxPageSize; i++) {
        try {
            const list = await getCharacters(uid, region, i + 1, cfg);
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
export const getAllCharacters = async (cfg: GameApiConfig): Promise<any[]> => {
    const h = await buildGenshinHeaders();
    const result: any[] = [];
    const size = 200;
    let page = 1;
    while (true) {
        const [err, res] = await to(axios.post(cfg.allCharactersUrl!, JSON.stringify({
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
            checkLogin(resData.retcode, "原神", cfg.calcPageUrl);
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

// GI 素材 id → seelie type/key/tier 的特例表（其余走页面 items 库匹配）
const GI_SPECIAL: Record<number, MaterialMatch> = {
    104003: {type: "xp", key: "xp", tier: 0},
    202: {type: "mora", key: "mora", tier: 0},
    104013: {type: "wep_xp", key: "wep_xp", tier: 0},
};

/**
 * 原神素材/库存同步（对标参考站组件 B）：
 * 1. 拉养成计算器的角色列表（复用本地 getDetailList，含 current/target 等级、突破、武器、天赋）
 * 2. 组装 batch_compute 入参（对齐真实目标等级：current/target、promote、skill、weapon）
 * 3. 分批次调 v3/batch_compute 计算材料（单次 items 至多 30 条，跨批聚合）
 * 4. 用【外置】的 items 库把 overall_consume 折算写入 seelie 库存（${account}-inventory）
 */
export const batchUpdateInventoryGI = async (uid: string, region: string, cfg: GameApiConfig, prefetched?: any[]) => {
    const genshinHeaders = await buildGenshinHeaders();

    // 1. 拉全量角色花名册：
    //    (a) 已拥有角色（含武器）来自 v1/sync/avatar/list（需 uid/region）
    //    (b) 全量角色（含未拥有）来自 v1/avatar/list（is_all:true，无需 uid/region）
    //    合并为「已拥有 + 追加未拥有」的完整花名册；全部强转 baseline：
    //    avatar_level_current=1 / avatar_promote_level=0 / from_user_sync=false / skill level_current=1
    const SKIP_IDS = [10000117, 10000118, 10000005, 10000007];

    // 已拥有角色：复用角色同步已拉取的数据（消除重复 list/detail 请求）；无预拉取时回退重新拉取
    const ownedList = (prefetched && prefetched.length)
        ? prefetched
        : await getOwnedCharactersRaw(uid, region, cfg);
    console.log(`[素材同步] 复用角色同步已拉取 ${ownedList.length} 个已拥有角色${prefetched?.length ? "" : "（回退重新拉取）"}`);
    const ownedMap = new Map<number, any>();
    for (const c of ownedList) ownedMap.set(c.id, c);

    // 全量花名册（含未拥有角色）：GI 素材计算需要全角色清单，而角色同步只拉已拥有，故此处仍需获取（并非重复请求）
    const allList = await getAllCharacters(cfg);
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
        const [err, res] = await to(axios.post(cfg.computeUrl!, JSON.stringify({
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
            checkLogin(resData.retcode, "原神", cfg.calcPageUrl);
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
            await sleep(SPLIT_RETRY_DELAY);
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
    // lackNum 沿用该 id 首次出现时的 lack_num（与重构前 {...t, value} 的语义一致，仅 value 会被更大值覆盖）
    const merged: Record<number, { value: number; lackNum: number }> = {};
    for (const t of consumeRaw) {
        const v = t.num + t.lack_num;
        if (merged[t.id]) {
            if (v > merged[t.id].value) merged[t.id].value = v;
        } else {
            merged[t.id] = {value: v, lackNum: t.lack_num};
        }
    }

    // 4. 折算入库（items 外置：优先页面运行时读取）
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[素材同步]", pageItems);
    const results = writeMergedToSeelieInventory(
        Object.fromEntries(
            Object.entries(merged).map(([k, v]) => [Number(k), v.value] as [number, number])
        ) as Record<number, number>,
        itemLib,
        GI_SPECIAL,
        "[素材同步]",
        (id) => ({sort: 0, max: !merged[id].lackNum})
    );

    localStorage.removeItem("fp");
    return {ok: true, count: results.length, source: pageItems ? "page" : "fallback"};
};



