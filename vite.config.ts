import pkg from './package.json';
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import monkeyPlugin from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        monkeyPlugin({
            entry: 'src/index.tsx',
            userscript: {
                author: 'KeyPJ',
                name: {
                    '': pkg.name,
                    'zh': '原神规划助手扩展',
                },
                description: {
                    'zh': '个人想偷懒,不想手动在仙灵 - 原神规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie'
                },
                namespace: 'https://github.com/KeyPJ/seelieEx',
                version: pkg.version,
                include: ['https://seelie.inmagi.com/*', "https://seelie.me/*"],
                grant: ['unsafeWindow', 'GM_xmlhttpRequest', 'GM_openInTab', 'GM_getResourceText', "GM_registerMenuCommand"],
                extra: [
                    ['copyright', '2021, KeyPJ https://github.com/KeyPJ'],
                ],
                license: 'MIT',
                contributionURL: 'https://github.com/KeyPJ/seelieEx',
                connect: ['api-takumi.mihoyo.com', 'api-os-takumi.mihoyo.com', 'sg-public-api.mihoyo.com'],
                resource: {
                    character: "https://raw.fastgit.org/KeyPJ/seelieEx/main/src/data/character.json",
                    weapon: "https://raw.fastgit.org/KeyPJ/seelieEx/main/src/data/weapon.json"
                },
                "run-at": "document-end",
                homepage: "https://github.com/KeyPJ",
                homepageURL: "https://github.com/KeyPJ/seelieEx",
                updateURL: "https://greasyfork.org/scripts/443664-genshinseelieex/code/genshinSeelieEx.user.js"
            },
            build: {
                fileName: "index.user.js",
                externalGlobals: {
                    react: [
                        'React',
                        (version) =>
                            `https://unpkg.zhimg.com/react@${version}/umd/react.production.min.js`,
                    ],
                    'react-dom': [
                        'ReactDOM',
                        (version) =>
                            `https://unpkg.zhimg.com/react-dom@${version}/umd/react-dom.production.min.js`,
                    ],
                    'react-draggable': [
                        'ReactDraggable',
                        (version) =>
                            `https://unpkg.zhimg.com/react-draggable@${version}/build/web/react-draggable.min.js`,
                    ],
                },
            },
        }),
    ],
})
