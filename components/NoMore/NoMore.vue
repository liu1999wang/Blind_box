<template>
	<view class="no-more">
		<view class="text">{{title}}</view>
	</view>
</template>

<script>
	export default {
		name: "NoMore",
		props: {
			title: {
				type: String,
				default ()  {
					return '已加载完了哦~'
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.no-more {
		height: 120rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		.text {
			text-align: center;
			font-size: 26rpx;
			color: #ccc;
		}
	}
</style>
