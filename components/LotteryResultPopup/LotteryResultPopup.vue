<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap.stop="cancel"></text>
			<view class="title">恭喜您获得</view>
			
			<view class="sku-list">
				<view class="item" v-for="(item, index) in skus">
					<image class="thumb" mode="aspectFill" :src="item.thumb"></image>
					<view class="body">
						<view class="sku-title">{{item.title}}</view>
						<view class="total">x{{item.total}}件</view>
					</view>
					<view class="dot dot1"></view>
					<view class="dot dot2"></view>
				</view>
			</view>

			<view class="btn-c">
				
				<template v-if="sku.sku_type == 3">
					<button class="btn submit bg-yellow" @tap="toBoxDetail">查看奖品</button>
				</template>
				<template v-else>
					<button class="btn cancel bg-purple" @tap="toMyBox">去赠送</button>
					<button class="btn submit bg-yellow deliver-btn" @tap="toMyBox">去发货</button>
				</template>
				
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
			}
		},
		props: {
			skus: {
				type: Array
			}
		},
		computed: {
			sku () {
				return this.skus[0] || {}
			}
		},
		watch: {
		},
		onLoad(e) {
			
		},
		created() {
		},
		methods: {
			toBoxDetail () {
				uni.navigateTo({
					url: '/pages/myBox/detail?uuid=' + this.sku.uuid
				})
			},
			toMyBox() {
				uni.navigateTo({
					url: '/pages/myBox/index'
				})
			},
			cancel() {
				this.$emit('cancel')
			},
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.mask {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.mask-content {
		width: 660rpx;
		// height: 680rpx;
		background-color: #DB5B4E;
		// background-color: white;
		border-radius: 20rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 60rpx 60rpx 50rpx 60rpx;
		box-sizing: border-box;
		position: relative;
	
		.close-btn {
			position: absolute;
			right: 26rpx;
			top: 26rpx;
	
			color: #333;
		}
	
		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
			color: #F6F1C9;
			letter-spacing: 6rpx;
			margin-bottom: 50rpx;
			position: relative;
			
			&:after, &:before {
				position: absolute;
				top: 50%;
				background: #ddd;
				content: "";
				height: 1px;
				width: 50rpx;
			}
			/*调整背景横线的左右距离*/
			&:before {
				left: 100rpx;
			}
			&:after {
				right: 100rpx;
			}
		}
		
		.sku-list {
			.item {
				background: white;
				display: flex;
				align-items: center;
				padding: 20rpx 30rpx;
				border-radius: 20rpx;
				position: relative;
				margin-bottom: 10rpx;
				
				.thumb {
					width: 140rpx;
					height: 140rpx;
					border-radius: 16rpx;
					margin-right: 20rpx;
					flex: 0 0 140rpx;
				}
				
				.body {
					
				}
				
				.sku-title {
					font-size: 32rpx;
					font-weight: 500;
					margin-bottom: 10rpx;
					
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
				
				.total {
					color: gray;
					font-size: 28rpx;
				}
				
				.dot {
					background-color: #DB5B4E;
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					position: absolute;
					top: 70rpx;
					
					&.dot1 {
						left: -20rpx;
					}
					
					&.dot2 {
						right: -20rpx;
					}
				}
			}
		}
	
		.btn-c {
			display: flex;
			align-items: center;
			justify-content: center;
	
			.btn {
				padding: 0;
				margin: 50rpx 0rpx 0rpx 0rpx;
				width: 46%;
				border-radius: 20rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				background-color: #ffcc00;
				// box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
				color: white;
	
				&:after {
					border: none;
				}
	
				&.submit {}
				
				&.deliver-btn {
					margin-left: 50rpx;
				}
			}
		}
	}
</style>
