import Data = mihoyo.Data;
import adapter from "axios-userscript-adapter/dist/esm";

import axios, {AxiosAdapter} from "axios";
import Avatar = mihoyo.ZZZAvatar;
import CharacterData = mihoyo.ZZZCharacterData;
import {getFp, headers, to} from "../common";


axios.defaults.adapter = adapter as AxiosAdapter;
axios.defaults.withCredentials = true;

const CHARACTERS_URL = 'https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list'
const CHARACTERS_DETAIL_URL = 'https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2'

const requestPageSize = 50;

const getCharacters = async (uid: string, region: string, page = 1) => {

    let url = CHARACTERS_URL;
    let params = `?uid=${uid}&region=${region}`
    let fp = await getFp();
    const [err, res] = await to(axios.get(url + params, {
        headers: {
            ...headers,
            "x-rpc-device_fp": fp
        },
        timeout: 10000,
    }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<CharacterData>;
                return characterList;
            }
        }
    }
    alert("请确认已登录活动页面且绑定账户!")
    throw err ? err : new Error("角色列表获取失败");
};

const getCharacterDetail = async (ids: number[], uid: string, region: string) => {
    const params = `?uid=${uid}&region=${region}`
    let URL = CHARACTERS_DETAIL_URL;
    let fp = await getFp();
    let avatarList = ids.map(id => ({
        avatar_id: id,
        is_teaser: false,
        teaser_need_weapon: false,
        teaser_sp_skill: false
    }))
    const [err, res] = await to(axios.post(URL + params, {
            avatar_list: avatarList,
        },
        {
            headers: {
                ...headers,
                "x-rpc-device_fp": fp
            },
            timeout: 10000,
        }));
    if (!err) {
        const {status, data: resData} = await res;
        if (status == 200) {
            const {retcode, data} = resData;
            if (retcode === 0) {
                const {list: characterList} = await data as Data<CharacterData>;
                return characterList;
            }
        }
    } else {
        console.error(err)
    }
    return [] as CharacterData[]
};

export const getDetailList = async (game_uid: string, region: string) => {

    let maxPageSize = 1;//Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());

    const characters: Avatar[] = [];
    for await (let i of idxs) {
        let characterData = await getCharacters(game_uid, region, i + 1);
        characters.push.apply(characters, characterData.filter(a => a.unlocked).map(a => a.avatar))
    }

    let ids = characters.map(a => a.id);

    // 将ids分成10个一组进行请求
    const batchSize = 10;
    const allResults: CharacterData[] = [];

    for (let i = 0; i < ids.length; i += batchSize) {
        const batchIds = ids.slice(i, i + batchSize);
        const batchResults = await getCharacterDetail(batchIds, game_uid, region);
        allResults.push(...batchResults);
    }

    return allResults;
    // const detailList = [];
    // for await (let d of details) {
    //     if (!!d) {
    //         detailList.push(d);
    //     }
    // }
    // return detailList;
}


