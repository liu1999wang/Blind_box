(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/coverChip/index"],{"3bc3":function(t,n,e){"use strict";e.r(n);var i=e("a3d8"),u=e.n(i);for(var o in i)"default"!==o&&function(t){e.d(n,t,(function(){return i[t]}))}(o);n["default"]=u.a},"7b6f":function(t,n,e){"use strict";e.r(n);var i=e("f9e6"),u=e("3bc3");for(var o in u)"default"!==o&&function(t){e.d(n,t,(function(){return u[t]}))}(o);e("c7a2");var c,a=e("f0c5"),r=Object(a["a"])(u["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],c);n["default"]=r.exports},a3d8:function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={components:{},data:function(){return{skuId:"",info:{}}},onLoad:function(t){this.skuId=t.sku_id},onShow:function(){var n=this;t.showLoading({title:"加载中"}),this.$http("/cover-chip/info","POST",{sku_id:this.skuId}).then((function(e){n.info=e.data,t.hideLoading()}))},methods:{submitCover:function(){t.showLoading({title:"兑换中，请稍候"}),this.$http("/cover-chip","POST",{sku_id:this.skuId}).then((function(n){t.showToast({title:"兑换成功，即将跳转~",icon:"none"}),setTimeout((function(){t.redirectTo({url:"/pages/myChip/index"})}),1300)}))}}};n.default=e}).call(this,e("543d")["default"])},ba04:function(t,n,e){"use strict";(function(t){e("e335");i(e("66fd"));var n=i(e("7b6f"));function i(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=e,t(n.default)}).call(this,e("543d")["createPage"])},c7a2:function(t,n,e){"use strict";var i=e("e769"),u=e.n(i);u.a},e769:function(t,n,e){},f9e6:function(t,n,e){"use strict";var i;e.d(n,"b",(function(){return u})),e.d(n,"c",(function(){return o})),e.d(n,"a",(function(){return i}));var u=function(){var t=this,n=t.$createElement;t._self._c},o=[]}},[["ba04","common/runtime","common/vendor"]]]);