# 米游社接口清单（seelieEx 同步用）

> 本文档由 `src/adapters/apiUrls.ts` 的 URL 常量出发，结合三端 `hoyo.ts` / `game.ts` 的真实调用整理，
> 覆盖**用途 / 完整地址 / 请求方法 / 请求参数 / 返回格式 / 频率与登录处理**。
> 维护提示：`apiUrls.ts` 是叶子模块（只导出字符串，不含业务逻辑）；各 adapter 通过 `GameApiConfig`
> 间接取用，不在业务代码里硬编码 URL。

---

## 0. 通用约定（三端共用）

### 0.1 请求头
基础头（`common.ts` → `headers` + `inventory-common.buildBaseHeaders`）：

| Header | 值 | 说明 |
|---|---|---|
| `Referer` | `https://act.mihoyo.com/` | 来自 `ACT_MIHOYO_BASE_URL` |
| `User-Agent` | 桌面 Chrome UA | 固定字符串 |
| `x-rpc-device_fp` | 设备指纹 `fp` | 见 `DEVICE_FP_URL` |
| `x-rpc-device_id` | `localStorage.mysDeviceId` 或 `fp` | 无则生成并存储 |
| `x-rpc-platform` | `4` | 固定（PC） |

各游戏再向上叠加专属头（详见各端小节）。`axios` 已设 `withCredentials=true`，依赖米游社 cookie。

#### 0.1.1 账户接口专用头（`getUserGameRolesByCookie*`）
账户列表接口（§2.2 / §3.2 / §4.2）在基础头上**必须**叠加以下头，否则可能返回空列表或鉴权失败。代码统一由 `common.buildRoleHeaders()` 注入：

| Header | 值 | 说明 |
|---|---|---|
| `x-rpc-device_id` | `localStorage.mysDeviceId` 或 `getGuid()` 生成的 UUID | 设备标识（脚本动态生成，非抓包里的固定串） |
| `x-rpc-lrsag` | `""` | 留空即可 |
| `x-rpc-mi_referrer` | `https://act.mihoyo.com/` | 即 `ACT_MIHOYO_BASE_URL` |

> 抓包另含 `sec-ch-ua*` / `sec-fetch-*` 等**浏览器自动注入**头，脚本环境无需也无法手工设置，忽略即可。

### 0.2 登录态
- 所有业务接口返回 `{retcode, message, data}`。
- `retcode === 0` 成功；`-100` 表示登录态过期，由 `common.checkLogin` 统一 `alert` + 打开计算器页面 + 抛错。
- 其余非零 `retcode` 走 `axios` 响应拦截器统一 `console.error`（URL + body + message）。

### 0.3 通用返回结构
```jsonc
{
  "retcode": 0,
  "message": "...",
  "data": { /* 各接口不同，见下 */ }
}
```

### 0.4 频率限制（节流）
| 端 | 间隔策略 | 备注 |
|---|---|---|
| GI | 单批最多 256 条；失败递归二分重试（128→…→1），批间无强制 sleep，重试前 `sleep(1000)` | `batch_compute` 一次性批量 |
| HSR | 每角色请求后 `sleep(400)` | 单 avatar `calc/compute` |
| ZZZ | 每角色请求前 `sleepWithJitter(800, 400)`（含首次/末次） | 频限最严 |
| 全部 | 库存同步整体 1 分钟节流（`withThrottle`，key=`${account}-inv_sync`） | 冷却内 `alert` 并跳过 |

---

### 0.5 账户接口返回结构（三端通用）

`getUserGameRolesByCookie` —— **三端统一端点，仅 `game_biz` 不同**：GI=`hk4e_cn` / HSR=`hkrpg_cn` / ZZZ=`nap_cn`（2026-08-06 已将 `GI_ROLE_URL`/`HSR_ROLE_URL`/`ZZZ_ROLE_URL` 合并为公共 `ROLE_URL`）。返回结构一致：

```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}
export interface Data {
  list: List[];
}
export interface List {
  game_biz: string;     // 如 hk4e_cn / hkrpg_cn / nap_cn
  region: string;       // 区服标识，如 cn_gf01 / prod_gf_cn（后续接口复用为 region 参数）
  game_uid: string;     // 游戏 uid（后续接口复用为 uid 参数）
  nickname: string;
  level: number;
  is_chosen: boolean;
  region_name: string;  // 区服展示名，如「天空岛」
  is_official: boolean;
  is_banned: boolean;
  unmask: any[];
}
```

| 字段 | 类型 | 用途 |
|---|---|---|
| `game_biz` | string | 三端固定值见 §1.3 / §5 |
| `region` | string | 后续角色/计算接口的 `region` 参数来源 |
| `game_uid` | string | 后续接口的 `uid` 参数来源 |
| `nickname` / `level` | string / number | 仅展示 |
| `is_chosen` / `is_official` / `is_banned` | boolean | 账户状态标识，脚本未使用 |
| `unmask` | any[] | 用途未知，忽略 |

> 取数：`getAccount()` 直接返回 `data.list`（`List[]`），三端 `getAccounts()` 经 `GameApiConfig.gameBiz` 调用统一端点 `ROLE_URL`（见 §1.3，内部拼接 `?game_biz=`），取 `game_uid` + `region`。
>
> 抓包要点：实际 fetch 为 `getUserGameRolesByCookie?game_biz=hk4e_cn`，headers 含 `x-rpc-device_id` / `x-rpc-lrsag` / `x-rpc-mi_referrer`（与 §0.1.1 一致）；`sec-ch-ua*` / `sec-fetch-*` 为浏览器自动注入头，脚本无需设置。ZZZ 同样走此端点（`game_biz=nap_cn`），**非** `getUserGameRolesByCookieToken`。

---

## 1. 共用接口

### 1.1 `ACT_MIHOYO_BASE_URL`
- **地址**：`https://act.mihoyo.com/`
- **用途**：仅作 `Referer` 与基础头来源，**不直接发起请求**。
- **附注**：`checkLogin`（登录过期）会 `GM_openInTab` 打开各端计算器页面（`*_CALC_PAGE_URL`），而非本地址。

### 1.2 `DEVICE_FP_URL`
- **地址**：`https://public-data-api.mihoyo.com/device-fp/api/getFp`
- **方法**：`POST`
- **触发**：仅当 `localStorage.fp` 缺失时（`getFp()` 内部）。
- **请求体（JSON）**：
  ```jsonc
  {
    "seed_id": "<随机串>",
    "device_id": "<mysDeviceId 大写>",
    "platform": "1",
    "seed_time": "<毫秒时间戳>",
    "ext_fields": "{...模拟 iOS 设备信息 JSON...}",
    "app_name": "bbs_cn",
    "device_fp": "38d7ee834d1e9"
  }
  ```
- **返回**：`{retcode:0, data:{device_fp:"<fp>"}}` → 存入 `localStorage.fp`。
- **注意**：`ext_fields` 硬编码为 iOS 设备信息，与脚本实际桌面环境不符（疑似从抓包照抄，通常不影响拿 fp）。

### 1.3 `ROLE_URL`（三端共用，2026-08-06 合并）
- **地址**：`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie`
- **方法**：`GET`
- **Query**：`?game_biz=<端固定值>`（GI=`hk4e_cn` / HSR=`hkrpg_cn` / ZZZ=`nap_cn`）
- **用途**：绑定角色列表（账户接口）。三端共用同一端点，原 `GI_ROLE_URL` / `HSR_ROLE_URL` / `ZZZ_ROLE_URL` 已合并为本常量；`getAccount(gameBiz, openUrl, gameType)` 内部拼接 `ROLE_URL?game_biz=${gameBiz}`。
- **专属头**：见 §0.1.1（`common.buildRoleHeaders` 注入 `x-rpc-device_id` / `x-rpc-lrsag` / `x-rpc-mi_referrer`）。
- **返回**：`data.list[]`（见 §0.5 通用账户结构）。

---

## 2. 原神（GI）

> 所有接口 host 均为 `api-takumi.mihoyo.com`。角色同步主流程：`ROLE_URL`(`game_biz=hk4e_cn`) → `GI_CHARACTERS_URL`（含 weapon）→ 直接透传为 detail（无独立 detail 接口）。

### 2.1 `GI_CALC_PAGE_URL`
- **地址**：`https://act.mihoyo.com/ys/event/calculator/index.html`
- **用途**：计算器页面；登录过期时打开。不直接请求数据。

### 2.2 账户接口（`ROLE_URL` + `game_biz=hk4e_cn`）
- **地址**：`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn`（三端共用的 `ROLE_URL`，见 §1.3）
- **方法**：`GET`（见 §0.1.1 专用头）
- **用途**：GI 绑定角色列表（`getAccount('hk4e_cn', ...)`，经 `GameApiConfig.gameBiz`）。
- **返回**：`data.list[]`（见 §0.5 通用账户结构）。取 `game_uid` + `region` 供 §2.3 / §2.5。

### 2.3 `GI_CHARACTERS_URL`（已拥有角色列表，同步主流程）
- **地址**：`https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list`
- **方法**：`POST`（对应 `cfg.charactersUrl`，角色同步与「已拥有角色」素材拉取共用）
- **请求体**：
  ```jsonc
  {
    "element_attr_ids": [],          // 元素筛选（空=全部）
    "weapon_cat_ids": [],            // 武器筛选（空=全部）
    "page": 1,
    "size": 200,                      // requestPageSize
    "uid": "<game_uid>",
    "region": "<region>",
    "lang": "zh-cn"
  }
  ```
- **返回**：`data.list[]`（`Character[]`）。分页，按 `getCharactersNum()` 决定页数。单条 `Character`：
  ```ts
  interface Character {
    id: number;                 // 角色 id
    name: string;               // 中文名
    icon: string;               // 头像图标 URL
    weapon_cat_id: number;      // 武器类型 id
    avatar_level: number;       // 角色等级上限（max_level 同字段）
    element_attr_id: number;    // 元素 id
    max_level: number;          // 等级上限（= avatar_level）
    level_current: number;      // 当前等级
    promote_level: number;      // 当前突破等级（0~6）
    skill_list: Skill[];        // 天赋（见下）
    weapon: Weapon;             // 当前佩戴武器（含 id/中文名/level_current/max_level）
    reliquary_list: Reliquary[];// 圣遗物列表
    wiki_url: string;
    wiki_recommend_weapon_url: string;
    constellation_num: number;  // 命座数
    fetter_level: number;       // 好感等级
  }
  interface Skill { id: number; group_id: number; name: string; icon: string; max_level: number; level_current: number; }
  interface Weapon { id: number; name: string; icon: string; weapon_cat_id: number; weapon_level: number; max_level: number; level_current: number; }
  interface Reliquary { id: number; name: string; icon: string; reliquary_cat_id: number; reliquary_level: number; level_current: number; max_level: number; }
  ```
  | 关键字段 | 用途 |
  |---|---|
  | `id` / `name` | 角色标识，映射 seelie key |
  | `level_current` / `promote_level` | 当前等级 + 突破，解析档位（`promote_level` 即 `asc`） |
  | `skill_list[].level_current` | 天赋当前等级（3 条战斗天赋 + 被动混合，`group_id` 区分） |
  | `weapon.id` / `weapon.name` / `weapon.level_current` | 关联武器（武器关联角色功能取此） |
  | `constellation_num` | 命座数 → seelie `cons` |
  | `reliquary_list` | 圣遗物（脚本未处理养成，仅透传） |

### 2.4 `GI_ALL_CHARACTERS_URL`（全量花名册，仅素材同步用）
- **地址**：`https://api-takumi.mihoyo.com/event/e20200928calculate/v1/avatar/list`
- **方法**：`POST`（对应 `cfg.allCharactersUrl`，**仅素材同步**用）
- **请求体**：同 2.3，额外 `"is_all": true`；**无需 uid/region**。
- **返回**：`data.list[]`（全量角色花名册，含未拥有）+ `data.total`。单条：
  ```ts
  interface RosterCharacter {
    id: number;                 // 角色 id（与 sync 列表 id 一致）
    name: string;
    icon: string;
    weapon_cat_id: number;      // 武器类型
    avatar_level: number;       // 等级上限
    element_attr_id: number;    // 元素
    max_level: number;
    item_icon: string;
    talent_icons: string[];     // 天赋图标
    side_icon: string;          // 侧边立绘
    profile_pictures: ProfilePicture[]; // 可用头像框
    talents: Talent[];          // 固有天赋（含被动）
    skill_list: SkillList[];    // 可升级天赋（普通/战技/爆发）
    wiki_url: string;
    wiki_recommend_weapon_url: string;
    wiki_reliquary_url: string;
    wiki_recommend_skill_url: string;
  }
  interface SkillList { id: number; group_id: number; name: string; icon: string; max_level: number; is_proud: boolean; pos_name: string; }
  interface Talent { id: number; name: string; icon: string; }
  interface ProfilePicture { avatar_id: string; costume_id: string; icon: string; profile_picture_id: string; }
  ```
  | 关注点 | 说明 |
  |---|---|
  | 与 §2.3 区别 | 花名册**无** `level_current`/`weapon`/`promote_level`/`constellation_num`（这些都是"已拥有"状态，花名册只有静态上限信息）；素材同步据此拉全角色上限，不依赖是否拥有 |
  | `skill_list[].is_proud` | 是否为「命之座/固有天赋」类（true 通常对应被动，不计入可升级养成） |
  | `talent_icons` / `talents` | 固有天赋展示，同步跳过 |

### 2.5 `GI_BATCH_COMPUTE_URL`（素材计算）
- **地址**：`https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute`
- **方法**：`POST`（对应 `cfg.computeUrl`）
- **请求头专属**：`x-rpc-cal_type: 0`、`x-rpc-stat_platform: PC`
- **请求体**：
  ```jsonc
  {
    "items": [ /* 单条见下 */ ],
    "uid": "<game_uid>",
    "region": "<region>",
    "lang": "zh-cn"
  }
  // 单条 item：
  // {
  //   "avatar_id": 10000120, "avatar_level_current":1, "avatar_level_target":90,
  //   "element_attr_id":5, "avatar_promote_level":0, "from_user_sync":false,
  //   "skill_list":[{"id":12031, "level_current":1, "level_target":10}, ...],  // id 为原始 skill id（非 group_id）
  //   "weapon":{"id":13516, "name":"血染荒城", "weapon_cat_id":13, "weapon_level":5, "max_level":90, "level_current":1, "level_target":90, "is_recommend":true}  // 可选
  // }
  // 注：from_user_sync=true 时还会带 avatar_promote_level（如 6）表示当前突破档
  ```
- **返回**：`data` 结构：
  ```ts
  interface ComputeData {
    items: ComputeItem[];              // 每个 avatar 的逐项消耗
    available_material: Consume[];     // 背包已有素材
    overall_consume: Consume[];        // 全部角色合计消耗（含缺额）
    overall_material_consume: {        // 按类别拆分
      avatar_consume: Consume[];       // 角色等级突破消耗
      avatar_skill_consume: Consume[]; // 天赋消耗
      weapon_consume: Consume[];       // 武器消耗
    };
    jump_url: string;
    single_role_result: SingleRoleResult[];
    has_user_info: boolean;
  }
  interface Consume { id: number; name: string; icon: string; num: number; wiki_url: string; level: number; icon_url: string; lack_num: number; }
  interface ComputeItem { avatar_consume: Consume[]; avatar_skill_consume: Consume[]; weapon_consume: Consume[]; reliquary_consume: any[]; skills_consume: SkillsConsume[]; calendar: Calendar; lineup_recommend: string; }
  interface SkillsConsume { consume_list: Consume[]; skill_info: { id: string; level_current: string; level_target: string }; }
  ```
  | 入库口径 | 说明 |
  |---|---|
  | `overall_consume[]` | 每元素 `{id, num, lack_num}`；**跨批按素材 `id` 取 `num+lack_num` 最大值**写入库存（代理值口径，与 HSR/ZZZ 真实持有量不同，见 §5） |
  | `overall_material_consume` | 按角色/天赋/武器拆分，便于分类展示，但入库只用 `overall_consume` 汇总 |
  | `available_material` | 背包已有素材（可与 `num` 对照核验） |

### 2.6 GI 账户字段（`data.list[]`）
三端账户返回结构统一，见 **§0.5**（含完整 `List` 字段表与 TS 接口）。GI 取 `game_uid` + `region` 供 §2.3 / §2.5 使用。

### 2.7 GI 角色字段（`Character`）
完整字段见 **§2.3**（`Character` / `Skill` / `Weapon` / `Reliquary` 接口）。要点：`id`+`name` 映射 seelie key、`level_current`+`promote_level` 解析档位、`weapon` 用于武器关联角色、`constellation_num` → `cons`、`skill_list[].level_current` 为天赋当前等级。

---

## 3. 崩坏：星穹铁道（HSR）

> host 均为 `api-takumi.mihoyo.com`。角色列表与详情分两个接口；列表返回全量（含未拥有，靠 `first_meet_time` 判定拥有）。

### 3.1 `HSR_CALC_PAGE_URL`
- **地址**：`https://act.mihoyo.com/sr/event/cultivation-tool/index.html`
- **用途**：计算器页面；登录过期打开。

### 3.2 账户接口（`ROLE_URL` + `game_biz=hkrpg_cn`）
- **地址**：`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn`（三端共用的 `ROLE_URL`，见 §1.3）
- **方法**：`GET`（见 §0.1.1 专用头）
- **差异**：`game_biz=hkrpg_cn`（GI 为 `hk4e_cn`、ZZZ 为 `nap_cn`）。返回 `data.list[]`（同 **§0.5** 通用账户结构，`region` 形如 `prod_gf_cn` 等）。

### 3.3 `HSR_AVATAR_LIST_URL`
- **地址**：`https://api-takumi.mihoyo.com/event/rpgcultivate/avatar/list`
- **方法**：`GET`（对应 `cfg.charactersUrl`）
- **Query**：`?game=hkrpg&game_biz=hkrpg_cn&badge_region=<region>&badge_uid=<uid>`
- **专属头**：`x-rpc-lang: zh-cn`、`x-rpc-page: v4.4.4__#/tools/calculation`、`x-rpc-view_source: 1`
- **返回**：`data.avatars[]`（`Avatar[]`）：
  ```ts
  interface Avatar {
    item_id: string;          // 角色 id（字符串，如 "1001"）→ 反查 seelie key 前需 parseInt
    item_name: string;        // 中文名
    icon_url: string;
    damage_type: string;      // 属性（雷/火/…）
    rarity: string;           // 稀有度（"4"/"5"）
    avatar_base_type: string; // 角色定位（毁灭/巡猎/…）
    max_level: number;        // 等级上限（通常 80）
    cur_level: number;        // 当前等级
    target_level: number;     // 计算器目标等级
    is_forward: boolean;      // 是否首发/前进角色（展示用）
    is_up: boolean;           // 是否当期 UP（展示用）
    is_own: boolean;          // 是否拥有（true 才同步；list 全量含未拥有）
    new_icon_url: string;
    wiki_url: string;
    is_new: boolean;
    first_meet_time: string;  // 首次获得时间戳（字符串）；`> "0"` 亦可作为拥有判定
    is_enhanced: boolean;     // 是否已强化（展示用）
    avatar_number_type: string;
    rank: string;             // 命座数（字符串，如 "6"）→ seelie `eidolon`
  }
  ```
  | 关键字段 | 用途 |
  |---|---|
  | `item_id` | 角色标识（字符串）→ `getIdMap` 反查数字 id；`getCharactersNum()` 计数来源 |
  | `is_own` / `first_meet_time>0` | 拥有判定（脚本同步只用拥有者） |
  | `cur_level` / `max_level` | 当前/上限等级，映射 seelie `current`/`goal` 基准 |
  | `rank` | 命座 → seelie `eidolon`（只增不减合并） |
  | `rarity` / `avatar_base_type` / `damage_type` | 仅展示/分类 |

### 3.4 `HSR_AVATAR_DETAIL_URL`
- **地址**：`https://api-takumi.mihoyo.com/event/rpgcultivate/calc/avatar/detail`
- **方法**：`GET`（对应 `cfg.charactersDetailUrl`）
- **Query**：`?game=hkrpg&game_biz=hkrpg_cn&badge_region=<region>&badge_uid=<uid>&item_id=<id>&change_target_level=0`
- **返回**：`data`（`HSRCharacterData`）：
  ```ts
  interface HSRCharacterData {
    avatar: Avatar;          // 同 §3.3 列表的 Avatar（含 item_id/max_level/rank）
    skills: Skill[];         // 养成天赋节点（point_type 筛选，见下）
    skills_other: Skill[];   // 其他节点
    equipment: any;          // 当前光锥（含 item_id/max_level），detail 才有
    skills_servant: any[];   // 忆灵/召唤物天赋（不计入）
    skills_special: any[];   // 特殊天赋（不计入）
  }
  interface Skill {
    point_id: string;        // 节点 id（字符串，如 "1405001"）
    pre_point: string;
    point_type: number;      // ⚠️ 可能是字符串（"2"），比较前须 Number() 化
    anchor: string;
    item_url: string;
    max_level: number;       // 该节点等级上限（通常 10）
    cur_level: number;       // 当前等级
    target_level: number;
    progress: string;
    min_level_limit: number;
    order: number;
    is_recommend: boolean;
    item_name: string;
    rank_add: number;        // 命座追加等级
    special_point_type: string;
  }
  ```
  | 关键字段 | 用途 |
  |---|---|
  | `skills[].point_type` | **节点类型筛选口径**：`Number(point_type)===2` 为 4 个战斗技能（战技/终结技/普攻/额外能力，按 `order`/`point_id` 排序映射 seelie 天赋）；`point_type===4` 为欢愉技（`elation_skill`）；`skills_servant`/`skills_special` 不计入养成 |
  | `skills[].max_level` | 天赋等级上限（脚本取 max(旧,新) 且上限 10） |
  | `equipment.item_id` | 光锥 id（映射 seelie，按 `cones` 目录反查） |
  | `avatar.rank` | 命座 → `eidolon`（字符串，只增不减） |

### 3.5 `HSR_COMPUTE_URL`
- **地址**：`https://api-takumi.mihoyo.com/event/rpgcultivate/calc/compute`
- **方法**：`POST`（对应 `cfg.computeUrl`）
- **Query**：`?game=hkrpg&game_biz=hkrpg_cn&badge_region=<region>&badge_uid=<uid>&noSessionRetry=true`
- **请求体**：
  ```jsonc
  {
    "game": "hkrpg",
    "avatar": {"item_id":"<字符串>", "cur_level":1, "target_level":<max_level|80>},
    "skill_list": [{"item_id":"<point_id 字符串>", "cur_level":1, "target_level":<max_level|1>}],
    "equipment": {"item_id":"<字符串>", "cur_level":1, "target_level":<max_level|80>} // 可选（有光锥时）
    "uid": "<uid>", "region": "<region>"
  }
  ```
- **返回**：`data`（`CalcData`）：
  ```ts
  interface CalcData {
    avatar_consume: Consume[];        // 角色等级/突破消耗
    skill_consume: Consume[];         // 天赋消耗
    equipment_consume: Consume[];     // 光锥消耗
    user_owns_materials: Record<string, number>; // ⚠️ 对象（非数组），如 {"2":123,"213":4}
    need_get_materials: Consume[];
    can_pay_materials: Consume[];
    can_merge_materials: Consume[];
    coin_id: string;                  // 信用点 id（"2"）
  }
  interface Consume {
    item_id: string;   // 素材 id（字符串）
    item_name: string;
    item_url: string;
    num: number;       // 需要量
    wiki_url: string;
    rarity: string;
    item_group: string;
    item_purpose: string;
    item_desc: string;
    item_bg_desc: string;
  }
  ```
  | 入库口径 | 说明 |
  |---|---|
  | `user_owns_materials` | `{ "<素材id字符串>": <数量> }`；**真实持有量**，跨角色同素材取最大值写入库存（与 GI 代理值口径不同，见 §5） |
  | `coin_id` | 信用点 id（"2"），对应 `items.ts` 特例 `2→credit` |
  | `avatar/skill/equipment_consume` | 分类消耗，仅展示用；入库只用 `user_owns_materials` |

---

## 4. 绝区零（ZZZ）

### 4.1 `ZZZ_CALC_PAGE_URL`
- **地址**：`https://act.mihoyo.com/zzz/gt/character-builder-h/index.html`
- **用途**：计算器页面；登录过期打开。

### 4.2 账户接口（`ROLE_URL` + `game_biz=nap_cn`）
- **地址**：`https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=nap_cn`（三端共用的 `ROLE_URL`，见 §1.3）
- **方法**：`GET`（见 §0.1.1 专用头）
- **差异**：`game_biz=nap_cn`（GI/HSR 分别为 `hk4e_cn` / `hkrpg_cn`）。返回结构同 **§0.5** 通用账户结构（`data.list[]`）。
- **⚠️ 端点修正**：**ZZZ 与 GI/HSR 同样走 `getUserGameRolesByCookie`**（仅 `game_biz=nap_cn`），**不是** `getUserGameRolesByCookieToken`。三端共用同一端点，2026-08-06 ROLE_URL 合并已据此统一；旧文档所述 `getUserGameRolesByCookieToken` 为错误描述。

### 4.3 `ZZZ_CHARACTERS_URL`
- **地址**：`https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list`
- **方法**：`GET`（对应 `cfg.charactersUrl`）
- **Query**：`?uid=<uid>&region=<region>`
- **返回**：`data.list[]`（`List[]`），每元素：
  ```ts
  interface List {
    avatar: Avatar;          // 角色静态信息（见下）
    unlocked: boolean;       // 是否解锁（true 才同步）
    is_up: boolean;          // 当期 UP（展示）
    is_teaser: boolean;      // 前瞻角色
    is_top: boolean;         // 置顶（展示）
  }
  interface Avatar {
    id: number;              // 角色 id（数字）
    level: number;           // 当前等级
    name_mi18n: string;      // 中文名 key（无直接中文名，靠 id 反查）
    full_name_mi18n: string; // 全名 key
    element_type: number;    // 属性
    camp_name_mi18n: string; // 阵营
    avatar_profession: number;// 职业（强攻/击破/…）
    rarity: string;
    group_icon_path: string;
    hollow_icon_path: string;
    rank: number;            // ⚠️ 命座数（**number**，与 HSR 的 rank:string 类型不同）
    sub_element_type: number;
    awaken_state: string;
  }
  ```
  | 关键字段 | 用途 |
  |---|---|
  | `unlocked` | 拥有判定（脚本只同步 `unlocked` 为真者） |
  | `avatar.id` | 角色标识（数字）→ `getIdMap` 反查 seelie key |
  | `avatar.rank` | 命座 → seelie `cons`（**number**；合并只增不减） |
  | `level` | 当前等级（上限固定 60，不依赖 item_info） |

### 4.4 `ZZZ_CHARACTERS_DETAIL_URL`
- **地址**：`https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2`
- **方法**：`POST`（对应 `cfg.charactersDetailUrl`）
- **Query**：`?uid=<uid>&region=<region>`
- **请求体**：
  ```jsonc
  {
    "avatar_list": [
      {"avatar_id":<id>, "is_teaser":false, "teaser_need_weapon":false, "teaser_sp_skill":false}
    ]
  }
  ```
- **返回**：`data.list[]`（`ZZZCharacterData[]`，每 10 个 id 一批）。单条：
  ```ts
  interface ZZZCharacterData {
    avatar: Avatar;          // 详情（含 skills/ranks/promotes/signature_weapon_id）
    equip: Equip[];          // 已装备驱动盘（见下）
    weapon: any;             // 当前武器（基础信息）
    plan: Plan;              // 计算器方案（忽略）
    user: User;              // 账户信息
    item_info: ItemInfo;     // 等级/技能上限来源
    next_item_info: ItemInfo;// 下一阶上限
    // 其余 plan_changed / from_my_plan / teaser 等省略
  }
  interface Avatar {
    id: number;
    level: number;
    name_mi18n: string;
    full_name_mi18n: string;
    element_type: number;
    avatar_profession: number;
    rarity: string;
    rank: number;            // 命座（影画）数
    ranks: Rank[];           // 影画列表（id/name/desc/pos/is_unlocked）
    skills: Skill[];         // 技能（skill_type/level）
    promotes: number;        // ⚠️ 突破档：已解锁等级上限/10（1~6），见 resolveStatus
    signature_weapon_id: number; // 专武 id（可选，detail 才有；list 来源无此字段）
    skill_upgrade: { first:number[]; second:number[]; third:number[] };
    skill_awaken: { has_awaken_system:boolean; awaken_level:number; awaken_max_level:number };
    unlock: boolean;
  }
  interface Equip {           // 驱动盘（圣遗物类比）
    id: number; level: number; name: string; icon: string; rarity: string;
    properties: Propertie[]; main_properties: MainPropertie[];
    equip_suit: EquipSuit; equipment_type: number; invalid_property_cnt: number; all_hit: boolean;
  }
  interface ItemInfo {        // 上限来源
    avatar_level_max: number;
    weapon_level_max: number;
    equip_level_max: { b:number; a:number; s:number };
    skill_core_level_max: number;   // 核心技（skill_type=5）上限
    skill_normal_level_max: { skill_type:number; level:number }[]; // 普通技上限
  }
  interface Skill { level:number; skill_type:number; items: Item[]; }
  ```
  | 关键字段 | 用途 |
  |---|---|
  | `avatar.id` / `avatar.rank` | 角色 id（数字）→ seelie key；`rank` → seelie `cons`（只增不减） |
  | `avatar.promotes` | 突破档（`resolveStatus(level, promotes)` 用真实 promotes 解析 seelie 档位） |
  | `avatar.signature_weapon_id` | 专武 id（detail 才有；list 来源需回退 `weapon?.id`） |
  | `item_info` | 等级/技能上限来源；**脚本不依赖**（命座/影画追加的更高值不参与 calc，计算封顶写死，见 §4.5） |
  | `equip` | 驱动盘（脚本未处理养成，仅透传） |

### 4.5 `ZZZ_CALC_URL`
- **地址**：`https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_calc`
- **方法**：`POST`（对应 `cfg.computeUrl`）
- **⚠️ 域名差异**：host 是 `act-api-takumi.mihoyo.com`（带 `act-` 前缀），其余 HSR/GI 计算接口是 `api-takumi.mihoyo.com`。
- **Query**：`?uid=<uid>&region=<region>`
- **专属头**：`x-rpc-cultivate_source: pc`、`x-rpc-geetest_ext`、`x-rpc-is_teaser: 1`、`x-rpc-lang: zh-cn`、`x-rpc-lrsag`、`x-rpc-page: v2.6.8_apps-h_#`
- **请求体**：
  ```jsonc
  {
    "avatar_id":"<字符串>", "avatar_level":60, "avatar_current_level":1, "avatar_current_promotes":0,
    "skills":[{"skill_type":0,"level":12,"init_level":1}, ... /* type 0/1/2/3/5/6 */],
    "weapon_info": {"weapon_id":"<字符串>", "weapon_level":60, "weapon_promotes":0, "weapon_init_level":0} // 可选
  }
  ```
- **返回**：`data`（`CalcData`）：
  ```ts
  interface CalcData {
    avatar_consume: any[];           // 角色等级/突破消耗
    weapon_consume: WeaponConsume[]; // 武器消耗
    skill_consume: SkillConsume[];   // 技能消耗
    coin_id: number;                 // 丁尼 id（10）
    user_owns_materials: Record<number, number>; // ⚠️ 对象，key 为**数字**（如 {10:..,100133:..}）
    need_get: NeedGet[];
    coin_icon: string;
  }
  interface NeedGet { id:number; cnt:number; name:string; icon:string; rarity:string; not_opened:boolean; }
  interface WeaponConsume { id:number; cnt:number; name:string; icon:string; rarity:string; not_opened:boolean; }
  interface SkillConsume { id:number; cnt:number; name:string; icon:string; rarity:string; not_opened:boolean; }
  ```
  | 入库口径 | 说明 |
  |---|---|
  | `user_owns_materials` | `{ <素材id数字>: <数量> }`；**真实持有量**，跨角色同素材取最大值写入库存（与 GI 代理值口径不同，见 §5） |
  | `coin_id` | 丁尼 id（10），对应 `items.ts` 特例 `10→denny` |
  | `skill_type` 上限 | 计算封顶写死：普通技 `{0,1,2,3,6}`=12、核心技 `5`=7；更高值来自影画追加，不参与 calc（不读 item_info） |

---

## 5. 三端差异速查

| 维度 | GI | HSR | ZZZ |
|---|---|---|---|
| 账户接口 | `getUserGameRolesByCookie` | `getUserGameRolesByCookie` | `getUserGameRolesByCookie`（同一端点，三端统一 `ROLE_URL`，见 §1.3） |
| `game_biz` | `hk4e_cn` | `hkrpg_cn` | `nap_cn` |
| 角色列表方法 | POST（body: page/size/uid/region） | GET（query） | GET（query） |
| 角色详情 | 无独立接口（list 含 weapon，透传） | GET `calc/avatar/detail` | POST 批量 `batch_avatar_detail_v2` |
| 计算接口 host | `api-takumi` | `api-takumi` | `act-api-takumi` ⚠️ |
| 计算返回 | `overall_consume[]`（数组） | `user_owns_materials{}`（对象） | `user_owns_materials{}`（对象） |
| 素材入库口径 | `num+lack_num` 最大值 | 真实持有量最大值 | 真实持有量最大值 |
| region 来源 | 账户列表 `region` | 账户列表 `region` | 账户列表 `region` |
| 命座字段 / 类型 | `constellation_num:number` | `rank:string` | `rank:number` |

---

## 6. 待补充 / 注意点（缺啥）

### 6.1 本版已补齐的内容
- **账户返回结构 + 端点统一**：新增 **§0.5**（完整 `List` 字段表 + TS 接口），明确**三端统一端点 `getUserGameRolesByCookie`**（仅 `game_biz` 不同），修正旧文档"ZZZ 用 `getUserGameRolesByCookieToken`"的错误描述。
- **账户接口专用请求头**：**§0.1.1** 列出 `x-rpc-device_id` / `x-rpc-lrsag` / `x-rpc-mi_referrer`（`common.buildRoleHeaders()` 注入）。
- **统一 `ROLE_URL` 合并**：新增 **§1.3**，说明 `GI_ROLE_URL`/`HSR_ROLE_URL`/`ZZZ_ROLE_URL` 已合并为 `ROLE_URL`（2026-08-06）；§2.2/§3.2/§4.2 改为引用 `ROLE_URL` + `game_biz`。
- **GI 三接口返回 Schema**：
  - **§2.3** `sync/avatar/list`：`Character` / `Skill` / `Weapon` / `Reliquary` 接口 + 关键字段用途表（关联角色、命座、档位）。
  - **§2.4** `avatar/list`（花名册）：`RosterCharacter` 接口，并标注与 §2.3 的差异（花名册无 `level_current`/`weapon` 等"已拥有"状态）。
  - **§2.5** `batch_compute`：`ComputeData` / `Consume` / `ComputeItem` / `SkillsConsume` 接口，明确 `overall_consume[]` 入库口径（`num+lack_num` 最大值）。
- **统一返回包装 + `region` 典型取值**：§0.3 / §0.5 已说明 `{retcode,message,data}`；`region` 典型取值 `cn_gf01` / `prod_gf_cn` 等（以账户接口实际返回为准）。
- **GI 无 `charactersDetailUrl`**：已在 §2 标注，`GameApiConfig.charactersDetailUrl` 在 GI 为 `undefined`。
- **HSR/ZZZ 字段级 Schema**：
  - **§3.3 / §3.4 / §3.5**：HSR 列表 `Avatar`、详情 `HSRCharacterData`（`skills[].point_type` 筛选口径：`Number(point_type)===2` 战斗技能、`===4` 欢愉技）、计算 `CalcData`（含 `user_owns_materials` 对象与各 `Consume` 字段）。
  - **§4.3 / §4.4 / §4.5**：ZZZ 列表 `List/Avatar`（含 `unlocked` 拥有判定）、详情 `ZZZCharacterData`（`avatar.promotes` 突破档、`signature_weapon_id` 专武、`item_info` 上限来源、`equip` 驱动盘）、计算 `CalcData`（`user_owns_materials` 数字 key、`skill_type` 封顶写死）。
  - **关键口径差异（三端 type 不一致，已写入 §3/§4）**：
    - `rank` 类型：HSR 为 `string`（命座）、ZZZ 为 `number`（影画数）、GI 为 `constellation_num:number`（命座）—— merge 时均只增不减，但解析前注意类型。
    - HSR 详情 `skills[].point_type` 接口可能返回字符串（`"2"`），比较前须 `Number()` 化（代码 `hsr/seelie.ts` 已处理）。
    - `user_owns_materials` 的 key 类型：HSR 为字符串（`{"2":..}`）、ZZZ 为数字（`{10:..}`）、GI 无此结构（用 `overall_consume[]` 数组）——入库统一按素材 id 去重取最大值。
    - ZZZ 计算 `skill_type` 上限写死（普通技 `{0,1,2,3,6}`=12、核心技 `5`=7），不读 `item_info`（影画追加更高值不参与 calc）；HSR 计算依赖真实 `max_level`。

### 6.2 仍待补充（真实缺口）
1. **`DEVICE_FP_URL` 的 `ext_fields` 硬编码 iOS**：与桌面 UA 不一致，虽实测可拿 fp，建议备注"抓包遗留"并评估是否剔除。
2. **各接口 `retcode` 语义未枚举**：`checkLogin` 仅处理 `-100`；其他未登录相关 retcode（如 `1001`/`10103`）含义未统一说明，建议补"常见 retcode 速查"。
3. **错误兜底不一致**：ZZZ/GI 列表失败 `alert` 并抛错；HSR 仅 `console.error` 返回空数组——两端行为差异建议列明。
4. **`withThrottle` 节流 key 名**：代码用 `${account}-inv_sync` 等（GI/HSR/ZZZ 各 `*-last-sync`），文档仅说"1 分钟节流"，建议补 key 名便于排查。
5. **HSR/ZZZ 计算返回是对象、GI 是数组**：这是最大口径坑（§5、§3.5、§4.5 已标注 Schema），建议代码侧补注释 + 单测守护。
6. **GI `batch_compute` 请求体 `skill_list[].id` 口径**：抓包显示用原始 `id`（如 `12031`），非 `group_id`；代码侧若用 `group_id` 需确认映射正确（已在 §2.5 标注原始 `id`）。

---

> 文档生成日期：2026-08-06，最近更新：补齐 HSR/ZZZ 字段级 Schema（§3.3~§3.5、§4.3~§4.5）并标注三端 type 口径差异（rank 类型 / point_type 字符串化 / user_owns_materials key 类型 / skill_type 封顶写死），以及统一账户端点与 `ROLE_URL` 合并。如后续接口变更，请同步更新 `apiUrls.ts` 与本文档。
