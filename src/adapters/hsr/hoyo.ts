import Role = mihoyo.Role;
import Data = mihoyo.Data;
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";

import axios, {AxiosAdapter} from "axios";
import Avatar = mihoyo.Avatar;
import HSRCharacterData = mihoyo.HSRCharacterData;
import {headers, to, getFp, seelieGetInventory, seelieSetInventory} from "../common";
import {getItemsFromPage, findItemMatch, SeelieItems} from "../genshin/hoyo";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/rpgcalc/avatar/list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/rpgcalc/avatar/detail'

const requestPageSize = 50;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let url = CHARACTERS_URL;
    let game = "hkrpg";
    let params = `?game=${game}&uid=${uid}&region=${region}&lang=zh-cn&tab_from=TabOwned&page=${page}&size=100`
    const [err, res] = await to(axios.get(url + params, {
        headers: headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<Avatar>;
                return characterList;
            }
        }
    }
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Avatar, uid: string, region: string) => {
    const {item_id: id} = character;
    let game = "hkrpg";
    const params = `?game=${game}&lang=zh-cn&item_id=${id}&tab_from=TabOwned&change_target_level=0&uid=${uid}&region=${region}`
    let URL = CHARACTERS_DETAIL_URL;

    const [err, res] = await to(axios.get(URL + params, {
        headers: headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const characterData = await data as HSRCharacterData;
                // return {character, ...characterData} as CharacterDataEx;
                return characterData;
            }
        }
    } else {
        console.error(err)
    }
};

export const getDetailList = async (game_uid: string, region: string) => {

    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());

    const characters: Avatar[] = [];
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

// ===== HSR 素材/库存同步（对标参考站 syncHSR：calc/compute 单 avatar，逐角色循环）=====
const HSR_LIST_URL = 'https://api-takumi.mihoyo.com/event/rpgcultivate/eruditewuu/avatar/list';
const HSR_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/rpgcultivate/calc/avatar/detail';
const HSR_COMPUTE_URL = 'https://api-takumi.mihoyo.com/event/rpgcultivate/calc/compute';
const HSR_REQ_DELAY = 400; // 请求间短间隔(ms)，避免频限

const buildHsrHeaders = async () => {
    const fp = await getFp();
    const deviceId = localStorage.getItem("mysDeviceId") || fp;
    return {
        ...headers,
        "x-rpc-device_fp": fp,
        "x-rpc-device_id": deviceId,
        "x-rpc-lang": "zh-cn",
        "x-rpc-page": "v4.4.4__#/tools/calculation",
        "x-rpc-platform": "4",
        "x-rpc-view_source": "1",
    } as unknown as import("axios").AxiosRequestHeaders;
};

// 全角色列表（不含 DS，走 act-api 国服 event 接口；badge_region/badge_uid 放 query）
const getHsrAllCharacters = async (uid: string, region: string): Promise<any[]> => {
    const h = await buildHsrHeaders();
    const params = `?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}`;
    const [err, res] = await to(axios.get(HSR_LIST_URL + params, {headers: h}));
    if (err) {
        console.error("[HSR素材] 角色列表获取失败", err);
        throw err;
    }
    const {status, data: resData} = await res;
    if (status !== 200 || resData?.retcode !== 0) {
        throw new Error(`[HSR素材] 角色列表返回错误 retcode=${resData?.retcode}: ${resData?.message || ""}`);
    }
    return (resData?.data?.avatar_list || []) as any[];
};

// 逐角色详情（技能/光锥 point_id + max_level），单条失败不阻塞
const getHsrCalcDetail = async (item_id: string, uid: string, region: string): Promise<any | null> => {
    const h = await buildHsrHeaders();
    const params = `?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}&item_id=${item_id}&change_target_level=0`;
    const [err, res] = await to(axios.get(HSR_DETAIL_URL + params, {headers: h}));
    if (err) {
        console.warn(`[HSR素材] 角色 ${item_id} 详情失败`, err?.message || err);
        return null;
    }
    const {status, data: resData} = await res;
    if (status !== 200 || resData?.retcode !== 0) {
        console.warn(`[HSR素材] 角色 ${item_id} 详情错误 retcode=${resData?.retcode}`);
        return null;
    }
    return resData?.data as any;
};

// HSR 素材 id → seelie type/key/tier（复用页面 items 库；特例 信用点 id=2）
const mapHsrMaterial = (itemLib: SeelieItems, id: number) => {
    if (id === 2) return {type: "credit", key: "credit", tier: 0};
    return findItemMatch(itemLib, id);
};

export const batchUpdateInventoryHSR = async (uid: string, region: string) => {
    // 1. 全角色列表
    const allChars = await getHsrAllCharacters(uid, region);
    if (!allChars.length) throw new Error("[HSR素材] 未获取到任何 HSR 角色");
    console.log(`[HSR素材] 全角色 ${allChars.length} 个`);

    // 2. 逐角色详情（并行分批，取 skill/equipment 的 item_id 与 max_level），全部强转 cur=1
    const details: any[] = [];
    const D_BATCH = 8;
    for (let i = 0; i < allChars.length; i += D_BATCH) {
        const slice = allChars.slice(i, i + D_BATCH);
        const part = await Promise.all(slice.map((c: any) => getHsrCalcDetail(String(c.item_id), uid, region)));
        details.push(...part.filter(Boolean));
        if (i + D_BATCH < allChars.length) await new Promise(r => setTimeout(r, HSR_REQ_DELAY));
    }
    console.log(`[HSR素材] 拿到详情 ${details.length} 个`);

    // 3. 逐角色组装 calc/compute 入参（单 avatar）并串行计算，收集 user_owns_materials；跨角色同素材取最大值
    const pageItems = getItemsFromPage();
    const itemLib = (pageItems || {}) as SeelieItems;
    console.log(`[HSR素材] items 来源：${pageItems ? "页面运行时" : "无（findItemMatch 可能空匹配）"}，共 ${Object.keys(itemLib).length} 条`);

    const h = await buildHsrHeaders();
    const merged: Record<number, number> = {};
    let computed = 0;
    for (const d of details) {
        const avatar = d.avatar || {};
        // 真实 detail 响应：技能分布在 data.skills / skills_other / skills_servant / skills_special，
        // 字段为 point_id（非 item_id）；skills_other 为普攻/属性节点(max_level=1，折算为无操作)
        const allSkills = [
            ...(d.skills || []),
            ...(d.skills_other || []),
            ...(d.skills_servant || []),
            ...(d.skills_special || []),
        ];
        const body: any = {
            game: "hkrpg",
            avatar: {
                item_id: String(avatar.item_id),
                cur_level: 1,
                target_level: avatar.max_level || 80,
            },
            skill_list: allSkills.map((s: any) => ({
                item_id: String(s.point_id),
                cur_level: 1,
                target_level: s.max_level || 1,
            })),
            uid,
            region,
        };
        if (d.equipment && d.equipment.item_id) {
            body.equipment = {
                item_id: String(d.equipment.item_id),
                cur_level: 1,
                target_level: d.equipment.max_level || 80,
            };
        }

        const url = `${HSR_COMPUTE_URL}?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}&noSessionRetry=true`;
        const [err, res] = await to(axios.post(url, JSON.stringify(body), {
            timeout: 8000,
            headers: {...h, "content-type": "application/json"} as unknown as import("axios").AxiosRequestHeaders,
        }));
        if (err) {
            console.warn(`[HSR素材] 角色 ${avatar.item_id} 计算失败`, err?.message || err);
            continue;
        }
        const {status, data: resData} = await res;
        if (status !== 200 || resData?.retcode !== 0) {
            console.warn(`[HSR素材] 角色 ${avatar.item_id} 计算错误 retcode=${resData?.retcode}`);
            continue;
        }
        const mats = resData?.data?.user_owns_materials || {};
        for (const [k, v] of Object.entries(mats)) {
            const id = Number(k);
            const val = Number(v);
            if (!Number.isFinite(id) || !Number.isFinite(val)) continue;
            if (!(id in merged) || val > merged[id]) merged[id] = val;
        }
        computed++;
        if (computed % 10 === 0) console.log(`[HSR素材] 已计算 ${computed}/${details.length}`);
        await new Promise(r => setTimeout(r, HSR_REQ_DELAY));
    }
    if (!Object.keys(merged).length) throw new Error("[HSR素材] 未计算出任何素材（请检查接口/items 库）");

    // 4. 折算入库：素材 id → seelie type/key/tier → seelieSetInventory（value 取跨角色最大值）
    const results: any[] = [];
    for (const [idStr, value] of Object.entries(merged)) {
        const id = Number(idStr);
        const match = mapHsrMaterial(itemLib, id);
        if (!match) {
            console.warn(`[HSR素材] 未匹配素材 id=${id}`);
            continue;
        }
        const {type, key, tier} = match;
        const f = seelieGetInventory(type, key, tier);
        results.push({type, item: key, tier, value, mod: value - (f ?? 0)});
        seelieSetInventory(type, key, tier, value);
    }
    console.log(`[HSR素材] 已写入 ${results.length} 条素材到 seelie 库存`);
    return {ok: true, count: results.length, source: pageItems ? "page" : "none"};
};


