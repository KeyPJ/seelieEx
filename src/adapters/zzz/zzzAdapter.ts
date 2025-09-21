import {GameAdapter, GameType, GoalTypeConfig} from '../game';
import {getDetailList as getZzzDetailList} from './hoyo';
import {
    addCharacter,
    batchUpdateCharacter,
    batchUpdateTrace,
    batchUpdateWeapon,
    characterStatusList,
} from './seelie';
import {BaseAdapter} from "../baseAdapter";

export class ZzzAdapter extends BaseAdapter implements GameAdapter {
    getGameName(): string {
        return GameType.ZZZ;
    }

    getApiConfig() {
        return {
            BBS_URL: 'https://act.mihoyo.com/zzz/gt/character-builder-h/index.html',
            ROLE_URL: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookieToken?game_biz=nap_cn'
        };
    }

    async getCharacterDetails(uid: string, region: string) {
        return getZzzDetailList(uid, region);
    }

    async syncCharacters(res: any[]) {
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
        for (let v of res) {
            await addCharacter(v)
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

}
