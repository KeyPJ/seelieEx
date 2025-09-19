// src/adapters/hsr/hsrAdapter.ts
import {GameAdapter, GameType, GoalTypeConfig} from '../game';
import {getDetailList as getHsrDetailList} from './hoyo';
import {addCharacter, batchUpdateCharacter, batchUpdateTrace, batchUpdateWeapon, characterStatusList} from './seelie';
import {BaseAdapter} from "../baseAdapter";

export class HsrAdapter extends BaseAdapter implements GameAdapter {

    getGameName(): string {
        return GameType.HSR;
    }

    getApiConfig() {
        return {
            BBS_URL: 'https://act.mihoyo.com/sr/event/cultivation-tool/index.html',
            ROLE_URL: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn'
        };
    }

    async getCharacterDetails(uid: string, region: string) {
        return getHsrDetailList(uid, region);
    }

    syncCharacters(res: any[]) {
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
        res.forEach(v => addCharacter(v));
    }

    protected importSeelieMethods() {
        return {batchUpdateCharacter, batchUpdateWeapon};
    }

    batchUpdateTalent = (all: boolean, normal: number, skill: number, burst: number, t: number): void => {
        batchUpdateTrace(all, normal, skill, burst, t);
    };

    getCharacterStatusList() {
        return characterStatusList;
    }

    getInactiveConfig: () => GoalTypeConfig[] = () => {
        const HSR_INACTIVE_CONFIG: GoalTypeConfig[] = [
            { type: "character", identifierKey: "character" }, // 角色目标
            {
                type: "trace",
                identifierKey: "character",
                isTalent: true,
                talentKeys: ['basic', 'skill', 'ultimate', 'talent', 'pet_talent', 'pet_skill']
            }, // 行迹目标
            { type: "cone", identifierKey: "id" } // 光锥目标（标识键为 id）
        ];
        return HSR_INACTIVE_CONFIG;
    }
}
