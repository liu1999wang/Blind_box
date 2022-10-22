<template>
	<view class="item-scope">
		<image class="thumb" :src="info.thumb  + '?x-oss-process=image/resize,w_300'" mode="aspectFill"></image>
		<view class="product-info">
			<view class="product-title">
				{{info.title}}
			</view>
			<view class="product-attrs gray" v-if="info.attrs&&info.attrs.length">
				{{info.attrs | productAttrsToString}}
			</view>
			<!-- <view class="number" v-if="info.number">
				{{info.number}}
			</view> -->
			<view class="price-c" v-if="boxDepotConfig.is_show_price">
				<PriceDisplay :info="info"></PriceDisplay>
				<!-- ¥{{item.price|priceToFixed}} -->
			</view>
		</view>
		<view class="count-c">
				x{{info.total}}
		</view>
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js";
	export default {
		mixins: [mixin],
		props: {
			info: {
				type: Object
			},
			disableClick: {
				type: Boolean,
				default () {
					return false
				}
			}
		},
		filters: {},
		computed: {
			boxDepotConfig() {
				return this.$store.getters.setting.box_depot || {}
			},
		},
		methods: {
			toProductDetail(index) {
				if (this.disableClick) {
					return false
				}
				let item = this.info
				if (item.product_type === 'product') {
					uni.navigateTo({
						url: '/pages/productDetail/index?uuid=' + item.product_uuid
					})
				} else if (item.product_type === 'box') {
					uni.navigateTo({
						url: '/pages/boxDetail/index?uuid=' + item.product_uuid
					})
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.item-scope {
		display: flex;
		padding: 24upx 24upx;
		position: relative;
		align-items: center;

		.thumb {
			width: 120upx;
			height: 120upx;
			border-radius: 8rpx;
		}

		.product-info {
			flex: 1;
			margin-left: 24upx;

			.product-title {
				line-height: 36rpx;
				font-size: 28rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 2;
				overflow: hidden;

				font-size: 26rpx;
				font-weight: bold;
				color: #000000;
			}

			.product-attrs {
				margin-top: 16upx;
				font-size: 24upx;
			}
		}

		.price-c {
			// width: 140upx;
			// text-align: right;
			// display: flex;
			// align-items: flex-end;
			// flex-direction: column;
			// justify-content: space-between;
			font-size: 28rpx;
			color: #666;
			margin-top: 6rpx;
		}
		
		.count-c {
			font-size: 28upx;
			margin-top: 20upx;
			font-weight: 500;
		}

	}
</style>
