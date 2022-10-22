<template>
	<view class="coupon-item margin-v" :class="active?'active':'unactive'" :style="style" @tap="click">
		<view class="discount-money">
			<view class="price" v-if="baseCoupon.discount_type===0">
				<text class="unit">¥</text>
				<text class="money">{{baseCoupon.discount_money/100}}</text>
			</view>
			<view class="price" v-else-if="baseCoupon.discount_type===1">
				<text>{{baseCoupon.discount_rate/10}}</text>
				<text class="unit">折</text>
			</view>
			<view class="price" style="font-size: 38rpx;" v-else-if="baseCoupon.discount_type===2">
				<text>包邮</text>
			</view>
			<view class="price" style="font-size: 36rpx;" v-else-if="baseCoupon.discount_type===3">
				<text>兑换券</text>
			</view>
			<view class="type">
				<text v-if="baseCoupon.discount_type===0">优惠券</text>
				<text v-else-if="baseCoupon.discount_type===1">折扣券</text>
				<text v-else-if="baseCoupon.discount_type===2">运费券</text>
				<text v-else-if="baseCoupon.discount_type===3">兑换券</text>
			</view>
		</view>
		<view class="detail">
			<view class="title">
				<text>{{baseCoupon.title}}</text>
			</view>
			<view class="label">
				<!-- <text v-if="baseCoupon.usable_range_type === 0">通用</text>
				<text v-else-if="baseCoupon.usable_range_type === 1">指定盲盒可用</text>
				<text v-else-if="baseCoupon.usable_range_type === 2">指定商品可用</text>
				<text v-else-if="baseCoupon.usable_range_type === 3">指定VIP套餐可用</text>
				<text v-else-if="baseCoupon.usable_range_type === 4">指定活动</text> -->
				<text>{{baseCoupon.usable_range_text}}</text>
			</view>
			<view class="label" v-if="baseCoupon.score_price">
				<text v-if="baseCoupon.score_price">{{baseCoupon.score_price}}{{scoreAlias}}兑换</text>
			</view>
			<view class="valid-date">
				<text>{{validDateStr}}</text>
			</view>
			<view class="limit-type gray">
				<view v-if="baseCoupon.discount_type===0">
					<text v-if="baseCoupon.minimum_money">满{{baseCoupon.minimum_money/100}}元可用</text>
					<text v-else>使用立减{{baseCoupon.discount_money/100}}元</text>
				</view>
				<view v-else-if="baseCoupon.discount_type===1">
					<text v-if="baseCoupon.minimum_money">满{{baseCoupon.minimum_money/100}}元</text>
					<!-- <text v-if="coupon.discount_money_limit">最高抵扣{{coupon.discount_money_limit/100}}元</text> -->
					<text>享{{baseCoupon.discount_rate/10}}折优惠</text>
				</view>
				<view v-else-if="baseCoupon.discount_type===2">
					<text v-if="baseCoupon.minimum_money">满{{baseCoupon.minimum_money/100}}元</text>
					<text>享受包邮优惠</text>
				</view>
				<view v-else-if="baseCoupon.discount_type===3">
					<text>免费兑换指定的</text>
					<text v-if="baseCoupon.usable_range_type === 1">盲盒</text>
					<text v-else-if="baseCoupon.usable_range_type === 2">商品</text>
					<text v-else-if="baseCoupon.usable_range_type === 3">VIP套餐</text>
				</view>
			</view>
		</view>
		<view class="action">
			<view class="btn" hover-class="hover" v-if="!isSelected">
				{{active?activeText:unActiveText}}
			</view>
			<view class="btn bg-gray" hover-class="hover" v-else>
				取消使用
			</view>
		</view>
	</view>
</template>

<script>
	import moment from "@/utils/moment.js";
	export default {
		name: "CouponItem",
		props: {
			backgroundColor: {
				type: String,
				default: '#ffffff'
			},
			coupon: {
				type: Object,
				default() {
					return {}
				}
			},
			isSelected: {
				type: Boolean,
				default () {
					return false
				}
			},
			active: {
				type: Number,
				default: 1
			},
			activeText: {
				type: String,
				default: '立即使用'
			},
			unActiveText: {
				type: String,
				default: '已使用'
			}
		},
		computed: {
			baseCoupon() {
				return this.coupon.base_coupon || {}
			},
			style() {
				return 'background-color:' + this.backgroundColor
			},
			validDateStr() {
				let usable_start_at = this.coupon.usable_start_at
				let usable_end_at = this.coupon.usable_end_at
				if (!usable_end_at) return ''
				let start = moment(usable_start_at)
				let end = moment(usable_end_at)
				let now = new Date()
				if (start > now || end < now) {
					return start.format("YYYY.MM.DD") + ' - ' + end.format("MM.DD")
				} else {
					let d = end.diff(now, 'days')
					if (d < 1) {
						return (end.diff(now, 'h') + 1 ) + '小时后过期'
					} else {
						return d + 1 + '天后过期'
					}
				}
			}
		},
		methods: {
			click() {
				this.$emit('click', this.coupon)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-item {
		background-color: #fff;
		border-radius: 10upx;
		overflow: hidden;
		display: flex;
		align-items: center;
	
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
				color: #e52302;
			}
	
			.action .btn {
				background-color: #f52302;
				color: #fff;
			}
		}
	
		.discount-money {
			width: 180upx;
			height: 220upx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
	
			.price {
				font-size: 50upx;
	
				.unit {
					font-size: 24upx;
				}
			}
	
			.type {
				margin-top: 6upx;
				font-size: 22upx;
			}
		}
	
		.detail {
			flex: 1;
	
			.title {
				font-size: 28upx;
				display: flex;
				align-items: center;
			}
			
			.label {
				padding: 0 12upx;
				height: 32upx;
				line-height: 32upx;
				font-size: 20upx;
				margin-left: 8upx;
				color: #F27233;
				position: relative;
				border: 1px solid #F27233;
				display: inline;
				border-radius: 30rpx;
			}
	
			.valid-date {
				font-size: 24upx;
				margin-top: 10upx;
			}
	
			.limit-type {
				font-size: 22upx;
				margin-top: 10upx;
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
