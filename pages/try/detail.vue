<template>
	<view class="scope-container" :style="'min-height: 100vh; background:#000000'">
		<!-- #ifndef H5 -->
		<!-- <TextNavBar :titleColor="titleColor" :bgColor="titleBgColor" :title="info.title"></TextNavBar> -->
		<!-- #endif -->
		<!-- <TextNavBar :bgColor="titleBgColor" :title="info.title"></TextNavBar> -->
		
		<view style="position: relative;o'v" >
			<!-- 盒柜 -->
			<view class="cart" @click="gomybox()"><navigator url="/pages/myBox/index"></navigator></view>
			<!-- 中赏记录 -->
			<image  @tap="isShowRankList = false" class="winning_record" src="https://www.hebide.cc/newfudaiimages/winning_record.png" mode="widthFix"></image>

			<!-- 背景 -->
			<image class="bg-top" src="https://www.hebide.cc/newfudaiimages/bg-top.png" mode="widthFix"></image>
			<!-- 轮播 -->
			<view class="product-swiper-box">
				
				<swiper class="swiper" circular  autoplay='false' interval="2000" duration=500>
					
					<swiper-item v-for="(item, index) in skus" :key="index" v-if="item.level==5">
						<view class="swiper-item">
							<view class="title-box">
								<image style="width: 100rpx;" src="https://www.hebide.cc/newfudaiimages/zjs.png" mode="widthFix"></image>
								<view class="title">{{item.title}}</view>
								<view class="money_price">市场参考价：￥{{item.money_price/100}}元</view>
							</view>
							<view class="image-box"><image mode="heightFix" :src="item.thumb"></image></view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<image class="oushen" mode="widthFix" src="https://www.hebide.cc/newfudaiimages/oushen.png"></image>
			<view class="user-swiper-box">
				<swiper class="swiper" circular display-multiple-items=1   autoplay='false' interval="3000" vertical='true' duration=500>
					<swiper-item v-for="(item, index) in wining_list" :key="index">
						<view class="user-box"><image class="user-icon" src="https://www.hebide.cc/newfudaiimages/user-icon.png"></image><text class="name">{{item.user.name.slice(0,2)}}...</text> {{item.created_at.slice(5,10)}} 抽中 <image class="user-headimg" :src="item.sku.thumb"></image></view>
					</swiper-item>
				</swiper>	
			</view>
		</view>
		<view class="list-box">
			<view class="sku-list-box">
				<view style="padding-top: 200rpx;"></view>
				<view class="sku-list" v-for="(item, index) in info.sku_level">
					<view class="top-title-box"><view  class="top-title" :style="{color:color_list[item.level-1].color}">{{item.title}}</view> <view >概率 {{item.odds.toFixed(2)}}%（此概率为当前赏别出赏概率）</view> </view>
					<view class="sku-box"  v-for="(item2, index2) in skus" @tap="showDetailImagePopup(item2)" v-if="item.level==item2.level">
						<view class="sku-item">
							<view style="position: relative;">
								<image class="icon" mode="widthFix" :src="getLevelIcon(item2.level)"></image>
								<view class="sku-image"><image  mode="widthFix" :src="item2.thumb"></image></view>
							</view>
							<view class="sku-tilit">{{item2.title}}</view>
							<view class="price-box">参考价<PriceDisplay :info="item2"></PriceDisplay></view>
						</view>
					</view>
				</view>
				

			<view style="padding-bottom: 400rpx;"></view>
			</view>
		</view>
		
		
		
		<view class="footer-box">

			<view class="box-price-box"><PriceDisplay :info="info"></PriceDisplay></view>

			<view class="game_shows" ><navigator url="/pages/rule/index?type=fudai">玩法说明</navigator></view>
		
			
		</view>
		<view class="footer2-box">
			<!-- 怒气值 -->
			<view class="new-treasure_box"><navigator url="/pages/rule/index?type=fudai"></navigator></view>
			<view class="progress_box_main">
				<view class="progress_yellow" :style="{width:width_value+'%'}"></view>
				<image class="icon-progress" src="https://www.hebide.cc/newfudaiimages/new-icon-progress.png" :style="{'margin-left':width_value+'%'}" mode="widthFix"></image>
				<view class="icon-progress-text" :style="{'margin-left':width_value+'%'}" >{{width_value}}%</view>
			</view>
			
			<!-- 概率 -->
			<view class="probability">
				<image class="bg-probability" src="https://www.hebide.cc/newfudaiimages/new/bg-probability.png" mode="widthFix"></image>
				<view class="level_odds_box" v-for="(item, index) in info.sku_level" >
					<view class="level_odds">
						<image :src="item.icon" mode="widthFix"></image>
						<text>{{item.odds}}%</text>
					</view>
				</view>
			</view>
			
			<!-- 说明 -->
			<view class="explain_text">分解低于抽赏费，1元增加1怒气，达到{{info.min_lucky_score}}，必获得秘宝</view>
			
			<view class="lottery-box">
				<view class="lottery">
					
					<view @tap="pay(1)" >一发</view>
					<view @tap="pay(3)">三发</view>
					<view @tap="pay(10)">十发</view>
					
				</view>
			</view>
			<view class="discount-tips" v-if="discountTips">{{discountTips}}</view>
		</view>
		
		
		
		
		
		
		
		
		<PayCard :info="payInfo" @close="hidePayPopup" :payTotal="payTotal" @success="paySuccess" v-if="isPayPopup"></PayCard>
		
		<uni-popup  style="z-index: 1000;" ref="detailPopup" type="bottom">
			<BoxSkuPopup :detailImageList="detailImageList" @close="hideDetailImagePopup"></BoxSkuPopup>
		</uni-popup>

		<OpenBoxPopupTheme  :skuslist="skus" :payTotal="payTotal"  boxImgMode="square"  :levelskus="info.sku_level" v-if="isShowResultPopup"  @close="goBack" :boxImg="boxImage"></OpenBoxPopupTheme>
		
		<template v-if="isNotFound">
			<view class="not-found-c">活动不见了哦~</view>
		</template>
		
		<FreeTicketFloatBtn v-if="info.is_invite_enabled" @useFreeTicket="useFreeTicket" :uuid="uuid" nodeType="fudai"></FreeTicketFloatBtn>
		
		<Danmus v-if="danmuSetting.is_enabled" :setting="danmuSetting" :list="danmuList"></Danmus>
		
		

	</view>
</template>

<script>
	import PayCard from "./components/PayCard.vue"

	import OpenBoxPopupTheme from "./components/OpenBoxPopup.vue"
	
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			PayCard,

			OpenBoxPopupTheme,
		},
		data() {
			return {
				uuid: "",
				isInit: false,
				isPayPopup: false,
				payTotal:0,
				info: {},
				order: {},
				pageUuid: '',
				isNotFound: false,
				isShowResultPopup: false,
				danmuSetting: {},
				danmuList: [],
				config: {},
				detailImageList: [],
				levelFilter: 0,
				isTryMode: false,
				isShowRankList: false,
				wining_list:[],
				is_doubleBoxCard:0,
				color_list:[{'level':0,'color':'#00aa00'},{'level':1,'color':'#aa55ff'},{'level':2,'color':'#ffff00'},{'level':3,'color':'#ffff00'},{'level':4,'color':'#ff0000'}],
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			bgImage ()  {
				return 'https://cdn2.hquesoft.com/box/fudai/detail_bg.png'
			},
			boxImage () {
				return this.info.image_3d || 'https://cdn2.hquesoft.com/box/fudai/box.png'
			},
			skuLevel () {
				return this.info.sku_level || []
			},
			skus () {
				if (this.levelFilter) {
					return this.info.skus.filter(item => {
						return item.level === this.levelFilter
					})
				}
				else {
					return this.info.skus || []
				}
			},
			
			payInfo () {
				return {
					page_uuid: this.pageUuid,
					title: "试玩页面",
					pay_total: this.payTotal,
					total_list: this.info.total_list,
					money_price: this.info.money_price,
					score_price: this.info.score_price
				}
			},
			titleBgColor () {
				return ' '
			},
			titleColor(){
				return '#ffffff'
			},
			// 设置页面标题
			setTitleText() {
			    uni.setNavigationBarTitle({
			       title: "试玩页面",						
				})
		    },
			
			discountTips () {
				let totalList = this.info.total_list || []
				for (let i=totalList.length-1; i>=0; i--) {
					// 有连开优惠
					if (totalList[i].is_discount) {
						let str = totalList[i].total + '连开优惠'
						
						if (totalList[i].money_discount) {
							str += (totalList[i].money_discount / 100) + '元'
						}
						if (totalList[i].score_discount) {
							str += totalList[i].score_discount +  this.scoreAlias
						}
						
						return str
					}
				}
				
				return false
			},
			width_value(){
				if(this.userInfo.lucky_score/this.info.min_lucky_score*100>100){
					return 100
				}else if(this.userInfo.lucky_score/this.info.min_lucky_score*100<0){
					return 0
				}else{
					return Math.trunc(this.userInfo.lucky_score/this.info.min_lucky_score*100)
				}
			},
		},
		watch: {},
		filters: {
		},
		onLoad(e) {
			this.uuid = e.uuid
		},
		onUnload () {
			
		},
		onPullDownRefresh() {
			this.$showPullRefresh()
			this.initData()
			this.setTitleText()

		},
		onShow() {
			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				this.isInit = true
				uni.hideLoading()
				
				this.$http('/fudai/change', 'POST', {
					fudai_id: this.info.id
				}).then(res => {
					this.pageUuid = res.data.page_uuid
					this.fetchList()
				})
				
			}).catch(res => {
				this.isNotFound = true
			})
		},
		onReachBottom() {},
		methods: {
			handleTry () {
				uni.showModal({
					title: '试玩提示',
					content: '试玩开出的奖品仅作为演示作用，不可作发货及其它作用',
					confirmText: '同意试玩',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.showLoading({
								title: '操作中~'
							})
							
							this.$http('/fudai/try', 'POST', {
								page_uuid: this.pageUuid,
								total: 1
							}).then(res => {
								uni.hideLoading()
								this.isTryMode = true
								this.paySuccess(res.data, true)
							})
						}
					}
				})
			},
			//榜单数据
			fetchList() {
				if (this.isLoading)
					return false
			
				this.isLoading = true
			
				return this.$http(`/fudais/${this.info.uuid}/records`, 'GET', {
					page: 1,
					per_page:100,
				}).then(res => {
					this.isInit = true
					for( let i=0; i<res.data.list.length; i++){
						if(this.wining_list.length<12){
							if(res.data.list[i].level==5){
								this.wining_list.push(res.data.list[i])
							}
						}
					}
					
					
				}).catch(err => {
					this.isInit = false

				})
			},
			setLevelFilter (level) {
				if (this.levelFilter === level) {
					this.levelFilter = 0
				}
				else {
					this.levelFilter = level
				}
			},
			gomybox(){
				// uni.navigateTo({
				// 	url: '/pages/myBox/index'
				// })
				uni.reLaunch({
					url: '/pages/myBox/index'
				})
			},
			// 使用1次兑换记录
			useFreeTicket() {
				uni.showLoading({
					title: '提交中',
					icon: 'none'
				})
				
			},
			getDanmu() {
				this.$http(`/danmus/fudai_detail?node_id=${this.info.id}`).then(res => {
					this.danmuSetting = res.data.setting 
					this.danmuList = res.data.list
				})
			},
			showDetailImagePopup (item) {
				
				// 有绑定商品，则直接跳转到商品详情
				if (item.product_id) {
					uni.navigateTo({
						url: '/pages/productDetail/index?mode=view&uuid=' + item.product_id
					})
					return false
				}
				
				if (!item.detail_images || !item.detail_images.length) {
					uni.showToast({
						title: '此款暂无详情~',
						icon: 'none'
					})
					return false
				}
				this.$refs.detailPopup.open('bottom')
				this.detailImageList = item.detail_images || []
			},
			hideDetailImagePopup () {
				this.$refs.detailPopup.close()
				// this.isShowDetail = false
			},
			refresh() {
				this.$store.dispatch("getUserInfo");
			},
			initData() {
				return this.$http(`/fudais/${this.uuid}`, 'GET', {
				}).then(res => {
					this.info = res.data.info
					this.config = res.data.config 
					this.info.sku_level=this.info.sku_level.sort().reverse()
					console.log(this.info.sku_level)
					console.log(this.info.skus)
					this.getDanmu()
					
					
				})
			},
			paySuccess (order, isTryMode = false) {
				this.isPayPopup = false 
				// console.log(order)
				this.payTotal=order
				this.isShowResultPopup = true
				// 购买成功
				
				// this.refresh()
			},
			goBack () {
				this.isShowResultPopup = false 
				uni.navigateBack({
					delta: 1,
					animationType: 'pop-out',
					animationDuration: 200
				});
				
			},
			hidePayPopup () {
				this.isPayPopup = false
			},
			pay (payTotal) {
				this.payTotal=payTotal
				this.isPayPopup = true
			},
			getLevelIcon (level) {
				return this.skuLevel.find((item) => {
					return item.level === level
				}).icon
			},
			getLevelTitle (level) {
				return this.skuLevel.find((item) => {
					return item.level === level
				}).title
			}
		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.not-found-c {
		font-size: 36rpx;
		// font-weight: 500;
		text-align: center;
		color: white;
		line-height: 500rpx;
	}
	.scope-container {
		// padding-top: 150rpx;
		min-height: 100vh;
		box-sizing: border-box;
		// padding-top: 180rpx;
		padding-bottom: 80rpx;
		background-size: 100% auto !important;
		overflow: hidden;
		/* #ifdef H5 */
		padding-top: 50rpx;
		background-position: 0 -130rpx !important;
		/* #endif */
	}
	
	.rule-btn {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		top: 260rpx;
		right: 0rpx;
	}
	
	.stock-btn {
		width: 100rpx;
		height: 100rpx;
		position: fixed;
		top: 400rpx;
		right: 0rpx;
	}
	
	.rank-btn {
		width: 90rpx;
		height: 80rpx;
		line-height: 80rpx;
		position: fixed;
		top: 560rpx;
		font-size: 26rpx;
		font-weight: 500;
		right: 0rpx;
		background: #FFEF58;
		// text-align: center;
		padding-left: 30rpx;
		box-sizing: border-box;
		border-radius: 50rpx 0rpx 0rpx 50rpx;
	}
	
	
	.float-btn {
		position: fixed;
		height: 66rpx;
		background: #FFFFFF;
		border-radius: 32rpx;
		display: flex;
		align-items: center;
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: bold;
		color: #000000;
		line-height: 26rpx;
		padding: 0rpx 20rpx;
		z-index: 100;
		
		&.score-btn {
			left: 30rpx;
		}
		&.chip-btn {
			left: 260rpx;
		}
		// top: ;
		
		.icon {
			width: 36rpx;
			height: 36rpx;
			margin-right: 10rpx;
		}
	}
	
	.box-image-c {
		text-align: center;
		// margin-top: 130rpx;
		// border: 1px solid red;
		.box-image {
			// border: 1px solid red;
			width: 470rpx;
			height: 470rpx;
		}
	}
	
	.submit-btn {
		margin: 60rpx auto 0rpx auto;
		width: 600rpx;
		height: 100rpx;
		background: linear-gradient(0deg, #F6EA75, #FFEF58);
		border-radius: 50rpx;
	
		font-size: 32rpx;
		font-family: PingFang;
		font-weight: bold;
		color: #000000;
		line-height: 100rpx;
		text-align: center;
		position: relative;
		
		
	}
	
	.price-c {
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: bold;
		color: #000000;
		line-height: 26rpx;
		opacity: 0.8;
		text-align: center;
		margin-top: 30rpx;
	}
	
	.level-title {
		font-size: 28rpx;
		font-family: PingFang;
		font-weight: bold;
		color: #FFFFFF;
		line-height: 26rpx;
		margin: 80rpx 46rpx 30rpx 46rpx;
		// padding: 0rpx;
	}
	.level-list {
		display: flex;
		justify-content: space-between;
		
		margin: 10rpx 46rpx;
		
		&.list-3 {
			padding: 0rpx 60rpx;
			box-sizing: border-box;
		}
		
		.item {
			text-align: center;
			padding: 10rpx 30rpx;
			.icon {
				width: 66rpx;
				height: 66rpx;
			}
			
			.title {
				font-size: 24rpx;
				font-family: PingFang;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 26rpx;
			}
			
			.odds {
				font-size: 22rpx;
				font-family: PingFang;
				font-weight: bold;
				color: #FEEF5A;
				line-height: 26rpx;
				margin-top: 4rpx;
			}
			
			&.activite {
				// border: 1px solid red;
				background: rgba(0, 0, 0, 0.3);
				border-radius: 10rpx;
			}
		}
	}
	
	.tips-c {
		text-align: center;
		margin-top: 20rpx;
		font-size: 24rpx;
	}
	
// new

.cart{
	position: fixed;
	right: 10rpx;
	top: 340rpx;
	z-index: 99;
	width: 130rpx;
	height: 80rpx;
	background: url("https://www.hebide.cc/newfudaiimages/cart.png") no-repeat ;
	background-size: 100%;
	navigator{
		width: 100%;
		height: 100%;
	}
}
.winning_record{
	position: absolute;
	bottom: 30rpx;
	left: 10rpx;
	width: 150rpx;
	z-index: 12;
}

.new-box-price{
	position: absolute;
	bottom: 20rpx;
	right: 0rpx;
	width: 160rpx;
	color: #FFFFFF;
	font-size:26rpx;
	.price{
		font-weight: 600;
	}
	text{
		font-size: 16rpx;
	}
	z-index: 12;
}

.bg-top{
	position: absolute;
	bottom: -1rpx;
	left: 0;
	width: 100%;
	z-index: 11
}

.product-swiper-box{
	position: relative;
	z-index: 10;
	width: 100%;
	height: 400rpx;

	background-color: #d95f0e;
	.swiper-item{
		width: 100%;
		height: 100%;
		display: flex;
		overflow: hidden;
		.title-box{
			width: 50%;
			margin: 40rpx 5rpx;
			margin-left: 40rpx;
			.title{
				color:#FFFFFF ;
				line-height: 50rpx;
				font-weight: 900;
				// text-shadow: .5rpx .5rpx 0 #fdcc08;
				font-size: 26rpx;
			}
			.money_price{
				color: #FFFFFF;
				font-size: 24rpx;
			}
		}
		.image-box{
			width: 50%;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			margin: 40rpx auto;
			// margin-right: 40rpx;
			overflow: hidden;
			image{
				height:calc(100% - 20rpx);

			}
		}
	}
}

.oushen{
	position: absolute;
	width: 80rpx;
	
	bottom:80rpx;
	left: 200rpx;
	z-index: 10;
}

.user-swiper-box{
	width: 250rpx;
	// height: 40rpx;
	position: absolute;
	bottom:40rpx;
	left: 210rpx;
	overflow: hidden;
	height: 40rpx;
	z-index: 10;
	.swiper{
		height: 40rpx;
		swiper-item{
			.user-box{
				display: flex;
				align-items: center;
				color: #FFFFFF;
				font-size: 20rpx;
				.user-icon{
					width: 20rpx;
					height: 20rpx;
					margin-right: 5rpx;
				}
				.user-headimg{
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					margin: 0 10rpx;
				}
			}
		}
	}
	
	
}


.list-box{
	position: relative;
	z-index: 1;
	width: 100%;
	overflow: hidden;
	margin-top: -200rpx;
	color: #000000;
	height: 65vh;
	.top-title-box{
		display: flex;
		align-items: center;
		color: #FFFFFF;
		font-size: 20rpx;
		// padding-left:20rpx;

		.top-title{
			color: red;
			font-weight: 600;
			font-size: 32rpx;
			margin-right: 14rpx;
			font-weight: 600;
		}
	}
	.sku-list-box{
		width: calc(100% - 40rpx);
		margin:0 auto;
		height: 1000rpx;

		overflow: auto;

		.top-title-box{
			width: 100%;
			margin-bottom:20rpx; ;
		}
		.sku-list{
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			// justify-content: flex-start;
			background-color: #000000;
			// flex-group:1;
			margin: 20rpx 0;
		}
		.sku-box{
			width: calc(33% - 18rpx);
			margin:10rpx;
			color: #FFFFFF;
			.sku-item{
				
				.icon{
					position: absolute;
					top: -10rpx;
					left: -10rpx;
					width: 75rpx;
				}
				.sku-image{
					border:.5rpx solid #FFFFFF;
					width: 215rpx;
					height: 215rpx;
					overflow: hidden;
					image{
						width: 100%;
					}
				}
				.sku-tilit{
					font-size: 26rpx;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
				.price-box{
					font-size: 24rpx;
					color: #999999;
				}
			}
		}
	}

}

.box-price-box{
	position: absolute;
	z-index: 20;
	width: 120rpx;
	top: 85rpx;
	right: 80rpx;
	text-align: right;
	color: #ffca10;
	.price{
		font-size: 26rpx;
		font-weight: 900;
	}
}
.footer-box{
		display: block;
		position: fixed;
		bottom: 180rpx;
		left: 0;
		width:100%;
		height:250rpx;
		z-index: 99;
		background-color: #171819;
		background: url('https://www.hebide.cc/newfudaiimages/bottom-bg.png') no-repeat;
		background-size: 100% 100%;
		
		.s_image{
			position: absolute;
			top: 25rpx;
			left: 20rpx;
			width: 40%;
		}
		
		.game_shows{
			position: absolute;
			top: 150rpx;
			right: 20rpx;
			opacity: 0;
			color: #ee5c25;
		}
}
.footer2-box{
	position: fixed;
	bottom: 0;
	width: 100%;
	height: 190rpx;
	z-index: 100;
	background-color: #171819;
	.new-treasure_box{
		position: absolute;
		top:-60rpx;
		width:375rpx;
		height: 60rpx;
		background: url("https://www.hebide.cc/newfudaiimages/new/new-bg-treasure.png") no-repeat;
		background-size: 100%;
		navigator{
			width: 100%;
			height: 100%;
		}
		margin-bottom: 10rpx;
		
	}
	.new-treasure_box::after{
		content: "";
		position: absolute;
		top: 10rpx;
		right: -10rpx;
		width: 25rpx;
		height: 60rpx;
		background-color: #171819;
		z-index: 2;
		transform: rotate(20deg);
	}
	.new-treasure_box::before{
		content: "";
		position: absolute;
		top: 16rpx;
		right: 18rpx;
		width: 7rpx;
		height: 45rpx;
		background-color: #FFFFFF;
		transform: rotate(20deg);
		z-index: 3;
	}
	.progress_box_main{
		position: absolute;
		top:-42rpx;
		left:120rpx;
		width:240rpx;
		height: 50rpx;
		.progress_yellow{
			width: 0;
			background-color: #febe4e;
			height: 38rpx;
			transition: width 2s;
		}
		.progress_yellow::after{
			content: "";
			position: absolute;
			left:-5rpx;
			width:10rpx ;
			height: 40rpx;
			background-color: #FFFFFF;
			transform: rotate(-10deg);
		}
		.icon-progress{
			margin-left: 0;
			top:10rpx;
			left:13rpx;
			position: absolute;
			width: 50rpx;
			transition: margin 2s;
			z-index: 999;
		}
		.icon-progress-text{
			margin-left: 0;
			position: absolute;
			top:11rpx;
			color: #FFFFFF;
			font-size: 14rpx;
			left: 30rpx;
			transition: margin 2s;
			z-index: 999;
		}
	}
	.probability{
		position: absolute;
		top:-130rpx;
		width:530rpx;
		height: 40rpx;

		border-top: 7rpx solid #FFFFFF;
		border-bottom: 7rpx solid #FFFFFF;
		z-index: 90;
		display: flex;
		.bg-probability{
			width:75rpx;
		}
		.level_odds_box{
			width: auto;
			display: flex;
			height: 40rpx;
			margin-top: -40rpx;
			.level_odds{
				width: auto;
				display: flex;
				margin:15rpx 5rpx;
				
				// align-items: flex-end;
				image{
					width: 40rpx;
				}
				text{
					padding-top: 30rpx;
					font-size: 20rpx;
					color: #FFFFFF;
				}
			}
			
		}
	}
	.probability::after{
		content: "";
		position: absolute;
		right: -10rpx;
		top: -20rpx;
		width: 25rpx;
		border-top: 0;
		height: 80rpx;
		background-color: #171819;
		transform: rotate(20deg);
		z-index: 2;
	}
	.probability::before{
		content: "";
		position: absolute;
		right: 17rpx;
		top: -7rpx;
		width: 7rpx;
		height: 50rpx;
		background-color: #FFFFFF;
		transform: rotate(20deg);
		z-index: 3;
	}
	.top-left-box{
		position: relative;
		z-index: 2;
		.bg-treasure{
			width: 120rpx;
			height: 120rpx;
			position: absolute;
			top: -100rpx;
			left: 20rpx;
			z-index: 1;
		}
		.bg2-treasure{
			width: 200rpx;
			height: 200rpx;
			position: absolute;
			top: -145rpx;
			left: -25rpx;
			z-index: 2;
			display: flex;
			align-items: center;
			justify-content: center;
			image{
				width: 100%;
				animation:mymove 1s infinite;
			}
			
		}
		@keyframes mymove
			{
			0% {width:100%;}
			75% {width:80%;}
			100%{with:100%;}
		}
		.treasure{
			width: 65rpx;
			height: 65rpx;
			position: absolute;
			top: -75rpx;
			left: 45rpx;
			z-index: 3;
		}
	}
	.progress_main{
		width: 70%;
		margin: 0 auto;
		position: relative;
		z-index: 1;
		.bg-progress{
			position: absolute;
			top: -30rpx;
			width: calc(100% + 6rpx);
			height: 30rpx;
			z-index: 1;
			
		}
		.progress_red{
			position: absolute;
			top: -24rpx;
			width: 0%;
			height: 18rpx;
			z-index: 2;
			background-g: #b2340f;
			background-image: linear-gradient(#ee5c25 20%, #ff0000 60%, #ee5c25 20%);
			transition: width 2s;
		}
		.icon-progress{
			position: absolute;
			top: -75rpx;
			margin-left: 0%;
			transition: margin 2s;
			left: -15rpx;
			width: 80rpx;
			pointer-events: none;
			z-index: 3;
		}
	}
	.lottery-box{
		position: fixed;
		bottom:0;
		width: calc(100% - 20rpx);
		.lottery{
			width: 700rpx;
			height: 90rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			bottom: 70rpx;
			left: calc(50% - 340rpx);
			background: url('https://www.hebide.cc/newfudaiimages/new/new-lottery_button.png') no-repeat;
			background-size: 100% 100%;
			view{
				width: 33%;
				text-align: center;
				padding: 26rpx 10rpx;
				opacity: 0;
			}

		}

	}
	.discount-tips {

		color: #ff1313;
		border-radius: 50rpx;
		letter-spacing: 1rpx;
		width: 100%;
		height: 50rpx;
		font-weight: 600;
		line-height: 50rpx;
		font-size: 24rpx;
		display: inline-block;
		position: absolute;
		bottom: 20rpx;
		text-align: center;
	}
}
.explain_text{
			position: fixed;
			word-break:break-all;
			bottom: 175rpx;
			right: 25rpx;
			color: #FFFFFF;
			width: 250rpx;
			height:64rpx;
			font-size: 18rpx;
			text-align: right;
			line-height: 32rpx;
			min-width: 250rpx;

		}
</style>
