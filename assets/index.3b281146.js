const c=function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))a(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const n of o.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&a(n)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerpolicy&&(o.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?o.credentials="include":e.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function a(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}};c();require("choo/html");const l=require("choo-devtools"),b=require("choo"),m=require("./app/store.js"),f=require("./app/views/spirals.js"),d=require("insert-css"),s=require("./app/util/keymaps.js");d(`.styled-background {
  background-color: #f00 !important;
  background: rgba(0, 255, 255, 0.5) !important;
  mix-blend-mode: difference;
}

.CodeMirror-scroll {
  max-height: 300px;
}

.CodeMirror-line span {
  pointer-events: all;
 /* background: #fff;
  padding: 2px;*/
}
  `);const t=b({hash:!0});t.use(l());t.use(m);t.use(s);t.route("/",f);t.route("/spirals",f);t.route("*",f);t.mount("#choo");
