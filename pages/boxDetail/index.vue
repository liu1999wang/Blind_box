<template>
	<view class="container" :class="{'dark-bg': isDarkMode}" :style="'background-size: 100% auto; height: 100vh; background-image: url(' + bgImage + '); background-size: 100% auto; background-position: center center;'">
		<!-- #ifndef H5 -->
			<TextNavBar :darkMode="isDarkMode" :title="info.title"></TextNavBar>
		<!-- #endif -->
		
		<image v-if="config.bgm" class="bgm-icon" @tap="$switchBgm" :class="{disable: !isBgmPlay}" mode="widthFix" src="https://cdn2.hquesoft.com/box/music-icon.png"></image>

		<!-- <image class="bg" src="/static/bigBox/bg.png" mode="aspectFill"></image> -->
		
		<!-- 规则 -->
		<navigator url="/pages/rule/index?type=box">
			<view class="float-btn rule" hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/rule.png"></image>
				<text>规则</text>
			</view>
		</navigator>
		
		<!-- 我的 -->
		<navigator url="/pages/myBox/index">
			<view class="float-btn my"  hover-class="hover">
				<image mode="aspectFill" src="@/static/smallBox/my-box.png"></image>
				<text>盒柜</text>
			</view>
		</navigator>
		
		<!-- #ifdef MP-WEIXIN || APP-PLUS -->
		<view class="float-btn share" hover-class="hover" @tap="isSharePopup = true">
			<text class="new-iconfont icon-wechat"></text>
			<text>分享</text>
		</view>
		<!-- #endif -->
		<!-- #ifdef MP-TOUTIAO -->
		<button class="float-btn share"  open-type="share" hover-class="hover">
			<text class="new-iconfont icon-wechat"></text>
			<text>分享</text>
		</button>
		<!-- #endif -->
		
		<view class="float-btn rand-list" hover-class="hover" v-if="info.is_hidden_sku_rank" @tap="isShowHiddenSkuRank = true">
			<!-- <text class="new-iconfont icon-wechat"></text> -->
			<text>榜单</text>
		</view>
		

		<view class="content" :class="{deep:deepColor}" v-if="isInit">

			<BoxThmemDefault v-if="viewType == 'default'" @select="handleSelect" :room="room" :info="info" class="animated" :class="{bounceOutRight: startMoving, bounceInLeft: !startMoving}"></BoxThmemDefault>
			<BoxTheme3D v-else-if="viewType == '3d'" @select="handleSelect"  :room="room" :info="info" class="animated" :class="{bounceOutRight: startMoving, bounceInLeft: !startMoving}"></BoxTheme3D>

			<view class="gift-box-number">
				<text>NO.{{room.number}}</text>
				<view class="tips">{{tips}}</view>
			</view>
			
			<!-- 赠送抽奖码-->
			<view class="lottery-tips" v-if="info.jika" @tap="goJikaDetail">
				<text>每抽一盒赠送一次集卡机会</text>
				<text class="new-iconfont icon-arrow-right"></text>
			</view>
			<view class="lottery-tips" v-else-if="info.lottery" @tap="goLotteryDetail">
				<text>每抽一盒赠送一张活动抽奖码</text>
				<text class="new-iconfont icon-arrow-right"></text>
			</view>
			
			<!-- 在线开盒子 -->
			<view class="card-list">
				<!-- <view class="item" @tap="isShowHiddenSkuRank = true" style="margin-right: 20rpx;" v-if="info.is_hidden_sku_rank" hover-class="hover">
					<text>幸运榜单</text>
				</view> -->
				
				<!-- #ifndef MP-ALIPAY -->
				<view class="item" @tap="buyWholeRoom" hover-class="hover" v-if="info.sku_ratio_type === 1">
					<!-- <image src="@/static/smallBox/tips.png"></image> -->
					<text>整盒端</text>
				</view>
				<view class="item" @tap="buyMany(5)" hover-class="hover" v-else>
					<!-- <image src="@/static/smallBox/tips.png"></image> -->
					<text>连抽5个</text>
				</view>
				<!-- #endif -->
			</view>
			
			<!-- 预售 -->
			<template v-if="info.is_presell">
				<view class="presell-mask" v-if="info.presell_mode === 0">
					<view>此款为预售款，开售后可购买</view>
					<view>
						<CountDown class="text" :start="info.presell_date" :end="info.presell_date" endText="当前已开售"></CountDown>
					</view>
				</view>
				<view class="presell-mask" v-else-if="info.presell_mode === 1">
					<view>此款为预售款，{{$tool.formatDate(info.presell_date, 'yyyy-MM-dd')}}后开始发货</view>
				</view>
			</template>
			
			<view class="btn-g" :class="{'btn-2': !isThemeChangeable}">
				<view class="button" @tap="exchangeNumber">
					<view class="button-c" hover-class="hover">
						<image src="/static/bigBox/change.png" mode="aspectFit"></image>
					</view>
					<text>换一盒</text>
				</view>
				<view class="button" @tap="showImages">
					<view class="button-c" hover-class="hover">
						<image src="/static/bigBox/product.png" mode="aspectFit"></image>
					</view>
					<text>查看商品</text>
				</view>
				<view class="button" @tap="changeView" v-if="isThemeChangeable">
					<view class="button-c" hover-class="hover">
						<image src="/static/bigBox/flash.png" mode="aspectFit"></image>
					</view>
					<text v-if="viewType === 'default'">3D视角</text>
					<text v-else-if="viewType === '3d'">扁平风</text>
				</view>
			</view>
		</view>

		<view style="height:100rpx"></view>
		
		<!-- <DetailPagePopup v-if="isShowDetail" :images="info.detail_images" @close="isShowDetail = false"></DetailPagePopup> -->
		
		<uni-popup ref="detailPopup" style="z-index: 1000;" type="bottom">
			<BoxSkuPopup :setting="skuListSetting" :skuList="skuList" :detailImageList="info.detail_images" @close="$refs.detailPopup.close()"></BoxSkuPopup>
		</uni-popup>
		
		<!-- <BoxSkuPopup :skuList="skuList" :detailImageList="info.detail_images" @close="isShowDetail=false"></BoxSkuPopup> -->
		
		<SharePopup v-if="isSharePopup" @close="isSharePopup = false" :info="posterInfo"></SharePopup>
		
		<HiddenSkuRank :info="info" @close="isShowHiddenSkuRank = false" v-if="uuid && isShowHiddenSkuRank"></HiddenSkuRank>
		
		<Danmus v-if="danmuSetting.is_enabled" :setting="danmuSetting" :uuid="uuid" :list="danmuList"></Danmus>
		
		<!-- <PayCard :buyTotal="buyTotal" v-if="isShowPayCard" :info="payCardInfo" @success="paySuccess" @cancel="isShowPayCard=false"></PayCard> -->
		
		<!-- <navigator :url="'/pages/activityTicket/record?uuid=' + info.uuid">
			<image src="https://hquesoft.oss-cn-shenzhen.aliyuncs.com/box/home/share.png" mode="widthFix" class="free-times-icon"></image>
		</navigator> -->
		
	</view>
</template>

<script>
	import {
		mapGetters
	} from "vuex"
	import BoxThmemDefault from "./boxTheme/Default.vue"
	import BoxTheme3D from "./boxTheme/Box3D.vue"
	
	// import PayCard from "@//components/PayCard.vue"

	export default {
		components: {
			BoxThmemDefault,
			BoxTheme3D
		},
		data() {
			return {
				loading: true,
				test: false,
				uuid: "",
				info: {},
				number: 12,
				contentHeight: 4000,
				deepColor: false,
				startMoving: false,
				// visible: false,
				userlist: [],
				deviceHeight: this.$device.screenHeight,
				viewType: '3d',
				isSharePopup: false,
				isShowHiddenSkuRank: false,
				isShowDetail: false,
				isInit: false,
				danmuList: [],
				danmuSetting: {},
				skuList: [],
				skuListSetting: {}
			}
		},
		computed: {
			...mapGetters(["userInfo", "token"]),
			config() {
				return this.$store.getters.setting.box_room || {}
			},
			contentStyle() {
				return `min-height:${this.contentHeight}px;background-color: ${this.info.bg_color};`
			},
			room() {
				return this.info.room || {}
			},
			avatar() {
				return this.token ? this.userInfo.headimg : "/static/toux.png"
			},
			share () {
				return {
					title: this.info.title,
					thumb: this.info.thumb,
					desc:'',
					path: '/pages/boxDetail/index?uuid=' + this.info.uuid + '&invite_node=box-' + this.info.uuid,
				}
			},
			posterInfo () {
				let globalShareConfig = this.getShareConfig(false)
				
				return {
					money_price: this.info.money_price,
					score_price: this.info.score_price,
					title: this.info.title,
					path: globalShareConfig.path,
					app_url: globalShareConfig.app_url,
					thumb: this.info.thumb
				}
			},
			bgImage() {
				if (!this.isInit)
					return ''
					
				return this.info.room_bg_image || this.config.bg_image || 'https://cdn2.hquesoft.com/box/bg.png' || '/static/bigBox/bg.png'
			},
			isDarkMode() {
				return this.info.bg_color_mode === 2
			},
			tips() {
				return this.info.tips || '官方正品，非质量问题不支持退换'
			},
			isThemeChangeable() {
				return this.info.theme_mode === 1 || this.info.theme_mode === 2
			}
		},
		onLoad(e) {
			this.test = !!e.test
			this.uuid = e.uuid
			uni.getSystemInfo({
				success: res => {
					this.contentHeight = res.windowHeight
				}
			})
			uni.showLoading({
				title: "加载中",
				mask: true
			})
			this.$http('/boxes/' + e.uuid).then(res => {
				this.isInit = true
				
				this.loading = false
				uni.hideLoading()
				let info = res.data.info
				this.info = info
				
				uni.setNavigationBarTitle({
					title: this.info.title
				})
				
				// 使用扁平风
				if (this.info.theme_mode === 2 || this.info.theme_mode === 4) {
					this.viewType = 'default'
				}
				
				this.$visitor.record({
					type: 'box_detail',
					title: this.info.title
				})
				
				this.$http(`/boxes/${this.uuid}/skus`).then(res => {
					this.skuList = res.data.list
				})
				
				this.getDanmu()
				
			}).catch(err => {
				uni.hideLoading()
			})
			
			if (this.config.bgm) {
				this.$playBgm(this.config.bgm)
			}
		},
		watch: {
			config () {
				if (this.config.bgm) {
					this.$playBgm(this.config.bgm)
				}
			}
		},
		onUnload () {
			this.$stopBgm()
		},
		onShow() {
			if (this.info.uuid) {
				this.$http('/boxes/' + this.info.uuid, 'GET', {
					room_id: this.room.id
				}).then(res => {
					let info = res.data.info
					this.info = info
				})
			}
			
			this.$http('/setting/box').then(res => {
				this.skuListSetting = res.data.setting
			})
		},
		methods: {
			goLotteryDetail () {
				uni.navigateTo({
					url: '/pages/lottery/detail?uuid=' + this.info.lottery.uuid
				})
			},
			goJikaDetail () {
				uni.navigateTo({
					url: '/pages/jika/detail?uuid=' + this.info.jika.uuid
				})
			},
			buyMany (total) {
				if (this.info.is_presell && (this.info.presell_mode  === 0)) {
					uni.showToast({
						title: '此款正在预售中，暂不可购买哦~',
						icon: 'none'
					})
					return false
				}
				
				// 查找第一个未开启的盒子
				let index = this.room.sku_status.findIndex(item => {
					return item === 0
				})
				if (index == -1) {
					uni.showToast({
						title: '此盒已售完，换一盒吧~',
						icon: 'none'
					})
					return false
				}
				uni.navigateTo({
					url: `/pages/openBox/index?index=${index+1}&roomUuid=${this.room.uuid}&uuid=${this.info.uuid}&buyMode=${total}`
				})
			},
			buyWholeRoom () {
				if (this.info.is_presell && (this.info.presell_mode  === 0)) {
					uni.showToast({
						title: '此款正在预售中，暂不可购买哦~',
						icon: 'none'
					})
					return false
				}
				
				this.$http('/user').then(res => {
					let index = 1
					uni.navigateTo({
						url: `/pages/openBox/index?index=${index+1}&roomUuid=${this.room.uuid}&uuid=${this.info.uuid}&buyMode=wholeRoom`
					})
				})
			},
			getDanmu() {
				this.$http(`/danmus/box_detail?node_id=${this.info.id}`).then(res => {
					this.danmuSetting = res.data.setting 
					this.danmuList = res.data.list
				})
			},
			changeView() {
				if (this.viewType == 'default')
					this.viewType = '3d';
				else if (this.viewType == '3d')
					this.viewType = 'default';
			},
			async refresh(e) {
				uni.showLoading({})
				const res = await getBoxInfo(this.info.uuid)
				this.info = res.data.info
				uni.hideLoading()
			},
			handleSelect(index) {
				if (this.test) {
					uni.navigateTo({
						url: `/pages/testOpenBox/index?index=${index+1}&roomUuid=${this.room.uuid}&uuid=${this.info.uuid}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/openBox/index?index=${index+1}&roomUuid=${this.room.uuid}&uuid=${this.info.uuid}`
					})
				}
			},
			hideImages() {
				this.visible = false
			},
			showImages() {
				this.$refs.detailPopup.open('bottom')
				// this.isShowDetail = true
				// this.visible = true
			},
			exchangeNumber() {
				uni.showLoading({
					title: "加载中",
					mask: true
				})

				this.startMoving = true
				setTimeout(() => {
					this.startMoving = false
				}, 400)

				setTimeout(() => {
					this.$http(`/boxes/${this.info.uuid}/next-room`, 'GET', {
						uuid: this.info.uuid,
						current_room_id: this.room.id
					}).then(res => {
						uni.hideLoading()
						this.info.room = res.data.room
					}).catch(err => {
						console.log(err)
						uni.hideLoading()
					})
				}, 200)
			},
			colorRgb(colorString) {
				// 把颜色值变成小写
				var color = colorString.toLowerCase();
				// 如果只有三位的值，需变成六位，如：#fff => #ffffff
				if (color.length === 4) {
					var colorNew = "#";
					for (var i = 1; i < 4; i += 1) {
						colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
					}
					color = colorNew;
				}
				var colorChange = [];
				for (var i = 1; i < 7; i += 2) {
					colorChange.push(parseInt("0x" + color.slice(i, i + 2)));
				}
				return this.sumArr(colorChange);
			},
			sumArr(arr) {
				return arr.reduce(function(prev, cur) {
					return prev + cur;
				}, 0);
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.free-times-icon {
		position: fixed;
		right: 20rpx;
		bottom: 600rpx;
		width: 160rpx;
	}
	
	
	.lottery-tips {
		background: white;
		font-size: 26rpx;
		padding: 10rpx 20rpx 10rpx 30rpx;
		border-radius: 30rpx;
		margin-bottom: 30rpx;
		.icon-arrow-right {
			font-size: 40rpx;
		}
		display: flex;
		
		align-items: center;
	}
	
	.bgm-icon {
		width: 58rpx;
		height: 58rpx;
		position: fixed;
		left: 40rpx;
		top: 220rpx;
		z-index: 100;
		
		&.disable {
			  -webkit-filter: grayscale(100%);
			  -moz-filter: grayscale(100%);
			  -ms-filter: grayscale(100%);
			  -o-filter: grayscale(100%);
			  filter: grayscale(100%);
			  filter: gray;
		}
	}
	
	.card-list {
		display: flex;
		justify-content: center;
		margin-bottom: 10rpx;
	
		.item {
			// width: 150rpx;
			padding: 0rpx 20rpx;
			height: 48rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #FFE78A;
			border-radius: 24rpx;
			font-size: 26rpx;
	
			// &:last-child {
			// 	margin-left: 30rpx;
			// }
	
			image {
				width: 30rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
	}
		
	.presell-mask {
		background: rgba(30, 30, 30, 0.5);
		z-index: 99;
		width: 600rpx;
		// position: fixed;
		left: 75rpx;
		top: 200rpx;
		color: white;
		padding: 20rpx 0rpx;
		text-align: center;
		border-radius: 20rpx;
		font-weight: bold;
		color: #FFFFFF;
	}
	
	.bg {
		position: fixed;
		width: 100%;
		height: 101%;
		z-index: -1;
		top: -1px;
		left: 0;
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
		
		z-index: 100;
	
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
			top: 600rpx;
			.icon-wechat {
				font-size: 40rpx;
			}
			
			&::after {
				display: none;
			}
		}
		
		&.rand-list {
			top: 700rpx;
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

	.container {
		overflow: hidden;
		// position: fixed;
		display: flex;
		width: 100%;
		// height: 100%;
		z-index: 0;
		align-items: center;
		justify-content: center;
		// border: 5px solid red;
		// background-color: #fff;
		// overflow: hidden;

		.content {
			// width: 556rpx;
			width: 480rpx;
			// border: 1px solid red;
			margin: auto auto;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;

			.gift-box-number {
				// width: 230rpx;
				// height: 38rpx;
				margin: 34rpx auto;
				// background-color: #9cafd5;
				// border-radius: 6rpx;
				text-align: center;
				line-height: 38rpx;
				font-size: 24rpx;
				color: #efefef;
				font-weight: 500;
				color: #333;
				
				.tips {
					// color: #666;
					font-weight: 400;
					margin-top: 10rpx;
				}
			}
		}
	}

	.btn-g {
		width: 100%;
		margin-top: 34rpx;
		display: flex;
		justify-content: space-between;
		
		&.btn-2 {
			padding: 0rpx 30rpx;
			box-sizing: border-box;
		}
	}

	.button {
		display: flex;
		align-items: center;
		flex-direction: column;
		color: #222;
		font-weight: 500;
		// font-size: 32rpx;

		.button-c {
			width: 114rpx;
			height: 114rpx;
			background: #FFE78A;
			border-radius: 50%;
			text-align: center;
			// line-height: 114rpx;
			display: flex;
			align-items: center;
			justify-content: center;

			image {
				width: 60rpx;
				height: 60rpx;
				// display: inline;
			}
		}

		text {
			font-size: 26rpx;
			margin-top: 10rpx;
		}
	}

	.images-content {
		position: absolute;
		bottom: 0;
		width: 100%;
		height: 85%;
		background-color: #FFFFFF;
		border-radius: 10rpx 10rpx 0 0;
		animation: move 0.4s;
		overflow: hidden;

		scroll-view {
			width: 100%;
			height: 100%;
		}

		image {
			width: 100%;
			display: block;
		}

		.close-btn {
			position: absolute;
			right: 10rpx;
			top: 10rpx;
			width: 60rpx;
			height: 60rpx;
			text-align: center;
			line-height: 60rpx;

			.iconfont {
				font-size: 50rpx;
				color: #f7cb48;
			}
		}
	}

	.waiting-list {
		position: fixed;
		top: 24rpx;
		left: 24rpx;

		.user-image {
			width: 60rpx;
			height: 60rpx;
			background-color: #eeeeee;
			border-radius: 50%;
			overflow: hidden;

			image {
				display: block;
				width: 100%;
				height: 100%;
			}
		}
	}
	
	.container {
		&.dark-bg {
			.button {
				color: #ddd;
			}
			
			.gift-box-number {
				color: #ddd;
		
			}
		}
	}
</style>
