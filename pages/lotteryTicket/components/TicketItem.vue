<template>
	<view class="scope-container global-shadow-2">
		<!-- <view class="session-c">第{{info.session}}期</view> -->
		<view class="item" @tap="toDetail">
			<!-- <image class="left headimg" :src="info.headimg"></image> -->
			<!-- <view class="session-c">第{{info.session}}期</view> -->
			<view class="body">
				<view class="name">{{info.number}}</view>
				<view class="time-c">
					{{$tool.formatDate(info.created_at, 'MM-dd hh:mm')}}
					<text class="init-text" v-if="info.source_type === 1">初始获得</text>
					<template v-else-if="info.source_type === 2">
						<image :src="info.invitee.headimg" class="headimg"></image> {{info.invitee.name}} 助力
					</template>
					<text class="init-text" v-else-if="info.source_type === 3">抽盒赠送</text>
				</view>
			</view>
			<!-- <view class="session-c">第{{info.session}}期</view> -->
			<view class="right">
				<!-- <view class="session-c">第{{info.session}}期</view> -->
				<temaplte>
					<view v-if="info.status === 0" class="status">等待开奖</view>
					<view v-else-if="info.status === 1" class="status lucky">已中奖</view>
					<view v-else-if="info.status === 2">未中奖</view>
				</temaplte>
			</view>
		</view>
		
		<view class="title-c">
			<view class="text">{{info.activity.title}}</view>
			<view class="session-c">第{{info.session}}期</view>
			<!-- <view class="text">{{info.activity.title}}</view> -->
		</view>

		<!-- 已中奖 -->
		<view v-if="(info.status == 1) && sku" class="prize-item">
			<view class="left">
				<view class="title">{{sku.title}}</view>
				<view class="sub-title" v-if="sku.type === 'score'">{{sku.score}} {{scoreAlias}}</view>
				<view class="sub-title" v-else-if="sku.type === 'redpack'">{{sku.redpack / 100}} 红包</view>
				<view class="sub-title" v-else-if="sku.type === 'coupon'">优惠券: {{sku.coupon && sku.coupon.title}}</view>
				<view class="sub-title" v-else-if="sku.type === 'custom'">实物奖品</view>
			</view>
			<view class="right">
				<button v-if="info.is_picked" class="check-prize btn bg-orange" @tap="checkPrize">点击查看</button>
				<button v-else class="check-prize btn bg-orange" @tap="getPrize">点击领取</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				isAddressListening: false
			}
		},
		props: {
			info: {
				type: Object
			}
		},
		computed: {
			sku() {
				return this.info.sku
			}
		},
		async onLoad() {},
		beforeDestroy() {
			uni.$off('selectAddress')
		},
		methods: {
			toDetail () {
				if (this.info.status === 1) {
					uni.navigateTo({
						url: '/pages/myBox/index'
					})
				}
			},
			checkPrize () {
				if (!this.sku) {
					uni.showModal({
						title: '无奖品',
						content: '未查到任何奖品~'
					})
					return false
				}
				
				if (this.sku.type === 'score') {
					uni.navigateTo({
						url: '/pages/myScore/index'
					})
				}
				else if (this.sku.type === 'redpack') {
					uni.navigateTo({
						url: '/pages/myRedpack/index'
					})
				}
				else if (this.sku.type === 'coupon') {
					uni.navigateTo({
						url: '/pages/couponDetail/index?uuid=' + this.sku.coupon.uuid
					})
				}
				else if (this.sku.type === 'custom') {
					uni.navigateTo({
						url: '/pages/orderDetail/index?uuid=' + this.info.order.uuid
					})
				}
			},
			getPrize () {
				if (this.sku.type === 'custom' && !this.sku.is_picked) {
					uni.showModal({
						title: '领取实物奖品',
						content: '是否填写邮寄地址发货？',
						success: (res) => {
							if (res.confirm) {
								uni.showToast({
									title: 'yes'
								})
								
								if (!this.isAddressListening) {
									uni.$once('selectAddress', address => {
										this.isAddressListening = false
										
										if (address.id) {
											this.$http(`/lottery-tickets/${this.info.uuid}/pick-prize`, 'POST', {
												address_id: address.id
											}).then(r => {
												this.$emit('refresh')
												uni.showToast({
													title: '领取成功~',
													icon: 'none'
												})
											})
										}
									})
									this.isAddressListening = true
								}
								uni.navigateTo({
									url: "/pages/myAddress/index?select=true"
								})
								
							}
							else {
								// uni.showToast({
								// 	title: 'no'
								// })
							}
						}
					})
				}
			}
		},
		filters: {}
	}
</script>
<style lang="scss" scoped>
	.scope-container {
		padding: 10px;
		margin: 10px;
		background: white;
		border-radius: 6rpx;
		position: relative;
	}
	.session-c {
		// position: fixed;
		// position: absolute;
		// top: 10rpx;
		// right: 24rpx;
		// width: 100%;
		padding: 4rpx 16rpx;
		margin-left: 10rpx;
		z-index: 100;
		// height: 50rpx;
		// line-height: 50rpx;
		text-align: center;
		background: rgba(0, 0, 0, 0.7);
		color: white;
		font-size: 20rpx;
		font-weight: 500;
		border-radius: 60rpx;
		margin-right: 10rpx;
		// width: 300rpx;
	}
	
	.title-c  {
		display: flex;
		margin-top: 10rpx;
	}
	
	.item {
		display: flex;
		align-items: center;

		.left {
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			margin-right: 18rpx;
		}

		.body {
			flex-grow: 1;

			.name {
				font-weight: 700;
				font-size: 34rpx;
				margin-bottom: 10rpx;
			}

			.time-c {
				color: gray;
				font-size: 26rpx;
				display: flex;
				align-items: center;

				.headimg {
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					margin: 0rpx 10rpx 0rpx 20rpx;
				}

				.init-text {
					margin-left: 10rpx;
				}
			}
		}

		.right {
			.plus {
				color: red;
			}

			.number {
				color: red;
				font-size: 45rpx;
			}

			.status {
				&.lucky {
					color: #2BA246;
				}
			}
		}
	}
	
	.prize-item {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top: 2px dashed #f1f1f1;
		margin-top: 30rpx;
		padding-top: 30rpx;
		
		.left {
			.title {
				font-weight: 700;
				font-size: 30rpx;
				margin-bottom: 10rpx;
			}
			
			.sub-title {
				color: gray;
				font-size: 26rpx;
			}
		}
		.right {
			.btn {
				&:after {
					display: none;
				}
				font-size: 22rpx;
				border-radius: 50rpx;
				font-weight: 500;
			}
		}
	}
</style>
