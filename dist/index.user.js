// ==UserScript==
// @name             genshinSeelieEx
// @name:zh          原神规划助手扩展
// @namespace        https://github.com/KeyPJ/seelieEx
// @version          3.1.0
// @author           KeyPJ
// @description:zh   个人想偷懒,不想手动在仙灵 - 原神规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie
// @license          MIT
// @homepage         https://github.com/KeyPJ
// @homepageURL      https://github.com/KeyPJ/seelieEx
// @updateURL        https://greasyfork.org/scripts/443664-genshinseelieex/code/genshinSeelieEx.user.js
// @include          https://seelie.inmagi.com/*
// @include          https://seelie.me/*
// @require          https://unpkg.zhimg.com/react@17.0.2/umd/react.production.min.js
// @require          https://unpkg.zhimg.com/react-dom@17.0.2/umd/react-dom.production.min.js
// @require          https://unpkg.zhimg.com/react-draggable@4.4.5/build/web/react-draggable.min.js
// @connect          api-takumi.mihoyo.com
// @connect          api-os-takumi.mihoyo.com
// @connect          sg-public-api.mihoyo.com
// @resource         character https://raw.fastgit.org/KeyPJ/seelieEx/main/src/data/character.json
// @resource         weapon https://raw.fastgit.org/KeyPJ/seelieEx/main/src/data/weapon.json
// @grant            unsafeWindow
// @grant            GM_xmlhttpRequest
// @grant            GM_openInTab
// @grant            GM_getResourceText
// @grant            GM.xmlHttpRequest
// @run-at           document-end
// @contributionURL  https://github.com/KeyPJ/seelieEx
// @copyright        2021, KeyPJ https://github.com/KeyPJ
// ==/UserScript==

// use vite-plugin-monkey@0.2.14 at 2022-10-15T03:45:16.856Z

;(({ cssTextList = [] }) => {
  cssTextList.forEach((s) => {
    const style = document.createElement("style");
    style.innerText = s;
    style.dataset.source = "vite-plugin-monkey";
    document.head.appendChild(style);
  });
})({
  "cssTextList": [
    "/*\n! tailwindcss v3.1.8 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.pointer-events-none {\n  pointer-events: none;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.inset-0 {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.inset-x-\\[20\\%\\] {\n  left: 20%;\n  right: 20%;\n}\n.inset-y-0 {\n  top: 0px;\n  bottom: 0px;\n}\n.top-10 {\n  top: 2.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.left-0 {\n  left: 0px;\n}\n.z-\\[1201\\] {\n  z-index: 1201;\n}\n.z-\\[1200\\] {\n  z-index: 1200;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-10 {\n  margin-top: 2.5rem;\n}\n.block {\n  display: block;\n}\n.inline-block {\n  display: inline-block;\n}\n.flex {\n  display: flex;\n}\n.inline-flex {\n  display: inline-flex;\n}\n.table {\n  display: table;\n}\n.grid {\n  display: grid;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-6 {\n  height: 1.5rem;\n}\n.h-4 {\n  height: 1rem;\n}\n.max-h-max {\n  max-height: -moz-max-content;\n  max-height: max-content;\n}\n.max-h-60 {\n  max-height: 15rem;\n}\n.min-h-min {\n  min-height: -moz-min-content;\n  min-height: min-content;\n}\n.w-full {\n  width: 100%;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-1\\/2 {\n  width: 50%;\n}\n.w-1\\/4 {\n  width: 25%;\n}\n.w-11 {\n  width: 2.75rem;\n}\n.w-4 {\n  width: 1rem;\n}\n.min-w-\\[50\\%\\] {\n  min-width: 50%;\n}\n.max-w-max {\n  max-width: -moz-max-content;\n  max-width: max-content;\n}\n.max-w-md {\n  max-width: 28rem;\n}\n.translate-x-6 {\n  --tw-translate-x: 1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.translate-x-1 {\n  --tw-translate-x: 0.25rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.cursor-default {\n  cursor: default;\n}\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n          user-select: none;\n}\n.grid-flow-col {\n  grid-auto-flow: column;\n}\n.grid-rows-2 {\n  grid-template-rows: repeat(2, minmax(0, 1fr));\n}\n.flex-row {\n  flex-direction: row;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.overflow-auto {\n  overflow: auto;\n}\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-2xl {\n  border-radius: 1rem;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-xl {\n  border-radius: 0.75rem;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.bg-black {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n.bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity));\n}\n.bg-purple-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 232 255 / var(--tw-bg-opacity));\n}\n.bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity));\n}\n.bg-blue-900\\/20 {\n  background-color: rgb(30 58 138 / 0.2);\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-amber-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 243 199 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity));\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.bg-opacity-20 {\n  --tw-bg-opacity: 0.2;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pb-2 {\n  padding-bottom: 0.5rem;\n}\n.pt-2 {\n  padding-top: 0.5rem;\n}\n.pl-3 {\n  padding-left: 0.75rem;\n}\n.pr-10 {\n  padding-right: 2.5rem;\n}\n.pr-2 {\n  padding-right: 0.5rem;\n}\n.pl-10 {\n  padding-left: 2.5rem;\n}\n.pr-4 {\n  padding-right: 1rem;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-3xl {\n  font-size: 1.875rem;\n  line-height: 2.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-normal {\n  font-weight: 400;\n}\n.leading-5 {\n  line-height: 1.25rem;\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(168 85 247 / var(--tw-text-opacity));\n}\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity));\n}\n.text-blue-100 {\n  --tw-text-opacity: 1;\n  color: rgb(219 234 254 / var(--tw-text-opacity));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.text-amber-900 {\n  --tw-text-opacity: 1;\n  color: rgb(120 53 15 / var(--tw-text-opacity));\n}\n.text-amber-600 {\n  --tw-text-opacity: 1;\n  color: rgb(217 119 6 / var(--tw-text-opacity));\n}\n.underline {\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\n.opacity-75 {\n  opacity: 0.75;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.opacity-0 {\n  opacity: 0;\n}\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.ring-1 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.ring-black {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity));\n}\n.ring-opacity-60 {\n  --tw-ring-opacity: 0.6;\n}\n.ring-opacity-5 {\n  --tw-ring-opacity: 0.05;\n}\n.ring-offset-2 {\n  --tw-ring-offset-width: 2px;\n}\n.ring-offset-blue-400 {\n  --tw-ring-offset-color: #60a5fa;\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.transition {\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.duration-100 {\n  transition-duration: 100ms;\n}\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n.hover\\:bg-purple-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(233 213 255 / var(--tw-bg-opacity));\n}\n.hover\\:bg-white\\/\\[0\\.12\\]:hover {\n  background-color: rgb(255 255 255 / 0.12);\n}\n.hover\\:bg-opacity-30:hover {\n  --tw-bg-opacity: 0.3;\n}\n.hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:border-indigo-500:focus-visible {\n  --tw-border-opacity: 1;\n  border-color: rgb(99 102 241 / var(--tw-border-opacity));\n}\n.focus-visible\\:ring-2:focus-visible {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:ring:focus-visible {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:ring-white:focus-visible {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.focus-visible\\:ring-purple-500:focus-visible {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(168 85 247 / var(--tw-ring-opacity));\n}\n.focus-visible\\:ring-opacity-75:focus-visible {\n  --tw-ring-opacity: 0.75;\n}\n.focus-visible\\:ring-offset-2:focus-visible {\n  --tw-ring-offset-width: 2px;\n}\n.focus-visible\\:ring-offset-orange-300:focus-visible {\n  --tw-ring-offset-color: #fdba74;\n}\n@media (min-width: 640px) {\n\n  .sm\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n\n"
  ]
});

(function(React2, ReactDOM2, Draggable) {
  var _a, _b;
  "use strict";
  function _interopDefaultLegacy(e2) {
    return e2 && typeof e2 === "object" && "default" in e2 ? e2 : { "default": e2 };
  }
  function _interopNamespace(e2) {
    if (e2 && e2.__esModule)
      return e2;
    var n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e2) {
      Object.keys(e2).forEach(function(k2) {
        if (k2 !== "default") {
          var d2 = Object.getOwnPropertyDescriptor(e2, k2);
          Object.defineProperty(n2, k2, d2.get ? d2 : {
            enumerable: true,
            get: function() {
              return e2[k2];
            }
          });
        }
      });
    }
    n2["default"] = e2;
    return Object.freeze(n2);
  }
  var React__default = /* @__PURE__ */ _interopDefaultLegacy(React2);
  var React__namespace = /* @__PURE__ */ _interopNamespace(React2);
  var ReactDOM__default = /* @__PURE__ */ _interopDefaultLegacy(ReactDOM2);
  var Draggable__default = /* @__PURE__ */ _interopDefaultLegacy(Draggable);
  var App$1 = "";
  const characters = JSON.parse(GM_getResourceText("character"));
  const weapons = JSON.parse(GM_getResourceText("weapon"));
  const charactersNum = characters.length;
  const getCharacterId = (queryName) => {
    for (let e2 of characters) {
      const { id, name } = e2;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getCharacterId ${queryName} \u67E5\u8BE2\u5931\u8D25`);
    return "";
  };
  const getWeaponId = (queryName) => {
    for (let e2 of weapons) {
      const { id, name } = e2;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getWeaponrId ${queryName} \u67E5\u8BE2\u5931\u8D25`);
    return "";
  };
  const elementAttrIds = [
    { element_attr_id: 1, name: "pyro" },
    { element_attr_id: 2, name: "anemo" },
    { element_attr_id: 3, name: "geo" },
    { element_attr_id: 4, name: "electro" },
    { element_attr_id: 5, name: "hydro" },
    { element_attr_id: 6, name: "cryo" },
    { element_attr_id: 7, name: "dendro" }
  ];
  const getElementAttrName = (queryName) => {
    for (let e2 of elementAttrIds) {
      const { element_attr_id, name } = e2;
      if (queryName == element_attr_id) {
        return name;
      }
    }
    console.error(`getElementAttrName: ${queryName} \u67E5\u8BE2\u5931\u8D25`);
    return "";
  };
  const getAccount$1 = () => localStorage.account || "main";
  const getTotalGoal = () => JSON.parse(
    localStorage.getItem(`${getAccount$1()}-goals`) || "[]"
  );
  const getGoalInactive = () => Object.keys(JSON.parse(localStorage.getItem(`${getAccount$1()}-inactive`) || "{}"));
  const setGoals = (goals) => {
    localStorage.setItem(`${getAccount$1()}-goals`, JSON.stringify(goals));
    localStorage.setItem("last_update", new Date().toISOString());
  };
  const addGoal = (data2) => {
    var _a2, _b2;
    let index = -1;
    const goals = getTotalGoal();
    if (data2.character) {
      index = goals.findIndex(
        (g2) => g2.character === data2.character && g2.type === data2.type
      );
    } else if (data2.id) {
      index = goals.findIndex((g2) => g2.id === data2.id);
    }
    if (index >= 0) {
      goals[index] = { ...goals[index], ...data2 };
    } else {
      const lastId = (_b2 = (_a2 = goals == null ? void 0 : goals.map((g2) => g2.id)) == null ? void 0 : _a2.filter((id) => typeof id == "number")) == null ? void 0 : _b2.sort((a2, b2) => a2 < b2 ? 1 : -1)[0];
      data2.id = (lastId || 0) + 1;
      goals.push(data2);
      console.log(data2);
    }
    setGoals(goals);
  };
  const addTalentGoal = (talentCharacter, skill_list) => {
    const totalGoal = getTotalGoal();
    const ids = totalGoal.map((g2) => g2.id);
    const id = Math.max(...ids) + 1 || 1;
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "talent" && g2.character == talentCharacter);
    const [normalCurrent, skillCurrent, burstCurrent] = skill_list.filter((a2) => a2.max_level == 10).sort().map((a2) => a2.level_current);
    let talentGoal;
    if (talentIdx < 0) {
      talentGoal = {
        type: "talent",
        character: talentCharacter,
        c3: false,
        c5: false,
        normal: {
          current: normalCurrent,
          goal: normalCurrent
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent
        },
        burst: {
          current: burstCurrent,
          goal: burstCurrent
        },
        id
      };
    } else {
      const seelieGoal = totalGoal[talentIdx];
      const { normal, skill, burst } = seelieGoal;
      const { goal: normalGoal } = normal;
      const { goal: skillGoal } = skill;
      const { goal: burstGoal } = burst;
      talentGoal = {
        ...seelieGoal,
        normal: {
          current: normalCurrent,
          goal: normalCurrent > normalGoal ? normalCurrent : normalGoal
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
        },
        burst: {
          current: burstCurrent,
          goal: burstCurrent > burstGoal ? burstCurrent : burstGoal
        }
      };
    }
    addGoal(talentGoal);
  };
  const addCharacterGoal = (level_current, nameEn, name, type) => {
    let totalGoal = getTotalGoal();
    const ids = totalGoal.map((g2) => g2.id);
    const id = Math.max(...ids) + 1 || 1;
    let characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    let weaponPredicate = (g2) => g2.type == type && g2.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus = initCharacterStatus(level_current);
    let characterGoal;
    function initCharacterGoal() {
      return {
        type,
        character: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    function initWeaponGoal() {
      return {
        type,
        character: "",
        weapon: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    if (characterIdx < 0) {
      characterGoal = type == "character" ? initCharacterGoal() : initWeaponGoal();
    } else {
      const seelieGoal = type == "character" ? totalGoal[characterIdx] : totalGoal[characterIdx];
      const { goal, current } = seelieGoal;
      const { level: levelCurrent, asc: ascCurrent } = current;
      const { level: levelGoal, asc: ascGoal } = goal;
      const { level, asc } = characterStatus;
      characterGoal = {
        ...seelieGoal,
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      };
    }
    addGoal(characterGoal);
  };
  function addCharacter(characterDataEx) {
    const { character, skill_list, weapon } = characterDataEx;
    const { name, element_attr_id } = character;
    if (weapon) {
      const { name: name2, level_current: weaponLeveL } = weapon;
      const weaponId = getWeaponId(name2);
      if (weaponId) {
        addCharacterGoal(weaponLeveL, weaponId, name2, "weapon");
      }
    }
    const { level_current: characterLevel } = character;
    const characterId = getCharacterId(name);
    if (!characterId) {
      return;
    }
    addCharacterGoal(characterLevel, characterId, name, "character");
    let talentCharacter = characterId;
    if (characterId == "traveler") {
      const elementAttrName = getElementAttrName(element_attr_id);
      talentCharacter = `traveler_${elementAttrName}`;
    }
    addTalentGoal(talentCharacter, skill_list);
  }
  const characterStatusList = [
    { level: 1, asc: 0, text: "1" },
    { level: 20, asc: 0, text: "20" },
    { level: 20, asc: 1, text: "20 A" },
    { level: 40, asc: 1, text: "40" },
    { level: 40, asc: 2, text: "40 A" },
    { level: 50, asc: 2, text: "50" },
    { level: 50, asc: 3, text: "50 A" },
    { level: 60, asc: 3, text: "60" },
    { level: 60, asc: 4, text: "60 A" },
    { level: 70, asc: 4, text: "70" },
    { level: 70, asc: 5, text: "70 A" },
    { level: 80, asc: 5, text: "80" },
    { level: 80, asc: 6, text: "80 A" },
    { level: 90, asc: 6, text: "90" }
  ];
  const initCharacterStatus = (level_current) => {
    let initCharacterStatus2 = characterStatusList[0];
    if (level_current < 20) {
      return initCharacterStatus2;
    }
    for (let characterStatus of characterStatusList) {
      const { level } = characterStatus;
      if (level_current < level) {
        return initCharacterStatus2;
      } else if (level_current == level) {
        return characterStatus;
      } else if (level_current > level) {
        initCharacterStatus2 = characterStatus;
      }
    }
    return initCharacterStatus2;
  };
  const updateTalent = (talent, normalGoal = 9, skillGoal = 9, burstGoal = 9) => {
    const { normal: { current: normalCurrent }, skill: { current: skillCurrent }, burst: { current: burstCurrent } } = talent;
    const talentNew = {
      ...talent,
      normal: {
        current: normalCurrent,
        goal: normalCurrent > normalGoal ? normalCurrent : normalGoal
      },
      skill: {
        current: skillCurrent,
        goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
      },
      burst: {
        current: burstCurrent,
        goal: burstCurrent > burstGoal ? burstCurrent : burstGoal
      }
    };
    addGoal(talentNew);
  };
  const batchUpdateTalent = (all, normal, skill, burst) => {
    getTotalGoal().filter((a2) => a2.type == "talent").filter((a2) => all || !getGoalInactive().includes(a2.character)).map((a2) => updateTalent(a2, normal, skill, burst));
  };
  const updateCharacter = (character, characterStatusGoal) => {
    const { current } = character;
    const { level: levelCurrent, asc: ascCurrent } = current;
    const { level, asc } = characterStatusGoal;
    const characterGoalNew = {
      ...character,
      goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current
    };
    addGoal(characterGoalNew);
  };
  const batchUpdateCharacter = (all, characterStatusGoal) => {
    getTotalGoal().filter((a2) => a2.type == "character").filter((a2) => all || !getGoalInactive().includes(a2.character)).map((a2) => updateCharacter(a2, characterStatusGoal));
    location.reload();
  };
  const batchUpdateWeapon = (all, characterStatusGoal) => {
    getTotalGoal().filter((a2) => a2.type == "weapon").filter((a2) => all || !getGoalInactive().includes(a2.weapon)).map((a2) => updateCharacter(a2, characterStatusGoal));
    location.reload();
  };
  const e$2 = typeof window == "undefined" || typeof document == "undefined";
  let s$5 = e$2 ? React2.useEffect : React2.useLayoutEffect;
  function s$4(e2) {
    let r2 = React2.useRef(e2);
    return s$5(() => {
      r2.current = e2;
    }, [e2]), r2;
  }
  function i$2(e2, o2) {
    let [u2, t2] = React2.useState(e2), r2 = s$4(e2);
    return s$5(() => t2(r2.current), [r2, t2, ...o2]), u2;
  }
  function t(e2) {
    typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o2) => setTimeout(() => {
      throw o2;
    }));
  }
  function m$3() {
    let n2 = [], i2 = [], r2 = { enqueue(e2) {
      i2.push(e2);
    }, addEventListener(e2, t2, a2, o2) {
      return e2.addEventListener(t2, a2, o2), r2.add(() => e2.removeEventListener(t2, a2, o2));
    }, requestAnimationFrame(...e2) {
      let t2 = requestAnimationFrame(...e2);
      return r2.add(() => cancelAnimationFrame(t2));
    }, nextFrame(...e2) {
      return r2.requestAnimationFrame(() => r2.requestAnimationFrame(...e2));
    }, setTimeout(...e2) {
      let t2 = setTimeout(...e2);
      return r2.add(() => clearTimeout(t2));
    }, microTask(...e2) {
      let t$1 = { current: true };
      return t(() => {
        t$1.current && e2[0]();
      }), r2.add(() => {
        t$1.current = false;
      });
    }, add(e2) {
      return n2.push(e2), () => {
        let t2 = n2.indexOf(e2);
        if (t2 >= 0) {
          let [a2] = n2.splice(t2, 1);
          a2();
        }
      };
    }, dispose() {
      for (let e2 of n2.splice(0))
        e2();
    }, async workQueue() {
      for (let e2 of i2.splice(0))
        await e2();
    } };
    return r2;
  }
  function p$6() {
    let [e2] = React2.useState(m$3);
    return React2.useEffect(() => () => e2.dispose(), [e2]), e2;
  }
  let o$2 = function(t2) {
    let e2 = s$4(t2);
    return React__default["default"].useCallback((...r2) => e2.current(...r2), [e2]);
  };
  let r$2 = { serverHandoffComplete: false };
  function a$2() {
    let [e2, f2] = React2.useState(r$2.serverHandoffComplete);
    return React2.useEffect(() => {
      e2 !== true && f2(true);
    }, [e2]), React2.useEffect(() => {
      r$2.serverHandoffComplete === false && (r$2.serverHandoffComplete = true);
    }, []), e2;
  }
  var u$4;
  let l$1 = 0;
  function r$1() {
    return ++l$1;
  }
  let I$2 = (u$4 = React__default["default"].useId) != null ? u$4 : function() {
    let n2 = a$2(), [e2, o2] = React__default["default"].useState(n2 ? r$1 : null);
    return s$5(() => {
      e2 === null && o2(r$1());
    }, [e2]), e2 != null ? "" + e2 : void 0;
  };
  function u$3(r2, n2, ...a2) {
    if (r2 in n2) {
      let e2 = n2[r2];
      return typeof e2 == "function" ? e2(...a2) : e2;
    }
    let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t2, u$3), t2;
  }
  function e$1(r2) {
    return e$2 ? null : r2 instanceof Node ? r2.ownerDocument : r2 != null && r2.hasOwnProperty("current") && r2.current instanceof Node ? r2.current.ownerDocument : document;
  }
  let m$2 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
  var T$3 = ((n2) => (n2[n2.First = 1] = "First", n2[n2.Previous = 2] = "Previous", n2[n2.Next = 4] = "Next", n2[n2.Last = 8] = "Last", n2[n2.WrapAround = 16] = "WrapAround", n2[n2.NoScroll = 32] = "NoScroll", n2))(T$3 || {}), M$2 = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(M$2 || {}), b = ((r2) => (r2[r2.Previous = -1] = "Previous", r2[r2.Next = 1] = "Next", r2))(b || {});
  function d$2(e2 = document.body) {
    return e2 == null ? [] : Array.from(e2.querySelectorAll(m$2));
  }
  var N = ((r2) => (r2[r2.Strict = 0] = "Strict", r2[r2.Loose = 1] = "Loose", r2))(N || {});
  function F$4(e2, t2 = 0) {
    var r2;
    return e2 === ((r2 = e$1(e2)) == null ? void 0 : r2.body) ? false : u$3(t2, { [0]() {
      return e2.matches(m$2);
    }, [1]() {
      let l2 = e2;
      for (; l2 !== null; ) {
        if (l2.matches(m$2))
          return true;
        l2 = l2.parentElement;
      }
      return false;
    } });
  }
  let w$2 = ["textarea", "input"].join(",");
  function H$1(e2) {
    var t2, r2;
    return (r2 = (t2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : t2.call(e2, w$2)) != null ? r2 : false;
  }
  function S$2(e2, t2 = (r2) => r2) {
    return e2.slice().sort((r2, l2) => {
      let o2 = t2(r2), s2 = t2(l2);
      if (o2 === null || s2 === null)
        return 0;
      let n2 = o2.compareDocumentPosition(s2);
      return n2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : n2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    });
  }
  function O(e2, t2, r2 = true, l2 = null) {
    let o2 = Array.isArray(e2) ? e2.length > 0 ? e2[0].ownerDocument : document : e2.ownerDocument, s2 = Array.isArray(e2) ? r2 ? S$2(e2) : e2 : d$2(e2);
    l2 = l2 != null ? l2 : o2.activeElement;
    let n2 = (() => {
      if (t2 & 5)
        return 1;
      if (t2 & 10)
        return -1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), E = (() => {
      if (t2 & 1)
        return 0;
      if (t2 & 2)
        return Math.max(0, s2.indexOf(l2)) - 1;
      if (t2 & 4)
        return Math.max(0, s2.indexOf(l2)) + 1;
      if (t2 & 8)
        return s2.length - 1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), x2 = t2 & 32 ? { preventScroll: true } : {}, f2 = 0, i2 = s2.length, u2;
    do {
      if (f2 >= i2 || f2 + i2 <= 0)
        return 0;
      let a2 = E + f2;
      if (t2 & 16)
        a2 = (a2 + i2) % i2;
      else {
        if (a2 < 0)
          return 3;
        if (a2 >= i2)
          return 1;
      }
      u2 = s2[a2], u2 == null || u2.focus(x2), f2 += n2;
    } while (u2 !== o2.activeElement);
    return t2 & 6 && H$1(u2) && u2.select(), u2.hasAttribute("tabindex") || u2.setAttribute("tabindex", "0"), 2;
  }
  function d$1(e2, r2, n2) {
    let o2 = s$4(r2);
    React2.useEffect(() => {
      function t2(u2) {
        o2.current(u2);
      }
      return document.addEventListener(e2, t2, n2), () => document.removeEventListener(e2, t2, n2);
    }, [e2, n2]);
  }
  function L(s2, E, a2 = true) {
    let i2 = React2.useRef(false);
    React2.useEffect(() => {
      requestAnimationFrame(() => {
        i2.current = a2;
      });
    }, [a2]);
    function f2(e2, l2) {
      if (!i2.current || e2.defaultPrevented)
        return;
      let o2 = function r2(t2) {
        return typeof t2 == "function" ? r2(t2()) : Array.isArray(t2) || t2 instanceof Set ? t2 : [t2];
      }(s2), n2 = l2(e2);
      if (n2 !== null && !!n2.ownerDocument.documentElement.contains(n2)) {
        for (let r2 of o2) {
          if (r2 === null)
            continue;
          let t2 = r2 instanceof HTMLElement ? r2 : r2.current;
          if (t2 != null && t2.contains(n2))
            return;
        }
        return !F$4(n2, N.Loose) && n2.tabIndex !== -1 && e2.preventDefault(), E(e2, n2);
      }
    }
    let u2 = React2.useRef(null);
    d$1("mousedown", (e2) => {
      var l2, o2;
      i2.current && (u2.current = ((o2 = (l2 = e2.composedPath) == null ? void 0 : l2.call(e2)) == null ? void 0 : o2[0]) || e2.target);
    }, true), d$1("click", (e2) => {
      !u2.current || (f2(e2, () => u2.current), u2.current = null);
    }, true), d$1("blur", (e2) => f2(e2, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
  }
  function i$1(t2) {
    var n2;
    if (t2.type)
      return t2.type;
    let e2 = (n2 = t2.as) != null ? n2 : "button";
    if (typeof e2 == "string" && e2.toLowerCase() === "button")
      return "button";
  }
  function s$3(t2, e2) {
    let [n2, u2] = React2.useState(() => i$1(t2));
    return s$5(() => {
      u2(i$1(t2));
    }, [t2.type, t2.as]), s$5(() => {
      n2 || !e2.current || e2.current instanceof HTMLButtonElement && !e2.current.hasAttribute("type") && u2("button");
    }, [n2, e2]), n2;
  }
  let u$2 = Symbol();
  function T$2(t2, n2 = true) {
    return Object.assign(t2, { [u$2]: n2 });
  }
  function y(...t2) {
    let n2 = React2.useRef(t2);
    React2.useEffect(() => {
      n2.current = t2;
    }, [t2]);
    let c2 = o$2((e2) => {
      for (let o2 of n2.current)
        o2 != null && (typeof o2 == "function" ? o2(e2) : o2.current = e2);
    });
    return t2.every((e2) => e2 == null || (e2 == null ? void 0 : e2[u$2])) ? void 0 : c2;
  }
  function f$4(r2) {
    throw new Error("Unexpected object: " + r2);
  }
  var a$1 = ((e2) => (e2[e2.First = 0] = "First", e2[e2.Previous = 1] = "Previous", e2[e2.Next = 2] = "Next", e2[e2.Last = 3] = "Last", e2[e2.Specific = 4] = "Specific", e2[e2.Nothing = 5] = "Nothing", e2))(a$1 || {});
  function x$1(r2, n2) {
    let t2 = n2.resolveItems();
    if (t2.length <= 0)
      return null;
    let l2 = n2.resolveActiveIndex(), s2 = l2 != null ? l2 : -1, d2 = (() => {
      switch (r2.focus) {
        case 0:
          return t2.findIndex((e2) => !n2.resolveDisabled(e2));
        case 1: {
          let e2 = t2.slice().reverse().findIndex((i2, c2, u2) => s2 !== -1 && u2.length - c2 - 1 >= s2 ? false : !n2.resolveDisabled(i2));
          return e2 === -1 ? e2 : t2.length - 1 - e2;
        }
        case 2:
          return t2.findIndex((e2, i2) => i2 <= s2 ? false : !n2.resolveDisabled(e2));
        case 3: {
          let e2 = t2.slice().reverse().findIndex((i2) => !n2.resolveDisabled(i2));
          return e2 === -1 ? e2 : t2.length - 1 - e2;
        }
        case 4:
          return t2.findIndex((e2) => n2.resolveId(e2) === r2.id);
        case 5:
          return null;
        default:
          f$4(r2);
      }
    })();
    return d2 === -1 ? l2 : d2;
  }
  var S$1 = ((a2) => (a2[a2.None = 0] = "None", a2[a2.RenderStrategy = 1] = "RenderStrategy", a2[a2.Static = 2] = "Static", a2))(S$1 || {}), j$2 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(j$2 || {});
  function $({ ourProps: r2, theirProps: t2, slot: e2, defaultTag: a2, features: o2, visible: n2 = true, name: l2 }) {
    let s2 = T$1(t2, r2);
    if (n2)
      return p$5(s2, e2, a2, l2);
    let u2 = o2 != null ? o2 : 0;
    if (u2 & 2) {
      let { static: i2 = false, ...d2 } = s2;
      if (i2)
        return p$5(d2, e2, a2, l2);
    }
    if (u2 & 1) {
      let { unmount: i2 = true, ...d2 } = s2;
      return u$3(i2 ? 0 : 1, { [0]() {
        return null;
      }, [1]() {
        return p$5({ ...d2, hidden: true, style: { display: "none" } }, e2, a2, l2);
      } });
    }
    return p$5(s2, e2, a2, l2);
  }
  function p$5(r2, t2 = {}, e2, a2) {
    let { as: o2 = e2, children: n2, refName: l2 = "ref", ...s2 } = m$1(r2, ["unmount", "static"]), u2 = r2.ref !== void 0 ? { [l2]: r2.ref } : {}, i2 = typeof n2 == "function" ? n2(t2) : n2;
    s2.className && typeof s2.className == "function" && (s2.className = s2.className(t2));
    let d2 = {};
    if (t2) {
      let f2 = false, y2 = [];
      for (let [h2, g2] of Object.entries(t2))
        typeof g2 == "boolean" && (f2 = true), g2 === true && y2.push(h2);
      f2 && (d2["data-headlessui-state"] = y2.join(" "));
    }
    if (o2 === React2.Fragment && Object.keys(F$3(s2)).length > 0) {
      if (!React2.isValidElement(i2) || Array.isArray(i2) && i2.length > 1)
        throw new Error(['Passing props on "Fragment"!', "", `The current component <${a2} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(s2).map((f2) => `  - ${f2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((f2) => `  - ${f2}`).join(`
`)].join(`
`));
      return React2.cloneElement(i2, Object.assign({}, T$1(i2.props, F$3(m$1(s2, ["ref"]))), d2, u2, w$1(i2.ref, u2.ref)));
    }
    return React2.createElement(o2, Object.assign({}, m$1(s2, ["ref"]), o2 !== React2.Fragment && u2, o2 !== React2.Fragment && d2), i2);
  }
  function w$1(...r2) {
    return { ref: r2.every((t2) => t2 == null) ? void 0 : (t2) => {
      for (let e2 of r2)
        e2 != null && (typeof e2 == "function" ? e2(t2) : e2.current = t2);
    } };
  }
  function T$1(...r2) {
    if (r2.length === 0)
      return {};
    if (r2.length === 1)
      return r2[0];
    let t2 = {}, e2 = {};
    for (let o2 of r2)
      for (let n2 in o2)
        n2.startsWith("on") && typeof o2[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(o2[n2])) : t2[n2] = o2[n2];
    if (t2.disabled || t2["aria-disabled"])
      return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((o2) => [o2, void 0])));
    for (let o2 in e2)
      Object.assign(t2, { [o2](n2, ...l2) {
        let s2 = e2[o2];
        for (let u2 of s2) {
          if ((n2 instanceof Event || (n2 == null ? void 0 : n2.nativeEvent) instanceof Event) && n2.defaultPrevented)
            return;
          u2(n2, ...l2);
        }
      } });
    return t2;
  }
  function C$2(r2) {
    var t2;
    return Object.assign(React2.forwardRef(r2), { displayName: (t2 = r2.displayName) != null ? t2 : r2.name });
  }
  function F$3(r2) {
    let t2 = Object.assign({}, r2);
    for (let e2 in t2)
      t2[e2] === void 0 && delete t2[e2];
    return t2;
  }
  function m$1(r2, t2 = []) {
    let e2 = Object.assign({}, r2);
    for (let a2 of t2)
      a2 in e2 && delete e2[a2];
    return e2;
  }
  function r(n2) {
    let e2 = n2.parentElement, l2 = null;
    for (; e2 && !(e2 instanceof HTMLFieldSetElement); )
      e2 instanceof HTMLLegendElement && (l2 = e2), e2 = e2.parentElement;
    let t2 = (e2 == null ? void 0 : e2.getAttribute("disabled")) === "";
    return t2 && i(l2) ? false : t2;
  }
  function i(n2) {
    if (!n2)
      return false;
    let e2 = n2.previousElementSibling;
    for (; e2 !== null; ) {
      if (e2 instanceof HTMLLegendElement)
        return false;
      e2 = e2.previousElementSibling;
    }
    return true;
  }
  function e(n2 = {}, r2 = null, t2 = []) {
    for (let [i2, o2] of Object.entries(n2))
      f$3(t2, s$2(r2, i2), o2);
    return t2;
  }
  function s$2(n2, r2) {
    return n2 ? n2 + "[" + r2 + "]" : r2;
  }
  function f$3(n2, r2, t2) {
    if (Array.isArray(t2))
      for (let [i2, o2] of t2.entries())
        f$3(n2, s$2(r2, i2.toString()), o2);
    else
      t2 instanceof Date ? n2.push([r2, t2.toISOString()]) : typeof t2 == "boolean" ? n2.push([r2, t2 ? "1" : "0"]) : typeof t2 == "string" ? n2.push([r2, t2]) : typeof t2 == "number" ? n2.push([r2, `${t2}`]) : t2 == null ? n2.push([r2, ""]) : e(t2, r2, n2);
  }
  function p$4(n2) {
    var t2;
    let r2 = (t2 = n2 == null ? void 0 : n2.form) != null ? t2 : n2.closest("form");
    if (!!r2) {
      for (let i2 of r2.elements)
        if (i2.tagName === "INPUT" && i2.type === "submit" || i2.tagName === "BUTTON" && i2.type === "submit" || i2.nodeName === "INPUT" && i2.type === "image") {
          i2.click();
          return;
        }
    }
  }
  let a = "div";
  var s$1 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(s$1 || {});
  let h$4 = C$2(function(t2, o2) {
    let { features: e2 = 1, ...r2 } = t2, d2 = { ref: o2, "aria-hidden": (e2 & 2) === 2 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
    return $({ ourProps: d2, theirProps: r2, slot: {}, defaultTag: a, name: "Hidden" });
  });
  let o$1 = React2.createContext(null);
  o$1.displayName = "OpenClosedContext";
  var p$3 = ((e2) => (e2[e2.Open = 0] = "Open", e2[e2.Closed = 1] = "Closed", e2))(p$3 || {});
  function s() {
    return React2.useContext(o$1);
  }
  function C$1({ value: t2, children: n2 }) {
    return React__default["default"].createElement(o$1.Provider, { value: t2 }, n2);
  }
  var o = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o || {});
  function p$2(e2, t2, u2) {
    let [l2, s2] = React2.useState(u2), i2 = e2 !== void 0;
    return [i2 ? e2 : l2, o$2((r2) => (i2 || s2(r2), t2 == null ? void 0 : t2(r2)))];
  }
  function f$2() {
    let e2 = React2.useRef(false);
    return s$5(() => (e2.current = true, () => {
      e2.current = false;
    }), []), e2;
  }
  let d = React2.createContext(null);
  function u$1() {
    let r2 = React2.useContext(d);
    if (r2 === null) {
      let t2 = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t2, u$1), t2;
    }
    return r2;
  }
  function k() {
    let [r2, t2] = React2.useState([]);
    return [r2.length > 0 ? r2.join(" ") : void 0, React2.useMemo(() => function(e2) {
      let i2 = o$2((n2) => (t2((o2) => [...o2, n2]), () => t2((o2) => {
        let c2 = o2.slice(), p2 = c2.indexOf(n2);
        return p2 !== -1 && c2.splice(p2, 1), c2;
      }))), s2 = React2.useMemo(() => ({ register: i2, slot: e2.slot, name: e2.name, props: e2.props }), [i2, e2.slot, e2.name, e2.props]);
      return React__default["default"].createElement(d.Provider, { value: s2 }, e2.children);
    }, [t2])];
  }
  let S = "p", F$2 = C$2(function(t2, a2) {
    let e2 = u$1(), i2 = `headlessui-description-${I$2()}`, s2 = y(a2);
    s$5(() => e2.register(i2), [i2, e2.register]);
    let n2 = t2, o2 = { ref: s2, ...e2.props, id: i2 };
    return $({ ourProps: o2, theirProps: n2, slot: e2.slot || {}, defaultTag: S, name: e2.name || "Description" });
  });
  var Q$2 = ((o2) => (o2[o2.Open = 0] = "Open", o2[o2.Closed = 1] = "Closed", o2))(Q$2 || {}), V$2 = ((n2) => (n2[n2.ToggleDisclosure = 0] = "ToggleDisclosure", n2[n2.CloseDisclosure = 1] = "CloseDisclosure", n2[n2.SetButtonId = 2] = "SetButtonId", n2[n2.SetPanelId = 3] = "SetPanelId", n2[n2.LinkPanel = 4] = "LinkPanel", n2[n2.UnlinkPanel = 5] = "UnlinkPanel", n2))(V$2 || {});
  let X = { [0]: (e2) => ({ ...e2, disclosureState: u$3(e2.disclosureState, { [0]: 1, [1]: 0 }) }), [1]: (e2) => e2.disclosureState === 1 ? e2 : { ...e2, disclosureState: 1 }, [4](e2) {
    return e2.linkedPanel === true ? e2 : { ...e2, linkedPanel: true };
  }, [5](e2) {
    return e2.linkedPanel === false ? e2 : { ...e2, linkedPanel: false };
  }, [2](e2, t2) {
    return e2.buttonId === t2.buttonId ? e2 : { ...e2, buttonId: t2.buttonId };
  }, [3](e2, t2) {
    return e2.panelId === t2.panelId ? e2 : { ...e2, panelId: t2.panelId };
  } }, B = React2.createContext(null);
  B.displayName = "DisclosureContext";
  function h$3(e2) {
    let t2 = React2.useContext(B);
    if (t2 === null) {
      let o2 = new Error(`<${e2} /> is missing a parent <Disclosure /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(o2, h$3), o2;
    }
    return t2;
  }
  let H = React2.createContext(null);
  H.displayName = "DisclosureAPIContext";
  function j$1(e2) {
    let t2 = React2.useContext(H);
    if (t2 === null) {
      let o2 = new Error(`<${e2} /> is missing a parent <Disclosure /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(o2, j$1), o2;
    }
    return t2;
  }
  let U = React2.createContext(null);
  U.displayName = "DisclosurePanelContext";
  function Y() {
    return React2.useContext(U);
  }
  function Z(e2, t2) {
    return u$3(t2.type, X, e2, t2);
  }
  let ee$1 = React2.Fragment, te$1 = C$2(function(t2, o2) {
    let { defaultOpen: l2 = false, ...i2 } = t2, s2 = `headlessui-disclosure-button-${I$2()}`, n2 = `headlessui-disclosure-panel-${I$2()}`, u2 = React2.useRef(null), D2 = y(o2, T$2((f2) => {
      u2.current = f2;
    }, t2.as === void 0 || t2.as === React2.Fragment)), T2 = React2.useRef(null), m2 = React2.useRef(null), c2 = React2.useReducer(Z, { disclosureState: l2 ? 0 : 1, linkedPanel: false, buttonRef: m2, panelRef: T2, buttonId: s2, panelId: n2 }), [{ disclosureState: p2 }, a2] = c2;
    React2.useEffect(() => a2({ type: 2, buttonId: s2 }), [s2, a2]), React2.useEffect(() => a2({ type: 3, panelId: n2 }), [n2, a2]);
    let P = o$2((f2) => {
      a2({ type: 1 });
      let C2 = e$1(u2);
      if (!C2)
        return;
      let A = (() => f2 ? f2 instanceof HTMLElement ? f2 : f2.current instanceof HTMLElement ? f2.current : C2.getElementById(s2) : C2.getElementById(s2))();
      A == null || A.focus();
    }), b2 = React2.useMemo(() => ({ close: P }), [P]), r2 = React2.useMemo(() => ({ open: p2 === 0, close: P }), [p2, P]), d2 = { ref: D2 };
    return React__default["default"].createElement(B.Provider, { value: c2 }, React__default["default"].createElement(H.Provider, { value: b2 }, React__default["default"].createElement(C$1, { value: u$3(p2, { [0]: p$3.Open, [1]: p$3.Closed }) }, $({ ourProps: d2, theirProps: i2, slot: r2, defaultTag: ee$1, name: "Disclosure" }))));
  }), ne$1 = "button", le = C$2(function(t2, o$12) {
    let [l2, i2] = h$3("Disclosure.Button"), s2 = Y(), n2 = s2 === null ? false : s2 === l2.panelId, u2 = React2.useRef(null), D2 = y(u2, o$12, n2 ? null : l2.buttonRef), T2 = o$2((r2) => {
      var d2;
      if (n2) {
        if (l2.disclosureState === 1)
          return;
        switch (r2.key) {
          case o.Space:
          case o.Enter:
            r2.preventDefault(), r2.stopPropagation(), i2({ type: 0 }), (d2 = l2.buttonRef.current) == null || d2.focus();
            break;
        }
      } else
        switch (r2.key) {
          case o.Space:
          case o.Enter:
            r2.preventDefault(), r2.stopPropagation(), i2({ type: 0 });
            break;
        }
    }), m2 = o$2((r2) => {
      switch (r2.key) {
        case o.Space:
          r2.preventDefault();
          break;
      }
    }), c2 = o$2((r$12) => {
      var d2;
      r(r$12.currentTarget) || t2.disabled || (n2 ? (i2({ type: 0 }), (d2 = l2.buttonRef.current) == null || d2.focus()) : i2({ type: 0 }));
    }), p2 = React2.useMemo(() => ({ open: l2.disclosureState === 0 }), [l2]), a2 = s$3(t2, u2), P = t2, b2 = n2 ? { ref: D2, type: a2, onKeyDown: T2, onClick: c2 } : { ref: D2, id: l2.buttonId, type: a2, "aria-expanded": t2.disabled ? void 0 : l2.disclosureState === 0, "aria-controls": l2.linkedPanel ? l2.panelId : void 0, onKeyDown: T2, onKeyUp: m2, onClick: c2 };
    return $({ ourProps: b2, theirProps: P, slot: p2, defaultTag: ne$1, name: "Disclosure.Button" });
  }), oe = "div", re$1 = S$1.RenderStrategy | S$1.Static, se = C$2(function(t2, o2) {
    let [l2, i2] = h$3("Disclosure.Panel"), { close: s$12 } = j$1("Disclosure.Panel"), n2 = y(o2, l2.panelRef, (p2) => {
      i2({ type: p2 ? 4 : 5 });
    }), u2 = s(), D2 = (() => u2 !== null ? u2 === p$3.Open : l2.disclosureState === 0)(), T2 = React2.useMemo(() => ({ open: l2.disclosureState === 0, close: s$12 }), [l2, s$12]), m2 = t2, c2 = { ref: n2, id: l2.panelId };
    return React__default["default"].createElement(U.Provider, { value: l2.panelId }, $({ ourProps: c2, theirProps: m2, slot: T2, defaultTag: oe, features: re$1, visible: D2, name: "Disclosure.Panel" }));
  }), Oe$1 = Object.assign(te$1, { Button: le, Panel: se });
  var ye$1 = ((n2) => (n2[n2.Open = 0] = "Open", n2[n2.Closed = 1] = "Closed", n2))(ye$1 || {}), xe$2 = ((n2) => (n2[n2.Single = 0] = "Single", n2[n2.Multi = 1] = "Multi", n2))(xe$2 || {}), Oe = ((n2) => (n2[n2.Pointer = 0] = "Pointer", n2[n2.Other = 1] = "Other", n2))(Oe || {}), me$1 = ((r2) => (r2[r2.OpenListbox = 0] = "OpenListbox", r2[r2.CloseListbox = 1] = "CloseListbox", r2[r2.SetDisabled = 2] = "SetDisabled", r2[r2.SetOrientation = 3] = "SetOrientation", r2[r2.GoToOption = 4] = "GoToOption", r2[r2.Search = 5] = "Search", r2[r2.ClearSearch = 6] = "ClearSearch", r2[r2.RegisterOption = 7] = "RegisterOption", r2[r2.UnregisterOption = 8] = "UnregisterOption", r2))(me$1 || {});
  function j(t2, i2 = (n2) => n2) {
    let n2 = t2.activeOptionIndex !== null ? t2.options[t2.activeOptionIndex] : null, e2 = S$2(i2(t2.options.slice()), (u2) => u2.dataRef.current.domRef.current), o2 = n2 ? e2.indexOf(n2) : null;
    return o2 === -1 && (o2 = null), { options: e2, activeOptionIndex: o2 };
  }
  let ge$2 = { [1](t2) {
    return t2.disabled || t2.listboxState === 1 ? t2 : { ...t2, activeOptionIndex: null, listboxState: 1 };
  }, [0](t2) {
    if (t2.disabled || t2.listboxState === 0)
      return t2;
    let i2 = t2.activeOptionIndex, { value: n2, mode: e2, compare: o2 } = t2.propsRef.current, u2 = t2.options.findIndex((l2) => {
      let s2 = l2.dataRef.current.value;
      return u$3(e2, { [1]: () => n2.some((r2) => o2(r2, s2)), [0]: () => o2(n2, s2) });
    });
    return u2 !== -1 && (i2 = u2), { ...t2, listboxState: 0, activeOptionIndex: i2 };
  }, [2](t2, i2) {
    return t2.disabled === i2.disabled ? t2 : { ...t2, disabled: i2.disabled };
  }, [3](t2, i2) {
    return t2.orientation === i2.orientation ? t2 : { ...t2, orientation: i2.orientation };
  }, [4](t2, i2) {
    var o2;
    if (t2.disabled || t2.listboxState === 1)
      return t2;
    let n2 = j(t2), e2 = x$1(i2, { resolveItems: () => n2.options, resolveActiveIndex: () => n2.activeOptionIndex, resolveId: (u2) => u2.id, resolveDisabled: (u2) => u2.dataRef.current.disabled });
    return { ...t2, ...n2, searchQuery: "", activeOptionIndex: e2, activationTrigger: (o2 = i2.trigger) != null ? o2 : 1 };
  }, [5]: (t2, i2) => {
    if (t2.disabled || t2.listboxState === 1)
      return t2;
    let e2 = t2.searchQuery !== "" ? 0 : 1, o2 = t2.searchQuery + i2.value.toLowerCase(), l2 = (t2.activeOptionIndex !== null ? t2.options.slice(t2.activeOptionIndex + e2).concat(t2.options.slice(0, t2.activeOptionIndex + e2)) : t2.options).find((d2) => {
      var r2;
      return !d2.dataRef.current.disabled && ((r2 = d2.dataRef.current.textValue) == null ? void 0 : r2.startsWith(o2));
    }), s2 = l2 ? t2.options.indexOf(l2) : -1;
    return s2 === -1 || s2 === t2.activeOptionIndex ? { ...t2, searchQuery: o2 } : { ...t2, searchQuery: o2, activeOptionIndex: s2, activationTrigger: 1 };
  }, [6](t2) {
    return t2.disabled || t2.listboxState === 1 || t2.searchQuery === "" ? t2 : { ...t2, searchQuery: "" };
  }, [7]: (t2, i2) => {
    let n2 = { id: i2.id, dataRef: i2.dataRef }, e2 = j(t2, (o2) => [...o2, n2]);
    if (t2.activeOptionIndex === null) {
      let { value: o2, mode: u2, compare: l2 } = t2.propsRef.current, s2 = i2.dataRef.current.value;
      u$3(u2, { [1]: () => o2.some((r2) => l2(r2, s2)), [0]: () => l2(o2, s2) }) && (e2.activeOptionIndex = e2.options.indexOf(n2));
    }
    return { ...t2, ...e2 };
  }, [8]: (t2, i2) => {
    let n2 = j(t2, (e2) => {
      let o2 = e2.findIndex((u2) => u2.id === i2.id);
      return o2 !== -1 && e2.splice(o2, 1), e2;
    });
    return { ...t2, ...n2, activationTrigger: 1 };
  } }, K = React2.createContext(null);
  K.displayName = "ListboxContext";
  function w(t2) {
    let i2 = React2.useContext(K);
    if (i2 === null) {
      let n2 = new Error(`<${t2} /> is missing a parent <Listbox /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(n2, w), n2;
    }
    return i2;
  }
  function Re$1(t2, i2) {
    return u$3(i2.type, ge$2, t2, i2);
  }
  let ve$1 = React2.Fragment, Le = C$2(function(i2, n2) {
    let { value: e$12, defaultValue: o2, name: u2, onChange: l2, by: s2 = (p2, T2) => p2 === T2, disabled: d2 = false, horizontal: r2 = false, multiple: x2 = false, ...S2 } = i2;
    const g2 = r2 ? "horizontal" : "vertical";
    let O2 = y(n2), [m2, f2] = p$2(e$12, l2, o2), b2 = React2.useReducer(Re$1, { listboxState: 1, propsRef: { current: { value: m2, onChange: f2, mode: x2 ? 1 : 0, compare: o$2(typeof s2 == "string" ? (p2, T2) => {
      let C2 = s2;
      return (p2 == null ? void 0 : p2[C2]) === (T2 == null ? void 0 : T2[C2]);
    } : s2) } }, labelRef: React2.createRef(), buttonRef: React2.createRef(), optionsRef: React2.createRef(), disabled: d2, orientation: g2, options: [], searchQuery: "", activeOptionIndex: null, activationTrigger: 1 }), [{ listboxState: a2, propsRef: c2, optionsRef: P, buttonRef: D2 }, M2] = b2;
    c2.current.value = m2, c2.current.mode = x2 ? 1 : 0, s$5(() => {
      c2.current.onChange = (p2) => u$3(c2.current.mode, { [0]() {
        return f2(p2);
      }, [1]() {
        let T2 = c2.current.value.slice(), { compare: C2 } = c2.current, W = T2.findIndex((X2) => C2(X2, p2));
        return W === -1 ? T2.push(p2) : T2.splice(W, 1), f2(T2);
      } });
    }, [f2, c2]), s$5(() => M2({ type: 2, disabled: d2 }), [d2]), s$5(() => M2({ type: 3, orientation: g2 }), [g2]), L([D2, P], (p2, T2) => {
      var C2;
      M2({ type: 1 }), F$4(T2, N.Loose) || (p2.preventDefault(), (C2 = D2.current) == null || C2.focus());
    }, a2 === 0);
    let N$1 = React2.useMemo(() => ({ open: a2 === 0, disabled: d2, value: m2 }), [a2, d2, m2]), R = { ref: O2 };
    return React__default["default"].createElement(K.Provider, { value: b2 }, React__default["default"].createElement(C$1, { value: u$3(a2, { [0]: p$3.Open, [1]: p$3.Closed }) }, u2 != null && m2 != null && e({ [u2]: m2 }).map(([p2, T2]) => React__default["default"].createElement(h$4, { features: s$1.Hidden, ...F$3({ key: p2, as: "input", type: "hidden", hidden: true, readOnly: true, name: p2, value: T2 }) })), $({ ourProps: R, theirProps: S2, slot: N$1, defaultTag: ve$1, name: "Listbox" })));
  }), Se$2 = "button", Ae$1 = C$2(function(i2, n2) {
    var f2;
    let [e2, o$12] = w("Listbox.Button"), u2 = y(e2.buttonRef, n2), l2 = `headlessui-listbox-button-${I$2()}`, s2 = p$6(), d2 = o$2((b2) => {
      switch (b2.key) {
        case o.Space:
        case o.Enter:
        case o.ArrowDown:
          b2.preventDefault(), o$12({ type: 0 }), s2.nextFrame(() => {
            e2.propsRef.current.value || o$12({ type: 4, focus: a$1.First });
          });
          break;
        case o.ArrowUp:
          b2.preventDefault(), o$12({ type: 0 }), s2.nextFrame(() => {
            e2.propsRef.current.value || o$12({ type: 4, focus: a$1.Last });
          });
          break;
      }
    }), r$12 = o$2((b2) => {
      switch (b2.key) {
        case o.Space:
          b2.preventDefault();
          break;
      }
    }), x2 = o$2((b2) => {
      if (r(b2.currentTarget))
        return b2.preventDefault();
      e2.listboxState === 0 ? (o$12({ type: 1 }), s2.nextFrame(() => {
        var a2;
        return (a2 = e2.buttonRef.current) == null ? void 0 : a2.focus({ preventScroll: true });
      })) : (b2.preventDefault(), o$12({ type: 0 }));
    }), S2 = i$2(() => {
      if (!!e2.labelRef.current)
        return [e2.labelRef.current.id, l2].join(" ");
    }, [e2.labelRef.current, l2]), g2 = React2.useMemo(() => ({ open: e2.listboxState === 0, disabled: e2.disabled, value: e2.propsRef.current.value }), [e2]), O2 = i2, m2 = { ref: u2, id: l2, type: s$3(i2, e2.buttonRef), "aria-haspopup": true, "aria-controls": (f2 = e2.optionsRef.current) == null ? void 0 : f2.id, "aria-expanded": e2.disabled ? void 0 : e2.listboxState === 0, "aria-labelledby": S2, disabled: e2.disabled, onKeyDown: d2, onKeyUp: r$12, onClick: x2 };
    return $({ ourProps: m2, theirProps: O2, slot: g2, defaultTag: Se$2, name: "Listbox.Button" });
  }), he = "label", Pe$2 = C$2(function(i2, n2) {
    let [e2] = w("Listbox.Label"), o2 = `headlessui-listbox-label-${I$2()}`, u2 = y(e2.labelRef, n2), l2 = o$2(() => {
      var x2;
      return (x2 = e2.buttonRef.current) == null ? void 0 : x2.focus({ preventScroll: true });
    }), s2 = React2.useMemo(() => ({ open: e2.listboxState === 0, disabled: e2.disabled }), [e2]);
    return $({ ourProps: { ref: u2, id: o2, onClick: l2 }, theirProps: i2, slot: s2, defaultTag: he, name: "Listbox.Label" });
  }), Ce$1 = "ul", De = S$1.RenderStrategy | S$1.Static, Me = C$2(function(i2, n2) {
    var b2;
    let [e2, o$12] = w("Listbox.Options"), u2 = y(e2.optionsRef, n2), l2 = `headlessui-listbox-options-${I$2()}`, s$12 = p$6(), d2 = p$6(), r2 = s(), x2 = (() => r2 !== null ? r2 === p$3.Open : e2.listboxState === 0)();
    React2.useEffect(() => {
      var c2;
      let a2 = e2.optionsRef.current;
      !a2 || e2.listboxState === 0 && a2 !== ((c2 = e$1(a2)) == null ? void 0 : c2.activeElement) && a2.focus({ preventScroll: true });
    }, [e2.listboxState, e2.optionsRef]);
    let S2 = o$2((a2) => {
      switch (d2.dispose(), a2.key) {
        case o.Space:
          if (e2.searchQuery !== "")
            return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 5, value: a2.key });
        case o.Enter:
          if (a2.preventDefault(), a2.stopPropagation(), e2.activeOptionIndex !== null) {
            let { dataRef: c2 } = e2.options[e2.activeOptionIndex];
            e2.propsRef.current.onChange(c2.current.value);
          }
          e2.propsRef.current.mode === 0 && (o$12({ type: 1 }), m$3().nextFrame(() => {
            var c2;
            return (c2 = e2.buttonRef.current) == null ? void 0 : c2.focus({ preventScroll: true });
          }));
          break;
        case u$3(e2.orientation, { vertical: o.ArrowDown, horizontal: o.ArrowRight }):
          return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 4, focus: a$1.Next });
        case u$3(e2.orientation, { vertical: o.ArrowUp, horizontal: o.ArrowLeft }):
          return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 4, focus: a$1.Previous });
        case o.Home:
        case o.PageUp:
          return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 4, focus: a$1.First });
        case o.End:
        case o.PageDown:
          return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 4, focus: a$1.Last });
        case o.Escape:
          return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 1 }), s$12.nextFrame(() => {
            var c2;
            return (c2 = e2.buttonRef.current) == null ? void 0 : c2.focus({ preventScroll: true });
          });
        case o.Tab:
          a2.preventDefault(), a2.stopPropagation();
          break;
        default:
          a2.key.length === 1 && (o$12({ type: 5, value: a2.key }), d2.setTimeout(() => o$12({ type: 6 }), 350));
          break;
      }
    }), g2 = i$2(() => {
      var a2, c2, P;
      return (P = (a2 = e2.labelRef.current) == null ? void 0 : a2.id) != null ? P : (c2 = e2.buttonRef.current) == null ? void 0 : c2.id;
    }, [e2.labelRef.current, e2.buttonRef.current]), O2 = React2.useMemo(() => ({ open: e2.listboxState === 0 }), [e2]), m2 = i2, f2 = { "aria-activedescendant": e2.activeOptionIndex === null || (b2 = e2.options[e2.activeOptionIndex]) == null ? void 0 : b2.id, "aria-multiselectable": e2.propsRef.current.mode === 1 ? true : void 0, "aria-labelledby": g2, "aria-orientation": e2.orientation, id: l2, onKeyDown: S2, role: "listbox", tabIndex: 0, ref: u2 };
    return $({ ourProps: f2, theirProps: m2, slot: O2, defaultTag: Ce$1, features: De, visible: x2, name: "Listbox.Options" });
  }), Ee$2 = "li", Ie = C$2(function(i2, n2) {
    let { disabled: e2 = false, value: o2, ...u2 } = i2, [l2, s2] = w("Listbox.Option"), d2 = `headlessui-listbox-option-${I$2()}`, r2 = l2.activeOptionIndex !== null ? l2.options[l2.activeOptionIndex].id === d2 : false, { value: x2, compare: S2 } = l2.propsRef.current, g2 = u$3(l2.propsRef.current.mode, { [1]: () => x2.some((R) => S2(R, o2)), [0]: () => S2(x2, o2) }), O2 = React2.useRef(null), m2 = y(n2, O2);
    s$5(() => {
      if (l2.listboxState !== 0 || !r2 || l2.activationTrigger === 0)
        return;
      let R = m$3();
      return R.requestAnimationFrame(() => {
        var p2, T2;
        (T2 = (p2 = O2.current) == null ? void 0 : p2.scrollIntoView) == null || T2.call(p2, { block: "nearest" });
      }), R.dispose;
    }, [O2, r2, l2.listboxState, l2.activationTrigger, l2.activeOptionIndex]);
    let f2 = React2.useRef({ disabled: e2, value: o2, domRef: O2 });
    s$5(() => {
      f2.current.disabled = e2;
    }, [f2, e2]), s$5(() => {
      f2.current.value = o2;
    }, [f2, o2]), s$5(() => {
      var R, p2;
      f2.current.textValue = (p2 = (R = O2.current) == null ? void 0 : R.textContent) == null ? void 0 : p2.toLowerCase();
    }, [f2, O2]);
    let b2 = o$2(() => l2.propsRef.current.onChange(o2));
    s$5(() => (s2({ type: 7, id: d2, dataRef: f2 }), () => s2({ type: 8, id: d2 })), [f2, d2]);
    let a2 = o$2((R) => {
      if (e2)
        return R.preventDefault();
      b2(), l2.propsRef.current.mode === 0 && (s2({ type: 1 }), m$3().nextFrame(() => {
        var p2;
        return (p2 = l2.buttonRef.current) == null ? void 0 : p2.focus({ preventScroll: true });
      }));
    }), c2 = o$2(() => {
      if (e2)
        return s2({ type: 4, focus: a$1.Nothing });
      s2({ type: 4, focus: a$1.Specific, id: d2 });
    }), P = o$2(() => {
      e2 || r2 || s2({ type: 4, focus: a$1.Specific, id: d2, trigger: 0 });
    }), D2 = o$2(() => {
      e2 || !r2 || s2({ type: 4, focus: a$1.Nothing });
    }), M2 = React2.useMemo(() => ({ active: r2, selected: g2, disabled: e2 }), [r2, g2, e2]);
    return $({ ourProps: { id: d2, ref: m2, role: "option", tabIndex: e2 === true ? void 0 : -1, "aria-disabled": e2 === true ? true : void 0, "aria-selected": g2, disabled: void 0, onClick: a2, onFocus: c2, onPointerMove: P, onMouseMove: P, onPointerLeave: D2, onMouseLeave: D2 }, theirProps: u2, slot: M2, defaultTag: Ee$2, name: "Listbox.Option" });
  }), pt = Object.assign(Le, { Button: Ae$1, Label: Pe$2, Options: Me, Option: Ie });
  let u = React2.createContext(null);
  function c$1() {
    let o2 = React2.useContext(u);
    if (o2 === null) {
      let t2 = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t2, c$1), t2;
    }
    return o2;
  }
  function M$1() {
    let [o2, t2] = React2.useState([]);
    return [o2.length > 0 ? o2.join(" ") : void 0, React2.useMemo(() => function(e2) {
      let l2 = o$2((a2) => (t2((i2) => [...i2, a2]), () => t2((i2) => {
        let n2 = i2.slice(), d2 = n2.indexOf(a2);
        return d2 !== -1 && n2.splice(d2, 1), n2;
      }))), r2 = React2.useMemo(() => ({ register: l2, slot: e2.slot, name: e2.name, props: e2.props }), [l2, e2.slot, e2.name, e2.props]);
      return React__default["default"].createElement(u.Provider, { value: r2 }, e2.children);
    }, [t2])];
  }
  let h$2 = "label", F$1 = C$2(function(t2, s2) {
    let { passive: e2 = false, ...l2 } = t2, r2 = c$1(), a2 = `headlessui-label-${I$2()}`, i2 = y(s2);
    s$5(() => r2.register(a2), [a2, r2.register]);
    let n2 = { ref: i2, ...r2.props, id: a2 };
    return e2 && ("onClick" in n2 && delete n2.onClick, "onClick" in l2 && delete l2.onClick), $({ ourProps: n2, theirProps: l2, slot: r2.slot || {}, defaultTag: h$2, name: r2.name || "Label" });
  });
  let h$1 = React2.createContext(null);
  h$1.displayName = "GroupContext";
  let z$1 = React2.Fragment;
  function J$1(b2) {
    let [t2, o2] = React2.useState(null), [i2, d2] = M$1(), [a2, s2] = k(), u2 = React2.useMemo(() => ({ switch: t2, setSwitch: o2, labelledby: i2, describedby: a2 }), [t2, o2, i2, a2]), p2 = {}, m2 = b2;
    return React__default["default"].createElement(s2, { name: "Switch.Description" }, React__default["default"].createElement(d2, { name: "Switch.Label", props: { onClick() {
      !t2 || (t2.click(), t2.focus({ preventScroll: true }));
    } } }, React__default["default"].createElement(h$1.Provider, { value: u2 }, $({ ourProps: p2, theirProps: m2, defaultTag: z$1, name: "Switch.Group" }))));
  }
  let Q$1 = "button", V$1 = C$2(function(t2, o$12) {
    let { checked: i2, defaultChecked: d2 = false, onChange: a2, name: s2, value: u2, ...p2 } = t2, m2 = `headlessui-switch-${I$2()}`, r$12 = React2.useContext(h$1), y$1 = React2.useRef(null), P = y(y$1, o$12, r$12 === null ? null : r$12.setSwitch), [n2, f2] = p$2(i2, a2, d2), T2 = o$2(() => f2 == null ? void 0 : f2(!n2)), v2 = o$2((e2) => {
      if (r(e2.currentTarget))
        return e2.preventDefault();
      e2.preventDefault(), T2();
    }), k2 = o$2((e2) => {
      e2.key === o.Space ? (e2.preventDefault(), T2()) : e2.key === o.Enter && p$4(e2.currentTarget);
    }), g2 = o$2((e2) => e2.preventDefault()), C2 = React2.useMemo(() => ({ checked: n2 }), [n2]), D2 = { id: m2, ref: P, role: "switch", type: s$3(t2, y$1), tabIndex: 0, "aria-checked": n2, "aria-labelledby": r$12 == null ? void 0 : r$12.labelledby, "aria-describedby": r$12 == null ? void 0 : r$12.describedby, onClick: v2, onKeyUp: k2, onKeyPress: g2 };
    return React__default["default"].createElement(React__default["default"].Fragment, null, s2 != null && n2 && React__default["default"].createElement(h$4, { features: s$1.Hidden, ...F$3({ as: "input", type: "checkbox", hidden: true, readOnly: true, checked: n2, name: s2, value: u2 }) }), $({ ourProps: D2, theirProps: p2, slot: C2, defaultTag: Q$1, name: "Switch" }));
  }), be$2 = Object.assign(V$1, { Group: J$1, Label: F$1, Description: F$2 });
  function p$1({ onFocus: n2 }) {
    let [r2, o2] = React2.useState(true);
    return r2 ? React__default["default"].createElement(h$4, { as: "button", type: "button", features: s$1.Focusable, onFocus: (a2) => {
      a2.preventDefault();
      let e2, u2 = 50;
      function t2() {
        if (u2-- <= 0) {
          e2 && cancelAnimationFrame(e2);
          return;
        }
        if (n2()) {
          o2(false), cancelAnimationFrame(e2);
          return;
        }
        e2 = requestAnimationFrame(t2);
      }
      e2 = requestAnimationFrame(t2);
    } }) : null;
  }
  var de = ((n2) => (n2[n2.SetSelectedIndex = 0] = "SetSelectedIndex", n2[n2.RegisterTab = 1] = "RegisterTab", n2[n2.UnregisterTab = 2] = "UnregisterTab", n2[n2.RegisterPanel = 3] = "RegisterPanel", n2[n2.UnregisterPanel = 4] = "UnregisterPanel", n2))(de || {});
  let pe = { [0](e2, t2) {
    let r2 = e2.tabs.filter((i2) => {
      var l2;
      return !((l2 = i2.current) != null && l2.hasAttribute("disabled"));
    });
    if (t2.index < 0)
      return { ...e2, selectedIndex: e2.tabs.indexOf(r2[0]) };
    if (t2.index > e2.tabs.length)
      return { ...e2, selectedIndex: e2.tabs.indexOf(r2[r2.length - 1]) };
    let o2 = e2.tabs.slice(0, t2.index), n2 = [...e2.tabs.slice(t2.index), ...o2].find((i2) => r2.includes(i2));
    return n2 ? { ...e2, selectedIndex: e2.tabs.indexOf(n2) } : e2;
  }, [1](e2, t2) {
    var n2;
    if (e2.tabs.includes(t2.tab))
      return e2;
    let r2 = e2.tabs[e2.selectedIndex], o2 = S$2([...e2.tabs, t2.tab], (i2) => i2.current), s2 = (n2 = o2.indexOf(r2)) != null ? n2 : e2.selectedIndex;
    return s2 === -1 && (s2 = e2.selectedIndex), { ...e2, tabs: o2, selectedIndex: s2 };
  }, [2](e2, t2) {
    return { ...e2, tabs: e2.tabs.filter((r2) => r2 !== t2.tab) };
  }, [3](e2, t2) {
    return e2.panels.includes(t2.panel) ? e2 : { ...e2, panels: S$2([...e2.panels, t2.panel], (r2) => r2.current) };
  }, [4](e2, t2) {
    return { ...e2, panels: e2.panels.filter((r2) => r2 !== t2.panel) };
  } }, z = React2.createContext(null);
  z.displayName = "TabsSSRContext";
  function V(e2) {
    let t2 = React2.useContext(z);
    if (t2 === null) {
      let r2 = new Error(`<${e2} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, V), r2;
    }
    return t2;
  }
  let q$2 = React2.createContext(null);
  q$2.displayName = "TabsDataContext";
  function D(e2) {
    let t2 = React2.useContext(q$2);
    if (t2 === null) {
      let r2 = new Error(`<${e2} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, D), r2;
    }
    return t2;
  }
  let J = React2.createContext(null);
  J.displayName = "TabsActionsContext";
  function Q(e2) {
    let t2 = React2.useContext(J);
    if (t2 === null) {
      let r2 = new Error(`<${e2} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, Q), r2;
    }
    return t2;
  }
  function fe(e2, t2) {
    return u$3(t2.type, pe, e2, t2);
  }
  let be$1 = React2.Fragment, Te = C$2(function(t2, r2) {
    let { defaultIndex: o2 = 0, vertical: s2 = false, manual: n2 = false, onChange: i2, selectedIndex: l2 = null, ...y$1 } = t2;
    const p2 = s2 ? "vertical" : "horizontal", S2 = n2 ? "manual" : "auto";
    let b2 = l2 !== null, u2 = y(r2), [c2, f2] = React2.useReducer(fe, { selectedIndex: l2 != null ? l2 : o2, tabs: [], panels: [] }), T2 = React2.useMemo(() => ({ selectedIndex: c2.selectedIndex }), [c2.selectedIndex]), x2 = s$4(i2 || (() => {
    })), R = s$4(c2.tabs), E = React2.useMemo(() => ({ orientation: p2, activation: S2, ...c2 }), [p2, S2, c2]), A = s$4(b2 ? t2.selectedIndex : c2.selectedIndex), L2 = React2.useMemo(() => ({ registerTab(d2) {
      return f2({ type: 1, tab: d2 }), () => f2({ type: 2, tab: d2 });
    }, registerPanel(d2) {
      return f2({ type: 3, panel: d2 }), () => f2({ type: 4, panel: d2 });
    }, change(d2) {
      A.current !== d2 && x2.current(d2), b2 || f2({ type: 0, index: d2 });
    } }), [f2, b2]);
    s$5(() => {
      f2({ type: 0, index: l2 != null ? l2 : o2 });
    }, [l2]);
    let k2 = React2.useRef({ tabs: [], panels: [] }), G = { ref: u2 };
    return React__default["default"].createElement(z.Provider, { value: k2 }, React__default["default"].createElement(J.Provider, { value: L2 }, React__default["default"].createElement(q$2.Provider, { value: E }, E.tabs.length <= 0 && React__default["default"].createElement(p$1, { onFocus: () => {
      var d2, U2;
      for (let M2 of R.current)
        if (((d2 = M2.current) == null ? void 0 : d2.tabIndex) === 0)
          return (U2 = M2.current) == null || U2.focus(), true;
      return false;
    } }), $({ ourProps: G, theirProps: y$1, slot: T2, defaultTag: be$1, name: "Tabs" }))));
  }), me = "div", Pe$1 = C$2(function(t2, r2) {
    let { orientation: o2, selectedIndex: s2 } = D("Tab.List"), n2 = y(r2);
    return $({ ourProps: { ref: n2, role: "tablist", "aria-orientation": o2 }, theirProps: t2, slot: { selectedIndex: s2 }, defaultTag: me, name: "Tabs.List" });
  }), xe$1 = "button", ge$1 = C$2(function(t$1, r2) {
    var M2, X2;
    let o$12 = `headlessui-tabs-tab-${I$2()}`, { orientation: s2, activation: n2, selectedIndex: i2, tabs: l2, panels: y$1 } = D("Tab"), p2 = Q("Tab"), S2 = D("Tab"), b2 = V("Tab"), u2 = React2.useRef(null), c2 = y(u2, r2);
    s$5(() => p2.registerTab(u2), [p2, u2]);
    let f2 = b2.current.tabs.indexOf(o$12);
    f2 === -1 && (f2 = b2.current.tabs.push(o$12) - 1);
    let T2 = l2.indexOf(u2);
    T2 === -1 && (T2 = f2);
    let x2 = T2 === i2, R = o$2((a2) => {
      var j2;
      let g2 = a2();
      if (g2 === M$2.Success && n2 === "auto") {
        let W = (j2 = e$1(u2)) == null ? void 0 : j2.activeElement, Y2 = S2.tabs.findIndex((ne2) => ne2.current === W);
        Y2 !== -1 && p2.change(Y2);
      }
      return g2;
    }), E = o$2((a2) => {
      let g2 = l2.map((W) => W.current).filter(Boolean);
      if (a2.key === o.Space || a2.key === o.Enter) {
        a2.preventDefault(), a2.stopPropagation(), p2.change(T2);
        return;
      }
      switch (a2.key) {
        case o.Home:
        case o.PageUp:
          return a2.preventDefault(), a2.stopPropagation(), R(() => O(g2, T$3.First));
        case o.End:
        case o.PageDown:
          return a2.preventDefault(), a2.stopPropagation(), R(() => O(g2, T$3.Last));
      }
      if (R(() => u$3(s2, { vertical() {
        return a2.key === o.ArrowUp ? O(g2, T$3.Previous | T$3.WrapAround) : a2.key === o.ArrowDown ? O(g2, T$3.Next | T$3.WrapAround) : M$2.Error;
      }, horizontal() {
        return a2.key === o.ArrowLeft ? O(g2, T$3.Previous | T$3.WrapAround) : a2.key === o.ArrowRight ? O(g2, T$3.Next | T$3.WrapAround) : M$2.Error;
      } })) === M$2.Success)
        return a2.preventDefault();
    }), A = React2.useRef(false), L2 = o$2(() => {
      var a2;
      A.current || (A.current = true, (a2 = u2.current) == null || a2.focus(), p2.change(T2), t(() => {
        A.current = false;
      }));
    }), k2 = o$2((a2) => {
      a2.preventDefault();
    }), G = React2.useMemo(() => ({ selected: x2 }), [x2]), d2 = t$1, U2 = { ref: c2, onKeyDown: E, onMouseDown: k2, onClick: L2, id: o$12, role: "tab", type: s$3(t$1, u2), "aria-controls": (X2 = (M2 = y$1[T2]) == null ? void 0 : M2.current) == null ? void 0 : X2.id, "aria-selected": x2, tabIndex: x2 ? 0 : -1 };
    return $({ ourProps: U2, theirProps: d2, slot: G, defaultTag: xe$1, name: "Tabs.Tab" });
  }), ye = "div", Re = C$2(function(t2, r2) {
    let { selectedIndex: o2 } = D("Tab.Panels"), s2 = y(r2), n2 = React2.useMemo(() => ({ selectedIndex: o2 }), [o2]);
    return $({ ourProps: { ref: s2 }, theirProps: t2, slot: n2, defaultTag: ye, name: "Tabs.Panels" });
  }), Ae = "div", Ee$1 = S$1.RenderStrategy | S$1.Static, Se$1 = C$2(function(t2, r2) {
    var R, E, A, L2;
    let { selectedIndex: o2, tabs: s2, panels: n2 } = D("Tab.Panel"), i2 = Q("Tab.Panel"), l2 = V("Tab.Panel"), y$1 = `headlessui-tabs-panel-${I$2()}`, p2 = React2.useRef(null), S2 = y(p2, r2);
    s$5(() => i2.registerPanel(p2), [i2, p2]);
    let b2 = l2.current.panels.indexOf(y$1);
    b2 === -1 && (b2 = l2.current.panels.push(y$1) - 1);
    let u2 = n2.indexOf(p2);
    u2 === -1 && (u2 = b2);
    let c2 = u2 === o2, f2 = React2.useMemo(() => ({ selected: c2 }), [c2]), T2 = t2, x2 = { ref: S2, id: y$1, role: "tabpanel", "aria-labelledby": (E = (R = s2[u2]) == null ? void 0 : R.current) == null ? void 0 : E.id, tabIndex: c2 ? 0 : -1 };
    return !c2 && ((A = t2.unmount) != null ? A : true) && !((L2 = t2.static) != null && L2) ? React__default["default"].createElement(h$4, { as: "span", ...x2 }) : $({ ourProps: x2, theirProps: T2, slot: f2, defaultTag: Ae, features: Ee$1, visible: c2, name: "Tabs.Panel" });
  }), qe = Object.assign(ge$1, { Group: Te, List: Pe$1, Panels: Re, Panel: Se$1 });
  function l(r2) {
    let e2 = { called: false };
    return (...t2) => {
      if (!e2.called)
        return e2.called = true, r2(...t2);
    };
  }
  function f$1(t2, ...e2) {
    t2 && e2.length > 0 && t2.classList.add(...e2);
  }
  function v(t2, ...e2) {
    t2 && e2.length > 0 && t2.classList.remove(...e2);
  }
  var T = ((n2) => (n2.Ended = "ended", n2.Cancelled = "cancelled", n2))(T || {});
  function c(t2, e2) {
    let n2 = m$3();
    if (!t2)
      return n2.dispose;
    let { transitionDuration: d2, transitionDelay: o2 } = getComputedStyle(t2), [s2, u2] = [d2, o2].map((i2) => {
      let [a2 = 0] = i2.split(",").filter(Boolean).map((r2) => r2.includes("ms") ? parseFloat(r2) : parseFloat(r2) * 1e3).sort((r2, l2) => l2 - r2);
      return a2;
    });
    if (s2 + u2 !== 0) {
      let i2 = [];
      i2.push(n2.addEventListener(t2, "transitionrun", (a2) => {
        a2.target === a2.currentTarget && (i2.splice(0).forEach((r2) => r2()), i2.push(n2.addEventListener(t2, "transitionend", (r2) => {
          r2.target === r2.currentTarget && (e2("ended"), i2.splice(0).forEach((l2) => l2()));
        }), n2.addEventListener(t2, "transitioncancel", (r2) => {
          r2.target === r2.currentTarget && (e2("cancelled"), i2.splice(0).forEach((l2) => l2()));
        })));
      }));
    } else
      e2("ended");
    return n2.add(() => e2("cancelled")), n2.dispose;
  }
  function C(t2, e2, n2, d2) {
    let o2 = n2 ? "enter" : "leave", s2 = m$3(), u2 = d2 !== void 0 ? l(d2) : () => {
    };
    o2 === "enter" && (t2.removeAttribute("hidden"), t2.style.display = "");
    let m2 = u$3(o2, { enter: () => e2.enter, leave: () => e2.leave }), i2 = u$3(o2, { enter: () => e2.enterTo, leave: () => e2.leaveTo }), a2 = u$3(o2, { enter: () => e2.enterFrom, leave: () => e2.leaveFrom });
    return v(t2, ...e2.enter, ...e2.enterTo, ...e2.enterFrom, ...e2.leave, ...e2.leaveFrom, ...e2.leaveTo, ...e2.entered), f$1(t2, ...m2, ...a2), s2.nextFrame(() => {
      v(t2, ...a2), f$1(t2, ...i2), c(t2, (r2) => (r2 === "ended" && (v(t2, ...m2), f$1(t2, ...e2.entered)), u2(r2)));
    }), s2.dispose;
  }
  function I$1({ container: o2, direction: t2, classes: s2, onStart: a2, onStop: u2 }) {
    let c2 = f$2(), d2 = p$6(), r2 = s$4(t2);
    s$5(() => {
      let e2 = m$3();
      d2.add(e2.dispose);
      let n2 = o2.current;
      if (!!n2 && r2.current !== "idle" && !!c2.current)
        return e2.dispose(), a2.current(r2.current), e2.add(C(n2, s2.current, r2.current === "enter", (l2) => {
          e2.dispose(), u$3(l2, { [T.Ended]() {
            u2.current(r2.current);
          }, [T.Cancelled]: () => {
          } });
        })), e2.dispose;
    }, [t2]);
  }
  function x(r2 = "") {
    return r2.split(" ").filter((e2) => e2.trim().length > 1);
  }
  let F = React2.createContext(null);
  F.displayName = "TransitionContext";
  var ve = ((s2) => (s2.Visible = "visible", s2.Hidden = "hidden", s2))(ve || {});
  function Ce() {
    let r2 = React2.useContext(F);
    if (r2 === null)
      throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
    return r2;
  }
  function ge() {
    let r2 = React2.useContext(M);
    if (r2 === null)
      throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
    return r2;
  }
  let M = React2.createContext(null);
  M.displayName = "NestingContext";
  function I(r2) {
    return "children" in r2 ? I(r2.children) : r2.current.filter(({ el: e2 }) => e2.current !== null).filter(({ state: e2 }) => e2 === "visible").length > 0;
  }
  function ee(r2, e2) {
    let s2 = s$4(r2), n2 = React2.useRef([]), m2 = f$2(), D2 = p$6(), b2 = o$2((l2, i2 = j$2.Hidden) => {
      let t2 = n2.current.findIndex(({ el: o2 }) => o2 === l2);
      t2 !== -1 && (u$3(i2, { [j$2.Unmount]() {
        n2.current.splice(t2, 1);
      }, [j$2.Hidden]() {
        n2.current[t2].state = "hidden";
      } }), D2.microTask(() => {
        var o2;
        !I(n2) && m2.current && ((o2 = s2.current) == null || o2.call(s2));
      }));
    }), E = o$2((l2) => {
      let i2 = n2.current.find(({ el: t2 }) => t2 === l2);
      return i2 ? i2.state !== "visible" && (i2.state = "visible") : n2.current.push({ el: l2, state: "visible" }), () => b2(l2, j$2.Unmount);
    }), S2 = React2.useRef([]), u2 = React2.useRef(Promise.resolve()), p2 = React2.useRef({ enter: [], leave: [], idle: [] }), d2 = o$2((l2, i2, t2) => {
      S2.current.splice(0), e2 && (e2.chains.current[i2] = e2.chains.current[i2].filter(([o2]) => o2 !== l2)), e2 == null || e2.chains.current[i2].push([l2, new Promise((o2) => {
        S2.current.push(o2);
      })]), e2 == null || e2.chains.current[i2].push([l2, new Promise((o2) => {
        Promise.all(p2.current[i2].map(([f2, a2]) => a2)).then(() => o2());
      })]), i2 === "enter" ? u2.current = u2.current.then(() => e2 == null ? void 0 : e2.wait.current).then(() => t2(i2)) : t2(i2);
    }), h2 = o$2((l2, i2, t2) => {
      Promise.all(p2.current[i2].splice(0).map(([o2, f2]) => f2)).then(() => {
        var o2;
        (o2 = S2.current.shift()) == null || o2();
      }).then(() => t2(i2));
    });
    return React2.useMemo(() => ({ children: n2, register: E, unregister: b2, onStart: d2, onStop: h2, wait: u2, chains: p2 }), [E, b2, n2, d2, h2, p2, u2]);
  }
  function be() {
  }
  let Ee = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
  function te(r2) {
    var s2;
    let e2 = {};
    for (let n2 of Ee)
      e2[n2] = (s2 = r2[n2]) != null ? s2 : be;
    return e2;
  }
  function Se(r2) {
    let e2 = React2.useRef(te(r2));
    return React2.useEffect(() => {
      e2.current = te(r2);
    }, [r2]), e2;
  }
  let xe = "div", ne = S$1.RenderStrategy, re = C$2(function(e2, s2) {
    let { beforeEnter: n2, afterEnter: m2, beforeLeave: D2, afterLeave: b2, enter: E, enterFrom: S2, enterTo: u2, entered: p2, leave: d2, leaveFrom: h2, leaveTo: l2, ...i2 } = e2, t2 = React2.useRef(null), o2 = y(t2, s2), f2 = i2.unmount ? j$2.Unmount : j$2.Hidden, { show: a2, appear: P, initial: ie } = Ce(), [v2, _] = React2.useState(a2 ? "visible" : "hidden"), z2 = ge(), { register: N2, unregister: V2 } = z2, j2 = React2.useRef(null);
    React2.useEffect(() => N2(t2), [N2, t2]), React2.useEffect(() => {
      if (f2 === j$2.Hidden && !!t2.current) {
        if (a2 && v2 !== "visible") {
          _("visible");
          return;
        }
        return u$3(v2, { ["hidden"]: () => V2(t2), ["visible"]: () => N2(t2) });
      }
    }, [v2, t2, N2, V2, a2, f2]);
    let oe2 = s$4({ enter: x(E), enterFrom: x(S2), enterTo: x(u2), entered: x(p2), leave: x(d2), leaveFrom: x(h2), leaveTo: x(l2) }), L2 = Se({ beforeEnter: n2, afterEnter: m2, beforeLeave: D2, afterLeave: b2 }), U2 = a$2();
    React2.useEffect(() => {
      if (U2 && v2 === "visible" && t2.current === null)
        throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
    }, [t2, v2, U2]);
    let k2 = ie && !P, se2 = (() => !U2 || k2 || j2.current === a2 ? "idle" : a2 ? "enter" : "leave")(), le2 = o$2((C2) => u$3(C2, { enter: () => L2.current.beforeEnter(), leave: () => L2.current.beforeLeave(), idle: () => {
    } })), ae = o$2((C2) => u$3(C2, { enter: () => L2.current.afterEnter(), leave: () => L2.current.afterLeave(), idle: () => {
    } })), w2 = ee(() => {
      _("hidden"), V2(t2);
    }, z2);
    I$1({ container: t2, classes: oe2, direction: se2, onStart: s$4((C2) => {
      w2.onStart(t2, C2, le2);
    }), onStop: s$4((C2) => {
      w2.onStop(t2, C2, ae), C2 === "leave" && !I(w2) && (_("hidden"), V2(t2));
    }) }), React2.useEffect(() => {
      !k2 || (f2 === j$2.Hidden ? j2.current = null : j2.current = a2);
    }, [a2, k2, v2]);
    let ue = i2, de2 = { ref: o2 };
    return React__default["default"].createElement(M.Provider, { value: w2 }, React__default["default"].createElement(C$1, { value: u$3(v2, { ["visible"]: p$3.Open, ["hidden"]: p$3.Closed }) }, $({ ourProps: de2, theirProps: ue, defaultTag: xe, features: ne, visible: v2 === "visible", name: "Transition.Child" })));
  }), q$1 = C$2(function(e2, s$12) {
    let { show: n2, appear: m2 = false, unmount: D2, ...b2 } = e2, E = React2.useRef(null), S2 = y(E, s$12);
    a$2();
    let u2 = s();
    if (n2 === void 0 && u2 !== null && (n2 = u$3(u2, { [p$3.Open]: true, [p$3.Closed]: false })), ![true, false].includes(n2))
      throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
    let [p2, d2] = React2.useState(n2 ? "visible" : "hidden"), h2 = ee(() => {
      d2("hidden");
    }), [l2, i2] = React2.useState(true), t2 = React2.useRef([n2]);
    s$5(() => {
      l2 !== false && t2.current[t2.current.length - 1] !== n2 && (t2.current.push(n2), i2(false));
    }, [t2, n2]);
    let o2 = React2.useMemo(() => ({ show: n2, appear: m2, initial: l2 }), [n2, m2, l2]);
    React2.useEffect(() => {
      if (n2)
        d2("visible");
      else if (!I(h2))
        d2("hidden");
      else {
        let a2 = E.current;
        if (!a2)
          return;
        let P = a2.getBoundingClientRect();
        P.x === 0 && P.y === 0 && P.width === 0 && P.height === 0 && d2("hidden");
      }
    }, [n2, h2]);
    let f2 = { unmount: D2 };
    return React__default["default"].createElement(M.Provider, { value: h2 }, React__default["default"].createElement(F.Provider, { value: o2 }, $({ ourProps: { ...f2, as: React2.Fragment, children: React__default["default"].createElement(re, { ref: S2, ...f2, ...b2 }) }, theirProps: {}, defaultTag: React2.Fragment, features: ne, visible: p2 === "visible", name: "Transition" })));
  }), Pe = C$2(function(e2, s$12) {
    let n2 = React2.useContext(F) !== null, m2 = s() !== null;
    return React__default["default"].createElement(React__default["default"].Fragment, null, !n2 && m2 ? React__default["default"].createElement(q$1, { ref: s$12, ...e2 }) : React__default["default"].createElement(re, { ref: s$12, ...e2 }));
  }), We = Object.assign(q$1, { Child: Pe, Root: q$1 });
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /*
  object-assign
  (c) Sindre Sorhus
  @license MIT
  */
  var getOwnPropertySymbols = Object.getOwnPropertySymbols;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var propIsEnumerable = Object.prototype.propertyIsEnumerable;
  function toObject(val) {
    if (val === null || val === void 0) {
      throw new TypeError("Object.assign cannot be called with null or undefined");
    }
    return Object(val);
  }
  function shouldUseNative() {
    try {
      if (!Object.assign) {
        return false;
      }
      var test1 = new String("abc");
      test1[5] = "de";
      if (Object.getOwnPropertyNames(test1)[0] === "5") {
        return false;
      }
      var test2 = {};
      for (var i2 = 0; i2 < 10; i2++) {
        test2["_" + String.fromCharCode(i2)] = i2;
      }
      var order2 = Object.getOwnPropertyNames(test2).map(function(n2) {
        return test2[n2];
      });
      if (order2.join("") !== "0123456789") {
        return false;
      }
      var test3 = {};
      "abcdefghijklmnopqrst".split("").forEach(function(letter) {
        test3[letter] = letter;
      });
      if (Object.keys(Object.assign({}, test3)).join("") !== "abcdefghijklmnopqrst") {
        return false;
      }
      return true;
    } catch (err) {
      return false;
    }
  }
  shouldUseNative() ? Object.assign : function(target, source) {
    var from;
    var to2 = toObject(target);
    var symbols;
    for (var s2 = 1; s2 < arguments.length; s2++) {
      from = Object(arguments[s2]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to2[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i2 = 0; i2 < symbols.length; i2++) {
          if (propIsEnumerable.call(from, symbols[i2])) {
            to2[symbols[i2]] = from[symbols[i2]];
          }
        }
      }
    }
    return to2;
  };
  /** @license React v17.0.2
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = React__default["default"], g = 60103;
  reactJsxRuntime_production_min.Fragment = 60107;
  if ("function" === typeof Symbol && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    reactJsxRuntime_production_min.Fragment = h("react.fragment");
  }
  var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
  function q(c2, a2, k2) {
    var b2, d2 = {}, e2 = null, l2 = null;
    void 0 !== k2 && (e2 = "" + k2);
    void 0 !== a2.key && (e2 = "" + a2.key);
    void 0 !== a2.ref && (l2 = a2.ref);
    for (b2 in a2)
      n.call(a2, b2) && !p.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
    if (c2 && c2.defaultProps)
      for (b2 in a2 = c2.defaultProps, a2)
        void 0 === d2[b2] && (d2[b2] = a2[b2]);
    return { $$typeof: g, type: c2, key: e2, ref: l2, props: d2, _owner: m.current };
  }
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  const jsx = jsxRuntime.exports.jsx;
  const jsxs = jsxRuntime.exports.jsxs;
  const Fragment = jsxRuntime.exports.Fragment;
  function ToggleSwitch(props) {
    const {
      className,
      checked,
      onChange,
      labelLeft,
      labelRight
    } = props;
    return /* @__PURE__ */ jsxs("div", {
      className: `${className} flex flex-row`,
      children: [/* @__PURE__ */ jsx("div", {
        className: "w-1/4",
        children: labelLeft
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/2",
        children: /* @__PURE__ */ jsx(be$2, {
          checked,
          onChange,
          className: `${checked ? "bg-blue-600" : "bg-gray-200"} relative inline-flex items-center h-6 rounded-full w-11`,
          children: /* @__PURE__ */ jsx("span", {
            className: `${checked ? "translate-x-6" : "translate-x-1"} inline-block w-4 h-4 transform bg-white rounded-full`
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/4",
        children: labelRight
      })]
    });
  }
  function CheckIcon(props, svgRef) {
    return /* @__PURE__ */ React__namespace.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      ref: svgRef
    }, props), /* @__PURE__ */ React__namespace.createElement("path", {
      fillRule: "evenodd",
      d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
      clipRule: "evenodd"
    }));
  }
  const ForwardRef$2 = React__namespace.forwardRef(CheckIcon);
  var CheckIcon$1 = ForwardRef$2;
  function ChevronUpIcon(props, svgRef) {
    return /* @__PURE__ */ React__namespace.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      ref: svgRef
    }, props), /* @__PURE__ */ React__namespace.createElement("path", {
      fillRule: "evenodd",
      d: "M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z",
      clipRule: "evenodd"
    }));
  }
  const ForwardRef$1 = React__namespace.forwardRef(ChevronUpIcon);
  var ChevronUpIcon$1 = ForwardRef$1;
  function SelectorIcon(props, svgRef) {
    return /* @__PURE__ */ React__namespace.createElement("svg", Object.assign({
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 20 20",
      fill: "currentColor",
      "aria-hidden": "true",
      ref: svgRef
    }, props), /* @__PURE__ */ React__namespace.createElement("path", {
      fillRule: "evenodd",
      d: "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z",
      clipRule: "evenodd"
    }));
  }
  const ForwardRef = React__namespace.forwardRef(SelectorIcon);
  var SelectorIcon$1 = ForwardRef;
  function ListboxSelect(props) {
    const {
      selected,
      setSelected,
      optionList,
      show
    } = props;
    return /* @__PURE__ */ jsx(pt, {
      value: selected,
      onChange: setSelected,
      children: /* @__PURE__ */ jsxs("div", {
        className: "relative mt-1",
        children: [/* @__PURE__ */ jsxs(pt.Button, {
          className: "relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm",
          children: [/* @__PURE__ */ jsx("span", {
            className: "block truncate text-gray-900",
            children: show(selected)
          }), /* @__PURE__ */ jsx("span", {
            className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",
            children: /* @__PURE__ */ jsx(SelectorIcon$1, {
              className: "w-5 h-5 text-gray-400",
              "aria-hidden": "true"
            })
          })]
        }), /* @__PURE__ */ jsx(We, {
          as: React2.Fragment,
          leave: "transition ease-in duration-100",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx(pt.Options, {
            className: "absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
            children: optionList.map((person, personIdx) => /* @__PURE__ */ jsx(pt.Option, {
              className: ({
                active
              }) => `cursor-default select-none relative py-2 pl-10 pr-4 ${active ? "text-amber-900 bg-amber-100" : "text-gray-900"}`,
              value: person,
              children: ({
                selected: selected2
              }) => /* @__PURE__ */ jsxs(Fragment, {
                children: [/* @__PURE__ */ jsx("span", {
                  className: `block truncate ${selected2 ? "font-medium" : "font-normal"}`,
                  children: show(person)
                }), selected2 ? /* @__PURE__ */ jsx("span", {
                  className: "absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600",
                  children: /* @__PURE__ */ jsx(CheckIcon$1, {
                    className: "w-5 h-5",
                    "aria-hidden": "true"
                  })
                }) : null]
              })
            }, personIdx))
          })
        })]
      })
    });
  }
  function CharacterGoalTab(props) {
    const {
      showText,
      batchUpdateCharacter: batchUpdateCharacter2
    } = props;
    const [selectAllRoles, setSelectAllRoles] = React2.useState(() => true);
    const optionList = characterStatusList.slice(0).reverse();
    const [characterLevelGoal, setCharacterLevelGoal] = React2.useState(() => optionList[0]);
    const batchSetCharacterGoalLevel = () => {
      console.log(`\u6279\u91CF\u8BBE\u7F6E${showText}\u76EE\u6807\u7B49\u7EA7`);
      console.log(selectAllRoles);
      console.log(characterLevelGoal);
      batchUpdateCharacter2(!selectAllRoles, characterLevelGoal);
      alert(`${showText}\u76EE\u6807\u7B49\u7EA7\u8BBE\u7F6E\u5B8C\u6BD5`);
    };
    return /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex pt-4",
        children: /* @__PURE__ */ jsx(ToggleSwitch, {
          className: "w-full",
          checked: selectAllRoles,
          onChange: setSelectAllRoles,
          labelLeft: `\u5168\u90E8${showText}`,
          labelRight: `\u4EC5\u6FC0\u6D3B${showText}`
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex pt-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "w-1/2 text-white-900",
          children: [showText, "\u76EE\u6807\u7B49\u7EA7:"]
        }), /* @__PURE__ */ jsx("div", {
          className: "w-1/2",
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: characterLevelGoal,
            setSelected: setCharacterLevelGoal,
            optionList,
            show: (characterStatus) => `${characterStatus.text.replace("A", "\u7834")}`
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex pt-2",
        children: /* @__PURE__ */ jsx("div", {
          className: "w-full",
          children: /* @__PURE__ */ jsxs("button", {
            className: "text-white bg-blue-500 px-4 py-2",
            onClick: batchSetCharacterGoalLevel,
            children: ["\u6279\u91CF\u8BBE\u7F6E", showText, "\u76EE\u6807\u7B49\u7EA7"]
          })
        })
      })]
    });
  }
  function TalentGoalTab() {
    const [selectAllRoles, setSelectAllRoles] = React2.useState(() => true);
    const [talentGoalLevel, setTalentGoalLevel] = React2.useState({
      normal: 1,
      skill: 6,
      burst: 6
    });
    const talentLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reverse();
    const batchSetCharacterTalentLevel = () => {
      console.log("\u6279\u91CF\u8BBE\u7F6E\u89D2\u8272\u76EE\u6807\u5929\u8D4B");
      console.log(talentGoalLevel);
      const {
        normal,
        skill,
        burst
      } = talentGoalLevel;
      console.log(selectAllRoles);
      batchUpdateTalent(!selectAllRoles, normal, skill, burst);
      alert("\u89D2\u8272\u76EE\u6807\u5929\u8D4B\u8BBE\u7F6E\u5B8C\u6BD5");
    };
    return /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex pt-4",
        children: /* @__PURE__ */ jsx(ToggleSwitch, {
          className: "w-full",
          checked: selectAllRoles,
          onChange: setSelectAllRoles,
          labelLeft: "\u5168\u90E8\u89D2\u8272",
          labelRight: "\u4EC5\u6FC0\u6D3B\u89D2\u8272"
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-rows-2 grid-flow-col gap-2",
        children: [/* @__PURE__ */ jsx("div", {
          className: "mt-10",
          children: "\u666E\u901A\u653B\u51FB"
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel.normal,
            setSelected: (num) => setTalentGoalLevel({
              ...talentGoalLevel,
              normal: num
            }),
            optionList: talentLevels,
            show: (num) => `${num}`
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10",
          children: "\u5143\u7D20\u6218\u6280"
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel.skill,
            setSelected: (num) => setTalentGoalLevel({
              ...talentGoalLevel,
              skill: num
            }),
            optionList: talentLevels,
            show: (num) => `${num}`
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10",
          children: "\u5143\u7D20\u7206\u53D1"
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel.burst,
            setSelected: (num) => setTalentGoalLevel({
              ...talentGoalLevel,
              burst: num
            }),
            optionList: talentLevels,
            show: (num) => `${num}`
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex pt-2",
        children: /* @__PURE__ */ jsx("div", {
          className: "w-full",
          children: /* @__PURE__ */ jsx("button", {
            className: "text-white bg-blue-500 px-4 py-2",
            onClick: batchSetCharacterTalentLevel,
            children: "\u6279\u91CF\u8BBE\u7F6E\u89D2\u8272\u76EE\u6807\u5929\u8D4B"
          })
        })
      })]
    });
  }
  var axios$2 = { exports: {} };
  var bind$2 = function bind2(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i2 = 0; i2 < args.length; i2++) {
        args[i2] = arguments[i2];
      }
      return fn.apply(thisArg, args);
    };
  };
  var bind$1 = bind$2;
  var toString = Object.prototype.toString;
  var kindOf = function(cache) {
    return function(thing) {
      var str = toString.call(thing);
      return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    };
  }(/* @__PURE__ */ Object.create(null));
  function kindOfTest(type) {
    type = type.toLowerCase();
    return function isKindOf(thing) {
      return kindOf(thing) === type;
    };
  }
  function isArray(val) {
    return Array.isArray(val);
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  var isArrayBuffer = kindOfTest("ArrayBuffer");
  function isArrayBufferView(val) {
    var result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
      result = ArrayBuffer.isView(val);
    } else {
      result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
  }
  function isString(val) {
    return typeof val === "string";
  }
  function isNumber(val) {
    return typeof val === "number";
  }
  function isObject(val) {
    return val !== null && typeof val === "object";
  }
  function isPlainObject(val) {
    if (kindOf(val) !== "object") {
      return false;
    }
    var prototype2 = Object.getPrototypeOf(val);
    return prototype2 === null || prototype2 === Object.prototype;
  }
  var isDate = kindOfTest("Date");
  var isFile = kindOfTest("File");
  var isBlob = kindOfTest("Blob");
  var isFileList = kindOfTest("FileList");
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isFormData(thing) {
    var pattern = "[object FormData]";
    return thing && (typeof FormData === "function" && thing instanceof FormData || toString.call(thing) === pattern || isFunction(thing.toString) && thing.toString() === pattern);
  }
  var isURLSearchParams = kindOfTest("URLSearchParams");
  function trim(str) {
    return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, "");
  }
  function isStandardBrowserEnv() {
    if (typeof navigator !== "undefined" && (navigator.product === "ReactNative" || navigator.product === "NativeScript" || navigator.product === "NS")) {
      return false;
    }
    return typeof window !== "undefined" && typeof document !== "undefined";
  }
  function forEach(obj, fn) {
    if (obj === null || typeof obj === "undefined") {
      return;
    }
    if (typeof obj !== "object") {
      obj = [obj];
    }
    if (isArray(obj)) {
      for (var i2 = 0, l2 = obj.length; i2 < l2; i2++) {
        fn.call(null, obj[i2], i2, obj);
      }
    } else {
      for (var key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          fn.call(null, obj[key], key, obj);
        }
      }
    }
  }
  function merge() {
    var result = {};
    function assignValue(val, key) {
      if (isPlainObject(result[key]) && isPlainObject(val)) {
        result[key] = merge(result[key], val);
      } else if (isPlainObject(val)) {
        result[key] = merge({}, val);
      } else if (isArray(val)) {
        result[key] = val.slice();
      } else {
        result[key] = val;
      }
    }
    for (var i2 = 0, l2 = arguments.length; i2 < l2; i2++) {
      forEach(arguments[i2], assignValue);
    }
    return result;
  }
  function extend(a2, b2, thisArg) {
    forEach(b2, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a2[key] = bind$1(val, thisArg);
      } else {
        a2[key] = val;
      }
    });
    return a2;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  function inherits(constructor, superConstructor, props, descriptors2) {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    props && Object.assign(constructor.prototype, props);
  }
  function toFlatObject(sourceObj, destObj, filter) {
    var props;
    var i2;
    var prop;
    var merged = {};
    destObj = destObj || {};
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i2 = props.length;
      while (i2-- > 0) {
        prop = props[i2];
        if (!merged[prop]) {
          destObj[prop] = sourceObj[prop];
          merged[prop] = true;
        }
      }
      sourceObj = Object.getPrototypeOf(sourceObj);
    } while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
  }
  function endsWith(str, searchString, position) {
    str = String(str);
    if (position === void 0 || position > str.length) {
      position = str.length;
    }
    position -= searchString.length;
    var lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  }
  function toArray(thing) {
    if (!thing)
      return null;
    var i2 = thing.length;
    if (isUndefined(i2))
      return null;
    var arr = new Array(i2);
    while (i2-- > 0) {
      arr[i2] = thing[i2];
    }
    return arr;
  }
  var isTypedArray = function(TypedArray) {
    return function(thing) {
      return TypedArray && thing instanceof TypedArray;
    };
  }(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
  var utils$h = {
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isFunction,
    isStream,
    isURLSearchParams,
    isStandardBrowserEnv,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    isTypedArray,
    isFileList
  };
  var utils$g = utils$h;
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  var buildURL$2 = function buildURL2(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$g.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils$g.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils$g.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils$g.forEach(val, function parseValue(v2) {
          if (utils$g.isDate(v2)) {
            v2 = v2.toISOString();
          } else if (utils$g.isObject(v2)) {
            v2 = JSON.stringify(v2);
          }
          parts.push(encode(key) + "=" + encode(v2));
        });
      });
      serializedParams = parts.join("&");
    }
    if (serializedParams) {
      var hashmarkIndex = url.indexOf("#");
      if (hashmarkIndex !== -1) {
        url = url.slice(0, hashmarkIndex);
      }
      url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
  };
  var utils$f = utils$h;
  function InterceptorManager$1() {
    this.handlers = [];
  }
  InterceptorManager$1.prototype.use = function use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  };
  InterceptorManager$1.prototype.eject = function eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  };
  InterceptorManager$1.prototype.forEach = function forEach2(fn) {
    utils$f.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  };
  var InterceptorManager_1 = InterceptorManager$1;
  var utils$e = utils$h;
  var normalizeHeaderName$1 = function normalizeHeaderName2(headers, normalizedName) {
    utils$e.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };
  var utils$d = utils$h;
  function AxiosError$5(message, code, config, request, response) {
    Error.call(this);
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }
  utils$d.inherits(AxiosError$5, Error, {
    toJSON: function toJSON() {
      return {
        message: this.message,
        name: this.name,
        description: this.description,
        number: this.number,
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        config: this.config,
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });
  var prototype = AxiosError$5.prototype;
  var descriptors = {};
  [
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED"
  ].forEach(function(code) {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$5, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError$5.from = function(error, code, config, request, response, customProps) {
    var axiosError = Object.create(prototype);
    utils$d.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    });
    AxiosError$5.call(axiosError, error.message, code, config, request, response);
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_1 = AxiosError$5;
  var transitional = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  var utils$c = utils$h;
  function toFormData$1(obj, formData) {
    formData = formData || new FormData();
    var stack = [];
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils$c.isDate(value)) {
        return value.toISOString();
      }
      if (utils$c.isArrayBuffer(value) || utils$c.isTypedArray(value)) {
        return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function build(data2, parentKey) {
      if (utils$c.isPlainObject(data2) || utils$c.isArray(data2)) {
        if (stack.indexOf(data2) !== -1) {
          throw Error("Circular reference detected in " + parentKey);
        }
        stack.push(data2);
        utils$c.forEach(data2, function each(value, key) {
          if (utils$c.isUndefined(value))
            return;
          var fullKey = parentKey ? parentKey + "." + key : key;
          var arr;
          if (value && !parentKey && typeof value === "object") {
            if (utils$c.endsWith(key, "{}")) {
              value = JSON.stringify(value);
            } else if (utils$c.endsWith(key, "[]") && (arr = utils$c.toArray(value))) {
              arr.forEach(function(el) {
                !utils$c.isUndefined(el) && formData.append(fullKey, convertValue(el));
              });
              return;
            }
          }
          build(value, fullKey);
        });
        stack.pop();
      } else {
        formData.append(parentKey, convertValue(data2));
      }
    }
    build(obj);
    return formData;
  }
  var toFormData_1 = toFormData$1;
  var AxiosError$4 = AxiosError_1;
  var settle$1 = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$4(
        "Request failed with status code " + response.status,
        [AxiosError$4.ERR_BAD_REQUEST, AxiosError$4.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  };
  var utils$b = utils$h;
  var cookies$1 = utils$b.isStandardBrowserEnv() ? function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils$b.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils$b.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils$b.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        var match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }() : function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove() {
      }
    };
  }();
  var isAbsoluteURL$1 = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  };
  var combineURLs$1 = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  var isAbsoluteURL = isAbsoluteURL$1;
  var combineURLs = combineURLs$1;
  var buildFullPath$2 = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };
  var utils$a = utils$h;
  var ignoreDuplicateOf = [
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
  ];
  var parseHeaders$1 = function parseHeaders2(headers) {
    var parsed = {};
    var key;
    var val;
    var i2;
    if (!headers) {
      return parsed;
    }
    utils$a.forEach(headers.split("\n"), function parser(line) {
      i2 = line.indexOf(":");
      key = utils$a.trim(line.substr(0, i2)).toLowerCase();
      val = utils$a.trim(line.substr(i2 + 1));
      if (key) {
        if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
          return;
        }
        if (key === "set-cookie") {
          parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
        } else {
          parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
      }
    });
    return parsed;
  };
  var utils$9 = utils$h;
  var isURLSameOrigin$1 = utils$9.isStandardBrowserEnv() ? function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement("a");
    var originURL;
    function resolveURL(url) {
      var href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      var parsed = utils$9.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }() : function nonStandardBrowserEnv() {
    return function isURLSameOrigin2() {
      return true;
    };
  }();
  var AxiosError$3 = AxiosError_1;
  var utils$8 = utils$h;
  function CanceledError$3(message) {
    AxiosError$3.call(this, message == null ? "canceled" : message, AxiosError$3.ERR_CANCELED);
    this.name = "CanceledError";
  }
  utils$8.inherits(CanceledError$3, AxiosError$3, {
    __CANCEL__: true
  });
  var CanceledError_1 = CanceledError$3;
  var parseProtocol$1 = function parseProtocol2(url) {
    var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
  };
  var utils$7 = utils$h;
  var settle = settle$1;
  var cookies = cookies$1;
  var buildURL$1 = buildURL$2;
  var buildFullPath$1 = buildFullPath$2;
  var parseHeaders = parseHeaders$1;
  var isURLSameOrigin = isURLSameOrigin$1;
  var transitionalDefaults$1 = transitional;
  var AxiosError$2 = AxiosError_1;
  var CanceledError$2 = CanceledError_1;
  var parseProtocol = parseProtocol$1;
  var xhr = function xhrAdapter2(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
      var requestData = config.data;
      var requestHeaders = config.headers;
      var responseType = config.responseType;
      var onCanceled;
      function done() {
        if (config.cancelToken) {
          config.cancelToken.unsubscribe(onCanceled);
        }
        if (config.signal) {
          config.signal.removeEventListener("abort", onCanceled);
        }
      }
      if (utils$7.isFormData(requestData) && utils$7.isStandardBrowserEnv()) {
        delete requestHeaders["Content-Type"];
      }
      var request = new XMLHttpRequest();
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath$1(config.baseURL, config.url);
      request.open(config.method.toUpperCase(), buildURL$1(fullPath, config.params, config.paramsSerializer), true);
      request.timeout = config.timeout;
      function onloadend() {
        if (!request) {
          return;
        }
        var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders(request.getAllResponseHeaders()) : null;
        var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
        var response = {
          data: responseData,
          status: request.status,
          statusText: request.statusText,
          headers: responseHeaders,
          config,
          request
        };
        settle(function _resolve(value) {
          resolve(value);
          done();
        }, function _reject(err) {
          reject(err);
          done();
        }, response);
        request = null;
      }
      if ("onloadend" in request) {
        request.onloadend = onloadend;
      } else {
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
            return;
          }
          setTimeout(onloadend);
        };
      }
      request.onabort = function handleAbort() {
        if (!request) {
          return;
        }
        reject(new AxiosError$2("Request aborted", AxiosError$2.ECONNABORTED, config, request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(new AxiosError$2("Network Error", AxiosError$2.ERR_NETWORK, config, request, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
        var transitional2 = config.transitional || transitionalDefaults$1;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(new AxiosError$2(
          timeoutErrorMessage,
          transitional2.clarifyTimeoutError ? AxiosError$2.ETIMEDOUT : AxiosError$2.ECONNABORTED,
          config,
          request
        ));
        request = null;
      };
      if (utils$7.isStandardBrowserEnv()) {
        var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ? cookies.read(config.xsrfCookieName) : void 0;
        if (xsrfValue) {
          requestHeaders[config.xsrfHeaderName] = xsrfValue;
        }
      }
      if ("setRequestHeader" in request) {
        utils$7.forEach(requestHeaders, function setRequestHeader(val, key) {
          if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
            delete requestHeaders[key];
          } else {
            request.setRequestHeader(key, val);
          }
        });
      }
      if (!utils$7.isUndefined(config.withCredentials)) {
        request.withCredentials = !!config.withCredentials;
      }
      if (responseType && responseType !== "json") {
        request.responseType = config.responseType;
      }
      if (typeof config.onDownloadProgress === "function") {
        request.addEventListener("progress", config.onDownloadProgress);
      }
      if (typeof config.onUploadProgress === "function" && request.upload) {
        request.upload.addEventListener("progress", config.onUploadProgress);
      }
      if (config.cancelToken || config.signal) {
        onCanceled = function(cancel) {
          if (!request) {
            return;
          }
          reject(!cancel || cancel && cancel.type ? new CanceledError$2() : cancel);
          request.abort();
          request = null;
        };
        config.cancelToken && config.cancelToken.subscribe(onCanceled);
        if (config.signal) {
          config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
        }
      }
      if (!requestData) {
        requestData = null;
      }
      var protocol = parseProtocol(fullPath);
      if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
        reject(new AxiosError$2("Unsupported protocol " + protocol + ":", AxiosError$2.ERR_BAD_REQUEST, config));
        return;
      }
      request.send(requestData);
    });
  };
  var _null = null;
  var utils$6 = utils$h;
  var normalizeHeaderName = normalizeHeaderName$1;
  var AxiosError$1 = AxiosError_1;
  var transitionalDefaults = transitional;
  var toFormData = toFormData_1;
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers, value) {
    if (!utils$6.isUndefined(headers) && utils$6.isUndefined(headers["Content-Type"])) {
      headers["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = xhr;
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = xhr;
    }
    return adapter;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$6.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$6.trim(rawValue);
      } catch (e2) {
        if (e2.name !== "SyntaxError") {
          throw e2;
        }
      }
    }
    return (encoder || JSON.stringify)(rawValue);
  }
  var defaults$3 = {
    transitional: transitionalDefaults,
    adapter: getDefaultAdapter(),
    transformRequest: [function transformRequest(data2, headers) {
      normalizeHeaderName(headers, "Accept");
      normalizeHeaderName(headers, "Content-Type");
      if (utils$6.isFormData(data2) || utils$6.isArrayBuffer(data2) || utils$6.isBuffer(data2) || utils$6.isStream(data2) || utils$6.isFile(data2) || utils$6.isBlob(data2)) {
        return data2;
      }
      if (utils$6.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils$6.isURLSearchParams(data2)) {
        setContentTypeIfUnset(headers, "application/x-www-form-urlencoded;charset=utf-8");
        return data2.toString();
      }
      var isObjectPayload = utils$6.isObject(data2);
      var contentType = headers && headers["Content-Type"];
      var isFileList2;
      if ((isFileList2 = utils$6.isFileList(data2)) || isObjectPayload && contentType === "multipart/form-data") {
        var _FormData = this.env && this.env.FormData;
        return toFormData(isFileList2 ? { "files[]": data2 } : data2, _FormData && new _FormData());
      } else if (isObjectPayload || contentType === "application/json") {
        setContentTypeIfUnset(headers, "application/json");
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      var transitional2 = this.transitional || defaults$3.transitional;
      var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
      if (strictJSONParsing || forcedJSONParsing && utils$6.isString(data2) && data2.length) {
        try {
          return JSON.parse(data2);
        } catch (e2) {
          if (strictJSONParsing) {
            if (e2.name === "SyntaxError") {
              throw AxiosError$1.from(e2, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e2;
          }
        }
      }
      return data2;
    }],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: _null
    },
    validateStatus: function validateStatus(status) {
      return status >= 200 && status < 300;
    },
    headers: {
      common: {
        "Accept": "application/json, text/plain, */*"
      }
    }
  };
  utils$6.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
  });
  utils$6.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$6.merge(DEFAULT_CONTENT_TYPE);
  });
  var defaults_1 = defaults$3;
  var utils$5 = utils$h;
  var defaults$2 = defaults_1;
  var transformData$1 = function transformData2(data2, headers, fns) {
    var context = this || defaults$2;
    utils$5.forEach(fns, function transform(fn) {
      data2 = fn.call(context, data2, headers);
    });
    return data2;
  };
  var isCancel$1 = function isCancel2(value) {
    return !!(value && value.__CANCEL__);
  };
  var utils$4 = utils$h;
  var transformData = transformData$1;
  var isCancel = isCancel$1;
  var defaults$1 = defaults_1;
  var CanceledError$1 = CanceledError_1;
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError$1();
    }
  }
  var dispatchRequest$1 = function dispatchRequest2(config) {
    throwIfCancellationRequested(config);
    config.headers = config.headers || {};
    config.data = transformData.call(
      config,
      config.data,
      config.headers,
      config.transformRequest
    );
    config.headers = utils$4.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );
    utils$4.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      function cleanHeaderConfig(method) {
        delete config.headers[method];
      }
    );
    var adapter = config.adapter || defaults$1.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(
        config,
        response.data,
        response.headers,
        config.transformResponse
      );
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(
            config,
            reason.response.data,
            reason.response.headers,
            config.transformResponse
          );
        }
      }
      return Promise.reject(reason);
    });
  };
  var utils$3 = utils$h;
  var mergeConfig$2 = function mergeConfig2(config1, config2) {
    config2 = config2 || {};
    var config = {};
    function getMergedValue(target, source) {
      if (utils$3.isPlainObject(target) && utils$3.isPlainObject(source)) {
        return utils$3.merge(target, source);
      } else if (utils$3.isPlainObject(source)) {
        return utils$3.merge({}, source);
      } else if (utils$3.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils$3.isUndefined(config2[prop])) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$3.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function valueFromConfig2(prop) {
      if (!utils$3.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      }
    }
    function defaultToConfig2(prop) {
      if (!utils$3.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      } else if (!utils$3.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function mergeDirectKeys(prop) {
      if (prop in config2) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (prop in config1) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    var mergeMap = {
      "url": valueFromConfig2,
      "method": valueFromConfig2,
      "data": valueFromConfig2,
      "baseURL": defaultToConfig2,
      "transformRequest": defaultToConfig2,
      "transformResponse": defaultToConfig2,
      "paramsSerializer": defaultToConfig2,
      "timeout": defaultToConfig2,
      "timeoutMessage": defaultToConfig2,
      "withCredentials": defaultToConfig2,
      "adapter": defaultToConfig2,
      "responseType": defaultToConfig2,
      "xsrfCookieName": defaultToConfig2,
      "xsrfHeaderName": defaultToConfig2,
      "onUploadProgress": defaultToConfig2,
      "onDownloadProgress": defaultToConfig2,
      "decompress": defaultToConfig2,
      "maxContentLength": defaultToConfig2,
      "maxBodyLength": defaultToConfig2,
      "beforeRedirect": defaultToConfig2,
      "transport": defaultToConfig2,
      "httpAgent": defaultToConfig2,
      "httpsAgent": defaultToConfig2,
      "cancelToken": defaultToConfig2,
      "socketPath": defaultToConfig2,
      "responseEncoding": defaultToConfig2,
      "validateStatus": mergeDirectKeys
    };
    utils$3.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
      var merge2 = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge2(prop);
      utils$3.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  };
  var data = {
    "version": "0.27.2"
  };
  var VERSION = data.version;
  var AxiosError = AxiosError_1;
  var validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i2) {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i2 < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators$1.transitional = function transitional2(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return function(value, opt, opts) {
      if (validator2 === false) {
        throw new AxiosError(
          formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
          AxiosError.ERR_DEPRECATED
        );
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(
          formatMessage(
            opt,
            " has been deprecated since v" + version + " and will be removed in the near future"
          )
        );
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
    }
    var keys = Object.keys(options);
    var i2 = keys.length;
    while (i2-- > 0) {
      var opt = keys[i2];
      var validator2 = schema[opt];
      if (validator2) {
        var value = options[opt];
        var result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
      }
    }
  }
  var validator$1 = {
    assertOptions,
    validators: validators$1
  };
  var utils$2 = utils$h;
  var buildURL = buildURL$2;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;
  var buildFullPath = buildFullPath$2;
  var validator = validator$1;
  var validators = validator.validators;
  function Axios$1(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager(),
      response: new InterceptorManager()
    };
  }
  Axios$1.prototype.request = function request(configOrUrl, config) {
    if (typeof configOrUrl === "string") {
      config = config || {};
      config.url = configOrUrl;
    } else {
      config = configOrUrl || {};
    }
    config = mergeConfig$1(this.defaults, config);
    if (config.method) {
      config.method = config.method.toLowerCase();
    } else if (this.defaults.method) {
      config.method = this.defaults.method.toLowerCase();
    } else {
      config.method = "get";
    }
    var transitional2 = config.transitional;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    var requestInterceptorChain = [];
    var synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    var responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    var promise;
    if (!synchronousRequestInterceptors) {
      var chain = [dispatchRequest, void 0];
      Array.prototype.unshift.apply(chain, requestInterceptorChain);
      chain = chain.concat(responseInterceptorChain);
      promise = Promise.resolve(config);
      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }
      return promise;
    }
    var newConfig = config;
    while (requestInterceptorChain.length) {
      var onFulfilled = requestInterceptorChain.shift();
      var onRejected = requestInterceptorChain.shift();
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error) {
        onRejected(error);
        break;
      }
    }
    try {
      promise = dispatchRequest(newConfig);
    } catch (error) {
      return Promise.reject(error);
    }
    while (responseInterceptorChain.length) {
      promise = promise.then(responseInterceptorChain.shift(), responseInterceptorChain.shift());
    }
    return promise;
  };
  Axios$1.prototype.getUri = function getUri(config) {
    config = mergeConfig$1(this.defaults, config);
    var fullPath = buildFullPath(config.baseURL, config.url);
    return buildURL(fullPath, config.params, config.paramsSerializer);
  };
  utils$2.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$2.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    function generateHTTPMethod(isForm) {
      return function httpMethod(url, data2, config) {
        return this.request(mergeConfig$1(config || {}, {
          method,
          headers: isForm ? {
            "Content-Type": "multipart/form-data"
          } : {},
          url,
          data: data2
        }));
      };
    }
    Axios$1.prototype[method] = generateHTTPMethod();
    Axios$1.prototype[method + "Form"] = generateHTTPMethod(true);
  });
  var Axios_1 = Axios$1;
  var CanceledError = CanceledError_1;
  function CancelToken(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    var resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve) {
      resolvePromise = resolve;
    });
    var token = this;
    this.promise.then(function(cancel) {
      if (!token._listeners)
        return;
      var i2;
      var l2 = token._listeners.length;
      for (i2 = 0; i2 < l2; i2++) {
        token._listeners[i2](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = function(onfulfilled) {
      var _resolve;
      var promise = new Promise(function(resolve) {
        token.subscribe(resolve);
        _resolve = resolve;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message);
      resolvePromise(token.reason);
    });
  }
  CancelToken.prototype.throwIfRequested = function throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  };
  CancelToken.prototype.subscribe = function subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  };
  CancelToken.prototype.unsubscribe = function unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    var index = this._listeners.indexOf(listener);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
  };
  CancelToken.source = function source() {
    var cancel;
    var token = new CancelToken(function executor(c2) {
      cancel = c2;
    });
    return {
      token,
      cancel
    };
  };
  var CancelToken_1 = CancelToken;
  var spread = function spread2(callback) {
    return function wrap(arr) {
      return callback.apply(null, arr);
    };
  };
  var utils$1 = utils$h;
  var isAxiosError = function isAxiosError2(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  };
  var utils = utils$h;
  var bind = bind$2;
  var Axios = Axios_1;
  var mergeConfig = mergeConfig$2;
  var defaults = defaults_1;
  function createInstance(defaultConfig) {
    var context = new Axios(defaultConfig);
    var instance = bind(Axios.prototype.request, context);
    utils.extend(instance, Axios.prototype, context);
    utils.extend(instance, context);
    instance.create = function create(instanceConfig) {
      return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
  }
  var axios$1 = createInstance(defaults);
  axios$1.Axios = Axios;
  axios$1.CanceledError = CanceledError_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel$1;
  axios$1.VERSION = data.version;
  axios$1.toFormData = toFormData_1;
  axios$1.AxiosError = AxiosError_1;
  axios$1.Cancel = axios$1.CanceledError;
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;
  axios$1.isAxiosError = isAxiosError;
  axios$2.exports = axios$1;
  axios$2.exports.default = axios$1;
  var axios = axios$2.exports;
  function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
      var _a2;
      let requestData = config.data;
      const requestHeaders = (_a2 = config.headers) != null ? _a2 : {};
      if (utils$h.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password || "";
        requestHeaders.Authorization = "Basic " + Buffer.from(username + ":" + password).toString("base64");
      }
      const onerror = function handleError() {
        reject(new axios.AxiosError("Network Error", axios.AxiosError.ERR_NETWORK, config));
      };
      const ontimeout = function handleTimeout() {
        reject(new axios.AxiosError("timeout of " + config.timeout + "ms exceeded", axios.AxiosError.ECONNABORTED, config));
      };
      utils$h.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
          delete requestHeaders[key];
        }
      });
      if (requestData === void 0) {
        requestData = null;
      }
      const onload = function handleLoad(resp) {
        const responseHeaders = "responseHeaders" in resp ? parseHeaders$1(resp.responseHeaders) : {};
        const responseData = !config.responseType || config.responseType === "text" ? resp.responseText : resp.response;
        const response = {
          data: responseData,
          status: resp.status,
          statusText: resp.statusText,
          headers: responseHeaders,
          config,
          request: {
            responseURL: resp.finalUrl,
            status: resp.status,
            statusText: resp.statusText,
            responseXML: null
          }
        };
        settle$1(resolve, reject, response);
      };
      if (config.cancelToken) {
        config.cancelToken.promise.then(function onCanceled(cancel) {
          reject(cancel);
        });
      }
      let responseType;
      if (config.responseType && config.responseType !== "json") {
        responseType = config.responseType;
      }
      const method = config.method.toUpperCase();
      if (method === "UNLINK" || method === "PURGE" || method === "LINK") {
        reject(new axios.AxiosError(`${method} is not a supported method by GM.xmlHttpRequest`));
      } else {
        GM.xmlHttpRequest({
          method,
          url: buildURL$2(buildFullPath$2(config.baseURL, config.url), config.params, config.paramsSerializer),
          headers: Object.fromEntries(Object.entries(requestHeaders).map(([key, val]) => [key, val.toString()])),
          responseType,
          data: requestData,
          timeout: config.timeout,
          ontimeout,
          onload,
          onerror
        });
      }
    });
  }
  const BBS_URL = "https://webstatic.mihoyo.com/ys/event/e20210928review/index.html";
  const ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";
  const CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list";
  const CHARACTERS_DETAIL_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/detail";
  const BBS_URL_GLOBAL = "https://webstatic-sea.mihoyo.com/ys/event/e20210928review/index.html";
  const ROLE_URL_GLOBAL = "https://api-os-takumi.mihoyo.com/binding/api/getUserGameRolesByLtoken?game_biz=hk4e_global";
  const CHARACTERS_URL_GLOBAL = "https://sg-public-api.mihoyo.com/event/calculateos/sync/avatar/list";
  const CHARACTERS_DETAIL_URL_GLOBAL = "https://sg-public-api.mihoyo.com/event/calculateos/sync/avatar/detail";
  axios.defaults.adapter = xhrAdapter;
  axios.defaults.withCredentials = true;
  const to = (promise) => promise.then((data2) => {
    return [null, data2];
  }).catch((err) => [err]);
  const isGlobal = () => {
    return "hk4e_global" == localStorage.getItem("gameBiz");
  };
  const requestPageSize = 50;
  const getAccount = async () => {
    const [err, res] = await to(axios.get(isGlobal() ? ROLE_URL_GLOBAL : ROLE_URL));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: accountList } = await data2;
          return accountList;
        }
      }
    }
    alert("\u8BF7\u786E\u8BA4\u5DF2\u767B\u5F55\u6D3B\u52A8\u9875\u9762\u4E14\u7ED1\u5B9A\u539F\u795E\u8D26\u6237!");
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL);
    throw err ? err : new Error("\u8D26\u6237\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
  };
  const getCharacters = async (uid, region, page = 1) => {
    let url = isGlobal() ? CHARACTERS_URL_GLOBAL : CHARACTERS_URL;
    const [err, res] = await to(axios.post(url, JSON.stringify({
      "element_attr_ids": [],
      "weapon_cat_ids": [],
      "page": page,
      "size": requestPageSize,
      "uid": uid,
      "region": region,
      "lang": "zh-cn"
    })));
    if (!err) {
      const { status, data: resData } = await res;
      console.log(res);
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
      }
    }
    alert("\u8BF7\u786E\u8BA4\u5DF2\u767B\u5F55\u6D3B\u52A8\u9875\u9762\u4E14\u7ED1\u5B9A\u539F\u795E\u8D26\u6237!");
    GM_openInTab(isGlobal() ? BBS_URL_GLOBAL : BBS_URL);
    throw err ? err : new Error("\u89D2\u8272\u5217\u8868\u83B7\u53D6\u5931\u8D25");
  };
  const getCharacterDetail = async (character, uid, region) => {
    const { id } = character;
    const params = `?avatar_id=${id}&uid=${uid}&region=${region}&lang=zh-cn`;
    let URL = isGlobal() ? CHARACTERS_DETAIL_URL_GLOBAL : CHARACTERS_DETAIL_URL;
    const [err, res] = await to(axios.get(URL + params));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const characterData = await data2;
          return { character, ...characterData };
        }
      }
    }
    throw err ? err : new Error("\u89D2\u8272\u8BE6\u60C5\u83B7\u53D6\u5931\u8D25");
  };
  const getDetailList = async (game_uid, region) => {
    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters2 = [];
    for await (let i2 of idxs) {
      characters2.push.apply(characters2, await getCharacters(game_uid, region, i2 + 1));
    }
    const details = characters2.map((c2) => getCharacterDetail(c2, game_uid, region));
    const detailList = [];
    for await (let d2 of details) {
      detailList.push(d2);
    }
    return detailList;
  };
  function ExDialog() {
    const [gameBizSwitchEnabled, setGameBizSwitchEnabled] = React2.useState(() => isGlobal());
    const onChangeGameBiz = (e2) => {
      setGameBizSwitchEnabled(e2);
      let gameBizNew = !e2 ? "hk4e_cn" : "hk4e_global";
      console.log(gameBizNew);
      localStorage.setItem("gameBiz", gameBizNew);
    };
    const [accountList, setAccountList] = React2.useState([]);
    const [currentAccount, setCurrentAccount] = React2.useState();
    const handleRoleSelectChange = (idx) => {
      setCurrentAccount(accountList[idx]);
    };
    const accountShow = (idx) => {
      if (!accountList || !accountList[idx]) {
        return "";
      }
      const role = accountList[idx];
      return `${role.game_uid}(${role.region})`;
    };
    const getAccountList = () => {
      getAccount().then((res) => {
        const roles = res;
        setAccountList(roles);
        roles.length > 0 && setCurrentAccount(roles[0]);
      }).catch((err) => {
        console.error(err);
        console.error("\u8D26\u6237\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
        alert("\u8D26\u6237\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
      });
    };
    const syncCharacterInfo = () => {
      if (!currentAccount) {
        console.error("\u8D26\u6237\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
        alert("\u8D26\u6237\u4FE1\u606F\u83B7\u53D6\u5931\u8D25");
        return;
      }
      console.log("\u5F00\u59CB\u540C\u6B65\u89D2\u8272\u4FE1\u606F");
      const {
        game_uid,
        region
      } = currentAccount;
      getDetailList(game_uid, region).then((res) => {
        console.group("\u8FD4\u56DE\u6570\u636E");
        console.groupCollapsed("\u89D2\u8272");
        console.table(res.map((a2) => a2.character));
        console.groupEnd();
        console.groupCollapsed("\u6B66\u5668");
        console.table(res.map((a2) => a2.weapon));
        console.groupEnd();
        console.groupCollapsed("\u89D2\u8272\u5929\u8D4B");
        res.forEach((c2) => {
          const name = c2.character.name;
          console.groupCollapsed(name);
          console.table(c2.skill_list);
          console.groupEnd();
        });
        console.groupEnd();
        console.groupEnd();
        res.forEach((v2) => {
          addCharacter(v2);
        });
        console.log(`\u7C73\u6E38\u793E\u6570\u636E\u65E0\u6CD5\u5224\u65AD\u662F\u5426\u7A81\u7834,\u8BF7\u81EA\u884C\u6BD4\u8F83\u6574\u6570\u7B49\u7EA7\u662F\u5426\u5DF2\u7A81\u7834`);
        console.log(`\u89D2\u8272\u4FE1\u606F\u540C\u6B65\u5B8C\u6BD5`);
        alert("\u89D2\u8272\u4FE1\u606F\u540C\u6B65\u5B8C\u6BD5");
        location.reload();
      });
    };
    function classNames(...classes) {
      return classes.filter(Boolean).join(" ");
    }
    return /* @__PURE__ */ jsxs("div", {
      className: "fixed top-10 inset-x-[20%] mx-auto min-w-[50%] min-h-min rounded-md bg-slate-700 opacity-75 text-white text-center z-[1200]",
      children: [/* @__PURE__ */ jsx("h1", {
        className: "text-3xl font-bold underline pt-4",
        children: "SeelieEX"
      }), /* @__PURE__ */ jsx("h2", {
        className: "text-xl font-bold underline pt-4",
        children: "\u672C\u811A\u672C\u4E0E\u539F\u7F51\u9875\u6837\u5F0F\u51B2\u7A81,\u4E0D\u4F7F\u7528\u65F6\u53EF\u4EE5\u4E34\u65F6\u7981\u7528\u811A\u672C"
      }), /* @__PURE__ */ jsx("div", {
        className: "w-full p-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "w-full max-w-md p-2 mx-auto bg-purple rounded-2xl",
          children: [/* @__PURE__ */ jsx(Oe$1, {
            children: ({
              open
            }) => /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(Oe$1.Button, {
                className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "\u89D2\u8272\u4FE1\u606F\u540C\u6B65"
                }), /* @__PURE__ */ jsx(ChevronUpIcon$1, {
                  className: `${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`
                })]
              }), /* @__PURE__ */ jsxs(Oe$1.Panel, {
                className: "px-4 pt-4 pb-2 text-sm text-white-500",
                children: [/* @__PURE__ */ jsxs("div", {
                  className: "flex pt-4",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-1/2 text-white-900",
                    children: "\u533A\u670D\u9009\u62E9:"
                  }), /* @__PURE__ */ jsx(ToggleSwitch, {
                    className: "w-1/2",
                    checked: gameBizSwitchEnabled,
                    onChange: onChangeGameBiz,
                    labelLeft: "\u56FD\u670D",
                    labelRight: "\u56FD\u9645\u670D"
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "flex pt-2",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "w-full",
                    children: /* @__PURE__ */ jsx("button", {
                      className: "text-white bg-blue-500 px-4 py-2",
                      onClick: getAccountList,
                      children: "\u83B7\u53D6\u8D26\u6237\u4FE1\u606F"
                    })
                  })
                }), /* @__PURE__ */ jsxs("div", {
                  className: "flex pt-4",
                  children: [/* @__PURE__ */ jsx("div", {
                    className: "w-1/2 text-white-900",
                    children: "\u8D26\u6237\u9009\u62E9:"
                  }), /* @__PURE__ */ jsx("div", {
                    className: "w-1/2",
                    children: /* @__PURE__ */ jsx(ListboxSelect, {
                      selected: currentAccount ? accountList.indexOf(currentAccount) : 0,
                      setSelected: handleRoleSelectChange,
                      optionList: accountList.map((_, idx) => idx),
                      show: accountShow
                    })
                  })]
                }), /* @__PURE__ */ jsx("div", {
                  className: "flex pt-2",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "w-full",
                    children: /* @__PURE__ */ jsx("button", {
                      className: "text-white bg-blue-500 px-4 py-2",
                      onClick: syncCharacterInfo,
                      children: "\u540C\u6B65mihoyo\u89D2\u8272\u4FE1\u606F"
                    })
                  })
                })]
              })]
            })
          }), /* @__PURE__ */ jsx(Oe$1, {
            as: "div",
            className: "mt-2",
            children: ({
              open
            }) => /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(Oe$1.Button, {
                className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "\u89C4\u5212\u6279\u91CF\u64CD\u4F5C"
                }), /* @__PURE__ */ jsx(ChevronUpIcon$1, {
                  className: `${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`
                })]
              }), /* @__PURE__ */ jsx(Oe$1.Panel, {
                className: "px-4 pt-4 pb-2 text-sm text-white-500",
                children: /* @__PURE__ */ jsxs(qe.Group, {
                  children: [/* @__PURE__ */ jsx(qe.List, {
                    className: "flex p-1 space-x-1 bg-blue-900/20 rounded-xl",
                    children: ["\u89D2\u8272\u76EE\u6807\u7B49\u7EA7", "\u5929\u8D4B\u76EE\u6807\u7B49\u7EA7", "\u6B66\u5668\u76EE\u6807\u7B49\u7EA7"].map((category) => /* @__PURE__ */ jsx(qe, {
                      className: ({
                        selected
                      }) => classNames("w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg", "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60", selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"),
                      children: category
                    }, category))
                  }), /* @__PURE__ */ jsxs(qe.Panels, {
                    children: [/* @__PURE__ */ jsx(qe.Panel, {
                      children: /* @__PURE__ */ jsx(CharacterGoalTab, {
                        showText: "\u89D2\u8272",
                        batchUpdateCharacter
                      })
                    }), /* @__PURE__ */ jsx(qe.Panel, {
                      children: /* @__PURE__ */ jsx(TalentGoalTab, {})
                    }), /* @__PURE__ */ jsx(qe.Panel, {
                      children: /* @__PURE__ */ jsx(CharacterGoalTab, {
                        showText: "\u6B66\u5668",
                        batchUpdateCharacter: batchUpdateWeapon
                      })
                    })]
                  })]
                })
              })]
            })
          })]
        })
      })]
    });
  }
  function App() {
    const [showExDialog, setShowExDialog] = React2.useState(() => false);
    const nodeRef = React__default["default"].useRef(null);
    const [position, setPosition] = React2.useState(() => {
      const itemString = localStorage.getItem("seelieExPosition");
      if (typeof itemString == "string" && itemString.length > 0) {
        return JSON.parse(itemString);
      }
      return {
        x: 30,
        y: 500
      };
    });
    const handleDragStop = (e2, data2) => {
      const {
        x: x2,
        y: y2
      } = data2;
      localStorage.setItem("seelieExPosition", JSON.stringify({
        x: x2,
        y: y2
      }));
      setPosition({
        x: x2,
        y: y2
      });
      eventControl(e2);
    };
    const [isDragging, setIsDragging] = React2.useState(false);
    const eventControl = (event, info) => {
      if (event.type === "mousemove" || event.type === "touchmove") {
        setIsDragging(true);
      }
      if (event.type === "mouseup" || event.type === "touchend") {
        setTimeout(() => {
          setIsDragging(false);
        }, 100);
      }
    };
    return /* @__PURE__ */ jsxs("div", {
      className: "App",
      children: [/* @__PURE__ */ jsx(Draggable__default["default"], {
        nodeRef,
        defaultPosition: position,
        onStop: handleDragStop,
        onDrag: eventControl,
        children: /* @__PURE__ */ jsx("div", {
          ref: nodeRef,
          className: "fixed inset-0 max-w-max max-h-max flex items-center justify-center z-[1201]",
          children: /* @__PURE__ */ jsx("button", {
            type: "button",
            onClick: () => !isDragging && setShowExDialog(!showExDialog),
            className: "px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75",
            children: "SeelieEX"
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        style: {
          display: showExDialog ? "" : "none"
        },
        children: /* @__PURE__ */ jsx(ExDialog, {})
      })]
    });
  }
  let seelieEx = document.createElement("div");
  seelieEx.id = "seelieEx";
  seelieEx.className = "flex";
  (_b = (_a = document.getElementById("app")) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.append(seelieEx);
  ReactDOM__default["default"].render(/* @__PURE__ */ jsx(React__default["default"].StrictMode, {
    children: /* @__PURE__ */ jsx(App, {})
  }), document.getElementById("seelieEx"));
})(React, ReactDOM, ReactDraggable);
 
