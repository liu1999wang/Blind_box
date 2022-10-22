import {
	$getStorage
} from "../utils/auth.js";

import {
	BASE_URL,
	DEVICE_INFO
} from "../config/index.js";

import request from './request.js'

import userStore from "@/store/modules/user.js";
import appStore from "@/store/modules/app.js";

// #ifdef MP-WEIXIN
let clientType = "miniapp"
// #endif

// #ifdef APP-PLUS
let clientType = DEVICE_INFO.platform === 'android' ? 'app_android' : 'app_ios'
// #endif

// #ifdef H5
let clientType = 'web_mobile'
// #endif

let baseData = {
	app: '',
	device: {
		width: DEVICE_INFO.width,
		height: DEVICE_INFO.height,
		is_wifi: 0
	},
	client: {
		type: 'miniapp',
		version: '2.0'
	}
}

module.exports = {
	record: (page, options) => {
		
		// 不需要记录访客信息
		if (!appStore.state.setting.is_log_visitor) {
			return false
		}
		
		if (typeof page == 'string') {
			page = {
				type: page
			}
		}
		options = options || {}
		let data = {
			...baseData,
			...options,
			page: page,
			scene_id: appStore.state.scene_id,
			wechat: {
				gender: userStore.state.wechatInfo.gender ? "男" : "女",
				nickname: userStore.state.wechatInfo.nickName,
				headimgurl: userStore.state.wechatInfo.avatarUrl
			},
		}
		uni.getNetworkType({
			success: res => {
				baseData.device.is_wifi = res.networkType === 'wifi' ? 1 : 0,
				
				setTimeout(() => {
					request('/visitors', 'POST', data);
				}, 600)
			}
		})
	}
}
