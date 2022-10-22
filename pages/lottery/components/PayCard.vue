<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title" v-if="info.is_need_join_code">
				参与码
			</view>


<!-- 			<view class="block">
				<view class="item-title">单价:</view>
				<view class="price-c">
					<PriceDisplay :info="info"></PriceDisplay>
				</view>
			</view> -->
<!-- 			<view class="block">
				<view class="item-title">数量:</view>
				<view class="meta">x1</view>
			</view> -->
<!-- 			<view class="block">
				<view class="item-title">可用优惠券:</view>
				<view class="arrow-right bold" @tap="isCouponPopup = true">
					<text class="meta" v-if="order.coupon_discount"> - ¥{{$tool.formatPrice(order.coupon_discount)}}</text>
					<template v-else>
						<text class="meta" style="color: #FF1A1A;" v-if="usableCoupons.length">{{usableCoupons.length}}张可用</text>
						<text class="meta gray-text" v-else>暂无可用优惠券</text>
					</template>
					<text class="new-iconfont icon-arrow-right"></text>
				</view>
			</view> -->
			<view class="block" v-if="info.is_need_join_code">
				<!-- <view class="item-title">参与码:</view> -->
				<view class=" bold" style="width: 100%;text-align: center;">
					<input v-model="form.join_code" class="join-code-input" placeholder="请输入参与码"></input>
				</view>
				
			</view>
			<view  v-if="info.is_need_join_code" style="color:red;font-size:24rpx;text-align: center;">参与码可进群获得</view>
<!-- 			<view class="block">
				<view class="item-title">可用红包:</view>
				<view class="arrow-right bold">
					<template v-if="order.redpack">
						<text class="meta"> ¥{{$tool.formatPrice(order.redpack)}}</text>
						<switch class="redpack-switch" :checked="order.is_use_redpack" @change="switchChange" />
					</template>
					<text class="meta" v-else> ¥0 </text>
				</view>
			</view> -->
			<!-- <SelectAddress v-model="address"></SelectAddress> -->
			<!-- <view class="redpack">
				<view class="body">
					本单可用红包
				</view>
				<view class="arrow-right bold">
					<text class="meta red"> ¥{{redpack | priceToFixed}}</text>
					<switch v-if="redpack" class="redpack-switch" :checked="isUseRedpack" @change="switchChange" />
				</view>
			</view> -->
<!-- 			<view class="total">
				小计：
				<PriceDisplay :info="order" prefix="pay_"></PriceDisplay>
			</view> -->
			<view class="button" @tap="submit" v-if="isInit">
				<text>确认参与</text>
			</view>
			<view class="button disabled" v-else>
				<text>确认参与</text>
			</view>
		</view>
		
		<UsableCouponPopup
			v-if="isCouponPopup"  
			:unusableCoupons="unusableCoupons" 
			:usableCoupons="usableCoupons" 
			@change="couponChange"
			@close="isCouponPopup = false">
		</UsableCouponPopup>
		
	</view>
</template>

<script>
	import payment from "@/utils/payment.js"
	export default {
		components: {},
		data() {
			return {
				payTotal: -1,
				order: {},
				price: 0,
				form: {
					is_use_redpack: 0,
					join_code: ''
				},
				currentCoupon: {},
				isCouponPopup: false,
				unusableCoupons: [],
				usableCoupons: [],
				isInit: false
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {},
		watch: {
			payTotal () {
				this.initOrder()
			}
		},
		created() {
			this.payTotal = this.info.pay_total
			console.log('info', this.info)
			// this.initOrder()
		},
		methods: {
			couponChange (e) {
				if (e.id === this.currentCoupon.id) {
					// 再次点击取消使用优惠券  // 暂时关闭此功能
					// this.currentCoupon = {}
				} else {
					this.currentCoupon = e
					this.initOrder()
				}
			},
			initOrder() {
				uni.showLoading()
				this.$http('/lottery/order/preview', 'POST', {
					activity_id: this.info.id,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					this.isInit = true
					this.order = res.data.order,
					this.unusableCoupons = res.data.order.coupons.unusable
					this.usableCoupons = res.data.order.coupons.usable
					uni.hideLoading()
				}).catch(err => {
					this.isInit = false
					this.cancel()
				})
			},
			switchChange(e) {
				this.form.is_use_redpack = e.detail.value ? 1 : 0
				this.initOrder()
			},
			cancel() {
				this.$emit('close')
			},
			createOrder() {
				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})

				this.$http('/lottery/order/confirm', 'POST', {
					activity_id: this.info.id,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					uni.hideLoading()
					let info = res.data
					if (info.is_need_pay) {
						payment.pay({
							...info,
							success: () => {
								// uni.showToast({
								// 	title: "支付成功",
								// 	icon: "none"
								// })
								this.$emit('success', info.order)
							},
							fail: () => {
								uni.showToast({
									title: "支付失败",
									icon: "none"
								})

								// 关闭订单
								this.$http(`/orders/${info.order.uuid}`, 'PUT', {
									type: 'close_and_delete'
								})
							}
						})
					} else {
						this.$emit('success', info.order)
					}
				})
			},
			submit() {
				// 微信小程序请求订阅消息
				// #ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
					tmplIds: [
						this.miniappSubscribeIds.order_delivered, // 发货提醒
						this.miniappSubscribeIds.order_paid, // 支付成功通知
					],
					complete: (res) => {
						this.createOrder()
					}
				})
				// if (this.miniappSubscribeIds) {
				// 	uni.requestSubscribeMessage({
				// 		tmplIds: [
				// 			this.miniappSubscribeIds.order_delivered, // 发货提醒
				// 			this.miniappSubscribeIds.order_paid, // 支付成功通知
				// 		],
				// 		complete: (res) => {
				// 			this.createOrder()
				// 		}
				// 	})
				// } else {
				// 	this.createOrder()
				// }
				// #endif
				// #ifndef MP-WEIXIN
					this.createOrder()
				// #endif
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.small-text {
		// font-size: 80%;
	}

	.mask-content {
		position: absolute;
		bottom: 0;
		width: 100%;
		// height: 680rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 30rpx 30rpx;
		box-sizing: border-box;

		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
		}

		.title {
			text-align: center;
			font-size: 36rpx;
			font-weight: 500;
		}

		.block {
			display: flex;
			align-items: center;
			padding: 16rpx 0rpx;

			.item-title {
				// margin: 0rpx 0rpx 0rpx 0rpx;
				font-size: 28rpx;
				// color: gray;
				flex-grow: 1;
				font-weight: 500;
			}
			
			.total-list {
				display: flex;
				.item {
					font-weight: 500;
					border-radius: 40rpx;
					border: 2rpx solid #e1e1e1;
					// background: #e1e1e1;
					padding: 4rpx 20rpx;
					margin-left: 20rpx;
					font-size: 24rpx;
					
					&.actived {
						background: #F27233;
						border: 2rpx solid rgba(242, 114, 51, 1);
						color: white;
					}
				}
			}

			.price-c {}
			
			.redpack-switch {
				margin-left: 10rpx;
				position: relative;
				left: 10rpx;
				transform: scale(0.8);
			}
			
			.join-code-input {
				width: 50%;
				
				border:5rpx solid #370eee ;
				padding:20rpx;
				text-align: center;
				margin: auto;
				font-size: 28rpx;
			}
		}

		.gray-text {
			font-size: 28rpx;
			color: gray;
		}

		.total {
			margin-top: 20rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 0rpx;
			text-align: right;
			color: red;
			font-size: 28rpx;
		}

		.button {

			padding: 0;
			margin: 50rpx auto 0rpx auto;
			width: 50%;
			border-radius: 50rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #370eee;
			color: white;
			// box-shadow: 0 0 20rpx rgba(242, 114, 51, 0.6);


			&:after {
				border: none;
			}
			
			&.disabled {
				background-color: #ddd;
				color: black;
				box-shadow: 0 0 20rpx #ddd;
			}
		}
	}
</style>
