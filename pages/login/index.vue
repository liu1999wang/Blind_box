<template>
	<view class="container" :style="'background-size: 100% auto; height: 100vh; background-image: url(' + bgImage + '); background-size: 100% auto; background-position: center center;'">
	<!-- 	<view class="login-bg">
			<image :src="bgImage" mode="aspectFill"></image>
		</view> -->
		<view class="logo-c">
			<image class="logo" mode="widthFix" :src="logo"></image>
		</view>
		
		<!-- 用户协议 -->
		<UserStatement v-model="isCheckUserStatement"></UserStatement>
		
		<view class="button-c">
			<!-- #ifdef MP-WEIXIN -->
			<button class="button" lang="zh_CN" @tap="getUserInfoWithMiniapp">授权登录</button>
			<!-- <button class="button" v-else open-type="getUserInfo" lang="zh_CN" @getuserinfo="getUserInfoWithMiniapp">授权登录</button> -->
			<!-- #endif -->
			
			<!-- #ifdef MP-ALIPAY -->
			<button class="button" scope="userInfo" lang="zh_CN" @tap="disableMultiClick(getUserInfoWithAlipay)">授权登录</button>
			<!-- #endif -->
			
			<!-- #ifdef MP-TOUTIAO -->
			<button class="button" lang="zh_CN" @tap="getUserInfoWithByteDance">授权登录</button>
			<!-- #endif -->
			
			<!-- #ifdef MP-KUAISHOU -->
			<button class="button" lang="zh_CN" @tap="getUserInfoWithKuaishou">授权登录</button>
			<!-- #endif -->
			<view class="stop-login-c" @tap="stopLogin">暂不登陆</view>
		</view>
		
		<!-- #ifdef MP-WEIXIN -->
			<GetPhonePopup v-if="isShowPhonePopup" @success="getPhoneNumberSuccess" @cancel="isShowPhonePopup=false"></GetPhonePopup>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
			<GetPhonePopup v-if="isShowPhonePopup" @success="getPhoneNumberSuccess" @cancel="isShowPhonePopup=false"></GetPhonePopup>
		<!-- #endif -->
		
	</view>
</template>

<script>
	import {
		$getStorage,
		$setStorage
	} from "@/utils/auth.js";
	
	// #ifdef MP-WEIXIN
	import GetPhonePopup from "@/components/GetPhonePopup/GetPhonePopupForWechat.vue"
	// #endif
	// #ifndef MP-WEIXIN
	import GetPhonePopup from "@/components/GetPhonePopup/GetPhonePopup.vue"
	// #endif
	
	export default {
		name: "login",
		components: {
			GetPhonePopup
		},
		data() {
			return {
				code: '',
				params: {},
				isShowPhonePopup: false,
				dataUuid: '',
				isLoginLoading: false,
				isCheckUserStatement: true,
			}
		},
		created() {
			this.getCode()
		},
		onShow() {
			let token = $getStorage('token')
			
			if (token) {
				// console.log(token)
				setTimeout(res => {
					uni.navigateBack({
						delta: 1
					})
				}, 100)
			}
		},
		computed: {
			logo() {
				return this.$store.getters.setting.login_page.logo || ''
			},
			bgImage() {
				return this.$store.getters.setting.login_page.bg_image || ''
			}
		},
		methods: {
			getCode () {
				// #ifdef MP-WEIXIN
				uni.login({
					success: res => {
						console.log('logon ====>', res)
						this.code = res.code
					},
					fail: err => {}
				})
				// #endif
				
				// #ifdef MP-TOUTIAO
				tt.login({
					force: true,
					success: (res) => {
						this.code = res.code
					}
				})
				// #endif
				
				// #ifdef MP-KUAISHOU
				ks.login({
				    success: res => {
				    	console.log('logon ====>', res)
				    	this.code = res.code
				    },
				    fail: err => {}
				});
				// uni.login({
				// 	success: res => {
				// 		console.log('logon ====>', res)
				// 		this.code = res.code
				// 	},
				// 	fail: err => {}
				// })
				// #endif
			},
			// #ifdef MP-TOUTIAO
			// 头条系登陆
			getUserInfoWithByteDance() {
				
				if (!this.isCheckUserStatement) {
					uni.showToast({
						title: '请先阅读并同意《用户使用协议》',
						icon: 'none'
					})
					return false
				}
				
				uni.getUserInfo({
					withCredentials: true
				}).then(res => {
					console.log('res=>', res)
					res = res[1] //
					 
					this.params = {
						code: this.code,
						encrypt_data: res.encryptedData,
						iv: res.iv
					}
					
					this.submitLogin(this.params)
				})
			},
			// #endif
			// #ifdef MP-KUAISHOU
			// 快手登陆
			getUserInfoWithKuaishou() {
				
				if (!this.isCheckUserStatement) {
					uni.showToast({
						title: '请先阅读并同意《用户使用协议》',
						icon: 'none'
					})
					return false
				}
				
				uni.getUserInfo({
					withCredentials: true
				}).then(res => {
					console.log('res=>', res)
					res = res[1] //
					 
					this.params = {
						code: this.code,
						encrypt_data: res.encryptedData,
						iv: res.iv
					}
					
					this.submitLogin(this.params)
				})
			},
			// #endif
			// #ifdef MP-ALIPAY
			// 支付宝小程序登陆
			getUserInfoWithAlipay() {
				
				if (!this.isCheckUserStatement) {
					uni.showToast({
						title: '请先阅读并同意《用户使用协议》',
						icon: 'none'
					})
					return false
				}
				
				my.getAuthCode({
					scopes: 'auth_user', // 主动授权（弹框）：auth_user，静默授权（不弹框）：auth_base
					success: (res) => {
						if (res.authCode) {
							
							console.log('res', res)
							
							this.params = {
								code: res.authCode,
							}
							
							this.submitLogin(this.params)
						}
					},
				});
				
			},
			// #endif
			// #ifdef MP-WEIXIN
			//  微信小程序
			getUserInfoWithMiniapp() {
				
				if (!this.isCheckUserStatement) {
					uni.showToast({
						title: '请先阅读并同意《用户使用协议》',
						icon: 'none'
					})
					return false
				}
				
				if (this.isLoginLoading) {
					return false
				}
				this.isLoginLoading = true
				
				wx.getUserProfile({
					desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						this.submitLogin({
							code: this.code,
							encrypt_data: res.encryptedData,
							iv: res.iv
						})
					},
					complete: () => {
						this.isLoginLoading = false
					}
				})
			},
			// #endif
			getPhoneNumberSuccess(data) {
				this.params = {
					data_uuid: this.dataUuid,
					...data
				}

				this.submitLogin(this.params)
			},
			stopLogin() {
				$setStorage('stop_login_time', (new Date()).getTime())
				uni.switchTab({
					url: '/pages/index/index'
				})
			},
			submitLogin(params) {
				
				// #ifdef MP-TOUTIAO
					let type = 'with-byte-dance'
				// #endif
				// #ifdef MP-WEIXIN
					let type = 'with-wechat'
				// #endif
				// #ifdef MP-KUAISHOU
					let type =  'kuaishou/miniapp'
				// #endif
				// #ifdef MP-ALIPAY
					let type = 'alipay/miniapp'
				// #endif
				
				uni.showLoading({
					title: "登录中"
				})

				return this.$store.dispatch("login", {
					type: type,
					params: params
				}).then(res => {
					uni.hideLoading()
					
					console.log('res =====>', JSON.stringify(res))
					
					// 需要手机号
					if (res.data.is_need_phone_number || res.data.is_need_phone) {
						
						this.isShowPhonePopup = true
						this.dataUuid = res.data.data_uuid
						
						// 重新获取code
						this.getCode()
					}
					else if (res.data.token) {
						this.$store.dispatch("getUserInfo");
						
						uni.navigateBack({
							delta: 1
						})
						// if (res.data.is_first_login) {
						// 	uni.redirectTo({
						// 		url: '/pages/myProfile/index'
						// 	})
						// } else {
						// 	uni.navigateBack({
						// 		delta: 1
						// 	})
						// }
					}
					if(res.data.inviter!=0){
						console.log('有')
						let this1=this
						setTimeout(function(){
							this1.$http('/app/wuser_yqyzff', 'POST', {
								inviter: res.data.inviter,
								req:res.data.req
							}).then(res => {
								console.log("邀请====>"+JSON.stringify(res))
							})
							clearTimeout(this);
						},15000);
						
					}else{
						console.log('没有')
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.contaier {
		overflow: hidden;
		width: 100%;
		height: 100vh;
		// padding-top: 400rpx;
	}

	.stop-login-c {
		color: white;
		margin-top: 30rpx;
		text-align: center;
		font-size: 80%;
	}

	// .login-bg {
	// 	width: 100%;
	// 	height: 100%;
	// 	position: fixed;
	// 	top: 0;
	// 	left: 0;
	// 	// z-index: -1;

	// 	image {
	// 		width: 100%;
	// 		height: 100%;
	// 	}

	// 	.mask {
	// 		position: absolute;
	// 		width: 100%;
	// 		height: 100%;
	// 		background: rgba(0, 0, 0, 0.1);
	// 	}
	// }

	.logo-c {
		margin: 0rpx auto  400rpx  auto;
		padding-top: 400rpx;
		text-align: center;
	}

	.logo {
		width: 286rpx;
		// background-color: #eee;
	}

	.button-c {
		position: fixed;
		bottom: 200rpx;
		left: 0rpx;
		width: 100%;

	}

	.button {
		width: 600rpx;
		height: 96rpx;
		background: #1d00ff;
		box-shadow: 0px 18rpx 30rpx 0px #512fff;
		border-radius: 10rpx;
		font-size: 32rpx;
		line-height: 96rpx;
		color: #ffffff;
		font-weight: 500;
		margin: 0rpx auto;

		&:after {
			border: none;
		}
	}
</style>
