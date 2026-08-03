import Data = mihoyo.Data;
import adapter from "axios-userscript-adapter/dist/esm";

import axios, {AxiosAdapter} from "axios";
import Avatar = mihoyo.ZZZAvatar;
import CharacterData = mihoyo.ZZZCharacterData;
import {getFp, headers, to, seelieGetInventory, seelieSetInventory} from "../common";
import {getItemsFromPage, findItemMatch, SeelieItems} from "../genshin/hoyo";


axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2'

const requestPageSize = 50;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let url = CHARACTERS_URL;
    let params = `?uid=${uid}&region=${region}`
    let fp = await getFp();
    const [err, res] = await to(axios.get(url + params, {
        headers: {
            ...headers,
            "x-rpc-device_fp": fp
        },
        timeout: 10000,
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<CharacterData>;
                return characterList;
            }
        }
    }
    alert("请确认已登录活动页面且绑定账户!")
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (ids: number[], uid: string, region: string) => {
    const params = `?uid=${uid}&region=${region}`
    let URL = CHARACTERS_DETAIL_URL;
    let fp = await getFp();
    let avatarList = ids.map(id => ({
        avatar_id: id,
        is_teaser: false,
        teaser_need_weapon: false,
        teaser_sp_skill: false
    }))
    const [err, res] = await to(axios.post(URL + params, {
            avatar_list: avatarList,
        },
        {
            headers: {
                ...headers,
                "x-rpc-device_fp": fp
            },
            timeout: 10000,
        }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<CharacterData>;
                return characterList;
            }
        }
    } else {
        console.error(err)
    }
    return [] as CharacterData[]
};

export const getDetailList = async (game_uid: string, region: string) => {

    let maxPageSize = 1;//Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());

    const characters: Avatar[] = [];
    for await (let i of idxs) {
        let characterData = await getCharacters(game_uid, region, i + 1);
        characters.push.apply(characters, characterData.filter(a => a.unlocked).map(a => a.avatar))
    }

    let ids = characters.map(a => a.id);

    // 将ids分成10个一组进行请求
    const batchSize = 10;
    const allResults: CharacterData[] = [];

    for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        const batchResults = await getCharacterDetail(batchIds, game_uid, region);
        allResults.push(...batchResults);
    }

    return allResults;
    // const detailList = [];
    // for await (let d of details) {
    //     if (!!d) {
    //         detailList.push(d);
    //     }
    // }
    // return detailList;
}

// ===== ZZZ 素材/库存同步（对标 HSR：nap_cultivate_tool avatar_calc 单 avatar，逐角色循环）=====
const ZZZ_CALC_URL = 'https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_calc';
const ZZZ_REQ_DELAY = 400; // 请求间短间隔(ms)，避免频限

const buildZzzHeaders = async () => {
    const fp = await getFp();
    const deviceId = localStorage.getItem("mysDeviceId") || fp;
    return {
        ...headers,
        "x-rpc-cultivate_source": "pc",
        "x-rpc-device_fp": fp,
        "x-rpc-device_id": deviceId,
        "x-rpc-geetest_ext": JSON.stringify({gameId: 8, page: "v2.6.8_apps-h_#", viewSource: 1, actionSource: 132}),
        "x-rpc-is_teaser": "1",
        "x-rpc-lang": "zh-cn",
        "x-rpc-lrsag": "",
        "x-rpc-page": "v2.6.8_apps-h_#",
        "x-rpc-platform": "4",
    } as unknown as import("axios").AxiosRequestHeaders;
};

// ZZZ 素材 id → seelie type/key/tier（复用页面 items 库；特例 丁尼 id=10 → credit）
const mapZzzMaterial = (itemLib: SeelieItems, id: number) => {
    if (id === 10) return {type: "credit", key: "credit", tier: 0};
    return findItemMatch(itemLib, id);
};

export const batchUpdateInventoryZZZ = async (uid: string, region: string) => {
    // 1. 复用既有角色详情（avatar_basic_list + batch_avatar_detail_v2），含 item_info 的 max 等级与 signature_weapon_id
    const details = await getDetailList(uid, region) as any[];
    if (!details.length) throw new Error("[ZZZ素材] 未获取到任何 ZZZ 角色");
    console.log(`[ZZZ素材] 角色 ${details.length} 个`);

    // 2. 复用页面 items 库（含 ZZZ 素材）
    const pageItems = getItemsFromPage();
    const itemLib = (pageItems || {}) as SeelieItems;
    console.log(`[ZZZ素材] items 来源：${pageItems ? "页面运行时" : "无（findItemMatch 可能空匹配）"}，共 ${Object.keys(itemLib).length} 条`);

    // 3. 逐角色组装 avatar_calc 入参（单 avatar，强制 current=1、target=max）并串行计算，
    //    收集 user_owns_materials；跨角色同素材取最大值
    const h = await buildZzzHeaders();
    const merged: Record<number, number> = {};
    let computed = 0;
    for (const d of details) {
        const avatar = d.avatar || {};
        const itemInfo = d.item_info || {};
        const avatarLevelMax = itemInfo.avatar_level_max || 60;
        const weaponLevelMax = itemInfo.weapon_level_max || 60;
        const coreLevelMax = itemInfo.skill_core_level_max || 7;
        const normalMax = (itemInfo.skill_normal_level_max || []) as any[];
        const skills: any[] = normalMax.map((s: any) => ({
            skill_type: s.skill_type,
            level: s.level,
            init_level: 1,
        }));
        // 核心技（skill_type=5）不在 normal 列表里，单独补上
        if (!skills.some((s: any) => s.skill_type === 5)) {
            skills.push({skill_type: 5, level: coreLevelMax, init_level: 1});
        }
        const weaponId = d.signature_weapon_id || d.weapon?.id;
        const body: any = {
            avatar_id: String(avatar.id),
            avatar_level: avatarLevelMax,
            avatar_current_level: 1,
            avatar_current_promotes: 0,
            skills,
            weapon_info: weaponId ? {
                weapon_id: String(weaponId),
                weapon_level: weaponLevelMax,
                weapon_promotes: 0,
                weapon_init_level: 0,
            } : undefined,
        };

        const url = `${ZZZ_CALC_URL}?uid=${uid}&region=${region}`;
        const [err, res] = await to(axios.post(url, JSON.stringify(body), {
            timeout: 8000,
            headers: {...h, "content-type": "application/json"} as unknown as import("axios").AxiosRequestHeaders,
        }));
        if (err) {
            console.warn(`[ZZZ素材] 角色 ${avatar.id} 计算失败`, err?.message || err);
            continue;
        }
        const {status, data: resData} = await res;
        if (status !== 200 || resData?.retcode !== 0) {
            console.warn(`[ZZZ素材] 角色 ${avatar.id} 计算错误 retcode=${resData?.retcode}`);
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
        if (computed % 10 === 0) console.log(`[ZZZ素材] 已计算 ${computed}/${details.length}`);
        await new Promise(r => setTimeout(r, ZZZ_REQ_DELAY));
    }
    if (!Object.keys(merged).length) throw new Error("[ZZZ素材] 未计算出任何素材（请检查接口/items 库）");

    // 4. 折算入库：素材 id → seelie type/key/tier → seelieSetInventory（value 取跨角色最大值）
    const results: any[] = [];
    for (const [idStr, value] of Object.entries(merged)) {
        const id = Number(idStr);
        const match = mapZzzMaterial(itemLib, id);
        if (!match) {
            console.warn(`[ZZZ素材] 未匹配素材 id=${id}`);
            continue;
        }
        const {type, key, tier} = match;
        const f = seelieGetInventory(type, key, tier);
        results.push({type, item: key, tier, value, mod: value - (f ?? 0)});
        seelieSetInventory(type, key, tier, value);
    }
    console.log(`[ZZZ素材] 已写入 ${results.length} 条素材到 seelie 库存`);
    return {ok: true, count: results.length, source: pageItems ? "page" : "none"};
};


