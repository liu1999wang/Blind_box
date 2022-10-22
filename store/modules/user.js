import request from "../../utils/request.js";
import {
	$getStorage,
	$setStorage,
	$removeStorage
} from "../../utils/auth.js";
import {
	getUserInfo,
	userLogin,
	userSignIn
} from '../../api/user.js'
const user = {
	state: {
		token: $getStorage('token') || "",
		userInfo: $getStorage('userInfo') || {},
		personalSettings: $getStorage('personalSettings') || {},
		wechatInfo: $getStorage('wechatInfo') || {},
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token
			$setStorage('token', token);
		},
		SET_USER_INFO(state, userInfo) {
			state.userInfo = userInfo;
			$setStorage('userInfo', userInfo);
		},
		SET_WECHAT_INFO(state, wechatInfo) {
			state.wechatInfo = wechatInfo;
			$setStorage('wechatInfo', wechatInfo);
		},
		SET_PERSONAL_SETTINGS(state, option) {
			state.personalSettings[option.key] = option.value
		}
	},
	actions: {
		async userSignIn(store) {
			const res = await userSignIn()
			await store.dispatch("getUserInfo")
			return res
		},
		setPersonalSettings(store, option) {
			store.commit("SET_PERSONAL_SETTINGS", option);
			$setStorage('personalSettings', store.state.personalSettings);
		},
		async getUserInfo(store) {
			const res = await getUserInfo().catch(err => {
				store.commit("SET_USER_INFO", "");
				store.commit("SET_TOKEN", "");
			});
			if (!res) return
			store.commit("SET_USER_INFO", res.data.user);
		},
		logout(store) {
			$setStorage('token', "");
			store.commit("SET_USER_INFO", "");
			store.commit("SET_TOKEN", "");
		},
		async login(store, {type, params}) {
			// store.commit("SET_WECHAT_INFO", e.detail.userInfo) 
			
			// console.log('commit ======>', params)
			
			let inviter = $getStorage('inviter') || ''
			let inviteNode = $getStorage('invite_node') || ''
			
			return userLogin(type, {
				...params,
				inviter: inviter,
				invite_node: inviteNode
			}).then(res => {
				if (res.data.token) {
					store.commit("SET_TOKEN", res.data.token)
				}
				
				return res
			})
		}
	}
}

export default user
