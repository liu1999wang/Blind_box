<template>
	<view class="container" :class="{dark: isDarkMode}"
		:style="'background-size: 100% auto; height: 100vh; background-image: url(' + bgImage + '); background-size: 100% auto; background-position: center center;'"
		v-if="boxInfo">
		
		<!-- #ifndef H5 -->
			<TextNavBar :darkMode="isDarkMode" :title="boxInfo.title"></TextNavBar>
		<!-- #endif -->

		<!-- 头像 -->
		<navigator url="/pages/myScore/index">
			<view class="float-headimg-c">
				<image mode="aspectFill" class="headimg" :src="userInfo.headimg"></image>
				<view class="score">{{userInfo.score | bigNumberDisplay}}{{scoreAlias}}</view>
			</view>
		</navigator>

		<!-- 规则 -->
		<navigator url="/pages/rule/index?type=box">
			<view class="float-btn rule" hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/rule.png"></image>
				<text>规则</text>
			</view>
		</navigator>

		<!-- 我的 -->
		<navigator url="/pages/myBox/index">
			<view class="float-btn my" hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/my-box.png"></image>
				<text>盒柜</text>
			</view>
		</navigator>

		<!-- 我的 -->
		<!-- #ifdef MP-WEIXIN -->
		<view class="float-btn share" hover-class="hover" @tap="isSharePopup = true">
			<text class="new-iconfont icon-wechat"></text>
			<text>分享</text>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-TOUTIAO -->
		<button class="float-btn share" open-type="share" hover-class="hover">
			<text class="new-iconfont icon-wechat"></text>
			<text>分享</text>
		</button>
		<!-- #endif -->
		
		<view class="float-btn rand-list" hover-class="hover" v-if="boxInfo.is_hidden_sku_rank" @tap="isShowHiddenSkuRank = true">
			<!-- <text class="new-iconfont icon-wechat"></text> -->
			<text>榜单</text>
		</view>

		<view class="body">
			<view class="yaoyiyao" :class="{small: isSmallDevice}" v-if="boxInfo.open_mode == 1 && (freeTipLimit > 0)">
				<image src="/static/smallBox/yaoyiyao.png"></image>
				<text>摇一摇</text>
			</view>
			<view class="box" :class="{small: isSmallDevice}">
				<view class="box-img" :class="{move:animateStatus===1, move2:animateStatus===2}">
					<image :src="boxInfo.sku_3d_image || defaultBoxImage"></image>
				</view>
			</view>
			<view class="box-number">
				<text>NO.{{roomInfo.number}}-{{skuIndex}}</text>
				<view class="inner-tips">{{boxTips}}</view>
			</view>
			<!-- 在线开盒子 -->
			<view class="card-list" v-if="boxInfo.open_mode == 1">
				<view class="item" @tap="isShowExcludeCard = true" hover-class="hover" v-if="boxInfo.is_exclude_box">
					<image src="@/static/smallBox/tips.png"></image>
					<text>排除卡</text>
				</view>
				<view class="item" @tap="isShowOpenCard = true" hover-class="hover" v-if="boxInfo.is_show_box">
					<image src="@/static/smallBox/toushi.png"></image>
					<text>透视卡</text>
				</view>
			</view>
			<view class="tips" v-else>
				<!-- 线下开盒子 -->
				<view>温馨提示: 此盲盒购买后将随机发货, 不进行在线开盒</view>
			</view>
			<scroll-view class="thumb-list" :class="{small: isSmallDevice}" scroll-x>
				<view v-for="(item, index) in skuList" class="item" :key="index">
					<image mode="aspectFit" :src="item.thumb + '?x-oss-process=image/resize,w_300'" class="thumb" @tap="$refs.detailPopup.open('bottom')"></image>
					<view class="title">{{item.title}}</view>
					<view class="price-c"><PriceDisplay :info="item"></PriceDisplay></view>
					<view v-if="item.type === 1" class="tips">隐藏款</view>
					<view class="tips-bottom excluded" v-if="isExcluded(item)">这不是我</view>
					<view class="tips-bottom showed" v-else-if="isShowed(item)">这是我</view>
				</view>
			</scroll-view>
		</view>
		<view class="footer safe-area-bottom" :class="{small: isSmallDevice}">
			<view class="btns">
				<view class="button" hover-class="hover" @tap="changeone">
					<image src="@/static/smallBox/refresh.png"></image>
					<text>换一盒</text>
				</view>
				<view class="button disable" hover-class="hover" @tap="showPreviewTips"
					v-if="boxInfo.is_presell && !boxInfo.presell_mode">
					预售中
				</view>
				<view class="button" hover-class="hover" @tap="buyNow" v-else>
					就买它
				</view>
			</view>
			<!-- <view class="tips"></view> -->
		</view>
		<OpenBoxPopup v-if="isOpenPopup" :config="baseConfig" :order="order" @close="goBack" :boxImg="boxInfo.sku_3d_image">
		</OpenBoxPopup>
		<view class="box-tips" :hidden="!isShowTips">
			<view class="close-btn" @tap="isShowTips = false">
				<text class="new-iconfont icon-wrong"></text>
			</view>
			<view class="text">
				{{tips}}
			</view>
		</view>
		<!-- <view class="history-box" :hidden="!showHistoryTips" @tap="showHistoryTipsChange">
			<view class="history-wrap" @tap.stop>
				<view class="history-wrap-title">提示卡</view>
				<view class="history-list">
					<view class="item" v-for="(item,index) in historyTips" :key="index">
						{{item}}
					</view>
				</view>
			</view>
		</view> -->

		<view class="tips-card-c" v-if="isShowExcludeCard">
			<view class="tips-content  animated bounceInLeft">
				<view class="title-c">
					<view class="title">排除卡</view>
					<navigator url="/pages/myCard/index">
						<view class="total">
							{{excludeBoxCard.my_balance}}张<text class="new-iconfont icon-arrow-right"></text>
						</view>
					</navigator>
				</view>
				<view class="item-title">
					卡券功能
				</view>
				<view class="item-text">
					使用排除卡可以排除盒子里不是某个款
				</view>
				<view class="item-title">
					兑换方式
				</view>
				<view class="item-text">
					消耗{{excludeBoxCard.score_price}}{{scoreAlias}}兑换
				</view>

				<navigator url="/pages/myCard/index" v-if="!excludeBoxCard.my_balance">
					<view class="get-btn">
						暂无可用，去兑换
					</view>
				</navigator>
				<view class="get-btn" @tap="useCard('exclude_box')" v-else>
					使用1张排除卡
				</view>

			</view>
			<view class="close-btn  animated bounceInRight" @tap="isShowExcludeCard = false">
				<text class="new-iconfont icon-wrong"></text>
			</view>
		</view>

		<view class="tips-card-c" v-if="isShowOpenCard">
			<view class="tips-content  animated bounceInLeft">
				<view class="title-c">
					<view class="title">透视卡</view>
					<navigator url="/pages/myCard/index">
						<view class="total">
							{{showBoxCard.my_balance}}张<text class="new-iconfont icon-arrow-right"></text>
						</view>
					</navigator>
				</view>
				<view class="item-title">
					卡券功能
				</view>
				<view class="item-text">
					使用透视卡可以直接显示盒子里的款式
				</view>
				<view class="item-title">
					兑换方式
				</view>
				<view class="item-text">
					消耗{{showBoxCard.score_price}}{{scoreAlias}}兑换
				</view>

				<navigator url="/pages/myCard/index" v-if="!showBoxCard.my_balance">
					<view class="get-btn">
						暂无可用，去兑换
					</view>
				</navigator>
				<view class="get-btn" @tap="useCard('show_box')" v-else>
					使用1张透视卡
				</view>
			</view>
			<view class="close-btn  animated bounceInRight" @tap="isShowOpenCard = false">
				<text class="new-iconfont icon-wrong"></text>
			</view>
		</view>

		<PayCard :buyTotal="buyTotal" v-if="isShowPayCard" :info="payCardInfo" @success="paySuccess"
			@cancel="isShowPayCard=false"></PayCard>

		<SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>

		<Danmus v-if="danmuSetting.is_enabled" :setting="danmuSetting" :uuid="boxUuid" :list="danmuList"></Danmus>
		
		<uni-popup ref="detailPopup" style="z-index: 1000;" type="bottom">
			<BoxSkuPopup :skuList="skuList" :detailImageList="boxInfo.detail_images" @close="$refs.detailPopup.close()"></BoxSkuPopup>
		</uni-popup>
		
		<FreeTicketFloatBtn v-if="boxInfo.is_invite_enabled" @useFreeTicket="useFreeTicket" :uuid="boxUuid" nodeType="box"></FreeTicketFloatBtn>
		
		<HiddenSkuRank :info="boxInfo" @close="isShowHiddenSkuRank = false" v-if="boxInfo.uuid && isShowHiddenSkuRank"></HiddenSkuRank>
		
		<!-- <BoxSkuPopup :skuList="skuList" :detailImageList="boxInfo.detail_images" @close="isShowSkuList=false" v-if="isShowSkuList"></BoxSkuPopup> -->
	</view>
</template>

<script>
	import mixin from "@/utils/mixin.js"
	
	import {
		mapGetters
	} from "vuex"

	import PayCard from "./components/PayCard.vue"

	import {
		getUsableCoupon
	} from "../../api/coupons.js"

	export default {
		name: "openBox",
		mixins: [mixin],
		components: {
			PayCard
		},
		data() {
			return {
				// defaultBoxImage: 'https://cdn2.hquesoft.com/box/openbox.png',
				boxUuid: '',
				roomUuid: '',
				skuIndex: '',
				pageUuid: '',
				skuList: [],
				boxInfo: {},
				roomInfo: {},
				isShowPayCard: false,
				isShowExcludeCard: false,
				isShowOpenCard: false,
				showBoxCard: {
					score_price: 0,
					my_balance: 0
				},
				excludeBoxCard: {
					score_price: 0,
					my_balance: 0
				},
				order: {},   // 创建成功的订单
				yaoyiyaoFlag: false,
				isPay: false,
				isInit: false,
				isOpenPopup: false,
				// boxInfo: {},
				animateStatus: 0,
				visible: false,
				loading: false,
				tipsList: {},
				tips: "",
				isShowTips: false,
				isSharePopup: false,
				orderUuid: "",
				danmuList: [],
				danmuSetting: {},
				buyTotal: 1,
				remainTime: 0,
				isShowSkuList: false,
				baseConfig: {},
				isShowHiddenSkuRank: false
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			defaultBoxImage() {
				return this.isInit ? 'https://cdn2.hquesoft.com/box/openbox.png' : ''
			},
			config() {
				return this.$store.getters.setting.open_box
			},
			payCardInfo() {
				return {
					box: this.boxInfo,
					room: this.roomInfo,
					sku_index: this.skuIndex,
					page_uuid: this.pageUuid
				}
			},
			deviceHeight() {
				return this.$device.screenHeight
			},
			isSmallDevice() {
				// #ifdef H5
					return true
				// #endif
				return this.$device.screenHeight < 750
			},
			instance() {
				return this.boxInfo.instance
			},
			posterInfo() {
				return {
					money_price: this.boxInfo.money_price,
					score_price: this.boxInfo.score_price,
					title: this.boxInfo.title,
					path: this.getShareConfig().path,
					thumb: this.boxInfo.thumb
				}
			},
			freeTipLimit() {
				if (this.boxInfo.free_tips_limit === null)
					return 2

				return this.boxInfo.free_tips_limit
			},
			bgImage() {
				if (!this.isInit)
					return ''
				
				return this.boxInfo.room_bg_image || this.config.bg_image || 'https://cdn2.hquesoft.com/box/bg.png'
			},
			isDarkMode() {
				return this.boxInfo.bg_color_mode === 2
			},
			boxTips() {
				return this.boxInfo.tips || '官方正品，非质量问题不支持退换'
			},
			share () {
				return {
					title: this.boxInfo.title,
					thumb: this.boxInfo.thumb,
					desc:'',
					path: '/pages/boxDetail/index?uuid=' + this.boxInfo.uuid + '&invite_node=box-' + this.boxInfo.uuid,
				}
			},
			// productNumbers() {
			// 	let status = this.instance && this.instance.small_box_status || []
			// 	let temp = []
			// 	status.forEach((item, index) => {
			// 		if (!item) {
			// 			temp.push(index + 1)
			// 		}
			// 	})
			// 	return temp
			// }
		},
		async onLoad(e) {
			this.roomUuid = e.roomUuid
			this.skuIndex = parseInt(e.index)
			this.boxUuid = e.uuid

			// console.log('mode =====>', e.buyMode)
			// if (e.buyMode === 'wholeRoom') {
			// 	this.buyTotal = 0 
			// 	this.isShowPayCard = true
			// } 

			uni.showLoading({
				title: "加载中",
				mask: true
			})

			this.initRoom().then(res => {
				this.isInit = true
				if (e.buyMode === 'wholeRoom') {
					this.changeone()
					this.buyTotal = 0
					this.isShowPayCard = true
				}
				else if (e.buyMode) {
					// this.changeone()
					this.buyTotal = parseInt(e.buyMode)
					this.isShowPayCard = true
				}
				
				this.getDanmu()
			})

			uni.hideLoading()

			// this.getDanmu()
			
			uni.$on('startShare', () => {
				this.isSharePopup = true
			})

		},
		onShow() {
			this.$store.dispatch("getUserInfo")
			this.initData()
			// 开始监
			uni.onAccelerometerChange(res => {
				if (this.boxInfo.open_mode != 1)
					return;
				if (this.yaoyiyaoFlag)
					return;
				if (this.boxInfo.free_tips_limit === 0)
					return;
				
				// #ifdef APP-PLUS
				let level = 5
				// #endif
				// #ifndef APP-PLUS
				let level = 0.9
				// #endif
				
				// uni.showToast({
				// 	title: JSON.stringify(res),
				// 	icon: 'none'
				// })
				
				// return false

				if ((Math.abs(res.x) > level && Math.abs(res.y) > level) || (Math.abs(res.x) > level && Math.abs(
						res.z) > level)) {
					// uni.showToast({
					// 	title: "摇一摇"
					// })
					// console.log(res)
					if (!this.yaoyiyaoFlag) {
						this.$playAudio('yao')

						this.getFreeTips()
						this.yaoyiyaoFlag = true;

						setTimeout(() => {
							this.yaoyiyaoFlag = false
						}, 2500)
					}
				}
			})
		},
		onUnload() {
			uni.stopAccelerometer()
		},
		onHide() {
			uni.stopAccelerometer()
		},
		methods: {
			// 使用1次兑换记录
			useFreeTicket() {
				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})
				
				this.$http('/box-order/confirm', 'POST', {
					room_id: this.payCardInfo.room.id,
					sku_index: this.payCardInfo.sku_index,
					page_uuid: this.payCardInfo.page_uuid,
					total: 1,
					is_use_free_ticket: 1
				}).then(res => {
					uni.hideLoading()
					let info = res.data
					if (info.is_need_pay) {
						uni.showToast({
							title: '兑换出错~',
							icon: 'none'
						})
					}
					else {
						this.paySuccess(info.order)
					}
				})
			},
			getDanmu() {
				this.$http(`/danmus/box_open?node_id=${this.boxInfo.id}`).then(res => {
					this.danmuSetting = res.data.setting
					this.danmuList = res.data.list
				})
			},
			showPreviewTips() {
				uni.showToast({
					title: '此款正在预售中，暂不可购买哦~',
					icon: 'none'
				})
			},
			// 判断sku是否被排除了
			isExcluded(sku) {
				let list = this.tipsList.exclude || []
				return list.findIndex((item) => {
					return item.sku_id === sku.id
				}) !== -1
			},
			// 判断sku是否被透视
			isShowed(sku) {
				let list = this.tipsList.show || []
				return list.findIndex((item) => {
					return item.sku_id === sku.id
				}) !== -1
			},
			initRoom() {
				return this.$http(`/rooms/${this.roomUuid}/skus/${this.skuIndex}`).then(res => {
					this.boxInfo = res.data.box
					this.roomInfo = res.data.room
					this.skuList = res.data.sku_list
					this.pageUuid = res.data.page_uuid
					
					this.baseConfig = res.data.config
					
					uni.setNavigationBarTitle({
						title: this.boxInfo.title
					})
				})
			},
			initData() {
				this.$http('/user/cards').then(res => {
					this.showBoxCard = res.data.show_box_card
					this.excludeBoxCard = res.data.exclude_box_card
				})
			},
			previewSmallBoxThumb(index) {
				let urls = this.skuList.map(item => {
					return item.thumb
				})

				uni.previewImage({
					urls: urls,
					current: index
				})
			},
			showTips(tips) {
				this.tips = tips
				this.isShowTips = true
			},
			buyNow() {
				this.buyTotal = 1
				this.isShowPayCard = true
			},
			// 使用道具卡
			useCard(type) {
				let title = '温馨提示'
				let content = '确定要使用1张透视卡吗~'

				if (type === 'exclude_box') {
					title = '温馨提示'
					content = '确定要使用1张排除卡吗~'
				}
				uni.showModal({
					title: title,
					content: content,
					success: async res => {
						if (res.confirm) {
							uni.showLoading({
								title: '提交中'
							})

							this.$http('/box/use-card', 'POST', {
								card_type: type,
								page_uuid: this.pageUuid
							}).then(res => {
								this.showTips(res.data.tips)
								this.isShowExcludeCard = false
								this.isShowOpenCard = false
								this.tipsList = res.data.tips_list
								uni.hideLoading()
								this.initData()
							})
						}
					}
				})
			},
			getFreeTips() {
				this.$http('/box/use-card', 'POST', {
					card_type: 'free_tips',
					page_uuid: this.pageUuid
				}).then(res => {
					this.showTips(res.data.tips)
					this.isShowExcludeCard = false
					this.isShowOpenCard = false
					this.tipsList = res.data.tips_list
				})
			},
			handleOk() {
				uni.redirectTo({
					url: "/pages/orderList/index"
				})
			},
			visibleChange() {
				this.visible = !this.visible
			},
			changeone(e) {
				this.animateStatus = 1

				// 换一个小盒子
				this.$http('/box/change-sku', 'POST', {
					room_id: this.roomInfo.id,
					sku_index: this.skuIndex,
				}).then(res => {
					this.skuIndex = res.data.sku_index
					this.roomUuid = res.data.room_uuid
					this.pageUuid = res.data.page_uuid
					this.initRoom()
					
					this.tipsList = {}
				})

				setTimeout(res => {
					this.animateStatus = 2
				}, 800)
			},
			paySuccess(order) {

				// 线下开盒模式直接跳转到待处理订单
				if (this.boxInfo.open_mode === 2) {
					uni.redirectTo({
						url: "/pages/orderList/index"
					})
					return true
				}

				// 线上开盒流程
				this.isShowPayCard = false
				uni.showToast({
					title: "支付成功, 开盒中",
					icon: "none"
				})
				this.order = order
				this.isOpenPopup = true
			},
			goBack() {
				uni.navigateBack({
					delta: 1
				})
			}
		}
	}
</script>

<style lang="scss">
	
	page {
		// background: url('@/static/bigBox/bg.png');
		background-size: 100% 100%;
	}

	.tips {
		font-size: 24rpx;
		margin-top: 30rpx;
		text-align: center;
	}

	.tips-card-c {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0rpx;
		left: 0rpx;
		background: rgba(30, 30, 30, 0.5);
		z-index: 9;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.tips-content {
			background: url('https://bus-cdn.hquesoft.com/box/card-bg.png');
			background-size: 100% auto;
			background-repeat: no-repeat;
			width: 666rpx;
			height: 564rpx;
			padding: 30rpx 30rpx;
			box-sizing: border-box;

			.title-c {
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
					padding: 4rpx 26rpx 4rpx 26rpx;
					border-radius: 30rpx;
					font-weight: 500;

					display: flex;
					align-items: center;

					.icon-arrow-right {
						font-size: 40rpx;
						width: 24rpx;
						margin-left: -8rpx;
						// margin: 0rpx !important;
						padding: 0rpx !important;
						display: inline;
					}
				}
			}

			.item-title {
				font-size: 32rpx;
				font-weight: bold;
				color: #000000;
				margin-top: 50rpx;
			}

			.item-text {
				margin-top: 20rpx;
				font-size: 24rpx;
				font-weight: 500;
				color: #999999;
			}

			.get-btn {
				width: 100%;
				height: 96rpx;
				background: #FFCC09;
				border-radius: 10rpx;
				margin: 0rpx auto;
				line-height: 96rpx;
				text-align: center;
				font-size: 30rpx;
				font-weight: bold;
				color: #333333;
				margin-top: 30rpx;
			}

		}

		.close-btn {
			border: 4rpx solid white;
			border-radius: 50%;
			font-size: 40rpx;
			width: 80rpx;
			height: 80rpx;
			margin-top: 10rpx;
			line-height: 80rpx;
			text-align: center;
			color: white;
		}
	}

	.float-btn {
		position: fixed;
		right: 0rpx;
		top: 260rpx;
		width: 130rpx;
		height: 66rpx;
		background: #FFEFB3;
		border-radius: 33px 0px 0px 33px;
		padding: 0rpx 14rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		justify-content: space-around;

		font-weight: 500;
		font-size: 24rpx;

		image {
			width: 30rpx;
			height: 36rpx;
		}

		&.my {
			top: 350rpx;

			image {
				width: 30rpx;
				height: 40rpx;
			}
		}

		&.share {
			top: 700rpx;

			.icon-wechat {
				font-size: 40rpx;
			}
		}
		
		&.rand-list {
			top: 800rpx;
			text-align: center;
			padding-left: 26rpx !important;
			
			.icon-wechat {
				font-size: 50rpx;
			}
			
			&::after {
				display: none;
			}
		}
	}

	.float-headimg-c {
		position: fixed;
		right: 0rpx;
		top: 460rpx;
		width: 140rpx;
		height: 100rpx;
		// display: flex;
		text-align: center;

		.headimg {
			width: 80rpx;
			height: 80rpx;
			border-radius: 50%;
		}

		.score {
			font-size: 24rpx;
			font-weight: 500;
		}
	}

	.container {
		overflow: hidden;
		width: 100%;
		padding-top: 100rpx;
		padding-bottom: 120rpx;
		box-sizing: border-box;
		display: flex;
		align-items: center;

		.body {
			width: 100%;
			// border: 1px solid red;
		}
	}

	.yaoyiyao {
		margin: 0 auto;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		// animation-direction: reverse;

		image {
			width: 76rpx;
			height: 76rpx;
			animation: yaoyiyao 1s;
			animation-iteration-count: infinite;
			transform-origin: center;
		}

		text {
			color: rgba(51, 51, 51, 1);
			font-size: 24rpx;
			font-weight: bold;
		}

		&.small {
			image {
				width: 50rpx;
				height: 50rpx;
			}

			text {
				font-size: 24rpx;
			}
		}
	}

	@keyframes yaoyiyao {
		0% {
			transform: scale(1) rotate(-4deg);
		}

		25% {
			transform: rotate(0deg);
		}

		50% {
			transform: scale(1.1) rotate(4deg);
		}

		75% {
			transform: rotate(0deg);
		}

		100% {
			transform: scale(1) rotate(-4deg);
		}
	}

	.box {
		width: 360rpx;
		height: 540rpx;
		margin: 0 auto;
		margin-top: 4rpx;
		position: relative;

		&.small {
			width: 300rpx;
			height: 450rpx;
		}

		// &:after {
		// 	content: "";
		// 	position: absolute;
		// 	bottom: -50rpx;
		// 	width: 400rpx;
		// 	height: 100rpx;
		// 	border-radius: 50%;
		// 	background-color: #DCDFE6;
		// }
	}

	.box-img {
		width: 100%;
		height: 100%;
		position: relative;
		z-index: 1;

		// animation: box-animation 1s;
		// animation-iteration-count: infinite;
		// transform-origin: center;

		image {
			width: 100%;
			height: 100%;
		}
	}

	@keyframes box-animation {
		0% {
			transform: rotate(-2deg);
		}

		50% {
			transform: rotate(2deg);
		}

		100% {
			transform: rotate(-2deg);
		}
	}

	.box-img.move {
		animation: moving 1s;
		animation-fill-mode: forwards;
	}

	.box-img.move2 {
		animation: moving2 0.6s;
		animation-fill-mode: forwards;
	}

	@keyframes moving {
		0% {
			left: 0;
			transform: scale(1);
		}

		35% {
			left: 80rpx;
			transform: scale(0.6);
		}

		100% {
			left: -800rpx;
			transform: scale(0.6);
		}
	}

	@keyframes moving2 {
		0% {
			left: 0;
			top: -800rpx;
		}

		100% {
			left: 0;
			top: 0;
		}
	}

	.box-number {
		text-align: center;
		margin-top: 60rpx;
		font-size: 24rpx;
		font-weight: bold;
		color: #000;

		.inner-tips {
			font-weight: 400;
			margin-top: 20rpx;
		}
	}

	.card-list {
		display: flex;
		justify-content: center;
		margin-top: 30rpx;

		.item {
			width: 150rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #FFE78A;
			border-radius: 24rpx;
			font-size: 26rpx;

			&:last-child {
				margin-left: 30rpx;
			}

			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}

	.thumb-list {
		display: flex;
		white-space: nowrap;
		margin-top: 40rpx;

		.item {
			margin-right: 20rpx;
			display: inline-block;
			position: relative;

			&:first-child {
				margin-left: 20rpx;
			}

			.thumb {
				background: #F8EFC5;
				border: 4rpx solid #FFB640;
				border-radius: 6rpx;
				width: 150rpx;
				height: 200rpx;
			}

			.title {
				text-align: center;
				color: black;
				font-size: 24rpx;
				width: 150rpx;
				// height: 200rpx;
				// border: 1px solid red;
				font-weight: 500;

				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				line-clamp: 2;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}
			
			.price-c {
				font-size: 22rpx;
				color: black;
				// font-weight: 500;
				width: 150rpx;
				text-align: center;
				
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				line-clamp: 2;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.tips {
				position: absolute;
				top: -30rpx;
				width: 100%;
				background: rgba(0, 0, 0, 0.5);
				text-align: center;
				padding: 4rpx 0rpx;
				color: white;
				font-size: 24rpx;
				font-weight: 500;
			}

			.tips-bottom {
				position: absolute;
				top: 166rpx;
				width: 100%;
				background: rgba(0, 0, 0, 0.5);
				text-align: center;
				padding: 4rpx 0rpx;
				color: white;
				color: red;
				font-size: 22rpx;
				// font-weight: 500;

				&.showed {
					background: #2BA246;
					color: white;
				}
			}
		}

		&.small {
			.item {
				.thumb {
					width: 120rpx;
					height: 160rpx;
				}

				.title {
					width: 120rpx;
				}

				.tips-bottom {
					top: 130rpx;
				}
			}
		}
	}

	.footer {
		width: 100%;
		position: fixed;
		bottom: 0;


		.btns {
			padding-bottom: 40rpx;
			margin: 0 50rpx;
			display: flex;
			justify-content: space-between;

			.button {
				width: 304rpx;
				height: 80rpx;
				border-radius: 10rpx;
				background-color: #FFBF42;
				font-size: 30rpx;
				font-weight: bold;
				text-align: center;
				line-height: 80rpx;
				box-shadow: 0 0 16rpx rgba(209, 209, 209, 0.5);
				color: white;
				display: flex;
				align-items: center;
				justify-content: center;

				image {
					width: 30rpx;
					height: 30rpx;
					margin-right: 10rpx;
				}

				&:nth-child(1) {
					background: #FFBF42;
					border: 3rpx solid #FFFFFF;
				}

				&:nth-child(2) {
					color: black;
					background-color: white;
					box-shadow: 0px 18rpx 30px 0px rgba(255, 187, 42, 0.2);
				}

				&.disable {
					background: #BBB9B2;
					color: #f6f6f6;
				}
			}
		}

		&.small {
			.btns {
				padding-bottom: 50rpx;
			}
		}
	}

	.box-tips {
		position: fixed;
		top: 20%;
		left: 125rpx;
		width: 500rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 10rpx;
		padding: 50rpx 24rpx;
		color: #FFFFFF;
		font-size: 26rpx;
		box-sizing: border-box;
		z-index: 11100;
		text-align: center;


		.close-btn {
			position: absolute;
			right: 20rpx;
			top: 20rpx;
			color: #f1f1f1;
			font-size: 30rpx;
		}

		text {
			font-size: 30rpx;
			padding: 0 10rpx;
			font-weight: bold;
		}
	}

	@keyframes show {
		from {
			bottom: -480rpx;
		}

		to {
			bottom: 0;
		}
	}

	.container {
		&.dark {
			.yaoyiyao {
				text {
					color: #aaa;
				}
			}

			.box-number {
				color: #ddd;
			}

			.thumb-list {
				.title {
					color: #ddd;
				}
			}

			.float-headimg-c {
				color: #ddd;
			}
		}
	}
</style>
