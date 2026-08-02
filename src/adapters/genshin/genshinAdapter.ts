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


export class GenshinAdapter extends BaseAdapter implements GameAdapter {
    getGameName(): string {
        return GameType.GENSHIN;
    }

    getApiConfig() {
        return {
            BBS_URL: 'https://act.mihoyo.com/ys/event/calculator/index.html',
            ROLE_URL: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn'
        };
    }


    async getCharacterDetails(uid: string, region: string) {
        return getGenshinDetailList(uid, region);
    }

    async syncCharacters(res: any[]) {
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
        for (let v of res) {
            await addCharacter(v)
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
            { type: "weapon", identifierKey: "id" } // 武器目标（标识字段：weapon）
        ];
        return GENSHIN_INACTIVE_CONFIG;
    }

    batchUpdateInventory = async (uid: string, region: string) => {
        // 5 分钟节流（对齐参考站组件 B）
        const last = Number(localStorage.getItem("last-sync") || 0);
        if (last && Date.now() - last < 5 * 60 * 1000) {
            const wait = Math.ceil((5 * 60 * 1000 - (Date.now() - last)) / 1000);
            alert(`请稍候 ${wait}s 再同步（素材同步 5 分钟节流）`);
            return;
        }
        const results = await batchUpdateInventoryGI(uid, region);
        localStorage.setItem("last-sync", Date.now().toString());
        return results;
    }
}
