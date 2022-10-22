import Vue from 'vue'

import App from './App'
import request from './utils/request.js'
import store from './store'
import $tool from './utils/tool.js'
import $device from './utils/device.js'

import share from '@/utils/share.js'
import mixin from '@/utils/mixin.js'
Vue.mixin(share)
Vue.mixin(mixin)

import tabBar from 'components/TabBar/tabBar.vue'
Vue.component('tab-bar',tabBar)

import api from './newApi'
Vue.prototype.$api = api;

var upload = require("./utils/upload.js")
Vue.prototype.$upload = upload;

var navigator = require("./utils/navigator.js")
Vue.prototype.$navigator = navigator;

var visitor = require("./utils/visitor.js")
Vue.prototype.$visitor = visitor;

Vue.prototype.$tool = $tool;
Vue.prototype.$device = $device;

Vue.prototype.$store = store;
Vue.prototype.$http = request;

Vue.config.productionTip = false

Vue.prototype.$showPullRefresh = () => {
	// store.dispatch("getSetting")
	uni.showLoading({
		title: '刷新中'
	})
	
	setTimeout(res => {
		uni.stopPullDownRefresh()
	}, 200)
	
	setTimeout(res => {
		uni.hideLoading()
	}, 500)
	
	return store.dispatch("getSetting")
};


// 初始化点击声
let audioSrcMap = {
	click: 'https://cdn2.hquesoft.com/box/audio/click.mp3',
	check: 'https://cdn2.hquesoft.com/box/audio/check.mp3',
	yao: 'https://cdn2.hquesoft.com/box/audio/yao.mp3',
	open: 'https://cdn2.hquesoft.com/box/audio/open.mp3'
}
var audioContainer = {
	click: null,
	check: null,
	yao: null,
	open: null
}

setTimeout(() => {
	for (let type in audioSrcMap) {
		audioContainer[type] = uni.createInnerAudioContext()
		audioContainer[type].src = audioSrcMap[type]
	}
}, 800)

Vue.prototype.$playAudio = (type) => {
	if (!audioContainer[type]) {
		audioContainer[type] = uni.createInnerAudioContext()
		audioContainer[type].src = audioSrcMap[type] || type
	}
	// console.log('obj', audioContainer)
	audioContainer[type].play()
}

var bgm = null;
Vue.prototype.$playBgm = (src, options) => {
	if (!bgm) {
		bgm = uni.createInnerAudioContext()
	}
	if (src) {
		bgm.src = src
		bgm.loop = true
	}

	bgm.play()
	store.dispatch('setIsBgmPlay', true)
}

Vue.prototype.$stopBgm = () => {
	bgm && bgm.stop()
	store.dispatch('setIsBgmPlay', false)
}

Vue.prototype.$switchBgm = () => {
	if (store.getters.isBgmPlay) {
		Vue.prototype.$stopBgm()
	}
	else {
		Vue.prototype.$playBgm()
	}
}

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
