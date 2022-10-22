<template>
	<view class="container" v-if="order.uuid">
		<view class="user-c">
			<view class="top">
				<image :src="user.headimg" mode="widthFix" class="headimg"></image>
				<view class="name">{{user.name}}</view>
			</view>
			<view class="middle">
				请你帮他付款
			</view>
			<view class="bottom">
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
			<!-- <view class="list-item">
				<view class="body">
					订单状态
				</view>
				<view class="arrow-right status-text">
					{{order.union_status_text}}
				</view>
			</view> -->
			<view class="list-item">
				<view class="body">
					代付状态
				</view>
				<view class="arrow-right status-text">
					<template v-if="info.status === 0">
						待支付
					</template>
					<template v-else-if="info.status === 2">
						<text style="color: #2BA246">已完成</text>
					</template>
					<template v-else-if="info.status === 3">
						<text style="color: red">已失效</text>
					</template>
				</view>
			</view>

			<!-- <template v-if="deliverRecord">
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
			</template> -->

		</view>

		<view style="height: 150upx;"></view>

		<view class="footer-actions safe-area-bottom">
			<template v-if="info.status === 0">
				<button open-type="share" class="btn btn-full bg-orange" v-if="user.id === userInfo.id">
					<text>转发给好友支付</text>
				</button>
				<view class="btn btn-full bg-orange" v-else @tap="paySubmit">
					<text>帮他付款</text>
				</view>
			</template>
			<template v-else-if="info.status  === 2">
				<view class="btn btn-full bg-green" @tap="checkOrder" v-if="user.id === userInfo.id">
					<text>已完成  查看订单</text>
				</view>
				<view class="btn btn-full bg-green" v-else>
					<text>此代付已完成</text>
				</view>
			</template>
			<template v-else-if="info.status  === 3">
				<view class="btn btn-full bg-gray">
					<text>此代付已过期</text>
				</view>
			</template>
		</view>

		<IActionSheet :visible="visible" @visibleChange="visibleChange" @change="cancelOrder" :list="reasons" title="选择理由"></IActionSheet>
		
		<ReturnSalePopup @cancel="isShowReturnSalePopup = false" @refresh="getOrderInfo" :uuid="uuid" v-if="isShowReturnSalePopup"></ReturnSalePopup>
		
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js"
	import IActionSheet from "@/components/ActionSheet/index.vue";
	import payment from "@/utils/payment.js"
	
	import {
		mapGetters
	} from "vuex"

	export default {
		mixins: [mixin],
		components: {
			IActionSheet
		},
		data() {
			return {
				visible: false,
				info: {},
				order: {},
				skus: [],
				user: {},
				uuid: '',
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			share() {
				return {
					title: this.user.name + '请你代付一个订单',
					// content: 'abbbbbb'
				}
			}
		},
		filters: {
			hidePhoneDetail(value) {
				return value ? value.substring(0, 3) + '****' + value.substring(7, 11) : ''
			}
		},
		onLoad(e) {
			this.uuid = e.uuid
			this.$api.emit('order.cancel_reason.list').then(res => {
				this.reasons = res.data.list
			})
		},
		onShow() {
			this.initData()
		},
		methods: {
			checkOrder () {
				uni.navigateTo({
					url: '/pages/orderDetail/index?uuid=' + this.order.uuid
				})
			},
			paySubmit() {
				uni.showLoading({
					title: '提交中'
				})
				this.$http(`/agent-pay-records/${this.uuid}/pay`, 'POST').then(res => {
					uni.hideLoading()
					
					payment.pay({
						pay_config: res.data.pay_config,
						success: () => {
							// uni.showToast({
							// 	title: "支付成功",
							// 	icon: "none"
							// })
							this.initData()
						},
						fail: () => {
							uni.showToast({
								title: "支付失败",
								icon: "none"
							})
						}
					})
				})
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
			initData() {
				let uuid = this.uuid
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$http(`/agent-pay-records/${this.uuid}`).then(res => {
					uni.hideLoading()
					this.order = res.data.info.order
					this.info = res.data.info
					// this.address = res.data.info.address
					this.skus = this.order.skus
					this.user = res.data.info.user
					// this.deliverRecord = res.data.info.deliver_record
				})
			}
		}
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

		&:after {
			border: none;
		}
	}
	
	.user-c {
		display: flex;
		// flex-direction: row;
		flex-direction: column;
		align-items: center;
		background: white;
		padding: 60rpx 0rpx;
		
		.top {
			display: flex;
			align-items: center;
			.headimg {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
			.name {
				// margin-top: 50rpx;
				margin-left: 10rpx;
				font-size: 40rpx;
				font-weight: 500;
			}
		}
		.middle {
			margin-top: 30rpx;
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
		justify-content: center;
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
			// margin-left: 30rpx;
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
