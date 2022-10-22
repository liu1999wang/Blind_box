<template>
	<view class="container">
		<view class="header-tabs">
			<view class="tab-item" v-for="(item, index) in typeTextList" :class="{active:current==index}" :data-current="index" @tap="currentChange">
				<text class="text">
					{{item}}
					<template v-if="statusTotal[types[index]]">{{statusTotal[types[index]]}}</template>
				</text>
			</view>
		</view>
		<view class="swiper-wrapper">
			<swiper :current="current" @change="currentChange2">
				<swiper-item v-for="(item, index) in types" :key="index">
					<scroll-view scroll-y @scrolltolower="scrolltolower">
						<view class="order-list">
							<OrderItem  @check="checkItem(order)" :isSelectMode="isSelectMode" :isSelected="selectedIds.indexOf(order.id) > -1" v-for="order in dataList[index].list" :order="order" :key="order.uuid" @action="actions"></OrderItem>
							<view class="load-more margin-v" v-if="dataList[index].list.length < dataList[index].total">加载中...</view>
							<NoData v-if="dataList[index].init&&!dataList[index].list.length" tips="无订单"></NoData>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
		
		<!-- <view class="footer-c" v-if="current == 0 && !orderConfig.is_hide_deliver_btn">
			<button class="cancel-btn bg-cancel" v-if="isSelectMode" hover-class="hover" @tap="cancelSelect">取消选择</button>
			<button class="select-box-btn bg-orange" hover-class="hover" @tap="selectOrSubmit">
				<template v-if="!isSelectMode">
					选择盒子发货
				</template>
				<template v-else>
					确认提交发货 (已选{{selectedIds.length}}件)
				</template>
			</button>
			
		</view> -->

		<IActionSheet :visible="visible" @visibleChange="visibleChange" @change="cancelOrder" :list="reasons" title="选择理由"></IActionSheet>
	
		<PayCard v-if="isShowPay" :selectedId="selectedIds" @success="successDeliver" @cancel="isShowPay=false"></PayCard>
	
		<ReturnSalePopupOld @cancel="isShowReturnSalePopup = false" @refresh="refresh" :uuid="currentUuid" v-if="isShowReturnSalePopup"></ReturnSalePopupOld>
	</view>
</template>

<script>
	import OrderItem from "./components/OrderItem.vue";
	import IActionSheet from "../../components/ActionSheet/index.vue";
	import PayCard from "./components/PayCard.vue"
	import payment from "@/utils/payment.js"
	export default {
		components: {
			OrderItem,
			IActionSheet,
			PayCard
		},
		data() {
			return {
				order: {},
				reasons: [],
				visible: false,
				dataList: [],
				current: 0,
				currentUuid: '6056e83ef3251',
				types: ["pay_pending", "deliver_pending", "delivered", "all"],
				typeTextList: ['待付款', '待发货', '待收货', '全部'],
				isSelectMode: false,
				selectedIds: [],
				isShowPay: false,
				isShowReturnSalePopup: false,
				isRefresh: false,
				statusTotal: {}
			}
		},
		computed: {
			orderConfig() {
				return this.$store.getters.setting.order
			},
		},
		onLoad(e) {
			this.current = this.types.indexOf(e.status || 'pending')
			// this.initData()
			// this.getOrderList()
			this.initData()
			this.$api.emit('order.cancel_reason.list').then(res => {
				this.reasons = res.data.list
			})
			uni.$on('postCommentSuccess', res => {
				this.initData()
				this.getOrderList()
				console.log('postCommentSuccess')
			})
		},
		onShow () {
			this.refresh()
		},
		onUnload() {
			uni.$off('postCommentSuccess', data => {
				console.log('移除postCommentSuccess 自定义事件');
			})
		},
		methods: {
			initTotalData() {
				this.$http('/order-stat').then(res => {
					this.statusTotal = res.data.info
				})
			},
			successDeliver () {
				this.cancelSelect()
				this.current = 2
				this.refresh()
				this.isShowPay = false
				uni.showModal({
					title: '发货成功',
					content: '已成功提交发货请求，请注意查收快递哦~'
				})
			},
			cancelSelect() {
				this.isSelectMode = false
				this.selectedIds = []
			},
			selectOrSubmit() {
				if (!this.isSelectMode) {
					this.isSelectMode = true
				}
				else {
					if (this.selectedIds.length == 0) {
						uni.showModal({
							title: '请选择盒子',
							content: '选择一个或多个盒子后才能提交发货哦~'
						})
						return false
					}
					
					this.isShowPay = true
				}
			},
			checkItem(order) {
				let index = this.selectedIds.indexOf(order.id)
				if (index > -1) {
					this.selectedIds.splice(index, 1)
				}
				else {
					this.selectedIds.push(order.id)
				}
			},
			refresh() {
				this.isRefresh = true
				this.cleanData()
				this.getOrderList()
				
				this.initTotalData()
			},
			scrolltolower() {
				this.dataList[this.current].page++
				this.getOrderList()
			},
			initData() {
				let dataList = []
				this.types.forEach(item => {
					dataList.push({
						list: [],
						type: item,
						page: 1,
						per_page: 50,
						total: 0,
						init: false,
						loading: false
					})
				})
				this.dataList = dataList
			},
			cleanData() {
				this.dataList.forEach(item => {
					item.page = 1
					item.init = false 
				})
			},
			cancelOrder(e) {
				this.visibleChange()
				uni.showLoading({
					title: "加载中",
					mask: true
				})
				this.$api.emit('order.close', this.order.uuid).then(res => {
					let itemList = this.dataList[this.current]
					this.$api.emit('order.list', {
						status: itemList.type,
						page: 1,
						per_page: itemList.per_page
					}).then(res => {
						uni.hideLoading()
						this.initData()
						this.dataList[this.current].list.push(...res.data.list)
						this.dataList[this.current].total = res.data.item_total
						this.dataList[this.current].init = true
						uni.showToast({
							title: '已提交取消请求~',
							icon: 'none'
						})
					})
				}).catch(err => {
					uni.hideLoading()
				})
			},
			visibleChange() {
				this.visible = !this.visible
			},
			async payOrder(uuid) {
				uni.showLoading({
					mask: true
				})
				const res = await this.$api.emit('order.pay_config', uuid, {
					pay_type: 'wechat',
					sub_type: 'miniapp'
				})
				uni.hideLoading()

				payment.pay({
					pay_config: res.data.pay_config,
					success: () => {
						uni.showToast({
							title: "支付成功",
							icon: "none"
						})
						this.refresh()
					},
					faild: () => {
						uni.showToast({
							title: "支付失败",
							icon: "none"
						})
					}
				})
			},
			actions(e) {
				switch (e.action) {
					case '立即支付':
						this.payOrder(e.order.uuid)
						// uni.navigateTo({
						// 	url: '/pages/payCenter/index?uuid=' + e.order.uuid
						// })
						break;
					case '取消订单':
						this.order = e.order
						this.visibleChange()
						break;
					case '返售':
						this.currentUuid = e.order.uuid
						this.isShowReturnSalePopup = true
						break;
					case '删除订单':
						uni.showModal({
							title: "提示",
							content: "确认要删除订单吗?",
							success: res => {
								if (res.confirm) {
									uni.showLoading({
										title: '加载中',
										mask: true
									})
									this.$api.emit('order.destory', e.order.uuid).then(res => {
										this.initData()
										this.getOrderList()
									})
								}
							}
						})
						break;
					case '提醒发货':
						break;
					case '确认收货':
						uni.showModal({
							title: "提示",
							content: "订单确认收货?",
							success: res => {
								if (res.confirm) {
									uni.showLoading({
										title: '加载中',
										mask: true
									})
									this.$api.emit('order.complete', e.order.uuid).then(res => {
										uni.hideLoading()
										// uni.navigateTo({
										// 	url: '/pages/writeComment/index?uuid=' + e.order.uuid
										// })
										this.refresh()
									})
								}
							}
						})
						break;
					case '去评价':
						uni.navigateTo({
							url: '/pages/writeComment/index?uuid=' + e.order.uuid
						})
						break;
					case '核销码':
						uni.navigateTo({
							url: '/pages/orderCode/index?uuid=' + e.order.uuid
						})
						break;
					default:
						break;
				}
			},
			currentChange(e) {
				let index = e.currentTarget.dataset.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					console.log(itemList)
					if (!itemList.init) {
						this.getOrderList()
					}
				}
			},
			currentChange2(e) {
				let index = e.detail.current
				if (index !== this.current) {
					this.current = index
					let itemList = this.dataList[this.current]
					if (!itemList.init) {
						this.getOrderList()
					}
				}
			},
			getOrderList() {
				let itemList = this.dataList[this.current]
				if (itemList.loading) return
				// if (!itemList.init) {
				// 	uni.showLoading({
				// 		title: '加载中',
				// 		mask: true
				// 	})
				// }
				itemList.loading = true
				this.$api.emit('order.list', {
					status: itemList.type,
					page: itemList.page,
					per_page: itemList.per_page
				}).then(res => {
					// uni.hideLoading()
					itemList.loading = false
					
					if (res.data.current_page === 1) {
						itemList.list = res.data.list
					}
					else {
						itemList.list.push(...res.data.list)
					}
					
					itemList.total = res.data.item_total
					itemList.init = true
				})
			}
		}
	}
</script>

<style lang="scss">
	button {
		padding: 0;
		margin: 0;
		// margin-left: 20upx;
		// width: 150upx;
		// height: 50upx;
		line-height: 50upx;
		font-size: 24upx;
		border-radius: 1000px;
		position: relative;
	
		&.bg-white {
			box-shadow: 0 2upx 8upx #cfcfcf;
		}
	
		&:after {
			border: none;
		}
	}
	
	.footer-c {
		position: fixed;
		bottom: 30rpx;
		width: 100%;
		left: 0rpx;
		padding: 0rpx 30rpx;
		display: flex;
		box-sizing: border-box;
	}
	
	.select-box-btn {
		font-size: 28rpx;
		flex-grow: 1;
		padding: 20rpx 0rpx;
		text-align: center;
	}
	.cancel-btn {
		width: 200rpx;
		flex: 0 0 200rpx;
		margin-right: 30rpx;
		padding: 20rpx 0rpx;
		text-align: center;
	}
	
	.header-tabs {
		width: 100%;
		height: 90rpx;
		display: flex;
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10;
		background-color: #ffffff;
	
		.tab-item {
			flex: 1;
			line-height: 90rpx;
			text-align: center;
			font-size: 28rpx;
			color: rgba(198, 198, 198, 1);
			font-weight: 500;
	
			&.active {
				color: rgba(51, 51, 51, 1);
				position: relative;
				font-weight: 500;
	
				.text {
					border-bottom: 6rpx solid rgba(51, 51, 51, 1);
					padding: 0rpx 0rpx 4rpx 0rpx;
				}
	
				// &::after {
				// 	content: "";
				// 	position: absolute;
				// 	height: 2px;
				// 	left: 20rpx;
				// 	right: 20rpx;
				// 	bottom: 0;
				// 	background-color: #0E151D;
				// }
			}
		}
	}

	.swiper-wrapper {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		box-sizing: border-box;
		padding-top: 90rpx;
		background-color: white;

		swiper,
		scroll-view {
			width: 100%;
			height: 100%;

			.order-list {
				overflow: hidden;
				padding: 0rpx 30rpx 160rpx 30rpx;

				.load-more {
					height: 100rpx;
					text-align: center;
					line-height: 100rpx;
					font-size: 32rpx;
					color: #888;
				}
			}
		}
	}
</style>
