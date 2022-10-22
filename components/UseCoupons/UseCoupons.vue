<template>
	<view class="mask" @touchmove.stop @tap="hideMask">
		<view class="scroll-view-wrap">
			<scroll-view scroll-y>
				<view class="list-wrap safe-area-bottom" style="overflow: hidden;">
					<view class="coupon-item active" v-for="coupon in coupons" :key="coupon.id">
						<view class="discount-money">
							<view class="price">
								<text class="unit">¥</text>
								<text>{{coupon.base_coupon.discount_money/100}}</text>
							</view>
						</view>
						<view class="detail">
							<view class="title">
								<text>{{coupon.base_coupon.title}}</text>
							</view>
							<view class="use-type">
								<text>指定{{coupon.base_coupon.usable_range_type===0?"摇盒":"商品"}}使用</text>
							</view>
							<view class="limit-money">
								<text>使用立减{{coupon.base_coupon.discount_money/100}}元</text>
							</view>
						</view>
						<view class="action">
							<view class="btn" @tap.stop="handleClick(coupon)">
								立即使用
							</view>
						</view>
					</view>
					
					<view style="height: 130rpx;"></view>
				</view>
			</scroll-view>
			<view class="close-btn-wrap safe-area-bottom">
				<view class="close-button" @tap.stop="hideMask">
					关闭
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "UseCoupons",
		props: {
			coupons: Array
		},
		methods: {
			hideMask() {
				this.$emit("hide")
			},
			handleClick(e) {
				this.$emit("change", e)
			}
		}
	}
</script>

<style lang="scss">
	.scroll-view-wrap {
		width: 100%;
		height: 750rpx;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-radius: 10rpx 10rpx 0 0;
		animation: showcontent 0.4s;
		
		scroll-view {
			width: 100%;
			height: 100%;
		}
		
		.close-btn-wrap {
			position: absolute;
			width: 300rpx;
			height: 84rpx;
			text-align: center;
			line-height: 84rpx;
			bottom: 40rpx;
			left: 225rpx;
			
			view {
				background-color: #ffcc00;
				font-weight: bold;
				font-size: 30rpx;
				box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
				border-radius: 44rpx;
			}
		}
	}
	
	@keyframes showcontent {
		from {
			bottom: -750rpx;
		}
	
		to {
			bottom: 0;
		}
	}

	.coupon-item {
		margin: 24rpx 24rpx;
		background-color: #fff;
		border-radius: 10upx;
		overflow: hidden;
		display: flex;
		align-items: center;
		position: relative;
		box-shadow: 0 0 20rpx rgba(209, 209, 209, 0.5);

		&.unactive {
			.discount-money {
				color: #A5A7B2;
			}

			.detail {
				color: #A5A7B2;
			}

			.action .btn {
				background-color: #BBBBBB;
				color: #fff;
			}
		}

		&.active {
			.discount-money {
				color: #f52302;
			}

			.action .btn {
				background-color: #ffcc00;
				color: #fff;
			}
		}

		.discount-money {
			width: 180upx;
			height: 180upx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			font-weight: bold;

			.price {
				font-size: 54upx;

				.unit {
					font-size: 20upx;
				}
			}
		}

		.detail {
			flex: 1;

			.title {
				font-size: 30upx;
				display: flex;
				align-items: center;
				font-weight: bold;
			}

			.use-type {
				font-size: 24upx;
				margin-top: 10upx;
				color: #999;
			}

			.limit-money {
				font-size: 22upx;
				margin-top: 10upx;
				color: #999;
			}
		}

		.action {
			width: 180upx;
			display: flex;
			justify-content: center;

			view {
				width: 130upx;
				line-height: 44upx;
				font-size: 22upx;
				text-align: center;
				border-radius: 1000upx;
			}
		}
	}
</style>
