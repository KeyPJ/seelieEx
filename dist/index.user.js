// ==UserScript==
// @name             genshinSeelieEx
// @namespace        https://github.com/KeyPJ/seelieEx
// @version          2.6.0
// @author           KeyPJ
// @license          MIT
// @homepage         https://github.com/KeyPJ
// @homepageURL      https://github.com/KeyPJ/seelieEx
// @updateURL        https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/dist/index.user.js
// @include          https://seelie.inmagi.com/*
// @include          https://seelie.me/*
// @require          https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js
// @require          https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js
// @require          https://cdn.jsdelivr.net/npm/react-draggable@4.4.4/build/web/react-draggable.min.js
// @connect          api-takumi.mihoyo.com
// @connect          api-os-takumi.mihoyo.com
// @connect          sg-public-api.mihoyo.com
// @resource         character https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/character.json
// @resource         weapon https://cdn.jsdelivr.net/gh/KeyPJ/seelieEx@main/src/data/weapon.json
// @grant            GM_openInTab
// @grant            GM_getResourceText
// @grant            GM.xmlHttpRequest
// @run-at           document-end
// @contributionURL  https://github.com/KeyPJ/seelieEx
// @name:zh          原神规划助手扩展
// @description:zh   个人想偷懒,不想手动在仙灵 - 原神规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie
// @grant            unsafeWindow
// @grant            GM_xmlhttpRequest
// @copyright        2021, KeyPJ https://github.com/KeyPJ
// ==/UserScript==

;(({ cssTextList = [] }) => {
  cssTextList.forEach((s) => {
    const style = document.createElement("style");
    style.innerText = s;
    style.dataset.source = "vite-plugin-monkey";
    document.head.appendChild(style);
  });
})({
  "cssTextList": [
    "/*\n! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/*\nEnsure the default browser behavior of the `hidden` attribute.\n*/\n\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.pointer-events-none {\n  pointer-events: none;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.inset-0 {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.inset-x-\\[20\\%\\] {\n  left: 20%;\n  right: 20%;\n}\n.inset-y-0 {\n  top: 0px;\n  bottom: 0px;\n}\n.top-10 {\n  top: 2.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.left-0 {\n  left: 0px;\n}\n.z-\\[1201\\] {\n  z-index: 1201;\n}\n.z-\\[1200\\] {\n  z-index: 1200;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-10 {\n  margin-top: 2.5rem;\n}\n.block {\n  display: block;\n}\n.inline-block {\n  display: inline-block;\n}\n.flex {\n  display: flex;\n}\n.inline-flex {\n  display: inline-flex;\n}\n.table {\n  display: table;\n}\n.grid {\n  display: grid;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-6 {\n  height: 1.5rem;\n}\n.h-4 {\n  height: 1rem;\n}\n.max-h-max {\n  max-height: -webkit-max-content;\n  max-height: -moz-max-content;\n  max-height: max-content;\n}\n.max-h-60 {\n  max-height: 15rem;\n}\n.min-h-min {\n  min-height: -webkit-min-content;\n  min-height: -moz-min-content;\n  min-height: min-content;\n}\n.w-full {\n  width: 100%;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-1\\/2 {\n  width: 50%;\n}\n.w-1\\/4 {\n  width: 25%;\n}\n.w-11 {\n  width: 2.75rem;\n}\n.w-4 {\n  width: 1rem;\n}\n.min-w-\\[50\\%\\] {\n  min-width: 50%;\n}\n.max-w-max {\n  max-width: -webkit-max-content;\n  max-width: -moz-max-content;\n  max-width: max-content;\n}\n.max-w-md {\n  max-width: 28rem;\n}\n.translate-x-6 {\n  --tw-translate-x: 1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.translate-x-1 {\n  --tw-translate-x: 0.25rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.cursor-default {\n  cursor: default;\n}\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.grid-flow-col {\n  grid-auto-flow: column;\n}\n.grid-rows-2 {\n  grid-template-rows: repeat(2, minmax(0, 1fr));\n}\n.flex-row {\n  flex-direction: row;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.overflow-auto {\n  overflow: auto;\n}\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-2xl {\n  border-radius: 1rem;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-xl {\n  border-radius: 0.75rem;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.bg-black {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n.bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity));\n}\n.bg-purple-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 232 255 / var(--tw-bg-opacity));\n}\n.bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity));\n}\n.bg-blue-900\\/20 {\n  background-color: rgb(30 58 138 / 0.2);\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-amber-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 243 199 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity));\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.bg-opacity-20 {\n  --tw-bg-opacity: 0.2;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pb-2 {\n  padding-bottom: 0.5rem;\n}\n.pt-2 {\n  padding-top: 0.5rem;\n}\n.pl-3 {\n  padding-left: 0.75rem;\n}\n.pr-10 {\n  padding-right: 2.5rem;\n}\n.pr-2 {\n  padding-right: 0.5rem;\n}\n.pl-10 {\n  padding-left: 2.5rem;\n}\n.pr-4 {\n  padding-right: 1rem;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-3xl {\n  font-size: 1.875rem;\n  line-height: 2.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-normal {\n  font-weight: 400;\n}\n.leading-5 {\n  line-height: 1.25rem;\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(168 85 247 / var(--tw-text-opacity));\n}\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity));\n}\n.text-blue-100 {\n  --tw-text-opacity: 1;\n  color: rgb(219 234 254 / var(--tw-text-opacity));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.text-amber-900 {\n  --tw-text-opacity: 1;\n  color: rgb(120 53 15 / var(--tw-text-opacity));\n}\n.text-amber-600 {\n  --tw-text-opacity: 1;\n  color: rgb(217 119 6 / var(--tw-text-opacity));\n}\n.underline {\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\n.opacity-75 {\n  opacity: 0.75;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.opacity-0 {\n  opacity: 0;\n}\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.ring-1 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.ring-black {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity));\n}\n.ring-opacity-60 {\n  --tw-ring-opacity: 0.6;\n}\n.ring-opacity-5 {\n  --tw-ring-opacity: 0.05;\n}\n.ring-offset-2 {\n  --tw-ring-offset-width: 2px;\n}\n.ring-offset-blue-400 {\n  --tw-ring-offset-color: #60a5fa;\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.transition {\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.duration-100 {\n  transition-duration: 100ms;\n}\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n.hover\\:bg-purple-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(233 213 255 / var(--tw-bg-opacity));\n}\n.hover\\:bg-white\\/\\[0\\.12\\]:hover {\n  background-color: rgb(255 255 255 / 0.12);\n}\n.hover\\:bg-opacity-30:hover {\n  --tw-bg-opacity: 0.3;\n}\n.hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:border-indigo-500:focus-visible {\n  --tw-border-opacity: 1;\n  border-color: rgb(99 102 241 / var(--tw-border-opacity));\n}\n.focus-visible\\:ring-2:focus-visible {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:ring:focus-visible {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:ring-white:focus-visible {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.focus-visible\\:ring-purple-500:focus-visible {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(168 85 247 / var(--tw-ring-opacity));\n}\n.focus-visible\\:ring-opacity-75:focus-visible {\n  --tw-ring-opacity: 0.75;\n}\n.focus-visible\\:ring-offset-2:focus-visible {\n  --tw-ring-offset-width: 2px;\n}\n.focus-visible\\:ring-offset-orange-300:focus-visible {\n  --tw-ring-offset-color: #fdba74;\n}\n@media (min-width: 640px) {\n\n  .sm\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n\n"
  ]
});

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
(function(React2, ReactDOM2, Draggable) {
  var _a;
  "use strict";
  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { "default": e };
  }
  function _interopNamespace(e) {
    if (e && e.__esModule)
      return e;
    var n2 = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
    if (e) {
      Object.keys(e).forEach(function(k2) {
        if (k2 !== "default") {
          var d = Object.getOwnPropertyDescriptor(e, k2);
          Object.defineProperty(n2, k2, d.get ? d : {
            enumerable: true,
            get: function() {
              return e[k2];
            }
          });
        }
      });
    }
    n2["default"] = e;
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
    for (let e of characters) {
      const { id, name } = e;
      if (queryName == name) {
        return id;
      }
    }
    console.error(`getCharacterId ${queryName} \u67E5\u8BE2\u5931\u8D25`);
    return "";
  };
  const getWeaponId = (queryName) => {
    for (let e of weapons) {
      const { id, name } = e;
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
    for (let e of elementAttrIds) {
      const { element_attr_id, name } = e;
      if (queryName == element_attr_id) {
        return name;
      }
    }
    console.error(`getElementAttrName: ${queryName} \u67E5\u8BE2\u5931\u8D25`);
    return "";
  };
  const getTotalGoal = () => {
    const goals = vue.goals;
    return goals;
  };
  const getGoalInactive = () => {
    return Object.keys(vue.inactive) || [];
  };
  const addGoal = (goal) => {
    vue.addGoal(goal);
  };
  const addTalentGoal = (talentCharacter, skill_list) => {
    const totalGoal = getTotalGoal();
    const ids = totalGoal.map((g2) => g2.id);
    const id = Math.max(...ids) + 1 || 1;
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "talent" && g2.character == talentCharacter);
    const [normalCurrent, skillCurrent, burstCurrent] = skill_list.filter((a) => a.max_level == 10).sort().map((a) => a.level_current);
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
      talentGoal = __spreadProps(__spreadValues({}, seelieGoal), {
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
      });
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
      characterGoal = __spreadProps(__spreadValues({}, seelieGoal), {
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      });
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
    const talentNew = __spreadProps(__spreadValues({}, talent), {
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
    });
    addGoal(talentNew);
  };
  const batchUpdateTalent = (all, normal, skill, burst) => {
    getTotalGoal().filter((a) => a.type == "talent").filter((a) => all || !getGoalInactive().includes(a.character)).map((a) => updateTalent(a, normal, skill, burst));
  };
  const updateCharacter = (character, characterStatusGoal) => {
    const { current } = character;
    const { level: levelCurrent, asc: ascCurrent } = current;
    const { level, asc } = characterStatusGoal;
    const characterGoalNew = __spreadProps(__spreadValues({}, character), {
      goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current
    });
    addGoal(characterGoalNew);
  };
  const batchUpdateCharacter = (all, characterStatusGoal) => {
    getTotalGoal().filter((a) => a.type == "character").filter((a) => all || !getGoalInactive().includes(a.character)).map((a) => updateCharacter(a, characterStatusGoal));
  };
  const batchUpdateWeapon = (all, characterStatusGoal) => {
    getTotalGoal().filter((a) => a.type == "weapon").filter((a) => all || !getGoalInactive().includes(a.weapon)).map((a) => updateCharacter(a, characterStatusGoal));
  };
  function k() {
    let e = [], t = [], r = { enqueue(o) {
      t.push(o);
    }, requestAnimationFrame(...o) {
      let n2 = requestAnimationFrame(...o);
      r.add(() => cancelAnimationFrame(n2));
    }, nextFrame(...o) {
      r.requestAnimationFrame(() => {
        r.requestAnimationFrame(...o);
      });
    }, setTimeout(...o) {
      let n2 = setTimeout(...o);
      r.add(() => clearTimeout(n2));
    }, add(o) {
      e.push(o);
    }, dispose() {
      for (let o of e.splice(0))
        o();
    }, async workQueue() {
      for (let o of t.splice(0))
        await o();
    } };
    return r;
  }
  function Q() {
    let [e] = React2.useState(k);
    return React2.useEffect(() => () => e.dispose(), [e]), e;
  }
  var x = typeof window != "undefined" ? React2.useLayoutEffect : React2.useEffect;
  var yt = { serverHandoffComplete: false };
  function q$1() {
    let [e, t] = React2.useState(yt.serverHandoffComplete);
    return React2.useEffect(() => {
      e !== true && t(true);
    }, [e]), React2.useEffect(() => {
      yt.serverHandoffComplete === false && (yt.serverHandoffComplete = true);
    }, []), e;
  }
  var or = 0;
  function to$1() {
    return ++or;
  }
  function A() {
    let e = q$1(), [t, r] = React2.useState(e ? to$1 : null);
    return x(() => {
      t === null && r(to$1());
    }, [t]), t != null ? "" + t : void 0;
  }
  function ke(e) {
    let t = React2.useRef(e);
    return React2.useEffect(() => {
      t.current = e;
    }, [e]), t;
  }
  function ee(e, t) {
    let [r, o] = React2.useState(e), n2 = ke(e);
    return x(() => o(n2.current), [n2, o, ...t]), r;
  }
  function I(...e) {
    let t = React2.useRef(e);
    return React2.useEffect(() => {
      t.current = e;
    }, [e]), React2.useCallback((r) => {
      for (let o of t.current)
        o != null && (typeof o == "function" ? o(r) : o.current = r);
    }, [t]);
  }
  function S(e, t, ...r) {
    if (e in t) {
      let n2 = t[e];
      return typeof n2 == "function" ? n2(...r) : n2;
    }
    let o = new Error(`Tried to handle "${e}" but there is no handler defined. Only defined handlers are: ${Object.keys(t).map((n2) => `"${n2}"`).join(", ")}.`);
    throw Error.captureStackTrace && Error.captureStackTrace(o, S), o;
  }
  function E({ props: e, slot: t, defaultTag: r, features: o, visible: n2 = true, name: i }) {
    if (n2)
      return _e(e, t, r, i);
    let a = o != null ? o : 0;
    if (a & 2) {
      let _a2 = e, { static: l = false } = _a2, s = __objRest(_a2, ["static"]);
      if (l)
        return _e(s, t, r, i);
    }
    if (a & 1) {
      let _b = e, { unmount: l = true } = _b, s = __objRest(_b, ["unmount"]);
      return S(l ? 0 : 1, { [0]() {
        return null;
      }, [1]() {
        return _e(__spreadProps(__spreadValues({}, s), { hidden: true, style: { display: "none" } }), t, r, i);
      } });
    }
    return _e(e, t, r, i);
  }
  function _e(e, t = {}, r, o) {
    let _a2 = gt(e, ["unmount", "static"]), { as: n2 = r, children: i, refName: a = "ref" } = _a2, l = __objRest(_a2, ["as", "children", "refName"]), s = e.ref !== void 0 ? { [a]: e.ref } : {}, u = typeof i == "function" ? i(t) : i;
    if (l.className && typeof l.className == "function" && (l.className = l.className(t)), n2 === React2.Fragment && Object.keys(l).length > 0) {
      if (!React2.isValidElement(u) || Array.isArray(u) && u.length > 1)
        throw new Error(['Passing props on "Fragment"!', "", `The current component <${o} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(l).map((c) => `  - ${c}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((c) => `  - ${c}`).join(`
`)].join(`
`));
      return React2.cloneElement(u, Object.assign({}, fr(mr(gt(l, ["ref"])), u.props, ["onClick"]), s));
    }
    return React2.createElement(n2, Object.assign({}, gt(l, ["ref"]), n2 !== React2.Fragment && s), u);
  }
  function fr(e, t, r) {
    let o = Object.assign({}, e);
    for (let n2 of r)
      e[n2] !== void 0 && t[n2] !== void 0 && Object.assign(o, { [n2](i) {
        i.defaultPrevented || e[n2](i), i.defaultPrevented || t[n2](i);
      } });
    return o;
  }
  function D(e) {
    var t;
    return Object.assign(React2.forwardRef(e), { displayName: (t = e.displayName) != null ? t : e.name });
  }
  function mr(e) {
    let t = Object.assign({}, e);
    for (let r in t)
      t[r] === void 0 && delete t[r];
    return t;
  }
  function gt(e, t = []) {
    let r = Object.assign({}, e);
    for (let o of t)
      o in r && delete r[o];
    return r;
  }
  function br(e) {
    throw new Error("Unexpected object: " + e);
  }
  function ae(e, t) {
    let r = t.resolveItems();
    if (r.length <= 0)
      return null;
    let o = t.resolveActiveIndex(), n2 = o != null ? o : -1, i = (() => {
      switch (e.focus) {
        case 0:
          return r.findIndex((a) => !t.resolveDisabled(a));
        case 1: {
          let a = r.slice().reverse().findIndex((l, s, u) => n2 !== -1 && u.length - s - 1 >= n2 ? false : !t.resolveDisabled(l));
          return a === -1 ? a : r.length - 1 - a;
        }
        case 2:
          return r.findIndex((a, l) => l <= n2 ? false : !t.resolveDisabled(a));
        case 3: {
          let a = r.slice().reverse().findIndex((l) => !t.resolveDisabled(l));
          return a === -1 ? a : r.length - 1 - a;
        }
        case 4:
          return r.findIndex((a) => t.resolveId(a) === e.id);
        case 5:
          return null;
        default:
          br(e);
      }
    })();
    return i === -1 ? o : i;
  }
  function G(e) {
    let t = e.parentElement, r = null;
    for (; t && !(t instanceof HTMLFieldSetElement); )
      t instanceof HTMLLegendElement && (r = t), t = t.parentElement;
    let o = (t == null ? void 0 : t.getAttribute("disabled")) === "";
    return o && Tr(r) ? false : o;
  }
  function Tr(e) {
    if (!e)
      return false;
    let t = e.previousElementSibling;
    for (; t !== null; ) {
      if (t instanceof HTMLLegendElement)
        return false;
      t = t.previousElementSibling;
    }
    return true;
  }
  function w(e, t, r) {
    let o = React2.useRef(t);
    o.current = t, React2.useEffect(() => {
      function n2(i) {
        o.current.call(window, i);
      }
      return window.addEventListener(e, n2, r), () => window.removeEventListener(e, n2, r);
    }, [e, r]);
  }
  var Pt = React2.createContext(null);
  Pt.displayName = "OpenClosedContext";
  function _() {
    return React2.useContext(Pt);
  }
  function W({ value: e, children: t }) {
    return React__default["default"].createElement(Pt.Provider, { value: e }, t);
  }
  function ro(e) {
    var r;
    if (e.type)
      return e.type;
    let t = (r = e.as) != null ? r : "button";
    if (typeof t == "string" && t.toLowerCase() === "button")
      return "button";
  }
  function U(e, t) {
    let [r, o] = React2.useState(() => ro(e));
    return x(() => {
      o(ro(e));
    }, [e.type, e.as]), x(() => {
      r || !t.current || t.current instanceof HTMLButtonElement && !t.current.hasAttribute("type") && o("button");
    }, [r, t]), r;
  }
  function se({ container: e, accept: t, walk: r, enabled: o = true }) {
    let n2 = React2.useRef(t), i = React2.useRef(r);
    React2.useEffect(() => {
      n2.current = t, i.current = r;
    }, [t, r]), x(() => {
      if (!e || !o)
        return;
      let a = n2.current, l = i.current, s = Object.assign((c) => a(c), { acceptNode: a }), u = document.createTreeWalker(e, NodeFilter.SHOW_ELEMENT, s, false);
      for (; u.nextNode(); )
        l(u.currentNode);
    }, [e, o, n2, i]);
  }
  var Ar = { [1](e) {
    return e.disabled || e.comboboxState === 1 ? e : __spreadProps(__spreadValues({}, e), { activeOptionIndex: null, comboboxState: 1 });
  }, [0](e) {
    return e.disabled || e.comboboxState === 0 ? e : __spreadProps(__spreadValues({}, e), { comboboxState: 0 });
  }, [2](e, t) {
    return e.disabled === t.disabled ? e : __spreadProps(__spreadValues({}, e), { disabled: t.disabled });
  }, [3](e, t) {
    if (e.disabled || e.optionsRef.current && !e.optionsPropsRef.current.static && e.comboboxState === 1)
      return e;
    let r = ae(t, { resolveItems: () => e.options, resolveActiveIndex: () => e.activeOptionIndex, resolveId: (o) => o.id, resolveDisabled: (o) => o.dataRef.current.disabled });
    return e.activeOptionIndex === r ? e : __spreadProps(__spreadValues({}, e), { activeOptionIndex: r });
  }, [4]: (e, t) => {
    var i;
    let r = e.activeOptionIndex !== null ? e.options[e.activeOptionIndex] : null, o = Array.from((i = e.optionsRef.current) == null ? void 0 : i.querySelectorAll('[id^="headlessui-combobox-option-"]')).reduce((a, l, s) => Object.assign(a, { [l.id]: s }), {}), n2 = [...e.options, { id: t.id, dataRef: t.dataRef }].sort((a, l) => o[a.id] - o[l.id]);
    return __spreadProps(__spreadValues({}, e), { options: n2, activeOptionIndex: (() => r === null ? null : n2.indexOf(r))() });
  }, [5]: (e, t) => {
    let r = e.options.slice(), o = e.activeOptionIndex !== null ? r[e.activeOptionIndex] : null, n2 = r.findIndex((i) => i.id === t.id);
    return n2 !== -1 && r.splice(n2, 1), __spreadProps(__spreadValues({}, e), { options: r, activeOptionIndex: (() => n2 === e.activeOptionIndex || o === null ? null : r.indexOf(o))() });
  } }, vt = React2.createContext(null);
  vt.displayName = "ComboboxContext";
  function pe(e) {
    let t = React2.useContext(vt);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <Combobox /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, pe), r;
    }
    return t;
  }
  var Rt = React2.createContext(null);
  Rt.displayName = "ComboboxActions";
  function Ue() {
    let e = React2.useContext(Rt);
    if (e === null) {
      let t = new Error("ComboboxActions is missing a parent <Combobox /> component.");
      throw Error.captureStackTrace && Error.captureStackTrace(t, Ue), t;
    }
    return e;
  }
  function hr(e, t) {
    return S(t.type, Ar, e, t);
  }
  var Or = React2.Fragment, Ir = D(function(t, r) {
    let _a2 = t, { value: o, onChange: n2, disabled: i = false } = _a2, a = __objRest(_a2, ["value", "onChange", "disabled"]), l = React2.useRef({ value: o, onChange: n2 }), s = React2.useRef({ static: false, hold: false }), u = React2.useRef({ displayValue: void 0 }), c = React2.useReducer(hr, { comboboxState: 1, comboboxPropsRef: l, optionsPropsRef: s, inputPropsRef: u, labelRef: React2.createRef(), inputRef: React2.createRef(), buttonRef: React2.createRef(), optionsRef: React2.createRef(), disabled: i, options: [], activeOptionIndex: null }), [{ comboboxState: m2, options: b, activeOptionIndex: T, optionsRef: y, inputRef: p2, buttonRef: f2 }, d] = c;
    x(() => {
      l.current.value = o;
    }, [o, l]), x(() => {
      l.current.onChange = n2;
    }, [n2, l]), x(() => d({ type: 2, disabled: i }), [i]), w("mousedown", (O) => {
      var N, K, V;
      let L = O.target;
      m2 === 0 && (((N = f2.current) == null ? void 0 : N.contains(L)) || ((K = p2.current) == null ? void 0 : K.contains(L)) || ((V = y.current) == null ? void 0 : V.contains(L)) || d({ type: 1 }));
    });
    let P = T === null ? null : b[T].dataRef.current.value, C = React2.useMemo(() => ({ open: m2 === 0, disabled: i, activeIndex: T, activeOption: P }), [m2, i, b, T]), R = React2.useCallback(() => {
      if (!p2.current || o === void 0)
        return;
      let O = u.current.displayValue;
      typeof O == "function" ? p2.current.value = O(o) : typeof o == "string" && (p2.current.value = o);
    }, [o, p2, u]), g2 = React2.useCallback((O) => {
      let L = b.find((K) => K.id === O);
      if (!L)
        return;
      let { dataRef: N } = L;
      l.current.onChange(N.current.value), R();
    }, [b, l, p2]), v = React2.useCallback(() => {
      if (T !== null) {
        let { dataRef: O } = b[T];
        l.current.onChange(O.current.value), R();
      }
    }, [T, b, l, p2]), h2 = React2.useMemo(() => ({ selectOption: g2, selectActiveOption: v }), [g2, v]);
    return x(() => {
      m2 === 1 && R();
    }, [R, m2]), x(R, [R]), React__default["default"].createElement(Rt.Provider, { value: h2 }, React__default["default"].createElement(vt.Provider, { value: c }, React__default["default"].createElement(W, { value: S(m2, { [0]: 0, [1]: 1 }) }, E({ props: r === null ? a : __spreadProps(__spreadValues({}, a), { ref: r }), slot: C, defaultTag: Or, name: "Combobox" }))));
  }), Lr = "input", Dr = D(function(t, r) {
    var R, g2;
    let _a2 = t, { value: o, onChange: n2, displayValue: i } = _a2, a = __objRest(_a2, ["value", "onChange", "displayValue"]), [l, s] = pe("Combobox.Input"), u = Ue(), c = I(l.inputRef, r), m2 = l.inputPropsRef, b = `headlessui-combobox-input-${A()}`, T = Q(), y = ke(n2);
    x(() => {
      m2.current.displayValue = i;
    }, [i, m2]);
    let p2 = React2.useCallback((v) => {
      switch (v.key) {
        case "Enter":
          v.preventDefault(), v.stopPropagation(), u.selectActiveOption(), s({ type: 1 });
          break;
        case "ArrowDown":
          return v.preventDefault(), v.stopPropagation(), S(l.comboboxState, { [0]: () => s({ type: 3, focus: 2 }), [1]: () => {
            s({ type: 0 }), T.nextFrame(() => {
              l.comboboxPropsRef.current.value || s({ type: 3, focus: 0 });
            });
          } });
        case "ArrowUp":
          return v.preventDefault(), v.stopPropagation(), S(l.comboboxState, { [0]: () => s({ type: 3, focus: 1 }), [1]: () => {
            s({ type: 0 }), T.nextFrame(() => {
              l.comboboxPropsRef.current.value || s({ type: 3, focus: 3 });
            });
          } });
        case "Home":
        case "PageUp":
          return v.preventDefault(), v.stopPropagation(), s({ type: 3, focus: 0 });
        case "End":
        case "PageDown":
          return v.preventDefault(), v.stopPropagation(), s({ type: 3, focus: 3 });
        case "Escape":
          return v.preventDefault(), l.optionsRef.current && !l.optionsPropsRef.current.static && v.stopPropagation(), s({ type: 1 });
        case "Tab":
          u.selectActiveOption(), s({ type: 1 });
          break;
      }
    }, [T, s, l, u]), f2 = React2.useCallback((v) => {
      var h2;
      s({ type: 0 }), (h2 = y.current) == null || h2.call(y, v);
    }, [s, y]), d = ee(() => {
      if (!!l.labelRef.current)
        return [l.labelRef.current.id].join(" ");
    }, [l.labelRef.current]), P = React2.useMemo(() => ({ open: l.comboboxState === 0, disabled: l.disabled }), [l]), C = { ref: c, id: b, role: "combobox", type: "text", "aria-controls": (R = l.optionsRef.current) == null ? void 0 : R.id, "aria-expanded": l.disabled ? void 0 : l.comboboxState === 0, "aria-activedescendant": l.activeOptionIndex === null || (g2 = l.options[l.activeOptionIndex]) == null ? void 0 : g2.id, "aria-labelledby": d, disabled: l.disabled, onKeyDown: p2, onChange: f2 };
    return E({ props: __spreadValues(__spreadValues({}, a), C), slot: P, defaultTag: Lr, name: "Combobox.Input" });
  }), Mr = "button", Fr = D(function(t, r) {
    var p2;
    let [o, n2] = pe("Combobox.Button"), i = Ue(), a = I(o.buttonRef, r), l = `headlessui-combobox-button-${A()}`, s = Q(), u = React2.useCallback((f2) => {
      switch (f2.key) {
        case "ArrowDown":
          return f2.preventDefault(), f2.stopPropagation(), o.comboboxState === 1 && (n2({ type: 0 }), s.nextFrame(() => {
            o.comboboxPropsRef.current.value || n2({ type: 3, focus: 0 });
          })), s.nextFrame(() => {
            var d;
            return (d = o.inputRef.current) == null ? void 0 : d.focus({ preventScroll: true });
          });
        case "ArrowUp":
          return f2.preventDefault(), f2.stopPropagation(), o.comboboxState === 1 && (n2({ type: 0 }), s.nextFrame(() => {
            o.comboboxPropsRef.current.value || n2({ type: 3, focus: 3 });
          })), s.nextFrame(() => {
            var d;
            return (d = o.inputRef.current) == null ? void 0 : d.focus({ preventScroll: true });
          });
        case "Escape":
          return f2.preventDefault(), o.optionsRef.current && !o.optionsPropsRef.current.static && f2.stopPropagation(), n2({ type: 1 }), s.nextFrame(() => {
            var d;
            return (d = o.inputRef.current) == null ? void 0 : d.focus({ preventScroll: true });
          });
      }
    }, [s, n2, o, i]), c = React2.useCallback((f2) => {
      if (G(f2.currentTarget))
        return f2.preventDefault();
      o.comboboxState === 0 ? n2({ type: 1 }) : (f2.preventDefault(), n2({ type: 0 })), s.nextFrame(() => {
        var d;
        return (d = o.inputRef.current) == null ? void 0 : d.focus({ preventScroll: true });
      });
    }, [n2, s, o]), m2 = ee(() => {
      if (!!o.labelRef.current)
        return [o.labelRef.current.id, l].join(" ");
    }, [o.labelRef.current, l]), b = React2.useMemo(() => ({ open: o.comboboxState === 0, disabled: o.disabled }), [o]), T = t, y = { ref: a, id: l, type: U(t, o.buttonRef), tabIndex: -1, "aria-haspopup": true, "aria-controls": (p2 = o.optionsRef.current) == null ? void 0 : p2.id, "aria-expanded": o.disabled ? void 0 : o.comboboxState === 0, "aria-labelledby": m2, disabled: o.disabled, onClick: c, onKeyDown: u };
    return E({ props: __spreadValues(__spreadValues({}, T), y), slot: b, defaultTag: Mr, name: "Combobox.Button" });
  }), wr = "label";
  function kr(e) {
    let [t] = pe("Combobox.Label"), r = `headlessui-combobox-label-${A()}`, o = React2.useCallback(() => {
      var a;
      return (a = t.inputRef.current) == null ? void 0 : a.focus({ preventScroll: true });
    }, [t.inputRef]), n2 = React2.useMemo(() => ({ open: t.comboboxState === 0, disabled: t.disabled }), [t]), i = { ref: t.labelRef, id: r, onClick: o };
    return E({ props: __spreadValues(__spreadValues({}, e), i), slot: n2, defaultTag: wr, name: "Combobox.Label" });
  }
  var _r = "ul", Gr = 1 | 2, Hr = D(function(t, r) {
    var y;
    let _a2 = t, { hold: o = false } = _a2, n2 = __objRest(_a2, ["hold"]), [i] = pe("Combobox.Options"), { optionsPropsRef: a } = i, l = I(i.optionsRef, r), s = `headlessui-combobox-options-${A()}`, u = _(), c = (() => u !== null ? u === 0 : i.comboboxState === 0)();
    x(() => {
      var p2;
      a.current.static = (p2 = t.static) != null ? p2 : false;
    }, [a, t.static]), x(() => {
      a.current.hold = o;
    }, [o, a]), se({ container: i.optionsRef.current, enabled: i.comboboxState === 0, accept(p2) {
      return p2.getAttribute("role") === "option" ? NodeFilter.FILTER_REJECT : p2.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
    }, walk(p2) {
      p2.setAttribute("role", "none");
    } });
    let m2 = ee(() => {
      var p2, f2, d;
      return (d = (p2 = i.labelRef.current) == null ? void 0 : p2.id) != null ? d : (f2 = i.buttonRef.current) == null ? void 0 : f2.id;
    }, [i.labelRef.current, i.buttonRef.current]), b = React2.useMemo(() => ({ open: i.comboboxState === 0 }), [i]), T = { "aria-activedescendant": i.activeOptionIndex === null || (y = i.options[i.activeOptionIndex]) == null ? void 0 : y.id, "aria-labelledby": m2, role: "listbox", id: s, ref: l };
    return E({ props: __spreadValues(__spreadValues({}, n2), T), slot: b, defaultTag: _r, features: Gr, visible: c, name: "Combobox.Options" });
  }), Ur = "li";
  function Br(e) {
    let _a2 = e, { disabled: t = false, value: r } = _a2, o = __objRest(_a2, ["disabled", "value"]), [n2, i] = pe("Combobox.Option"), a = Ue(), l = `headlessui-combobox-option-${A()}`, s = n2.activeOptionIndex !== null ? n2.options[n2.activeOptionIndex].id === l : false, u = n2.comboboxPropsRef.current.value === r, c = React2.useRef({ disabled: t, value: r });
    x(() => {
      c.current.disabled = t;
    }, [c, t]), x(() => {
      c.current.value = r;
    }, [c, r]), x(() => {
      var P, C;
      c.current.textValue = (C = (P = document.getElementById(l)) == null ? void 0 : P.textContent) == null ? void 0 : C.toLowerCase();
    }, [c, l]);
    let m2 = React2.useCallback(() => a.selectOption(l), [a, l]);
    x(() => (i({ type: 4, id: l, dataRef: c }), () => i({ type: 5, id: l })), [c, l]), x(() => {
      n2.comboboxState === 0 && (!u || i({ type: 3, focus: 4, id: l }));
    }, [n2.comboboxState, u, l]), x(() => {
      if (n2.comboboxState !== 0 || !s)
        return;
      let P = k();
      return P.requestAnimationFrame(() => {
        var C, R;
        (R = (C = document.getElementById(l)) == null ? void 0 : C.scrollIntoView) == null || R.call(C, { block: "nearest" });
      }), P.dispose;
    }, [l, s, n2.comboboxState, n2.activeOptionIndex]);
    let b = React2.useCallback((P) => {
      if (t)
        return P.preventDefault();
      m2(), i({ type: 1 }), k().nextFrame(() => {
        var C;
        return (C = n2.inputRef.current) == null ? void 0 : C.focus({ preventScroll: true });
      });
    }, [i, n2.inputRef, t, m2]), T = React2.useCallback(() => {
      if (t)
        return i({ type: 3, focus: 5 });
      i({ type: 3, focus: 4, id: l });
    }, [t, l, i]), y = React2.useCallback(() => {
      t || s || i({ type: 3, focus: 4, id: l });
    }, [t, s, l, i]), p2 = React2.useCallback(() => {
      t || !s || n2.optionsPropsRef.current.hold || i({ type: 3, focus: 5 });
    }, [t, s, i, n2.comboboxState, n2.comboboxPropsRef]), f2 = React2.useMemo(() => ({ active: s, selected: u, disabled: t }), [s, u, t]);
    return E({ props: __spreadValues(__spreadValues({}, o), { id: l, role: "option", tabIndex: t === true ? void 0 : -1, "aria-disabled": t === true ? true : void 0, "aria-selected": u === true ? true : void 0, disabled: void 0, onClick: b, onFocus: T, onPointerMove: y, onMouseMove: y, onPointerLeave: p2, onMouseLeave: p2 }), slot: f2, defaultTag: Ur, name: "Combobox.Option" });
  }
  Object.assign(Ir, { Input: Dr, Button: Fr, Label: kr, Options: Hr, Option: Br });
  var Et = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e) => `${e}:not([tabindex='-1'])`).join(",");
  function xe(e = document.body) {
    return e == null ? [] : Array.from(e.querySelectorAll(Et));
  }
  function de(e, t = 0) {
    return e === document.body ? false : S(t, { [0]() {
      return e.matches(Et);
    }, [1]() {
      let r = e;
      for (; r !== null; ) {
        if (r.matches(Et))
          return true;
        r = r.parentElement;
      }
      return false;
    } });
  }
  function ce(e) {
    e == null || e.focus({ preventScroll: true });
  }
  function M(e, t) {
    let r = Array.isArray(e) ? e.slice().sort((c, m2) => {
      let b = c.compareDocumentPosition(m2);
      return b & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : b & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    }) : xe(e), o = document.activeElement, n2 = (() => {
      if (t & (1 | 4))
        return 1;
      if (t & (2 | 8))
        return -1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), i = (() => {
      if (t & 1)
        return 0;
      if (t & 2)
        return Math.max(0, r.indexOf(o)) - 1;
      if (t & 4)
        return Math.max(0, r.indexOf(o)) + 1;
      if (t & 8)
        return r.length - 1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), a = t & 32 ? { preventScroll: true } : {}, l = 0, s = r.length, u;
    do {
      if (l >= s || l + s <= 0)
        return 0;
      let c = i + l;
      if (t & 16)
        c = (c + s) % s;
      else {
        if (c < 0)
          return 3;
        if (c >= s)
          return 1;
      }
      u = r[c], u == null || u.focus(a), l += n2;
    } while (u !== document.activeElement);
    return u.hasAttribute("tabindex") || u.setAttribute("tabindex", "0"), 2;
  }
  function Be() {
    let e = React2.useRef(false);
    return React2.useEffect(() => (e.current = true, () => {
      e.current = false;
    }), []), e;
  }
  function Ne(e, t = 30, { initialFocus: r, containers: o } = {}) {
    let n2 = React2.useRef(typeof window != "undefined" ? document.activeElement : null), i = React2.useRef(null), a = Be(), l = Boolean(t & 16), s = Boolean(t & 2);
    React2.useEffect(() => {
      !l || (n2.current = document.activeElement);
    }, [l]), React2.useEffect(() => {
      if (!!l)
        return () => {
          ce(n2.current), n2.current = null;
        };
    }, [l]), React2.useEffect(() => {
      if (!s || !e.current)
        return;
      let u = document.activeElement;
      if (r == null ? void 0 : r.current) {
        if ((r == null ? void 0 : r.current) === u) {
          i.current = u;
          return;
        }
      } else if (e.current.contains(u)) {
        i.current = u;
        return;
      }
      (r == null ? void 0 : r.current) ? ce(r.current) : M(e.current, 1) === 0 && console.warn("There are no focusable elements inside the <FocusTrap />"), i.current = document.activeElement;
    }, [e, r, s]), w("keydown", (u) => {
      !(t & 4) || !e.current || u.key === "Tab" && (u.preventDefault(), M(e.current, (u.shiftKey ? 2 : 4) | 16) === 2 && (i.current = document.activeElement));
    }), w("focus", (u) => {
      if (!(t & 8))
        return;
      let c = new Set(o == null ? void 0 : o.current);
      if (c.add(e), !c.size)
        return;
      let m2 = i.current;
      if (!m2 || !a.current)
        return;
      let b = u.target;
      b && b instanceof HTMLElement ? Kr(c, b) ? (i.current = b, ce(b)) : (u.preventDefault(), u.stopPropagation(), ce(m2)) : ce(i.current);
    }, true);
  }
  function Kr(e, t) {
    var r;
    for (let o of e)
      if ((r = o.current) == null ? void 0 : r.contains(t))
        return true;
    return false;
  }
  var fe = /* @__PURE__ */ new Set(), J = /* @__PURE__ */ new Map();
  function po(e) {
    e.setAttribute("aria-hidden", "true"), e.inert = true;
  }
  function co(e) {
    let t = J.get(e);
    !t || (t["aria-hidden"] === null ? e.removeAttribute("aria-hidden") : e.setAttribute("aria-hidden", t["aria-hidden"]), e.inert = t.inert);
  }
  function fo(e, t = true) {
    x(() => {
      if (!t || !e.current)
        return;
      let r = e.current;
      fe.add(r);
      for (let o of J.keys())
        o.contains(r) && (co(o), J.delete(o));
      return document.querySelectorAll("body > *").forEach((o) => {
        if (o instanceof HTMLElement) {
          for (let n2 of fe)
            if (o.contains(n2))
              return;
          fe.size === 1 && (J.set(o, { "aria-hidden": o.getAttribute("aria-hidden"), inert: o.inert }), po(o));
        }
      }), () => {
        if (fe.delete(r), fe.size > 0)
          document.querySelectorAll("body > *").forEach((o) => {
            if (o instanceof HTMLElement && !J.has(o)) {
              for (let n2 of fe)
                if (o.contains(n2))
                  return;
              J.set(o, { "aria-hidden": o.getAttribute("aria-hidden"), inert: o.inert }), po(o);
            }
          });
        else
          for (let o of J.keys())
            co(o), J.delete(o);
      };
    }, [t]);
  }
  var mo = React2.createContext(false);
  function bo() {
    return React2.useContext(mo);
  }
  function At(e) {
    return React__default["default"].createElement(mo.Provider, { value: e.force }, e.children);
  }
  function Xr() {
    let e = bo(), t = React2.useContext(Po), [r, o] = React2.useState(() => {
      if (!e && t !== null || typeof window == "undefined")
        return null;
      let n2 = document.getElementById("headlessui-portal-root");
      if (n2)
        return n2;
      let i = document.createElement("div");
      return i.setAttribute("id", "headlessui-portal-root"), document.body.appendChild(i);
    });
    return React2.useEffect(() => {
      r !== null && (document.body.contains(r) || document.body.appendChild(r));
    }, [r]), React2.useEffect(() => {
      e || t !== null && o(t.current);
    }, [t, o, e]), r;
  }
  var Jr = React2.Fragment;
  function We(e) {
    let t = e, r = Xr(), [o] = React2.useState(() => typeof window == "undefined" ? null : document.createElement("div")), n2 = q$1();
    return x(() => {
      if (!!r && !!o)
        return r.appendChild(o), () => {
          var i;
          !r || !o || (r.removeChild(o), r.childNodes.length <= 0 && ((i = r.parentElement) == null || i.removeChild(r)));
        };
    }, [r, o]), n2 ? !r || !o ? null : ReactDOM2.createPortal(E({ props: t, defaultTag: Jr, name: "Portal" }), o) : null;
  }
  var Zr = React2.Fragment, Po = React2.createContext(null);
  function en(e) {
    let _a2 = e, { target: t } = _a2, r = __objRest(_a2, ["target"]);
    return React__default["default"].createElement(Po.Provider, { value: t }, E({ props: r, defaultTag: Zr, name: "Popover.Group" }));
  }
  We.Group = en;
  var vo = React2.createContext(null);
  function Ro() {
    let e = React2.useContext(vo);
    if (e === null) {
      let t = new Error("You used a <Description /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t, Ro), t;
    }
    return e;
  }
  function re() {
    let [e, t] = React2.useState([]);
    return [e.length > 0 ? e.join(" ") : void 0, React2.useMemo(() => function(o) {
      let n2 = React2.useCallback((a) => (t((l) => [...l, a]), () => t((l) => {
        let s = l.slice(), u = s.indexOf(a);
        return u !== -1 && s.splice(u, 1), s;
      })), []), i = React2.useMemo(() => ({ register: n2, slot: o.slot, name: o.name, props: o.props }), [n2, o.slot, o.name, o.props]);
      return React__default["default"].createElement(vo.Provider, { value: i }, o.children);
    }, [t])];
  }
  var an = "p";
  function me(e) {
    let t = Ro(), r = `headlessui-description-${A()}`;
    x(() => t.register(r), [r, t.register]);
    let o = e, n2 = __spreadProps(__spreadValues({}, t.props), { id: r });
    return E({ props: __spreadValues(__spreadValues({}, o), n2), slot: t.slot || {}, defaultTag: an, name: t.name || "Description" });
  }
  var ht = React2.createContext(() => {
  });
  ht.displayName = "StackContext";
  function cn() {
    return React2.useContext(ht);
  }
  function Eo({ children: e, onUpdate: t, type: r, element: o }) {
    let n2 = cn(), i = React2.useCallback((...a) => {
      t == null || t(...a), n2(...a);
    }, [n2, t]);
    return x(() => (i(0, r, o), () => i(1, r, o)), [i, r, o]), React__default["default"].createElement(ht.Provider, { value: i }, e);
  }
  var yn = { [0](e, t) {
    return e.titleId === t.id ? e : __spreadProps(__spreadValues({}, e), { titleId: t.id });
  } }, Ve = React2.createContext(null);
  Ve.displayName = "DialogContext";
  function It(e) {
    let t = React2.useContext(Ve);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${An.displayName} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, It), r;
    }
    return t;
  }
  function gn(e, t) {
    return S(t.type, yn, e, t);
  }
  var Pn = "div", xn = 1 | 2, vn = D(function(t, r) {
    let _a2 = t, { open: o, onClose: n2, initialFocus: i } = _a2, a = __objRest(_a2, ["open", "onClose", "initialFocus"]), [l, s] = React2.useState(0), u = _();
    o === void 0 && u !== null && (o = S(u, { [0]: true, [1]: false }));
    let c = React2.useRef(/* @__PURE__ */ new Set()), m2 = React2.useRef(null), b = I(m2, r), T = t.hasOwnProperty("open") || u !== null, y = t.hasOwnProperty("onClose");
    if (!T && !y)
      throw new Error("You have to provide an `open` and an `onClose` prop to the `Dialog` component.");
    if (!T)
      throw new Error("You provided an `onClose` prop to the `Dialog`, but forgot an `open` prop.");
    if (!y)
      throw new Error("You provided an `open` prop to the `Dialog`, but forgot an `onClose` prop.");
    if (typeof o != "boolean")
      throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${o}`);
    if (typeof n2 != "function")
      throw new Error(`You provided an \`onClose\` prop to the \`Dialog\`, but the value is not a function. Received: ${n2}`);
    let p2 = o ? 0 : 1, f2 = (() => u !== null ? u === 0 : p2 === 0)(), [d, P] = React2.useReducer(gn, { titleId: null, descriptionId: null }), C = React2.useCallback(() => n2(false), [n2]), R = React2.useCallback((F) => P({ type: 0, id: F }), [P]), v = q$1() && p2 === 0, h2 = l > 1, O = React2.useContext(Ve) !== null;
    Ne(m2, v ? S(h2 ? "parent" : "leaf", { parent: 16, leaf: 30 }) : 1, { initialFocus: i, containers: c }), fo(m2, h2 ? v : false), w("mousedown", (F) => {
      var H;
      let $ = F.target;
      p2 === 0 && (h2 || ((H = m2.current) == null ? void 0 : H.contains($)) || C());
    }), w("keydown", (F) => {
      F.key === "Escape" && p2 === 0 && (h2 || (F.preventDefault(), F.stopPropagation(), C()));
    }), React2.useEffect(() => {
      if (p2 !== 0 || O)
        return;
      let F = document.documentElement.style.overflow, $ = document.documentElement.style.paddingRight, H = window.innerWidth - document.documentElement.clientWidth;
      return document.documentElement.style.overflow = "hidden", document.documentElement.style.paddingRight = `${H}px`, () => {
        document.documentElement.style.overflow = F, document.documentElement.style.paddingRight = $;
      };
    }, [p2, O]), React2.useEffect(() => {
      if (p2 !== 0 || !m2.current)
        return;
      let F = new IntersectionObserver(($) => {
        for (let H of $)
          H.boundingClientRect.x === 0 && H.boundingClientRect.y === 0 && H.boundingClientRect.width === 0 && H.boundingClientRect.height === 0 && C();
      });
      return F.observe(m2.current), () => F.disconnect();
    }, [p2, m2, C]);
    let [N, K] = re(), V = `headlessui-dialog-${A()}`, Fe = React2.useMemo(() => [{ dialogState: p2, close: C, setTitleId: R }, d], [p2, d, C, R]), ge = React2.useMemo(() => ({ open: p2 === 0 }), [p2]), we = { ref: b, id: V, role: "dialog", "aria-modal": p2 === 0 ? true : void 0, "aria-labelledby": d.titleId, "aria-describedby": N, onClick(F) {
      F.stopPropagation();
    } }, X = a;
    return React__default["default"].createElement(Eo, { type: "Dialog", element: m2, onUpdate: React2.useCallback((F, $, H) => {
      $ === "Dialog" && S(F, { [0]() {
        c.current.add(H), s((Pe) => Pe + 1);
      }, [1]() {
        c.current.add(H), s((Pe) => Pe - 1);
      } });
    }, []) }, React__default["default"].createElement(At, { force: true }, React__default["default"].createElement(We, null, React__default["default"].createElement(Ve.Provider, { value: Fe }, React__default["default"].createElement(We.Group, { target: m2 }, React__default["default"].createElement(At, { force: false }, React__default["default"].createElement(K, { slot: ge, name: "Dialog.Description" }, E({ props: __spreadValues(__spreadValues({}, X), we), slot: ge, defaultTag: Pn, features: xn, visible: f2, name: "Dialog" }))))))));
  }), Rn = "div", En = D(function(t, r) {
    let [{ dialogState: o, close: n2 }] = It("Dialog.Overlay"), i = I(r), a = `headlessui-dialog-overlay-${A()}`, l = React2.useCallback((m2) => {
      if (m2.target === m2.currentTarget) {
        if (G(m2.currentTarget))
          return m2.preventDefault();
        m2.preventDefault(), m2.stopPropagation(), n2();
      }
    }, [n2]), s = React2.useMemo(() => ({ open: o === 0 }), [o]);
    return E({ props: __spreadValues(__spreadValues({}, t), { ref: i, id: a, "aria-hidden": true, onClick: l }), slot: s, defaultTag: Rn, name: "Dialog.Overlay" });
  }), Cn = "h2";
  function Sn(e) {
    let [{ dialogState: t, setTitleId: r }] = It("Dialog.Title"), o = `headlessui-dialog-title-${A()}`;
    React2.useEffect(() => (r(o), () => r(null)), [o, r]);
    let n2 = React2.useMemo(() => ({ open: t === 0 }), [t]);
    return E({ props: __spreadValues(__spreadValues({}, e), { id: o }), slot: n2, defaultTag: Cn, name: "Dialog.Title" });
  }
  var An = Object.assign(vn, { Overlay: En, Title: Sn, Description: me });
  var Ln = { [0]: (e) => __spreadProps(__spreadValues({}, e), { disclosureState: S(e.disclosureState, { [0]: 1, [1]: 0 }) }), [1]: (e) => e.disclosureState === 1 ? e : __spreadProps(__spreadValues({}, e), { disclosureState: 1 }), [4](e) {
    return e.linkedPanel === true ? e : __spreadProps(__spreadValues({}, e), { linkedPanel: true });
  }, [5](e) {
    return e.linkedPanel === false ? e : __spreadProps(__spreadValues({}, e), { linkedPanel: false });
  }, [2](e, t) {
    return e.buttonId === t.buttonId ? e : __spreadProps(__spreadValues({}, e), { buttonId: t.buttonId });
  }, [3](e, t) {
    return e.panelId === t.panelId ? e : __spreadProps(__spreadValues({}, e), { panelId: t.panelId });
  } }, Mt = React2.createContext(null);
  Mt.displayName = "DisclosureContext";
  function Ft(e) {
    let t = React2.useContext(Mt);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${Ye.name} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, Ft), r;
    }
    return t;
  }
  var wt = React2.createContext(null);
  wt.displayName = "DisclosureAPIContext";
  function Ao(e) {
    let t = React2.useContext(wt);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${Ye.name} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, Ao), r;
    }
    return t;
  }
  var kt = React2.createContext(null);
  kt.displayName = "DisclosurePanelContext";
  function Dn() {
    return React2.useContext(kt);
  }
  function Mn(e, t) {
    return S(t.type, Ln, e, t);
  }
  var Fn = React2.Fragment;
  function Ye(e) {
    let _a2 = e, { defaultOpen: t = false } = _a2, r = __objRest(_a2, ["defaultOpen"]), o = `headlessui-disclosure-button-${A()}`, n2 = `headlessui-disclosure-panel-${A()}`, i = React2.useReducer(Mn, { disclosureState: t ? 0 : 1, linkedPanel: false, buttonId: o, panelId: n2 }), [{ disclosureState: a }, l] = i;
    React2.useEffect(() => l({ type: 2, buttonId: o }), [o, l]), React2.useEffect(() => l({ type: 3, panelId: n2 }), [n2, l]);
    let s = React2.useCallback((m2) => {
      l({ type: 1 });
      let b = (() => m2 ? m2 instanceof HTMLElement ? m2 : m2.current instanceof HTMLElement ? m2.current : document.getElementById(o) : document.getElementById(o))();
      b == null || b.focus();
    }, [l, o]), u = React2.useMemo(() => ({ close: s }), [s]), c = React2.useMemo(() => ({ open: a === 0, close: s }), [a, s]);
    return React__default["default"].createElement(Mt.Provider, { value: i }, React__default["default"].createElement(wt.Provider, { value: u }, React__default["default"].createElement(W, { value: S(a, { [0]: 0, [1]: 1 }) }, E({ props: r, slot: c, defaultTag: Fn, name: "Disclosure" }))));
  }
  var wn = "button", kn = D(function(t, r) {
    let [o, n2] = Ft("Disclosure.Button"), i = React2.useRef(null), a = I(i, r), l = Dn(), s = l === null ? false : l === o.panelId, u = React2.useCallback((f2) => {
      var d;
      if (s) {
        if (o.disclosureState === 1)
          return;
        switch (f2.key) {
          case " ":
          case "Enter":
            f2.preventDefault(), f2.stopPropagation(), n2({ type: 0 }), (d = document.getElementById(o.buttonId)) == null || d.focus();
            break;
        }
      } else
        switch (f2.key) {
          case " ":
          case "Enter":
            f2.preventDefault(), f2.stopPropagation(), n2({ type: 0 });
            break;
        }
    }, [n2, s, o.disclosureState, o.buttonId]), c = React2.useCallback((f2) => {
      switch (f2.key) {
        case " ":
          f2.preventDefault();
          break;
      }
    }, []), m2 = React2.useCallback((f2) => {
      var d;
      G(f2.currentTarget) || t.disabled || (s ? (n2({ type: 0 }), (d = document.getElementById(o.buttonId)) == null || d.focus()) : n2({ type: 0 }));
    }, [n2, t.disabled, o.buttonId, s]), b = React2.useMemo(() => ({ open: o.disclosureState === 0 }), [o]), T = U(t, i), y = t, p2 = s ? { ref: a, type: T, onKeyDown: u, onClick: m2 } : { ref: a, id: o.buttonId, type: T, "aria-expanded": t.disabled ? void 0 : o.disclosureState === 0, "aria-controls": o.linkedPanel ? o.panelId : void 0, onKeyDown: u, onKeyUp: c, onClick: m2 };
    return E({ props: __spreadValues(__spreadValues({}, y), p2), slot: b, defaultTag: wn, name: "Disclosure.Button" });
  }), _n = "div", Gn = 1 | 2, Hn = D(function(t, r) {
    let [o, n2] = Ft("Disclosure.Panel"), { close: i } = Ao("Disclosure.Panel"), a = I(r, () => {
      o.linkedPanel || n2({ type: 4 });
    }), l = _(), s = (() => l !== null ? l === 0 : o.disclosureState === 0)();
    React2.useEffect(() => () => n2({ type: 5 }), [n2]), React2.useEffect(() => {
      var b;
      o.disclosureState === 1 && ((b = t.unmount) != null ? b : true) && n2({ type: 5 });
    }, [o.disclosureState, t.unmount, n2]);
    let u = React2.useMemo(() => ({ open: o.disclosureState === 0, close: i }), [o, i]), c = { ref: a, id: o.panelId }, m2 = t;
    return React__default["default"].createElement(kt.Provider, { value: o.panelId }, E({ props: __spreadValues(__spreadValues({}, m2), c), slot: u, defaultTag: _n, features: Gn, visible: s, name: "Disclosure.Panel" }));
  });
  Ye.Button = kn;
  Ye.Panel = Hn;
  var $n = { [1](e) {
    return e.disabled || e.listboxState === 1 ? e : __spreadProps(__spreadValues({}, e), { activeOptionIndex: null, listboxState: 1 });
  }, [0](e) {
    return e.disabled || e.listboxState === 0 ? e : __spreadProps(__spreadValues({}, e), { listboxState: 0 });
  }, [2](e, t) {
    return e.disabled === t.disabled ? e : __spreadProps(__spreadValues({}, e), { disabled: t.disabled });
  }, [3](e, t) {
    return e.orientation === t.orientation ? e : __spreadProps(__spreadValues({}, e), { orientation: t.orientation });
  }, [4](e, t) {
    if (e.disabled || e.listboxState === 1)
      return e;
    let r = ae(t, { resolveItems: () => e.options, resolveActiveIndex: () => e.activeOptionIndex, resolveId: (o) => o.id, resolveDisabled: (o) => o.dataRef.current.disabled });
    return e.searchQuery === "" && e.activeOptionIndex === r ? e : __spreadProps(__spreadValues({}, e), { searchQuery: "", activeOptionIndex: r });
  }, [5]: (e, t) => {
    if (e.disabled || e.listboxState === 1)
      return e;
    let o = e.searchQuery !== "" ? 0 : 1, n2 = e.searchQuery + t.value.toLowerCase(), a = (e.activeOptionIndex !== null ? e.options.slice(e.activeOptionIndex + o).concat(e.options.slice(0, e.activeOptionIndex + o)) : e.options).find((s) => {
      var u;
      return !s.dataRef.current.disabled && ((u = s.dataRef.current.textValue) == null ? void 0 : u.startsWith(n2));
    }), l = a ? e.options.indexOf(a) : -1;
    return l === -1 || l === e.activeOptionIndex ? __spreadProps(__spreadValues({}, e), { searchQuery: n2 }) : __spreadProps(__spreadValues({}, e), { searchQuery: n2, activeOptionIndex: l });
  }, [6](e) {
    return e.disabled || e.listboxState === 1 || e.searchQuery === "" ? e : __spreadProps(__spreadValues({}, e), { searchQuery: "" });
  }, [7]: (e, t) => {
    var n2;
    let r = Array.from((n2 = e.optionsRef.current) == null ? void 0 : n2.querySelectorAll('[id^="headlessui-listbox-option-"]')).reduce((i, a, l) => Object.assign(i, { [a.id]: l }), {}), o = [...e.options, { id: t.id, dataRef: t.dataRef }].sort((i, a) => r[i.id] - r[a.id]);
    return __spreadProps(__spreadValues({}, e), { options: o });
  }, [8]: (e, t) => {
    let r = e.options.slice(), o = e.activeOptionIndex !== null ? r[e.activeOptionIndex] : null, n2 = r.findIndex((i) => i.id === t.id);
    return n2 !== -1 && r.splice(n2, 1), __spreadProps(__spreadValues({}, e), { options: r, activeOptionIndex: (() => n2 === e.activeOptionIndex || o === null ? null : r.indexOf(o))() });
  } }, Gt = React2.createContext(null);
  Gt.displayName = "ListboxContext";
  function Re(e) {
    let t = React2.useContext(Gt);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${Ee.name} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, Re), r;
    }
    return t;
  }
  function Qn(e, t) {
    return S(t.type, $n, e, t);
  }
  var qn = React2.Fragment;
  function Ee(e) {
    let _a2 = e, { value: t, onChange: r, disabled: o = false, horizontal: n2 = false } = _a2, i = __objRest(_a2, ["value", "onChange", "disabled", "horizontal"]), a = n2 ? "horizontal" : "vertical", l = React2.useReducer(Qn, { listboxState: 1, propsRef: { current: { value: t, onChange: r } }, labelRef: React2.createRef(), buttonRef: React2.createRef(), optionsRef: React2.createRef(), disabled: o, orientation: a, options: [], searchQuery: "", activeOptionIndex: null }), [{ listboxState: s, propsRef: u, optionsRef: c, buttonRef: m2 }, b] = l;
    x(() => {
      u.current.value = t;
    }, [t, u]), x(() => {
      u.current.onChange = r;
    }, [r, u]), x(() => b({ type: 2, disabled: o }), [o]), x(() => b({ type: 3, orientation: a }), [a]), w("mousedown", (y) => {
      var f2, d, P;
      let p2 = y.target;
      s === 0 && (((f2 = m2.current) == null ? void 0 : f2.contains(p2)) || ((d = c.current) == null ? void 0 : d.contains(p2)) || (b({ type: 1 }), de(p2, 1) || (y.preventDefault(), (P = m2.current) == null || P.focus())));
    });
    let T = React2.useMemo(() => ({ open: s === 0, disabled: o }), [s, o]);
    return React__default["default"].createElement(Gt.Provider, { value: l }, React__default["default"].createElement(W, { value: S(s, { [0]: 0, [1]: 1 }) }, E({ props: i, slot: T, defaultTag: qn, name: "Listbox" })));
  }
  var zn = "button", Yn = D(function(t, r) {
    var p2;
    let [o, n2] = Re("Listbox.Button"), i = I(o.buttonRef, r), a = `headlessui-listbox-button-${A()}`, l = Q(), s = React2.useCallback((f2) => {
      switch (f2.key) {
        case " ":
        case "Enter":
        case "ArrowDown":
          f2.preventDefault(), n2({ type: 0 }), l.nextFrame(() => {
            o.propsRef.current.value || n2({ type: 4, focus: 0 });
          });
          break;
        case "ArrowUp":
          f2.preventDefault(), n2({ type: 0 }), l.nextFrame(() => {
            o.propsRef.current.value || n2({ type: 4, focus: 3 });
          });
          break;
      }
    }, [n2, o, l]), u = React2.useCallback((f2) => {
      switch (f2.key) {
        case " ":
          f2.preventDefault();
          break;
      }
    }, []), c = React2.useCallback((f2) => {
      if (G(f2.currentTarget))
        return f2.preventDefault();
      o.listboxState === 0 ? (n2({ type: 1 }), l.nextFrame(() => {
        var d;
        return (d = o.buttonRef.current) == null ? void 0 : d.focus({ preventScroll: true });
      })) : (f2.preventDefault(), n2({ type: 0 }));
    }, [n2, l, o]), m2 = ee(() => {
      if (!!o.labelRef.current)
        return [o.labelRef.current.id, a].join(" ");
    }, [o.labelRef.current, a]), b = React2.useMemo(() => ({ open: o.listboxState === 0, disabled: o.disabled }), [o]), T = t, y = { ref: i, id: a, type: U(t, o.buttonRef), "aria-haspopup": true, "aria-controls": (p2 = o.optionsRef.current) == null ? void 0 : p2.id, "aria-expanded": o.disabled ? void 0 : o.listboxState === 0, "aria-labelledby": m2, disabled: o.disabled, onKeyDown: s, onKeyUp: u, onClick: c };
    return E({ props: __spreadValues(__spreadValues({}, T), y), slot: b, defaultTag: zn, name: "Listbox.Button" });
  }), Xn = "label";
  function Jn(e) {
    let [t] = Re("Listbox.Label"), r = `headlessui-listbox-label-${A()}`, o = React2.useCallback(() => {
      var a;
      return (a = t.buttonRef.current) == null ? void 0 : a.focus({ preventScroll: true });
    }, [t.buttonRef]), n2 = React2.useMemo(() => ({ open: t.listboxState === 0, disabled: t.disabled }), [t]), i = { ref: t.labelRef, id: r, onClick: o };
    return E({ props: __spreadValues(__spreadValues({}, e), i), slot: n2, defaultTag: Xn, name: "Listbox.Label" });
  }
  var Zn = "ul", ei = 1 | 2, ti = D(function(t, r) {
    var f2;
    let [o, n2] = Re("Listbox.Options"), i = I(o.optionsRef, r), a = `headlessui-listbox-options-${A()}`, l = Q(), s = Q(), u = _(), c = (() => u !== null ? u === 0 : o.listboxState === 0)();
    x(() => {
      let d = o.optionsRef.current;
      !d || o.listboxState === 0 && d !== document.activeElement && d.focus({ preventScroll: true });
    }, [o.listboxState, o.optionsRef]);
    let m2 = React2.useCallback((d) => {
      switch (s.dispose(), d.key) {
        case " ":
          if (o.searchQuery !== "")
            return d.preventDefault(), d.stopPropagation(), n2({ type: 5, value: d.key });
        case "Enter":
          if (d.preventDefault(), d.stopPropagation(), n2({ type: 1 }), o.activeOptionIndex !== null) {
            let { dataRef: P } = o.options[o.activeOptionIndex];
            o.propsRef.current.onChange(P.current.value);
          }
          k().nextFrame(() => {
            var P;
            return (P = o.buttonRef.current) == null ? void 0 : P.focus({ preventScroll: true });
          });
          break;
        case S(o.orientation, { vertical: "ArrowDown", horizontal: "ArrowRight" }):
          return d.preventDefault(), d.stopPropagation(), n2({ type: 4, focus: 2 });
        case S(o.orientation, { vertical: "ArrowUp", horizontal: "ArrowLeft" }):
          return d.preventDefault(), d.stopPropagation(), n2({ type: 4, focus: 1 });
        case "Home":
        case "PageUp":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 4, focus: 0 });
        case "End":
        case "PageDown":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 4, focus: 3 });
        case "Escape":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 1 }), l.nextFrame(() => {
            var P;
            return (P = o.buttonRef.current) == null ? void 0 : P.focus({ preventScroll: true });
          });
        case "Tab":
          d.preventDefault(), d.stopPropagation();
          break;
        default:
          d.key.length === 1 && (n2({ type: 5, value: d.key }), s.setTimeout(() => n2({ type: 6 }), 350));
          break;
      }
    }, [l, n2, s, o]), b = ee(() => {
      var d, P, C;
      return (C = (d = o.labelRef.current) == null ? void 0 : d.id) != null ? C : (P = o.buttonRef.current) == null ? void 0 : P.id;
    }, [o.labelRef.current, o.buttonRef.current]), T = React2.useMemo(() => ({ open: o.listboxState === 0 }), [o]), y = { "aria-activedescendant": o.activeOptionIndex === null || (f2 = o.options[o.activeOptionIndex]) == null ? void 0 : f2.id, "aria-labelledby": b, "aria-orientation": o.orientation, id: a, onKeyDown: m2, role: "listbox", tabIndex: 0, ref: i };
    return E({ props: __spreadValues(__spreadValues({}, t), y), slot: T, defaultTag: Zn, features: ei, visible: c, name: "Listbox.Options" });
  }), oi = "li";
  function ri(e) {
    let _a2 = e, { disabled: t = false, value: r } = _a2, o = __objRest(_a2, ["disabled", "value"]), [n2, i] = Re("Listbox.Option"), a = `headlessui-listbox-option-${A()}`, l = n2.activeOptionIndex !== null ? n2.options[n2.activeOptionIndex].id === a : false, s = n2.propsRef.current.value === r, u = React2.useRef({ disabled: t, value: r });
    x(() => {
      u.current.disabled = t;
    }, [u, t]), x(() => {
      u.current.value = r;
    }, [u, r]), x(() => {
      var d, P;
      u.current.textValue = (P = (d = document.getElementById(a)) == null ? void 0 : d.textContent) == null ? void 0 : P.toLowerCase();
    }, [u, a]);
    let c = React2.useCallback(() => n2.propsRef.current.onChange(r), [n2.propsRef, r]);
    x(() => (i({ type: 7, id: a, dataRef: u }), () => i({ type: 8, id: a })), [u, a]), x(() => {
      var d, P;
      n2.listboxState === 0 && (!s || (i({ type: 4, focus: 4, id: a }), (P = (d = document.getElementById(a)) == null ? void 0 : d.focus) == null || P.call(d)));
    }, [n2.listboxState]), x(() => {
      if (n2.listboxState !== 0 || !l)
        return;
      let d = k();
      return d.requestAnimationFrame(() => {
        var P, C;
        (C = (P = document.getElementById(a)) == null ? void 0 : P.scrollIntoView) == null || C.call(P, { block: "nearest" });
      }), d.dispose;
    }, [a, l, n2.listboxState, n2.activeOptionIndex]);
    let m2 = React2.useCallback((d) => {
      if (t)
        return d.preventDefault();
      c(), i({ type: 1 }), k().nextFrame(() => {
        var P;
        return (P = n2.buttonRef.current) == null ? void 0 : P.focus({ preventScroll: true });
      });
    }, [i, n2.buttonRef, t, c]), b = React2.useCallback(() => {
      if (t)
        return i({ type: 4, focus: 5 });
      i({ type: 4, focus: 4, id: a });
    }, [t, a, i]), T = React2.useCallback(() => {
      t || l || i({ type: 4, focus: 4, id: a });
    }, [t, l, a, i]), y = React2.useCallback(() => {
      t || !l || i({ type: 4, focus: 5 });
    }, [t, l, i]), p2 = React2.useMemo(() => ({ active: l, selected: s, disabled: t }), [l, s, t]);
    return E({ props: __spreadValues(__spreadValues({}, o), { id: a, role: "option", tabIndex: t === true ? void 0 : -1, "aria-disabled": t === true ? true : void 0, "aria-selected": s === true ? true : void 0, disabled: void 0, onClick: m2, onFocus: b, onPointerMove: T, onMouseMove: T, onPointerLeave: y, onMouseLeave: y }), slot: p2, defaultTag: oi, name: "Listbox.Option" });
  }
  Ee.Button = Yn;
  Ee.Label = Jn;
  Ee.Options = ti;
  Ee.Option = ri;
  var ui = { [1](e) {
    return e.menuState === 1 ? e : __spreadProps(__spreadValues({}, e), { activeItemIndex: null, menuState: 1 });
  }, [0](e) {
    return e.menuState === 0 ? e : __spreadProps(__spreadValues({}, e), { menuState: 0 });
  }, [2]: (e, t) => {
    let r = ae(t, { resolveItems: () => e.items, resolveActiveIndex: () => e.activeItemIndex, resolveId: (o) => o.id, resolveDisabled: (o) => o.dataRef.current.disabled });
    return e.searchQuery === "" && e.activeItemIndex === r ? e : __spreadProps(__spreadValues({}, e), { searchQuery: "", activeItemIndex: r });
  }, [3]: (e, t) => {
    let o = e.searchQuery !== "" ? 0 : 1, n2 = e.searchQuery + t.value.toLowerCase(), a = (e.activeItemIndex !== null ? e.items.slice(e.activeItemIndex + o).concat(e.items.slice(0, e.activeItemIndex + o)) : e.items).find((s) => {
      var u;
      return ((u = s.dataRef.current.textValue) == null ? void 0 : u.startsWith(n2)) && !s.dataRef.current.disabled;
    }), l = a ? e.items.indexOf(a) : -1;
    return l === -1 || l === e.activeItemIndex ? __spreadProps(__spreadValues({}, e), { searchQuery: n2 }) : __spreadProps(__spreadValues({}, e), { searchQuery: n2, activeItemIndex: l });
  }, [4](e) {
    return e.searchQuery === "" ? e : __spreadProps(__spreadValues({}, e), { searchQuery: "", searchActiveItemIndex: null });
  }, [5]: (e, t) => {
    var n2;
    let r = Array.from((n2 = e.itemsRef.current) == null ? void 0 : n2.querySelectorAll('[id^="headlessui-menu-item-"]')).reduce((i, a, l) => Object.assign(i, { [a.id]: l }), {}), o = [...e.items, { id: t.id, dataRef: t.dataRef }].sort((i, a) => r[i.id] - r[a.id]);
    return __spreadProps(__spreadValues({}, e), { items: o });
  }, [6]: (e, t) => {
    let r = e.items.slice(), o = e.activeItemIndex !== null ? r[e.activeItemIndex] : null, n2 = r.findIndex((i) => i.id === t.id);
    return n2 !== -1 && r.splice(n2, 1), __spreadProps(__spreadValues({}, e), { items: r, activeItemIndex: (() => n2 === e.activeItemIndex || o === null ? null : r.indexOf(o))() });
  } }, Ht = React2.createContext(null);
  Ht.displayName = "MenuContext";
  function Je(e) {
    let t = React2.useContext(Ht);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${Ze.name} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, Je), r;
    }
    return t;
  }
  function pi(e, t) {
    return S(t.type, ui, e, t);
  }
  var di = React2.Fragment;
  function Ze(e) {
    let t = React2.useReducer(pi, { menuState: 1, buttonRef: React2.createRef(), itemsRef: React2.createRef(), items: [], searchQuery: "", activeItemIndex: null }), [{ menuState: r, itemsRef: o, buttonRef: n2 }, i] = t;
    w("mousedown", (l) => {
      var u, c, m2;
      let s = l.target;
      r === 0 && (((u = n2.current) == null ? void 0 : u.contains(s)) || ((c = o.current) == null ? void 0 : c.contains(s)) || (i({ type: 1 }), de(s, 1) || (l.preventDefault(), (m2 = n2.current) == null || m2.focus())));
    });
    let a = React2.useMemo(() => ({ open: r === 0 }), [r]);
    return React__default["default"].createElement(Ht.Provider, { value: t }, React__default["default"].createElement(W, { value: S(r, { [0]: 0, [1]: 1 }) }, E({ props: e, slot: a, defaultTag: di, name: "Menu" })));
  }
  var ci = "button", fi = D(function(t, r) {
    var y;
    let [o, n2] = Je("Menu.Button"), i = I(o.buttonRef, r), a = `headlessui-menu-button-${A()}`, l = Q(), s = React2.useCallback((p2) => {
      switch (p2.key) {
        case " ":
        case "Enter":
        case "ArrowDown":
          p2.preventDefault(), p2.stopPropagation(), n2({ type: 0 }), l.nextFrame(() => n2({ type: 2, focus: 0 }));
          break;
        case "ArrowUp":
          p2.preventDefault(), p2.stopPropagation(), n2({ type: 0 }), l.nextFrame(() => n2({ type: 2, focus: 3 }));
          break;
      }
    }, [n2, l]), u = React2.useCallback((p2) => {
      switch (p2.key) {
        case " ":
          p2.preventDefault();
          break;
      }
    }, []), c = React2.useCallback((p2) => {
      if (G(p2.currentTarget))
        return p2.preventDefault();
      t.disabled || (o.menuState === 0 ? (n2({ type: 1 }), l.nextFrame(() => {
        var f2;
        return (f2 = o.buttonRef.current) == null ? void 0 : f2.focus({ preventScroll: true });
      })) : (p2.preventDefault(), p2.stopPropagation(), n2({ type: 0 })));
    }, [n2, l, o, t.disabled]), m2 = React2.useMemo(() => ({ open: o.menuState === 0 }), [o]), b = t, T = { ref: i, id: a, type: U(t, o.buttonRef), "aria-haspopup": true, "aria-controls": (y = o.itemsRef.current) == null ? void 0 : y.id, "aria-expanded": t.disabled ? void 0 : o.menuState === 0, onKeyDown: s, onKeyUp: u, onClick: c };
    return E({ props: __spreadValues(__spreadValues({}, b), T), slot: m2, defaultTag: ci, name: "Menu.Button" });
  }), mi = "div", bi = 1 | 2, Ti = D(function(t, r) {
    var p2, f2;
    let [o, n2] = Je("Menu.Items"), i = I(o.itemsRef, r), a = `headlessui-menu-items-${A()}`, l = Q(), s = _(), u = (() => s !== null ? s === 0 : o.menuState === 0)();
    React2.useEffect(() => {
      let d = o.itemsRef.current;
      !d || o.menuState === 0 && d !== document.activeElement && d.focus({ preventScroll: true });
    }, [o.menuState, o.itemsRef]), se({ container: o.itemsRef.current, enabled: o.menuState === 0, accept(d) {
      return d.getAttribute("role") === "menuitem" ? NodeFilter.FILTER_REJECT : d.hasAttribute("role") ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT;
    }, walk(d) {
      d.setAttribute("role", "none");
    } });
    let c = React2.useCallback((d) => {
      var P;
      switch (l.dispose(), d.key) {
        case " ":
          if (o.searchQuery !== "")
            return d.preventDefault(), d.stopPropagation(), n2({ type: 3, value: d.key });
        case "Enter":
          if (d.preventDefault(), d.stopPropagation(), n2({ type: 1 }), o.activeItemIndex !== null) {
            let { id: C } = o.items[o.activeItemIndex];
            (P = document.getElementById(C)) == null || P.click();
          }
          k().nextFrame(() => {
            var C;
            return (C = o.buttonRef.current) == null ? void 0 : C.focus({ preventScroll: true });
          });
          break;
        case "ArrowDown":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 2, focus: 2 });
        case "ArrowUp":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 2, focus: 1 });
        case "Home":
        case "PageUp":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 2, focus: 0 });
        case "End":
        case "PageDown":
          return d.preventDefault(), d.stopPropagation(), n2({ type: 2, focus: 3 });
        case "Escape":
          d.preventDefault(), d.stopPropagation(), n2({ type: 1 }), k().nextFrame(() => {
            var C;
            return (C = o.buttonRef.current) == null ? void 0 : C.focus({ preventScroll: true });
          });
          break;
        case "Tab":
          d.preventDefault(), d.stopPropagation();
          break;
        default:
          d.key.length === 1 && (n2({ type: 3, value: d.key }), l.setTimeout(() => n2({ type: 4 }), 350));
          break;
      }
    }, [n2, l, o]), m2 = React2.useCallback((d) => {
      switch (d.key) {
        case " ":
          d.preventDefault();
          break;
      }
    }, []), b = React2.useMemo(() => ({ open: o.menuState === 0 }), [o]), T = { "aria-activedescendant": o.activeItemIndex === null || (p2 = o.items[o.activeItemIndex]) == null ? void 0 : p2.id, "aria-labelledby": (f2 = o.buttonRef.current) == null ? void 0 : f2.id, id: a, onKeyDown: c, onKeyUp: m2, role: "menu", tabIndex: 0, ref: i };
    return E({ props: __spreadValues(__spreadValues({}, t), T), slot: b, defaultTag: mi, features: bi, visible: u, name: "Menu.Items" });
  }), yi = React2.Fragment;
  function gi(e) {
    let _a2 = e, { disabled: t = false, onClick: r } = _a2, o = __objRest(_a2, ["disabled", "onClick"]), [n2, i] = Je("Menu.Item"), a = `headlessui-menu-item-${A()}`, l = n2.activeItemIndex !== null ? n2.items[n2.activeItemIndex].id === a : false;
    x(() => {
      if (n2.menuState !== 0 || !l)
        return;
      let p2 = k();
      return p2.requestAnimationFrame(() => {
        var f2, d;
        (d = (f2 = document.getElementById(a)) == null ? void 0 : f2.scrollIntoView) == null || d.call(f2, { block: "nearest" });
      }), p2.dispose;
    }, [a, l, n2.menuState, n2.activeItemIndex]);
    let s = React2.useRef({ disabled: t });
    x(() => {
      s.current.disabled = t;
    }, [s, t]), x(() => {
      var p2, f2;
      s.current.textValue = (f2 = (p2 = document.getElementById(a)) == null ? void 0 : p2.textContent) == null ? void 0 : f2.toLowerCase();
    }, [s, a]), x(() => (i({ type: 5, id: a, dataRef: s }), () => i({ type: 6, id: a })), [s, a]);
    let u = React2.useCallback((p2) => {
      if (t)
        return p2.preventDefault();
      if (i({ type: 1 }), k().nextFrame(() => {
        var f2;
        return (f2 = n2.buttonRef.current) == null ? void 0 : f2.focus({ preventScroll: true });
      }), r)
        return r(p2);
    }, [i, n2.buttonRef, t, r]), c = React2.useCallback(() => {
      if (t)
        return i({ type: 2, focus: 5 });
      i({ type: 2, focus: 4, id: a });
    }, [t, a, i]), m2 = React2.useCallback(() => {
      t || l || i({ type: 2, focus: 4, id: a });
    }, [t, l, a, i]), b = React2.useCallback(() => {
      t || !l || i({ type: 2, focus: 5 });
    }, [t, l, i]), T = React2.useMemo(() => ({ active: l, disabled: t }), [l, t]);
    return E({ props: __spreadValues(__spreadValues({}, o), { id: a, role: "menuitem", tabIndex: t === true ? void 0 : -1, "aria-disabled": t === true ? true : void 0, disabled: void 0, onClick: u, onFocus: c, onPointerMove: m2, onMouseMove: m2, onPointerLeave: b, onMouseLeave: b }), slot: T, defaultTag: yi, name: "Menu.Item" });
  }
  Ze.Button = fi;
  Ze.Items = Ti;
  Ze.Item = gi;
  var vi = { [0]: (e) => __spreadProps(__spreadValues({}, e), { popoverState: S(e.popoverState, { [0]: 1, [1]: 0 }) }), [1](e) {
    return e.popoverState === 1 ? e : __spreadProps(__spreadValues({}, e), { popoverState: 1 });
  }, [2](e, t) {
    return e.button === t.button ? e : __spreadProps(__spreadValues({}, e), { button: t.button });
  }, [3](e, t) {
    return e.buttonId === t.buttonId ? e : __spreadProps(__spreadValues({}, e), { buttonId: t.buttonId });
  }, [4](e, t) {
    return e.panel === t.panel ? e : __spreadProps(__spreadValues({}, e), { panel: t.panel });
  }, [5](e, t) {
    return e.panelId === t.panelId ? e : __spreadProps(__spreadValues({}, e), { panelId: t.panelId });
  } }, Ut = React2.createContext(null);
  Ut.displayName = "PopoverContext";
  function ot(e) {
    let t = React2.useContext(Ut);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${Te.name} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, ot), r;
    }
    return t;
  }
  var Bt = React2.createContext(null);
  Bt.displayName = "PopoverAPIContext";
  function Mo(e) {
    let t = React2.useContext(Bt);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <${Te.name} /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, Mo), r;
    }
    return t;
  }
  var Nt = React2.createContext(null);
  Nt.displayName = "PopoverGroupContext";
  function Fo() {
    return React2.useContext(Nt);
  }
  var Wt = React2.createContext(null);
  Wt.displayName = "PopoverPanelContext";
  function Ri() {
    return React2.useContext(Wt);
  }
  function Ei(e, t) {
    return S(t.type, vi, e, t);
  }
  var Ci = "div";
  function Te(e) {
    let t = `headlessui-popover-button-${A()}`, r = `headlessui-popover-panel-${A()}`, o = React2.useReducer(Ei, { popoverState: 1, button: null, buttonId: t, panel: null, panelId: r }), [{ popoverState: n2, button: i, panel: a }, l] = o;
    React2.useEffect(() => l({ type: 3, buttonId: t }), [t, l]), React2.useEffect(() => l({ type: 5, panelId: r }), [r, l]);
    let s = React2.useMemo(() => ({ buttonId: t, panelId: r, close: () => l({ type: 1 }) }), [t, r, l]), u = Fo(), c = u == null ? void 0 : u.registerPopover, m2 = React2.useCallback(() => {
      var p2;
      return (p2 = u == null ? void 0 : u.isFocusWithinPopoverGroup()) != null ? p2 : (i == null ? void 0 : i.contains(document.activeElement)) || (a == null ? void 0 : a.contains(document.activeElement));
    }, [u, i, a]);
    React2.useEffect(() => c == null ? void 0 : c(s), [c, s]), w("focus", () => {
      n2 === 0 && (m2() || !i || !a || l({ type: 1 }));
    }, true), w("mousedown", (p2) => {
      let f2 = p2.target;
      n2 === 0 && ((i == null ? void 0 : i.contains(f2)) || (a == null ? void 0 : a.contains(f2)) || (l({ type: 1 }), de(f2, 1) || (p2.preventDefault(), i == null || i.focus())));
    });
    let b = React2.useCallback((p2) => {
      l({ type: 1 });
      let f2 = (() => p2 ? p2 instanceof HTMLElement ? p2 : p2.current instanceof HTMLElement ? p2.current : i : i)();
      f2 == null || f2.focus();
    }, [l, i]), T = React2.useMemo(() => ({ close: b }), [b]), y = React2.useMemo(() => ({ open: n2 === 0, close: b }), [n2, b]);
    return React__default["default"].createElement(Ut.Provider, { value: o }, React__default["default"].createElement(Bt.Provider, { value: T }, React__default["default"].createElement(W, { value: S(n2, { [0]: 0, [1]: 1 }) }, E({ props: e, slot: y, defaultTag: Ci, name: "Popover" }))));
  }
  var Si = "button", Ai = D(function(t, r) {
    let [o, n2] = ot("Popover.Button"), i = React2.useRef(null), a = Fo(), l = a == null ? void 0 : a.closeOthers, s = Ri(), u = s === null ? false : s === o.panelId, c = I(i, r, u ? null : (g2) => n2({ type: 2, button: g2 })), m2 = I(i, r), b = React2.useRef(null), T = React2.useRef(typeof window == "undefined" ? null : document.activeElement);
    w("focus", () => {
      T.current = b.current, b.current = document.activeElement;
    }, true);
    let y = React2.useCallback((g2) => {
      var v, h2;
      if (u) {
        if (o.popoverState === 1)
          return;
        switch (g2.key) {
          case " ":
          case "Enter":
            g2.preventDefault(), g2.stopPropagation(), n2({ type: 1 }), (v = o.button) == null || v.focus();
            break;
        }
      } else
        switch (g2.key) {
          case " ":
          case "Enter":
            g2.preventDefault(), g2.stopPropagation(), o.popoverState === 1 && (l == null || l(o.buttonId)), n2({ type: 0 });
            break;
          case "Escape":
            if (o.popoverState !== 0)
              return l == null ? void 0 : l(o.buttonId);
            if (!i.current || !i.current.contains(document.activeElement))
              return;
            g2.preventDefault(), g2.stopPropagation(), n2({ type: 1 });
            break;
          case "Tab":
            if (o.popoverState !== 0 || !o.panel || !o.button)
              return;
            if (g2.shiftKey) {
              if (!T.current || ((h2 = o.button) == null ? void 0 : h2.contains(T.current)) || o.panel.contains(T.current))
                return;
              let O = xe(), L = O.indexOf(T.current);
              if (O.indexOf(o.button) > L)
                return;
              g2.preventDefault(), g2.stopPropagation(), M(o.panel, 8);
            } else
              g2.preventDefault(), g2.stopPropagation(), M(o.panel, 1);
            break;
        }
    }, [n2, o.popoverState, o.buttonId, o.button, o.panel, i, l, u]), p2 = React2.useCallback((g2) => {
      var v;
      if (!u && (g2.key === " " && g2.preventDefault(), o.popoverState === 0 && !!o.panel && !!o.button))
        switch (g2.key) {
          case "Tab":
            if (!T.current || ((v = o.button) == null ? void 0 : v.contains(T.current)) || o.panel.contains(T.current))
              return;
            let h2 = xe(), O = h2.indexOf(T.current);
            if (h2.indexOf(o.button) > O)
              return;
            g2.preventDefault(), g2.stopPropagation(), M(o.panel, 8);
            break;
        }
    }, [o.popoverState, o.panel, o.button, u]), f2 = React2.useCallback((g2) => {
      var v, h2;
      G(g2.currentTarget) || t.disabled || (u ? (n2({ type: 1 }), (v = o.button) == null || v.focus()) : (o.popoverState === 1 && (l == null || l(o.buttonId)), (h2 = o.button) == null || h2.focus(), n2({ type: 0 })));
    }, [n2, o.button, o.popoverState, o.buttonId, t.disabled, l, u]), d = React2.useMemo(() => ({ open: o.popoverState === 0 }), [o]), P = U(t, i), C = t, R = u ? { ref: m2, type: P, onKeyDown: y, onClick: f2 } : { ref: c, id: o.buttonId, type: P, "aria-expanded": t.disabled ? void 0 : o.popoverState === 0, "aria-controls": o.panel ? o.panelId : void 0, onKeyDown: y, onKeyUp: p2, onClick: f2 };
    return E({ props: __spreadValues(__spreadValues({}, C), R), slot: d, defaultTag: Si, name: "Popover.Button" });
  }), hi = "div", Oi = 1 | 2, Ii = D(function(t, r) {
    let [{ popoverState: o }, n2] = ot("Popover.Overlay"), i = I(r), a = `headlessui-popover-overlay-${A()}`, l = _(), s = (() => l !== null ? l === 0 : o === 0)(), u = React2.useCallback((T) => {
      if (G(T.currentTarget))
        return T.preventDefault();
      n2({ type: 1 });
    }, [n2]), c = React2.useMemo(() => ({ open: o === 0 }), [o]);
    return E({ props: __spreadValues(__spreadValues({}, t), { ref: i, id: a, "aria-hidden": true, onClick: u }), slot: c, defaultTag: hi, features: Oi, visible: s, name: "Popover.Overlay" });
  }), Li = "div", Di = 1 | 2, Mi = D(function(t, r) {
    let _a2 = t, { focus: o = false } = _a2, n2 = __objRest(_a2, ["focus"]), [i, a] = ot("Popover.Panel"), { close: l } = Mo("Popover.Panel"), s = React2.useRef(null), u = I(s, r, (p2) => {
      a({ type: 4, panel: p2 });
    }), c = _(), m2 = (() => c !== null ? c === 0 : i.popoverState === 0)(), b = React2.useCallback((p2) => {
      var f2;
      switch (p2.key) {
        case "Escape":
          if (i.popoverState !== 0 || !s.current || !s.current.contains(document.activeElement))
            return;
          p2.preventDefault(), p2.stopPropagation(), a({ type: 1 }), (f2 = i.button) == null || f2.focus();
          break;
      }
    }, [i, s, a]);
    React2.useEffect(() => () => a({ type: 4, panel: null }), [a]), React2.useEffect(() => {
      var p2;
      t.static || i.popoverState === 1 && ((p2 = t.unmount) != null ? p2 : true) && a({ type: 4, panel: null });
    }, [i.popoverState, t.unmount, t.static, a]), React2.useEffect(() => {
      if (!o || i.popoverState !== 0 || !s.current)
        return;
      let p2 = document.activeElement;
      s.current.contains(p2) || M(s.current, 1);
    }, [o, s, i.popoverState]), w("keydown", (p2) => {
      var d;
      if (i.popoverState !== 0 || !s.current || p2.key !== "Tab" || !document.activeElement || !s.current || !s.current.contains(document.activeElement))
        return;
      p2.preventDefault();
      let f2 = M(s.current, p2.shiftKey ? 2 : 4);
      if (f2 === 3)
        return (d = i.button) == null ? void 0 : d.focus();
      if (f2 === 1) {
        if (!i.button)
          return;
        let P = xe(), C = P.indexOf(i.button), R = P.splice(C + 1).filter((g2) => {
          var v;
          return !((v = s.current) == null ? void 0 : v.contains(g2));
        });
        M(R, 1) === 0 && M(document.body, 1);
      }
    }), w("focus", () => {
      var p2;
      !o || i.popoverState === 0 && (!s.current || ((p2 = s.current) == null ? void 0 : p2.contains(document.activeElement)) || a({ type: 1 }));
    }, true);
    let T = React2.useMemo(() => ({ open: i.popoverState === 0, close: l }), [i, l]), y = { ref: u, id: i.panelId, onKeyDown: b };
    return React__default["default"].createElement(Wt.Provider, { value: i.panelId }, E({ props: __spreadValues(__spreadValues({}, n2), y), slot: T, defaultTag: Li, features: Di, visible: m2, name: "Popover.Panel" }));
  }), Fi = "div";
  function wi(e) {
    let t = React2.useRef(null), [r, o] = React2.useState([]), n2 = React2.useCallback((b) => {
      o((T) => {
        let y = T.indexOf(b);
        if (y !== -1) {
          let p2 = T.slice();
          return p2.splice(y, 1), p2;
        }
        return T;
      });
    }, [o]), i = React2.useCallback((b) => (o((T) => [...T, b]), () => n2(b)), [o, n2]), a = React2.useCallback(() => {
      var T;
      let b = document.activeElement;
      return ((T = t.current) == null ? void 0 : T.contains(b)) ? true : r.some((y) => {
        var p2, f2;
        return ((p2 = document.getElementById(y.buttonId)) == null ? void 0 : p2.contains(b)) || ((f2 = document.getElementById(y.panelId)) == null ? void 0 : f2.contains(b));
      });
    }, [t, r]), l = React2.useCallback((b) => {
      for (let T of r)
        T.buttonId !== b && T.close();
    }, [r]), s = React2.useMemo(() => ({ registerPopover: i, unregisterPopover: n2, isFocusWithinPopoverGroup: a, closeOthers: l }), [i, n2, a, l]), u = React2.useMemo(() => ({}), []), c = { ref: t }, m2 = e;
    return React__default["default"].createElement(Nt.Provider, { value: s }, E({ props: __spreadValues(__spreadValues({}, m2), c), slot: u, defaultTag: Fi, name: "Popover.Group" }));
  }
  Te.Button = Ai;
  Te.Overlay = Ii;
  Te.Panel = Mi;
  Te.Group = wi;
  var _o = React2.createContext(null);
  function Go() {
    let e = React2.useContext(_o);
    if (e === null) {
      let t = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t, Go), t;
    }
    return e;
  }
  function Ae() {
    let [e, t] = React2.useState([]);
    return [e.length > 0 ? e.join(" ") : void 0, React2.useMemo(() => function(o) {
      let n2 = React2.useCallback((a) => (t((l) => [...l, a]), () => t((l) => {
        let s = l.slice(), u = s.indexOf(a);
        return u !== -1 && s.splice(u, 1), s;
      })), []), i = React2.useMemo(() => ({ register: n2, slot: o.slot, name: o.name, props: o.props }), [n2, o.slot, o.name, o.props]);
      return React__default["default"].createElement(_o.Provider, { value: i }, o.children);
    }, [t])];
  }
  var Ni = "label";
  function nt(e) {
    let _a2 = e, { passive: t = false } = _a2, r = __objRest(_a2, ["passive"]), o = Go(), n2 = `headlessui-label-${A()}`;
    x(() => o.register(n2), [n2, o.register]);
    let i = __spreadProps(__spreadValues({}, o.props), { id: n2 }), a = __spreadValues(__spreadValues({}, r), i);
    return t && delete a.onClick, E({ props: a, slot: o.slot || {}, defaultTag: Ni, name: o.name || "Label" });
  }
  var jt = React2.createContext(null);
  jt.displayName = "RadioGroupContext";
  var $t = React2.createContext(null);
  $t.displayName = "GroupContext";
  var tl = React2.Fragment;
  function ol(e) {
    let [t, r] = React2.useState(null), [o, n2] = Ae(), [i, a] = re(), l = React2.useMemo(() => ({ switch: t, setSwitch: r, labelledby: o, describedby: i }), [t, r, o, i]);
    return React__default["default"].createElement(a, { name: "Switch.Description" }, React__default["default"].createElement(n2, { name: "Switch.Label", props: { onClick() {
      !t || (t.click(), t.focus({ preventScroll: true }));
    } } }, React__default["default"].createElement($t.Provider, { value: l }, E({ props: e, defaultTag: tl, name: "Switch.Group" }))));
  }
  var rl = "button";
  function Qt(e) {
    let _a2 = e, { checked: t, onChange: r } = _a2, o = __objRest(_a2, ["checked", "onChange"]), n2 = `headlessui-switch-${A()}`, i = React2.useContext($t), a = React2.useRef(null), l = I(a, i === null ? null : i.setSwitch), s = React2.useCallback(() => r(!t), [r, t]), u = React2.useCallback((y) => {
      if (G(y.currentTarget))
        return y.preventDefault();
      y.preventDefault(), s();
    }, [s]), c = React2.useCallback((y) => {
      y.key !== "Tab" && y.preventDefault(), y.key === " " && s();
    }, [s]), m2 = React2.useCallback((y) => y.preventDefault(), []), b = React2.useMemo(() => ({ checked: t }), [t]), T = { id: n2, ref: l, role: "switch", type: U(e, a), tabIndex: 0, "aria-checked": t, "aria-labelledby": i == null ? void 0 : i.labelledby, "aria-describedby": i == null ? void 0 : i.describedby, onClick: u, onKeyUp: c, onKeyPress: m2 };
    return E({ props: __spreadValues(__spreadValues({}, o), T), slot: b, defaultTag: rl, name: "Switch" });
  }
  Qt.Group = ol;
  Qt.Label = nt;
  Qt.Description = me;
  var ul = { [0](e, t) {
    return e.selectedIndex === t.index ? e : __spreadProps(__spreadValues({}, e), { selectedIndex: t.index });
  }, [1](e, t) {
    return e.orientation === t.orientation ? e : __spreadProps(__spreadValues({}, e), { orientation: t.orientation });
  }, [2](e, t) {
    return e.activation === t.activation ? e : __spreadProps(__spreadValues({}, e), { activation: t.activation });
  }, [3](e, t) {
    return e.tabs.includes(t.tab) ? e : __spreadProps(__spreadValues({}, e), { tabs: [...e.tabs, t.tab] });
  }, [4](e, t) {
    return __spreadProps(__spreadValues({}, e), { tabs: e.tabs.filter((r) => r !== t.tab) });
  }, [5](e, t) {
    return e.panels.includes(t.panel) ? e : __spreadProps(__spreadValues({}, e), { panels: [...e.panels, t.panel] });
  }, [6](e, t) {
    return __spreadProps(__spreadValues({}, e), { panels: e.panels.filter((r) => r !== t.panel) });
  }, [7](e) {
    return __spreadValues({}, e);
  } }, zt = React2.createContext(null);
  zt.displayName = "TabsContext";
  function Le(e) {
    let t = React2.useContext(zt);
    if (t === null) {
      let r = new Error(`<${e} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r, Le), r;
    }
    return t;
  }
  function pl(e, t) {
    return S(t.type, ul, e, t);
  }
  var dl = React2.Fragment;
  function cl(e) {
    let _a2 = e, { defaultIndex: t = 0, vertical: r = false, manual: o = false, onChange: n2, selectedIndex: i = null } = _a2, a = __objRest(_a2, ["defaultIndex", "vertical", "manual", "onChange", "selectedIndex"]), l = r ? "vertical" : "horizontal", s = o ? "manual" : "auto", [u, c] = React2.useReducer(pl, { selectedIndex: null, tabs: [], panels: [], orientation: l, activation: s }), m2 = React2.useMemo(() => ({ selectedIndex: u.selectedIndex }), [u.selectedIndex]), b = React2.useRef(() => {
    });
    React2.useEffect(() => {
      c({ type: 1, orientation: l });
    }, [l]), React2.useEffect(() => {
      c({ type: 2, activation: s });
    }, [s]), React2.useEffect(() => {
      typeof n2 == "function" && (b.current = n2);
    }, [n2]), React2.useEffect(() => {
      if (u.tabs.length <= 0 || i === null && u.selectedIndex !== null)
        return;
      let p2 = u.tabs.map((P) => P.current).filter(Boolean), f2 = p2.filter((P) => !P.hasAttribute("disabled")), d = i != null ? i : t;
      if (d < 0)
        c({ type: 0, index: p2.indexOf(f2[0]) });
      else if (d > u.tabs.length)
        c({ type: 0, index: p2.indexOf(f2[f2.length - 1]) });
      else {
        let P = p2.slice(0, d), R = [...p2.slice(d), ...P].find((g2) => f2.includes(g2));
        if (!R)
          return;
        c({ type: 0, index: p2.indexOf(R) });
      }
    }, [t, i, u.tabs, u.selectedIndex]);
    let T = React2.useRef(u.selectedIndex);
    React2.useEffect(() => {
      T.current = u.selectedIndex;
    }, [u.selectedIndex]);
    let y = React2.useMemo(() => [u, { dispatch: c, change(p2) {
      T.current !== p2 && b.current(p2), T.current = p2, c({ type: 0, index: p2 });
    } }], [u, c]);
    return React__default["default"].createElement(zt.Provider, { value: y }, E({ props: __spreadValues({}, a), slot: m2, defaultTag: dl, name: "Tabs" }));
  }
  var fl = "div";
  function ml(e) {
    let [{ selectedIndex: t, orientation: r }] = Le("Tab.List"), o = { selectedIndex: t };
    return E({ props: __spreadValues(__spreadValues({}, e), { role: "tablist", "aria-orientation": r }), slot: o, defaultTag: fl, name: "Tabs.List" });
  }
  var bl = "button";
  function De(e) {
    var C, R;
    let t = `headlessui-tabs-tab-${A()}`, [{ selectedIndex: r, tabs: o, panels: n2, orientation: i, activation: a }, { dispatch: l, change: s }] = Le(De.name), u = React2.useRef(null), c = I(u, (g2) => {
      !g2 || l({ type: 7 });
    });
    x(() => (l({ type: 3, tab: u }), () => l({ type: 4, tab: u })), [l, u]);
    let m2 = o.indexOf(u), b = m2 === r, T = React2.useCallback((g2) => {
      let v = o.map((h2) => h2.current).filter(Boolean);
      if (g2.key === " " || g2.key === "Enter") {
        g2.preventDefault(), g2.stopPropagation(), s(m2);
        return;
      }
      switch (g2.key) {
        case "Home":
        case "PageUp":
          return g2.preventDefault(), g2.stopPropagation(), M(v, 1);
        case "End":
        case "PageDown":
          return g2.preventDefault(), g2.stopPropagation(), M(v, 8);
      }
      return S(i, { vertical() {
        if (g2.key === "ArrowUp")
          return M(v, 2 | 16);
        if (g2.key === "ArrowDown")
          return M(v, 4 | 16);
      }, horizontal() {
        if (g2.key === "ArrowLeft")
          return M(v, 2 | 16);
        if (g2.key === "ArrowRight")
          return M(v, 4 | 16);
      } });
    }, [o, i, m2, s]), y = React2.useCallback(() => {
      var g2;
      (g2 = u.current) == null || g2.focus();
    }, [u]), p2 = React2.useCallback(() => {
      var g2;
      (g2 = u.current) == null || g2.focus(), s(m2);
    }, [s, m2, u]), f2 = React2.useMemo(() => ({ selected: b }), [b]), d = { ref: c, onKeyDown: T, onFocus: a === "manual" ? y : p2, onClick: p2, id: t, role: "tab", type: U(e, u), "aria-controls": (R = (C = n2[m2]) == null ? void 0 : C.current) == null ? void 0 : R.id, "aria-selected": b, tabIndex: b ? 0 : -1 };
    return E({ props: __spreadValues(__spreadValues({}, e), d), slot: f2, defaultTag: bl, name: "Tabs.Tab" });
  }
  var Tl = "div";
  function yl(e) {
    let [{ selectedIndex: t }] = Le("Tab.Panels"), r = React2.useMemo(() => ({ selectedIndex: t }), [t]);
    return E({ props: e, slot: r, defaultTag: Tl, name: "Tabs.Panels" });
  }
  var gl = "div", Pl = 1 | 2;
  function xl(e) {
    var T, y;
    let [{ selectedIndex: t, tabs: r, panels: o }, { dispatch: n2 }] = Le("Tab.Panel"), i = `headlessui-tabs-panel-${A()}`, a = React2.useRef(null), l = I(a, (p2) => {
      !p2 || n2({ type: 7 });
    });
    x(() => (n2({ type: 5, panel: a }), () => n2({ type: 6, panel: a })), [n2, a]);
    let s = o.indexOf(a), u = s === t, c = React2.useMemo(() => ({ selected: u }), [u]), m2 = { ref: l, id: i, role: "tabpanel", "aria-labelledby": (y = (T = r[s]) == null ? void 0 : T.current) == null ? void 0 : y.id, tabIndex: u ? 0 : -1 };
    return E({ props: __spreadValues(__spreadValues({}, e), m2), slot: c, defaultTag: gl, features: Pl, visible: u, name: "Tabs.Panel" });
  }
  De.Group = cl;
  De.List = ml;
  De.Panels = yl;
  De.Panel = xl;
  function Bo() {
    let e = React2.useRef(true);
    return React2.useEffect(() => {
      e.current = false;
    }, []), e.current;
  }
  function No(e) {
    let t = { called: false };
    return (...r) => {
      if (!t.called)
        return t.called = true, e(...r);
    };
  }
  function Yt(e, ...t) {
    e && t.length > 0 && e.classList.add(...t);
  }
  function ut(e, ...t) {
    e && t.length > 0 && e.classList.remove(...t);
  }
  function El(e, t) {
    let r = k();
    if (!e)
      return r.dispose;
    let { transitionDuration: o, transitionDelay: n2 } = getComputedStyle(e), [i, a] = [o, n2].map((l) => {
      let [s = 0] = l.split(",").filter(Boolean).map((u) => u.includes("ms") ? parseFloat(u) : parseFloat(u) * 1e3).sort((u, c) => c - u);
      return s;
    });
    return i !== 0 ? r.setTimeout(() => {
      t("finished");
    }, i + a) : t("finished"), r.add(() => t("cancelled")), r.dispose;
  }
  function Xt(e, t, r, o, n2, i) {
    let a = k(), l = i !== void 0 ? No(i) : () => {
    };
    return ut(e, ...n2), Yt(e, ...t, ...r), a.nextFrame(() => {
      ut(e, ...r), Yt(e, ...o), a.add(El(e, (s) => (ut(e, ...o, ...t), Yt(e, ...n2), l(s))));
    }), a.add(() => ut(e, ...t, ...r, ...o, ...n2)), a.add(() => l("cancelled")), a.dispose;
  }
  function le(e = "") {
    return React2.useMemo(() => e.split(" ").filter((t) => t.trim().length > 1), [e]);
  }
  var dt = React2.createContext(null);
  dt.displayName = "TransitionContext";
  function Cl() {
    let e = React2.useContext(dt);
    if (e === null)
      throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
    return e;
  }
  function Sl() {
    let e = React2.useContext(ct);
    if (e === null)
      throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
    return e;
  }
  var ct = React2.createContext(null);
  ct.displayName = "NestingContext";
  function ft(e) {
    return "children" in e ? ft(e.children) : e.current.filter(({ state: t }) => t === "visible").length > 0;
  }
  function $o(e) {
    let t = React2.useRef(e), r = React2.useRef([]), o = Be();
    React2.useEffect(() => {
      t.current = e;
    }, [e]);
    let n2 = React2.useCallback((a, l = 1) => {
      var u;
      let s = r.current.findIndex(({ id: c }) => c === a);
      s !== -1 && (S(l, { [0]() {
        r.current.splice(s, 1);
      }, [1]() {
        r.current[s].state = "hidden";
      } }), !ft(r) && o.current && ((u = t.current) == null || u.call(t)));
    }, [t, o, r]), i = React2.useCallback((a) => {
      let l = r.current.find(({ id: s }) => s === a);
      return l ? l.state !== "visible" && (l.state = "visible") : r.current.push({ id: a, state: "visible" }), () => n2(a, 0);
    }, [r, n2]);
    return React2.useMemo(() => ({ children: r, register: i, unregister: n2 }), [i, n2, r]);
  }
  function Al() {
  }
  var hl = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
  function Qo(e) {
    var r;
    let t = {};
    for (let o of hl)
      t[o] = (r = e[o]) != null ? r : Al;
    return t;
  }
  function Ol(e) {
    let t = React2.useRef(Qo(e));
    return React2.useEffect(() => {
      t.current = Qo(e);
    }, [e]), t;
  }
  var Il = "div", qo = 1;
  function zo(e) {
    let _a2 = e, { beforeEnter: t, afterEnter: r, beforeLeave: o, afterLeave: n2, enter: i, enterFrom: a, enterTo: l, entered: s, leave: u, leaveFrom: c, leaveTo: m2 } = _a2, b = __objRest(_a2, ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave", "enter", "enterFrom", "enterTo", "entered", "leave", "leaveFrom", "leaveTo"]), T = React2.useRef(null), [y, p2] = React2.useState("visible"), f2 = b.unmount ? 0 : 1, { show: d, appear: P, initial: C } = Cl(), { register: R, unregister: g2 } = Sl(), v = A(), h2 = React2.useRef(false), O = $o(() => {
      h2.current || (p2("hidden"), g2(v), X.current.afterLeave());
    });
    x(() => {
      if (!!v)
        return R(v);
    }, [R, v]), x(() => {
      if (f2 === 1 && !!v) {
        if (d && y !== "visible") {
          p2("visible");
          return;
        }
        S(y, { hidden: () => g2(v), visible: () => R(v) });
      }
    }, [y, v, R, g2, d, f2]);
    let L = le(i), N = le(a), K = le(l), V = le(s), Fe = le(u), ge = le(c), we = le(m2), X = Ol({ beforeEnter: t, afterEnter: r, beforeLeave: o, afterLeave: n2 }), F = q$1();
    React2.useEffect(() => {
      if (F && y === "visible" && T.current === null)
        throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
    }, [T, y, F]);
    let $ = C && !P;
    x(() => {
      let bt = T.current;
      if (!!bt && !$)
        return h2.current = true, d && X.current.beforeEnter(), d || X.current.beforeLeave(), d ? Xt(bt, L, N, K, V, (Tt) => {
          h2.current = false, Tt === "finished" && X.current.afterEnter();
        }) : Xt(bt, Fe, ge, we, V, (Tt) => {
          h2.current = false, Tt === "finished" && (ft(O) || (p2("hidden"), g2(v), X.current.afterLeave()));
        });
    }, [X, v, h2, g2, O, T, $, d, L, N, K, Fe, ge, we]);
    let H = { ref: T }, Pe = b;
    return React__default["default"].createElement(ct.Provider, { value: O }, React__default["default"].createElement(W, { value: S(y, { visible: 0, hidden: 1 }) }, E({ props: __spreadValues(__spreadValues({}, Pe), H), defaultTag: Il, features: qo, visible: y === "visible", name: "Transition.Child" })));
  }
  function mt(e) {
    let _a2 = e, { show: t, appear: r = false, unmount: o } = _a2, n2 = __objRest(_a2, ["show", "appear", "unmount"]), i = _();
    if (t === void 0 && i !== null && (t = S(i, { [0]: true, [1]: false })), ![true, false].includes(t))
      throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
    let [a, l] = React2.useState(t ? "visible" : "hidden"), s = $o(() => {
      l("hidden");
    }), u = Bo(), c = React2.useMemo(() => ({ show: t, appear: r || !u, initial: u }), [t, r, u]);
    React2.useEffect(() => {
      t ? l("visible") : ft(s) || l("hidden");
    }, [t, s]);
    let m2 = { unmount: o };
    return React__default["default"].createElement(ct.Provider, { value: s }, React__default["default"].createElement(dt.Provider, { value: c }, E({ props: __spreadProps(__spreadValues({}, m2), { as: React2.Fragment, children: React__default["default"].createElement(zo, __spreadValues(__spreadValues({}, m2), n2)) }), defaultTag: React2.Fragment, features: qo, visible: a === "visible", name: "Transition" })));
  }
  mt.Child = function(t) {
    let r = React2.useContext(dt) !== null, o = _() !== null;
    return !r && o ? React__default["default"].createElement(mt, __spreadValues({}, t)) : React__default["default"].createElement(zo, __spreadValues({}, t));
  };
  mt.Root = mt;
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
      for (var i = 0; i < 10; i++) {
        test2["_" + String.fromCharCode(i)] = i;
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
    for (var s = 1; s < arguments.length; s++) {
      from = Object(arguments[s]);
      for (var key in from) {
        if (hasOwnProperty.call(from, key)) {
          to2[key] = from[key];
        }
      }
      if (getOwnPropertySymbols) {
        symbols = getOwnPropertySymbols(from);
        for (var i = 0; i < symbols.length; i++) {
          if (propIsEnumerable.call(from, symbols[i])) {
            to2[symbols[i]] = from[symbols[i]];
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
  if (typeof Symbol === "function" && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    reactJsxRuntime_production_min.Fragment = h("react.fragment");
  }
  var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, k2) {
    var b, d = {}, e = null, l = null;
    k2 !== void 0 && (e = "" + k2);
    a.key !== void 0 && (e = "" + a.key);
    a.ref !== void 0 && (l = a.ref);
    for (b in a)
      n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        d[b] === void 0 && (d[b] = a[b]);
    return { $$typeof: g, type: c, key: e, ref: l, props: d, _owner: m.current };
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
        children: /* @__PURE__ */ jsx(Qt, {
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
    return /* @__PURE__ */ jsx(Ee, {
      value: selected,
      onChange: setSelected,
      children: /* @__PURE__ */ jsxs("div", {
        className: "relative mt-1",
        children: [/* @__PURE__ */ jsxs(Ee.Button, {
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
        }), /* @__PURE__ */ jsx(mt, {
          as: React2.Fragment,
          leave: "transition ease-in duration-100",
          leaveFrom: "opacity-100",
          leaveTo: "opacity-0",
          children: /* @__PURE__ */ jsx(Ee.Options, {
            className: "absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
            children: optionList.map((person, personIdx) => /* @__PURE__ */ jsx(Ee.Option, {
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
            setSelected: (num) => setTalentGoalLevel(__spreadProps(__spreadValues({}, talentGoalLevel), {
              normal: num
            })),
            optionList: talentLevels,
            show: (num) => `${num}`
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10",
          children: "\u5143\u7D20\u6218\u6280"
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel.skill,
            setSelected: (num) => setTalentGoalLevel(__spreadProps(__spreadValues({}, talentGoalLevel), {
              skill: num
            })),
            optionList: talentLevels,
            show: (num) => `${num}`
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "mt-10",
          children: "\u5143\u7D20\u7206\u53D1"
        }), /* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel.burst,
            setSelected: (num) => setTalentGoalLevel(__spreadProps(__spreadValues({}, talentGoalLevel), {
              burst: num
            })),
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
  var isAbsoluteURL$1 = function isAbsoluteURL2(url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
  };
  var combineURLs$1 = function combineURLs2(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
  };
  var isAbsoluteURL = isAbsoluteURL$1;
  var combineURLs = combineURLs$1;
  var buildFullPath$1 = function buildFullPath2(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
      return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
  };
  var enhanceError$2 = function enhanceError2(error, config, code, request, response) {
    error.config = config;
    if (code) {
      error.code = code;
    }
    error.request = request;
    error.response = response;
    error.isAxiosError = true;
    error.toJSON = function toJSON() {
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
    };
    return error;
  };
  var enhanceError$1 = enhanceError$2;
  var createError$2 = function createError2(message, config, code, request, response) {
    var error = new Error(message);
    return enhanceError$1(error, config, code, request, response);
  };
  var createError$1 = createError$2;
  var settle$1 = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(createError$1("Request failed with status code " + response.status, response.config, null, response.request, response));
    }
  };
  var bind$2 = function bind2(fn, thisArg) {
    return function wrap() {
      var args = new Array(arguments.length);
      for (var i = 0; i < args.length; i++) {
        args[i] = arguments[i];
      }
      return fn.apply(thisArg, args);
    };
  };
  var bind$1 = bind$2;
  var toString = Object.prototype.toString;
  function isArray(val) {
    return Array.isArray(val);
  }
  function isUndefined(val) {
    return typeof val === "undefined";
  }
  function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && typeof val.constructor.isBuffer === "function" && val.constructor.isBuffer(val);
  }
  function isArrayBuffer(val) {
    return toString.call(val) === "[object ArrayBuffer]";
  }
  function isFormData(val) {
    return toString.call(val) === "[object FormData]";
  }
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
    if (toString.call(val) !== "[object Object]") {
      return false;
    }
    var prototype = Object.getPrototypeOf(val);
    return prototype === null || prototype === Object.prototype;
  }
  function isDate(val) {
    return toString.call(val) === "[object Date]";
  }
  function isFile(val) {
    return toString.call(val) === "[object File]";
  }
  function isBlob(val) {
    return toString.call(val) === "[object Blob]";
  }
  function isFunction(val) {
    return toString.call(val) === "[object Function]";
  }
  function isStream(val) {
    return isObject(val) && isFunction(val.pipe);
  }
  function isURLSearchParams(val) {
    return toString.call(val) === "[object URLSearchParams]";
  }
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
      for (var i = 0, l = obj.length; i < l; i++) {
        fn.call(null, obj[i], i, obj);
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
    for (var i = 0, l = arguments.length; i < l; i++) {
      forEach(arguments[i], assignValue);
    }
    return result;
  }
  function extend(a, b, thisArg) {
    forEach(b, function assignValue(val, key) {
      if (thisArg && typeof val === "function") {
        a[key] = bind$1(val, thisArg);
      } else {
        a[key] = val;
      }
    });
    return a;
  }
  function stripBOM(content) {
    if (content.charCodeAt(0) === 65279) {
      content = content.slice(1);
    }
    return content;
  }
  var utils$e = {
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
    stripBOM
  };
  var utils$d = utils$e;
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
    } else if (utils$d.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils$d.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils$d.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils$d.forEach(val, function parseValue(v) {
          if (utils$d.isDate(v)) {
            v = v.toISOString();
          } else if (utils$d.isObject(v)) {
            v = JSON.stringify(v);
          }
          parts.push(encode(key) + "=" + encode(v));
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
  var utils$c = utils$e;
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
    var i;
    if (!headers) {
      return parsed;
    }
    utils$c.forEach(headers.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils$c.trim(line.substr(0, i)).toLowerCase();
      val = utils$c.trim(line.substr(i + 1));
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
  function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
      var _a2;
      let requestData = config.data;
      const requestHeaders = (_a2 = config.headers) != null ? _a2 : {};
      if (utils$e.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      if (config.auth) {
        const username = config.auth.username || "";
        const password = config.auth.password || "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      const onerror = function handleError() {
        reject(createError$2("Network Error", config));
      };
      const ontimeout = function handleTimeout() {
        reject(createError$2("timeout of " + config.timeout + "ms exceeded", config, "ECONNABORTED"));
      };
      utils$e.forEach(requestHeaders, function setRequestHeader(val, key) {
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
      const method = config.method.toUpperCase();
      if (method === "UNLINK" || method === "PURGE" || method === "LINK") {
        reject(createError$2(`${method} is not a supported method by GM.xmlHttpRequest`, config));
      } else {
        GM.xmlHttpRequest({
          method,
          url: buildURL$2(buildFullPath$1(config.baseURL, config.url), config.params, config.paramsSerializer),
          headers: Object.fromEntries(Object.entries(requestHeaders).map(([key, val]) => [key, val.toString()])),
          data: requestData,
          timeout: config.timeout,
          ontimeout,
          onload,
          onerror
        });
      }
    });
  }
  var axios$2 = { exports: {} };
  var utils$b = utils$e;
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
    utils$b.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  };
  var InterceptorManager_1 = InterceptorManager$1;
  var utils$a = utils$e;
  var normalizeHeaderName$1 = function normalizeHeaderName2(headers, normalizedName) {
    utils$a.forEach(headers, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers[normalizedName] = value;
        delete headers[name];
      }
    });
  };
  var transitional = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  var utils$9 = utils$e;
  var cookies$1 = utils$9.isStandardBrowserEnv() ? function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils$9.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils$9.isString(path)) {
          cookie.push("path=" + path);
        }
        if (utils$9.isString(domain)) {
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
  var utils$8 = utils$e;
  var isURLSameOrigin$1 = utils$8.isStandardBrowserEnv() ? function standardBrowserEnv() {
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
      var parsed = utils$8.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }() : function nonStandardBrowserEnv() {
    return function isURLSameOrigin2() {
      return true;
    };
  }();
  function Cancel$3(message) {
    this.message = message;
  }
  Cancel$3.prototype.toString = function toString2() {
    return "Cancel" + (this.message ? ": " + this.message : "");
  };
  Cancel$3.prototype.__CANCEL__ = true;
  var Cancel_1 = Cancel$3;
  var utils$7 = utils$e;
  var settle = settle$1;
  var cookies = cookies$1;
  var buildURL$1 = buildURL$2;
  var buildFullPath = buildFullPath$1;
  var parseHeaders = parseHeaders$1;
  var isURLSameOrigin = isURLSameOrigin$1;
  var createError = createError$2;
  var transitionalDefaults$1 = transitional;
  var Cancel$2 = Cancel_1;
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
      if (utils$7.isFormData(requestData)) {
        delete requestHeaders["Content-Type"];
      }
      var request = new XMLHttpRequest();
      if (config.auth) {
        var username = config.auth.username || "";
        var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
        requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
      }
      var fullPath = buildFullPath(config.baseURL, config.url);
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
        reject(createError("Request aborted", config, "ECONNABORTED", request));
        request = null;
      };
      request.onerror = function handleError() {
        reject(createError("Network Error", config, null, request));
        request = null;
      };
      request.ontimeout = function handleTimeout() {
        var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
        var transitional2 = config.transitional || transitionalDefaults$1;
        if (config.timeoutErrorMessage) {
          timeoutErrorMessage = config.timeoutErrorMessage;
        }
        reject(createError(timeoutErrorMessage, config, transitional2.clarifyTimeoutError ? "ETIMEDOUT" : "ECONNABORTED", request));
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
          reject(!cancel || cancel && cancel.type ? new Cancel$2("canceled") : cancel);
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
      request.send(requestData);
    });
  };
  var utils$6 = utils$e;
  var normalizeHeaderName = normalizeHeaderName$1;
  var enhanceError = enhanceError$2;
  var transitionalDefaults = transitional;
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
      } catch (e) {
        if (e.name !== "SyntaxError") {
          throw e;
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
      if (utils$6.isObject(data2) || headers && headers["Content-Type"] === "application/json") {
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
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw enhanceError(e, this, "E_JSON_PARSE");
            }
            throw e;
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
  var utils$5 = utils$e;
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
  var utils$4 = utils$e;
  var transformData = transformData$1;
  var isCancel = isCancel$1;
  var defaults$1 = defaults_1;
  var Cancel$1 = Cancel_1;
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new Cancel$1("canceled");
    }
  }
  var dispatchRequest$1 = function dispatchRequest2(config) {
    throwIfCancellationRequested(config);
    config.headers = config.headers || {};
    config.data = transformData.call(config, config.data, config.headers, config.transformRequest);
    config.headers = utils$4.merge(config.headers.common || {}, config.headers[config.method] || {}, config.headers);
    utils$4.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function cleanHeaderConfig(method) {
      delete config.headers[method];
    });
    var adapter = config.adapter || defaults$1.adapter;
    return adapter(config).then(function onAdapterResolution(response) {
      throwIfCancellationRequested(config);
      response.data = transformData.call(config, response.data, response.headers, config.transformResponse);
      return response;
    }, function onAdapterRejection(reason) {
      if (!isCancel(reason)) {
        throwIfCancellationRequested(config);
        if (reason && reason.response) {
          reason.response.data = transformData.call(config, reason.response.data, reason.response.headers, config.transformResponse);
        }
      }
      return Promise.reject(reason);
    });
  };
  var utils$3 = utils$e;
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
    "version": "0.26.1"
  };
  var VERSION = data.version;
  var validators$1 = {};
  ["object", "boolean", "number", "function", "string", "symbol"].forEach(function(type, i) {
    validators$1[type] = function validator2(thing) {
      return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
  });
  var deprecatedWarnings = {};
  validators$1.transitional = function transitional2(validator2, version, message) {
    function formatMessage(opt, desc) {
      return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    return function(value, opt, opts) {
      if (validator2 === false) {
        throw new Error(formatMessage(opt, " has been removed" + (version ? " in " + version : "")));
      }
      if (version && !deprecatedWarnings[opt]) {
        deprecatedWarnings[opt] = true;
        console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
      }
      return validator2 ? validator2(value, opt, opts) : true;
    };
  };
  function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
      throw new TypeError("options must be an object");
    }
    var keys = Object.keys(options);
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
      var validator2 = schema[opt];
      if (validator2) {
        var value = options[opt];
        var result = value === void 0 || validator2(value, opt, options);
        if (result !== true) {
          throw new TypeError("option " + opt + " must be " + result);
        }
        continue;
      }
      if (allowUnknown !== true) {
        throw Error("Unknown option " + opt);
      }
    }
  }
  var validator$1 = {
    assertOptions,
    validators: validators$1
  };
  var utils$2 = utils$e;
  var buildURL = buildURL$2;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;
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
    return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, "");
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
    Axios$1.prototype[method] = function(url, data2, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: data2
      }));
    };
  });
  var Axios_1 = Axios$1;
  var Cancel = Cancel_1;
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
      var i;
      var l = token._listeners.length;
      for (i = 0; i < l; i++) {
        token._listeners[i](cancel);
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
      token.reason = new Cancel(message);
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
    var token = new CancelToken(function executor(c) {
      cancel = c;
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
  var utils$1 = utils$e;
  var isAxiosError = function isAxiosError2(payload) {
    return utils$1.isObject(payload) && payload.isAxiosError === true;
  };
  var utils = utils$e;
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
  axios$1.Cancel = Cancel_1;
  axios$1.CancelToken = CancelToken_1;
  axios$1.isCancel = isCancel$1;
  axios$1.VERSION = data.version;
  axios$1.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$1.spread = spread;
  axios$1.isAxiosError = isAxiosError;
  axios$2.exports = axios$1;
  axios$2.exports.default = axios$1;
  var axios = axios$2.exports;
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
    return localStorage.getItem("gameBiz") == "hk4e_global";
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
          return __spreadValues({ character }, characterData);
        }
      }
    }
    throw err ? err : new Error("\u89D2\u8272\u8BE6\u60C5\u83B7\u53D6\u5931\u8D25");
  };
  const getDetailList = async (game_uid, region) => {
    let maxPageSize = Math.ceil(charactersNum / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters2 = [];
    for await (let i of idxs) {
      characters2.push.apply(characters2, await getCharacters(game_uid, region, i + 1));
    }
    const details = characters2.map((c) => getCharacterDetail(c, game_uid, region));
    const detailList = [];
    for await (let d of details) {
      detailList.push(d);
    }
    return detailList;
  };
  function ExDialog() {
    const [gameBizSwitchEnabled, setGameBizSwitchEnabled] = React2.useState(() => isGlobal());
    const onChangeGameBiz = (e) => {
      setGameBizSwitchEnabled(e);
      let gameBizNew = !e ? "hk4e_cn" : "hk4e_global";
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
        console.table(res.map((a) => a.character));
        console.groupEnd();
        console.groupCollapsed("\u6B66\u5668");
        console.table(res.map((a) => a.weapon));
        console.groupEnd();
        console.groupCollapsed("\u89D2\u8272\u5929\u8D4B");
        res.forEach((c) => {
          const name = c.character.name;
          console.groupCollapsed(name);
          console.table(c.skill_list);
          console.groupEnd();
        });
        console.groupEnd();
        console.groupEnd();
        res.forEach((v) => {
          addCharacter(v);
        });
        console.log(`\u7C73\u6E38\u793E\u6570\u636E\u65E0\u6CD5\u5224\u65AD\u662F\u5426\u7A81\u7834,\u8BF7\u81EA\u884C\u6BD4\u8F83\u6574\u6570\u7B49\u7EA7\u662F\u5426\u5DF2\u7A81\u7834`);
        console.log(`\u89D2\u8272\u4FE1\u606F\u540C\u6B65\u5B8C\u6BD5`);
        alert("\u89D2\u8272\u4FE1\u606F\u540C\u6B65\u5B8C\u6BD5");
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
          children: [/* @__PURE__ */ jsx(Ye, {
            children: ({
              open
            }) => /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(Ye.Button, {
                className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "\u89D2\u8272\u4FE1\u606F\u540C\u6B65"
                }), /* @__PURE__ */ jsx(ChevronUpIcon$1, {
                  className: `${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`
                })]
              }), /* @__PURE__ */ jsxs(Ye.Panel, {
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
                      optionList: accountList.map((_2, idx) => idx),
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
          }), /* @__PURE__ */ jsx(Ye, {
            as: "div",
            className: "mt-2",
            children: ({
              open
            }) => /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(Ye.Button, {
                className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "\u89C4\u5212\u6279\u91CF\u64CD\u4F5C"
                }), /* @__PURE__ */ jsx(ChevronUpIcon$1, {
                  className: `${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`
                })]
              }), /* @__PURE__ */ jsx(Ye.Panel, {
                className: "px-4 pt-4 pb-2 text-sm text-white-500",
                children: /* @__PURE__ */ jsxs(De.Group, {
                  children: [/* @__PURE__ */ jsx(De.List, {
                    className: "flex p-1 space-x-1 bg-blue-900/20 rounded-xl",
                    children: ["\u89D2\u8272\u76EE\u6807\u7B49\u7EA7", "\u5929\u8D4B\u76EE\u6807\u7B49\u7EA7", "\u6B66\u5668\u76EE\u6807\u7B49\u7EA7"].map((category) => /* @__PURE__ */ jsx(De, {
                      className: ({
                        selected
                      }) => classNames("w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg", "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60", selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"),
                      children: category
                    }, category))
                  }), /* @__PURE__ */ jsxs(De.Panels, {
                    children: [/* @__PURE__ */ jsx(De.Panel, {
                      children: /* @__PURE__ */ jsx(CharacterGoalTab, {
                        showText: "\u89D2\u8272",
                        batchUpdateCharacter
                      })
                    }), /* @__PURE__ */ jsx(De.Panel, {
                      children: /* @__PURE__ */ jsx(TalentGoalTab, {})
                    }), /* @__PURE__ */ jsx(De.Panel, {
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
    const handleDragStop = (e, data2) => {
      const {
        x: x2,
        y
      } = data2;
      localStorage.setItem("seelieExPosition", JSON.stringify({
        x: x2,
        y
      }));
      setPosition({
        x: x2,
        y
      });
      eventControl(e);
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
  (_a = document.getElementById("app")) == null ? void 0 : _a.append(seelieEx);
  ReactDOM__default["default"].render(/* @__PURE__ */ jsx(React__default["default"].StrictMode, {
    children: /* @__PURE__ */ jsx(App, {})
  }), document.getElementById("seelieEx"));
})(React, ReactDOM, ReactDraggable);
 
