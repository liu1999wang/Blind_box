<template>
	<view class="container" :style="'padding-top:' + (navBar + 150) + 'px'">
		<!-- #ifndef H5 -->
		<TextNavBar title="我的红包"></TextNavBar>
		<!-- #endif -->

		<view class="top" :style="'padding-top:' + navBar + 'px'">
			<view class="card">
				<!-- <image mode="aspectFill" class="headimg" :src="userInfo.headimg" /> -->
				<view class="right">
					<!-- <view class="name">{{userInfo.name}}</view> -->
					<view class="bar">
						<view class="item">
							<view class="number">{{$tool.formatPrice(assetInfo.balance)}}</view>
							<view class="key">可用余额</view>
						</view>
						<navigator url="/pages/myRedpack/withdraw_records">
							<view class="item">
								<view class="number">{{(withdraw/100).toFixed(2)}}</view>
								<view class="key">可提现额度</view>
							</view>
						</navigator>
						<navigator url="/pages/myRedpack/withdrawList">
							<view class="item">
								<view class="number">{{$tool.formatPrice(assetInfo.withdraw_pending)}}</view>
								<view class="key">提现中</view>
							</view>
						</navigator>
						<navigator url="/pages/myRedpack/withdrawList">
							<view class="item">
								<view class="number">{{$tool.formatPrice(assetInfo.withdraw_completed)}}</view>
								<view class="key">已提现</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>

			<view class="title-c">
				<text class="text">红包明细</text>
				<view class="item" :class="{actived: type == 'all'}" @tap="type = 'all'">全部</view>
				<view class="item" :class="{actived: type == 'in'}" @tap="type = 'in'">收入</view>
				<view class="item" :class="{actived: type == 'out'}" @tap="type = 'out'">支出</view>
			</view>

		</view>

		<!-- <view class="content-box">
			<image class="user-headimg" :src="userInfo.headimg" mode="aspectFill"></image>
			<view class="score">
				我的红包: {{$tool.formatPrice(userInfo.redpack)}}
			</view>
		</view> -->
		<view class="list">
			<view class="list-item" v-for="item in list" :key="item.uuid">
				<view class="list-body">
					<view class="action">
						{{item.description}}
					</view>
					<view class="order-number" v-if="item.order_number">
						订单号:{{item.order_number}}
					</view>
					<view class="date-time">
						{{item.created_at}}
					</view>
				</view>
				<view class="right">
					<text class="red" v-if="item.type === 1">+{{$tool.formatPrice(item.value)}}</text>
					<text class="gray" v-else>-{{item.value / 100}}</text>
				</view>
			</view>
		</view>
		<NoData v-if="!list.length && init"></NoData>

		<view class="footer safe-area-bottom">
			<!-- <navigator url="/pages/myRedpack/withdraw" class="footer-button" v-if="setting.is_withdraw_enabled">
				<view>
					<text>提现</text>
				</view>
			</navigator> -->
			<navigator url="/pages/myRedpack/buy" class="footer-button bg-purple last-btn" v-if="setting.is_buy_enabled">
				<view>
					<text>充值</text>
				</view>
			</navigator>
		</view>

	</view>
</template>

<script>
	import {
		getRedpackRecord
	} from "../../api/user.js"
	export default {
		components: {},
		data() {
			return {
				list: [],
				total: 0,
				page: 1,
				per_page: 20,
				init: false,
				loading: false,
				type: 'all',
				setting: {

				},
				assetInfo: {
					balance: 0,
					withdraw_pending: 0,
					withdraw_completed: 0
				},
				withdraw:0
			}
		},
		computed: {
			navBar() {
				// #ifdef H5
				return 0
				// #endif
				return this.$store.getters.deviceInfo.customBar
			},
			userInfo() {
				return this.$store.getters.userInfo
			}
		},
		watch: {
			type() {
				this.refresh()
			}
		},
		async onLoad() {
			uni.showLoading({
				title: '加载中'
			})
			this.getRedpackRecord().then(res => {
				uni.hideLoading()
			})
			this.getlist()
			this.getSetting()

			this.$store.dispatch("getUserInfo")
			
		},
		onShow() {
			this.$http('/assets/redpack').then(res => {
				this.assetInfo = res.data.info
			})
		},
		onReachBottom() {
			this.getRedpackRecord()
		},
		methods: {
			getlist(){
				this.$http('/status-total/limit', 'GET', {

				}).then(res => {

					this.withdraw=res.data.withdraw
				})
			},
			getRedpackRecord() {

				if (this.loading) return
				this.loading = true
				return this.$http('/asset-records/redpack', 'GET', {
					type: this.type,
					page: this.page,
					per_page: this.per_page
				}).then(res => {
					this.page++
					this.list.push(...res.data.list)
					this.loading = false
					this.init = true
				})
			},
			getSetting() {
				return this.$http('/setting/redpack', 'GET').then(res => {
					this.setting = res.data.setting
				})
			},
			refresh() {
				this.page = 1
				this.list = []
				this.getRedpackRecord()
			}
		}
	}
</script>

<style lang="scss">
	.top {
		background: white;
		background-image: url('@/static/top-bg.png');
		background-size: 100% auto;
		background-repeat: no-repeat;
		position: fixed;
		width: 100%;
		top: 0rpx;
		z-index: 10;
		padding-bottom: 10px;

		.card {
			display: flex;
			width: 670rpx;
			height: 174rpx;
			background: #FFFFFF;
			box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.4);
			border-radius: 20rpx;
			// margin-top: 20rpx;
			margin: 20rpx auto;
			padding: 10rpx 40rpx;
			align-items: center;
			box-sizing: border-box;

			.headimg {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				margin-right: 50rpx;
				border: 10rpx solid white;
				box-shadow: 0px 14px 30px 0px rgba(226, 222, 204, 0.4);
			}

			.right {
				flex-grow: 1;

				.bar {
					display: flex;
					justify-content: space-between;

					.item {
						text-align: center;

						.number {
							font-size: 32rpx;
							font-weight: 800;
							color: #000000;
						}

						.key {
							font-size: 24rpx;
							font-weight: 500;
							color: #C6C6C6;
						}
					}
				}
			}
		}

		.title-c {
			display: flex;
			align-items: center;
			padding-right: 30rpx;

			.text {
				padding: 0 24rpx;
				margin: 0 30rpx;
				height: 70upx;
				line-height: 70upx;
				font-size: 34upx;
				font-weight: 500;
				position: relative;
				flex-grow: 1;

				&:after {
					content: '';
					position: absolute;
					left: 0;
					top: 18upx;
					width: 3px;
					height: 34upx;
					background-color: #ffcc00;
				}
			}

			.item {
				border: 1px solid #e1e1e1;
				border-radius: 50rpx;
				padding: 2rpx 20rpx;
				font-size: 26rpx;
				margin-left: 10rpx;

				&.actived {
					background: #ffcc00;
					border: 1px solid #ffcc00;
					color: white;
					font-weight: 500;
				}
			}
		}
	}

	.list {
		margin: 0 24rpx;
		padding-bottom: 180rpx;
	}

	.list-item {
		display: flex;
		padding: 24rpx 0;
		border-bottom: 1px solid #f3f3f3;

		.order-number {
			font-size: 26rpx;
			margin-top: 6rpx;
		}

		.date-time {
			font-size: 24upx;
			margin-top: 6upx;
		}
	}

	.list-body {
		flex: 1;
	}


	.right {
		font-size: 40upx;
	}


	.footer {
		// display: none;
		position: fixed;
		bottom: 20rpx;
		left: 75rpx;
		width: 100%;
		// background-color: #f5f5f5;
		display: flex;
		width: 600rpx;


		.footer-button {
			flex: 1;
			margin: 0 auto;
			margin-bottom: 10rpx;
			// width: 600rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			// border-radius: 80rpx;

			&.last-btn {
				margin-left: 30rpx;
			}

			&.bg-purple {

				box-shadow: 0 0 20rpx rgba(81, 81, 149, 0.6);
			}
			view{
				background-color: #000000;
				color: white;
			}
		}
	}
</style>
