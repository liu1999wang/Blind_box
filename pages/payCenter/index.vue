<template>
	<view class="container">
		<view class="pay-price-box margin padding">
			<view class="price">
				<text class="unit">¥</text>
				<text>{{info.money|priceToFixed}}</text>
			</view>
		</view>
		<view class="list margin">
			<view class="list-item padding-h border-bottom" v-if="info.method && info.method.wechat_pay.is_enable" data-type="wechat_pay" @tap="payTypeChange">
				<view class="body">
					<image class="type-logo" src="/static/wechat.png"></image>
					<text>微信支付</text>
				</view>
				<radio :checked="current=='wechat_pay'" color="#0ec813" />
			</view>
			<view class="list-item padding-h border-bottom" v-if="info.method && info.method.alipay.is_enable" data-type="alipay" @tap="payTypeChange">
				<view class="body">
					<image class="type-logo" src="/static/ali-pay.png"></image>
					<text>支付宝支付</text>
				</view>
				<radio :checked="current=='alipay'" color="#0ec813" />
			</view>
<!-- 			<view class="list-item padding-h disabled" data-type="balance" @tap="payTypeChange">
				<view class="body">
					<image class="type-logo" src="/static/balance.png"></image>
					<text>余额支付(¥0.00)</text>
				</view>
				<radio :checked="current=='balance'" color="#0ec813" />
			</view> -->
		</view>
		
		<view class="footer safe-area-bottom">
			<IButton :i-class="current==='balance'?'bg-gray':'bg-orange'" long size="large" @tap="handleClick">
				<text>{{current==='balance'?'余额不足':'立即支付'}}</text>
			</IButton>
		</view>
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js"
	import IButton from "@/components/Button/index.vue"
	import payment from "@/utils/payment.js"
	
	export default {
		mixins: [mixin],
		components: {
			IButton
		},
		data() {
			return {
				from: '',
				uuid: '',
				current: 'wechat_pay',
				info: {},
				grouponRecord: {
					uuid: ''
				}
			}
		},
		computed: {
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		onLoad(e) {
			this.from = e.from
			this.grouponRecord.uuid = e.groupon_record_uuid
			
			uni.showLoading({
				title: '加载中',
				mask: true
			})
			this.uuid = e.uuid
			this.$api.emit('order.payment_detail', e.uuid).then(res => {
				this.info = res.data
				uni.hideLoading()
			})
		},
		methods: {
			payTypeChange(e) {
				this.current = e.currentTarget.dataset.type
			},
			handleClick(e) {
				if (this.current === 'balance') return
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this.$api.emit('order.pay_config', this.uuid, {
					pay_type: 'wechat',
					sub_type: 'miniapp'
				}).then(res => {
					uni.hideLoading()
					
					payment.pay({
						pay_config: res.data.pay_config,
						pay_type: res.data.pay_type,
						success: () => {
							if (this.from === 'groupon') {
								uni.redirectTo({
									url: '/pages/groupon/recordDetail/index?uuid=' + this.grouponRecord.uuid
								})
							} else {
								uni.redirectTo({
									url: '/pages/orderList/index?current=1'
								})
							}
						},
						faild: () => {
							
						}
					})
					
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f5f5f5;
	}

	.pay-price-box {
		height: 250upx;
		border-radius: 10upx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		background: $theme-color;
		.price {
			font-size: 60upx;

			.unit {
				font-size: 34upx;
			}
		}
	}

	.list {
		background-color: #fff;
		border-radius: 8upx;
	}

	.list-item {
		height: 110upx;
		
		text {
			font-size: 28upx;
		}
		
		.type-logo {
			width: 46upx;
			height: 46upx;
			margin-right: 10upx;
		}
	}
	
	.disabled {
		color: #a0a0a0;
	}
	
	.footer {
		width: 100%;
		position: fixed;
		bottom: 0;
	}
</style>
