import {mihoyo} from "./@type/mihoyo";
import Res = mihoyo.Res;
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

const isGlobal = () => {
    return "hk4e_global" == localStorage.getItem("gameBiz")
}

function makeGetRequest(url: string) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: response => {
                if (response.status == 200) {
                    const res = JSON.parse(response.responseText) as Res<any>;
                    const {retcode, message, data} = res;
                    if (retcode === 0) {
                        resolve(data);
                    } else {
                        reject(message)
                    }
                } else {
                    reject(response.responseText);
                }
            },
            onerror: (error: any) => {
                reject(error);
            }
        });
    });
}

function makePostRequest(uid: string, region: string) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "POST",
            url: isGlobal()?CHARACTERS_URL_GLOBAL:CHARACTERS_URL,
            data: JSON.stringify({
                "element_attr_ids": [],
                "weapon_cat_ids": [],
                "page": 1,
                "size": 50,
                "uid": uid,
                "region": region,
                "lang":"zh-cn"
            }),
            onload: response => {
                if (response.status == 200) {
                    const res = JSON.parse(response.responseText) as Res<Character>;
                    const {retcode, message, data} = res;
                    if (retcode === 0) {
                        resolve(data);
                    } else {
                        reject(message)
                    }
                } else {
                    reject(response.responseText);
                }
            },
            onerror: (error: any) => {
                reject(error);
            }
        });
    });
}

export const getAccount = async () => {
    try {
        const {list: accountList} = await makeGetRequest(isGlobal()?ROLE_URL_GLOBAL:ROLE_URL) as Data<Role>;
        return accountList;
    } catch (err) {
        console.error(err)
        alert("请确认已登录活动页面且绑定原神账户!")
        GM_openInTab(isGlobal()?BBS_URL_GLOBAL:BBS_URL)
        return []
    }
};

const getCharacters = async (uid: string, region: string) => {
    const {list: characterList} = await makePostRequest(uid, region) as Data<Character>;
    return characterList;
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    const {id} = character;
    const params = `?avatar_id=${id}&uid=${uid}&region=${region}&lang=zh-cn`
    let URL = isGlobal()?CHARACTERS_DETAIL_URL_GLOBAL:CHARACTERS_DETAIL_URL;
    let characterData = await makeGetRequest( URL+ params) as CharacterData;
    return {character, ...characterData} as CharacterDataEx;
};

export const getDetailList = async (game_uid: string, region: string) => {

    const characters = await getCharacters(game_uid, region);
    const details = characters.map(c => getCharacterDetail(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
        detailList.push(d);
    }
    return detailList;
}



