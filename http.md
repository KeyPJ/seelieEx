# COMMON

```js
//hk4e_cn/hkrpg_cn/nap_cn

//https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=nap_cn


fetch("https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-lrsag": "",
    "x-rpc-mi_referrer": "https://act.mihoyo.com/ys/event/calculator/index.html#/"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});

```

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
  game_biz: string;
  region: string;
  game_uid: string;
  nickname: string;
  level: number;
  is_chosen: boolean;
  region_name: string;
  is_official: boolean;
  is_banned: boolean;
  unmask: any[];
}
```
# GI
## avatar/list
```js
fetch("https://api-takumi.mihoyo.com/event/e20200928calculate/v1/avatar/list", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-lrsag": ""
  },
  "referrer": "https://act.mihoyo.com/",
  "body": "{\"element_attr_ids\":[],\"weapon_cat_ids\":[],\"page\":1,\"size\":200,\"is_all\":true,\"lang\":\"zh-cn\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  list: List[];
  total: number;
}

export interface List {
  id: number;
  name: string;
  icon: string;
  weapon_cat_id: number;
  avatar_level: number;
  element_attr_id: number;
  max_level: number;
  item_icon: string;
  talent_icons: string[];
  side_icon: string;
  profile_pictures: Profile_picture[];
  talents: Talent[];
  skill_list: Skill_list[];
  wiki_url: string;
  wiki_recommend_weapon_url: string;
  wiki_reliquary_url: string;
  wiki_recommend_skill_url: string;
}

export interface Skill_list {
  id: number;
  group_id: number;
  name: string;
  icon: string;
  max_level: number;
  is_proud: boolean;
  pos_name: string;
}

export interface Talent {
  id: number;
  name: string;
  icon: string;
}

export interface Profile_picture {
  avatar_id: string;
  costume_id: string;
  icon: string;
  profile_picture_id: string;
}
```
## sync/avatar/list
```js
fetch("https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "content-type": "application/json;charset=UTF-8",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-lrsag": "",
    "x-rpc-page": "__#",
    "x-rpc-platform": "4"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": "{\"uid\":\"501725172\",\"region\":\"cn_qd01\",\"element_attr_ids\":[],\"weapon_cat_ids\":[],\"page\":1,\"size\":200,\"lang\":\"zh-cn\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});

```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  list: List[];
  total: number;
}

export interface List {
  id: number;
  name: string;
  icon: string;
  weapon_cat_id: number;
  avatar_level: number;
  element_attr_id: number;
  max_level: number;
  level_current: number;
  promote_level: number;
  skill_list: Skill_list[];
  weapon: Weapon;
  reliquary_list: Reliquary_list[];
  wiki_url: string;
  wiki_recommend_weapon_url: string;
  constellation_num: number;
  fetter_level: number;
}

export interface Reliquary_list {
  id: number;
  name: string;
  icon: string;
  reliquary_cat_id: number;
  reliquary_level: number;
  level_current: number;
  max_level: number;
}

export interface Weapon {
  id: number;
  name: string;
  icon: string;
  weapon_cat_id: number;
  weapon_level: number;
  max_level: number;
  level_current: number;
}

export interface Skill_list {
  id: number;
  group_id: number;
  name: string;
  icon: string;
  max_level: number;
  level_current: number;
}
```
## batch_compute
```js
fetch("https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-rpc-cal_type": "0",
        "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
        "x-rpc-lrsag": "",
        "x-rpc-stat_platform": "PC"
    },
    "referrer": "https://act.mihoyo.com/",
    "body": "{\"items\":[{\"avatar_id\":10000120,\"avatar_level_current\":1,\"avatar_level_target\":90,\"element_attr_id\":5,\"skill_list\":[{\"id\":12031,\"level_current\":1,\"level_target\":10},{\"id\":12032,\"level_current\":1,\"level_target\":10},{\"id\":12039,\"level_current\":1,\"level_target\":10},{\"id\":12021,\"level_current\":1,\"level_target\":1},{\"id\":12022,\"level_current\":1,\"level_target\":1},{\"id\":12023,\"level_current\":1,\"level_target\":1},{\"id\":12025,\"level_current\":1,\"level_target\":1}],\"weapon\":{\"id\":13516,\"name\":\"血染荒城\",\"icon\":\"https://act-webstatic.mihoyo.com/hk4e/e20200928calculate/item_icon/68c0b17a/51a4244e38d1011926a21f25942e78c6.png\",\"weapon_cat_id\":13,\"weapon_level\":5,\"max_level\":90,\"is_recommend\":true,\"wiki_url\":\"https://baike.mihoyo.com/ys/obc/content/506694/detail?bbs_presentation_style=no_header\",\"level_current\":1,\"level_target\":90},\"from_user_sync\":false},{\"avatar_id\":10000123,\"avatar_level_current\":81,\"avatar_level_target\":90,\"element_attr_id\":1,\"skill_list\":[{\"id\":12331,\"level_current\":9,\"level_target\":10},{\"id\":12332,\"level_current\":9,\"level_target\":10},{\"id\":12339,\"level_current\":9,\"level_target\":10},{\"id\":12321,\"level_current\":1,\"level_target\":1},{\"id\":12322,\"level_current\":1,\"level_target\":1},{\"id\":12323,\"level_current\":1,\"level_target\":1}],\"weapon\":{\"id\":11405,\"name\":\"匣里龙吟\",\"icon\":\"https://act-webstatic.mihoyo.com/hk4e/e20200928calculate/item_icon/67c7f6c8/85dbd526e5a6d0f20af4d0253be63ac0.png\",\"weapon_cat_id\":1,\"weapon_level\":4,\"max_level\":90,\"level_current\":90,\"level_target\":90},\"from_user_sync\":true,\"avatar_promote_level\":6}],\"lang\":\"zh-cn\",\"region\":\"cn_qd01\",\"uid\":\"501725172\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

fetch("https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-rpc-cal_type": "0",
        "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
        "x-rpc-lrsag": "",
        "x-rpc-stat_platform": "PC"
    },
    "referrer": "https://act.mihoyo.com/",
    "body": "{\"items\":[{\"weapon\":{\"id\":15516,\"level_current\":1,\"level_target\":90,\"name\":\"霜结的誓金枝\"}}],\"lang\":\"zh-cn\",\"region\":\"cn_qd01\",\"uid\":\"501725172\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});

```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  items: Item[];
  available_material: Available_material[];
  overall_consume: Overall_consume[];
  overall_material_consume: Overall_material_consume;
  jump_url: string;
  single_role_result: Single_role_result[];
  has_user_info: boolean;
}

export interface Single_role_result {
  items: Item[];
  available_material: Available_material[];
  overall_consume: Overall_consume[];
  overall_material_consume: Overall_material_consume;
  jump_url: string;
  single_role_result: any[];
  has_user_info: boolean;
}

export interface Overall_material_consume {
  avatar_consume: Avatar_consume[];
  avatar_skill_consume: Avatar_skill_consume[];
  weapon_consume: Weapon_consume[];
}

export interface Monster {
  monster_id: string;
  monster_name: string;
  monster_icon: string;
  monster_map_url: string;
}

export interface Weapon {
  id: number;
  icon: string;
  weapon_level: number;
}

export interface Dungeon_calendar {
  dungeon_name: string;
  drop_day: string[];
  calendar_link: string;
  has_data: boolean;
}

export interface Avatar {
  id: number;
  icon: string;
  avatar_level: number;
}

export interface Consume {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}

export interface Overall_consume {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}

export interface Available_material {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}

export interface Item {
  avatar_consume: Avatar_consume[];
  avatar_skill_consume: Avatar_skill_consume[];
  weapon_consume: Weapon_consume[];
  reliquary_consume: any[];
  skills_consume: Skills_consume[];
  calendar: Calendar;
  lineup_recommend: string;
}

export interface Calendar {
  dungeon_name: string;
  drop_day: string[];
  calendar_link: string;
  has_data: boolean;
}

export interface Skills_consume {
  consume_list: Consume_list[];
  skill_info: Skill_info;
}

export interface Skill_info {
  id: string;
  level_current: string;
  level_target: string;
}

export interface Consume_list {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}

export interface Weapon_consume {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}

export interface Avatar_skill_consume {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}

export interface Avatar_consume {
  id: number;
  name: string;
  icon: string;
  num: number;
  wiki_url: string;
  level: number;
  icon_url: string;
  lack_num: number;
}
```
# HSR
## rpgcultivate/avatar/list
```js
fetch("https://act-api-takumi.mihoyo.com/event/rpgcultivate/avatar/list?game=hkrpg&game_biz=hkrpg_cn&badge_region=prod_gf_cn&badge_uid=100960785", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-lang": "zh-cn",
    "x-rpc-page": "v4.4.4__#/tools/calculation",
    "x-rpc-platform": "4",
    "x-rpc-view_source": "1"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  avatars: Avatar[];
  is_login: boolean;
}

export interface Avatar {
  item_id: string;
  item_name: string;
  icon_url: string;
  damage_type: string;
  rarity: string;
  avatar_base_type: string;
  max_level: number;
  cur_level: number;
  target_level: number;
  is_forward: boolean;
  is_up: boolean;
  is_own: boolean;
  new_icon_url: string;
  wiki_url: string;
  is_new: boolean;
  first_meet_time: string;
  is_enhanced: boolean;
  avatar_number_type: string;
  rank: string;
}
```
## rpgcultivate/calc/avatar/detail
```js
fetch("https://act-api-takumi.mihoyo.com/event/rpgcultivate/calc/avatar/detail?game=hkrpg&game_biz=hkrpg_cn&badge_region=prod_gf_cn&badge_uid=100960785&item_id=1405&change_target_level=0", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-lang": "zh-cn",
    "x-rpc-page": "v4.4.4__#/tools/calculation",
    "x-rpc-platform": "4",
    "x-rpc-view_source": "1"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  avatar: Avatar;
  skills: Skill[];
  skills_other: Skills_other[];
  equipment: any;
  skills_servant: any[];
  skills_special: any[];
}

export interface Skills_other {
  point_id: string;
  pre_point: string;
  point_type: number;
  anchor: string;
  item_url: string;
  max_level: number;
  cur_level: number;
  target_level: number;
  progress: string;
  min_level_limit: number;
  order: number;
  is_recommend: boolean;
  item_name: string;
  rank_add: number;
  special_point_type: string;
}

export interface Skill {
  point_id: string;
  pre_point: string;
  point_type: number;
  anchor: string;
  item_url: string;
  max_level: number;
  cur_level: number;
  target_level: number;
  progress: string;
  min_level_limit: number;
  order: number;
  is_recommend: boolean;
  item_name: string;
  rank_add: number;
  special_point_type: string;
}

export interface Avatar {
  item_id: string;
  item_name: string;
  icon_url: string;
  damage_type: string;
  rarity: string;
  avatar_base_type: string;
  max_level: number;
  cur_level: number;
  target_level: number;
  is_forward: boolean;
  is_up: boolean;
  is_own: boolean;
  new_icon_url: string;
  wiki_url: string;
  is_new: boolean;
  first_meet_time: string;
  is_enhanced: boolean;
  avatar_number_type: string;
  rank: string;
}
```
## rpgcultivate/calc/compute
```js
fetch("https://act-api-takumi.mihoyo.com/event/rpgcultivate/calc/compute?game=hkrpg&game_biz=hkrpg_cn&badge_region=prod_gf_cn&badge_uid=100960785", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-lang": "zh-cn",
    "x-rpc-page": "v4.4.4__#/tools/calculation",
    "x-rpc-platform": "4",
    "x-rpc-view_source": "1"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": "{\"game\":\"hkrpg\",\"avatar\":{\"item_id\":\"1405\",\"cur_level\":1,\"target_level\":80},\"equipment\":{\"item_id\":\"24004\",\"cur_level\":1,\"target_level\":80},\"skill_list\":[{\"item_id\":\"1405001\",\"cur_level\":1,\"target_level\":6},{\"item_id\":\"1405002\",\"cur_level\":1,\"target_level\":10},{\"item_id\":\"1405003\",\"cur_level\":1,\"target_level\":10},{\"item_id\":\"1405004\",\"cur_level\":1,\"target_level\":10},{\"item_id\":\"1405101\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405102\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405103\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405201\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405202\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405203\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405204\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405205\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405206\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405207\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405208\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405209\",\"cur_level\":1,\"target_level\":1},{\"item_id\":\"1405210\",\"cur_level\":1,\"target_level\":1}],\"uid\":\"100960785\",\"region\":\"prod_gf_cn\"}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
fetch("https://act-api-takumi.mihoyo.com/event/rpgcultivate/calc/compute?game=hkrpg&game_biz=hkrpg_cn&badge_region=prod_gf_cn&badge_uid=100960785", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-rpc-device_fp": "38d80929cfd78",
        "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
        "x-rpc-lang": "zh-cn",
        "x-rpc-page": "v4.4.4__#/tools/calculation",
        "x-rpc-platform": "4",
        "x-rpc-view_source": "1"
    },
    "referrer": "https://act.mihoyo.com/",
    "body": "{\"game\":\"hkrpg\",\"equipment\":{\"item_id\":\"23044\",\"cur_level\":1,\"target_level\":80},\"uid\":\"100960785\",\"region\":\"prod_gf_cn\"}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});
```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  avatar_consume: Avatar_consume[];
  skill_consume: Skill_consume[];
  equipment_consume: Equipment_consume[];
  user_owns_materials: User_owns_materials;
  need_get_materials: Need_get_material[];
  can_pay_materials: Can_pay_material[];
  can_merge_materials: Can_merge_material[];
  coin_id: string;
}

export interface Can_merge_material {
  item_id: string;
  item_name: string;
  item_url: string;
  num: number;
  wiki_url: string;
  rarity: string;
  item_group: string;
  item_purpose: string;
  item_desc: string;
  item_bg_desc: string;
}

export interface Can_pay_material {
  item_id: string;
  item_name: string;
  item_url: string;
  num: number;
  wiki_url: string;
  rarity: string;
  item_group: string;
  item_purpose: string;
  item_desc: string;
  item_bg_desc: string;
}

export interface Need_get_material {
  item_id: string;
  item_name: string;
  item_url: string;
  num: number;
  wiki_url: string;
  rarity: string;
  item_group: string;
  item_purpose: string;
  item_desc: string;
  item_bg_desc: string;
}

export interface User_owns_materials {
  2: number;
  213: number;
  223: number;
  241: number;
  110201: number;
  110202: number;
  110505: number;
  111001: number;
  115011: number;
}

export interface Equipment_consume {
  item_id: string;
  item_name: string;
  item_url: string;
  num: number;
  wiki_url: string;
  rarity: string;
  item_group: string;
  item_purpose: string;
  item_desc: string;
  item_bg_desc: string;
}

export interface Skill_consume {
  item_id: string;
  item_name: string;
  item_url: string;
  num: number;
  wiki_url: string;
  rarity: string;
  item_group: string;
  item_purpose: string;
  item_desc: string;
  item_bg_desc: string;
}

export interface Avatar_consume {
  item_id: string;
  item_name: string;
  item_url: string;
  num: number;
  wiki_url: string;
  rarity: string;
  item_group: string;
  item_purpose: string;
  item_desc: string;
  item_bg_desc: string;
}
```
# ZZZ
## nap_cultivate_tool/user/avatar_basic_list
```js
fetch("https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list?uid=11552471&region=prod_gf_cn", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-cultivate_source": "pc",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-geetest_ext": "{\"gameId\":8,\"page\":\"v2.6.8_apps-h_#\",\"viewSource\":1,\"actionSource\":132}",
    "x-rpc-is_teaser": "1",
    "x-rpc-lang": "zh-cn",
    "x-rpc-lrsag": "",
    "x-rpc-page": "v2.6.8_apps-h_#",
    "x-rpc-platform": "4"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": null,
  "method": "GET",
  "mode": "cors",
  "credentials": "include"
});
```
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
  avatar: Avatar;
  unlocked: boolean;
  is_up: boolean;
  is_teaser: boolean;
  is_top: boolean;
}

export interface Avatar {
  id: number;
  level: number;
  name_mi18n: string;
  full_name_mi18n: string;
  element_type: number;
  camp_name_mi18n: string;
  avatar_profession: number;
  rarity: string;
  group_icon_path: string;
  hollow_icon_path: string;
  rank: number;
  sub_element_type: number;
  awaken_state: string;
}
```
## nap_cultivate_tool/user/batch_avatar_detail_v2
```js
fetch("https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2?uid=11552471&region=prod_gf_cn", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-cultivate_source": "pc",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-geetest_ext": "{\"gameId\":8,\"page\":\"v2.6.8_apps-h_#\",\"viewSource\":1,\"actionSource\":132}",
    "x-rpc-is_teaser": "1",
    "x-rpc-lang": "zh-cn",
    "x-rpc-lrsag": "",
    "x-rpc-page": "v2.6.8_apps-h_#",
    "x-rpc-platform": "4"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": "{\"avatar_list\":[{\"avatar_id\":1181,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false},{\"avatar_id\":1191,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false},{\"avatar_id\":1201,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false},{\"avatar_id\":1211,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false},{\"avatar_id\":1221,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false},{\"avatar_id\":1241,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false},{\"avatar_id\":1251,\"is_teaser\":false,\"teaser_need_weapon\":false,\"teaser_sp_skill\":false}]}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
```
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
  avatar: Avatar;
  equip: Equip[];
  weapon: any;
  plan: Plan;
  user: User;
  plan_changed: boolean;
  plan_deleted: boolean;
  my_plan_id: string;
  valid_property_cnt: number;
  plan_only_special_property: boolean;
  from_my_plan: boolean;
  item_info: Item_info;
  next_item_info: Next_item_info;
  my_plan_list: any[];
  new_feed_plan_flag: boolean;
  old_plan: boolean;
  is_followed: boolean;
  teaser: Teaser;
}

export interface Teaser {
  is_teaser: boolean;
  avatar_consume: any[];
  weapon_consume: any[];
  skill_consume: any[];
  coin_id: number;
  user_owns_materials: User_owns_materials;
  need_get: any[];
  skill_upgrade: any;
  calc_success: boolean;
  avatar_wiki: string;
  coin_icon: string;
}

export interface User_owns_materials {
}

export interface Next_item_info {
  avatar_level_max: number;
  weapon_level_max: number;
  equip_level_max: Equip_level_max;
  skill_core_level_max: number;
  skill_normal_level_max: Skill_normal_level_max[];
}

export interface Item_info {
  avatar_level_max: number;
  weapon_level_max: number;
  equip_level_max: Equip_level_max;
  skill_core_level_max: number;
  skill_normal_level_max: Skill_normal_level_max[];
}

export interface Skill_normal_level_max {
  skill_type: number;
  level: number;
}

export interface Equip_level_max {
  b: number;
  a: number;
  s: number;
}

export interface User {
  aid: string;
  name: string;
  avatar: string;
  level: number;
  jump_url: string;
  uid: string;
}

export interface Plan {
  id: string;
  name: string;
  desc: string;
  released_at: string;
  item: Item;
}

export interface Unlock_info {
  avatar: Avatar;
  buddy: Buddy;
  weapon: Weapon;
}

export interface Buddy {
}

export interface Team {
  main: Main;
  backup: Backup;
}

export interface Weapon {
  main: Main;
  backup: Backup;
}

export interface Backup {
  id: number;
  level: number;
  name: string;
  star: number;
  icon: string;
  rarity: string;
  properties: any[];
  main_properties: any[];
  talent_title: string;
  talent_content: string;
  profession: number;
}

export interface Main {
  id: number;
  level: number;
  name: string;
  star: number;
  icon: string;
  rarity: string;
  properties: any[];
  main_properties: any[];
  talent_title: string;
  talent_content: string;
  profession: number;
}

export interface Equip {
  id: number;
  level: number;
  name: string;
  icon: string;
  rarity: string;
  properties: Propertie[];
  main_properties: Main_propertie[];
  equip_suit: Equip_suit;
  equipment_type: number;
  invalid_property_cnt: number;
  all_hit: boolean;
}

export interface Equip_suit {
  suit_id: number;
  name: string;
  own: number;
  desc1: string;
  desc2: string;
  icon: string;
  cnt: number;
  rarity: string;
}

export interface Main_propertie {
  property_name: string;
  property_id: number;
  base: string;
  level: number;
  valid: boolean;
  system_id: number;
  add: number;
}

export interface Avatar {
  id: number;
  level: number;
  name_mi18n: string;
  full_name_mi18n: string;
  element_type: number;
  camp_name_mi18n: string;
  avatar_profession: number;
  rarity: string;
  group_icon_path: string;
  hollow_icon_path: string;
  properties: Propertie[];
  skills: Skill[];
  rank: number;
  ranks: Rank[];
  sub_element_type: number;
  signature_weapon_id: number;
  awaken_state: string;
  skill_upgrade: Skill_upgrade;
  promotes: number;
  unlock: boolean;
  skill_awaken: Skill_awaken;
}

export interface Skill_awaken {
  has_awaken_system: boolean;
  awaken_level: number;
  awaken_max_level: number;
}

export interface Skill_upgrade {
  first: number[];
  second: number[];
  third: number[];
}

export interface Rank {
  id: number;
  name: string;
  desc: string;
  pos: number;
  is_unlocked: boolean;
}

export interface Skill {
  level: number;
  skill_type: number;
  items: Item[];
}

export interface Item {
  title: string;
  text: string;
  awaken: boolean;
}

export interface Propertie {
  property_name: string;
  property_id: number;
  base: string;
  add: string;
  final: string;
  final_val: string;
}
```
## nap_cultivate_tool/user/avatar_calc
```js
fetch("https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_calc?uid=11552471&region=prod_gf_cn", {
  "headers": {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7,ja-CN;q=0.6,ja;q=0.5,zh-TW;q=0.4",
    "content-type": "application/json",
    "priority": "u=1, i",
    "sec-ch-ua": "\"Not;A=Brand\";v=\"8\", \"Chromium\";v=\"150\", \"Google Chrome\";v=\"150\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "x-rpc-cultivate_source": "pc",
    "x-rpc-device_fp": "38d80929cfd78",
    "x-rpc-device_id": "9d6ce9af-0e0e-4d8b-9d52-edd40c15e86a",
    "x-rpc-geetest_ext": "{\"gameId\":8,\"page\":\"v2.6.8_apps-h_#\",\"viewSource\":1,\"actionSource\":132}",
    "x-rpc-is_teaser": "1",
    "x-rpc-lang": "zh-cn",
    "x-rpc-lrsag": "",
    "x-rpc-page": "v2.6.8_apps-h_#",
    "x-rpc-platform": "4"
  },
  "referrer": "https://act.mihoyo.com/",
  "body": "{\"avatar_id\":1211,\"avatar_level\":60,\"avatar_current_level\":60,\"avatar_current_promotes\":6,\"skills\":[{\"skill_type\":0,\"level\":11,\"init_level\":11},{\"skill_type\":1,\"level\":12,\"init_level\":11},{\"skill_type\":2,\"level\":11,\"init_level\":11},{\"skill_type\":3,\"level\":11,\"init_level\":11},{\"skill_type\":5,\"level\":7,\"init_level\":7},{\"skill_type\":6,\"level\":11,\"init_level\":11}],\"weapon_info\":{\"weapon_id\":14149,\"weapon_level\":60,\"weapon_promotes\":0,\"weapon_init_level\":0}}",
  "method": "POST",
  "mode": "cors",
  "credentials": "include"
});
```
```ts
export interface RootObject {
  retcode: number;
  message: string;
  data: Data;
}

export interface Data {
  avatar_consume: any[];
  weapon_consume: Weapon_consume[];
  skill_consume: Skill_consume[];
  coin_id: number;
  user_owns_materials: User_owns_materials;
  need_get: Need_get[];
  coin_icon: string;
}

export interface Need_get {
  id: number;
  cnt: number;
  name: string;
  icon: string;
  rarity: string;
  not_opened: boolean;
}

export interface User_owns_materials {
  10: number;
  100133: number;
  100941: number;
  101013: number;
  101023: number;
  300003: number;
  301003: number;
}

export interface Skill_consume {
  id: number;
  cnt: number;
  name: string;
  icon: string;
  rarity: string;
  not_opened: boolean;
}

export interface Weapon_consume {
  id: number;
  cnt: number;
  name: string;
  icon: string;
  rarity: string;
  not_opened: boolean;
}
```
