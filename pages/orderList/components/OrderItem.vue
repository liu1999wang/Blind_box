<template>
	<view class="order-item" @tap="handleClick" hover-class="hover">
		<view class="order-item-header">
			<text class="time">{{order.created_at | dateformat}}</text>
			<view class="status" :class="order.union_status">
				{{order.union_status_text}}
			</view>
		</view>
		<view class="products">
			<SkuItem class="sku"  :info="item" :disableClick="true" v-for="(item, index) in order.skus"></SkuItem>
		</view>
		<view class="total-price" @tap.stop>
			<view class="remark">
				<text v-if="order.remark">{{order.remark}}</text>
			</view>
			<view class="price-number">
				<text class="price-key">实付金额：</text>
				<view class="price">
					<PriceDisplay :disableClick="true" :info="order" prefix="pay_"></PriceDisplay>
				</view>
			</view>
		</view>
		<view class="close-time orange" v-if="closeTimeVisible">
			{{hours}}:{{minutes}}:{{seconds}} 后关闭订单
		</view>
		
		<view class="bottom-actions" @tap.stop>
			<view class="check-box" @tap="handleCheck" v-if="isSelectMode">
				<icon :type="isSelected?'success':'circle'" size="20" color="#F27233"></icon>
				<text>选择</text>
			</view>
			
			<view style="flex-grow: 1;"></view>
			
			<template v-if="order.union_status=='pay_pending'">
				<button class="bg-orange" hover-class="hover" data-type="立即支付" @tap="handleClick2">立即支付</button>
				<button class="bg-cancel" hover-class="hover" data-type="取消订单" @tap="handleClick2">取消订单</button>
			</template>
			<template v-if="order.union_status=='pending'">
				<button class="bg-cancel" hover-class="hover" v-if="orderConfig.is_offline_use" data-type="核销码" @tap="handleClick2">核销码</button>
				<button class="bg-orange" hover-class="hover" v-if="order.is_chip_cover" data-type="兑换碎片" @tap="handleCoverChip">兑换碎片</button>
				<button class="bg-cancel" hover-class="hover" v-if="!orderConfig.is_ban_return_sale" data-type="返售" @tap="handleClick2">返售</button>
			</template>
			<template v-if="order.union_status=='deliver_pending'">
				<!-- <button class="bg-white border" hover-class="hover" data-type="提醒发货" @tap="handleClick2">提醒发货</button> -->
				<button class="bg-cancel" hover-class="hover" v-if="order.is_closeable" data-type="取消订单" @tap="handleClick2">取消订单</button>
				<button class="bg-cancel" hover-class="hover" open-type="contact" v-if="isMiniappAndUseMiniappKf">联系客服</button>
				<button class="bg-cancel" hover-class="hover" @tap="openContact" v-else>联系客服</button>
			</template>
			<template v-if="order.union_status=='delivered'">
				<button class="bg-orange" hover-class="hover" data-type="确认收货" @tap="handleClick2">确认收货</button>
			</template>
			<template v-if="order.union_status=='comment_pending'">
				<!-- <button class="bg-white border" hover-class="hover" data-type="去评价" @tap="handleClick2">去评价</button> -->
			</template>
			<template v-if="order.union_status=='closed'">
				<button class="bg-cancel" hover-class="hover" data-type="删除订单" @tap="handleClick2">删除订单</button>
			</template>
			<template v-if="order.union_status=='close_pending'">
				<button class="bg-cancel" hover-class="hover" open-type="contact" v-if="isMiniappAndUseMiniappKf">联系客服</button>
				<button class="bg-cancel" hover-class="hover" @tap="openContact" v-else>联系客服</button>
			</template>
		</view>
	</view>
</template>

<script>
	import moment from "@/utils/moment.js";
	import mixin from "../../../utils/mixin.js";
	export default {
		mixins: [mixin],
		props: {
			order: {
				type: Object
			},
			isSelected: {
				type: Boolean
			},
			isSelectMode: {
				type: Boolean
			}
		},
		data() {
			return {
				hours: '',
				minutes: '',
				seconds: '',
				closeTimeVisible: false,
				timer: null
			}
		},
		computed: {
			orderConfig() {
				return this.$store.getters.setting.order
			},
		},
		filters: {
			dateformat(value) {
				return moment(value, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm")
			}
		},
		created() {
			if (this.order.union_status === 'pay_pending' && this.order.auto_closed_at) {
				this.close_at = moment(this.order.auto_closed_at)
				if (this.close_at < moment()) return

				this.closeTimeVisible = true
				this.setTime(this.close_at)

				this.timer = setInterval(() => {
					this.setTime(this.close_at)
				}, 1000)
			}
		},
		destroyed() {
			clearInterval(this.timer)
		},
		methods: {
			setTime(close_at) {
				let now = moment()
				this.hours = this.fillNumber(close_at.diff(now, 'hours'))
				this.minutes = this.fillNumber(close_at.diff(now, 'minutes') % 60)
				this.seconds = this.fillNumber(close_at.diff(now, 'seconds') % 60)
				if (close_at < now) {
					clearInterval(this.timer)
				}
			},
			fillNumber(num) {
				if (num < 10) {
					return '0' + num
				} else {
					return num
				}
			},
			handleClick() {
				if (this.isSelectMode) {
					this.$emit('check')
					return false
				}
				uni.navigateTo({
					url: '/pages/orderDetail/index?uuid=' + this.order.uuid
				})
			},
			handleClick2(e) {
				this.$emit('action', {
					order: this.order,
					action: e.currentTarget.dataset.type
				})
			},
			handleCheck() {
				this.$emit('check')
			},
			handleCoverChip() {
				uni.navigateTo({
					url: '/pages/coverChip/index?sku_id=' + this.order.skus[0].sku_id
				})
			}
		}
	}
</script>

<style lang="scss">
	.border-bottom-2 {
		border-bottom: 1px dashed #f1f1f1;
	}

	.order-item {
		background-color: #fff;
		margin: 30upx 0;

		box-shadow: 0px 6rpx 30rpx 0px rgba(226, 222, 204, 0.5);
		border-radius: 20rpx;

		// padding: 0rpx 24rpx 20rpx 24rpx;

		.order-item-header {
			height: 70upx;
			// padding: 0 24upx;
			padding-left: 24rpx;

			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			font-size: 24upx;

			.time {
				font-size: 26rpx;
				font-weight: bold;
				color: #000000;
				line-height: 40rpx;
			}
			
			.status {
				// font-size: 24rpx;
				// height: 68rpx;
				height: 100%;
				padding: 0rpx 26rpx 0rpx 44rpx;
				// padding-right: 20rpx;
				line-height: 50rpx;
				// padding-left: 10rpx;
				box-sizing: border-box;
				
				background: url(../../../static/activity/status-bg-working.png);
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position-x: right;
				color: white;
				
				&.working, &.pending {
					background: url(../../../static/activity/status-bg-working.png);
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position-x: right;
					color: white;
				}
				&.completed, &.comment_pending {
					background: url('@/static/dayTask/down.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position-x: right;
					color: white;
				}
				&.expired, &.closed, &.return_sale {
					color: rgba(153, 153, 153, 1);
					background: url(../../../static/activity/status-bg-expired.png);
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position-x: right;
				}
				
				// .text {
				// 	width: 210rpx;
				// 	text-align: center;
				// 	display: block;
				// 	float: right;
				// 	line-height: 56rpx;
				// 	font-weight: 500;
				// }
			}
		}

		.total-price {
			margin: 0rpx 24rpx;
			padding: 0 0upx;
			height: 66upx;
			display: flex;
			align-items: center;
			justify-content: space-between;

			.remark {
				font-size: 26upx;
			}

			.price-number {
				display: flex;
				align-items: center;
				font-size: 24upx;
			}
			
			.price-key {
				color: #999;
				font-weight: 500;
			}

			.price {
				margin-left: 8upx;

				font-size: 30rpx;
				font-weight: bold;
				color: #FF5555;
				line-height: 26rpx;
			}
		}

		.close-time {
			font-weight: 500;
			padding: 0 24upx;
			font-size: 26upx;
			text-align: right;
			margin-bottom: 10upx;
		}

		.bottom-actions {
			padding: 10upx 24upx 18upx 24upx;
			display: flex;
			align-items: center;
			// justify-content: flex-end;
			
				
			.check-box {
				flex-grow: 1;
				display: flex;
				align-content: center;
				text {
					font-size: 28rpx;
					margin-left: 2rpx;
				}
			}

			button {
				padding: 0;
				margin: 0;
				margin-left: 20upx;
				width: 150upx;
				height: 50upx;
				line-height: 50upx;
				font-size: 24upx;
				border-radius: 1000px;
				position: relative;

				&.bg-white {
					box-shadow: 0 2upx 8upx #cfcfcf;
				}

				&:after {
					border: none;
				}
			}
		}
	}
</style>
