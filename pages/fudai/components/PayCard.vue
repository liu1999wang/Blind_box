<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content  animated bounceInUp" @tap.stop>
			<view class="top-tab" @tap="cancel">
				<image class="top-button" src="https://www.hebide.cc/newimages/newyi/top-button.png"></image>
				<image src="https://www.hebide.cc/newimages/newyi/top-tab.png"></image>
			</view>
			<text class="close-btn" @tap="cancel">取消</text>
			<view class="title">
			{{info.title}}
			<view class="price">
				<text>单价</text><PriceDisplay :info="info"></PriceDisplay>
			</view>
			</view>
			<view class="quantity-box">
				<text>买</text><text  style="font-size: 46rpx;font-style:italic; margin: 0 5rpx;" >{{payTotal}}</text><text style="margin-left: 10rpx;">发<text v-for="(item, index) in info.total_list" v-if="item.total==info.pay_total"><text class="discount-text" v-if="item.is_discount">(惠)</text></text> </text>
			</view>
			<view class="total"> <text>购买数量</text> <text>{{payTotal}}</text> <text>发，共计</text><PriceDisplay :info="order" prefix="pay_" style="font-size: 46rpx; font-weight: 200;"></PriceDisplay></view>

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
						
						<!-- 道具 -->
						<view class="block" v-if="doubleBoxCard.is_show && doubleBoxCard.my_balance>0">
							<view class="item-title">{{doubleBoxCard.double_card_info.title}}<text style="color: #ef563d; font-size: 24rpx;">(抽赏所获金额翻倍!)</text></view>
							<view class="arrow-right bold">
								<switch class="redpack-switch" :checked="is_doubleBoxCard" @change="doubleBoxCardswitchChange" />
							</view>
						</view>
		
		
		
		
<!-- 用户协议 -->
			<UserStatement v-model="isCheckUserStatement"></UserStatement>
			
			<view class="button" @tap="disableMultiClick(submit)" v-if="isInit && !isLoading && isCheckUserStatement">
				<text>确认购买</text>
			</view>
			<view class="button disabled" v-else>
				<text>确认购买</text>
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
					is_use_redpack: 'unselect', // 不选择，交由后台决定是否默认使用红包
					is_use_score: 0,
					is_doubleBoxCard:0,
				},
				total_prices:0,
				total_score_price:0,
				currentCoupon: {},
				isCouponPopup: false,
				unusableCoupons: [],
				usableCoupons: [],
				isInit: false,
				isLoading: false,
				isSubmiting: false,
				isCheckUserStatement: true,
				doubleBoxCard:{},
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
			// console.log('payTotal',this.payTotal)
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
				this.$http('/fudai/order/preview', 'POST', {
					page_uuid: this.info.page_uuid,
					total: this.payTotal,
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
				this.$http('/user/cards').then(res => {
					this.doubleBoxCard =res.data.double_box_card
					console.log(res.data.double_box_card)
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
			doubleBoxCardswitchChange(e){
				this.form.is_doubleBoxCard = e.detail.value ? 1 : 0
			},
			cancel() {
				this.$emit('close')
			},
			createOrder() {
				
				if (this.isLoading) {
					return false
				}
				
				this.isLoading = true
				
				uni.showLoading({
					title: '提交中',
					// icon: 'none'
				})
				this.$http('/fudai/order/confirm', 'POST', {
					page_uuid: this.info.page_uuid,
					total: this.payTotal,
					coupon_id: this.currentCoupon.id,
					...this.form
				}).then(res => {
					uni.hideLoading()			
					this.isSubmiting = false
					let info = res.data
					console.log(info)
					if (info.is_need_pay) {
						payment.pay({
							...info,
							success: () => {
								// uni.showToast({
								// 	title: "支付成功",
								// 	icon: "none"
								// })
								
								this.$emit('success', info.order,false,info.is_doubleBoxCard)
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
						this.$emit('success', info.order,false,info.is_doubleBoxCard)
					}
				}).catch(err => {
					this.isLoading = false
				})
			},
			submit() {
				
				if (this.isLoading) {
					return false
				}
				
				this.createOrder()
				
				// 微信小程序请求订阅消息
				// #ifdef MP-WEIXIN
				// uni.requestSubscribeMessage({
				// 	tmplIds: [
				// 		this.miniappSubscribeIds.order_delivered, // 发货提醒
				// 		this.miniappSubscribeIds.order_paid, // 支付成功通知
				// 	],
				// 	complete: (res) => {
				// 		this.createOrder()
				// 	}
				// })
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
					// this.createOrder()
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
	.mask{}
	.mask-content {
		position: absolute;
		bottom: 0rpx;
		width: 100%;
		// height: 680rpx;
		background-color: #000000;
		color: #FFFFFF;
		border-radius: 10rpx 10rpx 0 0;
		// display: flex;
		// flex-direction: column;
		// align-items: center;
		// animation: show 0.8s;
		padding: 50rpx 30rpx;
		box-sizing: border-box;
		.top-tab{
			position: absolute;
			top: -60rpx;
			left: 0;
			width: 100%;
			height: 60rpx;
			image{
				width: 100%;
				height: 100%;
			}
			.top-button{
				position: absolute;
				top: 20rpx;
				left: calc(50% - 90rpx);
				width: 40rpx;
				padding: 0 70rpx;
				height: 30rpx;
			}
		}
		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			color: #adadad;
		}

		.title {
			position: absolute;
			left: 20rpx;
			top: 20rpx;
			.price{
				font-size: 28rpx;
				color:#fcd066;
			}
		}
		
		.quantity-box{
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 50%;
			margin: 15rpx auto;
			margin-top: 65rpx;
			padding: 10rpx;
			text-align: center;
			color: #fcd066;
			border: 1rpx solid #fcd066;
			.discount-text{
				color: red;
			}
		}
		.total {
			margin-top: 20rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 0rpx;
			text-align: right;
			color: #FFFFFF;
			font-size: 20rpx;
			margin-bottom: 50rpx;
		}
		.button {
			padding: 0;
			margin: 30rpx auto 0rpx auto;
			width: 70%;
			height: 100rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 36rpx;
			font-weight: bold;
			background:url('https://www.hebide.cc/newimages/newyi/bg-huan.png') no-repeat;
			background-size: 100% 100%;
			
			color: #000000;
			box-shadow: 0 0 20rpx rgba(252, 208, 102, 0.6);
		
			&:after {
				border: none;
			}
			
			&.disabled {
				background-color: #ddd;
				color: black;
				box-shadow: 0 0 20rpx #ddd;
			}
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

			.redpack-switch {
				margin-left: 10rpx;
				position: relative;
				left: 10rpx;
				transform: scale(0.8);
			}
		}

		.gray-text {
			font-size: 28rpx;
			color: gray;
		}




	}
</style>
