<template>
	<view class="container">
		<Banner :list="banner" iStyle="height: 400rpx;" v-if="banner.length"></Banner>
		<view class="content">
			<view class="item global-shadow" hover-class="hover" @tap="toList(item)" v-for="(item, index) in ipList">
				<image class="thumb" :src="item.thumb"></image>
				<view class="title">{{item.title}}</view>
				<view class="total">共{{item.item_total}}款</view>
			</view>

			<NoData v-if="!ipList.length"></NoData>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				ipList: [],
				setting: {}
			}
		},
		computed: {
			banner() {
				return this.setting.banner || []
			}
		},
		async onLoad(e) {
			this.$http('/ip/categories').then(res => {
				this.ipList = res.data.list
			})

			this.$http('/setting/ip_list').then(res => {
				this.setting = res.data.setting
			})
		},
		methods: {
			toList(item) {
				uni.navigateTo({
					url: `/pages/search/index?type=all&category_id=${item.id}&title=${item.title}`
				})
			}
		}
	}
</script>

<style lang="scss">
	page {}
</style>

<style lang="scss" scoped>
	.container {
		// padding-left: 200rpx;
		// background: url('https://cdn2.hquesoft.com/box/ip.png');
		// background-size: 100% auto;
		// padding-top: 300rpx;
	}

	.content {
		background: #FDFDFC;
		padding-top: 30rpx;
		border-radius: 20rpx 20rpx 0rpx 0rpx;
		overflow: hidden;
		// margin-top: -20rpx;
		// position: relative;
		position: relative;
		// border: 1px solid red;
		top: -10rpx;
		min-height: 96vh;
	}


	.item {
		width: 160rpx;
		margin-bottom: 30rpx;
		margin-left: 20rpx;
		padding: 20rpx 0rpx;

		width: 160rpx;

		background: #FFFFFF;
		border-radius: 20rpx;
		text-align: center;
		float: left;

		.thumb {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
		}

		.title {
			font-size: 28rpx;
			text-align: center;
			width: 160rpx;

			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;

			font-size: 22rpx;
			font-weight: bold;
			color: #000000;
			line-height: 40rpx;
			height: 46rpx;
		}

		.total {
			font-size: 20rpx;
			font-weight: 500;
			color: #999999;
			line-height: 40rpx;
		}
	}
</style>
