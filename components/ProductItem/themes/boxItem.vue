<template>
	<view class="item-container" :class="theme" @tap="toDetail" hover-class="hover">
		<!-- <image class="p-tag" src="@/static/new.png" v-if="tag == 'new'"></image> -->
		<image class="p-tag" :src="info.image_tag.image" v-if="info.image_tag"></image>
		<image mode="aspectFill" :src="info.thumb" class="thumb"></image>
		<view class="body">
			<view class="title">{{info.title}}</view>
			<view class="bottom">
				<view class="tag">{{info.tag || '人气新品'}}</view>
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
		width: 328rpx;
		// height: 460rpx;
		border-radius: 40rpx 40rpx 20rpx 20rpx;
		overflow: hidden;
		margin-bottom: 24rpx;
		box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
		position: relative;

		.thumb {
			width: 100%;
			height: 310rpx;
		}
		
		.p-tag {
			position: absolute;
			width: 100rpx;
			height: 100rpx;
			right: 0rpx;
			top: 0rpx;
		}

		.body {
			background: white;
			padding: 12rpx 21rpx 10rpx 21rpx;
			box-sizing: border-box;
			.title {
				font-size: 30rpx;
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
				display: inline-block;
				// padding: 2rpx 8rpx;
			}
			
			.price {
				text-align: right;
				font-size: 30rpx;
				font-weight: 800;
				color: #DE1124;
			}
		}
	}
	
	.theme-1 {
		height: 400rpx;
		.body {
			border-radius: 20rpx;
			overflow: hidden;
			position: relative;
			top: -30rpx;
			
			.bottom {
				display: flex;
				align-items: center;
				justify-content: space-between;
			}
		}
	}
</style>
