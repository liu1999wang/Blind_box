<template>
	<view class="order-item" @tap="handleClick">
		<view class="order-item-header border-bottom-2">
			<text class="time gray">{{order.created_at | dateformat}}</text>
			<text>{{order.union_status_text}}</text>
		</view>
		<view class="products">
			<view class="product-item" v-for="(item,index) in order.skus" :key="index">
				<image class="thumb" :src="item.thumb" mode="aspectFill"></image>
				<view class="product-info">
					<view class="product-title">
						{{item.title}}
					</view>
					<view class="product-attrs gray" v-if="item.attrs&&item.attrs.length">
						{{item.attrs|productAttrsToString}}
					</view>
				</view>
				<view class="price-count gray">
					<view class="price">
						¥{{item.price|priceToFixed}}
					</view>
					<view class="count">
						x{{item.total}}
					</view>
				</view>
			</view>
		</view>
		<view class="total-price" @tap.stop>
			<view class="remark">
				<text v-if="order.remark">{{order.remark}}</text>
			</view>
			<view class="price-number">
				<text>实付金额：</text>
				<text class="price red">¥{{order.pay_price|priceToFixed}}</text>
			</view>
		</view>
		<view class="close-time red" v-if="closeTimeVisible">
			{{hours}}:{{minutes}}:{{seconds}} 后关闭订单
		</view>
		<view class="bottom-actions" v-if="order.union_status=='pay_pending'" @tap.stop>
			<button class="bg-red" hover-class="hover" data-type="立即支付" @tap="handleClick2">立即支付</button>
			<button class="bg-gray" hover-class="hover" data-type="取消订单" @tap="handleClick2">取消订单</button>
		</view>
		<view class="bottom-actions" v-if="order.union_status=='deliver_pending'" @tap.stop>
			<!-- <button class="bg-white border" hover-class="hover" data-type="提醒发货" @tap="handleClick2">提醒发货</button> -->
			<button class="bg-gray" hover-class="hover" v-if="!order.is_refund_disabled" data-type="取消订单" @tap="handleClick2">取消订单</button>
			<button hover-class="hover" open-type="contact" v-else>联系客服</button>
		</view>
		<view class="bottom-actions" v-if="order.union_status=='delivered'" @tap.stop>
			<button class="bg-white border" hover-class="hover" data-type="确认收货" @tap="handleClick2">确认收货</button>
		</view>
		<view class="bottom-actions" v-if="order.union_status=='comment_pending'" @tap.stop>
			<!-- <button class="bg-white border" hover-class="hover" data-type="去评价" @tap="handleClick2">去评价</button> -->
		</view>
		<view class="bottom-actions" v-if="order.union_status=='closed'" @tap.stop>
			<button class="bg-gray" hover-class="hover" data-type="删除订单" @tap="handleClick2">删除订单</button>
		</view>
		<view class="bottom-actions" v-if="order.union_status=='close_pending'" @tap.stop>
			<button  class="bg-gray" hover-class="hover" open-type="contact">联系客服</button>
		</view>
	</view>
</template>

<script>
	import moment from "moment";
	import mixin from "../../../utils/mixin.js";
	export default {
		mixins: [mixin],
		props: {
			order: {
				type: Object
			}
		},
		data () {
			return {
				hours: '',
				minutes: '',
				seconds: '',
				closeTimeVisible: false,
				timer: null
			}
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
				uni.navigateTo({
					url: '/pages/orderDetail/index?uuid=' + this.order.uuid
				})
			},
			handleClick2(e) {
				this.$emit('action', {
					order: this.order,
					action: e.currentTarget.dataset.type
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
		margin: 20upx 0;
		.order-item-header {
			height: 70upx;
			padding: 0 24upx;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
			font-size: 24upx;
		}
		
		.products {
			.product-item {
				display: flex;
				padding: 24upx 24upx;
				position: relative;
				
				.thumb {
					width: 110upx;
					height: 110upx;
				}
				
				.product-info {
					flex: 1;
					margin-left: 24upx;
					
					.product-title {
						line-height: 36rpx;
						font-size: 28rpx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 2;
						overflow: hidden;
					}
					
					.product-attrs {
						margin-top: 16upx;
						font-size: 24upx;
					}
				}
				
				.price-count {
					width: 140upx;
					text-align: right;
					// display: flex;
					// align-items: flex-end;
					// flex-direction: column;
					// justify-content: space-between;
					
					.price {
						font-size: 26upx;
					}
					
					.count {
						font-size: 24upx;
						margin-top: 20upx;
					}
				}
			}
		}
		
		.total-price {
			padding: 0 24upx;
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
			
			.price {
				margin-left: 8upx;
				font-weight: 300;
				font-size: 36upx;
			}
		}
		
		.close-time {
			font-weight: 300;
			padding: 0 24upx;
			font-size: 26upx;
			text-align: right;
			margin-bottom: 10upx;
		}
		
		.bottom-actions {
			padding: 10upx 24upx 18upx 24upx;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			
			button {
				padding: 0;
				margin: 0;
				margin-left: 20upx;
				width: 170upx;
				height: 60upx;
				line-height: 60upx;
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
