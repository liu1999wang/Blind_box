(global["webpackJsonp"]=global["webpackJsonp"]||[]).push([["components/SharePopup/SharePopup"],{"070a":function(e,t,n){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o=n("ce58");function r(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?r(Object(n),!0).forEach((function(t){c(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=function(){Promise.all([n.e("common/vendor"),n.e("components/SharePopup/components/posterTheme1")]).then(function(){return resolve(n("55cd"))}.bind(null,n)).catch(n.oe)},a={components:{PosterTheme1:s},props:{info:{type:Object,default:function(){return{}}}},computed:{calcInfo:function(){return i(i({},this.info),{},{qrcode:o.BASE_URL+"/miniapp/qrcode?path="+encodeURIComponent(this.info.path)})},isCanShareToTimeLine:function(){return!1},isCanShareWithPoster:function(){return!0}},data:function(){return{image:"",isShowPoster:!1,isAskShareType:!0}},methods:{shareToWechat:function(){return!1},shareToTimeLine:function(){var t=this;e.share({provider:"weixin",scene:"WXSceneTimeline",type:0,href:this.info.app_url,title:this.info.title,imageUrl:this.info.thumb,summary:this.info.desc||this.info.title,success:function(e){t.close()},fail:function(t){console.log("fail:"+JSON.stringify(t)),e.showToast({title:"分享未成功~"})}})},generatePoster:function(){this.isAskShareType=!1,this.isShowPoster=!0},getPosterUrl:function(e){this.image=e},close:function(){this.$emit("close")},saveImg:function(){console.log("saving",this.image),e.saveImageToPhotosAlbum({filePath:this.image,success:function(t){e.showToast({title:"已保存到相册",icon:"none"})}})}}};t.default=a}).call(this,n("543d")["default"])},"0956":function(e,t,n){"use strict";n.r(t);var o=n("070a"),r=n.n(o);for(var i in o)"default"!==i&&function(e){n.d(t,e,(function(){return o[e]}))}(i);t["default"]=r.a},"238b":function(e,t,n){},"825e":function(e,t,n){"use strict";n.r(t);var o=n("c639"),r=n("0956");for(var i in r)"default"!==i&&function(e){n.d(t,e,(function(){return r[e]}))}(i);n("ca30");var c,s=n("f0c5"),a=Object(s["a"])(r["default"],o["b"],o["c"],!1,null,"da18adb8",null,!1,o["a"],c);t["default"]=a.exports},c639:function(e,t,n){"use strict";var o;n.d(t,"b",(function(){return r})),n.d(t,"c",(function(){return i})),n.d(t,"a",(function(){return o}));var r=function(){var e=this,t=e.$createElement;e._self._c},i=[]},ca30:function(e,t,n){"use strict";var o=n("238b"),r=n.n(o);r.a}}]);
;(global["webpackJsonp"] = global["webpackJsonp"] || []).push([
    'components/SharePopup/SharePopup-create-component',
    {
        'components/SharePopup/SharePopup-create-component':(function(module, exports, __webpack_require__){
            __webpack_require__('543d')['createComponent'](__webpack_require__("825e"))
        })
    },
    [['components/SharePopup/SharePopup-create-component']]
]);