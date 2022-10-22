<template>
	<view class="coupon-item margin-v global-shadow" :class="active?'active':'unactive'" @tap="click">
		<view class="discount-money">
			<view class="price" v-if="coupon.discount_type===0">
				<text class="unit">¥</text>
				<text class="money">{{coupon.discount_money/100}}</text>
			</view>
			<view class="price" v-else-if="coupon.discount_type===1">
				<text>{{coupon.discount_rate/10}}</text>
				<text class="unit">折</text>
			</view>
			<view class="price" v-else-if="coupon.discount_type===2">
				<text>包邮</text>
			</view>
			<view class="price" v-else-if="coupon.discount_type===3">
				<text>兑换券</text>
			</view>
			<view class="type">
				<text v-if="coupon.discount_type===0">优惠券</text>
				<text v-else-if="coupon.discount_type===1">折扣券</text>
				<text v-else-if="coupon.discount_type===2">运费券</text>
				<text v-else-if="coupon.discount_type===3">兑换券</text>
			</view>
		</view>
		<view class="detail">
			<view class="title">
				<text>{{coupon.title}}</text>
			</view>
			<view class="label">
				<!-- <text v-if="coupon.usable_range_type === 0">通用</text>
				<text v-else-if="coupon.usable_range_type === 1">指定盲盒可用</text>
				<text v-else-if="coupon.usable_range_type === 2">指定商品可用</text>
				<text v-else-if="coupon.usable_range_type === 3">指定VIP套餐</text>
				<text v-else-if="coupon.usable_range_type === 4">指定活动</text> -->
				<text>{{coupon.usable_range_text}}</text>
			</view>
			<view class="label" v-if="coupon.score_price">
				<text v-if="coupon.score_price">{{coupon.score_price}}{{scoreAlias}}兑换</text>
			</view>
			<view class="valid-date">
				<text v-if="coupon.time_limit_type == 0">{{validDateStr}}</text>
				<text v-else-if="coupon.time_limit_type == 1">领取后{{coupon.valid_time}}小时内有效</text>
			</view>
			<view class="limit-type gray">
				<view v-if="coupon.discount_type===0">
					<text v-if="coupon.minimum_money">满{{coupon.minimum_money/100}}元可用</text>
					<text v-else>使用立减{{coupon.discount_money/100}}元</text>
				</view>
				<view v-else-if="coupon.discount_type===1">
					<text v-if="coupon.minimum_money">满{{coupon.minimum_money/100}}元</text>
					<!-- <text v-if="coupon.discount_money_limit">最高抵扣{{coupon.discount_money_limit/100}}元</text> -->
					<text>享{{coupon.discount_rate/10}}折优惠</text>
				</view>
				<view v-else-if="coupon.discount_type===2">
					<text v-if="coupon.minimum_money">满{{coupon.minimum_money/100}}元</text>
					<text>享受包邮优惠</text>
				</view>
				<view v-else-if="coupon.discount_type===3">
					<text>免费兑换指定的</text>
					<text v-if="coupon.usable_range_type === 1">盲盒</text>
					<text v-else-if="coupon.usable_range_type === 2">商品</text>
					<text v-else-if="coupon.usable_range_type === 3">VIP套餐</text>
				</view>
			</view>
		</view>
		<!-- <view class="action">
			<view class="btn">
				{{active?activeText:unActiveText}}
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		name: "CouponItem",
		props: {
			coupon: {
				type: Object,
				default() {
					return {}
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
			validDateStr() {
				if (!this.coupon)
					return ''
					
				if (this.coupon.time_limit_type != 0) 
					return ''
					
				return this.coupon.usable_start_at.substr(0, 10) + ' 至 ' + this.coupon.usable_end_at.substr(0, 10)
				// let usable_start_at = this.coupon.usable_start_at
				// let usable_end_at = this.coupon.usable_end_at
				// if (!usable_end_at) return ''
				// let start = moment(usable_start_at)
				// let end = moment(usable_end_at)
				// let now = new Date()
				// if (start > now || end < now) {
				// 	return start.format("YYYY.MM.DD") + ' - ' + end.format("MM.DD")
				// } else {
				// 	let d = end.diff(now, 'days')
				// 	if (d < 1) {
				// 		return (end.diff(now, 'h') + 1 ) + '小时后过期'
				// 	} else {
				// 		return d + 1 + '天后过期'
				// 	}
				// }
			}
		},
		methods: {
			click() {
				this.$emit('click', this.coupon)
			}
		}
	}
</script>

<style lang="scss">
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
			height: 240upx;
			display: flex;
			align-items: center;
			justify-content: center;
			flex-direction: column;
			border-right: 1px dashed #e1e1e1;
			margin-right: 20upx;
		
			.price {
				font-size: 50upx;
				font-weight: 500;
				
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
				font-size: 30upx;
				display: flex;
				font-size: 500;
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
				
				// &::after {
				// 	content: "";
				// 	pointer-events: none;
				// 	position: absolute;
				// 	left: 0;
				// 	top: 0;
				// 	width: 200%;
				// 	height: 200%;
				// 	border-radius: 3px;
				// 	transform: scale(0.5);
				// 	border: 1px solid #61CBEF;
				// 	transform-origin: 0 0;
				// 	box-sizing: border-box;
				// }
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
