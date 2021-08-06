import {mohoyo} from "./@type/mohoyo";
import Res = mohoyo.Res;
import Role = mohoyo.Role;
import Data = mohoyo.Data;
import Character = mohoyo.Character;
import CharacterData = mohoyo.CharacterData;
import CharacterDataEx = mohoyo.CharacterDataEx;
import {config} from "./config";
import {Config} from "./@type";
import {addCharacter} from "./seelie";

const mihoyoAccountStr = localStorage.getItem("mihoyoAccount");
let mihoyoAccount;
if (mihoyoAccountStr) {
    mihoyoAccount = JSON.parse(mihoyoAccountStr) as Config
}
let {game_uid, region, accountIdx} = mihoyoAccount || config
console.log("mihoyoAccount");
console.log({game_uid, region, accountIdx});

const BBS_URL = 'https://bbs.mihoyo.com/ys/'
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

const getAccount = async () => {
    try {
        const {list: accountList} = await makeGetRequest(ROLE_URL) as Data<Role>;
        return accountList;
    } catch (err) {
        console.error(err)
        alert("请确认已登录米哈游论坛且绑定原神账户!")
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

const getDetailList = async () => {
    if (!game_uid || !region) {
        const accountList: mohoyo.Role[] = await getAccount();
        if (accountList.length === 0) {
            throw new Error("账户绑定角色信息获取失败!")
        }
        if (accountIdx >= accountList.length) {
            accountIdx = accountList.length - 1;
        }
        const {game_uid: aUid, region: aRegion} = accountList[accountIdx];
        game_uid = aUid;
        region = aRegion == "cn_gf01" ? "cn_gf01" : "cn_qd01";
        localStorage.setItem("mihoyoAccount", JSON.stringify({game_uid, region, accountIdx}))
    }

    const characters = await getCharacters(game_uid, region);
    const details = characters.map(c => getCharacterDetail(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
        detailList.push(d);
    }
    return detailList;
}


getDetailList().then(
    res => {
        console.group('返回数据');
        console.groupCollapsed('角色');
        console.table(res.map(a=>a.character))
        console.groupEnd();
        console.groupCollapsed('武器');
        console.table(res.map(a=>a.weapon))
        console.groupEnd();
        console.groupCollapsed('角色天赋');
        res.forEach(
            c=>{
                const name = c.character.name;
                console.groupCollapsed(name);
                console.table(c.skill_list)
                console.groupEnd();
            }
        )
        console.groupEnd();
        console.groupEnd();
        res.forEach(
            v => {
                addCharacter(v)
            }
        )
    }
)
