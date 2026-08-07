import Data = mihoyo.Data;
import axios from "axios";
import Avatar = mihoyo.ZZZAvatar;
import CharacterData = mihoyo.ZZZCharacterData;
import {getFp, headers, to, checkLogin} from "../common";
import {GameApiConfig} from "../game";
import {getItemsFromPage} from "../items";
import {
    MaterialMatch,
    CalcConsumeStrategy,
    getFpDeviceId,
    loadSeelieItems,
    sleepWithJitter,
    writeMergedToSeelieInventory,
    buildBaseHeaders,
    postCalcAndMerge,
    calcSig,
} from "../inventory-common";


// axios.defaults（adapter/withCredentials）已由 ../common 统一设置，此处不再重复。

// ZZZ calc（avatar_calc）响应字段名与 HSR 不同：
//  - 角色部分 avatar_consume/skill_consume、武器部分 weapon_consume（注意不是 equipment_consume）
//  - 素材 id 键为 id（不是 item_id）
// 本策略仅负责「从响应抽取素材 id」，缓存/跳过逻辑全在 inventory-common 的 postCalcAndMerge（策略模式）。
const zzzCalcStrategy: CalcConsumeStrategy = {
    game: "zzz",
    gameName: "绝区零",
    charItemIds(data) {
        const ids = new Set<string>();
        for (const key of ["avatar_consume", "skill_consume"] as const) {
            for (const it of (data?.[key]) || []) {
                const id = it?.id;
                if (id !== undefined && id !== null && id !== "") ids.add(String(id));
            }
        }
        return [...ids];
    },
    wpItemIds(data) {
        const ids = new Set<string>();
        for (const it of (data?.weapon_consume) || []) {
            const id = it?.id;
            if (id !== undefined && id !== null && id !== "") ids.add(String(id));
        }
        return [...ids];
    },
};

const requestPageSize = 50;

const getCharacters = async (uid: string, region: string, page = 1, cfg: GameApiConfig) => {

    let url = cfg.charactersUrl;
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
            // 非零 retcode（含 -100 未登录）：交给 checkLogin 处理（未登录会提示+跳转计算器页面+抛错）
            checkLogin(retcode, "绝区零", cfg.calcPageUrl);
            console.warn(`[ZZZ] 角色列表获取失败 retcode=${retcode}: ${resData?.message || ""}`);
        }
    }
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (ids: number[], uid: string, region: string, cfg: GameApiConfig): Promise<CharacterData[] | null> => {
    const params = `?uid=${uid}&region=${region}`
    let URL = cfg.charactersDetailUrl!;
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
            // 非零 retcode（含 -100 未登录）：交给 checkLogin 处理（未登录会提示+跳转计算器页面+抛错）
            checkLogin(retcode, "绝区零", cfg.calcPageUrl);
            console.warn(`[ZZZ] 角色详情获取失败 retcode=${retcode}: ${resData?.message || ""}`);
        }
    } else {
        console.error(err)
    }
    return null
};

export const getDetailList = async (game_uid: string, region: string, cfg: GameApiConfig) => {

    let maxPageSize = 1; // ZZZ 角色列表单次返回全部，分页上界固定为 1（已无打包 JSON 的 charactersNum 依赖）
    let idxs = Array.from(new Array(maxPageSize).keys());

    const characters: Avatar[] = [];
    for await (let i of idxs) {
        let characterData = await getCharacters(game_uid, region, i + 1, cfg);
        characters.push.apply(characters, characterData.filter(a => a.unlocked).map(a => a.avatar))
    }

    let ids = characters.map(a => a.id);

    // 将ids分成10个一组进行请求；单批失败不再静默丢弃，累计后告警
    const batchSize = 10;
    const allResults: CharacterData[] = [];
    let dropped = 0;

    for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        const batchResults = await getCharacterDetail(batchIds, game_uid, region, cfg);
        if (batchResults) {
            allResults.push(...batchResults);
        } else {
            dropped += batchIds.length;
        }
    }
    if (dropped) {
        console.warn(`[ZZZ] ${dropped} 个角色详情获取失败，已跳过（不影响其余角色同步）`);
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
// URL 由调用方（zzzAdapter）通过 GameApiConfig（cfg）传入，不再直接 import apiUrls。
// ZZZ 的 avatar_calc 频限比 HSR 更严：基础间隔 800ms + 0~400ms 随机抖动，
// 且在「每次请求之前」等待（含首次与末次），避免尾部请求被频限拒绝。
const ZZZ_REQ_DELAY = 800; // 请求前基础间隔(ms)
const ZZZ_REQ_JITTER = 400; // 随机抖动上限(ms)

const buildZzzHeaders = async () => {
    const {fp, deviceId} = await getFpDeviceId();
    return {
        ...buildBaseHeaders(fp, deviceId),
        "x-rpc-cultivate_source": "pc",
        "x-rpc-geetest_ext": JSON.stringify({gameId: 8, page: "v2.6.8_apps-h_#", viewSource: 1, actionSource: 132}),
        "x-rpc-is_teaser": "1",
        "x-rpc-lang": "zh-cn",
        "x-rpc-lrsag": "",
        "x-rpc-page": "v2.6.8_apps-h_#",
    } as unknown as import("axios").AxiosRequestHeaders;
};

// ZZZ 素材 id → seelie type/key/tier 的特例表（其余走页面 items 库匹配；丁尼 id=10 → denny，对应 seelie 官方 isCurrency 白名单）
const ZZZ_SPECIAL: Record<number, MaterialMatch> = {
    10: {type: "denny", key: "denny", tier: 0},
};

// ZZZ avatar_calc 技能目标上限（固定，不随角色/命座变化）：
//   - 普通技 skill_type ∈ {0,1,2,3,6} 计算器封顶 = 12
//   - 核心技 skill_type = 5 封顶 = 7
// 更高的数值来自命座/影画追加等级，计算器不参与折算，故写死而不读 item_info。
// 官方 syncZZZ 的 skills 仅含 0,1,2,3,5,6 六种（无 type7），本模板与之对齐。
const ZZZ_CALC_SKILLS: ReadonlyArray<{ skill_type: number; level: number; init_level: number }> = [
    {skill_type: 0, level: 12, init_level: 1},
    {skill_type: 1, level: 12, init_level: 1},
    {skill_type: 2, level: 12, init_level: 1},
    {skill_type: 3, level: 12, init_level: 1},
    {skill_type: 5, level: 7, init_level: 1},
    {skill_type: 6, level: 12, init_level: 1},
];

export const batchUpdateInventoryZZZ = async (uid: string, region: string, cfg: GameApiConfig, prefetched?: any[]) => {
    // 1. ZZZ calc 仅需「全量 list」(avatar_basic_list)，无需逐角色 detail(batch_avatar_detail_v2)。
    //    prefetched（角色同步已拉取的详情）也只取 avatar.id 与 weapon.id，忽略 item_info（含命座/影画追加，不参与 calc）。
    //    无 prefetched 时只拉 list，避免多余的 detail 请求。
    const raw = (prefetched && prefetched.length)
        ? prefetched as any[]
        : await getCharacters(uid, region, 1, cfg) as any[];
    // 仅保留已拥有角色（list / detail 项均有 unlocked 字段）
    const list = raw.filter((d: any) => d.unlocked !== false);
    if (!list.length) throw new Error("[ZZZ素材] 未获取到任何 ZZZ 角色");
    console.log(`[ZZZ素材] 已加载 ${list.length} 个角色（${prefetched?.length ? "复用角色同步数据" : "仅全量 list"}）`);

    // 2. 复用页面 items 库（含 ZZZ 素材）
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[ZZZ素材]", pageItems);
    const source = pageItems ? "page" : "none";

    // 3. 逐角色组装 avatar_calc 入参（单 avatar，强制 current=1、target=max）并串行计算，
    //    收集 user_owns_materials；跨角色同素材取最大值
    const h = await buildZzzHeaders();
    const merged: Record<number, number> = {};
    let computed = 0;
    // 跨组合素材覆盖状态：fresh=是否已拿到新鲜库存；covered=本同步已抓取角色 consume 引用的素材 id 并集（用于跳过判据）
    const calcState: import("../inventory-common").CalcCacheState = {fresh: false, covered: new Set<string>()};
    for (const d of list) {
        // 每次 avatar_calc 请求前先等待（含首次/末次），带抖动错开频限窗口
        await sleepWithJitter(ZZZ_REQ_DELAY, ZZZ_REQ_JITTER);
        // 兼容 list 与 detail 两种来源：list 项结构为 {avatar, weapon, unlocked}，detail 项额外含 signature_weapon_id / item_info
        const avatar = d.avatar || d;
        const avatarId = avatar?.id ?? d.id;
        // 技能目标固定为「计算器上限」：普通技(0/1/2/3/6)=12，核心技(type5)=7；
        // 角色/武器等级目标固定为满级 60（不依赖 item_info，命座/影画追加的更高值不参与 calc）。
        const skills = ZZZ_CALC_SKILLS.map((s) => ({...s}));
        const weaponId = d.signature_weapon_id || d.weapon?.id || avatar?.weapon?.id;
        const body: any = {
            avatar_id: String(avatarId),
            avatar_level: 60,
            avatar_current_level: 1,
            avatar_current_promotes: 0,
            skills,
            weapon_info: weaponId ? {
                weapon_id: String(weaponId),
                weapon_level: 60,
                weapon_promotes: 0,
                weapon_init_level: 0,
            } : undefined,
        };
        // 角色部分签名：avatar_id + 等级/技能（决定 avatar/skill_consume）；武器部分签名：weapon_info（决定 equipment_consume）
        const charSig = calcSig({
            avatar_id: body.avatar_id,
            avatar_level: body.avatar_level,
            avatar_current_level: body.avatar_current_level,
            avatar_current_promotes: body.avatar_current_promotes,
            skills: body.skills,
        });
        const wpKey = weaponId != null ? weaponId : null;
        const wpSig = wpKey != null ? calcSig(body.weapon_info) : null;

        const url = `${cfg.computeUrl}?uid=${uid}&region=${region}`;
        const ok = await postCalcAndMerge(zzzCalcStrategy, url, body, h, "[ZZZ素材]", cfg.calcPageUrl, merged, calcState, avatarId, charSig, wpKey, wpSig);
        if (ok) {
            computed++;
            if (computed % 10 === 0) console.log(`[ZZZ素材] 已计算 ${computed}/${list.length}`);
        }
    }
    if (!Object.keys(merged).length) throw new Error("[ZZZ素材] 未计算出任何素材（请检查接口/items 库）");

    // 4. 折算入库：素材 id → seelie type/key/tier → seelieSetInventory（value 取跨角色最大值）
    const results = writeMergedToSeelieInventory(merged, itemLib, ZZZ_SPECIAL, "[ZZZ素材]");
    return {ok: true, count: results.length, source};
};


