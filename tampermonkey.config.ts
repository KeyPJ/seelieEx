/*
 * @Date: 2021-03-14 14:16:30
 * @LastEditors: lisonge
 * @Author: lisonge
 * @LastEditTime: 2021-03-14 16:27:07
 */
import { Options } from 'tampermonkey-webpack-plugin';

export default {
  minAlignSpace: 4,
  header: {
    author: 'KeyPJ',
    name: ['genshinSeelieEx', ['zh', '原神规划助手扩展']],
    description: ['description', ['zh', '个人想偷懒,不想手动在仙灵 - 原神规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie']],
    namespace: 'https://github.com/KeyPJ/seelieEx',
    icon: 'https://seelie.inmagi.com/img/icons/favicon-32x32.png',
    version: '1.0.3',
    include: ['https://seelie.inmagi.com/*'],
    grant: ['unsafeWindow', 'GM_setValue', 'GM_download', 'GM_xmlhttpRequest','GM_openInTab','GM_getResourceText'],
    externals: [
        ['copyright', '2021, KeyPJ https://github.com/KeyPJ'],
        ['license', 'MIT'],
        ['contributionURL', 'https://github.com/KeyPJ/seelieEx'],
    ],
    require: ['https://cdn.jsdelivr.net/npm/core-js-bundle@3.9.1/index.js'],
    connect: 'api-takumi.mihoyo.com',
    resource: [
        {name:"character",url:"https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx/src/data/character.json"},
        {name:"weapon",url:"https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx/src/data/weapon.json"},
    ],
    "run-at": "document-end",
    homepage:"https://github.com/KeyPJ",
    homepageURL:"https://github.com/KeyPJ/seelieEx",
  },
  devServer: {
    proxyUserJsFileName: 'dev-server-proxy.user.js',
  },
} as Options;
