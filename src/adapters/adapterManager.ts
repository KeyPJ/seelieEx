// src/adapters/adapterManager.ts
import {GameType, GameAdapter, GameDomainMap} from './game';
import {GenshinAdapter} from './genshin/genshinAdapter';
import {HsrAdapter} from "./hsr/hsrAdapter";
import {ZzzAdapter} from "./zzz/zzzAdapter";

export class AdapterManager {
    private static adapters: Map<GameType, GameAdapter> = new Map();
    private static currentGame: GameType;

    static init() {
        // 注册所有适配器
        this.adapters.set(GameType.GENSHIN, new GenshinAdapter());
        this.adapters.set(GameType.HSR, new HsrAdapter());
        this.adapters.set(GameType.ZZZ, new ZzzAdapter());

        this.detectCurrentGame();
    }

    // 新增：根据域名检测当前游戏
    private static detectCurrentGame() {
        const hostname = window.location.hostname;
        console.log("当前域名: %s", hostname);
        // 从域名映射中查找匹配的游戏类型
        for (const [domain, gameType] of Object.entries(GameDomainMap)) {
            if (hostname.includes(domain)) {
                this.currentGame = gameType;
                return;
            }
        }
        // 默认使用原神
        this.currentGame = GameType.GENSHIN;
    }

    // 获取当前域名对应的适配器
    static getCurrentAdapter(): GameAdapter {
        return this.getAdapter(this.currentGame);
    }

    // 获取当前游戏类型
    static getCurrentGameType(): GameType {
        return this.currentGame;
    }

    static getAdapter(gameType: GameType): GameAdapter {
        const adapter = this.adapters.get(gameType);
        if (!adapter) {
            throw new Error(`未找到游戏 ${gameType} 的适配器`);
        }
        return adapter;
    }

    static getSupportedGames(): { type: GameType, name: string }[] {
        return Array.from(this.adapters.entries()).map(([type, adapter]) => ({
            type,
            name: adapter.getGameName()
        }));
    }
}

// 初始化

AdapterManager.init();

