import Role = mihoyo.Role;
import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterData = mihoyo.CharacterData;
import CharacterDataEx = mihoyo.CharacterDataEx;

const BBS_URL = 'https://webstatic.mihoyo.com/ys/event/e20210928review/index.html'
const ROLE_URL = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn'
const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/detail'

const BBS_URL_GLOBAL = 'https://act.hoyoverse.com/ys/event/e20230205-firework-xm7wly/index.html?game_biz=hk4e_global'
const ROLE_URL_GLOBAL = 'https://api-os-takumi.hoyoverse.com/binding/api/getUserGameRolesByLtoken?game_biz=hk4e_global'
const CHARACTERS_URL_GLOBAL = 'https://sg-public-api.hoyoverse.com/event/calculateos/sync/avatar/list'
const CHARACTERS_DETAIL_URL_GLOBAL = 'https://sg-public-api.hoyoverse.com/event/calculateos/sync/avatar/detail'
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";

import axios, {AxiosAdapter, AxiosRequestHeaders} from "axios";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

// (<any>window).GM.xmlHttpRequest = GM_xmlhttpRequest;
function generateCharString(number = 16) {
    const characters = 'abcdef0123456789';
    let result = '';
    for (let i = 0; i < number; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
}

const headers = {
    Referer: "https://webstatic.mihoyo.com/",
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
    // return "hk4e_global" == localStorage.getItem("gameBiz")
    return false;
}

const requestPageSize = 200;

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
    alert("请确认已登录活动页面且绑定原神账户!")
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL)
    throw err ? err : new Error("账户信息获取失败");
};

const getCharacters = async (uid: string, region: string, page = 1) => {

    let fp = await getFp();
    const headers = {
        "x-rpc-device_fp": fp,
        Referer: "https://webstatic.mihoyo.com/",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
    }
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
        timeout: 5000,
        headers: headers as unknown as AxiosRequestHeaders
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
    localStorage.removeItem("fp")
    alert("请确认已登录活动页面且绑定原神账户!")
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL)
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    // const {id} = character;
    // const params = `?avatar_id=${id}&uid=${uid}&region=${region}&lang=zh-cn`
    // let URL = isGlobal() ? CHARACTERS_DETAIL_URL_GLOBAL : CHARACTERS_DETAIL_URL;
    // const [err, res] = await to(axios.get(URL + params, {
    //     headers: isGlobal() ? headersGolbal : headers
    // }));
    // if (!err) {
    //     const {status, data: resData} = await res;
    //     if (status == 200) {
    //         const {retcode, data} = resData;
    //         if (retcode === 0) {
    //             const characterData = await data as CharacterData;
    //             return {character, ...characterData} as CharacterDataEx;
    //         }
    //     }
    // } else {
    //     console.error(err)
    // }
    // console.log(character);
    return {character, ...character} as any as CharacterDataEx
};

function getGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
}

const getFp = async () => {
    let fp = localStorage.getItem("fp");
    let deviceId = localStorage.getItem("mysDeviceId");
    if (!deviceId) {
        deviceId = getGuid()
        localStorage.setItem("mysDeviceId", deviceId);
    }
    if (!fp) {
        let url = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
        const [err, res] = await to(axios.post(url,
            JSON.stringify({
                seed_id: generateCharString(),
                device_id: deviceId.toUpperCase(),
                platform: '1',
                seed_time: new Date().getTime() + '',
                ext_fields: `{"proxyStatus":"0","accelerometer":"-0.159515x-0.830887x-0.682495","ramCapacity":"3746","IDFV":"${deviceId.toUpperCase()}","gyroscope":"-0.191951x-0.112927x0.632637","isJailBreak":"0","model":"iPhone12,5","ramRemain":"115","chargeStatus":"1","networkType":"WIFI","vendor":"--","osVersion":"17.0.2","batteryStatus":"50","screenSize":"414×896","cpuCores":"6","appMemory":"55","romCapacity":"488153","romRemain":"157348","cpuType":"CPU_TYPE_ARM64","magnetometer":"-84.426331x-89.708435x-37.117889"}`,
                app_name: 'bbs_cn',
                device_fp: '38d7ee834d1e9'
            }), {
                timeout: 5000,
                headers: headers as unknown as AxiosRequestHeaders
            }));
        if (!err) {
            const {status, data: resData} = await res;
            console.log(res)
            if (status == 200) {
                const {retcode, data} = resData;
                if (retcode === 0) {
                    console.log(data)
                    let resFp = data["device_fp"];
                    localStorage.setItem("fp",resFp);
                    return resFp;
                }
            }
        }
    } else {
        return fp;
    }
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
        if (!!d) {
            detailList.push(d);
        }
    }
    return detailList;
}



