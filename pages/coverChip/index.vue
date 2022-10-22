<template>
	<view class="container">
		
		<!-- 我的 -->
		<navigator url="/pages/myChip/index">
			<view class="float-btn my global-shadow" hover-class="hover">
				<!-- <image mode="aspectFill" src="@/static/smallBox/my-box.png"></image> -->
				<text>碎片资产</text>
			</view>
		</navigator>
		
		<view class="cover-c">
			<view class="left">
				<image class="thumb" mode="aspectFill" :src="info.sku.thumb"></image>
				<view class="title">{{info.sku.title}}</view>
				<view class="total">X{{info.need_sku}}</view>
			</view>
			<view class="cover-text">
				兑换
			</view>
			<view class="right">
				<image class="thumb" mode="aspectFill" :src="info.chip.icon"></image>
				<view class="title">{{info.chip.title}}</view>
				<view class="total">X{{info.chip_total}}</view>
			</view>
		</view>
		
		<view class="tips">
			<view class="title">温馨提示：</view>
			<view class="content">
				盲盒兑换后将不再发货，兑换的碎片即时发放到您的碎片帐户中
			</view>
		</view>
		
		<view class="footer safe-area-bottom">
			<view class="footer-button" @click="submitCover" hover-class="hover">
				<text>确认兑换</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				skuId: '',
				info: {}
			}
		},
		onLoad(e) {
			this.skuId = e.sku_id
		},
		onShow () {
			uni.showLoading({
				title: '加载中'
			})
			this.$http('/cover-chip/info', 'POST', {
				sku_id: this.skuId
			}).then(res => {
				this.info = res.data
				uni.hideLoading()
			})
		},
		methods: {
			submitCover () {
				uni.showLoading({
					title: '兑换中，请稍候'
				})
				
				this.$http('/cover-chip', 'POST', {
					sku_id: this.skuId
				}).then(res => {
					uni.showToast({
						 'title': '兑换成功，即将跳转~',
						 'icon': 'none'
					})
					
					setTimeout(() => {
						uni.redirectTo({
							url: '/pages/myChip/index'
						})
					}, 1300)
				})
			}
		}
	}
</script>

<style lang="scss">
	.tips {
		margin: 100rpx 60rpx;
		
		.title {
			font-weight: 500;
			border-left: 6rpx solid #FFCC00;
			padding-left: 4rpx;
			margin-bottom: 10rpx;
		}
		.content {
			font-size: 90%;
		}
	}
	.cover-c {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 300rpx;
		
		.left {
			margin: 0rpx 10rpx;
			.thumb {
				background: #F8EFC5;
				border: 4rpx solid #FFB640;
				border-radius: 6rpx;
				width: 150rpx;
				height: 200rpx;
			}
			.title {
				font-weight: 500;
				font-size: 28rpx;
				text-align: center;
			}
			.total {
				text-align: center;
			}
		}
		
		.cover-text {
			margin: 0rpx 30rpx;
		}
		
		.right {
			margin: 0rpx 10rpx;
			.thumb {
				background: #F8EFC5;
				border: 4rpx solid #FFB640;
				border-radius: 6rpx;
				width: 150rpx;
				height: 200rpx;
			}
			.title {
				font-weight: 500;
				font-size: 28rpx;
				text-align: center;
			}
			.total {
				text-align: center;
			}
		}
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		// background-color: #fff;
	
		.footer-button {
			margin: 0 auto;
			margin-bottom: 60rpx;
			width: 660rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			border-radius: 200rpx;
		}
	}
	
	
	.float-btn {
		position: fixed;
		right: 0rpx;
		top: 260rpx;
		width: 150rpx;
		height: 66rpx;
		background: #FFEFB3;
		border-radius: 33px 0px 0px 33px;
		padding: 0rpx 14rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
	
		font-weight: 500;
		font-size: 24rpx;
	
		image {
			width: 30rpx;
			height: 36rpx;
		}
	
		&.my {
			top: 130rpx;
	
			image {
				width: 30rpx;
				height: 40rpx;
			}
		}
	}
	
</style>
