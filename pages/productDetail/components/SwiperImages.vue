<template>
	<view class="swiper-wrapper">
		<swiper class="swiper" autoplay @change="change">
			<swiper-item v-for="item in images" :key="item">
				<image :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="current">
			{{current}}/{{images.length}}
		</view>
	</view>
</template>

<script>
	export default {
		name: "SwiperImages",
		data() {
			return {
				current: 1
			}
		},
		props: {
			images: {
				type: Array,
				default () {
					return []
				}
			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current + 1
			}
		}
	}
</script>

<style lang="scss">
	.swiper-wrapper {
		width: 750upx;
		height: 750upx;
		position: relative;

		.swiper {
			width: 100%;
			height: 100%;

			image {
				width: 100%;
				height: 100%;
				display: block
			}
		}
		
		.current {
			line-height: 1.2;
			position: absolute;
			bottom: 24upx;
			right: 24upx;
			font-size: 26upx;
			color: #FFFFFF;
			background: rgba(0, 0, 0, 0.4);
			padding: 4rpx 20rpx;
			border-radius: 20rpx;
		}
	}
</style>
