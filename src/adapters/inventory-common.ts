// src/adapters/inventory-common.ts
// 三条线（GI / HSR / ZZZ）素材同步的公共逻辑抽取。
// 依赖方向：inventory-common -> {./items, ./common}。
// items 库刻意放在叶子模块 ./items 而非 ./genshin/hoyo，使 genshin/hoyo 可以单向依赖本模块而不成环。
import axios from "axios";
import {SeelieItems, findItemMatch, getItemsFromPage} from "./items";
import {seelieGetInventory, seelieSetInventory, getFp, to, checkLogin, headers} from "./common";

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
 * 统一的单角色 calc 请求（HSR/ZZZ 共用）：
 * POST(body) → 判网络/retcode 错误（含 checkLogin 未登录处理）→ 合并 user_owns_materials 进 merged。
 * @returns true 成功并入；false 跳过（已 warn）。调用方负责 computed++ / 进度日志 / 节流 sleep。
 */
export const postCalcAndMerge = async (
    url: string,
    body: any,
    h: import("axios").AxiosRequestHeaders,
    label: string,
    gameName: string,
    calcPageUrl: string,
    merged: Record<number, number>,
    avatarId: string | number,
): Promise<boolean> => {
    const [err, res] = await to(axios.post(url, JSON.stringify(body), {
        timeout: 8000,
        headers: {...h, "content-type": "application/json"} as unknown as import("axios").AxiosRequestHeaders,
    }));
    if (err) {
        console.warn(`[${label}] 角色 ${avatarId} 计算失败`, err?.message || err);
        return false;
    }
    const {status, data: resData} = await res;
    if (status !== 200 || resData?.retcode !== 0) {
        checkLogin(resData?.retcode, gameName, calcPageUrl);
        console.warn(`[${label}] 角色 ${avatarId} 计算错误 retcode=${resData?.retcode}`);
        return false;
    }
    const mats = resData?.data?.user_owns_materials || {};
    mergeMaterialsMax(merged, mats);
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
    const last = Number(localStorage.getItem(key) || 0);
    if (last && Date.now() - last < cooldownMs) {
        const wait = Math.ceil((cooldownMs - (Date.now() - last)) / 1000);
        alert(`请稍候 ${wait}s 再同步（${label} 1 分钟节流）`);
        return {ok: false, skipped: true, reason: "节流"};
    }
    const results = await fn(uid, region);
    localStorage.setItem(key, Date.now().toString());
    return results;
};
