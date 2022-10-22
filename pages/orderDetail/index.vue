<template>
	<view class="container" v-if="order.uuid">
		<view class="address-c padding" v-if="address && address.consignee">
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
			<view class="list-item" v-if="order.exchange_record_id">
				<view class="body">
					置换抵扣
				</view>
				<view class="arrow-right">
					-
					<PriceDisplay moneyKey="exchange_money_discount" scoreKey="exchange_score_discount" :info="order"></PriceDisplay>
				</view>
			</view>
			<view class="list-item" v-if="order.cover_type">
				<view class="body">
					兑换类型
				</view>
				<view class="arrow-right">
					<text class="meta" v-if="order.cover_type === 'chip'">碎片兑换</text>
					<text class="meta" v-else-if="order.cover_type === 'score'">{{scoreAlias}}兑换</text>
				</view>
			</view>
			<view class="list-item" v-if="order.cover_discount">
				<view class="body">
					兑换抵扣
				</view>
				<view class="arrow-right">
					-¥{{order.cover_discount|priceToFixed}}
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
			<view class="list-item" v-if="order.score_discount">
				<view class="body">
					{{scoreAlias}}抵扣
				</view>
				<view class="arrow-right">
					{{order.score_used}}{{scoreAlias}} &nbsp -¥{{order.score_discount|priceToFixed}}
				</view>
			</view>
			<view class="list-item">
				<view class="body">
					运费
				</view>
				<view class="arrow-right" v-if="order.carriage_type === 2">
					到付
				</view>
				<view class="arrow-right" v-else>
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
				<view class="list-item" v-if="deliverRecord.express_name">
					<view class="body">
						快递公司
					</view>
					<view class="arrow-right">
						{{deliverRecord.express_name}}
					</view>
				</view>
				<view class="list-item" v-if="deliverRecord.express_number">
					<view class="body">
						快递单号
					</view>
					<view class="arrow-right">
						{{deliverRecord.express_number}} <text style="color:#1890FF; margin-left: 10rpx;" @tap="setCopyText(deliverRecord.express_number)">复制</text>
					</view>
				</view>
				<view class="list-item" v-if="deliverRecord.remark">
					<view class="body">
						发货备注
					</view>
					<view class="arrow-right">
						{{deliverRecord.remark}}
					</view>
				</view>
			</template>

		</view>

		<view style="height: 150upx;"></view>

		<view class="footer-actions safe-area-bottom">
			<button class="action-item no-border-button" open-type="contact" @tap="openContact">
				<view class="icon new-iconfont icon-contact"></view>
				<text>客服</text>
			</button>
			<navigator class="action-item" hover-class="hover" :url="`/pages/orderCode/index?uuid=${order.uuid}`" v-if="order.union_status=='deliver_pending' && order.is_offline_useable">
				<view class="icon new-iconfont icon-qrcode"></view>
				<text>核销码</text>
			</navigator>
			<view style="flex-grow: 1;"></view>
			<template v-if="order.union_status=='pay_pending'">
				<view class="btn buy-now bg-cancel" @tap="visibleChange" v-if="order.is_closeable">
					<text>取消订单</text>
				</view>
				<view class="btn buy-group bg-orange" @tap="payNow">
					<text>立即支付</text>
				</view>
			</template>
			<template v-if="order.union_status=='deliver_pending'">
				<view class="btn bg-gray">
					<text>等待发货</text>
				</view>
			</template>
			<template v-if="order.union_status=='delivered'">
				<view class="btn bg-gray">
					<text>已发货</text>
				</view>
			</template>
			<template v-if="order.union_status=='return_sale'">
				<view class="btn bg-gray">
					<text>已返售退款</text>
				</view>
			</template>
			<template v-if="order.union_status=='covered'">
				<view class="btn bg-gray">
					<text>已兑换成碎片</text>
				</view>
			</template>
			<template v-if="order.union_status=='pending'">
				<view class="btn btn-orange-border" v-if="!orderConfig.is_ban_return_sale" @tap="returnSale">
					<text>返售</text>
				</view>
				<view class="btn bg-orange"  v-if="!orderConfig.is_hide_deliver_btn" @tap="selectDeliver">
					<text>选择发货</text>
				</view>
			</template>
			<template v-if="order.union_status=='closed'">
				<view class="btn bg-gray" @click="destoryOrder">
					<text>删除订单</text>
				</view>
			</template>
			<template v-if="order.union_status=='close_pending'" >
				<button v-if="isMiniappAndUseMiniappKf" open-type="contact" class="btn bg-orange no-border-button  bg-contact">
					<text>联系客服</text>
				</button>
				<button v-else @tap="openContact" class="btn bg-orange no-border-button  bg-contact">
					<text>联系客服</text>
				</button>
			</template>
		</view>

		<IActionSheet :visible="visible" @visibleChange="visibleChange" @change="cancelOrder" :list="reasons" title="选择理由"></IActionSheet>
		
		<ReturnSalePopup @cancel="isShowReturnSalePopup = false" @refresh="getOrderInfo" :uuid="uuid" v-if="isShowReturnSalePopup"></ReturnSalePopup>
		
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js"
	import IActionSheet from "@/components/ActionSheet/index.vue";

	export default {
		mixins: [mixin],
		components: {
			IActionSheet
		},
		data() {
			return {
				deliverRecord: null,
				visible: false,
				reasons: [],
				address: {},
				order: {},
				skus: [],
				uuid: '',
				isShowReturnSalePopup: false
			}
		},
		filters: {
			hidePhoneDetail(value) {
				return value ? value.substring(0, 3) + '****' + value.substring(7, 11) : ''
			}
		},
		computed: {
			orderConfig() {
				return this.$store.getters.setting.order
			},
		},
		onLoad(e) {
			this.uuid = e.uuid
			this.$api.emit('order.cancel_reason.list').then(res => {
				this.reasons = res.data.list
			})
		},
		onShow() {
			this.getOrderInfo()
		},
		methods: {
			selectDeliver() {
				// console.log('pages =====> ', getCurrentPages())
				
				uni.navigateTo({
					url: '/pages/orderList/index'
				})
				// if (getCurrentPages().length == 1) {
				// 	uni.navigateTo({
				// 		url: '/pages/orderList/index'
				// 	})
				// }
				// else {
				// 	uni.navigateBack({
				// 		delta: 1
				// 	})
				// }
			},
			returnSale() {
				this.isShowReturnSalePopup = true
				// this.$http(`/my-boxes/${this.uuid}/return-sale-info`).then(res => {
				// 	let radio = res.data.return_ratio * 10
				// 	uni.showModal({
				// 		title: "确定返售此盲盒给平台吗?",
				// 		content: "返售将以" + radio + "折的价格返售给平台，返售款项将立即原路退回~",
				// 		success: async res => {
				// 			if (res.confirm) {
				// 				uni.showLoading({
				// 					title: '返售中'
				// 				})
				// 				this.$http(`/my-boxes/${this.order.uuid}/return-sale`, 'POST').then(res => {
				// 					this.getOrderInfo()
				// 					uni.hideLoading()
				// 					uni.showModal({
				// 						title: '返售成功',
				// 						content: "款式将原路退回。请注意查收哦~",
				// 						icon: "none"
				// 					})
				// 				})
				// 			}
				// 		}
				// 	})
				// })
			},
			setCopyText(text) {
				uni.setClipboardData({
					data: text,
					success: function(res) {
						uni.showToast({
							title: '复制成功'
						})
					}
				})
			},
			getOrderInfo() {
				let uuid = this.uuid
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$api.emit('order.show', uuid).then(res => {
					uni.hideLoading()
					this.order = res.data.info
					this.address = res.data.info.address
					this.skus = res.data.info.skus
					this.deliverRecord = res.data.info.deliver_record
				})
			},
			visibleChange() {
				this.visible = !this.visible
			},
			payNow() {
				uni.navigateTo({
					url: '/pages/payCenter/index?uuid=' + this.order.uuid
				})
			},
			cancelOrder(e) {
				this.visibleChange()
				uni.showLoading({
					title: "加载中",
					mask: true
				})
				this.$api.emit('order.close', this.order.uuid).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '订单已取消',
						icon: 'none'
					})
					this.order.union_status = 'closed'
				}).catch(err => {
					uni.hideLoading()
				})
			},
			destoryOrder(e) {
				uni.showLoading({
					title: "加载中",
					mask: true
				})
				this.$api.emit('order.destory', this.order.uuid).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '订单已删除',
						icon: 'none'
					})
					setTimeout(res => {
						uni.navigateBack({
							delta: 1
						})
					}, 1000)
				}).catch(err => {
					uni.hideLoading()
				})
			}
		},

	}
</script>

<style lang="scss">
	page {
		background: #fafafa;
	}
	

	button {
		padding: 0;
		margin: 0;
		border-radius: 0;
		background-color: transparent;

		&::after {
			border: none;
			display: none;
		}
		
		&::before {
			display: none;
		}
	}

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
		padding: 0rpx 30rpx 100rpx 30rpx;
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
