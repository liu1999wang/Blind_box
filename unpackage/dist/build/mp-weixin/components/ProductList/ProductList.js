(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/ProductList/ProductList"],{"15df":function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={props:{ids:{type:Array},module:{type:Object,default:function(){return{}}},refreshCounter:Number,getNextPageCounter:Number},data:function(){return{page:1,list:[]}},mounted:function(){this.initData()},computed:{isScroll:function(){return"scroll"==this.module.theme},grid:function(){return this.module.grid||"grid3"},wrapMode:function(){return this.module.wrap_mode||"wrap"}},watch:{ids:function(){this.initData()},refreshCounter:function(){this.initData()},getNextPageCounter:function(t){"all"===this.module.list_content&&this.getNextPage()}},methods:{initData:function(){var t=this;"all"===this.module.list_content?(this.page=1,this.$http("/shop/products","GET",{page:this.page,per_page:12}).then((function(e){t.list=e.data.list}))):this.ids&&this.ids.length>0&&this.$http("/shop/products","GET",{per_page:80,ids:this.ids}).then((function(e){t.list=e.data.list}))},clickItem:function(){this.$playAudio("click")},getNextPage:function(){var t=this;this.page++,this.$http("/shop/products","GET",{page:this.page,per_page:12}).then((function(e){t.list=t.list.concat(e.data.list)}))}}};e.default=i},3792:function(t,e,n){"use strict";var i=n("907e"),u=n.n(i);u.a},"38bf":function(t,e,n){"use strict";n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return r})),n.d(e,"a",(function(){return i}));var i={ProductItem:function(){return n.e("components/ProductItem/ProductItem").then(n.bind(null,"6c7f"))}},u=function(){var t=this,e=t.$createElement;t._self._c},r=[]},"907e":function(t,e,n){},ec92:function(t,e,n){"use strict";n.r(e);var i=n("38bf"),u=n("f27a");for(var r in u)"default"!==r&&function(t){n.d(e,t,(function(){return u[t]}))}(r);n("3792");var o,a=n("f0c5"),s=Object(a["a"])(u["default"],i["b"],i["c"],!1,null,null,null,!1,i["a"],o);e["default"]=s.exports},f27a:function(t,e,n){"use strict";n.r(e);var i=n("15df"),u=n.n(i);for(var r in i)"default"!==r&&function(t){n.d(e,t,(function(){return i[t]}))}(r);e["default"]=u.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/ProductList/ProductList-create-component',
    {
        'components/ProductList/ProductList-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("ec92"))
        })
    },
    [['components/ProductList/ProductList-create-component']]
]);
