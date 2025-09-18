// src/adapters/hsr/hsrAdapter.ts
import {GameAdapter, GameType} from '../game';
import {getAccount as getHsrAccount, getDetailList as getHsrDetailList} from './hoyo';
import {addCharacter, batchUpdateCharacter, batchUpdateTrace, batchUpdateWeapon, characterStatusList} from './seelie';
import CharacterStatus = seelie.CharacterStatus;

export class HsrAdapter implements GameAdapter {
    getGameName(): string {
        return GameType.HSR;
    }

    getApiConfig() {
        return {
            bbsUrl: 'https://act.hoyoverse.com/sr/event/e20230317gacha/index.html', // HSR 活动页
            roleUrl: 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn', // HSR 角色列表接口
            charactersUrl: 'https://api-takumi.mihoyo.com/event/srledgeros/sync/avatar/list', // HSR 角色列表接口
            charactersDetailUrl: 'https://api-takumi.mihoyo.com/event/srledgeros/sync/avatar/detail', // HSR 角色详情接口
        };
    }

    async getAccounts() {
        return getHsrAccount();
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

    batchUpdateCharacter(all: boolean, characterStatusGoal: CharacterStatus): void {
        batchUpdateCharacter(all, characterStatusGoal);
    }

    batchUpdateWeapon(all: boolean, characterStatusGoal: CharacterStatus): void {
        batchUpdateWeapon(all, characterStatusGoal);
    }

    batchUpdateTalent(all: boolean, normal: number, skill: number, burst: number, t: number): void {
        batchUpdateTrace(all, normal, skill, burst, t);
    }

    getCharacterStatusList() {
        return characterStatusList;
    }
}
