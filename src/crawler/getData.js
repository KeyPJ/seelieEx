const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

async function getPageData(page, url, selector) {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    })

    //等待加载完毕
    await page.waitForSelector("button.w-full")

    await page.click('#main button')

    const list = await page.$$eval(selector, relativeList => relativeList.map(
        relative => {
            const scr = relative.firstElementChild.firstElementChild.src
            const match = scr.match(/(\/([\w-]*)\.png)/)
            const id = match&&match[2]
            const name = relative.innerText.replace("NEW", "").replace("SOON", "").replace("即将上线", "").replaceAll("\n", "")
            return {id, name}
        }
    ))

    //排序
    return list.sort((a, b) => a.name.localeCompare(b.name, 'zh'))
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
            get: function() {
                return "zh-CN";
            }
        });
        Object.defineProperty(navigator, "languages", {
            get: function() {
                return ["zh-CN", "zh"];
            }
        });
    })
    const charactersUrl = 'https://seelie.inmagi.com/characters'
    const selector = '.items-start>.relative'
    const characters = await getPageData(page, charactersUrl, selector)
    console.log(characters)

    const weaponsUrl = 'https://seelie.inmagi.com/weapons'
    const weapons = await getPageData(page, weaponsUrl, selector)
    console.log(weapons)

    await browser.close()
    return {characters, weapons}
}

scrape().then((value) => {
    const {characters, weapons} = value
    const characterFilePath = path.join(__dirname, '../data/character.json')
    fs.writeFileSync(characterFilePath, JSON.stringify(characters,"","\t"))

    const weaponFilePath = path.join(__dirname, '../data/weapon.json')
    fs.writeFileSync(weaponFilePath, JSON.stringify(weapons,"","\t"))
}).catch(
    // err => console.error(err)
)
