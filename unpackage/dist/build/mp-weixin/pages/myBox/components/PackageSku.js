(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/myBox/components/PackageSku"],{"91bb":function(t,e,n){"use strict";n.r(e);var i=n("da75"),o=n("e713");for(var s in o)"default"!==s&&function(t){n.d(e,t,(function(){return o[t]}))}(s);n("e7ab");var r,u=n("f0c5"),a=Object(u["a"])(o["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],r);e["default"]=a.exports},c5c7:function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=o(n("2ff0"));function o(t){return t&&t.__esModule?t:{default:t}}var s=function(){n.e("pages/myBox/components/SkuInfo").then(function(){return resolve(n("5c51"))}.bind(null,n)).catch(n.oe)},r={mixins:[i.default],props:{order:{type:Object},isSelected:{type:Boolean},isSelectMode:{type:Boolean},selectType:{type:String}},components:{SkuInfo:s},data:function(){return{hours:"",minutes:"",seconds:"",closeTimeVisible:!1,timer:null}},computed:{info:function(){return this.order},orderConfig:function(){return this.$store.getters.setting.order||{}},marketConfig:function(){return this.$store.getters.setting.market||{}},isSelectable:function(){return"pending"===this.info.union_status&&("deliver"===this.selectType?"virtual_asset"!==this.info.sku_type_text&&!this.info.is_presell:"return_sale"!==this.selectType||this.isReturnSaleable)},isVirtualAsset:function(){return"virtual_asset"===this.info.sku_type_text},isReturnSaleable:function(){return this.orderConfig.is_return_sale_enable&&!this.isVirtualAsset&&this.info.is_return_saleable},isResaleable:function(){return!this.isVirtualAsset&&this.info.is_resaleable}},filters:{dateformat:function(t){return this.$tool.formatDate(t,"MM-dd hh:mm")}},created:function(){},destroyed:function(){},methods:{handleLock:function(){var e=this;t.showLoading({title:"转入中~",icon:"none"}),this.$http("/package-skus/".concat(this.info.uuid,"/lock"),"POST").then((function(n){t.showToast({title:"已转入保险箱~",icon:"none"}),e.$emit("refresh")}))},handleUnlock:function(){var e=this;t.showLoading({title:"解锁中~",icon:"none"}),this.$http("/package-skus/".concat(this.info.uuid,"/unlock"),"POST").then((function(n){t.showToast({title:"已解锁~",icon:"none"}),e.$emit("refresh")}))},handleVirtualAssetPick:function(){var e=this;t.showModal({title:"确认领取此奖品吗?",success:function(n){n.confirm&&e.$http("/package-skus/".concat(e.info.uuid,"/virtual-asset/pick"),"POST").then((function(n){t.showToast({title:"领取成功，即将跳转~",icon:"none"}),setTimeout((function(){t.navigateTo({url:"/pages/myBox/detail?uuid="+e.order.uuid})}),1500)}))}})},checkResaleDetail:function(){t.navigateTo({url:"/pages/resale/detail?uuid="+this.order.resale.uuid})},fillNumber:function(t){return t<10?"0"+t:t},handleClick:function(){if(this.isSelectMode)return"virtual_asset"!==this.order.sku_type_text&&(!!this.isSelectable&&(this.$emit("check"),!1));t.navigateTo({url:"/pages/myBox/detail?uuid="+this.order.uuid})},handleClick2:function(t){this.$emit("action",{order:this.order,action:t.currentTarget.dataset.type})},handleCheck:function(){this.$emit("check")},handleCoverChip:function(){t.navigateTo({url:"/pages/coverChip/index?sku_id="+this.order.skus[0].sku_id})}}};e.default=r}).call(this,n("543d")["default"])},da75:function(t,e,n){"use strict";var i;n.d(e,"b",(function(){return o})),n.d(e,"c",(function(){return s})),n.d(e,"a",(function(){return i}));var o=function(){var t=this,e=t.$createElement,n=(t._self._c,this.$tool.formatDate(t.order.created_at,"MM-dd hh:mm"));t.$mp.data=Object.assign({},{$root:{g0:n}})},s=[]},e713:function(t,e,n){"use strict";n.r(e);var i=n("c5c7"),o=n.n(i);for(var s in i)"default"!==s&&function(t){n.d(e,t,(function(){return i[t]}))}(s);e["default"]=o.a},e7ab:function(t,e,n){"use strict";var i=n("e7cb"),o=n.n(i);o.a},e7cb:function(t,e,n){}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/myBox/components/PackageSku-create-component',
    {
        'pages/myBox/components/PackageSku-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("91bb"))
        })
    },
    [['pages/myBox/components/PackageSku-create-component']]
]);
