import {GameAdapter, GameType} from '../game';
import {getDetailList as getZzzDetailList} from './hoyo';
import {addCharacter, batchUpdateCharacter, batchUpdateTrace, batchUpdateWeapon, characterStatusList} from './seelie';
import CharacterStatus = seelie.CharacterStatus;
import {getAccount} from "../common";

export class ZzzAdapter implements GameAdapter {
    getGameName(): string {
        return GameType.ZZZ;
    }

    getApiConfig() {
        return {
            BBS_URL: 'https://act.mihoyo.com/zzz/gt/character-builder-h/index.html',
            ROLE_URL: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookieToken?game_biz=nap_cn'
        };
    }

    async getAccounts() {
        const {BBS_URL, ROLE_URL} = this.getApiConfig();
        return await getAccount(ROLE_URL, BBS_URL, this.getGameName());
    }

    async getCharacterDetails(uid: string, region: string) {
        return getZzzDetailList(uid, region);
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

    batchUpdateCharacter(all: boolean, characterStatusGoal: CharacterStatus): void {
        batchUpdateCharacter(all, characterStatusGoal);
    }

    batchUpdateWeapon(all: boolean, characterStatusGoal: CharacterStatus): void {
        batchUpdateWeapon(all, characterStatusGoal);
    }

    batchUpdateTalent(all: boolean, basicGoal: number, dodgeGoal: number, assistGoal: number, specialGoal: number, chainGoal: number, coreGoal: number): void {
        batchUpdateTrace(all, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal);
    }

    getCharacterStatusList() {
        return characterStatusList;
    }
}
