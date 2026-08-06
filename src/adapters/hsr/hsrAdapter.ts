// src/adapters/hsr/hsrAdapter.ts
import {GameAdapter, GameType, GoalTypeConfig} from '../game';
import {getDetailList as getHsrDetailList, batchUpdateInventoryHSR} from './hoyo';
import {addCharacter, batchUpdateCharacter, batchUpdateTrace, batchUpdateWeapon, characterStatusList} from './seelie';
import {BaseAdapter} from "../baseAdapter";
import {withThrottle} from "../inventory-common";
import {HSR_AVATAR_DETAIL_URL, HSR_AVATAR_LIST_URL, HSR_CALC_PAGE_URL, HSR_COMPUTE_URL} from "../apiUrls";
import {reconcileWeaponOwnership, OwnershipRecorder} from "../common";
import localforage from "localforage";

export class HsrAdapter extends BaseAdapter implements GameAdapter {

    getGameName(): string {
        return GameType.HSR;
    }

    getApiConfig() {
        return {
            calcPageUrl: HSR_CALC_PAGE_URL,
            gameBiz: 'hkrpg_cn',
            charactersUrl: HSR_AVATAR_LIST_URL,         // rpgcultivate/avatar/list（act-api，data.avatars + first_meet_time/is_own 判拥有）
            charactersDetailUrl: HSR_AVATAR_DETAIL_URL, // rpgcultivate/calc/avatar/detail（真实养成状态，素材计算取 max_level）
            computeUrl: HSR_COMPUTE_URL,
        };
    }

    async getCharacterDetails(uid: string, region: string) {
        return getHsrDetailList(uid, region, this.getApiConfig());
    }

    async syncCharacters(res: any[], associateWeapon = true) {
        console.group("返回数据");
        console.groupCollapsed("角色");
        console.table(res.map((a) => a.avatar));
        console.groupEnd();
        console.groupCollapsed("光锥");
        console.table(res.map((a) => a.equipment));
        console.groupEnd();
        console.groupCollapsed("角色天赋");
        res.forEach((c) => {
            const name = c.avatar.item_name;
            console.groupCollapsed(name);
            console.table(c.skills);
            console.groupEnd();
        });
        console.groupEnd();
        console.groupCollapsed("角色额外天赋(仅展示不做处理)");
        res.forEach((c) => {
            const name = c.avatar.item_name;
            console.groupCollapsed(name);
            console.table(c.skills_other);
            console.groupEnd();
        });
        console.groupEnd();
        console.groupEnd();
        const recorder: OwnershipRecorder = {synced: new Set(), worn: new Map()};
        for (let v of res) {
            // first_meet_time===0 的未拥有角色不同步进 seelie 目标（isOwned 由 getDetailList 透传）
            if (!v.isOwned) continue;
            await addCharacter(v, recorder, associateWeapon)
        }
        // 同步末尾校准：回收「角色已脱下」的武器/光锥过期归属（仅关联模式需要）
        if (associateWeapon) {
            await reconcileWeaponOwnership(recorder.synced, recorder.worn);
        }
    }

    protected importSeelieMethods() {
        return {batchUpdateCharacter, batchUpdateWeapon};
    }

    batchUpdateTalent = (all: boolean, normal: number, skill: number, burst: number, t: number, petSkill = 0, petTalent = 0, elation = 0): void => {
        batchUpdateTrace(all, normal, skill, burst, t, petSkill, petTalent, elation);
    };

    getCharacterStatusList() {
        return characterStatusList;
    }

    getInactiveConfig: () => GoalTypeConfig[] = () => {
        const HSR_INACTIVE_CONFIG: GoalTypeConfig[] = [
            {type: "character", identifierKey: "character"}, // 角色目标
            {
                type: "trace",
                identifierKey: "character",
                isTalent: true,
                talentKeys: ['basic', 'skill', 'ultimate', 'talent', 'pet_talent', 'pet_skill']
            }, // 行迹目标
            {type: "cone", identifierKey: "id"} // 光锥目标（标识键为 id）
        ];
        return HSR_INACTIVE_CONFIG;
    }

    async getItem(key: string): Promise<any> {
        return localforage.getItem(key);
    }

    async setItem(key: string, value: any): Promise<void> {
        return localforage.setItem(key, value);
    }

    // 1 分钟节流（避免频繁打米游社 calc/compute；独立 key 不干扰 GI 的 last-sync）；prefetched = 角色同步已拉取详情，复用跳过 list/detail
    batchUpdateInventory = async (uid: string, region: string, prefetched?: any[]) => {
        const cfg = this.getApiConfig();
        return withThrottle("hsr-last-sync", "HSR 素材同步", (u, r) => batchUpdateInventoryHSR(u, r, cfg, prefetched), uid, region);
    }
}
