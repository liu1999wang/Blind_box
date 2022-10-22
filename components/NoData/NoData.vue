<template>
	<view class="no-data"  :style="styleStr">
		<image src="https://cdn2.hquesoft.com/box/home/empty.png"></image>
		<view  class="text">{{title}}</view>
	</view>
</template>

<script>
	export default {
		name: "NoData",
		props: {
			title: {
				type: String,
				default ()  {
					return ''
				}
			},
			styleStr: {
			  type: String,
			  default () {
			    return ''
			  }
			}
		}
	}
</script>

<style lang="scss" scoped>
	.no-data {
		margin-top: 200rpx;
		overflow: hidden;
		image {
			width: 416rpx;
			height: 226rpx;
			display: block;
			margin: 0rpx auto 100rpx auto;
		}
		.text {
			text-align: center;
			font-size: 26rpx;
			color: #888;
		}
	}
</style>
