// ==UserScript==
// @name             genshinSeelieEx
// @name:zh          原神规划助手扩展
// @namespace        https://github.com/KeyPJ/seelieEx
// @version          2.7.0
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
// @resource         character https://seelie-ex.vercel.app/character.json
// @resource         weapon https://seelie-ex.vercel.app/weapon.json
// @grant            unsafeWindow
// @grant            GM_xmlhttpRequest
// @grant            GM_openInTab
// @grant            GM_getResourceText
// @grant            GM.xmlHttpRequest
// @run-at           document-end
// @contributionURL  https://github.com/KeyPJ/seelieEx
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
  var App$1 = /* @__PURE__ */ (() => '/*\n! tailwindcss v3.0.24 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type=\'button\'],\n[type=\'reset\'],\n[type=\'submit\'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput:-ms-input-placeholder, textarea:-ms-input-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/*\nEnsure the default browser behavior of the `hidden` attribute.\n*/\n\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.pointer-events-none {\n  pointer-events: none;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.relative {\n  position: relative;\n}\n.inset-0 {\n  top: 0px;\n  right: 0px;\n  bottom: 0px;\n  left: 0px;\n}\n.inset-x-\\[20\\%\\] {\n  left: 20%;\n  right: 20%;\n}\n.inset-y-0 {\n  top: 0px;\n  bottom: 0px;\n}\n.top-10 {\n  top: 2.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.left-0 {\n  left: 0px;\n}\n.z-\\[1201\\] {\n  z-index: 1201;\n}\n.z-\\[1200\\] {\n  z-index: 1200;\n}\n.mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n}\n.mt-2 {\n  margin-top: 0.5rem;\n}\n.mt-1 {\n  margin-top: 0.25rem;\n}\n.mt-10 {\n  margin-top: 2.5rem;\n}\n.block {\n  display: block;\n}\n.inline-block {\n  display: inline-block;\n}\n.flex {\n  display: flex;\n}\n.inline-flex {\n  display: inline-flex;\n}\n.table {\n  display: table;\n}\n.grid {\n  display: grid;\n}\n.h-5 {\n  height: 1.25rem;\n}\n.h-6 {\n  height: 1.5rem;\n}\n.h-4 {\n  height: 1rem;\n}\n.max-h-max {\n  max-height: -webkit-max-content;\n  max-height: -moz-max-content;\n  max-height: max-content;\n}\n.max-h-60 {\n  max-height: 15rem;\n}\n.min-h-min {\n  min-height: -webkit-min-content;\n  min-height: -moz-min-content;\n  min-height: min-content;\n}\n.w-full {\n  width: 100%;\n}\n.w-5 {\n  width: 1.25rem;\n}\n.w-1\\/2 {\n  width: 50%;\n}\n.w-1\\/4 {\n  width: 25%;\n}\n.w-11 {\n  width: 2.75rem;\n}\n.w-4 {\n  width: 1rem;\n}\n.min-w-\\[50\\%\\] {\n  min-width: 50%;\n}\n.max-w-max {\n  max-width: -webkit-max-content;\n  max-width: -moz-max-content;\n  max-width: max-content;\n}\n.max-w-md {\n  max-width: 28rem;\n}\n.translate-x-6 {\n  --tw-translate-x: 1.5rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.translate-x-1 {\n  --tw-translate-x: 0.25rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.rotate-180 {\n  --tw-rotate: 180deg;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.transform {\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.cursor-default {\n  cursor: default;\n}\n.select-none {\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n}\n.grid-flow-col {\n  grid-auto-flow: column;\n}\n.grid-rows-2 {\n  grid-template-rows: repeat(2, minmax(0, 1fr));\n}\n.flex-row {\n  flex-direction: row;\n}\n.items-start {\n  align-items: flex-start;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.space-x-1 > :not([hidden]) ~ :not([hidden]) {\n  --tw-space-x-reverse: 0;\n  margin-right: calc(0.25rem * var(--tw-space-x-reverse));\n  margin-left: calc(0.25rem * calc(1 - var(--tw-space-x-reverse)));\n}\n.overflow-auto {\n  overflow: auto;\n}\n.truncate {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.rounded-md {\n  border-radius: 0.375rem;\n}\n.rounded-2xl {\n  border-radius: 1rem;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.rounded-xl {\n  border-radius: 0.75rem;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.bg-black {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity));\n}\n.bg-slate-700 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(51 65 85 / var(--tw-bg-opacity));\n}\n.bg-purple-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 232 255 / var(--tw-bg-opacity));\n}\n.bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity));\n}\n.bg-blue-900\\/20 {\n  background-color: rgb(30 58 138 / 0.2);\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.bg-amber-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 243 199 / var(--tw-bg-opacity));\n}\n.bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity));\n}\n.bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity));\n}\n.bg-opacity-20 {\n  --tw-bg-opacity: 0.2;\n}\n.p-4 {\n  padding: 1rem;\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-1 {\n  padding: 0.25rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n}\n.py-2\\.5 {\n  padding-top: 0.625rem;\n  padding-bottom: 0.625rem;\n}\n.py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n}\n.pt-4 {\n  padding-top: 1rem;\n}\n.pb-2 {\n  padding-bottom: 0.5rem;\n}\n.pt-2 {\n  padding-top: 0.5rem;\n}\n.pl-3 {\n  padding-left: 0.75rem;\n}\n.pr-10 {\n  padding-right: 2.5rem;\n}\n.pr-2 {\n  padding-right: 0.5rem;\n}\n.pl-10 {\n  padding-left: 2.5rem;\n}\n.pr-4 {\n  padding-right: 1rem;\n}\n.text-left {\n  text-align: left;\n}\n.text-center {\n  text-align: center;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-3xl {\n  font-size: 1.875rem;\n  line-height: 2.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-base {\n  font-size: 1rem;\n  line-height: 1.5rem;\n}\n.font-medium {\n  font-weight: 500;\n}\n.font-bold {\n  font-weight: 700;\n}\n.font-normal {\n  font-weight: 400;\n}\n.leading-5 {\n  line-height: 1.25rem;\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.text-slate-900 {\n  --tw-text-opacity: 1;\n  color: rgb(15 23 42 / var(--tw-text-opacity));\n}\n.text-purple-500 {\n  --tw-text-opacity: 1;\n  color: rgb(168 85 247 / var(--tw-text-opacity));\n}\n.text-blue-700 {\n  --tw-text-opacity: 1;\n  color: rgb(29 78 216 / var(--tw-text-opacity));\n}\n.text-blue-100 {\n  --tw-text-opacity: 1;\n  color: rgb(219 234 254 / var(--tw-text-opacity));\n}\n.text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity));\n}\n.text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity));\n}\n.text-amber-900 {\n  --tw-text-opacity: 1;\n  color: rgb(120 53 15 / var(--tw-text-opacity));\n}\n.text-amber-600 {\n  --tw-text-opacity: 1;\n  color: rgb(217 119 6 / var(--tw-text-opacity));\n}\n.underline {\n  -webkit-text-decoration-line: underline;\n          text-decoration-line: underline;\n}\n.opacity-75 {\n  opacity: 0.75;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.opacity-0 {\n  opacity: 0;\n}\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.ring-1 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.ring-white {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.ring-black {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity));\n}\n.ring-opacity-60 {\n  --tw-ring-opacity: 0.6;\n}\n.ring-opacity-5 {\n  --tw-ring-opacity: 0.05;\n}\n.ring-offset-2 {\n  --tw-ring-offset-width: 2px;\n}\n.ring-offset-blue-400 {\n  --tw-ring-offset-color: #60a5fa;\n}\n.filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n}\n.transition {\n  transition-property: color, background-color, border-color, fill, stroke, opacity, box-shadow, transform, filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter, -webkit-text-decoration-color, -webkit-backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.duration-100 {\n  transition-duration: 100ms;\n}\n.ease-in {\n  transition-timing-function: cubic-bezier(0.4, 0, 1, 1);\n}\n.hover\\:bg-purple-200:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(233 213 255 / var(--tw-bg-opacity));\n}\n.hover\\:bg-white\\/\\[0\\.12\\]:hover {\n  background-color: rgb(255 255 255 / 0.12);\n}\n.hover\\:bg-opacity-30:hover {\n  --tw-bg-opacity: 0.3;\n}\n.hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.focus\\:outline-none:focus {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:border-indigo-500:focus-visible {\n  --tw-border-opacity: 1;\n  border-color: rgb(99 102 241 / var(--tw-border-opacity));\n}\n.focus-visible\\:ring-2:focus-visible {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:ring:focus-visible {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n}\n.focus-visible\\:ring-white:focus-visible {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity));\n}\n.focus-visible\\:ring-purple-500:focus-visible {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(168 85 247 / var(--tw-ring-opacity));\n}\n.focus-visible\\:ring-opacity-75:focus-visible {\n  --tw-ring-opacity: 0.75;\n}\n.focus-visible\\:ring-offset-2:focus-visible {\n  --tw-ring-offset-width: 2px;\n}\n.focus-visible\\:ring-offset-orange-300:focus-visible {\n  --tw-ring-offset-color: #fdba74;\n}\n@media (min-width: 640px) {\n\n  .sm\\:text-sm {\n    font-size: 0.875rem;\n    line-height: 1.25rem;\n  }\n}\n\n')();
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
    getTotalGoal().filter((a2) => a2.type == "talent").filter((a2) => all || !getGoalInactive().includes(a2.character)).map((a2) => updateTalent(a2, normal, skill, burst));
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
    getTotalGoal().filter((a2) => a2.type == "character").filter((a2) => all || !getGoalInactive().includes(a2.character)).map((a2) => updateCharacter(a2, characterStatusGoal));
  };
  const batchUpdateWeapon = (all, characterStatusGoal) => {
    getTotalGoal().filter((a2) => a2.type == "weapon").filter((a2) => all || !getGoalInactive().includes(a2.weapon)).map((a2) => updateCharacter(a2, characterStatusGoal));
  };
  let t$2 = typeof window != "undefined" ? React2.useLayoutEffect : React2.useEffect;
  function s$5(e2) {
    let r2 = React2.useRef(e2);
    return t$2(() => {
      r2.current = e2;
    }, [e2]), r2;
  }
  function i$2(e2, o2) {
    let [u2, t2] = React2.useState(e2), r2 = s$5(e2);
    return t$2(() => t2(r2.current), [r2, t2, ...o2]), u2;
  }
  function o$3() {
    let a2 = [], i2 = [], n2 = { enqueue(e2) {
      i2.push(e2);
    }, addEventListener(e2, t2, r2, s2) {
      return e2.addEventListener(t2, r2, s2), n2.add(() => e2.removeEventListener(t2, r2, s2));
    }, requestAnimationFrame(...e2) {
      let t2 = requestAnimationFrame(...e2);
      return n2.add(() => cancelAnimationFrame(t2));
    }, nextFrame(...e2) {
      return n2.requestAnimationFrame(() => n2.requestAnimationFrame(...e2));
    }, setTimeout(...e2) {
      let t2 = setTimeout(...e2);
      return n2.add(() => clearTimeout(t2));
    }, add(e2) {
      return a2.push(e2), () => {
        let t2 = a2.indexOf(e2);
        if (t2 >= 0) {
          let [r2] = a2.splice(t2, 1);
          r2();
        }
      };
    }, dispose() {
      for (let e2 of a2.splice(0))
        e2();
    }, async workQueue() {
      for (let e2 of i2.splice(0))
        await e2();
    } };
    return n2;
  }
  function p$7() {
    let [e2] = React2.useState(o$3);
    return React2.useEffect(() => () => e2.dispose(), [e2]), e2;
  }
  let o$2 = function(t2) {
    let e2 = s$5(t2);
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
  let I = (u$4 = React__default["default"].useId) != null ? u$4 : function() {
    let n2 = a$2(), [e2, o2] = React__default["default"].useState(n2 ? r$1 : null);
    return t$2(() => {
      e2 === null && o2(r$1());
    }, [e2]), e2 != null ? "" + e2 : void 0;
  };
  function t$1(e2) {
    typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o2) => setTimeout(() => {
      throw o2;
    }));
  }
  function s$4(e2, r2, n2) {
    let o2 = s$5(r2);
    React2.useEffect(() => {
      function t2(i2) {
        o2.current(i2);
      }
      return window.addEventListener(e2, t2, n2), () => window.removeEventListener(e2, t2, n2);
    }, [e2, n2]);
  }
  var C$3 = ((n2) => (n2[n2.None = 1] = "None", n2[n2.IgnoreScrollbars = 2] = "IgnoreScrollbars", n2))(C$3 || {});
  function w$3(c2, f2, n2 = 1) {
    let i2 = React2.useRef(false), l2 = o$2((r2) => {
      if (i2.current)
        return;
      i2.current = true, t$1(() => {
        i2.current = false;
      });
      let a2 = function t2(e2) {
        return typeof e2 == "function" ? t2(e2()) : Array.isArray(e2) || e2 instanceof Set ? e2 : [e2];
      }(c2), o2 = r2.target;
      if (!!o2.ownerDocument.documentElement.contains(o2)) {
        if ((n2 & 2) === 2) {
          let t2 = 20, e2 = o2.ownerDocument.documentElement;
          if (r2.clientX > e2.clientWidth - t2 || r2.clientX < t2 || r2.clientY > e2.clientHeight - t2 || r2.clientY < t2)
            return;
        }
        for (let t2 of a2) {
          if (t2 === null)
            continue;
          let e2 = t2 instanceof HTMLElement ? t2 : t2.current;
          if (e2 != null && e2.contains(o2))
            return;
        }
        return f2(r2, o2);
      }
    });
    s$4("pointerdown", l2), s$4("mousedown", l2);
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
    return t$2(() => {
      u2(i$1(t2));
    }, [t2.type, t2.as]), t$2(() => {
      n2 || !e2.current || e2.current instanceof HTMLButtonElement && !e2.current.hasAttribute("type") && u2("button");
    }, [n2, e2]), n2;
  }
  let u$3 = Symbol();
  function T$2(t2, n2 = true) {
    return Object.assign(t2, { [u$3]: n2 });
  }
  function y$1(...t2) {
    let n2 = React2.useRef(t2);
    React2.useEffect(() => {
      n2.current = t2;
    }, [t2]);
    let c2 = o$2((e2) => {
      for (let o2 of n2.current)
        o2 != null && (typeof o2 == "function" ? o2(e2) : o2.current = e2);
    });
    return t2.every((e2) => e2 == null || (e2 == null ? void 0 : e2[u$3])) ? void 0 : c2;
  }
  function t(n2) {
    return typeof window == "undefined" ? null : n2 instanceof Node ? n2.ownerDocument : n2 != null && n2.hasOwnProperty("current") && n2.current instanceof Node ? n2.current.ownerDocument : document;
  }
  function f$5(r2) {
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
          f$5(r2);
      }
    })();
    return d2 === -1 ? l2 : d2;
  }
  function u$2(r2, n2, ...a2) {
    if (r2 in n2) {
      let e2 = n2[r2];
      return typeof e2 == "function" ? e2(...a2) : e2;
    }
    let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t2, u$2), t2;
  }
  var x = ((n2) => (n2[n2.None = 0] = "None", n2[n2.RenderStrategy = 1] = "RenderStrategy", n2[n2.Static = 2] = "Static", n2))(x || {}), R = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(R || {});
  function _({ ourProps: r2, theirProps: t2, slot: e2, defaultTag: n2, features: a2, visible: s2 = true, name: l2 }) {
    let o2 = y(t2, r2);
    if (s2)
      return f$4(o2, e2, n2, l2);
    let d2 = a2 != null ? a2 : 0;
    if (d2 & 2) {
      let _a2 = o2, { static: i2 = false } = _a2, u2 = __objRest(_a2, ["static"]);
      if (i2)
        return f$4(u2, e2, n2, l2);
    }
    if (d2 & 1) {
      let _b2 = o2, { unmount: i2 = true } = _b2, u2 = __objRest(_b2, ["unmount"]);
      return u$2(i2 ? 0 : 1, { [0]() {
        return null;
      }, [1]() {
        return f$4(__spreadProps(__spreadValues({}, u2), { hidden: true, style: { display: "none" } }), e2, n2, l2);
      } });
    }
    return f$4(o2, e2, n2, l2);
  }
  function f$4(r2, t2 = {}, e2, n2) {
    let _a2 = m$1(r2, ["unmount", "static"]), { as: a2 = e2, children: s2, refName: l2 = "ref" } = _a2, o2 = __objRest(_a2, ["as", "children", "refName"]), d2 = r2.ref !== void 0 ? { [l2]: r2.ref } : {}, i2 = typeof s2 == "function" ? s2(t2) : s2;
    o2.className && typeof o2.className == "function" && (o2.className = o2.className(t2));
    let u2 = {};
    if (a2 === React2.Fragment && Object.keys(g$2(o2)).length > 0) {
      if (!React2.isValidElement(i2) || Array.isArray(i2) && i2.length > 1)
        throw new Error(['Passing props on "Fragment"!', "", `The current component <${n2} /> is rendering a "Fragment".`, "However we need to passthrough the following props:", Object.keys(o2).map((p2) => `  - ${p2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "Fragment".', "Render a single element as the child so that we can forward the props onto that element."].map((p2) => `  - ${p2}`).join(`
`)].join(`
`));
      return React2.cloneElement(i2, Object.assign({}, y(i2.props, g$2(m$1(o2, ["ref"]))), u2, d2));
    }
    return React2.createElement(a2, Object.assign({}, m$1(o2, ["ref"]), a2 !== React2.Fragment && d2, a2 !== React2.Fragment && u2), i2);
  }
  function y(...r2) {
    if (r2.length === 0)
      return {};
    if (r2.length === 1)
      return r2[0];
    let t2 = {}, e2 = {};
    for (let a2 of r2)
      for (let s2 in a2)
        s2.startsWith("on") && typeof a2[s2] == "function" ? (e2[s2] != null || (e2[s2] = []), e2[s2].push(a2[s2])) : t2[s2] = a2[s2];
    if (t2.disabled || t2["aria-disabled"])
      return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((a2) => [a2, void 0])));
    for (let a2 in e2)
      Object.assign(t2, { [a2](s2, ...l2) {
        let o2 = e2[a2];
        for (let d2 of o2) {
          if (s2.defaultPrevented)
            return;
          d2(s2, ...l2);
        }
      } });
    return t2;
  }
  function H$4(r2) {
    var t2;
    return Object.assign(React2.forwardRef(r2), { displayName: (t2 = r2.displayName) != null ? t2 : r2.name });
  }
  function g$2(r2) {
    let t2 = Object.assign({}, r2);
    for (let e2 in t2)
      t2[e2] === void 0 && delete t2[e2];
    return t2;
  }
  function m$1(r2, t2 = []) {
    let e2 = Object.assign({}, r2);
    for (let n2 of t2)
      n2 in e2 && delete e2[n2];
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
  function p$6(n2) {
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
  let f$2 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
  var p$5 = ((o2) => (o2[o2.First = 1] = "First", o2[o2.Previous = 2] = "Previous", o2[o2.Next = 4] = "Next", o2[o2.Last = 8] = "Last", o2[o2.WrapAround = 16] = "WrapAround", o2[o2.NoScroll = 32] = "NoScroll", o2))(p$5 || {}), L$1 = ((n2) => (n2[n2.Error = 0] = "Error", n2[n2.Overflow = 1] = "Overflow", n2[n2.Success = 2] = "Success", n2[n2.Underflow = 3] = "Underflow", n2))(L$1 || {}), N$3 = ((t2) => (t2[t2.Previous = -1] = "Previous", t2[t2.Next = 1] = "Next", t2))(N$3 || {});
  function T$1(e2 = document.body) {
    return e2 == null ? [] : Array.from(e2.querySelectorAll(f$2));
  }
  var b = ((t2) => (t2[t2.Strict = 0] = "Strict", t2[t2.Loose = 1] = "Loose", t2))(b || {});
  function S$1(e2, r2 = 0) {
    var t$12;
    return e2 === ((t$12 = t(e2)) == null ? void 0 : t$12.body) ? false : u$2(r2, { [0]() {
      return e2.matches(f$2);
    }, [1]() {
      let l2 = e2;
      for (; l2 !== null; ) {
        if (l2.matches(f$2))
          return true;
        l2 = l2.parentElement;
      }
      return false;
    } });
  }
  let M$1 = ["textarea", "input"].join(",");
  function h$5(e2) {
    var r2, t2;
    return (t2 = (r2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : r2.call(e2, M$1)) != null ? t2 : false;
  }
  function v$1(e2, r2 = (t2) => t2) {
    return e2.slice().sort((t2, l2) => {
      let n2 = r2(t2), i2 = r2(l2);
      if (n2 === null || i2 === null)
        return 0;
      let o2 = n2.compareDocumentPosition(i2);
      return o2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : o2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    });
  }
  function H$3(e2, r2, t2 = true) {
    let l2 = Array.isArray(e2) ? e2.length > 0 ? e2[0].ownerDocument : document : e2.ownerDocument, n2 = Array.isArray(e2) ? t2 ? v$1(e2) : e2 : T$1(e2), i2 = l2.activeElement, o2 = (() => {
      if (r2 & 5)
        return 1;
      if (r2 & 10)
        return -1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), d2 = (() => {
      if (r2 & 1)
        return 0;
      if (r2 & 2)
        return Math.max(0, n2.indexOf(i2)) - 1;
      if (r2 & 4)
        return Math.max(0, n2.indexOf(i2)) + 1;
      if (r2 & 8)
        return n2.length - 1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), m2 = r2 & 32 ? { preventScroll: true } : {}, c2 = 0, s2 = n2.length, u2;
    do {
      if (c2 >= s2 || c2 + s2 <= 0)
        return 0;
      let a2 = d2 + c2;
      if (r2 & 16)
        a2 = (a2 + s2) % s2;
      else {
        if (a2 < 0)
          return 3;
        if (a2 >= s2)
          return 1;
      }
      u2 = n2[a2], u2 == null || u2.focus(m2), c2 += o2;
    } while (u2 !== l2.activeElement);
    return r2 & 6 && h$5(u2) && u2.select(), u2.hasAttribute("tabindex") || u2.setAttribute("tabindex", "0"), 2;
  }
  let a = "div";
  var s$1 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(s$1 || {});
  let h$4 = H$4(function(t2, o2) {
    let _a2 = t2, { features: e2 = 1 } = _a2, r2 = __objRest(_a2, ["features"]), d2 = { ref: o2, "aria-hidden": (e2 & 2) === 2 ? true : void 0, style: __spreadValues({ position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0" }, (e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" }) };
    return _({ ourProps: d2, theirProps: r2, slot: {}, defaultTag: a, name: "Hidden" });
  });
  let o$1 = React2.createContext(null);
  o$1.displayName = "OpenClosedContext";
  var p$4 = ((e2) => (e2[e2.Open = 0] = "Open", e2[e2.Closed = 1] = "Closed", e2))(p$4 || {});
  function s() {
    return React2.useContext(o$1);
  }
  function C$2({ value: t2, children: n2 }) {
    return React__default["default"].createElement(o$1.Provider, { value: t2 }, n2);
  }
  var o = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o || {});
  function f$1() {
    let e2 = React2.useRef(false);
    return t$2(() => (e2.current = true, () => {
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
  let S = "p", F$1 = H$4(function(t2, a2) {
    let e2 = u$1(), i2 = `headlessui-description-${I()}`, s2 = y$1(a2);
    t$2(() => e2.register(i2), [i2, e2.register]);
    let n2 = t2, o2 = __spreadProps(__spreadValues({ ref: s2 }, e2.props), { id: i2 });
    return _({ ourProps: o2, theirProps: n2, slot: e2.slot || {}, defaultTag: S, name: e2.name || "Description" });
  });
  var Q = ((o2) => (o2[o2.Open = 0] = "Open", o2[o2.Closed = 1] = "Closed", o2))(Q || {}), V = ((l2) => (l2[l2.ToggleDisclosure = 0] = "ToggleDisclosure", l2[l2.CloseDisclosure = 1] = "CloseDisclosure", l2[l2.SetButtonId = 2] = "SetButtonId", l2[l2.SetPanelId = 3] = "SetPanelId", l2[l2.LinkPanel = 4] = "LinkPanel", l2[l2.UnlinkPanel = 5] = "UnlinkPanel", l2))(V || {});
  let X = { [0]: (e2) => __spreadProps(__spreadValues({}, e2), { disclosureState: u$2(e2.disclosureState, { [0]: 1, [1]: 0 }) }), [1]: (e2) => e2.disclosureState === 1 ? e2 : __spreadProps(__spreadValues({}, e2), { disclosureState: 1 }), [4](e2) {
    return e2.linkedPanel === true ? e2 : __spreadProps(__spreadValues({}, e2), { linkedPanel: true });
  }, [5](e2) {
    return e2.linkedPanel === false ? e2 : __spreadProps(__spreadValues({}, e2), { linkedPanel: false });
  }, [2](e2, t2) {
    return e2.buttonId === t2.buttonId ? e2 : __spreadProps(__spreadValues({}, e2), { buttonId: t2.buttonId });
  }, [3](e2, t2) {
    return e2.panelId === t2.panelId ? e2 : __spreadProps(__spreadValues({}, e2), { panelId: t2.panelId });
  } }, h$3 = React2.createContext(null);
  h$3.displayName = "DisclosureContext";
  function H$2(e2) {
    let t2 = React2.useContext(h$3);
    if (t2 === null) {
      let o2 = new Error(`<${e2} /> is missing a parent <Disclosure /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(o2, H$2), o2;
    }
    return t2;
  }
  let U = React2.createContext(null);
  U.displayName = "DisclosureAPIContext";
  function K$1(e2) {
    let t2 = React2.useContext(U);
    if (t2 === null) {
      let o2 = new Error(`<${e2} /> is missing a parent <Disclosure /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(o2, K$1), o2;
    }
    return t2;
  }
  let w$2 = React2.createContext(null);
  w$2.displayName = "DisclosurePanelContext";
  function Y() {
    return React2.useContext(w$2);
  }
  function Z$1(e2, t2) {
    return u$2(t2.type, X, e2, t2);
  }
  let ee$1 = React2.Fragment, te$1 = H$4(function(t$12, o2) {
    let _a2 = t$12, { defaultOpen: n2 = false } = _a2, s2 = __objRest(_a2, ["defaultOpen"]), i2 = `headlessui-disclosure-button-${I()}`, l2 = `headlessui-disclosure-panel-${I()}`, u2 = React2.useRef(null), D = y$1(o2, T$2((f2) => {
      u2.current = f2;
    }, t$12.as === void 0 || t$12.as === React__default["default"].Fragment)), P = React2.useRef(null), m2 = React2.useRef(null), p2 = React2.useReducer(Z$1, { disclosureState: n2 ? 0 : 1, linkedPanel: false, buttonRef: m2, panelRef: P, buttonId: i2, panelId: l2 }), [{ disclosureState: a2 }, c2] = p2;
    React2.useEffect(() => c2({ type: 2, buttonId: i2 }), [i2, c2]), React2.useEffect(() => c2({ type: 3, panelId: l2 }), [l2, c2]);
    let T2 = o$2((f2) => {
      c2({ type: 1 });
      let A = t(u2);
      if (!A)
        return;
      let I2 = (() => f2 ? f2 instanceof HTMLElement ? f2 : f2.current instanceof HTMLElement ? f2.current : A.getElementById(i2) : A.getElementById(i2))();
      I2 == null || I2.focus();
    }), C2 = React2.useMemo(() => ({ close: T2 }), [T2]), r2 = React2.useMemo(() => ({ open: a2 === 0, close: T2 }), [a2, T2]), d2 = { ref: D };
    return React__default["default"].createElement(h$3.Provider, { value: p2 }, React__default["default"].createElement(U.Provider, { value: C2 }, React__default["default"].createElement(C$2, { value: u$2(a2, { [0]: p$4.Open, [1]: p$4.Closed }) }, _({ ourProps: d2, theirProps: s2, slot: r2, defaultTag: ee$1, name: "Disclosure" }))));
  }), ne$1 = "button", le$1 = H$4(function(t2, o$12) {
    let [n2, s2] = H$2("Disclosure.Button"), i2 = Y(), l2 = i2 === null ? false : i2 === n2.panelId, u2 = React2.useRef(null), D = y$1(u2, o$12, l2 ? null : n2.buttonRef), P = o$2((r2) => {
      var d2;
      if (l2) {
        if (n2.disclosureState === 1)
          return;
        switch (r2.key) {
          case o.Space:
          case o.Enter:
            r2.preventDefault(), r2.stopPropagation(), s2({ type: 0 }), (d2 = n2.buttonRef.current) == null || d2.focus();
            break;
        }
      } else
        switch (r2.key) {
          case o.Space:
          case o.Enter:
            r2.preventDefault(), r2.stopPropagation(), s2({ type: 0 });
            break;
        }
    }), m2 = o$2((r2) => {
      switch (r2.key) {
        case o.Space:
          r2.preventDefault();
          break;
      }
    }), p2 = o$2((r$12) => {
      var d2;
      r(r$12.currentTarget) || t2.disabled || (l2 ? (s2({ type: 0 }), (d2 = n2.buttonRef.current) == null || d2.focus()) : s2({ type: 0 }));
    }), a2 = React2.useMemo(() => ({ open: n2.disclosureState === 0 }), [n2]), c2 = s$3(t2, u2), T2 = t2, C2 = l2 ? { ref: D, type: c2, onKeyDown: P, onClick: p2 } : { ref: D, id: n2.buttonId, type: c2, "aria-expanded": t2.disabled ? void 0 : n2.disclosureState === 0, "aria-controls": n2.linkedPanel ? n2.panelId : void 0, onKeyDown: P, onKeyUp: m2, onClick: p2 };
    return _({ ourProps: C2, theirProps: T2, slot: a2, defaultTag: ne$1, name: "Disclosure.Button" });
  }), oe$1 = "div", re$1 = x.RenderStrategy | x.Static, se$1 = H$4(function(t2, o2) {
    let [n2, s$12] = H$2("Disclosure.Panel"), { close: i2 } = K$1("Disclosure.Panel"), l2 = y$1(o2, n2.panelRef, () => {
      n2.linkedPanel || s$12({ type: 4 });
    }), u2 = s(), D = (() => u2 !== null ? u2 === p$4.Open : n2.disclosureState === 0)();
    React2.useEffect(() => () => s$12({ type: 5 }), [s$12]), React2.useEffect(() => {
      var a2;
      n2.disclosureState === 1 && ((a2 = t2.unmount) != null ? a2 : true) && s$12({ type: 5 });
    }, [n2.disclosureState, t2.unmount, s$12]);
    let P = React2.useMemo(() => ({ open: n2.disclosureState === 0, close: i2 }), [n2, i2]), m2 = t2, p2 = { ref: l2, id: n2.panelId };
    return React__default["default"].createElement(w$2.Provider, { value: n2.panelId }, _({ ourProps: p2, theirProps: m2, slot: P, defaultTag: oe$1, features: re$1, visible: D, name: "Disclosure.Panel" }));
  }), ke = Object.assign(te$1, { Button: le$1, Panel: se$1 });
  var ce$1 = ((n2) => (n2[n2.Open = 0] = "Open", n2[n2.Closed = 1] = "Closed", n2))(ce$1 || {}), fe$1 = ((n2) => (n2[n2.Single = 0] = "Single", n2[n2.Multi = 1] = "Multi", n2))(fe$1 || {}), be$2 = ((n2) => (n2[n2.Pointer = 0] = "Pointer", n2[n2.Other = 1] = "Other", n2))(be$2 || {}), Te$1 = ((r2) => (r2[r2.OpenListbox = 0] = "OpenListbox", r2[r2.CloseListbox = 1] = "CloseListbox", r2[r2.SetDisabled = 2] = "SetDisabled", r2[r2.SetOrientation = 3] = "SetOrientation", r2[r2.GoToOption = 4] = "GoToOption", r2[r2.Search = 5] = "Search", r2[r2.ClearSearch = 6] = "ClearSearch", r2[r2.RegisterOption = 7] = "RegisterOption", r2[r2.UnregisterOption = 8] = "UnregisterOption", r2))(Te$1 || {});
  function H$1(t2, i2 = (n2) => n2) {
    let n2 = t2.activeOptionIndex !== null ? t2.options[t2.activeOptionIndex] : null, e2 = v$1(i2(t2.options.slice()), (p2) => p2.dataRef.current.domRef.current), o2 = n2 ? e2.indexOf(n2) : null;
    return o2 === -1 && (o2 = null), { options: e2, activeOptionIndex: o2 };
  }
  let xe$1 = { [1](t2) {
    return t2.disabled || t2.listboxState === 1 ? t2 : __spreadProps(__spreadValues({}, t2), { activeOptionIndex: null, listboxState: 1 });
  }, [0](t2) {
    if (t2.disabled || t2.listboxState === 0)
      return t2;
    let i2 = t2.activeOptionIndex, { value: n2, mode: e2, compare: o2 } = t2.propsRef.current, p2 = t2.options.findIndex((l2) => {
      let s2 = l2.dataRef.current.value;
      return u$2(e2, { [1]: () => n2.some((r2) => o2(r2, s2)), [0]: () => o2(n2, s2) });
    });
    return p2 !== -1 && (i2 = p2), __spreadProps(__spreadValues({}, t2), { listboxState: 0, activeOptionIndex: i2 });
  }, [2](t2, i2) {
    return t2.disabled === i2.disabled ? t2 : __spreadProps(__spreadValues({}, t2), { disabled: i2.disabled });
  }, [3](t2, i2) {
    return t2.orientation === i2.orientation ? t2 : __spreadProps(__spreadValues({}, t2), { orientation: i2.orientation });
  }, [4](t2, i2) {
    var o2;
    if (t2.disabled || t2.listboxState === 1)
      return t2;
    let n2 = H$1(t2), e2 = x$1(i2, { resolveItems: () => n2.options, resolveActiveIndex: () => n2.activeOptionIndex, resolveId: (p2) => p2.id, resolveDisabled: (p2) => p2.dataRef.current.disabled });
    return __spreadProps(__spreadValues(__spreadValues({}, t2), n2), { searchQuery: "", activeOptionIndex: e2, activationTrigger: (o2 = i2.trigger) != null ? o2 : 1 });
  }, [5]: (t2, i2) => {
    if (t2.disabled || t2.listboxState === 1)
      return t2;
    let e2 = t2.searchQuery !== "" ? 0 : 1, o2 = t2.searchQuery + i2.value.toLowerCase(), l2 = (t2.activeOptionIndex !== null ? t2.options.slice(t2.activeOptionIndex + e2).concat(t2.options.slice(0, t2.activeOptionIndex + e2)) : t2.options).find((u2) => {
      var r2;
      return !u2.dataRef.current.disabled && ((r2 = u2.dataRef.current.textValue) == null ? void 0 : r2.startsWith(o2));
    }), s2 = l2 ? t2.options.indexOf(l2) : -1;
    return s2 === -1 || s2 === t2.activeOptionIndex ? __spreadProps(__spreadValues({}, t2), { searchQuery: o2 }) : __spreadProps(__spreadValues({}, t2), { searchQuery: o2, activeOptionIndex: s2, activationTrigger: 1 });
  }, [6](t2) {
    return t2.disabled || t2.listboxState === 1 || t2.searchQuery === "" ? t2 : __spreadProps(__spreadValues({}, t2), { searchQuery: "" });
  }, [7]: (t2, i2) => {
    let n2 = { id: i2.id, dataRef: i2.dataRef }, e2 = H$1(t2, (o2) => [...o2, n2]);
    if (t2.activeOptionIndex === null) {
      let { value: o2, mode: p2, compare: l2 } = t2.propsRef.current, s2 = i2.dataRef.current.value;
      u$2(p2, { [1]: () => o2.some((r2) => l2(r2, s2)), [0]: () => l2(o2, s2) }) && (e2.activeOptionIndex = e2.options.indexOf(n2));
    }
    return __spreadValues(__spreadValues({}, t2), e2);
  }, [8]: (t2, i2) => {
    let n2 = H$1(t2, (e2) => {
      let o2 = e2.findIndex((p2) => p2.id === i2.id);
      return o2 !== -1 && e2.splice(o2, 1), e2;
    });
    return __spreadProps(__spreadValues(__spreadValues({}, t2), n2), { activationTrigger: 1 });
  } }, j$1 = React2.createContext(null);
  j$1.displayName = "ListboxContext";
  function w$1(t2) {
    let i2 = React2.useContext(j$1);
    if (i2 === null) {
      let n2 = new Error(`<${t2} /> is missing a parent <Listbox /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(n2, w$1), n2;
    }
    return i2;
  }
  function ye$1(t2, i2) {
    return u$2(i2.type, xe$1, t2, i2);
  }
  let Oe = React2.Fragment, me = H$4(function(i2, n2) {
    let _a2 = i2, { value: e$1, name: o2, onChange: p2, disabled: l2 = false, horizontal: s2 = false, multiple: u2 = false } = _a2, r2 = __objRest(_a2, ["value", "name", "onChange", "disabled", "horizontal", "multiple"]);
    const x2 = s2 ? "horizontal" : "vertical";
    let A = y$1(n2), R2 = React2.useReducer(ye$1, { listboxState: 1, propsRef: { current: { value: e$1, onChange: p2, mode: u2 ? 1 : 0, compare: o$2((y2, m2) => y2 === m2) } }, labelRef: React2.createRef(), buttonRef: React2.createRef(), optionsRef: React2.createRef(), disabled: l2, orientation: x2, options: [], searchQuery: "", activeOptionIndex: null, activationTrigger: 1 }), [{ listboxState: b$1, propsRef: O, optionsRef: T2, buttonRef: d2 }, a2] = R2;
    O.current.value = e$1, O.current.mode = u2 ? 1 : 0, t$2(() => {
      O.current.onChange = (y2) => u$2(O.current.mode, { [0]() {
        return p2(y2);
      }, [1]() {
        let m2 = O.current.value.slice(), C2 = m2.indexOf(y2);
        return C2 === -1 ? m2.push(y2) : m2.splice(C2, 1), p2(m2);
      } });
    }, [p2, O]), t$2(() => a2({ type: 2, disabled: l2 }), [l2]), t$2(() => a2({ type: 3, orientation: x2 }), [x2]), w$3([d2, T2], (y2, m2) => {
      var C2;
      b$1 === 0 && (a2({ type: 1 }), S$1(m2, b.Loose) || (y2.preventDefault(), (C2 = d2.current) == null || C2.focus()));
    });
    let c2 = React2.useMemo(() => ({ open: b$1 === 0, disabled: l2 }), [b$1, l2]), D = { ref: A };
    return React__default["default"].createElement(j$1.Provider, { value: R2 }, React__default["default"].createElement(C$2, { value: u$2(b$1, { [0]: p$4.Open, [1]: p$4.Closed }) }, o2 != null && e$1 != null && e({ [o2]: e$1 }).map(([y2, m2]) => React__default["default"].createElement(h$4, __spreadValues({ features: s$1.Hidden }, g$2({ key: y2, as: "input", type: "hidden", hidden: true, readOnly: true, name: y2, value: m2 })))), _({ ourProps: D, theirProps: r2, slot: c2, defaultTag: Oe, name: "Listbox" })));
  }), ge$1 = "button", Re = H$4(function(i2, n2) {
    var T2;
    let [e2, o$12] = w$1("Listbox.Button"), p2 = y$1(e2.buttonRef, n2), l2 = `headlessui-listbox-button-${I()}`, s2 = p$7(), u2 = o$2((d2) => {
      switch (d2.key) {
        case o.Space:
        case o.Enter:
        case o.ArrowDown:
          d2.preventDefault(), o$12({ type: 0 }), s2.nextFrame(() => {
            e2.propsRef.current.value || o$12({ type: 4, focus: a$1.First });
          });
          break;
        case o.ArrowUp:
          d2.preventDefault(), o$12({ type: 0 }), s2.nextFrame(() => {
            e2.propsRef.current.value || o$12({ type: 4, focus: a$1.Last });
          });
          break;
      }
    }), r$12 = o$2((d2) => {
      switch (d2.key) {
        case o.Space:
          d2.preventDefault();
          break;
      }
    }), x2 = o$2((d2) => {
      if (r(d2.currentTarget))
        return d2.preventDefault();
      e2.listboxState === 0 ? (o$12({ type: 1 }), s2.nextFrame(() => {
        var a2;
        return (a2 = e2.buttonRef.current) == null ? void 0 : a2.focus({ preventScroll: true });
      })) : (d2.preventDefault(), o$12({ type: 0 }));
    }), A = i$2(() => {
      if (!!e2.labelRef.current)
        return [e2.labelRef.current.id, l2].join(" ");
    }, [e2.labelRef.current, l2]), R2 = React2.useMemo(() => ({ open: e2.listboxState === 0, disabled: e2.disabled }), [e2]), b2 = i2, O = { ref: p2, id: l2, type: s$3(i2, e2.buttonRef), "aria-haspopup": true, "aria-controls": (T2 = e2.optionsRef.current) == null ? void 0 : T2.id, "aria-expanded": e2.disabled ? void 0 : e2.listboxState === 0, "aria-labelledby": A, disabled: e2.disabled, onKeyDown: u2, onKeyUp: r$12, onClick: x2 };
    return _({ ourProps: O, theirProps: b2, slot: R2, defaultTag: ge$1, name: "Listbox.Button" });
  }), Le = "label", ve$1 = H$4(function(i2, n2) {
    let [e2] = w$1("Listbox.Label"), o2 = `headlessui-listbox-label-${I()}`, p2 = y$1(e2.labelRef, n2), l2 = o$2(() => {
      var x2;
      return (x2 = e2.buttonRef.current) == null ? void 0 : x2.focus({ preventScroll: true });
    }), s2 = React2.useMemo(() => ({ open: e2.listboxState === 0, disabled: e2.disabled }), [e2]);
    return _({ ourProps: { ref: p2, id: o2, onClick: l2 }, theirProps: i2, slot: s2, defaultTag: Le, name: "Listbox.Label" });
  }), Se$1 = "ul", Ae = x.RenderStrategy | x.Static, he = H$4(function(i2, n2) {
    var d2;
    let [e2, o$12] = w$1("Listbox.Options"), p2 = y$1(e2.optionsRef, n2), l2 = `headlessui-listbox-options-${I()}`, s$12 = p$7(), u2 = p$7(), r2 = s(), x2 = (() => r2 !== null ? r2 === p$4.Open : e2.listboxState === 0)();
    React2.useEffect(() => {
      var c2;
      let a2 = e2.optionsRef.current;
      !a2 || e2.listboxState === 0 && a2 !== ((c2 = t(a2)) == null ? void 0 : c2.activeElement) && a2.focus({ preventScroll: true });
    }, [e2.listboxState, e2.optionsRef]);
    let A = o$2((a2) => {
      switch (u2.dispose(), a2.key) {
        case o.Space:
          if (e2.searchQuery !== "")
            return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 5, value: a2.key });
        case o.Enter:
          if (a2.preventDefault(), a2.stopPropagation(), e2.activeOptionIndex !== null) {
            let { dataRef: c2 } = e2.options[e2.activeOptionIndex];
            e2.propsRef.current.onChange(c2.current.value);
          }
          e2.propsRef.current.mode === 0 && (o$12({ type: 1 }), o$3().nextFrame(() => {
            var c2;
            return (c2 = e2.buttonRef.current) == null ? void 0 : c2.focus({ preventScroll: true });
          }));
          break;
        case u$2(e2.orientation, { vertical: o.ArrowDown, horizontal: o.ArrowRight }):
          return a2.preventDefault(), a2.stopPropagation(), o$12({ type: 4, focus: a$1.Next });
        case u$2(e2.orientation, { vertical: o.ArrowUp, horizontal: o.ArrowLeft }):
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
          a2.key.length === 1 && (o$12({ type: 5, value: a2.key }), u2.setTimeout(() => o$12({ type: 6 }), 350));
          break;
      }
    }), R2 = i$2(() => {
      var a2, c2, D;
      return (D = (a2 = e2.labelRef.current) == null ? void 0 : a2.id) != null ? D : (c2 = e2.buttonRef.current) == null ? void 0 : c2.id;
    }, [e2.labelRef.current, e2.buttonRef.current]), b2 = React2.useMemo(() => ({ open: e2.listboxState === 0 }), [e2]), O = i2, T2 = { "aria-activedescendant": e2.activeOptionIndex === null || (d2 = e2.options[e2.activeOptionIndex]) == null ? void 0 : d2.id, "aria-multiselectable": e2.propsRef.current.mode === 1 ? true : void 0, "aria-labelledby": R2, "aria-orientation": e2.orientation, id: l2, onKeyDown: A, role: "listbox", tabIndex: 0, ref: p2 };
    return _({ ourProps: T2, theirProps: O, slot: b2, defaultTag: Se$1, features: Ae, visible: x2, name: "Listbox.Options" });
  }), Pe = "li", De = H$4(function(i2, n2) {
    let _a2 = i2, { disabled: e2 = false, value: o2 } = _a2, p2 = __objRest(_a2, ["disabled", "value"]), [l2, s2] = w$1("Listbox.Option"), u2 = `headlessui-listbox-option-${I()}`, r2 = l2.activeOptionIndex !== null ? l2.options[l2.activeOptionIndex].id === u2 : false, { value: x2, compare: A } = l2.propsRef.current, R2 = u$2(l2.propsRef.current.mode, { [1]: () => x2.some((S2) => A(S2, o2)), [0]: () => A(x2, o2) }), b2 = React2.useRef(null), O = y$1(n2, b2);
    t$2(() => {
      if (l2.listboxState !== 0 || !r2 || l2.activationTrigger === 0)
        return;
      let S2 = o$3();
      return S2.requestAnimationFrame(() => {
        var L2, K2;
        (K2 = (L2 = b2.current) == null ? void 0 : L2.scrollIntoView) == null || K2.call(L2, { block: "nearest" });
      }), S2.dispose;
    }, [b2, r2, l2.listboxState, l2.activationTrigger, l2.activeOptionIndex]);
    let T2 = React2.useRef({ disabled: e2, value: o2, domRef: b2 });
    t$2(() => {
      T2.current.disabled = e2;
    }, [T2, e2]), t$2(() => {
      T2.current.value = o2;
    }, [T2, o2]), t$2(() => {
      var S2, L2;
      T2.current.textValue = (L2 = (S2 = b2.current) == null ? void 0 : S2.textContent) == null ? void 0 : L2.toLowerCase();
    }, [T2, b2]);
    let d2 = o$2(() => l2.propsRef.current.onChange(o2));
    t$2(() => (s2({ type: 7, id: u2, dataRef: T2 }), () => s2({ type: 8, id: u2 })), [T2, u2]);
    let a2 = o$2((S2) => {
      if (e2)
        return S2.preventDefault();
      d2(), l2.propsRef.current.mode === 0 && (s2({ type: 1 }), o$3().nextFrame(() => {
        var L2;
        return (L2 = l2.buttonRef.current) == null ? void 0 : L2.focus({ preventScroll: true });
      }));
    }), c2 = o$2(() => {
      if (e2)
        return s2({ type: 4, focus: a$1.Nothing });
      s2({ type: 4, focus: a$1.Specific, id: u2 });
    }), D = o$2(() => {
      e2 || r2 || s2({ type: 4, focus: a$1.Specific, id: u2, trigger: 0 });
    }), y2 = o$2(() => {
      e2 || !r2 || s2({ type: 4, focus: a$1.Nothing });
    }), m2 = React2.useMemo(() => ({ active: r2, selected: R2, disabled: e2 }), [r2, R2, e2]);
    return _({ ourProps: { id: u2, ref: O, role: "option", tabIndex: e2 === true ? void 0 : -1, "aria-disabled": e2 === true ? true : void 0, "aria-selected": R2 === true ? true : void 0, disabled: void 0, onClick: a2, onFocus: c2, onPointerMove: D, onMouseMove: D, onPointerLeave: y2, onMouseLeave: y2 }, theirProps: p2, slot: m2, defaultTag: Pe, name: "Listbox.Option" });
  }), rt = Object.assign(me, { Button: Re, Label: ve$1, Options: he, Option: De });
  let u = React2.createContext(null);
  function c() {
    let o2 = React2.useContext(u);
    if (o2 === null) {
      let t2 = new Error("You used a <Label /> component, but it is not inside a relevant parent.");
      throw Error.captureStackTrace && Error.captureStackTrace(t2, c), t2;
    }
    return o2;
  }
  function M() {
    let [o2, t2] = React2.useState([]);
    return [o2.length > 0 ? o2.join(" ") : void 0, React2.useMemo(() => function(e2) {
      let l2 = o$2((a2) => (t2((i2) => [...i2, a2]), () => t2((i2) => {
        let n2 = i2.slice(), d2 = n2.indexOf(a2);
        return d2 !== -1 && n2.splice(d2, 1), n2;
      }))), r2 = React2.useMemo(() => ({ register: l2, slot: e2.slot, name: e2.name, props: e2.props }), [l2, e2.slot, e2.name, e2.props]);
      return React__default["default"].createElement(u.Provider, { value: r2 }, e2.children);
    }, [t2])];
  }
  let h$2 = "label", F = H$4(function(t2, s2) {
    let _a2 = t2, { passive: e2 = false } = _a2, l2 = __objRest(_a2, ["passive"]), r2 = c(), a2 = `headlessui-label-${I()}`, i2 = y$1(s2);
    t$2(() => r2.register(a2), [a2, r2.register]);
    let n2 = __spreadProps(__spreadValues({ ref: i2 }, r2.props), { id: a2 });
    return e2 && ("onClick" in n2 && delete n2.onClick, "onClick" in l2 && delete l2.onClick), _({ ourProps: n2, theirProps: l2, slot: r2.slot || {}, defaultTag: h$2, name: r2.name || "Label" });
  });
  let p$3 = React2.createContext(null);
  p$3.displayName = "GroupContext";
  let j = React2.Fragment;
  function N$2(m2) {
    let [n2, i2] = React2.useState(null), [r2, s2] = M(), [l2, c2] = k(), d2 = React2.useMemo(() => ({ switch: n2, setSwitch: i2, labelledby: r2, describedby: l2 }), [n2, i2, r2, l2]), u2 = {}, e2 = m2;
    return React__default["default"].createElement(c2, { name: "Switch.Description" }, React__default["default"].createElement(s2, { name: "Switch.Label", props: { onClick() {
      !n2 || (n2.click(), n2.focus({ preventScroll: true }));
    } } }, React__default["default"].createElement(p$3.Provider, { value: d2 }, _({ ourProps: u2, theirProps: e2, defaultTag: j, name: "Switch.Group" }))));
  }
  let $$2 = "button", q$1 = H$4(function(n2, i2) {
    let _a2 = n2, { checked: r$12, onChange: s2, name: l2, value: c2 } = _a2, d2 = __objRest(_a2, ["checked", "onChange", "name", "value"]), u2 = `headlessui-switch-${I()}`, e2 = React2.useContext(p$3), f2 = React2.useRef(null), S2 = y$1(f2, i2, e2 === null ? null : e2.setSwitch), h2 = o$2(() => s2(!r$12)), E = o$2((t2) => {
      if (r(t2.currentTarget))
        return t2.preventDefault();
      t2.preventDefault(), h2();
    }), w2 = o$2((t2) => {
      t2.key === o.Space ? (t2.preventDefault(), h2()) : t2.key === o.Enter && p$6(t2.currentTarget);
    }), P = o$2((t2) => t2.preventDefault()), v2 = React2.useMemo(() => ({ checked: r$12 }), [r$12]), g2 = { id: u2, ref: S2, role: "switch", type: s$3(n2, f2), tabIndex: 0, "aria-checked": r$12, "aria-labelledby": e2 == null ? void 0 : e2.labelledby, "aria-describedby": e2 == null ? void 0 : e2.describedby, onClick: E, onKeyUp: w2, onKeyPress: P };
    return React__default["default"].createElement(React__default["default"].Fragment, null, l2 != null && r$12 && React__default["default"].createElement(h$4, __spreadValues({ features: s$1.Hidden }, g$2({ as: "input", type: "checkbox", hidden: true, readOnly: true, checked: r$12, name: l2, value: c2 }))), _({ ourProps: g2, theirProps: d2, slot: v2, defaultTag: $$2, name: "Switch" }));
  }), ue$1 = Object.assign(q$1, { Group: N$2, Label: F, Description: F$1 });
  function p$2({ onFocus: n2 }) {
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
  var re = ((n2) => (n2[n2.SetSelectedIndex = 0] = "SetSelectedIndex", n2[n2.RegisterTab = 1] = "RegisterTab", n2[n2.UnregisterTab = 2] = "UnregisterTab", n2[n2.RegisterPanel = 3] = "RegisterPanel", n2[n2.UnregisterPanel = 4] = "UnregisterPanel", n2[n2.ForceRerender = 5] = "ForceRerender", n2))(re || {});
  let ne = { [0](e2, t2) {
    let r2 = e2.tabs.filter((n2) => {
      var l2;
      return !((l2 = n2.current) != null && l2.hasAttribute("disabled"));
    });
    if (t2.index < 0)
      return __spreadProps(__spreadValues({}, e2), { selectedIndex: e2.tabs.indexOf(r2[0]) });
    if (t2.index > e2.tabs.length)
      return __spreadProps(__spreadValues({}, e2), { selectedIndex: e2.tabs.indexOf(r2[r2.length - 1]) });
    let s2 = e2.tabs.slice(0, t2.index), d2 = [...e2.tabs.slice(t2.index), ...s2].find((n2) => r2.includes(n2));
    return d2 ? __spreadProps(__spreadValues({}, e2), { selectedIndex: e2.tabs.indexOf(d2) }) : e2;
  }, [1](e2, t2) {
    return e2.tabs.includes(t2.tab) ? e2 : __spreadProps(__spreadValues({}, e2), { tabs: v$1([...e2.tabs, t2.tab], (r2) => r2.current) });
  }, [2](e2, t2) {
    return __spreadProps(__spreadValues({}, e2), { tabs: v$1(e2.tabs.filter((r2) => r2 !== t2.tab), (r2) => r2.current) });
  }, [3](e2, t2) {
    return e2.panels.includes(t2.panel) ? e2 : __spreadProps(__spreadValues({}, e2), { panels: [...e2.panels, t2.panel] });
  }, [4](e2, t2) {
    return __spreadProps(__spreadValues({}, e2), { panels: e2.panels.filter((r2) => r2 !== t2.panel) });
  }, [5](e2) {
    return __spreadValues({}, e2);
  } }, N$1 = React2.createContext(null);
  N$1.displayName = "TabsSSRContext";
  function B(e2) {
    let t2 = React2.useContext(N$1);
    if (t2 === null) {
      let r2 = new Error(`<${e2} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, B), r2;
    }
    return t2;
  }
  let K = React2.createContext(null);
  K.displayName = "TabsDataContext";
  function C$1(e2) {
    let t2 = React2.useContext(K);
    if (t2 === null) {
      let r2 = new Error(`<${e2} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, C$1), r2;
    }
    return t2;
  }
  let $$1 = React2.createContext(null);
  $$1.displayName = "TabsActionsContext";
  function z(e2) {
    let t2 = React2.useContext($$1);
    if (t2 === null) {
      let r2 = new Error(`<${e2} /> is missing a parent <Tab.Group /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(r2, z), r2;
    }
    return t2;
  }
  function ae(e2, t2) {
    return u$2(t2.type, ne, e2, t2);
  }
  let le = React2.Fragment, oe = H$4(function(t2, r2) {
    let _a2 = t2, { defaultIndex: s2 = 0, vertical: b2 = false, manual: d2 = false, onChange: n2, selectedIndex: l2 = null } = _a2, P = __objRest(_a2, ["defaultIndex", "vertical", "manual", "onChange", "selectedIndex"]);
    const u2 = b2 ? "vertical" : "horizontal", y2 = d2 ? "manual" : "auto";
    let c2 = y$1(r2), [p2, o2] = React2.useReducer(ae, { selectedIndex: l2 != null ? l2 : s2, tabs: [], panels: [] }), T2 = React2.useMemo(() => ({ selectedIndex: p2.selectedIndex }), [p2.selectedIndex]), g2 = s$5(n2 || (() => {
    })), L2 = s$5(p2.tabs), x2 = React2.useMemo(() => __spreadValues({ orientation: u2, activation: y2 }, p2), [u2, y2, p2]), R2 = s$5(p2.selectedIndex), h2 = React2.useMemo(() => ({ registerTab(i2) {
      return o2({ type: 1, tab: i2 }), () => o2({ type: 2, tab: i2 });
    }, registerPanel(i2) {
      return o2({ type: 3, panel: i2 }), () => o2({ type: 4, panel: i2 });
    }, forceRerender() {
      o2({ type: 5 });
    }, change(i2) {
      R2.current !== i2 && g2.current(i2), R2.current = i2, o2({ type: 0, index: i2 });
    } }), [o2]);
    t$2(() => {
      o2({ type: 0, index: l2 != null ? l2 : s2 });
    }, [l2]);
    let H2 = React2.useRef({ tabs: [], panels: [] }), w2 = { ref: c2 };
    return React__default["default"].createElement(N$1.Provider, { value: H2 }, React__default["default"].createElement($$1.Provider, { value: h2 }, React__default["default"].createElement(K.Provider, { value: x2 }, x2.tabs.length <= 0 && React__default["default"].createElement(p$2, { onFocus: () => {
      var i2, I2;
      for (let M2 of L2.current)
        if (((i2 = M2.current) == null ? void 0 : i2.tabIndex) === 0)
          return (I2 = M2.current) == null || I2.focus(), true;
      return false;
    } }), _({ ourProps: w2, theirProps: P, slot: T2, defaultTag: le, name: "Tabs" }))));
  }), se = "div", ie = H$4(function(t2, r2) {
    let { orientation: s2, selectedIndex: b2 } = C$1("Tab.List"), d2 = y$1(r2);
    return _({ ourProps: { ref: d2, role: "tablist", "aria-orientation": s2 }, theirProps: t2, slot: { selectedIndex: b2 }, defaultTag: se, name: "Tabs.List" });
  }), ue = "button", ce = H$4(function(t2, r2) {
    var I$1, M2;
    let s2 = `headlessui-tabs-tab-${I()}`, { orientation: b2, activation: d2, selectedIndex: n2, tabs: l2, panels: P } = C$1("Tab"), u2 = z("Tab"), y2 = B("Tab"), c2 = React2.useRef(null), p2 = y$1(c2, r2, (a2) => {
      !a2 || u2.forceRerender();
    });
    t$2(() => u2.registerTab(c2), [u2, c2]);
    let o$12 = y2.current.tabs.indexOf(s2);
    o$12 === -1 && (o$12 = y2.current.tabs.push(s2) - 1);
    let T2 = l2.indexOf(c2);
    T2 === -1 && (T2 = o$12);
    let g2 = T2 === n2, L2 = o$2((a2) => {
      let A = l2.map((X2) => X2.current).filter(Boolean);
      if (a2.key === o.Space || a2.key === o.Enter) {
        a2.preventDefault(), a2.stopPropagation(), u2.change(T2);
        return;
      }
      switch (a2.key) {
        case o.Home:
        case o.PageUp:
          return a2.preventDefault(), a2.stopPropagation(), H$3(A, p$5.First);
        case o.End:
        case o.PageDown:
          return a2.preventDefault(), a2.stopPropagation(), H$3(A, p$5.Last);
      }
      return u$2(b2, { vertical() {
        if (a2.key === o.ArrowUp)
          return H$3(A, p$5.Previous | p$5.WrapAround);
        if (a2.key === o.ArrowDown)
          return H$3(A, p$5.Next | p$5.WrapAround);
      }, horizontal() {
        if (a2.key === o.ArrowLeft)
          return H$3(A, p$5.Previous | p$5.WrapAround);
        if (a2.key === o.ArrowRight)
          return H$3(A, p$5.Next | p$5.WrapAround);
      } });
    }), x2 = o$2(() => {
      var a2;
      (a2 = c2.current) == null || a2.focus();
    }), R2 = o$2(() => {
      var a2;
      (a2 = c2.current) == null || a2.focus(), u2.change(T2);
    }), h2 = o$2((a2) => {
      a2.preventDefault();
    }), H2 = React2.useMemo(() => ({ selected: g2 }), [g2]), w2 = t2, i2 = { ref: p2, onKeyDown: L2, onFocus: d2 === "manual" ? x2 : R2, onMouseDown: h2, onClick: R2, id: s2, role: "tab", type: s$3(t2, c2), "aria-controls": (M2 = (I$1 = P[T2]) == null ? void 0 : I$1.current) == null ? void 0 : M2.id, "aria-selected": g2, tabIndex: g2 ? 0 : -1 };
    return _({ ourProps: i2, theirProps: w2, slot: H2, defaultTag: ue, name: "Tabs.Tab" });
  }), pe = "div", de = H$4(function(t2, r2) {
    let { selectedIndex: s2 } = C$1("Tab.Panels"), b2 = y$1(r2), d2 = React2.useMemo(() => ({ selectedIndex: s2 }), [s2]);
    return _({ ourProps: { ref: b2 }, theirProps: t2, slot: d2, defaultTag: pe, name: "Tabs.Panels" });
  }), be$1 = "div", Te = x.RenderStrategy | x.Static, fe = H$4(function(t2, r2) {
    var x2, R2;
    let { selectedIndex: s2, tabs: b2, panels: d2 } = C$1("Tab.Panel"), n2 = z("Tab.Panel"), l2 = B("Tab.Panel"), P = `headlessui-tabs-panel-${I()}`, u2 = React2.useRef(null), y2 = y$1(u2, r2, (h2) => {
      !h2 || n2.forceRerender();
    });
    t$2(() => n2.registerPanel(u2), [n2, u2]);
    let c2 = l2.current.panels.indexOf(P);
    c2 === -1 && (c2 = l2.current.panels.push(P) - 1);
    let p2 = d2.indexOf(u2);
    p2 === -1 && (p2 = c2);
    let o2 = p2 === s2, T2 = React2.useMemo(() => ({ selected: o2 }), [o2]), g2 = t2, L2 = { ref: y2, id: P, role: "tabpanel", "aria-labelledby": (R2 = (x2 = b2[p2]) == null ? void 0 : x2.current) == null ? void 0 : R2.id, tabIndex: o2 ? 0 : -1 };
    return _({ ourProps: L2, theirProps: g2, slot: T2, defaultTag: be$1, features: Te, visible: o2, name: "Tabs.Panel" });
  }), we = Object.assign(ce, { Group: oe, List: ie, Panels: de, Panel: fe });
  function l(r2) {
    let e2 = { called: false };
    return (...t2) => {
      if (!e2.called)
        return e2.called = true, r2(...t2);
    };
  }
  function p$1(t2, ...e2) {
    t2 && e2.length > 0 && t2.classList.add(...e2);
  }
  function v(t2, ...e2) {
    t2 && e2.length > 0 && t2.classList.remove(...e2);
  }
  var g$1 = ((n2) => (n2.Ended = "ended", n2.Cancelled = "cancelled", n2))(g$1 || {});
  function T(t2, e2) {
    let n2 = o$3();
    if (!t2)
      return n2.dispose;
    let { transitionDuration: l2, transitionDelay: a2 } = getComputedStyle(t2), [d2, s2] = [l2, a2].map((i2) => {
      let [r2 = 0] = i2.split(",").filter(Boolean).map((o2) => o2.includes("ms") ? parseFloat(o2) : parseFloat(o2) * 1e3).sort((o2, E) => E - o2);
      return r2;
    });
    if (d2 + s2 !== 0) {
      let i2 = [];
      i2.push(n2.addEventListener(t2, "transitionrun", () => {
        i2.splice(0).forEach((r2) => r2()), i2.push(n2.addEventListener(t2, "transitionend", () => {
          e2("ended"), i2.splice(0).forEach((r2) => r2());
        }, { once: true }), n2.addEventListener(t2, "transitioncancel", () => {
          e2("cancelled"), i2.splice(0).forEach((r2) => r2());
        }, { once: true }));
      }, { once: true }));
    } else
      e2("ended");
    return n2.add(() => e2("cancelled")), n2.dispose;
  }
  function C(t2, e2, n2, l$12) {
    let a2 = n2 ? "enter" : "leave", d2 = o$3(), s2 = l$12 !== void 0 ? l(l$12) : () => {
    }, m2 = u$2(a2, { enter: () => e2.enter, leave: () => e2.leave }), i2 = u$2(a2, { enter: () => e2.enterTo, leave: () => e2.leaveTo }), r2 = u$2(a2, { enter: () => e2.enterFrom, leave: () => e2.leaveFrom });
    return v(t2, ...e2.enter, ...e2.enterTo, ...e2.enterFrom, ...e2.leave, ...e2.leaveFrom, ...e2.leaveTo, ...e2.entered), p$1(t2, ...m2, ...r2), d2.nextFrame(() => {
      v(t2, ...r2), p$1(t2, ...i2), T(t2, (o2) => (o2 === "ended" && (v(t2, ...m2), p$1(t2, ...e2.entered)), s2(o2)));
    }), d2.dispose;
  }
  function H({ container: u2, direction: o2, classes: c2, events: t2, onStart: d2, onStop: l2 }) {
    let f2 = f$1(), m2 = p$7(), e2 = s$5(o2), b2 = o$2(() => u$2(e2.current, { enter: () => t2.current.beforeEnter(), leave: () => t2.current.beforeLeave(), idle: () => {
    } })), p2 = o$2(() => u$2(e2.current, { enter: () => t2.current.afterEnter(), leave: () => t2.current.afterLeave(), idle: () => {
    } }));
    t$2(() => {
      let r2 = o$3();
      m2.add(r2.dispose);
      let i2 = u2.current;
      if (!!i2 && e2.current !== "idle" && !!f2.current)
        return r2.dispose(), b2(), d2.current(e2.current), r2.add(C(i2, c2.current, e2.current === "enter", (v2) => {
          r2.dispose(), u$2(v2, { [g$1.Ended]() {
            p2(), l2.current(e2.current);
          }, [g$1.Cancelled]: () => {
          } });
        })), r2.dispose;
    }, [o2]);
  }
  function h$1(e2 = "") {
    return e2.split(" ").filter((n2) => n2.trim().length > 1);
  }
  let N = React2.createContext(null);
  N.displayName = "TransitionContext";
  var ge = ((t2) => (t2.Visible = "visible", t2.Hidden = "hidden", t2))(ge || {});
  function ve() {
    let e2 = React2.useContext(N);
    if (e2 === null)
      throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
    return e2;
  }
  function Ce() {
    let e2 = React2.useContext(L);
    if (e2 === null)
      throw new Error("A <Transition.Child /> is used but it is missing a parent <Transition /> or <Transition.Root />.");
    return e2;
  }
  let L = React2.createContext(null);
  L.displayName = "NestingContext";
  function w(e2) {
    return "children" in e2 ? w(e2.children) : e2.current.filter(({ state: n2 }) => n2 === "visible").length > 0;
  }
  function Z(e2) {
    let n2 = s$5(e2), t2 = React2.useRef([]), r2 = f$1(), s2 = o$2((l2, o2 = R.Hidden) => {
      let a2 = t2.current.findIndex(({ id: u2 }) => u2 === l2);
      a2 !== -1 && (u$2(o2, { [R.Unmount]() {
        t2.current.splice(a2, 1);
      }, [R.Hidden]() {
        t2.current[a2].state = "hidden";
      } }), t$1(() => {
        var u2;
        !w(t2) && r2.current && ((u2 = n2.current) == null || u2.call(n2));
      }));
    }), g2 = o$2((l2) => {
      let o2 = t2.current.find(({ id: a2 }) => a2 === l2);
      return o2 ? o2.state !== "visible" && (o2.state = "visible") : t2.current.push({ id: l2, state: "visible" }), () => s2(l2, R.Unmount);
    });
    return React2.useMemo(() => ({ children: t2, register: g2, unregister: s2 }), [g2, s2, t2]);
  }
  function be() {
  }
  let Se = ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave"];
  function $(e2) {
    var t2;
    let n2 = {};
    for (let r2 of Se)
      n2[r2] = (t2 = e2[r2]) != null ? t2 : be;
    return n2;
  }
  function Ee(e2) {
    let n2 = React2.useRef($(e2));
    return React2.useEffect(() => {
      n2.current = $(e2);
    }, [e2]), n2;
  }
  let xe = "div", ee = x.RenderStrategy, te = H$4(function(n2, t2) {
    let _a2 = n2, { beforeEnter: r2, afterEnter: s2, beforeLeave: g2, afterLeave: l2, enter: o2, enterFrom: a2, enterTo: u2, entered: A, leave: v2, leaveFrom: E, leaveTo: x2 } = _a2, y2 = __objRest(_a2, ["beforeEnter", "afterEnter", "beforeLeave", "afterLeave", "enter", "enterFrom", "enterTo", "entered", "leave", "leaveFrom", "leaveTo"]), d2 = React2.useRef(null), D = y$1(d2, t2), [i2, C2] = React2.useState("visible"), p2 = y2.unmount ? R.Unmount : R.Hidden, { show: b2, appear: re2, initial: ne2 } = ve(), { register: H$12, unregister: P } = Ce(), F2 = React2.useRef(null), f2 = I();
    React2.useEffect(() => {
      if (!!f2)
        return H$12(f2);
    }, [H$12, f2]), React2.useEffect(() => {
      if (p2 === R.Hidden && !!f2) {
        if (b2 && i2 !== "visible") {
          C2("visible");
          return;
        }
        u$2(i2, { ["hidden"]: () => P(f2), ["visible"]: () => H$12(f2) });
      }
    }, [i2, f2, H$12, P, b2, p2]);
    let ie2 = s$5({ enter: h$1(o2), enterFrom: h$1(a2), enterTo: h$1(u2), entered: h$1(A), leave: h$1(v2), leaveFrom: h$1(E), leaveTo: h$1(x2) }), se2 = Ee({ beforeEnter: r2, afterEnter: s2, beforeLeave: g2, afterLeave: l2 }), O = a$2();
    React2.useEffect(() => {
      if (O && i2 === "visible" && d2.current === null)
        throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
    }, [d2, i2, O]);
    let M2 = ne2 && !re2, oe2 = (() => !O || M2 || F2.current === b2 ? "idle" : b2 ? "enter" : "leave")(), _$1 = React2.useRef(false), B2 = Z(() => {
      _$1.current || (C2("hidden"), P(f2));
    });
    H({ container: d2, classes: ie2, events: se2, direction: oe2, onStart: s$5(() => {
      _$1.current = true;
    }), onStop: s$5((ue2) => {
      _$1.current = false, ue2 === "leave" && !w(B2) && (C2("hidden"), P(f2));
    }) }), React2.useEffect(() => {
      !M2 || (p2 === R.Hidden ? F2.current = null : F2.current = b2);
    }, [b2, M2, i2]);
    let le2 = y2, ae2 = { ref: D };
    return React__default["default"].createElement(L.Provider, { value: B2 }, React__default["default"].createElement(C$2, { value: u$2(i2, { ["visible"]: p$4.Open, ["hidden"]: p$4.Closed }) }, _({ ourProps: ae2, theirProps: le2, defaultTag: xe, features: ee, visible: i2 === "visible", name: "Transition.Child" })));
  }), G = H$4(function(n2, t2) {
    let _a2 = n2, { show: r2, appear: s$12 = false, unmount: g2 } = _a2, l2 = __objRest(_a2, ["show", "appear", "unmount"]), o2 = React2.useRef(null), a2 = y$1(o2, t2);
    a$2();
    let u2 = s();
    if (r2 === void 0 && u2 !== null && (r2 = u$2(u2, { [p$4.Open]: true, [p$4.Closed]: false })), ![true, false].includes(r2))
      throw new Error("A <Transition /> is used but it is missing a `show={true | false}` prop.");
    let [A, v2] = React2.useState(r2 ? "visible" : "hidden"), E = Z(() => {
      v2("hidden");
    }), [x2, y2] = React2.useState(true), d2 = React2.useRef([r2]);
    t$2(() => {
      x2 !== false && d2.current[d2.current.length - 1] !== r2 && (d2.current.push(r2), y2(false));
    }, [d2, r2]);
    let D = React2.useMemo(() => ({ show: r2, appear: s$12, initial: x2 }), [r2, s$12, x2]);
    React2.useEffect(() => {
      if (r2)
        v2("visible");
      else if (!w(E))
        v2("hidden");
      else {
        let C2 = o2.current;
        if (!C2)
          return;
        let p2 = C2.getBoundingClientRect();
        p2.x === 0 && p2.y === 0 && p2.width === 0 && p2.height === 0 && v2("hidden");
      }
    }, [r2, E]);
    let i2 = { unmount: g2 };
    return React__default["default"].createElement(L.Provider, { value: E }, React__default["default"].createElement(N.Provider, { value: D }, _({ ourProps: __spreadProps(__spreadValues({}, i2), { as: React2.Fragment, children: React__default["default"].createElement(te, __spreadValues(__spreadValues({ ref: a2 }, i2), l2)) }), theirProps: {}, defaultTag: React2.Fragment, features: ee, visible: A === "visible", name: "Transition" })));
  }), ye = H$4(function(n2, t2) {
    let r2 = React2.useContext(N) !== null, s$12 = s() !== null;
    return React__default["default"].createElement(React__default["default"].Fragment, null, !r2 && s$12 ? React__default["default"].createElement(G, __spreadValues({ ref: t2 }, n2)) : React__default["default"].createElement(te, __spreadValues({ ref: t2 }, n2)));
  }), We = Object.assign(G, { Child: ye, Root: G });
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
  if (typeof Symbol === "function" && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    reactJsxRuntime_production_min.Fragment = h("react.fragment");
  }
  var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
  function q(c2, a2, k2) {
    var b2, d2 = {}, e2 = null, l2 = null;
    k2 !== void 0 && (e2 = "" + k2);
    a2.key !== void 0 && (e2 = "" + a2.key);
    a2.ref !== void 0 && (l2 = a2.ref);
    for (b2 in a2)
      n.call(a2, b2) && !p.hasOwnProperty(b2) && (d2[b2] = a2[b2]);
    if (c2 && c2.defaultProps)
      for (b2 in a2 = c2.defaultProps, a2)
        d2[b2] === void 0 && (d2[b2] = a2[b2]);
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
        children: /* @__PURE__ */ jsx(ue$1, {
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
    return /* @__PURE__ */ jsx(rt, {
      value: selected,
      onChange: setSelected,
      children: /* @__PURE__ */ jsxs("div", {
        className: "relative mt-1",
        children: [/* @__PURE__ */ jsxs(rt.Button, {
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
          children: /* @__PURE__ */ jsx(rt.Options, {
            className: "absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
            children: optionList.map((person, personIdx) => /* @__PURE__ */ jsx(rt.Option, {
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
      reject(new AxiosError$4("Request failed with status code " + response.status, [AxiosError$4.ERR_BAD_REQUEST, AxiosError$4.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4], response.config, response.request, response));
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
        reject(new AxiosError$2(timeoutErrorMessage, transitional2.clarifyTimeoutError ? AxiosError$2.ETIMEDOUT : AxiosError$2.ECONNABORTED, config, request));
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
        throw new AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), AxiosError.ERR_DEPRECATED);
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
          children: [/* @__PURE__ */ jsx(ke, {
            children: ({
              open
            }) => /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(ke.Button, {
                className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "\u89D2\u8272\u4FE1\u606F\u540C\u6B65"
                }), /* @__PURE__ */ jsx(ChevronUpIcon$1, {
                  className: `${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`
                })]
              }), /* @__PURE__ */ jsxs(ke.Panel, {
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
          }), /* @__PURE__ */ jsx(ke, {
            as: "div",
            className: "mt-2",
            children: ({
              open
            }) => /* @__PURE__ */ jsxs(Fragment, {
              children: [/* @__PURE__ */ jsxs(ke.Button, {
                className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-slate-900 bg-purple-100 rounded-lg hover:bg-purple-200 focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
                children: [/* @__PURE__ */ jsx("span", {
                  children: "\u89C4\u5212\u6279\u91CF\u64CD\u4F5C"
                }), /* @__PURE__ */ jsx(ChevronUpIcon$1, {
                  className: `${open ? "transform rotate-180" : ""} w-5 h-5 text-purple-500`
                })]
              }), /* @__PURE__ */ jsx(ke.Panel, {
                className: "px-4 pt-4 pb-2 text-sm text-white-500",
                children: /* @__PURE__ */ jsxs(we.Group, {
                  children: [/* @__PURE__ */ jsx(we.List, {
                    className: "flex p-1 space-x-1 bg-blue-900/20 rounded-xl",
                    children: ["\u89D2\u8272\u76EE\u6807\u7B49\u7EA7", "\u5929\u8D4B\u76EE\u6807\u7B49\u7EA7", "\u6B66\u5668\u76EE\u6807\u7B49\u7EA7"].map((category) => /* @__PURE__ */ jsx(we, {
                      className: ({
                        selected
                      }) => classNames("w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg", "focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60", selected ? "bg-white shadow" : "text-blue-100 hover:bg-white/[0.12] hover:text-white"),
                      children: category
                    }, category))
                  }), /* @__PURE__ */ jsxs(we.Panels, {
                    children: [/* @__PURE__ */ jsx(we.Panel, {
                      children: /* @__PURE__ */ jsx(CharacterGoalTab, {
                        showText: "\u89D2\u8272",
                        batchUpdateCharacter
                      })
                    }), /* @__PURE__ */ jsx(we.Panel, {
                      children: /* @__PURE__ */ jsx(TalentGoalTab, {})
                    }), /* @__PURE__ */ jsx(we.Panel, {
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
 
