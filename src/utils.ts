import {mihoyo} from "./@type/mihoyo";
import Res = mihoyo.Res;
import Role = mihoyo.Role;
import Data = mihoyo.Data;
import Character = mihoyo.Character;
import CharacterData = mihoyo.CharacterData;
import CharacterDataEx = mihoyo.CharacterDataEx;

const BBS_URL = 'https://webstatic.mihoyo.com/ys/event/e20210122-slime/index.html'
const ROLE_URL = 'https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn'
const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/detail'

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
            url: CHARACTERS_URL,
            data: JSON.stringify({
                "element_attr_ids": [],
                "weapon_cat_ids": [],
                "page": 1,
                "size": 50,
                "uid": uid,
                "region": region
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
        const {list: accountList} = await makeGetRequest(ROLE_URL) as Data<Role>;
        return accountList;
    } catch (err) {
        console.error(err)
        alert("请确认已登录活动页面且绑定原神账户!")
        GM_openInTab(BBS_URL)
        return []
    }
};

const getCharacters = async (uid: string, region: string) => {
    const {list: characterList} = await makePostRequest(uid, region) as Data<Character>;
    return characterList;
};

const getCharacterDetail = async (character: Character, uid: string, region: string) => {
    const {id} = character;
    const params = `?avatar_id=${id}&uid=${uid}&region=${region}`
    let characterData = await makeGetRequest(CHARACTERS_DETAIL_URL + params) as CharacterData;
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


