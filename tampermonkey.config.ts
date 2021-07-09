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
    description: ['description', ['zh', '描述']],
    namespace: 'https://github.com/KeyPJ',
    icon: 'https://www.google.com/s2/favicons?domain=inmagi.com',
    version: '1.0.2',
    include: ['https://seelie.inmagi.com/*'],
    grant: ['unsafeWindow', 'GM_setValue', 'GM_download', 'GM_xmlhttpRequest','GM_openInTab'],
    externals: [['tag', 'value']],
    require: ['https://cdn.jsdelivr.net/npm/core-js-bundle@3.9.1/index.js'],
  },
  devServer: {
    proxyUserJsFileName: 'dev-server-proxy.user.js',
  },
} as Options;
