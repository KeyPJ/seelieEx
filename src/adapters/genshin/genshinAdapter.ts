// src/adapters/genshinAdapter.ts
import {GameAdapter, GameType} from '../game';
import {getAccount as getGenshinAccount, getDetailList as getGenshinDetailList} from './hoyo';
import {addCharacter, batchUpdateCharacter, batchUpdateTalent, batchUpdateWeapon, characterStatusList} from './seelie';


export class GenshinAdapter implements GameAdapter {
    getGameName(): string {
        return GameType.GENSHIN;
    }

    getApiConfig() {
        return {
            bbsUrl: 'https://webstatic.mihoyo.com/ys/event/e20210928review/index.html',
            roleUrl: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn',
            charactersUrl: 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list',
            charactersDetailUrl: 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/detail',
        };
    }

    async getAccounts() {
        return getGenshinAccount();
    }

    async getCharacterDetails(uid: string, region: string) {
        return getGenshinDetailList(uid, region);
    }

    syncCharacters(res: any[]) {
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
        res.forEach(v => addCharacter(v));
    }

    batchUpdateCharacter(all: boolean, characterStatusGoal: seelie.CharacterStatus): void {
        batchUpdateCharacter(all, characterStatusGoal)
    }

    batchUpdateWeapon(all: boolean, characterStatusGoal: seelie.CharacterStatus): void {
        batchUpdateWeapon(all, characterStatusGoal)
    }

    batchUpdateTalent(all: boolean, normal: number, skill: number, burst: number): void {
        batchUpdateTalent(all, normal, skill, burst)
    }

    getCharacterStatusList() {
        return characterStatusList;
    }
}
