<template>
	<view class="coupons-wrapper mask" @tap.stop="close">
		<view class="coupons-content" @tap.stop>
			<view class="coupons-title padding-h">
				<text class="text">优惠券</text>
				<text class="icon new-iconfont icon-close" @tap="close"></text>
			</view>
			<view class="tabs">
				<view class="tab-item" :class="{active:current===0}" :data-current="0" @tap="currentChange">
					可用优惠券
				</view>
				<view class="tab-item" :class="{active:current===1}" :data-current="1" @tap="currentChange">
					不可用优惠券
				</view>
			</view>
			<swiper :current="current" @change="currentChange2">
				<swiper-item>
					<scroll-view scroll-y>
						<view class="coupon-list margin-h">
							<CouponItem :coupon="item" v-for="item in usableCoupons" :key="item.uuid" :isSelected="currentCoupon.id === item.id" :active="1" @click="onClick(item)"
							 :background-color="false?'rgba(245, 35, 2, 0.1)':'#ffffff'"></CouponItem>
							<NoData v-if="!usableCoupons.length"></NoData>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y>
						<view class="coupon-list margin-h">
							<CouponItem :coupon="item" v-for="item in unusableCoupons" :key="item.uuid" :active="0" unActiveText="不可用"></CouponItem>
							<NoData v-if="!unusableCoupons.length"></NoData>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import CouponItem from "./components/CouponItem.vue"
	export default {
		components: {
			CouponItem
		},
		props: {
			unusableCoupons: {
				type: Array
			},
			usableCoupons: {
				type: Array
			},
			currentCoupon: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		data() {
			return {
				current: 0
			}
		},
		computed: {
		},
		methods: {
			close () {
				this.$emit('close')
			},
			currentChange(e) {
				let index = e.currentTarget.dataset.current
				if (index === this.current) return
				this.current = index
			},
			currentChange2(e) {
				let index = e.detail.current
				if (index === this.current) return
				this.current = index
			},
			onClick(item) {
				this.$emit('change', item)
				this.$emit('close')
			}
		}
	}
</script>

<style lang="scss" scoped>

	.coupons-wrapper {
	}
	
	.coupons-content {
		width: 100%;
		height: 70%;
		position: absolute;
		bottom: 0;
		left: 0;
		background-color: #fff;
		border-radius: 10upx 10upx 0 0;
	
		.coupons-title {
			height: 94upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
	
			.text {
				font-size: 34upx;
			}
		}
	
		.tabs {
			display: flex;
	
			.tab-item {
				flex: 1;
				height: 90upx;
				line-height: 90upx;
				text-align: center;
				position: relative;
				font-size: 28upx;
				color: #A5A7B2;
	
				&.active {
					color: #0E151D;
	
					&::after {
						content: "";
						position: absolute;
						height: 2px;
						left: 40upx;
						right: 40upx;
						bottom: 0;
						background-color: #0E151D;
					}
				}
			}
		}
	
		swiper {
			width: 100%;
			height: calc(100% - 184upx);
			background-color: #f5f5f5;
	
			scroll-view {
				width: 100%;
				height: 100%;
	
				.coupon-list {
					overflow: hidden;
				}
			}
		}
	}
</style>
