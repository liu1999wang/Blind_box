<template>
	<view class="item-container" :class="theme" @tap="toDetail" hover-class="hover">
		<image class="p-tag" src="@/static/new.png" v-if="tag == 'new'"></image>
		<image mode="aspectFill" :src="info.thumb + '?x-oss-process=image/resize,w_500'" class="thumb"></image>
		<view class="body">
			<view class="title">{{info.title}}</view>
			<view class="bottom">
				<!-- <view class="tag">{{tagString}}</view> -->
				<view class="price">
					<PriceDisplay :info="info"></PriceDisplay>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object,
				default () {
					return {}
				}
			},
			tag: {
				type: String
			},
			theme: {
				type: String,
				default () {
					return 'default-theme'
				}
 			}
		},
		data() {
			return {}
		},
		computed: {
			tagString () {
				return  this.info && this.info.tags && this.info.tags[0] || ' '
			}
		},
		methods: {
			toDetail () {
				uni.navigateTo({
					url: '/pages/productDetail/index?uuid=' + this.info.uuid
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-container {
		// width: 230rpx;
		// height: 460rpx;
		// width: 30%;
		border-radius: 20rpx 20rpx 10rpx 10rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
		position: relative;

		.thumb {
			width: 100%;
			height: 180rpx;
		}
		
		.p-tag {
			position: absolute;
			width: 60rpx;
			height: 60rpx;
			right: 0rpx;
			top: 0rpx;
		}

		.body {
			background: white;
			padding: 4rpx 14rpx 10rpx 14rpx;
			box-sizing: border-box;
			.title {
				font-size: 26rpx;
				font-weight: 500;
				color: #000000;

				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.tag {
				height: 36rpx;
				background: #F7F7F7;
				border-radius: 50rpx;
				font-size: 22rpx;
				font-weight: 500;
				color: #999999;
				line-height: 36rpx;
				padding: 0rpx 12rpx;
				max-width: 180rpx;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}
			
			.price {
				text-align: right;
				font-size: 26rpx;
				font-weight: 800;
				color: #DE1124;
			}
		}
	}
	
	// .theme-1 {
	// 	height: 400rpx;
	// 	.body {
	// 		border-radius: 20rpx;
	// 		overflow: hidden;
	// 		position: relative;
	// 		top: -30rpx;
			
	// 		.bottom {
	// 			display: flex;
	// 			align-items: center;
	// 			justify-content: space-between;
	// 		}
	// 	}
	// }
</style>
