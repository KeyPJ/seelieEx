import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterDataEx = mihoyo.CharacterDataEx;
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";
import axios, {AxiosAdapter, AxiosRequestHeaders} from "axios";
import {getFp, headers, to} from "../common";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;


const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list'

const requestPageSize = 200;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let fp = await getFp();
    const genshinHeaders = {
        "x-rpc-device_fp": fp,
        ...headers,
    }
    const [err, res] = await to(axios.post(CHARACTERS_URL, JSON.stringify({
        "element_attr_ids": [],
        "weapon_cat_ids": [],
        "page": page,
        "size": requestPageSize,
        "uid": uid,
        "region": region,
        "lang": "zh-cn"
    }), {
        timeout: 5000,
        headers: genshinHeaders as unknown as AxiosRequestHeaders
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<Character>;
                return characterList;
            }
        }
    }
    localStorage.removeItem("fp")
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    return {character, ...character} as any as CharacterDataEx
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



