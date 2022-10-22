
export default {
	filters: {
		// 价格补两位小数，后台返回价格单位分
		priceToFixed(value) {
			return value ? (value/100).toFixed(2) : '0.00'
		},
		productAttrsToString(attrs = []) {
			let arr = []
			attrs.forEach(item => {
				arr.push(item.value || item.v)
			})
			return arr.join("/")
		},
		bigNumberDisplay(number) {
			if (number > 999999) {
				return (number/10000000).toFixed(1) + 'kw'
			}
			else if (number > 9999) {
				return (number/10000).toFixed(1) + 'w'
			}
			else if (number > 999) {
				return (number/1000).toFixed(1) + 'k'
			}
			return number
		}
	},
	computed: {
		isBgmPlay () {
			return this.$store.getters.isBgmPlay
		},
		scoreAlias () {
			return (this.$store.getters.setting.score && this.$store.getters.setting.score.alias) || '积分'
		},
		miniappSubscribeIds() {
			// console.log('miniapp', this.$store.getters.setting.miniapp_subscribe_ids)
			return this.$store.getters.setting.miniapp_subscribe_ids
		},
		// 是微信小程序并且正在使用自带的微信客服系统
		isMiniappAndUseMiniappKf() {
			// #ifndef MP-WEIXIN
			return false
			// #endif
			
			let setting = this.$store.getters.setting.custom_service || {}
			return setting.miniapp_kf_type != 'wx_custom_service'
		}
	},
	data (){
		return {
			noClick: true
		}
	},
	methods: {
		// 复制文本
		copyText(text) {
			uni.setClipboardData({
				data: text,
				success: function(res) {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			})
		},
		// 禁止重复点击
		disableMultiClick(methods) {
			let that = this;
			    
			if (that.noClick) {
				that.noClick= false;
				methods();
				setTimeout(() => {
					this.noClick= true;
				}, 1000)
			} else {
				console.log('屏蔽连击')
				// console.log("请")
			}
		},
		getStorage(key) {
			try {
				return uni.getStorageSync(key)
			} catch (e) {
				return null
			}
		},
		setStorage(key, data) {
			try {
				uni.setStorageSync(key, data)
			} catch (e) {
				throw new Error("setStorage Error")
			}
		},
		// 联系客服
		openContact () {
			// 淘宝客服。已禁用
			// // #ifdef MP-ALIPAY
			// let name  = this.$store.getters.setting.taobao.contact_name || '未设置昵称'
			// my.tb.openMessage({
			//   sellerNick: name,
			//   success: (res) => {
			//     console.log(res);
			//   },
			//   fail: (res) => {
			//    console.log(res);
			//   },
			// })
			// // #endif
			
			// #ifdef APP-PLUS
				let setting = this.$store.getters.setting.custom_service || {}
				
				if (setting.app_kf_type === 'link_other') {
					this.toLink(setting.app_link)
				}
				else if (setting.app_kf_type === 'wx_custom_service') {
					let sweixin = null
					plus.share.getServices(res => {
						sweixin = res.find(i => i.id === 'weixin')
						
						let corpid = setting.app_wx_corpid
						let kfLink = setting.app_wx_kf_link
						
						if (!corpid) {
							uni.showToast({
								title: '请填写微信客服企业ID~',
								icon: 'none'
							})
							return false
						}
						
						if (!kfLink) {
							uni.showToast({
								title: '请填写微信客服链接~',
								icon: 'none'
							})
							return false
						}
						
						if (sweixin) {
							sweixin.openCustomerServiceChat({
								corpid: corpid,
								url: kfLink,
								fail: (err) => {
									console.log(err)
								}
							})
						}
					})
				}
				else {
					uni.showToast({
						title: '未设置客服~',
						icon: 'none'
					})
				}
				
				// uni.navigateTo({
				// 	url: '/pages/contact/index'
				// })
			// #endif
			
			// #ifdef H5
			let setting = this.$store.getters.setting.custom_service || {}
			this.toLink(setting.web_kf_link)
			// #endif
			
			// #ifdef MP-WEIXIN
			let setting = this.$store.getters.setting.custom_service || {}
			if (setting.miniapp_kf_type === 'wx_custom_service') {
				// 微信小程序客服设置了使用微信客服
				let corpid = setting.miniapp_wx_corpid
				let kfLink = setting.miniapp_wx_kf_link
				wx.openCustomerServiceChat({
					extInfo: {
						url: kfLink,
					},
					corpId: corpid,
					success(res) {}
				})
			}
			else {
				return false
			}
			// #endif
			
		},
		// 前往登陆页
		toLoginPage () {
			// #ifdef APP-PLUS
			uni.navigateTo({
				url: '/pages/login/app'
			})
			// #endif
			// #ifdef H5
			uni.navigateTo({
				url: '/pages/login/web'
			})
			// #endif
			// #ifndef APP-PLUS || H5
			uni.navigateTo({
				url: '/pages/login/index'
			})
			// #endif
		},
		// 跳转到某个链接
		toLink(link) {
			if (link.type==='box') {
				uni.navigateTo({
					url: "/pages/boxDetail/index?uuid=" + link.box
				})
			}
			else if (link.type === 'path' || link.type === 'xpath') {
				uni.navigateTo({
					url: link.path
				})
				
				// #ifndef MP-ALIPAY
				uni.switchTab({
					url: link.path
				})
				// #endif
			}
			else if (link.type === 'url') {
				// #ifndef H5
				uni.navigateTo({
					url: '/pages/webview/index?url=' + link.url
				})
				// #endif
				// #ifdef H5
				window.localtion.href = link.url
				// #endif
			}
			else if (link.type === 'product_list') {
				uni.navigateTo({
					url: "/pages/search/index?category_id=" + (link.category_id || '')
				})
			}
			else if (link.type === 'category_list') {
				uni.navigateTo({
					url: "/pages/category/index?category_id=" + link.category_id
				})
			}
			else if (link.type === 'live') {
				uni.navigateTo({
					url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${link.live_room_id}`
				})
			}
			else if (link.type === 'ipage') {
				uni.navigateTo({
					url: "/pages/page/index?uuid=" + link.page_uuid
				})
			}
			else if (link.type === 'coupon') {
				uni.navigateTo({
					url: "/pages/couponDetail/index?uuid=" + link.coupon_uuid
				})
			}
			else if (link.type === 'contact') {
				this.openContact()
			}
		}
	}
}
