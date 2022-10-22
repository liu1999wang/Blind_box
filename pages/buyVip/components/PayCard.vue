<template>
	<view class="mask" @tap="cancel" @touchmove.stop>
		<view class="mask-content" @tap.stop>
			<text class="new-iconfont icon-close close-btn" @tap="cancel"></text>
			<view class="title">
				购买VIP会员套餐
			</view>
			
			<view class="item-title">选择套餐:</view>
			<view class="sku-list">
				<view class="item" @tap="selectSku(item)" :class="{actived: item.id === skuId}" v-for="(item, index) in skuList">{{item.title}}</view>
			</view>
			
			<view class="flex-block">
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
			
			<view class="item-title">收货地址:</view>
			<SelectAddress v-model="address"></SelectAddress>
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
			<view class="button" @click="submit">
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
				skuList: [],
				skuId: 0,
				address: {},
				order: {},
				unusableCoupons: [],
				usableCoupons: [],
				selectedSku: {},
				isCouponPopup: false,
				currentCoupon: {}
			}
		},
		props: {
		},
		computed: {},
		watch: {
			skuId () {
				this.initOrder()
			}
		},
		onLoad(e) {

		},
		created() {
			uni.showLoading()
			this.$http('/vip-skus').then(res => {
				this.skuList = res.data.list
				
				uni.hideLoading()
				
				if (this.skuList.length > 0) {
					this.selectSku(this.skuList[0])
				}
			})
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
			selectSku (item) {
				this.skuId = item.id 
				this.selectedSku = item
			},
			cancel() {
				this.$emit('cancel')
			},
			initOrder() {
				uni.showLoading()
				this.$http('/vip-order/preview', 'POST', {
					sku_id: this.skuId,
					address_id: this.address.id,
					coupon_id: this.currentCoupon.id
				}).then(res => {
					this.order = res.data.order,
					this.unusableCoupons = res.data.order.coupons.unusable
					this.usableCoupons = res.data.order.coupons.usable
					uni.hideLoading()
				})
			},
			submit() {
				if (!this.skuId) {
					uni.showModal({
						title: '请选择套餐',
					})
					return false
				}
				
				if (!this.address.id) {
					uni.showModal({
						title: '请选择收货地址',
					})
					return false
				}

				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})

				this.$http('/vip-orders', 'POST', {
					sku_id: this.skuId,
					address_id: this.address.id,
					coupon_id: this.currentCoupon.id
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
								this.$emit('success')
							},
							fail: () => {
								uni.showToast({
									title: "支付失败",
									icon: "none"
								})
					
								// 关闭订单
								this.$http(`/orders/${info.order.uuid}`, 'PUT', {
									type: 'close'
								})
							}
						})
					}
					else {
						this.$emit('success')
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
		bottom: 0;
		width: 100%;
		height: 800rpx;
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
		
		.item-title {
			margin: 30rpx 0rpx 10rpx 0rpx;
			font-size: 28rpx;
			// color: gray;
		}
		
		.flex-block {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin-top: 30rpx;
			.item-title {
				margin: 0rpx 0rpx 10rpx 0rpx;
			}
		}
	
		
		.sku-list {
			display: flex;
			flex-wrap: wrap;
			.item {
				padding: 0 26rpx;
				height: 48rpx;
				line-height: 48rpx;
				font-size: 24rpx;
				margin-right: 16rpx;
				margin-bottom: 16rpx;
				border-radius: 40rpx;
				border: 2rpx solid #EAEBED;
				text-align: center;
				min-width: 70rpx;
			
				&.actived {
					color: white;
					background: rgba(242, 114, 51, 1);
					border: 2rpx solid rgba(242, 114, 51, 1);
				}
			
				&:last-child {
					margin-right: 0rpx;
				}
			}
		}

		.total {
			margin-top: 20rpx;
			width: 100%;
			box-sizing: border-box;
			padding: 0 16rpx;
			text-align: right;
			color: red;
			font-size: 28rpx;
		}
		
		.button {

			padding: 0;
			margin: 50rpx auto 0rpx auto;
			width: 100%;
			border-radius: 50rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);


			&:after {
				border: none;
			}
		}
	}
</style>
