(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/myAddress/index"],{"361d":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var s=n("9664"),i=function(){n.e("components/NoData/NoData").then(function(){return resolve(n("7ef1"))}.bind(null,n)).catch(n.oe)},a={components:{NoData:i},data:function(){return{list:[],select:!1,init:!1}},filters:{hidePhoneDetail:function(t){return t.substring(0,3)+"****"+t.substring(7,11)}},onLoad:function(t){t.select&&(this.select=!0)},onShow:function(){var e=this;t.showLoading({title:"加载中"}),(0,s.getAddressList)().then((function(n){e.list=n.data.addresses,e.init=!0,t.hideLoading()}))},methods:{fetchData:function(){var e=this;(0,s.getAddressList)().then((function(n){e.list=n.data.addresses,e.init=!0,t.hideLoading()}))},selectAddress:function(e){this.select&&(t.$emit("selectAddress",this.list[e.currentTarget.dataset.index]),t.navigateBack({delta:1}))},handleEdit:function(t){var e=t.currentTarget.dataset.index,n=this.list[e];this.$navigator.navigateTo({url:"/pages/setAddress/index?uuid=".concat(n.uuid)+"&consignee=".concat(n.consignee)+"&phone=".concat(n.phone)+"&province=".concat(n.province)+"&city=".concat(n.city)+"&district=".concat(n.district)+"&address=".concat(n.address)+"&tag=".concat(n.tag)+"&is_default=".concat(n.is_default)})},handleDelete:function(e){var n=this,i=e.currentTarget.dataset.index;t.showModal({title:"提示",content:"删除该收货地址?",success:function(e){e.confirm&&(t.showLoading({title:"加载中"}),(0,s.deleteAddress)(n.list[i].uuid).then((function(e){n.list.splice(i,1),t.hideLoading()})))}})},handleNewAddress:function(){t.navigateTo({url:"/pages/setAddress/index"})},$getAddress:function(t){console.log("main get address =======>"),my.authorize({scopes:"scope.addressList",success:function(e){my.tb.chooseAddress({addAddress:"show",searchAddress:"hide",locateAddress:"hide"},(function(e){t.success&&t.success(e)}),(function(e){t.fail&&t.fail(e)}))}})},handleImportAddress:function(){var e=this;t.chooseAddress({success:function(t){if(t.error)return!1;(0,s.createAddress)({consignee:t.userName,phone:t.telNumber,province:t.provinceName,city:t.cityName,district:t.countyName,address:t.detailInfo,tag:"",is_default:0}).then((function(t){e.fetchData()}))}})}}};e.default=a}).call(this,n("543d")["default"])},"5ca5":function(t,e,n){"use strict";n.d(e,"b",(function(){return i})),n.d(e,"c",(function(){return a})),n.d(e,"a",(function(){return s}));var s={NoData:function(){return n.e("components/NoData/NoData").then(n.bind(null,"7ef1"))}},i=function(){var t=this,e=t.$createElement,n=(t._self._c,t.__map(t.list,(function(e,n){var s=t.__get_orig(e),i=t._f("hidePhoneDetail")(e.phone);return{$orig:s,f0:i}})));t.$mp.data=Object.assign({},{$root:{l0:n}})},a=[]},"6d1c":function(t,e,n){},"996c":function(t,e,n){"use strict";(function(t){n("e335");s(n("66fd"));var e=s(n("e908"));function s(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},bf23:function(t,e,n){"use strict";n.r(e);var s=n("361d"),i=n.n(s);for(var a in s)"default"!==a&&function(t){n.d(e,t,(function(){return s[t]}))}(a);e["default"]=i.a},e908:function(t,e,n){"use strict";n.r(e);var s=n("5ca5"),i=n("bf23");for(var a in i)"default"!==a&&function(t){n.d(e,t,(function(){return i[t]}))}(a);n("ffb8");var c,o=n("f0c5"),d=Object(o["a"])(i["default"],s["b"],s["c"],!1,null,null,null,!1,s["a"],c);e["default"]=d.exports},ffb8:function(t,e,n){"use strict";var s=n("6d1c"),i=n.n(s);i.a}},[["996c","common/runtime","common/vendor"]]]);