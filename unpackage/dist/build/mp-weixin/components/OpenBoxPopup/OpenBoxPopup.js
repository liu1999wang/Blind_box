(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/OpenBoxPopup/OpenBoxPopup"],{"12b2":function(t,e,n){},4391:function(t,e,n){"use strict";n.r(e);var i=n("f2c3"),o=n.n(i);for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);e["default"]=o.a},"9bc4":function(t,e,n){"use strict";var i=n("12b2"),o=n.n(i);o.a},bcdd:function(t,e,n){"use strict";n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return i}));var i={ReturnSalePopup:function(){return n.e("components/ReturnSalePopup/ReturnSalePopup").then(n.bind(null,"ac0f"))}},o=function(){var t=this,e=t.$createElement;t._self._c;t._isMounted||(t.e0=function(e){t.isShowReturnSale=!1},t.e1=function(e){t.isReturnSaleSuccess=!0})},a=[]},d494:function(t,e,n){"use strict";n.r(e);var i=n("bcdd"),o=n("4391");for(var a in o)"default"!==a&&function(t){n.d(e,t,(function(){return o[t]}))}(a);n("9bc4");var u,r=n("f0c5"),s=Object(r["a"])(o["default"],i["b"],i["c"],!1,null,"a4b511e0",null,!1,i["a"],u);e["default"]=s.exports},f2c3:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var n={props:{boxImg:String,boxImgMode:String,buttonTitle:String,order:Object,tryMode:Boolean,tryInfo:Object,isNavbarEnable:!1,config:Object},data:function(){return{isOpen:!1,showResult:!1,status:0,isShowReturnSale:!1,isReturnSaleSuccess:!1,package:{},defaultBoxImage:"https://cdn2.hquesoft.com/box/openbox.png",isNotOpen:!1}},mounted:function(){this.initData()},computed:{skus:function(){return this.package.skus||[]},orderConfig:function(){return this.$store.getters.setting.order},rewardJikaTimes:function(){return this.package.reward&&this.package.reward.jika_times},rewardLotteryTicket:function(){return this.package.reward&&this.package.reward.lottery_ticket}},methods:{initData:function(){var t=this;this.tryMode?this.$http("/try/packages/".concat(this.tryInfo.package_uuid)).then((function(e){t.package=e.data,t.startOpenAnimate()})):this.$http("/asset/package?order_id=".concat(this.order.id)).then((function(e){t.package=e.data,t.startOpenAnimate()})).catch((function(e){t.isNotOpen=!0}))},startOpenAnimate:function(){var t=this;this.config&&"none"==this.config.animation_mode?(this.status=1,setTimeout((function(){t.isOpen=!0,t.$playAudio("open"),setTimeout((function(){t.showResult=!0}),800)}),400)):(setTimeout((function(){}),500),setTimeout((function(){t.status=1,setTimeout((function(){t.isOpen=!0,t.$playAudio("open"),setTimeout((function(){t.showResult=!0}),1100)}),400)}),2500))},handleRefresh:function(){this.isNotOpen=!1,this.initData()},goLotteryDetail:function(){t.navigateTo({url:"/pages/lottery/detail?uuid="+this.rewardLotteryTicket.uuid})},goJikaDetail:function(){t.navigateTo({url:"/pages/jika/detail?uuid="+this.rewardJikaTimes.uuid})},returnSale:function(){t.navigateTo({url:"/pages/myBox/index"})},handleOk:function(){t.redirectTo({url:"/pages/myBox/index"})},goBack:function(){t.navigateBack({delta:1})},close:function(){this.$emit("close"),this.$emit("refresh")},checkSku:function(e){"score"===e.sku_type?t.navigateTo({url:"/pages/myScore/index"}):"coupon"===e.sku_type?t.navigateTo({url:"/pages/myCoupons/index"}):"redpack"===e.sku_type?t.navigateTo({url:"/pages/myRedpack/index"}):console.log(e)}}};e.default=n}).call(this,n("543d")["default"])}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/OpenBoxPopup/OpenBoxPopup-create-component',
    {
        'components/OpenBoxPopup/OpenBoxPopup-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("d494"))
        })
    },
    [['components/OpenBoxPopup/OpenBoxPopup-create-component']]
]);
