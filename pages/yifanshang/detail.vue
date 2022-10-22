<template>
	<view class="scope-container">
		<!-- <TextNavBar :title="info.title"></TextNavBar> -->
		<view class="content">
			
			
			
			<!-- <view class="try_box" @click="handleTry()"></view> -->
			<view class="new-content" @click="up_next_fun">
				<image :src="info.images[0]" class="thumb" mode="aspectFill"></image>
			</view>
			
			<view class="new-list-box" :class="{'up_next_box':(up_next===true)}">
				
				<view class="top-tab">
					<view class="top-opo-box"><text v-if="info.money_price"><text style="color:#ff2c09;">￥</text> <text style="font-size: 36rpx;color: #ff2c09;">{{info.money_price/100}} &nbsp;</text> 元/张</text><text v-if="info.score_price"><text style="font-size: 24rpx;color: #ff2c09;">{{info.score_price}}</text><text style="font-size: 18rpx;">{{scoreAlias}}/张</text></text></view>
					<image mode="aspectFill"  src="https://www.hebide.cc/newimages/newyi/cart.png" @click="gomybox" class="newcart"></image>
					<image class="refresh-btn" mode="widthFix" @tap="refreshRoom"
										src="https://www.hebide.cc/newimages/newyi/refresh.png" />
					<image src="https://www.hebide.cc/newimages/newyi/top-tab.png"></image>
					<view class="top-tab-button"  @click="up_next_fun"><image :class="{'up_next':(up_next===true)}" src="https://www.hebide.cc/newimages/newyi/top-button.png"></image></view> >
				</view>
				<view class="tab-box">
					<view class="tab-flex">
						<view :class="{'tab_selected':(is_show===0) }" @click="function(){this.is_show=0 ;this.isRecordList=false}">
							 赏品一览
						</view>
						<view :class="{'tab_selected':(is_show===1) }" @click="function(){this.is_show=1;this.isRecordList=true}">
							 中赏记录
						</view>
					</view>
				</view>
				<view class="main-box">
					<view>
						<image class="up-box" mode="widthFix" @tap="lastRoom" src="https://www.hebide.cc/newimages/newyi/up.png" />
					</view>		
					<view style="font-size: 24rpx;display: flex; justify-content: space-around; align-items: center;">
						<view @tap="showRoomPopup" class="text-box" style="">
							<text >第</text>
							<text v-if="info.room && info.room.num" class="number" style=" margin-left: 10rpx;">{{info.room.num}}</text>
							<text>/</text>
							<text v-if="info.room_total" style="margin-left: 2rpx;">{{info.room_total}}</text>
							<text style=" margin-left: 10rpx;">箱</text>
						</view>
						<view class="text-box" style="margin-left:25rpx;">
												剩<text class="number" style="margin-left:10rpx;">{{info.room && info.room.stock}}</text>/{{info.room.total}}
												<text style=" margin-left: 10rpx;">张</text>
						</view>
	
					</view>
					
					<view>
						<image class="next-btn" mode="widthFix" @tap="nextRoom" src="https://www.hebide.cc/newimages/newyi/next.png" />
					</view>				
				</view>
				<view v-if="is_show===0" class="product-list">
					<view class="sku-list">
										<view class="item" style="margin-top: 100rpx;" v-for="(item, index) in info.skus" :key="item.id" @tap="showSkuPopup">
											<view class="thumb">
												<view class="sell-out-c" v-if="!item.stock">
													<image mode="widthFix" class="sell-out" src="@/static/empty-stock-2.png"></image>
												</view>
												<image mode="aspectFill" :src="item.thumb + '?x-oss-process=image/resize,w_300'"></image>
												<view class="total">{{item.stock}}/{{item.total}}</view>
												
											</view>
											<view class="title"><span class="shang-title" :class="{'gift': item.shang_type === 1}">{{item.shang_title}}
												</span><text style="padding: 0 5rpx;"></text>{{item.title}}</view>
					
											<view class="display-price">
												<view class="key">参考价:<text v-if="item.display_money_price">
														{{item.display_money_price / 100}}元
													</text>
													<PriceDisplay :info="info" v-else></PriceDisplay>
													</view>
											</view>
											<view class="display-price">
												<template v-if="item.shang_type === 1">
													<text>只赠不售</text>
												</template>
												<template v-else>
													<text clas="key">概率:</text>
													<text class="value">{{item.odds}}%</text>
												</template>
											</view>
										</view>
									</view>
				</view>
				
				<view v-if="is_show==1" class="remaining_quantity_box">
					<RecordList v-if="isRecordList" @close="hideRecordList()" :info="info" :room="info.room"></RecordList>
				</view>
			</view>
			
			
			
			
			
			
			
			
			
			
			
			<view class="new-footer-box">
				<view class="new-footer-buttom">
					<image v-if="isEnableBtn(0)" src="https://www.hebide.cc/newimages/newyi/bottom.png" ></image>
					<image v-if="!isEnableBtn(0)" src="https://www.hebide.cc/newimages/newyi/bottom1.png" ></image>
				</view>
			</view>
			<view class="new-footer2-box">
				<view class="new-footer-buttom">
					<button @tap="showRoomPopup">换箱</button>
				</view>
				<view class="new-footer-buttom">
					<button :class="{'gray-image': !isEnableBtn(0)}" @tap="buy(0)">全收</button>
				</view>
			</view>
			<view class="new-footer3-box">
				<image :class="{'gray-image': !isEnableBtn(1)}" src="https://www.hebide.cc/newimages/newyi/lottery.png"
										mode="widthFix" class="btn" @tap="buy(1)"></image>
				<image :class="{'gray-image': !isEnableBtn(3)}" src="https://www.hebide.cc/newimages/newyi/lottery-3.png"
										mode="widthFix" class="btn" @tap="buy(3)"></image>
				<image :class="{'gray-image': !isEnableBtn(5)}" src="https://www.hebide.cc/newimages/newyi/lottery-5.png"
										mode="widthFix" class="btn" @tap="buy(5)"></image>
			</view>
			
			
			
			
			
			
			<PayCard :info="payInfo" @close="hidePayPopup" @success="paySuccess" :istry="istry"  v-if="isPayPopup"></PayCard>
			
			<RoomPopup v-if="isRoomPopup" @select="changeRoom" @close="hideRoom()" :info="info" :room="info.room">
					</RoomPopup>
			
			
			
			<uni-popup style="z-index: 1000;" ref="detailPopup" type="bottom">
						<BoxSkuPopup :skuList="info.skus" :detailImageList="info.detail_images" @close="hideSkuPopup"></BoxSkuPopup>
					</uni-popup>
			
			
			
			
			
			<SharePopup v-if="isSharePopup" @close="hideSharePopup" :info="posterInfo"></SharePopup>
			<OpenBoxPopup :isNavbarEnable="true" :info="info" v-if="isOpenPopup"  :payTotal="payTotal" :order="order" @close="goBack" :istry="istry"
						 ></OpenBoxPopup>
						<!-- 邀请功能 -->
<!-- 			<FreeTicketFloatBtn v-if="true" @useFreeTicket="useFreeTicket" :uuid="uuid"
						nodeType="yifanshang"></FreeTicketFloatBtn> -->
		</view>
	</view>

</template>

<script>
	import PayCard from "./components/PayCard.vue"
	import RoomPopup from "./components/RoomPopup.vue"
	import RecordList from "./components/RecordList.vue"
	import OpenBoxPopup from "./components/OpenBoxPopup.vue"
	import {
		mapGetters
	} from "vuex"
	export default {
		components: {
			PayCard,
			RoomPopup,
			RecordList,
			OpenBoxPopup
		},
		data() {
			return {
				uuid: "",
				info: {
					room: {}
				},
				is_show:0,
				payTotal: 0,
				isPayPopup: false,
				isRoomPopup: false,
				startMoving: false,
				selectedRoom: {},
				isShowDetail: false,
				isOpenPopup: false, // 是否开盒
				isRecordList: false,
				isSharePopup: false,
				order: {}, // 支付成功后的订单
				roomId: '',
				is_noe:true,
				up_next:false,
				istry:false,
			}
		},
		computed: {
			...mapGetters(["userInfo"]),
			payInfo() {
				if (!this.info || !this.info.room) {
					return {}
				}

				return {
					room_id: this.info.room.id,
					pay_total: this.payTotal,
					title: this.info.title,
					money_price: this.info.money_price,
					score_price: this.info.score_price
				}
			},
			isAllPickDisable() {
				return !this.info.last_stock_all_pick_enable || (this.info.last_stock_all_pick_enable > this.info.room
					.stock)
			},
			share() {
				return {
					title: '[第' + this.info.room.num + '箱]' + this.info.title,
					// thumb: this.info.thumb,
					path: '/pages/yifanshang/detail?uuid=' + this.info.uuid + '&roomId=' + this.info.room.id +
						'&invite_node=yifanshang-' + this.info.uuid
				}
			},
			showSkuTitleList() {
				let list = JSON.parse(JSON.stringify(this.info.skus || []))
				return list.splice(0, 6)
			},
			posterInfo() {
				return {
					money_price: this.info.money_price,
					score_price: this.info.score_price,
					title: this.info.title,
					path: this.getShareConfig().path,
					thumb: this.info.thumb
				}
			},
		},
		watch: {},
		filters: {
			fixNumber(val) {
				if (val < 10) {
					return '0' + val
				}
				return val
			}
		},
		onLoad(e) {
			this.uuid = e.uuid
			this.roomId = e.roomId || ''

			uni.$on('startShare', () => {
				this.isSharePopup = true
			})

			
		},
		onUnload() {

		},
		onPullDownRefresh() {
			this.$showPullRefresh()
			this.initData()

		},
		onShow() {
			uni.showLoading({
				title: '加载中'
			})
			this.initData().then(res => {
				uni.hideLoading()
				
			})

		},
		onReachBottom() {},
		methods: {
			handleTry(){
				if(this.istry){
					uni.showModal({
						title: '退出提示',
						content: '即将退出试玩模式',
						confirmText: '同意退出',
						cancelText: '取消',
						success: (res) => {
							if (res.confirm) {
								uni.showLoading({
									title: '操作中~'
								})
								this.istry=false
								this.setTitleText()
								uni.hideLoading()
								
							}
						}
					})
				}else{
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
								this.istry=true
								this.setTitleText()
								uni.hideLoading()
							}
						}
					})
				}
			},
			lastRoom() {

				if (this.info.room.num === 1) {
					uni.showToast({
						title: '没有上一箱了~',
						icon: 'none'
					})
					return false
				}

				this.changeRoom({
					id: this.roomId - 1
				})

			},
			nextRoom() {
				if (this.info.room.num == this.info.room_total) {
					uni.showToast({
						title: '没有下一箱了~',
						icon: 'none'
					})
					return false
				}
				this.changeRoom({
					id: this.roomId + 1
				})

			},
			hideSharePopup() {
				this.isSharePopup = false
			},
			isEnableBtn(total) {
				// 抽*发按钮是否可用
				let flag = true

				if (total === 0) {
					flag = !this.info.is_limit_1 && this.isAllPickDisable && this.info.room.stock
					
				} else if (total === 1) {
					flag = this.info.room && this.info.room.stock
				} else {
					flag = !this.info.is_limit_1 && this.info.room.stock
				}
				
				return flag
			},
			hideRecordList() {
				this.isRecordList = false
			},
			showRecordList() {
				this.isRecordList = true
			},
			showTips() {
				uni.navigateTo({
					url: '/pages/rule/index?type=yifanshang'
				})
			},
			gomybox(){
				// uni.navigateTo({
				// 	url: '/pages/myBox/index'
				// })
				uni.reLaunch({
					url: '/pages/myBox/index'
				})
			},
			initData() {
				
				return this.$http(`/yifanshangs/${this.uuid}`, 'GET', {
					room_id: this.roomId
				}).then(res => {
					this.info = res.data.info
					
					// this.isLike = this.info.is_liked
					this.roomId = this.info.room && this.info.room.id
					
					
					this.setTitleText()
					// console.log('data.info'+JSON.stringify(res.data.info.room))
					// 加载评论
					// this.initCommentList()
				})
			},
			// 设置页面标题
			setTitleText() {
				if(this.istry){
					uni.setNavigationBarTitle({
						title: "试玩页面",
																			
					})
				}else{
					uni.setNavigationBarTitle({
					    title: this.info.title,
						
					})
				}
			        
			    },
			hidePayPopup() {
				this.isPayPopup = false
			},
			showSkuPopup() {
				this.$refs.detailPopup.open('bottom')
				// this.isShowDetail = true
			},
			hideSkuPopup() {
				this.$refs.detailPopup.close()
				// this.isShowDetail = false
			},
			// 点击购买
			buy(total) {
				
				if(this.istry){
					// 试玩模式
					if(total==0){
						
						uni.showToast({
							title: '试玩模式下无法全收',
							icon: 'none'
						})
						if (!this.isEnableBtn(total)) {
							return false
						}
						
					}else{
						if (!this.isEnableBtn(total)) {
							return false
						}
						this.payTotal = total
						this.isPayPopup = true
					}
					
					
				}else{
					if (!this.isEnableBtn(total)) {
						return false
					}
					this.payTotal = total
					this.isPayPopup = true
				}
				
				
			},
			showRoomPopup() {
				console.log('click ===')
				this.isRoomPopup = true
			},
			refreshRoom() {
				// this.showAnimate()
				// this.roomId = ''   // 删除roomid，使其随机
				uni.showLoading({
					title: '刷新中...'
				})
				this.initData().then(res => {
					uni.hideLoading()
					uni.showToast({
						title: '刷新完成~',
						icon: 'none'
					})
				})
			},
			changeRoom(room) {
				this.selectedRoom = room
				this.roomId = room.id
				this.isRoomPopup = false
				this.isRecordList = false
				this.$nextTick(() => (this.info.room.id=room.id,this.isRecordList = true))
				this.showAnimate()
				this.initData()
			},
			showAnimate() {
				this.startMoving = true
				setTimeout(() => {
					this.startMoving = false
				}, 300)
			},
			hideRoom() {
				this.isRoomPopup = false
			},
			paySuccess(order,istry = false) {
				if(istry){
					// 试玩模式
					this.isPayPopup = false
					uni.showToast({
						title: "支付成功, 抽赏中",
						icon: "none"
					})
					this.order = {}
					this.isOpenPopup = true
					console.log("试玩")
					console.log(this.isOpenPopup)
				}
				// 线上开盒流程
				this.isPayPopup = false
				uni.showToast({
					title: "支付成功, 抽赏中",
					icon: "none"
				})
				this.order = order
				this.isOpenPopup = true
			},
			goBack() {
				this.isOpenPopup = false
				this.istry=false
				this.initData()
			},
			up_next_fun(){
				this.up_next=!this.up_next
				console.log(this.up_next)
			},

		},
		onPageScroll(e) {}
	}
</script>

<style lang="scss" scoped>
	.scope-container {
		// padding-top: 150rpx;
		margin: 0;
		padding: 0;
		min-height: 100vh;
		box-sizing: border-box;
		background-color: #000000;
	}



	.top-c {
		width: 750rpx;
		height: 100;
		// border: 1px solid red;
		// position: absolute;
		position: relative;
		// top: 142rpx;
		// left: 92rpx;
		// border-radius: 10rpx;
		// margin: 400rpx auto 0rpx auto;
		overflow: hidden;

		box-shadow: 0px 20rpx 52rpx 0px rgba(143, 143, 143, 0.1);
		.thumb {
			width: 100%;
			height: 100%;
		}
		.swiper-scope {
			overflow: hidden;
			width: 100%;
			height: 100%;

			swiper-item {
				width: 100%;
				height: 100%;
			}

			
		}

		.float-price-c {
			background: rgba(0, 0, 0, 0.6);
			position: absolute;
			top: 0rpx;
			left: 0rpx;
			color: white;
			font-weight: 700;
			font-size: 26rpx;
			padding: 10rpx 30rpx;
			border-radius: 4rpx;
			// z-index: 100;

			.item {
				display: flex;
				justify-content: space-between;
			}

			.free-order {
				color: red;
			}
		}

		.bottom-c {
			background: url('@/static/activity/shadow.png');
			background-repeat: no-repeat;
			background-size: 110% auto;
			background-position: -10rpx bottom;
			width: 100%;
			height: 300rpx;
			// border: 1px solid red;
			position: absolute;
			bottom: 0rpx;
			left: 0rpx;
			pointer-events: none;
			display: flex;
			align-items: flex-end;
			justify-content: space-between;
			color: white;
			font-weight: 500;
			font-size: 26rpx;
			padding: 20rpx 20rpx;
			box-sizing: border-box;

			.yellow-font {
				color: #FFEA06;
			}
		}
	}

	.body {
		width: 100%;
		// height: 60vh;
		// border: 1px solid red;
		position: relative;

		.title-c {
			display: flex;
			justify-content: space-between;
			align-items: center;

			.all-stock {
				width: 280rpx;
			}

			.stock-c {
				margin-right: 26rpx;
				font-weight: 500;
				font-size: 32rpx;
			}
		}

		padding-bottom: 430rpx;

		.sku-list {
			overflow: hidden;
			// position: absolute;
			// left: 25rpx;
			// margin: 0rpx auto;
			// border: 1px solid red;
			// top: 466rpx;
			// border: 1px solid red;
			width: 726rpx;
			// height: 1000rpx;
			margin-left: 12rpx;

			// height: 50vh;
			// padding: 20rpx 0rpx;
			// box-sizing: border-box;
			.item {
				float: left;
				margin-left: 12rpx;
				// margin-bottom: 22rpx;
				margin-top: 22rpx;
				width: 166rpx;
				height: 380rpx;
				box-sizing: border-box;
				border: 1rpx solid #f1f1f1;
				border-radius: 12rpx;

				.thumb {
					position: relative;
					overflow: hidden;
					background: rgba(0, 0, 0, 0.5);
					border-radius: 12rpx;
					position: relative;

					// background: url('@/static/activity/shadow.png');
					// background-repeat: no-repeat;
					// background-size: 100% auto;
					// background-position: 0rpx bottom;

					image {
						width: 166rpx;
						height: 166rpx;
						height: 250rpx;
						border-radius: 10rpx;
						overflow: hidden;
						display: block;
					}

					

					.total {
						background: rgba(0, 0, 0, 0.5);
						border-radius: 6rpx;
						padding: 2rpx 10rpx;
						color: white;
						position: absolute;
						top: 10rpx;
						left: 0rpx;
						z-index: 100;
						font-size: 20rpx;
						font-weight: bold;
					}

					.shang-title {
						background: #FFD223;
						border-radius: 6rpx;
						padding: 2rpx 10rpx;
						color: white;
						position: absolute;
						bottom: 10rpx;
						right: 10rpx;
						z-index: 100;
						font-size: 20rpx;
						font-weight: bold;

						&.gift {
							background: #F15858;
						}
					}
				}

				.display-price {
					font-size: 22rpx;
					font-family: PingFang;
					font-weight: 500;
					// color: #000000;
					display: flex;
					// justify-content: space-between;
				}

				.title {
					font-size: 24rpx;
					font-family: PingFang;
					font-weight: bold;
					color: #000000;
					width: 166rpx;
					text-align: center;
					margin-top: 10rpx;

					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
				}
			}
		}
	}

	.footer-c {
		position: fixed;
		bottom: 0rpx;
		// border: 1px solid red;
		width: 100%;
		background: white;
		padding-bottom: 60rpx;
	}

	.small-btn-c {
		text-align: center;
		font-size: 24rpx;
		font-family: PingFang;
		font-weight: 500;
		color: #A67C1D;
		line-height: 40rpx;
		padding: 30rpx 120rpx 0rpx 120rpx;
		width: 700rpx;
		box-sizing: border-box;

		border-top: 1px solid #F3F3F5;

		margin: 0rpx auto 30rpx auto;

		display: flex;
		justify-content: space-around;

		.btn {
			height: 30rpx;
		}
	}

	.middle {
		display: flex;
		// align-items: center;
		// align-items: center;
		// justify-content: center;
		align-items: center;
		justify-content: center;
		z-index: 100;
		position: relative;
		padding: 0rpx 30rpx;

		.left-btn {
			width: 100rpx;
			flex: 0 100rpx;
			// flex: 1;
			height: 100rpx;
			// margin-left: 10rpx;
		}



		.long-btn {
			width: 580rpx;
			// flex: 1;
			height: 90rpx;
			line-height: 90rpx;
			position: relative;
			// border: 1px solid red;
			// display: flex;
			
			// font-weight: 500;
			font-size: 28rpx;
			text-align: center;
			
			.number {
				font-weight: 500;
				font-size: 40rpx;
				margin: 0rpx 10rpx;
			}
		}

		.right-btn {
			width: 100rpx;
			flex: 0 100rpx;
			// flex: 1;
			height: 100rpx;
			margin-left: 10rpx;
		}
	}

	.btn-c {
		width: 700rpx;
		margin: 20rpx auto 0rpx auto;
		// margin-top: 20rpx;
		display: flex;
		justify-content: space-between;

		.btn {
			width: 172rpx;
			flex: 0 0 172rpx;
		}
	}
	
	
	
	
//new css
.new-top-box{
	position: fixed;
	top: 0;
	background-image: linear-gradient(rgba(0,0,0,.8), rgba(0,0,0,.0) );
	z-index: 3;
	height: 25vh;
	width: 750rpx;
	.new-top-left{
		position: fixed;
		top: 0;
		left: 0;
		width: 150rpx;
		height: 100rpx;
		z-index: 3;
		.btn{
			width: 100%;
			height: 100%;
		}
	}
	.new-top-right{
		position: fixed;
		top: 15rpx;
		right: 0;
		width: 100rpx;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		z-index: 3;
		image{
			width: 100%;
			height: 80rpx;
			margin: 10rpx 0;
		}
		newcart{
			width: 220rpx;
			
		}
	}
}

.new-top-centre{
	position: fixed;
	top: 0rpx;
	right: 0;
	width: 750rpx;
	height: 110rpx;
	z-index: 2;
	image{
		width: 100%;
		height: 100%;
	}
	.newcart{
		
	}
}
.try_box{
		position: fixed;
		top: 150rpx;
		right: 0rpx;
		width: 155rpx;
		height: 77rpx;
		background: url("https://www.hebide.cc/newimages/MF.png");

		z-index: 99;
		background-size: 100%;
		
	}
.new-content{
	width: 750rpx;
	height: 80vh;
	.thumb{
		width: 100%;
		height: 100%;
	}
	z-index: 1;
}
	
	
.new-list-box{
	position: fixed;
	bottom: 0;
	width: 750rpx;
	height: 70vh;
	background-color: #000;
	z-index: 5;
	opacity: 1;
	transition: all .5s;
	
	.top-tab{
		margin: 0 auto;
		margin-top: -60rpx;
		width: 100%;
		height: 60rpx;
		position: relative;
		.newcart{
			position: absolute;
			left: 10rpx ;
			top: 10rpx;
			width: 180rpx;
			height: 100rpx;
			z-index: 15;
		}
		.refresh-btn {
			position: absolute;
			right: 10rpx ;
			top: 0rpx;
			width: 180rpx;
			height: 100rpx;
			z-index: 15;
		}
		.top-opo-box{
			position: absolute;
			top: -95rpx;
			left: calc(50% - 85rpx);
			width: 170rpx;
			height: 100rpx;
			padding-top: 25rpx;
			background: url('https://www.hebide.cc/newimages/newyi/top-opo.png')no-repeat;
			background-size: 100%;
			color:#000000;
			font-size: 24rpx;
			font-weight: 700;
			display: flex;
			justify-content: center;
			z-index: 16;
			pointer-events:none;
			// align-items: center;
		}
		image{
			width: 100%;
			height: 100%;
			transform:rotate(0deg);
			-ms-transform:rotate(0deg); /* Internet Explorer */
			-moz-transform:rotate(0deg); /* Firefox */
			-webkit-transform:rotate(0deg); /* Safari 和 Chrome */
			-o-transform:rotate(0deg); /* Opera */
			transition: all .5s;
		}
		.up_next{
			transform:rotate(180deg);
			-ms-transform:rotate(180deg); /* Internet Explorer */
			-moz-transform:rotate(180deg); /* Firefox */
			-webkit-transform:rotate(180deg); /* Safari 和 Chrome */
			-o-transform:rotate(180deg); /* Opera */
		}
		.top-tab-button{
			position: absolute;
			top: 20rpx;
			left: calc(50% - 90rpx);
			width: 40rpx;
			padding: 0 70rpx;
			height: 30rpx;
		}
	}
}	
.up_next_box{
	height: 470rpx;
}
.tab-box{
	position: relative;
	background-color: #000;
	z-index: 10;
	margin: 0 auto;

	.tab-flex{
		display: flex;
		flex-direction: row;
		justify-content: center;
		padding: 20rpx;
		view{
			background-color: #2e2e2e;
			color: #858585;
			padding:6rpx 15rpx;
			font-size: 32rpx;
		}
		.tab_selected{
			background-color: #f7b108;
			color: #FFFFFF;
		}
	}
}
	
.main-box{
	position: relative;
	background-color: #000;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding: 0 2.5%;
	z-index: 10;
	.up-box{
		width: 120rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.next-btn{
		width: 120rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.text-box{
		color: #FFF;
		display:flex;
		flex-direction: row;
		align-items: center;
		justify-self: center;
		text{
			display:flex;
			height: 50rpx;
			flex-direction: row;
			align-items: center;
			justify-self: center;
		}
		.number{
			color: #ff2c09;
			font-size: 34rpx;
			font-weight: 900;;
			padding-top: 3rpx;
			// letter-spacing: 2rpx;
		}
	}
}
.product-list{
	position: relative;
	z-index: 5;
	overflow: auto;
	height: 70vh;
	margin-top: -70rpx;
	.sku-list{
    display: flex;
	flex-wrap: wrap;
    flex-direction: row;
		padding-bottom: 500rpx;
		.item{
			
			width: 20%;
			margin:0 calc(2.5% - 2rpx);
			border: 1rpx solid #FFFFFF;
			min-height: 150rpx;
			.thumb{
				position: relative;
				width: 100%;
				height: 100%;
				image{
					width: 100%;
					height: 100%;
					max-height: 150rpx;
				}
				.total{
					position: absolute;
					top: 124rpx;
					left: 0;
					background-color: rgba(0, 0, 0, 0.5);
					color: #FFFFFF;
					padding: 0 5rpx;
					text-align: center;
					min-width:80rpx; ;
					font-size: 20rpx;

				}
				
				.sell-out-c {
					position: absolute;
					width: 100%;
					height: 100%;
					background: rgba(0, 0, 0, 0.5);
					display: flex;
					align-items: center;
					justify-content: center;
				
					.sell-out {
						width: 90rpx;
						height: 90rpx;
					}
				}
				
				
			}
			.title{
				overflow:hidden; 
				text-overflow:ellipsis;
				white-space: nowrap;
				color: #FFFFFF;
				font-size: 24rpx;
			}
			.display-price{
				color: #c5c5c5;
				font-size: 18rpx;
			}
		}
		
		
	}
}

.remaining_quantity_box{
	color:#000000;
	overflow: hidden;
	padding-top: 10rpx;
	padding-bottom: 500rpx;
}	
	
	
	
	
	
	
	

.new-footer-box{
	position: fixed;
	bottom: 0;
	right: 0;
	width: 750rpx;
	height: 330rpx;
	z-index: 9;
	opacity: 1;
	.new-footer-buttom{
		position: relative;
		width: 100%;
		height: 100%;
		image{
			width: 100%;
			height: 100%;
		}
		
	}
	
	
}	
.new-footer2-box{
	
	width: 100%;
	height: 330rpx;
	position: fixed;
	bottom: 0;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
	z-index: 10;
	.new-footer-buttom{
		width: 300rpx;
		button{
			width: 100%;
			height: 150rpx;
			opacity: 0;
		}
	}
	
}
.new-footer3-box{
	width: 100%;
	height: 100rpx;
	position: fixed;
	bottom: 180rpx;
	right: 0;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: flex-end;
	z-index: 12;
	
	image{
		margin: 0 2.5%;
		width: 25%;
		height: 100rpx;
	}
}
	
	
	
</style>
