<template>
	<view class="item-scope" @tap="toDetail" hover-class="hover">
		<view class="header">
			<image :src="info.user.headimg" class="headimg" mode="aspectFit"></image>
			<view class="middle">
				<view class="name">{{info.user.name}}</view>
				<view class="time">{{$tool.showShortTime(info.created_at)}}发起</view>
			</view>
			<view class="status" :class="info.union_status">
				{{info.union_status_text}}
			</view>
		</view>
		
		<view class="product-list">
			<view class="item" v-for="(item, index) in info.package_skus">
				<image :src="item.thumb" class="thumb" mode="aspectFit"></image>
				<view class="title">
					{{item.title}} ({{item.total}}件)
				</view>
			</view>
		</view>
		
		<view class="bottom">
			<view class="left">
				共 
				<span class="total">{{productTotal}}</span> 
				件  
				一口价 
				<span class="price">
					<PriceDisplay :info="info"></PriceDisplay>
				</span>
			</view>
			<view class="right">
				<button class="button buy bg-orange" @tap="toDetail" v-if="info.union_status === 'pending'">去购买</button>
				<button class="button buy bg-cancel" @tap="toDetail" v-else>查看</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			info: {
				type: Object
			}
		},
		components: {
		},
		data() {
			return {
			}
		},
		computed: {
			productTotal () {
				let sum = 0  
				this.info.package_skus.map(item => {
					sum += item.total
				})
				return sum
			}
		},
		filters: {
		},
		created() {
		},
		destroyed() {
		},
		methods: {
			toDetail () {
				uni.navigateTo({
					url: '/pages/resale/detail?uuid=' + this.info.uuid
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item-scope {
		background: white;
		padding: 20rpx 30rpx;
		margin-bottom: 20rpx;
		border-radius: 6rpx;
	}
	
	.header {
		display: flex;
		align-items: center;
		.headimg {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			margin-right: 20rpx;
		}
		.name {
			font-weight: 500;
			font-size: 26rpx;
		}
		.time {
			font-size: 22rpx;
			font-weight: 500;
		}
		.middle {
			flex-grow: 1;
		}
		.status {
			font-size: 28rpx;
			font-weight: 500;
			
			&.pending {
				color: #555195;
			}
			
			&.completed {
				color: #2BA246;
			}
			
			&.closed {
				color: #E63111;
			}
		}
	}
	
	.product-list {
		margin-top: 20rpx;
		display: flex;
		.item {
			width: 160rpx;
			flex: 0 0 160rpx;
			text-align: center;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
			.thumb {
				border-radius: 4rpx;
				border: 1rpx solid #f1f1f1;
				width: 100rpx;
				height: 100rpx;
			}
			.title {
				font-size: 26rpx;
				font-weight: 500;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
		}
	}
	
	.bottom {
		margin-top: 20rpx;
		font-size: 28rpx;
		display: flex;
		.total {
			color: red;
			font-weight: 500;
			margin: 0rpx 4rpx;
		}
		.price {
			color: red;
		}
		
		.left {
			flex-grow: 1;
			
		}
		.right {
			.button {
				padding: 0;
				margin: 0;
				margin-left: 20upx;
				width: 150upx;
				height: 50upx;
				line-height: 50upx;
				font-size: 24upx;
				border-radius: 1000px;
				position: relative;
				
				// color: #F27233;
				// border: 1px solid #F27233;
				
				&.bg-white {
					box-shadow: 0 2upx 8upx #cfcfcf;
				}
				
				&:after {
					border: none;
				}
			}
		}
	}
</style>
