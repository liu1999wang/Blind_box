<template>
	<view class="container" :style="'background-size: 100% auto; background-repeat: no-repeat; background-image: url(' + bgImage + ');'">
		<template v-if="isInit">
			<view class="lottery-c">
				<LotteryCom
					:lottery-size="lotteryConfig.lotterySize"
					:action-size="lotteryConfig.actionSize"
					:ring-count="6"
					:duration="3"
					:prize-list="prizeList"
					:prize-index="prizeIndex"
					@reset-index="prizeIndex = -1"
					@draw-start="handleDrawStart"
					@draw-end="handleDrawEnd"
					@finish="handleDrawFinish"
					@click-bg="showSkuList"
					v-if="prizeList.length"
				></LotteryCom>
			</view>
			
			<view class="text-c">
				<text class="remain-time">剩余抽奖 {{info.my_ticket_total}}次</text>
				<!-- <text class="get-remain-time" @tap="buyTicket">兑换</text> -->
			</view>
			<view class="remain-text">
				<text>{{info.score_price}}{{scoreAlias}}/次</text> 
				<text class="get-remain-time" @tap="buyTicket">兑换</text>
			</view>
			
			<view class="invite-c" v-if="info.is_invite_enabled">
				
				<view class="body">
					<view class="item">
						<view class="total">{{info.invite_info.invite_total || 0}}</view>
						<view class="text">已邀请好友</view>
					</view>
					<view class="item">
						<view class="total">{{info.invite_info.invite_reward || 0}}</view>
						<view class="text">已获取次数</view>
					</view>
					<view class="item">
						<view class="total">{{info.invite_info.available_reward || 0}}</view>
						<view class="text">剩余可获次数</view>
					</view>
				</view>
				
				<view class="bottom">
					<!-- <view class="card-title">我的邀请</view> -->
					<view class="detail-btn" @tap="showInviteRecordPopup">邀请好友获取次数</view>
				</view>
				<!-- <view class="headimg-list">
					<image class="item" :src="item.headimg" mode="widthFix" v-for="(item, index) in info.my_invitees"></image>
				</view> -->
			</view>
			
			<view class="btn-c">
				<navigator class="button global-shadow-2" url="/pages/myBox/index">
					<view>我的奖品</view>
				</navigator>
				<navigator class="button global-shadow-2" :url="'/pages/activityTicket/record?uuid=' + uuid">
					<view>次数记录</view>
				</navigator>
			</view>
			
			<scroll-view scroll-y class="rule-c">
				<view class="title">活动规则</view>
				<view class="rule-list">
					<view v-for="(item, index) in info.rule_list" class="item">
						{{index + 1}}、{{item}}
					</view>
				</view>
			</scroll-view>
			
			<view class="tips">
				<view>抽奖奖品与Apple Inc无关</view>
				<view>本活动最终解释权归本公司所有</view>
			</view>
		</template>
		<template v-else-if="isNotFound">
			<NoData title="活动不存在~"></NoData>
		</template>
		
		<view class="user-c" v-if="userInfo.id">
			<image class="headimg" mode="widthFix" :src="userInfo.headimg"></image>
			<view class="score">{{(userInfo.score || 0)}}{{scoreAlias}}</view>
		</view>
		
		<BuyActivityTicket nodeType="rotate_lottery" :nodeUuid="info.uuid" @success="buyTicketSuccess" @cancel="isBuyTicket = false" v-if="isBuyTicket"></BuyActivityTicket>
		
		<LotteryResultPopup :skus="luckySkus" v-if="isShowResult" @cancel="isShowResult = false"></LotteryResultPopup>
		
		<InviteRecordPopup :node="info" v-if="isShowInviteRecord" @cancel="isShowInviteRecord=false"></InviteRecordPopup>
		
		<uni-popup  style="z-index: 1000;" ref="detailPopup" type="bottom">
			<BoxSkuPopup :skuList="info.skus" @close="hideSkuList"></BoxSkuPopup>
		</uni-popup>
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import LotteryCom from "./components/Lottery.vue"
	import InviteRecordPopup from "./components/InviteRecordPopup.vue"
	export default {
		components: {
			LotteryCom,
			InviteRecordPopup
		},
		data() {
			return {
				isInit: false,
				isNotFound: false,
				isShowResult: false,
				uuid: '',
				info: {},
				luckySkus: [],
				// 以下是转盘配置相关数据
				lotteryConfig: {
				  // 抽奖转盘的整体尺寸，单位rpx
				  lotterySize: 640,
				  // 抽奖按钮的尺寸，单位rpx
				  actionSize: 200
				},
				isBuyTicket: false,
				prizeIndex: -1,
				prizeList: [],
				isShowInviteRecord: false
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			share() {
				let title = this.info.title
				if (this.userInfo.name) {
					title = this.userInfo.name + '邀请您来赢奖品哦~'
				}
				return {
					path: '/pages/rotateLottery/detail?uuid=' + this.info.uuid + '&invite_node=rotate_lottery-' + this.info.uuid,
					title: title,
					thumb: this.info.thumb
				}
			},
			bgImage () {
				return this.info.bg || 'http://hquesoft.oss-cn-shenzhen.aliyuncs.com/box/rotateLottery/bg.png'
			}
		},
		watch: {},
		onLoad(e) {
			this.uuid = e.uuid

			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				this.isInit = true
				uni.hideLoading()
				this.$visitor.record({
					type: 'activity_detail',
					title: this.info.title,
					uuid: this.info.uuid
				})
			}).catch(res => {
				if (res.statusCode == 404) {
					this.isNotFound = true
				}
			})
		},
		onShow() {
			if (this.isInit) {
				this.initData().then(res => {
					this.isInit = true
				}).catch(res => {
					if (res.statusCode == 404) {
						this.isNotFound = true
					}
				})
			}
		},
		methods: {
			hideSkuList() {
				this.$refs.detailPopup.close()
			},
			showSkuList() {
				this.$refs.detailPopup.open('bottom')
			},
			showInviteRecordPopup() {
				this.isShowInviteRecord = true
			},
			buyTicketSuccess() {
				this.isBuyTicket = false
				uni.showToast({
					title: '兑换成功~',
					icon: 'none'
				})
				
				this.$store.dispatch("getUserInfo")
				
				this.initData()
			},
			buyTicket() {
				this.isBuyTicket = true
			},
			initData() {
				return this.$http(`/rotate-lotteries/${this.uuid}`).then(res => {
					this.info = res.data.info
					
					this.prizeList = this.info.skus.map(item => {
						return {
							prizeId: item.id,
							prizeName: item.title,
							prizeStock: item.stock,
							prizeWeight: item.id,
							prizeImage: item.thumb + '?x-oss-process=image/resize,w_200',
						}
					})
					
					uni.setNavigationBarTitle({
						title: res.data.info.title
					})
				})
			},
			// 本次抽奖开始
			handleDrawStart () {
			  // 这里需要处理你的中奖逻辑，并得出 prizeIndex
			  this.$http(`/rotate-lotteries/${this.uuid}/run`, 'POST').then(res => {
				
				// 抽奖结果
				let luckyId = res.data.skus[0].base_sku_id
				
				this.prizeIndex = this.prizeList.findIndex(item => {
					return item.prizeId === luckyId
				})
				
				this.luckySkus = res.data.skus
				
				this.initData()
				
			  }).catch(err => {
				  if (err.data.code === 14002) {
					 //  uni.showToast({
					 //  	title: '剩余次数不足~',
						// icon: 'none'
					 //  })
					  // this.isBuyTicket = true
				  }
				  else {
					  uni.showToast({
					  	title: err.data.message,
						icon: 'none'
					  })
				  }

			  })
			  
			  // this.prizeIndex = 1
			  // this.tryLotteryDraw()
			},
			// 本次抽奖结束
			handleDrawEnd () {
			  // 完成抽奖后，这里处理你拿到结果后的逻辑
			  this.isShowResult = true
			},
			// 抽奖转盘绘制完成
			handleDrawFinish (res) {
			  // 抽奖转盘准备就绪后，这里处理你的逻辑
			  // 请查看示例项目中的代码
			  // console.log('抽奖转盘绘制完成', res)
			}
		},
		onPageScroll(e) {

		},

	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 2260rpx;
		
		// padding-bottom: 160rpx;
		
		.lottery-c {
			padding-top: 400rpx;
		}
		
		.user-c {
			background: white;
			border-radius: 100rpx;
			display: flex;
			align-items: center;
			position: fixed;
			left: 30rpx;
			top: 30rpx;
			padding-right: 20rpx;
			.headimg {
				width: 60rpx;
				height: 60rpx;
				border-radius: 50%;
			}
			.score {
				font-size: 26rpx;
				font-weight: 500;
				margin-left: 10rpx;
			}
		}
		
		.rule-c {
			background: white;
			width: 680rpx;
			margin: 30rpx auto 30rpx auto;
			border-radius: 10rpx;
			padding: 30rpx 30rpx;
			box-sizing: border-box;
			height: 450rpx;
			background: #FFDFB8;
			
			.title {
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
				margin-bottom: 10rpx;
				position: relative;
				
				&:after, &:before {
					position: absolute;
					top: 50%;
					background: #333;
					content: "";
					height: 1px;
					width: 50rpx;
				}
				/*调整背景横线的左右距离*/
				&:before {
					left: 160rpx;
				}
				&:after {
					right: 160rpx;
				}
			}
			
			.item {
				margin-top: 16rpx;
				font-size: 26rpx;
				font-weight: 500;
				text-align: justify;
			}
		}
		
		.text-c {
			margin-top: 30rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 500;
			.remain-time {
				color: white;
			}
		}
		
		.remain-text {
			text-align: center;
			color: white;
			margin-top: 20rpx;
			font-size: 28rpx;
			
			.get-remain-time {
				color: #666;
				font-weight: 500;
				margin-left: 10rpx;
				// text-decoration: underline;
				display: inline-block;
				// border: 1px solid black;
				border-radius: 50rpx;
				background: white;
				font-size: 26rpx;
				padding: 2rpx 20rpx;
			}
		}
		
		.btn-c {
			padding: 0rpx 60rpx;
			display: flex;
			justify-content: space-between;
			margin-top: 60rpx;
			.button {
				background: #F7C899;
				width: 46%;
				// align-items: center;
				text-align: center;
				padding: 20rpx 0rpx;
				border-radius: 10rpx;
				font-size: 32rpx;
				font-weight: 500;
				color: #A2401C;
			}
		}
		
		.invite-c {
			background: rgba(0, 0, 0, 0.5);
			background: white;
			border-radius: 20rpx;
			// text-align: center;
			padding: 30rpx 30rpx;
			width: 580rpx;
			margin: 30rpx auto;
			
			.top {
				.card-title {
					text-align: center;
					font-size: 30rpx;
					font-weight: 500;
					// color: ;
					letter-spacing: 6rpx;
					margin-bottom: 30rpx;
					position: relative;
				}
				
				
			}
			
			.bottom {
				.detail-btn {
					border-radius: 50rpx;
					border: 4rpx solid #FF8840;
					background: #FF8840;
					color: white;
					text-align: center;
					font-size: 28rpx;
					padding: 10rpx 0rpx;
					margin-top: 30rpx;
				}
			}
			
			
			.body {
				display: flex;
				.item {
					flex-grow: 1;
					text-align: center;
					.total {
						color: #FF8840;
						font-weight: bold;
						font-size: 50rpx;
					}
					.text {
						font-size: 24rpx;
						font-weight: 400;
					}
				}
			}
			
			.headimg-list {
				display: inline;
				.item {
					width: 50rpx;
					height: 50rpx;
					border-radius: 50%;
					margin-left: 10rpx;
				}
			}
		}
		
		.tips {
			margin-top: 60rpx;
			text-align: center;
			font-size: 24rpx;
		}
	}
	
</style>
