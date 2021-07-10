const nameList = [
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

const elementAttrIds = [
    {element_attr_id: 1, name: "pyro"},
    {element_attr_id: 2, name: "anemo"},
    {element_attr_id: 3, name: "geo"},
    {element_attr_id: 4, name: "electro"},
    {element_attr_id: 5, name: "hydro"},
    {element_attr_id: 6, name: "cryo"},
    {element_attr_id: 7, name: "dendro"},
]

export const getCharacterName = (queryName: string) => {

    for (let e of nameList) {
        const {name, nameEn} = e
        if (queryName == name) {
            return nameEn;
        }
    }
    console.error(`getCharacterName ${queryName} 查询失败`)
    return ""
};

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
