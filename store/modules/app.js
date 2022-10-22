import Vue from 'vue'
import config from "../../config/index.js";
// import visitRecord from "../../utils/visitRecord.js";
import userStore from "./user.js";
const flag = false;

const app = {
	state: {
		baseUrl: config.BASE_URL,
		deviceInfo: config.DEVICE_INFO,
		scene_id: "",
		isBgmPlay: false,
		setting: {
			'activity_home': {},
			'box_home': {},
			'shop_home': {},
			'topic_home': {},
			'login_page': {},
			'rule_page': {},
			'share_rule_page': {},
			'vip_page': {},
			'open_box': {},
			'box_room': {},
			'score': {},
			'miniapp_subscribe_ids': {},
			'user_center': {},
			'share': {},
			'market': {},
			'custom_service': {},
			'coupon_popup': {}
		}
	},
	mutations: {
		SET_IS_BGM_PLAY(state, flag) {
			state.isBgmPlay = flag
		},
		SET_ADDRESS(state, value) {
		  state.address = value
		},
		SET_SCENE_ID(state, value) {
			state.scene_id = value
		},
		SET_SETTING(state, setting) {
			state.setting = {
				...state.setting,
				...setting,
			}
		}
	},
	actions: {
		setIsBgmPlay(store, flag) {
			store.commit("SET_IS_BGM_PLAY", flag);
		},
		setEnterScene(store, id) {
			store.commit("SET_SCENE_ID", id);
		},
		setAddress(store, value) {
			store.commit("SET_ADDRESS", value);
		},
		getSetting(store) {
			setTimeout(() => {
				Vue.prototype.$http('/miniapp/subscribe-ids').then(res => {
					store.commit("SET_SETTING", {
						miniapp_subscribe_ids: res.data.ids
					});
				})
			}, 1000)
			
			return Vue.prototype.$http('/setting/base').then(res => {
				
				store.commit("SET_SETTING", res.data.setting);
			})
		},
	}
}

export default app