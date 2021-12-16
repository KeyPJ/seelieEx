<!--
 * @Date: 2021-07-10 11:00:00
 * @LastEditors: KeyPJ
 * @Author: KeyPJ
 * @LastEditTime: 2021-12-17 02:12:21
-->

# 前言
本脚本基于 [tampermonkey-webpack-template](https://github.com/lisonge/tampermonkey-webpack-template) 开发

# 简介
个人想偷懒,不想手动在[仙灵 - 原神规划助手](https://seelie.me/) 手动录入角色及其天赋  
于是简单整理一个脚本,利用米游社计算器api获取角色信息,直接导入至seelie

相关api详见[mihoyo.http](mihoyo.http)

# 使用说明
本脚本使用GM_xmlhttpRequest跨域请求相关api,所以需要登录米游社活动页面,例如[史莱姆乐园](https://webstatic.mihoyo.com/ys/event/e20210122-slime/index.html), 且确定已通过米游社已绑定原神账户

其他的主要信息也会在console输出,请自行查看
