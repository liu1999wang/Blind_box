<template>
	<view class="container-scope animated bounceInDown" :class="{'with-navtar': isNavbarEnable}">
		<view class="content-scope" v-if="isNotOpen">
			<!-- 未开出盒子 -->
			<view class="title" style="margin-top: 300rpx;">
				抢购用户太多了
			</view>
			<view class="title" style="margin-top: 20rpx;">
				请不要离开此页面，等待几秒后刷新哦~
			</view>
			<view class="bottom">
				<view class="button-c">
					<view class="btn confirm bg-purple" @tap="handleRefresh">
						立即刷新
					</view>
				</view>
			</view>
		</view>
		<view class="content-scope" v-else>
			<view class="title" v-if="isOpen">恭喜您获得</view>
			
			<view class="unopen-c" :class="boxImgMode" v-if="!isOpen">
				<view class="unopen" :class="{a0: status===0, a1: status===1}">
					<image :src="boxImg || defaultBoxImage" mode="aspectFit"></image>
				</view>
			</view>
			<scroll-view class="scroll-view-212" scroll-y v-else>
				<view class="sku-list">
					<view class="item" @tap="checkSku(item)" :class="'item-' + skus.length" v-for="(item, index) in skus">
						<view class="thumb-c">
							<image class="thumb" :src="item.thumb" mode="aspectFit"></image>
							<view class="title">{{item.title}}</view>
							<view class="total">×{{item.total}}</view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			<!-- 赠送集卡机会-->
			<view class="lottery-tips" v-if="showResult && rewardJikaTimes" @tap="goJikaDetail">
				<text>恭喜您额外获得</text>
				<text class="ticket-total">{{rewardJikaTimes.total}}</text>
				<text>次集卡机会</text>
				<text class="new-iconfont icon-arrow-right"></text>
			</view>
			<!-- 赠送抽奖码-->
			<view class="lottery-tips" v-else-if="showResult && rewardLotteryTicket" @tap="goLotteryDetail">
				<text>恭喜您额外获得</text>
				<text class="ticket-total">{{rewardLotteryTicket.total}}</text>
				<text>张活动抽奖码</text>
				<text class="new-iconfont icon-arrow-right"></text>
			</view>
			
			<view class="bottom" v-if="showResult">
				<!-- <view class="luck-tips">
					<text>恭喜您获得\n{{openInfo.title}}</text>
				</view> -->
				<view class="button-c" v-if="isReturnSaleSuccess">
					<view class="btn confirm bg-purple" @tap="goBack">
						再抽一个
					</view>
					<view class="btn return-sale bg-white">
						已返售
					</view>
				</view>
				<view class="button-c" v-else-if="tryMode">
					<view class="btn confirm bg-purple" @tap="goBack">
						试玩不发货哦~
					</view>
				</view>
				<view class="button-c" v-else>
					<view class="btn confirm bg-purple" @tap="handleOk">
						{{buttonTitle||'去发货'}}
					</view>
					<view class="btn return-sale" @tap="returnSale"  v-if="!orderConfig.is_ban_return_sale">
						查看
					</view>
				</view>
			</view>
			
			<view class="close-btn" @tap="close" v-if="showResult">
				<text class="new-iconfont icon-close"></text>
			</view>

			<!-- <view class="reward-row" v-if="showResult && openInfo.score_reward">
				<view>
					<text class="number">{{openInfo.score_reward}}</text><text>{{scoreAlias}}</text>
				</view>
				<view class="text-c">
					<text>恭喜你获得随机{{scoreAlias}}礼包</text>
					<navigator class="check-asset-c" url="/pages/myScore/index">
						<text class="check-asset-btn">查看余额</text>
					</navigator>
				</view>
			</view> -->

		</view>

		<ReturnSalePopup @cancel="isShowReturnSale = false" @refresh="isReturnSaleSuccess = true" :uuid="orderUuid"
			v-if="isShowReturnSale"></ReturnSalePopup>

	</view>
</template>

<script>
	export default {
		props: {
			boxImg: String,
			boxImgMode: String,
			buttonTitle: String,
			order: Object,
			tryMode: Boolean,
			tryInfo: Object,
			isNavbarEnable: false,
			config: Object
		},
		data() {
			return {
				isOpen: false,
				showResult: false,
				status: 0,
				isShowReturnSale: false,
				isReturnSaleSuccess: false,
				package: {},
				defaultBoxImage: 'https://cdn2.hquesoft.com/box/openbox.png',
				isNotOpen: false,      // 未开启
			}
		},
		mounted() {
			// this.orderUuid = '605f34c73e765' // 测试
			
			this.initData()
		},
		computed: {
			skus() {
				return this.package.skus || []
			},
			orderConfig() {
				return this.$store.getters.setting.order
			},
			rewardJikaTimes() {
				return this.package.reward && this.package.reward.jika_times
			},
			rewardLotteryTicket() {
				return this.package.reward && this.package.reward.lottery_ticket
			}
		},
		methods: {
			initData() {
				// 演示模块
				if (this.tryMode) {
					this.$http(`/try/packages/${this.tryInfo.package_uuid}`).then(res => {
						this.package = res.data
						this.startOpenAnimate()
					})
				}
				else {
					this.$http(`/asset/package?order_id=${this.order.id}`).then(res => {
						this.package = res.data
						
						this.startOpenAnimate()
					}).catch(err  => {
						// 未开启
						this.isNotOpen = true
					})
				}
			},
			startOpenAnimate()  {
				// 不需要开盒动画
				if (this.config && this.config.animation_mode == 'none') {
					// uni.vibrateLong()
					this.status = 1
					setTimeout(() => {
						this.isOpen = true
						this.$playAudio('open')
						setTimeout(() => {
							this.showResult = true
						}, 800)
					}, 400)
				}
				else {
					// 开盒动画
					setTimeout(() => {
						// uni.vibrateLong()
					}, 500)
					// uni.vibrateLong()
					
					setTimeout(() => {
						this.status = 1
						setTimeout(() => {
							this.isOpen = true
							this.$playAudio('open')
							setTimeout(() => {
								this.showResult = true
							}, 1100)
						}, 400)
					}, 2500)
				}
			},
			handleRefresh() {
				// this.order = {
				// 	id: 2214
				// }
				this.isNotOpen  = false
				this.initData()
			},
			goLotteryDetail() {
				uni.navigateTo({
					url: '/pages/lottery/detail?uuid=' + this.rewardLotteryTicket.uuid
				})
			},
			goJikaDetail() {
				uni.navigateTo({
					url: '/pages/jika/detail?uuid=' + this.rewardJikaTimes.uuid
				})
			},
			returnSale() {
				uni.navigateTo({
					url: '/pages/myBox/index'
				})
				// if (this.tryMode) {
				// 	uni.showModal({
				// 		title: '试一试模式不能返售哦~'
				// 	})
				// 	return false
				// }
				// this.isShowReturnSale = true
			},
			handleOk() {
				uni.redirectTo({
					url: "/pages/myBox/index"
				})
				// uni.navigateTo({
				// 	url: "/pages/orderList/index"
				// })
				// this.$emit('close')
				// this.$emit('refresh')
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			},
			close() {
				this.$emit('close')
				this.$emit('refresh')
			},
			checkSku (item) {
				if (item.sku_type === 'score') {
					uni.navigateTo({
						url: '/pages/myScore/index'
					})
				}
				else if (item.sku_type === 'coupon') {
					uni.navigateTo({
						url: '/pages/myCoupons/index'
					})
				}
				else if (item.sku_type === 'redpack') {
					uni.navigateTo({
						url: '/pages/myRedpack/index'
					})
				}
				else {
					console.log(item)
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.lottery-tips {
		background: white;
		font-size: 26rpx;
		padding: 10rpx 20rpx 10rpx 30rpx;
		border-radius: 30rpx;
		// margin-bottom: 30rpx;
		width: 400rpx;
		margin: 30rpx auto;
		text-align: center;
		justify-content: center;
		
		.ticket-total {
			font-weight: 500;
			font-size: 36rpx;
			color: #E63111;
		}
		.icon-arrow-right {
			font-size: 40rpx;
		}
		display: flex;
		
		align-items: center;
	}
	
	.reward-row {
		text-align: center;
		font-size: 28rpx;
		font-weight: 500;

		.number {
			font-size: 46rpx;
			color: red;
			font-weight: 700;
			margin-right: 6rpx;
		}

		.text-c {
			color: gray;
			font-size: 28rpx;
			margin-top: 6rpx;

			.check-asset-c {
				display: inline;
				margin-left: 6rpx;
			}

			.check-asset-btn {
				color: #666;
				text-decoration: underline;
			}
		}
	}

	.container-scope {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #efefef;
		// background: rgba(0, 0, 0, 0.5);
		z-index: 100;
		padding-top: 200rpx;
		
		/* #ifdef H5 */
		padding-top: 40rpx;
		/* #endif */
		
		&.with-navtar {
			padding-top: 100rpx;
		}

		.close-btn {
			font-size: 38rpx;
			// font-weight: 500;
			background: #FFCC00;
			border: 2px solid #FFCC00;
			border-radius: 50%;
			width: 60rpx;
			color: white;
			// position: absolute;
			margin: 0rpx auto;
			right: 50rpx;
			top: 260rpx;
			height: 60rpx;
			text-align: center;
			line-height: 56rpx;
			box-sizing: border-box;
			z-index: 1000;
		}

		.title {
			text-align: center;
			font-size: 34rpx;
			font-weight: 500;
			overflow: hidden;
			text-overflow: ellipsis;
			display: -webkit-box;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;
		}
	}

	.content-scope {
		width: 100%;
		position: relative;
		// border: 1px solid red;
		// overflow: hidden;
		min-height: 100rpx;
		margin-top: 30rpx;
		
		.unopen-c {
			width: 300rpx;
			height: 420rpx;
			margin: 0 auto;
			margin-top: 280rpx;
			position: relative;
		
			&:after {
				content: "";
				position: absolute;
				bottom: -50rpx;
				left: -50rpx;
				width: 400rpx;
				height: 100rpx;
				border-radius: 50%;
				background-color: #DCDFE6;
				box-shadow: 0 0 20rpx rgba(220, 223, 230, 1);
			}
			
			&.square {
				width: 470rpx;
				height: 470rpx;
				
				&:after {
					left: 0rpx;
					width: 470rpx;
				}
			}
		}
		
		.unopen {
			width: 100%;
			height: 100%;
			position: relative;
			z-index: 11;
		
			&.a0 {
				animation: shakeTopx 0.2s;
				animation-delay: 0.7s;
				animation-iteration-count: infinite;
				animation-timing-function: linear;
				transform-origin: bottom center;
			}
		
			&.a1 {
				animation: hide 0.3s;
				transform-origin: bottom center;
				animation-fill-mode: forwards;
			}
		
			image {
				width: 100%;
				height: 100%;
			}
		}
	}

	
	.scroll-view-212 {
		max-height: 50vh;
		// min-height: 500rpx;
		padding: 0rpx;
		// height: 800rpx;
		box-sizing: border-box;
		// padding-top: 100rpx;
	}

	.sku-list {
		margin-top: 30rpx;
		width: 100%;
		display: flex;
		// flex-direction: column;
		flex-wrap: wrap;
		justify-content: center;
		// border: 1px solid  red;
		// margin-bottom: 0rpx;
		// padding: 0rpx 60rpx 0rpx 100rpx;

		.item {
			// float: left;
			// float: left;
			width: 210rpx;
			height: 310rpx;
			margin-top: 30rpx;
			// border: 1px solid red;
			margin-left: 20rpx;
			// margin: 0 auto;
			// margin-top: 200rpx;
			position: relative;
		

			&:after {
				content: "";
				position: absolute;
				top: -60%;
				left: -50%;
				// top: 0rpx;
				// left: 0rpx;
				width: 200%;
				height: 200%;
				border-radius: 50%;
				// border: 1px solid red;
				// border: 1px solid red;
				background: radial-gradient(circle, #ffde7c, #efefef 50%);
				// clip:rect(50px,50px,200px,200px);
				clip-path: circle(200rpx at 50% 50%);
				// border: 1px solid red;
			}

			image {
				width: 100%;
				height: 100%;
				display: block;
			}

			.thumb-c {
				margin: 0 auto;
				width: 150rpx;
				height: 200rpx;
				position: relative;
				background-color: #ffde7c;
				z-index: 11;
				animation: showbox 1s;
				transform-origin: center;
				animation-fill-mode: forwards;
				box-shadow: 0 0 20rpx rgba(255, 222, 124, 0.6);
			}

			.title {
				color: black;
				font-size: 26rpx;
				font-weight: 500;
				text-align: center;
				margin-top: 10rpx;
			}
			.total {
				position: absolute;
				right: 0rpx;
				top: 0rpx;
				background: rgba(0, 0, 0, 0.4);
				color: white;
				font-size: 22rpx;
				font-weight: 500;
				padding: 0rpx 20rpx;
				border-radius: 20rpx;
			}
			
			// 单个
			&.item-1 {
				width: 420rpx;
				height: 600rpx;
				.thumb-c {
					width: 300rpx;
					height: 460rpx;
				}
				
				&:after {
					clip-path: circle(10000rpx at 50% 50%);
				}
			}
		}
	}
	
	.bottom {
		margin-top: 130rpx;
	}

	.luck-tips {
		position: relative;
		z-index: 11;
		text-align: center;
		font-size: 28rpx;
		letter-spacing: 1px;
		font-weight: bold;
		line-height: 1.6;
		margin-top: 26rpx;
	}

	.button-c {
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 11;
		margin: 60rpx 110rpx;

		.btn {
			z-index: 11;
			height: 82rpx;
			line-height: 82rpx;
			width: 240rpx;
			text-align: center;
			background-color: #ffcc00;
			border-radius: 10rpx;
			font-size: 26rpx;
			font-weight: bold;
			&:last-child {
				margin-left: 30rpx;
			}
		}
	}

	@keyframes shakeTopx {
		0% {
			transform: rotate(-6deg);
		}

		25% {
			transform: rotate(0deg);
		}

		50% {
			transform: rotate(6deg);
		}

		75% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(-6deg);
		}
	}

	@keyframes hide {
		0% {
			transform: scale(1);
			opacity: 1;
		}

		100% {
			transform: scale(0);
			opacity: 0;
		}
	}

	@keyframes showbox {
		0% {
			transform: scale(0, 0);
			opacity: 0;
		}

		30% {
			transform: scale(1, 1);
			opacity: 1;
		}

		50% {
			transform: scale(0.7, 1);
			opacity: 1;
		}

		100% {
			transform: scale(1, 1);
		}
	}
</style>
