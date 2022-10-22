(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/BoxItem/Grid2"],{"256e":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={props:{info:{type:Object,default:function(){return{}}},tag:{type:String},theme:{type:String,default:function(){return"default-theme"}}},data:function(){return{}},computed:{tagString:function(){return this.info&&this.info.tags&&this.info.tags[0]||" "}},methods:{toDetail:function(){t.navigateTo({url:"/pages/boxDetail/index?uuid="+this.info.uuid})}}};n.default=e}).call(this,e("543d")["default"])},2843:function(t,n,e){"use strict";e.r(n);var u=e("256e"),i=e.n(u);for(var r in u)"default"!==r&&function(t){e.d(n,t,(function(){return u[t]}))}(r);n["default"]=i.a},"63a7":function(t,n,e){"use strict";e.d(n,"b",(function(){return i})),e.d(n,"c",(function(){return r})),e.d(n,"a",(function(){return u}));var u={PriceDisplay:function(){return e.e("components/PriceDisplay/PriceDisplay").then(e.bind(null,"5f805"))}},i=function(){var t=this,n=t.$createElement;t._self._c},r=[]},"86ab":function(t,n,e){"use strict";e.r(n);var u=e("63a7"),i=e("2843");for(var r in i)"default"!==r&&function(t){e.d(n,t,(function(){return i[t]}))}(r);e("c454");var a,c=e("f0c5"),o=Object(c["a"])(i["default"],u["b"],u["c"],!1,null,"493c82cb",null,!1,u["a"],a);n["default"]=o.exports},b642:function(t,n,e){},c454:function(t,n,e){"use strict";var u=e("b642"),i=e.n(u);i.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/BoxItem/Grid2-create-component',
    {
        'components/BoxItem/Grid2-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("86ab"))
        })
    },
    [['components/BoxItem/Grid2-create-component']]
]);
