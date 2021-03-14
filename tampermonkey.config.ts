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
    author: 'author-x',
    name: ['Tampermonkey-hot', ['zh', '油猴脚本-热重载']],
    description: ['description', ['zh', '描述']],
    namespace: 'https://dev.songe.li/',
    icon: 'https://cdn.jsdelivr.net/gh/lisonge/src@main/svg/tampermonkey.svg',
    version: '1.0.2',
    include: [/https:\/\/dev\.songe\.li.*/, 'https://dev.songe.li/*'],
    grant: ['unsafeWindow', 'GM_setValue', 'GM_setValue', 'GM_xmlhttpRequest'],
    externals: [['tag', 'value']],
    require: ['https://cdn.jsdelivr.net/npm/core-js-bundle@3.9.1/index.js'],
  },
  devServer: {
    proxyUserJsFileName: 'dev-server-proxy.user.js',
  },
} as Options;
