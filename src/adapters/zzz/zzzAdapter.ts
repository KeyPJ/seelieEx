import {GameAdapter, GameType, GoalTypeConfig} from '../game';
import {getDetailList as getZzzDetailList, batchUpdateInventoryZZZ} from './hoyo';
import {
    addCharacter,
    batchUpdateCharacter,
    batchUpdateTrace,
    batchUpdateWeapon,
    characterStatusList,
} from './seelie';
import {BaseAdapter} from "../baseAdapter";
import {withThrottle} from "../inventory-common";
import {ZZZ_CALC_PAGE_URL, ZZZ_CALC_URL, ZZZ_CHARACTERS_DETAIL_URL, ZZZ_CHARACTERS_URL} from "../apiUrls";
import {reconcileWeaponOwnership, OwnershipRecorder} from "../common";

export class ZzzAdapter extends BaseAdapter implements GameAdapter {

    getGameName(): string {
        return GameType.ZZZ;
    }

    getApiConfig() {
        return {
            calcPageUrl: ZZZ_CALC_PAGE_URL,
            gameBiz: 'nap_cn',
            charactersUrl: ZZZ_CHARACTERS_URL,
            charactersDetailUrl: ZZZ_CHARACTERS_DETAIL_URL,
            computeUrl: ZZZ_CALC_URL,
        };
    }

    async getCharacterDetails(uid: string, region: string) {
        return getZzzDetailList(uid, region, this.getApiConfig());
    }

    async syncCharacters(res: any[], associateWeapon = true) {
        console.group("返回数据");

        console.groupCollapsed("角色");
        console.table(res.map((a) => a.avatar));
        console.groupEnd();
        console.groupCollapsed("光锥");
        console.table(res.map((a) => a.weapon));
        console.groupEnd();
        console.groupCollapsed("角色天赋");
        res.forEach((c) => {
            const name = c.avatar.name_mi18n;
            console.groupCollapsed(name);
            console.table(c.avatar.skills);
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

    batchUpdateTalent = (all: boolean, basicGoal: number, dodgeGoal: number, assistGoal: number, specialGoal: number, chainGoal: number, coreGoal: number): void => {
        batchUpdateTrace(all, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal);
    }

    getCharacterStatusList() {
        return characterStatusList;
    }

    getInactiveConfig: () => GoalTypeConfig[] = () => {
        const ZZZ_INACTIVE_CONFIG: GoalTypeConfig[] = [
            {type: "character", identifierKey: "character"}, // 角色目标
            {
                type: "talent",
                identifierKey: "character",
                isTalent: true,
                talentKeys: ['basic', 'dodge', 'assist', 'special', 'chain', 'core']
            }, // 天赋目标
            {type: "weapon", identifierKey: "id"} // 武器目标（标识键为 id）
        ];
        return ZZZ_INACTIVE_CONFIG;
    }

    // 1 分钟节流（避免频繁打米游社 avatar_calc；独立 key 不干扰 GI/HSR）；prefetched = 角色同步已拉取详情，复用跳过 list/detail
    batchUpdateInventory = async (uid: string, region: string, prefetched?: any[]) => {
        const cfg = this.getApiConfig();
        return withThrottle("zzz-last-sync", "ZZZ 素材同步", (u, r) => batchUpdateInventoryZZZ(u, r, cfg, prefetched), uid, region);
    }

}
