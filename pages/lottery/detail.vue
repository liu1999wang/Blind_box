<template>
	<view class="container">
		<view class="box-pop" @tap="topage()">

		</view>

		<template v-if="isInit">
			
			<view class="session-c" v-if="info.session_total !== 1" @tap="$tool.toPage(`/pages/lotteryActivity/userList?uuid=${info.uuid}&type=all`)">
				<!-- <view class="block-title" style="margin-top: 60rpx;">活动期数</view> -->
				第{{info.current_session}}期 / 共{{info.session_total}}期
			</view>
			
			<image class="thumb" mode="aspectFill" :src="info.thumb" @tap="$tool.previewImage([info.thumb], 0)"></image>

			<view class="body"
				style="background: url('https://cdn2.hquesoft.com/box/activity-detail-bg.png'); background-size: 100% auto; background-repeat: no-repeat;">
				<view class="time">
					<text v-if="info.union_status === 'expired'">已结束</text>
					<text v-else-if="info.union_status === 'pending'">活动未开始</text>
					<template v-else>
						<template v-if="info.emit_type === 'time'" >
							剩余时间：<CountDown class="text" style="text-align: right;" :start="info.emit_time" :end="info.end_at"></CountDown>
							<text style="float: right;font-size: 26rpx;">免费抽取<text style="color: #ffff00; font-size: 36rpx; margin: 0 5rpx; font-weight: bold;">{{info.prize_total}}</text>个幸运用户</text>
						</template>
						<text v-else>还差{{info.emit_user_total - info.current_session_records_count}}人即开奖 <text style="float: right;font-size: 26rpx;">免费抽取<text style="color: #ffff00; font-size: 36rpx; margin: 0 5rpx; font-weight: bold;">{{info.prize_total}}</text>个幸运用户</text></text>
						
					</template>
				</view>
				<view class="title">
					<text class="tag" v-if="info.type_text">{{info.type_text}}</text>
					<text>{{info.title}}</text>
				</view>
				
				<view class="sub-title" v-if="info.sub_title">{{info.sub_title}}</view>

				<!-- 价格 -->
<!-- 				<view class="price-c">
					<PriceDisplay :info="info"></PriceDisplay>
				</view> -->

				<view class="rule-c block">
					<view class="block-title" style="">活动奖品</view>
					<view class="sku-list">
						<view class="item" v-for="(item, index) in info.skus">
							<image style="width: 70%; margin: auto;" :src="item.thumb" alt="加载中" mode="widthFix">
							<text class="text">{{item.title}}</text>
							<text class="stock">参考价：<text style="color: red; font-weight: 900;">￥{{item.money_price/100}}</text>元</text>
							<text class="stock">抽{{item.per_session_stock}}份/期</text>
						</view>
					</view>

					<view class="block-title">活动规则</view>
					<view class="rule-list">
						<view class="item" v-for="(item, index) in info.rule_list">{{index + 1}}、{{item}}</view>
					</view>
										
					<!-- <view class="sku-list">
						<view class="item" v-for="(item, index) in info.skus">
							<text class="number">{{index + 1}}、</text>
							<text class="text">{{item.title}}</text>
							<text class="stock">剩{{item.stock}}份</text>
						</view>
					</view> -->
					
				</view>

				<!-- <view class="block mp-c">
				<view class="item">
					<image class="thumb" src="http://hquesoft.oss-cn-shenzhen.aliyuncs.com/box/img/LOGO.jpg"></image>
					<view class="title-c">
						<view class="name">潮玩A区</view>
						<view class="desc">关注公众号获取更多动漫、潮玩资讯</view>
					</view>
					<view class="btn" @tap="$tool.previewImage(mpQrcode)">
						关注
					</view>
				</view>
			</view> -->

				<view class="block contact-c" v-if="false">
					<view class="block-title">客服微信号</view>
					<view class="item">
						<view class="text">{{contactAccount}}</view>
						<view class="btn" @tap="$tool.copyText(contactAccount)">
							复制
						</view>
						<!-- <image src="http://hquesoft.oss-cn-shenzhen.aliyuncs.com/box/img/LOGO.jpg"></image> -->
					</view>
				</view>

				<view class="block">
					<view class="block-title">
						<view class="text">当期参与 <template v-if="info.current_session_records_count"> {{info.current_session_records_count}}人</template>
						</view>
						<view class="more"
							@tap="$tool.toPage(`/pages/lottery/userList?uuid=${info.uuid}&type=all&actived=1`)">往期记录
						</view>
						<text class="new-iconfont icon-arrow-right"></text>
					</view>
					<view class="user-list">
						<template v-for="(item, index) in userList">
							<view class="item" v-if="item.user">
								<image :src="item.user.headimg" class="headimg"></image>
								<view class="name">{{item.user.name.slice(0,1)}}...</view>
								<view class="ticket-count">{{item.tickets_count}}</view>
							</view>
						</template>
						<view class="gray-text" style="font-size: 26rpx;" v-if="!userList.length">还没有人参与哦~</view>
					</view>
				</view>
				<template v-if="info.union_status == 'expired'">
					<view class="block">
						<view class="block-title">
							<view class="text">当期中奖 {{info.current_session_lucky_records_count}}人</view>
							<view class="more"
								@tap="$tool.toPage(`/pages/lottery/userList?uuid=${info.uuid}&type=lucky`)">中奖名单
							</view>
							<text class="new-iconfont icon-arrow-right"></text>
						</view>
						<view class="user-list">
							<template v-for="(item, index) in luckyUserList">
								<view class="item" v-if="item.user">
									<image :src="item.user.headimg" class="headimg"></image>
									<view class="name">{{item.user.name.slice(0,1)}}...</view>
								</view>
							</template>
						</view>
					</view>
				</template>
				<template v-else>
					<view class="block">
						<view class="block-title">
							<view class="text">当期中奖</view>
						</view>
						<view class="progress-c"
							v-if="info.emit_type === 'user_total' || info.emit_type === 'ticket_total'">
							<view class="bar-bg">
								<view class="bar-color" :style="'width:' + progressPercentStr"></view>
							</view>
							<view v-if="info.emit_type === 'user_total'">
								人数进度 <text class="progress-number">{{info.current_session_records_count}} / {{info.emit_user_total}}</text>
							</view>
							<view v-else-if="info.emit_type === 'ticket_total'">
								签数进度 <text class="progress-number">{{info.current_session_lottery_tickets_count}} / {{info.emit_ticket_total}}</text>
							</view>
						</view>
						<view class="lucky-user-tips">
							<view class="text" v-if="info.emit_type === 'time'">
								{{$tool.formatDate(info.emit_time, 'MM/dd hh:mm')}}后抽取
								<text style="color: red">{{info.prize_total}}位</text>幸运用户
							</view>
							<view class="text" v-else-if="info.emit_type === 'user_total'">
								参与人数达到{{info.emit_user_total}}后抽取
								<text style="color: red">{{info.prize_total}}位</text>幸运用户
							</view>
							<view class="text" v-else-if="info.emit_type === 'ticket_total'">
								抽奖码总量达到{{info.emit_ticket_total}}后抽取
								<text style="color: red">{{info.prize_total}}位</text>幸运用户
							</view>
						</view>
					</view>
				</template>


				<view class="detail-title">活动详情</view>
			</view>

			<view class="detail">
				<image mode="widthFix" @tap="$tool.previewImage(info.images, index)"
					v-for="(item, index) in info.images" :src="item" />
			</view>

			<view class="footer-actions safe-area-bottom">
				<navigator class="action-item" hover-class="hover" url="/pages/myActivity/index">
					<view class="icon new-iconfont icon-activity"></view>
					<text>活动</text>
					<!-- <view class="red-point" v-if="userInfo.working_activity">{{userInfo.working_activity}}</view> -->
				</navigator>
				<navigator class="action-item" hover-class="hover" :url="`/pages/lotteryTicket/index?uuid=${uuid}`">
					<view class="action-item" hover-class="hover">
						<view class="icon new-iconfont icon-ticket"></view>
						<text>我的抽奖码</text>
						<view class="gray-point" v-if="info.my_ticket_total">{{info.my_ticket_total}}</view>
					</view>
				</navigator>
				<!-- <navigator class="action-item" hover-class="hover" url="/pages/myActivity/index">
				<view class="icon new-iconfont icon-activity"></view>
				<text>我的活动</text>
				<view class="red-point" v-if="userInfo.working_activity">{{userInfo.working_activity}}</view>
			</navigator> -->
				<template>
					<template v-if="info.union_status === 'expired'">
						<view class="btn bg-orange" @tap="isShowMyTicket = true" v-if="info.is_lucky_user">
							<text>恭喜中奖啦~</text>
						</view>
						<view class="btn bg-orange disabled" @tap="isShowMyTicket = true" v-else-if="info.is_join">
							<text>抽奖已结束，未中奖哦~</text>
						</view>
						<view class="btn bg-orange disabled" @tap="isShowMyTicket = true" v-else>
							<text>抽奖已结束</text>
						</view>
					</template>
					<template v-else-if="info.union_status === 'pending'">
						<view class="btn bg-orange disabled">
							<text>活动未开始</text>
						</view>
					</template>
					<template v-else>
						<view class="btn bg-orange" @tap="handleJoin"  v-if="!info.is_join">
							<text>参与抽奖</text>
						</view>
						<template v-else>
							<!-- #ifndef APP-PLUS -->
								<button class="btn bg-orange" @tap="isShowMyTicket = true">
									<text>转发助力增加抽奖码</text>
								</button>
							<!-- #endif -->
							<!-- #ifdef APP-PLUS -->
								<button class="btn bg-orange">
									<text>已参与，等待开奖</text>
								</button>
							<!-- #endif -->
						</template>
					</template>
				</template>
			</view>

			<PayCard v-if="isShowPayCard && info.uuid" :info="info" @success="joinSuccess"
				@close="isShowPayCard=false">
			</PayCard>

			<MyTicket v-if="isShowMyTicket" :info="info" @join="handleJoin" @cancel="isShowMyTicket=false"></MyTicket>

			<!-- 邀请人进入后显示的助力弹窗 -->
			<InvitePopup v-if="isShowInvitePopup" :info="inviteInfo" @cancel="isShowInvitePopupKey=false"></InvitePopup>

		</template>
		<template v-else-if="isNotFound">
			<NoData title="活动不存在~"></NoData>
		</template>

	</view>
</template>

<script>
	import PayCard from "./components/PayCard.vue"
	import MyTicket from "./components/MyTicket.vue"
	import InvitePopup from "./components/InvitePopup.vue"
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			PayCard,
			MyTicket,
			InvitePopup
		},
		data() {
			return {
				isShowPayCard: false,
				title: '活动详情',
				uuid: '',
				isShowTitle: false,
				activityId: '',
				info: {},
				isShowMyTicket: false,
				luckyUserList: [],
				userList: [],
				inviterUuid: '',
				inviteInfo: {},
				isNotFound: false,
				isInit: false,
				isShowInvitePopupKey: false,
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			isShowInvitePopup() {
				return this.inviterUuid && (this.userInfo.uuid !== this.inviterUuid) && this.isShowInvitePopupKey
			},
			progressPercentStr() {
				if (this.info.emit_type === 'user_total') {
					return this.info.emit_user_total ? (this.info.current_session_records_count / this.info.emit_user_total * 100 + '%') :
						'0%'
				} else if (this.info.emit_type === 'ticket_total') {
					return this.info.emit_ticket_total ? (this.info.current_session_lottery_tickets_count / this.info.emit_ticket_total *
						100 + '%') : '0%'
				} else {
					return ''
				}
			},
			share() {
				let title = this.info.title
				if (this.userInfo.name) {
					title = this.userInfo.name + '邀请您来助力赢奖品哦~'
				}
				return {
					title: title,
					thumb: this.info.thumb
				}
			}
		},
		watch: {},
		onLoad(e) {
			this.uuid = e.uuid
			this.activityId = e.activityId
			this.inviterUuid = e.inviter || ''

			if (this.inviterUuid) {
				this.initInviteInfo()
			}

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
			initInviteInfo() {
				return this.$http(`/lotteries/${this.uuid}/invite-info`, 'GET', {
					inviter: this.inviterUuid
				}).then(res => {
					this.inviteInfo = res.data
					
					if (res.data.record_id)
						this.isShowInvitePopupKey = true
				})
			},
			initData() {
				return this.$http(`/lotteries/${this.uuid}`).then(res => {
					this.info = res.data.info
					console.log(this.info)
					this.initUserList('all')
					if (this.info.union_status === 'expired') {
						this.initUserList('lucky')
					}
				})
			},
			initUserList(type) {
				return this.$http(`/lotteries/${this.uuid}/users`, 'GET', {
					type: type,
					session: 'current',
					per_page: 5
				}).then(res => {
					if (type === 'lucky') {
						this.luckyUserList = res.data.list
					} else {
						this.userList = res.data.list
					}
				})
			},
			pendingTips() {
				uni.showToast({
					title: '活动还没有开始哦~',
					icon: 'none'
				})
			},
			handleJoin() {
				if (!this.userInfo.uuid) {
					uni.navigateTo({
						url: '/pages/login/index'
					})
					return false 
				}
				
				this.isShowPayCard = true
			},
			joinSuccess() {
				this.isShowPayCard = false
				this.initData()
				
				uni.navigateTo({
					url: '/pages/lotteryTicket/index?uuid=' + this.info.uuid
				})

				uni.showToast({
					title: '参与成功',
					icon: 'none'
				})
				// this.isShowMyTicket = true

				this.$store.dispatch("getUserInfo")
			},
			getMyPrize() {
				uni.showModal({
					title: '恭喜您中奖啦，快点左下角联系客户领取奖品吧~'
				})
			},
			topage(){
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
		},
		onPageScroll(e) {
			if (e.scrollTop > 350 && !this.isShowTitle) {
				uni.setNavigationBarTitle({
					title: this.info.title
				})
				// uni.setNavigationBarColor({
				// 	backgroundColor: '#370eee'
				// })
				this.isShowTitle = true
			}

			if (e.scrollTop < 350 && this.isShowTitle) {
				uni.setNavigationBarTitle({
					title: '活动详情'
				})
				// uni.setNavigationBarColor({
				// 	backgroundColor: 'white'
				// })
				this.isShowTitle = false
			}

		},


	}
</script>

<style lang="scss" scoped>
	.container {
		padding-bottom: 80rpx;
		.box-pop{
			position: fixed;
			bottom: 400rpx;
			z-index: 9;
			right:0rpx;
			background: url("https://www.hebide.cc/newimages/shouye.png") no-repeat;
			background-size: 100%;
			width: 200rpx;
			height: 100rpx;
		}
		
		.thumb {
			width: 100%;
			height: 680rpx;
		}
		
		.session-c {
			position: fixed;
			top: 10rpx;
			right: 25rpx;
			// width: 100%;
			padding: 16rpx 30rpx;
			z-index: 100;
			// height: 50rpx;
			// line-height: 50rpx;
			text-align: center;
			background: rgba(0, 0, 0, 0.7);
			color: white;
			font-weight: 500;
			border-radius: 60rpx;
			// width: 300rpx;
		}

		.body {
			position: relative;
			top: -106rpx;
			width: 750rpx;
			box-sizing: border-box;
			// padding: 30rpx 30rpx 0rpx 30rpx;

			.time {
				color: white;
				font-weight: bold;
				text-align: left;
				padding-top: 30rpx;
				background-color: #370eee;
				border-top: 10rpx solid #c2effd;
				border-bottom: 10rpx solid #c2effd;
				padding: 20rpx;
			}

			.price-c {
				font-size: 40rpx;
				font-weight: 800;
				color: #DE1124;
				margin-top: 10rpx;
				margin-left: 30rpx;
			}

			.title {
				color: black;
				font-weight: bold;
				font-size: 36rpx;
				margin: 40rpx 0rpx 0rpx 30rpx;

				.tag {
					height: 40rpx;
					line-height: 40rpx;
					background: #FFCC09;
					border-radius: 16px;
					color: white;
					font-size: 26rpx;
					padding: 0rpx 14rpx;
					margin-right: 10rpx;
				}
			}

			.sub-title {
				font-size: 24rpx;
				color: #999999;
				margin-top: 10rpx;
				margin-left: 30rpx;
			}
			
			.session-c {
				text-align: center;
				font-weight: 500;
			}

			.block {
				width: 710rpx;
				margin: 20rpx auto;
				background: #FFFFFF;
				box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
				padding: 30rpx 30rpx;
				box-sizing: border-box;
				overflow: hidden;
				border-radius: 10rpx;

				.block-title {
					height: 30rpx;
					line-height: 30rpx;
					margin-bottom: 20rpx;
					font-size: 28rpx;
					font-weight: bold;
					color: #000000;
					padding-left: 10rpx;
					border-left: 4rpx solid #FFCC09;

					display: flex;
					align-items: center;

					.text {
						flex-grow: 1;
					}

					.more,
					.icon-arrow-right {
						color: #666;
						font-weight: normal;
						font-size: 26rpx;
					}

					.icon-arrow-right {
						font-size: 30rpx;
					}
				}

				.progress-c {
					.bar-bg {
						background: #e1e1e1;
						width: 60%;
						margin: 10rpx auto 20rpx auto;
						height: 18rpx;
						border-radius: 30rpx;
						position: relative;
						overflow: hidden;
					}

					.bar-color {
						background: #370eee;
						height: 100%;
						border-radius: 30rpx;
					}

					font-size: 28rpx;
					font-weight: 500;
					padding-bottom: 30rpx;
					text-align: center;

					.progress-number {
						color: #370eee;
						margin-left: 10rpx;
					}
				}
			}

			.rule-c {
				.rule-list {
					.item {
						font-size: 24rpx;
						// font-weight: bold;
						margin-bottom: 10rpx;
						color: #222;
					}
				}
				
				.sku-list {
					margin-bottom: 20rpx;
					display: flex;
					flex-direction: row;
				    flex-wrap: wrap;
				    justify-content: center;
					.item {
						text-align: center;
						width: 100%;
						// margin-bottom: 10rpx;
						padding: 10rpx 0rpx;
						display: block;
						border-bottom: 1px dashed #e1e1e1;
						padding-bottom: 20rpx;
						margin-bottom: 20rpx;
						.number {
							margin-right: 6rpx;
							width: 30rpx;
							text-align: center;
							flex: 0 0 30rpx;
						}
						.text {
							text-align: center;
							// float: left;
							display: block;
							font-size: 28rpx;
							font-weight: 900;
						}
						.stock {
							display: block;
							text-align: center;
							// float: right;
							width: 100%;
							font-size: 26rpx;
							// text-align: right;
						}
					}
					.item2{
						width: 50%;
					}
					.item3{
						width: 33%;
					}
				}
			}

			.mp-c {
				position: -webkit-sticky;
				position: sticky;
				top: 10px;

				.item {
					display: flex;
					align-items: center;

					.thumb {
						width: 90rpx;
						height: 90rpx;
						border-radius: 10rpx;
						margin-right: 10rpx;
					}

					.title-c {
						flex-grow: 1;

						.name {
							font-weight: bold;
						}

						.desc {
							font-size: 26rpx;
							color: gray;
						}
					}

					.btn {
						background: #370eee;
						color: white;
						text-align: center;
						font-size: 24rpx;
						border-radius: 50rpx;
						box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
						width: 100rpx;
						padding: 6rpx 0rpx;
						flex: 0 0 100rpx;
					}
				}
			}

			.contact-c {
				.item {
					display: flex;
					align-items: center;

					.text {
						flex-grow: 1;
					}

					.btn {
						background: #370eee;
						color: white;
						text-align: center;
						font-size: 24rpx;
						border-radius: 50rpx;
						box-shadow: 0px 14rpx 30rpx 0px rgba(226, 222, 204, 0.4);
						width: 100rpx;
						padding: 6rpx 0rpx;
						flex: 0 0 100rpx;
					}
				}
			}

			.detail-title {
				margin: 60rpx 0rpx 30rpx 0rpx;
				background: url('@/static/new-list-title.png');
				background-size: 402rpx auto;
				background-repeat: no-repeat;
				font-size: 36rpx;
				font-weight: bold;
				color: #333333;
				margin-left: 30rpx;
			}

			.user-list {
				display: flex;
				flex-wrap: wrap;
				// justify-content: space-around;
				justify-content: center;
				margin-top: 40rpx;

				.item {
					width: 108rpx;
					flex: 0 0 108rpx;
					text-align: center;
					margin-bottom: 20rpx;
					position: relative;

					.headimg {
						width: 80rpx;
						height: 80rpx;
						border-radius: 50%;
					}

					.name {
						font-size: 24rpx;
						font-weight: 500;

						overflow: hidden;
						text-overflow: ellipsis;
						display: -webkit-box;
						-webkit-line-clamp: 1;
						-webkit-box-orient: vertical;
					}

					.ticket-count {
						position: absolute;
						color: white;
						background: #370eee;
						padding: 0rpx 6rpx;
						border-radius: 50rpx;
						right: 0rpx;
						top: -10rpx;
						font-size: 22rpx;
						min-width: 20rpx;
					}
				}
			}

			.lucky-user-tips {
				text-align: center;
				color: #666;
				font-size: 28rpx;
			}
		}

		.detail {
			width: 750rpx;
			position: relative;
			top: -106rpx;

			image {
				width: 750rpx;
				display: block;
			}
		}

		.footer-actions {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			min-height: 130rpx;

			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0rpx 30rpx 100rpx 30rpx;
			background-color: #fff;
			box-sizing: border-box;

			button {
				padding: 0;
				margin: 0;
				border-radius: 0;
				background-color: transparent;

				&:after {
					border: none;
					display: none;
				}
			}

			.action-item {
				// line-height: transparent;
				height: 100rpx;
				width: 120rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				position: relative;

				.icon {
					font-size: 42rpx;
					line-height: 46rpx;
				}

				text {
					font-size: 22rpx;
					line-height: 30rpx;
				}

				.gray-point {
					position: absolute;
					background: #370eee;
					// background: white;
					// border: 2rpx solid #666;
					right: 0rpx;
					top: -6rpx;
					border-radius: 50%;
					padding: 0rpx 4rpx;
					min-width: 40rpx;
					min-height: 40rpx;
					box-sizing: border-box;
					color: white;
					font-weight: 500;
					line-height: 40rpx;
					text-align: center;
					font-size: 20rpx;
					font-weight: 500;
				}
			}

			.btn {
				width: 500rpx;
				height: 78rpx;
				border: 2rpx solid #370eee;
				border-radius: 40rpx;
				color: #370eee;
				font-size: 26rpx;
				text-align: center;
				line-height: 78rpx;
				margin-left: 30rpx;
				font-weight: bold;

				&.bg-orange {
					background: #370eee!important;
					color: #FFFFFF;
				}

				&.disabled {
					background: #eee;
					border: 2rpx solid #eee;
					color: #666;
				}
			}
		}
	}
</style>
