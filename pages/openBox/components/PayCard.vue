<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				{{info.box.title}}
			</view>


			<view class="block">
				<view class="item-title">单价:</view>
				<view class="price-c">
					<PriceDisplay :info="info.box"></PriceDisplay>
				</view>
			</view>
			<view class="block">
				<view class="item-title">数量:</view>
				<view class="total-list">
					<view class="item" :class="{actived: payTotal === 1}"  @tap="payTotal = 1">开1个</view>
					
					<view class="item"  :class="{actived: payTotal === 0}" @tap="payTotal = 0" v-if="info.box.sku_ratio_type === 1">整盒端({{info.box.sku_total}}个)</view>
					<view class="item"  :class="{actived: payTotal === 5}" @tap="payTotal = 5" v-else>连开5个</view>
					
					<view class="item"  :class="{actived: payTotal === 10}" @tap="payTotal = 10">连开10个</view>
				</view>
				<!-- <view class="">x1</view> -->
			</view>
			<view class="block">
				<view class="item-title">可用优惠券:</view>
				<view class="arrow-right bold" @tap="isCouponPopup = true">
					<text class="meta" v-if="order.coupon_discount"> - ¥{{$tool.formatPrice(order.coupon_discount)}}</text>
					<template v-else>
						<text class="meta" style="color: #FF1A1A;" v-if="usableCoupons.length">{{usableCoupons.length}}张可用</text>
						<text class="meta gray-text" v-else>暂无可用优惠券</text>
					</template>
					<text class="new-iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="block">
				<view class="item-title">可用红包:</view>
				<view class="arrow-right bold">
					<template v-if="order.redpack">
						<text class="meta"> ¥{{$tool.formatPrice(order.redpack)}}</text>
						<switch class="redpack-switch" :checked="order.is_use_redpack" @change="switchChange" />
					</template>
					<text class="meta" v-else> ¥0 </text>
				</view>
			</view>
			<view class="block" v-if="order.max_useable_score">
				<view class="item-title">
					{{scoreAlias}}抵扣
				</view>
				<view class="arrow-right bold">
					<text class="meta"> {{order.max_useable_score}}{{scoreAlias}}</text>
					<text class="meta red" style="margin-left: 10rpx;" v-if="order.score_discount"> -¥{{order.score_discount | priceToFixed}}</text>
					<switch v-if="order.max_useable_score" class="redpack-switch" :checked="order.is_use_score" @change="scoreSwitchChange" />
				</view>
			</view>
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
			<view class="total">
				小计：
				<PriceDisplay :info="order" prefix="pay_"></PriceDisplay>
			</view>
			
			<!-- 用户协议 -->
			<UserStatement v-model="isCheckUserStatement"></UserStatement>
			
			<view class="button-c">
				<!-- #ifndef APP-PLUS -->
				<!-- <view class="button daifu bg-purple" @click="submitForDaifu" v-if="info.box.money_price">
					<text>找人代付</text>
				</view> -->
				<!-- #endif -->
				<view class="button" @tap="disableMultiClick(submit)" v-if="isInit && !isSubmiting && isCheckUserStatement">
					<text>确认购买</text>
				</view>
				<view class="button disabled" v-else>
					<text>确认购买</text>
				</view>
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
				payTotal: 1,
				order: {},
				price: 0,
				form: {
					is_use_redpack: 'unselect',
					is_use_score: 0
				},
				currentCoupon: {},
				isCouponPopup: false,
				unusableCoupons: [],
				usableCoupons: [],
				isCheckUserStatement: true,
				isInit: false,
				isSubmiting: false,
			}
		},
		props: {
			info: {
				type: Object
			},
			buyTotal: {
				type: Number
			}
		},
		computed: {},
		watch: {
			payTotal () {
				this.initOrder()
			}
		},
		onLoad(e) {

		},
		created() {
			this.payTotal = this.buyTotal
			this.initOrder()
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
				this.$http('/box-order/preview', 'POST', {
					room_id: this.info.room.id,
					sku_index: this.info.sku_index,
					page_uuid: this.info.page_uuid,
					coupon_id: this.currentCoupon.id,
					total: this.payTotal,
					...this.form
				}).then(res => {
					this.isInit = true
					this.order = res.data.order,
					this.unusableCoupons = res.data.order.coupons.unusable
					this.usableCoupons = res.data.order.coupons.usable
					uni.hideLoading()
				}).catch(e => {
					this.isInit = false
					this.cancel()
				})
			},
			switchChange(e) {
				this.form.is_use_redpack = e.detail.value ? 1 : 0
				this.initOrder()
			},
			scoreSwitchChange(e) {
				this.form.is_use_score = e.detail.value ? 1 : 0
				this.initOrder()
			},
			cancel() {
				this.$emit('cancel')
			},
			createOrder() {
				uni.showLoading({
					title: '提交中',
					// icon: 'none'
				})
				
				this.isSubmiting = true

				this.$http('/box-order/confirm', 'POST', {
					room_id: this.info.room.id,
					sku_index: this.info.sku_index,
					page_uuid: this.info.page_uuid,
					coupon_id: this.currentCoupon.id,
					total: this.payTotal,
					...this.form
				}).then(res => {
					this.isSubmiting = false 
					
					uni.hideLoading()
					let info = res.data
					if (info.is_need_pay) {
						
						// 进行支付
						payment.pay({
							...info,
							success: () => {
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
				}).catch(err => {
					this.isSubmiting = false 
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
			},
			createAgentPay() {
				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})
				this.$http('/box-order/confirm', 'POST', {
					create_mode: 'agent_pay',
					room_id: this.info.room.id,
					sku_index: this.info.sku_index,
					page_uuid: this.info.page_uuid,
					coupon_id: this.currentCoupon.id,
					total: this.payTotal,
					...this.form
				}).then(res => {
					uni.hideLoading()
					let agentRecordUuid = res.data.uuid
					uni.redirectTo({
						url: '/pages/agentPayRecord/detail?uuid=' + agentRecordUuid
					})
				})
			},
			submitForDaifu () {
				uni.showModal({
					title: '代付订单在生成后30分钟内可以转发给朋友帮你支付',
					// content: '请先收集足够的碎片再来兑换哦~',
					confirmText: '生成代付',
					success: (res) => {
						if (res.confirm) {
							this.createAgentPay()
						}
					}
				})
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
		bottom: 0rpx;
		width: 100%;
		// height: 680rpx;
		background-color: #EDEDED;
		background-color: white;
		border-radius: 10rpx 10rpx 0 0;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 50rpx 30rpx 60rpx 30rpx;
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
		
		.redpack-switch {
			margin-left: 10rpx;
			position: relative;
			left: 10rpx;
			transform: scale(0.8);
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

			.price-c {}
		
			
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
			margin-bottom: 50rpx;
		}
		
		.button-c {
			display: flex;
			
			.button {
			
				padding: 0;
				margin: 20rpx auto 0rpx auto;
				width: 100%;
				border-radius: 50rpx;
				height: 86rpx;
				line-height: 86rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				background-color: #ffcc00;
				box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			
				&.daifu {
					margin-right: 30rpx;
					width: 300rpx;
					font-size: 28rpx;
					box-shadow: 0 0 0rpx rgba(255, 220, 0, 0.6);
				}
				
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
	}
</style>
