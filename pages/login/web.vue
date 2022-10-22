<template>
	<view class="container">
		<view class="empty-top"></view>
		<view class="phone-title">
			手机号
		</view>

		<input class="input phone-input" placeholder="请输入手机号" v-model="phone"></input>

		<view class="phone-code-title" placeholder="请输入验证码">
			验证码
		</view>

		<view class="code-input-c">
			<input class="input code-input" v-model="phoneCode"></input>
			<view class="get-code-btn" @tap="getPhoneCode">
				{{getCodeText}}
			</view>
		</view>


		<button class="submit-btn" @tap="disableMultiClick(submitLogin)">登陆</button>

		<!-- 用户协议 -->
		<view class="user-statement-c">
			<UserStatement v-model="isCheckUserStatement"></UserStatement>
		</view>
	</view>
</template>

<script>
	import {
		$getStorage,
		$setStorage
	} from "@/utils/auth.js";

	export default {
		name: "login",
		components: {},
		data() {
			return {
				isLoginLoading: false,
				isCheckUserStatement: true,
				phone: '',
				phoneCode: '',
				clock: 0
			}
		},
		created() {},
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
			isPhonePass() {
				return this.phone.length === 11
			},
			isCanSubmit() {
				return this.isPhonePass && this.phoneCode.length === 6
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
			stopLogin() {
				$setStorage('stop_login_time', (new Date()).getTime())
				uni.switchTab({
					url: '/pages/index/index'
				})
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
					uni.showModal({
						title: '',
						content: '手机号不正确',
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
			submitLogin() {
				
				if (!this.isCheckUserStatement) {
					uni.showToast({
						title: '请先阅读并同意《用户使用协议》',
						icon: 'none'
					})
					return false
				}

				if (!this.isCanSubmit) {
					uni.showModal({
						title: '',
						content: '请填写正确手机号及6位验证码',
						icon: 'none'
					})

					return false
				}

				uni.showLoading({
					title: "登录中"
				})

				let type = 'h5/with-phone-code'
				let params = {
					phone: this.phone,
					phone_code: this.phoneCode
				}
				return this.$store.dispatch("login", {
					type: type,
					params: params
				}).then(res => {
					
					uni.hideLoading()
					console.log('res =====>', res)
					this.$store.dispatch("getUserInfo")
					// 未绑定微信，需要进行绑定
					if (!res.data.is_bind_wechat) {
						// 跳转到微信绑定页
						uni.redirectTo({
							url: '/pages/login/h5BindWechat'
						})
					}
					else {
						uni.navigateBack({
							delta: 1
						})
					}
					
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 60rpx 60rpx;
		box-sizing: border-box;

		.empty-top {
			height: 20vh;
		}

		.content {
			flex: 1;
		}

		.input {
			border: 1rpx solid #D9D9D9;

			padding: 0rpx 20rpx;
			line-height: 80rpx;
			height: 80rpx;
			box-sizing: border-box;
			width: 100%;
			margin-top: 10rpx;
		}

		.phone-input {
			font-size: 34rpx;
			font-weight: 500;
			letter-spacing: 2rpx;
			// height: 80rpx;
		}

		.code-input {
			border: 0rpx solid #D9D9D9;
			margin-top: 0rpx;
			letter-spacing: 6rpx;
			font-size: 34rpx;
			font-weight: 500;
		}

		.code-input-c {
			border: 1rpx solid #D9D9D9;
			display: flex;
			align-items: center;
			margin-top: 10rpx;

			.get-code-btn {
				flex: 0 0 160rpx;
				background: #F8F8F8;
				height: 100%;
				height: 80rpx;
				text-align: center;
				line-height: 80rpx;
			}
		}

		.phone-code-title {
			margin-top: 50rpx;
			font-size: 28rpx;
		}

		.phone-title {
			font-size: 28rpx;
		}

		.submit-btn {
			margin-top: 50rpx;
			margin-bottom: 30rpx;
		}

		.user-statement-c {
			position: fixed;
			bottom: 50rpx;
			width: 100%;
			text-align: center;
			box-sizing: border-box;
			left: 0rpx;
		}
	}
</style>
