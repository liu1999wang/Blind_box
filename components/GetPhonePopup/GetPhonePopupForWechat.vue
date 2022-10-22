<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				为了购物便捷，需要授权您的手机！
			</view>
			
			<!-- <view class="block">
				<input v-model="phone" class="input phone" placeholder="请输入手机号" />
				<view class="get-code-btn" @tap="getCode">{{getCodeText}}</view>
			</view>
			<view class="block">
				<input v-model="code" class="input code" placeholder="请输入验证码" />
			</view> -->
			
			<view class="button-2c">
				<button class="button submit" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					<text>点击授权</text>
				</button>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				code: '',
			}
		},
		props: {
		},
		computed: {
		},
		watch: {
		},
		onLoad(e) {
		},
		created() {
			// #ifndef APP-PLUS
			uni.login({
				success: res => {
					this.code = res.code
				},
				fail: err => {}
			})
			// #endif
		},
		methods: {
			cancel() {
				this.$emit('cancel')
			},
			getPhoneNumber(e) {
				if (!e.detail.encryptedData) return
				
				this.$emit('success', {
					phone_encrypt_data: e.detail.encryptedData,
					phone_iv: e.detail.iv,
					phone_code: this.code
				})
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>

	.mask-content {
		position: absolute;
		bottom: 50rpx;
		left: 25rpx;
		width: 100%;
		width: 700rpx;
		height: 330rpx;
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

		.block {
			border-bottom: 1rpx solid #eee;
			display: flex;
			padding: 10rpx 20rpx;
			margin-top: 50rpx;
			align-items: center;
			justify-content: center;
			
			.input {
				flex-grow: 1;
				font-size: 28rpx;
				font-weight: 500;
			}
			.get-code-btn {
				font-size: 26rpx;
				font-weight: 700;
				color: #3461C5;
				min-width: 100rpx;
			}
		}
		
		.button-2c {
			display: flex;
			
			.button {
			
				padding: 0;
				margin: 50rpx auto 0rpx auto;
				width: 100%;
				border-radius: 50rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				background-color: #ffcc00;
				box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			
				&.daifu {
					margin-right: 30rpx;
					width: 300rpx;
					font-size: 28rpx;
					box-shadow: 0 0 0rpx rgba(255, 220, 0, 0.6);
				}
				
				&:after {
					border: none;
				}
				
				&.disabled {
					background-color: #ddd;
					box-shadow: 0 0 0rpx rgba(255, 220, 0, 0.6);
				}
			}
		}
	}
</style>
