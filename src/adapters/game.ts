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

// 游戏 API 配置：集中返回该游戏的全部请求地址。
// 由各 adapter 实现（值来自 apiUrls.ts），hoyo.ts 从 adapter 取用，不再直接 import apiUrls。
export interface GameApiConfig {
    /** 计算器页面 URL（checkLogin 打开页面 / getAccount openUrl） */
    calcPageUrl: string;
    /** 绑定角色列表 API */
    roleUrl: string;
    /** 已拥有角色列表 API（角色同步主流程） */
    charactersUrl: string;
    /** 角色详情 API（角色同步主流程；GI 暂无独立详情接口可省略） */
    charactersDetailUrl?: string;
    /** 全量角色花名册 API（is_all:true，GI 素材同步） */
    allCharactersUrl?: string;
    /** 素材同步：计算 API（GI/HSR/ZZZ 素材同步） */
    computeUrl?: string;
}

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

    batchUpdateInventory: Function;

    getCharacterStatusList: Function

    // 获取游戏相关 API 配置（返回该游戏的全部请求地址）
    getApiConfig: () => GameApiConfig;

    getInactiveConfig: () => GoalTypeConfig[];

    // 异步获取存储项
    getItem: (key: string) => Promise<any>;

    // 异步设置存储项
    setItem: (key: string, value: any) => Promise<void>;

}
