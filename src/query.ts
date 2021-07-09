// const genshindb = require('genshin-db');
// import {Character} from "./@type/genshin-db";
//
// genshindb.setOptions({
//     matchAliases: true, // Allows the matching of aliases.
//     matchCategories: false, // Allows the matching of categories. If true, then returns an array if it matches.
//     verboseCategories: false, // Used if a category is matched. If true, then replaces each string name in the array with the data object instead.
//     queryLanguages: ["ChineseSimplified"], // Array of languages that your query will be searched in.
//     resultLanguage: "English" // Output language that you want your results to be in.
// })
//
// export function getCharacterName(nameCHS: string) {
//     if (nameCHS=="旅行者"){
//         return "traveler"
//     }
//     const character: Character = genshindb.characters(nameCHS);
//     if (!character){
//         console.error(nameCHS)
//         return ""
//     }
//     const {name} = character;
//     return name.toLowerCase();
// }

const nameList=[
    {
        "nameEn": "traveler",
        "name": "旅行者"
    },
    {
        "nameEn": "albedo",
        "name": "阿贝多"
    },
    {
        "nameEn": "amber",
        "name": "安柏"
    },
    {
        "nameEn": "barbara",
        "name": "芭芭拉"
    },
    {
        "nameEn": "beidou",
        "name": "北斗"
    },
    {
        "nameEn": "bennett",
        "name": "班尼特"
    },
    {
        "nameEn": "chongyun",
        "name": "重云"
    },
    {
        "nameEn": "diluc",
        "name": "迪卢克"
    },
    {
        "nameEn": "diona",
        "name": "迪奥娜"
    },
    {
        "nameEn": "eula",
        "name": "优菈"
    },
    {
        "nameEn": "fischl",
        "name": "菲谢尔"
    },
    {
        "nameEn": "ganyu",
        "name": "甘雨"
    },
    {
        "nameEn": "hutao",
        "name": "胡桃"
    },
    {
        "nameEn": "jean",
        "name": "琴"
    },
    {
        "nameEn": "kaedeharakazuha",
        "name": "枫原万叶"
    },
    {
        "nameEn": "kaeya",
        "name": "凯亚"
    },
    {
        "nameEn": "keqing",
        "name": "刻晴"
    },
    {
        "nameEn": "klee",
        "name": "可莉"
    },
    {
        "nameEn": "lisa",
        "name": "丽莎"
    },
    {
        "nameEn": "lumine",
        "name": "荧"
    },
    {
        "nameEn": "mona",
        "name": "莫娜"
    },
    {
        "nameEn": "ningguang",
        "name": "凝光"
    },
    {
        "nameEn": "noelle",
        "name": "诺艾尔"
    },
    {
        "nameEn": "qiqi",
        "name": "七七"
    },
    {
        "nameEn": "razor",
        "name": "雷泽"
    },
    {
        "nameEn": "rosaria",
        "name": "罗莎莉亚"
    },
    {
        "nameEn": "sucrose",
        "name": "砂糖"
    },
    {
        "nameEn": "tartaglia",
        "name": "达达利亚"
    },
    {
        "nameEn": "venti",
        "name": "温迪"
    },
    {
        "nameEn": "xiangling",
        "name": "香菱"
    },
    {
        "nameEn": "xiao",
        "name": "魈"
    },
    {
        "nameEn": "xingqiu",
        "name": "行秋"
    },
    {
        "nameEn": "xinyan",
        "name": "辛焱"
    },
    {
        "nameEn": "yanfei",
        "name": "烟绯"
    },
    {
        "nameEn": "zhongli",
        "name": "钟离"
    }]

export function getCharacterName(queryName: string) {

    for (let e of nameList) {
        const {name, nameEn} = e
        if (queryName == name) {
            return nameEn;
        }
    }
    console.error(`${queryName}查询失败`)
    return ""
}

export function getCharacterNameCN(queryName: string) {

    for (let e of nameList) {
        const {name, nameEn} = e
        if (queryName == nameEn) {
            return name;
        }
    }
    console.error(`${queryName}查询失败`)
    return ""
}
