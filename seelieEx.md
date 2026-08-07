# seelieEx 脚本设计说明

> 本文档描述 seelieEx 油猴脚本**自身**的运行时行为（节流、缓存、库存写入口径、脚本侧注意点），
> 与 `mihoyo.md`（米游社接口清单）互补：`mihoyo.md` 是「米游社给了什么」，`seelieEx.md` 是「脚本怎么用」。
> 两文档均只做事实性介绍，不记录修改历史。

---

## 1. 频率与节流（脚本侧）

| 端 | 间隔策略 | 备注 |
|---|---|---|
| GI | **整批一次请求①**（不切 256）；失败则二分重试隔离始终失败的坏项，再追加「剔除坏项」的全量**请求②**；请求②仍失败则按原逻辑合并二分成功的各部分。重试前 `sleep(1000)` | `batch_compute` 整批 `items` 一次计算，正常仅 1 次 HTTP（失败才退化到二分+追加请求） |
| HSR | 库存 `calc/compute` 每角色后 `sleep(400)`；角色同步 `getDetailList` 分批 `D_BATCH=8` + 批间 `sleep(400)` | 单 avatar `calc/compute` / `rpgcultivate/calc/avatar/detail` |
| ZZZ | 每角色请求前 `sleepWithJitter(800, 400)`（含首次/末次） | 频限最严 |
| 全部 | 库存同步整体 1 分钟节流（`withThrottle`，key=`${account}-inv_sync`） | 冷却内 `alert` 并跳过 |

---

## 2. 计算缓存（char/wp 双命名空间拆分去重）

HSR/ZZZ 逐角色 `calc/compute` / `avatar_calc` 响应含 `avatar_consume` / `skill_consume` / `equipment_consume`(HSR) 或 `weapon_consume`(ZZZ) + `user_owns_materials`。calc 请求 = 「角色(avatar+skill_list) + 武器(equipment)」，而响应可干净拆成「角色部分(`avatar_consume`+`skill_consume`)」与「武器部分(`equipment_consume`/`weapon_consume`)」，两者各自只取决于对应培养目标，故建**两条命名空间**分别判重。

- **策略模式**：各游戏 calc 响应**字段名不同**（HSR 用 `equipment_consume`+`item_id`；ZZZ 用 `weapon_consume`+`id`），把「如何从响应抽取素材 id」封装进 `CalcConsumeStrategy` 接口（`{game, gameName, charItemIds(data), wpItemIds(data)}`，定义在 `inventory-common.ts`）。具体策略 `hsrCalcStrategy`（hsr/hoyo.ts）、`zzzCalcStrategy`（zzz/hoyo.ts）各自实现字段名映射；`postCalcAndMerge` 保持通用、不含任何 HSR/ZZZ 专属字段名。新增游戏只需在其 adapter 实现策略对象，公共方法零改动。GI 不适用（走 `batch_compute` + `overall_consume` 批量模型，非逐角色）。
- **角色命名空间** `seelieex:char:<game>:<charKey>`（game∈{hsr,zzz}，charKey=角色 id）缓存 `charSig` + `charItemIds`（`avatar/skill_consume` 引用的素材 id 集合，由 `strategy.charItemIds` 抽取）。
- **武器命名空间** `seelieex:wp:<game>:<wpKey>`（wpKey=武器 id）缓存 `wpSig` + `wpItemIds`（`equipment_consume`/`weapon_consume` 引用的素材 id，由 `strategy.wpItemIds` 抽取）。
- **跳过判据**：本次同步维护 `state.covered`（各真实请求里 `avatar/skill/equipment|weapon_consume` 引用的素材 id **并集**，即「本次同步已通过真实请求拿到其账号级持有量」的素材全集，含用户未持有的）。处理某组合时，若「角色部分命中(`charSig` 一致) AND 武器部分命中(`wpSig` 一致) AND 已拿到新鲜库存(`state.fresh`) AND 本组合 consume 引用的全部素材 ⊆ `state.covered`」→ 跳过该组合的网络请求（请求体仍按 API 把角色+武器拼一起发，拆分只发生在响应解析与缓存层）。
- **拆分去重收益**：只要「角色缓存过 AND 武器缓存过」即可跳过，即便从未一起请求过（例：`(圆A+武B)` 在 `(圆A+武A)+(圆B+武B)` 之后即可跳过）。
- **安全护栏（防漏数据）**：覆盖集 `state.covered` 仅并入「本同步真实请求」的 consume 素材 id（不缓存 `user_owns_materials`、不用需求直接扩张）；被跳过的组合其 consume 必为 covered 子集 → 其中「用户持有」素材必已被前面某角色以账号级同值抓到，绝不漏数据；最终入库用 `user_owns_materials` 实时值。
- 效果：首次同步全量计算并填两条缓存（控制台打「已写入角色缓存/武器缓存」）；后续同步仅「首个组合（`fresh=false` 必真实请求）+ 未被覆盖的组合」真实请求，被覆盖组合打「所需素材均已被本次同步其他角色覆盖…跳过接口请求」。GI 未纳入。

---

## 3. 库存写入口径（三端差异）

- **GI**：`overall_consume[]` 每元素 `{id, num, lack_num}`；**跨请求来源按素材 `id` 取 `num+lack_num` 最大值**写入库存（代理值口径）。`overall_material_consume` 按角色/天赋/武器拆分仅展示，入库只用 `overall_consume` 汇总。`available_material` 为背包已有素材（可对照核验）。
- **HSR/ZZZ**：`user_owns_materials` 为**真实持有量**（HSR key 是字符串如 `{"2":123}`，ZZZ key 是数字如 `{10:..}`）；跨角色同素材取最大值写入库存。
- 写入目标：seelie 库存 `{type, item, tier, value}[]` → `localStorage[${account}-inventory]`。
- 跨请求来源按素材 id 去重取最大值（GI 取 `num+lack_num`，HSR/ZZZ 取真实持有量）。GI 正常只发请求①或请求②（单一干净整批，无重复 id）；仅当二分成功部分与请求②都失败、走原逻辑合并时才可能出现跨来源重复，聚合逻辑仍保留兜底。
- `items.ts` 特例：GI `104003→xp` / `202→mora` / `104013→wep_xp`；HSR `2→credit`；ZZZ `10→denny`。
- 限流：各端 1 分钟（`*-last-sync`）。
- ⚠️ 口径差异：GI 代理值 vs HSR/ZZZ 真实持有量，二者不同；回写真实进度需改 baseline 或补 seelie key→avatar_id 反查。

---

## 4. 脚本侧待补充 / 注意点

1. **错误兜底不一致**：三端「列表失败」统一为 `checkLogin`+`console.warn`+`throw`；但「详情失败」仍不完全一致（HSR 详情失败 `return null` 静默跳过、ZZZ 详情失败 `return null`+批次 `dropped` 计数告警），建议后续统一。
2. **`withThrottle` 节流 key 名**：代码用 `${account}-inv_sync` 等（GI/HSR/ZZZ 各 `*-last-sync`），排查时需对应。
