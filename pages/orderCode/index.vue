<template>
	<view class="container">
		<view class="tips">请等待管理员扫码核销</view>
		<view class="code">{{info.code}}</view>
		<image :src="'data:image/png;base64,' + info.qrcode" class="qrcode" mode="widthFix"></image>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				uuid: '',
				info: {}
			}
		},
		onLoad(e) {
			this.uuid = e.uuid
		},
		onShow () {
			uni.showLoading({
				title: '加载中'
			})
			this.$http(`/orders/${this.uuid}/offline/verify-info`).then(res => {
				this.info = res.data.info
				uni.hideLoading()
			})
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	.tips {
		color: #666;
		font-size: 28rpx;
		text-align: center;
		margin-top: 300rpx;
	}
	
	.code {
		text-align: center;
		font-size: 40rpx;
		font-weight: 700;
		margin-top: 100rpx;
		margin-bottom: 20rpx;
	}
	
	.qrcode {
		width: 400rpx;
		height: 400rpx;
		margin: 0rpx auto;
		display: block;
	}
</style>
