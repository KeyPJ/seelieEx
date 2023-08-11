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
                    'zh': '星铁规划助手扩展',
                },
                description: {
                    'zh': '个人想偷懒,不想手动在仙灵 - 星铁规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie'
                },
                namespace: 'https://github.com/KeyPJ/seelieEx',
                version: pkg.version,
                include: ["https://hsr.seelie.me/*"],
                grant: ['unsafeWindow', 'GM_xmlhttpRequest', 'GM_openInTab', 'GM_getResourceText', "GM_registerMenuCommand"],
                $extra: [
                    ['copyright', '2023, KeyPJ https://github.com/KeyPJ'],
                ],
                license: 'MIT',
                contributionURL: 'https://github.com/KeyPJ/seelieEx',
                connect: ['api-takumi.mihoyo.com', 'api-os-takumi.hoyoverse.com', 'sg-public-api.hoyoverse.com'],
                resource: {
                    character: "https://ghproxy.com/https://raw.githubusercontent.com/KeyPJ/seelieEx/main/src/data/hsr_character.json",
                    weapon: "https://ghproxy.com/https://raw.githubusercontent.com/KeyPJ/seelieEx/main/src/data/hsr_weapon.json"
                },
                "run-at": "document-end",
                homepage: "https://github.com/KeyPJ",
                homepageURL: "https://github.com/KeyPJ/seelieEx",
                updateURL: "https://openuserjs.org/meta/KeyPJ/hsrSeelieEx.meta.js"
            },
            build: {
                fileName: "index.user.js",
                externalGlobals: {
                    react: [
                        'React',
                        (version) =>
                            `https://unpkg.com/react@${version}/umd/react.production.min.js`,
                    ],
                    'react-dom': [
                        'ReactDOM',
                        (version) =>
                            `https://unpkg.com/react-dom@${version}/umd/react-dom.production.min.js`,
                    ],
                },
            },
        }),
    ],
})
