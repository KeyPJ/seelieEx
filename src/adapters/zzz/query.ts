interface queryName {
    id: string,
    name: string
}

const characters = JSON.parse(GM_getResourceText("zzz_character")) as queryName[];
const weapons = JSON.parse(GM_getResourceText("zzz_weapon")) as queryName[];

export const charactersNum = characters.length;

export const getCharacterId = (queryName: string) => {
    for (let e of characters) {
        const {id, name} = e
        if (queryName == name) {
            return id;
        }
    }
    console.error(`getCharacterId ${queryName} 查询失败`)
    return ""
};

export const getWeaponId = (queryName: string) => {
    for (let e of weapons) {
        const {id, name} = e
        if (queryName == name) {
            return id;
        }
    }
    console.error(`getWeaponrId ${queryName} 查询失败`)
    return ""
};
