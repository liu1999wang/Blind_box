(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/resale/detail"],{"214e":function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return i}));var i={PriceDisplay:function(){return n.e("components/PriceDisplay/PriceDisplay").then(n.bind(null,"5f805"))}},o=function(){var t=this,e=t.$createElement,n=(t._self._c,t.info.id?t.$tool.showShortTime(t.info.created_at):null);t.$mp.data=Object.assign({},{$root:{g0:n}})},r=[]},"2ed0":function(t,e,n){"use strict";var i=n("3e3e"),o=n.n(i);o.a},"3e3e":function(t,e,n){},"431f":function(t,e,n){},"486a":function(t,e,n){"use strict";n.r(e);var i=n("b7b9"),o=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,(function(){return i[t]}))}(r);e["default"]=o.a},"5fd8":function(t,e,n){"use strict";n.r(e);var i=n("214e"),o=n("486a");for(var r in o)"default"!==r&&function(t){n.d(e,t,(function(){return o[t]}))}(r);n("7db4"),n("2ed0");var a,u=n("f0c5"),c=Object(u["a"])(o["default"],i["b"],i["c"],!1,null,"18281c50",null,!1,i["a"],a);e["default"]=c.exports},"7db4":function(t,e,n){"use strict";var i=n("431f"),o=n.n(i);o.a},b7b9:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=o(n("e65f"));function o(t){return t&&t.__esModule?t:{default:t}}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);e&&(i=i.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,i)}return n}function a(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach((function(e){u(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function u(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var c={components:{},data:function(){return{uuid:"",info:{user:{}},user:{}}},filters:{},computed:{skus:function(){return this.info.package_skus||[]},sku:function(){return this.info.package_skus&&this.info.package_skus[0]||{}},share:function(){return{title:this.info.user.name+"向你转售了一个商品，快来看看吧~"}},detailImages:function(){return this.sku.detail_images}},onLoad:function(t){this.uuid=t.uuid},onShow:function(){this.initData()},methods:{initData:function(){var t=this;this.$http("/asset/resales/".concat(this.uuid)).then((function(e){t.info=e.data.info,t.user=e.data.info.user}))},buy:function(){var e=this;t.showLoading({title:"购买中"}),this.$http("/asset/resale-order/confirm","POST",{resale_id:this.info.id}).then((function(n){t.hideLoading();var o=n.data;n.data.is_need_pay?i.default.pay(a(a({},o),{},{success:function(){e.initData(),t.showToast({title:"购买成功，即将跳转~",icon:"none"}),setTimeout((function(e){t.redirectTo({url:"/pages/myBox/index"})}),1500)},fail:function(){t.showToast({title:"支付失败",icon:"none"}),e.$http("/orders/".concat(o.order.uuid),"PUT",{type:"close_and_delete"})}})):(t.showToast({title:"购买成功~",icon:"none"}),e.initData())}))},cancel:function(){var e=this;t.showModal({title:"提示",content:"确认要取消此转售吗?",success:function(n){n.confirm&&(t.showLoading({title:"取消中"}),e.$http("/asset/resales/".concat(e.uuid),"PUT",{type:"close"}).then((function(n){t.hideLoading(),t.showToast({title:"取消成功~",icon:"none"}),e.initData()})))}})},toResaleIndex:function(){t.navigateTo({url:"/pages/resale/index"})}}};e.default=c}).call(this,n("543d")["default"])},c57b:function(t,e,n){"use strict";(function(t){n("e335");i(n("66fd"));var e=i(n("5fd8"));function i(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])}},[["c57b","common/runtime","common/vendor"]]]);