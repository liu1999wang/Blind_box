(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["pages/rotateLottery/components/InviteRecordPopup"],{"0ae8":function(t,n,e){"use strict";(function(t){Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var e={components:{},data:function(){return{list:[]}},props:{node:{type:Object}},computed:{},watch:{},created:function(){this.initList()},methods:{initList:function(){var t=this;this.$http("/activity/invite-records","GET",{node_uuid:this.node.uuid}).then((function(n){t.list=n.data.list}))},toMyBox:function(){t.navigateTo({url:"/pages/myBox/index"})},cancel:function(){this.$emit("cancel")}},onPageScroll:function(t){}};n.default=e}).call(this,e("543d")["default"])},"3bcf":function(t,n,e){"use strict";var i=e("7040"),o=e.n(i);o.a},7040:function(t,n,e){},"7a0f":function(t,n,e){"use strict";e.d(n,"b",(function(){return o})),e.d(n,"c",(function(){return u})),e.d(n,"a",(function(){return i}));var i={NoData:function(){return e.e("components/NoData/NoData").then(e.bind(null,"7ef1"))}},o=function(){var t=this,n=t.$createElement;t._self._c},u=[]},9737:function(t,n,e){"use strict";e.r(n);var i=e("7a0f"),o=e("b544");for(var u in o)"default"!==u&&function(t){e.d(n,t,(function(){return o[t]}))}(u);e("3bcf");var a,c=e("f0c5"),r=Object(c["a"])(o["default"],i["b"],i["c"],!1,null,"53e879b9",null,!1,i["a"],a);n["default"]=r.exports},b544:function(t,n,e){"use strict";e.r(n);var i=e("0ae8"),o=e.n(i);for(var u in i)"default"!==u&&function(t){e.d(n,t,(function(){return i[t]}))}(u);n["default"]=o.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'pages/rotateLottery/components/InviteRecordPopup-create-component',
    {
        'pages/rotateLottery/components/InviteRecordPopup-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("9737"))
        })
    },
    [['pages/rotateLottery/components/InviteRecordPopup-create-component']]
]);
