<template>
	<view class="container">
		<view class="login-bg">
			<image :src="bgImage" mode="aspectFill"></image>
		</view>
		
		<view class="content">
			<view class="phone-input-c">
				<view class="key">+86</view>
				<input v-model="phone" placeholder="输入手机号"></input>
			</view>
			<view class="code-input-c">
				<input v-model="phoneCode" placeholder="输入验证码"></input>
				<view class="get-code-btn" @tap="getPhoneCode" hover-class="hover">{{getCodeText}}</view>
			</view>
			<view class="submit-btn" hover-class="hover" @tap="submitPhoneLogin">立即登录</view>
			
			<view class="other-method-tips">
				<view class="text">更多登录方式</view>
			</view>
			<view class="login-list">
				<view class="item" @tap="wechatLogin">
					<view class="image-c" hover-class="hover">
					<image src="https://cdn2.hquesoft.com/box/login/wechat.png" mode="heightFix"></image>
					</view>
					<!-- <text>微信</text> -->
				</view>
				<view class="item" v-if="isIos" @tap="appleIdLogin">
					<view class="image-c" hover-class="hover">
						<image src="https://cdn2.hquesoft.com/box/login/apple.png" mode="widthFix"></image>
					</view>
					<!-- <text>Apple</text> -->
				</view>
			</view>
			<view class="rule-tips">
				登录即代表同意 <span class="link" @tap="toServicePage">《用户协议》</span> <span class="link" @tap="toPrivacyPage">《隐私规则》</span>
			</view>
		</view>
		<!-- <view class="logo-c">
			<image class="logo" mode="widthFix" :src="logo"></image>
		</view>
		<view class="button-c">

			<button class="button" lang="zh_CN" @tap="wechatLogin">微信登录</button>

			<button class="button apple-login-btn" lang="zh_CN" v-if="isIos" @tap="appleIdLogin">通过Apple登陆</button>

			<view class="stop-login-c" @tap="stopLogin">暂不登陆</view>
		</view> -->

		<GetPhonePopup v-if="isShowPhonePopup" @success="getPhoneNumberSuccess" @cancel="isShowPhonePopup=false">
		</GetPhonePopup>

	</view>
</template>

<script>
	import {
		$getStorage
	} from "@/utils/auth.js";

	// import GetPhonePopup from "./components/GetPhonePopup.vue"

	export default {
		name: "login",
		components: {
			// GetPhonePopup
		},
		data() {
			return {
				code: '',
				params: {},
				isShowPhonePopup: false,
				dataUuid: '',
				loginMethod: '',
				phone: '',
				phoneCode: '',
				clock: 0,
				config: {}
			}
		},
		created() {
			this.$http('/setting/app_login_page').then(res => {
				console.log('resss', res.data)
				this.config = res.data.setting
			})
		},
		onShow() {
			let token = $getStorage('token')
			if (token) {
				// console.log(token)
				uni.navigateBack({
					delta: 1
				})
			}
		},
		computed: {
			isPhonePass() {
				return this.phone.length === 11
			},
			isCanSubmit() {
				return this.isPhonePass && this.phoneCode.length === 6
			},
			bgImage() {
				// return this.$store.getters.setting.login_page.bg_image || ''
				return 'https://cdn2.hquesoft.com/box/login/bg.png'
			},
			isIos() {
				return uni.getSystemInfoSync().platform == 'ios'
			},
			getCodeText() {
				if (this.clock <= 0) {
					return '验证码'
				} else {
					return this.clock + 's'
				}
			}
		},
		methods: {
			toServicePage() {
				// 去服务页
				if (!this.config.service_link) {
					uni.showToast({
						title: '未设置链接~',
						icon: 'none'
					})
					return false 
				}
				this.toLink(this.config.service_link)
			},
			toPrivacyPage() {
				// 去隐私页
				if (!this.config.privacy_link) {
					uni.showToast({
						title: '未设置链接~',
						icon: 'none'
					})
					return false 
				}
				this.toLink(this.config.privacy_link)
			},
			refreshClock() {
				setTimeout(res => {
					this.clock--
			
					if (this.clock > 0) {
						this.refreshClock()
					}
				}, 1000)
			},
			getPhoneCode() {
				if (this.clock > 0) {
					return false
				}
			
				if (!this.isPhonePass) {
					uni.showToast({
						title: '手机号不正确~',
						icon: 'none'
					})
					return false
				}
			
				uni.showLoading({
					title: '请求中',
					mask: false
				})
			
				this.$http('/login/phone-code', 'POST', {
					phone: this.phone
				}).then(res => {
					uni.hideLoading()
					this.clock = 60
					this.refreshClock()
				})
			},
			wechatLogin() {
				this.loginMethod = 'wechat'
				uni.login({
					success: res => {

						uni.showLoading({
							title: '登陆中~'
						})
						this.$store.dispatch("login", {
							type: 'app/with-wechat',
							params: {
								"access_token": res.authResult.access_token,
								"openid": res.authResult.openid
							}
						}).then(res => {
							uni.hideLoading()

							console.log('res =====>', res)

							// 需要手机号
							if (res.data.is_need_phone_number || res.data.is_need_phone) {

								this.isShowPhonePopup = true
								this.dataUuid = res.data.data_uuid

							} else if (res.data.token) {
								this.$store.dispatch("getUserInfo");

								uni.navigateBack({
									delta: 1
								})
								
								uni.showToast({
									title: '登录成功~',
									icon: 'none'
								})

							}
						})

					},
					fail: err => {}
				})
			},
			stopLogin() {
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			getPhoneNumberSuccess(data) {
				this.params = {
					data_uuid: this.dataUuid,
					phone: data.phone,
					phone_code: data.phone_code,
				}

				this.submitLogin(this.params)
			},
			appleIdLogin() {
				this.loginMethod = 'apple'
				uni.login({  
				    provider: 'apple',  
				    success: (loginRes) => {  
				        // 登录成功  
				        uni.getUserInfo({  
				            provider: 'apple',  
				            success: (res) => {  
				                // 获取用户信息成功  
								let userInfo = res.userInfo
								let idToken = userInfo.identityToken
								this.$store.dispatch("login", {
									type: 'app/with-apple-id',
									params: {
										"identity_token": idToken
									}
								}).then(res => {
									uni.hideLoading()
								
									// 需要手机号
									if (res.data.is_need_phone_number || res.data.is_need_phone) {
								
										this.isShowPhonePopup = true
										this.dataUuid = res.data.data_uuid
								
									} else if (res.data.token) {
										this.$store.dispatch("getUserInfo");
								
										uni.navigateBack({
											delta: 1
										})
										
										uni.showToast({
											title: '登录成功~',
											icon: 'none'
										})
								
									}
								})
								
					        }  
				        })  
				    },  
				    fail: function (err) {  
						console.log(err)
				        uni.showToast({
				        	title: '登陆失败~',
							icon: 'none'
				        })
				    }  
				});  
			
			},
			// 手机号登陆
			submitPhoneLogin() {
			
				if (!this.isCanSubmit) {
					uni.showToast({
						title: '请填写正确手机号及6位验证码~',
						icon: 'none'
					})
			
					return false
				}
			
				uni.showLoading({
					title: "登录中"
				})
			
				let type = 'app/with-phone-code'
				let params = {
					phone: this.phone,
					phone_code: this.phoneCode
				}
				return this.$store.dispatch("login", {
					type: type,
					params: params
				}).then(res => {
					
					uni.hideLoading()
					this.$store.dispatch("getUserInfo")
					
					uni.navigateBack({
						delta: 1
					})
					
					uni.showToast({
						title: '登录成功~',
						icon: 'none'
					})
					
				})
			},
			// 其它登陆
			submitLogin(params) {
				let type = this.loginMethod === 'wechat' ? 'app/with-wechat' : 'app/with-apple-id'

				uni.showLoading({
					title: "登录中"
				})

				return this.$store.dispatch("login", {
					type: type,
					params: params
				}).then(res => {
					uni.hideLoading()

					console.log('res =====>', res)

					// 需要手机号
					if (res.data.is_need_phone_number || res.data.is_need_phone) {

						this.isShowPhonePopup = true
						this.dataUuid = res.data.data_uuid

						// 重新获取code
						if (this.loginMethod === 'wechat') {
							this.getCode()
						}
					} else if (res.data.token) {
						this.$store.dispatch("getUserInfo");

						uni.navigateBack({
							delta: 1
						})
						
						uni.showToast({
							title: '登录成功~',
							icon: 'none'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.contaier {
		overflow: hidden;
	}

	.apple-login-btn {
		margin-top: 20rpx;
	}

	.stop-login-c {
		color: white;
		margin-top: 30rpx;
		text-align: center;
		font-size: 80%;
	}

	.login-bg {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		z-index: -1;

		image {
			width: 100%;
			height: 100%;
		}

		.mask {
			position: absolute;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.1);
		}
	}

	.content {
		position: fixed;
		bottom: 0rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		.phone-input-c {
			width: 670rpx;
			height: 104rpx;
			background: #F7F6FB;
			border-radius: 52rpx;
			// line-height: 104rpx;
			display: flex;
			align-items: center;
			
			.key {
				width: 55rpx;
				// height: 25rpx;
				padding: 0rpx 20rpx;
				margin-left: 30rpx;
				font-size: 32rpx;
				font-family: PingFang;
				font-weight: bold;
				color: #888594;
				border-right: 2rpx solid #D1CEE1;
			}
			
			input {
				padding: 0rpx 30rpx;
			}
		}
		
		.code-input-c {
			width: 670rpx;
			height: 104rpx;
			background: #F7F6FB;
			border-radius: 52rpx;
			margin-top: 50rpx;
			display: flex;
			align-items: center;
			input {
				padding: 0rpx 60rpx;
				flex-grow: 1;
			}
			
			.get-code-btn {
				width: 214rpx;
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: linear-gradient(180deg, #FFDB53, #FFB709);
				border-radius: 44rpx;
				font-size: 26rpx;
				font-family: PingFang;
				font-weight: bold;
				color: #FFFFFF;
			}
		}
		
		.submit-btn {
			width: 670rpx;
			height: 110rpx;
			background: linear-gradient(180deg, #FFDB53, #FFB709);
			border-radius: 56rpx;
			margin-top: 100rpx;
			
			font-size: 36rpx;
			font-family: PingFang;
			font-weight: bold;
			color: #FFFFFF;
			line-height: 110rpx;
			text-align: center;
		}
		
		.other-method-tips {
			margin-top: 50rpx;
			height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			.text {
				text-align: center;
				font-size: 26rpx;
				color: #878493;
			}
			
			&:after,
			&:before {
				// position: absolute;
				// top: 50%;
				background: #e1e1e1;
				content: "";
				height: 1px;
				width: 30rpx;
				// position: relative;
				margin: 20rpx;
			}
			
			/*调整背景横线的左右距离*/
			&:before {
				left: 140rpx;
			}
			
			&:after {
				right: 140rpx;
			}
		}
		
		.login-list {
			display: flex;
			align-items: center;
			justify-content: center;
			.item {
				
				.image-c {
					width: 104rpx;
					height: 104rpx;
					background: #F7F6FB;
					border-radius: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
					image {
						width: 46rpx;
						height: 46rpx;
					}
					margin-bottom: 10rpx;
				}
				
				font-size: 22rpx;
				font-family: PingFang;
				font-weight: 500;
				color: #878493;
				margin: 0rpx 40rpx;
				text-align: center;
				
			}
		}
		
		.rule-tips {
			margin: 80rpx 0rpx 30rpx 0rpx;
			font-size: 26rpx;
			font-family: PingFang;
			font-weight: 500;
			color: #878493;
			
			.link {
				color: #016AFF;
			}
		}
	}
</style>
