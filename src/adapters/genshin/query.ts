// ---- 页面运行时目录（seelie key -> {id: 数字米游社 id}）----
// seelie.me 把角色/武器目录挂在根 Vue 实例 data 上（#app._vnode.component.data.characters / .weapons）。
// 这份目录永远跟随站点最新版本，不会漏新角色（如 2026 的 sandrone / nicole 等），
// 作为「数字米游社 avatar id -> seelie key」反查的唯一来源（已完全剔除打包 JSON 依赖）。
// 注意：旅行者 6 个元素变体在运行时目录里 id 恒为 0（哨兵），无法用于数字反查，
// 因此旅行者一律忽略——getCharacterId 对其返回空串，调用方直接跳过，不写入 seelie。
interface RuntimeEntry {
    id?: number;
    [k: string]: any;
}

const getRuntimeCatalog = (which: "characters" | "weapons"): Record<string, RuntimeEntry> | null => {
    try {
        const app = document.querySelector('#app') as any;
        const data = app?._vnode?.component?.data;
        const cat = data?.[which];
        if (cat && typeof cat === 'object' && !Array.isArray(cat)) {
            return cat as Record<string, RuntimeEntry>;
        }
        return null;
    } catch {
        return null;
    }
};

// 数字米游社 id -> seelie key 反查表（过滤 id<=0 的哨兵，如旅行者变体）。
// 懒加载 + 缓存：首次调用时读页面，之后复用（页面会话内目录不会变）。
let _characterIdMap: Map<number, string> | null = null;
let _weaponIdMap: Map<number, string> | null = null;

const getIdMap = (which: "characters" | "weapons"): Map<number, string> => {
    const cached = which === "characters" ? _characterIdMap : _weaponIdMap;
    if (cached) return cached;
    const map = new Map<number, string>();
    const cat = getRuntimeCatalog(which);
    if (cat) {
        for (const [key, entry] of Object.entries(cat)) {
            if (entry && typeof entry.id === 'number' && entry.id > 0) {
                map.set(entry.id, key);
            }
        }
    }
    if (which === "characters") _characterIdMap = map;
    else _weaponIdMap = map;
    return map;
};

// 分页上界用：运行时目录的条目数（永远 >= 实际米游社角色数，安全上界）。
// 懒求值：脚本导入时 #app 可能尚未挂载，故用函数而非模块级常量。
export const getCharactersNum = (): number => {
    const cat = getRuntimeCatalog("characters");
    return cat ? Object.keys(cat).length : 0;
};

/**
 * 米游社角色 -> seelie 角色 key。
 * 用数字米游社 avatar id 在运行时目录反查（覆盖最新角色，不漏新角）。
 * 旅行者(id=0，运行时目录无有效 id)无法反查，返回空串，调用方跳过（即忽略旅行者）。
 */
export const getCharacterId = (input: string | { id: number; name: string }): string => {
    const id = typeof input === 'string' ? undefined : input.id;
    if (typeof id === 'number' && id > 0) {
        const key = getIdMap("characters").get(id);
        if (key) return key;
    }
    console.error(`getCharacterId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
};

/**
 * 米游社武器 -> seelie 武器 key。逻辑同 getCharacterId（武器无旅行者特例）。
 */
export const getWeaponId = (input: string | { id: number; name: string }): string => {
    const id = typeof input === 'string' ? undefined : input.id;
    const name = typeof input === 'string' ? input : input.name;
    if (typeof id === 'number' && id > 0) {
        const key = getIdMap("weapons").get(id);
        if (key) return key;
    }
    console.error(`getWeaponId ${name}(id=${id}) 查询失败`);
    return "";
};

