import Role = mihoyo.Role;
import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterData = mihoyo.CharacterData;
import CharacterDataEx = mihoyo.CharacterDataEx;

const BBS_URL = 'https://www.miyoushe.com/sr/'
const ROLE_URL = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn'
const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/rpgcalc/avatar/list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/rpgcalc/avatar/detail'

const BBS_URL_GLOBAL = 'https://act.hoyoverse.com/ys/event/e20230205-firework-xm7wly/index.html?game_biz=hk4e_global'
const ROLE_URL_GLOBAL = 'https://api-os-takumi.hoyoverse.com/binding/api/getUserGameRolesByLtoken?game_biz=hk4e_global'
const CHARACTERS_URL_GLOBAL = 'https://sg-public-api.hoyoverse.com/event/calculateos/sync/avatar/list'
const CHARACTERS_DETAIL_URL_GLOBAL = 'https://sg-public-api.hoyoverse.com/event/calculateos/sync/avatar/detail'
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";

import axios, {AxiosAdapter} from "axios";
import Avatar = mihoyo.Avatar;
import HSRCharacterData = mihoyo.HSRCharacterData;

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

// (<any>window).GM.xmlHttpRequest = GM_xmlhttpRequest;

const headers = {
    Referer: "https://www.miyoushe.com/sr/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
}

const headersGolbal = {
    Referer: "https://act.hoyoverse.com/",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
}

const to = (promise: Promise<any>) => promise.then(data => {
    return [null, data];
}).catch(err => [err]);

export const isGlobal = () => {
    let b = "hkrpg_global" == localStorage.getItem("gameBiz")||"hk4e_global" == localStorage.getItem("gameBiz");
    if (b) {
        alert("暂不支持国际服")
    }
    return b
}

const requestPageSize = 50;

export const getAccount = async () => {
    // try {
    const [err, res] = await to(axios.get(isGlobal() ? ROLE_URL_GLOBAL : ROLE_URL, {
        headers: isGlobal() ? headersGolbal : headers
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
    alert("请确认已登录活动页面且绑定星铁账户!")
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL)
    throw err ? err : new Error("账户信息获取失败");
};

const getCharacters = async (uid: string, region: string, page = 1) => {

    let url = isGlobal() ? CHARACTERS_URL_GLOBAL : CHARACTERS_URL;
    let game = isGlobal() ? "" : "hkrpg";
    let params = `?game=${game}&uid=${uid}&region=${region}&lang=zh-cn&tab_from=TabOwned&page=${page}&size=100`
    const [err, res] = await to(axios.get(url + params, {
        headers: isGlobal() ? headersGolbal : headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        console.log(res)
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<Avatar>;
                return characterList;
            }
        }
    }
    alert("请确认已登录活动页面且绑定原神账户!")
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL)
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Avatar, uid: string, region: string) => {
    const {item_id:id} = character;
    let game = isGlobal() ? "" : "hkrpg";
    const params = `?game=${game}&lang=zh-cn&item_id=${id}&tab_from=TabOwned&change_target_level=0&uid=${uid}&region=${region}`
    let URL = isGlobal() ? CHARACTERS_DETAIL_URL_GLOBAL : CHARACTERS_DETAIL_URL;

    const [err, res] = await to(axios.get(URL + params, {
        headers: isGlobal() ? headersGolbal : headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const characterData = await data as HSRCharacterData;
                // return {character, ...characterData} as CharacterDataEx;
                return characterData;
            }
        }
    } else {
        console.error(err)
    }
};

export const getDetailList = async (game_uid: string, region: string) => {

    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());

    const characters: Avatar[] = [];
    for await (let i of idxs) {
        characters.push.apply(characters, await getCharacters(game_uid, region, i + 1))
    }

    const details = characters.map(c => getCharacterDetail(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
        if (!!d) {
            detailList.push(d);
        }
    }
    return detailList;
}



