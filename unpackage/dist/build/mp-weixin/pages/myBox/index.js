(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/myBox/index"],{"088f":function(t,e,n){"use strict";(function(t){function i(t){return o(t)||a(t)||r(t)||s()}function s(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function r(t,e){if(t){if("string"===typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,e):void 0}}function a(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function o(t){if(Array.isArray(t))return c(t)}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var u=function(){Promise.all([n.e("common/vendor"),n.e("pages/myBox/components/PackageSku")]).then(function(){return resolve(n("91bb"))}.bind(null,n)).catch(n.oe)},l=function(){Promise.all([n.e("common/vendor"),n.e("pages/myBox/components/PayCard")]).then(function(){return resolve(n("784f"))}.bind(null,n)).catch(n.oe)},d={components:{PackageSku:u,PayCard:l},data:function(){return{order:{},reasons:[],visible:!1,dataList:[],current:0,currentUuid:"6056e83ef3251",currentItem:{},types:["pending","resale_pending","picked","all"],typeTextList:["待处理","转让中","已提货","全部"],isSelectMode:!1,selectType:"deliver",selectedIds:[],isShowPay:!1,isShowReturnSalePopup:!1,isShowResalePopup:!1,statusTotal:{},isReturnSaleSuccess:!1}},computed:{orderConfig:function(){return this.$store.getters.setting.order||{}},marketConfig:function(){return this.$store.getters.setting.market||{}},exchangeConfig:function(){return this.$store.getters.setting.exchange||{}}},onLoad:function(t){this.current=this.types.indexOf(t.status||"pending"),this.initData()},onShow:function(){this.refresh()},onUnload:function(){},methods:{hideResalePopup:function(){this.isShowResalePopup=!1},toPage:function(e){t.navigateTo({url:e})},successDeliver:function(e){this.cancelSelect(),"custom_gateway"===e.deliver_type?(this.refresh(),this.isShowPay=!1,t.showToast({title:"提交成功",icon:"none"})):(this.current=2,this.refresh(),this.isShowPay=!1,t.showModal({title:"发货成功",content:"已成功提交发货请求，请注意查收快递哦~"}))},selectAll:function(){if(!this.dataList[0])return!1;this.selectedIds=[];for(var t=0;t<this.dataList[0].list.length;t++){var e=this.dataList[0].list[t];"deliver"===this.selectType?"virtual_asset"===e.sku_type_text||e.is_presell||this.selectedIds.push(e.id):"return_sale"===this.selectType?!this.orderConfig.is_ban_return_sale&&"virtual_asset"!=e.sku_type_text&&e.is_return_saleable&&this.selectedIds.push(e.id):"resale"===this.selectType&&"virtual_asset"!=e.sku_type_text&&this.selectedIds.push(e.id)}},cancelSelect:function(){this.isSelectMode=!1,this.selectedIds=[]},selectOrSubmit:function(){if(this.isSelectMode){if(0==this.selectedIds.length)return t.showModal({title:"请选择物品",content:"选择一件或多件物品后才能提交发货哦~"}),!1;this.isShowPay=!0}else this.isSelectMode=!0},batchReturnSale:function(){var e=this;if(0==this.selectedIds.length)return t.showModal({title:"请选择物品",content:"选择一件或多件物品后才能分解哦~"}),!1;t.showModal({title:"确认分解",content:"确认要批量分解吗?",success:function(n){console.log(e.selectedIds),n.confirm&&(t.showLoading({title:"分解中..."}),e.$http("/asset/return-sale/confirm","post",{ids:e.selectedIds}).then((function(n){e.isReturnSaleSuccess=1,t.hideLoading(),e.refresh(),e.isSelectMode=!1})))}})},batchResale:function(){var e=this;if(0==this.selectedIds.length)return t.showModal({title:"请选择物品",content:"选择一件或多件物品后才能挂售哦~"}),!1;t.showModal({title:"确认挂售到交易市场",content:"统一以建议挂售价挂售到交易市场",success:function(n){n.confirm&&(t.showLoading({title:"挂售中..."}),e.$http("/market/resale/batch/confirm","post",{ids:e.selectedIds}).then((function(n){t.hideLoading(),e.refresh(),e.isSelectMode=!1,t.showToast({title:"转售成功，即将跳转~",icon:"none"}),setTimeout((function(e){t.navigateTo({url:"/pages/resale/index"})}),1500)})))}})},batchExchange:function(){return 0==this.selectedIds.length?(t.showModal({title:"请选择物品",content:"选择一件或多件物品后才能置换哦~"}),!1):this.selectedIds.length>=10?(t.showModal({title:"超出限制了",content:"单次置换限制在10件以内~"}),!1):(this.setStorage("exchange_package_sku_ids",this.selectedIds),void t.navigateTo({url:"/pages/exchange/productList"}))},enterSelectMode:function(t){this.selectedIds=[],this.isSelectMode=!0,this.selectType=t},checkItem:function(t){var e=this.selectedIds.indexOf(t.id);e>-1?this.selectedIds.splice(e,1):this.selectedIds.push(t.id)},refresh:function(){this.cleanData(),this.getOrderList(),this.initBoxTotalData()},scrolltolower:function(){this.dataList[this.current].page++,this.getOrderList()},initData:function(){var t=[];this.types.forEach((function(e){t.push({list:[],type:e,page:1,per_page:50,total:0,init:!1,loading:!1})})),this.dataList=t,console.log(t)},cleanData:function(){this.dataList.forEach((function(t){t.page=1,t.init=!1}))},initBoxTotalData:function(){var t=this;this.$http("/status-total/package-sku").then((function(e){t.statusTotal=e.data.info}))},visibleChange:function(){this.visible=!this.visible},actions:function(e){switch(e.action){case"返售":this.currentUuid=e.order.uuid,this.currentItem=e.order,this.isShowReturnSalePopup=!0;break;case"核销码":t.navigateTo({url:"/pages/orderCode/index?uuid="+e.order.uuid});break;case"查看订单":t.navigateTo({url:"/pages/orderDetail/index?uuid="+e.order.pick_order.uuid});break;case"转售":this.currentUuid=e.order.uuid,this.currentItem=e.order,this.isShowResalePopup=!0;break;default:break}},currentChange:function(t){var e=t.currentTarget.dataset.current;if(e!==this.current){this.current=e;var n=this.dataList[this.current];n.init||this.getOrderList()}},currentChange2:function(t){var e=t.detail.current;if(e!==this.current){this.current=e;var n=this.dataList[this.current];n.init||this.getOrderList()}},getOrderList:function(){var t=this.dataList[this.current];t.loading||(t.loading=!0,this.$http("/asset/package-skus","GET",{status:t.type,page:t.page,per_page:t.per_page}).then((function(e){var n;(t.loading=!1,1===e.data.current_page)?t.list=e.data.list:(n=t.list).push.apply(n,i(e.data.list));t.total=e.data.item_total,t.init=!0})))}}};e.default=d}).call(this,n("543d")["default"])},"310e":function(t,e,n){},"41d6":function(t,e,n){"use strict";n.r(e);var i=n("b7ce"),s=n("c83a");for(var r in s)"default"!==r&&function(t){n.d(e,t,(function(){return s[t]}))}(r);n("da35");var a,o=n("f0c5"),c=Object(o["a"])(s["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],a);e["default"]=c.exports},b7ce:function(t,e,n){"use strict";n.d(e,"b",(function(){return s})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return i}));var i={NoData:function(){return n.e("components/NoData/NoData").then(n.bind(null,"7ef1"))},ReturnSalePopup:function(){return n.e("components/ReturnSalePopup/ReturnSalePopup").then(n.bind(null,"ac0f"))},ResalePopup:function(){return n.e("components/ResalePopup/ResalePopup").then(n.bind(null,"e2a2"))}},s=function(){var t=this,e=t.$createElement,n=(t._self._c,t.__map(t.types,(function(e,n){var i=t.__get_orig(e),s=t.__map(t.dataList[n].list,(function(e,n){var i=t.__get_orig(e),s=t.selectedIds.indexOf(e.id);return{$orig:i,g0:s}}));return{$orig:i,l0:s}})));t._isMounted||(t.e0=function(e){t.isShowPay=!1},t.e1=function(e){t.isShowReturnSalePopup=!1},t.e2=function(e){t.isReturnSaleSuccess=!1},t.e3=function(e){e.stopPropagation(),t.isReturnSaleSuccess=!1}),t.$mp.data=Object.assign({},{$root:{l1:n}})},r=[]},c83a:function(t,e,n){"use strict";n.r(e);var i=n("088f"),s=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,(function(){return i[t]}))}(r);e["default"]=s.a},da35:function(t,e,n){"use strict";var i=n("310e"),s=n.n(i);s.a},e5ad:function(t,e,n){"use strict";(function(t){n("e335");i(n("66fd"));var e=i(n("41d6"));function i(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])}},[["e5ad","common/runtime","common/vendor"]]]);