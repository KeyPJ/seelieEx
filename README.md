<!--
 * @Date: 2021-07-10 11:00:00
 * @LastEditors: KeyPJ
 * @Author: KeyPJ
 * @LastEditTime: 2021-08-07 01:35:21
-->

# 前言
本脚本基于 [tampermonkey-webpack-template](https://github.com/lisonge/tampermonkey-webpack-template) 开发

# 简介
个人想偷懒,不想手动在[仙灵 - 原神规划助手](https://seelie.inmagi.com/) 手动录入角色及其天赋  
于是简单整理一个脚本,利用米游社计算器api获取角色信息,直接导入至seelie

相关api详见[mihoyo.http](mihoyo.http)

# 使用说明
本脚本使用GM_xmlhttpRequest跨域请求相关api,所以需要登录米游社论坛,且确定已通过米游社已绑定原神账户

该脚本安装完毕后,直接刷新页面,就会自动执行(人懒,懒得在页面加按钮写样式)

该脚本默认获取绑定第一个角色的相关信息,若需要同步其他角色信息,请通过修改localStorage来修改脚本里的参数

| 参数       | 说明 |    值范围  |
| ---------- | ---- | ---- |
| game_uid   |   游戏角色9位uid   | 默认:"" |
| region     |   区服| 官服:"cn_gf01",渠道(B服):"cn_qd01" |
| accountIdx |   账号索引| 默认0,当game_uid为空时,该值生效,获取第accountIdx+1个账户信息 |
 
如需修改game_uid及region  

在浏览器console执行
```
localStorage.setItem("mihoyoAccount", JSON.stringify({game_uid:'501725172', region:'cn_qd01', accountIdx:0}))
```

或者 需要修改 accountIdx(数组越界时获取最后一个角色信息  

在浏览器console执行
```
localStorage.setItem("mihoyoAccount", JSON.stringify({game_uid:'', region:'cn_gf01', accountIdx:1}))
```

其他的主要信息也会在console输出,请自行查看
