interface queryName {
    id: string,
    name: string
}

const characters = JSON.parse(GM_getResourceText("character")) as queryName[];
const weapons = JSON.parse(GM_getResourceText("weapon")) as queryName[];

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

const elementAttrIds = [
    {element_attr_id: 1, name: "pyro"},
    {element_attr_id: 2, name: "anemo"},
    {element_attr_id: 3, name: "geo"},
    {element_attr_id: 4, name: "electro"},
    {element_attr_id: 5, name: "hydro"},
    {element_attr_id: 6, name: "cryo"},
    {element_attr_id: 7, name: "dendro"},
]


export const getElementAttrName = (queryName: number) => {

    for (let e of elementAttrIds) {
        const {element_attr_id, name} = e
        if (queryName == element_attr_id) {
            return name;
        }
    }
    console.error(`getElementAttrName: ${queryName} 查询失败`)
    return ""
};
