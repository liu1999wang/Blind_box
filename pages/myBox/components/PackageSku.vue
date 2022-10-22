<template>
	<view class="order-item" @tap="handleClick" hover-class="hover">
		<view class="order-item-header">
			<text class="time">{{order.sid}} / {{this.$tool.formatDate(order.created_at, 'MM-dd hh:mm')}}</text>
			<view class="node-type">{{order.node_type_text}}</view>
			<view class="node-type" v-if="order.options &&  order.options.is_hidden_sku">隐藏款</view>
			<view class="shang-title" :class="{strong: order.options.shang_type === 1}" v-if="order.options &&  order.options.shang_title">{{order.options.shang_title}}</view>

			<view style="flex-grow: 1;"></view>
			<view class="status" :class="order.union_status">
				{{order.union_status_text}}
			</view>
		</view>
		<view class="products">
			<SkuInfo class="sku"  :info="order" :disableClick="true"></SkuInfo>
		</view>
		<!-- <view class="total-price" @tap.stop>
			<view class="remark">
				<text v-if="order.remark">{{order.remark}}</text>
			</view>
			<view class="price-number">
				<text class="price-key">金额：</text>
				<view class="price">
					<PriceDisplay :disableClick="true" :info="order" prefix="pay_"></PriceDisplay>
				</view>
			</view>
		</view> -->
		<!-- <view class="close-time orange" v-if="closeTimeVisible">
			{{hours}}:{{minutes}}:{{seconds}} 后关闭订单
		</view> -->
		
		<view class="bottom-actions" @tap.stop>
			<view class="check-box" @tap="handleCheck" v-if="isSelectMode && isSelectable">
				<icon :type="isSelected?'success':'circle'" size="20" color="#F27233"></icon>
				<text>选择</text>
			</view>
			<view v-if="info.is_presell" class="presell-c">
				<text class="tag">预售</text>
				<text class="date">{{info.presell_date}}后可发货</text>
			</view>
			
			<view style="flex-grow: 1;"></view>
		
			<template v-if="order.union_status=='pending'">
				<view class="lock-btn bg-cancel" @tap="handleLock"> <text class="new-iconfont icon-lock"></text> </view>
				<button class="bg-orange" hover-class="hover" v-if="isVirtualAsset" @tap="handleVirtualAssetPick">领取</button>
				<!-- <button class="bg-orange" hover-class="hover" v-if="order.is_chip_cover" data-type="兑换碎片" @tap="handleCoverChip">兑换碎片</button> -->
				<button class="bg-cancel" hover-class="hover" v-if="isReturnSaleable" data-type="返售" @tap="handleClick2">分解</button>
				<button class="" style="background-color:#5b55ff;color:aliceblue;" hover-class="hover" v-if="order.money_price<10000||order.node_type_text=='抽奖'?false:true" data-type="转售" @tap="handleClick2">挂售</button>
			</template>
			<template v-else-if="order.union_status=='locked'">
				<button class="bg-cancel" hover-class="hover" data-type="解锁" @tap="handleUnlock">解锁</button>
			</template>
			<template v-else-if="order.union_status=='resale_pending'">
				<button class="bg-orange" hover-class="hover" data-type="查看转售" @tap="checkResaleDetail">查看转售</button>
			</template>
			<template v-else-if="order.union_status=='picked'">
				<button class="bg-yellow" hover-class="hover" v-if="order.pick_order" data-type="查看订单" @tap="handleClick2">查看订单</button>
			</template>
		</view>
		
	</view>
</template>

<script>
	import mixin from "../../../utils/mixin.js";
	import SkuInfo from "./SkuInfo.vue"
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
			},
			selectType: {
				type: String
			}
		},
		components: {
			SkuInfo
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
			info () {
				return this.order
			},
			orderConfig() {
				return this.$store.getters.setting.order || {}
			},
			marketConfig() {
				return this.$store.getters.setting.market || {}
			},
			isSelectable () {
				if (this.info.union_status !== 'pending') {
					return false
				}
				if (this.selectType === 'deliver') {
					return this.info.sku_type_text !== 'virtual_asset' && !this.info.is_presell
				}
				else if (this.selectType === 'return_sale') {
					return this.isReturnSaleable
				}
				
				return true
			},
			isVirtualAsset () {
				return this.info.sku_type_text === 'virtual_asset'
			},
			isReturnSaleable () {
				return this.orderConfig.is_return_sale_enable && !this.isVirtualAsset && this.info.is_return_saleable
			},
			isResaleable () {
				return !this.isVirtualAsset && this.info.is_resaleable
			}
		},
		filters: {
			dateformat(value) {
				return this.$tool.formatDate(value, 'MM-dd hh:mm')
			}
		},
		created() {
			
		},
		destroyed() {
		},
		methods: {
			handleLock () {
				uni.showLoading({
					title: '转入中~',
					icon: 'none'
				})
				this.$http(`/package-skus/${this.info.uuid}/lock`, 'POST').then(res => {
					uni.showToast({
						title: '已转入保险箱~',
						icon: 'none'
					})
					this.$emit('refresh')
				})
				
			},
			handleUnlock () {
				uni.showLoading({
					title: '解锁中~',
					icon: 'none'
				})
				this.$http(`/package-skus/${this.info.uuid}/unlock`, 'POST').then(res => {
					uni.showToast({
						title: '已解锁~',
						icon: 'none'
					})
					this.$emit('refresh')
				})
			},
			handleVirtualAssetPick () {
				uni.showModal({
					title: '确认领取此奖品吗?',
					success: (res) => {
						if (res.confirm) {
							this.$http(`/package-skus/${this.info.uuid}/virtual-asset/pick`, 'POST').then(res => {
								uni.showToast({
									title: '领取成功，即将跳转~',
									icon: 'none'
								})
								
								setTimeout(() => {
									uni.navigateTo({
										url: '/pages/myBox/detail?uuid=' + this.order.uuid
									})
								}, 1500)
							})
						}
					}
				})
				// uni.navigateTo({
				// 	url: '/pages/myBox/detail?uuid=' + this.order.uuid
				// })
			},
			checkResaleDetail () {
				uni.navigateTo({
					url: '/pages/resale/detail?uuid=' + this.order.resale.uuid
				})
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
					if (this.order.sku_type_text === 'virtual_asset') {
						// uni.showToast({
						// 	title: '虚拟物品只能单独领取~',
						// 	icon: 'none'
						// })
						return false
					}
					
					if (!this.isSelectable) {
						return false 
					}
					
					this.$emit('check')
					return false
				}
				uni.navigateTo({
					url: '/pages/myBox/detail?uuid=' + this.order.uuid
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
	
	.lock-btn {
		background: #E8E8E8;
		border-radius: 50rpx;
		text-align: center;
		width: 80rpx;
		height: 50rpx;
		line-height: 50rpx;
		font-weight: 500;
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
			// justify-content: space-between;
			position: relative;
			font-size: 24upx;

			.time {
				font-size: 26rpx;
				font-weight: bold;
				color: #000000;
				line-height: 40rpx;
			}
			
			.node-type {
				background:  #FCF6D8;
				color: #F58348;
				padding: 4rpx 10rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin-left: 10rpx;
				
				&.strong {
					// background: #F27233;
					// color: white;
				}
			}
			
			.shang-title {
				background:  #FCF6D8;
				color: #F58348;
				padding: 4rpx 10rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				margin-left: 10rpx;
				
				&.strong {
					// background: #F27233;
					// color: white;
				}
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
					background: url(../../../static/activity/status-bg-working.png) ;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position-x: right;
					color: white;
				}
				&.completed, &.resaled, &.exchanged, &.comment_pending, &.picked {
					background: url('@/static/dayTask/down.png') ;
					background-size: 100% 100%;
					background-repeat: no-repeat;
					background-position-x: right;
					color: white;
				}
				&.expired, &.closed, &.return_saled {
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
		
		.presell-c  {
			.tag {
				background:  #FCF6D8;
				color: #F58348;
				padding: 4rpx 10rpx;
				font-size: 24rpx;
				border-radius: 6rpx;
				// margin-left: 10rpx;
				
				&.strong {
					// background: #F27233;
					// color: white;
				}
			}
			.date {
				font-size: 26rpx;
				margin-left: 6rpx;
			}
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
