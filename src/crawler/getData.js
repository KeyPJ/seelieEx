const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer'); // 添加缺失的导入

// 优化getPageData函数，移除未使用的getIdName函数
async function getPageData(page, url, selector) {
    await page.goto(url, {
        waitUntil: 'domcontentloaded'
    });

    //等待加载完毕
    await page.waitForSelector('#main button');
    await page.click('#main button');

    // 第一尝试获取数据
    let list = await page.$$eval(selector, relativeList => {
        // 提取ID和名称的通用函数
        const extractData = (relative, useParent = false) => {
            const scr = useParent
                ? relative?.querySelector('.item-image').firstChild?.src
                : relative?.firstElementChild?.firstElementChild?.src;
            const match = scr?.match(/(\/([\w-]*)\.png)/);
            const id = match && match[2];
            const name = (useParent ? relative.parentElement.innerText : relative.innerText)
                .replace("NEW", "")
                .replace("SOON", "")
                .replace("Custom", "")
                .replace("CUSTOM", "")
                .replace("自定义", "")
                .replace("即将上线", "")
                .replaceAll("\n", "");

            if (!id || !name) return null;
            return {id, name};
        };

        // 尝试第一种方式
        let result = relativeList.map(relative => extractData(relative));

        // 如果第一种方式没有获取到数据，尝试第二种方式
        if (!result || result.filter(a => !!a).length === 0) {
            result = relativeList.map(relative => extractData(relative, true));
        }

        return result;
    });

    //排序
    return list.filter(a => !!a).sort((a, b) => a.name.localeCompare(b.name, 'zh'));
}

// 配置化数据抓取目标 - 修正键名为单数形式
const scrapeTargets = [
    { game: '', type: 'character', url: 'https://seelie.me/characters', selector: '.items-start>.relative' },
    { game: '', type: 'weapon', url: 'https://seelie.me/weapons', selector: '.items-start>.relative' },
    { game: 'hsr_', type: 'character', url: 'https://hsr.seelie.me/characters', selector: '.items-start>.relative' },
    { game: 'hsr_', type: 'weapon', url: 'https://hsr.seelie.me/weapons', selector: '.items-start>.relative' },
    { game: 'zzz_', type: 'character', url: 'https://zzz.seelie.me/characters', selector: '.item-container' },
    { game: 'zzz_', type: 'weapon', url: 'https://zzz.seelie.me/weapons', selector: '.item-container' }
];

const scrape = async () => {
    const browser = await puppeteer.launch({headless: true, devtools: false});
    const page = await browser.newPage();

    // 浏览器环境配置
    await page.evaluateOnNewDocument(() => {
        const newProto = navigator.__proto__;
        delete newProto.webdriver;
        navigator.__proto__ = newProto;

        Object.defineProperty(navigator, 'userAgent', {
            get: () => "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36",
        });

        Object.defineProperty(navigator, "language", {
            get: function () { return "zh-CN"; }
        });

        Object.defineProperty(navigator, "languages", {
            get: function () { return ["zh-CN", "zh"]; }
        });
    });

    // 批量抓取所有数据
    const results = {};
    for (const target of scrapeTargets) {
        const key = (target.game ? target.game : '') + target.type;
        results[key] = await getPageData(page, target.url, target.selector);
        console.log(results[key]);
    }

    await browser.close();
    return results;
};

// 通用的文件写入函数
function writeDataToFile(data, gamePrefix, type) {
    const filename = path.join(__dirname, `../data/${gamePrefix}${type}.json`);
    fs.writeFileSync(filename, JSON.stringify(data, "", "\t"));
}

scrape().then((results) => {
    // 使用循环写入所有文件，减少重复代码
    Object.keys(results).forEach(key => {
        const match = key.match(/^(hsr_|zzz_)?(character|weapon)$/);
        if (match) {
            const [, gamePrefix = '', type] = match;
            writeDataToFile(results[key], gamePrefix, type);
        }
    });
}).catch(err => console.error('抓取数据失败:', err));
