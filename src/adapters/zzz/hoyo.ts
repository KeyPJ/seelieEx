import Data = mihoyo.Data;
import adapter from "axios-userscript-adapter/dist/esm";

import axios, {AxiosAdapter} from "axios";
import Avatar = mihoyo.ZZZAvatar;
import CharacterData = mihoyo.ZZZCharacterData;
import {getFp, headers, to} from "../common";
import {getItemsFromPage} from "../genshin/hoyo";
import {
    MaterialMatch,
    getFpDeviceId,
    loadSeelieItems,
    mergeMaterialsMax,
    sleepWithJitter,
    writeMergedToSeelieInventory,
} from "../inventory-common";


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

    let maxPageSize = 1; // ZZZ 角色列表单次返回全部，分页上界固定为 1（已无打包 JSON 的 charactersNum 依赖）
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
// ZZZ 的 avatar_calc 频限比 HSR 更严：基础间隔 800ms + 0~400ms 随机抖动，
// 且在「每次请求之前」等待（含首次与末次），避免尾部请求被频限拒绝。
const ZZZ_REQ_DELAY = 800; // 请求前基础间隔(ms)
const ZZZ_REQ_JITTER = 400; // 随机抖动上限(ms)

const buildZzzHeaders = async () => {
    const {fp, deviceId} = await getFpDeviceId();
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

// ZZZ 素材 id → seelie type/key/tier 的特例表（其余走页面 items 库匹配；丁尼 id=10 → denny，对应 seelie 官方 isCurrency 白名单）
const ZZZ_SPECIAL: Record<number, MaterialMatch> = {
    10: {type: "denny", key: "denny", tier: 0},
};

export const batchUpdateInventoryZZZ = async (uid: string, region: string) => {
    // 1. 复用既有角色详情（avatar_basic_list + batch_avatar_detail_v2），含 item_info 的 max 等级与 signature_weapon_id
    const details = await getDetailList(uid, region) as any[];
    if (!details.length) throw new Error("[ZZZ素材] 未获取到任何 ZZZ 角色");
    console.log(`[ZZZ素材] 角色 ${details.length} 个`);

    // 2. 复用页面 items 库（含 ZZZ 素材）
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[ZZZ素材]", pageItems);
    const source = pageItems ? "page" : "none";

    // 3. 逐角色组装 avatar_calc 入参（单 avatar，强制 current=1、target=max）并串行计算，
    //    收集 user_owns_materials；跨角色同素材取最大值
    const h = await buildZzzHeaders();
    const merged: Record<number, number> = {};
    let computed = 0;
    for (const d of details) {
        // 每次 avatar_calc 请求前先等待（含首次/末次），带抖动错开频限窗口
        await sleepWithJitter(ZZZ_REQ_DELAY, ZZZ_REQ_JITTER);
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
        mergeMaterialsMax(merged, mats);
        computed++;
        if (computed % 10 === 0) console.log(`[ZZZ素材] 已计算 ${computed}/${details.length}`);
    }
    if (!Object.keys(merged).length) throw new Error("[ZZZ素材] 未计算出任何素材（请检查接口/items 库）");

    // 4. 折算入库：素材 id → seelie type/key/tier → seelieSetInventory（value 取跨角色最大值）
    const results = writeMergedToSeelieInventory(merged, itemLib, ZZZ_SPECIAL, "[ZZZ素材]");
    return {ok: true, count: results.length, source};
};


