import Role = mihoyo.Role;
import Data = mihoyo.Data;
import adapter from "axios-userscript-adapter/dist/esm";
import {charactersNum} from "./query";

import axios, {AxiosAdapter} from "axios";
import Avatar = mihoyo.Avatar;
import HSRCharacterData = mihoyo.HSRCharacterData;
import {headers, to} from "../common";

axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/rpgcalc/avatar/list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/rpgcalc/avatar/detail'

const requestPageSize = 50;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let url = CHARACTERS_URL;
    let game = "hkrpg";
    let params = `?game=${game}&uid=${uid}&region=${region}&lang=zh-cn&tab_from=TabOwned&page=${page}&size=100`
    const [err, res] = await to(axios.get(url + params, {
        headers: headers
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<Avatar>;
                return characterList;
            }
        }
    }
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (character: Avatar, uid: string, region: string) => {
    const {item_id: id} = character;
    let game = "hkrpg";
    const params = `?game=${game}&lang=zh-cn&item_id=${id}&tab_from=TabOwned&change_target_level=0&uid=${uid}&region=${region}`
    let URL = CHARACTERS_DETAIL_URL;

    const [err, res] = await to(axios.get(URL + params, {
        headers: headers
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


