<template>
	<view class="list">
		<view class="item" :class="{disableLine: !line}" v-for="(item, index) in list" :key="item.uuid" @tap="toProductDetail(item)">
			<!-- <image :src="item.thumb" class="thumb"></image> -->
			<view class="thumb-c">
				<image class="p-tag" :class="theme + ' ' + grid + ' location-' + item.image_tag.location" :src="item.image_tag.image"
				 v-if="item.image_tag"></image>
				<image mode="aspectFill" :src="item.thumb + '?x-oss-process=image/resize,w_500'" class="thumb"></image>
				<view class="presell-c" v-if="item.is_presell">预售</view>
				<view class="empty-stock"  v-if="item.stock === 0">
					<image src="@/static/empty-stock.png" mode="widthFix"></image>
				</view>
			</view>
			<view class="right">
				<!-- <view class="category">{{item.sub_title}}</view> -->
				<view class="title">
					<text class="title-tag" v-if="item.item_type === 'box'">盲盒</text>
					<!-- <text class="title-tag product" v-else-if="item.item_type === 'product'">商品</text> -->
					<text class="title-tag activity" v-else-if="item.item_type === 'activity'">活动</text>
					{{item.title}}
				</view>
				<view class="tag-list">
					<view class="tag-item" :key="index" v-for="(item, index) in item.tags">{{item}}</view>
				</view>
				<view class="price-c">
					<PriceDisplay :info="item"></PriceDisplay>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "ProductList",
		props: {
			list: {
				type: Array
			},
			line: {
				type: Boolean,
				default: () => {
					return true
				}
			}
		},
		data() {
			return {
				theme: 'default',
				grid: 'default-grid'
			}
		},
		methods: {
			toProductDetail(item) {
				console.log('click ====>', item)
				let url = '';
				if (item.item_type == 'product') {
					url = '/pages/productDetail/index?uuid=' + item.uuid
				} else if (item.item_type == 'box') {
					url = '/pages/boxDetail/index?uuid=' + item.uuid
				} else if (item.item_type == 'activity') {
					
					if (item.type === 'egg_lottery') {
						url = `/pages/eggLottery/detail?uuid=${item.uuid}`
					}
					else {
						url = `/pages/${item.type}Activity/detail?uuid=${item.uuid}`
					}
					
				}
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.list {
		.item {
			display: flex;
			padding: 20rpx 0rpx;
			border-bottom: 1rpx solid #F1F1F1;

			&.disableLine {
				border-bottom: 0rpx solid #F1F1F1;
			}
			
			.thumb-c {
				position: relative;
				
				width: 140rpx;
				height: 140rpx;
				margin-right: 30rpx;
				border-radius: 20rpx;
				flex: 0 0 140rpx;
				overflow: hidden;
			
				.thumb {
					width: 140rpx;
					height: 140rpx;
					display: block;
				}
				
				.presell-c {
					position: absolute;
					width: 100%;
					text-align: center;
					background: rgba(230, 49, 17, 0.5);
					color: white;
					left: 0rpx;
					bottom: 0rpx;
					font-size: 24rpx;
					padding: 6rpx 0rpx;
				}
			
				.p-tag {
					position: absolute;
					width: 70rpx;
					height: 70rpx;
					// right: 0rpx;
					top: 0rpx;
			
					// 右上角
					&.location-1 {
						right: 0rpx;
					}
			
					// 右上角
					&.location-2 {
						left: 0rpx;
					}
			
					&.grid2 {
						width: 100rpx;
						height: 100rpx;
					}
			
				}
				
				.empty-stock {
					position: absolute;
					width: 100%;
					height: 100%;
					top: 0rpx;
					left: 0rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					image {
						width: 50%;
					}
					background: rgba(0, 0, 0, 0.5);
				}
			}

			.category {
				// background:rgba(241,241,241,1);
				color: #393939;
				font-size: 22rpx;
				display: inline-block;
				margin: 20rpx 0rpx 10rpx 0rpx;
				// padding: 4rpx 8rpx;
			}

			

			.title {
				color: #393939;
				font-size: 28rpx;
				font-weight: bold;
				// min-height: 100rpx;
				margin-top: 20rpx;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;

				.title-tag {
					height: 40rpx;
					line-height: 40rpx;
					background: #FFCC09;
					border-radius: 16px;
					color: white;
					font-size: 22rpx;
					padding: 0rpx 14rpx;
					margin-right: 10rpx;

					&.activity {
						background: #F27233;
					}
				}
			}

			.tag-list {
				display: flex;

				.tag-item {
					height: 36rpx;
					background: #F7F7F7;
					border-radius: 50rpx;
					font-size: 22rpx;
					font-weight: 500;
					color: #999999;
					line-height: 36rpx;
					padding: 0rpx 12rpx;
					max-width: 180rpx;
					margin-right: 10rpx;

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
			}

			.price-c {
				color: #FF3535;
				font-weight: 500;
				margin-right: 20rpx;


				.line-price {
					color: #B3B3B3;
					font-size: 24rpx;
					text-decoration: line-through;
				}
			}

			.sale {
				color: #B3B3B3;
				font-size: 24rpx;
				margin-right: 20rpx;
			}
		}
	}
</style>
