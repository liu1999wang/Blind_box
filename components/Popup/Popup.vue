<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content animated bounceInDown" @tap.stop>
			<image :src="info.image" class="thumb" mode="widthFix" @tap="toLink"></image>
			
			<view class="close-btn" @tap="close">
				<text class="new-iconfont icon-wrong"></text>
			</view>
			
		</view>
		
<!-- 		<view class="close-btn animated bounceInRight" @tap="">
			<text class="new-iconfont icon-wrong"></text>
		</view> -->
		
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
			info: {
				type: Object
			}
		},
		computed: {},
		watch: {},
		onLoad(e) {

		},
		created() {
		},
		methods: {
			close() {
				this.$emit('close')
			},
			toLink() {
				this.toLink(this.info.link)
				this.$emit('close')
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.small-text {
		// font-size: 80%;
	}

	.mask {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mask-content {
		width: 660rpx;
		// min-height: 680rpx;
		// height: 680rpx;
		// background-color: #EDEDED;
		// background-color: white;
		border-radius: 20rpx;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		// padding: 30rpx 20rpx 50rpx 20rpx;
		box-sizing: border-box;
		position: relative;

		// .close-btn {
		// 	position: absolute;
		// 	right: 26rpx;
		// 	top: 26rpx;

		// 	color: #999;
		// }
		
		.thumb {
			width: 660rpx;
		}
		
		.close-btn {
			border: 4rpx solid white;
			border-radius: 50%;
			font-size: 40rpx;
			width: 80rpx;
			height: 80rpx;
			// margin-top: 10rpx;
			line-height: 80rpx;
			text-align: center;
			color: white;
			// border: 1px solid red;
			margin: 10rpx auto 0rpx auto;
		}
	}
</style>
