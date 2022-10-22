<template>
	<view class="item-container row1" :class="theme" @tap="toDetail" hover-class="hover">
		<!-- <image class="p-tag" src="@/static/new.png" v-if="tag == 'new'"></image> -->
		<view class="thumb-c">
			<image class="p-tag" :class="'location-' + info.image_tag.location" :src="info.image_tag.image" v-if="info.image_tag"></image>
			<image mode="widthFix" :src="info.thumb + '?x-oss-process=image/resize,w_300'" class="thumb"></image>
			<view class="presell-c" v-if="info.is_presell">预售</view>
		</view>
		<view class="body">
			<view class="title">{{info.title}}</view>
			<view class="bottom">
				<view class="tag">{{tagString}}</view>
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
			tagString() {
				return this.info && this.info.tags && this.info.tags[0] || ' '
			}
		},
		methods: {
			toDetail() {
				uni.navigateTo({
					url: '/pages/boxDetail/index?uuid=' + this.info.uuid
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-container {
		// width: 230rpx;
		// height: 460rpx;
		// width: 100%;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
		position: relative;
		
		display: flex;
		flex-grow: 1;
		box-sizing: border-box;
		// padding: 36rpx 0rpx;
		border-bottom: 1rpx solid #F1F1F1;
		
		// border: 1px solid green;

		.thumb-c {
			position: relative;
			flex: 0 0 210rpx;
			// z-index: 100;
			.thumb {
				width: 210rpx;
				height: 210rpx;
				// height: 680rpx;
				display: block;
				flex: 0 0 210rpx;
			}

			.presell-c {
				position: absolute;
				width: 100%;
				text-align: center;
				background: rgba(230, 49, 17, 0.5);
				color: white;
				left: 0rpx;
				bottom: 0rpx;
				font-size: 24rpx;
				padding: 6rpx 0rpx;
			}

			.p-tag {
				position: absolute;
				width: 80rpx;
				height: 80rpx;
				// right: 0rpx;
				top: 0rpx;
				// z-index: 20000;
				// left: 0rpx;
				// background: red;

				// 右上角
				&.location-1 {
					right: 0rpx;
				}

				// 右上角
				&.location-2 {
					left: 0rpx;
				}
			}
		}

		.body {
			background: white;
			padding: 24rpx 22rpx 16rpx 22rpx;
			// box-sizing: border-box;
			box-sizing: border-box;
			white-space: pre-wrap;
			// flex-grow: 1;
			flex-grow: 1;
			flex: 1;
			display: flex;
			flex-direction: column;
			justify-content: center;
			
			// border: 1px solid red;

			.title {
				font-size: 32rpx;
				font-weight: 500;
				color: #000000;

				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.tag {
				height: 36rpx;
				background: #F7F7F7;
				border-radius: 50rpx;
				font-size: 26rpx;
				font-weight: 500;
				color: #999999;
				line-height: 36rpx;
				padding: 0rpx 12rpx;
				max-width: 180rpx;
				display: inline;

				overflow: hidden;
				text-overflow: ellipsis;
				// display: -webkit-box;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
			}

			.price {
				text-align: right;
				font-size: 36rpx;
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
