(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/search/index"],{"7f5b":function(t,e,n){"use strict";n.r(e);var i=n("ef6d"),r=n("9b55");for(var o in r)"default"!==o&&function(t){n.d(e,t,(function(){return r[t]}))}(o);n("b3780");var a,s=n("f0c5"),c=Object(s["a"])(r["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],a);e["default"]=c.exports},"861f":function(t,e,n){"use strict";(function(t){n("e335");i(n("66fd"));var e=i(n("7f5b"));function i(t){return t&&t.__esModule?t:{default:t}}wx.__webpack_require_UNI_MP_PLUGIN__=n,t(e.default)}).call(this,n("543d")["createPage"])},"880b":function(t,e,n){"use strict";(function(t){Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i=o(n("a34a")),r=o(n("2ff0"));function o(t){return t&&t.__esModule?t:{default:t}}function a(t,e,n,i,r,o,a){try{var s=t[o](a),c=s.value}catch(u){return void n(u)}s.done?e(c):Promise.resolve(c).then(i,r)}function s(t){return function(){var e=this,n=arguments;return new Promise((function(i,r){var o=t.apply(e,n);function s(t){a(o,i,r,s,c,"next",t)}function c(t){a(o,i,r,s,c,"throw",t)}s(void 0)}))}}function c(t){return h(t)||f(t)||l(t)||u()}function u(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function l(t,e){if(t){if("string"===typeof t)return d(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?d(t,e):void 0}}function f(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}function h(t){if(Array.isArray(t))return d(t)}function d(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,i=new Array(e);n<e;n++)i[n]=t[n];return i}var g=function(){n.e("pages/search/components/list").then(function(){return resolve(n("f799"))}.bind(null,n)).catch(n.oe)},p=function(){n.e("pages/search/components/sortBar").then(function(){return resolve(n("9bde"))}.bind(null,n)).catch(n.oe)},v={mixins:[r.default],components:{ProductList:g,SortBar:p},data:function(){return{sort:"",key:"",visible:!1,category:[],list:[],page:1,per_page:20,total:0,activeCategory:"",init:!1,title:"全部商品",action:"",itemType:"all",loading:!1}},computed:{isShowSortBar:function(){return!("search"===this.action&&!this.key)},guessList:function(){return this.list.slice(0,6)}},watch:{key:function(t){this.page=1,this.list=[],this.getProductList()},sort:function(t){this.page=1,this.list=[],this.getProductList()},itemType:function(t){this.page=1,this.list=[],this.getProductList()}},onLoad:function(e){var n=this;this.activeCategory=e.category_id||0,this.title=e.title,this.action=e.action,this.itemType=e.type||"all",this.activeCategory&&!this.title?this.$http("/categories/"+this.activeCategory).then((function(e){n.title=e.data.info.title,t.setNavigationBarTitle({title:n.title})})):t.setNavigationBarTitle({title:this.title}),this.getProductList(),this.$visitor.record("search")},methods:{setSort:function(t){this.sort=t},setType:function(t){this.itemType=t},activeChange:function(t){var e=t.currentTarget.dataset.id;this.activeCategory=e==this.activeCategory?"":e,this.visible=!1,this.getProductList()},handleChange:function(t){var e=t.currentTarget.dataset.index,n=this.category[e];0!==n.sub_categories.length?this.category[e].openSubCategory=!this.category[e].openSubCategory:(this.activeCategory=n.id,this.visible=!1,this.getProductList())},handleClick:function(e){t.navigateTo({url:"/pages/productDetail/index?uuid="+e.uuid})},getProductList:function(){var e=this;this.loading=!0,t.showLoading({mask:!0}),this.$http("/search","POST",{category_id:this.activeCategory,page:this.page,key:this.key,sort:this.sort,item_type:this.itemType}).then((function(n){var i;e.init=!0,t.hideLoading(),(i=e.list).push.apply(i,c(n.data.list)),e.loading=!1,e.page++}))},showDrawer:function(){this.visible=!0},drawerClose:function(){this.visible=!1}},onReachBottom:function(){var t=this;return s(i.default.mark((function e(){return i.default.wrap((function(e){while(1)switch(e.prev=e.next){case 0:if(!t.loading){e.next=2;break}return e.abrupt("return");case 2:t.getProductList();case 3:case"end":return e.stop()}}),e)})))()}};e.default=v}).call(this,n("543d")["default"])},"9b55":function(t,e,n){"use strict";n.r(e);var i=n("880b"),r=n.n(i);for(var o in i)"default"!==o&&function(t){n.d(e,t,(function(){return i[t]}))}(o);e["default"]=r.a},b3780:function(t,e,n){"use strict";var i=n("f818"),r=n.n(i);r.a},ef6d:function(t,e,n){"use strict";n.d(e,"b",(function(){return r})),n.d(e,"c",(function(){return o})),n.d(e,"a",(function(){return i}));var i={ProductList:function(){return n.e("components/ProductList/ProductList").then(n.bind(null,"ec92"))},NoMore:function(){return n.e("components/NoMore/NoMore").then(n.bind(null,"8332"))},NoData:function(){return n.e("components/NoData/NoData").then(n.bind(null,"7ef1"))}},r=function(){var t=this,e=t.$createElement;t._self._c},o=[]},f818:function(t,e,n){}},[["861f","common/runtime","common/vendor"]]]);