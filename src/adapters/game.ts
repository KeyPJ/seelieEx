// src/types/game.ts
export enum GameType {
    GENSHIN = 'genshin',
    HSR = 'hsr', // 崩坏：星穹铁道
    ZZZ = 'zzz' // 绝区零
}

// 新增域名映射配置
export const GameDomainMap: Record<string, GameType> = {
    'hsr.seelie.me': GameType.HSR,
    'zzz.seelie.me': GameType.ZZZ,
};

export type GoalTypeConfig = {
    type: 'character' | 'weapon' | 'talent' | 'cone' | 'trace'; // 目标类型（如 'character'/'weapon'/'trace'）
    identifierKey: 'character' | 'id'; // 标识字段（如 ）
    isTalent?: boolean; // 是否为天赋类目标（需多字段达标判断）
    talentKeys?: string[]; // 天赋子类型键名（如 ['basic','skill',...]）
};

export interface GameAdapter {
    // 获取账户列表
    getAccounts: () => Promise<any[]>;

    // 获取角色详情列表
    getCharacterDetails: (uid: string, region: string) => Promise<any[]>;

    // 同步角色信息到规划工具
    syncCharacters: (details: any[]) => void;

    // 获取游戏名称
    getGameName: () => string;

    batchUpdateCharacter: Function

    batchUpdateWeapon: Function

    batchUpdateTalent: Function;

    getCharacterStatusList: Function

    // 获取游戏相关API配置
    getApiConfig: () => {
        BBS_URL: string;
        ROLE_URL: string;
    };

    getInactiveConfig: () => GoalTypeConfig[];

    // 异步获取存储项
    getItem: (key: string) => Promise<any>;

    // 异步设置存储项
    setItem: (key: string, value: any) => Promise<void>;

}
