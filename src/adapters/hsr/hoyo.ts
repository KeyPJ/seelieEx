import Role = mihoyo.Role;

import axios from "axios";
import Avatar = mihoyo.Avatar;
import HSRCharacterData = mihoyo.HSRCharacterData;
import {to, checkLogin} from "../common";
import {GameApiConfig} from "../game";
import {getItemsFromPage} from "../items";
import {
    MaterialMatch,
    getFpDeviceId,
    loadSeelieItems,
    sleep,
    writeMergedToSeelieInventory,
    buildBaseHeaders,
    postCalcAndMerge,
} from "../inventory-common";

// axios.defaults（adapter/withCredentials）已由 ../common 统一设置，此处不再重复。

const getCharacters = async (uid: string, region: string, cfg: GameApiConfig): Promise<any[]> => {

    const h = await buildHsrHeaders();
    const params = `?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}`;
    const [err, res] = await to(axios.get(cfg.charactersUrl + params, {headers: h}));
    if (err) {
        console.error("[HSR] 角色列表获取失败", err);
        throw err;
    }
    const {status, data: resData} = await res;
    if (status !== 200 || resData?.retcode !== 0) {
        checkLogin(resData?.retcode, "崩坏：星穹铁道", cfg.calcPageUrl);
        throw new Error(`[HSR] 角色列表返回错误 retcode=${resData?.retcode}: ${resData?.message || ""}`);
    }
    // 返回【全量】角色（含 first_meet_time===0 的未拥有角色），不过滤：
    // - 「是否拥有」严格以 first_meet_time !== 0 为准（is_own 字段不可靠，不能用于判定）；
    // - 角色同步用它过滤（见 getDetailList 的 isOwned 标记 + hsrAdapter.syncCharacters）；
    // - 素材全量计算需要包含所有角色（含未拥有），故此处必须不过滤。
    return resData?.data?.avatars || [];
};

// 统一角色详情（rpgcultivate/calc/avatar/detail）：返回真实养成状态 cur_level/rank + skills/equipment，角色同步与素材同步共用
const getCharacterDetail = async (character: any, uid: string, region: string, cfg: GameApiConfig): Promise<HSRCharacterData | null> => {
    const {item_id: id} = character;
    const h = await buildHsrHeaders();
    const params = `?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}&item_id=${id}&change_target_level=0`;
    const [err, res] = await to(axios.get(cfg.charactersDetailUrl! + params, {headers: h}));
    if (err) {
        console.warn(`[HSR] 角色 ${id} 详情失败`, err?.message || err);
        return null;
    }
    const {status, data: resData} = await res;
    if (status !== 200 || resData?.retcode !== 0) {
        checkLogin(resData?.retcode, "崩坏：星穹铁道", cfg.calcPageUrl);
        console.warn(`[HSR] 角色 ${id} 详情错误 retcode=${resData?.retcode}`);
        return null;
    }
    return resData?.data as HSRCharacterData;
};

export const getDetailList = async (game_uid: string, region: string, cfg: GameApiConfig) => {
    // 单次返回【全量】角色（含未拥有），供「角色同步(仅已拥有)」与「素材全量计算(含未拥有)」共用，避免重复拉取
    const avatars = await getCharacters(game_uid, region, cfg);
    const detailPromises = avatars.map(c => getCharacterDetail(c, game_uid, region, cfg));
    const settled = await Promise.all(detailPromises);
    const detailList: HSRCharacterData[] = [];
    for (let i = 0; i < avatars.length; i++) {
        const d = settled[i];
        if (d) {
            // detail 响应本身不含 first_meet_time，故把「是否拥有」从 list 透传过来，
            // 供 hsrAdapter.syncCharacters 过滤（first_meet_time===0 的未拥有角色不同步进 seelie 目标）。
            // 注意：接口返回的是字符串（"0" / "1784969041"），必须转 number 再判断。
            // 用 > 0 而非 !== 0：语义为「首次相遇时间戳为正数即拥有」，且能防御脏值/负数（NaN>0 与 负数>0 均为 false，安全按未拥有跳过）。
            (d as any).isOwned = Number(avatars[i].first_meet_time || 0) > 0;
            detailList.push(d);
        }
    }
    return detailList;
}

// ===== HSR 素材/库存同步（对标参考站 syncHSR：calc/compute 单 avatar，逐角色循环）=====
// URL 由调用方（hsrAdapter）通过 GameApiConfig（cfg）传入，不再直接 import apiUrls。
const HSR_REQ_DELAY = 400; // 请求间短间隔(ms)，避免频限

const buildHsrHeaders = async () => {
    const {fp, deviceId} = await getFpDeviceId();
    return {
        ...buildBaseHeaders(fp, deviceId),
        "x-rpc-lang": "zh-cn",
        "x-rpc-page": "v4.4.4__#/tools/calculation",
        "x-rpc-view_source": "1",
    } as unknown as import("axios").AxiosRequestHeaders;
};

// （原 getHsrAllCharacters / getHsrCalcDetail 已合并进 getCharacters / getCharacterDetail，统一走 rpgcultivate 一套）

// HSR 素材 id → seelie type/key/tier 的特例表（其余走页面 items 库匹配；信用点 id=2）
const HSR_SPECIAL: Record<number, MaterialMatch> = {
    2: {type: "credit", key: "credit", tier: 0},
};

export const batchUpdateInventoryHSR = async (uid: string, region: string, cfg: GameApiConfig, prefetched?: any[]) => {
    let details: any[] = [];
    if (prefetched && prefetched.length) {
        // 复用角色同步已拉取的【全量】详情（含未拥有角色，first_meet_time=0），
        // 素材全量计算需要所有角色参与，故直接遍历全部，不做拥有过滤。
        details = prefetched;
        console.log(`[HSR素材] 复用角色同步已拉取全量详情 ${details.length} 个，跳过 list/detail 请求`);
    } else {
        // 1. 【全量】角色列表（统一走 rpgcultivate/avatar/list，含 first_meet_time=0 的未拥有角色，参与全量计算）
        const allChars = await getCharacters(uid, region, cfg);
        if (!allChars.length) throw new Error("[HSR素材] 未获取到任何 HSR 角色");
        console.log(`[HSR素材] 全角色 ${allChars.length} 个`);

        // 2. 逐角色详情（并行分批，取 skill/equipment 的 item_id 与 max_level），全部强转 cur=1
        const D_BATCH = 8;
        for (let i = 0; i < allChars.length; i += D_BATCH) {
            const slice = allChars.slice(i, i + D_BATCH);
            const part = await Promise.all(slice.map((c: any) => getCharacterDetail(c, uid, region, cfg)));
            details.push(...part.filter(Boolean));
            if (i + D_BATCH < allChars.length) await sleep(HSR_REQ_DELAY);
        }
        console.log(`[HSR素材] 拿到详情 ${details.length} 个`);
    }

    // 3. 逐角色组装 calc/compute 入参（单 avatar）并串行计算，收集 user_owns_materials；跨角色同素材取最大值
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[HSR素材]", pageItems);
    const source = pageItems ? "page" : "none";

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

        const url = `${cfg.computeUrl}?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}&noSessionRetry=true`;
        const ok = await postCalcAndMerge(url, body, h, "[HSR素材]", "崩坏：星穹铁道", cfg.calcPageUrl, merged, avatar.item_id);
        if (ok) {
            computed++;
            if (computed % 10 === 0) console.log(`[HSR素材] 已计算 ${computed}/${details.length}`);
        }
        await sleep(HSR_REQ_DELAY);
    }
    if (!Object.keys(merged).length) throw new Error("[HSR素材] 未计算出任何素材（请检查接口/items 库）");

    // 4. 折算入库：素材 id → seelie type/key/tier → seelieSetInventory（value 取跨角色最大值）
    const results = writeMergedToSeelieInventory(merged, itemLib, HSR_SPECIAL, "[HSR素材]");
    return {ok: true, count: results.length, source};
};


