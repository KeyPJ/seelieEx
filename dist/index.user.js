// ==UserScript==
// @name             genshinSeelieEx
// @name:zh          原神、崩坏：星穹铁道、绝区零规划助手扩展
// @namespace        https://github.com/KeyPJ/seelieEx
// @version          6.7.0.260804
// @author           KeyPJ
// @description:zh   个人想偷懒,不想手动在仙灵 - 规划助手 手动录入角色及其天赋,于是简单整理一个脚本,利用米游社养成计算器api获取角色信息,直接导入至seelie
// @license          MIT
// @homepage         https://github.com/KeyPJ
// @homepageURL      https://github.com/KeyPJ/seelieEx
// @updateURL        https://greasyfork.org/scripts/443664-genshinseelieex/code/genshinSeelieEx.user.js
// @include          https://seelie.me/*
// @include          https://hsr.seelie.me/*
// @include          https://zzz.seelie.me/*
// @require          https://unpkg.com/react@17.0.2/umd/react.production.min.js
// @require          https://unpkg.com/react-dom@17.0.2/umd/react-dom.production.min.js
// @require          https://unpkg.com/localforage@1.10.0/dist/localforage.min.js
// @connect          api-takumi.mihoyo.com
// @connect          act-api-takumi.mihoyo.com
// @connect          public-data-api.mihoyo.com
// @grant            GM.xmlHttpRequest
// @grant            GM_openInTab
// @grant            GM_registerMenuCommand
// @grant            GM_xmlhttpRequest
// @grant            unsafeWindow
// @run-at           document-end
// @contributionURL  https://github.com/KeyPJ/seelieEx
// @copyright        2021, KeyPJ https://github.com/KeyPJ
// ==/UserScript==

(r=>{const t=document.createElement("style");t.dataset.source="vite-plugin-monkey",t.innerText=r,document.head.appendChild(t)})(' *,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.pointer-events-none{pointer-events:none}.static{position:static}.fixed{position:fixed}.absolute{position:absolute}.relative{position:relative}.inset-x-\\[20\\%\\]{left:20%;right:20%}.inset-y-0{top:0;bottom:0}.left-0{left:0}.right-0{right:0}.top-10{top:2.5rem}.z-10{z-index:10}.z-\\[1200\\]{z-index:1200}.mx-auto{margin-left:auto;margin-right:auto}.mt-1{margin-top:.25rem}.mt-10{margin-top:2.5rem}.mt-2{margin-top:.5rem}.mt-3{margin-top:.75rem}.mt-4{margin-top:1rem}.block{display:block}.inline-block{display:inline-block}.flex{display:flex}.inline-flex{display:inline-flex}.table{display:table}.grid{display:grid}.h-2\\.5{height:.625rem}.h-4{height:1rem}.h-5{height:1.25rem}.h-6{height:1.5rem}.max-h-60{max-height:15rem}.min-h-min{min-height:-moz-min-content;min-height:min-content}.w-1\\/2{width:50%}.w-1\\/4{width:25%}.w-11{width:2.75rem}.w-4{width:1rem}.w-5{width:1.25rem}.w-full{width:100%}.min-w-\\[50\\%\\]{min-width:50%}.max-w-md{max-width:28rem}.translate-x-1{--tw-translate-x: .25rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.translate-x-6{--tw-translate-x: 1.5rem;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.rotate-180{--tw-rotate: 180deg;transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{-webkit-user-select:none;-moz-user-select:none;user-select:none}.grid-flow-col{grid-auto-flow:column}.grid-rows-2{grid-template-rows:repeat(2,minmax(0,1fr))}.flex-row{flex-direction:row}.flex-wrap{flex-wrap:wrap}.items-start{align-items:flex-start}.items-center{align-items:center}.justify-between{justify-content:space-between}.gap-1{gap:.25rem}.gap-2{gap:.5rem}.gap-4{gap:1rem}.space-y-6>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(1.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(1.5rem * var(--tw-space-y-reverse))}.overflow-auto{overflow:auto}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:1rem}.rounded-full{border-radius:9999px}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.border{border-width:1px}.border-b{border-bottom-width:1px}.border-b-2{border-bottom-width:2px}.border-blue-400{--tw-border-opacity: 1;border-color:rgb(96 165 250 / var(--tw-border-opacity, 1))}.border-gray-600{--tw-border-opacity: 1;border-color:rgb(75 85 99 / var(--tw-border-opacity, 1))}.border-gray-700{--tw-border-opacity: 1;border-color:rgb(55 65 81 / var(--tw-border-opacity, 1))}.border-purple-700\\/50{border-color:#7e22ce80}.bg-amber-100{--tw-bg-opacity: 1;background-color:rgb(254 243 199 / var(--tw-bg-opacity, 1))}.bg-blue-500{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity, 1))}.bg-blue-600{--tw-bg-opacity: 1;background-color:rgb(37 99 235 / var(--tw-bg-opacity, 1))}.bg-gray-600{--tw-bg-opacity: 1;background-color:rgb(75 85 99 / var(--tw-bg-opacity, 1))}.bg-gray-700{--tw-bg-opacity: 1;background-color:rgb(55 65 81 / var(--tw-bg-opacity, 1))}.bg-purple-800\\/70{background-color:#6b21a8b3}.bg-purple-900\\/30{background-color:#581c874d}.bg-slate-700\\/50{background-color:#33415580}.bg-slate-800\\/90{background-color:#1e293be6}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-2{padding:.5rem}.p-4{padding:1rem}.px-4{padding-left:1rem;padding-right:1rem}.py-1{padding-top:.25rem;padding-bottom:.25rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.pb-2{padding-bottom:.5rem}.pl-10{padding-left:2.5rem}.pl-3{padding-left:.75rem}.pr-10{padding-right:2.5rem}.pr-2{padding-right:.5rem}.pr-4{padding-right:1rem}.pt-2{padding-top:.5rem}.pt-4{padding-top:1rem}.text-left{text-align:left}.text-center{text-align:center}.text-2xl{font-size:1.5rem;line-height:2rem}.text-3xl{font-size:1.875rem;line-height:2.25rem}.text-base{font-size:1rem;line-height:1.5rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.font-bold{font-weight:700}.font-medium{font-weight:500}.font-normal{font-weight:400}.leading-none{line-height:1}.text-amber-600{--tw-text-opacity: 1;color:rgb(217 119 6 / var(--tw-text-opacity, 1))}.text-amber-900{--tw-text-opacity: 1;color:rgb(120 53 15 / var(--tw-text-opacity, 1))}.text-blue-300{--tw-text-opacity: 1;color:rgb(147 197 253 / var(--tw-text-opacity, 1))}.text-gray-100{--tw-text-opacity: 1;color:rgb(243 244 246 / var(--tw-text-opacity, 1))}.text-gray-200{--tw-text-opacity: 1;color:rgb(229 231 235 / var(--tw-text-opacity, 1))}.text-gray-300{--tw-text-opacity: 1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-900{--tw-text-opacity: 1;color:rgb(17 24 39 / var(--tw-text-opacity, 1))}.text-purple-300{--tw-text-opacity: 1;color:rgb(216 180 254 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.underline{-webkit-text-decoration-line:underline;text-decoration-line:underline}.shadow-2xl{--tw-shadow: 0 25px 50px -12px rgb(0 0 0 / .25);--tw-shadow-colored: 0 25px 50px -12px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-md{--tw-shadow: 0 4px 6px -1px rgb(0 0 0 / .1), 0 2px 4px -2px rgb(0 0 0 / .1);--tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.ring-1{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.ring-black{--tw-ring-opacity: 1;--tw-ring-color: rgb(0 0 0 / var(--tw-ring-opacity, 1))}.ring-opacity-5{--tw-ring-opacity: .05}.filter{filter:var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow)}.transition-all{transition-property:all;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-colors{transition-property:color,background-color,border-color,fill,stroke,-webkit-text-decoration-color;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-property:color,background-color,border-color,text-decoration-color,fill,stroke,-webkit-text-decoration-color;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-transform{transition-property:transform;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.duration-500{transition-duration:.5s}.ease-out{transition-timing-function:cubic-bezier(0,0,.2,1)}.ex-flex-col{flex-direction:column}.ex-mx-auto{margin-left:auto;margin-right:auto}.hover\\:bg-amber-100:hover{--tw-bg-opacity: 1;background-color:rgb(254 243 199 / var(--tw-bg-opacity, 1))}.hover\\:bg-blue-500:hover{--tw-bg-opacity: 1;background-color:rgb(59 130 246 / var(--tw-bg-opacity, 1))}.hover\\:bg-purple-700:hover{--tw-bg-opacity: 1;background-color:rgb(126 34 206 / var(--tw-bg-opacity, 1))}.hover\\:text-gray-300:hover{--tw-text-opacity: 1;color:rgb(209 213 219 / var(--tw-text-opacity, 1))}.hover\\:text-white:hover{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.focus\\:outline-none:focus{outline:2px solid transparent;outline-offset:2px}.focus-visible\\:border-indigo-500:focus-visible{--tw-border-opacity: 1;border-color:rgb(99 102 241 / var(--tw-border-opacity, 1))}.focus-visible\\:ring-2:focus-visible{--tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);--tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);box-shadow:var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow, 0 0 #0000)}.focus-visible\\:ring-white:focus-visible{--tw-ring-opacity: 1;--tw-ring-color: rgb(255 255 255 / var(--tw-ring-opacity, 1))}.focus-visible\\:ring-opacity-75:focus-visible{--tw-ring-opacity: .75}.focus-visible\\:ring-offset-2:focus-visible{--tw-ring-offset-width: 2px}.focus-visible\\:ring-offset-orange-300:focus-visible{--tw-ring-offset-color: #fdba74}@media (min-width: 640px){.sm\\:text-sm{font-size:.875rem;line-height:1.25rem}} ');

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function(require$$1, ReactDOM2, localforage2) {
  "use strict";
  const App$1 = "";
  function getDefaultExportFromCjs(x) {
    return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
  }
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
  var f = require$$1, g = 60103;
  reactJsxRuntime_production_min.Fragment = 60107;
  if ("function" === typeof Symbol && Symbol.for) {
    var h = Symbol.for;
    g = h("react.element");
    reactJsxRuntime_production_min.Fragment = h("react.fragment");
  }
  var m = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, n = Object.prototype.hasOwnProperty, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, k) {
    var b, d = {}, e = null, l = null;
    void 0 !== k && (e = "" + k);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (l = a.ref);
    for (b in a)
      n.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps)
      for (b in a = c.defaultProps, a)
        void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: g, type: c, key: e, ref: l, props: d, _owner: m.current };
  }
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const jsx = jsxRuntimeExports.jsx;
  const jsxs = jsxRuntimeExports.jsxs;
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  function ListboxSelect(props) {
    const {
      selected,
      setSelected,
      optionList,
      show,
      className = ""
    } = props;
    const [isOpen, setIsOpen] = require$$1.useState(false);
    const containerRef = require$$1.useRef(null);
    require$$1.useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);
    const toggleDropdown = (e) => {
      e.stopPropagation();
      setIsOpen(!isOpen);
    };
    const handleSelect = (item, e) => {
      e.stopPropagation();
      setSelected(item);
      setIsOpen(false);
    };
    return /* @__PURE__ */ jsxs("div", {
      ref: containerRef,
      className: classNames("relative mt-1 w-full", className),
      children: [/* @__PURE__ */ jsxs("button", {
        type: "button",
        className: "relative w-full py-2 pl-3 pr-10 text-left bg-white rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500 sm:text-sm",
        onClick: toggleDropdown,
        children: [/* @__PURE__ */ jsx("span", {
          className: "block truncate text-gray-900",
          children: show(selected)
        }), /* @__PURE__ */ jsx("span", {
          className: "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",
          children: /* @__PURE__ */ jsx("svg", {
            className: `w-5 h-5 text-gray-400 transition-transform ${isOpen ? "transform rotate-180" : ""}`,
            fill: "none",
            stroke: "currentColor",
            viewBox: "0 0 24 24",
            xmlns: "http://www.w3.org/2000/svg",
            children: /* @__PURE__ */ jsx("path", {
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeWidth: 2,
              d: "M19 9l-7 7-7-7"
            })
          })
        })]
      }), isOpen && /* @__PURE__ */ jsx("div", {
        className: "absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
        onClick: (e) => e.stopPropagation(),
        children: optionList.map((item, index) => /* @__PURE__ */ jsxs("div", {
          className: `cursor-default select-none relative py-2 pl-10 pr-4 ${selected === item ? "text-amber-900 bg-amber-100" : "text-gray-900 hover:bg-amber-100"}`,
          onClick: (e) => handleSelect(item, e),
          children: [/* @__PURE__ */ jsx("span", {
            className: `block truncate ${selected === item ? "font-medium" : "font-normal"}`,
            children: show(item)
          }), selected === item && /* @__PURE__ */ jsx("span", {
            className: "absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600",
            children: /* @__PURE__ */ jsx("svg", {
              className: "w-5 h-5",
              fill: "none",
              stroke: "currentColor",
              viewBox: "0 0 24 24",
              xmlns: "http://www.w3.org/2000/svg",
              children: /* @__PURE__ */ jsx("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                strokeWidth: 2,
                d: "M5 13l4 4L19 7"
              })
            })
          })]
        }, index))
      })]
    });
  }
  function ToggleSwitch(props) {
    const {
      className,
      checked,
      onChange,
      labelLeft,
      labelRight
    } = props;
    return /* @__PURE__ */ jsxs("div", {
      className: `${className} flex flex-row items-center`,
      children: [/* @__PURE__ */ jsx("div", {
        className: "w-1/4 text-gray-200",
        children: labelLeft
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/2",
        children: /* @__PURE__ */ jsx("button", {
          type: "button",
          className: `relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${checked ? "bg-blue-600" : "bg-gray-600"}`,
          onClick: () => onChange(!checked),
          "aria-pressed": checked,
          children: /* @__PURE__ */ jsx("span", {
            className: `inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`
          })
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "w-1/4 text-gray-200",
        children: labelRight
      })]
    });
  }
  var GameType = /* @__PURE__ */ ((GameType2) => {
    GameType2["GENSHIN"] = "genshin";
    GameType2["HSR"] = "hsr";
    GameType2["ZZZ"] = "zzz";
    return GameType2;
  })(GameType || {});
  const GameDomainMap = {
    "hsr.seelie.me": "hsr",
    "zzz.seelie.me": "zzz"
    /* ZZZ */
  };
  const getRuntimeCatalog$2 = (which) => {
    try {
      const app = document.querySelector("#app");
      const data2 = app?._vnode?.component?.data;
      const cat = data2?.[which];
      if (cat && typeof cat === "object" && !Array.isArray(cat)) {
        return cat;
      }
      return null;
    } catch {
      return null;
    }
  };
  let _characterIdMap$2 = null;
  let _weaponIdMap$1 = null;
  const getIdMap$2 = (which) => {
    const cached = which === "characters" ? _characterIdMap$2 : _weaponIdMap$1;
    if (cached)
      return cached;
    const map = /* @__PURE__ */ new Map();
    const cat = getRuntimeCatalog$2(which);
    if (cat) {
      for (const [key, entry] of Object.entries(cat)) {
        if (entry && typeof entry.id === "number" && entry.id > 0) {
          map.set(entry.id, key);
        }
      }
    }
    if (which === "characters")
      _characterIdMap$2 = map;
    else
      _weaponIdMap$1 = map;
    return map;
  };
  const getCharactersNum = () => {
    const cat = getRuntimeCatalog$2("characters");
    return cat ? Object.keys(cat).length : 0;
  };
  const getCharacterId$2 = (input) => {
    const id = typeof input === "string" ? void 0 : input.id;
    if (typeof id === "number" && id > 0) {
      const key = getIdMap$2("characters").get(id);
      if (key)
        return key;
    }
    console.error(`getCharacterId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
  };
  const getWeaponId$2 = (input) => {
    const id = typeof input === "string" ? void 0 : input.id;
    const name = typeof input === "string" ? input : input.name;
    if (typeof id === "number" && id > 0) {
      const key = getIdMap$2("weapons").get(id);
      if (key)
        return key;
    }
    console.error(`getWeaponId ${name}(id=${id}) 查询失败`);
    return "";
  };
  var axios$3 = { exports: {} };
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
  function inherits(constructor, superConstructor, props, descriptors2) {
    constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
    constructor.prototype.constructor = constructor;
    props && Object.assign(constructor.prototype, props);
  }
  function toFlatObject(sourceObj, destObj, filter) {
    var props;
    var i;
    var prop;
    var merged = {};
    destObj = destObj || {};
    do {
      props = Object.getOwnPropertyNames(sourceObj);
      i = props.length;
      while (i-- > 0) {
        prop = props[i];
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
    var i = thing.length;
    if (isUndefined(i))
      return null;
    var arr = new Array(i);
    while (i-- > 0) {
      arr[i] = thing[i];
    }
    return arr;
  }
  var isTypedArray = function(TypedArray) {
    return function(thing) {
      return TypedArray && thing instanceof TypedArray;
    };
  }(typeof Uint8Array !== "undefined" && Object.getPrototypeOf(Uint8Array));
  var utils$c = {
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
  const utils$d = /* @__PURE__ */ getDefaultExportFromCjs(utils$c);
  var utils$b = utils$c;
  function encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
  }
  var buildURL$1 = function buildURL2(url, params, paramsSerializer) {
    if (!params) {
      return url;
    }
    var serializedParams;
    if (paramsSerializer) {
      serializedParams = paramsSerializer(params);
    } else if (utils$b.isURLSearchParams(params)) {
      serializedParams = params.toString();
    } else {
      var parts = [];
      utils$b.forEach(params, function serialize(val, key) {
        if (val === null || typeof val === "undefined") {
          return;
        }
        if (utils$b.isArray(val)) {
          key = key + "[]";
        } else {
          val = [val];
        }
        utils$b.forEach(val, function parseValue(v) {
          if (utils$b.isDate(v)) {
            v = v.toISOString();
          } else if (utils$b.isObject(v)) {
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
  const buildURL$2 = /* @__PURE__ */ getDefaultExportFromCjs(buildURL$1);
  var utils$a = utils$c;
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
    utils$a.forEach(this.handlers, function forEachHandler(h2) {
      if (h2 !== null) {
        fn(h2);
      }
    });
  };
  var InterceptorManager_1 = InterceptorManager$1;
  var utils$9 = utils$c;
  var normalizeHeaderName$1 = function normalizeHeaderName2(headers2, normalizedName) {
    utils$9.forEach(headers2, function processHeader(value, name) {
      if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
        headers2[normalizedName] = value;
        delete headers2[name];
      }
    });
  };
  var utils$8 = utils$c;
  function AxiosError$3(message, code, config, request, response) {
    Error.call(this);
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
  }
  utils$8.inherits(AxiosError$3, Error, {
    toJSON: function toJSON() {
      return {
        // Standard
        message: this.message,
        name: this.name,
        // Microsoft
        description: this.description,
        number: this.number,
        // Mozilla
        fileName: this.fileName,
        lineNumber: this.lineNumber,
        columnNumber: this.columnNumber,
        stack: this.stack,
        // Axios
        config: this.config,
        code: this.code,
        status: this.response && this.response.status ? this.response.status : null
      };
    }
  });
  var prototype = AxiosError$3.prototype;
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
    // eslint-disable-next-line func-names
  ].forEach(function(code) {
    descriptors[code] = { value: code };
  });
  Object.defineProperties(AxiosError$3, descriptors);
  Object.defineProperty(prototype, "isAxiosError", { value: true });
  AxiosError$3.from = function(error, code, config, request, response, customProps) {
    var axiosError = Object.create(prototype);
    utils$8.toFlatObject(error, axiosError, function filter(obj) {
      return obj !== Error.prototype;
    });
    AxiosError$3.call(axiosError, error.message, code, config, request, response);
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
  };
  var AxiosError_1 = AxiosError$3;
  var transitional = {
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
  };
  var utils$7 = utils$c;
  function toFormData$1(obj, formData) {
    formData = formData || new FormData();
    var stack = [];
    function convertValue(value) {
      if (value === null)
        return "";
      if (utils$7.isDate(value)) {
        return value.toISOString();
      }
      if (utils$7.isArrayBuffer(value) || utils$7.isTypedArray(value)) {
        return typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
      }
      return value;
    }
    function build(data2, parentKey) {
      if (utils$7.isPlainObject(data2) || utils$7.isArray(data2)) {
        if (stack.indexOf(data2) !== -1) {
          throw Error("Circular reference detected in " + parentKey);
        }
        stack.push(data2);
        utils$7.forEach(data2, function each(value, key) {
          if (utils$7.isUndefined(value))
            return;
          var fullKey = parentKey ? parentKey + "." + key : key;
          var arr;
          if (value && !parentKey && typeof value === "object") {
            if (utils$7.endsWith(key, "{}")) {
              value = JSON.stringify(value);
            } else if (utils$7.endsWith(key, "[]") && (arr = utils$7.toArray(value))) {
              arr.forEach(function(el) {
                !utils$7.isUndefined(el) && formData.append(fullKey, convertValue(el));
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
  var AxiosError$2 = AxiosError_1;
  var settle = function settle2(resolve, reject, response) {
    var validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
      resolve(response);
    } else {
      reject(new AxiosError$2(
        "Request failed with status code " + response.status,
        [AxiosError$2.ERR_BAD_REQUEST, AxiosError$2.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
        response.config,
        response.request,
        response
      ));
    }
  };
  const settle$1 = /* @__PURE__ */ getDefaultExportFromCjs(settle);
  var cookies;
  var hasRequiredCookies;
  function requireCookies() {
    if (hasRequiredCookies)
      return cookies;
    hasRequiredCookies = 1;
    var utils2 = utils$c;
    cookies = utils2.isStandardBrowserEnv() ? (
      // Standard browser envs support document.cookie
      function standardBrowserEnv() {
        return {
          write: function write(name, value, expires, path, domain, secure) {
            var cookie = [];
            cookie.push(name + "=" + encodeURIComponent(value));
            if (utils2.isNumber(expires)) {
              cookie.push("expires=" + new Date(expires).toGMTString());
            }
            if (utils2.isString(path)) {
              cookie.push("path=" + path);
            }
            if (utils2.isString(domain)) {
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
      }()
    ) : (
      // Non standard browser env (web workers, react-native) lack needed support.
      function nonStandardBrowserEnv() {
        return {
          write: function write() {
          },
          read: function read() {
            return null;
          },
          remove: function remove() {
          }
        };
      }()
    );
    return cookies;
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
  const buildFullPath$2 = /* @__PURE__ */ getDefaultExportFromCjs(buildFullPath$1);
  var utils$6 = utils$c;
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
  var parseHeaders = function parseHeaders2(headers2) {
    var parsed = {};
    var key;
    var val;
    var i;
    if (!headers2) {
      return parsed;
    }
    utils$6.forEach(headers2.split("\n"), function parser(line) {
      i = line.indexOf(":");
      key = utils$6.trim(line.substr(0, i)).toLowerCase();
      val = utils$6.trim(line.substr(i + 1));
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
  const parseHeaders$1 = /* @__PURE__ */ getDefaultExportFromCjs(parseHeaders);
  var isURLSameOrigin;
  var hasRequiredIsURLSameOrigin;
  function requireIsURLSameOrigin() {
    if (hasRequiredIsURLSameOrigin)
      return isURLSameOrigin;
    hasRequiredIsURLSameOrigin = 1;
    var utils2 = utils$c;
    isURLSameOrigin = utils2.isStandardBrowserEnv() ? (
      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
      function standardBrowserEnv() {
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
          var parsed = utils2.isString(requestURL) ? resolveURL(requestURL) : requestURL;
          return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
        };
      }()
    ) : (
      // Non standard browser envs (web workers, react-native) lack needed support.
      function nonStandardBrowserEnv() {
        return function isURLSameOrigin2() {
          return true;
        };
      }()
    );
    return isURLSameOrigin;
  }
  var CanceledError_1;
  var hasRequiredCanceledError;
  function requireCanceledError() {
    if (hasRequiredCanceledError)
      return CanceledError_1;
    hasRequiredCanceledError = 1;
    var AxiosError2 = AxiosError_1;
    var utils2 = utils$c;
    function CanceledError2(message) {
      AxiosError2.call(this, message == null ? "canceled" : message, AxiosError2.ERR_CANCELED);
      this.name = "CanceledError";
    }
    utils2.inherits(CanceledError2, AxiosError2, {
      __CANCEL__: true
    });
    CanceledError_1 = CanceledError2;
    return CanceledError_1;
  }
  var parseProtocol;
  var hasRequiredParseProtocol;
  function requireParseProtocol() {
    if (hasRequiredParseProtocol)
      return parseProtocol;
    hasRequiredParseProtocol = 1;
    parseProtocol = function parseProtocol2(url) {
      var match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
      return match && match[1] || "";
    };
    return parseProtocol;
  }
  var xhr;
  var hasRequiredXhr;
  function requireXhr() {
    if (hasRequiredXhr)
      return xhr;
    hasRequiredXhr = 1;
    var utils2 = utils$c;
    var settle$12 = settle;
    var cookies2 = requireCookies();
    var buildURL2 = buildURL$1;
    var buildFullPath2 = buildFullPath$1;
    var parseHeaders$12 = parseHeaders;
    var isURLSameOrigin2 = requireIsURLSameOrigin();
    var transitionalDefaults2 = transitional;
    var AxiosError2 = AxiosError_1;
    var CanceledError2 = requireCanceledError();
    var parseProtocol2 = requireParseProtocol();
    xhr = function xhrAdapter2(config) {
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
        if (utils2.isFormData(requestData) && utils2.isStandardBrowserEnv()) {
          delete requestHeaders["Content-Type"];
        }
        var request = new XMLHttpRequest();
        if (config.auth) {
          var username = config.auth.username || "";
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
          requestHeaders.Authorization = "Basic " + btoa(username + ":" + password);
        }
        var fullPath = buildFullPath2(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL2(fullPath, config.params, config.paramsSerializer), true);
        request.timeout = config.timeout;
        function onloadend() {
          if (!request) {
            return;
          }
          var responseHeaders = "getAllResponseHeaders" in request ? parseHeaders$12(request.getAllResponseHeaders()) : null;
          var responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config,
            request
          };
          settle$12(function _resolve(value) {
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
          reject(new AxiosError2("Request aborted", AxiosError2.ECONNABORTED, config, request));
          request = null;
        };
        request.onerror = function handleError() {
          reject(new AxiosError2("Network Error", AxiosError2.ERR_NETWORK, config, request, request));
          request = null;
        };
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
          var transitional2 = config.transitional || transitionalDefaults2;
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(new AxiosError2(
            timeoutErrorMessage,
            transitional2.clarifyTimeoutError ? AxiosError2.ETIMEDOUT : AxiosError2.ECONNABORTED,
            config,
            request
          ));
          request = null;
        };
        if (utils2.isStandardBrowserEnv()) {
          var xsrfValue = (config.withCredentials || isURLSameOrigin2(fullPath)) && config.xsrfCookieName ? cookies2.read(config.xsrfCookieName) : void 0;
          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }
        if ("setRequestHeader" in request) {
          utils2.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === "undefined" && key.toLowerCase() === "content-type") {
              delete requestHeaders[key];
            } else {
              request.setRequestHeader(key, val);
            }
          });
        }
        if (!utils2.isUndefined(config.withCredentials)) {
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
            reject(!cancel || cancel && cancel.type ? new CanceledError2() : cancel);
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
        var protocol = parseProtocol2(fullPath);
        if (protocol && ["http", "https", "file"].indexOf(protocol) === -1) {
          reject(new AxiosError2("Unsupported protocol " + protocol + ":", AxiosError2.ERR_BAD_REQUEST, config));
          return;
        }
        request.send(requestData);
      });
    };
    return xhr;
  }
  var _null;
  var hasRequired_null;
  function require_null() {
    if (hasRequired_null)
      return _null;
    hasRequired_null = 1;
    _null = null;
    return _null;
  }
  var utils$5 = utils$c;
  var normalizeHeaderName = normalizeHeaderName$1;
  var AxiosError$1 = AxiosError_1;
  var transitionalDefaults = transitional;
  var toFormData = toFormData_1;
  var DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  function setContentTypeIfUnset(headers2, value) {
    if (!utils$5.isUndefined(headers2) && utils$5.isUndefined(headers2["Content-Type"])) {
      headers2["Content-Type"] = value;
    }
  }
  function getDefaultAdapter() {
    var adapter;
    if (typeof XMLHttpRequest !== "undefined") {
      adapter = requireXhr();
    } else if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
      adapter = requireXhr();
    }
    return adapter;
  }
  function stringifySafely(rawValue, parser, encoder) {
    if (utils$5.isString(rawValue)) {
      try {
        (parser || JSON.parse)(rawValue);
        return utils$5.trim(rawValue);
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
    transformRequest: [function transformRequest(data2, headers2) {
      normalizeHeaderName(headers2, "Accept");
      normalizeHeaderName(headers2, "Content-Type");
      if (utils$5.isFormData(data2) || utils$5.isArrayBuffer(data2) || utils$5.isBuffer(data2) || utils$5.isStream(data2) || utils$5.isFile(data2) || utils$5.isBlob(data2)) {
        return data2;
      }
      if (utils$5.isArrayBufferView(data2)) {
        return data2.buffer;
      }
      if (utils$5.isURLSearchParams(data2)) {
        setContentTypeIfUnset(headers2, "application/x-www-form-urlencoded;charset=utf-8");
        return data2.toString();
      }
      var isObjectPayload = utils$5.isObject(data2);
      var contentType = headers2 && headers2["Content-Type"];
      var isFileList2;
      if ((isFileList2 = utils$5.isFileList(data2)) || isObjectPayload && contentType === "multipart/form-data") {
        var _FormData = this.env && this.env.FormData;
        return toFormData(isFileList2 ? { "files[]": data2 } : data2, _FormData && new _FormData());
      } else if (isObjectPayload || contentType === "application/json") {
        setContentTypeIfUnset(headers2, "application/json");
        return stringifySafely(data2);
      }
      return data2;
    }],
    transformResponse: [function transformResponse(data2) {
      var transitional2 = this.transitional || defaults$3.transitional;
      var silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      var forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
      var strictJSONParsing = !silentJSONParsing && this.responseType === "json";
      if (strictJSONParsing || forcedJSONParsing && utils$5.isString(data2) && data2.length) {
        try {
          return JSON.parse(data2);
        } catch (e) {
          if (strictJSONParsing) {
            if (e.name === "SyntaxError") {
              throw AxiosError$1.from(e, AxiosError$1.ERR_BAD_RESPONSE, this, null, this.response);
            }
            throw e;
          }
        }
      }
      return data2;
    }],
    /**
     * A timeout in milliseconds to abort a request. If set to 0 (default) a
     * timeout is not created.
     */
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
      FormData: require_null()
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
  utils$5.forEach(["delete", "get", "head"], function forEachMethodNoData(method) {
    defaults$3.headers[method] = {};
  });
  utils$5.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
    defaults$3.headers[method] = utils$5.merge(DEFAULT_CONTENT_TYPE);
  });
  var defaults_1 = defaults$3;
  var utils$4 = utils$c;
  var defaults$2 = defaults_1;
  var transformData$1 = function transformData2(data2, headers2, fns) {
    var context = this || defaults$2;
    utils$4.forEach(fns, function transform(fn) {
      data2 = fn.call(context, data2, headers2);
    });
    return data2;
  };
  var isCancel$1;
  var hasRequiredIsCancel;
  function requireIsCancel() {
    if (hasRequiredIsCancel)
      return isCancel$1;
    hasRequiredIsCancel = 1;
    isCancel$1 = function isCancel2(value) {
      return !!(value && value.__CANCEL__);
    };
    return isCancel$1;
  }
  var utils$3 = utils$c;
  var transformData = transformData$1;
  var isCancel = requireIsCancel();
  var defaults$1 = defaults_1;
  var CanceledError = requireCanceledError();
  function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
      throw new CanceledError();
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
    config.headers = utils$3.merge(
      config.headers.common || {},
      config.headers[config.method] || {},
      config.headers
    );
    utils$3.forEach(
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
  var utils$2 = utils$c;
  var mergeConfig$2 = function mergeConfig2(config1, config2) {
    config2 = config2 || {};
    var config = {};
    function getMergedValue(target, source) {
      if (utils$2.isPlainObject(target) && utils$2.isPlainObject(source)) {
        return utils$2.merge(target, source);
      } else if (utils$2.isPlainObject(source)) {
        return utils$2.merge({}, source);
      } else if (utils$2.isArray(source)) {
        return source.slice();
      }
      return source;
    }
    function mergeDeepProperties(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(config1[prop], config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
        return getMergedValue(void 0, config1[prop]);
      }
    }
    function valueFromConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      }
    }
    function defaultToConfig2(prop) {
      if (!utils$2.isUndefined(config2[prop])) {
        return getMergedValue(void 0, config2[prop]);
      } else if (!utils$2.isUndefined(config1[prop])) {
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
    utils$2.forEach(Object.keys(config1).concat(Object.keys(config2)), function computeConfigValue(prop) {
      var merge2 = mergeMap[prop] || mergeDeepProperties;
      var configValue = merge2(prop);
      utils$2.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
  };
  var data;
  var hasRequiredData;
  function requireData() {
    if (hasRequiredData)
      return data;
    hasRequiredData = 1;
    data = {
      "version": "0.27.2"
    };
    return data;
  }
  var VERSION = requireData().version;
  var AxiosError = AxiosError_1;
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
    var i = keys.length;
    while (i-- > 0) {
      var opt = keys[i];
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
  var utils$1 = utils$c;
  var buildURL = buildURL$1;
  var InterceptorManager = InterceptorManager_1;
  var dispatchRequest = dispatchRequest$1;
  var mergeConfig$1 = mergeConfig$2;
  var buildFullPath = buildFullPath$1;
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
  utils$1.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
    Axios$1.prototype[method] = function(url, config) {
      return this.request(mergeConfig$1(config || {}, {
        method,
        url,
        data: (config || {}).data
      }));
    };
  });
  utils$1.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
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
  var CancelToken_1;
  var hasRequiredCancelToken;
  function requireCancelToken() {
    if (hasRequiredCancelToken)
      return CancelToken_1;
    hasRequiredCancelToken = 1;
    var CanceledError2 = requireCanceledError();
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
        token.reason = new CanceledError2(message);
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
    CancelToken_1 = CancelToken;
    return CancelToken_1;
  }
  var spread;
  var hasRequiredSpread;
  function requireSpread() {
    if (hasRequiredSpread)
      return spread;
    hasRequiredSpread = 1;
    spread = function spread2(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };
    return spread;
  }
  var isAxiosError;
  var hasRequiredIsAxiosError;
  function requireIsAxiosError() {
    if (hasRequiredIsAxiosError)
      return isAxiosError;
    hasRequiredIsAxiosError = 1;
    var utils2 = utils$c;
    isAxiosError = function isAxiosError2(payload) {
      return utils2.isObject(payload) && payload.isAxiosError === true;
    };
    return isAxiosError;
  }
  var utils = utils$c;
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
  var axios$2 = createInstance(defaults);
  axios$2.Axios = Axios;
  axios$2.CanceledError = requireCanceledError();
  axios$2.CancelToken = requireCancelToken();
  axios$2.isCancel = requireIsCancel();
  axios$2.VERSION = requireData().version;
  axios$2.toFormData = toFormData_1;
  axios$2.AxiosError = AxiosError_1;
  axios$2.Cancel = axios$2.CanceledError;
  axios$2.all = function all(promises) {
    return Promise.all(promises);
  };
  axios$2.spread = requireSpread();
  axios$2.isAxiosError = requireIsAxiosError();
  axios$3.exports = axios$2;
  axios$3.exports.default = axios$2;
  var axiosExports = axios$3.exports;
  var axios = axiosExports;
  const axios$1 = /* @__PURE__ */ getDefaultExportFromCjs(axios);
  function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
      let requestData = config.data;
      const requestHeaders = config.headers ?? {};
      if (utils$d.isFormData(requestData)) {
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
      utils$d.forEach(requestHeaders, function setRequestHeader(val, key) {
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
            // can't got real XMLHttpRequest object, only some property is available
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
  const ACT_MIHOYO_BASE_URL = "https://act.mihoyo.com/";
  const DEVICE_FP_URL = "https://public-data-api.mihoyo.com/device-fp/api/getFp";
  const GI_CALC_PAGE_URL = "https://act.mihoyo.com/ys/event/calculator/index.html";
  const GI_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";
  const GI_CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/sync/avatar/list";
  const GI_ALL_CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v1/avatar/list";
  const GI_BATCH_COMPUTE_URL = "https://api-takumi.mihoyo.com/event/e20200928calculate/v3/batch_compute";
  const HSR_CALC_PAGE_URL = "https://act.mihoyo.com/sr/event/cultivation-tool/index.html";
  const HSR_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hkrpg_cn";
  const HSR_AVATAR_LIST_URL = "https://api-takumi.mihoyo.com/event/rpgcultivate/avatar/list";
  const HSR_AVATAR_DETAIL_URL = "https://api-takumi.mihoyo.com/event/rpgcultivate/calc/avatar/detail";
  const HSR_COMPUTE_URL = "https://api-takumi.mihoyo.com/event/rpgcultivate/calc/compute";
  const ZZZ_CALC_PAGE_URL = "https://act.mihoyo.com/zzz/gt/character-builder-h/index.html";
  const ZZZ_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookieToken?game_biz=nap_cn";
  const ZZZ_CHARACTERS_URL = "https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_basic_list";
  const ZZZ_CHARACTERS_DETAIL_URL = "https://api-takumi.mihoyo.com/event/nap_cultivate_tool/user/batch_avatar_detail_v2";
  const ZZZ_CALC_URL = "https://act-api-takumi.mihoyo.com/event/nap_cultivate_tool/user/avatar_calc";
  axios$1.defaults.adapter = xhrAdapter;
  axios$1.defaults.withCredentials = true;
  let syncRequestCount = 0;
  const resetSyncRequestCount = () => {
    syncRequestCount = 0;
  };
  const getSyncRequestCount = () => syncRequestCount;
  axios$1.interceptors.request.use((config) => {
    syncRequestCount++;
    const method = (config.method || "get").toUpperCase();
    console.log(`[请求计数] #${syncRequestCount} ${method} ${config.url}`);
    return config;
  });
  axios$1.interceptors.response.use(
    (response) => {
      const data2 = response.data;
      if (data2 && typeof data2 === "object" && !Array.isArray(data2) && "retcode" in data2) {
        const retcode = data2.retcode;
        if (retcode !== 0 && retcode !== -100) {
          const cfg = response.config;
          const method = (cfg.method || "get").toUpperCase();
          console.error(`[请求异常] retcode=${retcode} ${method} ${cfg.url}`);
          if (cfg.data)
            console.error(`[请求异常] body:`, cfg.data);
          else if (cfg.params)
            console.error(`[请求异常] params:`, cfg.params);
          const message = data2.message;
          if (message)
            console.error(`[请求异常] message:`, message);
        }
      }
      return response;
    },
    (error) => {
      const cfg = error?.config;
      if (cfg) {
        const method = (cfg.method || "get").toUpperCase();
        console.error(`[请求异常] ${method} ${cfg.url}`);
        if (cfg.data)
          console.error(`[请求异常] body:`, cfg.data);
        else if (cfg.params)
          console.error(`[请求异常] params:`, cfg.params);
      }
      console.error(error);
      return Promise.reject(error);
    }
  );
  async function refreshPage() {
    console.log("刷新页面?");
    const confirmed = confirm("确定要刷新页面吗？刷新后将重新加载所有数据。");
    if (confirmed) {
      window.location.reload();
    }
  }
  function getGuid() {
    function S4() {
      return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
    }
    return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
  }
  function generateCharString(number = 16) {
    const characters = "abcdef0123456789";
    let result = "";
    for (let i = 0; i < number; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters[randomIndex];
    }
    return result;
  }
  const headers = {
    Referer: ACT_MIHOYO_BASE_URL,
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
  };
  const to = (promise) => promise.then((data2) => {
    return [null, data2];
  }).catch((err) => {
    console.error(err);
    return [err];
  });
  const getFp = async () => {
    let fp = localStorage.getItem("fp");
    let deviceId = localStorage.getItem("mysDeviceId");
    if (!deviceId) {
      deviceId = getGuid();
      localStorage.setItem("mysDeviceId", deviceId);
    }
    if (!fp) {
      let url = DEVICE_FP_URL;
      const [err, res] = await to(axios$1.post(
        url,
        JSON.stringify({
          seed_id: generateCharString(),
          device_id: deviceId.toUpperCase(),
          platform: "1",
          seed_time: (/* @__PURE__ */ new Date()).getTime() + "",
          ext_fields: `{"proxyStatus":"0","accelerometer":"-0.159515x-0.830887x-0.682495","ramCapacity":"3746","IDFV":"${deviceId.toUpperCase()}","gyroscope":"-0.191951x-0.112927x0.632637","isJailBreak":"0","model":"iPhone12,5","ramRemain":"115","chargeStatus":"1","networkType":"WIFI","vendor":"--","osVersion":"17.0.2","batteryStatus":"50","screenSize":"414×896","cpuCores":"6","appMemory":"55","romCapacity":"488153","romRemain":"157348","cpuType":"CPU_TYPE_ARM64","magnetometer":"-84.426331x-89.708435x-37.117889"}`,
          app_name: "bbs_cn",
          device_fp: "38d7ee834d1e9"
        }),
        {
          timeout: 5e3,
          headers
        }
      ));
      if (!err) {
        const { status, data: resData } = await res;
        if (status == 200) {
          const { retcode, data: data2 } = resData;
          if (retcode === 0) {
            let resFp = data2["device_fp"];
            localStorage.setItem("fp", resFp);
            return resFp;
          }
        }
      }
    } else {
      return fp;
    }
  };
  const getAccount = async (roleUrl, openUrl, gameType) => {
    const [err, res] = await to(axios$1.get(roleUrl, {
      headers
    }));
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
    alert(`请确认已登录活动页面且绑定${gameType}账户!`);
    GM_openInTab(openUrl);
    throw err ? err : new Error("账户信息获取失败");
  };
  const getStorageAccount = () => localStorage.account || "main";
  const seelieGetInventory = (type, item, tier) => {
    const account = getStorageAccount();
    const raw = localStorage.getItem(`${account}-inventory`);
    if (!raw)
      return null;
    try {
      const arr = JSON.parse(raw);
      const found = arr.find((a) => a.type === type && a.item === item && a.tier === tier);
      return found ? found.value : null;
    } catch {
      return null;
    }
  };
  const seelieSetInventory = (type, item, tier, value) => {
    const account = getStorageAccount();
    const key = `${account}-inventory`;
    const raw = localStorage.getItem(key);
    const arr = raw ? JSON.parse(raw) : [];
    const found = arr.find((a) => a.type === type && a.item === item && a.tier === tier);
    if (found) {
      found.value = value;
    } else {
      arr.push({ type, item, tier, value });
    }
    localStorage.setItem(key, JSON.stringify(arr));
    localStorage.setItem(`${account}-inv_sync`, Date.now().toString());
  };
  const getTotalGoal = async () => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-goals`;
    const text = await currentAdapter.getItem(key) || "[]";
    return typeof text === "string" ? JSON.parse(text) : text;
  };
  const getGoalInactive = async () => {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    const key = `${getStorageAccount()}-inactive`;
    const text = await currentAdapter.getItem(key) || "[]";
    return Object.keys(typeof text === "string" ? JSON.parse(text) : text);
  };
  const setGoals = async (goals) => {
    const key = `${getStorageAccount()}-goals`;
    const currentAdapter = AdapterManager.getCurrentAdapter();
    await currentAdapter.setItem(key, goals);
    await currentAdapter.setItem("last_update", (/* @__PURE__ */ new Date()).toISOString());
  };
  const getNextId = async () => {
    const goals = await getTotalGoal();
    const ids = goals.map((g2) => g2.id).filter((id) => true);
    return ids.length > 0 ? Math.max(...ids) + 1 : 1;
  };
  const addGoal = async (data2, fallbackToId = false) => {
    let index = -1;
    const goals = await getTotalGoal();
    if (data2.character) {
      index = goals.findIndex(
        (g2) => g2.character === data2.character && g2.type === data2.type
      );
    } else if (data2.id) {
      index = goals.findIndex((g2) => g2.id === data2.id);
    }
    if (index < 0 && fallbackToId && typeof data2.id === "number") {
      index = goals.findIndex((g2) => g2.id === data2.id);
    }
    if (index >= 0) {
      goals[index] = { ...goals[index], ...data2 };
    } else {
      const lastId = goals?.map((g2) => g2.id)?.filter((id) => typeof id == "number")?.sort((a, b) => a < b ? 1 : -1)[0];
      data2.id = (lastId || 0) + 1;
      goals.push(data2);
    }
    await setGoals(goals);
  };
  const updateCharacter = async (character, characterStatusGoal) => {
    const { current } = character;
    const { level: levelCurrent, asc: ascCurrent } = current;
    const { level, asc } = characterStatusGoal;
    const characterGoalNew = {
      ...character,
      goal: level >= levelCurrent && asc >= ascCurrent ? characterStatusGoal : current
    };
    await addGoal(characterGoalNew);
  };
  const batchUpdateGoals = async (type, identifierKey, updateFn, all, ...updateArgs) => {
    const totalGoal = await getTotalGoal();
    const goalInactive = await getGoalInactive();
    const goals = totalGoal.filter((a) => a.type === type).filter((a) => all || !goalInactive.includes(a[identifierKey]));
    for (let goal of goals) {
      await updateFn(goal, ...updateArgs);
    }
    await refreshPage();
  };
  let _loginPromptShown = false;
  const checkLogin = (retcode, gameName, calcUrl) => {
    if (retcode !== -100)
      return;
    if (_loginPromptShown)
      throw new Error(`${gameName} 登录态已过期`);
    _loginPromptShown = true;
    alert(`${gameName} 登录态已过期！
请前往米游社登录并打开${gameName}计算器页面，
确保页面加载完成后再回来同步。`);
    GM_openInTab(calcUrl);
    throw new Error(`${gameName} 登录态已过期，已打开计算器页面，请重新登录后同步`);
  };
  const resetLoginFlag = () => {
    _loginPromptShown = false;
  };
  const getItemsFromPage = () => {
    try {
      const app = document.querySelector("#app");
      const data2 = app?._vnode?.component?.data;
      if (!data2)
        return null;
      if (data2.items && typeof data2.items === "object" && !Array.isArray(data2.items)) {
        return data2.items;
      }
      for (const key of Object.keys(data2)) {
        const v = data2[key];
        if (v && typeof v === "object" && !Array.isArray(v)) {
          const sample = Object.values(v)[0];
          if (sample && typeof sample === "object" && typeof sample.type === "string" && ("id" in sample || "ids" in sample)) {
            return v;
          }
        }
      }
      return null;
    } catch {
      return null;
    }
  };
  const findItemMatch = (items, id) => {
    for (const [key, info] of Object.entries(items)) {
      const ids = info.ids ?? (info.id != null ? [info.id] : []);
      const tier = info.ids ? info.ids.indexOf(id) : 0;
      if (ids.includes(id)) {
        return { key, type: info.type, tier };
      }
    }
    return null;
  };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const sleepWithJitter = (base, jitter = 0) => sleep(base + Math.floor(Math.random() * (jitter + 1)));
  const getFpDeviceId = async () => {
    const fp = await getFp();
    const deviceId = localStorage.getItem("mysDeviceId") || fp;
    return { fp, deviceId };
  };
  const buildBaseHeaders = (fp, deviceId) => ({
    ...headers,
    "x-rpc-device_fp": fp,
    "x-rpc-device_id": deviceId,
    "x-rpc-platform": "4"
  });
  const loadSeelieItems = (sourceLabel, pageItems) => {
    const lib = pageItems ?? getItemsFromPage();
    const itemLib = lib || {};
    console.log(`${sourceLabel} items 来源：${lib ? "页面运行时" : "无（findItemMatch 可能空匹配）"}，共 ${Object.keys(itemLib).length} 条`);
    return itemLib;
  };
  const mergeMaterialsMax = (merged, flat) => {
    if (!flat)
      return;
    for (const [k, v] of Object.entries(flat)) {
      const id = Number(k);
      const val = Number(v);
      if (!Number.isFinite(id) || !Number.isFinite(val))
        continue;
      if (!(id in merged) || val > merged[id])
        merged[id] = val;
    }
  };
  const postCalcAndMerge = async (url, body, h2, label, gameName, calcPageUrl, merged, avatarId) => {
    const [err, res] = await to(axios$1.post(url, JSON.stringify(body), {
      timeout: 8e3,
      headers: { ...h2, "content-type": "application/json" }
    }));
    if (err) {
      console.warn(`[${label}] 角色 ${avatarId} 计算失败`, err?.message || err);
      return false;
    }
    const { status, data: resData } = await res;
    if (status !== 200 || resData?.retcode !== 0) {
      checkLogin(resData?.retcode, gameName, calcPageUrl);
      console.warn(`[${label}] 角色 ${avatarId} 计算错误 retcode=${resData?.retcode}`);
      return false;
    }
    const mats = resData?.data?.user_owns_materials || {};
    mergeMaterialsMax(merged, mats);
    return true;
  };
  const writeMergedToSeelieInventory = (merged, itemLib, specialMap, sourceLabel, extra) => {
    const results = [];
    for (const [idStr, value] of Object.entries(merged)) {
      const id = Number(idStr);
      const match = specialMap[id] || findItemMatch(itemLib, id);
      if (!match) {
        console.warn(`${sourceLabel} 未匹配素材 id=${id}`);
        continue;
      }
      const { type, key, tier } = match;
      const f2 = seelieGetInventory(type, key, tier);
      results.push({
        type,
        item: key,
        tier,
        value,
        mod: value - (f2 ?? 0),
        ...extra ? extra(id, value, match) : {}
      });
      seelieSetInventory(type, key, tier, value);
    }
    console.log(`${sourceLabel} 已写入 ${results.length} 条素材到 seelie 库存`);
    return results;
  };
  const withThrottle = async (key, label, fn, uid, region, cooldownMs = 6e4) => {
    const last = Number(localStorage.getItem(key) || 0);
    if (last && Date.now() - last < cooldownMs) {
      const wait = Math.ceil((cooldownMs - (Date.now() - last)) / 1e3);
      alert(`请稍候 ${wait}s 再同步（${label} 1 分钟节流）`);
      return { ok: false, skipped: true, reason: "节流" };
    }
    const results = await fn(uid, region);
    localStorage.setItem(key, Date.now().toString());
    return results;
  };
  const requestPageSize = 200;
  const buildGenshinHeaders = async () => {
    const { fp, deviceId } = await getFpDeviceId();
    return {
      ...buildBaseHeaders(fp, deviceId),
      "x-rpc-lrsag": "",
      "x-rpc-page": "__#"
    };
  };
  const getCharacters$2 = async (uid, region, page = 1, cfg) => {
    const genshinHeaders = await buildGenshinHeaders();
    const [err, res] = await to(axios$1.post(cfg.charactersUrl, JSON.stringify({
      "element_attr_ids": [],
      "weapon_cat_ids": [],
      "page": page,
      "size": requestPageSize,
      "uid": uid,
      "region": region,
      "lang": "zh-cn"
    }), {
      timeout: 5e3,
      headers: genshinHeaders
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
        checkLogin(retcode, "原神", cfg.calcPageUrl);
        console.warn(`[GI] 角色列表获取失败 retcode=${retcode}: ${resData?.message || ""}`);
      }
    }
    localStorage.removeItem("fp");
    throw err ? err : new Error("角色列表获取失败");
  };
  const getCharacterDetail$2 = async (character, uid, region) => {
    return { character, ...character };
  };
  const getDetailList$2 = async (game_uid, region, cfg) => {
    let maxPageSize = Math.ceil(getCharactersNum() / requestPageSize);
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters = [];
    for await (let i of idxs) {
      characters.push.apply(characters, await getCharacters$2(game_uid, region, i + 1, cfg));
    }
    const details = characters.map((c) => getCharacterDetail$2(c));
    const detailList = [];
    for await (let d of details) {
      if (!!d) {
        detailList.push(d);
      }
    }
    return detailList;
  };
  const getOwnedCharactersRaw = async (uid, region, cfg) => {
    let maxPageSize = Math.ceil(getCharactersNum() / requestPageSize);
    if (maxPageSize < 1)
      maxPageSize = 1;
    const chars = [];
    for (let i = 0; i < maxPageSize; i++) {
      try {
        const list = await getCharacters$2(uid, region, i + 1, cfg);
        if (list && list.length)
          chars.push(...list);
      } catch (e) {
        console.warn(`[素材同步] 已拥有角色(第${i + 1}页)获取失败:`, e?.message || e);
        break;
      }
    }
    return chars;
  };
  const getAllCharacters = async (cfg) => {
    const h2 = await buildGenshinHeaders();
    const result = [];
    const size = 200;
    let page = 1;
    while (true) {
      const [err, res] = await to(axios$1.post(cfg.allCharactersUrl, JSON.stringify({
        element_attr_ids: [],
        weapon_cat_ids: [],
        page,
        size,
        is_all: true,
        lang: "zh-cn"
      }), {
        timeout: 5e3,
        headers: h2
      }));
      if (err) {
        console.warn(`[素材同步] 全量角色列表(第${page}页)请求异常:`, err?.message || err);
        break;
      }
      const { status, data: resData } = await res;
      if (status != 200 || resData.retcode !== 0) {
        checkLogin(resData.retcode, "原神", cfg.calcPageUrl);
        console.warn(`[素材同步] 全量角色列表错误 retcode=${resData?.retcode}:`, resData?.message || "");
        break;
      }
      const list = resData.data?.list || resData.data?.avatars || [];
      result.push(...list);
      if (list.length < size)
        break;
      page++;
    }
    return result;
  };
  const GI_SPECIAL = {
    104003: { type: "xp", key: "xp", tier: 0 },
    202: { type: "mora", key: "mora", tier: 0 },
    104013: { type: "wep_xp", key: "wep_xp", tier: 0 }
  };
  const batchUpdateInventoryGI = async (uid, region, cfg, prefetched) => {
    const genshinHeaders = await buildGenshinHeaders();
    const SKIP_IDS = [10000117, 10000118, 10000005, 10000007];
    const ownedList = prefetched && prefetched.length ? prefetched : await getOwnedCharactersRaw(uid, region, cfg);
    console.log(`[素材同步] 复用角色同步已拉取 ${ownedList.length} 个已拥有角色${prefetched?.length ? "" : "（回退重新拉取）"}`);
    const ownedMap = /* @__PURE__ */ new Map();
    for (const c of ownedList)
      ownedMap.set(c.id, c);
    const allList = await getAllCharacters(cfg);
    const roster = allList.map((c) => {
      const owned = ownedMap.get(c.id);
      return owned && owned.weapon ? { ...c, weapon: owned.weapon } : c;
    });
    let items = roster.filter((c) => !SKIP_IDS.includes(c.id)).map((c) => {
      const item = {
        avatar_id: c.id,
        avatar_level_current: 1,
        avatar_level_target: 90,
        avatar_promote_level: 0,
        element_attr_id: c.element_attr_id,
        from_user_sync: false,
        skill_list: (c.skill_list || []).filter((s) => s.level_current < s.max_level && s.max_level === 10).map((s) => ({
          id: s.group_id,
          level_current: 1,
          level_target: 10
        }))
      };
      const w = c.weapon;
      if (w && w.id && w.level_current < w.max_level) {
        item.weapon = {
          id: w.id,
          level_current: 1,
          level_target: 90
        };
      }
      return item;
    });
    if (items.length === 0) {
      localStorage.removeItem("fp");
      throw new Error("未获取到任何角色，无法计算素材");
    }
    items = items.filter((a) => a.avatar_level_current != a.avatar_level_target || a.skill_list.length > 0);
    console.table(items);
    const BATCH_SIZE = 256;
    const SPLIT_RETRY_DELAY = 1e3;
    const consumeRaw = [];
    const doBatch = async (chunk) => {
      const [err, res] = await to(axios$1.post(cfg.computeUrl, JSON.stringify({
        items: chunk,
        "uid": uid,
        "region": region,
        "lang": "zh-cn"
      }), {
        timeout: 8e3,
        headers: genshinHeaders
      }));
      if (err) {
        console.warn(`[素材同步] 批次(${chunk.length}条)请求异常:`, err?.message || err);
        return null;
      }
      const { status, data: resData } = await res;
      if (status != 200 || resData.retcode !== 0) {
        checkLogin(resData.retcode, "原神", cfg.calcPageUrl);
        console.warn(`[素材同步] 批次(${chunk.length}条)返回错误 retcode=${resData?.retcode}:`, resData?.message || "");
        return null;
      }
      return resData.data?.overall_consume || [];
    };
    const processChunk = async (chunk) => {
      const part = await doBatch(chunk);
      if (part !== null) {
        console.log(`[素材同步] 批次(${chunk.length}条)完成，本批 ${part.length} 条素材`);
        return part;
      }
      if (chunk.length > 1) {
        const mid = Math.ceil(chunk.length / 2);
        const left = chunk.slice(0, mid);
        const right = chunk.slice(mid);
        console.warn(`[素材同步] 批次(${chunk.length}条)失败，二分重试 -> ${left.length}+${right.length}，间隔 ${SPLIT_RETRY_DELAY}ms`);
        await sleep(SPLIT_RETRY_DELAY);
        const l = await processChunk(left);
        const r = await processChunk(right);
        return [...l, ...r];
      }
      console.error(`[素材同步] 摘除影响数据(单条始终失败):`, JSON.stringify(chunk[0]));
      return [];
    };
    const total = Math.ceil(items.length / BATCH_SIZE);
    let idx = 0;
    for (let i = 0; i < items.length; i += BATCH_SIZE) {
      const chunk = items.slice(i, i + BATCH_SIZE);
      idx++;
      const part = await processChunk(chunk);
      if (part.length)
        consumeRaw.push(...part);
      console.log(`[素材同步] 批次 ${idx}/${total} 处理完毕，累计素材 ${consumeRaw.length} 条`);
    }
    if (consumeRaw.length === 0) {
      localStorage.removeItem("fp");
      throw new Error("Failed to calculate inventory.");
    }
    const merged = {};
    for (const t of consumeRaw) {
      const v = t.num + t.lack_num;
      if (merged[t.id]) {
        if (v > merged[t.id].value)
          merged[t.id].value = v;
      } else {
        merged[t.id] = { value: v, lackNum: t.lack_num };
      }
    }
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[素材同步]", pageItems);
    const results = writeMergedToSeelieInventory(
      Object.fromEntries(
        Object.entries(merged).map(([k, v]) => [Number(k), v.value])
      ),
      itemLib,
      GI_SPECIAL,
      "[素材同步]",
      (id) => ({ sort: 0, max: !merged[id].lackNum })
    );
    localStorage.removeItem("fp");
    return { ok: true, count: results.length, source: pageItems ? "page" : "fallback" };
  };
  const TALENT_KEYS = ["normal", "skill", "burst"];
  const addTalentGoal = async (talentCharacter, skill_list) => {
    const totalGoal = await getTotalGoal();
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "talent" && g2.character == talentCharacter);
    const combat = (skill_list ?? []).filter((s) => s.max_level === 10);
    if (combat.length !== TALENT_KEYS.length) {
      console.warn(`[角色同步] ${talentCharacter} 战斗天赋数量异常: ${combat.length}`, combat);
    }
    const lv = {};
    combat.slice(0, TALENT_KEYS.length).forEach((s, i) => {
      lv[TALENT_KEYS[i]] = s.level_current;
    });
    const normalCurrent = lv.normal ?? 1, skillCurrent = lv.skill ?? 1, burstCurrent = lv.burst ?? 1;
    let talentGoal;
    if (talentIdx < 0) {
      const id = await getNextId();
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
    await addGoal(talentGoal);
  };
  const addCharacterGoal$2 = async (status, nameEn, type, extra) => {
    const totalGoal = await getTotalGoal();
    const owner = extra?.owner ?? "";
    const characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    const weaponPredicate = (g2) => g2.type == "weapon" && g2.character == owner;
    const legacyWeaponPredicate = (g2) => g2.type == "weapon" && !g2.character && g2.weapon == nameEn;
    let characterIdx;
    if (type == "character") {
      characterIdx = totalGoal.findIndex(characterPredicate);
    } else {
      characterIdx = totalGoal.findIndex(weaponPredicate);
      if (characterIdx < 0) {
        characterIdx = totalGoal.findIndex(legacyWeaponPredicate);
      }
    }
    let characterGoal;
    function initCharacterGoal(id) {
      return {
        type,
        character: nameEn,
        current: status,
        goal: { ...status },
        ...extra?.cons !== void 0 ? { cons: extra.cons } : {},
        id
      };
    }
    function initWeaponGoal(id) {
      return {
        type,
        character: owner,
        weapon: nameEn,
        current: status,
        goal: { ...status },
        id
      };
    }
    if (characterIdx < 0) {
      const id = await getNextId();
      characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
      const oldGoal = totalGoal[characterIdx].goal;
      const goalLevel = Math.max(oldGoal.level, status.level);
      const goalAsc = Math.min(Math.max(oldGoal.asc, status.asc), 6);
      const goal = characterStatusList$2.find((s) => s.level === goalLevel && s.asc === goalAsc) ?? oldGoal;
      if (type == "character") {
        const old = totalGoal[characterIdx];
        const next = {
          ...old,
          character: nameEn,
          current: status,
          goal: { ...goal }
        };
        if (extra?.cons !== void 0 || old.cons !== void 0) {
          next.cons = Math.max(old.cons ?? 0, extra?.cons ?? 0);
        }
        characterGoal = next;
      } else {
        const old = totalGoal[characterIdx];
        const next = {
          ...old,
          character: owner,
          weapon: nameEn,
          current: status,
          goal: { ...goal }
        };
        characterGoal = next;
      }
    }
    await addGoal(characterGoal, true);
  };
  async function addCharacter$2(characterDataEx) {
    const { character, skill_list, weapon } = characterDataEx;
    const characterId = getCharacterId$2(character);
    if (!characterId) {
      return;
    }
    await addCharacterGoal$2(
      resolveStatus$1(character.level_current, character.promote_level),
      characterId,
      "character",
      { cons: character.constellation_num }
    );
    if (weapon) {
      const weaponId = getWeaponId$2(weapon);
      if (weaponId) {
        await addCharacterGoal$2(
          resolveStatus$1(weapon.level_current),
          weaponId,
          "weapon",
          { owner: characterId }
        );
      }
    }
    await addTalentGoal(characterId, skill_list);
  }
  const characterStatusList$2 = [
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
  const resolveStatus$1 = (level, promote) => {
    const closest = characterStatusList$2.filter((s) => s.level <= level).pop() ?? characterStatusList$2[0];
    const candidates = characterStatusList$2.filter((s) => s.level === closest.level);
    const hit = typeof promote === "number" ? candidates.find((s) => s.asc === promote) : void 0;
    return { ...hit ?? candidates[0] };
  };
  const updateTalent = async (talent, normalGoal = 9, skillGoal = 9, burstGoal = 9) => {
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
    await addGoal(talentNew);
  };
  const batchUpdateTalent = async (all, normal, skill, burst) => {
    await batchUpdateGoals(
      "talent",
      "character",
      // 天赋目标用character字段标识
      (talent) => updateTalent(talent, normal, skill, burst),
      all
    );
  };
  const batchUpdateCharacter$2 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "character",
      "character",
      // 角色目标用character字段标识
      updateCharacter,
      all,
      characterStatusGoal
    ).then(() => {
      console.log("角色更新完成");
    });
  };
  const batchUpdateWeapon$2 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "weapon",
      "weapon",
      // 武器目标用weapon字段标识
      (weapon) => updateCharacter(weapon, characterStatusGoal),
      all,
      characterStatusGoal
    ).then(() => {
      console.log("武器更新完成");
    });
  };
  class BaseAdapter {
    constructor() {
      // 公共实现：批量更新角色
      __publicField(this, "batchUpdateCharacter", (all, status) => {
        const { batchUpdateCharacter: batchUpdateCharacter2 } = this.importSeelieMethods();
        batchUpdateCharacter2(all, status);
      });
      // 公共实现：批量更新武器
      __publicField(this, "batchUpdateWeapon", (all, status) => {
        const { batchUpdateWeapon: batchUpdateWeapon2 } = this.importSeelieMethods();
        batchUpdateWeapon2(all, status);
      });
    }
    // 公共实现：获取账户列表
    async getAccounts() {
      const { calcPageUrl, roleUrl } = this.getApiConfig();
      return await getAccount(roleUrl, calcPageUrl, this.getGameName());
    }
    async getItem(key) {
      return Promise.resolve(localStorage.getItem(key));
    }
    async setItem(key, value) {
      localStorage.setItem(key, typeof value === "string" ? value : JSON.stringify(value));
      return Promise.resolve();
    }
  }
  class GenshinAdapter extends BaseAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "batchUpdateTalent", (all, normal, skill, burst) => {
        batchUpdateTalent(all, normal, skill, burst).then(() => {
          console.log("天赋更新完成");
        });
      });
      __publicField(this, "getInactiveConfig", () => {
        const GENSHIN_INACTIVE_CONFIG = [
          { type: "character", identifierKey: "character" },
          // 角色目标（标识字段：character）
          {
            type: "talent",
            identifierKey: "character",
            isTalent: true,
            talentKeys: ["normal", "skill", "burst"]
            // 原神天赋类型：普通攻击/元素战技/元素爆发
          },
          // 天赋目标（标识字段：character）
          { type: "weapon", identifierKey: "id" }
          // 武器目标（标识字段：weapon）
        ];
        return GENSHIN_INACTIVE_CONFIG;
      });
      // 1 分钟节流（避免频繁打米游社 batch_compute）；prefetched = 角色同步已拉取的已拥有角色，复用以消除重复 list/detail 请求
      __publicField(this, "batchUpdateInventory", async (uid, region, prefetched) => {
        const cfg = this.getApiConfig();
        return withThrottle("last-sync", "素材同步", (u, r) => batchUpdateInventoryGI(u, r, cfg, prefetched), uid, region);
      });
    }
    getGameName() {
      return GameType.GENSHIN;
    }
    getApiConfig() {
      return {
        calcPageUrl: GI_CALC_PAGE_URL,
        roleUrl: GI_ROLE_URL,
        charactersUrl: GI_CHARACTERS_URL,
        allCharactersUrl: GI_ALL_CHARACTERS_URL,
        computeUrl: GI_BATCH_COMPUTE_URL
      };
    }
    async getCharacterDetails(uid, region) {
      return getDetailList$2(uid, region, this.getApiConfig());
    }
    async syncCharacters(res) {
      console.group("返回数据");
      console.groupCollapsed("角色");
      console.table(res.map((a) => a.character));
      console.groupEnd();
      console.groupCollapsed("武器");
      console.table(res.map((a) => a.weapon));
      console.groupEnd();
      console.groupCollapsed("角色天赋");
      res.forEach((c) => {
        const name = c.character.name;
        console.groupCollapsed(name);
        console.table(c.skill_list);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      for (let v of res) {
        await addCharacter$2(v);
      }
    }
    importSeelieMethods() {
      return { batchUpdateCharacter: batchUpdateCharacter$2, batchUpdateWeapon: batchUpdateWeapon$2 };
    }
    getCharacterStatusList() {
      return characterStatusList$2;
    }
  }
  const getCharacters$1 = async (uid, region, cfg) => {
    const h2 = await buildHsrHeaders();
    const params = `?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}`;
    const [err, res] = await to(axios$1.get(cfg.charactersUrl + params, { headers: h2 }));
    if (err) {
      console.error("[HSR] 角色列表获取失败", err);
      throw err;
    }
    const { status, data: resData } = await res;
    if (status !== 200 || resData?.retcode !== 0) {
      checkLogin(resData?.retcode, "崩坏：星穹铁道", cfg.calcPageUrl);
      throw new Error(`[HSR] 角色列表返回错误 retcode=${resData?.retcode}: ${resData?.message || ""}`);
    }
    return resData?.data?.avatars || [];
  };
  const getCharacterDetail$1 = async (character, uid, region, cfg) => {
    const { item_id: id } = character;
    const h2 = await buildHsrHeaders();
    const params = `?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}&item_id=${id}&change_target_level=0`;
    const [err, res] = await to(axios$1.get(cfg.charactersDetailUrl + params, { headers: h2 }));
    if (err) {
      console.warn(`[HSR] 角色 ${id} 详情失败`, err?.message || err);
      return null;
    }
    const { status, data: resData } = await res;
    if (status !== 200 || resData?.retcode !== 0) {
      checkLogin(resData?.retcode, "崩坏：星穹铁道", cfg.calcPageUrl);
      console.warn(`[HSR] 角色 ${id} 详情错误 retcode=${resData?.retcode}`);
      return null;
    }
    return resData?.data;
  };
  const getDetailList$1 = async (game_uid, region, cfg) => {
    const avatars = await getCharacters$1(game_uid, region, cfg);
    const detailPromises = avatars.map((c) => getCharacterDetail$1(c, game_uid, region, cfg));
    const settled = await Promise.all(detailPromises);
    const detailList = [];
    for (let i = 0; i < avatars.length; i++) {
      const d = settled[i];
      if (d) {
        d.isOwned = (avatars[i].first_meet_time ?? 0) !== 0;
        detailList.push(d);
      }
    }
    return detailList;
  };
  const HSR_REQ_DELAY = 400;
  const buildHsrHeaders = async () => {
    const { fp, deviceId } = await getFpDeviceId();
    return {
      ...buildBaseHeaders(fp, deviceId),
      "x-rpc-lang": "zh-cn",
      "x-rpc-page": "v4.4.4__#/tools/calculation",
      "x-rpc-view_source": "1"
    };
  };
  const HSR_SPECIAL = {
    2: { type: "credit", key: "credit", tier: 0 }
  };
  const batchUpdateInventoryHSR = async (uid, region, cfg, prefetched) => {
    let details = [];
    if (prefetched && prefetched.length) {
      details = prefetched;
      console.log(`[HSR素材] 复用角色同步已拉取全量详情 ${details.length} 个，跳过 list/detail 请求`);
    } else {
      const allChars = await getCharacters$1(uid, region, cfg);
      if (!allChars.length)
        throw new Error("[HSR素材] 未获取到任何 HSR 角色");
      console.log(`[HSR素材] 全角色 ${allChars.length} 个`);
      const D_BATCH = 8;
      for (let i = 0; i < allChars.length; i += D_BATCH) {
        const slice = allChars.slice(i, i + D_BATCH);
        const part = await Promise.all(slice.map((c) => getCharacterDetail$1(c, uid, region, cfg)));
        details.push(...part.filter(Boolean));
        if (i + D_BATCH < allChars.length)
          await sleep(HSR_REQ_DELAY);
      }
      console.log(`[HSR素材] 拿到详情 ${details.length} 个`);
    }
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[HSR素材]", pageItems);
    const source = pageItems ? "page" : "none";
    const h2 = await buildHsrHeaders();
    const merged = {};
    let computed = 0;
    for (const d of details) {
      const avatar = d.avatar || {};
      const allSkills = [
        ...d.skills || [],
        ...d.skills_other || [],
        ...d.skills_servant || [],
        ...d.skills_special || []
      ];
      const body = {
        game: "hkrpg",
        avatar: {
          item_id: String(avatar.item_id),
          cur_level: 1,
          target_level: avatar.max_level || 80
        },
        skill_list: allSkills.map((s) => ({
          item_id: String(s.point_id),
          cur_level: 1,
          target_level: s.max_level || 1
        })),
        uid,
        region
      };
      if (d.equipment && d.equipment.item_id) {
        body.equipment = {
          item_id: String(d.equipment.item_id),
          cur_level: 1,
          target_level: d.equipment.max_level || 80
        };
      }
      const url = `${cfg.computeUrl}?game=hkrpg&game_biz=hkrpg_cn&badge_region=${region}&badge_uid=${uid}&noSessionRetry=true`;
      const ok = await postCalcAndMerge(url, body, h2, "[HSR素材]", "崩坏：星穹铁道", cfg.calcPageUrl, merged, avatar.item_id);
      if (ok) {
        computed++;
        if (computed % 10 === 0)
          console.log(`[HSR素材] 已计算 ${computed}/${details.length}`);
      }
      await sleep(HSR_REQ_DELAY);
    }
    if (!Object.keys(merged).length)
      throw new Error("[HSR素材] 未计算出任何素材（请检查接口/items 库）");
    const results = writeMergedToSeelieInventory(merged, itemLib, HSR_SPECIAL, "[HSR素材]");
    return { ok: true, count: results.length, source };
  };
  const getRuntimeCatalog$1 = (which) => {
    try {
      const app = document.querySelector("#app");
      const data2 = app?._vnode?.component?.data;
      const cat = data2?.[which];
      if (cat && typeof cat === "object" && !Array.isArray(cat)) {
        return cat;
      }
      return null;
    } catch {
      return null;
    }
  };
  let _characterIdMap$1 = null;
  let _coneIdMap = null;
  const getIdMap$1 = (which) => {
    const cached = which === "characters" ? _characterIdMap$1 : _coneIdMap;
    if (cached)
      return cached;
    const map = /* @__PURE__ */ new Map();
    const cat = getRuntimeCatalog$1(which);
    if (cat) {
      for (const [key, entry] of Object.entries(cat)) {
        if (entry && typeof entry.id === "number" && entry.id > 0) {
          map.set(entry.id, key);
        }
      }
    }
    if (which === "characters")
      _characterIdMap$1 = map;
    else
      _coneIdMap = map;
    return map;
  };
  let _characterPathMap = null;
  const getCharacterPathMap = () => {
    if (_characterPathMap)
      return _characterPathMap;
    const map = /* @__PURE__ */ new Map();
    const cat = getRuntimeCatalog$1("characters");
    if (cat) {
      for (const [key, entry] of Object.entries(cat)) {
        const p2 = entry?.path;
        if (p2 && typeof p2 === "string")
          map.set(key, p2);
      }
    }
    _characterPathMap = map;
    return map;
  };
  const getCharacterPath = (key) => {
    return getCharacterPathMap().get(key);
  };
  const getCharacterId$1 = (input) => {
    const id = typeof input === "string" ? void 0 : input.id;
    if (typeof id === "number" && id > 0) {
      const key = getIdMap$1("characters").get(id);
      if (key)
        return key;
    }
    console.error(`getCharacterId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
  };
  const getWeaponId$1 = (input) => {
    const id = typeof input === "string" ? void 0 : input.id;
    if (typeof id === "number" && id > 0) {
      const key = getIdMap$1("cones").get(id);
      if (key)
        return key;
    }
    console.error(`getWeaponId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
  };
  let initBonus = {};
  const addTraceGoal$1 = async (talentCharacter, skill_list, skills_servant) => {
    const totalGoal = await getTotalGoal();
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "trace" && g2.character == talentCharacter);
    const combatSkills = skill_list.filter((s) => s.point_type === 2).sort((a, b) => parseInt(a.point_id) - parseInt(b.point_id));
    const elationSkill = skill_list.find((s) => s.point_type === 4);
    const [baseCurrent, skillCurrent, ultimateCurrent, talentCurrent] = combatSkills.map((a) => a.cur_level);
    const elationCurrent = elationSkill?.cur_level;
    let [petSkillCurrent, petTalentCurrent] = [1, 1];
    let hasServant = skills_servant && skills_servant.length > 0;
    if (hasServant) {
      [petSkillCurrent, petTalentCurrent] = skills_servant.map((a) => a.cur_level);
    }
    const path = getCharacterPath(talentCharacter);
    const isRemembrance = path === "remembrance";
    const isElation = path === "elation";
    let talentGoal;
    if (talentIdx < 0) {
      const id = await getNextId();
      talentGoal = {
        type: "trace",
        character: talentCharacter,
        basic: {
          current: baseCurrent,
          goal: baseCurrent
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent
        },
        ultimate: {
          current: ultimateCurrent,
          goal: ultimateCurrent
        },
        talent: {
          current: talentCurrent,
          goal: talentCurrent
        },
        bonus: initBonus,
        id,
        ...isRemembrance ? {
          pet_skill: {
            current: petSkillCurrent,
            goal: petSkillCurrent
          },
          pet_talent: {
            current: petTalentCurrent,
            goal: petTalentCurrent
          }
        } : {},
        ...isElation ? {
          elation_skill: {
            current: elationCurrent ?? 1,
            goal: elationCurrent ?? 1
          }
        } : {}
      };
    } else {
      const seelieGoal = totalGoal[talentIdx];
      const { basic, skill, ultimate, talent } = seelieGoal;
      const { goal: basicGoal } = basic;
      const { goal: skillGoal } = skill;
      const { goal: ultimateGoal } = ultimate;
      const { goal: talentGoal2 } = talent;
      const petSkillGoal = seelieGoal.pet_skill?.goal ?? 1;
      const petTalentGoal = seelieGoal.pet_talent?.goal ?? 1;
      const elationGoal = seelieGoal.elation_skill?.goal ?? 1;
      talentGoal = {
        ...seelieGoal,
        basic: {
          current: baseCurrent,
          goal: baseCurrent > basicGoal ? Math.min(baseCurrent, 6) : basicGoal
        },
        skill: {
          current: skillCurrent,
          goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
        },
        ultimate: {
          current: ultimateCurrent,
          goal: ultimateCurrent > ultimateGoal ? ultimateCurrent : ultimateGoal
        },
        talent: {
          current: talentCurrent,
          goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
        },
        ...isRemembrance ? {
          pet_skill: {
            current: petSkillCurrent,
            goal: petSkillCurrent > petSkillGoal ? Math.min(petSkillCurrent, 6) : petSkillGoal
          },
          pet_talent: {
            current: petTalentCurrent,
            goal: petTalentCurrent > petTalentGoal ? Math.min(petTalentCurrent, 6) : petTalentGoal
          }
        } : {},
        ...isElation ? {
          elation_skill: {
            current: elationCurrent ?? 1,
            goal: (elationCurrent ?? 1) > elationGoal ? Math.min(elationCurrent ?? 1, 10) : elationGoal
          }
        } : {}
      };
    }
    await addGoal(talentGoal);
  };
  const addCharacterGoal$1 = async (level_current, nameEn, name, type, eidolon) => {
    const totalGoal = await getTotalGoal();
    let characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    let weaponPredicate = (g2) => g2.type == type && g2.cone == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus = initCharacterStatus(level_current);
    let characterGoal;
    function initCharacterGoal(id) {
      return {
        type,
        character: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id,
        eidolon: eidolon ?? 0
      };
    }
    function initWeaponGoal(id) {
      return {
        type,
        character: "",
        cone: nameEn,
        current: characterStatus,
        goal: characterStatus,
        id
      };
    }
    if (characterIdx < 0) {
      const id = await getNextId();
      characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
      const seelieGoal = type == "character" ? totalGoal[characterIdx] : totalGoal[characterIdx];
      const { goal, current } = seelieGoal;
      const { level: levelCurrent, asc: ascCurrent } = current;
      const { level: levelGoal, asc: ascGoal } = goal;
      const { level, asc } = characterStatus;
      const merged = {
        ...seelieGoal,
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      };
      if (type == "character" && (eidolon !== void 0 || seelieGoal.eidolon !== void 0)) {
        merged.eidolon = Math.max(seelieGoal.eidolon ?? 0, eidolon ?? 0);
      }
      characterGoal = merged;
    }
    await addGoal(characterGoal);
  };
  async function addCharacter$1(characterDataEx) {
    const { avatar: character, skills: skill_list, skills_servant, equipment: weapon } = characterDataEx;
    const { item_name: name, item_id: itemId, rank } = character;
    if (weapon) {
      const { item_name: weaponName, item_id: weaponItemId, cur_level: weaponLeveL } = weapon;
      const weaponId = getWeaponId$1({ id: parseInt(weaponItemId) });
      if (weaponId) {
        await addCharacterGoal$1(weaponLeveL, weaponId, weaponName, "cone");
      }
    }
    const { cur_level: characterLevel } = character;
    const characterId = getCharacterId$1({ id: parseInt(itemId) });
    if (!characterId || characterId.includes("trailblazer")) {
      return;
    }
    const eidolon = parseInt(rank ?? "") || 0;
    await addCharacterGoal$1(characterLevel, characterId, name, "character", eidolon);
    await addTraceGoal$1(characterId, skill_list, skills_servant);
  }
  const characterStatusList$1 = [
    { level: 1, asc: 0, text: "1" },
    { level: 20, asc: 0, text: "20" },
    { level: 20, asc: 1, text: "20 A" },
    { level: 30, asc: 1, text: "30" },
    { level: 30, asc: 2, text: "30 A" },
    { level: 40, asc: 2, text: "40" },
    { level: 40, asc: 3, text: "40 A" },
    { level: 50, asc: 3, text: "50" },
    { level: 50, asc: 4, text: "50 A" },
    { level: 60, asc: 5, text: "60" },
    { level: 60, asc: 5, text: "60 A" },
    { level: 70, asc: 5, text: "70" },
    { level: 70, asc: 6, text: "70 A" },
    { level: 80, asc: 6, text: "80" }
  ];
  const initCharacterStatus = (level_current) => {
    let initCharacterStatus2 = characterStatusList$1[0];
    if (level_current < 20) {
      return initCharacterStatus2;
    }
    for (let characterStatus of characterStatusList$1) {
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
  const updateTrace$1 = async (talent, normalGoal = 6, skillGoal = 9, burstGoal = 9, talentGoal2 = 9, petSkillGoal = 0, petTalentGoal = 0, elationGoal = 0) => {
    const {
      basic: { current: basicCurrent },
      skill: { current: skillCurrent },
      ultimate: { current: ultimateCurrent },
      talent: { current: talentCurrent }
    } = talent;
    const path = getCharacterPath(talent.character);
    const isRemembrance = path === "remembrance";
    const isElation = path === "elation";
    const applyExtra = (skill, goalCap, applicable) => {
      if (!goalCap || !applicable || !skill)
        return skill;
      const cur = skill.current;
      return { current: cur, goal: cur > goalCap ? cur : goalCap };
    };
    const talentNew = {
      ...talent,
      basic: {
        current: basicCurrent,
        goal: basicCurrent > normalGoal ? basicCurrent : normalGoal
      },
      skill: {
        current: skillCurrent,
        goal: skillCurrent > skillGoal ? skillCurrent : skillGoal
      },
      ultimate: {
        current: ultimateCurrent,
        goal: ultimateCurrent > burstGoal ? ultimateCurrent : burstGoal
      },
      talent: {
        current: talentCurrent,
        goal: talentCurrent > talentGoal2 ? talentCurrent : talentGoal2
      },
      pet_skill: applyExtra(talent.pet_skill, petSkillGoal, isRemembrance),
      pet_talent: applyExtra(talent.pet_talent, petTalentGoal, isRemembrance),
      elation_skill: applyExtra(talent.elation_skill, elationGoal, isElation)
    };
    await addGoal(talentNew);
  };
  const batchUpdateTrace$1 = async (all, normal, skill, burst, t, petSkill = 0, petTalent = 0, elation = 0) => {
    if (normal > 6) {
      normal = 6;
    }
    await batchUpdateGoals(
      "trace",
      "character",
      // 天赋目标用character字段标识
      (trace) => updateTrace$1(trace, normal, skill, burst, t, petSkill, petTalent, elation),
      all
    );
  };
  const batchUpdateCharacter$1 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "character",
      "character",
      updateCharacter,
      all,
      characterStatusGoal
    ).then(() => {
      console.log("角色更新完成");
    });
  };
  const batchUpdateWeapon$1 = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "cone",
      "cone",
      (weapon) => updateCharacter(weapon, characterStatusGoal),
      all,
      characterStatusGoal
    ).then(() => {
      console.log("武器更新完成");
    });
  };
  class HsrAdapter extends BaseAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "batchUpdateTalent", (all, normal, skill, burst, t, petSkill = 0, petTalent = 0, elation = 0) => {
        batchUpdateTrace$1(all, normal, skill, burst, t, petSkill, petTalent, elation);
      });
      __publicField(this, "getInactiveConfig", () => {
        const HSR_INACTIVE_CONFIG = [
          { type: "character", identifierKey: "character" },
          // 角色目标
          {
            type: "trace",
            identifierKey: "character",
            isTalent: true,
            talentKeys: ["basic", "skill", "ultimate", "talent", "pet_talent", "pet_skill"]
          },
          // 行迹目标
          { type: "cone", identifierKey: "id" }
          // 光锥目标（标识键为 id）
        ];
        return HSR_INACTIVE_CONFIG;
      });
      // 1 分钟节流（避免频繁打米游社 calc/compute；独立 key 不干扰 GI 的 last-sync）；prefetched = 角色同步已拉取详情，复用跳过 list/detail
      __publicField(this, "batchUpdateInventory", async (uid, region, prefetched) => {
        const cfg = this.getApiConfig();
        return withThrottle("hsr-last-sync", "HSR 素材同步", (u, r) => batchUpdateInventoryHSR(u, r, cfg, prefetched), uid, region);
      });
    }
    getGameName() {
      return GameType.HSR;
    }
    getApiConfig() {
      return {
        calcPageUrl: HSR_CALC_PAGE_URL,
        roleUrl: HSR_ROLE_URL,
        charactersUrl: HSR_AVATAR_LIST_URL,
        // rpgcultivate/avatar/list（act-api，data.avatars + first_meet_time/is_own 判拥有）
        charactersDetailUrl: HSR_AVATAR_DETAIL_URL,
        // rpgcultivate/calc/avatar/detail（真实养成状态，素材计算取 max_level）
        computeUrl: HSR_COMPUTE_URL
      };
    }
    async getCharacterDetails(uid, region) {
      return getDetailList$1(uid, region, this.getApiConfig());
    }
    async syncCharacters(res) {
      console.group("返回数据");
      console.groupCollapsed("角色");
      console.table(res.map((a) => a.avatar));
      console.groupEnd();
      console.groupCollapsed("光锥");
      console.table(res.map((a) => a.equipment));
      console.groupEnd();
      console.groupCollapsed("角色天赋");
      res.forEach((c) => {
        const name = c.avatar.item_name;
        console.groupCollapsed(name);
        console.table(c.skills);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupCollapsed("角色额外天赋(仅展示不做处理)");
      res.forEach((c) => {
        const name = c.avatar.item_name;
        console.groupCollapsed(name);
        console.table(c.skills_other);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      for (let v of res) {
        if (!v.isOwned)
          continue;
        await addCharacter$1(v);
      }
    }
    importSeelieMethods() {
      return { batchUpdateCharacter: batchUpdateCharacter$1, batchUpdateWeapon: batchUpdateWeapon$1 };
    }
    getCharacterStatusList() {
      return characterStatusList$1;
    }
    async getItem(key) {
      return localforage2.getItem(key);
    }
    async setItem(key, value) {
      return localforage2.setItem(key, value);
    }
  }
  const getCharacters = async (uid, region, page = 1, cfg) => {
    let url = cfg.charactersUrl;
    let params = `?uid=${uid}&region=${region}`;
    let fp = await getFp();
    const [err, res] = await to(axios$1.get(url + params, {
      headers: {
        ...headers,
        "x-rpc-device_fp": fp
      },
      timeout: 1e4
    }));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
        checkLogin(retcode, "绝区零", cfg.calcPageUrl);
        console.warn(`[ZZZ] 角色列表获取失败 retcode=${retcode}: ${resData?.message || ""}`);
      }
    }
    alert("请确认已登录活动页面且绑定账户!");
    throw err ? err : new Error("角色列表获取失败");
  };
  const getCharacterDetail = async (ids, uid, region, cfg) => {
    const params = `?uid=${uid}&region=${region}`;
    let URL = cfg.charactersDetailUrl;
    let fp = await getFp();
    let avatarList = ids.map((id) => ({
      avatar_id: id,
      is_teaser: false,
      teaser_need_weapon: false,
      teaser_sp_skill: false
    }));
    const [err, res] = await to(axios$1.post(
      URL + params,
      {
        avatar_list: avatarList
      },
      {
        headers: {
          ...headers,
          "x-rpc-device_fp": fp
        },
        timeout: 1e4
      }
    ));
    if (!err) {
      const { status, data: resData } = await res;
      if (status == 200) {
        const { retcode, data: data2 } = resData;
        if (retcode === 0) {
          const { list: characterList } = await data2;
          return characterList;
        }
        checkLogin(retcode, "绝区零", cfg.calcPageUrl);
        console.warn(`[ZZZ] 角色详情获取失败 retcode=${retcode}: ${resData?.message || ""}`);
      }
    } else {
      console.error(err);
    }
    return [];
  };
  const getDetailList = async (game_uid, region, cfg) => {
    let maxPageSize = 1;
    let idxs = Array.from(new Array(maxPageSize).keys());
    const characters = [];
    for await (let i of idxs) {
      let characterData = await getCharacters(game_uid, region, i + 1, cfg);
      characters.push.apply(characters, characterData.filter((a) => a.unlocked).map((a) => a.avatar));
    }
    let ids = characters.map((a) => a.id);
    const batchSize = 10;
    const allResults = [];
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);
      const batchResults = await getCharacterDetail(batchIds, game_uid, region, cfg);
      allResults.push(...batchResults);
    }
    return allResults;
  };
  const ZZZ_REQ_DELAY = 800;
  const ZZZ_REQ_JITTER = 400;
  const buildZzzHeaders = async () => {
    const { fp, deviceId } = await getFpDeviceId();
    return {
      ...buildBaseHeaders(fp, deviceId),
      "x-rpc-cultivate_source": "pc",
      "x-rpc-geetest_ext": JSON.stringify({ gameId: 8, page: "v2.6.8_apps-h_#", viewSource: 1, actionSource: 132 }),
      "x-rpc-is_teaser": "1",
      "x-rpc-lang": "zh-cn",
      "x-rpc-lrsag": "",
      "x-rpc-page": "v2.6.8_apps-h_#"
    };
  };
  const ZZZ_SPECIAL = {
    10: { type: "denny", key: "denny", tier: 0 }
  };
  const ZZZ_CALC_SKILLS = [
    { skill_type: 0, level: 12, init_level: 1 },
    { skill_type: 1, level: 12, init_level: 1 },
    { skill_type: 2, level: 12, init_level: 1 },
    { skill_type: 3, level: 12, init_level: 1 },
    { skill_type: 5, level: 7, init_level: 1 },
    { skill_type: 6, level: 12, init_level: 1 }
  ];
  const batchUpdateInventoryZZZ = async (uid, region, cfg, prefetched) => {
    const raw = prefetched && prefetched.length ? prefetched : await getCharacters(uid, region, 1, cfg);
    const list = raw.filter((d) => d.unlocked !== false);
    if (!list.length)
      throw new Error("[ZZZ素材] 未获取到任何 ZZZ 角色");
    console.log(`[ZZZ素材] 已加载 ${list.length} 个角色（${prefetched?.length ? "复用角色同步数据" : "仅全量 list"}）`);
    const pageItems = getItemsFromPage();
    const itemLib = loadSeelieItems("[ZZZ素材]", pageItems);
    const source = pageItems ? "page" : "none";
    const h2 = await buildZzzHeaders();
    const merged = {};
    let computed = 0;
    for (const d of list) {
      await sleepWithJitter(ZZZ_REQ_DELAY, ZZZ_REQ_JITTER);
      const avatar = d.avatar || d;
      const avatarId = avatar?.id ?? d.id;
      const skills = ZZZ_CALC_SKILLS.map((s) => ({ ...s }));
      const weaponId = d.signature_weapon_id || d.weapon?.id || avatar?.weapon?.id;
      const body = {
        avatar_id: String(avatarId),
        avatar_level: 60,
        avatar_current_level: 1,
        avatar_current_promotes: 0,
        skills,
        weapon_info: weaponId ? {
          weapon_id: String(weaponId),
          weapon_level: 60,
          weapon_promotes: 0,
          weapon_init_level: 0
        } : void 0
      };
      const url = `${cfg.computeUrl}?uid=${uid}&region=${region}`;
      const ok = await postCalcAndMerge(url, body, h2, "[ZZZ素材]", "绝区零", cfg.calcPageUrl, merged, avatarId);
      if (ok) {
        computed++;
        if (computed % 10 === 0)
          console.log(`[ZZZ素材] 已计算 ${computed}/${list.length}`);
      }
    }
    if (!Object.keys(merged).length)
      throw new Error("[ZZZ素材] 未计算出任何素材（请检查接口/items 库）");
    const results = writeMergedToSeelieInventory(merged, itemLib, ZZZ_SPECIAL, "[ZZZ素材]");
    return { ok: true, count: results.length, source };
  };
  const getRuntimeCatalog = (which) => {
    try {
      const app = document.querySelector("#app");
      const data2 = app?._vnode?.component?.data;
      const cat = data2?.[which];
      if (cat && typeof cat === "object" && !Array.isArray(cat)) {
        return cat;
      }
      return null;
    } catch {
      return null;
    }
  };
  let _characterIdMap = null;
  let _weaponIdMap = null;
  const getIdMap = (which) => {
    const cached = which === "characters" ? _characterIdMap : _weaponIdMap;
    if (cached)
      return cached;
    const map = /* @__PURE__ */ new Map();
    const cat = getRuntimeCatalog(which);
    if (cat) {
      for (const [key, entry] of Object.entries(cat)) {
        if (entry && typeof entry.id === "number" && entry.id > 0) {
          map.set(entry.id, key);
        }
      }
    }
    if (which === "characters")
      _characterIdMap = map;
    else
      _weaponIdMap = map;
    return map;
  };
  const getCharacterId = (input) => {
    const id = typeof input === "string" ? void 0 : input.id;
    if (typeof id === "number" && id > 0) {
      const key = getIdMap("characters").get(id);
      if (key)
        return key;
    }
    console.error(`getCharacterId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
  };
  const getWeaponId = (input) => {
    const id = typeof input === "string" ? void 0 : input.id;
    if (typeof id === "number" && id > 0) {
      const key = getIdMap("weapons").get(id);
      if (key)
        return key;
    }
    console.error(`getWeaponId 查询失败 (input=${JSON.stringify(input)})`);
    return "";
  };
  const addTraceGoal = async (talentCharacter, skill_list) => {
    const totalGoal = await getTotalGoal();
    const talentIdx = totalGoal.findIndex((g2) => g2.type == "talent" && g2.character == talentCharacter);
    const typeOrder = [0, 2, 6, 1, 3, 5];
    skill_list.sort((a, b) => {
      const aIndex = typeOrder.indexOf(a.skill_type);
      const bIndex = typeOrder.indexOf(b.skill_type);
      return aIndex - bIndex;
    });
    const [baseCurrent, dodgeCurrent, assistCurrent, specialCurrent, chainCurrent, coreCurrent] = skill_list.map((a) => a.level);
    let talentGoal;
    let coreValue = coreCurrent - 1;
    if (talentIdx < 0) {
      const id = await getNextId();
      talentGoal = {
        type: "talent",
        character: talentCharacter,
        basic: {
          current: baseCurrent,
          goal: baseCurrent
        },
        dodge: {
          current: dodgeCurrent,
          goal: dodgeCurrent
        },
        assist: {
          current: assistCurrent,
          goal: assistCurrent
        },
        special: {
          current: specialCurrent,
          goal: specialCurrent
        },
        chain: {
          current: chainCurrent,
          goal: chainCurrent
        },
        core: {
          current: Math.max(1, coreValue),
          goal: Math.max(1, coreValue)
        },
        id
      };
    } else {
      const seelieGoal = totalGoal[talentIdx];
      const { basic, dodge, assist, special, chain, core } = seelieGoal;
      const { goal: basicGoal } = basic;
      const { goal: dodgeGoal } = dodge;
      const { goal: assistGoal } = assist;
      const { goal: specialGoal } = special;
      const { goal: chainGoal } = chain;
      const { goal: coreGoal } = core;
      talentGoal = {
        ...seelieGoal,
        basic: {
          current: baseCurrent,
          goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
        },
        dodge: {
          current: dodgeCurrent,
          goal: dodgeCurrent > dodgeGoal ? dodgeCurrent : dodgeGoal
        },
        assist: {
          current: assistCurrent,
          goal: assistCurrent > assistGoal ? assistCurrent : assistGoal
        },
        special: {
          current: specialCurrent,
          goal: specialCurrent > specialGoal ? specialCurrent : specialGoal
        },
        chain: {
          current: chainCurrent,
          goal: chainCurrent > chainGoal ? chainCurrent : chainGoal
        },
        core: {
          current: coreValue,
          goal: coreValue > coreGoal ? coreValue : coreGoal
        }
      };
    }
    await addGoal(talentGoal);
  };
  const resolveStatus = (level, promote) => {
    const closest = characterStatusList.filter((s) => s.level <= level).pop() ?? characterStatusList[0];
    const candidates = characterStatusList.filter((s) => s.level === closest.level);
    if (typeof promote !== "number") {
      return { ...closest };
    }
    const cap = promote * 10;
    const ascended = cap > closest.level;
    return { ...ascended ? candidates[candidates.length - 1] : candidates[0] };
  };
  const addCharacterGoal = async (status, nameEn, type, extra) => {
    const totalGoal = await getTotalGoal();
    const cons = extra?.cons;
    const owner = extra?.owner ?? "";
    const characterPredicate = (g2) => g2.type == type && g2.character == nameEn;
    const weaponPredicate = (g2) => g2.type == type && g2.weapon == nameEn;
    const characterIdx = totalGoal.findIndex(type == "character" ? characterPredicate : weaponPredicate);
    const characterStatus = status;
    function initCharacterGoal(id) {
      return {
        type: "character",
        character: nameEn,
        current: characterStatus,
        goal: { ...characterStatus },
        id,
        cons: cons ?? 0
      };
    }
    function initWeaponGoal(id) {
      const ws = { ...characterStatus, craft: 0 };
      return {
        type: "weapon",
        character: owner,
        weapon: nameEn,
        current: ws,
        goal: { ...ws },
        id
      };
    }
    let characterGoal;
    if (characterIdx < 0) {
      const id = await getNextId();
      characterGoal = type == "character" ? initCharacterGoal(id) : initWeaponGoal(id);
    } else {
      const seelieGoal = type == "character" ? totalGoal[characterIdx] : totalGoal[characterIdx];
      const { goal, current } = seelieGoal;
      const { level: levelCurrent, asc: ascCurrent } = current;
      const { level: levelGoal, asc: ascGoal } = goal;
      const { level, asc } = characterStatus;
      const merged = {
        ...seelieGoal,
        current: level >= levelCurrent && asc >= ascCurrent ? characterStatus : current,
        goal: level >= levelGoal && asc >= ascGoal ? characterStatus : goal
      };
      if (type == "character" && (cons !== void 0 || seelieGoal.cons !== void 0)) {
        merged.cons = Math.max(seelieGoal.cons ?? 0, cons ?? 0);
      }
      characterGoal = merged;
    }
    await addGoal(characterGoal);
  };
  async function addCharacter(characterDataEx) {
    const { avatar: character, weapon } = characterDataEx;
    const { level: characterLevel, rank, promotes } = character;
    if (weapon) {
      const { level: weaponLevel, promotes: weaponPromotes } = weapon;
      const weaponId = getWeaponId(weapon);
      if (weaponId) {
        await addCharacterGoal(
          resolveStatus(weaponLevel, weaponPromotes),
          weaponId,
          "weapon"
        );
      }
    }
    const characterId = getCharacterId(character);
    if (!characterId) {
      return;
    }
    await addCharacterGoal(
      resolveStatus(characterLevel, promotes),
      characterId,
      "character",
      { cons: rank }
    );
    await addTraceGoal(characterId, character.skills);
  }
  const characterStatusList = [
    { level: 1, asc: 0, text: "1" },
    { level: 20, asc: 0, text: "20" },
    { level: 20, asc: 1, text: "20 A" },
    { level: 30, asc: 1, text: "30" },
    { level: 30, asc: 2, text: "30 A" },
    { level: 40, asc: 2, text: "40" },
    { level: 40, asc: 3, text: "40 A" },
    { level: 50, asc: 3, text: "50" },
    { level: 50, asc: 4, text: "50 A" },
    { level: 60, asc: 5, text: "60" }
  ];
  const updateTrace = async (talent, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    const {
      basic: { current: baseCurrent },
      dodge: { current: dodgeCurrent },
      assist: { current: assistCurrent },
      special: { current: specialCurrent },
      chain: { current: chainCurrent },
      core: { current: coreCurrent }
    } = talent;
    const talentNew = {
      ...talent,
      basic: {
        current: baseCurrent,
        goal: baseCurrent > basicGoal ? baseCurrent : basicGoal
      },
      dodge: {
        current: dodgeCurrent,
        goal: dodgeCurrent > dodgeGoal ? dodgeCurrent : dodgeGoal
      },
      assist: {
        current: assistCurrent,
        goal: assistCurrent > assistGoal ? assistCurrent : assistGoal
      },
      special: {
        current: specialCurrent,
        goal: specialCurrent > specialGoal ? specialCurrent : specialGoal
      },
      chain: {
        current: chainCurrent,
        goal: chainCurrent > chainGoal ? chainCurrent : chainGoal
      },
      core: {
        current: coreCurrent,
        goal: coreCurrent > coreGoal ? coreCurrent : coreGoal
      }
    };
    await addGoal(talentNew);
  };
  const batchUpdateTrace = async (all, basicGoal = 11, dodgeGoal = 11, assistGoal = 11, specialGoal = 11, chainGoal = 11, coreGoal = 6) => {
    if (coreGoal > 6) {
      coreGoal = 6;
    }
    await batchUpdateGoals(
      "talent",
      "character",
      // 天赋目标用character字段标识
      (trace) => updateTrace(trace, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal),
      all
    );
  };
  const batchUpdateCharacter = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "character",
      "character",
      // 角色目标用character字段标识
      updateCharacter,
      all,
      characterStatusGoal
    ).then(() => {
      console.log("角色更新完成");
    });
  };
  const batchUpdateWeapon = async (all, characterStatusGoal) => {
    batchUpdateGoals(
      "weapon",
      "weapon",
      // 武器目标用weapon字段标识
      (weapon) => updateCharacter(weapon, characterStatusGoal),
      all,
      characterStatusGoal
    ).then(() => {
      console.log("武器更新完成");
    });
  };
  class ZzzAdapter extends BaseAdapter {
    constructor() {
      super(...arguments);
      __publicField(this, "batchUpdateTalent", (all, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal) => {
        batchUpdateTrace(all, basicGoal, dodgeGoal, assistGoal, specialGoal, chainGoal, coreGoal);
      });
      __publicField(this, "getInactiveConfig", () => {
        const ZZZ_INACTIVE_CONFIG = [
          { type: "character", identifierKey: "character" },
          // 角色目标
          {
            type: "talent",
            identifierKey: "character",
            isTalent: true,
            talentKeys: ["basic", "dodge", "assist", "special", "chain", "core"]
          },
          // 天赋目标
          { type: "weapon", identifierKey: "id" }
          // 武器目标（标识键为 id）
        ];
        return ZZZ_INACTIVE_CONFIG;
      });
      // 1 分钟节流（避免频繁打米游社 avatar_calc；独立 key 不干扰 GI/HSR）；prefetched = 角色同步已拉取详情，复用跳过 list/detail
      __publicField(this, "batchUpdateInventory", async (uid, region, prefetched) => {
        const cfg = this.getApiConfig();
        return withThrottle("zzz-last-sync", "ZZZ 素材同步", (u, r) => batchUpdateInventoryZZZ(u, r, cfg, prefetched), uid, region);
      });
    }
    getGameName() {
      return GameType.ZZZ;
    }
    getApiConfig() {
      return {
        calcPageUrl: ZZZ_CALC_PAGE_URL,
        roleUrl: ZZZ_ROLE_URL,
        charactersUrl: ZZZ_CHARACTERS_URL,
        charactersDetailUrl: ZZZ_CHARACTERS_DETAIL_URL,
        computeUrl: ZZZ_CALC_URL
      };
    }
    async getCharacterDetails(uid, region) {
      return getDetailList(uid, region, this.getApiConfig());
    }
    async syncCharacters(res) {
      console.group("返回数据");
      console.groupCollapsed("角色");
      console.table(res.map((a) => a.avatar));
      console.groupEnd();
      console.groupCollapsed("光锥");
      console.table(res.map((a) => a.weapon));
      console.groupEnd();
      console.groupCollapsed("角色天赋");
      res.forEach((c) => {
        const name = c.avatar.name_mi18n;
        console.groupCollapsed(name);
        console.table(c.avatar.skills);
        console.groupEnd();
      });
      console.groupEnd();
      console.groupEnd();
      for (let v of res) {
        await addCharacter(v);
      }
    }
    importSeelieMethods() {
      return { batchUpdateCharacter, batchUpdateWeapon };
    }
    getCharacterStatusList() {
      return characterStatusList;
    }
  }
  class AdapterManager {
    static init() {
      this.adapters.set(GameType.GENSHIN, new GenshinAdapter());
      this.adapters.set(GameType.HSR, new HsrAdapter());
      this.adapters.set(GameType.ZZZ, new ZzzAdapter());
      this.detectCurrentGame();
    }
    // 新增：根据域名检测当前游戏
    static detectCurrentGame() {
      const hostname = window.location.hostname;
      console.log("当前域名: %s", hostname);
      for (const [domain, gameType] of Object.entries(GameDomainMap)) {
        if (hostname.includes(domain)) {
          this.currentGame = gameType;
          return;
        }
      }
      this.currentGame = GameType.GENSHIN;
    }
    // 获取当前域名对应的适配器
    static getCurrentAdapter() {
      return this.getAdapter(this.currentGame);
    }
    // 获取当前游戏类型
    static getCurrentGameType() {
      return this.currentGame;
    }
    static getAdapter(gameType) {
      const adapter = this.adapters.get(gameType);
      if (!adapter) {
        throw new Error(`未找到游戏 ${gameType} 的适配器`);
      }
      return adapter;
    }
    static getSupportedGames() {
      return Array.from(this.adapters.entries()).map(([type, adapter]) => ({
        type,
        name: adapter.getGameName()
      }));
    }
  }
  __publicField(AdapterManager, "adapters", /* @__PURE__ */ new Map());
  __publicField(AdapterManager, "currentGame");
  AdapterManager.init();
  function CharacterGoalTab(props) {
    const {
      showText,
      batchUpdateCharacter: batchUpdateCharacter2
    } = props;
    const [selectAllRoles, setSelectAllRoles] = require$$1.useState(() => true);
    const characterStatusList2 = AdapterManager.getCurrentAdapter().getCharacterStatusList();
    const optionList = characterStatusList2.slice(0).reverse();
    const [characterLevelGoal, setCharacterLevelGoal] = require$$1.useState(() => optionList[0]);
    const batchSetCharacterGoalLevel = () => {
      batchUpdateCharacter2(!selectAllRoles, characterLevelGoal);
    };
    return /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        className: "flex pt-4",
        children: /* @__PURE__ */ jsx(ToggleSwitch, {
          className: "w-full",
          checked: selectAllRoles,
          onChange: setSelectAllRoles,
          labelLeft: `全部${showText}`,
          labelRight: `仅激活${showText}`
        })
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex pt-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "w-1/2 text-white-900",
          children: [showText, "目标等级:"]
        }), /* @__PURE__ */ jsx("div", {
          className: "w-1/2",
          children: /* @__PURE__ */ jsx(ListboxSelect, {
            selected: characterLevelGoal,
            setSelected: setCharacterLevelGoal,
            optionList,
            show: (characterStatus) => `${characterStatus.text.replace("A", "破")}`
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "flex pt-2",
        children: /* @__PURE__ */ jsx("div", {
          className: "w-full",
          children: /* @__PURE__ */ jsxs("button", {
            className: "text-white bg-blue-500 px-4 py-2",
            onClick: batchSetCharacterGoalLevel,
            children: ["批量设置", showText, "目标等级"]
          })
        })
      })]
    });
  }
  const TALENT_CONFIG = {
    [GameType.GENSHIN]: {
      talentTypes: ["normal", "skill", "burst"],
      // 原神天赋类型
      labels: ["普通攻击", "元素战技", "元素爆发"],
      // 对应标签
      maxLevel: 10,
      // 原神天赋最大等级
      extraTypes: []
      // 原神无忆灵/欢愉技
    },
    [GameType.HSR]: {
      talentTypes: ["normal", "skill", "burst", "t"],
      // HSR行迹类型
      labels: ["普通攻击", "战技", "终结技", "天赋"],
      // HSR标签
      maxLevel: 10,
      // HSR行迹最大等级
      // 勾选即批量设目标为该技能上限；仅对确实拥有该类型的角色生效
      extraTypes: [{
        key: "pet_skill",
        label: "忆灵技",
        max: 6
      }, {
        key: "pet_talent",
        label: "忆灵天赋",
        max: 6
      }, {
        key: "elation_skill",
        label: "欢愉技",
        max: 10
      }]
    },
    [GameType.ZZZ]: {
      talentTypes: ["basic", "dodge", "assist", "special", "chain", "core"],
      // ZZZ技能类型
      labels: ["普通攻击", "闪避技", "支援技", "特殊技", "连携技", "核心被动"],
      // ZZZ标签
      maxLevel: 12,
      // ZZZ技能最大等级
      extraTypes: []
      // ZZZ无忆灵/欢愉技
    }
  };
  function TalentGoalTab() {
    const currentGame = AdapterManager.getCurrentGameType();
    const config = TALENT_CONFIG[currentGame] || TALENT_CONFIG[GameType.GENSHIN];
    const {
      talentTypes,
      labels,
      maxLevel,
      extraTypes
    } = config;
    const safeExtra = extraTypes || [];
    const [talentGoalLevel, setTalentGoalLevel] = require$$1.useState(Object.fromEntries(talentTypes.map((type) => [type, maxLevel - 1])));
    const [selectAllRoles, setSelectAllRoles] = require$$1.useState(true);
    const [extraChecked, setExtraChecked] = require$$1.useState(Object.fromEntries((extraTypes || []).map((e) => [e.key, true])));
    const talentLevels = Array.from({
      length: maxLevel
    }, (_, i) => i + 1).reverse();
    const handleBatchUpdate = () => {
      const levels = talentTypes.map((type) => talentGoalLevel[type]);
      const extra = safeExtra.map((e) => extraChecked[e.key] ? e.max : 0);
      AdapterManager.getCurrentAdapter().batchUpdateTalent(!selectAllRoles, ...levels, ...extra);
    };
    return /* @__PURE__ */ jsxs("div", {
      children: [" ", /* @__PURE__ */ jsxs("div", {
        className: "flex pt-4",
        children: [" ", /* @__PURE__ */ jsx(ToggleSwitch, {
          className: "w-full",
          checked: selectAllRoles,
          onChange: setSelectAllRoles,
          labelLeft: "全部角色",
          labelRight: "仅激活角色"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "grid grid-rows-2 grid-flow-col gap-2",
        children: [" ", talentTypes.map((type, index) => /* @__PURE__ */ jsxs("div", {
          className: "flex ex-flex-col items-center",
          children: [/* @__PURE__ */ jsx("label", {
            className: "mt-10",
            children: labels[index]
          }), " ", /* @__PURE__ */ jsx(ListboxSelect, {
            selected: talentGoalLevel[type],
            setSelected: (num) => setTalentGoalLevel({
              ...talentGoalLevel,
              [type]: num
            }),
            optionList: talentLevels,
            show: (num) => `${num}`
          })]
        }, type))]
      }), safeExtra.length > 0 && /* @__PURE__ */ jsxs("div", {
        className: "flex flex-wrap items-center gap-4 pt-2",
        children: [/* @__PURE__ */ jsx("span", {
          className: "text-sm",
          children: "忆灵/欢愉（勾选=批量设上限）："
        }), safeExtra.map((e) => /* @__PURE__ */ jsxs("label", {
          className: "flex items-center gap-1 text-sm",
          children: [/* @__PURE__ */ jsx("input", {
            type: "checkbox",
            checked: !!extraChecked[e.key],
            onChange: (ev) => setExtraChecked((prev) => ({
              ...prev,
              [e.key]: ev.target.checked
            }))
          }), e.label, "(max ", e.max, ")"]
        }, e.key))]
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex pt-2",
        children: [" ", /* @__PURE__ */ jsxs("div", {
          className: "w-full",
          children: [" ", /* @__PURE__ */ jsx("button", {
            onClick: handleBatchUpdate,
            className: "text-white bg-blue-500 px-4 py-2",
            children: "批量设置角色目标技能"
          })]
        })]
      })]
    });
  }
  function ExDialog({
    onClose
  }) {
    const currentAdapter = AdapterManager.getCurrentAdapter();
    require$$1.useEffect(() => {
      console.log(`当前游戏：${currentAdapter.getGameName()}`);
    }, [currentAdapter]);
    const [accountList, setAccountList] = require$$1.useState([]);
    const [currentAccount, setCurrentAccount] = require$$1.useState();
    const [isFirstPanelOpen, setIsFirstPanelOpen] = require$$1.useState(false);
    const [isSecondPanelOpen, setIsSecondPanelOpen] = require$$1.useState(false);
    const [activeTab, setActiveTab] = require$$1.useState(0);
    const [loading, setLoading] = require$$1.useState(false);
    const [progress, setProgress] = require$$1.useState(0);
    const [progressText, setProgressText] = require$$1.useState("");
    const panelRefs = [require$$1.useRef(null), require$$1.useRef(null)];
    const dialogRef = require$$1.useRef(null);
    require$$1.useEffect(() => {
      const handleClickOutside = (e) => {
        if (panelRefs[0].current && !panelRefs[0].current.contains(e.target) && isFirstPanelOpen) {
          setIsFirstPanelOpen(false);
        }
        if (panelRefs[1].current && !panelRefs[1].current.contains(e.target) && isSecondPanelOpen) {
          setIsSecondPanelOpen(false);
        }
      };
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, [isFirstPanelOpen, isSecondPanelOpen]);
    const handleMouseLeave = () => {
      setIsFirstPanelOpen(false);
      setIsSecondPanelOpen(false);
    };
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
      currentAdapter.getAccounts().then((res) => {
        const roles = res;
        setAccountList(roles);
        roles.length > 0 && setCurrentAccount(roles[0]);
      }).catch((err) => {
        console.error(err);
        console.error("账户信息获取失败");
        alert("账户信息获取失败");
      });
    };
    const syncAll = async () => {
      if (!currentAccount) {
        console.error("账户信息获取失败");
        alert("账户信息获取失败");
        return;
      }
      resetLoginFlag();
      resetSyncRequestCount();
      const {
        game_uid,
        region
      } = currentAccount;
      console.log("开始同步（角色信息 + 素材/库存）");
      setLoading(true);
      setProgress(5);
      setProgressText("正在获取角色详情...");
      let progressInterval = null;
      try {
        const res = await currentAdapter.getCharacterDetails(game_uid, region);
        setProgress(30);
        setProgressText("正在写入角色/天赋目标...");
        progressInterval = setInterval(() => {
          setProgress((prev) => {
            if (prev < 85)
              return prev + 2;
            return prev;
          });
        }, 3e3);
        currentAdapter.syncCharacters(res);
        setProgress(40);
        setProgressText("角色目标写入完成，正在同步素材/库存...");
        const invRes = await currentAdapter.batchUpdateInventory(game_uid, region, res);
        if (progressInterval) {
          clearInterval(progressInterval);
          progressInterval = null;
        }
        setProgress(100);
        setProgressText("同步完成");
        const skipped = invRes && invRes.skipped;
        console.log("素材/库存同步结果:", invRes);
        console.log(`[请求计数] 本次同步共发起 ${getSyncRequestCount()} 个 HTTP 请求`);
        console.log("米游社数据无法判断是否突破,请自行比较整数等级是否已突破");
        alert(skipped ? `角色信息已同步
（素材/库存同步暂不支持当前游戏：${invRes.reason || ""}）` : "同步完毕（角色信息 + 素材/库存）");
        location.reload();
      } catch (err) {
        if (progressInterval) {
          clearInterval(progressInterval);
        }
        console.error("同步失败:", err);
        console.log(`[请求计数] 同步中断前已发起 ${getSyncRequestCount()} 个 HTTP 请求`);
        alert("同步失败：" + (err?.message || err));
      } finally {
        setLoading(false);
        setProgress(0);
        setProgressText("");
      }
    };
    function classNames2(...classes) {
      return classes.filter(Boolean).join(" ");
    }
    return /* @__PURE__ */ jsxs("div", {
      ref: dialogRef,
      className: "fixed top-10 inset-x-[20%] mx-auto min-w-[50%] min-h-min rounded-md bg-slate-800/90 text-white text-center z-[1200] shadow-2xl",
      onMouseLeave: handleMouseLeave,
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center justify-between px-4 pt-4",
        children: [/* @__PURE__ */ jsx("h1", {
          className: "text-3xl font-bold underline text-white",
          children: "SeelieEX"
        }), /* @__PURE__ */ jsx("button", {
          className: "text-white text-2xl leading-none hover:text-gray-300",
          onClick: onClose,
          "aria-label": "关闭",
          children: "×"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "w-full p-4",
        children: /* @__PURE__ */ jsxs("div", {
          className: "w-full max-w-md p-2 mx-auto bg-purple-900/30 rounded-2xl border border-purple-700/50",
          children: [/* @__PURE__ */ jsxs("div", {
            ref: panelRefs[0],
            className: "mt-2 border border-gray-700 rounded-lg bg-slate-700/50",
            children: [/* @__PURE__ */ jsxs("button", {
              className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors",
              onClick: () => setIsFirstPanelOpen(!isFirstPanelOpen),
              children: [/* @__PURE__ */ jsx("span", {
                children: "同步"
              }), /* @__PURE__ */ jsx("svg", {
                className: `w-5 h-5 text-purple-300 transition-transform ${isFirstPanelOpen ? "transform rotate-180" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M19 9l-7 7-7-7"
                })
              })]
            }), isFirstPanelOpen && /* @__PURE__ */ jsxs("div", {
              className: "px-4 pt-4 pb-2 text-sm text-gray-100",
              children: [/* @__PURE__ */ jsx("div", {
                className: "flex pt-2",
                children: /* @__PURE__ */ jsx("div", {
                  className: "w-full",
                  children: /* @__PURE__ */ jsx("button", {
                    className: "text-white bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition-colors",
                    onClick: getAccountList,
                    children: "获取账户信息"
                  })
                })
              }), /* @__PURE__ */ jsxs("div", {
                className: "flex pt-4",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "w-1/2 text-gray-200",
                  children: "账户选择:"
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
                    className: `px-4 py-2 rounded transition-colors ${loading ? "text-gray-300 bg-gray-600 cursor-not-allowed" : "text-white bg-blue-600 hover:bg-blue-500"}`,
                    onClick: syncAll,
                    disabled: loading,
                    children: loading ? "同步中..." : "同步"
                  })
                })
              }), loading && /* @__PURE__ */ jsxs("div", {
                className: "mt-3",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "w-full bg-gray-700 rounded-full h-2.5",
                  children: /* @__PURE__ */ jsx("div", {
                    className: "bg-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out",
                    style: {
                      width: `${progress}%`
                    }
                  })
                }), /* @__PURE__ */ jsx("p", {
                  className: "text-xs text-gray-300 mt-1",
                  children: progressText
                })]
              })]
            })]
          }), /* @__PURE__ */ jsxs("div", {
            ref: panelRefs[1],
            className: "mt-2 border border-gray-700 rounded-lg bg-slate-700/50",
            children: [/* @__PURE__ */ jsxs("button", {
              className: "flex justify-between w-full px-4 py-2 text-sm font-medium text-left text-white bg-purple-800/70 rounded-lg hover:bg-purple-700 focus:outline-none transition-colors",
              onClick: () => setIsSecondPanelOpen(!isSecondPanelOpen),
              children: [/* @__PURE__ */ jsx("span", {
                children: "规划批量操作"
              }), /* @__PURE__ */ jsx("svg", {
                className: `w-5 h-5 text-purple-300 transition-transform ${isSecondPanelOpen ? "transform rotate-180" : ""}`,
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx("path", {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: 2,
                  d: "M19 9l-7 7-7-7"
                })
              })]
            }), isSecondPanelOpen && /* @__PURE__ */ jsx("div", {
              className: "px-4 pt-4 pb-2 text-sm text-gray-100",
              children: /* @__PURE__ */ jsxs("div", {
                className: "mt-4",
                children: [/* @__PURE__ */ jsx("div", {
                  className: "flex border-b border-gray-600",
                  children: ["角色目标等级", "天赋目标等级", "武器目标等级"].map((title, idx) => /* @__PURE__ */ jsx("button", {
                    className: classNames2("px-4 py-2 focus:outline-none transition-colors", activeTab === idx ? "border-b-2 border-blue-400 text-blue-300 font-medium" : "text-gray-300 hover:text-white"),
                    onClick: () => setActiveTab(idx),
                    children: title
                  }, idx))
                }), /* @__PURE__ */ jsxs("div", {
                  className: "p-4",
                  children: [activeTab === 0 && /* @__PURE__ */ jsx(CharacterGoalTab, {
                    showText: "角色",
                    batchUpdateCharacter: currentAdapter.batchUpdateCharacter
                  }), activeTab === 1 && /* @__PURE__ */ jsx(TalentGoalTab, {}), activeTab === 2 && /* @__PURE__ */ jsx(CharacterGoalTab, {
                    showText: "武器",
                    batchUpdateCharacter: currentAdapter.batchUpdateWeapon
                  })]
                })]
              })
            })]
          })]
        })
      })]
    });
  }
  function App() {
    const [showExDialog, setShowExDialog] = require$$1.useState(() => false);
    require$$1.useEffect(() => {
      GM_registerMenuCommand("打开SeelieEx", () => setShowExDialog(true));
      GM_registerMenuCommand("原神祈愿历史一览", () => GM_openInTab("https://genshin-gacha-banners.52v6.com"));
      GM_registerMenuCommand("意见反馈", () => GM_openInTab("https://github.com/KeyPJ/seelieEx/issues"));
    });
    return /* @__PURE__ */ jsx("div", {
      className: "App",
      style: {
        display: showExDialog ? "" : "none"
      },
      children: /* @__PURE__ */ jsx(ExDialog, {
        onClose: () => setShowExDialog(false)
      })
    });
  }
  let seelieEx = document.createElement("div");
  seelieEx.id = "seelieEx";
  seelieEx.className = "flex";
  document.getElementById("app")?.parentElement?.append(seelieEx);
  ReactDOM2.render(/* @__PURE__ */ jsx(require$$1.StrictMode, {
    children: /* @__PURE__ */ jsx(App, {})
  }), document.getElementById("seelieEx"));
})(React, ReactDOM, localforage);
