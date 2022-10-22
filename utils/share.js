export default {
	data() {
		return {}
	},
	computed: {
		share() {
			return {
				title: '',
				thumb: '',
				desc: '',
				path: '',
				content: ''
			}
		}
	},
	methods: {
		getShareConfig (requireLogin) {
			
			requireLogin = requireLogin || false
			
			let shareConfig = this.$store.getters.setting.share || {}
			let user = this.$store.getters.userInfo || {}
		
			if (!user.uuid && requireLogin) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
			}
			
			// 获取当前页面路径
			let path = this.share.path
			if (!path) {
				let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
				path = routes[routes.length - 1].route //获取当前页面路由
				let curParam = routes[routes.length - 1].options; //获取路由参数
				// 拼接参数
				let param = ''
				for (let key in curParam) {
					if (key === 'inviter') {
						continue;
					}
					
					param += key + '=' + curParam[key] + '&'
				}
			
				if (param)
					path += '?' + param
			}
			
			// 有登陆，使用邀请
			if (user.uuid) {
				if (path.indexOf("?") !== -1) {
					path += '&inviter=' + user.uuid
				} else {
					path += '?inviter=' + user.uuid
				}
			}
			
			let appUrl = this.$store.getters.setting.share.app_share_url + '?path=' + path.replace('?', '&')
			
			let title = this.share.title
			let thumb = this.share.thumb
			if (!title) {
				title = shareConfig.share_title || '{name}邀请您来开盲盒啦~'
				title = title.replace('{name}', user.name || '')
				thumb = thumb || shareConfig.share_image
			}
			
			let config = {
				title: title,
				path: path,           // 小程序分享的路径
				app_url: appUrl,       // App分享的链接
				imageUrl: thumb,
				desc: this.share.desc,
				content: this.share.content,
				success(res) {},
				fail(res) {}
			}
			console.log('share ===>', config)
			return config
		}
	},
	onShareAppMessage(res) {
		return this.getShareConfig()
	},
	onShareTimeline(res) { //分享到朋友圈
		return this.getShareConfig()
	},
}
