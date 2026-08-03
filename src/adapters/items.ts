// src/adapters/items.ts
// seelie 页面 items 库（素材 id → key/type/tier 映射）的读取与反查。
// 本模块为依赖树叶子节点：不 import 任何项目内模块，供 genshin/hoyo 与 inventory-common 共同依赖，
// 从而避免二者互相 import 形成循环依赖。

// 素材 id → seelie key 映射库的一条记录
export interface SeelieItemEntry {
    type: string;
    id?: number;
    ids?: number[];
}

export type SeelieItems = Record<string, SeelieItemEntry>;

/**
 * 外置读取 seelie 页面里的素材 id→key 映射库。
 * seelie.me 把这份库挂在根 Vue 实例 data 上，运行时直接取，无需打包静态 JSON。
 * 优先读 data.items，否则遍历 data 找“值含 type + id/ids”的对象。
 * 取不到时回退到 src/data/gi_items.json（开发期从参考站抽出的 469 条）。
 */
export const getItemsFromPage = (): SeelieItems | null => {
    try {
        const app = document.querySelector('#app') as any;
        const data = app?._vnode?.component?.data;
        if (!data) return null;
        if (data.items && typeof data.items === 'object' && !Array.isArray(data.items)) {
            return data.items as SeelieItems;
        }
        for (const key of Object.keys(data)) {
            const v = (data as any)[key];
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                const sample = Object.values(v)[0] as any;
                if (sample && typeof sample === 'object' && typeof sample.type === 'string' && ('id' in sample || 'ids' in sample)) {
                    return v as SeelieItems;
                }
            }
        }
        return null;
    } catch {
        return null;
    }
};

/** 按米游社素材 id 在 items 库中反查 seelie key / type / tier */
export const findItemMatch = (items: SeelieItems, id: number): { key: string; type: string; tier: number } | null => {
    for (const [key, info] of Object.entries(items)) {
        const ids = info.ids ?? (info.id != null ? [info.id] : []);
        const tier = info.ids ? info.ids.indexOf(id) : 0;
        if (ids.includes(id)) {
            return {key, type: info.type, tier};
        }
    }
    return null;
};
