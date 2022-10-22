<template>
	<view class="container-scope animated">
		<!-- <view class="title" v-if="isOpen">恭喜您获得</view> -->
		
		
		<view class="waiting-card" v-if="isNotOpen">
			<!-- 未开出盒子 -->
			<view class="title" style="margin-top: 60rpx;">
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
		
		<view class="content-scope"  v-else>
			



			
<!-- 			<view class="close-btn" @tap="close" v-if="showResult">
				<text class="new-iconfont icon-close"></text>
			</view> -->
			
			<view v-if="!isOpen">
				<!-- <view class="unopen" :class="{a0: status===0, a1: status===1}">
					<image :src="boxImg || defaultBoxImage" mode="aspectFill"></image>
				</view> -->
			</view>
			<scroll-view class="scroll-view-212" scroll-y v-else>
				<view class="sku-list" v-if="istry">
					<view class="item" @tap="checkSku(item)" :class="'item-' + tryskus.length" v-for="(item, index) in tryskus">
						<view class="thumb-c">
							<view class="shang-title"  v-if="item.options.shang_title">{{item.options.shang_title}}</view>
							<view class="thumb-box">
								<image class="thumb" :src="item.thumb" mode="aspectFill"></image>
								<view class="total"><view>×{{item.total}}</view></view>
							</view>
							
							<view class="title">{{item.title}}</view>
							<view class="price_box">价值：<text class="price">￥{{item.money_price/100}}</text>元 <text v-if="item.score_price">+{{item.score_price}}{{scoreAlias}}</text></view>
						</view>
					</view>
				</view>
				<view class="sku-list" v-else>
					<view class="item" @tap="checkSku(item)" :class="'item-' + skus.length" v-for="(item, index) in skus">
						<view class="thumb-c">
							<view class="shang-title" :class="{gift: item.options.shang_type === 1}" v-if="item.options.shang_title">{{item.options.shang_title}}</view>
							<view class="thumb-box">
								<image class="thumb" :src="item.thumb" mode="aspectFill"></image>
								<view class="total"><view>×{{item.total}}</view></view>
							</view>
							
							<view class="title">{{item.title}}</view>
							<view class="price_box">价值：<text class="price">￥{{item.money_price/100}}</text>元 <text v-if="item.score_price">+{{item.score_price}}{{scoreAlias}}</text></view>
						</view>
					</view>
				</view>
			</scroll-view>
			
			
			<view class="bottom" v-if="showResult">
				<view class="luck-tips">
					<text>总价值：<text style="color: #ffeb3b;">{{total_money_price/100}}</text>元+<text  style="color: #ffeb3b;">{{total_score_price}}</text>{{scoreAlias}}</text>
					<br><text style="font-size: 24rpx;">注意：分解后不能退返</text>
				</view>

				<view class="button-c" v-if="istry">
					<view class="btn confirm bg-purple onekey_recycle_try" @tap="onekeyrecycle_try">
						
					</view>
					<view class="btn return-sale continue_try" @tap="close"  v-if="!orderConfig.is_ban_return_sale">
						
					</view>
				</view>
				<view class="button-c" v-else>
					<view class="btn confirm bg-purple onekey_recycle" @tap="onekeyrecycle">
						
					</view>
					<view class="btn return-sale continue" @tap="close"  v-if="!orderConfig.is_ban_return_sale">
						
					</view>
				</view>
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


	</view>
</template>

<script>
	export default {
		props: {
			boxImg: String,
			buttonTitle: String,
			order: Object,
			tryMode: Boolean,
			tryInfo: Object,
			info: Object,
			isNavbarEnable: false,
			istry:Boolean,
			payTotal:Number,
			
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
				selectedIds:[],
				total_money_price:0,
				total_score_price:0,
				tryskus:[],
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
			viewFreeOrderDetail() {
				if (this.info.money_price) {
					uni.navigateTo({
						url: '/pages/myRedpack/index'
					})
				}
				else {
					uni.navigateTo({
						url: '/pages/myScore/index'
					})
				}
			},randomSort(a, b) { return Math.random() > 0.5 ? -1 : 1; },
			initData() {
				console.log("111",this.info,this.istry)
				// 演示模块
				if (this.istry) {
					for(let j=0 ; j<this.info.skus.length;j++){
						if(this.info.skus[j].shang_title=="Last赏"){
							this.info.skus.splice(j,1);
						}
						if(this.info.skus[j].shang_title=="最终赏"){
							this.info.skus.splice(j,1);
						}
					}
					
					
					for(let i=0 ; i<this.info.skus.length ; i++){
						this.info.skus[i].total=1
						this.info.skus[i].options={
							room_num: 2,
							shang_title: this.info.skus[i].shang_title,
							shang_type: 0
						}

					}
					
					let skuslist=this.info.skus.sort(this.randomSort);
					this.package.skus=new Array()
					if(this.payTotal==1){
						this.package.skus.push (skuslist[0])
					}else if(this.payTotal==3){
						this.package.skus.push (skuslist[0],skuslist[1],skuslist[2])
					}else if(this.payTotal==5){
						this.package.skus.push (skuslist[0],skuslist[1],skuslist[2],skuslist[3],skuslist[4])
					}
					for (let s of this.package.skus) {
						this.total_money_price+=s.money_price*s.total
						this.total_score_price+=s.score_price*s.total
					}
					this.tryskus=this.package.skus
					console.log(this.package.skus,skuslist)
					this.startOpenAnimate()
					
				}
				else {
					this.$http(`/asset/package?order_id=${this.order.id}`).then(res => {
						this.package = res.data
						for (let s of this.package.skus) {
							this.total_money_price+=s.money_price*s.total
							this.total_score_price+=s.score_price*s.total
						}
						console.log(this.package.skus)
						this.startOpenAnimate()
					}).catch(err  => {
						// 未开启
						this.isNotOpen = true
					})
				}
				
			},
			onekeyrecycle_try(){
				uni.redirectTo({
					url: '/pages/page/index?uuid=635180d9968bf'
				});
			},
			// 一键分解
			onekeyrecycle(){
				uni.showModal({
					title: '确认分解',
					content: '确认要分解吗?',
					success: (res) => {
						
						if (res.confirm)  {
							uni.showLoading({
								title: '分解中...'
							})
							for (let s of this.skus) {
								this.selectedIds.push(s.id)
							}	
							console.log(this.selectedIds)
							this.$http(`/asset/return-sale/confirm`, 'post', {
								ids: this.selectedIds
							}).then(res => {
								this.isReturnSaleSuccess = 0
								
								this.refresh()
								this.isSelectMode = false
								this.$emit('refresh')
							})
						}
					},
					
				})
			  this.close()
			},
			startOpenAnimate()  {
				// 开盒动画
				setTimeout(() => {
					this.status = 1
					setTimeout(() => {
						this.isOpen = true
						this.$playAudio('open')
						setTimeout(() => {
							this.showResult = true
						}, 300)
					}, 200)
				}, 100)
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
				uni.navigateTo({
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
	.waiting-card {
		background: white !important;
		width: 600rpx;
		margin: 0rpx auto;
		padding: 30rpx 30rpx;
		border-radius: 10rpx;
	}
	
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
		// background-color: ;
		background: rgba(0, 0, 0, 0.7);
		z-index: 100;
		// padding-top: 200rpx;

		.close-btn {
			font-size: 38rpx;
			// font-weight: 500;
			background: rgba(255,  255, 255, 0.4);
			border: 2px solid rgba(255,  255, 255, 0.4);
			border-radius: 50%;
			width: 60rpx;
			color: white;
			position: absolute;
			// top: 0rpx;
			right: 200rpx;
			// position: absolute;
			// margin: 0rpx auto;
			right: 50rpx;
			top: -50rpx;
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
			-webkit-line-clamp: 1;
			-webkit-box-orient: vertical;
		}
	}

	.content-scope {
		width: 100%;
		position: relative;
		// border: 1px solid red;
		// overflow: hidden;
		min-height: 100rpx;
		margin-top: 100rpx;

		min-height: 100vh;
		
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
		max-height: 60vh;
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
			// height: 210rpx;
			margin-top: 30rpx;
			// border: 1px solid red;
			margin-left: 20rpx;
			// margin: 0 auto;
			// margin-top: 200rpx;
			position: relative;
			
			// clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
			overflow: hidden;
	

			image {
				width: 100%;
				height: 100%;
				display: block;
			}

			.thumb-c {
				margin: 0 auto;
				width: 210rpx;
				height: 100%;
				position: relative;
				z-index: 11;
				animation: showbox 1s;
				transform-origin: center;
				animation-fill-mode: forwards;
				padding: 20rpx;
				box-sizing: border-box;
				background-color: #2d2d2d;
				
				// box-shadow: 0 0 20rpx rgba(255, 222, 124, 0.6);
				
				// clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
				.thumb-box{
					width: 100%;
					height: 170rpx;
					position: relative;
					overflow: hidden;
					border: 2rpx solid white;
					.thumb {
						background-color: #000000;
						width: 100%;
						height: 100%;
						
					}
				}
				.price_box{
					font-size: 18rpx;
					color: #FFFFFF;
					.price{
						color: red;
						font-size: 24rpx;
						font-weight: 600;
					}
				}
				
			}

			.title {
				color: #FFFFFF;
				font-size: 24rpx;
				font-weight: 500;
				text-align: left;
				margin-top: 10rpx;
			}
			
			.total {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 60%;
				top: 60%;
				background: #f4b30e;
				color: #000000;
				font-size: 22rpx;
				font-weight: 500;
				border-radius: 50%;

				view{
					position: absolute;
					top: calc(40% - 5vw);
					left: calc(40% - 5vw);
					font-size:3vw ;
					font-weight: 600;
				}
				
			}
			
			.shang-title {
				display: block;
				width: 100%;
				color: #f4b30e;
				font-size: 24rpx;
				font-weight: bold;
				margin-bottom: 10rpx;
				&.gift {
					background: #F15858;
				}
				
			}
			
			// 单个
			&.item-1 {
				width: 460rpx;

				.thumb-c {
					width: 460rpx;
					.title {
						font-size: 32rpx;
					}
					.total{
						view{
							position: absolute;
							top: calc(30% - 5vw);
							left: calc(30% - 5vw);
							font-size:5vw ;
							
						}
					}
					.shang-title {
						font-size: 32rpx;
						
					}
					padding-right: 25rpx;
					.thumb-box{
						height: 380rpx;
						position: relative;
						overflow: hidden;
						border: 2rpx solid white;
						
						.thumb {
							background-color: #000000;
							width: 100%;
							height: 100%;
							
						}
					}
					.price_box{
						font-size: 24rpx;
						color: #FFFFFF;
						.price{
							color: red;
							font-size: 30rpx;
						}
					}
				}
				
				// &:after {
				// 	clip-path: circle(10000rpx at 50% 50%);
				// }
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
		font-size: 36rpx;
		letter-spacing: 1px;
		font-weight: bold;
		line-height: 1.6;
		margin-top: 26rpx;
		color:#FFFFFF;
	}
	
	.free-order-c {
		position: fixed;
		top: 60rpx;
		left: 100rpx;
		width: 550rpx;
		background: white;
		border-radius: 8rpx;
		box-shadow: 0 0 20rpx rgba(100, 100, 100, 0.6);
		padding: 20rpx 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: red;
		.icon-arrow-right {
			font-size: 40rpx;
		}
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
			// border-radius: 10rpx;
			font-size: 26rpx;
			font-weight: bold;
			color: white;
			&:last-child {
				margin-left: 30rpx;
			}
		}
		.onekey_recycle{
			width: 280rpx;

			background: url("https://www.hebide.cc/newimages/newyi/onekey_recycle.png") no-repeat #000000 !important;
			background-size: 100%!important;
			
		}
		.continue{
			width: 280rpx;

			background: url("https://www.hebide.cc/newimages/newyi/continue.png") no-repeat #000000 !important;
			background-size: 100%!important;
		}
		.onekey_recycle_try{
			width: 280rpx;
			background: url("https://www.hebide.cc/newimages/jiaoyi.png") no-repeat #000000 !important;
			background-size: 100%!important;	
		}
		.continue_try{
			width: 280rpx;
			background: url("https://www.hebide.cc/newimages/zhende.png") no-repeat #000000 !important;
			background-size: 100%!important;
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
