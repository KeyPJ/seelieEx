const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function getPageData(page, url, selector) {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    })

    //等待加载完毕
    await page.waitForSelector('#main button')

    await page.click('#main button')

    const list = await page.$$eval(selector, relativeList => relativeList.map(relative => {
        const scr = relative?.firstElementChild?.firstElementChild?.src
        const match = scr?.match(/(\/([\w-]*)\.png)/)
        const id = match && match[2]
        const name = relative.innerText
            .replace("NEW", "")
            .replace("SOON", "")
            .replace("Custom", "")
            .replace("自定义", "")
            .replace("即将上线", "")
            .replaceAll("\n", "")
        if (!id || !name) {
            return null
        }
        return {id, name}
    }))

    //排序
    return list.filter(a => !!a).sort((a, b) => a.name.localeCompare(b.name, 'zh'))
}

const scrape = async () => {
    const browser = await puppeteer.launch({headless: true, devtools: false})
    const page = await browser.newPage()
    await page.evaluateOnNewDocument(() => { //在每个新页面打开前执行以下脚本
        const newProto = navigator.__proto__
        delete newProto.webdriver  //删除navigator.webdriver字段
        navigator.__proto__ = newProto
        Object.defineProperty(navigator, 'userAgent', {  //userAgent在无头模式下有headless字样，所以需覆写
            get: () => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36",
        })
        //浏览器设置中文
        Object.defineProperty(navigator, "language", {
            get: function () {
                return "zh-CN"
            }
        })
        Object.defineProperty(navigator, "languages", {
            get: function () {
                return ["zh-CN", "zh"]
            }
        })
    })
    const charactersUrl = 'https://seelie.me/characters'
    const selector = '.items-start>.relative'
    const characters = await getPageData(page, charactersUrl, selector)
    console.log(characters)

    const weaponsUrl = 'https://seelie.me/weapons'
    const weapons = await getPageData(page, weaponsUrl, selector)
    console.log(weapons)


    const hsr_charactersUrl = 'https://hsr.seelie.me/characters'
    const hsr_characters = await getPageData(page, hsr_charactersUrl, selector)
    console.log(hsr_characters)

    const hsr_weaponsUrl = 'https://hsr.seelie.me/weapons'
    const hsr_weapons = await getPageData(page, hsr_weaponsUrl, selector)
    console.log(hsr_weapons)

    await browser.close()
    return {characters, weapons, hsr_characters, hsr_weapons}
}

scrape().then((value) => {
    const {characters, weapons} = value
    fs.writeFileSync(path.join(__dirname, '../data/character.json'), JSON.stringify(characters, "", "\t"))
    fs.writeFileSync(path.join(__dirname, '../data/weapon.json'), JSON.stringify(weapons, "", "\t"))

    const {hsr_characters, hsr_weapons} = value
    fs.writeFileSync(path.join(__dirname, '../data/hsr_character.json'), JSON.stringify(hsr_characters, "", "\t"))
    fs.writeFileSync(path.join(__dirname, '../data/hsr_weapon.json'), JSON.stringify(hsr_weapons, "", "\t"))


}).catch(// err => console.error(err)
)
