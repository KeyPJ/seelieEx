import {getAccount} from "./common";
import {GameAdapter, GameApiConfig, GoalTypeConfig} from "./game";

export abstract class BaseAdapter implements GameAdapter {
    abstract getGameName(): string;

    abstract getApiConfig(): GameApiConfig;

    abstract syncCharacters(res: any[]): void;

    abstract getCharacterStatusList(): seelie.CharacterStatus[];

    // 公共实现：获取账户列表
    async getAccounts() {
        const {calcPageUrl, gameBiz} = this.getApiConfig();
        return await getAccount(gameBiz, calcPageUrl, this.getGameName());
    }

    // 公共实现：批量更新角色
    batchUpdateCharacter = (all: boolean, status: seelie.CharacterStatus): void => {
        const {batchUpdateCharacter} = this.importSeelieMethods();
        batchUpdateCharacter(all, status);
    };

    // 公共实现：批量更新武器
    batchUpdateWeapon = (all: boolean, status: seelie.CharacterStatus): void => {
        const {batchUpdateWeapon} = this.importSeelieMethods();
        batchUpdateWeapon(all, status);
    };

    // 抽象方法：导入游戏特定的seelie方法
    protected abstract importSeelieMethods(): {
        batchUpdateCharacter: (all: boolean, status: seelie.CharacterStatus) => void;
        batchUpdateWeapon: (all: boolean, status: seelie.CharacterStatus) => void;
        // 其他需要的方法...
    };

    abstract batchUpdateTalent: Function;

    abstract batchUpdateInventory: Function;

    abstract getCharacterDetails(uid: string, region: string): Promise<any[]>;

    abstract getInactiveConfig: () => GoalTypeConfig[];

    async getItem(key: string): Promise<any> {
        return Promise.resolve(localStorage.getItem(key));
    }

    async setItem(key: string, value: any): Promise<void> {
        localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
        return Promise.resolve();
    }

}
