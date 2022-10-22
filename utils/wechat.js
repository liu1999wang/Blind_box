import $tool from "@/utils/tool.js"
import $http from "@/utils/request.js"
import $wechatConfig from "@/config/wechat"
import store from "@/store"

var jweixin = require('jweixin-module')

module.exports = {
	js: jweixin,
	initJSSdk(url) {
		url = url || window.location.href
		$http('/wechat/jssdk-config', 'POST', {
			'url': url
		}).then(res => {
			let config = res.data.config
			// console.log('returnConfigWith', url, config)
			jweixin.config({
				...config,
				debug: process.env.NODE_ENV === 'development' ? $wechatConfig.js.debug : false
			});
		})

		jweixin.ready(function() {
			// console.log('jsweixian ready')
		});
	},
	// 设置分享配置
	configShareInfo(config) {
		this.js.ready (() => {
			console.log(config)
			this.js.updateAppMessageShareData({
				...config
			})

			this.js.updateTimelineShareData({
				...config
			})
		})
	},
	scanQRCode(options) {
		this.js.scanQRCode({
		  needResult: options.needResult || 1, 
		  scanType: ["qrCode", "barCode"],
		  success: (res) => {
			console.log(res)
			let strList = res.resultStr.split(",")
			options.success && options.success(strList[strList.length - 1])
		  }
		});
	},
	pay(payConfig, callback) {
		this.js.chooseWXPay({
			...payConfig,
			timestamp: payConfig.timeStamp,
			...callback
		})
	},
	// loginWithCode(code) {
	// 	$http('/login/with-wechat-code', 'POST', {
	// 		'code': code
	// 	}).then(res => {
	// 		let token = res.data.token
	// 		$tool.setStorage('token', token)
	// 		store.dispatch('getUserInfo')
	// 	})
	// },
	toAuthPage() {
		let link = window.location.href
		let appid = $wechatConfig.appid
		let uri = encodeURIComponent(link)
		let baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
		let authURL =
			`${baseUrl}?appid=${appid}&redirect_uri=${uri}&response_type=code&scope=snsapi_userinfo&state=123#wechat_redirect`
		// window.location.href = authURL
		window.location.replace(authURL)
	},
	// auth() {
			
	// 	// console.log('cdoe', $tool.getUrlParam('code'))
	// 	// api请求检验当前是否已登陆
	// 	$http('/user/token-status').then(res => {
	// 		if (!res.data.is_login) {
	// 			$tool.setStorage('token', false)
	// 			let code = $tool.getUrlParam('code')
	// 			// console.log('code', code)
	// 			if (code) {
	// 				this.loginWithCode(code) // 使用code登陆
	// 			} else {
	// 				this.toAuthPage() // 跳转到授权页
	// 			}
	// 		}
	// 	})
	// },
	bindWechat() {
		let code = $tool.getUrlParam('code')
		if (code) {			
			$http('/h5/bind-wechat', 'POST', {
				code: code
			}).then(res => {
				uni.switchTab({
					url: '/pages/index/index'
				})
			})
		} else {
			this.toAuthPage() // 跳转到授权页
		}
	}
}
