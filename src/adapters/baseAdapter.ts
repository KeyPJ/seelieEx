import {getAccount} from "./common";
import {GameAdapter, GameType} from "./game";

export abstract class BaseAdapter implements GameAdapter {
    abstract getGameName(): string;

    abstract getApiConfig(): { BBS_URL: string; ROLE_URL: string };

    abstract syncCharacters(res: any[]): void;

    abstract getCharacterStatusList(): seelie.CharacterStatus[];

    // 公共实现：获取账户列表
    async getAccounts() {
        const {BBS_URL, ROLE_URL} = this.getApiConfig();
        return await getAccount(ROLE_URL, BBS_URL, this.getGameName());
    }

    // 公共实现：批量更新角色
    batchUpdateCharacter(all: boolean, status: seelie.CharacterStatus): void {
        const {batchUpdateCharacter} = this.importSeelieMethods();
        batchUpdateCharacter(all, status);
    }

    // 公共实现：批量更新武器
    batchUpdateWeapon(all: boolean, status: seelie.CharacterStatus): void {
        const {batchUpdateWeapon} = this.importSeelieMethods();
        batchUpdateWeapon(all, status);
    }

    // 抽象方法：导入游戏特定的seelie方法
    protected abstract importSeelieMethods(): {
        batchUpdateCharacter: (all: boolean, status: seelie.CharacterStatus) => void;
        batchUpdateWeapon: (all: boolean, status: seelie.CharacterStatus) => void;
        // 其他需要的方法...
    };

    abstract batchUpdateTalent: Function;

    abstract getCharacterDetails(uid: string, region: string): Promise<any[]>;
}
