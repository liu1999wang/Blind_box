<template>
	<view class="search-bar" @tap="toSearch" hover-class="hover">
		<text class="new-iconfont icon-search search-icon"></text>
		<text>{{module.title || '搜索更多新奇商品'}}</text>
	</view>
</template>

<script>
	export default {
		props: {
			module: {
				type: Object,
				default () {
					return {
						
					}
				}
			}
		},
		data() {
			return {}
		},
		computed: {
		},
		mounted() {
		},
		watch: {},
		methods: {
			toSearch () {
				uni.navigateTo({
					url: '/pages/search/index?type=all'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.search-bar {
		background: #F0F0F0;
		color: gray;
		padding: 0rpx 20rpx;
		border-radius: 4rpx;
		font-size: 26rpx;
		line-height: 70rpx;
		display: flex;
	}
	.search-icon {
		font-size: 30rpx;
		color: black;
		margin-right: 20rpx;
	}
</style>
