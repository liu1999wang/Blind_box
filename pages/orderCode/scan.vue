<template>
	<view class="container">
		<view v-if="!order.id" @tap="scan">
			<image class="scan" src="https://bus-cdn.hquesoft.com/box/scan.png" />
			<view class="tips">点击扫码</view>
		</view>
		<view v-else class="order-c">
			<view class="address-c padding" v-if="address.consignee">
				<view class="al-icon-coordinates"></view>
				<view class="body">
					<view class="name">
						<text>{{address.consignee}}</text>
						<text style="padding-left:16upx;">{{address.phone}}</text>
					</view>
					<view class="detail">
						<text>{{address.province}} {{address.city}} {{address.district}} {{address.address}}</text>
					</view>
				</view>
			</view>

			<view class="products-c">
				<SkuItem class="sku" :info="item" v-for="(item, index) in skus"></SkuItem>
			</view>

			<view class="price-wrap padding-h">
				<view class="list-item">
					<view class="body">
						商品总价
					</view>
					<view class="arrow-right">
						<PriceDisplay :info="order" prefix="product_"></PriceDisplay>
					</view>
				</view>
				<view class="list-item">
					<view class="body">
						优惠券
					</view>
					<view class="arrow-right">
						-¥{{order.coupon_discount|priceToFixed}}
					</view>
				</view>
				<view class="list-item">
					<view class="body">
						红包
					</view>
					<view class="arrow-right">
						-¥{{order.redpack_discount|priceToFixed}}
					</view>
				</view>
				<view class="list-item">
					<view class="body">
						运费
					</view>
					<view class="arrow-right">
						+¥{{order.carriage|priceToFixed}}
					</view>
				</view>
				<view class="total-price border-top">
					<view style="padding-left:14upx;">
						<text class="key">实付:</text>
						<view class="price-c">
							<PriceDisplay :info="order" prefix="pay_"></PriceDisplay>
						</view>
					</view>
				</view>
			</view>

			<view class="meta-c padding-h">
				<view class="list-item">
					<view class="body">
						订单编号
					</view>
					<view class="arrow-right">
						{{order.number}} <text style="color:#1890FF; margin-left: 10rpx;" @tap="setCopyText(order.number)">复制</text>
					</view>
				</view>
				<view class="list-item" v-if="order.created_at">
					<view class="body">
						下单时间
					</view>
					<view class="arrow-right">
						{{order.created_at}}
					</view>
				</view>
				<view class="list-item" v-if="order.paid_at">
					<view class="body">
						支付时间
					</view>
					<view class="arrow-right">
						{{order.paid_at}}
					</view>
				</view>
				<view class="list-item">
					<view class="body">
						订单状态
					</view>
					<view class="arrow-right status-text">
						{{order.union_status_text}}
					</view>
				</view>

				<template v-if="deliverRecord">
					<view class="list-item" v-if="order.created_at">
						<view class="body">
							快递公司
						</view>
						<view class="arrow-right">
							{{deliverRecord.express_name}}
						</view>
					</view>
					<view class="list-item" v-if="order.paid_at">
						<view class="body">
							快递单号
						</view>
						<view class="arrow-right">
							{{deliverRecord.express_number}} <text style="color:#1890FF; margin-left: 10rpx;" @tap="setCopyText(deliverRecord.express_number)">复制</text>
						</view>
					</view>
				</template>

			</view>

			<view style="height: 150upx;"></view>

			<view class="footer-actions safe-area-bottom">
				<view class="btn btn-orange-border" @tap="reset">
					<text>重新扫码</text>
				</view>
				<view class="btn bg-orange" @tap="submit" v-if="order.union_status=='deliver_pending' || order.union_status=='pending'">
					<text>确认核销</text>
				</view>
				<view class="btn bg-cancel" @tap="submitDisableTips" v-else>
					<text>确认核销</text>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				code: '',
				order: {}
			}
		},
		onLoad(e) {},
		onShow() {},
		computed: {
			skus() {
				return this.order.skus
			},
			address() {
				return this.order.address
			}
		},
		methods: {
			scan() {
				uni.scanCode({
					success: (res) => {
						this.code = res.result
						this.initOrder()
					}
				});
			},
			submitDisableTips () {
				uni.showToast({
					'title': '订单不在待发货状态，无法核销',
					icon: 'none'
				})
			},
			submit() {
				uni.showLoading({
					title: '核销中'
				})
				this.$http('/order/scan/confirm', 'POST', {
					code: this.code
				}).then(res => {
					uni.hideLoading()
					this.initOrder()
					uni.setNavigationBarColor({
						backgroundColor: '#2BA246',
						frontColor: '#ffffff'
					})
					uni.showToast({
						title: '核销成功',
						icon: 'none'
					})
				})
			},
			initOrder() {
				uni.showLoading({
					title: '加载中'
				})
				this.$http('/order/scan', 'POST', {
					code: this.code
				}).then(res => {
					uni.hideLoading()
					this.order = res.data.info
				})
			},
			reset() {
				this.code = ''
				this.order = {}
				uni.setNavigationBarColor({
					backgroundColor: '#FFCC00',
					frontColor: '#000000'
				})
			}
		},
		onShareAppMessage () {
			return {}
		}
	}
</script>

<style lang="scss">
	.tips {
		color: #666;
		font-size: 28rpx;
		text-align: center;
	}

	.scan {
		margin: 300rpx auto 50rpx auto;
		display: block;
		// font-size: 200rpx;
		width: 300rpx;
		height: 300rpx;
	}

	.code {
		text-align: center;
		font-size: 40rpx;
		font-weight: 700;
		margin-top: 100rpx;
		margin-bottom: 20rpx;
	}

	.qrcode {
		width: 400rpx;
		height: 400rpx;
		margin: 0rpx auto;
		display: block;
	}

	page {
		background: #fafafa;
	}

	button {
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: transparent;

		&:after {
			border: none;
		}
	}

	.order-c {


		.list-item {
			display: flex;
			align-items: center;
			position: relative;

			.status-text {
				font-weight: 500;
			}
		}

		.list-item .body {
			flex: 1;
			display: flex;
			align-items: center;
			font-weight: 500;
		}

		.list-item-title {
			flex: 1;
		}

		.address-c {
			display: flex;
			background: white;

			.al-icon-coordinates {
				margin-top: 6upx;
			}

			.body {
				margin-left: 30upx;

				.name {
					font-size: 30upx;
					font-weight: 500;
				}

				.detail {
					margin-top: 10upx;
					font-size: 26upx;
					color: #777;
				}
			}
		}

		.products-c {
			background: white;
			margin-top: 20rpx;
		}

		.price-wrap {
			background: white;
			padding-top: 20upx;
			margin-top: 20rpx;
		}

		.list-item {
			height: 80upx;
			font-size: 28upx;

			.arrow-right {
				font-size: 26upx;
				font-weight: bold;
			}
		}

		.total-price {
			margin-top: 20upx;
			position: relative;
			line-height: 90upx;
			text-align: right;
			font-size: 32upx;
			font-weight: 500;

			.key {
				font-size: 28rpx;
			}

			.price-c {
				color: red;
				display: inline;
			}
		}

		.meta-c {
			padding-top: 20upx;
			padding-bottom: 20upx;
			background: white;
			margin-top: 20rpx;

			.list-item .arrow-right {
				font-weight: 400;
			}

			.status-text {
				font-weight: 500;
			}
		}

	}

	.footer {
		display: none;
		width: 100%;
		position: fixed;
		bottom: 0;
		background-color: #fff;
		box-shadow: 0 -6upx 8upx rgba(206, 206, 206, 0.2);

		.content {
			padding: 20upx 30upx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
		}
	}

	.footer-actions {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		min-height: 130rpx;

		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx 100rpx 30rpx;
		background-color: #fff;

		.action-item {
			// line-height: transparent;
			height: 100rpx;
			width: 120rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;

			.icon {
				font-size: 42rpx;
				line-height: 46rpx;
			}

			text {
				font-size: 22rpx;
				line-height: 30rpx;
			}
		}

		.btn {
			width: 238rpx;
			height: 78rpx;
			// border: 2rpx solid rgba(242, 114, 51, 1);
			border-radius: 40rpx;
			color: #F27233;
			font-size: 26rpx;
			text-align: center;
			line-height: 78rpx;
			margin-left: 30rpx;
			font-weight: 500;

			&.bg-orange {
				background: rgba(242, 114, 51, 1);
				color: #FFFFFF;
			}

			&.btn-full {
				width: 600rpx;
			}
		}
	}
</style>
