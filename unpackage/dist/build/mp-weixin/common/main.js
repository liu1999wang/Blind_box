(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["common/main"],{"0141":function(t,e,o){"use strict";var n=o("325f"),r=o.n(n);r.a},"325f":function(t,e,o){},"520b":function(t,e,o){"use strict";(function(t,e){o("e335");var n=d(o("66fd")),r=d(o("f55e")),u=d(o("da58")),a=d(o("6f4b")),i=d(o("c010")),c=d(o("33ea")),l=d(o("ca7a")),f=d(o("2ff0")),p=d(o("a6b4"));function d(t){return t&&t.__esModule?t:{default:t}}function s(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function y(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?s(Object(o),!0).forEach((function(e){b(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}function b(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}wx.__webpack_require_UNI_MP_PLUGIN__=o,n.default.mixin(l.default),n.default.mixin(f.default);var m=function(){Promise.all([o.e("common/vendor"),o.e("components/TabBar/tabBar")]).then(function(){return resolve(o("ab81"))}.bind(null,o)).catch(o.oe)};n.default.component("tab-bar",m),n.default.prototype.$api=p.default;var h=o("f85d");n.default.prototype.$upload=h;var v=o("3503");n.default.prototype.$navigator=v;var g=o("7b11");n.default.prototype.$visitor=g,n.default.prototype.$tool=i.default,n.default.prototype.$device=c.default,n.default.prototype.$store=a.default,n.default.prototype.$http=u.default,n.default.config.productionTip=!1,n.default.prototype.$showPullRefresh=function(){return t.showLoading({title:"刷新中"}),setTimeout((function(e){t.stopPullDownRefresh()}),200),setTimeout((function(e){t.hideLoading()}),500),a.default.dispatch("getSetting")};var $={click:"https://cdn2.hquesoft.com/box/audio/click.mp3",check:"https://cdn2.hquesoft.com/box/audio/check.mp3",yao:"https://cdn2.hquesoft.com/box/audio/yao.mp3",open:"https://cdn2.hquesoft.com/box/audio/open.mp3"},O={click:null,check:null,yao:null,open:null};setTimeout((function(){for(var e in $)O[e]=t.createInnerAudioContext(),O[e].src=$[e]}),800),n.default.prototype.$playAudio=function(e){O[e]||(O[e]=t.createInnerAudioContext(),O[e].src=$[e]||e),O[e].play()};var w=null;n.default.prototype.$playBgm=function(e,o){w||(w=t.createInnerAudioContext()),e&&(w.src=e,w.loop=!0),w.play(),a.default.dispatch("setIsBgmPlay",!0)},n.default.prototype.$stopBgm=function(){w&&w.stop(),a.default.dispatch("setIsBgmPlay",!1)},n.default.prototype.$switchBgm=function(){a.default.getters.isBgmPlay?n.default.prototype.$stopBgm():n.default.prototype.$playBgm()},r.default.mpType="app";var P=new n.default(y({store:a.default},r.default));e(P).$mount()}).call(this,o("543d")["default"],o("543d")["createApp"])},d343:function(t,e,o){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n=o("e005"),r=(o("ce58"),u(o("e009")));function u(t){return t&&t.__esModule?t:{default:t}}var a={onLaunch:function(t){var e=this;this.$store.dispatch("setEnterScene",t.scene),t.query&&t.query.inviter&&((0,n.$setStorage)("inviter",t.query.inviter),(0,n.$setStorage)("invite_node",t.query.invite_node)),this.$store.dispatch("getSetting"),setTimeout((function(){e.$store.dispatch("getSetting")}),500),setTimeout((function(){r.default.checkUpdate()}),2e3)},onShow:function(){console.log("App Show")},onHide:function(){console.log("App Hide")}};e.default=a},d48b:function(t,e,o){"use strict";o.r(e);var n=o("d343"),r=o.n(n);for(var u in n)"default"!==u&&function(t){o.d(e,t,(function(){return n[t]}))}(u);e["default"]=r.a},f55e:function(t,e,o){"use strict";o.r(e);var n=o("d48b");for(var r in n)"default"!==r&&function(t){o.d(e,t,(function(){return n[t]}))}(r);o("0141");var u,a,i,c,l=o("f0c5"),f=Object(l["a"])(n["default"],u,a,!1,null,null,null,!1,i,c);e["default"]=f.exports}},[["520b","common/runtime","common/vendor"]]]);