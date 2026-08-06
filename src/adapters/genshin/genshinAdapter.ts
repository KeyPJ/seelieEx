// src/adapters/genshinAdapter.ts
import {GameAdapter, GameType, GoalTypeConfig} from '../game';
import {getDetailList as getGenshinDetailList, batchUpdateInventoryGI} from './hoyo';
import {
    addCharacter,
    batchUpdateCharacter,
    batchUpdateTalent,
    batchUpdateWeapon,
    characterStatusList,
} from './seelie';
import {BaseAdapter} from "../baseAdapter";
import {withThrottle} from "../inventory-common";
import {GI_ALL_CHARACTERS_URL, GI_BATCH_COMPUTE_URL, GI_CALC_PAGE_URL, GI_CHARACTERS_URL, GI_ROLE_URL} from "../apiUrls";
import {reconcileWeaponOwnership, OwnershipRecorder} from "../common";


export class GenshinAdapter extends BaseAdapter implements GameAdapter {
    getGameName(): string {
        return GameType.GENSHIN;
    }

    getApiConfig() {
        return {
            calcPageUrl: GI_CALC_PAGE_URL,
            roleUrl: GI_ROLE_URL,
            charactersUrl: GI_CHARACTERS_URL,
            allCharactersUrl: GI_ALL_CHARACTERS_URL,
            computeUrl: GI_BATCH_COMPUTE_URL,
        };
    }


    async getCharacterDetails(uid: string, region: string) {
        return getGenshinDetailList(uid, region, this.getApiConfig());
    }

    async syncCharacters(res: any[], associateWeapon = true) {
        console.group("返回数据");

        console.groupCollapsed("角色");
        console.table(res.map((a) => a.character));
        console.groupEnd();
        console.groupCollapsed("武器");
        console.table(res.map((a) => a.weapon));
        console.groupEnd();
        console.groupCollapsed("角色天赋");
        res.forEach((c) => {
            const name = c.character.name;
            console.groupCollapsed(name);
            console.table(c.skill_list);
            console.groupEnd();
        });
        console.groupEnd();

        console.groupEnd();
        const recorder: OwnershipRecorder = {synced: new Set(), worn: new Map()};
        for (let v of res) {
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


    batchUpdateTalent = (all: boolean, normal: number, skill: number, burst: number): void => {
        batchUpdateTalent(all, normal, skill, burst).then(() => {
            console.log("天赋更新完成");
        });
    };

    getCharacterStatusList() {
        return characterStatusList;
    }

    getInactiveConfig: () => GoalTypeConfig[] = () => {
        const GENSHIN_INACTIVE_CONFIG: GoalTypeConfig[] = [
            { type: "character", identifierKey: "character" }, // 角色目标（标识字段：character）
            {
                type: "talent",
                identifierKey: "character",
                isTalent: true,
                talentKeys: ['normal', 'skill', 'burst'] // 原神天赋类型：普通攻击/元素战技/元素爆发
            }, // 天赋目标（标识字段：character）
            { type: "weapon", identifierKey: "id" } // 武器目标（标识字段：goal.id，与 seelie computeInactive 一致）
        ];
        return GENSHIN_INACTIVE_CONFIG;
    }

    // 1 分钟节流（避免频繁打米游社 batch_compute）；prefetched = 角色同步已拉取的已拥有角色，复用以消除重复 list/detail 请求
    batchUpdateInventory = async (uid: string, region: string, prefetched?: any[]) => {
        const cfg = this.getApiConfig();
        return withThrottle("last-sync", "素材同步", (u, r) => batchUpdateInventoryGI(u, r, cfg, prefetched), uid, region);
    }
}
