<template>
	<view class="swiper-wrap" :style="iStyle">
		<swiper autoplay @change="change">
			<swiper-item v-for="(item, index) in list" :key="index">
				<image mode="aspectFill" :src="item.image + '?x-oss-process=image/resize,w_1200'"  :style="imageStyle" class="slide-image" :data-item="item" @tap="handleClick" />
			</swiper-item>
		</swiper>
		<view class="dots" :style="dotListStyle">
			<view class="dot-item" :class="{active:current===index}" v-for="(item,index) in list" :key="index"></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "Banner",
		props: {
			list: {
				type: Array
			},
			iStyle: {
				type: String
			},
			imageStyle: {
				type: String
			},
			dotListStyle: {
				type: String
			}
		},
		data() {
			return {
				current: 0
			}
		},
		methods: {
			change(e) {
				this.current = e.detail.current
			},
			handleClick(e) {
				let item = e.currentTarget.dataset.item
				let link = item.link || {}
				this.toLink(link)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.swiper-wrap {
		width: 100%;
		height: 100%;
		position: relative;

		swiper {
			height: 100%;
			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	.dots {
		position: absolute;
		left: 0;
		bottom: 30rpx;
		width: 100%;
		height: 8rpx;
		display: flex;
		justify-content: center;

		.dot-item {
			margin: 0 6rpx;
			width: 10rpx;
			height: 10rpx;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.6);
			transition: all 0.4s;

			&.active {
				border-radius: 6rpx;
				width: 26rpx;
				background-color: #FD9D11;
			}
		}
	}
</style>
