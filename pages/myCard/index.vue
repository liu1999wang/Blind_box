<template>
	<view class="container">
		<navigator url="/pages/myScore/index">
			<view class="global-shadow score-c">
				<image class="headimg" :src="userInfo.headimg"></image>
				<view class="score-key">可用{{scoreAlias}}</view>
				<view class="score-value">{{userInfo.score}}</view>
				<text class="new-iconfont icon-arrow-right"></text>
			</view>
		</navigator>
		<view class="list">
			<view class="card card1" v-if="showBoxCard.is_show">
				<view class="top">
					<view class="title">透视卡</view>
					<view class="total">{{showBoxCard.my_balance}}</view>
				</view>
				<view class="desc">
					使用透视卡可以看到盒子里是哪一个款
				</view>
				<view class="price-c">
					<view class="price">
						{{showBoxCard.score_price}}{{scoreAlias}}/张
					</view>
					<view class="button" @tap="getShowBoxCard">
						<text>兑换</text>
					</view>
					<text class="new-iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="card card2"  v-if="excludeBoxCard.is_show">
				<view class="top">
					<view class="title">排除卡</view>
					<view class="total">{{excludeBoxCard.my_balance}}</view>
				</view>
				<view class="desc">
					使用排除卡可以排除盒子里不是哪一个款
				</view>
				<view class="price-c">
					<view class="price">
						{{excludeBoxCard.score_price}}{{scoreAlias}}/张
					</view>
					<view class="button"  @tap="getExcludeBoxCard">
						<text>兑换</text>
					</view>
					<text class="new-iconfont icon-arrow-right"></text>
				</view>
			</view>
			<view class="card card2"  v-if="doubleBoxCard.is_show">
				<view class="top">
					<view class="title">{{doubleBoxCard.double_card_info.title}}</view>
					<view class="total">{{doubleBoxCard.my_balance}}</view>
				</view>
				<view class="desc">
					{{doubleBoxCard.double_card_info.description}}
				</view>
<!-- 				<view class="price-c">
					<view class="price">
						{{doubleBoxCard.score_price}}{{scoreAlias}}/张
					</view>
					<view class="button"  @tap="getDoubleBoxCard" v-if="doubleBoxCard.score_price">
						<text>兑换</text>
					</view>
					<text class="new-iconfont icon-arrow-right"></text>
				</view> -->
			</view>
			
			
			<NoData v-if="!excludeBoxCard.is_show && !showBoxCard.is_show && !doubleBoxCard"></NoData>
		</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
		},
		data() {
			return {
				showBoxCard: {
					score_price: 0,
					my_balance: 0
				},
				excludeBoxCard: {
					score_price: 0,
					my_balance: 0
				},
				doubleBoxCard: {
					score_price: 0,
					my_balance: 0
				}
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
		},
		onLoad() {
		},
		onShow() {
			this.initData()
		},
		methods: {
			initData() {
				this.$store.dispatch("getUserInfo")
				
				this.$http('/user/cards').then(res => {
					this.showBoxCard = res.data.show_box_card
					this.excludeBoxCard = res.data.exclude_box_card
					this.doubleBoxCard =res.data.double_box_card
					console.log(res.data.double_box_card)
				})
			},
			getShowBoxCard () {
				console.log(this.showBoxCard.score_price)
				if (!this.showBoxCard.score_price) {
					uni.showToast({
						title: '暂无可兑换通道',
						icon: 'none'
					})
					return false
				}
				
				uni.showModal({
					title: '确认兑换透视卡',
					content: '支付' + this.showBoxCard.score_price + this.scoreAlias +  '兑换1张透视卡',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '兑换中',
								mask: true
							})
							this.$http('/card-orders', 'POST', {
								type: 'show_box'
							}).then(res => {
								this.initData()
								uni.showToast({
									title: '恭喜兑换成功啦~',
									icon: 'none'
								})
							})
						}
					}
				})
			},
			getExcludeBoxCard () {
				console.log(this.excludeBoxCard.score_price)
				if (!this.excludeBoxCard.score_price) {
					uni.showToast({
						title: '暂无可兑换通道',
						icon: 'none'
					})
					return false
				}
				
				uni.showModal({
					title: '确认兑换排除卡',
					content: '支付' + this.excludeBoxCard.score_price + this.scoreAlias + '兑换1张排除卡',
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '兑换中',
								mask: true
							})
							this.$http('/card-orders', 'POST', {
								type: 'exclude_box'
							}).then(res => {
								this.initData()
								uni.showToast({
									title: '恭喜兑换成功啦~',
									icon: 'none'
								})
							})
						}
					}
				})
			},
			getDoubleBoxCard () {
				console.log(this.doubleBoxCard.score_price)
				if (!this.doubleBoxCard.score_price) {
					uni.showToast({
						title: '暂无可兑换通道',
						icon: 'none'
					})
					return false
				}
				
				uni.showModal({
					title: '确认兑换'+this.doubleBoxCard.double_card_info.title,
					content: '支付' + this.doubleBoxCard.score_price + this.scoreAlias + '兑换1张'+this.doubleBoxCard.double_card_info.title,
					success: res => {
						if (res.confirm) {
							uni.showLoading({
								title: '兑换中',
								mask: true
							})
							this.$http('/card-orders', 'POST', {
								type: 'double_box'
							}).then(res => {
								this.initData()
								uni.showToast({
									title: '恭喜兑换成功啦~',
									icon: 'none'
								})
							})
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.score-c {
		display: flex;
		align-items: center;
		padding: 20rpx 30rpx;
		.headimg {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			
		}
		.score-key {
			flex-grow: 1;
			margin-left: 10rpx;
			font-weight: normal;
			font-weight: 500;
		}
		.score-value {
			font-weight: 500;
		}
		.icon-arrow-right {
			font-size: 40rpx;
		}
	}
	.list {
		
	}
	.card {
		width: 700rpx;
		height: 320rpx;
		margin: 40rpx auto;
		background-repeat: no-repeat;
		background-size: 100% 100%;
		border-radius: 28rpx;
		padding: 60rpx 60rpx;
		box-sizing: border-box;
		
		&.card2 {
			background: url('https://bus-cdn.hquesoft.com/box/card1.png');
			background-repeat: no-repeat;
			background-size: 100% auto;
			box-shadow: 0px 18rpx 27rpx 0px rgba(255, 106, 35, 0.3);
		}
		
		&.card1 {
			background: url('https://bus-cdn.hquesoft.com/box/card2.png');
			background-repeat: no-repeat;
			background-size: 100% auto;
			box-shadow: 0px 18rpx 27rpx 0px rgba(198, 141, 3, 0.3);
		}
		
		.top {
			display: flex;
			align-items: center;
			.title {
				font-size: 46rpx;
				font-weight: bold;
				color: #FFFFFF;
				flex-grow: 1;
			}
			
			.total {
				background: rgba(0, 0, 0, 0.2);
				text-align: center;
				color: white;
				padding: 4rpx 30rpx;
				border-radius: 30rpx;
				font-weight: 500;
			}
		}
		.desc {
			font-size: 26rpx;
			font-weight: 500;
			color: #FFFFFF;
			opacity: 0.8;
			margin-top: 20rpx;
		}
		
		.price-c {
			margin-top: 20rpx;
			display: flex;
			align-items: center;
			.price {
				flex-grow: 1;
				color: #666;
				font-weight: 500;
				font-size: 28rpx;
			}
			.button {
				font-weight: 500;
				color: #FFFFFF;
				line-height: 40px;
			}
			.icon-arrow-right {
				font-weight: 500;
				color: #FFFFFF;
				font-size: 40rpx;
			}
		}
	}
</style>
