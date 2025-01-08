<!--
 * @Date: 2021-07-10 11:00:00
 * @LastEditors: KeyPJ
 * @Author: KeyPJ
 * @LastEditTime: 2022-04-18 12:00:00
-->

# 前言
~~本脚本基于 [tampermonkey-webpack-template](https://github.com/lisonge/tampermonkey-webpack-template) 开发~~

# 简介
个人想偷懒,不想手动在[仙灵 - 原神规划助手](https://seelie.me/) 手动录入角色及其天赋  
于是简单整理一个脚本,利用米游社计算器api获取角色信息,直接导入至seelie

相关api详见[mihoyo.http](mihoyo.http)

# 使用说明
本脚本使用GM_xmlhttpRequest跨域请求相关api,所以需要登录米游社活动页面, 例如:

国服:周年纪念页[铭记之旅](https://webstatic.mihoyo.com/ys/event/e20210928review/index.html), 且确定已通过米游社已绑定原神账户

~~国际服:周年纪念页[铭记之旅](https://webstatic-sea.mihoyo.com/ys/event/e20210928review/index.html), 且确定已通过hoyolab已绑定原神账户~~(seelie官方支持)

其他的主要信息也会在console输出,请自行查看
