// src/adapters/genshinAdapter.ts
import {GameAdapter, GameType} from '../game';
import {getDetailList as getGenshinDetailList} from './hoyo';
import {addCharacter, batchUpdateCharacter, batchUpdateTalent, batchUpdateWeapon, characterStatusList} from './seelie';
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

    protected importSeelieMethods() {
        return {batchUpdateCharacter, batchUpdateWeapon};
    }


    batchUpdateTalent = (all: boolean, normal: number, skill: number, burst: number): void => {
        batchUpdateTalent(all, normal, skill, burst);
    };

    getCharacterStatusList() {
        return characterStatusList;
    }
}
