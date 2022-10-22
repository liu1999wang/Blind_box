<template>
	<view class="container">
		
		<!-- 规则 -->
		<navigator url="/pages/rule/index?type=chip">
			<view class="float-btn rule" hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/rule.png"></image>
				<text>规则</text>
			</view>
		</navigator>
		
		<view class="list">
			<view class="item" v-for="(item, index) in list">
				<image :src="item.icon" mode="aspectFill" class="thumb"></image>
				<view class="title">{{item.title}}</view>
				<view class="balance">{{item.balance}}</view>
			</view>
		</view>
		<NoData v-if="!list.length"></NoData>
	</view>
</template>

<script>
	export default {
		components: {
		},
		data() {
			return {
				list: []
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			this.$http('/chip-assets').then(res => {
				this.list = res.data.list
				
				uni.hideLoading()
			})
		},
		methods: {
		}
	}
</script>

<style lang="scss">
	page {
		background: #fefefe;
	}
	
	.float-btn {
		position: fixed;
		right: 0rpx;
		top: 160rpx;
		width: 130rpx;
		height: 66rpx;
		background: #FFEFB3;
		border-radius: 33px 0px 0px 33px;
		padding: 0rpx 14rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;
		
		z-index: 100;
	
		font-weight: 500;
		font-size: 24rpx;
	
		image {
			width: 30rpx;
			height: 36rpx;
		}
	}
	
	
	.list {
		padding: 10rpx 20rpx;
		.item {
			display: flex;
			background-color: #fff;
			align-items: center;
			margin-top: 20rpx;
			
			box-shadow: 0px 6rpx 30rpx 0px rgba(226, 222, 204, 0.5);
			border-radius: 20rpx;
			padding: 20rpx 30rpx;
			
			.thumb {
				width: 130rpx;
				height: 130rpx;
				border-radius: 10rpx;
			}
			.title {
				font-weight: 500;
				flex-grow: 1;
				margin-left: 10rpx;
			}
			.title {
				font-weight: 500;
				flex-grow: 1;
				margin-left: 10rpx;
			}
		}
	}
</style>
