<template>
	<view class="item-container  grid1" :class="theme" hover-class="hover" @tap="$emit('click')">
		<!-- <image class="p-tag" src="@/static/new.png" v-if="tag == 'new'"></image> -->
		<view class="thumb-c">
			<image class="p-tag" :class="'location-' + info.image_tag.location" :src="info.image_tag.image" v-if="info.image_tag"></image>
			<image mode="widthFix" :src="info.thumb + '?x-oss-process=image/resize,w_300'" class="thumb"></image>
			<view class="presell-c" v-if="info.is_presell">预售</view>
		</view>
		<view class="body">
			<view class="title">{{info.title}}</view>
			<view class="bottom">
				<view class="tag"><image mode="heightFix" src="https://www.hebide.cc/newimages/newyi/tag.png"></image> {{tagString}}</view>
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
			},
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
		margin-bottom: 36rpx;
		box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
		position: relative;

		.thumb-c {
			position: relative;

			.thumb {
				width: 100%;
				// width: 600rpx;
				// height: 680rpx;
				display: block;
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
				width: 150rpx;
				height: 150rpx;
				// right: 0rpx;
				top: 0rpx;

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
			padding: 12rpx 22rpx 16rpx 22rpx;
			box-sizing: border-box;

			.title {
				font-size: 32rpx;
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
