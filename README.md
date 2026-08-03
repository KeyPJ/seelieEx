# SeelieEx — 仙灵规划助手扩展

[![GreasyFork](https://img.shields.io/badge/GreasyFork-443664-blue?logo=tampermonkey)](https://greasyfork.org/scripts/443664-genshinseelieex)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Version](https://img.shields.io/badge/version-6.7.0.260803-blue)](https://github.com/KeyPJ/seelieEx)

> 一个 Tampermonkey 油猴脚本，自动将米游社养成数据导入 [Seelie.me](https://seelie.me) 规划工具，支持 **原神 (GI)**、**崩坏：星穹铁道 (HSR)** 和 **绝区零 (ZZZ)**。

## 功能

- **一键同步**：点击「同步」按钮，自动从米游社 API 拉取角色、武器、天赋等级和命座 / 影画信息，写入 seelie 规划目标
- **三端支持**：原神、崩坏：星穹铁道、绝区零，自动识别当前 seelie 子站点
- **素材/库存同步**：同步米游社养成计算器的素材持有量，写入 seelie 库存
- **HSR 批量修改**：支持批量设置角色目标技能等级，并额外支持**忆灵技 / 忆灵天赋（max 6）**、**欢愉技（max 10）**——三者默认勾选，按角色命途（`path`）判定是否适用（仅 `remembrance` / `elation` 命途生效，非对应命途角色不受影响）
- **未登录自动跳转**：米游社接口返回 `-100` 未登录时，弹窗提示并自动打开对应游戏的计算器页面（每次同步仅提示一次）
- **拥有判定**：仅同步已拥有角色（`first_meet_time !== 0` / `unlocked` / 已拥有列表），但素材全量计算包含未拥有角色（按满级折算素材）
- **请求可观测**：同步时统计并发起的 HTTP 请求数并打印 console；请求异常时 `console.error` 出 URL + body（`-100` 不打印，避免与跳转弹窗重复刷屏）
- **运行时数据**：不再依赖打包的 JSON 映射文件，改为从页面运行时目录 (`#app._vnode.component.data`) 实时反查 seelie 数据键
- **进度反馈**：同步过程中显示进度条和文字提示，避免卡死感

## 安装

### 前置条件

1. 浏览器安装 [Tampermonkey](https://www.tampermonkey.net/) 扩展
2. 登录 [米游社](https://bbs.mihoyo.com/) 并绑定游戏账户

### 安装脚本

- **GreasyFork**（推荐）：访问 [GreasyFork 页面](https://greasyfork.org/scripts/443664-genshinseelieex) 安装
- **GitHub Release**：从 [Releases](https://github.com/KeyPJ/seelieEx/releases) 下载 `index.user.js`，拖入 Tampermonkey 管理面板

### 使用

1. 打开任意 seelie 站点：
   - 原神：https://seelie.me
   - 星穹铁道：https://hsr.seelie.me
   - 绝区零：https://zzz.seelie.me
2. 在 Tampermonkey 菜单中点击「打开 SeelieEx」
3. 选择游戏账户，点击「同步」按钮
4. 等待进度条走完，页面自动刷新

## 构建

项目使用 **Vite + React 17 + TypeScript 4 + Tailwind CSS 3**，构建产出为 Tampermonkey 用户脚本。

```bash
# 安装依赖
pnpm install

# 开发构建
pnpm run dev

# 生产构建（生成 dist/index.user.js）
pnpm run build
```

构建产物 `dist/index.user.js` 可直接拖入 Tampermonkey 安装。

> 产物约 **87 KB**（gzip 后约 **29 KB**）。React / ReactDOM / localforage 三大依赖通过 `@require` 从 unpkg CDN 外部引入，**不计入**产物体积；业务代码 + axios 内联于单文件脚本。

## 项目结构

```
src/
├── @type/                    # 类型定义
│   ├── mihoyo.d.ts           # 米游社 API 响应类型
│   ├── seelie.d.ts           # seelie 数据模型
│   └── tampermonkey-module.d.ts
├── adapters/                 # 三端适配器（GI / HSR / ZZZ）
│   ├── baseAdapter.ts        # 抽象基类
│   ├── common.ts             # 公共工具（获取账户等）
│   ├── game.ts               # 适配器接口定义
│   ├── inventory-common.ts   # 库存同步公共逻辑
│   ├── items.ts              # 物品 ID 映射
│   ├── adapterManager.ts     # 适配器管理器
│   ├── genshin/              # 原神
│   │   ├── genshinAdapter.ts # 适配器
│   │   ├── hoyo.ts           # 米游社 API 封装
│   │   ├── query.ts          # 运行时目录反查
│   │   └── seelie.ts         # seelie 数据写入
│   ├── hsr/                  # 崩坏：星穹铁道
│   │   └── ...（同上结构）
│   └── zzz/                  # 绝区零
│       └── ...（同上结构）
├── components/               # React UI 组件
│   ├── SeelieExDialog.tsx    # 主对话框（含进度条）
│   ├── select/ListboxSelect.tsx
│   ├── switch/ToggleSwitch.tsx
│   └── tabs/                 # 角色/天赋目标标签页
├── index.tsx                 # 入口
├── App.tsx / App.css         # 根组件
└── vite-env.d.ts
```

每款游戏由三层组成：
- **Adapter 层**：继承 `BaseAdapter`，串联整个同步流程
- **Hoyo 层**：封装米游社 API 请求（角色列表、详情、素材计算）
- **Seelie 层**：将数据写入 seelie 的 `localStorage` 目标

公共逻辑（`inventory-common.ts`）已抽取三端复用：
- `buildBaseHeaders(fp, deviceId)`：统一三端 calc 请求头底座
- `postCalcAndMerge(...)`：统一「POST 计算 → 判错 → 未登录处理 → 合并素材」
- `getFpDeviceId()` / `mergeMaterialsMax()` / `writeMergedToSeelieInventory()`：设备标识、素材去重合并、库存回写

## 同步流程

```
用户点击「同步」
    │
    ├─ 1. 获取角色详情（getCharacterDetails）
    │   ├─ 拉取角色列表
    │   └─ 逐角色拉取 detail（含技能、命座、装备）
    │
    ├─ 2. 写入角色目标（syncCharacters）
    │   ├─ 角色等级/突破
    │   ├─ 武器等级/突破
    │   ├─ 天赋/行迹等级
    │   └─ 命座/影画
    │
    └─ 3. 素材/库存同步（batchUpdateInventory）
        ├─ 批量计算养成素材（含未拥有角色，按满级折算素材）
        └─ 写入 seelie 库存
```

## 技术栈

- **构建工具**：Vite 4 + [vite-plugin-monkey](https://github.com/lisonge/vite-plugin-monkey)
- **前端框架**：React 17 + TypeScript 4 (strict mode)
- **样式**：Tailwind CSS 3
- **运行时**：Tampermonkey API（GM_xmlhttpRequest、unsafeWindow 等）
- **API**：米游社养成计算器 API

## 贡献

欢迎提交 Issue 或 PR！请确保：

1. 代码通过 `pnpm run build`（TypeScript 类型检查 + Vite 构建）
2. 如果修改了运行时目录反查逻辑，请在真实 seelie 页面测试
3. 保持三层适配器结构一致（GI / HSR / ZZZ）

## 许可

[MIT](LICENSE)

## 相关链接

- [Seelie.me - 仙灵规划助手](https://seelie.me)
- [米游社](https://bbs.mihoyo.com/)
- [GreasyFork 页面](https://greasyfork.org/scripts/443664-genshinseelieex)
