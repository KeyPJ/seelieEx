// src/adapters/apiUrls.ts
// 米游社请求地址集中管理（三端共用）。
// 禁止在各游戏适配器/hoyo.ts 中再硬编码 URL 字符串，一律从这里导入。
// 本模块为叶子模块：只导出字符串常量，不依赖任何业务模块（避免循环依赖）。
//
// 命名约定：
//   - 共用（跨端）：ACT_MIHOYO_BASE_URL / DEVICE_FP_URL
//   - 按游戏前缀：GI_ / HSR_ / ZZZ_
//   - _CALC_PAGE_URL：计算器页面 URL（同时用于 checkLogin 打开页面 与 getAccount 的 openUrl）
//   - _ROLE_URL：绑定角色列表 API
//   - 其余：各游戏接口 URL

// ===== 共用 =====
/** 米游社 act 站根地址（请求头 Referer） */
export const ACT_MIHOYO_BASE_URL = "https://act.mihoyo.com/";
/** 设备指纹获取 API（getFp） */
export const DEVICE_FP_URL = "https://public-data-api.mihoyo.com/device-fp/api/getFp";

// ===== 原神（GI） =====
/** 原神养成计算器页面 */
export const GI_CALC_PAGE_URL = "https://act.mihoyo.com/ys/event/calculator/index.html";
/** 原神绑定角色列表 */
export const GI_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";
/** 已拥有角色列表（v1/sync，需 uid/region） */
export const GI_CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list";
/** 全量角色花名册（v1/avatar/list，is_all:true） */
export const GI_ALL_CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/avatar/list";
/** 批量计算素材 */
export const GI_BATCH_COMPUTE_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute";

// ===== 崩坏：星穹铁道（HSR） =====
/** HSR 养成工具页面 */
export const HSR_CALC_PAGE_URL = "https://act.mihoyo.com/sr/event/cultivation-tool/index.html";
/** HSR 绑定角色列表 */
export const HSR_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn";
/** 角色列表 */
export const HSR_AVATAR_LIST_URL = "https://api-takumi.mihoyo.com/event/rpgcultivate/avatar/list";
/** 角色详情 */
export const HSR_AVATAR_DETAIL_URL = "https://api-takumi.mihoyo.com/event/rpgcultivate/calc/avatar/detail";
/** 素材计算 */
export const HSR_COMPUTE_URL = "https://api-takumi.mihoyo.com/event/rpgcultivate/calc/compute";

// ===== 绝区零（ZZZ） =====
/** ZZZ 养成工具页面 */
export const ZZZ_CALC_PAGE_URL = "https://act.mihoyo.com/zzz/gt/character-builder-h/index.html";
/** ZZZ 绑定角色列表 */
export const ZZZ_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookieToken?game_biz=nap_cn";
/** 角色列表 */
export const ZZZ_CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list";
/** 角色详情（批量） */
export const ZZZ_CHARACTERS_DETAIL_URL = "https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2";
/** 素材计算 */
export const ZZZ_CALC_URL = "https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_calc";
