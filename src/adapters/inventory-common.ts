// src/adapters/inventory-common.ts
// 三条线（GI / HSR / ZZZ）素材同步的公共逻辑抽取。
// 依赖方向：inventory-common -> {./items, ./common}。
// items 库刻意放在叶子模块 ./items 而非 ./genshin/hoyo，使 genshin/hoyo 可以单向依赖本模块而不成环。
import axios from "axios";
import {SeelieItems, findItemMatch, getItemsFromPage} from "./items";
import {seelieGetInventory, seelieSetInventory, getFp, to, checkLogin, headers} from "./common";
import {AdapterManager} from "./adapterManager";

/**
 * 取当前游戏的 adapter 实例，复用其公用缓存读写方法 getItem/setItem（自动 JSON 序列化）。
 * 兜底：若 AdapterManager 当下不可用（极少数初始化时序问题），退回直接读写 localStorage，
 * 保证 calc 缓存不因此失效（仍满足「复用公用方法，仅在其异常时兜底」）。
 */
const safeCache = (): { getItem(key: string): Promise<any>; setItem(key: string, value: any): Promise<void> } => {
    try {
        return AdapterManager.getCurrentAdapter();
    } catch {
        return {
            getItem: (k: string) => Promise.resolve(localStorage.getItem(k)),
            setItem: (k: string, v: any) => {
                localStorage.setItem(k, typeof v === "string" ? v : JSON.stringify(v));
                return Promise.resolve();
            },
        };
    }
};

/** 素材 id 折算到 seelie 库存的定位信息 */
export interface MaterialMatch {
    type: string;
    key: string;
    tier: number;
}

/** Promise 化 sleep */
export const sleep = (ms: number): Promise<void> => new Promise<void>(r => setTimeout(r, ms));

/** 带随机抖动 sleep：base + [0, jitter] ms，避免多次请求同步撞进同一频限窗口 */
export const sleepWithJitter = (base: number, jitter = 0): Promise<void> =>
    sleep(base + Math.floor(Math.random() * (jitter + 1)));

/** 取 fp + 设备 id（localStorage.mysDeviceId 兜底 fp） */
export const getFpDeviceId = async (): Promise<{ fp: string; deviceId: string }> => {
    const fp = await getFp();
    const deviceId = localStorage.getItem("mysDeviceId") || fp;
    return {fp, deviceId};
};

/**
 * 米游社请求头公共底座：基础 headers + 设备标识 + platform。
 * 各游戏再向上追加专属字段（page/lang/geetest/cultivate_source 等）。
 */
export const buildBaseHeaders = (fp: string, deviceId: string): Record<string, string> => ({
    ...headers,
    "x-rpc-device_fp": fp,
    "x-rpc-device_id": deviceId,
    "x-rpc-platform": "4",
});

/**
 * 从 seelie 页面运行时读取 items 库。
 * @param sourceLabel 日志前缀，如 "[ZZZ素材]"
 * @param pageItems 已取过可传入避免重复读取 DOM
 */
export const loadSeelieItems = (sourceLabel: string, pageItems?: SeelieItems | null): SeelieItems => {
    const lib = pageItems ?? getItemsFromPage();
    const itemLib = (lib || {}) as SeelieItems;
    console.log(`${sourceLabel} items 来源：${lib ? "页面运行时" : "无（findItemMatch 可能空匹配）"}，共 ${Object.keys(itemLib).length} 条`);
    return itemLib;
};

/** 把「素材 id→数量」扁平 map 合并进 merged（跨角色/跨批按 id 取最大值） */
export const mergeMaterialsMax = (merged: Record<number, number>, flat: Record<string, any>): void => {
    if (!flat) return;
    for (const [k, v] of Object.entries(flat)) {
        const id = Number(k);
        const val = Number(v);
        if (!Number.isFinite(id) || !Number.isFinite(val)) continue;
        if (!(id in merged) || val > merged[id]) merged[id] = val;
    }
};

/**
 * 单角色 calc 请求缓存（HSR/ZZZ 共用），按「角色部分 / 武器部分」拆分两条命名空间缓存：
 * - 角色部分：`seelieex:char:<game>:<charKey>` → 角色培养目标签名 + 该角色 consume 引用的素材 id 列表
 * - 武器部分：`seelieex:wp:<game>:<wpKey>`   → 武器培养目标签名 + 该武器 consume 引用的素材 id 列表
 *
 * 背景：calc 请求 = 「角色(avatar+skill_list) + 武器(equipment)」，响应可干净拆成
 * 「角色部分(avatar_consume+skill_consume)」与「武器部分(equipment_consume)」，两者各自只取决于对应培养目标，
 * 故分两条缓存、分别判重；只要「角色缓存过 AND 武器缓存过」，即便从没一起请求过也可跳过。
 *
 * 缓存只存「签名 + 素材 id 列表」，**不存完整 consume 对象**（响应里 item_desc/item_bg_desc 超长，
 * 全量存 90 角色会撑爆 localStorage 配额）；缓存也绝不存 user_owns_materials（动态变化，见下）。
 *
 * 跳过判据（核心，修正于 2026-08-07 晚）：
 * 每次同步维护「已抓取角色 consume 引用的素材 id 并集」`state.covered`（= 各真实请求里 avatar/skill/equipment_consume
 * 的 item_id 并集，即「本次同步已通过真实请求拿到其账号级持有量」的素材集合）。
 * 处理某组合时，若「角色部分命中(charSig 一致) AND 武器部分命中(wpSig 一致) AND 已拿到新鲜库存(state.fresh)
 * AND 本组合 consume 引用的全部素材 ⊆ state.covered（所需素材都已被前面角色的真实请求覆盖）」→ 跳过请求。
 *
 * 为什么用 consume 并集而非 user_owns_materials：
 * 抓包显示 `user_owns_materials` 只含「该角色需要且用户当前持有>0」的素材（持有=0 的素材如银河沙盘只在 need_get_materials 里），
 * 仅是 consume 的子集。若用 owns 的 key 当覆盖集，因角色需要的素材大半用户未持有，
 * 「consume ⊆ owns」几乎永不成立 → 几乎不跳过。正确覆盖集应是 consume 引用的全部素材 id（用户 A/B/C 例子的本意：
 * A 需{a,b,c}、B 需{c,d,e}、C 需{a,c,d}，A+B 的 consume 并集覆盖 C → 跳过 C）。
 *
 * ⚠️ 安全护栏（防漏数据）：覆盖集 `state.covered` 仅并入「本同步真实请求」的 consume 素材 id，
 * 被跳过的组合其 consume 必为 covered 子集 → 其中「用户持有」的素材必已被前面某角色以账号级同值抓到，绝不漏数据。
 * 跳过时不需缓存的 consume 数值（最终入库用的是 user_owns_materials 实时值，绝不缓存）。
 */
const CALC_CACHE_VERSION = 1;
const CHAR_CACHE_PREFIX = "seelieex:char:";
const WP_CACHE_PREFIX = "seelieex:wp:";

/** 角色部分缓存条目（仅存签名 + 该角色 consume 引用的素材 id 列表；不存完整 consume 对象以防撑爆配额） */
interface CharCacheEntry {
    v: number;
    sig: string;
    game: string;
    charKey: string | number;
    charItemIds: string[];
    ts: number;
}

/** 武器部分缓存条目（仅存签名 + 该武器 consume 引用的素材 id 列表） */
interface WpCacheEntry {
    v: number;
    sig: string;
    game: string;
    wpKey: string | number;
    wpItemIds: string[];
    ts: number;
}

/** 由请求体片段生成稳定签名（剔除 uid/region 等会话级字段），用于判断培养目标是否变化（变化则失效重算） */
export const calcSig = (body: any): string => {
    const b = {...body};
    delete b.uid;
    delete b.region;
    try {
        return JSON.stringify(b);
    } catch {
        return String(body?.item_id ?? body?.avatar?.item_id ?? body?.avatar_id ?? "?");
    }
};

const charCacheKey = (game: string, charKey: string | number): string =>
    `${CHAR_CACHE_PREFIX}${game}:${charKey}`;

const wpCacheKey = (game: string, wpKey: string | number): string =>
    `${WP_CACHE_PREFIX}${game}:${wpKey}`;

/**
 * 从公用 getItem 的返回值里还原缓存条目，兼容两套存储契约：
 * - localStorage 包装（baseAdapter.getItem）：返回的是 JSON 字符串 → 需 JSON.parse。
 * - localForage 语义（部分运行环境 getItem 返回已反序列化的对象）→ 直接用。
 * 早期版本误存的损坏值（如 "[object Object]"）解析失败时降级为 null（视为 miss），不再抛错中断。
 */
const parseCacheEntry = <T extends {v?: number}>(raw: any): T | null => {
    if (raw == null) return null;
    if (typeof raw === "string") {
        const s = raw.trim();
        if (!s) return null;
        try {
            return JSON.parse(s) as T;
        } catch {
            // 损坏值（如旧版误存的 "[object Object]"）→ 视为 miss，触发本次真实请求后由 writeCharCache 重写
            return null;
        }
    }
    return raw as T;
};

const readCharCache = async (game: string, charKey: string | number): Promise<CharCacheEntry | null> => {
    const key = charCacheKey(game, charKey);
    const raw = await safeCache().getItem(key);
    if (raw == null) {
        console.log(`[calc缓存] 读角色缓存 miss ${key}`);
        return null;
    }
    const e = parseCacheEntry<CharCacheEntry>(raw);
    if (e && e.v === CALC_CACHE_VERSION) {
        console.log(`[calc缓存] 读角色缓存 hit ${key}（${e.charItemIds.length} 个素材）`);
        return e;
    }
    console.log(`[calc缓存] 读角色缓存 miss/版本不符 ${key} v=${e?.v}`);
    return null;
};

const readWpCache = async (game: string, wpKey: string | number): Promise<WpCacheEntry | null> => {
    const key = wpCacheKey(game, wpKey);
    const raw = await safeCache().getItem(key);
    if (raw == null) {
        console.log(`[calc缓存] 读武器缓存 miss ${key}`);
        return null;
    }
    const e = parseCacheEntry<WpCacheEntry>(raw);
    if (e && e.v === CALC_CACHE_VERSION) {
        console.log(`[calc缓存] 读武器缓存 hit ${key}（${e.wpItemIds.length} 个素材）`);
        return e;
    }
    console.log(`[calc缓存] 读武器缓存 miss/版本不符 ${key} v=${e?.v}`);
    return null;
};

const writeCharCache = async (e: CharCacheEntry): Promise<void> => {
    const key = charCacheKey(e.game, e.charKey);
    try {
        await safeCache().setItem(key, e);
        console.log(`[calc缓存] 已写入角色缓存 ${key}（${e.charItemIds.length} 个素材）`);
    } catch (err) {
        // 配额/序列化失败：明确报错（不再静默吞），退回每次都重新计算
        console.error(`[calc缓存] 写入角色缓存失败（可能 localStorage 配额超限）key=${key}`, err);
    }
};

const writeWpCache = async (e: WpCacheEntry): Promise<void> => {
    const key = wpCacheKey(e.game, e.wpKey);
    try {
        await safeCache().setItem(key, e);
        console.log(`[calc缓存] 已写入武器缓存 ${key}（${e.wpItemIds.length} 个素材）`);
    } catch (err) {
        console.error(`[calc缓存] 写入武器缓存失败（可能 localStorage 配额超限）key=${key}`, err);
    }
};

// ⚠️ 各游戏 calc 响应的 consume 字段名 / 素材 id 键名不同（HSR: equipment_consume + item_id；
// ZZZ: weapon_consume + id），故「如何从响应提取素材 id」交由各游戏的 CalcConsumeStrategy.charItemIds / wpItemIds 实现，
// 定义在各自的 adapter（hsr/hoyo.ts、zzz/hoyo.ts）。本文件不再写任何 HSR/ZZZ 专属字段名。

/** 本次同步的跨组合覆盖状态（调用方在循环外创建、循环内由本函数改写） */
export interface CalcCacheState {
    /** 是否已拿到新鲜库存（user_owns_materials）；保证每次同步至少一次真实请求 */
    fresh: boolean;
    /** 本次同步累计「已通过真实请求拿到账号级持有量」的素材 item id 集合
     *  = 各真实请求里 avatar/skill/equipment_consume 的 item_id 并集（不是 owns 的 key！owns 仅含持有>0 的子集）*/
    covered: Set<string>;
}

/**
 * 统一的单角色 calc 请求（HSR/ZZZ 共用），「角色/武器」拆分缓存版，采用**策略模式**：
 * 各游戏 calc 响应结构不同，但「缓存/跳过」逻辑一致——把「如何从响应提取素材 id」这一差异封装进
 * `CalcConsumeStrategy`（定义在各自的 adapter：hsr/hoyo.ts、zzz/hoyo.ts）。本函数保持通用，
 * 不写任何 HSR/ZZZ 专属字段名；新增游戏只需在其 adapter 实现一个策略对象，公共方法零改动。
 *
 * - 先分别查 char 缓存（`seelieex:char:<strategy.game>:<charKey>`）与 wp 缓存（`seelieex:wp:<strategy.game>:<wpKey>`）。
 *   若「角色部分命中(charSig 一致) AND 武器部分命中(wpSig 一致) AND 已拿到新鲜库存
 *   AND 本组合 consume 引用的全部素材 ⊆ state.covered（所需素材已被前面角色的真实请求覆盖）」，
 *   则跳过该组合的网络请求。
 * - 否则 POST(body)（body 仍按 API 要求把角色+武器拼一起）→ 判网络/retcode 错误（含 checkLogin 未登录处理）
 *   → 合并 user_owns_materials 进 merged → 通过 `strategy.charItemIds / strategy.wpItemIds` 取本响应素材 id 并入 state.covered
 *   → 把 sig + 素材 id 列表写入 char 缓存与 wp 缓存（不存完整 consume 对象，避免撑爆配额）。
 *
 * 关键口径（2026-08-07 晚修正：覆盖集用 consume 并集而非 user_owns_materials）：
 * 1) avatar/skill_consume 只取决于角色培养目标 → 缓存于 char 命名空间；equipment/weapon_consume 只取决于武器培养目标 → 缓存于 wp 命名空间。
 *    两者独立判重：只要「角色缓存过 AND 武器缓存过」，即便从未一起请求过也可跳过（例：(圆A+武B) 在 (圆A+武A)+(圆B+武B) 之后即可跳过）。
 * 2) 覆盖集 state.covered 来自各真实请求 consume 引用的素材 id 并集（所需素材全集，含用户未持有的）；
 *    跳过要求本组合所有 consume item 都在其中 → 被跳过的组合其「用户持有」素材必已被前面某角色以账号级同值抓到，绝不漏数据。
 * 3) user_owns_materials 随时变化 → 绝不缓存；最终入库用的是其实时值。
 *
 * @param strategy 各游戏响应的素材 id 提取策略（含 game 命名空间、gameName 文案、charItemIds / wpItemIds 提取器）。
 * @param state 调用方传入的跨组合覆盖状态（fresh + covered），本函数按需改写。
 * @param charKey 角色标识（HSR=avatar.item_id / ZZZ=avatar_id）。
 * @param charSig 角色培养目标签名（由调用方用 calcSig 计算）。
 * @param wpKey 武器标识（HSR=equipment.item_id / ZZZ=weapon_id）；无武器传 null。
 * @param wpSig 武器培养目标签名（无武器传 null）。
 * @returns true 成功并入（或命中覆盖跳过）；false 失败（已 warn）。调用方负责 computed++ / 进度日志 / 节流 sleep。
 */
export interface CalcConsumeStrategy {
    /** 游戏标识，用于缓存 key 命名空间：seelieex:char:<game>:<charKey> / seelieex:wp:<game>:<wpKey> */
    readonly game: string;
    /** 游戏中文名，用于未登录等提示文案 */
    readonly gameName: string;
    /** 从 calc 响应 data 提取「角色部分」引用的全部素材 id（avatar_consume + skill_consume），去重为字符串数组 */
    charItemIds(data: any): string[];
    /** 从 calc 响应 data 提取「武器部分」引用的全部素材 id（equipment_consume / weapon_consume），去重为字符串数组 */
    wpItemIds(data: any): string[];
}

export const postCalcAndMerge = async (
    strategy: CalcConsumeStrategy,
    url: string,
    body: any,
    h: import("axios").AxiosRequestHeaders,
    label: string,
    calcPageUrl: string,
    merged: Record<number, number>,
    state: CalcCacheState,
    charKey: string | number,
    charSig: string,
    wpKey: string | number | null,
    wpSig: string | null,
): Promise<boolean> => {
    const {game, gameName} = strategy;
    // 跳过判据：角色部分与武器部分都命中缓存 + 已拿到新鲜库存 + 本组合「所需素材」均已被本次同步其他真实请求覆盖。
    // 覆盖集 state.covered = 已抓取角色 consume 引用的全部素材 id 并集（含用户未持有的），故跳过绝不漏数据。
    const charCached = await readCharCache(game, charKey);
    const charHit = !!charCached && charCached.sig === charSig;
    const wpCached = wpKey == null ? null : await readWpCache(game, wpKey);
    const wpHit = wpKey == null || (!!wpCached && wpCached.sig === wpSig);
    if (state.fresh && charHit && wpHit) {
        const comboIds = [
            ...(charCached?.charItemIds || []),
            ...(wpCached?.wpItemIds || []),
        ];
        if (comboIds.length && comboIds.every(id => state.covered.has(id))) {
            console.log(`[${label}] 角色 ${charKey}${wpKey != null ? " + 武器 " + wpKey : ""} 所需素材均已被本次同步其他角色覆盖（consume 已缓存），跳过接口请求`);
            return true;
        }
    }
    const [err, res] = await to(axios.post(url, JSON.stringify(body), {
        timeout: 8000,
        headers: {...h, "content-type": "application/json"} as unknown as import("axios").AxiosRequestHeaders,
    }));
    if (err) {
        console.warn(`[${label}] 角色 ${charKey} 计算失败`, err?.message || err);
        return false;
    }
    const {status, data: resData} = await res;
    if (status !== 200 || resData?.retcode !== 0) {
        checkLogin(resData?.retcode, gameName, calcPageUrl);
        console.warn(`[${label}] 角色 ${charKey} 计算错误 retcode=${resData?.retcode}`);
        return false;
    }
    const data = resData?.data || {};
    // user_owns_materials：本角色实际持有的素材（key=素材id，value=账号级持有量，跨角色相同）→ 并取最大值（不缓存）
    const mats = data.user_owns_materials || {};
    mergeMaterialsMax(merged, mats);
    // 累计覆盖集：并入本角色 consume 引用的全部素材 id（含用户未持有的；这才是「所需素材」全集，用于跳过判据）。
    // 提取方式交由 strategy（各游戏响应字段名不同），本函数不写任何 HSR/ZZZ 专属字段名。
    const charItemIds = strategy.charItemIds(data);
    charItemIds.forEach(id => state.covered.add(id));
    const wpItemIds = strategy.wpItemIds(data);
    wpItemIds.forEach(id => state.covered.add(id));
    // 写缓存：角色部分 + 武器部分分别落盘（只存 sig + 素材 id 列表，不存完整 consume 对象，避免撑爆 localStorage 配额），供后续同步拆分判重
    await writeCharCache({
        v: CALC_CACHE_VERSION,
        sig: charSig,
        game,
        charKey,
        charItemIds,
        ts: Date.now(),
    });
    if (wpKey != null) {
        await writeWpCache({
            v: CALC_CACHE_VERSION,
            sig: wpSig ?? "",
            game,
            wpKey,
            wpItemIds,
            ts: Date.now(),
        });
    }
    // 标记本次同步已获得新鲜库存，其后被覆盖的同条件组合可跳过
    state.fresh = true;
    return true;
};

/** 入库结果条目（三条线统一形状，GI 通过 extra 追加 sort/max） */
export interface InventoryWriteResult {
    type: string;
    item: string;
    tier: number;
    value: number;
    mod: number;

    [k: string]: any;
}

/**
 * 把 merged（素材 id→value，已取最大值）折算写入 seelie 库存。
 * @param merged 素材 id → 库存值
 * @param itemLib seelie 页面 items 库
 * @param specialMap 特例 id→{type,key,tier}；其余走 findItemMatch(itemLib)
 * @param sourceLabel 日志前缀
 * @param extra 可选，给入库结果附加字段（GI 需要 sort/max）
 */
export const writeMergedToSeelieInventory = (
    merged: Record<number, number>,
    itemLib: SeelieItems,
    specialMap: Record<number, MaterialMatch>,
    sourceLabel: string,
    extra?: (id: number, value: number, match: MaterialMatch) => Record<string, any>
): InventoryWriteResult[] => {
    const results: InventoryWriteResult[] = [];
    for (const [idStr, value] of Object.entries(merged)) {
        const id = Number(idStr);
        const match = specialMap[id] || findItemMatch(itemLib, id);
        if (!match) {
            console.warn(`${sourceLabel} 未匹配素材 id=${id}`);
            continue;
        }
        const {type, key, tier} = match;
        const f = seelieGetInventory(type, key, tier);
        results.push({
            type,
            item: key,
            tier,
            value,
            mod: value - (f ?? 0),
            ...(extra ? extra(id, value, match) : {}),
        });
        seelieSetInventory(type, key, tier, value);
    }
    console.log(`${sourceLabel} 已写入 ${results.length} 条素材到 seelie 库存`);
    return results;
};

/**
 * 1 分钟节流包裹：冷却期内 alert 并返回 {ok:false,skipped:true,reason:"节流"}，
 * 否则执行 fn 并在成功后记录时间戳。
 */
export const withThrottle = async (
    key: string,
    label: string,
    fn: (uid: string, region: string) => Promise<any>,
    uid: string,
    region: string,
    cooldownMs = 60_000
): Promise<any> => {
    const last = Number(await safeCache().getItem(key) || 0);
    if (last && Date.now() - last < cooldownMs) {
        const wait = Math.ceil((cooldownMs - (Date.now() - last)) / 1000);
        alert(`请稍候 ${wait}s 再同步（${label} 1 分钟节流）`);
        return {ok: false, skipped: true, reason: "节流"};
    }
    const results = await fn(uid, region);
    await safeCache().setItem(key, Date.now().toString());
    return results;
};
