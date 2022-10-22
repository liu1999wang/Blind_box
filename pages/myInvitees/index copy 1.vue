<template>
	<view class="container">
		<!-- <TextNavBar title="我的红包"></TextNavBar> -->

		<view class="top">
			<view class="card">
				
				<view class="item item-1">
					<view class="s-title">总分销佣金</view>
					<view class="price-c">
						<PriceDisplay></PriceDisplay>
					</view>
				</view>
				
				<view class="bottom-c">
					<view class="item item-2">
						<view class="s-title">
							已结算
							<text class="new-iconfont icon-arrow-right"></text>
						</view>
						<view class="price-c">
							<PriceDisplay></PriceDisplay>
						</view>
					</view>
					<view class='line'></view>
					<view class="item item-3">
						<view class="s-title">
							待结算
							<text class="new-iconfont icon-arrow-right"></text>
						</view>
						<view class="price-c">
							<PriceDisplay></PriceDisplay>
						</view>
					</view>
				</view>
				
				<!-- <image mode="aspectFill" class="headimg" :src="userInfo.headimg" />
				<view class="right">
					<view class="bar">
						<view class="item">
							<view class="number">{{$tool.formatPrice(assetInfo.balance)}}</view>
							<view class="key">可用余额</view>
						</view>
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
				</view> -->
			</view>

			<view class="title-c">
				<text class="text">粉丝记录</text>
				<view class="item" :class="{actived: type == 'all'}" @tap="type = 'all'">全部</view>
				<view class="item" :class="{actived: type == 'direct'}" @tap="type = 'direct'">直接</view>
				<view class="item" :class="{actived: type == 'indirect'}" @tap="type = 'indirect'">间接</view>
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
				<image class="headimg" mode="widthFix" :src="item.headimg"></image>
				<view class="middle">
					<view class="name">{{item.name}}</view>
					<view class="time">{{$tool.formatDate(item.created_at, 'MM-dd hh:mm')}}</view>
				</view>
				<view class="brokerage-c">
					<view class="key-text">
						注册奖励: 
					</view>
					<view class="key-text">
						分销佣金: 
					</view>
				</view>
				<text class="new-iconfont icon-arrow-right"></text>
				<!-- <view class="list-body">
					<view class="action">
						{{item.description}}
					</view>
					<view class="date-time">
						{{item.created_at}}
					</view>
				</view>
				<view class="right">
					<text class="red" v-if="item.type === 1">+{{$tool.formatPrice(item.value)}}</text>
					<text class="gray" v-else>-{{item.value / 100}}</text>
				</view> -->
			</view>
		</view>
		<NoData v-if="!list.length && init"></NoData>

		<!-- <navigator url="/pages/myRedpack/withdraw" v-if="setting.is_withdraw_enabled">
			<view class="footer safe-area-bottom">
				<view class="footer-button" hover-class="hover">
					<text>提现</text>
				</view>
			</view>
		</navigator> -->

	</view>
</template>

<script>
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
				}
			}
		},
		computed: {
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
			this.fetchList().then(res => {
				uni.hideLoading()
			})
			
			this.getSetting()
			
			this.$store.dispatch("getUserInfo")
		},
		onShow() {
			this.$http('/assets/redpack').then(res => {
				this.assetInfo = res.data.info
			})
		},
		onReachBottom() {
			this.fetchList()
		},
		methods: {
			fetchList() {
				// return await getRedpackRecord({
				// 	page: this.page,
				// 	per_page: this.per_page
				// })
				if (this.loading) return
				this.loading = true
				return this.$http('/user/invitees', 'GET', {
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
				this.fetchList()
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
		// background: #F2F2F4;

		.card {
			// display: flex;
			width: 700rpx;
			height: 300rpx;
			background: #FFFFFF;
			box-shadow: 0px 14rpx 30rpx 0px rgba(243, 238, 220, 0.4);
			border-radius: 16rpx;
			// margin-top: 20rpx;
			margin: 30rpx auto;
			padding: 10rpx 0rpx;
			align-items: center;
			box-sizing: border-box;

			.item {
				text-align: center;
				font-size: 28rpx;
				font-weight: 500;
				
				.icon-arrow-right {
					font-size: 40rpx;
					position: relative;
					top: 4rpx;
				}
			}
			.item-1 {
				text-align: center;
				margin-top: 40rpx;
				.price-c {
					font-size: 50rpx;
				}
			}
			.bottom-c {
				display: flex;
				justify-content: space-around;
				align-items: center;
				padding: 0rpx 100rpx;
				margin-top: 20rpx;
				.item-2 {
					.s-title {
						color: gray;
					}
					.price-c {
						font-size: 32rpx;
					}
				}
				.line {
					height: 50rpx;
					width: 1rpx;
					border-left: 1rpx solid #ddd;
				}
				.item-3 {
					.s-title {
						color: gray;
					}
					.price-c {
						font-size: 32rpx;
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
		padding-top: 460rpx;
		padding-bottom: 80rpx;
	}

	.list-item {
		display: flex;
		padding: 24rpx 0;
		border-bottom: 1px solid #f3f3f3;
		align-items: center;
		
		.headimg {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
			border: 1rpx solid #f1f1f1;
		}
		
		.middle {
			flex-grow: 1;
			margin-left: 10rpx;
			.name {
				font-weight: 500;
				
			}
			.time {
				font-size: 28rpx;
				margin-top: 4rpx;
			}
		}
		
		.icon-arrow-right {
			font-size: 42rpx;
			margin-left: 8rpx;
			color: #ccc;
		}
	}


	.footer {
		// display: none;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		// background-color: #f5f5f5;

		.footer-button {
			margin: 0 auto;
			margin-bottom: 10rpx;
			width: 600rpx;
			height: 86rpx;
			line-height: 86rpx;
			text-align: center;
			font-size: 30rpx;
			font-weight: bold;
			background-color: #ffcc00;
			box-shadow: 0 0 20rpx rgba(255, 220, 0, 0.6);
			border-radius: 80rpx;
		}
	}
</style>
