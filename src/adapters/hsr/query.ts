// ---- 页面运行时目录（seelie key -> {id: 数字米游社 id}）----
// hsr.seelie.me 把角色/光锥目录挂在根 Vue 实例 data 上（#app._vnode.component.data.characters / .cones）。
// 注意：HSR 的武器目录键名是 `cones`（光锥），不是 GI/ZZZ 的 `weapons`。
// 这份目录永远跟随站点最新版本，不会漏新角色（如 references/hsr c.txt 里的 himeko_nova/rin_tohsaka 等 2026 新角），
// 作为「数字米游社 item_id -> seelie key」反查的唯一来源（已完全剔除打包 JSON 依赖）。
// 结构：以 seelie key 为键（himeko_nova / trailblazer_elation / ...），值含数字 id（角色 1001~1510、光锥 20000~23062），无中文名。
// 开拓者特例（已按 references/hsr c.txt 实测核对）：目录含 5 条开拓者
//   trailblazer_physical(id 8001, alt_id 8002) / _fire(8003, 8004) / _imaginary(8005, 8006)
//   / _ice(8007, 8008) / _elation(8009, 8010)
// 其中 id=男主、alt_id=女主。getIdMap 只映射 entry.id，所以女主号（list 返回 8002/8004/8006/8008/8010）
// 反查为空串；男主号（8001/8003/...）则会命中 trailblazer_*。因此「跳过开拓者」不能只靠反查落空，
// 上层 addCharacter 仍保留 characterId.includes("trailblazer") 兜底，确保性别无关地跳过。

interface RuntimeEntry {
    id?: number;

    [k: string]: any;
}

type CatalogKind = "characters" | "cones";

const getRuntimeCatalog = (which: CatalogKind): Record<string, RuntimeEntry> | null => {
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

// 数字米游社 id -> seelie key 反查表（过滤 id<=0 的哨兵）。
// 懒加载 + 缓存：首次调用时读页面，之后复用（页面会话内目录不会变）。
let _characterIdMap: Map<number, string> | null = null;
let _coneIdMap: Map<number, string> | null = null;

const getIdMap = (which: CatalogKind): Map<number, string> => {
    const cached = which === "characters" ? _characterIdMap : _coneIdMap;
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
    else _coneIdMap = map;
    return map;
};

// 角色命途（path）缓存：seelie key -> path（"remembrance" / "elation" / "destruction" / ...）
let _characterPathMap: Map<string, string> | null = null;

const getCharacterPathMap = (): Map<string, string> => {
    if (_characterPathMap) return _characterPathMap;
    const map = new Map<string, string>();
    const cat = getRuntimeCatalog("characters");
    if (cat) {
        for (const [key, entry] of Object.entries(cat)) {
            const p = entry?.path;
            if (p && typeof p === 'string') map.set(key, p);
        }
    }
    _characterPathMap = map;
    return map;
};

/**
 * 按 seelie key 读取角色命途（path），如 "remembrance"（忆灵）/ "elation"（欢愉）。
 * 用于判定角色是否拥有忆灵技/忆灵天赋（remembrance）或欢愉技（elation），
 * 以便批量修改行迹时精确作用到「有这些类型的角色」，而非依赖 current 近似值。
 */
export const getCharacterPath = (key: string): string | undefined => {
    return getCharacterPathMap().get(key);
};

/**
 * 运行时目录里的角色总数，供 hoyo.ts 计算分页上界。
 * 懒求值：不能在模块导入期取值，否则 #app 尚未挂载会固定为 0。
 */
export const getCharactersNum = (): number => {
    return Object.keys(getRuntimeCatalog("characters") || {}).length;
};

/**
 * 米游社角色 -> seelie 角色 key。
 * 用数字米游社 item_id 在运行时目录反查（覆盖最新角色，不漏新角）。
 * 注意：米游社接口的 item_id 是字符串（如 "1508"），调用方需先 parseInt。
 * 运行时目录不含中文名，故传入字符串时无兜底，直接返回空串。
 */
export const getCharacterId = (input: string | { id: number; name?: string }): string => {
    const id = typeof input === 'string' ? undefined : input.id;
    if (typeof id === 'number' && id > 0) {
        const key = getIdMap("characters").get(id);
        if (key) return key;
    }
    console.error(`getCharacterId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
};

/**
 * 米游社光锥 -> seelie 光锥 key。逻辑同 getCharacterId，读 `cones` 目录。
 */
export const getWeaponId = (input: string | { id: number; name?: string }): string => {
    const id = typeof input === 'string' ? undefined : input.id;
    if (typeof id === 'number' && id > 0) {
        const key = getIdMap("cones").get(id);
        if (key) return key;
    }
    console.error(`getWeaponId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
};
