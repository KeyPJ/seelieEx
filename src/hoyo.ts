import Role = mihoyo.Role;
import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterData = mihoyo.CharacterData;
import CharacterDataEx = mihoyo.CharacterDataEx;

const BBS_URL = 'https://webstatic.mihoyo.com/ys/event/e20210928review/index.html'
const ROLE_URL = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn'
const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/detail'

const BBS_URL_GLOBAL = 'https://webstatic-sea.mihoyo.com/ys/event/e20210928review/index.html'
const ROLE_URL_GLOBAL = 'https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByLtoken?game_biz=hk4e_global'
const CHARACTERS_URL_GLOBAL = 'https://sg-public-api.mihoyo.com/event/calculateos/sync/avatar/list'
const CHARACTERS_DETAIL_URL_GLOBAL = 'https://sg-public-api.mihoyo.com/event/calculateos/sync/avatar/detail'
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";

import axios, {AxiosAdapter} from "axios";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

// (<any>window).GM.xmlHttpRequest = GM_xmlhttpRequest;

const headers = {
    Referer: "https://webstatic.mihoyo.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
}

const to = (promise: Promise<any>) => promise.then(data => {
    return [null, data];
}).catch(err => [err]);

export const isGlobal = () => {
    return "hk4e_global" == localStorage.getItem("gameBiz")
}

const requestPageSize = 50;

export const getAccount = async () => {
    // try {
    const [err, res] = await to(axios.get(isGlobal() ? ROLE_URL_GLOBAL : ROLE_URL, {
        headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: accountList} = await data as Data<Role>;
                return accountList;
            }
        }
    }
    alert("请确认已登录活动页面且绑定原神账户!")
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL)
    throw err ? err : new Error("账户信息获取失败");
};

const getCharacters = async (uid: string, region: string, page = 1) => {

    let url = isGlobal() ? CHARACTERS_URL_GLOBAL : CHARACTERS_URL;
    const [err, res] = await to(axios.post(url, JSON.stringify({
        "element_attr_ids": [],
        "weapon_cat_ids": [],
        "page": page,
        "size": requestPageSize,
        "uid": uid,
        "region": region,
        "lang": "zh-cn"
    }), {
        headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        console.log(res)
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<Character>;
                return characterList;
            }
        }
    }
    alert("请确认已登录活动页面且绑定原神账户!")
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL)
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    const {id} = character;
    const params = `?avatar_id=${id}&uid=${uid}&region=${region}&lang=zh-cn`
    let URL = isGlobal() ? CHARACTERS_DETAIL_URL_GLOBAL : CHARACTERS_DETAIL_URL;

    const [err, res] = await to(axios.get(URL + params, {
        headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const characterData = await data as CharacterData;
                return {character, ...characterData} as CharacterDataEx;
            }
        }
    }
    throw err ? err : new Error("角色详情获取失败");
};

export const getDetailList = async (game_uid: string, region: string) => {

    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());

    const characters: Character[] = [];
    for await (let i of idxs) {
        characters.push.apply(characters, await getCharacters(game_uid, region, i + 1))
    }

    const details = characters.map(c => getCharacterDetail(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
        detailList.push(d);
    }
    return detailList;
}



