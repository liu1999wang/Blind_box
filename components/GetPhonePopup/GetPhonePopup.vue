<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				绑定手机号
			</view>
			
			<view class="phone-input-c">
				<view class="key">+86</view>
				<input v-model="phone" placeholder="输入手机号"></input>
			</view>
			<view class="code-input-c">
				<input v-model="code" placeholder="输入验证码"></input>
				<view class="get-code-btn" @tap="getCode" hover-class="hover">{{getCodeText}}</view>
			</view>
			
			<!-- <view class="block">
				<input v-model="phone" class="input phone" placeholder="请输入手机号" />
				<view class="get-code-btn" @tap="getCode">{{getCodeText}}</view>
			</view>
			<view class="block">
				<input v-model="code" class="input code" placeholder="请输入验证码" />
			</view> -->
			
			<view class="button-2c">
				<view class="button submit" :class="{disabled: !isCanSubmit}" @click="submit">
					<text>确认绑定</text>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				phone: '',
				code: '',
				clock: 0
			}
		},
		props: {
		},
		computed: {
			isPhonePass () {
				return  this.phone.length === 11
			},
			isCanSubmit () {
				return this.isPhonePass && this.code.length === 6
			},
			getCodeText () {
				if (this.clock <= 0) {
					return '验证码'
				}
				else {
					return this.clock + 's'
				}
			}
		},
		watch: {
		},
		onLoad(e) {

		},
		created() {
		},
		methods: {
			cancel() {
				this.$emit('cancel')
			},
			submit() {
				if (!this.isCanSubmit) {
					uni.showModal({
						title: '',
						content: '请填写正确手机号及6位验证码',
						icon: 'none'
					})
					
					return false
				}
				
				this.$emit('success', {
					phone: this.phone,
					phone_code: this.code
				})
			},
			getCode () {
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
			refreshClock () {
				setTimeout(res => {
					this.clock-- 
					
					if (this.clock > 0) {
						this.refreshClock()
					}
				}, 1000)
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>

	.mask-content {
		position: absolute;
		bottom: 300rpx;
		left: 25rpx;
		width: 100%;
		width: 700rpx;
		// height: 580rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 14rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 60rpx 30rpx;
		box-sizing: border-box;

		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
		}
		
		.phone-input-c {
			width: 100%;
			height: 104rpx;
			background: #F7F6FB;
			border-radius: 52rpx;
			// line-height: 104rpx;
			display: flex;
			align-items: center;
			margin-top: 60rpx;
			
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
			width: 100%;
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

		// .block {
		// 	border-bottom: 1rpx solid #eee;
		// 	display: flex;
		// 	padding: 10rpx 20rpx;
		// 	margin-top: 50rpx;
		// 	align-items: center;
		// 	justify-content: center;
			
		// 	.input {
		// 		flex-grow: 1;
		// 		font-size: 28rpx;
		// 		font-weight: 500;
		// 	}
		// 	.get-code-btn {
		// 		font-size: 26rpx;
		// 		font-weight: 700;
		// 		color: #3461C5;
		// 		min-width: 100rpx;
		// 	}
		// }
		
		.button-2c {
			display: flex;
			
			.button {
			
				width: 670rpx;
				height: 100rpx;
				background: linear-gradient(180deg, #FFDB53, #FFB709);
				border-radius: 56rpx;
				margin-top: 80rpx;
				
				font-size: 36rpx;
				font-family: PingFang;
				font-weight: bold;
				color: #FFFFFF;
				line-height: 100rpx;
				text-align: center;
				
				&:after {
					border: none;
				}
				
				&.disabled {
					background: #ddd;
					box-shadow: 0 0 0rpx rgba(255, 220, 0, 0.6);
				}
			}
		}
	}
</style>
